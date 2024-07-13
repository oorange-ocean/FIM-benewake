import React, { useState, useEffect, useMemo } from 'react';
import { ReactComponent as AddIcon } from '../assets/icons/add.svg';
import { ReactComponent as CloseIcon } from '../assets/icons/cross.svg';
import { ReactComponent as ArrowIcon } from '../assets/icons/arrow-down.svg';
import { ReactComponent as SearchIcon } from '../assets/icons/search.svg';
import SimpleDataList from './SimpleDataList';
import DatePicker from './DatePicker';
import DataList from './DataList'
import { schema, Input } from './EditTable'
import { useAlertContext } from '../hooks/useCustomContext';
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

const getInputElement = (schemaItem, value, handleChange, handleSearch) => {
    if (!schemaItem) {
        return null; // 或者返回一个默认的输入元素
    }
    const { eng, url, searchKey } = schemaItem;
    const onChange = (keys, values) => {
        // onChange(["itemCode", "itemName", "itemType", "itemId"], [option.itemCode, option.itemName, option.itemType, option.id])
        keys.map((key, index) => {
            if (key === eng) {
                handleChange("value", values[index]);
            }
        });
    }
    const matchingElement = Object.keys(schema).find((key) => schema[key].identifier === eng);
    //并且 ["element"]对应的函数所返回的标签 必须是DataList
    let mockData = '';
    const jsxElement = schema[matchingElement]?.element(mockData, onChange, handleSearch)
    return jsxElement?.type === DataList ? (
        schema[matchingElement].element(value, onChange, handleSearch)
    ) : (
        <div className='data-list'>
            <input
                type="text"
                value={value}
                onChange={(e) => handleChange("value", e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        handleSearch();
                    }
                }}
            />
        </div>
    );
};




const Filter = ({ index, filter, setFilters, schema, handleSearch, filters }) => {
    const handleChange = (key, value) => {
        //将该filter的key（condition或者value）的值修改为value, setFilters接受新的filters
        setFilters(filters.map((f, i) => f === filter ? { ...f, [key]: value } : f));
    };

    const removeFilter = () => {
        setFilters(filters.filter((_, i) => i !== index));
    };

    const schemaItem = schema.find(item => item.eng === filter.key) || {};

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
            {getInputElement(schemaItem, filter.value, handleChange, handleSearch)}
            <button className="close-btn" onClick={removeFilter}>
                <CloseIcon className="icon__small close-icon" />
            </button>
        </div>
    );
};

const Filters = ({ schema, filters, setFilters, onSearch }) => {
    const { alertSuccess, alertError, alertConfirm, alertWarning } = useAlertContext()

    const [isVisible, setIsVisible] = useState(true);
    const toggleVisible = () => setIsVisible(!isVisible);

    const addFilter = () => {
        // const newFilter = {
        //     key: schema[0].eng,
        //     condition: 'like',
        //     value: ''
        // };
        const newFilter = {
            //禁止重复使用，如果不存在新的筛选条件，报错
            key: schema.find(item => !filters.map(f => f.key).includes(item.eng))?.eng,
            condition: 'like',
            value: ''
        };
        if (!newFilter.key) {
            alertWarning("筛选条件已用完")
            return;
        }
        setFilters([...filters, newFilter]);
    };

    const handleSearch = () => {
        onSearch(filters);
    };
    //如果filters数量为零并且筛选条件还没用完，则添加一个
    useEffect(() => {
        if (filters.length === 0 && schema.length > 0) {
            addFilter();
        }
    }, []);

    return (
        <div className='col filter-container'>
            {isVisible && (
                <div className='row'>
                    <div className="filter-wrapper" tabIndex="0">
                        {Array.isArray(filters) && filters.map((filter, i) => (<Filter
                            key={i}
                            index={i}
                            filter={filter}
                            setFilters={setFilters}
                            schema={schema}
                            handleSearch={handleSearch}
                            filters={filters}
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