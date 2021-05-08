import { Flex, SimpleGrid } from '@chakra-ui/layout';
import React from 'react';
import AddLectureButton from './AddLectureButton';
import ColorModeSwitcher from './ColorModeSwitcher';
import CopyUrlButton from './CopyUrlButton';
import Logo from './Logo';

export default function Header({ allLectures, options, averageBonus, setLectures, ...props }) {
  return (
    <Flex {...props} my={2} w="100%" justifyContent="space-between" px={{md: 20}} alignItems="center">
      <Logo maxH="5em"/>
      <SimpleGrid columns={1} gap={2}>
        <ColorModeSwitcher />
        <CopyUrlButton allLectures={allLectures} options={options} averageBonus={averageBonus}/>
        <AddLectureButton 
             setLectures={setLectures} />
      </SimpleGrid>
    </Flex>
  );
}
