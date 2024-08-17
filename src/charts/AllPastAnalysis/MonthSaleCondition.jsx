import React, { useState, useEffect, useMemo, useCallback } from 'react'
import EChartsReact from 'echarts-for-react'
import benewake from '../../echarts-theme/benewake.json'
import { getMonthSaleConditionByItemCodeList } from '../../api/dashBoard'
import NumbersIcon from '@mui/icons-material/Numbers'
const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}
import { Box, Tooltip } from '@mui/material'

const MonthSaleCondition = ({
    itemCodeList,
    itemNameList,
    quartersList = []
}) => {
    const [data, setData] = useState([])
    const [showNumbers, setShowNumbers] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            const res = await getMonthSaleConditionByItemCodeList(itemCodeList)
            setData(res)
        }
        fetchData()
    }, [itemCodeList])

    const getOption = useCallback(() => {
        let filteredData = data
        if (quartersList.length > 0) {
            filteredData = data.filter((item) => {
                const [year, month] = item.saleTime.split('-')
                const quarter = `${year}Q${Math.ceil(parseInt(month) / 3)}`
                return quartersList.includes(quarter)
            })
        }
        const xAxisData = [
            ...new Set(filteredData.map((item) => item.saleTime))
        ]
        // 处理x轴标签和年份分隔线
        const xAxisLabels = []
        const splitLines = []
        let currentYear = null

        xAxisData.forEach((time, index) => {
            const [year, month] = time.split('-')
            if (!quartersList.length) {
                if (year !== currentYear) {
                    currentYear = year
                    xAxisLabels.push(`${month}\n \n|\n\n${year}`)
                    if (index > 0) {
                        splitLines.push({
                            value: index,
                            lineStyle: { color: '#ffffff', type: 'dashed' }
                        })
                    }
                } else {
                    xAxisLabels.push(`${month}`)
                }
            } else {
                xAxisLabels.push(`${year}年${parseInt(month)}月`)
            }
        })
        const seriesData = itemCodeList.map((itemCode) => ({
            name:
                data.find((item) => item.itemCode === itemCode)?.itemName ||
                itemCode,
            type: 'bar',
            data: xAxisData.map(
                (time) =>
                    data.find(
                        (item) =>
                            item.itemCode === itemCode && item.saleTime === time
                    )?.saleNum || 0
            ),
            label: {
                show: showNumbers,
                color: '#ffffff',
                position: 'top',
                formatter: function (params) {
                    return formatNumber(params.value)
                }
            }
        }))

        return {
            title: {
                // text: `月度销售情况 - ${itemCodeList[0]} - ${itemNameList[0]}${
                //     quartersList.length > 0 ? ` ${quartersList.join(', ')}` : ''
                // }`,
                text: `${
                    quartersList.length > 0
                        ? `${quartersList.join(', ')}季度 -`
                        : ''
                } ${itemCodeList[0]} - ${itemNameList[0]} 月度销售情况`,
                left: 'center',
                textStyle: {
                    color: '#ffffff'
                }
            },
            tooltip: {
                trigger: 'item',
                axisPointer: {
                    type: 'shadow'
                }
            },
            xAxis: {
                type: 'category',
                data: xAxisLabels,
                axisLabel: {
                    color: '#ffffff',
                    interval: 0
                }
            },
            yAxis: {
                type: 'value',
                name: `月度销售量`,
                axisLabel: {
                    color: '#ffffff',
                    formatter: (value) => formatNumber(value)
                },
                nameTextStyle: {
                    color: '#ffffff'
                }
            },
            series: seriesData
        }
    }, [data, showNumbers, quartersList])

    return (
        <>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    alignItems: 'center'
                }}
            >
                <Tooltip title="显示/隐藏数值">
                    <NumbersIcon
                        onClick={() => setShowNumbers(!showNumbers)}
                        sx={{
                            color: showNumbers ? '#4caf50' : '#ffffff',
                            marginLeft: '4px'
                        }}
                    />
                </Tooltip>
            </Box>
            <EChartsReact
                option={getOption()}
                theme={benewake}
                style={{ height: '400px', width: '100%' }}
            />
        </>
    )
}

export default MonthSaleCondition
