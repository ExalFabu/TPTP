import {
  Accordion, AccordionButton, AccordionIcon,
  AccordionItem,
  AccordionPanel
} from '@chakra-ui/accordion';
import { SimpleGrid } from '@chakra-ui/layout';
import React from 'react';
import { borderColor, exactWidth } from '../../theme';
import BonusComponent from './components/BonusComponent';
import FinalBonusComponent from './components/FinalBonusComponent';
import RemoveComponent from './components/RemoveComponent';

/**
 * @param {Object} props
 * @param {import('../model/PreferencesType').Preferences} props.options
 * */

const PreferencesTab = ({
  ...props
}) => {
  return (
    <Accordion
      w={{ ...exactWidth, xl: exactWidth.base }}
      allowToggle
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
              xl: '1fr'
            }}
            templateAreas={{
              base: `"Rimuovi" "Bonus" "AverageBonus"`,
              md: `"Rimuovi Bonus" "AverageBonus AverageBonus"`,
              xl: `"Rimuovi" "Bonus" "AverageBonus"`,

            }}
            gap={2}
            width={exactWidth}
            justifyContent="center"
            py={2}
          >
            <RemoveComponent
              gridArea="Rimuovi"
            />
            <BonusComponent
              gridArea="Bonus"
            />
            <FinalBonusComponent
              gridArea="AverageBonus"
            />
          </SimpleGrid>
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
};

export default React.memo(PreferencesTab);
