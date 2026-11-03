/*
 *
 * @copyright XETID Cuba
 * @author rygarcia
 * @version 1.0
 */

Ext.namespace('Planificacion.Integracion');
Ext.QuickTips.init();
Planificacion.Integracion.mostrarInterfaz = function() {
    var pComponente = new Planificacion.Integracion.MatrizrelacionesPanel();

    var vpPrincipal = new Ext.Viewport({
        layout :'border',
        items  :[pComponente]
    });

}

Ext.onReady(function() {
    Planificacion.Integracion.mostrarInterfaz();
});