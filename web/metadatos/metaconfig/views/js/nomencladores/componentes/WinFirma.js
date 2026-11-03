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
Nomenclador.Firma = Ext.extend(Ext.Window, {
	title: '', modificar: false, name: 'elemento', isSelected: null, initComponent: function () {
		var _this = this;
		this.initTools();
		var tipos = new Array();
		tipos.push('grado')
		_this.storeCargos = new Ext.data.Store({
			url: 'mostrarValores', baseParams: {
				clase: 'cargo', accion: 'dameTodosVisibles', gestion: true
			}, autoLoad: true, reader: new Ext.data.JsonReader({
				root: "datos"
			}, [{ name: 'idnomcargo' }, { name: 'denominacion' }])
		});
		_this.cargos = new Ext.form.ccoe.ComboBox({
			anchor: '98%',
			editable: true,
			name: 'cargos',
			id: 'comboCargos',
			autoCreate: true,
			store: _this.storeCargos,
			mode: 'local',
			value: (_this.modificar) ? _this.record.data.cargo : '',
			forceSelection: true,
			enableQtip: true,
			allowBlank: false,
			fieldLabel: "Cargo",
			displayField: 'denominacion',
			valueField: 'denominacion',
			triggerAction: 'all',
			listeners: {
				select: function (combo, record) {
					Ext.getCmp('idnomcargo').setValue(record.data.idnomcargo);
				}
			}
		});

		_this.storeDominios = new Ext.data.Store({
			url: 'getDominiosHijos',
			autoLoad: true, 
			reader: new Ext.data.JsonReader({
			}, [{ name: 'iddominio' }, { name: 'denominacion' }])
		});
		_this.dominios = new Ext.form.ccoe.ComboBox({
			anchor: '98%',
			editable: true,
			name: 'dominio',
			autoCreate: true,
			store: _this.storeDominios,
			mode: 'local',
			value: (_this.modificar) ? _this.record.data.dominio : '',
			forceSelection: true,
			enableQtip: true,
			allowBlank: false,
			fieldLabel: "Dominio",
			displayField: 'denominacion',
			valueField: 'denominacion',
			triggerAction: 'all',
			listeners: {
				select: function (combo, record) {
					Ext.getCmp('iddominio').setValue(record.data.iddominio);
				}
			}
		});

		_this.valores = new Ext.FormPanel({
			layout: 'form',
			collapsible: true,
			collapsed: false,
			monitorValid: true,
			autoHeight: true,
			frame: true,
			bodyStyle: 'padding: 5px 0 0 0;',
			labelAlign: 'top',
			items: [{
				xtype: 'textfield',
				fieldLabel: "Nombre de la persona",
				prevTab: "btnAceptar" + _this.name,
				name: 'persona',
				value: (_this.modificar) ? _this.record.data.persona : '',
				id: 'denominacion' + _this.name,
				vtype: 'vtdenominaciones',
				allowBlank: false,
				anchor: '99%',
				maxLength: 100,
				listeners: {
					'render': function (_tf) {
						_tf.focus(false, 10)
					}
				}
			}, {
				xtype: 'hidden',
				id: 'denanterior' + _this.name,
				value: (_this.modificar) ? _this.record.data.persona : '',
				name: 'denanterior',
				style: 'display: none'
			}, {
				xtype: 'hidden',
				id: 'cargoanterior' + _this.name,
				value: (_this.modificar) ? _this.record.data.cargo : '',
				name: 'cargoanterior',
				style: 'display: none'
			}, _this.cargos, {
				xtype: 'datefield',
				fieldLabel: 'Fecha de inicio',
				allowBlank: false,
				format: 'd/m/Y',
				id: 'fechainicio',
				name: 'fechainicio',
				vtype: 'daterange',
				endDateField: 'fechafin',
				minText: "La fecha fin tiene que ser posterior o igual a la fecha de inicio.",
				maxText: "La fecha de inicio tiene que ser anterior o igual a la fecha fin.",
				anchor: '99%',
				value: (_this.modificar) ? _this.record.data.fechainicio : new Date(),
				maskRe: /[\d\/]/,
				invalidText: 'El formato establecido: dd/mm/aaaa.',
				parseDate: function (v) {
					return (!v || v instanceof Date) ? v : ((v.length == 6 || v.length == 8 || v.length == 10) && (Date.parseDate(v, 'd/m/y') || Date.parseDate(v, 'd/m/Y')));
				}
			}, {
				xtype: 'datefield',
				fieldLabel: 'Fecha de fin',
				format: 'd/m/Y',
				id: 'fechafin',
				name: 'fechafin',
				vtype: 'daterange',
				minText: "La fecha fin tiene que ser posterior o igual a la fecha de inicio.",
				maxText: "La fecha de inicio tiene que ser anterior o igual a la fecha fin.",
				startDateField: 'fechainicio',
				invalidText: 'El formato establecido: dd/mm/aaaa.',
				anchor: '99%',
				value: (_this.modificar) ? _this.record.data.fechafin : "",
				maskRe: /[\d\/]/,
				parseDate: function (v) {
					return (!v || v instanceof Date) ? v : ((v.length == 6 || v.length == 8 || v.length == 10) && (Date.parseDate(v, 'd/m/y') || Date.parseDate(v, 'd/m/Y')));
				}
			}, 
			_this.dominios,
			{
				xtype: 'hidden',
				id: 'idnomcargo',
				value: (_this.modificar) ? _this.record.data.idnomcargo : '',
				name: 'idnomcargo'
			}, {
				xtype: 'hidden',
				id: 'idfirma',
				value: (_this.modificar) ? _this.record.data.idfirma : '',
				name: 'idfirma'
			}, {
				xtype: 'hidden',
				id: 'iddominio',
				value: (_this.modificar) ? _this.record.data.iddominio : '',
				name: 'iddominio'
			}],
			listeners: {
				'clientvalidation': function (_form, _valid) {
					if (_valid && _form.getForm().isDirty()) {
						Ext.getCmp("btnCancelar" + _this.name).nextTab = "btnAplicar" + _this.name;
						Ext.getCmp("denominacion" + _this.name).prevTab = "btnAceptar" + _this.name;
						_this.btnAplicar.enable();
						_this.btnAceptar.enable();
					} else {
						Ext.getCmp("btnCancelar" + _this.name).nextTab = "denominacion" + _this.name;
						Ext.getCmp('denominacion' + _this.name).prevTab = "btnCancelar" + _this.name;
						_this.btnAplicar.disable();
						_this.btnAceptar.disable();
					}
				}
			}
		})
		_this.btnAplicar = new Ext.Button({
			text: "Aplicar",
			minWidth: 75, //icon    : perfil.dirImg + 'aplicar.png',
			iconCls: 'aplicar',
			tooltip: "Guardar datos y limpiar los campos",
			id: "btnAplicar" + _this.name,
			handler: function () {
				_this.enviar(true)
			}
		})
		_this.btnAceptar = new Ext.Button({
			text: "Aceptar",
			minWidth: 75, //icon    : perfil.dirImg + 'aceptar.png',
			iconCls: 'aceptar',
			nextTab: "denominacion" + _this.name,
			tooltip: "Guardar datos y cerrar ventana",
			id: "btnAceptar" + _this.name,
			handler: function () {
				_this.enviar(false);
			}
		})
		Ext.apply(this, {
			layout: 'fit',
			items: [_this.valores],
			width: 300,
			autoValidate: false,
			constrain: true,
			resizable: false,
			modal: true,
			// height: 300,
			keys: [{
				key: Ext.EventObject.ENTER, fn: function () {
					_this.btnAceptar.handler.call();
				}
			}, {
				key: Ext.EventObject.INSERT, fn: function () {
					if (!_this.btnAplicar.hidden) {
						_this.btnAplicar.handler.call();
					}
				}
			}],
			buttons: [{
				text: "Cancelar", //icon    : perfil.dirImg + 'cancelar.png',
				iconCls: 'cancelar',
				minWidth: 75,
				prevTab: "fechafin",
				nextTab: "btnAplicar" + _this.name,
				tooltip: "Cerrar ventana sin guardar los datos",
				id: "btnCancelar" + _this.name,
				handler: function () {
					_this.destroy();
				}
			}, _this.btnAplicar, _this.btnAceptar]
		})
		if (this.modificar) {
			this.title = 'Modificar ' + this.title;
			_this.btnAplicar.hidden = true;
		} else {
			this.title = 'Adicionar ' + this.title;
		}
		Nomenclador.Firma.superclass.initComponent.apply(this)
	}, enviar: function (accion) {
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
					url: 'gestionarAcciones', params: {
						clase: _this.name,
						accion: (_this.modificar) ? 'modificar' : 'insertar',
						parametros: Ext.encode(param)
					}, callback: function (options, success, response) {
						Secodena.ocultarMascara('cargaini');
						var responseData = Ext.decode(response.responseText);
						var codMsg = (responseData.codMsg == 4) ? 6 : responseData.codMsg;
						var msg = responseData.mensaje;
						mostrarMensaje(codMsg, msg);
						if (responseData.codMsg == 1) {
							if (!accion) {
								_this.destroy();
							} else {
								form.reset();
							}
							var options = _this.store.lastOptions
							if (_this.isSelected) {
								var start = options.params.start;
								_this.store.load({ params: { start: start, limit: 15 } });
							} else {
								var start = 0;
								if (_this.modificar) {
									_this.store.load({ params: { start: options.params.start, limit: 15 } });
								} else {
									if (options != null) {
										var div = Math.floor(_this.store.totalLength / 15);
										start = 15 * div;
									}
									_this.store.load({ params: { start: start, limit: 15 } });
								}
							}
						} else {
							if (responseData.codMsg != 6) {
								mostrarMensaje(responseData.codMsg, responseData.mensaje, function () {
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
