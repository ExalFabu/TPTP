import React from 'react';
import { useColorMode, useColorModeValue, Button } from '@chakra-ui/react';
import { FaMoon, FaSun } from 'react-icons/fa';

const ColorModeSwitcher = props => {
  const { toggleColorMode } = useColorMode();
  const text = useColorModeValue('Modalità Scura', 'Modalità Chiara');
  const SwitchIcon = useColorModeValue(FaMoon, FaSun);

  return (
    <Button
      size="sm"
      fontSize="md"
      aria-label={text}
      variant="outline"
      onClick={toggleColorMode}
      leftIcon={<SwitchIcon />}
      {...props}
    >
      {text}
    </Button>
  );
};

export default React.memo(ColorModeSwitcher)