Ext.define('Reclamaciones.store.ReclamacionEstadoTrazas', {
    extend: 'Ext.data.Store',
    requires: 'Reclamaciones.model.ReclamacionEstadoTrazas',
    model: 'Reclamaciones.model.ReclamacionEstadoTrazas',
    proxy: {
        type: 'ajax',
        url: UtilsFn.buildUrl({action: 'getreclamacionEstadoTrazas'}, ModuleMgr.get('Reclamaciones')),
        actionMethods: {read: 'POST'},
        reader: {
            root: 'datos',
            totalProperty: 'cantidad',
            successProperty: 'success'
        }
    }
});
