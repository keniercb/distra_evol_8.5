/**
 *  Kenier Cumba Bueno
 *  24/07/2013
 */
Ext.ns('Ext.erp');

/*
 *  Implemetación del componente para la gestión del nomenclador naturaleza 
 */
Ext.erp.tipocombustible = Ext.extend(Ext.erp.treePanelNomenclador, {
    constructor: function(config) {
        config.campoIdNomenclador = 'idtipocombustible';
        Ext.apply(this, config);
        this.codigo = false;
        Ext.erp.naturaleza.superclass.constructor.call(this, arguments);
    }
});
