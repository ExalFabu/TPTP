import React, { useState } from 'react';
import { ChakraProvider, theme, SimpleGrid } from '@chakra-ui/react';
import LectureTable from './components/LectureTable';
import Average from './components/Average';
import Header from './components/Header';
import PreferencesTab from './components/PreferencesTab';
import { exactWidth } from './theme';
import { urlToLectures } from './components/CopyUrlButton';

// Default lectures are, in order
// 1. URL Parameters
// 2. LocalStorage
// 3. None

/** @type {import('./model/LectureType').Lecture[]} */
const defaultLectures =
  urlToLectures(window.location.search) ||
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

const defaultAverageBonus = [];
for (let i = 29; i >= 18; i--) {
  let val = 0;
  if (i >= 28) val = 6;
  else if (i >= 27) val = 5;
  else if (i >= 26) val = 3;
  else if (i >= 24) val = 3;
  else if (i >= 22) val = 2;
  const GE = '\u2265'
  defaultAverageBonus.push({
    id: `avBonus${i}`,
    from: i,
    to: i + 1 === 30 ? 31 : i + 1,
    eq: i,
    label: `${i + 1 === 30 ? '' : `${i+1}>`}M${GE}${i}`,
    value: val,
  });
}

function App() {
  let [lectures, setLecturesState] = useState(defaultLectures);
  let [options, setOptionsState] = useState(defaultOptions);
  const [averageBonus, setAverageBonusState] = useState(defaultAverageBonus);

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
      <SimpleGrid
        templateColumns={{
          base: '1fr',
        }}
        templateAreas={{
          base: `
                  "Header"
                  "LectureTable"
                  "Average"
                  "PreferencesTab"
                  `,
        }}
        // templateRows={{
        //   base: 'min-content 60% min-content min-content'
        // }}
        justifyItems="center"
        alignItems="center"
        rowGap={2}
        // px={5}
        alignSelf="center"
        justifyContent="center"
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
          overflowY="auto"
          css={{
            '&::-webkit-scrollbar': {
              width: '0px',
            },
            '&::-webkit-scrollbar-track': {
              width: '0px',
            },
          }}
          maxH="60vh"
        />
        <PreferencesTab
          gridArea="PreferencesTab"
          preferences={options}
          setPreferences={setOptions}
          averageBonus={averageBonus}
          setAverageBonusState={setAverageBonusState}
        />
        <Average
          gridArea="Average"
          allLectures={lectures}
          preferences={options}
          averageBonus={averageBonus}
          w={exactWidth}
        />
      </SimpleGrid>
    </ChakraProvider>
  );
}

export default App;
