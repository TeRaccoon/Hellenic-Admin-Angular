import { LineChartConfig, SubheadingType } from "../types/statistics/types";

export const LINE_CHART_CONFIG: LineChartConfig[] = [
    {
        lineChartOptions: {
            date: undefined,
            compareDate: undefined,
            queries: 'average-invoice-value',
            chartLabels: undefined,
            axisLabels: { x: 'Date', y: 'Order Value (£)' }
        },
        subheadingOptions: {
            type: SubheadingType.AverageCurrency,
            filter: true
        },
        reportOptions: {
            headers: ['Date','Gross Sales','Discounts','Orders','Average Order Value'],
            dataTypes: ['text','currency','currency','int','currency'],
            formatted: false,
            filters: [
                { name: 'Hide Empty Rows', predicate: (value: any) => !value.empty },
                { name: 'Show Only Empty Rows', predicate: (value: any) => value.empty },
              ],
            keys: ['dateKey','total','discounts','orders','average']
        },
        heading: 'Average Order Value'
    },
    {
        lineChartOptions: {
            date: undefined,
            compareDate: undefined,
            queries: 'total-invoices',
            chartLabels: undefined,
            axisLabels: { x: 'Date', y: 'Order Amount' }
        },
        subheadingOptions: {
            type: SubheadingType.AverageCurrency,
            filter: true
        },
        reportOptions: {
            headers: ['Date','Orders','Average Units Ordered','Average Order Value'],
            dataTypes: ['text', 'int', 'number', 'currency'],
            formatted: false,
            filters: [
                { name: 'Hide Empty Rows', predicate: (value: any) => !value.empty },
                { name: 'Show Only Empty Rows', predicate: (value: any) => value.empty },
              ],
            keys: ['dateKey','total_orders','average_units_ordered','average_order_value']
        },
        heading: 'Total Orders'
    },
    {
        lineChartOptions: {
            date: undefined,
            compareDate: undefined,
            queries: 'total-invoice-value',
            chartLabels: undefined,
            axisLabels: { x: 'Date', y: 'Total Value' }
        },
        subheadingOptions: {
            type: SubheadingType.AverageCurrency,
            filter: true
        },
        reportOptions: {
            headers: ['Date','Orders','Discounts','Net Sales','Tax','Gross Sales'],
            dataTypes: ['text','int','currency','currency','currency','currency'],
            formatted: false,
            filters: [
                { name: 'Hide Empty Rows', predicate: (value: any) => !value.empty },
                { name: 'Show Only Empty Rows', predicate: (value: any) => value.empty },
              ],
            keys: ['dateKey','total_orders','discounts','net','tax','total']
        },
        heading: 'Total Invoices Value'
    },
    // {
    //     lineChartOptions: {
    //         date: undefined,
    //         compareDate: undefined,
    //         queries: 'item-sales-per-period',
    //         chartLabels: undefined,
    //         axisLabels: { x: 'Date', y: 'Total Sales (£)' }
    //     },
    //     subheadingOptions: {
    //         type: SubheadingType.AverageCurrency,
    //         filter: false
    //     },
    //     reportOptions: {
    //         headers: ['Date','Gross Sales','Discounts','Orders','Average Order Value'],
    //         dataTypes: ['text','currency','currency','int','currency'],
    //         formatted: false,
    //         filters: [
    //             { name: 'Hide Empty Rows', predicate: (value: any) => !value.empty },
    //             { name: 'Show Only Empty Rows', predicate: (value: any) => value.empty },
    //           ],
    //         keys: ['dateKey','total','discounts','orders','average']
    //     },
    //     heading: 'Sales Per Period'
    // }
]