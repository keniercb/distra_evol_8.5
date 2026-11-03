Ext.define('Range.store.ContractType', {
    extend: 'Ext.data.Store',
    model: 'Range.model.ContractType',
    autoLoad: false,
    proxy: {
        type: 'ajax',
        url: './data/crm.MontoClients.php',
        extraParams: {summary: 0},
        reader: {
            type: 'json',
            root: 'rows'
        }
    },
    storeId: 'range-date-contract-type'
});
