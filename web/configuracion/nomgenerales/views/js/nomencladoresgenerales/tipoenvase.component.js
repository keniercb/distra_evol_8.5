Ext.erp.tipoenvase = Ext.extend(Ext.erp.gridPanelNomenclador, {
    constructor: function (config) {
        var _this = this;
        config.campoIdNomenclador = 'idtipoenvase';
        Ext.apply(this, config);
        this.codigo = false;
        Ext.erp.tipoenvase.superclass.constructor.apply(this, arguments);
    }
});