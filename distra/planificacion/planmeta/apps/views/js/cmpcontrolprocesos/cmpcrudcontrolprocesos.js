Ext.ns('Planificacion.PlanificacionMaterial')
Planificacion.PlanificacionMaterial.Cmpcrudcontrolprocesos = function (opcionesConfig) {
    var _this = this;
    var eventos = {};

    //constructor de la clase
    this.Inicializar = function () {
        //inicializando los valores
        _this.idcomponente = opcionesConfig.idcomponente + '_cmpcrudcontrolprocesos';
        //inicializando otros componentes
        //objeto del componente "barra de progreso"
        _this.BarraProgreso = new BarraEstado();
        //otras variables
    }

    //funcion que levanta la ventana para adicionar las relaciones procesos-funciones
    this.CrearVentanaCrudProcesosFunciones = function (accion, idproceso, nombreproceso, idtiponomenclador, tpfuncionalidades, referencia, permisos, estados, gppermisos, gpestados) {
        if (_this.ventanaCrudProcesosFunciones)
            _this.ventanaCrudProcesosFunciones.destroy();

        _this.idproceso = idproceso;
        _this.referencia = referencia;
        _this.onTop = new Ext.WindowGroup;
        _this.onTop.zseed = 90000;
        _this.idtiponomenclador = idtiponomenclador;
        //para reiniciar las variables cada ves que se cree el crud al modificar
        _this.estamodificando = 0;
        _this.soloLectura = false;
        _this.botonOculto = false;

        //botones para aceptar, aplicar o cancelar el crud de contratos
        _this.btnCancelarProcesosFunciones = new Ext.Button({
            //icon: perfil.dirImg + 'cancelar.png',
            iconCls: 'cancelar',
            text: 'Cancelar',
            tooltip: 'Cerrar ventana sin guardar los datos',
            handler: function () {
                _this.ventanaCrudProcesosFunciones.destroy();

            }
        });
        _this.btnAplicarProcesosFunciones = new Ext.Button({
            // icon: perfil.dirImg + 'aplicar.png',
            iconCls: 'aplicar',
            text: 'Aplicar',
            tooltip: 'Guardar datos y limpiar los campos',
            handler: function () {
            }
        });
        _this.btnAceptarProcesosFunciones = new Ext.Button({
            // icon: perfil.dirImg + 'aceptar.png',
            iconCls: 'aceptar',
            text: 'Aceptar',
            tooltip: 'Guardar datos y cerrar ventana',
            disabled: true,
            handler: function () {

                _this.CrudProcesosFunciones(tpfuncionalidades);


            }
        });
        _this.buscarfuncionalidades = new Ext.Button({
            // icon: perfil.dirImg + 'aceptar.png',
            iconCls: 'buscar',
            // text: '',
            tooltip: 'Buscar Funcionalidades',
            disabled: true,
            handler: function () {
                actualizararbolCB(_this.tpfuncionalidades, Ext.getCmp('idfiltrofuncionalidad').getValue());
                //  _this.CrudProcesosFunciones(tpfuncionalidades);


            }
        });
        _this.limpiarfuncionalidades = new Ext.Button({
            // icon: perfil.dirImg + 'aceptar.png',
            iconCls: 'limpiar',
            // text: '',
            tooltip: 'Limpiar Funcionalidades',
            disabled: true,
            handler: function () {
                _this.tfbuscarFuncionalidadesSinAsociar.setValue('');
                actualizararbolCB(_this.tpfuncionalidades, Ext.getCmp('idfiltrofuncionalidad').getValue());
                _this.buscarfuncionalidades.disable();
                _this.limpiarfuncionalidades.disable();
                // _this.CrudProcesosFunciones(tpfuncionalidades);


            }
        });

        //campo para buscar las funcionalidades listadas en el arbol
        _this.tfbuscarFuncionalidadesSinAsociar = new Ext.form.TextField({
            width: 200, enableKeyEvents: true,
            emptyText: 'Filtrar funcionalidades...',
            id: 'idfiltrofuncionalidad',
            listeners: {
                specialkey: function (t, e) {

                    if (e.getKey() == '13') {

                        actualizararbolCB(_this.tpfuncionalidades, Ext.getCmp('idfiltrofuncionalidad').getValue());
                    }
                }, keyup: function (a, b) {
                    _this.buscarfuncionalidades.enable();
                    _this.limpiarfuncionalidades.enable();
                    if (a.getValue() == '') {
                        _this.buscarfuncionalidades.disable();
                        _this.limpiarfuncionalidades.disable();
                    }
                }/*,blur:function(){
                 _this.buscarfuncionalidades.disable();
                 _this.limpiarfuncionalidades.disable();
                 }*/
            }
        });


        //arbol con las funcionalidades a asociar
        _this.tpfuncionalidades = new Ext.tree.TreePanel(
            {
                height: 500,
                autoScroll: true,
                border: true,
                tbar: [_this.tfbuscarFuncionalidadesSinAsociar, _this.buscarfuncionalidades, _this.limpiarfuncionalidades],
                root: {
                    text: 'Funcionalidades sin asociar a "' + nombreproceso + '"',
                    expanded: true,
                    id: '0'
                },
                listeners: {
                    'checkchange': function (nodo, check) {
                        _this.referencia = nodo.attributes.referencia;
                        if (check) {
                            _this.btnAceptarProcesosFunciones.enable();
                        } else {
                            _this.btnAceptarProcesosFunciones.disable();
                        }
                    }
                },
                loader: new Ext.tree.TreeLoader({
                    singleClickExpand: true,
                    dataUrl: '/planificacion/planmeta/index.php/cmpcontrolprocesos/cargarFuncionalidadesSinAsociar',
                    listeners: {
                        'beforeload': function (atreeloader, anode) {

                            atreeloader.baseParams = {
                                idproceso: idproceso,
                                valor: Ext.getCmp('idfiltrofuncionalidad').getValue()

                            };

                        },
                        'load': function (atreeloader, anode) {
                            if (Ext.getCmp('idfiltrofuncionalidad').getValue() != '')
                                if (anode.firstChild == null)
                                    mostrarMensaje(1, 'No existen datos que se correspondan con los criterios de búsqueda especificados.');
                        }
                    }
                })
            });

        //ventana para la gestion del contrato
        _this.ventanaCrudProcesosFunciones = new Ext.Window({
            title: accion + ' asociaci&oacute;n proceso-funcionalidad',
            width: 330,
            height: 500,
            constrain: true, modal: true,
            // manager: _this.onTop,
            layout: 'fit',
            items: [_this.tpfuncionalidades],
            buttons: [_this.btnCancelarProcesosFunciones, _this.btnAceptarProcesosFunciones],
            listeners: {
                beforedestroy: function () {
                    if (permisos) {
                        gppermisos.disable();
                    }
                    if (estados) {
                        gpestados.disable();
                    }
                }
            }

        });

        _this.ventanaCrudProcesosFunciones.show();
        _this.ventanaCrudProcesosFunciones.toFront();
    }

    //funcion para adicionar la relacion proceso-asociacion
    this.CrudProcesosFunciones = function (tpfuncionalidadesreload) {

        var arrayfuncionalidadesselec = _this.tpfuncionalidades.getChecked();
        if (arrayfuncionalidadesselec.length > 0) {
            _this.BarraProgreso.show("Adicionando relaci&oacute;n proceso-funcionalidad");
            var funcionalidades = [];
            var objfuncionalidad = {};
            for (var i = 0; i < arrayfuncionalidadesselec.length; i++) {
                objfuncionalidad = {
                    idfuncionalidad: arrayfuncionalidadesselec[i].id,
                    referencia: arrayfuncionalidadesselec[i].attributes.referencia
                };
                funcionalidades.push(objfuncionalidad);
            }
            Ext.Ajax.request({
                url: '/planificacion/planmeta/index.php/cmpcontrolprocesos/adicionarAsociacionProcesoFuncionalidad',
                params: {
                    arrayfuncionalidades: Ext.encode(funcionalidades),
                    idproceso: _this.idproceso,
                    referencia: _this.referencia,
                    idtiponomenclador: _this.idtiponomenclador
                },
                callback: function (options, success, response) {
                    _this.BarraProgreso.hide();
                    responseData = Ext.decode(response.responseText);
                    if (responseData.mensaje == 0) {
                        mostrarMensaje(3, 'El proceso al cual usted desea asociar las funcionalidades no existe.', function () {
                            _this.ventanaCrudProcesosFunciones.destroy();
                        });
                    }
                    else if (responseData.mensaje == 1) {
                        mostrarMensaje(1, 'La(s) funcionalidad(es) ha(n) sido adicionada(s) satisfactoriamente.');
                        _this.ventanaCrudProcesosFunciones.destroy();
                        tpfuncionalidadesreload.reload();
                    }
                }
            });

        }
        else {
            mostrarMensaje(1, 'Debe seleccionar al menos una funcionalidad.');
        }
    }

    this.CrudPermisos = function (accion, arrayFuncionalidadesCheck, idestado, store, idpermiso, identidad, permisos) {
        var guardar = 0;
        var inserta = 0;
        var modifica = 0;
        var elimina = 0;


        if (_this.ventanaCrudpermisos)
            _this.ventanaCrudpermisos.destroy();
        var titleaccion = 'Adicionar';
        //botones para aceptar, aplicar o cancelar el crud 
        _this.btnCancelarpermisos = new Ext.Button({
            // icon: perfil.dirImg + 'cancelar.png',
            iconCls: 'cancelar',
            id: ' _this.btnCancelarpermisos',
            tooltip: 'Cerrar ventana sin guardar los datos',
            text: 'Cancelar',
            handler: function () {
                _this.ventanaCrudpermisos.destroy();
            }
        });

        _this.btnAplicarpermisos = new Ext.Button({
            iconCls: 'aplicar',
            id: '_this.btnAplicarpermisos',
            text: 'Aplicar',
            tooltip: 'Guardar datos y limpiar los campos',
            handler: function () {
                if (_this.pfinal.getForm().isValid()) {
                    if (_this.ChboxGuardar.getValue() == true || _this.ChboxInsertar.getValue() == true || _this.ChboxModificar.getValue() == true || _this.ChboxEliminar.getValue() == true) {
                        _this.AddPermisos(accion, boton = 'aplicar', idprocesofuncionalidad, idestado, store, idpermiso);
                        _this.cbEjercicio.reset();
                        _this.ChboxGuardar.setValue(false);
                        _this.ChboxInsertar.setValue(false);
                        _this.ChboxModificar.setValue(false);
                        _this.ChboxEliminar.setValue(false);
                        _this.tpentidades.getRootNode().eachChild(function (n) {
                            n.getUI().toggleCheck(false);
                        });
                    } else {
                        mostrarMensaje(1, 'Debe seleccionar al menos  una entidad y definir los permisos de la entidad seleccionada.');
                    }
                } else {
                    mostrarMensaje(1, 'Debe seleccionar al menos  una entidad y definir los permisos de la entidad seleccionada.');
                }
            }
        });

        _this.btnAceptarpermisos = new Ext.Button({
            // icon: perfil.dirImg + 'aceptar.png',
            iconCls: 'aceptar',
            disabled: true,
            id: '_this.btnAceptarpermisos',
            text: 'Aceptar',
            tooltip: 'Guardar datos y cerrar ventana',
            handler: function () {
                if (_this.pfinal.getForm().isValid()) {
                    if (_this.ChboxGuardar.getValue() == true || _this.ChboxInsertar.getValue() == true || _this.ChboxModificar.getValue() == true || _this.ChboxEliminar.getValue() == true) {
                        //var valores=   permisos;
                        /*     var guardar;var insertar;var eliminar;var modificar;var secambio=false;
                         (_this.ChboxGuardar.getValue())?guardar=1:guardar=0;
                         (_this.ChboxInsertar.getValue())?insertar=1:insertar=0;
                         (_this.ChboxModificar.getValue())?modificar=1:modificar=0;
                         (_this.ChboxEliminar.getValue())?eliminar=1:eliminar=0;
                         */
                        /* secambio=false;
                         if(valores.guardar!=guardar||valores.insertar!=insertar||valores.modificar!=modificar||valores.eliminar!=eliminar){
                         secambio=true;
                         }*/
                        /*if(!secambio){
                         mostrarMensaje(1, 'Loco debes hacer un cambio.');
                         }else{*/
                        _this.AddPermisos(accion, boton = 'aceptar', arrayFuncionalidadesCheck, idestado, store, idpermiso);
                    }//}

                    else {
                        mostrarMensaje(1, 'Debe seleccionar al menos  una entidad y definir los permisos de la entidad seleccionada.');
                    }

                } else {
                    mostrarMensaje(1, 'Debe seleccionar al menos  una entidad y definir los permisos de la entidad seleccionada.');
                }
            }
        });


        //store del combo estados
        _this.stcomboejercicio = new Ext.data.Store({
            autoload: true,
            url: 'listarEjercicios',
            reader: new Ext.data.JsonReader({
                id: 'idejercicio',
                totalProperty: "total",
                root: "data"
            }, [{
                name: 'idejercicio'
            }, {
                name: 'ejercicio'
            }]),
            listeners: {
                load: function (n, r, a) {


                    if (accion == 'Modificar' && _this.cbEjercicio.getValue() > 0)
                        _this.tpentidades.getRootNode().reload();

                }
            }
        });
        _this.stcomboejercicio.reload();
        //combo para el estado 
        ejercic = new Ext.form.Label({
            xtype: "label",
            width: 80,
            anchor: '100%', height: 800,
            text: 'Ejercicios:'
        });

        _this.cbEjercicio = new Ext.form.ComboBox({
            id: _this.idcomponente + 'cbEjercicio', hideLabel: true,
            // fieldLabel: '',
            store: _this.stcomboejercicio,
            hiddenName: 'idejercicio',
            valueField: 'idejercicio', border: false,
            displayField: 'ejercicio',
            triggerAction: 'all',
            editable: true,
            region: 'center',
            typeAhead: true,
            loadingText: 'Cargando datos...',
            allowBlank: false,
            blankText: 'Este campo es obligatorio.',
            readOnly: _this.soloLectura,
            mode: 'local',
            width: 80,
            height: 25,
            anchor: '100%',
            listeners: {
                expand: function (combo) {
                    _this.stcomboejercicio.reload();

                },
                select: function () {
                    if (accion == 'ModificarXEjercicio' || accion == 'Adicionar') {
                        _this.pGeneral.enable();
                        _this.tpentidades.getRootNode().reload();

                    }


                }
            }
        });

        //********************check para los permisos******************
        //checkbox para guardar
        _this.ChboxGuardar = new Ext.form.Checkbox({
            id: _this.idcomponente + 'ChboxGuardar',
            boxLabel: 'Guardar ',
            fieldLabel: '',
            disabled: true,
            hideLabel: true,
            labelSeparator: '',
            width: 200, listeners: {
                'check': function (pthis, newvalue) {
                    if (accion == 'Modificar') {
                        if ((newvalue && permisos.guardar == 0) || (!newvalue && permisos.guardar == 1)) {
                            _this.btnAceptarpermisos.enable();
                            guardar = 1;
                        } else {
                            guardar = 0;
                            if (inserta == 0 && modifica == 0 && elimina == 0) {
                                _this.btnAceptarpermisos.disable();

                            }

                        }
                    }
                }
            }
        });
        //checkbox para insertar
        _this.ChboxInsertar = new Ext.form.Checkbox({
            id: _this.idcomponente + 'ChboxInsertar',
            boxLabel: 'Insertar ',
            fieldLabel: '',
            hideLabel: true,
            disabled: true,
            labelSeparator: '',
            width: 200, listeners: {
                'check': function (pthis, newvalue) {
                    if (accion == 'Modificar') {
                        if ((newvalue && permisos.insertar == 0) || (!newvalue && permisos.insertar == 1)) {
                            _this.btnAceptarpermisos.enable();
                            inserta = 1;
                        } else {
                            inserta = 0;
                            if (guardar == 0 && modifica == 0 && elimina == 0) {
                                _this.btnAceptarpermisos.disable();

                            }
                        }
                    }


                }
            }

        });
        //checkbox para modificar
        _this.ChboxModificar = new Ext.form.Checkbox({
            id: _this.idcomponente + 'ChboxModificar',
            boxLabel: 'Modificar ',
            fieldLabel: '',
            disabled: true,
            hideLabel: true,
            labelSeparator: '',
            width: 200, listeners: {
                'check': function (pthis, newvalue) {
                    if (accion == 'Modificar') {
                        if ((newvalue && permisos.modificar == 0) || (!newvalue && permisos.modificar == 1)) {

                            _this.btnAceptarpermisos.enable();
                            modifica = 1;
                        } else {
                            modifica = 0;
                            if (guardar == 0 && inserta == 0 && elimina == 0) {

                                _this.btnAceptarpermisos.disable();

                            }
                        }
                    }


                }
            }

        });

        //checkbox para eliminar
        _this.ChboxEliminar = new Ext.form.Checkbox({
            id: _this.idcomponente + 'ChboxEliminar',
            boxLabel: 'Eliminar ',
            fieldLabel: '',
            disabled: true,
            hideLabel: true,
            labelSeparator: '',
            width: 200, listeners: {
                'check': function (pthis, newvalue) {
                    if (accion == 'Modificar') {
                        if ((newvalue && permisos.eliminar == 0) || (!newvalue && permisos.eliminar == 1)) {
                            elimina = 1;
                            _this.btnAceptarpermisos.enable();

                        } else {
                            elimina = 0;
                            if (guardar == 0 && modifica == 0 && inserta == 0) {
                                _this.btnAceptarpermisos.disable();

                            }
                        }
                    }


                }
            }

        });


        var url = '/planificacion/planmeta/index.php/cmpcontrolprocesos/cargarEntidades';
        var exp = true;
        if (accion == 'ModificarXEjercicio') {
            exp = false
            url = '/planificacion/planmeta/index.php/cmpcontrolprocesos/cargarModificarEntidades';
        }
        else {
            exp = false
        }

        // el tree de entidades...
        _this.tpentidades = new Ext.tree.TreePanel({
            frame: false,
            autoScroll: true,
            root: {
                text: 'Economía',
                expanded: exp,
                id: '0',
                checked: (accion == 'Modificar') ? undefined : false
            },
            listeners: {
                'checkchange': function (nodo, check) {
                    if (_this.tpentidades.getChecked().length > 0) {
                        if (nodo.id == 0) {
                            nodo.eachChild(function (n) {
                                n.getUI().toggleCheck(check);
                            });
                        }

                        _this.ChboxInsertar.enable();
                        _this.ChboxModificar.enable();
                        _this.ChboxEliminar.enable();
                        _this.ChboxGuardar.enable();
                    } else {
                        _this.ChboxInsertar.disable();
                        _this.ChboxInsertar.setValue(false);
                        _this.ChboxModificar.disable();
                        _this.ChboxModificar.setValue(false);
                        _this.ChboxEliminar.disable();
                        _this.ChboxEliminar.setValue(false);
                        _this.ChboxGuardar.disable();
                        _this.ChboxGuardar.setValue(false);
                    }
                }
            },
            loader: new Ext.tree.TreeLoader({
                singleClickExpand: true,
                dataUrl: '/planificacion/planmeta/index.php/cmpcontrolprocesos/cargarEntidades',
                listeners: {
                    'beforeload': function (atreeloader, anode) {


                        atreeloader.baseParams.evento = accion;
                        atreeloader.baseParams.idestado = idestado;
                        //atreeloader.baseParams.idprocesofuncionalidad = idprocesofuncionalidad;
                        atreeloader.baseParams.idprocesofuncionalidad = arrayFuncionalidadesCheck[0];
                        atreeloader.baseParams.idejercicio = _this.cbEjercicio.getValue();
                        atreeloader.baseParams.identidad = identidad;
                    },
                    'load': function (atreeloader, anode) {
                        if (accion == 'Modificar') {

                            _this.tpentidades.getNodeById(_this.identidad).select();
                        }
                    }
                }
            })
        });

        _this.pPermisos = new Ext.Panel({
            layout: 'form',
            region: 'center',
            margins: '3 3 3 3',
            title: 'Permisos',
            frame: true,
            width: 280,
            items: [_this.ChboxGuardar, _this.ChboxInsertar, _this.ChboxModificar, _this.ChboxEliminar]
        });

        _this.pEntidades = new Ext.Panel({
            layout: 'fit',
            region: 'west',
            margins: '3 3 3 3',
            title: 'Listado entidades',
            frame: false,
            width: 275,
            items: [_this.tpentidades]
        });

        _this.pGeneral = new Ext.Panel({
            layout: 'border',
            height: 300,
            disabled: true,
            width: 600,
            items: [_this.pEntidades, _this.pPermisos]

        });

        _this.panelcomboejercicio = new Ext.Panel({
            layout: 'column',
            height: 30,

            width: 520,
            items: [{
                frame: false,
                columnWidth: 0.11,
                // columnWidth: 0.1,
                border: false,
                layout: 'form',
                items: [ejercic]
            }
                , {
                    frame: false,
                    columnWidth: 0.89,
                    border: false,
                    layout: 'form',
                    items: [_this.cbEjercicio]
                }]

        });


        _this.pfinal = new Ext.FormPanel({
            items: [{
                layout: 'column',
                items: [{
                    frame: true,
                    columnWidth: 1,
                    layout: 'form',
                    items: [_this.panelcomboejercicio]
                }, {
                    frame: false,
                    columnWidth: 1,
                    layout: 'form',
                    items: [_this.pGeneral]
                }]

            }]

        });


        if (accion == 'Modificar' || accion == 'ModificarXEjercicio') {
            titleaccion = 'Modificar';
            _this.btnAplicarpermisos.hide();
            _this.ventanaCrudpermisos = new Ext.Window({
                title: titleaccion + ' permisos',
                id: 'ventanaCrudpermisos',
                width: 589,
                autoValidate: false,
                layout: 'fit',
                height: 410,

                constrain: true,
                modal: true,

                items: [_this.pfinal],
                buttons: [_this.btnCancelarpermisos, _this.btnAplicarpermisos, _this.btnAceptarpermisos]
            });
            _this.ventanaCrudpermisos.show();
        } else {
            // ventana para la gestion de los estatus
            _this.ventanaCrudpermisos = new Ext.Window({
                title: titleaccion + ' permisos',
                id: 'ventanaCrudpermisos',
                width: 589,
                layout: 'fit',
                constrain: true,
                height: 410,
                modal: true,
                items: [_this.pfinal],
                buttons: [_this.btnCancelarpermisos, _this.btnAplicarpermisos, _this.btnAceptarpermisos]
            });

            _this.ventanaCrudpermisos.show();
        }

        if (accion == 'Modificar') {
            _this.pGeneral.enable();
            _this.BarraProgreso.show('Cargando datos');
            Ext.Ajax.request({
                    url: 'cargarDatosPermiso',
                    params: {
                        idpermiso: idpermiso


                    },
                    callback: function (options, success, response) {
                        responseData = Ext.decode(response.responseText);

                        if (responseData.mensaje == 0) {
                            _this.BarraProgreso.hide();
                            mostrarMensaje(3, 'El permiso ya no se encuentra en los registros', function () {
                                _this.ventanaCrudpermisos.destroy();
                            });
                        }
                        if (responseData.mensaje == 1) {
                            _this.BarraProgreso.hide();
                            _this.stcomboejercicio.reload();
                            _this.cbEjercicio.setValue(responseData.data[0].idejercicio);
                            _this.cbEjercicio.setRawValue(responseData.data[0].denominacion);
                            _this.cbEjercicio.disable();
                            _this.identidad = responseData.data[0].identidad;
                            _this.tpentidades.disable();
                            _this.ChboxInsertar.enable();
                            _this.ChboxModificar.enable();
                            _this.ChboxEliminar.enable();
                            _this.ChboxGuardar.enable();

                            if (responseData.data[0].guardar == 1) {
                                _this.ChboxGuardar.setValue(true);
                            } else {
                                _this.ChboxGuardar.setValue(false);
                            }
                            if (responseData.data[0].insertar == 1) {
                                _this.ChboxInsertar.setValue(true);

                            } else {
                                _this.ChboxInsertar.setValue(false);
                            }
                            if (responseData.data[0].modificar == 1) {
                                _this.ChboxModificar.setValue(true);

                            } else {
                                _this.ChboxModificar.setValue(false);
                            }
                            if (responseData.data[0].eliminar == 1) {
                                _this.ChboxEliminar.setValue(true);

                            } else {
                                _this.ChboxEliminar.setValue(false);
                            }

                        }
                    }
                }
            );
        }


    }

    this.AddPermisos = function (accion, boton, arrayprocesofuncionalidad, idestado, store, idpermiso) {
        var guardar = 0;
        var insertar = 0;
        var modificar = 0;
        var eliminar = 0;
        if (_this.ChboxGuardar.getValue() == true)
            guardar = 1;
        if (_this.ChboxInsertar.getValue() == true)
            insertar = 1;
        if (_this.ChboxModificar.getValue() == true)
            modificar = 1;
        if (_this.ChboxEliminar.getValue() == true)
            eliminar = 1;
        var progreso = 'Adicionando';
        var addmod = 'adicionado';
        if (accion == 'Modificar') {
            progreso = 'Modificando';
            addmod = 'modificado';
        }

        _this.BarraProgreso.show(progreso + ' permisos');
        _this.arrayentidades = [];
        _this.idprocesofuncionalidadestado;
        if (accion == 'Modificar') {
            _this.arrayentidades.push(_this.identidad);
            _this.idprocesofuncionalidadestado = _this.tpentidades.getSelectionModel().getSelectedNode().attributes.idprocesofuncionalidadestado;
        }
        else {
            if (_this.tpentidades.getChecked().length > 0) {
                var chequedos = _this.tpentidades.getChecked();
                for (var i = 0; i < chequedos.length; i++) {
                    if (chequedos[i].id != 0) {
                        _this.arrayentidades.push(chequedos[i].id);
                        _this.idprocesofuncionalidadestado = chequedos[i].attributes.idprocesofuncionalidadestado;
                    }
                }
            }
        }
        Ext.Ajax.request({
            url: '/planificacion/planmeta/index.php/cmpcontrolprocesos/adicionarPermisos',
            params: {
                evento: accion,
                idprocesofuncionalidadestado: _this.idprocesofuncionalidadestado,
                idprocesofuncionalidadentidad: idpermiso,
                //idprocesofuncionalidad: idprocesofuncionalidad,
                arrayprocesofuncionalidad: Ext.encode(arrayprocesofuncionalidad),
                arrayidentidades: Ext.encode(_this.arrayentidades),
                idestado: idestado,
                idejercicio: _this.cbEjercicio.getValue(),
                guardar: guardar,
                insertar: insertar,
                modificar: modificar,
                eliminar: eliminar
            },
            callback: function (options, success, response) {
                _this.BarraProgreso.hide();
                responseData = Ext.decode(response.responseText);
                if (responseData.codMsgA == 3) {
                    mostrarMensaje(3, 'No se pudo realizar la operacion.');
                    _this.ventanaCrudpermisos.destroy();
                }
                else if (responseData.codMsgA == 1) {
                    mostrarMensaje(1, 'El permiso ha sido ' + addmod + ' satisfactoriamente.');
                    {
                        if (boton == 'aceptar') {
                            _this.ventanaCrudpermisos.destroy();
                        }
                        store.reload({
                            params: {
                                start: 0,
                                limit: 20
                            }
                        });

                    }
                }
            }
        });
    }

    function actualizararbolCB(arbol, valor) {

        if (arbol.getSelectionModel().getSelectedNode() != undefined) {
            if (!arbol.getSelectionModel().getSelectedNode().leaf) {
                arbol.getSelectionModel().getSelectedNode().reload({
                    params: {
                        valor: valor
                    }
                });
            }
        } else
            arbol.root.reload({
                params: {
                    valor: valor
                }
            });
    }

    function actualizararbol(arbol, valor) {

        if (arbol.getSelectionModel().getSelectedNode() != undefined) {

            if (arbol.getSelectionModel().getSelectedNode().leaf) {
                arbol.root.reload({
                    params: {
                        valor: valor
                    }
                });
            }
        } else
            arbol.root.reload({
                params: {
                    valor: valor
                }
            });
    }

    this.EliminarPermisos = function (arrayidseleccionado, store) {
        var mensaje = '';
        var mensajemascara = ' ';
        if (arrayidseleccionado.length > 1) {
            mensaje = ' ¿Est&aacute; seguro que quiere eliminar los permisos seleccionados?';
            mensajemascara = 'Eliminando permisos';
        }
        else {
            mensaje = ' ¿Est&aacute; seguro que quiere eliminar el permiso seleccionado?';
            mensajemascara = 'Eliminando permiso';
        }
        mostrarMensaje(2, mensaje, elimina);

        function elimina(btnPresionado) {
            if (btnPresionado == 'ok') {
                _this.BarraProgreso.show(mensajemascara);

                Ext.Ajax.request({
                    url: 'eliminarPermisos',
                    params: {
                        arrayidpermisos: Ext.encode(arrayidseleccionado)
                    },
                    callback: function (options, success, response) {
                        _this.BarraProgreso.hide();
                        responseData = Ext.decode(response.responseText);
                        if (responseData.codMsgE == 1) {
                            mostrarMensaje(tipomensaje, 'El(Los) permiso(s) seleccionado(s) ha(n) sido eliminado(s) satisfactoriamente.');
                            store.reload({
                                params: {
                                    start: 0,
                                    limit: 20
                                }
                            });

                        }
                        if (responseData.mensaje == 0) {
                            var mensajeconfirmacion = 'El(Los) ejercicio(s) seleccionado(s) no puede(n) no se puede(n) eliminar debido a que está(n) en uso.';
                            var titulomsj = 'Error!';
                            var tipomensaje = 3;
                            mostrarMensaje(tipomensaje, mensajeconfirmacion);

                        }

                    }
                });
            }
        }
    }
}
