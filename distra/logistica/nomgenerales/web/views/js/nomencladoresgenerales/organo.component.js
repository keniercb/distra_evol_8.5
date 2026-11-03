/**
 *  Jorge Luis Cuellar Mondeja
 *  24/07/2013
 */
Ext.ns('Ext.erp');

/*
 *  Implemetación del componente para la gestión del nomenclador naturaleza 
 */
Ext.erp.organo = Ext.extend(Ext.erp.treePanelNomenclador, {
    constructor: function(config) {
        config.campoIdNomenclador = 'idorganosatisface';
        Ext.apply(this, config);
        this.codigo = false;
        Ext.erp.organo.superclass.constructor.call(this, arguments);
    }
});
