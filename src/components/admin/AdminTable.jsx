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
const Row = ({ schema, data, colWidths, addRow, removeRow, isSelected, onButtonClick }) => {
    // // 检查 schema 是否符合特定结构
    // const isSpecificSchema = schema.length === 3 &&
    //     schema[0].eng === 'customerName' &&
    //     schema[1].eng === 'itemCode' &&
    //     schema[2].eng === 'customerType';

    return (
        <div className="tr">
            <div className='td fixed checkbox'>
                <Checkbox addRow={addRow} removeRow={removeRow} isSelected={isSelected} />
            </div>
            {schema.map((cell, i) => (
                <div
                    style={{ width: colWidths[i] }}
                    className='td'
                    key={i}>
                    {cell.eng === "startMonth" ? (
                        <span>{moment(data.startMonth).format('YYYY/MM/DD')}</span>
                    ) : cell.eng === "customerType" ? (
                        <span>{data[cell.eng]} <EditOutlined onClick={() => onButtonClick(data)} /></span>
                    ) : (
                        <span>{data[cell.eng]}</span>
                    )}
                </div>
            ))}

        </div>
    )
}



const AdminTable = ({ schema, type, rows, setRows, handleRefresh, handleSort, data }) => {
    const [customerTypes, setCustomerTypes] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentRowData, setCurrentRowData] = useState(null);
    const [selectedCustomerType, setSelectedCustomerType] = useState(null);
    const { sortColumn, sortDirection, setSortState } = useSortStore();
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
    const [pageSize, setPageSize] = useState(100);
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
    const deleteSuspiciousData = async () => {
        // 根据 data 里的每个对象的 id 删除
        const deleteList = data.filter((_, index) => selectedRows.includes(index));
        const payloads = deleteList.map(obj => obj.id);
        // map 每个 payload，走 deleteAdminData 接口
        const messages = [];
        const promises = payloads.map(payload => deleteAdminData('suspiciousData', payload));

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
        if (type === "suspiciousData") {
            deleteSuspiciousData()
            return
        }
        let payloads;
        const deleteList = rows.filter((_, index) => selectedRows.includes
            (index))
        const keys = adminSchema[type]['delete'].bodyKeys ?? []

        if (type === "customerName") {
            payloads = deleteList.map((item) => ({
                "deletCustomerName": item.customerName
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
        const promises = payloads.map(payload => deleteAdminData(type, payload));

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

    // 处理按钮点击事件
    const handleButtonClick = (rowData) => {
        setCurrentRowData(rowData);
        setSelectedCustomerType(rowData.customerType);
        setIsModalOpen(true);
    };

    const handleModalOk = async () => {
        try {
            await updateCustomerType(currentRowData.customerName, currentRowData.itemCode, selectedCustomerType);
            alertSuccess('客户类型更新成功');
            handleRefresh();
        } catch (error) {
            alertError('客户类型更新失败');
        }
        setIsModalOpen(false);
    };


    const handleModalCancel = () => {
        setIsModalOpen(false);
    };
    const handleCustomerTypeChange = (value) => {
        setSelectedCustomerType(value);
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
                            {/* {isSpecificSchema && (
                                <ResizableHeader
                                    key={'action'}
                                    width={100}
                                    onResize={handleResize}
                                    index={schema.length}
                                    type={'action'}
                                >
                                    修改客户类型
                                </ResizableHeader>
                            )} */}
                        </div>
                    </div>
                    <div className='tbody'>
                        {
                            rows.map((row, i) => (
                                <Row
                                    key={i}
                                    rowIndex={i}
                                    data={row}
                                    colWidths={colWidths}
                                    schema={schema}
                                    isSelected={selectedRows.includes(i)}
                                    addRow={() => addSelectedRow(i)}
                                    removeRow={() => removeSelectedRow(i)}
                                    onButtonClick={handleButtonClick}
                                />
                            )
                            )}
                    </div>
                </div>
            </div>
            {/* <AdminPaginate totalItems={rows.length} pageSize={pageSize} setPageSize={setPageSize} pageNum={pageNum} setPageNum={setPageNum} /> */}
            <Modal
                title="修改客户类型"
                open={isModalOpen}
                onOk={handleModalOk}
                onCancel={handleModalCancel}
            >
                <p>客户名称: {currentRowData?.customerName}</p>
                <p>物料编码: {currentRowData?.itemCode}</p>
                <Select
                    value={selectedCustomerType}
                    style={{ width: '100%' }}
                    onChange={handleCustomerTypeChange}
                    options={customerTypes.map(type => ({ value: type.customerType, label: type.customerType }))}
                />
            </Modal>
        </div >
    )
}

export default AdminTable;