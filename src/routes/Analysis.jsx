import { useEffect, useState, useRef } from 'react';
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
import { Checkbox, FormGroup, FormControlLabel } from '@mui/material';
import usePageState from '../hooks/useAnalysisPageState';
import { ParamsToString, StringToParams } from '../utils/handleCustomerType';
import { Modal, Box, Button, Typography } from '@mui/material';
import SeasonalMarket from "../charts/SeasonalMarket/SeasonalMarket"

const labels = ['年度', '月度', '代理商', '新增', '临时', '日常'];

const ContainCustomerType = [
    'getAllCustomerTypeOrdersReplaced',
    'getAllCustomerTypeOrdersBack',
    'getAllCustomerTypeordersMonthlyReplaced',
    'getAllCustomerTypeordersMonthlyBack'
];

function EngToCn(col_name_ENG) {
    return analysisDefs.find(col => col.id === col_name_ENG)?.header;
}

const CustomerTypeFilter = ({ params, setParams, onFilterChange }) => {
    const handleChange = (event) => {
        const newParams = {
            ...params,
            [event.target.name]: event.target.checked ? 1 : 0
        };
        setParams(newParams);
        onFilterChange(newParams);
    };

    return (
        <FormGroup row>
            {labels.map((label, index) => (
                <FormControlLabel
                    key={index}
                    control={
                        <Checkbox
                            checked={params[Object.keys(params)[index]] === 1}
                            onChange={handleChange}
                            name={Object.keys(params)[index]}
                        />
                    }
                    label={label}
                />
            ))}
        </FormGroup>
    );
};

const Analysis = ({ schema }) => {
    const res = useLoaderData();
    const { alertConfirm } = useAlertContext();
    const [rows, setRows] = useState([]);
    const { alertError, alertWarning } = useAlertContext();
    const [defs, setDefs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [total, setTotal] = useState(0);
    const [current, setCurrent] = useState(1);
    const { pageSize, setPageSize, filters, setFilters } = usePageState(schema.select);
    const isUnlikelyData = schema.select === "getAnalysisUnlikelyData";
    const isSeasonalMarket = schema.select === "getAllQuarterlySellingCondition";
    const prevTypeRef = useRef();
    const [isSeasonalMarketOpen, setIsSeasonalMarketOpen] = useState(false);

    const setParams = (newParams) => {
        setFilters([...filters, { key: 'customerType', condition: 'like', value: ParamsToString(newParams) }]);
    };

    // 提取更新状态的逻辑为一个函数
    const updateStateWithResponse = (response) => {

        const { records, total, current, size: pageSize } = response;
        setRows(records);
        setTotal(total);
        setCurrent(current);
        setDefs(analysisDefs.filter((def) => Object.keys(records[0]).includes(def.id)));
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
    }, [res, schema.select]);

    //给filters设置初始值
    useEffect(() => {
        if (defs.length > 0 && prevTypeRef.current !== schema.select) {
            setFilters([{ key: defs[0].id, condition: 'like', value: '' }]);
            prevTypeRef.current = schema.select;
            if (ContainCustomerType.includes(schema.select)) {
                setFilters([{ key: defs[0].id, condition: 'like', value: '' },
                { key: 'customerType', condition: 'like', value: "年度,月度,代理商,新增,临时,日常" }]);
            }
        }
    }, [defs]);

    const handleRefresh = async (page = 1, size = 100, params) => {
        setLoading(true);  // 开始加载
        //如果是可疑数据，则在请求前先更新数据，调用updateAnalysisUnlikelyData
        if (isUnlikelyData) {
            await updateAnalysisUnlikelyData();
        }
        const res = await fetchAnalysisData(schema.select, { pageNum: page, pageSize: size, ...params });
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

    const handlePageChange = (pageNum, pageSize) => {
        // handleRefresh(page, size);
        // setPageSize(size);
        if (filters.length !== 0 && filters[0]?.value !== '') {
            handleSearch(filters, pageNum, pageSize);
            setPageSize(pageSize);
            setCurrent(pageNum);
        }
        else {
            handleRefresh(pageNum, pageSize);
            setPageSize(pageSize);
            setCurrent(pageNum);
        }
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

    const handleSearch = async (filters, pageNum = 1, pageSize = 100) => {
        setLoading(true);
        // 剔除filters中所有value为空,customerType除外
        filters = filters.filter(filter => filter.value !== '' || filter.key === 'customerType');
        const res = await filterAnalysisDate(schema.select, {
            pageNum: pageNum,
            pageSize: pageSize,
            filters: filters
        }, setFilters);
        const dataSource = isUnlikelyData ? res : res.data;
        if (!dataSource || !dataSource.records || dataSource.records.length === 0) {
            alertWarning("查询结果为空");
            //将customertype改回全部
            let newFilters = filters
            if (ContainCustomerType.includes(schema.select)) {
                const index = filters.findIndex(filter => filter.key === 'customerType');
                newFilters = index !== -1
                    ? filters.map((filter, i) => i === index ? { ...filter, value: "年度,月度,代理商,新增,临时,日常" } : filter)
                    : [...filters, { key: 'customerType', condition: 'like', value: "年度,月度,代理商,新增,临时,日常" }];
            }
            setFilters(newFilters);
            setRows([]);
            setLoading(false);
            handleRefresh();
            return;
        }
        updateStateWithResponse(dataSource);
        setLoading(false);
    }

    const handleTypeFilter = async (newParams) => {
        setLoading(true)
        //处理客户类型筛选参数
        const filterStr = ParamsToString(newParams);
        //将{ "customerType": filterStr }加入filter
        const index = filters.findIndex(filter => filter.key === 'customerType');
        //将客户类型筛选参数与其它参数filter合并
        const newFilters = index !== -1
            ? filters.map((filter, i) => i === index ? { ...filter, value: filterStr } : filter)
            : [...filters, { key: 'customerType', condition: 'like', value: filterStr }];
        setFilters(newFilters);
        handleSearch(newFilters);
    };

    const closeModal = () => {
        setIsSeasonalMarketOpen(false);
    };

    return (
        <div className='col full-screen analysis'>
            <div className="col flex-center">
                <AdminFliters
                    schema={columnToSchema(defs)}
                    filters={filters}
                    setFilters={setFilters}
                    onSearch={handleSearch}
                    tableId={"analysis"}
                />
            </div>
            <div className='row toolbar'>
                <div className='row flex-center'>
                    <button type="text" onClick={() => handleRefresh(current, pageSize)}>刷新</button>
                    <button type="text" onClick={handleExport}>导出</button>
                    {/* 确认更新客户类型,仅当schema.select === "getAnalysisUnlikelyData"出现 */}
                    {isUnlikelyData && (
                        <button type="text" onClick={() => handleRevise()} > 确认更新客户类型 </button>)}
                    {isSeasonalMarket && (
                        <button type="text" onClick={() => { setIsSeasonalMarketOpen(true) }} >展示图表 </button>
                    )}
                </div>
            </div>
            {rows?.length > 0 &&
                ContainCustomerType.includes(schema.select)
                && (
                    <div className='row' style={{ marginBottom: '10px' }}>
                        <CustomerTypeFilter
                            params={StringToParams(filters.find(filter => filter.key === 'customerType')?.value)}
                            setParams={setParams}
                            onFilterChange={handleTypeFilter} />
                    </div>
                )}
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
                                pageSizeOptions={[10, 100, 500, 1500]}
                            />
                        </>
                    ) : (
                        <Loader />
                    )}
                </>
            )}
            <Modal
                open={isSeasonalMarketOpen}
                onClose={closeModal}
                aria-labelledby="seasonal-market-modal-title"
            >
                <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '80%',
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 4,
                }}>
                    <Typography id="seasonal-market-modal-title" variant="h6" component="h2">
                        季节性销售数据分析
                    </Typography>
                    <SeasonalMarket rows={rows} />
                </Box>
            </Modal>
        </div>
    );
};

export default Analysis;