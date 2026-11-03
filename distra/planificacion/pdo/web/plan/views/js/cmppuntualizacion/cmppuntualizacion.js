Utilidades.Cmp.CmpPuntualizacion = function (opcionesConfig) {
    var _this = this;
    _this.idusuario = window.parent.UCID.portal.perfil.idusuario;

    Ext.Ajax.timeout = 1000000000;
    this.escenarioActivo = '';
    this.arraytipoelem = [];
    this.htmlTPL = '';
    var pgactual = 0;
    this.idtipodocumento = 7;
    this.horainicio = '08:00';
    this.horafin = '17:00';
    this.arrayidactividades = [];
    this.arrayidestadoaprob = [];
    this.arrayactividadesseleccionadas = [];

    //COMPONENTES AUXILIARES......
    //objeto del componente "clasificador de involucrados"
    this.objclasificadorinvol = new Utilidades.Cmp.Cmpclasificadorinvol();

    //objeto del componente "barra de progreso"
    this.BarraProgreso = new BarraEstado();

    //objeto del componente "clasificador de involucrados"
    this.objclasificadorinvol = new Utilidades.Cmp.Cmpclasificadorinvol();
    this.objclasificadorinvolrepeticiones = new Utilidades.Cmp.Cmpclasificadorinvol();

    //objeto del componente "relaciones"
    this.objcmprelaciones = new Utilidades.Cmp.Cmprelaciones();

    //objeto CRUD-ACTIVIDADES inicializado
    this.objCrudActividad = new Utilidades.Cmp.Cmpcrudactividades();

    //objeto CRUD-PLAN inicializado
    this.objCrudPlan = new Utilidades.Cmp.Cmpcrudplan();

    //objeto CRUD-PLAN inicializado
    this.objCrudObjetivo = new Utilidades.Cmp.Cmpcrudobjetivos();

    //objeto del componente observaciones inicializado
    this.objCmpObservaciones = new Utilidades.Cmp.Cmpgestionarobservaciones();


    function MostrarImagenTipoElemento(valor, m, r) {
        if (r.data.suspendida == 1)
            return '<span class="icondistra-actividades sipac-gris">' + ' ' + _this.searchView(valor, 'denominacion', m, r) + '</span>';
        else
            return '<span class="icondistra-actividades sipac-azul">' + ' ' + _this.searchView(valor, 'denominacion', m, r) + '</span>';
    }

    // PAra pintar criterios de busqueda
    function searchCarOrigen(valor, m, r) {
        return _this.searchView(valor, 'idelementopadre', m, r);
    }

    function searchCarPuntualizacion(valor, m, r) {
        return _this.searchView(valor, 'idelemento', m, r);
    }

    function searchNombreautor(valor, m, r) {
        return _this.searchView(valor, 'nombreautor', m, r);
    }

    function searchNombreautorpunt(valor, m, r) {
        return _this.searchView(valor, 'nombreautorpunt', m, r);
    }

    function suspendidas(valor, m, r) {
        if (r.data.suspendida == "1") {
            return '<span class="tachar_black">' + valor + '</span>';
        }
        else
            return valor;
    }

    function suspendidasCAR(valor, m, r) {
        if (r.data.suspendida == "1") {
            return '<span class="tachar_red">' + valor + '</span>';
        }
        else
            return valor;
    }

    this.CargarCmpPuntualizaciones = function (stactividades) {
        //BUTTONS.......

        _this.objcmpmenurelacionespuntulizacion = new Utilidades.Cmp.CmpMenuRelacionesDinamicas();
        _this.btnCambiarEstadoPuntualizacion = new Ext.Button({
            disabled: true,
            tooltip: 'Cambiar el estado de aprobaci&oacute;n de la(s) actividad(es)',
            iconCls: 'cambiodestado',
            menu: _this.objcmpmenurelacionespuntulizacion.menuinicial,
            //id: 'btnitpuntualizacion',
            prevTab: 'btnEliminarAct',
            nextTab: 'btnDuplicarAct',
            handler: function () {
                _this.objcmpmenurelacionespuntulizacion.menuinicial;
                var mensaje = '';
                if (_this.arrayactividadesseleccionadas.length > 1) {
                    mensaje = 'No existen otros estados al cual usted pueda cambiar las actividades desde el estado actual.';
                } else {
                    mensaje = 'No existen otros estados al cual usted pueda cambiar la actividad desde el estado actual.';
                }
                //actualizar el sub-menu de Cambiar estado
                _this.objcmpmenurelacionespuntulizacion.CrearMenuAprobacionConc(
                    _this.cambioEstadoPuntualizacion,
                    mensaje,
                    _this.gdPuntualizaciones,
                    _this.arrayactividadesseleccionadas,
                    _this.arrayidactividades,
                    _this.arrayidestadoaprob,
                    _this.idtipodocumento
                );
            }
        });


        _this.btnComparar = new Ext.Button({
            disabled: true,
            iconCls: 'icondistra-comparar sipac-azul',
            tooltip: 'Comparar con actividad',
            hidden: opcionesConfig.noUsarComparar,
            handler: function () {
                //_this.WinActual.show();
                _this.CompararActual();
            }
        });
        _this.btnModificar = new Ext.Button({
            disabled: true,
            iconCls: 'icondistra-modificar',
            tooltip: 'Modificar puntualización',
            hidden: opcionesConfig.noUsarModifcar,
            handler: function () {
                _this.objCrudActividad.CrearWinCrudActividades(
                    new Date().format('d/m/Y'),
                    new Date().format('d/m/Y'),
                    _this.horainicio,
                    _this.horafin,
                    'Modificar',
                    _this.PostAccionesGestionar,
                    _this.arrayidactividades,
                    _this.arrayactividadesseleccionadas[0].idautor,
                    _this.eshija, permisomodificar = 1,
                    permisoeliminar = 1,
                    _this.objcmprelaciones.ObtenerElementosRelacionadosIniciales(),
                    _this.smTGCmpActividades,
                    null, null,
                    _this.porcientocumpl,
                    _this.actpadre,
                    _this.smPuntualizaciones.getSelected().data._parent);
            }
        });
        _this.btnAprobarPunt = new Ext.Button({
            iconCls: 'aceptar',
            tooltip: 'Aprobar puntualización',
            disabled: true,
            hidden: opcionesConfig.noUsarAprobar,
            handler: function () {
                _this.AprobarElemento();
            }
        });

        _this.stactividades = stactividades;

        _this.btnDenegarPunt = new Ext.Button({
            iconCls: (opcionesConfig.noUsarDenegar) ? 'icondistra-eliminar' : 'cancelar',
            tooltip: (opcionesConfig.noUsarDenegar) ? 'Eliminar puntualización' : 'Denegar puntualización',
            disabled: true,
            // hidden: opcionesConfig.noUsarDenegar,
            handler: function () {
                _this.DenegarElemento();
            },
            key: {
                key: Ext.EventObject.DELETE
            }
        });
        _this.btnGestObs = new Ext.Button({
            handler: function () {
                _this.objCmpObservaciones.CargarCmpObservaciones(
                    _this.arrayidactividades[0], 'actividad', _this.PostAccionesGestionar);
            },
            hidden: opcionesConfig.noUsarGestObser,
            disabled: true,
            iconCls: 'vistareporte',
            tooltip: 'Gestionar observaciones a la actividad',
            key: {
                ctrl: true,
                alt: true,
                key: 'G'
            }
        });
        _this.btnLimpiar = new Ext.Button({
            disabled: false,
            handler: function () {
                _this.ftCmpPuntualizaciones.clearFilters();
            },
            iconCls: 'limpiar',
            tooltip: 'Limpiar filtro(s)',
            key: {
                alt: true,
                key: 'L'
            },
            scope: this
        });

        _this.btnAyuda = new Ext.Button({
            id: 'btnAyudaPunt',
            text: 'Ayuda',
            disabled: false,
            hidden: opcionesConfig.noUsarAyuda,
            iconCls: 'ayuda',
            tooltip: 'Mostrar ayuda de la funcionalidad',
            key: {
                alt: true,
                key: 'H'
            },
            scope: this
        });
        _this.stPuntualizaciones = new Ext.data.GroupingStore({
            autoLoad: false,
            remoteSort: true,
            url: '/planificacion/pdo/plan/index.php/cmpgestionaractividades/cargaractividades',
            //autoLoad: opcionesConfig.cargarDatos,
            baseParams: {
                idtipoelem: 7
            },
            reader: new Ext.data.JsonReader({
                id: 'idelemento',
                root: "campos",
                totalProperty: "total"
            }, [
                {
                    name: 'denominacion'
                }, {
                    name: 'activo'
                }, {
                    name: 'fechainicio'
                }, {
                    name: 'fechafin'
                }, {
                    name: 'fechacreacion'
                }, {
                    name: '_parent'
                }, {
                    name: '_is_leaf'
                }, {
                    name: 'nombreestadoaprob'
                }, {
                    name: 'generacontrol'
                }, {
                    name: 'subordinado'
                }, {
                    name: 'superior'
                }, {
                    name: 'observaciones'
                }, {
                    name: 'gradocumplimiento'
                }, {
                    name: 'textocumplimiento'
                }, {
                    name: 'tipoelemento'
                }, {
                    name: 'modificar'
                }, {
                    name: 'eliminar'
                }, {
                    name: 'idautor'
                }, {
                    name: 'tiporepeticion'
                }, {
                    name: 'tienedependencias'
                }, {
                    name: 'actualizarporciento'
                }, {
                    name: 'tienealarma'
                }, {
                    name: 'duracion'
                }, {
                    name: 'horainicio'
                }, {
                    name: 'descelemento'
                }, {
                    name: 'llevahistorial'
                }, {
                    name: 'idestadoaprob', sortable: true
                }, {
                    name: 'estadocumplimiento'
                }, {
                    name: 'nombreautor'
                }, {
                    name: 'idelemento', sortable: true
                }, {
                    name: 'idtipoelemento'
                }, {
                    name: 'idelementopadre', sortable: true
                }, {
                    name: 'fechacreacionpunt'
                }, {
                    name: 'nombreautorpunt'
                }, {
                    name: 'estadoaprobopuntualizacion'
                }, {
                    name: 'puntejecutada'
                }, {
                    name: 'puntactiva'
                }, {
                    name: 'idpuntualizacion'
                }, {
                    name: 'suspendida'
                }, {
                    name: 'idautorpunt'
                }
            ]),
            listeners: {
                beforeload: function (s) {
                    _this.BarraProgreso.show('Cargando informaci&oacute;n');
                    s.baseParams.start = pgactual;
                    s.baseParams.limit = _this.paginadoPuntualizaciones.pageSize;
                },
                load: function (st) {
                    _this.BarraProgreso.hide();
                    //_this.stPuntualizaciones.clearSelections();
                }
            },
            sortInfo: {
                field: 'idelemento',
                direction: "DESC"
            },
            groupField: 'idelementopadre'
        });
        _this.smPuntualizaciones = new Ext.grid.CheckboxSelectionModel({
            singleSelect: opcionesConfig.singlemodoSeleccionGridPuntualizacion,
            listeners: {
                rowselect: function (sm, ri, record) {
                    _this.ActualizarEstadoBarraHerramientas();
                },
                rowdeselect: function (sm, ri, record) {
                    _this.ActualizarEstadoBarraHerramientas();
                }
            }
        });


        // custom column plugin example
        _this.cmPuntualizacionEjecutada = new Ext.grid.CheckColumn({
            header: "Ejecutada?",
            dataIndex: 'puntejecutada',
            width: 200
        });

        // custom column plugin example
        _this.cmPuntualizacionActiva = new Ext.grid.CheckColumn({
            header: "Activa?",
            dataIndex: 'puntactiva',
            width: 200
        });

        _this.cmPuntualizaciones = [
            _this.smPuntualizaciones,
            {
                id: 'expandir',
                header: "CAR Origen",
                width: 260,
                sortable: true,
                hidden: true,
                dataIndex: 'idelementopadre',
                renderer: suspendidasCAR
            },
            {
                header: "CAR Puntualización",
                width: 260,
                hidden: true,
                dataIndex: 'idelemento',
                sortable: true,
                renderer: searchCarPuntualizacion
            }, {
                // id: 'expandir',
                header: "Denominación",
                width: 470,
                sortable: true,
                dataIndex: 'denominacion',
                renderer: MostrarImagenTipoElemento
            }, {
                header: "Fecha puntualizada",
                width: 270,
                dataIndex: 'fechacreacionpunt',
                sortable: true,
                renderer: suspendidas
            }, {
                header: "Autor de la actividad",
                width: 270,
                dataIndex: 'nombreautor',
                sortable: true,
                renderer: searchNombreautor
            }, {
                header: "Autor de la puntualización",
                width: 260,
                dataIndex: 'nombreautorpunt',
                sortable: true,
                renderer: searchNombreautorpunt
            }, {
                header: "Estado de aprobación",
                width: 260,
                dataIndex: 'nombreestadoaprob',
                sortable: true,
                renderer: suspendidas
            },
            _this.cmPuntualizacionEjecutada,
            _this.cmPuntualizacionActiva
        ];

        _this.paginadoPuntualizaciones = new Ext.PagingToolbar({
            id: "paginadoPuntualizaciones",
            pageSize: 1000,
            store: _this.stPuntualizaciones,
            displayInfo: true,
            listeners: {
                beforechange: function (paginado, evento) {
                    _this.start = evento.start;
                }
            }
        });

        //plugins para los filtros del grid
        _this.ftCmpPuntualizaciones = new Ext.grid.GridFilters({
                filters: [{
                        type: 'string_adaptado',
                        dataIndex: 'idelementopadre',
                        xtype: 'numberfield',
                        maskRe: /^([0-9.]+ ?[0-9.]*)+$/,
                        maskReregex: /^([0-9.]+ ?[0-9.]*)+$/
                },{
                        type: 'string_adaptado',
                        dataIndex: 'idelemento',
                        xtype: 'numberfield',
                        maskRe: /^([0-9.]+ ?[0-9.]*)+$/,
                        maskReregex: /^([0-9.]+ ?[0-9.]*)+$/
                }, {
                        type: 'string',
                        xtype: 'textfield',
                        dataIndex: 'denominacion'
                },{
                        type: 'date',
                        dataIndex: 'fechacreacionpunt'
                },{
                        type: 'string',
                        xtype: 'textfield',
                        dataIndex: 'nombreautor'
                },{
                        type: 'string',
                        xtype: 'textfield',
                        dataIndex: 'nombreautorpunt'
                },{
                        type: 'listado',
                        dataIndex: 'nombreestadoaprob',
                        idcombo: 'idcbftestado',
                        urlcb: '/planificacion/pdo/plan/index.php/cmpgestionaractividades/cargarcmbestados',
                        idstore: 'idestadoaprobpunt',
                        valueFieldcb: 'idestado',
                        displayFieldcb: 'denominacion'
                },{
                        type: 'boolean',
                        dataIndex: 'puntejecutada'
                },{
                        type: 'boolean',
                        dataIndex: 'puntactiva'
                }]
        });

        _this.gdPuntualizaciones = new Ext.grid.GridPanel({
            //region: 'center',
            frame: true,
            iconCls: 'icon-grid',
            master_column_id: 'expandir',
            //plugins: _this.filtrosPuntualizaciones,
            autoExpandColumn: 'expandir',
            store: _this.stPuntualizaciones,
            sm: _this.smPuntualizaciones,
            columns: _this.cmPuntualizaciones,
            plugins: _this.ftCmpPuntualizaciones,
            bbar: _this.paginadoPuntualizaciones,
            view: new Ext.grid.GroupingView({
                forceFit: true,
                groupTextTpl: '<center>{text} ({[values.rs.length]} {[values.rs.length > 1 ? ' +
                '"puntualizaciones propuestas" : "puntualización propuesta"]})</center>'
            })
            // ,
            // menuderecho: _this.menuderechoTGCmpActividades,
            // listeners: {
            //    rowcontextmenu: function (grid, row, e) {
            //     _this.gdPuntualizaciones.getSelectionModel().selectRow(row);
            //
            //     //inicializando el objeto menu dinamico
            //     if (_this.objcmpmenurelacionesdinmd) {
            // 		    _this.objcmpmenurelacionesdinmd = null;
            //     }
            //     _this.objcmpmenurelacionesdinmd = new Utilidades.Cmp.CmpMenuRelacionesDinamicas();
            //     if (_this.menuderechoTGCmpActividades) {
            // 		    _this.menuderechoTGCmpActividades.destroy();
            //     }
            //     //menu derecho del grid de actividades
            //     _this.menuderechoTGCmpActividades = new Ext.menu.Menu({
            // 		    handler: function () {
            // 		    }
            //     });
            //
            //     if (_this.idaprobdiferentes == 0 && _this.subordinados == 1 && _this.mostrarmenuaprob == 1) {
            // 		    var mensaje = '';
            // 		    if (_this.arrayactividadesseleccionadas.length > 1) {
            // 				    mensaje = 'No existen otros estados al cual usted pueda cambiar las actividades desde el estado actual.';
            // 		    } else {
            // 				    mensaje = 'No existen otros estados al cual usted pueda cambiar la actividad desde el estado actual.';
            // 		    }
            // 		    if (_this.mdiaprobacion) {
            // 				    _this.mdiaprobacion.destroy();
            // 				    //_this.objcmpmenurelacionesdin.menuinicial;
            // 		    }
            // 		    _this.mdiaprobacion = new Ext.menu.Item({
            // 				    text: 'Cambiar el estado de aprobaci&oacute;n a',
            // 				    disabled: opcionesConfig.noUsarMenuGrid,
            // 				    itemCls: 'x-menu-item icondistra-cambiodestado',
            // 				    iconCls: 'imagen-none',
            // 				    hideOnClick: false,
            // 				    id: 'itmaprov',
            // 				    menu: _this.objcmpmenurelacionesdinmd.menuinicial,
            // 				    listeners: {
            // 						    render: function (el) {
            // 								    //actualizar el sub-menu de Cambiar estado
            // 								    _this.objcmpmenurelacionesdinmd.CrearMenuAprobacionConc(
            // 										    _this.AccionesPostEjecutarFT, mensaje,
            // 										    _this.TGCmpActividades,
            // 										    _this.menuderechoTGCmpActividades,
            // 										    _this.arrayidactividades,
            // 										    _this.arrayidestadoaprob,
            // 										    _this.idtipodocumento
            // 								    );
            // 						    }
            // 				    }
            // 		    });
            // 		    _this.menuderechoTGCmpActividades.add(_this.mdiaprobacion);
            //     }
            //
            //    }
            // }
        });

        //VENTANA PRINCIPAL....
        _this.WinPrincipal = new Ext.Window({
            title: opcionesConfig.Mostrartitle,
            layout: 'fit',
            constrain: true,
            border: false,
            closable: opcionesConfig.closeableWinPrincipal,
            maximized: opcionesConfig.maxWinPrincipal,
            noTitle: opcionesConfig.maxWinPrincipal,
            modal: true,
            closeAction: 'destroy',
            width: 1000,
            height: 510,
            usarKeymap: true,
            botonesKeymap: [_this.btnComparar, _this.btnAprobarPunt, _this.btnModificar,
                _this.btnDenegarPunt, _this.btnGestObs, _this.btnLimpiar],
            tbar: ['-', _this.btnComparar, ' ', _this.btnAprobarPunt, ' ', _this.btnModificar,
                ' ', _this.btnDenegarPunt, ' ', _this.btnCambiarEstadoPuntualizacion, ' ', _this.btnGestObs, ' ', _this.btnLimpiar],
            items: [_this.gdPuntualizaciones],
            buttons: [
                {
                    text: 'Cerrar',
                    tooltip: 'Cerrar ventana',
                    hidden: opcionesConfig.UsarBtnCerrar,
                    iconCls: 'cerrar',
                    handler: function () {
                        _this.WinPrincipal.destroy();
                    }
                }]
        });
        _this.WinPrincipal.show();
        pgactual = 0;
        _this.BarraProgreso.show('Cargando puntualización');
        _this.stPuntualizaciones.load();
    };
    this.DenegarElemento = function () {
        var puntSeleteds = _this.smPuntualizaciones.getSelections();
        var arraypunt = [];
        Ext.each(puntSeleteds, function (r) {
            arraypunt.push(r.id);
        });
        var mensaje = '', mensajemascara = '', msj = '';
        if (_this.smPuntualizaciones.getSelections().length == 1) {
            mensaje = '¿Está seguro que quiere denegar la puntualización seccionada?';
            mensajemascara = 'Denegando puntualización';
            msj = 'La puntualización ha sido eliminada satisfactoriamente.';
        } else {
            mensaje = '¿Está seguro que quiere denegar las puntualizaciones seccionadas?';
            mensajemascara = 'Denegando puntualizaciones';
            msj = 'Las puntualizaciones han sido eliminadas satisfactoriamente.';
        }
        mostrarMensaje(2, mensaje, function (btnoprimido) {
            if (btnoprimido == 'ok') {
                _this.BarraProgreso.show(mensajemascara);
                Ext.Ajax.request({
                    url: '/planificacion/pdo/plan/index.php/cmpgestionaractividades/eliminaractividades',
                    params: {
                        arrayidactividades: Ext.encode(arraypunt),
                        tipoelemento: 3
                    },
                    callback: function (options, success, response) {
                        responseData = Ext.decode(response.responseText);
                        _this.BarraProgreso.hide();
                        if (responseData.mensaje == 1) {
                            _this.stPuntualizaciones.reload();
                            _this.stactividades.reload({
                                params: {
                                    anode: null,
                                    start: 0
                                }
                            });
                            mostrarMensaje(1, msj);
                        }
                    }
                });
            }
        });
    };

    this.AprobarElemento = function () {
        var puntSeleteds = _this.smPuntualizaciones.getSelections();
        var arraypunt = [];
        Ext.each(puntSeleteds, function (r) {
            arraypunt.push({idelemento: r.data.idelementopadre, punt: r.id});
        });
        var mensaje = '', mensajemascara = '', msj = '';
        if (_this.smPuntualizaciones.getSelections().length == 1) {
            mensaje = '¿Está seguro que quiere aprobar la puntualización seccionada?';
            mensajemascara = 'Aprobando puntualización';
            msj = 'La puntualización ha sido aprobada satisfactoriamente.';
        } else {
            mensaje = '¿Está seguro que quiere aprobar las puntualizaciones seccionadas?';
            mensajemascara = 'Aprobando puntualizaciónes';
            msj = 'Las puntualizaciones han sido aprobadas satisfactoriamente.';
        }
        mostrarMensaje(2, mensaje, function (btnoprimido) {
            if (btnoprimido == 'ok') {
                _this.BarraProgreso.show(mensajemascara);
                Ext.Ajax.request({
                    url: '/planificacion/pdo/plan/index.php/cmpgestionaractividades/modificaractividad',
                    params: {
                        arrayidactividades: Ext.encode(arraypunt),
                        tipoelemento: 3,
                        puntualizar: 1

                    },
                    callback: function (options, success, response) {
                        responseData = Ext.decode(response.responseText);
                        _this.BarraProgreso.hide();
                        if (responseData.mensaje == 1) {
                            _this.stPuntualizaciones.reload();
                            mostrarMensaje(1, msj);
                        }
                    }
                });
            }
        });
    };

    this.ActualizarEstadoBarraHerramientas = function () {
        _this.btnComparar.disable();
        _this.btnAprobarPunt.disable();
        _this.btnDenegarPunt.disable();
        _this.btnModificar.disable();
        _this.btnGestObs.disable();
        _this.idaprobdiferentes = 0;
        _this.subordinados = 0;
        var idestadoaprob = null;
        _this.btnCambiarEstadoPuntualizacion.disable();
        if (_this.smPuntualizaciones.hasSelection()) {
            var arrayrecords = _this.smPuntualizaciones.getSelections();
            var totalrecords = arrayrecords.length;
            var hay_suspendidas = false;
            var no_usuario_crea = false;
            _this.arrayidactividades = [];
            _this.arrayidestadoaprob = [];
            if (totalrecords > 0) {
                var subordinados = 1;
                for (var i = 0; i < totalrecords; i++) {
                    if (i == 0) {
                        idestadoaprob = arrayrecords[0].data.idestadoaprob;
                    }
                    if (i != 0) {
                        if (idestadoaprob != arrayrecords[i].data.idestadoaprob) {
                            _this.idaprobdiferentes = 1;
                        }
                    }
                    _this.arrayidestadoaprob[i] = arrayrecords[i].data.idestadoaprob;
                    _this.arrayidactividades[i] = arrayrecords[i].data.idelemento;
                    var elementoseleccionado = {};
                    elementoseleccionado = {
                        idelemento: arrayrecords[i].data.idelemento,
                        denominacion: arrayrecords[i].data.denominacion,
                        tipoelemento: 3,
                        autorelemento: arrayrecords[i].data.nombreautor,
                        _parent: arrayrecords[i].data._parent,
                        _is_leaf: arrayrecords[i].data._is_leaf,
                        superior: arrayrecords[i].data.superior,
                        subordinado: arrayrecords[i].data.subordinado,
                        idautor: arrayrecords[i].data.idautor,
                        idelementopadre:arrayrecords[i].data.idelementopadre
                    };

                    if (arrayrecords[i].data.suspendida == "1")
                        hay_suspendidas = true;
                    if (_this.idusuario != arrayrecords[i].data.idautorpunt)
                        no_usuario_crea = true;
                    _this.arrayactividadesseleccionadas.push(elementoseleccionado);
                    if (arrayrecords[i].data.subordinado == 0) {
                        subordinados = 0;
                    }
                }
                _this.btnDenegarPunt.enable();
                if (totalrecords == 1) {
                    _this.btnCambiarEstadoPuntualizacion.enable();
                    _this.btnComparar.enable();
                    _this.btnAprobarPunt.enable();
                    _this.btnModificar.enable();
                    _this.btnGestObs.enable();
                }

                if (subordinados == 1) {
                    _this.subordinados = 1;
                }

                if (hay_suspendidas) {
                    _this.btnCambiarEstadoPuntualizacion.enable();
                    _this.btnComparar.disable();
                    _this.btnAprobarPunt.disable();
                    _this.btnModificar.disable();
                    _this.btnGestObs.disable();
                    // _this.btnDenegarPunt.disable();
                }
                else {
                    _this.btnCambiarEstadoPuntualizacion.enable();
                    _this.btnComparar.enable();
                    _this.btnAprobarPunt.enable();
                    _this.btnModificar.enable();
                    _this.btnGestObs.enable();
                }

                if (_this.idaprobdiferentes == 0 && _this.subordinados == 1 /*&& _this.mostrarmenuaprob == 1*/) {
                    _this.btnCambiarEstadoPuntualizacion.enable();
                }
                if (no_usuario_crea)
                    _this.btnDenegarPunt.disable();
            }

        }
    };

    this.panelselectAct = new Ext.Panel({
        width: 270,
        height: 300,
        autoScroll: true,
        bodyStyle: {
            background: '#ffffff',
            padding: '7px'
        }
    });
    this.panelactualAct = new Ext.Panel({
        width: 270,
        height: 300,
        autoScroll: true,
        bodyStyle: {
            background: '#ffffff',
            padding: '7px'
        }
    });
    this.WinActual = new Ext.Window({
        modal: true,
        constrain: true,
        frame: true,
        shadow: false,
        closeAction: 'hide',
        resizable: false,
        layout: 'column',
        title: 'Comparar con versión actual',
        width: 570,
        height: 385,
        border: false,
        bodyStyle: {
            padding: '2px'
        },
        monitorResize: true,
        items: [{
            columnWidth: .50,
            height: 315,
            items: [{
                xtype: 'label',
                html: '<b>Puntualización</b><br/>'
            }, _this.panelselectAct]
        }, {
            columnWidth: .50,
            height: 315,
            items: [{
                xtype: 'label',
                html: '<b>Actividad</b><br/>'
            }, _this.panelactualAct]
        }],
        buttons: [
            {
                iconCls: 'cerrar',
                text: 'Cerrar',
                tooltip: 'Cerrar ventana',
                handler: function () {
                    _this.WinActual.hide();
                }
            }]
    });
    this.CompararActual = function () {
        console.log(_this.smPuntualizaciones.getSelections()[0]);
        var idpadre = _this.smPuntualizaciones.getSelections()[0].data.idelementopadre;
        var idelemento = _this.smPuntualizaciones.getSelections()[0].id;
        var mensajeMascara = 'Cargando comparación';
        _this.BarraProgreso.show(mensajeMascara);
        Ext.Ajax.request({
            url: '/planificacion/pdo/plan/index.php/cmppuntualizacion/compActualActividad',
            params: {
                idactividad: idpadre,
                idpuntualizacion: idelemento
                //puntualizacion:1
            },
            callback: function (options, success, response) {
                _this.BarraProgreso.hide();
                responseData = Ext.decode(response.responseText);

                if (responseData.actual == null) {
                    mostrarMensaje(2, 'No existe una versión actual.');
                } else {
                    _this.WinActual.show();
                    _this.showTplActual(responseData.seleccionada[0], responseData.actual);
                }
            }
        });
    };
    //*** DIBUJAR VERSION ACTUAL DE ACTIVIDADES ***
    this.showTplActual = function (seleccionadaA, actualA) {
        var tplMarkup = [
            '<b>Denominación:</b> {denelemento} <br/>',
            '<b>Descripción:</b> {descelemento}<br/>',
            '<b>Autor:</b> {idautor}<br/>',
            '<b>Fecha:</b> {fecha}<br/>',
            '<b>Fecha de inicio:</b> {fechainicio}<br/>',
            '<b>Fecha de fin:</b> {fechafin}<br/>',
            '<b>Hora de inicio:</b> {horainicio}<br/>',
            '<b>Hora de fin:</b> {horafin}<br/>',
            '<b>% de cumplimiento:</b> {gradocumplimiento}<br/>',
            '<b>Participantes:</b> {participante}<br/>',
            '<b>Dirigentes:</b> {dirigente}<br/>',
            '<b>Involucrados:</b> {involucrados}<br/>'
        ];
        if (seleccionadaA.horainicio != actualA.horainicio) {
            tplMarkup.remove('<b>Hora de inicio:</b> {horainicio}<br/>');
            tplMarkup.push('<b><font color = "red">Hora de inicio:</b> {horainicio} </font><br/>');
        }
        if (seleccionadaA.horafin != actualA.horafin) {
            tplMarkup.remove('<b>Hora de fin:</b> {horafin}<br/>');
            tplMarkup.push('<b><font color = "red">Hora de fin:</b> {horafin} </font><br/>');
        }
        if (seleccionadaA.denelemento != actualA.denelemento) {
            tplMarkup.remove('<b>Denominación:</b> {denelemento} <br/>');
            tplMarkup.push('<b><font color = "red">Denominación:</b> {denelemento} </font><br/>');
        }
        if (seleccionadaA.descelemento != actualA.descelemento) {
            tplMarkup.remove('<b>Descripción:</b> {descelemento}<br/>');
            tplMarkup.push('<b><font color = "red">Descripción:</b> {descelemento} </font><br/>');
        }
        if (seleccionadaA.idautor != actualA.idautor) {
            tplMarkup.remove('<b>Autor:</b> {idautor}<br/>');
            tplMarkup.push('<b><font color = "red">Autor:</b> {idautor} </font><br/>');
        }
        if (seleccionadaA.fecha != actualA.fecha) {
            tplMarkup.remove('<b>Fecha creacion:</b> {fecha}<br/>');
            tplMarkup.push('<b><font color = "red">Fecha creaci&oacute;n:</b> {fecha} </font><br/>');
        }
        if (seleccionadaA.fechainicio != actualA.fechainicio) {
            tplMarkup.remove('<b>Fecha de inicio:</b> {fechainicio}<br/>');
            tplMarkup.push('<b><font color = "red">Fecha de inicio:</b> {fechainicio} </font><br/>');
        }
        if (seleccionadaA.fechafin != actualA.fechafin) {
            tplMarkup.remove('<b>Fecha de fin:</b> {fechafin}<br/>');
            tplMarkup.push('<b><font color = "red">Fecha de fin:</b> {fechafin} </font><br/>');
        }
        if (seleccionadaA.gradocumplimiento != actualA.gradocumplimiento) {
            tplMarkup.remove('<b>% de cumplimiento:</b> {gradocumplimiento}<br/>');
            tplMarkup.push('<b><font color = "red">% de cumplimiento:</b> {gradocumplimiento} </font><br/>');
        }
        if (seleccionadaA.participante != actualA.participante) {
            tplMarkup.remove('<b>Participantes:</b> {participante}<br/>');
            tplMarkup.push('<b><font color = "red">Participantes:</b> {participante} </font><br/>');
        }
        if (seleccionadaA.dirigente != actualA.dirigente) {
            tplMarkup.remove('<b>Dirigentes:</b> {dirigente}<br/>');
            tplMarkup.push('<b><font color = "red">Dirigentes:</b> {dirigente} </font><br/>');
        }
        if (seleccionadaA.involucrados != actualA.involucrados) {

            tplMarkup.remove('<b>Involucrados:</b> {involucrados}<br/>');
            tplMarkup.push('<b><font color = "red">Involucrados:</b> {involucrados} </font><br/>');
        }
        var tplElem = new Ext.Template(tplMarkup);
        tplElem.overwrite(_this.panelselectAct.body, seleccionadaA);
        tplElem.overwrite(_this.panelactualAct.body, actualA);
    };
    this.PostAccionesGestionar = function (mensaje, accion) {
        _this.stPuntualizaciones.reload({
            params: {
                anode: null,
                start: _this.start
            }
        });
    };

    this.cambioEstadoPuntualizacion = function (idestadofinal) {
        var arrayidpuntualizacion = [];
        var puntualizacionSeleteds = _this.smPuntualizaciones.getSelections();
        Ext.each(puntualizacionSeleteds, function (r) {
            arrayidpuntualizacion.push(r.data.idpuntualizacion);
        });
        _this.BarraProgreso.show('Cargando informaci&oacute;n');
        var msg = "las puntualizaciones";
        if (arrayidpuntualizacion.length == 1)
            msg = "la puntualizaci&oacute;n";
        Ext.Ajax.request({
            url: '/planificacion/pdo/plan/index.php/cmppuntualizacion/cambiarEstPuntualizacion',
            params: {
                arrayidpuntualizacion: Ext.encode(arrayidpuntualizacion),
                idestadofinal: idestadofinal
            },
            callback: function (options, success, response) {
                var responseData = Ext.decode(response.responseText);
                if (responseData.mensaje == 1) {
                    _this.BarraProgreso.hide();
                    _this.stPuntualizaciones.reload({
                        params: {
                            anode: null,
                            start: _this.start
                        }
                    });
                }
                else if (responseData.mensaje == 2) {
                    var puntSeleteds = _this.smPuntualizaciones.getSelections();
                    var arraypunt = [];
                    Ext.each(puntSeleteds, function (r) {
                        arraypunt.push(r.id);
                    });
                    Ext.Ajax.request({
                        url: '/planificacion/pdo/plan/index.php/cmpgestionaractividades/eliminaractividades',
                        params: {
                            arrayidactividades: Ext.encode(arraypunt),
                            tipoelemento: 3,
                            puntualizacion: 1
                        },
                        callback: function (options, success, response) {
                            responseData = Ext.decode(response.responseText);
                            _this.BarraProgreso.hide();
                            if (responseData.mensaje == 1) {
                                _this.stPuntualizaciones.reload();
                                _this.stactividades.reload({
                                    params: {
                                        anode: null,
                                        start: 0
                                    }
                                });
                            }
                        }
                    });
                }
            }
        });
    };

    /**
     * Funcion para dibujar criterio de busqueda por denominacion
     * **/

    this.searchView = function (val, column, m, r) {
        var cantActivos = 0;
        var criterio = "";
        var filters_activos = _this.ftCmpPuntualizaciones.filters.items;
        for (var i = 0; i < filters_activos.length; i++) {
            if (filters_activos[i].active) {
                cantActivos++;
            }
        }

        for (var k = 0; k < cantActivos; k++) {
            if (_this.stPuntualizaciones.lastOptions.params['filtros[' + k + '][field]'] == column) {
                criterio = _this.stPuntualizaciones.lastOptions.params['filtros[' + k + '][data][value]'];
                break;
            }
        }

        if (criterio.trim().length > 0) {
            var startPosition = val.toLowerCase().indexOf(criterio.toLowerCase());
            var endPosition = startPosition + criterio.length;

            var respuesta = "";
            for (var i = 0; i < val.length; i++) {
                if (startPosition != -1 && i >= startPosition && i < endPosition) {
                    respuesta += '<span style="color:black; font-weight:bold; background-color: yellow;">' + val[i] + '</span>';
                } else {
                    respuesta += val[i];
                }
            }
        }
        else if (r.data.suspendida == "1") {
            respuesta = '<span class="tachar">' + val + '</span>';
            ;
        }
        else {
            respuesta = val;
        }


        return respuesta;

    };
};
