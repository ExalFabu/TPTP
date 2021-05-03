import { Button } from '@chakra-ui/button';
import React, { useState } from 'react';
import { Validator } from 'jsonschema';
import { LinkIcon } from '@chakra-ui/icons';
import { LectureType } from './Lecture';
import { useToast } from '@chakra-ui/toast';

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
  fetch('/api/createUrl').then(v => {
    console.log(v);
  });

  if (nonEmptyLectures.length === 0) return '';
  return '' + PREFIX + encodeURIComponent(JSON.stringify(nonEmptyLectures));
};

export function urlToLectures(url) {
  if (typeof window !== undefined) {
    window.history.replaceState(null, '', '/');
  }
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

const shareLectures = ({ allLectures, toast, setLoading }) => {
  const isEmpty = lecture => lecture.cfu === 0 && lecture.name === '';

  const basename = window.location.origin;
  // const path = lecturesToUrl(allLectures);
  // const url = basename + path;
  setLoading(true);
  fetch('api/createUrl', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: 'TODO',
      lectures: allLectures
        .filter(l => !isEmpty(l))
        .map(l => {
          return [l.name, l.cfu, l.caratt];
        }),
    }),
  }).then(response => {
    if (response.status !== 200) {
      navigator.clipboard.writeText(basename + lecturesToUrl(allLectures));
      toast({
        title: 'URL Copiato',
        status: 'success',
        isClosable: true,
      });
    }
    response.json().then((value) => {
      setLoading(false);
      const url = basename + '/' + value.url;
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
    });
  });
};

export default function CopyUrlButton({ allLectures }) {
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  return (
    <Button
      variant="outline"
      fontSize="md"
      size="sm"
      leftIcon={<LinkIcon />}
      isLoading={loading}
      onClick={() => shareLectures({ allLectures, toast, setLoading })}
    >
      Condividi Materie
    </Button>
  );
}
