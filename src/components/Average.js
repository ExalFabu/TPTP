import { Button } from '@chakra-ui/button';
import { InfoIcon } from '@chakra-ui/icons';
import { Flex, SimpleGrid } from '@chakra-ui/layout';
import { Text } from '@chakra-ui/layout';
import {
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverFooter,
  PopoverHeader,
  PopoverTrigger,
  useColorModeValue,
} from '@chakra-ui/react';
import React, { useEffect, useMemo, useState } from 'react';
import { borderColor } from '../theme';

/**
 *
 * @param {import('../model/LectureType').Lecture[]} allLectures
 * @param {import('../model/PreferencesType').Preferences} preferences
 * @returns
 */
const calculateUnipaAverage = ({
  allLectures,
  preferences,
  setRemovedLectures,
}) => {
  // Calcolo la media ponderata, salvandomi somme pesate e pesi.
  const validLecture = lecture =>
    lecture.grade !== 0 &&
    lecture.grade !== null &&
    lecture.grade !== undefined &&
    lecture.grade >= 18 &&
    lecture.grade <= 30 &&
    lecture.cfu !== 0 &&
    lecture.cfu !== null &&
    lecture.cfu !== undefined &&
    lecture.cfu > 0;

  let weights = 0;
  let sum = 0;
  allLectures.forEach(element => {
    if (validLecture(element)) {
      weights += parseInt(element.cfu);
      sum += parseInt(element.grade) * parseInt(element.cfu);
      // element.new_cfu = element.cfu;
    }
  });
  let avg = Math.round((sum / weights) * 100) / 100;
  // Mi prendo le materie non caratterizzanti con voti minori della media calcolata
  // (Così che, la rimozione, non può che migliorare la media)
  // Successivamente la ordino in ordine di voto, così da rimuovere quelle con voto minore prima.
  /** @type {Array} */
  let non_caratt_lecture = allLectures.filter(
    el => el.caratt === false && el.grade < avg && validLecture(el)
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
  const removed = [];
  while (upper_bound()) {
    // Rimuovo la materia con il voto più basso
    sum -= non_caratt_lecture[count].grade * non_caratt_lecture[count].cfu;
    weights -= non_caratt_lecture[count].cfu;

    let new_weight = 0;

    // Se devo rimuovere in base ai cfu
    //    controllo che non sforo i CFU da levare (preferences.removeCFU),
    //    in caso la ricalcolo con il peso giusto
    // Se devo rimuovere in base al numero di materie non devo ripesare nulla
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
    // non_caratt_lecture[count].new_cfu = new_weight;
    removed.push({
      name: non_caratt_lecture[count].name,
      cfu: non_caratt_lecture[count],
      new_cfu: new_weight,
      grade: non_caratt_lecture[count].grade,
    });
    count++;
  }
  setRemovedLectures(removed);
  avg = Math.round((sum / weights) * 100) / 100;

  return isNaN(avg) ? 0 : avg;
};
/**
 *
 * @param {import('../model/LectureType').Lecture[]} allLectures
 * @param {import('../model/PreferencesType').Preferences} preferences
 * @returns
 */
const votoFinale = ({
  allLectures,
  preferences,
  averageBonus,
  finalAverage,
  mediaCalcolata,
}) => {
  const validateValue = value => {
    return isNaN(parseFloat(value)) || parseFloat(value) <= 0 // Se non è un valore numerico o è negativo è inammissibile, quindi 0
      ? 0
      : parseFloat(value);
  };

  const avg = mediaCalcolata;
  const num_lodi = allLectures.reduce(
    (prev, curr) => prev + (curr.lode && curr.grade === 30 ? 1 : 0),
    0
  );
  const votoDiBase = Math.round(((avg * 11) / 3) * 100) / 100;

  let avBonus = 0;
  averageBonus.forEach(elem => {
    if ((avg > elem.from && avg < elem.to) || avg === elem.eq) {
      avBonus = elem.value;
      return;
    }
  });

  return (
    votoDiBase +
    Math.min(num_lodi, 6) * (preferences.ptlode || 0) + // Bonus Lodi (massimo 6 lodi)
    validateValue(preferences.erasmus) * (finalAverage.hasDoneEramus ? 1 : 0) + // Bonus Erasmus
    validateValue(preferences.incorso) * (finalAverage.isInCorso ? 1 : 0) + // Bonus in corso
    validateValue(avBonus) // Bonus di Profitto
  );
};

/**
 *
 * @param {import('../model/LectureType').Lecture[]} lectures
 */
const removedLecturesBody = removedLectures => {
  if (removedLectures.length === 0) {
    return (
      <Text>Non è stata rimossa nessuna materia dal conteggio della media</Text>
    );
  }
  return (
    <>
      {removedLectures.map(e => {
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

const InfoFinalVotePopover = React.memo(() => {
  const greenInfoColor = useColorModeValue('green.600', 'green.300');

  return (
    <Popover gridArea="info">
      <PopoverTrigger>
        <InfoIcon boxSize="0.8em" color={greenInfoColor} />
      </PopoverTrigger>
      <PopoverContent>
        <PopoverArrow />
        <PopoverCloseButton />
        <PopoverHeader textAlign="center">Voto Finale</PopoverHeader>
        <PopoverBody fontSize="sm">
          Al voto finale sono stati aggiunti gli eventuali bonus. Assicurati di
          aver inserito i valori corretti per il tuo Corso di Studi prima di
          festeggiare.
        </PopoverBody>
        <PopoverFooter fontSize="sm">
          Il voto finale va arrotondato al valore intero più vicino.
        </PopoverFooter>
      </PopoverContent>
    </Popover>
  );
});

/**
 * @param {Object} props
 * @param {import('../model/LectureType').Lecture[]} props.allLectures
 * @param {import('../model/PreferencesType').Preferences} props.preferences
 * @returns {React.FC}
 */
export default function Average({
  allLectures,
  preferences,
  averageBonus,
  ...props
}) {
  const [finalAverage, setFinalAverage] = useState({
    isInCorso: false,
    hasDoneEramus: false,
    averageBonus: 0,
  });
  const [removedLectures, setRemovedLectures] = useState([]);

  useEffect(() => {
    localStorage.setItem('finalAverage', JSON.stringify(finalAverage));
  }, [finalAverage]);

  const greenInfoColor = useColorModeValue('green.600', 'green.300');
  const calcolaMedia = useMemo(
    () =>
      calculateUnipaAverage({
        allLectures,
        preferences,
        setRemovedLectures,
      }),
    [allLectures, preferences]
  );

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
        <SimpleGrid
          p={2}
          mx={2}
          templateAreas={`"Titolo info" "Valore Valore"`}
          justifyItems="center"
          alignItems="center"
          columnGap={2}
        >
          <Text gridArea="Titolo">Media</Text>
          <Text gridArea="Valore">{calcolaMedia}</Text>
          <Popover gridArea="info">
            <PopoverTrigger>
              <InfoIcon boxSize="0.8em" color={greenInfoColor} />
            </PopoverTrigger>
            <PopoverContent>
              <PopoverArrow />
              <PopoverCloseButton />
              <PopoverHeader textAlign="center">Materie ripesate</PopoverHeader>
              <PopoverBody fontSize="sm">
                {removedLecturesBody(removedLectures)}
              </PopoverBody>
            </PopoverContent>
          </Popover>
        </SimpleGrid>
        <SimpleGrid
          p={2}
          templateAreas={`"Titolo info" "Valore Valore"`}
          justifyItems="center"
          alignItems="center"
          columnGap={2}
        >
          <Text gridArea="Titolo">Voto Finale</Text>
          <Text gridArea="Valore">
            {votoFinale({
              mediaCalcolata: calcolaMedia,
              allLectures,
              preferences,
              averageBonus,
              finalAverage,
            })}
          </Text>
          <InfoFinalVotePopover />
        </SimpleGrid>
      </Flex>
    </SimpleGrid>
  );
}
