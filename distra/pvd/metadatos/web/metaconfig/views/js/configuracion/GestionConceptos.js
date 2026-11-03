Ext.QuickTips.init();
Ext.ns('Configuracion.conceptos');
Configuracion.conceptos.Gestion = Ext.extend(Ext.Panel, {
		elayout                    : 'form',
		border                     : false,
		viewport                   : null,
		contenedor                 : null,
		icon                       : '/metadatos/comun/recursos/iconos/cog.png',
		record                     : null,
		click                      : true,
		node                       : null,
		initComponent              : function ()
		{
				var _this = this;
				_this.tipos = new Array();
				_this.tipos.push('concepto')
				_this.stIcono = new Ext.data.Store({
						url      : 'mostrarIconos', autoload: true, baseParams: {
								parametros: _this.tipos, clase: 'icono', accion: 'dameIconosPorTipo'
						}, reader: new Ext.data.JsonReader({
								root: "datos"
						}, [{name: 'idicono'}, {name: 'icono'}, {name: 'denominacion'}])
				})
				/////////////Store PERMISOS ////////////
				_this.storeTienePermisos = new Ext.data.Store({
						url      : 'damePermisos', baseParams: {
								idconcepto: 1
						}, reader: new Ext.data.JsonReader({
								totalProperty: "cant", root: "datos", id: "idhijo"
						}, [{
								name: 'idhijo', mapping: 'idhijo'
						}, {
								name: 'denominacion', mapping: 'NomConcepto.denominacion'
						}, {
								name: 'orden', mapping: 'NomConcepto.orden'
						}, {
								name: 'idrelacion', mapping: 'idrelacion'
						}])
				});
				_this.smTienePermisos = new Ext.grid.RowSelectionModel({
						singleSelect: false
				});
				_this.hiddenIdIcono = new Ext.form.Hidden({
						id: 'idicono', name: 'idicono'
				});
				_this.cbGraficable = new Ext.form.Checkbox({
						hideLabel: true,
						boxLabel : 'Graficable',
						name     : 'graficable',
						disabled : true,
						anchor   : '100%',
						id       : 'graficable'
				});
				_this.btnGuardarConfigMaster = new Ext.Button({
						text    : 'Guardar',
						id      : 'btnGuardarConfigMaster',
						iconCls : 'guardar',
						disabled: true,
						tooltip : etiquetas.configuracion.tooltipModificar,
						handler : function(){
								_this.salvarConfiguracionConcepto()
						}
				})
				_this.gridTienePermisos = new Ext.grid.GridPanel({
						title         : etiquetas.configuracion.lbListaPermisos,
						border        : true,
						frame         : true,
						enableDragDrop: true,
						bodyStyle     : 'padding: 10px; background-color: #DFE8F6',
						store         : _this.storeTienePermisos,
						sm            : _this.smTienePermisos,
						region        : 'center',
						columns       : [{
								header   : etiquetas.configuracion.lborden,
								width    : 100,
								sortable : true,
								dataIndex: 'orden',
								fixed    : true,
								id       : 'orden'
						}, {
								header   : etiquetas.configuracion.lbdenominacion,
								width    : 250,
								sortable : true,
								fixed    : true,
								dataIndex: 'denominacion',
								id       : 'denominacion'
						}, {
								dataIndex: 'actual',
								fixed    : true,
								header   : etiquetas.configuracion.lbEliminar,
								renderer : _this.mostrarIcono,
								width    : 100,
								id       : 'eliminarPermiso'
						}, {
								hidden: true, hideable: false, dataIndex: 'idrelacion'
						}],
						listeners     : {
								cellclick: function (grid, filaCount, columnaCount)
								{
										var record = grid.getSelectionModel().getSelected().data;
										if (columnaCount == 2) {
												mostrarMensaje(2, etiquetas.configuracion.lbMsgseguroquedeseaeliminar, function (btn)
												{
														if (btn == 'ok') {
																Ext.Ajax.request({
																		url       : 'eliminarPermisos', params: {
																				idrelacion: record.idrelacion
																		}, success: function (resp)
																		{
																				resp = Ext.decode(resp.responseText);
																				var codMsg = (resp.codMsg == 4) ? 6 : resp.codMsg;
																				var msg = resp.mensaje;
																				mostrarMensaje(codMsg, msg);
																				if (codMsg == 1) {
																						_this.storeTienePermisos.reload();
																				}
																		}
																})
														}
												})
										}
								}, render: function (grid)
								{
										dropTarget = new Ext.dd.DropTarget(grid.el, {
												ddGroup    : 'tree2grid',
												id         : 'dragdrop',
												copy       : false,
												notifyOver : function (ddSource, e, data)
												{
														var exist = _this.storeTienePermisos.find('idhijo', data.node.attributes.idconcepto);
														if (data.node.attributes.idconcepto == 0 || exist >= 0) {
																mostrarMensaje(1, "Ya existe un permiso asociado al concepto " + data.node.attributes.denominacion + ".");
																return ddSource.dropNotAllowed;
														} else {
																return ddSource.dropAllowed;
														}
												},
												notifyEnter: function (ddSource, e, data)
												{
														_this.gridTienePermisos.body.stopFx();
														_this.gridTienePermisos.body.highlight();
												},
												notifyDrop : function (dragSource, event, data)
												{
														if (data.node.attributes.idconcepto != 0) {
																if (!_this.gridTienePermisos.disabled) {
																		var exist = _this.storeTienePermisos.find('idhijo', data.node.attributes.idconcepto);
																		if (exist == -1) {
																				var idpadre = _this.tfIdentificador.getValue();
																				Ext.Ajax.request({
																						url       : 'insertarPermisos', params: {
																								idpadre: idpadre, idhijo: data.node.attributes.idconcepto
																						}, success: function (resp)
																						{
																								resp = Ext.decode(resp.responseText);
																								var codMsg = (resp.codMsg == 4) ? 6 : resp.codMsg;
																								var msg = resp.mensaje;
																								mostrarMensaje(codMsg, msg);
																								if (codMsg == 1) {
																										_this.storeTienePermisos.reload();
																								}
																						}
																				})
																		}
																}
																return true;
														} else {
																mostrarMensaje(6, 'El concepto general no puede ser asociado a ningún otro elemento');
																return false;
														}
												}
										})
								}
						},
						loadMask      : {
								store: _this.storeTienePermisos
						}
				});

				_this.tfIdentificador = new Ext.form.TextField({
						fieldLabel: etiquetas.configuracion.lbIdentificador,
						name      : 'identificador',
						disabled  : true,
						anchor    : '90%',
						id        : 'identificador'
				});
				_this.tfOrden = new Ext.form.TextField({
						fieldLabel: etiquetas.configuracion.lborden, name: 'orden', disabled: true, anchor: '90%', id: 'orden'
				});
				_this.tfDenominacion = new Ext.form.TextField({
						fieldLabel: etiquetas.configuracion.lbdenominacion,
						name      : 'denominacion',
						nextTab   : 'icono',
						disabled  : true,
						anchor    : '100%',
						id        : 'denominacion',
						vtype     : 'vtalfanumericosguiones'
				});
				_this.comboImagen = new Nomenclador.ImagenCombo({
						id       : 'comboimagen',
						disabled : true,
						parent   : 'conceptos',
						store    : _this.stIcono,
						handler  : function ()
						{
								this.store.removeAll();
								this.store.load();
						},
						listeners: {
								select: function (combo, record)
								{
										_this.hiddenIdIcono.setValue(record.data.idicono);
								}
						}
				});
				_this.formGeneral = new Ext.form.FieldSet({
						title     : 'Datos generales',
						id        : 'formGeneral',
						anchor    : '100%',
						autoHeight: true,
						layout    : 'column',
						bodyStyle : 'padding:10px 10px 0',
						frame     : true,
						items     : [{
								columnWidth: .5,
								layout     : 'form',
								labelWidth : 40,
								labelAlign : 'top',
								items      : [_this.tfIdentificador, _this.tfOrden]
						}, {
								columnWidth: .5,
								layout     : 'form',
								labelWidth : 40,
								labelAlign : 'top',
								items      : [_this.tfDenominacion, _this.comboImagen, _this.hiddenIdIcono]
						}]
				});
				_this.cbVal = "";
				_this.chbxVal = "";
				_this.panelDetalles = new Ext.FormPanel({
						labelAlign  : 'top',
						frame       : true,
						title       : 'Detalles',
						monitorValid: true,
						region      : 'north',
						anchor      : '100%',
						height      : 220,
						bbar        : [' ', ' ', ' ', _this.cbGraficable, '->', _this.btnGuardarConfigMaster],
						items       : [{
								layout: 'column', items: [{
										columnWidth: 1, layout: 'form', items: [_this.formGeneral]
								}]
						}],
						listeners   : {
								'clientvalidation': function (_form, _valid)
								{
										if (_this.comboImagen.disabled != true) {
												if (_this.cbVal != _this.hiddenIdIcono.getValue() || _this.chbxVal != _this.cbGraficable.getValue()) {
														_this.btnGuardarConfigMaster.enable();
												} else {
														_this.btnGuardarConfigMaster.disable();
												}
										} else {
												_this.btnGuardarConfigMaster.disable();
										}
								}
						}
				});
				Ext.apply(this, {
						layout: 'border', items: [_this.panelDetalles, _this.gridTienePermisos]
				})
				Configuracion.conceptos.Gestion.superclass.initComponent.apply(this);
		},
		ajustar                    : function (id)
		{
				Ext.getCmp(id).doLayout();
		},
		salvarConfiguracionConcepto: function ()
		{
				_this = this;

				var idicono = _this.hiddenIdIcono.getValue();
				Ext.Ajax.request({
						url       : 'modificarConcepto', params: {
								idconcepto: _this.record.identificador, idicono: idicono, grafica: _this.cbGraficable.getValue()
						}, success: function (resp)
						{
								resp = Ext.decode(resp.responseText);
								var codMsg = (resp.codMsg == 4) ? 6 : resp.codMsg;
								var msg = resp.mensaje;
								mostrarMensaje(codMsg, msg);

								if (codMsg == 1) {
									Ext.getCmp('treepanel').getRootNode().reload();
									_this.formGeneral.reset();
								}
						}
				});
		},
		mostrarIcono               : function ()
		{
				return "<center><span class='icondistra-eliminar' />";
		},
		setRecord                  : function (record)
		{
				this.record = record;
		},
		endDragConceptos           : function ()
		{
				this.gridTienePermisos.enable();
		},
		startDragConceptos         : function (node)
		{
				this.storeDrag = node.attributes;
				this.gridTienePermisos.enable();
		},
		activar                    : function (n)
		{
				var _this = this;
				_this.enable();
				if (n.attributes.idconcepto == 10) {
						_this.cbGraficable.disable();
				}
				if (_this.cbGraficable.disabled == true) {
						_this.cbGraficable.enable()
				}
				(n.attributes.idconcepto == 0) ? _this.cbGraficable.hide() : _this.cbGraficable.show();
				_this.cbGraficable.setValue(0);
				_this.click = true;
				_this.storeTienePermisos.baseParams = {
						idconcepto: _this.record['identificador']
				}
				_this.storeTienePermisos.load();
				_this.cbVal = n.attributes.idicono;
				_this.chbxVal = n.attributes.grafica;
				_this.comboImagen.enable();
				_this.comboImagen.setValue(_this.record['nombre_imagen']);
				_this.hiddenIdIcono.setValue(_this.record['idicono']);
				_this.gridTienePermisos.enable();
				_this.cbGraficable.setValue(_this.record['grafica']);
				_this.tfIdentificador.setValue(_this.record['identificador']);
				_this.tfOrden.setValue(_this.record['orden']);
				_this.tfDenominacion.setValue(_this.record['denominacion']);
		}
});