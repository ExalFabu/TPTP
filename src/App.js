import React, { useState } from 'react';
import {
  ChakraProvider,
  theme,
  Container,
  Heading,
  Center,
  Grid,
  Button,
} from '@chakra-ui/react';

import { ColorModeSwitcher } from './ColorModeSwitcher';
import { LectureType } from './components/Lecture';
import LectureTable from './components/LectureTable';
import Average from './components/Average';
import { LinkIcon } from '@chakra-ui/icons';

const checkUrlParams = urlLocation => {
  if (
    urlLocation.search !== '' &&
    urlLocation.search.startsWith('?lectures=')
  ) {
    /** @type {String} */
    let str = urlLocation.search;
    const l = decodeURIComponent(str.replace('?lectures=', ''));
    let lec_arr = [];
    try {
      let raw_lec_arr = JSON.parse(l);
      raw_lec_arr.forEach(({ name, cfu, grade, lode, caratt, isRemoved }) => {
        lec_arr.push(
          new LectureType(name, cfu, grade, lode, caratt, isRemoved)
        );
      });
    } catch (e) {
      console.error('Errore nel parsing della URL', e);
      return null;
    }
    console.log(`Using url lectures`);
    window.history.replaceState(null, null, "/");
    return lec_arr;
  }
  window.history.replaceState(null, null, "/");

  return null;
};

// Default lectures are, in order
// 1. URL Parameters
// 2. LocalStorage
// 3. None
const defaultLectures =
  checkUrlParams(window.location) ||
  JSON.parse(localStorage.getItem('lectures')) ||
  [];

  const urlToClipboard = (allLectures) => {
    const basename = window.location.origin;
    const path = '?lectures=' + encodeURIComponent(JSON.stringify(allLectures));
    const url = basename + path;
    navigator.clipboard.writeText(url);
    // window.history.replaceState(null, null, path);
  };

function App() {

  let [lectures, setLecturesState] = useState(defaultLectures);

  

  // Funzione wrapper a setLecturesState così da salvare anche in LocalStorage ogni volta.
  const setLectures = l => {
    setLecturesState(l);
    localStorage.setItem('lectures', JSON.stringify(l));
  };

  return (
    <ChakraProvider theme={theme}>
      <Grid row={1} templateColumns="auto 1em">
        <Center>
          <Heading>TPTP</Heading>
        </Center>
        <ColorModeSwitcher justifySelf="flex-end" />
      </Grid>
      <Container>
      <Button leftIcon={<LinkIcon />} onClick={() => urlToClipboard(lectures)}>
          Copia URL
        </Button>
      </Container>
      <Container maxW="100%" alignContent="center" mt="15px">
        <LectureTable
          key={0}
          allLectures={lectures}
          setLectures={setLectures}
        />
      </Container>
      <Center>
        <Average allLectures={lectures} setLectures={setLectures} />
      </Center>
    </ChakraProvider>
  );
}

export default App;
