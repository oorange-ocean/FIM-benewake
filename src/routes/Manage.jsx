import { useState, useEffect, useMemo } from 'react';
import { Table, Pagination } from 'antd';
import AdminTable from '../components/admin/AdminTable';
import { useLoaderData } from 'react-router-dom';
import { fetchAdminData } from '../api/admin';
import adminSchema from '../constants/schemas/adminSchema';
import adminDefs from '../constants/defs/AdminDefs';
import FilterComponent from '../components/admin/FilterComponent';
import { useAlertContext, usePagination } from '../hooks/useCustomContext';

// Utility function to convert camelCase to snake_case
const camelToSnake = (str) => {
    return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
};

const Manage = ({ type }) => {
    const data = useLoaderData();
    const { alertWarning } = useAlertContext();
    const { pagination, setPagination } = usePagination();
    const [rows, setRows] = useState(data);
    const [isFiltered, setIsFiltered] = useState(false);
    const [filterCriteriaList, setFilterCriteriaList] = useState([]);

    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(pagination.pageSize || 100);
    const [total, setTotal] = useState(pagination.total);

    const schema = useMemo(() => {
        return Object.keys(rows[0] || {}).flatMap(key => adminDefs.filter((item) => item.eng === key));
    }, [rows]);

    const initialFilters = useMemo(() => {
        return [{ key: schema[0]?.eng, condition: 'like', value: '' }];
    }, [schema]);

    const [filters, setFilters] = useState(initialFilters);
    const hasFilter = adminSchema[type]?.filter;

    const handleRefresh = async () => {
        const fetchUrl = adminSchema[type].select;
        const res = await fetchAdminData(fetchUrl);
        if (res.data.records.length === 0) {
            alertWarning('查询结果为空');
            setRows(data);
            setIsFiltered(false);
        } else {
            setRows(res.data.records ?? []);
            setIsFiltered(false);
        }
    };

    const handleSearch = async (filters) => {
        const filterCriteriaList = filters
            .filter(filter => filter.value !== '' && !/^\s*$/.test(filter.value))
            .map((filter) => ({
                colName: camelToSnake(filter.key),
                condition: filter.condition,
                value: filter.value,
            }));

        if (filterCriteriaList.length === 0) {
            alertWarning("筛选值为空！");
            return;
        }

        const fetchUrl = adminSchema[type].filter.url;
        const res = await fetchAdminData(fetchUrl, { filterCriteriaList, page: 1, size: pageSize });
        if (res.data.records.length === 0) {
            alertWarning('查询结果为空');
            setRows(data);
            setIsFiltered(false);
        } else {
            setRows(res.data.records ?? []);
            setTotal(res.data.total);
            setCurrentPage(1);
            setIsFiltered(true);
            setFilterCriteriaList(filterCriteriaList);
        }
    };

    useEffect(() => {
        setRows(data);
        setTotal(data.length);
        setPagination({ ...pagination, total: data.length })
    }, [type, data]);

    useEffect(() => {
        setFilters(initialFilters);
    }, [initialFilters]);

    const handlePageChange = async (page, size) => {
        setCurrentPage(page);
        setPageSize(size);
        setPagination({ ...pagination, current: page, pageSize: size });

        if (isFiltered) {
            const fetchUrl = adminSchema[type].filter.url;
            const res = await fetchAdminData(fetchUrl, { filterCriteriaList, page, size });
            setRows(res.data.records ?? []);
            setTotal(res.data.total);
        }
    };

    const currentData = useMemo(() => {
        if (isFiltered) {
            return rows;
        }
        const start = (currentPage - 1) * pageSize;
        const end = start + pageSize;
        return rows.slice(start, end);
    }, [rows, currentPage, pageSize, isFiltered]);

    return (
        <div className='col full-screen'>
            {rows?.length > 0 ? (
                <>
                    {hasFilter && (
                        <FilterComponent schema={schema} filters={filters} setFilters={setFilters} onSearch={handleSearch} />
                    )}
                    <AdminTable
                        schema={schema}
                        type={type}
                        rows={currentData}
                        setRows={setRows}
                        handleRefresh={handleRefresh}
                    />
                    <div style={{ marginTop: '16px' }}></div>
                    <Pagination
                        current={currentPage}
                        pageSize={pageSize}
                        total={total}
                        onChange={handlePageChange}
                        showSizeChanger
                        pageSizeOptions={[100, 500, 1500]}
                    />
                    <div style={{ marginTop: '16px' }}></div>

                </>
            ) : (
                <p>No data available</p>
            )}
        </div>
    );
};

export default Manage;
