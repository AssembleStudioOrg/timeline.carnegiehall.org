import {
  CROSS_LINK_KEYS,
  DIRECT_LINK_KEYS,
  GRID_GAP,
  LINK_TRIANGLE_SIZE,
  MOBILE_NODE_WIDTH,
  NODE_GAP,
  NODE_WIDTH,
  YEAR_RANGE_KEY,
  YEAR_STEP
} from '$src/lib/consts';
import type { Filters, Link, Node } from '$types/data';
import { scaleLinear } from 'd3';
import groupBy from 'lodash/groupBy';
import map from 'lodash/map';
import sortBy from 'lodash/sortBy';

export type Year = {
  value: number;
  type: string;
  idx: number;
};

type Params = {
  data: any;
  minYear: number;
  maxYear: number;
  width: number;
  height: number;
  filters?: Filters;
  isMobile: boolean;
  showCrossLinks: boolean;
};

export const isDirectLink = (link: Link) =>
  Object.values(DIRECT_LINK_KEYS).includes(link.type);
export const isCrossLink = (link: Link) =>
  Object.values(CROSS_LINK_KEYS).includes(link.type);

function computeNodes(data: any, maxYear: number, filters?: Filters) {
  const rawNodes: Node[] = [];
  data.map((d: Node) => {
    d._filterOut = false;
    if (filters) {
      Object.keys(filters).map((k) => {
        if (k === YEAR_RANGE_KEY) {
          const [fromYear, toYear] = filters[k];
          if (d.year_start < fromYear || d.year_finish > toYear) {
            d._filterOut = true;
          }
        }

        k in d &&
          d[k].map((v: any) => {
            // filter out
            if (filters[k].has(v.title)) {
              d._filterOut = true;
            }
          });
      });
    }

    if (d.year_finish > maxYear) {
      d.year_finish = maxYear; // adjust max finish year to current year
    }
    d._color = d.tradition.secondary_color!;
    rawNodes.push(d);
  });

  return groupBy(rawNodes, 'tradition.key');
}

/**
 * Compute the count of nodes side by side.
 * @param nodes
 */
function computeNodesColumn(nodes: Node[]) {
  // create a array to store the height of each column
  // the height = maximum value of `year_finish` of the node in current column, e.g. node._y0
  const columns: number[] = [];

  let p = 0;
  map(nodes, (node, i) => {
    if (i === 0) {
      columns.push(node._y0);
      node._column = 0;
    } else {
      let needNewColumn = true;
      for (let j = 0; j < columns.length; ++j) {
        // if current can join the exist column
        if (node._y1 < columns[j] - NODE_GAP) {
          p += 1;
          columns[j] = node._y0;
          node._column = j;
          needNewColumn = false;
          break;
        }
      }
      if (needNewColumn) {
        columns.push(node._y0);
        node._column = columns.length - 1;
      }
    }
  });

  return columns.length;
}

/**
 * compute node's y0 y1
 * @param nodes
 * @param param
 * @returns
 */
function computeNodesYAxis(
  nodes: Node[],
  { minYear, maxYear, height }: Params
) {
  const yScale = scaleLinear()
    .domain([minYear, maxYear + YEAR_STEP / 2])
    .range([height, 0]);

  map(nodes, (node, i) => {
    node._y0 = yScale(node.year_finish);
    node._y1 = yScale(node.year_start);
    node._yMidPoint = (node._y0 + node._y1) / 2;
    node._height = Math.abs(node._y1 - node._y0);
  });

  return nodes;
}

/**
 * Compute the nodes position in sankey layout. eg. xy axis position for nodes
 *  like svg rect coordinates
 *     (x0, y0) ---- (x1, y0)
 *         |             |
 *         |             |
 *         |             |
 *         |             |
 *     (x0, y1) ---- (x1, y1)
 * @param rawNodes
 * @param columns
 * @param grids how many grids
 * @param grid  which grid, one tradition one grid
 * @param width
 * @param height
 */
function computeNodesXAxis(
  nodes: Node[],
  columns: number,
  grids: number,
  grid: number,
  { width, isMobile }: Params
) {
  const gridWidth = width / grids;
  const columnWidth = (gridWidth - GRID_GAP) / columns; // width of each column
  const nodeWidth = isMobile ? MOBILE_NODE_WIDTH : NODE_WIDTH;

  map(nodes, (node, i) => {
    node._xMidPoint =
      columnWidth * node._column +
      columnWidth / 2 +
      grid * (gridWidth + GRID_GAP / 2);
    node._x0 = node._xMidPoint - nodeWidth / 2;
    node._x1 = node._xMidPoint + nodeWidth / 2;
    node._width = nodeWidth;
    node._halfWidth = nodeWidth / 2;
  });

  return nodes;
}

function computeLinks(nodes: Node[]) {
  const links: Link[] = [];
  const linksSet = new Set();
  const nodesMap = new Map(nodes.map((node) => [node.id, node]));

  /**
   * push link to links
   * @param type link type
   * @param node
   * @param sourceBy
   * @param targetBy
   */
  function pushLinks(type: string, node: Node, direction: string) {
    if (type in node) {
      map(node[type], (linkedNode) => {
        const source = direction == 'source' ? node.id : linkedNode.id;
        const target = direction == 'target' ? node.id : linkedNode.id;
        const targetNode = nodesMap.get(target);
        if (!linksSet.has(`${source}-${target}`)) {
          links.push({
            source,
            target,
            type,
            sourceNode: direction == 'source' ? node : targetNode!,
            targetNode: direction == 'target' ? node : targetNode!
          });
          linksSet.add(`${source}-${target}`);
        }
      });
    }
  }

  map(nodes, (node) => {
    pushLinks(DIRECT_LINK_KEYS.source, node, 'source');
    pushLinks(DIRECT_LINK_KEYS.target, node, 'target');
    pushLinks(CROSS_LINK_KEYS.source, node, 'source');
    pushLinks(CROSS_LINK_KEYS.target, node, 'target');
  });

  return links;
}

function computeLinksPosition(nodes: Node[], links: Link[], showCrossLinks: boolean) {
  const nodesMap = new Map(nodes.map((node) => [node.id, node]));

  map(links, (l) => {
    const { source: sourceNodeId, target: targetNodeId } = l;
    const s = nodesMap.get(sourceNodeId); // source node
    const t = nodesMap.get(targetNodeId); // target node

    if (isDirectLink(l) && s && t) {
      const controlNodeYAxis = (t!._y1 + s!._y0) / 2;

      /**
       * thickness not consistent
       */
      // l.d = `M ${t?._x0} ${t?._y1}
      //        C ${t?._x0} ${controlNodeYAxis}, ${s?._x0} ${controlNodeYAxis}
      //        , ${s?._x0} ${s?._y0}
      //        L ${s?._x1} ${s?._y0}
      //        C ${s?._x1} ${controlNodeYAxis}, ${t?._x1} ${controlNodeYAxis}
      //        , ${t?._x1} ${t?._y1}
      //        Z`;

      /** thickness consistent */
      l.d = `M ${t?._xMidPoint} ${t?._y1}
             C ${t?._xMidPoint} ${controlNodeYAxis}, ${s?._xMidPoint} ${controlNodeYAxis}
             , ${s?._xMidPoint} ${s?._y0}`;
      l.strokeWidth = s?._width;
    }

    if (showCrossLinks && isCrossLink(l) && s && t) {
      const controlNode = {
        x: (s!._xMidPoint + t!._xMidPoint) / 2,
        y: t?._yMidPoint
      };
      l.d = `M ${s?._xMidPoint} ${s?._yMidPoint}
             Q ${controlNode.x} ${controlNode.y}
             , ${t?._xMidPoint} ${t?._yMidPoint}`;

      /**
       * all tangent == 0, because target's y axis == control node's y axis
       */
      // const tan = Math.atan2(
      //   Math.abs(t?._yMidPoint - controlNode.y),
      //   Math.abs(t?._xMidPoint - controlNode.x)
      // );

      const longSide = Math.cos(Math.PI / 3) * LINK_TRIANGLE_SIZE;
      const shortSide = Math.sin(Math.PI / 6) * LINK_TRIANGLE_SIZE;

      /**
       * just check the x axis
       */
      const direction = controlNode.x > t!._xMidPoint ? 'left' : 'right';
      if (direction === 'left') {
        l.triangle = `${t!._xMidPoint - longSide}, ${t?._yMidPoint} ${
          t!._xMidPoint + shortSide
        }, ${t!._yMidPoint + longSide} ${t!._xMidPoint + shortSide}, ${
          t!._yMidPoint - longSide
        }`;
      } else {
        l.triangle = `${t!._xMidPoint + longSide}, ${t?._yMidPoint} ${
          t!._xMidPoint - shortSide
        }, ${t!._yMidPoint + longSide} ${t!._xMidPoint - shortSide}, ${
          t!._yMidPoint - longSide
        }`;
      }

      // l.rotate =
      // (Math.atan2(
      //   Math.abs(t!._yMidPoint - s!._yMidPoint),
      //   Math.abs(s!._xMidPoint - t!._xMidPoint)
      // ) *
      //   180) /
      // Math.PI - 60;
    }
  });

  return links;
}

export function transformToGraph(params: Params) {
  const { data, maxYear, filters, showCrossLinks } = params;

  // data quality check
  if (!data || !data.length) {
    console.error('no data');
    return { nodes: [], links: [], crossLinks: [] };
  }

  // compute nodes, clean nodes data
  const nodesGroupByTradition = computeNodes(data, maxYear, filters);
  const traditions = Object.keys(nodesGroupByTradition);
  traditions.sort();

  let nodes: Node[] = [];
  traditions.map((t, i) => {
    let tnodes = sortBy(nodesGroupByTradition[t], ['year_start']); // temp nodes of each tradition
    computeNodesYAxis(tnodes, params);
    const columns = computeNodesColumn(tnodes);
    computeNodesXAxis(tnodes, columns, traditions.length, i, params);
    nodes = nodes.concat(tnodes);
  });

  // compute links
  let links = computeLinks(nodes);
  links = computeLinksPosition(nodes, links, showCrossLinks);

  return { nodes, links };
}
