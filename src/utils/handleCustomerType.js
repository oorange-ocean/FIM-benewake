//将对象转换为字符串
const labels = ['年度', '月度', '代理商', '新增', '临时', '日常'];

const ParamsToString = (newParams) => {
    let str = '';
    for (const key in newParams) {
        if (newParams[key] === 1) {
            str += labels[Object.keys(newParams).indexOf(key)] + ',';
        }
    }
    //去掉最后一个逗号
    str = str.slice(0, -1);
    return str;
};

const StringToParams = (str) => {
    const newParams = {
        yearly: 0,
        monthly: 0,
        agent: 0,
        newCustomer: 0,
        temporaryCustomer: 0,
        daily: 0
    };
    if (str) {
        const arr = str.split(',');
        for (const item of arr) {
            newParams[Object.keys(newParams)[labels.indexOf(item)]] = 1;
        }
    }

    return newParams;
};

export { StringToParams, ParamsToString };