Utilidades.Cmp.Cmpdiagramagantt = function(opcionesConfig) {

    var _this = this;
    var progreso = 0;
    var accionGestion = '';
    var tipoGestion;
    this.tasks = [];

    this.BarraProgreso = new BarraEstado();
    this.primerafecha;
    this.ultimafecha;
    this.padre;
    this.datosProyecto;
    this.urlCargarActividades = opcionesConfig.urlCargarActividades;

    //objeto del componente "gestionar estructura"
    this.objestructura = new Utilidades.Cmp.Cmpgestionarestructura();

    this.objCrudtarea = new Utilidades.Cmp.Cmpcrudtarea(opcionesConfig);

    this.objCrudhito = new Utilidades.Cmp.Cmpcrudhito();

    //objeto del componente "Matriz de Relaciones"
    this.objMatrizRelaciones = new Planificacion.Integracion.MatrizrelacionesController();

    this.ObjValidaciones = new Utilidades.Cmp.Cmpvalidaciones();

    this.btndiahoy = new Ext.Button({
        iconCls: 'icondistra-actual',
        id: "btndiahoy",
        tooltip: 'Posicionar en día actual',
        disabled: false,
        handler: function() {
            _this.DiaDeHoy();
        }
    });

    this.menuAdicionar = new Ext.Toolbar.MenuButton({
        hidden: true,
        tooltip: 'Adicionar elementos',
        iconCls: 'icondistra-adicionar',
        menu: {
            items: [
                {
                    text: 'Adicionar Proyecto',
                    handler: function() {
                        _this.adicionarElemento(0);
                    },
                    disabled: false,
                    itemCls: 'x-menu-item icondistra-adicionar',
                    iconCls: 'imagen-none',
                    tooltip: 'Adicionar Proyecto',
                    key: {
                        alt: true,
                        key: 'IP'
                    },
                    scope: this
                }, {
                    text: 'Adicionar Hito',
                    handler: function() {
                        _this.adicionarElemento(1);
                    },
                    disabled: false,
                    itemCls: 'x-menu-item icondistra-adicionar',
                    iconCls: 'imagen-none',
                    tooltip: 'Adicionar Hito',
                    key: {
                        alt: true,
                        key: 'IO'
                    },
                    scope: this
                }, {
                    text: 'Adicionar Tarea',
                    handler: function() {
                        _this.adicionarElemento(3);
                    },
                    disabled: false,
                    itemCls: 'x-menu-item icondistra-adicionar',
                    iconCls: 'imagen-none',
                    tooltip: 'Adicionar Tarea',
                    key: {
                        alt: true,
                        key: 'IA'
                    },
                    scope: this
                }
            ]
        }
    });

    this.btnVerDetalles = new Ext.Button({
        iconCls: 'icondistra-ver',
        id: "btnVerDetalles",
        tooltip: 'Ver detalles del elemento',
        disabled: true,
        handler: function() {
            var idSelect = gantt.getSelectedId();
            var act = gantt.getTask(idSelect);
            _this.verDetalles(act);
        },
        key: {
            alt: true,
            key: 'D'
        },
        scope: this
    });

    this.btnAdicionarHitos = new Ext.Button({
        handler: function() {
            _this.adicionarHitos();
        },
        disabled: true,
        iconCls: 'icondistra-adicionar',
        tooltip: 'Adicionar Hitos'/*,
         key: {
         alt: true,
         key: 'M'
         },
         scope: this*/
    });

    this.btnModificar = new Ext.Button({
        handler: function() {
            var idSelect = gantt.getSelectedId();
            _this.modificarElemento(idSelect);
        },
        disabled: true,
        iconCls: 'icondistra-modificar',
        tooltip: 'Modificar elemento',
        key: {
            alt: true,
            key: 'M'
        },
        scope: this
    });

    this.btnEliminar = new Ext.Button({
        handler: function() {
            var idSelect = gantt.getSelectedId();
            var act = gantt.getTask(idSelect);
            if (act.idtipoelemento == 10) {
                _this.EliminarActividades(act);
            } else if (act.idtipoelemento == 9) {
                _this.eliminarObjetivo(act);
            } else if (act.idtipoelemento == 0) {
                _this.eliminarPlan(act);
            }
        },
        disabled: true,
        iconCls: 'icondistra-eliminar',
        tooltip: 'Eliminar elemento',
        key: {
            key: Ext.EventObject.DELETE
        },
        scope: this
    });

    this.btnRelaciones = new Ext.Button({
        handler: function() {
            var idSelect = gantt.getSelectedId();
            _this.CrearRelaciones(idSelect);
        },
        disabled: true,
        iconCls: 'icondistra-gestionarrelaciones',
        tooltip: 'Relacionar elemento',
        key: {
            ctrl: true,
            key: 'R'
        },
        scope: this
    });

    this.fechaFin = new Ext.form.DateField({
        fieldLabel: 'Fecha de fin',
        disabled: false,
        format: 'd/m/Y',
        name: 'fechafin',
        id: 'fechafin',
        value: new Date().format('d/m/Y'),
        anchor: '90%',
        startDate: 'fechainicio',
        readOnly: true,
        minText: 'La fecha fin tiene que ser posterior o igual a la fecha de inicio.',
        invalidText: 'Formato: dd/mm/aaaa.',
        vtype: 'rangoFechas',
        menuListeners: {
            select: function(df, date) {
                _this.fechaFin.setValue(date);
                if (_this.fechaFin.isValid() && _this.fechaInicio.isValid()) {
                    gantt.clearAll();
                    _this.Gantt();
                }
            }
        }
    });

    this.fechaInicio = new Ext.form.DateField({
        format: 'd/m/Y',
        name: 'fechainicio',
        id: 'fechainicio',
        value: new Date().format('d/m/Y'),
        anchor: '90%',
        endDateField: 'fechafin',
        allowBlank: true,
        readOnly: true,
        maxText: 'La fecha de inicio tiene que ser anterior o igual a la fecha fin.',
        invalidText: 'Formato: dd/mm/aaaa.',
        vtype: 'rangoFechas',
        menuListeners: {
            select: function(df, date) {
                _this.fechaInicio.setValue(date);
                if (_this.fechaInicio.isValid() && _this.fechaFin.isValid()) {
                    gantt.clearAll();
                    _this.Gantt();
                }
            }
        }
    });

    this.btnPDF = new Ext.Button({
        iconCls: 'icondistra-exportar',
        text: 'Exportar a PDF',
        id: "btnPDF",
        tooltip: 'Exportar a PDF',
        disabled: false,
        handler: function() {
            _this.ExportarPDF();
        }
    });

    this.btnPNG = new Ext.Button({
        iconCls: 'icondistra-exportar',
        text: 'Exportar a PNG',
        id: "btnPNG",
        tooltip: 'Exportar a PNG',
        disabled: false,
        handler: function() {
            _this.ExportarPNG();
        }
    });

    this.btnActualizar = new Ext.Button({
        iconCls: 'icondistra-actualizar',
        id: "btnActualizar",
        tooltip: 'Actualizar',
        disabled: true,
        handler: function() {
            _this.actualizar();
        },
        key: {
            ctrl: true,
            alt: true,
            key: 'Z'
        },
        scope: this
    });

    this.btnLimpiar = new Ext.Button({
        iconCls: 'icondistra-limpiar',
        id: "btnLimpiar",
        tooltip: 'Limpiar filtro(s)',
        disabled: true,
        handler: function() {
            _this.limpiar();
        },
        key: {
            alt: true,
            key: 'L'
        },
        scope: this
    });

    this.btnBuscar = new Ext.Button({
        iconCls: 'icondistra-buscar',
        id: "btnBuscar",
        tooltip: 'Buascar elementos',
        disabled: true,
        handler: function() {
            if (_this.tfbuscar.isValid()) {
                gantt.clearAll();
                _this.Gantt();
            }
        },
        key: {
            alt: true,
            key: 'B'
        },
        scope: this
    });

    //Textfiel para buscar tareaes
    this.tfbuscar = new Ext.form.TextField({
        enableKeyEvents: true,
        disabled: true,
        emptyText: 'Buscar',
        regex: _this.ObjValidaciones.expresionRegular('denominacion'),
        maskRe: /^([a-zA-Z0-9áéíóúü�?É�?ÓÚñÑÜ"' ,./()_-])$/,
        regexText: _this.ObjValidaciones.ObtenerMsjErrorTextoRegido('denominacion'),
        vtype: 'validarEspaciosEnBlanco',
        maxLength: 255,
        width: 200,
        listeners: {
            keydown: function(tf, e) {
                if (e.getKey() == 13) {
                    if (_this.tfbuscar.isValid()) {
                        gantt.clearAll();
                        _this.Gantt();
                    }
                }
            }
        }
    });

    this.btnAyudagant = new Ext.Button({
        id: 'btnAyudaGant',
        text: 'Ayuda',
        disabled: false,
        iconCls: 'icondistra-ayuda',
        tooltip: 'Mostrar ayuda de la funcionalidad',
        key: {
            alt: true,
            key: 'H'
        },
        scope: this

    });

    this.menuVistaDiagrama = new Ext.Toolbar.MenuButton({
        tooltip: 'Seleccionar vista de diagrama',
        iconCls: 'icondistra-estructura',
        menu: {
            items: [
                {
                    text: 'Años',
                    handler: function() {
                        _this.Annos();
                        _this.renderizar();
                    },
                    disabled: false,
                    itemCls: 'x-menu-item icondistra-estructura',
                    iconCls: 'imagen-none',
                    tooltip: 'Años',
                    id: "btnAnnos"
                }, {
                    text: 'Meses',
                    handler: function() {
                        _this.Meses();
                        _this.renderizar();
                    },
                    disabled: false,
                    itemCls: 'x-menu-item icondistra-estructura',
                    iconCls: 'imagen-none',
                    tooltip: 'Meses',
                    id: "btnMes"
                }, {
                    text: 'Semanas',
                    handler: function() {
                        _this.Semanas();
                        _this.renderizar();
                    },
                    disabled: false,
                    itemCls: 'x-menu-item icondistra-estructura',
                    iconCls: 'imagen-none',
                    tooltip: 'Semanas',
                    id: "btnSemana"
                }, {
                    text: 'Días',
                    handler: function() {
                        _this.Dias();
                        _this.renderizar();
                    },
                    disabled: false,
                    itemCls: 'x-menu-item icondistra-estructura',
                    iconCls: 'imagen-none',
                    tooltip: 'Días',
                    id: "btnDia"
                }
            ]
        }
    });

    this.menuMatriz = new Ext.Toolbar.MenuButton({
        tooltip: 'Generar matriz',
        //hidden: true,
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
                    handler: function() {
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
                    handler: function() {
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
                    handler: function() {
                        _this.generarMatrizHibridaTareas();
                    },
                    scope: this
                }, {
                    text: 'Generar matriz de tiempo',
                    tooltip: 'Generar matriz de tiempo',
                    iconCls: 'tablasporcategoria',
                    key: {
                        ctrl: true,
                        alt: true,
                        key: 'M'
                    },
                    handler: function() {
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
                    handler: function() {
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
                    handler: function() {
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
                    handler: function() {
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
                    handler: function() {
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
                    handler: function() {
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
                    handler: function() {
                        _this.generarReporte({tipo: 15});
                    },
                    scope: this
                }
            ]
        }
    });

    this.menuReporte = new Ext.Toolbar.MenuButton({
        tooltip: 'Generar reporte',
        //hidden: true,
        disabled: true,
        iconCls: 'crearreporte',
        menu: {
            items: [
                {
                    tooltip: 'Estado de cumplimiento',
                    text: 'Estado de cumplimiento',
                    iconCls: 'crearreporte',
                    handler: function() {
                        _this.generarReporte({tipo: 1})
                    }
                }, {
                    text: 'Avance programado por días',
                    tooltip: 'Avance programado por días',
                    iconCls: 'crearreporte',
                    handler: function() {
                        _this.generarReporte({tipo: 2})
                    },
                    scope: this
                }, {
                    text: 'Ruta crítica del proyecto',
                    tooltip: 'Ruta crítica del proyecto',
                    iconCls: 'crearreporte',
                    handler: function() {
                        _this.generarReporte({tipo: 3})
                    },
                    scope: this
                }, {
                    text: 'Plazos principales del proyecto',
                    iconCls: 'crearreporte',
                    tooltip: 'Plazos principales del proyecto',
                    handler: function() {
                        _this.generarReporte({tipo: 4})
                    },
                    scope: this
                }, {
                    text: 'Resumen de recursos y equipamientos',
                    iconCls: 'crearreporte',
                    tooltip: 'Resumen de recursos y equipamientos',
                    handler: function() {
                        _this.generarReporte({tipo: 5})
                    },
                    scope: this
                }, {
                    text: 'Resumen de tareas semanal',
                    iconCls: 'crearreporte',
                    tooltip: 'Resumen de tareas semanal',
                    handler: function() {
                        _this.generarReporte({tipo: 6})
                    },
                    scope: this
                }, {
                    text: 'Plan vs Real',
                    iconCls: 'crearreporte',
                    tooltip: 'Plan vs Real',
                    handler: function() {
                        _this.generarReporte({tipo: 7})
                    },
                    scope: this
                }, {
                    text: 'Porcentaje de avance real de las Tareas',
                    iconCls: 'crearreporte',
                    tooltip: 'Porcentaje de avance real de las Tareas',
                    handler: function() {
                        _this.generarReporte({tipo: 8})
                    },
                    scope: this
                }, {
                    text: 'Resumen de tareas cumplidas fuera de tiempo',
                    iconCls: 'crearreporte',
                    tooltip: 'Resumen de tareas cumplidas fuera de tiempo',
                    handler: function() {
                        _this.generarReporte({tipo: 9})
                    },
                    scope: this
                }
            ]
        }
    });

    this.resultTpl = new Ext.XTemplate(
            '<tpl for="."><div class="search-item">',
            '<br>{denelemento}</br>',
            '</div></tpl>'
            );

    this.stcbAgruparPorHistos = new Ext.data.Store({
        url: '/planificacion/proyecto/planeacion/index.php/cmpgestionarplantilla/obtenerHitosParaFiltro',
        autoLoad: false,
        reader: new Ext.data.JsonReader({
            root: "data"
        }, [{
                name: 'idelemento'
            }, {
                name: 'denelemento'
            }, {
                name: 'idautor'
            }, {
                name: 'tipoelemento'
            }]),
        listeners: {
            beforeload: function(st, opts) {
                st.baseParams.idelementopadre = _this.cmbproyecto.getValue()
            },
            load: function(st) {

                if (_this.stcbAgruparPorHistos.getCount() == 0) {
                    _this.btnAdicionar.disable();
                    mostrarMensaje(1, 'El proyecto: ' + _this.cmbproyecto.getRawValue() + ' no posee hitos');
                } else {
                    _this.cbAgruparPorHistos.enable();
                }
            }
        }
    });

    this.cbAgruparPorHistos = new Ext.form.ComboBox({
        emptyText: 'Filtrado por hito..',
        store: _this.stcbAgruparPorHistos,
        tpl: _this.resultTpl,
        itemSelector: 'div.search-item',
        hiddenName: 'idelemento',
        valueField: 'idelemento',
        displayField: 'denelemento',
        triggerAction: 'all',
        enableQtip: true,
        allowBlank: true,
        readOnly: false,
        editable: false,
        disabled: true,
        loadingText: 'Cargando hitos..',
        forceSelection: true,
        mode: 'remote',
        anchor: '100%',
        listeners: {
            expand: function(combo) {
                //_this.stcbAgruparPorHistos.reload();
            },
            select: function(combo, record, index) {
                /*_this.objCrudCalendario.idhito = _this.cbAgruparPorHistos.getValue();
                 _this.objCrudCalendario.idproyecto = 0;
                 _this.objCrudCalendario.permitiradicionar = 1;*/

                _this.padre = {
                    idelemento: record.data.idelemento,
                    idautor: record.data.idautor,
                    tipoelemento: record.data.tipoelemento
                }
                //console.log(_this.padre);
                //_this.objCrudCalendario.padre = _this.padre;
                /*_this.btnAdicionar.enable();
                 _this.objCrudCalendario.eventStore.reload({
                 params: {
                 arrayautores: Ext.encode(_this.arrayautores),
                 arrayinvolucrados: Ext.encode(_this.arrayinvolucrados),
                 idhito: _this.cbAgruparPorHistos.getValue(),
                 start: _this.objCrudCalendario.pcalendario.getActiveView().viewStart.format('d/m/Y'),
                 end: _this.objCrudCalendario.pcalendario.getActiveView().viewEnd.format('d/m/Y')
                 }
                 });*/
            }
        }
    });

    this.stCmbProyecto = new Ext.data.Store({
        url: '/planificacion/proyecto/planeacion/index.php/cmpgestionarplantilla/obtenerPlanesParaFiltro',
        autoLoad: false,
        listeners: {
            beforeload: function(st) {
                st.baseParams.idEstructura = (_this.idEstructura == null) ? _this.objestructura.idEstructura : _this.idEstructura;
                st.baseParams.soloProyectos = 1;
            },
            load: function(st) {
                if (_this.stCmbProyecto.getCount() == 0) {
                    _this.actualizarBarraHerramientas();
                    mostrarMensaje(1, 'La estructura seleccionada no posee proyectos');
                    _this.btnAdicionarHitos.disable();
                    _this.menuReporte.disable();
                    _this.menuMatriz.disable();
                } else {
                    _this.cmbproyecto.enable();
                }
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
            }, {
                name: 'idautor'
            }, {
                name: 'tipoelemento'
            }, {
                name: 'gradocumplimiento'
            }])
    });

    //combo de proyectos
    this.cmbproyecto = new Ext.form.ComboBox({
        emptyText: 'Filtrado por proyecto..',
        store: _this.stCmbProyecto,
        tpl: _this.resultTpl,
        itemSelector: 'div.search-item',
        hiddenName: 'idelemento',
        valueField: 'idelemento',
        displayField: 'denelemento',
        triggerAction: 'all',
        enableQtip: true,
        extendField: 'denelemento',
        typeAhead: true,
        allowBlank: true,
        readOnly: false,
        editable: false,
        disabled: true,
        loadingText: 'Cargando proyectos..',
        forceSelection: true,
        mode: 'remote',
        anchor: '100%',
        //width: 280,
        listeners: {
            expand: function(combo) {
                _this.stCmbProyecto.reload();
            },
            select: function(combo, record, index) {

                _this.padre = {
                    idelemento: record.data.idelemento,
                    idautor: record.data.idautor,
                    tipoelemento: record.data.tipoelemento,
                    denelemento: record.data.denelemento
                }

                _this.datosProyecto = {
                    idelemento: record.data.idelemento,
                    idautor: record.data.idautor,
                    tipoelemento: record.data.tipoelemento,
                    denelemento: record.data.denelemento,
                    gradocumplimiento: record.data.gradocumplimiento
                }

                _this.tfbuscar.enable();
                _this.btnBuscar.enable();
                _this.btnActualizar.enable();
                _this.btnLimpiar.enable();
                _this.btnAdicionarHitos.enable();
                _this.menuReporte.enable();
                _this.menuMatriz.enable();

                gantt.clearAll();
                _this.Gantt();
            }
        }
    });

    function onItemCheck(item, checked) {
        gantt.clearAll();
        _this.Gantt();
    }

    this.pGantt = new Ext.Panel({
        id: 'pGantt',
        disabled: true,
        buttonAlign: 'center',
        margins: '3 3 3 3',
        frame: false,
        region: 'center',
        layout: "fit",
        html: '<div id="gantt_here" style="width:100%; height:100%;"></div>'
    });

    this.actualizarBarraHerramientas = function() {
        _this.cmbproyecto.reset();
        _this.cmbproyecto.disable();
        _this.tfbuscar.disable();
        _this.btnBuscar.disable();
        _this.btnActualizar.disable();
        _this.btnLimpiar.disable();

        gantt.clearAll();
        _this.Gantt();
    }

    this.tpEstructuras = _this.objestructura.CrearArbolEstructura(_this.stCmbProyecto, null, _this.pGantt, _this.actualizarBarraHerramientas);

    this.pEstructura = new Ext.Panel({
        title: 'Estructuras',
        id: 'estructuraGantt',
        layout: 'fit',
        collapsible: true,
        collapsed: false,
        width: 280,
        region: 'west',
        items: [_this.tpEstructuras]
    });

    this.WinPrincipal = new Ext.Window({
        layout: 'border',
        closable: false,
        draggable: false,
        maximized: opcionesConfig.maxWinPrincipal,
        modal: true,
        width: 1000,
        height: 510,
        items: [_this.pEstructura, _this.pGantt],
        usarKeymap: true,
        tbar: [_this.menuAdicionar, ' ', _this.btnAdicionarHitos, ' ', _this.btnModificar, ' ',
            _this.btnEliminar, ' ', _this.btnVerDetalles, ' ', _this.btndiahoy, ' ', _this.menuVistaDiagrama, ' ', _this.menuMatriz, ' ', _this.menuReporte, '-',
            'Fecha de inicio : ', _this.fechaInicio, '-', 'Fecha de fin : ', _this.fechaFin, '-',
            '-', _this.cmbproyecto, /*'-', _this.cbAgruparPorHistos, '-',*/
            '-', _this.tfbuscar, ' ', _this.btnBuscar,
            _this.btnActualizar, ' ', _this.btnLimpiar, '->', _this.btnAyudagant],
        //usarKeymap: true,
        botonesKeymap: [_this.btnModificar, _this.btnEliminar,
            _this.btnVerDetalles, _this.btndiahoy, _this.btnBuscar,
            _this.btnActualizar, _this.btnLimpiar, _this.btnAyudagant],
        buttons: [
            {
                text: 'Cerrar',
                tooltip: 'Cerrar ventana',
                hidden: opcionesConfig.noUsarCerrarWinP,
                iconCls: 'icondistra-cerrar',
                handler: function() {
                    _this.WinPrincipal.hide();
                }
            }
        ],
        listeners: {
            show: function(w) {
                var nowdate = new Date();
                var monthStartDay = new Date(nowdate.getFullYear(), nowdate.getMonth(), 1);
                _this.fechaInicio.setValue(monthStartDay);

                var nowdate = new Date();
                var monthEndDay = new Date(nowdate.getFullYear(), nowdate.getMonth() + 1, 0);
                _this.fechaFin.setValue(monthEndDay);
            }
        }
    });

    _this.WinPrincipal.show();

    //********Ganttt ********
    this.Gantt = function() {
        _this.BarraProgreso.show('Cargando diagrama');
        Ext.Ajax.request({
            url: _this.urlCargarActividades,
            params: {
                denominacion: _this.tfbuscar.getValue(),
                idproyecto: (_this.cmbproyecto.getValue()) ? _this.cmbproyecto.getValue() : 0,
                fechainicio: _this.fechaInicio.getValue().format('d/m/Y'),
                fechafin: _this.fechaFin.getValue().format('d/m/Y')
            },
            callback: function(options, success, response) {
                _this.tasks = Ext.decode(response.responseText);
                for (key in _this.tasks.data) {
                    if (_this.tasks.data[key].parent == null) {
                        _this.tasks.data[key].parent = '';
                    }
                }
                //***Columnas***
                gantt.config.columns = [
                    {
                        name: "text",
                        label: "Denominación",
                        tree: true,
                        align: "left",
                        width: 230,
                        template: function(obj) {
                            if (obj.idtipoelemento == 0) {
                                return '<span class="icondistra-folder sipac-azul">' + obj.text + '</span>';
                            } else if (obj.idtipoelemento == 1) {
                                return '<span class="icondistra-archivo sipac-azul">' + obj.text + '</span>';
                            } else if (obj.idtipoelemento == 3) {
                                return '<span class="icondistra-tareaes sipac-azul">' + obj.text + '</span>';
                            } else if (obj.idtipoelemento == 8) {
                                return '<span class="icondistra-planilla sipac-azul">' + obj.text + '</span>';
                            } else if (obj.idtipoelemento == 9) {
                                return '<span class="icondistra-asentar sipac-azul">' + obj.text + '</span>';
                            } else if (obj.idtipoelemento == 10) {
                                return '<span class="icondistra-tarea sipac-azul">' + obj.text + '</span>';
                            } else if (obj.idtipoelemento == 11) {
                                return '<span class="icondistra-niveldetareaes sipac-azul">' + obj.text + '</span>';
                            } else if (obj.idtipoelemento == 12) {
                                return '<span class="icondistra-indicadores sipac-azul">' + obj.text + '</span>';
                            } else if (obj.idtipoelemento == 13) {
                                return '<span class="icondistra-liquidar sipac-azul">' + obj.text + '</span>';
                            }
                        }
                    }, {
                        name: "progress",
                        label: "% Cumpl.",
                        align: "center",
                        width: 60,
                        template: function(obj) {
                            return Math.round(obj.progress);
                        }
                    }, {
                        label: "Duración",
                        name: "duracion",
                        align: "center",
                        width: 120,
                        template: function(obj) {
                            return  _this.MostrarDuracionEstimada(obj.duracion);
                        }
                    }
                ];
                gantt.config.grid_width = 400;
                gantt.config.autofit = false;
                gantt.config.drag_progress = true;
                gantt.config.drag_links = true;
                gantt.config.drag_move = true;
                gantt.config.drag_resize = true;
                gantt.config.grid_resize = true;
                gantt.config.initial_scroll = false;

                /*if (_this.tasks.fechas[0].primerafecha != null) {
                 _this.primerafecha = _this.tasks.fechas[0].primerafecha.split("/");
                 _this.ultimafecha = _this.tasks.fechas[0].ultimafecha.split("/");
                 gantt.config.start_date = new Date(_this.primerafecha[2], (_this.primerafecha[1] - 1));
                 gantt.config.end_date = new Date(_this.ultimafecha[2], _this.ultimafecha[1]);
                 }*/

                _this.primerafecha = _this.fechaInicio.getValue().format('d/m/Y').split("/");
                _this.ultimafecha = _this.fechaFin.getValue().format('d/m/Y').split("/");

                gantt.templates.task_cell_class = _this.taskcell(new Date());

                //***Rango de fechas***
                gantt.config.lightbox.sections = [
                    {
                        name: "description",
                        height: 70,
                        map_to: "text",
                        type: "textarea",
                        focus: true
                    }, {
                        name: "time",
                        height: 72,
                        type: "duration",
                        map_to: "auto"
                    }
                ];

                gantt.attachEvent("onBeforeLinkAdd", function(id, link) {
                    if (opcionesConfig.usarDependencia == true) {
                        padre = gantt.getTask(link.source);
                        hijo = gantt.getTask(link.target);
                        if (padre.idtipoelemento != 10 || hijo.idtipoelemento != 10) {
                            mostrarMensaje(1, 'Las dependencias solo pueden ser generadas entre tareaes.', function(btnoprimido) {
                                if (btnoprimido == 'ok' || btnoprimido == 'cancel') {
                                    gantt.deleteLink(link.id);
                                }
                            });
                        }
                    }
                    return;
                });

                gantt.attachEvent("onContextMenu", function(taskId, linkId, e) {
                    var act = null;
                    var act = gantt.getTask(taskId);
                    var menunom = new Ext.menu.Menu({
                        id: 'menunom'
                    });
                    menunom.addMenuItem({
                        id: 'verdetalleMenuItem',
                        text: 'Ver detalles',
                        itemCls: 'x-menu-item icondistra-ver',
                        iconCls: 'imagen-none',
                        tooltip: 'Ver detalles de la tarea',
                        handler: function() {
                            _this.verDetalles(act);
                        }
                    });
                    if (act.idtipoelemento == 10) {
                        menunom.addMenuItem({
                            id: 'eliminaractMenuItem',
                            text: 'Eliminar Tarea',
                            itemCls: 'x-menu-item icondistra-eliminar',
                            iconCls: 'imagen-none',
                            tooltip: 'Eliminar Tarea',
                            handler: function() {
                                _this.EliminarActividades(taskId);
                            }
                        });
                        /*menunom.addMenuItem({
                         id: 'relacionarActMenuItem',
                         text: 'Relacionar Tarea',
                         itemCls: 'x-menu-item icondistra-gestionarrelaciones',
                         iconCls: 'imagen-none',
                         tooltip: 'Relacionar Tarea',
                         handler: function() {
                         _this.CrearRelaciones(taskId);
                         }
                         });*/
                        menunom.addMenuItem({
                            id: 'modificarActMenuItem',
                            text: 'Modificar Tarea',
                            itemCls: 'x-menu-item icondistra-modificar',
                            iconCls: 'imagen-none',
                            tooltip: 'Modificar Tarea',
                            handler: function() {
                                _this.modificarElemento(taskId);
                            }
                        });
                    } else if (act.idtipoelemento == 9) {
                        menunom.addMenuItem({
                            id: 'adicionarHitoMenuItem',
                            text: 'Adicionar Tarea',
                            itemCls: 'x-menu-item icondistra-adicionar',
                            iconCls: 'imagen-none',
                            tooltip: 'Adicionar Tarea',
                            handler: function() {
                                _this.adicionarElemento(taskId);
                            }
                        });
                        menunom.addMenuItem({
                            id: 'eliminaractMenuItem',
                            text: 'Eliminar Hito',
                            itemCls: 'x-menu-item icondistra-eliminar',
                            iconCls: 'imagen-none',
                            tooltip: 'Eliminar Hito',
                            handler: function() {
                                _this.EliminarActividades(taskId);
                            }
                        });
                        menunom.addMenuItem({
                            id: 'modificarObjMenuItem',
                            text: 'Modificar Hito',
                            itemCls: 'x-menu-item icondistra-modificar',
                            iconCls: 'imagen-none',
                            tooltip: 'Modificar hito',
                            handler: function() {
                                _this.modificarElemento(taskId);
                            }
                        });
                    }
                    var xy = [];
                    xy[0] = e.pageX;
                    xy[1] = e.pageY;
                    if (act.idelemento) {
                        menunom.showAt(xy);
                    }
                    if (act.eliminar == 0) {
                        Ext.getCmp('eliminaractMenuItem').disable();
                    }
                });

                /*** Si el espacio es muy corto */
                gantt.config.font_width_ratio = 7;
                gantt.templates.leftside_text = function leftSideTextTemplate(start, end, task) {
                    if (getTaskFitValue(task) === "left") {
                        return task.text;
                    }
                    return "";
                };
                gantt.templates.rightside_text = function rightSideTextTemplate(start, end, task) {
                    if (getTaskFitValue(task) === "right") {
                        return task.text;
                    }
                    return "";
                };
                gantt.templates.task_text = function taskTextTemplate(start, end, task) {
                    if (getTaskFitValue(task) === "center") {
                        return task.text;
                    }
                    return "";
                };
                function getTaskFitValue(task) {
                    var taskStartPos = gantt.posFromDate(task.start_date),
                            taskEndPos = gantt.posFromDate(task.end_date);
                    var width = taskEndPos - taskStartPos;
                    var textWidth = (task.text || "").length * gantt.config.font_width_ratio;
                    if (width < textWidth) {
                        var ganttLastDate = gantt.getState().max_date;
                        var ganttEndPos = gantt.posFromDate(ganttLastDate);
                        if (ganttEndPos - taskEndPos < textWidth) {
                            return "left";
                        } else {
                            return "right";
                        }
                    } else {
                        return "center";
                    }
                }

                /************** sobre deslizar una tarea ****************/
                gantt.attachEvent("onAfterTaskDrag", function(id, mode, e) {
                    var task = gantt.getTask(id);
                    if (task.idtipoelemento == 10) {
                        mensaje = '¿Est&aacute; seguro que quiere modificar la tarea seleccionada?';
                        permiso = 'Usted no tiene permiso para modificar la tarea seleccionada.';
                    } else if (task.idtipoelemento == 9) {
                        mensaje = '¿Est&aacute; seguro que quiere modificar el hito seleccionado?';
                        permiso = 'Usted no tiene permiso para modificar el hito seleccionado.';
                    }
                    if (task.modificar == 1) {
                        mostrarMensaje(2, mensaje, function(btnoprimido) {
                            if (btnoprimido == 'ok') {
                                if (mode == 'progress') {
                                    _this.ActualizarPorciento(task);
                                } else if (mode == 'move') {
                                    _this.ModificarActividad(task);
                                    contadorDrag = 0;
                                } else if (mode == 'resize') {
                                    _this.ModificarActividad(task);
                                }
                            } else {
                                _this.Gantt(null);
                            }
                        });
                    } else {
                        mostrarMensaje(2, permiso);
                        _this.Gantt(null);
                    }
                });

                gantt.attachEvent("onBeforeTaskDrag", function(id, mode, e) {
                    var task = gantt.getTask(id);
                    if (mode == 'progress') {
                        if (task.modificar == 0) {
                            progreso = 0;
                            modificar = false;
                        } else {
                            modificar = true;
                        }
                    } else if (mode == 'move') {
                        if (task.modificar == 0) {
                            modificar = false;
                        }
                        else {
                            modificar = true;
                        }
                    } else if (mode == 'resize') {
                        if (task.modificar == 0) {
                            modificar = false;
                        } else {
                            modificar = true;
                        }
                    }
                    return modificar;
                });

                gantt.attachEvent("onTaskDrag", function(id, mode, task, original) {
                    if (mode == 'progress') {
                        progreso = task.progress;
                        if (task.modificar == 0) {
                            progreso = 0;
                        }
                    } else if (mode == 'move') {

                    }
                });
                /******** FIN sobre deslizar una tarea ******************/

                /******** CSS de los elementos ******************/
                gantt.templates.task_class = function(start, end, task) {
                    if (task.idtipoelemento == 3 || task.idtipoelemento == 10) {
                        if (task.progress != 100 && (end < new Date())) {
                            return "high";
                        } else if (task.progress == 100) {
                            return "cumplida";
                        } else {
                            return "normal";
                        }
                    } else if (task.idtipoelemento == 1 || task.idtipoelemento == 9) {
                        return "obj";
                    } else if (task.idtipoelemento == 0 || task.idtipoelemento == 8) {
                        return "planes";
                    } else if (task.idtipoelemento == 11) {
                        return "nivel";
                    } else if (task.idtipoelemento == 12) {
                        return "indicador";
                    } else {
                        return "inversiones";
                    }
                };
                gantt.attachEvent("onTaskSelected", function(id, item) {
                    _this.btnModificar.enable();
                    _this.btnEliminar.enable();
                    _this.btnVerDetalles.enable();
                    var act = gantt.getTask(id);
                    if (act.idtipoelemento == 10 || act.idtipoelemento == 9) {
                        _this.btnRelaciones.enable();
                    }
                    if (act.idtipoelemento == 0) {
                        _this.btnRelaciones.disable();
                    }
                });
                gantt.attachEvent("onAfterTaskDelete", function(id, item) {
                    _this.btnModificar.disable();
                    _this.btnEliminar.disable();
                    _this.btnVerDetalles.disable();
                    _this.btnRelaciones.disable();
                });
                //***Cargar Gantt*** 
                _this.Semanas();
                _this.renderizar();
            }
        });
    };

    this.ActualizarPorciento = function(task) {
        if (task.idtipoelemento == 10) {
            mask = 'Modificando tarea';
            msj = 'La tarea ha sido modificada satisfactoriamente.';
        } else if (task.idtipoelemento == 9) {
            mask = 'Modificando hito';
            msj = 'El hito ha sido modificado satisfactoriamente.';
        } else {
            mask = 'Modificando plan';
            msj = 'El plan ha sido modificado satisfactoriamente.';
        }
        _this.BarraProgreso.show(mask);
        Ext.Ajax.request({
            url: opcionesConfig.urlActualizarPorciento,
            params: {
                porcientocumplimiento: task.progress,
                id: task.idelemento
            },
            callback: function(options, success, response) {
                responseData = Ext.decode(response.responseText);
                _this.BarraProgreso.hide();
                if (responseData == 1) {
                    mostrarMensaje(2, msj);
                }
            }
        });
    };

    this.ModificarActividad = function(task) {
        if (task.$target.length > 0 || task.$source.length > 0) {
            mostrarMensaje(2, 'Esta tarea tiene dependencias. ¿Quiere aplicarle el efecto cadena?', function(btnoprimido) {
                if (btnoprimido == 'ok') {
                    _this.ModificarEfecto(task, 1);
                } else if (btnoprimido == 'cancel') {
                    _this.ModificarEfecto(task, 0);
                }
            });
        } else {
            _this.ModificarEfecto(task, 0);
        }
    };

    this.ModificarEfecto = function(task, efecto) {
        if (task.idtipoelemento == 10) {
            mask = 'Modificando tarea';
            msj = 'La tarea ha sido modificada satisfactoriamente.';
            msjExiste = 'La tarea que quiere modificar no se encuentra en los registros.';
        } else if (task.idtipoelemento == 9) {
            mask = 'Modificando hito';
            msj = 'El hito ha sido modificado satisfactoriamente.';
            msjExiste = 'El hito que quiere modificar no se encuentra en los registros.';
        } else {
            mask = 'Modificando plan';
            msj = 'El plan ha sido modificado satisfactoriamente.';
            msjExiste = 'El plan que quiere modificar no se encuentra en los registros.';
        }
        _this.BarraProgreso.show(mask);
        Ext.Ajax.request({
            url: opcionesConfig.urlModificarActividad,
            params: {
                finiact: task.start_date.format('d/m/Y'),
                ffinact: task.end_date.format('d/m/Y'),
                idtarea: task.idelemento,
                tipo: task.idtipoelemento,
                efecto: efecto
            },
            callback: function(options, success, response) {
                responseData = Ext.decode(response.responseText);
                _this.BarraProgreso.hide();
                if (responseData.mensaje == 1) {
                    mostrarMensaje(2, msj);
                } else if (responseData.mensaje == 0) {
                    mostrarMensaje(2, msjExiste);
                } else {
                    mostrarMensaje(2, 'Las fechas de la tarea seleccionada no pueden ser modificadas.');
                }
                _this.Gantt(null);
            }
        });
    };

    this.adicionarDependencia = function(link) {
        var arreglodependencias = [];
        padre = gantt.getTask(link.source);
        hijo = gantt.getTask(link.target);
        arreglodependencias.push(hijo.idelemento);
        Ext.Ajax.request({
            url: '/planificacion/pdo/plan/index.php/cmpgestionartareaes/generarDependencia',
            params: {
                arraysubtareaes: Ext.encode(arreglodependencias),
                origen: (link.type + 6),
                actpadre: padre.idelemento,
                porcientoinicio: link.porciento
            },
            callback: function(options, success, response) {
                var respuesta = Ext.decode(response.responseText);
                if (respuesta.success == 1) {
                    mostrarMensaje(1, 'La dependencia ha sido generada satisfactoriamente.');
                } else {
                    gantt.deleteLink(link.id);
                    mostrarMensaje(1, 'La dependencia no pudo ser generada.');
                }
            }
        });
    };

    this.renderizar = function() {
        gantt.init("gantt_here");
        gantt.showDate(new Date());
        gantt.refreshData();
        gantt.refreshLink();
        gantt.parse(_this.tasks);
        if (_this.BarraProgreso)
            _this.BarraProgreso.hide();
        if (_this.tasks.data == '') {
            mostrarMensaje(1, 'No existen datos que se correspondan con los criterios de búsqueda especificados.');
        }
    };

    //***Escalas de tiempo ***
    this.Meses = function() {
        gantt.config.start_date = new Date(_this.primerafecha[2], (_this.primerafecha[1] - 1));
        gantt.config.end_date = new Date(_this.ultimafecha[2], parseInt(_this.ultimafecha[1]) + 1);
        gantt.config.scale_unit = "month";
        gantt.config.date_scale = "%F, %Y";
        gantt.config.scale_height = 40;
        gantt.config.min_column_width = 35;
        gantt.config.subscales = [
            {unit: "day", step: 1, date: "%j, %D"}
        ];
    };
    this.Dias = function() {
        gantt.config.start_date = new Date(_this.primerafecha[2], (_this.primerafecha[1] - 1));
        gantt.config.end_date = new Date(_this.ultimafecha[2], parseInt(_this.ultimafecha[1]) + 1);
        gantt.config.scale_unit = "day";
        gantt.config.date_scale = "%d/%m/%Y";
        gantt.config.min_column_width = 75;
        gantt.config.scale_height = 40;
        gantt.config.subscales = [
            {unit: "day", step: 1, date: "%D"}
            //{unit: "hour", step: 8, date: "%H:%i"}
        ];
    };
    this.Semanas = function() {
        gantt.config.start_date = new Date(_this.primerafecha[2], (_this.primerafecha[1] - 1));
        gantt.config.end_date = new Date(_this.ultimafecha[2], parseInt(_this.ultimafecha[1]) + 1);
        var weekScaleTemplate = function(date) {
            var dateToStr = gantt.date.date_to_str("%d %M");
            var endDate = gantt.date.add(gantt.date.add(date, 1, "week"), -1, "day");
            return dateToStr(date) + " - " + dateToStr(endDate);
        };
        gantt.config.scale_unit = "week";
        gantt.config.step = 1;
        gantt.templates.date_scale = weekScaleTemplate;
        gantt.config.min_column_width = 30;
        gantt.config.subscales = [
            {unit: "day", step: 1, date: "%D, %j"}
        ];
        gantt.config.scale_height = 40;
    };
    this.Annos = function() {
        gantt.config.start_date = new Date(_this.primerafecha[2], 0);
        gantt.config.end_date = new Date(_this.ultimafecha[2], 12);
        gantt.config.scale_unit = "year";
        gantt.config.step = 1;
        gantt.config.date_scale = "%Y";
        gantt.config.min_column_width = 30;
        gantt.config.scale_height = 50;
        gantt.templates.date_scale = null;
        var monthScaleTemplate = function(date) {
            var dateToStr = gantt.date.date_to_str("%M");
            var endDate = gantt.date.add(date, 2, "month");
            return dateToStr(date) + " - " + dateToStr(endDate);
        };
        gantt.config.subscales = [
            {
                unit: "month",
                step: 3,
                template: monthScaleTemplate
            }, {
                unit: "month",
                step: 1,
                date: "%M"
            }
        ];
    };

    //***Ventana Detalles***
    if (opcionesConfig.usarCrudActividades) {
        gantt.attachEvent("onTaskDblClick", function(id, e) {
            _this.modificarElemento(id);
        });
    }

    this.DiaDeHoy = function() {
        gantt.showDate(new Date());
    };

    this.ExportarPDF = function() {
        var tasksarea = Ext.get("gantt_task");
        var container = Ext.get("gantt_container");
        var scroll = Ext.get("gantt_hor_scroll");
        scroll.hide();
        var widthBefore = tasksarea.getWidth();
        var widthBeforeContainer = container.getWidth();
        var heightBefore = tasksarea.getHeight();
        tasksarea.setWidth(gantt._calculate_content_width());
        container.setWidth(gantt._calculate_content_width());
        tasksarea.setHeight(container.getHeight());
        var html = Ext.get("gantt_here");
        html = html.dom.innerHTML;
        tasksarea.setWidth(widthBefore);
        tasksarea.setHeight(heightBefore);
        scroll.show();
        Ext.Ajax.request({
            url: '/planificacion/pdo/plan/index.php/cmpgestionartareaes/ExportarGanttPDF',
            params: {
                html: html,
                ancho: gantt._calculate_content_width()
            },
            callback: function(options, success, response) {
                var cuerporeporte = Ext.decode(response.responseText);
                var winreporte = window.open('', '', 'scrollbars = yes,toolbar = yes,location = yes,resizable = yes, menubar = yes, status = yes');
                winreporte.document.write("<HTML><HEAD><TITLE>Vista previa del reporte</TITLE></HEAD><BODY>" + cuerporeporte + "</BODY></HTML>");
                winreporte.document.close();
            }
        });
    };
    this.ExportarPNG = function() {
        gantt.exportToPNG({skin: "skyblue"});
    };

    this.mostrarTareasDadoRango = function(fechaInicio, fechaFin) {
        _this.primerafecha = fechaInicio.split("/");
        _this.ultimafecha = fechaFin.split("/");
        gantt.config.start_date = new Date(_this.primerafecha[2], (_this.primerafecha[1] - 1));
        gantt.config.end_date = new Date(_this.ultimafecha[2], parseInt(_this.ultimafecha[1]) + 1);
        gantt.templates.task_cell_class = _this.taskcell(new Date());
        _this.renderizar();
    };

    this.taskcell = function(today) {
        return function(item, date) {
            return date.format('d/m/Y') == today.format('d/m/Y') ? "today" : "";
        };
    };



    this.PostAccionesGestionar = function(mensaje, accion, raiz) {
        if (accionGestion == 'Modificar') {
            _this.Gantt(null);
        }
        if (accionGestion == 'Adicionar') {
            if (tipoGestion == 10) {
                _this.Gantt(null);
            } else if (tipoGestion == 9) {
                _this.Gantt(null);
            } else {
                _this.actualizar();
            }
        }
        if (accionGestion == 'Eliminar') {
            _this.Gantt(null);
        }
    };

    gantt.attachEvent("onLinkDblClick", function(id, e) {
        link = gantt.getLink(id);
        _this.eliminarDependencias(link);
    });

    this.eliminarDependencias = function(link) {
        padre = gantt.getTask(link.source);
        hijo = gantt.getTask(link.target);
        mostrarMensaje(2, '¿Est&aacute; seguro que quiere eliminar la dependencia seleccionada?', function(btnoprimido) {
            if (btnoprimido == 'ok') {
                _this.BarraProgreso.show('Eliminando dependencia');
                Ext.Ajax.request({
                    url: '/planificacion/pdo/plan/index.php/cmpdiagramagantt/eliminarDependencia',
                    params: {
                        idelementopadre: hijo.idelemento,
                        idelementohijo: padre.idelemento,
                        origen: link.origen
                    },
                    callback: function(options, success, response) {
                        _this.BarraProgreso.hide();
                        responseData = Ext.decode(response.responseText);
                        if (responseData.mensaje == 1) {
                            mostrarMensaje(1, 'La dependencia ha sido eliminada satisfactoriamente.');
                            gantt.deleteLink(link.id);
                        } else {
                            mostrarMensaje(1, 'La dependencia no pudo ser eliminada.');
                        }
                    }
                });
            }
        });
    };

    this.EliminarActividades = function(id) {

        var array = [];
        var act = gantt.getTask(id);
        var actpadre = null;
        accionGestion = 'Eliminar';
        if (act.parent) {
            actpadre = act.parent;
        }
        if (act.idelemento) {
            array.push(act.idelemento);
            tipoGestion = act.idtipoelemento;
            var concepto = '';
            if (tipoGestion == 10) {
                concepto = 'la tarea';
            } else {
                concepto = 'el hito';
            }


            var arrayidelementos = [];
            arrayidelementos.push({
                id: act.idelemento,
                tipo: act.idtipoelemento,
                plantilla: 0,
                idautor: null,
                evento: 0,
                gradocumplimiento: act.progress,
                denominacion: act.text,
                _is_leaf: true
            });



            var mensaje = '', mensajemascara = '';
            mensaje = ' ¿Est&aacute; seguro que quiere eliminar ' + concepto + ' seleccionada?';
            mensajemascara = 'Eliminando tarea...';
            mostrarMensaje(2, mensaje, function(btnoprimido) {
                if (btnoprimido == 'ok') {
                    _this.BarraProgreso.show(mensajemascara);
                    Ext.Ajax.request({
                        url: '/planificacion/proyecto/planeacion/index.php/cmpgestionarplantilla/eliminarElemento',
                        params: {
                            arrayidelementos: Ext.encode(arrayidelementos)
                        },
                        callback: function(options, success, response) {
                            _this.BarraProgreso.hide();
                            responseData = Ext.decode(response.responseText);
                            if (responseData.mensaje == 1) {
                                var mensajeconfirmacion = '';
                                mensajeconfirmacion = concepto + ' ha sido eliminada satisfactoriamente.';

                                mostrarMensaje(1, mensajeconfirmacion);
                                gantt.deleteTask(act.id);
                                _this.PostAccionesGestionar();
                            }
                            if (responseData.mensaje == 0) {
                                var mensajeconfirmacion2 = '';
                                mensajeconfirmacion2 = 'La tarea que usted quiere eliminar ya no se encuentra en los registros.';
                                mostrarMensaje(1, mensajeconfirmacion2);
                            }
                        }
                    });
                }
            });

        }

    };
    this.modificarElemento = function(id) {
        var array = [];
        var act = gantt.getTask(id);
        accionGestion = 'Modificar';
        _this.padre.parent = act.parent;
        _this.padre.plantilla = 0;

        if (act.idelemento) {
            array.push(act.idelemento);

            var arrayidelementos = [];
            arrayidelementos.push({
                id: act.idelemento,
                tipo: act.idtipoelemento,
                plantilla: 0,
                idautor: null,
                evento: 0,
                gradocumplimiento: act.progress,
                denominacion: act.text,
                _is_leaf: true
            });
            if (act.idtipoelemento == 10) {
                tipoGestion = 10;
                _this.objCrudtarea.CrearWinCrudtarea('Modificar', _this.padre, _this.PostAccionesGestionar, arrayidelementos, null, _this.objestructura.idEstructura);

            } else if (act.idtipoelemento == 9) {
                tipoGestion = 9;
                _this.objCrudhito.CrearWinCrudhito('Modificar', _this.padre, _this.PostAccionesGestionar, arrayidelementos);
            }
        }

    };
    this.verDetalles = function(act) {
        accionGestion = 'Ver datos';
        var array = [];
        _this.padre.parent = act.parent;
        _this.padre.plantilla = 0;

        if (act.idelemento) {
            array.push(act.idelemento);

            var arrayidelementos = [];
            arrayidelementos.push({
                id: act.idelemento,
                tipo: act.idtipoelemento,
                plantilla: 0,
                idautor: null,
                evento: 0,
                gradocumplimiento: act.progress,
                denominacion: act.text,
                _is_leaf: true
            });

            if (act.idtipoelemento == 10) {
                tipoGestion = 10;
                _this.objCrudtarea.CrearWinCrudtarea('Ver datos de la', _this.padre, _this.PostAccionesGestionar, arrayidelementos);
            } else if (act.idtipoelemento == 9) {
                tipoGestion = 9;
                _this.objCrudhito.CrearWinCrudhito('Ver datos del', _this.padre, _this.PostAccionesGestionar, arrayidelementos);
            }
        }
    };
    this.adicionarElemento = function(id) {
        accionGestion = 'Adicionar';
        var array = [];
        var act = gantt.getTask(id);
        _this.padre.idelemento = act.idelemento;
        _this.padre.tipoelemento = act.idtipoelemento;
        _this.padre.plantilla = 0;

        if (act.idelemento) {
            array.push(act.idelemento);

            var arrayidelementos = [];
            arrayidelementos.push({
                id: act.idelemento,
                tipo: act.idtipoelemento,
                plantilla: 0,
                idautor: null,
                evento: 0,
                gradocumplimiento: act.progress,
                denominacion: act.text,
                _is_leaf: true
            });
            if (act.idtipoelemento == 9) {
                tipoGestion = 9;
                _this.objCrudtarea.CrearWinCrudtarea(
                        'Adicionar', _this.padre, _this.PostAccionesGestionar, arrayidelementos, null, _this.objestructura.idEstructura);
            }
        }
    };
    this.adicionarHitos = function() {

        accionGestion = 'Adicionar';

        var arrayidelementos = [];
        arrayidelementos.push({
            id: _this.padre.idelemento,
            tipo: _this.padre.tipoelemento,
            plantilla: 0,
            idautor: _this.padre.idautor,
            evento: 0,
            gradocumplimiento: 0,
            denominacion: _this.padre.denelemento,
            _is_leaf: false
        });

        tipoGestion = 9;
        _this.objCrudhito.CrearWinCrudhito('Adicionar', _this.padre, _this.PostAccionesGestionar, arrayidelementos, _this.objestructura.idEstructura);
    };
    this.actualizar = function() {
        gantt.clearAll();
        _this.Gantt();
    };
    this.limpiar = function() {
        _this.tfbuscar.reset();
        //_this.cbPlan.reset();
        //_this.fechaInicio.setValue(new Date().format('d/m/Y'));
        //_this.fechaFin.setValue(new Date().format('d/m/Y'));
        gantt.clearAll();
        _this.Gantt();
    };
    this.generarReporte = function(objeto) {
        var me = this;
        obj = {
            view: this,
            path: '/planificacion/proyecto/planeacion/index.php/cmpgestionarplantilla/obtenerReporte',
            baseParams: {
                denoreporte: 'Reporte No.' + objeto.tipo,
                idproyecto: (_this.datosProyecto.idelemento) ? _this.padre.idelemento : false,
                denproyecto: (_this.datosProyecto.denelemento) ? _this.padre.denelemento : false,
                fechainicio: _this.fechaInicio.getValue().format('d/m/Y'),
                gradocumplimiento: _this.datosProyecto.gradocumplimiento,
                fechafin: _this.fechaFin.getValue().format('d/m/Y'),
                idestructura: _this.objestructura.idEstructura,
                denomestructura: _this.tpEstructuras.selModel.selNode.attributes.text,
                tiporeporte: objeto.tipo,
                exportFormat: ['WORD', 'EXCEL']
            },
            fnFailure: function() {
                mostrarMensaje(1, 'Por favor haga la configuraci&oacute;n del usuario.');
            }
        };

        reportes.create(obj);
    };

    this.generarMatrizRecurso = function() {
        Ext.Ajax.request({
            url: '/planificacion/proyecto/planeacion/index.php/cmpgestionarplantilla/cargarMatrizRecurso',
            params: {
                idproyecto: _this.datosProyecto.idelemento,
                denproyecto: _this.datosProyecto.denelemento
            },
            callback: function(options, success, response) {
                responseData = Ext.decode(response.responseText);
                _this.objMatrizRelaciones.getMatrizXProyecto(responseData);
            }
        });
    };
    this.generarMatrizHibrida = function() {
        Ext.Ajax.request({
            url: '/planificacion/proyecto/planeacion/index.php/cmpgestionarplantilla/cargarMatrizHibrida',
            params: {
                idproyecto: _this.datosProyecto.idelemento,
                denproyecto: _this.datosProyecto.denelemento
            },
            callback: function(options, success, response) {
                responseData = Ext.decode(response.responseText);
                _this.objMatrizRelaciones.getMatrizHibrida(responseData);
            }
        });
    };
    this.generarMatrizHibridaTareas = function() {
        Ext.Ajax.request({
            url: '/planificacion/proyecto/planeacion/index.php/cmpgestionarplantilla/cargarMatrizHibridaTareas',
            params: {
                idproyecto: _this.datosProyecto.idelemento,
                denproyecto: _this.datosProyecto.denelemento
            },
            callback: function(options, success, response) {
                responseData = Ext.decode(response.responseText);
                _this.objMatrizRelaciones.getMatrizHibridaTareas(responseData);
            }
        });
    };
    this.generarMatrizTiempos = function() {
        Ext.Ajax.request({
            url: '/planificacion/proyecto/planeacion/index.php/cmpgestionarplantilla/cargarMatrizTiempos',
            params: {
                idproyecto: _this.datosProyecto.idelemento,
                denproyecto: _this.datosProyecto.denelemento
            },
            callback: function(options, success, response) {
                responseData = Ext.decode(response.responseText);
                _this.objMatrizRelaciones.getMatrizTiempos(responseData);
            }
        });
    };

    this.CrearRelaciones = function(id) {
        var act = gantt.getTask(id);
        var array = [];
        array.push(act.idelemento);
        if (act.idtipoelemento == 10) {
            /*_this.objCrudActividad.CrearWinCrudActividades(
             new Date().format('d/m/Y'),
             new Date().format('d/m/Y'),
             _this.horainicio,
             _this.horafin,
             'Relacionar elementos a la',
             _this.PostAccionesGestionar,
             array,
             null, 0,
             permisomodificar = 1,
             permisoeliminar = 1,
             _this.objcmprelaciones.ObtenerElementosRelacionadosIniciales());*/
        }
        if (act.idtipoelemento == 1) {
            /*_this.objCrudObjetivo.CrearWinCrudObjetivos(
             new Date().format('d/m/Y'),
             new Date().format('d/m/Y'),
             'Relacionar elementos al',
             _this.PostAccionesGestionar,
             array,
             null, 0,
             permisomodificar = 1,
             permisoeliminar = 1,
             _this.objcmprelaciones.ObtenerElementosRelacionadosIniciales());*/
        }
    }

    this.MostrarDuracionEstimada = function(equivalenciaMinutos) {
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
        var duracionPlanTotal = /*parseInt(equivalenciaAnos) + ' años - ' + parseInt(equivalenciaMeses) + ' meses - '*/ +parseInt(equivalenciaDias) + ' dias - ' + parseInt(equivalenciaHoras) + ' horas - ' + parseInt(restoMinutos) + ' minutos';
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
                tiempo += ' ' + parseInt(_this.equivalenciaDuracion.equivalenciaHoras) + ' hor';
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

};



