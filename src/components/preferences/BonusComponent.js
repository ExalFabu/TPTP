import { Input, InputGroup, InputLeftAddon } from '@chakra-ui/input';
import { Box } from '@chakra-ui/layout';
import { useBreakpointValue } from '@chakra-ui/media-query';
import { borderColor } from '../../theme';
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
import { InfoIcon } from '@chakra-ui/icons';
import { PopoverFooter } from '@chakra-ui/popover';
import { useColorModeValue } from '@chakra-ui/color-mode';

const InfoBonusPopover = React.memo(() => {
  const legendPosition = useBreakpointValue({
    base: 'left',
    md: 'center',
  });

  const [isPopoverOpen, setPopoverOpen] = useState(false);
  const openPopover = () => setPopoverOpen(true);
  const closePopover = () => setPopoverOpen(false);
  const greenInfoColor = useColorModeValue("green.600","green.300")

  return (
    <Popover
        isOpen={isPopoverOpen}
        onClose={closePopover}
        placement="top-start"
        colorScheme="whatsapp"
      >
        <PopoverTrigger>
          <legend align={legendPosition}>
            {' '}
            Bonus{' '}
            <InfoIcon
              color={greenInfoColor}
              boxSize="0.8em"
              aria-label="Pulsante per informazioni aggiuntive sulla sezione Bonus"
              focusable={true}
              onClick={openPopover}
            />
          </legend>
        </PopoverTrigger>
        <PopoverContent>
          <PopoverArrow />
          <PopoverCloseButton />
          <PopoverHeader textAlign="center">Quali Bonus?</PopoverHeader>
          <PopoverBody fontSize="sm">
            <div>
              Per ogni Corso di Studi sono previsti dei Bonus aggiunti al voto
              finale.
              <ul style={{ listStyleType: 'none' }}>
                <li>
                  <b>Lode</b>: Punti aggiunti per ogni Lode ottenuta, con un
                  massimo di 6 Lodi
                </li>
                <li>
                  <b>Erasmus</b>: Punti aggiunti per gli studenti che hanno
                  conseguito almeno 15 CFU all'estero
                </li>
                <li>
                  <b>In Corso</b>: Punti aggiunti per gli studenti che
                  completano gli studi nella durata legale del Corso di Laurea
                </li>
              </ul>
            </div>
          </PopoverBody>
          <PopoverFooter fontSize="sm">
            Suddetti criteri possono variare per diversi Corsi di Studi, è
            quindi <u>altamente consigliato</u> cercare il <i>Regolamento della Prova Finale</i> oppure
            chiedere ai propri rappresentanti
          </PopoverFooter>
        </PopoverContent>
      </Popover>
  )
})

export default function BonusComponent({
  preferences,
  setPreferences,
  ...props
}) {
  const borderStyle = useBreakpointValue({
    base: { border: '1px' },
    md: { border: '1px' },
  });
  const handleChange = e => {
    setPreferences({
      ...preferences,
      [e.target.name]: Math.abs(e.target.valueAsNumber),
    });
  };

  return (
    <Box
      as="fieldset"
      {...borderStyle}
      borderColor={borderColor}
      borderRadius="xl"
      display="flex"
      justifyContent="space-between"
      justifyItems="center"
      alignItems="center"
      p={2}
      {...props}
    >
      <InfoBonusPopover />
      <InputGroup
        size="sm"
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <InputLeftAddon
          as="label"
          for="ptlode"
          children="Lode"
          borderRadius="md"
        />
        <Input
          id="ptlode"
          name="ptlode"
          variant="flushed"
          type="number"
          w="2em"
          step={0.5}
          min={0}
          placeholder="0"
          textAlign="center"
          value={preferences.ptlode}
          onChange={handleChange}
          onClick={e => e.target.select()}
        />
      </InputGroup>
      <InputGroup
        size="sm"
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <InputLeftAddon
          as="label"
          for="erasmus"
          children="Erasmus"
          borderRadius="md"
        />

        <Input
          id="erasmus"
          name="erasmus"
          variant="flushed"
          type="number"
          w="2em"
          step={0.5}
          placeholder="0"
          min={0}
          textAlign="center"
          value={preferences.erasmus}
          onChange={handleChange}
          onClick={e => e.target.select()}
        />
      </InputGroup>
      <InputGroup
        size="sm"
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <InputLeftAddon
          as="label"
          for="incorso"
          children="In Corso"
          borderRadius="md"
        />
        <Input
          id="incorso"
          name="incorso"
          variant="flushed"
          type="number"
          w="2em"
          step={0.5}
          placeholder="0"
          min={0}
          textAlign="center"
          value={preferences.incorso}
          onChange={handleChange}
          onClick={e => e.target.select()}
        />
      </InputGroup>
    </Box>
  );
}
