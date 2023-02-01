import { Flex } from "@chakra-ui/react"
import { Footer } from "../Footer/Footer"
import { Header } from "../Header/Header"

export const Layout = ({ children }) => {
    return (
        <Flex
            direction="column"
            minHeight="100vh"
        >
            <Header />
            <Flex
                justifyContent="center"
                alignItems="center"
                grow="1"
            >
                {children}
            </Flex>
            <Footer />
        </Flex>
    )
}