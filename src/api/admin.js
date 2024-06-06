import axios from "./axios";
import adminSchema from '../constants/schemas/adminSchema'

export async function fetchAdminData(url) {
    try {
        const response = await axios.get(`/admin/${url}`)
        return response.data;
    }
    catch (err) {
        console.log(err);
    }
}

export async function addAdminData(type, payload) {

    const addUrl = adminSchema[type].add.url

    try {
        const response = await axios.post(`/admin/${addUrl}`, null, { params: payload })
        return response.data;
    }
    catch (err) {
        console.log(err);
    }
}

export async function deleteAdminData(type, payload) {
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