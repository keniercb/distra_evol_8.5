Ext.define('Clients.store.ClientProviderState', {
    extend: 'Ext.data.Store',
    autoLoad: true,
    model: 'Clients.model.ClientProviderState',
    // The topics-remote.php script appears to be hardcoded to use 50, and ignores this parameter, so we
    // are forced to use 50 here instead of a possibly more efficient value.
    pageSize: 50,
    // This web service seems slow, so keep lots of data in the pipeline ahead!
    leadingBufferZone: 1000,
    proxy: {
        type: 'ajax',
        url: './data/crm.MontoProveedorCliente.php',
        extraParams: {
            isClient: 1,
        },
        reader: {
            type: 'json',
            root: 'rows'
        }
    },
    id: 'client_provider_amount'
});

