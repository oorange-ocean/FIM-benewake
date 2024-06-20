import React from 'react'
import { ReactComponent as CloseIcon } from '../assets/icons/cross.svg'
import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons' // 引入ant design图标
import { useAlertContext, useAuthContext } from '../hooks/useCustomContext'
import { deleteMessages, findMessages, hideMessage } from '../api/message'
import moment from 'moment'

const Message = ({ message, setMessages, deletable }) => {
    const { alertSuccess, alertError, alertConfirm } = useAlertContext()
    const { auth } = useAuthContext()
    const handleDelete = async (id) => {
        alertConfirm("确认删除消息？",
            async () => {
                const res = await deleteMessages([id])
                switch (res.code) {
                    case 200:
                        alertSuccess("删除成功！")
                        const res = await findMessages()
                        setMessages(res.data)
                        break
                    case 400:
                    case 1:
                        alertError(res.message)
                        break
                    default:
                        alertError("未知错误")
                        break
                }
            })
    }

    const handleHide = async (id) => {
        alertConfirm("确认隐藏消息？",
            async () => {
                const res = await hideMessage(id)
                switch (res.code) {
                    case 200:
                        alertSuccess("隐藏成功！")
                        const res = await findMessages()
                        setMessages(res.data)
                        break
                    case 400:
                    case 1:
                        alertError(res.message)
                        break
                    default:
                        alertError("未知错误")
                        break
                }
            })
    }

    // 过滤掉普通用户不能看到的隐藏消息
    if (!auth || (auth.userType != 1 && message.is_hiden) || !deletable && message.is_hiden) {
        return null
    }

    return (
        <div key={message.id} className={`row message-wrapper flex-start ${message?.type == "1" ? 'abnormal' : 'normal'} g1 flex-between`}>
            <div className='col'>
                <h6>{moment(message.update_time).format('YYYY/MM/DD')}</h6>
                <p>{message.message}</p>
            </div>
            <div className='row flex-end g1'>
                <h1>{message?.type == "1" ? '异常' : '普通'}</h1>
                {deletable && auth.userType == 1 && (
                    message.is_hiden ? (
                        <EyeInvisibleOutlined style={{ fontSize: '20px', color: 'gray' }} />
                    ) : (
                        <button className='transparent' onClick={() => handleHide(message.id)}>
                            <EyeOutlined style={{ fontSize: '20px', color: 'blue' }} />
                        </button>
                    )
                )}
                {deletable &&
                    <button className='transparent' onClick={() => handleDelete(message.id)}><CloseIcon style={{ fontSize: '24px', color: 'red' }} /></button>
                }
            </div>
        </div>
    )
}

export default Message
