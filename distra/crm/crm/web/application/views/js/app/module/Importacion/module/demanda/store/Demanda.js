Ext.define('Demanda.store.Demanda', {
    extend: 'Ext.data.Store',
    requires: 'Demanda.model.Demanda',
    model: 'Demanda.model.Demanda',
    storeId: 'Demanda',
    remoteFilter: true,
    remoteSort: true,
    pageSize: 25,
    // autoLoad: true,
    proxy: {
        type: 'ajax',
        url: UtilsFn.buildUrl({action: 'getDemandas'}, ModuleMgr.get('Demanda')),
        actionMethods: {read: 'POST'},
        reader: {
            root: 'datos',
            totalProperty: 'cant',
            successProperty: 'success'
        }
    }
});
