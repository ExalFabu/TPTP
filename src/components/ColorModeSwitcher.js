import React from 'react';
import { useColorMode, useColorModeValue, Button } from '@chakra-ui/react';
import { FaMoon, FaSun } from 'react-icons/fa';

export const ColorModeSwitcher = props => {
  const { toggleColorMode } = useColorMode();
  const text = useColorModeValue('Modalità scura', 'Modalità chiara');
  const SwitchIcon = useColorModeValue(FaMoon, FaSun);

  return (
    <Button
      size="sm"
      fontSize="lg"
      aria-label={text}
      variant="outline"
      // color="current"
      // marginLeft="2"
      onClick={toggleColorMode}
      leftIcon={<SwitchIcon />}
      {...props}
    >
      {text}
    </Button>
  );
};
