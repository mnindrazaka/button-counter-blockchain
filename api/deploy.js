const { ethers } = require("ethers");
const solc = require("solc");
const fs = require("fs");
const dotenv = require("dotenv");

dotenv.config();

const source = fs.readFileSync("contract.sol", "utf8");

const input = {
  language: "Solidity",
  sources: {
    "contract.sol": { content: source },
  },
  settings: {
    outputSelection: {
      "*": {
        "*": ["abi", "evm.bytecode"],
      },
    },
  },
};

const output = JSON.parse(solc.compile(JSON.stringify(input)));
const contractFile = output.contracts["contract.sol"]["Counter"];

const abi = contractFile.abi;
const bytecode = contractFile.evm.bytecode.object;

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

(async () => {
  console.log("Deploying contract...");
  const factory = new ethers.ContractFactory(abi, bytecode, wallet);
  const contract = await factory.deploy();

  console.log("Wait for Deployment...");

  await contract.waitForDeployment();

  console.log("Deployed at:", await contract.getAddress());
})();
