/*
 * Componente Implicados.
 *
 * @author Ing.Yaricel Guerra Velázquez
 * @package Pvd.SST
 * @uses Pvd.SST.Gestionaraccidentes
 * @copyright XETID
 * @version 1.0
 */
Ext.ns('Pvd.SST.Gestionaraccidentes');
Pvd.SST.Gestionaraccidentes.PanelImplicados = Ext.extend(Ext.Panel, {
	layout: 'border',
	border: false,
	id: 'PanelImplicados',
	title: 'Implicados',
	region: 'center',
	height: 500,
	initComponent: function() {
		var self = this;
		var objselect;
		var accion;
		var accionsubsidio;

		this.stImplicados =new Ext.data.Store({
			url: 'getImplicados',
			reader: new Ext.data.JsonReader(
				{root: "datos", id: "idaccidenteimplicado", totalProperty: "cantidad"},
				[
					{name:'idaccidenteimplicado'},
					{name:'idpersona'},
					{name:'numid'},
					{name:'nombreyapellidos'},
					{name:'cargo'},
					{name:'idcargo'},
					{name:'area'},
					{name:'idarea'},
					{name:'identidad'},
					{name:'entidad_area'},
					{name:'lesiones'},
					{name:'idtipoinvalidez'},
					{name:'tipoinvalidez'},
					{name:'tareahabitual'},
					{name:'ffallecimiento'},
					{name:'descfallecido'}
				]
			),
			listeners: {
				load: function(st, data) {
					self.btnEliminar.disable();
					self.btnFallecimiento.disable();
					self.btnVer.disable();
					self.btnAdicionarL.disable();
					if (data.length == 0) {
						if (self.sfBuscar.getValue() == '') {
							mostrarMensaje(1, "No existen datos que mostrar.");
						} else {
							mostrarMensaje(1, "No existen datos que se correspondan con el criterio de búsqueda especificado.");
						}
					}
				},
				remove: function() {
					self.btnEliminar.disable();
					self.btnVer.disable();
					self.btnFallecimiento.disable();
				}
			}
		});

		this.sfBuscar = new Ext.app.SearchField({
			store: self.stImplicados,
			emptyText: 'Criterio de búsqueda',
			toolTipTrigger1: self.idioma.lbBtnLimpiar,
			toolTipTrigger2: self.idioma.lbBtnBuscarimp
		});

		this.smselect = new Ext.grid.CheckboxSelectionModel({singleSelect: false});

		this.stTipoInvalidez = new Ext.data.Store({
			url: 'getTiposInvalidez',
			reader: new Ext.data.JsonReader(
				{root: "", id: "idtipoinvalidez"},
				[
					{name:'idtipoinvalidez'},
					{name:'tipoinvalidez'}]
			)
		});

		this.stTipoInvalidez.load();

		this.cbTipoInvalidez = new Ext.form.ComboBox({
			store: self.stTipoInvalidez,
			anchor: '100%',
			height: 100,
			name:'idtipoinvalidez',
			hiddenName:'idtipoinvalidez',
			displayField: 'tipoinvalidez',
			valueField: 'idtipoinvalidez',
			typeAhead: true,
			allowBlank: false,
			mode: 'local',
			triggerAction: 'all',
			selectOnFocus: true,
			readOnly: true,
			listeners: {
				select: function(combo) {
					Ext.Ajax.request({
						url: 'updateImplicado',
						params: {
							idaccidenteimplicado: objselect.idaccidenteimplicado,
							idtipoinvalidez: combo.getValue()
						},
						success: function (r){
							var responseData = Ext.decode(r.responseText);
							self.stImplicados.reload();
						}
					});
				}
			}
		});

		this.chbTareaHabitual = new Ext.form.Checkbox({
			name: 'tareahabitual',
			anchor: '100%',
			listeners: {
				check: function(ck, vn) {
					Ext.Ajax.request({
						url: 'updateImplicado',
						params: {
							idaccidenteimplicado: objselect.idaccidenteimplicado,
							tareahabitual: (vn == true) ? 1 : 0
						},
						success: function (r){
							var responseData = Ext.decode(r.responseText);
						}
					});
				}
			}
		});

		this.btnAdicionar = new Ext.Button({
			id: 'btnAdicionarImp',
			text: self.idioma.BtnAdicionar,
			disabled: true,
			hidden: true,
			tooltip: self.idioma.lbBtnAdicionarI,
			iconCls: 'adicionar',
			handler: function() {
				self.windAdd.show();
			}
		});

		this.btnEliminar = new Ext.Button({
			id: 'btnEliminar',
			text: self.idioma.BtnEliminar,
			disabled: true,
			hidden: true,
			tooltip: self.idioma.lbBtnEliminarI,
			iconCls: 'eliminar',
			handler: function() {
				eliminar();
			}
		});

		this.btnFallecimiento = new Ext.Button({
			id: 'btnFallecimiento',
			text: 'Fallecimiento',
			disabled: true,
			hidden: true,
			tooltip: 'Fallecimiento del implicado',
			iconCls: 'falta',
			handler: function() {
				self.winGestFall.show();
				self.formularioFall.getForm().reset();
				self.dfFfallecimiento.setMinValue(self.accidente.fecha);
				self.dfFfallecimiento.setRawValue(objselect.ffallecimiento);
				self.tadescripcionFall.setValue(objselect.descfallecido);
			}
		});

		this.btnVer = new Ext.Button({
			text: self.idioma.lbBtnVer,
			tooltip: 'Ver datos del implicado',
			iconCls: 'ver',
			handler: function(){
				var params;
				params = Ext.urlEncode({
					idaccidenteimplicado: objselect.idaccidenteimplicado
				});
				var idIframe = Ext.id();
				new Ext.Window({
					title: 'Datos del implicado',
					width: 700,
					height: 500,
					id: 'winimp',
					maskDisabled: false,
					animCollapse: false,
					maximizable: true,
					constrain: true,
					border: false,
					modal: true,
					items: {
						xtype: 'component',
						autoEl: {
							tag: 'iframe',
							id: idIframe,
							style: 'height: 100%; width: 100%; border: none',
							src: document.location.protocol + '//' + document.location.host + '/pvd/sst/accidente/index.php/gestionaraccidentes/generarFicha?' + params
						}
					}
				}).show();

				PVD.mostrarMascara('rep01', 'Por favor espere...', 'Generando datos del implicado.');
				document.getElementById(idIframe).onload = function () {
					PVD.ocultarMascara('rep01');
				};
			}
		});

		this.expanderfall = new Ext.grid.RowExpander({
			tpl: new Ext.Template('<p><b>Fecha de fallecimiento:</b>{ffallecimiento}</p><p><b>Descripci&oacute;n:</b>{descfallecido}</p>')
		});

		function colorEstado(val, metaData, record) {
			if(val != null && record.data.ffallecimiento) {
				metaData.attr = 'ext:qtip="Fallecido (' + record.data.ffallecimiento + ' )"';
				return '<span style="color:#d11608;"><b>' + val + '</b></span>';
			} else {
				return val;
			}
		}

		this.gpImplicados = new Ext.grid.EditorGridPanel({
			tbar: [this.btnAdicionar, this.btnEliminar, this.btnFallecimiento, this.btnVer, '-', 'Buscar implicado: ', this.sfBuscar],
			region: 'west',
			clicksToEdit: 1,
			plugins: this.expanderfall,
			width: '55%',
			border: false,
			store: self.stImplicados,
			loadMask: {msg: 'Cargando...'},
			sm: this.smselect,
			columns: [
				{header: 'No. de identidad', width: 90, dataIndex: 'numid', align: 'left', renderer: colorEstado},
				{header: 'Apellidos y nombres', width: 180, dataIndex: 'nombreyapellidos', align: 'left', renderer: colorEstado},
				{header: 'Cargo', width: 250, dataIndex: 'cargo', align: 'left', renderer: colorEstado},
				{header: 'Tipo de invalidez', width: 100, dataIndex: 'tipoinvalidez', align: 'left', editor: this.cbTipoInvalidez, renderer: colorEstado},
				{header: 'Realizaba tarea habitual', width: 130, dataIndex: 'tareahabitual', renderer: renderTareaHabitual, editor: this.chbTareaHabitual}
				],
			bbar: new Ext.PagingToolbar({pageSize: 15, store: self.stImplicados, displayInfo: true})
		});

		function renderTareaHabitual (valor, metaData, record) {
			var val = (valor == true)? 'Si': 'No';
			if(val != null && record.data.ffallecimiento) {
				metaData.attr = 'ext:qtip="Fallecido (' + record.data.ffallecimiento + ' )"';
				return '<span style="color:#d11608;"><b>' + val + '</b></span>';
			} else {
				return val;
			}
		}

		self.gpImplicados.getSelectionModel().on('rowselect', function (s) {
			self.btnFallecimiento.enable();
			self.btnEliminar.enable();
			self.btnVer.enable();
			self.btnAdicionarL.enable();
			//self.btnAdicionarS.enable();
			if (self.gpImplicados.getSelectionModel().getSelections().length == 1) {
				objselect = self.gpImplicados.getSelectionModel().getSelected().data;
				self.stLesiones.baseParams.idaccidenteimplicado = objselect.idaccidenteimplicado;
                self.stLesiones.load({params: {start: 0, limit: 15}});
				//self.stSubsidios.baseParams.idaccidenteimplicado = objselect.idaccidenteimplicado;
				/*self.tabPanel.enable();
				if (self.tabPanel.getActiveTab().id == 'Lesiones') {
					self.stLesiones.load({params: {start: 0, limit: 15}});
				}
				if (self.tabPanel.getActiveTab().id == 'Subsidios'){
					self.stSubsidios.load({params: {start: 0, limit: 15}});
				}*/
			} else {
				if (self.gpImplicados.getSelectionModel().getSelections().length == 0) {
					objselect = null;
				}
				//self.tabPanel.disable();
				self.stLesiones.removeAll();
				//self.stSubsidios.removeAll();
			}
		});

		self.gpImplicados.getSelectionModel().on('rowdeselect', function () {
			if (self.gpImplicados.getSelectionModel().getSelections().length == 0) {
				self.btnEliminar.disable();
				self.btnVer.disable();
				self.btnFallecimiento.disable();
				//self.tabPanel.disable();
				self.stLesiones.removeAll();
				//self.stSubsidios.removeAll();
			}
			if (self.gpImplicados.getSelectionModel().getSelections().length == 1) {
				objselect = self.gpImplicados.getSelectionModel().getSelected().data;
				self.stLesiones.baseParams.idaccidenteimplicado = objselect.idaccidenteimplicado;
                self.stLesiones.load({params: {start: 0, limit: 15}});
				//self.stSubsidios.baseParams.idaccidenteimplicado = objselect.idaccidenteimplicado;
				/*self.tabPanel.enable();
				if (self.tabPanel.getActiveTab().id == 'Lesiones') {
					self.stLesiones.load({params: {start: 0, limit: 15}});
				}
				if (self.tabPanel.getActiveTab().id == 'Subsidios') {
					self.stSubsidios.load({params: {start: 0, limit: 15}});
				}*/
			}
		});

		self.stImplicados.on('load', function () {
			//self.tabPanel.disable();
			self.stLesiones.removeAll();
			//self.stSubsidios.removeAll();
		});

		this.stLesiones = new Ext.data.Store({
			url: 'getLesiones',
			reader: new Ext.data.JsonReader(
				{root: "", id: "idpartecuerpo"},
				[
					{name:'idpartecuerpo'},
					{name:'partecuerpo'},
					{name:'idnaturalezalesion'},
					{name:'naturalezalesion'},
					{name:'descripcion'},
					{name:'idimplicadopartecuerpo'}
				]
			),
			listeners: {
				load: function(st, data) {
					self.btnEliminarL.disable();
					self.btnModificarL.disable();
					if (data.length == 0) {
						if (self.sfBuscar.getValue() == '') {
							mostrarMensaje(1, "No existen datos que mostrar.");
						}
					}
				},
				remove: function() {
					if (objselect == null) {
						self.btnAdicionarL.disable();
					}
				}
			}
		});

		this.expander = new Ext.grid.RowExpander({tpl: new Ext.Template('<p><b>Descripci&oacute;n:</b> {descripcion}</p><br>')});

		this.btnAdicionarL = new Ext.Button({
			text: this.idioma.BtnAdicionar,
			disabled: true,
			tooltip: this.idioma.lbBtnAdicionarLes,
			iconCls: 'adicionar',
			handler: function () {
				self.winGestLesion.setTitle('Adicionar lesi&oacute;n o consecuencia');
				self.winGestLesion.show();
				self.btnAplicarLes.show();
				self.formularioGestion.getForm().reset();
				accion = 'add';
			}.createDelegate(this)
		});


		this.btnModificarL = new Ext.Button({
			text: this.idioma.BtnModificar,
			disabled: true,
			tooltip: this.idioma.lbBtnModificarLes,
			iconCls: 'modificar',
			handler: function () {
				self.winGestLesion.setTitle('Modificar lesi&oacute;n o consecuencia');
				self.winGestLesion.show();
				self.btnAplicarLes.hide();
				var objlesion = self.gpLesiones.getSelectionModel().getSelected().data;
				self.cbNaturalezaLesion.setValue(objlesion.idnaturalezalesion);
				self.cbNaturalezaLesion.setRawValue(objlesion.naturalezalesion);
				self.cbParteCuerpo.setValue(objlesion.idpartecuerpo);
				self.cbParteCuerpo.setRawValue(objlesion.partecuerpo);
				self.tadescripcion.setValue(objlesion.descripcion);
				accion = 'mod';
			}.createDelegate(this)
		});

		this.btnEliminarL = new Ext.Button({
			text: this.idioma.BtnEliminar,
			disabled: true,
			tooltip: this.idioma.lbBtnEliminarLes,
			iconCls: 'eliminar',
			handler: function() {eliminarLesion();}.createDelegate(this)
		});

		this.gpLesiones = new Ext.grid.GridPanel({
			title: 'Lesiones',
			id: 'Lesiones',
			store: this.stLesiones,
			tbar: [this.btnAdicionarL, this.btnModificarL, this.btnEliminarL],
			width: '45%',
			height: 400,
			region: 'center',
			plugins: this.expander,
			loadMask:{msg: 'Cargando...'},
			columns: [
				this.expander,
				{header: 'Naturaleza de la lesi&oacute;n', width:150, dataIndex: 'naturalezalesion'},
				{header: 'Parte del cuerpo', width:370, dataIndex: 'partecuerpo'}
				],
			bbar: new Ext.PagingToolbar({
				pageSize: 15,
				store: this.stLesiones,
				displayInfo: true
			})
		});

		self.gpLesiones.getSelectionModel().on('rowselect', function () {
			self.btnEliminarL.enable();
			self.btnModificarL.enable();
		});

		/*this.stSubsidios = new Ext.data.Store({
			url: 'getSubsidios',
			reader: new Ext.data.JsonReader(
				{root: "datos", id: "idimplicadosubsidio", totalProperty: "cantidad"},
				[
					{name: 'idimplicadosubsidio'},
					{name: 'idaccidenteimplicado'},
					{name: 'denominacion'},
					{name: 'importe'},
					{name: 'fregistro'}
				]
			),
			listeners: {
				load: function(st, data) {
					self.btnEliminarS.disable();
					self.btnModificarS.disable();
					if (data.length == 0) {
						mostrarMensaje(1, "No existen subsidios para mostrar.");
					} else {
						var total = 0;
						self.stSubsidios.each(function(rec){
							total += parseInt(rec.data.importe);
						});
						var recordTotal = new Ext.data.Record({
							idimplicadosubsidio: 0,
							idaccidenteimplicado: null,
							denominacion: 'Total',
							fregistro: null,
							importe: total + '.00'
						});
						self.stSubsidios.add(recordTotal);
					}
				}
			}
		});

		this.btnAdicionarS = new Ext.Button({
			text: this.idioma.BtnAdicionar,
			disabled: true,
			tooltip: this.idioma.lbBtnAdicionarSub,
			iconCls: 'adicionar',
			handler: function () {
				self.windSubsidio.setTitle('Adicionar subsidio');
				self.windSubsidio.show();
				self.btnAplicarSub.show();
				self.fSubsidio.getForm().reset();
				accionsubsidio = 'add';
			}.createDelegate(this)
		});

		this.btnModificarS = new Ext.Button({
			text: this.idioma.BtnModificar,
			disabled: true,
			tooltip: this.idioma.lbBtnModificarSub,
			iconCls: 'modificar',
			handler: function () {
				self.windSubsidio.setTitle('Modificar subsidio');
				self.windSubsidio.show();
				self.btnAplicarSub.hide();
				var objsubsidio = self.gpSubsidios.getSelectionModel().getSelected().data;
				self.tfDenomS.setValue(objsubsidio.denominacion);
				self.nfImporteS.setValue(objsubsidio.importe);
				accionsubsidio = 'mod';
			}.createDelegate(this)
		});

		this.btnEliminarS = new Ext.Button({
			text: this.idioma.BtnEliminar,
			disabled: true,
			tooltip: this.idioma.lbBtnEliminarSub,
			iconCls: 'eliminar',
			handler: function () {eliminarSubsidios();}.createDelegate(this)
		});

		this.gpSubsidios = new Ext.grid.GridPanel({
			title: 'Subsidios',
			id: 'Subsidios',
			store: this.stSubsidios,
			tbar: [this.btnAdicionarS, this.btnModificarS, this.btnEliminarS],
			width: '45%',
			height: 400,
			region: 'center',
			loadMask:{msg: 'Cargando...'},
			columns: [
				{header: 'Denominaci&oacute;n', width:300, dataIndex: 'denominacion', renderer: renderTotal},
				{header: 'Importe', width:120, dataIndex: 'importe', align: 'right', renderer: renderTotal}
				],
			bbar: new Ext.PagingToolbar({pageSize: 15, store: this.stSubsidios, displayInfo: true})
		});

		function renderTotal(val, metaData, record) {
			if(val != null && record.data.idimplicadosubsidio == 0) {
				metaData.attr = "style='background-color: #C8C8C8';";
				return '<span><b>' + val + '</b></span>';
			} else {
				return val;
			}
		}

		self.gpSubsidios.getSelectionModel().on('rowselect', function () {
			if (self.gpSubsidios.getSelectionModel().getSelected().data.idimplicadosubsidio == 0) {
				self.btnEliminarS.disable();
				self.btnModificarS.disable();
			} else {
				self.btnEliminarS.enable();
				self.btnModificarS.enable();
			}
		});*/

		/*this.tabPanel = new Ext.TabPanel({
			region: 'center',
			margins: '0 0 0 0',
			height: 400,
			defaults: {autoScroll: true},
			activeTab: 0,
			items: [this.gpLesiones, this.gpSubsidios],
			listeners: {activate: function(p) {p.doLayout();}}
		});*/

		/*self.tabPanel.on('tabchange', function() {
			if (self.gpImplicados.getSelectionModel().getSelections().length == 1) {
				if (self.tabPanel.getActiveTab().id == 'Lesiones'){
					self.stLesiones.load({params: {start: 0, limit: 15}});
				}
				if (self.tabPanel.getActiveTab().id == 'Subsidios'){
					self.stSubsidios.load({params: {start: 0, limit: 15}});
				}
			}
		});*/

		this.items = [this.gpImplicados, this.gpLesiones];

		this.tfDenomS = new Ext.form.TextField({
			id: 'tfDenomS',
			fieldLabel: 'Denominaci&oacute;n',
			allowBlank: false,
			hiddenname: 'denominacion',
			name: 'denominacion',
			anchor: '100%',
			maxLength: 250
		});

		this.nfImporteS = new Ext.form.NumberField({
			id: 'nfImporteS',
			fieldLabel: 'Importe',
			allowBlank: false,
			hiddenname: 'importe',
			name: 'importe',
			anchor: '100%',
			maxLength: 10,
			allowNegative: false,
			decimalPrecision: 2
		});

		this.dfFechaSubsidio = new Ext.form.DateField({
			name: 'dfFechaSubsidio',
			fieldLabel: 'Fecha del subsidio',
			hiddenname: 'dfFechaSubsidio',
			anchor: '100%',
			format: 'd/m/Y',
			editable: false,
			allowBlank: true,
			readOnly: true,
			maxValue: '31/12/2100',
			minValue: '01/01/1900'
		});

		this.fSubsidio = new Ext.form.FormPanel({
			frame: true,
			bodyStyle: 'padding: 3px 3px 0',
			border: false,
			autoDestroy: false,
			labelAlign: 'top',
			autoHeight: true,
			items: [{
				layout: 'column',
				border: false,
				items: [
					{columnWidth: 1, layout: 'form', items: [this.tfDenomS]},
					{columnWidth: 0.5, layout: 'form', items: [this.dfFechaSubsidio]},
					{columnWidth: 0.5, layout: 'form', items: [this.nfImporteS]}
				]
			}]
		});

		this.btnAceptSub = new Ext.Button({
			iconCls: 'aceptar',
			text: this.idioma.lbtnAceptar,
			tooltip: this.idioma.textToolTipAceptar,
			handler: function() {guardarSubsidio('ACP');}
		});

		this.btnAplicarSub = new Ext.Button({
			iconCls: 'aplicar',
			tooltip: self.idioma.textToolTipAplicar,
			text: self.idioma.lbtnAplicar,
			handler: function() {guardarSubsidio('APL');}
		});

		this.btnCancelSub = new Ext.Button({
			iconCls: 'cancelar',
			text: this.idioma.lbtnCancelar,
			tooltip: this.idioma.textToolTipCancelar,
			handler: function() {
				self.windSubsidio.hide();
				self.tfDenomS.reset();
				self.nfImporteS.reset();
			}
		});

		this.windSubsidio = new Ext.Window({
			layout: 'fit',
			constrain: true,
			title: 'Adicionar subsidio',
			modal: true,
			closeAction: 'hide',
			resizable: false,
			width: 350,
			height: 185,
			maximizable: false,
			items: [this.fSubsidio],
			buttons: [this.btnCancelSub, this.btnAplicarSub, this.btnAceptSub],
			keys: [{
				key: 'x',
				alt: true,
				stopEvent: true,
				fn: function() {
					if (!self.btnCancelSub.disabled) {
						self.btnCancelSub.handler();
					}
				}
				}, {
				key: 13,
				stopEvent: true,
				fn: function() {
					if (!self.btnAceptSub.disabled) {
						self.btnAceptSub.handler();
					}
				}
				}, {
				key: 'p',
				ctrl: true,
				alt: true,
				stopEvent: true,
				fn: function() {
					if (!self.btnAplicarSub.disabled) {
						self.btnAplicarSub.handler();
					}
				}
			}]
		});

		this.stNaturalezaLesion = new Ext.data.Store({
			url: 'getNaturalezasLesion',
			reader: new Ext.data.JsonReader(
				{root: "", id: "idnaturalezalesion"},
				[{name:'idnaturalezalesion'}, {name:'denominacion'}]
			)
		});

		this.stParteCuerpo = new Ext.data.Store({
			url: 'getPartesCuerpo',
			reader: new Ext.data.JsonReader(
				{root: "", id: "idpartecuerpo"},
				[{name:'idpartecuerpo'}, {name:'denominacion'}]
			)
		});

		this.cbNaturalezaLesion= new Ext.form.ComboBox({
			fieldLabel: 'Naturaleza de la lesi&oacute;n',
			store: self.stNaturalezaLesion,
			anchor: '100%',
			height: 100,
			name:'idnaturalezalesion',
			hiddenName:'idnaturalezalesion',
			displayField: 'denominacion',
			valueField: 'idnaturalezalesion',
			typeAhead: true,
			allowBlank: false,
			mode: 'local',
			triggerAction: 'all',
			selectOnFocus: true,
			readOnly: true
		});

		this.cbParteCuerpo= new Ext.form.ComboBox({
			fieldLabel: 'Parte del cuerpo lesionada',
			store: self.stParteCuerpo,
			anchor: '100%',
			height: 100,
			name:'idpartecuerpo',
			hiddenName:'idpartecuerpo',
			displayField: 'denominacion',
			valueField: 'idpartecuerpo',
			typeAhead: true,
			allowBlank: false,
			mode: 'local',
			triggerAction: 'all',
			selectOnFocus: true,
			readOnly: true
		});

		this.tadescripcion = new Ext.form.TextArea({
			fieldLabel: 'Descripci&oacute;n',
			name: 'descripcion',
			anchor:	'100%',
			height: 100,
			hiddenname: 'descripcion',
			maxLength: 255,
			regex: /^([a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]+ ?[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]*[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]* ?[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ.,;:()_])+$/,
			maskRe: /^([a-z A-Z0-9áéíóúÁÉÍÓÚñÑ])$/,
			allowBlank:	true
		});

		this.formularioGestion = new Ext.FormPanel({
			labelAlign: 'top',
			frame:true,
			bodyStyle:'padding:5px 5px 0',
			items: [{
				layout: 'column',
				items: [
					{columnWidth: 0.5, layout: 'form', items: [this.cbNaturalezaLesion]},
					{columnWidth: 0.5, layout: 'form', items: [this.cbParteCuerpo]},
					{columnWidth:1.0, layout: 'form', items: [this.tadescripcion]}
					]
			}]
		});

		this.btnCancelarLes = new Ext.Button({
			iconCls: 'cancelar',
			tooltip: self.idioma.textToolTipCancelar,
			text: self.idioma.lbtnCancelar,
			handler: function() {self.winGestLesion.hide();}
		});

		this.btnAplicarLes = new Ext.Button({
			iconCls: 'aplicar',
			tooltip: this.idioma.textToolTipAplicar,
			text: this.idioma.lbtnAplicar,
			handler: function () {guardarLesiones('APL');}.createDelegate(this)
		});

		this.btnAceptarLes = new Ext.Button({
			iconCls: 'aceptar',
			tooltip: self.idioma.textToolTipAceptar,
			text: self.idioma.lbtnAceptar,
			handler: function() { guardarLesiones('ACP');}
		});

		this.winGestLesion = new Ext.Window({
			width: 450,
			height: 260,
			constrain:true,
			layout: 'fit',
			closable: true,
			resizable: false,
			closeAction: 'hide',
			items: [this.formularioGestion],
			modal: true,
			buttons: [this.btnCancelarLes, this.btnAplicarLes, this.btnAceptarLes],
			listeners: {
				'beforeshow': function() {
					self.stNaturalezaLesion.load();
					self.stParteCuerpo.load();
				}
				},
			keys: [
				{
					key: 'x',
					alt: true,
					stopEvent: true,
					fn: function () {
						if (!self.btnCancelarLes.disabled) {
							self.btnCancelarLes.handler();
						}
					}
				}, {
					key: 13,
					stopEvent: true,
					fn: function () {
						if (!self.btnAceptarLes.disabled) {
							self.btnAceptarLes.handler();
						}
					}
			}]
		});

		this.dfFfallecimiento = new Ext.form.DateField({
			name: 'ffallecimiento',
			fieldLabel: 'Fecha de fallecimiento',
			hiddenname: 'ffallecimiento',
			anchor: '100%',
			format: 'd/m/Y',
			editable: false,
			allowBlank: false,
			readOnly: true,
			maxValue: '31/12/2100',
			minValue: '01/01/1900'
		});

		this.tadescripcionFall = new Ext.form.TextArea({
			fieldLabel: 'Descripci&oacute;n',
			name: 'descripcion',
			allowBlank: true,
			anchor:	'100%',
			height: 100,
			hiddenname: 'descripcion',
			maxLength: 255,
			regex: /^([a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]+ ?[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]*[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]* ?[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ.,;:()_])+$/,
			maskRe: /^([a-z A-Z0-9áéíóúÁÉÍÓÚñÑ])$/
		});

		this.formularioFall = new Ext.FormPanel({
			labelAlign: 'top',
			frame:true,
			bodyStyle:'padding:5px 5px 0',
			items: [{
				layout: 'column',
				items: [{
					columnWidth: 1.0,
					layout: 'form',
					items: [this.dfFfallecimiento]
				}, {
					columnWidth:1.0,
					layout: 'form',
					items: [this.tadescripcionFall]
				}]
			}]
		});

		this.btnCancelarFall = new Ext.Button({
			iconCls: 'cancelar',
			tooltip: self.idioma.textToolTipCancelar,
			text: self.idioma.lbtnCancelar,
			handler: function() {self.winGestFall.hide();}
		});

		this.btnAceptarFall = new Ext.Button({
			iconCls: 'aceptar',
			tooltip: self.idioma.textToolTipAceptar,
			text: self.idioma.lbtnAceptar,
			handler: function() {
				PVD.mostrarMascara('mascaraEnviarDatos', 'Información', 'Enviando datos...');
				Ext.Ajax.request({
					url: 'updateFallecimiento',
					method: 'POST',
					params: {
						idaccidenteimplicado: objselect.idaccidenteimplicado,
						ffallecimiento: self.dfFfallecimiento.getRawValue(),
						descfallecido: self.tadescripcionFall.getValue()
					},
					callback: function (options, success, response) {
						PVD.ocultarMascara('mascaraEnviarDatos');
						var responseData = Ext.decode(response.responseText);
						if (responseData == true) {
							mostrarMensaje(1, 'Los datos fueron guardados satisfactoriamente.');
						} else {
							mostrarMensaje(6, 'Ocurri&oacute; un error mientras se guardaban los datos.');
						}
						self.stImplicados.removeAll();
						self.stImplicados.reload();
						self.formularioFall.getForm().reset();
						self.winGestFall.hide();
					}
				});
			}
		});

		this.winGestFall = new Ext.Window({
			width: 450,
			height: 260,
			constrain:true,
			title: 'Fallecimiento del implicado',
			layout: 'fit',
			closable: true,
			resizable: false,
			closeAction: 'hide',
			items: [this.formularioFall],
			modal: true,
			buttons: [this.btnCancelarFall, this.btnAceptarFall],
			keys: [{
				key: 'x',
				alt: true,
				stopEvent: true,
				fn: function () {
					if (!self.btnCancelarFall.disabled) {
						self.btnCancelarFall.handler();
					}
				}
			}, {
				key: 13,
				stopEvent: true,
				fn: function () {
					if (!self.btnAceptarFall.disabled) {
						self.btnAceptarFall.handler();
					}
				}
			}]
		});

		this.smselectt = new Ext.grid.CheckboxSelectionModel({singleSelect: false});

		var connObjPer = new Ext.data.Connection({
			timeout: 3600000,
			url: 'getPersonas',
			method: 'POST'
		});

		this.stPersonasAll = new Ext.data.GroupingStore({
			proxy: new Ext.data.HttpProxy(connObjPer),
			reader: new Ext.data.JsonReader(
				{root: "datos", id: "idpersona", totalProperty: "cantidad"},
				[
					{name:'idpersona'},
					{name:'numid'},
					{name:'nombreyapellidos'},
					{name:'idcargo'},
					{name:'cargo'},
					{name:'idpartecuerpo'},
					{name:'denominacion'},
					{name:'entidad_area'},
					{name:'orden'}
				]
			),
			sortInfo: {field: 'orden', direction: "DESC"},
			groupField: 'entidad_area',
			remoteGroup: true
		});

		this.stPersonasAll.load({params: {start: 0, limit: 15}});

		this.sfBuscarPerAct = new Ext.app.SearchField({
			store: self.stPersonasAll,
			emptyText: 'Criterio de búsqueda',
			toolTipTrigger1: self.idioma.lbBtnLimpiar,
			toolTipTrigger2: self.idioma.lbBtnBuscarimp
		});

		this.gpPersonasAll = new Ext.grid.GridPanel({
			region: 'center',
			clicksToEdit: 1,
			width: 610,
			height: 400,
			loadMask: {msg: 'Cargando...'},
			frame: true,
			store: self.stPersonasAll,
			view: new Ext.grid.GroupingView({
				forceFit: true,
				startCollapsed: false,
				groupTextTpl: '{group} ({[values.rs.length]} {[values.rs.length > 1 ? "Personas" : "Persona"]})'
			}),
			tbar: ['Buscar persona: ', this.sfBuscarPerAct],
			autoScroll: true,
			sm: this.smselectt,
			columns: [
				this.smselectt,
				{header: '', hidden: true, dataIndex: 'entidad_area'},
				{header: 'No. de identidad', width: 100, dataIndex: 'numid'},
				{header: 'Apellidos y nombres', width: 250, dataIndex: 'nombreyapellidos'},
				{header: 'Cargo', width: 250, dataIndex: 'cargo'}
			],
			bbar: new Ext.PagingToolbar({pageSize: 15, store: self.stPersonasAll, displayInfo: true})
		});

		this.cbTipoInvalidezAdd = new Ext.form.ComboBox({
			fieldLabel: 'Tipo de invalidez',
			store: self.stTipoInvalidez,
			anchor: '100%',
			height: 100,
			name:'idtipoinvalidez',
			hiddenName:'idtipoinvalidez',
			displayField: 'tipoinvalidez',
			valueField: 'idtipoinvalidez',
			typeAhead: true,
			allowBlank: false,
			mode: 'local',
			triggerAction: 'all',
			selectOnFocus: true,
			readOnly: true
		});

		this.chbTareaHabitualAdd = new Ext.form.Checkbox({
			fieldLabel: 'Realizaba tarea habitual',
			allowBlank: false,
			name: 'tareahabitual',
			anchor: '100%'
		});

		this.fpAddImp = new Ext.FormPanel({
			labelAlign: 'top',
			bodyStyle:'padding:5px 5px 0',
			border: false,
			region: 'center',
			frame: true,
			autoHeight: true,
			items: [{
				layout: 'column',
				border: 'false',
				items: [
					{columnWidth: 1.0, layout: 'form', items: [this.gpPersonasAll]},
					{columnWidth: 0.5, layout: 'form', items: [this.cbTipoInvalidezAdd]},
					{columnWidth: 0.5, layout: 'form', items: [this.chbTareaHabitualAdd]}
					]
			}]
		});

		this.btnCancelar = new Ext.Button({
			iconCls: 'cancelar',
			tooltip: self.idioma.textToolTipCancelar,
			text: self.idioma.lbtnCancelar,
			handler: function() { self.windAdd.hide();}
		});

		this.btnAceptar = new Ext.Button({
			iconCls: 'aceptar',
			tooltip: self.idioma.textToolTipAceptar,
			text: self.idioma.lbtnAceptar,
			handler: function() {guardarDatos();}
		});

		this.windAdd = new Ext.Window({
			title: 'Adicionar implicado',
			modal: true,
			closeAction: 'hide',
			constrain: true,
			resizable: false,
			layout: 'fit',
			width: 620,
			height: 535,
			items: [this.fpAddImp],
			buttons: [this.btnCancelar, this.btnAceptar],
			listeners: {
				'hide': function() {
					self.btnAdicionar.focus();
					self.gpPersonasAll.getSelectionModel().clearSelections();
					self.cbTipoInvalidezAdd.reset();
					},
				'beforeshow': function() {
					self.chbTareaHabitualAdd.setValue(true);
				}
			},
			keys: [
				{
					key: 'x',
					alt: true,
					stopEvent: true,
					fn: function () {
						if (!self.btnCancelar.disabled) {
							self.btnCancelar.handler();
						}
					}
				}, {
					key: 13,
					stopEvent: true,
					fn: function () {
						if (!self.btnAceptar.disabled) {
							self.btnAceptar.handler();
						}
					}
				}
			]
		});

		function guardarDatos() {
			var per = self.gpPersonasAll.getSelectionModel().getSelections();
			if (per.length > 0) {
				var res = new Array();
				for (i = 0; i < per.length; i++) {
					res.push(per[i].data.idpersona);
				}
				PVD.mostrarMascara('mascaraEnviarDatos', 'Información', 'Enviando datos...');
				Ext.Ajax.request({
					url: 'addImplicado',
					method: 'POST',
					params: {
						idaccidente: self.idaccidente,
						implicados: Ext.encode(res),
						idtipoinvalidez: self.cbTipoInvalidezAdd.getValue(),
						tareahabitual: (self.chbTareaHabitualAdd.getValue() == true)? 1: 0
					},
					callback: function (options, success, response) {
						PVD.ocultarMascara('mascaraEnviarDatos');
						var responseData = Ext.decode(response.responseText);
						if (responseData == true) {
							mostrarMensaje(1, self.idioma.msgAddImpSucces);
							self.stImplicados.removeAll();
							self.stImplicados.reload();
							self.windAdd.hide();
						} else if (responseData == 2) {
							if (per.length == 1) {
								mostrarMensaje(6, 'La persona seleccionada ya existe.');
							} else {
								mostrarMensaje(6, 'Alguna de las personas seleccionadas ya existe.');
							}
						}
					}
				});
			} else {
				mostrarMensaje(6, 'Debe seleccionar al menos una persona.');
			}
		}

		function guardarLesiones(boton) {
			PVD.mostrarMascara('mascaraEnviarDatos', 'Información', 'Enviando datos...');
			Ext.Ajax.request({
				url: (accion == 'add')?'addParteImplicado':'updateParteImplicado',
				method: 'POST',
				params: {
					idimplicadopartecuerpo: (accion == 'add')?'-1': self.gpLesiones.getSelectionModel().getSelected().data.idimplicadopartecuerpo,
					idaccidenteimplicado: objselect.idaccidenteimplicado,
					idnaturalezalesion: self.cbNaturalezaLesion.getValue(),
					idpartecuerpo: self.cbParteCuerpo.getValue(),
					descripcion: self.tadescripcion.getValue()
				},
				callback: function (options, success, response) {
					PVD.ocultarMascara('mascaraEnviarDatos');
					var responseData = Ext.decode(response.responseText);
					if (responseData == true) {
						if (accion == 'add') {
							mostrarMensaje(1, 'Los datos fueron adicionados satisfactoriamente.');
						} else {
							mostrarMensaje(1, 'Los datos fueron modificados satisfactoriamente.');
						}
					} else {
						mostrarMensaje(6, 'Ocurri&oacute; un error mientras se guardaban los datos.');
					}
					self.stLesiones.removeAll();
					self.stLesiones.reload();
					self.formularioGestion.getForm().reset();
					if (boton == 'ACP'){
						self.winGestLesion.hide();
					}
				}
			});
		}

		function guardarSubsidio(btn) {
			Ext.Ajax.request({
				url: (accionsubsidio == 'add') ? 'addSubsidio' : 'updateSubsidio',
				params: {
					idimplicadosubsidio: (accionsubsidio == 'mod') ? self.gpSubsidios.getSelectionModel().getSelected().data.idimplicadosubsidio: -1,
					idaccidenteimplicado: objselect.idaccidenteimplicado,
					denominacion: self.tfDenomS.getValue(),
					importe: self.nfImporteS.getValue(),
					fechasubsidio: self.dfFechaSubsidio.getValue()
				},
				success: function(r) {
					var responseData = Ext.decode(r.responseText);
					if (responseData == 1) {
						if (accionsubsidio == 'add') {
							mostrarMensaje(1, 'Los datos fueron adicionados satisfactoriamente.');
						} else {
							mostrarMensaje(1, 'Los datos fueron modificados satisfactoriamente.');
						}
					} else {
						mostrarMensaje(6, 'Ocurri&oacute; un error mientras se guardaban los datos.');
					}
					if (btn == 'ACP') {
						self.windSubsidio.hide();
					}
					self.fSubsidio.getForm().reset();
					//self.stSubsidios.reload();
				}
			});
		}

		function eliminar() {
			var per = self.gpImplicados.getSelectionModel().getSelections();
			var men = self.idioma.msgImpDeletepreg1;
			if (per.length > 1) {
				men = self.idioma.msgImpDeletepreg2;
			}
			mostrarMensaje(2, men, function (btnPresionado) {
				var res = new Array();
				for (i = 0; i<per.length; i++) {
					res.push(per[i].data.idaccidenteimplicado);
				}
				if (btnPresionado == 'ok') {
					Ext.getBody().mask(self.idioma.msgDeleting);
					Ext.Ajax.request({
						url: 'deleteImplicado',
						params: {implicados: Ext.encode(res)},
						callback: function () {
							Ext.getBody().unmask();
							},
						success: function (r) {
							var responseData = Ext.decode(r.responseText);
							if (responseData == true) {
								men = self.idioma.msgImpDeleteSucces1;
								if (per.length > 1) {
									men = self.idioma.msgImpDeleteSucces2;
								}
								mostrarMensaje(1, men);
							} else {
								mostrarMensaje(6, 'Ocurri&oacute; un error mientras se eliminaban los datos.');
							}
							self.stImplicados.reload();
							self.gpImplicados.getSelectionModel().clearSelections();
						}
					});
				}
			});
		}

		function eliminarLesion() {
			var per = self.gpLesiones.getSelectionModel().getSelections();
			var men = self.idioma.msgLesDeletepreg1;
			if (per.length > 1) {
				men = self.idioma.msgLesDeletepreg2;
			}
			mostrarMensaje(2, men, function (btnPresionado) {
				var res = new Array();
				for (i = 0; i<per.length; i++) {
					res.push(per[i].data.idimplicadopartecuerpo);
				}
				if (btnPresionado == 'ok') {
					Ext.getBody().mask(self.idioma.msgDeleting);
					Ext.Ajax.request({
						url: 'deleteParteImplicado',
						params: {lesiones: Ext.encode(res)},
						callback: function () {
							Ext.getBody().unmask();
							},
						success: function (r) {
							var responseData = Ext.decode(r.responseText);
							if (responseData == true) {
								men = self.idioma.msgLesDeleteSucces1;
								if (per.length > 1) {
									men = self.idioma.msgLesDeleteSucces2;
								}
								mostrarMensaje(1, men);
							} else {
								mostrarMensaje(6, 'Ocurri&oacute; un error mientras se eliminaban los datos.');
							}
							self.stLesiones.reload();
						}
					});
				}
			});
		}

		function eliminarSubsidios() {
			var per = self.gpSubsidios.getSelectionModel().getSelections();
			var mens = self.idioma.msgSubDeletepreg1;
			if (per.length > 1) {
				mens = self.idioma.msgSubDeletepreg2;
			}
			mostrarMensaje(2, mens, function(btnPresionado) {
				var res = new Array();
				for (i = 0; i < per.length; i++) {
					res.push(per[i].data.idimplicadosubsidio);
				}
				if (btnPresionado == 'ok') {
					Ext.getBody().mask(self.idioma.msgDeleting);
					Ext.Ajax.request({
						url: 'deleteSubsidio',
						params: {subsidios: Ext.encode(res)},
						callback: function() {
							Ext.getBody().unmask();
							},
						success: function(r) {
							var responseData = Ext.decode(r.responseText);
							if (responseData == false) {
								mens = self.idioma.msgSubDeleteFail1;
								if (per.length > 1) {
									mens = self.idioma.msgSubDeleteFail2;
								}
								mostrarMensaje(6, mens);
							} else {
								mens = self.idioma.msgSubDeleteSucces1;
								if (per.length > 1) {
									mens = self.idioma.msgSubDeleteSucces2;
								}
								mostrarMensaje(1, mens);
							}
							//self.stSubsidios.reload();
							self.gpSubsidios.getSelectionModel().clearSelections();
						}
					});
				}
			});
		}

		this.keys = [
			{
				key: 'i',
				alt: true,
				fn: function () {
					if (!self.btnAdicionar.disabled) {
						self.btnAdicionar.handler();
					}
				}
			}, {
				key: 46,
				fn: function () {
					if (!self.btnEliminar.disabled) {
						self.btnEliminar.handler();
					}
				}
			}, {
				key: 'b',
				alt: true,
				fn: function () {
					if (!self.sfBuscar.getValue() != '') {
						self.sfBuscar.onTrigger2Click();
					}
				}
			}, {
				key: 'l',
				alt: true,
				fn: function () {
					if (!self.sfBuscar.getValue() != '') {
						self.sfBuscar.onTrigger1Click();
					}
				}
		}];

		Pvd.SST.Gestionaraccidentes.PanelImplicados.superclass.initComponent.call(this);
	}
});