
Ext.erp.nomtipoposicionfuego = Ext.extend(Ext.erp.gridPanelNomenclador, {
    constructor: function (config) {
        var _this = this;
        config.campoIdNomenclador = 'idposicionfuego';
        Ext.apply(this, config);
        this.codigo = false;

        Ext.erp.nomtipoposicionfuego.superclass.constructor.apply(this, arguments);

    }
});


