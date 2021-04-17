import React from 'react';
import { Checkbox, Input, Center, IconButton, Switch } from '@chakra-ui/react';
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
    <>
      {/* Name input */}
      <Input
        name="name"
        aria-label="Nome Materia"
        variant="filled"
        placeholder="Nome della materia"
        value={lecture.name}
        onChange={e => changeValue(e.target.name, e.target.value)}
      />
      {/* CFU Input */}
      <Input
        variant="flushed"
        name="cfu"
        aria-label="CFU"
        step={1}
        min={0}
        type="number"
        onChange={e => changeValue(e.target.name, parseInt(e.target.value))}
        placeholder="CFU"
        value={lecture.cfu}
        minW="3em"
        textAlign="center"
      ></Input>

      {/* Grade Input */}
      <Input
        type="number"
        variant="flushed"
        name="grade"
        aria-label="Voto"
        step={1}
        isInvalid={
          (lecture.grade < 18 || lecture.grade > 30) && lecture.grade !== ''
        }
        min={18}
        max={30}
        onChange={e => changeValue(e.target.name, parseInt(e.target.value))}
        value={lecture.grade}
        placeholder="Voto"
        minW="3em"
        textAlign="center"

      ></Input>

      {/* Lode Checkbox */}
      <Center>
        <Checkbox
          value={lecture.lode}
          name="lode"
          aria-label="Lode"
          onChange={e => changeValue(e.target.name, e.target.checked)}
          isInvalid={parseInt(lecture.grade) !== 30 && lecture.lode}
        ></Checkbox>
      </Center>

      {/* Caratt switch */}
      <Center>
        <Switch
          value={lecture.caratt}
          name="caratt"
          aria-label="Caratterizzante"
          onChange={e => changeValue(e.target.name, e.target.checked)}
        ></Switch>
      </Center>

      {/* Delete Button */}
      <Center>
        <IconButton
          icon={<DeleteIcon />}
          aria-label="Rimuovi materia"
          onClick={removeLecture}
          variant="ghost"
        ></IconButton>
      </Center>
    </>
  );
}
