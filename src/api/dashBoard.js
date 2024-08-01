import axios from "./axios";
///dashboard/getSalesDetailByItemAndQuarter?itemCode=13.01.02.023&quarter=3&year=2021
export const getSalesDetailByItemAndQuarter = (itemCode, quarter, year) => {
    return axios.get(`/dashboard/getSalesDetailByItemAndQuarter?itemCode=${itemCode}&quarter=${quarter}&year=${year}`);
};

// /dashboard/getSalesNumSumByItemAndQuarterGroupBySalesman?itemCode=13.01.02.023&quarter=3&year=2021
export const getSalesNumSumByItemAndQuarterGroupBySalesman = (itemCode, quarter, year) => {
    return axios.get(`/dashboard/getSalesNumSumByItemAndQuarterGroupBySalesman?itemCode=${itemCode}&quarter=${quarter}&year=${year}`);
}
///dashboard/getSalesNumSumByItemGroupBySalesman?itemCode=13.01.02.023
export const getSalesNumSumByItemGroupBySalesman = (itemCode) => {
    return axios.get(`/dashboard/getSalesNumSumByItemGroupBySalesman?itemCode=${itemCode}`);
}