Ext.ns('Pvd.SST.Riesgo.Analisis');
Ext.QuickTips.init();
Pvd.SST.Riesgo.Analisis.Vista = {
    init: function() {
        //Vista general
        new Ext.Viewport({
            layout: 'fit',
            items: [(new Maestro.Reporte.MenuApp({idmodule:'sstriesgo'})).getMainView()]
        });
    }
};

UCID.portal.cargarEtiquetas('analisis', function(perfil, idioma){
    //Inicializando la vista.
    var vista = Pvd.SST.Riesgo.Analisis.Vista;
    vista.init();

    //Cargando acciones de la vista
    UCID.portal.cargarAcciones(window.frameElement.id);
});
