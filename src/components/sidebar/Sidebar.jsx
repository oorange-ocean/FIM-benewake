import { NavLink, useNavigate } from 'react-router-dom';
import children from '../../path/children';
import { useAuthContext, useUpdateTabContext } from '../../hooks/useCustomContext';
import { ReactComponent as LogoutIcon } from '../../assets/icons/logout.svg';
import { logout, updatePwd } from '../../api/auth';
import { adminChildren, dataManageChildren } from '../../path/adminChildren';
import { ADMIN_USER } from '../../constants/Global';
import CustomDropdown from './Dropdown';
import analysisChildren from '../../path/analysisChildren';
import { DownOutlined, LogoutOutlined } from '@ant-design/icons';
import { Button, Dropdown, Menu, Space, Modal, Input, Form } from 'antd';
import { useState } from 'react';

export default function Sidebar({ showSidebar }) {
    const updateTabs = useUpdateTabContext();
    const navigate = useNavigate();
    const { auth } = useAuthContext();
    const [modalOpen, setModalOpen] = useState(false);
    const [form] = Form.useForm();


    const handleClick = (newTab, event) => {
        event.stopPropagation();
        updateTabs({ type: "ADD_TAB", tab: newTab });
    };

    const handleLogout = async () => {
        await logout();
        navigate("/login");
    };

    const handleOpenModal = () => {
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        form.resetFields();
    };

    const handleUpdatePwd = async (values) => {
        const { oldPassword, newPassword, rePassword } = values;
        const userId = auth.userId?.toString(); // 从 auth 获取 userId 并转换为字符串
        try {
            await updatePwd({ oldPassword, newPassword, rePassword, userId });
            handleCloseModal();
        } catch (error) {
            console.log(error);
        }
    };

    const items = [
        {
            key: '1',
            label: (
                <button onClick={handleLogout} >
                    退出登录&nbsp;<LogoutIcon />
                </button>
            ),
        }
    ];

    return (
        <div className={`sidebar col ${showSidebar ? "" : "hidden"}`}>
            <nav className="col">
                {children.map((obj, i) =>
                    obj.name !== "用户主页" &&
                    obj.name !== "新增询单" &&
                    obj.name !== "修改询单" &&
                    obj.name !== "404" &&
                    <NavLink
                        key={i}
                        to={"/" + obj.path}
                        className="sidebar-item"
                        onClick={(e) => handleClick(obj, e)}
                    >
                        {obj.name}
                    </NavLink>
                )}
                {
                    auth?.userType == ADMIN_USER &&
                    adminChildren.map((obj, i) =>
                        obj.inSidebar && <NavLink
                            key={i}
                            to={"/admin/" + obj.path}
                            className="sidebar-item"
                            onClick={!obj.menu && ((e) => handleClick(obj, e))}
                        >
                            {obj.name}
                        </NavLink>
                    )
                }
                {
                    auth?.userType == ADMIN_USER &&
                    <CustomDropdown
                        items={dataManageChildren}
                        label="数据管理"
                        type="admin"
                    />
                }
                <CustomDropdown
                    items={analysisChildren}
                    label="数据分析"
                    type="past-analysis"
                />
            </nav>
            <Dropdown menu={{ items }} placement="top">
                <Button>用户：{auth?.username ?? ""}</Button>
            </Dropdown>
        </div>
    );
}
