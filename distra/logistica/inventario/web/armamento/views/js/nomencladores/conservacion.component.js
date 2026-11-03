/**
 * Created by W-01223 on 23/01/15.
 */
Ext.ns('Ext.erp');

Ext.erp.conservacion = Ext.extend(Ext.erp.gridPanelNomenclador, {
    /**
     *
     **/
    constructor: function (config) {
        var _this = this;
        Ext.apply(this, config);
        this.campoIdNomenclador = 'idconservacion';
        config.codigo = false;

        Ext.erp.conservacion.superclass.constructor.call(this, config);
    }
});