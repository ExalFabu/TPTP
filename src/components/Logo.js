import React from 'react';
import { Image, useColorModeValue } from '@chakra-ui/react';
import logo_black from './logos/logofhd-b.png';
import logo_white from './logos/logofhd-w.png';

const WhiteLogo = ({ colorMode, ...props}) => {
  return <Image alt="TPTP Logo" display={colorMode==="black" ? "inherit" : "none"} src={logo_white} {...props} />
}

const BlackLogo = ({colorMode, ...props}) => {
  return <Image alt="TPTP Logo" display={colorMode==="white" ? "inherit" : "none"} src={logo_black} {...props} />
}

export const Logo = props => {
  const colorMode = useColorModeValue("white", "black");
  return <>
    <BlackLogo colorMode={colorMode} {...props}/>

    <WhiteLogo colorMode={colorMode} {...props}/>

  </>
};
