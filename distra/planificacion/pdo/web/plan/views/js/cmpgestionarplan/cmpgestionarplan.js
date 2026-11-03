Utilidades.Cmp.Cmpgestionarplan = function (opcionesConfig) {
		var _this = this;
		Ext.Ajax.timeout = 1000000000;
		this.prevrow = -1;
		this.idtipodocumento = 0;
		this.idaprobdiferentes = 0;
		this.eshija = 0;
		this.idcomponente = opcionesConfig.idcomponente;
		this.start = 0;
		this.arrayidactividades = [];
		this.posteliminar = false;
		var fechaactual = new Date();
		var annoactual = fechaactual.getFullYear();

		//componente para el manejo de los mensajes de errores de texto regido
		this.ObjValidaciones = new Utilidades.Cmp.Cmpvalidaciones();
		this.objHistorial = new Utilidades.Cmp.Cmphistorial({mostrarVentana: false, panel: 'plan'});
		//objeto CRUD-PLAN inicializado
		this.objCrudPlan = new Utilidades.Cmp.Cmpcrudplan();
		//objeto CRUD-objetivo inicializado
		this.objCrudObjetivo = new Utilidades.Cmp.Cmpcrudobjetivos();
		//objeto CRUD-ACTIVIDADES inicializado
		this.objCrudActividad = new Utilidades.Cmp.Cmpcrudactividades();
		//objeto del componente "relaciones"
		this.objcmprelaciones = new Utilidades.Cmp.Cmprelaciones();
		//objeto del componente observaciones inicializado
		this.objCmpObservaciones = new Utilidades.Cmp.Cmpgestionarobservaciones();
		//objeto del componente "clasificador de involucrados"
		this.objclasificadorinvol = new Utilidades.Cmp.Cmpclasificadorinvol();
		/*//inicializando el objeto menu dinamico
		 this.objcmpmenurelacionesdin = new Utilidades.Cmp.CmpMenuRelacionesDinamicas();*/
		//objeto del componente "barra de progreso"
		this.BarraProgreso = new BarraEstado();
		//objeto de configuraci'on de perfil el que esta en plan
		this.objconfiguracionperfil = new Utilidades.Cmp.Cmpconfigurarperfil({mostrarVentana: false, panel: 'plan'});
		//objeto del componente "exportarimportar"
		this.cmpexpimp = new Utilidades.Cmp.Cmpexportarimportar();
		//objeto del componente "notificaciones"
		this.objCmpNotificaciones = new Utilidades.Cmp.CmpNotificaciones(
				{
						MostrarFiltroPorTipoElem: true,
						UsarBtnCerrar: false,
						maxWinPrincipal: false,
						closeableWinPrincipal: true,
						Mostrartitle: 'Registro de notificaciones'
				});

		//  Componente Traspasar Plan
		this.objTraspasarPlan = new Utilidades.Cmp.CmpTraspasarPlan();

		//objeto del componente "pert"
		this.objCmpPert = new Utilidades.Cmp.Cmpgestionarpert(
				{
						noUsarCerrarWinP: false,
						noUsarSeleccionarWinP: true,
						maxWinPrincipal: true,
						tipoComponente: 'window',
						idcmp: _this.idcomponente + "planes",
						noAutoload: false,
						titleWinPrincipal: 'Diagrama de Pert',
						noUsarAyuda: false,
						objCmpCrudActividad: _this.objCrudActividad,
                    	generarDiagramaDesde: 'Plan'
				});


		//variables
		this.opcionBusqueda = 3;
		this.arrayidplan = [];
		this.arrayidestadoaprob = [];
		this.arrayplanesseleccionados = [];
		this.permitirmodificar = 0;
		this.permitireliminar = 0;
		this.horainicio = '08:00';
		this.horafin = '17:00';
		var hiddenAdd = false;
		if (opcionesConfig.noUsarAdicionar == true) {
				hiddenAdd = true;
		}

		//botones para la gestion de los planes
		this.btnAdicionar = new Ext.Button({
				handler: function () {
						_this.objCrudPlan.CrearWinCrudPlan(
								'Adicionar', _this.PostAccionesGestionar,
								_this.arrayidplan, _this.smTGCmpPlan, _this.stTGCmpPlan);
				},
				hidden: hiddenAdd,
				disabled: false,
				iconCls: 'adicionar',
				tooltip: 'Adicionar plan',
				key: {
						alt: true,
						key: 'I'
				},
				scope: this
		});
		this.btnAdicionarProyecto = new Ext.Button({
				handler: function () {
						_this.objCrudPlan.CrearWinCrudPlan(
								'Adicionar', _this.PostAccionesGestionar,
								_this.arrayidplan, _this.smTGCmpPlan, _this.stTGCmpPlan);
				},
				hidden: hiddenAdd,
				disabled: false,
				iconCls: 'adicionar',
				tooltip: 'Adicionar proyecto',
				key: {
						alt: true,
						key: ''
				},
				scope: this
		});
		this.btnModificar = new Ext.Button({
				handler: function () {
						_this.objCrudPlan.CrearWinCrudPlan(
								'Modificar', _this.PostAccionesGestionar,
								_this.arrayidplan, _this.smTGCmpPlan);
				},
				hidden: opcionesConfig.noUsarModificar,
				disabled: true,
				iconCls: 'modificar',
				tooltip: 'Modificar plan',
				key: {
						alt: true,
						key: 'M'
				},
				scope: this
		});

		this.btnVer = new Ext.Button({
				handler: function () {
						_this.objCrudPlan.CrearWinCrudPlan(
								'Ver datos del', _this.PostAccionesGestionar,
								_this.arrayidplan, _this.smTGCmpPlan);
				},
				disabled: true,
				iconCls: 'ver',
				tooltip: 'Ver datos del plan',
				key: {
						alt: true,
						key: 'D'
				},
				scope: this
		});

		this.btnHistorial = new Ext.Button({
				handler: function () {
						_this.objHistorial.verHistorial('plan', _this.smTGCmpPlan.getSelected().id);
				},
				hidden: false,
				disabled: true,
				iconCls: 'historial',
				tooltip: 'Consultar historial del plan',
				key: {
						ctrl: true,
						alt: true,
						key: 'H'
				},
				scope: this
		});

		this.btnEliminar = new Ext.Button({
				handler: function () {
						_this.objCrudPlan.EliminarPlan(
								_this.arrayidplan, _this.PostAccionesGestionar, _this.smTGCmpPlan, _this.TGCmpPlan);
				},
				hidden: opcionesConfig.noUsarEliminar,
				disabled: true,
				iconCls: 'eliminar',
				tooltip: 'Eliminar plan',
				key: {
						key: Ext.EventObject.DELETE
				},
				scope: this
		});
		//Cambiar estado
		if (_this.objcmpmenurelacionesdin) {
				_this.objcmpmenurelacionesdin = null;
		}
		//inicializando el objeto menu dinamico
		_this.objcmpmenurelacionesdin = new Utilidades.Cmp.CmpMenuRelacionesDinamicas();
		this.btnCambiarEstado = new Ext.Button({
				tooltip: 'Cambiar el estado de aprobaci&oacute;n del(de los) plan(es)',
				disabled: true,
				iconCls: 'cambiodestado',
				id: 'btnitmaprov',
				menu: _this.objcmpmenurelacionesdin.menuinicial,
				handler: function () {
						var mensaje = '';
						if (_this.arrayidplan.length > 1) {
								mensaje = 'No existen otros estados al cual usted pueda cambiar los planes desde el estado actual.';
						} else {
								mensaje = 'No existen otros estados al cual usted pueda cambiar el plan desde el estado actual.';
						}
						//actualizar el sub-menu de Cambiar estado
						_this.objcmpmenurelacionesdin.CrearMenuAprobacionConc(
								_this.AccionesPostEjecutarFT, mensaje,
								_this.TGCmpPlan, '',
								_this.arrayidplan,
								_this.arrayidestadoaprob,
								_this.idtipodocumento
						);
				}
		});

		this.btnActivar = new Ext.Button({
				handler: function () {
						_this.objCrudPlan.ActivarDesactivarPlan(_this.arrayidplan, _this.PostAccionesGestionar, 'activar');
				},
				hidden: opcionesConfig.noUsarActivar,
				text: 'Activar',
				disabled: true,
				iconCls: 'habilitar',
				tooltip: 'Activar plan',
				key: {
						alt: true,
						key: 'X'
				},
				scope: this
		});
		this.btnDesactivar = new Ext.Button({
				handler: function () {
						_this.objCrudPlan.ActivarDesactivarPlan(_this.arrayidplan, _this.PostAccionesGestionar, 'desactivar');
				},
				hidden: opcionesConfig.noUsarDesactivar,
				text: 'Desactivar',
				disabled: true,
				iconCls: 'deshabilitar',
				tooltip: 'Desactivar plan',
				key: {
						alt: true,
						key: 'F'
				},
				scope: this
		});
		this.btnGestObs = new Ext.Button({
				handler: function () {
						_this.objCmpObservaciones.CargarCmpObservaciones(_this.arrayidplan[0], 'plan', _this.PostAccionesGestionar);
				},
				hidden: opcionesConfig.noUsarGestObser,
				disabled: true,
				iconCls: 'vistareporte',
				tooltip: 'Gestionar observaciones al plan',
				key: {
						ctrl: true,
						alt: true,
						key: 'G'
				}
		});
		this.btnPanelBusqueda = new Ext.Button({
				disabled: false,
				iconCls: 'buscaravanzada',
				tooltip: 'B&uacute;squeda avanzada de plan(es)',
				handler: function () {
						_this.pBuscarPlan.toggleCollapse(true);
						_this.tpAutoresInvolucrados.doLayout();
				},
				key: {
						alt: true,
						key: 'B'
				}
		});
		this.btnVerNotif = new Ext.Button({
				disabled: false,
				iconCls: 'notificaciones',
				tooltip: 'Consultar notificaciones generadas',
				handler: function () {
						_this.objCmpNotificaciones.CargarCmpNotificaciones(0);
				},
				key: {
						ctrl: true,
						key: 'O'
				}
		});
		this.btnConfPerfil = new Ext.Button({
				handler: function () {
						_this.objconfiguracionperfil.verConfiguracionperfil(_this.cargarConfiguracionPerfil, 0);
				},
				disabled: false,
				iconCls: 'filtrar',
				tooltip: 'Configurar cargas por defecto',
				key: {
						alt: true,
						ctrl: true,
						key: 'F'
				},
				scope: this
		});

		/*this.btnImportarPlanAnual = new Ext.Button({
				handler: function () {
						if (_this.wImportarPlanAnual) {
								_this.wImportarPlanAnual.show();
						} else {
								_this.CargarVentanaImportarPlanAnual();
						}
				},
				disabled: true,
				iconCls: 'importar',
				tooltip: 'Importar plan anual',
				key: {
						alt: true,
						ctrl: true,
						key: 'A'
				},
				scope: this
		});*/

		this.menuImportarPlanAnual =  new Ext.Button(
				{
						id: 'btnImportarPlan',
						tooltip: 'Importar',
						iconCls: 'importar',
						disabled: false,
						menu    : new Ext.menu.Menu(
								{
										items:
												[
														{
																id:'btnImpPlanAnual',
																text: 'Importar plan anual (Excel)',
																handler: function () {
																				_this.CargarVentanaImportarPlanAnual(1);
																},
																disabled: true,
																iconCls: 'importar',
																tooltip: 'Importar plan anual',
																key: {
																		alt: true,
																		ctrl: true,
																		key: 'A'
																},
																scope: this
														}, {
														text: 'Importar puntualizaciones (Excel)',
														handler: function () {
																		_this.CargarVentanaImportarPlanAnual(2);
														},
														key: {
																alt: true,
																ctrl: true,
																key: 'P'
														},
														disabled: false,
														iconCls: 'importar',
														tooltip: 'Importar puntualizaciones (Excel)',
														id: 'btnImportarPuntualizaacionesExcel'
												}, {
														text: 'Descargar formato (Excel)',
														handler: function() {
																window.open('../../resources/descargas/FORMATO_DE_IMPORTAR_PLAN.xls');
														},
														disabled: false,
														iconCls: 'importar',
														tooltip: 'Descargar formato (Excel)',
														id: 'descargarexcel'
												}
												]
								})
				});

		this.btnExportarPlanAnual = new Ext.Button({
				handler: function () {
						if (_this.wExportarPlanAnual) {
								_this.wExportarPlanAnual.show();
						} else {
								_this.CargarVentanaExportarPlanAnual();
						}


				},
				disabled: true,
				iconCls: 'exportar',
				tooltip: 'Exportar plan anual',
				key: {
						alt: true,
						ctrl: true,
						key: 'E'
				},
				scope: this
		});

		this.CargarVentanaImportarPlanAnual = function (accion) {

				var url=(accion==1)?"importarPlanAnual":"importarPuntualizaciones";
				var title = (accion==1)?"Importar archivo":"Importar archivo de puntualizaciones";

				//store para el combo de meses
				this.storeMesesImportar = new Ext.data.SimpleStore({
						fields: ['idmes', 'mes'],
						data: [
								["01", "Enero"],
								["02", "Febrero"],
								["03", "Marzo"],
								["04", "Abril"],
								["05", "Mayo"],
								["06", "Junio"],
								["07", "Julio"],
								["08", "Agosto"],
								["09", "Septiembre"],
								["10", "Octubre"],
								["11", "Noviembre"],
								["12", "Diciembre"]
						]
				});

				//combo de mese
				this.cbmesesImportar = new Ext.form.ComboBox({
						id: 'cbmeses',
						name: 'cbmeses',
						fieldLabel: 'Mes',
						//allowBlank: false,
						store: _this.storeMesesImportar,
						displayField: 'mes',
						typeAhead: true,
						mode: 'local',
						hiddenName:(accion==1),
						hideLabel:(accion==1),
						hidden:(accion==1),
						forceSelection: true,
						triggerAction: 'all',
						hiddenName: 'idmes',
						valueField: 'idmes',
						width: 150,
						emptyText: 'Seleccione',
						disabled: false,
						enableKeyEvents: true,
						listeners: {
								select: function (combo, record, index) {
										if (_this.tfanno.getValue() == '') {
												_this.tfanno.setValue(annoactual);
										}
										//btnImprimir.enable();
								}
						}
				});

				this.tfanno = new Ext.form.NumberField({
						allowDecimals: false,
						allowNegative: false,
						allowBlank: false,
						maxLength: 4,
						minLength: 1,
						fieldLabel: 'Año',
						name: 'tfanno',
						width: 100,
						enableKeyEvents: true,
						listeners: {
								focus: function (tf) {
										if (_this.tfanno.getValue() == '') {
												_this.tfanno.setValue(annoactual);
										}
								}
						}
				});

				_this.stestadosAprob = new Ext.data.Store({
						url: '/planificacion/pdo/plan/index.php/cmpgestionarplan/cargarcmbestados',
						autoLoad: true,
						listeners: {
								load: function (st) {
								}
						},
						reader: new Ext.data.JsonReader(
								{
										id: 'idestado',
										root: "data"
								}, [{
										name: 'idestado'
								}, {
										name: 'denominacion'
								}]),
						sortInfo: {field: "denominacion", direction: "ASC"},
				});


				//combo del filtro por estados de aprobacion
				_this.cbestadosAprob = new Ext.form.ComboBox({
						fieldLabel: 'Estado de plan',
						store: _this.stestadosAprob,
						valueField: 'idestado',
						displayField: 'denominacion',
						triggerAction: 'all',
						mode: 'local',
						editable: true,
						allowBlank: false,
						forceSelection: true,
						loadingText: 'Cargando...',
						emptyText: 'Seleccione...',
						anchor: '95%',
						listeners: {
								select: function (cb, record, index) {
								},
								expand: function () {
										_this.stestadosAprob.reload();
								}
						}
				});

				_this.fpImportarPlanAnual = new Ext.FormPanel({
						labelAlign: 'top',
						fileUpload: true,
						frame: true,
						items: [
								{
										layout: 'column',
										border: false,
										items: [
												{
														columnWidth: 0.5,
														layout: 'form',
														bodyStyle: 'padding:0 0 0',
														items: _this.tfanno
												}, {
														columnWidth: 0.5,
														layout: 'form',
														bodyStyle: 'padding:0 0 0',
														items: _this.cbmesesImportar
												}
											]
								},

								_this.cbestadosAprob, {
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

				_this.btnCancelarPlanAnual = new Ext.Button({
						iconCls: 'cancelar',
						text: 'Cancelar',
						tooltip: 'Cerrar ventana sin guardar los datos',
						handler: function () {
								_this.wImportarPlanAnual.destroy();
						}
				});

				_this.btnAceptarPlanAnual = new Ext.Button({
						iconCls: 'aceptar',
						text: 'Aceptar',
						tooltip: 'Guardar datos y cerrar ventana',
						handler: function () {
								_this.importarElementosPlanAnual();
						}
				});

				_this.importarElementosPlanAnual = function () {
						var barraImporPlanAnual = Ext.MessageBox.show({
								title: 'Importando datos',
								msg: 'Espere por favor esto puede demorar unos minutos...',
								width: 270,
								wait: true,
								progress: true,
								closable: false
						});

						_this.fpImportarPlanAnual.getForm().submit(
								{
										method: 'POST',
										url: url,
										timeout: 3600000,
										params: {
												idplan: _this.smTGCmpPlan.getSelected().id,
												idestado: _this.cbestadosAprob.getValue()
										},
										failure: function (form, action) {
												//console.log(action)
												barraImporPlanAnual.hide();
												//console.log(action.result.arrayErrores.length);
												if (action.result.mensaje == 1) {
														if (action.result.arrayErrores.length > 0) {
																var errores = '';
																Ext.each(action.result.arrayErrores, function (ite, ind) {
																		errores += '</br><div>' + '<span style = "display: inline;padding: .2em .6em .3em;font-size: 100%;font-weight: 700;line-height: 1;color: #000000;text-align: center;white-space: nowrap;vertical-align: baseline;border-radius: .25em;background-color: #5bc0de;" >&nbsp;&nbsp;' + (ind+1)+'.'+ite + '.</span></div>';
																});
																mostrarMensaje(2, 'Existen datos que no fueron importados.¿Desea visualizarlos?', function (btn) {
																		if (btn == 'ok') {
																				_this.wImportarErrores = new Ext.Window({
																						autoScroll: true,
																						closable: true,
																						frame: true,
																						modal: true,
																						maximizable: true,
																						html: errores,
																						closeAction: 'destroy',
																						constrain: true,
																						title: 'Datos que no fueron importados(' + action.result.arrayErrores.length + ')',
																						width: 1000,
																						height: 400,
																				});
																				_this.wImportarErrores.show();

																		}
																});
														} else {
																mostrarMensaje(1, 'Los datos fueron cargados correctamente.');

														}

														_this.wImportarPlanAnual.destroy();

														var rec = _this.smTGCmpPlan.getSelected();

														_this.ActualizarEstadoBarraHerramientas();

												} else if (action.result.mensaje == 2) {
														mostrarMensaje(1, 'Los datos no fueron cargados correctamente.');
												} else if (action.result.mensaje == 3) {
														mostrarMensaje(1, action.result.msgText);
												} else if (action.result.cod == 4) {
														mostrarMensaje(1, action.result.mensaje);
												} else if (action.result.success == false) {
														mostrarMensaje(1, action.result.mensaje);
												}
										},
										callback: function (form, action) {
												//alert('llego');
										}
								}
						);
				}

				_this.wImportarPlanAnual = new Ext.Window({
						modal: true,
						closeAction: 'destroy',
						constrain: true,
						layout: 'fit',
						title: title,
						width: 420,
						height: 250,
						items: [_this.fpImportarPlanAnual],
						buttons: [_this.btnCancelarPlanAnual, _this.btnAceptarPlanAnual]
				});
				_this.wImportarPlanAnual.show();

		}

		this.CargarVentanaExportarPlanAnual = function () {

				//campo numerico para poner el anno
				this.tfanno = new Ext.form.NumberField({
						allowDecimals: false,
						allowNegative: false,
						//allowBlank: false,
						maxLength: 4,
						minLength: 1,
						fieldLabel: 'Año',
						name: 'tfanno',
						width: 150,
						enableKeyEvents: true,
						listeners: {
								focus: function (tf) {
										if (_this.tfanno.getValue() == '') {
												_this.tfanno.setValue(annoactual);
												_this.cbmeses.setValue('01');
										}
								}
						}
				});

				//store para el combo de meses
				this.storeMeses = new Ext.data.SimpleStore({
						fields: ['idmes', 'mes'],
						data: [
								["01", "Enero"],
								["02", "Febrero"],
								["03", "Marzo"],
								["04", "Abril"],
								["05", "Mayo"],
								["06", "Junio"],
								["07", "Julio"],
								["08", "Agosto"],
								["09", "Septiembre"],
								["10", "Octubre"],
								["11", "Noviembre"],
								["12", "Diciembre"]
						]
				});

				//combo de mese
				this.cbmeses = new Ext.form.ComboBox({
						id: 'cbmeses',
						name: 'cbmeses',
						fieldLabel: 'Mes',
						//allowBlank: false,
						store: _this.storeMeses,
						displayField: 'mes',
						typeAhead: true,
						mode: 'local',
						forceSelection: true,
						triggerAction: 'all',
						hiddenName: 'idmes',
						valueField: 'idmes',
						width: 150,
						emptyText: 'Seleccione',
						disabled: false,
						enableKeyEvents: true,
						listeners: {
								select: function (combo, record, index) {
										if (_this.tfanno.getValue() == '') {
												_this.tfanno.setValue(annoactual);
										}
										//btnImprimir.enable();
								}
						}
				});
				//campo para la fexha inicial de la busqueda
				this.fechafinal = new Ext.form.DateField({
						fieldLabel: 'Fecha fin',
						width: 150,
						name: 'fechafinal',
						minText: 'La fecha fin tiene que ser posterior o igual a la fecha de inicio.',
						id: 'fechafinal',
						vtype: 'daterange',
						invalidText: _this.ObjValidaciones.ObtenerMsjErrorTextoRegido('fecha'),
						format: 'd/m/Y',
						enableKeyEvents: true
				});

				//campo para la fexha final de la busqueda
				this.fechainicial = new Ext.form.DateField({
						fieldLabel: 'Fecha de inicio',
						width: 150,
						name: 'fechainicial',
						id: 'fechainicial',
						vtype: 'daterange',
						maxText: 'La fecha de inicio tiene que ser anterior o igual a la fecha fin.',
						endDateField: 'fechafinal',
						invalidText: _this.ObjValidaciones.ObtenerMsjErrorTextoRegido('fecha'),
						format: 'd/m/Y'
				});

				this.fsrangofechas = new Ext.form.FieldSet({
						checkboxToggle: true,
						id: 'fiff',
						title: 'Por rango de fechas',
						height: 140,
						width: 180,
						listeners: {
								beforeexpand: function (p) {
										if (_this.tfanno.rendered && _this.cbmeses.rendered) {
												_this.tfanno.reset();
												_this.cbmeses.clearValue();
										}
										_this.fsanomes.collapse();
								},
								expand: function (p) {

								}
						},
						collapsed: false,
						items: [
								{
										layout: 'column',
										border: false,
										items: [
												{
														columnWidth: 1,
														border: false,
														layout: 'form',
														labelAlign: 'top',
														items: [_this.fechainicial, _this.fechafinal]
												}
										]
								}
						]
				});

				//fieldset para mostrar opcion de filtrado por anno y mes
				this.fsanomes = new Ext.form.FieldSet({
						checkboxToggle: true,
						id: 'anomes',
						title: 'Por año y mes',
						height: 140,
						width: 180,
						listeners: {
								beforeexpand: function (p) {
										_this.fechainicial.reset();
										_this.fechafinal.reset();
										_this.fsrangofechas.collapse();
								}
						},
						collapsed: true,
						items: [
								{
										layout: 'column',
										border: false,
										items: [
												{
														columnWidth: 1,
														border: false,
														layout: 'form',
														labelAlign: 'top',
														items: [_this.tfanno, _this.cbmeses]
												}
										]
								}
						]
				});

				_this.fpExportarPlanAnual = new Ext.FormPanel({
						labelAlign: 'top',
						fileUpload: true,
						frame: true,
						items: [_this.fsrangofechas, _this.fsanomes]
				});

				_this.btnCancelarPlanAnual = new Ext.Button({
						iconCls: 'cancelar',
						text: 'Cancelar',
						tooltip: 'Cerrar ventana sin exportar los datos',
						handler: function () {
								_this.fpExportarPlanAnual.getForm().reset();
								_this.wExportarPlanAnual.hide();
						}
				});

				_this.btnAceptarPlanAnual = new Ext.Button({
						iconCls: 'aceptar',
						text: 'Aceptar',
						tooltip: 'Exportar datos y cerrar ventana',
						handler: function () {
								_this.exportarElementosPlanAnual();
						}
				});

				_this.exportarElementosPlanAnual = function () {
						var barraExporPlanAnual = Ext.MessageBox.show({
								title: 'Exportando datos',
								msg: 'Espere por favor esto puede demorar unos minutos...',
								width: 270,
								wait: true,
								progress: true,
								closable: false
						});

						var anno = _this.tfanno.getValue();
						var arrayautores = _this.objclasificadorinvol.ObtenerAutoresBusqueda();
						var arrayinvolucrados = _this.objclasificadorinvol.ObtenerInvolucradosBusqueda();
						_this.arrayidnomencladores = [];
						var nummes = _this.cbmeses.getValue();
						var textomes = _this.cbmeses.getRawValue();
						var fechainicio = _this.fechainicial.getValue();
						var fechafin = _this.fechafinal.getValue();
						var idplan = _this.smTGCmpPlan.getSelected().id;

						Ext.Ajax.request({
								url: '/planificacion/pdo/plan/index.php/cmpreportes/obtenerreporte',
								params: {
										anchohoja: '',
										altohoja: '',
										orientacionhoja: 2,
										valueanno: anno,
										ano: '',
										valuenummeses: nummes,
										valuetextomeses: textomes,
										valuefi: Ext.encode(fechainicio),
										valueff: Ext.encode(fechafin),
										idplan: idplan,
										idtiporeporte: 1,
										idversionreporte: 1,
										versionadoSelecionado: 8,
										confidencialidad: 'Público',
										tituloreporte: 'Plan de Actividades agrupadas en ARC',
										arrayautores: Ext.encode(arrayautores),
										arrayinvol: Ext.encode(arrayinvolucrados),
										arrayidnom: Ext.encode(_this.arrayidnomencladores),
										idopcion: '.xls',
										tipoletra: 'Arial',
										tamanoletra: '12px'
								},
								callback: function (options, success, response) {
										barraExporPlanAnual.hide();
										_this.fpExportarPlanAnual.getForm().reset();
										_this.wExportarPlanAnual.hide();
										var tituloarchivo = Ext.decode(response.responseText);
										window.open('../../resources/descargas/' + tituloarchivo);
								}
						});


				}

				_this.wExportarPlanAnual = new Ext.Window({
						modal: true,
						closeAction: 'hide',
						constrain: true,
						layout: 'fit',
						title: 'Exportar plan',
						width: 210,
						height: 270,
						items: [_this.fpExportarPlanAnual],
						buttons: [_this.btnCancelarPlanAnual, _this.btnAceptarPlanAnual]
				});
				_this.wExportarPlanAnual.show();

		}

		this.btnLimpiar2 = new Ext.Button({
				disabled: false,
				handler: function () {
						//_this.pBuscarPlan.collapse(true);
						_this.objclasificadorinvol.ResetearArbolesBusqueda();
						_this.smTGCmpPlan.clearSelections();
						_this.cbbcat.reset();
						_this.stTGCmpPlan.baseParams.arrayautores = '';
						_this.stTGCmpPlan.baseParams.arrayinvolucrados = '';
						_this.stTGCmpPlan.baseParams.categplan = '';
						_this.stTGCmpPlan.setDefaultSort(null);
						if (_this.ftCmpPlan.getFiltrosActivos() == undefined || _this.ftCmpPlan.getFiltrosActivos().length == 0) {
								_this.stTGCmpPlan.reload({});
						}
						_this.ftCmpPlan.clearFilters();
						//_this.pBuscarPlan.toggleCollapse(true);
				},
				iconCls: 'limpiar',
				tooltip: 'Limpiar filtro(s)',
				key: {
						alt: true,
						key: 'L'
				},
				scope: this
		});


		/*****
		 * Boton para Traspaso de Plam
		 *
		 */
		this.btnTraspasoPlan = new Ext.Button({
				handler: function () {
						var idplan_origen=_this.arrayidplan[0];
						_this.objTraspasarPlan.TraspasarPlan(idplan_origen, _this.denominacion_plan);
				},
				disabled: true,
				iconCls: 'cambiar',
				tooltip: 'Traspasar plan',
				key: {
						alt: true,
						key: 'P'
				},
				scope: this
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


		this.btnBusquedaSimple = new Ext.Button({
				handler: function () {
						//_this.objclasificadorinvol.BuscarAutoresInvolucrados();
						_this.btnBusquedaSimple.focus();
						if (_this.fpBuscarPlan.getForm().isValid()) {
								_this.opcionBusqueda = 1;
								_this.CargarPlanes();
						}
				},
				text: 'Buscar',
				iconCls: 'buscar',
				tooltip: 'Buscar plan(es)'
		});
		this.btnSeleccionar = new Ext.Button({
				handler: function () {
						_this.RelacionarElementos();
				},
				disabled: true,
				text: 'Seleccionar',
				iconCls: 'seleccion ',
				tooltip: 'Relacionar plan(es) seleccionado(s)',
				hidden: opcionesConfig.noUsarSeleccionarWinP,
				key: {
						ctrl: true,
						key: 'R'
				},
				scope: this
		});
		this.btnDesgloce = new Ext.Button({
				handler: function () {
						_this.ConstruirWinDesgloce();
				},
				disabled: true,
				iconCls: 'desglose',
				tooltip: 'Desglosar plan',
				key: {
						ctrl: true,
						key: 'D'
				}
		});
		this.btnExportar = new Ext.Button({
				handler: function () {
						if (_this.smTGCmpPlan.getSelected()) {
								_this.cmpexpimp.ventanaExportarElemento(_this.TGCmpPlan, _this.smTGCmpPlan, 0);
						}
				},
				disabled: true,
				iconCls: 'exportar',
				tooltip: 'Exportar plan(es)',
				key: {
						alt: true,
						key: 'E'
				},
				scope: this
		});
		this.btnImportar = new Ext.Button({
				handler: function () {
						_this.cmpexpimp.showCmpImportar(0, _this.TGCmpPlan, _this.WinPrincipal);
				},
				disabled: false,
				iconCls: 'importar',
				tooltip: 'Importar plan(es)',
				key: {
						alt: true,
						ctrl: true,
						key: 'I'
				},
				scope: this
		});
		this.btnAyuda = new Ext.Button({
				id: 'btnAyudaGestionarPlan',
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
				text: 'Actualizar registro de planes',
				hidden: true,
				handler: function () {
						var paginado = _this.TGCmpPlan.getBottomToolbar().items;
						_this.smTGCmpPlan.clearSelections();
						paginado.items[0].show();
						paginado.items[1].show();
						paginado.items[2].show();
						paginado.items[3].show();
						paginado.items[4].hide();
						_this.stTGCmpPlan.reload();
				},
				iconCls: 'x-btn-text x-tbar-loading',
				key: {
						ctrl: true,
						alt: true,
						key: 'Z'
				}
		};
		this.btnActualizarRelaciones = {
				text: 'Actualizar relaciones',
				tooltip: 'Actualizar las relaciones entre los elementos',
				handler: function () {
						_this.BarraProgreso.show('Actualizando las relaciones entre los elementos');
						Ext.Ajax.request({
								url: '/planificacion/pdo/plan/index.php/cmpgestionarplan/actualizarrelaciones',
								callback: function (options, success, response) {
										_this.BarraProgreso.hide();
										responseData = Ext.decode(response.responseText);
										if (responseData.mensaje == 1) {
												mostrarMensaje(1, 'Relaciones actualizadas satisfactoriamente.');
										} else {
												mostrarMensaje(1, 'Las relaciones no han sido actualizadas satisfactoriamente.', function () {
												});
										}
								}
						});
				},
				iconCls: 'x-btn-text x-tbar-loading',
				key: {
						ctrl: true,
						alt: true,
						key: 'Z'
				}
		};
		this.btnGestionarObjetivos = new Ext.Button({
				handler: function () {
						_this.eshija = 0;
						_this.arrayidobjetivos = [];
						var arrayelementosrelacionado = [{
								"idplan": _this.arrayidplan[0],
								"idarc": null,
								"idobjetivo": null,
								"idfip": null,
								"iddesviacion": null,
								"tipoelemento": 0
						}];
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
								arrayelementosrelacionado,
								_this.smTGCmpObjetivos,
								_this.stTGCmpObjetivos);
				},
				disabled: true,
				hidden: opcionesConfig.noUsarAddObj,
				iconCls: 'archivo',
				tooltip: 'Adicionar objetivo',
				key: {
						alt: true,
						key: 'O'
				},
				scope: this
		});

		this.btnGenerarPert = new Ext.Button({
				iconCls: 'graficar',
				disabled: false,
				hidden: false,
				handler: function () {
						_this.objCmpPert.CargarCmpPert(tipoelemento = 0, _this.arrayplanesseleccionados[0], _this);
				},
				tooltip: 'Generar diagrama de Pert',
				key: {
						ctrl: true,
						key: 'G'
				},
				scope: this
		});

		this.btnGestionarActividades = new Ext.Button({
				handler: function () {
						//_this.eshija = 0;
						var arrayelementosrelacionado = [{
								"idplan": _this.arrayidplan[0],
								"idarc": null,
								"idobjetivo": null,
								"idfip": null,
								"iddesviacion": null,
								"tipoelemento": 0
						}];
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
								arrayelementosrelacionado,
								_this.smTGCmpActividades,
								_this.stTGCmpActividades,
								null,
								_this.porcientocumpl,
								_this.actpadre,
								null,
								null,
								true
						);
				},
				disabled: true,
				iconCls: 'actividades',
				tooltip: 'Adicionar actividad',
				hidden: opcionesConfig.noUsarAddAct,
				key: {
						alt: true,
						key: 'A'
				},
				scope: this
		});
		//store del combo del filtro por estados de aprobacion
		this.stestados = new Ext.data.Store(
				{
						url: '/planificacion/pdo/plan/index.php/cmpgestionarplan/cargarcmbestados',
						listeners: {
								load: function (st) {
										if (_this.stestados.getCount() > 0) {
												//_this.cbestados.setEditable(true);
										}
								}
						},
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
				mode: 'remote',
				editable: false,
				loadingText: 'Cargando...',
				emptyText: 'Seleccione...',
				width: 580,
				listeners: {
						select: function (cb, record, index) {
								_this.opcionBusqueda = 2;
								_this.CargarPlanes();
						},
						expand: function (combo) {
								_this.stestados.reload();
						}
				}
		});

		//store del combo del modo de aprobacion-conciliacion
		this.stcbaprob_conc = new Ext.data.SimpleStore({
				//id:'stcbaprob_conc',
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
				emptyText: 'Seleccione...',
				listeners: {
						select: function (cb, record, index) {
								if (record.data.idac == 0) {
										_this.opcionBusqueda = 5;
								} else
										_this.opcionBusqueda = 2;
								_this.CargarPlanes();
						}
				}
		});

		//store del treegrid donde se muestran los planes
		this.stTGCmpPlan = new Ext.ux.maximgb.treegrid.AdjacencyListStore({
				autoLoad: true,
				remoteSort: true,
				url: '/planificacion/pdo/plan/index.php/cmpgestionarplan/cargarplanes',
				listeners: {
						beforeload: function (st) {
								st.baseParams.idplan = _this.arrayidplan[0];
								st.baseParams.eshija = _this.eshija;
								if (_this.opcionBusqueda != 3) {
										var arrayautores = _this.objclasificadorinvol.ObtenerAutoresBusqueda();
										var arrayinvolucrados = _this.objclasificadorinvol.ObtenerInvolucradosBusqueda();
										st.baseParams.arrayautores = Ext.encode(arrayautores);
										st.baseParams.arrayinvolucrados = Ext.encode(arrayinvolucrados);
										st.baseParams.categplan = _this.cbbcat.getValue();
								}
						},
						load: function (store, record, options) {
								if (_this.TGCmpPlan.getStore().getCount() == 0 && !_this.posteliminar) {
										var arrayautoresbusq = _this.objclasificadorinvol.ObtenerAutoresBusqueda();
										var arrayinvolucradosbusq = _this.objclasificadorinvol.ObtenerInvolucradosBusqueda();
										if ((_this.ftCmpPlan.getFiltrosActivos() == undefined || _this.ftCmpPlan.getFiltrosActivos().length == 0)
												&& arrayautoresbusq.length == 0 && arrayinvolucradosbusq.length == 0) {
												mostrarMensaje(1, 'No existen datos que mostrar.');
										} else {
												mostrarMensaje(1, 'No existen datos que se correspondan con los criterios de búsqueda especificados.');
										}
								}
								_this.posteliminar = false;
								_this.ActualizarEstadoBarraHerramientas();
								if (_this.smTGCmpPlan.hasSelection()) {
										_this.TGCmpPlan.getView().refresh(true);
								}
								store.baseParams.arrayautores = '';
								store.baseParams.arrayinvolucrados = '';
								store.baseParams.categplan = '';
								_this.changeTitlePlan();
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
						name: 'categoria'
				}, {
						name: 'activo'
				}, {
						name: 'fechainicio'
				}, {
						name: 'fechafin'
				}, {
						name: 'desc'
				}, {
						name: '_parent'
				}, {
						name: '_is_leaf'
				}, {
						name: 'textocumplimiento'
				}, {
						name: 'idestadoaprob'
				}, {
						name: 'nombreestadoaprob'
				}, {
						name: 'estadocumplimiento'
				}, {
						name: 'idusuariocrea'
				}, {
						name: 'gradocumplimiento'
				}, {
						name: 'nombreautor'
				}, {
						name: 'subordinado'
				}, {
						name: 'superior'
				}, {
						name: 'observaciones'
				}, {
						name: 'tipoelemento'
				}, {
						name: 'modificar'
				}, {
						name: 'eliminar'
				}])
		});

		this.ptbTGCmpPlan = new Ext.ux.maximgb.treegrid.PagingToolbar({
				pageSize: 1000,
				store: _this.stTGCmpPlan,
				displayInfo: true,
				listeners: {
						beforechange: function (paginado, evento) {
								_this.start = evento.start;

						}
				}
		});
		//modo de del treegrid donde se muestran los planes
		this.smTGCmpPlan = new Ext.grid.CheckboxSelectionModel({
				singleSelect: opcionesConfig.singlemodoSeleccionGridPlanes,
				listeners: {
						rowselect: function (sm, indiceFila, record) {
								if (_this.prevrow >= 0 && _this.prevrow != indiceFila) {
										Ext.get(_this.TGCmpPlan.getView().getRow(_this.prevrow)).removeClass('superior2');
										Ext.get(_this.TGCmpPlan.getView().getRow(_this.prevrow)).addClass('superior');
								}
								if (record.data.superior == 1) {
										Ext.get(_this.TGCmpPlan.getView().getRow(indiceFila)).removeClass('superior');
										Ext.get(_this.TGCmpPlan.getView().getRow(indiceFila)).addClass('superior2');
										_this.prevrow = indiceFila;
								} else
										_this.prevrow = -1;
								_this.ActualizarEstadoBarraHerramientas();
						},
						rowdeselect: function (sm, indiceFila, record) {

								if (_this.prevrow >= 0 && _this.prevrow != indiceFila) {
										Ext.get(_this.TGCmpPlan.getView().getRow(_this.prevrow)).removeClass('superior2');
										Ext.get(_this.TGCmpPlan.getView().getRow(_this.prevrow)).addClass('superior');
								}
								if (record.data.superior == 1) {
										Ext.get(_this.TGCmpPlan.getView().getRow(indiceFila)).removeClass('superior');
										Ext.get(_this.TGCmpPlan.getView().getRow(indiceFila)).addClass('superior2');
										_this.prevrow = indiceFila;
								} else
										_this.prevrow = -1;
								_this.ActualizarEstadoBarraHerramientas();
						}
				}
		});
		//plugins para los filtros del grid
		this.ftCmpPlan = new Ext.grid.GridFilters({
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
						urlcb: '/planificacion/pdo/plan/index.php/cmpgestionarplan/cargarcmbestados',
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
				}]
		});
		//treegrid donde se muestran los planes
		//fsera
		this.TGCmpPlan = new Ext.ux.maximgb.treegrid.GridPanel({
				id: 'TGCmpPlan',
				store: _this.stTGCmpPlan,
				plugins: _this.ftCmpPlan,
				master_column_id: 'expandir',
				autoExpandMin: 165,
				columnsByDemand: true,
				stripeRows: true,
				region: 'center',
				viewConfig: {
						forcefit: true
				},
				sm: _this.smTGCmpPlan,
				margins: '3 3 3 3',
				loadMask: {
						msg: 'Cargando planes'
				},
				root_title: 'Registro de planes',
				columns: [_this.smTGCmpPlan,
						{
								header: 'CAR',
								sortable: true,
								dataIndex: 'idelemento',
								width: 80,
								tooltip: 'Código de Acceso Rápido',
								renderer: function (val) {
										return val;
								}
						}, {
								header: "Denominaci&oacute;n",
								id: 'expandir',
								dataIndex: 'denominacion',
								width: 565,
								sortable: true,
								tooltip: 'Denominaci&oacute;n',
								renderer: MostrarImagenTipoElemento
						}, {
								header: "Fecha de inicio",
								dataIndex: 'fechainicio',
								width: 100,
								tooltip: 'Fecha de inicio',
								sortable: true
						}, {
								header: "Fecha de fin",
								dataIndex: 'fechafin',
								width: 100,
								tooltip: 'Fecha de fin',
								sortable: true
						}, {
								header: "Estado de aprobación",
								dataIndex: 'nombreestadoaprob',
								width: 130,
								sortable: true,
								tooltip: 'Estado de aprobación',
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
								header: "% de cumplimiento",
								dataIndex: 'gradocumplimiento',
								width: 100,
								aling: 'center',
								tooltip: 'Porciento de cumplimiento',
								sortable: true,
								renderer: function (a) {
										return a + ' %'
								}
						}, {
								header: "Observaciones",
								hidden: opcionesConfig.noMostrarColumObser,
								dataIndex: 'observaciones',
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
								renderer: function (val) {
										return val;
								}
						}],
				listeners: {
						rowcontextmenu: function (grid, row, e) {
								if (_this.idaprobdiferentes == 0 && _this.subordinados == 1 && _this.mostrarmenuaprob == 1) {
										_this.TGCmpPlan.getSelectionModel().selectRow(row);
										if (_this.objcmpmenurelacionesdinrw) {
												_this.objcmpmenurelacionesdinrw = null;
										}
										//inicializando el objeto menu dinamico
										_this.objcmpmenurelacionesdinrw = new Utilidades.Cmp.CmpMenuRelacionesDinamicas();
										//creo el menu
										if (_this.menuderechoTGCmpPlan) {
												_this.menuderechoTGCmpPlan.destroy();
										}
										_this.menuderechoTGCmpPlan = new Ext.menu.Menu({
												items: [
														{
																text: 'Adicionar plan',
																itemCls: 'x-menu-item icondistra-adicionar',
																iconCls: 'imagen-none',
																hideOnClick: true,
																handler: function () {
																		_this.objCrudPlan.CrearWinCrudPlan(
																				'Adicionar', _this.PostAccionesGestionar,
																				_this.arrayidplan, null, _this.stTGCmpPlan);
																}
														}, {
																text: 'Cambiar el estado de aprobaci&oacute;n a',
																disabled: opcionesConfig.noUsarMenuGrid,
																itemCls: 'x-menu-item icondistra-cambiodestado',
																iconCls: 'imagen-none',
																hideOnClick: false,
																id: 'itmaprov',
																menu: _this.objcmpmenurelacionesdinrw.menuinicial,
																listeners: {
																		render: function () {
																				var mensaje = '';
																				if (_this.arrayidplan.length > 1) {
																						mensaje = 'No existen otros estados al cual usted pueda cambiar los planes desde el estado actual.';
																				} else {
																						mensaje = 'No existen otros estados al cual usted pueda cambiar el plan desde el estado actual.';
																				}
																				_this.objcmpmenurelacionesdinrw.CrearMenuAprobacionConc(
																						_this.AccionesPostEjecutarFT,
																						mensaje,
																						_this.TGCmpPlan,
																						_this.menuderechoTGCmpPlan,
																						_this.arrayidplan,
																						_this.arrayidestadoaprob,
																						_this.idtipodocumento
																				);
																		}
																}
														}, {
																handler: function () {
																		_this.objCrudPlan.CrearWinCrudPlan(
																				'Ver datos del', _this.PostAccionesGestionar,
																				_this.arrayidplan, _this.smTGCmpPlan);
																},
																iconCls: 'ver',
																text: 'Ver datos del plan',
																tooltip: 'Ver datos del plan',
																key: {
																		alt: true,
																		key: 'D'
																},
																scope: this
														}]
										});
										if (_this.mimodificar) {
												_this.mimodificar.destroy();
										}
										if (_this.permitirmodificar == 1) {
												_this.mimodificar = new Ext.menu.Item({
														text: 'Modificar plan',
														itemCls: 'x-menu-item icondistra-modificar',
														iconCls: 'imagen-none',
														handler: function () {
																_this.objCrudPlan.CrearWinCrudPlan(
																		'Modificar', _this.PostAccionesGestionar,
																		_this.arrayidplan, _this.smTGCmpPlan);
														}
												});
												_this.menuderechoTGCmpPlan.add(_this.mimodificar);
										}
										if (_this.mieliminar) {
												_this.mieliminar.destroy();
										}
										if (_this.permitireliminar == 1) {
												_this.mieliminar = new Ext.menu.Item({
														text: _this.setTextdeMenus(_this.smTGCmpPlan.getCount(), 'Eliminar'),
														itemCls: 'x-menu-item icondistra-eliminar',
														iconCls: 'imagen-none',
														handler: function () {
																_this.objCrudPlan.EliminarPlan(
																		_this.arrayidplan, _this.PostAccionesGestionar,
																		_this.smTGCmpPlan, _this.TGCmpPlan);
														}
												});
												_this.menuderechoTGCmpPlan.add(_this.mieliminar);
										}
										if (_this.smTGCmpPlan.getCount() == 1) {
												if (_this.verhistorial) {
														_this.verhistorial.destroy();
												}
												_this.verhistorial = new Ext.menu.Item({
														text: 'Consultar historial del plan',
														itemCls: 'x-menu-item icondistra-historial',
														iconCls: 'imagen-none',
														handler: function () {
																_this.objHistorial.verHistorial('plan', _this.smTGCmpPlan.getSelected().id);
														}
												});
												_this.menuderechoTGCmpPlan.add(_this.verhistorial);
										}
										e.stopEvent();
										var xy = e.getXY();
										_this.menuderechoTGCmpPlan.showAt(xy);
								} else {
										e.stopEvent();
								}
						},
						rowdblclick: function () {
								_this.objCrudPlan.CrearWinCrudPlan(
										'Modificar', _this.PostAccionesGestionar,
										_this.arrayidplan, _this.smTGCmpPlan);
						},
						cellclick: function (el, rowIndex, columnIndex, event) {
								if (_this.TGCmpPlan.getSelectionModel().hasSelection()) {

								}
						}
				},
				bbar: (!opcionesConfig.noUsarPaginado) ? _this.ptbTGCmpPlan : null
		});

	/***************************
	 * Navegar en grid con tecla abajo
	 * **********************************************/

	/*$(document).ready(function() {
		$(document).keydown(function(e) {
			if(e.keyCode==40){
				moveSelectedRow(_this.TGCmpPlan, 1);
			}if(e.keyCode==38){
				moveSelectedRow(_this.TGCmpPlan, -1);
			}
		});
	});*/


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
								return 'Exportar plan';
						}
						else
								return 'Exportar planes';
				} else if (accion == 'Eliminar') {
						if (conteo == 1) {
								return 'Eliminar plan';
						} else
								return 'Eliminar planes';
				}
		};
		_this.TGCmpPlan.getView().getRowClass = function (ri, n) {
				if (ri.data.superior == 1)
						return "superior";
				else
						return "";
		};

		//campo de texto para la busqued a de planes por denominacion
		this.tfdenominacionBS = new Ext.form.TextField({
				fieldLabel: 'Denominación',
				regex: _this.ObjValidaciones.expresionRegular('denominacion'),
				maskRe: /^([a-zA-Z0-9áéíóúüÁÉÍÓÚñÑÜ"' ,./()_-])$/,
				regexText: _this.ObjValidaciones.ObtenerMsjErrorTextoRegido('denominacion'),
				vtype: 'validarEspaciosEnBlanco',
				maxLength: 255,
				maxLengthText: 'El tamaño máximo requerido es 255 caracteres.',
				anchor: '95%',
				allowBlank: true
		});

		//campos de fecha para la busqueda de planes
		this.fechaInicioBS = new Ext.form.DateField({
				id: 'fechaInicioBS',
				fieldLabel: 'Fecha de inicio',
				format: 'd/m/Y',
				width: 100,
				allowBlank: true,
				vtype: 'daterange',
				endDateField: 'fechaFinBS',
				invalidText: _this.ObjValidaciones.ObtenerMsjErrorTextoRegido('fecha')
		});
		this.fechaFinBS = new Ext.form.DateField({
				id: 'fechaFinBS',
				fieldLabel: 'Fecha de fin',
				format: 'd/m/Y',
				width: 100,
				vtype: 'daterange',
				startDateField: 'fechaInicioBS',
				invalidText: _this.ObjValidaciones.ObtenerMsjErrorTextoRegido('fecha')
		});

		//store para el combo para la busqueda de planes por categoria
		this.stCmbCategorias = new Ext.data.Store({
				url: '/planificacion/pdo/plan/index.php/cmpgestionarplan/cargarcategoriasplan',
				listeners: {
						load: function (st) {
								if (_this.stCmbCategorias.getCount() > 0) {
										_this.cbbcat.setEditable(true);
								}
						}
				},
				reader: new Ext.data.JsonReader({
						id: 'idcategoria',
						root: "data"
				}, [{
						name: 'idcategoria'
				}, {
						name: 'denominacion'
				}])
		});

		//combo para la busqueda de planes por categoria
		this.cbbcat = new Ext.form.ComboBox({
				emptyText: 'Seleccione',
				fieldLabel: 'Categoría del plan',
				store: _this.stCmbCategorias,
				hiddenName: 'idcategoria',
				valueField: 'idcategoria',
				displayField: 'denominacion',
				triggerAction: 'all',
				editable: true,
				loadingText: 'Cargando datos...',
				forceSelection: true,
				mode: 'local',
				anchor: '100%',
				listeners: {
						expand: function (combo) {
								_this.stCmbCategorias.reload();
						}
				}
		});

		//campo de texto para la busqueda por CAR(Codigo de Acceso Rapido)
		this.tfCAR = new Ext.form.TextField({
				fieldLabel: 'CAR',
				regex: /^[0-9]+$/,
				regexText: _this.ObjValidaciones.ObtenerMsjErrorTextoRegido('car'),
				width: 130,
				allowBlank: true,
				enableKeyEvents: true,
				listeners: {
						keypress: function (tfCAR, e) { // Para dejar solo 10 números
								if (e.getKey() != 8) {
										var value = new String(tfCAR.getValue());
										if (value.length >= 10)// Para que escriba solo 10 caracteres
												e.stopEvent();
								}
						}
				}
		});

		this.tpAutoresInvolucrados = _this.objclasificadorinvol.CrearClasificadorInvolBusqueda(tipoelemento = 0, 1);

		this.fpBuscarPlan = new Ext.form.FormPanel({
				frame: true,
				layout: 'fit',
				items: _this.tpAutoresInvolucrados,
				buttons: [_this.btnBusquedaSimple]
		});

		//panel donde se muestran las opciones de busqueda de planes
		this.pBuscarPlan = new Ext.Panel({
				title: 'Opciones de b&uacute;squeda',
				layout: 'fit',
				width: 300,
				collapsible: true,
				collapsed: true,
				margins: '3 3 3 3',
				region: 'east',
				items: [_this.fpBuscarPlan],
				listeners: {
						expand: function (p) {
								p.doLayout();
								_this.stCmbCategorias.reload();
						}
				}
		});

		this.PanPrincipal = new Ext.Panel({
				layout: 'border',
				region: 'center',
				tbar: [_this.btnAdicionar, _this.btnModificar, _this.btnEliminar, _this.btnVer,
						_this.btnGestionarObjetivos, _this.btnGestionarActividades, _this.btnCambiarEstado,
						_this.btnDesgloce, _this.btnHistorial, _this.btnGestObs, _this.btnVerNotif,
						_this.btnPanelBusqueda, _this.btnConfPerfil, /*_this.btnImportarPlanAnual,*/ _this.menuImportarPlanAnual,_this.btnExportarPlanAnual, _this.btnGenerarPert, _this.btnTraspasoPlan, _this.btnActualizarParametros, _this.btnLimpiar2,
						'->', _this.btnAyuda],
				usarKeymap: true,
				botonesKeymap: [_this.btnAdicionar, _this.btnModificar, _this.btnEliminar,
						_this.btnDesgloce, _this.btnGestObs, this.btnGestionarActividades, this.btnGestionarObjetivos,
						_this.btnVer, _this.btnVerNotif, _this.btnPanelBusqueda, _this.btnHistorial, _this.btnTraspasoPlan, _this.btnActualizarParametros,
						_this.btnLimpiar2, _this.btnConfPerfil, /*_this.btnImportarPlanAnual,*/ _this.menuImportarPlanAnual,_this.btnExportarPlanAnual, _this.btnAyuda],
				items: [_this.TGCmpPlan, _this.pBuscarPlan]
		});

		//ventana principal de la vista
		this.WinPrincipal = new Ext.Window({
				title: opcionesConfig.titleWinPrincipal,
				layout: 'fit',
				closable: !opcionesConfig.noUsarCerrarWinP,
				draggable: true,
				constrain: true,
				maximized: opcionesConfig.maxWinPrincipal,
				noTitle: opcionesConfig.maxWinPrincipal,
				modal: true,
				width: 1000,
				height: 510,
				items: _this.PanPrincipal,
				buttons: [
						{
								text: 'Cerrar',
								tooltip: 'Cerrar ventana',
								hidden: opcionesConfig.noUsarCerrarWinP,
								iconCls: 'cerrar',
								handler: function () {
										_this.WinPrincipal.hide();
										_this.AccionesAlCancelar();
								}
						},
						_this.btnSeleccionar
				]
		});

		//funcion donde se procede a cargar el treegrid con los planes
		this.CargarPlanes = function () {
				estaaprob = _this.cbaprob_conc.getValue();
				idestadoaprobacion = _this.cbestados.getValue();
				denom = _this.tfdenominacionBS.getValue();
				fdesde = Ext.encode(_this.fechaInicioBS.getValue());
				fhasta = Ext.encode(_this.fechaFinBS.getValue());
				categplan = _this.cbbcat.getValue();
				car = _this.tfCAR.getValue();
				if (_this.opcionBusqueda == 1 || _this.opcionBusqueda == 2) {
						var arrayautores = _this.objclasificadorinvol.ObtenerAutoresBusqueda();
						if (_this.opcionBusqueda == 1) {
								if (_this.tfdenominacionBS.getValue() != '' || _this.fechaInicioBS.getValue() != ''
										|| _this.fechaFinBS.getValue() != ''
										|| _this.tfCAR.getValue() != '' || _this.cbbcat.getValue() != '' || arrayautores.length > 0) {
										_this.stTGCmpPlan.removeAll();
										_this.stTGCmpPlan.reload({
												callback: function () {
														if (_this.stTGCmpPlan.getTotalCount() == 0) {
																_this.opcionBusqueda = 3;
																_this.CargarPlanes();
																_this.pBuscarPlan.collapse(true);
														}
												}
										});
								} else {
										mostrarMensaje(1, "Introduzca un criterio de b&uacute;squeda.");
										return;
								}
						} else {
								_this.stTGCmpPlan.removeAll();
								_this.stTGCmpPlan.reload({
										callback: function () {
												if (_this.stTGCmpPlan.getTotalCount() == 0) {
														_this.opcionBusqueda = 4;
														_this.CargarPlanes();
												}
										}
								});
						}
				}
				if (_this.opcionBusqueda == 3) {
						_this.tfdenominacionBS.reset();
						_this.fechaInicioBS.reset();
						_this.fechaFinBS.reset();
						_this.tfCAR.reset();
						_this.objclasificadorinvol.ResetearArbolesBusqueda();
						_this.smTGCmpPlan.clearSelections();
						estaaprob = 0;
						idestadoaprobacion = null;
						if (_this.cbbcat) {
								_this.cbbcat.reset();
						}
						_this.stTGCmpPlan.reload({});
				}
				if (_this.opcionBusqueda == 4) {
						if (_this.cbestados) {
								_this.cbestados.reset();
						}
						if (_this.cbaprob_conc) {
								_this.cbaprob_conc.clearValue();
						}
						_this.stTGCmpPlan.reload({});
				}
				if (_this.opcionBusqueda == 5) {
						_this.stTGCmpPlan.reload({
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
		//fsera
		this.CargarCmpPlan = function (idelemento, tipoelemento, parentelemento, AccionesAlRelacionar, AccionesAlCancelar) {
				_this.AccionesAlRelacionar = AccionesAlRelacionar;
				_this.AccionesAlCancelar = AccionesAlCancelar;
				_this.idelementohijo = idelemento;
				_this.tipoelementohijo = tipoelemento;
				if (parentelemento == 'padre') {
						_this.idelementopadre = idelemento;
						_this.tipoelementopadre = tipoelemento;
				}
				if (opcionesConfig.tipoComponente == 'panel') {
						return _this.PanPrincipal;
				} else {
						_this.WinPrincipal.show();
						_this.cargarConfiguracionPerfil(0);
				}
		};

		//funcion donde se procede a cargar la plantilla para relaciones ternarias
		this.CargarCmpPlanRelacionesTernarias = function (idelemento, tipoelemento, parentelemento, AccionesAlRelacionar) {
				_this.AccionesAlRelacionar = AccionesAlRelacionar;
				_this.idelementohijo = idelemento;
				_this.tipoelementohijo = tipoelemento;
				if (parentelemento == 'padre') {
						_this.idelementopadre = idelemento;
						_this.tipoelementopadre = tipoelemento;
				}

				//panel principal de la vista para relaciones ternarias
				if (!_this.PanPrincipal2) {
						_this.PanPrincipal2 = _this.PanPrincipal.cloneConfig({
								title: 'Registro de planes',
								layout: 'border',
								anchor: '100%',
								height: 700,
								items: [_this.TGCmpPlan, _this.pBuscarPlan]
						});
						if (opcionesConfig.noUsarGestObser) {
								_this.PanPrincipal2.getTopToolbar()[9] = '';
						}
				}

				return _this.PanPrincipal2;
		};


		//funcion donde se procede a disparar post-aciones luego de adicionar/modificar/eliminar
		this.PostAccionesGestionar = function (mensaje, accion) {
				switch (mensaje) {
						case 0:
								_this.stTGCmpPlan.reload({
										params: {
												anode: null,
												start: _this.start
										}
								});
								break;
						case 1:
								if (accion == 'Adicionar' || accion == 'Cancelar-Cerrar')
										_this.UltimaPagina();
								else if (accion == 'Modificar' || accion == 'Eliminar') {
										if (accion == 'Eliminar' && _this.start != 0)
												_this.posteliminar = true;
										_this.PaginaActual(null);
								}
								break;
						default:
								_this.PaginaActual(null);
				}
		};

		//Funcion que recarga la pagina actual. Si no hay elementos listados regarga la pagina anterior.
		this.PaginaActual = function (anode) {
				_this.smTGCmpPlan.clearSelections();
				_this.start = (_this.ptbTGCmpPlan.getPageData().activePage - 1) * (_this.ptbTGCmpPlan.cbPageSize.getValue());
				_this.stTGCmpPlan.reload({
						params: {
								anode: anode,
								start: _this.start
						},
						callback: function () {
								if (_this.stTGCmpPlan.getCount() == 0 && _this.start != 0) {
										_this.start = _this.start - _this.ptbTGCmpPlan.cbPageSize.getValue();
										_this.stTGCmpPlan.reload({
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
				_this.smTGCmpPlan.clearSelections();
				var numentero = Math.floor(_this.stTGCmpPlan.getTotalCount() / _this.ptbTGCmpPlan.cbPageSize.getValue());
				_this.start = numentero * _this.ptbTGCmpPlan.cbPageSize.getValue();
				_this.stTGCmpPlan.reload({
						params: {
								anode: null,
								start: _this.start
						}
				});
		};


		this.actualizarParametros = function () {

				//campo para la fecha de inicio del plan
				_this.f_inicio_actParams = new Ext.form.DateField({
						fieldLabel: 'Fecha de inicio',
						id: 'f_inicio_actParams',
						endDateField: 'f_fin_actParams',
						allowBlank: true,
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
						allowBlank: true,
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

				//store del combo categoria del plan
				_this.stCmbCategorias_actParams = new Ext.data.Store({
						url: '/planificacion/pdo/plan/index.php/cmpgestionarplan/cargarcategoriasplan',
						autoLoad: true,
						reader: new Ext.data.JsonReader({
								id: 'idcategoria',
								root: "data"
						}, [{
								name: 'idcategoria'
						}, {
								name: 'denominacion'
						}])
				});


				//combo categoria del plan
				_this.cb_categoria_actParams = new Ext.form.ComboBox({
						id: 'cb_categoria_actParams',
						emptyText: 'Seleccione',
						fieldLabel: 'Categoría del plan',
						store: _this.stCmbCategorias_actParams,
						hiddenName: 'idcategoria',
						valueField: 'idcategoria',
						displayField: 'denominacion',
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
										var waitMsg = 'Guardando datos del plan seleccionado';
										var respuesta= 'Se han actualizado los parámetros del plan seleccionado';
										if(_this.arrayidplan.length>1){
												waitMsg = 'Guardando datos de los planes seleccionados';
												respuesta= 'Se han actualizado los parámetros de los planes seleccionados';
										}
										_this.BarraProgreso.show(waitMsg);
										_this.form_actParams.getForm().submit({
												url: '/planificacion/pdo/plan/index.php/cmpgestionarplan/actualizarParametros',
												params: {
														arrayidplan: Ext.encode(_this.arrayidplan),
														idcategoria: _this.cb_categoria_actParams.getValue(),
														denomcategoria: _this.cb_categoria_actParams.getRawValue()
												},
												failure: function (form, action) {
														if (action.result.mensaje > 0) {
																mostrarMensaje(1, respuesta);
																_this.window_actParams.destroy();
																_this.BarraProgreso.hide();
																_this.smTGCmpPlan.clearSelections();
																_this.stTGCmpPlan.reload();
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

		this.ActualizarEstadoBarraHerramientas = function () {
				_this.arrayidplan = [];
				_this.arrayidestadoaprob = [];
				_this.arraynombreplan = [];
				_this.arrayplanesseleccionados = [];
				_this.btnModificar.disable();
				_this.btnTraspasoPlan.disable();
				_this.btnVer.disable();
				_this.btnHistorial.disable();
				_this.btnDesgloce.disable();
				_this.btnExportar.disable();
				_this.btnSeleccionar.disable();
				_this.btnEliminar.disable();
				_this.btnActualizarParametros.disable();
				_this.btnGenerarPert.disable();
				_this.btnCambiarEstado.disable();
				_this.btnActivar.disable();
				_this.btnDesactivar.disable();
				_this.btnGestObs.disable();
				if (Ext.getCmp('btnImpPlanAnual')) Ext.getCmp('btnImpPlanAnual').disable();
				if (Ext.getCmp('btnImportarPuntualizaacionesExcel')) Ext.getCmp('btnImportarPuntualizaacionesExcel').disable();
				//_this.btnImportarPlanAnual.disable();
				_this.btnExportarPlanAnual.disable();
				_this.btnGestionarActividades.disable();
				_this.btnGestionarObjetivos.disable();
				var idestadoaprob = null;
				_this.idaprobdiferentes = 0;
				_this.mostrarmenuaprob = 0;
				_this.permitirmodificar = 0;
				_this.permitireliminar = 0;
				_this.subordinados
				if (_this.smTGCmpPlan.hasSelection()) {
						_this.btnExportar.enable();
						var arrayrecords = _this.smTGCmpPlan.getSelections();
						var totalrecords = arrayrecords.length;
						if (totalrecords > 0) {
								_this.denominacion_plan=arrayrecords[0].data.denominacion;
								var puedemodificar = 1;
								var puedeeliminar = 1;
								var todosdesactivados = 0;
								var todosactivados = 1;
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
										if (arrayrecords[i].data.activo == 1) {
												todosdesactivados = 1;
										}
										if (arrayrecords[i].data.activo == 0) {
												todosactivados = 0;
										}
										if (arrayrecords[i].data.subordinado == 0) {
												subordinados = 0;
										}
										_this.arrayidestadoaprob[i] = arrayrecords[i].data.idestadoaprob;
										_this.arrayidplan[i] = arrayrecords[i].data.idelemento;
										_this.arraynombreplan[i] = arrayrecords[i].data.denominacion;
										var elementoseleccionado = {};
										elementoseleccionado = {
												idelemento: arrayrecords[i].data.idelemento,
												denominacion: arrayrecords[i].data.denominacion,
												fechainicio: arrayrecords[i].data.fechainicio,
												fechafin: arrayrecords[i].data.fechafin,
												tipoelemento: 0,
												autorelemento: arrayrecords[i].data.nombreautor,
												idautorelemento: arrayrecords[i].data.idusuariocrea,
												_parent: arrayrecords[i].data._parent,
												_is_leaf: arrayrecords[i].data._is_leaf
										};
										_this.arrayplanesseleccionados.push(elementoseleccionado);
								}
								if (puedemodificar == 1 && totalrecords == 1) {
										_this.btnModificar.enable();
										_this.btnTraspasoPlan.enable();
										_this.btnGestObs.enable();
									//	_this.btnImportarPlanAnual.enable();
										if (Ext.getCmp('btnImpPlanAnual')) Ext.getCmp('btnImpPlanAnual').enable();
										if (Ext.getCmp('btnImportarPuntualizaacionesExcel')) Ext.getCmp('btnImportarPuntualizaacionesExcel').enable();
										_this.btnExportarPlanAnual.enable();
										_this.btnVer.enable();
										_this.permitirmodificar = 1;
										_this.btnGestionarActividades.enable();
										_this.btnGestionarObjetivos.enable();
								}
								if (puedemodificar == 1) {
										_this.mostrarmenuaprob = 1;
								}
								if (puedeeliminar == 1) {
										_this.btnEliminar.enable();
										_this.btnActualizarParametros.enable();
										_this.btnGenerarPert.enable();
										_this.permitireliminar = 1;
								}
								if (todosdesactivados == 0) {
										_this.btnActivar.enable();
								}
								if (todosactivados == 1) {
										_this.btnDesactivar.enable();
								}
								if (totalrecords > 0) {
										_this.btnSeleccionar.enable();
								}
								if (totalrecords == 1) {
										_this.btnDesgloce.enable();
										_this.btnHistorial.enable();
								}
								_this.btnExportar.enable();
								if (subordinados == 1) {
										_this.subordinados = 1;
								}
								if (_this.idaprobdiferentes == 0 && _this.subordinados == 1 && _this.mostrarmenuaprob == 1) {
										_this.btnCambiarEstado.enable();
								}
						}
				}
		};

		//funcion a ejecutarse luego de paginar el treegrid de planes
		this.AccionTrasPaginar = function () {
				_this.opcionBusqueda = 2;
				_this.CargarPlanes();
		};

		//funcion a ejecutarse para relacionar el o los planes seleccionados con otros elementos
		this.RelacionarElementos = function () {
				_this.AccionesAlRelacionar(_this.arrayplanesseleccionados, _this.WinPrincipal);
		};

		//funcion que se encarga de contruir la ventana con el desgloce del plan
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
								text: _this.arraynombreplan[0],
								expanded: true,
								idtipoelemento: '0',
								iconCls: 'folder',
								idelemento: _this.arrayidplan[0]
						},
						loader: new Ext.tree.TreeLoader({
								dataUrl: '/planificacion/pdo/plan/index.php/cmpgestionarplan/desglozarplan',
								listeners: {
										'beforeload': function (atreeloader, anode) {
											_this.BarraProgreso.show('Desgloce del plan');
												atreeloader.baseParams = {
														idelemento: anode.attributes.idelemento,
														idarc: anode.attributes.idarc,
														idplan: _this.arrayidplan[0],
														trinomio: 1,
														idtipoelemento: anode.attributes.idtipoelemento
												};
										},
									load: function (st) {
										_this.BarraProgreso.hide();
									}

								}
						}),
						contextMenu: new Ext.menu.Menu({
								items: [{
										id: 'detalles',
										text: '<b>Mostrar detalles</b> ',
										itemCls: 'x-menu-item icondistra-ver',
										iconCls: 'imagen-none',
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
										/* if(node.attributes.idtipoelemento != 0) {*/
										node.select();
										var c = node.getOwnerTree().contextMenu;
										c.contextNode = node;
										c.showAt(e.getXY());
										// }
								}
						}
				});
				//ventana que carga el arbol donde se mostrara el desgloce del plan
				_this.WinDesgloce = new Ext.Window({
						maximizable: true,
						modal: true,
						closeAction: 'hide',
						constrain: true,
						layout: 'fit',
						title: 'Desglose del plan: ' + _this.arraynombreplan[0],
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
			   _this.BarraProgreso.show('Desgloce del plan');
		};

		//funcion que muestra los detalles del desgloce
		this.CrearVentanaDetalles = function (n) {
				var idtipoelemento = n.attributes.idtipoelemento;
				switch (idtipoelemento) {
						case '0':
								var arrayidplanes = [];
								arrayidplanes[0] = n.attributes.idelemento;
								var objCrudPlan = new Utilidades.Cmp.Cmpcrudplan();
								objCrudPlan.CrearWinCrudPlan('Ver datos del', _this.PostAccionesGestionar, arrayidplanes);
								break;
						case 1:
								var arrayidobjetivos = [];
								arrayidobjetivos[0] = n.attributes.idelemento;
								var eshija = 0;
								var objCrudObjetivo = new Utilidades.Cmp.Cmpcrudobjetivos();
								objCrudObjetivo.CrearWinCrudObjetivos(new Date().format('d/m/Y'), new Date().format('d/m/Y'), 'Ver datos del', function () {
								}, arrayidobjetivos, null, eshija, permisomodificar = 1, permisoeliminar = 1, arrayelementosrelacionadosinicial = []);
								break;
						case 3:
								var arrayidactividades = [];
								arrayidactividades[0] = n.attributes.idelemento;
								var eshija = 0;
								var objCrudActividad = new Utilidades.Cmp.Cmpcrudactividades();
								objCrudActividad.CrearWinCrudActividades(new Date().format('d/m/Y'), new Date().format('d/m/Y'), '8:00 AM', '5:00 PM', 'Ver datos de la', function () {
								}, arrayidactividades, null, eshija, permisomodificar = 1, permisoeliminar = 1, arrayelementosrelacionadosinicial = []);
								break;
						case 4:
								var objCrudObjetivo = new Utilidades.Cmp.Cmpcrudobjetivos();
								objCrudObjetivo.arrayidcriterios = [];
								objCrudObjetivo.arrayidcriterios[0] = n.attributes.idelemento;
								objCrudObjetivo.CrearWinCriterio('Ver datos del', new Date().format('d/m/Y'), new Date().format('d/m/Y'));
								break;
						case 5:
								var arrayidarc = [];
								var arrayidautorarc = [];
								arrayidarc[0] = n.attributes.idelemento;
								var eshija = 0;
								var objCrudArc = new Utilidades.Cmp.Cmpcrudarc();
								objCrudArc.CrearWinCrudArc('Ver datos del', function () {
								}, arrayidarc, arrayidautorarc[0], eshija, arrayelementosrelacionadosinicial = []);
								break;
				}
		};

		this.AccionesPostEjecutarFT = function () {
				_this.arrayidplan = [];
				_this.stTGCmpPlan.reload({});
				_this.ActualizarEstadoBarraHerramientas();
		};

		//funcion para mostrar el icono "activo"
		function MostrarImagenActivo(valor) {
				if (valor == 0) {
						return '<center><span><img src="../../../comun/recursos/images/fam/desactivo.png" ></span></center>';
				} else {
						return '<center><span><img src="../../../comun/recursos/images/fam/activo.png" ></span></center>';
				}
		}

		//funcion para mostrar el icono "tipo de elemento"
		function MostrarImagenTipoElemento(valor, m) {
				m.attr = 'ext:qtip="<b>' + valor + '</b>"';
				//return '<span><img src="../../../comun/recursos/images/fam/plan.png" >' + ' ' + valor + '</span>';
				return '<span class="icondistra-folder sipac-azul">' + ' ' + valor + '</span>';
		}

		//funcion para mostrar el icono "estado de cumplimiento"
		function MostrarImagenEstadoCumplimiento(val, b, c) {
				val3 = c.data.gradocumplimiento * 1;
				if (val3 == 0) {
						//return '<span><img src="../../../comun/recursos/images/fam/flag_red.png" >' + ' ' + val + '</span>';
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
						return val;
				}
		}

		function MostrarImagenT(val) {
				if (val == 0) {
						return ' ';
				}
				if (val > 0) {
						return '<center><span class="icondistra-validaryaceptar sipac-verde"></span></center>';
				}
		}

		this.cargarConfiguracionPerfil = function (tipoelemento, idcargaspordefecto) {
				_this.BarraProgreso.show('Cargando planes');
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
												_this.ftCmpPlan.filters.items[2].dates.after.menu.picker.setValue(dt);
												_this.ftCmpPlan.filters.items[2].active = true;
										}
										if (responseData.fechafin != null && responseData.fechafin != 'undefined') {
												var dt = new Date(responseData.fechafin);
												dt.setDate(dt.getDate() + 1);
												_this.ftCmpPlan.filters.items[3].dates.before.menu.picker.setValue(dt);
												_this.ftCmpPlan.filters.items[3].active = true;

										}
										if (_this.ftCmpPlan.filters.items[3].active === true && _this.ftCmpPlan.filters.items[2].active === true) {
												_this.ftCmpPlan.filters.items[2].dates.after.setChecked(true);
												_this.ftCmpPlan.filters.items[3].dates.before.setChecked(true);
										} else if (_this.ftCmpPlan.filters.items[3].active === true) {
												_this.ftCmpPlan.filters.items[3].dates.before.setChecked(true);
										} else if (_this.ftCmpPlan.filters.items[2].active === true) {
												_this.ftCmpPlan.filters.items[2].dates.after.setChecked(true);
										}
										if (responseData.estadoaprobacion != null && responseData.estadoaprobacion != 'undefined') {
												_this.ftCmpPlan.filters.items[5].active = true;
												_this.ftCmpPlan.filters.items[5].setValue(responseData.estadoaprobacion);
										}
										if (responseData.porcientocumplimiento != null && responseData.porcientocumplimiento != 'undefined') {
												_this.ftCmpPlan.filters.items[4].active = true;
												if (responseData.igual == 1) {
														_this.ftCmpPlan.filters.items[4].menu.fields.eq.setValue(responseData.porcientocumplimiento);
												}
												if (responseData.mayor == 1) {
														_this.ftCmpPlan.filters.items[4].menu.fields.gt.setValue(responseData.porcientocumplimiento);
												}
												if (responseData.menor == 1) {
														_this.ftCmpPlan.filters.items[4].menu.fields.lt.setValue(responseData.porcientocumplimiento);
												}
										}
										if (responseData.estadocumplimiento != null && responseData.estadocumplimiento != 'undefined' && responseData.estadocumplimiento != 0) {
												_this.ftCmpPlan.filters.items[6].active = true;
												if (responseData.estadocumplimiento == 1) {
														_this.ftCmpPlan.filters.items[6].setValue('Sin cumplir');
												} else if (responseData.estadocumplimiento == 2) {
														_this.ftCmpPlan.filters.items[6].setValue('Parcialmente cumplido');
												} else if (responseData.estadocumplimiento == 3) {
														_this.ftCmpPlan.filters.items[6].setValue('Cumplido');
												}
										}
										if (_this.ftCmpPlan.filters.items[5].active !== true)
												_this.stTGCmpPlan.reload();
								} else {
										_this.stTGCmpPlan.reload();
								}
						}
				});
		};

		//funcion para cambiarle el titulo al grid de Planes cuando filtre
		this.changeTitlePlan = function () {
				var filtrado_por = "";
				var sep = "/";
				if ((_this.ftCmpPlan.getFiltrosActivos() == undefined || _this.ftCmpPlan.getFiltrosActivos().length == 0) && _this.stTGCmpPlan.getSortState() == undefined) {
						// _this.WinPrincipal.setTitle('Registro de planes');
				} else if (_this.stTGCmpPlan.getSortState() != undefined && (_this.ftCmpPlan.getFiltrosActivos() == undefined || _this.ftCmpPlan.getFiltrosActivos().length == 0)) {
						_this.field = _this.stTGCmpPlan.getSortState().field;
						_this.dir = _this.stTGCmpPlan.getSortState().direction;
						var atributo = '';
						var direccion = '';
						if (_this.dir == 'DESC')
								direccion = 'descendentemente';
						else
								direccion = 'ascendentemente';
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
						/*if (atributo)
						 _this.WinPrincipal.setTitle('Registro de planes <i>- Ordenado ' + direccion + ' por: ' + atributo + '</i>');
						 else
						 _this.WinPrincipal.setTitle('Registro de planes');*/
				} else {
						for (i = 0; i < _this.ftCmpPlan.getFiltrosActivos().length; i++) {
								var aux = "";
								if (_this.ftCmpPlan.getFiltrosActivos()[i].dataIndex == "denominacion") {
										aux = 'Denominaci&oacute;n';
								} else if (_this.ftCmpPlan.getFiltrosActivos()[i].dataIndex == "idelemento") {
										aux = 'CAR';
								} else if (_this.ftCmpPlan.getFiltrosActivos()[i].dataIndex == "fechainicio") {
										aux = 'Fecha de Inicio';
								} else if (_this.ftCmpPlan.getFiltrosActivos()[i].dataIndex == "fechafin") {
										aux = 'Fecha de Fin';
								} else if (_this.ftCmpPlan.getFiltrosActivos()[i].dataIndex == "nombreautor") {
										aux = 'Autor';
								} else if (_this.ftCmpPlan.getFiltrosActivos()[i].dataIndex == "textocumplimiento") {
										aux = 'Estado de cumplimiento';
								} else if (_this.ftCmpPlan.getFiltrosActivos()[i].dataIndex == "nombreestadoaprob") {
										aux = 'Estado de aprobaci&oacute;n';
								} else if (_this.ftCmpPlan.getFiltrosActivos()[i].dataIndex == "gradocumplimiento") {
										aux = 'Porciento de cumplimiento';
								} else {
										aux = 'Observ.';
								}
								if (i == _this.ftCmpPlan.getFiltrosActivos().length - 1) {
										sep = "";
								}
								filtrado_por += aux + sep;
						}
						//_this.WinPrincipal.setTitle('Registro de planes <i>- Filtrado por: ' + filtrado_por + '</i>');
						filtrado_por = "";
				}
		};

		this.ObtenerSmPlanes = function () {
				return _this.smTGCmpPlan;
		};

		this.ObtenerStPlanes = function () {
				return _this.stTGCmpPlan;
		};


};

