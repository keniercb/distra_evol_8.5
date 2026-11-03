Ext.ns('Ext.erp.resumenporperiodo');

Ext.erp.resumenporperiodo.Model = Ext.extend(LOG.util.Model, {    
    constructor: function(config) {        
        Ext.erp.resumenporperiodo.Model.superclass.constructor.call(this, config);
    },
    cargarDatos: function(parametros, _fn) {
        parametros.url = '/logistica/inventario/recuperaciones/index.php/resumenporperiodo/cargarGrafica';        
        parametros.dirController = '';        
        this.cargaInicial(parametros,_fn);        
    }
});


