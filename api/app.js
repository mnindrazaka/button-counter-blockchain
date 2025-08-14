const express = require("express");
const Web3 = require("web3");
const contractAbi = require("./index_sol_Counter.json");
const dotenv = require("dotenv");

dotenv.config();

const contractAdress = "0xF680e6C9A57DD9BCDEF9B0468935235311a34358";
const rpcEndPoint =
  "https://sepolia.infura.io/v3/bea95d955f1748b285b97b29815bf4ed";

const accountAddress = process.env.ADDRESS;
const privateKey = process.env.PRIVATE_KEY;

const app = express();
app.use(express.json());

const web3 = new Web3(rpcEndPoint);
const contract = new web3.eth.Contract(contractAbi, contractAdress);

// GET counter value
app.get("/counter", async (req, res) => {
  try {
    const value = await contract.methods.getValue().call();
    res.json({ counter: value });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Increase counter
app.post("/counter/increase", async (req, res) => {
  try {
    const txData = contract.methods.increaseValue().encodeABI();
    const tx = {
      from: accountAddress,
      to: contractAdress,
      gas: 300000,
      data: txData,
    };

    const signedTx = await web3.eth.accounts.signTransaction(tx, privateKey);
    const receipt = await web3.eth.sendSignedTransaction(
      signedTx.rawTransaction
    );

    res.json({ status: "ok", txHash: receipt.transactionHash });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Decrease counter
app.post("/counter/decrease", async (req, res) => {
  try {
    const txData = contract.methods.decreaseValue().encodeABI();
    const tx = {
      from: accountAddress,
      to: contractAdress,
      gas: 300000,
      data: txData,
    };

    const signedTx = await web3.eth.accounts.signTransaction(tx, privateKey);
    const receipt = await web3.eth.sendSignedTransaction(
      signedTx.rawTransaction
    );

    res.json({ status: "ok", txHash: receipt.transactionHash });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => console.log("localhost:3000"));
