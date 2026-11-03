Ext.define('GestionContratoImportacion.store.Contratos', {
    extend: 'Ext.data.Store',

    storeId: 'stContratosImportacion',
    remoteSort: true,
    pageSize: 25,
    fields: [],
    proxy: {
        type: 'ajax',
        url: UtilsFn.buildUrl({action: 'cargarcontrato'}, ModuleMgr.get('GestionContratoImportacion')),
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
