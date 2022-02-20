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
  "function updateDepositState(uint256)",
  "function compoundStaked(uint256)",
]

const contract = new ethers.Contract(process.env.ADDRESS, abi, provider)

async function fetchAndDeposit() {
  const bal = await contract.bufferedBalance();
  console.log(bal)
  if (!bal.isZero()) {
    await contract.connect(signer).depositBufferedEther()
    const staked = await contract.transientBalance();
    //... stake on validator ...
    await contract.connect(signer).updateDepositState(staked.toString())
  }
}

async function rebase() {
  const bal = await contract.beaconBalance();
  console.log(bal)
  if (!bal.isZero()) {
    await contract.connect(signer).compoundStaked(amount.toString())
  }
}

async function main() {
  // console.log(await contract.transientBalance());
  fetchAndDeposit()
  rebase()
  setTimeout(main, 5000)
}

main()