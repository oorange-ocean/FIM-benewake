//将对象转换为字符串
const labels = ['年度', '月度', '代理商', '新增', '临时', '日常'];

const handleTypeFilter = (newParams) => {
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

export default handleTypeFilter;