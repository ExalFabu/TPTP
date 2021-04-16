import React from 'react';
import {
  ChakraProvider,
  Box,
  Text,
  Link,
  VStack,
  Code,
  Grid,
  theme,
} from '@chakra-ui/react';
import { ColorModeSwitcher } from './ColorModeSwitcher';
import { Logo } from './Logo';
import Lecture from './components/Lecture';

let allLectures = [
  {
    name: 'Test1',
    cfu: 23,
    grade: 24,
  },
  {
    name: 'Test2',
    cfu: 23,
    grade: 24,
  },
  {
    name: 'Test3',
    cfu: 23,
    grade: 24,
  },
];

function App() {
  return (
    <ChakraProvider theme={theme}>
      <Box textAlign="center" fontSize="xl">
        <Grid minH="100vh" p={3}>
          <ColorModeSwitcher justifySelf="flex-end" />
          
        </Grid>
      </Box>
    </ChakraProvider>
  );
}

export default App;
