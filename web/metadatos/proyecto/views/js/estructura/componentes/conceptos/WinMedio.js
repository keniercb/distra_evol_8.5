/**VENTANA PARA LA INSERCION DE LOS MEDIOS EN LA ESTRUCTURA*/
Ext.ns('Estructura');
Estructura.Medio = Ext.extend(Ext.Window, {
		/**
		 * Identificador del elemento a gestionar (1, 2, 5, 6)
		 * */
		idconcepto          : false, /**
		 * Nodo padre del elemento para la recarga en caso de inserción
		 * o el nodo a modificar en caso de modificacion
		 * */
		nodo                : null, /**
		 * TreeLoader de la estructura que se gestiona
		 * */
		loaderTreeEstructura: null, /**
		 * Nombre del tipo de elemento para la label del tipo del mismo
		 * */
		tipoElemento        : null, /**
		 * Identificador del proyecto al que pertenece
		 * */
		proyecto            : null, /**
		 * Store del grid de proyecto para recargar el cambio en el proyecto
		 * */
		storeProyecto       : null, /**
		 * Título de la ventana
		 * */
		title               : '', /**
		 * Para conocer si se esta modificando o adicionando un nuevo elemento
		 * */
		modificar           : false, /**
		 * Name del elemento para los identificadores de sus componentes
		 * */
		name                : null, /**
		 * Etiquetas del sistema
		 * */
		etiquetas           : etiquetas.estructura, initComponent: function ()
		{
				var _this = this;
				_this.rutaUrl = 'estructura';
				if (_this.proyecto) {
						_this.isGestionProyecto = true;
				}
				if (_this.isGestionProyecto) {
						_this.rutaUrl = 'proyecto';
				}
				/**
				 * @cfg {String} url
				 * Cambia la ruta para las peticiones de estructura en el panel
				 */
				_this.urlReal = '/metadatos/' + _this.rutaUrl + '/index.php/' + _this.rutaUrl + '/';
				_this.btnAplicar = new Ext.Button({
						text    : _this.etiquetas.lbBtnAplicar,
						iconCls : 'aplicar',
						id      : "btnAplicarMedio",
						nextTab : "btnAceptarMedio",
						prevTab : 'btnCancelarMedio',
						minWidth: 75,
						hidden  : _this.modificar,
						tooltip : _this.etiquetas.lbtooltipaplicar,
						handler : function ()
						{
								_this.enviar();
						}
				});
				_this.btnAceptar = new Ext.Button({
						text    : _this.etiquetas.lbBtnAceptar,
						id      : "btnAceptarMedio",
						nextTab : 'denominacion' + _this.name,
						prevTab : (_this.modificar) ? 'btnCancelarMedio' : 'btnAplicarMedio',
						iconCls : 'aceptar',
						minWidth: 75,
						tooltip : _this.etiquetas.lbtooltipaceptar,
						handler : function ()
						{
								_this.enviar(true);
						}
				});
				_this.storeTipoMedio = new Ext.data.Store({
						id       : 'idtipomedio', url: 'mostrarTipoMedio', autoLoad: true, baseParams: {
								idconcepto: _this.idconcepto
						}, reader: new Ext.data.JsonReader({
								root: "datos", id: "idtipomedio"
						}, [{name: 'idtipomedio'}, {name: 'denominacion'}])
				});
				_this.tipo = new Array();
				_this.tipo.push('medio');
				_this.stIcono = new Ext.data.Store({
						url: 'mostrarIconos', autoload: true, reader: new Ext.data.JsonReader({
								root: "datos"
						}, [{name: 'idicono'}, {name: 'icono'}, {name: 'denominacion'}])
				})
				_this.stIcono.baseParams.parametros = _this.tipo;
				_this.stIcono.load();
				_this.formulario = new Ext.form.FormPanel({
						width              : 420,
						height             : 90,
						monitorValid       : true,
						listeners          : {
								'clientvalidation': function (form, valid)
								{
										if (form.getForm().isDirty() && valid) {
												_this.btnAplicar.enable();
												_this.btnAceptar.enable();

										} else {

												_this.btnAplicar.disable();
												_this.btnAceptar.disable();
										}
								}
						},
						trackResetOnLoad   : true,
						reader             : new Ext.data.JsonReader({
								root: "datos", successProperty: "success"
						}, [{
								name: 'denominacion'
						}, {
								name: 'idnommedio', mapping: 'idmedio'
						}, {
								name: 'cantidad'
						}, {
								name: 'icono'
						}, {
								name: 'nombre_imagen'
						}, {
								name: 'idtipomedio'
						}, {
								name: 'tipomedio'
						}]),
						region             : 'center',
						frame              : true,
						layout             : 'form',
						labelAlign         : 'top',
						bodyStyle          : 'padding:5px 5px 0',
						items              : [{
								layout: 'column', items: [{
										columnWidth: .8, layout: 'form', labelWidth: 40, labelAlign: 'top', items: [{
												xtype     : 'textfield',
												fieldLabel: 'Denominación',
												nextTab   : 'nbcantidad',
												prevTab   : 'btnCancelarMedio',
												name      : 'denominacion',
												id        : 'denominacion' + _this.name,
												allowBlank: false,
												anchor    : '100%',
												listeners : {
														focus: function ()
														{
																var _vistaItems = new LOG.lb.maestroproductos.UIArbolProductos({
																		doAction: function (n)
																		{
																				Ext.getCmp(('denominacion' + _this.name)).setValue(n.text);
																				Ext.getCmp(('hiddenIdNomMedio' + _this.name)).setValue(n.id);
																		}
																});
																_vistaItems.show();
														}
												}
										}, {
												xtype: 'hidden', name: 'idnommedio', id: 'hiddenIdNomMedio' + _this.name
										}]
								}, {
										columnWidth: .2,
										layout     : 'form',
										labelWidth : 40,
										labelAlign : 'top',
										bodyStyle  : 'padding: 0 0 0 10px',
										items      : [{
												xtype        : 'numberfield',
												fieldLabel   : 'Cantidad',
												maxLength    : 10,
												nextTab      : 'combotipomedio' + _this.name,
												prevTab      : 'denominacion' + _this.name,
												id           : "nbcantidad",
												minValue     : 1,
												name         : 'cantidad',
												allowDecimals: false,
												allowNegative: false,
												allowBlank   : false,
												anchor       : '95%'
										}]
								}]
						}, {
								layout: 'column', items: [{
										columnWidth: .5, layout: 'form', labelWidth: 40, labelAlign: 'top', items: [{
												xtype         : 'combo2',
												anchor        : '98%',
												id            : 'combotipomedio' + _this.name,
												autoCreate    : true,
												nextTab       : 'nombre_imagen',
												prevTab       : 'nbcantidad',
												store         : _this.storeTipoMedio,
												mode          : 'local',
												forceSelection: true,
												enableQtip    : true,
												allowBlank    : false,
												fieldLabel    : etiquetas.estructura.lbcombotipomedio,
												displayField  : 'denominacion',
												valueField    : 'denominacion',
												hiddenName    : 'tipomedio',
												emptyText     : etiquetas.estructura.lbMsgSeleccione,
												triggerAction : 'all',
												handler       : function ()
												{
														this.store.removeAll();
														this.store.load();
														Ext.getCmp('hiddenIdTipoMedio' + _this.name).setValue('');
												},
												listeners     : {
														select: function (combo, record)
														{
																Ext.getCmp('hiddenIdTipoMedio' + _this.name).setValue(record.data.idtipomedio);
														}
												}
										}, {
												xtype: 'hidden', id: 'hiddenIdTipoMedio' + _this.name, name: 'idtipomedio'
										}]
								}, {
										columnWidth: .5,
										layout     : 'form',
										labelWidth : 40,
										labelAlign : 'top',
										bodyStyle  : 'padding: 0 0 0 10px',
										items      : [{
												xtype       : 'imagencombo',
												id          : 'nombre_imagen',
												name        : 'nombre_imagen',
												valueField  : 'denominacion',
												displayField: 'denominacion',
												emptyText   : "Seleccione...",
												prevTab     : 'combotipomedio' + _this.name,
												nextTab     : 'btnCancelarMedio',
												parent      : 'medio',
												anchor      : '98%',
												store       : _this.stIcono,
												listeners   : {
														select: function (combo, record)
														{
																Ext.getCmp('icono' + _this.name).setValue(record.data.idicono);
														}
												}
										}, {
												xtype: 'hidden', id: 'icono' + _this.name, name: 'icono'
										}]
								}]
						}]
				});
				Ext.apply(this, {
						width       : 400,
						autoValidate: false,
						height      : 200,
						layout      : 'fit',
						constrain   : true,
						modal       : true,
						resizable   : false,
						items       : [_this.formulario],
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
								text    : _this.etiquetas.lbBtnCancelar,
								iconCls : 'cancelar',
								minWidth: 75,
								prevTab : 'nombre_imagen',
								nextTab : (_this.modificar)?'btnAceptarMedio':'btnAplicarMedio',
								id      : 'btnCancelarMedio',
								tooltip : _this.etiquetas.lbtooltipcancelar,
								handler : function ()
								{
										_this.destroy();
								}
						}, _this.btnAplicar, _this.btnAceptar]
				})
				if (_this.modificar) {
						_this.url = _this.urlReal + 'modificarValores';
						_this.message = _this.etiquetas.lbSaveOrgano;
						_this.title = 'Modificar ' + _this.tipoElemento;
						_this.btnAplicar.hidden = true;
				} else {
						_this.title = 'Adicionar ' + _this.tipoElemento;
						_this.url = _this.urlReal + 'insertaValores';
						_this.message = _this.etiquetas.lbMsgGuardando;
				}
				Estructura.Medio.superclass.initComponent.apply(this);
				_this.addEvents('afterInsert');
		}, enviar           : function (destroy)
		{
				var _this = this;
				if (_this.formulario.getForm().isValid()) {
						if (_this.formulario.getForm().isDirty()) {
								Secodena.mostrarMascara('maskGuardar', '', _this.message);
								_this.formulario.getForm().submit({
										url       : _this.url, params: {
												idnodo: _this.nodo.id, idconcepto: _this.idconcepto, proyecto: _this.proyecto
										}, failure: function (form, action)
										{
												mostrarMensaje(action.result.codMsg, action.result.mensaje);
												var codMsg = action.result.codMsg;
												Secodena.ocultarMascara('maskGuardar');
												if (codMsg != 6) {
														_this.formulario.getForm().reset();
														if (_this.storeProyecto) {
																_this.storeProyecto.load({params: {start: 0, limit: 18}});
														}
														if (destroy) {
																_this.destroy();
														}
												}
												if (codMsg != 6 && codMsg != 3) {
														mostrarMensaje(action.result.codMsg, action.result.mensaje);
														var node;
														if (!_this.modificar) {
																node = _this.nodo;
																node.leaf = false;
																if (node.isExpanded() || node.attributes.leaf == true) {
																		_this.loaderTreeEstructura.load(node);
																}
																node.expand();
																_this.fireEvent('afterInsert', _this);
														} else {
																node = _this.nodo.parentNode;
																_this.loaderTreeEstructura.load(node);
																node.expand();
														}
												}
										}
								})
						} else {
								mostrarMensaje(6, _this.etiquetas.lbMsgNoModifico);
						}
				}
		}, loadDatos        : function ()
		{
				var _this = this;
				_this.formulario.getForm().load({
						url       : _this.urlReal + 'cargarDatos', waitMsg: _this.etiquetas.lbload, params: {
								identificador: _this.nodo.id,
								idconcepto   : _this.idconcepto,
								proyecto     : _this.nodo.attributes.idproyecto
						}, success: function ()
						{
								var formulario = _this.formulario.getForm();
								formulario.setValues(formulario.getValues());
						}
				})
		}
});
