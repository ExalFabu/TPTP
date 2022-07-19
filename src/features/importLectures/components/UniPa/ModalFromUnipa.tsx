import { DownloadIcon, ExternalLinkIcon, LinkIcon } from "@chakra-ui/icons";
import { Button, ButtonGroup, IconButton, Input, InputGroup, InputLeftAddon, Link, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Text, useToast, UseToastOptions, VStack } from "@chakra-ui/react";
import Image from "next/image";
import React, { useCallback, useReducer, useState } from "react";
import { FaPaste } from "react-icons/fa";
import { API_FETCH_UNIPA_URL, FetchFromUnipaResponse } from "../../../../pages/api/unipa/fetch";
import ResultTabs from "./ResultTabs";

const urlPattern = /^(https\:\/\/)?offertaformativa\.unipa\.it\/offweb\/public\/corso\/visualizzaCurriculum\.seam.*/;
const oidCurriculum = /oidCurriculum=(\d+)/;
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

interface ModalState {
    isLoading: boolean,
    isDataLoaded: boolean,
    hasLoadedOnce: boolean,
    response?: FetchFromUnipaResponse
}
type ModalActionList = "fetching" | "fetched"
interface ModalAction {
    type: ModalActionList;
    payload?: FetchFromUnipaResponse
}

const reducer = (state: ModalState, action: ModalAction): ModalState => {
    switch (action.type) {
        case "fetching": {
            return {
                ...state,
                isLoading: true,
                isDataLoaded: false,
                response: undefined,
                hasLoadedOnce: true
            }
        }
        case "fetched": {
            if (action.payload !== undefined) {
                return {
                    ...state,
                    response: action.payload,
                    isLoading: false,
                    isDataLoaded: true
                }
            }
        }
        default: {
            return state
        }
    }
}

const ModalFromUnipa: React.FC<{ isOpen: boolean, onClose: () => void, onOpen: () => void }> = ({ isOpen, onClose, onOpen }) => {
    const [url, setUrl] = useState("")
    const [data, dispatch] = useReducer(reducer, {
        isLoading: false,
        isDataLoaded: false,
        hasLoadedOnce: false
    })
    const toast = useToast()

    const fetchFromUnipa = useCallback(async (input: string) => {
        let oid: string
        if (input.match(onlyDigits)) {
            oid = input
        } else {
            if (input.match(urlPattern) === null || input.match(oidCurriculum) === null) {
                toast({
                    title: 'Attenzione',
                    description: "Il testo inserito non è valido.",
                    status: 'warning',
                    duration: 1500,
                    isClosable: true,
                    position: "top",
                    variant: "left-accent"
                })
                return
            }
            const matches = input.match(oidCurriculum) as RegExpMatchArray
            oid = matches[1]
        }
        dispatch({ type: "fetching" })
        let result: FetchFromUnipaResponse = { error: "la richiesta non è andata a buon fine" }
        try {
            result = await (await fetch(`${API_FETCH_UNIPA_URL}?oidCurriculum=${oid}`, {
                method: 'GET',
            })).json() as FetchFromUnipaResponse
            
        }catch{
            if(!navigator.onLine){
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
            else{
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
            dispatch({ type: "fetched", payload: result })
        }
    }, [])


    const pasteClipboard = async (inp: string | undefined = undefined) => {
        let toastMessage: UseToastOptions = {}
        try {
            if (inp === undefined && !(typeof navigator.clipboard.readText === "function")) {
                // @ts-ignore
                await navigator.permissions.query({ name: "clipboard-read" })
            }
            const content = inp ?? await navigator.clipboard.readText()
            if ((content.match(urlPattern) !== null && content.match(oidCurriculum) !== null) || content.match(onlyDigits) !== null) {
                setUrl(content)
                toastMessage = {
                    title: 'Ottimo',
                    description: "Testo incollato correttamente",
                    status: 'success',
                    duration: 1000,
                    isClosable: true,
                    position: "top",
                    variant: "subtle"
                }
            }
            else {
                toastMessage = {
                    title: 'Attenzione',
                    description: "Il testo che vuoi incollare non è valido.",
                    status: 'warning',
                    duration: 1500,
                    isClosable: true,
                    position: "top",
                    variant: "subtle"
                }
            }
        } catch {
            toastMessage = {
                title: 'Errore',
                description: "Incolla manualmente",
                status: 'error',
                duration: 1500,
                isClosable: true,
                position: "top",
                variant: "subtle"
            }
        }
        toast(toastMessage);
    }
    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose} scrollBehavior={"inside"}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>
                        UniPa
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Text>
                            Cerca il tuo Corso di Studi{' '}
                            <Link target={"_blank"} textColor={"#0000EE"} href={linkToSearchPage} rel="nofollow">
                                in questa pagina <ExternalLinkIcon />
                            </Link>,
                            copia il link ed incollalo qui sotto. {"  "}
                            <Text as="span" fontSize="xs" textColor={"gray"} ><Link href={examplePage} target="_blank" rel="nofollow">esempio <LinkIcon /></Link></Text>
                        </Text>
                        {/* <Center > */}
                        <VStack mt={"1em"}>
                            <InputGroup w={"100%"}>
                                <InputLeftAddon  ><LinkIcon /></InputLeftAddon>
                                <Input placeholder={"https://offertaformativa.unipa.it/offweb/public/corso/visualizzaCurriculum.seam?oidCurriculum=11111"}
                                    isInvalid={
                                        url !== ""
                                        && (url.match(urlPattern) === null
                                            && url.match(oidCurriculum) === null
                                            && url.match(onlyDigits) === null)
                                    }
                                    type="url"
                                    value={url}
                                    variant="outline"
                                    onChange={(e) => setUrl(e.target.value)}
                                    onPaste={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        const clipboardData = e.clipboardData;
                                        const pastedData = clipboardData.getData('Text');
                                        pasteClipboard(pastedData)
                                    }}
                                    onKeyUp={(e)=>{
                                        if(e.key === 'Enter' || e.keyCode === 13){
                                            fetchFromUnipa(url)
                                        }
                                    }}
                                />
                                <IconButton colorScheme={"blue"} aria-label="incolla" icon={<FaPaste />} onClick={() => pasteClipboard()} />
                            </InputGroup>
                            <ButtonGroup>
                                <Button isLoading={data.isLoading} loadingText={"Importando..."} leftIcon={<DownloadIcon />} onClick={() => fetchFromUnipa(url)}>
                                    Recupera le lezioni
                                </Button>
                            </ButtonGroup>
                            <ResultTabs result={data.response} closeModal={onClose}/>
                        </VStack>
                        {/* </Center> */}
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    )
}

export default React.memo(ModalFromUnipa)