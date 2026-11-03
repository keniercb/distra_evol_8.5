Ext.define('ComiteImportacion.store.Opinions', {
    extend: 'Ext.data.Store',
    model: 'ComiteImportacion.model.Opinion',
    storeId: 'stOpinionRol',
    proxy: {
        type: 'ajax',
        url: UtilsFn.buildUrl({action: 'cargarDictamenes'}, ModuleMgr.get('ComiteImportacion')),
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
