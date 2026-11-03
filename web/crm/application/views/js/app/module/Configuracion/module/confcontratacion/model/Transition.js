Ext.define('ConfContratacion.model.Transition', {
    extend: 'Ext.data.Model',

    fields: [
        {name: 'idtransicion', type: 'int'},
        {name: 'idestadoinicial', type: 'int'},
        {name: 'nombreestadoinicial', type: 'string'},
        {name: 'idestadofinal', type: 'int'},
        {name: 'nombreestadofinal', type: 'string'},
        {name: 'nombreproceso', type: 'string'},
        {name: 'roles', type: 'array'},
        {name: 'reglas', type: 'array'},
        {name: 'nombrecomite'},
        {name: 'idcomite'},
    ]
});