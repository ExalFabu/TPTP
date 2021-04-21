import React, { useState } from 'react';
import {
  ChakraProvider,
  theme,
  Center,
  SimpleGrid,
  Flex,
} from '@chakra-ui/react';
import { LectureType } from './components/Lecture';
import LectureTable from './components/LectureTable';
import Average from './components/Average';
import Header from './components/Header';
import PreferencesTab from './components/PreferencesTab';
import { exactWidth } from './theme';

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

/** @type {import('./model/LectureType').Lecture[]} */
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
  /**
   * @param {import('./model/LectureType').Lecture[]} l - Lecture list
   */
  const setLectures = l => {
    setLecturesState(l);
    localStorage.setItem('lectures', JSON.stringify(l));
  };

  /**
   * @param {import('./model/PreferencesType').Preferences} o
   */
  const setOptions = o => {
    setOptionsState(o);
    localStorage.setItem('options', JSON.stringify(o));
  };

  return (
    <ChakraProvider theme={theme}>
      <Flex justifyContent="center">
      <SimpleGrid
        templateColumns={{
          base: '1fr',
        }}
        templateAreas={{
          base: `
                  "Header"
                  "LectureTable"
                  "PreferencesTab"
                  "Average"
                  `,
        }}
        w={exactWidth}
        justifyItems="center"
        alignItems="center"
        rowGap={2}
        // px={5}
        alignSelf="center"
      >
        <Header
          gridArea="Header"
          allLectures={lectures}
          setLectures={setLectures}
          w={exactWidth}
        />
        <LectureTable
          gridArea="LectureTable"
          w={exactWidth}
          allLectures={lectures}
          setLectures={setLectures}
        />
        <PreferencesTab
          gridArea="PreferencesTab"
          preferences={options}
          setPreferences={setOptions}
        />
        <Center gridArea="Average">
          <Average allLectures={lectures} preferences={options} />
        </Center>
      </SimpleGrid>
      </Flex>
    </ChakraProvider>
  );
}

export default App;
