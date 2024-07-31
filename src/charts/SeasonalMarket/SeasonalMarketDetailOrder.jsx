//SeasonalMarketDetailOrder.jsx
//这是季度销售情况分析表的二级下探界面，接收三个参数，分别是itemCode, quarter, year
///dashboard/getSalesDetailByItemAndQuarter?itemCode=13.01.02.023&quarter=3&year=2021
//季度销售的详细情况，横轴为时间，纵轴为销售额，每个点代表一个订单
//订单数据示例	{
// 	"salesmanName": "赵璐",
// 	"saleTime": "2021-07-02",
// 	"itemCode": "13.01.02.023",
// 	"saleNum": 10,
// 	"customerName": "Mouser Electronics Inc."
// },
import React, { useState, useEffect } from 'react';
import EChartsReact from "echarts-for-react";
import benewake from '../../echarts-theme/benewake.json';
import { getSalesDetailByItemAndQuarter } from '../../api/dashBoard';
import CloseIcon from '@mui/icons-material/Close'; const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};

const SeasonalMarketDetailOrder = ({ itemCode, quarter, year }) => {
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const res = await getSalesDetailByItemAndQuarter(itemCode, quarter, year);
            setData(res.data);
        };
        fetchData();
    }, [itemCode, quarter, year]);

    const processData = (rawData) => {
        const salesmanData = {};
        const dates = new Set();
        const detailedData = {};

        rawData.forEach(item => {
            const date = formatDate(item.saleTime);
            dates.add(date);

            if (!salesmanData[item.salesmanName]) {
                salesmanData[item.salesmanName] = {};
            }

            if (!salesmanData[item.salesmanName][date]) {
                salesmanData[item.salesmanName][date] = 0;
            }

            salesmanData[item.salesmanName][date] += item.saleNum;

            if (!detailedData[date]) {
                detailedData[date] = [];
            }
            detailedData[date].push(item);
        });

        const sortedDates = Array.from(dates).sort();

        return {
            dates: sortedDates,
            series: Object.entries(salesmanData).map(([name, sales]) => ({
                name,
                type: 'line',
                stack: 'Total',
                areaStyle: {},
                emphasis: {
                    focus: 'series'
                },
                data: sortedDates.map(date => ({
                    value: sales[date] || 0,
                    itemData: detailedData[date] || []
                }))
            })),
            detailedData
        };
    };

    const { dates, series, detailedData } = processData(data);

    const option = {
        title: {
            text: `${year}年Q${quarter} - ${itemCode}销售详情`,
            left: 'center',
            textStyle: {
                color: '#ffffff'
            }
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross',
                label: {
                    backgroundColor: '#6a7985'
                }
            },
            formatter: function (params) {
                const date = params[0].axisValue;
                const items = detailedData[date] || [];
                let res = `<strong>${date}</strong><br/>`;

                const salesSummary = {};
                items.forEach(item => {
                    if (!salesSummary[item.salesmanName]) {
                        salesSummary[item.salesmanName] = {
                            totalSales: 0,
                            customers: new Set()
                        };
                    }
                    salesSummary[item.salesmanName].totalSales += item.saleNum;
                    salesSummary[item.salesmanName].customers.add(item.customerName);
                });

                Object.entries(salesSummary).forEach(([salesman, data]) => {
                    res += `<br/><strong>${salesman}</strong>:<br/>`;
                    res += `总销售量: ${data.totalSales}<br/>`;
                    res += `客户数: ${data.customers.size}<br/>`;
                    res += `客户: ${Array.from(data.customers).join(', ')}<br/>`;
                });

                return res;
            }
        },
        legend: {
            data: series.map(s => s.name),
            top: 'bottom',
            textStyle: {
                color: '#ffffff'
            }
        },
        toolbox: {
            feature: {
                saveAsImage: {}
            }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '10%',
            containLabel: true
        },
        xAxis: [
            {
                type: 'category',
                boundaryGap: false,
                data: dates,
                axisLabel: {
                    color: '#ffffff'
                }
            }
        ],
        yAxis: [
            {
                type: 'value',
                name: '销售量',
                axisLabel: {
                    color: '#ffffff'
                },
                nameTextStyle: {
                    color: '#ffffff'
                }
            }
        ],
        series: series
    };

    return (
        <div className="seasonal-market-detail">
            <EChartsReact
                option={option}
                theme={benewake}
                style={{ height: '400px', width: '100%' }}
            />
        </div>
    );
};

export default SeasonalMarketDetailOrder;

