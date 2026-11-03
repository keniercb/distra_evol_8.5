Ext.define('Seguimiento.store.Contratos', {
    extend: 'Ext.data.Store',
    model: 'Seguimiento.model.Contrato',
    storeId: 's_stContratos',
    autoLoad: true,
    remoteSort: true,
    pageSize: 25,
    proxy: {
        type: 'ajax',
        url: UtilsFn.buildUrl({action: 'cargarContratos'}, ModuleMgr.get('Seguimiento')),
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
