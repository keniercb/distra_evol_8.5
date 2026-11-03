
Ext.erp.nomtipopuntofuego = Ext.extend(Ext.erp.gridPanelNomenclador, {
    constructor: function (config) {
        var _this = this;
        config.campoIdNomenclador = 'idpuntofuego';
        Ext.apply(this, config);
        this.codigo = false;
        Ext.erp.nomtipopuntofuego.superclass.constructor.apply(this, arguments);

    }
});


