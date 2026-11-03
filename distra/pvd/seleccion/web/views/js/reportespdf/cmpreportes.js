/**
 * @name analisisft.view - Vista de la interfaz.
 * @package   Pvd.Seleccion
 * @uses      Pvd.Seleccion.Reportes
 * @copyright XETID.
 * @author    Centro RRHH. División Gestión de Entidades. XETID.
 *            Beatriz Selema Alvarez
 * @version   1.0
 */
Ext.ns('Pvd.Seleccion.Reportes');
Ext.QuickTips.init();
Pvd.Seleccion.Reportes.Vista = {
    init: function() {
        //Vista general
        new Ext.Viewport({
            layout: 'fit',
            items: [(new Maestro.Reporte.MenuApp({idmodule:'seleccion'})).getMainView()]
    });
    }
};

UCID.portal.cargarEtiquetas('reportespdf', function(perfil, idioma){
    //Inicializando la vista.
    var vista = Pvd.Seleccion.Reportes.Vista;
    vista.init();

    //Cargando acciones de la vista
    UCID.portal.cargarAcciones(window.parent.idFuncionalidad);
});
