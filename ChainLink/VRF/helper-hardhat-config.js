const networkConfig = {
    31337: {
        name: "localhost",
        /*So we know that Eth gas is always subject to change and with chainlink vrf there will be random values with your request, so you need to set a limit to how much to spend on each request. The reason chainlink uses a Gas lane is because the lanes are important for setting the ceiling limit of each request... think of it as your entry into the bet.*/
        gasLane: "0xd89b2bf150e3b9e13446986e571fb9cab24b13cea0a43ea20a6049a85cc807cc", // 30 gwei
        callbackGasLimit: "500000", // 500,000 gas
    },
    5: {
        //https://docs.chain.link/vrf/v2/subscription/supported-networks#goerli-testnet
        name: "goerli",
        vrfCoordinatorV2: "0x2Ca8E0C643bDe4C2E08ab1fA0da3401AdAD7734D",
        gasLane: "0x79d3d8832d904592c0bf9818b621522c988bb8b0c05cdc3b15aea1b6e8db0c15",
        callbackGasLimit: "500000", // 500,000 gas
        subscriptionId: "9424", // add your ID here!
    },
}

const developmentChains = ["hardhat", "localhost"]

module.exports = {
    networkConfig,
    developmentChains
}