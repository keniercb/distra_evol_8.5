Utilidades.Cmp.Cmpgestionaractividades = function (opcionesConfig) {
    var _this = this;
    Ext.Ajax.timeout = 1000000000;
    this.idcmp = opcionesConfig.idcmp;
    this.prevrow = -1;
    this.idtipodocumento = 3;
    this.idaprobdiferentes = 0;
    this.eshija = 0;
    this.vprogresBar = false;
    this.actpadre = null;
    this.hay_suspendidas = false;
    this.busqueda = 0;
    this.pgactual = 0;
	  this.horaslaborables = 24;
    this.porcientocumpl = 1;
    this.horainicio = '08:00';
    this.horafin = '10:00';
    this.posteliminar = false;
	  this.arr_hour = [];
	  this.formatohora = 'H:i';
	  this.hvalorminimo = '00:00';
	  this.hvalormaximo = '23:59';
    this.busqueda = 0;
    this.aprobada = true;

    this.objHistorial = new Utilidades.Cmp.Cmphistorial({mostrarVentana: false, panel: 'act'});

    //componente para el manejo de los mensajes de errores de texto regido
    this.ObjValidaciones = new Utilidades.Cmp.Cmpvalidaciones();

		//objeto del componente actividad---recurso
	this.objactivrecurso = new Utilidades.Cmp.Cmpcrudactividadrecurso();

    //objeto CRUD-ACTIVIDADES inicializado
    this.objCrudActividad = new Utilidades.Cmp.Cmpcrudactividades();

    //objeto del componente observaciones inicializado
    this.objCmpObservaciones = new Utilidades.Cmp.Cmpgestionarobservaciones();

		//objeto de la clase de configuracion de NodeJS
		this.objNodeJS = new Utilidades.Cmp.ServerPortNodeJS();

		// this.socketEvents = new io.connect(_this.objNodeJS.ip_servidor, {port: _this.objNodeJS.port_servidor});
		// _this.socketEvents.on('connect', function () {
		// });
		//
		// setInterval(function () {
		//
		// 		Ext.Ajax.request({
		// 				url: '/planificacion/pdo/plan/index.php/cmpgestionarmonitoreo/verificarAlarma',
		// 				callback: function (options, success, response) {
		// 						responseData = Ext.decode(response.responseText);
		// 						if (responseData.mensaje == 1) {
		// 								_this.socketEvents.emit("verificaralarma");
		// 						}
		// 				}
		// 		});
		// }, 60000); // 60000  == 1 min


    /*********
     * Puntualizaciones
     * ********/

    Ext.Ajax.request({
		    url: '/planificacion/pdo/plan/index.php/cmpgestionaractividades/cargaractividades',
		    params: {
				    idtipoelem: 7,
            start:0,
            limit:1000
		    },
		    callback: function (options, success, response) {
				    var responseData = Ext.decode(response.responseText);

				    if(responseData.total>0){
						    mostrarMensaje(1, '</br>' + 'Tiene '+responseData.total+' puntualizaciones por analizar.', function (btn) {
								    if (btn == 'ok') {
								    } else {
								    }
						    });
            }else{
						    mostrarMensaje(1, "No tiene puntualizaciones para analizar.");
            }
		    }
    });


    //objeto del componente puntualizacion
    this.objCmpPuntualizacion = new Utilidades.Cmp.CmpPuntualizacion({
        Mostrartitle: 'Registro de puntualizaciones',
        closeableWinPrincipal: true,
        noUsarModifcar: false,
        noUsarComparar: false,
        noUsarAprobar: true,
        noUsarDenegar: true
    });


    /**Stores de la busqueda rapida**/

    _this.store_operador_searchrapida = new Ext.data.SimpleStore({
        fields: ['id', 'den'],
        data: [
            ['lt', 'Antes'],
            ['gt', 'Después'],
            ['eq', 'En']
        ]
    });

    _this.store_estado_cumplimiento_searchrapida = new Ext.data.SimpleStore({
        fields: ['id', 'den'],
        data: [
            ['Cumplida', 'Cumplida'],
            ['Parcialmente cumplido', 'Parcialmente cumplido'],
            ['Sin cumplir', 'Sin cumplir']
        ]
    });

    //  Store del combo de cargar estado aprobacion
    _this.store_estado_aprob_searchrapida = new Ext.data.Store({
        url: '/planificacion/pdo/plan/index.php/cmpgestionaractividades/cargarcmbestados',
        autoLoad: true,
        reader: new Ext.data.JsonReader(
            {
                id: 'idestado',
                root: "data"
            },
            [{
                name: 'idestado'
            }, {
                name: 'denominacion'
            }])
    });

    //  Store del combo de cargar categoria
    _this.store_categoria_searchrapida = new Ext.data.Store({
        url: '/planificacion/pdo/plan/index.php/cmpgestionaractividades/cargarcategoriasactividad',
        autoLoad: true,
        reader: new Ext.data.JsonReader(
            {
                id: 'idcategoria',
                root: "data"
            },
            [{
                name: 'idcategoria'
            }, {
                name: 'denominacion'
            }])
    });

    //  Store del combo de cargar tipo actividad
    _this.store_tipo_actividad_searchrapida = new Ext.data.Store({
        url: '/planificacion/pdo/plan/index.php/cmpgestionaractividades/cargartiposactividad',
        autoLoad: true,
        reader: new Ext.data.JsonReader(
            {
                id: 'idtipo',
                root: "data"
            },
            [{
                name: 'idtipo'
            }, {
                name: 'denominacion'
            }])
    });

    /********************************************************/

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
            Mostrartitle: 'Registro de notificaciones',
            noUsarAyuda: true
        });

    //objeto del componente "fondo de tiempo"
    this.objcmpfondodetiempo = new Utilidades.Cmp.Cmpfondodetiempo();



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
            /***
             * Limpiar la relaciones existentes
             * ***/

            /*if (_this.arrayactividadesseleccionadas.length == 0) {*/
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
            /*} else if (_this.arrayactividadesseleccionadas.length == 1) {
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
            }*/
            //Ext.getCmp('vpGestionContenido').hide();
        },
        hidden: opcionesConfig.noUsarAdicionar,
        disabled: false,
        iconCls: 'adicionar',
        tooltip: 'Adicionar actividad',
        id: 'btnAdicionarAct',
        nextTab: 'btnModificarAct',
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
        fieldLabel: '',
        labelSeparator: '  ',
		    checked:true,
        listeners: {
            check: function (micheck, iswchecked) {
                _this.stTGCmpActividades.reload();
            }
        }
    });

    this.chBienestar = new Ext.form.Checkbox({
        boxLabel: 'Bienestar',
        fieldLabel: '',
        labelSeparator: '  ',
		checked:false,
        listeners: {
            check: function (micheck, iswchecked) {
                _this.stTGCmpActividades.reload();
            }
        }
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
    this.btnGraficas = new Ext.Button({
        handler: function () {
            _this.verGraficas(_this.objgraficas.obtenerPanelGraficasDAct());
        },
        iconCls: 'graficar',
        tooltip: 'Estadística',
        id: 'btnEstadisticaAct',
        prevTab: 'btnConfPerfilAct',
        nextTab: 'btnPuntualizarAct'
    });

    this.btnEliminar = new Ext.Button(

        {
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
        id: 'btnEliminarAct',
        prevTab: 'btnModificarAct',
        nextTab: 'btnitmaprov',
        key: {
            key: Ext.EventObject.DELETE
        },
        scope: this
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
                _this.smTGCmpActividades.getSelected().data._parent, _this.permitirreasignar, null,
                _this.arrayactividadesseleccionadas[0].usuario_logueado);
        },
        hidden: opcionesConfig.noUsarModificar,
        disabled: true,
        id: 'btnModificarAct',
        iconCls: 'modificar',
        tooltip: 'Modificar actividad',
        prevTab: 'btnAdicionarAct',
        nextTab: 'btnEliminarAct',
        key: {
            alt: true,
            key: 'M'
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
        id: 'btnDuplicarAct',
        prevTab: 'btnitmaprov',
        nextTab: 'bntVerDatosAct',
        key: {
            ctrl: true,
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
        prevTab: 'btnEliminarAct',
        nextTab: 'btnDuplicarAct',
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
        id: 'btnRelacionarAct',
        prevTab: 'bntVerDatosAct',
        nextTab: 'btnControlReasignacionAct',
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
        id: 'btnControlReasignacionAct',
        prevTab: 'btnRelacionarAct',
        nextTab: 'btnHistorialAct',
        handler: function () {
            if(_this.arrayidactividades.length==1){
                _this.eshija = 0;
                _this.objCrudActividad.CrearWinCrudActividades(
                    new Date().format('d/m/Y'), new Date().format('d/m/Y'),
                    _this.horainicio, _this.horafin, 'Control de reasignaciones de la',
                    _this.PostAccionesGestionar, _this.arrayidactividades, null,
                    _this.eshija, permisomodificar = 1, permisoeliminar = 1,
                    _this.objcmprelaciones.ObtenerElementosRelacionadosIniciales(),
                    _this.smTGCmpActividades, null, null, null, null, null, _this.permitirreasignar);
            }else if(_this.arrayidactividades.length>1){
                _this.objclasificadorinvol.CrearClasificadorReasignacionMultiplesElementos(
                    _this.arrayidactividades, tipoelemento = 3, _this.posReasignar);
            }
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
        id: 'btnGestObsAct',
        prevTab: 'btnHistorialAct',
        nextTab: 'btnExportarAct',
        key: {
            ctrl: true,
            alt: true,
            key: 'G'
        }
    });
    this.btnPanelBusqueda = new Ext.Button({
        disabled: false,
        iconCls: 'buscaravanzada',
        tooltip: 'B&uacute;squeda avanzada de actividad(es)',
        id: 'btnBuscarAct',
        prevTab: 'btnAlarmaAct',
        nextTab: 'btnConfPerfilAct',
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
            _this.busqueda = 0;
            _this.ftCmpActividades.filters.items[11].value.editor.value = '';
            _this.ftCmpActividades.filters.items[11].active = false;

            _this.ftCmpActividades.filters.items[12].value.editor.value = '';
            _this.ftCmpActividades.filters.items[12].active = false;

            _this.ftCmpActividades.filters.items[15].value.editor.value = '';
            _this.ftCmpActividades.filters.items[15].active = false;

            _this.chinclurepeticiones.setValue(false);
            _this.chinclureasignaciones.setValue(false);
            _this.chBienestar.setValue(false);
            _this.pBuscarActividades.collapse(true);
            _this.objclasificadorinvol.ResetearArbolesBusqueda();
            _this.smTGCmpActividades.clearSelections();
            _this.cbbtipo.reset();
            _this.cbbcat.reset();
            _this.stTGCmpActividades.setDefaultSort(null);
            _this.stTGCmpActividades.baseParams.arrayautores = '';
            _this.stTGCmpActividades.baseParams.arrayinvolucrados = '';
            _this.ftCmpActividades.clearFilters();
            _this.objclasificadorinvol.verificarAutoresInvolBusqueda = false;
            _this.btnBusquedaSimple.disable();
        },
        iconCls: 'limpiar',
        tooltip: 'Limpiar filtro(s)',
        id: 'btnLimpiarAct',
        prevTab: 'btnActualizarValorAct',
        nextTab: 'btnAyudaCmpGestionarActividades',
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
                _this.busqueda = 1;
                _this.stTGCmpActividades.reload();
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
        iconCls: 'seleccion ',
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
        id: 'btnTributarAct',
        prevTab: 'btnImportarAct',
        nextTab: 'btnReorganizarAct',
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
        id: 'btnVerNotifAct',
        prevTab: 'btnHaceRaizAct',
        nextTab: 'btnAlarmaAct',
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
        id: 'btnExportarAct',
        prevTab: 'btnGestObsAct',
        nextTab: 'btnImportarAct',
        key: {
            alt: true,
            key: 'E'
        },
        scope: this
    });

    /*this.btnImportar = new Ext.Button({
     handler: function () {
     _this.cmpexpimp.showCmpImportar(3, _this.TGCmpActividades, _this.PanPrincipal);
     },
     disabled: false,
     iconCls: 'importar',
     tooltip: 'Importar actividad(es)',
     id: 'btnImportarAct',
     prevTab: 'btnExportarAct',
     nextTab: 'btnTributarAct',
     key: {
     ctrl: true,
     alt: true,
     key: 'I'
     },
     scope: this
     });

     this.btnImportarActividades = new Ext.Button({
     handler: function () {
     if (_this.wImportarActividades) {
     _this.wImportarActividades.show();
     } else {
     _this.CargarVentanaImportarActividades();
     }

     },
     disabled: false,
     iconCls: 'importar',
     tooltip: 'Importar actividades (Excel)'
     });*/

    /*his.menuImportar = new Ext.Toolbar.MenuButton({
     tooltip: 'Importar',
     iconCls: 'importar',
     disabled: false,
     menu: {
     items: [
     {
     handler: function () {
     _this.cmpexpimp.showCmpImportar(3, _this.TGCmpActividades, _this.PanPrincipal);
     },
     disabled: false,
     iconCls: 'importar',
     tooltip: 'Importar actividad(es)',
     id: 'btnImportarAct',
     prevTab: 'btnExportarAct',
     nextTab: 'btnTributarAct',
     key: {
     ctrl: true,
     alt: true,
     key: 'I'
     },
     scope: this,
     id: 'imporcvs'
     }, {
     text: 'Importar actividades (Excel)',
     handler: function () {
     if (_this.wImportarActividades) {
     _this.wImportarActividades.show();
     } else {
     _this.CargarVentanaImportarActividades();
     }
     },
     disabled: false,
     iconCls: 'importar',
     tooltip: 'Importar actividades (Excel)',
     id: 'importexcel'
     }
     ]
     }
     });*/


    this.btnExpandirPadre = new Ext.Button({
        handler: function () {
            var arrayrecords = [];
            for (var i = 0; i < _this.smTGCmpActividades.getSelections().length; i++)
                if (!_this.smTGCmpActividades.getSelections()[i].data._is_leaf)
                    arrayrecords.push(_this.smTGCmpActividades.getSelections()[i]);
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


    this.btnExportarGrid = new Ext.Button({
        handler: function () {
            if(_this.stTGCmpActividades.getCount()>0){
                _this.TGCmpActividades.saveAs('data:application/vnd.ms-excel;base64,' +
                    _this.TGCmpActividades.Base64(_this.TGCmpActividades.getExcelXml(false, "Listado de actividades")), "Listado_de_actividades.xls");
            }else{
                mostrarMensaje(1, 'No existen datos para exportar.');
            }
        },
        hidden: opcionesConfig.noUsarActivar,
        disabled: false,
        iconCls: 'exportar',
        tooltip: 'Exportar actividades',
        key: {
            alt: true,
            key: 'G'
        },
        scope: this
    });


    this.btnBusquedaRapida = new Ext.Button({
        handler: function () {
            _this.searchRapida();
},
        // hidden: opcionesConfig.noUsarActivar,
        // disabled: true,
        iconCls: 'buscar',
        tooltip: 'B&uacute;squeda r&aacute;pida',
        key: {
            alt: true,
            key: 'R'
        },
        scope: this
    });

	this.btnActualizarParametros = new Ext.Button({
				handler: function () {
						_this.actualizarParametros();
				},
				// hidden: opcionesConfig.noUsarActivar,
				disabled: true,
				iconCls: 'modificar',
				tooltip: 'Actualizar parámetros',
				key: {
						alt: true,
						key: 'P'
				},
				scope: this
		});

	this.btnEnviarCorreo = new Ext.Button({
				handler: function () {
						_this.enviarCorreo();
				},
				// hidden: opcionesConfig.noUsarActivar,
				disabled: true,
				iconCls: 'notificaciones',
				tooltip: 'Notificar por correo',
				key: {
						alt: true,
						key: 'N'
				},
				scope: this
		});

	this.btnGestionDocumentos = new Ext.Button({
				handler: function () {
            var objGestionDocumentos = new Utilidades.Cmp.cmpGestionDocumentos({
                seleccion:_this.smTGCmpActividades.getSelected(),
                idelemento:_this.smTGCmpActividades.getSelected().data.idelemento,
                aprobada:(_this.aprobada)?true:false,
                tipoelemento:3
            });

            objGestionDocumentos.mostarVentana();
				},
				disabled: true,
				iconCls: 'archivo',
				tooltip: 'Gestión de documentos',
				key: {
						alt: true,
						key: 'W'
				},
				scope: this
		});

    this.menuImportar = new Ext.Toolbar.MenuButton({
        id: 'btnImportarAct',
        tooltip: 'Importar',
        iconCls: 'importar',
        disabled: false,
        menu: {
            items: [
                {
                    text: 'Importar actividades (iCal)',
                    handler: function () {
                        _this.cmpexpimp.showCmpImportar(3, _this.TGCmpActividades, _this.PanPrincipal);
                    },
                    disabled: false,
                    iconCls: 'importar',
                    tooltip: 'Importar actividades (iCal)',
                    id: 'btnImportarAct',
                    key: {
                        ctrl: true,
                        alt: true,
                        key: 'I'
                    },
                    scope: this
                }, {
                    text: 'Importar elemento (Excel)',
                    handler: function () {
                        if (_this.wImportarActividades) {
                            _this.wImportarActividades.show();
                        } else {
                            _this.CargarVentanaImportarActividades();
                        }
                    },
                    disabled: false,
                    iconCls: 'importar',
                    tooltip: 'Importar puntualizaciones (Excel)',
                    id: 'btnImportarpuntualizacionesExcel'
                }, {
                    text: 'Descargar formato (Excel)',
                    handler: function () {
                        window.open('../../resources/descargas/IMPORTAR_ACTIVIDADES.xls');
                    },
                    disabled: false,
                    iconCls: 'importar',
                    tooltip: 'Descargar formato (Excel)',
                    id: 'descargarexcel'
                }, {
                    text: 'Descargar Apk DISTRAPLAN',
                    handler: function () {
                        window.open('../../resources/descargas/DISTRAPLAN-comercial.apk');
                    },
                    disabled: false,
                    iconCls: 'importar',
                    tooltip: 'Descargar Apk',
                    id: 'descargarapk'
                }
            ]
        }
    });


    this.btnConfPerfil = new Ext.Button({
        handler: function () {
            _this.objconfiguracionperfil.verConfiguracionperfil(_this.cargarConfiguracionPerfil, 3);
        },
        disabled: false,
        iconCls: 'filtrar',
        tooltip: 'Configurar cargas por defecto',
        id: 'btnConfPerfilAct',
        prevTab: 'btnBuscarAct',
        nextTab: 'btnEstadisticaAct',
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
        id: 'btnActualizar100Act',
        prevTab: 'btnGestPuntualizarAct',
        nextTab: 'btnActualizarValorAct',
        handler: function () {
            _this.actualizarCumplimiento(1);
        },
        key: {
            ctrl: true,
            alt: true,
            key: 'Z'
        }
    });

    this.btnOtroValor = new Ext.Button({
        disabled: true,
        iconCls: 'icondistra-bandera sipac-amarilla',
        tooltip: 'Actualizar % cumplimiento de la actividad',
        id: 'btnActualizarValorAct',
        prevTab: 'btnActualizar100Act',
        nextTab: 'btnLimpiarAct',
        handler: function () {
            _this.actualizarCumplimiento(2);
        }
    });
    this.btnAlarma = new Ext.Button({
        disabled: true,
        iconCls: 'gestionarasistencia',
        tooltip: 'Adicionar alarma',
        id: 'btnAlarmaAct',
        prevTab: 'btnVerNotifAct',
        nextTab: 'btnBuscarAct',
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
        id: 'btnHistorialAct',
        prevTab: 'btnControlReasignacionAct',
        nextTab: 'btnGestObsAct',
        handler: function () {
            _this.objHistorial.verHistorial('act', _this.smTGCmpActividades.getSelected().id);
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
        id: 'bntVerDatosAct',
        prevTab: 'btnDuplicarAct',
        nextTab: 'btnRelacionarAct',
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
        id: 'btnReorganizarAct',
        prevTab: 'btnTributarAct',
        nextTab: 'btnHaceRaizAct',
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
        id: 'btnHaceRaizAct',
        prevTab: 'btnReorganizarAct',
        nextTab: 'btnVerNotifAct',
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
        id: 'btnPuntualizarAct',
        prevTab: 'btnEstadisticaAct',
        nextTab: 'btnGestPuntualizarAct',
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
        iconCls: 'icondistra-contratar sipac-azul',
        tooltip: 'Consultar puntualizaciones',
        id: 'btnGestPuntualizarAct',
        prevTab: 'btnPuntualizarAct',
        nextTab: 'btnActualizar100Act',
        handler: function () {
            _this.objCmpPuntualizacion.CargarCmpPuntualizaciones(_this.stTGCmpActividades);
        }
    });

    _this.btnSuspender = new Ext.Button({
        disabled: true,
        iconCls: 'desaprobar',
        tooltip: 'Suspender actividad',
        id: 'btnSuspenderAct',
        handler: function () {
            // _this.objCrudActividad.CrearWinCrudActividades(
            // 		new Date().format('d/m/Y'),
            // 		new Date().format('d/m/Y'),
            // 		_this.horainicio,
            // 		_this.horafin,
            // 		'Suspender',
            // 		_this.PostAccionesGestionar,
            // 		_this.arrayidactividades,
            // 		_this.arrayactividadesseleccionadas[0].idautor,
            // 		_this.eshija, permisomodificar = 1,
            // 		permisoeliminar = 1,
            // 		_this.objcmprelaciones.ObtenerElementosRelacionadosIniciales(),
            // 		_this.smTGCmpActividades,
            // 		null, null,
            // 		_this.porcientocumpl,
            // 		_this.actpadre,
            // 		_this.smTGCmpActividades.getSelected().data._parent);

            _this.SuspenderActividades();

        }
    });

    _this.btnAsociarInvolAct = new Ext.Button({
        iconCls: 'asociar',
        tooltip: 'Asociar involucrado(s) a la(s) actividad(es)',
        id: 'btnAsociarInvolAct',
        hidden: false,
        disabled: true,
        prevTab: '',
        nextTab: '',
        handler: function () {
            _this.asociarInvolAct();
        },
        key: {
            ctrl: true,
            key: 'K'
        },
        scope: this
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

    this.btnMostrarSubordinacion = new Ext.Button({
        id: 'btnMostrarSubordinacion',
        iconCls: 'estructura',
        disabled: true,
        handler: function () {
            _this.crearVentanaArbolSubordinacion();
        },
        tooltip: 'Visualizar el árbol de subordinaci&oacute;n directa e indirecta',
        key: {
            alt: true,
            key: ''
        },
        scope: this
    });

    this.menuModificarFecha = new Ext.Toolbar.MenuButton({
        tooltip: 'Modificar fecha de inicio de la(s) actividad(es)',
        iconCls: 'calendario',
        disabled: true,
        menu: {
            items: [
                {
                    text: 'Desplazar un d&iacute;a',
                    handler: function () {
                        _this.modificarFechaActividad('dia');
                    },
                    disabled: false,
                    iconCls: 'calendario',
                    tooltip: 'Desplazar hacia un d&iacute;a la fecha de inicio',
                    id: "btnMover1Dia"
                }, {
                    text: 'Desplazar una semana',
                    handler: function () {
                        _this.modificarFechaActividad('semana');
                    },
                    disabled: false,
                    iconCls: 'calendario',
                    tooltip: 'Desplazar hacia una semana la fecha de inicio',
                    id: "btnMover1Semana"
                }, {
                    text: 'Desplazar un mes',
                    handler: function () {
                        _this.modificarFechaActividad('mes');
                    },
                    disabled: false,
                    iconCls: 'calendario',
                    tooltip: 'Desplazar hacia un mes la fecha de inicio',
                    id: "btnMover1Mes"
                }, {
                    text: 'Desplazar un a&ntilde;o',
                    handler: function () {
                        _this.modificarFechaActividad('anno');
                    },
                    disabled: false,
                    iconCls: 'calendario',
                    tooltip: 'Desplazar hacia un a&ntilde;o la fecha de inicio',
                    id: "btnMover1Anno"
                }, {
                    text: 'Mover hacia una fecha',
                    handler: function () {
                        _this.crearVentanaModificarFechaActividad();
                    },
                    disabled: false,
                    iconCls: 'calendario',
                    tooltip: 'Mover hacia una fecha seleccionada la fecha de inicio',
                    id: "btnMoverHaciaFecha"
                }
            ]
        }
    });


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
            url: '/planificacion/pdo/plan/index.php/cmpgestionaractividades/cargarcmbestados',
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
                st.baseParams.bienestar = _this.chBienestar.getValue();
                st.baseParams.actividadesreorganizar = Ext.encode(_this.arrayidactividadesReorganizar);
                var arrayautores = _this.objclasificadorinvol.ObtenerAutoresBusqueda();
                var arrayinvolucrados = _this.objclasificadorinvol.ObtenerInvolucradosBusqueda();
                st.baseParams.arrayautores = Ext.encode(arrayautores);
                st.baseParams.arrayinvolucrados = Ext.encode(arrayinvolucrados);
                st.baseParams.categact = _this.cbbcat.getValue();
                st.baseParams.tipoact = _this.cbbtipo.getValue();
		            st.baseParams.enaprobacion = (_this.cbaprob_conc.getValue()!='')?_this.cbaprob_conc.getValue():0;
                st.baseParams.busqueda = _this.busqueda;
                st.baseParams.arrayelementosrelacionados = Ext.encode(_this.objcmprelaciones.ObtenerElementosRelacionadosIniciales());
                st.baseParams.opciontributar = _this.objcmprelaciones.obtenerOpcionTributar()
            },
            expandnode: function (record, ev) {
                var rowIndex = record.find('idelemento', _this.arrayidactividades[0]);
                _this.TGCmpActividades.getView().focusRow(rowIndex + parseInt(_this.TGCmpActividades.view.el.getHeight() / 29));
            },
            load: function (store, record, options) {
                if (_this.TGCmpActividades.getStore().getCount() == 0 && !_this.posteliminar) {
                    var arrayautoresbusq = _this.objclasificadorinvol.ObtenerAutoresBusqueda();
                    var arrayinvolucradosbusq = _this.objclasificadorinvol.ObtenerInvolucradosBusqueda();
                    if ((_this.ftCmpActividades.getFiltrosActivos() == undefined || _this.ftCmpActividades.getFiltrosActivos().length == 0)
                        && arrayautoresbusq.length == 0 && arrayinvolucradosbusq.length == 0) {
                        mostrarMensaje(1, 'No existen datos que mostrar.');
                    } else {
                        mostrarMensaje(1, 'No existen datos que se correspondan con los criterios de búsqueda especificados.');
                    }
                }
                _this.posteliminar = false;
                //if (_this.arrayidactividadesReorganizar == null || _this.arrayidactividadesReorganizar.lenght == 0) {}
                _this.ActualizarEstadoBarraHerramientas();
                if (_this.smTGCmpActividades.hasSelection()) {
                    _this.TGCmpActividades.getView().refresh(true);
                }
                _this.changeTitleActividades();

                /*_this.ftCmpActividades.filters.items[7].active = true;
                 _this.ftCmpActividades.filters.items[7].setValue('Sin cumplir');
                 _this.ftCmpActividades.filters.items[7].setValue('Parcialmente cumplido');*/
                //_this.ftCmpActividades.filters.items[7].setValue('Cumplido');

                //console.log(_this.TGCmpActividades.getStore().get(''))

                //console.log(_this.TGCmpActividades.view)
                //console.log(_this.TGCmpActividades.getView()).
                //console.log(_this.smTGCmpActividades.getSelected())
                //_this.TGCmpActividades.view.focusRow(id);

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
            name: 'numcaso'
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
            name: 'tienereasignaciones'
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
        }, {
            name: 'usuario_logueado'
        }, {
            name: 'criterioevaluacion'
        }, {
            name: 'tienepuntualizacion'
        }, {
            name: 'is_suspendida'
        }, {
            name: 'idpersona'
        }])
    });


    //barra de paginado del treegrid donde se muestran las actividades
    this.ptbTGCmpActividades = new Ext.ux.maximgb.treegrid.PagingToolbar({
        pageSize: 1000,
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

                //console.log(Ext.lib.Dom.getViewHeight());
                //console.log(_this.TGCmpActividades.view);
                //console.log(_this.TGCmpActividades.view.el.getHeight());

                //if(indiceFila!=0){
                //    var tanFila = parseInt(_this.TGCmpActividades.view.el.getHeight() / 30);
                //    _this.TGCmpActividades.view.focusRow(indiceFila + 7);
                //}
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
        },
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
            type: 'string',
            dataIndex: 'numcaso'
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
            displayFieldcb: 'denominacion',
            multiple: 1
        }, {
            type: 'listado',
            dataIndex: 'tipoactividad',
            idcombo: 'idtipo',
            urlcb: '/planificacion/pdo/plan/index.php/cmpgestionaractividades/cargartiposactividad',
            idstore: 'idtipo',
            valueFieldcb: 'idtipo',
            displayFieldcb: 'denominacion',
            multiple: 1
        }, /* {
            type: 'listado',
            dataIndex: 'tipoactividad',
            idcombo: 'idtipox',
            urlcb: '/planificacion/pdo/plan/index.php/cmpgestionaractividades/cargartiposactividad',
            idstore: 'idtipox',
            valueFieldcb: 'idtipo',
            displayFieldcb: 'denominacion',
            multiple: 1
        },*/ {
            type: 'string_adaptado',
            dataIndex: 'horainicio',
            xtype: 'timefield',
            regex: /^[0-2][0-9]:[0-5][0-9]$/,
            maskRe: /^([0-9:])$/,
            regexText: 'Formato establecido: HH:MM.'
        }, {
            type: 'list',
            dataIndex: 'criterioevaluacion',
            options: ['NE', 'M', 'R', 'B', 'E']
        }, {
            type: 'string',
            dataIndex: 'nombreautor'
        }]
    });

    /***************************
     * Copiar y pegar elementos del grid to excel
     * **********************************************/
    //
    // function cambiarValoraCopiar(value) {
    //     var tempInput = document.createElement("input");
    //     tempInput.style = "position: absolute; left: -1000px; top: -1000px";
    //     tempInput.value = value;
    //     document.body.appendChild(tempInput);
    //     tempInput.select();
    //     document.execCommand("copy");
    //     document.body.removeChild(tempInput);
    // }
    //
    //  $(document).ready(function() {
    //      var ctrlDown = false,
    //          ctrlKey = 17,
    //          cmdKey = 91,
    //          vKey = 86,
    //          cKey = 67;
    //
    //      $(document).keydown(function(e) {
    //          if (e.keyCode == ctrlKey || e.keyCode == cmdKey) ctrlDown = true;
    //      }).keyup(function(e) {
    //          if (e.keyCode == ctrlKey || e.keyCode == cmdKey) ctrlDown = false;
    //      });
    //
    //      $(".no-copy-paste").keydown(function(e) {
    //          if (ctrlDown && (e.keyCode == vKey || e.keyCode == cKey)) return false;
    //      });
    //
    //      // Document Ctrl + C/V
    //      $(document).keydown(function(e) {
    //          if (ctrlDown && (e.keyCode == cKey)){
    //              var elementos=_this.smTGCmpActividades.getSelections();
    //              var total=elementos.length;
    //              if(total>0){
    //                  var  copytoexcel =" <table style=\"width:100%\">";
    //                       copytoexcel += "<th>CAR</th>" +
    //                           "<th>Denominaci&oacute;n</th>" +
    //                           "<th>Fecha de inicio</th>"+
    //                           "<th>Fecha de fin</th>"+
    //                           "<th>Hora de inicio</th>"+
    //                           "<th>Autor</th>"+
    //                           "<th>% de cumplimiento</th>"+
    //                           "<th>Estado de aprobaci&oacute;n</th>"+
    //                           "<th>Estado de cumplimiento</th>"+
    //                           "<th>Observaciones</th>"+
    //                           "<th>Categor&iacute;a</th>"+
    //                           "<th>Tipo de actividad</th>"+
    //                           "<th>Criterio evaluaci&oacute;n</th>";
    //                  for(var k=0;k<total;k++){
    //                      copytoexcel += "<tr>";
    //                      copytoexcel += "<td>"+elementos[k].data.idelemento+"</td>"
    //                                    +"<td>"+elementos[k].data.denominacion+"</td>"
    //                                    +"<td>"+elementos[k].data.fechainicio+"</td>"
    //                                    +"<td>"+elementos[k].data.fechafin+"</td>"
    //                                    +"<td>"+elementos[k].data.horainicio+"</td>"
    //                                    +"<td>"+elementos[k].data.nombreautor+"</td>"
    //                                    +"<td>"+elementos[k].data.gradocumplimiento+"</td>"
    //                                    +"<td>"+elementos[k].data.nombreestadoaprob+"</td>"
    //                                    +"<td>"+elementos[k].data.textocumplimiento+"</td>"
    //                                    +"<td>"+((elementos[k].data.observaciones=="0")?"":elementos[k].data.observaciones)+"</td>"
    //                                    +"<td>"+elementos[k].data.categoria+"</td>"
    //                                    +"<td>"+elementos[k].data.tipoactividad+"</td>"
    //                                    +"<td>"+elementos[k].data.criterioevaluacion+"</td>";
    //                      copytoexcel+="</tr>";
    //                  }
    //                  copytoexcel+="</table> "
    //                  cambiarValoraCopiar(copytoexcel);
    //              }
    //          }
    //      });
    //  });


    /**************************************************************
     * */
    //treegrid donde se muestran las actividades
    this.TGCmpActividades = new Ext.ux.maximgb.treegrid.GridPanel({
        store: _this.stTGCmpActividades,
        master_column_id: 'expandir',
        autoExpandMin: 165,
        stripeRows: true,
        columnsByDemand: true,
        plugins: _this.ftCmpActividades,
        region: 'center',
        sm: _this.smTGCmpActividades,
        margins: '3 3 3 3',
        loadMask: {
           msg: 'Cargando actividades...'
        },
        root_title: 'Registro de actividades',
        columns: [_this.smTGCmpActividades,
            {
                header: 'CAR',
                dataIndex: 'idelemento',
                width: 80,
                renderer: suspendidasCAR,
                tooltip:'Código de Acceso Rápido',
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
                header: 'Duraci&oacute;n',
                dataIndex: 'duracion',
                width: 80,
                tooltip: 'Duración en horas',
				        hidden: true,
                renderer: suspendidas

            }, {
                header: 'Fecha de inicio',
                dataIndex: 'fechainicio',
                width: 115,
                tooltip: 'Fecha de inicio',
                sortable: true,
                renderer: suspendidas
            }, {
                header: 'Fecha de fin',
                dataIndex: 'fechafin',
                width: 115,
                tooltip: 'Fecha de fin',
                sortable: true,
                renderer: suspendidas
            }, {
                header: 'Hora de inicio',
                dataIndex: 'horainicio',
                width: 100,
                tooltip: 'Hora de inicio',
                sortable: true,
                renderer: suspendidas
            }, {
                header: 'Fecha de creaci&oacute;n',
                dataIndex: 'fechacreacion',
                width: 115,
                tooltip: 'Fecha de creaci&oacute;n',
                sortable: true,
                hidden: true,
                renderer: suspendidas
            }, {
                header: 'Autor',
                dataIndex: 'nombreautor',
                width: 90,
                sortable: true,
                tooltip: 'Autor',
                renderer: autor
            }, {
                header: "Estado de aprobaci&oacute;n",
                dataIndex: 'nombreestadoaprob',
                width: 130,
                sortable: true,
                tooltip: 'Estado de aprobaci&oacute;n',
                renderer: suspendidas
            }, {
                header: "% de cumplimiento",
                dataIndex: 'gradocumplimiento',
                width: 120,
                sortable: true,
                align: 'rigth',
                tooltip: 'Porciento de cumplimiento',
                renderer:function (a, m, r) {
                    if (_this.vprogresBar) {
                        /************
                         * Example con progress bar
                         * ***********************/
                        var id=Ext.id();
                        (function (){
                            var pBar=new Ext.ProgressBar({
                                renderTo:id,
                                value:(a/100),
                                width:100,
                                text:a + ' %',
                            });
                            if(a<=40)
                                pBar.addClass('red-bar');
                            else if(a > 40 && a <= 80)
                                pBar.addClass('yellow-bar');
                            else if(a > 80 && a < 100)
                                    pBar.addClass('green-bar');
                                else if(a == 100)
                                        pBar.addClass('success-bar');
                        }).defer(25);

                        return '<div id="'+id+'"></div>';
                    }
                    else{
                        return suspendidas(a + ' %', m, r);
                    }
                }

            },
            {
                header: "# Caso",
                dataIndex: 'numcaso',
                width: 130,
                sortable: true,
                hidden: true,
                tooltip: 'Número de caso',
                renderer: suspendidas
            },
            {
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
            }, /*{
             header: 'Dependencias',
             dataIndex: 'tienedependencias',
             width: 90,
             tooltip: 'Dependencias',
             renderer: MostrarImagenT
             },*/ {
                header: 'Categor&iacute;a',
                dataIndex: 'categoria',
                width: 90,
                tooltip: 'Categor&iacute;a de la actividad',
                renderer: suspendidas
            }, {
                header: 'Tipo de actividad',
                dataIndex: 'tipoactividad',
                width: 100,
                tooltip: 'Tipo de actividad',
                renderer: suspendidas
            }, {
                header: 'Criterio evaluaci&oacute;n',
                dataIndex: 'criterioevaluacion',
                width: 100,
                tooltip: 'Criterio de evaluaci&oacute;n',
                renderer: suspendidas
            }
        ],
        menuderecho: _this.menuderechoTGCmpActividades,
        listeners: {
            rowcontextmenu: function (grid, row, e) {
                if (!_this.hay_suspendidas) {
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
                    if (_this.permitirmodificar) {
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
                                    _this.smTGCmpActividades, null,
                                    null, null, null, null, _this.permitirreasignar);
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
                            _this.objHistorial.verHistorial('act', _this.smTGCmpActividades.getSelected().id);
                        }
                    });//Reasignar
                    _this.controlreagsinacion = new Ext.menu.Item({
                        text: 'Control de reasignaciones',
                        itemCls: 'x-menu-item icondistra-cambiar',
                        iconCls: 'imagen-none',
                        handler: function () {
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
                                _this.objclasificadorinvol.CrearClasificadorReasignacionMultiplesElementos(
                                    _this.arrayidactividades, tipoelemento = 3, _this.posReasignar);
                                // _this.objclasificadorinvol.CrearClasificadorReasignacion(
                                //     _this.arrayidactividades[0], tipoelemento = 3, _this.PostAccionesGestionar);
                            }
                        });
                        _this.menuderechoTGCmpActividades.add(_this.mireasignar);
                    }

                    if (_this.arrayactividadesseleccionadas.length == 1) {
                        _this.menuPuntualizar = new Ext.menu.Item({
                            text: 'Puntualizar actividad',
                            iconCls: 'contratar',
                            hideOnClick: true,
                            handler: function () {
                                _this.objCrudActividad.CrearWinCrudActividades(
                                    new Date().format('d/m/Y'),
                                    new Date().format('d/m/Y'),
                                    _this.horainicio,
                                    _this.horafin,
                                    'Puntualizar',
                                    _this.PostAccionesGestionar,
                                    _this.arrayidactividades,
                                    _this.smTGCmpActividades.getSelected().data.idautor,
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
                        _this.menuderechoTGCmpActividades.add(_this.menuPuntualizar);

                        _this.menuSuspender = new Ext.menu.Item({
                            text: 'Suspender actividad',
                            iconCls: 'desaprobar',
                            hideOnClick: true,
                            handler: function () {
                                _this.SuspenderActividades();
                            }
                        });
                        _this.menuderechoTGCmpActividades.add(_this.menuSuspender);

                        if (_this.btnPuntualizar.isDisable()) {
                            _this.menuPuntualizar.disable();
                        }
                        if (_this.btnSuspender.isDisable()) {
                            _this.menuSuspender.disable();
                        }


                        if (_this.smTGCmpActividades.getSelected().data.idpersona != 0) {
                            _this.mostrarInfoAutorActividad = new Ext.menu.Item({
                                text: 'Informaci&oacute;n del autor',
                                iconCls: 'ver',
                                handler: function () {
                                    var winPerfilPersonaSeg = new Ext.pvd.persona.perfilseguridad.WinperfilSeguridad({
                                        persona: _this.smTGCmpActividades.getSelected().data.idpersona
                                    });
                                    winPerfilPersonaSeg.buttons = [new Ext.Button({
                                        text: 'Cerrar',
                                        iconCls: 'cerrar',
                                        tooltip: 'Cerrar ventana',
                                        scope: this,
                                        handler: function () {
                                            winPerfilPersonaSeg.destroy();
                                        }
                                    })];
                                    winPerfilPersonaSeg.setTitle('Autor de la actividad');
                                    winPerfilPersonaSeg.show();
                                    winPerfilPersonaSeg.center();
                                }
                            });
                            _this.menuderechoTGCmpActividades.add(_this.mostrarInfoAutorActividad);
                        }

                        _this.vistapBarCumplimiento = new Ext.menu.Item({
                            text: 'Cambiar vista de % cumplimiento',
                            iconCls: 'ver',
                            hideOnClick: true,
                            handler: function () {
                                _this.vprogresBar = (_this.vprogresBar)?false:true;
                                _this.stTGCmpActividades.reload({
                                    params: {
                                        anode: null,
                                        start: _this.start
                                    }
                                });
                            }
                        });
                        _this.menuderechoTGCmpActividades.add(_this.vistapBarCumplimiento);

                    }


                    e.stopEvent();
                    var xy = e.getXY();
                    _this.menuderechoTGCmpActividades.showAt(xy);
                }

            },
            rowdblclick: function () {
                if (!_this.hay_suspendidas) {
                    if (_this.permitirmodificar) {
                        _this.objCrudActividad.CrearWinCrudActividades(
                            new Date().format('d/m/Y'), new Date().format('d/m/Y'),
                            _this.horainicio, _this.horafin, 'Modificar',
                            _this.PostAccionesGestionar, _this.arrayidactividades,
                            _this.arrayactividadesseleccionadas[0].idautor, _this.eshija,
                            permisomodificar = 1, permisoeliminar = 1,
                            _this.objcmprelaciones.ObtenerElementosRelacionadosIniciales(),
                            _this.smTGCmpActividades, null, null, _this.porcientocumpl, null,
                            _this.smTGCmpActividades.getSelected().data._parent, _this.permitirreasignar);
                    } else {
                        _this.objCrudActividad.CrearWinCrudActividades(
                            new Date().format('d/m/Y'), new Date().format('d/m/Y'),
                            _this.horainicio, _this.horafin, 'Ver datos de la',
                            _this.PostAccionesGestionar, _this.arrayidactividades,
                            _this.arrayactividadesseleccionadas[0].idautor, _this.eshija,
                            permisomodificar = 1, permisoeliminar = 1,
                            _this.objcmprelaciones.ObtenerElementosRelacionadosIniciales(),
                            _this.smTGCmpActividades, null, null, _this.porcientocumpl, null, null);
                    }
                }
            },
        },
        tbar: ['Aprobaci&oacute;n-conciliaci&oacute;n :', ' ', _this.cbaprob_conc, '-',
         _this.chinclurepeticiones, '-', _this.chinclureasignaciones, '-', _this.chBienestar],
        bbar: (!opcionesConfig.noUsarPaginado) ? _this.ptbTGCmpActividades : null
    });


    /***************************
     * Navegar en grid con tecla abajo
     * **********************************************/

    $(document).ready(function() {
        $(document).keydown(function(e) {
            if(e.keyCode==40){
                moveSelectedRow(_this.TGCmpActividades, 1);
            }if(e.keyCode==38){
                moveSelectedRow(_this.TGCmpActividades, -1);
            }
        });
    });


    function moveSelectedRow(grid, direction) {
        var record = grid.getSelectionModel().getSelected();
        if (!record) {
            return;
        }
        var index = grid.getStore().indexOf(record);
        if (direction < 0) {
            index--;
            if (index < 0) {
                return;
            }
        } else {
            index++;
            if (index >= grid.getStore().getCount()) {
                return;
            }
        }
        // grid.getSelectionModel().clearSelections();
        grid.getSelectionModel().selectRow(index, false);
        grid.getView().refresh(false);
        grid.getView().focusRow(index);
    }



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
        layout: 'fit',
        items: [_this.tpAutoresInvolucrados],
        buttons: [_this.btnBusquedaSimple],
        listeners: {
            clientvalidation: function (form, valid) {
                (_this.objclasificadorinvol.verificarAutoresInvolBusqueda) ? _this.btnBusquedaSimple.enable() : _this.btnBusquedaSimple.disable();
            }
        }
    });

    //panel donde se muestran las opciones de busqueda de actividades
    this.pBuscarActividades = new Ext.Panel({
        title: 'Opciones de b&uacute;squeda',
        layout: 'fit',
        width: 300,
        collapsible: true,
        collapsed: true,
        //autoScroll: true,
        margins: '3 3 3 3',
        region: 'east',
        items: [_this.fpBuscarActividades],
        usarKeymap: true,
        botonesKeymap: [_this.btnBusquedaSimple],
        //buttons: [_this.btnBusquedaSimple],
        listeners: {
            expand: function (p) {
                p.doLayout();
                //setTimeout(function(){p.doLayout(); }, 500);
                _this.stCmbCategorias.reload();
                _this.stCmbTipo.reload();
            }
        }
    });

    this.pRelacionesIniciales = _this.objcmprelaciones.CrearCmpRelacionesIniciales(3, function () {
        _this.stTGCmpActividades.reload({
            params: {
                arrayelementosrelacionados: Ext.encode(_this.objcmprelaciones.ObtenerElementosRelacionadosIniciales()),
                opciontributar: _this.objcmprelaciones.obtenerOpcionTributar()
            }
        });
    }, true);

    //panel principal de la vista
    this.PanPrincipal = new Ext.Panel({
        layout: 'border',
        region: 'center',
        usarKeymap: true,
        botonesKeymap: [_this.btnAdicionar, _this.btnModificar, _this.btnEliminar,
            _this.btnDuplicar, _this.btnVerDatos, _this.btnRelaciones,
            _this.btnHistorial, _this.btnGestObs, _this.btnExportar,
            /*_this.btnImportar, _this.btnImportarActividades*/, _this.btnPanelTributa, _this.btnReorganizar, _this.btnHacerRaiz,
            _this.btnVerNotif, _this.btnAlarma, _this.btnPanelBusqueda, _this.btnGestPuntualizar, _this.btnAsociarInvolAct,
            _this.btnConfPerfil, _this.btn100, /*_this.btnOtroValor,*/ _this.btnControlReagsinacion, _this.btnActualizarParametros, _this.btnEnviarCorreo, _this.btnGestionDocumentos,
            _this.btnExpandirPadre, _this.btnExportarGrid, _this.btnBusquedaRapida, _this.btnLimpiar2, _this.btnAyuda],
        tbar: [_this.btnAdicionar, ' ', _this.btnModificar, ' ', _this.btnEliminar,
            ' ', _this.btnCambiarEstado, ' ', _this.btnDuplicar, ' ', _this.btnVerDatos,
            ' ', _this.btnRelaciones, ' ', _this.btnControlReagsinacion, ' ', _this.btnHistorial,
            ' ', _this.btnGestObs, ' ', _this.btnExportar,
            ' ', /*_this.btnImportar, ' ', _this.btnImportarActividades,*/_this.menuImportar, ' ', _this.btnPanelTributa, ' ', _this.btnReorganizar, ' ', _this.btnHacerRaiz,
            ' ', _this.btnVerNotif, ' ', _this.btnAlarma, ' ', _this.btnPanelBusqueda,
            ' ', _this.btnConfPerfil, ' ', _this.btnGraficas, _this.btnAsociarInvolAct, ' ', _this.btnPuntualizar, ' ', _this.btnGestPuntualizar, ' ', _this.btnSuspender, ' ',
            _this.btn100, ' ', _this.btnOtroValor, ' ', _this.menuModificarFecha, ' ', _this.btnActualizarParametros,' ', _this.btnEnviarCorreo,' ', _this.btnGestionDocumentos, ' ', _this.btnExpandirPadre, ' ', _this.btnMostrarSubordinacion,
            _this.btnExportarGrid, ' ', _this.btnBusquedaRapida, ' ', _this.btnLimpiar2, '->', _this.btnAyuda],
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
        noTitle: opcionesConfig.maxWinPrincipal,
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

	this.enviarCorreo = function () {
	    var mensaje="¿Desea notificar a los usuarios involucrados sobre las actividades seleccionadas?";
      mostrarMensaje(2, mensaje, function (btnoprimido) {
          if (btnoprimido == 'ok') {
              _this.BarraProgreso.show("Enviando correo");
              try {
                  Ext.Ajax.request({
                      url: '/planificacion/pdo/plan/index.php/cmpgestionaractividades/enviarCorreo',
                      params: {
                          arrayidactividades: Ext.encode(_this.arrayidactividades)
                      },
                      callback: function (options, success, response) {
                          _this.BarraProgreso.hide();
                          responseData = Ext.decode(response.responseText);
                          if(responseData.mensaje == 1){
                              // mostrarMensaje(1, responseData.notice);
                              mostrarMensaje(1, responseData.notice);
                          }else if(responseData.mensaje != -1){
                              mostrarMensaje(4, "No se ha generado la notificacion por correo.",'',responseData.error);
                              
                          }
                          // if(responseData.mensaje!=-1){
                          //     mostrarMensaje(1, "El correo ha sido enviado correctamente.");
                          // }
                      }
                  });
              } catch (error) {
                  console.log(error)
                  _this.BarraProgreso.hide();
                  mostrarMensaje(1, "Error, correo no enviado, uno o varias direcciones inválidas.");
          }
          }
      });

    };


    this.PostAccionesGestionar = function (mensaje, accion, informacion) {
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
                    } else{
		                    // _this.PaginaActual(null);
		                    var new_record=new Ext.data.Record(informacion.actividad[0]);
		                    new_record.id=informacion.actividad[0].idelemento;
		                    new_record.json=informacion.actividad[0];
		                    _this.stTGCmpActividades.insert(0,new_record);

                        }
                        // _this.UltimaPagina();
                } else if (accion == 'Modificar') {
                    if (rec.data._parent != null) {
                        var recparent = _this.stTGCmpActividades.getById(rec.data._parent);
                        _this.RecargarNodo(recparent.id, 0, recparent);
                    } else{
		                    if (_this.eshija == 1){
				                    _this.PaginaActual(null);
                        }else{
				                    var update_record = _this.stTGCmpActividades.getById(_this.arrayidactividades[0]);
				                    var fields=[
						                    'denominacion',
						                    'activo',
						                    'fechainicio',
						                    'fechafin',
						                    'fechacreacion',
						                    '_parent',
						                    '_is_leaf',
						                    'idestadoaprob',
						                    'nombreestadoaprob',
						                    'generacontrol',
						                    'estadocumplimiento',
						                    'nombreautor',
						                    'subordinado',
						                    'superior',
						                    'observaciones',
						                    'gradocumplimiento',
						                    'textocumplimiento',
						                    'tipoelemento',
						                    'modificar',
						                    'eliminar',
						                    'idautor',
						                    'tiporepeticion',
						                    'tienedependencias',
						                    'tienereasignaciones',
						                    'actualizarporciento',
						                    'tienealarma',
						                    'duracion',
						                    'horainicio',
						                    'categoria',
						                    'tipoactividad',
						                    'usuario_logueado',
						                    'criterioevaluacion',
						                    'tienepuntualizacion',
						                    'is_suspendida',
						                    'idpersona'

				                    ];
				                    for(var l=0;l<fields.length;l++){
						                    campo=fields[l];
						                    update_record.set(campo, informacion.actividad[0][campo]);
				                    }
				                    _this.stTGCmpActividades.commitChanges();
                        }
                    }
                }
                else if (accion == 'Duplicar'){
                        _this.PaginaActual(null);
                }
                else if (accion == 'Eliminar') {
                    if (_this.start != 0)
                        _this.posteliminar = true;
                    var totalseleccionados = _this.smTGCmpActividades.getCount();
                    if (totalseleccionados > 1) {
		                    _this.eliminarRecorsStores();
                        // _this.PaginaActual(null);
                    } else {
                        if (rec.data._parent == null) {
                            // _this.PaginaActual(null);
		                        _this.eliminarRecorsStores();
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
                }
                else if (accion == 'Puntualizar') {
                    _this.stTGCmpActividades.reload({
                        params: {
                            anode: null,
                            start: _this.start
                        }
                    });

                } else if (accion == 'Suspender') {
                    _this.stTGCmpActividades.reload({
                        params: {
                            anode: null,
                            start: _this.start
                        }
                    });

                }
                break;
            default:
                _this.PaginaActual(null);
        }
        _this.objCrudActividad.objcmprelaciones.arrayelementosrelacionados = [];
		    _this.ActualizarEstadoBarraHerramientas();
    };

    this.posReasignar = function () {
        _this.smTGCmpActividades.clearSelections();
        _this.stTGCmpActividades.reload({
            params: {
                anode: null,
                start: _this.start
            }
        });
    };

    this.eliminarRecorsStores=function(){
		    for (var i = 0; i < _this.arrayidactividades.length; i++) {
				    record=_this.stTGCmpActividades.getById(_this.arrayidactividades[i]);
				    _this.stTGCmpActividades.remove(record);
		    }
    }

    this.searchRapida = function () {
        _this.cb_operador_fecha_inicio = new Ext.form.ComboBox({
            hiddenName: '',
            fieldLabel: 'Rango de fecha inicio',
            store: _this.store_operador_searchrapida,
            valueField: 'id',
            displayField: 'den',
            // labelWidth:10,
            hiddenName: 'id',
            typeAhead: true,
            mode: 'local',
            forceSelection: true,
            triggerAction: 'all',
            id: 'cb_operador_fecha_inicio',
            name: 'cb_operador_fecha_inicio',
            emptyText: 'Seleccionar',
            selectOnFocus: true,
            anchor: '95%'
        });

        _this.cb_operador_fecha_fin = new Ext.form.ComboBox({
            hiddenName: '',
            fieldLabel: 'Rango de fecha fin',
            store: _this.store_operador_searchrapida,
            valueField: 'id',
            displayField: 'den',
            // labelWidth:10,
            hiddenName: 'id',
            typeAhead: true,
            mode: 'local',
            forceSelection: true,
            triggerAction: 'all',
            id: 'cb_operador_fecha_fin',
            name: 'cb_operador_fecha_fin',
            emptyText: 'Seleccionar',
            selectOnFocus: true,
            anchor: '95%'
        });

        _this.f_inicio_searchRapida = new Ext.form.DateField({
            fieldLabel: 'Fecha de inicio',
            format: 'd/m/Y',
            name: 'f_inicio_searchRapida',
            id: 'f_inicio_searchRapida',
            //value: new Date().format('d/m/Y'),
            emptyText: 'Seleccione',
            endDateField: 'f_inicio_searchRapida',
            allowBlank: true,
            vtype: 'daterange',
            anchor: '95%',
            // labelWidth:50,
            menuListeners: {
                select: function (df, date) {
                    _this.f_inicio_searchRapida.setValue(date);
                }
            }
        });
        _this.f_fin_searchRapida = new Ext.form.DateField({
            fieldLabel: 'Fecha de fin',
            format: 'd/m/Y',
            name: 'f_fin_searchRapida',
            id: 'f_fin_searchRapida',
            startDateField: 'f_inicio_searchRapida',
            //value: new Date().format('d/m/Y'),
            emptyText: 'Seleccione',
            vtype: 'daterange',
            anchor: '95%',
            // labelWidth:50,
            menuListeners: {
                select: function (df, date) {
                    _this.f_fin_searchRapida.setValue(date);
                }
            }
        });


        // Combo de seleccionar categoria para busqueda rapida
        _this.tooltipCategoria_seachRapida;

        _this.cb_categoria_seachRapida = new Ext.form.ComboBox({
            fieldLabel: 'Categor&iacute;a',
            store: _this.store_categoria_searchrapida,
            valueField: 'idcategoria',
            displayField: 'denominacion',
            triggerAction: 'all',
            editable: false,
            allowBlank: false,
            editable: false,
            loadingText: 'Cargando datos...',
            forceSelection: true,
            mode: 'remote',
            // listWidth:200,
            emptyText: 'Seleccione...',
            anchor: '95%',
            listeners: {
                select: function (c, r, i) {
                    if (_this.tooltipCategoria_seachRapida)
                        _this.tooltipCategoria_seachRapida.destroy();
                    if (_this.cb_categoria_seachRapida.getValue() && _this.cb_categoria_seachRapida.getRawValue().length > 20) {
                        _this.tooltipCategoria_seachRapida = new Ext.ToolTip({
                            target: c.getEl(),
                            html: _this.cb_categoria_seachRapida.getRawValue()
                        });
                    }
                },
                expand: function (combo) {
                    _this.store_categoria_searchrapida.reload();
                }
            }
        });

        // Combo de seleccionar estado de aprobacion para busqueda rapida
        _this.tooltipEstado_Aprob_seachRapida;

        _this.cb_estado_aprob_seachRapida = new Ext.form.ComboBox({
            fieldLabel: 'Estado de aprobaci&oacute;n',
            store: _this.store_estado_aprob_searchrapida,
            valueField: 'idestado',
            displayField: 'denominacion',
            triggerAction: 'all',
            editable: false,
            allowBlank: false,
            editable: false,
            loadingText: 'Cargando datos...',
            forceSelection: true,
            mode: 'remote',
            // listWidth:540,
            emptyText: 'Seleccione...',
            anchor: '95%',
            listeners: {
                select: function (c, r, i) {
                    if (_this.tooltipEstado_Aprob_seachRapida)
                        _this.tooltipEstado_Aprob_seachRapida.destroy();
                    if (_this.cb_estado_aprob_seachRapida.getValue() && _this.cb_estado_aprob_seachRapida.getRawValue().length > 20) {
                        _this.tooltipEstado_Aprob_seachRapida = new Ext.ToolTip({
                            target: c.getEl(),
                            html: _this.cb_estado_aprob_seachRapida.getRawValue()
                        });
                    }

                },
                expand: function (combo) {
                    _this.store_estado_aprob_searchrapida.reload();
                }
            }
        });

        // Combo de seleccionar tipo actividad de aprobacion para busqueda rapida
        _this.tooltipTipo_Actividad_seachRapida;

        _this.cb_tipo_actividad_seachRapida = new Ext.form.ComboBox({
            fieldLabel: 'Tipo actividad',
            store: _this.store_tipo_actividad_searchrapida,
            valueField: 'idtipo',
            displayField: 'denominacion',
            triggerAction: 'all',
            editable: false,
            allowBlank: false,
            editable: false,
            loadingText: 'Cargando datos...',
            forceSelection: true,
            mode: 'remote',
            // listWidth:200,
            emptyText: 'Seleccione...',
            anchor: '95%',
            listeners: {
                select: function (c, r, i) {
                    if (_this.tooltipTipo_Actividad_seachRapida)
                        _this.tooltipTipo_Actividad_seachRapida.destroy();
                    if (_this.cb_tipo_actividad_seachRapida.getValue() && _this.cb_tipo_actividad_seachRapida.getRawValue().length > 20) {
                        _this.tooltipTipo_Actividad_seachRapida = new Ext.ToolTip({
                            target: c.getEl(),
                            html: _this.cb_tipo_actividad_seachRapida.getRawValue()
                        });
                    }
                },
                expand: function (combo) {
                    _this.store_tipo_actividad_searchrapida.reload();
                }
            }
        });

        // Combo de seleccionar estado de cumplimiento para busqueda rapida

        _this.cb_estado_cumpl_seachRapida = new Ext.form.ComboBox({
            hiddenName: '',
            fieldLabel: 'Estado de cumplimiento',
            store: _this.store_estado_cumplimiento_searchrapida,
            valueField: 'id',
            displayField: 'den',
            // labelWidth:10,
            hiddenName: 'id',
            typeAhead: true,
            mode: 'local',
            forceSelection: true,
            triggerAction: 'all',
            id: 'cb_estado_cumpl_seachRapida',
            name: 'cb_estado_cumpl_seachRapida',
            emptyText: 'Seleccionar',
            selectOnFocus: true,
            anchor: '95%'
        });

        _this.formSearchRapida = new Ext.FormPanel({
            labelAlign: 'top',
            frame: true,
            bodyStyle: 'padding:5px 5px 0',
            width: 600,
            items: [{
                layout: 'column',
                items: [{
                    columnWidth: .5,
                    layout: 'form',
                    items: [_this.cb_operador_fecha_inicio,
                        _this.cb_operador_fecha_fin,
                        _this.cb_categoria_seachRapida,
                        _this.cb_tipo_actividad_seachRapida
                    ]
                }, {
                    columnWidth: .5,
                    layout: 'form',
                    items: [_this.f_inicio_searchRapida,
                        _this.f_fin_searchRapida,
                        _this.cb_estado_aprob_seachRapida,
                        _this.cb_estado_cumpl_seachRapida
                    ]
                }]
            }]
        });


        _this.btnCancelarSearchRapida = new Ext.Button({
            iconCls: 'cancelar',
            text: 'Cancelar',
            tooltip: 'Cerrar ventana sin guardar los datos',
            handler: function () {
                _this.windowSearchRapida.destroy();
            }
        });

        _this.btnLimpiarSearchRapida = new Ext.Button({
            iconCls: 'limpiar',
            text: 'Limpiar',
            tooltip: 'Limpiar filtro(s)',
            handler: function () {
                // Limpiar filtros de categoria y tipo actividades
                _this.ftCmpActividades.filters.items[11].value.editor.value = '';
                _this.ftCmpActividades.filters.items[11].active = false;

                _this.ftCmpActividades.filters.items[12].value.editor.value = '';
                _this.ftCmpActividades.filters.items[12].active = false;

                _this.formSearchRapida.getForm().reset();
                // _this.cb_operador_fecha_inicio.clearValue();
                // _this.cb_operador_fecha_fin.clearValue();
                // _this.cb_estado_aprob_seachRapida.clearValue();
                // _this.cb_estado_cumpl_seachRapida.clearValue();
                // _this.cb_tipo_actividad_seachRapida.clearValue();
                // _this.cb_categoria_seachRapida.clearValue();
                // _this.f_inicio_searchRapida.clearValue();
                // _this.f_fin_searchRapida.clearValue();

                _this.chinclurepeticiones.setValue(false);
                _this.chinclureasignaciones.setValue(false);
                _this.chBienestar.setValue(false);
                _this.pBuscarActividades.collapse(true);
                _this.objclasificadorinvol.ResetearArbolesBusqueda();
                _this.smTGCmpActividades.clearSelections();
                _this.cbbtipo.reset();
                _this.cbbcat.reset();
                _this.stTGCmpActividades.setDefaultSort(null);
                _this.stTGCmpActividades.baseParams.arrayautores = '';
                _this.stTGCmpActividades.baseParams.arrayinvolucrados = '';
                _this.ftCmpActividades.clearFilters();
                _this.objclasificadorinvol.verificarAutoresInvolBusqueda = false;
                _this.btnBusquedaSimple.disable();
            }
        });

        _this.btnAceptarwindowSearchRapida = new Ext.Button({
            iconCls: 'buscar',
            text: 'Buscar',
            tooltip: 'Buscar datos y cerrar ventana',
            handler: function () {
                // Filter fecha inicio
                if (_this.cb_operador_fecha_inicio.getValue() != "" && _this.f_inicio_searchRapida.getValue() != null) {
                    var fi = _this.f_inicio_searchRapida.getRawValue().split('/')[2] + "-" +
                        _this.f_inicio_searchRapida.getRawValue().split('/')[1] + "-" +
                        _this.f_inicio_searchRapida.getRawValue().split('/')[0];
                    var dt_ini = new Date(fi);
                    dt_ini.setDate(dt_ini.getDate() + 1);

                    if (_this.cb_operador_fecha_inicio.getValue() == "gt") {
                        _this.ftCmpActividades.filters.items[2].dates.after.menu.picker.setValue(dt_ini);
                        _this.ftCmpActividades.filters.items[2].active = true;
                        _this.ftCmpActividades.filters.items[2].dates.after.setChecked(true);
                    }

                    if (_this.cb_operador_fecha_inicio.getValue() == "lt") {
                        _this.ftCmpActividades.filters.items[2].dates.before.menu.picker.setValue(dt_ini);
                        _this.ftCmpActividades.filters.items[2].active = true;
                        _this.ftCmpActividades.filters.items[2].dates.before.setChecked(true);
                    }

                    if (_this.cb_operador_fecha_inicio.getValue() == "eq") {
                        _this.ftCmpActividades.filters.items[2].dates.on.menu.picker.setValue(dt_ini);
                        _this.ftCmpActividades.filters.items[2].active = true;
                        _this.ftCmpActividades.filters.items[2].dates.on.setChecked(true);
                    }

                }

                // Filtro fecha fin
                if (_this.cb_operador_fecha_fin.getValue() != "" && _this.f_fin_searchRapida.getValue() != null) {
                    var ff = _this.f_fin_searchRapida.getRawValue().split('/')[2] + "-" +
                        _this.f_fin_searchRapida.getRawValue().split('/')[1] + "-" +
                        _this.f_fin_searchRapida.getRawValue().split('/')[0];
                    var dt_fin = new Date(ff);
                    dt_fin.setDate(dt_fin.getDate() + 1);
                    if (_this.cb_operador_fecha_fin.getValue() == "gt") {
                        _this.ftCmpActividades.filters.items[3].dates.after.menu.picker.setValue(dt_fin);
                        _this.ftCmpActividades.filters.items[3].active = true;
                        _this.ftCmpActividades.filters.items[3].dates.after.setChecked(true);
                    }

                    if (_this.cb_operador_fecha_fin.getValue() == "lt") {
                        _this.ftCmpActividades.filters.items[3].dates.before.menu.picker.setValue(dt_fin);
                        _this.ftCmpActividades.filters.items[3].active = true;
                        _this.ftCmpActividades.filters.items[3].dates.before.setChecked(true);
                    }

                    if (_this.cb_operador_fecha_fin.getValue() == "eq") {
                        _this.ftCmpActividades.filters.items[3].dates.on.menu.picker.setValue(dt_fin);
                        _this.ftCmpActividades.filters.items[3].active = true;
                        _this.ftCmpActividades.filters.items[3].dates.on.setChecked(true);
                    }


                }
                //Filtrar por categoria
                if (_this.cb_categoria_seachRapida.getValue() != "") {
                    _this.ftCmpActividades.filters.items[11].value.editor.value = _this.cb_categoria_seachRapida.getValue();
                    _this.ftCmpActividades.filters.items[11].active = true;

                }

                if (_this.cb_tipo_actividad_seachRapida.getValue() != "") {
                    _this.ftCmpActividades.filters.items[12].value.editor.value = _this.cb_tipo_actividad_seachRapida.getValue();
                    _this.ftCmpActividades.filters.items[12].active = true;

                }

                if (_this.cb_estado_aprob_seachRapida.getValue() != "") {
                    _this.ftCmpActividades.filters.items[6].setValue(_this.cb_estado_aprob_seachRapida.getValue());
                    _this.ftCmpActividades.filters.items[6].active = true;

                }
                if (_this.cb_estado_cumpl_seachRapida.getValue() != "") {
                    _this.ftCmpActividades.filters.items[7].active = true;
                    _this.ftCmpActividades.filters.items[7].setValue(_this.cb_estado_cumpl_seachRapida.getValue());
                }
                //	}
                _this.stTGCmpActividades.reload();

                _this.windowSearchRapida.destroy();
            }
        });
        _this.windowSearchRapida = new Ext.Window({
            modal: true,
            closeAction: 'destroy',
            constrain: true,
            layout: 'fit',
            title: 'B&uacute;squeda r&aacute;pida',
            width: 500,
            height: 300,
            resizable: false,
            items: [_this.formSearchRapida],
            buttons: [_this.btnCancelarSearchRapida, _this.btnLimpiarSearchRapida, _this.btnAceptarwindowSearchRapida]
        });

        _this.windowSearchRapida.show();

        var cantActivos = 0;
        var filters_activos = _this.ftCmpActividades.filters.items;
        for (var i = 0; i < filters_activos.length; i++) {
            if (filters_activos[i].active) {
                cantActivos++;
            }
        }

        for (var k = 0; k < cantActivos; k++) {
            if (_this.stTGCmpActividades.lastOptions.params['filtros[' + k + '][field]'] == "fechainicio") {
                var date_inicial = new Date(_this.stTGCmpActividades.lastOptions.params['filtros[' + k + '][data][value]']);
                _this.cb_operador_fecha_inicio.setValue(_this.stTGCmpActividades.lastOptions.params['filtros[' + k + '][data][comparison]']);
                _this.f_inicio_searchRapida.setValue(date_inicial);
            }

            if (_this.stTGCmpActividades.lastOptions.params['filtros[' + k + '][field]'] == "fechafin") {
                var date_final = new Date(_this.stTGCmpActividades.lastOptions.params['filtros[' + k + '][data][value]']);
                _this.cb_operador_fecha_fin.setValue(_this.stTGCmpActividades.lastOptions.params['filtros[' + k + '][data][comparison]']);
                _this.f_fin_searchRapida.setValue(date_final);
            }
            if (_this.stTGCmpActividades.lastOptions.params['filtros[' + k + '][field]'] == "nombreestadoaprob") {
                var estado_aprob_load = _this.store_estado_aprob_searchrapida.getById("" + _this.stTGCmpActividades.lastOptions.params['filtros[' + k + '][data][value]']);
                _this.cb_estado_aprob_seachRapida.setValue(estado_aprob_load.id);
            }
            if (_this.stTGCmpActividades.lastOptions.params['filtros[' + k + '][field]'] == "textocumplimiento") {
                _this.cb_estado_cumpl_seachRapida.setValue(_this.stTGCmpActividades.lastOptions.params['filtros[' + k + '][data][value]']);
            }
            if (_this.stTGCmpActividades.lastOptions.params['filtros[' + k + '][field]'] == "categoria") {
                var categoria_load = _this.store_categoria_searchrapida.getById("" + _this.stTGCmpActividades.lastOptions.params['filtros[' + k + '][data][value]']);
                _this.cb_categoria_seachRapida.setValue(categoria_load.id);
            }
            if (_this.stTGCmpActividades.lastOptions.params['filtros[' + k + '][field]'] == "tipoactividad") {
                var tipo_actividad_load = _this.store_tipo_actividad_searchrapida.getById("" + _this.stTGCmpActividades.lastOptions.params['filtros[' + k + '][data][value]']);
                _this.cb_tipo_actividad_seachRapida.setValue(tipo_actividad_load.id);
            }
        }

    }

	this.EsPrincipal = function () {
				if (_this.chprincipal_actParams.getValue() == true) {
						esprincipal = 1
				} else
						esprincipal = 0;
				return esprincipal;
		};

	this.actualizarParametros = function () {

				//campo donde marco si la actividad es o no principal
				_this.chprincipal_actParams = new Ext.form.Checkbox({
						boxLabel: 'Principal',
						checked: false,
						fieldLabel: '',
						labelSeparator: ''

				});

				_this.f_inicio_actParams = new Ext.form.DateField({
						fieldLabel: 'Fecha de inicio',
						format: 'd/m/Y',
						name: 'f_inicio_actParams',
						id: 'f_inicio_actParams',
						//value: new Date().format('d/m/Y'),
						emptyText: '',
						endDateField: 'f_inicio_actParams',
						allowBlank: true,
						anchor: '95%',
						// labelWidth:50,
						menuListeners: {
								select: function (df, date) {
										_this.f_inicio_actParams.setMaxValue(null);
										_this.f_fin_actParams.setMinValue(null);
										this.setValue(date);

										if (this.getRawValue() != "") {
												if (date > _this.f_fin_actParams.getValue()) {
														_this.f_fin_actParams.setValue(date);
												}
												//Validar horas laborables segun la finicio y ffin
												// _this.validarHorasLaborables(this, _this.f_fin_actParams);
												_this.validarHoraInicioFin(_this.tmfhorafin_actParams, true);
										}
								}
						},
						listeners: {
								'render': function (c) {
										//Validar campo tiempo estimado al escribir en el campo de las fechas
										c.getEl().on('keyup', function () {
												if (this.isValid()) {
														// _this.validarHorasLaborables(this, _this.f_fin_actParams);
														_this.validarHoraInicioFin(_this.tmfhorafin_actParams, true);
												}
										}, c);
								}
						}
				});

				_this.f_fin_actParams = new Ext.form.DateField({
						fieldLabel: 'Fecha de fin',
						format: 'd/m/Y',
						name: 'f_fin_actParams',
						id: 'f_fin_actParams',
						startDateField: 'f_inicio_actParams',
						//value: new Date().format('d/m/Y'),
						emptyText: '',
						anchor: '95%',
						// labelWidth:50,
						menuListeners: {
								select: function (df, date) {
										_this.f_inicio_actParams.setMaxValue(null);
										_this.f_fin_actParams.setMinValue(null);
										this.setValue(date);
										if (_this.f_inicio_actParams.getRawValue() != "" && _this.restaFechas(_this.f_inicio_actParams.getRawValue(), _this.f_fin_actParams.getRawValue()) < 0)
												this.markInvalid('La fecha de inicio tiene que ser menor o igual a la fecha fin.');

										if (this.getRawValue() != "") {
												//Validar horas laborables segun la finicio y ffin
												// _this.validarHorasLaborables(_this.f_inicio_actParams, this);
												_this.validarHoraInicioFin(_this.tmfhora_actParams, true);
										}
								}
						},
						listeners: {
								'render': function (c) {
										//Validar campo tiempo estimado al escribir en el campo de las fechas
										c.getEl().on('keyup', function () {
												if (this.isValid()) {
														// _this.validarHorasLaborables(_this.f_inicio_actParams, this);
														_this.validarHoraInicioFin(_this.tmfhora_actParams, true);
												}
										}, c);
								}
						}
				});


				// Combo de seleccionar categoria para busqueda rapida
				_this.tooltipCategoria_actParams;

				_this.cb_categoria_actParams = new Ext.form.ComboBox({
						fieldLabel: 'Categor&iacute;a',
						store: _this.store_categoria_searchrapida,
						valueField: 'idcategoria',
						displayField: 'denominacion',
						triggerAction: 'all',
						allowBlank: true,
						editable: false,
						loadingText: 'Cargando datos...',
						forceSelection: true,
						mode: 'remote',
						// listWidth:200,
						emptyText: 'Seleccione...',
						anchor: '95%',
						listeners: {
								select: function (c, r, i) {
										if (_this.tooltipCategoria_actParams)
												_this.tooltipCategoria_actParams.destroy();
										if (_this.cb_categoria_actParams.getValue() && _this.cb_categoria_actParams.getRawValue().length > 20) {
												_this.tooltipCategoria_actParams = new Ext.ToolTip({
														target: c.getEl(),
														html: _this.cb_categoria_actParams.getRawValue()
												});
										}
								},
								expand: function (combo) {
										_this.store_categoria_searchrapida.reload();
								}
						}
				});




				// Combo de seleccionar tipo actividad de aprobacion para busqueda rapida
				_this.tooltipTipo_Actividad_actParams;

				_this.cb_tipo_actividad_actParams = new Ext.form.ComboBox({
						fieldLabel: 'Tipo actividad',
						store: _this.store_tipo_actividad_searchrapida,
						valueField: 'idtipo',
						displayField: 'denominacion',
						triggerAction: 'all',
						editable: false,
						allowBlank: true,
						loadingText: 'Cargando datos...',
						forceSelection: true,
						mode: 'remote',
						// listWidth:200,
						emptyText: 'Seleccione...',
						anchor: '95%',
						listeners: {
								select: function (c, r, i) {
										if (_this.tooltipTipo_Actividad_actParams)
												_this.tooltipTipo_Actividad_actParams.destroy();
										if (_this.cb_tipo_actividad_actParams.getValue() && _this.cb_tipo_actividad_actParams.getRawValue().length > 20) {
												_this.tooltipTipo_Actividad_actParams = new Ext.ToolTip({
														target: c.getEl(),
														html: _this.cb_tipo_actividad_actParams.getRawValue()
												});
										}
								},
								expand: function (combo) {
										_this.store_tipo_actividad_searchrapida.reload();
								}
						}
				});

				//campo donde muestro la hora de inicio de la actividad
				_this.tmfhora_actParams = new Ext.form.TimeField({
						fieldLabel: 'Hora de inicio',
						format: _this.formatohora,
						minValue: _this.hvalorminimo,
						maxValue: _this.hvalormaximo,
						increment: 15,
						//value: _this.horainicio, //'8:00 AM',
						//id: 'tmfhoraact',
						editable: true,
						emptyText: 'Seleccione',
						anchor: '95%',
						maskRe: /^([0-9:aAmMpP\s])$/,
						maxText: 'Formato establecido: hh:mm am/pm.',
						allowBlank: true,
						validationEvent: false,
						listeners: {
								beforeselect: function (combo, record, index) {
										_this.arr_hour.push(Date.parseDate(combo.getValue(), _this.formatohora));
										//si retornas true te permite seleccionar y false cancela la seleccion
										if (!_this.f_inicio_actParams.isValid() || !_this.f_fin_actParams.isValid()) {
												combo.markInvalid('Debe validar los campos fecha de inicio y/o fecha de fin.');
												return false;
										} else if (!_this.tmfhorafin_actParams.isValid() && _this.tmfhorafin_actParams.getValue() != '') {
												combo.markInvalid('Debe validar el campo hora de fin.');
												return false;
										} else if (_this.tmfhorafin_actParams.getValue() == '') {
												combo.clearInvalid();
												return true;
										} else {
												var vHoraFinal = Date.parseDate(_this.tmfhorafin_actParams.getValue(), _this.formatohora).format("U");
												var vHoraInicial = Date.parseDate(record.get('text'), _this.formatohora).format("U");
												var vFechaInicial = (_this.f_inicio_actParams.getValue()).format('d/m/Y');
												var vFechaFin = (_this.f_fin_actParams.getValue()).format('d/m/Y');
												var nopuedeSeleccionar = ((vFechaFin == vFechaInicial) && (vHoraInicial > vHoraFinal));
												if (nopuedeSeleccionar) {
														combo.markInvalid("La hora de inicio debe ser menor que la hora de fin.");
												} else {
														combo.clearInvalid();
														_this.tmfhorafin_actParams.clearInvalid();
												}
												return !nopuedeSeleccionar;
										}
								},
								'render': function (c) {
										//Validar campo al escribir
										c.getEl().on('keyup', function () {
												_this.validarHoraInicioFin(this, false);
										}, c);
								},
								blur: function (c) {
										_this.validarHoraInicioFin(c, false);
								}
						}
				});
				//campo donde muestro la hora de fin de la actividad
				_this.tmfhorafin_actParams = new Ext.form.TimeField({
						fieldLabel: 'Hora de fin',
						format: _this.formatohora,
						minValue: _this.hvalorminimo,
						maxValue: _this.hvalormaximo,
						increment: 15,
						//value: _this.horafin,
						//id: 'tmfhorafinact',
						editable: true,
						emptyText: 'Seleccione',
						anchor: '95%',
						maskRe: /^([0-9:aAmMpP\s])$/,
						maxText: 'Formato establecido: hh:mm am/pm.',
						allowBlank: true,
						validationEvent: false,
						listeners: {
								scope: this,
								beforeselect: function (combo, record, index) {
										if (!_this.f_inicio_actParams.isValid() || !_this.f_fin_actParams.isValid()) {
												combo.markInvalid('Debe validar los campos fecha de inicio y/o fecha de fin.');
												return false;
										} else if (!_this.tmfhora_actParams.isValid() && _this.tmfhora_actParams.getValue() != '') {
												combo.markInvalid('Debe validar el campo hora de inicio.');
												return false;
										} else if (_this.tmfhora_actParams.getValue() == '') {
												combo.clearInvalid();
												return true;
										} else if(_this.f_inicio_actParams.getRawValue()!='' && _this.f_fin_actParams.getRawValue()!=''){
												var vHoraInicial = Date.parseDate(_this.tmfhora_actParams.getValue(), _this.formatohora).format("U");
												var vHorafinal = Date.parseDate(record.get('text'), _this.formatohora).format("U");
												var vFechaInicial = (_this.f_inicio_actParams.getValue()).format('d/m/Y');
												var vFechaFin = (_this.f_fin_actParams.getValue()).format('d/m/Y');
												var nopuedeSeleccionar = ((vFechaFin == vFechaInicial) && (vHoraInicial > vHorafinal));
												if (nopuedeSeleccionar) {
														combo.markInvalid("La hora de fin debe ser mayor que la hora de inicio.");
												} else {
														combo.clearInvalid();
														_this.tmfhora_actParams.clearInvalid();
												}
												return !nopuedeSeleccionar;
										}
								},
								'render': function (c) {
										//Validar campo al escribir
										c.getEl().on('keyup', function () {
												_this.validarHoraInicioFin(this, true);
										}, c);
								},
								blur: function (c) {
										_this.validarHoraInicioFin(c, true);
								}
						}
				});


				_this.form_actParams = new Ext.FormPanel({
						labelAlign: 'top',
						frame: true,
            title:'Datos generales',
						bodyStyle: 'padding:5px 5px 0',
						width: 600,
						items: [{
								layout: 'column',
								items: [{
										columnWidth: .5,
										layout: 'form',
										items: [
												_this.tmfhora_actParams,
												_this.tmfhorafin_actParams,
												_this.cb_categoria_actParams,
												_this.chprincipal_actParams
										]
								}, {
										columnWidth: .5,
										layout: 'form',
										items: [
										    _this.f_inicio_actParams,
												_this.f_fin_actParams,
												_this.cb_tipo_actividad_actParams
										]
								}]
						}],
						listeners: {
								'clientvalidation': function (fm, valid) {
										// if (valid) {
										// 		_this.btnAceptarwindow_actParams.enable();
										// } else {
										// 		_this.btnAceptarwindow_actParams.disable();
										// }
								}
						}
				});


				_this.btnCancelar_actParams = new Ext.Button({
						iconCls: 'cancelar',
						text: 'Cancelar',
						tooltip: 'Cerrar ventana sin guardar los datos',
						handler: function () {
								_this.window_actParams.destroy();
						}
				});

				_this.btnAceptarwindow_actParams = new Ext.Button({
						iconCls: 'aceptar ',
						text: 'Guardar',
						tooltip: 'Guardar datos y cerrar ventana',
						handler: function () {
						    if(_this.validarParametros()){
								    var waitMsg = 'Guardando datos de la actividad seleccionada';
								    var respuesta= 'Se han actualizado los parámetros de la actividad seleccionada';
								    if(_this.arrayidactividades.length>1){
										    waitMsg = 'Guardando datos de las actividades seleccionadas';
										    respuesta= 'Se han actualizado los parámetros de las actividades seleccionadas';
								    }
								    var actprincipal = _this.EsPrincipal();
								    var arrayidrecursosasociados = _this.objactivrecurso.retornarasociados();
								    _this.BarraProgreso.show(waitMsg);
								    _this.form_actParams.getForm().submit({
										    url: '/planificacion/pdo/plan/index.php/cmpgestionaractividades/actualizarParametros',
										    params: {
												    idtipo: _this.cb_tipo_actividad_actParams.getValue(),
												    denomtipo: _this.cb_tipo_actividad_actParams.getRawValue(),
												    idcategoria: _this.cb_categoria_actParams.getValue(),
												    denomcategoria: _this.cb_categoria_actParams.getRawValue(),
												    h_inicio:_this.tmfhora_actParams.getValue(),
												    h_fin:_this.tmfhorafin_actParams.getValue(),
												    arrayidactividades: Ext.encode(_this.arrayidactividades),
												    asociados: Ext.encode(arrayidrecursosasociados),
												    principal: actprincipal
										    },
										    failure: function (form, action) {
												    if (action.result.mensaje > 0) {
														    mostrarMensaje(1, respuesta);
														    _this.window_actParams.destroy();
														    _this.BarraProgreso.hide();
														    _this.smTGCmpActividades.clearSelections();
														    _this.stTGCmpActividades.reload({
																    params: {
																		    anode: null,
																		    start: _this.start
																    }
														    });
												    }else{
														    _this.BarraProgreso.hide();
														    mostrarMensaje(1, 'Error al guardar la información');
												    }

										    }

								    });
                }
						}
				});

				var proyecto = 0;
				_this.panelactividadrecurso_actParams = _this.objactivrecurso.dosgrids('adicionar', null,
            null,0, false, proyecto);
				_this.panelactividadrecurso_actParams.setTitle('Recursos');

				_this.tab_actParams = new Ext.TabPanel({
						height: 420,
						activeTab: 0,
						frame: true,
						items: [_this.form_actParams, _this.panelactividadrecurso_actParams],
						listeners: {
								tabchange: function (tabpanel, tabseleccionado) {
										if (tabseleccionado == _this.panelactividadrecurso_actParams){
												_this.window_actParams.setWidth(840);
												_this.window_actParams.setHeight(570);
												_this.window_actParams.center();
                    }else{
												_this.window_actParams.setWidth(500);
												_this.window_actParams.setHeight(330);
												_this.window_actParams.center();
                    }
                }
						}
        });

				_this.window_actParams = new Ext.Window({
						modal: true,
						closeAction: 'destroy',
						constrain: true,
						layout: 'fit',
						title: 'Actualizar párametros comunes',
						width: 500,
						height: 330,
						resizable: false,
						items: [_this.tab_actParams],
						buttons: [_this.btnCancelar_actParams, _this.btnAceptarwindow_actParams]
				});

				_this.window_actParams.show();
		}

		//Funcion que recarga y expande el nodo.
    /**
     * Funcion para dibujar criterio de busqueda por denominacion
     * **/

    this.searchView = function (val, columns, m, r) {
        var cantActivos = 0;
        var criterio = "";
        var filters_activos = _this.ftCmpActividades.filters.items;
        for (var i = 0; i < filters_activos.length; i++) {
            if (filters_activos[i].active) {
                cantActivos++;
            }
        }

        for (var k = 0; k < cantActivos; k++) {
            if (_this.stTGCmpActividades.lastOptions.params['filtros[' + k + '][field]'] == columns) {
                criterio = _this.stTGCmpActividades.lastOptions.params['filtros[' + k + '][data][value]'];
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
        } else
            respuesta = val;

        if (r.data.is_suspendida == 1) {
            respuesta = '<span class="tachar_black">' + respuesta + '</span>';
        }

        return respuesta;

    }

    this.validarParametros = function () {
        if(_this.tmfhora_actParams.getValue()=="" &&
		        _this.tmfhorafin_actParams.getValue()=="" &&
		        _this.f_inicio_actParams.getValue()=="" &&
		        _this.f_fin_actParams.getValue()=="" &&
		        _this.cb_tipo_actividad_actParams.getValue()=="" &&
		        _this.cb_categoria_actParams.getValue()=="" &&
		        _this.EsPrincipal()==0
          ){
		        mostrarMensaje(1, 'Debe cambiar algún parámetro');
		        return false;
        }
        return true;
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

    this.ExpandParent = function (arrayrecord) {
        if (arrayrecord.length > 0) {
            var node = arrayrecord[arrayrecord.length - 1];
            if (node.data._is_leaf == false) {
                _this.stTGCmpActividades.reload({
                    params: {
                        anode: node.id,
                        start: 0
                    },
                    callback: function () {
                        _this.stTGCmpActividades.collapseNode(node);
                        _this.stTGCmpActividades.setNodeLoaded(node, true);
                        _this.stTGCmpActividades.expandNode(node);
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
        } else {
            _this.ExpandNodesChildrens(_this.smTGCmpActividades.getSelections()[0]);
        }

    }

    //Funcion que recarga y expande el nodo.
    this.ExpandNodesChildrens = function (rec) {
        if (rec.data._is_leaf == false) {
            _this.stTGCmpActividades.reload({
                params: {
                    anode: rec.id,
                    start: 0
                },
                callback: function () {
                    _this.stTGCmpActividades.collapseNode(rec);
                    _this.stTGCmpActividades.setNodeLoaded(rec, true);
                    _this.stTGCmpActividades.expandNode(rec);
                    _this.ExpandAllChildren(rec);
                }
            });
        }
    }

    this.ExpandAllChildren = function (rec) {
        if (_this.analizados.indexOf("" + rec.id) == -1)
            _this.analizados.push(rec.id);
        for (var i = 0; i < _this.stTGCmpActividades.data.items.length; i++)
            if (_this.analizados.indexOf("" + _this.stTGCmpActividades.data.items[i].data._parent) != -1 &&
                _this.analizados.indexOf("" + _this.stTGCmpActividades.data.items[i].id) == -1) {
                _this.ExpandNodesChildrens(_this.stTGCmpActividades.data.items[i]);
            }
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

        //valor = replaceAll(valor, '%', '"');
        valor = valor.toString().replace('%', '"');
        m.attr = 'ext:qtip="<b>' + valor + '</b>"';

        if (p.data.is_suspendida == 1)
            return '<span class="icondistra-actividades sipac-gris">' + ' ' + _this.searchView(valor, "denominacion", m, p) + '</span>';

		    if (p.data.tienereasignaciones == 1)
				    return '<span class="icondistra-actividades sipac-verde-reasignacion">' + ' ' + _this.searchView(valor, "denominacion", m, p) + '</span>';

        if (p.data.tiporepeticion == null || p.data.tiporepeticion == '') {
            return '<span class="icondistra-actividades sipac-azul" >' + ' ' + _this.searchView(valor, "denominacion", m, p) + '</span>';
        } else {
            return '<span class="icondistra-actividades sipac-naranja" >' + ' ' + _this.searchView(valor, "denominacion", m, p) + '</span>';
        }
    }

    function autor(valor, m, p) {
        if (p.data.is_suspendida == 1) {
            return '<span class="tachar_black">' + _this.searchView(valor, "nombreautor", m, p) + '</span>';
        }
        else
            return _this.searchView(valor, "nombreautor", m, p);
    }

    function suspendidas(valor, m, r) {
        if (r.data.is_suspendida == 1) {
            return '<span class="tachar_black">' + valor + '</span>';
        }
        else
            return valor;
    }

    function suspendidasCAR(valor, m, r) {
        if (r.data.is_suspendida == 1) {
            return '<span class="tachar_red">' + valor + '</span>';
        }
        else
            return valor;
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
            return '<span class="icondistra-bandera sipac-roja">' + ' ' + suspendidas(val, b, c) + '</span>';
        }
        if (val3 > 0 && val3 < 95) {
            //return '<span><img src="../../../comun/recursos/images/fam/flag_yellow.png" >' + ' ' + val + '</span>';
            return '<span class="icondistra-bandera sipac-amarilla">' + ' ' + suspendidas(val, b, c) + '</span>';
        }
        if (val3 >= 95) {
            return '<span class="icondistra-bandera sipac-verde">' + ' ' + suspendidas(val, b, c) + '</span>';
        }
    }

    //funcion para mostrar el icono "estado de cumplimiento"
    function renderFecha(val) {
        if (val) {
            return (val.substring(8, 10) + ' / ' + val.substring(5, 7) + ' / ' + val.substring(0, 4));
        }
    }

    function MostrarImagenT(val, m, r) {
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
                    if (responseData.estadoaprobacion != null && responseData.estadoaprobacion != 'undefined' && responseData.estadoaprobacion != '0'
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
                    if (responseData.estadocumplimiento != null && responseData.estadocumplimiento != 'undefined' && responseData.estadocumplimiento != '0') {
                        _this.ftCmpActividades.filters.items[7].active = true;
                        if (responseData.estadocumplimiento == 1) {
                            _this.ftCmpActividades.filters.items[7].setValue('Sin cumplir');
                        } else if (responseData.estadocumplimiento == 2) {
                            _this.ftCmpActividades.filters.items[7].setValue('Parcialmente cumplido');
                        } else if (responseData.estadocumplimiento == 3) {
                            _this.ftCmpActividades.filters.items[7].setValue('Cumplida');
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

    this.verGraficas = function (panel) {
        winGraficas = new Ext.Window({
            layout: 'fit',
            title: 'Estadística',
            constrain: true,
            closable: true,
            maximized: false,
            modal: true,
            closeAction: 'hide',
            width: 1000,
            height: 550,
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
        _this.arrayidactividades = (opcionesConfig.arrayidactividades) ? opcionesConfig.arrayidactividades : _this.arrayidactividades;
        if (_this.arrayidactividades.length > 0) {
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
                        if (_this.smTGCmpActividades.isSelected()) _this.smTGCmpActividades.clearSelections();
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
                                if (Ext.getCmp('nfActCumplimiento').isValid()) {
                                    _this.BarraProgreso.show('Actualizando cumplimiento');
                                    Ext.Ajax.request({
                                        url: '/planificacion/pdo/plan/index.php/cmpgestionaractividades/actualizarCumplimiento',
                                        params: {
                                            arrayidactividades: Ext.encode((opcionesConfig.arrayidactividades) ? opcionesConfig.arrayidactividades : _this.arrayidactividades),
                                            cumplimiento: Ext.getCmp('nfActCumplimiento').getValue(),
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
                                    id: 'nfActCumplimiento',
                                    maxValue: 100,
                                    maxText: 'Solo admite números enteros positivos entre 0 y 100. Con 2 cifras decimales.',
                                    minValue: 0,
                                    minText: 'Solo admite números enteros positivos entre 0 y 100. Con 2 cifras decimales.',
                                    allowBlank: false,
                                    regex: /^[0-9]+([.][0-9][0-9]?)?$/,
                                    allowNegative: false,
                                    regexText: 'Solo admite números enteros positivos entre 0 y 100. Con 2 cifras decimales.',
                                    nanText: 'Solo admite números enteros positivos entre 0 y 100. Con 2 cifras decimales.',
                                    anchor: '90%'
                                })
                            ]
                        })
                    ]
                });
                _this.winActualizarCumplimiento.on('beforeshow', function () {
                    Ext.getCmp('nfActCumplimiento').focus(true, 700);
                });
                _this.winActualizarCumplimiento.doLayout();
                _this.winActualizarCumplimiento.show();
                Ext.getCmp('nfActCumplimiento').focus(false, 1024);
            }
        } else mostrarMensaje(1, 'No existe(n) actividad(es) seleccionada(s).');

    };
    this.comprobarPermisos = function (record) {
        if (_this.smTGCmpActividades.hasSelection() && _this.smTGCmpActividades.getSelections().length == 1) {
            //this.BarraProgreso.show('Comprobando permisos');
            var modificar = 0;
            var eliminar = 0;
            Ext.Ajax.request({
                url: '/planificacion/pdo/plan/index.php/cmpgestionaractividades/comprobarPermisos',
                params: {
                    idautoractividad: Ext.encode(record.data.idautor),
                    idactividad: Ext.encode(record.data.idelemento),
                    superior: Ext.encode(record.data.superior)
                },
                callback: function (options, success, response) {
                    responseData = Ext.decode(response.responseText);
                    if (responseData.respuesta.modificar) {
                        _this.permitirmodificar = 1;
                    } else {
                        _this.permitirmodificar = 0;
                    }
                    if (responseData.respuesta.eliminar) {
                        _this.permitireliminar = 1;
                    } else {
                        _this.permitireliminar = 0;
                    }
                    if (_this.permitirmodificar) {
                        _this.btnModificar.enable();
                        _this.btnActualizarParametros.enable();
                        _this.btnAsociarInvolAct.enable();
                        _this.mostrarmenuaprob = 1;
                        _this.menuModificarFecha.enable();
                    }
                    if (_this.permitireliminar) {
                        _this.btnEliminar.enable();
                    }else{
                        _this.btnEliminar.disable();
                    }

                    var tienepuntualizacion = record.data.tienepuntualizacion;
                    if (record.data.generacontrol == 1 && !tienepuntualizacion) {
                        _this.btnPuntualizar.enable();
                        _this.btnSuspender.enable();
                    }

                    if (_this.hay_suspendidas) {
                        _this.btnAdicionar.disable();
                        _this.btnModificar.disable();
                        _this.btnActualizarParametros.disable();
                        _this.btnExpandirPadre.disable();
                        _this.btnPuntualizar.disable();
                        _this.btnSuspender.disable();
                        _this.btnReorganizar.disable();
                        _this.btnHacerRaiz.disable();
                        // _this.btnVerDatos.disable();
                        _this.btnHistorial.disable();
                        _this.btnAlarma.disable();
                        _this.btnSeleccionar.disable();
                        // _this.btnEliminar.disable();
                        _this.btnExportar.disable();
                        _this.btnDuplicar.disable();
                        _this.btnCambiarEstado.disable();
                        _this.btnControlReagsinacion.disable();
                        _this.btnRelaciones.disable();
                        _this.btnGestObs.disable();
                        _this.btn100.disable();
                        _this.btnOtroValor.disable();
                        _this.btnAsociarInvolAct.disable();
                        _this.menuModificarFecha.disable();
                        _this.btnMostrarSubordinacion.disable();
                    }

                    _this.resultadoComprobarPermisos(response);

                    if (_this.btnPuntualizar.isDisable() && _this.menuPuntualizar != null) {
                        _this.menuPuntualizar.disable();
                    } else if (_this.menuPuntualizar) _this.menuPuntualizar.enable();

                    if (_this.btnSuspender.isDisable() && _this.menuSuspender != null) {
                        _this.menuSuspender.disable();
                    } else if (_this.menuSuspender) _this.menuSuspender.enable();

                }
            });

        }
    }

    this.resultadoComprobarPermisos = function (response) {
        responseData = Ext.decode(response.responseText);
        if (responseData.respuesta.modificar) {
            _this.permitirmodificar = 1;
        } else {
            _this.permitirmodificar = 0;
        }
        if (responseData.respuesta.eliminar) {
            _this.permitireliminar = 1;
        } else {
            _this.permitireliminar = 0;
        }
    }

    this.asociarInvolAct = function () {
        if (_this.smTGCmpActividades.hasSelection()) {
            this.btnCancelarAsociar = new Ext.Button({
                handler: function () {
                    _this.winAsociarInvolAct.destroy();
                },
                iconCls: 'cancelar ',
                text: 'Cancelar ',
                tooltip: 'Cerrar ventana sin guardar los datos',
                id: 'btnCancelarAsociar',
                nextTab: 'btnAceptarAsociar',
                prevTab: 'btnActualizarExpandirAgrupacion'
            });
            this.btnAceptarAsociar = new Ext.Button({
                handler: function () {
                    _this.asociarInvolucrados();
                },
                iconCls: 'aceptar ',
                text: 'Aceptar ',
                tooltip: 'Guardar datos y cerrar ventana',
                id: 'btnAceptarAsociar',
                disabled: true,
                nextTab: 'tfbuscarInv',
                prevTab: 'btnCancelarAsociar'
            });
            var parametros = {arrayactividadesseleccionadas: _this.arrayactividadesseleccionadas}
            this.pClasificadorInvol = _this.objclasificadorinvol.CrearClasificadorInvol(idelemento = undefined, tipoelemento = 3, estamodificando = 0, idautor = null, parametros);

            this.pAsociarInvolAct = new Ext.FormPanel({
                id: 'pAsociarInvolAct',
                items: [_this.pClasificadorInvol],
                listeners: {
                    'clientvalidation': function (fm, valid) {
                        if (_this.objclasificadorinvol.verificarCantInv) {
                            _this.btnAceptarAsociar.enable();
                        } else {
                            _this.btnAceptarAsociar.disable();
                        }
                    }
                }

            });

            if (_this.winAsociarInvolAct) {
                _this.winAsociarInvolAct.destroy();
            }
            var titulo = (_this.smTGCmpActividades.getSelections().length > 1) ? 'Asociar involucrados a las actividades seleccionadas' : 'Asociar involucrados a la actividad seleccionada';
            this.winAsociarInvolAct = new Ext.Window({
                title: titulo,
                width: 712,
                height: 330,
                modal: true,
                closeAction: 'destroy',
                constrain: true,
                resizable: false,
                buttons: [_this.btnCancelarAsociar, _this.btnAceptarAsociar],
                items: [_this.pAsociarInvolAct]
            });
            _this.winAsociarInvolAct.on('beforeshow', function () {
                _this.btnCancelarAsociar.focus(true, 700);
            });
            _this.winAsociarInvolAct.doLayout();
            _this.winAsociarInvolAct.show();
            _this.btnCancelarAsociar.focus(false, 1024);
        } else {
            mostrarMensaje(1, 'Debe seleccionar al menos una actividad para poder involucrar usuarios.');
        }
    }

    this.asociarInvolucrados = function () {
        var arrayinvolucrados = _this.objclasificadorinvol.ObtenerInvolucrados();
        var cantinvol = Object.keys(arrayinvolucrados).length;
        if (cantinvol > 0) {
            var msj = (cantinvol > 1) ? 'Asociando involucrados' : 'Asociando involucrado';
            this.BarraProgreso.show(msj);
            Ext.Ajax.request({
                url: '/planificacion/pdo/plan/index.php/cmpgestionaractividades/asociarInvolucrados',
                params: {
                    arrayactividadesseleccionadas: Ext.encode(_this.arrayactividadesseleccionadas),
                    arrayinvolucrados: Ext.encode(arrayinvolucrados)
                },
                callback: function (options, success, response) {
                    _this.BarraProgreso.hide();
                    responseData = Ext.decode(response.responseText);
                    if (responseData.mensaje == 1) {
                        mostrarMensaje(1, 'La asociaci&oacute;n se ha realizado satisfactoriamente.');
                    }
                    if (responseData.mensaje == 0) {
                        mostrarMensaje(1, 'Ha ocurrido un error al realizar la asociaci&oacute;n.');
                    }
                    if (responseData.mensaje == 2) {
                        mostrarMensaje(1, 'La asociaci&oacute;n se ha realizado satisfactoriamente para las actividades seleccionadas con permiso de escritura.');
                    }
                    if (responseData.mensaje == 3) {
                        mostrarMensaje(1, 'La asociaci&oacute;n se ha realizado satisfactoriamente para la actividad seleccionada con permiso de escritura.');
                    }
                    if (responseData.mensaje == 4) {
                        var cantActvSelec = Object.key(_this.arrayactividadesseleccionadas).length;
                        var msj = (cantActvSelec > 1) ? 'Las actividades seleccionadas no pueden ser modificadas.' : 'Las actividad seleccionada no puede ser modificada.';
                        mostrarMensaje(1, msj);
                    }
                    _this.winAsociarInvolAct.destroy();
                    _this.smTGCmpActividades.clearSelections();
                }
            });
        } else
            mostrarMensaje(1, 'Debe seleccionar al menos un involucrado.');
    }

    this.crearVentanaModificarFechaActividad = function () {
        if (_this.smTGCmpActividades.hasSelection() && _this.smTGCmpActividades.getSelections().length == 1) {
            var parametros = {
                idactividad: _this.arrayidactividades[0],
                sm: _this.smTGCmpActividades,
                st: _this.stTGCmpActividades
            }
            _this.objcmpfondodetiempo.crearWinModificarFechaActividad(parametros);

        } else
            mostrarMensaje(1, 'Debe seleccionar una actividad.');
    }

    this.modificarFechaActividad = function (fecha) {
        if (_this.smTGCmpActividades.hasSelection() && _this.smTGCmpActividades.getSelections().length == 1) {
            var msj = 'Modificando fecha de inicio de la actividad';
            this.BarraProgreso.show(msj);
            Ext.Ajax.request({
                url: '/planificacion/pdo/plan/index.php/cmpgestionaractividades/modificarFechaActividad',
                params: {
                    idactividad: _this.arrayidactividades[0],
                    fecha: fecha
                },
                callback: function (options, success, response) {
                    _this.BarraProgreso.hide();
                    responseData = Ext.decode(response.responseText);
                    if (responseData.mensaje == 1) {
                        msj = 'La actividad ha sido modificada satisfactoriamente.';
                        mostrarMensaje(1, msj);
                    }
                    if (responseData.mensaje == 0) {
                        msj = 'Ha ocurrido un error al modificar la actividad.';
                        mostrarMensaje(1, msj);
                    }
                    if (responseData.mensaje == 2) {
                        msj = 'Debe seleccionar una actividad.';
                        mostrarMensaje(1, msj);
                    }
                    _this.stTGCmpActividades.reload();
                    _this.smTGCmpActividades.clearSelections();
                }
            });
        } else
            mostrarMensaje(1, 'Debe seleccionar una actividad.');
    }

    this.ActualizarEstadoBarraHerramientas = function () {
        _this.arrayidactividades = [];
        _this.arrayidestadoaprob = [];
        _this.arraynombreactividades = [];
        _this.arrayactividadesseleccionadas = [];
        _this.btnAdicionar.enable();
        _this.btnModificar.disable();
        _this.btnExpandirPadre.disable();
        _this.btnPuntualizar.disable();
        _this.btnSuspender.disable();
        _this.btnReorganizar.disable();
        _this.btnHacerRaiz.disable();
        _this.btnVerDatos.disable();
        _this.btnHistorial.disable();
        _this.btnAlarma.disable();
        _this.btnEnviarCorreo.disable();
        _this.btnGestionDocumentos.disable();
        _this.btnSeleccionar.disable();
        _this.btnEliminar.disable();
        _this.btnActualizarParametros.disable();
        _this.btnExportar.disable();
        _this.btnDuplicar.disable();
        _this.btnCambiarEstado.disable();
        _this.btnControlReagsinacion.disable();
        _this.btnRelaciones.disable();
        _this.btnGestObs.disable();
        _this.btn100.disable();
        _this.btnOtroValor.disable();
        _this.btnAsociarInvolAct.disable();
        _this.menuModificarFecha.disable();
        _this.btnMostrarSubordinacion.disable();
        var idestadoaprob = null;
        _this.hay_suspendidas = false;
        _this.idaprobdiferentes = 0;
        _this.mostrarmenuaprob = 0;
        //_this.permitirmodificar = 0;
        //_this.permitireliminar = 0;
        _this.permitirduplicar = 0;
        _this.permitirrelaciones = 0;
        _this.permitirreasignar = 0;
        _this.permitirreordenarhijos = 0;
        _this.subordinados = 0;

        _this.actBienestar = false;

        if (_this.smTGCmpActividades.hasSelection()) {
            var arrayrecords = _this.smTGCmpActividades.getSelections();
            var totalrecords = arrayrecords.length;
            if (totalrecords == 1) {
                _this.btnCambiarEstado.enable();
            }
            (totalrecords <= 1) ? _this.btnAdicionar.enable() : _this.btnAdicionar.disable();
            if (totalrecords > 0) {
                _this.btnExportar.enable();
                var puedemodificar = 1;
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

                    if (arrayrecords[i].data._parent == null) {
                        puedereordenarhijos = 0;
                    }

                    if (arrayrecords[i].data.numcaso != "") {
                        _this.actBienestar = true;
                    }

                    if (arrayrecords[i].data.subordinado == 0) {
                        subordinados = 0;
                    }
                    _this.arrayidestadoaprob[i] = arrayrecords[i].data.idestadoaprob;
                    _this.arrayidactividades[i] = arrayrecords[i].data.idelemento;
                    _this.arraynombreactividades[i] = arrayrecords[i].data.denominacion;
                    var elementoseleccionado = {};
                    if (arrayrecords[i].data.is_suspendida == 1)
                        _this.hay_suspendidas = true;
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
                if (totalrecords == 1) {
                    _this.btnGestionDocumentos.enable();
                    _this.btnDuplicar.enable();
                    _this.permitirduplicar = 1;
                    _this.btnGestObs.enable();
                    _this.btnVerDatos.enable();
                    _this.btnHistorial.enable();
                    _this.btnAlarma.enable();
                    _this.btnMostrarSubordinacion.enable();

                    var record = arrayrecords[0];
                    var usuario_autenticado = window.perfil.idusuario;

                    if (usuario_autenticado == record.data.idautor) {
                        // _this.btnControlReagsinacion.disable();
                        _this.btnControlReagsinacion.enable();
                    } else {
                        _this.permitirreasignar = 1;
                        _this.btnControlReagsinacion.enable();
                    }
                    _this.comprobarPermisos(record);

                }
                _this.btnRelaciones.enable();
                _this.permitirrelaciones = 1;

                if (totalrecords > 1) {
                    _this.btnEliminar.enable();
                    _this.btnAsociarInvolAct.enable();
		                _this.btnActualizarParametros.enable();
                    _this.btnGestionDocumentos.disable();
                    _this.permitirreasignar = 1;
                    _this.btnControlReagsinacion.enable();
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

                _this.btnExpandirPadre.enable();

                var idestadoaprob = arrayrecords[0].data.idestadoaprob;
                _this.aprobada = true;
                for (var i = 0; i < arrayrecords.length; i++) {
                    if (idestadoaprob != arrayrecords[i].data.idestadoaprob) {
                        _this.btnCambiarEstado.disable();
                    } else {
                        _this.btnCambiarEstado.enable();
                    }

                    if(!arrayrecords[i].data.nombreestadoaprob.includes("Aprobado")){
                        _this.aprobada = false;
                    }
                }

                if(_this.aprobada)
                    _this.btnEnviarCorreo.enable();
                else
                    _this.btnEnviarCorreo.disable();



                if(_this.actBienestar){
                    _this.btn100.disable();
                    _this.btnOtroValor.disable();
                }else{
                    _this.btn100.enable();
                    _this.btnOtroValor.enable();
                }


                if (_this.hay_suspendidas) {
                    _this.permitirmodificar = 0;
                    _this.btnAdicionar.disable();
                    _this.btnModificar.disable();
                    _this.btnActualizarParametros.disable();
                    _this.btnExpandirPadre.disable();
                    _this.btnPuntualizar.disable();
                    _this.btnSuspender.disable();
                    _this.btnReorganizar.disable();
                    _this.btnHacerRaiz.disable();
                    // _this.btnVerDatos.disable();
                    _this.btnHistorial.disable();
                    _this.btnAlarma.disable();
                    _this.btnSeleccionar.disable();
                    // _this.btnEliminar.disable();
                    _this.btnExportar.disable();
                    _this.btnDuplicar.disable();
                    _this.btnCambiarEstado.disable();
                    _this.btnControlReagsinacion.disable();
                    _this.btnRelaciones.disable();
                    _this.btnGestObs.disable();
                    _this.btn100.disable();
                    _this.btnOtroValor.disable();
                    _this.btnAsociarInvolAct.disable();
                    _this.menuModificarFecha.disable();
                    _this.btnMostrarSubordinacion.disable();
                }
            }
        }

    };

    this.CargarVentanaImportarActividades = function () {

        _this.fpImportarActividades = new Ext.FormPanel({
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

        _this.btnCancelarActividades = new Ext.Button({
            iconCls: 'cancelar',
            text: 'Cancelar',
            tooltip: 'Cerrar ventana sin guardar los datos',
            handler: function () {
                _this.fpImportarActividades.getForm().reset();
                _this.wImportarActividades.hide();
            }
        });

        _this.btnAceptarActividades = new Ext.Button({
            iconCls: 'aceptar',
            text: 'Aceptar',
            tooltip: 'Guardar datos y cerrar ventana',
            handler: function () {
                _this.importarElementos();
            }
        });

        _this.importarElementos = function () {
            var barraImporActividades = Ext.MessageBox.show({
                title: 'Importando datos',
                msg: 'Espere por favor esto puede demorar unos minutos...',
                width: 270,
                wait: true,
                progress: true,
                closable: false
            });
            _this.fpImportarActividades.getForm().submit(
                {
                    method: 'POST',
                    url: "importarActividades",
                    timeout: 3600000,
                    params: {
                        idpadre: (_this.smTGCmpActividades.getSelected() != undefined) ? _this.smTGCmpActividades.getSelected().id : null
                    },
                    failure: function (form, action) {
                        barraImporActividades.hide();
                        if (action.result.mensaje == 1) {
                            mostrarMensaje(1, 'Los datos fueron cargados correctamente.');
                            _this.fpImportarActividades.getForm().reset();
                            _this.wImportarActividades.hide();
                            _this.stTGCmpActividades.reload();

                            if (_this.smTGCmpActividades.getSelected() != undefined) {
                                var rec = _this.smTGCmpActividades.getSelected();
                                var recparent = _this.stTGCmpActividades.getById(rec.data.idelemento);
                                if (rec.data._is_leaf) {
                                    recparent.set('_is_leaf', false);
                                    _this.TGCmpActividades.getView().refresh();
                                }
                                _this.smTGCmpActividades.selectRecords([recparent]);
                                _this.RecargarNodo(recparent.id, 0, recparent);

                            }

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

        _this.wImportarActividades = new Ext.Window({
            modal: true,
            closeAction: 'hide',
            constrain: true,
            layout: 'fit',
            title: 'Importar archivo',
            width: 420,
            height: 130,
            items: [_this.fpImportarActividades],
            buttons: [_this.btnCancelarActividades, _this.btnAceptarActividades]
        });
        _this.wImportarActividades.show();

    }

	function BuscarSubordinadosArbol() {
				if (_this.tpsubordinacion.getRootNode().hasChildNodes()) {
						var denominacionbusqueda = _this.tfbuscarSub.getValue().toLowerCase();
						_this.tpsubordinacion.getRootNode().eachChild(function (node) {
								var denominacionnodo = node.text.toLowerCase();
								if (denominacionnodo.indexOf(denominacionbusqueda) != -1) {
										node.ui.show();
								} else {
										node.ui.hide();
								}
						});
				}
		}


    this.crearVentanaArbolSubordinacion = function () {
        if (_this.smTGCmpActividades.hasSelection() && _this.smTGCmpActividades.getSelections().length == 1) {
            var record = _this.smTGCmpActividades.getSelections();
            var idautoractividad = record[0].data.idautor;
            if (_this.winArbolSubordinacion)
                _this.winArbolSubordinacion.destroy();

		        this.tfbuscarSub = new Ext.form.TextField({
				        id: 'tfbuscarSub',
				        enableKeyEvents: true,
				        regex: _this.ObjValidaciones.expresionRegular('denominacion'),
				        maskRe: /^([a-zA-Z0-9áéíóúüÁÉÍÓÚñÑÜ"' ,./()_-])$/,
				        regexText: _this.ObjValidaciones.ObtenerMsjErrorTextoRegido('denominacion'),
				        vtype: 'validarEspaciosEnBlanco',
				        maxLength: 255,
				        width: 200,
				        listeners: {
						        keyup: function (tf, e) {
								        BuscarSubordinadosArbol();
						        }
				        }
		        });


            //arbol donde muesto los usuarios
            this.tpsubordinacion = new Ext.tree.TreePanel({
                autoScroll: true,
                tbar: ['Buscar: ', _this.tfbuscarSub, '->',
                    {
                        id: _this.idcmp + 'expanSubDirecta',
                        nextTab: _this.idcmp + 'contraerSubDirecta',
                        prevTab: _this.idcmp + 'cerrarSubDirecta',
                        iconCls: 'expandir',
                        tooltip: 'Expandir todo el árbol de subordinaci&oacute;n',
                        handler: function () {
                            _this.tpsubordinacion.root.expand(true);
                        }
                    }, {
                        id: _this.idcmp + 'contraerSubDirecta',
                        nextTab: _this.idcmp + 'actualSubDirecta',
                        prevTab: _this.idcmp + 'expanSubDirecta',
                        iconCls: 'contraer',
                        tooltip: 'Contraer todo el árbol de subordinaci&oacute;n ',
                        handler: function () {
                            _this.tpsubordinacion.root.collapse(true);
                        }
                    }, {
                        id: _this.idcmp + 'actualSubDirecta',
                        nextTab: _this.idcmp + 'cerrarSubDirecta',
                        prevTab: _this.idcmp + 'contraerSubDirecta',
                        iconCls: 'actualizar',
                        tooltip: 'Actualizar el árbol de subordinaci&oacute;n ',
                        handler: function () {
                            _this.tpsubordinacion.getRootNode().reload();
                        }
                    }
                ],
                bbar: ['Leyenda: ', ' ',
                    {
                        xtype: 'tbtext',
                        text: '<center><span class="icondistra-usuario"></span></center>'
                    }, 'Subordinados directos ', ' ', {
                        xtype: 'tbtext',
                        text: '<center><span class="icondistra-persona"></span></center>'
                    }, 'Subordinados indirectos'
                ],
                listeners: {
                    'click': function (anode) {
                        setFocusBtnCerrarSubDirecta();
                    },
                    collapsenode: function (anode) {
                        setFocusBtnCerrarSubDirecta();
                    },
                    expandnode: function (anode) {
                        setFocusBtnCerrarSubDirecta();
                    },
                },
                root: {
                    nodeType: 'async',
                    id: 0,
                    idsubordinado: 0,
                    text: 'Cadena de subordinaci&oacute;n',
                    leaf: false
                },
                loader: new Ext.tree.TreeLoader({
                    singleClickExpand: true,
                    dataUrl: '/planificacion/pdo/configuracion/index.php/gestionarpermisos/cargarcadenasubordinacion',
                    listeners: {
                        'beforeload': function (atreeloader, anode) {
                            atreeloader.baseParams = {
                                idsubordinado: anode.attributes.idsubordinado,
                                idautoractividad: idautoractividad
                            };
                        }
                    }
                })
            });
            //ventana donde muestro los usuarios
            this.winArbolSubordinacion = new Ext.Window({
                title: 'Árbol de subordinaci&oacute;n',
                width: 350,
                constrain: true,
                height: 450,
                layout: 'fit',
                modal: true,
                items: _this.tpsubordinacion,
                buttons: [
                    new Ext.Button({
                        id: _this.idcmp + 'cerrarSubDirecta',
                        nextTab: _this.idcmp + 'expanSubDirecta',
                        prevTab: _this.idcmp + 'actualSubDirecta',
                        iconCls: 'cerrar',
                        text: 'Cerrar',
                        handler: function () {
                            _this.winArbolSubordinacion.destroy();
                        },
                        tooltip: 'Cerrar ventana'
                    })
                ],
                listeners: {
                    move: function (cmp) {
                        setFocusBtnCerrarSubDirecta();
                    },
                    resize: function (cmp) {
                        setFocusBtnCerrarSubDirecta();
                    }
                }
            });
            _this.winArbolSubordinacion.show();
            setFocusBtnCerrarSubDirecta();
            _this.tpsubordinacion.getRootNode().reload();

            function setFocusBtnCerrarSubDirecta() {
                setTimeout(function () {
                    Ext.getCmp(_this.idcmp + 'cerrarSubDirecta').focus(true);
                }, 500);
            }
        } else {
            mostrarMensaje(1, 'Debe seleccionar una actividad.');
        }

    }

    this.restaFechas = function (f1, f2) {
				var aFecha1 = f1.split('/');
				var aFecha2 = f2.split('/');
				var fFecha1 = Date.UTC(aFecha1[2], aFecha1[1] - 1, aFecha1[0]);
				var fFecha2 = Date.UTC(aFecha2[2], aFecha2[1] - 1, aFecha2[0]);
				var dif = fFecha2 - fFecha1;
				var dias = Math.floor(dif / (1000 * 60 * 60 * 24));
				return dias;
		}

	this.validarHorasLaborables = function (fini, ffin) {
				if (fini.isValid() && ffin.isValid()) {
						_this.horaslaborables = ((((ffin.getValue() - fini.getValue()) / 86400) / 1000) + 1) * 24;  //24 horas
						_this.tiempoestimado.maxValue = _this.horaslaborables;
						var maxText = 'Solo admite números enteros positivos entre 0 y ' + horaslaborables + '. Con 2 cifras decimales.';
						_this.tiempoestimado.maxText = maxText;
						_this.tiempoestimado.validate();
				}
		};

	this.validarHoraInicioFin = function (timefield, eshorafin) {
				if (!_this.f_inicio_actParams.isValid() || !_this.f_fin_actParams.isValid()) {
						timefield.markInvalid('Debe validar los campos fecha de inicio y/o fecha de fin.');
				} else {
						var msj = "La hora de inicio debe ser menor que la hora de fin.";
						if (eshorafin) {
								msj = "La hora de fin debe ser mayor que la hora de inicio.";
						}
						var vHoraFinal = false;
						var vHoraInicial = false;
						if (_this.tmfhorafin_actParams.isValid() && _this.tmfhorafin_actParams.getRawValue()!='') {
								vHoraFinal = Date.parseDate(_this.tmfhorafin_actParams.getValue(), _this.formatohora).format("U");
						}
						if (_this.tmfhora_actParams.isValid() && _this.tmfhora_actParams.getRawValue()!='') {
								vHoraInicial = Date.parseDate(_this.tmfhora_actParams.getValue(), _this.formatohora).format("U");
						}
						if (vHoraInicial && vHoraFinal) {
								var vFechaInicial = _this.f_inicio_actParams.getValue().format('d/m/Y');
								var vFechaFin = _this.f_fin_actParams.getValue().format('d/m/Y');
								var nopuedeSeleccionar = ((vFechaFin == vFechaInicial) && (vHoraInicial > vHoraFinal));
								if (nopuedeSeleccionar) {
										timefield.markInvalid(msj);
								} else {
										_this.tmfhorafin_actParams.clearInvalid();
										_this.tmfhora_actParams.clearInvalid();
								}
						}
				}
		};

    //funcion para suspender actividades
    this.SuspenderActividades = function () {
        var seleccion_actividades = _this.smTGCmpActividades.getSelections();
        var msg = "la actividad seleccionada";
        if (seleccion_actividades.length > 1)
            msg = "las actividades seleccionadas";
        mostrarMensaje(2, '¿Está seguro que quiere suspender ' + msg + '?', ejecuta);

        function ejecuta(btnPresionado) {
            if (btnPresionado == 'ok') {
                var idsactividades = [];
                Ext.each(seleccion_actividades, function (r) {
                    idsactividades.push(r.data.idelemento);
                });
                var sms = 'Suspendiendo actividad';
                _this.BarraProgreso.show(sms);
                Ext.Ajax.request({
                    url: '/planificacion/pdo/plan/index.php/cmpgestionaractividades/SuspenderActividad',
                    params: {
                        idsactividades: Ext.encode(idsactividades)
                    },
                    callback: function (options, success, response) {
                        _this.BarraProgreso.hide();
                        var responseData = Ext.decode(response.responseText);
                        msj = 'La actividad ha sido suspendida satisfactoriamente.';
                        if (responseData.mensaje == 1) {
                            mostrarMensaje(1, msj);
                            _this.stTGCmpActividades.reload({
                                params: {
                                    anode: null,
                                    start: _this.start
                                }
                            });
                        }
                    }
                });
            }
        }
    };

};
