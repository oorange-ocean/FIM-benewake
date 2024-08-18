import Bar1 from '../charts/mock/bar1'
import Bar2 from '../charts/mock/bar2'
import Bar3 from '../charts/mock/bar3'
import Line1 from '../charts/mock/line1'
import Pie1 from '../charts/mock/pie1'
import Area1 from '../charts/mock/area1'
import DataPoint from '../charts/mock/data-point'
import SeasonalMarketChart from '../charts/SeasonalMarket/SeasonalMarket'
export default function Charts() {
    return (
        <>
            <div className="container data-module">
                <SeasonalMarketChart />
                {/* <Bar1 />
                <Bar2 />
                <Bar3 />
                <DataPoint description="订单及时交付率" value="98.6%" />
                <DataPoint description="订单及时交付率" value="98.6%" />
                <Pie1 />
                <Area1 /> */}
            </div>
        </>
    )
}
