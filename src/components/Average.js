import { Button } from '@chakra-ui/button';
import { InfoIcon, WarningIcon } from '@chakra-ui/icons';
import { Flex, SimpleGrid } from '@chakra-ui/layout';
import { Text } from '@chakra-ui/layout';
import {
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Tooltip,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import { borderColor } from '../theme';

// const CFU_DA_LEVARE = 18;

// const calculateArithmeticAverage = allLectures => {
//   let sum = 0,
//     count = 0;
//   allLectures.forEach(element => {
//     if (
//       element.grade &&
//       element.cfu &&
//       element.grade >= 18 &&
//       element.grade <= 30 &&
//       element.cfu !== 0
//     ) {
//       count += 1;
//       sum += parseInt(element.grade);
//     }
//   });
//   let avg = Math.round((sum / count) * 100) / 100;
//   return isNaN(avg) ? '' : avg;
// };

// const calculateWeightedAverage = allLectures => {
//   let weights = 0;
//   let sum = 0;
//   allLectures.forEach(element => {
//     if (
//       element.grade &&
//       element.cfu &&
//       element.grade >= 18 &&
//       element.grade <= 30 &&
//       element.cfu !== 0
//     ) {
//       weights += parseInt(element.cfu);
//       sum += parseInt(element.grade) * parseInt(element.cfu);
//     }
//   });
//   let avg = Math.round((sum / weights) * 100) / 100;
//   return isNaN(avg) ? '' : avg;
// };
/**
 *
 * @param {import('../model/LectureType').Lecture[]} allLectures
 * @param {import('../model/PreferencesType').Preferences} preferences
 * @returns
 */
const calculateUnipaAverage = (allLectures, preferences) => {
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
  let cfu_levati = 0,
    count = 0;
  let upper_bound;
  if (preferences.removeCFU) {
    upper_bound = () =>
      cfu_levati < preferences.cfu_value && count < non_caratt_lecture.length;
  } else {
    upper_bound = () =>
      count < non_caratt_lecture.length && count < preferences.mat_value;
  }

  while (upper_bound()) {
    // Rimuovo la materia con il voto più basso
    sum -= non_caratt_lecture[count].grade * non_caratt_lecture[count].cfu;
    weights -= non_caratt_lecture[count].cfu;

    let new_weight = 0;

    // Se sforo i ${CFU_DA_LEVARE} la ricalcolo con il peso giusto
    if (
      preferences.removeCFU &&
      non_caratt_lecture[count].cfu + cfu_levati > preferences.cfu_value
    ) {
      new_weight =
        non_caratt_lecture[count].cfu + cfu_levati - preferences.cfu_value;
      sum += non_caratt_lecture[count].grade * new_weight;
      weights += new_weight;
    }
    cfu_levati += non_caratt_lecture[count].cfu;
    non_caratt_lecture[count].new_cfu = new_weight;
    count++;
  }

  avg = Math.round((sum / weights) * 100) / 100;

  return isNaN(avg) ? 0 : avg;
};
/**
 *
 * @param {import('../model/LectureType').Lecture[]} allLectures
 * @param {import('../model/PreferencesType').Preferences} preferences
 * @returns
 */
const votoFinale = (allLectures, preferences, finalAverage) => {
  const avg = calculateUnipaAverage(allLectures, preferences);
  const num_lodi = allLectures.reduce(
    (prev, curr) => prev + (curr.lode && curr.grade === 30 ? 1 : 0),
    0
  );
  const votoDiBase = Math.round(((avg * 11) / 3) * 100) / 100;
  return (
    votoDiBase +
    num_lodi * preferences.ptlode +
    parseFloat(preferences.erasmus) * (finalAverage.hasDoneEramus ? 1 : 0) +
    parseFloat(preferences.incorso) * (finalAverage.isInCorso ? 1 : 0)
  );
};

/**
 *
 * @param {import('../model/LectureType').Lecture[]} lectures
 */
const removedLecturesBody = lectures => {
  const removed = lectures.filter(
    l => l.new_cfu !== l.cfu && l.cfu !== 0 && l.grade !== 0
  );
  if (removed.length === 0) {
    return (
      <Text>Non è stata rimossa nessuna materia dal conteggio della media</Text>
    );
  }
  return (
    <>
      {removed.map(e => {
        return (
          <Flex justifyContent="space-around" alignItems="center">
            <Text maxW="50%">{e.name}</Text>
            <Text>{e.new_cfu === 0 ? '❌' : `CFU: ${e.new_cfu}`}</Text>
          </Flex>
        );
      })}
    </>
  );
};

/**
 * @type {import('../model/FinalAverage').FinalAverage}
 */
const defaultFinalAverage = JSON.parse(
  localStorage.getItem('finalAverage')
) || {
  isInCorso: false,
  hasDoneEramus: false,
  averageBonus: 0,
};

/**
 * @param {Object} props
 * @param {import('../model/LectureType').Lecture[]} props.allLectures
 * @param {import('../model/PreferencesType').Preferences} props.preferences
 * @returns {React.FC}
 */
export default function Average({ allLectures, preferences, ...props }) {
  const [finalAverage, setFinalAverageState] = useState(defaultFinalAverage);
  const setFinalAverage = f => {
    localStorage.setItem('finalAverage', JSON.stringify(f));
    setFinalAverageState(f);
  };
  return (
    <SimpleGrid
      {...props}
      justifyContent="space-evenly"
      alignContent="space-evenly"
      border="1px"
      gridTemplateAreas={{
        base: `"Buttons . Values" "Buttons . Values"`,
        md: `"Buttons . Values"`,
      }}
      gridTemplateColumns="1fr 1fr max-content"
      borderColor={borderColor}
      borderRadius="2xl"
      p={2}
    >
      <Flex
        gridArea="Buttons"
        alignContent="space-evenly"
        justifyContent="space-evenly"
        wrap="wrap"
      >
        <Button
          colorScheme="messenger"
          w="85px"
          variant={finalAverage.isInCorso ? 'solid' : 'outline'}
          onClick={e =>
            setFinalAverage({
              ...finalAverage,
              isInCorso: !finalAverage.isInCorso,
            })
          }
          my={1}
        >
          In Corso
        </Button>
        <Button
          colorScheme="messenger"
          w="85px"
          variant={finalAverage.hasDoneEramus ? 'solid' : 'outline'}
          onClick={e =>
            setFinalAverage({
              ...finalAverage,
              hasDoneEramus: !finalAverage.hasDoneEramus,
            })
          }
          my={1}
        >
          Erasmus
        </Button>
      </Flex>
      <Flex
        gridArea="Values"
        alignContent="space-evenly"
        justifyContent="space-evenly"
        wrap="wrap"
      >
        <Tooltip>
          <SimpleGrid
            borderBottom="1px"
            borderRadius="full"
            p={2}
            mx={2}
            templateAreas={`"Titolo info" "Valore Valore"`}
            justifyItems="center"
            alignItems="center"
            columnGap={2}
          >
            <Text gridArea="Titolo">Media</Text>
            <Text gridArea="Valore">
              {calculateUnipaAverage(allLectures, preferences)}
            </Text>
            <Popover gridArea="info">
              <PopoverTrigger>
                <InfoIcon color="green.500" />
              </PopoverTrigger>
              <PopoverContent>
                <PopoverArrow />
                <PopoverCloseButton />
                <PopoverHeader textAlign="center">
                  Materie ripesate
                </PopoverHeader>
                <PopoverBody>{removedLecturesBody(allLectures)}</PopoverBody>
              </PopoverContent>
            </Popover>
          </SimpleGrid>
        </Tooltip>
        <SimpleGrid
          borderBottom="1px"
          borderRadius="full"
          p={2}
          templateAreas={`"Titolo info" "Valore Valore"`}
          justifyItems="center"
          alignItems="center"
          columnGap={2}
        >
          <Text gridArea="Titolo">Voto Finale</Text>
          <Text gridArea="Valore">
            {votoFinale(allLectures, preferences, finalAverage)}
          </Text>
          <Popover gridArea="info">
            <PopoverTrigger>
              <WarningIcon color="orange.500" />
            </PopoverTrigger>
            <PopoverContent>
              <PopoverArrow />
              <PopoverCloseButton />
              <PopoverHeader textAlign="center">Attenzione</PopoverHeader>
              <PopoverBody>
                Al voto finale dovrai aggiungere il bonus calcolato in base alla
                media. Per saperlo cerca il regolamento del tuo Corso di Laurea
                o chiedi ai tuoi rappresentanti
              </PopoverBody>
            </PopoverContent>
          </Popover>
        </SimpleGrid>
      </Flex>
    </SimpleGrid>
  );
}
