Ext.define('GestionCampanna.store.Cliente', {
    extend: 'Ext.data.Store',
    model: 'GestionCampanna.model.Cliente',

    storeId: 'stCliente',
    autoLoad: true,
    remoteSort: true,
    pageSize: 20,
    proxy: {
        type: 'ajax',
        url: UtilsFn.buildUrl({action: 'getCliente'}, ModuleMgr.get('GestionCampanna')),
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
