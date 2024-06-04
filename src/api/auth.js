import axios from "./axios";

export async function login({ username, password }) {
    try {
        const response = await axios.post('/home/login', {
            username, password
        })
        return response.data;
    }
    catch (err) {
        console.log(err);
    }
}

export async function createUser({ username, password, userType }) {
    try {
        const response = await axios.post('/admin/add', {
            username, password, userType
        })
        return response.data;
    }
    catch (err) {
        console.log(err);
    }
}

export async function logout() {
    try {
        const response = await axios.get('/home/logout')
        const cookies = document.cookie.split('; ').map(cookie => cookie.trim())
        const filteredCookies = cookies.filter(cookie => {
            return !cookie.startsWith("ticket=") &&
                !cookie.startsWith("benewakeusername=") &&
                !cookie.startsWith("benewakeuserType=");
        });

        document.cookie = "ticket=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        document.cookie = "benewakeusername=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        document.cookie = "benewakeuserType=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

        filteredCookies.forEach(cookie => {
            document.cookie = cookie;
        });
        window.history.replaceState({}, document.title, window.location.pathname);
        return response.data;
    }
    catch (err) {
        console.log(err);
    }
}

export async function getConfigParameters(url) {
    try {
        const response = await axios.get(`/get_config_parameters?url=${encodeURIComponent(url)}`);
        return response.data;
    } catch (err) {
        console.log(err);
    }
}

export async function checkUser(username) {
    try {
        const response = await axios.post('/check_user', {
            username
        });
        return response.data;
    } catch (err) {
        console.log(err);
    }
}



