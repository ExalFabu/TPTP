import React, { useEffect, useState } from 'react';
import { ChakraProvider, theme, SimpleGrid } from '@chakra-ui/react';
import LectureTable from '../components/LectureTable';
import Average from '../components/Average';
import Header from '../components/Header';
import PreferencesTab from '../components/PreferencesTab';
import { exactWidth } from '../theme';
import { LectureType } from '../components/Lecture';
import Head from 'next/head';

export const baseOptions = () => {
  return {
    removeCFU: true,
    cfu_value: 18,
    mat_value: 0,
    ptlode: 0.5,
    incorso: 2,
    erasmus: 1,
  };
};

export const baseAverageBonus = averageBonus => {
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
    if(props.name) {
      window.history.replaceState({}, null, "/")
    }
    const defaultLectures =
      props.lectures || JSON.parse(localStorage.getItem('lectures')) || null;
    if (defaultLectures) {
      setLectures(defaultLectures);
    }

    const defaultOptions =
      props.options || JSON.parse(localStorage.getItem('options')) || null;
    if (defaultOptions) setOptions(defaultOptions);

    const defaultAverageBonus =
      props.averageBonus ||
      JSON.parse(localStorage.getItem('averageBonus')) ||
      null;
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
      <Head>
        <title>
          {props.name !== undefined ? `TPTP - ${props.name}` : 'TPTP'}
        </title>
        <meta
          property="og:title"
          content={props.name !== undefined ? `TPTP - ${props.name}` : 'TPTP'}
          key="og:title"
        />
        <meta
          property="og:description"
          content={
            props.name !== undefined
              ? `Calcola la tua media universitaria con le materie di '${props.name}'`
              : 'Calcola la tua media universitaria'
          }
          key="og:description"
        />

        <meta
          property="twitter:title"
          content={props.name !== undefined ? `TPTP - ${props.name}` : 'TPTP'}
          key="twitter:title"
        />
        <meta
          property="twitter:description"
          content={
            props.name !== undefined
              ? `Calcola la tua media universitaria con le materie di '${props.name}'`
              : 'Calcola la tua media universitaria'
          }
          key="twitter:description"
        />
        <meta />
      </Head>
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
            options={options}
            averageBonus={averageBonus}
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

export async function getServerSideProps(context) {
  const protocol = context.req.headers['x-forwarded-proto'] || 'http';
  const baseUrl = context.req
    ? `${protocol}://${context.req.headers.host}`
    : '';

  const { id } = context.query;
  if (id === undefined) return { props: {} };
  console.log('ssring');
  const response = await fetch(baseUrl + '/api/fetchUrl', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      id: id,
    }),
  });
  if (response.status === 200) {
    console.log('request succesfull');
    const j = await response.json();
    // console.log(j.)
    const { lectures, name, options, averageBonus } = j;
    // console.log(lectures);
    return {
      props: {
        lectures: lectures.map(elem => {
          console.log(elem);
          return JSON.parse(
            JSON.stringify(
              new LectureType(elem[0], elem[1], null, null, elem[2])
            )
          );
        }),
        name: name,
        options: options,
        averageBonus: averageBonus,
      },
    };
  }
  console.log(response);
  return { props: {} };
}

export default App;
