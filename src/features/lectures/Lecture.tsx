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
import { ILecture, editLecture, removeLecture } from './lectureDuck';
import { useAppDispatch } from '../../app/hooks';


function Lecture({lecture} : { lecture: ILecture }) {
  const dispatch = useAppDispatch()

  const changeValue = <T extends keyof ILecture>(name: T, value: ILecture[T]) => {
    dispatch(editLecture({
      id: lecture._id,
      key: name,
      value: value
    }))
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
    >
      {/* Name input */}
      <GridItem gridArea="name" w="100%" rowSpan={{ base: 2, md: 1 }}>
        <Input
          size="sm"
          name={"name" as keyof ILecture}
          aria-label="Nome Materia"
          variant="outline"
          placeholder="Nome della materia"
          value={lecture.name}
          onChange={e => changeValue("name", e.target.value)}
          isTruncated={true}
          onClick={e => (e.target as HTMLInputElement).select()}
          borderRadius="md"
        />
      </GridItem>
      {/* CFU Input */}
      <InputGroup gridArea="cfu" size="sm" w="100%">
        <InputLeftAddon
          as="label"
          htmlFor={`cfu${lecture._id}`}
          children={'CFU'}
          w="55px"
        />

        <Input
          variant="outline"
          id={`cfu${lecture._id}`}
          name={"cfu" as keyof ILecture}
          aria-label="CFU"
          step={1}
          min={0}
          type="number"
          onChange={e => {
            changeValue("cfu", Math.abs(e.target.valueAsNumber));
          }}
          placeholder="0"
          value={lecture.cfu ?? ""}
          w="4em"
          textAlign="center"
          onClick={e => (e.target as HTMLInputElement).select()}
          isInvalid={lecture.cfu !== null && lecture.cfu < 0}
        />
      </InputGroup>

      {/* Grade Input */}
      <InputGroup size="sm" gridArea="grade" w="100%">
        <InputLeftAddon
          as="label"
          htmlFor={`grade${lecture._id}`}
          children={'Voto'}
          w="55px"
        />
        <Input
          type="number"
          variant="outline"
          id={`grade${lecture._id}`}
          name={"grade" as keyof ILecture}
          aria-label="Voto"
          step={1}
          isInvalid={
            lecture.grade !== null &&
            (lecture.grade < 18 || lecture.grade > 30) &&
            lecture.grade !== 0 
          }
          min={18}
          max={30}
          onChange={e => changeValue("grade", Math.abs(e.target.valueAsNumber))}
          value={lecture.grade || ""}
          w="4em"
          textAlign="center"
          onClick={e => (e.target as HTMLInputElement).select()}
          placeholder="0"
        />
      </InputGroup>

      {/* Lode Checkbox */}
      <GridItem gridArea="lode">
        <Center>
          <Button
            size="sm"
            name={"lode" as keyof ILecture}
            variant={
              lecture.grade !== 30
                ? 'ghost'
                : lecture.lode
                  ? 'solid'
                  : 'outline'
            }
            colorScheme="yellow"
            aria-label="Lode"
            onClick={e => changeValue("lode", !lecture.lode)}
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
          name={"caratt" as keyof ILecture} 
          aria-label="Caratterizzante"
          variant={lecture.caratt ? 'solid' : 'outline'}
          colorScheme="green"
          onClick={e => changeValue("caratt", !lecture.caratt)}
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
            onClick={() => dispatch(removeLecture(lecture._id))}
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

export default React.memo(Lecture)