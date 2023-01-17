require("@nomicfoundation/hardhat-toolbox");
require("hardhat-deploy");
require("solidity-coverage")
require('hardhat-docgen')

module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 31337
    }
  },
  docgen: {
    path: './docs',
    clear: true
  },
  solidity : {
    compilers: [
      {
        version: "0.8.17"
      }
    ]
  },
  namedAccounts: {
    deployer: {
      default: 0,
      1: 0,
    }
  },
};
