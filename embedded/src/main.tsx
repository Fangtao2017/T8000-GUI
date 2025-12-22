import React from 'react'; 
import ReactDOM from 'react-dom/client'; 
import { BrowserRouter } from 'react-router-dom'; 
import { ConfigProvider } from 'antd';
import 'antd/dist/reset.css'; 
import './styles/global.css'; 
import './table-overrides.css';
import App from './App'; 
import { NotificationProvider } from './context/NotificationContext';


const root = document.getElementById('root')!; 


ReactDOM.createRoot(root).render(
<React.StrictMode>
<BrowserRouter>
<ConfigProvider
    theme={{
      token: {
        colorPrimary: '#003A70',
      },
    }}
  >
<NotificationProvider>
<App />
</NotificationProvider>
</ConfigProvider>
</BrowserRouter>
</React.StrictMode>
);