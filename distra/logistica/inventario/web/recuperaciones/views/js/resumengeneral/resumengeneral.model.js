Ext.ns('Ext.erp.resumengeneral');

Ext.erp.resumengeneral.Model = Ext.extend(LOG.util.Model, {    
    constructor: function(config) {       
        Ext.erp.resumengeneral.Model.superclass.constructor.call(this, config);
    },
    cargarDatos: function(parametros, _fn) {
        parametros.url = '/logistica/inventario/recuperaciones/index.php/resumengeneral/cargarGrafica';
        parametros.dirController = '';
        this.cargaInicial(parametros,_fn);        
    }
});


