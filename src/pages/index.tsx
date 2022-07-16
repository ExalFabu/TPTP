import {
  ChakraProvider, ColorModeScript, SimpleGrid,
  theme
} from '@chakra-ui/react';
import { useEffect } from 'react';
import { batch, Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { useAppDispatch } from '../app/hooks';
import { store, persistor } from '../app/store';
import Footer from '../common/Footer';
import Header from '../common/Header';
import Average from '../features/average/Average';
import { dangerouslySetAllOptions, IOptions } from '../features/average/averageDuck';
import { dangerouslySetAllLectures, ILecture } from '../features/lectures/lectureDuck';
import LectureTable from '../features/lectures/LectureTable';
import { dangerouslySetAllPreferences, IAverageBonus, IPreferences } from '../features/preferences/preferencesDuck';
import PreferencesTab from '../features/preferences/PreferencesTab';
import { exactWidth } from '../theme';



function TPTP() {
  const dispatch = useAppDispatch()
  useEffect(()=>{
    // Migrate from previous localStoage data
    const lectures = localStorage.getItem("lectures")
    const avBonus = localStorage.getItem("averageBonus")
    const pref = localStorage.getItem("options")
    const finalAverage = localStorage.getItem("finalAverage")
    if(lectures !== null && avBonus !== null && pref !== null && finalAverage !== null){
      localStorage.removeItem("lectures")
      localStorage.removeItem("averageBonus")
      localStorage.removeItem("options")
      localStorage.removeItem("finalAverage")
      const previousStoredLectures = (JSON.parse(lectures)) as ILecture[]
      const previousStoredAverageBonus = JSON.parse(avBonus) as IAverageBonus[]
      const previousStoredPreferences = JSON.parse(pref) as IPreferences
      previousStoredPreferences.averageBonus = previousStoredAverageBonus
      const previousStoredOptions = JSON.parse(finalAverage) as IOptions
      console.log("Migrating from previous version... this should happen only once")
      batch(() => {
        dispatch(dangerouslySetAllLectures(previousStoredLectures));
        dispatch(dangerouslySetAllOptions(previousStoredOptions));
        dispatch(dangerouslySetAllPreferences(previousStoredPreferences))
      })
    }
    
  }, [])
  return (
      <PersistGate persistor={persistor} loading={<span>Aspetta...</span>}>
        <ColorModeScript initialColorMode="system" />
        <ChakraProvider theme={theme}>
          <SimpleGrid
            templateAreas={{
              base: `
                  "Header"
                  "LectureTable"
                  "Average"
                  "PreferencesTab"
                  `,
              xl: `
                "Header Header"
                "LectureTable Average"
                "LectureTable PreferencesTab"
                `,
            }}
            justifyItems="center"
            alignItems="start"
            templateRows={{ xl: '120px 120px 1fr' }}
            rowGap={2}
            columnGap={2}
            justifyContent="center"
          >
            <Header gridArea="Header" w={exactWidth} />
            <LectureTable
              gridArea="LectureTable"
              w={exactWidth}
              overflowY="auto"
              maxH={{ base: '50vh', md: '60vh', xl: '75vh' }}
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
            <Average gridArea="Average" />
            <PreferencesTab gridArea="PreferencesTab" />
          </SimpleGrid>
          <Footer />
        </ChakraProvider>
      </PersistGate>
  );
}

export default TPTP;
