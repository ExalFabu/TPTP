import {
  Center,
  Flex,
  SimpleGrid,
  Spacer,
} from '@chakra-ui/layout';
import React from 'react';
import AddLectureButton from './AddLectureButton';
import { ColorModeSwitcher } from './ColorModeSwitcher';
import { Logo } from './Logo';

export default function Header({ allLectures, setLectures }) {
  return (
    <Center
      w="100%"
      // as="div"
      // position="fixed"
      // backgroundColor="gray.500"

      top={0}
      // justifySelf="center"
    >
      <Flex width="100%" m={5} maxW="100%" alignItems="center">
        <Logo maxH="5em" />
        <Spacer />
        <SimpleGrid columns={1} gap={2} justifyItems="right">
          <ColorModeSwitcher />
          <AddLectureButton
            allLectures={allLectures}
            setLectures={setLectures}
          />
        </SimpleGrid>
      </Flex>
    </Center>
  );
}
