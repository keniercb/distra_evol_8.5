Ext.define('ConfContratacion.model.Rule', {
    extend: 'Ext.data.Model',

    fields: [
        {name: 'idregla', type: 'int'},
        {name: 'idtiporegla', type: 'int'},
        {name: 'tiporegla', type: 'string'},
        {name: 'valor'},
        {name: 'idrol'},
        {name: 'nombrerol'}

    ]
});