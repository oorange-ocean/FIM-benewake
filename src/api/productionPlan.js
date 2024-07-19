import axios from './axios'
// /productionPlan/getProductionPlan?pageNum=1&pageSize=5&materialCode=&monthCount=
export async function getProductionPlan(pageNum, pageSize, materialCode, monthCount) {
    try {
        let url = `/productionPlan/getProductionPlan?pageNum=${pageNum}&pageSize=${pageSize}&materialCode=${materialCode}&monthCount=${monthCount}`
        const response = await axios.get(url)
        return response.data;
    }
    catch (err) {
        console.log(err);
    }
}
