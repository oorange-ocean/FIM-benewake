import React, { useState, useEffect } from 'react';
import { Modal, Input, Button } from 'antd';
import DatePicker from '../components/DatePicker';
import EditTable from '../components/EditTable';
import { startInquiry, updateInquiry, saveDivideList } from '../api/inquiry';
import { rowToInquiry } from '../js/parseData';
import moment from 'moment';
import { useAlertContext, useSelectedDataContext } from '../hooks/useCustomContext';

const SimpleToolbar = ({ rows, ids, setIds, setRows, originalRows }) => {
    const { alertSuccess, alertError, alertWarning } = useAlertContext();
    const [action, setAction] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [splitCount, setSplitCount] = useState(1);
    const [newRows, setNewRows] = useState([]);

    const handleSaveClick = async () => {
        setAction({ type: "保存", time: new Date() });

        if (rows.length === 1) {
            // 处理只有一条数据的情况
            const newInquiry = await rowToInquiry(rows[0]);
            const res = await updateInquiry(newInquiry);
            switch (res.code) {
                case 200:
                    alertSuccess(res.message);
                    setIds([res.data]);
                    break;
                case 400:
                case 1:
                    alertError(res.message);
                    break;
                default:
                    alertError("未知错误");
                    break;
            }
        } else {
            // 处理多条数据的情况
            const newInquiries = await Promise.all(rows.map(row => rowToInquiry(row, 1)));
            const res = await saveDivideList({ inquiries: newInquiries, inquiryCode: rows[0].inquiryCode });
            if (res) {
                alertSuccess("保存成功");
            } else {
                alertError("保存失败");
            }
            switch (res.code) {
                case 200:
                    alertSuccess(res.message);
                    setIds([res.data]);
                    break;
                case 400:
                case 1:
                    alertError(res.message);
                    break;
                default:
                    alertError("未知错误");
                    break;
            }
        }
    };

    const handleStartClick = async () => {
        setAction({ type: "开始询单", time: new Date() });

        let newInquiries;
        if (ids) { newInquiries = ids.map((id) => ({ "inquiryId": id })); }

        const res = await startInquiry(newInquiries, 1);
        switch (res.code) {
            case 200:
                alertWarning(res.message);
                break;
            case 400:
            case 1:
                alertError(res.message);
                break;
            default:
                alertError("未知错误");
                break;
        }
    };

    const handleSplitOrder = () => {
        setIsModalVisible(true);
    };

    const handleOk = () => {
        setIsModalVisible(false);
        if (splitCount <= 1) {
            alertWarning("拆分数量必须大于1，请重新输入");
            return;
        }
        console.log("ok");
        let splitRows = [];
        console.log("original rows", originalRows)
        originalRows.forEach(row => {
            for (let i = 0; i < splitCount; i++) {
                const newRow = { ...row, saleNum: null };
                splitRows.push(newRow);
            }
        });

        setNewRows(splitRows);
        console.log(splitRows);
        setRows(splitRows);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    return (
        <div className='row toolbar'>
            <div className='row flex-center'>
                <button onClick={handleSaveClick}>保存</button>
                <button onClick={handleStartClick}>开始询单</button>
                <button onClick={handleSplitOrder}>拆分询单</button>
            </div>
            <div className="row flex-center status">
                {action &&
                    <span>
                        <strong>{action.type}</strong>
                        &nbsp;于&nbsp;
                        <strong>{`${moment(action.time).format('lll')}`}</strong>
                    </span>
                }
            </div>
            <Modal title="拆分询单" open={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                <p>请输入拆分数量：</p>
                <Input
                    type="number"
                    value={splitCount}
                    onChange={(e) => setSplitCount(e.target.value)}
                    min={1}
                />
            </Modal>
        </div>
    );
}

const Edit = () => {
    const { selectedData, setSelectedData } = useSelectedDataContext();

    const [ids, setIds] = useState([selectedData.inquiryId]);
    const [rows, setRows] = useState([selectedData]);
    const [originalRows, setOriginalRows] = useState([selectedData]); // 保留原始数据
    useEffect(() => {
        if (rows) {
            setSelectedData(rows[0]);
        }
    }, [rows]);

    const [currentDate, setCurrentDate] = useState(new Date());

    return (
        <div className='col full-screen invoice-container'>
            <SimpleToolbar rows={rows} ids={ids} setIds={setIds} setRows={setRows} originalRows={originalRows} />
            <div className='col inquiry-info'>
                <div className='row input-wrapper'>
                    <h1>单据编号：</h1>
                    <input type="text" readOnly name="inquiryCode" value={selectedData?.inquiryCode ?? ""} className='inquiry-code' />
                </div>
                <div className="react-datepicker-container input-wrapper">
                    单据日期：
                    <DatePicker
                        selected={currentDate}
                        onChange={(date) => setCurrentDate(date)}
                    />
                </div>
            </div>
            {rows && <EditTable rows={rows} setRows={setRows} />}
        </div>
    );
}

export default Edit;
