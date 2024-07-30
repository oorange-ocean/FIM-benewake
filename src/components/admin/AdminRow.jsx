import { useState, useEffect } from 'react';
import Checkbox from '../Checkbox';
import moment from 'moment';
import { Select, MenuItem, Modal, Box, Typography, Button } from '@mui/material';
import { updateSalesmanChange } from '../../api/admin';
import { useAlertContext } from '../../hooks/useCustomContext';

const Row = ({ type, schema, data, colWidths, addRow, removeRow, isSelected, onTypeChange, customerTypes, handleRefresh }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    //销售员替换表格的编辑状态
    const [editable, setEditable] = useState(false);
    const [editedSalesmanNameNew, setEditedSalesmanNameNew] = useState(data.salesmanNameNew);
    const { alertSuccess, alertWarning } = useAlertContext();
    const handleDoubleClick = (cell) => {
        // onDoubleClick={cell.eng === "customerType" && type !== "customerType" ? handleDoubleClick : null}
        if (cell.eng === "customerType" && type !== "customerType") {
            setIsModalOpen(true);
        }
        //如果type为销售员替换包，则设置editable为true
        if (type === "salesmanChange") {
            setEditable(true);
        }
    };

    const getCellContent = (cell) => {
        if (cell.eng === "startMonth") {
            return <span>{moment(data.startMonth).format('YYYY/MM/DD')}</span>;
        }
        //如果销售员替换表
        else if (cell.eng === "salesmanNameNew" && editable) {
            return (
                <input
                    type="text"
                    defaultValue={data[cell.eng]}
                    onBlur={(e) => {
                        setEditedSalesmanNameNew(e.target.value);
                        setEditable(false);
                    }}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            setEditedSalesmanNameNew(e.target.value);
                            setEditable(false);
                        }
                    }}
                    autoFocus
                />
            )
        }
        else {
            return <span>{data[cell.eng]}</span>;
        }
    };

    const handleChange = (event) => {
        const value = event.target.value;
        setEditedType(value);
        onTypeChange(data.customerName, data.itemCode, value);
        setIsModalOpen(false);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    // 点击页面其他地方关闭模态框
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest('.MuiModal-root')) {
                handleCloseModal();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);
    //检测到editedSalesmanNameNew变化并且editable为false时，发送请求
    useEffect(() => {
        if (editedSalesmanNameNew && !editable && editedSalesmanNameNew !== data.salesmanNameNew) {
            updateSalesmanChange(data.salesmanNameOld, editedSalesmanNameNew).then(res => {
                if (res.message === "修改成功！") {
                    alertSuccess("修改成功");
                    //刷新
                    handleRefresh();
                } else {
                    alertWarning("修改失败");
                }
            });
        }
    }, [editedSalesmanNameNew, editable]);

    return (
        <div className="tr">
            <div className='td fixed checkbox'>
                <Checkbox addRow={addRow} removeRow={removeRow} isSelected={isSelected} />
            </div>
            {schema.map((cell, i) => (
                <div
                    style={{
                        width: colWidths[i],
                        cursor: cell.eng === "salesmanNameNew" ? 'pointer' : 'default',
                    }}
                    title={cell.eng === "salesmanNameNew" ? "双击修改" : ""}
                    className='td'
                    key={i}
                    onDoubleClick={(e) => {
                        e.preventDefault(); // 防止默认的双击选中文本
                        handleDoubleClick(cell);
                    }}                >
                    {/* {cell.eng === "startMonth" ? (
                            <span>{moment(data.startMonth).format('YYYY/MM/DD')}</span>
                        ) :
                            <span>{data[cell.eng]}</span>
                        } */}
                    {getCellContent(cell)}
                </div>
            ))}
            <Modal
                open={isModalOpen}
                onClose={handleCloseModal}
            >
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 300,
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        p: 4,
                    }}
                >
                    <Typography variant="h6" component="h2">
                        修改客户类型
                    </Typography>
                    <Select
                        value={data.customerType}
                        onChange={handleChange}
                        fullWidth
                    >
                        {customerTypes.map((type) => (
                            <MenuItem key={type.customerType} value={type.customerType}>
                                {type.customerType}
                            </MenuItem>
                        ))}
                    </Select>
                    <Button onClick={handleCloseModal} sx={{ mt: 2 }}>取消</Button>
                </Box>
            </Modal>
        </div>
    );
};

export default Row;
