const { assert, expect } = require("chai")
const { network, deployments, ethers } = require("hardhat")
const { developmentChains } = require("../../helper-hardhat-config")

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("Get Eth price in USD Unit Tests", function () {
        let getEthPrice, deployer, mockV3Aggregator, accounts

        beforeEach(async () => {
            accounts = await ethers.getSigners()
            deployer = accounts[0]
            await deployments.fixture(["mocks", "getEthPrice"])
            getEthPrice = await ethers.getContract("getEthPrice")
        })
        
        describe("getEthPrice", async function() {
            it("should get the Eth Price in USD", async function() {
                // In tests, 10**18 decimals, but if you want to get the price with in USD on Goerli, there will be 10**8 decimals.
                // We could change that in the helper-hardhat-config.js file
                /* const DECIMALS = "18"
                const INITIAL_PRICE = "200000000000000000000" */
                let price = await getEthPrice.getEthPriceInUSD() / 10**18
                assert.equal(price, 200)  
            })
        })
    })