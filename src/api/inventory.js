import axios from "./axios";
export async function getInventoryOccupySituation(params) {
    //拼接url
    try {
        let url = `/inventoryOccupySituation/getAllByPage?pageNum=${params.pageNum}&pageSize=${params.pageSize}`
        const response = await axios.get(url)
        return response.data;
    }
    catch (err) {
        console.log(err);
    }
}

///inventoryOccupySituation/setTop?topMaterialCode=12345
export async function setTop(params) {
    try {
        let url = `/inventoryOccupySituation/setTop?topMaterialCode=${params.topMaterialCode}`
        const response = await axios.post(url)
        return response.data;
    }
    catch (err) {
        console.log(err);
    }
}
///inventoryOccupySituation/cancelTop?topMaterialCode=1234
export async function cancelTop(params) {
    try {
        let url = `/inventoryOccupySituation/cancelTop?topMaterialCode=${params.topMaterialCode}`
        const response = await axios.post(url)
        return response.data;
    }
    catch (err) {
        console.log(err);
    }
}