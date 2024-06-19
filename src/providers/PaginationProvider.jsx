import React, { createContext, useState, useEffect } from 'react';
import { PaginationContext } from '../contexts/createContext';

export const PaginationProvider = ({ children }) => {
  // 从 localStorage 中读取分页设置
  const savedPagination = JSON.parse(localStorage.getItem('pagination')) || {
    current: 1,
    pageSize: 500,
    total: 0
  };

  const [pagination, setPagination] = useState(savedPagination);

  useEffect(() => {
    // 将分页设置保存到 localStorage
    localStorage.setItem('pagination', JSON.stringify(pagination));
  }, [pagination]);

  return (
    <PaginationContext.Provider value={{ pagination, setPagination }}>
      {children}
    </PaginationContext.Provider>
  );
};

// 自定义钩子，便于使用上下文
export default PaginationProvider;
