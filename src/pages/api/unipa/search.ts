import type { NextApiRequest, NextApiResponse } from 'next';

enum CourseType {
  '' = 'Tutti',
  L = 'Laurea',
  LM = 'Laurea magistrale',
  LMU = 'Laurea magistrale a ciclo unico',
  LS = 'Laurea specialistica',
  LSU = 'Laurea specialistica a ciclo unico',
}

export interface SearchResult {
  name: string;
  links: { name: string; url: string }[];
}

const SEARCH_URL =
  'https://offertaformativa.unipa.it/offweb/public/corso/ricercaSemplice.seam';

const generateOptions = (cookie: string, anno: number) =>
  ({
    method: 'POST',
    headers: {
      'User-Agent':
        'Mozilla/5.0 (X11; Linux x86_64; rv:102.0) Gecko/20100101 Firefox/102.0',
      Accept:
        'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
      'Accept-Language': 'it,en-US;q=0.7,en;q=0.3',
      'Accept-Encoding': 'gzip, deflate, br',
      Referer:
        'https://offertaformativa.unipa.it/offweb/public/corso/ricercaSemplice.seam',
      'Content-Type': 'application/x-www-form-urlencoded',
      Origin: 'https://offertaformativa.unipa.it',
      'Upgrade-Insecure-Requests': '1',
      'Sec-Fetch-Dest': 'document',
      'Sec-Fetch-Mode': 'navigate',
      'Sec-Fetch-Site': 'same-origin',
      Pragma: 'no-cache',
      'Cache-Control': 'no-cache',
      Cookie: cookie,
    },
    body: new URLSearchParams({
      frc: 'frc',
      'frc%3AannoDecorate%3Aanno': anno.toString(),
      'frc%3AtipoCorsoDecorate%3AidTipoCorso': ``,
      'frc%3AsuggestCorso': '',
      'frc%3Aj_id119_selection': '0',
      'javax.faces.ViewState': 'j_id1',
    }),
  } as RequestInit);

const parseResponse = ($: cheerio.Root): SearchResult[] => {
  const results = [] as SearchResult[];
  console.log($(".corso").first().children('* > a').length)

  $('.corso').each((_, elem) => {    
    const name = $(elem).children('.denominazione').first().text();
    const links = [] as { name: string; url: string }[];
    $(elem)
      .find('.sito > a, .sito > * > a')
      .each((_, link) => {
        links.push({ 
            name: $(link).text().trim(), 
            url: (($(link).attr('href') ?? '').match(/oidCurriculum=(\d{4,})/)?.at(1) ?? "" )
        });
      });
    results.push({
      name,
      links,
    });
  });
  return results;
};

const searchFromUnipa = async (req: NextApiRequest, res: NextApiResponse) => {
  const q = req.query
  if(q.anno === undefined ||  (q.anno instanceof Array) ) {
    res.status(400).json({error: "Inserisci l'anno di ricerca"})
    return
  }
  const anno = parseInt(q.anno)
  const cookie_getter = await fetch(SEARCH_URL);
  const _cookie_header = cookie_getter.headers.get('set-cookie');
  if (_cookie_header === null) {
    console.log('Nessun cookie, danno');
    res.status(500).send('Qualcosa è andato storto');
    return;
  }
  const response = await fetch(
    SEARCH_URL,
    generateOptions(_cookie_header, anno)
  );
  const body = await response.text();
  const cheerio = await import('cheerio');
  const $ = cheerio.load(body);
  if (!$('#app')) {
    res.status(500).send('Qualcosa è andato storto');
    return;
  }

  return res.status(200).setHeader("Cache-Control", `max-age=0, s-maxage=${(60 * 60 * 24) * 1}`).json(parseResponse($));
};

export const API_SEARCH_UNIPA_URL = "/api/unipa/search"

export default searchFromUnipa;
