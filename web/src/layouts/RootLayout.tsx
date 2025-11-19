// 逐行讲解版 RootLayout.tsx
import React, { useState } from 'react'; // useState 控制侧边栏折叠
import { Layout } from 'antd'; // Antd 布局组件：Header/Sider/Content
import { Outlet } from 'react-router-dom'; // 渲染子路由
import TopNav from '../components/TopNav'; // 顶部导航
import IconNav from '../components/IconNav'; // 左侧图标栏（带下拉菜单）


// 从 antd 布局中取出子组件
const { Header, Sider, Content } = Layout;


const RootLayout: React.FC = () => {
	// 折叠状态（现在主要用于顶部按钮显示）
	const [collapsed, setCollapsed] = useState(false);

	return (
		<Layout style={{ height: '100vh', overflow: 'hidden' }}>
			{/* 顶部区域：放 Logo、标题、右侧占位（用户、设置等） */}
			<Header style={{ 
				padding: 0, 
				background: '#001B34', 
				borderBottom: 'none',
				height: 56,
				lineHeight: '56px',
				position: 'fixed',
				width: '100%',
				zIndex: 10,
				}}>
				<TopNav collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
			</Header>
			
		<Layout style={{ marginTop: 56, height: 'calc(100vh - 56px)' }}>
			{/* 最左侧：图标导航栏（Overview / Monitoring / Configuration / Administration） - 带下拉菜单 */}
			<Sider
				width={220}
				style={{
					background: '#001B34',
					height: '100%',
					overflow: 'hidden',
				}}
			>
				<IconNav />
			</Sider>

			{/* 右侧内容区：承载子路由页面 */}
			<Layout style={{ height: '100%', overflow: 'hidden' }}>
				<Content style={{ padding: '16px 16px 16px 16px', background: '#E8EDF2', height: '100%', overflow: 'auto' }}>
					{/* Outlet 渲染 <Route path="/"> 的子路由页面 */}
					<Outlet />
				</Content>
			</Layout>
		</Layout>
		</Layout>
	);
};


export default RootLayout;
