import React, { useEffect, useState } from 'react';
import Toolbar from '../../components/Toolbar';
import './InventoryOccupy.css';
import InventoryOccupyTable from './InventoryOccupyTable';
import columns from './InventoryOccupyDefs';
import { getInventoryOccupySituation } from '../../api/inventory';
import CommonPaginate from '../../components/table/commonPaginate';
import { useUpdateTableDataContext, useUpdateTableStatesContext, useTableStatesContext, useAlertContext, useSelectedDataContext } from '../../hooks/useCustomContext';

export default function InventoryOccupy() {
    const [data, setData] = useState([]);
    const [total, setTotal] = useState(0);
    const [pageSize, setPageSize] = useState(100);
    const [pageNum, setPageNum] = useState(1);
    const [current, setCurrent] = useState(1);
    const updateTableData = useUpdateTableDataContext()
    const [isFiltered, setIsFiltered] = useState(false);

    const handlePageChange = async (page, size) => {
        setCurrent(page);
        setPageSize(size);

        if (isFiltered) {
            // setIsLoading(true); // 开始加载
            // const fetchUrl = adminSchema[type].filter.url;
            // const res = await fetchAdminData(fetchUrl, { filterCriteriaList, page, size });
            // setIsLoading(false); // 加载结束
            // setRows(res.data.records ?? []);
            // setTotal(res.data.total);
        }
        const response = await getInventoryOccupySituation({ pageNum: page, pageSize: size });
        if (response && response.data.records) {
            setData(response.data.records);
            updateTableData({ type: "SET_TABLE_DATA", tableData: response.data.records });
            setTotal(response.data.total);
            setCurrent(response.data.current);
            setPageSize(response.data.size);
            setPageNum(response.data.pages);
        };
    }

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await getInventoryOccupySituation({ pageNum, pageSize });
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
        }

        fetchData();
    }, []);

    const features = ["pin", "unpin", "export", "refresh", 'visibility'];
    return (
        <div className='col full-screen inventoryOccupy'>
            <Toolbar
                features={features}
                handleInventoryRefresh={() => handlePageChange(current, pageSize)}
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

        </div>
    );
};
