const { ethers } = require("ethers");
require('dotenv').config()

const amount = ethers.utils.parseEther('5');

const provider = new ethers.providers.JsonRpcProvider(process.env.RPC);
const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider)

const abi = [
  "function submit() payable returns (uint256)",
  "function depositBufferedEther()",
  "function transientBalance() view returns (uint256)",
  "function beaconBalance() view returns (uint256)",
  "function bufferedBalance() view returns (uint256)",
  "function updateDepositState()",
  "function compoundStaked(uint256)",
]

const contract = new ethers.Contract(process.env.ADDRESS, abi, provider)

async function fetchAndDeposit() {
  const bal = await contract.bufferedBalance();
  if (!bal.isZero()) {
    await contract.connect(signer).depositBufferedEther()
    const staked = await contract.transientBalance();
    //... stake on validator ...
    await contract.connect(signer).updateDepositState(staked)
  }
}

async function rebase() {
  const bal = await contract.beaconBalance();
  if (!bal.isZero()) {
    await contract.connect(signer).compoundStaked(amount)
  }
}

async function main() {
  // console.log(await contract.name())
  fetchAndDeposit()
  rebase()
  setTimeout(main, 5000)
}

main()