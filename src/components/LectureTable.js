import { Button } from '@chakra-ui/button';
import { AddIcon } from '@chakra-ui/icons';
import { Center, Container, Grid, Text } from '@chakra-ui/layout';
import React from 'react';
import Lecture, { LectureType } from './Lecture';

function LectureTable({ allLectures, setLectures }) {
  const addEmptyLecture = () => {
    const newLectures = [...allLectures, new LectureType()];
    setLectures(newLectures);
  };

  
  return (
    <Container maxW="100%" alignContent="center">
      {/* <Grid templateColumns="auto auto" columnGap={100}>
        
      </Grid> */}
      <Grid
        templateColumns="minmax(max-content, 2fr) repeat(5, min-content)"
        columnGap={5}
        rowGap={2}
      >
        <>
          <Center><Text>Nome Materia</Text></Center>
          <Center><Text>CFU</Text></Center>
          <Center><Text>Voto</Text></Center>
          <Center><Text>Lode</Text></Center>
          <Center><Text>Caratterizzante</Text></Center>

          <Center><Text>Rimuovi</Text></Center>
        </>
        {allLectures.map(el => {
          return (
            // <Tr key={el._id} backgroundColor={el.isRemoved ? "red.600" : "auto"}>
            <Lecture
              allLectures={allLectures}
              setLectures={setLectures}
              lecture={el}
            />
            // </Tr>
          );
        })}
        <Button leftIcon={<AddIcon />} onClick={addEmptyLecture}>
          Aggiungi Materia
        </Button>
      </Grid>
    </Container>
  );
}

export default LectureTable;
