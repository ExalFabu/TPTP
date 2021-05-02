import { useColorModeValue } from '@chakra-ui/color-mode';
import { InfoIcon } from '@chakra-ui/icons';
import { Input } from '@chakra-ui/input';
import { Flex, SimpleGrid, Text } from '@chakra-ui/layout';
import { useBreakpointValue } from '@chakra-ui/media-query';
import {
  PopoverArrow,
  PopoverHeader,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverTrigger,
  Popover,
} from '@chakra-ui/popover';
import React, { useState } from 'react';
import { borderColor } from '../../theme';

function SingleInput({ label, id, value, setValue, cellWidth, ...props }) {
  return (
    <SimpleGrid
      w={cellWidth}
      {...props}
      templateColumns={'min-content min-content'}
      justifyContent="center"
      //   justifyItems="center"
      textAlign="center"
      alignItems="center"
      border="1px"
      borderColor={borderColor}
      borderRadius="md"
      py={1}
      my={1}
    >
      <Input
        type="number"
        id={'abc' + id}
        size="sm"
        name={id}
        value={value}
        min={0}
        fontSize="md"
        variant="flushed"
        placeholder="0"
        onChange={e => setValue(e.target.name, Math.abs(e.target.valueAsNumber))}
        onClick={e => e.target.select()}
        w="2em"
        textAlign="center"
      />
      <Text
        as="label"
        colorScheme="whatsapp"
        for={'abc' + id}
        mx={2}
        children={label}
      />
    </SimpleGrid>
  );
}
const NUM = 12;
const emptyArrayToIterate = [];
for (let i = 0; i < NUM; i++) {
  emptyArrayToIterate.push(0);
}

function AverageBonusComponent({
  averageBonus,
  setAverageBonusState,
  ...props
}) {
  const cellWidth = useBreakpointValue({ base: '8em', md: '9em' });

  const setAverageBonus = (id, value) => {
    const modifiedBonuses = averageBonus.map(elem => {
      if (elem.id === id) {
        elem.value = value;
        return elem;
      }
      return elem;
    });
    setAverageBonusState(modifiedBonuses);
  };
  const legendPosition = useBreakpointValue({
    base: 'left',
    md: 'center',
  });
  const [isPopoverOpen, setPopoverOpen] = useState(false);
  const openPopover = () => setPopoverOpen(true);
  const closePopover = () => setPopoverOpen(false);
  const greenInfoColor = useColorModeValue("green.600","green.300")

  return (
    <Flex
      as="fieldset"
      border="1px"
      borderColor={borderColor}
      borderRadius="xl"
      p={1}
      {...props}
      wrap="wrap"
      justifyContent="space-evenly"
    >
      <Popover isOpen={isPopoverOpen} onClose={closePopover} placement="top">
        <PopoverTrigger>
          <legend align={legendPosition}>
            Bonus di profitto{' '}
            <InfoIcon
              color={greenInfoColor}
              boxSize="0.8em"
              aria-label="Pulsante per informazioni aggiuntive sul Bonus di Profitto"
              focusable={true}
              onClick={openPopover}
            />
          </legend>
        </PopoverTrigger>
        <PopoverContent>
          <PopoverArrow />
          <PopoverCloseButton />
          <PopoverHeader textAlign="center">
            Cosa è il Bonus di Profitto?
          </PopoverHeader>
          <PopoverBody fontSize="sm">
            Il <strong>Bonus di Profitto</strong> è un punteggio aggiunto al
            voto finale in base alla media <i>M</i>. Per scoprire la tabella
            relativa al tuo Corso di Studi ti suggerisco di cercarla su Google o
            di chiedere ai tuoi rappresentanti
          </PopoverBody>
        </PopoverContent>
      </Popover>

      {emptyArrayToIterate.map((_, i) => {
        return SingleInput({
          ...averageBonus[i],
          setValue: setAverageBonus,
          key: averageBonus[i].id,
          cellWidth: cellWidth,
        });
      })}
    </Flex>
  );
}

export default AverageBonusComponent;
