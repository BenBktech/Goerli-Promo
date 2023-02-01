// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

/* Author : Ben BK for Alyra */

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "./ERC721A.sol";

contract NFTIsERC721A is ERC721A, Ownable {

    using Strings for uint;

    bytes32 public merkleRoot;

    uint private constant MAX_SUPPLY = 20;

    constructor(bytes32 _merkleRoot) 
    ERC721A("Alyra", "ANFT") {
        merkleRoot = _merkleRoot;
    }

    /**
    * @notice Mint function for the Whitelist Sale
    *
    * @param _account Account which will receive the NFT
    * @param _quantity Amount of NFTs the user wants to mint
    * @param _proof The merkle proof
    **/
    function whitelistMint(address _account, uint _quantity, bytes32[] calldata _proof) external payable {
        require(isWhitelisted(_account, _proof), "Not whitelisted");
        require(totalSupply() + _quantity <= MAX_SUPPLY, "Max supply exceeded");
        _safeMint(_account, _quantity);
    }

    /**
    * @notice Get the token URI of a NFT by his ID
    *
    * @param _tokenId The Id of the NFT you want to have the URI of the metadatas
    *
    * @return URI of an NFT by his ID
    */
    function tokenURI(uint _tokenId) public view virtual override(ERC721A) returns(string memory) {
        require(_exists(_tokenId), "URI query for nonexistent token");

        return string(abi.encodePacked("ipfs://bafybeidmflwrfthqw5uzs2usbbxlir6mqpxuhmvddvprms63lojaxyckzi/", _tokenId.toString(), ".json"));
    }

    /**
    * @notice Change the merkle root
    *
    * @param _merkleRoot the new merkle root
    **/
    function setMerkleRoot(bytes32 _merkleRoot) external onlyOwner {
        merkleRoot = _merkleRoot;
    }

    /**
    * @notice Check if an address is whitelisted or not
    * 
    * @param _account The account checked
    * @param _proof The merkle proof
    *
    * @return bool return true if the address is whitelisted, false otherwise
    **/
    function isWhitelisted(address _account, bytes32[] calldata _proof) internal view returns(bool) {
        return MerkleProof.verify(_proof, merkleRoot, keccak256(abi.encodePacked((_account))));
    }

}