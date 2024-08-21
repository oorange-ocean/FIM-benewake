import React, { useState, useEffect } from 'react'
import EChartsReact from 'echarts-for-react'
import benewake from '../echarts-theme/benewake.json'
import { getSalesNumSumByItemGroupBySalesman } from '../api/dashBoard'

const SalesmanShareOverview = ({ itemCode, itemName }) => {
    const [data, setData] = useState([])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getSalesNumSumByItemGroupBySalesman(
                    itemCode
                )
                setData(response.data)
            } catch (error) {
                console.error('Error fetching salesman share data:', error)
            }
        }

        fetchData()
    }, [itemCode])

    const getOption = () => {
        const salesmen = data.map((item) => item.salesmanName)
        const salesData = data.map((item) => item.saleNumSum)
        const totalSales = salesData.reduce((sum, value) => sum + value, 0)
        // 占比大于3%的数据
        const filteredData = salesmen
            .map((name, index) => ({
                value: salesData[index],
                name: name
            }))
            .filter((item) => item.value / totalSales > 0.03)
        return {
            title: {
                text: `${itemCode} - ${itemName}`,
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
                    radius: ['50%', '75%'], // 改为环形图

                    data: filteredData, // 使用过滤后的数据
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    },
                    label: {
                        color: '#ffffff',
                        formatter: '{b}: {d}%' // 显示百分比
                    }
                }
            ],
            graphic: {
                elements: [
                    {
                        type: 'text',
                        left: 'center',
                        top: 'center',
                        style: {
                            text: [
                                '总销售额',
                                '{b|' + totalSales.toLocaleString() + '}'
                            ].join('\n\n'),
                            textAlign: 'center',
                            rich: {
                                b: {
                                    fontSize: 28,
                                    fontWeight: 'bold',
                                    color: '#fac858'
                                }
                            },
                            fontSize: 16,
                            fill: '#ffffff'
                        }
                    }
                ]
            }
        }
    }

    return (
        <div>
            <EChartsReact
                option={getOption()}
                theme={benewake}
                style={{ height: '600px', width: '100%' }}
                opts={{ renderer: 'svg' }}
            />
        </div>
    )
}

export default SalesmanShareOverview
