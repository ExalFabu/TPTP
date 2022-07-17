import { Button } from '@chakra-ui/button';
import { Flex, SimpleGrid, Text } from '@chakra-ui/layout';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { borderColor, exactWidth } from '../../theme';
import { selectAverage, selectFinalGrade, selectOptions, selectRemovedLectures, toggleErasmus, toggleInCorso } from './averageDuck';
import FinalVoteInfoPopover from './components/FinalVoteInfoPopover';
import RemovedLecturesPopover from './components/RemovedLecturesPopover';

export default function Average({
  ...props
}) {
  const removedLectures = useAppSelector(selectRemovedLectures)
  const options = useAppSelector(selectOptions)
  const media = useAppSelector(selectAverage);
  const votoFinale = useAppSelector(selectFinalGrade);
  const dispatch = useAppDispatch()

  return (
    <SimpleGrid
      {...props}
      w={{...exactWidth, xl: exactWidth.base}}
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
          variant={options.isInCorso ? 'solid' : 'outline'}
          onClick={_ => dispatch(toggleInCorso())}
          my={1}
        >
          In Corso
        </Button>
        <Button
          colorScheme="messenger"
          w="85px"
          variant={options.hasDoneErasmus ? 'solid' : 'outline'}
          onClick={_ => dispatch(toggleErasmus())}
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
          <Text gridArea="Valore">{media}</Text>
          <RemovedLecturesPopover removedLectures={removedLectures}/>
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
            {votoFinale}
          </Text>
          <FinalVoteInfoPopover gridArea='info' />
        </SimpleGrid>
      </Flex>
    </SimpleGrid>
  );
}
