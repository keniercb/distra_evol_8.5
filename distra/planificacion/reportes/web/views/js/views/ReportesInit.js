/**
 * Fichero que contiene el objeto del Panel General del componente Causa y Efecto.
 * 
 * @author dtejeda
 * @version 1.0
 */
var reportes = new function() {
    Ext.QuickTips.init();

    return {
        create : function(params) {
            if (params) {

                var win = new Planificacion.Sistemas.ReportesWindow({params: params});
                return win.show(true);

            } else {
                mostrarMensaje(1, 'No existen datos para crear el reporte.');
            }
        },

        convertImageToBase64 : function(url, outputFormat, output, width, height) {

            var controller = new Planificacion.Sistemas.ReportesController();
            return controller.convertImageToBase64(url, outputFormat, output, width, height);
        }

    }


}

