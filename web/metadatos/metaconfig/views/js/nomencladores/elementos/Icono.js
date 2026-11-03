var stIcono, formFiltroIcono;
var paramIcono = new Array();
paramIcono.push(18);
var searchFiltroIcono = function ()
{
		var denominacion = Ext.getCmp('filtroDenominacion_icono').getValue();
		if (denominacion != '') {
				var form = formFiltroIcono.getForm();
				if (form.isValid()) {
						var params = new Array();
						params.push(18);
						params.push(form.getValues());
						stIcono.reload({
								params  : {
										start     : 0,
										limit     : 10,
										clase     : 'icono',
										parametros: Ext.encode(params)
								},
								callback: function (a)
								{
										if (a.length == 0) {
												Secodena.ocultarMascara('cargaini');
												mostrarMensaje(1, "No existen datos que se correspondan con los criterios de b&uacute;squeda especificados.");
												Secodena.ocultarMascara('cargaini');
												//formFiltroIcono.getForm().reset();
												// stIcono.reload({params: {start: 0, limit: 10}});
										}
								}
						})
				}
		} else {
				mostrarMensaje(1, "No se ha introducido ningún criterio de búsqueda.");
				Ext.getCmp('filtroDenominacion_icono').focus(false, 10);
		}
}
function construirIcono(idTab)
{
		stIcono = new Ext.data.Store({
				url      : 'mostrarValores',
				remoteSort:true,
				reader   : new Ext.data.JsonReader({
						root         : 'datos',
						totalProperty: 'cant'
				}, [
						{name: 'id'},
						{name: 'idicono'},
						{name: 'icono'},
						{name: 'denominacion'},
						{name: 'concepto'},
						{name: 'medio'},
						{name: 'grado'},
						{name: 'logo'},
						{name: 'fechainicio'},

						{name: 'denanterior', mapping: 'denominacion'}
				]),
				listeners: {
						beforeload: function (store, param)
						{
								param = myBeforeLoad(param, "filtroDenominacion_icono", false, formFiltroIcono, 18, paramIcono, 'icono')
								return param;
						},
						load      : function ()
						{
								Secodena.ocultarMascara('cargaini');
								Ext.getCmp('filtroDenominacion_icono').focus(false, 10);
								$('.icono').on('mouseover', function (e)
								{
										var data = $(this).attr('url');
										var top = e.pageY;
										var left = e.pageX - 150;
										top = top - 80;
										$('#previewIcon').attr('src', data);
										$('#previewI').css('display', 'block');
										$('#previewI').css('top', top);
										$('#previewI').css('left', left);
										$('#previewI').css('opacity', 1);
										$(this).on('mousemove', function (e)
										{
										})
								})
								$('.icono').on('mouseout', function (e)
								{
										$('#previewI').css('opacity', 0);
										$('#previewI').css('-webkit-transition', 'all 0.3s ease-in-out');
										$('#previewI').css('-moz-transition', 'all 0.3s ease-in-out');
										$('#previewI').css('-o-transition', 'all 0.3s ease-in-out');
										$('#previewI').css('-ms-transition', 'all 0.3s ease-in-out');
										$('#previewI').css('transition', 'all 0.3s ease-in-out');
										setTimeout(function ()
										{
												$('#previewI').css('display', 'none');
										}, 3000);
								})
						}
				}
		});
		function limpiar()
		{
				Ext.getCmp('btnAllIcono').disable();
				Ext.getCmp('btnBuscarIcono').disable();
				formFiltroIcono.getForm().reset();
				stIcono.reload({params: {start: 0, limit: 10}});
		}

		formFiltroIcono = new Ext.FormPanel({
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
										searchFiltroIcono();
								}
						},{
								key: 'b',
								alt: true,
								fn : function ()
								{
										searchFiltroIcono();
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
								items      : [
										{
												xtype     : 'textfield',
												name      : 'denominacion',
												id        : 'filtroDenominacion_icono',
												vtype     : 'vtdenominaciones',
												maxLength : 100,
												emptyText : "Criterio a buscar...",
												fieldLabel: 'Denominación',
												anchor    : '85%',
												allowBlank: true,
												enableKeyEvents: true,
												listeners      : {
														keyup: function ()
														{
																if ( Ext.getCmp('filtroDenominacion_icono').getValue()!='') {
																		Ext.getCmp('btnAllIcono').enable();
																		Ext.getCmp('btnBuscarIcono').enable();
																} else {
																		Ext.getCmp('btnAllIcono').disable();
																		Ext.getCmp('btnBuscarIcono').disable();
																}
														}
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
												xtype   : 'button',
												//icon    : perfil.dirImg + 'buscar.png',
												text    : 'Buscar',
												iconCls : 'buscar',
												id      : "btnBuscarIcono",
												disabled: true,
												tooltip : "Buscar íconos <b>(Alt+B)</b>",
												handler : function ()
												{
														searchFiltroIcono();

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
												text   : 'Limpiar',
												//icon   : perfil.dirImg + 'limpiar.png',
												iconCls: 'limpiar',
												id      : "btnAllIcono",
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
										Ext.getCmp('btnAllIcono').disable()
										Ext.getCmp('btnBuscarIcono').disable()
								}
						}
				}
		});
		var panelGestion = new Nomenclador.Panel.Gestion({
				id               : idTab,
				title            : 'Ícono',
				name             : 'icono',
				clase            : 'icono',
				elemento         : 'ícono',
				idTipoNomenclador: 18,
				mensajeEvento    : 'el ícono seleccionado',
				mensajeCargando  : 'del ícono',
				store            : stIcono,
				formFiltro       : formFiltroIcono,
				onBuscar         : searchFiltroIcono,
				idFoco           : 'filtroDenominacion_icono',
				columns          : [
						{dataIndex: 'idicono', sortable: true, header: 'Código', renderer: Go.Util.convertCod, width: Go.Column.Config.Width('codigo'), hidden: true},
						{dataIndex: 'icono', renderer:Go.Column.Render.changeImagen, sortable: true, header: "Ícono", width: Go.Column.Config.Width('visibleGridIcono'), align: 'center'},
						{dataIndex: 'denominacion', renderer: Go.Column.Ttip.crearDenominacionImagen, sortable: true, header: "Denominación", id: 'denominacion', width: Go.Column.Config.Width('denominacion')},
						{dataIndex: 'concepto', header: "Concepto", renderer:Go.Column.Render.changeValor, width: Go.Column.Config.Width('visibleGridIcono'), align: 'center'},
						{dataIndex: 'medio', header: "Medio", renderer:Go.Column.Render.changeValor, width: Go.Column.Config.Width('visibleGridIcono'), align: 'center'},
						{dataIndex: 'grado', header: "Grado", renderer:Go.Column.Render.changeValor, width: Go.Column.Config.Width('visibleGridIcono'), align: 'center'},
						{dataIndex: 'logo', header: "Logotipo", renderer:Go.Column.Render.changeValor, width: Go.Column.Config.Width('visibleGridIcono'), align: 'center'},
						{dataIndex: 'fechainicio', renderer:  Go.Column.Ttip.ToolTipColumn, sortable: true, header: "Fecha inicio", id: 'fechainicio', width: Go.Column.Config.Width('abreviatura'),align : 'center'}

				]
		})
		return panelGestion;
}
