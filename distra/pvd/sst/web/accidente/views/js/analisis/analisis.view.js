/**
 * @name analisisft.view - Vista de la interfaz.
 * @package   Pvd.MovimientosLaborales
 * @uses      Pvd.MovimientosLaborales.Analisisft
 * @copyright XETID.
 * @author    Centro RRHH. División Gestión de Entidades. XETID.
 *            Orestes Rodríguez Lorenzo
 * @version   1.0
 */
Ext.ns('Pvd.SST.Gestionaraccidentes.Analisis');
Ext.QuickTips.init();
Pvd.SST.Gestionaraccidentes.Analisis.Vista = {
    init: function() {
        //Vista general
        new Ext.Viewport({
            layout: 'fit',
            items: [(new Maestro.Reporte.MenuApp({idmodule:'sstaccidente'})).getMainView()]
        });
    }
};

UCID.portal.cargarEtiquetas('analisis', function(perfil, idioma){
    //Inicializando la vista.
    var vista = Pvd.SST.Gestionaraccidentes.Analisis.Vista;
    vista.init();

    //Cargando acciones de la vista
    UCID.portal.cargarAcciones(window.frameElement.id);
});
