import axios from "./axios";
import adminSchema from '../constants/schemas/adminSchema'
///admin/updateSalesmanChange
//接收两个参数，salesmanNameOld,salesmanNameNew，form-data格式
export async function updateSalesmanChange(salesmanNameOld, salesmanNameNew) {
    try {
        const formData = new FormData();
        formData.append('salesmanNameOld', salesmanNameOld);
        formData.append('salesmanNameNew', salesmanNameNew);
        const response = await axios.post('/admin/updateSalesmanChange', formData);
        return response.data;
    } catch (err) {
        console.log(err);
    }
}

export async function fetchAdminData(url, filters = null) {
    try {
        let response;
        const hasFilters = filters && filters.filterCriteriaList && filters.filterCriteriaList.length > 0;
        const hasSortingOrPagination = filters && (filters.desc || filters.asc || filters.page || filters.size);

        if (hasFilters || hasSortingOrPagination) {
            // Use POST method for filtering, sorting, or pagination
            if(url === "materialType"){
                response = await axios.post('/item/filter/itemType',filters)
            }
            else{response = await axios.post(url, filters);}
        }
        else if (url === "suspiciousData") {
            response = await axios.get('/past-analysis/getAllStandards');
        }
        else if (url === "materialType") {
            response = await axios.post('/item/filter/itemType', { page: 1, size: 100 });
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
    let response = null
    try {
        if (type == "suspiciousData") {
            response = await axios.post(`/past-analysis/insertStandard`, payload)
        }
        else if (type === "itemType") {
            //传参格式为form-data
            const formData = new FormData();
            formData.append('itemTypeName', payload.itemTypeName.toString());
            response = await axios.post('/admin/insertItemType', formData);
        }
        else if(type === "materialType"){
            //传参格式为form-data
            const formData = new FormData();
            //遍历payload，将每个值添加到formData中
            //itemType和quantitative是字符串，需要转换为int
            for (const key in payload) {
                if (key === "itemType" || key === "quantitative") {
                    formData.append(key, parseInt(payload[key]));
                }
                else {
                    formData.append(key, payload[key]);
                }
            }
            response = await axios.post(`/admin/${addUrl}`, formData);

        }
        else {
            response = await axios.post(`/admin/${addUrl}`, null, { params: payload })

        }
        return response.data;
    }
    catch (err) {
        console.log(err);
    }
}

export async function deleteAdminData(type, payload) {
    if (type === 'suspiciousData') {
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
    else if (type === 'materialType') {
        try {
            const response = await axios.post(`/item/batchDeleteItems`, [payload]);
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
    else if (type === "inquiryType") {
        try {
            //将payloads所有值提取出来，变成一个数组
            const values = payload.map(item => item.inquiryTypeName);
            const response = await axios.delete('/admin/deleteInquiryType', {
                data: values  // 直接发送值数组
            });
            return response.data;
        } catch (err) {
            console.log(err);
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