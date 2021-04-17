import { Button } from '@chakra-ui/button';
import { AddIcon, LinkIcon } from '@chakra-ui/icons';
import {
  Container,
  GridItem,
  SimpleGrid,
} from '@chakra-ui/layout';
import React from 'react';
import Lecture, { LectureType } from './Lecture';

const urlToClipboard = allLectures => {
  const basename = window.location.origin;
  const path = '?lectures=' + encodeURIComponent(JSON.stringify(allLectures));
  const url = basename + path;
  navigator.clipboard.writeText(url);
  // window.history.replaceState(null, null, path);
};

function LectureTable({ allLectures, setLectures }) {
  const addEmptyLecture = () => {
    const newLectures = [...allLectures, new LectureType()];
    setLectures(newLectures);
  };

  return (
    <Container maxW="100%" alignContent="center">
      <SimpleGrid
      // templateColumns={{
      //   base: 'minmax(max-content, 2fr) repeat(3, min-content)',
      //   md: 'minmax(max-content, 2fr) repeat(6, min-content)',
      // }}
      // columnGap={5}
      columns={2}
      rowGap={5}
      // alignItems="center"
      justifyItems="center"
      // m={{
      //   base: '2px',
      //   md: '8px',
      // }}
      >
        {/* <>
          <Center><Text>Nome Materia</Text></Center>
          <Center><Text>CFU</Text></Center>
          <Center><Text>Voto</Text></Center>
          <Center><Text>Lode</Text></Center>
          <Center><Text>Caratterizzante</Text></Center>

          <Center><Text>Rimuovi</Text></Center>
        </> */}
        {allLectures.map(el => {
          return (
            // <Tr key={el._id} backgroundColor={el.isRemoved ? "red.600" : "auto"}>
            <GridItem key={el._id} colSpan={2}>
              <Lecture
                allLectures={allLectures}
                setLectures={setLectures}
                lecture={el}
              />
            </GridItem>
            // </Tr>
          );
        })}
        <GridItem>
          <Button leftIcon={<AddIcon />} onClick={addEmptyLecture}>
            Aggiungi Materia
          </Button>
        </GridItem>
        <GridItem>
          <Button
            leftIcon={<LinkIcon />}
            onClick={() => urlToClipboard(allLectures)}
          >
            Copia URL
          </Button>
        </GridItem>
      </SimpleGrid>
    </Container>
  );
}

export default LectureTable;
