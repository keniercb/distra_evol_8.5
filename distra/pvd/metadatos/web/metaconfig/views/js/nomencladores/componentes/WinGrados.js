Ext.ns('Nomenclador');
/**
 * Ventana comun para nomencladores que contiene la denominacion y abreviatura
 * @param bool abreviatura Si desea quitar la abreviatura
 * @param bool listaInterna Si desea poner el checkbox de Lista interna
 * @param bool pagina Si desea poner el checkbox de Página
 *
 * @param bool modificar En caso de que la ventana sea para modificar los valores
 *      @param record record Para la obtencion de los valores del nomenclador
 *
 * @param store store Para la recarga del grid al finalizar la accion
 * @param int tipo Identificador del nomenclador para los mensajes de la controladora
 * @param string name el name permite conocer cual es su clase y completa los identificadores
 *              de los elementos del formulario de la ventana
 */
Nomenclador.Grado = Ext.extend(Ext.Window, {
		title         : '',
		abreviatura   : true,
		text          : 'Abreviatura',
		modificar     : false,
		name          : 'elemento',
		isSelected    : null,
		initComponent : function ()
		{
				var _this = this;
				this.initTools();
				this.addEvents('setAbreviatura');
				var tipos = new Array();
				tipos.push('grado')
				_this.storeCategoria = new Ext.data.Store({
						url       : 'mostrarValores',
						baseParams: {
								clase  : 'categoriamilitar',
								accion : 'dameTodosVisibles',
								gestion: true
						},
						autoLoad  : true,
						reader    : new Ext.data.JsonReader({
								root: "datos",
								id  : "idcategoriamilitar"}, [
								{name: 'idcategoriamilitar'},
								{name: 'denominacion'}
						])
				});
				_this.storeIconos = new Ext.data.Store({
						url     : 'mostrarValores',
						autoload: true,
						reader  : new Ext.data.JsonReader({
								root: "datos"}, [
								{name: 'idicono'},
								{name: 'icono'},
								{name: 'denominacion'}
						])
				})
				_this.on('show', function ()
				{
						Ext.getCmp('denominacion' + _this.name).focus(false, 10);
				})
				_this.on('destroy', function ()
				{
						Ext.getCmp("btnAdicionar_" + _this.name).focus(false, 10);
				})
				_this.storeIconos.baseParams.parametros = Ext.encode(tipos);
				_this.storeIconos.baseParams.clase = 'icono';
				_this.storeIconos.baseParams.accion = 'dameIconosPorTipo';
				_this.storeIconos.load();
				_this.categoria = new Ext.form.ccoe.ComboBox({
						anchor        : '98%',
						editable      : false,
						name          : 'categoriamilitar',
						id            : 'comboCategoriaMilitar',
						autoCreate    : true,
						store         : _this.storeCategoria,
						mode          : 'local',
						value         : (_this.modificar) ? _this.record.data.categoriamilitar : '',
						forceSelection: true,
						enableQtip    : true,
						allowBlank    : false,
						fieldLabel    : "Categoria militar",
						displayField  : 'denominacion',
						valueField    : 'denominacion',
						triggerAction : 'all',
						listeners     : {
								select: function (combo, record)
								{
										Ext.getCmp('idcategoriamilitar').setValue(record.data.idcategoriamilitar);
								}
						}
				})
				_this.iconos = new Nomenclador.ImagenCombo({
						allowBlank    : false,
						anchor        : '98%',
						forceSelection: true,
						editable      : false,
						store         : _this.storeIconos,
						value         : (_this.modificar) ? _this.record.data.nombre_imagen : '',
						handler       : function ()
						{
								this.store.removeAll();
								this.store.load();
						},
						listeners     : {
								select: function (combo, record)
								{
										Ext.getCmp('idicono').setValue(record.data.idicono);
								}
						}
				})
				_this.fechaInicio = new Ext.form.DateField({
						fieldLabel : 'Fecha de inicio',
						allowBlank : false,
						format     : 'd/m/Y',
						id         : 'fechainicio',
						name       : 'fechainicio',
						vtype: 'daterange',
						endDateField: 'fechafin',
						minText:"La fecha fin tiene que ser posterior o igual a la fecha de inicio.",
						maxText:"La fecha de inicio tiene que ser anterior o igual a la fecha fin.",
						anchor     : '99%',
						value      : (_this.modificar) ? _this.record.data.fechainicio : new Date(),
						maskRe     : /[\d\/]/,
						invalidText: ['Formato: dd/mm/aaaa.'].join(""),
						parseDate  : function (v)
						{
								return (!v || v instanceof Date) ? v : ((v.length == 6 || v.length == 8 || v.length == 10) && (Date.parseDate(v, 'd/m/y') || Date.parseDate(v, 'd/m/Y')));
						}
				});
				_this.fechaFin = new Ext.form.DateField({
						fieldLabel : 'Fecha de fin',
						format     : 'd/m/Y',
						id         : 'fechafin',
						name       : 'fechafin',
						vtype: 'daterange',
						minText:"La fecha fin tiene que ser posterior o igual a la fecha de inicio.",
						maxText:"La fecha de inicio tiene que ser anterior o igual a la fecha fin.",
						startDateField: 'fechainicio',
						anchor     : '99%',
						value      : (_this.modificar) ? _this.record.data.fechafin : "",
						maskRe     : /[\d\/]/,
						invalidText: ['Formato: dd/mm/aaaa.'].join(""),
						parseDate  : function (v)
						{
								return (!v || v instanceof Date) ? v : ((v.length == 6 || v.length == 8 || v.length == 10) && (Date.parseDate(v, 'd/m/y') || Date.parseDate(v, 'd/m/Y')));
						}
				});
				_this.valores = new Ext.FormPanel({
						layout      : 'form',
						collapsible : true,
						collapsed   : false,
						monitorValid: true,
						frame       : true,
						bodyStyle   : 'padding: 5px 0 0 0;',
						labelAlign  : 'top',
						items       : [
								{
										xtype     : 'textfield',
										fieldLabel: "Denominacion",
										name      : 'denominacion',
										value     : (_this.modificar) ? _this.record.data.denominacion : '',
										id        : 'denominacion' + _this.name,
										vtype     : 'vtdenominaciones',
										prevTab:"btnAceptar"+_this.name,
										allowBlank: false,
										anchor    : '99%',
										maxLength : 100
								},
								{
										xtype     : 'textfield',
										fieldLabel: "Abreviatura",
										name      : 'abreviatura',
										value     : (_this.modificar) ? _this.record.data.abreviatura : '',
										id        : 'abreviatura' + _this.name,
										vtype     : 'vtabrev',
										allowBlank: false,
										anchor    : '99%',
										maxLength : 10
								},
								_this.iconos,
								_this.categoria,
								_this.fechaInicio,
								_this.fechaFin,
								{
								},
								{
										xtype: 'hidden',
										id   : 'denanterior' + _this.name,
										value: (_this.modificar) ? _this.record.data.denominacion : '',
										name : 'denanterior',
										style: 'display: none'
								},
								{
										xtype: 'hidden',
										id   : 'idicono',
										value: (_this.modificar) ? _this.record.data.idicono : '',
										name : 'idicono'
								},
								{
										xtype: 'hidden',
										id   : 'idcategoriamilitar',
										value: (_this.modificar) ? _this.record.data.idcategoriamilitar : '',
										name : 'idcategoriamilitar'
								},
								{
										xtype: 'hidden',
										id   : 'orden',
										value: (_this.modificar) ? '' : _this.orden,
										name : 'orden'
								},
								{
										layout    : "column",
										labelAlign: 'rigth',
										items     : [
												{
														columnWidth: .22,
														items      : [
																{
																		xtype    : "checkbox",
																		boxLabel : "Actual",
																		hideLabel: true,
																		hidden:true,
																		checked  : (_this.modificar) ? parseInt(_this.record.data.actual) : 1,
																		name     : "actual",
																		id       : "actual" + _this.name
																}
														]
												},
												{
														columnWidth: .20,
														items      : [
																{
																		xtype    : "checkbox",
																		boxLabel : "Visible",
																		checked  : (_this.modificar) ? parseInt(_this.record.data.visible) : 1,
																		hideLabel: true,
																		hidden:true,
																		name     : "visible",
																		id       : "visible" + _this.name
																}
														]
												},
												{
														columnWidth: .4,
														items      : [
																{
																		xtype    : "checkbox",
																		boxLabel : "Es marina",
																		checked  : (_this.modificar) ? parseInt(_this.record.data.marina) : 0,
																		hideLabel: true,
																		name     : "marina",
																		id       : "marina" + _this.name
																}
														]
												}
										]
								}
						],
						listeners   : {'clientvalidation': function (_form, _valid)
						{
								if (_valid && _form.getForm().isDirty()) {
										Ext.getCmp("btnCancelar" + _this.name).nextTab = _this.btnAplicar.id
										Ext.getCmp('denominacion' + _this.name).prevTab = _this.btnAceptar.id
										_this.btnAplicar.enable();
										_this.btnAceptar.enable();
								} else {
										Ext.getCmp("btnCancelar" + _this.name).nextTab = 'denominacion' + _this.name
										Ext.getCmp('denominacion' + _this.name).prevTab = "btnCancelar" + _this.name
										_this.btnAplicar.disable();
										_this.btnAceptar.disable();
								}
						} }
				})
				_this.btnAplicar = new Ext.Button({
						text    : "Aplicar",
						minWidth: 75,

						prevTab:"btnCancelar"+_this.name,
						nextTab:"btnAceptar" + _this.name,
						iconCls : 'aplicar',
						tooltip : "Guardar datos y limpiar los campos",
						id      : "btnAplicar" + _this.name,
						handler : function ()
						{
								_this.enviar(true)
						}
				})
				_this.btnAceptar = new Ext.Button({
						text    : "Aceptar",
						minWidth: 75,

						prevTab:_this.btnAplicar.id,
						nextTab:"denominacion"+_this.name,
						iconCls : 'aceptar',
						tooltip : "Guardar datos y cerrar ventana",
						id      : "btnAceptar" + _this.name,
						handler : function ()
						{
								_this.enviar(false);
						}
				})
				Ext.apply(this, {
						layout   : 'fit',
						items    : [_this.valores],
						width    : 300,
						resizable: false,
						autoValidate: false,
						constrain: true,
						modal    : true,
						height   : 420,
						keys     : [
								{
										key: Ext.EventObject.ENTER,
										fn : function ()
										{
												_this.btnAceptar.handler.call();
										}
								},
								{
										key: Ext.EventObject.INSERT,
										fn : function ()
										{
												if (!_this.btnAplicar.hidden) {
														_this.btnAplicar.handler.call();
												}
										}
								}
						],
						buttons  : [
								{
										text    : "Cancelar",
										prevTab:"marina" + _this.name,
										nextTab:_this.btnAplicar.id,
										iconCls : 'cancelar',
										minWidth: 75,
										tooltip : "Cerrar ventana sin guardar los datos",
										id      : "btnCancelar" + _this.name,
										handler : function ()
										{
												_this.destroy();
										}
								},
								_this.btnAplicar,
								_this.btnAceptar
						]
				})
				if (this.modificar) {
						this.title = 'Modificar ' + this.title;
						_this.btnAplicar.hidden = true;
				} else {
						this.title = 'Adicionar ' + this.title;
				}
				if (!this.abreviatura) {
						this.setAbreviatura(false);
				}
				Nomenclador.Grado.superclass.initComponent.apply(this)
		},
		setAbreviatura: function (flag)
		{
				var _this = this;
				var abreviatura = _this.valores.findById('abreviatura' + _this.name);
				abreviatura.hidden = !flag;
				abreviatura.hideLabel = !flag;
				this.abreviatura = flag;
				this.height = (flag) ? this.height : this.height - 40;
		},
		enviar        : function (accion)
		{
				var _this = this;
				var form = _this.valores.getForm();
				if (form.isValid()) {
						if (form.isDirty()) {
								Secodena.mostrarMascara('cargaini', "Por favor espere...", "Guardando datos " + _this.texto + ".");
								var param = new Array();
								param.push(_this.idNomenclador);
								param.push(_this.tipo);
								param.push(form.getValues());
								Ext.Ajax.request({
										url     : 'gestionarAcciones',
										params  : {
												clase     : _this.name,
												accion    : (_this.modificar) ? 'modificar' : 'insertar',
												parametros: Ext.encode(param)
										},
										callback: function (options, success, response)
										{
												Secodena.ocultarMascara('cargaini');
												var responseData = Ext.decode(response.responseText);
												var codMsg = responseData.codMsg;
												var msg = responseData.mensaje;
												if (codMsg!= 4) {
														mostrarMensaje(codMsg, msg);
												}
												if (responseData.codMsg == 1) {
														if (!accion) {
																_this.destroy();
														} else {
																form.reset();
														}
														var options = _this.store.lastOptions
														if (_this.isSelected) {
																var start = options.params.start;
																_this.store.load({params: {start: start, limit: 15}});
														} else {
																var start = 0;
																if (_this.modificar) {
																		_this.store.load({params: {start: options.params.start, limit: 15}});
																} else {
																		if (options != null) {
																				var div = Math.floor(_this.store.totalLength / 15);
																				start = 15 * div;
																		}
																		_this.store.load({params: {start: start, limit: 15}});
																}
														}
												} else {
														if (responseData.codMsg != 6) {
																mostrarMensaje(responseData.codMsg, responseData.mensaje, function ()
																{
																		Ext.getCmp(_this.foco).focus(false, 10);
																})
														}
												}
										}
								})
						} else {
								mostrarMensaje(6, "Por favor verifique nuevamente no ha modificado ningún campo.");
						}
				}
		}
})
