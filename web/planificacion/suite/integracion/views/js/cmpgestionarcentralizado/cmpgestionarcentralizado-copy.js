Utilidades.Cmp.Cmpgestionaractividades = function (opcionesConfig) {

    var _this = this;
    Ext.Ajax.timeout = 1000000000;
    this.idcmp = opcionesConfig.idcmp;
    this.prevrow = -1;
    this.idtipodocumento = 3;
    this.idaprobdiferentes = 0;
    this.eshija = 0;
    this.actpadre = null;
    this.busqueda = 0;
    this.pgactual = 0;
    this.porcientocumpl = 1;
    this.horainicio = '08:00';
    this.horafin = '17:00';
    this.posteliminar = false;

    this.objHistorial = new Utilidades.Cmp.Cmphistorial({mostrarVentana: false, panel: 'act'});

    //componente para el manejo de los mensajes de errores de texto regido
    this.ObjValidaciones = new Utilidades.Cmp.Cmpvalidaciones();

    //objeto CRUD-ACTIVIDADES inicializado
    this.objCrudActividad = new Utilidades.Cmp.Cmpcrudactividades();

    //objeto del componente observaciones inicializado
    this.objCmpObservaciones = new Utilidades.Cmp.Cmpgestionarobservaciones();

    //objeto del componente puntualizacion
    this.objCmpPuntualizacion = new Utilidades.Cmp.CmpPuntualizacion({
        Mostrartitle: 'Registro de puntualizaciones',
        closeableWinPrincipal: true,
        noUsarModifcar: false,
        noUsarComparar: false,
        noUsarAprobar: true,
        noUsarDenegar: true
    });

    //objeto del componente "clasificador de involucrados"
    this.objclasificadorinvol = new Utilidades.Cmp.Cmpclasificadorinvol();

    //objeto del componente "barra de progreso"
    this.BarraProgreso = new BarraEstado();

    //objeto del componente "relaciones"
    this.objcmprelaciones = new Utilidades.Cmp.Cmprelaciones();

    //objeto del componente "pareto"
    this.objgraficas = new Utilidades.Cmp.Cmpgestionargraficas();

    //objeto de configuraci'on de perfil el que esta en plan
    this.objconfiguracionperfil = new Utilidades.Cmp.Cmpconfigurarperfil({
        mostrarVentana: false,
        panel: 'act',
        ocultarBotonSeleccionar: true
    });

    //objeto del componente "exportarimportar"
    this.cmpexpimp = new Utilidades.Cmp.Cmpexportarimportar();

    //objeto del componente "crud monitoreo"
    this.cmpcrudmonitoreo = new Utilidades.Cmp.Cmpcrudmonitoreo();

    //objeto del componente "exportarimportar"
    this.objCmpNotificaciones = new Utilidades.Cmp.CmpNotificaciones(
        {
            MostrarFiltroPorTipoElem: true,
            UsarBtnCerrar: false,
            maxWinPrincipal: false,
            closeableWinPrincipal: true,
            Mostrartitle: 'Registro de notificaciones'
        });

    //variables 
    this.opcionBusqueda = 3;
    this.arrayidactividades = [];
    this.arrayidactividadesReorganizar = [];
    this.arrayidestadoaprob = [];
    this.arraynombreactividades = [];
    this.arrayactividadesseleccionadas = [];
    this.eshija = 0;
    this.start = 0;
    this.field = '';
    this.dir = '';
    this.idtipoelementotributa = null;
    this.idtipoelementotributasuperior = 0;
    this.permitirmodificar = 0;
    this.permitireliminar = 0;
    this.permitirduplicar = 0;
    this.permitirrelaciones = 0;
    this.permitirreasignar = 0;
    this.permitirreordenarhijos = 0;
    this.permitiractcumplimiento = 0;

    //botones para la gestion
    this.btnAdicionar = new Ext.Button({
        handler: function () {
            if (_this.arrayactividadesseleccionadas.length == 0) {
                _this.eshija = 0;
                _this.objCrudActividad.CrearWinCrudActividades(
                    new Date().format('d/m/Y'),
                    new Date().format('d/m/Y'),
                    _this.horainicio,
                    _this.horafin,
                    'Adicionar',
                    _this.PostAccionesGestionar,
                    _this.arrayidactividades,
                    null,
                    _this.eshija,
                    permisomodificar = 1,
                    permisoeliminar = 1,
                    _this.objcmprelaciones.ObtenerElementosRelacionadosIniciales(),
                    _this.smTGCmpActividades,
                    _this.stTGCmpActividades,
                    null,
                    _this.porcientocumpl,
                    _this.actpadre,
                    null,
                    null,
                    true
                );
            } else if (_this.arrayactividadesseleccionadas.length == 1) {
                _this.eshija = 1;
                _this.objCrudActividad.CrearWinCrudActividades(
                    new Date().format('d/m/Y'),
                    new Date().format('d/m/Y'),
                    _this.horainicio,
                    _this.horafin,
                    'Adicionar',
                    _this.PostAccionesGestionar,
                    _this.arrayidactividades,
                    null,
                    _this.eshija,
                    permisomodificar = 1,
                    permisoeliminar = 1,
                    _this.objcmprelaciones.ObtenerElementosRelacionadosIniciales(),
                    _this.smTGCmpActividades,
                    _this.stTGCmpActividades, null,
                    _this.porcientocumpl,
                    _this.actpadre,
                    _this.smTGCmpActividades.getSelected().id);
            }
            //Ext.getCmp('vpGestionContenido').hide();
        },
        hidden: opcionesConfig.noUsarAdicionar,
        disabled: false,
        iconCls: 'adicionar',
        tooltip: 'Adicionar actividad',
        key: {
            alt: true,
            key: 'I'
        },
        scope: this
    });
    this.chinclurepeticiones = new Ext.form.Checkbox({
        boxLabel: 'Incluir repeticiones',
        checked: false,
        fieldLabel: '',
        labelSeparator: '  ',
        listeners: {
            check: function (micheck, iswchecked) {
                _this.stTGCmpActividades.reload();
            }
        }
    });

    this.chinclureasignaciones = new Ext.form.Checkbox({
        boxLabel: 'Incluir reasignaciones',
        checked: false,
        fieldLabel: '',
        labelSeparator: '  ',
        listeners: {
            check: function (micheck, iswchecked) {
                _this.stTGCmpActividades.reload();
            }
        }
    });
    this.btnModificar = new Ext.Button({
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
                _this.smTGCmpActividades.getSelected().data._parent);
        },
        hidden: opcionesConfig.noUsarModificar,
        disabled: true,
        id: 'edilio',
        iconCls: 'modificar',
        tooltip: 'Modificar actividad',
        key: {
            alt: true,
            key: 'M'
        },
        scope: this
    });

    this.btnGraficas = new Ext.Button({
        handler: function () {
            _this.verGraficas(_this.objgraficas.obtenerPanelGraficasDAct());
        },
        iconCls: 'graficar',
        tooltip: 'Estadística'
    });

    this.btnEliminar = new Ext.Button({
        handler: function () {
            _this.eshija = 0;
            _this.objCrudActividad.EliminarActividades(
                _this.arrayidactividades, _this.PostAccionesGestionar,
                _this.smTGCmpActividades, _this.TGCmpActividades);
        },
        hidden: opcionesConfig.noUsarEliminar,
        disabled: true,
        iconCls: 'eliminar',
        tooltip: 'Eliminar actividad',
        key: {
            key: Ext.EventObject.DELETE
        },
        scope: this
    });
    this.btnActivar = new Ext.Button({
        handler: function () {
            /*_this.objCrudPlan.ActivarDesactivarPlan(_this.arrayidplan,_this.PostAccionesGestionar,'activar');*/
        },
        hidden: opcionesConfig.noUsarActivar,
        text: 'Activar',
        disabled: true,
        iconCls: 'habilitar',
        tooltip: 'Activar actividad',
        key: {
            alt: true,
            key: 'X'
        },
        scope: this
    });
    this.btnDesactivar = new Ext.Button({
        handler: function () {
            /*_this.objCrudPlan.ActivarDesactivarPlan(_this.arrayidplan,_this.PostAccionesGestionar,'desactivar');*/
        },
        hidden: opcionesConfig.noUsarDesactivar,
        text: 'Desactivar',
        disabled: true,
        iconCls: 'deshabilitar',
        tooltip: 'Desactivar actividad',
        key: {
            alt: true,
            key: 'F'
        },
        scope: this
    });
    this.btnDuplicar = new Ext.Button({
        disabled: true,
        handler: function () {
            _this.objCrudActividad.AnalizarProcesoDuplicado(
                _this.arrayactividadesseleccionadas[0], _this.PostAccionesGestionar, _this.arrayidactividades,
                _this.objcmprelaciones.ObtenerElementosRelacionadosIniciales());
        },
        iconCls: 'duplicar',
        tooltip: 'Duplicar actividad',
        key: {
            ctrl: true,
            alt: true,
            key: 'D'
        },
        scope: this
    });

    //inicializando el objeto menu dinamico
    if (_this.objcmpmenurelacionesdin) {
        _this.objcmpmenurelacionesdin = null;
    }
    _this.objcmpmenurelacionesdin = new Utilidades.Cmp.CmpMenuRelacionesDinamicas();
    this.btnCambiarEstado = new Ext.Button({
        disabled: true,
        tooltip: 'Cambiar el estado de aprobaci&oacute;n de la(s) actividad(es)',
        iconCls: 'cambiodestado',
        menu: _this.objcmpmenurelacionesdin.menuinicial,
        id: 'btnitmaprov',
        handler: function () {
            _this.objcmpmenurelacionesdin.menuinicial;
            var mensaje = '';
            if (_this.arrayactividadesseleccionadas.length > 1) {
                mensaje = 'No existen otros estados al cual usted pueda cambiar las actividades desde el estado actual.';
            } else {
                mensaje = 'No existen otros estados al cual usted pueda cambiar la actividad desde el estado actual.';
            }
            //actualizar el sub-menu de Cambiar estado
            _this.objcmpmenurelacionesdin.CrearMenuAprobacionConc(
                _this.AccionesPostEjecutarFT, mensaje,
                _this.TGCmpActividades,
                '',
                _this.arrayidactividades,
                _this.arrayidestadoaprob,
                _this.idtipodocumento
            );
        }
    });

    this.btnRelaciones = new Ext.Button({
        disabled: true,
        handler: function () {
            _this.CrearRelaciones();
        },
        iconCls: 'gestionarrelaciones',
        tooltip: 'Relacionar actividad(es)',
        key: {
            ctrl: true,
            key: 'R'
        },
        scope: this
    });

    this.btnControlReagsinacion = new Ext.Button({
        disabled: true,
        tooltip: 'Control de reasignaciones',
        iconCls: 'cambiar',
        handler: function () {
            _this.eshija = 0;
            _this.objCrudActividad.CrearWinCrudActividades(
                new Date().format('d/m/Y'), new Date().format('d/m/Y'),
                _this.horainicio, _this.horafin, 'Control de reasignaciones de la',
                _this.PostAccionesGestionar, _this.arrayidactividades, null,
                _this.eshija, permisomodificar = 1, permisoeliminar = 1,
                _this.objcmprelaciones.ObtenerElementosRelacionadosIniciales(),
                _this.smTGCmpActividades, null, null, null, null, null, _this.permitirreasignar);
        },
        key: {
            ctrl: true,
            key: 'A'
        },
        scope: this
    });

    this.btnGestObs = new Ext.Button({
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
    this.btnPanelBusqueda = new Ext.Button({
        disabled: false,
        iconCls: 'buscar',
        tooltip: 'B&uacute;squeda avanzada de actividad(es)',
        handler: function () {
            _this.pBuscarActividades.toggleCollapse(true);
            _this.tpAutoresInvolucrados.doLayout();
        },
        key: {
            alt: true,
            key: 'B'
        },
        scope: this
    });

    this.btnLimpiar2 = new Ext.Button({
        disabled: false,
        handler: function () {
            //    _this.opcionBusqueda = 4;
            //   _this.CargarActividades();
            //_this.pBuscarActividades.toggleCollapse(false);
            _this.chinclurepeticiones.setValue(false);
            _this.chinclureasignaciones.setValue(false);
            _this.pBuscarActividades.collapse();
            _this.objclasificadorinvol.ResetearArbolesBusqueda();
            _this.smTGCmpActividades.clearSelections();
            _this.cbbtipo.reset();
            _this.cbbcat.reset();
            _this.stTGCmpActividades.setDefaultSort(null);
            _this.stTGCmpActividades.baseParams.arrayautores = '';
            _this.stTGCmpActividades.baseParams.arrayinvolucrados = '';
            if (_this.ftCmpActividades.getFiltrosActivos() == undefined
                || _this.ftCmpActividades.getFiltrosActivos().length == 0) {
                // _this.stTGCmpActividades.reload();
            } else {
                _this.ftCmpActividades.clearFilters();
                /*_this.stTGCmpActividades.reload({
                 params: {
                 anode: null
                 }
                 });*/
            }
        },
        iconCls: 'limpiar',
        tooltip: 'Limpiar filtro(s)',
        key: {
            alt: true,
            key: 'L'
        },
        scope: this
    });

    this.btnBusquedaSimple = new Ext.Button({
        handler: function () {
            _this.btnBusquedaSimple.focus();
            if (_this.fpBuscarActividades.getForm().isValid()) {
                _this.stTGCmpActividades.start = 0;
                _this.stTGCmpActividades.reload({});
            }
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
    this.btnSeleccionar = new Ext.Button({
        handler: function () {
            _this.RelacionarElementos();
        },
        disabled: true,
        text: 'Seleccionar',
        iconCls: 'aceptar',
        tooltip: 'Relacionar actividad(es) seleccionada(s)',
        hidden: opcionesConfig.noUsarSeleccionarWinP,
        key: {
            alt: true,
            key: 'S'
        },
        scope: this
    });
    this.btnPanelTributa = new Ext.Button({
        disabled: false,
        iconCls: 'tributar',
        tooltip: 'Tributar actividad(es)',
        handler: function () {
            _this.pRelacionesIniciales.toggleCollapse(true);
        },
        key: {
            ctrl: true,
            alt: true,
            key: 'T'
        },
        scope: this
    });
    this.btnVerNotif = new Ext.Button({
        disabled: false,
        iconCls: 'notificaciones',
        tooltip: 'Consultar notificaciones generadas',
        handler: function () {
            _this.objCmpNotificaciones.CargarCmpNotificaciones(3);
        },
        key: {
            ctrl: true,
            key: 'O'
        }
    });
    this.btnAyuda = new Ext.Button({
        id: 'btnAyudaCmpGestionarActividades',
        text: 'Ayuda',
        iconCls: 'ayuda',
        hidden: opcionesConfig.noUsarAyuda,
        tooltip: 'Mostrar ayuda de la funcionalidad',
        key: {
            alt: true,
            key: 'H'
        },
        scope: this
    });

    this.btnExportar = new Ext.Button({
        handler: function () {
            if (_this.smTGCmpActividades.getSelected) {
                _this.cmpexpimp.ventanaExportarElemento(_this.TGCmpActividades, _this.smTGCmpActividades, 3);
            }
        },
        disabled: true,
        iconCls: 'exportar',
        tooltip: 'Exportar actividad(es)',
        key: {
            alt: true,
            key: 'E'
        },
        scope: this
    });

    this.btnImportar = new Ext.Button({
        handler: function () {
            _this.cmpexpimp.showCmpImportar(3, _this.TGCmpActividades, _this.PanPrincipal);
        },
        disabled: false,
        iconCls: 'importar',
        tooltip: 'Importar actividad(es)',
        key: {
            ctrl: true,
            alt: true,
            key: 'I'
        },
        scope: this
    });

    this.btnConfPerfil = new Ext.Button({
        handler: function () {
            _this.verConfiguracionperfil(_this.objconfiguracionperfil.Inicializar());
        },
        disabled: false,
        iconCls: 'filtrar',
        tooltip: 'Configurar cargas por defecto',
        key: {
            ctrl: true,
            alt: true,
            key: 'F'
        }
    });

    //btnActCumplimiento
    this.btn100 = new Ext.Button({
        disabled: true,
        iconCls: 'icondistra-bandera sipac-verde',
        tooltip: 'Actualizar actividades al 100% de cumplimiento',
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
        tooltip: 'Actualizar % cumplimiento de la actividad',
        handler: function () {
            _this.actualizarCumplimiento(2);
        },
        key: {
            ctrl: true,
            alt: true,
            key: 'W'
        }
    });
    this.btnAlarma = new Ext.Button({
        disabled: true,
        iconCls: 'gestionarasistencia',
        tooltip: 'Adicionar alarma',
        handler: function () {
            // _this.cmpcrudmonitoreo.CrearWinMonitoreo(
            _this.cmpcrudmonitoreo.CrearWinPrincipal(
                _this.smTGCmpActividades.getSelections()[0].data.idelemento,
                _this.stTGCmpActividades, _this.objclasificadorinvol);
        },
        key: {
            ctrl: true,
            alt: true,
            key: 'B'
        },
        scope: this
    });
    this.btnHistorial = new Ext.Button({
        disabled: true,
        iconCls: 'historial',
        tooltip: 'Consultar historial de la actividad',
        handler: function () {
            _this.verHistorial(_this.objHistorial.Inicializar(_this.smTGCmpActividades.getSelected().id));
        },
        key: {
            ctrl: true,
            alt: true,
            key: 'H'
        },
        scope: this
    });
    this.btnVerDatos = new Ext.Button({
        disabled: true,
        iconCls: 'ver',
        tooltip: 'Ver datos de la actividad',
        handler: function () {
            _this.objCrudActividad.CrearWinCrudActividades(
                new Date().format('d/m/Y'), new Date().format('d/m/Y'),
                _this.horainicio, _this.horafin, 'Ver datos de la',
                _this.PostAccionesGestionar, _this.arrayidactividades,
                null, _this.eshija, permisomodificar = 1, permisoeliminar = 1,
                _this.objcmprelaciones.ObtenerElementosRelacionadosIniciales(),
                _this.smTGCmpActividades);
        },
        key: {
            alt: true,
            key: 'D'
        },
        scope: this
    });
    this.btnReorganizar = new Ext.Button({
        disabled: true,
        iconCls: 'diferenciaconbanco',
        tooltip: 'Reorganizar sub-actividad(es)',
        handler: function () {
            _this.ReorganizarHijos();
        },
        key: {
            ctrl: true,
            alt: true,
            key: 'J'
        },
        scope: this
    });
    this.btnHacerRaiz = new Ext.Button({
        disabled: false,
        iconCls: 'top',
        tooltip: 'Hacer raiz',
        handler: function () {
            var start = (_this.ptbTGCmpActividades.getPageData().activePage - 1) * (_this.ptbTGCmpActividades.cbPageSize.getValue());
            _this.objCrudActividad.HacerRaizActividades(
                _this.arrayidactividades,
                _this.smTGCmpActividades, _this.stTGCmpActividades, start);
        },
        key: {
            ctrl: true,
            key: 'J'
        },
        scope: this
    });

    _this.btnPuntualizar = new Ext.Button({
        disabled: true,
        iconCls: 'contratar',
        tooltip: 'Puntualizar actividad',
        handler: function () {
            _this.objCrudActividad.CrearWinCrudActividades(
                new Date().format('d/m/Y'),
                new Date().format('d/m/Y'),
                _this.horainicio,
                _this.horafin,
                'Puntualizar',
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
                _this.smTGCmpActividades.getSelected().data._parent);
        }
    });

    _this.btnGestPuntualizar = new Ext.Button({
        // disabled: true,
        iconCls: 'contratar',
        tooltip: 'Consultar puntualizaciones',
        handler: function () {
            _this.objCmpPuntualizacion.CargarCmpPuntualizaciones();
        }
    });

    _this.btnRefresh = {
        text: 'Actualizar registro de actividades',
        hidden: true,
        handler: function () {
            var paginado = _this.TGCmpActividades.getBottomToolbar().items;
            paginado.items[0].show();
            paginado.items[1].show();
            paginado.items[2].show();
            paginado.items[3].show();
            paginado.items[4].hide();
            _this.stTGCmpActividades.reload();
        },
        iconCls: 'x-btn-text x-tbar-loading'
    };

    //campo de texto para mostrar el nombre del elemento al cual estamos tributando directamente
    this.tfElementoATributar = new Ext.form.TextField({
        emptyText: ' Seleccione el elemento al cual va a tributar',
        width: 570,
        listeners: {
            focus: function (t) {
                _this.objcmprelaciones.CrearCmpRelacionesIniciales();
            }
        }
    });

    //store del combo del filtro por estados de aprobacion
    this.stestados = new Ext.data.Store(
        {
            baseParams: {
                idtipodoc: 3
            },
            url: '/planificacion/pdo/plan/index.php/cmpgestionarelementos/cargarcmbestados',
            reader: new Ext.data.JsonReader(
                {
                    id: 'idestado',
                    root: "data"
                }, [{
                    name: 'idestado'
                }, {
                    name: 'denominacion'
                }])
        });
    //combo del filtro por estados de aprobacion
    this.cbestados = new Ext.form.ComboBox({
        fieldLabel: 'Estado',
        store: _this.stestados,
        valueField: 'idestado',
        displayField: 'denominacion',
        triggerAction: 'all',
        editable: false,
        loadingText: 'Cargando datos',
        forceSelection: true,
        mode: 'remote',
        emptyText: 'Seleccione',
        width: 580,
        listeners: {
            select: function (cb, record, index) {
                _this.opcionBusqueda = 2;
                _this.CargarActividades();
            },
            expand: function (combo) {
                _this.stestados.reload();
            }
        }
    });

    //store del combo del modo de aprobacion-conciliacion
    this.stcbaprob_conc = new Ext.data.SimpleStore({
        fields: ['idac', 'denac'],
        data: [
            [1, 'Sí'],
            [0, 'No']
        ]
    });
    //combo del modo de aprobacion-conciliacion
    this.cbaprob_conc = new Ext.form.ComboBox({
        disabled: opcionesConfig.noUsarCbAprob,
        store: _this.stcbaprob_conc,
        displayField: 'denac',
        typeAhead: true,
        mode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        selectOnFocus: true,
        hiddenName: 'idac',
        valueField: 'idac',
        width: 100,
        emptyText: 'Seleccione',
        listeners: {
            select: function (cb, record, index) {
                if (record.data.idac == 0) {
                    _this.opcionBusqueda = 5;
                    //_this.cbestados.clearValue();
                } else
                    _this.opcionBusqueda = 2;
                _this.CargarActividades();
            }
        }
    });

    //store del treegrid donde se muestran las actividades
    this.stTGCmpActividades = new Ext.ux.maximgb.treegrid.AdjacencyListStore({
        autoLoad: opcionesConfig.noAutoload,
        remoteSort: true,
        url: '/planificacion/pdo/plan/index.php/cmpgestionaractividades/cargaractividades',
        listeners: {
            beforeload: function (st) {
                st.baseParams.idactividad = _this.arrayidactividades[0];
                st.baseParams.eshija = _this.eshija;
                st.baseParams.incluirrepeticiones = _this.chinclurepeticiones.getValue();
                st.baseParams.incluireasignaciones = _this.chinclureasignaciones.getValue();
                st.baseParams.actividadesreorganizar = Ext.encode(_this.arrayidactividadesReorganizar);
                var arrayautores = _this.objclasificadorinvol.ObtenerAutoresBusqueda();
                var arrayinvolucrados = _this.objclasificadorinvol.ObtenerInvolucradosBusqueda();
                st.baseParams.arrayautores = Ext.encode(arrayautores);
                st.baseParams.arrayinvolucrados = Ext.encode(arrayinvolucrados);
                st.baseParams.categact = _this.cbbcat.getValue();
                st.baseParams.tipoact = _this.cbbtipo.getValue();
                st.baseParams.busqueda = _this.busqueda;
                st.baseParams.arrayelementosrelacionados = Ext.encode(_this.objcmprelaciones.ObtenerElementosRelacionadosIniciales())
            },
            load: function (store, record, options) {
                if (_this.TGCmpActividades.getStore().getCount() == 0 && !_this.posteliminar) {
                    if (_this.ftCmpActividades.getFiltrosActivos() == undefined || _this.ftCmpActividades.getFiltrosActivos().length == 0) {
                        mostrarMensaje(1, 'No existen datos que mostrar.');
                    } else {
                        mostrarMensaje(1, 'No existen datos que se correspondan con los criterios de búsqueda especificados.');
                    }
                }
                _this.posteliminar = false;
                if (_this.arrayidactividadesReorganizar == null || _this.arrayidactividadesReorganizar.lenght == 0) {
                }
                _this.ActualizarEstadoBarraHerramientas();
                if (_this.smTGCmpActividades.hasSelection()) {
                    _this.TGCmpActividades.getView().refresh(true);
                }
                _this.changeTitleActividades();
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
            name: 'idestadoaprob'
        }, {
            name: 'nombreestadoaprob'
        }, {
            name: 'generacontrol'
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
            name: 'tienealarma'
        }, {
            name: 'duracion'
        }, {
            name: 'horainicio'
        }, {
            name: 'categoria'
        }, {
            name: 'tipoactividad'
        }])
    });

    //barra de paginado del treegrid donde se muestran las actividades
    this.ptbTGCmpActividades = new Ext.ux.maximgb.treegrid.PagingToolbar({
        pageSize: 15,
        store: _this.stTGCmpActividades,
        displayInfo: true,
        listeners: {
            beforechange: function (paginado, evento) {
                _this.start = evento.start;
            }
        }
    });

    //modo de del treegrid donde se muestran las actividades
    this.smTGCmpActividades = new Ext.grid.CheckboxSelectionModel({
        singleSelect: opcionesConfig.singlemodoSeleccionGridActividades,
        listeners: {
            rowselect: function (sm, indiceFila, record) {

                if (_this.prevrow >= 0 && _this.prevrow != indiceFila) {
                    var miGet = Ext.get(_this.TGCmpActividades.getView().getRow(_this.prevrow));
                    if (miGet)
                        miGet.removeClass('superior2');
                    var miGet2 = Ext.get(_this.TGCmpActividades.getView().getRow(_this.prevrow));
                    if (miGet2)
                        miGet2.addClass('superior');
                }
                if (record.data.superior == 1) {
                    Ext.get(_this.TGCmpActividades.getView().getRow(indiceFila)).removeClass('superior');
                    Ext.get(_this.TGCmpActividades.getView().getRow(indiceFila)).addClass('superior2');
                    _this.prevrow = indiceFila;
                } else
                    _this.prevrow = -1;
                _this.ActualizarEstadoBarraHerramientas();
                if (record.data._parent == null) {
                    _this.eshija = 0;
                    _this.actpadre = record.data.idelemento;
                } else {
                    _this.eshija = 1;
                    _this.actpadre = null;
                }
                if (record.data.actualizarporciento == 1) {
                    _this.porcientocumpl = 0;
                } else
                    _this.porcientocumpl = 1;
            },
            rowdeselect: function (sm, indiceFila, record) {
                if (_this.prevrow >= 0 && _this.prevrow != indiceFila) {
                    Ext.get(_this.TGCmpActividades.getView().getRow(_this.prevrow)).removeClass('superior2');
                    Ext.get(_this.TGCmpActividades.getView().getRow(_this.prevrow)).addClass('superior');
                }
                if (record.data.superior == 1) {
                    Ext.get(_this.TGCmpActividades.getView().getRow(indiceFila)).removeClass('superior');
                    Ext.get(_this.TGCmpActividades.getView().getRow(indiceFila)).addClass('superior2');
                    _this.prevrow = indiceFila;
                } else
                    _this.prevrow = -1;
                _this.ActualizarEstadoBarraHerramientas();
                _this.eshija = 0;
            }
        }
    });

    //plugins para los filtros del grid
    this.ftCmpActividades = new Ext.grid.GridFilters({
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
            type: 'date',
            dataIndex: 'fechainicio'
        }, {
            type: 'date',
            dataIndex: 'fechafin'
        }, {
            type: 'date',
            dataIndex: 'fechacreacion'
        }, {
            type: 'numeric',
            dataIndex: 'gradocumplimiento'
        }, {
            type: 'listado',
            dataIndex: 'nombreestadoaprob',
            idcombo: 'idcbftestado',
            urlcb: '/planificacion/pdo/plan/index.php/cmpgestionaractividades/cargarcmbestados',
            idstore: 'idstespecialidad',
            valueFieldcb: 'idestado',
            displayFieldcb: 'denominacion'
        }, {
            type: 'list',
            dataIndex: 'textocumplimiento',
            options: ['Cumplida', 'Parcialmente cumplido', 'Sin cumplir']
        }, {
            type: 'list',
            dataIndex: 'observaciones',
            options: ['Si', 'No']
        }, {
            type: 'list',
            dataIndex: 'tienedependencias',
            options: ['Si', 'No']
        }, {
            type: 'listado',
            dataIndex: 'categoria',
            idcombo: 'idcategoria',
            urlcb: '/planificacion/pdo/plan/index.php/cmpgestionaractividades/cargarcategoriasactividad',
            idstore: 'idcategoria',
            valueFieldcb: 'idcategoria',
            displayFieldcb: 'denominacion'
        }, {
            type: 'listado',
            dataIndex: 'tipoactividad',
            idcombo: 'idtipo',
            urlcb: '/planificacion/pdo/plan/index.php/cmpgestionaractividades/cargartiposactividad',
            idstore: 'idtipo',
            valueFieldcb: 'idtipo',
            displayFieldcb: 'denominacion'
        }]
    });

    //treegrid donde se muestran las actividades
    this.TGCmpActividades = new Ext.ux.maximgb.treegrid.GridPanel({
        store: _this.stTGCmpActividades,
        master_column_id: 'expandir',
        autoExpandMin: 165,
        stripeRows: true,
        plugins: _this.ftCmpActividades,
        region: 'center',
        sm: _this.smTGCmpActividades,
        margins: '3 3 3 3',
        loadMask: {
            msg: 'Cargando actividades'
        },
        root_title: 'Registro de actividades',
        columns: [_this.smTGCmpActividades,
            {
                header: 'CAR',
                dataIndex: 'idelemento',
                width: 80,
                renderer: function (val) {
                    return val;
                },
                tooltip: 'Código de Acceso Rápido',
                sortable: true
            }, {
                header: "Denominaci&oacute;n",
                id: 'expandir',
                dataIndex: 'denominacion',
                width: 565,
                sortable: true,
                tooltip: 'Denominaci&oacute;n',
                renderer: MostrarImagenTipoElemento
            }, {
                header: 'Duración',
                dataIndex: 'duracion',
                width: 80,
                tooltip: 'Duración en días'

            }, {
                header: 'Fecha de inicio',
                dataIndex: 'fechainicio',
                width: 115,
                tooltip: 'Fecha de inicio',
                sortable: true
            }, {
                header: 'Fecha de fin',
                dataIndex: 'fechafin',
                width: 115,
                tooltip: 'Fecha de fin',
                sortable: true
            }, {
                header: 'Hora de inicio',
                dataIndex: 'horainicio',
                width: 100,
                tooltip: 'Hora de inicio',
                sortable: true
            }, {
                header: 'Fecha de creaci&oacute;n',
                dataIndex: 'fechacreacion',
                width: 115,
                tooltip: 'Fecha de creaci&oacute;n',
                sortable: true,
                hidden: true
            }, {
                header: 'Autor',
                dataIndex: 'nombreautor',
                width: 90,
                sortable: true,
                tooltip: 'Autor',
                renderer: function (val) {
                    return val;
                }
            }, {
                header: "% de cumplimiento",
                dataIndex: 'gradocumplimiento',
                width: 100,
                sortable: true,
                align: 'rigth',
                tooltip: 'Porciento de cumplimiento',
                renderer: function (a) {
                    return a + ' %'
                }
            }, {
                header: "Estado de aprobaci&oacute;n",
                dataIndex: 'nombreestadoaprob',
                width: 130,
                sortable: true,
                tooltip: 'Estado de aprobaci&oacute;n',
                renderer: function (val) {
                    return val;
                }
            }, {
                header: "Estado de cumplimiento",
                dataIndex: 'textocumplimiento',
                width: 130,
                sortable: true,
                tooltip: 'Estado de cumplimiento',
                renderer: MostrarImagenEstadoCumplimiento
            }, {
                header: "Observaciones",
                hidden: opcionesConfig.noMostrarColumObser,
                dataIndex: 'observaciones',
                width: 90,
                sortable: true,
                tooltip: 'Observaciones',
                renderer: MostrarImagenT
            }, {
                header: 'Dependencias',
                dataIndex: 'tienedependencias',
                width: 90,
                tooltip: 'Dependencias',
                renderer: MostrarImagenT
            }, {
                header: 'Categor&iacute;a',
                dataIndex: 'categoria',
                width: 90,
                tooltip: 'Categor&iacute;a de la actividad'
            }, {
                header: 'Tipo de actividad',
                dataIndex: 'tipoactividad',
                width: 100,
                tooltip: 'Tipo de actividad'
            }
        ],
        menuderecho: _this.menuderechoTGCmpActividades,
        listeners: {
            rowcontextmenu: function (grid, row, e) {
                _this.TGCmpActividades.getSelectionModel().selectRow(row);
                //inicializando el objeto menu dinamico
                if (_this.objcmpmenurelacionesdinmd) {
                    _this.objcmpmenurelacionesdinmd = null;
                }
                _this.objcmpmenurelacionesdinmd = new Utilidades.Cmp.CmpMenuRelacionesDinamicas();
                if (_this.menuderechoTGCmpActividades) {
                    _this.menuderechoTGCmpActividades.destroy();
                }
                //menu derecho del grid de actividades
                _this.menuderechoTGCmpActividades = new Ext.menu.Menu({
                    handler: function () {
                    }
                });

                (_this.miadicionar) ? _this.miadicionar.destroy() : null;
                if (_this.arrayactividadesseleccionadas.length == 1) {
                    _this.miadicionar = new Ext.menu.Item({
                        text: 'Adicionar actividad',
                        itemCls: 'x-menu-item icondistra-adicionar',
                        iconCls: 'imagen-none',
                        hideOnClick: true,
                        handler: function () {
                            _this.eshija = 1;
                            _this.objCrudActividad.CrearWinCrudActividades(
                                new Date().format('d/m/Y'), new Date().format('d/m/Y'),
                                _this.horainicio, _this.horafin, 'Adicionar',
                                _this.PostAccionesGestionar, _this.arrayidactividades,
                                null, _this.eshija, permisomodificar = 1, permisoeliminar = 1,
                                _this.objcmprelaciones.ObtenerElementosRelacionadosIniciales(),
                                _this.smTGCmpActividades, _this.stTGCmpActividades, null,
                                _this.porcientocumpl, _this.actpadre,
                                _this.smTGCmpActividades.getSelected().id);
                        }
                    });
                    _this.menuderechoTGCmpActividades.add(_this.miadicionar);
                }

                if (_this.idaprobdiferentes == 0 && _this.subordinados == 1 && _this.mostrarmenuaprob == 1) {
                    var mensaje = '';
                    if (_this.arrayactividadesseleccionadas.length > 1) {
                        mensaje = 'No existen otros estados al cual usted pueda cambiar las actividades desde el estado actual.';
                    } else {
                        mensaje = 'No existen otros estados al cual usted pueda cambiar la actividad desde el estado actual.';
                    }
                    if (_this.mdiaprobacion) {
                        _this.mdiaprobacion.destroy();
                        //_this.objcmpmenurelacionesdin.menuinicial;
                    }
                    _this.mdiaprobacion = new Ext.menu.Item({
                        text: 'Cambiar el estado de aprobaci&oacute;n a',
                        disabled: opcionesConfig.noUsarMenuGrid,
                        itemCls: 'x-menu-item icondistra-cambiodestado',
                        iconCls: 'imagen-none',
                        hideOnClick: false,
                        id: 'itmaprov',
                        menu: _this.objcmpmenurelacionesdinmd.menuinicial,
                        handler: function () {
                        },
                        listeners: {
                            render: function (el) {
                                //actualizar el sub-menu de Cambiar estado
                                _this.objcmpmenurelacionesdinmd.CrearMenuAprobacionConc(
                                    _this.AccionesPostEjecutarFT, mensaje,
                                    _this.TGCmpActividades,
                                    _this.menuderechoTGCmpActividades,
                                    _this.arrayidactividades,
                                    _this.arrayidestadoaprob,
                                    _this.idtipodocumento
                                );
                            }
                        }
                    });
                    _this.menuderechoTGCmpActividades.add(_this.mdiaprobacion);
                }
                if (_this.mimodificar) {
                    _this.mimodificar.destroy();
                }
                if (_this.permitirmodificar == 1) {
                    _this.mimodificar = new Ext.menu.Item({
                        text: 'Modificar actividad',
                        itemCls: 'x-menu-item icondistra-modificar',
                        iconCls: 'imagen-none',
                        handler: function () {
                            // _this.eshija = 0;
                            _this.objCrudActividad.CrearWinCrudActividades(
                                new Date().format('d/m/Y'), new Date().format('d/m/Y'),
                                _this.horainicio, _this.horafin, 'Modificar',
                                _this.PostAccionesGestionar, _this.arrayidactividades,
                                _this.arrayactividadesseleccionadas[0].idautor, _this.eshija,
                                permisomodificar = 1, permisoeliminar = 1,
                                _this.objcmprelaciones.ObtenerElementosRelacionadosIniciales(),
                                _this.smTGCmpActividades);
                        }
                    });
                    _this.menuderechoTGCmpActividades.add(_this.mimodificar);
                }
                if (_this.mieliminar) {
                    _this.mieliminar.destroy();
                }
                if (_this.permitireliminar == 1) {
                    _this.mieliminar = new Ext.menu.Item({
                        text: _this.setTextdeMenus(_this.smTGCmpActividades.getCount(), 'Eliminar'),
                        itemCls: 'x-menu-item icondistra-eliminar',
                        iconCls: 'imagen-none',
                        handler: function () {
                            //_this.eshija = 0;
                            _this.objCrudActividad.EliminarActividades(
                                _this.arrayidactividades, _this.PostAccionesGestionar,
                                _this.smTGCmpActividades, _this.TGCmpActividades);
                        }
                    });
                    _this.menuderechoTGCmpActividades.add(_this.mieliminar);
                }
                if (_this.miduplicar) {
                    _this.miduplicar.destroy();
                }
                if (_this.permitirduplicar == 1) {
                    _this.miduplicar = new Ext.menu.Item({
                        text: 'Duplicar actividad',
                        itemCls: 'x-menu-item icondistra-duplicar',
                        iconCls: 'imagen-none',
                        handler: function () {
                            _this.objCrudActividad.AnalizarProcesoDuplicado(
                                _this.arrayactividadesseleccionadas[0], _this.PostAccionesGestionar,
                                _this.arrayidactividades,
                                _this.objcmprelaciones.ObtenerElementosRelacionadosIniciales());
                        }
                    });
                    _this.menuderechoTGCmpActividades.add(_this.miduplicar);
                }
                if (_this.midatos) {
                    _this.midatos.destroy();
                }
                _this.midatos = new Ext.menu.Item({
                    text: 'Ver datos de la actividad',
                    itemCls: 'x-menu-item icondistra-ver',
                    iconCls: 'imagen-none',
                    handler: function () {
                        //_this.eshija = 0;
                        _this.objCrudActividad.CrearWinCrudActividades(
                            new Date().format('d/m/Y'), new Date().format('d/m/Y'),
                            _this.horainicio, _this.horafin, 'Ver datos de la',
                            _this.PostAccionesGestionar, _this.arrayidactividades,
                            null, _this.eshija, permisomodificar = 1, permisoeliminar = 1,
                            _this.objcmprelaciones.ObtenerElementosRelacionadosIniciales(),
                            _this.smTGCmpActividades);
                    }
                });//Ver datos
                if (_this.mostrardatos) {
                    _this.mostrardatos.destroy();
                }
                _this.mostrardatos = new Ext.menu.Item({
                    text: 'Mostrar detalles',
                    itemCls: 'x-menu-item icondistra-ver',
                    iconCls: 'imagen-none',
                    handler: function () {
                        _this.objCrudActividad.CrearWinCrudActividades(
                            new Date().format('d/m/Y'), new Date().format('d/m/Y'),
                            _this.horainicio, _this.horafin, 'Modificar',
                            _this.PostAccionesGestionar, _this.arrayidactividades,
                            _this.arrayactividadesseleccionadas[0].idautor, _this.eshija,
                            permisomodificar = 1, permisoeliminar = 1,
                            _this.objcmprelaciones.ObtenerElementosRelacionadosIniciales(),
                            _this.smTGCmpActividades);

                    }
                });//Historial
                if (_this.verhistorial) {
                    _this.verhistorial.destroy();
                }
                _this.verhistorial = new Ext.menu.Item({
                    text: 'Consultar historial de la actividad',
                    itemCls: 'x-menu-item icondistra-historial',
                    iconCls: 'imagen-none',
                    handler: function () {
                        _this.verHistorial(_this.objHistorial.Inicializar(_this.smTGCmpActividades.getSelected().id));
                    }
                });//Reasignar
                _this.controlreagsinacion = new Ext.menu.Item({
                    text: 'Control de reasignaciones',
                    itemCls: 'x-menu-item icondistra-cambiar',
                    iconCls: 'imagen-none',
                    handler: function () {
                        //_this.eshija = 0;
                        _this.objCrudActividad.CrearWinCrudActividades(
                            new Date().format('d/m/Y'), new Date().format('d/m/Y'),
                            _this.horainicio, _this.horafin, 'Control de reasignaciones de la',
                            _this.PostAccionesGestionar, _this.arrayidactividades, null,
                            _this.eshija, permisomodificar = 1, permisoeliminar = 1,
                            _this.objcmprelaciones.ObtenerElementosRelacionadosIniciales(),
                            _this.smTGCmpActividades, null, null, null, null, null, _this.permitirreasignar);
                    }
                });
                if (_this.smTGCmpActividades.getCount() == 1) {
                    _this.menuderechoTGCmpActividades.add(_this.midatos);
                    _this.menuderechoTGCmpActividades.add(_this.verhistorial);
                    _this.menuderechoTGCmpActividades.add(_this.controlreagsinacion);
                }//Alarma
                _this.alarma = new Ext.menu.Item({
                    text: 'Adicionar alarma',
                    itemCls: 'x-menu-item icondistra-gestionarasistencia',
                    iconCls: 'imagen-none',
                    handler: function () {
                        _this.cmpcrudmonitoreo.CrearWinPrincipal(
                            _this.smTGCmpActividades.getSelections()[0].data.idelemento,
                            _this.stTGCmpActividades);
                    }
                });
                if (_this.eliminaralarma) {
                    _this.eliminaralarma.destroy();
                }
                _this.eliminaralarma = new Ext.menu.Item({
                    text: 'Eliminar todas las alarmas',
                    itemCls: 'x-menu-item icondistra-eliminar',
                    iconCls: 'imagen-none',
                    handler: function () {
                        _this.cmpcrudmonitoreo.EliminarAlarma(
                            _this.smTGCmpActividades.getSelections()[0].data.idelemento,
                            _this.stTGCmpActividades);
                    }
                });
                _this.menuderechoTGCmpActividades.add(_this.alarma);
                if (_this.smTGCmpActividades.getSelections()[0].data.tienealarma == 1) {
                    _this.menuderechoTGCmpActividades.add(_this.eliminaralarma);
                }//Relacionar
                if (_this.mirelacionar) {
                    _this.mirelacionar.destroy();
                }
                if (_this.permitirrelaciones == 1) {
                    _this.mirelacionar = new Ext.menu.Item({
                        text: _this.setTextdeMenus(_this.smTGCmpActividades.getCount(), 'Relacionar'),
                        itemCls: 'x-menu-item icondistra-gestionarrelaciones',
                        iconCls: 'imagen-none',
                        handler: function () {
                            _this.CrearRelaciones();
                        }
                    });
                    _this.menuderechoTGCmpActividades.add(_this.mirelacionar);
                }//Reorganizar
                if (_this.mireordenarhijos) {
                    _this.mireordenarhijos.destroy();
                }
                _this.mireordenarhijos = new Ext.menu.Item({
                    text: 'Reorganizar sub-actividad(es)',
                    itemCls: 'x-menu-item icondistra-diferenciaconbanco',
                    iconCls: 'imagen-none',
                    handler: function () {
                        _this.ReorganizarHijos();
                    }
                });
                _this.menuderechoTGCmpActividades.add(_this.mireordenarhijos);
                //Reasignar
                if (_this.mireasignar) {
                    _this.mireasignar.destroy();
                }
                if (_this.permitirreasignar == 1) {
                    _this.mireasignar = new Ext.menu.Item({
                        text: 'Reasignar actividad',
                        itemCls: 'x-menu-item icondistra-cambiar',
                        iconCls: 'imagen-none',
                        handler: function () {
                            _this.objclasificadorinvol.CrearClasificadorReasignacion(
                                _this.arrayidactividades[0], tipoelemento = 3, _this.PostAccionesGestionar);
                        }
                    });
                    _this.menuderechoTGCmpActividades.add(_this.mireasignar);
                }
                e.stopEvent();
                var xy = e.getXY();
                _this.menuderechoTGCmpActividades.showAt(xy);
            },
            rowdblclick: function () {
                //_this.eshija = 0;
                if (_this.permitirmodificar) {
                    _this.objCrudActividad.CrearWinCrudActividades(
                        new Date().format('d/m/Y'), new Date().format('d/m/Y'),
                        _this.horainicio, _this.horafin, 'Modificar',
                        _this.PostAccionesGestionar, _this.arrayidactividades,
                        _this.arrayactividadesseleccionadas[0].idautor, _this.eshija,
                        permisomodificar = 1, permisoeliminar = 1,
                        _this.objcmprelaciones.ObtenerElementosRelacionadosIniciales(),
                        _this.smTGCmpActividades, null, null, _this.porcientocumpl, null,
                        _this.smTGCmpActividades.getSelected().data._parent);
                } else {
                    _this.objCrudActividad.CrearWinCrudActividades(
                        new Date().format('d/m/Y'), new Date().format('d/m/Y'),
                        _this.horainicio, _this.horafin, 'Ver datos de la',
                        _this.PostAccionesGestionar, _this.arrayidactividades,
                        _this.arrayactividadesseleccionadas[0].idautor, _this.eshija,
                        permisomodificar = 1, permisoeliminar = 1,
                        _this.objcmprelaciones.ObtenerElementosRelacionadosIniciales(),
                        _this.smTGCmpActividades, null, null, _this.porcientocumpl);
                }
            }
        },
        tbar: [/*'Aprobaci&oacute;n-conciliaci&oacute;n :', ' ', _this.cbaprob_conc, '-',*/
            _this.chinclurepeticiones, '-', _this.chinclureasignaciones],
        bbar: _this.ptbTGCmpActividades
    });
    _this.setTextdeMenus = function (conteo, accion) {
        if (accion == 'Exportar') {
            if (conteo == 1) {
                return 'Exportar actividad';
            } else
                return 'Exportar actividades';
        } else if (accion == 'Eliminar') {
            if (conteo == 1) {
                return 'Eliminar actividad';
            } else
                return 'Eliminar actividades';
        } else if (accion == 'Relacionar') {
            if (conteo == 1) {
                return 'Relacionar actividad';
            } else
                return 'Relacionar actividades';
        }
    };
    _this.TGCmpActividades.getView().getRowClass = function (ri, n) {
        if (ri.data.superior == 1)
            return "superior";
        else
            return "";
    };

    //store para el combo para la busqueda de actividades por categoria
    this.stCmbCategorias = new Ext.data.Store({
        url: '/planificacion/pdo/plan/index.php/cmpgestionaractividades/cargarcategoriasactividad',
        reader: new Ext.data.JsonReader({
            id: 'idcategoria',
            root: "data"
        }, [{
            name: 'idcategoria'
        }, {
            name: 'denominacion'
        }])
    });
    //combo para la busqueda de actividades por categoria
    this.cbbcat = new Ext.form.ComboBox({
        emptyText: 'Seleccione',
        fieldLabel: 'Categor&iacute;a de la actividad',
        store: _this.stCmbCategorias,
        hiddenName: 'idcategoria',
        valueField: 'idcategoria',
        displayField: 'denominacion',
        triggerAction: 'all',
        editable: true,
        loadingText: 'Cargando datos',
        forceSelection: true,
        mode: 'local',
        anchor: '100%',
        listeners: {
            expand: function (combo) {
                _this.stCmbCategorias.reload();
            }
        }
    });

    //store para el combo para la busqueda de actividades por tipo
    this.stCmbTipo = new Ext.data.Store({
        url: '/planificacion/pdo/plan/index.php/cmpgestionaractividades/cargartiposactividad',
        reader: new Ext.data.JsonReader({
            id: 'idtipo',
            root: "data"
        }, [{
            name: 'idtipo'
        }, {
            name: 'denominacion'
        }])
    });
    //combo para la busqueda de actividades por tipo
    this.cbbtipo = new Ext.form.ComboBox({
        emptyText: 'Seleccione',
        fieldLabel: 'Tipo de actividad',
        store: _this.stCmbTipo,
        hiddenName: 'idtipo',
        valueField: 'idtipo',
        displayField: 'denominacion',
        triggerAction: 'all',
        editable: true,
        loadingText: 'Cargando datos',
        forceSelection: true,
        mode: 'local',
        anchor: '90%',
        listeners: {
            expand: function (combo) {
                _this.stCmbCategorias.reload();
            }
        }
    });

    this.tpAutoresInvolucrados = _this.objclasificadorinvol.CrearClasificadorInvolBusqueda(tipoelemento = 3, 2);

    this.fpBuscarActividades = new Ext.form.FormPanel({
        id: 'fpbusqueda',
        frame: true,
        labelAlign: 'top',
        layout: 'fit',
        items: [_this.tpAutoresInvolucrados/*{
         layout:'column',
         items:[
         {
         columnWidth:.5,
         layout: 'form',
         width:136,
         items:[_this.cbbtipo]
         }, {
         columnWidth:.5,
         layout: 'form',
         width:150,
         items:[this.cbbcat]
         }
         ]
         },_this.tpAutoresInvolucrados*/
        ]
    });

    //panel donde se muestran las opciones de busqueda de actividades
    this.pBuscarActividades = new Ext.Panel({
        title: 'Opciones de b&uacute;squeda',
        layout: 'fit',
        width: 300,
        collapsible: true,
        collapsed: true,
        autoScroll: true,
        margins: '3 3 3 3',
        region: 'east',
        items: [_this.fpBuscarActividades],
        usarKeymap: true,
        botonesKeymap: [_this.btnBusquedaSimple],
        buttons: [_this.btnBusquedaSimple/*, _this.btnLimpiar */],
        listeners: {
            expand: function (p) {
                p.doLayout();
                _this.stCmbCategorias.reload();
                _this.stCmbTipo.reload();
            }
        }
    });

    this.pRelacionesIniciales = _this.objcmprelaciones.CrearCmpRelacionesIniciales(3, function () {
        _this.stTGCmpActividades.reload({
            params: {
                arrayelementosrelacionados: Ext.encode(_this.objcmprelaciones.ObtenerElementosRelacionadosIniciales())
            }
        });
    }, true);

    //panel principal de la vista
    this.PanPrincipal = new Ext.Panel({
        layout: 'border',
        //title: opcionesConfig.nombrePanel,
        region: 'center',
        usarKeymap: true,
        botonesKeymap: [_this.btnAdicionar, _this.btnModificar, _this.btnEliminar,
            _this.btnDuplicar, _this.btnVerDatos, _this.btnRelaciones,
            _this.btnHistorial, _this.btnGestObs, _this.btnExportar,
            _this.btnImportar, _this.btnPanelTributa, _this.btnReorganizar, _this.btnHacerRaiz,
            _this.btnVerNotif, _this.btnAlarma, _this.btnPanelBusqueda, _this.btnGestPuntualizar,
            _this.btnConfPerfil, _this.btn100, _this.btnOtroValor, _this.btnControlReagsinacion,
            _this.btnLimpiar2, _this.btnAyuda],
        tbar: [_this.btnAdicionar, ' ', _this.btnModificar, ' ', _this.btnEliminar,
            ' ', _this.btnCambiarEstado, ' ', _this.btnDuplicar, ' ', _this.btnVerDatos,
            ' ', _this.btnRelaciones, ' ', _this.btnControlReagsinacion, ' ', _this.btnHistorial,
            ' ', _this.btnGestObs, ' ', _this.btnExportar,
            ' ', _this.btnImportar, ' ', _this.btnPanelTributa, ' ', _this.btnReorganizar, ' ', _this.btnHacerRaiz,
            ' ', _this.btnVerNotif, ' ', _this.btnAlarma, ' ', _this.btnPanelBusqueda,
            ' ', _this.btnConfPerfil, ' ', _this.btnGraficas, ' ', _this.btnPuntualizar, ' ', _this.btnGestPuntualizar, ' ',
            _this.btn100,
            ' ', _this.btnOtroValor, ' ', _this.btnLimpiar2, '->', _this.btnAyuda],
        items: [_this.TGCmpActividades, _this.pBuscarActividades]
    });

    //ventana principal de la vista
    this.WinPrincipal = new Ext.Window({
        title: opcionesConfig.nombrePanel,
        layout: 'border',
        constrain: true,
        closable: !opcionesConfig.noUsarCerrarWinP,
        graggable: false,
        maximized: opcionesConfig.maxWinPrincipal,
        modal: true,
        width: 1000,
        height: 510,
        items: [_this.pRelacionesIniciales, _this.PanPrincipal],
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
            _this.btnSeleccionar
        ]
    });
    //funcion donde se procede a cargar el treegrid con las actividades
    this.CargarActividades = function () {
        if (_this.opcionBusqueda == 1 || _this.opcionBusqueda == 2) {
            var arrayautores = _this.objclasificadorinvol.ObtenerAutoresBusqueda();
            var arrayinvolucrados = _this.objclasificadorinvol.ObtenerInvolucradosBusqueda();
            if (_this.opcionBusqueda == 1) {
                if (_this.tfdenominacionBS.getValue() != '' || _this.fechaInicioBS.getValue() != '' || _this.fechaFinBS.getValue() != '' || _this.tfCAR.getValue() != ''
                    || _this.cbbcat.getValue() != '' || _this.cbbtipo.getValue() != '' || arrayautores.length > 0 || arrayinvolucrados.length > 0) {
                    _this.stTGCmpActividades.removeAll();
                    _this.stTGCmpActividades.reload({
                        callback: function () {
                            if (_this.stTGCmpActividades.getTotalCount() == 0) {
                                mostrarMensaje(1, 'No existen datos que se correspondan con los criterios de búsqueda especificados.', function () {
                                    _this.opcionBusqueda = 3;
                                    _this.CargarActividades();
                                });
                                _this.pBuscarActividades.collapse(true);
                            }
                        }
                    });
                } else {
                    mostrarMensaje(1, "Introduzca un criterio de b&uacute;squeda.");
                    return;
                }
            } else {
                _this.stTGCmpActividades.removeAll();
                _this.stTGCmpActividades.reload({
                    params: {
                        enaprobacion: 1
                    },
                    callback: function () {
                        if (_this.stTGCmpActividades.getTotalCount() == 0) {
                            mostrarMensaje(1, 'No existen datos que se correspondan con los criterios de búsqueda especificados.', function () {
                                _this.opcionBusqueda = 4;
                                _this.CargarActividades();
                            });
                        }
                    }
                });
            }
        }
        if (_this.opcionBusqueda == 3 || _this.opcionBusqueda == 4) {
            _this.cbestados.reset();
            _this.cbaprob_conc.clearValue();
            _this.tfdenominacionBS.reset();
            _this.fechaInicioBS.reset();
            _this.fechaFinBS.reset();
            _this.tfCAR.reset();
            _this.objclasificadorinvol.ResetearArbolesBusqueda();
            idestadoaprobacion = null;
            _this.cbbcat.reset();
            _this.cbbtipo.reset();
            _this.stTGCmpActividades.reload({});
        }
        if (_this.opcionBusqueda == 5) {
            _this.stTGCmpActividades.reload({
                params: {
                    enaporbacion: 0
                }
            });
        }
        if (_this.opcionBusqueda != 3) {
            _this.opcionBusqueda = 3;
        }
    };

    //funcion donde se procede a cargar la plantilla
    this.CargarCmpActividades = function (idelemento, tipoelemento, parentelemento, AccionesAlRelacionar, Actreorganizar) {
        _this.AccionesAlRelacionar = AccionesAlRelacionar;
        _this.idelementohijo = idelemento;
        _this.tipoelementohijo = tipoelemento;
        _this.arrayidactividadesReorganizar = Actreorganizar;
        if (parentelemento == 'padre') {
            _this.idelementopadre = idelemento;
            _this.tipoelementopadre = tipoelemento;
        }
        if (opcionesConfig.tipoComponente == 'panel') {
            return _this.PanPrincipal;
        } else if (opcionesConfig.dependenciaTotal || opcionesConfig.dependenciaPorcentual
            || opcionesConfig.dependenciaPuertaAbierta) {
            _this.WinPrincipal.show();
            _this.stTGCmpActividades.reload({
                params: {
                    dependenciaTotal: opcionesConfig.dependenciaTotal,
                    dependenciaPorcentual: opcionesConfig.dependenciaPorcentual,
                    dependenciaPuertaAbierta: opcionesConfig.dependenciaPuertaAbierta,
                    idelementoafiltrar: idelemento
                }
            });
        } else {
            _this.WinPrincipal.show();
            _this.cargarConfiguracionPerfil(3);
        }
    };

    this.PostAccionesGestionar = function (mensaje, accion) {
        _this.busqueda = 0;
        switch (mensaje) {
            case 0:
                _this.stTGCmpActividades.reload({
                    params: {
                        anode: null,
                        start: _this.start
                    }
                });
                break;
            case 1:
                var rec = _this.stTGCmpActividades.getById(_this.arrayidactividades[0]);
                if (accion == 'Adicionar') {
                    if (_this.eshija == 1) {
                        if (rec.data._is_leaf && rec.data._parent == null) {
                            _this.PaginaActual(null);
                        }
                        if (rec.data._is_leaf && rec.data._parent != null) {
                            var recparent = _this.stTGCmpActividades.getById(rec.data._parent);
                            _this.RecargarNodo(recparent.id, 0, recparent);
                        }
                        if (!rec.data._is_leaf) {
                            _this.RecargarNodo(rec.id, 0, rec);
                        }
                    } else
                        _this.UltimaPagina();
                } else if (accion == 'Modificar' || accion == 'Duplicar') {
                    if (rec.data._parent != null) {
                        var recparent = _this.stTGCmpActividades.getById(rec.data._parent);
                        _this.RecargarNodo(recparent.id, 0, recparent);
                    } else
                        _this.PaginaActual(null);
                } else if (accion == 'Eliminar') {
                    if (_this.start != 0)
                        _this.posteliminar = true;
                    var totalseleccionados = _this.smTGCmpActividades.getCount();
                    if (totalseleccionados > 1) {
                        _this.PaginaActual(null);
                    } else {
                        if (rec.data._parent == null) {
                            _this.PaginaActual(null);
                        } else {
                            var recparent = _this.stTGCmpActividades.getById(rec.data._parent);
                            _this.RecargarNodo(recparent.id, 0, recparent);
                        }
                    }
                } else if (accion == 'Cancelar-Cerrar') {
                    if (_this.eshija == 1) {
                        if (rec.data._is_leaf && rec.data._parent == null) {
                            _this.PaginaActual(null);
                        }
                        if (rec.data._is_leaf && rec.data._parent != null) {
                            var recparent = _this.stTGCmpActividades.getById(rec.data._parent);
                            _this.RecargarNodo(recparent.id, 0, recparent);
                        }
                        if (!rec.data._is_leaf) {
                            _this.RecargarNodo(rec.id, 0, rec);
                        }
                    } else
                        _this.UltimaPagina();
                } else {
                    //Codigo para Reasignar
                }
                break;
            default:
                _this.PaginaActual(null);
        }
        _this.objCrudActividad.objcmprelaciones.arrayelementosrelacionados = [];
    };

    //Funcion que recarga y exande el nodo.
    this.RecargarNodo = function (anode, start, rec) {
        _this.stTGCmpActividades.reload({
            params: {
                anode: anode,
                start: start
            },
            callback: function () {
                _this.stTGCmpActividades.collapseNode(rec);
                _this.stTGCmpActividades.setNodeLoaded(rec, false);
                _this.stTGCmpActividades.expandNode(rec);
            }
        });
    };

    //Funcion que recarga la pagina actual. Si no hay elementos listados regarga la pagina anterior.
    this.PaginaActual = function (anode) {
        _this.smTGCmpActividades.clearSelections();
        _this.start = (_this.ptbTGCmpActividades.getPageData().activePage - 1) * (_this.ptbTGCmpActividades.cbPageSize.getValue());
        _this.stTGCmpActividades.reload({
            params: {
                anode: anode,
                start: _this.start
            },
            callback: function () {
                if (_this.stTGCmpActividades.getCount() == 0 && _this.start != 0) {
                    _this.start = _this.start - _this.ptbTGCmpActividades.cbPageSize.getValue();
                    _this.stTGCmpActividades.reload({
                        params: {
                            anode: anode,
                            start: _this.start
                        }
                    });
                }
            }
        });
    };

    this.UltimaPagina = function () {
        _this.smTGCmpActividades.clearSelections();
        var numentero = Math.floor(_this.stTGCmpActividades.getTotalCount() / _this.ptbTGCmpActividades.cbPageSize.getValue());
        _this.start = numentero * _this.ptbTGCmpActividades.cbPageSize.getValue();
        _this.stTGCmpActividades.reload({
            params: {
                anode: null,
                start: _this.start
            }
        });
    };

    this.AccionesPostEjecutarFT = function () {
        _this.arrayidactividades = [];
        _this.stTGCmpActividades.reload({});
        _this.ActualizarEstadoBarraHerramientas();
    };

    //
    this.DestruirWinRelacionesMultiples = function () {
        _this.WinRelacionesMultiples.destroy();
    };

    //
    this.CrearRelaciones = function () {
        if (_this.arrayidactividades.length == 1) {
            _this.eshija = 0;
            _this.objCrudActividad.CrearWinCrudActividades(
                new Date().format('d/m/Y'),
                new Date().format('d/m/Y'),
                _this.horainicio,
                _this.horafin,
                'Relacionar elementos a la',
                _this.PostAccionesGestionar,
                _this.arrayidactividades,
                null, _this.eshija,
                permisomodificar = 1,
                permisoeliminar = 1,
                _this.objcmprelaciones.ObtenerElementosRelacionadosIniciales());
        }
        if (_this.arrayidactividades.length > 1) {
            if (_this.WinRelacionesMultiples) {
                _this.WinRelacionesMultiples.destroy();
            }
            _this.WinRelacionesMultiples = _this.objcmprelaciones.CrearCmpRelacionesMultiples(3, _this.arrayidactividades, function () {
            }, _this.DestruirWinRelacionesMultiples);
            _this.WinRelacionesMultiples.show();
        }
    };

    this.ActualizarEstadoBarraHerramientas = function () {
        _this.arrayidactividades = [];
        _this.arrayidestadoaprob = [];
        _this.arraynombreactividades = [];
        _this.arrayactividadesseleccionadas = [];
        _this.btnModificar.disable();
        _this.btnPuntualizar.disable();
        _this.btnReorganizar.disable();
        _this.btnHacerRaiz.disable();
        _this.btnVerDatos.disable();
        _this.btnHistorial.disable();
        _this.btnAlarma.disable();
        _this.btnSeleccionar.disable();
        _this.btnEliminar.disable();
        _this.btnExportar.disable();
        _this.btnDuplicar.disable();
        _this.btnCambiarEstado.disable();
        _this.btnControlReagsinacion.disable();
        _this.btnRelaciones.disable();
        _this.btnGestObs.disable();
        _this.btn100.disable();
        _this.btnOtroValor.disable();
        var idestadoaprob = null;
        _this.idaprobdiferentes = 0;
        _this.mostrarmenuaprob = 0;
        _this.permitirmodificar = 0;
        _this.permitireliminar = 0;
        _this.permitirduplicar = 0;
        _this.permitirrelaciones = 0;
        _this.permitirreasignar = 0;
        _this.permitirreordenarhijos = 0;
        _this.subordinados = 0;
        if (_this.smTGCmpActividades.hasSelection()) {
            var arrayrecords = _this.smTGCmpActividades.getSelections();
            var totalrecords = arrayrecords.length;
            (totalrecords <= 1) ? _this.btnAdicionar.enable() : _this.btnAdicionar.disable();
            if (totalrecords > 0) {
                _this.btnExportar.enable();
                var puedemodificar = 1;
                var puedeeliminar = 1;
                var puedereordenarhijos = 1;
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
                    if (arrayrecords[i].data.modificar == 0) {
                        puedemodificar = 0;
                    }
                    if (arrayrecords[i].data.eliminar == 0) {
                        puedeeliminar = 0;
                    }
                    if (arrayrecords[i].data._parent == null) {
                        puedereordenarhijos = 0;
                    }
                    if (arrayrecords[i].data.subordinado == 0) {
                        subordinados = 0;
                    }
                    _this.arrayidestadoaprob[i] = arrayrecords[i].data.idestadoaprob;
                    _this.arrayidactividades[i] = arrayrecords[i].data.idelemento;
                    _this.arraynombreactividades[i] = arrayrecords[i].data.denominacion;
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
                        idautor: arrayrecords[i].data.idautor
                    };
                    _this.arrayactividadesseleccionadas.push(elementoseleccionado);
                }
                if (totalrecords == 1 && arrayrecords[0].data.superior == 1) {
                    _this.permitirreasignar = 1;
                }
                _this.btnRelaciones.enable();
                _this.permitirrelaciones = 1;
                if (totalrecords == 1) {
                    _this.btnDuplicar.enable();
                    _this.permitirduplicar = 1;
                    _this.btnGestObs.enable();
                    _this.btnVerDatos.enable();
                    _this.btnHistorial.enable();
                    _this.btnAlarma.enable();
                    _this.btnControlReagsinacion.enable();
                }
                if (puedemodificar == 1 && totalrecords == 1) {
                    _this.btnModificar.enable();
                    _this.permitirmodificar = 1;
                    if (arrayrecords[0].data.generacontrol == 1) {
                        _this.btnPuntualizar.enable();
                    }
                }
                if (puedemodificar == 1) {
                    _this.mostrarmenuaprob = 1;
                }
                if (puedeeliminar == 1) {
                    _this.btnEliminar.enable();
                    _this.permitireliminar = 1;
                }
                if (puedereordenarhijos == 1) {
                    _this.permitirreordenarhijos = 1;
                }
                if (subordinados == 1) {
                    _this.subordinados = 1;
                }
                if (totalrecords > 0) {
                    _this.btnSeleccionar.enable();
                    _this.btnReorganizar.enable();
                    if (_this.idaprobdiferentes == 0 && _this.subordinados == 1 && _this.mostrarmenuaprob == 1) {
                        _this.btnCambiarEstado.enable();
                    }
                    if (_this.smTGCmpActividades.getSelected().json._parent != null) {
                        _this.btnHacerRaiz.enable();
                    }
                }
                _this.btn100.enable();
                _this.btnOtroValor.enable();
            }
        }
    };

    //funcion para levantar el componente 'Actividades' para reorganizar actividades hijas
    this.ReorganizarHijos = function () {
        var objcmpact = new Utilidades.Cmp.Cmpgestionaractividades(
            {
                noUsarModificar: true,
                noUsarEliminar: true,
                noUsarActivar: true,
                noUsarDesactivar: true,
                noUsarCerrarWinP: false,
                noUsarSeleccionarWinP: false,
                maxWinPrincipal: false,
                noUsarCbAprob: true,
                noUsarGestObser: true,
                noMostrarColumObser: true,
                singlemodoSeleccionGridActividades: true,
                reordenarHijos: true,
                arraysubactividades: _this.arrayactividadesseleccionadas,
                noUsarMenuGrid: true,
                nombrePanel: 'Registro de actividades'
            });
        var aux = [];
        for (var i = 0; i < _this.smTGCmpActividades.getCount(); i++) {
            aux.push(_this.smTGCmpActividades.getSelections()[i].id);
            if (_this.smTGCmpActividades.getSelections()[i].data._parent != null)
                aux.push(_this.smTGCmpActividades.getSelections()[i].data._parent);
        }
        objcmpact.CargarCmpActividades(idelemento = null, tipoelemento = null, parentelemento = 'hijo', function () {
            _this.arrayidactividades = [];
            _this.smTGCmpActividades.clearSelections();
            var start = _this.ptbTGCmpActividades.getLastStart();
            _this.stTGCmpActividades.reload({
                params: {
                    anode: null,
                    start: _this.start
                }
            });
            _this.ActualizarEstadoBarraHerramientas();
        }, aux);
    };

    //funcion que se ejecuta luego de seleccionar el nuevo elemento padre al cual quieremos reasignarle los elementos hijos
    this.RelacionarElementos = function () {
        if (opcionesConfig.reordenarHijos == true) {
            _this.AccionesAlReordenar(opcionesConfig.arraysubactividades, _this.arrayactividadesseleccionadas, _this.WinPrincipal);
        } else {
            _this.GenerarDependencia(opcionesConfig.idelementoDependencia, _this.WinPrincipal);
        }
    };

    this.AccionesAlReordenar = function (arraysubactividades, arrayactividadespadres, WinPrincipal) {
        var mensaje = '', mensajemascara = '', mensajeconfirmacion = '', mensajeconfirmacion2 = '';
        if (arraysubactividades.length == 1) {
            mensajeconfirmacion = 'La sub-actividad ha sido reordenada satisfactoriamente.';
            mensaje = ' ¿Est&aacute; seguro que quiere reorganizar la sub-actividad seleccionada?';
            mensajemascara = 'Reorganizando sub-actividad';
            mensajeconfirmacion2 = 'No se ha podido reordenar la sub-actividad seleccionada.';
        } else {
            mensajeconfirmacion = 'Las sub-actividades han sido reordenadas satisfactoriamente.';
            mensaje = ' ¿Est&aacute; seguro que quiere reorganizar las sub-actividades seleccionadas?';
            mensajemascara = 'Reorganizando sub-actividades';
            mensajeconfirmacion2 = 'No se han podido reordenar las sub-actividades seleccionadas.';
        }
        mostrarMensaje(2, mensaje, function (btnoprimido) {
            if (btnoprimido == 'ok') {
                _this.BarraProgreso.show(mensajemascara);
                Ext.Ajax.request({
                    url: '/planificacion/pdo/plan/index.php/cmpgestionaractividades/reorganizaractividades',
                    params: {
                        arraysubactividades: Ext.encode(arraysubactividades),
                        arrayactividadespadres: Ext.encode(arrayactividadespadres)
                    },
                    callback: function (options, success, response) {
                        _this.BarraProgreso.hide();
                        responseData = Ext.decode(response.responseText);
                        if (responseData.mensaje == 1) {
                            mostrarMensaje(1, mensajeconfirmacion);
                            WinPrincipal.destroy();
                            _this.arrayidactividadesReorganizar = [];
                            _this.AccionesAlRelacionar();
                        }
                        if (responseData.mensaje == 0) {
                            mostrarMensaje(1, mensajeconfirmacion2, function () {
                                WinPrincipal.destroy();
                                _this.arrayidactividadesReorganizar = [];
                                _this.AccionesAlRelacionar();
                            });
                        }
                    }
                });
            }
        });
    };

    this.GenerarDependencia = function (idelemento, WinPrincipal) {
        var origen = 6;
        if (opcionesConfig.dependenciaPorcentual)
            origen = 7;
        if (opcionesConfig.dependenciaPuertaAbierta)
            origen = 8;
        var aux = [];
        if (idelemento) {
            for (var i = 0; i < _this.smTGCmpActividades.getCount(); i++) {
                aux.push(_this.smTGCmpActividades.getSelections()[i].id);
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
                    origen: origen
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
            for (var i = 0; i < _this.smTGCmpActividades.getCount(); i++) {
                aux.push(_this.smTGCmpActividades.getSelections()[i].data);
            }
            _this.AccionesAlRelacionar(aux, WinPrincipal);
        }
    };
    //funcion para mostrar el icono "activo"
    function MostrarImagenActivo(valor) {
        if (valor == 0) {
            return ' <span><img src="../../../comun/recursos/images/fam/desactivo.png" ></span> ';
        } else {
            return ' <span><img src="../../../comun/recursos/images/fam/activo.png" ></span> ';
        }
    }

    //funcion para mostrar el icono "tipo de elemento"
    function MostrarImagenTipoElemento(valor, m, p) {
        m.attr = 'ext:qtip="<b>' + valor + '</b>"';
        valor = replaceAll(valor, '%', '"');
        if (p.data.tiporepeticion == null || p.data.tiporepeticion == '') {
            //return '<span><img src="../../../comun/recursos/images/fam/act_ejec.png" >' + ' ' + valor + '</span>';
            return '<span class="icondistra-actividades sipac-azul">' + ' ' + valor + '</span>';
        } else {
            return '<span class="icondistra-actividades sipac-naranja">' + ' ' + valor + '</span>';
        }
    }

    function replaceAll(text, busca, reemplaza) {
        while (text.toString().indexOf(busca) != -1)
            text = text.toString().replace(busca, reemplaza);
        return text;
    }

    //funcion para mostrar el icono "estado de cumplimiento"
    function MostrarImagenEstadoCumplimiento(val, b, c) {
        val3 = c.data.gradocumplimiento * 1;
        if (val3 == 0) {
            return '<span class="icondistra-bandera sipac-roja">' + ' ' + val + '</span>';
        }
        if (val3 > 0 && val3 < 95) {
            //return '<span><img src="../../../comun/recursos/images/fam/flag_yellow.png" >' + ' ' + val + '</span>';
            return '<span class="icondistra-bandera sipac-amarilla">' + ' ' + val + '</span>';
        }
        if (val3 >= 95) {
            return '<span class="icondistra-bandera sipac-verde">' + ' ' + val + '</span>';
        }
    }

    //funcion para mostrar el icono "estado de cumplimiento"
    function renderFecha(val) {
        if (val) {
            return (val.substring(8, 10) + ' / ' + val.substring(5, 7) + ' / ' + val.substring(0, 4));
        }
    }

    function MostrarImagenT(val) {
        if (val == 0) {
            return ' ';
        }
        if (val > 0) {
            //return ' <span><center><img src="../../../comun/recursos/images/fam/tick.png" ></center></span>';
            return '<center><span class="icondistra-validaryaceptar sipac-verde"></span></center>';
        }
    }

    //funcion para cambiarle el titulo al grid de Actividades cuando filtre    
    this.changeTitleActividades = function () {
        var filtrado_por = "";
        var sep = "/";
        if ((_this.ftCmpActividades.getFiltrosActivos() == undefined
            || _this.ftCmpActividades.getFiltrosActivos().length == 0)
            && _this.stTGCmpActividades.getSortState() == undefined) {
            _this.PanPrincipal.setTitle(opcionesConfig.nombrePanel);
        } else if (_this.stTGCmpActividades.getSortState() != undefined
            && (_this.ftCmpActividades.getFiltrosActivos() == undefined
            || _this.ftCmpActividades.getFiltrosActivos().length == 0)) {
            _this.field = _this.stTGCmpActividades.getSortState().field;
            _this.dir = _this.stTGCmpActividades.getSortState().direction;
            var atributo = '';
            var direccion = '';
            if (_this.dir == 'DESC')
                direccion = 'descendentemente';
            else
                direccion = 'acendentemente';
            if (_this.field == 'denominacion') {
                atributo = 'Denominación';
            } else if (_this.field == 'idelemento') {
                atributo = 'CAR';
            } else if (_this.field == 'fechainicio') {
                atributo = 'Fecha de inicio';
            } else if (_this.field == 'fechafin') {
                atributo = 'Fecha fin';
            } else if (_this.field == 'gradocumplimiento') {
                atributo = 'Porciento de cumplimiento';
            } else
                atributo = false;
            if (atributo)
                _this.PanPrincipal.setTitle('Registro de actividades <i>- Ordenado ' + direccion + ' por: ' + atributo + '</i>');
            else
                _this.PanPrincipal.setTitle(opcionesConfig.nombrePanel);
        } else {
            for (i = 0; i < _this.ftCmpActividades.getFiltrosActivos().length; i++) {
                var aux = "";
                if (_this.ftCmpActividades.getFiltrosActivos()[i].dataIndex == "denominacion") {
                    aux = 'Denominaci&oacute;n';
                } else if (_this.ftCmpActividades.getFiltrosActivos()[i].dataIndex == "idelemento") {
                    aux = 'CAR';
                } else if (_this.ftCmpActividades.getFiltrosActivos()[i].dataIndex == "fechainicio") {
                    aux = 'Fecha de Inicio';
                } else if (_this.ftCmpActividades.getFiltrosActivos()[i].dataIndex == "fechafin") {
                    aux = 'Fecha de Fin';
                } else if (_this.ftCmpActividades.getFiltrosActivos()[i].dataIndex == "nombreautor") {
                    aux = 'Autor';
                } else if (_this.ftCmpActividades.getFiltrosActivos()[i].dataIndex == "textocumplimiento") {
                    aux = 'Estado de cumplimiento';
                } else if (_this.ftCmpActividades.getFiltrosActivos()[i].dataIndex == "nombreestadoaprob") {
                    aux = 'Estado de aprobaci&oacute;n';
                } else if (_this.ftCmpActividades.getFiltrosActivos()[i].dataIndex == "gradocumplimiento") {
                    aux = 'Porciento de cumplimiento';
                } else {
                    aux = 'Observaciones';
                }
                if (i == _this.ftCmpActividades.getFiltrosActivos().length - 1) {
                    sep = "";
                }
                filtrado_por += aux + sep;
            }
            _this.PanPrincipal.setTitle('Registro de actividades <i>- Filtrado por: ' + filtrado_por + '</i>');
            filtrado_por = "";
        }
    };

    this.cargarConfiguracionPerfil = function (tipoelemento, idcargaspordefecto) {
        _this.BarraProgreso.show('Cargando actividades');
        Ext.Ajax.request({
            url: 'getConfiguracionPerfil',
            params: {
                idconfiguracion: 2,
                idtipoelemento: tipoelemento,
                idcargapordefecto: idcargaspordefecto
            },
            callback: function (options, success, response) {
                //esto es lo ke hizo ariel
                _this.BarraProgreso.hide();
                responseData = Ext.decode(response.responseText);
                if (responseData.ejecutar) {
                    if (responseData.fechainicio != null && responseData.fechainicio != 'undefined') {
                        var dt = new Date(responseData.fechainicio);
                        dt.setDate(dt.getDate() - 1);
                        _this.ftCmpActividades.filters.items[2].dates.after.menu.picker.setValue(dt);
                        //_this.ftCmpActividades.filters.items[2].dates.on.menu.picker.setValue(dt);
                        _this.ftCmpActividades.filters.items[2].active = true;
                    }
                    if (responseData.fechafin != null && responseData.fechafin != 'undefined') {
                        var dt = new Date(responseData.fechafin);
                        dt.setDate(dt.getDate() + 1);
                        _this.ftCmpActividades.filters.items[3].dates.before.menu.picker.setValue(dt);
                        //_this.ftCmpActividades.filters.items[3].dates.on.menu.picker.setValue(dt);
                        _this.ftCmpActividades.filters.items[3].active = true;
                    }
                    if (_this.ftCmpActividades.filters.items[3].active === true && _this.ftCmpActividades.filters.items[2].active === true) {
                        _this.ftCmpActividades.filters.items[2].dates.after.setChecked(true);
                        //  _this.ftCmpActividades.filters.items[2].dates.on.setChecked(true);
                        _this.ftCmpActividades.filters.items[3].dates.before.setChecked(true);
                        // _this.ftCmpActividades.filters.items[3].dates.on.setChecked(true);
                    } else if (_this.ftCmpActividades.filters.items[3].active === true) {
                        _this.ftCmpActividades.filters.items[3].dates.before.setChecked(true);
                        // _this.ftCmpActividades.filters.items[3].dates.on.setChecked(true);
                    } else if (_this.ftCmpActividades.filters.items[2].active === true) {
                        _this.ftCmpActividades.filters.items[2].dates.after.setChecked(true);
                        // _this.ftCmpActividades.filters.items[2].dates.on.setChecked(true);
                    }
                    if (responseData.estadoaprobacion != null && responseData.estadoaprobacion != 'undefined'
                    /*&& _this.stestados.getCount() != 0*/) {
                        _this.ftCmpActividades.filters.items[6].active = true;
                        _this.ftCmpActividades.filters.items[6].setValue(responseData.estadoaprobacion);
                    }
                    if (responseData.porcientocumplimiento != null && responseData.porcientocumplimiento != 'undefined') {
                        _this.ftCmpActividades.filters.items[5].active = true;
                        if (responseData.igual == 1) {
                            _this.ftCmpActividades.filters.items[5].menu.fields.eq.setValue(responseData.porcientocumplimiento);
                        }
                        if (responseData.mayor == 1) {
                            _this.ftCmpActividades.filters.items[5].menu.fields.gt.setValue(responseData.porcientocumplimiento);
                        }
                        if (responseData.menor == 1) {
                            _this.ftCmpActividades.filters.items[5].menu.fields.lt.setValue(responseData.porcientocumplimiento);
                        }
                    }
                    if (responseData.estadocumplimiento != null && responseData.estadocumplimiento != 'undefined') {
                        _this.ftCmpActividades.filters.items[7].active = true;
                        if (responseData.estadocumplimiento == 1) {
                            _this.ftCmpActividades.filters.items[6].setValue('Sin cumplir');
                        } else if (responseData.estadocumplimiento == 2) {
                            _this.ftCmpActividades.filters.items[7].setValue('Parcialmente cumplido');
                        } else if (responseData.estadocumplimiento == 3) {
                            _this.ftCmpActividades.filters.items[7].setValue('Cumplido');
                        }
                    }
                    if (_this.ftCmpActividades.filters.items[6].active !== true)
                        _this.stTGCmpActividades.reload();
                } else {
                    _this.stTGCmpActividades.reload();
                }
            }
        });
    };

    this.ObtenerSmActividades = function () {
        return _this.smTGCmpActividades;
    };
    this.ObtenerStActividades = function () {
        return _this.stTGCmpActividades;
    };
    this.ObtenerGpActividades = function () {
        return _this.TGCmpActividades;
    };

    this.verHistorial = function (panelHistorial) {
        Winhistorial = new Ext.Window({
            layout: 'fit',
            closable: true,
            graggable: false,
            constrain: true,
            maximized: false,
            modal: true,
            closeAction: 'hide',
            width: 640,
            height: 450,
            items: panelHistorial,
            buttons: [
                {
                    text: 'Cerrar',
                    tooltip: 'Cerrar ventana',
                    iconCls: 'cerrar',
                    handler: function () {
                        Winhistorial.hide();
                    }
                }
            ]
        });
        Winhistorial.show();
    };
    this.verConfiguracionperfil = function (panel) {
        Wincargadefecto = new Ext.Window({
            layout: 'fit',
            constrain: true,
            closable: true,
            maximized: false,
            modal: true,
            closeAction: 'hide',
            width: 640,
            height: 450,
            items: [panel],
            buttons: [
                {
                    iconCls: 'cerrar',
                    text: 'Cerrar',
                    tooltip: 'Cerrar ventana sin guardar los datos',
                    handler: function () {
                        Wincargadefecto.hide();
                    }
                }, {
                    iconCls: 'aceptar',
                    text: 'Seleccionar',
                    tooltip: 'Seleccionar carga por defecto y cerrar ventana',
                    handler: function () {
                        if (_this.objconfiguracionperfil.selectionmodel().getSelections().length > 1) {
                            mostrarMensaje(1, 'Debe existir solo una carga por defecto seleccionada.');
                        } else {
                            _this.cargarConfiguracionPerfil(3, _this.objconfiguracionperfil.selectionmodel().getSelections()[0].data.idconfiguracionperfil);
                        }
                        Wincargadefecto.hide();
                    }
                }]
        });
        Wincargadefecto.show();
    };

    this.verGraficas = function (panel) {
        winGraficas = new Ext.Window({
            layout: 'fit',
            title: 'Estadística',
            constrain: true,
            closable: true,
            maximized: false,
            modal: true,
            closeAction: 'hide',
            width: 1200,
            height: 650,
            items: [panel],
            buttons: [
                {
                    iconCls: 'cerrar',
                    text: 'Cerrar',
                    tooltip: 'Cerrar ventana',
                    handler: function () {
                        winGraficas.hide();
                    }
                }]
        });
        winGraficas.show();
    };

    this.actualizarCumplimiento = function (metodo) {
        var msj = '', msjError = '';
        if (_this.arrayidactividades.length == 1) {
            msj = 'La actividad ha sido actualizada satisfactoriamente.';
            msjError = 'La acci&oacute;n no se pudo realizar porque la actividad ' +
                'seleccionada tiene actualizaci&oacute;n autom&aacute;tica.';
        } else {
            msj = 'Las actividades han sido actualizadas satisfactoriamente.';
            msjError = 'La acci&oacute;n no se pudo realizar porque las actividades ' +
                'seleccionadas tienen actualizaci&oacute;n autom&aacute;tica.';
        }
        if (metodo == 1) {
            this.BarraProgreso.show('Actualizando cumplimiento');
            Ext.Ajax.request({
                url: '/planificacion/pdo/plan/index.php/cmpgestionaractividades/actualizarCumplimiento',
                params: {
                    arrayidactividades: Ext.encode(_this.arrayidactividades),
                    metodo: metodo
                },
                callback: function (options, success, response) {
                    _this.BarraProgreso.hide();
                    responseData = Ext.decode(response.responseText);

                    if (responseData.respuesta == 1) {
                        mostrarMensaje(1, msj);
                    }
                    if (responseData.respuesta == 2) {
                        mostrarMensaje(1, msj + ', excepto aquellas seleccionadas con actualizaci&oacute;n autom&aacute;tica.');
                    }
                    if (responseData.respuesta == 3) {
                        mostrarMensaje(1, msjError);
                    }
                    _this.smTGCmpActividades.clearSelections();
                    var start = _this.ptbTGCmpActividades.getLastStart();
                    _this.stTGCmpActividades.reload({
                        params: {
                            anode: null,
                            start: _this.start
                        }
                    });
                    _this.ActualizarEstadoBarraHerramientas();
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
                    new Ext.Button({
                        handler: function () {
                            _this.winActualizarCumplimiento.destroy();
                        },
                        iconCls: 'cancelar',
                        text: 'Cancelar',
                        tooltip: ''
                    }),
                    new Ext.Button({
                        handler: function () {
                            if (Ext.get(_this.idcmp + '_nfActCumplimiento').getValue() < 101
                                && Ext.get(_this.idcmp + '_nfActCumplimiento').getValue() != '') {
                                _this.BarraProgreso.show('Actualizando cumplimiento');
                                Ext.Ajax.request({
                                    url: '/planificacion/pdo/plan/index.php/cmpgestionaractividades/actualizarCumplimiento',
                                    params: {
                                        arrayidactividades: Ext.encode(_this.arrayidactividades),
                                        cumplimiento: Ext.get(_this.idcmp + '_nfActCumplimiento').getValue(),
                                        metodo: metodo
                                    },
                                    callback: function (options, success, response) {
                                        _this.BarraProgreso.hide();
                                        responseData = Ext.decode(response.responseText);
                                        if (responseData.respuesta == 1) {
                                            mostrarMensaje(1, msj);
                                        }
                                        if (responseData.respuesta == 2) {
                                            mostrarMensaje(1, msj + ', excepto aquellas seleccionadas con actualizaci&oacute;n autom&aacute;tica.');
                                        }
                                        if (responseData.respuesta == 3) {
                                            mostrarMensaje(1, msjError);
                                        }
                                        _this.winActualizarCumplimiento.destroy();
                                        _this.smTGCmpActividades.clearSelections();
                                        var start = _this.ptbTGCmpActividades.getLastStart();
                                        _this.stTGCmpActividades.reload({
                                            params: {
                                                anode: null,
                                                start: _this.start
                                            }
                                        });
                                        _this.ActualizarEstadoBarraHerramientas();
                                    }
                                });
                            } else {
                                mostrarMensaje(1, "Existe(n) algún(os) campo(s) con valor(es) incorrecto(s) o vacío(s).");
                            }
                        },
                        iconCls: 'aceptar',
                        text: 'Aceptar',
                        tooltip: ''
                    })
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
    }

};
