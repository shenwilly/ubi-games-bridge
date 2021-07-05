// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {IChildERC20} from "../interfaces/IChildERC20.sol";

// mock class using IChildERC20
contract ChildERC20Mock is ERC20, IChildERC20 {
    constructor(
        string memory name,
        string memory symbol,
        address initialAccount,
        uint256 initialBalance
    ) payable ERC20(name, symbol) {
        _mint(initialAccount, initialBalance);
    }

    function mint(address account, uint256 amount) public {
        _mint(account, amount);
    }

    function withdraw(uint256 amount) override public {
        _burn(msg.sender, amount);
    }
}
