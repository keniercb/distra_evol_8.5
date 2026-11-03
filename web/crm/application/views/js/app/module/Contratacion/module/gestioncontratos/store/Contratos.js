Ext.define('GestionContrato.store.Contratos', {
    extend: 'Ext.data.Store',

    storeId: 'stContratos',
    remoteSort: true,
    pageSize: 25,
    fields: [],
    proxy: {
        type: 'ajax',
        url: UtilsFn.buildUrl({action: 'cargarcontrato'}, ModuleMgr.get('GestionContrato')),
        actionMethods: {
            read: 'POST'
        },
        reader: {
            root: 'data',
            totalProperty: 'cant',
            successProperty: 'success'
        }
    }
});
