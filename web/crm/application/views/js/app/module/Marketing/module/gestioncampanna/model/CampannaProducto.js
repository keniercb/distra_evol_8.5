Ext.define('GestionCampanna.model.CampannaProducto', {
    extend: 'Ext.data.Model',

    fields: [
        {name: 'idcampannaproducto', type: 'int'},
        {name: 'denominacion', type: 'string'},
        {name: 'idproducto', type: 'int'},
        {name: 'idcampanna', type: 'int'},
        {name: 'tipo', type: 'int'},
        {name: 'precio', type: 'float'}
    ]
});