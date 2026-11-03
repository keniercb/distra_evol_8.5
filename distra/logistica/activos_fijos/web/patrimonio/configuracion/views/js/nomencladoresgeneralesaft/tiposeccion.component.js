
Ext.erp.nomtiposeccion = Ext.extend(Ext.erp.gridPanelNomenclador, {
    constructor: function (config) {
        var _this = this;
        config.campoIdNomenclador = 'idseccion';
        Ext.apply(this, config);
        this.codigo = false;

        Ext.erp.nomtiposeccion.superclass.constructor.apply(this, arguments);

    }
});


