import {
  ChakraProvider, ColorModeScript, SimpleGrid,
  theme
} from '@chakra-ui/react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '../app/store';
import Footer from '../common/Footer';
import Header from '../common/Header';
import Average from '../features/average/Average';
import LectureTable from '../features/lectures/LectureTable';
import PreferencesTab from '../features/preferences/PreferencesTab';
import { exactWidth } from '../theme';



function App({ ...props }) {

  return (
    <Provider store={store}>
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
    </Provider>
  );
}

export default App;
