Ext.ns('Ext.erp');

Ext.erp.norma = Ext.extend(Ext.erp.gridPanelNomenclador, {
	/**
	 *
	 **/
    constructor: function(config) {
        
    	config.codigo = false;
        this.campoIdNomenclador = 'idnorma';
        this.bussinesModel = 'NomNormaModel';
        var _this = this;
        Ext.apply(this, config);		
		
        Ext.erp.norma.superclass.constructor.call(this, config);
    }
});
