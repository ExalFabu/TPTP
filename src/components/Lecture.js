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
} from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';
import { nanoid } from 'nanoid';

export class LectureType {
  constructor(name, cfu, grade, lode, caratt, isRemoved) {
    this._id = nanoid(22);
    this.name = name || '';
    this.cfu = cfu || null;
    this.grade = grade || null;
    this.lode = lode || false;
    this.caratt = caratt || false;
    this.isRemoved = isRemoved || false;
  }
}

/**
 *
 * @param {Object} props
 * @param {import('../model/LectureType').Lecture[]} props.allLectures
 * @param {CallableFunction} props.setLectures
 * @param {import('../model/LectureType').Lecture} props.lecture
 * @returns {React.FC}
 */
export default function Lecture({
  allLectures,
  setLectures,
  lecture,
  ...props
}) {
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
    let modifiedLectures = allLectures.filter(el => el._id !== lecture._id);
    modifiedLectures =
      modifiedLectures.length === 0 ? [new LectureType()] : modifiedLectures;
    setLectures(modifiedLectures);
  };

  return (
    <SimpleGrid
      p={2}
      borderColor="gray.500"
      borderRadius="md"
      templateColumns={{
        md: 'minmax(max-content, 2fr) repeat(5, min-content)',
      }}
      columnGap={3}
      rowGap={2}
      templateAreas={{
        base: `'name cfu removeBtn' 'caratt grade lode'`,
        md: `'name cfu grade lode caratt removeBtn'`,
      }}
      alignItems="center"
      justifyItems="center"
      {...props}
    >
      {/* Name input */}
      <GridItem gridArea="name" w="100%" rowSpan={{ base: 2, md: 1 }}>
        <Input
          size="sm"
          name="name"
          aria-label="Nome Materia"
          variant="outline"
          placeholder="Nome della materia"
          value={lecture.name}
          onChange={e => changeValue(e.target.name, e.target.value)}
          isTruncated={true}
          onClick={e => e.target.select()}
          borderRadius="md"
        />
      </GridItem>
      {/* CFU Input */}
      <InputGroup gridArea="cfu" size="sm" w="100%">
        <InputLeftAddon
          as="label"
          for={`cfu${lecture._id}`}
          children={'CFU'}
          w="55px"
        />

        <Input
          variant="outline"
          id={`cfu${lecture._id}`}
          name="cfu"
          aria-label="CFU"
          step={1}
          min={0}
          type="number"
          onChange={e => {
            changeValue(e.target.name, e.target.valueAsNumber);
          }}
          placeholder="0"
          value={lecture.cfu}
          w="4em"
          textAlign="center"
          onClick={e => e.target.select()}
          isInvalid={lecture.cfu < 0 && lecture.cfu !== null}
        />
      </InputGroup>

      {/* Grade Input */}
      <InputGroup size="sm" gridArea="grade" w="100%">
        <InputLeftAddon
          as="label"
          for={`grade${lecture._id}`}
          children={'Voto'}
          w="55px"
        />
        <Input
          type="number"
          variant="outline"
          id={`grade${lecture._id}`}
          name="grade"
          aria-label="Voto"
          step={1}
          isInvalid={
            (lecture.grade < 18 || lecture.grade > 30) &&
            lecture.grade !== '' &&
            lecture.grade !== 0 &&
            lecture.grade !== null
          }
          min={18}
          max={30}
          onChange={e => changeValue(e.target.name, e.target.valueAsNumber)}
          value={lecture.grade}
          w="4em"
          textAlign="center"
          onClick={e => e.target.select()}
          placeholder="0"
        />
      </InputGroup>

      {/* Lode Checkbox */}
      <GridItem gridArea="lode">
        <Center>
          <Button
            size="sm"
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
            L
          </Button>
        </Center>
      </GridItem>

      {/* Caratt switch */}
      <GridItem gridArea="caratt" w="100%">
        <Button
          size="sm"
          name="caratt"
          aria-label="Caratterizzante"
          variant={lecture.caratt ? 'solid' : 'outline'}
          colorScheme="green"
          onClick={e => changeValue(e.target.name, !lecture.caratt)}
          minW="5em"
          w="100%"
          border="1px"
        >
          Caratterizzante
        </Button>
      </GridItem>

      {/* Delete Button */}
      <GridItem gridArea="removeBtn">
        <Center>
          <IconButton
            size="sm"
            icon={<DeleteIcon />}
            aria-label="Rimuovi materia"
            onClick={removeLecture}
            variant="ghost"
            colorScheme="red"
            w="3em"
            tabIndex={-1}
          ></IconButton>
        </Center>
      </GridItem>
    </SimpleGrid>
  );
}
