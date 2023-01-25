import { Heading, Flex, Text, Textarea, Input, Button, useToast, Alert, AlertIcon } from '@chakra-ui/react'
import { useState, useEffect } from 'react'
import { useAccount, useProvider, useSigner } from 'wagmi'
import Contract from "../Jobs.json"
import { ethers } from 'ethers'
import Link from 'next/link'
import { Job } from '@/components/Job/Job'

export default function Home() {
  //WAGMI
  const { address, isConnected } = useAccount()
  const provider = useProvider()
  const { data: signer } = useSigner()

  //CHAKRA-UI
  const toast = useToast()

  //STATES
  const [events, setEvents] = useState([])

  //ADDRESS OF THE SMART CONTRACT
  const contractAddress = process.env.NEXT_PUBLIC_SCADDRESS

  useEffect(() => {
    if(isConnected) {
      getEvents()
    }
  }, [isConnected])

  const getEvents = async() => {
    const contract = new ethers.Contract(contractAddress, Contract.abi, provider)
    //Get All the Events
    let filter = {
      address: contractAddress,
      fromBlock: 0
    };

    let events = await contract.queryFilter(filter)
    let allTheEvents = [], jobAddedEvents = [], jobTakenEvents = [], jobPaidEvents = [];
    events.forEach(event => {
      if(event.event === "jobAdded") {
        jobAddedEvents.push(event.args)
      }
      else if(event.event === "jobTaken") {
        jobTakenEvents.push(event.args)
      }
      else { //JobFinished
        jobPaidEvents.push(event.args)
      }
    })
    
    let jobs = []
    jobAddedEvents.forEach(jobAdded => {
      //Le Id me permet de récupérer ici l'ID du Job dans le smart contract
      let id = parseInt(jobAdded.id)
      //Maintenant je créé un objet qui va être plus simple pour moi à manipuler dans le front
      let thisJob = {
        id: id,
        author: jobAdded.author,
        description: jobAdded.description,
        isTaken: false,
        isFinished: false
      }
      //Voir si le job a été pris ?
      jobTakenEvents.forEach(jobTaken => {
        if(id === parseInt(jobTaken.id)) {
          thisJob.isTaken = true
        }
      })
      //Voir si le job a été finished ?
      jobPaidEvents.forEach(jobPaid  => {
        if(id === parseInt(jobPaid .id)) {
          thisJob.isFinished = true
        }
      })
      jobs.push(thisJob)
    })
    setEvents(jobs)   
  }

  //The user wants to take a job
  const takeJob = async(id) => {
    try {
      const contract = new ethers.Contract(contractAddress, Contract.abi, signer)
      let transaction = await contract.takeJob(id)
      await transaction.wait(1)
      getEvents()
      toast({
        title: 'Congratulations!',
        description: "You took a job!",
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
  }

  //The user wants to pay a job
  const payJob = async(id) => {
    try {
      const contract = new ethers.Contract(contractAddress, Contract.abi, signer)
      let transaction = await contract.setIsFinishedAndPay(id)
      await transaction.wait(1)
      getEvents()
      toast({
        title: 'Congratulations!',
        description: "You paid the worker!",
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
  }

  return (
    <Flex 
      width="100%" 
      direction={["column", "column", "row", "row"]} 
      alignItems={["center", "center", "flex-start", "flex-start"]}
      flexWrap="wrap"
    >
      {isConnected ? (
        events.length !== 0 ? (
          events.map(event => {
            return (
              <Job key={event.id} event={event} takeJob={takeJob} payJob={payJob} />
            )
          })
        ) : (
          <Flex height="100%" width="100%" alignItems="center" justifyContent="center">
            <Alert status='warning' width="300px">
              <AlertIcon />
              <Flex direction="column">
                <Text as='span'>There are no jobs on our DApp.</Text>
                <Text><Link href="addajob" style={{"fontWeight": "bold"}}>Create the first job!</Link></Text>
              </Flex>
            </Alert>
          </Flex>
        )
      ) : (
        <Flex height="100%" width="100%" alignItems="center" justifyContent="center">
          <Alert status='warning' width="300px">
            <AlertIcon />
            <Flex direction="column">
              <Text as='span'>Please connect your Wallet</Text>
            </Flex>
          </Alert>
        </Flex>
      )}
      
    </Flex>
  )
}
