import Head from 'next/head'
import { Layout } from '@/components/Layout/Layout'
import { useAccount, useSigner, useContract } from 'wagmi'
import Contract from '../NFTIsERC721A.json'
import { Flex, Text, Heading, Button, Input, useToast, Spinner } from '@chakra-ui/react'
import { MerkleTree } from "merkletreejs";
import keccak256 from "keccak256";
import { useState } from 'react'
import whitelisted from '../whitelisted.json'

export default function Home() {

  const { address, isConnected } = useAccount()
  const { data: signer, isError, isLoading } = useSigner()
  const contract = useContract({
    address: "0x5FbDB2315678afecb367f032d93F642f64180aa3", //A COMPLETER
    abi: Contract.abi,
    signerOrProvider: signer,
  })

  const toast = useToast()

  const [quantity, setQuantity] = useState(null)
  const [isMinting, setIsMinting] = useState(false)

  const mint = async() => {
    setIsMinting(true)
    // Generating the merkleRoot and merkleProof
    let tab = [];
    whitelisted.map((account) => {
        tab.push(account.address);
    });
    let leaves = tab.map((address) => keccak256(address));
    let tree = new MerkleTree(leaves, keccak256, { sort: true });
    let leaf = keccak256(address);
    let proof = tree.getHexProof(leaf);

    try {
      let mint = await contract.whitelistMint(address, quantity, proof);
      await mint.wait();
      toast({
        title: 'Congratulations',
        description: 'You have just minted your NFTs!',
        status: 'success',
        duration: 5000,
        isClosable: true,
        variant: 'top-accent',
      })
    }
    catch(error) {
      console.log(error.message)
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
        variant: 'top-accent',
      })
    }
    setIsMinting(false)
  }

  return (
    <>
      <Head>
        <title>Minting DApp</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        {isConnected ? (
          isMinting ? (
            <Spinner />
          ) : (
            <Flex direction="column">
              <Heading as='h1' size='xl' noOfLines={1}>
                Mint your NFTs!
              </Heading>
              <Flex mt="1rem">
                <Input placeholder='Number of NFTs' onChange={(e) => setQuantity(e.target.value)} />
                <Button colorScheme='whatsapp' onClick={() => mint()}>Mint</Button>
              </Flex>
            </Flex>
          )
        ) : (
          <Text>Please connect your Wallet</Text>
        )}
      </Layout>
    </>
  )
}
