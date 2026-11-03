Ext.ns('Maestro.ConfigurarReporte.store');

Maestro.ConfigurarReporte.store.Reporte = Ext.extend( Ext.tree.TreeLoader, {
    constructor: function () {
        var me = this;

        me.url = '/pvd/maestro/reportes/index.php/configurarreportes/getReportes';
        me.baseParams = {idmodulo: 0};

        Maestro.ConfigurarReporte.store.Reporte.superclass.constructor.apply(me, arguments);
    }
});
