import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import detectEthereumProvider from "@metamask/detect-provider";

const WalletContext = React.createContext(null)

export const WalletProvider = ({ children }) => {

    // STATES
    const [account, setAccount] = useState(null)
    const [provider, setProvider] = useState(null)
    const [chainId, setChainId] = useState(null)

    let currentAccount = null

    // EVENTS METAMASK
    useEffect(() => {
        ethereum.on('accountsChanged', handleAccountsChanged)
        ethereum.on('chainChanged', handleChainChanged)
        //Faire ici le return pour remove les listeners
        return () => {
            ethereum.removeListener('accountsChanged', handleAccountsChanged);
            ethereum.removeListener('chainChanged', handleChainChanged);
        }
    }, [])

    // Connexion function
    const connect = async() => {
        const provider = await detectEthereumProvider()
        if(provider) {
            startApp(provider)
            const chainId = await ethereum.request({ method: 'eth_chainId' });
            //Connected on Goerli ? 
            if(chainId.toString() === "0x5") {
                ethereum.request({ method: 'eth_requestAccounts'})
                    .then(handleAccountsChanged)
                    .catch((err) => {
                        //L'erreur 4001 provient du fait que l'utilisateur cancel la demande de connexion à Metamask lorsque la popup MEtamask de connexion à un compte se lance
                        if(err.code === 4001) {
                            console.log('Please connect to Metamask')
                        }
                        //sinon c'est une autre erreur inconnue que l'on veut connaître avec le console.log
                        else {
                            console.log(err)
                        }
                    })
            }
            else {
                console.log('Please change your network on Metamask, you need to be connected to Goerli Test network')
            }
        }
        else {
            console.log('Please install Metamask!')
        }
    }

    const startApp = (provider) => {
        if(provider !== window.ethereum) {
            console.error("Do you have multiple Wallets installed ?")
        }
    }

    const handleAccountsChanged = (accounts) => {
        console.log('HANDLEACCOUTNCHANGE')
        if(accounts.length === 0) {
            console.log('Please connect to Metamask')
            setAccount(null) 
            setProvider(null)
            setChainId(null)
            console.log('disconnected')
        }
        else if(accounts[0] !== currentAccount) {
            currentAccount = accounts[0]
            console.log(currentAccount)
            setAccount(currentAccount)
            console.log('PROVIDER !!!')
            //A MODIFIER EVENTUELLEMENT
            //provider
            // + QUESTION BANG
            setProvider(new ethers.providers.Web3Provider(window.ethereum))
        }
        console.log(currentAccount)
    }

    const handleChainChanged = () => {
        window.location.reload()
    }

    return (
        <WalletContext.Provider 
            value={{
                account,
                provider, 
                setAccount,
                chainId,
                connect
            }}
        >
            {children}
        </WalletContext.Provider>
    )
}

export default WalletContext;