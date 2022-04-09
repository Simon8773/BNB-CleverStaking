
const { expect } = require("chai");

describe("DeStorm Minting the token and returning it", function () {
  it("should the contract be able to mint a function and return it", async function () {
    const Token = await ethers.getContractFactory("NFT"); // Getting the contract
    const DesTokem = await Token.deploy("HALA", "HALA", "https://gateway.pinata.cloud/ipfs/QmQJ7ptxVqNNRyb9yWmi1Upg9mVCFoikiEsR51hqvfuwGC/"); //Deploying the Contract

    

    const transaction = await DesTokem.mint("0x70997970c51812dc3a010c7d01b50e0d17dc79c8", "1"); // Minting the token
    const tx = await transaction.wait() // Waiting for the token to be minted

    const event = tx.events[0];
    const value = event.args[2];
    const tokenId = value.toNumber(); // Getting the tokenID

    const tokenURI = await DesTokem.tokenURI(tokenId) // Using the tokenURI from ERC721 to retrieve de metadata
    console.log(tokenURI);
    expect(tokenURI).to.be.equal(tokenURI); // Comparing and testing
  });
});