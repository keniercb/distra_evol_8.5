Ext.ns('Proyecto');
/**
 * Ventana comun para proyecto que contiene la denominacion y abreviatura
 *
 * @param bool modificar En caso de que la ventana sea para modificar los valores
 *      @param record record Para la obtencion de los valores del nomenclador
 *
 * @param store store Para la recarga del grid al finalizar la accion
 * @param int tipo Identificador del nomenclador para los mensajes de la controladora
 * @param string name el name permite conocer cual es su clase y completa los identificadores
 *              de los elementos del formulario de la ventana
 */
Proyecto.Comun = Ext.extend(Ext.Window, {
		title        : '',
		modificar    : false,
		clase        : 'proyecto',
		idProyecto   : false,
		etiquetas    : etiquetas.proyecto,
		initComponent: function ()
		{
				var _this = this;
				this.initTools();
				_this.btnAplicar = new Ext.Button({
						text    : _this.etiquetas.lbBtnAplicar,
						iconCls : 'aplicar',
						id      : 'btnAplicar' + _this.clase,
						nextTab : 'btnAceptar' + _this.clase,
						minWidth: 75,
						hidden  : _this.modificar,
						tooltip : _this.etiquetas.lbtooltipaplicar,
						handler : function ()
						{
								_this.enviar(false);
						}
				});
				_this.btnAceptar = new Ext.Button({
						text    : _this.etiquetas.lbBtnAceptar,
						iconCls : 'aceptar',
						id      : 'btnAceptar' + _this.clase,
						nextTab : 'denominacion' + _this.clase,
						minWidth: 75,
						tooltip : _this.etiquetas.lbtooltipaceptar,
						handler : function ()
						{
								_this.enviar(true);
						}
				});
				_this.formulario = new Ext.FormPanel({
						layout          : 'form',
						frame           : true,
						bodyStyle       : 'padding: 5px 0 0 0;',
						labelAlign      : 'top',
						buttonAlign     : 'right',
						trackResetOnLoad: true,
						monitorValid    : true,
						items    : [{
								xtype     : 'textfield',
								fieldLabel: "Denominación",
								name      : 'denominacion',
								prevTab   : 'btnAceptar' + _this.clase,
								value     : (_this.modificar) ? _this.record.data.denominacion : '',
								id        : 'denominacion' + _this.clase,
								vtype     : 'vtdenominaciones',
								allowBlank: false,
								anchor    : '99%',
								maxLength : 100
						}, {
								xtype     : "textarea",
								fieldLabel: "Descripción",
								name      : 'descripcion',
								value     : (_this.modificar) ? _this.record.data.descripcion : '',
								id        : 'descripcion' + _this.clase,
								allowBlank: true,
								hidden    : false,
								nextTab   : "btnCancelar" + _this.clase,
								anchor    : '99%',
								maxLength : 255
						}, {
								xtype: 'hidden',
								id   : 'denanterior' + _this.clase,
								value: (_this.modificar) ? _this.record.data.denominacion : '',
								name : 'denanterior',
								style: 'display: none'
						}],
						listeners: {
								'clientvalidation': function (form, valid)
								{
										if (form.getForm().isDirty() && valid) {
												_this.btnAplicar.enable();
												_this.btnAceptar.enable();
												if(_this.modificar){
														Ext.getCmp("btnCancelar" + _this.clase).nextTab = 'btnAceptar' + _this.clase;
														Ext.getCmp('denominacion' + _this.clase).prevTab = 'btnAceptar' + _this.clase;
												}else{
														Ext.getCmp("btnCancelar" + _this.clase).nextTab = 'btnAplicar' + _this.clase;
														Ext.getCmp('denominacion' + _this.clase).prevTab = 'btnAceptar' + _this.clase;
												}

										} else {
												_this.btnAplicar.disable();
												_this.btnAceptar.disable();
												Ext.getCmp("btnCancelar" + _this.clase).nextTab = 'denominacion' + _this.clase;
												Ext.getCmp('denominacion' + _this.clase).prevTab = "btnCancelar" + _this.clase;
										}
								}
						}
				})
				Ext.apply(this, {
						layout      : 'fit',
						items       : [_this.formulario],
						autoValidate: false,
						width       : 300,
						resizable   : false,
						constrain   : true,
						modal       : true,
						height      : 220,
						bufferResize: true,
						listeners   : {
								render: function ()
								{
										if (this.modificar) {
												var formulario = _this.formulario.getForm();
												formulario.setValues(formulario.getValues());
										}
								}
						},
						buttons     : [{
								text   : "Cancelar", //										icon   : perfil.dirImg + 'cancelar.png',
								iconCls: 'cancelar',
								tooltip: "Cerrar ventana sin guardar los datos",
								id     : "btnCancelar" + _this.clase,
								nextTab: "btnAplicar" + _this.clase,
								prevTab: "descripcion" + _this.clase,
								handler: function ()
								{
										_this.destroy();
								}
						}, _this.btnAplicar, _this.btnAceptar]
				})
				if (this.modificar) {
						this.title = 'Modificar ' + this.title;
				} else {
						this.title = 'Adicionar ' + this.title;
				}
				Proyecto.Comun.superclass.initComponent.apply(this)
		},
		enviar       : function (close)
		{
				var _this = this;
				var form = _this.formulario.getForm();
				if (form.isValid()) {
						if (form.isDirty()) {
								Secodena.mostrarMascara('cargaini', "Por favor espere...", "Guardando datos " + _this.texto + ".");
								var param = new Array();
								param.push(_this.idProyecto);
								param.push(form.getValues());
								Ext.Ajax.request({
										url        : 'gestionarAcciones', params: {
												clase     : _this.clase,
												accion    : (_this.modificar) ? 'modificar' : 'insertar',
												parametros: Ext.encode(param)
										}, callback: function (options, success, response)
										{
												Secodena.ocultarMascara('cargaini');
												var responseData = Ext.decode(response.responseText);
												if (responseData.codMsg == 1) {
														mostrarMensaje(responseData.codMsg, responseData.mensaje);
														var options = _this.store.lastOptions;
														var start = 0;
														if (_this.modificar) {
																_this.store.load({params: {start: options.params.start, limit: 18}});
														} else {
																if (options != null) {
																		var div = Math.floor(_this.store.totalLength / 18);
																		start = 18 * div;
																}
																_this.store.load({params: {start: start, limit: 18}});
														}
														if (close) {
																_this.destroy();
														} else {
																form.reset();
														}
												} else {
														if (responseData.codMsg != 6) {
																mostrarMensaje(responseData.codMsg, responseData.mensaje);
														}
												}
										}
								})
						} else {
								mostrarMensaje(6, "Por favor verifique nuevamente no ha modificado ningún campo.");
						}
				}
		}
});
