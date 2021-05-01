import React from 'react';
import { Image, useColorModeValue } from '@chakra-ui/react';
import logo_black from './logos/logofhd-b.png';
import logo_white from './logos/logofhd-w.png';


export const Logo = props => {
  const logo_v = useColorModeValue(logo_black, logo_white)
  return <Image alt="TPTP Logo" src={logo_v} {...props}/>;
};
