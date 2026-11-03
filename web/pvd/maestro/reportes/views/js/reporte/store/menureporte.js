Ext.ns('Maestro.Reporte.store');

Maestro.Reporte.store.MenuReporte = Ext.extend( Ext.tree.TreeLoader, {
    constructor: function () {
        var me = this,
        	moduleIdentificador;

        me.url = '/pvd/maestro/reportes/index.php/reportes/getReportesMenu';
        
        Maestro.Reporte.store.MenuReporte.superclass.constructor.apply(me, arguments);

        me.baseParams = {moduleidentificador: (me.appInitConfig)?me.appInitConfig.idmodule : ''};
    }
});
