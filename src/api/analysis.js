import axios from "./axios";
import { StringToParams } from "../utils/handleCustomerType";

const specialUrls = [
    'getAllCustomerTypeOrdersReplaced',
    'getAllCustomerTypeOrdersBack',
    'getAllCustomerTypeOrdersMonthlyReplaced',
    'getAllCustomerTypeOrdersMonthlyBack'
];
export async function filterAnalysisDate(url, params = {}, setFilters) {
    //params包括pageNum,pageSize,filters，其中前两个拼接到url里，最后一个放到请求体里
    const { pageNum, pageSize, filters } = params;

    if (!specialUrls.includes(url)) {
        // 在filters中剔除这个字段
        const pagination = `pageNum=${pageNum}&pageSize=${pageSize}`;
        let response;
        if (filters.length > 0) {
            // 将filter转为values,一个对象，键为filter的key，值为filter的{condition, value}
            const values = filters.reduce((acc, filter) => {
                acc[filter.key] = {
                    condition: filter.condition || 'eq', // 默认条件为 'eq'
                    value: filter.value
                };
                return acc;
            }, {});
            response = await axios.post(`/past-analysis/${url}${url.includes('?') ? '&' : '?'}${pagination}`, values);
        }
        return response.data;
    }

    else if (url !== 'getAllCustomerTypeOrdersReplaced' && url !== 'getAllCustomerTypeOrdersBack') {
        // 将filter的customerType属性转为params，并将其中的字段拼接到url里
        const customerType = filters.find(filter => filter.key === 'customerType');
        if (customerType) {
            const newParams = StringToParams(customerType.value);
            // 遍历newParams，将其拼接到url里
            for (let key in newParams) {
                url += `${url.includes('?') ? '&' : '?'}${key}=${newParams[key]}`;
            }
        }
        // 在filters中剔除这个字段
        const newfilters = filters.filter(filter => filter.key !== 'customerType');
        const pagination = `pageNum=${pageNum}&pageSize=${pageSize}`;

        let response;
        if (newfilters.length > 0) {
            // 将filter转为values,一个对象，键为filter的key，值为filter的value和condition
            const values = newfilters.reduce((acc, filter) => {
                acc[filter.key] = {
                    condition: filter.condition || 'eq', // 默认条件为 'eq'
                    value: filter.value
                };
                return acc;
            }, {});
            response = await axios.post(`/past-analysis/${url}${url.includes('?') ? '&' : '?'}${pagination}`, values);
        } else {
            // 如果newfilters为空，则不传递values参数
            response = await axios.post(`/past-analysis/${url}${url.includes('?') ? '&' : '?'}${pagination}`);
        }
        return response.data;
    }

    else {
        const pagination = `pageNum=${pageNum}&pageSize=${pageSize}`;
        const customerType = filters.find(filter => filter.key === 'customerType');
        if (customerType) {
            //将其拼接到url上，例如?customerType=日常,月度
            url += `${url.includes('?') ? '&' : '?'}customerType=${customerType.value}`;
        }
        // 在filters中剔除这个字段
        const newfilters = filters.filter(filter => filter.key !== 'customerType');
        //将filter转为values,一个对象，键为filter的key，值为filter的value
        const values = newfilters.reduce((acc, filter) => {
            acc[filter.key] = {
                condition: filter.condition || 'eq', // 默认条件为 'eq'
                value: filter.value
            };
            return acc;
        }, {});
        const response = await axios.post(`/past-analysis/${url}${url.includes('?') ? '&' : '?'}${pagination}`, values);
        return response.data;
    }
}
//接收一个对象， { "customerType": str }，

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
            daily: 1
        };

        // 设置分页参数
        const paginationParams = {
            pageNum: params.pageNum || savedPagination.current,
            pageSize: params.pageSize || savedPagination.pageSize
        };

        // 如果是特定的 URL，使用默认参数合并用户传入的参数
        if (specialUrls.includes(url)) {
            params = { ...defaultParams, ...params };
        }

        // 从请求参数中剔除分页参数
        const { pageNum, pageSize, ...restParams } = params;

        // 如果 URL 是 'getAllCustomerTypeOrdersMonthlyReplaced' 或 'getAllCustomerTypeOrdersMonthlyBack'
        if (url === 'getAllCustomerTypeOrdersMonthlyReplaced' || url === 'getAllCustomerTypeOrdersMonthlyBack') {
            // 将所有参数拼接到 URL 中
            const queryString = new URLSearchParams({
                ...paginationParams,
                ...restParams
            }).toString();

            // 拼接最终的请求 URL
            const finalUrl = `/past-analysis/${url}?${queryString}`;
            const response = await axios.post(finalUrl);
            return response.data;
        }

        else {
            // 将分页参数拼接到 URL 中
            const queryString = new URLSearchParams({
                pageNum: paginationParams.pageNum,
                pageSize: paginationParams.pageSize
            }).toString();

            // 拼接最终的请求 URL
            const finalUrl = `/past-analysis/${url}?${queryString}`;
            const response = await axios.post(finalUrl, restParams); // 使用 POST 请求
            return response.data;
        }
    } catch (err) {
        console.log(err);
    }
}

//调用/past-analysis/updateAnalysisUnlikelyData
export async function updateAnalysisUnlikelyData() {
    try {
        const response = await axios.get('/past-analysis/updateAnalysisUnlikelyData');
        return response.data;
    } catch (err) {
        console.log(err);
    }
}
///past-analysis/updateCustomerTypeReviseById?id=23&customerTypeRevise=请问
export async function updateCustomerTypeReviseById(id, customerTypeRevise) {
    try {
        const response = await axios.post(`/past-analysis/updateCustomerTypeReviseById?id=${id}&customerTypeRevise=${customerTypeRevise}`);
        return response.data;
    } catch (err) {
        console.log(err);
    }
}
// /past-analysis/updateAllReviseToCustomerType
export async function updateAllReviseToCustomerType() {
    try {
        const response = await axios.post('/past-analysis/updateAllReviseToCustomerType');
        return response;
    } catch (err) {
        console.log(err);
    }
}