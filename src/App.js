import React, { useState } from 'react';
import {
  ChakraProvider,
  theme,
  Container,
  Center,
  SimpleGrid,
  GridItem,
} from '@chakra-ui/react';

import { LectureType } from './components/Lecture';
import LectureTable from './components/LectureTable';
import Average from './components/Average';
import Header from './components/Header';
import OptionTab from './components/OptionTab';

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
    window.history.replaceState(null, null, '/');
    return lec_arr;
  }
  window.history.replaceState(null, null, '/');

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

  /** @type {Map} */
const baseOptions = {
  "cfu_or_mat": "cfu",
  "cfu_value": 18,
  "mat_value": 0,
  "ptlode": 0.5,
  "incorso": 2,
  "erasmus": 1,
}

const defaultOptions = JSON.parse(localStorage.getItem("options")) || baseOptions

function App() {
  let [lectures, setLecturesState] = useState(defaultLectures);
  let [options, setOptionsState] = useState(defaultOptions)

  // Funzione wrapper a setLecturesState così da salvare anche in LocalStorage ogni volta.
  const setLectures = l => {
    setLecturesState(l);
    localStorage.setItem('lectures', JSON.stringify(l));
  };

  const setOptions = (o) => {
    setOptionsState(o)
    localStorage.setItem('options', JSON.stringify(o))
  }

  return (
    <ChakraProvider theme={theme}>
        <SimpleGrid
          templateColumns={{
            base: "1fr",
            md: "repeat(2, 1fr)"
          }}
          templateAreas={{
            base: `
                  "Header"
                  "LectureTable"
                  "OptionsTab"
                  "Average"
                  `,
            md: ` "Header Header"
                  "LectureTable LectureTable"
                  "OptionsTab Average"
                  `,
          }}
          w="100%"
        >
          <Container gridArea="Header">
          <Header allLectures={lectures} setLectures={setLectures} />
          </Container>
          <Container gridArea="LectureTable" w="100%" alignContent="center">
            <LectureTable allLectures={lectures} setLectures={setLectures} />
          </Container>
          <Center gridArea="OptionsTab">
            <OptionTab options={options} setOptions={setOptions} />
          </Center>
          <Center gridArea="Average">
            <Average allLectures={lectures} options={options} />
          </Center>
      </SimpleGrid>
    </ChakraProvider>
  );
}

export default App;
