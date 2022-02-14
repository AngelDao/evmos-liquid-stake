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
        uint256 depositVal = msg.value;

        require(depositVal > 0, "ZERO_DEPOSIT");

        uint256 sharesAmount = getSharesByPooledEth(depositVal);
        // First deposit
        if (sharesAmount == 0) {
            sharesAmount = depositVal;
        }

        _mintShares(sender, sharesAmount);
        bufferedBalance += depositVal;
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

    /**
    * To be called after staking with validator
    */
    function updateDepositState(uint256 _amount) external onlyOwner {
        transientBalance -= _amount;
        beaconBalance += _amount;
    }

    function compoundStaked(uint256 _amount) external onlyOwner {
        beaconBalance += _amount;
    }

    function _getTotalPooledEther() internal view override returns (uint256) {
        return bufferedBalance.add(beaconBalance).add(transientBalance);
    }
}