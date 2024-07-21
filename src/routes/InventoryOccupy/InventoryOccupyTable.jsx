import React, { useState, useEffect, useMemo } from 'react';
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

    useEffect(() => setRowSelection({}), [data]);
    useEffect(() => updateTableStates({ type: "SET_ROW_SELECTION", rowSelection }), [rowSelection]);

    // Find the index of the last top row
    const lastTopRowIndex = useMemo(() => {
        for (let i = data.length - 1; i >= 0; i--) {
            if (data[i].isTop === 1) {
                return i;
            }
        }
        return -1;
    }, [data]);

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
                            {table.getRowModel().rows.map((row, index) => (
                                <div
                                    key={row.id}
                                    className={`tr${row.getIsSelected() ? ' selected' : ''}${index === lastTopRowIndex ? ' last-top-row' : ''}`}
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
                                            className={`td ${cell.column.columnDef.id}`}
                                        >
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </div>
                                    ))}
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