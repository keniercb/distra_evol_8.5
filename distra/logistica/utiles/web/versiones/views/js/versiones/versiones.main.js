

/**
 * Created by Lisbeth 
 */
Ext.ns('LOG.utiles.versiones');

UCID.portal.cargarAcciones(window.frameElement.id, function() {
    function inicializar(datos){
        var vp = new LOG.utiles.versiones.view({
            nodos: datos
        });
        vp.show();
    }

    LOG.utiles.versiones.model.cargarProyectos(inicializar);
    
});





