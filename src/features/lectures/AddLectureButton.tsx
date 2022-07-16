import { Button } from '@chakra-ui/button';
import { AddIcon } from '@chakra-ui/icons';
import React, {Dispatch, SetStateAction} from 'react';
import { useAppDispatch } from '../../app/hooks';
import { addLecture } from './lectureDuck';

const AddLectureButton = () => {
  const dispatch = useAppDispatch();
  
  return (
    <Button
      variant="outline"
      size="sm"
      fontSize="md"
      leftIcon={<AddIcon />}
      onClick={() => dispatch(addLecture())}
    >
      Aggiungi Materia
    </Button>
  );
}

export default React.memo(AddLectureButton)