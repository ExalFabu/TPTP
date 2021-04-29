import { Input, InputGroup, InputLeftAddon } from "@chakra-ui/input";
import { Box } from "@chakra-ui/layout";
import { useBreakpointValue } from "@chakra-ui/media-query";
import { borderColor } from "../../theme";


export default function BonusComponent ({ preferences, setPreferences, ...props }) {
    const borderStyle = useBreakpointValue({
      base: { border: '1px' },
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
        <legend align={legendPosition}> Bonus </legend>
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
            textAlign="center"
            value={preferences.ptlode}
            onChange={handleChange}
            onClick={(e) => e.target.select()}
  
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
            min={0}
            textAlign="center"
            value={preferences.erasmus}
            onChange={handleChange}
            onClick={(e) => e.target.select()}
  
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
            min={0}
            textAlign="center"
            value={preferences.incorso}
            onChange={handleChange}
            onClick={(e) => e.target.select()}
  
          />
        </InputGroup>
      </Box>
    );
  };