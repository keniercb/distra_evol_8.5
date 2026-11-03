/**
 * Created by Tony on 24/10/2014.
 */
Ext.ns('Ext.erp');

Ext.erp.formapago = Ext.extend(Ext.erp.gridPanelNomenclador, {

    constructor: function(config) {
        var _this = this;
        config.codigo = false;
        Ext.apply(this, config);
        this.campoIdNomenclador = 'idnomformapago';
        Ext.erp.formapago.superclass.constructor.call(this, config);
    }
});