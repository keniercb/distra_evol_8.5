Ext.define('GestionContratoImportacion.model.Servicio', {
    extend: 'Ext.data.Model',

    fields: [
        {name: 'idactividad', type: 'int'},
        {name: 'denominacion', type: 'string'},
        {name: 'arraynorma', type: 'array'},
        {name: 'precio', type: 'float'},
        {name: 'preciodivisa', type: 'float'},
        {name: 'tipo', type: 'int'},
        {name: 'codigoproveedor', type: 'string'},
    ]
});