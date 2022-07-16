import { InfoIcon } from "@chakra-ui/icons";
import { Box, Popover, PopoverArrow, PopoverBody, PopoverCloseButton, PopoverContent, PopoverFooter, PopoverHeader, PopoverTrigger, useColorModeValue } from "@chakra-ui/react";
import React from "react";

const InfoFinalVotePopover = ({gridArea = "info"} : {gridArea: string}) => {
    const greenInfoColor = useColorModeValue('green.600', 'green.300');

    return (
        <Box gridArea={gridArea}>
            <Popover>
                <PopoverTrigger>
                    <InfoIcon boxSize="0.8em" color={greenInfoColor} />
                </PopoverTrigger>
                <PopoverContent>
                    <PopoverArrow />
                    <PopoverCloseButton />
                    <PopoverHeader textAlign="center">Voto Finale</PopoverHeader>
                    <PopoverBody fontSize="sm">
                        Al voto finale sono stati aggiunti gli eventuali bonus. Assicurati di
                        aver inserito i valori corretti per il tuo Corso di Studi prima di
                        festeggiare.
                    </PopoverBody>
                    <PopoverFooter fontSize="sm">
                        Il voto finale va arrotondato al valore intero più vicino.
                    </PopoverFooter>
                </PopoverContent>
            </Popover>
        </Box>
    );
};

export default React.memo(InfoFinalVotePopover)