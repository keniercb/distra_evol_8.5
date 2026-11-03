/**
 * @name analisisft.view - Vista de la interfaz.
 * @package   Pvd.MovimientosLaborales
 * @uses      Pvd.MovimientosLaborales.Analisisft
 * @copyright XETID.
 * @author    Centro RRHH. División Gestión de Entidades. XETID.
 *            Orestes Rodríguez Lorenzo
 * @version   1.0
 */
Ext.ns('Pvd.MovimientosLaborales.Analisisft');
Ext.QuickTips.init();
Pvd.MovimientosLaborales.Analisisft.Vista = {
    init: function() {
        //Vista general
        new Ext.Viewport({
            layout: 'fit',
            items: [(new Maestro.Reporte.MenuApp({idmodule:'ft'})).getMainView()]
        });
    }
};

UCID.portal.cargarEtiquetas('analisisft', function(perfil, idioma){
    //Inicializando la vista.
    var vista = Pvd.MovimientosLaborales.Analisisft.Vista;
    vista.init();

    //Cargando acciones de la vista
    UCID.portal.cargarAcciones(window.frameElement.id);
});
