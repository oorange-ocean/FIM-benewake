import DatePicker from '../components/DatePicker';
import NewTable from '../components/NewTable';
import { useState } from 'react';

import { NEW_INQUIRY_DATA } from '../constants/Global';
import { startInquiry } from '../api/inquiry';
import { rowToInquiry } from '../js/parseData';
import moment from 'moment';
import { useAlertContext } from '../hooks/useCustomContext';

const SimpleToolbar = ({ rows, inquiryType, setInquiryCode }) => {
    const updateAlert = useAlertContext()
    const [action, setAction] = useState(null)

    const handleClick = async (status) => {
        setAction({ type: status === 1 ? "开始询单" : "保存", time: new Date() })

        const newInquiries = rows.map(row => rowToInquiry(row, inquiryType))
        const res = await startInquiry(newInquiries, status)
        switch (res.code) {
            case 200:
                updateAlert({
                    type: "SHOW_ALERT", data: {
                        type: "success",
                        message: res.message
                    }
                })
                setInquiryCode(res.data.inquiryCode)
                break
            case 400:
                updateAlert({
                    type: "SHOW_ALERT", data: {
                        type: "error",
                        message: res.message
                    }
                })
                break
            case 1:
                updateAlert({
                    type: "SHOW_ALERT", data: {
                        type: "error",
                        message: res.message
                    }
                })
                break
            default:
                updateAlert({
                    type: "SHOW_ALERT", data: {
                        type: "error",
                        message: "未知错误"
                    }
                })
                break
        }

    }

    return (
        <div className='row toolbar' >
            <div className='row flex-center'>
                <button onClick={() => handleClick(0)} >保存</button>
                <button onClick={() => handleClick(1)}>开始询单</button>
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
        </div >
    )

}

const New = () => {
    const [inquiryType, setInquiryType] = useState(null)
    const [inquiryCode, setInquiryCode] = useState();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [rows, setRows] = useState([NEW_INQUIRY_DATA])

    return (
        <div className='col full-screen invoice-container'>
            <SimpleToolbar rows={rows} inquiryType={inquiryType} setInquiryCode={setInquiryCode} />
            <div className='col invoice-info'>
                <div className='row'>
                    <h1>订单类型：</h1>
                    <label htmlFor="yc" className='row flex-center'>
                        <input
                            type="radio" id="yc" value="yc"
                            checked={inquiryType === 4}
                            onChange={() => setInquiryType(4)} />
                        销售预测
                    </label>
                    <label htmlFor="xd" className='row flex-center'>
                        <input
                            type="radio" id="xd" value="xd"
                            checked={inquiryType === 5}
                            onChange={() => setInquiryType(5)} />
                        销售询单
                    </label>
                </div>
                <div className='row'>
                    <h1>单据编号：</h1>
                    <input type="text" disabled name="inquiryCode" value={inquiryCode} onChange={(e) => setInquiryCode(e.target.value)} />
                </div>
                <div className="react-datepicker-container">
                    单据日期：
                    <DatePicker
                        selected={currentDate}
                        onChange={(date) => setCurrentDate(date)
                        }
                    />
                </div>
            </div>
            <NewTable rows={rows} setRows={setRows} />
        </div >

    )
}

export default New