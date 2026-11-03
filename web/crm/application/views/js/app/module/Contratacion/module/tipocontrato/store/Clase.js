Ext.define('TipoContrato.store.Clase', {
    extend: 'Ext.data.TreeStore',
    requires: 'TipoContrato.model.Clase',
    model: 'TipoContrato.model.Clase',
    storeId: 'TipoContrato',
    root: {
        expanded: false
    }
});