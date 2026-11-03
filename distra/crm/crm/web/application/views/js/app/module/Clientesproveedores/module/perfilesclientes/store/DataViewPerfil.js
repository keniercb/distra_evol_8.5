Ext.define('PerfilesClientes.store.DataViewPerfil', {
    extend: 'Ext.data.Store',
    model: 'PerfilesClientes.model.DataViewPerfil',
    /*data: [
        { lastmod:'1368708928000', name:'dance_fever.jpg', size: '2067', url: '../../../../configuracion/comun/bla.JPG'},
        { lastmod:'1368708928000', name:'dance_fever.jpg', size: '2067', url: '../../../../configuracion/comun/bla.JPG'},
        { lastmod:'1368708928000', name:'dance_fever.jpg', size: '2067', url: '../../../../configuracion/comun/bla.JPG'},
        { lastmod:'1368708928000', name:'dance_fever.jpg', size: '2067', url: '../../../../configuracion/comun/bla.JPG'}
    ],*/
    autoLoad: true,
    remoteSort: true,
    pageSize: 25,
    proxy: {
        type: 'ajax',
        url: UtilsFn.buildUrl({action: 'cargarperfiles'}, ModuleMgr.get('PerfilesClientes')),
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