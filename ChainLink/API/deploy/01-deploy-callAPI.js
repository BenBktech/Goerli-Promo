const { network } = require("hardhat")
const { networkConfig, developmentChains } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId

    if(!developmentChains.includes(network.name)) {
        log("----------------------------------------------------")
        arguments = []
        const getEthPrice = await deploy("APIConsumer", {
            from: deployer,
            args: arguments,
            log: true,
            waitConfirmations: network.config.blockConfirmations || 1,
        })

        log("Verifying...")
        await verify(getEthPrice.address, arguments)
    }
}

module.exports.tags = ["all", "getapiconsumer", "main"]