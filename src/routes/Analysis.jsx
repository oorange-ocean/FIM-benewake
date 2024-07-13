import { useEffect, useState } from 'react';
import { Modal, Button, Select, Pagination } from 'antd';
import { FilterOutlined } from '@ant-design/icons';
import Table from '../components/table/Table';
import Loader from '../components/Loader';
import { useLoaderData } from 'react-router-dom';
import { fetchAnalysisData, updateAnalysisUnlikelyData, updateAllReviseToCustomerType, filterAnalysisDate } from '../api/analysis';
import analysisDefs from '../constants/defs/AnalysisDefs';
import * as XLSX from 'xlsx';
import { useAlertContext, usePagination } from '../hooks/useCustomContext';
import moment from 'moment';
import AdminFliters from '../components/AdminFilters';
import columnToSchema from '../utils/columnToSchema';
import CommonPagination from '../components/table/commonPaginate';
const { Option } = Select;
const labels = ['年度', '月度', '代理商', '新增', '临时', '日常'];

function EngToCn(col_name_ENG) {
    return analysisDefs.find(col => col.id === col_name_ENG)?.header;
}

const FilterPopup = ({ url, open, closePopup, setRows, setCurrent, setPageSize, setTotal }) => {
    const { alertWarning, alertSuccess } = useAlertContext();
    const [params, setParams] = useState({
        yearly: 1,
        monthly: 1,
        agent: 1,
        newCustomer: 1,
        temporaryCustomer: 1,
        daily: 1,
    });

    const keys = Object.keys(params).slice(0, 6);

    const handleClick = async () => {
        const res = await fetchAnalysisData(url, params);
        switch (res.code) {
            case 200:
                setRows(res.data.records);
                setCurrent(res.data.current);
                setPageSize(res.data.size);
                setTotal(res.data.total);
                break;
            case 1:
            case 400:
                alertError(res.message);
                break;
        }
        closePopup();
    };

    return (
        <Modal
            title="客户类型筛选"
            open={open}
            onCancel={closePopup}
            onOk={handleClick}
            okText="确认"
            cancelText="取消"
        >
            {labels.map((label, i) => (
                <div key={i} style={{ marginBottom: '10px' }}>
                    <span>{label}:</span>
                    <Select
                        value={params[keys[i]]}
                        onChange={(value) => setParams(prev => ({
                            ...prev, [keys[i]]: value
                        }))}
                        style={{ width: '100px', marginLeft: '10px' }}
                    >
                        <Option value={1}>是</Option>
                        <Option value={0}>否</Option>
                    </Select>
                </div>
            ))}
        </Modal>
    );
};

const Analysis = ({ schema }) => {
    const res = useLoaderData();
    const { alertConfirm } = useAlertContext();
    const [rows, setRows] = useState([]);
    const { alertError, alertWarning } = useAlertContext();
    const { pagination, setPagination } = usePagination();
    const [openPopup, setOpenPopup] = useState(false);
    const [defs, setDefs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState([]);
    const { current, total } = pagination;
    const [pageSize, setPageSize] = useState(pagination.pageSize || 100);
    const isUnlikelyData = schema.select === "getAnalysisUnlikelyData";
    // 提取更新状态的逻辑为一个函数
    const updateStateWithResponse = (response) => {
        const { records, total, current, size: pageSize } = response;
        setRows(records);
        setDefs(analysisDefs.filter((def) => Object.keys(records[0]).includes(def.id)));
        setPagination(prev => ({
            ...prev,
            total,
            current,
            pageSize
        }));
    };
    useEffect(() => {
        // 确定使用的数据源
        const dataSource = schema.select === "getAnalysisUnlikelyData" ? res : res.data;
        // 检查数据有效性
        if (!dataSource || !dataSource.records || dataSource.records.length === 0) {
            alertWarning("数据加载失败，请刷新页面重试");
            return;
        }

        // 使用提取的函数更新状态
        updateStateWithResponse(dataSource);
        //如果type改变，则重置filters
    }, [res, setPagination, schema.select]);

    const handleRefresh = async (page = current, size = pageSize) => {
        setLoading(true);  // 开始加载
        //如果是可疑数据，则在请求前先更新数据，调用updateAnalysisUnlikelyData
        if (isUnlikelyData) {
            await updateAnalysisUnlikelyData();
        }
        const res = await fetchAnalysisData(schema.select, { pageNum: page, pageSize: size });
        // 确定使用的数据源
        const dataSource = isUnlikelyData ? res : res.data;
        // 检查数据有效性
        if (!dataSource || !dataSource.records || dataSource.records.length === 0) {
            alertWarning("数据加载失败，请刷新页面重试");
            return;
        }

        // 使用提取的函数更新状态
        updateStateWithResponse(dataSource);
        setLoading(false);  // 加载完成
    };

    const handlePageChange = (page, size) => {
        handleRefresh(page, size);
    };

    const handleExport = () => {
        alertConfirm("确定导出该表单？", () => {
            const wb = XLSX.utils.book_new();
            const ws = XLSX.utils.json_to_sheet([]);

            const headers_ENG = Object.keys(rows[0]);

            let headers_CN = headers_ENG.map((name) => EngToCn(name)).filter((value) => value !== undefined);

            XLSX.utils.sheet_add_aoa(ws, [headers_CN]);
            XLSX.utils.sheet_add_json(ws, rows, { origin: 'A2', skipHeader: true });
            XLSX.utils.book_append_sheet(wb, ws);

            const timestamp = moment(new Date()).format('YYMMDDHHmmss');
            const filename = "销售员销售现况表";

            XLSX.writeFileXLSX(wb, filename + timestamp + ".xlsx");
        });
    };

    const handleRevise = async () => {
        // updateAllReviseToCustomerType
        const res = await updateAllReviseToCustomerType();
        if (res.status == 200) {
            alertWarning("更新成功");
            handleRefresh();
        }
        else {
            alertWarning("更新失败");
        }
    }

    const handleSearch = async (filters) => {
        setLoading(true);
        const res = await filterAnalysisDate(schema.select, {
            pageNum: 1,
            pageSize,
            filters
        });
        const dataSource = isUnlikelyData ? res : res.data;
        if (!dataSource || !dataSource.records || dataSource.records.length === 0) {
            alertWarning("查询结果为空");
            setRows([]);
            setLoading(false);
            return;
        }
        updateStateWithResponse(dataSource);
        setLoading(false);
    }



    return (
        <div className='col full-screen analysis'>
            <div className="col flex-center">
                <AdminFliters schema={columnToSchema(defs)} filters={filters} setFilters={setFilters} onSearch={handleSearch} />
            </div>
            <div className='row toolbar'>
                <div className='row flex-center'>
                    <Button type="text" onClick={() => handleRefresh(current, pageSize)}>刷新</Button>
                    <Button type="text" onClick={handleExport}>导出</Button>
                    {/* 确认更新客户类型,仅当schema.select === "getAnalysisUnlikelyData"出现 */}
                    {isUnlikelyData && (
                        <button type="text" onClick={() => handleRevise()} > 确认更新客户类型 </button>)}
                </div>
            </div>
            {rows?.length > 0 && rows[0].hasOwnProperty('customerType') && (
                <div className='row' style={{ marginBottom: '10px' }}>
                    <Button icon={<FilterOutlined />} onClick={() => setOpenPopup(true)}>
                        客户类型筛选
                    </Button>
                </div>
            )}
            <FilterPopup
                open={openPopup}
                closePopup={() => setOpenPopup(false)}
                url={schema.select}
                setRows={setRows}
                setCurrent={(current) => setPagination(prev => ({ ...prev, current }))}
                setPageSize={(pageSize) => setPagination(prev => ({ ...prev, pageSize }))}
                setTotal={(total) => setPagination(prev => ({ ...prev, total }))}
            />
            {loading ? (
                <Loader />
            ) : (
                <>
                    {rows?.length > 0 ? (
                        <>
                            <Table
                                data={rows}
                                columns={defs}
                                noPagination={true}
                                handleRefresh={handleRefresh}
                            />
                            <CommonPagination
                                current={current}
                                pageSize={pageSize}
                                total={total}
                                showSizeChanger
                                onChange={handlePageChange}
                                onShowSizeChange={handlePageChange}
                                style={{ marginTop: '30px', marginBottom: '20px', textAlign: 'left' }}
                                pageSizeOptions={[100, 500, 1500]}
                            />
                        </>
                    ) : (
                        <Loader />
                    )}
                </>
            )}
        </div>
    );
};

export default Analysis;
