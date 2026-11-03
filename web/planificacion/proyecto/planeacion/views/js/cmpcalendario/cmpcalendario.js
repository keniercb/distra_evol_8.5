Utilidades.Cmp.Cmpcalendario = function(opcionesConfig) {
    var _this = this;
    this.idcomponente = opcionesConfig.idcomponente;
    this.prevrow = -1;
    this.idtipodocumento = 3;
    this.idaprobdiferentes = 0;
    this.eshija = 0;
    this.busqueda = 0;
    this.padre = 0;
    this.arrayautores;
    this.arrayinvolucrados;
    var prevrow = -1;
    var prevrow2 = -1;
    this.configuracion = null;
    var tiponom = null;
    var idelemento = null;

    //objeto CRUD-TAREAS inicializado
    this.objCrudtarea = new Utilidades.Cmp.Cmpcrudtarea(opcionesConfig);

    //objeto del componente "clasificador de involucrados"    
    this.objclasificadorinvol = new Utilidades.Cmp.Cmpclasificadorinvol();

    //objeto del componente "gestionar estructura"
    this.objestructura = new Utilidades.Cmp.Cmpgestionarestructura();

    //objeto del componente "barra de progreso"
    this.BarraProgreso = new BarraEstado();

    this.objreporte = new Utilidades.Cmp.Cmpwinreportes()

    //Sentencia para iniciar los tooltip
    Ext.QuickTips.init();

    //funcion que carga el componente Calendario
    //botones de la interfaz
    this.btnAyuda = new Ext.Button({
        id: 'btnAyudaCalendarioNuevo',
        text: 'Ayuda',
        iconCls: 'ayuda',
        tooltip: 'Mostrar ayuda de la funcionalidad',
        key: {
            alt: true,
            key: 'H'
        },
        scope: this
    });
    this.btnAdicionar = new Ext.Button({
        iconCls: 'adicionar',
        disabled: true,
        id: "btnAdicionarVC",
        tooltip: 'Adicionar tarea',
        handler: function() {
            var arrayidelementos = [];
            arrayidelementos.push({
                id: 0,
                tipo: 9,
                plantilla: 0,
                idautor: 0,
                evento: 0,
                gradocumplimiento: 0,
                denominacion: '',
                _is_leaf: true
            });
            _this.objCrudtarea.CrearWinCrudtarea(
                    'Adicionar', _this.padre, _this.PostAccionesGestionar, arrayidelementos, null, _this.objestructura.idEstructura);
            /*_this.objCrudActividad.CrearWinCrudActividades(
             new Date().format('d/m/Y'),
             new Date().format('d/m/Y'),
             '08:00',
             '17:00', 'Adicionar',
             _this.PostAccionesGestionar,
             arrayidactividades = [], null, 0,
             permisomodificar = 1, permisoeliminar = 1,
             _this.objcmprelaciones.ObtenerElementosRelacionadosIniciales(),
             null, null, true);*/
            //crudAdicionarAct.show();
        },
        key: {
            alt: true,
            key: 'I'
        },
        scope: this
    });
    this.btnActualizar = new Ext.Button({
        iconCls: 'actualizar',
        disabled: false,
        id: "btnActualizar",
        tooltip: 'Actualizar',
        handler: function() {
            _this.Refresh();
        },
        key: {
            ctrl: true,
            alt: true,
            key: 'Z'
        }
    });
    this.btnBusqueda = new Ext.Button({
        handler: function() {
            _this.BuscarActividadesCalendario();
        },
        text: 'Buscar',
        iconCls: 'buscar',
        tooltip: 'Buscar tarea(s)',
        key: {
            alt: true,
            key: 'B'
        },
        scope: this
    });
    this.btnLimpiarBusq = new Ext.Button({
        handler: function() {
            _this.LimpiarCalendarioBusq();
        },
        text: 'Limpiar',
        iconCls: 'limpiar',
        tooltip: 'Limpiar filtro(s)',
        key: {
            alt: true,
            key: 'L'
        },
        scope: this
    });
    this.btnReporte = new Ext.Button({
        iconCls: 'crearreporte',
        disabled: false,
        tooltip: 'Obtener reporte',
        key: {
            alt: true,
            key: 'R'
        },
        scope: this,
        handler: function() {
            var objcalendario = _this.objCrudCalendario.pcalendario.getActiveView().getStartDate();
            var textomes = '';

            if (objcalendario.format('m') == 01)
                textomes = "Enero";
            if (objcalendario.format('m') == 02)
                textomes = "Febrero";
            if (objcalendario.format('m') == 03)
                textomes = "Marzo";
            if (objcalendario.format('m') == 04)
                textomes = "Abril";
            if (objcalendario.format('m') == 05)
                textomes = "Mayo";
            if (objcalendario.format('m') == 06)
                textomes = "Junio";
            if (objcalendario.format('m') == 07)
                textomes = "Julio";
            if (objcalendario.format('m') == 08)
                textomes = "Agosto";
            if (objcalendario.format('m') == 09)
                textomes = "Septiembre";
            if (objcalendario.format('m') == 10)
                textomes = "Octubre";
            if (objcalendario.format('m') == 11)
                textomes = "Noviembre";
            if (objcalendario.format('m') == 12)
                textomes = "Diciembre";

            var auxinicio = _this.objCrudCalendario.pcalendario.getActiveView().lastRenderStart;
            var auxfin = _this.objCrudCalendario.pcalendario.getActiveView().lastRenderEnd;
            var fechainicio = Ext.encode(auxinicio.format('d/m/Y'));
            var fehchafin = Ext.encode(auxfin.format('d/m/Y'));

            _this.objreporte.mostrarWinReporte({
                calendario: 1,
                arrayautores: _this.arrayautores,
                arrayinvolucrados: _this.arrayinvolucrados,
                idEstructura: _this.objestructura.idEstructura,
                fechainicio: fechainicio,
                fechafin: fehchafin,
                valueanno: objcalendario.format('Y'),
                valuenummeses: objcalendario.format('m'),
                textomes: textomes
            });
        }
    });

    //arboles para la busqueda de elementos por autores e involucrados
    this.tpAutoresInvolucrados = _this.objclasificadorinvol.CrearClasificadorInvolBusquedaCalendario(tipoelemento = 3, function() {
//_this.GenerarCalendariosPorUsuarios();
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
                _this.objCrudCalendario.idhito = _this.cbAgruparPorHistos.getValue();
                _this.objCrudCalendario.idproyecto = 0;
                _this.objCrudCalendario.permitiradicionar = 1;

                _this.padre = {
                    idelemento: record.data.idelemento,
                    idautor: record.data.idautor,
                    tipoelemento: record.data.tipoelemento
                }
                //console.log(_this.padre);
                _this.objCrudCalendario.padre = _this.padre;

                _this.btnAdicionar.enable();
                _this.objCrudCalendario.eventStore.reload({
                    params: {
                        arrayautores: Ext.encode(_this.arrayautores),
                        arrayinvolucrados: Ext.encode(_this.arrayinvolucrados),
                        idhito: _this.cbAgruparPorHistos.getValue(),
                        start: _this.objCrudCalendario.pcalendario.getActiveView().viewStart.format('d/m/Y'),
                        end: _this.objCrudCalendario.pcalendario.getActiveView().viewEnd.format('d/m/Y')
                    }
                });
            }
        }
    });

    this.stCmbProyecto = new Ext.data.Store({
        url: '/planificacion/proyecto/planeacion/index.php/cmpgestionarplantilla/obtenerPlanesParaFiltro',
        autoLoad: false,
        listeners: {
            beforeload: function(st) {
                st.baseParams.idEstructura = (_this.idEstructura == null) ? _this.objestructura.idEstructura : _this.idEstructura;
            },
            load: function(st) {
                if (_this.stCmbProyecto.getCount() == 0) {
                    _this.actualizarBarraHerramientas();
                    mostrarMensaje(1, 'La estructura seleccionada no posee proyectos');
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
                _this.cbAgruparPorHistos.reset();
                _this.cbAgruparPorHistos.disable();
                _this.btnAdicionar.disable();
                _this.objCrudCalendario.idproyecto = _this.cmbproyecto.getValue();
                _this.objCrudCalendario.idhito = 0;
                _this.objCrudCalendario.permitiradicionar = 1;

                _this.padre = {
                    idelemento: record.data.idelemento,
                    idautor: record.data.idautor,
                    tipoelemento: record.data.tipoelemento
                }
                //console.log(_this.padre);
                _this.objCrudCalendario.padre = _this.padre;

                _this.btnAdicionar.enable();

                _this.objCrudCalendario.eventStore.reload({
                    params: {
                        arrayautores: Ext.encode(_this.arrayautores),
                        arrayinvolucrados: Ext.encode(_this.arrayinvolucrados),
                        idproyecto: _this.cmbproyecto.getValue(),
                        start: _this.objCrudCalendario.pcalendario.getActiveView().viewStart.format('d/m/Y'),
                        end: _this.objCrudCalendario.pcalendario.getActiveView().viewEnd.format('d/m/Y')
                    }
                });

                _this.stcbAgruparPorHistos.reload({
                    params: {
                        idelementopadre: _this.cmbproyecto.getValue()
                    }
                });
            }
        }
    });

    this.objCrudCalendario = new Utilidades.Cmp.Cmpcrudcalendario({
        id: _this.idcomponente + "_calendario",
        personal: false,
        busqueda: false,
        objclasificadorinvol: _this.objclasificadorinvol,
        cbProyecto: _this.cmbproyecto,
        idEstructura: _this.objestructura.idEstructura
    });

    //tabpanel donde muestro las opciones de busqueda
    this.tpOpcionesDeBusqueda = new Ext.TabPanel({
        activeTab: 0,
        frame: true,
        border: false,
        enableTabScroll: true,
        items: [
            {
                title: 'Por autores e involucrados',
                layout: 'fit',
                items: [_this.tpAutoresInvolucrados]
            }/*,
             _this.tgcategact, _this.tgtipoact, _this.pRelacionesIniciales*/
        ]
    });
    //panel donde muestro las opciones de busqueda
    this.pOpcionesDeBusqueda = new Ext.Panel({
        title: 'Opciones de b&uacute;squeda',
        collapsed: true,
        collapsible: true,
        height: 300,
        region: 'north',
        layout: 'fit',
        items: [_this.tpOpcionesDeBusqueda],
        buttons: [_this.btnBusqueda, _this.btnLimpiarBusq]
    });

    //panel donde muestro los calendarios seleccionados
    this.pCalendario = new Ext.Panel({
        region: "center",
        margins: "3 3 3 3",
        layout: "fit",
        disabled: true,
        tbar: ['-', _this.cmbproyecto, '-', _this.cbAgruparPorHistos, '-', _this.btnAdicionar, ' ', _this.btnReporte, /*' ', _this.btnConfigFirma,*/ _this.btnActualizar, '->', _this.btnAyuda],
        usarKeymap: true,
        botonesKeymap: [_this.btnAdicionar, _this.btnActualizar, _this.btnReporte, _this.btnConfigFirma, _this.btnAyuda]
    });

    this.actualizarBarraHerramientas = function() {
        _this.cmbproyecto.reset();
        _this.cbAgruparPorHistos.reset();
        _this.cmbproyecto.disable();
        _this.cbAgruparPorHistos.disable();
        _this.btnAdicionar.disable();
        _this.objCrudCalendario.idproyecto = 0;
        _this.objCrudCalendario.idhito = 0;
        _this.objCrudCalendario.idEstructura = _this.objestructura.idEstructura;
        _this.objCrudCalendario.permitiradicionar = 0;

        _this.objCrudCalendario.eventStore.reload({
            params: {
                arrayautores: Ext.encode(_this.arrayautores),
                arrayinvolucrados: Ext.encode(_this.arrayinvolucrados),
                idEstructura: _this.objestructura.idEstructura,
                start: _this.objCrudCalendario.pcalendario.getActiveView().viewStart.format('d/m/Y'),
                end: _this.objCrudCalendario.pcalendario.getActiveView().viewEnd.format('d/m/Y')
            }
        });
    }
    //crando arbol de estructuras
    this.tpEstructuras = _this.objestructura.CrearArbolEstructura(_this.stCmbProyecto, null, _this.pCalendario, _this.actualizarBarraHerramientas);

    //panel de las estructuras
    this.pEstructura = new Ext.Panel({
        title: 'Estructuras',
        id: 'estructuraVC',
        layout: 'fit',
        collapsible: true,
        collapsed: false,
        width: 280,
        region: 'west',
        items: [_this.tpEstructuras]
    });

    //ventana principal de la vista
    this.WinPrincipal = new Ext.Window({
        layout: 'border',
        closable: false,
        graggable: false,
        maximized: opcionesConfig.maxWinPrincipal,
        modal: true,
        width: 1000,
        height: 510,
        items: [_this.pOpcionesDeBusqueda, _this.pEstructura, _this.pCalendario],
        buttons: [
            {
                text: 'Cerrar',
                tooltip: 'Cerrar ventana',
                hidden: opcionesConfig.noUsarCerrarWinP,
                iconCls: 'cerrar',
                handler: function() {
                    _this.WinPrincipal.hide();
                }
            }
        ]
    });

    this.CargarCmpCalendario = function(idelemento, tipoelemento, parentelemento, AccionesAlRelacionar) {
        _this.AccionesAlRelacionar = AccionesAlRelacionar;
        _this.idelementohijo = idelemento;
        _this.tipoelementohijo = tipoelemento;
        if (parentelemento == 'padre') {
            _this.idelementopadre = idelemento;
            _this.tipoelementopadre = tipoelemento;
        }
        _this.WinPrincipal.show();
        var objcalendario = _this.objCrudCalendario.CargarCmpCrudCalendario();
        //console.log(objcalendario);
        _this.pCalendario.add(objcalendario);
        _this.pCalendario.doLayout();
    };

    this.BuscarActividadesCalendario = function() {

        _this.arrayautores = _this.objclasificadorinvol.ObtenerAutoresBusqueda();
        _this.arrayinvolucrados = _this.objclasificadorinvol.ObtenerInvolucradosBusqueda();

        _this.pOpcionesDeBusqueda.collapse();
        _this.objCrudCalendario.eventStore.reload({
            params: {
                arrayautores: Ext.encode(_this.arrayautores),
                arrayinvolucrados: Ext.encode(_this.arrayinvolucrados),
                idEstructura: _this.objCrudCalendario.idEstructura,
                idproyecto: _this.objCrudCalendario.idproyecto,
                idhito: _this.objCrudCalendario.idhito,
                start: _this.objCrudCalendario.pcalendario.getActiveView().viewStart.format('d/m/Y'),
                end: _this.objCrudCalendario.pcalendario.getActiveView().viewEnd.format('d/m/Y')
            }
        });
    };

    this.LimpiarCalendarioBusq = function() {
        _this.arrayautores = [];
        _this.arrayinvolucrados = [];
        _this.objclasificadorinvol.ResetearArbolesBusqueda();
        _this.pOpcionesDeBusqueda.collapse();
        _this.objCrudCalendario.eventStore.reload({
            params: {
                idEstructura: _this.objCrudCalendario.idEstructura,
                idproyecto: _this.objCrudCalendario.idproyecto,
                idhito: _this.objCrudCalendario.idhito,
                start: _this.objCrudCalendario.pcalendario.getActiveView().viewStart.format('d/m/Y'),
                end: _this.objCrudCalendario.pcalendario.getActiveView().viewEnd.format('d/m/Y')
            }
        });
    };

    this.PostAccionesGestionar = function() {
        //var arrayautores = _this.objclasificadorinvol.ObtenerAutoresBusqueda();
        _this.objCrudCalendario.eventStore.load({
            params: {
                arrayautores: Ext.encode(_this.arrayautores),
                arrayinvolucrados: Ext.encode(_this.arrayinvolucrados),
                idhito: _this.cbAgruparPorHistos.getValue(),
                start: _this.objCrudCalendario.pcalendario.getActiveView().viewStart.format('d/m/Y'),
                end: _this.objCrudCalendario.pcalendario.getActiveView().viewEnd.format('d/m/Y')
            }
        });
    };

    this.Refresh = function() {
        //var arrayautores = _this.objclasificadorinvol.ObtenerAutoresBusqueda();
        _this.objCrudCalendario.eventStore.load({
            params: {
                arrayautores: Ext.encode(_this.arrayautores),
                arrayinvolucrados: Ext.encode(_this.arrayinvolucrados),
                start: _this.objCrudCalendario.pcalendario.getActiveView().viewStart.format('d/m/Y'),
                end: _this.objCrudCalendario.pcalendario.getActiveView().viewEnd.format('d/m/Y')
            }
        });
    };

};


