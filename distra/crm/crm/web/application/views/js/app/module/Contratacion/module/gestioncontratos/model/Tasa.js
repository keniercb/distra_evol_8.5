Ext.define('GestionContrato.model.Tasa', {
    extend: 'Ext.data.Model',
    fields: [
        {name: 'idmonedaentidad', type: 'int'},
        {name: 'idtasa', type: 'int'},
        {name: 'nombretasa', type: 'string'},
        {name: 'factordeconversion', type: 'string'}
    ],

    proxy: {
        type: 'ajax',
        url: UtilsFn.buildUrl({action: 'cargartasas'}, ModuleMgr.get('GestionContrato'))
    }
});