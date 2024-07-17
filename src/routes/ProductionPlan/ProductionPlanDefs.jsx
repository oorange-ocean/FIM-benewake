import {
    createColumnHelper,
} from '@tanstack/react-table';

const columnHelper = createColumnHelper();

// 获取当前年份和月份
const currentDate = new Date();
const year = currentDate.getFullYear();
const month = currentDate.getMonth() + 1; // getMonth() 返回的月份是从0开始的，所以加1

// 生成一个月的日期列
const dateColumns = [];
const daysInMonth = new Date(year, month, 0).getDate(); // 获取当前月的天数

for (let day = 1; day <= daysInMonth; day++) {
    dateColumns.push(
        columnHelper.accessor(`${month}/${day}`, {
            header: `${month}/${day}`,
            size: 37.5,
            cell: info => info.getValue(),
        })
    );
}

const columns = [
    columnHelper.group({
        id: 'assemblyPlan',
        header: `北醒光子${year}年${month}月组装生产计划`,
        columns: dateColumns,
    }),
];

export default columns;
