import React, { useRef, useEffect, useState } from 'react'
import { useDrag, useDrop } from 'react-dnd'

const DraggableRow = ({
    row,
    index,
    moveRow,
    lastTopRowIndex,
    getCellStyleClass,
    getCellContent,
    handleDragEnd
}) => {
    const isTop = row.original.isTop === 1
    const ref = useRef(null)
    const [{ isDragging }, drag] = useDrag({
        type: 'ROW',
        item: { index, isTop },
        canDrag: isTop,
        collect: (monitor) => ({
            isDragging: monitor.isDragging()
        }),
        end: (item, monitor) => {
            const dropResult = monitor.getDropResult()
            if (item && dropResult) {
                handleDragEnd()
            }
        }
    })

    const [, drop] = useDrop({
        accept: 'ROW',
        canDrop: (item) => item.isTop && index <= lastTopRowIndex,
        hover: (item, monitor) => {
            if (!ref.current) {
                return
            }
            const dragIndex = item.index
            const hoverIndex = index

            if (dragIndex === hoverIndex) {
                return
            }

            moveRow(dragIndex, hoverIndex)
            item.index = hoverIndex
        }
    })

    const [rowHeight, setRowHeight] = useState(0)

    useEffect(() => {
        if (ref.current) {
            setRowHeight(ref.current.offsetHeight)
        }
    }, [])

    drag(drop(ref))

    const rowStyle = isDragging
        ? {
              position: 'relative',
              zIndex: 9999,
              opacity: 0.5,
              backgroundColor: '#f0f0f0',
              boxShadow: '0 0 5px rgba(0,0,0,0.3)'
          }
        : {}

    return (
        <div
            ref={ref}
            className={`tr${row.getIsSelected() ? ' selected' : ''}${
                index === lastTopRowIndex ? ' last-top-row' : ''
            }`}
            style={{
                ...rowStyle,
                transition: 'transform 0.2s',
                transform: `translateY(${
                    (index - row.original.originalIndex) * rowHeight
                }px)`
            }}
        >
            <div className="td checkbox fixed">
                <input
                    type="checkbox"
                    name={row.id}
                    checked={row.getIsSelected()}
                    onChange={row.getToggleSelectedHandler()}
                />
            </div>
            {row.getVisibleCells().map((cell) => (
                <div
                    key={cell.id}
                    style={{ width: cell.column.getSize() }}
                    className={`td ${
                        cell.column.columnDef.id
                    } ${getCellStyleClass(cell)}`}
                >
                    {getCellContent(cell)}
                </div>
            ))}
        </div>
    )
}

export default DraggableRow
