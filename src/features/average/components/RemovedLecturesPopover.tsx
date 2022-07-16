import { InfoIcon } from "@chakra-ui/icons";
import { Box, Popover, PopoverArrow, PopoverBody, PopoverCloseButton, PopoverContent, PopoverHeader, PopoverTrigger, SimpleGrid, Text, useColorModeValue } from "@chakra-ui/react";
import React from "react";
import { ILecture } from "../../lectures/lectureDuck";

const RemovedLecturePopover = (
    {removedLectures = []}: {removedLectures: ILecture[]}
) => {
    const greenInfoColor = useColorModeValue('green.600', 'green.300');

    return (
        <Box gridArea="info">
            <Popover>
                <PopoverTrigger>
                    <InfoIcon boxSize="0.8em" color={greenInfoColor} />
                </PopoverTrigger>
                <PopoverContent>
                    <PopoverArrow />
                    <PopoverCloseButton />
                    <PopoverHeader textAlign="center">
                        Materie rimosse e/o ripesate
                    </PopoverHeader>
                    <PopoverBody fontSize="sm">
                        {
                            removedLectures.length === 0 ?
                                <Text>Non è stata rimossa nessuna materia dal conteggio della media</Text>
                                :
                                removedLectures.map(e => {
                                    return (
                                        <SimpleGrid
                                            key={"removed" + e._id}
                                            columns={2}
                                            rowGap={2}
                                            templateColumns="1fr 30%"
                                            alignItems="center"
                                            justifyItems="center"
                                        >
                                            <Text>{e.name}</Text>
                                            <Text>{e.new_cfu === 0 ? '❌' : `${e.new_cfu} CFU`}</Text>
                                        </SimpleGrid>
                                    );

                                })
                        }
                    </PopoverBody>
                </PopoverContent>
            </Popover>
        </Box>
    )
}

export default React.memo(RemovedLecturePopover)