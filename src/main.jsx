import React, { lazy, Suspense } from 'react';
import ReactDOM from 'react-dom/client'
import {
  createHashRouter,
  RouterProvider,
} from "react-router-dom";
import './index.css'
import "the-new-css-reset/css/reset.css";
import children from './path/children';
import Login from './routes/login';
import AuthProvider from './providers/AuthProvider'
import AlertProvider from './providers/AlertProvider';
import { adminChildren, dataManageChildren } from './path/adminChildren';  // 确保正确导入from './path/adminChildren';
import analysisChildren from './path/analysisChildren';
import Loader from './components/Loader';
const App = lazy(() => import('./App'));
import FeishuLogin from './routes/feishuLogin'; // 引入FeishuLogin组件
const router = createHashRouter([
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/callback/feishuLogin", // 为FeishuLogin组件配置路径
    element: <FeishuLogin />
  },
  {
    path: "/",
    element: <Suspense fallback={<Loader />}>
      <App />
    </Suspense>,
    children: children
  },
  {
    path: "/admin",
    element:
      <Suspense fallback={<Loader />}>
        <App />
      </Suspense>,
    children: adminChildren
  },
  {
    path: "/past-analysis",
    element: <Suspense fallback={<Loader />}>
      <App />
    </Suspense>,
    children: analysisChildren
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <AlertProvider>
        <Suspense fallback={<Loader />}>
          <RouterProvider router={router} />
        </Suspense>
      </AlertProvider>
    </AuthProvider>
  </React.StrictMode>
)
