Ext.define('ReporteContratacion.store.Contratos', {
    extend: 'Ext.data.TreeStore',
    model: 'ReporteContratacion.model.Contratos',
    storeId: 'stClientesProveedores',
    remoteFilter: true,
    proxy: {
        type: 'ajax',
        url: UtilsFn.buildUrl({action: 'cargarContratosXArea'}, ModuleMgr.get('ReporteContratacion')),
        // actionMethods: {read: 'POST'},
        reader: {
            type: 'json',
            // root: 'data',
            totalProperty: 'total',
            successProperty: 'success'
        },
    },
    root:{
        id:'root',
        text:'Entidad',
        expanded:true
    }
});