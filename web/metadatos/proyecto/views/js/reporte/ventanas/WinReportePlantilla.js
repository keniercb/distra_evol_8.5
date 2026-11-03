	Ext.ns('Win.Reporte');
Win.Reporte.Plantilla = Ext.extend(Ext.Window, {
		title                      : etiquetas.reporte.lbPlantillaConfiguracion,
		proyecto                   : 0,
		isGestionProyecto          : false,
		url                        : 'reportePlantilla',
		estructuras                : new Array(),
		initComponent              : function ()
		{
				var _this = this;
				this.initTools();
				_this.btnAceptar = new Ext.Button({
						text    : "Generar reporte",
						minWidth: 75,
						nextTab : "comboResolucion" + _this.proyecto,
						prevTab : 'btnCancelar',
						id      : 'btnAcpetar',
						disabled: true,
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
						id      : 'btnCancelar',
						nextTab : 'btnAcpetar',
						prevTab : 'elabora' + _this.proyecto,
						iconCls : 'cancelar',
						tooltip : "Cerrar ventana sin guardar los datos",
						handler : function ()
						{
								_this.close();
						}
				});
				_this.storeFirma = new Ext.data.Store({
						url: 'mostrarFirma', autoLoad: true, reader: new Ext.data.JsonReader({
								root: "datos"
						}, [{name: 'idfirma'}, {name: 'persona'}])
				});
				_this.textAprueba = new Ext.form.ccoe.ComboBox({
						anchor        : '98%',
						editable      : true,
						name          : 'aprueba',
						id            : 'aprueba' + _this.proyecto,
						autoCreate    : true,
						emptyText     : "Seleccione...",
						prevTab       : "chbMilitares",
						nextTab       : 'elabora' + _this.proyecto,
						store         : _this.storeFirma,
						mode          : 'local',
						forceSelection: true,
						enableQtip    : true,
						allowBlank    : true,
						fieldLabel    : "Aprueba",
						displayField  : 'persona',
						valueField    : 'idfirma',
						triggerAction : 'all'
				});
				_this.textElabora = new Ext.form.ccoe.ComboBox({
						anchor    : '98%',
						editable  : true,
						name      : 'elabora',
						id        : 'elabora' + _this.proyecto,
						prevTab   : 'aprueba' + _this.proyecto,
						nextTab   : 'btnCancelar',
						autoCreate: true,
						emptyText : "Seleccione...",
						store         : _this.storeFirma,
						mode          : 'local',
						forceSelection: true,
						enableQtip    : true,
						allowBlank    : true,
						fieldLabel    : "Elabora",
						displayField  : 'persona',
						valueField    : 'idfirma',
						triggerAction : 'all'
				})
				_this.textElabora.on('select', function (combo, record, index)
				{
						if (_this.textAprueba.isDirty()) {
								if (_this.textAprueba.getRawValue() == _this.textElabora.getRawValue()) {
										_this.textElabora.reset();
										mostrarMensaje(1, 'El nombre de la persona que aprueba no puede ser igual a la que elabora.');
								}
						}
				});
				_this.textAprueba.on('select', function (combo, record, index)
				{
						if (_this.textElabora.isDirty()) {
								if (_this.textElabora.getRawValue() == _this.textAprueba.getRawValue()) {
										_this.textAprueba.reset();
										mostrarMensaje(1, 'El nombre de la persona que aprueba no puede ser igual a la que elabora.');
								}
						}
				});
				_this.storeFormato = new Ext.data.SimpleStore({
						fields: ['id', 'valor'], data: [['A4', 'A4'], ['Letter', 'Carta'], ['Legal', 'Legal']]
				});
				_this.storeResolucion = new Ext.data.SimpleStore({
						fields: ['id', 'valor'],
						data  : [['MTSS', 'MTSS - Resolución No. 29/2014 | 27/6/2014'], ['GAE', 'GAE - Resolución No. 36/2010 | 7/10/2010'], ['MINFAR', 'DIRECTIVA 1 - MINFAR']]
				});
				_this.comboResolucion = new Ext.form.ccoe.ComboBox({
						fieldLabel    : etiquetas.reporte.lbPlantilla,
						anchor        : '100%',
						id            : "comboResolucion" + _this.proyecto,
						name          : "resolucion",
						store         : _this.storeResolucion,
						prevTab       : 'btnAcpetar',
						nextTab       : "comboFormato" + _this.proyecto,
						value         : 'MTSS',
						displayField  : 'valor',
						editable      : false,
						valueField    : 'id',
						typeAhead     : true,
						prevTab       : "btnAcpetar",
						mode          : 'local',
						forceSelection: true,
						triggerAction : 'all',
						hideTriggers  : true,
						emptyText     : etiquetas.reporte.lbPlantillas,
						selectOnFocus : true,
						listeners     : {
								select: function (combo, record)
								{
										var id = record.data.id;
										_this.anexoOrganigrama.enable();
										_this.anexoResumen.enable();
										_this.anexoPlantilla.enable();
										if (id == 'MTSS') {
												_this.fechaResolucion.disable();
												_this.numHoja.disable();
												_this.militares.show();
										} else {
												_this.fechaResolucion.enable();
												if (id == 'GAE') {
														_this.numHoja.enable();
														_this.militares.hide();
												} else {
														_this.anexoOrganigrama.disable();
														_this.anexoResumen.disable();
														_this.anexoPlantilla.disable();
												}
										}
								}
						}
				});
				_this.fechaResolucion = new Ext.form.DateField({
						name          : 'fecha',
						format        : 'd/m/Y',
						fieldLabel    : 'Fecha de resolución',
						forceSelection: true,
						prevTab       : "comboFormato" + _this.proyecto,
						nextTab       : "txHoja",
						emptyText     : 'Seleccione...',
						anchor        : '95%',
						id            : 'fecharesolucion',
						disabled      : true,
						allowBlank    : false
				});
				_this.comboFormato = new Ext.form.ccoe.ComboBox({
						fieldLabel    : etiquetas.reporte.lbFormato,
						anchor        : '95%',
						id            : "comboFormato" + _this.proyecto,
						name          : "formato",
						store         : _this.storeFormato,
						displayField  : 'valor',
						valueField    : 'id',
						editable      : false,
						typeAhead     : true,
						mode          : 'local',
						forceSelection: true,
						triggerAction : 'all',
						hideTriggers  : true,
						emptyText     : etiquetas.reporte.lbSeleccFormato,
						selectOnFocus : true
				})
				_this.numHoja = new Ext.form.NumberField({
						name           : 'hoja',
						id             : 'txHoja',
						fieldLabel     : 'No. Hoja inicial',
						prevTab        : "fecharesolucion",
						nextTab        : "chxOrganigrama",
						minValue       : 1,
						style          : "text-align: right;",
						value          : 1,
						allowNegative  : false,
						allowDecimals  : false,
						anchor         : '100%',
						disabled       : true,
						enableKeyEvents: true,
						allowBlank     : false,
						listeners      : {
								keypress: function (nf, event)
								{
										var value = nf.getValue();
										if (event.getCharCode() == 38) {
												nf.setValue(value + 1);
										} else {
												if (event.getCharCode() == 40) {
														if (value > nf.minValue) {
																nf.setValue(value - 1);
														}
												}
										}
								}
						}
				});
				_this.datosOrganigrama = null;
				_this.anexoOrganigrama = new Ext.form.Checkbox({
						hideLabel: true,
						id       : 'chxOrganigrama',
						boxLabel : 'Organigrama empresarial',
						prevTab  : "txHoja",
						nextTab  : "chxAjustar",
						name     : 'anexoOrganigrama',
						listeners: {
								check: function (checkbox, checked)
								{
										if (checked) {
												var win = Ext.getCmp('gestionOrganigrama' + _this.id);
												if (!win) {
														win = new Ext.estructura.window.winSelectEstructura({
																title            : 'Selección organigrama',
																id               : 'gestionOrganigrama' + _this.id,
																checker          : true,
																closable         : false,
																proyecto         : _this.proyecto,
																isGestionProyecto: _this.isGestionProyecto,
																checked          : {
																		concepto: [5]
																},
																menu             : false,
																cargos           : false,
																closeAction      : 'hide',
																listeners        : {
																		dameseleccion: function (window, data)
																		{
																				var datos = _this.construirDatosOrganigrama(data);
																				if (datos) {
																						_this.datosOrganigrama = datos.id;
																						_this.ajustar.enable();
																				} else {
																						_this.ajustar.setValue(false);
																						_this.ajustar.disable();
																						checkbox.setValue(false);
																				}
																		}, cancelar  : function ()
																		{
																				checkbox.setValue(false);
																		}
																}
														});
												}
												win.show();
										} else {
												_this.datosOrganigrama = null;
												_this.ajustar.setValue(false);
												_this.ajustar.disable();
										}
								}
						}
				})
				_this.ajustar = new Ext.form.Checkbox({
						hideLabel: true,
						id       : 'chxAjustar',
						boxLabel : 'Ajustar',
						disabled : true,
						name     : 'ajustar',
						prevTab  : "chxOrganigrama",
						nextTab  : "chxAResumen",
				})
				_this.anexoResumen = new Ext.form.Checkbox({
						hideLabel: true,
						id       : 'chxAResumen',
						boxLabel : 'Resumen de personal y cargos',
						prevTab  : "chxAjustar",
						nextTab  : "chxAPlantilla",
						checked  : true,
						name     : 'anexoResumen'
				})
				_this.anexoPlantilla = new Ext.form.Checkbox({
						hideLabel: true,
						id       : 'chxAPlantilla',
						boxLabel : 'Plantilla de cargos',
						prevTab  : "chxAResumen",
						nextTab  : "chbMilitares",
						checked  : true,
						name     : 'anexoPlantilla'
				})
				_this.militares = new Ext.form.Checkbox({
						hideLabel: true,
						id       : 'chbMilitares',
						boxLabel : 'Incluir cargos militares',
						name     : 'militares',
						prevTab  : "chxAPlantilla",
						nextTab  : 'aprueba' + _this.proyecto,
				});
                _this.guardarHistorial = new Ext.form.Checkbox({
                boxLabel: 'Guardar historial',
                //fieldLabel : 'Guardar historial',
                hideLabel: true,
                disabled : (_this.estructuras.length>1||_this.estructuras.length==0),
                name: 'historial',
                hiddenName: 'historial',
                id: 'chk_historial'
            });
				_this.formulario = new Ext.FormPanel({
						frame        : true, width: 350, monitorValid: true, scope: this, items: [{
								xtype     : 'fieldset',
								title     : 'Configuración',
								anchor    : '98%',
								layout    : 'form',
								labelAlign: 'left',
								labelWidth: 80,
								autoHeight: true,
								items     : [_this.comboResolucion, {
										layout: 'column', items: [{
												columnWidth: .4, layout: 'form', labelAlign: 'top', items: _this.comboFormato
										}, {
												columnWidth: .4,
												layout     : 'form',
												labelWidth : 60,
												labelAlign : 'top',
												items      : _this.fechaResolucion
										}, {
												columnWidth: .2, layout: 'form', labelWidth: 60, labelAlign: 'top'
										, items: _this.numHoja
										}]
								}]
						}, {
								layout: 'column', items: [{
										columnWidth: 1, layout: 'form'
							, labelWidth: 40, labelAlign: 'top'
							, items: [{
												layout: 'column', items: [{
														columnWidth: .55,
														layout     : 'form',
														labelWidth : 40,
														labelAlign : 'top',
														bodyStyle  : 'padding-right:10px',
														items      : [{
																xtype   : 'fieldset', title: 'Contenido', height: 165, defaults: {
																		layout: 'form', labelWidth: 40, labelAlign: 'top'
																}, items: [{
																		layout: 'column', bodyStyle: 'margin-top:-10px', items: [{
																				columnWidth: .78, layout: 'form', items: [_this.anexoOrganigrama]
																		}, {
																				columnWidth: .22, layout: 'form', items: [_this.ajustar]
																		}]
																}, {
																		bodyStyle: 'margin-top:-10px', items: [_this.anexoResumen]
																}, {
																		bodyStyle: 'margin-top:-10px', items: [_this.anexoPlantilla]
																}, {
																		bodyStyle: 'margin-top:-5px', items: [{
																				html: '<hr style="border-color: #FFF">'
																		}]
																}, {
																		bodyStyle: 'margin-top:-5px', items: [_this.militares]
																}, {
																		bodyStyle: 'margin-top:-5px', items: [_this.guardarHistorial]
																}]
														}]
												}, {
														columnWidth: .45, //																						layout     : 'form',
														bodyStyle  : 'padding-right:10px', items: [{
																xtype : 'fieldset',
																title : 'Responsables',
																anchor: '100%',
																height: 135,
																items : [_this.textAprueba, _this.textElabora]
														}]
												}]
										}]
								}]
						}], listeners: {
								'clientvalidation': function (_form, _valid)
								{
										var anexoOrganigrama = _this.anexoOrganigrama.checked;
										var anexoResumen = _this.anexoResumen.checked;
										var anexoPlantilla = _this.anexoPlantilla.checked;
										if (_valid && (anexoOrganigrama || anexoResumen || anexoPlantilla)) {
												_this.btnAceptar.enable();
										} else {
												_this.btnAceptar.disable();
										}
								}, 'render'       : function (_form, _pos)
								{
										Go.Util.orderTabIndices(_form);
								}
						}
				});
				Ext.apply(this, {
						layout   : 'fit',
						modal    : true,
						width    : 570,
						height   : 400,
						constrain: true,
						resizable: false,
						items    : [_this.formulario],
						buttons  : [_this.btnCancelar, _this.btnAceptar]
				})
				Win.Reporte.Plantilla.superclass.initComponent.apply(this)
		},
		buscarPadreEnArreglo       : function (arreglo, idpadre)
		{
				for (var i = 0; i < arreglo.length; i++) {
						if (arreglo[i].id == idpadre) {
								return i;
						}
				}
				return null;
		},
		comprobarRaicesOrganigrama : function (arreglo)
		{
				var rgt = parseInt(arreglo[0].attributes._rgt);
				var lft = parseInt(arreglo[0].attributes._lft);
				for (var i = 1; i < arreglo.length; i++) {
						if (lft > parseInt(arreglo[i].attributes._lft) || rgt < parseInt(arreglo[i].attributes._rgt)) {
								return false;
						} else {
								if (this.buscarPadreEnArreglo(arreglo, parseInt(arreglo[i].attributes._parent)) == null) {
										return false;
								}
						}
				}
				return true;
		},
		comprobarNivelesOrganigrama: function (arreglo)
		{
				var nivelInicial = parseInt(arreglo[0].attributes.nivel);
				var nivel = 0;
				for (var i = 1; i < arreglo.length; i++) {
						if (nivel < parseInt(arreglo[i].attributes.nivel)) {
								nivel = parseInt(arreglo[i].attributes.nivel);
						}
				}
				nivel = nivel - nivelInicial;
				return nivel;
		},
		construirDatosOrganigrama  : function (datos)
		{
				if (!this.comprobarRaicesOrganigrama(datos)) {
						mostrarMensaje(6, 'El organigrama solo admite una raiz de contenido');
						return false;
				} else {
						if (this.comprobarNivelesOrganigrama(datos) > 2) {
								mostrarMensaje(6, 'El organigrama no admite mas de tres niveles estructurales');
								return false;
						} else {
								var organigrama = new Array();
								var ids = new Array();
								for (var i = 0; i < datos.length; i++) {
										ids.push(parseInt(datos[i].id));
										organigrama.push({
												id   : parseInt(datos[i].id),
												text : datos[i].attributes.denominacion,
												padre: parseInt(datos[i].attributes._parent)
										})
								}
								return {id: ids, datos: organigrama};
						}
				}
		},
		enviar                     : function ()
		{
				var _this = this;
				if (_this.formulario.getForm().isValid()) {
						var aprueba = _this.textAprueba.getValue();
						var elabora = _this.textElabora.getValue();
						var formato = _this.comboFormato.getValue();
						var idresolucion = _this.comboResolucion.getValue();
						var resolucion = _this.comboResolucion.getRawValue();
				//	console.info(resolucion)
						var anexoOrganigrama = _this.anexoOrganigrama.getValue();
						var ajustar = _this.ajustar.getValue();
						var anexoResumen = _this.anexoResumen.getValue();
						var anexoPlantilla = _this.anexoPlantilla.getValue();
						var militares = _this.militares.getValue();
						var historial = _this.guardarHistorial.getValue();
						var fecha = _this.fechaResolucion.getRawValue();
						var dir = "aprueba=" + aprueba;
						dir += "&proyecto=" + _this.proyecto + "&elabora=" + elabora;
						dir += "&idresolucion=" + idresolucion;
						if (!_this.numHoja.disabled) {
								var hoja = _this.numHoja.getValue();
								dir += "&hoja=" + hoja;
						}
						dir += "&fecha=" + fecha;
						dir += "&resolucion=" +  resolucion;
						dir += "&anexoOrganigrama=" + anexoOrganigrama;
						dir += "&ajustar=" + ajustar;
						dir += "&organigrama=" + Ext.encode(_this.datosOrganigrama);
						dir += "&anexoResumen=" + anexoResumen;
						dir += "&anexoPlantilla=" + anexoPlantilla;
						dir += "&militares=" + militares;
						dir += "&historial=" + historial;
						if (formato != '') {
								dir += "&formato=" + formato;
						}
						if (_this.estructuras.length > 0) {
								dir += "&idNodos=" + Ext.encode(_this.estructuras);
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
		}
})
