Ext.define('Pliego.store.TodasOfertas', {
    extend: 'Ext.data.Store',
    storeId: 'storeTodasOfertas',
    remoteSort: true,
    fields: [
        'codigo', 'denominacion', 'ensolicitud',
        {name:'cant_ultima', type: 'int'},
        {name:'precio_ultima', type: 'int'},
        {name:'importe_ultima', type: 'int'}
    ],
    proxy: {
        type: 'ajax',
        url: UtilsFn.buildUrl({action: 'obtenerdatosOfertasProductos'}, ModuleMgr.get('Pliego')),
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
