import type {MenuProps} from 'antd';
import {Layout, Menu} from 'antd';
import {
    DesktopOutlined,
    FileOutlined,
    HistoryOutlined,
    PieChartOutlined,
    TeamOutlined,
    ToolOutlined,
    UserOutlined,
} from '@ant-design/icons';
import React, {useState} from "react";
import {useRouter} from "next/router";

const {Header, Content, Footer, Sider} = Layout;

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
    label: React.ReactNode,
    key: React.Key,
    icon?: React.ReactNode,
    children?: MenuItem[],
): MenuItem {
    return {
        key,
        icon,
        children,
        label,
    } as MenuItem;
}

const items: MenuItem[] = [
    getItem('Option 1', '1', <PieChartOutlined/>),
    getItem('Option 2', '2', <DesktopOutlined/>),
    getItem('User', 'sub1', <UserOutlined/>, [
        getItem('Tom', '3'),
        getItem('Bill', '4'),
        getItem('Alex', '5'),
    ]),
    getItem('Team', 'sub2',
        <TeamOutlined/>, [getItem('Team 1', '6'), getItem('Team 2', '8')]),
    getItem('Files', '9', <FileOutlined/>),
];

export const Page: React.FC = ({children}) => {
    const [collapsed, setCollapse] = useState(false)
    const router = useRouter()
    return (
        <Layout style={{minHeight: '100vh'}}>
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
                <Footer style={{textAlign: 'center'}}>Inventory Mini</Footer>
            </Layout>
        </Layout>
    )
}
