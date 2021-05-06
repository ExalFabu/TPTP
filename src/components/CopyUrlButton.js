import { Button } from '@chakra-ui/button';
import React, { useEffect, useState } from 'react';
// import { Validator } from 'jsonschema';
import { CopyIcon, LinkIcon } from '@chakra-ui/icons';
// import { LectureType } from './Lecture';
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
import { Input } from '@chakra-ui/input';
import { Box, Text } from '@chakra-ui/layout';
import { FaShareAlt } from 'react-icons/fa';

const createUrl = async ({ lectures, options, averageBonus, name }) => {
  const isEmpty = lecture => lecture.cfu === 0 && lecture.name === '';
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
    // const url = basename + '/' + value.url;
    return value.url;
  } catch (e) {
    return null;
  }
};
const shareUrl = async ({
  lectures,
  options,
  averageBonus,
  toast,
  name,
  sb: { shareButton, setShareButton },
  ui: { urlId, setUrlId },
}) => {
  setShareButton({ ...shareButton, loading: true });
  const id =
    urlId ||
    (await createUrl({
      lectures,
      options,
      averageBonus,
      name,
    }));
  setShareButton({ ...shareButton, loading: false });
  if (id === null || id === undefined) {
    toast({
      title: 'Qualcosa è andato storto',
      status: 'error',
      isClosable: true,
      position: 'top',
    });
    return;
  }
  setUrlId(id);
  window.history.replaceState({}, '', `/${id}`);
  document.title = `TPTP - ${name}`;
  navigator.share({
    title: `TPTP - ${name}`,
    url: window.location.origin + '/' + id,
    text: `TPTP - Calcola la tua media universitaria con le materie di ${name}!`,
  });
};

const urlToClipboard = async ({
  lectures,
  options,
  averageBonus,
  toast,
  name,
  cb: { copyButton, setCopyButton },
  ui: { urlId, setUrlId },
}) => {
  setCopyButton({ ...copyButton, loading: true });
  const id =
    urlId ||
    (await createUrl({
      lectures,
      options,
      averageBonus,
      name,
    }));
  setCopyButton({ ...copyButton, loading: false });
  if (id === null || id === undefined) {
    toast({
      title: 'Qualcosa è andato storto',
      status: 'error',
      isClosable: true,
      position: 'top',
    });
    return;
  }
  setUrlId(id);
  window.history.replaceState({}, '', `/${id}`);
  document.title = `TPTP - ${name}`;
  navigator.clipboard.writeText(window.location.origin + '/' + id);
  toast({
    title: 'URL Copiato',
    status: 'success',
    isClosable: true,
    position: 'top',
  });
};

export default function CopyUrlButton({ allLectures, options, averageBonus }) {
  const [urlId, setUrlId] = useState('');
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

  // Se cambiano le lezioni / opzioni / averageBonus / nome allora sono costretto a rigenerare l'id
  useEffect(() => {
    setUrlId('');
    console.log(`refreshed url ${urlId}`);
  }, [allLectures, options, averageBonus, name]);

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
              mb={2}
            />
            <Text textColor="gray" fontSize="sm">
              Il link che genererai scadrà dopo 14 giorni di inutilizzo.
              Tranquillo, tutto resterà comunque salvato nel tuo dispositivo
            </Text>
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
                  sb: { shareButton, setShareButton },
                  ui: { urlId, setUrlId },
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
                  cb: { copyButton, setCopyButton },
                  ui: { urlId, setUrlId },
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
