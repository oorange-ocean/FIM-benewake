import { memo, useState, useEffect, useRef } from 'react';
import { fetchOptions, fetchUser } from '../api/fetch';

const inquiryTypeOptions = [{ inquiryType: "PO(客户付款)" }, { inquiryType: "PR(客户提出付款意向)" }, { inquiryType: "YG(供应链预估)" }, { inquiryType: "YC(销售预测)" }, { inquiryType: "XD(意向询单)" }]

const getOptionName = (type, option, searchKey) => {
    switch (type) {
        case "customer":
            return option.customerName
        default:
            return option[searchKey]
    }
}

const DataList = memo(function DataList({ type, searchKey, initialValue, handleChange, identifier, handleSearch }) {
    const [options, setOptions] = useState(null)
    const [showDropdown, setShowDropdown] = useState(false);
    const [value, setValue] = useState("")
    const containerRef = useRef(null);

    const handleDocumentClick = (e) => {
        if (containerRef.current && !containerRef.current.contains(e.target)) {
            setShowDropdown(false);
            // clearData();
            document.removeEventListener('mousedown', handleDocumentClick);
        }
    };

    useEffect(() => {
        if (showDropdown) {
            document.addEventListener('mousedown', handleDocumentClick);
        }
        return () => {
            document.removeEventListener('mousedown', handleDocumentClick);
        };
    }, [showDropdown]);

    useEffect(() => { 
        console.log("initialValue", initialValue)
        //如果initialValue是String类型，说明是从编辑页面传过来的，直接赋值
        if (typeof initialValue === "string") {
            setValue(initialValue)
        }
    }, [initialValue])

    const onChange = async (e) => {
        console.log("e.target.value", e.target.value)
        setValue(e.target.value)
        await handleChange([identifier], [e.target.value])
        if (identifier === "inquiryType") {
            setOptions(inquiryTypeOptions)
        }
        else {
            const res = await fetchOptions(type, searchKey, e.target.value)
            setOptions(res)
        }
        setShowDropdown(true);
    }

    const handleSelect = (option) => {
        if (identifier === "itemCode") {
            setValue(option.itemCode)
            handleChange(["itemCode", "itemName", "itemType", "itemId"], [option.itemCode, option.itemName, option.itemType, option.id])
        }
        else if (identifier === "materialCode") {
            setValue(option.itemCode)
            handleChange(["materialCode"], [option.itemCode])
        }

        else if (identifier === "customerName") {
            setValue(option.customerName)
            handleChange(["customerName", "customerId"], [option.customerName, option.customerId])
        }

        else if (identifier === "salesmanName") {
            setValue(option.username)
            handleChange(["salesmanName", "salesmanId"], [option.username, option.id])
        }
        else {
            setValue(option[searchKey])
            handleChange([identifier], [option[searchKey]]);
        }
        // setShowDropdown(false)
        // 将焦点移动到输入框
        containerRef.current.children[0].focus();

    };

    const clearData = () => {
        if (value?.length > 0) {
            if (identifier === "itemCode") {
                handleChange(["itemCode", "itemName", "itemType", "itemId", "customerType"], ["", "", "", "", ""])
            }

            else if (identifier === "customerName") {
                handleChange(["customerName", "customerId", "customerType"], ["", "", ""])
            }
            else {
                handleChange([identifier], [""]);
            }
            setValue("")
        }
        setShowDropdown(false)
    }

    return (
        <div className="data-list" ref={containerRef} >
            <input
                type="text"
                value={value}
                onChange={onChange}
                onFocus={() => setShowDropdown(true)}
                //回车搜索
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        handleSearch()
                        setShowDropdown(false)
                    }
                }}
            />
            {
                showDropdown && options &&
                <ul
                    className="data-list-dropdown"
                >
                    {
                        (identifier === "itemCode" || identifier === "materialCode") &&
                        < li className='row sticky g1' >
                            <div style={{ width: 66 }}>物料编码</div><div>物料名称</div>
                        </li>
                    }
                    {
                        options.length > 0
                            ? options.map((option, i) =>
                                (identifier !== "itemCode" && identifier !== "materialCode")
                                    ? <li key={i}
                                        onClick={() => handleSelect(option)}>
                                        {getOptionName(type, option, searchKey)}
                                    </li>
                                    : <li className='row g1' key={i}
                                        onClick={() => handleSelect(option)}>
                                        <div>{option.itemCode}</div>
                                        <div>{option.itemName}</div>
                                    </li>
                            )
                            : <li onClick={clearData} >无匹配结果</li>
                    }
                </ul>
            }
        </div >
    );
})

export default DataList;
