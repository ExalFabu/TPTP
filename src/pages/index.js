import React, { useEffect, useState } from 'react';
import { ChakraProvider, theme, SimpleGrid } from '@chakra-ui/react';
import LectureTable from '../components/LectureTable';
import Average from '../components/Average';
import Header from '../components/Header';
import PreferencesTab from '../components/PreferencesTab';
import { exactWidth } from '../theme';
import { urlToLectures } from '../components/CopyUrlButton';
import { LectureType } from '../components/Lecture';
const baseOptions = () => {
  return {
    removeCFU: true,
    cfu_value: 18,
    mat_value: 0,
    ptlode: 0.5,
    incorso: 2,
    erasmus: 1,
  };
};

const baseAverageBonus = averageBonus => {
  for (let i = 29; i >= 18; i--) {
    let val = 0;
    if (i >= 28) val = 6;
    else if (i >= 27) val = 5;
    else if (i >= 26) val = 3;
    else if (i >= 24) val = 3;
    else if (i >= 22) val = 2;
    const GE = '\u2265';
    averageBonus.push({
      id: `avBonus${i}`,
      from: i,
      to: i + 1 === 30 ? 31 : i + 1,
      eq: i,
      label: `${i + 1 === 30 ? '' : `${i + 1}>`}M${GE}${i}`,
      value: val,
    });
  }
  return averageBonus;
};

function App(props) {
  const [lectures, setLectures] = useState([new LectureType()]);
  const [options, setOptions] = useState(baseOptions());
  const [averageBonus, setAverageBonusState] = useState(baseAverageBonus([]));

  // Setting up default states (gathering from localstorage if needed)
  useEffect(() => {
    const defaultLectures =
      urlToLectures(window.location.search) ||
      JSON.parse(localStorage.getItem('lectures')) ||
      null;
    if (defaultLectures) {
      setLectures(defaultLectures);
    }
    const defaultOptions = JSON.parse(localStorage.getItem('options')) || null;
    if (defaultOptions) setOptions(defaultOptions);

    const defaultAverageBonus =
      JSON.parse(localStorage.getItem('averageBonus')) || null;
    if (defaultAverageBonus) {
      setAverageBonusState(defaultAverageBonus);
    }
  }, []);

  // Per salvare sul LocalStorage le eventuali materie di default
  // viene eseguito solo quando componentDidMount
  useEffect(() => {
    localStorage.setItem('lectures', JSON.stringify(lectures));
  }, [lectures]);
  useEffect(() => {
    localStorage.setItem('options', JSON.stringify(options));
  }, [options]);
  useEffect(() => {
    localStorage.setItem('averageBonus', JSON.stringify(averageBonus));
  }, [averageBonus]);

  return (
    <>
      <ChakraProvider theme={theme}>
        <SimpleGrid
          templateColumns={{
            base: `'${exactWidth}px'`,
          }}
          templateAreas={{
            base: `
                  "Header"
                  "LectureTable"
                  "Average"
                  "PreferencesTab"
                  `,
          }}
          justifyItems="center"
          alignItems="start"
          rowGap={2}
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
            maxH={{ base: '50vh', md: '60vh' }}
            overflowX="clip"
            css={{
              '&::-webkit-scrollbar': {
                width: '2px',
              },
              '&::-webkit-scrollbar-track': {
                width: '2px',
              },
              '&::-webkit-scrollbar-thumb': {
                background: '#888888FF',
                borderRadius: '20px',
              },
            }}
          />
          <Average
            gridArea="Average"
            allLectures={lectures}
            preferences={options}
            averageBonus={averageBonus}
            w={exactWidth}
          />
          <PreferencesTab
            gridArea="PreferencesTab"
            preferences={options}
            setPreferences={setOptions}
            averageBonus={averageBonus}
            setAverageBonusState={setAverageBonusState}
          />
        </SimpleGrid>
      </ChakraProvider>
    </>
  );
}

export default App;
