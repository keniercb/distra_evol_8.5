/**
 * @class documentoSolicitudentrega.model
 * (Descripcion de la clase, objetivo)
 * 
 * @package Inventario
 * @subpackage Salida
 * @author Osmel A. Larduet Hechavarría
 * @copyright XETID
 * @version 1.0
 */
Ext.ns('LOG.inv.salida.documentoSolicitudentrega'); 
 
LOG.inv.salida.documentoSolicitudentrega.Model = Ext.extend(LOG.lb.documento.Model, 
{ 
    eliminarMov:'eliminarMovimientos', 
    listaProductos: undefined, 
    
    constructor: function(config)
    {       
        config.fields = [ 
            { 
                name: 'cliente'
            },
            { 
                name: 'codigocliente'
            },
            { 
                name: 'descripcliente'
            },
            { 
                name: 'codigocentrogrupo'
            },
            { 
                name: 'observaciones'
            }
        ]; 
        LOG.inv.salida.documentoSolicitudentrega.Model.superclass.constructor.call(this, config); 
    }
});

