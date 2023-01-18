import useWalletProvider from "@/hooks/useWalletProvider";
import { ethers } from 'ethers';
import { Button, Flex, Text } from "@chakra-ui/react";

const Header = () => {
    const { account, provider, setAccount, chainId, connect } = useWalletProvider()

    const connectWallet = () => {
        connect()
    }

    return (
        <Flex 
            p="2rem"
            justifyContent="space-between"
            alignItems="center"
        >
            <Text>Logo</Text>
            {account !== null ? (
                <Text>
                    Account connected : 
                    <Text as="span" fontWeight="bold" color="purple">
                        {account.substring(0,5)}...{account.substring(account.length - 4)}
                    </Text>
                </Text>
            ) : (
                <Button
                    onClick={() => connectWallet()}
                    colorScheme="purple"
                >
                    Connexion  
                </Button> 
            )}
        </Flex>
    )
}

export default Header