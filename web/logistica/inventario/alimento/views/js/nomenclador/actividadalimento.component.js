Ext.ns('Ext.erp');

Ext.erp.actividadalimento = Ext.extend(Ext.erp.gridPanelNomenclador, {
    /**
     *
     **/
    constructor: function (config) {

        config.codigo = false;
        this.campoIdNomenclador = 'idactividadalimento';
        var _this = this;
        Ext.apply(this, config);

        Ext.erp.actividadalimento.superclass.constructor.call(this, config);
    }
});
