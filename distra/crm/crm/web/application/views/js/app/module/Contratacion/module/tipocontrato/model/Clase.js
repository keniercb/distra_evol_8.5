Ext.define('TipoContrato.model.Clase', {
    extend: 'Ext.data.Model',
    fields: [
        {name: 'id', type: 'string'},
        {name: 'text', type: 'string'},
        {name: 'tablename', type: 'string'}
    ],

    proxy: {
        type: 'ajax',
        url: UtilsFn.buildUrl({action: 'cargardir'}, ModuleMgr.get('TipoContrato'))
    }
});