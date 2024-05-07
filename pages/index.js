import { useState, useEffect } from 'react'
import {Contract, ethers, } from 'ethers';
import Head from "next/head";

function Home() {
    //ethers v6
    const [account, setAccount] = useState();
    const [balance, setBalance] = useState();
    const [chainId,setChainId] = useState();
    const [contract, setContract] = useState();
    const [provider,setProvider] = useState();
    const [to,setTo] = useState();
    const[amount,setAmount] = useState();
    const[greet,setGreeting] = useState();

    //guessNumber
    const[number,setNumber] = useState();
    // let constract = new Contract("",abi,singer)

    //合约地址和可读abi
    const MYTOKEN_ADDRESS = "0xab86B52ae30bf04bF0F5Cb843cCb0060582C7aDb";
    const MYTOKEN_ABI = [
        "function owner() public view returns (address)",
        "function guessNumber(uint _guess) external payable",
        "function withdraw()",
        "function gameEnded() public view returns (bool)",
        "function endGame() external",
        "function restartGame(uint _newTargetNumber) external",
        "function setTargetNumber(uint _newTargetNumber) external",
    ];

    //点击按钮的时候登录
    const connectOnclick = async() => {
        if (!window.ethereum) {
           alert("Metamask not installed")

           return ;
        }
        //这里使用的是ethers BrowserProvider
        const providerWeb3 =  await new ethers.BrowserProvider(window.ethereum);
        setProvider(providerWeb3);

        //获取账户
        const currenAccount = await window.ethereum.request({method: "eth_requestAccounts",});
        setAccount(currenAccount[0]);
        window.ethereum.on("accountsChanged",function(accountsChange) {
            setAccount(accountsChange[0]);
        })
        //获取signer来创建contract实例
        const signer = await providerWeb3.getSigner();

        const contract = await new Contract(MYTOKEN_ADDRESS,MYTOKEN_ABI,signer);
        setContract(contract)
        //获取余额
        const currentBalance = await providerWeb3.getBalance(currenAccount[0]);
        setBalance(ethers.formatEther(currentBalance));

        //切换账号并获取余额
        window.ethereum.on("accountsChanged", function (accountsChange) {
            setAccount(accountsChange[0]);
            providerWeb3.getBalance(accountsChange[0]).then((result) => {
                setBalance(ethers.formatEther(result))
            });
        })
        //获取chainId
        const chainId = await window.ethereum.request({method:"eth_chainId"})
        window.ethereum.on("chainChanged", handleChainChanged);
        setChainId(chainId)

    }



    const getOwner = async() =>{
        console.log(contract)
        try{ let a  = await contract.owner();
            alert(a);
        }catch (error){
            alert(error)
        }
        }
        //guessNumber
    const guessNumber = async ()=>{
        try{
            const tx = await contract.guessNumber(number,{
                value: ethers.parseEther('0.01')
            })
            await tx.wait()
            alert(tx.hash)
        }catch (error){
            alert(error.message)
        }
    }

    //withdraw
    const withdraw = async () =>{
        try {
            const tx = await contract.withdraw()
            await tx.wait()
            alert(tx.hash)
        }catch (error){
            alert(error.message)
        }

    }

    //gameEnded
    const getGameStatus = async () =>{
        try{
            const status = await contract.gameEnded()
            alert(status)
        }catch (error){
            alert(error.message)
        }
    }
    //endGame
    const endGame = async () =>{
        try{
            const tx =await contract.endGame()
            await tx.wait()
            alert(tx.hash)
        }catch (error){
            alert(error.message)
        }
    }
    //restartGame
    const restart = async () =>{
        try{
            //这里的5是测试数据
            const tx =await contract.restartGame(5)
            await tx.wait()
            alert(tx.hash)
        }catch (error){
            alert(error.message)
        }
    }
    const setTargetNumber = async ()=>{
        try{
            const tx =await  contract.setTargetNumber(5)
            await tx.wait()
            alert(tx.hash)
        }catch (error){
            alert(error.message)
        }

    }
    function handleChainChanged(chainId) {
        window.location.reload();
    }


    return (


        <>
            <Head>
                <link rel="shortcut icon" href="../static/cat.png" />
                <title>2024-Dapp</title>
            </Head>

            <div className="top">
                <a href="/" style={{float:"left",color:"#2B333E",textDecoration:"none",fontSize:"28px",borderRadius:"8px"}}>Home</a>
                <a href="vote" style={{marginLeft:"20px",color:"#2B333E",textDecoration:"none",fontSize:"28px",borderRadius:"8px"}}>Vote</a>
                <a href="vote_test"style={{marginLeft:"20px",color:"#2B333E",textDecoration:"none",fontSize:"28px",borderRadius:"8px"}}>Test</a>
                {account ?
                    <button href="#" style={{ float: 'right' }} >🔐Connected</button>
                    :
                    <button href="#" style={{ float: 'right' }}onClick={connectOnclick} >🔓️Connect Wallet</button>
                }
            </div>
            <div className="container">

                <h1 id="title" style={{textAlign: 'center', color: "deepskyblue"}}>🦄 Wallet Info</h1>
                <h2 style={{color: "#8ABCD1"}}>Network Type:{chainId}</h2>
                <h2 style={{color: "#1661AB"}}>Account:{account}</h2>
                <h2 style={{color: "#1661AB"}}>Balance:{balance}</h2>

                <hr/>

                <h1 id="title" style={{textAlign: 'center', color: "#E9B6BE"}}>🌷 Call Contract</h1>
                <input
                    type="text"
                    id="greet"
                    value={number}
                    onChange={(e) => setNumber(e.target.value)}
                    placeholder="Input your guess Number"
                />
                <button onClick={guessNumber}>Guess the Number</button>
                <button onClick={getOwner}>Get The Owner</button>
                <button onClick={withdraw}>Withdraw</button>
                <br/>
                <br/>
                <button onClick={getGameStatus}>GameEnded</button>
                <button onClick={endGame}>endGame</button>
                <br/>
                <br/>
                <button onClick={setTargetNumber}>setTargetNumber</button>
                <br/>
                <br/>
                <button onClick={restart}>restart</button>
                <h4 style={{textAlign: 'center', color: "grey"}}>The Greeting Contract Address is <a
                    href="https://www.oklink.com/cn/sepolia-test/address/0x76f5c15b459044542169151f335575f501cf5ec0"
                    style={{
                        textDecoration: "none",
                        color: "lightslategrey"
                    }}>0x76f5c15b459044542169151f335575f501cf5ec0</a></h4>
                <h5 style={{color: "chocolate", textAlign: 'center'}}>Read the doc🦊<a
                    href="https://docs.metamask.io/wallet/">https://docs.metamask.io/wallet/</a></h5>
                <h5 style={{color: "slateblue", textAlign: 'center'}}>Ethers.js v6🍃<a
                    href="https://docs.ethers.org/v6/">https://docs.ethers.org/v6/</a></h5>


            </div>


            <style jsx>
            {`
                    * {
                        box-sizing: border-box;
                    }

                    body {
                        font-family: Arial;
                        padding: 10px;
                        background: #f1f1f1;
                    }


                    .top {
                        overflow: hidden;
                    background-color: #E5DFD5;
                    padding: 10px;
                    margin-top: 0;
                  }

                  .top button {
                    padding: 9px 16px;
                    max-height: 40px;
                    border-color: #a0b0ee;
                    color: #eacd76;
                    background-color: white;
                    border-radius: 8px;
                    align-items: center;
                    font-size: 16px;
                    text-align: center;
                    font-weight: bold;
                    cursor: pointer;
                  }

                  .container input {
                    border-top-style: hidden;
                    border-right-style: hidden;
                    border-left-style: hidden;
                    border-bottom-style: groove;
                    font-size: 16px;
                    width: 100%;
                    border-color: rgba(4, 4, 5, 0.1);
                    line-height: 32px;
                  }

                  .container button {
                    padding: 9px 16px;
                    max-height: 40px;
                    border-color: #c8f8b8;
                    color: #e7c8a1;
                    background-color: #f1ebc5;
                    border-radius: 8px;
                    align-items: center;
                    font-size: 16px;
                    font-weight: 500;
                    text-align: center;
                    font-weight: bold;
                    cursor: pointer;
                  }
                  
                  .custom-alert {
                    background-color: #f8d7da;
                    color: #721c24;
                    border: 1px solid #f5c6cb;
                    padding: 10px;
                    border-radius: 5px;
                }




                `}
            </style>

        </>
    )
}

export default Home;

