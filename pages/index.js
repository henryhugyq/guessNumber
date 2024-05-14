import { useState, useEffect } from 'react'
import {Contract, ethers, } from 'ethers';
import Head from "next/head";
import {
    Layout,
    Nav,
    Button,
    Breadcrumb,
    Skeleton,
    Avatar,
    Dropdown,
    Empty,
    Popover,
    Tooltip,
    Toast,
    Notification
} from '@douyinfe/semi-ui';
import {
    IconSemiLogo,
    IconBell,
    IconHelpCircle,
    IconBytedanceLogo,
    IconHome,
    IconLive,
    IconSetting,
    IconLock, IconGlobe, IconGallery, IconUnlock, IconSun, IconMoon, IconPuzzle, IconBeaker
} from '@douyinfe/semi-icons';
import ContractDeploy from "./ContractDeploy";
import ContractCall from "./ContractCall";
import Setting from "./Setting";


function Home() {
    //ethers v6
    const [account, setAccount] = useState();
    const [balance, setBalance] = useState();
    const [chainId,setChainId] = useState();
    const [contract, setContract] = useState();
    const [provider,setProvider] = useState();
    const [contractAddress, setContractAddress] = useState(null);
    const[amount,setAmount] = useState();
    const [switchStatus,setswitchStatus] = useState(true)
    const [selectedKey, setSelectedKey] = useState('Home');
    // let constract = new Contract("",abi,singer)

    const { Header, Footer, Content } = Layout;


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
        Notification.success({
            title: 'Connected to Wallet',
            content: 'You have successfully connected to your wallet.',
            duration: 3,
            position: 'topLeft'
        });

    }
    const goToContractCall = (address) => {
        setSelectedKey('ContractCall'); // 更新 selectedKey
        setContractAddress(address); // 存储合约地址
    };
    const handleMenuClick = (itemKey) => {
        setSelectedKey(itemKey);

    };
    const ToastBalance = async ()=>{
        let opts = {
            content: 'Hi,Your Balance is<'+ balance + ">ETH",
            duration: 3,
            theme:"light"
        }
        Toast.info(opts)
    }
    //显示账户
    const ToastAccount = async ()=>{
        let opts = {
            content: 'Hi,Your Account is<'+ account + ">",
            duration: 3,
            theme:"light"
        }
        Toast.info(opts)
    }

    const switchMode = () => {
        const body = document.body;
        if (body.hasAttribute('theme-mode')) {
            body.removeAttribute('theme-mode');

            setswitchStatus(true)
        } else {
            body.setAttribute('theme-mode', 'dark');
            setswitchStatus(false)

        }
    };





    return (


        <>
            <Head>
                <link rel="shortcut icon" href="../static/img.png" />
                <title>Web3 Prophet</title>
            </Head>
            <Layout style={{ border: '1px solid var(--semi-color-border)' }}>
                <Header style={{ backgroundColor: 'var(--semi-color-bg-1)' }}>
                    <div>
                        <Nav mode="horizontal" defaultSelectedKeys={['Home']}>
                            <Nav.Header>
                                <IconBeaker  style={{ fontSize: 36,color:"rgba(var(--semi-indigo-2), 1)" }} />
                            </Nav.Header>
                            <span
                                style={{
                                    color: 'var(--semi-color-text-2)',
                                }}
                            >
                            <span
                                style={{
                                    marginRight: '24px',
                                    color: 'rgba(var(--semi-light-green-5), 1)',
                                    fontWeight: '600',
                                }}
                            >
                               Web3 Prophet
                            </span>

                        </span>
                            <Nav
                                style={{ maxWidth: 220, height: '100%' }}
                                items={[
                                    { itemKey: 'Home', text: '首页',icon: <IconHome size="large" />,onClick: () => handleMenuClick('Home')},
                                    { itemKey: 'Setting', text: '设置', icon: <IconSetting size="large" /> ,onClick: () => handleMenuClick('Setting')},
                                ]}
                            />

                            <Nav.Footer>
                                {switchStatus ?
                                    <Tooltip
                                        position='bottom'
                                        content='切换到黑夜模式'>
                                        <Button
                                            theme="borderless"
                                            onClick={switchMode}
                                            icon={<IconSun />}
                                            style={{
                                                color: 'rgba(var(--semi-orange-4), 1)',
                                                marginRight: '12px',
                                            }}
                                        />
                                    </Tooltip>:
                                    <Tooltip
                                        position='bottom'
                                        content='切换到白天模式'>
                                        <Button
                                            theme="borderless"
                                            onClick={switchMode}
                                            icon={<IconMoon />}
                                            style={{
                                                color: 'rgba(var(--semi-yellow-4), 1)',
                                                marginRight: '12px',
                                            }}
                                        />
                                    </Tooltip>
                                }
                                <Popover
                                    content={
                                        <Empty
                                            title={'Web3Prophet Tips'}
                                            description="1.为了安全，链上数据是keccak256哈希密文比对|
                                    2.付一次钱可以猜三次|3.监听event来判断此时猜测状态"
                                            style={{ width: 400, margin: '0 auto', display: 'flex', padding: 20 }}
                                        />
                                    }
                                >
                                    <Button
                                        theme="borderless"
                                        icon={<IconHelpCircle size="large" />}
                                        style={{
                                            color: 'rgba(var(--semi-indigo-1), 1)',
                                            marginRight: '12px',
                                        }}
                                    />

                                </Popover>
                                {account ?
                                    <>

                                        <Button
                                            href="#"
                                            theme="borderless"
                                            style={{  color: 'rgba(var(--semi-cyan-1), 1)', marginRight: '12px',}}
                                            icon={<IconLock size="large"/>}
                                        />
                                        <Dropdown
                                            render={
                                                <Dropdown.Menu>
                                                    <Dropdown.Item onClick={ToastAccount} icon={<IconGlobe /> } style={{color:"rgba(var(--semi-teal-8), 1)"}}>Account</Dropdown.Item>
                                                    <Dropdown.Item onClick={ToastBalance} icon={<IconGallery />}style={{color:"rgba(var(--semi-yellow-6), 1)"}}>Balance</Dropdown.Item>
                                                </Dropdown.Menu>
                                            }
                                        >
                                            <Avatar
                                                alt="beautiful cat"
                                                src="../static/img_2.jpg"
                                                style={{ margin: 4 }}
                                            />
                                        </Dropdown>
                                    </>
                                    :
                                    <Tooltip
                                        position='bottom'
                                        content='点此按钮连接钱包'>
                                        <Button
                                            href="#"
                                            theme="borderless"
                                            style={{
                                                color: 'rgba(var(--semi-cyan-1), 1)',
                                                marginRight: '12px',}}
                                            onClick={connectOnclick}
                                            icon={<IconUnlock size="large"/>}

                                        />
                                    </Tooltip>

                                }

                            </Nav.Footer>
                        </Nav>
                    </div>
                </Header>
                {selectedKey === 'Home' && <ContractDeploy
                    goToContractCall={goToContractCall}/>
                }
                {selectedKey === 'ContractCall' && (
                    <ContractCall
                        contractAddress={contractAddress}
                    />
                )}
                {selectedKey === 'Setting' && <Setting />}
                <Footer
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        padding: '20px',
                        color: 'var(--semi-color-text-2)',
                        backgroundColor: 'rgba(var(--semi-grey-0), 1)',
                    }}
                >
                <span
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                    }}
                >
                    <IconBytedanceLogo size="large" style={{ marginRight: '8px' }} />
                    <span>Copyright © 2024 Web3Prophet. All Rights Reserved. </span>
                </span>
                    <span>
                    <span>反馈建议</span>
                </span>
                </Footer>
            </Layout>
        </>
    )
}

export default Home;

