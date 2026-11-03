
Ext.ns('Pvd.ControlAsistencia.ResumenAusentismo');
Ext.QuickTips.init();
Pvd.ControlAsistencia.ResumenAusentismo.Vista = {
    init: function() {
        //Vista general
        new Ext.Viewport({
            layout: 'fit',
            items: [(new Maestro.Reporte.MenuApp({idmodule:'asistencia'})).getMainView()]
        });
    }
};

UCID.portal.cargarEtiquetas('resumenausentismo', function(perfil, idioma){
    //Inicializando la vista.
    var vista = Pvd.ControlAsistencia.ResumenAusentismo.Vista;
    vista.init();

    //Cargando acciones de la vista
    UCID.portal.cargarAcciones(window.frameElement.id);
});
