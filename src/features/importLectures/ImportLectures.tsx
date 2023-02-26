import { Button, Menu, MenuButton, MenuItem, MenuList, useDisclosure } from "@chakra-ui/react"
import React from "react"
import { FaCloudDownloadAlt } from "react-icons/fa"
import ModalFromPolito, { PolitoLabel } from "./components/PoliTo/ModalWrapper"
import ModalFromUnipa, { UnipaLabel } from "./components/UniPa/ModalWrapper"

const ImportLecture: React.FC = () => {
    const { isOpen: isOpenUnipa, onOpen: onOpenUnipa, onClose: onCloseUnipa } = useDisclosure()
    const { isOpen: isOpenPolito, onOpen: onOpenPolito, onClose: onClosePolito } = useDisclosure()
    return <>
        <Menu isLazy={true}>
            <MenuButton as={Button} leftIcon={<FaCloudDownloadAlt />}
                size="sm"
                fontSize="md"
                variant="outline"
            >
                Importa Materie
            </MenuButton>
            <MenuList>
                <MenuItem onClick={onOpenUnipa}>
                    <UnipaLabel />
                </MenuItem>
                <MenuItem onClick={onOpenPolito}>
                    <PolitoLabel />
                </MenuItem>
            </MenuList>
        </Menu>
        <ModalFromUnipa onOpen={onOpenUnipa} isOpen={isOpenUnipa} onClose={onCloseUnipa} />
        <ModalFromPolito onOpen={onOpenPolito} isOpen={isOpenPolito} onClose={onClosePolito} />

    </>
}

export default React.memo(ImportLecture)