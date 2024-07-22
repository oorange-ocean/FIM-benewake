import { useState, useEffect } from 'react';
import {
    flexRender,
    useReactTable,
    getCoreRowModel,
    getFilteredRowModel,
    getFacetedRowModel,
    getFacetedUniqueValues,
    getPaginationRowModel,
    getSortedRowModel,
    getGroupedRowModel
} from '@tanstack/react-table';
import Paginate from '../../components/table/Paginate';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useTableStatesContext, useUpdateTableStatesContext } from '../../hooks/useCustomContext';
import DraggableHeader from '../../components/table/DraggableHeader';
import { updateCustomerTypeReviseById } from '../../api/analysis'

const getCommonPinningStyles = (column, columns) => {
    const isPinned = column.columnDef.header === '物料编码' || column.columnDef.header === '物料名称' ? 'left' : undefined;
    const isLastLeftPinnedColumn = column.columnDef.header === '物料名称';
    const isFirstRightPinnedColumn = false;

    // 检查是否是标题行
    const isTitleColumn = column.columnDef.header.includes('北醒光子');

    // 计算左偏移量
    let leftOffset = 0;
    if (isPinned === 'left') {
        if (column.columnDef.header === '物料名称') {
            leftOffset = 100; // 第一列的宽度
        } else if (column.columnDef.header === '物料编码') {
            leftOffset = 0;
        }
    }

    // 样式设置
    return {
        boxShadow: isLastLeftPinnedColumn
            ? '-4px 0 4px -4px gray inset'
            : isFirstRightPinnedColumn
                ? '4px 0 4px -4px gray inset'
                : undefined,
        left: isPinned === 'left' ? `${leftOffset}px` : undefined,
        right: isPinned === 'right' ? `${column.getAfter('right')}px` : undefined,
        opacity: isPinned ? 0.95 : 1,
        position: isPinned ? 'sticky' : 'relative',
        width: column.getSize(),
        zIndex: isPinned ? 1 : 0,
        ...(isTitleColumn && {
            //将标题固定，即便滚动也不会消失，不用sticky
            position: 'fixed',
            top: 197,
            zIndex: 1,


        }),
    }
};




export default function Table({ data, columns, noPagination, setNewInquiryData, handleRefresh }) {
    const states = useTableStatesContext();
    const [rowSelection, setRowSelection] = useState({});
    const columnVisibility = states.columnVisibility;
    const [sorting, setSorting] = useState([]);
    const [grouping, setGrouping] = useState([]);
    const [columnFilters, setColumnFilters] = useState([]);
    const [columnResizeMode] = useState('onChange');
    const updateTableStates = useUpdateTableStatesContext();
    const [columnOrder, setColumnOrder] = useState(columns.map(column => column.id));
    const [currentRowData, setCurrentRowData] = useState(null);
    const initialColumnPinningState = {
        columnPinning: {
            left: ['materialCode', 'materialName'], // 将列固定在左侧
            right: [], // 没有列固定在右侧
        },
    }
    useEffect(() => setRowSelection({}), [data]);
    useEffect(() => updateTableStates({ type: "SET_ROW_SELECTION", rowSelection }), [rowSelection]);

    const handleClose = () => setModalOpen(false);
    const handleChange = async (event) => {
        const value = event.target.value;
        // 调用/past-analysis/updateCustomerTypeReviseById?id=23&customerTypeRevise=请问 
        await updateCustomerTypeReviseById(currentRowData.id, labels[value] ?? '');
        await handleRefresh()
        setModalOpen(false);
    };

    const table = useReactTable({
        data,
        columns,
        columnResizeMode,
        enableRowSelection: true,
        defaultColumn: {
            isVisible: false
        },
        state: {
            sorting,
            grouping,
            columnFilters,
            columnVisibility,
            rowSelection,
            columnOrder
        },
        initialState: {
            columnVisibility: columnVisibility,
            pagination: {
                pageSize: 100,
            },
            initialColumnPinningState: initialColumnPinningState
        },
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getGroupedRowModel: getGroupedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getFacetedRowModel: getFacetedRowModel(),
        getFacetedUniqueValues: getFacetedUniqueValues(),
        onSortingChange: setSorting,
        onGroupingChange: setGrouping,
        onColumnOrderChange: setColumnOrder,
        onRowSelectionChange: setRowSelection,
        onColumnFiltersChange: setColumnFilters,
        meta: {
            updateData: (rowIndex, columnId, value) => {
                setNewInquiryData(prev =>
                    prev.map((row, index) => {
                        if (index === rowIndex) {
                            return { ...prev[rowIndex], [columnId]: value };
                        }
                        return row;
                    })
                );
            },
        },
    });

    return (
        <DndProvider backend={HTML5Backend}>
            <div className="table-container col">
                <div className="table-wrapper">
                    <div className="table" style={{ width: table.getCenterTotalSize() }}>
                        <div className='thead'>
                            {table.getHeaderGroups().map(headerGroup => (
                                <div className='tr' key={headerGroup.id}>
                                    <div className='th checkbox fixed'>
                                        <input
                                            type="checkbox"
                                            name={table.id}
                                            checked={table.getIsAllRowsSelected()}
                                            onChange={table.getToggleAllRowsSelectedHandler()}
                                        />
                                    </div>
                                    {headerGroup.headers.map(header => {
                                        const { column } = header
                                        return (
                                            <DraggableHeader
                                                key={header.id}
                                                header={header}
                                                table={table}
                                                pinstyle={{ ...getCommonPinningStyles(column) }}
                                            />
                                        )
                                    })}
                                </div>
                            ))}
                        </div>
                        <div className='tbody'>
                            {table.getRowModel().rows.map(row => (
                                <div
                                    key={row.id}
                                    className={`tr${row.getIsSelected() ? ' selected' : ''}`}
                                >
                                    <div className='td checkbox fixed'>
                                        <input
                                            type="checkbox"
                                            name={row.id}
                                            checked={row.getIsSelected()}
                                            onChange={row.getToggleSelectedHandler()}
                                        />
                                    </div>
                                    {row.getVisibleCells().map(cell => {
                                        const { column } = cell

                                        return (
                                            <div
                                                key={cell.id}
                                                style={{ width: cell.column.getSize(), ...getCommonPinningStyles(column) }}
                                                className={`td ${cell.column.columnDef.id}`}
                                            >
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </div>
                                        )
                                    })}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                {!noPagination && <Paginate table={table} />}
            </div>
        </DndProvider>
    );
}
