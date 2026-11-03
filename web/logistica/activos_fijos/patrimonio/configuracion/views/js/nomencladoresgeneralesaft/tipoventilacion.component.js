
Ext.erp.nomtipoventilacion = Ext.extend(Ext.erp.gridPanelNomenclador, {
    constructor: function (config) {
        var _this = this;
        config.campoIdNomenclador = 'idventilacion';
        Ext.apply(this, config);
        this.codigo = false;
        Ext.erp.nomtipoventilacion.superclass.constructor.apply(this, arguments);

    }
});


