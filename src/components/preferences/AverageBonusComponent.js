import { Input } from '@chakra-ui/input';
import { Flex, SimpleGrid, Text } from '@chakra-ui/layout';
import { useBreakpointValue } from '@chakra-ui/media-query';
import React from 'react';
import { borderColor } from '../../theme';

function singleInput({ label, id, value, setValue, ...props }) {
  return (
    <SimpleGrid
      w="9em"
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
        onChange={e => setValue(e.target.name, e.target.valueAsNumber || 0)}
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
for(let i = 0; i<NUM; i++){
    emptyArrayToIterate.push(0);
}

function AverageBonusComponent({ averageBonus, setAverageBonusState, ...props }) {
    
  const setAverageBonus = (id, value) => {
    const modifiedBonuses = averageBonus.map(elem => {
      if (elem.id === id) {
        elem.value = value;
        return elem;
      }
      return elem;
    });
    localStorage.setItem('AvBonus', JSON.stringify(modifiedBonuses));
    setAverageBonusState(modifiedBonuses);
  };
  const legendPosition = useBreakpointValue({
    base: 'left',
    md: 'center',
  });

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
      <legend align={legendPosition}>Bonus di profitto</legend>
      {emptyArrayToIterate.map((_, i) => {
        return singleInput({
          ...averageBonus[i],
          setValue: setAverageBonus,
          key: averageBonus[i].id,
        });
      })}
    </Flex>
  );
}

export default AverageBonusComponent;
