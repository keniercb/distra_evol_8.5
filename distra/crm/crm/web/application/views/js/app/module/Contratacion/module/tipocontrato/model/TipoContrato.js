Ext.define('TipoContrato.model.TipoContrato', {
    extend: 'Ext.data.Model',
    fields: [
        {name: 'idtipocontrato', type: 'string'},
        {name: 'denominacion', type: 'string'},
        {name: 'idestructuracomun', type: 'string'},
        {name: 'editable', type: 'boolean'},
        {name: 'tipo', type: 'boolean'},
        {name: 'cliente', type: 'boolean'},
        {name: 'compartimentacion', type: 'array'},
        {name: 'enuso', type: 'boolean'},
        {name: 'iconCls'},
    ],

    proxy: {
        type: 'ajax',
        url: UtilsFn.buildUrl({action: 'cargartipocontrato'}, ModuleMgr.get('TipoContrato'))
    }
});