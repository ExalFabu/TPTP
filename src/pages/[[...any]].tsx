import {
  Center, Container, Progress
} from '@chakra-ui/react';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor } from '../app/store';
import TPTP from '../app/TPTP';
import Logo from '../common/Logo';

const LoadingProgress: React.FC = () => (
  <Container
  id={"LoadingPage"}
  paddingTop={"40%"}
  maxWidth={"60%"}
  >
    <Center><Logo/></Center>
    <Progress isIndeterminate color='green.300' mt={"2em"} size={"xs"} />
  </Container>)

function App() {
  return (
      <PersistGate persistor={persistor} loading={<LoadingProgress />}>
        <TPTP />
      </PersistGate>
  );
}

export default App;
