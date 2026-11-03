Ext.define('Reclamaciones.store.Reclamaciones', {
    extend: 'Ext.data.Store',
    requires: 'Reclamaciones.model.Reclamaciones',
    model: 'Reclamaciones.model.Reclamaciones',
    storeId: 'Reclamaciones',
    remoteFilter: true,
    remoteSort: true,
    pageSize: 25,
    autoLoad:true,
    proxy: {
        type: 'ajax',
        url: UtilsFn.buildUrl({action: 'getReclamaciones'}, ModuleMgr.get('Reclamaciones')),
        actionMethods: {read: 'POST'},
        reader: {
            root: 'datos',
            totalProperty: 'cant',
            successProperty: 'success'
        }
    }
});
