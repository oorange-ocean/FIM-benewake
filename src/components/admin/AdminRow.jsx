import { useState, useEffect } from 'react';
import Checkbox from '../Checkbox';
import moment from 'moment';
import { Select, MenuItem, Modal, Box, Typography, Button } from '@mui/material';

const Row = ({ type, schema, data, colWidths, addRow, removeRow, isSelected, onTypeChange, customerTypes }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleDoubleClick = () => {
        setIsModalOpen(true);
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

    return (
        <div className="tr">
            <div className='td fixed checkbox'>
                <Checkbox addRow={addRow} removeRow={removeRow} isSelected={isSelected} />
            </div>
            {schema.map((cell, i) => (
                <div
                    style={{ width: colWidths[i] }}
                    className='td'
                    key={i}
                    // 如果cell.eng === "customerType"并且type!=='customerType',那么双击之后执行handleDoubleClick函数，弹窗修改客户类型
                    // 如果cell.eng !== "customerType"，那么双击之后执行null
                    onDoubleClick={cell.eng === "customerType" && type !== "customerType" ? handleDoubleClick : null}
                >
                    {cell.eng === "startMonth" ? (
                        <span>{moment(data.startMonth).format('YYYY/MM/DD')}</span>
                    ) :
                        <span>{data[cell.eng]}</span>
                    }
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
