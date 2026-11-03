Ext.define('ConfContratacion.model.Rol', {
    extend: 'Ext.data.Model',

    fields: [
        {name: 'idrol', type: 'int'},
        {name: 'denominacion', type: 'string'},
        {name: 'abreviatura', type: 'string'},
        {name: 'nombreproceso', type: 'string'}
    ]
});