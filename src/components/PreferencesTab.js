import { Checkbox } from '@chakra-ui/checkbox';
import {
  Input,
  InputGroup,
  InputLeftAddon,
  InputRightAddon,
} from '@chakra-ui/input';
import { Box, SimpleGrid } from '@chakra-ui/layout';
import { useBreakpointValue } from '@chakra-ui/media-query';
import React from 'react';
import { borderColor, exactWidth } from '../theme';

const RemoveComponent = ({ preferences, setPreferences, ...props }) => {
  const borderStyle = useBreakpointValue({
    base: { borderY: '1px' },
    md: { border: '1px' },
  });
  const legendPosition = useBreakpointValue({
    base: 'left',
    md: 'center',
  });
  return (
    <Box
      {...props}
      as="fieldset"
      {...borderStyle}
      borderColor={borderColor}
      borderRadius={5}
      p={2}
      mx={2}
      h="min-content"
    >
      <legend align={legendPosition}> Rimuovi </legend>
      <SimpleGrid
        templateColumns="1fr 1fr"
        templateAreas={`"cfus mats"`}
        columnGap={5}
        alignContent="center"
        justifyContent="center"
      >
        <InputGroup
          gridArea="cfus"
          size="sm"
          justifyContent="center"
          alignContent="center"
        >
          <Checkbox
            isChecked={preferences.removeCFU}
            aria-label="Rimuovi CFU"
            colorScheme="green"
            onChange={e => {
              if (e.target.checked === false) return;
              setPreferences({
                ...preferences,
                removeCFU: e.target.checked,
              });
            }}
            size="md"
            mr={2}
          />
          <Input
            w="2em"
            aria-label="CFU da rimuovere"
            id="cfu_val"
            variant="flushed"
            type="number"
            min={0}
            value={preferences.cfu_value}
            onChange={e => {
              setPreferences({
                ...preferences,
                removeCFU: true,
                cfu_value: e.target.valueAsNumber,
              });
            }}
            textAlign="center"
            onClick={e => {
              setPreferences({
                ...preferences,
                removeCFU: true,
              });
            }}
          />
          <InputRightAddon
            as="label"
            for="cfu_val"
            children="CFU"
            borderRadius="md"
          />
        </InputGroup>
        <InputGroup
          gridArea="mats"
          size="sm"
          justifyContent="center"
          alignContent="center"
        >
          <Checkbox
            isChecked={!preferences.removeCFU}
            aria-label="Rimuovi Materie"
            colorScheme="orange"
            onChange={e => {
              if (e.target.checked === false) return;
              setPreferences({
                ...preferences,
                removeCFU: false,
              });
            }}
            size="md"
            mr={2}
          />
          <Input
            w="2em"
            id="mat_val"
            aria-label="Materie da rimuovere"
            variant="flushed"
            type="number"
            min={0}
            value={preferences.mat_value}
            onChange={e => {
              setPreferences({
                ...preferences,
                removeCFU: false,
                mat_value: e.target.valueAsNumber,
              });
            }}
            textAlign="center"
            onClick={e => {
              setPreferences({
                ...preferences,
                removeCFU: false,
              });
            }}
          />
          <InputRightAddon
            as="label"
            for="mat_val"
            borderRadius="md"
            children="Materie"
          />
        </InputGroup>
      </SimpleGrid>
    </Box>
  );
};

const BonusComponent = ({ preferences, setPreferences, ...props }) => {
  const borderStyle = useBreakpointValue({
    base: { borderY: '1px' },
    md: { border: '1px' },
  });
  const legendPosition = useBreakpointValue({
    base: 'left',
    md: 'center',
  });
  const handleChange = e => {
    console.log(e);
    setPreferences({
      ...preferences,
      [e.target.name]: e.target.valueAsNumber || 0,
    });
  };
  return (
    <Box
      {...props}
      as="fieldset"
      {...borderStyle}
      borderColor={borderColor}
      borderRadius={5}
      p={2}
      mx={2}
      display="flex"
      justifyContent="space-between"
      justifyItems="center"
      alignItems="center"
    >
      <legend align={legendPosition}> Bonus </legend>
      <InputGroup
        size="sm"
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <InputLeftAddon as="label" for="ptlode" children="Lode" borderRadius="md"/>
        <Input
          id="ptlode"
          name="ptlode"
          variant="flushed"
          type="number"
          w="2em"
          step={0.5}
          min={0}
          textAlign="center"
          value={preferences.ptlode}
          onChange={handleChange}
        />
      </InputGroup>
      <InputGroup
        size="sm"
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <InputLeftAddon as="label" for="erasmus" children="Erasmus" borderRadius="md"/>

        <Input
          id="erasmus"
          name="erasmus"
          variant="flushed"
          type="number"
          w="2em"
          step={0.5}
          min={0}
          textAlign="center"
          value={preferences.erasmus}
          onChange={handleChange}
        />
      </InputGroup>
      <InputGroup
        size="sm"
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <InputLeftAddon as="label" for="incorso" children="In Corso" borderRadius="md" />
        <Input
          id="incorso"
          name="incorso"
          variant="flushed"
          type="number"
          w="2em"
          step={0.5}
          min={0}
          textAlign="center"
          value={preferences.incorso}
          onChange={handleChange}
        />
      </InputGroup>
    </Box>
  );
};

// const MediaComponent = ({ preferences, setPreferences, ...props }) => {};

/**
 * @param {Object} props
 * @param {import('../model/PreferencesType').Preferences} props.options
 * */
export default function PreferencesTab({
  preferences,
  setPreferences,
  ...props
}) {
  const legendPosition = useBreakpointValue({
    base: 'center',
    md: 'center',
  });
  return (
    <Box
      border="1px"
      borderColor={borderColor}
      borderRadius="md"
      as="fieldset"
      w={exactWidth}
    >
      <legend align={legendPosition}>Preferenze</legend>
      <SimpleGrid
        templateColumns={{
          base: '1fr',
          md: '1fr 2fr',
        }}
        templateAreas={{
          base: `"Rimuovi" "Bonus"`,
          md: `"Rimuovi Bonus"`,
        }}
        gap={2}
        width="100%"
        justifyContent="center"
        py={2}
        {...props}
      >
        <RemoveComponent
          preferences={preferences}
          setPreferences={setPreferences}
          gridArea="Rimuovi"
        />
        <BonusComponent
          gridArea="Bonus"
          preferences={preferences}
          setPreferences={setPreferences}
        />
      </SimpleGrid>
    </Box>
  );
}
