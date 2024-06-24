import { useEffect, useState } from 'react';
import { Modal, Button, Select, Pagination } from 'antd';
import { FilterOutlined } from '@ant-design/icons';
import Table from '../components/table/Table';
import Loader from '../components/Loader';
import { useLoaderData } from 'react-router-dom';
import { fetchAnalysisData } from '../api/analysis';
import analysisDefs from '../constants/defs/AnalysisDefs';
import * as XLSX from 'xlsx';
import { useAlertContext, usePagination } from '../hooks/useCustomContext';
import moment from 'moment';

const { Option } = Select;

function EngToCn(col_name_ENG) {
    return analysisDefs.find(col => col.id === col_name_ENG)?.header;
}

const FilterPopup = ({ url, open, closePopup, setRows, setCurrent, setPageSize, setTotal }) => {
    const { alertWarning } = useAlertContext();
    const [params, setParams] = useState({
        yearly: 1,
        monthly: 1,
        agent: 1,
        newCustomer: 1,
        temporaryCustomer: 1,
        daily: 1,
    });

    const labels = ['年度客户', '月度客户', '代理商', '新增客户', '临时客户', '日常客户'];
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

    const { current, total } = pagination;
    const [pageSize, setPageSize] = useState(pagination.pageSize || 100);

    useEffect(() => {
        if (!res || !res.data || !res.data.records) {
            alertWarning("数据加载失败，请刷新页面重试");
            return;
        }

        setRows(res.data.records);
        setDefs(analysisDefs.filter((def) => Object.keys(res.data.records[0]).includes(def.id)));
        setPagination(prev => ({
            ...prev,
            total: res.data.total,
            current: res.data.current,
            pageSize: res.data.pageSize
        }));
    }, [res, setPagination]);

    const handleRefresh = async (page = current, size = pageSize) => {
        setLoading(true);  // 开始加载
        const res = await fetchAnalysisData(schema.select, { pageNum: page, pageSize: size });
        setRows(res.data.records);
        setDefs(analysisDefs.filter((def) => Object.keys(res.data.records[0]).includes(def.id)));
        setPagination(prev => ({
            ...prev,
            total: res.data.total,
            current: page,
            pageSize: size
        }));
        setPageSize(size);
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

    return (
        <div className='col full-screen analysis'>
            <div className='row toolbar'>
                <div className='row flex-center'>
                    <Button type="text" onClick={() => handleRefresh(current, pageSize)}>刷新</Button>
                    <Button type="text" onClick={handleExport}>导出</Button>
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
                            <Table data={rows} columns={defs} />
                            <Pagination
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
