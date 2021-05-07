import React from 'react';
import { Box, useColorModeValue } from '@chakra-ui/react';
// import logo_black from './logos/logofhd-b.png';
// import logo_white from './logos/logofhd-w.png';
import Image from 'next/image';

const WhiteLogo = ({ colorMode, ...props }) => {
  return (
    <Box display={colorMode === 'black' ? 'inherit' : 'none'}>
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

const BlackLogo = ({ colorMode, ...props }) => {
  return (
    <Box display={colorMode === 'white' ? 'inherit' : 'none'}>
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

const Logo = props => {
  const colorMode = useColorModeValue('white', 'black');
  return (
    <>
      <BlackLogo colorMode={colorMode} {...props} />

      <WhiteLogo colorMode={colorMode} {...props} />
    </>
  );
};
export default React.memo(Logo)
