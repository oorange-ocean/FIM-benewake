import { useDrag, useDrop } from 'react-dnd'
import { flexRender } from '@tanstack/react-table'
import { ReactComponent as ArrowIcon } from '../../assets/icons/arrow-down.svg'

const getCellContent = (column, table) => {
    const headerValue =
        typeof column.columnDef.header === 'function'
            ? column.columnDef.header()
            : column.columnDef.header

    const isDateColumn =
        typeof headerValue === 'string' && headerValue.includes('/')

    if (isDateColumn) {
        return (
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                }}
            >
                <span
                    style={{
                        fontSize: '0.7em',
                        lineHeight: '1',
                        marginBottom: '2px',
                        color: '#666'
                    }}
                >
                    {getWeekday(headerValue)}
                </span>
                <span>{headerValue}</span>
            </div>
        )
    }
    return headerValue
}

const getWeekday = (dateString) => {
    if (typeof dateString !== 'string') return ''

    const [month, day] = dateString.split('/').map(Number)
    if (isNaN(month) || isNaN(day)) return ''

    const currentYear = new Date().getFullYear()
    const date = new Date(currentYear, month - 1, day)
    const weekdays = ['日', '一', '二', '三', '四', '五', '六']
    return weekdays[date.getDay()]
}

const DraggableHeader = ({ header, table, pinstyle }) => {
    const { getState, setColumnOrder } = table
    const { columnOrder } = getState()
    const { column } = header
    // const [showSearch, setShowSearch] = useState(false)

    const reorderColumn = (draggedColumnId, targetColumnId, columnOrder) => {
        columnOrder.splice(
            columnOrder.indexOf(targetColumnId),
            0,
            columnOrder.splice(columnOrder.indexOf(draggedColumnId), 1)[0]
        )
        return [...columnOrder]
    }

    const [, dropRef] = useDrop({
        accept: 'column',
        drop: (draggedColumn) => {
            const newColumnOrder = reorderColumn(
                draggedColumn.id,
                column.id,
                columnOrder
            )
            setColumnOrder(newColumnOrder)
        }
    })

    const [{ isDragging }, dragRef, previewRef] = useDrag({
        collect: (monitor) => ({
            isDragging: monitor.isDragging()
        }),
        item: () => column,
        type: 'column'
    })

    return (
        <div
            className="th"
            ref={dropRef}
            style={{
                opacity: isDragging ? 0.5 : 1,
                width: header.getSize(),
                ...pinstyle
            }}
            id={header.id}
            colSpan={header.colSpan}
        >
            <div ref={previewRef} className="row flex-center">
                <button
                    onClick={header.column.getToggleSortingHandler()}
                    ref={dragRef}
                >
                    {header.isPlaceholder
                        ? null
                        : flexRender(
                              () => getCellContent(header.column),
                              header.getContext()
                          )}

                    <span className="sort-icon">
                        {
                            {
                                asc: (
                                    <ArrowIcon className="header-icon rotate180" />
                                ),
                                desc: (
                                    <ArrowIcon className="header-icon icon__small" />
                                ),
                                false: ''
                            }[header.column.getIsSorted() ?? 'false']
                        }
                    </span>
                </button>
                {/* <button onClick={() => setShowSearch(!showSearch)}><ArrowIcon className="header-icon icon__small" /></button> */}
            </div>

            {/* resizer */}
            {header.column.getCanResize() && (
                <div
                    onMouseDown={header.getResizeHandler()}
                    onTouchStart={header.getResizeHandler()}
                    className={`resizer ${
                        header.column.getIsResizing() ? 'isResizing' : ''
                    }`}
                />
            )}

            {/* filter */}

            {/* {header.column.getCanFilter() && showSearch && (
                <Search column={header.column} closeSearch={() => setShowSearch(false)} />
            )} */}
        </div>
    )
}

export default DraggableHeader
