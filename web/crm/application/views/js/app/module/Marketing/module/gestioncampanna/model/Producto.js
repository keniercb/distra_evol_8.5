Ext.define('GestionCampanna.model.Producto', {
    extend: 'Ext.data.Model',

    fields: [
        {name: 'idindicador', type: 'int'},
        {name: 'denominacion', type: 'string'},
        {name: 'tipo', type: 'int'}
    ]
});