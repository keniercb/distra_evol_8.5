Ext.define('Reportes.store.Modulos', {
    extend: 'Ext.data.Store',
    model: 'Reportes.model.Modulos',
    storeId: 'stModulos',
    proxy: {
        type: 'ajax',
        url: UtilsFn.buildUrl({action: 'getModulos'}, ModuleMgr.get('Reportes')),
        actionMethods: {read: 'POST'},
        reader: {
            root: 'datos',
            totalProperty: 'cantidad',
            successProperty: 'success'
        }
    }
});
