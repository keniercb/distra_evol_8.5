Ext.define('ConfContratacion.model.Compartimentacion', {
    extend: 'Ext.data.Model',

    fields: [
        {name: 'idcompartimentacion', type: 'int'},
        {name: 'idrol', type: 'int'},
        {name: 'nombrerol'},
        {name: 'definicion', type: 'array'}
    ]
});