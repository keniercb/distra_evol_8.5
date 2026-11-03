Ext.ns('Ext.erp');

Ext.erp.tipocalidad = Ext.extend(Ext.erp.gridPanelNomenclador, {
    constructor: function(config) {
        config.codigo = false;
        config.campoIdNomenclador = 'idcalidad';
        Ext.apply(this, config);
        Ext.erp.tipocalidad.superclass.constructor.call(this, config);
    }
});
