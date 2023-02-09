require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-ethers");
require("dotenv").config();
require("@nomiclabs/hardhat-etherscan");
require("hardhat-deploy");
require("hardhat-gas-reporter")
require("solidity-coverage")

const PK = process.env.PK || "";
const ALCHEMY = process.env.ALCHEMY || "";
const ETHERSCAN = process.env.ETHERSCAN || "";
const MAINNET_ALCHEMY = process.env.MAINNET_ALCHEMY || "";

module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    goerli: {
      url: ALCHEMY,
      accounts: [`0x${PK}`],
      chainId: 5,
      blockConfirmations: 6
    },
    localhost: {
      chainId: 31337,
    },
    hardhat: {
      chainId: 31337,
      forking: {
        url: MAINNET_ALCHEMY,
      },
    },
  },
  solidity : {
    compilers: [
      {
        version: "0.8.17"
      },
      {
        version: "0.6.12"
      },
      {
        version: "0.4.19"
      }
    ]
  },
  etherscan: {
    apiKey: {
      goerli: ETHERSCAN
    }
  },
  namedAccounts: {
    deployer: {
      default: 0,
      1: 0,
    }
  }
};