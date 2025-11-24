import React from 'react'; 
import ReactDOM from 'react-dom/client'; 
import { BrowserRouter } from 'react-router-dom'; 
import 'antd/dist/reset.css'; 
import './styles/global.css'; 
import App from './App'; 
import { NotificationProvider } from './context/NotificationContext';


const root = document.getElementById('root')!; 


ReactDOM.createRoot(root).render(
<React.StrictMode>
<BrowserRouter>
<NotificationProvider>
<App />
</NotificationProvider>
</BrowserRouter>
</React.StrictMode>
);