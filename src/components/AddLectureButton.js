import { Button } from '@chakra-ui/button';
import { AddIcon } from '@chakra-ui/icons';
import React from 'react';
import { LectureType } from './Lecture';

const AddLectureButton = ({ setLectures }) => {
  const addEmptyLecture = () => {
    setLectures((currentLectures ) => [...currentLectures, new LectureType()]);
  };
  return (
    <Button
      variant="outline"
      size="sm"
      fontSize="md"
      leftIcon={<AddIcon />}
      onClick={addEmptyLecture}
    >
      Aggiungi Materia
    </Button>
  );
}

export default React.memo(AddLectureButton)