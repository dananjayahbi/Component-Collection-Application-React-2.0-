import React, { useState } from 'react';
import { AppstoreOutlined, MailOutlined, DashboardOutlined } from '@ant-design/icons';
import { Menu, Layout } from 'antd';
import { useNavigate } from 'react-router-dom';

const { Sider } = Layout;

const SideMenu = () => {
  const navigate = useNavigate();
  const [current, setCurrent] = useState('dashboard');
  const [collapsed, setCollapsed] = useState(false);

  const onClick = (e) => {
    console.log('click ', e);
    setCurrent(e.key);

    // Use navigate to go to the desired page based on the key
    switch (e.key) {
      case 'dashboard':
        navigate('/');
        break;
      case '1':
        navigate('/addProject');
        break;
      case '2':
        navigate('/Projects');
        break;
      case '5':
        navigate('/SiteSettings');
        break;
      case '6':
        navigate('/users');
        break;
      // Add more cases as needed
      default:
        break;
    }
  };

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={() => setCollapsed(!collapsed)}
      width={256}
      style={{ minHeight: '100vh' }}
      breakpoint="md"
      collapsedWidth={0}
    >
      <Menu
        theme="dark"
        onClick={onClick}
        selectedKeys={[current]}
        mode="inline"
      >
        <Menu.Item key="dashboard" icon={<DashboardOutlined />}>
          Dashboard
        </Menu.Item>

        {/* Navigation One with sub-items */}
        <Menu.SubMenu key="sub1" icon={<MailOutlined />} title="Manage">
          <Menu.Item key="1">Add Project</Menu.Item>
          <Menu.Item key="2">Projects</Menu.Item>
        </Menu.SubMenu>

        {/* Navigation Two with sub-items */}
        <Menu.SubMenu key="sub2" icon={<AppstoreOutlined />} title="Settings">
          <Menu.Item key="5">Site Settings</Menu.Item>
          <Menu.Item key="6">Users</Menu.Item>
        </Menu.SubMenu>
      </Menu>
    </Sider>
  );
};

export default SideMenu;
