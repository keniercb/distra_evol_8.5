/**
 * Fichero que contiene el objeto Viewport del componente Causa y Efecto.
 * 
 * @author ohgonzalez 
 * @version 1.0
 */

/*
 * Inicializa el singlenton Ext.QuickTips para los tooltips.
 */
Ext.QuickTips.init();

/*
 * Inicializa el renderizado de los vistas.
 */
Ext.onReady(function() {
    
    var panel = new Planificacion.Integracion.CausaefectoPanel();

    new Ext.Viewport({
        layout: 'border',
        items: [panel]
    });

});


