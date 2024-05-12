import {Breadcrumb, Layout, Skeleton} from "@douyinfe/semi-ui";


const Setting =() =>{
    const {Content} =Layout
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
                routes={['Web3Prophet', 'Setting']}
            />
            <div
                style={{
                    borderRadius: '10px',
                    border: '1px solid var(--semi-color-border)',
                    height: '376px',
                    padding: '32px',
                }}
            >
                <h1>This is Setting Content web3 prophet</h1>
            </div>
        </Content>
    )
}

export default Setting;
