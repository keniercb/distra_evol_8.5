Ext.define('GestionContratoImportacion.store.Actividades', {
    extend: 'Ext.data.TreeStore',
    requires: 'GestionContratoImportacion.model.Actividad',
    model: 'GestionContratoImportacion.model.Actividad',
    storeId: 'ActividadesContratoImportacion',
    autoLoad: false,
    nodeParam: 'idelemento',
    root: {
        expanded: false
    },
    proxy: {
        type: 'ajax',
        url: UtilsFn.buildUrl({action: 'cargarActividades'}, ModuleMgr.get('GestionContratoImportacion')),
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