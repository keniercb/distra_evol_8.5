Ext.define('Reportes.store.Filtros', {
    extend: 'Ext.data.Store',
    model: 'Reportes.model.Filtros',
    storeId: 'stFiltros',
    proxy: {
        type: 'ajax',
        url: UtilsFn.buildUrl({action: 'getFiltros'}, ModuleMgr.get('Reportes')),
        actionMethods: {read: 'POST'},
        reader: {
            root: 'datos',
            totalProperty: 'cantidad',
            successProperty: 'success'
        }
    },
    idreporte: 0
});
