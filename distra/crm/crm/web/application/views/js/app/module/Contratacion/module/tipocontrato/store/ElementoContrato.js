Ext.define('TipoContrato.store.ElementoContrato', {
    extend: 'Ext.data.TreeStore',
    requires: 'TipoContrato.model.ElementoContrato',
    model: 'TipoContrato.model.ElementoContrato',
    storeId: 'ElementoContrato',
    autoLoad: false,
    nodeParam: 'idelemento',
    root: {
        expanded: false
    },
    data: []
});