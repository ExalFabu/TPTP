import { Box, useColorModeValue } from '@chakra-ui/react';
import React from 'react';
// import logo_black from './logos/logofhd-b.png';
// import logo_white from './logos/logofhd-w.png';
import Image from 'next/image';

const WhiteLogo = ({ display, ...props } : {display: string}) => {
  return (
    <Box display={display}>
      <Image
        width="100%"
        height="100%"
        alt="TPTP Logo"        
        src={'/images/TPTP-w.svg'}
        {...props}
      />
    </Box>
  );
};

const BlackLogo = ({ display, ...props }: {display: string}) => {
  return (
    <Box display={display}>
      <Image
         width="100%"
         height="100%"
         alt="TPTP Logo"        
         src={'/images/TPTP-b.svg'}
         {...props}
      />
    </Box>
  );
};

const Logo = ({...props}) => {
  const colorMode = useColorModeValue('white', 'black');
  return (
    <>
      <BlackLogo display={colorMode === 'white' ? 'inherit' : 'none'} {...props} />

      <WhiteLogo display={colorMode === 'black' ? 'inherit' : 'none'} {...props} />
    </>
  );
};
export default React.memo(Logo)
