Ext.define('PanelControlMarketing.model.ClientePotencial', {
    extend: 'Ext.data.Model',

    fields: [
        {name: 'idclientesproveedores', type: 'int'},
        {name: 'nombre', type: 'string'},
        {name: 'cant', type: 'int'}
    ]
});