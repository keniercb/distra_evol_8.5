/**
 * Viewport para el componente de Curvaconflicto
 *
 * @copyright XETID Cuba
 * @author Ing. Frank David Corona Prendes
 * @version 1.0
 */
Ext.QuickTips.init();
Planificacion.Integracion.mostrarInterfaz = function () {
    var pComponente = new Planificacion.Integracion.CurvaconflictoPanel();

    /**
     * Viewport principal del componente Curvaconflicto
     * @author Ing. Frank David Corona Prendes
     * @copyright XETID Cuba
     * @type {Ext.Viewport}
     */
    var vpPrincipal = new Ext.Viewport({
        layout: 'border',
        items: [pComponente]
    });

};
Ext.onReady(function () {
    Planificacion.Integracion.mostrarInterfaz();
});