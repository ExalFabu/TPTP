import {
  Accordion,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  AccordionButton,
} from '@chakra-ui/accordion';
import { SimpleGrid } from '@chakra-ui/layout';
import React from 'react';
import { borderColor, exactWidth } from '../theme';
import BonusComponent from './preferences/BonusComponent';
import RemoveComponent from './preferences/RemoveComponent';

/**
 * @param {Object} props
 * @param {import('../model/PreferencesType').Preferences} props.options
 * */
export default function PreferencesTab({
  preferences,
  setPreferences,
  ...props
}) {
  return (
    <Accordion
      // as="fieldset"
      w={exactWidth}
      allowToggle
      pt={4}
      colorScheme="telegram"
      {...props}
    >
      <AccordionItem w="100%" border="none">
        <h2>
          <AccordionButton
            display="flex"
            justifyContent="center"
            border="1px"
            borderColor={borderColor}
            borderRadius="full"
            _expanded={{ borderBottomRadius: 'none', borderBottom: 'none' }}
          >
            <span>Modifica Valori</span>
            <AccordionIcon float="right" />
          </AccordionButton>
        </h2>

        <AccordionPanel
          w="100%"
          border="1px"
          borderColor={borderColor}
          borderRadius="3xl"
          borderTop="none"
          borderTopRadius="none"
          display="flex"
          justifyContent="center"
        >
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
            width={exactWidth}
            justifyContent="center"
            py={2}
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
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
}
