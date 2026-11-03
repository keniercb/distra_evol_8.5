Ext.define('Sales.store.ContractType', {
    extend: 'Ext.data.Store',
    model: 'Sales.model.ContractType',
    autoLoad: false,
    proxy: {
        type: 'ajax',
        url: './data/crm.MontoTipo.php',
        extraParams: {summary: 0},
        reader: {
            type: 'json',
            root: 'rows'
        }
    },
    storeId: 'sales-date-contract-type'
});
