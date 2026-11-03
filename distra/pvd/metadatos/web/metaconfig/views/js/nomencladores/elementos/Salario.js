var stSalario, formFiltroSalario;
var paramSalario = new Array();
paramSalario.push(15);
var searchFiltroSalario = function ()
{
		var form = formFiltroSalario.getForm();
		var salario = Ext.getCmp('filtroValor_salario').getValue();
		salario = parseInt(salario);
		var grupocomplejidad = Ext.getCmp('filtroGrupoComplejidad_salario').getValue();
		if (salario >= 0 || grupocomplejidad != '') {
				if (form.isValid()) {
						var params = new Array();
						params.push(15);
						params.push(form.getValues());
						stSalario.reload({
								params  : {
										start     : 0,
										limit     : 15,
										clase     : 'salario',
										parametros: Ext.encode(params)
								},
								callback: function (a)
								{
										if (a.length == 0) {
												Secodena.ocultarMascara('cargaini');
												mostrarMensaje(1, "No existen datos que se correspondan con los criterios de b&uacute;squeda especificados.");
												Secodena.ocultarMascara('cargaini');
												// formFiltroSalario.getForm().reset();
												// stSalario.reload({params: {start: 0, limit: 15}});
										}
								}
						})
				}
		} else {
				mostrarMensaje(6, "No se ha introducido ningún criterio de búsqueda.");
				Ext.getCmp('filtroGrupoComplejidad_salario').focus(false, 10);
		}
}
function construirSalario(idTab)
{
		stSalario = new Ext.data.Store({
				url      : 'mostrarValores',
				remoteSort:true,
				reader   : new Ext.data.JsonReader({
						root         : 'datos',
						id           : 'idsalario',
						totalProperty: 'cant'
				}, [
						{name: 'id'},
						{name: 'salario'},
						{name: 'idsalario'},
						{name: 'actual'},
						{name: 'visible'},
						{name: 'fechainicio'},
						{name: 'fechafin'},
						{name: 'denominacion', mapping: 'NomGrupocomplejidad.denominacion'},
						{name: 'grupocomplejidad', mapping: 'NomGrupocomplejidad.denominacion'},
						{name: 'idgrupocomplejidad'}
				]),
				listeners: {
						beforeload: function (store, param)
						{
								param = myBeforeLoad(param, "filtroValor_salario", "filtroGrupoComplejidad_salario", formFiltroSalario, 15, paramSalario, 'salario', 'filtroCondicion_salario')
								return param;
						},
						load      : function ()
						{
								Secodena.ocultarMascara('cargaini');
								Ext.getCmp("btnAdicionar_salario").focus(false, 10);
						}
				}
		})
		var dataCondicion = [
				[1, '<='],
				[2, '='],
				[3, '>=']
		]
		var storeCondicion = new Ext.data.SimpleStore({
				fields: ['value', 'condicion'],
				data  : dataCondicion
		})
		var storeFiltroGrupoComplejidad = new Ext.data.Store({
				url       : 'mostrarValores',
				autoLoad  : true,
				baseParams: {
						clase  : 'grupo_domain',
						accion : 'dameTodosVisiblesInSalario',
						salario: true
				},
				reader    : new Ext.data.JsonReader({
						root: "datos"}, [
						{name: 'idgrupocomplejidad'},
						{name: 'denominacion'}
				])
		})
		formFiltroSalario = new Ext.FormPanel({
				layout     : 'column',
				region     : 'north',
				cls        : 'x-toolbar',
				height     : 70,
				frame      : true,
				defaults   : {
						layout     : 'form',
						border     : false,
						labelAlign : 'top',
						labelWidth : 50,
						buttonAlign: 'right'
				},
				bodyBorder : false,
				border     : false,
				autoScroll : true,
				hideBorders: true,
				keys       : [
						{
								key: Ext.EventObject.ENTER,
								fn : function ()
								{
										searchFiltroSalario();
								}
						},{
								key: 'b',
								alt: true,
								fn : function ()
								{
										searchFiltroSalario();
								}
						},{
								key: 'l',
								alt: true,
								fn : function ()
								{
										_this.limpiar(_this)
								}
						}
				],
				items      : [
						{
								layout     : 'form',
								columnWidth: .2,
								items      : [
										{
												xtype         : 'combo2',
												anchor        : '85%',
												editable      : false,
												name          : 'grupocomplejidad',
												id            : 'filtroGrupoComplejidad_salario',
												autoCreate    : true,
												store         : storeFiltroGrupoComplejidad,
												mode          : 'local',
												forceSelection: true,
												enableQtip    : true,
												allowBlank    : true,
												fieldLabel    : "Grupo de escala",
												displayField  : 'denominacion',
												valueField    : 'denominacion',
												hiddenName    : 'grupocomplejidad',
												emptyText     : "Criterio a buscar...",
												triggerAction : 'all',
												handler       : function ()
												{
														this.store.removeAll();
														this.store.load();
												},
												listeners     : {
														select: function ()
														{
																if (Ext.getCmp('filtroValor_salario').getValue()!=''
																		||Ext.getCmp('filtroGrupoComplejidad_salario').getValue()!=''
																		||Ext.getCmp('filtroCondicion_salario').getValue()!=''
																		) {
																		Ext.getCmp('btnAllASalario').enable();
																		Ext.getCmp('btnBuscarSalario').enable();
																} else {
																		Ext.getCmp('btnAllASalario').disable();
																		Ext.getCmp('btnBuscarSalario').disable();
																}
														}
												}
										}
								]
						},
						{
								layout     : 'form',
								columnWidth: .2,
								items      : [
										{
												xtype           : 'numberfield',
												name            : 'salario',
												id              : 'filtroValor_salario',
												maxLength       : 10,
												allowNegative   : false,
												decimalPrecision: 2,
												emptyText       : "Criterio a buscar...",
												fieldLabel      : "Salario",
												anchor          : '85%',
												allowBlank      : true,
												enableKeyEvents: true,
												listeners      : {
														keyup: function ()
														{
																if (Ext.getCmp('filtroValor_salario').getValue()!=''
																||Ext.getCmp('filtroGrupoComplejidad_salario').getValue()!=''
																||Ext.getCmp('filtroCondicion_salario').getValue()!=''
																		) {
																		Ext.getCmp('btnAllASalario').enable();
																		Ext.getCmp('btnBuscarSalario').enable();
																} else {
																		Ext.getCmp('btnAllASalario').disable();
																		Ext.getCmp('btnBuscarSalario').disable();
																}
														}
												}
										}
								]
						},
						{
								layout     : 'form',
								columnWidth: .15,
								items      : [
										{
												xtype         : 'combo2',
												fieldLabel    : "Condición",
												store         : storeCondicion,
												editable      : false,
												displayField  : 'condicion',
												name          : 'condicion',
												valueField    : 'condicion',
												id            : 'filtroCondicion_salario',
												mode          : 'local',
												width         : 100,
												forceSelection: true,
												triggerAction : 'all',
												emptyText     : "Seleccione...",
												selectOnFocus : true,
												hideTriggers  : true,
												listeners     : {
														select: function ()
														{
																if (Ext.getCmp('filtroValor_salario').getValue()!=''
																		||Ext.getCmp('filtroGrupoComplejidad_salario').getValue()!=''
																		||Ext.getCmp('filtroCondicion_salario').getValue()!=''
																		) {
																		Ext.getCmp('btnAllASalario').enable();
																		Ext.getCmp('btnBuscarSalario').enable();
																} else {
																		Ext.getCmp('btnAllASalario').disable();
																		Ext.getCmp('btnBuscarSalario').disable();
																}
														}
												}
										}
								]
						},
						{
								columnWidth: '35px', bodyStyle: 'padding:19px 20px 0 0;', layout: 'form', items: [
								{
										xtype  : 'button',
										tooltip: "Buscar salario <b>(Alt+L)</b>",
										text   : '<u>B</u>uscar',
										//icon   : perfil.dirImg + 'buscar.png',
										iconCls: 'buscar',
										id     : 'btnBuscarSalario',
										disabled: true,
										handler: function ()
										{
												searchFiltroSalario();
										}
								}
						]
						},
						{
								columnWidth: '35px', bodyStyle: 'padding:19px 0 0 0;', layout: 'form', items: [
								{
										xtype  : 'button',
										tooltip: "Limpiar filtros <b>(Alt+L)</b>",
										text   : '<u>L</u>impiar',
										id     : 'btnAllASalario',

										disabled: true,
										iconCls: 'limpiar',
										handler: function ()
										{
												formFiltroSalario.getForm().reset();
												stSalario.reload({params: {start: 0, limit: 15}});
										}
								}
						]
						}
				]
		});
		var panelGestion = new Nomenclador.Panel.Gestion({
				id               : idTab,
				title            : 'Salario',
				name             : 'salario',
				clase            : 'salario',
				elemento         : 'salario',
				idTipoNomenclador: 15,
				mensajeEvento    : 'el salario seleccionada',
				mensajeCargando  : 'del salario',
				store            : stSalario,
				formFiltro       : formFiltroSalario,
				onBuscar         : searchFiltroSalario,
				idFoco           : 'filtroValor_salario',
				columns          : [
						{dataIndex: 'salario', renderer: Go.Column.Ttip.ToolTipColumn, sortable: true, header: "Salario", width: Go.Column.Config.Width('salario'), hidden: false},
						{dataIndex: 'idsalario', sortable: true, header: 'Código', renderer: Go.Util.convertCod, width: Go.Column.Config.Width('codigo'), hidden: true},
						{dataIndex: 'denominacion', renderer: Go.Column.Ttip.ToolTipColumn, sortable: true, header: "Grupo de escala", id: 'denominacion', width: Go.Column.Config.Width('denominacion'), hidden: false},
						{dataIndex: 'fechainicio', renderer: Go.Column.Ttip.ToolTipColumn, sortable: true, header: "Fecha inicio", id: 'fechainicio', width: Go.Column.Config.Width('abreviatura'), hidden: false,align : 'center'},
						{dataIndex: 'fechafin', renderer: Go.Column.Ttip.ToolTipColumn, sortable: true, header: "Fecha fin", id: 'fechafin', width: Go.Column.Config.Width('abreviatura'), hidden: false,align : 'center'},
						{dataIndex: 'actual', sortable: false, header: "Actual", renderer: Go.Column.Render.changeValor, width: Go.Column.Config.Width('actual'), id: 'actual', hidden: false, align: 'center'},
						{dataIndex: 'visible', sortable: false, header: "Visible", renderer: Go.Column.Render.changeValor, width: Go.Column.Config.Width('visible'), id: 'visible', hidden: false, align: 'center'}
				]
		})
		return panelGestion;
}