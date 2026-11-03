/*
 * Interfaz para el componente de graficador.
 * @author Yulier Camilo Garrido Garrido
 * fecha de creación 10/3/2014
 * @version 1.0
 */
Ext.QuickTips.init();
Std.Base.Graficador.PanelGraficador.mostrarInterfaz = function() {
    Std.Base.Graficador.GraficadorController.controllerInstance = new Std.Base.Notam.FlujoInformativo.GraficadorController();
            
     var objetoPanel = new Std.Base.Graficador.PanelGraficador({
        controller: Std.Base.Graficador.GraficadorController.controllerInstance
    });    
    
    new Ext.Viewport({
        layout: 'border',
        items: [objetoPanel]
    });
}

Ext.onReady(function() {
    UCID.security.setFuncionalityId(window.frameElement.id);
    UCID.security.loadAccessList(window.frameElement.id, function() {
        //Mando a mostrar la interfaz  
        Std.Base.Graficador.PanelGraficador.mostrarInterfaz();
    });
});
