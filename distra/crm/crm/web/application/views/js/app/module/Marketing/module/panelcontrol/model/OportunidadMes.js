Ext.define('PanelControlMarketing.model.OportunidadMes', {
    extend: 'Ext.data.Model',

    fields: [
        {name: 'mes', type: 'int'},
        {name: 'nombremes', type: 'string'},
        {name: 'anno', type: 'int'},
        {name: 'cant', type: 'int'},
        {name: 'idtipo', type: 'int'},
        {name: 'denominacion', type: 'string'}
    ]
});