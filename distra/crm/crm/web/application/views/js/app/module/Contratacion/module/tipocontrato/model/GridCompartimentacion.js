Ext.define('TipoContrato.model.GridCompartimentacion', {
    extend: 'Ext.data.Model',
    fields: [
        {name: 'idelemento', type: 'string'},
        {name: 'denominacion', type: 'string'},
        {name: 'visibilidad', type: 'boolean'},
        {name: 'obligatorio', type: 'boolean'},
    ],
    proxy: {
        type: 'ajax',
        url: UtilsFn.buildUrl({action: 'cargarelementocontrato'}, ModuleMgr.get('TipoContrato'))
    }
});