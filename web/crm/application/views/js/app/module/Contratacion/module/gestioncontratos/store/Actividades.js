Ext.define('GestionContrato.store.Actividades', {
    extend: 'Ext.data.TreeStore',
    requires: 'GestionContrato.model.Actividad',
    model: 'GestionContrato.model.Actividad',
    storeId: 'ActividadesContrato',
    autoLoad: false,
    nodeParam: 'idelemento',
    root: {
        expanded: false
    },
    proxy: {
        type: 'ajax',
        url: UtilsFn.buildUrl({action: 'cargarActividades'}, ModuleMgr.get('GestionContrato')),
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