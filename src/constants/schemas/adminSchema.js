import api from '../../api/axios'
const adminSchema = {
    customerType: {
        cn: '客户类型',
        select: 'getCustomerTypes',
        add: {
            url: 'addCustomerType',
            bodyKeys: ['customerType']
        },
        delete: {
            url: 'deleteCustomerType',
            bodyKeys: ['customerType']
        },
        update: (oldData, newData) => ({
            url: 'customer/updateCustomerType',
            body: {
                oldCustomerType: oldData.customerType,
                newCustomerType: newData.customerType
            },
            type: 'json'
        })
    },
    inquiryType: {
        cn: '订单状态',
        select: 'selectInquiryTypeDic',
        add: {
            url: 'addInquiryType',
            bodyKeys: ['typeName']
        },
        delete: {
            url: 'deleteInquiryType',
            bodyKeys: ['inquiryTypeName']
        },
        update: (oldData, newData) => ({
            url: 'order/updateInquiryTypeDic',
            body: {
                inquiryType: newData.inquiryType,
                inquiryTypeName: newData.inquiryTypeName
            },
            type: 'json'
        })
    },
    itemType: {
        cn: '产品类型',
        add: {
            url: 'insertItemType',
            bodyKeys: ['itemTypeName']
        },
        delete: {
            url: 'deleteItemType',
            bodyKeys: ['itemTypeName']
        },
        select: 'selectItemTypeDic',
        update: (oldData, newData) => ({
            url: 'item/updateItemTypeDic',
            body: {
                itemType: newData.itemType,
                itemTypeName: newData.itemTypeName
            },
            type: 'json'
        })
    },
    customerName: {
        cn: '客户名称',
        add: {
            url: 'addCustomerName',
            bodyKeys: ['addCustomerName']
        },
        delete: {
            url: 'deleteCustomerName',
            bodyKeys: ['deleteCustomerName'],
            bodyValues: ['customerName']
        },
        select: 'selectFimCustomerTable',
        update: (oldData, newData) => ({
            url: 'admin/updateCustomerName',
            body: {
                oldCustomerName: oldData.customerName,
                newCustomerName: newData.customerName
            },
            type: 'form-data'
        }),
        filter: {
            url: '/customer/filter/customer'
        },
        exportTypeNum: 1
    },
    customerItem: {
        cn: '客户管理',
        select: 'selectFimCustomerTypeTable',
        delete: {
            url: 'deleteCustomerItem',
            bodyKeys: ['customerType', 'customerName', 'itemCode']
        },
        add: {
            url: 'insertCustomerItem',
            bodyKeys: ['customerType', 'customerName', 'itemCode']
        },
        // Added multi-condition filtering URL
        filter: {
            url: '/customer/filter/customerType'
        },
        exportTypeNum: 2,
        update: (oldData, newData) => ({
            url: 'admin/updateFimCustomerTypeTable',
            body: {
                customerName: newData.customerName,
                itemCode: newData.itemCode,
                customerType: newData.customerType
            },
            type: 'json'
        })
    },
    customerRename: {
        cn: '客户名称替换表',
        add: {
            url: 'addCustomerRename',
            bodyKeys: ['customerNameOld', 'customerNameNew']
        },
        delete: {
            url: 'deleteCustomerRenameByOldName',
            bodyKeys: ['customerNameOld']
        },
        select: 'selectFimPastCustomerRenameTable',
        update: (oldData, newData) => ({
            url: 'admin/updateCustomerRename',
            body: {
                customerNameOld: oldData.customerNameOld,
                customerNameNew: newData.customerNameNew
            },
            type: 'form-data'
        }),
        // Added multi-condition filtering URL
        filter: {
            url: '/customer/filter/customerRename'
        },
        exportTypeNum: 3
    },
    itemChange: {
        cn: '物料替换表',
        add: {
            url: 'addItemChange',
            bodyKeys: ['itemCodeOld', 'itemCodeNew']
        },
        delete: {
            url: 'deleteItemChangeByOldCode',
            bodyKeys: ['itemCodeOld']
        },
        update: (oldData, newData) => ({
            url: 'admin/updateItemChange',
            body: {
                itemCodeOld: oldData.itemCodeOld,
                itemCodeNew: newData.itemCodeNew
            },
            type: 'form-data'
        }),
        select: 'selectFimPastItemChangeTable',
        // Added multi-condition filtering URL
        filter: {
            url: '/item/filter/itemChange'
        },
        exportTypeNum: 4
    },
    salesmanChange: {
        cn: '销售员替换表',
        add: {
            url: 'addSalesmanChange',
            bodyKeys: ['salesmanNameOld', 'salesmanNameNew']
        },
        delete: {
            url: 'deleteSalesmanChangeByOldName',
            bodyKeys: ['salesmanNameOld']
        },
        update: (oldData, newData) => ({
            url: 'admin/updateSalesmanChange',
            body: {
                salesmanNameOld: oldData.salesmanNameOld,
                salesmanNameNew: newData.salesmanNameNew
            },
            type: 'form-data'
        }),
        select: 'selectFimPastSalesmanChangingTable',
        // Added multi-condition filtering URL
        filter: {
            url: '/admin/filter/salesmanChanging'
        },
        exportTypeNum: 5
    },
    customizedItemChange: {
        cn: '定制物料替换表',
        add: {
            url: 'addCustomizedItemChange',
            bodyKeys: ['customerName', 'itemNameOld', 'itemNameNew']
        },
        delete: {
            url: 'deleteCustomizedItemChange',
            bodyKeys: ['customerName', 'itemNameOld', 'itemNameNew']
        },
        select: 'selectFimPastCustomizedItemChangingTable'
    },
    pastChooseItem: {
        cn: '筛选物料表',
        add: {
            url: 'addPastChooseItem',
            bodyKeys: ['itemCode', 'itemName', 'startMonth']
        },
        delete: {
            url: 'deletePastChooseItemByItemCode',
            bodyKeys: ['itemCode', 'itemName', 'startMonth']
        },
        select: 'selectFimPastChooseItemTable',
        // Added multi-condition filtering URL
        filter: {
            url: '/item/filter/chooseItem'
        },
        exportTypeNum: 6,
        update: (oldData, newData) => ({
            url: 'admin/updateFimPastChooseItemTable',
            body: {
                itemCode: newData.itemCode,
                itemName: newData.itemName,
                startMonth: newData.startMonth
            },
            type: 'json'
        })
    },
    suspiciousData: {
        cn: '可疑数据标准表',
        add: {
            url: '/past-analysis/insertStandard',
            bodyKeys: ['itemCode', 'itemName', 'num']
        },
        delete: {
            url: 'deletePastChooseItemByItemCode',
            bodyKeys: ['itemCode', 'itemName', 'num']
        },
        select: 'suspiciousData',
        // Added multi-condition filtering URL
        filter: {
            url: '/past-analysis/getStandardsBySql'
        },
        exportTypeNum: 7,
        update: (oldData, newData) => ({
            url: 'past-analysis/updateStandards',
            body: {
                id: newData.id,
                standards: newData.num
            },
            type: 'form-data'
        })
    },
    materialType: {
        cn: '物料类型管理',
        add: {
            url: 'addFimItemTable',
            bodyKeys: ['itemCode', 'itemName', 'itemType', 'quantitative']
        },
        delete: {
            url: 'batchDeleteItems',
            bodyKeys: ['itemCode']
        },
        update: (oldData, newData) => ({
            url: 'item/updateItem',
            body: {
                itemCode: newData.itemCode,
                itemName: newData.itemName,
                itemTypeName: newData.itemTypeName,
                quantitative: newData.quantitative,
                itemId: newData.itemId
            },
            type: 'json'
        }),
        select: 'materialType',
        filter: {
            url: '/item/filter/itemType'
        }
    }
}

export default adminSchema
