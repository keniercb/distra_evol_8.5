var stGrado, formFiltroGrado;
var paramGrado = new Array();
paramGrado.push(12);
var searchFiltroGrado = function ()
{
		var denominacion = Ext.getCmp('filtroDenominacion_grado').getValue();
		var abreviatura = Ext.getCmp('filtroAbreviatura_grado').getValue();
		var idcategoria = Ext.getCmp('filtroIdCategMilitar_grado').getValue();
		var marina = Ext.getCmp('filtroIdEsMarina_grado').getValue();
		var form = formFiltroGrado.getForm();
		if (denominacion != '' || abreviatura != '' || idcategoria || marina) {
				if (form.isValid()) {
						var params = new Array();
						params.push(12);
						params.push(form.getValues());
						stGrado.reload({
								params  : {
										start     : 0,
										limit     : 15,
										clase     : 'grado',
										parametros: Ext.encode(params)
								},
								callback: function (a)
								{
										if (a.length == 0) {
												Secodena.ocultarMascara('cargaini');
												mostrarMensaje(1, "No existen datos que se correspondan con los criterios de b&uacute;squeda especificados.");
												formFiltroGrado.getForm().reset();
												stGrado.reload({params: {start: 0, limit: 15}});
										}
								}
						})
				}
		} else {
				mostrarMensaje(6, "No se ha introducido ningún criterio de búsqueda.");
				Ext.getCmp('tfFiltroDenoGrado').focus(false, 10);
		}
}
function limpiar()
{
		Ext.getCmp('btnAllA').disable();
		Ext.getCmp('btnBuscar').disable();
		formFiltroGrado.getForm().reset();
		stGrado.reload({params: {start: 0, limit: 15}});
}
function construirGrado(idTab)
{
		stGrado = new Ext.data.Store({
				url       : 'mostrarValores',
				remoteSort: true,
				reader    : new Ext.data.JsonReader({
						root         : 'datos',
						totalProperty: 'cant'
				}, [
						{name: 'id'},
						{name: 'denominacion'},
						{name: 'idgrado'},
						{name: 'icono', mapping: 'NomIcono.icono'},
						{name: 'icono_name'},
						{name: 'idicono'},
						{name: 'idcategoriamilitar'},
						{name: 'categoriamilitar'},
						{name: 'nombre_imagen', mapping: 'NomIcono.denominacion'},
						{name: 'abreviatura'},
						{name: 'orden'},
						{name: 'actual'},
						{name: 'visible'},
						{name: 'marina'},
						{name: 'fechainicio'},
						{name: 'fechafin'},
						{name: 'denanterior', mapping: 'denominacion'}
				]),
				listeners : {
						beforeload: function (store, param)
						{
								param = myBeforeLoad(param, "filtroDenominacion_grado", "filtroAbreviatura_grado", formFiltroGrado, 12, paramGrado, 'grado')
								return param;
						},
						load      : function ()
						{
								Secodena.ocultarMascara('cargaini');
								Ext.getCmp('filtroDenominacion_grado').focus(false, 10);
								$('.grado').on('mouseover', function (e)
								{
										var data = $(this).attr('url');
										var top = e.pageY - 80;
										var left = e.pageX - 150;
										$('#previewImage').attr('src', data);
										$('#preview').css('display', 'block');
										$('#preview').css('top', top);
										$('#preview').css('left', left);
										$('#preview').css('opacity', 1);
										$(this).on('mousemove', function (e)
										{
										})
								})
								$('.grado').on('mouseout', function (e)
								{
										$('#preview').css('opacity', 0);
										$('#preview').css('-webkit-transition', 'all 0.3s ease-in-out');
										$('#preview').css('-moz-transition', 'all 0.3s ease-in-out');
										$('#preview').css('-o-transition', 'all 0.3s ease-in-out');
										$('#preview').css('-ms-transition', 'all 0.3s ease-in-out');
										$('#preview').css('transition', 'all 0.3s ease-in-out');
										setTimeout(function ()
										{
												$('#preview').css('display', 'none');
										}, 3000);
								})
						}
				}
		});
		var storeCategoria = new Ext.data.Store({
				url       : 'mostrarValores',
				baseParams: {
						clase  : 'categoriamilitar',
						accion : 'dameTodosVisibles',
						gestion: true
				},
				autoLoad  : true,
				reader    : new Ext.data.JsonReader({
						root: "datos"}, [
						{name: 'idcategoriamilitar'},
						{name: 'denominacion'}
				])
		});
		var storeEsMarina = new Ext.data.SimpleStore({
				fields: ['id', 'denominacion'],
				data  : [
						[0, 'Terrestre'],
						[1, 'Marina']
				]
		});
		var comboCategoriaMilitar = new Ext.form.ccoe.ComboBox({
				anchor        : '85%',
				editable      : false,
				name          : 'categoriamilitar',
				id            : 'filtroCategoriaMilitar_grado',
				autoCreate    : true,
				store         : storeCategoria,
				mode          : 'local',
				forceSelection: true,
				enableQtip    : true,
				fieldLabel    : "Categoria militar",
				displayField  : 'denominacion',
				valueField    : 'denominacion',
				triggerAction : 'all',
				hideTriggers  : true,
				listeners     : {
						select: function (combo, record)
						{
								Ext.getCmp('filtroIdCategMilitar_grado').setValue(record.data.idcategoriamilitar);
								if (Ext.getCmp('filtroAbreviatura_grado').getValue()!=''
										|| Ext.getCmp('filtroDenominacion_grado').getValue()!=''
										|| Ext.getCmp('filtroIdCategMilitar_grado').getValue()!=''
										|| Ext.getCmp('filtroIdEsMarina_grado').getValue()!='') {
										Ext.getCmp('btnAllA').enable();
										Ext.getCmp('btnBuscar').enable();
								} else {
										Ext.getCmp('btnAllA').disable();
										Ext.getCmp('btnBuscar').disable();
								}
						}
				}
		})
		var comboMarina = new Ext.form.ccoe.ComboBox({
				anchor        : '85%',
				editable      : false,
				name          : 'tipogrado',
				id            : 'filtroEsMarina_grado',
				autoCreate    : true,
				store         : storeEsMarina,
				mode          : 'local',
				forceSelection: true,
				enableQtip    : true,
				fieldLabel    : "Tipo de grado",
				displayField  : 'denominacion',
				valueField    : 'denominacion',
				triggerAction : 'all',
				hideTriggers  : true,
				listeners     : {
						select: function (combo, record)
						{
								Ext.getCmp('filtroIdEsMarina_grado').setValue(record.data.id);
								if (Ext.getCmp('filtroAbreviatura_grado').getValue()!=''
										|| Ext.getCmp('filtroDenominacion_grado').getValue()!=''
										|| Ext.getCmp('filtroIdCategMilitar_grado').getValue()!=''
										|| Ext.getCmp('filtroIdEsMarina_grado').getValue()!='') {
										Ext.getCmp('btnAllA').enable();
										Ext.getCmp('btnBuscar').enable();
								} else {
										Ext.getCmp('btnAllA').disable();
										Ext.getCmp('btnBuscar').disable();
								}
						}
				}
		})
		formFiltroGrado = new Ext.FormPanel({
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
										searchFiltroGrado();
								}
						},{
								key: 'b',
								alt: true,
								fn : function ()
								{
										searchFiltroGrado();
								}
						},{
								key: 'l',
								alt: true,
								fn : function ()
								{
										limpiar()
								}
						}
				],
				items      : [
						{
								layout     : 'form',
								columnWidth: .2,
								items      : [
										{
												xtype     : 'textfield',
												name      : 'denominacion',
												id        : 'filtroDenominacion_grado',
												vtype     : 'vtdenominaciones',
												maxLength : 100,
												emptyText : "Criterio a buscar...",
												fieldLabel: 'Denominación',
												anchor    : '85%',
												enableKeyEvents: true,
												listeners      : {
														keyup: function ()
														{
																if (Ext.getCmp('filtroAbreviatura_grado').getValue()!=''
																		|| Ext.getCmp('filtroDenominacion_grado').getValue()!=''
																		|| Ext.getCmp('filtroIdCategMilitar_grado').getValue()!=''
																		|| Ext.getCmp('filtroIdEsMarina_grado').getValue()!='') {
																		Ext.getCmp('btnAllA').enable();
																		Ext.getCmp('btnBuscar').enable();
																} else {
																		Ext.getCmp('btnAllA').disable();
																		Ext.getCmp('btnBuscar').disable();
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
												xtype          : 'textfield',
												vtype          : 'vtalfanumerico',
												name           : 'abreviatura',
												id             : 'filtroAbreviatura_grado',
												maxLength      : 10,
												emptyText      : "Criterio a buscar...",
												fieldLabel     : 'Abreviatura',
												anchor         : '85%',
												allowBlank     : true,
												enableKeyEvents: true,
												listeners      : {
														keyup: function ()
														{
																if (Ext.getCmp('filtroAbreviatura_grado').getValue()!=''
																		|| Ext.getCmp('filtroDenominacion_grado').getValue()!=''
																		|| Ext.getCmp('filtroIdCategMilitar_grado').getValue()!=''
																		|| Ext.getCmp('filtroIdEsMarina_grado').getValue()!='') {
																		Ext.getCmp('btnAllA').enable();
																		Ext.getCmp('btnBuscar').enable();
																} else {
																		Ext.getCmp('btnAllA').disable();
																		Ext.getCmp('btnBuscar').disable();
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
										comboCategoriaMilitar, {
												xtype: 'hidden',
												id   : 'filtroIdCategMilitar_grado',
												name : 'idcategoriamilitar'

										}
								]
						},
						{
								layout     : 'form',
								columnWidth: .2,
								items      : [
										comboMarina, {
												xtype: 'hidden',
												id   : 'filtroIdEsMarina_grado',
												name : 'marina'

										}
								]
						},
						{
								columnWidth: '35px',
								bodyStyle  : 'padding:19px 0 0 0;',
								layout     : 'form',
								items      : [
										{
												xtype   : 'button',
												//icon    : perfil.dirImg + 'buscar.png',
												text    : '<u>B</u>uscar',
												iconCls : 'buscar',
												id      : 'btnBuscar',
												disabled: true,
												tooltip : "Buscar grado militar <b>(Alt+B)</b>",
												handler : function ()
												{
														searchFiltroGrado();
												}
										}
								]
						},
						{
								columnWidth: '35px',
								bodyStyle  : 'padding:19px 0 0 0;',
								layout     : 'form',
								items      : [
										{
												xtype  : 'button',
												tooltip: "Limpiar filtros <b>(Alt+L)</b>",
												text   : '<u>L</u>impiar',
//												/icon   : perfil.dirImg + 'limpiar.png',
												id     : 'btnAllA',
												iconCls: 'limpiar',
												disabled: true,
												handler: function ()
												{
														limpiar();
												}
										}
								]
						}
				],listeners: {
						clientvalidation: function (_form, _valid)
						{
								if(!_valid){
										Ext.getCmp('btnAllA').disable()
										Ext.getCmp('btnBuscar').disable()
								}
						}
				}
		});
		var panelGestion = new Nomenclador.Panel.Gestion({
				id               : idTab,
				title            : 'Grado',
				name             : 'grado',
				clase            : 'grado',
				elemento         : 'grado',
				idTipoNomenclador: 12,
				mensajeEvento    : 'el grado seleccionado',
				mensajeCargando  : 'del grado',
				store            : stGrado,
				formFiltro       : formFiltroGrado,
				onBuscar         : searchFiltroGrado,
				idFoco           : 'filtroDenominacion_grado',
				columns          : [
						{dataIndex: 'idcategoriamilitar', sortable: true, header: 'idcategoría', width: 50, hidden: true},
						{dataIndex: 'idgrado', header: 'Código', renderer: Go.Util.convertCod, width: Go.Column.Config.Width('codigo'), hidden: true},
						{dataIndex: 'idicono', header: 'Código Imagen', irenderer: Go.Util.convertCod, width: Go.Column.Config.Width('codigo'), hidden: true},
						{dataIndex: 'nombre_imagen', renderer: Go.Column.Ttip.ToolTipColumn, sortable: true, header: "Icono", width: Go.Column.Config.Width('denagrupaciones'), hidden: true},
						{dataIndex: 'icono', header: 'Grado', renderer: Go.Column.Render.changeGrado, width: 50},
						{dataIndex: 'denominacion', renderer: Go.Column.Ttip.ToolTipColumn, sortable: true, header: "Denominación", id: 'denominacion', width: Go.Column.Config.Width('denagrupaciones')},
						{dataIndex: 'abreviatura', renderer: Go.Column.Ttip.ToolTipColumn, sortable: true, header: 'Abreviatura', width: Go.Column.Config.Width('abreviatura')},
						{dataIndex: 'categoriamilitar', renderer: Go.Column.Ttip.ToolTipColumn, sortable: true, header: 'Categoría militar', width: 140},
						{dataIndex: 'fechainicio', sortable: true, header: "Fecha inicio", renderer: Go.Column.Ttip.ToolTipColumn, width: Go.Column.Config.Width('abreviatura'), align: 'center'},
						{dataIndex: 'fechafin', sortable: true, header: "Fecha fin", renderer: Go.Column.Ttip.ToolTipColumn, width: Go.Column.Config.Width('abreviatura'), align: 'center'},
						{dataIndex: 'actual', sortable: false, header: "Actual", renderer: Go.Column.Render.changeValor, width: Go.Column.Config.Width('actual'), align: 'center'},
						{dataIndex: 'visible', sortable: false, header: "Visible", renderer: Go.Column.Render.changeValor, width: Go.Column.Config.Width('visible'), align: 'center'},
						{dataIndex: 'marina', sortable: false, header: "Es marina", renderer: Go.Column.Render.changeValor, width: Go.Column.Config.Width('visible'), align: 'center'}
				]

		})
		return panelGestion;
}