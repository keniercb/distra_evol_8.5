Ext.ns('Ext.erp');

Ext.erp.motivodevolucion = Ext.extend(Ext.erp.gridPanelNomenclador, {
    constructor: function(config) {
		var _this = this;
        Ext.apply(this, config);
		this.campoIdNomenclador = 'idmotivodevolucion';

        Ext.erp.motivodevolucion.superclass.constructor.call(this, config);
    }
});
