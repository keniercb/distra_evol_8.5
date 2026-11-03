Ext.QuickTips.init();
var perfil = window.parent.UCID.portal.perfil;
var windowsReporteGrafico = "", stConfiguracion;
function reporteGrafico(perfil, etiquetas)
{
		var cargarDefecto = true;
		var configuracionrecord, idconfiguracion;
		var btnAdicionar = new Ext.Button({
				text   : etiquetas.lbAdicionar, //				icon   : perfil.dirImg + 'adicionar.png',
				iconCls: 'adicionar',
				hidden : false,
				tooltip: etiquetas.lbTooltipAConfiguracion,
				id     : "btnaddDominio",
				handler: function ()
				{
						winAdicionarValores(etiquetas, 'adicionar', '');
				}
		});
		var btnAyuda = new Ext.Button({
				//				icon   : perfil.dirImg + 'ayuda.png',
				iconCls: 'ayuda', id: 'btnAyudaReporte', text: "Ayuda", hidden: false
		});
		var btnModificar = new Ext.Button({
				text    : etiquetas.lbModificar, //				icon    : perfil.dirImg + 'modificar.png',
				iconCls : 'modificar',
				disabled: true,
				hidden  : false,
				tooltip : etiquetas.lbTooltipMConfiguracion,
				id      : "btnmodDominio",
				handler : function ()
				{
						winAdicionarValores(etiquetas, 'modificar', configuracionrecord);
				}
		});
		var btnEliminar = new Ext.Button({
				text    : etiquetas.lbEliminar, //				icon    : perfil.dirImg + 'eliminar.png',
				iconCls : 'eliminar',
				disabled: true,
				hidden  : false,
				id      : "btneliDominio",
				tooltip : etiquetas.lbTooltipEConfiguracion,
				handler : function ()
				{
						mostrarMensaje(2, '&iquest;Est&aacute; seguro que quiere eliminar la configuraci&oacute;n seleccionada?', function (ok)
						{
								if (ok == 'ok') {
										Secodena.mostrarMascara('maskEliminar', '', 'Eliminando datos de la configuraci&oacute;n');
										var idgrafica = configuracionrecord.data.idgrafica;
										Ext.Ajax.request({
												url        : 'eliminarConfiguracion', method: 'POST', timeout: '36000', params: {
														idgrafica: idgrafica
												}, callback: function (options, success, response)
												{
														var responseData = Ext.decode(response.responseText);
														var codMsg = (responseData.codMsg == 4) ? 6 : responseData.codMsg;
														var msg = responseData.mensaje;
														mostrarMensaje(codMsg, msg);
														Secodena.ocultarMascara('maskEliminar');
														if (codMsg == 1) {
																Ext.getCmp('gridPanelConfiguracion').getStore().reload();
														}
												}
										});
								}
						});
				}
		});
		var btnGraficar = new Ext.Button({
				text    : etiquetas.lbGraficar, //				icon    : perfil.dirImg + 'graficar.png',
				iconCls : 'graficar',
				disabled: true,
				hidden  : false,
				tooltip : etiquetas.lbTooltipGConfiguracion,
				id      : "btngraficar",
				handler : function ()
				{
						graficarValores(configuracionrecord, etiquetas);
				}
		});
		var denbuscar = new Ext.form.TextField({
				fieldLabel     : etiquetas.lbDenominacion,
				emptyText      : etiquetas.emptyTextbuscar,
				vtype          : 'vtdenominaciones',
				width          : 300,

				id             : 'denbuscar',
				enableKeyEvents: true,
				listeners      : {
						keyup: function ()
						{
								if (denbuscar.getValue() != '' && denbuscar.isValid()) {
										btnClear.enable();
										btnBuscar.enable();
								} else {
										btnClear.disable();
										btnBuscar.disable();
								}
						}
				},
				maxlength      : 100
		});
		var btnBuscar = new Ext.Button({
				//				icon   : perfil.dirImg + 'buscar.png',
				id      : 'btnBuscarGrid',
				iconCls : 'buscar',
				tooltip : etiquetas.lbTooltipBConfiguracion,
				text    : etiquetas.lbBuscar,
				disabled: true,
				handler : function ()
				{
						if (denbuscar.getValue() != "") {
								stConfiguracion.reload();
						} else {
								mostrarMensaje(1, "No se ha introducido ning&uacute;n criterio de b&uacute;squeda.")
						}
				}
		});
		var btnClear = new Ext.Button({
				//				icon   : perfil.dirImg + 'limpiar.png',
				id      : 'btnClearField',
				iconCls : 'limpiar',
				tooltip : etiquetas.lbTooltipLConfiguracion,
				text    : etiquetas.lbLimpiar,
				disabled: true,
				handler : function ()
				{
						denbuscar.reset();
						stConfiguracion.reload();
				}
		});
		var panelBuscar = new Ext.FormPanel({
				layout      : 'column',
				region      : 'north',
				cls         : 'x-toolbar',
				monitorValid: true,
				height      : 66,
				frame       : true,
				defaults    : {
						border: false, labelAlign: 'top', buttonAlign: 'right'
				},
				bodyBorder  : false,
				border      : false,
				autoScroll  : true,
				hideBorders : true,
				items       : [{
						layout: 'form', items: denbuscar
				}, {
						bodyStyle: 'padding: 19px 0 0 15px;', layout: 'form', items: [btnBuscar]
				}, {
						bodyStyle: 'padding:19px 0 0px 15px;', layout: 'form', items: [btnClear]
				}],
				keys        : [{
						key: 'l',stopEvent:true, alt: true, handler: function ()
						{
								btnClear.handler.call();
						}
				}, {
						key: Ext.EventObject.ENTER, stopEvent:true,handler: function ()
						{
								btnBuscar.handler.call();
						}
				}],

		});
		stConfiguracion = new Ext.data.Store({
				url      : 'mostrarConfiguracion', listeners: {
						beforeload: function (stConfiguracion)
						{
								stConfiguracion.baseParams.limit = 15;
								stConfiguracion.baseParams.denominacion = (denbuscar.getValue() != '') ? denbuscar.getValue() : '';
						}
				}, reader: new Ext.data.JsonReader({
						root: 'datos', id: 'idgrafica', totalProperty: 'cantidad'
				}, [{
						name: 'idgrafica'
				}, {
						name: 'denominacion'
				}, {
						name: 'descripcion'
				}, {
						name: 'configuracion'
				}, {
						name: 'defecto'
				}])
		});
		var smConfiguracion = new Ext.grid.RowSelectionModel({
				singleSelect: true
		});
		smConfiguracion.on('rowselect', function (a, index, record)
		{
				configuracionrecord = record;
				idconfiguracion = configuracionrecord.data.idconfiguracion;
		});
		var gpConfiguracion = new Ext.grid.GridPanel({
				frame           : true,
				height          : 460,
				region          : 'center',
				title           : 'Configuraciones',
				id              : 'gridPanelConfiguracion',
				autoExpandColumn: 'desc',
				store           : stConfiguracion,
				keys            : [{
						key: Ext.EventObject.DELETE, fn: function ()
						{
								if (smConfiguracion.getSelections().length > 0) {
										btnEliminar.handler.call();
								}
						}
				}, {
						key: "m", stopEvent:true,alt: true, fn: function ()
						{
								if (smConfiguracion.getSelections().length > 0) {
										btnModificar.handler.call();
								}
						}
				}, {
						key: 'b', stopEvent:true,alt: true, fn: function ()
						{
								denbuscar.focus(true, true);
						}
				}, {
						key: "g", stopEvent:true,alt: true, fn: function ()
						{
								if (smConfiguracion.getSelections().length > 0) {
										btnGraficar.handler.call();
								}
						}
				}],
				sm              : smConfiguracion,
				viewConfig      : {
						getRowClass: function (record)
						{
								if (record.get('defecto')) {
										return 'Enviado';
								} else {
										return '';
								}
						}
				},
				listeners       : {
						cellclick: function (grid, rowIndex, columnIndex)
						{
								if (columnIndex == 2) {
										var idgrafica = grid.getSelectionModel().getSelected().get('idgrafica');
										var defecto = grid.getSelectionModel().getSelected().get('defecto');
										var text = (defecto) ? '¿Está seguro que desea desmarcar la configuración seleccionada por defecto?' : '¿Está seguro que desea seleccionar la configuración por defecto?';
										var accion = (defecto) ? 'Desmarcando' : 'Marcando';
										mostrarMensaje(2, text, function (btn)
										{
												if (btn == 'ok') {
														Secodena.mostrarMascara('marcando', "", accion + " la configuración seleccionada.");
														Ext.Ajax.request({
																url        : 'marcarConfiguracion', params: {
																		idgrafica: idgrafica, marcar: defecto
																}, callback: function (options, success, response)
																{
																		Secodena.ocultarMascara('marcando');
																		var responseData = Ext.decode(response.responseText);
																		if (responseData.codMsg == 1) {
																				stConfiguracion.load({params: {start: 0, limit: 15}});
																		}
																}
														})
												}
										})
								}
						}
				},
				columns         : [{
						id: 'denom', header: 'Denominaci&oacute;n', sortable: true, width: 250, dataIndex: 'denominacion'
				}, {
						id: 'desc', header: 'Descripci&oacute;n', sortable: true, dataIndex: 'descripcion'
				}, {
						dataIndex: 'defecto',
						header   : "Defecto",
						renderer : Go.Column.Render.changeValorRadio,
						width    : Go.Column.Config.Width('actual'),
						align    : 'center'
				}],
				bbar            : new Ext.PagingToolbar({
						pageSize: 15, store: stConfiguracion, displayInfo: true
				})
		});
		stConfiguracion.load({params: {start: 0, limit: 15}});
		stConfiguracion.on('load', function (store, records)
		{
				Secodena.ocultarMascara('cargaini');
				smConfiguracion.clearSelections();
				btnModificar.disable();
				btnEliminar.disable();
				btnGraficar.disable();
				if (records.length == 0) {
						denbuscar.reset();
						mostrarMensaje(1, etiquetas.msgnoHayConfiguracion);
				}
				denbuscar.focus(true, 10);
				if (cargarDefecto) {
						for (var i = 0; i < records.length; i++) {
								if (records[i].data.defecto) {
										configuracionrecord = records[i];
										idconfiguracion = configuracionrecord.data.idconfiguracion;
										btnGraficar.handler.call();
								}
						}
				}
				cargarDefecto = false;
		});
		stConfiguracion.on('beforeload', function ()
		{
				Secodena.mostrarMascara('cargaini', '', 'Cargando datos');
		})
		smConfiguracion.on('selectionchange', function (_rs)
		{
				if(_rs.hasSelection()){
						btnModificar.enable();
						btnEliminar.enable();
						btnGraficar.enable();
				}else{
						btnModificar.disable();
						btnEliminar.disable();
						btnGraficar.disable();
				}

		});
		var panelContenedor = new Ext.Panel({
				layout: 'border',
				border: false,
				region: 'center',
				tbar  : [btnAdicionar, btnModificar, btnEliminar, btnGraficar, '->', btnAyuda],
				items : [panelBuscar, gpConfiguracion],
				keys  : [{
						key: 'i', alt: true, fn: function ()
						{
								btnAdicionar.handler.call();
						}
				}]
		});
		windowsReporteGrafico = new Ext.Viewport({
				title      : 'Reporte Gráfico',
				id         : 'ventanaReporte',
				modal      : true,
				layout     : 'fit',
				resizable  : false,
				closeAction: 'destroy',
				closable   : true,
				items      : [panelContenedor]
		});
}