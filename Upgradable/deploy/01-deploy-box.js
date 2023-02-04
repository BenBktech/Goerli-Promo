const { network } = require("hardhat")
const { developmentChains } = require("../helper-hardhat-config")
//const { verify } = require("../utils/verify")

module.exports = async({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()

    log("--------------------------------------")
    arguments = [] 
    const Box = await deploy("Box", {
        from: deployer,
        args: arguments,
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
        proxy: {
            proxyContract: "OpenZeppelinTransparentProxy",
            // Pas d'adresse admin, mais on va avoir un proxy contract dirigé par un admin contract
            viaAdminContract: {
                name: "BoxProxyAdmin",
                artifact: "BoxProxyAdmin"
            }
        }
        
    })
    
}

module.exports.tags = ["all", "box", "main"]