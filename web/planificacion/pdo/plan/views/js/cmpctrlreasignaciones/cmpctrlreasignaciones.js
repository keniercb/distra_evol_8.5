Utilidades.Cmp.Cmpctrlreasignaciones = function () {

    //captura del puntero de la clase para poder referenciarlo desde otras funciones
    var _this = this;
    Ext.Ajax.timeout = 1000000000;
    this.arrayidelementosreasignados = [];
    var arr_dates = [];
    this.datos_ini = "";
    this.datos_fin = "";
    this.arrayidactividades = [];

    this.modificarAsignaciones = false;
    this.arrayTempAsignaciones = [];
    this.arrayIniAsignaciones = [];
    var contasignaciones = 1;

    //componente para el manejo de los mensajes de errores de texto regido
    this.ObjValidaciones = new Utilidades.Cmp.Cmpvalidaciones();

    this.objclasificadorinvol = new Utilidades.Cmp.Cmpclasificadorinvol();

    //componente para el manejo de los mensajes de espera
    this.BarraProgreso = new BarraEstado();

    //funcion donde se genera la vista del componente
    this.CrearCmpCtrlReasignacion = function (estamodificandoelemento, tipoelemento, idelemento,
                                              DestruirComExtContenedor, PostAccionesGestionar,
                                              permitirreasignar, reasignacionHidden) {
        _this.estamodificandoelemento = estamodificandoelemento;
        _this.tipoelemento = tipoelemento;
        _this.idelemento = idelemento;
        _this.arrayidactividades.push(idelemento);
        _this.DestruirComExtContenedor = DestruirComExtContenedor;

        if (_this.TGCtrlReasignaciones) {
            _this.TGCtrlReasignaciones.destroy();
        }
        //boton para la gestion de las reasignaicones
        _this.btnEliminarReasignacion = new Ext.Button({
            handler: function () {
                _this.EliminarReasignaciones();
            },
            disabled: true,
            hidden: (reasignacionHidden == undefined) ? false : reasignacionHidden,
            iconCls: 'eliminar',
            tooltip: 'Eliminar reasignaciones',
            key: {
                key: Ext.EventObject.DELETE
            },
            scope: this
        });

        _this.btnReasignar = new Ext.Button({
            handler: function () {
                _this.objclasificadorinvol.CrearClasificadorReasignacion(
                    _this.arrayidactividades[0], tipoelemento = 3, _this.posReasignar);
            },
            disabled: (permitirreasignar == 0) ? true : false,
            hidden: (reasignacionHidden == undefined) ? false : reasignacionHidden,
            iconCls: 'cambiar',
            tooltip: 'Reasignar actividad',
            key: {
                alt: true,
                key: 'I'
            },
            scope: this
        });

        //Store del grid del control de reasignaciones
        _this.reader = new Ext.data.JsonReader(
            {
                id: 'idreasignacion',
                root: 'campos',
                totalProperty: 'total'
            }, [{
                name: 'idreasignacion'
            }, {
                name: 'numero'
            }, {
                name: 'fechareasignacion'
            }, {
                name: 'textoinvolucrados'
            }, {
                name: 'idelementohijo'
            }, {
                name: 'idautor' //fsera
            }
            ]);

        //store del grid donde se listan las reasignaciones		
        _this.stTGCtrlReasignaciones = new Ext.data.Store({
            listeners: {
                beforeload: function (st) {
                    _this.stTGCtrlReasignaciones.removeAll();
                    st.baseParams.tipoelemento = tipoelemento;
                    st.baseParams.idelemento = idelemento;
                    if (_this.estamodificandoelemento == 1) {
                        st.baseParams.start = 0;
                        if (_this.stTGCtrlReasignaciones.getCount() > 0) {
                            st.baseParams.start = 0;
                        }
                        st.baseParams.limit = 15;
                    }
                },
                load: function (store, record, options) {
                    if (contasignaciones == 1) {
                        _this.arrayIniAsignaciones = _this.retornarreasignados();
                        contasignaciones++;
                    } else {
                        _this.arrayTempAsignaciones = _this.retornarreasignados();
                        _this.modificarAsignaciones = !_this.compararArray(_this.arrayIniAsignaciones, _this.arrayTempAsignaciones);
                    }

                    _this.ActualizarEstadoBarraHerramientas();
                }
            },
            url: '/planificacion/pdo/plan/index.php/cmpctrlreasignaciones/cargargridreasignaciones',
            reader: _this.reader
        });

        // modo de seleccion del  grid donde se listan las reasignaciones	
        _this.smTGCtrlReasignaciones = new Ext.grid.CheckboxSelectionModel({
            singleSelect: false,
            listeners: {
                rowselect: function (sm, indiceFila, record) {
                    _this.ActualizarEstadoBarraHerramientas();
                },
                rowdeselect: function (sm, indiceFila, record) {
                    _this.ActualizarEstadoBarraHerramientas();
                }
            }
        });
        //barra de paginado del grid donde se listan las reasignaciones
        _this.pgCtrlReasignaciones = new Ext.PagingToolbar({
            pageSize: 1000,
            store: _this.stTGCtrlReasignaciones,
            displayInfo: true
        });
        //grid donde muestro las relaciones
        _this.TGCtrlReasignaciones = new Ext.grid.GridPanel({
            store: _this.stTGCtrlReasignaciones,
            master_column_id: 'expandir',
            autoExpandColumn: 'expandir',
            stripeRows: true,
            border: false,
            sm: _this.smTGCtrlReasignaciones,
            margins: '3 3 3 3',
            loadMask: {
                msg: 'Cargando reasignaciones'
            },
            columns: [_this.smTGCtrlReasignaciones,
                {
                    header: "No.",
                    width: 50,
                    dataIndex: 'numero',
                    sortable: true
                }, {
                    header: "Fecha de reasignaci&oacute;n",
                    dataIndex: 'fechareasignacion',
                    width: 150,
                    sortable: true,
                    renderer: function (val) {
                        return val;
                    }
                }, {
                    header: "Reasignado a ",
                    dataIndex: 'textoinvolucrados',
                    id: 'expandir',
                    sortable: true,
                    renderer: function (val) {
                        return val;
                    }
                }
            ],
            listeners: {
                'beforerender': function (e) {
                    _this.modificarAsignaciones = false;
                    _this.arrayTempAsignaciones = [];
                    _this.arrayIniAsignaciones = [];
                    contasignaciones = 1;
                }
            },
            usarKeymap: true,
            botonesKeymap: [_this.btnEliminarReasignacion, _this.btnReasignar],
            tbar: [_this.btnReasignar, ' ', _this.btnEliminarReasignacion],
            bbar: _this.pgCtrlReasignaciones
        });

        _this.pCtrlReasignaciones = new Ext.Panel({
            title: 'Control de reasignaciones',
            height: 100,
            border: false,
            layout: 'fit',
            items: _this.TGCtrlReasignaciones,
            listeners: {
                activate: function (gp) {
                    if (_this.estamodificandoelemento == 1) {
                        _this.stTGCtrlReasignaciones.reload({});
                    }
                }
            }
        });
        return _this.pCtrlReasignaciones;
    };

    //funcion para actualizar despues de reasignar
    this.posReasignar = function () {
        _this.stTGCtrlReasignaciones.reload({});
    };

    this.compararArray = function (arrayIni, arrayTemp) {
        var contador = 0;
        var parada = 0;
        if (arrayIni.length == arrayTemp.length) {
            for (var i = 0; i < arrayIni.length; i++) {
                for (var j = 0; j < arrayTemp.length; j++) {
                    if (arrayIni[i] == arrayTemp[j]) {
                        contador++;
                        break;
                    } else
                        parada++;
                }
                if (parada == arrayTemp.length) {
                    return false;
                    break;
                } else
                    parada = 0;
            }
            if (contador == arrayIni.length)
                return true;
        } else
            return false;
    };

    //funcion que retorna los id de las reasignaciones
    this.retornarreasignados = function () {
        var arrayidreasignaciones = [];
        var elementosrelacionados = _this.stTGCtrlReasignaciones.getRange();
        if (elementosrelacionados.length > 0) {
            for (var i = 0; i < elementosrelacionados.length; i++) {
                arrayidreasignaciones.push(elementosrelacionados[i].data.idelementohijo);
            }
        }
        return arrayidreasignaciones;
    };

    //funcion para actualizar los botones de la barra de herramientas
    this.ActualizarEstadoBarraHerramientas = function () {
        _this.arrayidelementosreasignados = [];
        _this.btnEliminarReasignacion.disable();
        if (_this.smTGCtrlReasignaciones.hasSelection()) {
            var arrayrecords = _this.smTGCtrlReasignaciones.getSelections();
            var totalrecords = arrayrecords.length;
            var puedeeliminar = 1;
            if (totalrecords > 0) {
                for (var i = 0; i < totalrecords; i++) {
                    _this.arrayidelementosreasignados[i] = arrayrecords[i].data.idelementohijo;
                    if (arrayrecords[i].data.eliminar == 0) {
                        puedeeliminar = 0;
                    }
                }
                var usuario_autenticado = window.perfil.idusuario;
                var usuario_autor = _this.smTGCtrlReasignaciones.getSelected().data.idautor;
                if (puedeeliminar == 1 && (usuario_autenticado == usuario_autor)) {
                    _this.btnEliminarReasignacion.enable();
                }
            }
        }
    };

    this.EliminarReasignaciones = function () {
        var mensaje = '', mensajemascara = '';
        if (_this.smTGCtrlReasignaciones.hasSelection()) {
            var select = _this.smTGCtrlReasignaciones.getSelections();
            if (select.length == 1){
                mensaje = '¿Está seguro que quiere eliminar la reasignaci&oacute;n de la actividad seleccionada?';
                mensajemascara = 'Eliminando reasignaci&oacute;n';
            } else {
                mensaje = '¿Está seguro que quiere eliminar las reasignaciones de la actividad seleccionada?';
                mensajemascara = 'Eliminando reasignaciones';
            }
            mostrarMensaje(2, mensaje, function (btnoprimido) {
                if (btnoprimido == 'ok') {
                    _this.BarraProgreso.show(mensajemascara);
                    Ext.Ajax.request({
                        url: '/planificacion/pdo/plan/index.php/cmpctrlreasignaciones/eliminarreasignaciones',
                        params: {
                            arrayidelementos: Ext.encode(_this.arrayidelementosreasignados),
                            idelementopadre: _this.idelemento
                        },
                        callback: function (options, success, response) {
                            _this.BarraProgreso.hide();
                            responseData = Ext.decode(response.responseText);
                            if (responseData.mensaje == 1) {
                                var mensajeconfirmacion = '';
                                if (_this.arrayidelementosreasignados.length > 1) {
                                    mensajeconfirmacion = 'Las reasignaciones han sido eliminadas satisfactoriamente.';
                                } else mensajeconfirmacion = 'La reasignación ha sido eliminada satisfactoriamente.';

                                mostrarMensaje(1, mensajeconfirmacion);
                                _this.stTGCtrlReasignaciones.reload({});
                            }
                            if (responseData.mensaje == 0) {
                                var mensajeconfirmacion2 = '';
                                if (_this.arrayidelementosreasignados.length > 1)
                                    mensajeconfirmacion2 = 'Las reasignaciones que usted quiere eliminar ya no se encuentran en los registros.';
                                else
                                    mensajeconfirmacion2 = 'La reasignaci&oacute;n que usted quiere eliminar ya no se encuentra en los registros.';

                                mostrarMensaje(1, mensajeconfirmacion2, function () {
                                    _this.stTGCtrlReasignaciones.reload({});
                                });
                            }
                            if (responseData.mensaje == 3) {
                                var mensajeconfirmacion3 = '';
                                if (_this.arrayidelementosreasignados.length > 1)
                                    mensajeconfirmacion3 = 'El elemento al cual usted quiere eliminarles las reasignaciones ya no se encuentra en los registros.';
                                else
                                    mensajeconfirmacion3 = 'El elemento al cual usted quiere eliminarle la reasignaci&oacute;n ya no se encuentra en los registros.';

                                mostrarMensaje(1, mensajeconfirmacion3, function () {
                                    _this.stTGCtrlReasignaciones.reload({});
                                });
                            }
                        }
                    });
                }
            });
        }

    }

};
