UCID.portal.cargarAcciones(window.frameElement.id, function () {
    var idioma = LOG.util.UIManager.apply(log.tall.recepcion.Idioma, LOG.util.Idioma);
    var VistaSolicitud = new log.tall.recepcion.View({
        acciones: acciones_reportes,
        idioma: idioma
    });
    VistaSolicitud.init();
    VistaSolicitud.addEvents('cargainicial');
    Ext.MessageBox.wait(idioma.msCargaInicial, idioma.msjLoadMask);

//datos iniciales necesarios...
    var confInicial = 0;
    Ext.Ajax.request({
        url: '/logistica/utiles/plugin/index.php/sistemasexternos/cargarClientes',
        method: 'POST',
        callback: function (o, s, r) {
            confInicial++;
            var resp = LOG.util.UIManager.decodeAjaxResponse(r);
            VistaSolicitud.setClients(resp.datos);
            VistaSolicitud.fireEvent('cargainicial');
        }.createDelegate(this)
    });
    Ext.Ajax.request({
        url: '/logistica/talleres/ordentrabajo/index.php/ordentrabajotalleres/cargarEntidad',
        method: 'POST',
        callback: function(o, s, r) {
            var resp = LOG.util.UIManager.decodeAjaxResponse(r);
            VistaSolicitud.setEntidad(resp.datos);
        }.createDelegate(this)
    });
    var objSubmit = {};
    objSubmit.tipo = 2;
    Ext.Ajax.request({
        url: '/logistica/talleres/recepcion/index.php/solicitud/cargarEstructuras',
        method: 'POST',
        params: objSubmit,
        callback: function(o, s, r) {
            confInicial++;
            var resp = LOG.util.UIManager.decodeAjaxResponse(r);
            VistaSolicitud.setProveedores(resp.datos);
            VistaSolicitud.fireEvent('cargainicial');
        }.createDelegate(this)
    });

    VistaSolicitud.on('cargainicial', function () {
        if(confInicial > 1){
            Ext.MessageBox.hide();
            VistaSolicitud.view();
        }
    });
});