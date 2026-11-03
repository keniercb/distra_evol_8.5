Ext.define('TipoContrato.model.CmbTipoElemento', {
    extend: 'Ext.data.Model',
    fields: [
        {name: 'namecomponent', type: 'string'},
        {name: 'tipo', type: 'string'},
        {name: 'humanlabel', type: 'string'},
    ],

    proxy: {
        type: 'ajax',
        url: UtilsFn.buildUrl({action: 'getobject'}, ModuleMgr.get('TipoContrato'))
    }
});