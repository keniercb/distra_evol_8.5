Ext.define('GestionContrato.model.Producto', {
    extend: 'Ext.data.Model',

    fields: [
        {name: 'idindicador', type: 'int'},
        {name: 'denominacion', type: 'string'},
        {name: 'tipo', type: 'int'},
        {name: 'dumedida', type: 'string'},
        {name: 'precio', type: 'float'},
        {name: 'preciodivisa', type: 'float'},
        {name: 'tipo', type: 'int'},
        {name: 'arridtablas'},
        {name: 'datos_json'},
        {name: 'datos_json_encode'},
        {name: 'codigoproveedor'}
    ]
});