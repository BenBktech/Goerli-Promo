const { network } = require("hardhat")
const { networkConfig, developmentChains } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId
    let ethUsdPriceFeedAddress

    if (chainId == 31337) {
        // Find ETH/USD price feed
        // "get" fetch a deployment by name, throw if not existing
        const EthUsdAggregator = await deployments.get("MockV3Aggregator")
        // get the mock smart contract deployed on the hardhat blockchain
        ethUsdPriceFeedAddress = EthUsdAggregator.address
    } else {
        ethUsdPriceFeedAddress = networkConfig[chainId].ethUsdPriceFeed
    }

    log("----------------------------------------------------")
    arguments = [ethUsdPriceFeedAddress]
    const getEthPrice = await deploy("getEthPrice", {
        from: deployer,
        args: arguments,
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })

    // Verify the deployment
    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN) {
        log("Verifying...")
        await verify(getEthPrice.address, arguments)
    }
}

module.exports.tags = ["all", "getEthPrice", "main"]