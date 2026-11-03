/*
 * Componente Imputables.
 *
 * @author Ing.Yaricel Guerra Velázquez
 * @package Pvd.Movimientoslaborales
 * @uses Pvd.Movimientoslaborales
 * @copyright XETID
 * @version 1.0
 */
Ext.ns('Pvd.Movimientoslaborales');
Pvd.Movimientoslaborales.PanelImputables = Ext.extend(Ext.Panel, {
    layout: 'fit',
	border: false,
	id: 'PanelImputables',
	title: 'Imputables',
	region: 'center',
	height: 500,
    initComponent: function() {
        var self = this;
		var objselect;
		var accion;

		//Fuente de datos del listado de personas imputables.
		this.stImputables =new Ext.data.Store({
			url: 'getImputables',
			reader: new Ext.data.JsonReader(
				{root: "datos", id: "idimputable", totalProperty: "cantidad"},
				[{name:'idimputable'},{name:'idpersona'},{name:'numid'}, {name:'nombreyapellidos'}, {name:'cargo'},
				 {name:'idcargo'}, {name:'area'}, {name:'idarea'},{name:'identidad'}, {name:'entidad_area'}]
			),
			listeners: {
				load: function(st, data) {
					self.btnEliminar.disable();
					if (data.length == 0) {
						if (self.sfBuscar.getValue() == '') {
							mostrarMensaje(1, "No existen datos que mostrar.");
						} else {
							mostrarMensaje(1, "No existen datos que se correspondan con el criterio de búsqueda especificado.");
						}
					}
				}
			}
		});

		this.sfBuscar = new Ext.app.SearchField({
			store: self.stImputables,
			emptyText: 'Criterio de búsqueda',
			toolTipTrigger1: self.idioma.lbBtnLimpiar,
			toolTipTrigger2: self.idioma.lbBtnBuscarimp
		});

		this.smselect = new Ext.grid.CheckboxSelectionModel({
			singleSelect: false
		});

		this.btnAdicionar = new Ext.Button({
			id: 'btnAdicionarImp',
			text: self.idioma.BtnAdicionar,
			disabled: true,
			tooltip: self.idioma.lbBtnAdicionarIm,
			iconCls: 'adicionar',
			handler: function() {
				self.windAdd.show();
			}
		});

		this.btnEliminar = new Ext.Button({
			id: 'btnEliminar',
			text: self.idioma.BtnEliminar,
			disabled: true,
			tooltip: self.idioma.lbBtnEliminarIm,
			iconCls: 'eliminar',
			handler: function() {
				eliminar();
			}
		});

		//Listado de IMPUTABLES.
		this.gpImputables = new Ext.grid.EditorGridPanel({
			tbar: [this.btnAdicionar, this.btnEliminar, '-', 'Buscar imputable: ', this.sfBuscar],
			region: 'west',
			clicksToEdit: 1,
			plugins: this.expanderfall,
			width: '100%',
			border: false,
			store: self.stImputables,
			loadMask: {msg: 'Cargando...'},
			sm: this.smselect,
			columns: [
				{
					header: 'No. de identidad',
					width: 90,
					dataIndex: 'numid',
					align: 'left'
				},{
					header: 'Apellidos y nombres',
					width: 250,
					dataIndex: 'nombreyapellidos',
					align: 'left'
				},{
					header: 'Cargo',
					width: 250,
					dataIndex: 'cargo',
					align: 'left'
				}
			],
			bbar: new Ext.PagingToolbar({
				pageSize: 15,
				store: self.stImputables,
				displayInfo: true
			})
		});

		self.gpImputables.getSelectionModel().on('rowselect', function (s) {
			self.btnEliminar.enable();
			if (self.gpImputables.getSelectionModel().getSelections().length == 1) {
				objselect = self.gpImputables.getSelectionModel().getSelected().data;
			}
		});

		self.gpImputables.getSelectionModel().on('rowdeselect', function () {
			if (self.gpImputables.getSelectionModel().getSelections().length == 0) {
				self.btnEliminar.disable();
			}
			if (self.gpImputables.getSelectionModel().getSelections().length == 1) {
				objselect = self.gpImputables.getSelectionModel().getSelected().data;
			}
		});

		this.items = [this.gpImputables];


		this.smselectt = new Ext.grid.CheckboxSelectionModel({
			singleSelect: false
		});

		//Fuente de datos del listado de personas.
		var connObjPer = new Ext.data.Connection({
			timeout : 3600000,
			url: 'getPersonas',
			method : 'POST'
		});

		this.stPersonasAll = new Ext.data.GroupingStore({
			proxy: new Ext.data.HttpProxy(connObjPer),
			reader: new Ext.data.JsonReader(
				{root: "datos", id: "idpersona", totalProperty: "cantidad"},
				[{name:'idpersona'}, {name:'numid'}, {name:'nombreyapellidos'}, {name:'idcargo'},
				 {name:'cargo'}, {name:'entidad_area'}, {name:'orden'}]
			),
			sortInfo   : {
				field: 'orden',
				direction: "DESC"
			},
			groupField : 'entidad_area',
			remoteGroup: true
		});

		this.stPersonasAll.load({params: {start: 0, limit: 15}});

		this.sfBuscarPerAct = new Ext.app.SearchField({
			store: self.stPersonasAll,
			emptyText: 'Criterio de búsqueda',
			toolTipTrigger1: self.idioma.lbBtnLimpiar,
			toolTipTrigger2: self.idioma.lbBtnBuscarimp
		});

		//Listado de personas.
		this.gpPersonasAll = new Ext.grid.GridPanel({
			region: 'center',
			clicksToEdit: 1,
			width: 600,
			height: 350,
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
			columns: [this.smselectt,
				{
					header: '',
					hidden: true,
					dataIndex: 'entidad_area'
				},{
					header: 'No. de identidad',
					width: 100,
					dataIndex: 'numid'
				},{
					header: 'Apellidos y nombres',
					width: 250,
					dataIndex: 'nombreyapellidos'
				},{
					header: 'Cargo',
					width: 250,
					dataIndex: 'cargo'
				}
			],
			bbar: new Ext.PagingToolbar({
				pageSize: 15,
				store: self.stPersonasAll,
				displayInfo: true
			})
		});

		this.fpAddImp = new Ext.FormPanel({
			labelAlign: 'top',
			bodyStyle:'padding:5px 5px 0',
			border    : false,
			region    : 'center',
			frame     : true,
			autoHeight: true,
			items     : [
				{
					layout: 'column',
					border: 'false',
					items : [
						{
							columnWidth: 1.0,
							layout     : 'form',
							items      : [this.gpPersonasAll]
						}
					]
				}
			]
		});

		this.btnCancelar = new Ext.Button({
			iconCls: 'cancelar',
			tooltip: self.idioma.textToolTipCancelar,
			text: self.idioma.lbtnCancelar,
			handler: function() {
				self.windAdd.hide();
			}
		});

		this.btnAceptar = new Ext.Button({
			iconCls: 'aceptar',
			tooltip: self.idioma.textToolTipAceptar,
			text: self.idioma.lbtnAceptar,
			handler: function() {
				guardarDatos();
			}
		});

		this.windAdd = new Ext.Window({
			title: 'Adicionar imputable',
			modal: true,
			closeAction: 'hide',
			constrain: true,
			resizable: false,
			layout: 'fit',
			width: 630,
			height: 440,
			items: [this.fpAddImp],
			buttons: [
				this.btnCancelar,
				this.btnAceptar
			],
			listeners: {
				'hide': function()
				{
					self.btnAdicionar.focus();
					self.gpPersonasAll.getSelectionModel().clearSelections();
				}
			},
			keys: [{
				key: 'x',
				alt: true,
				stopEvent: true,
				fn: function () {
					if (!self.btnCancelar.disabled) {
						self.btnCancelar.handler();
					}
				}
			},{
				key: 13,
				stopEvent: true,
				fn: function () {
					if (!self.btnAceptar.disabled) {
						self.btnAceptar.handler();
					}
				}
			}]
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
					url: 'addImputable',
					method: 'POST',
					params: {
						idinterrupcion: self.idinterrupcion,
						imputables: Ext.encode(res),
					},
					callback: function (options, success, response) {
						PVD.ocultarMascara('mascaraEnviarDatos');
						var responseData = Ext.decode(response.responseText);
						if (responseData == true) {
							mostrarMensaje(1, self.idioma.msgAddImpSucces);
							self.stImputables.removeAll();
							self.stImputables.reload();
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

		function eliminar() {
			var per = self.gpImputables.getSelectionModel().getSelections();
			var men = self.idioma.msgImpDeletepreg1;
			if (per.length > 1) {
				men = self.idioma.msgImpDeletepreg2;
			}
			mostrarMensaje(2, men, function (btnPresionado) {
				var res = new Array();
				for (i = 0; i<per.length; i++) {
					res.push(per[i].data.idimputable);
				}
				if (btnPresionado == 'ok') {
					Ext.getBody().mask(self.idioma.msgDeleting);
					Ext.Ajax.request({
						url: 'deleteImputable',
						params: {imputables: Ext.encode(res)},
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
							self.stImputables.reload();
							self.gpImputables.getSelectionModel().clearSelections();
						}
					});
				}
			});
		}

		this.keys = [
			{
				key: 'i',
				alt: true,
				//stopEvent: true,
				fn: function () {
					if (!self.btnAdicionar.disabled) {
						self.btnAdicionar.handler();
					}

				}
			},
			{
				key: 46,//Eliminar
				//stopEvent: true,
				fn: function () {
					if (!self.btnEliminar.disabled) {
						self.btnEliminar.handler();
					}
				}
			},
			{
				key: 'b',
				alt: true,
				//stopEvent: true,
				fn: function () {
					if (!self.sfBuscar.getValue() != '') {
						self.sfBuscar.onTrigger2Click();
					}
				}
			},
			{
				key: 'l',
				alt: true,
				//stopEvent: true,
				fn: function () {
					if (!self.sfBuscar.getValue() != '') {
						self.sfBuscar.onTrigger1Click();
					}
				}
			}];

        Pvd.Movimientoslaborales.PanelImputables.superclass.initComponent.call(this);
    }
});
