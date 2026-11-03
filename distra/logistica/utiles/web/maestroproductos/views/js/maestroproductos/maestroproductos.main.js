Ext.ns('LOG.lb.maestroproductos');
UCID.portal.cargarAcciones(window.frameElement.id, function() {
    var idioma = LOG.util.UIManager.apply({}, LOG.util.Idioma);
    var vistaMaestro = new LOG.lb.maestroproductos.View({
        busquedaAvanzada: false,
        atributosDinamicos: true,
        idioma: idioma,
        acciones: acciones_reportes
    });
    vistaMaestro.addEvents('cargainicial');
    Ext.MessageBox.wait(idioma.msgCargaInicial, idioma.msgEspere);
    var confInicial = 0;
    //centro balance
    Ext.Ajax.request({
        url: '/logistica/utiles/maestroproductos/index.php/maestroproductos/cargarCentrosBalance',
        method: 'POST',
        callback: function(o, s, r) {
            confInicial++;
            var resp = LOG.util.UIManager.decodeAjaxResponse(r);
            vistaMaestro.setCentroBalance(resp.datos);
            vistaMaestro.fireEvent('cargainicial');
        }.createDelegate(this)
    });
    //plan directo
    Ext.Ajax.request({
        url: '/logistica/utiles/maestroproductos/index.php/maestroproductos/cargarPlanes',
        method: 'POST',
        callback: function(o, s, r) {
            confInicial++;
            var resp = LOG.util.UIManager.decodeAjaxResponse(r);
            vistaMaestro.setPlanDirecto(resp.datos);
            vistaMaestro.fireEvent('cargainicial');
        }.createDelegate(this)
    });
    if(typeof centrobalance == 'undefined' || !centrobalance){
        vistaMaestro.attachPlugin(new LOG.lb.maestroproductos.PluginEspecialidad());
    }
    if (planificacion) {
        vistaMaestro.attachPlugin(new LOG.lb.maestroproductos.NivelPlan());
        //vistaMaestro.attachPlugin(new LOG.lb.maestroproductos.ViewSwitcher());
    }
    vistaMaestro.attachPlugin(new LOG.lb.plugin.CodigoCliente(vistaMaestro.getselectedNode()));
    vistaMaestro.attachPlugin(new LOG.lb.plugin.Sustituto(vistaMaestro.getselectedNode()));
    vistaMaestro.init();
    vistaMaestro.on('cargainicial',function(){

        if(confInicial >1){
            vistaMaestro.view();
            Ext.MessageBox.hide();
        }

    });

});