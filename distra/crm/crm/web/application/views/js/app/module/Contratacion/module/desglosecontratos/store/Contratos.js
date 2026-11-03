Ext.define('DesgloseContrato.store.Contratos', {
    extend: 'Ext.data.Store',
    model: 'DesgloseContrato.model.Contrato',
    storeId: 'dc_contratos',
    autoLoad: true,
    remoteSort: true,
    pageSize: 25,
    proxy: {
        type: 'ajax',
        url: UtilsFn.buildUrl({action: 'cargarContratos'}, ModuleMgr.get('DesgloseContrato')),
        actionMethods: {
            read: 'POST'
        },
        reader: {
            root: 'data',
            totalProperty: 'cant',
			total: 'Sumatoria',
            successProperty: 'success'
        }
    }
});
