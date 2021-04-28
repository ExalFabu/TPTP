import { Button } from '@chakra-ui/button';
import { AddIcon } from '@chakra-ui/icons';
import React from 'react';
import { LectureType } from './Lecture';

export default function AddLectureButton({ allLectures, setLectures }) {
  const addEmptyLecture = () => {
    const newLectures = [...allLectures, new LectureType()];
    setLectures(newLectures);
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
