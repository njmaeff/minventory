import {Layout, Menu} from 'antd';
import {HistoryOutlined, ToolOutlined,} from '@ant-design/icons';
import React, {useState} from "react";
import {useRouter} from "next/router";

const {Header, Content, Footer, Sider} = Layout;


export const Page: React.FC = ({children}) => {
    const [collapsed, setCollapse] = useState(false)
    const router = useRouter()
    return (
        <Layout style={{minHeight: '100vh'}} hasSider={true}>
            <Sider collapsible collapsed={collapsed}
                   onCollapse={() => setCollapse(!collapsed)}>
                <Menu theme="dark" defaultSelectedKeys={[router.asPath]}
                      mode="inline"
                      items={[
                          {
                              label: 'Inventory',
                              key: '/',
                              icon: <ToolOutlined/>,
                              onClick: () => router.push('/')
                          },
                          {
                              label: 'History',
                              key: '/history',
                              icon: <HistoryOutlined/>,
                              onClick: () => router.push('/history')
                          }
                      ]}/>
            </Sider>
            <Layout>
                <Header/>
                <Content>
                    {children}
                </Content>
                <Footer style={{textAlign: 'center'}}>Minventory</Footer>
            </Layout>
        </Layout>
    )
}
