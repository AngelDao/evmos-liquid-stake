// SPDX-License-Identifier: Unlicensed

pragma solidity ^0.8.0;

import "./IDeposit.sol";

contract Deposit is IDeposit {
    function deposit() external override payable {}
}