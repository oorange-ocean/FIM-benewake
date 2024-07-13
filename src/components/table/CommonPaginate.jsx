import React, { useState, useEffect } from 'react';

const Pagination = ({
    current,
    total,
    pageSize,
    onChange,
    showSizeChanger = true,
    showQuickJumper = true,
    pageSizeOptions = [100, 500, 1500]
}) => {
    const [pageNum, setPageNum] = useState(current);
    const [currentPageSize, setCurrentPageSize] = useState(pageSize);
    const totalPages = Math.ceil(total / currentPageSize);

    useEffect(() => {
        setPageNum(current);
    }, [current]);

    useEffect(() => {
        setCurrentPageSize(pageSize);
    }, [pageSize]);

    const handlePageChange = (newPage, newSize = currentPageSize) => {
        const validatedPage = Math.max(1, Math.min(newPage, Math.ceil(total / newSize)));
        setPageNum(validatedPage);
        setCurrentPageSize(newSize);
        onChange(validatedPage, newSize);
    };

    const handleInput = (e) => {
        const newValue = e.target.value;
        if (/^\d+$/.test(newValue)) {
            setPageNum(Number(newValue));
        } else if (newValue === '') {
            setPageNum('');
        }
    };

    const handleInputBlur = () => {
        if (pageNum === '' || pageNum < 1) {
            handlePageChange(1);
        } else if (pageNum > totalPages) {
            handlePageChange(totalPages);
        } else {
            handlePageChange(pageNum);
        }
    };

    const handleSizeChange = (newSize) => {
        const newPageSize = Number(newSize);
        const newPageNum = 1;
        handlePageChange(newPageNum, newPageSize);
    };

    return (
        <div className="pagination-container row flex-center">
            <div className="row pagination-wrapper flex-center">
                <button
                    className="border rounded p-1"
                    onClick={() => handlePageChange(1)}
                    disabled={pageNum === 1}
                >
                    {'<<'}
                </button>
                <button
                    className="border rounded p-1"
                    onClick={() => handlePageChange(pageNum - 1)}
                    disabled={pageNum === 1}
                >
                    {'<'}
                </button>
                {showQuickJumper && (
                    <span className="row flex-center">
                        第
                        <input
                            name="page-number"
                            type="number"
                            value={pageNum}
                            onChange={handleInput}
                            onBlur={handleInputBlur}
                            className="page-number"
                            //回车自动跳转
                            onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                    handleInputBlur();
                                }
                            }}

                        />
                        页
                    </span>
                )}
                <button
                    className="border rounded p-1"
                    onClick={() => handlePageChange(pageNum + 1)}
                    disabled={pageNum === totalPages}
                >
                    {'>'}
                </button>
                <button
                    className="border rounded p-1"
                    onClick={() => handlePageChange(totalPages)}
                    disabled={pageNum === totalPages}
                >
                    {'>>'}
                </button>
            </div>
            {showSizeChanger && (
                <div className="page-size-controller row flex-center">
                    每页显示
                    <select
                        name="page-size"
                        value={currentPageSize}
                        onChange={(e) => handleSizeChange(e.target.value)}
                    >
                        {pageSizeOptions.map(size => (
                            <option key={size} value={size}>
                                {size}
                            </option>
                        ))}
                    </select>
                    行/共 <strong>{total}</strong>行
                </div>
            )}
            <div className="total-pages">
                共 {totalPages} 页
            </div>
        </div>
    );
};

export default Pagination;