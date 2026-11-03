Utilidades.Cmp.Cmpcalendario = function (opcionesConfig) {
    var _this = this;
    this.idcomponente = opcionesConfig.idcomponente;
    this.prevrow = -1;
    this.idtipodocumento = 3;
    this.idaprobdiferentes = 0;
    this.eshija = 0;
    this.busqueda = 0;
    var prevrow = -1;
    var prevrow2 = -1;
    this.configuracion = null;
    var categactivado = 0;
    var tipoactivado = 0;
    var tiponom = null;
    var idelemento = null;

    //objeto CRUD-ACTIVIDADES inicializado
    this.objCrudActividad = new Utilidades.Cmp.Cmpcrudactividades();

    //objeto del componente "clasificador de involucrados"
    this.objclasificadorinvol = new Utilidades.Cmp.Cmpclasificadorinvol();
    this.objclasificadorinvolrepeticiones = new Utilidades.Cmp.Cmpclasificadorinvol();

    //objeto del componente "barra de progreso"
    this.BarraProgreso = new BarraEstado();

    //objeto del componente "relaciones"
    this.objcmprelaciones = new Utilidades.Cmp.Cmprelaciones();

    //objeto del componente "Reporte"
    this.objreporte = new Utilidades.Cmp.Cmpreportes(
        {
            noUsarModificar: false,
            noUsarEliminar: false,
            noUsarActivar: false,
            noUsarDesactivar: false,
            noUsarCerrarWinP: false,
            noUsarSeleccionarWinP: true,
            maxWinPrincipal: false,
            noUsarCbAprob: false,
            noUsarGestObser: false,
            noMostrarColumObser: false,
            singlemodoSeleccionGridPlanes: false,
            noUsarMenuGrid: false,
            closableWinPrincipal: true,
            titleWinPrincipal: 'Reportes'

        });

    //Sentencia para iniciar los tooltip
    Ext.QuickTips.init();

    Ext.IframeWindow = Ext.extend(Ext.Window, {
        onRender: function () {
            this.bodyCfg = {
                tag: 'iframe',
                src: this.src,
                cls: this.bodyCls,
                style: {
                    border: '0px none'
                }
            };
            Ext.IframeWindow.superclass.onRender.apply(this, arguments);
        }
    });

    var crudAdicionarAct = new Ext.IframeWindow({
        id: id,
        width: 640,
        height: 480,
        title: 'Adicionar actividad',
        src: '../cmpcrudactividades/cmpcrudactividades.php',
        listeners: {
            destroy: function () {
                if (this.iframe !== undefined) {
                    this.iframe.remove();
                }

            },
            afterlayout: function (sender, layout) {
                this.positionIframe.defer(1, this);
            }
        }
    });

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

    this.btnReporte = new Ext.Button({
        iconCls: 'crearreporte',
        disabled: false,
        id: "btnReporte",
        tooltip: 'Crear reporte',
        key: {
            alt: true,
            key: 'R'
        },
        scope: this,
        handler: function () {
            var objcalendario = _this.objCrudCalendario.pcalendario.getActiveView().getStartDate();
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
            _this.objreporte.GenerarReporte('vp', {
                calendario: 1,
                valueanno: objcalendario.format('Y'),
                valuenummeses: objcalendario.format('m'),
                textomes: textomes
            });
        }
    });

    this.btnConfigFirma = new Ext.Button({
        iconCls: 'configuracion',
        id: "btnConfigFirma",
        tooltip: 'Configurar el encabezado y pie de firma del reporte',
        disabled: false,
        handler: function () {
            _this.objreporte.CrearVentanaConfiguracion();
        },
        key: {
            ctrl: true,
            alt: true,
            key: 'F'
        },
        scope: this

    });

    this.btnAdicionar = new Ext.Button({
        iconCls: 'adicionar',
        disabled: false,
        id: "btnAdicionar",
        tooltip: 'Adicionar actividad',
        handler: function () {
            _this.objCrudActividad.CrearWinCrudActividades(
                new Date().format('d/m/Y'),
                new Date().format('d/m/Y'),
                '08:00',
                '17:00', 'Adicionar',
                _this.PostAccionesGestionar,
                arrayidactividades = [], null, 0,
                permisomodificar = 1, permisoeliminar = 1,
                _this.objcmprelaciones.ObtenerElementosRelacionadosIniciales(),
                null, null, true);
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
        handler: function () {
            _this.PostAccionesGestionar();
        },
        key: {
            ctrl: true,
            alt: true,
            key: 'Z'
        }
    });

    this.btnBusqueda = new Ext.Button({
        handler: function () {
            _this.BuscarActividadesCalendario();
        },
        text: 'Buscar',
        iconCls: 'buscar',
        tooltip: 'Buscar actividad(es)',
        key: {
            alt: true,
            key: 'B'
        },
        scope: this
    });

    this.btnLimpiarBusq = new Ext.Button({
        handler: function () {
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

    this.btnRefrescarCal = new Ext.Button({
        handler: function () {
        },
        text: '',
        iconCls: 'x-tbar-loading',
        tooltip: 'Refrescar calendario'
    });
    this.btnGuardarCal = new Ext.Button({
        iconCls: 'guardar',
        disabled: false,
        hidden: true,
        id: "btnGuardarCal",
        tooltip: 'Guardar calendario',
        handler: function () {
            _this.guardarCalendario();
        },
        key: {
            alt: true,
            key: 'G'
        }
    });

    //arboles para la busqueda de elementos por autores e involucrados
    this.tpAutoresInvolucrados = _this.objclasificadorinvol.CrearClasificadorInvolBusquedaCalendario(
        tipoelemento = 3, function () {
            //_this.GenerarCalendariosPorUsuarios();
        });

    //Panel de las opciones de busqueda de tareas por categoria
    this.sttgcategact = new Ext.data.Store({
        url: '/planificacion/pdo/configuracion/index.php/gestionarnomencladores/cargarNomencladores',
        reader: new Ext.data.JsonReader(
            {
                id: 'idnom',
                root: 'data',
                totalProperty: 'total'
            }, [{
                name: 'idnom'
            }, {
                name: 'denom'
            }, {
                name: '_parent'
            }, {
                name: '_is_leaf'
            }, {
                name: 'superior'
            }])
    });
    this.smtgcategact = new Ext.grid.CheckboxSelectionModel({
        singleSelect: false,
        listeners: {
            rowselect: function (sm, indice, record) {
                if (prevrow >= 0 && prevrow != indice) {
                    Ext.get(_this.tgcategact.getView().getRow(prevrow)).removeClass('superior2');
                    Ext.get(_this.tgcategact.getView().getRow(prevrow)).addClass('superior');
                }
                if (record.data.superior == 1) {
                    Ext.get(_this.tgcategact.getView().getRow(indice)).removeClass('superior');
                    Ext.get(_this.tgcategact.getView().getRow(indice)).addClass('superior2');
                    prevrow = indice;
                } else
                    prevrow = -1;
            },
            rowdeselect: function (sm, indice, record) {
                if (prevrow >= 0 && prevrow != indice) {
                    Ext.get(_this.tgcategact.getView().getRow(prevrow)).removeClass('superior2');
                    Ext.get(_this.tgcategact.getView().getRow(prevrow)).addClass('superior');
                }
                if (record.data.superior == 1) {
                    Ext.get(_this.tgcategact.getView().getRow(indice)).removeClass('superior');
                    Ext.get(_this.tgcategact.getView().getRow(indice)).addClass('superior2');
                    prevrow = indice;
                } else
                    prevrow = -1;
            }
        }
    });
    this.tgcategact = new Ext.grid.GridPanel({
        store: _this.sttgcategact,
        title: 'Por categor&iacute;a de actividad',
        id: 'tgcategact',
        master_column_id: 'expandir',
        autoExpandColumn: 'expandir',
        stripeRows: true,
        sm: _this.smtgcategact,
        root_title: ' ',
        loadMask: {
            msg: 'Cargando categor&iacute;as de actividad'
        },
        columns: [
            _this.smtgcategact,
            {
                hidden: true,
                dataIndex: 'idnom'
            }, {
                hidden: true,
                dataIndex: 'superior'
            }, {
                id: 'expandir',
                header: 'Denominaci&oacute;n',
                dataIndex: 'denom'
            }],
        listeners: {
            activate: function (p) {
                if (categactivado == 0) {
                    categactivado = 1;
                    tiponom = 2;
                    _this.sttgcategact.removeAll();
                    _this.sttgcategact.load({
                        params: {
                            tiponom: tiponom
                        }
                    });
                }
            }
        }
    });
    _this.tgcategact.getView().getRowClass = function (ri, n) {
        if (ri.data.superior == 1)
            return "superior";
        else
            return "";
    };
    //Panel de las opciones de busqueda de tareas por tipo
    this.smtgtipoact = new Ext.grid.CheckboxSelectionModel({
        singleSelect: false,
        listeners: {
            rowselect: function (sm, indice, record) {
                if (prevrow2 >= 0 && prevrow2 != indice) {
                    Ext.get(_this.tgtipoact.getView().getRow(prevrow2)).removeClass('superior2');
                    Ext.get(_this.tgtipoact.getView().getRow(prevrow2)).addClass('superior');
                }
                if (record.data.superior == 1) {
                    Ext.get(_this.tgtipoact.getView().getRow(indice)).removeClass('superior');
                    Ext.get(_this.tgtipoact.getView().getRow(indice)).addClass('superior2');
                    prevrow2 = indice;
                } else {
                    prevrow2 = -1;
                }
            },
            rowdeselect: function (sm, indice, record) {
                if (prevrow2 >= 0 && prevrow2 != indice) {
                    Ext.get(_this.tgtipoact.getView().getRow(prevrow2)).removeClass('superior2');
                    Ext.get(_this.tgtipoact.getView().getRow(prevrow2)).addClass('superior');
                }
                if (record.data.superior == 1) {
                    Ext.get(_this.tgtipoact.getView().getRow(indice)).removeClass('superior');
                    Ext.get(_this.tgtipoact.getView().getRow(indice)).addClass('superior2');
                    prevrow2 = indice;
                } else
                    prevrow2 = -1;
            }
        }
    });
    this.sttgtipoact = new Ext.data.Store({
        url: '/planificacion/pdo/configuracion/index.php/gestionarnomencladores/cargarNomencladores',
        reader: new Ext.data.JsonReader(
            {
                id: 'idnom',
                root: 'data',
                totalProperty: 'total'
            }, [{
                name: 'idnom'
            }, {
                name: 'denom'
            }, {
                name: '_parent'
            }, {
                name: '_is_leaf'
            }, {
                name: 'superior'
            }])
    });
    this.tgtipoact = new Ext.grid.GridPanel({
        store: _this.sttgtipoact,
        title: 'Por tipo de actividad',
        id: 'tgtipoact',
        master_column_id: 'expandir',
        autoExpandColumn: 'expandir',
        stripeRows: true,
        sm: _this.smtgtipoact,
        root_title: ' ',
        loadMask: {
            msg: 'Cargando tipos de actividad'
        },
        columns: [
            _this.smtgtipoact,
            {
                hidden: true,
                dataIndex: 'idnom'
            }, {
                hidden: true,
                dataIndex: 'superior'
            }, {
                id: 'expandir',
                header: 'Denominaci&oacute;n',
                dataIndex: 'denom'
            }],
        listeners: {
            activate: function (p) {
                if (tipoactivado == 0) {
                    tipoactivado = 1;
                    tiponome = 3;
                    _this.sttgtipoact.removeAll();
                    _this.sttgtipoact.load({
                        params: {
                            tiponom: tiponome
                        }
                    });
                }
            }
        }
    });
    _this.tgtipoact.getView().getRowClass = function (ri, n) {
        if (ri.data.superior == 1)
            return "superior";
        else
            return "";
    };

    //panel donde mustro a que debe de tributar las actividades que salgan en el calendario
    //this.pRelacionesIniciales = _this.objcmprelaciones.CrearCmpRelacionesIniciales(3);

    this.pRelacionesIniciales = _this.objcmprelaciones.CrearCmpRelacionesIniciales(3, null/*, function () {
     _this.stTGCmpActividades.reload({
     params: {
     arrayelementosrelacionados: Ext.encode(_this.objcmprelaciones.ObtenerElementosRelacionadosIniciales())
     }
     });

     }*/, false);

    //tabpanel donde muestro las opciones de busqueda
    this.tpOpcionesDeBusqueda = new Ext.TabPanel({
        activeTab: 0,
        frame: true,
        border: false,
        enableTabScroll: true,
        items: [{
            title: 'Por autores e involucrados',
            layout: 'fit',
            items: [_this.tpAutoresInvolucrados]
        }, _this.tgcategact, _this.tgtipoact, _this.pRelacionesIniciales]
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

    //datepiker para moverse por el calendario
    this.dpcalendario = new Ext.DatePicker({
        cls: 'ext-cal-nav-picker',
        id: 'datepicker-calendar',
        cancelText: 'Cancelar',
        okText: 'Aceptar',
        todayText: 'Hoy',
        buttons: [_this.btnRefrescarCal],
        listeners: {
            'select': {
                fn: function (dp, dt) {
                    Ext.getCmp('local_calendario').setStartDate(dt);
                },
                scope: this
            }
        }
    });

    //nodos hijos por defecto
    _this.defaultRootNodes = [{
        id: 'personal',
        personal: 1,
        text: 'Calendario personal',
        qtip: 'Calendario personal',
        leaf: true
    }, {
        nodeType: 'async',
        id: 3,
        personal: 0,
        text: 'Otros calendarios',
        qtip: 'Otros calendarios',
        expanded: true,
        leaf: false
    }];

    //panel donde muestro el arbol con los calendarios por defecto
    this.tpcalendario = new Ext.tree.TreePanel(
        {
            autoScroll: true,
            border: false,
            root: {
                text: 'Calendarios',
                qtip: 'Calendarios',
                expanded: true,
                id: 1,
                children: _this.defaultRootNodes
            },
            listeners: {
                'checkchange': function (nodo, check) {
                    //_this.listarInvolucradosAct(nodo, check);
                },
                expandnode: function (nodo) {
                    //_this.ChequearInvolucradosDesdeCliente(nodo,'expand',_this.stGInvolucrados);
                },
                click: function (nodo, evento) {
                    _this.objCrudCalendario.getConfiguracionPerfil({actual: 0, idconfiguracion: nodo.id})
                }
            },
            loader: new Ext.tree.TreeLoader({
                singleClickExpand: true,
                dataUrl: '/planificacion/pdo/plan/index.php/cmpcalendarionuevo/cargarcalendariosiniciales',
                listeners: {
                    'beforeload': function (atreeloader, node) {
                        atreeloader.baseParams = {
                            id: node.id,
                            personal: node.attributes.personal
                        };
                    }
                }
            })
        });

    //panel donde muestro el datepicker y el arbol de calendarios
    this.dptpcalendario = new Ext.Panel({
        collapsed: true,
        collapsible: true,
        region: "west",
        autoWidth: true,
        margins: "3 3 3 3",
        items: [_this.dpcalendario, _this.tpcalendario]
    });

    //panel donde muestro los calendarios seleccionados
    this.pCalendario = new Ext.Panel({
        region: "center",
        margins: "3 3 3 3",
        layout: "fit",
        tbar: [_this.btnAdicionar, ' ', _this.btnReporte, ' ', _this.btnConfigFirma, _this.btnActualizar, _this.btnGuardarCal, '->', _this.btnAyuda],
        usarKeymap: true,
        botonesKeymap: [_this.btnAdicionar, _this.btnActualizar, _this.btnReporte, _this.btnConfigFirma, _this.btnAyuda, _this.btnGuardarCal]
    });

    //ventana principal de la vista
    this.WinPrincipal = new Ext.Window({
        layout: 'border',
        closable: false,
        graggable: false,
        maximized: opcionesConfig.maxWinPrincipal,
        noTitle: opcionesConfig.maxWinPrincipal,
        modal: true,
        width: 1000,
        height: 510,
        items: [_this.pOpcionesDeBusqueda, _this.dptpcalendario, _this.pCalendario],
        buttons: [
            {
                text: 'Cerrar',
                tooltip: 'Cerrar ventana',
                hidden: opcionesConfig.noUsarCerrarWinP,
                iconCls: 'cerrar',
                handler: function () {
                    _this.WinPrincipal.hide();
                }
            }
        ]
    });

    //funcion que carga el componente Calendario
    _this.objCrudCalendario = new Utilidades.Cmp.Cmpcrudcalendario({
        id: _this.idcomponente + "_calendario",
        personal: 1,
        busqueda: 0,
        objclasificadorinvol: _this.objclasificadorinvol,
        tgcategact: _this.tgcategact,
        tgtipoact: _this.tgtipoact,
        smtgcategact: _this.smtgcategact,
        smtgtipoact: _this.smtgtipoact,
        objcmprelaciones: _this.objcmprelaciones
    });

    this.CargarCmpCalendario = function (idelemento, tipoelemento, parentelemento, AccionesAlRelacionar) {
        _this.AccionesAlRelacionar = AccionesAlRelacionar;
        _this.idelementohijo = idelemento;
        _this.tipoelementohijo = tipoelemento;
        if (parentelemento == 'padre') {
            _this.idelementopadre = idelemento;
            _this.tipoelementopadre = tipoelemento;
        }
        _this.WinPrincipal.show();
        var objcalendario = _this.objCrudCalendario.CargarCmpCrudCalendario();
        _this.pCalendario.add(objcalendario);
        _this.pCalendario.doLayout();
    };

    this.ObtenerCategoriasActividad = function () {
        var arraycategoriasact = [];
        var arraycategact = _this.smtgcategact.getSelections();
        var totalreccategact = arraycategact.length;
        for (var i = 0; i < totalreccategact; i++) {
            var elemento = new Object;
            elemento.idcategoria = arraycategact[i].data.idnom;
            arraycategoriasact.push(elemento);
            if (arraycategact[i].data._is_leaf == false) {
                _this.tgcategact.getStore().each(function (record) {
                    if (record.data._parent == arraycategact[i].data.idnom) {
                        var elemento2 = new Object;
                        elemento2.idcategoria = arraycategact[i].data.idnom;
                        arraycategoriasact.push(elemento2);
                    }
                });
            }
        }
        return arraycategoriasact;
    };

    this.ObtenerTipoActividad = function () {
        var arraytipoact = [];
        var arraytipoactiv = _this.smtgtipoact.getSelections();
        var totalrectipoact = arraytipoactiv.length;
        for (var i = 0; i < totalrectipoact; i++) {
            var elemento = new Object;
            elemento.idtipoactividad = arraytipoactiv[i].data.idnom;
            arraytipoact.push(elemento);
            if (arraytipoactiv[i].data._is_leaf == false) {
                _this.tgtipoact.getStore().each(function (record) {
                    if (record.data._parent == arraytipoactiv[i].data.idnom) {
                        var elemento2 = new Object;
                        elemento2.idtipoactividad = arraytipoactiv[i].data.idnom;
                        arraytipoact.push(elemento2);
                    }
                });
            }
        }
        return arraytipoact;
    };

    this.BuscarActividadesCalendario = function () {
        var arrayautores = _this.objclasificadorinvol.ObtenerAutoresBusqueda();
        var arrayinvolucrados = _this.objclasificadorinvol.ObtenerInvolucradosBusqueda();
        var arraycategorias = _this.ObtenerCategoriasActividad();
        var arraytipos = _this.ObtenerTipoActividad();
        var arrayelementostributa = _this.objcmprelaciones.ObtenerElementosRelacionadosIniciales();

        console.log('_this.objCrudCalendario.pcalendario', _this.objCrudCalendario.pcalendario);

        _this.pOpcionesDeBusqueda.collapse();
        _this.objCrudCalendario.eventStore.reload({
            params: {
                arrayautores: Ext.encode(arrayautores),
                arrayinvolucrados: Ext.encode(arrayinvolucrados),
                arraycategoriasact: Ext.encode(arraycategorias),
                busqueda: 1,
                personal: 0,
                arraytiposact: Ext.encode(arraytipos),
                arrayelementostributa: Ext.encode(arrayelementostributa),
                start: _this.objCrudCalendario.pcalendario.getActiveView().body.viewStart.format('d/m/Y'),
                end: _this.objCrudCalendario.pcalendario.getActiveView().body.viewEnd.format('d/m/Y')
            }
        });
    };

    this.LimpiarCalendarioBusq = function () {
        _this.objclasificadorinvol.ResetearArbolesBusqueda();
        _this.objcmprelaciones.PostCancelar();
        if (_this.tgcategact) {
            if (_this.tgcategact.getSelectionModel().hasSelection())
                _this.tgcategact.getSelectionModel().clearSelections();
        }
        if (_this.tgtipoact) {
            if (_this.tgtipoact.getSelectionModel().hasSelection())
                _this.tgtipoact.getSelectionModel().clearSelections();
        }
        var arrayautores = _this.objclasificadorinvol.ObtenerAutoresBusqueda();
        var arrayinvolucrados = _this.objclasificadorinvol.ObtenerInvolucradosBusqueda();
        var arraycategorias = _this.ObtenerCategoriasActividad();
        var arraytipos = _this.ObtenerTipoActividad();
        var arrayelementostributa = _this.objcmprelaciones.ObtenerElementosRelacionadosIniciales();
        _this.pOpcionesDeBusqueda.collapse();
        _this.objCrudCalendario.eventStore.reload({
            params: {
                arrayautores: Ext.encode(arrayautores),
                //arrayinvolucrados:Ext.encode(arrayinvolucrados),
                arraycategoriasact: Ext.encode(arraycategorias),
                arraytiposact: Ext.encode(arraytipos),
                //arrayelementostributa:Ext.encode(arrayelementostributa),
                //personal:personal , 
                //busqueda:busqueda ,
                //idcalendario:idcalendario
                start: _this.objCrudCalendario.pcalendario.getActiveView().body.viewStart.format('d/m/Y'),
                end: _this.objCrudCalendario.pcalendario.getActiveView().body.viewEnd.format('d/m/Y')
            }
        });
    };

    this.PostAccionesGestionar = function () {
        var arrayautores = _this.objclasificadorinvol.ObtenerAutoresBusqueda();
        var arraycategorias = _this.ObtenerCategoriasActividad();
        var arraytipos = _this.ObtenerTipoActividad();
        _this.objCrudCalendario.eventStore.reload({
            params: {
                arrayautores: Ext.encode(arrayautores),
                arraycategoriasact: Ext.encode(arraycategorias),
                arraytiposact: Ext.encode(arraytipos),
                start: _this.objCrudCalendario.pcalendario.getActiveView().body.viewStart.format('d/m/Y'),
                end: _this.objCrudCalendario.pcalendario.getActiveView().body.viewEnd.format('d/m/Y')
            }
        });
    };

    this.guardarCalendario = function () {
        _this.BarraProgreso.show('Guardando actividades del calendario');
        Ext.Ajax.request({
            url: '/planificacion/pdo/plan/index.php/cmpcalendarionuevo/CargarElementosCal',
            params: {
                start: _this.objCrudCalendario.pcalendario.getActiveView().body.viewStart.format('d/m/Y'),
                end: _this.objCrudCalendario.pcalendario.getActiveView().body.viewEnd.format('d/m/Y'),
                guardarCal: 1
            },
            callback: function (options, success, response) {
                _this.BarraProgreso.hide();
                responseData = Ext.decode(response.responseText);
                if (responseData.mensaje == 1) {
                    mostrarMensaje(1, 'El calendario se ha guardado satisfactoriamente.', function () {});
                }
                if (responseData.mensaje == 0) {
                    mostrarMensaje(1, 'Ha ocurrido un error al intentar guardar el calendario.', function () {});
                }
            }
        });
    }

};


