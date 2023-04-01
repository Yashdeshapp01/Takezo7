import react from "react";
import {ethers} from 'ethers'

const WalletCard = ()=>{
    const[balance,Setbalance]=react.useState(null);
    const[defaultAcc,SetdefaultAcc]=react.useState(null);
    const[errmsg,Seterrmsg]=react.useState(null);
    const[buttext,Setbuttext]=react.useState('Connect Wallet');
    
    const connectWallethandler=()=>{
        if(window.ethereum){
        window.ethereum.request({method: 'eth_requestAccounts'})
        .then(result=>{
            accChangehandler(result[0]);
        })
        }
        else{
            Seterrmsg("Install Metamask")
        }
    }

    const accChangehandler=(newAccount)=>{

        SetdefaultAcc(newAccount)
        getbalance(newAccount.toString())

    }
    const getbalance=(address)=>{
        window.ethereum.request({method: 'eth_getBalance',params:[address,'latest']})
        .then(balance=>{
           Setbalance(ethers.formatEther(balance));
        })
    }
    const chainChangedHandler = () => {
		
		window.location.reload();
	}
    window.ethereum.on('accountsChanged', accChangehandler);
    window.ethereum.on('chainChanged', chainChangedHandler);
    return(
    <div className="walletcard">
        <button onClick={connectWallethandler}>{buttext}</button>
    <div>
        <h2>Address:{defaultAcc}</h2>
        <h2>Balance:{balance}</h2>
    </div>
    {errmsg}
    </div>

    )
}

export default WalletCard