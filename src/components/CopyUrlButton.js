import { Button } from '@chakra-ui/button';
import React, { useState } from 'react';
import { Validator } from 'jsonschema';
import { CopyIcon, LinkIcon } from '@chakra-ui/icons';
import { LectureType } from './Lecture';
import { useToast } from '@chakra-ui/toast';
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/modal';
import { useDisclosure } from '@chakra-ui/hooks';
import { Input, InputGroup } from '@chakra-ui/input';
import { Text } from '@chakra-ui/layout';
import { FaShareAlt, FaWindows } from 'react-icons/fa';

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

const createUrl = async ({ lectures, options, averageBonus, name }) => {
  const isEmpty = lecture => lecture.cfu === 0 && lecture.name === '';
  const basename = window.location.origin;
  const response = await fetch('api/createUrl', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: name,
      lectures: lectures
        .filter(l => !isEmpty(l))
        .map(l => {
          return [l.name, l.cfu, l.caratt];
        }),
      options: options,
      averageBonus: averageBonus,
    }),
  });
  if (response.status !== 200) {
    return null;
  }
  try {
    const value = await response.json();
    const url = basename + '/' + value.url;
    return { url: url, id: value.url };
  } catch (e) {
    console.log(response.status);
    return null;
  }
};
const shareUrl = async ({
  lectures,
  options,
  averageBonus,
  toast,
  name,
  shareButton,
  setShareButton,
}) => {
  setShareButton({ ...shareButton, loading: true });
  const { url, id } = await createUrl({
    lectures,
    options,
    averageBonus,
    name,
  });
  console.log(`${url} ${id}`);
  if (url === null || url === undefined) {
    setShareButton({ ...shareButton, loading: false });
    toast({
      title: 'Qualcosa è andato storto',
      status: 'error',
      isClosable: true,
      position: 'top',
    });
    return;
  }
  window.history.replaceState({ name: name }, `TPTP - ${name}`, `/${id}`);
  setShareButton({ disabled: true, text: 'Copiato', loading: false });
  navigator.share({
    title: `TPTP - ${name}`,
    url: url,
    text: `TPTP - Calcola la tua media universitaria con le materie di ${name}!`,
  });
};

const urlToClipboard = async ({
  lectures,
  options,
  averageBonus,
  toast,
  name,
  copyButton,
  setCopyButton,
}) => {
  setCopyButton({ ...copyButton, loading: true });
  const { url } = await createUrl({
    lectures,
    options,
    averageBonus,
    name,
  });
  if (url === null || url === undefined) {
    setCopyButton({ ...copyButton, loading: false });
    toast({
      title: 'Qualcosa è andato storto',
      status: 'error',
      isClosable: true,
      position: 'top',
    });
    return;
  }
  navigator.clipboard.writeText(url);
  setCopyButton({ disabled: true, text: 'Copiato', loading: false });
  toast({
    title: 'URL Copiato',
    status: 'success',
    isClosable: true,
    position: 'top',
  });
};

export default function CopyUrlButton({ allLectures, options, averageBonus }) {
  const [shareButton, setShareButton] = useState({
    loading: false,
    disabled: false,
    text: 'Condividi',
  });
  const [copyButton, setCopyButton] = useState({
    loading: false,
    disabled: false,
    text: 'Copia URL',
  });
  const [name, setName] = useState('');
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Button
        variant="outline"
        fontSize="md"
        size="sm"
        leftIcon={<LinkIcon />}
        onClick={onOpen}
      >
        Condividi Materie
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Condividi le Materie</ModalHeader>
          <ModalCloseButton />
          <ModalBody fontSize="sm">
            <Text fontSize="lg" as="label" for="urlName">
              Corso di Studi
            </Text>
            <br />
            <Input
              name="urlName"
              id="urlName"
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </ModalBody>

          <ModalFooter>
            <Button
              leftIcon={<FaShareAlt />}
              isDisabled={name === '' || name === null || shareButton.disabled}
              isLoading={shareButton.loading}
              variant="solid"
              size="sm"
              mx={2}
              display={navigator.canShare ? 'inherit' : 'none'}
              onClick={() =>
                shareUrl({
                  lectures: allLectures,
                  options,
                  averageBonus,
                  toast,
                  name,
                  shareButton,
                  setShareButton,
                })
              }
            >
              {shareButton.text}
            </Button>
            <Button
              leftIcon={<CopyIcon />}
              isLoading={copyButton.loading}
              isDisabled={name === '' || name === null || copyButton.disabled}
              variant="solid"
              size="sm"
              mx={2}
              onClick={() => {
                urlToClipboard({
                  lectures: allLectures,
                  options,
                  averageBonus,
                  toast,
                  name,
                  copyButton,
                  setCopyButton,
                });
              }}
            >
              {copyButton.text}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
