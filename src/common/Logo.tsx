import React from 'react';
import { Box, useColorModeValue } from '@chakra-ui/react';
// import logo_black from './logos/logofhd-b.png';
// import logo_white from './logos/logofhd-w.png';
import Image, { ImageProps } from 'next/image';

const WhiteLogo = ({ display, ...props } : {display: string}) => {
  return (
    <Box display={display}>
      <Image
        width="142px"
        height="79px"
        alt="TPTP Logo"
        
        src={'/logofhd-w.png'}
        {...props}
      />
    </Box>
  );
};

const BlackLogo = ({ display, ...props }: {display: string}) => {
  return (
    <Box display={display}>
      <Image
        width="142px"
        height="79px"
        alt="TPTP Logo"
        src={'/logofhd-b.png'}
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
