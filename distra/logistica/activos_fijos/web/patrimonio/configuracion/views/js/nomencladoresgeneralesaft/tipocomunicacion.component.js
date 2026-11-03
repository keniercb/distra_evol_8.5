
Ext.erp.nomtipocomunicacion = Ext.extend(Ext.erp.gridPanelNomenclador, {
    constructor: function (config) {
        var _this = this;
        config.campoIdNomenclador = 'idcomunicacion';
        Ext.apply(this, config);
        this.codigo = false;
        Ext.erp.nomtipocomunicacion.superclass.constructor.apply(this, arguments);

    }
});


