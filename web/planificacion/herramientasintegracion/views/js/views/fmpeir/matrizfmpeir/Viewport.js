/*
 *
 * @copyright XETID Cuba
 * @author ammejias
 * @version 1.0
 */

Ext.QuickTips.init();
Planificacion.Integracion.mostrarInterfaz = function() {
    var pComponente = new Planificacion.Integracion.Proyecto();

    var vpPrincipal = new Ext.Viewport({
        layout :'border',
        items  :[pComponente]
    });

}
Ext.onReady(function() {
    Planificacion.Integracion.mostrarInterfaz();
});