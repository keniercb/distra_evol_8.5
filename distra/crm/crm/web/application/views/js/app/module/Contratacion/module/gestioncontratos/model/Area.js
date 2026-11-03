Ext.define('GestionContrato.model.Area', {
    extend: 'Ext.data.Model',

    fields: [
        {name: 'id'},
        {name: 'idarea',mapping:'id'},
        {name: 'text'},
        {name: 'leaf'}
    ]
});
