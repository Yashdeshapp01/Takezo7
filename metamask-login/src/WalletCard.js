import React, { useState } from "react";
import { ethers } from "ethers";

const WalletCard = () => {
  const [balance, setBalance] = useState(null);
  const [defaultAcc, setDefaultAcc] = useState(null);
  const [errmsg, setErrMsg] = useState(null);
  const [butText, setButText] = useState("Connect Wallet");
  const [receiverAddress, setReceiverAddress] = useState("");
  const [amount, setAmount] = useState("");

  const connectWalletHandler = () => {
    console.log(defaultAcc);
    if (window.ethereum) {
      window.ethereum
        .request({ method: "eth_requestAccounts" })
        .then((result) => {
          accChangeHandler(result[0]);
        });
    } else {
      setErrMsg("Install Metamask");
    }
  };

  const sendTransaction = () => {
    const transactionObject = {
      from: defaultAcc,
      to: receiverAddress,
      gas: "0x76c0", // 30400
      gasPrice: "0x9184e72a000", // 10000000000000
      value: ethers.parseEther(amount).toString(16),
    };
    window.ethereum.request({ method: "eth_sendTransaction", params: [transactionObject] });
  };

  const accChangeHandler = (newAccount) => {
    setDefaultAcc(newAccount);
    getBalance(newAccount.toString());
  };

  const getBalance = (address) => {
    window.ethereum
      .request({ method: "eth_getBalance", params: [address, "latest"] })
      .then((balance) => {
        setBalance(ethers.formatEther(balance));
      });
  };

  const chainChangedHandler = () => {
    window.location.reload();
  };

  window.ethereum.on("accountsChanged", accChangeHandler);
  window.ethereum.on("chainChanged", chainChangedHandler);

  return (
    <div className="walletcard">
      <button onClick={connectWalletHandler}>{butText}</button>
      <button onClick={sendTransaction}>Send Transaction</button>
      <div>
        <h2>Address: {defaultAcc}</h2>
        <h2>Balance: {balance}</h2>
      </div>
      {errmsg}
      <div>
        <label htmlFor="receiverAddress">Receiver's address:</label>
        <input
          id="receiverAddress"
          type="text"
          value={receiverAddress}
          onChange={(e) => setReceiverAddress(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="amount">Amount:</label>
        <input
          id="amount"
          type="text"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>
    </div>
  );
};

export default WalletCard;
