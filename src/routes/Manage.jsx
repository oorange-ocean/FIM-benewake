import { useState, useEffect, useMemo } from 'react';
import AdminTable from '../components/admin/AdminTable';
import { useLoaderData } from 'react-router-dom';
import { fetchAdminData } from '../api/admin';
import adminSchema from '../constants/schemas/adminSchema';
import adminDefs from '../constants/defs/AdminDefs';
import FilterComponent from '../components/admin/FilterComponent';
import { useAlertContext } from '../hooks/useCustomContext';

const Manage = ({ type }) => {
    const data = useLoaderData();
    const { alertWarning } = useAlertContext(); // 使用 useAlertContext 获取 alertWarning
    const [rows, setRows] = useState(data);

    // 使用 useMemo 只在 rows 变化时重新计算 schema
    const schema = useMemo(() => {
        return Object.keys(rows[0] || {}).flatMap(key => adminDefs.filter((item) => item.eng === key));
    }, [rows]);

    // 初始筛选器状态设置
    const initialFilters = useMemo(() => {
        return [{ key: schema[0]?.eng, condition: 'like', value: '' }];
    }, [schema]);

    const [filters, setFilters] = useState(initialFilters);
    const hasFilter = adminSchema[type]?.filter; // 检查是否有filter

    const handleRefresh = async () => {
        const fetchUrl = adminSchema[type].select;
        const res = await fetchAdminData(fetchUrl);
        if (res.data.records.length === 0) {
            alertWarning('查询结果为空');
            setRows(data); // 重置为原始数据
        } else {
            setRows(res.data.records ?? []);
        }
    };

    const handleFilter = async (filters) => {
        const fetchUrl = adminSchema[type].filter.url;
        const res = await fetchAdminData(fetchUrl, filters); // 假设 fetchAdminData 支持第二个参数作为查询参数
        if (res.data.records.length === 0) {
            alertWarning('查询结果为空');
            setRows(data); // 重置为原始数据
        } else {
            setRows(res.data.records ?? []);
        }
    };

    useEffect(() => {
        setRows(data);
    }, [type, data]);

    useEffect(() => {
        setFilters(initialFilters); // 重置筛选器，使用 schema 的第一个元素和默认条件
    }, [initialFilters]);

    return (
        <div className='col full-screen'>
            {rows?.length > 0 ? (
                <>
                    {hasFilter && (
                        <FilterComponent schema={schema} filters={filters} setFilters={setFilters} onFilter={handleFilter} />
                    )}
                    <AdminTable
                        schema={schema}
                        type={type}
                        rows={rows}
                        setRows={setRows}
                        handleRefresh={handleRefresh}
                    />
                </>
            ) : (
                <p>No data available</p>
            )}
        </div>
    );
};

export default Manage;
