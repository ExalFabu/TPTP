import React from 'react';
import {
  Input,
  Center,
  IconButton,
  GridItem,
  Button,
  InputGroup,
  InputLeftAddon,
  SimpleGrid,
  Box,
} from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';
import { nanoid } from 'nanoid';

export class LectureType {
  constructor(name, cfu, grade, lode, caratt, isRemoved) {
    this._id = nanoid(22);
    this.name = name || '';
    this.cfu = cfu || 0;
    this.grade = grade || 0;
    this.lode = lode || false;
    this.caratt = caratt || false;
    this.isRemoved = isRemoved || false;
  }
}

export default function Lecture({ allLectures, setLectures, lecture }) {
  const changeValue = (name, value) => {
    const modifiedLectures = allLectures.map(lec => {
      if (lecture._id === lec._id) {
        lec[name] = value;
      }
      return lec;
    });
    setLectures(modifiedLectures);
  };

  const removeLecture = _ => {
    console.log(`Removing ${lecture.name}`);
    const modifiedLectures = allLectures.filter(el => el._id !== lecture._id);
    setLectures(modifiedLectures);
  };

  return (
    <Box
      border="1px"
      borderColor="gray.500"
      borderRadius="lg"
      p={2}
      shadow="lg"
    >
      <SimpleGrid
        templateColumns={{
          base: 'minmax(max-content, 2fr) repeat(3, min-content)',
          md: 'minmax(max-content, 2fr) repeat(6, min-content)',
        }}
        columnGap={5}
        rowGap={2}
        columns={{ base: 4, md: 7 }}
        alignItems="center"
        justifyItems="center"
        ml={5}
      >
        {/* Name input */}
        <GridItem w="100%" rowSpan={{ base: 2, md: 1 }}>
          <Input
            name="name"
            aria-label="Nome Materia"
            variant="outline"
            placeholder="Nome della materia"
            value={lecture.name}
            onChange={e => changeValue(e.target.name, e.target.value)}
          />
        </GridItem>
        {/* CFU Input */}
        <GridItem w="100%">
          <InputGroup>
            <InputLeftAddon children={'CFU'} />

            <Input
              variant="outline"
              name="cfu"
              aria-label="CFU"
              step={1}
              min={0}
              type="number"
              onChange={e =>
                changeValue(e.target.name, parseInt(e.target.value) || 0)
              }
              placeholder="CFU"
              value={lecture.cfu}
              w="4em"
              textAlign="center"
            />
          </InputGroup>
        </GridItem>

        {/* Grade Input */}
        <InputGroup>
          <InputLeftAddon children={'Voto'} />
          <Input
            type="number"
            variant="outline"
            name="grade"
            aria-label="Voto"
            step={1}
            isInvalid={
              (lecture.grade < 18 || lecture.grade > 30) &&
              lecture.grade !== '' &&
              lecture.grade !== 0
            }
            min={18}
            max={30}
            onChange={e =>
              changeValue(e.target.name, parseInt(e.target.value) || 0)
            }
            value={lecture.grade}
            w="4em"
            textAlign="center"
          />
        </InputGroup>

        {/* Lode Checkbox */}
        <GridItem>
          <Center>
            <Button
              name="lode"
              variant={
                lecture.grade !== 30
                  ? 'ghost'
                  : lecture.lode
                  ? 'solid'
                  : 'outline'
              }
              colorScheme="yellow"
              aria-label="Lode"
              onClick={e => changeValue(e.target.name, !lecture.lode)}
              isDisabled={lecture.grade !== 30}
              minW="3em"
            >
              {'L'}
            </Button>
          </Center>
        </GridItem>

        {/* Caratt switch */}
        <GridItem colSpan={2}>
          <Center>
            <Button
              name="caratt"
              aria-label="Caratterizzante"
              variant={lecture.caratt ? 'solid' : 'outline'}
              colorScheme="green"
              onClick={e => changeValue(e.target.name, !lecture.caratt)}
              minW="5em"
            >
              Caratterizzante
            </Button>
          </Center>
        </GridItem>

        {/* Delete Button */}
        <GridItem>
          <Center>
            <IconButton
              icon={<DeleteIcon />}
              aria-label="Rimuovi materia"
              onClick={removeLecture}
              variant="outline"
              colorScheme="red"
              w="3em"
              tabIndex={-1}
            ></IconButton>
          </Center>
        </GridItem>
      </SimpleGrid>
    </Box>
  );
}
