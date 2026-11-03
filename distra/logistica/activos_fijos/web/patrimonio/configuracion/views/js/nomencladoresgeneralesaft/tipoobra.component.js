


Ext.erp.nomtipoobra = Ext.extend(Ext.erp.gridPanelNomenclador, {
    constructor: function (config) {
        var _this = this;
        config.campoIdNomenclador = 'idtipoobra';
        Ext.apply(this, config);
        this.codigo = false;
       // this.bussinesModel = 'TipoObraModel';

        Ext.erp.nomtipoobra.superclass.constructor.apply(this, arguments);

    }
});
