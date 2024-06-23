import React, { useState, useEffect, useMemo } from 'react';
import { ReactComponent as AddIcon } from '../assets/icons/add.svg';
import { ReactComponent as CloseIcon } from '../assets/icons/cross.svg';
import { ReactComponent as ArrowIcon } from '../assets/icons/arrow-down.svg';
import { ReactComponent as SearchIcon } from '../assets/icons/search.svg';
import SimpleDataList from './SimpleDataList';
import DatePicker from './DatePicker';

const conditions = [
  { id: 'like', name: '包含' },
  { id: '=', name: '等于' },
  { id: '<>', name: '不等于' },
  { id: '>', name: '大于' },
  { id: '<', name: '小于' },
  { id: '>=', name: '大于等于' },
  { id: '<=', name: '小于等于' },
  { id: 'is', name: '空' },
  { id: 'is not', name: '非空' },
  { id: 'in', name: '包含于' },
  { id: 'not in', name: '不包含于' },
  { id: '!=', name: '不等于' }
];

const getInputElement = (schemaItem, value, handleChange) => {
  const { eng, url, searchKey } = schemaItem;

  return (
    <div className="data-list"
    >
      <input
        type="text"
        value={value}
        onChange={(e) => handleChange("value", e.target.value)}
      />
    </div>
  )

};

const Filter = ({ index, filter, setFilters, schema }) => {
  const handleChange = (key, value) => {
    setFilters(prev => prev.map((f, i) => i === index ? { ...f, [key]: value } : f));
  };

  const removeFilter = () => {
    setFilters(prev => prev.filter((_, i) => i !== index));
  };

  const schemaItem = schema.find(item => item.eng === filter.key);

  return (
    <div className='row filter'>
      <div className='filter-select-wrapper'>
        <select value={filter.key} onChange={(e) => handleChange("key", e.target.value)}>
          {schema.map((item, i) => (
            <option value={item.eng} key={i}>{item.cn}</option>
          ))}
        </select>
        <ArrowIcon />
      </div>
      <div className='filter-select-wrapper'>
        <select value={filter.condition} onChange={(e) => handleChange("condition", e.target.value)}>
          {conditions.map((condition, i) => (
            <option value={condition.id} key={i}>{condition.name}</option>
          ))}
        </select>
        <ArrowIcon />
      </div>
      {getInputElement(schemaItem, filter.value, handleChange)}
      <button className="close-btn" onClick={removeFilter}>
        <CloseIcon className="icon__small close-icon" />
      </button>
    </div>
  );
};

const Filters = ({ schema, filters, setFilters, onSearch }) => {
  const [isVisible, setIsVisible] = useState(true);
  const toggleVisible = () => setIsVisible(!isVisible);

  const addFilter = () => {
    const newFilter = {
      key: schema[0].eng,
      condition: 'like',
      value: ''
    };
    setFilters([...filters, newFilter]);
  };

  const handleSearch = () => {
    onSearch(filters);
  };

  return (
    <div className='col filter-container'>
      {isVisible && (
        <div className='row'>
          <div className="filter-wrapper" tabIndex="0">
            {filters.map((filter, i) => (
              <Filter
                key={i}
                index={i}
                filter={filter}
                setFilters={setFilters}
                schema={schema}
              />
            ))}
          </div>
          <div className="col flex-center controls">
            <button className="rounded blue40" onClick={handleSearch}>
              <SearchIcon />搜索
            </button>
            <button onClick={addFilter} className="icon-btn">
              <AddIcon className="icon__small add-icon" /> 新增筛选
            </button>
          </div>
        </div>
      )}
      <button onClick={toggleVisible} className="row flex-center toggle-btn blue5">
        <ArrowIcon className={isVisible ? "rotate180" : "rotate0"} /> {isVisible ? "收起筛选" : "展示筛选"}
      </button>
    </div>
  );
};

export default Filters;