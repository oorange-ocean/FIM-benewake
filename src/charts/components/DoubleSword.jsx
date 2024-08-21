import React from 'react'
import ReactECharts from 'echarts-for-react'
import benewake from '../../echarts-theme/benewake.json'

const DoubleSidedBarChart = ({ data }) => {
    const option = {
        title: {
            // text: '物料月平均销量与总销量对比',
            left: 'center',
            textStyle: {
                color: '#ffffff'
            }
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        legend: {
            data: ['月平均', '总销量'],
            textStyle: {
                color: '#ffffff'
            }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: [
            {
                type: 'value',
                position: 'top',
                splitLine: {
                    lineStyle: {
                        type: 'dashed'
                    }
                },
                axisLabel: {
                    color: '#ffffff'
                }
            },
            {
                type: 'value',
                position: 'bottom',
                splitLine: {
                    lineStyle: {
                        type: 'dashed'
                    }
                },
                axisLabel: {
                    color: '#ffffff'
                }
            }
        ],
        yAxis: {
            type: 'category',
            axisLine: { show: false },
            axisLabel: { show: false },
            axisTick: { show: false },
            splitLine: { show: false },
            data: data.map((item) => item.itemName)
        },
        series: [
            {
                name: '月平均',
                type: 'bar',
                stack: 'Total',
                label: {
                    show: true,
                    formatter: '{b}',
                    color: '#ffffff'
                },
                data: data.map((item) => ({
                    value: item.monthlyAverage,
                    label: {
                        position: 'left'
                    }
                }))
            },
            {
                name: '总销量',
                type: 'bar',
                xAxisIndex: 1,
                label: {
                    show: true,
                    position: 'right',
                    color: '#ffffff'
                },
                data: data.map((item) => item.totalSales)
            }
        ]
    }

    return (
        <ReactECharts
            option={option}
            theme={benewake}
            style={{ height: '400px', width: '100%' }}
            opts={{ renderer: 'svg' }}
        />
    )
}

export default DoubleSidedBarChart
