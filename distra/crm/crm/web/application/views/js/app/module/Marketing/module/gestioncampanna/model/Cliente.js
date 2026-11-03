Ext.define('GestionCampanna.model.Cliente', {
    extend: 'Ext.data.Model',

    fields: [
        {name: 'idclienteactividad', type: 'int'},
        {name: 'idclientesproveedores', type: 'int'},
        {name: 'nombre', type: 'string'},
        {name: 'idclasificacion', type: 'int'}
    ]
});