import { ArrowDownIcon, AtSignIcon, CalendarIcon, SearchIcon } from '@chakra-ui/icons';
import {
    Accordion,
    AccordionButton,
    AccordionIcon,
    AccordionItem,
    AccordionPanel,
    Box,
    Button,
    ExpandedIndex,
    Grid,
    GridItem,
    Input,
    InputGroup,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    NumberInput,
    NumberInputField,
    Text,
    useToast
} from '@chakra-ui/react';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import {
    API_FETCH_POLITO_URL, FetchFromPolitoResponse, Pathway
} from '../../../../pages/api/polito/fetch';
import { CourseType } from '../../../../pages/api/polito/search';
import PathwaysTabs from './PathwaysTabs';
import ResultTabs from './ResultTabs';
import SearchTabs from './SearchTabs';

export const PolitoLabel = () => (
  <>
    <Image src={'/images/PoliTo.svg'} alt={''} width={25} height={25} />
    <Text ml={'1em'}> PoliTo</Text>
  </>
);

export interface PolitoFormData  { year: number, name: string, type: CourseType, pathways?: Pathway[], pathwaySelected?: Pathway , cdsSelected?: string}

const currentYear = (new Date()).getFullYear();
const initialFormData : PolitoFormData = {
    year: currentYear,
    name: '',
    type: CourseType.LT,
    pathways: undefined,
    pathwaySelected: undefined,
    cdsSelected: undefined,
}

const ModalFromPolito: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
}> = ({ isOpen, onClose, onOpen }) => {
  const [formData, setFormData] = useState(initialFormData);

  const [isFetching, setIsFetching] = useState(false);
  const toast = useToast();
  const [tabOpens, setOpenTabs] = useState([0] as ExpandedIndex);

  const fetchFromPolito = async (
    cdsUrl: string,
    year: number
  ): Promise<Extract<FetchFromPolitoResponse, { pathways: Pathway[] }>> => {
    let result: FetchFromPolitoResponse = {
      error: 'la richiesta non è andata a buon fine',
    };
    try {
      result = (await (
        await fetch(`${API_FETCH_POLITO_URL}?url=${cdsUrl}&year=${year}`, {
          method: 'GET',
        })
      ).json()) as FetchFromPolitoResponse;
      if ('error' in result) {
        throw new Error(result.error);
      }
    } catch {
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
    } finally {
      return result as Extract<FetchFromPolitoResponse, { pathways: Pathway[] }>;
    }
  };

  useEffect(() => {
    if(formData.cdsSelected === undefined) return;
    setIsFetching(true)
    fetchFromPolito(formData.cdsSelected, formData.year).then(value => {
      setFormData({...formData, pathways: value.pathways, pathwaySelected: value.pathways?.length === 1 ? value.pathways[0] : undefined});
      setIsFetching(false);
    });
  }, [formData.cdsSelected, formData.year]);

  useEffect(() => {
    if(formData.pathways === undefined) return;
    if(formData.pathwaySelected !== undefined) setOpenTabs([2]);
    else setOpenTabs([1]);
    }, [formData.pathways])


  return (
    <Modal isOpen={isOpen} onClose={onClose} scrollBehavior={'inside'}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>PoliTo</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Accordion
            mt={'1em'}
            allowToggle
            index={tabOpens}
            onChange={setOpenTabs}
            style={{
              cursor: (isFetching ? "wait" : "auto") + "!important",
            }}
          >
            <AccordionItem>
              <h2>
                <AccordionButton>
                  <Box flex="1" textAlign="center" fontSize={'xl'}>
                    <SearchIcon pr={2} />
                    Cerca
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel>
                <SearchTabs formData={formData} setFormData={setFormData}/>
              </AccordionPanel>
            </AccordionItem>
            <AccordionItem hidden={formData.pathways === undefined || formData.pathways.length <= 1 }>
              <h2>
                <AccordionButton>
                  <Box flex="1" textAlign="center" fontSize={'xl'}>
                    <AtSignIcon pr={2} />
                    Percorsi
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel blur={isFetching}>
                <PathwaysTabs pathways={formData.pathways} setSelectedPathway={(p: Pathway) => {setFormData((initial) => ({...initial, pathwaySelected: p}));setOpenTabs([2])}} />
              </AccordionPanel>
            </AccordionItem>
            <AccordionItem hidden={formData.pathwaySelected === undefined}>
              <h2>
                <AccordionButton>
                  <Box flex="1" textAlign="center" fontSize={'xl'}>
                    <CalendarIcon /> Materie
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel>
                <ResultTabs result={formData.pathwaySelected} closeModal={onClose} />
              </AccordionPanel>
            </AccordionItem>
          </Accordion>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ModalFromPolito;
