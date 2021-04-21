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
import PreferencesTab from './components/PreferencesTab';
import { exactWidth } from './theme'

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

/** @type {import('./model/PreferencesType').Preferences} */
const baseOptions = {
  removeCFU: true,
  cfu_value: 18,
  mat_value: 0,
  ptlode: 0.5,
  incorso: 2,
  erasmus: 1,
};

const defaultOptions =
  JSON.parse(localStorage.getItem('options')) || baseOptions;

function App() {
  let [lectures, setLecturesState] = useState(defaultLectures);
  let [options, setOptionsState] = useState(defaultOptions);
  // Funzione wrapper a setLecturesState così da salvare anche in LocalStorage ogni volta.
  const setLectures = l => {
    setLecturesState(l);
    localStorage.setItem('lectures', JSON.stringify(l));
  };

  const setOptions = o => {
    setOptionsState(o);
    localStorage.setItem('options', JSON.stringify(o));
  };

  return (
    <ChakraProvider theme={theme}>
      <Center>
        <SimpleGrid
          templateColumns={{
            base: '1fr',
          }}
          templateAreas={{
            base: `
                  "Header"
                  "LectureTable"
                  "OptionsTab"
                  "Average"
                  `,
          }}
          w={exactWidth}
          justifyItems="center"
          alignItems="center"
          px={5}
          alignSelf="center"
        >
            <Header gridArea="Header" allLectures={lectures} setLectures={setLectures} />
          <Container
            gridArea="LectureTable"
            w={exactWidth}
            alignContent="center"
          >
            <LectureTable allLectures={lectures} setLectures={setLectures} />
          </Container>
          <Center gridArea="OptionsTab" w={exactWidth}>
            <PreferencesTab options={options} setOptions={setOptions} />
          </Center>
          <Center gridArea="Average">
            <Average allLectures={lectures} preferences={options} />
          </Center>
        </SimpleGrid>
      </Center>
    </ChakraProvider>
  );
}

export default App;
