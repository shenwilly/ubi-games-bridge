import { parseUnits } from "ethers/lib/utils";
import { ethers } from "hardhat";
import { UbiBurner__factory } from "../typechain";

async function main() {
  const gasPrice = 7;
  const factory = (
    await ethers.getContractFactory("UbiBurner")
  ) as UbiBurner__factory;
  
  let contract  = await factory.deploy({
    gasPrice: parseUnits(`${gasPrice}`, 'gwei')
  });
  console.log(contract.address);
  await contract.deployed();
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
