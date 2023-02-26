import {
    AlertDialog,
    AlertDialogBody, AlertDialogCloseButton, AlertDialogContent, AlertDialogFooter,
    AlertDialogHeader, AlertDialogOverlay, Button, Checkbox, CSSObject, Grid, GridItem,
    Switch, Tab, Table, TableContainer, TabList, TabPanel, TabPanels, Tabs, Tbody, Td,
    Text, Th, Thead, Tr, useColorModeValue, useDisclosure
} from "@chakra-ui/react"
import React, { useCallback, useEffect, useReducer, useRef } from 'react'
import { useAppDispatch } from "../../../../app/hooks"
import { Pathway, PolitoLecture } from "../../../../pages/api/polito/fetch"
import { dangerouslySetAllLectures, ILecture } from "../../../lectures/lectureDuck"

const disabledTabCss: CSSObject = {
    cursor: "not-allowed",
    textDecoration: "line-through",
}

interface ImportableLectures extends PolitoLecture {
    checked?: boolean,
    alternativeSelected?: string,
}

type ImportableAction = {
    type: "check",
    payload: {
        codice: string,
    }
} | {
    type: "resetLectures",
    payload: Pathway
}

const buildInitialImportableLectures = (lectures: PolitoLecture[]): ImportableLectures[] => {
    
    const toReturn=  lectures.map(l => ({ ...l, checked: l.isMandatory }))
    toReturn.filter(l => l.alternative !== undefined).forEach(l => {
        const alternative = toReturn.find(l2 => l2.codice === l.alternative)
        if (alternative !== undefined)
            alternative.checked = !l.checked
    })
    console.log("initial importable lectures", toReturn)
    return toReturn;
}

const reducer = (state: ImportableLectures[], action: ImportableAction): ImportableLectures[] => {
    switch (action.type) {
        case "check": {
            return state.map(lec => {
                if (lec.codice === action.payload.codice)
                    lec.checked = !lec.checked
                else if (lec.alternative !== undefined && lec.alternative === action.payload.codice){
                    lec.checked = !lec.checked
                }
                return lec
            })
        }
        case "resetLectures": {
            return buildInitialImportableLectures(action.payload.lectures);
        }
        default: return state
    }
}

const ImportableLecturesTable = ({ list, checkboxAction }: { list: ImportableLectures[], checkboxAction: (i: ImportableLectures) => void}) => {
    const tableColorScheme = useColorModeValue("teal", "facebook")

    return (
        <Table w={"100%"} variant="striped" verticalAlign={"middle"} textAlign={"center"} colorScheme={tableColorScheme}>
            <Thead>
                <Tr>
                    <Th /><Th>Importa </Th>
                </Tr>
            </Thead>
            <Tbody verticalAlign={"center"}>
                {list.map(i => (
                    <Tr key={i._id}>
                        <Td px={0} py={1}>
                            <Text textAlign={"center"} fontSize="md">{i.name}</Text>
                        </Td>
                        <Td px={0} py={1} textAlign={"center"}>
                            <Checkbox size={"lg"} isChecked={i.checked} onChange={() => checkboxAction(i)} />
                        </Td>
                    </Tr>
                ))}
            </Tbody>
        </Table>
    )
}


const ResultTabs: React.FC<{ result: Pathway | undefined, closeModal: () => void }> = ({ result, closeModal }) => {
    if (result === undefined || "error" in result)
        return <></>

    const [importable, dispatch] = useReducer(reducer, buildInitialImportableLectures(result.lectures))
    useEffect(() => {
        dispatch({ type: "resetLectures", payload: result })
    }, [result])
    const appDispatch = useAppDispatch()
    const { isOpen: isOpenAlert, onOpen: onOpenAlert, onClose: onCloseAlert } = useDisclosure()
    const alertCancelRef = useRef<HTMLButtonElement>(null);
    const finallyImport = (importableLectuers: ImportableLectures[]) => {
        const lecturesToImport = importableLectuers.filter(i => i.checked);
        // TODO: Alert con conferma ?
        appDispatch(dangerouslySetAllLectures(lecturesToImport))
        closeModal()
        onCloseAlert()
    }
    const checkboxAction = useCallback((i: ImportableLectures) => { dispatch({ type: "check", payload: { codice: i.codice } }) }, [])


    if (importable.length === 0)
        return <>
            <Text>Nessun dato trovato su questo corso</Text>
        </>
    return (
        <>
            <Grid templateColumns={"1fr 1fr"} justifyContent="center" alignItems={"center"}>
                <GridItem display={"inline-grid"} textAlign={"center"} colSpan={2}>
                    <Text>{result.name}</Text>
                </GridItem>
            </Grid>
            <Tabs isLazy align="center" variant="enclosed-colored" >
                <TabList>
                    <Tab isDisabled={importable.length === 0} _disabled={disabledTabCss}>
                        Materie {/*{`(${importable.reduce((count, curr) => (count + ((curr.kind === "regular" && !curr.isDubious) ? 1 : 0)), 0)})`} */}
                    </Tab>
                    <Tab isDisabled={importable.every(i => i.isMandatory)} _disabled={disabledTabCss}>
                        Opzionali
                    </Tab>
                    
                </TabList>
                <TabPanels>
                    <TabPanel>
                        <ImportableLecturesTable list={importable.filter(i => i.isMandatory)} checkboxAction={checkboxAction} />
                    </TabPanel>
                    <TabPanel>
                        <ImportableLecturesTable list={importable.filter(i => !i.isMandatory)} checkboxAction={checkboxAction} />
                    </TabPanel>
                </TabPanels>
            </Tabs>
            <Button colorScheme={"green"} onClick={onOpenAlert} my={10}>Importa {importable.reduce((count, curr) => (count + (curr.checked ? 1 : 0)), 0)}/{importable.length} materie</Button>
            <AlertDialog
                motionPreset='slideInBottom'
                onClose={onCloseAlert}
                isOpen={isOpenAlert}
                isCentered
                leastDestructiveRef={alertCancelRef}
            >
                <AlertDialogOverlay />

                <AlertDialogContent>
                    <AlertDialogHeader>Vuoi sovrascrivere le materie?</AlertDialogHeader>
                    <AlertDialogCloseButton />
                    <AlertDialogBody>
                        L'operazione non è reversibile
                    </AlertDialogBody>
                    <AlertDialogFooter>
                        <Button ref={alertCancelRef} onClick={onCloseAlert}>
                            No
                        </Button>
                        <Button colorScheme='green' onClick={() => finallyImport(importable)} ml={3}>
                            Si
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )

}

export default React.memo(ResultTabs);
