async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  console.log("Account balance:", (await deployer.getBalance()).toString());

  const LiquidStaking = await ethers.getContractFactory("LiquidStaking");
  const liquidStaking = await LiquidStaking.deploy();

  console.log("Liquid Staking address:", liquidStaking.address);

  const Deposit = await ethers.getContractFactory("Deposit");
  const deposit = await Deposit.deploy();

  console.log("Deposit address:", deposit.address);

  await liquidStaking.setDeposit(deposit.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });