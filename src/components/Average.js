import { Heading } from '@chakra-ui/layout';
import React from 'react';

const CFU_DA_LEVARE = 18;

const calculateAverage = (allLectures, setLectures) => {
    // const changeLectureBG = (lec, value) => {
    //     const modifiedLectures = allLectures.map( el => {
    //         if (el._id === lec._id){
    //             el.isRemoved = value;
    //         }
    //     })
    // }

    let weights = 0;
  let sum = 0;
  allLectures.forEach(element => {
    if (
      element.grade &&
      element.cfu &&
      element.grade >= 18 &&
      element.grade <= 30 &&
      element.cfu !== 0
    ) {
      weights += parseInt(element.cfu);
      sum += parseInt(element.grade) * parseInt(element.cfu);
    }
  });
  let avg = Math.round((sum / weights) * 100) / 100;

  /** @type {Array} */
  let non_caratt_lecture = allLectures.filter(
    el =>
      el.caratt === false && el.grade < avg && el.grade >= 18 && el.grade <= 30
  );

  non_caratt_lecture.sort((a, b) => a.grade - b.grade);
  let cfu_levati = 0,
    count = 0;
  if (non_caratt_lecture.length !== 0) {
    while (cfu_levati < CFU_DA_LEVARE && count < non_caratt_lecture.length) {
      // Rimuovo la materia con il voto più basso
      sum -=
        parseInt(non_caratt_lecture[count].grade) *
        parseInt(non_caratt_lecture[count].cfu);
      weights -= parseInt(non_caratt_lecture[count].cfu);

      // Se sforo i 18 la ricalcolo con il peso giusto
      if (
        parseInt(non_caratt_lecture[count].cfu) + cfu_levati >
        CFU_DA_LEVARE
      ) {
        let new_weight =
          parseInt(non_caratt_lecture[count].cfu) + cfu_levati - CFU_DA_LEVARE;
        sum += parseInt(non_caratt_lecture[count].grade) * new_weight;
        weights += new_weight;
      }
    //   else{
    //       changeLectureBG(non_caratt_lecture[count], true)
    //   }
      cfu_levati += parseInt(non_caratt_lecture[count].cfu);
      count++;
    }
  }
  console.log(`avg ${avg}`);
  avg = Math.round((sum / weights) * 100) / 100;
  console.log(`avg ${avg}`);

  return isNaN(avg) ? '' : avg;
};

export default function Average({ allLectures, setLectures }) {
  return (
    <>
      <Heading>{calculateAverage(allLectures)}</Heading>
    </>
  );
}
