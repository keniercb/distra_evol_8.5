
Ext.erp.nomcompartimientos = Ext.extend(Ext.erp.gridPanelNomenclador, {
    constructor: function (config) {
        var _this = this;
        config.campoIdNomenclador = 'idcompartimiento';
        Ext.apply(this, config);
        this.codigo = false;
       // this.bussinesModel = 'NomCompartimientosModel';

        Ext.erp.nomcompartimientos.superclass.constructor.apply(this, arguments);

    }
});




