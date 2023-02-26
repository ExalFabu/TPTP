import type { NextApiRequest, NextApiResponse } from 'next';
import {
  createEmptyLecture,
  ILecture
} from '../../../features/lectures/lectureDuck';
import { PolitoLanguage } from './search';

export type PolitoLecture = ILecture & {
  codice: string;
  isMandatory: boolean;
  language: PolitoLanguage;
  isPreChecked: boolean;
  ambito: string;
  periodo: "1" | "2" | "1,2"
  groupBy: string;
}


interface isOppureRow { isOppureRow: true; }

interface toSkip { toSkip: true; }

type LectureDraft = PolitoLecture | isOppureRow | toSkip;

interface ApiErrorResponse {
  error: string;
}

export interface Pathway {
  name: string;
  lectures: ILecture[];
}

interface ApiSuccessResponse {
  pathways: Pathway[];
}

export type FetchFromPolitoResponse = ApiSuccessResponse | ApiErrorResponse;

const parseRow = ($: cheerio.Root, elem: cheerio.Element, isMandatory: boolean, tableName: string): LectureDraft => {
  const rowValues = [] as string[];
    $(elem).children("td").each((_, cell) => {
    rowValues.push($(cell).text().trim());
  });
  if(rowValues.length === 0) {
    return { toSkip: true };
  }
  if(rowValues[0] === "Periodo")
    return { toSkip: true };
  if(rowValues[3] === undefined) {
    return { isOppureRow: true };
  }
  const languageUrl: string = $(elem).children("* img").attr("src") ?? "" as string;
  const lecture = createEmptyLecture() as PolitoLecture;
  lecture.periodo = rowValues[0] as "1" | "2" | "1,2";
  lecture.ambito = rowValues[2];
  lecture.name = rowValues[3];
  lecture.cfu = parseInt(rowValues[5]);
  lecture.language = languageUrl.match(/en\.png$/) !== null ? PolitoLanguage.l_en : PolitoLanguage.l_it;
  lecture.isMandatory = isMandatory;
  lecture.isPreChecked = isMandatory;
  lecture.caratt = false;
  lecture.groupBy = tableName;
  lecture.codice = rowValues[1];
  return lecture;
}

const parseTable = ($: cheerio.Root, elem: cheerio.Element): PolitoLecture[] => {
  const tableId = $(elem).parent().attr("id")
  const tableName = ($(`[data-target="#${tableId}"]`).html() ?? "").trim();
  const isMandatory : boolean = tableName.match(/^[0-9]..anno$/) !== null;
  let lectures = [] as LectureDraft[];
  $(elem).children("tbody").children("tr").each((_, row) => {
    lectures.push(parseRow($, row, isMandatory, tableName));  
  });
  lectures = lectures.filter((lecture) => !("toSkip" in lecture));
  const filteredLectures = lectures.filter(i => true) as LectureDraft[];
  lectures.forEach((lecture, index) => {
    if("isOppureRow" in lecture) {
      (filteredLectures[index - 1] as PolitoLecture).isPreChecked = false;
      (filteredLectures[index + 1] as PolitoLecture).isPreChecked = false;
    }    
  });
  return filteredLectures.filter((lecture) => !("isOppureRow" in lecture) && ("ambito" in lecture && lecture.ambito !== "")) as PolitoLecture[];
}

const parsePathway = ($: cheerio.Root, elem: cheerio.Element) => {
  const pathway = {} as Pathway;
  pathway.name = $(elem).text().trim();
  const id = "#" + (($(elem).attr("href") ?? "#").split("#")[1]);
  const pathwayTables = $(`${id} > * table`);
  pathway.lectures = [];
  pathwayTables.each((_, table) => {
    pathway.lectures = pathway.lectures.concat(parseTable($, table));
  });

  return pathway
}

function isValidUrl(url: string) {
  try {
    new URL(url);
    return true;
  } catch (err) {
    return false;
  }
}

const changeYear = (url: string, year: number) => {
  return url.replace(/p_a_acc=[0-9]{4}/, `p_coorte=${year}`);
}
const fetchUrl = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    return res.json({ text: 'Ciao' });
  }
  let urlToParse: string | undefined = undefined;
  if (!req.query.url) {
    return res.status(400).json({ error: 'url non fornito' });
  }
  if (!req.query.year || isNaN(parseInt(req.query.year as string))) {
    return res.status(400).json({ error: 'anno non fornito' });
  }
  urlToParse = req.query.url + "/piano-di-studi" as string;

  const response = await fetch(urlToParse, {
    headers: {
      'Accept-Language': 'it',
    },
  });
  const mimeType = response.headers.get('Content-Type') ?? '';
  if (!mimeType.includes('text/html') && response.status !== 200) {
    return res.status(400).json({ error: 'risposta ricevuta non idonea' });
  }
  const cheerio = await import("cheerio")
  const html = await response.text();
  let $ = cheerio.load(html);
  const realUrlToParse = $("[aria-label='Piano di studi completo']").attr("href")?.trim() ;
  if (!realUrlToParse  || !isValidUrl(realUrlToParse)) {
    return res.status(400).json({ error: 'url non valido' });
  }
   
  const realHtml = await fetch(changeYear(realUrlToParse, parseInt(req.query.year as string) + 1),
        {headers: {"Content-Type": "text/html; charset=UTF-8", "Accept-Language": "it"}}
      )
      .then(response => response.arrayBuffer())
      .then(buffer => {
          let decoder = new TextDecoder("Windows-1252")
          let text = decoder.decode(buffer)
          return text;
        })
      .catch(error => console.error(error));
  if(!realHtml) {
    return res.status(400).json({ error: 'url non valido' });
  }
  $ = cheerio.load(realHtml);
  if(!$("#main-content")){
    return res.status(400).json({ error: 'url non valido' });
  }
  const pathways = [] as Pathway[];
  $(".accordion-toggle").each((_, elem) => {
    pathways.push(parsePathway($, elem));
  });

  

  const apiResponse : FetchFromPolitoResponse = pathways.length > 0 ? { pathways } : { error: 'nessun percorso trovato' };

  return res.status(200).setHeader("Cache-Control", `max-age=0, s-maxage=${(60 * 60 * 24) * 2}`).json(apiResponse);
  
};

export const API_FETCH_POLITO_URL = "/api/polito/fetch"

export default fetchUrl;
