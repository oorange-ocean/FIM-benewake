import api from "./axios";

export async function postMessage(message, type) {
    try {
        const response = await api.post('/notice/save', { message, type })
        return response.data;
    }
    catch (err) {
        console.log(err);
    }
}


export async function deleteMessages(ids) {
    try {
        const response = await api.post('/notice/delete', ids)
        return response.data;
    }
    catch (err) {
        console.log(err);
    }
}

export async function findMessages({ signal } = {}) {
    try {
        const response = await api.post('/notice/find', { signal });
        return response.data;
    }
    catch (err) {
        console.log(err);
    }
}

export async function findTodos({ signal } = {}) {
    try {
        const response = await api.get('/todotask/filtered-orders', { signal });
        return response.data;
    }
    catch (err) {
        console.log(err);
    }
}

export async function findPODelay({ signal } = {}) {
    try {
        const response = await api.get('/todotask/PoDelay', { signal });
        return response.data;
    }
    catch (err) {
        console.log(err);
    }
}

export async function fetchFilteredInquiries() {
    try {
        const response = await api.get('/todotask/filtered-inquiries')
        return response.data;
    }
    catch (err) {
        console.log(err);
    }
}

export const hideMessage = async (id) => {
    try {
        const formData = new FormData();
        formData.append('id', id);

        const response = await api.post('/notice/hidden', formData);
        return response.data;
    } catch (error) {
        return { code: 500, message: '网络错误' };
    }
}
