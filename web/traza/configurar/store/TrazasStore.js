Ext.define('ConfigurarTrazas.store.TrazasStore', {
    extend: 'Ext.data.Store',
    model: 'ConfigurarTrazas.model.TrazasModel',
    proxy:{
        type: 'ajax',
        url: 'cargar',
        reader: {
            type: 'json',
            root: 'data'
        }
    },
    autoLoad: true
});