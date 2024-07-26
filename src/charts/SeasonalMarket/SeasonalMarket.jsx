import React, { useState, useEffect } from 'react';
import EChartsReact from "echarts-for-react";
import benewake from '../../echarts-theme/benewake.json';
import { fetchAnalysisData } from "../../api/analysis";
import DataList from '../../components/DataList';
import { ArrowDropDown, ShowChart, BarChart, Numbers } from '@mui/icons-material';
import { Tooltip } from '@mui/material';

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

    const option = getSeasonalMarketData(data, targetItemCode, showNumbers, chartType);
    return (
        <div className='bar3 span4 seasonalMarket'>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                <ArrowDropDown
                    style={{
                        pointerEvents: 'none',
                        transform: 'rotate(270deg)'
                    }}
                />
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
                    <Numbers
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
                        <ShowChart
                            onClick={toggleChartType}
                            style={{
                                cursor: 'pointer',
                                marginLeft: '10px',
                                color: '#ffffff'
                            }}
                        />
                    ) : (
                        <BarChart
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
            />
        </div>
    );
};

export default SeasonalMarketChart;