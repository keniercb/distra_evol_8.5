Ext.ns('Pvd.Nomina.Pago.Retencion');

//Controlador de la vista del componente Gestionar retenciones.
Pvd.Nomina.Pago.Retencion.Controlador = {
    /**
     * Inicializar el controlador de la vista.
     *
     * @param idioma            Objeto que contiene el idioma de los textos de la IU (Tipo: Object).
     * @param vista             Vista general del componente Gestionar retenciones (Tipo: Pvd.Nomina.Pago.Retencion.Vista)
     * @param modelo            Modelo de la vista del componente Gestionar retenciones (Tipo: Pvd.Nomina.Pago.Retencion.Modelo)
     */
    init: function (idioma, vista, modelo) {

        var variablesGenerales = {
            identidad: 0,
            idpersona: 0,
            accion: 'Add',
            cambio: 0,
            cambioop: 0,
            arrayindicadores: new Array(),
            arrayidsexpresionmatematica: new Array(),
            datos: 0,
            reload:1
        };

        vista.btnAdicionarPersonas.on('click', function () {
            vista.gpPersonas.Buscar();
            vista.winPersonas.show();
        });
        vista.btnAceptarPersonas.on('click', function () {
            vista.winPersonas.show();
            var selections = vista.gpPersonas.getSelectedRows();
            adicionarPersonasSubmayor(selections);
        });
        
        //Eventos del grid de persona.
        vista.gpPersonas.on('personaselecionada', function (sel) {
            vista.btnAceptarPersonas.enable();
        });
        vista.gpPersonas.on('personanoselecionada', function (sel) {
            if (vista.gpPersonas.getSelectedRows().length > 0) {
                vista.btnAceptarPersonas.enable();
            } else {
                vista.btnAceptarPersonas.disable();
            }
        });      
        /***************************** vista del btn de eliminar persona *********************************/
        vista.btnEliminarPersonas.on('click', function () {
            //Validando que la persona que se va a eliminar no tenga operaciones
            mostrarMensaje(2, 'Esta seguro que desea eliminar a <b>las personas seleccionadas</b> del Submayor de Retenciones', function (btn) {
                if (btn == 'ok') {
                    var arrypersonas = Array();
                    var arrdatos = vista.gpPersonasRetencionAlta.getSelectionModel().getSelections();
                    Ext.each(arrdatos, function (v) {
                        arrypersonas.push(v.data.idpersona);
                    });
                    PVD.mostrarMascara('idmaskval', 'Por favor espere...', 'Enviando datos');
                    Ext.Ajax.request({
                        url: 'validarEliminarPersonasRetencion',
                        params: {
                            identidad: variablesGenerales.identidad,
                            arrypersonas: Ext.encode(arrypersonas)
                        },
                        callback: function (options, succes, response) {
                            PVD.ocultarMascara('idmaskval');
                            var respuesta = Ext.decode(response.responseText);
                            if (respuesta.codigo == 'noexistenretenciones') {
                                eliminarPersonasRetencion();
                            } else {
                                mostrarMensaje(3, 'No se pueden eliminar las personas personas: <b>' + respuesta.nombrespersona + '</b> del submayor de retenciones ya que tienen retenciones acumuladas');
                            }
                        }
                    });
                }
            });
        });
        /***************************** vista delos botones personas alta *********************************/   
        // buscar persona   
        vista.btnBuscar.setHandler(function () {
            modelo.storePersRetenc.load(
                {
                    params: {
                        identidad: vista.idestructura,
                        start: 0,
                        limit: 15,
                        texto: vista.tfbuscar.getValue()
                    }
                });
        });
        //btnLimpiar limpiar
        vista.btnLimpiar.setHandler(function () {
            modelo.storePersRetenc.load(
                {
                    params: {
                        identidad: vista.idestructura,
                        start: 0,
                        limit: 15,
                        texto: vista.tfbuscar.setValue('')
                    }
                });
        });
        //******************************************** Personas Baja ***************************************************
        // buscar personas bajas
        vista.btnBuscarBajas.setHandler(function () {
            modelo.storePersRetencBaj.load(
                {
                    params: {
                        identidad: vista.idestructura,
                        start: 0,
                        limit: 15,
                        texto: vista.tfbuscarBajas.getValue()
                    }
                });
        });
        //btnLimpiarBajas limpiar
        vista.btnLimpiarBajas.setHandler(function () {
            modelo.storePersRetencBaj.load(
                {
                    params: {
                        identidad: vista.idestructura,
                        start: 0,
                        limit: 15,
                        texto: vista.tfbuscarBajas.setValue('')
                    }
                });
        });
        /****** Mostrar en una ventana los datos del pago y de la persona seleccionada ***************/
        vista.gpHistRetenc.getSelectionModel().on('rowselect', function (sm, rowIdx, r) {
            variablesGenerales.datos = r.data;
        }.createDelegate(this));

        vista.btnDatos.setHandler(function () {

            vista.datosgeneralesub.CompletarDatos(variablesGenerales.datos, variablesGenerales.idpersona);
            vista.datosgeneralesub.show();

        }.createDelegate(this));

        //******Mostrar en una ventana los datos generales de la nomina y de la persona seleccionada
        vista.winEstructura.show();
        modelo.storeTipoRetencion.load();
        //modelo.cmbOperaciones.load();
        //Se deshabilitan los botones de gestionar retenciones.
        vista.btnAdicionarRetenc.disable();
        vista.btnModificarRetenc.disable();
        vista.btnEliminarRetenc.disable();

        //Evento del componente de entidades
        vista.pobjestructura.on('estructuraselecionada', function (sm, nodo) {
            //if (nodo.attributes.tipoestructura == 3) {
            vista.btnAceptarEntidad.enable();
            variablesGenerales.identidad = nodo.id;
            vista.idestructura = nodo.id;
            vista.objListarPeriodosPagos.identidad = nodo.id;
            //}
        }.createDelegate(this));

        //Evento del botón de estructuras.
        vista.btnAceptarEntidad.setHandler(function () {
            vista.winGestRetenciones.show();
            vista.gpPersonas.CambiarEntidad(vista.idestructura);
            vista.gpPersonas.Buscar();
            modelo.storePersRetenc.baseParams.identidad  = vista.idestructura;         
            modelo.storePersRetenc.load({
                params: {
                    start: 0,
                    limit: 20
                }
            });
            modelo.storePersRetencBaj.baseParams.identidad  = vista.idestructura; 
            modelo.storePersRetencBaj.load({
                params: {
                    start: 0,
                    limit: 20
                }
            });
            //vista.gpPersonas.gpPersonabuscar.getTopToolbar().addItem(vista.btnExportarRetencionesTodasPersonas)
        }.createDelegate(this));

        //Eventos del grid de PersonasRetencionBaja.
        vista.smPersonasRetencionBaja.on('rowselect', function (sm, index, store){  
            variablesGenerales.idpersona = sm.getSelected().data.idpersona;         
            modelo.storeRetencHistorico.removeAll();
            modelo.storeRetencHistorico.load({params: {limit: 15, start: 0}});
        });

        //Eventos del grid de PersonasRetencionAlta.
        vista.smPersonasRetencionAlta.on('rowselect', function (sm, index, store) {
            //Se obtiene el id de la persona.
            variablesGenerales.idpersona = sm.getSelected().data.idpersona;
            //Se habilita el adicionar y se carga el store de retenciones.
            vista.btnAdicionarRetenc.enable();           
            vista.btnExportarRetenciones.enable();
            modelo.storeRetenc.removeAll();
            modelo.storeRetencHist.removeAll();
            modelo.storeRetenc.load({params: {limit: 15, start: 0}});
            modelo.storeRetencHistorico.load({params: {start: 0, limit: 15}});
            modelo.storeOperacionesRetencHist.removeAll();           
            // habilitar el boton btnEliminarPersonas para eliminar una persona del listado de retenciones
            vista.btnEliminarPersonas.enable();
        });
        vista.smPersonasRetencionAlta.on('rowdeselect', function (sm, index, store) {
            vista.btnAdicionarRetenc.disable();
            vista.btnModificarRetenc.disable();
            vista.btnEliminarRetenc.disable();
            modelo.storeRetenc.removeAll();
        });
        //Eventos del store de retenciones de una persona.
        modelo.storeRetenc.on('beforeload', function (store) {
            store.baseParams.identidad = variablesGenerales.identidad;
            store.baseParams.idpersona = variablesGenerales.idpersona;
            //Se deshabilitan los botones y se limpia el store de retenciones.
            vista.btnModificarRetenc.disable();
            vista.btnEliminarRetenc.disable();
            store.removeAll();
        });

        //Eventos del store de retenciones de una persona.
        modelo.storeRetencHistorico.on('beforeload', function (store) {
            store.baseParams.identidad = variablesGenerales.identidad;
            store.baseParams.idpersona = variablesGenerales.idpersona;
            //Se deshabilitan los botones y se limpia el store de retenciones.
            store.removeAll();
        });

        //Eventos del grid de retenciones.
        vista.gpRetenc.on('rowdblclick', function (e) {
            mostrarVentanaModificarRetenc();
        });

        vista.cbxcuenta.on(
            {
                scope: this,

                select: function (combo, record, rowIndex) {
                    // var recordCmb = vista.cmbtipocta.store.getAt(vista.cmbtipocta.store.find('tipocuenta', vista.cmbtipocta.getValue()));
                    vista.cbxcuenta.tipocta = 2;
                    vista.cuentacontable.setValue(record.data.idcuenta);
                },
                expand: function () {
                    /*var recordGrid = this.gridAsiento.getStore().getAt(this.gridAsiento.rowEditing);*/
                    //   modelo.stcuenta.load({ baseParams: { tipocta: 2,  idsubsistema:71 }});
                    var tree = vista.cbxcuenta.tree;
                    if (Ext.isEmpty(vista.cbxcuenta.getValue())) {
                        tree.getSelectionModel().clearSelections();
                    } else {
                        tree.getSelectionModel().select(tree.getNodeById(vista.cbxcuenta.getValue()));
                    }
                }
            }
        );

        vista.cbxcuenta.tree.getLoader().on(
            {
                beforeload: function () {
                    //Antes de realizar cualquier peticion se verifica si
                    //actulamente el treeLoader está realizando una petición,
                    //y casi simultaneamente se realizó otra, en ese caso
                    //se aborta la petición anterior y se continua con la última
                    //realizada.
                    //  modelo.stcuenta.load({Params: { tipocta: 2,  idsubsistema:71 }});
                    if (this.isLoading()) {
                        Ext.Ajax.abort(this.transId);
                    }
                }
            }
        );

        vista.cbxcuenta.on('change', function (tf, n, o) {
            variablesGenerales.cambio = 1;
        });

        vista.cbxcuenta.tree.getLoader().on(
            {
                beforeload: function () {
                    //Antes de realizar cualquier peticion se verifica si
                    //actulamente el treeLoader está realizando una petición,
                    //y casi simultaneamente se realizó otra, en ese caso
                    //se aborta la petición anterior y se continua con la última
                    //realizada.
                    //  modelo.stcuenta.load({Params: { tipocta: 2,  idsubsistema:71 }});
                    if (this.isLoading()) {
                        Ext.Ajax.abort(this.transId);
                    }
                }
            }
        );

        vista.winGestCondicionesRetenc.on('show', function () {
            modelo.cmbOperaciones.load();
            /*Ext.Ajax.request({
                url: 'obtenerOperacionesContables',
                method: 'POST',
                params: {
                    idestructura: vista.idestructura
                },
                callback: function (options, success, response) {
                    PVD.ocultarMascara('idmaskop');
                    
                    responseData = Ext.decode(response.responseText);
                    vista.cmboxOperaciones.store = responseData.datos.map(function(value){
                        return value;
                    });

                }.createDelegate(this)
            });*/
        });

        vista.cmboxOperaciones.on('change', function () {
            variablesGenerales.cambioop = 1;
        });

        vista.btnGuardarCondic.on('click', function () {
            if (variablesGenerales.cambioop == 1) {
                PVD.mostrarMascara('idmaskop', idioma.lbMsgEsperaEnviarDatos, 'Guardando la operacion');
                Ext.Ajax.request({
                    url: 'guardarOperacionesContables',
                    method: 'POST',
                    params: {
                        idoperacion: vista.cmboxOperaciones.getValue(),
                        idestructura: vista.idestructura
                    },
                    callback: function (options, success, response) {
                        PVD.ocultarMascara('idmaskop');
                        responseData = Ext.decode(response.responseText);
                        if (responseData == 'ok') {
                            vista.winGestCondicionesRetenc.hide();
                            mostrarMensaje(1, 'La operaci&oacute;n contable fue asociada satisfactoriamente');
                        }
                    }.createDelegate(this)
                });
                variablesGenerales.cambioop = 0;
            }
        });

        vista.btnImportar.on('click', function () {
            importarExcelRelencionesPersonas();
        })

        function importarExcelRelencionesPersonas() {
            var _this = this;

            var plantillaFotoImpCI = new Ext.XTemplate(
                '<div align="left">',
                '<img src="data:image/png;base64,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"' +
                ' height=40 width="100%" style="border:1px transparent" />',
                '</div>'
            );
            plantillaFotoImpCI.compile();

            var panel = new Ext.FormPanel({
                fileUpload: true,
                width: 200,
                autoHeight: true,
                frame: true,
                bodyStyle: 'padding: 2px 2px 2px 2px;',
                labelWidth: 50,
                defaults: {
                    anchor: '100%',
                    allowBlank: false,
                    msgTarget: 'side'
                },
                items: [
                    {
                        xtype: 'fieldset',
                        title: 'Estructura del Excel',
                        height: 80,
                        width: '100%',
                        items: {
                            layout: 'column',
                            items: [
                                {columnWidth: 1, layout: 'form', items: [plantillaFotoImpCI]}
                            ]
                        }
                    },
                    {
                        xtype: 'fileuploadfield',
                        id: 'subir',
                        name: 'fileUpload',
                        width: 100,
                        fieldLabel: 'Archivo',
                        emptyText: 'Seleccione el archivo'
                    }]
            });
            
            function funcionaceptar () {
                if (panel.getForm().isValid()) {

                    var winload = new Ext.PVD.comun.window.winLoad({
                        title: 'Por favor espere...',
                        mensaje: 'Guardando datos del archivo'
                    });

                    winload.showMask();

                    panel.getForm().submit({
                        timeout: 9999999999999999,
                        url: 'importarExcelRelencionesPersonas',
                        params:{
                            identidad: variablesGenerales.identidad
                        },
                        // waitMsg: 'Guardando datos del archivo...',
                        success: function (fp, response) {
                            var responseText = Ext.decode(response.response.responseText);
                            importar.close();
                            if (responseText.msg.codigo == 'ok') {
                                mostrarMensaje(1, 'Las retenciones se han actualizado correctamente.');
                            } else if (responseText.msg.codigo == 'nook'){
                                mostrarMensaje(3, 'Las personas: <b>' + responseText.msg.mensaje + '</b> no fueron importadas, el fichero tiene datos vacíos.');
                            }
                            importar.close();
                            winload.hideMask();                            
                            modelo.storePersRetenc.load({
                                params: {
                                    identidad: variablesGenerales.identidad, 
                                    start: 0,
                                    limit: 15
                                }
                            });
                            modelo.storeRetenc.load({
                                params: {
                                    limit: 10, 
                                    start: 0
                                }
                            });

                        }.createDelegate(this),

                        failure: function (fp, response) {
                            importar.close();
                        }
                    });

                } else {
                    mostrarMensaje(2, 'Datos vacios');
                }
            }

            var importar = new Ext.Window({
                title: 'Importar Carga Inicial',
                width: 500,
                layout: 'fit',
                constrain: true,
                modal: true,
                items: [panel],

                buttons: [{
                    iconCls: 'cancelar',
                    text: 'Cancelar',
                    handler: function () {
                        importar.close();
                    }
                }, {
                    iconCls: 'aceptar',
                    text: 'Aceptar',
                    handler: function () {
                        funcionaceptar();
                    }
                }],
                keys: [
                    {
                        key: Ext.EventObject.ENTER,
                        stopEvent: true,
                        fn: function () {

                            funcionaceptar()
                        }
                    }, {
                        key: 'x',
                        alt: true,
                        stopEvent: true,
                        fn: function () {
                            importar.close();
                        }
                    }
                ]
            });

            importar.show();
        }

        //Evento para cuando se selecciona un periodo de pago del panel izquierdo
        vista.objListarPeriodosPagos.on('periodopagoseleccionado', function(record){
            if(vista.objListarPeriodosPagos.modoview == 2){
                vista.objListarPeriodosPagos.btnAddGridExportarVarios.enable();
                vista.objListarPeriodosPagos.btnDelGridExportarVarios.disable();
                vista.recordperiodopagoseleccionado = record;
            }
        });

        //Evento para cuando se selecciona un periodo de pago del panel derecho
        vista.objListarPeriodosPagos.on('periodopagoexportarseleccionado', function (record){
            if(vista.objListarPeriodosPagos.modoview == 2){
                vista.objListarPeriodosPagos.btnAddGridExportarVarios.disable();
                vista.objListarPeriodosPagos.btnDelGridExportarVarios.enable();
                vista.recordperiodopagoexportarseleccionado = record;
            }
        })

        //Evento para adicionar del panel izquierdo de los periodos al panel derecho
        vista.objListarPeriodosPagos.btnAddGridExportarVarios.on('click',function (btn){
            if(vista.objListarPeriodosPagos.modoview == 2){
                vista.objListarPeriodosPagos.stPeriodosPagoExportar.add(vista.recordperiodopagoseleccionado);
                vista.objListarPeriodosPagos.stPeriodosPago.remove(vista.recordperiodopagoseleccionado);
                btn.disable();
            }
        });

        //Lo mismo que lo de arriba pero del panel derecho al panel izquierdo
        vista.objListarPeriodosPagos.btnDelGridExportarVarios.on('click',function (btn){
            if(vista.objListarPeriodosPagos.modoview == 2){
                vista.objListarPeriodosPagos.stPeriodosPagoExportar.remove(vista.recordperiodopagoexportarseleccionado);
                vista.objListarPeriodosPagos.stPeriodosPago.add(vista.recordperiodopagoexportarseleccionado);
                btn.disable();

            }
        })

        //Evento para cuando se acepten los periodos seleccionados mandarlos a cuadrar
        vista.btnAceptarPeriodosPagosCuadrarSubmayor.on('click', function(){
            var arrayidperiodos = vista.objListarPeriodosPagos.stPeriodosPagoExportar.data.items.map(function(val){
                 return val.id;
            });
            var identidad = vista.idestructura;
            var winload = new Ext.PVD.comun.window.winLoad({
                title: 'Por favor espere...',
                mensaje: 'Enviando datos'
            });
            winload.showMask();
            Ext.Ajax.request({
                url:'cuadrarSubmayorxNominas',
                method:'POST',
                params:{identidad:identidad,
                       arrayidperiodos:Ext.encode(arrayidperiodos)
                    },
            callback: function(options, success, response){
                winload.hideMask();
                responseData = Ext.decode(response.responseText);
                if(responseData == 'ok'){
                    mostrarMensaje(1,'El submayor de retenciones fue cuadrado correctamente');
                }else{
                    mostrarMensaje(3,'El submayor de retenciones no pudo ser cuadrado');
                }
                vista.winPeriodosPagos.hide();
                modelo.storeRetencHist.removeAll();
                modelo.storeRetencHist.baseParams.idretencionpersona = vista.gpRetenc.getSelectionModel().getSelected().get('idretencionpersona');
                modelo.storeRetencHist.load({params: {start: 0, limit: 20}});
            }.createDelegate(this)
            });
        });

        vista.btnComprobante.on('click', function () {
            //Validando las personas con carga inicial en las retenciones y sin comprobante
            validarPersonasSinComprobante(vista.idestructura);
        });

        //Cuadrar submayor
        vista.btnMenuCuadrar.menu.items.items[0].setHandler(function(){
            cuadrarSubmayorxOperaciones();
        })

        vista.btnMenuCuadrar.menu.items.items[1].setHandler(function(){
           // modelo.storeperiodosSubmayor.load({params:{idestructura:variablesGenerales.identidad}})
            vista.winPeriodosPagos.show();
        })


        vista.btnCuadrarSubmayor.on('click', function () {
            cuadrarSubmayorxOperaciones();
        });
        /************************** Funsiones de las personas de alta con retenciones *************************************/
        // adicionar persona
        function adicionarPersonasSubmayor(selections) {
            var arrayidpersona = new Array();
            Ext.each(selections, function (s) {
                arrayidpersona.push(s.data.idpersona);
            });
            PVD.mostrarMascara('idmasaddpers', 'Por favor espere...', 'Enviando datos');
            Ext.Ajax.request({
                url: 'adicionarPersonasRetencionesEntidad',
                params: {
                    identidad: variablesGenerales.identidad,
                    arrayidpersona: Ext.encode(arrayidpersona) 
                },
                callback: function (options, succes, response) {
                    PVD.ocultarMascara('idmasaddpers');
                    //mostrarMensaje(1, 'Las personas han sido adicionadas satisfactoriamente');
                    var respuesta = Ext.decode(response.responseText);
                    if (respuesta.mensaje == 'ok') {
                        mostrarMensaje(1, 'Las personas seleccionadas ha sido adicionada satisfactoriamente del submayor de retenciones');
                    } else {
                        mostrarMensaje(3, 'Las personas seleccionadas: <b>' + respuesta.nombrespersonas + '</b> ya se encuentran de alta en el submayor');
                    }
                    modelo.storePersRetenc.load({
                        params: {
                            identidad: variablesGenerales.identidad, 
                            start: 0,
                            limit: 15
                        }
                    });
                    vista.winPersonas.hide();
                }
            });
        }
        // eliminar persona
        function eliminarPersonasRetencion() {
            mostrarMensaje(2, '¿Est&aacute; seguro que <b>desea eliminar</b> a la persona del submayor de retenciones?', function (btn) {
                if (btn == 'ok') {
                    var arrelementos = Array();
                    var arrypersonas = Array();
                    var arrdatos = vista.gpPersonasRetencionAlta.getSelectionModel().getSelections();
                    Ext.each(arrdatos, function (v) {
                        arrelementos.push(v.data.idconfpersonaretencion);
                        arrypersonas.push(v.data.idpersona);
                    });
                    PVD.mostrarMascara('idmaskdelete', 'Por favor espere...', 'Enviando datos');
                    Ext.Ajax.request({
                        url: 'eliminarPersonasRetencion',
                        params: {
                            identidad: variablesGenerales.identidad,
                            arrelementos: Ext.encode(arrelementos),
                            arrypersonas: Ext.encode(arrypersonas)
                        },
                        callback: function (options, succes, response) {
                            PVD.ocultarMascara('idmaskdelete');
                            var respuesta = Ext.decode(response.responseText);
                            if (respuesta == 'ok') {
                                mostrarMensaje(1, 'Las personas seleccionadas han sido eliminadas del Submayor de Retenciones');
                            } 
                            vista.btnEliminarPersonas.disable();
                            modelo.storePersRetenc.load({
                                params: {
                                    identidad: variablesGenerales.identidad, 
                                    start: 0,
                                    limit: 15
                                }
                            });
                        }
                    });
                }
            });
        }

        function cuadrarSubmayorxOperaciones() {
            //Cuadrando el submayor por operaciones
            mostrarMensaje(2, 'Esta seguro que desea cuadrar el submayor de retenciones', function (btn) {
                if (btn == 'ok') {
                    PVD.mostrarMascara('idmaskcuadrar', 'Por favor espere...', 'Enviando datos');
                    Ext.Ajax.request({
                        url: 'cuadrarSubmayorxOperaciones',
                        method: 'POST',
                        params: {
                            identidad: variablesGenerales.identidad,
                        },
                        callback: function (options, success, response) {
                            PVD.ocultarMascara('idmaskcuadrar');
                            responseData = Ext.decode(response.responseText);
                            if (responseData == 'ok') {
                                mostrarMensaje(1, 'El submayor de retenciones fue cuadrado correctamente');
                            } else {
                                mostrarMensaje(3, 'El submayor de retenciones no pudo ser cuadrado');
                            }
                            modelo.storeRetencHist.removeAll();
                            modelo.storeRetencHist.baseParams.idretencionpersona = vista.gpRetenc.getSelectionModel().getSelected().get('idretencionpersona');
                            modelo.storeRetencHist.load({params: {start: 0, limit: 20}});
                        }.createDelegate(this)
                    });
                }
            });
        }

        vista.smRetenc.on('rowselect', function (sm, index, rec) {
            //Se deshabilitan los botones de mod/elim.
            vista.btnCuadrarSubmayor.enable();
            vista.btnModificarRetenc.enable();
            vista.btnEliminarRetenc.enable();
            modelo.storeRetencHist.removeAll();
            modelo.storeRetencHist.baseParams.idretencionpersona = rec.data.idretencionpersona;
            modelo.storeRetencHist.load({params: {start: 0, limit: 15}});
            
            
        });

        vista.smRetencHistorico.on('rowselect', function (sm, index, rec) {
            //Se deshabilitan los botones de mod/elim.

            modelo.storeOperacionesRetencHist.removeAll();
            modelo.storeOperacionesRetencHist.baseParams.idhisdatretencionpersona = rec.data.idhisdatretencionpersona;
            modelo.storeOperacionesRetencHist.load({params: {start: 0, limit: 20}});
        });

        vista.smTiposNominas.on('rowselect', function (sm, index, record) {
            //Cargando los indicadores
            Ext.Ajax.request({
                url: 'obtenerIndicadoresRetenciones',
                method: 'POST',
                params: {
                    identidad: variablesGenerales.identidad,
                    idtiponomina: vista.gpTiposNominas.getSelectionModel().getSelected().id
                },
                callback: function (options, success, response) {
                    responseData = Ext.decode(response.responseText);
                    variablesGenerales.arrayindicadores = responseData.indicadores;
                    obtenerIdsFormulas();
                }.createDelegate(this)
            });

        });

        function obtenerIdsFormulas() {
            //Cargando los ids de las formulas
            PVD.mostrarMascara('idmaskcargandoformulas', idioma.lbMsgEsperaEnviarDatos, idioma.lbMsgCargandoFormulas);
            Ext.Ajax.request({
                url: 'obtenerIdsFormulas',
                method: 'POST',
                params: {
                    idtiponomina: vista.gpTiposNominas.getSelectionModel().getSelected().id
                },
                callback: function (options, success, response) {
                    PVD.ocultarMascara('idmaskcargandoformulas');
                    responseData = Ext.decode(response.responseText);
                    variablesGenerales.arrayidsexpresionmatematica = responseData;
                    //Texto del text area "taCondicionRetenciones"
                    vista.taCondicionRetenciones.enable();
                    vista.taCondicionRetenciones.setValue(responseData.textocumpleretenciones);

                    //Texto del text area "taLimiteMaximo"
                    if (responseData.formulacumpleretenciones == -1) {
                        vista.btnLimpiarFormulas.disable()
                        vista.taLimiteMaximo.disable();
                        vista.taLimiteMaximo.setValue('');
                    } else {
                        vista.btnLimpiarFormulas.enable()
                        vista.taLimiteMaximo.enable();
                        vista.taLimiteMaximo.setValue(responseData.textolimiteretenciones);
                    }
                }.createDelegate(this)
            });
        }

        vista.taCondicionRetenciones.on('focus', function () {
            var idcondicionesretenciones = variablesGenerales.arrayidsexpresionmatematica.idcondicionesretenciones;
            var idformulacumpleretencion = variablesGenerales.arrayidsexpresionmatematica.formulacumpleretenciones;
            mostrarFormulaRetenciones(idcondicionesretenciones, idformulacumpleretencion, 1);
        });

        vista.taLimiteMaximo.on('focus', function () {
            var idcondicionesretenciones = variablesGenerales.arrayidsexpresionmatematica.idcondicionesretenciones;
            var idformulalimiteretencion = variablesGenerales.arrayidsexpresionmatematica.formulalimiteretenciones;
            mostrarFormulaRetenciones(idcondicionesretenciones, idformulalimiteretencion, 2);
        });

        //Eventos de los campos de gestionar retenciones de persona. 
        vista.cbTipoRetenc.on('change', function (tf, n, o) {
            variablesGenerales.cambio = 1;
        });

        vista.cbTipoRetenc.on('select', function (elem, record, index) {

            if (record.data.saldolimite == 1) {
                vista.tfUMensualidad.enable();

                vista.tfSaldoInicial.enable();
            } else {
                vista.tfUMensualidad.reset();
                vista.tfUMensualidad.disable();

                vista.tfSaldoInicial.reset();
                vista.tfSaldoInicial.disable();
            }
        });

        vista.tfSaldoInicial.on('change', function (tf, n, o) {
            variablesGenerales.cambio = 1;
        });

        vista.tfMensualidad.on('change', function (tf, n, o) {
            variablesGenerales.cambio = 1;
        });

        vista.tfUMensualidad.on('change', function (tf, n, o) {
            variablesGenerales.cambio = 1;
        });

        vista.tfReferencia.on('change', function (tf, n, o) {
            variablesGenerales.cambio = 1;
        });

        vista.dfFDocumento.on('change', function (tf, n, o) {
            variablesGenerales.cambio = 1;
        });

        vista.dfFInicioRetenc.on('change', function (tf, n, o) {
            variablesGenerales.cambio = 1;
        });

        vista.dfFFinRetenc.on('change', function (tf, n, o) {
            variablesGenerales.cambio = 1;
        });

        vista.chbActivo.on('check', function (tf, n, o) {
            variablesGenerales.cambio = 1;
        });

        //Eventos de los botones de add/mod/elim retenciones.
        vista.btnAdicionarRetenc.setHandler(function () {
            mostrarVentanaAdicionarRetencion();
        });

        vista.btnModificarRetenc.setHandler(function () {
            mostrarVentanaModificarRetenc();
        });

        vista.btnEliminarRetenc.setHandler(function () {
            eliminarRetencion();
        });

        vista.btnCondicionesRetenc.setHandler(function () {
            mostrarVentanaCondicionesRetenciones();
        });

        vista.btnEliminarRetencHist.setHandler(function () {
            eliminarRetencion();
        });

        //Eventos del botón cancelar.
        vista.btnCancelarRetenc.setHandler(function () {
            vista.ventanaRetenc.hide();
        });

        //Eventos del botón aplicar.
        vista.btnAplicarRetenc.setHandler(function () {
            salvarFormularioRetencion(true);
        });

        //Eventos del botón aceptar.
        vista.btnAceptarRetenc.setHandler(function () {
            salvarFormularioRetencion(false);
            modelo.storePersRetenc.load( {
                params: {
                    identidad: vista.idestructura,
                    start: 0,
                    limit: 15,
                }
            });
        });

        /******************Reporte*********************/
        //Eventos del botón cancelar.
        vista.btnCancelarRepRetenc.setHandler(function () {
            vista.ventanaRepRetenc.hide();
        });

        //Eventos del botón aplicar.
        vista.btnAplicarRepRetenc.setHandler(function () {
            salvarFormularioRetencion(true);
        });

        //Eventos del botón aceptar.
        vista.btnAceptarRepRetenc.setHandler(function () {
            exportarExcel(1);
        });

        //Eventos del botón cancelar.
        vista.btnCancelarRepRetencTodas.setHandler(function () {
            vista.ventanaRepRetencTodas.hide();
        });

        //Eventos del botón aceptar.
        vista.btnAceptarRepRetencTodas.setHandler(function () {
            exportarExcel(2);
        });
        /******************Reporte*********************/
        vista.ventanaRetenc.on('beforeshow', function (ventana) {
            vista.formularioRetenc.getForm().reset();
            vista.tfSaldoInicial.disable();
            vista.tfUMensualidad.disable();
            vista.cbTipoRetenc.focus(true, 500);
        });

        //Eventos del botón cancelar condiciones formulas.
        vista.btnCancelarCondic.setHandler(function () {
            vista.winGestCondicionesRetenc.hide();
        });

        //Eventos del botón cancelar condiciones formulas.
        vista.btnLimpiarFormulas.setHandler(function () {
            limpiarFormulasRetencion();
        });

        function validarPersonasSinComprobante(idestructura) {
            PVD.mostrarMascara('idmascp', 'Enviando datos', 'Actualizando cobros y pagos');
            Ext.Ajax.request({
                timeout: 50000000,
                url: 'validarPersonasSinComprobante',
                method: 'POST',
                params: {
                    idestructura: idestructura
                },
                callback: function (options, success, response) {
                    PVD.ocultarMascara('idmascp');
                    responseData = Ext.decode(response.responseText);
                    if (responseData == 'NO-CARGAS-INICIALES-NUEVAS') {
                        mostrarMensaje(3, 'No se puede generar el comprobante debido a que no existen cargas iniciales nuevas.');
                    } else if (responseData.personasretsincuentas == 1) {
                        mostrarMensaje(3, 'Las personas: <b>' + responseData.textopersonasretsincuentas + '</b> no tienen una cuenta contable asociada en la carga inicial del Submayor de retenciones.');
                    } else if (responseData.retsincuentas == 1) {
                        mostrarMensaje(3, 'Las retenciones: <b>' + responseData.textoretsincuentas + '</b> no tienen una cuenta contable asociada en el Nomenclador de retenciones.');
                    } else if (responseData.nomodulonomina == 1) {
                        mostrarMensaje(3, 'Por favor configure en dat_modulo que el m&oacute;dulo de n&oacute;mina se integre con cobros y pagos.');
                    } else if (responseData.nooperacionmodulonomina == 1) {
                        mostrarMensaje(3, 'Por favor configure la operaci&oacute;n contable con que se van a fijar las obligaciones en el m&oacute;dulo de cobros y pagos en el bot&oacute;n  <b>\'  Condiciones retenciones.  \'</b>' );
                    }else {
                        //Si hay personas sin comprobantes para contabilizar
                        PVD.mostrarMascara('idmaskcomp', idioma.lbMsgEsperaEnviarDatos, 'Contabilizando retenciones');
                        Ext.Ajax.request({
                            url: 'contabilizarRetenciones',
                            method: 'POST',
                            params: {
                                idestructura: vista.idestructura
                            },
                            callback: function (options, success, response) {
                                PVD.ocultarMascara('idmaskcomp');
                                var responseData = Ext.decode(response.responseText);
                                if (responseData == 'NO-MODULO') {
                                    mostrarMensaje(3, 'Por favor adicione el modulo de nominas en el esquema rrhh_maestro en la tabla dat_modulo');
                                } else if (responseData == 'NO-PERSONAS-RET') {
                                    mostrarMensaje(3, 'No hay personas con nuevas retenciones para contabilizar');
                                } else if (responseData == 'NO-OPERACION') {
                                    mostrarMensaje(3, 'Por favor configure una operaci&oacute;n contable para las retenciones');
                                } else if (responseData == 'NO-OPERACION-DATOS-MAESTROS') {
                                    mostrarMensaje(3, 'La operaci&oacute;n configurada no existe en el m&oacute;dulo de Datos Maestros');
                                } else if (responseData == 'NO-MODELO-OPERACION') {
                                    mostrarMensaje(3, 'La operaci&oacute;n configurada no tiene un modelo contable asociado');
                                } else {
                                    Ext.Cont.Comprobante.init(responseData.idsubsistema, responseData.detalle, responseData.observacion, responseData.fechaContable, responseData.dataComprobante, responseData.idtipocomprobante, 1, 1).onSaved(function (idComprobante, numComprobante, fechaComprobante) {

                                        if (idComprobante) {
                                            //Actualizando en cobros y pagos la carga inicial de las retenciones de las personas
                                            PVD.mostrarMascara('idmascp', 'Enviando datos', 'Actualizando cobros y pagos');
                                            Ext.Ajax.request({
                                                timeout: 50000000,
                                                url: 'actualizarCobrosyPagos',
                                                method: 'POST',
                                                params: {
                                                    idComprobante: idComprobante,
                                                    idestructura: vista.idestructura,
                                                    idtasa: responseData.idtasa,
                                                    idmoneda: responseData.idmoneda

                                                },
                                                callback: function (options, success, response) {
                                                    PVD.ocultarMascara('idmascp');
                                                    responseData = Ext.decode(response.responseText);
                                                    if (responseData == 'ok') {
                                                        mostrarMensaje(1, 'Las rentenciones fueron actualizadas satisfactoriamente en el módulo de cobros y pagos');
                                                    } else if (responseData == 'NO-PERSONAS-RET') {
                                                        mostrarMensaje(3, 'No hay personas con nuevas retenciones para contabilizar');
                                                    } else if (responseData == 'NO-OPERACION-CONT') {
                                                        mostrarMensaje(3, 'No existe una operaci&oacte;n contable configurada');
                                                    } else if (responseData == 'NO-MODULO-CONF') {
                                                        mostrarMensaje(3, 'No existe una configuraci&oacute;n para el m&oacute;dulo de n&oacute;mina en mod_rrhhmaestro.dat_modulo');
                                                    }
                                                }.createDelegate(this)
                                            });
                                            scopeidComprobante = idComprobante;
                                        }
                                    }).onClose(function () {
                                        noWindow = true; //para indicar que se cerro la ventana
                                    });
                                }
                            }.createDelegate(this)
                        });
                    }
                }
            });
        }

        function mostrarVentanaAdicionarRetencion() {
            vista.ventanaRetenc.setTitle(idioma.lbTitleVentAdicionarRetenc);
            vista.chbActivo.checked = true;
            vista.btnAplicarRetenc.show();
            vista.ventanaRetenc.show();

            //Actualizar la tabulación deL formulario.
            vista.btnCancelarRetenc.setNextElement('idbtnAplicarRetenc');
            vista.btnAceptarRetenc.setPreviousElement('idbtnAplicarRetenc');
            variablesGenerales.accion = 'Add';
        }

        function mostrarVentanaModificarRetenc() {
            vista.ventanaRetenc.setTitle(idioma.lbTitleVentModificarRetenc);
            vista.btnAplicarRetenc.hide();
            vista.ventanaRetenc.show();
            vista.chbActivo.checked = ((vista.smRetenc.getSelected().data.activo == 1)) ? true : false;
            //Actualizar la tabulación deL formulario.
            //vista.cuentacontable.setValue(vista.smRetenc.getSelected().get('idcuenta'));
            vista.btnCancelarRetenc.setNextElement('idbtnAceptarRetenc');
            vista.btnAceptarRetenc.setPreviousElement('idbtnCancelarRetenc');
            vista.formularioRetenc.getForm().loadRecord(vista.smRetenc.getSelected());
            variablesGenerales.accion = 'Mod';
            if (vista.smRetenc.getSelected().data.saldolimite == 1) {
                vista.tfSaldoInicial.enable();
                vista.tfUMensualidad.enable();
            } else {
                vista.tfSaldoInicial.reset();
                vista.tfSaldoInicial.disable();
                vista.tfUMensualidad.reset();
                vista.tfUMensualidad.disable();
            }

            if (vista.smRetenc.getSelected().data.cobrosypagos == 1) {
                vista.cbxcuenta.enable();
            } else {
                vista.cbxcuenta.disable();
            }
        }

        function mostrarVentanaReporteRetencion() {
            vista.ventanaRepRetenc.setTitle('Reporte Retención');
            vista.ventanaRepRetenc.show();
        }

        function mostrarVentanaCondicionesRetenciones() {
            vista.winGestCondicionesRetenc.show();
            modelo.stTiposNominas.load();
            vista.smTiposNominas.clearSelections();
            vista.btnLimpiarFormulas.disable();
            vista.taCondicionRetenciones.disable();
            vista.taCondicionRetenciones.setValue('');
            vista.taLimiteMaximo.disable();
            vista.taLimiteMaximo.setValue('');

        }

        function salvarFormularioRetencion(boton) {
            var urlAction = 'adicionarRetencionPersona';
            var idretencionpersona = 0;
            var lbMsgEspera = idioma.lbMsgAdicionarRetenc;
            var lbMsgExito = idioma.lbMsgCorrectoAdicionarRetenc;

            if (variablesGenerales.accion == 'Mod') {
                lbMsgEspera = idioma.lbMsgModificarRetenc;
                lbMsgExito = idioma.lbMsgCorrectoModificadoRetenc;
                urlAction = 'modificarRetencionPersona';
                idretencionpersona = vista.smRetenc.getSelected().get('idretencionpersona');
            }
            if (variablesGenerales.cambio == 0) {
                if (variablesGenerales.accion == 'Mod') {
                    //Se oculta la ventana si no ha sido modificado ningún valor.
                    vista.ventanaRetenc.hide();
                } else {
                    //Se marcan como obligatorios en caso de presionar aceptar y se encuentren vacíos.
                    vista.cbTipoRetenc.markInvalid(idioma.lbErrorCampoVacio);
                    vista.tfSaldoInicial.markInvalid(idioma.lbErrorCampoVacio);
                    vista.tfMensualidad.markInvalid(idioma.lbErrorCampoVacio);
                    vista.tfReferencia.markInvalid(idioma.lbErrorCampoVacio);
                    mostrarMensaje(3, idioma.lbErrorFormulario);
                }
            } else {
                //Se verifica si el formulario es válido.
                if (vista.formularioRetenc.getForm().isValid()) {

                    //Se muestra la máscara de espera.
                    PVD.mostrarMascara('idmaskaddmodretenc', idioma.lbMsgEsperaEnviarDatos, lbMsgEspera);

                    //Enviando datos al servidor.
                    Ext.Ajax.request({
                        url: urlAction,
                        method: 'POST',
                        params: {
                            idretencionpersona: idretencionpersona,
                            tiporetenc: vista.cbTipoRetenc.getValue(),
                            activo: (vista.chbActivo.checked ? 1 : 0),
                            saldoinicial: vista.tfSaldoInicial.getValue(),
                            mensualidad: vista.tfMensualidad.getValue(),
                            ultmensualidad: vista.tfUMensualidad.getValue(),
                            referencia: vista.tfReferencia.getValue(),
                            fechadoc: vista.dfFDocumento.getRawValue(),
                            fechainicio: vista.dfFInicioRetenc.getRawValue(),
                            fechafin: vista.dfFFinRetenc.getRawValue(),
                            idpersona: variablesGenerales.idpersona,
                            cuentacontable: vista.cuentacontable.getValue(),
                            identidad: variablesGenerales.identidad
                        },
                        callback: function (options, success, response) {
                            responseData = Ext.decode(response.responseText);

                            //Ocultando máscara de enviar datos.
                            PVD.ocultarMascara('idmaskaddmodretenc');

                            if (responseData.codMsg == 1) {
                                mostrarMensaje(1, lbMsgExito, function () {
                                    if (!boton) {
                                        vista.ventanaRetenc.hide();

                                    } else {
                                        vista.cbTipoRetenc.focus(true, 500);
                                    }
                                    vista.formularioRetenc.getForm().reset();
                                    modelo.storeRetenc.removeAll();
                                    modelo.storeRetenc.load({params: {limit: 10, start: 0}});
                                    variablesGenerales.cambio = 0;
                                });

                            } else {
                                if (responseData.codMsg)
                                    mostrarMensaje(responseData.codMsg, responseData.mensaje);
                            }
                        }
                    });
                } else {
                    mostrarMensaje(3, idioma.lbErrorFormulario);
                }
            }
        }

        var fila = {};
        var indiceFila = 0;
        var miArray = new Array();
        vista.smRepRetenc.on('rowselect', function (sm, rn, dataRecord) {
            var seleccion = sm.selections.keys;
            (seleccion.length > 0) ? vista.btnAceptarRepRetenc.enable() : vista.btnAceptarRepRetenc.disable();
            var id = dataRecord.data.idtiporetencion;
            fila = dataRecord.data;
            indiceFila = miArray.indexOf(id);
            if (indiceFila == -1) {
                vista.filasSeleccionadas.push(fila);
                miArray.push(id);
            }

        });
        vista.smRepRetenc.on('rowdeselect', function (sm, rn, dataRecord) {
            var seleccion = sm.selections.keys;
            (seleccion.length > 0) ? vista.btnAceptarRepRetenc.enable() : vista.btnAceptarRepRetenc.disable();
            var id = dataRecord.data.idtiporetencion;
            indiceFila = miArray.indexOf(id);
            miArray.remove(id);
            vista.filasSeleccionadas.remove(vista.filasSeleccionadas[indiceFila]);
        });

        vista.smRepRetencTodas.on('rowselect', function (sm, rn, dataRecord) {
            var seleccion = sm.selections.keys;
            (seleccion.length > 0) ? vista.btnAceptarRepRetencTodas.enable() : vista.btnAceptarRepRetencTodas.disable();
            vista.filasSeleccionadasTodasRet = seleccion;
        });
        vista.smRepRetencTodas.on('rowdeselect', function (sm, rn, dataRecord) {
            var seleccion = sm.selections.keys;
            (seleccion.length > 0) ? vista.btnAceptarRepRetencTodas.enable() : vista.btnAceptarRepRetencTodas.disable();
            vista.filasSeleccionadasTodasRet = seleccion;
        });

        function exportarExcel(tiporeporte) {
            if (tiporeporte == 1) {
                var fechainicio = vista.dfFInicioRepRetenc.getValue().format('d/m/Y');
                var fechafin = vista.dfFFinRepRetenc.getValue().format('d/m/Y');
                var arrayTipoRetenciones = Ext.encode(vista.filasSeleccionadas);
            } else {
                var arrayTipoRetenciones = Ext.encode(vista.filasSeleccionadasTodasRet);
            }

            var winload = new Ext.PVD.comun.window.winLoad({
                title: 'Por favor espere...',
                mensaje: 'Generando reporte'
            });
            winload.showMask();
            window.open(document.location.protocol + '//' + window.location.host
                + '/pvd/nomina/index.php/gestretencion/listadoDeduccionesAplicadas'
                + '?identidad=' + vista.idestructura
                + '&fechainicio=' + fechainicio
                + '&fechafin=' + fechafin
                + '&arrayTipoRetenciones=' + arrayTipoRetenciones
                + '&tiporeporte=' + tiporeporte);
            winload.close();
            vista.ventanaRepRetencTodas.hide();
        }

        /*
         *Función para eliminar una retención de una persona.
         */
        function eliminarRetencion() {
            var persona = vista.smRetenc.getSelected().get('idretencionpersona');
            //Mostrando el mensaje para aceptar la eliminar.
            mostrarMensaje(2, idioma.lbTitleEliminarRetenc, function (btn) {
                if (btn == "ok") {
                    //Se muestra la máscara de espera.
                    PVD.mostrarMascara('idmaskeleminarretenc', idioma.lbMsgEsperaEnviarDatos, idioma.lbMsgEliminarRetenc);

                    //Enviando los datos al servidor.
                    Ext.Ajax.request({
                        url: 'eliminarRetencionPersona',
                        method: 'POST',
                        params: {idretencionpersona: vista.smRetenc.getSelected().get('idretencionpersona')},
                        callback: function (options, success, response) {
                            //Se oculta la máscara de espera.
                            PVD.ocultarMascara('idmaskeleminarretenc');
                            responseData = Ext.decode(response.responseText);console.log()
                            if (responseData.codMsg == 1) {
                                //Mostrando el mensaje de que se ha eliminado.
                                mostrarMensaje(1, idioma.lbMsgCorrectoEliminadoRetenc, function (btn) {
                                    //Recargando el grid de estructura escalar adyacente.
                                    modelo.storeRetenc.load({params: {limit: 10, start: 0}});
                                    modelo.storeRetencHist.baseParams.idretencionpersona = persona;
                                    modelo.storeRetencHist.load({params: {start: 0, limit: 20}});
                                    modelo.storePersRetenc.load( {
                                        params: {
                                            identidad: vista.idestructura,
                                            start: 0,
                                            limit: 15,
                                        }
                                    });
                                });
                            } else {
                                //Mostrando el mensaje de error.
                                mostrarMensaje(3, 'La retenci&oacute;n est&aacute; siendo utilizada.');
                            }
                        }
                    });
                }
            });
        }

        function mostrarFormulaRetenciones(idcondicionesretenciones, idexpresionmatematica, tipo) {
            //Cargo las variables globales y conceptos de la retribucion monetaria
            var ind = new Array();
            for (var i = 0; i < variablesGenerales.arrayindicadores.length; i++) {
                var a = new Array();
                a[0] = variablesGenerales.arrayindicadores[i].idindicador;
                a[1] = variablesGenerales.arrayindicadores[i].indicador;
                a[2] = variablesGenerales.arrayindicadores[i].tipo;
                ind.push(a);
            }
            this.objExpMat = new Ext.pvd.persona.formula.winEditorExpresiones({
                title: 'Editor de expresiones matem&aacute;ticas',
                idexpresionmatematica: idexpresionmatematica,
                indicadores: ind,
                agrupado: 1,
                campoagrupar: 'Tipo',
                mostrarFunciones: 2,
                //operadoresMostrar: ['+', '-', '*', '/', 'pa', 'pc', 's', 'p'],
                mostrarDenominacion: false
            });

            this.objExpMat.on('expresionsalvada', function (arr) {
                variablesGenerales.idexpresionmatematica = arr.idexpresionmatematica;
                salvarExpresionMatematica(idcondicionesretenciones, variablesGenerales.idexpresionmatematica, tipo);
                this.objExpMat.close();
            }.createDelegate(this));

            this.objExpMat.show();
        }

        function salvarExpresionMatematica(idcondicionesretenciones, idexpresionmatematica, tipoexpresion) {
            PVD.mostrarMascara('idmaskformula', 'Por favor espere...', 'Enviando datos');
            Ext.Ajax.request({
                url: 'adicionarFormulas',
                params: {
                    idcondicionesretenciones: idcondicionesretenciones,
                    idtiponomina: vista.gpTiposNominas.getSelectionModel().getSelected().id,
                    idexpresionmatematica: idexpresionmatematica,
                    tipoexpresion: tipoexpresion
                },
                callback: function (options, succes, response) {
                    PVD.ocultarMascara('idmaskformula');
                    respuesta = Ext.decode(response.responseText);
                    if (respuesta == 'ok') {
                        mostrarMensaje(1, 'La expresi&oacute;n matem&aacute;tica se adicion&oacute; satisfactoriamente');
                        modelo.stTiposNominas.load();
                        vista.smTiposNominas.clearSelections();
                        vista.btnLimpiarFormulas.disable();
                        vista.taCondicionRetenciones.disable();
                        vista.taCondicionRetenciones.setValue('');
                        vista.taLimiteMaximo.disable();
                        vista.taLimiteMaximo.setValue('');
                    } else {
                        mostrarMensaje(3, 'La expresi&oacute;n matem&aacute;tica no se pudo adicionar');
                    }

                }
            });
        }

        function limpiarFormulasRetencion() {
            //Mostrando el mensaje para aceptar la eliminar.
            mostrarMensaje(2, idioma.lbTitleLimpiarFormulas, function (btn) {
                if (btn == "ok") {
                    //Se muestra la máscara de espera.
                    PVD.mostrarMascara('idmasklimpiarformulas', idioma.lbMsgEsperaEnviarDatos, idioma.lbMsgLimpiarFormulas);

                    //Enviando los datos al servidor.
                    Ext.Ajax.request({
                        url: 'limpiarFormulasRetencion',
                        method: 'POST',
                        params: {
                            idtiponomina: vista.gpTiposNominas.getSelectionModel().getSelected().id
                        },
                        callback: function (options, success, response) {
                            //Se oculta la máscara de espera.
                            PVD.ocultarMascara('idmasklimpiarformulas');
                            responseData = Ext.decode(response.responseText);
                            if (responseData.codMsg == 1) {
                                //Mostrando el mensaje de que se ha eliminado.
                                mostrarMensaje(1, idioma.lbMsgCorrectoLimpiarFormulas, function (btn) {
                                    vista.btnLimpiarFormulas.disable();
                                    vista.taCondicionRetenciones.enable();
                                    vista.taLimiteMaximo.disable();
                                    vista.taCondicionRetenciones.setValue('');
                                    vista.taLimiteMaximo.setValue('');
                                });
                            }
                        }
                    });
                }
            });
        }
    }
};
