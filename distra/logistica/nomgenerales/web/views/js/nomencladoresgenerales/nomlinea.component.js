Ext.ns('Ext.erp');

Ext.erp.nomlinea = Ext.extend(Ext.erp.gridPanelNomenclador, {
    /**
     *
     **/
    constructor: function (config) {
        var _this = this;
        var _this = this;
        Ext.apply(this, config);
        this.bussinesModel = 'NomencladoresGeneralesModel';
        this.campoIdNomenclador = 'idlinea';
        config.codigo = false;
        config.usarFecha = true;

        Ext.erp.nomlinea.superclass.constructor.call(this, config);
        this.columnasNomenclador.config[1].width  = 120;
        this.columnasNomenclador.config[5].hidden = true;
        this.columnasNomenclador.config[6].hidden = true;
    }
});
