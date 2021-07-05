import { formatEther, parseUnits } from "ethers/lib/utils";
import { ethers } from "hardhat";
import { OneWayBridge__factory } from "../typechain";

async function main() {
  const gas = parseUnits("531642", 'gwei').mul(7);
  const eth = formatEther(gas);
  console.log(eth, "eth");
  // const factory = (
  //   await ethers.getContractFactory("OneWayBridge")
  // ) as OneWayBridge__factory;
  
  // factory.deploy

  // // If we had constructor arguments, they would be passed into deploy()
  // let contract = await factory.deploy();

  // // The address the Contract WILL have once mined
  // console.log(contract.address);

  // // The transaction that was sent to the network to deploy the Contract
  // console.log(contract.deployTransaction.hash);

  // // The contract is NOT deployed yet; we must wait until it is mined
  // await contract.deployed();
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
