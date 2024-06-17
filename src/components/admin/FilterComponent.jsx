import React from 'react';
import { Select, Input, Button } from 'antd';
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';
import '../../styles/FilterComponentStyles.css';  // Import the new CSS file

const { Option } = Select;

// Utility function to convert camelCase to snake_case
const camelToSnake = (str) => {
  return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
};

const FilterComponent = ({ filters, setFilters, schema, onFilter }) => {

  const handleAddFilter = () => {
    if (filters.length < schema.length) {
      const availableKeys = schema.map(item => item.eng).filter(key => !filters.some(filter => filter.key === key));
      setFilters([...filters, { key: availableKeys[0], condition: 'like', value: '' }]);
    }
  };

  const handleFilterChange = (index, field, value) => {
    const newFilters = [...filters];
    newFilters[index][field] = value;
    setFilters(newFilters);
  };

  const handleSearch = () => {
    const filterCriteriaList = filters.map((filter) => ({
      colName: camelToSnake(filter.key),
      condition: filter.condition,
      value: filter.value,
    }));
    onFilter({ filterCriteriaList });
  };

  const availableKeys = schema.map(item => item.eng).filter(key => !filters.some(filter => filter.key === key));

  return (
    <div className="filter-container">
      <div className="filter-row">
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
                <Option value="is">是</Option>
                <Option value="is not">不是</Option>
                <Option value="in">包含于</Option>
                <Option value="not in">不包含于</Option>
                <Option value="!=">不等于</Option>
              </Select>
              <Input
                className="filter-input"
                value={filter.value}
                onChange={(e) => handleFilterChange(index, 'value', e.target.value)}
              />
            </div>
          ))}
        </div>
        <div className="filter-buttons">
          <Button type="primary" onClick={handleSearch} className="filter-button filter-button-search" icon={<SearchOutlined />} />
          <Button onClick={handleAddFilter} className="filter-button filter-button-add" icon={<PlusOutlined />} disabled={filters.length >= schema.length}>添加筛选</Button>
        </div>
      </div>
    </div>
  );
};

export default FilterComponent;
