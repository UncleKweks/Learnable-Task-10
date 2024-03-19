const contractAddress = "0x51C78a61C4CF196c7cb46CF5170728a571718099";

const abi = [
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "feedbacks",
    outputs: [
      {
        internalType: "address",
        name: "sender",
        type: "address",
      },
      {
        internalType: "string",
        name: "message",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_index",
        type: "uint256",
      },
    ],
    name: "getFeedback",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getFeedbacksCount",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_message",
        type: "string",
      },
    ],
    name: "sendFeedback",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

let currentAccount;
let contractInstance = null; // Initialize contractInstance variable

function connectWallet() {
  if (typeof window.ethereum !== "undefined") {
    ethereum
      .request({ method: "eth_requestAccounts" })
      .then((accounts) => {
        currentAccount = accounts[0];
        document.getElementById("account").textContent = currentAccount;
        initializeContract();
      })
      .catch((error) => {
        console.log(error);
      });
  } else {
    alert("Please install MetaMask to use this DApp.");
  }
}

function initializeContract() {
  if (contractInstance !== null) return; // Check if contractInstance is already initialized
  contractInstance = new web3.eth.Contract(abi, contractAddress);
  displayFeedbacks();
}

function displayFeedbacks() {
  contractInstance.methods
    .getFeedbacksCount()
    .call()
    .then((count) => {
      const feedbackList = document.getElementById("feedback-list");
      feedbackList.innerHTML = "";

      for (let i = 0; i < count; i++) {
        contractInstance.methods
          .getFeedback(i)
          .call()
          .then((result) => {
            const sender = result[0];
            const message = result[1];

            const listItem = document.createElement("li");
            listItem.innerHTML = `<strong>${sender}</strong>: ${message}`;
            feedbackList.appendChild(listItem);
          })
          .catch((error) => {
            console.log(error);
          });
      }
    })
    .catch((error) => {
      console.log(error);
    });
}

function sendFeedback() {
  const feedbackMessage = document.getElementById("feedback-message").value;

  if (!feedbackMessage) {
    alert("Please enter your feedback.");
    return;
  }

  contractInstance.methods
    .sendFeedback(feedbackMessage)
    .send({ from: currentAccount })
    .then(() => {
      document.getElementById("feedback-message").value = "";
      displayFeedbacks();
    })
    .catch((error) => {
      console.log(error);
    });
}

const connectWalletButton = document.getElementById("connect-wallet-button");

connectWalletButton.addEventListener("click", () => {
  connectWallet();
});
