// 逐行讲解版 RootLayout.tsx
import React, { useState } from 'react'; // useState 控制侧边栏折叠
import { Layout } from 'antd'; // Antd 布局组件：Header/Sider/Content
import { Outlet, useLocation, useNavigate } from 'react-router-dom'; // 获取当前路由、跳转
import TopNav from '../components/TopNav'; // 顶部导航
import IconNav from '../components/IconNav'; // 左侧图标栏
import Sidebar from '../components/SideBar'; // 中间上下文侧边栏


// 从 antd 布局中取出子组件
const { Header, Sider, Content } = Layout;


const RootLayout: React.FC = () => {
// 折叠状态（lg 以下断点自动折叠，我们也提供手动切换）
const [collapsed, setCollapsed] = useState(false);
const location = useLocation(); // 当前路径：用于高亮菜单等
const navigate = useNavigate(); // 路由跳转函数

// 当前主分区
const section = (() => {
const seg = location.pathname.split('/')[1];
if (!seg) return 'home';
if (['devices', 'settings'].includes(seg)) return seg as 'devices' | 'settings';
return 'home';
})();

	return (
		<Layout style={{ minHeight: '100vh' }}>
			{/* 顶部区域：放 Logo、标题、右侧占位（用户、设置等） */}
			<Header style={{ 
				padding: 0, 
				background: '#fff', 
				borderBottom: '1px solid #f0f0f0',
				height: 56,
				lineHeight: '56px'
			}}>
				<TopNav collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
			</Header><Layout>
{/* 最左侧：图标导航栏（Home / Devices / Settings） */}
<IconNav />

{/* 中间：上下文侧边栏，显示当前section的子菜单 */}
<Sider
collapsible
collapsed={collapsed}
onCollapse={setCollapsed}
breakpoint="lg" // 屏幕 < 992px 自动折叠
width={220}
collapsedWidth={0}
style={{ 
	background: '#001529',
	transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
}} // Antd 默认深色
trigger={null} // 隐藏默认折叠按钮，由顶部控制
>
<Sidebar
currentPath={location.pathname}
section={section}
onSelect={(path) => navigate(path)}
/>
</Sider>

{/* 右侧内容区：承载子路由页面 */}
<Layout>
<Content style={{ padding: 16, background: '#f5f5f5' }}>
{/* Outlet 渲染 <Route path="/"> 的子路由页面 */}
<Outlet />
</Content>
</Layout>
</Layout>
</Layout>
);
};


export default RootLayout;