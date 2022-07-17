import cheerio from 'cheerio';
import type { NextApiRequest, NextApiResponse } from 'next';
interface IExpectedBody {
  url?: string;
  oidCurriculum?: string;
}

interface UnipaLecture {
  curriculuminsegnamento: string;
  'curriculum-cfu': number;
  'curriculum-periodo': number;
  'curriculum-valutazione': string;
  'curriculum-ambito': string;
  'curriculum-ssd': string;
}

const VALID_KEYS = [
  'curriculum-insegnamento',
  'curriculum-cfu',
  'curriculum-periodo',
  'curriculum-valutazione',
  'curriculum-ssd',
] as const;
type ValidKeys = typeof VALID_KEYS[number];

const constructUrlFromOid = (oid: string) => {
  return `https://offertaformativa.unipa.it/offweb/public/corso/visualizzaCurriculum.seam?oidCurriculum=${oid}`;
};
const validateUrl = (url: string) => {
  return url.startsWith(
    'https://offertaformativa.unipa.it/offweb/public/corso/visualizzaCurriculum.seam?'
  );
};

// const isValidAttribute = (name : string) : name is keyof UnipaLecture => {
//     if(VALID_KEYS.includes(name)){
//         name = name.replaceAll("-", "")
//     }
// }

// const parseSingleAttribute = (attribute: cheerio.Cheerio) : { name: keyof UnipaLecture; value: UnipaLecture[keyof UnipaLecture] } => {
//     let attributeName = attribute.attr("class") ?? ""
//     if(!isValidAttribute(attributeName)){
//         return {} as { name: keyof UnipaLecture; value: UnipaLecture[keyof UnipaLecture] };
//     }
//     attributeName = attributeName.replaceAll("-", "") as keyof UnipaLecture
//     let children = attribute
//     while(children.children().length > 0) {children = children.children().first()}
//     let value = children.html() ?? ""
//   return {
//     name: attributeName,
//     value,
//   };
// };

interface PropertyGetter {
  value: string | number;
  isModulo?: boolean;
}

const descendTree = (root: cheerio.Cheerio) => {
  let children = root;
  while (children.children().length > 0) {
    children = children.children().first();
  } //$(attribute).children().length === 0 ? $(attribute).html() : $(attribute).children().first().html()
  return children;
};

const getLectureName = (
  row: cheerio.Cheerio,
  $: cheerio.Root
): PropertyGetter => {
  const td = row
    .children('.' + ('curriculum-insegnamento' as ValidKeys))
    .first();
  const isModulo = td.html()?.includes('curriculum-modulo');
  const value = descendTree(td).html() ?? '';
  return {
    value,
    isModulo,
  };
};

const getLectureCfu = (
  row: cheerio.Cheerio,
  $: cheerio.Root
): PropertyGetter => {
  const td = row.children('.' + ('curriculum-cfu' as ValidKeys)).first();
  const value = descendTree(td).html() ?? '0';
  return {
    value: new Number(value).valueOf(),
  };
};
const getLectureAmbito = (
  row: cheerio.Cheerio,
  $: cheerio.Root
): PropertyGetter => {
  const td = row.children('.' + ('curriculum-ambito' as ValidKeys)).first();
  const value = descendTree(td).html() ?? '';
  return {
    value,
  };
};

const getLectureValutazione = (
  row: cheerio.Cheerio,
  $: cheerio.Root
): PropertyGetter => {
  const td = row
    .children('.' + ('curriculum-valutazione' as ValidKeys))
    .first();
  const value = descendTree(td).html() ?? '';
  return {
    value,
  };
};

const parseSingleRow = (row: cheerio.Cheerio, $: cheerio.Root) => {
  function toTitleCase(s: string) {
    return s.replace(/([^\W_]+[^\s-\.]*) */g, function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  }
  const { value: nome, isModulo } = getLectureName(row, $);
  const { value: cfu } = getLectureCfu(row, $);
  const { value: ambito } = getLectureAmbito(row, $);
  const { value: valutazione } = getLectureValutazione(row, $);
  return {
    nome: toTitleCase(nome.toString().replace(/^\d* - /, '')),
    cfu,
    caratterizzante: ambito.toString().includes('B'),
    isModulo,
    toSkip: valutazione.toString() !== 'V',
  };
};

const fetchUrl = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.json({ text: 'Ciao' });
  }
  let urlToParse: string | undefined = undefined;
  const body = req.body as IExpectedBody;

  if (body.oidCurriculum !== undefined) {
    urlToParse = constructUrlFromOid(body.oidCurriculum);
  }
  if (body.url !== undefined && validateUrl(body.url)) {
    urlToParse = body.url;
  }
  if (urlToParse === undefined) {
    return res.status(400).json({ error: 'parametri non validi' });
  }

  const response = await fetch(urlToParse, {
    headers: {
      'Accept-Language': 'it',
    },
  });
  const mimeType = response.headers.get('Content-Type')?.split(';')[0];
  if (mimeType !== 'text/html') {
    return res.status(400).json({ error: 'risposta ricevuta non idonea' });
  }
  const html = await response.text();
  const $ = cheerio.load(html);

  const lectures: any[] = [];

  $('tr.odd, tr.even').each(function (this: string, lectureIndex) {
    const lecture = this;
    // parseSingleRow($(lecture), $);
    lectures.push(parseSingleRow($(lecture), $));
    // $(lecture)
    //   .children()
    //   .each(function (this: string, attributeIndex) {
    //     const attribute = this
    //     const key = ($(attribute).attr("class") ?? attributeIndex.toString()) as keyof UnipaLecture
    //     let children = $(attribute)
    //     while(children.children().length > 0){children=children.children().first()} //$(attribute).children().length === 0 ? $(attribute).html() : $(attribute).children().first().html()
    //     let value = children.html() ?? ""
    //     console.log(key, value)
    //     lectures[lectureIndex][key] = value
    //   });
  });

  return res.status(200).json({ mimeType, lectures });
};

export default fetchUrl;
