function graficarValores(record, etiquetas)
{
		var configuracion = record.data.configuracion;
		var config = Ext.decode(configuracion);
		var denominacion = record.data.denominacion;
		var denConcepto = dameDenominacion(config[0]);
		var wConfigurarGrafica;
		var tab;
		var arrayValoresGraficar = [];
		var idestructuras = [];
		var maskgeneral = new Ext.LoadMask(Ext.getBody(), {msg: "Por favor espere..."});
		/* TREE LOADER DEL ARBOL DE ESTRUCTURAS */
		var loaderEstructura = new Ext.tree.TreeLoader({
				dataUrl: 'cargarEstructura'
		});
		loaderEstructura.on("load", function (treeLoader, node, resp)
		{
				var hijos = node.childNodes;
				for (var i = 0; i < hijos.length; i++) {
						if (hijos[i].attributes.idconcepto == '7' || hijos[i].attributes.idconcepto == '9') {
								hijos[i].setText(hijos[i].attributes.text + ' <b>[' + hijos[i].attributes.cantidad + ' | ' + hijos[i].attributes.cantidad_real + ']')
						}
						if (hijos[i].attributes.es == true) {
								hijos[i].setText("<font color = #0000ff >" + hijos[i].attributes.text + "</font>");
						}
				}
		})
		var tree = new Ext.tree.TreePanel({
				autoScroll     : true,
				maskDisabled   : false,
				animate        : true,
				region         : 'center',
				containerScroll: true,
				loader         : loaderEstructura,
				root           : {
						nodeType : 'async',
						icono    : '../../../comun/recursos/iconos/organigrama/menu/forum.gif',
						text     : etiquetas.lbEstructuras,
						draggable: false,
						id       : "Estructuras"
				}
		})
		tree.on('checkchange', function (node, estado)
		{
				if (estado) {
						guardarIdEstructura(node.id);
				} else {
						borrarIdEstructura(node.id);
				}
				dameValoresGraficar(tabs.activeTab.id, '', idestructuras)
		})
		tree.getRootNode().expand();
		dameValoresGraficar('barras', 'Barras', idestructuras);
		var dir = '../../../comun/recursos/iconos/grafica/';
		var btnPie = new Ext.Button({
				//				icon   : dir + 'chart_pie.png',
				iconCls: 'chart_pie',
				tooltip: "Pastel",
				handler: function ()
				{
						dameValoresGraficar('pie', 'Pastel', idestructuras);
				}
		})
		var btnBarras = new Ext.Button({
				//				icon   : dir + 'chart_bar.png',
				iconCls: 'chart_bar',
				tooltip: "Barras",
				handler: function ()
				{
						dameValoresGraficar('barras', 'Barras', idestructuras);
				}
		})
		var btnLinea = new Ext.Button({
				//				icon   : dir + 'chart_line.png',
				iconCls: 'chart_line',
				tooltip: "Línea",
				handler: function ()
				{
						dameValoresGraficar('lineal', 'Línea', idestructuras);
				}
		})
		var btnCurvas = new Ext.Button({
				//				icon   : dir + 'chart_curve.png',
				iconCls: 'chart_curve',
				tooltip: "Curva",
				handler: function ()
				{
						dameValoresGraficar('linearea', 'Área', idestructuras);
				}
		})
		var btnGuardar = new Ext.Button({
				//				icon   : perfil.dirImg + 'guardar.png',
				iconCls: 'guardar',
				hidden : true,
				tooltip: "Guardar imagen",
				handler: function ()
				{
						myChart.exportChart();
				}
		})
		var btnImprimir = new Ext.Button({
				//				icon   :  perfil.dirImg + 'imprimir.png',
				iconCls: 'imprimir',
				tooltip: "Imprimir",
				handler: function ()
				{
						myChart.print();
				}
		})
		var tabs = new Ext.TabPanel({
				frame          : false,
				title          : etiquetas.lbGrafica,
				region         : 'center',
				margins        : '3 3 3 0',
				activeTab      : 0,
				height         : 500,
				hidden         : true,
				autoScroll     : true,
				enableTabScroll: true,
				tbar           : ['->', btnBarras, '-', btnPie, '-', btnLinea, '-', btnCurvas, '-', btnGuardar, ' ', btnImprimir],
				defaults       : {
						autoScroll: true
				}
		});
		var panelTreeEstructuras = new Ext.form.FormPanel({
				layout     : 'fit',
				height     : 580,
				width      : 310,
				collapsible: true,
				split      : true,
				region     : 'west',
				title      : etiquetas.lbEstructura,
				frame      : false,
				autoScroll : true,
				labelAlign : 'top',
				items      : [tree]
		})
		var panelGeneral = new Ext.Panel({
				frame : false,
				title : 'Recuperación gráfica',
				layout: 'border',
				items : [panelTreeEstructuras, tabs]
		});

		function dameDenominacion(concepto)
		{
				var den = '';
				switch (concepto) {
						case "1":
								den = 'Órgano';
								break;
						case "2":
								den = 'Agrupación';
								break;
						case "3":
								den = 'Entidad';
								break;
						case "4":
								den = 'Organización';
								break;
						case "5":
								den = 'Órgano interno';
								break;
						case "6":
								den = 'Agrupación interna';
								break;
						case "7":
								den = 'Cargo';
								break;
						case "8":
								den = 'Estructura no formal';
								break;
						case "9":
								den = 'Medio';
								break;
				}
				return den;
		}

		function borrarIdEstructura(idestructura)
		{
				idestructuras.remove(idestructura);
		}

		function guardarIdEstructura(idestructura)
		{
				if (idestructura.indexOf(idestructura) != -1) {
						idestructuras.push(idestructura);
				}
		}

		function crearTab(titleconcepto, idtab, grafica)
		{
				tab = new Ext.Panel({
						title     : titleconcepto + ' ( ' + grafica + ' )',
						closable  : true,
						layout    : 'fit',
						autoHeight: true,
						autoScroll: true,
						id        : idtab,
						border    : false,
						defaults  : {
								collapsible: true
						}
				});
				tab.on('afterlayout', function (panel)
				{
						if (arrayValoresGraficar[0] == 7 || arrayValoresGraficar[0] == 9) {

								if (comprobarExistencia(arrayValoresGraficar[1])) {
										graficar('graf' + idtab, panel.body.dom, arrayValoresGraficar[1], denConcepto);
								} else {
										mostrarMensaje(1, 'No existen valores que cumplan con la configuración seleccionada.')
								}
						} else {
								graficar('graf' + idtab, panel.body.dom, arrayValoresGraficar[1], denConcepto);
						}
				});
				return tab;
		}

		function comprobarExistencia(array)
		{
				var cant = 0;
				for (var i = 0; i < array.length; i++) {
						cant += parseInt(array[i].cantidad);
				}
				if (cant > 0) {
						return true;
				} else {
						return false;
				}
		}

		function dameValoresGraficar(id, tipo, idestructuras)
		{
				maskgeneral.show();
				var est = Ext.encode(idestructuras);
				Ext.Ajax.request({
						url     : 'dameValoresGraficar',
						method  : 'POST',
						params  : {
								configuracion: configuracion,
								idestructuras: est
						},
						callback: function (options, success, response)
						{
								if (success) {
										arrayValoresGraficar = Ext.decode(response.responseText);
										if (arrayValoresGraficar[1].length > 0) {
												tabs.setVisible(true);
												var idtab = id;
												var flag = true;
												for (var i = 0; i < tabs.items.length; i++) {
														var tabid = tabs.items.items[i].id;
														if (tabid == idtab) {
																flag = false;
																tabs.activate(Ext.getCmp(tabid));
																tabs.items.items[i].render();
																tabs.items.items[i].doLayout();
																tabs.doLayout();
																break;
														}
												}
												if (flag) {
														var panel = crearTab(denominacion, idtab, tipo);
														tabs.add(panel);
														tabs.activate(Ext.getCmp(idtab));
														tabs.doLayout();
												}
										} else {
												mostrarMensaje(1, 'No existen valores que cumplan con la configuración seleccionada.')
										}
										maskgeneral.hide();
								}
						}
				});
		}

		wConfigurarGrafica = new Ext.Window({
				modal      : true,
				closeAction: 'destroy',
				title      : "Recuperación gráfica",
				layout     : 'fit',
				maximizable: true,
				constrain   : true,
				resizable  : false,
				title      : etiquetas.lbGraficarConfiguracion,
				width      : 880,
				items      : [panelGeneral],
				height     : 597,
				buttons    : [
						{
								//								icon   : perfil.dirImg + 'cerrar.png',
								iconCls: 'cerrar',
								id     : 'btncerrar',
								tooltip: etiquetas.lbtCerrar,
								text   : etiquetas.lbCerrar,
								handler: function ()
								{
										wConfigurarGrafica.destroy();
								}
						}
				]
		});
		wConfigurarGrafica.show();
		wConfigurarGrafica.maximize();
}