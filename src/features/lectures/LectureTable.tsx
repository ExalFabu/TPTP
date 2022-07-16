import { SimpleGrid, SimpleGridProps } from '@chakra-ui/layout';
import React from 'react';
import { useSelector } from 'react-redux';
import { borderColor } from '../../theme';
import Lecture from './Lecture';
import { selectLectures } from './lectureSlice';

function LectureTable(props: SimpleGridProps) {

  const lectures = useSelector(selectLectures)

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
      {lectures.map(lecture => {
        return (
          <Lecture
            key={lecture._id}
            lecture={lecture}
          />
        );
      })}
    </SimpleGrid>
  );
}

export default LectureTable;
