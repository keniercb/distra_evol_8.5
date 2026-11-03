Ext.ns('Gestion');
Gestion.Organigrama = Ext.extend(Ext.Window, {
		initComponent          : function ()
		{
				var _this = this;
				this.initTools();
				_this.store = new Ext.data.Store({
						proxy     : new Ext.data.HttpProxy({
								url: 'listarOrganigramas'
						}), reader: new Ext.data.JsonReader({
								totalProperty: "cant_filas", root: "filas", id: "idorganigrama"
						}, [{
								name: 'idorganigrama', mapping: 'idorganigrama'
						}, {
								name: 'Nombre', mapping: 'Nombre'
						}])
				});
				_this.store.load({params: {start: 0, limit: 10}});
				_this.sm = new Ext.grid.RowSelectionModel({
						singleSelect: true
				});
				_this.sm.on("selectionchange", function (sm)
				{
						if (sm.getSelections().length > 0) {
								_this.btnRecuperar.enable();
								_this.btnEliminar.enable();
								_this.btnModificar.enable();
						} else {
								_this.btnRecuperar.disable();
								_this.btnEliminar.disable();
								_this.btnModificar.disable();
						}
				});
				_this.btnRecuperar = new Ext.Button({
						text    : '<u>R</u>ecuperar',
						disabled: true,
						tooltip : "Recuperar organigrama<b> (Alt+Shift+R)</b>",
						handler : function ()
						{
								_this.recuperarOrganigrama();
								//_this.destroy();
						}, //						icon    : _this.perfil.dirImg + 'recuperaciones.png',
						iconCls : 'recuperaciones'
				})
				_this.btnEliminar = new Ext.Button({
						text   : 'Eliminar', disabled: true, tooltip: "Eliminar organigrama<b> (Del)</b>", handler: function ()
						{
								_this.eliminar();
						}, //						icon    : _this.perfil.dirImg + 'eliminar.png',
						iconCls: 'eliminar'
				})
				_this.btnModificar = new Ext.Button({
						text    : '<u>M</u>odificar',
						disabled: true,
						tooltip : "Modificar denominación del organigrama<b> (Alt+M)</b>",
						handler : function ()
						{
								_this.modificar();
						}, //						icon    : _this.perfil.dirImg + 'modificar.png',
						iconCls : 'modificar'
				})
				_this.grid = new Ext.grid.GridPanel({
						store           : _this.store,
						columns         : [{
								header: "Organigramas", id: 'orga', resizable: false, sortable: true, dataIndex: 'Nombre'
						}],
						sm              : _this.sm,
						frame           : false,
						autoExpandColumn: 'orga',
						autoShow        : true,
						bodyStyle       : 'text-align:center;width:600',
						loadMask        : true,
						autoScroll      : true,
						viewConfig      : {
								autoFill: true
						},
						tbar            : [_this.btnRecuperar, _this.btnModificar, _this.btnEliminar],
						bbar            : new Ext.PagingToolbar({
								pageSize: 10, store: _this.store, displayInfo: true
						}),
						listeners       : {
								dblclick: function ()
								{
										_this.recuperarOrganigrama();
								}
						}
				})
				Ext.apply(this, {
						title      : 'Organigramas existentes',
						modal      : true,
						layout     : 'fit',
						items      : [_this.grid],
						autoScroll : true,
						width      : 500,
						constrain  : true,
						resizable  : false,
						height     : 350,
						closeAction: 'hide',
						plain      : true,
						keys       : [{
								key: 'r',
                            stopEvent:true,
							alt: true, shift: true, fn: function ()
								{
										if (_this.sm.getSelections().length > 0) {
												_this.btnRecuperar.handler.call();
										}
								}
						}, {
								key: 'm',
                            stopEvent:true,
							alt: true,
							fn: function ()
								{
										if (_this.sm.getSelections().length > 0) {
												_this.btnModificar.handler.call();
										}
								}
						}, {
								key: Ext.EventObject.DELETE,
                            stopEvent:true,
							fn: function ()
								{
										if (_this.sm.getSelections().length > 0) {
												_this.btnEliminar.handler.call();
										}
								}
						}]
				})
				Gestion.Organigrama.superclass.initComponent.apply(this)
		}, recuperarOrganigrama: function ()
		{
				var _this = this;
				if (_this.sm.getSelections().length >= 1) {
						Ext.Ajax.request({
								url      : 'recuperarOrganigrama', success: function (resp)
								{
										var xml = Ext.decode(resp.responseText);
										//										_this.destroy();
										dibujarOrganigrama('Organigrama ' + _this.sm.getSelected().get('Nombre'), null, null, xml, false);
								}, params: {
										nombre: _this.sm.getSelected().get('Nombre')
								}
						});
				}
		}, eliminar            : function ()
		{
				var _this = this;
				if (_this.sm.getSelections().length >= 1) {
						var msg = '¿Está seguro que desea eliminar el organigrama seleccionado?'
						mostrarMensaje(2, msg, function (btn)
						{
								if (btn == 'ok') {
										Ext.Ajax.request({
												url        : 'eliminarOrganigrama', success: function ()
												{
												}, params  : {
														nombre: _this.sm.getSelected().get('Nombre')
												}, callback: function (options, success, response)
												{
														var responseData = Ext.decode(response.responseText);
														var codMsg = (responseData.codMsg == 4) ? 6 : responseData.codMsg;
														var msg = responseData.mensaje;
														mostrarMensaje(codMsg, msg);
														if (codMsg == 1) {
																_this.store.reload();
																_this.btnRecuperar.disable();
																_this.btnEliminar.disable();
														}
												}
										});
								}
						})
				}
		}, modificar           : function ()
		{
				var _this = this;
				var denominacion = _this.sm.getSelected().get('Nombre');
				var win = null;
				var btnCancelar = new Ext.Button({
						text    : "Cancelar",
						id:'btnCancelar',
						prevTab : 'tfDenominacion',
						nextTab : 'btnAceptar',
						minWidth: 75,
						iconCls : 'cancelar',
						tooltip : "Cerrar ventana sin guardar los datos",
						handler : function ()
						{
								_this.win.destroy();
						}
				});
				var textDenominacion = new Ext.form.TextField({
						fieldLabel: 'Nombre del organigrama',
						vtype     : 'vtdenominaciones',
						id:'tfDenominacion',
						prevTab : 'btnAceptar',
						nextTab : 'btnCancelar',
						value     : denominacion,
						allowBlank: false,
						maxLength : 100,
						anchor    : '100%'
				});
				var btnAceptar = new Ext.Button({
						text    : "Aceptar",
						minWidth: 75,
						disabled: true,
						id:'btnAceptar',
						prevTab : 'btnCancelar',
						nextTab : 'tfDenominacion',
						iconCls : 'aceptar',
						tooltip : "Guardar datos y cerrar ventana",
						handler : function ()
						{
								_this.modificarNombre(textDenominacion.getValue())
						}
				});
				var formulario = new Ext.form.FormPanel({
						trackResetOnLoad: true, monitorValid: true, listeners: {
								'clientvalidation': function (form, valid)
								{
										if (form.getForm().isDirty() && valid) {
												btnAceptar.enable();
										} else {
												btnAceptar.disable();
										}
								}
						}, frame        : true, layout: 'form', labelAlign: 'top', items: textDenominacion
				});
				_this.win = new Ext.Window({
						title          : 'Modificar nombre organigrama',
						layout         : 'form',
						autoValidate   : true,
						validateDefault: true,
						width          : 250,
						resizable      : false,
						modal          : true,
						draggable      : false,
						items          : [formulario],
						closeAction    : 'destroy',
						buttons        : [btnCancelar, btnAceptar],
						listeners      : {
								show: function ()
								{
										textDenominacion.focus(false, 10)
								}
						}
				});
				_this.win.show();
		}, modificarNombre     : function (text)
		{
				var _this = this;
				Ext.Ajax.request({
						url      : 'modificarOrganigrama', disableCaching: true, success: function ()
						{
								_this.store.reload();
								_this.btnRecuperar.disable();
								_this.btnEliminar.disable();
								_this.win.close();
						}, params: {
								nombre: _this.sm.getSelected().get('Nombre'), nuevoNombre: text
						}
				});
		}
})
