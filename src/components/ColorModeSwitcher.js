import React from 'react';
import {
  useColorMode,
  useColorModeValue,
  Button,
  useBreakpointValue,
  IconButton,
} from '@chakra-ui/react';
import { FaMoon, FaSun } from 'react-icons/fa';

export const ColorModeSwitcher = props => {
  const { toggleColorMode } = useColorMode();
  const text = useColorModeValue('Modalità scura', 'Modalità chiara');
  const SwitchIcon = useColorModeValue(FaMoon, FaSun);
  const format = useBreakpointValue({ base: 'base', sm: 'sm' });

  return format === 'base' ? (
    <IconButton
      size="sm"
      fontSize="lg"
      aria-label={text}
      onClick={toggleColorMode}
      icon={<SwitchIcon />}
      {...props}
    />
  ) : (
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
