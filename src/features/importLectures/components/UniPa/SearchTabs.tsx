import { ArrowDownIcon } from '@chakra-ui/icons'
import {
    InputGroup, Input, Button, Grid, NumberInput,
    NumberInputField, GridItem, Box, VStack, useToast
} from '@chakra-ui/react'
import React, { Dispatch, SetStateAction, useState } from 'react'
import { unstable_batchedUpdates } from 'react-dom'
import { API_SEARCH_UNIPA_URL, SearchResult } from '../../../../pages/api/unipa/search'

const SearchForm: React.FC<{ updateResults: (name: string, year: number) => void }> = React.memo(({ updateResults }) => {
    const currentYear = (new Date()).getFullYear()
    const [cdsName, setCdsName] = useState("")
    const [cdsYear, setCdsYear] = useState(currentYear)
    return (
        <Grid templateColumns={"1fr 3fr"} gap={2} textAlign="center" alignItems={"center"} pb={5}>
            <label htmlFor="yearCdsField"> <strong> Anno d'Iscrizione </strong> </label>
            <label htmlFor='nameCdsField'> <strong> Corso di Studi </strong></label>
            <NumberInput
                step={1}
                variant="flushed"
                value={cdsYear}
                onChange={(e) => setCdsYear(parseInt(e))}
                min={currentYear - 15}
                max={currentYear}
                size="md"
                allowMouseWheel
                inputMode='numeric'>
                <NumberInputField
                    id="yearCdsField"
                    name="yearCdsField"
                    pr={0}
                    textAlign="center"
                    maxLength={4}
                    minLength={4} />
            </NumberInput>
            <InputGroup >
                <Input
                    id="nameCdsField"
                    name="nameCdsField"
                    textAlign="center"
                    type="text"
                    value={cdsName}
                    variant="flushed"
                    onChange={(e) => setCdsName(e.target.value)}
                    onClick={(e) => { (e.target as HTMLInputElement).select() }}
                    onKeyPress={(e) => {
                        if (e.key === "Enter") {
                            updateResults(cdsName, cdsYear)
                        }
                    }}
                />
            </InputGroup>
            <GridItem colSpan={2}>
                <Button colorScheme={"orange"} rightIcon={<ArrowDownIcon />} onClick={() => {
                    updateResults(cdsName, cdsYear)
                }}>
                    Cerca
                </Button>
            </GridItem>

        </Grid>
    )
});

const SearchResultList: React.FC<{ results: SearchResult[], setUrl: Dispatch<SetStateAction<string>> }> = ({ results, setUrl }) => {
    if (!Array.isArray(results)) return <></>

    const mappedCds: { name: string, url: string }[] = []
    results.forEach(result => {
        const name = result.name
        if (result.links.length === 1) {
            const url = result.links[0].url
            mappedCds.push({ name, url })
            return
        }
        result.links.forEach(link => {
            mappedCds.push({
                name: name + " | " + link.name,
                url: link.url
            })
        })
    })

    return <VStack maxH={"300px"} overflowY="scroll">
        {results.map(cds => {
            if (cds.links.length === 1) {
                return <Box pt={2} fontWeight={"semibold"} textDecorationLine={"underline"} as="button" w="100%" boxShadow={"0 -1px 0 #fff"} key={cds.links[0].url} onClick={() => setUrl(cds.links[0].url)}>{cds.name}</Box>
            }
            return <Grid gridTemplateColumns={"1fr 1fr"} key={cds.name} pt={2} w="100%" boxShadow={"0 -1px 0 #fff"} gap={2} justifyItems="center" textAlign={"center"} alignItems="center">
                <GridItem className="cdsmultiple" rowSpan={cds.links.length} colSpan={1}>
                    <Box>{cds.name}</Box>
                </GridItem>
                {cds.links.map(link => <GridItem className={`${cds.name}-ind`} key={link.url}>
                    <Box as="button" fontWeight={"semibold"} textDecorationLine={"underline"} onClick={() => setUrl(link.url)} >{link.name}</Box>
                </GridItem>)}
            </Grid>

        })}
    </VStack>
}

const SearchWrapper: React.FC<{ setUrl: Dispatch<SetStateAction<string>> }> = ({ setUrl }) => {

    const [cdsFound, setCdsFound] = useState([] as SearchResult[])
    const [cdsFiltered, setCdsFiltered] = useState([] as SearchResult[])
    const [lastYearRequested, setLastYear] = useState(0)
    const toast = useToast()

    const updateResults: (name: string, year: number) => void = async (name, year) => {
        if (lastYearRequested === year) {
            setCdsFiltered(cdsFound.filter(
                result => result.name.toLowerCase().includes(name.toLowerCase())
            ))
            return
        }
        try {
            const response = await fetch(`${API_SEARCH_UNIPA_URL}?anno=${year}`)
            if (response.status !== 200) {
                throw new Error("Something went horribly wrong");
            }
            const results = await response.json() as SearchResult[]
            unstable_batchedUpdates(() => {
                setCdsFound(results)
                setCdsFiltered(results.filter(
                    result => result.name.toLowerCase().includes(name.toLowerCase())
                ))
                setLastYear(year)
            })
        } catch {
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
        return
    }

    return <>
        <SearchForm updateResults={updateResults} />
        <SearchResultList results={cdsFiltered} setUrl={setUrl} />
    </>
}

export default React.memo(SearchWrapper)