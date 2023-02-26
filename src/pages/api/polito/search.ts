import { html } from 'cheerio';
import type { NextApiRequest, NextApiResponse } from 'next';

export enum CourseType {
  LT = 'Laurea Triennale',
  LM = 'Laurea Magistrale',
}

export const enum PolitoLanguage {
  'l_it' = 'it-IT',
  'l_en' = 'en-GB',
}



export interface PolitoSearchResult {
  name: string;
  link: string;
  lang: PolitoLanguage[];
}

const SEARCH_URL : {[key in CourseType]: string} = {
  [CourseType.LT]: 'https://www.polito.it/didattica/corsi-di-laurea',
  [CourseType.LM]: 'https://www.polito.it/didattica/corsi-di-laurea-magistrale',
} as const;

const parseResponse = ($: cheerio.Root /*, sc: typeof import ('string-comparison'), q: string*/): PolitoSearchResult[] => {
  const results = [] as PolitoSearchResult[];

  $('.pol-courses--item').each((_, elem) => {
    const name = $(elem).children('.pol-courses--item-name').children().first().text().trim();
    const link = $(elem).children('.pol-courses--item-name').children().first().attr('href') ?? '';
    const attrs = ($(elem).attr("data-filters") ?? "").split(" ");
    if(name === "" || link === "" || attrs.length === 0) {
      return;
    }
    let lang = [] as PolitoLanguage[];
    if(attrs.includes("l_it" as keyof typeof PolitoLanguage)) lang.push(PolitoLanguage.l_it);
    if(attrs.includes("l_en" as keyof typeof PolitoLanguage)) lang.push(PolitoLanguage.l_en);
    results.push({
      name,
      link,
      lang,
    });
  });
  // const ratedResults: (PolitoSearchResult & {rating: number})[] = sc.levenshtein.sortMatch(q, results.map(item => item.name)).map(item => {
  //   return {
  //     ...results[item.index],
  //     rating: item.rating,
  //   } as (PolitoSearchResult & {rating: number})
  // });
  //return ratedResults.filter(item => item.rating >= 0.2).reverse() as PolitoSearchResult[];
  return results;
}

const searchFromPolito = async (req: NextApiRequest, res: NextApiResponse) => {
  const q = req.query;
  if(q.tipo === undefined || q.tipo instanceof Array || (q.tipo !== CourseType.LT && q.tipo !== CourseType.LM)) {
    res.status(400).json({ error: "Inserisci il tipo di corso" });
    return;
  }
  // if(q.name === undefined || q.name instanceof Array) {
  //   res.status(400).json({ error: "Inserisci il nome del corso" });
  //   return;
  // }
  const tipo = q.tipo as CourseType;
  const response = await fetch(SEARCH_URL[tipo]);
  const body = await response.text();
  const cheerio = await import('cheerio');
  const sc = await import('string-comparison');
  const $ = cheerio.load(body);
  if (!$('.pol-table')) {
    return res.status(500).json({ error: 'Qualcosa è andato storto' });
  }
  return res
    .status(200)
    .setHeader('Cache-Control', `max-age=0, s-maxage=${60 * 60 * 24 * 1}`)
    .json(parseResponse($/*, sc, q.name as string */));
};

export const API_SEARCH_POLITO_URL = '/api/polito/search';

export default searchFromPolito;
