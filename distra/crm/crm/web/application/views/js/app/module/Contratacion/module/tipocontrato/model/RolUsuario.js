Ext.define('TipoContrato.model.RolUsuario', {
    extend: 'Ext.data.Model',
    fields: [
        {name: 'idrol', type: 'string'},
        {name: 'denominacion', type: 'string'},
        {name: 'abreviatura', type: 'string'},
        {name: 'descripcion', type: 'string'},
        {name: 'regular', type: 'string'}
    ],

    proxy: {
        type: 'ajax',
        url: UtilsFn.buildUrl({action: 'getrolusuario'}, ModuleMgr.get('TipoContrato'))
    }
});