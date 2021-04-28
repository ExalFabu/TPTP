import { Checkbox } from "@chakra-ui/checkbox";
import { Input, InputGroup, InputRightAddon } from "@chakra-ui/input";
import { Box, SimpleGrid } from "@chakra-ui/layout";
import { useBreakpointValue } from "@chakra-ui/media-query";
import { borderColor } from "../../theme";


export default function RemoveComponent ({ preferences, setPreferences, ...props }) {
    const borderStyle = useBreakpointValue({
      base: { border: '1px' },
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
        borderRadius="xl"
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
                e.target.select()
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
                e.target.select()
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