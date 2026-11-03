Ext.define('Reportes.model.Reportes', {
    extend: 'Ext.data.Model',
    idProperty : 'idreporte',
    fields: [
        {name: 'idreporte'},
        {name: 'idpadre'},
        {name: 'denominacion'},
        {name: 'agrupador'},
        {name: 'tipocontenido', type: 'int'},
        {name: 'url'},
        {name: 'recurso'},
        {name: 'nombrecomponente'}
    ]
});
