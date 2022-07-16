import {
  Center,
  ChakraProvider, ColorModeScript, Container, Progress, theme
} from '@chakra-ui/react';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor } from '../app/store';
import TPTP from '../app/TPTP';
import Logo from '../common/Logo';

const LoadingProgress: React.FC = () => (
  <Container
  id={"LoadingPage"}
  paddingTop={"40%"}
  width={"30%"}
  >
    <Center><Logo/></Center>
    <Progress isIndeterminate color='green.300' size={"xs"} />
  </Container>)

function App() {
  return (
    <ChakraProvider theme={theme}>
      <PersistGate persistor={persistor} loading={<LoadingProgress />}>
        <ColorModeScript initialColorMode="system" />
        <TPTP />
      </PersistGate>
    </ChakraProvider>
  );
}

export default App;
