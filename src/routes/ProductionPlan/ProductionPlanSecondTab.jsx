const SecTabs = () => {
    const secTabs = ['M月组装计划', 'M+1月组装计划', 'M+2月组装计划']

    return (
        <div className="sec-tab-wrapper row">
            {secTabs.map((secTab, i) =>
                <div key={i}
                    className={`secondary-tab`}
                    onClick={() => { }}>
                    {secTab}
                </div>
            )}
        </div>
    )
}


export default SecTabs;
