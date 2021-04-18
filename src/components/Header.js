import { Container, GridItem, SimpleGrid } from '@chakra-ui/layout';
import React from 'react';
import { ColorModeSwitcher } from './ColorModeSwitcher';
import { Logo } from './Logo';

export default function Header() {
  return (
    <Container alignContent="center">
      <SimpleGrid
        templateAreas={`'logo' 'colormodeswitch'`}
        gap={2}
        top={0}
        w="100%"
      >
        <GridItem gridArea="logo" alignSelf="center" justifySelf="center">
          <Logo maxH="2rem" />
        </GridItem>
        <GridItem
          gridArea="colormodeswitch"
          alignSelf="center"
          justifySelf="center"
        >
          <ColorModeSwitcher />
        </GridItem>
      </SimpleGrid>
    </Container>
  );
}
