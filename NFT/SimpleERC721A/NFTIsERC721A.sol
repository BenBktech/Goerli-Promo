// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import "erc721a/contracts/ERC721A.sol";
import "@openzeppelin/contracts/finance/PaymentSplitter.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract NFTIsERC721A is ERC721A, Ownable, PaymentSplitter {

    using Strings for uint;

    uint private constant PRICE = 0.002 ether;
    uint private constant MAX_NFTS_PER_ADDRESS = 3;

    mapping(address => uint) nftsPerAddress;

    uint8 private immutable i_teamLength;
    uint8 private constant MAX_SUPPLY = 20;

    string baseURI; //bafybeidyu7i6vii4lf6vdvaqpe3y5ezbo6w3ikmuxqeeoj74kutb4ox2xm

    address[] private _team = [
        0x05dA33083f4f532309Df7e6d49bE3ca8071fB1a0,
        0xFCD5a83EF51fFa5A20AeBAC92396C080345Ec304
    ];

    uint[] private _teamShares = [
        80,
        20
    ];

    constructor(string memory _baseURI) ERC721A("Alyra", "AlNFT") PaymentSplitter(_team, _teamShares) {
        i_teamLength = uint8(_team.length);
        baseURI = _baseURI;
    }

    function mint(uint256 _quantity) external payable {
        // On doit être sur que msg.sender n'ait jamais plus de 3 NFTs
        require(nftsPerAddress[msg.sender] + _quantity <= MAX_NFTS_PER_ADDRESS, "You can only mint 3 NFTs");
        require(totalSupply() + _quantity <= MAX_SUPPLY, "Max supply exceeded");
        require(msg.value >= _quantity * PRICE, "Not enough funds provided");
        nftsPerAddress[msg.sender] += _quantity;
        _mint(msg.sender, _quantity);
    }

    function tokenURI(uint _tokenId) public view virtual override(ERC721A) returns(string memory) {
        require(_exists(_tokenId), "URI query for nonexistent token");
        return string(
            abi.encodePacked(
                baseURI,
                _tokenId.toString(),
                ".json"
            )
        );
    }

    function releaseAll() external {
        for(uint i = 0 ; i < i_teamLength ; i++) {
            //Pour chaque adresse, je fais un release les gains
            release(payable(payee(i)));
        }
    }

    function setBaseURI(string memory _baseURI) external onlyOwner {
        baseURI = _baseURI;
    }

    receive() override external payable {
        revert("Only if you mint");
    }

}