import axios from "./axios";

export async function fetchAnalysisData(url, params = {}) {
    try {
        // 从 localStorage 获取分页参数
        const savedPagination = JSON.parse(localStorage.getItem('pagination')) || {
            current: 1,
            pageSize: 500
        };

        // 特定 URL 的默认参数
        const defaultParams = {
            yearly: 1,
            monthly: 1,
            agent: 1,
            newCustomer: 1,
            temporaryCustomer: 1,
            daily: 1,
            pageNum: savedPagination.current,
            pageSize: savedPagination.pageSize
        };

        // 检查特定的 URL，并合并默认参数
        const specialUrls = [
            'getAllCustomerTypeOrdersReplaced',
            'getAllCustomerTypeOrdersBack',
            'getAllCustomerTypeordersMonthlyReplaced',
            'getAllCustomerTypeordersMonthlyBack'
        ];

        // 设置分页参数
        const paginationParams = {
            pageNum: params.pageNum || savedPagination.current,
            pageSize: params.pageSize || savedPagination.pageSize
        };

        // 如果是特定的 URL，使用默认参数合并用户传入的参数
        if (specialUrls.includes(url)) {
            params = { ...defaultParams, ...params };
        }

        // 合并分页参数到请求参数
        params = { ...paginationParams, ...params };

        const response = await axios.get(`/past-analysis/${url}`, { params: params });
        return response.data;
    } catch (err) {
        console.log(err);
    }
}
