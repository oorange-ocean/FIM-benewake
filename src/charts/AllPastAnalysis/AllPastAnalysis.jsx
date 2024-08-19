import React, { useState, useEffect, useMemo, useCallback } from 'react'
import EChartsReact from 'echarts-for-react'
import {
    Button,
    Dialog,
    DialogContent,
    DialogActions,
    Checkbox,
    FormControlLabel,
    Card,
    CardContent,
    Box,
    IconButton,
    Typography,
    Tooltip
} from '@mui/material'
import FilterListIcon from '@mui/icons-material/FilterList'
import NumbersIcon from '@mui/icons-material/Numbers'
import Navigation from '../Navigation'
import {
    getAnalysisOneByItemAndSalesmanIn,
    getItemByCodeLike,
    getSalesmanByNameLike
} from '../../api/dashBoard'
import benewake from '../../echarts-theme/benewake.json'
import CustomSelect from './CustomSelect'
import SalesmanShareOverview from '../SalesmanShareOverview'
import MonthSaleCondition from '../MonthSale'
import MonthDetailOrder from '../MonthDetailOrder'
const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

const AllPastAnalysis = () => {
    const [salesmen, setSalesmen] = useState([])
    const [items, setItems] = useState([])
    const [selectedSalesmen, setSelectedSalesmen] = useState([])
    const [selectedItems, setSelectedItems] = useState([])
    const [data, setData] = useState([])
    const [showTotalSales, setShowTotalSales] = useState(false)
    const [showMonthlyAverage, setShowMonthlyAverage] = useState(true)
    const [openItemModal, setOpenItemModal] = useState(false)
    const [openSalesmanModal, setOpenSalesmanModal] = useState(false)
    const [showNumbers, setShowNumbers] = useState(true)
    const [navigationStack, setNavigationStack] = useState(['main'])
    const [selectedOverviewData, setSelectedOverviewData] = useState(null)
    const [selectedItemCodes, setSelectedItemCodes] = useState([])
    const [selectedItemNames, setSelectedItemNames] = useState([])
    const [selectedMonth, setSelectedMonth] = useState(null)
    const [selectedYear, setSelectedYear] = useState(null)
    //初始化选中的销售员和物料编码
    useEffect(() => {
        const initSalesmen = async () => {
            const result = await getSalesmanByNameLike('')
            setSelectedSalesmen(result || [])
        }
        initSalesmen()
        const initItems = async () => {
            const result = await getItemByCodeLike('')
            setSelectedItems([result[1]] || [])
        }
        initItems()
    }, [])

    //更新数据
    useEffect(() => {
        fetchData()
        handleItemSearch('')
        handleSalesmanSearch('')
    }, [selectedSalesmen, selectedItems])

    //获取数据
    const fetchData = async () => {
        if (selectedSalesmen.length && selectedItems.length) {
            const result = await getAnalysisOneByItemAndSalesmanIn(
                selectedSalesmen.map((s) => s.salesmanName),
                selectedItems.map((i) => i.itemCode)
            )
            setData(result)
        } else {
            setData([])
        }
    }

    const handleDataClick = useCallback(
        (params) => {
            if (params.name === '月平均') {
                //根据seriesIndex获取itemCode
                const itemCode = data.find(
                    (d) => d.itemName === params.seriesName
                ).itemCode
                const itemName = data.find(
                    (d) => d.itemName === params.seriesName
                ).itemName
                setSelectedItemCodes([itemCode])
                setSelectedItemNames([itemName])
                setNavigationStack((prev) => [...prev, 'monthSaleCondition'])
            } else if (params.name === '总计' || params.seriesName) {
                const itemCode = params.seriesName
                    ? data.find((d) => d.itemName === params.seriesName)
                          .itemCode
                    : null
                const salesmanName = params.name !== '总计' ? params.name : null
                setSelectedOverviewData({ itemCode, salesmanName })
                setNavigationStack((prev) => [...prev, 'overview'])
            }
        },
        [data]
    )

    const handleSalesmanSearch = async (value) => {
        const result = await getSalesmanByNameLike(value)
        setSalesmen(result || [])
    }

    const handleItemSearch = async (value) => {
        const result = await getItemByCodeLike(value)
        setItems(result || [])
    }

    // 使用 useMemo 来优化图表选项的计算
    const chartOption = useMemo(() => {
        if (!data.length) return {}

        const salesmanNames = [
            ...new Set(data.map((item) => item.salesmanName))
        ]
        const itemNames = [...new Set(data.map((item) => item.itemName))]

        let series = itemNames.map((itemName) => ({
            name: itemName,
            type: 'bar',
            data: salesmanNames.map((salesmanName) => {
                const item = data.find(
                    (d) =>
                        d.salesmanName === salesmanName &&
                        d.itemName === itemName
                )
                return item ? item.salesmanSaleNum : '-'
            }),
            barMinHeight: 5,
            label: {
                show: showNumbers,
                position: 'top',
                formatter: (params) => {
                    if (params.name === '总计' || params.name === '月平均') {
                        return formatNumber(params.value)
                    }
                    const item = data.find(
                        (d) =>
                            d.salesmanName === params.name &&
                            d.itemName === params.seriesName
                    )
                    return item ? `${formatNumber(params.value)}` : ''
                },
                color: '#ffffff'
            }
        }))

        let xAxisData = [...salesmanNames]

        if (showTotalSales) {
            series.forEach((s) => {
                const totalSales = s.data.reduce((sum, val) => sum + val, 0)
                s.data.push(totalSales)
            })
            xAxisData.push('总计')
        }

        if (showMonthlyAverage) {
            series.forEach((s, index) => {
                const monthlyAverage =
                    data.find((d) => d.itemName === s.name)?.monthAvg || 0
                s.data.push(monthlyAverage)
            })
            xAxisData.push('月平均')
        }

        return {
            legend: {
                show: true,
                textStyle: { color: '#ffffff' },
                formatter: (name) => {
                    const item = data.find((d) => d.itemName === name)
                    return item ? `${item.itemCode} - ${item.itemName}` : ''
                }
            },
            tooltip: { trigger: 'item' },
            xAxis: {
                type: 'category',
                data: xAxisData,
                axisLabel: { interval: 0, rotate: 45, color: '#ffffff' }
            },
            yAxis: [
                {
                    type: 'value',
                    name: '销售数量',
                    axisLabel: { color: '#ffffff' },
                    nameTextStyle: { color: '#ffffff' }
                }
            ],
            series
        }
    }, [data, showTotalSales, showMonthlyAverage, showNumbers])

    const renderPages = {
        main: () => (
            <Box
                sx={{
                    backgroundColor: '#022859',
                    color: '#ffffff',
                    padding: 2
                }}
            >
                <Box display="flex" justifyContent="flex-start" mb={2}>
                    <Button
                        variant="outlined"
                        onClick={() => setOpenItemModal(true)}
                        startIcon={<FilterListIcon />}
                        sx={{ color: '#ffffff', borderColor: '#ffffff' }}
                    >
                        物料编码
                    </Button>
                </Box>

                <Card sx={{ backgroundColor: '#022859', boxShadow: 'none' }}>
                    <CardContent>
                        <Box
                            display="flex"
                            justifyContent="space-between"
                            mb={2}
                        >
                            <Box>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={showTotalSales}
                                            onChange={(e) =>
                                                setShowTotalSales(
                                                    e.target.checked
                                                )
                                            }
                                            sx={{
                                                color: '#ffffff',
                                                '&.Mui-checked': {
                                                    color: '#ffffff'
                                                },
                                                '& .MuiSvgIcon-root': {
                                                    // 添加这个样式
                                                    fill: '#ffffff'
                                                }
                                            }}
                                        />
                                    }
                                    label={
                                        <Typography
                                            style={{ color: '#ffffff' }}
                                        >
                                            显示物料销售总额
                                        </Typography>
                                    }
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={showMonthlyAverage}
                                            onChange={(e) =>
                                                setShowMonthlyAverage(
                                                    e.target.checked
                                                )
                                            }
                                            sx={{
                                                color: '#ffffff',
                                                '&.Mui-checked': {
                                                    color: '#ffffff'
                                                },
                                                '& .MuiSvgIcon-root': {
                                                    // 添加这个样式
                                                    fill: '#ffffff'
                                                }
                                            }}
                                        />
                                    }
                                    label={
                                        <Typography
                                            style={{ color: '#ffffff' }}
                                        >
                                            显示产品月平均
                                        </Typography>
                                    }
                                />
                            </Box>
                            <Tooltip title="显示/隐藏数值">
                                <NumbersIcon
                                    onClick={() => setShowNumbers(!showNumbers)}
                                    sx={{
                                        color: showNumbers
                                            ? '#4caf50'
                                            : '#ffffff',
                                        marginLeft: '4px'
                                    }}
                                />
                            </Tooltip>
                        </Box>
                        <EChartsReact
                            option={chartOption}
                            theme={benewake}
                            notMerge={true}
                            style={{ height: '400px', width: '100%' }}
                            onEvents={{ click: handleDataClick }}
                            opts={{ renderer: 'svg' }}
                        />
                    </CardContent>
                </Card>

                <Box display="flex" justifyContent="flex-start" mt={2}>
                    <Button
                        variant="outlined"
                        onClick={() => setOpenSalesmanModal(true)}
                        startIcon={<FilterListIcon />}
                        sx={{ color: '#ffffff', borderColor: '#ffffff' }}
                    >
                        销售员
                    </Button>
                </Box>

                <Dialog
                    open={openItemModal}
                    onClose={() => setOpenItemModal(false)}
                    PaperProps={{
                        style: {
                            position: 'absolute',
                            left: '20px',
                            top: '60px',
                            backgroundColor: '#022859',
                            border: '1px solid #0CF2F2',
                            borderRadius: '10px',
                            color: '#ffffff',
                            boxShadow: '0 0 20px rgba(12, 242, 242, 0.3)'
                        }
                    }}
                >
                    {/* <DialogTitle>选择物料编码</DialogTitle> */}
                    <DialogContent>
                        <CustomSelect
                            options={items.map((item) => ({
                                value: item.itemCode,
                                label: item.itemName
                            }))}
                            selectedOptions={selectedItems.map(
                                (item) => item.itemCode
                            )}
                            onOptionChange={(newSelected) => {
                                setSelectedItems(
                                    items.filter((item) =>
                                        newSelected.includes(item.itemCode)
                                    )
                                )
                            }}
                            onSearch={handleItemSearch}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button
                            sx={{ color: '#ffffff' }}
                            onClick={() => setOpenItemModal(false)}
                        >
                            取消
                        </Button>
                        <Button
                            sx={{ color: '#ffffff' }}
                            onClick={() => setOpenItemModal(false)}
                        >
                            确定
                        </Button>
                    </DialogActions>
                </Dialog>

                <Dialog
                    open={openSalesmanModal}
                    onClose={() => setOpenSalesmanModal(false)}
                    PaperProps={{
                        style: {
                            position: 'absolute',
                            left: '20px',
                            bottom: '60px',
                            backgroundColor: '#022859',
                            border: '1px solid #0CF2F2',
                            borderRadius: '10px',
                            color: '#ffffff',
                            boxShadow: '0 0 20px rgba(12, 242, 242, 0.3)'
                        }
                    }}
                >
                    <DialogContent>
                        <CustomSelect
                            options={salesmen.map((salesman) => ({
                                value: salesman.salesmanName,
                                label: salesman.salesmanName
                            }))}
                            selectedOptions={selectedSalesmen.map(
                                (salesman) => salesman.salesmanName
                            )}
                            onOptionChange={(newSelected) =>
                                setSelectedSalesmen(
                                    salesmen.filter((salesman) =>
                                        newSelected.includes(
                                            salesman.salesmanName
                                        )
                                    )
                                )
                            }
                            onSearch={handleSalesmanSearch}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button
                            onClick={() => setOpenSalesmanModal(false)}
                            sx={{ color: '#ffffff' }}
                        >
                            取消
                        </Button>
                        <Button
                            onClick={() => setOpenSalesmanModal(false)}
                            sx={{ color: '#ffffff' }}
                        >
                            确定
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        ),
        overview: () => (
            <SalesmanShareOverview
                itemCode={selectedOverviewData.itemCode}
                itemName={
                    data.find(
                        (d) => d.itemCode === selectedOverviewData.itemCode
                    ).itemName
                }
                salesmanName={selectedOverviewData.salesmanName}
            />
        ),
        monthSaleCondition: () => (
            <MonthSaleCondition
                itemCodeList={selectedItemCodes}
                itemNameList={selectedItemNames}
                setNavigationStack={setNavigationStack}
                setSelectedMonth={setSelectedMonth}
                setSelectedYear={setSelectedYear}
            />
        ),
        monthDetailOrder: () => (
            <MonthDetailOrder
                itemCode={selectedItemCodes[0]}
                itemName={selectedItemNames[0]}
                month={selectedMonth}
                year={selectedYear}
            />
        )
    }

    return (
        <Navigation
            navigationStack={navigationStack}
            setNavigationStack={setNavigationStack}
            renderPages={renderPages}
        />
    )
}

export default AllPastAnalysis
