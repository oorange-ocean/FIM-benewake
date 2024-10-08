import User from '../routes/User';
import All from '../routes/All';
import Charts from '../routes/Charts';
import New from '../routes/New';
import NotFound from '../routes/NotFound';
import fetchInventory from '../api/test';
import Production from '../routes/Production';
import Order from '../routes/Order';
import Customer from '../routes/Customer';
import Item from '../routes/Item';
import Inquiry from '../routes/Inquiry';
import Delivery from '../routes/Delivery';
import Inventory from '../routes/Inventory';
import Sales from '../routes/Sales';
import Edit from '../routes/Edit';
import InventoryOccupy from '../routes/InventoryOccupy/InventoryOccupy.jsx';
import ProductionPlan from '../routes/ProductionPlan/ProductionPlan.jsx';
import { fetchNewViews } from '../api/fetch';
import { findMessages, findTodos, findPODelay } from '../api/message'
import {
    defer
  } from "react-router-dom";
import api from '../api/axios';
const children = [
    {
        name: "全部订单",
        path: "all",
        id: 1,
        element: <All />,
        loader: async () => {
            // const updateDataPromise = api.get('/delivery/update')
            //     .then(response => {
            //         if (response.data.code === 200) {
            //             return response.data;
            //         } else {
            //             throw new Error(response.data.message || '请求失败');
            //         }
            //     })
            //     .catch(error => {
            //         console.error('Error in loader:', error);
            //         throw error; // 重新抛出错误，让 errorElement 捕获
            //     });
    
            return defer({
                // updateData: updateDataPromise,
                updateData:null
            });
        }
    },
    { name: "订单类型列表", path: "order", element: <Order />, id: 2 },
    { name: "客户类型列表", path: "customer", element: <Customer />, id: 3 },
    { name: "产品类型列表", path: "item", element: <Item />, id: 4 },
    { name: "订单转换列表", path: "inquiry", element: <Inquiry />, id: 5 },
    { name: "订单交付进度", path: "delivery", element: <Delivery />, id: 6 },
    // { name: "库存占用情况", path: "inventory", element: <Inventory /> },
    // { name: "生产计划", path: "production", element: <Production /> },
    { name: "仪表盘", path: "charts", element: <Charts /> },
    // { name: "销售计划", path: "sales", element: <Sales /> },
    { name: "用户主页", path: "user", element: <User /> },
    { name: "新增询单", path: "new", element: <New /> },
    { name: "修改询单", path: "edit", element: <Edit /> },
    { name: "404", path: "*", element: <NotFound /> },
    { name: "库存占用情况", path: "inventory", element: <InventoryOccupy />, id: 7 },
    { name: "生产计划", path: "production", element: <ProductionPlan />, id: 8 },
]

export default children;
