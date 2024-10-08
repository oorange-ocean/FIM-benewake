import { snakeToCamelCase } from '../../js/transformType'
const createAnalysisDef = (header, id, size = 80) => ({
    id: snakeToCamelCase(id),
    header,
    accessorKey: snakeToCamelCase(id),
    size
})

const analysisDefs = [
    // createAnalysisDef('序号', 'serial_num', 50),
    createAnalysisDef('物料编码', 'item_code', 150),
    createAnalysisDef('物料名称', 'item_name', 220),
    createAnalysisDef('年', 'sale_year'),
    createAnalysisDef('季度', 'sale_quarter'),
    createAnalysisDef('季度销量', 'quarter_item_sale_num'),
    createAnalysisDef('销售员产品销售占比', 'sales_share', 140),
    createAnalysisDef('季度平均', 'quarter_avg'),
    createAnalysisDef('产品月平均', 'month_avg'),
    createAnalysisDef('大于百分比之和', 'over_line_percentage', 100),
    createAnalysisDef('大于百分比个数', 'over_line_num', 100),
    createAnalysisDef('剩余百分比', 'rest_percentage'),
    createAnalysisDef('剩余个数', 'rest_num'),
    createAnalysisDef('月度平均比例', 'month_avg_proportion'),
    createAnalysisDef('客户名称', 'customer_name', 220),
    createAnalysisDef('销售员', 'salesman_name', 100),
    createAnalysisDef('日期', 'sale_time', 100),
    createAnalysisDef('销售数量', 'sale_num', 100),
    createAnalysisDef('订单金额', 'order_amount', 100),
    createAnalysisDef('是否为重要客户', 'is_yellow', 100),
    createAnalysisDef('是否为重要客户', 'one_is_yellow', 100),
    createAnalysisDef('客户', 'customer'),
    createAnalysisDef('次数', 'sale_times'),
    createAnalysisDef('客户购买总额', 'total_customer_item_num'),
    createAnalysisDef('销售员产品销售总额', 'salesman_sale_num', 140),
    createAnalysisDef('产品销售总额', 'total_item', 100),
    createAnalysisDef('产品销售总额', 'itemSaleNum', 100),
    createAnalysisDef('客户购买占比', 'customer_proporation'),
    createAnalysisDef('大于比值个数', 'over_proportion_num'),
    createAnalysisDef('客户类型', 'customer_type'),
    createAnalysisDef('有效月份', 'total_months'),
    createAnalysisDef('最大值', 'max'),
    createAnalysisDef('客户类型转换', 'customerTypeRevise', 100),
    createAnalysisDef('订单编码', 'order_code', 150)
]

export default analysisDefs
