
Ext.erp.nomsistemaenergetico = Ext.extend(Ext.erp.gridPanelNomenclador, {
    constructor: function (config) {
        var _this = this;
        config.campoIdNomenclador = 'idenergetico';
        Ext.apply(this, config);
        this.codigo = false;

        Ext.erp.nomsistemaenergetico.superclass.constructor.apply(this, arguments);

    }
});


