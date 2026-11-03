Ext.ns('Estructura');
Estructura.Comun = Ext.extend(Ext.Window, {
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
		etiquetas           : etiquetas.estructura, noformal: false, initComponent: function ()
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
						id      : 'btnAplicar',
						prevTab : 'btnCancelar',
						nextTab : "btnAceptar",
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
						iconCls : 'aceptar',
						id      : 'btnAceptar',
						prevTab : (_this.modificar) ? 'btnCancelar' : 'btnAplicar',
						nextTab : "tfdenominacion",
						minWidth: 75,
						tooltip : _this.etiquetas.lbtooltipaceptar,
						handler : function ()
						{
								_this.enviar(true);
						}
				});
				if (_this.idconcepto == 8) {
						_this.noformal = true;
				}
				_this.storeOrgano = new Ext.data.Store({
						url        : _this.urlReal + 'mostrarTipoOrgano', baseParams: {
								idconcepto: _this.idconcepto
						}, autoLoad: true, reader: new Ext.data.JsonReader({
								root: "datos"
						}, [{
								name: 'idorgano'
						}, {
								name: 'denominacion'
						}])
				});
				_this.denominacion = new Ext.form.TextField({
						labelWidth: 40,
						prevTab   : "btnAceptar",
						maxLength : 100,
						fieldLabel: _this.etiquetas.lbdenominacion,
						name      : 'denominacion',
						id        : 'tfdenominacion',
						allowBlank: false,
						anchor    : '99%',
						vtype     : 'vtdenomest'
				});
				_this.codigo = new Ext.form.TextField({
						labelWidth: 40,
						maxLength : 20,
						fieldLabel: _this.etiquetas.lbscodigo,
						name      : 'codigo',
						anchor    : '99%',
						vtype     : 'vtdenomest'
				});
				_this.hiddenIdEspecialidad = new Ext.form.Hidden({
						id: 'hiddenIdEspecialidad' + _this.name, name: 'idespecialidad'
				});
				_this.especialidad = new Ext.form.TextField({
						fieldLabel: _this.etiquetas.lbespecialidad,
						name      : 'especialidad',
						hiddenName: 'especialidad',
						anchor    : '99%',
						id        : 'especialidad' + _this.name,
						emptyText : _this.etiquetas.lbMsgSeleccione,
						maxLength : 100,
						listeners : {
								focus: function ()
								{
										var winEspecialidad = new Go.Int.Especialidad.Ventana({
												etiquetas          : _this.etiquetas,
												componentForValueID: _this.hiddenIdEspecialidad,
												componentForValue  : _this.especialidad
										});
										winEspecialidad.show();
								}
						}
				});
				_this.itemsFormulario = new Array();
				_this.itemsFormulario.push(_this.denominacion);
				_this.height = 150;
				//              if (!_this.noformal) {
				_this.height = 195;
				if (_this.noformal) {
						_this.itemsFormulario.push(_this.codigo);
						_this.height = 240;
				}
				if (_this.idconcepto == 5) {
						_this.height = 240;
						_this.itemsFormulario.push(_this.hiddenIdEspecialidad, _this.especialidad);
				}
				_this.itemsFormulario.push({
						layout: 'column', items: [{
								columnWidth: .6, layout: 'form', labelWidth: 40, labelAlign: 'top', items: [{
										xtype         : 'combo2',
										anchor        : '98%',
										id            : 'comboorgano',
										editable      : true,
										autoCreate    : true,
										store         : _this.storeOrgano,
										forceSelection: true,
										mode          : 'local',
										enableQtip    : true,
										allowBlank    : false,
										fieldLabel    : _this.etiquetas.lbTipoDe + _this.tipoElemento,
										displayField  : 'denominacion',
										valueField    : 'denominacion',
										hiddenName    : 'organo',
										emptyText     : _this.etiquetas.lbMsgSeleccione,
										triggerAction : 'all',
										handler       : function ()
										{
												_this.storeOrgano.removeAll();
												_this.storeOrgano.load();
												Ext.getCmp('hiddenIdOrgano' + _this.name).setValue('');
										},
										listeners     : {
												select: function (combo, record)
												{
														Ext.getCmp('hiddenIdOrgano' + _this.name).setValue(record.data.idorgano);
												}
										}
								}, {
										xtype: 'hidden', name: 'idorgano', id: 'hiddenIdOrgano' + _this.name
								}]
						}, {
								columnWidth: .4,
								layout     : 'form',
								labelWidth : 40,
								labelAlign : 'top',
								bodyStyle  : 'padding: 0 0 0 10px',
								items      : [{
										xtype     : 'textfield',
										fieldLabel: etiquetas.estructura.lbabreviatura,
										name      : 'abreviatura',
										id        : "txabreviatura",
										maxLength : 10,
										nextTab   : "btnCancelar",
										anchor    : '98%',
										vtype     : 'vtalfanumerico'
								}]
						}]
				});
				//              }
				_this.formulario = new Ext.form.FormPanel({
						trackResetOnLoad: true,
						monitorValid    : true,
						listeners       : {
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
						reader          : new Ext.data.JsonReader({
								root: "datos", successProperty: "success"
						}, [{
								name: 'denominacion'
						}, {
								name: 'codigo'
						}, {
								name: 'abreviatura'
						}, {
								name: 'idorgano'
						}, {
								name: 'organo'
						}, {
								name: 'especialidad'
						}, {
								name: 'idespecialidad'
						}]),
						region          : 'center',
						frame           : true,
						layout          : 'form',
						labelAlign      : 'top',
						bodyStyle       : 'padding:5px 5px 0',
						items           : _this.itemsFormulario
				});
				Ext.apply(this, {
						width       : 400,
						layout      : 'fit',
						modal       : true,
						autoValidate: false,
						constrain   : true,
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
								text    : _this.etiquetas.lbBtnCancelar, //                                      icon    : perfil.dirImg + 'cancelar.png',
								iconCls : 'cancelar',
								minWidth: 75,
								nextTab : (_this.modificar) ? _this.btnAceptar.id : _this.btnAplicar.id,
								prevTab : "txabreviatura",
								id      : "btnCancelar",
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
				Estructura.Comun.superclass.initComponent.apply(this);
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
												var codMsg = action.result.codMsg;
												Secodena.ocultarMascara('maskGuardar');
												if (codMsg != 6) {
														mostrarMensaje(action.result.codMsg, action.result.mensaje);
														_this.formulario.getForm().reset();
														if (_this.storeProyecto) {
																_this.storeProyecto.reload();
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
})
