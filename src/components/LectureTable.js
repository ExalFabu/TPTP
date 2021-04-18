import { Container,SimpleGrid } from '@chakra-ui/layout';
import React from 'react';
import Lecture from './Lecture';

function LectureTable({ allLectures, setLectures }) {
  return (
    <Container maxW="100%" alignContent="center" >
      <SimpleGrid columns={1} rowGap={5} justifyItems="center">
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
    </Container>
  );
}

export default LectureTable;
