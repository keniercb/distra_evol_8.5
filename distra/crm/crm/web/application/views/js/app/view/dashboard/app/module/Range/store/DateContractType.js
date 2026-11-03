Ext.define('Range.store.DateContractType', {
    extend: 'Ext.data.Store',
    autoLoad: false,
    model: 'Range.model.DateContractType',
    proxy: {
        type: 'ajax',
        url: './data/crm.ContratoRangeMontoTipo.php',
        reader: {
            type: 'json',
            root: 'rows'
        }
    },
    id:'range-date-contract-type'
});

