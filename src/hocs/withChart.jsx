import React from 'react'
import SeasonalMarket from '../charts/SeasonalMarket/SeasonalMarket'
import SalesAnalysisComponent from '../charts/AllPastAnalysis/AllPastAnalysis'

const chartComponents = {
    getAllQuarterlySellingCondition: SeasonalMarket,
    getAllPastAnalysis: SalesAnalysisComponent,
    //替换后的
    getAllSellingConditionReplaced: SalesAnalysisComponent,
    getAllQuarterlySellingConditionReplaced: SeasonalMarket
}

const withChart = (WrappedComponent) => {
    return (props) => {
        const ChartComponent = chartComponents[props.schema.select]
        return (
            <WrappedComponent
                {...props}
                ChartComponent={ChartComponent}
                chartComponents={chartComponents}
            />
        )
    }
}

export default withChart
