//SeasonalMarket.jsx 季度销售情况分析表
import React, { useState, useEffect } from 'react';
import EChartsReact from "echarts-for-react";
import benewake from '../../echarts-theme/benewake.json';
import { fetchAnalysisData } from "../../api/analysis";
import DataList from '../../components/DataList';
import { Tooltip, Button } from '@mui/material';
import SeasonalMarketDetailOrder from './SeasonalMarketDetailOrder';
import SalesmanShare from './QuarterSalesmanShare';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import BarChartIcon from '@mui/icons-material/BarChart';
import NumbersIcon from '@mui/icons-material/Numbers';
import SalesmanShareOverview from './SalesmanShareOverview';

const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};


const getSeasonalMarketData = (rows, targetItemCode, showNumbers, chartType) => {
    if (!targetItemCode) {
        targetItemCode = "13.01.02.023";
    }
    const targetRows = rows.filter(row => row.itemCode === targetItemCode);
    const sortedData = targetRows.sort((a, b) => (a.saleYear - b.saleYear) || (a.saleQuarter - b.saleQuarter));

    const xAxisData = sortedData.map(item => `${item.saleYear}Q${item.saleQuarter}`);
    const seriesData = sortedData.map(item => item.quarterItemSaleNum);


    const option = {
        title: {
            text: sortedData.length > 0 ?
                ` 季度销售现况表 - ${targetItemCode} - ${sortedData[0].itemName}` :
                '暂无数据',
            left: 'center',
            textStyle: {
                color: '#ffffff'
            }
        },
        tooltip: {
            trigger: "axis",
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
                        return formatNumber(params.value);
                    }
                }
            }
        ]
    };
    return option;
};

const SeasonalMarketChart = ({ rows }) => {
    const [data, setData] = useState([]);
    const [targetItemCode, setTargetItemCode] = useState("13.01.02.023");
    const [showNumbers, setShowNumbers] = useState(false);
    const [chartType, setChartType] = useState('bar');
    const [showDetail, setShowDetail] = useState(false);
    const [showSalesmanShare, setShowSalesmanShare] = useState(false);
    const [selectedQuarter, setSelectedQuarter] = useState(null);
    const [selectedYear, setSelectedYear] = useState(null);
    const [navigationStack, setNavigationStack] = useState(['main']);

    useEffect(() => {
        const fetchData = async () => {
            if (!rows) {
                const res = await fetchAnalysisData("getAllQuarterlySellingCondition", { pageNum: 1, pageSize: 2147483647 });
                setData(res.data.records);
            } else {
                setData(rows);
            }
        };
        fetchData();
    }, [rows]);

    const handleChange = (key, value) => {
        setTargetItemCode(value[0] || "")
    }

    const toggleShowNumbers = () => {
        setShowNumbers(!showNumbers);
    }

    const toggleChartType = () => {
        setChartType(chartType === 'bar' ? 'line' : 'bar');
    }

    const handleBarClick = (params) => {
        const [year, quarter] = params.name.split('Q');
        setSelectedYear(year);
        setSelectedQuarter(quarter);
        setNavigationStack([...navigationStack, 'detail']);
    };

    const navigateTo = (page) => {
        setNavigationStack([...navigationStack, page]);
    };

    const navigateBack = () => {
        if (navigationStack.length > 1) {
            setNavigationStack(navigationStack.slice(0, -1));
        }
    };

    const getCurrentPage = () => navigationStack[navigationStack.length - 1];

    const renderMainPage = () => {
        const option = getSeasonalMarketData(data, targetItemCode, showNumbers, chartType);
        option.series[0].itemStyle = {
            ...option.series[0].itemStyle,
            cursor: 'pointer'
        };
        return (
            <>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                    <ArrowDropDownIcon style={{ pointerEvents: 'none', transform: 'rotate(270deg)' }} />
                    <DataList
                        type="item"
                        searchKey="itemCode"
                        initialValue={"13.01.02.023"}
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
                    <Tooltip title={chartType === 'bar' ? "切换为折线图" : "切换为柱状图"}>
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
                        'click': handleBarClick
                    }}
                />
                    <Button 
                    onClick={() => navigateTo('salesmanShareOverview')} 
                    style={{ marginTop: '10px' }}
                >
                    查看销售员占比
                </Button>
            </>
        );
    };

    const renderDetailPage = () => (
        <SeasonalMarketDetailOrder
            itemCode={targetItemCode}
            quarter={selectedQuarter}
            year={selectedYear}
        />
    );

    const renderSalesmanSharePage = () => (
        <SalesmanShare
            itemCode={targetItemCode}
            quarter={selectedQuarter}
            year={selectedYear}
        />
    );

    const renderSalesmanShareOverviewPage = () => (
        <SalesmanShareOverview
            itemCode={targetItemCode}
        />
    );

    return (
        <div className='bar3 span4 seasonalMarket'>
            {getCurrentPage() !== 'main' && (
                <Button startIcon={<ArrowBackIcon />} onClick={navigateBack} style={{ marginBottom: '10px' }}>
                    返回
                </Button>
            )}
            {getCurrentPage() === 'main' && renderMainPage()}
            {getCurrentPage() === 'detail' && (
                <>
                    {renderDetailPage()}
                    <Button onClick={() => navigateTo('salesmanShare')} style={{ marginTop: '10px' }}>
                        查看销售员占比
                    </Button>
                </>
            )}
            {getCurrentPage() === 'salesmanShare' && renderSalesmanSharePage()}
            {getCurrentPage() === 'salesmanShareOverview' && renderSalesmanShareOverviewPage()}
        </div>
    );
};

export default SeasonalMarketChart;