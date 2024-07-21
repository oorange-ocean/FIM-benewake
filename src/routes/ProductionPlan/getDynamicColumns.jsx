import {
    createColumnHelper,
} from '@tanstack/react-table';

const columnHelper = createColumnHelper();

// 获取当前年份和月份
const currentDate = new Date();
const currentYear = currentDate.getFullYear();
const currentMonth = currentDate.getMonth() + 1; // getMonth() 返回的月份是从0开始的，所以加1

// 辅助函数，根据viewId返回动态列
function getDynamicColumns(viewId) {
    const newDate = new Date(currentYear, currentMonth - 1 + viewId, 1);
    const year = newDate.getFullYear();
    const month = newDate.getMonth() + 1; // getMonth() 返回的月份是从0开始的，所以加1

    // 生成一个月的日期列
    const dateColumns = [];
    const daysInMonth = new Date(year, month, 0).getDate(); // 获取当前月的天数

    for (let day = 1; day <= daysInMonth; day++) {
        dateColumns.push(
            columnHelper.accessor(`${month}/${day}`, {
                header: `${month}/${day}`,
                size: 70,
                cell: info => info.getValue(),
            })
        );
    }

    // 将物料编码和物料名称加入
    dateColumns.unshift(
        columnHelper.accessor('materialCode', {
            header: '物料编码',
            id: 'materialCode',
            size: 100,
            cell: info => info.getValue(),
            enablePinning: true,
        }),
        columnHelper.accessor('materialName', {
            id: 'materialName',
            header: '物料名称',
            size: 120,
            cell: info => info.getValue(),
            enablePinning: true,
        })
    );

    const columns = [
        columnHelper.group({
            id: 'assemblyPlan',
            header: `北醒光子${year}年${month}月组装生产计划`,
            columns: dateColumns,
            size: 70 * (daysInMonth) + 220,
        }),
    ];

    return columns;
}

export default getDynamicColumns;
