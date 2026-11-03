UCID.portal.cargarAcciones(window.frameElement.id, function () {
    var idioma = LOG.util.UIManager.apply(log.tall.inscripcion.Idioma, LOG.util.Idioma);
    var VistaInscripcion = new log.tall.inscripcion.View({
        acciones: acciones_reportes,
        idioma: idioma
    });
    VistaInscripcion.init();
    VistaInscripcion.addEvents('cargainicial');
    Ext.MessageBox.wait(idioma.msCargaInicial, idioma.msjLoadMask);

    var confInicial = 0;
    //datos iniciales necesarios...
    Ext.Ajax.request({
        url: '/logistica/utiles/plugin/index.php/sistemasexternos/cargarClientes',
        method: 'POST',
        callback: function (o, s, r) {
            confInicial++;
            var resp = LOG.util.UIManager.decodeAjaxResponse(r);
            VistaInscripcion.setClients(resp.datos);
            VistaInscripcion.fireEvent('cargainicial');
        }.createDelegate(this)
    });

    Ext.Ajax.request({
        url: '/logistica/utiles/maestroproductos/index.php/maestroproductos/cargarGridClasificador',
        method: 'POST',
        callback: function (o, s, r) {
            confInicial++;
            var resp = LOG.util.UIManager.decodeAjaxResponse(r);
            VistaInscripcion.setMedios(resp.datos);
            VistaInscripcion.fireEvent('cargainicial');
        }.createDelegate(this)
    });

    Ext.Ajax.request({
        url: '/logistica/talleres/ordentrabajo/index.php/ordentrabajotalleres/cargarActividadesExistentes',
        method: 'POST',
        params: {nivel: 3},
        callback: function (o, s, r) {
            var resp = LOG.util.UIManager.decodeAjaxResponse(r);
            VistaInscripcion.setServicios(resp.datos);
        }.createDelegate(this)
    });

    VistaInscripcion.on('cargainicial', function () {
        if (confInicial > 1) {
            Ext.MessageBox.hide();
            VistaInscripcion.view();
        }

    });


});