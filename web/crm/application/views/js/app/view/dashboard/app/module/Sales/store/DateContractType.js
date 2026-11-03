Ext.define('Sales.store.DateContractType', {
    extend: 'Ext.data.Store',
    autoLoad: false,
    model: 'Sales.model.DateContractType',
    proxy: {
        type: 'ajax',
        url: './data/crm.ContratoMontoTipo.php',
        reader: {
            type: 'json',
            root: 'rows'
        }
    },
    id:'sales-date-contract-type'
});

