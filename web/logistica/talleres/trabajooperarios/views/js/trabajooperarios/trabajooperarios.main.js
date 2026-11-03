UCID.portal.cargarAcciones(window.frameElement.id, function(){

    var idioma = LOG.util.UIManager.apply(LOG.tall.trabajooperarios.Idioma, LOG.util.Idioma);

    var vista = new LOG.tall.trabajooperarios.GridPrincipal({
        idioma: idioma,
        autoLoad: false,
        acciones: acciones_reportes,
        // fechaContable: V_fecha,
        // fechaInicio: V_fechainicio,
        // fechaFin: V_fechafin,
    });

    var vistaDetalle = new LOG.tall.trabajooperarios.GridDetalle({
        idioma: idioma,
        autoLoad: false,
        acciones: acciones_reportes
    });

    vista.init();
    vistaDetalle.init();
    var a = vista.view();
    var b = vistaDetalle.view();
    b.disable();

    // var validador = new LOG.util.ComprobarCond('sad');
    // console.log(validador);
    // var resval = validador
    //     .add('', validador.AND, function () {
    //         return true;
    //     })
    //     .add('', validador.AND, function () {
    //         return true;
    //     })
    // ;
    // console.log(resval);

    vista.getGridPrincipal().getSelectionModel().on({
        selectionchange: function (sm) {
            if (sm.getCount() === 1) {
                var record = sm.getSelected();
                var parametros = vista.cargarParametrosBase();
                var lastParams = Ext.apply({}, vista.ultimasOpcionesCargadas.params);
                lastParams.criterioper = lastParams.criterio;
                delete lastParams.criterio;
                vistaDetalle.cargarComponente(
                    record.get('idresponsable'),
                    lastParams,
                    vista.validador.isValid
                );
            } else {
                vistaDetalle.limpiarComponente();
            }
        }
    });


    var contenVista = new LOG.util.Panel({
        // title: this.idioma.tlPiezasMedios,
        // autoHeight: true,
        layout: 'border',
        frame: true,
        region: 'center',
        items: [a]
    });
    var contenDetalle = new LOG.util.Panel({
        // title: this.idioma.tlActividades,
        // autoHeight: true,
        layout: 'border',
        frame: true,
        // collapsible: true,
        width: '55%',
        region: 'east',
        items: [b],
        // listeners: {
        //     'expand' : function(p){
        //         _this.materiales.setHeight(_this.materiales.getHeight()/2);
        //     },
        //     'collapse' : function(p){
        //         _this.materiales.setHeight(_this.materiales.getHeight()*2);
        //     }
        // }
    });

    var btnGuardar = LOG.util.Prototipos.botonGuardar({
        handler: function () {
            if (vista.isValid() || vistaDetalle.isValid()) {
                var pa = vista.cargarParametrosBase();
                var parametros = {
                    operarios: Ext.encode(vista.getModificaciones()),
                    operariosdetalle: Ext.encode(vistaDetalle.getModificaciones()),
                    idPeriodo: pa.idPeriodo,
                };

                Ext.Ajax.request({
                    url: '/logistica/talleres/trabajooperarios/index.php/trabajooperarios/guardarDatos',
                    method: 'POST',
                    scope: undefined,
                    params: parametros,
                    callback: function(options, success, response)
                    {
                        var responseData = Ext.decode(response.responseText);
                        if (responseData.success) {
                            mostrarMensaje(1, 'Se ha adicionado correctamente.');
                            vista.getStorePrincipal().load();
                        }
                    }
                });
            }
        }
    });

    var panelGeneral = new LOG.util.Panel({
        // autoHeight: true,
        layout: 'border',
        frame: false,
        region: 'center',
        // bbar: ['->', btnGuardar],
        items: [contenVista, contenDetalle]
    });

    var objCargador = {
        contador: 0,
        intentarCargarVista: function () {
            this.contador++;
            if (this.contador === 2) {
                this.cargarVistaPrincipal();
            }
        },
        cargarVistaPrincipal: function () {
            LOG.util.UIManager.initViewport([panelGeneral]).doLayout();
            vista.getGridPrincipal().getStore().load();
        }
    };

    Ext.Ajax.request({
        url: '/logistica/talleres/trabajooperarios/index.php/trabajooperarios/cargarPersonas',
        method: 'POST',
        callback: function(o, s, r) {
            var resp = LOG.util.UIManager.decodeAjaxResponse(r);
            vista.setPersonas(resp.datos);
            objCargador.intentarCargarVista();
        }.createDelegate(this)
    });

    Ext.Ajax.request({
        url: '/logistica/talleres/trabajooperarios/index.php/trabajooperarios/cargarDatosEjerMes',
        method: 'POST',
        callback: function(o, s, r) {
            var resp = LOG.util.UIManager.decodeAjaxResponse(r);
            vista.setDatosEjerMes(resp.datos);
            objCargador.intentarCargarVista();
        }.createDelegate(this)
    });
});