Utilidades.Cmp.Cmpgestionarindicadores = function () {

		var _this = this;
		this.ObjValidaciones = new Utilidades.Cmp.Cmpvalidaciones();
		this.arrayindicadoresseleccionados = [];
		this.arraycriteriosmedidaindicador = [];
		this.arraycriterioevalcriteriosmedidaindicador = [];
		this.arraycriterioevaluacionindicador = [];
		this.arraycriterioevaluacionobjetivo = [];
		this.arrayformulaseliminadasCEI = [];
		this.arrayformulaseliminadasCEO = [];
		this.arrayformulasEvaluacionObjetivo = [];
		this.idindicadorobjcritseleccionado=0;
		//objeto del componente "barra de progreso"
		this.BarraProgreso = new BarraEstado();

		this.crearWinPrincipal=function(idobjetivo, nombreobjetivo){
				_this.idobjetivo=idobjetivo;
				_this.nombreobjetivo=nombreobjetivo;
				/***
				 * Componentes del panel superior indicadores
				 *
				 * ***/

				_this.storeIndicadores = new Ext.data.Store({
					  autoLoad:true,
						remoteSort: true,
						url: '/planificacion/pdo/plan/index.php/cmpgestionarobjetivos/cargarindicadores',
						listeners: {
								beforeload: function (st) {
										st.baseParams.idobjetivo = _this.idobjetivo;
								},
								load: function (store, record, options) {

								}
						},
						reader: new Ext.data.JsonReader({
								id: 'idindicadorobjcrit',
								totalProperty: "total",
								root: "campos"
						}, [{
								name: 'idindicadorobjcrit'
						}, {
								name: 'idobjetivo'
						}, {
								name: 'idautor'
						}, {
								name: 'nombreautor'
						}, {
								name: 'denominacion'
						}, {
								name: 'descripcion'
						}, {
								name: 'idnomenclador'
						}, {
								name: 'evaluacion_indicador'
						}])

				});

				_this.paginadoIndicadores = new Ext.PagingToolbar({
						id: "paginadoIndicadores",
						pageSize: 1000,
						width:1060,
						store: _this.storeIndicadores,
						displayInfo: true,
						listeners: {
								beforechange: function (paginado, evento) {
										// _this.pgactual = evento.start;
										// _this.start = evento.start;
								}
						}
				});


				//  Row selection para grid superior
				_this.smIndicadores = new Ext.grid.CheckboxSelectionModel({
						// singleSelect: false
						sortable:true,
						listeners: {
								selectionchange: function () {
										_this.actualizarBarraHerramientasIndicadores();
								},
								rowselect: function () {
										//   ActualizarBotonesDesAsociar();
								},
								rowdeselect: function () {
										// ActualizarBotonesDesAsociar();
								}
						}
				});


				//botones para la gestion de los indicadores
				_this.btnAdicionarIndicador = new Ext.Button({
						handler: function () {
								_this.MostrarwindowGIndicadores('adicionar');
						},
						disabled: false,
						iconCls: 'adicionar',
						tooltip: 'Adicionar indicador',
						// key: {
						// 		alt: true,
						// 		key: 'I'
						// },
						scope: this
				});
				_this.btnModificarIndicador = new Ext.Button({
						handler: function () {
								_this.MostrarwindowGIndicadores('modificar');
						},
						disabled: true,
						iconCls: 'modificar',
						tooltip: 'Modificar indicador',
						// key: {
						// 		alt: true,
						// 		key: 'M'
						// },
						scope: this
				});
				_this.btnEliminarIndicador = new Ext.Button({
						handler: function () {
								var sms='El indicador ha ';
								var sms_preg="¿Está seguro que desea eliminar el indicador seleccionado?";
								if(_this.arrayindicadoresseleccionados.length>1){
										sms_preg="¿Está seguro que desea eliminar los indicadores seleccionados?";
										sms='Los indicadores han ';
								}
								mostrarMensaje(2, sms_preg, function (btnoprimido) {
										if (btnoprimido == 'ok') {
												_this.BarraProgreso.show("Eliminando indicador");
												Ext.Ajax.request({
														url: '/planificacion/pdo/plan/index.php/cmpgestionarobjetivos/eliminarIndicador',
														params: {
																arrayindicadores: Ext.encode(_this.arrayindicadoresseleccionados)
														},
														callback: function (options, success, response) {
																_this.BarraProgreso.hide();
																var responseData = Ext.decode(response.responseText);
																if (responseData.mensaje == 1) {
																		_this.storeIndicadores.reload();
																		mostrarMensaje(1, sms+'sido eliminado satisfactoriamente.');
																}
														}
												});
										}
								});

						},
						disabled: true,
						iconCls: 'eliminar',
						tooltip: 'Eliminar indicador',
						// key: {
						// 		key: Ext.EventObject.DELETE
						// },
						scope: this
				});

				_this.btnVerIndicador = new Ext.Button({
						handler: function () {
								_this.MostrarwindowGIndicadores('detalles');
						},
						disabled: true,
						iconCls: 'Ver',
						tooltip: 'Ver datos del indicador',
						// key: {
						// 		ctrl: false,
						// 		alt: true,
						// 		key: 'D',
						// },
						scope: this
				});

				_this.btnLimpiarFiltrosIndicador = new Ext.Button({
						disabled: true,
						handler: function () {

						},
						iconCls: 'limpiar',
						tooltip: 'Limpiar filtro(s)',
						// key: {
						// 		alt: true,
						// 		key: 'L'
						// },
						scope: this
				});

				_this.MostrarwindowGIndicadores=function(accion){
						_this.idindicadorobjcritseleccionado=0;

						var readOnlyGI=false;
						if(accion=='detalles'){
								readOnlyGI=true;
						}

						//campo para la denominacion del indicador
						_this.tfdenominacionIndicador = new Ext.form.TextField({
								id: 'denominacion',
								fieldLabel: 'Denominación',
								maxLength: 255,
								labelWidth: 90,
								readOnly:readOnlyGI,
								maxLengthText: 'El tamaño máximo requerido es 255 caracteres.',
								regex: _this.ObjValidaciones.expresionRegular('denominacion'),
								//maskRe: /^([a-zA-Z0-9áÃ©íóÃºÃ¼Ã�Ã‰Ã�Ã“ÃšñÃ‘Ãœ"' ,./()_-])$/,
								regexText: _this.ObjValidaciones.ObtenerMsjErrorTextoRegido('denominacion'),
								vtype: 'validarEspaciosEnBlanco',
								allowBlank: false,
								// style: {textTransform: 'uppercase'},
								anchor: '100%'
						});

						_this.taDescripcionIndicador = new Ext.form.TextArea({
								id: 'descripcion',
								anchor: '100%',
								height: 120,
								width:210,
								labelWidth: 90,
								maxLength: 255,
								readOnly:readOnlyGI,
								maxLengthText: 'El tamaño máximo requerido es de 255 caracteres.',
								fieldLabel: 'Descripci&oacute;n'
						});

						_this.formGIndicadores = new Ext.FormPanel({
								labelAlign: 'top',
								frame: true,
								items: [_this.tfdenominacionIndicador, _this.taDescripcionIndicador]
						});
						_this.btnCerrarGIndicadores = new Ext.Button({
								iconCls: 'cerrar',
								text: 'Cerrar',
								hidden:true,
								tooltip: 'Cerrar ventana',
								handler: function () {
										_this.windowGIndicadores.destroy();
								}
						});

						_this.btnCancelarGIndicadores = new Ext.Button({
								iconCls: 'cancelar',
								text: 'Cancelar',
								tooltip: 'Cerrar ventana sin guardar los datos',
								handler: function () {
										_this.windowGIndicadores.destroy();
								}
						});

						_this.btnAceptarGIndicadores= new Ext.Button({
								iconCls: 'aceptar',
								text: 'Aceptar',
								disabled: true,
								tooltip: 'Guardar datos y cerrar ventana',
								handler: function () {
										  _this.GuardarGIndicadores(accion, 'aceptar');
								}
						});

						_this.btnAplicarGIndicadores= new Ext.Button({
								iconCls: 'aplicar',
								text: 'Aplicar',
								disabled: true,
								tooltip: 'Guardar datos y limpiar campos',
								handler: function () {
										_this.GuardarGIndicadores(accion, 'aplicar');
								}
						});

						var title="Adicionar indicador";
						if(accion=='modificar'){
								title="Modificar indicador";
								_this.idindicadorobjcritseleccionado=_this.arrayindicadoresseleccionados[0].idindicadorobjcrit;
								_this.BarraProgreso.show("Obteniendo información");
								Ext.Ajax.request({
										url: '/planificacion/pdo/plan/index.php/cmpgestionarobjetivos/obtenerinformacionIndicador',
										params: {
												idindicadorobjcrit: _this.idindicadorobjcritseleccionado
										},
										callback: function (options, success, response) {
												_this.BarraProgreso.hide();
												var responseData = Ext.decode(response.responseText);
												// console.log(responseData.informacion)
												if (responseData.informacion) {
														_this.tfdenominacionIndicador.setValue(responseData.informacion.denominacion);
														var descripcion=responseData.informacion.descripcion.replace('&nbsp;', '');
														    descripcion=descripcion.replace('&nbsp;<br>', '');
														    descripcion=descripcion.replace('<br>', '');
														_this.taDescripcionIndicador.setValue(descripcion);
												}
										}
								});
						}
						if(accion=='detalles'){
								title="Ver detalles indicador";
								_this.idindicadorobjcritseleccionado=_this.arrayindicadoresseleccionados[0].idindicadorobjcrit;
								_this.BarraProgreso.show("Obteniendo información");
								Ext.Ajax.request({
										url: '/planificacion/pdo/plan/index.php/cmpgestionarobjetivos/obtenerinformacionIndicador',
										params: {
												idindicadorobjcrit: _this.idindicadorobjcritseleccionado
										},
										callback: function (options, success, response) {
												_this.BarraProgreso.hide();
												console.log(accion);
												var responseData = Ext.decode(response.responseText);
												// console.log(responseData.informacion)
												if (responseData.informacion) {
														_this.tfdenominacionIndicador.setValue(responseData.informacion.denominacion);
														var descripcion=responseData.informacion.descripcion.replace('&nbsp;', '');
														descripcion=descripcion.replace('&nbsp;<br>', '');
														descripcion=descripcion.replace('<br>', '');
														_this.taDescripcionIndicador.setValue(descripcion);
												}

												_this.btnCerrarGIndicadores.setVisible(true);
												_this.btnCancelarGIndicadores.setVisible(false);
												_this.btnAplicarGIndicadores.setVisible(false);
												_this.btnAceptarGIndicadores.setVisible(false);
										}
								});
						}

						_this.windowGIndicadores = new Ext.Window({
								title: title,
								width: 700,
								height: 270,
								minWidth: 700,
								minHeight: 270,
								layout: 'fit',
								plain:true,
								modal: true,
								closeAction: 'destroy',
								constrain: true,
								resizable: false,
								items: _this.formGIndicadores,
								buttons: [_this.btnCancelarGIndicadores, _this.btnCerrarGIndicadores,_this.btnAplicarGIndicadores,_this.btnAceptarGIndicadores]
						});

						_this.windowGIndicadores.show();
				}

				_this.GuardarGIndicadores=function(accion, respuesta){
						var url = 'adicionarindicador';
						var postaccion='adicionado';
						if(accion=='modificar'){
								url = 'modificarindicador';
								postaccion='modificado';
						}
						var waitMsg = 'Guardando datos del indicador';
						_this.BarraProgreso.show(waitMsg);
						_this.formGIndicadores.getForm().submit({
								url: '/planificacion/pdo/plan/index.php/cmpgestionarobjetivos/' + url,
								params: {
										idobjetivo: _this.idobjetivo,
										idindicadorobjcrit: _this.idindicadorobjcritseleccionado
										// denominacion: _this.tfdenominacionIndicador.getValue(),
										// descripcion: _this.taDescripcionIndicador.getValue(),
								},
								failure: function (form, action) {
										if(respuesta=='aceptar'){
												_this.windowGIndicadores.destroy();
										}else{
												if(accion=='adicionar'){
														_this.formGIndicadores.getForm().reset();
														_this.idindicadorobjcritseleccionado=0;
												 }
										}
										_this.BarraProgreso.hide();
										if (action.result.mensaje == 1) {
												_this.storeIndicadores.reload();
												mostrarMensaje(1, 'El indicador ha sido ' + postaccion + ' satisfactoriamente.');
										}
								}
						});
				}

				_this.actualizarBarraHerramientasIndicadores = function () {
						_this.arrayindicadoresseleccionados = [];
						_this.btnModificarIndicador.disable();
						_this.btnEliminarIndicador.disable();
						_this.btnVerIndicador.disable();
						if(_this.smIndicadores.hasSelection()){
								_this.btnEliminarIndicador.enable()
								var arrayrecords = _this.smIndicadores.getSelections();
								var totalrecords = arrayrecords.length;
								_this.idindicadorobjcritseleccionado=arrayrecords[0].data.idindicadorobjcrit;
								if (totalrecords == 1) {
										_this.btnModificarIndicador.enable();
										_this.btnVerIndicador.enable();
								    }
								for (var i = 0; i < totalrecords; i++) {
										var elementoseleccionado = {};
										elementoseleccionado = {
												idindicadorobjcrit: arrayrecords[i].data.idindicadorobjcrit,
												idobjetivo: arrayrecords[i].data.idobjetivo,
												idautor: arrayrecords[i].data.idautor,
												denominacion: arrayrecords[i].data.denominacion,
												descripcion: arrayrecords[i].data.descripcion,
												idnomenclador: arrayrecords[i].data.idnomenclador,
												evaluacion_indicador: arrayrecords[i].data.evaluacion_indicador
										};
										_this.arrayindicadoresseleccionados.push(elementoseleccionado);
								}
						}
						_this.getCMIndicadorSeleccionado(_this.smIndicadores.getSelections());
				}

				_this.getCMIndicadorSeleccionado=function(arrayrecords){
						if(arrayrecords.length==1){
								var seleccionado=arrayrecords[0].data;
								_this.idindicadorobjcritseleccionado=seleccionado.idindicadorobjcrit;
								_this.storeMedidaIndicadores.reload();
								_this.storeEvaluacionIndicador.reload();

								_this.panelInferior.setDisabled(false);
						}else{
								_this.idindicadorobjcritseleccionado=0;
								_this.storeMedidaIndicadores.reload();
								_this.storeEvaluacionIndicador.reload();
								_this.panelInferior.setDisabled(true);
						}

				}

				_this.relacionarCriterioIndicador=function(){

						_this.stTGCmpCriterio = new Ext.data.Store({
								url: '/planificacion/pdo/plan/index.php/cmpgestionarobjetivos/cargarcriteriosindicadores',
								reader: new Ext.data.JsonReader({
										id: 'idcriteriomedida',
										totalProperty: "total",
										root: "campos"
								}, [{
										name: 'idcriteriomedida'
								}, {
										name: 'denominacion'
								}, {
										name: 'valormeta'
								}, {
										name: 'valoreal'
								}, {
										name: 'fechainicio'
								}, {
										name: 'fechafin'
								}, {
										name: 'estadocumplimiento'
								}, {
										name: 'nombreautor'
								}, {
										name: 'subordinado'
								}, {
										name: 'superior'
								}, {
										name: 'modificar'
								}, {
										name: 'eliminar'
								}, {
										name: 'idautor'
								}, {
										name: 'evaluacion'
								}]),
								listeners: {
										beforeload: function (st) {
												st.baseParams.idobjetivo = _this.idobjetivo;
												st.baseParams.idindicadorobjcrit = _this.idindicadorobjcritseleccionado;
												st.baseParams.relacionado_indicador = 0;
										},
										load: function (store, record, options) {
												_this.smTGCmpCriterio.selectFirstRow();
										}
								}
						});

						_this.smTGCmpCriterio = new Ext.grid.CheckboxSelectionModel({
								singleSelect: false,
								listeners: {
										selectionchange:function(sm){
												_this.btnSeleccionarCM.setDisabled(sm.getSelections().length==0);
										}
								}
						});

						var color = '';
						_this.cmTGCmpCriterio = new Ext.grid.ColumnModel(
								[
										_this.smTGCmpCriterio,
										{
												header: 'CAR',
												dataIndex: 'idcriteriomedida',
												width: 80,
												sortable: true
										}, {
										header: "Denominaci&oacute;n",
										id: 'expandir',
										dataIndex: 'denominacion',
										sortable: true,
										width: 230,
										renderer: MostrarImagenTipoElemento
								}, {
										header: "Fecha de Inicio",
										dataIndex: 'fechainicio',
										width: 100,
										sortable: true
								}, {
										header: "Fecha de Fin",
										dataIndex: 'fechafin',
										width: 100,
										sortable: true
								}, {
										header: "Autor",
										dataIndex: 'nombreautor',
										width: 90,
										sortable: true
								}, {
										header: "Valor meta",
										dataIndex: 'valormeta',
										width: 80,
										sortable: true/*,
										editor: new Ext.form.NumberField({
												allowBlank: false
										})*/
								}, {
										header: "Valor real",
										dataIndex: 'valoreal',
										width: 80,
										sortable: true/*,
										editor: new Ext.form.NumberField({
												allowBlank: false
										})*/
								}, {
										header: "Evaluaci&oacute;n",
										dataIndex: 'evaluacion',
										width: 80,
										sortable: true,
										renderer: MostrarImagenEvaluacion
								}, {
										header: "Estado de cumplimiento",
										dataIndex: 'estadocumplimiento',
										width: 165,
										sortable: true,
										renderer: MostrarImagenEstadoCumplimiento
								}
								]);
						_this.TGCmpCriterio = new Ext.grid.GridPanel({
								autoWidth: true,
								width: '100%',
								height: '50%',
								border: false,
								sm: _this.smTGCmpCriterio,
								store: _this.stTGCmpCriterio,
								loadMask: {
										msg: 'Cargando criterios'
								},
								cm: _this.cmTGCmpCriterio,
								// tbar: [_this.btnAdicionarCriterio, ' ', _this.btnModificarCriterio, ' ', _this.btnEliminarCriterio, ' ',
								// 		_this.btnVerCriterio, ' ', _this.btnVerNotif, ' ',_this.btnGestionarIndicadores,' ', _this.btnGuardarCriterio, ' ', _this.btn100CM, ' ', _this.btnOtroValorCM],
								// menuderecho: _this.menuderechoTGCmpCriterios,
								// listeners: {
								// 		rowcontextmenu: function (grid, row, e) {
								// 				_this.TGCmpCriterio.getSelectionModel().selectRow(row);
								// 				if (_this.arrayidcriterios.length == 1) {
								// 						e.stopEvent();
								// 						var xy = e.getXY();
								// 						_this.menuderechoTGCmpCriterios.showAt(xy);
								// 				}
								// 		},
								// 		afteredit: function (e) {
								// 				if (e.value != e.originalValue)
								// 						_this.btnGuardarCriterio.enable()
								// 		},
								// 		rowdblclick: function () {
								// 				_this.CrearWinCriterio('Modificar', new Date().format('d/m/Y'), new Date().format('d/m/Y'));
								// 		}
								// },
								bbar: new Ext.PagingToolbar({
										pageSize: 20,
										store: _this.stTGCmpCriterio,
										displayInfo: true
								})
						});

						_this.stTGCmpCriterio.reload({
								params: {
										limit: 20,
										start: 0
								}
						});
						_this.TGCmpCriterio.getView().getRowClass = function (ri, n) {
								if (ri.data.superior == 1)
										return "superior";
								else
										return "";
						};

						_this.pcmpcriterio = new Ext.Panel({
								items: [_this.TGCmpCriterio],
								height: 540,
								layout: 'fit',
								width: 1000
						});

						_this.btnSeleccionarCM = new Ext.Button({
								handler: function () {
										var arrayrecords = _this.smTGCmpCriterio.getSelections();
										var totalrecords = arrayrecords.length;
										var arraycriteriosseleccionados=[];
										for (var i = 0; i < totalrecords; i++) {
												var elementoseleccionado = {};
												elementoseleccionado = {
														idcriteriomedida: arrayrecords[i].data.idcriteriomedida
												};
												arraycriteriosseleccionados.push(elementoseleccionado);
										}
										_this.BarraProgreso.show("Relacionando criterios de medida");
										Ext.Ajax.request({
												url: '/planificacion/pdo/plan/index.php/cmpgestionarobjetivos/relacionarCriteriosIndicadores',
												params: {
														arraycriteriosseleccionados: Ext.encode(arraycriteriosseleccionados),
														idindicadorobjcrit:_this.idindicadorobjcritseleccionado
												},
												callback: function (options, success, response) {
														_this.BarraProgreso.hide();
														_this.winCmpCriterio.destroy();
														var responseData = Ext.decode(response.responseText);
														if (responseData.mensaje == 1) {
																_this.storeMedidaIndicadores.reload();
																mostrarMensaje(1, 'Se ha realizado la relación satisfactoriamente.');
														}
												}
										});

								},
								disabled: true,
								text: 'Seleccionar',
								iconCls: 'seleccion',
								tooltip: 'Relacionar criterio(s) de medida seleccionado(s)',
						});
						_this.winCmpCriterio = new Ext.Window({
								title: 'Criterios de medidas del objetivo : "' + _this.nombreobjetivo + '"',
								modal: true,
								resizable: false,
								constrain: true,
								width: 1050,
								layout: 'fit',
								height: 540,
								items: [_this.pcmpcriterio],
								buttons: [
										{
												text: 'Cerrar',
												iconCls: 'cerrar',
												tooltip: 'Cerrar ventana',
												handler: function () {
														_this.winCmpCriterio.destroy();
												}
										}, _this.btnSeleccionarCM
								]
						});

						_this.winCmpCriterio.show();
				}

				// create the grid indicadores
				_this.gridIndicadores = new Ext.grid.GridPanel({
						sm:_this.smIndicadores,
						height:400,
						// width:1100,
						split: true,
						loadMask: {
								msg: 'Cargando indicadores...'
						},
						title:'Indicadores',
						region: 'north',
						store: _this.storeIndicadores,
						tbar:[_this.btnAdicionarIndicador,'-',_this.btnModificarIndicador,'-', _this.btnEliminarIndicador, '-',
								_this.btnVerIndicador, '-', _this.btnLimpiarFiltrosIndicador],
						columns: [
								_this.smIndicadores,
								{
										hidden: true,
										hideable: false,
										dataIndex: 'idindicadorobjcrit'
								}, {

										header: "CAR",
										dataIndex: 'idindicadorobjcrit',
										sortable: true
								}, {
										header: "Denominaci&oacute;n",
										width: 350,
										dataIndex: 'denominacion',
										sortable: true
								}, {
										header: 'Autor',
										width: 300,
										dataIndex: 'nombreautor',
										sortable: true
								},{
										header: 'Resultado de evaluaci&oacute;n',
										width: 290,
										dataIndex: 'evaluacion_indicador',
										sortable: true
								}
						],
					bbar:[_this.paginadoIndicadores]
				});



				/***
				 * Componentes del panel superior evaluacion del objetivo
				 *
				 * ***/

				_this.storeEvalObjetivo = 	new Ext.data.Store({
								autoLoad:true,
								remoteSort: true,
								url: '/planificacion/pdo/plan/index.php/cmpgestionarobjetivos/cargarCriterioEvaluacionObjetivo',
								listeners: {
										beforeload: function (st) {
												st.baseParams.idobjetivo = _this.idobjetivo;
										},
										load: function (store, record, options) {

										}
								},
								reader: new Ext.data.JsonReader({
										id: 'idcriterioevaluacionobj',
										totalProperty: "total",
										root: "campos"
								}, [{
										name: 'idcriterioevaluacionobj'
								},{
										name: 'resultado_evaluativo'
								}])

						});



				_this.paginadoEvalObjetivo = new Ext.PagingToolbar({
						id: "paginadoEvalObjetivo",
						pageSize: 1000,
						width:1060,
						store: _this.storeEvalObjetivo,
						displayInfo: true,
						listeners: {
								beforechange: function (paginado, evento) {
										// _this.pgactual = evento.start;
										// _this.start = evento.start;
								}
						}
				});

				//  Row selection para grid superior
				_this.smEvalObjetivo = new Ext.grid.CheckboxSelectionModel({
						// singleSelect: false
						sortable:true,
						listeners: {
								selectionchange: function () {
										_this.actualizarBarraHerramientasCEO();
								},
								rowselect: function (sm, indiceFila, record) {

								},
								rowdeselect: function (sm, indiceFila, record) {

								}
						}
				});


				//botones para la gestion de los Criterios de Medida
				_this.btnAdicionarEO = new Ext.Button({
						handler: function () {
								_this.adicionarEvalObjetivo('adicionar');

						},
						disabled: false,
						iconCls: 'adicionar',
						tooltip: 'Adicionar evaluaci&oacute;n del objetivo',
						// key: {
						// 		alt: true,
						// 		key: 'I'
						// },
						scope: this
				});
				_this.btnModificarEO = new Ext.Button({
						handler: function () {
								_this.adicionarEvalObjetivo('modificar');
						},
						disabled: true,
						iconCls: 'modificar',
						tooltip: 'Modificar evaluaci&oacute;n del objetivo',
						// key: {
						// 		alt: true,
						// 		key: 'M'
						// },
						scope: this
				});
				_this.btnEliminarEO = new Ext.Button({
						handler: function () {
								var sms='El criterio ha ';
								var sms_preg="¿Está seguro que desea eliminar el criterio seleccionado?";
								if(_this.arraycriterioevaluacionobjetivo.length>1){
										sms_preg="¿Está seguro que desea eliminar los criterios seleccionados?";
										sms='Los criterios han ';
								}
								mostrarMensaje(2, sms_preg, function (btnoprimido) {
										if (btnoprimido == 'ok') {
												_this.BarraProgreso.show("Eliminando criterios");
												Ext.Ajax.request({
														url: '/planificacion/pdo/plan/index.php/cmpgestionarobjetivos/eliminarCriterioEvaluacionObjetivo',
														params: {
																arraycriterios: Ext.encode(_this.arraycriterioevaluacionobjetivo)
														},
														callback: function (options, success, response) {
																_this.BarraProgreso.hide();
																var responseData = Ext.decode(response.responseText);
																if (responseData.mensaje == 1) {
																		_this.storeEvalObjetivo.reload();
																		mostrarMensaje(1, sms+'sido eliminado satisfactoriamente.');
																}
														}
												});
										}
								});
						},
						disabled: true,
						iconCls: 'eliminar',
						tooltip: 'Eliminar evaluaci&oacute;n del objetivo',
						// key: {
						// 		key: Ext.EventObject.DELETE
						// },
						scope: this
				});

				_this.btnVerEO = new Ext.Button({
						handler: function () {
								_this.adicionarEvalObjetivo('detalles');
						},
						disabled: true,
						iconCls: 'Ver',
						tooltip: 'Ver datos de la evaluaci&oacute;n del objetivo',
						// key: {
						// 		ctrl: false,
						// 		alt: true,
						// 		key: 'D',
						// },
						scope: this
				});

				_this.btnLimpiarFiltrosEO = new Ext.Button({
						disabled: true,
						hidden:true,
						handler: function () {

						},
						hidden:true,
						iconCls: 'limpiar',
						tooltip: 'Limpiar filtro(s)',
						// key: {
						// 		alt: true,
						// 		key: 'L'
						// },
						scope: this
				});


				_this.actualizarBarraHerramientasCEO = function () {
						_this.arraycriterioevaluacionobjetivo = [];
						_this.btnModificarEO.disable();
						_this.btnEliminarEO.disable();
						_this.btnVerEO.disable();
						if(_this.smEvalObjetivo.hasSelection()){
								_this.btnEliminarEO.enable()
								var arrayrecords = _this.smEvalObjetivo.getSelections();
								var totalrecords = arrayrecords.length;
								if (totalrecords == 1) {
										_this.btnModificarEO.enable();
										_this.btnVerEO.enable();
								}
								for (var i = 0; i < totalrecords; i++) {
										var elementoseleccionado = {};
										elementoseleccionado = {
												idcriterioevaluacionobj: arrayrecords[i].data.idcriterioevaluacionobj,
												resultado_evaluativo: arrayrecords[i].data.resultado_evaluativo
										};
										_this.arraycriterioevaluacionobjetivo.push(elementoseleccionado);
								}
						}
				}


				// create the grid
				_this.gridEvalObjetivo = new Ext.grid.GridPanel({
						sm: _this.smEvalObjetivo,
						height:200,
						split: true,
						title:'Criterio de evaluaci&oacute;n del objetivo',
						region    : 'south',
						store: _this.storeEvalObjetivo,
						loadMask: {
								msg: 'Cargando criterio de evaluación'
						},
						tbar:[_this.btnAdicionarEO, '-', _this.btnModificarEO, '-', _this.btnEliminarEO, '-',_this.btnVerEO,'-', _this.btnLimpiarFiltrosEO],

						columns: [
								_this.smEvalObjetivo,
								{
										hidden: true,
										hideable: false,
										dataIndex: 'idcriterioevaluacionobj'
								},{

										header: "Resultado evaluativo",
										dataIndex: 'resultado_evaluativo',
										width: 350,
										sortable: true
								}
						],
						bbar:[_this.paginadoEvalObjetivo]
				});

				// Tab Superior
				_this.tabSuperior = new Ext.TabPanel({
						region    : 'center',
						margins:'0 0 0 0',
						activeTab : 0,
						defaults  : {
								autoScroll : true
						},
						items:[_this.gridIndicadores,
							     _this.gridEvalObjetivo
						]
				});


				/***
				 * Componentes del panel inferior medida del indicador
				 *
				 * ***/

				_this.storeMedidaIndicadores = new Ext.data.Store({
						// autoLoad:true,
						url: '/planificacion/pdo/plan/index.php/cmpgestionarobjetivos/cargarcriteriosindicadores',
						reader: new Ext.data.JsonReader({
								id: 'idcriteriomedida',
								totalProperty: "total",
								root: "campos"
						}, [{
								name: 'idindicadorcriteriomedida'
						},{
								name: 'idcriteriomedida'
						}, {
								name: 'denominacion'
						}, {
								name: 'valormeta'
						}, {
								name: 'valoreal'
						}, {
								name: 'fechainicio'
						}, {
								name: 'fechafin'
						}, {
								name: 'estadocumplimiento'
						}, {
								name: 'nombreautor'
						}, {
								name: 'subordinado'
						}, {
								name: 'superior'
						}, {
								name: 'modificar'
						}, {
								name: 'eliminar'
						}, {
								name: 'idautor'
						}, {
								name: 'evaluacion'
						}]),
						listeners: {
								beforeload: function (st) {
										st.baseParams.idobjetivo = _this.idobjetivo;
										st.baseParams.idindicadorobjcrit = _this.idindicadorobjcritseleccionado;
										st.baseParams.relacionado_indicador = 1;
								},
								load: function (store, record, options) {
								}
						}
				});


				_this.paginadoMedida = new Ext.PagingToolbar({
						id: "paginadoMedida",
						pageSize: 1000,
						width:1060,
						store: _this.storeMedidaIndicadores,
						displayInfo: true,
						listeners: {
								beforechange: function (paginado, evento) {
										// _this.pgactual = evento.start;
										// _this.start = evento.start;
								}
						}
				});

				//  Row selection para grid superior
				_this.smMedidaIndicadores = new Ext.grid.CheckboxSelectionModel({
						// singleSelect: false
						sortable:true,
						listeners: {
								selectionchange: function () {
										_this.btnEliminarCM.disable();
										_this.arraycriteriosmedidaindicador=[];
										if(_this.smMedidaIndicadores.hasSelection()){
												_this.btnEliminarCM.enable()
												var arrayrecords = _this.smMedidaIndicadores.getSelections();
												var totalrecords = arrayrecords.length;

												for (var i = 0; i < totalrecords; i++) {
														var elementoseleccionado = {};
														elementoseleccionado = {
																idindicadorcriteriomedida: arrayrecords[i].data.idindicadorcriteriomedida
														};
														_this.arraycriteriosmedidaindicador.push(elementoseleccionado);
												}
										}
								}
						}
				});


				//botones para la gestion de los Criterios de Medida
				_this.btnAdicionarCM = new Ext.Button({
						handler: function () {

						},
						disabled: false,
						iconCls: 'adicionar',
						tooltip: 'Adicionar criterio de medida',
						// key: {
						// 		alt: true,
						// 		key: 'I'
						// },
						scope: this
				});
				_this.btnModificarCM = new Ext.Button({
						handler: function () {

						},
						disabled: true,
						iconCls: 'modificar',
						tooltip: 'Modificar criterio de medida',
						// key: {
						// 		alt: true,
						// 		key: 'M'
						// },
						scope: this
				});

				_this.btnEliminarCM = new Ext.Button({
						handler: function () {
								var sms_preg="Está seguro que desea eliminar la relación con el indicador";
								mostrarMensaje(2, sms_preg, function (btnoprimido) {
										if (btnoprimido == 'ok') {
												_this.BarraProgreso.show("Eliminando relación");
												Ext.Ajax.request({
														url: '/planificacion/pdo/plan/index.php/cmpgestionarobjetivos/eliminarRelacionCriterioMedidaIndicador',
														params: {
																arraycriteriosmedidaindicador: Ext.encode(_this.arraycriteriosmedidaindicador),
																idindicadorobjcrit:_this.idindicadorobjcritseleccionado
														},
														callback: function (options, success, response) {
																_this.BarraProgreso.hide();
																var responseData = Ext.decode(response.responseText);
																if (responseData.mensaje == 1) {
																		_this.storeMedidaIndicadores.reload();
																		mostrarMensaje(1, 'La relación ha sido eliminada satisfactoriamente.');
																}
														}
												});
										}
								});

						},
						disabled: true,
						iconCls: 'eliminar',
						tooltip: 'Eliminar relación criterio de medida',
						// key: {
						// 		key: Ext.EventObject.DELETE
						// },
						scope: this
				});

				_this.btnVerCM = new Ext.Button({
						handler: function () {

						},
						disabled: true,
						iconCls: 'Ver',
						tooltip: 'Ver datos del criterio de medida',
						// key: {
						// 		ctrl: false,
						// 		alt: true,
						// 		key: 'D',
						// },
						scope: this
				});

				_this.btnGuardarCM = new Ext.Button({
						handler: function () {

						},
						disabled: true,
						iconCls: 'guardar',
						tooltip: 'Ver datos del criterio de medida',
						// key: {
						// 		ctrl: false,
						// 		alt: true,
						// 		key: 'D',
						// },
						scope: this
				});
				_this.btnRegistroCM = new Ext.Button({
						handler: function () {

						},
						disabled: true,
						iconCls: 'registrodecomprobante',
						tooltip: 'Registro',
						// key: {
						// 		ctrl: false,
						// 		alt: true,
						// 		key: 'D',
						// },
						scope: this
				});

				_this.btnRelacionesCM = new Ext.Button({
						disabled: false,
						handler: function () {
               console.log(_this.idindicadorobjcritseleccionado);
								_this.relacionarCriterioIndicador();
						},
						iconCls: 'gestionarrelaciones',
						tooltip: 'Relacionar criterio de medida(s)',
						key: {
								ctrl: true,
								key: 'R'
						},
						scope: this
				});

				_this.btnLimpiarFiltrosCM = new Ext.Button({
						disabled: true,
						handler: function () {

						},
						iconCls: 'limpiar',
						tooltip: 'Limpiar filtro(s)',
						// key: {
						// 		alt: true,
						// 		key: 'L'
						// },
						scope: this
				});

				var color = '';
				_this.cmMedidaIndicadores = new Ext.grid.ColumnModel(
						[
								_this.smMedidaIndicadores,
								{
										header: 'CAR',
										dataIndex: 'idcriteriomedida',
										width: 80,
										sortable: true
								}, {
								header: "Denominaci&oacute;n",
								id: 'expandir',
								width: 250,
								dataIndex: 'denominacion',
								sortable: true,
								renderer: MostrarImagenTipoElemento
						}, {
								header: "Fecha de Inicio",
								dataIndex: 'fechainicio',
								width: 100,
								sortable: true
						}, {
								header: "Fecha de Fin",
								dataIndex: 'fechafin',
								width: 100,
								sortable: true
						}, {
								header: "Autor",
								dataIndex: 'nombreautor',
								width: 90,
								sortable: true
						}, {
								header: "Valor meta",
								dataIndex: 'valormeta',
								width: 80,
								sortable: true/*,
										editor: new Ext.form.NumberField({
												allowBlank: false
										})*/
						}, {
								header: "Valor real",
								dataIndex: 'valoreal',
								width: 80,
								sortable: true/*,
										editor: new Ext.form.NumberField({
												allowBlank: false
										})*/
						}, {
								header: "Evaluaci&oacute;n",
								dataIndex: 'evaluacion',
								width: 80,
								sortable: true,
								renderer: MostrarImagenEvaluacion
						}, {
								header: "Estado de cumplimiento",
								dataIndex: 'estadocumplimiento',
								width: 185,
								sortable: true,
								renderer: MostrarImagenEstadoCumplimiento
						}
						]);

				// create the grid
				_this.gridMedidaIndicadores = new Ext.grid.GridPanel({
						sm: _this.smMedidaIndicadores,
						height:200,
						split: true,
						title:'Criterio de medida',
						region    : 'south',
						store: _this.storeMedidaIndicadores,
						loadMask: {
								msg: 'Cargando criterios'
						},
						tbar:[/*_this.btnAdicionarCM, '-', _this.btnModificarCM, '-',*/
								_this.btnRelacionesCM, '-',_this.btnEliminarCM/*, '-', _this.btnVerCM, '-',
						  _this.btnGuardarCM, '-', _this.btnRegistroCM,  '-', _this.btnLimpiarFiltrosCM*/],
						cm:_this.cmMedidaIndicadores,
						bbar:[_this.paginadoMedida]
				});

				/***
				 * Componentes del panel inferior evaluacion del indicador
				 *
				 * ***/

				_this.storeEvaluacionIndicador = new Ext.data.Store({
						autoLoad:true,
						remoteSort: true,
						url: '/planificacion/pdo/plan/index.php/cmpgestionarobjetivos/cargarcriterioevalcriteriomedida',
						listeners: {
								beforeload: function (st) {
										st.baseParams.idobjetivo = _this.idobjetivo;
										st.baseParams.idindicadorobjcrit = _this.idindicadorobjcritseleccionado;
								},
								load: function (store, record, options) {

								}
						},
						reader: new Ext.data.JsonReader({
								id: 'idresultado_evaluativo',
								totalProperty: "total",
								root: "campos"
						}, [{
								name: 'idresultado_evaluativo'
						},{
								name: 'idcriterioevaluacionind'
						}, {
								name: 'resultado_evaluativo'
						}])

				});



				_this.paginadoEvaluacionIndicador = new Ext.PagingToolbar({
						id: "paginadoEvaluacionIndicador",
						pageSize: 1000,
						width:1060,
						store: _this.storeEvaluacionIndicador,
						displayInfo: true,
						listeners: {
								beforechange: function (paginado, evento) {
										// _this.pgactual = evento.start;
										// _this.start = evento.start;
								}
						}
				});

				//  Row selection para grid superior
				_this.smEvaluacionIndicador = new Ext.grid.CheckboxSelectionModel({
						// singleSelect: false
						sortable:true,
						listeners: {
								selectionchange: function () {
										_this.actualizarBarraHerramientasCEI();
								},
								rowselect: function (sm, indiceFila, record) {

								},
								rowdeselect: function (sm, indiceFila, record) {

								}
						}
				});


				//botones para la gestion de los Criterios de Medida
				_this.btnAdicionarEI = new Ext.Button({
						handler: function () {
								_this.GestionEvalIndicadores('adicionar');
						},
						disabled: false,
						iconCls: 'adicionar',
						tooltip: 'Adicionar evaluaci&oacute;n del indicador',
						// key: {
						// 		alt: true,
						// 		key: 'I'
						// },
						scope: this
				});
				_this.btnModificarEI = new Ext.Button({
						handler: function () {
								_this.GestionEvalIndicadores('modificar');
						},
						disabled: true,
						iconCls: 'modificar',
						tooltip: 'Modificar evaluaci&oacute;n del indicador',
						// key: {
						// 		alt: true,
						// 		key: 'M'
						// },
						scope: this
				});
				_this.btnEliminarEI = new Ext.Button({
						handler: function () {
								var sms='El criterio ha ';
								var sms_preg="¿Está seguro que desea eliminar el criterio seleccionado?";
								if(_this.arraycriterioevaluacionindicador.length>1){
										sms_preg="¿Está seguro que desea eliminar los criterios seleccionados?";
										sms='Los criterios han ';
								}
								mostrarMensaje(2, sms_preg, function (btnoprimido) {
										if (btnoprimido == 'ok') {
												_this.BarraProgreso.show("Eliminando criterios");
												Ext.Ajax.request({
														url: '/planificacion/pdo/plan/index.php/cmpgestionarobjetivos/eliminarCriterioEvaluacionIndicador',
														params: {
																arraycriterios: Ext.encode(_this.arraycriterioevaluacionindicador)
														},
														callback: function (options, success, response) {
																_this.BarraProgreso.hide();
																var responseData = Ext.decode(response.responseText);
																if (responseData.mensaje == 1) {
																		_this.storeEvaluacionIndicador.reload();
																		mostrarMensaje(1, sms+'sido eliminado satisfactoriamente.');
																}
														}
												});
										}
								});
						},
						disabled: true,
						iconCls: 'eliminar',
						tooltip: 'Eliminar evaluaci&oacute;n del indicador',
						// key: {
						// 		key: Ext.EventObject.DELETE
						// },
						scope: this
				});

				_this.btnVerEI = new Ext.Button({
						handler: function () {
								_this.GestionEvalIndicadores('detalles');
						},
						disabled: true,
						iconCls: 'Ver',
						tooltip: 'Ver datos del indicador',
						// key: {
						// 		ctrl: false,
						// 		alt: true,
						// 		key: 'D',
						// },
						scope: this
				});


				_this.btnLimpiarFiltrosEI = new Ext.Button({
						disabled: true,
						hidden:true,
						handler: function () {

						},
						iconCls: 'limpiar',
						tooltip: 'Limpiar filtro(s)',
						// key: {
						// 		alt: true,
						// 		key: 'L'
						// },
						scope: this
				});


				_this.actualizarBarraHerramientasCEI = function () {
						_this.arraycriterioevaluacionindicador = [];
						_this.btnModificarEI.disable();
						_this.btnEliminarEI.disable();
						_this.btnVerEI.disable();
						if(_this.smEvaluacionIndicador.hasSelection()){
								_this.btnEliminarEI.enable()
								var arrayrecords = _this.smEvaluacionIndicador.getSelections();
								var totalrecords = arrayrecords.length;
								if (totalrecords == 1) {
										_this.btnModificarEI.enable();
										_this.btnVerEI.enable();
								}
								for (var i = 0; i < totalrecords; i++) {
										var elementoseleccionado = {};
										elementoseleccionado = {
												idcriterioevaluacionind: arrayrecords[i].data.idcriterioevaluacionind,
												resultado_evaluativo: arrayrecords[i].data.resultado_evaluativo
										};
										_this.arraycriterioevaluacionindicador.push(elementoseleccionado);
								}
						}
				}

				// create the grid
				_this.gridEvaluacionIndicador = new Ext.grid.GridPanel({
						sm: _this.smEvaluacionIndicador,
						height:200,
						split: true,
						title:'Criterio de evaluaci&oacute;n del indicador',
						region    : 'south',
						store: _this.storeEvaluacionIndicador,
						loadMask: {
								msg: 'Cargando criterio de evaluación'
						},
						tbar:[_this.btnAdicionarEI, '-', _this.btnModificarEI, '-', _this.btnEliminarEI, '-', _this.btnVerEI, '-', _this.btnLimpiarFiltrosEI],

						columns: [
								_this.smEvaluacionIndicador,
								{
										hidden: true,
										hideable: false,
										dataIndex: 'idcriterioevaluacionind'
								}, {

										header: "Resultado evaluativo",
										dataIndex: 'resultado_evaluativo',
										width: 350,
										sortable: true
								}
						],
						bbar:[_this.paginadoEvaluacionIndicador]
				});



				// Tab Inferior
				_this.tabInferior = new Ext.TabPanel({
						region    : 'center',
						margins   : '3 3 3 0',
						activeTab : 0,
						// height: 500,
						defaults  : {
								autoScroll : true
						},
						items     : [_this.gridMedidaIndicadores,
							          _this.gridEvaluacionIndicador]
				});

				// Panel for the west
				_this.panelInferior = new Ext.Panel({
						title: "Criterios de medida del indicador",
						region:'south',
						split       : true,
						autoHeight: true,
						// minSize: 300,
						disabled:true,
            resizable:false,
						collapsible:true,
						// maxSize: 300,
						margins:'0 0 0 0',
						items:[_this.tabInferior]

				});


				_this.windowGestionarIndicadores = new Ext.Window({
						modal: true,
						//closeAction: 'hide',
						// constrain: true,
						plain    : true,
						layout   : 'border',
						title: 'Gestionar indicadores',
						width: 1080,
						height: 580,
						resizable:false,
						items: [_this.tabSuperior, _this.panelInferior],
						buttons: [                {
								text: 'Cerrar',
								iconCls: 'cerrar',
								tooltip: 'Cerrar ventana',
								handler: function () {
										_this.windowGestionarIndicadores.destroy();
								}
						}]
				});
				_this.windowGestionarIndicadores.show();
		}


    this.adicionarEvalObjetivo=function (accion) {

		    var readOnlyGI=false;
		    if(accion=='detalles'){
				    readOnlyGI=true;
		    }

		    _this.store_resultado_eval = new Ext.data.Store({
				    url: '/planificacion/pdo/plan/index.php/cmpgestionarobjetivos/cargarcriterioevaluacion',
				    autoLoad: true,
				    reader: new Ext.data.JsonReader(
						    {
								    id: 'id',
								    root: "data"
						    },
						    [{
								    name: 'id'
						    }, {
								    name: 'den'
						    }])
		    });

		    var tipo=(readOnlyGI)?Ext.form.TextField:Ext.form.ComboBox;

		    // Combo de seleccionar resultado evaluativo
		    _this.cb_resultado_eval =new tipo({
				    hiddenName:'',
				    fieldLabel: 'Resultado evaluativo',
				    store:_this.store_resultado_eval,
				    valueField:'id',
				    displayField:'den',
				    hiddenName: 'id',
				    typeAhead: true,
				    readOnly:readOnlyGI,
				    allowBlank:readOnlyGI,
				    labelWidth:200,
				    mode: 'local',
				    forceSelection: true,
				    triggerAction: 'all',
				    id:'cb_resultado_eval',
				    name:'cb_resultado_eval',
				    emptyText:'Seleccionar',
				    selectOnFocus:true,
				    width:100
		    });

		    _this.store_select_indicadores= new Ext.data.Store({
				    autoLoad:true,
				    remoteSort: true,
				    url: '/planificacion/pdo/plan/index.php/cmpgestionarobjetivos/cargarindicadores',
				    listeners: {
						    beforeload: function (st) {
								    st.baseParams.idobjetivo = _this.idobjetivo;
						    },
						    load: function (store, record, options) {

						    }
				    },
				    reader: new Ext.data.JsonReader({
						    id: 'idindicadorobjcrit',
						    totalProperty: "total",
						    root: "campos"
				    }, [{
						    name: 'idindicadorobjcrit'
				    }, {
						    name: 'idobjetivo'
				    }, {
						    name: 'idautor'
				    }, {
						    name: 'nombreautor'
				    }, {
						    name: 'denominacion'
				    }, {
						    name: 'descripcion'
				    }, {
						    name: 'idnomenclador'
				    }, {
						    name: 'evaluacion_indicador'
				    }])

		    });


		    _this.store_select_resultados_evaluativos= new Ext.data.Store({
				    url: '/planificacion/pdo/plan/index.php/cmpgestionarobjetivos/cargarcriterioevaluacion',
				    autoLoad: true,
				    reader: new Ext.data.JsonReader(
						    {
								    id: 'id',
								    root: "data"
						    },
						    [{
								    name: 'id'
						    }, {
								    name: 'den'
						    }])
		    });

		    // Combo de seleccionar resultado evaluativo
		    _this.cb__select_resultados_evaluativos =new Ext.form.ComboBox({
				    hiddenName:'',
				    fieldLabel: 'Seleccione...',
				    store:_this.store_select_resultados_evaluativos,
				    valueField:'id',
				    displayField:'den',
				    hiddenName: 'id',
				    typeAhead: true,
				    labelWidth:150,
				    mode: 'local',
				    forceSelection: true,
				    triggerAction: 'all',
				    id:'cb__select_resultados_evaluativos',
				    name:'cb__select_resultados_evaluativos',
				    emptyText:'Seleccionar',
				    selectOnFocus:true,
				    width:100,
				    listWidth:200,
				    listeners:{
						    select: function (c, r, i) {
								    console.log(_this.cb__select_resultados_evaluativos.getRawValue());
								    console.log(_this.cb__select_resultados_evaluativos.getValue());
								    _this.gridEditorAdicionarObjetivos.stopEditing();
								    var record_select=_this.smAObjetivos.getSelected();
								    record_select.set('idvalor',
										    _this.cb__select_resultados_evaluativos.getValue());
								    record_select.set('valor',_this.cb__select_resultados_evaluativos.getRawValue());
								    record_select.commit();
								    console.log(record_select);

						    }
				    }
		    });


		    // Combo de seleccionar resultado evaluativo
		    _this.cb__select_indicadores =new Ext.form.ComboBox({
				    hiddenName:'',
				    fieldLabel: 'Seleccione...',
				    store:_this.store_select_indicadores,
				    valueField:'idindicadorobjcrit',
				    displayField:'denominacion',
				    hiddenName: 'id',
				    typeAhead: true,
				    labelWidth:150,
				    mode: 'local',
				    forceSelection: true,
				    triggerAction: 'all',
				    id:'cb__select_indicadores',
				    name:'cb__select_indicadores',
				    emptyText:'Seleccionar',
				    selectOnFocus:true,
				    width:100,
				    listWidth:200,
				    listeners:{
						    select: function (c, r, i) {
								    console.log(_this.cb__select_indicadores.getRawValue());
								    console.log(_this.cb__select_indicadores.getValue());
								    _this.gridEditorAdicionarObjetivos.stopEditing();
								    var record_select=_this.smAObjetivos.getSelected();
								    record_select.set('idindicadorobjcrit',
										    _this.cb__select_indicadores.getValue());
								    record_select.set('indicador',_this.cb__select_indicadores.getRawValue());
								    record_select.commit();
								    console.log(record_select);

						    }
				    }
		    });

		    /***
		     * Signo criterio evaluacion de objetivo
		     * ***/
		    _this.store_signo_CEO = new Ext.data.SimpleStore({
				    fields: ['id', 'den'],
				    data: [
						    ['=', '='],
						    ['<>', '<>']
						    // ,
						    // ['<', '<'],
						    // ['<=', '<='],
						    // ['>=', '>=']
				    ]
		    });

		    // Combo de seleccionar signo creiterio evaluacion del objetivo
		    _this.cb__select_signo_CEO =new Ext.form.ComboBox({
				    hiddenName:'',
				    fieldLabel: 'Seleccione...',
				    store:_this.store_signo_CEO,
				    valueField:'id',
				    displayField:'den',
				    hiddenName: 'id',
				    typeAhead: true,
				    labelWidth:150,
				    mode: 'local',
				    forceSelection: true,
				    triggerAction: 'all',
				    id:'cb__select_signo_CEO',
				    name:'cb__select_signo_CEO',
				    emptyText:'Seleccionar',
				    selectOnFocus:true,
				    width:100
		    });

		    _this.storeAObjetivos = new Ext.data.SimpleStore({
				    fields: [{
				    		      name:'idformulaobjetivo',
						          name:'idindicadorobjcrit',
						          name:'indicador',
						          name:'signo',
						          name:'idvalor',
						          name:'valor',
						          name:'operador'
				    }],
				    data: []
		    });

		    // modo de seleccion del  grid listado de indicadores
		    _this.smAObjetivos = new Ext.grid.CheckboxSelectionModel({
				    singleSelect: false,
				    listeners: {
						    // rowselect: function (sm, indiceFila, record) {
						    //
						    // },
						    // rowdeselect: function (sm, indiceFila, record) {
						    // },
						    selectionchange:function(sm){
                  _this.btnEliminarRowCEO.setDisabled(sm.getSelections().length==0);
						    }
				    }
		    });

		    _this.btnAdicionarRowCEO = new Ext.Button({
				    handler: function () {
						    if(_this.validarGridFormulasObjetivos('adicionar')){
								    _this.gridEditorAdicionarObjetivos.stopEditing();
								    _this.storeAObjetivos.add(new Ext.data.Record({
										    idformulaobjetivo:'',
										    idindicadorobjcrit:'',
										    indicador:'',
										    signo:'',
										    valor:'',
										    operador:''
								    }));
								    _this.gridEditorAdicionarObjetivos.startEditing(0, 0);
						    }
				    },
				    disabled: false,
				    iconCls: 'adicionar',
				    tooltip: 'Adicionar objetivo',
				    key: {
				    		alt: true,
				    		key: 'I'
				    },
				    scope: this
		    });

		    _this.btnEliminarRowCEO = new Ext.Button({
				    handler: function () {
						    _this.gridEditorAdicionarObjetivos.stopEditing();
				    		if(_this.gridEditorAdicionarObjetivos.getSelectionModel().getSelections().length>0){
				    				var recordDelete=this.gridEditorAdicionarObjetivos.getSelectionModel().getSelections();
								    for (var i=0; i < recordDelete.length; i++){
										    if(recordDelete[i].data.idformulaobjetivo!=''){
												    var elemento={};
												    elemento = {
														    idformulaobjetivo: recordDelete[i].data.idformulaobjetivo
												    };
												    _this.arrayformulaseliminadasCEO.push(elemento);
										    }
										    _this.storeAObjetivos.remove(recordDelete[i]);
								    }

						    }
						    _this.gridEditorAdicionarObjetivos.startEditing(0, 0);
						    _this.gridEditorAdicionarObjetivos.getSelectionModel().clearSelections();
				    },
				    disabled: true,
				    iconCls: 'eliminar',
				    tooltip: 'Eliminar objetivo',
				    key: {
						    key: Ext.EventObject.DELETE
				    },
				    scope: this
		    });

		    //grid editor para listado de indicadores
		    _this.gridEditorAdicionarObjetivos = new Ext.grid.EditorGridPanel({
				    store: _this.storeAObjetivos,
				    stripeRows: true,
				    title:"Listado de indicadores",
				    height: 300,
				    sm: _this.smAObjetivos,
				    clicksToEdit: 1,
				    margins: '3 3 3 3',
				    // loadMask: {
						 //    msg: 'Cargando relaciones...'
				    // },
				    // listeners: {
						 //    'beforeedit': function (e) {
								//     if (e.record.data.origen != 7) {
								// 		    e.cancel = true;
								//     }
						 //    },
						 //    'beforerender': function (e) {
								//
						 //    }
				    // },
				    columns: [_this.smAObjetivos,
						    {
								    hidden: true,
								    hideable: false,
								    dataIndex: 'idformulaobjetivo'
						    },{
								    hidden: true,
								    hideable: false,
								    dataIndex: 'idindicadorobjcrit'
						    },{
								    header: "Indicador(es)",
								    dataIndex: 'indicador',
								    width: 90,
								    sortable: true,
								    editor: (readOnlyGI)?'':_this.cb__select_indicadores
						    },{
								    header: "Signo",
								    dataIndex: 'signo',
								    width: 90,
								    sortable: true,
								    editor:(readOnlyGI)?'': _this.cb__select_signo_CEO
										 //    new Ext.form.TextField({
										 //          allowBlank: false,
										 //          maskRe :/^[=]+|[<]+|[>]+|[<=]+|[>=]+$/,
										 //          regex: /^[=]+|[<]+|[>]+|[<=]+|[>=]+$/
								    // })
						    },{
								    header: "Valor",
								    dataIndex: 'valor',
								    width: 90,
								    sortable: true,
								    editor:(readOnlyGI)?'': _this.cb__select_resultados_evaluativos
						    },{
								    header: "Operador",
								    dataIndex: 'operador',
								    width: 90,
								    sortable: true,
								    editor:(readOnlyGI)?'': new Ext.form.TextField({
										    allowBlank: false,
										    maskRe :/^[y]+|[o]+|[Y]+|[O]+$/,
										    regex: /^[y]+|[o]+|[Y]+|[O]+$/
								    })
						    }
				    ],
				    //bbar: _this.pgrelaciones,
				    tbar: (readOnlyGI)?'':[_this.btnAdicionarRowCEO,'-',_this.btnEliminarRowCEO]
		    });

		    // Form de para adicionar objetivos
		    _this.fpAdicionarObjetivo  = new Ext.FormPanel({
				    frame: true,
				    //	width: 480,
				    bodyStyle: 'padding:0 0 0 0;',
				    labelAlign: 'left',
				    items: [
						    _this.cb_resultado_eval,
						    _this.gridEditorAdicionarObjetivos
				    ]});

		    _this.btnCancelarAdicionarObjetivo = new Ext.Button({
				    iconCls: 'cancelar',
				    text: 'Cancelar',
				    tooltip: 'Cerrar ventana sin guardar los datos',
				    handler: function () {
						    //		_this.fpTraspasoPlan.getForm().reset();
						    _this.windowAdicionarObjetivos.destroy();
				    }
		    });

		    _this.btnCerrarAdicionarObjetivo = new Ext.Button({
				    iconCls: 'cerrar',
				    text: 'Cerrar',
				    hidden:true,
				    tooltip: 'Cerrar ventana',
				    handler: function () {
						    //		_this.fpTraspasoPlan.getForm().reset();
						    _this.windowAdicionarObjetivos.destroy();
				    }
		    });

		    _this.btnAplicarAdicionarObjetivo= new Ext.Button({
				    iconCls: 'aplicar',
				    text: 'Aplicar',
				    disabled: true,
				    tooltip: 'Guardar datos y limpiar campos',
				    handler: function () {
                 _this.GuardarCE_Objetivo(accion, 'aplicar');
				    }
		    });

        _this.btnAceptarAdicionarObjetivo= new Ext.Button({
				    iconCls: 'aceptar',
				    text: 'Aceptar',
				    tooltip: 'Guardar datos y cerrar ventana',
				    handler: function () {
						    _this.GuardarCE_Objetivo(accion, 'aceptar');
				    }
		    });

		    var title='Adicionar criterio de evaluaci&oacute;n del objetivo';
		    if(accion=='modificar'){
				    title='Modificar criterio de evaluaci&oacute;n del objetivo';
				    _this.BarraProgreso.show("Obteniendo información");
				    Ext.Ajax.request({
						    url: '/planificacion/pdo/plan/index.php/cmpgestionarobjetivos/obtenerinformacionCriterioEvaluacionObjetivo',
						    params: {
								    idcriterioevaluacionobj: _this.arraycriterioevaluacionobjetivo[0].idcriterioevaluacionobj,
						    },
						    callback: function (options, success, response) {
								    _this.BarraProgreso.hide();
								    var responseData = Ext.decode(response.responseText);
								    console.log(responseData.informacion)
								    if (responseData.informacion) {
										    for (var i=0; i < responseData.informacion.length; i++){
												    _this.storeAObjetivos.add(new Ext.data.Record({
														    idformulaobjetivo:responseData.informacion[i].idformulaobjetivo,
														    idindicadorobjcrit:responseData.informacion[i].idindicadorobjcrit,
														    indicador:responseData.informacion[i].indicador,
														    signo:responseData.informacion[i].signo,
														    valor:responseData.informacion[i].valor,
														    idvalor:responseData.informacion[i].idvalor,
														    operador:responseData.informacion[i].operador
												    }));
										    }
										    if(responseData.informacion.length>0){
												    _this.cb_resultado_eval.setValue(responseData.informacion[0].idnomencladorcriterioeval);
												    _this.cb_resultado_eval.setRawValue(responseData.informacion[0].resultado_evaluativo);
										    }

								    }
						    }
				    });

		    }

		    if(accion=='detalles'){
				    title='Ver datelles del criterio de evaluaci&oacute;n del objetivo';
				    _this.BarraProgreso.show("Obteniendo información");
				    _this.btnCancelarAdicionarObjetivo.setVisible(false);
				    _this.btnAplicarAdicionarObjetivo.setVisible(false);
				    _this.btnAceptarAdicionarObjetivo.setVisible(false);
				    _this.btnCerrarAdicionarObjetivo.setVisible(true);
				    Ext.Ajax.request({
						    url: '/planificacion/pdo/plan/index.php/cmpgestionarobjetivos/obtenerinformacionCriterioEvaluacionObjetivo',
						    params: {
								    idcriterioevaluacionobj: _this.arraycriterioevaluacionobjetivo[0].idcriterioevaluacionobj,
						    },
						    callback: function (options, success, response) {
								    _this.BarraProgreso.hide();
								    var responseData = Ext.decode(response.responseText);
								    console.log(responseData.informacion)
								    if (responseData.informacion) {
										    for (var i=0; i < responseData.informacion.length; i++){
												    _this.storeAObjetivos.add(new Ext.data.Record({
														    idformulaobjetivo:responseData.informacion[i].idformulaobjetivo,
														    idindicadorobjcrit:responseData.informacion[i].idindicadorobjcrit,
														    indicador:responseData.informacion[i].indicador,
														    signo:responseData.informacion[i].signo,
														    valor:responseData.informacion[i].valor,
														    operador:responseData.informacion[i].operador
												    }));
										    }

										    if(responseData.informacion.length>0){
												    _this.cb_resultado_eval.setValue(responseData.informacion[0].idnomencladorcriterioeval);
												    _this.cb_resultado_eval.setRawValue(responseData.informacion[0].resultado_evaluativo);
										    }

								    }
						    }
				    });
		    }

		    _this.windowAdicionarObjetivos = new Ext.Window({
				    modal: true,
				    //closeAction: 'hide',
				    // constrain: true,
				    plain    : true,
				    layout   : 'fit',
				    title: title,
				    width: 530,
				    height: 380,
				    resizable:false,
				    items: [_this.fpAdicionarObjetivo],
				    buttons: [_this.btnCancelarAdicionarObjetivo,_this.btnCerrarAdicionarObjetivo,
						    _this.btnAplicarAdicionarObjetivo,_this.btnAceptarAdicionarObjetivo]
		    });
		    _this.windowAdicionarObjetivos.show();

    }

		this.GestionEvalIndicadores=function (accion) {
				_this.arrayformulaseliminadasCEI=[];
				var readOnlyGI=false;
				if(accion=='detalles'){
						readOnlyGI=true;
				}

				_this.store_resultado_eval_criterio_medida = new Ext.data.Store({
						url: '/planificacion/pdo/plan/index.php/cmpgestionarobjetivos/cargarcriterioevaluacion',
						autoLoad: true,
						reader: new Ext.data.JsonReader(
								{
										id: 'id',
										root: "data"
								},
								[{
										name: 'id'
								}, {
										name: 'den'
								}])
				});

				var tipo=(readOnlyGI)?Ext.form.TextField:Ext.form.ComboBox;
				// Combo de seleccionar resultado evaluativo
				_this.cb_resultado_eval_criterio_medida =new tipo({
						hiddenName:'',
						fieldLabel: 'Resultado evaluativo',
						store:_this.store_resultado_eval_criterio_medida,
						valueField:'id',
						displayField:'den',
						readOnly:readOnlyGI,
						hiddenName: 'id',
						allowBlank:readOnlyGI,
						labelWidth:200,
						editable:false,
						// forceSelection: true,
						triggerAction: 'all',
						id:'cb_resultado_eval',
						name:'cb_resultado_eval',
						emptyText:'Seleccionar',
						width:100,
						listeners:{
								select: function (c, r, i) {
										if(_this.storeListadoEvalCriterioMedida.getTotalCount()==0){
												_this.btnAceptarAdicionarEvalCriterioMedida.disable();
										}
								}
						}
				});

				_this.store_select_indicadores_eval = new Ext.data.Store({
						autoLoad:true,
						url: '/planificacion/pdo/plan/index.php/cmpgestionarobjetivos/cargarcriteriosindicadores',
						reader: new Ext.data.JsonReader({
								id: 'idcriteriomedida',
								totalProperty: "total",
								root: "campos"
						}, [{
								name: 'idindicadorcriteriomedida'
						},{
								name: 'idcriteriomedida'
						}, {
								name: 'denominacion'
						}, {
								name: 'valormeta'
						}, {
								name: 'valoreal'
						}, {
								name: 'fechainicio'
						}, {
								name: 'fechafin'
						}, {
								name: 'estadocumplimiento'
						}, {
								name: 'nombreautor'
						}, {
								name: 'subordinado'
						}, {
								name: 'superior'
						}, {
								name: 'modificar'
						}, {
								name: 'eliminar'
						}, {
								name: 'idautor'
						}, {
								name: 'evaluacion'
						}]),
						listeners: {
								beforeload: function (st) {
										st.baseParams.idobjetivo = _this.idobjetivo;
										st.baseParams.idindicadorobjcrit = _this.idindicadorobjcritseleccionado;
										st.baseParams.relacionado_indicador = 1;
										},
								load: function (store, record, options) {
								}
						}
				});

				// Combo de seleccionar resultado evaluativo
				_this.cb_select_criterios_indicadores_eval =new Ext.form.ComboBox({
						hiddenName:'',
						fieldLabel: 'Seleccione...',
						store:_this.store_select_indicadores_eval,
						valueField:'idcriteriomedida',
						displayField:'denominacion',
						hiddenName: 'idcriteriomedida',
						typeAhead: true,
						readOnly:readOnlyGI,
						labelWidth:150,
						mode: 'remote',
						forceSelection: true,
						triggerAction: 'all',
						id:'cb_select_criterios_indicadores_eval',
						name:'cb_select_criterios_indicadores_eval',
						emptyText:'Seleccionar',
						selectOnFocus:true,
						listWidth:200,
						width:100,
						listeners:{
								select: function (c, r, i) {
										console.log(_this.cb_select_criterios_indicadores_eval.getRawValue());
										console.log(_this.cb_select_criterios_indicadores_eval.getValue());
										_this.gridEditorAdicionarEvalCriterioMedida.stopEditing();
										var record_select=_this.smAdicionarEvalCriterioMedida.getSelected();
										record_select.set('idcriterioevalindicador',
												_this.cb_select_criterios_indicadores_eval.getValue());
										record_select.set('indicador',_this.cb_select_criterios_indicadores_eval.getRawValue());
										record_select.commit();
										console.log(record_select);
								}
						}
				});

				/***
				 * Signo criterio evaluacion de indicador
				 * ***/
				_this.store_signo_CEI = new Ext.data.SimpleStore({
						fields: ['id', 'den'],
						data: [
								['=', '='],
								['>', '>'],
								['<', '<'],
								['<=', '<='],
								['>=', '>=']
						]
				});

				// Combo de seleccionar signo creiterio evaluacion del indicador
				_this.cb__select_signo_CEI =new Ext.form.ComboBox({
						hiddenName:'',
						fieldLabel: 'Seleccione...',
						store:_this.store_signo_CEI,
						valueField:'id',
						displayField:'den',
						hiddenName: 'id',
						typeAhead: true,
						labelWidth:150,
						mode: 'local',
						forceSelection: true,
						triggerAction: 'all',
						id:'cb__select_signo_CEI',
						name:'cb__select_signo_CEI',
						emptyText:'Seleccionar',
						selectOnFocus:true,
						width:100
				});

				_this.storeListadoEvalCriterioMedida = new Ext.data.SimpleStore({
						fields: [{name:'idformulaindicador', name:'idcriterioevalindicador',
								name:'indicador', name:'signo', name:'valor', name:'operador'}],
						data: []
				});

				// modo de seleccion del  grid listado de indicadores
				_this.smAdicionarEvalCriterioMedida = new Ext.grid.CheckboxSelectionModel({
						singleSelect: false,
						listeners: {
								// rowselect: function (sm, indiceFila, record) {
								//
								// },
								// rowdeselect: function (sm, indiceFila, record) {
								// },
								selectionchange:function(sm){
										_this.btnEliminarRowEvalCriterioMedida.setDisabled(sm.getSelections().length==0);
								}
						}
				});

				_this.btnAdicionarRowEvalCriterioMedida = new Ext.Button({
						handler: function () {
								if(_this.validarGridFormulasCEI('adicionar')){
										_this.gridEditorAdicionarEvalCriterioMedida.stopEditing();
										_this.storeListadoEvalCriterioMedida.add(new Ext.data.Record({
												idformulaindicador:'',
												idcriterioevalindicador:'',
												indicador:'',
												signo:'',
												valor:'',
												operador:''
										}));
										_this.gridEditorAdicionarEvalCriterioMedida.startEditing(0, 0);
										if(_this.cb_resultado_eval_criterio_medida.getValue()!='' && _this.storeListadoEvalCriterioMedida.getTotalCount()>0)
												_this.btnAceptarAdicionarEvalCriterioMedida.enable();
										else
												_this.btnAceptarAdicionarEvalCriterioMedida.disable();
								}
						},
						disabled: false,
						hidden:readOnlyGI,
						iconCls: 'adicionar',
						tooltip: 'Adicionar fórmula',
						key: {
								alt: true,
								key: 'I'
						},
						scope: this
				});

				_this.btnEliminarRowEvalCriterioMedida = new Ext.Button({
						handler: function () {
										_this.gridEditorAdicionarEvalCriterioMedida.stopEditing();
										if(_this.gridEditorAdicionarEvalCriterioMedida.getSelectionModel().getSelections().length>0){
												var recordDelete=_this.gridEditorAdicionarEvalCriterioMedida.getSelectionModel().getSelections();
												for (var i=0; i < recordDelete.length; i++){
														if(recordDelete[i].data.idformulaindicador!=''){
																var elemento={};
																		elemento = {
																				idformulaindicador: recordDelete[i].data.idformulaindicador
																		};
																_this.arrayformulaseliminadasCEI.push(elemento);
														}
														_this.storeListadoEvalCriterioMedida.remove(recordDelete[i]);
												}

										}
										_this.gridEditorAdicionarEvalCriterioMedida.startEditing(0, 0);
										_this.gridEditorAdicionarEvalCriterioMedida.getSelectionModel().clearSelections();

										if(_this.cb_resultado_eval_criterio_medida.getValue()!='' && _this.storeListadoEvalCriterioMedida.getTotalCount()>0)
												_this.btnAceptarAdicionarEvalCriterioMedida.enable();
										else
												_this.btnAceptarAdicionarEvalCriterioMedida.disable();
						},
						disabled: true,
						hidden:readOnlyGI,
						iconCls: 'eliminar',
						tooltip: 'Eliminar fórmula',
						key: {
								key: Ext.EventObject.DELETE
						},
						scope: this
				});

				//grid editor para listado de indicadores
				_this.gridEditorAdicionarEvalCriterioMedida = new Ext.grid.EditorGridPanel({
						store: _this.storeListadoEvalCriterioMedida,
						stripeRows: true,
						title:"Listado de Criterios de Medida",
						height: 300,
						sm: _this.smAdicionarEvalCriterioMedida,
						clicksToEdit: 1,
						margins: '3 3 3 3',
						// loadMask: {
						//    msg: 'Cargando relaciones...'
						// },
						// listeners: {
						//    'beforeedit': function (e) {
						//     if (e.record.data.origen != 7) {
						// 		    e.cancel = true;
						//     }
						//    },
						//    'beforerender': function (e) {
						//
						//    }
						// },
						columns: [_this.smAdicionarEvalCriterioMedida,
								{
										hidden: true,
										hideable: false,
										dataIndex: 'idformulaindicador'
								},
								{
										hidden: true,
										hideable: false,
										dataIndex: 'idcriterioevalindicador'
								},
								{
										header: "Indicador(es)",
										dataIndex: 'indicador',
										width: 200,
										sortable: true,
										editor: (readOnlyGI)?'':_this.cb_select_criterios_indicadores_eval
								},{
										header: "Signo",
										dataIndex: 'signo',
										width: 90,
										sortable: true,
										editor: (readOnlyGI)?'':_this.cb__select_signo_CEI
										// 		new Ext.form.TextField({
										// 		allowBlank: false,
										// 		maskRe :/^[=]+|[<]+|[>]+|[<=]+|[>=]+$/,
										// 		regex: /^[=]+|[<]+|[>]+|[<=]+|[>=]+$/
										// })
								},{
										header: "Valor",
										dataIndex: 'valor',
										width: 90,
										sortable: true,
										editor:(readOnlyGI)?'': new Ext.form.TextField({
												allowBlank: false
										})
								},{
										header: "Operador",
										dataIndex: 'operador',
										width: 90,
										sortable: true,
										editor: (readOnlyGI)?'':new Ext.form.TextField({
												allowBlank: false,
												maskRe :/^[y]+|[o]+|[Y]+|[O]+$/,
												regex: /^[y]+|[o]+|[Y]+|[O]+$/
										})
								}
						],
						//bbar: _this.pgrelaciones,
						tbar:(readOnlyGI)?'':[_this.btnAdicionarRowEvalCriterioMedida,'-',_this.btnEliminarRowEvalCriterioMedida]
				});

				// Form de para adicionar Eval Criterio Medida
				_this.fpAdicionarEvalCriterioMedida  = new Ext.FormPanel({
						frame: true,
						//	width: 480,
						bodyStyle: 'padding:0 0 0 0;',
						labelAlign: 'left',
						items: [
								_this.cb_resultado_eval_criterio_medida,
								_this.gridEditorAdicionarEvalCriterioMedida
						]});

				_this.btnCancelarAdicionarEvalCriterioMedida = new Ext.Button({
						iconCls: 'cancelar',
						text: 'Cancelar',
						tooltip: 'Cerrar ventana sin guardar los datos',
						handler: function () {
								//		_this.fpTraspasoPlan.getForm().reset();
								_this.windowAdicionarEvalCriterioMedida.destroy();
						}
				});

				_this.btnCerrarAdicionarEvalCriterioMedida = new Ext.Button({
						iconCls: 'cerrar',
						text: 'Cerrar',
						hidden:true,
						tooltip: 'Cerrar ventana',
						handler: function () {
								//		_this.fpTraspasoPlan.getForm().reset();
								_this.windowAdicionarEvalCriterioMedida.destroy();
						}
				});

				_this.btnAplicarAdicionarEvalCriterioMedida= new Ext.Button({
						iconCls: 'aplicar',
						text: 'Aplicar',
						disabled: true,
						tooltip: 'Guardar datos y limpiar campos',
						handler: function () {
								_this.GuardarCE_CriterioMedida(accion, 'aplicar');
						}
				});

				_this.btnAceptarAdicionarEvalCriterioMedida= new Ext.Button({
						iconCls: 'aceptar',
						text: 'Aceptar',
						tooltip: 'Guardar datos y cerrar ventana',
						handler: function () {
								_this.GuardarCE_CriterioMedida(accion, 'aceptar')
						}
				});

				var title='Adicionar criterio de evaluaci&oacute;n del criterio de medida';
				if(accion=='modificar'){
						title='Modificar criterio de evaluaci&oacute;n del criterio de medida';
						_this.BarraProgreso.show("Obteniendo información");
						Ext.Ajax.request({
								url: '/planificacion/pdo/plan/index.php/cmpgestionarobjetivos/obtenerinformacionCriterioEvaluacionIndicador',
								params: {
										idcriterioevaluacionind: _this.arraycriterioevaluacionindicador[0].idcriterioevaluacionind,
								},
								callback: function (options, success, response) {
										_this.BarraProgreso.hide();
										var responseData = Ext.decode(response.responseText);
										console.log(responseData.informacion)
										if (responseData.informacion) {
												for (var i=0; i < responseData.informacion.length; i++){
														_this.storeListadoEvalCriterioMedida.add(new Ext.data.Record({
																idformulaindicador:responseData.informacion[i].idformulaindicador,
																idcriterioevalindicador:responseData.informacion[i].idcriteriomedida,
																indicador:responseData.informacion[i].criteriomedida,
																signo:responseData.informacion[i].signo,
																valor:responseData.informacion[i].valor,
																operador:responseData.informacion[i].operador
														}));
												}
												if(responseData.informacion.length>0){
														_this.cb_resultado_eval_criterio_medida.setValue(responseData.informacion[0].idnomencladorcriterioeval);
														_this.cb_resultado_eval_criterio_medida.setRawValue(responseData.informacion[0].resultado_evaluativo);
												}

										}
								}
						});
				}

				if(accion=='detalles'){
						title='Ver datelles del criterio de evaluaci&oacute;n del criterio de medida';
						_this.BarraProgreso.show("Obteniendo información");
						_this.btnCancelarAdicionarEvalCriterioMedida.setVisible(false);
						_this.btnAplicarAdicionarEvalCriterioMedida.setVisible(false);
						_this.btnAceptarAdicionarEvalCriterioMedida.setVisible(false);
						_this.btnCerrarAdicionarEvalCriterioMedida.setVisible(true);
						Ext.Ajax.request({
								url: '/planificacion/pdo/plan/index.php/cmpgestionarobjetivos/obtenerinformacionCriterioEvaluacionIndicador',
								params: {
										idcriterioevaluacionind: _this.arraycriterioevaluacionindicador[0].idcriterioevaluacionind
								},
								callback: function (options, success, response) {
										_this.BarraProgreso.hide();
										var responseData = Ext.decode(response.responseText);
										console.log(responseData.informacion)
										if (responseData.informacion) {
												for (var i=0; i < responseData.informacion.length; i++){
														_this.storeListadoEvalCriterioMedida.add(new Ext.data.Record({
																idformulaindicador:responseData.informacion[i].idformulaindicador,
																idcriterioevalindicador:responseData.informacion[i].idcriteriomedida,
																indicador:responseData.informacion[i].criteriomedida,
																signo:responseData.informacion[i].signo,
																valor:responseData.informacion[i].valor,
																operador:responseData.informacion[i].operador
														}));
												}
												if(responseData.informacion.length>0){
														_this.cb_resultado_eval_criterio_medida.setValue(responseData.informacion[0].idnomencladorcriterioeval);
														_this.cb_resultado_eval_criterio_medida.setRawValue(responseData.informacion[0].resultado_evaluativo);
												}

										}
								}
						});
				}


				_this.windowAdicionarEvalCriterioMedida = new Ext.Window({
						modal: true,
						//closeAction: 'hide',
						// constrain: true,
						plain    : true,
						layout   : 'fit',
						title: title,
						width: 530,
						height: 380,
						resizable:false,
						items: [_this.fpAdicionarEvalCriterioMedida],
						buttons: [_this.btnCancelarAdicionarEvalCriterioMedida,_this.btnCerrarAdicionarEvalCriterioMedida, _this.btnAplicarAdicionarEvalCriterioMedida,_this.btnAceptarAdicionarEvalCriterioMedida]
				});
				_this.windowAdicionarEvalCriterioMedida.show();

		}

		this.validarGridFormulasObjetivos=function (accion) {
				var msg="";
				if(accion=='adicionar'){
						var elementos=_this.storeAObjetivos.data.items;
						for (var i = 0; i < elementos.length; i++) {
								if(elementos[i].data.idindicadorobjcrit=='' || elementos[i].data.signo=='' || elementos[i].data.valor==''){
										msg='Debe llenar los campos obligatorios (Indicador, signo y valor).';
										mostrarMensaje(6, msg);
										return false;
								}
						}
				}else if(accion=='guardar'){
						if(_this.storeAObjetivos.data.items==0){
								msg='Debe tener al menos una fórmula para evaluar.';
								mostrarMensaje(6, msg);
								return false;
						}else{
								var elementos=_this.storeAObjetivos.data.items;
								for (var i = 0; i < elementos.length; i++) {
										if(elementos[i].data.idindicadorobjcrit=='' || elementos[i].data.signo=='' || elementos[i].data.valor==''){
												msg='Debe llenar los campos obligatorios (Indicador, signo y valor).';
												mostrarMensaje(6, msg);
												return false;
										}
								}
						}
				}
				return true;
		}


		this.GuardarCE_Objetivo=function(accion, respuesta){

				if(_this.validarGridFormulasObjetivos('guardar')){
						var url = 'adicionarEvaluacionObjetivo';
						var postaccion='adicionado';
						var idcriterioevaluacionobj=0;
						if(accion=='modificar'){
								url = 'modificarEvaluacionObjetivo';
								postaccion='modificado';
								idcriterioevaluacionobj=_this.arraycriterioevaluacionobjetivo[0].idcriterioevaluacionobj;
						}
						var waitMsg = 'Guardando datos del criterio de evaluación';
						console.log(_this.storeAObjetivos.data.items);
						var elementos=_this.storeAObjetivos.data.items;
						_this.arrayformulasEvaluacionObjetivo = [];
						for (var i = 0; i < elementos.length; i++) {
								var item = {};
								item = {
										idformulaobjetivo: elementos[i].data.idformulaobjetivo,
										idindicadorobjcrit: elementos[i].data.idindicadorobjcrit,
										indicador: elementos[i].data.indicador,
										signo: elementos[i].data.signo,
										idvalor: elementos[i].data.idvalor,
										valor: elementos[i].data.valor,
										operador: elementos[i].data.operador
								};
								_this.arrayformulasEvaluacionObjetivo.push(item);
						}
						_this.BarraProgreso.show(waitMsg);
						_this.fpAdicionarObjetivo.getForm().submit({
								url: '/planificacion/pdo/plan/index.php/cmpgestionarobjetivos/' + url,
								params: {
										idobjetivo: _this.idobjetivo,
										idnomencladorcriterioeval: _this.cb_resultado_eval.getValue(),
										idcriterioevaluacionobj:idcriterioevaluacionobj,
										formulaseliminar:Ext.encode(_this.arrayformulaseliminadasCEO),
										arrayformulas:Ext.encode(_this.arrayformulasEvaluacionObjetivo)
								},
								failure: function (form, action) {
										if(respuesta=='aceptar'){
												_this.windowAdicionarObjetivos.destroy();
										}else{
												if(accion=='adicionar'){
														_this.storeAObjetivos.removeAll();
														_this.fpAdicionarObjetivo.getForm().reset();
												}
										}
										_this.arrayformulaseliminadasCEO=[];
										_this.BarraProgreso.hide();
										if (action.result.mensaje == 1) {
												_this.storeEvalObjetivo.reload();
												mostrarMensaje(1, 'El indicador ha sido ' + postaccion + ' satisfactoriamente.');
										}
								}
						});
				}

		}


		this.validarGridFormulasCEI=function (accion) {
				var msg="";
				if(accion=='adicionar'){
						var elementos=_this.storeListadoEvalCriterioMedida.data.items;
						_this.arraycriterioevalcriteriosmedidaindicador = [];
						for (var i = 0; i < elementos.length; i++) {
								if(elementos[i].data.idcriterioevalindicador=='' || elementos[i].data.signo=='' || elementos[i].data.valor==''){
										msg='Debe llenar los campos obligatorios (Indicador, signo y valor).';
										mostrarMensaje(6, msg);
										return false;
								}
						}
				}else if(accion=='guardar'){
						if(_this.storeListadoEvalCriterioMedida.data.items==0){
								msg='Debe tener al menos una fórmula para evaluar.';
								mostrarMensaje(6, msg);
								return false;
						}else{
								var elementos=_this.storeListadoEvalCriterioMedida.data.items;
								_this.arraycriterioevalcriteriosmedidaindicador = [];
								for (var i = 0; i < elementos.length; i++) {
										if(elementos[i].data.idcriterioevalindicador=='' || elementos[i].data.signo=='' || elementos[i].data.valor==''){
												msg='Debe llenar los campos obligatorios (Indicador, signo y valor).';
												mostrarMensaje(6, msg);
												return false;
										}
								}
						}
				}
				return true;
		}

		this.GuardarCE_CriterioMedida=function(accion, respuesta){

				if(_this.validarGridFormulasCEI('guardar')){
						var url = 'adicionarEvaluacionCriterioMedida';
						var postaccion='adicionado';
						var idcriterioevaluacionind=0;
						if(accion=='modificar'){
								url = 'modificarEvaluacionCriterioMedida';
								postaccion='modificado';
								idcriterioevaluacionind=_this.arraycriterioevaluacionindicador[0].idcriterioevaluacionind;
						}
						var waitMsg = 'Guardando datos del criterio de evaluación';
						console.log(_this.storeListadoEvalCriterioMedida.data.items);
						var elementos=_this.storeListadoEvalCriterioMedida.data.items;
						_this.arraycriterioevalcriteriosmedidaindicador = [];
						for (var i = 0; i < elementos.length; i++) {
								var item = {};
								item = {
										idformulaindicador: elementos[i].data.idformulaindicador,
										idcriterioevalindicador: elementos[i].data.idcriterioevalindicador,
										indicador: elementos[i].data.indicador,
										signo: elementos[i].data.signo,
										valor: elementos[i].data.valor,
										operador: elementos[i].data.operador
								};
								_this.arraycriterioevalcriteriosmedidaindicador.push(item);
						}
						_this.BarraProgreso.show(waitMsg);
						_this.fpAdicionarEvalCriterioMedida.getForm().submit({
								url: '/planificacion/pdo/plan/index.php/cmpgestionarobjetivos/' + url,
								params: {
										idobjetivo: _this.idobjetivo,
										idnomencladorcriterioeval: _this.cb_resultado_eval_criterio_medida.getValue(),
										idcriterioevaluacionind:idcriterioevaluacionind,
										formulaseliminar:Ext.encode(_this.arrayformulaseliminadasCEI),
										idindicadorobjcrit: _this.idindicadorobjcritseleccionado,
										arrayformulas:Ext.encode(_this.arraycriterioevalcriteriosmedidaindicador)
								},
								failure: function (form, action) {
										if(respuesta=='aceptar'){
												_this.windowAdicionarEvalCriterioMedida.destroy();
										}else{
												if(accion=='adicionar'){
														_this.storeListadoEvalCriterioMedida.removeAll();
														_this.fpAdicionarEvalCriterioMedida.getForm().reset();
												}
										}
										_this.arrayformulaseliminadasCEI=[];
										_this.BarraProgreso.hide();
										if (action.result.mensaje == 1) {
												_this.storeIndicadores.reload();
												mostrarMensaje(1, 'El indicador ha sido ' + postaccion + ' satisfactoriamente.');
										}
								}
						});
				}

		}

		function MostrarImagenEvaluacion(val) {
				if (val == 1) {
						color = "sipac-verde";
						return '<span class="icondistra-aprobar sipac-verde"></span>';
				} else {
						color = "sipac-roja";
						return '<span class="icondistra-desaprobar sipac-roja"></span>';
				}
		}

		//funcion para mostrar el icono "tipo de elemento"
		function MostrarImagenTipoElemento(valor) {
				return '<span class="icondistra-unidadmedida sipac-azul">' + ' ' + valor + '</span>';
		}

		//funcion para mostrar el icono "estado de cumplimiento"
		function MostrarImagenEstadoCumplimiento(val) {
				if (val) {

						val0 = val;
						val1 = val0.split("(");
						val2 = val1[1].split("%");
						val3 = val2[0] * 1;
						if (val3 <= 0 || val3 >= 95) {
								return '<span class="' + color + ' icondistra-bandera ">' + ' ' + val + '</span>';
						}
						if (val3 > 0 && val3 < 95) {
								return '<span class="icondistra-bandera sipac-amarilla">' + ' ' + val + '</span>';
						}
						/* if (val3 >= 95) {
						 return '<span class="icondistra-bandera sipac-verde">' + ' ' + val + '</span>';
						 }*/
				}
		}
}