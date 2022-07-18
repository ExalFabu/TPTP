import cheerio from 'cheerio';
import type { NextApiRequest, NextApiResponse } from 'next';
import {
  createEmptyLecture,
  ILecture
} from '../../features/lectures/lectureDuck';
interface IExpectedBody {
  url?: string;
  oidCurriculum?: string;
}

interface LectureDraft {
  nome: string;
  cfu: number;
  ambito: string;
  isModulo: boolean;
  valutazione: string;
  isOpzionale: boolean;
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

interface PropertyGetter {
  value: string | number;
  isModulo?: boolean;
  isOpzionale?: boolean;
}

const descendTree = (root: cheerio.Cheerio) => {
  let children = root;
  while (children.children().length > 0) {
    children = children.children().first();
  }
  return children;
};

const getLectureName = (
  row: cheerio.Cheerio,
  $: cheerio.Root
): PropertyGetter => {
  function toTitleCase(s: string) {
    let titled = s.replace(/([^\W_]+[^\s-\.]*) */g, function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
    titled.match(/i{2,}/i)?.forEach(match => {
      titled = titled.replace(match, match.toUpperCase());
    });
    // titled = titled.replaceAll("Ii", "II") // Non guardate questo abominio...
    // titled = titled.replaceAll("IIi", "III") // non ho voglia o tempo di provare le regex giuste
    return titled;
  }
  const td = row
    .children('.' + ('curriculum-insegnamento' as ValidKeys))
    .first();
  const isModulo = td.html()?.includes('curriculum-modulo');
  const isOpzionale =
    row.parent().parent().attr('id')?.includes('Gruppo') ?? false;
  const value = descendTree(td).html() ?? '';
  return {
    value: toTitleCase(value.replace(/^\d* - /, '')),
    isModulo,
    isOpzionale,
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
    value: value ?? '',
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

const parseSingleRow = (
  row: cheerio.Cheerio,
  $: cheerio.Root
): LectureDraft => {
  const { value: nome, isModulo, isOpzionale } = getLectureName(row, $);
  const { value: cfu } = getLectureCfu(row, $);
  const { value: ambito } = getLectureAmbito(row, $);
  const { value: valutazione } = getLectureValutazione(row, $);

  return {
    nome: nome.toString(),
    cfu: cfu as number,
    ambito: ambito.toString(),
    isModulo: isModulo ?? false,
    valutazione: valutazione.toString(),
    isOpzionale: isOpzionale ?? false,
  };
};

interface IFetchFromUnipaResponse {
  name: string,
  subname: string,
  year: string,
  url: string
  lectures: ILecture[],
  optional: ILecture[],
  dubious: ILecture[]
}

const getCdSProperties = (
  $: cheerio.Root
): { name: string; subname: string; year: string } => {
  const removeJunk = (
    text: string,
    otherJunk: Array<string | RegExp> = []
  ): string => {
    const junkToRemove: Array<string | RegExp> = [
      'Corso di studi in ',
      /\(Codice ?\d* ?\)/i,
      'Descrizione Curriculum\\Profilo: ',
      ...otherJunk,
    ];
    for (const junk of junkToRemove) {
      text = text.replace(junk, '');
    }
    return text.trim();
  };
  const cdsSubname = removeJunk($('.curriculum-descrizione').text());
  const cdsName = removeJunk($('h3.capolettera').text(), [cdsSubname]);
  const year = $('.curriculum-field-value').first().text();
  return {
    name: cdsName,
    subname: cdsSubname,
    year,
  };
};

const convertDraftToFinal = (draft: LectureDraft[]) => {
  const lectures = [] as ILecture[];
  const optional = [] as ILecture[];
  const dubious = [] as ILecture[];
  draft.forEach((single, idx, arr) => {
    if (single.isModulo) return;
    if (single.valutazione !== 'V') return;
    if (single.ambito == '') {
      for (let j = idx + 1; arr[j].isModulo; j++) {
        single.ambito += '$' + arr[j].ambito;
      }
    }
    let converted = createEmptyLecture();

    converted = {
      ...converted,
      cfu: single.cfu,
      name: single.nome,
      caratt: single.ambito.includes('B'),
    };
    if (!single.isOpzionale) lectures.push(converted);
    else optional.push(converted);
    const ambitiDeiModuli = single.ambito.split('$').filter(v => v !== '');
    if (
      (ambitiDeiModuli.includes('B') && ambitiDeiModuli.some(v => v !== 'B')) ||
      (ambitiDeiModuli.length === 1 &&
        converted.caratt &&
        single.ambito !== 'B')
    ) {
      // qualche modulo è caratterizzante e qualcuno no OPPURE ha un ambito che ha la lettera B ma non solo (e.g. "A, B")
      dubious.push(converted);
    }
  });
  return {
    lectures,
    optional,
    dubious,
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
  const mimeType = response.headers.get('Content-Type') ?? '';
  if (!mimeType.includes('text/html') && response.status !== 200) {
    return res.status(400).json({ error: 'risposta ricevuta non idonea' });
  }
  const html = await response.text();
  const $ = cheerio.load(html);
  const draft: LectureDraft[] = [];

  $('tr.odd, tr.even').each(function (this: string) {
    const lecture = this;
    draft.push(parseSingleRow($(lecture), $));
  });

  const apiResponse : IFetchFromUnipaResponse = {
    url: urlToParse,
    ...getCdSProperties($),
    ...convertDraftToFinal(draft),
  }

  return res.status(200).setHeader("Cache-Control", `max-age=0, s-maxage=${(60 * 60 * 24) * 2}`).json(apiResponse);
  
};

export default fetchUrl;
