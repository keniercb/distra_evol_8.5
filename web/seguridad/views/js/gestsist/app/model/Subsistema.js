Ext.define('Conf.model.Subsistema', {
    extend : 'Ext.data.Model',
    proxy: {
        type: 'ajax',
        url: "cargarsistfuncRec"
    },
    fields  : [
        {name : 'id'},
        {name : 'idrecurso'},
        {name : 'denominacion', mapping: 'text'},
        {name : 'text'},
        {name : 'icon'},
        {name : 'abreviatura'},
        {name : 'descripcion'},
        {name : 'idfuncionalidad'},
        {name : 'leaf'},
        {name : 'type'},
        {name : 'idsistema'},
        {name : 'idpadre'},
        {name : 'icono'},
        {name : 'servidorweb'},
        {name : 'referencia'},
        {name : 'indice'},
        {name : 'visibilidad'},
        {name : 'externo', mapping: 'externa'}
    ]

});