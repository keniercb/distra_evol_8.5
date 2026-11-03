UCID.portal.cargarAcciones(window.frameElement.id, function(){

    var idioma = LOG.util.UIManager.apply(LOG.tall.citas.Idioma, LOG.util.Idioma);

    var vista = new LOG.tall.citas.View({
        idioma: idioma,
        autoLoad: false,
        acciones: acciones_reportes
    });
    vista.init();
    vista.addEvents('cargainicial');
    vista.view();
    var confInicial = 0;

//datos iniciales necesarios...
    Ext.Ajax.request({
        url: '/logistica/talleres/citas/index.php/citastalleres/cargarAreasInternas',
        method: 'POST',
        params: {usarsubordinacion: (vista.grantedAction('RUsarSubordinacion'))?1:0},
        callback: function(o, s, r) {
            var resp = LOG.util.UIManager.decodeAjaxResponse(r);
            vista.setAreasInternas(resp.datos);
        }.createDelegate(this)
    });
    /*Ext.Ajax.request({
        url: '/logistica/talleres/citas/index.php/citastalleres/cargarPersonas',
        method: 'POST',
        callback: function(o, s, r) {
            var resp = LOG.util.UIManager.decodeAjaxResponse(r);
            vista.setPersonas(resp.datos);
        }.createDelegate(this)
    });*/
    Ext.Ajax.request({
        url: '/logistica/talleres/citas/index.php/citastalleres/cargarEntidad',
        method: 'POST',
        callback: function(o, s, r) {
            var resp = LOG.util.UIManager.decodeAjaxResponse(r);
            vista.setEntidad(resp.datos);
        }.createDelegate(this)
    });
    Ext.Ajax.request({
        url:'/logistica/utiles/maestroproductos/index.php/maestroproductos/cargarGridClasificador',
        method: 'POST',
        callback: function(o, s, r) {
            var resp = LOG.util.UIManager.decodeAjaxResponse(r);
            vista.setMedios(resp.datos);
        }.createDelegate(this)
    });




});