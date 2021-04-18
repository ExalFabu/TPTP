import { Checkbox } from '@chakra-ui/checkbox';
import {
  Input,
  InputGroup,
} from '@chakra-ui/input';
import {
  Box,
  Center,
  GridItem,
  SimpleGrid,
} from '@chakra-ui/layout';
import React from 'react';

/* 
Rimozione dalla media 
    - [INT] cfu
    - [INT] n. materie
    
Valori utilizzati per calcolare il voto finale
    - Punti per lode: (0,5)
    - Punti per Erasmus (1)
    - Punti per laurea In Corso (2)
    - Punti in base alla media (vedi tabella nel README)

Struttura opzioni
{
  "cfu_or_mat": [true|false]
  "num": [int] (numero di cfu o di materie)
  "bonus": {
    "ppl": [int]
    "erasmus": [int]
    "incorso": [int]
  } 
}
*/

export default function OptionTab({ options, setOptions }) {
  const handleChange = e => {
    console.log(e);
    setOptions({
      ...options,
      [e.target.name]: e.target.valueAsNumber || e.target.value,
    });
  };

  return (
    <Box as="fieldset" border="2px" borderColor="gray.500" borderRadius="lg">
      <legend>Personalizza il calcolo</legend>
      <SimpleGrid
        templateColumns="repeat(2, 1fr)"
        templateAreas={`  
                        "Rimuovi Bonus"
                        
                    `}
        ml="3px"
        gap={2}
        alignItems="center"
      >
        <GridItem gridArea="Rimuovi">
          <Box
            as="fieldset"
            border="1px"
            borderColor="gray.500"
            borderRadius="md"
          >
            <legend>Rimuovi</legend>
            <SimpleGrid
              templateColumns="min-content 1fr"
              templateAreas={`"radios cfus" "radios mats"`}
              columnGap={5}
              rowGap={3}
              alignItems="center"
              justifyItems="center"
            >
              <Checkbox
                name="cfu_checkbox"
                isChecked={options.cfu_or_mat === 'cfu'}
                onChange={e => {
                  if (e.target.checked === false) return;
                  setOptions({
                    ...options,
                    cfu_or_mat: 'cfu',
                  });
                }}
              />
              <Checkbox
                name="cfu_checkbox"
                isChecked={options.cfu_or_mat === 'mat'}
                onChange={e => {
                  if (e.target.checked === false) return;
                  setOptions({
                    ...options,
                    cfu_or_mat: 'mat',
                  });
                }}
              />
              <InputGroup gridArea="cfus" size="sm">
                <Center>
                  <Input
                  
                    w="3em"
                    id="cfu_val"
                    name="cfu_value"
                    variant="flushed"
                    type="number"
                    min={0}
                    value={options.cfu_value}
                    onChange={e => {
                      setOptions({
                        ...options,
                        cfu_or_mat: 'cfu',
                        cfu_value: e.target.valueAsNumber,
                      });
                    }}
                    textAlign="center"
                  />
                  <label for="cfu_val">CFU</label>
                  {/* <InputRightAddon children="CFU" bg="none" border="none" /> */}
                </Center>
              </InputGroup>
              <InputGroup gridArea="mats" size="sm">
                <Center>
                  <Input
                    w="3em"
                    id='mat_val'
                    name="mat_value"
                    variant="flushed"
                    type="number"
                    min={0}
                    value={options.mat_value}
                    onChange={e => {
                      setOptions({
                        ...options,
                        cfu_or_mat: 'mat',
                        mat_value: e.target.valueAsNumber,
                      });
                    }}
                    textAlign="center"
                  />
                  <label for="mat_val">Materie</label>
                </Center>
              </InputGroup>
            </SimpleGrid>
          </Box>
        </GridItem>
        <GridItem gridArea="Bonus">
          <Box
            as="fieldset"
            border="1px"
            borderColor="gray.500"
            borderRadius="md"
            m={2}
            p={2}
          >
            <legend>Bonus</legend>
            <SimpleGrid rowGap={3}>
              <GridItem
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <label for="ptlode"> Punti per Lode </label>
                <Input
                  id="ptlode"
                  name="ptlode"
                  variant="flushed"
                  type="number"
                  w="3em"
                  step={0.5}
                  min={0}
                  textAlign="center"
                  value={options.ptlode}
                  onChange={handleChange}
                />
              </GridItem>
              <GridItem
                display="flex"
                justifyContent="space-around"
                alignItems="center"
                w="100%"
              >
                <Box as="label" for="erasmus"> Erasmus </Box>
                <Input
                  id="erasmus"
                  name="erasmus"
                  variant="flushed"
                  type="number"
                  w="3em"
                  step={0.5}
                  min={0}
                  textAlign="center"
                  value={options.erasmus}
                  onChange={handleChange}
                />
              </GridItem>
              <GridItem
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <label for="incorso"> Laurea in Corso </label>
                <Input
                  id="incorso"
                  name="incorso"
                  variant="flushed"
                  type="number"
                  w="3em"
                  step={0.5}
                  min={0}
                  textAlign="center"
                  value={options.incorso}
                  onChange={handleChange}
                />
              </GridItem>
            </SimpleGrid>
          </Box>
        </GridItem>
      </SimpleGrid>
    </Box>
  );
}
