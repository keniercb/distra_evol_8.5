Ext.define('PanelControlMarketing.store.OportunidadDesacuerdo', {
    extend: 'Ext.data.Store',
    model: 'PanelControlMarketing.model.OportunidadDesacuerdo',

    storeId: 'stOportunidadDesacuerdo',
    autoLoad: true,
    proxy: {
        type: 'ajax',
        url: UtilsFn.buildUrl({action: 'getCantOportunidadesMes'}, ModuleMgr.get('PanelControlMarketing')),
        actionMethods: {
            read: 'POST'
        },
        extraParams: {
            include: 1
        },
        reader: {
            root: 'data',
            successProperty: 'success'
        }
    }
});
