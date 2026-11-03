Ext.define('GestionCampanna.store.Campanna', {
    extend: 'Ext.data.Store',
    model: 'GestionCampanna.model.Campanna',

    storeId: 'stCampanna',
    autoLoad: true,
    remoteSort: true,
    pageSize: 25,


    proxy: {
        type: 'ajax',
        url: UtilsFn.buildUrl({action: 'getCampanna'}, ModuleMgr.get('GestionCampanna')),
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
