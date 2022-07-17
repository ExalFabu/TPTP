import {
  Center, Container, Progress
} from '@chakra-ui/react';
import React, { Suspense } from 'react';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor } from '../app/store';
import Logo from '../common/Logo';

const TPTP = React.lazy(() => import('../app/TPTP'));

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
        <Suspense fallback={<LoadingProgress />}>
        <TPTP />
        </Suspense>
      </PersistGate>
  );
}

export default App;
