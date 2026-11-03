
Ext.erp.nomconstructiva = Ext.extend(Ext.erp.gridPanelNomenclador, {
    constructor: function (config) {
        var _this = this;
        config.campoIdNomenclador = 'idconstructiva';
        Ext.apply(this, config);
        this.codigo = false;
        Ext.erp.nomconstructiva.superclass.constructor.apply(this, arguments);

    }
});


