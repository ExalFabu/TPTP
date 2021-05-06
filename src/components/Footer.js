import { Button } from '@chakra-ui/button';
import { Box, Flex, Text } from '@chakra-ui/layout';
import React from 'react';
import { FaGithub, FaRegCopyright } from 'react-icons/fa';
import { exactWidth } from '../theme';

function Footer({ ...props }) {
  return (
    <Box
      as="footer"
      pt={10}
      pb={2}
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
      />
    </Box>
  );
}

export default Footer;
