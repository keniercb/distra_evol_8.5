Ext.define('GestionOportunidad.model.Cliente', {
    extend: 'Ext.data.Model',

    fields: [
        {name: 'idclienteoportunidad', type: 'int'},
        {name: 'idclientesproveedores', type: 'int'},
        {name: 'nombre', type: 'string'},
        {name: 'idclasificacion', type: 'int'}
    ]
});