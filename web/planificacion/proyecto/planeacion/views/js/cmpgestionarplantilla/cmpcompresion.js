Utilidades.Cmp.Cmpcompresion = function(opcionesConfig) {

    var _this = this;
		this.BarraProgreso = new BarraEstado();
		this.elementosseleccionados = [];
		this.elementosdatosgeneralesproyecto = [];
		this.ObjValidaciones = new Utilidades.Cmp.Cmpvalidaciones();
		this.crearWinCompresion = function(obj_plantilla, parametros){
				_this.valorescargados=false;
				_this.escala_tiempo='1';
				parametros[0]['escala_tiempo']=_this.escala_tiempo;

				/***
				 * Store del grid
				 *
				 * ***/

				_this.store=new Ext.data.Store({
						url: '/planificacion/proyecto/planeacion/index.php/cmpgestionarplantilla/obtenerInfoComprimirProyecto',
						autoLoad: true,
						reader: new Ext.data.JsonReader({
								root: "data"
						}, [{
								name: 'id'
						},{
								name: 'clave'
						},{
								name: 'critica'
						},{
								name: 'duracionestimada'
						},{
								name: 'tiempooptimista'
						},{
								name: 'costo'
						},{
								name: 'valormeta'
						}, {
								name: 'actividad'
						}, {
								name: 'precedencia'
						}, {
								name: 'tiempo_normal'
						}, {
								name: 'tiempo_optimo'
						}, {
								name: 'costo_normal'
						}, {
								name: 'costo_limite'
						}, {
								name: 'compresion'
						}, {
								name: 'varianza_costo'
						}, {
								name: 'pendiente'
						}, {
								name: 'COMP_PROY'
						}
						])
						,
						listeners: {
								beforeload: function(st, opts) {
										st.baseParams.parametros = Ext.encode(parametros);
								},
								load: function(st) {
										if(!_this.valorescargados){
												_this.elementosdatosgeneralesproyecto=[];
												_this.COMP_PROY=_this.store.data.items[0].data.COMP_PROY;
												var valueToPush = {};
												for(var i=0;i<_this.store.data.items.length;i++){
														valueToPush = {};
														valueToPush["id"] = _this.store.data.items[i].data.id;
														valueToPush["clave"] = _this.store.data.items[i].data.clave;
														valueToPush["duracionestimada"] = _this.store.data.items[i].data.duracionestimada;
														valueToPush["tiempooptimista"] = _this.store.data.items[i].data.tiempooptimista;
														valueToPush["costo"] = _this.store.data.items[i].data.costo;
														valueToPush["valormeta"] = _this.store.data.items[i].data.valormeta;
														valueToPush["actividad"] = _this.store.data.items[i].data.actividad;
														valueToPush["precedencia"] = _this.store.data.items[i].data.precedencia;
														valueToPush["critica"] = _this.store.data.items[i].data.critica;
														_this.elementosdatosgeneralesproyecto.push(valueToPush);
												}
												_this.valorescargados=true;
										}
								}
						}
				});

				_this.paginadoCompresion = new Ext.PagingToolbar({
						pageSize: 50,
            width: 1020,
						store: _this.store,
						displayInfo: true,
						listeners: {
								beforechange: function (paginado, evento) {
										_this.start = evento.start;
								}
						}
				});


				/********
				 * Store para calculos de tiempo
				 * ******/

				_this.store_tiempos = new Ext.data.SimpleStore({
						fields: ['id', 'den'],
						data: [
								['0', 'Minutos'],
								['1', 'Horas'],
								['2', 'Días']
						]
				});

				/*******
				 * Combo para calcular escala de tiempo
				 * ***********/

				_this.cb_tiempo = new Ext.form.ComboBox({
						fieldLabel: 'Tiempo',
						hiddenName: '',
						store: _this.store_tiempos,
						valueField: 'id',
						displayField: 'den',
						mode: 'local',
						forceSelection: true,
						triggerAction: 'all',
						id: 'cb_tiempo',
						allowBlank:false,
						selectOnFocus: true,
						name: 'cb_tiempo',
						emptyText: 'Seleccionar',
						editable: false,
						anchor: '95%',
						listeners: {
								select: function (c, r, i) {
										_this.escala_tiempo=_this.cb_tiempo.getValue();
										parametros[0]['escala_tiempo']=_this.escala_tiempo;
										_this.store.reload();
								}
						}
				});

				_this.cb_tiempo.setValue('1');



				//  Row selection para grid superior
				_this.sm  = new Ext.grid.CheckboxSelectionModel({
						// singleSelect: false
						sortable:true,
						listeners: {
								selectionchange: function (sm) {
										_this.elementosseleccionados = [];
										var nocritica=true;
										var mayorcompresion=false;
										if(sm.hasSelection()){
												var arrayrecords = sm.getSelections();
												var pos=0;
												Ext.each(arrayrecords, function(r) {
														console.log(r.data);
														   if(r.data.compresion>_this.COMP_PROY){
														   		var msg="El valor de compresión de la tarea seleccionada excede el límite de compresión del proyecto. " +
																	    "Sólo podrá ser comprimido a un valor de: "+_this.COMP_PROY+" ¿Desea comprimirla a ese tiempo?"
																       mostrarMensaje(2, msg, function(btnoprimido) {
																		   if (btnoprimido != 'ok') {
																				   sm.deselectRow(pos);
																		   }
																   });
														   }

														    _this.elementosseleccionados.push(r.data.id);
														    if(!r.data.critica)
																    nocritica=false;
														pos++;
										});
								  }
										if(sm.hasSelection() && nocritica){
												_this.btnAceptar.enable();
										}

										else
												_this.btnAceptar.disable();
						}
						}

				});

				_this.btnVerDatos = new Ext.Button({
						handler: function () {
								_this.txtValorCompresion=new Ext.form.NumberField({
										fieldLabel: 'Valor',
										name: 'valor',
										maxValue: 10000,
										minValue: 1,
										allowBlank:false,
										anchor: '80%'
								});
								_this.formValorCompresion = new Ext.form.FormPanel({
										labelWidth: 55,
										frame:true,
										defaultType: 'textfield',
										items: [_this.txtValorCompresion]
								});
								_this.btnCancelarValorCompresion = new Ext.Button({
										iconCls: 'cancelar',
										text: 'Cancelar',
										tooltip: 'Cerrar ventana sin guardar los datos',
										handler: function () {
												_this.windowValorParaCompresion.destroy();
										}
								});

								_this.btnAceptarValorCompresion= new Ext.Button({
										iconCls: 'aceptar',
										text: 'Aceptar',
										disabled: true,
										tooltip: 'Guardar datos y cerrar ventana',
										handler: function () {
												if(_this.txtValorCompresion.getValue()!=""){
														parametros[0]['valor_costo_directo']=_this.txtValorCompresion.getValue();
														parametros[0]['elementosdatosgeneralesproyecto']=_this.elementosdatosgeneralesproyecto;
														_this.windowValorParaCompresion.destroy();
														_this.generarReporteDatosGenerales(parametros);
												}
												else
														mostrarMensaje(1, 'Por favor debe introducir un valor.');
										}
								});
								_this.windowValorParaCompresion = new Ext.Window({
										title: 'Valor de costo indirecto',
										width: 250,
										height:120,
										minWidth: 200,
										minHeight: 100,
										layout: 'fit',
										plain:true,
										modal:true,
										buttonAlign:'center',
										items: _this.formValorCompresion,
										buttons: [_this.btnCancelarValorCompresion,_this.btnAceptarValorCompresion]
								});

								_this.windowValorParaCompresion.show();
						},
						disabled: false,
						iconCls: 'Ver',
						tooltip: 'Ver datos generales del proyecto',
						// key: {
						// 		ctrl: false,
						// 		alt: true,
						// 		key: 'D',
						// },
						scope: this
				});

				_this.grid = new Ext.grid.GridPanel({
						sm:_this.sm,
						region: 'center',
						width: 690,
						split: true,
						store: _this.store,
						tbar:[_this.btnVerDatos,'->','Tiempo:', _this.cb_tiempo],
						loadMask: {
								msg: 'Cargando informaci&oacute;n...'
						},
						viewConfig: {
								getRowClass: function(record, rowIndex, rowParams, store) {
										if (record.get('critica')===true) return 'rowCritica';
								}
						},
						columns: [
								_this.sm,
								{
										hidden: true,
										hideable: false,
										dataIndex: 'id'
								}, {
										hidden: true,
										header: "Clave",
										dataIndex: 'clave',
										sortable: true
								},{

										header: "Actividad",
										dataIndex: 'actividad',
										width: 100,
										sortable: true
								}, {
										header: "Precedencia",
										width: 100,
										dataIndex: 'precedencia',
										sortable: true
								}, {
										header: 'Tiempo esperado',
										width: 130,
										dataIndex: 'tiempo_normal',
										sortable: true
								},{
										header: 'Tiempo &oacute;ptimo',
										width: 130,
										dataIndex: 'tiempo_optimo',
										sortable: true
								},{
										header: 'Costo Normal',
										width: 100,
										dataIndex: 'costo_normal',
										sortable: true
								},{
										header: 'Costo L&iacute;mite',
										width: 100,
										dataIndex: 'costo_limite',
										sortable: true
								},{
										header: 'Compresi&oacute;n',
										width: 130,
										dataIndex: 'compresion',
										sortable: true
								},{
										header: 'σ de costo',
										width: 100,
										dataIndex: 'varianza_costo',
										sortable: true
								},{
										header: 'Pendiente (M)',
										width: 100,
										dataIndex: 'pendiente',
										sortable: true
								}
						],
						bbar:[_this.paginadoCompresion]
				});

				// _this.store.reload();


				_this.btnCancelar = new Ext.Button({
						iconCls: 'cancelar',
						text: 'Cancelar',
						tooltip: 'Cerrar ventana sin guardar los datos',
						handler: function () {
								_this.windowPrincipalCompresion.destroy();
						}
				});

				_this.btnAceptar= new Ext.Button({
						iconCls: 'aceptar',
						text: 'Aceptar',
						tooltip: 'Guardar datos y cerrar ventana',
						handler: function () {
								_this.mostrarVentanaGenerarPlantilla(obj_plantilla,1);
						}
				});

				_this.windowPrincipalCompresion = new Ext.Window({
						modal: true,
						//closeAction: 'hide',
						// constrain: true,
						plain    : true,
						layout   : 'fit',
						title: 'Comprimir proyecto ('+parametros[0].denproyecto+')',
						width:1030,
						height: 580,
						resizable:false,
						items: [_this.grid],
						buttons: [_this.btnCancelar, _this.btnAceptar]
				});
				_this.btnAceptar.disable();
				_this.windowPrincipalCompresion.show();

    }

		this.generarReporteDatosGenerales = function (parametros) {
				_this.BarraProgreso.show();
				_this.detailHtmlP="";
				Ext.Ajax.request({
						url: '/planificacion/proyecto/planeacion/index.php/cmpgestionarplantilla/obtenerDatosGeneralesProyecto',
						params: {
								parametros: Ext.encode(parametros),
						},
						callback: function(options, success, response) {
								_this.BarraProgreso.hide();
								var responseData = Ext.decode(response.responseText);
								_this.detailHtmlP = responseData.data;
								_this.detailWindowDatosProyecto  = new Ext.Window({
										title:'Ver datos generales del proyecto ('+parametros[0].denproyecto+')',
										layout:'fit',
										width:750,
										height:500,
										plain: true,
										modal:true,
										resizable:false,
										// autoScroll:true,
										minHeight: 500,
										maxHeight: 500,
										bodyStyle: 'background: #fff;',
										style: 'z-index:10000000;',
										html :_this.detailHtmlP,
										buttons:[{
												iconCls: 'cancelar',
												text: 'Cerrar',
												tooltip: 'Cerrar ventana sin guardar los datos',
												handler: function(){
														_this.detailWindowDatosProyecto.destroy();
												}}]});
								_this.detailWindowDatosProyecto.show();
						}
				});
		}

		this.mostrarVentanaGenerarPlantilla = function(obj_plantilla, plantilla) {
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
						regex: obj_plantilla.ObjValidaciones.expresionRegular('denominacion'),
						//maskRe: /^([a-zA-Z0-9áÃ©íóÃºÃ¼Ã�Ã‰Ã�Ã“ÃšñÃ‘Ãœ"' ,./()_-])$/,
						regexText: obj_plantilla.ObjValidaciones.ObtenerMsjErrorTextoRegido('denominacion'),
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
						regex: obj_plantilla.ObjValidaciones.expresionRegular('identificacion'),
						regexText: obj_plantilla.ObjValidaciones.ObtenerMsjErrorTextoRegido('identificacion'),
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
						invalidText: obj_plantilla.ObjValidaciones.ObtenerMsjErrorTextoRegido('fecha'),
						anchor: '98%',
						menuListeners: {
								select: function(df, date) {
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
								check: function(check, checked) {
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
								check: function(check, checked) {
								}
						}
				});
				this.stCmbFondoTiempo = new Ext.data.Store({
						url: '/planificacion/pdo/configuracion/index.php/cmpgestionarfondotiempo/listarFondoTiempo',
						listeners: {
								load: function(st, rc, obj) {
										_this.addNewRecord();
								},
								beforeload: function(st) {
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
				this.addNewRecord = function() {
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
								expand: function(combo) {
										_this.stCmbFondoTiempo.reload();
								},
								select: function(combo, record, index) {
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
								beforerender: function(c) {
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
								'clientvalidation': function(fm, valid) {
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
										handler: function() {
												_this.winGenerarProyecto.destroy();
										},
										tooltip: 'Cerrar ventana sin guardar los datos'
								}, {
										iconCls: 'aceptar ',
										text: 'Aceptar ',
										id: 'btnAceptarGenerarProy',
										// disabled: true,
										handler: function() {
												_this.generarProyectodePlantilla(obj_plantilla, plantilla);
										},
										tooltip: 'Guardar datos y cerrar ventana'
								}
						]
				});

				_this.tfdenominacion.setValue(obj_plantilla.smPlantilla.getSelections()[0].data.denominacion);
				_this.identificacion.setValue(obj_plantilla.smPlantilla.getSelections()[0].data.identificador);
				_this.fini.setValue(new Date().format('d/m/Y'));
				_this.winGenerarProyecto.show();
		};

		this.generarProyectodePlantilla = function(obj_plantilla, plantilla) {
				var msj = 'Generando proyecto ...';
				if (plantilla == 1) {
						msj = 'Generando plantilla ...';
				}
				_this.BarraProgreso.show(msj);
				Ext.Ajax.request({
						url: '/planificacion/proyecto/planeacion/index.php/cmpgestionarplantilla/generarProyectodePlantilla',
						params: {
								fechainicio: _this.fini.getValue().format('d/m/Y'),
								proyecto: Ext.encode(obj_plantilla.smPlantilla.getSelections()[0].data),
								denominacion: _this.tfdenominacion.getValue(),
								identificacion: _this.identificacion.getValue(),
								horainicio: _this.tmfHoraInicioProyecto.getValue(),
								plantilla: plantilla,
								idEstructura: obj_plantilla.objestructura.idEstructura,
								ignorarFinSemana: (_this.chfindesemana.getValue() == true) ? 1 : 0, //(restoMinutos != 0) ? restoMinutos : 0
								regimen8hrs: (_this.chregimendiario.getValue() == true) ? 1 : 0,
								idfondotiempo: (_this.cmbFondoTiempo.getValue()) ? _this.cmbFondoTiempo.getValue() : 0,
								compresion:Ext.encode(_this.elementosseleccionados),
								COMP_PROY:_this.COMP_PROY
						},
						callback: function(options, success, response) {
								_this.BarraProgreso.hide();
								responseData = Ext.decode(response.responseText);
								if (responseData.mensaje == 1) {
										_this.winGenerarProyecto.destroy();
										_this.windowPrincipalCompresion.destroy();
										mostrarMensaje(1, 'El proyecto se ha generado satisfactoriamente.');
										obj_plantilla.PostAccionesGestionar();
								} else if (responseData.mensaje == 0) {
										mostrarMensaje(1, responseData.msg);
										_this.identificacion.focus();
								}
								else {
										mostrarMensaje(1, 'El proyecto no ha podido ser generado.');
										_this.winGenerarProyecto.destroy();
										obj_plantilla.PostAccionesGestionar();
								}
						}
				});
		};

};