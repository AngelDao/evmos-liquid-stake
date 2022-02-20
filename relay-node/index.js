const { ethers } = require("ethers");
require('dotenv').config()

const provider = new ethers.providers.JsonRpcProvider(process.env.RPC);
const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider)

const abi = [
  "function submit() payable returns (uint256)",
  "function depositBufferedEther()",
  "function transientBalance(uint256) view returns (uint256)",
  "function updateDepositState()"
]

const contract = new ethers.Contract(process.env.ADDRESS, abi, provider)

async function fetchAndDeposit() {
  const bal = await provider.getBalance(process.env.ADDRESS)
  if (!bal.isZero()) {
    await contract.connect(signer).depositBufferedEther()
    const staked = await contract.connect(signer).transientBalance();
    //... stake on validator ...
    await contract.connect(signer).updateDepositState(staked)
  }
}

async function main() {
  // console.log(await contract.name())
  await fetchAndDeposit()
  setTimeout(main, 5000)
}

main()