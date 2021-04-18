import { Center, SimpleGrid } from '@chakra-ui/layout';
import React from 'react';
import Lecture from './Lecture';

function LectureTable({ allLectures, setLectures }) {
  return (
    <Center>
      <SimpleGrid
        display="inline-block"
        border="1px"
        borderColor="gray.500"
        borderRadius="lg"
        columns={1}
        rowGap={5}
        justifyItems="center"
      >
        {allLectures.map(el => {
          return (
            <Lecture
              key={el._id}
              allLectures={allLectures}
              setLectures={setLectures}
              lecture={el}
            />
          );
        })}
      </SimpleGrid>
    </Center>
  );
}

export default LectureTable;
