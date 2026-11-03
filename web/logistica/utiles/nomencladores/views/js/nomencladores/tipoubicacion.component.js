Ext.ns('Ext.erp');

Ext.erp.tipoubicacion = Ext.extend(Ext.erp.gridPanelNomenclador, {
    /**
     *
     **/
    constructor: function(config) {
        var _this = this;
        config.codigo = false;
        Ext.apply(this, config);
        this.campoIdNomenclador = 'idtipoubicacion';
        Ext.erp.tipoubicacion.superclass.constructor.call(this, config);
    }
});