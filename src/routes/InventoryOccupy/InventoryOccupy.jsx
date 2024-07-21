import React, { useEffect, useState } from 'react';
import Toolbar from '../../components/Toolbar';
import './InventoryOccupy.css';
import InventoryOccupyTable from './InventoryOccupyTable';
import columns from './InventoryOccupyDefs';
import { getInventoryOccupySituation, getByMaterialCode } from '../../api/inventory';
import CommonPaginate from '../../components/table/commonPaginate';
import { useUpdateTableDataContext } from '../../hooks/useCustomContext';
import AdminFilters from '../../components/AdminFilters';
import { useAlertContext } from '../../hooks/useCustomContext';
import Loader from '../../components/Loader';
import usePageState from '../../hooks/useAdminPageState';

export default function InventoryOccupy() {
    const { alertWarning, alertSuccess, alertError } = useAlertContext();
    const [data, setData] = useState([]);
    const [total, setTotal] = useState(0);
    const [pageNum, setPageNum] = useState(1);
    const [current, setCurrent] = useState(1);
    const updateTableData = useUpdateTableDataContext();
    const [isFiltered, setIsFiltered] = useState(false);
    const [loading, setLoading] = useState(false);
    const { pageSize, setPageSize, filters, setFilters } = usePageState("inventoryOccupy");

    const fetchData = async (params) => {
        try {
            const response = await getInventoryOccupySituation(params);
            if (response && response.data.records) {
                setData(response.data.records);
                updateTableData({ type: "SET_TABLE_DATA", tableData: response.data.records });
                setTotal(response.data.total);
                setCurrent(response.data.current);
                setPageSize(response.data.size);
                setPageNum(response.data.pages);
            }
        } catch (error) {
            console.error('Error fetching inventory occupy situation:', error);
        }
    };

    const handlePageChange = async (page = 1, size = 100) => {
        if (isFiltered) {
            // 如果是查询状态，不允许翻页
            return;
        }
        setCurrent(page);
        setPageSize(size);
        fetchData({ pageNum: page, pageSize: size });
    };

    const handleRefresh = async () => {
        setLoading(true);
        fetchData({ pageNum: 1, pageSize: 100 });
        setLoading(false);
    };

    const handleSearch = async (filters) => {
        const response = await getByMaterialCode({ materialCode: filters[0].value });
        if (response.data) {
            setData([response.data]);
            updateTableData({ type: "SET_TABLE_DATA", tableData: [response.data] });
            setTotal(1);
            setCurrent(1);
            setPageSize(1);
            setPageNum(1);
            setIsFiltered(true);
        } else {
            alertWarning("未查询到数据！");
            handlePageChange(1, 100);
            setFilters([]);
        }
    };

    useEffect(() => {
        fetchData({ pageNum, pageSize });
    }, []);

    const features = ["pin", "unpin", "export", "refresh", 'visibility'];

    return (
        <div className='col full-screen inventoryOccupy'>
            <Toolbar
                features={features}
                handleInventoryRefresh={handleRefresh}
            />
            <AdminFilters
                schema={[{ cn: "物料编码", eng: "materialCode", width: 100 }]}
                filters={filters}
                setFilters={setFilters}
                onSearch={handleSearch}
            />
            <InventoryOccupyTable
                data={data}
                columns={columns}
                noPagination={true}
            />
            <CommonPaginate
                current={current}
                total={total}
                pageSize={pageSize}
                onChange={handlePageChange}
                showSizeChanger
                pageSizeOptions={[10, 100, 500, 1500]}
            />
            {loading && <Loader />}
        </div>
    );
}
