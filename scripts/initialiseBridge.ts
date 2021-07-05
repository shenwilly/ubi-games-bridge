import { ethers } from "hardhat";
import { OneWayBridge } from "../typechain";
const { constants } = require("@openzeppelin/test-helpers");

async function main() {
  const address = "0x06fc9FFEF7C5814EA79721d89edD25F7391ad778"
  const isSender = true;
  const destination = constants.ZERO_ADDRESS;

  let contract  = (
    await ethers.getContractAt("OneWayBridge", address)
  ) as OneWayBridge;
  const tx = await contract.initialize(isSender, destination);
  console.log(tx.hash);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
