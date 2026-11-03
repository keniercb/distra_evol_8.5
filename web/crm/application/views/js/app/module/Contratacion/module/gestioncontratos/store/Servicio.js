Ext.define('GestionContrato.store.Servicio', {
    extend: 'Ext.data.Store',
    model: 'GestionContrato.model.Servicio',
    storeId: 'stServicio',
    autoLoad: true,
    remoteSort: true,
    pageSize: 20,
    proxy: {
        type: 'ajax',
        url: UtilsFn.buildUrl({action: 'getServicios'}, ModuleMgr.get('GestionContrato')),
        actionMethods: {
            read: 'POST'
        },
        reader: {
            root: 'data',
            totalProperty: 'total',
            successProperty: 'success'
        }
    }
});
