Ext.define('Segmentacion.store.DataSegmentacion', {
    extend: 'Ext.data.Store',
    model: 'Segmentacion.model.DataSegmentacion',
    autoLoad: true,
    remoteSort: true,
    pageSize: 25,
    proxy: {
        type: 'ajax',
        url: UtilsFn.buildUrl({action: 'cargarsegmentacion'}, ModuleMgr.get('Segmentacion')),
        actionMethods: {
            read: 'POST'
        },
        reader: {
            root: 'datos',
            totalProperty: 'cantidad',
            successProperty: 'success'
        }
    }
});