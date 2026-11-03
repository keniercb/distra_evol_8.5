Ext.define('GestionContratoImportacion.model.TipoPrecio', {
    extend: 'Ext.data.Model',

    fields: [
        {name: 'idtipoprecio', type: 'int'},
        {name: 'denominacion', type: 'string'},
        {name: 'pordefecto', type: 'int'}
    ]
});