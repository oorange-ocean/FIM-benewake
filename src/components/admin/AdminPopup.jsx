import React from 'react'
import adminSchema from '../../constants/schemas/adminSchema';
import { useState } from 'react';
import adminDefs from '../../constants/defs/AdminDefs';
import { addAdminData } from '../../api/admin';
import { useAlertContext } from '../../hooks/useCustomContext';

const getLabels = (array) => {
    return array.reduce((acc, key) => {
        const item = adminDefs.find(item => item.eng === key);
        if (item) {
            acc.push(item.cn);
        }
        return acc;
    }, [])
}

const getInitialValues = (array) => {
    return array.reduce((acc, key) => {
        acc[key] = ''
        return acc
    }, {})
}

const AdminPopup = ({ type, action, closePopup, handleRefresh }) => {
    const { alertError, alertSuccess, alertWarning } = useAlertContext();
    let keys = adminSchema[type][action].bodyKeys ?? []

    const [values, setValues] = useState(getInitialValues(keys))
    const labels = action !== "delete" && getLabels(keys)

    const handleAdd = async (e) => {
        e.preventDefault()
        const res = await addAdminData(type, values)
        console.log(res)
        //字符串message中有成功
        const regex = /成功/g
        if (res.data?.includes("成功") || res.message?.match(regex)) {
            alertSuccess(res.data)
        }
        else if (res.data.includes("失败")) {
            alertError(res.data);
        }
        else {
            alertWarning(res.data)
        }
        handleRefresh()
        closePopup()
    }


    const addForm = <form className='col flex-center g1' onSubmit={handleAdd}>
        {labels?.length > 0 && labels.map((label, index) =>
            label === "产品类型" ? (
                <label key={index} htmlFor={label} className='row'>
                    {label}
                    <select
                        id={label}
                        name={label}
                        value={values[keys[index]]}
                        onChange={(e) => setValues(prev => ({ ...prev, [keys[index]]: e.target.value }))}
                    >
                        <option value="已有标品">已有标品</option>
                        <option value="已有定制">已有定制</option>
                        <option value="新增软件定制">新增软件定制</option>
                        <option value="新增原材料定制">新增原材料定制</option>
                        <option value="新增原材料+软件定制">新增原材料+软件定制</option>
                    </select>
                </label>
            ) : (
                <label key={index} htmlFor={label} className='row'>
                    {label}
                    <input
                        id={label}
                        name={label}
                        type="text"
                        value={values[keys[index]]}
                        onChange={(e) => setValues(prev => ({ ...prev, [keys[index]]: e.target.value }))}
                    />
                </label>
            )
        )}
        <div className='row mt1 g1'>
            <button className='small white bordered' onClick={closePopup}>取消</button>
            <input type="submit" value="确定" className='small blue40' />
        </div>
    </form>
    // 动态计算高度

    const baseHeight = 14;
    const extraHeight = labels && labels.length > 2 ? (labels.length - 2) * 3 : 0;
    const totalHeight = baseHeight + extraHeight;

    return (
        <div className='popup-container admin-popup flex-center'>
            <div className='admin-popup-wrapper col flex-center' style={{ height: `${totalHeight}rem` }}>
                {action === "add" && addForm}
            </div>
        </div>
    )
}

export default AdminPopup