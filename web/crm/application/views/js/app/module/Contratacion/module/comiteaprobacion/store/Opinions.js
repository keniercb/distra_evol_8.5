Ext.define('Comite.store.Opinions', {
    extend: 'Ext.data.Store',
    model: 'Comite.model.Opinion',
    storeId: 'stOpinionRol',
    proxy: {
        type: 'ajax',
        url: UtilsFn.buildUrl({action: 'cargarDictamenes'}, ModuleMgr.get('Comite')),
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
