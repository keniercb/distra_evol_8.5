Ext.define('ConfPlantilla.model.Estructura', {
    extend: 'Ext.data.Model',
    fields: [
        {name: 'idestructura'},
        {name: 'region'},
        {name: 'posicion'},
        {name: 'localizacion', convert: function(v, record){
            return record.data.region+'-'+record.data.posicion;
        }},
        {name: 'tipo'},
        {name: 'texto'},
        {name: 'img'},
        {name: 'idplantilla'}
    ]
});
