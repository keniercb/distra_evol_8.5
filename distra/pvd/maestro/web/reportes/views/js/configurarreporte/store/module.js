Ext.ns('Maestro.ConfigurarReporte.store');

Maestro.ConfigurarReporte.store.Module = Ext.extend( Ext.data.Store, {
    constructor: function () {
        var me = this;

        me.url = '/pvd/maestro/reportes/index.php/configurarreportes/getModules';

        me.reader = new Ext.data.JsonReader({
            root: "datos",
            totalProperty: "cantidad",
            id: "idmodulo"
        }, [
            {name: 'idmodulo'},
            {name: 'identificador'},
            {name: 'denominacion'}
        ]);

        Maestro.ConfigurarReporte.store.Module.superclass.constructor.apply(me, arguments);
    }
});
