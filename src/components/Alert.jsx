import React from 'react'
import { useAlertContext } from '../hooks/useCustomContext';

export default function Alert({ type, message, action, cancel }) {
    const { closeAlert } = useAlertContext()

    const handleCancel = () => {
        cancel && cancel();
        closeAlert();
    }

    const handleConfirm = () => {
        action && action();
        closeAlert()
    }

    function getHeading() {
        switch (type) {
            case "warning":
                return "提示";
            case "error":
                return "错误";
            case "success":
                return "成功";
            case "confirm":
                return "确认";
            default:
                return "提示";

        }
    }

    return (
        <div className='popup-container flex-center'>
            <div className={`${type} col alert-container`}>
                <h1>{getHeading()}</h1>
                <p>{message}</p>
                <div className='row btn-wrapper'>
                    {/* 如果type是choice，则显示多个按钮和 取消按钮，如果是confirm，则显示两个按钮，如果是其他，只显示一个 */}
                    {type === "choice" && (
                        <>
                            {/* {<button onClick={handleCancel} className='white small'>取消</button>} */}
                            {/* 这里的取消button布局放在左边 */}
                            <button style={{ marginRight: '120px' }} onClick={handleCancel} className='white small'>取消</button>
                            {action.map((act, index) => (
                                <button key={index} onClick={() => act.handleClick()} className='blue60 small'>{act.name}</button>
                            ))}
                        </>
                    )}
                    {type === "confirm" && (
                        <>
                            <button onClick={handleCancel} className='white small'>取消</button>
                            <button onClick={handleConfirm} className='blue60 small'>确认</button>
                        </>
                    )}
                    {type !== "choice" && type !== "confirm" && (
                        <button onClick={closeAlert} className='white small'>确认</button>
                    )}
                </div>
            </div>
        </div >
    )
}
