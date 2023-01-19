export type Author = {
  first_name: string;
  last_name: string;
  bio: string;
};

export type Item = {
  [id: string];
  id?: number;
  key: string;
  title: string;
  color?: string;
  secondary_color?: string;
};

export type Filters = {
  [key: string]: Set;
};

export type Genre = {
  [id: string];
  id: number;
  year_start: number;
  year_finish: number;
  influenced: Genre[];
  influenced_by: Genre[];
  themes: Item[];
  musical_features: Item[];
  instruments: Item[];
  tradition: Item;
};

export type Node = Genre & {
  // _sideBySideCount?: number;
  // _column?: number;
  _x0: number;
  _x1: number;
  _y0: number;
  _y1: number;
  _width: number;
  _height: number;
  _color: string;
  _xMidPoint: number;
  _yMidPoint: number;
  _halfWidth: number;
};

export type Link = {
  source: number;
  target: number;
  sourceNode: Node;
  targetNode: Node;
  type: string;
  d?: string;
  triangle?: string;
  strokeWidth?: number;
  rotate?: number;
};
