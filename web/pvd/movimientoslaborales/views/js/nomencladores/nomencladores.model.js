/*
 * Nomencladores.
 *
 * @author Ing.Yaricel Guerra Velázquez
 * @package Pvd.MovimientosLaborales
 * @uses Pvd.MovimientosLaborales.Nomencladores
 * @copyright XETID
 * @version 1.0
 */

Ext.ns('Pvd.MovimientosLaborales.Nomencladores');
Pvd.MovimientosLaborales.Nomencladores.Modelo = {
    init: function() {
        this.tlMenu = new Ext.tree.TreeLoader({
            dataUrl: '/pvd/movimientoslaborales/views/js/nomencladores/menu.json',
            preloadChildren: true
        });
    }
};