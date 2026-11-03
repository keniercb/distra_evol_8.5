
/*
 * Nomencladores.
 *
 * @author Ing.Yaricel Guerra Velázquez
 * @package Pvd.Seleccion
 * @uses Pvd.Seleccion.Nomencladores
 * @copyright XETID
 * @version 1.0
 */
 
 Ext.ns('Pvd.Seleccion.Nomencladores');

///////////////////////////////////////Modelo de la Interfaz///////////////////////////////////////////////////////

Pvd.Seleccion.Nomencladores.Modelo = {
    /**
     * Inicializar el modelo de la vista.
     */
    init: function() {
        this.tlMenu = new Ext.tree.TreeLoader({
            dataUrl: '/pvd/seleccion/views/js/nomencladores/menu.json',
            preloadChildren: true
        });
    }
};
