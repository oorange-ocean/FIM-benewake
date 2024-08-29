import { useState, useEffect } from 'react'
import Checkbox from '../Checkbox'
import moment from 'moment'
import { Select, MenuItem, Modal, Box, Typography, Button } from '@mui/material'
import { updateSalesmanChange } from '../../api/admin'
import { useAlertContext } from '../../hooks/useCustomContext'
import adminSchema from '../../constants/schemas/adminSchema'
import api from '../../api/axios'
const Row = ({
    type,
    schema,
    data,
    colWidths,
    addRow,
    removeRow,
    isSelected,
    onTypeChange,
    customerTypes,
    handleRefresh,
    editable,
    setEditable
}) => {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editedSalesmanNameNew, setEditedSalesmanNameNew] = useState(
        data.salesmanNameNew
    )
    const { alertSuccess, alertWarning } = useAlertContext()

    const handleDoubleClick = (cell) => {
        // onDoubleClick={cell.eng === "customerType" && type !== "customerType" ? handleDoubleClick : null}

        setEditable(true)
    }

    const getCellContent = (cell) => {
        const unEditable = ['salesmanNameOld']

        if (cell.eng === 'startMonth' && !editable) {
            return <span>{moment(data.startMonth).format('YYYY/MM/DD')}</span>
        } else if (
            adminSchema[type]?.update &&
            typeof adminSchema[type].update === 'function' &&
            editable &&
            !unEditable.includes(cell.eng)
        ) {
            return (
                <input
                    style={{
                        width: '100%',
                        height: '100%',
                        border: '1px solid #ccc',
                        padding: '2px'
                    }}
                    type="text"
                    defaultValue={data[cell.eng]}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            handleInputChange(e, cell.eng)
                        }
                    }}
                    autoFocus
                />
            )
        } else {
            return <span>{data[cell.eng]}</span>
        }
    }

    const handleInputChange = (e, fieldName) => {
        const newValue = e.target.value
        if (newValue !== data[fieldName]) {
            const newData = { ...data, [fieldName]: newValue }
            const updateConfig = adminSchema[type].update(data, newData)

            let requestBody = updateConfig.body
            let headers = {}

            if (updateConfig.type === 'json') {
                headers['Content-Type'] = 'application/json'
                requestBody = JSON.stringify(requestBody)
            } else if (updateConfig.type === 'form-data') {
                const formData = new FormData()
                for (let key in requestBody) {
                    formData.append(key, requestBody[key])
                }
                requestBody = formData
            }

            api.post(updateConfig.url, requestBody, { headers })
                .then((res) => {
                    console.log(res)
                    if (res.data.code === 200) {
                        alertSuccess(res.data.message || '修改成功')
                        handleRefresh()
                    } else {
                        alertWarning(res.data.message || '修改失败')
                    }
                })
                .catch((error) => {
                    console.error('更新失败:', error)
                    alertWarning(error.response?.data?.message || '修改失败')
                })
        }
    }
    const handleChange = (event) => {
        const value = event.target.value
        setEditedType(value)
        onTypeChange(data.customerName, data.itemCode, value)
        setIsModalOpen(false)
    }

    const handleCloseModal = () => {
        setIsModalOpen(false)
    }

    // 点击页面其他地方关闭模态框
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest('.MuiModal-root')) {
                handleCloseModal()
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])
    //检测到editedSalesmanNameNew变化并且editable为false时，发送请求
    useEffect(() => {
        if (
            editedSalesmanNameNew &&
            !editable &&
            editedSalesmanNameNew !== data.salesmanNameNew
        ) {
            updateSalesmanChange(
                data.salesmanNameOld,
                editedSalesmanNameNew
            ).then((res) => {
                if (res.message === '修改成功！') {
                    alertSuccess('修改成功')
                    //刷新
                    handleRefresh()
                } else {
                    alertWarning('修改失败')
                }
            })
        }
    }, [editedSalesmanNameNew, editable])

    return (
        <div className="tr">
            <div className="td fixed checkbox">
                <Checkbox
                    addRow={addRow}
                    removeRow={removeRow}
                    isSelected={isSelected}
                />
            </div>
            {schema.map((cell, i) => (
                <div
                    style={{
                        width: colWidths[i],
                        cursor:
                            cell.eng === 'salesmanNameNew'
                                ? 'pointer'
                                : 'default'
                    }}
                    title={cell.eng === 'salesmanNameNew' ? '双击修改' : ''}
                    className="td"
                    key={i}
                    onDoubleClick={(e) => {
                        e.preventDefault() // 防止默认的双击选中文本
                        handleDoubleClick(cell)
                    }}
                >
                    {/* {cell.eng === "startMonth" ? (
                            <span>{moment(data.startMonth).format('YYYY/MM/DD')}</span>
                        ) :
                            <span>{data[cell.eng]}</span>
                        } */}
                    {getCellContent(cell)}
                </div>
            ))}
            <Modal open={isModalOpen} onClose={handleCloseModal}>
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 300,
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        p: 4
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
                            <MenuItem
                                key={type.customerType}
                                value={type.customerType}
                            >
                                {type.customerType}
                            </MenuItem>
                        ))}
                    </Select>
                    <Button onClick={handleCloseModal} sx={{ mt: 2 }}>
                        取消
                    </Button>
                </Box>
            </Modal>
        </div>
    )
}

export default Row
