import React, { useState } from 'react';
import {
  ChakraProvider,
  theme,
  Container,
  Heading,
  Center,
  Grid,
} from '@chakra-ui/react';

import { ColorModeSwitcher } from './ColorModeSwitcher';
import { LectureType } from './components/Lecture';
import LectureTable from './components/LectureTable';
import Average from './components/Average';

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
const defaultLectures =
  checkUrlParams(window.location) ||
  JSON.parse(localStorage.getItem('lectures')) ||
  [];

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
      <Container maxW="100%" alignContent="center">
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
