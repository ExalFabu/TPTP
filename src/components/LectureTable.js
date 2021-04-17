import { Button } from '@chakra-ui/button';
import { AddIcon, LinkIcon } from '@chakra-ui/icons';
import { Container, Grid, Text } from '@chakra-ui/layout';
import React from 'react';
import Lecture, { LectureType } from './Lecture';

function LectureTable({ allLectures, setLectures }) {
  const addEmptyLecture = () => {
    const newLectures = [...allLectures, new LectureType()];
    setLectures(newLectures);
  };

  const urlToClipboard = () => {
    const basename = window.location.origin;
    const path = '?lectures=' + encodeURIComponent(JSON.stringify(allLectures));
    const url = basename + path;
    navigator.clipboard.writeText(url);
    window.history.replaceState(null, null, path);
  };
  return (
    <Container maxW="100%" alignContent="center">
      <Grid templateColumns="auto auto" columnGap={100}>
        <Button leftIcon={<LinkIcon />} onClick={urlToClipboard}>
          Copia URL
        </Button>
        <Button leftIcon={<AddIcon />} onClick={addEmptyLecture}>
          Aggiungi Materia
        </Button>
      </Grid>
      <Grid
        templateColumns="minmax(max-content, 2fr) repeat(5, min-content)"
        columnGap={5}
        rowGap={2}
      >
        <>
          <Text>Nome Materia</Text>
          <Text>CFU</Text>
          <Text>Voto</Text>
          <Text>Lode</Text>
          <Text>Caratterizzante</Text>

          <Text>Rimuovi</Text>
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
      </Grid>
    </Container>
  );
}

export default LectureTable;
