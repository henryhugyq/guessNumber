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
import contractAbi from "../contracts/GuseeTheNumberABI.json";
import contractBytecode from "../contracts/GuessTheNumberByteode.json";
import {IconAlertTriangle, IconGithubLogo} from "@douyinfe/semi-icons";

const ContractDeploy =({goToContractCall}) =>{
    const {Content} = Layout
    const { Title,Paragraph,Text } = Typography;
    const [open, setOpen] = useState();

    const[contractAddress,setContractAddress] = useState();
    const[deployHash,setDeployHash] = useState();
    const [loading, setLoading] = useState(false);
    //初始值为加密哈希（keccak256）
    const[encryptedTargetNumber,setEncryptedTargetNumber] = useState();
    const[encryptedTargetNumber2,setEncryptedTargetNumber2] = useState();
    const[number1,setNumber1] = useState();
    const[number2,setNumber2] =useState();

    //读取自定义扰动值
    const secret_value = Number(process.env.SECRET_VALUE)


    async function deployContract() {
        // 检查MetaMask是否已经安装
        if (!window.ethereum) {
            console.error('MetaMask is not installed');
            return;
        }

        //这里使用的是ethers Web3Provider
        const providerWeb3 = new ethers.BrowserProvider(window.ethereum);
        //所有账号
        const currenAccounts = await window.ethereum.request({ method: "eth_requestAccounts", });
        //第一个账号
        const signer = await providerWeb3.getSigner(currenAccounts[0]);
        // 创建合约工厂
        const contractFactory = new ethers.ContractFactory(contractAbi, contractBytecode, signer);
        setLoading(true)
        // 部署合约并传入
        //因为只猜一个数字，所以需要在数组里额外补充参数干扰结果，避免遍历得出,参数应定期更换
        const GuessContract = await contractFactory.deploy(ethers.keccak256(new Uint8Array([ number1,secret_value])))
       console.log(ethers.keccak256(new Uint8Array([ number1,secret_value ])))

        const contractAddress = await GuessContract.getAddress();
        setContractAddress(contractAddress);
        await GuessContract.deploymentTransaction().wait();
        setLoading(false)
        const deployHash = GuessContract.deploymentTransaction().hash;
        setDeployHash(deployHash);
        let opts = {
            content: 'Deploy Contract Success! The tx hash is:'+deployHash,
            duration: 3,
            theme: 'light',
        };
        Toast.success(opts)
        //部署后跳转到Mint合约
        goToContractCall(contractAddress);
    }

    const encryptNumber = async ()=>{
        const hash = ethers.keccak256(new Uint8Array([ number2 ,secret_value]))
        const hash2 = ethers.keccak256(new Uint8Array([ number2 ]))
        console.log(secret_value)
        setEncryptedTargetNumber(hash)
        setEncryptedTargetNumber2(hash2)
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
                routes={['Web3Prophet', 'ContractDeploy']}
            />
            <div
                style={{
                    borderRadius: '10px',
                    border: '1px solid var(--semi-color-border)',
                    height: '376px',
                    padding: '32px',
                }}
            >
                <Title style={{ margin: '8px 0' ,marginLeft:"200"}} >Web3 Prophet-基于区块链的猜谜游戏</Title>
                <Divider margin='12px'/>
                <input
                    type="text"
                    id = "number1"
                    value={number1}
                    onChange={(e) => setNumber1(e.target.value)}
                    placeholder='输入一个数字，此数字将经过加密上链，链上存储的是hash密文'

                >
                </input>
                <br/>

                <button onClick={deployContract} style={{marginLeft:"400px"}}>部署合约</button>
                <Image
                    className="image"
                    width={500}
                    height={400}
                    src="../static/img.png"
                    style={{float:"right",marginTop:-120}}
                />
                <br/>

                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Title heading={6} style={{ margin: 8 }}>
                        {open ? 'Keccak256模拟(仅供测试)' : 'Keccak256模拟(仅供测试)'}
                    </Title>
                    <Switch checked={open} onChange={setOpen} aria-label="a switch for demo" />

                </div>
                {open && (
                    <div>

                        <input
                            type="text"
                            id = "number2"
                            value={number2}
                            onChange={(e) => setNumber2(e.target.value)}
                            placeholder='请输入测试数字'
                        >
                        </input>
                        <button onClick={encryptNumber}>keccak256加密</button>
                        <br/>
                        <a><a style={{color:"rgba(var(--semi-grey-9), 1)"}}>原结果为:</a><Paragraph copyable={{ onCopy: () => Toast.success({ content: '复制文本成功' }) }} style={{color:"rgba(var(--semi-orange-5), 1)"}} strong>{encryptedTargetNumber2}</Paragraph></a>
                        <a><a style={{color:"rgba(var(--semi-grey-9), 1)"}}>干扰结果为:</a><Paragraph copyable={{ onCopy: () => Toast.success({ content: '复制文本成功' }) }} style={{color:"rgba(var(--semi-orange-5), 1)"}} strong>{encryptedTargetNumber}</Paragraph></a>
                        <p style={{color:"rgba(var(--semi-red-6), 1)"}} ><IconAlertTriangle />干扰参数需要不定期更新，防止猜测计算规律</p>
                    </div>
                )}

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

export default ContractDeploy
