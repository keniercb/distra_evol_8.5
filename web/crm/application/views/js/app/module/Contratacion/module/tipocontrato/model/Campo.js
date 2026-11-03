Ext.define('TipoContrato.model.Campo', {
    extend: 'Ext.data.Model',
    fields: [
        {name: 'denominacion', type: 'string'}
    ],

    proxy: {
        type: 'ajax',
        url: UtilsFn.buildUrl({action: 'cargarcampos'}, ModuleMgr.get('TipoContrato'))
    }
});