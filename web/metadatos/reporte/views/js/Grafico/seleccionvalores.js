function winAdicionarValores(etiquetas, windows, recordConfig)
{
		var validarDes, validarDen, validarCon, validaVal;
		var objSeleccionados, objSeleccionadosVista;
		var maskgeneral = new Ext.LoadMask(Ext.getBody(), {msg: "Por favor espere..."});
		if (recordConfig != '') { //Ocurre cuando la ventana a mostrar es la de modificar
				actualizarArrayVista(recordConfig.data.configuracion);
		} else {
				objSeleccionados = ['', ['', []]]
				objSeleccionadosVista = ['', ['', []]]
		}
		this.responsedata = [];
		var cerrar = false;
		var identificador, st, smPropiedades, cmPropiedades;
		var responseData = [];
		var treeConformacion;
		var mithis = this;
		mithis.oldDescripcion = '';
		//para almacenar la relacion concepto, propiedades y valores de propiedad
		//  objSeleccionados[0] Me da el concepto
		//  objSeleccionados[1][0] Me da el identificador de la propiedad (id de la tabal nom_propiedad);
		//  objSeleccionados[1][1] Me da el arreglo de valores asociados a esta propiedad
		//  objSeleccionadosVista[0] Me da el concepto
		//  objSeleccionadosVista[1][0] Me da el identificador de la propiedad (id de la tabal nom_propiedad);
		//  objSeleccionadosVista[1][1] Me da el arreglo de valores asociados a esta propiedad
		var stConceptos = new Ext.data.Store({
				url: 'getConceptos', reader: new Ext.data.JsonReader({
						root: 'datos', id: 'idconcepto', totalProperty: 'cantidad'
				}, [{
						name: 'idconcepto'
				}, {
						name: 'denominacion'
				}])
		});
		stConceptos.load();
		stConceptos.on('load', function ()
		{
				if (windows == 'modificar') {
						actualizarcombo();
				}
		})
		var cbConceptos = new Ext.form.ComboBox({
				store         : stConceptos,
				id            : 'cbConceptos',
				forceSelection: true,
				labelWidth    : 150,
				width         : 160,
				editable      : false,
				allowBlank    : false,
				displayField  : 'denominacion',
				valueField    : 'idconcepto',
				typeAhead     : true,
				enableQtip    : true,
				mode          : 'local',
				triggerAction : 'all',
				emptyText     : etiquetas.emptyTextConcepto,
				selectOnFocus : true
		});
		cbConceptos.on('select', function (combo, record, index)
		{
				objSeleccionados = ["", ["", []]];
				objSeleccionadosVista = ["", ["", []]];
				var idconcepto = record.data.idconcepto;
				damePropiedades(idconcepto);
				if (treeConformacion) {
						paneltree.remove(treeConformacion);
						paneltree.collapse();
				}
		});
		var denconfiguracion = new Ext.form.TextField({
				width     : 150,
				vtype     : 'vtdenominaciones',
				blankText : etiquetas.btcampoobligatorio,
				id        : 'denconfiguracion',
				maxLength : 100,
				allowBlank: false
		});
		var descripcion = new Ext.form.TextField({
				width    : 150,
				vtype    : 'vtletrasextendidos',
				maxLength: 255,
				blankText: etiquetas.btcampoobligatorio,
				id       : 'descripcion'
		});
		var paneltree = new Ext.Panel({
				region     : 'east',
				title      : etiquetas.titleseleccion,
				collapsible: true,
				layout     : 'fit',
				collapsed  : true,
				autoScroll : true,
				width      : 250,
				split      : true
		})
		paneltree.doLayout();
		paneltree.on('collapse', function ()
		{
				if (treeConformacion && objSeleccionadosVista[0] == '') {
						paneltree.remove(treeConformacion);
						treeConformacion = false;
				}
		});
		var tabs = new Ext.TabPanel({
				region: 'center', activeTab: 0, id: 'tabpropiedades', enableTabScroll: true, split: true, defaults: {
						autoScroll: true
				}
		});
		var pGestion = new Ext.form.FormPanel({
				border      : false,
				frame       : false,
				monitorValid: true,
				tbar        : ['Denominación :', '-', denconfiguracion, '-', 'Descripción :', '-', descripcion, '-', 'Conceptos :', '-', cbConceptos],
				layout      : 'border',
				height      : 300,
				width       : 300,
				items       : [tabs, paneltree],
				listeners   : {
						'clientvalidation': function (_form, _valid)
						{
								var ready = false;
								if (windows != 'modificar') {
										var valida = (objSeleccionados[0] == '') ? false : true;
										if ((denconfiguracion.isValid()) && (cbConceptos.isValid()) && (valida)) {
												ready = true;
										}
								} else {
										if ((validarDen != denconfiguracion.getValue()) || (validarCon != cbConceptos.getValue()) || (validarDes != descripcion.getValue()) || (!equals(validaVal, objSeleccionados))) {
												ready = (objSeleccionados[0] == '') ? false : true;
										}
								}
								if (ready) {
										Ext.getCmp('btnAplicar').enable();
										Ext.getCmp('btnAceptar').enable();
								} else {
										Ext.getCmp('btnAplicar').disable();
										Ext.getCmp('btnAceptar').disable();
								}
						}
				}
		});
		var winAddValores = new Ext.Window({
				modal       : true,
				closeAction : 'destroy',
				layout      : 'fit',
				maximizable : true,
				constrain   : true,
				autoValidate: false,
				resizable   : false,
				id          : 'winAddValores',
				title       : etiquetas.tittlewinAdd,
				width       : 750,
				height      : 400,
				buttons     : [{
					
						iconCls: 'cancelar',
						id     : 'btnCancelar',
						prevTab: 'descripcion',
						tooltip: etiquetas.tooltipCancelar,
						text   : etiquetas.lbBtnCancelar,
						handler: function ()
						{
								Go.Util.MsgCerrarWin(winAddValores, Ext.getCmp('btnaddDominio'));
						}
				}, {
						//								icon    : perfil.dirImg + 'aplicar.png',
						iconCls : 'aplicar',
						text    : etiquetas.lbBtnAplicar,
						id      : 'btnAplicar',
						disabled: true,
						tooltip : etiquetas.tooltipAplicar,
						handler : function ()
						{
								if (validarEnvioValores() && pGestion.getForm().isValid()) {
										enviarValores();
								}
						}
				}, {
						//								icon    : perfil.dirImg + 'aceptar.png',
						iconCls : 'aceptar',
						text    : etiquetas.lbBtnAceptar,
						id      : 'btnAceptar',
						disabled: true,
						tooltip : etiquetas.tooltipAceptar,
						handler : function ()
						{
								if (validarEnvioValores()) {
										cerrar = true;
										enviarValores();
								}
						}
				}]
		});
		winAddValores.add(pGestion);
		winAddValores.doLayout();
		winAddValores.show();
		denconfiguracion.focus(false, 10);
		if (windows == 'modificar') {
				actualizarinterfazmodificar();
		}
		descripcion.on('focus', function ()
		{
				winDescripcion();
				if (windows == 'modificar') {
						Ext.getCmp('btnAceptar').setDisabled(false);
				}
		});
		paneltree.on('expand', function ()
		{
				actualizarpanelconformacion();
		});
		//	************************************ Funciones auxiliares*******************************
		function winDescripcion()
		{
				mithis.descripcion = descripcion.getValue();
				var winDescripcion = new Ext.Window({
						title      : 'Descripción',
						width      : 400,
						height     : 250,
						layout     : 'fit',
						constrain  : true,
						closeaction: 'destroy',
						modal      : true,
						items      : [{
								xtype    : 'textarea',
								id       : 'areaDescripcion',
								name     : 'areaDescripcion',
								vtype    : 'vtletrasextendidos',
								maxLength: 255,
								value    : mithis.descripcion
						}],
						buttons    : [{
								//										icon   : perfil.dirImg + 'aceptar.png',
								iconCls: 'aceptar', text: etiquetas.lbBtnAceptar, handler: function ()
								{
										if (Ext.getCmp('areaDescripcion').isValid()) {
												mithis.descripcion = Ext.getCmp('areaDescripcion').getValue();
												Ext.getCmp('descripcion').setValue(mithis.descripcion);
												winDescripcion.destroy();
										}
								}
						}]
				})
				winDescripcion.show();
				Ext.getCmp("areaDescripcion").focus(false, 10);
		}

		function validarEnvioValores()
		{
				if (denconfiguracion.isValid() && descripcion.isValid()) {
						if (objSeleccionados[0] == "") {
								mostrarMensaje(2, 'No se ha seleccionado ningún valor para la configuración.');
						} else {
								if (denconfiguracion.getValue() == '') {
										mostrarMensaje(2, 'El campo denominación es obligatorio.');
								} else {
										return true;
								}
						}
				} else {
						return false;
				}
		}

		function actualizarcombo()
		{
				var idconcepto = objSeleccionados[0];
				cbConceptos.setValue(idconcepto);
				validarCon = objSeleccionados[0];
				damePropiedades(idconcepto);
		}

		function damePropiedades(idconcepto)
		{
				maskgeneral.show();
				Ext.Ajax.request({
						url        : 'damePropiedades', method: 'POST', params: {
								idconcepto: idconcepto
						}, callback: function (options, success, response)
						{
								responseData = Ext.decode(response.responseText);
								this.responsedata = responseData;
								construirTabs(this.responsedata);
								tabs.doLayout();
								pGestion.doLayout();
								var activartab = tabs.items.items[0].id;
								tabs.activate(activartab);
								pGestion.startMonitoring();
						}
				});
		}

		function construirTabs(responsedata)
		{
				var cont = tabs.items.items.length;
				if (cont > 0) { //Limpio el tabpanel
						for (var i = cont - 1; i >= 0; i--) {
								tabs.remove(tabs.items.items[i]);
						}
				}
				for (var i = 0; i < this.responsedata.length; i++) { //Lleno el tabpanel
						var idtab = this.responsedata[i].idconceptopropiedad;
						var tab = crearTab(this.responsedata[i].denominacion, idtab, this.responsedata);
						tabs.add(tab);
				}
		}

		function crearTab(titlepropiedad, idtab, responsedata)
		{
				var tab = new Ext.Panel({
						title     : titlepropiedad,
						autoScroll: true,
						closable  : true,
						layout    : 'fit',
						id        : 'tab' + idtab,
						border    : false,
						defaults  : {
								collapsible: true
						}
				});
				tab.on('activate', function (tab)
				{
						for (var i = 0; i < responsedata.length; i++) {
								var idtemporal = 'tab' + responsedata[i].idconceptopropiedad;
								if (idtemporal == tab.id) {
										identificador = responsedata[i].idconceptopropiedad;
										var referencia = responsedata[i].referencia;
										break;
								}
						}
						var grid = construirgrid(identificador, referencia);
						if (tab.items == undefined) {
								tab.add(grid);
								tabs.doLayout();
						} else {
								tab.remove(0);
								tab.add(grid);
								tabs.doLayout();
						}
				})
				return tab;
		}

		function construirgrid(identificador, referencia)
		{
				var gridP;
				var rc = [{
						name: 'identificador'
				}, {
						name: 'denominacion'
				}, {
						name: 'abreviatura'
				}];
				st = new Ext.data.Store({
						url      : 'mostrarPropiedad', listeners: {
								beforeload: function (stDominio)
								{
										st.baseParams.identificador = identificador;
								}
						}, reader: new Ext.data.JsonReader({
								root: 'datos', id: 'identificador', totalProperty: 'cantidad'
						}, rc)
				});
				st.load({params: {start: 0, limit: 10}});
				smPropiedades = new Ext.grid.CheckboxSelectionModel();
				var cm = [smPropiedades, {
						header   : referencia != 'nom_salario' ? etiquetas.lbDenominacion : etiquetas.lbsalario,
						width    : 300,
						sortable : true,
						dataIndex: 'denominacion',//referencia != 'nom_salario' ? 'denominacion' : 'salario',
						id       : 'expandir'
				}, {
						header   : etiquetas.lbAbreviatura,
						width    : 100,
						hidden   : referencia != 'nom_salario' ? false : true,
						sortable : true,
						dataIndex: 'abreviatura',
						id       : 'abreviatura'
				}];
				cmPropiedades = new Ext.grid.ColumnModel({
						id: 'expandir', autoExpandColumn: 'expandir', columns: cm
				});
				st.on('load', function (t, rcs, options)
				{
						var cant = objSeleccionados.length;
						if (cant > 0) {
								for (var i = 1; i < cant; i++) {
										if (objSeleccionados[i][0] == identificador) { //compruebo que el grid coincida con la propiedad
												var vals = objSeleccionados[i][1];//Cojo los valores almacenados hasta el momento en este grid
												if (vals.length > 0) {
														marcarseleccionados(rcs, vals);
												}
										}
								}
						}
						maskgeneral.hide();
				})
				gridP = new Ext.grid.GridPanel({
						id          : 'grid' + identificador,
						maskDisabled: false,
						store       : st,
						loadMask    : st,
						split       : true,
						cm          : cmPropiedades,
						sm          : smPropiedades,
						bbar        : new Ext.PagingToolbar({
								pageSize: 10, store: st, displayInfo: true
						})
				});
				gridP.getSelectionModel().on('rowselect', function (t, index, record)
				{
						var concepto = cbConceptos.getValue();
						var propiedad = identificador;
						var valor = record.id;
						var denvalor = record.data.denominacion;
						var denpropiedad = tabs.getActiveTab().title;
						if (objSeleccionados[0] == concepto) { //Para cuando ya se selecciono algun valor de propiedad para el concepto
								guardarpropiedad(propiedad, valor, denpropiedad, denvalor);
						} else { //Para cuando no se ha seleccionado ningun valor de propiedad para el concepto
								objSeleccionados[0] = concepto;
								objSeleccionados[1][0] = propiedad;
								objSeleccionados[1][1].push(valor);
								objSeleccionadosVista[0] = cbConceptos.getRawValue();
								objSeleccionadosVista[1][0] = denpropiedad;
								objSeleccionadosVista[1][1].push(denvalor);
						}
						actualizarpanelconformacion();
						habilitarbotones();
				})
				gridP.getSelectionModel().on('rowdeselect', function (t, index, record)
				{
						var concepto = cbConceptos.getValue();
						var propiedad = identificador;
						var valor = record.id;
						var denvalor = record.data.denominacion;
						var denpropiedad = tabs.getActiveTab().title;
						eliminarpropiedadvalor(concepto, propiedad, valor, denpropiedad, denvalor);
						actualizarpanelconformacion();
						habilitarbotones();
				})
				return gridP;
		}

		function damehijos()
		{
				var nodes = [];
				var childrens = [];
				for (var i = 1; i < objSeleccionadosVista.length; i++) {
						for (var j = 0; j < objSeleccionadosVista[i][1].length; j++) {
								var idnodo = 'nodoV' + objSeleccionados[i][1][j];
								var hojas = {text: objSeleccionadosVista[i][1][j], id: idnodo, expanded: true, leaf: true};
								childrens.push(hojas);
						}
						var idn = 'nodoP' + objSeleccionados[i][0];
						var temp = {
								text: objSeleccionadosVista[i][0], id: idn, expanded: true, leaf: false, children: childrens
						};
						childrens = [];
						nodes.push(temp);
				}
				return nodes;
		}

		function construirtreeconfiguracion()
		{
				var childrens = damehijos();
				var idnodo = 'nodo' + objSeleccionados[0];
				var node = [{
						text: objSeleccionadosVista[0], id: idnodo, expanded: false, leaf: false, children: childrens
				}];
				treeConformacion = new Ext.tree.TreePanel({
						autoScroll         : true, id: 'tpConformacion', margins: '0 0 0 2', layoutConfig: {
								animate: true
						}, root            : new Ext.tree.AsyncTreeNode({
								text: etiquetas.lbConcepto, id: 'conceptos', expanded: true, children: node
						}), containerScroll: true
				});
				treeConformacion.on('contextmenu', function (n, e)
				{
						var contextMenu = new Ext.menu.Menu({
								items: [{
										text: etiquetas.lbBtnExpandir, id: 'Expandir', handler: function ()
										{
												n.expand(true);
										}
								}]
						})
						contextMenu.showAt(e.getXY());
				})
				treeConformacion.show();
				return treeConformacion;
		}

		function existepropiedad(idpropiedad)
		{
				var flag = false;
				for (var i = 1; i < objSeleccionados.length; i++) {
						var idp = 'nodoP' + objSeleccionados[i][0];
						if (idp == idpropiedad) {
								flag = true;
								break;
						}
				}
				return flag;
		}

		function actualizarNodeByIdPropiedad(idpropiedad, node)
		{
				var cont = node.childNodes.length;
				for (var k = cont - 1; k >= 0; k--) {  //Borro los hijos que tenia el nodo anteriormente
						node.removeChild(node.childNodes[k])
				}
				if (existepropiedad(idpropiedad)) {
						for (var i = 1; i < objSeleccionados.length; i++) { //Actualizo sus hijos segun los cambios en el objseleccionados
								var idp = 'nodoP' + objSeleccionados[i][0];
								if (idp == idpropiedad) {
										if (objSeleccionados[i][1].length > 0) {
												for (var j = 0; j < objSeleccionados[i][1].length; j++) {
														var idtemp = 'nodeV' + objSeleccionados[i][1][j];
														if (objSeleccionadosVista[i][1][j] != undefined) {
																var nodeaux = [{
																		text: objSeleccionadosVista[i][1][j], id: idtemp, expanded: false, leaf: true
																}];
																node.appendChild(nodeaux);
														}
												}
										}
								}
						}
						node.expand();
				} else {
						node.remove();
				}
		}

		function actualizarPadreByidpropiedad(nodoPadre)
		{
				var cont = nodoPadre.childNodes.length;
				for (var k = cont - 1; k >= 0; k--) {  //Borro los hijos que tenia el nodo anteriormente
						nodoPadre.removeChild(nodoPadre.childNodes[k])
				}
				nodoPadre.appendChild(damehijos());
				nodoPadre.expand();
		}

		function actualizarpanelconformacion()
		{
				if (objSeleccionados[0] == '') {
						if (treeConformacion) {
								paneltree.remove(treeConformacion);
								paneltree.doLayout();
						}
						if (!paneltree.collapsed) {
								mostrarMensaje(1, "No se ha seleccionado ningún valor para la configuración.");
						}
				} else {
						if (!treeConformacion && !paneltree.collapsed) { //Creo arbol si el panel esta abierto y no está creado
								paneltree.add(construirtreeconfiguracion());
								paneltree.doLayout();
								treeConformacion.expandAll();
						} else {
								if (!paneltree.collapsed) { //Actualizo los nodos si el panel está abierto.
										var id = tabs.getActiveTab().id; //identificador del tab activo
										id = 'nodoP' + id.slice(3, id.length);  //identficador del nodo que coincide con ese tab
										var node = treeConformacion.getNodeById(id);
										if (node != undefined) {
												actualizarNodeByIdPropiedad(id, node);
										} else {
												actualizarPadreByidpropiedad(treeConformacion.root.childNodes[0]);
										}
								}
						}
				}
		}

		function habilitarbotones()
		{
				var bool = false;
				if (objSeleccionados[0] == "") {
						if (!paneltree.collapsed) {
								paneltree.collapse();
						}
						bool = true;
				}
				if (windows == 'adicionar') {
						Ext.getCmp('btnAceptar').setDisabled(bool);
						Ext.getCmp('btnAplicar').setDisabled(bool);
				}
				//				else {
				//						console.debug("bool",bool)
				//						Ext.getCmp('btnAceptar').setDisabled(bool);
				//				}
		}

		function eliminarpropiedadvalor(concepto, propiedad, valor, denpropiedad, denvalor)
		{
				for (var j = 1; j < objSeleccionados.length; j++) {
						if (objSeleccionados[j][0] == propiedad) {
								if (j == 0) {
										j = 1;
								} //Para cuando hay solo 1 propiedad
								var pospropiedad = j;
								var vacio = elimnarvalor(valor, pospropiedad, denvalor);
								if (vacio) {
										objSeleccionados.splice(pospropiedad, 1);//Si no quedan valores elimino la propiedad
										objSeleccionadosVista.splice(pospropiedad, 1);
										if (objSeleccionados[1] == undefined) //Si no quedan propiedades elimino el concepto
										{
												objSeleccionados = ['', ['', []]];
												objSeleccionadosVista = ['', ['', []]];
										}
								}
								break;
						}
				}
		}

		function elimnarvalor(valor, pospropiedad, denvalor)
		{
				objSeleccionados[pospropiedad][1].remove(valor);
				objSeleccionadosVista[pospropiedad][1].remove(denvalor);
				if (objSeleccionados[pospropiedad][1].length == 0) {
						return true;
				}
				return false;
		}

		function marcarseleccionados(rcs, vals)
		{
				for (var k = 0; k < rcs.length; k++) {
						for (var j = 0; j < vals.length; j++) {
								if (vals[j] == rcs[k].id) {
										smPropiedades.selectRecords([rcs[k]], true);
								}
						}
				}
		}

		function guardarpropiedad(propiedad, valor, denpropiedad, denvalor)
		{
				var flagpropiedad = true;
				var arraypropiedades = objSeleccionados[1][0];
				var j = 1;
				for (j; j < objSeleccionados.length; j++) {
						if (objSeleccionados[j][0] == propiedad) {
								flagpropiedad = false;
								guardarvalor(propiedad, valor, denvalor);
								break;
						}
				}
				if (flagpropiedad) {
						var pos = objSeleccionados.length;
						var nuevo = [propiedad, []];
						var dennuevo = [denpropiedad, []];
						objSeleccionados.push(nuevo);
						objSeleccionadosVista.push(dennuevo);
						guardarvalor(propiedad, valor, denvalor);
				}
		}

		function guardarvalor(propiedad, valor, denvalor)
		{
				var flagvalores = true;
				for (var k = 1; k < objSeleccionados.length; k++) {
						if (objSeleccionados[k][0] == propiedad) {
								var arrayvalores = objSeleccionados[k][1];
								for (var i = 0; i < arrayvalores.length; i++) {
										if (arrayvalores[i] == valor) {
												flagvalores = false;
												break;
										}
								}
								if (flagvalores) {
										objSeleccionados[k][1].push(valor);
										objSeleccionadosVista[k][1].push(denvalor);
								}
								break;
						}
				}
		}

		function actualizarinterfazmodificar()
		{
				pGestion.stopMonitoring();
				denconfiguracion.setValue(recordConfig.data.denominacion)
				validarDen = recordConfig.data.denominacion;
				descripcion.setValue(recordConfig.data.descripcion)
				validarDes = recordConfig.data.descripcion;
				Ext.getCmp('btnAplicar').setVisible(false);
				//				Ext.getCmp('btnAceptar').setDisabled(false);
				winAddValores.setTitle(etiquetas.tittlewinMod);
		}

		function actualizarArrayVista(configuracion)
		{
				Ext.Ajax.request({
						url        : 'actualizarArrayVista', method: 'POST', params: {
								configuracion: configuracion//Ext.encode(objSeleccionados)
						}, callback: function (options, success, response)
						{
								responseData = Ext.decode(response.responseText);
								validaVal = responseData['identificadores'];
								var data = Ext.decode(response.responseText);
								if (!data['vacio']) {
										objSeleccionadosVista = data['denominaciones'];
										objSeleccionados = data['identificadores'];
										var iguales = data['iguales'];
										if (windows == 'modificar' && objSeleccionadosVista != undefined) {
												paneltree.expand();
										}
										if (!iguales) {
												mostrarMensaje(1, 'En el sistema se han borrado datos que existían en la configuración.')
										}
								} else {
										mostrarMensaje(1, 'En el sistema se han borrado todos los datos que existían en la configuración.')
								}
						}
				});
		}

		function enviarValores()
		{
				var url = 'guardarConfiguracion';
				if (windows == 'modificar') {
						url = 'modificarConfiguracion';
				}
				var ok = false;
				var arrayvalores = Ext.encode(objSeleccionados);
				Secodena.mostrarMascara('cargaini', '', 'Guardando configuraci&oacute;n...');
				Ext.Ajax.request({
						url        : url, method: 'POST', params: {
								configuracion: arrayvalores,
								denominacion : denconfiguracion.getValue(),
								descripcion  : descripcion.getValue(),
								idgrafica    : recordConfig.data != undefined ? recordConfig.data.idgrafica : false
						}, callback: function (options, success, response)
						{
								responseData = Ext.decode(response.responseText);
								var codMsg = (responseData.codMsg == 4) ? 6 : responseData.codMsg;
								var msg = responseData.mensaje;
								//								mostrarMensaje(codMsg, msg);
								if (url == "guardarConfiguracion") {
										if (codMsg != 6) {
												mostrarMensaje(codMsg,msg);
												Go.Util.limpiarForm(pGestion);
										}
								}
								Secodena.ocultarMascara('cargaini');
								if (codMsg == 1) {
										mostrarMensaje(codMsg,msg);
										if (cerrar) {
												winAddValores.destroy();
										}
										mithis.oldDescripcion = '';
										stConfiguracion.load({params: {start: 0, limit: 15}});
								}
						}
				})
		}
}
