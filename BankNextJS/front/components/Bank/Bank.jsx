import { Spinner, Heading, Flex, Text, Input, Button, useToast, Table, Thead, Tbody, Tfoot, Tr, Th, Td, TableCaption, TableContainer,  } from '@chakra-ui/react'
import { useAccount, useProvider, useSigner,useBalance  } from 'wagmi'
import { useState, useEffect } from 'react'
import Contract from "../../../backend/artifacts/contracts/Bank.sol/Bank.json"
import { ethers } from 'ethers'

export const Bank = () => {
    //WAGMI 
    const { address, isConnected } = useAccount()
    const provider = useProvider() 
    const { data: signer } = useSigner()
    const { data } = useBalance({
        address: address,
        watch: true
    })

    //CHAKRA-UI 
    const toast = useToast()

    //STATES 
    const [balance, setBalance] = useState(null)
    const [amountDeposit, setAmountDeposit] = useState(null)
    const [amountWithdraw, setAmountWithdraw] = useState(null)
    const [events, setEvents] = useState(null)
    const [isLoading, setIsLoading] = useState(false)

    const contractAddress = "0x5fbdb2315678afecb367f032d93f642f64180aa3"

    useEffect(() => {
        if(isConnected) {
            getDatas()
        }
    }, [isConnected, address])

    useEffect(() => {
        const contract = new ethers.Contract(contractAddress, Contract.abi, provider)
        eventListener(contract)
        return () => {
            contract.removeAllListeners();
        };
    }, [])
    
    const eventListener = async(contract) => {
        const startBlockNumber = await provider.getBlockNumber();
        contract.on('etherDeposited', (...args) => {
            const event = args[args.length - 1];
            console.log(event)
            if(event.blockNumber <= startBlockNumber) return; // do not react to this event
            toast({
                title: 'Deposit Event',
                description: "By : " + event.args.account + ", Amount : " + ethers.utils.formatEther(event.args.amount) + " Eth",
                status: 'success',
                duration: 5000,
                isClosable: true,
            })
        })
    }

    const getDatas = async() => {
        console.log(address) //il affiche bien ici la bonne adresse ;D
        const contract = new ethers.Contract(contractAddress, Contract.abi, provider)
        let balance = await contract.getBalanceOfUser() //mais là il prend la mauvaise ><
        console.log(balance)
        setBalance(balance)

        let filter = {
            address: contractAddress,
            fromBlock : 0
        }
        let events = await contract.queryFilter(filter)
        setEvents(events)
    }

    const deposit = async() => {
        setIsLoading(true)
        try {
            const contract = new ethers.Contract(contractAddress, Contract.abi, signer)
            let transaction = await contract.deposit({value: ethers.utils.parseEther(amountDeposit)})
            await transaction.wait()
            await getDatas()
            toast({
                title: 'Deposit was successfull',
                description: "You have deposited Ethers on this smart contract, congratulations!",
                status: 'success',
                duration: 5000,
                isClosable: true,
            })
        }
        catch(error) {
            console.log(error.message)
            toast({
                title: 'Error',
                description: "An error occured, please try again.",
                status: 'error',
                duration: 5000,
                isClosable: true,
            })
        }
        setIsLoading(false)
    }

    const withdraw = async() => {
        setIsLoading(true)
        try {
            const contract = new ethers.Contract(contractAddress, Contract.abi, signer)
            let transaction = await contract.withdraw(ethers.utils.parseEther(amountWithdraw))
            await transaction.wait()
            await getDatas()
            toast({
                title: 'Withdraw was successfull',
                description: "You have withdrawed Ethers on this smart contract, congratulations!",
                status: 'success',
                duration: 5000,
                isClosable: true,
            })
        }
        catch {
            toast({
                title: 'Error',
                description: "An error occured, please try again.",
                status: 'error',
                duration: 5000,
                isClosable: true,
            })
        }
        setIsLoading(false)
    }

    return (
        <>
            {isConnected ? (
                <Flex direction="column" p="2rem" alignItems="center">
                    <Heading as='h1' size='xl'>Bank DApp</Heading>
                    {isLoading ? (
                        <Spinner mt="2rem" size="xl" color='purple' />
                    ) : (
                        <>
                            {balance && <Text mt="1rem">You have {ethers.utils.formatEther(balance)} Eth on the smart contract.</Text>}
                            <Heading mt="2rem" as='h2' size='xl'>Deposit</Heading>
                            <Flex mt="1rem">
                                <Input placeholder='Amount in ETH' onChange={e => setAmountDeposit(e.target.value)} />
                                <Button colorScheme='purple' onClick={() => deposit()}>Deposit</Button>
                            </Flex>
                            <Heading mt="2rem" as='h2' size='xl'>Withdraw</Heading>
                            <Flex mt="1rem">
                                <Input placeholder='Amount in ETH' onChange={e => setAmountWithdraw(e.target.value)} />
                                <Button colorScheme='purple' onClick={() => withdraw()}>Withdraw</Button>
                            </Flex>
                            <Heading mt="2rem" as='h2' size='xl'>Last events</Heading>
                            <TableContainer mt="1rem">
                                <Table variant='simple'>
                                    <Thead>
                                        <Tr>
                                            <Th>Name</Th>
                                            <Th>Account</Th>
                                            <Th isNumeric>Amount</Th>
                                        </Tr>
                                    </Thead>
                                    <Tbody>
                                    {events ? (
                                        events.map(event => {
                                            return (
                                                <Tr key={event.transactionHash}>
                                                    <Td>{event.event}</Td>
                                                    <Td>{event.args.account}</Td>
                                                    <Td isNumeric>{ethers.utils.formatEther(event.args.amount)} ETH</Td>
                                                </Tr>
                                            )
                                        })
                                    ) : (
                                        <Tr>
                                            <Td>
                                                <Text>No events right now</Text>
                                            </Td>
                                        </Tr>
                                    )}
                                    </Tbody>
                                </Table>
                            </TableContainer>
                        </>
                    )}
                </Flex>
            ) : (
                <Flex h="85vh" p="2rem" justifyContent="center" alignItems="center">
                    Please connect your account
                </Flex>
            )}
        </>
    )
}