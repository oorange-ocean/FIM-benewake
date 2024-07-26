import React, { useState, useEffect } from 'react';
import EChartsReact from "echarts-for-react";
import benewake from '../../echarts-theme/benewake.json';
import { fetchAnalysisData } from "../../api/analysis";
import DataList from '../../components/DataList';

const getSeasonalMarketData = (rows, targetItemCode) => {
    // 如果没有选中的行，返回默认物料编码
    if (!targetItemCode) {
        targetItemCode = "13.01.02.023";
    }
    // 过滤出所有与目标物料编码相同的行
    const targetRows = rows.filter(row => row.itemCode === targetItemCode);
    // 整理数据：按年度和季度排序
    const sortedData = targetRows.sort((a, b) => (a.saleYear - b.saleYear) || (a.saleQuarter - b.saleQuarter));

    // 准备图表数据
    const xAxisData = sortedData.map(item => `${item.saleYear}Q${item.saleQuarter}`);
    const seriesData = sortedData.map(item => item.quarterItemSaleNum);

    const option = {
        title: {
            text: sortedData.length > 0 ?
                ` 季度销售现况表 - ${targetItemCode} - ${sortedData[0].itemName}` :
                '暂无数据',
            left: 'center',
            textStyle: {
                color: '#ffffff'  // 设置标题文字颜色为白色
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
                color: '#ffffff'  // 设置x轴标签文字颜色为白色
            }
        },
        yAxis: {
            type: 'value',
            name: '季度销售量',
            axisLabel: {
                color: '#ffffff'  // 设置y轴标签文字颜色为白色
            },
            nameTextStyle: {
                color: '#ffffff'  // 设置y轴名称文字颜色为白色
            }
        },
        series: [
            {
                name: '季度销售量',
                type: 'bar',
                data: seriesData.length > 0 ? seriesData : [],
                barWidth: '60%'
            }
        ]
    };
    return option;
};

const SeasonalMarketChart = ({ rows }) => {
    const [data, setData] = useState([]);
    const [targetItemCode, setTargetItemCode] = useState("13.01.02.023")

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

    const option = getSeasonalMarketData(data, targetItemCode);

    return (
        <div className='bar3 span4 seasonalMarket'>
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
                    marginBottom: '10px'
                }}
            />
            <EChartsReact
                option={option}
                theme={benewake}
                style={{ height: '400px', width: '100%' }}
            />
        </div>
    );
};

export default SeasonalMarketChart;