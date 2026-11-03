Utilidades.Cmp.Cmpgestionarplantilla = function (opcionesConfig) {

    var _this = this;
    Ext.Ajax.timeout = 1000000000;
    this.prevrow = -1;
    this.start = 0;
    this.idEstructura = null;
    this.incluProyecto = null;
    this.incluPlantilla = opcionesConfig.incluPlantilla;
    _this.desdeCalculo = (opcionesConfig.desdeCalculo) ? true : false;

    //componente para el manejo de los mensajes de errores de texto regido
    this.ObjValidaciones = new Utilidades.Cmp.Cmpvalidaciones();

    //objeto del componente observaciones inicializado
    this.objCmpObservaciones = new Utilidades.Cmp.Cmpgestionarobservaciones();

    //objeto CRUD-PROYECTO inicializado
    this.objCrudproyecto = new Utilidades.Cmp.Cmpcrudproyecto();

    //objeto del componente "barra de progreso"
    this.BarraProgreso = new BarraEstado();

    //objeto CRUD-HITO inicializado
    this.objCrudhito = new Utilidades.Cmp.Cmpcrudhito();

    //objeto de la clase de configuracion de NodeJS
    this.objNodeJS = new Utilidades.Cmp.ServerPortNodeJS();

    this.objcmpmenurelacionesdin = new Utilidades.Cmp.CmpMenuRelacionesDinamicas();

    //objeto CRUD-TAREA inicializado
    this.objCrudtarea = new Utilidades.Cmp.Cmpcrudtarea(opcionesConfig);

    //objeto del componente "clasificador de involucrados"
    this.objclasificadorinvol = new Utilidades.Cmp.Cmpclasificadorinvol();

    //objeto del componente "Gestionar Estructura"
    this.objestructura = new Utilidades.Cmp.Cmpgestionarestructura();

    //objeto del componente "Matriz de Relaciones"
    this.objMatrizRelaciones = new Planificacion.Integracion.MatrizrelacionesController();

    this.objactivrecurso = new Utilidades.Cmp.Cmpcrudactividadrecurso();

    this.objcompresion = new Utilidades.Cmp.Cmpcompresion();

    this.objejecucion = new Utilidades.Cmp.Cmpejecucion();

    this.objgenerardependencias = new Utilidades.Cmp.Cmpgenerardependencias();
    
    this.objgenerarCL = new Utilidades.Cmp.Cmpcartalimite();

    this.objCmpPert = new Utilidades.Cmp.Cmpgestionarpert(
        {
            noUsarCerrarWinP: false,
            noUsarSeleccionarWinP: true,
            maxWinPrincipal: true,
            tipoComponente: 'window',
            idcmp: 001 + "planes",
            noAutoload: false,
            titleWinPrincipal: 'Diagrama de Pert',
            noUsarAyuda: false,
            objCmpCrudActividad: _this.objCrudtarea,
            generarDiagramaDesde: 'Proyecto'
        });
    //variables
    this.elementosseleccionados = [];
    this.arrayidelementos = [];
    this.arrayplanesseleccionados = [];
    this.arrayidElementosReorganizar = [];
    this.arrayidestadoaprob = [];
    this.posteliminar = false;
    this.arrayArbolGeneologico = [];
    this.copiarcortartarea = 0;
    this.copiarcortarhito = 0;
    this.tipoelempegar = '';
    this.copiarcortarelementos = 0;
    this.arrayidelementopegar = [];
    this.id_parent;
    expandirGrid = false;
    this.fecha_hora_server;
    // botones para la gestion de las plantillas
    //_this.winNombre = new Planificacion.Integracion.WinResumenTareas({});

    this.btnResumen = new Ext.Button({
        iconCls: 'crearreporte',
        disabled: true,
        hidden: true,
        handler: function () {
            _this.winNombre.btnAceptar.handler = function () {
                if (_this.winNombre.tiporeporte == 2) {
                    _this.generarReporte({
                        tipo: 6,
                        fechainicio: _this.winNombre.finieventos.getValue(),
                        fechafin: _this.winNombre.ffineventos.getValue()
                    });
                    _this.winNombre.hide();
                } else {
                    _this.winNombre.hide();
                }
            };
            _this.winNombre.show();
        },
        tooltip: 'Generar Resumen de Tareas',
        key: {
            ctrl: true,
            key: 'G'
        },
        scope: this
    });

    this.btnGenerarPert = new Ext.Button({
        iconCls: 'graficar',
        disabled: true,
        handler: function () {
            _this.objCmpPert.CargarCmpPert(tipoelemento = 0, _this.elementosseleccionados[0].data, _this);
        },
        tooltip: 'Generar diagrama de Pert',
        key: {
            ctrl: true,
            key: 'G'
        },
        scope: this
    });

    this.btnGenerarCompresion = new Ext.Button({
        iconCls: 'reevaluacion',
        disabled: true,
        handler: function () {
            var arrayAsociativoCompresion = [];
            arrayAsociativoCompresion.push({
                idproyecto: (_this.arrayidelementos[0]) ? _this.arrayidelementos[0].id : false,
                denproyecto: (_this.arrayidelementos[0]) ? _this.arrayidelementos[0].denominacion : false,
                fechainicio: _this.elementosseleccionados[0].data.fechainicio,
                gradocumplimiento: (_this.arrayidelementos[0]) ? _this.elementosseleccionados[0].data.gradocumplimiento : false,
                duracionestimada: (_this.arrayidelementos[0]) ? _this.elementosseleccionados[0].data.duracionestimada : false,
                fechafin: _this.elementosseleccionados[0].data.fechafin,
                idestructura: _this.tpEstructuras.selModel.selNode.attributes.id,
                denomestructura: _this.tpEstructuras.selModel.selNode.attributes.text
            });
            _this.objcompresion.crearWinCompresion(_this, arrayAsociativoCompresion);
        },
        tooltip: 'Generar compresi&oacute;n del proyecto',
        key: {
            ctrl: true,
            key: 'P'
        },
        scope: this
    });

    this.menuMatriz = new Ext.Toolbar.MenuButton({
        tooltip: 'Generar matriz',
        disabled: true,
        iconCls: 'tablasporcategoria',
        menu: {
            items: [
                {
                    tooltip: 'Generar matriz de recursos',
                    text: 'Generar matriz de recursos',
                    iconCls: 'tablasporcategoria',
                    key: {
                        ctrl: true,
                        key: 'M'
                    },
                    handler: function () {
                        _this.generarMatrizRecurso();
                    }
                }, {
                    text: 'Generar matriz híbrida',
                    tooltip: 'Generar matriz híbrida',
                    iconCls: 'tablasporcategoria',
                    key: {
                        ctrl: true,
                        alt: true,
                        key: 'M'
                    },
                    handler: function () {
                        _this.generarMatrizHibrida();
                    },
                    scope: this
                }, {
                    text: 'Generar matriz híbrida por tareas',
                    tooltip: 'Generar matriz híbrida por tareas',
                    iconCls: 'tablasporcategoria',
                    key: {
                        ctrl: true,
                        alt: true,
                        key: 'M'
                    },
                    handler: function () {
                        _this.generarMatrizHibridaTareas();
                    },
                    scope: this
                }, {
                    text: 'Generar matriz de tiempo',
                    hidden: true,
                    tooltip: 'Generar matriz de tiempo',
                    iconCls: 'tablasporcategoria',
                    key: {
                        ctrl: true,
                        alt: true,
                        key: 'M'
                    },
                    handler: function () {
                        _this.generarMatrizTiempos();

                    },
                    scope: this
                }, {
                    text: 'Generar matriz de costo',
                    tooltip: 'Generar matriz de costo',
                    iconCls: 'tablasporcategoria',
                    key: {
                        ctrl: true,
                        alt: true,
                        //   key: 'M'
                    },
                    handler: function () {
                        _this.generarReporte({tipo: 10});
                    },
                    scope: this
                }, {
                    text: 'Generar matriz de pendiente',
                    tooltip: 'Generar matriz de pendiente',
                    iconCls: 'tablasporcategoria',
                    key: {
                        ctrl: true,
                        alt: true,
                        // key: 'M'
                    },
                    handler: function () {
                        _this.generarReporte({tipo: 11});
                    },
                    scope: this
                }, {
                    text: 'Generar matriz de elasticidad',
                    tooltip: 'Generar matriz de elasticidad',
                    iconCls: 'tablasporcategoria',
                    key: {
                        ctrl: true,
                        alt: true,
                        // key: 'M'
                    },
                    handler: function () {
                        _this.generarReporte({tipo: 12});
                    },
                    scope: this
                }, {
                    text: 'Generar matriz de secuencia',
                    tooltip: 'Generar matriz de secuencia',
                    iconCls: 'tablasporcategoria',
                    key: {
                        ctrl: true,
                        alt: true,
                        // key: 'M'
                    },
                    handler: function () {
                        _this.generarReporte({tipo: 13});
                    },
                    scope: this
                }, {
                    text: 'Generar matriz de antecedentes',
                    tooltip: 'Generar matriz de antecedentes',
                    iconCls: 'tablasporcategoria',
                    key: {
                        ctrl: true,
                        alt: true,
                        // key: 'M'
                    },
                    handler: function () {
                        _this.generarReporte({tipo: 14});
                    },
                    scope: this
                }, {
                    text: 'Generar matriz de tiempo',
                    tooltip: 'Generar matriz de tiempo',
                    iconCls: 'tablasporcategoria',
                    key: {
                        ctrl: true,
                        alt: true,
                        // key: 'M'
                    },
                    handler: function () {
                        _this.generarReporte({tipo: 15});
                    },
                    scope: this
                }
            ]
        }
    });

    this.menuReporte = new Ext.Toolbar.MenuButton({
        tooltip: 'Generar reporte',
        disabled: true,
        iconCls: 'crearreporte',
        menu: {
            items: [
                {
                    tooltip: 'Estado de cumplimiento',
                    text: 'Estado de cumplimiento',
                    iconCls: 'crearreporte',
                    handler: function () {
                        _this.generarReporte({tipo: 1})
                    }
                }, {
                    text: 'Avance programado por días',
                    tooltip: 'Avance programado por días',
                    iconCls: 'crearreporte',
                    handler: function () {
                        _this.generarReporte({tipo: 2})
                    },
                    scope: this
                }, {
                    text: 'Ruta crítica del proyecto',
                    tooltip: 'Ruta crítica del proyecto',
                    iconCls: 'crearreporte',
                    handler: function () {
                        _this.generarReporte({tipo: 3})
                    },
                    scope: this
                }, {
                    text: 'Plazos principales del proyecto',
                    iconCls: 'crearreporte',
                    tooltip: 'Plazos principales del proyecto',
                    handler: function () {
                        _this.generarReporte({tipo: 4})
                    },
                    scope: this
                }, {
                    text: 'Resumen de recursos y equipamientos',
                    iconCls: 'crearreporte',
                    tooltip: 'Resumen de recursos y equipamientos',
                    handler: function () {
                        _this.generarReporte({tipo: 5})
                    },
                    scope: this
                }, {
                    text: 'Resumen de tareas semanal',
                    iconCls: 'crearreporte',
                    tooltip: 'Resumen de tareas semanal',
                    handler: function () {
                        _this.generarReporte({tipo: 6})
                    },
                    scope: this
                }, {
                    text: 'Plan vs Real',
                    iconCls: 'crearreporte',
                    tooltip: 'Plan vs Real',
                    handler: function () {
                        _this.generarReporte({tipo: 7})
                    },
                    scope: this
                }, {
                    text: 'Porcentaje de avance real de las Tareas',
                    iconCls: 'crearreporte',
                    tooltip: 'Porcentaje de avance real de las Tareas',
                    handler: function () {
                        _this.generarReporte({tipo: 8})
                    },
                    scope: this
                }, {
                    text: 'Resumen de tareas cumplidas fuera de tiempo',
                    iconCls: 'crearreporte',
                    tooltip: 'Resumen de tareas cumplidas fuera de tiempo',
                    handler: function () {
                        _this.generarReporte({tipo: 9})
                    },
                    scope: this
                }
            ]
        }
    });


    /******************************
     * Exportar importar elemento
     * **************************/

    this.MenuItemExportarElemento = new Ext.menu.Item({
        tooltip: 'Exportar elemento.',
        text: 'Exportar elemento',
        disabled: true,
        iconCls: 'exportar',
        handler: function () {
            _this.exportarElemento();
        }
    });
    this.MenuItemImportarElemento = new Ext.menu.Item({
        tooltip: 'Importar elemento.',
        text: 'Importar elemento',
        iconCls: 'importar',
        handler: function () {
            _this.importarElementosExcel();
        }
    });

    this.MenuItemImportarTareasExcel = new Ext.menu.Item({
        text: 'Importar actividades v1(Excel)',
        handler: function () {
            var version = 'v1';
            _this.CargarVentanaImportarTarea(version);
        },
        text: 'Importar actividades v1(Excel)',
        disabled: true,
        iconCls: 'importar',
        tooltip: 'Importar actividades v1(Excel).'
    });

    this.MenuItemImportarTareasExcel2 = new Ext.menu.Item({
        text: 'Importar actividades v2(Excel)',
        handler: function () {
            var version = 'v2';
            _this.CargarVentanaImportarTarea(version);
        },
        text: 'Importar actividades v2(Excel)',
        disabled: true,
        iconCls: 'importar',
        tooltip: 'Importar actividades v2(Excel).'
    });

    this.MenuItemDescargarPlantillaExcel = new Ext.menu.Item({
        text: 'Descargar plantilla v1(Excel)',
        handler: function () {
            window.open('../../resources/plantillas/PLANTILLA_IMPORTAR_TAREAS.xls');
        },
        text: 'Descargar plantilla v1(Excel)',
        iconCls: 'importar',
        tooltip: 'Descargar plantilla v1 para importar actividades.'
    });

    this.MenuItemDescargarPlantillaExcel2 = new Ext.menu.Item({
        text: 'Descargar plantilla v2(Excel)',
        handler: function () {
            window.open('../../resources/plantillas/PLANTILLA_IMPORTAR_TAREAS_v2.xls');
        },
        text: 'Descargar plantilla v2(Excel)',
        iconCls: 'importar',
        tooltip: 'Descargar plantilla v2 para importar actividades.'
    });

    this.menuExportarImportarElemento = new Ext.Toolbar.MenuButton({
        tooltip: 'Intercambio de información',
        //hidden: true,
        iconCls: 'intercambiar',
        menu: {
            items: [_this.MenuItemExportarElemento, _this.MenuItemImportarElemento, _this.MenuItemImportarTareasExcel,
                _this.MenuItemImportarTareasExcel2, _this.MenuItemDescargarPlantillaExcel, _this.MenuItemDescargarPlantillaExcel2
            ]
        }
    });


    this.btnGenerarmatriz = new Ext.Button({
        iconCls: 'tablasporcategoria',
        // disabled: true,
        hidden: true,
        handler: function () {
            _this.generarMatrizRecurso();
        },
        tooltip: 'Generar matriz de recursos',
        key: {
            ctrl: true,
            key: 'M'
        },
        scope: this
    });
    this.btnGenerarmatrizH = new Ext.Button({
        iconCls: 'tablasporcategoria',
        // disabled: true,
        hidden: true,
        handler: function () {
            _this.generarMatrizHibrida();
        },
        tooltip: 'Generar matriz de híbrida',
        key: {
            ctrl: true,
            key: 'M'
        },
        scope: this
    });

    this.menuAdicionar = new Ext.Toolbar.MenuButton({
        tooltip: 'Adicionar proyecto/plantilla',
        iconCls: 'adicionar',
        menu: {
            items: [
                {
                    text: 'Adicionar proyecto',
                    handler: function () {
                        _this.objCrudproyecto.CrearWinCrudproyecto(
                            'Adicionar', 'proyecto', _this.PostAccionesGestionar, null, _this.objestructura.idEstructura);
                    },
                    disabled: false,
                    iconCls: 'adicionar',
                    tooltip: 'Adicionar proyecto'
                }, {
                    text: 'Adicionar plantilla de proyecto',
                    handler: function () {
                        _this.objCrudproyecto.CrearWinCrudproyecto(
                            'Adicionar', 'plantilla', _this.PostAccionesGestionar, null, _this.objestructura.idEstructura);
                    },
                    disabled: false,
                    iconCls: 'adicionar',
                    tooltip: 'Adicionar plantilla de proyecto'
                }
            ]
        }
    });
    this.btnModificar = new Ext.Button({
        handler: function () {
            _this.modificarElemento();
        },
        disabled: true,
        iconCls: 'modificar',
        tooltip: 'Modificar elemento'
    });
    this.btnEliminar = new Ext.Button({
        handler: function () {
            _this.EliminarElemento();
        },
        disabled: true,
        iconCls: 'eliminar',
        tooltip: 'Eliminar elemento'
    });
    this.btnGestObs = new Ext.Button({
        handler: function () {
            if (_this.arrayidelementos[0].tipo == 10) {
                tipo = 'tarea';
            } else if (_this.arrayidelementos[0].tipo == 9) {
                tipo = 'hito';
            } else if (_this.arrayidelementos[0].tipo == 8) {
                if (_this.arrayidelementos[0].plantilla == 1) {
                    tipo = 'plantilla';
                } else {
                    tipo = 'proyecto';
                }
            }
            _this.objCmpObservaciones.CargarCmpObservaciones(
                _this.arrayidelementos[0].id, tipo, _this.PostAccionesGestionar);
        },
        disabled: true,
        hidden: true,
        iconCls: 'vistareporte',
        tooltip: 'Gestionar observaciones al elemento'
    });

    this.btnDesasociar = new Ext.Button({
        tooltip: "Desasociar inversión a proyecto",
        disabled: true,
        hidden: opcionesConfig.desasociarVisible,
        iconCls: 'cambiosdecuenta',
        handler: function () {
            _this.desasociarInversionProyecto();
        }
    });

    this.btnBuscar = new Ext.Button({
        disabled: false,
        iconCls: 'buscar',
        tooltip: 'B&uacute;squeda avanzada de elementos',
        handler: function () {
            _this.panelBuscarPlantilla.toggleCollapse(true);
        }
    });
    this.btnLimpiar = new Ext.Button({
        disabled: false,
        handler: function () {
            _this.cmbproyecto.reset();
            _this.panelBuscarPlantilla.collapse();
            _this.objclasificadorinvol.ResetearArbolesBusqueda();
            _this.smPlantilla.clearSelections();
            _this.stPlantilla.baseParams.arrayautores = '';
            _this.stPlantilla.baseParams.arrayinvolucrados = '';
            if (_this.ftPlantilla.getFiltrosActivos() == undefined || _this.ftPlantilla.getFiltrosActivos().length == 0) {
                _this.stPlantilla.reload({
                    params: {
                        idproyectoParaFiltro: null
                    }
                });
            } else {
                _this.ftPlantilla.clearFilters();
            }
        },
        iconCls: 'limpiar',
        tooltip: 'Limpiar filtro(s)'
    });
    this.btnAyuda = new Ext.Button({
        id: 'btnAyudaGestionarPlantilla',
        text: 'Ayuda',
        iconCls: 'ayuda',
        hidden: false,
        tooltip: 'Mostrar ayuda de la funcionalidad'
    });

    this.btnAddHito = new Ext.Button({
        handler: function () {
            if (_this.elementosseleccionados.length == 1
                && (_this.elementosseleccionados[0].data.tipoelemento == 8
                    || _this.elementosseleccionados[0].data.tipoelemento == 9)) {
                padre = _this.elementosseleccionados[0].data;
            }
            _this.objCrudhito.CrearWinCrudhito(
                'Adicionar', padre, _this.PostAccionesGestionar, _this.arrayidelementos, _this.objestructura.idEstructura);
        },
        disabled: true,
        iconCls: 'asentar', //'noevaluado',
        tooltip: 'Adicionar hito'
    });
    this.btnAddTarea = new Ext.Button({
        handler: function () {
            if (_this.elementosseleccionados.length == 1) {
                padre = _this.elementosseleccionados[0].data;
            }
            _this.objCrudtarea.CrearWinCrudtarea(
                'Adicionar', padre, _this.PostAccionesGestionar, _this.arrayidelementos, null, _this.objestructura.idEstructura);
        },
        disabled: true,
        iconCls: 'tarea',
        tooltip: 'Adicionar tarea'
    });
    /*this.btnImportarProyecto = new Ext.Button({
     handler: function () {
     if (_this.wImportar) {
     _this.wImportar.show();
     } else {
     _this.CargarVentanaImportarProyecto();
     }
     
     },
     disabled: true,
     iconCls: 'importar',
     tooltip: 'Importar proyecto'
     });
     
     this.btnImportarTareas = new Ext.Button({
     handler: function () {
     if (_this.wImportarTarea) {
     _this.wImportarTarea.show();
     } else {
     _this.CargarVentanaImportarTarea();
     }
     
     },
     disabled: true,
     iconCls: 'importar',
     tooltip: 'Importar tareas'
     });*/

    this.menuImportar = new Ext.Toolbar.MenuButton({
        tooltip: 'Importar',
        iconCls: 'importar',
        disabled: false,
        hidden: true,
        menu: {
            items: [
                {
                    handler: function () {
                        if (_this.wImportar) {
                            _this.wImportar.show();
                        } else {
                            _this.CargarVentanaImportarProyecto();
                        }
                    },
                    disabled: true,
                    hidden: true,
                    text: 'Importar proyecto (xml)',
                    iconCls: 'importar',
                    tooltip: 'Importar proyecto generado por MS Project (xml)',
                    id: 'btnImportarAct',
                    key: {
                        ctrl: true,
                        alt: true,
                        key: 'I'
                    },
                    scope: this
                }, {
                    text: 'Importar actividades (Excel)',
                    handler: function () {
                        if (_this.wImportarTarea) {
                            _this.wImportarTarea.show();
                        } else {
                            _this.CargarVentanaImportarTarea();
                        }
                    },
                    disabled: true,
                    hidden: true,
                    text: 'Importar actividades (Excel)',
                    iconCls: 'importar',
                    tooltip: 'Importar actividades (Excel)',
                    id: 'importexcel'
                }
            ]
        }
    });

    this.CargarVentanaImportarProyecto = function () {
        _this.fpImportar = new Ext.FormPanel({
            labelAlign: 'top',
            fileUpload: true,
            frame: true,
            items: [{
                xtype: 'fileuploadfield',
                fieldLabel: 'Importar archivo',
                id: 'form-file',
                emptyText: 'Seleccione el archivo...',
                name: 'file',
                anchor: '95%',
                buttonCfg: {
                    text: '',
                    anchor: '95%',
                    iconCls: 'buscar'
                },
                allowBlank: false
            }]
        });

        _this.btnCancelar = new Ext.Button({
            iconCls: 'cancelar',
            text: 'Cancelar',
            tooltip: 'Cerrar ventana sin guardar los datos',
            handler: function () {
                _this.fpImportar.getForm().reset();
                _this.wImportar.hide();
            }
        });

        _this.btnAceptar = new Ext.Button({
            iconCls: 'aceptar',
            text: 'Aceptar',
            tooltip: 'Guardar datos y cerrar ventana',
            handler: function () {
                _this.importarElementos();
            }
        });

        _this.importarElementos = function () {
            var barraImpor = Ext.MessageBox.show({
                title: 'Importando datos',
                msg: 'Espere por favor esto puede demorar unos minutos...',
                width: 270,
                wait: true,
                progress: true,
                closable: false
            });
            _this.fpImportar.getForm().submit(
                {
                    method: 'POST',
                    url: 'importarProyecto',
                    timeout: 3600000,
                    params: {
                        idEstructura: _this.objestructura.idEstructura
                    },
                    failure: function (form, action) {
                        barraImpor.hide();
                        if (action.result.mensaje == 1) {
                            mostrarMensaje(1, 'Los datos fueron cargados correctamente.');
                            //_this.wImportar.destroy();
                            _this.fpImportar.getForm().reset();
                            _this.wImportar.hide();
                            _this.stPlantilla.reload();
                        } else if (action.result.mensaje == 2) {
                            mostrarMensaje(1, 'Los datos no fueron cargados correctamente.');
                        } else if (action.result.mensaje == 3) {
                            mostrarMensaje(1, action.result.msgText);
                        } else if (action.result.cod == 4) {
                            mostrarMensaje(1, action.result.mensaje);
                        } else if (action.result.success == false) {
                            mostrarMensaje(1, action.result.mensaje);
                        }
                    }
                }
            );
        }

        _this.wImportar = new Ext.Window({
            modal: true,
            closeAction: 'hide',
            constrain: true,
            layout: 'fit',
            title: 'Importar archivo',
            width: 420,
            height: 130,
            items: [_this.fpImportar],
            buttons: [_this.btnCancelar, _this.btnAceptar]
        });
        _this.wImportar.show();

    }

    this.CargarVentanaImportarTarea = function (version) {
        _this.fpImportarTarea = new Ext.FormPanel({
            labelAlign: 'top',
            fileUpload: true,
            frame: true,
            items: [{
                xtype: 'fileuploadfield',
                fieldLabel: 'Importar archivo',
                id: 'form-file-tarea',
                emptyText: 'Seleccione el archivo...',
                name: 'file',
                anchor: '95%',
                buttonCfg: {
                    text: '',
                    anchor: '95%',
                    iconCls: 'buscar'
                },
                allowBlank: false
            }]
        });

        _this.btnCancelarTarea = new Ext.Button({
            iconCls: 'cancelar',
            text: 'Cancelar',
            tooltip: 'Cerrar ventana sin guardar los datos',
            handler: function () {
                _this.fpImportarTarea.getForm().reset();
                _this.wImportarTarea.destroy();
            }
        });

        _this.btnAceptarTarea = new Ext.Button({
            iconCls: 'aceptar',
            text: 'Aceptar',
            tooltip: 'Guardar datos y cerrar ventana',
            handler: function () {
                _this.importarElementosTarea(version);
            }
        });

        _this.importarElementosTarea = function (version) {
            var barraImporTarea = Ext.MessageBox.show({
                title: 'Importando datos',
                msg: 'Espere por favor esto puede demorar unos minutos...',
                width: 270,
                wait: true,
                progress: true,
                closable: false
            });

            var plantilla = "";
            if (_this.arrayidelementos.length > 0) {
                plantilla = '0';
                if (_this.arrayidelementos[0].plantilla == 1)
                    plantilla = '1';
            }

            _this.fpImportarTarea.getForm().submit(
                {
                    method: 'POST',
                    url: 'importarTarea'+version,
                    timeout: 3600000,
                    params: {
                        idEstructura: _this.objestructura.idEstructura,
                        idpadre: _this.smPlantilla.getSelected().id,
                        plantilla: plantilla
                    },
                    failure: function (form, action) {
                        barraImporTarea.hide();
                        if (action.result.mensaje == 1) {
                            mostrarMensaje(1, 'Los datos fueron cargados correctamente.');
                            _this.fpImportarTarea.getForm().reset();
                            _this.wImportarTarea.destroy();
                            var rec = _this.smPlantilla.getSelected();
                            var recparent = _this.stPlantilla.getById(rec.data.idelemento);
                            if (rec.data._is_leaf) {
                                recparent.set('_is_leaf', false);
                                _this.tgPlantillas.getView().refresh();
                            }
                            _this.smPlantilla.selectRecords([recparent]);
                            _this.actualizarBarraHerramientas();
                            _this.RecargarNodo(recparent.id, 0, recparent);

                        } else if (action.result.mensaje == 2) {
                            mostrarMensaje(1, 'Los datos no fueron cargados correctamente.');
                        } else if (action.result.mensaje == 3) {
                            mostrarMensaje(1, action.result.msgText);
                        } else if (action.result.cod == 4) {
                            mostrarMensaje(1, action.result.mensaje);
                        } else if (action.result.cod == 6) {
                            mostrarMensaje(1, action.result.mensaje);
                        } else if (action.result.cod == 7) {
                            mostrarMensaje(1, action.result.mensaje);
                        } else if (action.result.success == false) {
                            mostrarMensaje(1, action.result.mensaje);
                        }
                    }
                }
            );
        }

        _this.wImportarTarea = new Ext.Window({
            modal: true,
            closeAction: 'destroy',
            constrain: true,
            layout: 'fit',
            title: 'Importar archivo',
            width: 420,
            height: 130,
            items: [_this.fpImportarTarea],
            buttons: [_this.btnCancelarTarea, _this.btnAceptarTarea]
        });
        _this.wImportarTarea.show();

    }

    this.btnCambiarEstado = new Ext.Button({
        tooltip: 'Cambiar el estado de aprobaci&oacute;n del (de los) elemento(s)',
        disabled: false,
        hidden: true,
        iconCls: 'cambiodestado',
        // id: 'itmaprov',
        menu: _this.objcmpmenurelacionesdin.menuinicial,
        handler: function () {
            _this.objcmpmenurelacionesdin.menuinicial;
            var mensaje = '';
            if (_this.arrayidelementos.length > 1) {
                mensaje = 'No existen otros estados al cual usted pueda cambiar los elementos desde el estado actual.';
            } else {
                if (_this.arrayidelementos[0].tipo == 10) {
                    tipo = ' la tarea';
                } else if (_this.arrayidelementos[0].tipo == 9) {
                    tipo = ' el hito';
                } else if (_this.arrayidelementos[0].tipo == 8) {
                    if (_this.arrayidelementos[0].plantilla == 1) {
                        tipo = ' la plantilla';
                    } else {
                        tipo = ' el proyecto';
                    }
                }
                mensaje = 'No existen otros estados al cual usted pueda cambiar ' + tipo + ' desde el estado actual.';
            }
            //actualizar el sub-menu de Cambiar estado
            _this.objcmpmenurelacionesdin.CrearMenuAprobacionConc(
                _this.accionesPostEjecutarFT, mensaje,
                _this.tgPlantillas,
                '',
                _this.arraySoloIdElementos,
                _this.arrayidestadoaprob,
                _this.arrayidelementos[0].tipo
            );
        }
    });

    this.btnGenerarPlantilla = new Ext.Button({
        handler: function () {
            _this.mostrarVentana(1);
        },
        disabled: true,
        iconCls: 'icondistra-planilla sipac-carmelita',
        tooltip: 'Generar plantilla'
    });
    this.btnGenerarProyecto = new Ext.Button({
        handler: function () {
            _this.mostrarVentana(0);
        },
        disabled: true,
        iconCls: 'icondistra-planilla sipac-azul',
        tooltip: 'Generar proyecto'
    });
    this.btnDuplicar = new Ext.Button({
        disabled: true,
        handler: function () {
            if (_this.arrayidelementos[0].tipo == 8) {
                var tipo = 'proyecto';
                if (_this.arrayidelementos[0].plantilla == 1)
                    tipo = 'plantilla';
                _this.objCrudproyecto.CrearWinCrudproyecto(
                    'Duplicar', tipo, _this.PostAccionesGestionar,
                    _this.arrayidelementos, _this.objestructura.idEstructura);
            } else {
                var index = _this.stPlantilla.find(
                    'idelemento', _this.elementosseleccionados[0].data._parent,
                    0, true, false);
                var padre = _this.stPlantilla.getAt(index);
                if (_this.arrayidelementos[0].tipo == 10) {
                    _this.objCrudtarea.CrearWinCrudtarea(
                        'Duplicar', padre.data, _this.PostAccionesGestionar,
                        _this.arrayidelementos, null, _this.objestructura.idEstructura);
                } else {
                    _this.objCrudhito.CrearWinCrudhito(
                        'Duplicar', padre.data, _this.PostAccionesGestionar,
                        _this.arrayidelementos, _this.objestructura.idEstructura);
                }
            }
        },
        iconCls: 'duplicar',
        tooltip: 'Duplicar elemento'
    });
    this.btnReagsinaciones = new Ext.Button({
        disabled: true,
        hidden: true,
        tooltip: 'Control de reasignaciones',
        iconCls: 'cambiar',
        handler: function () {
        }
    });
    this.btnHistorial = new Ext.Button({
        disabled: true,
        hidden: true,
        iconCls: 'historial',
        tooltip: 'Consultar historial del elemento',
        handler: function () {
        }
    });
    this.btnVerDatos = new Ext.Button({
        disabled: true,
        //hidden: true,
        iconCls: 'ver',
        tooltip: 'Ver datos del elemento',
        handler: function () {
            if (_this.arrayidelementos[0].tipo == 8) {
                var tipo = 'proyecto';
                if (_this.arrayidelementos[0].plantilla == 1)
                    tipo = 'plantilla';
                _this.objCrudproyecto.CrearWinCrudproyecto(
                    'Ver datos de', tipo, _this.PostAccionesGestionar,
                    _this.arrayidelementos);
            } else {
                var index = _this.stPlantilla.find(
                    'idelemento', _this.elementosseleccionados[0].data._parent,
                    0, true, false);
                var padre = _this.stPlantilla.getAt(index);
                if (_this.arrayidelementos[0].tipo == 10) {
                    _this.objCrudtarea.CrearWinCrudtarea(
                        'Ver datos de la', padre.data, _this.PostAccionesGestionar,
                        _this.arrayidelementos);
                } else {
                    _this.objCrudhito.CrearWinCrudhito(
                        'Ver datos del', padre.data, _this.PostAccionesGestionar,
                        _this.arrayidelementos);
                }
            }
        }
    });
    this.btnReorganizar = new Ext.Button({
        disabled: true,
        hidden: true,
        iconCls: 'diferenciaconbanco',
        tooltip: 'Reorganizar elementos',
        handler: function () {
            _this.ReorganizarHijos();
        }
    });
    this.btnNotificaciones = new Ext.Button({
        disabled: false,
        hidden: true,
        iconCls: 'notificaciones',
        tooltip: 'Consultar notificaciones generadas',
        handler: function () {
        }
    });
    this.btnCargasPorDefecto = new Ext.Button({
        handler: function () {
        },
        disabled: false,
        hidden: true,
        iconCls: 'filtrar',
        tooltip: 'Cargas por defecto'
    });
    this.btnInvolucrarUsuarios = new Ext.Button({
        handler: function () {
            _this.ConstruirWinInvolucrarUsuarios();
        },
        disabled: true,
        //hidden: true,
        iconCls: 'validacionmasiva', //'noevaluado',
        tooltip: 'Involucrar usuarios'
    });
    this.btnAsociarRecursos = new Ext.Button({
        handler: function () {
            var idelemento =  _this.arrayidelementos[0].id;
            _this.ConstruirWinAsociarRecursos(idelemento);
        },
        disabled: true,
        //hidden: true,
        iconCls: 'recursos',
        tooltip: 'Asociar Recursos'
    });

    this.btnEjecutarProyecto = new Ext.Button({
        handler: function () {
            _this.objejecucion.crearWinEjecucion(_this.arrayidelementos[0].id);
        },
        disabled: true,
        // hidden: true,
        iconCls: 'ejecutar',
        tooltip: 'Ejecutar Proyecto'
    });
    this.btnGenerarDependencias = new Ext.Button({
        handler: function () {
            _this.objgenerardependencias.crearWinGenerarDependencia(_this.arrayidelementos[0].id, _this.objestructura);
        },
        disabled: true,
        //hidden: true,
        iconCls: 'estructura',
        tooltip: 'Generar dependencias entre tareas de un proyecto'
    });
    
    this.btnGenerarCLS = new Ext.Button({
        handler: function () {
            _this.objgenerarCL.WinCL2(_this.arrayidelementos[0].id, _this.objestructura);
        },
        disabled: true,
        //hidden: true,
        iconCls: 'modificar',
        tooltip: 'Genenerar Cartas límites'
    });


    // nodeJS, socket-io - Generar Eventos
    this.socketEvents = new io.connect(_this.objNodeJS.ip_servidor, {port: _this.objNodeJS.port_servidor});
    _this.socketEvents.on('connect', function () {
    });
    _this.socketEvents.on('actualizarPorcientoCumplimiento', function (data) {
        _this.objCmpPert.actualizarDiagramaTareasCumplidas(data);
    });
    _this.socketEvents.on('validarIncumplimiento', function (fecha_hora_server) {
        _this.objCmpPert.validarIncumplimiento(fecha_hora_server);
    });

    //btnActCumplimiento
    this.btn100 = new Ext.Button({
        disabled: true,
        iconCls: 'icondistra-bandera sipac-verde',
        tooltip: 'Actualizar tarea(s) al 100% de cumplimiento',
        handler: function () {
            _this.actualizarCumplimiento(1);
        },
        key: {
            alt: true,
            key: 'W'
        }
    });

    this.btnOtroValor = new Ext.Button({
        disabled: true,
        iconCls: 'icondistra-bandera sipac-amarilla',
        tooltip: 'Actualizar % cumplimiento de la(s) tarea(s)',
        handler: function () {
            _this.actualizarCumplimiento(2);
        },
        key: {
            ctrl: true,
            alt: true,
            key: 'W'
        }
    });

    /*this.btn_nivelactividad = new Ext.Button({
     tooltip: "Niveles de Actividad",
     //icon: perfil.dirImg + 'server.png',
     disabled: false,
     hidden: false,
     iconCls: 'ver',
     handler: function() {
     _this.objCmpintegracionproyectonivelesact.CrearWinIntegracionProyectoNivelesAct(_this.objestructura.idEstructura, _this.arrayidelementos);
     }
     });*/

    this.chIncluRepeticiones = new Ext.form.Checkbox({
        boxLabel: '<span title="Incluir repeticiones" id="ck1" class="icondistra-tarea sipac-naranja " > </span>',
        checked: false,
        hidden: true,
        fieldLabel: '',
        labelSeparator: '  ',
        listeners: {
            check: function (micheck, iswchecked) {
                _this.stPlantilla.reload();
            }
        }
    });
    this.chIncluPlantilla = new Ext.form.Checkbox({
        boxLabel: '<span title="Incluir plantilla" id="ck1" class="icondistra-planilla sipac-carmelita " > </span>',
        checked: true,
        hidden: opcionesConfig.checkboxHidden,
        fieldLabel: '',
        labelSeparator: '  ',
        listeners: {
            check: function (micheck, iswchecked) {
                _this.stPlantilla.reload();
            }
        }
    });
    this.chIncluProyecto = new Ext.form.Checkbox({
        boxLabel: '<span title="Incluir proyecto" id="ck1" class="icondistra-planilla sipac-azul " > </span>',
        checked: true,
        hidden: opcionesConfig.checkboxHidden,
        fieldLabel: '',
        labelSeparator: '  ',
        listeners: {
            check: function (micheck, iswchecked) {
                _this.stPlantilla.reload();
            }
        }
    });
    this.chIncluReasignaciones = new Ext.form.Checkbox({
        boxLabel: '<span title="Incluir reasignaciones" id="ck1" class="icondistra-tarea sipac-roja " > </span>',
        checked: false,
        hidden: true,
        fieldLabel: '',
        labelSeparator: '  ',
        listeners: {
            check: function (micheck, iswchecked) {
                _this.stPlantilla.reload();
            }
        }
    });

    this.tpAutoresInvolucrados = _this.objclasificadorinvol.CrearClasificadorInvolBusqueda(tipoelemento = 3, 2);

    this.btnBusquedaSimple = new Ext.Button({
        handler: function () {
            //_this.btnBusquedaSimple.focus();
            if (_this.fpBuscarPlantillas.getForm().isValid()) {
                _this.stPlantilla.start = 0;
                _this.stPlantilla.reload({});
            }
        },
        text: 'Buscar',
        iconCls: 'buscar',
        tooltip: 'Buscar plantilla(s)',
        //disabled: true,
        key: {
            alt: true,
            key: 'B'
        },
        scope: this
    });

    this.fpBuscarPlantillas = new Ext.form.FormPanel({
        id: 'fpbusqueda',
        frame: true,
        labelAlign: 'top',
        layout: 'fit',
        items: [_this.tpAutoresInvolucrados]
    });
    //panel donde se muestran las opciones de busqueda
    this.panelBuscarPlantilla = new Ext.Panel({
        title: 'Opciones de b&uacute;squeda',
        layout: 'fit',
        width: 300,
        id: 'panelBuscarPlantilla',
        collapsible: true,
        collapsed: true,
        margins: '3 3 3 3',
        region: 'east',
        items: [_this.fpBuscarPlantillas],
        buttons: [_this.btnBusquedaSimple]
    });

    this.stCmbProyecto = new Ext.data.Store({
        url: '/planificacion/proyecto/planeacion/index.php/cmpgestionarplantilla/obtenerPlanesParaFiltro',
        listeners: {
            beforeload: function (st) {
                st.baseParams.idEstructura = (_this.idEstructura == null) ? _this.objestructura.idEstructura : _this.idEstructura;
            }
        },
        //autoLoad: true,
        reader: new Ext.data.JsonReader({
            id: 'idelemento',
            root: "data"
        }, [{
            name: 'idelemento'
        }, {
            name: 'denelemento'
        }])
    });
    //combo categoria del proyecto
    this.cmbproyecto = new Ext.form.ComboBox({
        emptyText: 'Filtrado por proyecto..',
        store: _this.stCmbProyecto,
        hiddenName: 'idelemento',
        valueField: 'idelemento',
        displayField: 'denelemento',
        triggerAction: 'all',
        enableQtip: true,
        allowBlank: true,
        readOnly: false,
        editable: false,
        disabled: true,
        loadingText: 'Cargando datos',
        forceSelection: true,
        mode: 'remote',
        anchor: '100%',
        listeners: {
            expand: function (combo) {
                _this.stCmbProyecto.reload();
            },
            select: function (combo, record, index) {
                /*var record = _this.stPlantilla.getById(_this.cmbproyecto.getValue());
                 _this.smPlantilla.selectRecords([record]);
                 _this.actualizarBarraHerramientas();*/
                _this.smPlantilla.clearSelections();
                _this.stPlantilla.reload({
                    params: {
                        idproyectoParaFiltro: _this.cmbproyecto.getValue()
                    }
                });
            }
        }
    });

    //modo de del treegrid donde se muestran los planes
    this.smPlantilla = new Ext.grid.CheckboxSelectionModel({
        singleSelect: opcionesConfig.singleSeleccion,
        listeners: {
            rowselect: function (sm, indiceFila, record) {
                _this.actualizarBarraHerramientas();
            },
            rowdeselect: function (sm, indiceFila, record) {
                _this.actualizarBarraHerramientas();
            }
        }
    });

    //store del treegrid donde se muestran los elementos
    this.stPlantilla = new Ext.ux.maximgb.treegrid.AdjacencyListStore({
        autoLoad: opcionesConfig.noAutoload,
        remoteSort: true,
        url: '/planificacion/proyecto/planeacion/index.php/cmpgestionarplantilla/cargarplantillas',
        listeners: {
            beforeload: function (st) {
                st.baseParams.padre = Ext.encode(_this.arrayidelementos);
                st.baseParams.incluRepeticiones = _this.chIncluRepeticiones.getValue();
                st.baseParams.incluReasignaciones = _this.chIncluReasignaciones.getValue();
                var arrayautores = _this.objclasificadorinvol.ObtenerAutoresBusqueda();
                var arrayinvolucrados = _this.objclasificadorinvol.ObtenerInvolucradosBusqueda();
                st.baseParams.arrayautores = Ext.encode(arrayautores);
                st.baseParams.arrayinvolucrados = Ext.encode(arrayinvolucrados);
                st.baseParams.incluProyecto = (_this.incluProyecto == null) ? _this.chIncluProyecto.getValue() : _this.incluProyecto;
                st.baseParams.incluPlantilla = (_this.incluPlantilla == null) ? _this.chIncluPlantilla.getValue() : _this.incluPlantilla;
                st.baseParams.idEstructura = (_this.idEstructura == null) ? _this.objestructura.idEstructura : _this.idEstructura;
            },
            load: function (store, record, options) {
                if (_this.tgPlantillas.getStore().getCount() == 0 && !_this.posteliminar) {
                    if (_this.ftPlantilla.getFiltrosActivos() == undefined || _this.ftPlantilla.getFiltrosActivos().length == 0) {
                        mostrarMensaje(1, 'No existen datos que se correspondan con el criterio de búsqueda especificado.');
                    } else {
                        mostrarMensaje(1, 'No existen datos que se correspondan con los criterios de búsqueda especificados.');
                    }
                }
                _this.posteliminar = false;
                if (expandirGrid) {
                    _this.expandirPadresGrid(_this.arrayArbolGeneologico);
                    _this.arrayArbolGeneologico = [];
                    expandirGrid = false;
                }

                _this.cmbproyecto.enable();
                _this.actualizarBarraHerramientas();
            },
            expandnode: function (record, ev) {
                var rowIndex = record.find('idelemento', _this.arrayidelementos[0].id);
                _this.tgPlantillas.getView().focusRow(rowIndex);
                //_this.smPlantilla.selectRow(rowIndex);
            }
        },
        reader: new Ext.data.JsonReader({
            id: 'idelemento',
            totalProperty: "total",
            root: "campos"
        }, [{
            name: 'idelemento'
        }, {
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
            name: 'hoja'
        }, {
            name: 'denoestado'
        }, {
            name: 'idestadoaprob'
        }, {
            name: 'estadocumplimiento'
        }, {
            name: 'nombreautor'
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
            name: 'duracionreal'
        }, {
            name: 'duracionestimada'
        }, {
            name: 'horainicio'
        }, {
            name: 'horafin'
        }, {
            name: 'plantilla'
        }, {
            name: 'origen'
        }, {
            name: 'identificador'
        }, {
            name: 'idprioridad'
        }, {
            name: 'evento'
        }, {
            name: 'idplantilla'
        }, {
            name: 'unidadmedida'
        }, {
            name: 'valorreal'
        }, {
            name: 'valormeta'
        }, {
            name: 'costo'
        }, {
            name: 'tiempooptimista'
        }, {
            name: 'tiempomedio'
        }, {
            name: 'tiempopesimista'
        }, {
            name: 'costototal'
        }])
    });

    //plugins para los filtros del grid
    this.ftPlantilla = new Ext.grid.GridFilters({
        filters: [{
            type: 'string_adaptado',
            dataIndex: 'idelemento',
            xtype: 'numberfield',
            maskRe: /^([0-9.]+ ?[0-9.]*)+$/,
            maskReregex: /^([0-9.]+ ?[0-9.]*)+$/
        }, {
            type: 'string',
            dataIndex: 'denominacion'
        }, {
            type: 'numeric',
            dataIndex: 'duracionreal'
        }, {
            type: 'date',
            dataIndex: 'fechainicio'
        }, {
            type: 'date',
            dataIndex: 'fechafin'
        }, {
            type: 'list',
            dataIndex: 'textocumplimiento',
            options: ['Cumplida', 'Parcialmente cumplida', 'Sin cumplir']
        }, {
            type: 'numeric',
            dataIndex: 'gradocumplimiento'
        }, {
            type: 'list',
            dataIndex: 'observaciones',
            options: ['Si', 'No']
        }]
    });
    //barra de paginado del treegrid donde se muestran los elementos
    this.pagPlantilla = new Ext.ux.maximgb.treegrid.PagingToolbar({
        pageSize: 15,
        store: _this.stPlantilla,
        displayInfo: true,
        listeners: {
            beforechange: function (paginado, evento) {
                _this.start = evento.start;
            }
        }
    });
    this.tgPlantillas = new Ext.ux.maximgb.treegrid.GridPanel({
        id: 'tgPlantilla',
        store: _this.stPlantilla,
        plugins: _this.ftPlantilla,
        master_column_id: 'expandir',
        autoExpandMin: 165,
        stripeRows: true,
        region: 'center',
        disabled: true,
        viewConfig: {
            forcefit: true
        },
        menuderecho: _this.menuderechoTGCmpPlantilla,
        sm: _this.smPlantilla,
        margins: '3 3 3 3',
        loadMask: {
            msg: opcionesConfig.msgMascara
        },
        root_title: opcionesConfig.nombreGrid,
        columns: [_this.smPlantilla,
            {
                header: 'CAR',
                sortable: true,
                hidden: true,
                dataIndex: 'idelemento',
                width: 80,
                tooltip: 'Código de Acceso Rápido',
                renderer: function (val) {
                    return val;
                }
            }, {
                header: "Denominación",
                id: 'expandir',
                dataIndex: 'denominacion',
                width: 500,
                sortable: true,
                tooltip: 'Denominación',
                renderer: MostrarImagenTipoElemento
            }, {
                header: "Duración estimada",
                dataIndex: 'duracionestimada',
                width: 105,
                tooltip: 'Duración estimada',
                sortable: true,
                renderer: MostrarDuracionEstimada
            }, {
                header: "Duración real",
                dataIndex: 'duracionreal',
                width: 80,
                tooltip: 'Duración real',
                hidden: true,
                sortable: true
            }, {
                header: 'Fecha de inicio',
                dataIndex: 'fechainicio',
                width: 90,
                tooltip: 'Fecha de inicio',
                sortable: true,
                renderer: MostrarFecha
            }, {
                header: 'Fecha de fin',
                dataIndex: 'fechafin',
                width: 80,
                tooltip: 'Fecha de fin',
                sortable: true,
                renderer: MostrarFecha
            }, {
                header: "UM",
                dataIndex: 'unidadmedida',
                width: 45,
                sortable: true,
                align: 'center',
                tooltip: 'Unidad de medida',
                renderer: function (val) {
                    if (val)
                        return '<b>' + val + '</b>';
                    else
                        return '';
                }
            }, {
                header: "Valor Meta",
                dataIndex: 'valormeta',
                width: 90,
                sortable: true,
                align: 'right',
                tooltip: 'Valor Meta',
                renderer: function (val) {
                    if (val)
                        return '<b>' + val + '</b>';
                    else
                        return '<b>' + 0 + '</b>';
                }
            }, {
                header: "Valor Real",
                dataIndex: 'valorreal',
                width: 90,
                sortable: true,
                align: 'right',
                tooltip: 'Valor Real',
                renderer: function (val) {
                    if (val)
                        return '<b>' + val + '</b>';
                    else
                        return '<b>' + 0 + '</b>';
                }
            }, {
                header: "Costo",
                dataIndex: 'costo',
                width: 90,
                sortable: true,
                align: 'right',
                tooltip: 'Costo',
                renderer: function (val) {
                    if (val)
                        return '<b>' + val + '</b>';
                    else
                        return '<b>' + 0 + '</b>';
                }
            }, {
                header: "Costo Total",
                dataIndex: 'costototal',
                width: 90,
                sortable: true,
                align: 'right',
                tooltip: 'Costo Total',
                renderer: function (val) {
                    if (val)
                        return '<b>' + val + '</b>';
                    else
                        return '<b>' + 0 + '</b>';
                }
            }, {
                header: "% de cumplimiento",
                dataIndex: 'gradocumplimiento',
                width: 110,
                sortable: true,
                align: 'center',
                tooltip: 'Porciento de cumplimiento',
                renderer: MostrarCumplimiento
            }, {
                header: "Estado de cumplimiento",
                dataIndex: 'textocumplimiento',
                width: 130,
                sortable: true,
                tooltip: 'Estado de cumplimiento',
                renderer: MostrarImagenEstadoCumplimiento
            }, {
                header: "Observaciones",
                dataIndex: 'observaciones',
                hidden: true,
                width: 90,
                sortable: true,
                tooltip: 'Observaciones',
                renderer: MostrarImagenT
            }, {
                header: "Autor",
                dataIndex: 'nombreautor',
                width: 90,
                sortable: true,
                tooltip: 'Autor',
                align: 'right',
                renderer: function (val) {
                    return val;
                }
            }],
        listeners: {
            rowcontextmenu: function (grid, row, e) {
                _this.tgPlantillas.getSelectionModel().selectRow(row);
                //inicializando el objeto menu dinamico
                if (_this.objcmpmenurelacionesdinmd) {
                    _this.objcmpmenurelacionesdinmd = null;
                }
                _this.objcmpmenurelacionesdinmd = new Utilidades.Cmp.CmpMenuRelacionesDinamicas();
                if (_this.menuderechoTGCmpPlantilla) {
                    _this.menuderechoTGCmpPlantilla.destroy();
                }
                //menu derecho del grid de elementos
                _this.menuderechoTGCmpPlantilla = new Ext.menu.Menu({
                    handler: function () {
                    }
                });

                (_this.miadicionarhito) ? _this.miadicionarhito.destroy() : null;
                //if (_this.elementosseleccionados.length == 1 && _this.arrayidelementos[0].tipo != 10) {
                if (_this.elementosseleccionados.length == 1 && _this.arrayidelementos[0].tipo == 8) {
                    //console.log(_this.arrayidelementos[0].tipo);
                    _this.miadicionarhito = new Ext.menu.Item({
                        text: 'Adicionar hito',
                        itemCls: 'x-menu-item icondistra-adicionar',
                        iconCls: 'imagen-none',
                        hideOnClick: true,
                        handler: function () {
                            if (_this.smPlantilla.getSelections().length == 1
                                && (_this.smPlantilla.getSelections()[0].data.tipoelemento == 8
                                    || _this.smPlantilla.getSelections()[0].data.tipoelemento == 9)) {
                                padre = _this.smPlantilla.getSelections()[0].data;
                            }
                            _this.objCrudhito.CrearWinCrudhito(
                                'Adicionar', padre, _this.PostAccionesGestionar, _this.arrayidelementos);
                        }
                    });
                    _this.menuderechoTGCmpPlantilla.add(_this.miadicionarhito);
                }
                (_this.miadicionartarea) ? _this.miadicionartarea.destroy() : null;
                if (_this.elementosseleccionados.length == 1) {
                    _this.miadicionartarea = new Ext.menu.Item({
                        text: 'Adicionar tarea',
                        itemCls: 'x-menu-item icondistra-adicionar',
                        iconCls: 'imagen-none',
                        hideOnClick: true,
                        handler: function () {
                            padre = _this.smPlantilla.getSelections()[0].data;
                            _this.objCrudtarea.CrearWinCrudtarea(
                                'Adicionar', padre, _this.PostAccionesGestionar, _this.arrayidelementos);
                        }
                    });
                    _this.menuderechoTGCmpPlantilla.add(_this.miadicionartarea);
                }
                if (_this.mimodificar) {
                    _this.mimodificar.destroy();
                }
                if (_this.elementosseleccionados.length == 1) {
                    var tipo = 'proyecto';
                    if (_this.arrayidelementos[0].plantilla == 1)
                        tipo = 'plantilla';
                    if (_this.arrayidelementos[0].tipo == 10)
                        tipo = 'tarea';
                    if (_this.arrayidelementos[0].tipo == 9)
                        tipo = 'hito';
                    _this.mimodificar = new Ext.menu.Item({
                        text: 'Modificar ' + tipo,
                        itemCls: 'x-menu-item icondistra-modificar',
                        iconCls: 'imagen-none',
                        handler: function () {
                            var index = _this.stPlantilla.find(
                                'idelemento', _this.elementosseleccionados[0].data._parent, 0, true, false);
                            var padre = _this.stPlantilla.getAt(index);
                            switch (tipo) {
                                case 'tarea':
                                    _this.objCrudtarea.CrearWinCrudtarea(
                                        'Modificar', padre.data, _this.PostAccionesGestionar, _this.arrayidelementos);
                                    break;
                                case 'hito':
                                    _this.objCrudhito.CrearWinCrudhito(
                                        'Modificar', padre.data, _this.PostAccionesGestionar, _this.arrayidelementos);
                                    break;
                                default:
                                    _this.objCrudproyecto.CrearWinCrudproyecto(
                                        'Modificar', tipo, _this.PostAccionesGestionar, _this.arrayidelementos);
                                    break;
                            }
                        }
                    });
                }
                if (_this.arrayidelementos[0].superior != 1)
                    _this.menuderechoTGCmpPlantilla.add(_this.mimodificar);
                if (_this.mieliminar) {
                    _this.mieliminar.destroy();
                }
                _this.mieliminar = new Ext.menu.Item({
                    text: (_this.elementosseleccionados.length == 1) ? 'Eliminar ' + tipo : 'Eliminar elemento',
                    itemCls: 'x-menu-item icondistra-eliminar',
                    iconCls: 'imagen-none',
                    handler: function () {
                        _this.EliminarElemento();
                    }
                });
                if (_this.arrayidelementos[0].superior != 1)
                    _this.menuderechoTGCmpPlantilla.add(_this.mieliminar);

                if (_this.elementosseleccionados.length == 1) {
                    if (_this.miduplicar) {
                        _this.miduplicar.destroy();
                    }
                    _this.miduplicar = new Ext.menu.Item({
                        text: 'Duplicar ' + tipo,
                        itemCls: 'x-menu-item icondistra-duplicar',
                        iconCls: 'imagen-none',
                        hideOnClick: true,
                        handler: function () {
                            if (_this.arrayidelementos[0].tipo == 8) {
                                var tipo = 'proyecto';
                                if (_this.arrayidelementos[0].plantilla == 1)
                                    tipo = 'plantilla';
                                _this.objCrudproyecto.CrearWinCrudproyecto(
                                    'Duplicar', tipo, _this.PostAccionesGestionar,
                                    _this.arrayidelementos, _this.objestructura.idEstructura);
                            } else {
                                var index = _this.stPlantilla.find(
                                    'idelemento', _this.elementosseleccionados[0].data._parent,
                                    0, true, false);
                                var padre = _this.stPlantilla.getAt(index);
                                if (_this.arrayidelementos[0].tipo == 10) {
                                    _this.objCrudtarea.CrearWinCrudtarea(
                                        'Duplicar', padre.data, _this.PostAccionesGestionar,
                                        _this.arrayidelementos, null, _this.objestructura.idEstructura);
                                } else {
                                    _this.objCrudhito.CrearWinCrudhito(
                                        'Duplicar', padre.data, _this.PostAccionesGestionar,
                                        _this.arrayidelementos, _this.objestructura.idEstructura);
                                }
                            }
                        }
                    });
                    _this.menuderechoTGCmpPlantilla.add(_this.miduplicar);
                }


                var tipoelem = _this.obtenerTipoDeElemento();
                //(_this.copiarelemento) ? _this.copiarelemento.destroy() : null;
                (_this.cortarelemento) ? _this.cortarelemento.destroy() : null;
                if (_this.permitirCopiarCortar()) {

                    _this.cortarelemento = new Ext.menu.Item({
                        text: 'Cortar ' + tipoelem,
                        itemCls: 'x-menu-item icondistra-cortar',
                        iconCls: 'imagen-none',
                        handler: function () {
                            _this.tipoelempegar = tipoelem;
                            _this.id_parent = _this.elementosseleccionados[0].data._parent;
                            switch (tipoelem) {
                                case 'tarea':
                                    _this.copiarcortartarea = 1;
                                    _this.copiarcortarhito = 0;
                                    _this.copiarcortarelementos = 0;
                                    break;
                                case 'hito':
                                    _this.copiarcortarhito = 1;
                                    _this.copiarcortartarea = 0;
                                    _this.copiarcortarelementos = 0;
                                    break;
                                case 'tareas':
                                    _this.copiarcortartarea = 1;
                                    _this.copiarcortarhito = 0;
                                    _this.copiarcortarelementos = 0;
                                    break;
                                case 'hitos':
                                    _this.copiarcortarhito = 1;
                                    _this.copiarcortartarea = 0;
                                    _this.copiarcortarelementos = 0;
                                    break;
                                case 'elementos':
                                    _this.copiarcortarelementos = 1;
                                    _this.copiarcortarhito = 0;
                                    _this.copiarcortartarea = 0;
                                    break;
                                default:
                                    _this.copiarcortarhito = 0;
                                    _this.copiarcortartarea = 0;
                                    _this.copiarcortarelementos = 0;
                                    break;
                            }

                            _this.arrayidelementopegar = [];
                            var recparent = _this.stPlantilla.getById(_this.id_parent);

                            if (_this.elementosseleccionados.length == 1) {
                                _this.arrayidelementopegar.push({
                                    idElemen: _this.elementosseleccionados[0].data.idelemento,
                                    tipo: _this.elementosseleccionados[0].data.tipoelemento,
                                    idusuariocrea: _this.elementosseleccionados[0].data.idautor,
                                    idexpadre: _this.id_parent
                                });
                            } else {
                                for (var i = 0; i < _this.elementosseleccionados.length; i++) {
                                    _this.arrayidelementopegar.push({
                                        idElemen: _this.elementosseleccionados[i].data.idelemento,
                                        tipo: _this.elementosseleccionados[i].data.tipoelemento,
                                        idusuariocrea: _this.elementosseleccionados[i].data.idautor,
                                        idexpadre: _this.id_parent
                                    });
                                }
                            }
                        }
                    });
                    _this.menuderechoTGCmpPlantilla.add(_this.cortarelemento);
                }

                (_this.pegarhito) ? _this.pegarhito.destroy() : null;
                if (_this.arrayidelementos.length == 1 && _this.copiarcortarhito == 1 &&
                    _this.arrayidelementos[0].tipo == 8 && _this.id_parent != _this.arrayidelementos[0].id) {

                    _this.pegarhito = new Ext.menu.Item({
                        text: 'Pegar hito(s)',
                        itemCls: 'x-menu-item icondistra-pegar',
                        iconCls: 'imagen-none',
                        handler: function () {
                            _this.copiarcortarhito = 0;
                            _this.reorganizarElemento();
                        }
                    });
                    _this.menuderechoTGCmpPlantilla.add(_this.pegarhito);
                }

                (_this.pegartarea) ? _this.pegartarea.destroy() : null;
                if (_this.arrayidelementos.length == 1 && _this.copiarcortartarea == 1 &&
                    _this.id_parent != _this.arrayidelementos[0].id && _this.permitirPegar()) {

                    _this.pegartarea = new Ext.menu.Item({
                        text: 'Pegar tarea(s)',
                        itemCls: 'x-menu-item icondistra-pegar',
                        iconCls: 'imagen-none',
                        handler: function () {
                            _this.copiarcortartarea = 0;
                            _this.reorganizarElemento();
                        }
                    });
                    _this.menuderechoTGCmpPlantilla.add(_this.pegartarea);
                }

                (_this.pegarelementos) ? _this.pegarelementos.destroy() : null;
                if (_this.arrayidelementos.length == 1 && _this.copiarcortarelementos == 1 &&
                    _this.id_parent != _this.arrayidelementos[0].id && _this.permitirPegar() &&
                    _this.arrayidelementos[0].tipo == 8) {

                    _this.pegarelementos = new Ext.menu.Item({
                        text: 'Pegar elementos',
                        itemCls: 'x-menu-item icondistra-pegar',
                        iconCls: 'imagen-none',
                        handler: function () {
                            _this.copiarcortarelementos = 0;
                            _this.reorganizarElemento();
                        }
                    });
                    _this.menuderechoTGCmpPlantilla.add(_this.pegarelementos);
                }


                e.stopEvent();
                var xy = e.getXY();
                _this.menuderechoTGCmpPlantilla.showAt(xy);
            },
            rowdblclick: function () {
                _this.modificarElemento();
            }
        },
        bbar: _this.pagPlantilla
    });

    _this.tgPlantillas.getView().getRowClass = function (ri, n) {
        if (ri.data.superior == 1)
            return "superior";
        else
            return "";
    };

    /**
     * Funcion para dibujar criterio de busqueda por denominacion
     * **/

    this.searchView = function (val) {
        var cantActivos = 0;
        var criterio = "";
        var filters_activos = _this.ftPlantilla.filters.items;
        for (var i = 0; i < filters_activos.length; i++) {
            if (filters_activos[i].active) {
                cantActivos++;
            }
        }

        for (var k = 0; k < cantActivos; k++) {
            if (_this.stPlantilla.lastOptions.params['filtros[' + k + '][field]'] == "denominacion") {
                criterio = _this.stPlantilla.lastOptions.params['filtros[' + k + '][data][value]'];
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
        else
            respuesta = val;


        return respuesta;

    }

    this.mostrarVentana = function (plantilla) {
        var hidden = false;
        var title = 'Generar proyecto';
        if (plantilla == 1) {
            hidden = true;
            title = 'Generar plantilla';
        }
        //campo para la denominacion del generar proyecto
        this.tfdenominacion = new Ext.form.TextField({
            id: 'tfdenominacionGenerarProy',
            fieldLabel: 'Denominación',
            maxLength: 255,
            maxLengthText: 'El tamaño máximo requerido es 255 caracteres.',
            regex: _this.ObjValidaciones.expresionRegular('denominacion'),
            //maskRe: /^([a-zA-Z0-9áÃ©íóÃºÃ¼Ã�Ã‰Ã�Ã“ÃšñÃ‘Ãœ"' ,./()_-])$/,
            regexText: _this.ObjValidaciones.ObtenerMsjErrorTextoRegido('denominacion'),
            vtype: 'validarEspaciosEnBlanco',
            allowBlank: false,
            style: {textTransform: 'uppercase'},
            anchor: '100%'
        });
        //campo para la identificacion del generar proyecto
        this.identificacion = new Ext.form.TextField({
            id: 'identificacionGestionarProy',
            fieldLabel: 'Identificación',
            allowBlank: false,
            maxLength: 10,
            maxLengthText: 'El tamaño máximo requerido es 100 caracteres.',
            //maskRe: /^([a-zA-Z0-9áÃ©íóÃºÃ¼Ã�Ã‰Ã�Ã“ÃšñÃ‘Ãœ"' ,./()_-])$/,
            regex: _this.ObjValidaciones.expresionRegular('identificacion'),
            regexText: _this.ObjValidaciones.ObtenerMsjErrorTextoRegido('identificacion'),
            readOnly: false,
            anchor: '98%'
        });
        //campo para la fecha de inicio del generar proyecto
        this.fini = new Ext.form.DateField({
            fieldLabel: 'Fecha de inicio',
            id: 'finiGenerarProy',
            disabled: false,
            allowBlank: true,
            blankText: 'Este campo es obligatorio.',
            readOnly: false,
            enableKeyEvents: true,
            hideLabel: hidden,
            hidden: hidden,
            format: 'd/m/Y',
            maxText: 'La fecha de inicio tiene que ser anterior o igual a la fecha fin.',
            invalidText: _this.ObjValidaciones.ObtenerMsjErrorTextoRegido('fecha'),
            anchor: '98%',
            menuListeners: {
                select: function (df, date) {
                    this.setValue(date);
                }
            }
        });
        this.tmfHoraInicioProyecto = new Ext.form.TimeField({
            fieldLabel: 'Hora de inicio',
            //format: 'H:i:s',
            //minValue: '00:00:00',
            //maxValue: '23:59:00',
            //value: '08:00:00',
            format: 'H:i',
            minValue: '00:00',
            maxValue: '23:59',
            value: '08:00',
            increment: 15,
            readOnly: false,
            id: 'tmfHoraInicioProyecto',
            editable: true,
            emptyText: 'Seleccione...',
            anchor: '100%',
            maskRe: /^([0-9:aAmMpP\s])$/,
            maxText: 'Formato: hh:mm am/pm.',
            //disabled: propertyPlantilla,
            hideLabel: hidden,
            hidden: hidden,
            allowBlank: false
        });
        this.chfindesemana = new Ext.form.Checkbox({
            boxLabel: 'Ignorar fin de semana',
            checked: false,
            fieldLabel: '',
            labelSeparator: '',
            anchor: '85%',
            listeners: {
                check: function (check, checked) {
                }
            }
        });
        this.chregimendiario = new Ext.form.Checkbox({
            boxLabel: 'R&eacute;gimen de 8 horas diarias',
            checked: false,
            fieldLabel: '',
            labelSeparator: '',
            anchor: '100%',
            listeners: {
                check: function (check, checked) {
                }
            }
        });
        this.stCmbFondoTiempo = new Ext.data.Store({
            url: '/planificacion/pdo/configuracion/index.php/cmpgestionarfondotiempo/listarFondoTiempo',
            listeners: {
                load: function (st, rc, obj) {
                    _this.addNewRecord();
                },
                beforeload: function (st) {
                }
            },
            //autoLoad: true,
            reader: new Ext.data.JsonReader({
                id: 'idcalendario',
                totalProperty: "total",
                root: "campos"
            }, [{
                name: 'idcalendario'
            }, {
                name: 'denominacion'
            }])
        });
        this.addNewRecord = function () {
            var estado = Ext.data.Record.create([{
                name: 'idcalendario',
                type: 'string'
            }, {
                name: 'denominacion',
                type: 'string'
            }]);
            var p = new estado({
                idcalendario: 0,
                denominacion: 'Ninguno'
            });
            _this.stCmbFondoTiempo.insert(0, p);
        };
        //combo fondo de tiempo
        this.cmbFondoTiempo = new Ext.form.ComboBox({
            emptyText: 'Seleccione fondo de tiempo...',
            fieldLabel: 'Fondo de tiempo',
            store: _this.stCmbFondoTiempo,
            hiddenName: 'idcalendario',
            valueField: 'idcalendario',
            displayField: 'denominacion',
            triggerAction: 'all',
            enableQtip: true,
            allowBlank: true,
            readOnly: false,
            editable: false,
            disabled: false,
            loadingText: 'Cargando datos...',
            forceSelection: true,
            mode: 'remote',
            anchor: '100%',
            listeners: {
                expand: function (combo) {
                    _this.stCmbFondoTiempo.reload();
                },
                select: function (combo, record, index) {
                    if (combo.getValue()) {
                        _this.chfindesemana.setValue(false);
                        _this.chregimendiario.setValue(false);
                        _this.chfindesemana.disable();
                        _this.chregimendiario.disable();
                    } else {
                        _this.chfindesemana.enable();
                        _this.chregimendiario.enable();
                    }
                },
                beforerender: function (c) {
                    _this.addNewRecord();
                }
            }
        });

        this.fsaspectosdetiempo = new Ext.form.FieldSet({
            anchor: '99%',
            layout: 'form',
            height: 140, //60,
            title: 'Aspectos de tiempo',
            hidden: hidden,
            items: [{
                layout: 'column',
                bodyStyle: 'margin:-20px 0 0 0',
                items: [
                    {columnWidth: 0.4, layout: 'form', labelAlign: 'top', items: [_this.chfindesemana]},
                    {columnWidth: 0.6, layout: 'form', labelAlign: 'top', items: [_this.chregimendiario]}
                ]
            }, {
                xtype: 'fieldset',
                //title: 'Fondo de tiempo',
                autoHeight: true,
                items: [{columnWidth: 0.5, layout: 'form', labelAlign: 'top', items: _this.cmbFondoTiempo}]
            }
            ]
        });
        this.formGenerarProy = new Ext.FormPanel({
            labelAlign: 'top',
            frame: true,
            items: [{
                layout: 'column',
                items: [
                    {
                        columnWidth: 1,
                        layout: 'form',
                        items: [_this.tfdenominacion]
                    }, {
                        columnWidth: 1,
                        layout: 'fit',
                        items: [{
                            xtype: 'panel',
                            border: false,
                            bodyBorder: false,
                            items: [
                                {
                                    layout: 'column',
                                    items: [
                                        {
                                            columnWidth: 0.33,
                                            layout: 'form',
                                            items: [_this.identificacion]
                                        }, {
                                            columnWidth: 0.33,
                                            layout: 'form',
                                            items: [_this.fini]
                                        }, {
                                            columnWidth: 0.33,
                                            layout: 'form',
                                            items: [_this.tmfHoraInicioProyecto]
                                        }]
                                }]
                        }]
                    }, {
                        columnWidth: 1,
                        layout: 'form',
                        items: [_this.fsaspectosdetiempo]
                    }]
            }],
            listeners: {
                'clientvalidation': function (fm, valid) {
                    if (valid) {
                        Ext.getCmp('btnAceptarGenerarProy').enable();
                    } else {
                        Ext.getCmp('btnAceptarGenerarProy').disable();
                    }
                }
            }
        });

        if (_this.winGenerarProyecto)
            _this.winGenerarProyecto.destroy();
        this.winGenerarProyecto = new Ext.Window({
            constrain: true,
            id: 'winGenerarProyecto',
            title: title,
            modal: true,
            closeAction: 'destroy',
            layout: 'fit',
            width: 500,
            height: 330, //245,
            resizable: false,
            autoValidate: true,
            validateDefault: true,
            items: _this.formGenerarProy,
            buttons: [
                {
                    iconCls: 'cancelar',
                    text: 'Cancelar',
                    id: 'btnCancelarGenerarProy',
                    handler: function () {
                        _this.winGenerarProyecto.destroy();
                    },
                    tooltip: 'Cerrar ventana sin guardar los datos'
                }, {
                    iconCls: 'aceptar ',
                    text: 'Aceptar ',
                    id: 'btnAceptarGenerarProy',
                    // disabled: true,
                    handler: function () {
                        _this.generarProyectodePlantilla(plantilla);
                    },
                    tooltip: 'Guardar datos y cerrar ventana'
                }
            ]
        });

        _this.tfdenominacion.setValue(_this.smPlantilla.getSelections()[0].data.denominacion);
        _this.identificacion.setValue(_this.smPlantilla.getSelections()[0].data.identificador);
        _this.fini.setValue(new Date().format('d/m/Y'));
        _this.winGenerarProyecto.show();
    };


    //componente para el calculo de tiempo de las tareas
    this.calculoTarea = new Ext.Button({
        tooltip: 'Cálculo de Tiempo',
        iconCls: 'calcular',
        disabled: true,
        hidden: true,
        handler: function () {
            var datos = _this.smPlantilla.getSelections()[0].data;
            _this.ObjCalculo = new Utilidades.Cmp.Cmpcalculotarea({
                maxWinPrincipal: false,
                nombrePanel: 'Cronometrar Proyecto: ',
                useRemoto: true,
                proyectoSelect: datos
            });
            _this.ObjCalculo.InicializarCalculo()
        }
    });

    //componente para el manejo de ejercicios
    this.btEjercicio = new Ext.Button({
        tooltip: 'Generar Ejercicios',
        iconCls: 'configurarejercicio',
        //disabled:true,
        hidden: true,
        handler: function () {

            var datos = _this.smPlantilla.getSelections()[0].data;
            _this.ObjEjercicio = new Utilidades.Cmp.Cmpcrudejercicio({
                proyectoSelect: datos
            });
            _this.ObjEjercicio.InicializarEjercicio();

        }
    });

    this.btnSeleccionarPlantilla = new Ext.Button({
        handler: function () {
            _this.relacionarElementos();
        },
        disabled: true,
        id: 'btnSeleccionarPlantilla',
        text: 'Seleccionar',
        iconCls: 'aceptar ',
        tooltip: 'Relacionar el elemento seleccionado',
        hidden: opcionesConfig.noUsarSeleccionarWinP,
        key: {
            alt: true,
            key: 'S'
        },
        scope: this
    });

    this.btnExpandirPadre = new Ext.Button({
        handler: function () {
            var arrayrecords = [];
            for (var i = 0; i < _this.smPlantilla.getSelections().length; i++)
                if (!_this.smPlantilla.getSelections()[i].data._is_leaf)
                    arrayrecords.push(_this.smPlantilla.getSelections()[i]);
            _this.analizados = [];
            _this.posiciones = [];
            _this.ExpandParent(arrayrecords);

        },
        hidden: opcionesConfig.noUsarActivar,
        disabled: true,
        iconCls: 'expandir',
        tooltip: 'Expandir actividad',
        key: {
            alt: true,
            key: 'C'
        },
        scope: this
    });

    this.actualizarBarraHerramientas = function () {
        _this.arraySoloIdElementos = [];
        _this.arrayidestadoaprob = [];

        if (opcionesConfig.idinversion == undefined) {
            _this.btnSeleccionarPlantilla.disable();
        }

        _this.btnModificar.disable();
        _this.btnEliminar.disable();
        _this.btnAddHito.disable();
        _this.btnAddTarea.disable();
        _this.btnExpandirPadre.disable();
        _this.MenuItemExportarElemento.disable();
        // _this.btnCambiarEstado.disable();
        _this.btnGestObs.disable();
        _this.btnGenerarProyecto.disable();
        _this.calculoTarea.disable();
        _this.btnGenerarPlantilla.disable();
        _this.btnDuplicar.disable();
        _this.btnReagsinaciones.disable();
        _this.btnHistorial.disable();
        _this.btnVerDatos.disable();
        _this.btnReorganizar.disable();

        _this.btnGenerarPert.disable();
        _this.menuReporte.disable();
        _this.menuMatriz.disable();
        _this.btnResumen.disable();
        _this.btnDesasociar.disable();
        _this.btnAddTarea.disable();
        _this.btn100.disable();
        _this.btnAsociarRecursos.disable();
        _this.btnEjecutarProyecto.disable();
        _this.btnGenerarCompresion.disable();
        _this.btnGenerarDependencias.disable();
        _this.btnGenerarCLS.disable();
        _this.btnOtroValor.disable();
        //_this.btnImportarProyecto.disable();
        if (Ext.getCmp('btnImportarAct')) Ext.getCmp('btnImportarAct').disable();
        _this.btnInvolucrarUsuarios.disable();
        //_this.btnImportarTareas.disable();
        if (Ext.getCmp('importexcel')) Ext.getCmp('importexcel').disable();
        _this.MenuItemImportarTareasExcel.disable();
        _this.MenuItemImportarTareasExcel2.disable();
        _this.cmbproyecto.disable();
        //_this.btn_nivelactividad.disable();
        //Deshabilitar botones si no existe una estructura seleccionada
        _this.menuAdicionar.disable();
        _this.btnCambiarEstado.disable();
        _this.btnNotificaciones.disable();
        _this.btnCargasPorDefecto.disable();
        _this.btnBuscar.disable();
        _this.menuMatriz.disable();
        _this.menuReporte.disable();
        _this.btEjercicio.disable();
        _this.btnLimpiar.disable();
        _this.chIncluPlantilla.disable();
        _this.chIncluProyecto.disable();
        _this.chIncluReasignaciones.disable();
        _this.chIncluRepeticiones.disable();
        if (_this.objestructura.idEstructura != ''
            && _this.objestructura.idEstructura != null
            && _this.objestructura.idEstructura != 'nodo2') {
            _this.menuAdicionar.enable();
            _this.btnCambiarEstado.enable();
            _this.btnNotificaciones.enable();
            _this.btnCargasPorDefecto.enable();
            _this.btnBuscar.enable();
            _this.btEjercicio.enable();
            _this.btnLimpiar.enable();
            _this.chIncluPlantilla.enable();
            _this.chIncluProyecto.enable();
            _this.chIncluReasignaciones.enable();
            _this.chIncluRepeticiones.enable();
            //_this.btnImportarProyecto.enable();
            if (Ext.getCmp('btnImportarAct')) Ext.getCmp('btnImportarAct').enable();
            _this.btnResumen.enable();
            _this.cmbproyecto.enable();
        }
        _this.arrayidelementos = [];
        _this.elementosseleccionados = [];
        if (_this.smPlantilla.hasSelection()) {
            var arrayrecords = _this.smPlantilla.getSelections();
            var totalrecords = arrayrecords.length;
            if (totalrecords == 1) {
                _this.btnDuplicar.enable();
                _this.btnGestObs.enable();
                _this.btnVerDatos.enable();
                _this.btnHistorial.enable();
                _this.btnReagsinaciones.enable();
                _this.btnModificar.enable();
                _this.MenuItemExportarElemento.enable();
                _this.btnInvolucrarUsuarios.enable();
                //_this.btnImportarTareas.enable();
                if (Ext.getCmp('importexcel')) Ext.getCmp('importexcel').enable();
                _this.MenuItemImportarTareasExcel.enable();
                _this.MenuItemImportarTareasExcel2.enable();
                _this.btnAddTarea.enable();
                if (arrayrecords[0].data.tipoelemento == 8 /*|| arrayrecords[0].data.tipoelemento == 9*/) {
                    _this.btnAddHito.enable();
                    //_this.btnSeleccionarPlantilla.disable();
                }
                if (arrayrecords[0].data.tipoelemento == 8) {
                    _this.menuMatriz.enable();
                    _this.menuReporte.enable();
                    _this.btnGenerarDependencias.enable();
                    _this.btnGenerarCLS.enable();
                    if (arrayrecords[0].data.plantilla == 1) {
                        _this.menuMatriz.disable();
                        _this.menuReporte.disable();
                        _this.btnGenerarProyecto.enable();
                        _this.calculoTarea.enable();
                        _this.btnGenerarPert.enable();
                        _this.menuReporte.enable();
                        _this.menuMatriz.enable();
                    } else {
                        _this.btnGenerarPlantilla.enable();
                        _this.btnGenerarPert.enable();
                        _this.menuReporte.enable();
                        _this.menuMatriz.enable();
                        _this.btnResumen.enable();
                        _this.btnDesasociar.enable();
                        _this.menuReporte.enable();
                        _this.menuMatriz.menu.items.items[3].enable();
                        _this.btnEjecutarProyecto.enable();
                        _this.btnGenerarCompresion.enable();
                    }
                }
                /*if (_this.smPlantilla.getSelected().json.plantilla != 1) {
                 _this.btn_nivelactividad.enable();
                 }*/
            }
            if (totalrecords > 0) {
                _this.btnSeleccionarPlantilla.enable();
                if (!_this.desdeCalculo) {
                    for (var i = 0; i < totalrecords; i++) {
                        if (arrayrecords[i].data.tipoelemento == 8 || arrayrecords[i].data.tipoelemento == 9) {
                            _this.btnSeleccionarPlantilla.disable();
                            break;
                        }
                    }
                }

                Ext.each(arrayrecords, function (r) {
                    _this.elementosseleccionados.push(r);
                    _this.arrayidelementos.push({
                        id: r.data.idelemento,
                        tipo: r.data.tipoelemento,
                        plantilla: r.data.plantilla,
                        idautor: r.data.idautor,
                        evento: r.data.evento,
                        gradocumplimiento: r.data.gradocumplimiento,
                        denominacion: r.data.denominacion,
                        superior: r.data.superior,
                        _is_leaf: r.data._is_leaf
                    });
                    _this.arrayidestadoaprob.push(r.data.idestadoaprob);
                    _this.arraySoloIdElementos.push(r.data.idelemento);

                });
                _this.btnEliminar.enable();
                if (_this.smPlantilla.getSelected().json.tipoelemento != 8) {
                    _this.btnReorganizar.enable();
                }
                if (_this.smPlantilla.getSelected().json.tipoelemento == 10
                    && _this.smPlantilla.getSelected().json.plantilla == 0) {
                    _this.btnReorganizar.enable();
                    _this.btn100.enable();
                    _this.btnOtroValor.enable();
                    _this.btnAsociarRecursos.enable();
                }
                for (var i = 0; i < totalrecords; i++) {
                    if (arrayrecords[i].data.superior == 1) {
                        _this.btnModificar.disable();
                        _this.MenuItemExportarElemento.disable();
                        _this.btnEliminar.disable();
                        break;
                    }
                }

                _this.btnExpandirPadre.enable();
            }
        } else {
            _this.elementosseleccionados = [];
            _this.arrayidelementos = [];
        }
    };

    this.tpEstructuras = _this.objestructura.CrearArbolEstructura(
        _this.stPlantilla, _this.smPlantilla, _this.tgPlantillas,
        _this.actualizarBarraHerramientas
    );

    this.pEstructura = new Ext.Panel({
        title: 'Estructuras',
        id: 'Estructura',
        layout: 'fit',
        collapsible: true,
        collapsed: false,
        width: 280,
        region: 'west',
        margins: '3 3 3 3',
        items: [_this.tpEstructuras]
    });

//ventana principal de la vista
    this.WinPrincipal = new Ext.Window({
        title: opcionesConfig.nombrePanel,
        layout: 'border',
        closable: !opcionesConfig.noUsarCerrarWinP,
        maximized: opcionesConfig.maxWinPrincipal,
        modal: true,
        width: 1000,
        height: 510,
        tbar: [_this.menuAdicionar, _this.btnModificar, _this.btnEliminar, _this.btnAddHito,
            _this.btnAddTarea, _this.btnCambiarEstado, _this.btnGestObs, _this.btnGenerarProyecto,
            _this.btnGenerarPlantilla, _this.calculoTarea, _this.btEjercicio, _this.btnDuplicar, _this.btnReagsinaciones, _this.btnHistorial,
            _this.btnVerDatos, _this.btnReorganizar, _this.btnNotificaciones, _this.btnCargasPorDefecto,
            _this.btnBuscar, _this.btnGenerarPert, _this.btnGenerarmatriz, _this.btnGenerarmatrizH, _this.menuMatriz, _this.menuReporte/*, _this.btn_nivelactividad*/, _this.btn100, _this.btnOtroValor, _this.btnExpandirPadre, _this.menuExportarImportarElemento, /*_this.btnGenerarCompresion,*/ _this.btnLimpiar, '-',
            _this.chIncluProyecto, '', '', '', _this.chIncluPlantilla, '', '', _this.chIncluRepeticiones, _this.btnDesasociar,
            '', _this.chIncluReasignaciones, '', _this.btnInvolucrarUsuarios, _this.btnAsociarRecursos, _this.btnEjecutarProyecto, _this.btnGenerarDependencias,/*'-', _this.btnGenerarCLS, /*_this.btnImportarProyecto,_this.btnImportarTareas,*/ _this.btnResumen, _this.menuImportar, '->', _this.cmbproyecto, '-', _this.btnAyuda],
        items: [_this.pEstructura, _this.tgPlantillas, _this.panelBuscarPlantilla],
        buttons: [
            {
                text: 'Cerrar',
                tooltip: 'Cerrar ventana',
                hidden: opcionesConfig.noUsarCerrarWinP,
                iconCls: 'cerrar',
                handler: function () {
                    _this.WinPrincipal.hide();
                }
            },
            _this.btnSeleccionarPlantilla
        ]
    });

    //funcion donde se procede a cargar la plantilla
    this.CargarCmpPlantilla = function (idelemento, tipoelemento, plantilla, estamodificando, parentelemento,
                                        AccionesAlRelacionar, elemenReorganizar, idEstructura) {
        if (plantilla == 1) {
            _this.incluProyecto = 'false';
            _this.incluPlantilla = 'true';
        } else if (plantilla == 0) {
            _this.incluProyecto = 'true';
            _this.incluPlantilla = 'false';
        }
        _this.idEstructura = idEstructura;
        this.idelementoRelacion = idelemento;
        this.tipoelementoRelacion = tipoelemento;
        this.plantillaRelacion = plantilla;
        this.estamodificando = estamodificando;
        _this.arrayidElementosReorganizar = elemenReorganizar;
        this.AccionesAlRelacionar = AccionesAlRelacionar;
        if (opcionesConfig.dependenciaTotal || opcionesConfig.dependenciaPorcentual
            || opcionesConfig.dependenciaPuertaAbierta) {
            if (plantilla == 0) {
                var incluProyecto = 'true';
                var incluPlantilla = 'false';
            } else {
                incluProyecto = 'false';
                incluPlantilla = 'true';
            }
            _this.WinPrincipal.show();
            _this.stPlantilla.reload({
                params: {
                    dependenciaTotal: opcionesConfig.dependenciaTotal,
                    dependenciaPorcentual: opcionesConfig.dependenciaPorcentual,
                    dependenciaPuertaAbierta: opcionesConfig.dependenciaPuertaAbierta,
                    idelementoafiltrar: idelemento,
                    tipoelemento: tipoelemento,
                    inProyecto: incluProyecto,
                    inPlantilla: incluPlantilla
                }
            });
            _this.tgPlantillas.enable();
            _this.pEstructura.collapse();
        } else {
            if (opcionesConfig.tipoComponente == 'panel') {
                _this.incluProyecto = 'false';
                _this.incluPlantilla = 'true';
                _this.stPlantilla.reload();
                _this.tgPlantillas.enable();
                return _this.tgPlantillas;
            } else {
                _this.WinPrincipal.show();
            }
        }
    };

//funcion para mostrar el icono "tipo de elemento"
    function MostrarImagenTipoElemento(valor, m, p) {
        if (p.data.tipoelemento == 8) {
            if (p.data.plantilla == 0) {
                return '<span class="icondistra-planilla sipac-azul">' + ' ' + _this.searchView(valor) + '</span>';
            } else {
                return '<span class="icondistra-planilla sipac-carmelita">' + ' ' + _this.searchView(valor) + '</span>';
            }
        } else if (p.data.tipoelemento == 9) {
            if (p.data.plantilla == 0) {
                return '<span class="icondistra-asentar sipac-azul">' + ' ' + _this.searchView(valor) + '</span>';
            } else {
                return '<span class="icondistra-asentar sipac-carmelita">' + ' ' + _this.searchView(valor) + '</span>';
            }
        } else if (p.data.tipoelemento == 10) {
            if (p.data.plantilla == 0) {
                if (p.data.origen == 4) {
                    return '<span class="icondistra-tarea sipac-naranja">' + ' ' + _this.searchView(valor) + '</span>';
                } else
                    return '<span class="icondistra-tarea sipac-azul">' + ' ' + _this.searchView(valor) + '</span>';
            } else {
                return '<span class="icondistra-tarea sipac-carmelita">' + ' ' + _this.searchView(valor) + '</span>';
            }
        }
    }

//funcion para mostrar el icono "estado de cumplimiento"
    function MostrarImagenEstadoCumplimiento(val, b, c) {
        val3 = c.data.gradocumplimiento * 1;
        if (c.data.plantilla == 1) {
            return '-';
        } else if (val3 == 0) {
            return '<span class="icondistra-bandera sipac-roja">' + ' ' + val + '</span>';
        } else if (val3 > 0 && val3 < 95) {
            return '<span class="icondistra-bandera sipac-amarilla">' + ' ' + val + '</span>';
        } else if (val3 >= 95) {
            return '<span class="icondistra-bandera sipac-verde">' + ' ' + val + '</span>';
        }
    }

//funcion para mostrar el % de cumplimiento
    function MostrarCumplimiento(val, b, c) {
        if (c.data.plantilla == 1) {
            return '-';
        } else {
            return val + ' %';
        }
    }

//funcion para mostrar la fecha
    function MostrarFecha(val, b, c) {
        if (c.data.plantilla == 1) {
            return '-';
        } else {
            return val;
        }
    }

    function MostrarImagenT(val) {
        if (val == 0) {
            return '-';
        }
        if (val > 0) {
            return '<center><span class="icondistra-validaryaceptar sipac-verde"></span></center>';
        }
    }

    this.modificarElemento = function () {
        if (_this.arrayidelementos[0].tipo == 8) {
            var tipo = 'proyecto';
            if (_this.arrayidelementos[0].plantilla == 1)
                tipo = 'plantilla';
            _this.objCrudproyecto.CrearWinCrudproyecto(
                'Modificar', tipo, _this.PostAccionesGestionar, _this.arrayidelementos);
        } else {
            var index = _this.stPlantilla.find(
                'idelemento', _this.elementosseleccionados[0].data._parent, 0, true, false);
            var padre = _this.stPlantilla.getAt(index);
            if (_this.arrayidelementos[0].tipo == 10) {
                _this.objCrudtarea.CrearWinCrudtarea(
                    'Modificar', padre.data, _this.PostAccionesGestionar, _this.arrayidelementos,
                    null, _this.objestructura.idEstructura);
            } else {
                _this.objCrudhito.CrearWinCrudhito(
                    'Modificar', padre.data, _this.PostAccionesGestionar, _this.arrayidelementos);
            }
        }
    };


    this.EliminarElemento = function () {
        var mensaje = '', mensajemascara = '';
        if (_this.smPlantilla.getSelections().length > 1) {
            mensaje = ' ¿Est&aacute; seguro que quiere eliminar los elementos seleccionados?';
            mensajemascara = 'Eliminando elementos...';
        } else {
            mensaje = ' ¿Est&aacute; seguro que quiere eliminar el elemento seleccionado?';
            mensajemascara = 'Eliminando elemento...';
        }
        mostrarMensaje(2, mensaje, function (btnoprimido) {
            if (btnoprimido == 'ok') {
                _this.BarraProgreso.show(mensajemascara);
                Ext.Ajax.request({
                    url: '/planificacion/proyecto/planeacion/index.php/cmpgestionarplantilla/eliminarElemento',
                    params: {
                        arrayidelementos: Ext.encode(_this.arrayidelementos)
                    },
                    callback: function (options, success, response) {
                        _this.BarraProgreso.hide();
                        responseData = Ext.decode(response.responseText);
                        if (responseData.mensaje == 1) {
                            var mensajeconfirmacion = '';
                            if (_this.arrayidelementos.length > 1)
                                mensajeconfirmacion = 'Los elementos han sido eliminados satisfactoriamente.';
                            else
                                mensajeconfirmacion = 'El elemento ha sido eliminado satisfactoriamente.';

                            mostrarMensaje(1, mensajeconfirmacion);
                            _this.PostAccionesGestionar(1, 'Eliminar');
                        }
                        if (responseData.mensaje == 0) {
                            var mensajeconfirmacion2 = '';
                            if (_this.arrayidelementos.length > 1)
                                mensajeconfirmacion2 = 'Los elementos que usted quiere eliminar ya no se encuentran en los registros.';
                            else
                                mensajeconfirmacion2 = 'El elemento que usted quiere eliminar ya no se encuentra en los registros.';
                            mostrarMensaje(1, mensajeconfirmacion2, function () {
                                _this.PostAccionesGestionar(0, 'Eliminar');
                            });
                        }
                    }
                });
            } else {
                if (_this.smPlantilla.hasSelection()) {
                    _this.smPlantilla.clearSelections();
                    // TG.getView().refresh(true);
                }
            }
        });
    };

//funcion que se ejecuta luego de seleccionar el nuevo elemento padre al cual quieremos relacionarle los elementos hijos
    this.relacionarElementos = function () {
        if (opcionesConfig.reordenarHijos == true) {
            _this.accionesAlReordenar(opcionesConfig.arraysubElementos, _this.elementosseleccionados,
                _this.WinPrincipal);
        } else {
            if (_this.tipoelementoRelacion == 10) {
                _this.generarDependencia(opcionesConfig.idelementoDependencia, _this.WinPrincipal);
            } else {
                _this.relacionarHitosProy(_this.idelementoRelacion, _this.tipoelementoRelacion,
                    _this.WinPrincipal);
            }
        }
    };

    this.accionesAlReordenar = function (arraysubElementos, elementoPadre, WinPrincipal) {
        var mensaje = '', mensajemascara = '', mensajeconfirmacion = '', mensajeconfirmacion2 = '';
        var subElementos = [];
        for (var i = 0; i < arraysubElementos.length; i++) {
            var objSubElementos = new Object();
            objSubElementos.idelemento = arraysubElementos[i].data.idelemento;
            objSubElementos.tipoelemento = arraysubElementos[i].data.tipoelemento;
            objSubElementos._parent = arraysubElementos[i].data._parent;
            objSubElementos.idautor = arraysubElementos[i].data.idautor;
            objSubElementos.plantilla = arraysubElementos[i].data.plantilla;
            subElementos[i] = objSubElementos;
        }
        var elemPadre = new Object();
        elemPadre.idelemento = elementoPadre[0].data.idelemento;
        elemPadre.tipoelemento = elementoPadre[0].data.tipoelemento;
        elemPadre.idautor = elementoPadre[0].data.idautor;
        elemPadre.plantilla = elementoPadre[0].data.plantilla;

        if (arraysubElementos.length == 1) {
            if (arraysubElementos[0].data.tipoelemento == 10) {
                mensajeconfirmacion = 'La sub-tarea ha sido reorganizada satisfactoriamente.';
                mensaje = ' ¿Est&aacute; seguro que quiere reorganizar la sub-tarea seleccionada?';
                mensajemascara = 'Reorganizando sub-tarea';
                mensajeconfirmacion2 = 'La sub-tarea seleccionada no ha sido reorganizada.';

            } else if (arraysubElementos[0].data.tipoelemento == 9) {
                mensajeconfirmacion = 'El sub-hito ha sido reorganizado satisfactoriamente.';
                mensaje = ' ¿Est&aacute; seguro que quiere reorganizar el sub-hito seleccionado?';
                mensajemascara = 'Reorganizando sub-hito';
                mensajeconfirmacion2 = 'El sub-hito seleccionado no ha sido reorganizado.';
            }
        } else {
            mensajeconfirmacion = 'Los sub-elementos han sido reorganizados satisfactoriamente.';
            mensaje = ' ¿Est&aacute; seguro que quiere reorganizar los sub-elementos seleccionados?';
            mensajemascara = 'Reorganizando sub-elementos';
            mensajeconfirmacion2 = 'Los sub-elementos seleccionados no han sido reorganizados.';
        }
        mostrarMensaje(2, mensaje, function (btnoprimido) {
            if (btnoprimido == 'ok') {
                _this.BarraProgreso.show(mensajemascara);
                Ext.Ajax.request({
                    url: '/planificacion/proyecto/planeacion/index.php/cmpgestionarplantilla/reorganizarElementos',
                    params: {
                        arraysubElementos: Ext.encode(subElementos),
                        elementoPadre: Ext.encode(elemPadre)
                    },
                    callback: function (options, success, response) {
                        _this.BarraProgreso.hide();
                        responseData = Ext.decode(response.responseText);
                        if (responseData.mensaje == 1) {
                            mostrarMensaje(1, mensajeconfirmacion);
                            WinPrincipal.destroy();
                            _this.arrayidElementosReorganizar = [];
                            _this.AccionesAlRelacionar();
                        }
                        if (responseData.mensaje == 0) {
                            mostrarMensaje(1, mensajeconfirmacion2);
                            WinPrincipal.destroy();
                            _this.arrayidElementosReorganizar = [];
                            _this.AccionesAlRelacionar();
                        }
                    }
                });
            }
        });
    };

    this.relacionarHitosProy = function (idelemento, tipoelementoRelacion, WinPrincipal) {
        if (idelemento) {
            var mesage = '', mesageErrer = '';
            mesage = 'La relación ha sido adicionada satisfactoriamente.';
            mesageErrer = 'La relación no ha podido ser generada.';
            Ext.Ajax.request({
                url: '/planificacion/pdo/plan/index.php/cmprelaciones/adicionaPadresRelacion',
                params: {
                    idelementoPadre: _this.smPlantilla.getSelections()[0].data.idelemento, //Hito padre
                    idelementoHijo: idelemento,
                    tipoPadre: _this.smPlantilla.getSelections()[0].data.tipoelemento,
                    tipoHijo: tipoelementoRelacion,
                    idmodulo: 2
                },
                callback: function (options, success, response) {
                    _this.BarraProgreso.hide();
                    responseData = Ext.decode(response.responseText);
                    if (responseData.mensaje == 1) {
                        WinPrincipal.destroy();
                        mostrarMensaje(1, mesage);
                        _this.AccionesAlRelacionar();
                    } else {
                        mostrarMensaje(1, mesageErrer);
                    }
                }
            });
        }
    };

    this.generarDependencia = function (idelemento, WinPrincipal) {
        var origen = 6;
        if (opcionesConfig.dependenciaPorcentual)
            origen = 7;
        if (opcionesConfig.dependenciaPuertaAbierta)
            origen = 8;
        var aux = [];
        if (idelemento && _this.estamodificando) {
            for (var i = 0; i < _this.smPlantilla.getCount(); i++) {
                aux.push(_this.smPlantilla.getSelections()[i].id);
            }
            var mesage = '', mesageErrer = '';
            if (aux.length == 1) {
                mesage = 'La dependencia ha sido realizada satisfactoramente.';
                mesageErrer = 'La dependencia no ha podido ser generada.';
            } else {
                mesage = 'Las dependencias han sido realizadas satisfactoramente.';
                mesageErrer = 'Las dependencias no han podido ser generadas.';
            }
            Ext.Ajax.request({
                url: '/planificacion/pdo/plan/index.php/cmpgestionaractividades/generarDependencia',
                params: {
                    actpadre: idelemento,
                    arraysubactividades: Ext.encode(aux),
                    origen: origen,
                    idmodulo: 2
                },
                callback: function (options, success, response) {
                    _this.BarraProgreso.hide();
                    responseData = Ext.decode(response.responseText);
                    if (responseData.success == 1) {
                        WinPrincipal.destroy();
                        mostrarMensaje(1, mesage);
                        _this.AccionesAlRelacionar();
                    } else {
                        mostrarMensaje(1, mesageErrer);
                    }
                }
            });
        } else {
            for (var i = 0; i < _this.smPlantilla.getCount(); i++) {
                aux.push(_this.smPlantilla.getSelections()[i].data);
            }

            _this.AccionesAlRelacionar(aux, WinPrincipal);
        }
    };

    this.getElementoSelect = function () {
        return _this.smPlantilla.getSelected();
    };

    this.getElementosSelect = function () {
        return _this.smPlantilla.getSelections();
    };

    this.ObtenerSmPlantilla = function () {
        return _this.smPlantilla;
    };
    this.ObtenerStPlantilla = function () {
        return _this.stPlantilla;
    };


    this.cerrarVentana = function () {
        _this.WinPrincipal.destroy();
    };

    this.aplicarFiltro = function (idelemento) {
        if (idelemento != undefined) {
            _this.ftPlantilla.filters.items[0].setValue(idelemento);
            _this.ftPlantilla.filters.items[0].active = true;
        } else {
            _this.stPlantilla.reload();
        }
    };

    this.generarReporte = function (objeto) {
        var me = this;
        obj = {
            view: this,
            path: '/planificacion/proyecto/planeacion/index.php/cmpgestionarplantilla/obtenerReporte',
            baseParams: {
                denoreporte: 'Reporte No.' + objeto.tipo,
                idproyecto: (_this.arrayidelementos[0]) ? _this.arrayidelementos[0].id : false,
                denproyecto: (_this.arrayidelementos[0]) ? _this.arrayidelementos[0].denominacion : false,
                fechainicio: objeto.fechainicio ? objeto.fechainicio : _this.elementosseleccionados[0].data.fechainicio,
                gradocumplimiento: (_this.arrayidelementos[0]) ? _this.elementosseleccionados[0].data.gradocumplimiento : false,
                fechafin: objeto.fechafin ? objeto.fechafin : _this.elementosseleccionados[0].data.fechafin,
                idestructura: _this.tpEstructuras.selModel.selNode.attributes.id,
                denomestructura: _this.tpEstructuras.selModel.selNode.attributes.text,
                tiporeporte: objeto.tipo,
                exportFormat: ['WORD', 'EXCEL']
            },
            fnFailure: function () {
                mostrarMensaje(1, 'Por favor haga la configuraci&oacute;n del usuario.');
            }
        };

        reportes.create(obj);
    };


    this.generarMatrizRecurso = function () {
        Ext.Ajax.request({
            url: '/planificacion/proyecto/planeacion/index.php/cmpgestionarplantilla/cargarMatrizRecurso',
            params: {
                idproyecto: _this.arrayidelementos[0].id,
                denproyecto: _this.arrayidelementos[0].denominacion
            },
            callback: function (options, success, response) {
                responseData = Ext.decode(response.responseText);
                _this.objMatrizRelaciones.getMatrizXProyecto(responseData);
            }
        });
    };

    this.exportarElemento = function () {
        _this.nombreFileExportar = new Ext.form.TextArea({
            fieldLabel: 'Nombre',
            name: 'valor',
            maxValue: 255,
            minValue: 1,
            allowBlank: false,
            anchor: '100%'
        });

        _this.ch_encrypt_exportar_info_elementos = new Ext.form.Checkbox({
            id: 'ch_encrypt_exportar_info_elementos',
            fieldLabel: '',
            labelSeparator: '',
            boxLabel: 'Encriptar información'
        });
        _this.formExportarElemento = new Ext.form.FormPanel({
            labelWidth: 55,
            frame: true,
            defaultType: 'textfield',
            items: [_this.nombreFileExportar, _this.ch_encrypt_exportar_info_elementos]
        });
        _this.btnCancelarExportarElemento = new Ext.Button({
            iconCls: 'cancelar',
            text: 'Cancelar',
            tooltip: 'Cerrar ventana sin guardar los datos',
            handler: function () {
                _this.windowExportarElemento.destroy();
            }
        });

        if (_this.arrayidelementos[0])
            _this.nombreFileExportar.setValue(_this.arrayidelementos[0].denominacion);

        _this.btnAceptarExportarElemento = new Ext.Button({
            iconCls: 'aceptar',
            text: 'Aceptar',
            disabled: true,
            tooltip: 'Guardar datos y cerrar ventana',
            handler: function () {
                if (_this.nombreFileExportar.getValue() != "") {
                    _this.guardarExportarElemento(_this.nombreFileExportar.getValue());
                }
                else
                    mostrarMensaje(1, 'Por favor debe introducir el nombre del archivo.');
            }
        });

        _this.guardarExportarElemento = function (nombrefichero) {
            _this.BarraProgreso.show("Exportando información");
            var tipo = "";
            var padre = [];
            if (_this.arrayidelementos.length > 0) {
                if (_this.arrayidelementos[0].tipo == 8) {
                    tipo = 'proyecto';
                    if (_this.arrayidelementos[0].plantilla == 1)
                        tipo = 'plantilla';
                } else {
                    var index = _this.stPlantilla.find(
                        'idelemento', _this.elementosseleccionados[0].data._parent, 0, true, false);
                    padre = _this.stPlantilla.getAt(index);
                    if (_this.arrayidelementos[0].tipo == 10) {
                        tipo = 'tarea';
                    } else {
                        tipo = 'hito';
                    }
                }
            }

            Ext.Ajax.request({
                url: '/planificacion/proyecto/planeacion/index.php/cmpgestionarplantilla/exportardatoselementos',
                params: {
                    idelemento: _this.arrayidelementos[0].id,
                    denelemento: _this.arrayidelementos[0].denominacion,
                    tipo: tipo,
                    encrypt: (_this.ch_encrypt_exportar_info_elementos.getValue()) ? 1 : 0,
                    nombrefichero: nombrefichero,
                },
                callback: function (options, success, response) {
                    _this.BarraProgreso.hide();
                    var tituloarchivo = Ext.decode(response.responseText);
                    console.log(tituloarchivo);
                    _this.windowExportarElemento.destroy();
                    window.open('../../resources/descargas/' + tituloarchivo);

                }
            });
        };

        _this.windowExportarElemento = new Ext.Window({
            title: 'Exportar elemento',
            width: 290,
            height: 170,
            minWidth: 200,
            minHeight: 170,
            layout: 'fit',
            plain: true,
            closeAction: 'destroy',
            modal: true,
            items: _this.formExportarElemento,
            buttons: [_this.btnCancelarExportarElemento, _this.btnAceptarExportarElemento]
        });

        _this.windowExportarElemento.show();
    };

    this.importarElementosExcel = function () {
        _this.fpImportarElemento = new Ext.form.FormPanel({
            labelAlign: 'top',
            fileUpload: true,
            frame: true,
            items: [{
                xtype: 'fileuploadfield',
                fieldLabel: 'Importar archivo',
                id: 'form-file-tarea',
                emptyText: 'Seleccione el archivo...',
                name: 'file',
                anchor: '95%',
                buttonCfg: {
                    text: '',
                    anchor: '95%',
                    iconCls: 'buscar'
                },
                allowBlank: false
            }]
        });

        _this.btnCancelarImportarElemento = new Ext.Button({
            iconCls: 'cancelar',
            text: 'Cancelar',
            tooltip: 'Cerrar ventana sin guardar los datos',
            handler: function () {
                _this.fpImportarElemento.getForm().reset();
                _this.wImportarElemento.destroy();
            }
        });

        _this.btnAceptarImportarElemento = new Ext.Button({
            iconCls: 'aceptar',
            text: 'Aceptar',
            tooltip: 'Guardar datos y cerrar ventana',
            handler: function () {
                _this.GuardarimportarElementosExcel();
            }
        });

        _this.GuardarimportarElementosExcel = function () {
            _this.BarraProgreso.show("Importando información");
            var tipo = "";
            var padre = [];
            var idelemento = "";
            var denelemento = "";
            if (_this.arrayidelementos.length > 0) {
                idelemento = _this.arrayidelementos[0].id;
                denelemento = _this.arrayidelementos[0].denominacion;
                if (_this.arrayidelementos[0].tipo == 8) {
                    tipo = 'proyecto';
                    if (_this.arrayidelementos[0].plantilla == 1)
                        tipo = 'plantilla';
                } else {
                    var index = _this.stPlantilla.find(
                        'idelemento', _this.elementosseleccionados[0].data._parent, 0, true, false);
                    padre = _this.stPlantilla.getAt(index);
                    if (_this.arrayidelementos[0].tipo == 10) {
                        tipo = 'tarea';
                    } else {
                        tipo = 'hito';
                    }
                }
            }

            _this.fpImportarElemento.getForm().submit(
                {
                    method: 'POST',
                    url: 'importardatoselementos',
                    timeout: 3600000,
                    success: true,
                    params: {
                        idelemento: idelemento,
                        denelemento: denelemento,
                        tipo: tipo,
                        idEstructura: _this.objestructura.idEstructura,
                    },
                    success: function (form, action) {
                        _this.BarraProgreso.hide();
                        mostrarMensaje(6, 'El fichero que trata de importar esta corrupto.');
                    },
                    failure: function (form, action) {
                        _this.BarraProgreso.hide();
                        console.log(action);
                        if (action.result.mensaje == 1) {
                            _this.tgPlantillas.getSelectionModel().clearSelections();
                            _this.stPlantilla.reload({
                                params: {
                                    start: 0,
                                    limit: 15,
                                    padre: [],
                                    incluRepeticiones: false,
                                    incluReasignaciones: false,
                                    arrayautores: Ext.encode([]),
                                    arrayinvolucrados: Ext.encode([]),
                                    incluProyecto: (_this.incluProyecto == null) ? _this.chIncluProyecto.getValue() : _this.incluProyecto,
                                    incluPlantilla: (_this.incluPlantilla == null) ? _this.chIncluPlantilla.getValue() : _this.incluPlantilla,
                                    idEstructura: (_this.idEstructura == null) ? _this.objestructura.idEstructura : _this.idEstructura
                                }
                            });
                            _this.wImportarElemento.destroy();
                            mostrarMensaje(1, 'Los datos fueron cargados correctamente.');
                        } else if (action.result.mensaje == 2) {
                            mostrarMensaje(6, 'Para importar este hito debe seleccionar un proyecto.');
                        } else if (action.result.mensaje == 3) {
                            mostrarMensaje(6, 'Para importar este hito debe seleccionar una plantilla.');
                        } else if (action.result.mensaje == 4) {
                            mostrarMensaje(6, 'Para importar una tarea debe seleccionar un elemento.');
                        } else if (action.result.mensaje == 5) {
                            mostrarMensaje(6, 'Para importar esta tarea debe seleccionar un elemento proyecto.');
                        } else if (action.result.mensaje == 6) {
                            mostrarMensaje(6, 'Para importar esta tarea debe seleccionar un elemento plantilla.');
                        } else if (action.result.mensaje == 7) {
                            mostrarMensaje(6, 'El fichero que trata de importar esta corrupto.');
                        }

                    }
                }
            );


        };

        _this.wImportarElemento = new Ext.Window({
            modal: true,
            closeAction: 'destroy',
            constrain: true,
            layout: 'fit',
            title: 'Importar archivo',
            width: 420,
            height: 130,
            items: [_this.fpImportarElemento],
            buttons: [_this.btnCancelarImportarElemento, _this.btnAceptarImportarElemento]
        });
        _this.wImportarElemento.show();

    };

    this.generarMatrizHibrida = function () {
        Ext.Ajax.request({
            url: '/planificacion/proyecto/planeacion/index.php/cmpgestionarplantilla/cargarMatrizHibrida',
            params: {
                idproyecto: _this.arrayidelementos[0].id,
                denproyecto: _this.arrayidelementos[0].denominacion
            },
            callback: function (options, success, response) {
                responseData = Ext.decode(response.responseText);
                _this.objMatrizRelaciones.getMatrizHibrida(responseData);
            }
        });
    };

    this.generarMatrizHibridaTareas = function () {
        Ext.Ajax.request({
            url: '/planificacion/proyecto/planeacion/index.php/cmpgestionarplantilla/cargarMatrizHibridaTareas',
            params: {
                idproyecto: _this.arrayidelementos[0].id,
                denproyecto: _this.arrayidelementos[0].denominacion
            },
            callback: function (options, success, response) {
                responseData = Ext.decode(response.responseText);
                _this.objMatrizRelaciones.getMatrizHibridaTareas(responseData);
            }
        });
    };
    this.generarMatrizTiempos = function () {
        Ext.Ajax.request({
            url: '/planificacion/proyecto/planeacion/index.php/cmpgestionarplantilla/cargarMatrizTiempos',
            params: {
                idproyecto: _this.arrayidelementos[0].id,
                denproyecto: _this.arrayidelementos[0].denominacion
            },
            callback: function (options, success, response) {
                responseData = Ext.decode(response.responseText);
                _this.objMatrizRelaciones.getMatrizTiempos(responseData);
            }
        });
    };


    this.generarProyectodePlantilla = function (plantilla) {
        var msj = 'Generando proyecto ...';
        if (plantilla == 1) {
            msj = 'Generando plantilla ...';
        }
        _this.BarraProgreso.show(msj);
        Ext.Ajax.request({
            url: '/planificacion/proyecto/planeacion/index.php/cmpgestionarplantilla/generarProyectodePlantilla',
            params: {
                fechainicio: _this.fini.getValue().format('d/m/Y'),
                proyecto: Ext.encode(_this.smPlantilla.getSelections()[0].data),
                denominacion: _this.tfdenominacion.getValue(),
                identificacion: _this.identificacion.getValue(),
                horainicio: _this.tmfHoraInicioProyecto.getValue(),
                plantilla: plantilla,
                idEstructura: _this.objestructura.idEstructura,
                ignorarFinSemana: (_this.chfindesemana.getValue() == true) ? 1 : 0, //(restoMinutos != 0) ? restoMinutos : 0
                regimen8hrs: (_this.chregimendiario.getValue() == true) ? 1 : 0,
                idfondotiempo: (_this.cmbFondoTiempo.getValue()) ? _this.cmbFondoTiempo.getValue() : 0

            },
            callback: function (options, success, response) {
                _this.BarraProgreso.hide();
                responseData = Ext.decode(response.responseText);
                if (responseData.mensaje == 1) {
                    _this.winGenerarProyecto.destroy();
                    mostrarMensaje(1, 'El proyecto se ha generado satisfactoriamente.');
                    _this.PostAccionesGestionar();
                } else if (responseData.mensaje == 0 || responseData.mensaje == 2) {
                    mostrarMensaje(1, responseData.msg);
                    _this.identificacion.focus();
                }
                else {
                    mostrarMensaje(1, 'El proyecto no ha podido ser generado.');
                    _this.winGenerarProyecto.destroy();
                    _this.PostAccionesGestionar();
                }
            }
        });
    };

    //funcion para levantar el componente 'Plantilla' para reorganizar elementos hijos
    this.ReorganizarHijos = function () {
        var objcmpPlantilla = new Utilidades.Cmp.Cmpgestionarplantilla(
            {
                noUsarModificar: true,
                noUsarEliminar: true,
                noUsarCerrarWinP: false,
                noUsarSeleccionarWinP: false,
                maxWinPrincipal: false,
                noUsarGestObser: true,
                noMostrarColumObser: true,
                reordenarHijos: true,
                nombrePanel: 'Registro de proyectos',
                noUsarAdicionar: false,
                noAutoload: true,
                singleSeleccion: true,
                arraysubElementos: _this.elementosseleccionados
            });
        var aux = [];
        for (var i = 0; i < _this.smPlantilla.getCount(); i++) {
            aux.push(_this.smPlantilla.getSelections()[i].id);
            if (_this.smPlantilla.getSelections()[i].data._parent != null)
                aux.push(_this.smPlantilla.getSelections()[i].data._parent);
        }
        objcmpPlantilla.CargarCmpPlantilla(idelemento = null, tipoelemento = null,
            _this.arrayidelementos[0].plantilla, null, parentelemento = 'hijo', function () {
                _this.arrayidelementos = [];
                _this.start = _this.pagPlantilla.getLastStart();
                _this.smPlantilla.clearSelections();
                _this.stPlantilla.reload({
                    params: {
                        anode: null,
                        padre: null,
                        start: _this.start
                    }
                });
                _this.actualizarBarraHerramientas();
            }, aux);
    };

    this.actualizarCumplimiento = function (metodo) {
        var msj = '', msjError = '', msjAnteceden = '';
        if (_this.arrayidelementos.length == 1) {
            msj = 'La tarea ha sido actualizada satisfactoriamente.';
            msjError = 'La tarea no ha sido actualizada.';
            msjAntecedentes = 'La tarea a la que quiere dar cumplimiento depende de otras que la anteceden y no están cumplidas. ¿Desea darle cumplimiento a todas?';
        } else {
            msj = 'Las tareas han sido actualizadas satisfactoriamente.';
            msjError = 'Las tareas no han sido actualizada.';
            msjAntecedentes = 'Las tareas a las que quiere dar cumplimiento dependen de otras que la anteceden y no están cumplidas. ¿Desea darle cumplimiento a todas?';
        }
        if (metodo == 1) {
            this.BarraProgreso.show('Actualizando cumplimiento...');
            Ext.Ajax.request({
                url: '/planificacion/proyecto/planeacion/index.php/cmpgestionarplantilla/actualizarCumplimiento',
                params: {
                    arrayidtareas: Ext.encode(_this.arrayidelementos),
                    metodo: metodo
                },
                callback: function (options, success, response) {
                    _this.BarraProgreso.hide();
                    responseData = Ext.decode(response.responseText);
                    if (responseData.respuesta == 1) {
                        mostrarMensaje(1, msj);
                        _this.socketEvents.emit("actualizarPorcientoCumplimiento", responseData.arrayidTareas);
                        _this.socketEvents.on('validarIncumplimiento', function (fecha_hora_server) {
                            _this.objCmpPert.validarIncumplimiento(fecha_hora_server);
                        });
                        _this.accionesPostActualizarCumplimiento(1);
                    }
                    if (responseData.respuesta == 3) {
                        mostrarMensaje(1, msjError);
                        _this.accionesPostActualizarCumplimiento(0);
                    }
                    if (responseData.respuesta == 0) {
                        _this.smsInformacion(msjAntecedentes);
                    }
                }
            });
        } else {
            if (_this.winActualizarCumplimiento) {
                _this.winActualizarCumplimiento.destroy();
            }
            _this.winActualizarCumplimiento = new Ext.Window({
                title: 'Actualizar Cumplimiento',
                width: 200,
                height: 130,
                modal: true,
                buttons: [
                    {
                        handler: function () {
                            _this.winActualizarCumplimiento.destroy();
                        },
                        iconCls: 'cancelar',
                        text: 'Cancelar',
                        tooltip: ''
                    }, {
                        handler: function () {
                            _this.BarraProgreso.show('Actualizando cumplimiento...');
                            Ext.Ajax.request({
                                url: '/planificacion/proyecto/planeacion/index.php/cmpgestionarplantilla/actualizarCumplimiento',
                                params: {
                                    arrayidtareas: Ext.encode(_this.arrayidelementos),
                                    cumplimiento: Ext.get(_this.idcmp + '_nfActCumplimiento').getValue(),
                                    metodo: metodo
                                },
                                callback: function (options, success, response) {
                                    _this.BarraProgreso.hide();
                                    responseData = Ext.decode(response.responseText);
                                    if (responseData.respuesta == 1) {
                                        mostrarMensaje(1, msj);
                                        _this.socketEvents.emit("actualizarPorcientoCumplimiento", responseData.arrayidTareas);
                                        _this.winActualizarCumplimiento.destroy();
                                        _this.accionesPostActualizarCumplimiento(1);
                                    }
                                    if (responseData.respuesta == 3) {
                                        mostrarMensaje(1, msjError);
                                        _this.accionesPostActualizarCumplimiento(0);
                                    }
                                    if (responseData.respuesta == 0) {
                                        _this.winActualizarCumplimiento.destroy();
                                        _this.smsInformacion(msjAntecedentes);
                                    }
                                }
                            });
                        },
                        iconCls: 'aceptar',
                        text: 'Aceptar',
                        tooltip: ''
                    }
                ],
                items: [
                    new Ext.FormPanel({
                        labelAlign: 'top',
                        frame: true,
                        items: [
                            new Ext.form.NumberField({
                                fieldLabel: 'Porciento de cumplimiento',
                                id: _this.idcmp + '_nfActCumplimiento',
                                maxValue: 100,
                                maxText: 'Solo admite números enteros positivos entre 0 y 100. Con 2 cifras decimales.',
                                allowBlank: false,
                                anchor: '90%'
                            })
                        ]
                    })
                ]
            });
            _this.winActualizarCumplimiento.show();
        }
    };

    this.smsInformacion = function (msjAntecedentes) {
        Ext.MessageBox.show({
            title: 'Información',
            msg: msjAntecedentes,
            buttons: Ext.MessageBox.YESNO,
            fn: _this.mostrarOpcionesCumplimiento,
            animEl: 'mb4',
            icon: Ext.MessageBox.INFO
        });
    };

    this.mostrarOpcionesCumplimiento = function (btn) {
        var msj = '';
        if (_this.arrayidelementos.length == 1) {
            msj = 'La tarea ha sido actualizada satisfactoriamente.';
        } else {
            msj = 'Las tareas han sido actualizadas satisfactoriamente.';
        }
        if (btn === "yes") {
            _this.BarraProgreso.show('Actualizando cumplimiento...');
            Ext.Ajax.request({
                url: '/planificacion/proyecto/planeacion/index.php/cmpgestionarplantilla/actualizarCumplimientoTareasAnteceden',
                params: {
                    arrayidtareas: Ext.encode(_this.arrayidelementos)
                },
                callback: function (options, success, response) {
                    _this.BarraProgreso.hide();
                    responseData = Ext.decode(response.responseText);
                    if (responseData.respuesta == 1) {
                        mostrarMensaje(1, msj);

                        _this.socketEvents.emit("actualizarPorcientoCumplimiento", responseData.arrayidTareas);

                        /*_this.socketEvents.emit("actualizarPorcientoCumplimiento", responseData.arrayidTareas);
                         
                         _this.socketEvents.on('validarIncumplimiento', function (fecha_hora_server) {
                         _this.objCmpPert.validarIncumplimiento(fecha_hora_server);
                         });*/

                        _this.accionesPostActualizarCumplimiento(1);
                    }

                }
            });

        }
    };

    this.accionesPostActualizarCumplimiento = function (mensaje) {
        // _this.smPlantilla.clearSelections();
        //_this.start = _this.pagPlantilla.getLastStart();
        //_this.stPlantilla.reload({
        //    params: {
        //        anode: null,
        //        start: _this.start
        //    }
        //});
        //_this.actualizarBarraHerramientas();
        switch (mensaje) {
            case 0:
                _this.smPlantilla.clearSelections();
                _this.RecargarNodo(null, _this.start, null);
                break;
            case 1:
                if (_this.smPlantilla.hasSelection()) {
                    var rec = _this.smPlantilla.getSelected();
                    if (rec.data._parent == null) {
                        _this.PaginaActual(null);
                    } else {
                        _this.arrayArbolGeneologico.push(rec);
                        while (rec.data._parent != null) {
                            var recparent = _this.stPlantilla.getById(rec.data._parent);
                            _this.arrayArbolGeneologico.push(recparent);
                            rec = recparent;
                            if (rec.data._parent == null) {
                                break;
                            }
                        }
                        _this.expandirPadresGrid(_this.arrayArbolGeneologico);
                        _this.actualizarBarraHerramientas();
                    }
                }
                break;
            default:
                _this.smPlantilla.clearSelections();
                _this.RecargarNodo(null, _this.start, null);
                break;
        }
    }

    this.expandirPadresGrid = function (arrayPadres) {
        var cant = arrayPadres.length;
        _this.PaginaActual(null);
        for (var i = cant - 1; i >= 1; i--) {
            var rec = _this.stPlantilla.getById(arrayPadres[i].id);
            _this.smPlantilla.selectRecords([rec]);
            _this.RecargarNodo(rec.id, 0, rec);
        }

    }

    this.accionesPostEjecutarFT = function () {
        _this.arrayidelementos = [];
        _this.stPlantilla.reload({});
        _this.actualizarBarraHerramientas();
    };


    this.generarMatriz = function () {

        _this.pivotGrid = Ext.create('Mz.examples.Common', {
            title: 'Basic example',
            aggregate: [{
                dataIndex: 'value',
                header: 'Sum of value',
                aggregator: 'sum'
            }, {
                dataIndex: 'value',
                header: '# records',
                aggregator: 'count',
                align: 'right'//,
                //  renderer:   Ext.util.Format.numberRenderer('0')
            }],
            leftAxis: [{
                dataIndex: 'company',
                header: 'Company',
                sortable: false
            }],
            topAxis: [{
                width: 120,
                dataIndex: 'country'
            }]

        });

        _this.panelmatriz = new Ext.Panel({
            title: 'Matriz de recursos',
            layout: 'fit',
            width: 300,
            id: 'panelmatriz',
            //  collapsible: true,
            //collapsed: true,
            margins: '3 3 3 3',
            region: 'east',
            items: [_this.pivotGrid]
        });
        _this.wingenerarMatriz = new Ext.Window({
            //constrain: true,
            id: 'wingenerarMatriz',
            title: 'Generar Matriz',
            modal: true,
            autoShow: true,
            closeAction: 'destroy',
            layout: 'fit',
            width: 800,
            height: 400,
            resizable: false,
            autoValidate: true,
            validateDefault: true,
            items: _this.panelmatriz,
            buttons: [
                {
                    iconCls: 'cancelar',
                    text: 'Cancelar',
                    id: 'btnCancelarGenerarProy',
                    handler: function () {
                        _this.wingenerarMatriz.destroy();
                    },
                    tooltip: 'Cerrar ventana sin guardar los datos'
                }, {
                    iconCls: 'aceptar ',
                    text: 'Aceptar ',
                    id: 'btnAceptarGenerarProy',
                    // disabled: true,
                    handler: function () {
                        _this.generarProyectodePlantilla();
                    },
                    tooltip: 'Guardar datos y cerrar ventana'
                }
            ]
        });
        _this.wingenerarMatriz.show();

    };

    this.actualizarBarraHerramientasEstructura = function (accion) {
        if (_this.tpEstructuras.getRootNode().childNodes.length == 0) {
            Ext.getCmp('btnExpandirEntidad').setDisabled(true);
            Ext.getCmp('btnContraerEntidad').setDisabled(true);
        } else {
            if (accion == 'contraer') {
                Ext.getCmp('btnExpandirEntidad').setDisabled(false);
                Ext.getCmp('btnContraerEntidad').setDisabled(true);
            } else if (accion == 'expandir' || accion == 'actualizar') {
                Ext.getCmp('btnExpandirEntidad').setDisabled(true);
                Ext.getCmp('btnContraerEntidad').setDisabled(false);
                if (accion == 'actualizar') {
                    _this.tfbuscarEstructuras.reset();
                    _this.btnbuscarEstructuras.disable();
                    _this.btnLimpiarEstructuras.disable();
                }
            }
        }
    }


    function MostrarDuracionEstimada(equivalenciaMinutos, m, p) {
        var tiempo = '';
        /*var restoAnos = equivalenciaMinutos % (525600);
         var equivalenciaAnos = equivalenciaMinutos / (525600);
         var restoMeses = restoAnos % (44640);
         var equivalenciaMeses = restoAnos / (44640);*/
        var restoDias = equivalenciaMinutos % (1440);
        var equivalenciaDias = equivalenciaMinutos / (1440);
        var restoHoras = restoDias % (60);
        var equivalenciaHoras = restoDias / (60);
        var restoMinutos = restoDias % (60);
        //var duracionPlanTotal = parseInt(equivalenciaAnos) + ' años - ' + parseInt(equivalenciaMeses) + ' meses - ' + parseInt(equivalenciaDias) + ' dias - ' + parseInt(equivalenciaHoras) + ' horas - ' + parseInt(restoMinutos) + ' minutos';
        _this.equivalenciaDuracion = {
            equivalenciaDias: (parseInt(equivalenciaDias) != 0) ? parseInt(equivalenciaDias) : 0,
            equivalenciaHoras: (parseInt(equivalenciaHoras) != 0) ? parseInt(equivalenciaHoras) : 0,
            restoMinutos: (restoMinutos != 0) ? restoMinutos : 0
        };

        if (equivalenciaMinutos >= 60) {
            if (_this.equivalenciaDuracion.equivalenciaDias != 0)
                tiempo = parseInt(_this.equivalenciaDuracion.equivalenciaDias) + ' dias';
            else
                tiempo = '';
            if (_this.equivalenciaDuracion.equivalenciaHoras != 0)
                tiempo += ' ' + parseInt(_this.equivalenciaDuracion.equivalenciaHoras) + ' horas';
            else
                tiempo += '';
            if (_this.equivalenciaDuracion.restoMinutos != 0)
                tiempo += ' ' + Math.round(_this.equivalenciaDuracion.restoMinutos) + ' min';
            else
                tiempo += '';
        } else {
            tiempo = Math.round(equivalenciaMinutos) + ' min';
        }

        return tiempo;
    }

    this.PostAccionesGestionar = function (mensaje, accion, tipo) {
        switch (mensaje) {
            case 0:
                _this.smPlantilla.clearSelections();
                _this.RecargarNodo(null, _this.start, null);
                break;
            case 1:
                if (_this.smPlantilla.hasSelection() && (tipo != 'plantilla' || tipo != 'proyecto')) {
                    //console.log('esaaa');
                    //_this.actualizarBarraHerramientas();
                    //var rec = _this.stPlantilla.getById(_this.arrayidelementos[0].id);
                    var rec = _this.smPlantilla.getSelected();
                    if (accion == 'Adicionar') {
                        if (rec.data._parent == null) {

                            _this.smPlantilla.clearSelections();
                            _this.RecargarNodo(null, _this.start, null);

                            /*var recparent = _this.stPlantilla.getById(rec.data.idelemento);
                             _this.smPlantilla.selectRecords([recparent]);
                             _this.actualizarBarraHerramientas();
                             _this.RecargarNodo(recparent.id, 0, recparent);*/
                            //_this.PaginaActual(null);
                        } else {
                            if (rec.data._is_leaf && rec.data._parent != null) {
                                _this.smPlantilla.clearSelections();
                                var recparent = _this.stPlantilla.getById(rec.data._parent);
                                _this.smPlantilla.selectRecords([recparent]);
                                _this.actualizarBarraHerramientas();
                                _this.RecargarNodo(recparent.id, 0, recparent);
                            } else {
                                var recparent = _this.stPlantilla.getById(rec.data.idelemento);
                                _this.smPlantilla.selectRecords([recparent]);
                                _this.actualizarBarraHerramientas();
                                _this.RecargarNodo(recparent.id, 0, recparent);
                            }
                        }
                    }
                    if (/*accion == 'Adicionar' || */accion == 'Cancelar' || accion == 'Modificar' || accion == 'Duplicar' || accion == 'Cerrar') {
                        if (rec.data._parent == null) {
                            _this.PaginaActual(null);
                        } else {
                            var recparent = _this.stPlantilla.getById(rec.data._parent);
                            _this.smPlantilla.selectRecords([recparent]);
                            _this.actualizarBarraHerramientas();
                            _this.RecargarNodo(recparent.id, 0, recparent);
                        }
                    } else if (accion == 'Eliminar') {
                        if (_this.start != 0)
                            _this.posteliminar = true;
                        var totalseleccionados = _this.smPlantilla.getCount();
                        if (totalseleccionados > 1) {
                            _this.PaginaActual(null);
                        } else {
                            if (rec.data._parent == null) {
                                _this.PaginaActual(null);
                            } else {
                                var recparent = _this.stPlantilla.getById(rec.data._parent);
                                _this.smPlantilla.selectRecords([recparent]);
                                _this.actualizarBarraHerramientas();
                                _this.RecargarNodo(recparent.id, 0, recparent);
                            }
                        }
                    } else {
                        //Codigo para Reasignar
                    }
                } else {
                    _this.RecargarNodo(null, _this.start, null);
                }
                break;

            case 2:
                var rec = _this.smPlantilla.getSelected();
                if (_this.arrayidelementopegar.length == 1) {
                    var recordcortado = _this.stPlantilla.getById(_this.arrayidelementopegar[0].idElemen);
                    _this.stPlantilla.remove(recordcortado);
                } else {
                    for (var i = 0; i < _this.arrayidelementopegar.length; i++) {
                        var recordcortado = _this.stPlantilla.getById(_this.arrayidelementopegar[i].idElemen);
                        _this.stPlantilla.remove(recordcortado);
                    }
                }

                if (rec.data._parent == null) {
                    var recparent = _this.stPlantilla.getById(rec.data.idelemento);
                    _this.smPlantilla.selectRecords([recparent]);
                    _this.actualizarBarraHerramientas();
                    _this.RecargarNodo(recparent.id, 0, recparent);
                    //_this.PaginaActual(null);
                } else {
                    if (rec.data._is_leaf && rec.data._parent != null) {
                        var recparent = _this.stPlantilla.getById(rec.data._parent);
                        _this.smPlantilla.selectRecords([recparent]);
                        _this.RecargarNodo(recparent.id, 0, recparent);
                    } else {
                        var recparent = _this.stPlantilla.getById(rec.data.idelemento);
                        _this.smPlantilla.selectRecords([recparent]);
                        _this.actualizarBarraHerramientas();
                        _this.RecargarNodo(recparent.id, 0, recparent);
                    }
                }

                break;
            default:
                _this.smPlantilla.clearSelections();
                _this.RecargarNodo(null, _this.start, null);
                break;
        }
        if (_this.objCrudtarea && _this.objCrudtarea.objRelaciones) _this.objCrudtarea.objRelaciones.arrayelementosrelacionados = [];
    };

    this.RecargarNodo = function (anode, start, rec) {
        _this.stPlantilla.reload({
            params: {
                anode: anode,
                start: start,
                padre: rec
            },
            callback: function () {
                if (_this.stPlantilla && rec) {
                    _this.stPlantilla.collapseNode(rec);
                    _this.stPlantilla.setNodeLoaded(rec, false);
                    _this.stPlantilla.expandNode(rec);
                }
            }
        });
    };

    //Funcion que recarga la pagina actual. Si no hay elementos listados regarga la pagina anterior.
    this.PaginaActual = function (anode) {
        _this.smPlantilla.clearSelections();
        _this.start = (_this.pagPlantilla.getPageData().activePage - 1) * (_this.pagPlantilla.cbPageSize.getValue());
        _this.stPlantilla.reload({
            params: {
                anode: anode,
                start: _this.start
            },
            callback: function () {
                if (_this.stPlantilla.getCount() == 0 && _this.start != 0) {
                    _this.start = _this.start - _this.pagPlantilla.cbPageSize.getValue();
                    _this.stPlantilla.reload({
                        params: {
                            anode: anode,
                            start: _this.start
                        }
                    });
                }
            }
        });
    };

    /***Expandir nodos**/

    this.ExpandParent = function (arrayrecord) {
        if (arrayrecord.length > 0) {
            var node = arrayrecord[arrayrecord.length - 1];
            if (node.data._is_leaf == false) {
                var recparent = _this.stPlantilla.getById(node.data.idelemento);
                _this.arrayidelementos = [];
                _this.arrayidelementos.push({
                    id: node.data.idelemento,
                    tipo: node.data.tipoelemento,
                    plantilla: node.data.plantilla,
                    idautor: node.data.idautor,
                    evento: node.data.evento,
                    gradocumplimiento: node.data.gradocumplimiento,
                    denominacion: node.data.denominacion,
                    superior: node.data.superior,
                    _is_leaf: node.data._is_leaf
                });

                _this.stPlantilla.reload({
                    params: {
                        anode: node.id,
                        start: 0,
                        padre: recparent
                    },
                    callback: function () {
                        _this.stPlantilla.collapseNode(node);
                        _this.stPlantilla.setNodeLoaded(node, true);
                        _this.stPlantilla.expandNode(node);
                        _this.analizados.push(node.id);
                        var aux = [];
                        var pos = 0;
                        for (var k = 0; k < arrayrecord.length; k++)
                            if (arrayrecord[k].id != node.id) {
                                aux[pos] = arrayrecord[k];
                                pos++;
                            }
                        arrayrecord = aux;
                        _this.ExpandParent(arrayrecord);
                    }
                });
            }
        }
        else {
            _this.ExpandNodesChildrens(_this.smPlantilla.getSelections()[0]);
        }

    }

    //Funcion que recarga y expande el nodo.
    this.ExpandNodesChildrens = function (node) {
        if (node.data._is_leaf == false) {
            _this.arrayidelementos = [];
            _this.arrayidelementos.push({
                id: node.data.idelemento,
                tipo: node.data.tipoelemento,
                plantilla: node.data.plantilla,
                idautor: node.data.idautor,
                evento: node.data.evento,
                gradocumplimiento: node.data.gradocumplimiento,
                denominacion: node.data.denominacion,
                superior: node.data.superior,
                _is_leaf: node.data._is_leaf
            });
            _this.stPlantilla.reload({
                params: {
                    anode: node.id,
                    start: 0,
                    padre: null
                },
                callback: function () {
                    _this.stPlantilla.collapseNode(node);
                    _this.stPlantilla.setNodeLoaded(node, true);
                    _this.stPlantilla.expandNode(node);
                    _this.ExpandAllChildren(node);
                }
            });
        }
    }

    this.ExpandAllChildren = function (rec) {
        if (_this.analizados.indexOf(rec.id) == -1)
            _this.analizados.push(rec.id);
        for (var i = 0; i < _this.stPlantilla.data.items.length; i++)
            if (_this.analizados.indexOf("" + _this.stPlantilla.data.items[i].data._parent) != -1 &&
                _this.analizados.indexOf("" + _this.stPlantilla.data.items[i].id) == -1) {
                _this.ExpandNodesChildrens(_this.stPlantilla.data.items[i]);
            }
    };

    this.UltimaPagina = function () {
        _this.smPlantilla.clearSelections();
        var numentero = Math.floor(_this.stPlantilla.getTotalCount() / _this.pagPlantilla.cbPageSize.getValue());
        _this.start = numentero * _this.pagPlantilla.cbPageSize.getValue();
        _this.stPlantilla.reload({
            params: {
                anode: null,
                start: _this.start
            }
        });
    };

    this.desasociarInversionProyecto = function () {
        var msj = 'Desasociando..';
        _this.BarraProgreso.show(msj);
        Ext.Ajax.request({
            url: '/planificacion/inversionesproyecto/index.php/inversionesproyecto/desasociarInversionProyecto',
            params: {
                idelemento: _this.arrayidelementos[0].id,
                idinversion: opcionesConfig.idinversion
            },
            callback: function (options, success, response) {
                _this.BarraProgreso.hide();
                responseData = Ext.decode(response.responseText);
                if (responseData.mensaje == 1) {
                    mostrarMensaje(1, 'El proyecto ha sido desasociado satisfactoriamente.');
                    _this.PostAccionesGestionar();
                    _this.WinPrincipal.hide();
                } else if (responseData.mensaje == 0) {

                }
            }
        });
    };

    this.ConstruirWinInvolucrarUsuarios = function (idelemento, tipoelemento, estamodificando, idautorelemento, desdeConf) {

        this.pclasificadorinvol = _this.objclasificadorinvol.CrearClasificadorInvolProyecto(idelemento, tipoelemento, estamodificando, idautorelemento, desdeConf);

        _this.WinFechasControl = new Ext.Window({
            width: 700,
            height: 400,
            //closable: false,
            //resizable: false,
            modal: false,
            layout: 'fit',
            //constrain: true,
            items: [_this.pclasificadorinvol],
            buttons: [
                {
                    iconCls: 'cerrar',
                    text: 'Cerrar',
                    tooltip: 'Cerrar ventana',
                    handler: function () {
                        _this.WinFechasControl.destroy();
                    }
                }, {
                    iconCls: 'aceptar',
                    text: 'Aceptar ',
                    tooltip: 'Guardar datos y cerrar ventana',
                    handler: function () {
                        _this.involucrarUsuarios();
                    }
                }
            ]
        });

        _this.WinFechasControl.show();

    }

    this.ConstruirWinAsociarRecursos = function (idelemento, tipoelemento, estamodificando, idautorelemento, desdeConf) {

        //this.pAsociarRecursos = _this.objactivrecurso.dosgrids('Adicionar', idelemento, true, 0, _this.recursosDisable, 1);
        this.pAsociarRecursos = _this.objactivrecurso.dosgrids('Modificar', idelemento, true, 1, _this.recursosDisable, 1);

        _this.WinAsociarRecursos = new Ext.Window({
            width: 840,
            height: 450,
            //closable: false,
            title: 'Asociar recursos',
            resizable: false,
            modal: true,
            layout: 'fit',
            frame: true,
            items: [_this.pAsociarRecursos],
            buttons: [
                {
                    iconCls: 'cerrar',
                    text: 'Cerrar',
                    tooltip: 'Cerrar ventana',
                    handler: function () {
                        _this.WinAsociarRecursos.destroy();
                    }
                }, {
                    iconCls: 'aceptar',
                    text: 'Aceptar ',
                    tooltip: 'Guardar datos y cerrar ventana',
                    handler: function () {
                        _this.asociarRecursos();
                    }
                }
            ]
        });

        _this.WinAsociarRecursos.show();

    }

    this.involucrarUsuarios = function () {
        var involucrarelementoshijos = 0;
        var mensaje = '¿Desea compartir todos los elementos contenidos en la selección para el(los) usuario(s) seleccionado(s)?';

        mostrarMensaje(2, mensaje, function (btnoprimido) {
            if (btnoprimido == 'ok') {
                involucrarelementoshijos = 1;
                _this.ejecutarInvolucrar(involucrarelementoshijos);
            } else {
                involucrarelementoshijos = 0;
                _this.ejecutarInvolucrar(involucrarelementoshijos);
            }
        });
    };

    this.ejecutarInvolucrar = function (involucrarelementoshijos) {
        _this.BarraProgreso.show();

        var mesage = '', mesageErrer = '';
        if (_this.arrayidelementos.length == 1) {
            mesage = 'El usuario ha sido involucrado satisfactoramente.';
            mesageErrer = 'El usuario no ha podido ser involucrado.';
        } else {
            mesage = 'Los usuarios han sido involucrados satisfactoramente.';
            mesageErrer = 'Los usuarios no han podido ser involucrados.';
        }

        Ext.Ajax.request({
            url: '/planificacion/proyecto/planeacion/index.php/cmpgestionarplantilla/involucrarUsuarios',
            params: {
                involucrarelementoshijos: involucrarelementoshijos,
                arrayinvolucrados: Ext.encode(_this.objclasificadorinvol.ObtenerInvolucrados()),
                arrayelementosseleccionados: Ext.encode(_this.arrayidelementos)
            },
            callback: function (options, success, response) {
                _this.BarraProgreso.hide();
                responseData = Ext.decode(response.responseText);
                if (responseData.mensaje == 1) {
                    _this.WinFechasControl.destroy();
                    mostrarMensaje(1, mesage);
                } else {
                    mostrarMensaje(1, mesageErrer);
                }
            }
        });
    };

    this.reorganizarElemento = function () {
        _this.BarraProgreso.show();

        var mesage = '', mesageErrer = '';
        if (_this.arrayidelementopegar.length == 1) {
            mesage = 'El elemento ha sido reorganizado satisfactoramente.';
            mesageErrer = 'El elemento no ha podido ser reorganizado.';
        } else {
            mesage = 'Los elementos han sido reorganizados satisfactoramente.';
            mesageErrer = 'Los elementos no han podido ser reorganizados.';
        }

        Ext.Ajax.request({
            url: '/planificacion/proyecto/planeacion/index.php/cmpgestionarplantilla/reorganizarElemento',
            params: {
                arrayidelementopegar: Ext.encode(_this.arrayidelementopegar),
                idpadre: _this.arrayidelementos[0].id,
                tipopadre: _this.arrayidelementos[0].tipo,
                idautorpadre: _this.arrayidelementos[0].idautor
            },
            callback: function (options, success, response) {
                _this.BarraProgreso.hide();
                responseData = Ext.decode(response.responseText);
                if (responseData.mensaje == 1) {
                    mostrarMensaje(1, mesage);
                    _this.PostAccionesGestionar(2, null, null);
                    _this.arrayidelementopegar = [];
                } else {
                    mostrarMensaje(1, mesageErrer);
                }
            }
        });
    };

    this.permitirCopiarCortar = function () {
        var permitir = true;
        for (var i = 0; i < _this.elementosseleccionados.length; i++) {
            if (_this.elementosseleccionados[i].data.tipoelemento == 8) {
                permitir = false;
                break;
            }
        }
        return permitir;
    };

    this.obtenerTipoDeElemento = function () {

        if (_this.elementosseleccionados.length == 1) {
            if (_this.elementosseleccionados[0].data.tipoelemento == 10) {
                return 'tarea';
            } else {
                return 'hito';
            }
        }

        var tipoelemento = 'hitos';
        var tipo = 9;
        if (_this.elementosseleccionados[0].data.tipoelemento == 10) {
            tipoelemento = 'tareas';
            tipo = 10;
        }

        for (var i = 1; i < _this.elementosseleccionados.length; i++) {
            if (_this.elementosseleccionados[i].data.tipoelemento != tipo) {
                tipoelemento = 'elementos';
                break;
            }
        }
        return tipoelemento;
    }

    this.permitirPegar = function () {
        var permitir = true;
        for (var i = 0; i < _this.arrayidelementopegar.length; i++) {
            if (_this.arrayidelementopegar[i].idElemen == _this.arrayidelementos[0].id) {
                permitir = false;
                break;
            }
        }
        return permitir;
    };

    this.asociarRecursos = function () {
        _this.BarraProgreso.show();

        var mesage = '', mesageErrer = '';
        if (_this.arrayidelementos.length == 1) {
            mesage = 'El elemento ha sido asociado a los recursos satisfactoramente.';
            mesageErrer = 'El elemento no ha podido ser asociado a los recursos.';
        } else {
            mesage = 'Los elementos han sido asociados a los recursos satisfactoramente.';
            mesageErrer = 'Los elementos no han podido ser asociados a los recursos.';
        }
        var arrayidrecursosasociados = _this.objactivrecurso.retornarasociados();

        Ext.Ajax.request({
            url: '/planificacion/proyecto/planeacion/index.php/cmpgestionarplantilla/asociarRecursos',
            params: {
                arrayidrecursos: Ext.encode(arrayidrecursosasociados),
                arrayidelementos: Ext.encode(_this.arrayidelementos)
            },
            callback: function (options, success, response) {
                _this.BarraProgreso.hide();
                responseData = Ext.decode(response.responseText);
                if (responseData.mensaje == 1) {
                    _this.WinAsociarRecursos.destroy();
                    mostrarMensaje(1, mesage);
                    _this.PostAccionesGestionar(2, null, null);
                    arrayidrecursosasociados = [];
                } else {
                    mostrarMensaje(1, mesageErrer);
                }
            }
        });
    };

}


