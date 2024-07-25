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
import Paginate from './Paginate';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useTableStatesContext, useUpdateTableStatesContext } from '../../hooks/useCustomContext';
import DraggableHeader from './DraggableHeader';
import { Modal, Box, Typography, Select, MenuItem } from '@mui/material';
import { updateCustomerTypeReviseById } from '../../api/analysis'

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

    const [modalOpen, setModalOpen] = useState(false);
    const [currentCellData, setCurrentCellData] = useState('');
    const [currentRowData, setCurrentRowData] = useState(null);
    const labels = ['年度', '月度', '代理商', '新增', '临时', '日常'];

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

    const getCellContent = (cell) => {
        // {cell.column.columnDef.id === 'monthAvg' ?
        //     cell.getContext().getValue() ? parseFloat(cell.getContext().getValue()).toFixed(2) : ''
        //     : flexRender(cell.column.columnDef.cell, cell.getContext())}
        if (cell.column.columnDef.id === 'monthAvg') {
            return cell.getContext().getValue() ? parseFloat(cell.getContext().getValue()).toFixed(2) : '';
        }
        return flexRender(cell.column.columnDef.cell, cell.getContext());
    };

    const getCellStyleClass = (cell) => {
        console.log("cell.row.original", cell.row.original)
        //如果所在行的isYellow列是1，则返回cell-yellow
        if (cell.row.original?.isYellow === 1) {
            return 'cell-yellow';
        }
        else if (cell.row.original?.oneIsYellow === 1) {
            return 'cell-yellow';
        }
        return '';
    }


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
                                    {headerGroup.headers.map(header => (
                                        <DraggableHeader
                                            key={header.id}
                                            header={header}
                                            table={table}
                                        />
                                    ))}
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
                                    {row.getVisibleCells().map(cell => (
                                        <div
                                            key={cell.id}
                                            style={{ width: cell.column.getSize() }}
                                            className={`td ${cell.column.columnDef.id} ${getCellStyleClass(cell)}`}
                                            onDoubleClick={() => {
                                                if (cell.column.columnDef.id === "customerTypeRevise") {
                                                    setCurrentCellData(cell.getContext().getValue() ?? '');
                                                    setCurrentRowData(row.original);
                                                    setModalOpen(true);
                                                }
                                            }}
                                        >
                                            {getCellContent(cell)}
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                {!noPagination && <Paginate table={table} />}
            </div>
            <Modal open={modalOpen} onClose={handleClose}>
                <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 300,
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 4,
                }}>
                    <Typography variant="h6" component="h2">
                        客户类型转换
                    </Typography>
                    <Select size='small'
                        value={labels?.find(label => label == currentCellData) ? labels.indexOf(currentRowData?.customerType) : ''}
                        onChange={handleChange}
                        fullWidth
                    >
                        {labels.map((label, i) => (
                            <MenuItem key={i} value={i}>
                                {label}
                            </MenuItem>
                        ))}

                    </Select>


                </Box>
            </Modal>
        </DndProvider>
    );
}
