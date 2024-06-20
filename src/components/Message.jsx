import React, { useState } from 'react'
import { ReactComponent as CloseIcon } from '../assets/icons/cross.svg'
import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons' // 引入ant design图标
import { useAlertContext, useAuthContext } from '../hooks/useCustomContext'
import { deleteMessages, findMessages, hideMessage } from '../api/message'
import moment from 'moment'

const Message = ({ message, setMessages, deletable }) => {
    const { alertSuccess, alertError, alertConfirm } = useAlertContext()
    const { auth } = useAuthContext()
    const [isHidden, setIsHidden] = useState(message.is_hiden)

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

    const handleHide = async (id, isHidden) => {
        alertConfirm(`确认${isHidden ? '取消隐藏' : '隐藏'}消息？`,
            async () => {
                const res = await hideMessage(id, !isHidden) // 假设hideMessage接受第二个参数来设置隐藏状态
                switch (res.code) {
                    case 200:
                        alertSuccess(`${isHidden ? '取消隐藏' : '隐藏'}成功！`)
                        const res = await findMessages()
                        setMessages(res.data)
                        setIsHidden(!isHidden)
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
                    <button className='transparent' onClick={() => handleHide(message.id, isHidden)} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        {isHidden ? (
                            <>
                                <EyeInvisibleOutlined style={{ fontSize: '24px', color: 'gray' }} />
                                <span style={{ fontSize: '14px', color: 'blue' }}>已隐藏</span>
                            </>
                        ) : (
                            <>
                                <EyeOutlined style={{ fontSize: '24px', color: 'blue' }} />
                                <span style={{ fontSize: '14px', color: 'blue' }}>隐藏</span>
                            </>
                        )}
                    </button>
                )}
                {deletable &&
                    <button className='transparent' onClick={() => handleDelete(message.id)} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <CloseIcon style={{ fontSize: '28px', color: 'red' }} />
                        <span style={{ fontSize: '14px', color: 'red' }}>删除</span>
                    </button>
                }
            </div>
        </div>
    )
}

export default Message
