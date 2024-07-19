export default function transformData(records) {
    // 确保 records 是一个数组
    if (!Array.isArray(records)) {
        return [];
    }

    // 获取当前年份和月份
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1; // getMonth() 返回的月份是从0开始的，所以加1

    // 生成一个月的日期列
    const daysInMonth = new Date(year, month, 0).getDate(); // 获取当前月的天数

    // 创建一个初始格式的数据表格
    const transformedData = {};

    records.forEach(record => {
        const materialCode = record.fmaterialCode;
        const materialName = record.fmaterialName;
        const completedQuantity = record.fcompletedQuantity;
        const actualStartTime = new Date(record.factualStartTime);
        const startMonth = actualStartTime.getMonth() + 1; // getMonth() 返回的月份是从0开始的，所以加1
        const startDay = actualStartTime.getDate();

        // 如果物料编码不存在，则初始化它
        if (!transformedData[materialCode]) {
            transformedData[materialCode] = {
                materialCode,
                materialName,
            };

            // 初始化每一天的值为空
            for (let day = 1; day <= daysInMonth; day++) {
                transformedData[materialCode][`${month}/${day}`] = '';
            }
        }

        // 填充对应日期的完成数量
        if (startMonth === month) {
            transformedData[materialCode][`${startMonth}/${startDay}`] = completedQuantity;
        }
    });

    // 转换为数组形式
    return Object.values(transformedData);
}