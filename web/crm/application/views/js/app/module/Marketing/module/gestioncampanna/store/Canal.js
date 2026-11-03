Ext.define('GestionCampanna.store.Canal', {
    extend: 'Ext.data.Store',
    model: 'GestionCampanna.model.Canal',
    pageSize: 10,
    proxy: {
        type: 'ajax',
        url: UtilsFn.buildUrl({action: 'getCanal'}, ModuleMgr.get('GestionCampanna')),
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