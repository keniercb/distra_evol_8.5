
Ext.erp.nomregimen = Ext.extend(Ext.erp.gridPanelNomenclador, {
    constructor: function (config) {
        var _this = this;
        config.campoIdNomenclador = 'idregimen';
        Ext.apply(this, config);
        this.codigo = false;
        //this.bussinesModel = 'RegimenModel';

        Ext.erp.nomregimen.superclass.constructor.apply(this, arguments);

    }
});


