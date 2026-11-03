Ext.Msg.wait('Cargando...', 'Por favor espere...');
Ext.Ajax.request({
    url: 'loadDataIni',
    method: 'POST',
    params: {
        seleccion: 1,
    },
    callback: function (options, success, response) {
        if (success) {
            var response = Ext.decode(response.responseText);
            fechaContable = response.dataFecha.fechacontable;
            periodoActual = response.dataFecha.nombre;
            fechaInicio = response.dataFecha.inicio;
            fechaFin = response.dataFecha.fin;
            ejercicioActual = response.ejercicio;
            bandera = response.bandera;
        }
        Ext.Msg.hide();
        new Desagregacion.Viewport(1,fechaContable, bandera, fechaInicio);
    }
});