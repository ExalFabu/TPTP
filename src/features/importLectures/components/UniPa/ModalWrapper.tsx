import { DownloadIcon, ExternalLinkIcon, LinkIcon, SearchIcon } from "@chakra-ui/icons";
import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Box, Button, ButtonGroup, ExpandedIndex, IconButton, Input, InputGroup, InputLeftAddon, Link, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Text, useToast, UseToastOptions, VStack } from "@chakra-ui/react";
import Image from "next/image";
import React, { useCallback, useEffect, useReducer, useState } from "react";
import { FaPaste } from "react-icons/fa";
import { API_FETCH_UNIPA_URL, FetchFromUnipaResponse } from "../../../../pages/api/unipa/fetch";
import { SearchResult } from "../../../../pages/api/unipa/search";
import ResultTabs from "./ResultTabs";
import SearchTabs from "./SearchTabs";

// const urlPattern = /^(https\:\/\/)?offertaformativa\.unipa\.it\/offweb\/public\/corso\/visualizzaCurriculum\.seam.*/;
const oidCurriculum = /oidCurriculum=(\d{4,})/;
const onlyDigits = /^\d{4,}$/

const linkToSearchPage = "https://offertaformativa.unipa.it/offweb/public/corso/ricercaSemplice.seam"
const examplePage = "https://offertaformativa.unipa.it/offweb/public/corso/visualizzaCurriculum.seam?oidCurriculum=18418"
const buildUrl = (oid: string | number) => `https://offertaformativa.unipa.it/offweb/public/corso/visualizzaCurriculum.seam?oidCurriculum=${oid}`

export const UnipaLabel = () => <><Image
    src={"/images/UniPa.svg"}
    alt={""}
    width={25}
    height={25}
/>
    <Text ml={"1em"}> UniPa</Text>
</>

// type UnipaAction = |
// {
//     type: "ChooseCdS",
//     payload: {
//         url: string,
//         name: string,
//         year: string,

//     }
// }
// interface UnipaState {
//     search: {
//         url: string,
//         cdsFound: SearchResult[] | undefined,
//         cdsFiltered: SearchResult[] | undefined
//         lastYear: number
//     }
//     result: {
//         data: FetchFromUnipaResponse | undefined,
//         tabOpens: ExpandedIndex
//     }
// }

// const initialUnipaState: UnipaState = {
//     search: {
//         url: "",
//         cdsFiltered: undefined,
//         cdsFound: undefined,
//         lastYear: 0,
//     },
//     result: {
//         data: undefined,
//         tabOpens: [0],
//     }
// }

// const unipaReducer = (state: UnipaState, action: UnipaAction): UnipaState{
//     switch (action.type) {
//         case "ChooseCdS": {

//         }
//         default:
//             return state
//     }
// }


const ModalFromUnipa: React.FC<{ isOpen: boolean, onClose: () => void, onOpen: () => void }> = ({ isOpen, onClose, onOpen }) => {
    const [url, setUrl] = useState("")
    const [data, setResponse] = useState(undefined as unknown as FetchFromUnipaResponse)
    const toast = useToast()
    const [tabOpens, setOpenTabs] = useState([0] as ExpandedIndex)

    const fetchFromUnipa = async (input: string): Promise<FetchFromUnipaResponse> => {
        let oid: string
        if (input.match(onlyDigits)) {
            oid = input
        } else {
            const matches = input.match(oidCurriculum) as RegExpMatchArray
            oid = matches[1]
        }
        let result: FetchFromUnipaResponse = { error: "la richiesta non è andata a buon fine" }
        try {
            result = await (await fetch(`${API_FETCH_UNIPA_URL}?oidCurriculum=${oid}`, {
                method: 'GET',
            })).json() as FetchFromUnipaResponse

        } catch {
            // TODO: Move this check somewhere else
            if (!navigator.onLine) {
                toast({
                    title: 'Offline',
                    description: "Non puoi importare le materie senza una connessione ad Internet",
                    status: 'info',
                    duration: 1500,
                    isClosable: false,
                    position: "top",
                    variant: "top-accent"
                })
            }
            else {
                toast({
                    title: 'Oops',
                    description: "Qualcosa è andato storto... riprova più tardi",
                    status: 'error',
                    duration: 1500,
                    isClosable: true,
                    position: "top",
                    variant: "left-accent"
                })
            }
        }
        finally {
            return result
        }
    }


    useEffect(() => {
        if (url !== ""
            && (url.match(oidCurriculum) !== null
                || url.match(onlyDigits) !== null)) {
            // if URL is valid
            console.log("Fetching " + url)
            fetchFromUnipa(url).then(value => { setResponse(value); setOpenTabs([1]) })
        }
    }, [url]
    )

    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose} scrollBehavior={"inside"} >
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>
                        UniPa
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>

                        <Accordion mt={"1em"} allowMultiple allowToggle index={tabOpens}
                            onChange={setOpenTabs}>
                            <AccordionItem>
                                <h2>
                                    <AccordionButton>
                                        <Box flex='1' textAlign='left' fontSize={"xl"}>
                                            <SearchIcon pr={2} />Cerca
                                        </Box>
                                        <AccordionIcon />
                                    </AccordionButton>
                                </h2>
                                <AccordionPanel>
                                    <SearchTabs setUrl={setUrl} />
                                </AccordionPanel>
                            </AccordionItem>
                            <AccordionItem isDisabled={data === undefined}>
                                <h2>
                                    <AccordionButton>
                                        <Box flex='1' textAlign='left' fontSize={"xl"}>
                                            Risultati
                                        </Box>
                                        <AccordionIcon />
                                    </AccordionButton>
                                </h2>
                                <AccordionPanel>
                                    <ResultTabs result={data} closeModal={onClose} />
                                    {/* TODO: Problema con lo stato, prova a selezionare due corsi di fila :( */}
                                </AccordionPanel>
                            </AccordionItem>
                        </Accordion>
                        {/* </Center> */}
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    )
}

export default ModalFromUnipa