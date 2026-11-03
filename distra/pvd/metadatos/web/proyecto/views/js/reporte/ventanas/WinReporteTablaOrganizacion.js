Ext.ns('Win.Reporte');
Win.Reporte.TablaOrganizacion = Ext.extend(Ext.Window, {
		title        : 'Configuración de reporte',
		proyecto     : 0,
		url          : 'reporteCargos',
		estructuras  : new Array(),
		initComponent: function ()
		{
				var _this = this;
				this.initTools();
				_this.btnAceptar = new Ext.Button({
						text    : "Generar reporte",
						minWidth: 75,
						disabled: true,
						nextTab : "cbFormato",
						id      : "btnAceptar",
						iconCls : 'aceptar',
						tooltip : "Guardar datos y cerrar ventana",
						handler : function ()
						{
								_this.enviar();
						}
				});
				_this.btnCancelar = new Ext.Button({
						text    : "Cancelar",
						minWidth: 75,
						iconCls : 'cancelar',
						prevTab : "cbGradosMilitares",
						tooltip : "Cerrar ventana sin guardar los datos",
						handler : function ()
						{
								_this.close();
						}
				});
				_this.storeFormato = new Ext.data.SimpleStore({
						fields: ['id', 'valor'], data: [['A3', 'A3'], ['A4', 'A4'], ['Letter', 'Carta'], ['Legal', 'Legal']]
				});
				_this.comboFormato = new Ext.form.ccoe.ComboBox({
						fieldLabel    : etiquetas.reporte.lbFormato,
						anchor        : '98%',
						name          : "formato",
						id            : "cbFormato",
						prevTab       : "btnAceptar",
						store         : _this.storeFormato,
						editable      : false,
						displayField  : 'valor',
						valueField    : 'id',
						typeAhead     : true,
						allowBlank    : true,
						mode          : 'local',
						forceSelection: true,
						triggerAction : 'all',
						hideTriggers  : true,
						emptyText     : etiquetas.reporte.lbSeleccFormato,
						selectOnFocus : true
				})
				_this.checkerCiviles = new Ext.form.Checkbox({
						hideLabel: true,
						checked  : true,
						boxLabel : etiquetas.reporte.lbCategorias,
						id       : "cbCiviles",
						prevTab  : "cbFormato"
				})
				_this.checkerMilitares = new Ext.form.Checkbox({
						hideLabel: true,
						checked  : true,
						boxLabel : etiquetas.reporte.lbGrados,
						nextTab  : _this.btnCancelar.id,
						id       : "cbGradosMilitares",
						prevTab  : "cbCiviles",
				})
				_this.formulario = new Ext.FormPanel({
						layout      : 'form',
						monitorValid: true,
						frame       : true,
						bodyStyle   : 'padding: 5px 0 0 0;',
						labelAlign  : 'top',
						items       : [_this.comboFormato, {
								xtype     : 'fieldset',
								title     : 'Contenido',
								anchor    : '98%',
								autoHeight: true,
								items     : [_this.checkerCiviles, _this.checkerMilitares]
						}],
						listeners   : {
								'clientvalidation': function (_form, _valid)
								{
										if (_valid) {
												_this.btnAceptar.enable();
										} else {
												_this.btnAceptar.disable();
										}
								}
						}
				});
				Ext.apply(this, {
						layout      : 'fit',
						items       : [_this.formulario],
						width       : 220,
						height      : 245,
						constrain   : true,
						resizable   : false,
						constrain   : true,
						closeAction : 'hide',
						modal       : true,
						bufferResize: true,
						buttons     : [_this.btnCancelar, _this.btnAceptar]
				})
				Win.Reporte.TablaOrganizacion.superclass.initComponent.apply(this)
		},
		enviar       : function ()
		{
				var _this = this;
				var dir = "proyecto=" + _this.proyecto;
				var formato = _this.comboFormato.getValue();
				if (formato != '') {
						dir += "&formato=" + formato;
				}
				if (_this.estructuras.length > 0) {
						dir += "&idNodos=" + Ext.encode(_this.estructuras);
				}
				var civiles = _this.checkerCiviles.getValue();
				if (civiles) {
						dir += "&civiles=1";
				}
				var militares = _this.checkerMilitares.getValue();
				if (militares) {
						dir += "&militares=1";
				}
				var idIFrame = Ext.id();
				var win = new Go.Pdf.Visor({
						url: _this.url, params: dir, idIframe: idIFrame
				});
				win.show();
				Secodena.mostrarMascara('reporte', '', 'Generando reporte...');
				document.getElementById(idIFrame).onload = function ()
				{
						Secodena.ocultarMascara('reporte');
						var iframeDocument = this.contentDocument;
						if (iframeDocument) {
								var response = iframeDocument.documentElement.textContent;
								response = Ext.decode(response);
								if (response.codMsg) {
										mostrarMensaje(response.codMsg, response.mensaje);
										win.destroy();
								}
						}
				};
				_this.destroy();
		}
})
