import {
  Flex,
  SimpleGrid,
} from '@chakra-ui/layout';
import React from 'react';
import AddLectureButton from './AddLectureButton';
import { ColorModeSwitcher } from './ColorModeSwitcher';
import { Logo } from './Logo';

export default function Header({ allLectures, setLectures, ...props}) {
  return (

      <Flex {...props} my={5} justifyContent="space-between">
        <Logo maxH="5em" />
        <SimpleGrid columns={1} gap={2} >
          <ColorModeSwitcher />
          <AddLectureButton
            allLectures={allLectures}
            setLectures={setLectures}
          />
        </SimpleGrid>
      </Flex>
  );
}
