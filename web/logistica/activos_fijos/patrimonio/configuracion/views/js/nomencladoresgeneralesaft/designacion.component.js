
Ext.erp.nomdesignacion = Ext.extend(Ext.erp.gridPanelNomenclador, {
    constructor: function (config) {
        var _this = this;
        config.campoIdNomenclador = 'iddesignacion';
        Ext.apply(this, config);
        this.codigo = false;
        //this.bussinesModel = 'DesignacionModel';

        Ext.erp.nomdesignacion.superclass.constructor.apply(this, arguments);

    }
});


