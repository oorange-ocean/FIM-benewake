
import { useLoaderData } from 'react-router-dom';
import Message from '../components/Message';
import { useState } from 'react';
import Todos from '../components/Todos';
import { Suspense } from 'react';
import { Await } from 'react-router-dom';
import Loader from '../components/Loader';

export default function User() {
    const data = useLoaderData()

    function isValid(data) {
        return data && Array.isArray(data)
    }

    return (
        <div className='user-container full-screen'>
            <div className='user-feature'>
                <h1>异常同步</h1>
                <Suspense fallback={<Loader />}>
                    <Await
                        resolve={data.messages}
                        errorElement={
                            <p>加载失败！</p>
                        }
                        children={(messages) =>
                            <div className='col g1 mt1'>
                                {isValid(messages.data)
                                    && messages.data.map((message, i) =>
                                        <Message message={message} key={i} />
                                    )}
                            </div>
                        }
                    />
                </Suspense >
            </div>
            <div className='user-feature'>
                <h1>待办任务</h1>
                <Suspense fallback={<Loader />}>
                    <Await
                        resolve={data.todos}
                        errorElement={
                            <p>加载失败！</p>
                        }
                        children={(todos) =>
                            <div className='col g1 mt1'>
                                {isValid(todos.data) &&
                                    todos.data.map((todo, i) =>
                                        <Todos data={todo} type="todos" key={i} />
                                    )}
                            </div>
                        }
                    />
                </Suspense >
            </div>
            <div className='user-feature'>
                <h1>常用功能</h1>
            </div>
            <div className='user-feature'>
                <h1>待处理监控消息</h1>
                <Suspense fallback={<Loader />}>
                    <Await
                        resolve={data.PMMessages}
                        errorElement={
                            <p>加载失败！</p>
                        }
                        children={(PMMessages) =>
                            <div className='col g1 mt1'>
                                {PMMessages.data &&
                                    <Todos data={PMMessages.data} type="PMMessages" />
                                }
                            </div>
                        }
                    />
                    <Await
                        resolve={data.PODelay}
                        errorElement={
                            <p>加载失败！</p>
                        }
                        children={(PODelay) =>
                            <div className='col g1 mt1'>
                                {isValid(PODelay.data) &&
                                    PODelay.data.map((data, i) =>
                                        <Todos data={data} type="PODelay" key={i} />
                                    )}
                            </div>}
                    />
                </Suspense >

            </div>
        </div>
    )
}
