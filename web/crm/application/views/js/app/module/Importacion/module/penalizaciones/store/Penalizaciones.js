Ext.define('Penalizaciones.store.Penalizaciones', {
    extend: 'Ext.data.Store',
    requires: 'Penalizaciones.model.Penalizaciones',
    model: 'Penalizaciones.model.Penalizaciones',
    storeId: 'Penalizaciones',
    remoteFilter: true,
    remoteSort: true,
    pageSize: 25,
    autoLoad:true,
    proxy: {
        type: 'ajax',
        url: UtilsFn.buildUrl({action: 'getPenalizaciones'}, ModuleMgr.get('Penalizaciones')),
        actionMethods: {read: 'POST'},
        reader: {
            root: 'datos',
            totalProperty: 'cant',
            successProperty: 'success'
        }
    }
});
