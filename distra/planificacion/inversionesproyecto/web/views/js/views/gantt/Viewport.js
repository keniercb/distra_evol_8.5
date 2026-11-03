Ext.QuickTips.init();
Planificacion.Integracion.mostrarInterfaz = function() {
    
    new Ext.Viewport({
        layout: 'border',
        items: [new Planificacion.Integracion.GanttPanel()]
    });

};
Ext.onReady(function() {
    Planificacion.Integracion.mostrarInterfaz();
});