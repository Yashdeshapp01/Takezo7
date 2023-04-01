import React, { useState } from "react";
import * as web3  from "@solana/web3.js";




const WalletCard = () => {
  const [balance, setBalance] = useState(null);
  const [defaultAcc, setDefaultAcc] = useState(null);
  const [errmsg, setErrMsg] = useState(null);
  const [butText, setButText] = useState("Connect Wallet");
  const [receiverAddress, setReceiverAddress] = useState("");
  const [amount, setAmount] = useState("");

  const connectWalletHandler = async () => {
    
    console.log(defaultAcc);
    if (window.solana) {
      try {
        const provider = window.solana
        const { publicKey } = await window.solana.connect();
        accChangeHandler(publicKey.toString());
        return provider
      } catch (error) {
        console.error(error);
        setErrMsg("Failed to connect to Phantom wallet");
      }
    } else {
      setErrMsg("Install Phantom wallet");
    }
  };

   const sendTransaction = async () => {
    var provider = await connectWalletHandler()
    if (!defaultAcc) {
      setErrMsg("Connect to wallet first");
      return;
    }
    if (!receiverAddress || !amount) {
      setErrMsg("Enter a receiver address and amount");
      return;
    }
  
    const connection = new web3.Connection(web3.clusterApiUrl("devnet"), "confirmed");
    const senderPublicKey = new web3.PublicKey(defaultAcc);
    const receiverPublicKey = new web3.PublicKey(receiverAddress);
    // const lamports = web3.LAMPORTS_PER_SOL * amount;
    var airdropSignature = await connection.requestAirdrop(
        senderPublicKey,
        web3.LAMPORTS_PER_SOL,
      );
  
      // Confirming that the airdrop went through
      await connection.confirmTransaction(airdropSignature);
      console.log("Airdropped")
    console.log(web3.LAMPORTS_PER_SOL*amount);
      var transaction = new web3.Transaction().add(
        web3.SystemProgram.transfer({
          fromPubkey: senderPublicKey,
          toPubkey: receiverPublicKey,
          lamports: web3.LAMPORTS_PER_SOL*amount //Investing 1 SOL. Remember 1 Lamport = 10^-9 SOL.
        }),
      );
      transaction.feePayer = await provider.publicKey;
      let blockhashObj = await connection.getRecentBlockhash();
      transaction.recentBlockhash = await blockhashObj.blockhash;
  
      // Transaction constructor initialized successfully
      if(transaction) {
        console.log("Txn created successfully");
      }
      
      // Request creator to sign the transaction (allow the transaction)
      let signed = await provider.signTransaction(transaction);
      // The signature is generated
      let signature = await connection.sendRawTransaction(signed.serialize());
      // Confirm whether the transaction went through or not
      await connection.confirmTransaction(signature);
  
      //Print the signature here
      console.log("Signature: ", signature);
    }
  
  
 

  const accChangeHandler = async (newAccount) => {
    setDefaultAcc(newAccount);
    await getbalance(newAccount.toString());
  };

  const getbalance = async (address) => {
    console.log(address);
    const connection = new web3.Connection(web3.clusterApiUrl("devnet"), "confirmed");
    const publicKey = new web3.PublicKey(address);
    const balance = await connection.getBalance(publicKey);
    setBalance(balance/(2*web3.LAMPORTS_PER_SOL)-0.99999);
  };

  const chainChangedHandler = () => {
    window.location.reload();
  };

  window.solana?.on("connect", () => {
    console.log("Connected to Phantom wallet");
  });
  window.solana?.on("disconnect", () => {
    console.log("Disconnected from Phantom wallet");
    setDefaultAcc(null);
    setBalance(null);
  });
  window.solana?.on("accountsChanged", accChangeHandler);
  window.solana?.on("networkChange", chainChangedHandler);
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
