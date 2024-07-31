//某个物料一个季度内的销售员销售占比
// SalesmanShare.jsx
// export const getSalesNumSumByItemAndQuarterGroupBySalesman = (itemCode, quarter, year)
import React, { useState, useEffect } from 'react';
import EChartsReact from "echarts-for-react";
import benewake from '../../echarts-theme/benewake.json';
import { getSalesNumSumByItemAndQuarterGroupBySalesman } from "../../api/dashBoard";

const SalesmanShare = ({ itemCode, quarter, year }) => {
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const res = await getSalesNumSumByItemAndQuarterGroupBySalesman(itemCode, quarter, year);
            setData(res.data);
        };
        fetchData();
    }, [itemCode, quarter, year]);

    const option = {
        title: {
            text: `${year}年Q${quarter} - ${itemCode}销售员销售占比`,
            left: 'center',
            textStyle: {
                color: '#ffffff'
            }
        },
        tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
            orient: 'vertical',
            left: 'left',
            textStyle: {
                color: '#ffffff'
            }
        },
        series: [
            {
                name: '销售占比',
                type: 'pie',
                radius: '50%',
                data: data.map(item => ({
                    value: item.saleNumSum,
                    name: item.salesmanName
                })),
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                },
                label: {
                    color: '#ffffff'
                }
            }
        ]
    };

    return (
        <div className="salesman-share">
            <EChartsReact
                option={option}
                theme={benewake}
                style={{ height: '400px', width: '100%' }}
            />
        </div>
    );
};

export default SalesmanShare;

