Ext.define('Reportes.model.Filtros', {
    extend: 'Ext.data.Model',
    fields: [
        {name: 'idfiltro'},
        {name: 'denominacion'},
        {name: 'orden'},
        {name: 'nombreparametro'},
        {name: 'tipo', type: 'int'},
        {name: 'javatype'},
        {name: 'anchocolumna'},
        {name: 'longitudminima'},
        {name: 'longitudmaxima'},
        {name: 'valorminimo'},
        {name: 'valormaximo'},
        {name: 'nomidentificador'},
        {name: 'nomdenominacion'},
        {name: 'tipofuentedatos', type: 'int'},
        {name: 'sentenciasql'},
        {name: 'nomservicio'},
        {name: 'multipleseleccion'},
        {name: 'paginado'},
        {name: 'idestructuras'},
        {name: 'estructuras'}
    ]
});
