//SeasonalMarket.jsx 季度销售情况分析表
import React, { useState, useEffect } from 'react'
import EChartsReact from 'echarts-for-react'
import benewake from '../../echarts-theme/benewake.json'
import { fetchAnalysisData } from '../../api/analysis'
import DataList from '../../components/DataList'
import { Tooltip, Button } from '@mui/material'
import SeasonalMarketDetailOrder from '../MonthDetailOrder'
import SalesmanShare from './QuarterSalesmanShare'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import ShowChartIcon from '@mui/icons-material/ShowChart'
import BarChartIcon from '@mui/icons-material/BarChart'
import NumbersIcon from '@mui/icons-material/Numbers'
import SalesmanShareOverview from '../SalesmanShareOverview'
import Navigation from '../Navigation' // 导入新的 Navigation 组件
import MonthSaleCondition from '../MonthSale'
import MonthDetailOrder from '../MonthDetailOrder'
const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

const getSeasonalMarketData = (
    rows,
    targetItemCode,
    showNumbers,
    chartType,
    showMonthlyAverage
) => {
    if (!targetItemCode) {
        targetItemCode = '13.01.02.023'
    }
    const targetRows = rows.filter((row) => row.itemCode === targetItemCode)
    const sortedData = targetRows.sort(
        (a, b) => a.saleYear - b.saleYear || a.saleQuarter - b.saleQuarter
    )

    let xAxisData = sortedData.map(
        (item) => `${item.saleYear}Q${item.saleQuarter}`
    )
    let seriesData = sortedData.map((item) => item.quarterItemSaleNum)

    if (showMonthlyAverage) {
        const monthlyAverage =
            sortedData.length > 0 &&
            sortedData[0] &&
            sortedData[0].monthAvg !== undefined
                ? sortedData[0].monthAvg
                : 0 // 或者使用其他适当的默认值
        xAxisData.push('月平均')
        seriesData.push(monthlyAverage)
    }

    const option = {
        title: {
            text:
                sortedData.length > 0
                    ? `${targetItemCode} - ${sortedData[0].itemName}`
                    : '暂无数据',
            left: 'center',
            textStyle: {
                color: '#ffffff'
            }
        },
        tooltip: {
            trigger: 'axis'
        },
        xAxis: {
            type: 'category',
            data: xAxisData.length > 0 ? xAxisData : ['Q1', 'Q2', 'Q3', 'Q4'],
            boundaryGap: true,
            axisTick: {
                alignWithLabel: true
            },
            axisLabel: {
                color: '#ffffff'
            }
        },
        yAxis: {
            type: 'value',
            name: '季度销售量',
            axisLabel: {
                color: '#ffffff'
            },
            nameTextStyle: {
                color: '#ffffff'
            }
        },
        series: [
            {
                name: '季度销售量',
                type: chartType,
                data: seriesData.length > 0 ? seriesData : [],
                barWidth: '60%',
                label: {
                    show: showNumbers,
                    position: 'top',
                    textStyle: {
                        color: '#ffffff'
                    },
                    formatter: function (params) {
                        return formatNumber(params.value)
                    }
                }
            }
        ]
    }
    return option
}

const SeasonalMarketChart = ({ rows }) => {
    const [data, setData] = useState([])
    const [targetItemCode, setTargetItemCode] = useState('13.01.02.023')
    const [showNumbers, setShowNumbers] = useState(true)
    const [chartType, setChartType] = useState('bar')
    const [selectedQuarter, setSelectedQuarter] = useState(null)
    const [selectedYear, setSelectedYear] = useState(null)
    const [navigationStack, setNavigationStack] = useState(['main'])
    const [showMonthlyAverage, setShowMonthlyAverage] = useState(true)
    const [selectedMonth, setSelectedMonth] = useState(null)
    useEffect(() => {
        const fetchData = async () => {
            if (!rows) {
                const res = await fetchAnalysisData(
                    'getAllQuarterlySellingCondition',
                    { pageNum: 1, pageSize: 2147483647 }
                )
                setData(res.data.records)
            } else {
                setData(rows)
            }
        }
        fetchData()
    }, [rows])
    const handleChange = (key, value) => {
        setTargetItemCode(value[0] || '')
    }

    const toggleShowNumbers = () => {
        setShowNumbers(!showNumbers)
    }

    const toggleChartType = () => {
        setChartType(chartType === 'bar' ? 'line' : 'bar')
    }

    const handleBarClick = (params) => {
        const [year, quarter] = params.name.split('Q')
        setSelectedYear(year)
        setSelectedQuarter(quarter)
        setNavigationStack([...navigationStack, 'monthSaleCondition'])
    }

    const renderPages = {
        main: (navigateTo) => {
            const option = getSeasonalMarketData(
                data,
                targetItemCode,
                showNumbers,
                chartType,
                showMonthlyAverage
            )
            option.series[0].itemStyle = {
                ...option.series[0].itemStyle,
                cursor: 'pointer'
            }
            return (
                <>
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            marginBottom: '10px'
                        }}
                    >
                        <ArrowDropDownIcon
                            style={{
                                pointerEvents: 'none',
                                transform: 'rotate(270deg)'
                            }}
                        />
                        <DataList
                            type="item"
                            searchKey="itemCode"
                            initialValue={'13.01.02.023'}
                            handleChange={handleChange}
                            identifier="materialCode"
                            style={{
                                backgroundColor: '#000000',
                                padding: '10px',
                                borderRadius: '5px',
                                marginLeft: '5px'
                            }}
                        />
                        <Tooltip title="显示/隐藏数值">
                            <NumbersIcon
                                onClick={toggleShowNumbers}
                                style={{
                                    cursor: 'pointer',
                                    marginLeft: '10px',
                                    color: showNumbers ? '#4CAF50' : '#ffffff'
                                }}
                            />
                        </Tooltip>
                        <Tooltip
                            title={
                                chartType === 'bar'
                                    ? '切换为折线图'
                                    : '切换为柱状图'
                            }
                        >
                            {chartType === 'bar' ? (
                                <ShowChartIcon
                                    onClick={toggleChartType}
                                    style={{
                                        cursor: 'pointer',
                                        marginLeft: '10px',
                                        color: '#ffffff'
                                    }}
                                />
                            ) : (
                                <BarChartIcon
                                    onClick={toggleChartType}
                                    style={{
                                        cursor: 'pointer',
                                        marginLeft: '10px',
                                        color: '#ffffff'
                                    }}
                                />
                            )}
                        </Tooltip>
                    </div>
                    <EChartsReact
                        option={option}
                        theme={benewake}
                        style={{ height: '400px', width: '100%' }}
                        onEvents={{
                            click: handleBarClick
                        }}
                        opts={{ renderer: 'svg' }}
                    />
                    <Button
                        onClick={() => navigateTo('salesmanShareOverview')}
                        style={{ marginTop: '10px' }}
                    >
                        查看销售员占比
                    </Button>
                </>
            )
        },
        detail: (navigateTo) => (
            <>
                <SeasonalMarketDetailOrder
                    itemCode={targetItemCode}
                    quarter={selectedQuarter}
                    year={selectedYear}
                />
                <Button
                    onClick={() => navigateTo('salesmanShare')}
                    style={{ marginTop: '10px' }}
                >
                    查看销售员占比
                </Button>
            </>
        ),
        salesmanShare: () => (
            <SalesmanShare
                itemCode={targetItemCode}
                quarter={selectedQuarter}
                year={selectedYear}
            />
        ),
        salesmanShareOverview: () => (
            <SalesmanShareOverview
                itemCode={targetItemCode}
                itemName={
                    data.find((d) => d.itemCode === targetItemCode).itemName
                }
            />
        ),
        monthSaleCondition: () => (
            <MonthSaleCondition
                itemCodeList={[targetItemCode]}
                itemNameList={[
                    data.find((d) => d.itemCode === targetItemCode)?.itemName ||
                        ''
                ]}
                setSelectedMonth={setSelectedMonth}
                setSelectedYear={setSelectedYear}
                // quartersList={[`${selectedYear}Q${selectedQuarter}`]}
                quartersList={
                    selectedYear && selectedQuarter
                        ? [`${selectedYear}Q${selectedQuarter}`]
                        : []
                }
                setNavigationStack={setNavigationStack}
            />
        ),
        monthDetailOrder: () => (
            <MonthDetailOrder
                itemCode={targetItemCode}
                itemName={
                    data.find((d) => d.itemCode === targetItemCode)?.itemName ||
                    ''
                }
                month={selectedMonth}
                year={selectedYear}
            />
        )
    }

    return (
        <div className="bar3 span4 seasonalMarket">
            <Navigation
                navigationStack={navigationStack}
                setNavigationStack={setNavigationStack}
                renderPages={renderPages}
            />
        </div>
    )
}

export default SeasonalMarketChart
