Ext.define('PanelControlMarketing.model.CampannaPotencial', {
    extend: 'Ext.data.Model',

    fields: [
        {name: 'idcampanna', type: 'int'},
        {name: 'denominacion', type: 'string'},
        {name: 'cant', type: 'int'}
    ]
});