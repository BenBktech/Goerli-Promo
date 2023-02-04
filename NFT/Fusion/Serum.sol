// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Burnable.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract Serum is ERC1155, Ownable, ERC1155Burnable, ERC1155Supply {
    constructor() ERC1155("") {}

    mapping(address => uint) public serumToUser;

    function mint(address account, uint256 id) public
    {
        require(id > 0 && id <= 4, "Not valid");
        require(serumToUser[msg.sender] == 0, "Serum already bought");
        _mint(account, id, 1, " ");
        serumToUser[msg.sender] = id;
    }

    function uri(uint _tokenId) override public pure returns(string memory) {
        return string(abi.encodePacked( 
            "ipfs://CID/",
            Strings.toString(_tokenId),
            ".json"
        ));
    }

    // The following functions are overrides required by Solidity.

    function _beforeTokenTransfer(address operator, address from, address to, uint256[] memory ids, uint256[] memory amounts, bytes memory data)
        internal
        override(ERC1155, ERC1155Supply)
    {
        super._beforeTokenTransfer(operator, from, to, ids, amounts, data);
    }
}

function transfer(address sender, uint256 amount) public {
  // Some code here
}