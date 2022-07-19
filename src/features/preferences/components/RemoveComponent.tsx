import { Checkbox } from '@chakra-ui/checkbox';
import { useColorModeValue } from '@chakra-ui/color-mode';
import { InfoIcon } from '@chakra-ui/icons';
import { Input, InputGroup, InputRightAddon } from '@chakra-ui/input';
import { Box, SimpleGrid } from '@chakra-ui/layout';
import { useBreakpointValue } from '@chakra-ui/media-query';
import {
  Popover, PopoverArrow, PopoverBody,
  PopoverCloseButton,
  PopoverContent, PopoverHeader, PopoverTrigger
} from '@chakra-ui/popover';
import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { borderColor } from '../../../theme';
import { editPreference, selectPreferences } from '../preferencesDuck';

const InfoRemovePopover = React.memo(() => {
  const legendPosition = useBreakpointValue({
    base: 'left',
    md: 'center',
  });
  const greenInfoColor = useColorModeValue('green.600', 'green.300');
  const [isPopoverOpen, setPopoverOpen] = useState(false);
  const openPopover = () => setPopoverOpen(true);
  const closePopover = () => setPopoverOpen(false);

  return (
    <Popover
      isOpen={isPopoverOpen}
      onClose={closePopover}
      placement="top-start"
      colorScheme="whatsapp"
    >
      <PopoverTrigger>
        <legend
          /*
          // @ts-ignore  Needed workaround */
          align={legendPosition}>
          Rimuovi{' '}
          <InfoIcon
            color={greenInfoColor}
            boxSize="0.8em"
            aria-label="Pulsante per informazioni aggiuntive sulla sezione Rimuovi"
            focusable={true}
            onClick={openPopover}
          />
        </legend>
      </PopoverTrigger>
      <PopoverContent>
        <PopoverArrow />
        <PopoverCloseButton />
        <PopoverHeader textAlign="center">Rimuovi cosa?</PopoverHeader>
        <PopoverBody fontSize="sm">
          <div>
            A seconda dal Corso di Studi, è prevista la rimozione di alcune
            materie dalla valutazione secondo diversi criteri.
            <ul style={{ listStyleType: 'none' }}>
              <li>
                - Rimuovi <code>x</code> CFU di materie <i>non</i>{' '}
                caratterizzanti
              </li>
              <li>
                - Rimuovi <code>y</code> Materie <i>non</i> caratterizzanti
              </li>
            </ul>
          </div>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
});

export default function RemoveComponent({
  ...props
}) {

  const preferences = useAppSelector(selectPreferences)
  const dispatch = useAppDispatch()

  const borderStyle = useBreakpointValue({
    base: { border: '1px' },
    md: { border: '1px' },
  });

  return (
    <Box
      {...props}
      as="fieldset"
      {...borderStyle}
      borderColor={borderColor}
      borderRadius="xl"
      p={2}
      mx={2}
      h="min-content"
    >
      <InfoRemovePopover />
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
              dispatch(
                editPreference({
                  key: "removeCFU",
                  value: true
                })
              )
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
            placeholder="0"
            min={0}
            value={preferences.cfu_value}
            onChange={e => {
              dispatch(
                editPreference(
                  [
                    { key: "cfu_value", value: Math.abs(e.target.valueAsNumber) },
                    { key: "removeCFU", value: true }
                  ]
                )
              )
              // setPreferences({
              //   ...preferences,
              //   removeCFU: true,
              //   cfu_value: Math.abs(e.target.valueAsNumber),
              // });
            }}
            textAlign="center"
            onClick={(e) => {
              (e.target as HTMLInputElement).select();
              dispatch(
                editPreference({
                  key: "removeCFU",
                  value: true
                })
              )
              // setPreferences({
              //   ...preferences,
              //   removeCFU: true,
              // });
            }}
          />
          <InputRightAddon
            as="label"
            htmlFor="cfu_val"
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
            colorScheme="green"
            onChange={e => {
              if (e.target.checked === false) return;
              dispatch(
                editPreference({
                  key: "removeCFU",
                  value: false
                })
              )
              // setPreferences({
              //   ...preferences,
              //   removeCFU: false,
              // });
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
            placeholder="0"
            min={0}
            value={preferences.mat_value}
            onChange={e => {
              dispatch(
                editPreference(
                  [
                    { key: "mat_value", value: Math.abs(e.target.valueAsNumber) },
                    { key: "removeCFU", value: false }
                  ]
                )
              )
              // setPreferences({
              //   ...preferences,
              //   removeCFU: false,
              //   mat_value: Math.abs(e.target.valueAsNumber),
              // });
            }}
            textAlign="center"
            onClick={e => {
              (e.target as HTMLInputElement).select();
              dispatch(
                editPreference({
                  key: "removeCFU",
                  value: false
                })
              )
            }}
          />
          <InputRightAddon
            as="label"
            htmlFor="mat_val"
            borderRadius="md"
            children="Materie"
          />
        </InputGroup>
      </SimpleGrid>
    </Box>
  );
}
