import {
    AlertDialog,
    AlertDialogBody, AlertDialogCloseButton, AlertDialogContent, AlertDialogFooter,
    AlertDialogHeader, AlertDialogOverlay, Button, Checkbox, CSSObject, Grid, GridItem,
    Switch, Tab, Table, TableContainer, TabList, TabPanel, TabPanels, Tabs, Tbody, Td,
    Text, Th, Thead, Tr, useColorModeValue, useDisclosure
} from "@chakra-ui/react"
import React, { useCallback, useEffect, useMemo, useReducer, useRef } from 'react'
import { useAppDispatch } from "../../../../app/hooks"
import { FetchFromUnipaResponse } from "../../../../pages/api/unipa/fetch"
import { dangerouslySetAllLectures, ILecture } from "../../../lectures/lectureDuck"

const disabledTabCss: CSSObject = {
    cursor: "not-allowed",
    textDecoration: "line-through",
}

interface ImportableLectures extends ILecture {
    checked: boolean,
    forceCaratt: boolean,
    kind: "regular" | "optional",
    isDubious: boolean
}

type ImportableAction = {
    type: "check",
    payload: {
        lectureId: string,
    }
} | {
    type: "forceCaratt",
    payload: {
        lectureId: string,
        value: boolean
    }
} | {
    type: "resetLectures",
    payload: Extract<FetchFromUnipaResponse, { name: string }>
}

const buildInitialImportable = (result: Extract<FetchFromUnipaResponse, { name: string }>): ImportableLectures[] => {
    const implec = [] as ImportableLectures[]
    const regularLectures = result.lectures.map(l => ({
        ...l,
        checked: true,
        forceCaratt: true,
        kind: "regular",
        isDubious: result.dubious.some(dub => dub._id === l._id)
    } as ImportableLectures))
    const optionalLectures = result.optional.map(l => ({
        ...l,
        checked: false,
        forceCaratt: true,
        kind: "optional",
        isDubious: result.dubious.some(dub => dub._id === l._id)
    } as ImportableLectures))
    // dubious share the same id of regular or optional
    implec.push(...regularLectures, ...optionalLectures)
    return implec
}
const reducer = (state: ImportableLectures[], action: ImportableAction): ImportableLectures[] => {
    switch (action.type) {
        case "check": {
            return state.map(lec => {
                if (lec._id !== action.payload.lectureId)
                    return lec
                lec.checked = !lec.checked
                return lec
            })
        }
        case "forceCaratt": {
            return state.map(lec => {
                if (lec._id !== action.payload.lectureId)
                    return lec
                lec.forceCaratt = action.payload.value
                return lec
            })
        }
        case "resetLectures": {
            return buildInitialImportable(action.payload)
        }
        default: return state
    }
}

const ImportableLecturesTable = ({ list, checkboxAction, switchAction }: { list: ImportableLectures[], checkboxAction: (i: ImportableLectures) => void, switchAction?: (i: ImportableLectures) => void }) => {
    const dubiousTable: boolean = switchAction !== undefined
    const tableColorScheme = useColorModeValue("teal", "facebook")

    const TableHeads = () => useMemo(() => !dubiousTable ? <><Th /><Th>Importa </Th></> : <><Th /><Th p={0.5}>Importa </Th> <Th p={0.5}>Caratterizzante</Th></>, [])
    const tdProps = dubiousTable ? { p: 1.5 } : { px: 0, py: 1 }
    const TableBody = ({ i }: { i: ImportableLectures }) => useMemo(() => {
        return (
            <Tr key={i._id}>
                <Td {...tdProps}>
                    <Text textAlign={"center"} fontSize="md">{i.name}</Text>
                </Td>
                <Td {...tdProps} textAlign={"center"}>
                    <Checkbox size={"lg"} isChecked={i.checked} onChange={() => checkboxAction(i)} />
                </Td>
                {!dubiousTable ? <></> : (
                    <Td {...tdProps} textAlign={"center"} w={"25%"}>
                        <Switch
                            colorScheme={"green"}
                            size="lg"
                            isChecked={i.forceCaratt}
                            onChange={() => (switchAction as (i: ImportableLectures) => void)(i)}
                        />
                    </Td>
                )}
            </Tr>
        )
    }, [])

    return (
        <Table w={"100%"} variant="striped" verticalAlign={"middle"} textAlign={"center"} colorScheme={tableColorScheme}>
            <Thead>
                <Tr>
                    <TableHeads />
                </Tr>
            </Thead>
            <Tbody verticalAlign={"center"}>
                {list.map(i => <TableBody key={i._id} i={i} />)}
            </Tbody>
        </Table>
    )
}


const ResultTabs: React.FC<{ result: FetchFromUnipaResponse | undefined, closeModal: () => void }> = ({ result, closeModal }) => {
    if (result === undefined || "error" in result)
        return <></>

    const [importable, dispatch] = useReducer(reducer, buildInitialImportable(result))
    useEffect(() => {
        dispatch({ type: "resetLectures", payload: result })
    }, [result])
    const appDispatch = useAppDispatch()
    const { isOpen: isOpenAlert, onOpen: onOpenAlert, onClose: onCloseAlert } = useDisclosure()
    const alertCancelRef = useRef<HTMLButtonElement>(null);
    const finallyImport = (importableLectuers: ImportableLectures[]) => {
        const lecturesToImport = importableLectuers.filter(i => i.checked).map(i => ({
            ...i,
            caratt: i.isDubious ? i.forceCaratt : i.caratt
        }))
        // TODO: Alert con conferma ?
        appDispatch(dangerouslySetAllLectures(lecturesToImport))
        closeModal()
        onCloseAlert()
    }
    const checkboxAction = useCallback((i: ImportableLectures) => { dispatch({ type: "check", payload: { lectureId: i._id } }) }, [])
    const switchAction = useCallback((i: ImportableLectures) => { dispatch({ type: "forceCaratt", payload: { lectureId: i._id, value: !i.forceCaratt } }) }, [])


    if (importable.length === 0)
        return <>
            <Text>Nessun dato trovato su questo corso</Text>
        </>
    return (
        <>
            <Grid templateColumns={"1fr 1fr"} justifyContent="center" alignItems={"center"}>
                <GridItem display={"inline-grid"} textAlign={"center"} colSpan={result.subname.length === 0 ? 2 : 1}>
                    <Text>{result.name}</Text><br /><Text>{result.year}</Text>
                </GridItem>
                {result.subname.length === 0 ? <></> : <GridItem>
                    <Text>{result.subname}</Text>
                </GridItem>}

            </Grid>
            <Tabs isLazy align="center" variant="enclosed-colored" >
                <TabList>
                    <Tab isDisabled={result.lectures.length === 0} _disabled={disabledTabCss}>
                        Materie {`(${importable.reduce((count, curr) => (count + ((curr.kind === "regular" && !curr.isDubious) ? 1 : 0)), 0)})`}
                    </Tab>
                    <Tab isDisabled={result.optional.length === 0} _disabled={disabledTabCss}>
                        Opzionali {`(${importable.reduce((count, curr) => (count + ((curr.kind === "optional" && !curr.isDubious) ? 1 : 0)), 0)})`}
                    </Tab>
                    <Tab isDisabled={result.dubious.length === 0} _disabled={disabledTabCss}>
                        Incongruenze {`(${result.dubious.length})`}
                    </Tab>
                </TabList>
                <TabPanels>
                    <TabPanel>
                        <ImportableLecturesTable list={importable.filter(i => i.kind === "regular" && !i.isDubious)} checkboxAction={checkboxAction} />
                    </TabPanel>
                    <TabPanel>
                        <ImportableLecturesTable list={importable.filter(i => i.kind === "optional" && !i.isDubious)} checkboxAction={checkboxAction} />
                    </TabPanel>
                    <TabPanel>
                        <TableContainer whiteSpace={"normal"}>
                            <Text >Non sono riuscito a determinare se le seguenti materie siano caratterizzanti o meno</Text>
                            <ImportableLecturesTable checkboxAction={checkboxAction} switchAction={switchAction} list={importable.filter(i => i.isDubious)} />
                        </TableContainer>
                    </TabPanel>
                </TabPanels>
            </Tabs>
            <Button colorScheme={"green"} onClick={onOpenAlert} my={10}>Importa {importable.reduce((count, curr) => (count + (curr.checked ? 1 : 0)), 0)} materie</Button>
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

export default ResultTabs
