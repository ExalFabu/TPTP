import { ArrowDownIcon } from '@chakra-ui/icons';
import {
  InputGroup,
  Input,
  Button,
  Grid,
  NumberInput,
  NumberInputField,
  GridItem,
  Box,
  VStack,
  useToast,
  HStack,
  Switch,
  Text,
} from '@chakra-ui/react';
import React, { Dispatch, SetStateAction, useState, useEffect } from 'react';
import {
  API_SEARCH_POLITO_URL,
  CourseType,
  PolitoSearchResult,
} from '../../../../pages/api/polito/search';
import { PolitoFormData } from './ModalWrapper';


const currentYear = (new Date()).getFullYear();

const SearchForm: React.FC<{
    formData: PolitoFormData;
    setFormData: Dispatch<SetStateAction<PolitoFormData>>;
  }> = ({ formData, setFormData }) => {

    return (
    <Grid
      templateColumns={'1fr 3fr'}
      gap={2}
      textAlign="center"
      alignItems={'center'}
      pb={5}
    >
      <label htmlFor="yearCdsField">
        {' '}
        <strong> Anno d'Iscrizione </strong>{' '}
      </label>
      <label htmlFor="nameCdsField">
        {' '}
        <strong> Corso di Studi </strong>
      </label>
      <NumberInput
        step={1}
        variant="flushed"
        value={formData.year}
        onChange={e => setFormData({ ...formData, year: parseInt(e) })}
        min={currentYear - 15}
        max={currentYear}
        size="md"
        allowMouseWheel
        inputMode="numeric"
      >
        <NumberInputField
          id="yearCdsField"
          name="yearCdsField"
          pr={0}
          textAlign="center"
          maxLength={4}
          minLength={4}
        />
      </NumberInput>
      <InputGroup>
        <Input
          id="nameCdsField"
          name="nameCdsField"
          textAlign="center"
          type="text"
          value={formData.name}
          variant="flushed"
          onChange={e => setFormData({ ...formData, name: e.target.value })}
          onClick={e => {
            (e.target as HTMLInputElement).select();
          }}
        />
      </InputGroup>
      <GridItem colSpan={2}>
        <HStack>
          <Text>LT</Text>
          <Switch isChecked={formData.type === CourseType.LM} onChange={e => {
            if (e.target.checked) {
              setFormData({ ...formData, type: CourseType.LM });
            } else {
              setFormData({ ...formData, type: CourseType.LT });
            }
          }}/>
          <Text>LM</Text>
        </HStack>
      </GridItem>
    </Grid>
  );
};

const SearchResultList: React.FC<{
  results: PolitoSearchResult[];
  setFormData: Dispatch<SetStateAction<PolitoFormData>>;
}> = ({ results, setFormData }) => {
  if (!Array.isArray(results)) return <></>;

  return (
    <VStack maxH={'300px'} overflowY="scroll">
      {results.map(cds => {
        return (
            <Box
              pt={2}
              fontWeight={'semibold'}
              textDecorationLine={'underline'}
              as="button"
              w="100%"
              boxShadow={'0 -1px 0 #fff'}
              key={cds.name +"_"+ cds.link}
              onClick={() => setFormData((initial) => ({...initial, cdsSelected: cds.link}))}
            >
              {cds.name}
            </Box>
          );
        }
        )
      }
    </VStack>
  );
};

const SearchWrapper: React.FC<{
  formData: PolitoFormData;
  setFormData: Dispatch<SetStateAction<PolitoFormData>>;
}> = ({ formData, setFormData }) => {
  const [cdsFound, setCdsFound] = useState([] as PolitoSearchResult[]);
  const [cdsFiltered, setCdsFiltered] = useState([] as PolitoSearchResult[]);
  const toast = useToast();

  useEffect(() => {
    fetch(`${API_SEARCH_POLITO_URL}?tipo=${formData.type}`)
      .then(res => res.json())
      .then(res => setCdsFound(res))
      .catch(_ => {
        if (!navigator.onLine) {
            toast({
              title: 'Offline',
              description:
                'Non puoi importare le materie senza una connessione ad Internet',
              status: 'info',
              duration: 1500,
              isClosable: false,
              position: 'top',
              variant: 'top-accent',
            });
          } else {
            toast({
              title: 'Oops',
              description: 'Qualcosa è andato storto... riprova più tardi',
              status: 'error',
              duration: 1500,
              isClosable: true,
              position: 'top',
              variant: 'left-accent',
            });
        }
      });
  }, [formData.type]);

  useEffect(() => {
    setCdsFiltered(
        cdsFound.filter(result =>
            result.name.toLowerCase().includes(formData.name.toLowerCase())
        )
    );
    }, [formData.name, cdsFound]);

    

  return (
    <>
      <SearchForm formData={formData} setFormData={setFormData} />
      <SearchResultList results={cdsFiltered} setFormData={setFormData} />
    </>
  );
};

export default React.memo(SearchWrapper);
