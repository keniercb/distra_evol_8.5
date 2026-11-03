Ext.define('Reportes.store.Reportes', {
    extend: 'Ext.tree.Store',
    requires: 'Reportes.model.Reportes',
    model: 'Reportes.model.Reportes',
    storeId: 'stReportes',
    proxy: {
        type: 'ajax',
        url: UtilsFn.buildUrl({action: 'getReportes'}, ModuleMgr.get('Reportes')),
    },
    idmodulo: 0
});
