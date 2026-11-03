Ext.define('GestionCampanna.store.ClienteActividad', {
    extend: 'Ext.data.Store',
    model: 'GestionCampanna.model.Cliente',

    storeId: 'stClienteActividad',
    remoteSort: true,
    proxy: {
        type: 'ajax',
        url: UtilsFn.buildUrl({action: 'getClienteActividad'}, ModuleMgr.get('GestionCampanna')),
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
