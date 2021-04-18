import { Button, IconButton } from '@chakra-ui/button';
import { AddIcon } from '@chakra-ui/icons';
import { useBreakpointValue } from '@chakra-ui/media-query';
import React from 'react';
import { LectureType } from './Lecture';

export default function AddLectureButton({ allLectures, setLectures }) {
  const addEmptyLecture = () => {
    const newLectures = [...allLectures, new LectureType()];
    setLectures(newLectures);
  };
  const format = useBreakpointValue({ base: 'base', sm: 'sm' });

  return format === 'base' ? (
    <IconButton
      variant="outline"
      size="sm"
      icon={<AddIcon />}
      onClick={addEmptyLecture}
    />
  ) : (
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
