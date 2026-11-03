Ext.define('ReporteContratacion.store.Areas', {
    extend: 'Ext.data.TreeStore',
    model: 'ReporteContratacion.model.Contratos',
    storeId: 'stClientesProveedores',
    remoteFilter: true,
    proxy: {
        type: 'ajax',
        url: UtilsFn.buildUrl({action: 'getAreas'}, ModuleMgr.get('ReporteContratacion')),
        // actionMethods: {read: 'POST'},
        reader: {
            type: 'json',
            root: 'children',
            // totalProperty: 'total',
            successProperty: 'success'
        },
    },
    root: {
        text: 'Entidad',
        id: 'root',
        expanded: true
    },
});
