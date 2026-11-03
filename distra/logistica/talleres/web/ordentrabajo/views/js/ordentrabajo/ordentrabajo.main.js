UCID.portal.cargarAcciones(window.frameElement.id, function(){

    var idioma = LOG.util.UIManager.apply(LOG.tall.ordentrabajo.Idioma, LOG.util.Idioma);

    var vista = new LOG.tall.ordentrabajo.View({
        idioma: idioma,
        autoLoad: false,
        acciones: acciones_reportes
    });
  //  vista.attachPlugin(new LOG.lb.plugin.EstadoEjecucion());
    vista.init();
    vista.addEvents('cargainicial');
    //Ext.MessageBox.wait(idioma.msjCargandoDatosIniciales, idioma.msgEsperePorFavor);
   // Ext.MessageBox.hide();
    vista.view();
    var confInicial = 0;

//datos iniciales necesarios...
   /* Ext.Ajax.request({
        url: '/logistica/talleres/ordentrabajo/index.php/ordentrabajotalleres/cargarAreasInternas',
        method: 'POST',
        params: {usarsubordinacion: (vista.grantedAction('RUsarSubordinacion'))?1:0},
        callback: function(o, s, r) {
            var resp = LOG.util.UIManager.decodeAjaxResponse(r);
            vista.setAreasInternas(resp.datos);
        }.createDelegate(this)
    });*/
    Ext.Ajax.request({
        url: '/logistica/talleres/ordentrabajo/index.php/ordentrabajotalleres/cargarPersonas',
        method: 'POST',
        params: {
            all: 1
        },
        callback: function(o, s, r) {
            var resp = LOG.util.UIManager.decodeAjaxResponse(r);
            vista.setPersonas(resp.datos);
        }.createDelegate(this)
    });
    /*Ext.Ajax.request({
        url: '/logistica/talleres/ordentrabajo/index.php/ordentrabajotalleres/cargarActividadesExistentes',
        method: 'POST',
        params:{nivel:2},
        callback: function(o, s, r) {
            confInicial++;
            var resp = LOG.util.UIManager.decodeAjaxResponse(r);
            vista.setServicios(resp.datos);
            vista.fireEvent('cargainicial');
        }.createDelegate(this)
    });*/
    /*Ext.Ajax.request({
        url: '/logistica/utiles/plugin/index.php/sistemasexternos/cargarClientes',
        method: 'POST',
        callback: function(o, s, r) {
            confInicial++;
            var resp = LOG.util.UIManager.decodeAjaxResponse(r);
            vista.setClientes(resp.datos);
            vista.fireEvent('cargainicial');
        }.createDelegate(this)
    });*/
   /* Ext.Ajax.request({
        url: '/logistica/utiles/plugin/index.php/sistemasexternos/cargarProveedores',
        method: 'POST',		
        callback: function(o, s, r) {
            confInicial++;
            var resp = LOG.util.UIManager.decodeAjaxResponse(r);
            vista.setProveedores(resp.datos);
            vista.fireEvent('cargainicial');
        }.createDelegate(this)
    });*/
    Ext.Ajax.request({
        url: '/logistica/talleres/ordentrabajo/index.php/ordentrabajotalleres/cargarEntidad',
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

    /*
    vista.on('cargainicial',function(){
        if(confInicial >0){
            Ext.MessageBox.hide();
            vista.view();
        }
    });*/


});


