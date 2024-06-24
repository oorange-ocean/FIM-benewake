import axios from "./axios";
import adminSchema from '../constants/schemas/adminSchema'

export async function fetchAdminData(url, filters = null) {
    try {
        let response;
        const hasFilters = filters && filters.filterCriteriaList && filters.filterCriteriaList.length > 0;
        const hasSortingOrPagination = filters && (filters.desc || filters.asc || filters.page || filters.size);

        if (hasFilters || hasSortingOrPagination) {
            // Use POST method for filtering, sorting, or pagination
            response = await axios.post(url, filters);
        }
        else if (url === "suspiciousData") {
            response = await axios.get('/past-analysis/getAllStandards');
        }
        else {
            // Use GET method for simple data fetching
            response = await axios.get(`/admin/${url}`);
        }

        return response.data;
    } catch (err) {
        console.error('Error fetching admin data:', err);
        throw err; // Re-throw the error so it can be handled by the caller
    }
}

export async function addAdminData(type, payload) {

    const addUrl = adminSchema[type].add.url

    try {
        if (type == "suspiciousData") {
            const response = await axios.post(`/past-analysis/insertStandard`, payload)
        }
        else {
            const response = await axios.post(`/admin/${addUrl}`, null, { params: payload })

        }
        return response.data;
    }
    catch (err) {
        console.log(err);
    }
}

export async function deleteAdminData(type, payload) {
    if (type === 'suspiciousData') {
        console.log(payload);
        try {
            const response = await axios.delete(`/past-analysis/delStandards`, { params: { "id": payload } });
            // 根据 status 返回结果
            if (response.status === 200) {
                return { message: '删除成功' };
            } else {
                return { message: `删除失败，状态码：${response.status}` };
            }
        } catch (err) {
            console.log(err);
            return { message: '删除异常' };
        }
    }
    const deleteUrl = adminSchema[type].delete.url

    try {
        const response = await axios.delete(`/admin/${deleteUrl}`, { params: payload })
        return response.data;
    }
    catch (err) {
        console.log(err);
    }
}

export async function getCustomerTypes() {
    try {
        const response = await axios.get('/admin/getCustomerTypes');
        return response.data;
    } catch (err) {
        console.log(err);
    }
}

export async function updateCustomerType(customerName, itemCode, customerType) {
    try {
        const response = await axios.post('/admin/updateFimCustomerTypeTable', {
            customerName: customerName,
            itemCode: itemCode,
            customerType: customerType
        });
        return response.data;
    } catch (err) {
        console.log(err);
    }
}