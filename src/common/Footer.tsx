import { Button } from '@chakra-ui/button';
import { Box, Text } from '@chakra-ui/layout';
import React from 'react';
import { FaGithub } from 'react-icons/fa';

function Footer({...props}) {
  return (
    <Box
      as="footer"
      py={2}
      role="contentinfo"
      {...props}
      display="flex"
      justifyContent="space-evenly"
    >
      <Text fontFamily="monospace" fontSize="sm">© ExalFabu, 2021</Text>
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
