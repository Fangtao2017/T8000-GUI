// 逐行讲解版 RootLayout.tsx
import React from 'react';
import { Layout } from 'antd'; // Antd 布局组件：Header/Sider/Content
import { Outlet } from 'react-router-dom'; // 渲染子路由
import SecondaryNav from '../components/SecondaryNav'; // 二级导航
import TopNav from '../components/TopNav'; // 顶部导航

// 从 antd 布局中取出子组件
const { Header, Content } = Layout;

const RootLayout: React.FC = () => {
	return (
		<Layout style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
			{/* 顶部区域：放 Logo、标题、右侧占位（用户、设置等） */}
			<Header style={{ 
				padding: 0, 
				background: '#ffffff', 
				borderBottom: 'none',
				height: 'auto',
				lineHeight: 'normal',
				zIndex: 10,
				flex: '0 0 auto',
				display: 'flex',
				flexDirection: 'column'
			}}>
				<div style={{ height: 64, flex: '0 0 64px' }}>
					<TopNav />
				</div>
				<SecondaryNav />
			</Header>
			
			{/* 内容区：承载子路由页面 */}
			<Content style={{ 
				padding: '16px', 
				background: '#E8EDF2', 
				flex: '1 1 auto', 
				overflow: 'hidden',
				position: 'relative'
			}}>
				{/* Outlet 渲染 <Route path="/"> 的子路由页面 */}
				<Outlet />
			</Content>
		</Layout>
	);
};

export default RootLayout;
