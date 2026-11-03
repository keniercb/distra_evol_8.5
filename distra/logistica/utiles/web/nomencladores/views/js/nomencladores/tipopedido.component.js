Ext.ns('Ext.erp');

Ext.erp.tipopedido = Ext.extend(Ext.erp.gridPanelNomenclador, {
	/**
	 *
	 **/
    constructor: function(config) {
    	config.codigo = false;
        var _this = this;
        Ext.apply(this, config);
        this.bussinesModel = 'NomTipopedidoModel';
        this.campoIdNomenclador = 'idnomtipopedido';
		
        Ext.erp.tipopedido.superclass.constructor.call(this, config);
    },
    initFormFields: function(){
        var _this = this;
    }
});
