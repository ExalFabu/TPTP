import { Button } from '@chakra-ui/button';
import React from 'react';
import { Validator } from 'jsonschema';
import { LinkIcon } from '@chakra-ui/icons';
import { LectureType } from './Lecture';
import { toast, useToast } from '@chakra-ui/toast';

const PREFIX = '?l=';

const v = new Validator();

const lectureArray = {
  id: '/LectureArray',
  type: 'array',
  items: [
    {
      type: 'array',
      items: [
        {
          type: 'string',
        },
        {
          type: 'integer',
          minimum: 0,
        },
        {
          type: 'boolean',
        },
      ],
      additionalItems: false,
    },
  ],
};

export const lecturesToUrl = lectures => {
  const isEmpty = lecture => lecture.cfu === 0 && lecture.name === '';
  const nonEmptyLectures = lectures
    .filter(l => !isEmpty(l))
    .map(l => {
      return [l.name, l.cfu, l.caratt];
    });
  if (nonEmptyLectures.length === 0) return '';
  console.log(JSON.stringify(nonEmptyLectures));
  return '' + PREFIX + encodeURIComponent(JSON.stringify(nonEmptyLectures));
};

export function urlToLectures(url) {
  window.history.replaceState(null, null, '/');
  if (!url.startsWith(PREFIX)) return null;
  url = url.replace(PREFIX, '');
  let parsed = {};
  try {
    parsed = JSON.parse(decodeURIComponent(url));
  } catch {
    return null;
  }
  if (v.validate(parsed, lectureArray).valid) {
    return parsed.map(p => {
      return new LectureType(p[0], p[1], null, null, p[2], null);
    });
  } else {
    return null;
  }
}

const urlToClipboard = ({ allLectures, toast }) => {
  const basename = window.location.origin;
  const path = lecturesToUrl(allLectures);
  const url = basename + path;
  if (navigator.canShare) {
    navigator.share({
      title: 'TPTP',
      url: url,
      text:
        'TPTP - Calcola la tua media universitaria con le materie impostate da me!',
    });
  } else {
    navigator.clipboard.writeText(url);
    toast({
      title: 'URL Copiato',
      status: 'success',
      isClosable: true,
    });
  }
};

export default function CopyUrlButton({ allLectures }) {
  const toast = useToast();
  return (
    <Button
      variant="outline"
      fontSize="md"
      size="sm"
      leftIcon={<LinkIcon />}
      onClick={() => urlToClipboard({ allLectures, toast })}
    >
      Condividi Materie
    </Button>
  );
}
