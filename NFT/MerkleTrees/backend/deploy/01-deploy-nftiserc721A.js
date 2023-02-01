const { network } = require("hardhat")
const { developmentChains } = require("../helper-hardhat-config")
const { MerkleTree } = require('merkletreejs');
const keccak256 = require('keccak256');
const whitelisted = require('../whitelisted.json');
    
module.exports = async({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()

    // Generate Merkle Root
    let tab = [];
    whitelisted.map((whitelisted) => {
        tab.push(whitelisted.address);
    })
    const leaves = tab.map((address) => {
        return keccak256(address)
    })
    let tree = new MerkleTree(leaves, keccak256, { sort: true });
    let merkleTreeRoot = tree.getHexRoot();

    log("--------------------------------------")
    arguments = [merkleTreeRoot] 
    const NFTIsERC721A = await deploy("NFTIsERC721A", {
        from: deployer,
        args: arguments,
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1
    })
}

module.exports.tags = ["all", "NFTIsERC721A", "main"]