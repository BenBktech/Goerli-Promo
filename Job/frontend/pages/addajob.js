import { Heading, Flex, Text, Textarea, Input, Button, useToast } from '@chakra-ui/react'
import { useState } from 'react'
import { useAccount, useProvider, useSigner } from 'wagmi'
import { useRouter } from 'next/router'
import Contract from '../Jobs.json';
import { ethers } from 'ethers'

export default function AddAJob() {
  
    //WAGMI
    const { address, isConnected } = useAccount()
    const provider = useProvider()
    const { data: signer } = useSigner()

    //CHAKRA-UI
    const toast = useToast()

    //STATES
    const [description, setDescription] = useState(null)
    const [price, setPrice] = useState(null)

    //ROUTER FOR REDIRECTION WITH NEXTJS
    const router = useRouter()

    //ADDRESS OF THE SMART CONTRACT
    const contractAddress = process.env.NEXT_PUBLIC_SCADDRESS

    //FUNCTIONS
    //Allows to add a job 
    const addAJob = async() => {
        try {
            const contract = new ethers.Contract(contractAddress, Contract.abi, signer)
            let transaction = await contract.addJob(description, {value: ethers.utils.parseEther(price)})
            await transaction.wait()
            toast({
                title: 'Congratulations!',
                description: "You have created a Job!",
                status: 'success',
                duration: 5000,
                isClosable: true,
            })
        }
        catch(error) {
            toast({
                title: 'Error',
                description: error.message,
                status: 'error',
                duration: 5000,
                isClosable: true,
            })
        }
        router.push('/')
    }
    
    return (
        <Flex direction="column" alignItems="center" w="100%">
            <Heading as='h1' size='xl' noOfLines={1}>
                Add a Job
            </Heading>
            <Flex mt="1rem" direction="column" width="100%">
                <Text>Description :</Text>
                <Textarea placeholder='The description of the job' onChange={e => setDescription(e.target.value)} />
            </Flex>
            <Flex mt="1rem" width="100%" direction="column">
                <Text>Price :</Text>
                <Input placeholder='How much you will pay your worker in ETH' onChange={e => setPrice(e.target.value)} />
            </Flex>
            <Button mt="1rem" colorScheme='whatsapp' width="100%" onClick={() => addAJob()}>Add</Button>
        </Flex>
    )
}