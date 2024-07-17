import React, { useEffect, useState } from 'react';
import Toolbar from '../../components/Toolbar';
import './InventoryOccupy.css';
import InventoryOccupyTable from './InventoryOccupyTable';
import columns from './InventoryOccupyDefs';
import { getInventoryOccupySituation } from '../../api/inventory';
import CommonPaginate from '../../components/table/commonPaginate';
export default function InventoryOccupy() {
    const [data, setData] = useState([]);
    const [total, setTotal] = useState(0);
    const [pageSize, setPageSize] = useState(100);
    const [pageNum, setPageNum] = useState(1);
    const [current, setCurrent] = useState(1);
    useEffect(() => {
        async function fetchData() {
            try {
                const response = await getInventoryOccupySituation({ pageNum, pageSize });
                if (response && response.data.records) {
                    setData(response.data.records);
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
            <Toolbar features={features} />
            <InventoryOccupyTable
                data={data}
                columns={columns}
                noPagination={true}
            />
            <CommonPaginate
                current={current}
                total={total}
                pageSize={pageSize}
                onChange={(page, size) => {
                    setCurrent(page);
                    setPageSize(size);
                }}
                pageSizeOptions={[10, 100, 500, 1500]}
            />

        </div>
    );
};
