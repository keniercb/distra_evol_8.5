Ext.define('TipoContrato.store.TipoContrato', {
    extend: 'Ext.data.TreeStore',
    requires: 'TipoContrato.model.TipoContrato',
    model: 'TipoContrato.model.TipoContrato',
    storeId: 'TipoContrato',
    root: {
        expanded: false
    }
});
