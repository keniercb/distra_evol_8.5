/*
 * Componente Conclusiones.
 *
 * @author Ing.Yaricel Guerra Velázquez
 * @package Pvd.SST
 * @uses Pvd.SST.Gestionaraccidentes
 * @copyright XETID
 * @version 1.0
 */
Ext.ns('Pvd.SST.Gestionaraccidentes');
Pvd.SST.Gestionaraccidentes.PanelConclusiones = Ext.extend(Ext.Panel, {
    layout: 'fit',
	border: false,
	id: 'PanelConclusiones',
	title: 'Conclusiones',
	region: 'center',
	height: 500,
    initComponent: function() {
        var self = this;
		var objselect, accion;

		//Fuente de datos del listado de conclusiones
		this.stConclusiones =new Ext.data.Store({
			url: 'getConclusiones',
			reader: new Ext.data.JsonReader(
				{root: "datos", id: "idaccidenteconclusion", totalProperty: "cantidad"},
				[{name:'idaccidenteconclusion'},{name:'conclusion'},{name:'fregistro'}]
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
			store: self.stConclusiones,
			emptyText: 'Criterio de búsqueda',
			toolTipTrigger1: self.idioma.lbBtnLimpiar,
			toolTipTrigger2: self.idioma.lbBtnBuscarCon
		});

		this.smselect = new Ext.grid.CheckboxSelectionModel({
			singleSelect: false
		});

		function mostrartt(val, metaData, record) {
			metaData.attr = 'ext:qtip='+'"'+record.get('conclusion')+'"';
			return val;
		}

		//Listado de conclusiones.
		this.gpConclusiones = new Ext.grid.GridPanel({
			region: 'center',
			border: false,
			store: self.stConclusiones,
			loadMask: {msg: 'Cargando...'},
			sm: this.smselect,
			columns: [this.smselect,
				{
					header: 'Conclusi&oacute;n',
					width: 400,
					dataIndex: 'conclusion',
					align: 'left',
					renderer: mostrartt
				},{
					header: 'Fecha de registro',
					width: 150,
					dataIndex: 'fregistro',
					align: 'left',
					renderer: mostrartt
				}
			]
		});

		self.gpConclusiones.getSelectionModel().on('rowselect', function (s) {
			objselect = self.gpConclusiones.getSelectionModel().getSelected().data;
			if (self.gpConclusiones.getSelectionModel().getSelections().length > 1) {
				self.btnModificar.disable();
			} else {
				self.btnModificar.enable();
			}
			self.btnEliminar.enable();
	});

		self.gpConclusiones.getSelectionModel().on('rowdeselect', function () {
			if (self.gpConclusiones.getSelectionModel().getSelections().length == 1) {
				self.btnModificar.enable();
			} else if (self.gpConclusiones.getSelectionModel().getSelections().length == 0) {
				self.btnEliminar.disable();
				self.btnModificar.disable();
			}
		});

		this.btnAdicionar = new Ext.Button({
			id: 'btnAdicionarCon',
			text: self.idioma.BtnAdicionar,
			disabled: true,
			hidden: true,
			tooltip: self.idioma.lbBtnAdicionarCon,
			iconCls: 'adicionar',
			handler: function() {
				accion = 'add';
				self.windCon.setTitle('Adicionar conclusi&oacute;n');
				self.windCon.show();
				self.btnAplicar.show();
			}
		});

		//Boton para modificar.
		this.btnModificar = new Ext.Button({
			id: 'btnModificarRec',
			text: self.idioma.BtnModificar,
			disabled: true,
			hidden: true,
			tooltip: self.idioma.lbBtnModificarCon,
			iconCls: 'modificar',
			handler: function() {
				accion = 'mod';
				self.windCon.setTitle('Modificar conclusi&oacute;n');
				self.windCon.show();
				self.btnAplicar.hide();
				self.taCon.setValue(objselect.conclusion);
			}
		});

		this.btnEliminar = new Ext.Button({
			id: 'btnEliminarCon',
			text: self.idioma.BtnEliminar,
			disabled: true,
			hidden: true,
			tooltip: self.idioma.lbBtnEliminarCon,
			iconCls: 'eliminar',
			handler: function() {
				eliminar();
			}
		});

		//Botón para ver conclusiones.
		this.btnVer = new Ext.Button({
			id: 'btnVerCon',
			text: self.idioma.lbBtnVer,
			tooltip: self.idioma.ttBtnVerCon,
			iconCls: 'ver',
			handler: function(){
				var params;
				params = Ext.urlEncode({
					idaccidente: self.idaccidente
				});
				var idIframe = Ext.id();
				new Ext.Window({
					title: 'Conclusiones',
					width: 800,
					height: 500,
					id: 'winconc',
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
							src: document.location.protocol + '//' + document.location.host +
							'/pvd/sst/accidente/index.php/gestionaraccidentes/generarConclusiones?' + params
						}
					}
				}).show();
				Ext.getCmp('winconc').maximize();

				PVD.mostrarMascara('rep01', 'Por favor espere...', 'Generando conclusiones generales.');
				document.getElementById(idIframe).onload = function () {
					PVD.ocultarMascara('rep01');
				};
			}
		});

		this.tbar = [this.btnAdicionar, this.btnModificar, this.btnEliminar, this.btnVer, '-', 'Buscar conclusi&oacute;n: ', this.sfBuscar];

		this.items = [this.gpConclusiones];

		this.btnAcept = new Ext.Button({
			iconCls  : 'aceptar',
			text     : this.idioma.lbtnAceptar,
			tooltip  : this.idioma.textToolTipAceptar,
			handler: function ()
			{
				guardar('ACP');
			}
		});

		this.btnAplicar = new Ext.Button({
			iconCls: 'aplicar',
			tooltip: self.idioma.textToolTipAplicar,
			text: self.idioma.lbtnAplicar,
			handler: function ()
			{
				guardar('APL');
			}
		});

		this.btnCancel = new Ext.Button({
			iconCls  : 'cancelar',
			text     : this.idioma.lbtnCancelar,
			tooltip  : this.idioma.textToolTipCancelar,
			handler: function ()
			{
				self.windCon.hide();
				self.taCon.reset();
			}
		});

		this.taCon = new Ext.form.TextArea({
			fieldLabel: 'Conclusi&oacute;n',
			name: 'conclusion',
			anchor: '100%',
			height: 200,
			hiddenname: 'conclusion',
			allowBlank: true
		});

		this.fReg = new Ext.form.FormPanel({
			frame: true,
			bodyStyle: 'padding: 3px 3px 0',
			border: false,
			autoDestroy: false,
			labelAlign: 'top',
			autoHeight: true,
			items: [this.taCon]
		});

		this.windCon = new Ext.Window({
			layout: 'fit',
			constrain:true,
			title:  'Adicionar Conclusi&oacute;n',
			modal: true,
			closeAction: 'hide',
			resizable: false,
			width: 350,
			height: 310,
			maximizable: false,
			items: [this.fReg],
			buttons: [this.btnCancel, this.btnAplicar, this.btnAcept],
			keys: [{
				key: 'x',
				alt: true,
				stopEvent: true,
				fn: function () {
					if (!self.btnCancel.disabled) {
						self.btnCancel.handler();
					}
				}
			},{
				key: 13,
				stopEvent: true,
				fn: function () {
					if (!self.btnAcept.disabled) {
						self.btnAcept.handler();
					}
				}
			},{
				key: 'p',
				ctrl: true,
				alt: true,
				stopEvent: true,
				fn: function () {
					if (!self.btnAplicar.disabled) {
						self.btnAplicar.handler();
					}
				}
			}]
		});

		function guardar(btn){
			Ext.Ajax.request({
				url: (accion == 'add')?'addConclusion':'updateConclusion',
				params: {
					idaccidenteconclusion: (accion == 'mod')?objselect.idaccidenteconclusion:-1,
					idaccidente: self.idaccidente,
					conclusion: self.taCon.getValue()
				},
				success: function (r){
					var responseData = Ext.decode(r.responseText);
					if (responseData == 1) {
						if (accion == 'add') {
							mostrarMensaje(1, self.idioma.msgAddConSucces);
						} else {
							mostrarMensaje(1, self.idioma.msgModConSucces);
						}
					} else {
						mostrarMensaje(6, self.idioma.msgError);
					}
					if (btn == 'ACP') {
						self.windCon.hide();
					}
					self.fReg.getForm().reset();
					self.stConclusiones.reload();
				}
			});
		}


		function eliminar() {
			var per = self.gpConclusiones.getSelectionModel().getSelections();
			var mens = self.idioma.msgConDeletepreg1;
			if (per.length > 1) {
				mens = self.idioma.msgConDeletepreg2;
			}
			mostrarMensaje(2, mens, function (btnPresionado) {
				var res = new Array();
				for (i = 0; i<per.length; i++) {
					res.push(per[i].data.idaccidenteconclusion);
				}
				if (btnPresionado == 'ok') {
					Ext.getBody().mask(self.idioma.msgDeleting);
					Ext.Ajax.request({
						url: 'deleteConclusion',
						params: {conclusiones: Ext.encode(res)},
						callback: function () {
							Ext.getBody().unmask();
						},
						success: function (r) {
							var responseData = Ext.decode(r.responseText);
							if (responseData == false) {
								mens = self.idioma.msgConDeleteFail1;
								if (per.length > 1) {
									mens = self.idioma.msgConDeleteFail2;
								}
								mostrarMensaje(6, mens);
							} else {
								mens = self.idioma.msgConDeleteSucces1;
								if (per.length > 1) {
									mens = self.idioma.msgConDeleteSucces2;
								}
								mostrarMensaje(1, mens);
							}
							self.stConclusiones.reload();
							self.gpConclusiones.getSelectionModel().clearSelections();
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
				key: 'm',
				alt: true,
				//stopEvent: true,
				fn: function () {
					if (!self.btnModificar.disabled) {
						self.btnModificar.handler();
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

        Pvd.SST.Gestionaraccidentes.PanelConclusiones.superclass.initComponent.call(this);
    }
});
