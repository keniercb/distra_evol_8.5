Ext.ns('Nomenclador');
/**
 * Ventana comun para nomencladores que contiene la denominacion, imagen y checkbox de usos
 * concepto, medios y grados
 *
 * @param bool modificar En caso de que la ventana sea para modificar los valores
 *      @param record record Para la obtencion de los valores del nomenclador
 *
 * @param store store Para la recarga del grid al finalizar la accion
 * @param int tipo Identificador del nomenclador para los mensajes de la controladora
 * @param string name el name permite conocer cual es su clase y completa los identificadores
 *              de los elementos del formulario de la ventana
 */
Nomenclador.Icono = Ext.extend(Ext.Window, {
		title                    : '', modificar: false, name: 'elemento', initComponent: function ()
		{
				var _this = this;
				this.initTools();
				_this.imagen = new Ext.ux.ScreenshotField({
						hideLabel   : true,
						allowUpload : true,
						filetypeList: ['gif', 'jpg', 'png'],
						name        : 'icono',
						id          : 'icono',
						allowBlank  : false,
						width       : 120,
						height      : 100
				});
				_this.btnAplicar = new Ext.Button({
						text    : "Aplicar",
						minWidth: 75,
						disabled: true, //icon    : perfil.dirImg + 'aplicar.png',
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
						minWidth: 75, //icon    : perfil.dirImg + 'aceptar.png',
						iconCls : 'aceptar',
						disabled: true,
						nextTab : "denominacion" + _this.name,
						tooltip : "Guardar datos y cerrar ventana",
						id      : "btnAceptar" + _this.name,
						handler : function ()
						{
								_this.enviar(false);
						}
				});
				_this.on('show', function ()
				{
						Ext.getCmp('denominacion' + _this.name).focus(false, 10)
				})
				_this.on('destroy', function ()
				{
						Ext.getCmp("btnAdicionar_" + _this.name).focus(false, 10);
				})
				_this.cbxConceptos = new Ext.form.Checkbox({
						boxLabel : "Concepto",
						hideLabel: true,
						checked  : (_this.modificar) ? parseInt(_this.record.data.concepto) : 0,
						name     : "concepto",
						id       : "concepto" + _this.name
				});
				_this.cbxMedios = new Ext.form.Checkbox({
						boxLabel : "Medio",
						checked  : (_this.modificar) ? parseInt(_this.record.data.medio) : 0,
						hideLabel: true,
						name     : "medio",
						id       : "medio" + _this.name
				});
				_this.cbxGrado = new Ext.form.Checkbox({
						boxLabel : "Grado",
						checked  : (_this.modificar) ? parseInt(_this.record.data.grado) : 0,
						hideLabel: true,
						name     : "grado",
						id       : "grado" + _this.name
				});
				_this.cbxLogo = new Ext.form.Checkbox({
						boxLabel : "Logo",
						checked  : (_this.modificar) ? parseInt(_this.record.data.logo) : 0,
						hideLabel: true,
						name     : "logo",
						id       : "logo" + _this.name
				});
				_this.tfDenominacion = new Ext.form.TextField({
						fieldLabel: "Denominación",
						name      : 'denominacion',
						value     : (_this.modificar) ? _this.record.data.denominacion : '',
						id        : 'denominacion' + _this.name,
						prevTab   : "btnCancelar" + _this.name,
						vtype     : 'vtdenominaciones',
						allowBlank: false,
						anchor    : '99%',
						maxLength : 100,
						listeners : {
								'render': function (_tf)
								{
										_tf.focus(false, 10)
								}
						}
				});
				_this.fechaInicio = new Ext.form.DateField({
						fieldLabel : 'Fecha de inicio',
						allowBlank : false,
						format     : 'd/m/Y',
						id         : 'fechainicio',
						name       : 'fechainicio',
						anchor     : '99%',
						value      : (_this.modificar) ? _this.record.data.fechainicio : new Date(),
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
						monitorValid: true,
						collapsed   : false,
						frame       : true,
						bodyStyle   : 'padding: 5px 0 0 0;',
						labelAlign  : 'top',
						items       : [_this.tfDenominacion, {
								xtype: 'hidden',
								id   : 'denanterior' + _this.name,
								value: (_this.modificar) ? _this.record.data.denominacion : '',
								name : 'denanterior',
								style: 'display: none'
						}, {
								xtype: 'hidden',
								id   : 'imagen',
								value: (_this.modificar) ? _this.record.data.imagen : '',
								name : 'imganterior',
								style: 'display: none'
						}, {
								layout: "column", items: [{
										columnWidth: .6, bodyStyle: 'padding: 5px 0 0 0;', items: [_this.imagen]
								}, {
										columnWidth: .4, bodyStyle: 'padding: 0 0 0 13px;', items: [{
												layout    : "form",
												labelAlign: 'rigth',
												items     : [_this.cbxConceptos, _this.cbxMedios, _this.cbxGrado, _this.cbxLogo]
										}]
								}]
						}, _this.fechaInicio],
						listeners   : {
								'clientvalidation': function (_form, _valid)
								{
										if (_this.modificar) {
												if (_this.checkDenominacionDirty() || _this.checkSelectedCheck() || _this.checkImagenDirty() || _this.checkFechaDirty()) {
														_this.tfDenominacion.id.prevTab = _this.btnAceptar.id;
														Ext.getCmp("btnCancelar" + _this.name).nextTab = _this.btnAplicar.id
														_this.btnAplicar.enable();
														_this.btnAceptar.enable();
														return;
												}
										} else {
												if (_this.checkDenominacionDirty() && _this.checkSelectedCheck() && _this.checkImagenDirty() && _this.checkFechaDirty()) {
														_this.tfDenominacion.id.prevTab = _this.btnAceptar.id;
														Ext.getCmp("btnCancelar" + _this.name).nextTab = _this.btnAplicar.id
														_this.btnAplicar.enable();
														_this.btnAceptar.enable();
														return;
												}
										}
										_this.tfDenominacion.prevTab = "btnCancelar" + _this.name
										Ext.getCmp("btnCancelar" + _this.name).nextTab = "denominacion" + _this.name
										_this.btnAplicar.disable();
										_this.btnAceptar.disable();
								}
						}
				});
				Ext.apply(this, {
						layout      : 'fit',
						items       : [_this.valores],
						width       : 280,
						resizable   : false,
						autoValidate: false,
						constrain   : true,
						modal       : true,
						height      : 325,
						keys        : [{
								key: Ext.EventObject.ENTER, fn: function ()
								{
										_this.btnAceptar.handler.call();
								}
						}, {
								key: Ext.EventObject.INSERT, fn: function ()
								{
										if (!_this.btnAplicar.hidden) {
												_this.btnAplicar.handler.call();
										}
								}
						}],
						buttons     : [{
								text    : "Cancelar", //icon    : perfil.dirImg + 'cancelar.png',
								iconCls : 'cancelar',
								prevTab : _this.fechaInicio.id,
								nextTab : "denominacion" + _this.name,
								minWidth: 75,
								tooltip : "Cerrar ventana sin guardar los datos",
								id      : "btnCancelar" + _this.name,
								handler : function ()
								{
										_this.destroy();
								}
						}, _this.btnAplicar, _this.btnAceptar]
				})
				if (this.modificar) {
						this.title = 'Modificar ' + this.title;
						this.btnAplicar.hidden = true;
						var image = _this.record.data.icono;
						_this.imagen.setValue(image);
				} else {
						this.title = 'Adicionar ' + this.title;
				}
				Nomenclador.Icono.superclass.initComponent.apply(this)
		}, checkSelectedCheck    : function ()
		{
				var _this = this;
				return ((_this.cbxConceptos.isDirty() || _this.cbxMedios.isDirty() || _this.cbxGrado.isDirty() || _this.cbxLogo.isDirty()) && (_this.cbxConceptos.getValue() || _this.cbxMedios.getValue() || _this.cbxGrado.getValue() || _this.cbxLogo.getValue()))
		}, checkImagenDirty      : function ()
		{
				var _this = this;
				var dirty = true;
				if (_this.modificar) {
						dirty = _this.record.data.icono != _this.imagen.getValue();
				} else {
						dirty = _this.imagen.getInputFile().dom.value != "";
				}
				return dirty
		}, checkDenominacionDirty: function ()
		{
				var _this = this;
				var dirty = false;
				if (_this.tfDenominacion.isValid() && _this.tfDenominacion.isDirty()) {
						dirty = true;
				}
				return dirty
		}, checkFechaDirty       : function ()
		{
				var _this = this;
				var dirty = false;
				if(_this.modificar){
						if (_this.fechaInicio.isDirty()) {
								dirty = true;
						}
				}else {
						if (_this.fechaInicio.isValid()) {
								dirty = true;
						}
				}


				return dirty
		}, checkType             : function ()
		{
				var _this = this;
				var vImagen = _this.imagen.getInputFile().dom.value;
				var vPermitidos = _this.imagen.filetypeList;
				var type = false;
				if (vImagen != "") {
						vImagen = vImagen.split(".");
						for (var i = 0; i < vPermitidos.length; i++) {
								if (vPermitidos[i] == vImagen[1]) {
										type = true;
								}
						}
				}
				if (vImagen == "") {
						type = true
				}
				return type;
		}, enviar                : function (accion)
		{
				var _this = this;
				var form = _this.valores.getForm();
				var values = form.getValues();
				if (_this.checkType() === true) {
						if (form.isDirty()) {
								Secodena.mostrarMascara('cargaini', "Por favor espere...", "Guardando datos " + _this.texto + ".");
								var param = new Array();
								param.push(_this.idNomenclador);
								param.push(_this.tipo);
								param.push(values);
								Ext.Ajax.request({
										url        : 'gestionarAcciones', params: {
												clase     : _this.name,
												accion    : (_this.modificar) ? 'modificar' : 'insertar',
												parametros: Ext.encode(param)
										}, callback: function (options, success, response)
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
														var options = _this.store.lastOptions;
														var start = 0;
														if (_this.modificar) {
																_this.store.load({params: {start: options.params.start, limit: 15}});
														} else {
																if (options != null) {
																		var div = Math.floor(_this.store.totalLength / 10);
																		start = 10 * div;
																}
																_this.store.load({params: {start: start, limit: 15}});
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
				} else {
						mostrarMensaje(6, "Por favor verifique nuevamente que el archivo seleccionado sea una imagen.");
				}
		}
})
