import React from 'react';
import {
  Checkbox,
  Input,
  NumberInput,
  NumberInputField,
  Td,
  Center,
  IconButton,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';

export class LectureType {
  constructor(name, cfu, grade, lode, caratt, isRemoved) {
    this._id = LectureType.incCount();
    this.name = name || '';
    this.cfu = cfu || 0;
    this.grade = grade || 0;
    this.lode = lode || false;
    this.caratt = caratt || false;
    this.isRemoved = isRemoved || false;
  }
  static incCount() {
    if (!this.latestId) this.latestId = 1;
    else this.latestId++;
    return this.latestId;
  }
}
// LectureType.prototype.toString = (el) => {
//   if (el === undefined) return "undefined"
//   return `${el._id} ${el.name} ${el.grade}`
// }


export default function Lecture({ allLectures, setLectures, lecture }) {
  const changeValue = event => {
    const modifiedLectures = allLectures.map(lec => {
      if (lecture._id === lec._id) {
        lec[event.target.name] = event.target.value;
      }
      return lec;
    });
    setLectures(modifiedLectures);
  };

  const removeLecture = event => {
    console.log(allLectures);
    console.log(lecture._id);
    const modifiedLectures = allLectures.filter(el => el._id !== lecture._id);
    setLectures(modifiedLectures);
    console.log(allLectures);
  };

  return (
    // <Grid templateColumns="0.5fr 3fr 1fr 1fr" columnGap={5}>
    <>
      <Td>
        {/* Name input */}
        <Input
          name="name"
          aria-label="Nome Materia"
          variant="flushed"
          placeholder="Nome della materia"
          value={lecture.name}
          onChange={changeValue}
        />
      </Td>
      <Td>
        {/* CFU Input */}
        <NumberInput
          variant="flushed"
          name="cfu"
          aria-label="CFU"
          step={1}
          min={0}
          allowMouseWheel
          onChange={(_, num) => {
            changeValue({
              target: {
                name: 'cfu',
                value: num,
              },
            });
          }}
          placeholder="CFU"
          value={lecture.cfu}
          minW="4em"

        >
          <NumberInputField />
        </NumberInput>
      </Td>
      <Td >
        {/* Grade Input */}
        <NumberInput
          variant="flushed"
          name="grade"
          aria-label="Voto"
          step={1}
          isInvalid={lecture.grade < 18 || lecture.grade > 30}
          min={0}
          max={30}
          allowMouseWheel
          onChange={(_, num) => {
            changeValue({
              target: {
                name: 'grade',
                value: num,
              },
            });
          }}
          value={lecture.grade}
          placeholder="Voto"
          minW="4em"
        >
          <NumberInputField />
        </NumberInput>
      </Td>
      <Td>
        {/* Lode Checkbox */}
        <Center>
          <Checkbox
            value={lecture.lode}
            name="lode"
            aria-label="Lode"
            onChange={event => {
              changeValue({
                target: {
                  name: event.target.name,
                  value: event.target.checked,
                },
              });
            }}
            isDisabled={parseInt(lecture.grade) !== 30}
          ></Checkbox>
        </Center>
      </Td>
      <Td>
        {/* Caratt Checkbox */}
        <Center>
          <Checkbox
            value={lecture.caratt}
            name="caratt"
            aria-label="Caratterizzante"
            onChange={event => {
              changeValue({
                target: {
                  name: event.target.name,
                  value: event.target.checked,
                },
              });
            }}
          ></Checkbox>
        </Center>
      </Td>
      <Td>
        {/* Delete Button */}
        <Center>
          <IconButton
            icon={<DeleteIcon />}
            aria-label="Rimuovi materia"
            onClick={removeLecture}
          ></IconButton>
        </Center>
      </Td>
      {/* </Grid> */}
    </>
  );
}
