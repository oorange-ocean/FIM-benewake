import React, { useState, useEffect } from 'react'
import '../style/customSelect.css'
import {
    Box,
    TextField,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Checkbox,
    FormControlLabel
} from '@mui/material'

const CustomSelect = ({
    options,
    selectedOptions,
    onOptionChange,
    onSearch
}) => {
    const [searchTerm, setSearchTerm] = useState('')
    const [selectAllChecked, setSelectAllChecked] = useState(false)
    const [isIndeterminate, setIsIndeterminate] = useState(false)

    useEffect(() => {
        // 组件加载时发送初始请求
        onSearch('')
    }, [])

    useEffect(() => {
        const allSelected = selectedOptions.length === options.length
        const someSelected = selectedOptions.length > 0 && !allSelected

        setSelectAllChecked(allSelected)
        setIsIndeterminate(someSelected)
    }, [selectedOptions, options])

    const handleSearch = (event) => {
        const value = event.target.value
        setSearchTerm(value)
        onSearch(value)
    }

    const handleFocus = () => {
        if (options.length === 0) {
            onSearch('')
        }
    }

    const handleToggle = (value) => () => {
        const currentIndex = selectedOptions.indexOf(value)
        const newChecked = [...selectedOptions]

        if (currentIndex === -1) {
            newChecked.push(value)
        } else {
            newChecked.splice(currentIndex, 1)
        }

        onOptionChange(newChecked)
    }

    const handleSelectAll = () => {
        if (selectAllChecked || isIndeterminate) {
            onOptionChange([])
        } else {
            onOptionChange(options.map((option) => option.value))
        }
    }

    return (
        <Box className="custom-select">
            <TextField
                fullWidth
                variant="outlined"
                placeholder="搜索..."
                value={searchTerm}
                onChange={handleSearch}
                onFocus={handleFocus}
                style={{ marginBottom: 10 }}
            />
            <FormControlLabel
                control={
                    <Checkbox
                        checked={selectAllChecked}
                        indeterminate={isIndeterminate}
                        onChange={handleSelectAll}
                    />
                }
                label="全选"
                style={{ marginBottom: 10 }}
            />
            <List style={{ maxHeight: 300, overflow: 'auto' }}>
                {options.map((option) => (
                    <ListItem
                        key={option.value}
                        dense
                        button
                        onClick={handleToggle(option.value)}
                    >
                        <ListItemIcon>
                            <Checkbox
                                edge="start"
                                checked={
                                    selectedOptions.indexOf(option.value) !== -1
                                }
                                tabIndex={-1}
                                disableRipple
                            />
                        </ListItemIcon>
                        <ListItemText
                            primary={`${option.label} (${option.value})`}
                            // secondary={option.value}
                            className="custom-select-item-text"
                        />
                    </ListItem>
                ))}
            </List>
        </Box>
    )
}

export default CustomSelect
