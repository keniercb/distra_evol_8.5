Ext.ns('Planificacion.PlanificacionMaterial')
Planificacion.PlanificacionMaterial.Cmpcontrolprocesos = function (opcionesConfig) {

    var _this = this;

    var eventos = {};

    //constructor de la clase
    this.Inicializar = function (tipocomponente, idcomponente) {
        _this.BarraProgreso = new BarraEstado();
        //inicializando los valores
        _this.idcomponente = opcionesConfig.idcomponente + '_cmpcontrolprocesos';
        _this.tipocomponente = opcionesConfig.tipocomponente;
        _this.idproceso = 0;
        _this.arrayidpermisos = [];
        _this.arraydatospermisos = [];
        _this.arrayFuncionalidadesCheck = [];

        //inicializando los eventos
        eventos.seleccionar = function () {
        }
        eventos.cancelar = function () {
        }

        //evento "seleccionar"
        if (opcionesConfig.eventos) {
            if (opcionesConfig.eventos.seleccionar) {
                eventos.seleccionar = opcionesConfig.eventos.seleccionar;
            }
            if (opcionesConfig.eventos.cancelar) {
                eventos.cancelar = opcionesConfig.eventos.cancelar;
            }
        }

        //inicializando el objeto "CRUD-CONTROL PROCESOS" 
        _this.objCrudControlProcesos = new Planificacion.PlanificacionMaterial.Cmpcrudcontrolprocesos({
            idcomponente: _this.idcomponente
        });
        _this.objCrudControlProcesos.Inicializar();

        //llamando a la funcion que pinta la interfaz
        _this.MostrarCmpControlProcesos();

    }
    //funcion que pinta la interfaz para gestionar contratos
    this.MostrarCmpControlProcesos = function () {

        //arbol de procesos
        _this.tpprocesos = new Ext.tree.TreePanel(
            {
                region: 'center',
                title: 'Listado de procesos',
                autoScroll: true,
                //collapsible:true,
                margins: '3 3 3 3',
                border: true,
                root: {
                    text: 'Procesos',
                    expanded: true,
                    id: '0'

                },
                listeners: {
                    click: function (nodo, check) {
                        _this.btnAdicionarPermisos.disable();
                        _this.btnModificarPermisos.disable();
                        if (nodo.id != 0) {
                            _this.idproceso = nodo.id;
                            _this.nombreproceso = nodo.text;
                            _this.idtiponomenclador = nodo.attributes.idtiponomenclador;
                            _this.tpfuncionalidades.enable();
                            _this.tpfuncionalidades.getRootNode().reload();
                        }
                    }
                },
                loader: new Ext.tree.TreeLoader({
                    singleClickExpand: true,
                    dataUrl: '/planificacion/planmeta/index.php/cmpcontrolprocesos/cargarProcesos',
                    listeners: {
                        'beforeload': function (atreeloader, anode) {
                            atreeloader.baseParams = {};

                        },
                        'load': function (atreeloader, anode) {
                        }
                    }
                })
            });

        //botones para la gestion de funcionalidades a procesos
        _this.btnAdicionarProcesosFunc = new Ext.Button({
            handler: function () {
                var estados = 0;
                var permisos = 0;
                if (_this.tpestados.disabled) {
                    _this.tpestados.enable();
                    estados = true;
                }
                if (_this.Gppermisos.disabled) {
                    _this.Gppermisos.enable();
                    permisos = true;
                }
                _this.objCrudControlProcesos.CrearVentanaCrudProcesosFunciones(accion = 'Adicionar', _this.idproceso, _this.nombreproceso, _this.idtiponomenclador, _this.tpfuncionalidades.getRootNode(), _this.tpestados, permisos, estados, _this.Gppermisos, _this.tpestados);


            },
            disabled: false,
            //icon: perfil.dirImg + 'adicionar.png',
            iconCls: 'adicionar',
            tooltip: 'Adicionar asociaci&oacute;n proceso-funcionalidad <b>(Alt+I)</b>'
        });
        _this.btnEliminarProcesosFunc = new Ext.Button({
            handler: function () {
                mostrarMensaje(2, '¿Está seguro que quiere eliminar la funcionalidad seleccionada?', function (btnPresionado) {
                    if (btnPresionado == 'ok') {
                        eliminarAsociacion(_this.idprocesofuncionalidad);
                    }
                });

            },
            disabled: true,
            //icon: perfil.dirImg + 'eliminar.png',
            iconCls: 'eliminar',
            tooltip: 'Eliminar asociaci&oacute;n proceso-funcionalidad <b>(shift+DEL)</b>'
        });
        //arbol de funcionalidades
        _this.tpfuncionalidades = new Ext.tree.TreePanel(
            {
                tbar: [_this.btnAdicionarProcesosFunc, _this.btnEliminarProcesosFunc],
                region: 'east',
                id: 'idtpfuncionalidades',
                margins: '3 3 3 3',
                title: 'Listado de funcionalidades',
                width: 250,
                disabled: true,
                collapsible: true,
                autoScroll: true,
                border: true,
                root: {
                    text: 'Funcionalidades',
                    expanded: false,
                    id: '0'
                },
                listeners: {
                    'checkchange': function (nodo, check) {
                        if (nodo.id != 0) {
                            if(check){
                                _this.idprocesofuncionalidad = nodo.id;
                                _this.arrayFuncionalidadesCheck.push(nodo.id);
                            }

                            _this.nombrefuncionalidad = nodo.text;
                            _this.ptpestados.expand(true);
                            _this.tpestados.enable();
                            _this.tpestados.getRootNode().reload();

                        } else {
                            _this.btnEliminarProcesosFunc.disable();
                        }

                    },
                    click: function (nodo, check) {
                        if (nodo.id != 0) {
                            _this.btnEliminarProcesosFunc.enable();
                            _this.idprocesofuncionalidad = nodo.id;

                            _this.nombrefuncionalidad = nodo.text;
                            _this.ptpestados.expand(true);
                            _this.tpestados.enable();
                            _this.tpestados.getRootNode().reload();

                        } else {
                            _this.btnEliminarProcesosFunc.disable();
                        }

                    }
                },
                loader: new Ext.tree.TreeLoader({
                    singleClickExpand: true,
                    dataUrl: '/planificacion/planmeta/index.php/cmpcontrolprocesos/cargarFuncionalidadesAsociadas',
                    listeners: {
                        'beforeload': function (atreeloader, anode) {
                            _this.btnEliminarProcesosFunc.disable();
                            _this.tpestados.getRootNode().collapse(true);
                            _this.tpestados.disable();
                            atreeloader.baseParams = {
                                idproceso: _this.idproceso
                            };

                        },
                        'load': function (atreeloader, anode) {
                        }
                    }
                })
            });

        //panel donde muestro los arboles de procesos y funcionalidades
        _this.pprocesosfunc = new Ext.Panel({
            region: 'west',
            layout: 'border',
            width: 450,
            items: [_this.tpprocesos, _this.tpfuncionalidades]
        });


        _this.filterPermisos = new Ext.grid.GridFilters({
            filters: [{
                type: 'listado',
                dataIndex: 'denomentidad',
                idcombo: 'idcombespec',
                idstore: 'idstespec',
                urlcb: '/planificacion/planmeta/index.php/cmpcontrolprocesos/cargarEspFiltros',
                valueFieldcb: 'id',
                displayFieldcb: 'text'
            }, {
                type: 'string',
                dataIndex: 'ejercicio'
            }, {
                type: 'list',
                dataIndex: 'guardar',
                options: ['Si', 'No']
            }, {
                type: 'list',
                dataIndex: 'insertar',
                options: ['Si', 'No']
            }, {
                type: 'list',
                dataIndex: 'modificar',
                options: ['Si', 'No']
            }, {
                type: 'list',
                dataIndex: 'eliminar',
                options: ['Si', 'No']
            }]
        });
        //ventana para mostrar los ejercicios.
        _this.stGridEjercicio = new Ext.data.Store({
            url: 'listarEjerciciosActivarDesactivar',
            reader: new Ext.data.JsonReader({
                id: 'id',
                totalProperty: "total",
                root: "data"
            }, [{
                name: 'id'
            }, {
                name: 'text'
            }, {
                name: 'idprocesofuncionalidad'

            }]),
            listeners: {
                beforeload: function (store, record, options) {
                    _this.smGridEjercicio.clearSelections();
                    store.baseParams.activo = _this.activo;
                    store.baseParams.idestado = _this.idestado;
                    store.baseParams.idprocesofuncionalidad = _this.idprocesofuncionalidad;

                },
                load: function (store, record, options) {
                    if (_this.stGridEjercicio.getCount() == 0) {
                        mostrarMensaje(1, 'No existen ejercicios con permisos gestionados para este estado.');
                        _this.ventanaEjercicios.hide();
                    }
                }
            }
        });
        _this.smGridEjercicio = new Ext.grid.CheckboxSelectionModel({
            singleSelect: false,
            listeners: {
                rowselect: function (sm, indiceFila, record) {
                    if (_this.smGridEjercicio.hasSelection()) {
                        _this.btnAceptarejercicios.enable();
                    } else {
                        _this.btnAceptarejercicios.disable();
                    }
                },
                rowdeselect: function (sm, indiceFila, record) {
                    if (_this.smGridEjercicio.hasSelection()) {
                        _this.btnAceptarejercicios.enable();
                    } else {
                        _this.btnAceptarejercicios.disable();
                    }
                }
            }
        });
        _this.ptbGridEjercicio = new Ext.PagingToolbar({
            pageSize: 20,
            store: _this.stGridEjercicio,
            displayInfo: true
        });
        _this.btnCancelarejercicios = new Ext.Button({
            // icon: perfil.dirImg + 'cancelar.png',
            iconCls: 'cancelar',
            text: 'Cancelar',
            tooltip: 'Cerrar ventana sin guardar los datos',
            handler: function () {
                _this.ventanaEjercicios.hide();
            }
        });
        _this.btnAceptarejercicios = new Ext.Button({
            //icon: perfil.dirImg + 'aceptar.png',
            iconCls: 'aceptar',
            disabled: true,
            text: 'Aceptar',
            tooltip: 'Guardar datos y cerrar ventana',
            handler: function () {
                //llamar a la funcion activar estado
                _this.estadosActDesact();
            }
        });


        /**
         * menu del click derecho del grid
         */

        menuPermisoEjercicio = new Ext.menu.Menu({
            id: 'menuPermisoEjercicio',
            //disabled: true,
            listeners: {},
            items: [{
                text: 'Eliminar',
                iconCls: 'eliminar',
                id: 'mdEliminarPermiso',
                tooltip: 'Eliminar permiso',
                handler: function () {

                }
            }]
        });

        _this.gEjercicio = new Ext.grid.GridPanel({
            //frame: true,
            stripeRows: true,
            store: _this.stGridEjercicio,
            sm: _this.smGridEjercicio,
            autoExpandColumn: 'expandir',
            columns: [
                _this.smGridEjercicio,
                {
                    header: "Denominación",
                    dataIndex: 'text',
                    id: 'expandir',
                    width: 80,
                    sortable: true
                }],
            loadMask: {
                msg: 'Cargando  ejercicios...'
            },
            bbar: _this.ptbGridEjercicio,
            listeners: {
                rowdblclick: function () {

                }
            }
        });
        _this.ventanaEjercicios = new Ext.Window({
            title: 'Ejercicios',
            width: 500,
            height: 400,
            closeaction: 'hide',
            constrain: true,
            modal: true,
            layout: 'fit',
            items: [_this.gEjercicio],
            buttons: [_this.btnCancelarejercicios, /* _this.btnAplicarProcesosFunciones,*/ _this.btnAceptarejercicios]

        });

        //arbol de estados
        _this.tpestados = new Ext.tree.TreePanel(
            {
                region: 'center',
                autoScroll: true,
                width: 193,
                disabled: true,
                contextmenu: new Ext.menu.Menu({
                    node: null,
                    id: 'menuactivar',
                    disabled: true,
                    items: [{
                        type: 'button',
                        text: 'Activar',
                        itemCls: 'x-menu-item icondistra-habilitar',
                        iconCls: 'imagen-none',
                        // icon: perfil.dirImg + 'habilitar.png',
                        //     iconCls: 'btn',
                        id: 'btnactivarest',
                        handler: function () {
                            _this.activo = 1;
                            _this.ventanaEjercicios.show();
                            _this.stGridEjercicio.reload({
                                params: {
                                    start: 0,
                                    limit: 20
                                }
                            });

                        }
                    }, {
                        type: 'button',
                        text: 'Desactivar',
                        itemCls: 'x-menu-item icondistra-deshabilitar',
                        iconCls: 'imagen-none',
                        // icon: perfil.dirImg + 'deshabilitar.png',
                        // iconCls: 'btn',
                        id: 'btndesactivarest',
                        handler: function () {
                            _this.activo = 0;
                            _this.ventanaEjercicios.show();
                            _this.stGridEjercicio.reload({
                                params: {
                                    start: 0,
                                    limit: 20
                                }
                            });
                        }
                    }]
                }),
                border: true,
                root: {
                    text: 'Estados',
                    expanded: false,
                    id: '0'

                },
                listeners: {
                    click: function (nodo, check) {
                        if (nodo.id != 0) {
                            _this.idestado = nodo.id;
                            _this.nombreestado = nodo.text;
                            _this.idtiponomenclador = nodo.attributes.idtiponomenclador;
                            _this.btnAdicionarPermisos.enable();

                            // _this.btnModificarPermisos.enable();
                            _this.Gppermisos.enable();
                            _this.stGppermisos.reload({
                                params: {
                                    start: 0,
                                    limit: 20
                                }
                            });
                            _this.ptpejeractivados.expand(true);
                            _this.tpejeractivados.enable();
                            _this.tpejeractivados.getRootNode().reload();
                            _this.btnEliminarPermisos.disable();
                        } else {
                            _this.ptpejeractivados.collapse(true);
                        }


                    },
                    contextmenu: function (node, event) {
                        event.stopEvent();
                        _this.tpestados.getSelectionModel().select(node);
                        if (node.id != 0) {
                            _this.tpestados.contextmenu.node = node;
                            _this.tpestados.contextmenu.showAt(event.getXY());


                            _this.idestado = node.id;
                            _this.nombreestado = node.text;
                            _this.idtiponomenclador = node.attributes.idtiponomenclador;
                            _this.btnAdicionarPermisos.enable();
                            _this.btnModificarPermisos.enable();
                            _this.Gppermisos.enable();
                            _this.stGppermisos.reload({
                                params: {
                                    start: 0,
                                    limit: 20
                                }
                            });
                            _this.ptpejeractivados.expand(true);
                            _this.tpejeractivados.enable();
                            _this.tpejeractivados.getRootNode().reload();

                        } else {
                            _this.ptpejeractivados.collapse(true);
                        }

                    }
                },
                loader: new Ext.tree.TreeLoader({
                    singleClickExpand: true,
                    dataUrl: '/planificacion/planmeta/index.php/cmpcontrolprocesos/cargarEstados',
                    listeners: {
                        'beforeload': function (atreeloader, anode) {
                            _this.btnAdicionarPermisos.disable();
                            _this.btnModificarPermisos.disable();
                            _this.ptpejeractivados.collapse(true);
                            atreeloader.baseParams = {
                                idprocesofuncionalidad: _this.idprocesofuncionalidad
                            };

                        },
                        'load': function (atreeloader, anode) {


                        }
                    }
                })
            });

        //*************************************boton ayuda****************************
        _this.btnAyuda = new Ext.Button({
            disabled: false,
            // icon: perfil.dirImg + 'ayuda.png',
            iconCls: 'ayuda',
            text: 'Ayuda',
            id: 'btnAyudaControlProcesos',
            tooltip: 'Mostrar ayuda <b>(Alt+H)</b>'
        });

        //*********************************botones gestion permisos**************************************
        //botones para la gestion 
        _this.btnAdicionarPermisos = new Ext.Button({
            handler: function () {
                _this.objCrudControlProcesos.CrudPermisos('Adicionar', _this.arrayFuncionalidadesCheck, _this.idestado, _this.stGppermisos);
            },
            disabled: true,
            // icon: perfil.dirImg + 'adicionar.png',
            iconCls: 'adicionar',
            //text: 'Ad<u>i</u>cionar',
            id: 'btnAdicionarPermisos',
            tooltip: 'Adicionar permiso <b>(Alt+P)</b>'
        });
        _this.btnEliminarPermisos = new Ext.Button({
            handler: function () {
                _this.objCrudControlProcesos.EliminarPermisos(_this.arrayidpermisos, _this.stGppermisos);
            },
            disabled: true,
            // text: 'Eliminar',
            // icon: perfil.dirImg + 'eliminar.png',
            iconCls: 'eliminar',
            tooltip: 'Eliminar permiso <b>(Alt+DEL)</b>'
        });
        _this.btnModificarPermisos = new Ext.Button({
            handler: function () {
                if (_this.smGridPermisos.getSelections().length == 1) {
                    _this.objCrudControlProcesos.CrudPermisos('Modificar', _this.idprocesofuncionalidad, _this.idestado, _this.stGppermisos, _this.arrayidpermisos[0], _this.arraydatospermisos[0].identidad, _this.arraydatospermisos[0]);
                } else {
                    _this.objCrudControlProcesos.CrudPermisos('ModificarXEjercicio', _this.idprocesofuncionalidad, _this.idestado, _this.stGppermisos);
                }


            },
            disabled: true,
            // text: '<u>M</u>odificar',
            // icon: perfil.dirImg + 'modificar.png',
            iconCls: 'modificar',
            tooltip: 'Modificar permiso <b>(Alt+M)</b>'
        });
        _this.btnLimpiarPermisos = new Ext.Button({
            handler: function () {
                _this.filterPermisos.clearFilters();
            },
            disabled: false,
            //text: '<u>L</u>impiar',
            // icon: perfil.dirImg + 'limpiar.png',
            iconCls: 'limpiar',
            tooltip: 'Limpiar filtro(s) <b>(Alt+L)</b>'
        });
        //**********************GRID**********************************************************
        //modo de selecciond el grid para gestionar los permisos
        _this.smGridPermisos = new Ext.grid.CheckboxSelectionModel({
            singleSelect: false,
            listeners: {
                rowselect: function (sm, indiceFila, record) {

                    _this.ActualizarEstadoBotones();
                },
                rowdeselect: function (sm, indiceFila, record) {

                    _this.ActualizarEstadoBotones();
                }
            }
        });

        //store del grid permisos	 
        _this.stGppermisos = new Ext.data.GroupingStore({
            url: '/planificacion/planmeta/index.php/cmpcontrolprocesos/listarPermisos',
            // load:true,
            sortInfo: {
                field: 'ejercicio',
                direction: "ASC"
            },
            groupField: 'ejercicio',
            reader: new Ext.data.JsonReader({
                id: 'idprocesofuncionalidadentidad',
                totalProperty: "total",
                root: "data"
            }, [{
                name: 'idprocesofuncionalidadentidad'
            }, {
                name: 'idejercicio'
            }, {
                name: 'ejercicio'
            }, {
                name: 'identidad'

            }, {
                name: 'denomentidad'

            }, {
                name: 'guardar'

            }, {
                name: 'eliminar'

            }, {
                name: 'modificar'

            }, {
                name: 'insertar'


            }, {
                name: 'DatProcesofuncionalidadestado'

            }]),

            listeners: {
                beforeload: function (store, record, options) {
                    store.baseParams.idestado = _this.idestado;
                    store.baseParams.idprocesofuncionalidad = _this.idprocesofuncionalidad;

                },
                load: function (store, record, options) {

                    if (_this.stGppermisos.getCount() == 0) {
                        Ext.getCmp('btnactivarest').disable();
                        Ext.getCmp('btndesactivarest').disable();
                        if (_this.filterPermisos.getFiltrosActivos() == undefined || _this.filterPermisos.getFiltrosActivos().length == 0) {
                            mostrarMensaje(1, 'No existen datos a mostrar.');

                        } else {
                            mostrarMensaje(1, 'No existen datos que se correspondan con los criterios de búsqueda especificados.');
                        }

                    } else {
                        if (store.data.items[0].json.mensaje == 3) {
                            store.removeAll();
                            mostrarMensaje(1, 'No existe una entidad rectora.');
                        } else {
                            Ext.getCmp('btnactivarest').enable();
                            Ext.getCmp('btndesactivarest').enable();
                        }
                    }


                }
            }
        });
        //********************************************************************************
        //********************************************************************************		

        //grid de permisos
        _this.Gppermisos = new Ext.grid.GridPanel({
            title: 'Permisos',
            disabled: true,
            plugins: _this.filterPermisos,
            master_column_id: 'exp',
            width: 300,
            loadMask: {
                msg: 'Cargando permisos...'
            },
            columns: [
                _this.smGridPermisos,
                {
                    header: "Especialidad",
                    dataIndex: 'denomentidad',
                    width: 30,
                    id: 'exp',
                    sortable: true
                }, {
                    header: "Ejercicio",
                    dataIndex: 'ejercicio',
                    width: 20,
                    sortable: true

                }, {
                    header: "Guardar",
                    dataIndex: 'guardar',
                    align: 'center',
                    width: 15,
                    sortable: true,
                    renderer: rendermarcado
                }, {
                    header: "Insertar",
                    align: 'center',
                    dataIndex: 'insertar',
                    width: 15,
                    sortable: true,
                    renderer: rendermarcado
                }, {
                    header: "Modificar",
                    dataIndex: 'modificar',
                    width: 15,
                    sortable: true,
                    align: 'center',
                    renderer: rendermarcado
                }, {
                    header: "Eliminar",
                    dataIndex: 'eliminar',
                    align: 'center',
                    width: 15,
                    sortable: true,
                    renderer: rendermarcado
                }],
            view: new Ext.grid.GroupingView({
                forceFit: true,
                groupTextTpl: '{text} ({[values.rs.length]} {[values.rs.length > 1 ? "Ejercicios" : "Ejercicio"]})'
            }),
            store: _this.stGppermisos,
            sm: _this.smGridPermisos,
            md:menuPermisoEjercicio,
            listeners: {
                rowdblclick: function (_this, row_index, record) {
                },
                rowcontextmenu: function (g, r, e) {
                    e.stopEvent();
                    g.getSelectionModel().selectRow(r);
                    g.md.showAt(e.getXY());

                }

            },
            frame: true,
            id: 'gppermisos',
            tbar: [_this.btnAdicionarPermisos, _this.btnModificarPermisos, _this.btnEliminarPermisos],
            bbar: new Ext.PagingToolbar({
                pageSize: 20,
                store: _this.stGppermisos,
                items: [_this.btnLimpiarPermisos],
                displayInfo: true
            })
        });

        //**************************************************************************************************************************
        //panel para el grid permisos
        _this.pgdpermiso = new Ext.Panel({
            layout: 'fit',
            items: [_this.Gppermisos],
            tbar: ['->', _this.btnAyuda],
            width: 305,
            region: 'center'
        });
        //tree para mostrar los ejercicios que tienes un estado asociado
        _this.tpejeractivados = new Ext.tree.TreePanel(
            {
                disabled: true,
                autoScroll: true,
                root: {
                    text: 'Ejercicios',
                    expanded: false,
                    id: '0'
                },
                loader: new Ext.tree.TreeLoader({
                    singleClickExpand: true,
                    dataUrl: '/planificacion/planmeta/index.php/cmpcontrolprocesos/listarEjerciciosActivarDesactivarArbol',
                    listeners: {
                        'beforeload': function (atreeloader, anode) {
                            atreeloader.baseParams = {
                                activo: 0,
                                idestado: _this.idestado,
                                idprocesofuncionalidad: _this.idprocesofuncionalidad,
                                limit: 10000,
                                start: 0
                            }
                        },
                        'load': function (atreeloader, anode) {
                            if (_this.tpejeractivados.getRootNode().childNodes.length == 0) {
                                Ext.getCmp('btndesactivarest').disable();
                            } else {
                                Ext.getCmp('btndesactivarest').enable();
                            }
                        }
                    }
                })


            })
        //panel para el tree
        _this.ptpejeractivados = new Ext.Panel({
            layout: 'fit',
            items: [_this.tpejeractivados],
            region: 'south',
            width: 193,
            height: 300,
            title: 'Ejercicios activados',
            collapsible: true,
            collapsed: true
        });
        //panel para los estados
        _this.ptpestados = new Ext.Panel({
            title: 'Estados',
            margins: '3 3 3 3',
            collapsible: true,
            layout: 'border',
            items: [_this.tpestados, _this.ptpejeractivados],
            width: 195,
            region: 'west'
        });

        //panel donde muestro el grid de permisos
        _this.ppermisosacc = new Ext.Panel({
            layout: 'border',
            items: [_this.pgdpermiso, _this.ptpestados],
            width: 330,
            region: 'center'
        });

        //viewport que contiene la vista principal
        _this.vpPrincipal = new Ext.Viewport({
            id: _this.idcomponente + '_vpprincipal',
            layout: 'border',
            items: [_this.pprocesosfunc, _this.ppermisosacc]
        });


    }

    function rendermarcado(value, m) {
        if (value == 1)
            m.css = 'icondistra-true verde';
        //return '<span><img src=' + perfil.dirImg + 'tick.png' + '>';
    }

    function eliminarAsociacion(idprocesofuncionalidad) {
        myMaskelim = new Ext.LoadMask(Ext.getBody(), {
            msg: 'Eliminando funcionalidad...'
        });
        myMaskelim.show();

        Ext.Ajax.request({
            url: '/planificacion/planmeta/index.php/cmpcontrolprocesos/eliminarAsociacionProcesoFuncionalidad',
            params: {
                idprocesofuncionalidad: idprocesofuncionalidad
            },
            callback: function (options, success, response) {
                myMaskelim.hide();
                responseData = Ext.decode(response.responseText);
                if (responseData.mensaje == 3) {
                    mostrarMensaje(3, 'La relaci&oacute;n proceso-funcionalidad ya no se encuentra en los registros.');
                }
                else if (responseData.mensaje == 1) {
                    mostrarMensaje(1, 'La funcionalidad seleccionada ha sido eliminada satisfactoriamente.');
                    _this.tpfuncionalidades.getRootNode().reload();
                }
            }
        });

    }

    this.ActualizarEstadoBotones = function () {


        _this.arrayidpermisos = [];
        _this.arraydatospermisos = [];

        _this.btnEliminarPermisos.disable();
        _this.btnModificarPermisos.enable();
        if (_this.smGridPermisos.getSelections().length == 0) {
            _this.btnModificarPermisos.disable();
        }
        if (_this.stGppermisos.getCount() < 1) {

            _this.btnModificarPermisos.disable();

        }
        if (_this.smGridPermisos.hasSelection()) {
            var arraypermisosselecc = _this.smGridPermisos.getSelections();
            var totalrecords = arraypermisosselecc.length;
            if (totalrecords > 0) {
                _this.puedeeliminar = 1;
                _this.puedemodificar = 1;


                for (var i = 0; i < totalrecords; i++) {
                    _this.arrayidpermisos[i] = arraypermisosselecc[i].data.idprocesofuncionalidadentidad;

                    var datospermisos = {};
                    datospermisos = {
                        idprocesofuncionalidadentidad: arraypermisosselecc[i].data.idprocesofuncionalidadentidad,
                        eliminar: arraypermisosselecc[i].data.eliminar,
                        guardar: arraypermisosselecc[i].data.guardar,
                        idejercicio: arraypermisosselecc[i].data.idejercicio,
                        identidad: arraypermisosselecc[i].data.identidad,
                        idestado: arraypermisosselecc[i].data.idestado,
                        idprocesofuncionalidad: arraypermisosselecc[i].data.DatProcesofuncionalidadestado.idprocesofuncionalidad,
                        idprocesofuncionalidadestado: arraypermisosselecc[i].data.DatProcesofuncionalidadestado.idprocesofuncionalidadestado,
                        insertar: arraypermisosselecc[i].data.insertar,
                        modificar: arraypermisosselecc[i].data.modificar,
                        ejercicio: arraypermisosselecc[i].data.ejercicio,
                        denomentidad: arraypermisosselecc[i].data.denomentidad
                    };
                    _this.arraydatospermisos.push(datospermisos);
                }

                if (totalrecords == 1 && _this.puedemodificar == 1) {
                    _this.btnModificarPermisos.enable();

                } else if (totalrecords > 1) {
                    _this.btnModificarPermisos.disable();
                }
                if (_this.puedeeliminar == 1) {
                    _this.btnEliminarPermisos.enable();

                } else {
                    _this.btnEliminarPermisos.disable();
                }
            }
        }

    }
    //----------------teclas calientes------------////////////
    map = new Ext.KeyMap(Ext.getDoc(), [
        {
            key: 'iI',
            alt: true,
            fn: function () {
                if (Ext.getCmp('idtpfuncionalidades').disabled == true)
                    _this.objCrudControlProcesos.CrearVentanaCrudProcesosFunciones(accion = 'Adicionar', _this.idproceso, _this.nombreproceso, _this.idtiponomenclador, _this.tpfuncionalidades.getRootNode(), _this.tpestados);
            }
        }, {
            key: 'pP',
            alt: true,
            fn: function () {
                if (Ext.getCmp('ventanaCrudpermisos') == undefined && !_this.btnModificarPermisos.hidden && !_this.btnModificarPermisos.disabled)
                    if (_this.smGridPermisos.getSelections().length == 1) {
                        _this.objCrudControlProcesos.CrudPermisos('Modificar', _this.idprocesofuncionalidad, _this.idestado, _this.stGppermisos, _this.arrayidpermisos[0], _this.arraydatospermisos[0].identidad);
                    } else {
                        _this.objCrudControlProcesos.CrudPermisos('ModificarXEjercicio', _this.idprocesofuncionalidad, _this.idestado, _this.stGppermisos);
                    }
            }
        },
        {
            alt: true,
            key: 46,

            fn: function () {

                if (Ext.getCmp('ventanaCrudpermisos') == undefined && !_this.btnEliminarPermisos.hidden && !_this.btnEliminarPermisos.disabled)
                    _this.objCrudControlProcesos.EliminarPermisos(_this.arrayidpermisos, _this.stGppermisos);
            }
        },
        {
            shift: true,
            key: 46,

            fn: function () {
                if (!_this.btnEliminarProcesosFunc.disabled) {
                    mostrarMensaje(2, '¿Está seguro que quiere eliminar la funcionalidad seleccionada?', function (btnPresionado) {
                        if (btnPresionado == 'ok') {
                            eliminarAsociacion(_this.idprocesofuncionalidad);
                        }
                    });

                }
            }
        },
        {
            key: 'Ll',
            alt: true,
            fn: function () {
                if (Ext.getCmp('ventanaCrudpermisos') == undefined)
                    _this.filterPermisos.clearFilters();
            }
        }, {
            key: 'Hh',
            alt: true,
            fn: function () {
//                if (Ext.getCmp('ventanaCrudpermisos') == undefined)
//                    mostrarAyuda('control de procesos');
            }
        }
    ]);

    //***********funcion para activar estados*****************
    this.estadosActDesact = function () {
        _this.arrayidejercicios = [];
        var arrayselecc = _this.smGridEjercicio.getSelections();
        var totalrecords = arrayselecc.length;

        for (var i = 0; i < totalrecords; i++) {
            _this.arrayidejercicios[i] = arrayselecc[i].data.id;

        }
        var mensajeprogreso = 'Activando estado...';
        if (_this.activo == 0) {
            mensajeprogreso = 'Desactivando estado...';
        }
        _this.BarraProgreso.show(mensajeprogreso);
        Ext.Ajax.request({
            url: 'activarEstado',
            params: {
                idestado: _this.idestado,
                activo: _this.activo,
                arrayejercicio: Ext.encode(_this.arrayidejercicios),
                idprocesofuncionalidad: _this.idprocesofuncionalidad
            },
            callback: function (options, success, response) {
                _this.BarraProgreso.hide();
                responseData = Ext.decode(response.responseText);
                if (responseData.mensaje == 1) {
                    if (_this.activo == 1) {
                        mostrarMensaje(1, 'El estado ha sido activado satisfactoriamente para el(los) ejercicio(s) seleccionado(s).');
                        _this.tpestados.getRootNode().reload();
                        _this.ventanaEjercicios.hide();
                    } else {
                        mostrarMensaje(1, 'El estado ha sido desactivado satisfactoriamente para el(los) ejercicio(s) seleccionado(s).');
                        _this.tpestados.getRootNode().reload();
                        _this.ventanaEjercicios.hide();
                    }
                }
                if (responseData.mensaje == 0) {
                    mostrarMensaje(1, 'No se pudo realizar la operación');
                    _this.ventanaEjercicios.hide();
                }

            }
        });


    }

}
