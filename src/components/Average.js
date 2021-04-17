import { Grid, Text } from '@chakra-ui/layout';
import React from 'react';

const CFU_DA_LEVARE = 18;

const calculateArithmeticAverage = allLectures => {
  let sum = 0,
    count = 0;
  allLectures.forEach(element => {
    if (
      element.grade &&
      element.cfu &&
      element.grade >= 18 &&
      element.grade <= 30 &&
      element.cfu !== 0
    ) {
      count += 1;
      sum += parseInt(element.grade);
    }
  });
  let avg = Math.round((sum / count) * 100) / 100;
  return isNaN(avg) ? '' : avg
};

const calculateWeightedAverage = allLectures => {
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
  return isNaN(avg) ? '' : avg;
};

const calculateUnipaAverage = allLectures => {
  // Calcolo la media ponderata, salvandomi somme pesate e pesi.
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
      element.new_cfu = element.cfu;
    }
  });
  let avg = Math.round((sum / weights) * 100) / 100;
  // Mi prendo le materie non caratterizzanti con voti minori della media calcolata
  // (Così che, la rimozione, non può che migliorare la media)
  // Successivamente la ordino in ordine di voto, così da rimuovere quelle con voto minore prima.
  /** @type {Array} */
  let non_caratt_lecture = allLectures.filter(
    el =>
      el.caratt === false && el.grade < avg && el.grade >= 18 && el.grade <= 30
  );

  non_caratt_lecture.sort((a, b) => a.grade - b.grade);
  console.log(non_caratt_lecture)
  let cfu_levati = 0,
    count = 0;

  if (non_caratt_lecture.length !== 0) {
    while (cfu_levati < CFU_DA_LEVARE && count < non_caratt_lecture.length) {
      // Rimuovo la materia con il voto più basso
      sum -= non_caratt_lecture[count].grade * non_caratt_lecture[count].cfu;
      weights -= non_caratt_lecture[count].cfu;

      let new_weight = 0;

      // Se sforo i ${CFU_DA_LEVARE} la ricalcolo con il peso giusto
      if (non_caratt_lecture[count].cfu + cfu_levati > CFU_DA_LEVARE) {
        new_weight = non_caratt_lecture[count].cfu + cfu_levati - CFU_DA_LEVARE;
        sum += non_caratt_lecture[count].grade * new_weight;
        weights += new_weight;
      }
      cfu_levati += non_caratt_lecture[count].cfu;
      non_caratt_lecture[count].new_cfu = new_weight;
      count++;
    }
  }
  console.log(`${avg}`);
  avg = Math.round((sum / weights) * 100) / 100;
  console.log(`avg ${avg}`);

  return isNaN(avg) ? '' : avg;
};

export default function Average({ allLectures, setLectures }) {
  return (
    <Grid column={3}>
      <Text>Media aritmetica: {calculateArithmeticAverage(allLectures)}</Text>
      <Text>Media ponderata: {calculateWeightedAverage(allLectures)}</Text>
      <Text>Media UNIPA: {calculateUnipaAverage(allLectures)}</Text>
    </Grid>
  );
}
