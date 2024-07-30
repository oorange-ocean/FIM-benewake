import ResizableHeader from '../ResizableHeader';
import Checkbox from '../Checkbox';
import { useState } from 'react';
import { deleteAdminData } from '../../api/admin';
import AdminPaginate from './AdminPaginate';
import AdminPopup from './AdminPopup';
import moment from 'moment';
import { useAlertContext } from '../../hooks/useCustomContext';
import adminSchema from '../../constants/schemas/adminSchema';
import { useEffect } from 'react';
import { getCustomerTypes, updateCustomerType } from '../../api/admin';
import { Button, Modal, Select, Space } from 'antd';
import { EditOutlined, ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import useSortStore from '../../store/sortStore';
import AdminExcelUploader from './AdminExcelUploader';
import AdminExcelDownloader from './AdminExcelDownloader';
import Row from './AdminRow';
import { couldStartTrivia } from 'typescript';



const AdminTable = ({ schema, type, rows, setRows, handleRefresh, handleSort, data, currentPage, pageSize }) => {
    const [customerTypes, setCustomerTypes] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentRowData, setCurrentRowData] = useState(null);
    const [selectedCustomerType, setSelectedCustomerType] = useState(null);
    const { sortColumn, sortDirection, setSortState } = useSortStore();
    const [openImportPopup, setOpenImportPopup] = useState(false)
    const [openExportPopup, setOpenExportPopup] = useState(false)
    const toggleImportPopup = () => setOpenImportPopup(!openImportPopup)
    const toggleExportPopup = () => setOpenExportPopup(!openExportPopup)

    useEffect(() => {
        const fetchCustomerTypes = async () => {
            try {
                const data = await getCustomerTypes();
                setCustomerTypes(data);
            } catch (error) {
                console.error('Error fetching customer types:', error);
            }
        };

        fetchCustomerTypes();
    }, []);

    const { alertWarning, alertConfirm, alertSuccess, alertError } = useAlertContext()
    const [selectedRows, setSelectedRows] = useState([])
    const [pageNum, setPageNum] = useState(1);
    const [showPopup, setShowPopup] = useState(false)
    const [action, setAction] = useState()

    const [colWidths, setColWidths] = useState(schema.map((item) => item.width))

    const addSelectedRow = (rowIndex) => setSelectedRows([...selectedRows, rowIndex])
    const addAllRows = () => setSelectedRows(Object.keys(rows).map((num) => parseInt(num)))
    const removeSelectedRow = (rowIndex) => setSelectedRows(selectedRows.filter((index) => index !== rowIndex))
    const removeAllRows = () => { setSelectedRows([]) }

    const handleAddRow = () => {
        setShowPopup(true)
        setAction("add")
    }
    const deleteData = async () => {
        // 根据 data 里的每个对象的 id 删除
        const deleteList = data.filter((_, index) => selectedRows.includes(index));
        const payloads = (type === 'materialType') ? deleteList.map(obj => obj.itemId) : deleteList.map(obj => obj.id);
        // map 每个 payload，走 deleteAdminData 接口
        const messages = [];
        const promises = payloads.map(payload => deleteAdminData(type, payload));

        Promise.all(promises).then(results => {
            results.forEach((res, index) => {
                if (res.message.includes("失败") || res.message.includes("异常")) {
                    messages.push(`id: ${payloads[index]} ${res.message}`);
                }
            });

            if (messages.length > 0) {
                alertError(messages.join('\n'));
            } else {
                alertSuccess('删除成功！');

            }
            handleRefresh();
        }).catch(error => {
            console.log(error);
        });
    };


    const handleDelete = async () => {
        if (type === "suspiciousData" || type === "materialType") {
            deleteData()
            return
        }
        let payloads;
        const deleteList = rows.filter((_, index) => selectedRows.includes
            (index))
        const keys = adminSchema[type]['delete'].bodyKeys ?? []

        if (type === "customerName") {
            payloads = deleteList.map((item) => ({
                "deleteCustomerName": item.customerName
            }))
        }
        else {
            payloads = deleteList.map(obj =>
                Object.entries(obj)
                    .reduce((obj, [key, value]) => {
                        if (keys.includes(key)) {
                            obj[key] = value;
                        }
                        return obj;
                    }, {}))
        }

        let messages = [];
        //根据type是否是inquiryType来选择不同的删除方式
        const promises = type === "inquiryType" ? [deleteAdminData(type, payloads)] : payloads.map(payload => deleteAdminData(type, payload));

        Promise.all(promises).then(results => {
            results.forEach((res, index) => {
                if (res.message.includes("失败") || res.message.includes("异常")) {
                    messages.push(`${JSON.stringify(payloads[index])} ${res.message}`)
                }
            })

            if (messages.length > 0) {
                alertError(messages.map((message) => message + '\n'))
            }
            else {
                alertSuccess('删除成功！')
            }
            handleRefresh()
        }).catch(error => {
            console.log(error);
        });
    }

    const handleDeleteRow = () => {
        if (rows.filter((_, index) => selectedRows.includes(index)).length === 0) {
            alertWarning("未选择数据！")
        }
        else {
            alertConfirm('确认删除所选行?', handleDelete)
            setAction("delete")
        }
    }

    const handleResize = (index, newSize) => {
        setColWidths(prev => {
            const newWidths = [...prev];
            newWidths[index] = newSize;
            return newWidths;
        });
    };
    const handleClick = (columnName) => {
        let newDirection;
        if (sortColumn !== columnName) {
            newDirection = 'asc';
        } else if (sortDirection === 'asc') {
            newDirection = 'desc';
        } else {
            newDirection = null;
        }

        setSortState(newDirection ? columnName : null, newDirection);
        handleSort(newDirection ? columnName : null, newDirection);
    };

    const getSortIcon = (columnName) => {
        if (sortColumn === columnName) {
            return sortDirection === 'asc' ? <ArrowUpOutlined /> : <ArrowDownOutlined />;
        }
        return null;
    };

    // // 检查 schema 是否符合特定结构
    // const isSpecificSchema = schema.length === 3 &&
    //     schema[0].eng === 'customerName' &&
    //     schema[1].eng === 'itemCode' &&
    //     schema[2].eng === 'customerType';

    const handleCustomerTypeChange = (value) => {
        setSelectedCustomerType(value);
    };

    const importPopup =
        <div className="popup-container flex-center">
            <AdminExcelUploader close={toggleImportPopup} exportTypeNum={adminSchema[type].exportTypeNum} />
        </div>

    const handleTypeChange = async (customerName, itemCode, newType) => {
        try {
            await updateCustomerType(customerName, itemCode, newType);
            alertSuccess('客户类型更新成功');
            handleRefresh();
        } catch (error) {
            alertError('客户类型更新失败');
        }
    };

    return (
        <div className='col table-container'>
            {showPopup &&
                <AdminPopup
                    type={type}
                    action={action}
                    closePopup={() => setShowPopup(false)}
                    handleRefresh={() => {
                        setSelectedRows([])
                        handleRefresh()
                    }}
                />}
            <div className='row new-table-controls'>
                <button onClick={handleAddRow}>新增行</button>
                <button onClick={handleDeleteRow}>删除行</button>
                <button onClick={() => {
                    setSelectedRows([])
                    handleRefresh()
                }}
                >刷新</button>
                {/* 如果adminSchema里有exportTypeNum，就显示导入和导出按钮 */}
                {adminSchema[type].exportTypeNum && (
                    <Space>
                        <button
                            onClick={() => setOpenImportPopup(!openImportPopup)}
                        >
                            导入
                        </button>
                        {openImportPopup && importPopup}
                        <button
                            onClick={toggleExportPopup}
                        >
                            导出
                        </button>
                        {openExportPopup && (
                            <AdminExcelDownloader
                                close={toggleExportPopup}
                                currentPage={currentPage}
                                pageSize={pageSize}
                                exportTypeNum={adminSchema[type].exportTypeNum}
                                toggleExportPopup={toggleExportPopup}
                            />
                        )}
                    </Space>
                )}
            </div>
            <div className='admin-table-wrapper col'>
                <div className="table">
                    <div className='thead'>
                        <div className="tr">
                            <div className='th fixed checkbox' >
                                <Checkbox addRow={addAllRows} removeRow={removeAllRows} isSelected={selectedRows?.length > 0} />
                            </div>
                            {schema.map((item, i) =>
                                <ResizableHeader
                                    key={i}
                                    width={item.width}
                                    onResize={handleResize}
                                    index={i}
                                    type={item.eng}
                                >
                                    <div onClick={() => handleClick(item.eng)}
                                    >
                                        {item.cn}{getSortIcon(item.eng)}
                                    </div>
                                </ResizableHeader>)
                            }
                        </div>
                    </div>
                    <div className='tbody'>
                        {
                            rows.map((row, i) => (
                                <Row
                                    type={type}
                                    key={i}
                                    rowIndex={i}
                                    data={row}
                                    colWidths={colWidths}
                                    schema={schema}
                                    isSelected={selectedRows.includes(i)}
                                    addRow={() => addSelectedRow(i)}
                                    removeRow={() => removeSelectedRow(i)}
                                    onTypeChange={handleTypeChange}
                                    customerTypes={customerTypes}
                                    handleRefresh={handleRefresh}
                                />
                            )
                            )}
                    </div>
                </div>
            </div>
            {/* <AdminPaginate totalItems={rows.length} pageSize={pageSize} setPageSize={setPageSize} pageNum={pageNum} setPageNum={setPageNum} /> */}
        </div >
    )
}

export default AdminTable;