Utilidades.Cmp.cmpGestionDocumentos = function(opciones) {
		var _this = this;
		_this.idioma = perfil.etiquetas;

		_this.seleccion = opciones.seleccion;
		_this.idelemento = opciones.idelemento;
		_this.aprobada = opciones.aprobada;
		_this.tipoelemento = opciones.tipoelemento;

		_this.BarraProgreso = new BarraEstado();

		this.mostarVentana = function() {

				_this.startTipoDocs = 0;
				_this.storeTipoDocs = new Ext.data.Store({
						url: '/planificacion/pdo/plan/index.php/cmpgestordocumental/cargarTipoDocumentos',
						autoLoad:true,
						reader: new Ext.data.JsonReader({
								root: 'data',
								totalProperty: 'total',
								id:'iddocumentos'
						}, [{
								name: 'iddocumentos'
						}, {
								name: 'denominacion'
						}
						]),
						listeners: {
								beforeload: function(st, n) {
										st.baseParams.start      = _this.startTipoDocs;
								}
						}
				});

				this.storeDocumentos = new Ext.data.Store({
						url: '/planificacion/pdo/plan/index.php/cmpgestordocumental/cargarDocumentos',
						autoLoad:true,
						reader: new Ext.data.JsonReader({
								root: "data",
								id: "iddocespaciotrabajo"
						}, [{
								name: 'iddocespaciotrabajo'
						}, {
								name: 'iddocumentogestor'
						}, {
								name: 'idproceso'
						}, {
								name: 'descripcion'
						}, {
								name: 'nombrearchivo'
						}]),
						listeners: {
								beforeload: function(st, n) {
										st.baseParams.idelemento   = _this.idelemento;
										st.baseParams.iddocumentos = (_this.sm_TipoDocs.getSelections().length == 0)?-1:
										_this.gridTipoDocs.getSelectionModel().getSelected().data.iddocumentos;
								}
						}
				});

				_this.sm_TipoDocs = new Ext.grid.RowSelectionModel({
						singleSelect: false,
						listeners:{
								selectionchange:function (sm) {
										var arrayrecords = _this.sm_TipoDocs.getSelections();
										var totalrecords = arrayrecords.length;
										if(totalrecords==1){
												_this.storeDocumentos.reload();
										}else{
												_this.storeDocumentos.removeAll();
										}
								}
						}
				});

				_this.sm_Documentos = new Ext.grid.RowSelectionModel({
						singleSelect: false,
						listeners:{
								selectionchange:function (sm) {
										var arrayrecords = _this.sm_Documentos.getSelections();
										var totalrecords = arrayrecords.length;
										if(totalrecords == 1){
												_this.btnEliminar.enable();
												_this.btnAbrir.enable();
												_this.btnVer.enable();
										}
										else{
												_this.btnEliminar.disable();
												_this.btnAbrir.disable();
												_this.btnVer.disable();
										}
								}
						}
				});



				_this.columns_TipoDocs = new Ext.grid.ColumnModel([
						new Ext.grid.RowNumberer(),
						{header: 'iddocumentos', dataIndex: 'iddocumentos', hidden: true},
						{header: 'Denominaci&oacute;n', tooltip: 'Denominaci&oacute;n', width: 160, sortable: true,
								id: 'expandir', dataIndex: 'denominacion',renderer: crearToolTip}
				]);

				_this.columns_Documentos = new Ext.grid.ColumnModel([
						new Ext.grid.RowNumberer(),
						{header: 'iddocespaciotrabajo', dataIndex: 'iddocespaciotrabajo', hidden: true},
						{header: 'Nombre del documento', tooltip: 'Nombre del documento', sortable: true,
								id: 'expandir', dataIndex: 'nombrearchivo', renderer: crearToolTip}
				]);


				_this.filtrosTipoDocs = new Ext.grid.GridFilters({
						filters: [
								{
										type: 'string',
										dataIndex: 'denominacion'
								}
						]
				});

				_this.filtrosDocumentos = new Ext.grid.GridFilters({
						filters: [
								{
										type: 'string',
										dataIndex: 'nombrearchivo'
								}
						]
				});

				_this.btnLimpiarTipoDocs = new Ext.Button({
						tooltip: _this.idioma.btnLimpiar,
						iconCls: 'limpiar',
						handler:function () {
								_this.filtrosTipoDocs.clearFilters();
								_this.storeTipoDocs.reload();
						}
				});

				// _this.btnLimpiarDocumentos = new Ext.Button({
				// 		text: _this.idioma.btnLimpiar,
				// 		tooltip: _this.idioma.btnLimpiar,
				// 		iconCls: 'limpiar',
				// 		handler:function () {
				// 				_this.filtrosDocumentos.clearFilters();
				// 				_this.storeDocumentos.reload();
				// 		}
				// });

				_this.gridTipoDocs = new Ext.grid.GridPanel({
						frame: true,
						title: 'Tipo de documentos',
						border: false,
						region: 'center',
						autoScroll: true,
						height: 265,
						width: 350,
						autoExpandColumn: 'expandir',
						plugins: _this.filtrosTipoDocs,
						loadMask: {
								store: _this.storeTipoDocs
						},
						store: _this.storeTipoDocs,
						sm: _this.sm_TipoDocs,
						cm: _this.columns_TipoDocs,
						tbar: [/*_this.btn_gest_docs, _this.btn_gest_para*/],
						bbar: new Ext.PagingToolbar({
								pageSize: 2,
								store: _this.storeTipoDocs,
								displayInfo: true,
								items: ['-', _this.btnLimpiarTipoDocs],
								listeners: {
										beforechange: function (p, e) {
												_this.startTipoDocs = e.start;
										}
								}
						})
				});

				_this.gridDocumentos = new Ext.grid.EditorGridPanel({
						store: _this.storeDocumentos,
						sm: _this.sm_Documentos,
						autoScroll: true,
						autoWidth: true,
						frame: true,
						editable: true,
						autoExpandColumn: 'expandir',
						loadMask: {
								store: _this.storeDocumentos
						},
						cm: _this.columns_Documentos,
						tbar: []
				});

				_this.btnAdicionar = new Ext.Button({
						tooltip: "Adicionar documento",
						iconCls: 'adicionar',
						disabled: false,
						handler: function () {
								_this.winAdiconarDocumento();
						}
				});

				_this.btnEliminar = new Ext.Button({
						tooltip: "Eliminar documento",
						iconCls: 'eliminar',
						disabled: true,
						handler: function () {
								_this.EliminarDocumento();
						}
				});

				_this.btnAbrir = new Ext.Button({
						tooltip: "Abrir documento",
						iconCls: 'abrir',
						disabled: true,
						handler: function () {
								_this.Descargardocumento();
						}
				});

				_this.btnVer = new Ext.Button({
						tooltip: "Ver descripción",
						iconCls: 'ver',
						disabled: true,
						handler: function () {
								_this.winVerDescripcion();
						}
				});

				_this.panelDocumentos = new Ext.Panel({
						height: 200,
						width: 450,
						frame: true,
						border: false,
						layout: 'fit',
						region: 'east',
						items: [_this.gridDocumentos]
				});

				_this.panelGeneral = new Ext.Panel({
						height: '100%',
						region: 'center',
						layout: 'border',
						tbar:(_this.aprobada)?[_this.btnAbrir, '-', _this.btnVer]:
								       [_this.btnAdicionar, '-' , _this.btnEliminar, '-', _this.btnAbrir, '-', _this.btnVer],
						frame: true,
						items: [_this.gridTipoDocs, _this.panelDocumentos]

				});

				_this.btnCerrar = new Ext.Button({
						handler: function () {
								_this.windowDocumentos.destroy();
						},
						text: 'Cerrar',
						iconCls: 'cerrar',
						tooltip: 'Cerrar ventana'
				});

				_this.windowDocumentos = new Ext.Window({
						title: 'Gestión de documentos',
						modal: true,
						closeAction: 'destroy',
						resizable:false,
						constrain: true,
						layout: 'fit',
						maximized: false,
						autoValidate: true,
						validateDefault: true,
						width: 930,
						height: 520,
						buttons: [_this.btnCerrar],
						items: [_this.panelGeneral],
						listeners: {
								close: function () {

								},
								destroy: function () {

								},
								beforeshow: function () {

								}
						}
				});
				_this.windowDocumentos.show();

		}

		_this.winAdiconarDocumento = function () {

				_this.btnCancelarAdd = new Ext.Button({
						iconCls: 'cancelar',
						id: 'btnCancelarAdd',
						tooltip: 'Cancelar',
						text: 'Cancelar',
						handler: function () {
								_this.windowAddDcoumentos.destroy();
						}
				});

				_this.btnAceptarAdd = new Ext.Button({
						// icon: perfil.dirImg + 'aceptar.png',
						iconCls: 'aceptar',
						disabled: true,
						text: 'Aceptar',
						tooltip: perfil.etiquetas.lbTtAceptarAdd,
						handler: function () {
								var tipoDocsSeleccionado = _this.cbTipodocumento.getValue();
								if (_this.formAdd.getForm().isValid()) {
										_this.BarraProgreso.show('Guardando documento');
										//if (Ext.getCmp('form-file').getValue() != '') {
										_this.formAdd.getForm().submit(
												{
														url: '/planificacion/pdo/plan/index.php/cmpgestordocumental/adicionarDocumento',
														timeout: 1800000, //milisegundos = 30 min
														method: 'POST',
														params: {
																idproceso: _this.idelemento,
																tipoproceso: "Actividades",
																idtipodocumento: _this.cbTipodocumento.getValue(),
																descripcion:_this.descripcion.getValue()
														},
														failure: function (form, action) {
																_this.BarraProgreso.hide();
																if (action.result.cod == 1) {
																		_this.sm_TipoDocs.clearSelections();
																		var record = _this.storeTipoDocs.getById(tipoDocsSeleccionado);
																		var index = _this.storeTipoDocs.indexOf(record);
																		_this.sm_TipoDocs.selectRow(index);
																		_this.windowAddDcoumentos.destroy();
																		mostrarMensaje(1, "El documento ha sido guardado satisfactoriamente");
																}else if(action.result.cod == 2){
																		mostrarMensaje(3, "No existe conexión con el gestor documental");
																}else if(action.result.cod == 3){
																		mostrarMensaje(3, "Error creando el espacio en el gestor documental");
																}
																else {
																		mostrarMensaje(3, 'Ha ocurrido un problema al guardado el documento');
																}

														}
												}
										);
										//}
								} else {
										mostrarMensaje(2, 'Problemas en el formulario')
								}
						}
				});

				_this.stTipodocumento = new Ext.data.Store({
						url: '/planificacion/pdo/plan/index.php/cmpgestordocumental/cargarTipoDocumentos',
						autoLoad:true,
						listeners: {
								beforeload: function (st, n) {
								},
								load: function (t) {
								}
						},
						reader: new Ext.data.JsonReader({
										root: "data",
										id: "iddocumentos"
								}, [{
										name: 'iddocumentos'
								}, {
										name: 'denominacion'
								}]
						)
				});

				_this.cbTipodocumento = new Ext.form.ComboBox({
						emptyText: 'Seleccione',
						width: 100,
						disabled: false,
						store: _this.stTipodocumento,
						fieldLabel: 'Tipo de documento',
						displayField: 'denominacion',
						valueField: 'iddocumentos',
						typeAhead: true,
						mode: 'local',
						forceSelection: true,
						triggerAction: 'all',
						anchor: '95%',
						loadingText: 'Cargando...',
						allowBlank: true,
						listeners: {
								select: function (cb, rec, num) {
								}
						}
				});

				_this.descripcion = new Ext.form.TextArea({
						anchor: '100%',
						fieldLabel: 'Descripci&oacute;n',
						height: '40%',
						allowBlank:false,
						maxLengthText: 'El tamaño máximo requerido es de 500 caracteres.'
				});

				_this.formAdd = new Ext.FormPanel({
						frame: true,
						fileUpload: true,
						defaults: {labelAlign: 'top'},
						items: [{
								layout: 'column',
								items: [{
										columnWidth: 1,
										layout: 'form',
										items: _this.cbTipodocumento
								},{
										columnWidth: 1,
										layout: 'form',
										items: [{
												xtype: 'fileuploadfield',
												fieldLabel: 'Cargar documento',
												emptyText: 'Seleccione',
												name: 'file',
												anchor: '100%',
												width: 200,
												buttonCfg: {
														text: '...',
														iconCls: 'buscar',
														icon: perfil.dirImg + 'server.png',
												},
												allowBlank: false
										}]
								},{
										columnWidth: 1,
										layout: 'form',
										items: [_this.descripcion]
								}]
						}]
				});

				_this.windowAddDcoumentos = new Ext.Window({
						title: 'Adicionar documento',
						width: 425,
						constrain: true,
						layout: 'fit',
						closeAction: 'destroy',
						height: 300,
						resizable: false,
						frame: true,
						modal: true,
						buttons: [_this.btnCancelarAdd, _this.btnAceptarAdd],
						items: [_this.formAdd],
						listeners: {
								beforeshow: function () {
								}
						}
				});

				_this.windowAddDcoumentos.show();
		}

		_this.EliminarDocumento = function () {
				var mensaje = "¿Est&aacute; seguro que desea eliminar el documento seleccionado?";
				mostrarMensaje(2, mensaje, function (btnoprimido) {
						if (btnoprimido == 'ok') {
								_this.BarraProgreso.show('Eliminando documento');
								Ext.Ajax.request({
										url: '/planificacion/pdo/plan/index.php/cmpgestordocumental/eliminarDocumento',
										params: {
												iddocespaciotrabajo: _this.sm_Documentos.getSelected().data.iddocespaciotrabajo,
												iddocumentogestor: _this.sm_Documentos.getSelected().data.iddocumentogestor
										},
										callback: function (options, success, response) {
												responseData = Ext.decode(response.responseText);
												_this.BarraProgreso.hide();
												if (responseData.codMsgA == 1) {
														var tipoDocsSeleccionado = _this.sm_TipoDocs.getSelected().data.iddocumentos;
														_this.sm_TipoDocs.clearSelections();
														var record = _this.storeTipoDocs.getById(tipoDocsSeleccionado);
														var index = _this.storeTipoDocs.indexOf(record);
														_this.sm_TipoDocs.selectRow(index);
														mostrarMensaje(1, 'El archivo seleccionado fue eliminado correctamente.');
												} else {
														mostrarMensaje(1, responseData.codMsgA);
												}
										}
								});
						}
				});
		}

		_this.Descargardocumento = function () {
				window.open('/planificacion/pdo/plan/index.php/cmpgestordocumental/descargarDocumento?iddocumentogestor=' + _this.sm_Documentos.getSelected().data.iddocumentogestor);
		}

		_this.winVerDescripcion = function () {

				_this.btnCancelarVerDescripcion = new Ext.Button({
						iconCls: 'cancelar',
						tooltip: 'Cerrar',
						text: 'Cerrar',
						handler: function () {
								_this.windowVerDescripcion.destroy();
						}
				});

				_this.descripcionVerDescripcion = new Ext.form.TextArea({
						anchor: '100%',
						fieldLabel: 'Descripci&oacute;n',
						height: '70%',
						allowBlank:false,
						maxLengthText: 'El tamaño máximo requerido es de 500 caracteres.',
						value:_this.sm_Documentos.getSelected().data.descripcion
				});

				_this.formVerDescripcion = new Ext.FormPanel({
						frame: true,
						fileUpload: true,
						defaults: {labelAlign: 'top'},
						items: [{
										columnWidth: 1,
										layout: 'form',
										items: [_this.descripcionVerDescripcion]
								}]

				});

				_this.windowVerDescripcion = new Ext.Window({
						title: 'Ver Descripci&oacute;n',
						width: 425,
						constrain: true,
						layout: 'fit',
						closeAction: 'destroy',
						height: 200,
						resizable: false,
						frame: true,
						modal: true,
						buttons: [_this.btnCancelarVerDescripcion],
						items: [_this.formVerDescripcion],
						listeners: {
								beforeshow: function () {
								}
						}
				});

				_this.windowVerDescripcion.show();
		}

		function crearToolTip(v, m) {
				m.attr = 'ext:qtip="<strong>' + v + '</strong>"';
				return v;
		}

		function ultimo(v, m) {
				if (v == 1) {
						m.attr = 'ext:qtip="Último documento"';
						return '<span><img src=' + perfil.dirImg + 'rector.png' + '>';
				}else{
						m.attr = 'ext:qtip="No es el último documento"';
						return '<span><img src=' + perfil.dirImg + 'no.png' + '>';
				}

		}
}