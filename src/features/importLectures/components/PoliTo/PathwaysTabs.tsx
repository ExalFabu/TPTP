import { Button, VStack } from "@chakra-ui/react"
import React from "react";
import { Pathway } from "../../../../pages/api/polito/fetch";


const PathwaysTabs : React.FC<{pathways?: Pathway[], setSelectedPathway: (p: Pathway) => void }> = ({ pathways, setSelectedPathway }) => {
    if (pathways === undefined || pathways.length === 0) return <></>
    return <VStack
        spacing={4}
        align="stretch"
        p={4}
        border="1px"
        borderColor="gray.200"
        borderRadius="lg"
    >
        {pathways.map((pathway, index) => (
            <Button
                key={index}
                onClick={() => setSelectedPathway(pathway)}
                variant="solid"
                colorScheme="teal"
                textAlign={"center"}
                style={{
                    whiteSpace: "normal",
                    wordWrap: "break-word",
                }}            >
                {pathway.name}
            </Button>
        ))}
    </VStack>
}

export default React.memo(PathwaysTabs);