import React, { useState, useEffect } from 'react';
import EChartsReact from 'echarts-for-react';
import benewake from '../../echarts-theme/benewake.json';
import { getSalesNumSumByItemGroupBySalesman } from '../../api/dashBoard';

const SalesmanShareOverview = ({ itemCode }) => {
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getSalesNumSumByItemGroupBySalesman(itemCode);
                setData(response.data);
            } catch (error) {
                console.error('Error fetching salesman share data:', error);
            }
        };

        fetchData();
    }, [itemCode]);

    const getOption = () => {
        const salesmen = data.map(item => item.salesmanName);
        const salesData = data.map(item => item.saleNumSum);

        return {
            title: {
                text: `销售员占比 - ${itemCode}`,
                left: 'center',
                textStyle: {
                    color: '#ffffff'
                }
            },
            tooltip: {
                trigger: 'item',
                formatter: '{a} <br/>{b} : {c} ({d}%)'
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
                    name: '销售量',
                    type: 'pie',
                    radius: '50%',
                    data: salesmen.map((name, index) => ({
                        value: salesData[index],
                        name: name
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
    };

    return (
        <div>
            <EChartsReact
                option={getOption()}
                theme={benewake}
                style={{ height: '400px', width: '100%' }}
            />
        </div>
    );
};

export default SalesmanShareOverview;