import React from 'react';
import { useTableStatesContext } from "../../hooks/useCustomContext";
import EChartsReact from "echarts-for-react";
import benewake from '../../echarts-theme/benewake.json';

const getSeasonalMarketData = (rows) => {
    console.log("11111")
    const { rowSelection } = useTableStatesContext();

    // 过滤出选中的行
    const selectedRows = rows.filter((row, index) => rowSelection[index]);

    // 如果没有选中的行，返回null
    if (selectedRows.length === 0) return null;

    // 获取第一个选中行的物料编码
    const targetItemCode = selectedRows[0].itemCode;

    // 过滤出所有与目标物料编码相同的行
    const targetRows = rows.filter(row => row.itemCode === targetItemCode);

    // 整理数据：按年度和季度排序
    const sortedData = targetRows
        .sort((a, b) => (a.saleYear - b.saleYear) || (a.saleQuarter - b.saleQuarter));

    // 准备图表数据
    const xAxisData = sortedData.map(item => `${item.saleYear}Q${item.saleQuarter}`);
    const seriesData = sortedData.map(item => item.quarterItemSaleNum);

    const option = {
        title: {
            text: `${sortedData[0].itemName} (${targetItemCode}) 季度销售趋势`,
            left: 'center'
        },
        tooltip: {
            trigger: "axis",
        },
        xAxis: {
            type: 'category',
            data: xAxisData,
            boundaryGap: false,
        },
        yAxis: {
            type: 'value',
            name: '季度销售量'
        },
        series: [
            {
                name: '季度销售量',
                type: 'line',
                data: seriesData,
                areaStyle: {}
            }
        ]
    };

    return option;
};

const SeasonalMarketChart = ({ rows }) => {
    const option = getSeasonalMarketData(rows);

    if (!option) {
        return <div>请选择要分析的物料</div>;
    }

    return (
        <EChartsReact
            option={option}
            theme={benewake}
            style={{ height: '400px', width: '100%' }}
        />
    );
};

export default SeasonalMarketChart;