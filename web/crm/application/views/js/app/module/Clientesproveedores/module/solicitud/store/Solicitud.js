Ext.define('Solicitud.store.Solicitud', {
    extend: 'Ext.data.Store',
    model: 'Solicitud.model.Solicitud',

    storeId: 'stSolicitudCliente',
    remoteSort: true,
    autoLoad: true,
    pageSize: 25,
    proxy: {
        type: 'ajax',
        url: UtilsFn.buildUrl({action: 'getSolicitudes'}, ModuleMgr.get('Solicitud')),
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
