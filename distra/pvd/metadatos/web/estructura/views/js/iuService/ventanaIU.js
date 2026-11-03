Ext.ns('Ext.estructura.window');
Ext.estructura.window.winSelectEstructura = Ext.extend(Ext.Window, {
		width            : 600,
		title            : 'Ventana estructura',
		checker          : false,
		checked          : false,
		inicial          : false,
		menu             : true,
		cargos           : true,
		limit            : false,
		proyecto         : 0,
		isGestionProyecto: false,
		/**Configuracion de la ventana*/
		closeAction      : 'destroy',
		resizable        : false,
		modal            : true,
		aceptarSeleccion : function (btn)
		{
				var nodoSeleccionado = this.panelEstructura.dameSeleccion();
				if (nodoSeleccionado) {
						this.fireEvent('dameseleccion', this, nodoSeleccionado, btn);
						if (this.closeAction != 'hide') {
								this.close();
						} else {
								this.hide();
						}
				} else {
						return false;
				}
		},
		initComponent    : function ()
		{
				var _this = this;
				this.initTools();
				_this.panelEstructura = new Ext.estructura.panel.PanelEstructura({
						border           : false,
						checker          : _this.checker,
						checked          : _this.checked,
						inicial          : _this.inicial,
						cargos           : _this.cargos,
						limit            : _this.limit,
						proyecto         : _this.proyecto,
						isGestionProyecto: _this.isGestionProyecto,
						menu             : _this.menu
				});
				_this.btnAceptar = new Ext.Button({
						text   : "Aceptar",
						prevTab: 'btnCancelar',
						nextTab: 'tfBuscar' + _this.proyecto,
						minWidth: 75,
						disabled: true,
						id      : 'btnAceptar',
						iconCls : 'aceptar',
						tooltip : "Capturar los datos seleccionados y cerrar ventana",
						handler : function ()
						{
								_this.aceptarSeleccion(true);
						}
				});
				_this.panelEstructura.on('dameseleccion', function (_tree, _n)
				{
						if (_n.length > 0) {
								_this.btnAceptar.enable();
						} else {
								_this.btnAceptar.disable();
						}
				})
				_this.btnCancelar = new Ext.Button({
						text    : "Cancelar",
						minWidth: 75,
						id      : 'btnCancelar',
						prevTab : 'btnColapsar' + _this.proyecto,
						nextTab : 'btnAceptar',
						iconCls : 'Cancelar',
						tooltip : "Cerrar ventana sin capturar los datos",
						handler : function ()
						{
								_this.fireEvent('cancelar', this);
								if (_this.closeAction != 'hide') {
										_this.close();
								} else {
										_this.hide();
								}
						}
				});
				Ext.apply(this, {
						layout      : 'fit',
						autoValidate: true,
						items       : [_this.panelEstructura],
						buttons     : [_this.btnCancelar, _this.btnAceptar]
				})
				Ext.estructura.window.winSelectEstructura.superclass.initComponent.call(this);
				_this.addEvents(/**
						 * @event dameseleccion
						 * Es disparado al presionar el boton aceptar de la ventana.
						 */
						'dameseleccion', /**
						 * @event cancelar
						 * Es disparado al presionar el boton cancelar de la ventana.
						 */
						'cancelar');
		}
});
