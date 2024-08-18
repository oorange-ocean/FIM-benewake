import axios from './axios'
///dashboard/getSalesDetailByItemAndQuarter?itemCode=13.01.02.023&quarter=3&year=2021
export const getSalesDetailByItemAndQuarter = (itemCode, quarter, year) => {
    return axios.get(
        `/dashboard/getSalesDetailByItemAndQuarter?itemCode=${itemCode}&quarter=${quarter}&year=${year}`
    )
}

// /dashboard/getSalesNumSumByItemAndQuarterGroupBySalesman?itemCode=13.01.02.023&quarter=3&year=2021
export const getSalesNumSumByItemAndQuarterGroupBySalesman = (
    itemCode,
    quarter,
    year
) => {
    return axios.get(
        `/dashboard/getSalesNumSumByItemAndQuarterGroupBySalesman?itemCode=${itemCode}&quarter=${quarter}&year=${year}`
    )
}
///dashboard/getSalesNumSumByItemGroupBySalesman?itemCode=13.01.02.023
export const getSalesNumSumByItemGroupBySalesman = (itemCode) => {
    return axios.get(
        `/dashboard/getSalesNumSumByItemGroupBySalesman?itemCode=${itemCode}`
    )
}

//获取销售员的销售额，数组形式 /dashboard/getAnalysisOneByItemAndSalesmanIn
export const getAnalysisOneByItemAndSalesmanIn = async (
    salesmanList,
    itemCodeList
) => {
    try {
        const response = await axios.post(
            '/dashboard/getAnalysisOneByItemAndSalesmanIn',
            {
                salesmanList,
                itemCodeList
            }
        )
        return response.data
    } catch (error) {
        console.error('Error fetching salesman data:', error)
        throw error
    }
}

//模糊匹配物料编码 dashboard/getItemByCodeLike?itemCode=13.01.04
export const getItemByCodeLike = async (itemCode) => {
    try {
        const response = await axios.get(
            `/dashboard/getItemByCodeLike?itemCode=${itemCode}`
        )
        return response.data
    } catch (error) {
        console.error('Error fetching item data:', error)
        throw error
    }
}

//模糊匹配销售员信息 /dashboard/getSalesmanByNameLike?salesmanName=张
export const getSalesmanByNameLike = async (salesmanName) => {
    try {
        const response = await axios.get(
            `/dashboard/getSalesmanByNameLike?salesmanName=${salesmanName}`
        )
        return response.data
    } catch (error) {
        console.error('Error fetching salesman data:', error)
        throw error
    }
}

//物料的月度销售情况
// /dashboard/getMonthSaleConditionByItemCodeList 参数为一个数组，放在请求体里，如["13.01.02.023"]
export const getMonthSaleConditionByItemCodeList = async (itemCodeList) => {
    try {
        const response = await axios.post(
            '/dashboard/getMonthSaleConditionByItemCodeList',
            itemCodeList
        )
        return response.data
    } catch (error) {
        console.error('Error fetching monthly sale data:', error)
        throw error
    }
}

//物料的月度销售细节
// dashboard/getSalesDetailByItemAndMonth?itemCode=13.01.02.023&month=4&year=2021
export const getSalesDetailByItemAndMonth = async (itemCode, month, year) => {
    try {
        const response = await axios.get(
            `/dashboard/getSalesDetailByItemAndMonth?itemCode=${itemCode}&month=${month}&year=${year}`
        )
        return response.data
    } catch (error) {
        console.error('Error fetching monthly sale detail data:', error)
        throw error
    }
}
