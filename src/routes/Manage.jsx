import { useState, useEffect, useMemo, useRef } from 'react';
import AdminTable from '../components/admin/AdminTable';
import { useLoaderData } from 'react-router-dom';
import { fetchAdminData } from '../api/admin';
import adminSchema from '../constants/schemas/adminSchema';
import adminDefs from '../constants/defs/AdminDefs';
import { useAlertContext, usePagination } from '../hooks/useCustomContext';
import AdminFliters from '../components/AdminFilters';
import Loader from '../components/Loader';
import CommonPagination from '../components/table/commonPaginate';
import usePageState from '../hooks/usePageState';

// Utility function to convert camelCase to snake_case
const camelToSnake = (str) => {
    return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
};

const Manage = ({ type }) => {
    let data = useLoaderData();
    if (type === "materialType") {
        data = data.data.records
    }
    const { alertWarning } = useAlertContext();
    const { pagination, setPagination } = usePagination();
    const [rows, setRows] = useState(data);
    const [isFiltered, setIsFiltered] = useState(false);
    const [filterCriteriaList, setFilterCriteriaList] = useState([]);

    const [currentPage, setCurrentPage] = useState(1);
    const { pageSize, setPageSize, filters, setFilters } = usePageState(type);
    const [total, setTotal] = useState(pagination.total);

    const [schema, setSchema] = useState([]);
    const [isLoading, setIsLoading] = useState(false); // 新增加载状态
    const hasFilter = adminSchema[type]?.filter;
    const prevTypeRef = useRef();
    const handleRefresh = async () => {
        setIsLoading(true); // 开始加载
        const fetchUrl = adminSchema[type].select;
        const res = await fetchAdminData(fetchUrl);
        setIsLoading(false); // 加载结束
        if (type === 'materialType') {
            setRows(res.data.records)
            return
        };
        setRows(res)
    };

    const handleSearch = async (filters) => {
        setIsLoading(true); // 开始加载
        const filterCriteriaList = filters
            // .filter(filter => filter.condition === 'is' || filter.condition === 'is not' || (filter.value !== '' && !/^\s*$/.test(filter.value)))
            .map((filter) => ({
                colName: camelToSnake(filter.key),
                condition: filter.condition,
                value: filter.value,
            }));

        if (filterCriteriaList.length === 0) {
            setIsLoading(false); // 加载结束
            alertWarning("筛选值为空！");
            return;
        }

        const fetchUrl = adminSchema[type].filter.url;
        const res = await fetchAdminData(fetchUrl, { filterCriteriaList, page: 1, size: pageSize });
        setIsLoading(false); // 加载结束
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

    //eg. "desc":"customerId"
    const handleSort = async (columnName, direction) => {
        setIsLoading(true); // 开始加载

        let desc, asc;
        const fetchUrl = adminSchema[type].filter.url;
        try {
            const res = await fetchAdminData(fetchUrl, {
                filterCriteriaList,
                page: 1,
                size: pageSize,
                desc: direction === 'desc' ? camelToSnake(columnName) : null,
                asc: direction === 'asc' ? camelToSnake(columnName) : null,
            });

            setIsLoading(false); // 加载结束

            if (res.data.records.length === 0) {
                alertWarning('查询结果为空');
                setRows(data);
                setIsFiltered(false);
            } else {
                setRows(res.data.records ?? []);
                setTotal(res.data.total);
                setCurrentPage(1);
                setIsFiltered(true);
            }
        } catch (error) {
            setIsLoading(false);
            alertError('排序过程中发生错误');
            console.error('Error during sorting:', error);
        }
    };

    useEffect(() => {
        console.log('setting rows and schema......');
        setRows(data);
        setTotal(data.length);
        setCurrentPage(1);
        setPagination({ ...pagination, total: data.length });

        if (data.length > 0) {
            const initialSchema = Object.keys(data[0] || {}).flatMap(key => adminDefs.filter((item) => item.eng === key));
            setSchema(initialSchema);
            console.log('initialSchema:', initialSchema);

            if (prevTypeRef.current !== type) {
                setFilters([{ key: initialSchema[0].eng, condition: 'like', value: '' }]);
                prevTypeRef.current = type;
            }
        }
    }, [type, data, adminDefs]);


    const handlePageChange = async (page, size) => {
        setCurrentPage(page);
        setPageSize(size);
        setPagination({ ...pagination, pageSize: size });

        if (isFiltered) {
            setIsLoading(true); // 开始加载
            const fetchUrl = adminSchema[type].filter.url;
            const res = await fetchAdminData(fetchUrl, { filterCriteriaList, page, size });
            setIsLoading(false); // 加载结束
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
            {isLoading ? (
                <Loader /> // 显示加载组件
            ) : (
                rows?.length > 0 ? (
                    <>
                        {hasFilter && (
                            <div className="col flex-center">
                                <AdminFliters
                                    schema={schema}
                                    filters={filters}
                                    setFilters={setFilters}
                                    onSearch={handleSearch} />
                            </div>
                        )}
                        <AdminTable
                            schema={schema}
                            type={type}
                            rows={currentData}
                            setRows={setRows}
                            handleRefresh={handleRefresh}
                            handleSort={handleSort}
                            data={rows}
                            currentPage={currentPage}
                            pageSize={pageSize}
                        />
                        <div style={{ marginTop: '16px' }}></div>
                        <CommonPagination
                            current={currentPage}
                            pageSize={pageSize}
                            total={total}
                            onChange={handlePageChange}
                            showSizeChanger
                            pageSizeOptions={[10, 100, 500, 1500]}
                        />
                        <div style={{ marginTop: '16px' }}></div>
                    </>
                ) : (
                    <p>No data available</p>
                )
            )}
        </div>
    );
};

export default Manage;
