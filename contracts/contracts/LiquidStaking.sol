// SPDX-License-Identifier: Unlicensed

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

import "./StEVMOS.sol";
import "./IDeposit.sol";

contract LiquidStaking is StEVMOS, Ownable {
    using SafeMath for uint256;

    // Balance on contract
    uint256 bufferedBalance = 0;
    // Balance on deposit contract
    uint256 transientBalance = 0;
    // Balance on validators
    uint256 beaconBalance = 0;

    address private deposit;


    function submit() external payable returns (uint256) {
        address sender = msg.sender;
        uint256 deposit = msg.value;

        require(deposit > 0, "ZERO_DEPOSIT");

        uint256 sharesAmount = getSharesByPooledEth(deposit);
        // First deposit
        if (sharesAmount == 0) {
            sharesAmount = deposit;
        }

        _mintShares(sender, sharesAmount);
        bufferedBalance += deposit;
        return sharesAmount;
    }

    function setDeposit(address _deposit) external onlyOwner {
        deposit = _deposit;
    }

    function depositBufferedEther() external onlyOwner {
        IDeposit(deposit).deposit{value: bufferedBalance}();
        transientBalance += bufferedBalance;
        bufferedBalance = 0;
    }

    function _getTotalPooledEther() internal view override returns (uint256) {
        return bufferedBalance.add(beaconBalance).add(transientBalance);
    }
}