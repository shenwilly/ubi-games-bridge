import { ethers } from "hardhat";
import chai from "chai";
import { OneWayBridge, OneWayBridge__factory, ChildERC20Mock__factory, ChildERC20Mock } from "../typechain";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { parseUnits } from "ethers/lib/utils";

const { expect } = chai;
const { expectRevert } = require("@openzeppelin/test-helpers");

describe("OneWayBridge", () => {
  let deployer: SignerWithAddress, destination: SignerWithAddress;
  let deployerAddress: string, destinationAddress: string;
  let senderBridge: OneWayBridge;
  let receiverBridge: OneWayBridge;
  let token: ChildERC20Mock;

  before(async () => {
    [deployer, destination] = await ethers.getSigners();
    deployerAddress = deployer.address;
    destinationAddress = destination.address;

    const bridgeFactory = (await ethers.getContractFactory(
      "OneWayBridge",
      deployer
    )) as OneWayBridge__factory;

    senderBridge = await bridgeFactory.deploy();
    await senderBridge.connect(deployer).initialize(true, destinationAddress);
    
    receiverBridge = await bridgeFactory.deploy();
    await receiverBridge.connect(deployer).initialize(false, destinationAddress);

    expect(await senderBridge.isSender()).to.be.eq(true);
    expect(await receiverBridge.isSender()).to.be.eq(false);

    const TokenFactory = (await ethers.getContractFactory(
      "ChildERC20Mock",
      deployer
    )) as ChildERC20Mock__factory;
    token = await TokenFactory.deploy("TEST", "TEST", deployerAddress, parseUnits("2", 18));
  });

  describe("SenderBridge", async () => {
    it("should revert if not sender", async () => {
      await expectRevert(senderBridge.transferAll(token.address), "Must be receiver");
    });

    it("should transfer", async () => {
      const amount = parseUnits("1", 18);
      await token.connect(deployer).transfer(senderBridge.address, amount);
      expect(await token.balanceOf(senderBridge.address)).to.be.eq(amount);
      await senderBridge.withdrawAll(token.address);
      expect(await token.balanceOf(senderBridge.address)).to.be.eq(0);
    });
  });

  describe("ReceiverBridge", async () => {
    it("should revert if not receiver", async () => {
      await expectRevert(receiverBridge.withdrawAll(token.address), "Must be sender");
    });

    it("should transfer", async () => {
      const amount = parseUnits("1", 18);
      await token.connect(deployer).transfer(receiverBridge.address, amount);
      await receiverBridge.transferAll(token.address);
      expect(await token.balanceOf(destinationAddress)).to.be.eq(amount);
    });
  });
});
