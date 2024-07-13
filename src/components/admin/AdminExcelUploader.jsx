import { useState } from 'react';
import { useAlertContext } from '../../hooks/useCustomContext';
import api from '../../api/axios';

export default function AdminExcelUploader({ close, exportTypeNum }) {
    const [file, setFile] = useState(null);
    const { alertWarning, alertSuccess, alertError } = useAlertContext();

    const handleFile = (event) => {
        setFile(event.target.files[0]);
    };

    const downloadTemplate = async () => {
        try {
            const response = await api.post('/admin/downloadDataToExcel', {
                typeNum: exportTypeNum,
                isTemplate: true
            }, {
                responseType: 'blob' // 确保返回的是一个文件
            });
            const disposition = response.headers['content-disposition'];
            let filename = '导入模板.xlsx';

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
        } catch (error) {
            alertWarning("下载模板失败！");
        }
    };

    const addData = async () => {
        if (!file) {
            alertWarning("未选择文件！");
        } else {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('num', exportTypeNum); // 传递 num 参数

            try {
                const response = await api.post('/admin/importBasicDataByExcel', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });

                if (response.data.message === 'fail') {
                    alertError(response.data.data || "导入失败！");

                } else {
                    alertSuccess(response.data.message || "导入成功！");

                }
            } catch (error) {
                alertError("导入失败！");
            }
        }
        close();
    };

    return (
        <div className='excel-uploader-container col flex-center'>
            <input id="excel-uploader" type="file" accept=".xlsx,.xls" onChange={handleFile} className='hidden' />
            <button onClick={downloadTemplate} className="btn blue40 small">
                下载导入模板
            </button>
            <label htmlFor="excel-uploader">选择文件(.xls, .xlsx)</label>
            {file?.name}
            <div className='row flex-center g1'>
                <button onClick={close} className='white small bordered'>取消</button>
                <button onClick={addData} className='blue40 small'>导入</button>
            </div>
        </div>
    );
};
