import React, { useEffect, useState } from 'react';
import Toolbar from '../../components/Toolbar';
import ProductionPlanSecTabs from './ProductionPlanSecondTab';
import Table from './ProductionPlanTable';
import CommonPaginate from '../../components/table/commonPaginate';
import usePageState from '../../hooks/useAdminPageState';
import transformData from './transformData';
import { getProductionPlan } from '../../api/productionPlan';
import mockProductionPlanData from './mockProductionPlanData';
import getDynamicColumns from "./getDynamicColumns";
import './ProductionPlan.css';
export default function ProductionPlan() {
    const features = ["export", "refresh"];
    const { pageSize, setPageSize, filters, setFilters } = usePageState("productionPlan");
    const [current, setCurrent] = useState(1);
    const [total, setTotal] = useState(0);
    const [records, setRecords] = useState([]);
    const [viewId, setViewId] = useState(0);
    const [titleWidth, setTitleWidth] = useState(0);
    const [columns, setColumns] = useState(([]));

    useEffect(() => {
        const titleWidth = document.querySelector('.table-wrapper').offsetWidth;
        setTitleWidth(titleWidth);
        setColumns(getDynamicColumns(viewId, titleWidth));
    }, [pageSize, viewId]);

    useEffect(() => {
        fetchData(1, pageSize, viewId);
    }, [pageSize, viewId]);

    const fetchData = async (page, size, viewId) => {
        const res = await getProductionPlan(page, size, '', viewId);
        const data = res.data || mockProductionPlanData;
        setRecords(data.records || []); // 确保 data.records 是一个数组
        setTotal(data.total || 0); // 确保 data.total 是一个数值
        setCurrent(data.current);
    };

    const handlePageChange = (page = 1, size = 100) => {
        setPageSize(size);
        fetchData(page, size, viewId);
    };

    const handleViewIdChange = (id) => {
        setViewId(id);
        setColumns(getDynamicColumns(id));
        fetchData(1, pageSize, id);
    };

    const handleRefresh = () => {
        fetchData(current, pageSize, viewId);
    };

    return (
        <div className='col full-screen ProductionPlan'>
            <Toolbar
                features={features}
                handleProductionPlanRefresh={handleRefresh}
            />
            <ProductionPlanSecTabs
                viewId={viewId}
                setViewId={handleViewIdChange}
            />
            <Table
                data={transformData(records, viewId)}
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