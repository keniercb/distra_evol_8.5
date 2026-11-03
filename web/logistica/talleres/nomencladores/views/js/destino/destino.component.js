Ext.ns('Ext.erp');

Ext.erp.nomdestino = Ext.extend(Ext.erp.gridPanelNomenclador, {
    /**
     *
     **/
    constructor: function (config) {
        var _this = this;
        this.bussinesModel = 'NomDestinoModel';
        this.campoIdNomenclador = 'iddestino';
        config.codigo = false;
        config.usarFecha = true;
        Ext.erp.nomdestino.superclass.constructor.call(this, config);
        this.columnasNomenclador.config[1].width  = 120;
        this.columnasNomenclador.config[5].hidden = true;
        this.columnasNomenclador.config[6].hidden = true;
    }
});
