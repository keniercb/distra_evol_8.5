Ext.ns('Maestro.ConfigurarReporte.store');

Maestro.ConfigurarReporte.store.Filter = Ext.extend( Ext.data.Store, {
    constructor: function () {
        var me = this;

        me.url = '/pvd/maestro/reportes/index.php/configurarreportes/getReporteFilters';

        me.reader = new Ext.data.JsonReader({
            root: "datos",
            totalProperty: "cantidad",
            id: "idfiltro"
        }, [
            {name: 'idfiltro'},
            {name: 'denominacion'},
            {name: 'orden'},
            {name: 'nombreparametro'},
            {name: 'tipo'},
            {name: 'javatype'},
            {name: 'anchocolumna'},
            {name: 'longitudminima'},
            {name: 'longitudmaxima'},
            {name: 'valorminimo'},
            {name: 'valormaximo'},
            {name: 'nomidentificador'},
            {name: 'nomdenominacion'},
            {name: 'tipofuentedatos'},
            {name: 'sentenciasql'},
            {name: 'nomservicio'},
        ]);

        Maestro.ConfigurarReporte.store.Filter.superclass.constructor.apply(me, arguments);
    }
});
