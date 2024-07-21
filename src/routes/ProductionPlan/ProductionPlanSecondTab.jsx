import { useState } from 'react';
const SecTabs = ({ viewId, setViewId }) => {
    const secTabs = ['M月组装计划', 'M+1月组装计划', 'M+2月组装计划'];
    const [activeSecTab, setActiveSecTab] = useState('M月组装计划'); // 默认设置为第一个标签

    const handleSecTabClick = (secTab) => {
        setActiveSecTab(secTab);
        setViewId(secTabs.indexOf(secTab));
    };

    return (
        <div className="sec-tab-wrapper row">
            {secTabs.map((secTab, i) => (
                <div key={i}
                    className={`secondary-tab ${activeSecTab === secTab ? "active" : ""}`}
                    onClick={() => handleSecTabClick(secTab)}>
                    {secTab}
                </div>
            ))}
        </div>
    );
};

export default SecTabs;
