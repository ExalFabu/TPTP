import { Button } from '@chakra-ui/button';
import { Box } from '@chakra-ui/layout';
import React from 'react';
import { FaGithub, FaMugHot } from 'react-icons/fa';

function Footer({ ...props }) {
  return (
    <Box
      as="footer"
      py={2}
      role="contentinfo"
      {...props}
      display="flex"
      justifyContent="space-evenly"
    >
      <Button as="a" variant="link" rel={"nofollow"} href="https://ko-fi.com/T6T1DWHNM" target={'_blank'} leftIcon={<FaMugHot/>} fontFamily="monospace" fontSize="sm">Buy me a Coffee</Button>
      <Button
        as="a"
        href={'https://github.com/ExalFabu/TPTP'}
        leftIcon={<FaGithub />}
        children="Github"
        variant="link"
        rel="nofollow"
        target='_blank'
      />
    </Box>
  );
}

export default React.memo(Footer);
