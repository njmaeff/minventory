import {Layout, Menu, Typography} from 'antd';
import {
    GithubOutlined,
    HistoryOutlined,
    QuestionCircleOutlined,
    ToolOutlined,
} from '@ant-design/icons';
import React, {useState} from "react";
import {useRouter} from "next/router";
import {css} from "@emotion/react";

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
                          },
                          {
                              label: 'About',
                              key: '/about',
                              icon: <QuestionCircleOutlined/>,
                              onClick: () => router.push('/about')
                          }
                      ]}/>
            </Sider>
            <Layout>
                <Content>
                    {children}
                </Content>
                <Footer css={
                    css`
                        text-align: center;
                    `
                }>
                    <Typography.Link
                        href={`https://github.com/njmaeff/minventory`}
                        target={`_blank`}><GithubOutlined/> Minventory</Typography.Link>
                </Footer>
            </Layout>
        </Layout>
    )
}
