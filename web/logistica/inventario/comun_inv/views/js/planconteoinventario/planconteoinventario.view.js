Ext.ns('LOG.lb.planconteoinventario');

LOG.lb.planconteoinventario.View = Ext.extend(LOG.lb.gestplanconteo.View, {
    constructor: function(config) {
        config.idioma = {};
        LOG.util.UIManager.apply(config.idioma, LOG.lb.gestplanconteo.Idioma);
        this.modoSeleccion = 1;
        this.autoShow = false;
        this.idayuda= 'idPlanConteoInv';
        this.subsistema= LOG.util.Subsistemas.inventario;
        this.busquedaBasica = true;
        LOG.lb.planconteoinventario.View.superclass.constructor.call(this, config);
    }
});