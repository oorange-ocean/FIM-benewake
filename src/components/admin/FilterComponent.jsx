import React, { useState } from 'react';
import { Select, Input, Button } from 'antd';
import { SearchOutlined, PlusOutlined, CloseOutlined, DownOutlined, UpOutlined } from '@ant-design/icons';
import '../../styles/FilterComponentStyles.css';  // Import the new CSS file
import { useAlertContext } from '../../hooks/useCustomContext';

const { Option } = Select;

const FilterComponent = ({ filters, setFilters, schema, onSearch }) => {
    const [filtersExpanded, setFiltersExpanded] = useState(false);
    const { alertWarning } = useAlertContext();

    const handleAddFilter = () => {
        if (filters.length < schema.length) {
            const availableKeys = schema.map(item => item.eng).filter(key => !filters.some(filter => filter.key === key));
            setFilters([...filters, { key: availableKeys[0], condition: 'like', value: '' }]);
        }
    };

    const handleFilterChange = (index, field, value) => {
        const newFilters = [...filters];
        newFilters[index][field] = value;

        if (field === 'condition' && (value === 'is' || value === 'is not')) {
            newFilters[index].value = 'null';  // 禁止输入数据，并将value设为null
        }
        setFilters(newFilters);
    };

    const handleDeleteFilter = (index) => {
        const newFilters = [...filters];
        newFilters.splice(index, 1);
        setFilters(newFilters);
    };

    const handleSearch = () => {
        // if (filters.filter(filter => filter.value !== '' && !/^\s*$/.test(filter.value)).length === 0) {
        //   alertWarning("筛选值为空！");
        //   return;
        // }

        onSearch(filters);
    };

    const handleResetFilters = () => {
        setFilters([]);
    };

    return (
        <div className="filter-container">
            <div className="filter-row">
                <div className="filter-buttons-left">
                    <Button onClick={handleResetFilters} className="filter-button" type="default">重置</Button>
                </div>
                <div className="filter-buttons-right">
                    <Button type="primary" onClick={handleSearch} className="filter-button filter-button-search" icon={<SearchOutlined />}>搜索</Button>
                    <Button onClick={handleAddFilter} className="filter-button filter-button-add" icon={<PlusOutlined />} disabled={filters.length >= schema.length}>新增筛选</Button>
                </div>
            </div>
            {filtersExpanded && (
                <div className="filter-wrapper">
                    {filters.map((filter, index) => (
                        <div key={index} className="filter-item">
                            <Select
                                className="filter-select"
                                value={filter.key}
                                onChange={(value) => handleFilterChange(index, 'key', value)}
                                popupMatchSelectWidth={false}
                            >
                                {schema.map((item) => (
                                    <Option key={item.eng} value={item.eng} disabled={filters.some(f => f.key === item.eng && f.key !== filter.key)}>
                                        {item.cn}
                                    </Option>
                                ))}
                            </Select>
                            <Select
                                className="filter-select"
                                value={filter.condition}
                                onChange={(value) => handleFilterChange(index, 'condition', value)}
                                popupMatchSelectWidth={false}
                            >
                                <Option value="like">包含</Option>
                                <Option value="=">等于</Option>
                                <Option value="<>">不等于</Option>
                                <Option value=">">大于</Option>
                                <Option value="<">小于</Option>
                                <Option value=">=">大于等于</Option>
                                <Option value="<=">小于等于</Option>
                                <Option value="is">空</Option>
                                <Option value="is not">非空</Option>
                                <Option value="in">包含于</Option>
                                <Option value="not in">不包含于</Option>
                                <Option value="!=">不等于</Option>
                            </Select>
                            {filter.condition === 'is' || filter.condition === 'is not' ? null : (
                                <Input
                                    className="filter-input"
                                    value={filter.value}
                                    onChange={(e) => handleFilterChange(index, 'value', e.target.value)}
                                />
                            )}
                            <Button
                                type='text'
                                className="filter-delete-button"
                                icon={<CloseOutlined />}
                                onClick={() => handleDeleteFilter(index)}
                            />
                        </div>
                    ))}
                </div>
            )}
            <Button
                type="link"
                className="toggle-filter-button"
                onClick={() => setFiltersExpanded(!filtersExpanded)}
                icon={filtersExpanded ? <UpOutlined /> : <DownOutlined />}
            >
                {filtersExpanded ? '收起筛选' : '展开筛选'}
            </Button>
        </div>
    );
};

export default FilterComponent;
