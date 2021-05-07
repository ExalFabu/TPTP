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
        {allLectures.map((lecture) => {
          return (
            <Lecture
              key={lecture._id}
              setLectures={setLectures}
              lecture={lecture}
            />
          );
        })}
      </SimpleGrid>
  );
}

export default React.memo(LectureTable);
