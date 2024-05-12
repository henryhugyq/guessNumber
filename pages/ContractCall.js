import React, {useEffect, useState} from 'react';
import {
    Layout,
    Nav,
    Button,
    Breadcrumb,
    Tooltip,
    Toast,
    Image,
    Typography,
    Input,
    Spin,
    Divider, Banner, Notification,

    Switch
} from '@douyinfe/semi-ui';

import "@douyinfe/semi-ui/dist/css/semi.css";
import {ethers} from "ethers";

import {IconAlertTriangle, IconGithubLogo, IconSemiLogo} from "@douyinfe/semi-icons";
const ContractCall =({contractAddress}) =>{
    const {Content} =Layout
    const { Title,Paragraph,Text } = Typography;
    const [provider,setProvider] = useState();
    const [contract,setContract] = useState();
    const [account,setAccount] = useState();
    const [number,setNumber] =useState();
    const [number2,setNumber2] =useState();
    //扰动值
    const secret_value = Number(process.env.SECRET_VALUE)

    const CONTRACT_ABI = [
        "function payToPlay() external",
        "function guessNumber(bytes32 _guess) external",
        "function endGame() external",
        "function restartGame(bytes32 _newEncryptedTargetNumber) external",
        "function encryptedTargetNumber() public view returns (bytes32)",
        "function guessesLeft(address _player) public view returns (uint256)",
        "function gameEnded() public view returns (bool)",
        "event GameEnded(address winner, uint prizeAmount)",
        "event Result(string message)",
    ];

    const newContract = async () => {
        const providerWeb3 = await new ethers.BrowserProvider(window.ethereum);
        setProvider(providerWeb3);
        const currenAccounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        setAccount(currenAccounts[0])
        window.ethereum.on("accountsChanged",function(accountsChange) {
            setAccount(accountsChange[0]);
        })
        const signer = await providerWeb3.getSigner(currenAccounts[0]);
        const contract = await new ethers.Contract(contractAddress, CONTRACT_ABI, signer);
        setContract(contract);
    }
    useEffect(() => {
        newContract();
    }, []);

    //猜数字,提交哈希与链上比对
    const guess = async ()=>{
        try{
            await newContract()
            const tx = await contract.guessNumber(ethers.keccak256(new Uint8Array([ number,secret_value])));
            await tx.wait()

            contract.on("Result", (message) => {
                Toast.info(message)
                event.removeListener();
            });

            let opts = {
                content: 'Guess Finish! The tx hash is:' + tx.hash,
                duration: 5,
                theme: 'light',
            };
            Toast.success(opts)
        }catch (error){
            Toast.error(error.message)
        }

    }

    //付游戏费,默认0.0001
    const payToPlay = async ()=>{
        try{
            const tx = await contract.payToPlay({
                value: ethers.parseEther('0.0001')
            })
            await tx.wait()
            Toast.success("交易完成，游戏次数加3！交易哈希为："+tx.hash)
        }catch (error){
            Toast.error(error.message)
        }
    }
    //查询谜底
    const targetNumberHash = async ()=>{
        try {
            const targetHash = await contract.encryptedTargetNumber()
            Toast.info("本回合谜底（keccak256）为："+targetHash)
        }catch (error){
            Toast.error(error)
        }
    }
    //查询游戏状态
    const gameStatus = async ()=>{
        try {
            const status = await contract.gameEnded()
            Toast.info("本回合游戏状态是："+status)
        }catch (error){
            Toast.error(error)
        }
    }

    //查询游戏次数
    const leftCount = async ()=>{
       try {
           const count = await contract.guessesLeft(account)
           Toast.info("此账户还剩余"+count+"次机会。请及时充值")
       }catch (error){
           Toast.error(error.message)
       }
    }

    //重置游戏
    const restartGame = async ()=>{
        try{
            const tx = await contract.restartGame(ethers.keccak256(new Uint8Array([ number2,secret_value])))
            await tx.wait()

            let opts = {
                content: 'Restart Finish! The tx hash is:' + tx.hash,
                duration: 5,
                theme: 'light',
            };
            Toast.success(opts)
        }catch (error){
            Toast.error(error.message)
        }
    }
    return (
        <Content
            style={{
                padding: '24px',
                backgroundColor: 'var(--semi-color-bg-0)',
            }}
        >
            <Breadcrumb
                style={{
                    marginBottom: '24px',
                }}
                routes={['Web3Prophet', 'ContractCall']}
            />
            <div
                style={{
                    borderRadius: '10px',
                    border: '1px solid var(--semi-color-border)',
                    height: '376px',
                    padding: '32px',
                }}
            >
                <Title style={{ margin: '8px 0' ,textAlign:"center"}} >Web3 Prophet-合约调用主页面</Title>
               <a style={{textAlign:"center"}}><Paragraph copyable={{ onCopy: () => Toast.success({ content: '复制文本成功' }) }} style={{color:"rgba(var(--semi-orange-5), 1)"}} strong>{contractAddress}</Paragraph></a>
                <Divider margin='12px'>
                    <IconSemiLogo />
                </Divider>
                <button onClick={payToPlay}>支付游戏费</button>
                <button style={{marginLeft:"20px"}} onClick={targetNumberHash}>查询谜底（加密）</button>
                <button style={{marginLeft:"20px"}} onClick={gameStatus} >游戏状态</button>
                <button style={{marginLeft:"20px"}} onClick={leftCount} >游戏次数</button>
                <br/>
                <input
                    type="text"
                    id = "number"
                    value={number}
                    onChange={(e) => setNumber(e.target.value)}
                    placeholder='请输入您的猜测数字'
                >
                </input>
                <button onClick={guess}  style={{marginLeft:"20px"}} >猜数字</button>
                <br/>
                <br/>
                <input
                    type="text"
                    id = "number2"
                    value={number2}
                    onChange={(e) => setNumber2(e.target.value)}
                    placeholder='管理员可以重置目标'
                >
                </input>
                <button  style={{marginLeft:"20px"}}  onClick={restartGame}>重置游戏</button>
                <br/>
                <br/>
                <Text style={{color:"slateblue",textAlign:'center'}} icon={<IconGithubLogo />}>开源地址:<a href="https://github.com/henryhugyq/guessNumber" style={{textDecoration:"none",color:"rgba(var(--semi-grey-4), 1)"}}>https://github.com/henryhugyq/guessNumber</a></Text>
            </div>
            <style jsx>
                {`
                 button {
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
                  
                   input {
                    border-bottom-style: groove;
                    font-size: 16px;
                    width: 63.5%;
                    border-color: rgba(var(--semi-grey-9), 1);
                    line-height: 32px;
                  }         
                `}
            </style>
        </Content>
    )
}

export default ContractCall
