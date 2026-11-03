//Inicializando la vista.
Ext.QuickTips.init();
var perfil = window.parent.perfil;
perfil.etiquetas = Object();

Ext.Msg.wait('Cargando...', 'Por favor espere...');

Ext.Ajax.request({
    method: "POST",
    url: "cargaretiquetas",
    callback: function(options, success, response)
    {
        var etiquetas = Ext.decode(response.responseText);

        Ext.Ajax.request({
            url: 'loadDataIni',
            callback: function (options, success, response) {
                if (success) {
                    var response = Ext.decode(response.responseText);
                    fechaContable = response.dataFecha.fechacontable;
                    periodoActual = response.dataFecha.nombre;
                    fechaInicio = response.dataFecha.inicio;
                    fechaFin = response.dataFecha.fin;
                    ejercicioActual = response.ejercicio;

                    //Inicializar el modelo
                    model = Caja.DietaExt.Model;
                    model.init(1);

                    //Inicializar la vista.
                    var view = Caja.DietaExt.View;
                    view.init(perfil, etiquetas, model, 1);

                    if (response.aperturado != 0) {
                        view.panel.disable();
                     mostrarMensaje(1, etiquetas.lbCargaInicialCerrada, function (btn) {
                     if (btn == 'ok' || btn == 'cencel')
                     view.panel.disable();
                     });
                     return;
                     }

                    //Inicializar controlador.
                    var controller = Caja.DietaExt.Controller;
                    controller.init(perfil, etiquetas, view, model, 1);

                    view.lfdPeriodo.setText('Fecha contable: ' + fechaContable);
                    // view.lfdPeriodo.setText('Per\u00EDodo actual: ' + periodoActual + ' desde ' + fechaInicio + ' hasta ' + fechaFin + '|' + 'Fecha contable: ' + fechaContable);
                }
            }
        });
    }
});