Utilidades.Cmp.Cmpgestionarobjetivos = function (opcionesConfig) {
    var _this = this;
    Ext.Ajax.timeout = 1000000000;
    this.prevrow = -1;
    this.idtipodocumento = 1;
    this.idaprobdiferentes = 0;
    this.eshija = 0;
    this.busqueda = 0;
    this.pgactual = 0;
    this.posteliminar = false;

    //componente para el manejo de los mensajes de errores de texto regido
    this.ObjValidaciones = new Utilidades.Cmp.Cmpvalidaciones();
    this.objHistorial = new Utilidades.Cmp.Cmphistorial({mostrarVentana: false, panel: 'obj'});

    //objeto CRUD-objetivo inicializado
    this.objCrudObjetivo = new Utilidades.Cmp.Cmpcrudobjetivos();

    //objeto del componente observaciones inicializado
    this.objCmpObservaciones = new Utilidades.Cmp.Cmpgestionarobservaciones();

    //objeto del componente "clasificador de involucrados"
    this.objclasificadorinvol = new Utilidades.Cmp.Cmpclasificadorinvol();

    //objeto del componente "barra de progreso"
    this.BarraProgreso = new BarraEstado();

    //objeto del componente "pareto"
    this.objgraficas = new Utilidades.Cmp.Cmpgestionargraficas();

    //objeto del componente "relaciones"
    this.objcmprelaciones = new Utilidades.Cmp.Cmprelaciones();

    //objeto del componente "exportarimportar"
    this.cmpexpimp = new Utilidades.Cmp.Cmpexportarimportar();
    //objeto de configuracion de perfil
    this.objconfiguracionperfil = new Utilidades.Cmp.Cmpconfigurarperfil({mostrarVentana: false, panel: 'obj'});

    //objeto del componente "notificaciones"
    this.objCmpNotificaciones = new Utilidades.Cmp.CmpNotificaciones(
        {
            MostrarFiltroPorTipoElem: true,
            UsarBtnCerrar: false,
            maxWinPrincipal: false,
            closeableWinPrincipal: true,
            Mostrartitle: 'Registro de notificaciones',
            noUsarAyuda: true
        });
    //variables 
    this.opcionBusqueda = 3;
    this.arrayidobjetivos = [];
    this.arrayidestadoaprob = [];
    this.arraynombreobjetivos = [];
    this.arrayobjetivosseleccionados = [];
    this.arrayidobjetivosReorganizar = [];
    this.eshija = 0;
    this.start = 0;
    this.idtipoelementotributa = null;
    this.idtipoelementotributasuperior = 0;
    this.permitirmodificar = 0;
    this.permitireliminar = 0;
    this.permitirduplicar = 0;
    this.permitirrelaciones = 0;
    this.permitirreasignar = 0;

    //botones para la gestion de los objetivos
    this.btnAdicionar = new Ext.Button({
        handler: function () {
            if (_this.arrayobjetivosseleccionados.length == 0) {
                _this.eshija = 0;
                _this.objCrudObjetivo.CrearWinCrudObjetivos(
                    new Date().format('d/m/Y'),
                    new Date().format('d/m/Y'),
                    'Adicionar',
                    _this.PostAccionesGestionar,
                    _this.arrayidobjetivos,
                    null,
                    _this.eshija,
                    permisomodificar = 1,
                    permisoeliminar = 1,
                    _this.objcmprelaciones.ObtenerElementosRelacionadosIniciales(),
                    _this.smTGCmpObjetivos,
                    _this.stTGCmpObjetivos);
            } else if (_this.arrayobjetivosseleccionados.length == 1) {
                _this.eshija = 1;
                _this.objCrudObjetivo.CrearWinCrudObjetivos(
                    new Date().format('d/m/Y'),
                    new Date().format('d/m/Y'),
                    'Adicionar',
                    _this.PostAccionesGestionar,
                    _this.arrayidobjetivos,
                    null,
                    _this.eshija,
                    permisomodificar = 1,
                    permisoeliminar = 1,
                    _this.objcmprelaciones.ObtenerElementosRelacionadosIniciales(),
                    null,
                    _this.stTGCmpObjetivos);
            }
        },
        hidden: opcionesConfig.noUsarAdicionar,
        disabled: false,
        iconCls: 'adicionar',
        tooltip: 'Adicionar objetivo',
        key: {
            alt: true,
            key: 'I'
        },
        scope: this
    });
    this.btnModificar = new Ext.Button({
        handler: function () {
            _this.eshija = 0;
            _this.objCrudObjetivo.CrearWinCrudObjetivos(
                new Date().format('d/m/Y'),
                new Date().format('d/m/Y'),
                'Modificar',
                _this.PostAccionesGestionar,
                _this.arrayidobjetivos,
                _this.arrayobjetivosseleccionados[0].idautor,
                _this.eshija,
                permisomodificar = 1,
                permisoeliminar = 1,
                _this.objcmprelaciones.ObtenerElementosRelacionadosIniciales(),
                _this.smTGCmpObjetivos);
        },
        hidden: opcionesConfig.noUsarModificar,
        disabled: true,
        iconCls: 'modificar',
        tooltip: 'Modificar objetivo',
        key: {
            alt: true,
            key: 'M'
        },
        scope: this
    });

    this.btnGraficas = new Ext.Button({
        handler: function () {
            _this.verGraficas(_this.objgraficas.obtenerPanelGraficasCriterio());
        },
        iconCls: 'graficar',
        tooltip: 'Estadística'
    });

    this.btnEliminar = new Ext.Button({
        handler: function () {
            _this.eshija = 0;
            _this.objCrudObjetivo.EliminarObjetivos(
                _this.arrayidobjetivos, _this.PostAccionesGestionar,
                _this.smTGCmpObjetivos);
        },
        hidden: opcionesConfig.noUsarEliminar,
        disabled: true,
        iconCls: 'eliminar',
        tooltip: 'Eliminar objetivo',
        key: {
            key: Ext.EventObject.DELETE
        },
        scope: this
    });
    //inicializando el objeto menu dinamico
    if (_this.objcmpmenurelaciones) {
        _this.objcmpmenurelaciones = null;
    }
    _this.objcmpmenurelaciones = new Utilidades.Cmp.CmpMenuRelacionesDinamicas();
    this.btnCambiarEstado = new Ext.Button({
        disabled: true,
        tooltip: 'Cambiar el estado de aprobaci&oacute;n del(de los) objetivo(s)',
        iconCls: 'cambiodestado',
        id: 'btnitmaprov',
        menu: _this.objcmpmenurelaciones.menuinicial,
        handler: function () {
            var mensaje = '';
            if (_this.arrayobjetivosseleccionados.length > 1) {
                mensaje = 'No existen otros estados al cual usted pueda cambiar los objetivos desde el estado actual.';
            } else {
                mensaje = 'No existen otros estados al cual usted pueda cambiar el objetivo desde el estado actual.';
            }
            //actualizar el sub-menu de Cambiar estado
            _this.objcmpmenurelaciones.CrearMenuAprobacionConc(
                _this.AccionesPostEjecutarFT, mensaje,
                _this.TGCmpObjetivos,
                _this.menuderechoTGCmpObjetivos,
                _this.arrayidobjetivos,
                _this.arrayidestadoaprob,
                _this.idtipodocumento
            );
        }
    });
    this.btnVer = new Ext.Button({
        handler: function () {
            _this.eshija = 0;
            _this.objCrudObjetivo.CrearWinCrudObjetivos(
                new Date().format('d/m/Y'), new Date().format('d/m/Y'),
                'Ver datos del', _this.PostAccionesGestionar, _this.arrayidobjetivos,
                null, _this.eshija, permisomodificar = 1, permisoeliminar = 1,
                _this.objcmprelaciones.ObtenerElementosRelacionadosIniciales());
        },
        hidden: opcionesConfig.noUsarEliminar,
        disabled: true,
        iconCls: 'Ver',
        tooltip: 'Ver datos del objetivo',
        key: {
            ctrl: false,
            alt: true,
            key: 'D',
        },
        scope: this
    });

    this.btnCriterio = new Ext.Button({
        disabled: true,
        handler: function () {
            _this.objCrudObjetivo.CrearCmpCriterio(
                _this.arrayidobjetivos[0], _this.arraynombreobjetivos[0], _this.permitirmodificar,
                _this.arrayobjetivosseleccionados[0].idautor, _this.stTGCmpObjetivos);
        },
        iconCls: 'unidadmedida',
        tooltip: 'Criterios de medidas del objetivo',
        key: {
            ctrl: true,
            key: 'M'
        },
        scope: this

    });
    this.btnDuplicar = new Ext.Button({
        disabled: true,
        handler: function () {
            _this.objCrudObjetivo.AnalizarProcesoDuplicado(_this.arrayobjetivosseleccionados[0], _this.PostAccionesGestionar, _this.arrayidobjetivos, _this.objcmprelaciones.ObtenerElementosRelacionadosIniciales());
        },
        iconCls: 'duplicar',
        tooltip: 'Duplicar objetivo',
        scope: this,
        key: {
            ctrl: true,
            alt: true,
            key: 'D',
        }

    });
    this.btnRelaciones = new Ext.Button({
        disabled: true,
        handler: function () {
            _this.CrearRelaciones();
        },
        iconCls: 'gestionarrelaciones',
        tooltip: 'Relacionar objetivo(s)',
        key: {
            ctrl: true,
            key: 'R'
        },
        scope: this
    });
    this.btnHistorial = new Ext.Button({
        disabled: true,
        handler: function () {
            _this.objHistorial.verHistorial('obj', _this.smTGCmpObjetivos.getSelected().id);
        },
        iconCls: 'historial',
        tooltip: 'Consultar historial del objetivo',
        key: {
            alt: true,
            ctrl: true,
            key: 'H'
        },
        scope: this
    });
    this.btnGestObs = new Ext.Button({
        handler: function () {
            _this.objCmpObservaciones.CargarCmpObservaciones(
                _this.arrayidobjetivos[0], 'objetivo', _this.PostAccionesGestionar);
        },
        hidden: opcionesConfig.noUsarGestObser,
        disabled: true,
        iconCls: 'vistareporte',
        tooltip: 'Gestionar observaciones al objetivo',
        key: {
            ctrl: true,
            alt: true,
            key: 'G'
        }
    });
    this.btnPanelBusqueda = new Ext.Button({
        disabled: false,
        iconCls: 'buscaravanzada',
        tooltip: 'B&uacute;squeda avanzada de objetivo(s)',
        handler: function () {
            _this.tpAutoresInvolucrados.doLayout();
            _this.pBuscarObjetivos.toggleCollapse(true);
        },
        key: {
            alt: true,
            key: 'B'
        },
        scope: this
    });
    this.btnPanelTributa = new Ext.Button({
        disabled: false,
        hidden: (opcionesConfig.hasOwnProperty('pRelacionesIniciales')) ? !opcionesConfig.pRelacionesIniciales : false,
        iconCls: 'tributar',
        tooltip: 'Tributar objetivo(s)',
        handler: function () {
            _this.pRelacionesIniciales.toggleCollapse(true);
        },
        key: {
            alt: true,
            ctrl: true,
            key: 'T'
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
        tooltip: 'Importar elemento (Excel)'
    });
    this.btnReordenarhijos = new Ext.Button({
        disabled: false,
        iconCls: 'diferenciaconbanco',
        tooltip: 'Reorganizar sub-objetivo(s)',
        handler: function () {
            _this.ReorganizarHijos();
        },
        key: {
            alt: true,
            ctrl: true,
            key: 'J'
        },
        scope: this
    });
    this.btnHacerRaiz = new Ext.Button({
        disabled: false,
        iconCls: 'top',
        tooltip: 'Hacer raiz',
        handler: function () {
            {
                var start = (_this.ptbTGCmpObjetivos.getPageData().activePage - 1) * (_this.ptbTGCmpObjetivos.cbPageSize.getValue());
                _this.objCrudObjetivo.HacerRaizObjetivos(
                    _this.arrayidobjetivos,
                    _this.smTGCmpObjetivos, _this.stTGCmpObjetivos, start);
            }
        },
        key: {
            ctrl: true,
            key: 'J'
        },
        scope: this
    });
    this.btnVerNotif = new Ext.Button({
        disabled: false,
        iconCls: 'notificaciones',
        tooltip: 'Consultar notificaciones generadas',
        handler: function () {
            _this.objCmpNotificaciones.CargarCmpNotificaciones(1);
        },
        key: {
            ctrl: true,
            key: 'O'
        },
        scope: this
    });

    this.btnLimpiar2 = new Ext.Button({
        disabled: true,
        handler: function () {
            _this.pBuscarObjetivos.collapse(true);
            _this.objclasificadorinvol.ResetearArbolesBusqueda();
            _this.smTGCmpObjetivos.clearSelections();
            _this.stTGCmpObjetivos.baseParams.arrayautores = '';
            _this.stTGCmpObjetivos.baseParams.arrayinvolucrados = '';
            _this.stTGCmpObjetivos.setDefaultSort(null);
            _this.ftCmpObjetivos.clearFilters();
            _this.busqueda = 0;
            _this.objclasificadorinvol.verificarAutoresInvolBusqueda = false;
            _this.btnBusquedaSimple.disable();
            _this.btnLimpiar2.disable();
            _this.stTGCmpObjetivos.reload({
                params: {
                    anode: null
                }
            })
        },
        iconCls: 'limpiar',
        tooltip: 'Limpiar filtro(s)',
        key: {
            alt: true,
            key: 'L'
        },
        scope: this
    });
    this.btnConfPerfil = new Ext.Button({
        handler: function () {
            _this.objconfiguracionperfil.verConfiguracionperfil(_this.cargarConfiguracionPerfil, 1);
        },
        disabled: false,
        iconCls: 'filtrar',
        tooltip: 'Configurar cargas por defecto',
        key: {
            ctrl: true,
            alt: true,
            key: 'F'
        },
        scope: this
    });
    this.btnBusquedaSimple = new Ext.Button({
        handler: function () {
            _this.btnBusquedaSimple.focus();
            if (_this.fpBuscarObjetivos.getForm().isValid()) {
                _this.opcionBusqueda = 1;
                _this.stTGCmpObjetivos.start = 0;
                _this.CargarObjetivos();
                _this.stTGCmpObjetivos.reload({
                    params: {
                        anode: null
                    }
                });
            }
        },
        text: 'Buscar',
        iconCls: 'buscar',
        tooltip: 'Buscar objetivo(s)'
    });
    this.btnSeleccionar = new Ext.Button({
        handler: function () {
            _this.RelacionarElementos();
        },
        disabled: true,
        text: 'Seleccionar',
        iconCls: 'seleccion ',
        tooltip: 'Relacionar objetivo(s) seleccionado(s)',
        key: {
            ctrl: true,
            key: 'D'
        },
        scope: this,
        hidden: opcionesConfig.noUsarSeleccionarWinP
    });
    this.btnDesgloce = new Ext.Button({
        handler: function () {
            _this.ConstruirWinDesgloce();
        },
        disabled: true,
        iconCls: 'desglose',
        tooltip: 'Desglosar objetivo',
        key: {
            ctrl: true,
            alt: false,
            key: 'D',
        },
        scope: this
    });

    this.btnExportar = new Ext.Button({
        handler: function () {
            if (_this.smTGCmpObjetivos.getSelected) {
                _this.cmpexpimp.ventanaExportarElemento(_this.TGCmpObjetivos, _this.smTGCmpObjetivos, 1);
            }
        },
        disabled: true,
        iconCls: 'exportar',
        tooltip: 'Exportar objetivo(s)',
        key: {
            alt: true,
            key: 'E'
        },
        scope: this
    });
    this.btnImportar = new Ext.Button({
        handler: function () {
            _this.cmpexpimp.showCmpImportar(1, _this.TGCmpObjetivos, _this.PanPrincipal);
        },
        disabled: false,
        iconCls: 'importar',
        tooltip: 'Importar objetivo(s)',
        key: {
            alt: true,
            ctrl: true,
            key: 'I'
        },
        scope: this
    });

    this.btnAyuda = new Ext.Button({
        id: 'btnAyuGestionarObjetivos',
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
    this.btnRefresh = {
        text: 'Actualizar registro de objetivos',
        hidden: true,
        handler: function () {
            var paginado = _this.TGCmpObjetivos.getBottomToolbar().items;
            _this.smTGCmpObjetivos.clearSelections();
            paginado.items[0].show();
            paginado.items[1].show();
            paginado.items[2].show();
            paginado.items[3].show();
            paginado.items[4].hide();
            _this.stTGCmpObjetivos.reload();
        },
        iconCls: 'x-btn-text x-tbar-loading',
        key: {
            ctrl: true,
            alt: true,
            key: 'Z'
        },
        scope: this
    };

    //btnActCumplimiento
    this.btn100CM = new Ext.Button({
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

    this.btnOtroValorCM = new Ext.Button({
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

		/**********
		 * Actalizar parametros
		 * *********/

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

		this.actualizarParametros = function () {

				//campo para la fecha de inicio del plan
				_this.f_inicio_actParams = new Ext.form.DateField({
						fieldLabel: 'Fecha de inicio',
						id: 'f_inicio_actParams',
						endDateField: 'f_fin_actParams',
						allowBlank: false,
						value: new Date().format('d/m/Y'),
						maxText: 'La fecha de inicio tiene que ser anterior o igual a la fecha fin.',
						invalidText: 'El formato establecido: dd/mm/aaaa.',
						format: 'd/m/Y',
						anchor: '90%',
						menuListeners: {
								select: function (df, date) {
										this.setValue(date);
										_this.f_fin_actParams.setMinValue(date);
										if (date > _this.f_fin_actParams.getValue()) {
												_this.f_fin_actParams.setValue(date);
										}
								}
						}
				});
				//campo para la fecha de fin del plan
				_this.f_fin_actParams = new Ext.form.DateField({
						fieldLabel: 'Fecha de fin',
						id: 'f_fin_actParams',
						minText: 'La fecha fin tiene que ser posterior o igual a la fecha de inicio.',
						format: 'd/m/Y',
						value: new Date().format('d/m/Y'),
						startDateField: 'f_inicio_actParams',
						invalidText: 'El formato establecido: dd/mm/aaaa.',
						allowBlank: false,
						anchor: '90%',
						menuListeners: {
								select: function (df, date) {
										this.setValue(date);
										_this.f_inicio_actParams.setMaxValue(date);
								}
						}
				});


				// Combo de seleccionar categoria para busqueda rapida
				_this.tooltipCategoria_actParams;

				//store del combo categoria del objetivo
				_this.stCmbCategorias_actParams = new Ext.data.Store({
						url: '/planificacion/pdo/plan/index.php/cmpgestionarobjetivos/cargarcategoriaobjetivo',
						autoLoad: true,
						reader: new Ext.data.JsonReader({
								id: 'idcategoriaobj',
								root: "data"
						}, [{
								name: 'idcategoriaobj'
						}, {
								name: 'dennomenclador'
						}, {
								name: 'objetivo'
						}]),
						listeners: {
								beforeload: function (st, opt) {
								},
								load: function (store, records, options) {

								}
						}
				});


				//combo categoria del plan
				_this.cb_categoria_actParams = new Ext.form.ComboBox({
						id: 'cb_categoria_actParams',
						emptyText: 'Seleccione',
						fieldLabel: 'Categoría del objetivo',
						store: _this.stCmbCategorias_actParams,
						hiddenName: 'idcategoriaobj',
						valueField: 'idcategoriaobj',
						displayField: 'dennomenclador',
						triggerAction: 'all',
						editable: false,
						loadingText: 'Cargando datos',
						forceSelection: true,
						mode: 'local',
						anchor: '90%',
						select: function (c, r, i) {
								if (_this.tooltipCategoria_actParams)
										_this.tooltipCategoria_actParams.destroy();
								if (_this.cb_categoria_actParams.getValue() && _this.cb_categoria_actParams.getRawValue().length > 20) {
										_this.tooltipCategoria_actParams = new Ext.ToolTip({
												target: c.getEl(),
												html: _this.cb_categoria_actParams.getRawValue()
										});
								}
						}
				});



				_this.form_actParams = new Ext.FormPanel({
						labelAlign: 'top',
						frame: true,
						bodyStyle: 'padding:5px 5px 0',
						width: 600,
						items: [{
								layout: 'column',
								items: [{
										columnWidth: .5,
										layout: 'form',
										items: [
												_this.f_inicio_actParams,
												_this.cb_categoria_actParams
										]
								}, {
										columnWidth: .5,
										layout: 'form',
										items: [
												_this.f_fin_actParams
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
										var waitMsg = 'Guardando datos del objetivo seleccionado';
										var respuesta= 'Se han actualizado los parámetros del objetivo seleccionado';
										if(_this.arrayidobjetivos.length>1){
												waitMsg = 'Guardando datos de los objetivos seleccionados';
												respuesta= 'Se han actualizado los parámetros de los objetivos seleccionados';
										}
										_this.BarraProgreso.show(waitMsg);
										_this.form_actParams.getForm().submit({
												url: '/planificacion/pdo/plan/index.php/cmpgestionarobjetivos/actualizarParametros',
												params: {
														arrayidobjetivos: Ext.encode(_this.arrayidobjetivos),
														idcategoria: _this.cb_categoria_actParams.getValue(),
														denomcategoria: _this.cb_categoria_actParams.getRawValue()
												},
												failure: function (form, action) {
														if (action.result.mensaje > 0) {
																mostrarMensaje(1, respuesta);
																_this.window_actParams.destroy();
																_this.BarraProgreso.hide();
																_this.smTGCmpObjetivos.clearSelections();
																_this.stTGCmpObjetivos.reload();
														}else{
																_this.BarraProgreso.hide();
																mostrarMensaje(1, 'Error al guardar la información');
														}

												}

										});
								}
						}
				});

				_this.window_actParams = new Ext.Window({
						modal: true,
						closeAction: 'destroy',
						constrain: true,
						layout: 'fit',
						title: 'Actualizar párametros comunes',
						width: 490,
						height: 250,
						resizable: false,
						items: [_this.form_actParams],
						buttons: [_this.btnCancelar_actParams, _this.btnAceptarwindow_actParams]
				});

				_this.window_actParams.show();
		};

		this.validarParametros = function () {
				if(	_this.f_inicio_actParams.getValue()=="" &&
						_this.f_fin_actParams.getValue()=="" &&
						_this.cb_categoria_actParams.getValue()==""
				){
						mostrarMensaje(1, 'Debe cambiar algún parámetro');
						return false;
				}
				return true;
		};

    this.actualizarCumplimiento = function (metodo) {
        var msj = '', msjError = '';
        if (_this.arrayidobjetivos.length == 1) {
            msj = 'El objetivo ha sido actualizado satisfactoriamente.';
            msjError = 'La acci&oacute;n no se pudo realizar porque el objetivo ' +
                'seleccionado tiene actualizaci&oacute;n autom&aacute;tica.';
        } else {
            msj = 'Los objetivos han sido actualizados satisfactoriamente.';
            msjError = 'La acci&oacute;n no se pudo realizar porque los objetivos ' +
                'seleccionados tienen actualizaci&oacute;n autom&aacute;tica.';
        }
        if (metodo == 1) {
            this.BarraProgreso.show('Actualizando cumplimiento');
            Ext.Ajax.request({
                url: '/planificacion/pdo/plan/index.php/cmpgestionarobjetivos/actualizarCumplimiento',
                params: {
		                arrayidobjetivos: Ext.encode(_this.arrayidobjetivos),
                    metodo: metodo
                },
                callback: function (options, success, response) {
                    _this.BarraProgreso.hide();
                    responseData = Ext.decode(response.responseText);

                    if (responseData.respuesta == 1) {
                        mostrarMensaje(1, msj);
                    }
                    if (responseData.respuesta == 2) {
                        mostrarMensaje(1, msj + ', excepto aquellos seleccionados con actualizaci&oacute;n autom&aacute;tica.');
                    }
                    if (responseData.respuesta == 3) {
                        mostrarMensaje(1, msjError);
                    }
                    _this.smTGCmpObjetivos.clearSelections();
                    var start = _this.ptbTGCmpObjetivos.getLastStart();
                    _this.stTGCmpObjetivos.reload({
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
                                    url: '/planificacion/pdo/plan/index.php/cmpgestionarobjetivos/actualizarCumplimiento',
                                    params: {
		                                    arrayidobjetivos: Ext.encode(_this.arrayidobjetivos),
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
                                            mostrarMensaje(1, msj + ', excepto aquellos seleccionados con actualizaci&oacute;n autom&aacute;tica.');
                                        }
                                        if (responseData.respuesta == 3) {
                                            mostrarMensaje(1, msjError);
                                        }
                                        _this.winActualizarCumplimiento.destroy();
                                        _this.smTGCmpObjetivos.clearSelections();
                                        var start = _this.ptbTGCmpObjetivos.getLastStart();
                                        _this.stTGCmpObjetivos.reload({
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
    };
    /*
        //btnActCumplimientoCM
        this.btn100CM = new Ext.Button({
            disabled: true,
            iconCls: 'icondistra-bandera sipac-verde',
            tooltip: 'Actualizar criterios de medida al 100% de cumplimiento',
            id: 'btnActualizar100CMAct',
    //        prevTab: 'btnGestPuntualizarAct',
    //        nextTab: 'btnActualizarValorAct',
            handler: function () {
                _this.actualizarCumplimientoCM(100);
            },
            key: {
                ctrl: true,
                alt: true,
                key: 'Z'
            }
        });

        this.btnOtroValorCM = new Ext.Button({
            disabled: true,
            iconCls: 'icondistra-bandera sipac-amarilla',
            tooltip: 'Actualizar cumplimiento de los criterios de medida',
            id: 'btnActualizarValorAct',
    //        prevTab: 'btnActualizar100Act',
    //        nextTab: 'btnLimpiarAct',
            handler: function () {
                _this.actualizarCumplimientoParcialCM();
            }
        });*/

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
                },
                [{
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
        loadingText: 'Cargando datos...',
        forceSelection: true,
        mode: 'remote',
        emptyText: 'Seleccione...',
        width: 580,
        listeners: {
            select: function (cb, record, index) {
                _this.opcionBusqueda = 2;
                _this.CargarObjetivos();
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
        viewConfig: {
            forcefit: true
        },
        selectOnFocus: true,
        hiddenName: 'idac',
        valueField: 'idac',
        width: 100,
        emptyText: 'Seleccione...',
        listeners: {
            select: function (cb, record, index) {
                if (record.data.idac == 0) {
                    _this.opcionBusqueda = 5;
                } else
                    _this.opcionBusqueda = 2;
                _this.CargarObjetivos();
            }
        }
    });

    //store del treegrid donde se muestran los objetivos
    this.stTGCmpObjetivos = new Ext.ux.maximgb.treegrid.AdjacencyListStore({
        autoLoad: true,
        remoteSort: true,
        url: '/planificacion/pdo/plan/index.php/cmpgestionarobjetivos/cargarobjetivos',
        listeners: {
            beforeload: function (st) {
                st.baseParams.idobjetivo = _this.arrayidobjetivos[0];
                st.baseParams.eshija = _this.eshija;
                //st.baseParams.start = _this.pgactual;
                st.baseParams.objetivosreorganizar = Ext.encode(_this.arrayidobjetivosReorganizar);
                var arrayautores = _this.objclasificadorinvol.ObtenerAutoresBusqueda();
                var arrayinvolucrados = _this.objclasificadorinvol.ObtenerInvolucradosBusqueda();
                st.baseParams.arrayautores = Ext.encode(arrayautores);
                st.baseParams.arrayinvolucrados = Ext.encode(arrayinvolucrados);
                st.baseParams.busqueda = _this.busqueda;
                st.baseParams.arrayelementosrelacionados = Ext.encode(_this.objcmprelaciones.ObtenerElementosRelacionadosIniciales());
            },
            load: function (store, record, options) {
                if (_this.TGCmpObjetivos.getStore().getCount() == 0 && !_this.posteliminar) {
                    var arrayautoresbusq = _this.objclasificadorinvol.ObtenerAutoresBusqueda();
                    var arrayinvolucradosbusq = _this.objclasificadorinvol.ObtenerInvolucradosBusqueda();
                    if ((_this.ftCmpObjetivos.getFiltrosActivos() == undefined || _this.ftCmpObjetivos.getFiltrosActivos().length == 0)
                        && arrayautoresbusq.length == 0 && arrayinvolucradosbusq.length == 0) {
                        mostrarMensaje(1, 'No existen datos que mostrar.');
                    } else {
                        mostrarMensaje(1, 'No existen datos que se correspondan con los criterios de búsqueda especificados.');
                    }
                }
                _this.posteliminar = false;
                _this.ActualizarEstadoBarraHerramientas();
                if (_this.smTGCmpObjetivos.hasSelection()) {
                    //_this.smTGCmpObjetivos.clearSelections();
                    _this.TGCmpObjetivos.getView().refresh(true);
                }
                _this.changeTitleObjetivos();
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
            name: '_parent'
        }, {
            name: '_is_leaf'
        }, {
            name: 'idestadoaprob'
        }, {
            name: 'nombreestadoaprob'
        }, {
            name: 'estadocumplimiento'
        }, {
            name: 'textocumplimiento'
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
            name: 'criterios'
        }, {
            name: 'tipoelemento'
        }, {
            name: 'modificar'
        }, {
            name: 'eliminar'
        }, {
            name: 'idautor'
        }])
    });

    //barra de paginado del treegrid donde se muestran los objetivos
    this.ptbTGCmpObjetivos = new Ext.ux.maximgb.treegrid.PagingToolbar({
        pageSize: 1000,
        store: _this.stTGCmpObjetivos,
        displayInfo: true,
        listeners: {
            beforechange: function (paginado, evento) {
                _this.start = evento.start;
            }
        }
    });

    var smo = false;
    if (opcionesConfig.singlemodoSeleccionGridObjetivos == true) {
        smo = true;
    }

    //modo de del treegrid donde se muestran los objetivos
    this.smTGCmpObjetivos = new Ext.grid.CheckboxSelectionModel({
        singleSelect: smo,
        listeners: {
            rowselect: function (sm, indiceFila, record) {
                if (_this.prevrow >= 0 && _this.prevrow != indiceFila) {
                    Ext.get(_this.TGCmpObjetivos.getView().getRow(_this.prevrow)).removeClass('superior2');
                    Ext.get(_this.TGCmpObjetivos.getView().getRow(_this.prevrow)).addClass('superior');
                }
                if (record.data.superior == 1) {
                    Ext.get(_this.TGCmpObjetivos.getView().getRow(indiceFila)).removeClass('superior');
                    Ext.get(_this.TGCmpObjetivos.getView().getRow(indiceFila)).addClass('superior2');
                    _this.prevrow = indiceFila;
                } else
                    _this.prevrow = -1;
                _this.ActualizarEstadoBarraHerramientas();
            },
            rowdeselect: function (sm, indiceFila, record) {
                if (_this.prevrow >= 0 && _this.prevrow != indiceFila) {
                    Ext.get(_this.TGCmpObjetivos.getView().getRow(_this.prevrow)).removeClass('superior2');
                    Ext.get(_this.TGCmpObjetivos.getView().getRow(_this.prevrow)).addClass('superior');
                }
                if (record.data.superior == 1) {
                    Ext.get(_this.TGCmpObjetivos.getView().getRow(indiceFila)).removeClass('superior');
                    Ext.get(_this.TGCmpObjetivos.getView().getRow(indiceFila)).addClass('superior2');
                    _this.prevrow = indiceFila;
                } else
                    _this.prevrow = -1;
                _this.ActualizarEstadoBarraHerramientas();
            }
        }
    });
    //plugins para los filtros del grid
    this.ftCmpObjetivos = new Ext.grid.GridFilters({
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
            type: 'numeric',
            dataIndex: 'gradocumplimiento'
        }, {
            type: 'listado',
            dataIndex: 'nombreestadoaprob',
            idcombo: 'idcbftestado',
            urlcb: '/planificacion/pdo/plan/index.php/cmpgestionarobjetivos/cargarcmbestados',
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
            dataIndex: 'criterios',
            options: ['Si', 'No']
        }]
    });
    //treegrid donde se muestran los objetivos
    this.TGCmpObjetivos = new Ext.ux.maximgb.treegrid.GridPanel({
        store: _this.stTGCmpObjetivos,
        plugins: _this.ftCmpObjetivos,
        master_column_id: 'expandir',
        autoExpandMin: 165,
        stripeRows: true,
        region: 'center',
        viewConfig: {
            forcefit: true
        },
        sm: _this.smTGCmpObjetivos,
        margins: '3 3 3 3',
        loadMask: {
            msg: 'Cargando objetivos...'
        },
        root_title: 'Registro de objetivos',
        columns: [_this.smTGCmpObjetivos,
            {
                header: 'CAR',
                dataIndex: 'idelemento',
                width: 80,
                renderer: function (val) {
                    return val;
                },
                sortable: true,
                tooltip: 'Código de Acceso Rápido'
            }, {
                header: "Denominaci&oacute;n",
                id: 'expandir',
                dataIndex: 'denominacion',
                width: 565,
                sortable: true,
                renderer: MostrarImagenTipoElemento,
                tooltip: "Denominaci&oacute;n"
            }, {
                header: "Fecha de inicio",
                dataIndex: 'fechainicio',
                width: 100,
                sortable: true,
                tooltip: "Fecha de inicio"
            }, {
                header: "Fecha de fin",
                dataIndex: 'fechafin',
                width: 100,
                sortable: true,
                tooltip: "Fecha de fin"
            }, {
                header: "Estado de aprobación",
                dataIndex: 'nombreestadoaprob',
                width: 130,
                sortable: true,
                renderer: function (val) {
                    return "<center>" + val + "</center>";
                },
                tooltip: "Estado de aprobación"
            }, {
                header: "Estado de cumplimiento",
                dataIndex: 'textocumplimiento',
                width: 130,
                sortable: true,
                renderer: MostrarImagenEstadoCumplimiento,
                tooltip: "Estado de cumplimiento"
            }, {
                header: "% de cumplimiento",
                dataIndex: 'gradocumplimiento',
                width: 100,
                aling: 'center',
                sortable: true,
                renderer: function (a) {
                    return a + ' %'
                },
                tooltip: "Porciento de cumplimiento"
            }, {
                header: "Observaciones",
                hidden: opcionesConfig.noMostrarColumObser,
                dataIndex: 'observaciones',
                width: 90,
                sortable: true,
                renderer: MostrarImagenT,
                tooltip: "Observaciones"
            }, {
                header: "CM.",
                hidden: opcionesConfig.noMostrarColumObser,
                dataIndex: 'criterios',
                width: 40,
                sortable: true,
                renderer: MostrarImagenT,
                tooltip: "Criterios de medida"
            }, {
                header: "Autor",
                dataIndex: 'nombreautor',
                width: 180,
                sortable: true,
                renderer: function (val) {
                    return "<center>" + val + "</center>";
                },
                tooltip: "Autor"
            }
        ],
        menuderecho: _this.menuderechoTGCmpObjetivos,
        listeners: {
            rowcontextmenu: function (grid, row, e) {
                _this.TGCmpObjetivos.getSelectionModel().selectRow(row);
                //inicializando el objeto menu dinamico
                if (_this.objcmpmenurelacionesdin) {
                    _this.objcmpmenurelacionesdin = null;
                }
                _this.objcmpmenurelacionesdin = new Utilidades.Cmp.CmpMenuRelacionesDinamicas();
                if (_this.menuderechoTGCmpObjetivos) {
                    _this.menuderechoTGCmpObjetivos.destroy();
                }
                //menu derecho del grid de los objetivos
                _this.menuderechoTGCmpObjetivos = new Ext.menu.Menu({});

                (_this.miadicionar) ? _this.miadicionar.destroy() : null;
                if (_this.arrayobjetivosseleccionados.length == 1) {
                    _this.miadicionar = new Ext.menu.Item({
                        text: 'Adicionar objetivo',
                        itemCls: 'x-menu-item icondistra-adicionar',
                        iconCls: 'imagen-none',
                        hideOnClick: true,
                        handler: function () {
                            _this.eshija = 1;
                            _this.objCrudObjetivo.CrearWinCrudObjetivos(
                                new Date().format('d/m/Y'), new Date().format('d/m/Y'),
                                'Adicionar', _this.PostAccionesGestionar, _this.arrayidobjetivos, null,
                                _this.eshija, permisomodificar = 1, permisoeliminar = 1,
                                _this.objcmprelaciones.ObtenerElementosRelacionadosIniciales(), null,
                                _this.stTGCmpObjetivos);
                        }
                    });
                    _this.menuderechoTGCmpObjetivos.add(_this.miadicionar);
                }

                //Estado de aprobacion
                if (_this.idaprobdiferentes == 0 && _this.subordinados == 1 && _this.mostrarmenuaprob == 1) {
                    var mensaje = '';
                    if (_this.arrayobjetivosseleccionados.length > 1) {
                        mensaje = 'No existen otros estados al cual usted pueda cambiar los objetivos desde el estado actual.';
                    } else {
                        mensaje = 'No existen otros estados al cual usted pueda cambiar el objetivo desde el estado actual.';
                    }
                    if (_this.mdiaprobacion) {
                        _this.mdiaprobacion.destroy();
                    }
                    _this.mdiaprobacion = new Ext.menu.Item({
                        text: 'Cambiar el estado de aprobaci&oacute;n a',
                        disabled: opcionesConfig.noUsarMenuGrid,
                        itemCls: 'x-menu-item icondistra-cambiodestado',
                        iconCls: 'imagen-none',
                        hideOnClick: false,
                        id: 'itmaprov',
                        menu: _this.objcmpmenurelacionesdin.menuinicial,
                        listeners: {
                            render: function (el) {
                                //actualizar el sub-menu de Cambiar estado
                                _this.objcmpmenurelacionesdin.CrearMenuAprobacionConc(
                                    _this.AccionesPostEjecutarFT, mensaje,
                                    _this.TGCmpObjetivos,
                                    _this.menuderechoTGCmpObjetivos,
                                    _this.arrayidobjetivos,
                                    _this.arrayidestadoaprob,
                                    _this.idtipodocumento
                                );
                            }
                        }
                    });
                    _this.menuderechoTGCmpObjetivos.add(_this.mdiaprobacion);
                }//Modificar
                if (_this.mimodificar) {
                    _this.mimodificar.destroy();
                }
                if (_this.permitirmodificar == 1) {
                    _this.mimodificar = new Ext.menu.Item({
                        text: 'Modificar objetivo',
                        itemCls: 'x-menu-item icondistra-modificar',
                        iconCls: 'imagen-none',
                        handler: function () {
                            _this.eshija = 0;
                            _this.objCrudObjetivo.CrearWinCrudObjetivos(new Date().format('d/m/Y'), new Date().format('d/m/Y'), 'Modificar', _this.PostAccionesGestionar, _this.arrayidobjetivos, _this.arrayobjetivosseleccionados[0].idautor, _this.eshija, permisomodificar = 1, permisoeliminar = 1, _this.objcmprelaciones.ObtenerElementosRelacionadosIniciales(), _this.smTGCmpObjetivos);
                        }
                    });
                    _this.menuderechoTGCmpObjetivos.add(_this.mimodificar);
                }//Eliminar
                if (_this.mieliminar) {
                    _this.mieliminar.destroy();
                }
                if (_this.permitireliminar == 1) {
                    _this.mieliminar = new Ext.menu.Item({
                        text: _this.setTextdeMenus(_this.smTGCmpObjetivos.getCount(), 'Eliminar'),
                        itemCls: 'x-menu-item icondistra-eliminar',
                        iconCls: 'imagen-none',
                        handler: function () {
                            _this.eshija = 0;
                            _this.objCrudObjetivo.EliminarObjetivos(_this.arrayidobjetivos, _this.PostAccionesGestionar, _this.smTGCmpObjetivos);
                        }
                    });
                    _this.menuderechoTGCmpObjetivos.add(_this.mieliminar);
                }//Duplicar
                if (_this.miduplicar) {
                    _this.miduplicar.destroy();
                }
                if (_this.permitirduplicar == 1) {
                    _this.miduplicar = new Ext.menu.Item({
                        text: 'Duplicar objetivo',
                        itemCls: 'x-menu-item icondistra-duplicar',
                        iconCls: 'imagen-none',
                        handler: function () {
                            _this.objCrudObjetivo.AnalizarProcesoDuplicado(
                                _this.arrayobjetivosseleccionados[0], _this.PostAccionesGestionar,
                                _this.arrayidobjetivos, _this.objcmprelaciones.ObtenerElementosRelacionadosIniciales());
                        }
                    });
                    _this.menuderechoTGCmpObjetivos.add(_this.miduplicar);
                }//Ver datos
                if (_this.midatos) {
                    _this.midatos.destroy();
                }
                if (_this.smTGCmpObjetivos.getCount() == 1) {
                    _this.midatos = new Ext.menu.Item({
                        text: 'Ver datos del objetivo',
                        itemCls: 'x-menu-item icondistra-ver',
                        iconCls: 'imagen-none',
                        handler: function () {
                            _this.eshija = 0;
                            _this.objCrudObjetivo.CrearWinCrudObjetivos(
                                new Date().format('d/m/Y'), new Date().format('d/m/Y'),
                                'Ver datos del', _this.PostAccionesGestionar, _this.arrayidobjetivos,
                                null, _this.eshija, permisomodificar = 1, permisoeliminar = 1,
                                _this.objcmprelaciones.ObtenerElementosRelacionadosIniciales());
                        }
                    });
                    _this.menuderechoTGCmpObjetivos.add(_this.midatos);
                    //Historial
                    if (_this.verhistorial) {
                        _this.verhistorial.destroy();
                    }
                    _this.verhistorial = new Ext.menu.Item({
                        text: 'Consultar historial del objetivo',
                        itemCls: 'x-menu-item icondistra-historial',
                        iconCls: 'imagen-none',
                        handler: function () {
                            _this.objHistorial.verHistorial('obj', _this.smTGCmpObjetivos.getSelected().id);
                        }
                    });
                    _this.menuderechoTGCmpObjetivos.add(_this.verhistorial);
                }//Relacionar
                if (_this.mirelacionar) {
                    _this.mirelacionar.destroy();
                }
                if (_this.permitirrelaciones == 1) {
                    _this.mirelacionar = new Ext.menu.Item({
                        text: _this.setTextdeMenus(_this.smTGCmpObjetivos.getCount(), 'Relacionar'),
                        itemCls: 'x-menu-item icondistra-gestionarrelaciones',
                        iconCls: 'imagen-none',
                        handler: function () {
                            _this.CrearRelaciones();
                        }
                    });
                    _this.menuderechoTGCmpObjetivos.add(_this.mirelacionar);
                }//Reorganizar
                if (_this.mireordenarhijos) {
                    _this.mireordenarhijos.destroy();
                }
                _this.mireordenarhijos = new Ext.menu.Item({
                    text: 'Reorganizar sub-objetivo(s)',
                    itemCls: 'x-menu-item icondistra-diferenciaconbanco',
                    iconCls: 'imagen-none',
                    handler: function () {
                        _this.ReorganizarHijos();
                    }
                });
                _this.mihaceraiz = new Ext.menu.Item({
                    text: 'Hacer raiz',
                    itemCls: 'x-menu-item icondistra-top',
                    iconCls: 'imagen-none',
                    handler: function () {
                        var start = (_this.ptbTGCmpObjetivos.getPageData().activePage - 1) * (_this.ptbTGCmpObjetivos.cbPageSize.getValue());
                        _this.objCrudObjetivo.HacerRaizObjetivos(
                            _this.arrayidobjetivos,
                            _this.smTGCmpObjetivos, _this.stTGCmpObjetivos, start);
                    }
                });
                if (_this.smTGCmpObjetivos.getSelected().json._parent == null) {
                    _this.mihaceraiz.disable()
                }
                _this.menuderechoTGCmpObjetivos.add(_this.mireordenarhijos);
                _this.menuderechoTGCmpObjetivos.add(_this.mihaceraiz);
                //Reasignar
                if (_this.mireasignar) {
                    _this.mireasignar.destroy();
                }
                if (_this.permitirreasignar == 1) {
                    _this.mireasignar = new Ext.menu.Item({
                        text: 'Reasignar objetivo',
                        itemCls: 'x-menu-item icondistra-cambiar',
                        iconCls: 'imagen-none',
                        handler: function () {
                            _this.objclasificadorinvol.CrearClasificadorReasignacion(
                                _this.arrayidobjetivos[0], tipoelemento = 1, _this.PostAccionesGestionar);
                        }
                    });
                    _this.menuderechoTGCmpObjetivos.add(_this.mireasignar);
                }
                e.stopEvent();
                var xy = e.getXY();
                _this.menuderechoTGCmpObjetivos.showAt(xy);
            },
            rowdblclick: function () {
                _this.eshija = 0;
                if (_this.permitirmodificar) {
                    _this.objCrudObjetivo.CrearWinCrudObjetivos(
                        new Date().format('d/m/Y'), new Date().format('d/m/Y'),
                        'Modificar', _this.PostAccionesGestionar, _this.arrayidobjetivos,
                        _this.arrayobjetivosseleccionados[0].idautor, _this.eshija,
                        permisomodificar = 1, permisoeliminar = 1,
                        _this.objcmprelaciones.ObtenerElementosRelacionadosIniciales(), _this.smTGCmpObjetivos);
                } else {
                    _this.objCrudObjetivo.CrearWinCrudObjetivos(
                        new Date().format('d/m/Y'), new Date().format('d/m/Y'),
                        'Ver datos del', _this.PostAccionesGestionar, _this.arrayidobjetivos,
                        _this.arrayobjetivosseleccionados[0].idautor, _this.eshija, permisomodificar = 1,
                        permisoeliminar = 1, _this.objcmprelaciones.ObtenerElementosRelacionadosIniciales(),
                        _this.smTGCmpObjetivos);
                }
            }
        },
        bbar: (!opcionesConfig.noUsarPaginado) ? _this.ptbTGCmpObjetivos : null
    });

    /***************************
     * Navegar en grid con tecla abajo
     * **********************************************/

    $(document).ready(function() {
        $(document).keydown(function(e) {
            if(e.keyCode==40){
                moveSelectedRow(_this.TGCmpObjetivos, 1);
            }if(e.keyCode==38){
                moveSelectedRow(_this.TGCmpObjetivos, -1);
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
                return 'Exportar objetivo';
            }
            else
                return 'Exportar objetivos';
        }
        else if (accion == 'Eliminar') {
            if (conteo == 1) {
                return 'Eliminar objetivo';
            }
            else
                return 'Eliminar objetivos';
        }
        else if (accion == 'Relacionar') {
            if (conteo == 1) {
                return 'Relacionar objetivo';
            }
            else
                return 'Relacionar objetivos';
        }
    };
    _this.TGCmpObjetivos.getView().getRowClass = function (ri, n) {
        if (ri.data.superior == 1)
            return "superior";
        else
            return "";
    };

    //campo de texto para la busqueda de objetivos por denominacion
    this.tfdenominacionBS = new Ext.form.TextField({
        fieldLabel: 'Denominación',
        maxLength: 255,
        maxLengthText: 'El tamaño máximo requerido es 255 caracteres.',
        regex: _this.ObjValidaciones.expresionRegular('denominacion'),
        maskRe: /^([a-zA-Z0-9áéíóúüÁÉÍÓÚñÑÜ"'.,/ ()_-])$/,
        regexText: _this.ObjValidaciones.ObtenerMsjErrorTextoRegido('denominacion'),
        vtype: 'validarEspaciosEnBlanco',
        anchor: '95%',
        allowBlank: true
    });

    //campos de fecha para la busqueda de objetivos
    this.fechaInicioBS = new Ext.form.DateField({
        fieldLabel: 'Fecha de inicio',
        id: opcionesConfig.idcmp + 'fechaInicioBS',
        format: 'd/m/Y',
        width: 100,
        allowBlank: true,
        vtype: 'daterange',
        endDateField: opcionesConfig.idcmp + 'fechaFinBS',
        invalidText: _this.ObjValidaciones.ObtenerMsjErrorTextoRegido('fecha')
    });
    this.fechaFinBS = new Ext.form.DateField({
        fieldLabel: 'Fecha de fin',
        id: opcionesConfig.idcmp + 'fechaFinBS',
        format: 'd/m/Y',
        width: 100,
        vtype: 'daterange',
        startDateField: opcionesConfig.idcmp + 'fechaInicioBS',
        invalidText: _this.ObjValidaciones.ObtenerMsjErrorTextoRegido('fecha')
    });

    //campo de texto para la busqueda por CAR(Codigo de Acceso Rapido)
    this.tfCAR = new Ext.form.TextField({
        fieldLabel: 'CAR',
        regex: /^[0-9]+$/,
        maxLength: 10,
        maxLengthText: 'El tamaño máximo requerido es 10 dígitos.',
        regexText: _this.ObjValidaciones.ObtenerMsjErrorTextoRegido('car'),
        width: 130,
        allowBlank: true,
        enableKeyEvents: true,
        listeners: {
            keypress: function (tfCAR, e) { // Para dejar solo 10 números
                if (e.getKey() != 8) //
                {
                    var value = new String(tfCAR.getValue());
                    if (value.length >= 10)// Para que escriba solo 10 caracteres
                        e.stopEvent();
                }
            }
        }
    });

    this.tpAutoresInvolucrados = _this.objclasificadorinvol.CrearClasificadorInvolBusqueda(tipoelemento = 1, 2);

    this.fpBuscarObjetivos = new Ext.form.FormPanel({
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

    //panel donde se muestran las opciones de busqueda de objetivos
    this.pBuscarObjetivos = new Ext.Panel({
        title: 'Opciones de b&uacute;squeda',
        layout: 'fit',
        width: 300,
        collapsible: true,
        collapsed: true,
        margins: '3 3 3 3',
        region: 'east',
        items: [_this.fpBuscarObjetivos],
        listeners: {
            expand: function (p) {
                p.doLayout();
            }
        }
    });

    this.pRelacionesIniciales = _this.objcmprelaciones.CrearCmpRelacionesIniciales(1, function () {
        _this.stTGCmpObjetivos.reload({
            params: {
                arrayelementosrelacionados: Ext.encode(
                    _this.objcmprelaciones.ObtenerElementosRelacionadosIniciales())
            }
        });
    }, true);

    //panel principal de la vista
    this.PanPrincipal = new Ext.Panel({
        layout: 'border',
        region: 'center',
        usarKeymap: true,
        botonesKeymap: [_this.btnAdicionar, _this.btnModificar, _this.btnEliminar, this.btnCambiarEstado, _this.btnDesgloce, _this.btnCriterio,
            _this.btnDuplicar, _this.btnHistorial, _this.btnVer, _this.btnRelaciones, _this.btnGestObs, _this.btnPanelTributa, _this.btnImportarActividades, _this.btnVerNotif, _this.btnActualizarParametros,
            _this.btnPanelBusqueda, _this.btnLimpiar2, _this.btnConfPerfil, _this.btnAyuda, _this.btnReordenarhijos, _this.btnHacerRaiz],
        tbar: [_this.btnAdicionar, ' ', _this.btnModificar, ' ', _this.btnEliminar, ' ', this.btnCambiarEstado, ' ', _this.btnDuplicar, ' ',
            _this.btnVer, ' ', _this.btnDesgloce, ' ', _this.btnCriterio, ' ', _this.btnRelaciones, ' ',
            _this.btnHistorial, ' ', _this.btnGestObs, ' ', /*_this.btnExportar, ' ',_this.btnImportar, ' ',*/
            _this.btnPanelTributa, ' ', _this.btnImportarActividades, ' ', _this.btnReordenarhijos, ' ', _this.btnHacerRaiz, ' ', _this.btnVerNotif, ' ',
            _this.btnPanelBusqueda, ' ', _this.btnConfPerfil, ' ', _this.btnGraficas, _this.btnLimpiar2, ' ', _this.btn100CM, ' ', _this.btnOtroValorCM, ' ',_this.btnActualizarParametros,'->',
            /*'Aprobaci&oacute;n-conciliaci&oacute;n :', ' ', _this.cbaprob_conc, ' ',*/ _this.btnAyuda],
        items: [_this.TGCmpObjetivos, _this.pBuscarObjetivos]
    });

    //ventana principal de la vista
    this.WinPrincipal = new Ext.Window({
        layout: 'border',
        title: opcionesConfig.titleWinPrincipal,
        closable: opcionesConfig.closableWinPrincipal,
        graggable: false,
        maximized: opcionesConfig.maxWinPrincipal,
        noTitle: opcionesConfig.maxWinPrincipal,
        modal: true,
        constrain: true,
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
        ],
        listeners: {
            beforerender: function (cmp) {
                if (opcionesConfig.hasOwnProperty('pRelacionesIniciales') && opcionesConfig.pRelacionesIniciales == false) {
                    cmp.remove(_this.pRelacionesIniciales);
                }
            }
        }
    });

    //funcion donde se procede a cargar el treegrid con los objetivos
    this.CargarObjetivos = function () {
        if (_this.opcionBusqueda == 1 || _this.opcionBusqueda == 2) {
            _this.busqueda = 1;
            var arrayautores = _this.objclasificadorinvol.ObtenerAutoresBusqueda();
            var arrayinvolucrados = _this.objclasificadorinvol.ObtenerInvolucradosBusqueda();
            if (_this.opcionBusqueda == 1) {
                if (_this.tfdenominacionBS.getValue() != ''
                    || _this.fechaInicioBS.getValue() != ''
                    || _this.fechaFinBS.getValue() != ''
                    || _this.tfCAR.getValue() != ''
                    || arrayautores.length > 0
                    || arrayinvolucrados.length > 0) {
                    _this.stTGCmpObjetivos.removeAll();
                    _this.stTGCmpObjetivos.reload({
                        callback: function () {
                            if (_this.stTGCmpObjetivos.getTotalCount() == 0) {
                                _this.opcionBusqueda = 3;
                                _this.CargarObjetivos();
                                _this.pBuscarObjetivos.collapse(true);
                            }
                        }
                    });

                } else {
                    mostrarMensaje(1, "Introduzca un criterio de b&uacute;squeda.");
                    return;
                }
            } else {
                _this.stTGCmpObjetivos.removeAll();
                _this.stTGCmpObjetivos.reload({
                    params: {
                        enaprobacion: 1
                    },
                    callback: function () {
                        if (_this.stTGCmpObjetivos.getTotalCount() == 0) {
                            _this.opcionBusqueda = 4;
                            _this.CargarObjetivos();
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
            _this.smTGCmpObjetivos.clearSelections();
            idestadoaprobacion = null;
            _this.stTGCmpObjetivos.reload();
        }
        if (_this.opcionBusqueda == 5) {
            _this.stTGCmpObjetivos.reload({
                params: {
                    enaporbacion: 0
                }
            });
        }
        if (_this.opcionBusqueda == 6) {
            _this.objclasificadorinvol.ResetearArbolesBusqueda();
            _this.smTGCmpObjetivos.clearSelections();
            idestadoaprobacion = null;
            _this.stTGCmpObjetivos.reload({});
        }
        if (_this.opcionBusqueda != 3) {
            _this.opcionBusqueda = 3;
        }
    };

    //funcion donde se procede a cargar la plantilla
    this.CargarCmpObjetivos = function (idelemento, tipoelemento, parentelemento, AccionesAlRelacionar, arrayidobjetivosReorganizar) {
		    _this.arrayobjetivosseleccionados = [];
        _this.AccionesAlRelacionar = AccionesAlRelacionar;
        _this.idelementohijo = idelemento;
        _this.tipoelementohijo = tipoelemento;
        _this.arrayidobjetivosReorganizar = arrayidobjetivosReorganizar;
        if (parentelemento == 'padre') {
            _this.idelementopadre = idelemento;
            _this.tipoelementopadre = tipoelemento;
        }
        if (opcionesConfig.tipoComponente == 'panel') {
            return _this.PanPrincipal;
        } else {
            _this.WinPrincipal.show();
            _this.cargarConfiguracionPerfil(1);
        }
    };

    //funcion donde se procede a disparar post-aciones luego de adicionar/modificar/eliminar
    this.PostAccionesGestionar = function (mensaje, accion) {
        _this.busqueda = 0;
        switch (mensaje) {
            case 0:
                _this.stTGCmpObjetivos.reload({
                    params: {
                        anode: null,
                        start: _this.start
                    }
                });
                break;
            case 1:
                var rec = _this.stTGCmpObjetivos.getById(_this.arrayidobjetivos[0]);
                if (accion == 'Adicionar') {
                    if (_this.eshija == 1) {
                        if (rec.data._is_leaf && rec.data._parent == null) {
                            _this.PaginaActual(null);
                        } else if (rec.data._is_leaf && rec.data._parent != null) {
                            var recparent = _this.stTGCmpObjetivos.getById(rec.data._parent);
                            _this.RecargarNodo(recparent.id, 0, recparent);
                        } else if (!rec.data._is_leaf) {
                            _this.RecargarNodo(rec.id, 0, rec);
                        }
                    } else
                        _this.UltimaPagina();
                } else if (accion == 'Modificar' || accion == 'Duplicar') {
                    if (rec.data._parent != null) {
                        var recparent = _this.stTGCmpObjetivos.getById(rec.data._parent);
                        _this.RecargarNodo(recparent.id, 0, recparent);
                    } else
                        _this.PaginaActual(null);

                } else if (accion == 'Eliminar') {
                    var totalseleccionados = _this.smTGCmpObjetivos.getCount();
                    if (_this.start != 0)
                        _this.posteliminar = true;
                    if (totalseleccionados > 1) {
                        _this.PaginaActual(null);
                    } else {
                        if (rec.data._parent == null) {
                            _this.PaginaActual(null);
                        } else {
                            var recparent = _this.stTGCmpObjetivos.getById(rec.data._parent);
                            _this.RecargarNodo(recparent.id, 0, recparent);
                        }
                    }
                } else if (accion == 'Cancelar-Cerrar') {
                    if (_this.eshija == 1) {
                        if (rec.data._is_leaf && rec.data._parent == null) {
                            _this.PaginaActual(null);
                        }
                        if (rec.data._is_leaf && rec.data._parent != null) {
                            var recparent = _this.stTGCmpObjetivos.getById(rec.data._parent);
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
        _this.objCrudObjetivo.objcmprelaciones.arrayelementosrelacionados = [];
    };
    //Funcion que recarga y exande el nodo.
    this.RecargarNodo = function (anode, start, rec) {
        _this.stTGCmpObjetivos.reload({
            params: {
                anode: anode,
                start: start
            },
            callback: function () {
                _this.stTGCmpObjetivos.collapseNode(rec);
                _this.stTGCmpObjetivos.setNodeLoaded(rec, false);
                _this.stTGCmpObjetivos.expandNode(rec);
            }
        });
    };
    //Funcion que recarga la pagina actual. Si no hay elementos listados regarga la pagina anterior.
    this.PaginaActual = function (anode) {
        _this.smTGCmpObjetivos.clearSelections();
        _this.start = (_this.ptbTGCmpObjetivos.getPageData().activePage - 1) * (_this.ptbTGCmpObjetivos.cbPageSize.getValue());
        _this.stTGCmpObjetivos.reload({
            params: {
                anode: anode,
                start: _this.start
            },
            callback: function () {
                if (_this.stTGCmpObjetivos.getCount() == 0 && _this.start != 0) {
                    _this.start = _this.start - _this.ptbTGCmpObjetivos.cbPageSize.getValue();
                    _this.stTGCmpObjetivos.reload({
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
        _this.smTGCmpObjetivos.clearSelections();
        var numentero = Math.floor(_this.stTGCmpObjetivos.getTotalCount() / _this.ptbTGCmpObjetivos.cbPageSize.getValue());
        _this.start = numentero * _this.ptbTGCmpObjetivos.cbPageSize.getValue();
        _this.stTGCmpObjetivos.reload({
            params: {
                anode: null,
                start: _this.start
            }
        });
    };

    /*this.ActualizarEliminadosMultiples = function() {
     var total = _this.arrayidobjetivos.length;
     var recparent = null;
     var rec = null;
     var reload = false;

     for(var i = 0; i < total ; i++) {
     rec = _this.stTGCmpObjetivos.getById(_this.arrayidobjetivos[i]);
     if (rec.data._is_leaf && rec.data._parent == null) {
     reload = true;
     }
     if (rec.data._is_leaf && rec.data._parent != null) {
     recparent = _this.stTGCmpObjetivos.getById(rec.data._parent);
     _this.RecargarNodo(recparent.id,0,recparent);
     }
     if (!rec.data._is_leaf){
     _this.RecargarNodo(rec.id,0,rec);
     }
     }
     (reload)?_this.PaginaActual(null) : null;
     }*/

    this.AccionesPostEjecutarFT = function () {
        _this.arrayidobjetivos = [];
        _this.stTGCmpObjetivos.reload({});
        _this.ActualizarEstadoBarraHerramientas();
    };

    //
    this.DestruirWinRelacionesMultiples = function () {
        _this.WinRelacionesMultiples.destroy();
    };


    this.cargarConfiguracionPerfil = function (tipoelemento, idcargaspordefecto) {
        _this.BarraProgreso.show('Cargando objetivos');
        Ext.Ajax.request({
            url: '/planificacion/pdo/plan/index.php/cmpgestionaractividades/getConfiguracionPerfil',
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
                        _this.ftCmpObjetivos.filters.items[2].dates.after.menu.picker.setValue(dt);
                        _this.ftCmpObjetivos.filters.items[2].active = true;
                    }
                    if (responseData.fechafin != null && responseData.fechafin != 'undefined') {
                        var dt = new Date(responseData.fechafin);
                        dt.setDate(dt.getDate() + 1);
                        _this.ftCmpObjetivos.filters.items[3].dates.before.menu.picker.setValue(dt);
                        // _this.ftCmpObjetivos.filters.items[3].dates.on.menu.picker.setValue(dt);
                        _this.ftCmpObjetivos.filters.items[3].active = true;
                    }
                    if (_this.ftCmpObjetivos.filters.items[3].active === true && _this.ftCmpObjetivos.filters.items[2].active === true) {
                        _this.ftCmpObjetivos.filters.items[2].dates.after.setChecked(true);
                        //   _this.ftCmpObjetivos.filters.items[2].dates.on.setChecked(true);
                        _this.ftCmpObjetivos.filters.items[3].dates.before.setChecked(true);
                        // _this.ftCmpObjetivos.filters.items[3].dates.on.setChecked(true);
                    } else if (_this.ftCmpObjetivos.filters.items[3].active === true) {
                        _this.ftCmpObjetivos.filters.items[3].dates.before.setChecked(true);
                        //_this.ftCmpObjetivos.filters.items[3].dates.on.setChecked(true);
                    } else if (_this.ftCmpObjetivos.filters.items[2].active === true) {
                        _this.ftCmpObjetivos.filters.items[2].dates.after.setChecked(true);
                        // _this.ftCmpObjetivos.filters.items[2].dates.on.setChecked(true);
                    }
                    if (responseData.estadoaprobacion != null && responseData.estadoaprobacion != 'undefined'
                    /*&& _this.stestados.getCount() != 0*/) {
                        _this.ftCmpObjetivos.filters.items[5].active = true;
                        _this.ftCmpObjetivos.filters.items[5].setValue(responseData.estadoaprobacion);
                    }
                    if (responseData.porcientocumplimiento != null && responseData.porcientocumplimiento != 'undefined') {
                        _this.ftCmpObjetivos.filters.items[4].active = true;
                        if (responseData.igual == 1) {
                            _this.ftCmpObjetivos.filters.items[4].menu.fields.eq.setValue(responseData.porcientocumplimiento);
                        }
                        if (responseData.mayor == 1) {
                            _this.ftCmpObjetivos.filters.items[4].menu.fields.gt.setValue(responseData.porcientocumplimiento);
                        }
                        if (responseData.menor == 1) {
                            _this.ftCmpObjetivos.filters.items[4].menu.fields.lt.setValue(responseData.porcientocumplimiento);
                        }

                    }
                    if (responseData.estadocumplimiento != null && responseData.estadocumplimiento != 'undefined' && responseData.estadocumplimiento != 0) {
                        _this.ftCmpObjetivos.filters.items[6].active = true;
                        if (responseData.estadocumplimiento == 1) {
                            _this.ftCmpObjetivos.filters.items[6].setValue('Sin cumplir');
                        } else if (responseData.estadocumplimiento == 2) {
                            _this.ftCmpObjetivos.filters.items[6].setValue('Parcialmente cumplido');
                        } else if (responseData.estadocumplimiento == 3) {
                            _this.ftCmpObjetivos.filters.items[6].setValue('Cumplido');
                        }
                    }

                    if (_this.ftCmpObjetivos.filters.items[5].active !== true)
                        _this.stTGCmpObjetivos.reload();
                } else {
                    _this.stTGCmpObjetivos.reload();
                }
            }
        });
    };

    //
    this.CrearRelaciones = function () {
        if (_this.arrayidobjetivos.length == 1) {
            _this.eshija = 0;
            _this.objCrudObjetivo.CrearWinCrudObjetivos(
                new Date().format('d/m/Y'),
                new Date().format('d/m/Y'),
                'Relacionar elementos al',
                _this.PostAccionesGestionar,
                _this.arrayidobjetivos,
                null, _this.eshija,
                permisomodificar = 1,
                permisoeliminar = 1,
                _this.objcmprelaciones.ObtenerElementosRelacionadosIniciales());
        }
        if (_this.arrayidobjetivos.length > 1) {
            if (_this.WinRelacionesMultiples) {
                _this.WinRelacionesMultiples.destroy();
            }
            _this.WinRelacionesMultiples = _this.objcmprelaciones.CrearCmpRelacionesMultiples(1, _this.arrayidobjetivos, function () {
            }, _this.DestruirWinRelacionesMultiples);
            _this.WinRelacionesMultiples.show();
        }
    };

    this.ActualizarEstadoBarraHerramientas = function () {
        _this.arrayidobjetivos = [];
        _this.arrayidestadoaprob = [];
        _this.arraynombreobjetivos = [];
        _this.arrayobjetivosseleccionados = [];
        _this.btnModificar.disable();
        _this.btnSeleccionar.disable();
        _this.btnVer.disable();
        _this.btnReordenarhijos.disable();
        _this.btnHacerRaiz.disable();
        _this.btnHistorial.disable();
        _this.btnCambiarEstado.disable();
        _this.btnDesgloce.disable();
        _this.btnExportar.disable();
        _this.btnEliminar.disable();
        _this.btnActualizarParametros.disable();
        _this.btnCriterio.disable();
        _this.btnDuplicar.disable();
        _this.btnRelaciones.disable();
        _this.btnGestObs.disable();
        _this.btn100CM.disable();
        _this.btnOtroValorCM.disable();
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
        if (_this.smTGCmpObjetivos.hasSelection()) {
            var arrayrecords = _this.smTGCmpObjetivos.getSelections();
            var totalrecords = arrayrecords.length;
            _this.btnExportar.enable();
            (totalrecords <= 1) ? _this.btnAdicionar.enable() : _this.btnAdicionar.disable();
            if (totalrecords > 0) {
                _this.btn100CM.enable();
                _this.btnOtroValorCM.enable();
                _this.btnSeleccionar.enable();
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
                    _this.arrayidestadoaprob[i] = arrayrecords[i].data.idestadoaprob;
                    _this.arrayidobjetivos[i] = arrayrecords[i].data.idelemento;
                    _this.arraynombreobjetivos[i] = arrayrecords[i].data.denominacion;
                    var elementoseleccionado = {};
                    elementoseleccionado = {
                        idelemento: arrayrecords[i].data.idelemento,
                        denominacion: arrayrecords[i].data.denominacion,
                        tipoelemento: 1,
                        autorelemento: arrayrecords[i].data.nombreautor,
                        _parent: arrayrecords[i].data._parent,
                        _is_leaf: arrayrecords[i].data._is_leaf,
                        superior: arrayrecords[i].data.superior,
                        subordinado: arrayrecords[i].data.subordinado,
                        idautor: arrayrecords[i].data.idautor
                    };
                    _this.arrayobjetivosseleccionados.push(elementoseleccionado);

                    if (arrayrecords[i].data.subordinado == 0) {
                        subordinados = 0;
                    }
                }
                if (totalrecords == 1 && arrayrecords[0].data.superior == 1) {
                    _this.permitirreasignar = 1;
                }
                _this.btnRelaciones.enable();
                _this.permitirrelaciones = 1;
                if (totalrecords == 1) {
                    _this.btnCriterio.enable();
                    _this.btnDuplicar.enable();
                    _this.permitirduplicar = 1;
                    _this.btnGestObs.enable();
                    _this.btnDesgloce.enable();
                    _this.btnVer.enable();
                    _this.btnHistorial.enable();
                }
                if (puedemodificar == 1 && totalrecords == 1) {
                    _this.btnModificar.enable();
                    _this.permitirmodificar = 1;
                }
                if (puedemodificar == 1) {
                    _this.mostrarmenuaprob = 1;
                }
                if (puedeeliminar == 1) {
                    _this.btnEliminar.enable();
                    _this.btnActualizarParametros.enable();
                    _this.permitireliminar = 1;
                }
                if (puedereordenarhijos == 1) {
                    _this.permitirreordenarhijos = 1;
                }
                if (totalrecords > 0) {
                    _this.btnCambiarEstado.enable();
                    //_this.btnSeleccionar.enable();
                    _this.btnReordenarhijos.enable();
                    if (_this.smTGCmpObjetivos.getSelected().json._parent != null) {
                        _this.btnHacerRaiz.enable();
                    }
                }
                /*if (totalrecords > 1) {
                 _this.btnGraficas.disable();
                 } else if((totalrecords == 1 && arrayrecords[0].data.criterios == 1)){
                 _this.btnGraficas.enable();
                 } else if((totalrecords == 1 && arrayrecords[0].data.criterios == 0)){
                 _this.btnGraficas.disable();
                 }*/
                if (subordinados == 1) {
                    _this.subordinados = 1;
                }
            }
        }
        var arrayautores = _this.objclasificadorinvol.ObtenerAutoresBusqueda();
        var arrayinvolucrados = _this.objclasificadorinvol.ObtenerInvolucradosBusqueda();
        if ((_this.ftCmpObjetivos.getFiltrosActivos() == undefined || _this.ftCmpObjetivos.getFiltrosActivos().length == 0) && (arrayautores.length == 0 && arrayinvolucrados.length == 0)) {
            _this.btnLimpiar2.disable();
        } else _this.btnLimpiar2.enable();
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
                    url: 'importarActividades',
                    timeout: 3600000,
                    params: {
                        idpadre: (_this.smTGCmpObjetivos.getSelected() != undefined) ? _this.smTGCmpObjetivos.getSelected().id : null
                    },
                    failure: function (form, action) {
                        barraImporActividades.hide();
                        if (action.result.mensaje == 1) {
                            mostrarMensaje(1, 'Los datos fueron cargados correctamente.');
                            _this.fpImportarActividades.getForm().reset();
                            _this.wImportarActividades.hide();
                            _this.stTGCmpObjetivos.reload();

                            if (_this.smTGCmpObjetivos.getSelected() != undefined) {
                                var rec = _this.smTGCmpObjetivos.getSelected();
                                var recparent = _this.stTGCmpObjetivos.getById(rec.data.idelemento);
                                if (rec.data._is_leaf) {
                                    recparent.set('_is_leaf', false);
                                    _this.TGCmpObjetivos.getView().refresh();
                                }
                                _this.smTGCmpObjetivos.selectRecords([recparent]);
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

    //funcion para levantar el componente 'Actividades' para reorganizar actividades hijas
    this.ReorganizarHijos = function () {
        var objcmpobj = new Utilidades.Cmp.Cmpgestionarobjetivos(
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
                singlemodoSeleccionGridObjetivos: true,
                reordenarHijos: true,
                arraysubobjetivos: _this.arrayobjetivosseleccionados,
                noUsarMenuGrid: true,
                closableWinPrincipal: true,
                titleWinPrincipal: 'Registro de objetivos'
            });
        var aux = [];
        for (var i = 0; i < _this.smTGCmpObjetivos.getCount(); i++) {
            aux.push(_this.smTGCmpObjetivos.getSelections()[i].id);
            if (_this.smTGCmpObjetivos.getSelections()[i].data._parent != null)
                aux.push(_this.smTGCmpObjetivos.getSelections()[i].data._parent);
        }
        objcmpobj.CargarCmpObjetivos(idelemento = null, tipoelemento = null, parentelemento = 'hijo',
            function () {
                _this.smTGCmpObjetivos.clearSelections();
                var start = (_this.ptbTGCmpObjetivos.getPageData().activePage - 1) * (_this.ptbTGCmpObjetivos.cbPageSize.getValue());//_this.cbpaginado.getValue());
                _this.stTGCmpObjetivos.reload({
                    params: {
                        anode: null,
                        start: start
                    }
                });
            }, aux);
    };

    //funcion a ejecutarse para relacionar el o los objetivos seleccionados con otros elementos
    this.RelacionarElementos = function () {
        if (opcionesConfig.reordenarHijos == true) {
            _this.AccionesAlReordenar(opcionesConfig.arraysubobjetivos, _this.arrayobjetivosseleccionados, _this.WinPrincipal);
        } else {
            _this.AccionesAlRelacionar(_this.arrayobjetivosseleccionados, _this.WinPrincipal);
        }
    };

    this.AccionesAlReordenar = function (arraysubobjetivos, arrayobjetivospadres, WinPrincipal) {
        mostrarMensaje(2, '¿Est&aacute; seguro que quiere reorganizar el(los) sub-objetivo(s) seleccionado(s)? ', function (btnoprimido) {
            if (btnoprimido == 'ok') {
                _this.BarraProgreso.show('Reorganizando sub-objetivo(s)');
                Ext.Ajax.request({
                    url: '/planificacion/pdo/plan/index.php/cmpgestionarobjetivos/reorganizarobjetivos',
                    params: {
                        arraysubobjetivos: Ext.encode(arraysubobjetivos),
                        arrayobjetivospadres: Ext.encode(arrayobjetivospadres)
                    },
                    callback: function (options, success, response) {
                        _this.BarraProgreso.hide();
                        responseData = Ext.decode(response.responseText);
                        if (responseData.mensaje == 0) {
                            mostrarMensaje(1, 'No se ha(n) podido reordenar el(los) sub-objetivo(s) seleccionado(s).', function () {
                                WinPrincipal.destroy();
                                _this.arrayidobjetivosReorganizar = [];
                                _this.AccionesAlRelacionar();
                            });
                        }

                        if (responseData.mensaje == 1) {
                            mostrarMensaje(1, 'El(Los) sub-objetivo(s) ha(n) sido reordenado(s) satisfactoriamente.');
                            WinPrincipal.destroy();
                            _this.arrayidobjetivosReorganizar = [];
                            _this.AccionesAlRelacionar();
                        }
                    }
                });
            }
        });
    };

    //funcion que se encarga de contruir la ventana con el desgloce del objetivo
    this.ConstruirWinDesgloce = function () {
        if (_this.WinDesgloce) {
            _this.WinDesgloce.destroy();
        }

        //arbol con los elementos del desgloce
        _this.tpdesglose = new Ext.tree.TreePanel({
            autoScroll: true,
            bbar: [
                '-', 'Leyenda: ', ' ',
                {
                    text: 'Plan',
                    iconCls: 'folder',
                    disabled: true,
                    disabledClass: ''
                }, ' ', ' ', ' ', ' ',
                {
                    text: 'ARC',
                    iconCls: 'gestionardocumentosporsubsistema',
                    disabled: true,
                    disabledClass: ''
                }, ' ', ' ', ' ', ' ',
                {
                    text: 'Objetivo',
                    iconCls: 'archivo',
                    disabled: true,
                    disabledClass: ''
                }, ' ', ' ', ' ', ' ',
                {
                    text: 'Criterio',
                    iconCls: 'unidadmedida',
                    disabled: true,
                    disabledClass: ''
                }, ' ', ' ', ' ', ' ',
                {
                    text: 'Actividad',
                    iconCls: 'actividades',
                    disabled: true,
                    disabledClass: ''
                }, ' ', ' ', ' ', ' ',
                {
                    text: 'FIP',
                    iconCls: 'ficha',
                    disabled: true,
                    disabledClass: ''
                }, ' ', ' ', ' ', ' ',
                {
                    text: 'Desviación',
                    iconCls: 'conflicto',
                    disabled: true,
                    disabledClass: ''
                },
                '-'
            ],
            split: false,
            useArrows: true,
            width: 200,
            height: 200,
            root: {
                text: _this.arraynombreobjetivos[0],
                expanded: true,
                idtipoelemento: '1',
                iconCls: 'archivo',
                idelemento: _this.arrayidobjetivos[0]
            },
            loader: new Ext.tree.TreeLoader({
                dataUrl: '/planificacion/pdo/plan/index.php/cmpgestionarobjetivos/desglozarobjetivo',
                listeners: {
                    'beforeload': function (atreeloader, anode) {

                        atreeloader.baseParams = {
                            idelemento: anode.attributes.idelemento,
                            idarc: anode.attributes.idarc,
                            trinomio: 0,
                            idtipoelemento: anode.attributes.idtipoelemento
                        };
                    }
                }
            }),
            contextMenu: new Ext.menu.Menu({
                items: [{
                    id: 'detalles',
                    text: '<b>Mostrar detalles</b> ',
                    iconCls: 'ver',
                    tooltip: 'Mostrar detalles'
                }],
                listeners: {
                    itemclick: function (item) {
                        switch (item.id) {
                            case 'detalles':
                                var n = item.parentMenu.contextNode;
                                _this.CrearVentanaDetalles(n);
                                break;
                        }
                    }
                }

            }),
            listeners: {
                contextmenu: function (node, e) {
                    if (node.attributes.idtipoelemento != 0) {
                        node.select();
                        var c = node.getOwnerTree().contextMenu;
                        c.contextNode = node;
                        c.showAt(e.getXY());
                    }
                }
            }
        });
        //ventana que carga el arbol donde se mostrara el desgloce del objetivo
        _this.WinDesgloce = new Ext.Window({
            maximizable: true,
            modal: true,
            closeAction: 'hide',
            constrain: true,
            layout: 'fit',
            title: 'Desglose del objetivo: ' + _this.arraynombreobjetivos[0],
            width: 620,
            height: 400,
            items: _this.tpdesglose,
            buttons: [{
                iconCls: 'cerrar',
                text: 'Cerrar',
                tooltip: 'Cerrar ventana',
                handler: function () {
                    _this.WinDesgloce.destroy();
                }
            }]
        });
        _this.WinDesgloce.show();
    };

    //funcion que muestra los detalles del desgloce
    this.CrearVentanaDetalles = function (n) {
        var idtipoelemento = n.attributes.idtipoelemento;
        switch (idtipoelemento) {
            case '1':
                var arrayidobjetivos = [];
                arrayidobjetivos[0] = n.attributes.idelemento;
                var eshija = 0;
                var objCrudObjetivo = new Utilidades.Cmp.Cmpcrudobjetivos();
                objCrudObjetivo.CrearWinCrudObjetivos(
                    new Date().format('d/m/Y'), new Date().format('d/m/Y'),
                    'Ver datos del', function () {
                    },
                    arrayidobjetivos, null, eshija, permisomodificar = 1,
                    permisoeliminar = 1, arrayelementosrelacionadosinicial = []);
                break;
            case 3:
                var arrayidactividades = [];
                arrayidactividades[0] = n.attributes.idelemento;
                var eshija = 0;
                var objCrudActividad = new Utilidades.Cmp.Cmpcrudactividades();
                objCrudActividad.CrearWinCrudActividades(
                    new Date().format('d/m/Y'), new Date().format('d/m/Y'),
                    '8:00 AM', '5:00 PM', 'Ver datos de la', function () {
                    },
                    arrayidactividades, null, eshija, permisomodificar = 1,
                    permisoeliminar = 1, arrayelementosrelacionadosinicial = []);
                break;
            case 4:
                var objCrudObjetivo = new Utilidades.Cmp.Cmpcrudobjetivos();
                objCrudObjetivo.arrayidcriterios = [];
                objCrudObjetivo.arrayidcriterios[0] = n.attributes.idelemento;
                objCrudObjetivo.CrearWinCriterio('Ver datos del', new Date().format('d/m/Y'), new Date().format('d/m/Y'));
                break;
        }
    };

    //funcion para mostrar el icono "activo"
    function MostrarImagenActivo(valor) {
        if (valor == 0) {
            return '<center><span><img src="../../../comun/recursos/images/fam/desactivo.png" ></span></center>';
        }
        else {
            return '<center><span><img src="../../../comun/recursos/images/fam/activo.png" ></span></center>';
        }
    }

    //funcion para mostrar el icono "tipo de elemento"
    function MostrarImagenTipoElemento(valor, m) {
        m.attr = 'ext:qtip="<b>' + valor + '</b>"';
        //return '<span><img src="../../../comun/recursos/images/fam/obj_ejec.png" >' + ' ' + valor + '</span>';
        return '<span class="icondistra-archivo sipac-azul">' + ' ' + valor + '</span>';
    }

    //funcion para mostrar el icono "estado de cumplimiento"
    function MostrarImagenEstadoCumplimiento(val, b, c) {
        val3 = c.data.gradocumplimiento * 1;
        if (val3 == 0) {
            return '<span class="icondistra-bandera sipac-roja">' + ' ' + val + '</span>';
        }
        if (val3 > 0 && val3 < 95) {
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
            //return '<center><span><img src="../../../comun/recursos/images/fam/tick.png" ></span></center>';
            return '<center><span class="icondistra-validaryaceptar sipac-verde"></span></center>';
        }
    }

    //funcion para cambiarle el titulo al grid de Objetivos cuando filtre    
    this.changeTitleObjetivos = function () {
        var filtrado_por = "";
        var sep = "/";
        if ((_this.ftCmpObjetivos.getFiltrosActivos() == undefined || _this.ftCmpObjetivos.getFiltrosActivos().length == 0) && _this.stTGCmpObjetivos.getSortState() == undefined) {
            _this.PanPrincipal.setTitle(opcionesConfig.nombrePanel);
        }
        else if (_this.stTGCmpObjetivos.getSortState() != undefined && (_this.ftCmpObjetivos.getFiltrosActivos() == undefined || _this.ftCmpObjetivos.getFiltrosActivos().length == 0)) {
            _this.field = _this.stTGCmpObjetivos.getSortState().field;
            _this.dir = _this.stTGCmpObjetivos.getSortState().direction;

            var atributo = '';
            var direccion = '';
            if (_this.dir == 'DESC')
                direccion = 'descendentemente';
            else
                direccion = 'acendentemente';
            if (_this.field == 'denominacion') {
                atributo = 'Denominación';
            }
            else if (_this.field == 'idelemento') {
                atributo = 'CAR';
            } else if (_this.field == 'fechainicio') {
                atributo = 'Fecha de inicio';
            } else if (_this.field == 'fechafin') {
                atributo = 'Fecha fin';
            } else if (_this.field == 'gradocumplimiento') {
                atributo = 'Porciento de cumplimiento';
            } else
                atributo = false;
            /*if (atributo)
             _this.PanPrincipal.setTitle('Registro de objetivos <i>- Ordenado ' + direccion + ' por: ' + atributo + '</i>');
             else
             _this.PanPrincipal.setTitle(opcionesConfig.nombrePanel);*/
        } else {
            for (i = 0; i < _this.ftCmpObjetivos.getFiltrosActivos().length; i++) {
                var aux = "";
                if (_this.ftCmpObjetivos.getFiltrosActivos()[i].dataIndex == "denominacion") {
                    aux = 'Denominaci&oacute;n';
                } else if (_this.ftCmpObjetivos.getFiltrosActivos()[i].dataIndex == "idelemento") {
                    aux = 'CAR';
                } else if (_this.ftCmpObjetivos.getFiltrosActivos()[i].dataIndex == "fechainicio") {
                    aux = 'Fecha de Inicio';
                } else if (_this.ftCmpObjetivos.getFiltrosActivos()[i].dataIndex == "fechafin") {
                    aux = 'Fecha de Fin';
                } else if (_this.ftCmpObjetivos.getFiltrosActivos()[i].dataIndex == "nombreautor") {
                    aux = 'Autor';
                } else if (_this.ftCmpObjetivos.getFiltrosActivos()[i].dataIndex == "textocumplimiento") {
                    aux = 'Estado de cumplimiento';
                } else if (_this.ftCmpObjetivos.getFiltrosActivos()[i].dataIndex == "nombreestadoaprob") {
                    aux = 'Estado de aprobaci&oacute;n';
                } else if (_this.ftCmpObjetivos.getFiltrosActivos()[i].dataIndex == "gradocumplimiento") {
                    aux = 'Porciento de cumplimiento';
                } else if (_this.ftCmpObjetivos.getFiltrosActivos()[i].dataIndex == "criterios") {
                    aux = 'CM';
                } else {
                    aux = 'Observ.';
                }
                if (i == _this.ftCmpObjetivos.getFiltrosActivos().length - 1) {
                    sep = "";
                }
                filtrado_por += aux + sep;
            }
            // _this.PanPrincipal.setTitle('Registro de objetivos <i>- Filtrado por: ' + filtrado_por + '</i>');
            filtrado_por = "";
        }
    };

    this.ObtenerSmObjetivos = function () {
        return _this.smTGCmpObjetivos;
    };
    this.ObtenerStObjetivos = function () {
        return _this.stTGCmpObjetivos;
    };

    this.verGraficas = function (panel) {
        this.btnCerrarEstadistica = new Ext.Button({
            iconCls: 'cerrar',
            text: 'Cerrar',
            id: 'btnEstadistica',
            nextTab: 'btnEstadistica',
            prevTab: 'btnEstadistica',
            tooltip: 'Cerrar ventana',
            handler: function () {
                winGraficas.hide();
            }
        });
        winGraficas = new Ext.Window({
            layout: 'fit',
            title: 'Estadística',
            constrain: true,
            closable: true,
            maximized: false,
            modal: true,
            closeAction: 'hide',
            width: 850,
            height: 450,
            items: [panel],
            buttons: [_this.btnCerrarEstadistica]
        });
        winGraficas.show();
        winGraficas.on('beforeshow', function () {
            _this.btnCerrarEstadistica.focus(true, 700);
        });
        _this.btnCerrarEstadistica.focus(false, 1024);
        setTimeout(function () {
            _this.btnCerrarEstadistica.focus(true);
        }, 500);
    };

    this.actualizarCumplimientoCM = function (porciento) {

        Ext.Ajax.request({
            url: '/planificacion/pdo/plan/index.php/cmpgestionarobjetivos/actualizarPorcientoCM',
            params: {
                listadoId: Ext.encode(_this.arrayidobjetivos),
                campo: 'idobjetivo',
                porciento: porciento || 100
            },
            callback: function (options, success, response) {

                if (success) {
                    mostrarMensaje(1, 'Los criterios de medida han sido modificados satisfactoriamente.');

                    _this.btn100CM.disable();
                    _this.smTGCmpObjetivos.clearSelections();
                    var start = (_this.ptbTGCmpObjetivos.getPageData().activePage - 1) * (_this.ptbTGCmpObjetivos.cbPageSize.getValue());//_this.cbpaginado.getValue());
                    _this.stTGCmpObjetivos.reload({
                        params: {
                            anode: null,
                            start: start
                        }
                    });
                }
            }
        });
    };

    this.actualizarCumplimientoParcialCM = function () {
        Ext.Msg.prompt('Criterio de medida', 'Porciento de cumplimiento:', function (btn, text) {
            var porciento = parseInt(text);
            if (btn == 'ok' && (porciento >= 0 && porciento <= 100)) {
                _this.actualizarCumplimientoCM(porciento);
            }
        });
    }

};
