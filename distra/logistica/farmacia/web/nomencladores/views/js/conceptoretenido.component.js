/**
 * Created by W-01223 on 23/01/15.
 */
Ext.ns('Ext.erp');
Ext.erp.conceptoretenido = Ext.extend(Ext.erp.gridPanelNomenclador, {
    constructor: function (config) {
        var _this = this;
        Ext.apply(this, config);
        _this.campoIdNomenclador = 'idconceptorete';
        config.codigo = true;
        
        Ext.erp.conceptoretenido.superclass.constructor.call(this, config);
    }
});