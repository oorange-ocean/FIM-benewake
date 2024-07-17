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