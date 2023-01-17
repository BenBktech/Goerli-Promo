import { ethers } from "./ethers.min.js"
import { abi, contractAddress } from "./constants.js"

const connectButton = document.getElementById('connectButton')
const getNumber = document.getElementById('getNumber')
const theNumber = document.getElementById('theNumber')
const inputNumber = document.getElementById('inputNumber')
const setNumber = document.getElementById('setNumber')
let connectedAccount;

connectButton.addEventListener('click', async function() {
    if(typeof window.ethereum !== "undefined") {
        const resultAccount = await window.ethereum.request({ method: "eth_requestAccounts" })
        connectedAccount = ethers.utils.getAddress(resultAccount[0])
        connectButton.innerHTML = "Connected with " + connectedAccount.substring(0, 5) + "..." + connectedAccount.substring(connectedAccount.length - 4)
    }
    else {
        connectButton.innerHTML = "Please install Metamask!"
    }
})

getNumber.addEventListener('click', async function() {
    if(typeof window.ethereum !== "undefined" && connectedAccount) {
        //Getter = provider
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const contract = new ethers.Contract(contractAddress, abi, provider)
        try {
            const number = await contract.getNumber()
            theNumber.innerHTML = number.toString()
        }
        catch(e) {
            console.log(e.message)
        }
    }
})

setNumber.addEventListener('click', async function() {
    if(typeof window.ethereum !== "undefined" && connectedAccount) {
        try {
            let inputNumberByUser = inputNumber.value 
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            console.log(await provider.chainId)
            const signer = provider.getSigner()
            const contract = new ethers.Contract(contractAddress, abi, signer)
            let transaction = await contract.setNumber(inputNumberByUser)
            await transaction.wait(1)
        }
        catch(e) {
            console.log(e)
        }
    }
})