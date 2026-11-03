Ext.define('State.store.AmountState', {
    extend: 'Ext.data.Store',
    autoLoad: true,
    model: 'State.model.AmountState',
    proxy: {
        type: 'ajax',
        url: './data/crm.MontoProveedorClienteEstado.php',
        extraParams: {
            isClient: 1,
        },
        reader: {
            type: 'json',
            root: 'rows'
        }
    },
    id: 'state_client_provider_amount'
});

