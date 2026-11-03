/*
 * Componente Recomendaciones.
 *
 * @author Ing.Yaricel Guerra Velázquez
 * @package Pvd.SST
 * @uses Pvd.SST.Gestionaraccidentes
 * @copyright XETID
 * @version 1.0
 */
Ext.ns('Pvd.SST.Gestionaraccidentes');
Pvd.SST.Gestionaraccidentes.PanelRecomendaciones = Ext.extend(Ext.Panel, {
    layout: 'fit',
	border: false,
	id: 'PanelRecomendaciones',
	title: 'Recomendaciones',
	region: 'center',
	height: 500,
    initComponent: function() {
        var self = this;
		var objselect, accion;

		//Fuente de datos del listado de recomendaciones.
		this.stRecomendaciones =new Ext.data.Store({
			url: 'getRecomendaciones',
			reader: new Ext.data.JsonReader(
				{root: "datos", id: "idaccidenterecomendacion", totalProperty: "cantidad"},
				[{name:'idaccidenterecomendacion'},{name:'recomendacion'},{name:'fregistro'}]
			),
			listeners: {
				load: function(st, data) {
					self.btnEliminar.disable();
					self.btnModificar.disable();
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
			store: self.stRecomendaciones,
			emptyText: 'Criterio de búsqueda',
			toolTipTrigger1: self.idioma.lbBtnLimpiar,
			toolTipTrigger2: self.idioma.lbBtnBuscarRec
		});

		this.smselect = new Ext.grid.CheckboxSelectionModel({
			singleSelect: false
		});

		function mostrartt(val, metaData, record) {
			metaData.attr = 'ext:qtip='+'"'+record.get('recomendacion')+'"';
			return val;
		}

		//Listado de recomendaciones.
		this.gpRecomendaciones = new Ext.grid.GridPanel({
			region: 'center',
			border: false,
			store: self.stRecomendaciones,
			loadMask: {msg: 'Cargando...'},
			sm: this.smselect,
			columns: [this.smselect,
				{
					header: 'Recomendaci&oacute;n',
					width: 400,
					dataIndex: 'recomendacion',
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

		self.gpRecomendaciones.getSelectionModel().on('rowselect', function (s) {
			objselect = self.gpRecomendaciones.getSelectionModel().getSelected().data;
			if (self.gpRecomendaciones.getSelectionModel().getSelections().length > 1) {
				self.btnModificar.disable();
			} else {
				self.btnModificar.enable();
			}
			self.btnEliminar.enable();

		});

		self.gpRecomendaciones.getSelectionModel().on('rowdeselect', function () {
			if (self.gpRecomendaciones.getSelectionModel().getSelections().length == 1) {
				self.btnModificar.enable();
			} else if (self.gpRecomendaciones.getSelectionModel().getSelections().length == 0) {
				self.btnEliminar.disable();
				self.btnModificar.disable();
			}
		});

		this.btnAdicionar = new Ext.Button({
			id: 'btnAdicionarRec',
			text: self.idioma.BtnAdicionar,
			disabled: true,
			hidden: true,
			tooltip: self.idioma.lbBtnAdicionarP,
			iconCls: 'adicionar',
			handler: function() {
				accion = 'add';
				self.windRec.setTitle('Adicionar recomendaci&oacute;n');
				self.windRec.show();
				self.btnAplicar.show();
			}
		});

		//Boton para modificar.
		this.btnModificar = new Ext.Button({
			id: 'btnModificarRec',
			text: self.idioma.BtnModificar,
			disabled: true,
			hidden: true,
			tooltip: self.idioma.lbBtnModificarP,
			iconCls: 'modificar',
			handler: function() {
				accion = 'mod';
				self.windRec.setTitle('Modificar recomendaci&oacute;n');
				self.windRec.show();
				self.btnAplicar.hide();
				self.taRec.setValue(objselect.recomendacion);
			}
		});

		this.btnEliminar = new Ext.Button({
			id: 'btnEliminarRec',
			text: self.idioma.BtnEliminar,
			disabled: true,
			hidden: true,
			tooltip: self.idioma.lbBtnEliminarP,
			iconCls: 'eliminar',
			handler: function() {
				eliminar();
			}
		});

		//Botón para ver conclusiones.
		this.btnVer = new Ext.Button({
			text: self.idioma.lbBtnVer,
			tooltip: self.idioma.ttBtnVerRec,
			iconCls: 'ver',
			handler: function(){
				var params;
				params = Ext.urlEncode({
					idaccidente: self.idaccidente
				});
				var idIframe = Ext.id();
				new Ext.Window({
					title: 'Recomendaciones',
					width: 800,
					height: 500,
					id: 'winrec',
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
							'/pvd/sst/accidente/index.php/gestionaraccidentes/generarRecomendaciones?' + params
						}
					}
				}).show();
				Ext.getCmp('winrec').maximize();

				PVD.mostrarMascara('rep01', 'Por favor espere...', 'Generando recomendaciones generales.');
				document.getElementById(idIframe).onload = function () {
					PVD.ocultarMascara('rep01');
				};
			}
		});

		this.tbar = [this.btnAdicionar, this.btnModificar, this.btnEliminar, this.btnVer, '-', 'Buscar recomendaci&oacute;n: ', this.sfBuscar];

		this.items = [this.gpRecomendaciones];

		this.btnAcept = new Ext.Button({
			iconCls  : 'aceptar',
			text     : this.idioma.lbtnAceptar,
			tooltip  : this.idioma.textToolTipAceptar,
			handler: function ()
			{
				guardarRec('ACP');
			}
		});

		this.btnAplicar = new Ext.Button({
			iconCls: 'aplicar',
			tooltip: self.idioma.textToolTipAplicar,
			text: self.idioma.lbtnAplicar,
			handler: function ()
			{
				guardarRec('APL');
			}
		});

		this.btnCancel = new Ext.Button({
			iconCls  : 'cancelar',
			text     : this.idioma.lbtnCancelar,
			tooltip  : this.idioma.textToolTipCancelar,
			handler: function ()
			{
				self.windRec.hide();
				self.taRec.reset();
			}
		});

		this.taRec = new Ext.form.TextArea({
			fieldLabel: 'Recomendaci&oacute;n',
			name: 'recomendacion',
			anchor: '100%',
			height: 200,
			hiddenname: 'recomendacion',
			allowBlank: true
		});

		this.fRec = new Ext.form.FormPanel({
			frame: true,
			bodyStyle: 'padding: 3px 3px 0',
			border: false,
			autoDestroy: false,
			labelAlign: 'top',
			autoHeight: true,
			items: [this.taRec]
		});

		this.windRec = new Ext.Window({
			layout: 'fit',
			constrain:true,
			title:  'Adicionar recomendaci&oacute;n',
			modal: true,
			closeAction: 'hide',
			resizable: false,
			width: 350,
			height: 310,
			maximizable: false,
			items: [this.fRec],
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

		function guardarRec(btn){
			Ext.Ajax.request({
				url: (accion == 'add')?'addRecomendacion':'updateRecomendacion',
				params: {
					idaccidenterecomendacion: (accion == 'mod')?objselect.idaccidenterecomendacion:-1,
					idaccidente: self.idaccidente,
					recomendacion: self.taRec.getValue()
				},
				success: function (r){
					var responseData = Ext.decode(r.responseText);
					if (responseData == 1) {
						if (accion == 'add') {
							mostrarMensaje(1, self.idioma.msgAddRSucces);
						} else {
							mostrarMensaje(1, self.idioma.msgModRSucces);
						}
					} else {
						mostrarMensaje(6, self.idioma.msgError);
					}
					if (btn == 'ACP') {
						self.windRec.hide();
					}
					self.fRec.getForm().reset();
					self.stRecomendaciones.reload();
				}
			});
		}

		function eliminar() {
			var per = self.gpRecomendaciones.getSelectionModel().getSelections();
			var mens = self.idioma.msgRDeletepreg1;
			if (per.length > 1) {
				mens = self.idioma.msgRDeletepreg2;
			}
			mostrarMensaje(2, mens, function (btnPresionado) {
				var res = new Array();
				for (i = 0; i<per.length; i++) {
					res.push(per[i].data.idaccidenterecomendacion);
				}
				if (btnPresionado == 'ok') {
					Ext.getBody().mask(self.idioma.msgDeleting);
					Ext.Ajax.request({
						url: 'deleteRecomendacion',
						params: {recomendaciones: Ext.encode(res)},
						callback: function () {
							Ext.getBody().unmask();
						},
						success: function (r) {
							var responseData = Ext.decode(r.responseText);
							if (responseData == false) {
								mens = self.idioma.msgRDeleteFail1;
								if (per.length > 1) {
									mens = self.idioma.msgRDeleteFail2;
								}
								mostrarMensaje(6, mens);
							} else {
								mens = self.idioma.msgRDeleteSucces1;
								if (per.length > 1) {
									mens = self.idioma.msgRDeleteSucces2;
								}
								mostrarMensaje(1, mens);
							}
							self.stRecomendaciones.reload();
							self.gpRecomendaciones.getSelectionModel().clearSelections();
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

        Pvd.SST.Gestionaraccidentes.PanelRecomendaciones.superclass.initComponent.call(this);
    }
});
