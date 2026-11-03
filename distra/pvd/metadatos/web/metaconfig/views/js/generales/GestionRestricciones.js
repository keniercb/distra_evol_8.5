Ext.QuickTips.init();
Ext.ns('Configuracion.restricciones');
Configuracion.restricciones.Panel = Ext.extend(Ext.Panel, {
		viewport            : null,
		border              : false,
		etiquetas           : etiquetas.restricciones,
		id                  : 'panelRestricciones',
		icon                : '/metadatos/comun/recursos/iconos/cog.png',
		getNode             : function ()
		{
				return this.nodo;
		},
		cargar              : function ()
		{
				this.storeUsuarios.load({params: { query: ''}});
		},
		initComponent       : function ()
		{
				var _this = this;
				_this.modificado = false;
				_this.nodo = {
						text: etiquetas.general.lbRestricciones, leaf: true, icon: _this.icon, id: 'restricciones'
				};
				_this.idusuario = null;
				/********************************************************************/
				_this.storeUsuarios = new Ext.data.Store({
						url       : 'dameUsuariosRestricciones',
						waitMsg   : 'Cargando datos...',
						baseParams: {
								query: ''
						},
						autoLoad  : false,
						modal     : true,
						reader    : new Ext.data.JsonReader({
								root: 'datos', id: 'idusuario', totalProperty: 'cant'
						}, [{name: 'idusuario'}, {name: 'usuario'}, {name: 'iddominio'}]),
						listeners : {
								load: function (st, data)
								{
										if (data.length == 0) {
												mostrarMensaje(1, "No existen datos que se correspondan con el criterio de búsqueda especificado.")
												_this.storeConceptos.removeAll();
										}
								}
						}
				})
				_this.comboUsuarios = new Ext.ux.GridGroupComboBox({
						width          : 50 + Go.Column.Config.Width('denominacion') + 15,
						fieldLabel     : 'Usuario',
						name           : 'usuario',
						store          : _this.storeUsuarios,
						maxLength      : 60,
						vtype          : 'vtusuario',
						gridWidth      : 500,
						emptyText      : "Seleccione...",
						resizable      : true,
						selectOnFocus  : true,
						typeAhead      : false,
						qtip           : "Buscar usuarios",
						triggerAction  : 'all',
						displayField   : 'usuario',
						valueField     : 'usuario',
						minChars       : 1, // pageSize       : 10, //						triggerClass   : 'x-form-search-trigger',
						loadingText    : 'Cargando...',
						tpl            : '<tpl for="."><div ext:qtip="{usuario}" class="x-combo-list-item">{usuario}</div></tpl>',
						showGroupName  : false,
						startCollapsed : false,
						enableKeyEvents: true,
						listeners      : {
								select        : function (combo, record)
								{
										_this.hiddenIdUsuario.setValue(record.data.idusuario);
										_this.idusuario = record.data.idusuario;
										_this.storeConceptos.load();
								}, beforequery: function (query)
								{
										if (query.query == '') {
												_this.storeUsuarios.lastQuery = '';
												_this.storeUsuarios.baseParams.query = '';
												_this.cargar();
										}
								}
						}
				});
				_this.hiddenIdUsuario = new Ext.form.Hidden({
						name: 'idusuario',
				});
				/*******************************************************************/
				_this.recordsInit = new Ext.data.Store();
				_this.storeConceptos = new Ext.data.Store({
						url      : 'dameConceptosRestricciones',
						autoLoad : false,
						reader   : new Ext.data.JsonReader({
								root: 'datos', totalProperty: 'cant'
						}, [{name: 'idconcepto'}, {name: 'idusuarioconcepto'}, {name: 'icon'}, {name: 'todo'}, {name: 'ver'}, {name: 'adicionar'}, {name: 'modificar'}, {name: 'eliminar'}, {name: 'editar'}, {name: 'deshacer'}, {name: 'denominacion'}, {name: 'tipos'}, {name: 'idtipos'}]),
						listeners: {
								beforeload: function (store, param)
								{
										param = _this.beforeLoadConceptos(param);
										return param;
								}, load   : function ()
								{
										_this.idconcepto = null;
										_this.btnGuardar.disable();
										if (!_this.modificado) {
												Secodena.ocultarMascara('cargaini');
										}
										_this.modificado = false;
										if (_this.haveMarckedComplete(false)) {
												_this.btnClear.enable();
										} else {
												_this.btnClear.disable();
										}
										if (_this.recordsInit.getTotalCount()) {
												_this.recordsInit.removeAll();
										}
										var recordsArray = new Array();
										_this.storeConceptos.each(function (record)
										{
												recordsArray.push(record.copy());
										});
										_this.recordsInit.add(recordsArray);
								}
						}
				});
				_this.idconcepto = null;
				_this.smConceptos = new Ext.grid.RowSelectionModel({
						singleSelect: false, listeners: {
								rowselect: function (sm)
								{
										_this.idconcepto = sm.getSelected().get('idconcepto');
								}
						}
				});
				_this.btnGuardar = new Ext.Button({
						text    : "Guardar", //						icon    : perfil.dirImg + 'guardar.png',
						iconCls : 'guardar',
						disabled: true,
						tooltip : 'Guardar las nuevas restricciones del usuario',
						handler : function ()
						{
								_this.guardar();
						}
				});
				_this.btnClear = new Ext.Button({
						text    : "Limpiar restricciones", //						icon    : perfil.dirImg + 'limpiar.png',
						iconCls : 'limpiar',
						disabled: true,
						tooltip : 'Desmarcar todas las restricciones existentes',
						handler : function ()
						{
								_this.clearRestricciones();
						}
				});
				/**
				 * COMBO DE GRUPO DE COMPLEJIDAD PARA SALARIO
				 */



				_this.gridConceptos = new Ext.grid.GridPanel({
						store           : _this.storeConceptos,
						autoExpandColumn: 'tipos',
						clicksToEdit    : 2,
						forceFit        : true,
						sm              : _this.smConceptos,
						tbar            : ['Usuarios: ', _this.comboUsuarios, _this.hiddenIdUsuario, '->', _this.btnClear, _this.btnGuardar],
						listeners       : {
								cellclick: function (grid, rowIndex, columnIndex)
								{
										var record = _this.smConceptos.getSelected();
										var idconcepto = record.data.idconcepto;
										if (columnIndex == 9) {
												if (idconcepto != 7 && idconcepto != 10) {
														_this.crearGridTipos(idconcepto, rowIndex, _this.storeConceptos, _this.smConceptos.getSelected());
												}
										}
										record.beginEdit();
										var updateTodo = function ()
										{
												_this.btnClear.enable();
												if (_this.haveMarcked(record, true)) {
														record.set('todo', 1);
												} else {
														record.set('todo', 0);
												}
										}
										switch (columnIndex) {
												case 2:
														if (record.get('todo')) {
																record.set('todo', 0);
																_this.markDesmark(record, 0);
														} else {
																record.set('todo', 1);
																_this.markDesmark(record, 1);
														}
														break;
												case 3:
														if (record.get('ver')) {
																record.set('ver', 0);
														} else {
																record.set('ver', 1);
														}
														break;
												case 4:
														if (record.get('adicionar')) {
																record.set('adicionar', 0);
														} else {
																record.set('adicionar', 1);
														}
														break;
												case 5:
														if (record.get('modificar')) {
																record.set('modificar', 0);
														} else {
																record.set('modificar', 1);
														}
														break;
												case 6:
														if (record.get('eliminar')) {
																record.set('eliminar', 0);
														} else {
																record.set('eliminar', 1);
														}
														break;
												case 7:
														if (record.get('editar')) {
																record.set('editar', 0);
														} else {
																record.set('editar', 1);
														}
														break;
												case 8:
														if (record.get('deshacer')) {
																record.set('deshacer', 0);
														} else {
																record.set('deshacer', 1);
														}
														break;
										}
										record.endEdit();
										updateTodo();
										if (_this.haveMarckedComplete(false)) {
												_this.btnClear.enable();
										} else {
												_this.btnClear.disable();
										}
										_this.activateSaveOnChange();
								}
						},
						enableColumnMove: false,
						columns         : [{
								dataIndex: 'icon',
								renderer : _this.setIcon,
								sortable : true,
								header   : "Ícono",
								maxWidth : 50,
								minWidth : 50,
								width    : 50,
								fixed    : true,
								align    : 'center',
								id       : 'icono'
						}, {
								dataIndex: 'denominacion',
								sortable : true,
								header   : "Concepto",
								fixed    : true,
								width    : Go.Column.Config.Width('denominacion'),
								id       : 'denominacion'
						}, {
								dataIndex: 'todo',
								renderer : Go.Column.Render.changeValorRadio,
								sortable : true,
								fixed    : true,
								header   : "Todos",
								width    : Go.Column.Config.Width('actual'),
								align    : 'center',
								id       : 'todo'
						}, {
								dataIndex: 'ver',
								renderer : Go.Column.Render.changeValorRadio,
								sortable : true,
								header   : "Ver",
								width    : Go.Column.Config.Width('actual'),
								align    : 'center',
								fixed    : true,
								id       : 'ver'
						}, {
								dataIndex: 'adicionar',
								renderer : Go.Column.Render.changeValorRadio,
								sortable : true,
								header   : "Adicionar",
								width    : Go.Column.Config.Width('actual'),
								align    : 'center',
								fixed    : true,
								id       : 'adicionar'
						}, {
								dataIndex: 'modificar',
								renderer : Go.Column.Render.changeValorRadio,
								sortable : true,
								header   : "Modificar",
								width    : Go.Column.Config.Width('actual'),
								align    : 'center',
								fixed    : true,
								id       : 'modificar'
						}, {
								dataIndex: 'eliminar',
								renderer : Go.Column.Render.changeValorRadio,
								sortable : true,
								header   : "Eliminar",
								width    : Go.Column.Config.Width('actual'),
								align    : 'center',
								fixed    : true,
								id       : 'eliminar'
						}, {
								dataIndex: 'editar',
								renderer : Go.Column.Render.changeValorRadio,
								sortable : true,
								header   : "Editar",
								width    : Go.Column.Config.Width('actual'),
								align    : 'center',
								fixed    : true,
								id       : 'editar'
						}, {
								dataIndex: 'deshacer',
								renderer : Go.Column.Render.changeValorRadio,
								sortable : true,
								header   : "Deshacer",
								width    : Go.Column.Config.Width('actual'),
								align    : 'center',
								fixed    : true,
								id       : 'deshacer'
						}, {
								dataIndex: 'tipos',
								renderer : Go.Column.Render.renderComboRawValue,
								header   : "Tipos",
								width    : 350,
								fixed    : true,
								align    : 'center',
								id       : 'tipos',
								name     : 'tipos'
						}]
				});
				Ext.apply(this, {
						layout: 'fit', title: _this.etiquetas.lbTitle, items: [_this.gridConceptos]
				})
				Configuracion.restricciones.Panel.superclass.initComponent.apply(this)
		},
		haveMarckedComplete : function (all)
		{
				var _this = this;
				var marked = false;
				_this.storeConceptos.each(function (record)
				{
						if (!marked && _this.haveMarcked(record, all)) {
								marked = true;
						}
				})
				return marked;
		},
		haveMarcked         : function (record, all)
		{
				if (all) {
						return (parseInt(record.get('ver')) && parseInt(record.get('adicionar')) && parseInt(record.get('modificar')) && parseInt(record.get('eliminar')) && parseInt(record.get('deshacer')) && parseInt(record.get('editar'))
						);
				} else {
						return (parseInt(record.get('ver')) || parseInt(record.get('adicionar')) || parseInt(record.get('modificar')) || parseInt(record.get('eliminar')) || parseInt(record.get('deshacer')) || parseInt(record.get('editar'))
						);
				}
		},
		markDesmark         : function (record, mark)
		{
				record.set('ver', mark);
				record.set('adicionar', mark);
				record.set('modificar', mark);
				record.set('eliminar', mark);
				record.set('editar', mark);
				record.set('deshacer', mark);
		},
		limpiarUsuarios     : function ()
		{
				this.cargar();
		},
		crearToolTip        : function (v, m)
		{
				m.attr = 'ext:qtip="' + v + '"';
				return v;
		},
		setIcon             : function (val)
		{
				return "<img url='" + val + "' src='" + val + "' height='20' />";
		},
		beforeLoadConceptos : function (param)
		{
				var _this = this;
				if (!_this.modificado) {
						Secodena.mostrarMascara('cargaini', '', "Cargando...");
				}
				var usuario = _this.idusuario;
				param.params = {
						idusuario: usuario
				}
				return param;
		},
		notEqualRecords     : function (record, original)
		{
				if ((parseInt(record.get('ver')) != parseInt(original.get('ver'))) || (parseInt(record.get('adicionar')) != parseInt(original.get('adicionar'))) || (parseInt(record.get('modificar')) != parseInt(original.get('modificar'))) || (parseInt(record.get('eliminar')) != parseInt(original.get('eliminar'))) || (parseInt(record.get('editar')) != parseInt(original.get('editar'))) || (parseInt(record.get('deshacer')) != parseInt(original.get('deshacer')))) {
						return true;
				}
				return false;
		},
		crearGridTipos      : function (idconcepto, index, storeConceptos, recordSelect)
		{
				var idRecord = [];
				var _this = this;
				var getArraySelected = function (_record, data)
				{
						var selection = new Array();
						if (idRecord.length > 0) {
								if (_record != null) {
										for (var i = 0; i < _record.length; i++) {
												if (idRecord.searchRecordById(_record[i].data.id) != null) {
														selection.push(_record[i]);
												}
										}
								} else {
										selection = idRecord;
								}
								var result = selection;
								if (data === true) {
										result = new Array();
										for (var i = 0; i < selection.length; i++) {
												result.push({
														denominacion: selection[i].data.denominacion, id: selection[i].data.id
												})
										}
								}
								return result;
						} else {
								return [];
						}
				}
				var conceptos = {
						1: "órganos",
						2: "agrupaciones",
						3: "entidades",
						4: "organizaciones",
						5: "órganos internos",
						6: "agrupaciones internas",
						8: "estructuras no formales",
						9: "tipos de medios"
				}
				var smCheck = new Ext.grid.CheckboxSelectionModel({
						singleSelect: false, listeners: {
								'rowselect'     : function (_sm, nIndex, record)
								{
										if (idRecord.searchRecordById(record.data.id) == null) {
												idRecord.push(record);
										}
										if (idRecord.length > 0) {
												Ext.getCmp('btnTipos').enable();
										} else {
												if (recordSelect.data.idtipos == "") {
														Ext.getCmp('btnTipos').disable();
												}
										}
								}, 'rowdeselect': function (_sm, nIndex, record)
								{
										idRecord.removeRecordById(record.data.id);
										if (idRecord.length > 0) {
												Ext.getCmp('btnTipos').enable();
										} else {
												if (recordSelect.data.idtipos == "") {
														Ext.getCmp('btnTipos').disable();
												}
										}
								}
						}
				});
				var stTipos = new Ext.data.Store({
						url       : 'mostrarTipoOrgano',
						autoLoad  : false,
						baseParams: {idconcepto: idconcepto},
						reader    : new Ext.data.JsonReader({
								root: 'datos', totalProperty: 'cant'
						}, [{name: 'id'}, {name: 'denominacion'}]),
						listeners : {
								beforeLoad: function ()
								{
										Secodena.mostrarMascara('tipos', " ", " Cargando tipos de " + conceptos[idconcepto]);
								}, load   : function (_st, _record)
								{
										Secodena.ocultarMascara('tipos');
										var selection;
										if (recordSelect.data.idtipos != "" && !smCheck.hasSelection()) {
												var recSel = [];
												var recSave = recordSelect.data.idtipos;
												for (var i = 0; i < recSave.length; i++) {
														recSel.push(_st.getAt(_st.find('id', recSave[i], 0, false, true)));
												}
												selection = recSel;
										} else {
												selection = getArraySelected(_record, false);
										}
										smCheck.selectRecords(selection, true);
										if (idRecord.length > 0) {
												Ext.getCmp('btnTipos').enable();
										}
								}
						}
				})
				var gpTipos = new Ext.grid.GridPanel({
						store   : stTipos, forceFit: true, sm: smCheck, columns: [smCheck, {
								dataIndex: 'id', sortable: true, header: "", align: 'center', id: 'idtipo', hidden: true
						}, {
								dataIndex: 'denominacion', sortable: true, header: "Denominación", width: 370, id: 'denominacion'
						}], bbar: new Ext.PagingToolbar({
								pageSize: 10, store: stTipos, displayInfo: true
						})
				})
				var winTipos = new Ext.Window({
						title      : "Tipos de " + conceptos[idconcepto],
						height     : 400,
						width      : 450,
						modal      : true,
						constrain  : true,
						closeAction: 'close',
						layout     : 'fit',
						items      : gpTipos,
						buttons    : [{
								text   : 'Cancelar', //										icon   : perfil.dirImg + 'cancelar.png',
								iconCls: 'cancelar', handler: function ()
								{
										winTipos.destroy();
								}
						}, {
								text   : 'Aceptar', //										icon    : perfil.dirImg + 'aceptar.png',
								iconCls: 'aceptar', id: 'btnTipos', disabled: true, handler: function ()
								{
										var datos = getArraySelected(null, true);
										var denominacion = " ";
										var idArray = new Array();
										for (var i = 0; i < datos.length; i++) {
												idArray.push(datos[i].id);
												if (i == 0) {
														denominacion = datos[i].denominacion;
												} else {
														denominacion += ', ' + datos[i].denominacion
												}
										}
										storeConceptos.getAt(index).beginEdit();
										storeConceptos.getAt(index).set('tipos', denominacion);
										storeConceptos.getAt(index).set('idtipos', idArray);
										storeConceptos.getAt(index).endEdit();
										winTipos.destroy();
										_this.btnGuardar.enable();
								}
						}]
				})
				winTipos.show();
				stTipos.load({params: {start: 0, limit: 10}});
		},
		hasRecordsModifiers : function ()
		{
				var modificado = false;
				var _this = this;
				_this.storeConceptos.each(function (record)
				{
						var original = _this.recordsInit.getById(record.id);
						if (!modificado && _this.notEqualRecords(record, original)) {
								modificado = true;
								return;
						}
				});
				return modificado;
		},
		activateSaveOnChange: function ()
		{
				var _this = this;
				_this.modificado = _this.hasRecordsModifiers();
				if (_this.modificado) {
						_this.btnGuardar.enable();
				} else {
						_this.btnGuardar.disable();
				}
		},
		clearRestricciones  : function ()
		{
				var _this = this;
				_this.storeConceptos.each(function (record)
				{
						record.set('todo', 0);
						record.set('tipos', "")
						record.set('idtipo', "")
						_this.markDesmark(record, 0);
				});
				_this.btnClear.disable();
				_this.activateSaveOnChange();
		},
		guardar             : function ()
		{
				var _this = this;
				var conceptos = new Array();
				_this.storeConceptos.each(function (record)
				{
						if (record.get('ver') || record.get('adicionar') || record.get('modificar') || record.get('eliminar') || record.get('deshacer') || record.get('editar') || record.get('idtipos')) {
								conceptos.push({
										idconcepto: record.get('idconcepto'),
										ver       : record.get('ver'),
										adicionar : record.get('adicionar'),
										modificar : record.get('modificar'),
										eliminar  : record.get('eliminar'),
										deshacer  : record.get('deshacer'),
										editar    : record.get('editar'),
										tipos     : record.get('idtipos')
								})
						}
				});
				Secodena.mostrarMascara('guardar', '', 'Guardando las restricciones del usuario');
				Ext.Ajax.request({
						url        : 'gestionarRestricciones', params: {
								idusuario: _this.idusuario, parametros: Ext.encode(conceptos)
						}, callback: function (options, success, response)
						{
								Secodena.ocultarMascara('guardar');
								var responseData = Ext.decode(response.responseText);
								var codMsg = (responseData.codMsg == 4) ? 6 : responseData.codMsg;
								if (codMsg == 1) {
										mostrarMensaje(codMsg, responseData.mensaje);
										_this.btnGuardar.disable();
										_this.storeConceptos.load();
								}
						}
				});
		}
});
