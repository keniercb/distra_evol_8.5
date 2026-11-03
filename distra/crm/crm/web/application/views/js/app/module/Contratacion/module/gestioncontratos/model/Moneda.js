Ext.define('GestionContrato.model.Moneda', {
    extend: 'Ext.data.Model',
    fields: [
        {name: 'idmoneda', type: 'int'},
        {name: 'idmonedaentidad', type: 'int'},
        {name: 'codigoiso', type: 'string'},
        {name: 'nombremoneda', type: 'string'},
        {name: 'tipomoneda', type: 'int'}
    ],

    proxy: {
        type: 'ajax',
        url: UtilsFn.buildUrl({action: 'cargarmonedas'}, ModuleMgr.get('GestionContrato'))
    }
});