import wdk from 'wikidata-sdk';
import { httpfetch } from './utils';
import encodeurl from 'encodeurl';

export async function wikidata(CHID: string) {
  const url = wdk.sparqlQuery(`
  SELECT DISTINCT ?item WHERE {
    ?item p:P4104 ?statement0.
    ?statement0 (ps:P4104) "${CHID}".
  }
  LIMIT 1
  `),
    entity = await httpfetch(url)
      .then((r) => r.json())
      .then((r) => r.results.bindings[0])
      .then((data) => data?.item.value.split('/').pop());

  if (!entity) {
    throw new Error('No wikidata entity');
  }

  const entityUrl = wdk.getEntities({
      ids: entity,
      language: 'en',
      sites: 'enwiki'
    }),
    data = await httpfetch(entityUrl)
      .then((r) => r.json())
      .then(wdk.parse.wb.entities)
      .then((r) => r[entity]);

  if (!data) {
    throw new Error('No wikidata data');
  }

  const { sitelinks, claims } = data,
    { query: wikipedia } = await httpfetch(
      `https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro&explaintext&redirects=1&origin=*&titles=${encodeURIComponent(
        data.sitelinks.enwiki
      )}`
    ).then((r) => r.json());

  return {
    wikipedia: {
      url: wdk.getSitelinkUrl('enwiki', sitelinks.enwiki) || '',
      summary: (Object.values(wikipedia.pages)[0] as any).extract || ''
    },
    image:
      (claims.P18 && encodeurl(wdk.getImageUrl(claims.P18[0])))
        .replace(/[!',()*]/g, (c: string) => '%' + c.charCodeAt(0).toString(16))
        .replaceAll('%20', '_') || '',
    website: (claims.P856 && claims.P856[0]) || '',
    appleMusic: claims.P2850
      ? `https://music.apple.com/artist/${claims.P2850[0]}`
      : '',
    musicBrainz: claims.P434
      ? `https://musicbrainz.org/artist/${claims.P434[0]}`
      : ''
  };
}
