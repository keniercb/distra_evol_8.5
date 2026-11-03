var stEscala, formFiltroEscala;
var paramSalario = new Array();
paramSalario.push(20);
var searchFiltroEscala = function ()
{
		var form = formFiltroEscala.getForm();
		var tipoescala = Ext.getCmp('filtroHiddenIdTipoEscala_escala').getValue();
		var grupocomplejidad = Ext.getCmp('filtroHiddenIdGrupoComplejidad_escala').getValue();
		if (tipoescala != '' || grupocomplejidad != '') {
				if (form.isValid()) {
						var params = new Array();
						params.push(20);
						params.push(form.getValues());
						stEscala.reload({
								params  : {
										start     : 0,
										limit     : 15,
										clase     : 'escala',
										parametros: Ext.encode(params)
								},
								callback: function (a)
								{
										if (a.length == 0) {
												Secodena.ocultarMascara('cargaini');
												mostrarMensaje(1, "No existen datos que se correspondan con los criterios de b&uacute;squeda especificados.");
												Secodena.ocultarMascara('cargaini');
												// formFiltroEscala.getForm().reset();
												// stEscala.reload({params: {start: 0, limit: 15}});
										}
								}
						})
				}
		} else {
				mostrarMensaje(6, "No se ha introducido ningún criterio de búsqueda.");
				Ext.getCmp('filtroTipoEscala_escala').focus(false, 10);
		}
}
function construirEscalaSalarial(idTab)
{
		stEscala = new Ext.data.Store({
				url      : 'mostrarValores',
				remoteSort:true,
				reader   : new Ext.data.JsonReader({
						root         : 'datos',
						totalProperty: 'cant'
				}, [
						{name: 'id'},
						{name: 'idesclasalarial'},
						{name: 'idtipoescala'},
						{name: 'tipoescala'},
						{name: 'idsalario'},
						{name: 'salario'},
						{name: 'idgrupocomplejidad'},
						{name: 'grupocomplejidad'},
						{name: 'fechainicio'},
						{name: 'fechafin'},
						{name: 'actual'},
						{name: 'visible'}
				]),
				listeners: {
						beforeload: function (store, param)
						{
								param = myBeforeLoad(param, "filtroHiddenIdTipoEscala_escala", "filtroHiddenIdGrupoComplejidad_escala", formFiltroEscala, 20, paramSalario, 'escala')
								return param;
						},
						load      : function ()
						{
								Secodena.ocultarMascara('cargaini');
								Ext.getCmp('btnAdicionar_escala').focus(false, 10);
						}
				}
		})
		var storeFiltroGrupoComplejidad = new Ext.data.Store({
				url       : 'mostrarValores',
				autoLoad  : true,
				baseParams: {
						clase  : 'grupo_domain',
						accion : 'dameTodosVisiblesInSalarioEscala',
						salario: true
				},
				reader    : new Ext.data.JsonReader({
						root: "datos"}, [
						{name: 'idgrupocomplejidad'},
						{name: 'denominacion'}
				])
		})
		var storeFiltroTipoEscala = new Ext.data.Store({
				url       : 'mostrarValores',
				autoLoad  : true,
				baseParams: {
						clase  : 'tipoescala_domain',
						accion : 'dameTodosVisiblesInEscalaSalarial',
						salario: true
				},
				reader    : new Ext.data.JsonReader({
						root: "datos"}, [
						{name: 'idtipoescala'},
						{name: 'denominacion'}
				])
		})
		formFiltroEscala = new Ext.FormPanel({
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
				id         : 'filtroFormFiltro_escala',
				keys       : [
						{
								key: Ext.EventObject.ENTER,
								fn : function ()
								{
										searchFiltroEscala();
								}
						},{
								key: 'b',
								alt: true,
								fn : function ()
								{
										searchFiltroEscala();
								}
						},{
								key: 'l',
								alt: true,
								fn : function ()
								{
								limpiar();
								}
						}
				],
				items      : [
						{
								layout     : 'form',
								columnWidth: .2,
								items      : [{
										xtype: 'hidden',
										name : 'idtipoescala',
										id   : 'filtroHiddenIdTipoEscala_escala'
								},
										{
												xtype         : 'combo2',
												anchor        : '85%',
												editable      : false,
												name          : 'tipoescala',
												id            : 'filtroDenominacion_escala',
												autoCreate    : true,
												store         : storeFiltroTipoEscala,
												mode          : 'local',
												forceSelection: true,
												enableQtip    : true,
												allowBlank    : true,
												fieldLabel    : "Tipo de escala",
												displayField  : 'denominacion',
												valueField    : 'denominacion',
												hiddenName    : 'tipoescala',
												emptyText     : "Criterio a buscar...",
												triggerAction : 'all',
												handler       : function ()
												{
														this.store.removeAll();
														this.store.load();
														Ext.getCmp('filtroHiddenIdTipoEscala_escala').setValue('');
												},listeners     : {
												select: function (combo, record)
												{
														Ext.getCmp('filtroHiddenIdTipoEscala_escala').setValue(record.data.idtipoescala);
														// if (Ext.getCmp('filtroGrupoComplejidad_escala').getValue()!=''
														// 		|| Ext.getCmp('filtroTipoEscala_escala').getValue()!=''
														// ) {
														// 		Ext.getCmp('btnAllAEscala').enable();
														// 		Ext.getCmp('btnBuscarEscala').enable();
														// } else {
														// 		Ext.getCmp('btnAllAEscala').disable();
														// 		Ext.getCmp('btnBuscarEscala').disable();
														// }
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
												xtype         : 'combo2',
												anchor        : '85%',
												editable      : false,
												name          : 'grupocomplejidad',
												id            : 'filtroGrupoComplejidad_escala',
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
														Ext.getCmp('filtroHiddenIdGrupoComplejidad_escala').setValue('');
												},
												listeners     : {
														select: function (combo, record)
														{
																Ext.getCmp('filtroHiddenIdGrupoComplejidad_escala').setValue(record.data.idgrupocomplejidad);
																// if (Ext.getCmp('filtroGrupoComplejidad_escala').getValue()!=''
																// 		|| Ext.getCmp('filtroTipoEscala_escala').getValue()!=''
																// 		) {
																// 		Ext.getCmp('btnAllAEscala').enable();
																// 		Ext.getCmp('btnBuscarEscala').enable();
																// } else {
																// 		Ext.getCmp('btnAllAEscala').disable();
																// 		Ext.getCmp('btnBuscarEscala').disable();
																// }
														}
												}
										},
										{
												xtype: 'hidden',
												name : 'idgrupocomplejidad',
												id   : 'filtroHiddenIdGrupoComplejidad_escala'
										}
								]
						},
						{
								columnWidth: '35px', bodyStyle: 'padding:19px 20px 0 0;', layout: 'form', items: [
								{
										xtype  : 'button',
										tooltip: "Buscar escala salarial <b>(Alt+L)</b>",
										text   : '<u>B</u>uscar',
										//icon   : perfil.dirImg + 'buscar.png',
										iconCls: 'buscar',
										id:'btnBuscarEscala',
										disabled:true,
										handler: function ()
										{
												searchFiltroEscala();
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
										id:'btnAllAEscala',
										disabled:true,
										//icon   : perfil.dirImg + 'limpiar.png',
										iconCls: 'limpiar',
										handler: function ()
										{


												limpiar();
										}
								}
						]
						}
				],	listeners     : {
						clientvalidation: function ()
						{

								if (Ext.getCmp('filtroGrupoComplejidad_escala').getValue()!=''|| Ext.getCmp('filtroDenominacion_escala').getValue()!='') {

										Ext.getCmp('btnAllAEscala').enable();
										Ext.getCmp('btnBuscarEscala').enable();
								} else {
										Ext.getCmp('btnAllAEscala').disable();
										Ext.getCmp('btnBuscarEscala').disable();
								}
						}
				}
		});
		function limpiar()
		{
				Ext.getCmp('btnAllAEscala').disable();
				Ext.getCmp('btnBuscarEscala').disable();
				formFiltroEscala.getForm().reset();
				stEscala.reload({params: {start: 0, limit: 15}});
		}
		var panelGestion = new Nomenclador.Panel.Gestion({
				id               : idTab,
				title            : 'Escala salarial',
				name             : 'escala',
				clase            : 'escala',
				elemento         : 'escala salarial',
				idTipoNomenclador: 20,
				mensajeEvento    : 'la escala salarial seleccionada',
				mensajeCargando  : 'de la escala salarial',
				store            : stEscala,
				formFiltro       : formFiltroEscala,
				onBuscar         : searchFiltroEscala,
				idFoco           : 'filtroFormFiltro_escala',
				columns          : [
						{dataIndex: 'idescalasalarial', renderer:  Go.Column.Ttip.ToolTipColumn, sortable: true, header: "Código", id: 'denominacion', width: Go.Column.Config.Width('codigo'), hidden: true},
						{dataIndex: 'tipoescala', renderer:  Go.Column.Ttip.ToolTipColumn, sortable: true, header: "Tipo de escala", width: Go.Column.Config.Width('denominacion')},
						{dataIndex: 'grupocomplejidad', renderer:  Go.Column.Ttip.ToolTipColumn, sortable: true, header: "Grupo de escala", width: Go.Column.Config.Width('denominacion')},
						{dataIndex: 'salario', renderer:  Go.Column.Ttip.ToolTipColumn, sortable: true, header: "Salario", width: Go.Column.Config.Width('denominacion')},
						{dataIndex: 'fechainicio', sortable: true, header: "Fecha inicio", renderer:  Go.Column.Ttip.ToolTipColumn, width: Go.Column.Config.Width('abreviatura'), id: 'fechainicio', align: 'center'},
						{dataIndex: 'fechafin', sortable: true, header: "Fecha fin", renderer:  Go.Column.Ttip.ToolTipColumn, width: Go.Column.Config.Width('abreviatura'), id: 'fechafin', align: 'center'},
						{dataIndex: 'actual', sortable: false, header: "Actual", renderer:Go.Column.Render.changeValor, width: Go.Column.Config.Width('actual'), id: 'actual', align: 'center'},
						{dataIndex: 'visible', sortable: false, header: "Visible", renderer:Go.Column.Render.changeValor, width: Go.Column.Config.Width('visible'), id: 'visible', align: 'center'}
				]
		})
		return panelGestion;
}