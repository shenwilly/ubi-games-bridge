import { parseUnits } from "ethers/lib/utils";
import { ethers } from "hardhat";
import { MaticPOSClient } from '@maticnetwork/maticjs';

// Finalise bridge transfer by submitting Matic PoS burn tx hash
async function main() {
  const [signer] = await ethers.getSigners();

  const burnTxHash = "0x0b408c8265ceebaaf74e1b524aa2aaad84f522723b36e50f9148fbe76182c4a3";
  const rootManagerAddress = "0xa0c68c638235ee32657e8f720a23cec1bfc77c77";
  const gasPrice = 12;

  const INFURA_API_KEY = process.env.INFURA_API_KEY || "";
  const maticPOSClient = new MaticPOSClient({
    network: "mainnet",
    version: "v1",
    parentProvider: `https://mainnet.infura.io/v3/${INFURA_API_KEY}`,
    maticProvider: `https://polygon-mainnet.infura.io/v3/${INFURA_API_KEY}`
  });
  
  const exitCalldata = await maticPOSClient
    .exitERC20(burnTxHash, { from: signer.address, encodeAbi: true });
  console.log(exitCalldata.data);

  const tx = await signer.sendTransaction({
    to: rootManagerAddress,
    data: exitCalldata.data, 
    gasPrice: parseUnits(`${gasPrice}`, "gwei"),
  })
  console.log("Tx Hash:", tx.hash);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
