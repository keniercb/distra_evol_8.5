/**
 * @name analisisft.view - Vista de la interfaz.
 * @package   Pvd.Seleccion
 * @uses      Pvd.Seleccion.Reportes
 * @copyright XETID.
 * @author    Centro RRHH. División Gestión de Entidades. XETID.
 *            Beatriz Selema Alvarez
 * @version   1.0
 */
Ext.ns('Pvd.MovimientosLaborales.Reportcaract');
Ext.QuickTips.init();
Pvd.MovimientosLaborales.Reportcaract.Vista = {
    init: function() {
        //Vista general
        new Ext.Viewport({
            layout: 'fit',
            items: [(new Maestro.Reporte.MenuApp({idmodule:'movimientoslaborales'})).getMainView()]
    });
    }
};

UCID.portal.cargarEtiquetas('reportcaract', function(perfil, idioma){
    //Inicializando la vista.
    var vista = Pvd.MovimientosLaborales.Reportcaract.Vista;
    vista.init();

    //Cargando acciones de la vista
    UCID.portal.cargarAcciones(window.frameElement.id);
});
