import { Button } from '@chakra-ui/button';
import { AddIcon, LinkIcon } from '@chakra-ui/icons';
import { Container, Grid, Text} from '@chakra-ui/layout';
import {
  Table,
  TableCaption,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/table';
import React from 'react';
import Lecture, { LectureType } from './Lecture';

function LectureTable({ allLectures, setLectures }) {
  const addEmptyLecture = () => {
    const newLectures = [...allLectures, new LectureType()];
    setLectures(newLectures);
  };

  const urlToClipboard = () => {
    const basename = window.location.origin;
    const path = '?lectures=' + encodeURIComponent(JSON.stringify(allLectures))
    const url =
      basename + path;
    navigator.clipboard.writeText(url);
    window.history.replaceState(null, null, path);
  };
  return (
    <Container maxW="100%" alignContent="center">
      <Table colorScheme="telegram">
        <TableCaption placement="top">Calcola la media</TableCaption>
        <Thead>
          <Tr>
            <Th>Nome Materia</Th>
            <Th>CFU</Th>
            <Th>Voto</Th>
            <Th>Lode</Th>
            <Th>Caratterizzante</Th>

            <Th>Rimuovi</Th>
          </Tr>
        </Thead>
        <Tbody>
          {allLectures.map(el => {
            return (
              <Tr key={el._id} backgroundColor={el.isRemoved ? "red.600" : "auto"}>
                <Lecture
                  allLectures={allLectures}
                  setLectures={setLectures}
                  lecture={el}
                />
              </Tr>
            );
          })}
          <Tr>
            <Td colSpan={4}>
              <Grid templateColumns="auto auto" columnGap={100}>
                <Button leftIcon={<LinkIcon />} onClick={urlToClipboard}>
                  Copia URL
                </Button>
                <Button leftIcon={<AddIcon />} onClick={addEmptyLecture}>
                  Aggiungi Materia
                </Button>
              </Grid>
            </Td>
            <Td colSpan={2}>
                <Text>
                    Media Ponderata
                </Text>
            </Td>
          </Tr>
        </Tbody>
      </Table>
    </Container>
  );
}

export default LectureTable;
