Ext.ns('Ext.erp');

Ext.erp.tipocaja = Ext.extend(Ext.erp.gridPanelNomenclador, {
    constructor: function(config) {
        config.codigo = true;     
        this.campoIdNomenclador = 'idtipocaja';
        Ext.apply(this, config);
        Ext.erp.tipocaja.superclass.constructor.call(this, config);
    }
});