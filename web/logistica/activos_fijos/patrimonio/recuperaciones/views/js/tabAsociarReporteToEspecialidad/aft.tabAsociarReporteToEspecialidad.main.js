/**
 * Yadrian Aguila Ferran
 * Fichero encargado de Asociar reporte con la especialidad
 **/
UCID.portal.cargarEtiquetas('reportetoespecialidad', function (perfil, idioma) {

    UCID.portal.cargarAcciones(window.frameElement.id, function () {
    });
	var vpAsociarReporteToEspecialidad = new Ext.Viewport({
	    layout:'fit',
		items:[ new Ext.erp.TabAsociarReporteToEspecialidad({
				etiquetas: idioma,		
				perfil: perfil
			})
		]
	});
    vpAsociarReporteToEspecialidad.show();
    vpAsociarReporteToEspecialidad.doLayout();

});