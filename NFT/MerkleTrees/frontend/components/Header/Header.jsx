import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Flex, Text } from '@chakra-ui/react'

export const Header = () => {
    return (
        <Flex 
            justifyContent="space-between"
            alignItems="center"
            p="2rem"
        >
            <Text>
                Minting DApp
            </Text>
            <ConnectButton />
        </Flex>
    )
}