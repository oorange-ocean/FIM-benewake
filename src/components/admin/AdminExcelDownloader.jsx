import { useEffect, useCallback } from 'react';
import api from '../../api/axios';
import { useAlertContext } from '../../hooks/useCustomContext';

const AdminExcelDownloader = ({ close, currentPage, pageSize, exportTypeNum, toggleExportPopup }) => {
    const { alertWarning, alertSuccess, alertChoice } = useAlertContext();

    const handleDownload = useCallback(async (isExportCurrentPage) => {
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

            const disposition = response.headers['content-disposition'];
            let filename = '导出数据.xlsx';

            if (disposition) {
                const filenameMatch = disposition.match(/filename\*=utf-8''(.+)/);
                if (filenameMatch && filenameMatch.length > 1) {
                    filename = decodeURIComponent(filenameMatch[1]);
                }
            }

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
            link.remove();

            alertSuccess("导出成功！");
        } catch (error) {
            alertWarning("导出失败！");
        }
        close();
    }, [alertSuccess, alertWarning, close, currentPage, pageSize, exportTypeNum]);

    useEffect(() => {
        alertChoice("选择导出选项", [
            {
                name: "全部导出",
                handleClick: () => handleDownload(false)
            },
            {
                name: "导出当前页",
                handleClick: () => handleDownload(true)
            }
        ], toggleExportPopup);
    }, []); // 确保 useEffect 只在组件挂载时运行

    return null; // 因为这个组件只是一个逻辑处理组件，所以不需要渲染任何东西
};

export default AdminExcelDownloader;
