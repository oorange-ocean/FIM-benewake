import axios from "./axios";

export async function fetchAnalysisData(url, params) {
    try {
        // 特定 URL 的默认参数
        const defaultParams = {
            yearly: 1,
            monthly: 1,
            agent: 1,
            newCustomer: 1,
            temporaryCustomer: 1,
            daily: 1,
            pageNum: 1,
            pageSize: 20
        };

        // 检查特定的 URL，并合并默认参数
        const specialUrls = [
            'getAllCustomerTypeOrdersReplaced',
            'getAllCustomerTypeOrdersBack',
            'getAllCustomerTypeordersMonthlyReplaced',
            'getAllCustomerTypeordersMonthlyBack'
        ];

        if (specialUrls.includes(url)) {
            params = { ...defaultParams, ...params };
        }

        const response = await axios.get(`/past-analysis/${url}`, { params: params });
        return response.data;
    } catch (err) {
        console.log(err);
    }
}
