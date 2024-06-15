import React, { useState } from 'react';
import { Select, Input, Button } from 'antd';

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
    <div>
      {filters.map((filter, index) => (
        <div key={index} style={{ marginBottom: 8, display: 'flex', alignItems: 'center' }}>
          <Select
            style={{ width: 150, marginRight: 8 }}
            value={filter.key}
            onChange={(value) => handleFilterChange(index, 'key', value)}
          >
            {schema.map((item) => (
              <Option key={item.eng} value={item.eng} disabled={filters.some(f => f.key === item.eng && f.key !== filter.key)}>
                {item.cn}
              </Option>
            ))}
          </Select>
          <Select
            style={{ width: 100, marginRight: 8 }}
            value={filter.condition}
            onChange={(value) => handleFilterChange(index, 'condition', value)}
          >
            <Option value="like">like</Option>
            <Option value="=">=</Option>
            <Option value="<>">{'<>'}</Option>
            <Option value=">">{'>'}</Option>
            <Option value="<">{'<'}</Option>
            <Option value=">=">{'>='}</Option>
            <Option value="<=">{'<='}</Option>
            <Option value="is">is</Option>
            <Option value="is not">is not</Option>
            <Option value="in">in</Option>
            <Option value="not in">not in</Option>
            <Option value="!=">!=</Option>
          </Select>
          <Input
            style={{ width: 150, marginRight: 8 }}
            value={filter.value}
            onChange={(e) => handleFilterChange(index, 'value', e.target.value)}
          />
        </div>
      ))}
      <Button onClick={handleAddFilter} style={{ marginRight: 8 }} disabled={filters.length >= schema.length}>Add Filter</Button>
      <Button type="primary" onClick={handleSearch}>Search</Button>
    </div>
  );
};

export default FilterComponent;
