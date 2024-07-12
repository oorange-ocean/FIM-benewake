// Column的格式：[
//     {
//         "id": "itemCode",
//         "header": "物料编码",
//         "accessorKey": "itemCode",
//         "size": 150
//     },

// ]
// schema的格式[
//     {
//         "cn": "客户名称",
//         "eng": "customerName",
//         "width": 460
//     },
// ]
//将column转换为schema
function columnToSchema(column) {
    return column.map((c) => {
        return {
            cn: c.header,
            eng: c.accessorKey,
            width: c.size
        }
    })
}

export default columnToSchema;