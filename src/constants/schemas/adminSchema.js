const adminSchema = {
    customerType: {
        "cn": "客户类型",
        "select": "getCustomerTypes",
        "add": {
            url: "addCustomerType",
            bodyKeys: ["customerType"]
        },
        "delete": {
            url: "deleteCustomerType",
            bodyKeys: ["customerType"]
        }
    },
    inquiryType: {
        "cn": "订单状态",
        "select": "selectInquiryTypeDic",
        "add": {
            url: "addInquiryType",
            bodyKeys: ["typeName"]
        },
        "delete": {
            url: "deleteInquiryType",
            bodyKeys: ["typeName"]
        }
    },
    itemType: {
        "cn": "产品类型",
        "add": {
            url: "insertItemType",
            bodyKeys: ["itemTypeName"]
        },
        "delete": {
            url: "insertItemType",
            bodyKeys: ["itemTypeName"]
        },
        "select": "selectItemTypeDic"
    },
    customerName: {
        "cn": "客户名称",
        "add": {
            url: "addCustomerName",
            bodyKeys: ["addCustomerName"]
        },
        "delete": {
            url: "deleteCustomerName",
            bodyKeys: ["deleteCustomerName"],
            bodyValues: ["customerName"]
        },
        "select": "selectFimCustomerTable",
        "update": {
            url: "updateCustomerName",
            bodyKeys: ["oldCustomerName", "newCustomerName"]
        },
        // Added multi-condition filtering URL
        "filter": {
            url: "/customer/filter/customer"
        }
    },
    customerItem: {
        "cn": "客户管理",
        "select": "selectFimCustomerTypeTable",
        "delete": {
            url: "deleteCustomerItem",
            bodyKeys: ["customerType", "customerName", "itemCode"]
        },
        "add": {
            url: "insertCustomerItem",
            bodyKeys: ["customerType", "customerName", "itemCode"]
        },
        // Added multi-condition filtering URL
        "filter": {
            url: "/customer/filter/customerType"
        }
    },
    customerRename: {
        "cn": "客户名称替换表",
        "add": {
            url: "addCustomerRename",
            bodyKeys: ["customerNameOld", "customerNameNew"]
        },
        "delete": {
            url: "deleteCustomerRenameByOldName",
            bodyKeys: ["customerNameOld"]
        },
        "select": "selectFimPastCustomerRenameTable",
        "update": {
            url: "updateCustomerRename",
            bodyKeys: ["customerNameOld", "customerNameNew"]
        },
        // Added multi-condition filtering URL
        "filter": {
            url: "/customer/filter/customerRename"
        }
    },
    itemChange: {
        "cn": "物料替换表",
        "add": {
            url: "addItemChange",
            bodyKeys: ["itemCodeOld", "itemCodeNew"]
        },
        "delete": {
            url: "deleteItemChangeByOldCode",
            bodyKeys: ["itemCodeOld"]
        },
        "update": {
            url: "updateItemChange",
            bodyKeys: ["itemCodeOld", "itemCodeNew"]
        },
        "select": "selectFimPastItemChangeTable",
        // Added multi-condition filtering URL
        "filter": {
            url: "/item/filter/itemChange"
        }
    },
    salesmanChange: {
        "cn": "销售员替换表",
        "add": {
            url: "addSalesmanChange",
            bodyKeys: ["salesmanNameOld", "salesmanNameNew"]
        },
        "delete": {
            url: "deleteSalesmanChangeByOldName",
            bodyKeys: ["salesmanNameOld"]
        },
        "update": {
            url: "updateSalesmanChange",
            bodyKeys: ["salesmanNameOld", "salesmanNameNew"]
        },
        "select": "selectFimPastSalesmanChangingTable",
        // Added multi-condition filtering URL
        "filter": {
            url: "/admin/filter/salesmanChanging"
        }
    },
    customizedItemChange: {
        "cn": "定制物料替换表",
        "add": {
            url: "addCustomizedItemChange",
            bodyKeys: ["customerName", "itemNameOld", "itemNameNew"]
        },
        "delete": {
            url: "deleteCustomizedItemChange",
            bodyKeys: ["customerName", "itemNameOld", "itemNameNew"]
        },
        "select": "selectFimPastCustomizedItemChangingTable"
    },
    pastChooseItem: {
        "cn": "筛选物料表",
        "add": {
            url: "addPastChooseItem",
            bodyKeys: ["itemCode", "itemName", "startMonth"]
        },
        "delete": {
            url: "deletePastChooseItemByItemCode",
            bodyKeys: ["itemCode", "itemName", "startMonth"]
        },
        "select": "selectFimPastChooseItemTable",
        // Added multi-condition filtering URL
        "filter": {
            url: "/item/filter/chooseItem"
        }
    },
    suspiciousData: {
        "cn": "可疑数据标准表",
        "add": {
            url: "/past-analysis/insertStandard",
            bodyKeys: ["itemCode", "itemName", "num"]
        },
        "delete": {
            url: "deletePastChooseItemByItemCode",
            bodyKeys: ["itemCode", "itemName", "num"]
        },
        "select": "suspiciousData",
        // Added multi-condition filtering URL
        "filter": {
            url: "/past-analysis/delStandards"
        }
    }
}

export default adminSchema;
