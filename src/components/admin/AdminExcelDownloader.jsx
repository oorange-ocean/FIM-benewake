import { useState } from 'react';
import api from '../../api/axios';
import { useAlertContext } from '../../hooks/useCustomContext';

export default function AdminExcelDownloader({ close, currentPage, pageSize, exportTypeNum }) {
  const { alertWarning, alertSuccess } = useAlertContext();

  const handleDownload = async (isExportCurrentPage) => {
    const requestData = {
      typeNum: exportTypeNum,
      isTemplate: false,
    };

    if (isExportCurrentPage) {
      requestData.currentPage = currentPage;
      requestData.pageSize = pageSize;
    }

    try {
      const response = await api.post('/admin/downloadDataToExcel', requestData, {
        responseType: 'blob' // 确保返回的是一个文件
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', '导出数据.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();

      alertSuccess("导出成功！");
    } catch (error) {
      alertWarning("导出失败！");
    }
    close();
  };

  return (
    <div className='excel-uploader-container col flex-center'>
      <h3>选择导出选项</h3>
      <div className='row flex-center g1'>
        <button onClick={() => handleDownload(false)} className='blue40 small'>全部导出</button>
        <button onClick={() => handleDownload(true)} className='blue40 small'>导出当前页</button>
      </div>
      <div className='row flex-center g1'>
        <button onClick={close} className='white small bordered'>取消</button>
      </div>
    </div>
  );
};
