import { Flex, Text, Button } from '@chakra-ui/react'

export default function Header() {
    return (
        <Flex p="2rem" justifyContent="space-between" alignItems="center">
            <Text>Logo</Text>
            <Button colorScheme="purple">Connexion</Button>
        </Flex>
    )
}