Ext.define('ConfContratacion.store.Espacios', {
    extend: 'Ext.data.TreeStore',
    model: 'ConfContratacion.model.Espacio',

    storeId: 'stEspacios',
    root: {
        text: 'Espacios',
        id: 0,
        expanded: false
    },
    autoLoad:false,
    proxy: {
        type: 'ajax',
        url: UtilsFn.buildUrl({action: 'getWorkSpace'}, ModuleMgr.get('ConfContratacion')),
        actionMethods: {
            read: 'POST'
        },
        reader: {
            root: 'data',
            successProperty: 'success'
        }
    }
});
