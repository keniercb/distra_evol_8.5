
Ext.erp.nomsistemaconstructivo = Ext.extend(Ext.erp.gridPanelNomenclador, {
    constructor: function (config) {
        var _this = this;
        config.campoIdNomenclador = 'idsistemaconstructivo';
        Ext.apply(this, config);
        this.codigo = false;

        Ext.erp.nomsistemaconstructivo.superclass.constructor.apply(this, arguments);

    }
});


