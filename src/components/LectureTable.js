import { SimpleGrid } from '@chakra-ui/layout';
import React from 'react';
import { borderColor } from '../theme';
import Lecture from './Lecture';

function LectureTable({ allLectures, setLectures, ...props}) {
  return (
      <SimpleGrid
        display="inline-block"
        border="1px"
        borderColor={borderColor}
        borderRadius="md"
        columns={1}
        rowGap={5}
        justifyItems="center"
        {...props}
      >
        {allLectures.map((el) => {
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
  );
}

export default LectureTable;
