import { Flex, Text } from "@chakra-ui/react"

export const Footer = () => {
    return (
        <Flex
            justifyContent="center"
            alignItems="center"
            p="2rem"
        >
            <Text>&copy; Ben BK For Alyra {new Date().getFullYear()}</Text>
        </Flex>
    )
}