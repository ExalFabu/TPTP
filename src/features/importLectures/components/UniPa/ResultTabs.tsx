import { WarningTwoIcon } from "@chakra-ui/icons"
import { Button, Checkbox, CSSObject, Skeleton, Stack, Switch, Tab, Table, TableContainer, TabList, TabPanel, TabPanels, Tabs, Tbody, Td, Text, Th, Thead, Tr } from "@chakra-ui/react"
import React, { useReducer } from 'react'
import { useAppDispatch } from "../../../../app/hooks"
import { FetchFromUnipaResponse } from "../../../../pages/api/unipa/fetch"
import { dangerouslySetAllLectures, ILecture } from "../../../lectures/lectureDuck"

const disabledTabCss: CSSObject = {
    cursor: "not-allowed",
    textColor: "#EBEBE4"
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
}

const reducer = (state: ImportableLectures[], action: ImportableAction): ImportableLectures[] => {
    switch (action.type) {
        case "check": {
            console.log(action)
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
        default: return state
    }
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


const ResultTabs: React.FC<{ result: FetchFromUnipaResponse | undefined, closeModal: () => void }> = ({ result, closeModal }) => {
    if (result === undefined)
        return (
            <Stack >
                <Skeleton />
                <Skeleton />
                <Skeleton />
            </Stack>
        )
    if ("error" in result)
        return <></>

    const [importable, dispatch] = useReducer(reducer, buildInitialImportable(result))
    const appDispatch = useAppDispatch()

    const finallyImport = (importableLectuers: ImportableLectures[]) => {
        const lecturesToImport = importableLectuers.filter(i => i.checked).map( i => ({
            ...i,
            caratt: i.isDubious ? i.forceCaratt : i.caratt
        }))
        // TODO: Alert con conferma ?
        appDispatch(dangerouslySetAllLectures(lecturesToImport))
        closeModal()
    }
    

    if (importable.length === 0)
        return <>
            <Text>Nessun dato trovato su questo corso</Text>
        </>
    return (
        <>
            <Text>{`${result.name} - ${result.subname.length === 0 ? "" : result.subname + " -"} ${result.year}`}</Text>
            <Tabs isLazy align="center" variant="soft-rounded" >
                <TabList>
                    <Tab isDisabled={result.lectures.length === 0} _disabled={disabledTabCss}>Materie</Tab>
                    <Tab isDisabled={result.optional.length === 0} _disabled={disabledTabCss}>Opzionali</Tab>
                    <Tab isDisabled={result.dubious.length === 0} _disabled={disabledTabCss}>
                    {result.dubious.length !== 0 ? <WarningTwoIcon color={"red.600"}/> : ""} Incongruenze
                    </Tab>
                </TabList>
                <TabPanels>
                    <TabPanel>
                        <Table w={"100%"} variant="striped" verticalAlign={"middle"} textAlign={"center"} colorScheme={"blackAlpha"}>
                            <Thead>
                                <Tr>
                                    <Th></Th>
                                    <Th>Importa </Th>
                                </Tr>
                            </Thead>
                            <Tbody verticalAlign={"center"}>
                                {importable.filter(i => i.kind === "regular" && !i.isDubious).map(i => {
                                    return (
                                        <Tr key={"tp1" + i._id} py={"1em"}>
                                            <Td p={1.5}>
                                                <Text textAlign={"center"} fontSize="md">{i.name}</Text>
                                            </Td>
                                            <Td p={1.5} textAlign={"center"}>
                                                <Checkbox size={"lg"} isChecked={i.checked} onChange={() => dispatch({ type: "check", payload: { lectureId: i._id } })} />
                                            </Td>
                                        </Tr>
                                    )
                                })}
                            </Tbody>
                        </Table>
                    </TabPanel>
                    <TabPanel>
                        <Table w={"100%"} variant="striped" verticalAlign={"middle"} textAlign={"center"} colorScheme={"blackAlpha"}>
                            <Thead>
                                <Tr>
                                    <Th></Th>
                                    <Th>Importa </Th>
                                </Tr>
                            </Thead>
                            <Tbody verticalAlign={"center"}>
                                {importable.filter(i => i.kind === "optional" && !i.isDubious).map(i => {
                                    return (
                                        <Tr key={"tp2" + i._id} py={"1em"}>
                                            <Td p={1.5}>
                                                <Text textAlign={"center"} fontSize="md">{i.name}</Text>
                                            </Td>
                                            <Td p={1.5} textAlign={"center"}>
                                                <Checkbox size={"lg"} isChecked={i.checked} onChange={() => dispatch({ type: "check", payload: { lectureId: i._id } })} />
                                            </Td>
                                        </Tr>
                                    )
                                })}
                            </Tbody>
                        </Table>
                    </TabPanel>
                    <TabPanel>
                        <TableContainer whiteSpace={"normal"}>
                        <Text >Non sono riuscito a determinare se le seguenti materie siano caratterizzanti o meno</Text>
                        <Table variant="striped" verticalAlign={"middle"} textAlign={"center"} colorScheme={"blackAlpha"}>
                            <Thead>
                                <Tr>
                                    <Th></Th>
                                    <Th p={0.5}>Importa </Th>
                                    <Th p={0.5}>Caratterizzante</Th>
                                </Tr>
                            </Thead>
                            <Tbody verticalAlign={"center"}>
                                {importable.filter(i => i.isDubious).map(i => {
                                    return (
                                        <Tr key={"tp3" + i._id} py={"1em"}>
                                            <Td py={1} px={0}>
                                                <Text textAlign={"center"} fontSize="md">{i.name}</Text>
                                            </Td>
                                            <Td py={1} px={0} textAlign={"center"}>
                                                <Checkbox size={"lg"} isChecked={i.checked} onChange={() => dispatch({ type: "check", payload: { lectureId: i._id } })} />
                                            </Td>
                                            <Td py={1} px={0} textAlign={"center"} w={"25%"}>
                                                <Switch
                                                    colorScheme={"green"}
                                                    size="lg"
                                                    isChecked={i.forceCaratt}
                                                    onChange={() => { dispatch({ type: "forceCaratt", payload: { lectureId: i._id, value: !i.forceCaratt } }) }}
                                                />
                                            </Td>
                                        </Tr>
                                    )
                                })}
                            </Tbody>
                        </Table>
                        </TableContainer>
                    </TabPanel>
                </TabPanels>
            </Tabs>
            <Button colorScheme={"green"} onClick={ () => finallyImport(importable)} my={10}>Importa e sovrascrivi {importable.reduce((count, curr) => (count + (curr.checked ? 1 : 0)), 0)} materie</Button>
        </>
    )

}

export default React.memo(ResultTabs)
