import {
    createColumnHelper,
} from '@tanstack/react-table';

const columnHelper = createColumnHelper();

const columns = [
    columnHelper.accessor('materialCode', {
        header: '物料编码',
        size: 100,
        cell: info => info.getValue(),
    }),
    columnHelper.accessor('materialName', {
        header: '物料名称',
        size: 120,
        cell: info => info.getValue(),
    }),
    columnHelper.group({
        id: 'today',
        header: () => '今日' + new Date().toLocaleDateString(),
        columns: [
            columnHelper.accessor('inventoryCount', {
                header: '即时库存',
                size: 55,
                cell: info => info.getValue(),
            }),
            columnHelper.accessor('todayPOOccupy', {
                header: 'PO占用',
                size: 55,
                cell: info => info.getValue(),
            }),
            columnHelper.accessor('todayPROccupy', {
                header: 'PR占用',
                size: 55,
                cell: info => info.getValue(),
            }),
            columnHelper.accessor('todayYGOccupy', {
                header: 'YG占用',
                size: 55,
                cell: info => info.getValue(),
            }),
            columnHelper.accessor('todayAvailable', {
                header: '可用',
                size: 55,
                cell: info => info.getValue(),
            }),
        ],
    }),
    columnHelper.group({
        id: 'firstBatch',
        header: '首批入库时间',
        columns: [
            columnHelper.accessor('firstStorageTime', {
                header: '入库时间',
                size: 55,
                cell: info => info.getValue(),
            }),
            columnHelper.accessor('firstPOOccupy', {
                header: 'PO占用',
                size: 55,
                cell: info => info.getValue(),
            }),
            columnHelper.accessor('firstPROccupy', {
                header: 'PR占用',
                size: 55,
                cell: info => info.getValue(),
            }),
            columnHelper.accessor('firstYGOccupy', {
                header: 'YG占用',
                size: 55,
                cell: info => info.getValue(),
            }),
            columnHelper.accessor('firstStorageCount', {
                header: '入库数量',
                size: 55,
                cell: info => info.getValue(),
            }),
            columnHelper.accessor('firstAvailable', {
                header: '预计可用',
                size: 55,
                cell: info => info.getValue(),
            }),
        ],
    }),
    columnHelper.group({
        id: 'secondBatch',
        header: '次批入库时间',
        columns: [
            columnHelper.accessor('secondStorageTime', {
                header: '入库时间',
                size: 55,
                cell: info => info.getValue(),
            }),
            columnHelper.accessor('secondPOOccupy', {
                header: 'PO占用',
                size: 55,
                cell: info => info.getValue(),
            }),
            columnHelper.accessor('secondPROccupy', {
                header: 'PR占用',
                size: 55,
                cell: info => info.getValue(),
            }),
            columnHelper.accessor('secondYGOccupy', {
                header: 'YG占用',
                size: 55,
                cell: info => info.getValue(),
            }),
            columnHelper.accessor('secondStorageCount', {
                header: '入库数量',
                size: 55,
                cell: info => info.getValue(),
            }),
            columnHelper.accessor('secondAvailable', {
                header: '预计可用',
                size: 55,
                cell: info => info.getValue(),
            }),
        ],
    }),
];

export default columns;