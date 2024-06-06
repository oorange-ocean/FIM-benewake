import axios from "./axios";

export async function fetchAnalysisData(url, params) {
    try {
        // 特定 URL 的默认参数
        const defaultParams = {
            yearly: 0,
            monthly: 1,
            agent: 0,
            newCustomer: 0,
            temporaryCustomer: 0,
            daily: 0
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
