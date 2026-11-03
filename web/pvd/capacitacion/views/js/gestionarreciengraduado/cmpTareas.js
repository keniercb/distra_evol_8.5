/*
 * Componente Tareas.
 *
 * @author Ing.Yaricel Guerra Velázquez
 * @package Pvd.Capacitacion
 * @uses Pvd.Capacitacion.Gestionarreciengraduado
 * @copyright XETID
 * @version 1.0
 */
Ext.ns('Pvd.Capacitacion.Gestionaraccidentes');
Pvd.Capacitacion.Gestionaraccidentes.PanelTareas = Ext.extend(Ext.Panel, {
    layout: 'fit',
	border: false,
	id: 'PanelTareas',
	title: 'Tareas',
	region: 'center',
	height: 500,
    initComponent: function() {
        var self = this;
		var objselect, accion;

		//Fuente de datos del listado de Tareas
		this.stTareas =new Ext.data.Store({
			url: 'getTareas',
			reader: new Ext.data.JsonReader(
				{root: "datos", id: "idrgtarea", totalProperty: "cantidad"},
				[{name:'idrgtarea'},{name:'tarea'},{name:'fregistro'}]
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
			store: self.stTareas,
			emptyText: 'Criterio de búsqueda',
			toolTipTrigger1: self.idioma.lbBtnLimpiar,
			toolTipTrigger2: self.idioma.lbBtnBuscarTar
		});

		this.smselect = new Ext.grid.CheckboxSelectionModel({
			singleSelect: false
		});

		function mostrartt(val, metaData, record) {
			metaData.attr = 'ext:qtip='+'"'+record.get('tarea')+'"';
			return val;
		}

		//Listado de Tareas.
		this.gpTareas = new Ext.grid.GridPanel({
			region: 'center',
			border: false,
			store: self.stTareas,
			loadMask: {msg: 'Cargando...'},
			sm: this.smselect,
			columns: [this.smselect,
				{
					header: 'Tarea',
					width: 400,
					dataIndex: 'tarea',
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

		self.gpTareas.getSelectionModel().on('rowselect', function (s) {
			objselect = self.gpTareas.getSelectionModel().getSelected().data;
			if (self.gpTareas.getSelectionModel().getSelections().length > 1) {
				self.btnModificar.disable();
			} else {
				self.btnModificar.enable();
			}
			self.btnEliminar.enable();
		});

		self.gpTareas.getSelectionModel().on('rowdeselect', function () {
			if (self.gpTareas.getSelectionModel().getSelections().length == 1) {
				self.btnModificar.enable();
			} else if (self.gpTareas.getSelectionModel().getSelections().length == 0) {
				self.btnEliminar.disable();
				self.btnModificar.disable();
			}
		});

		this.btnAdicionar = new Ext.Button({
			id: 'btnAdicionarTar',
			text: self.idioma.BtnAdicionar,
			//disabled: true,
			tooltip: self.idioma.lbBtnAdicionarTar,
			iconCls: 'adicionar',
			handler: function() {
				accion = 'add';
				self.windCon.setTitle('Adicionar tarea');
				self.windCon.show();
				self.btnAplicar.show();
			}
		});

		//Boton para modificar.
		this.btnModificar = new Ext.Button({
			id: 'btnModificarTar',
			text: self.idioma.BtnModificar,
			disabled: true,
			tooltip: self.idioma.lbBtnModificarTar,
			iconCls: 'modificar',
			handler: function() {
				accion = 'mod';
				self.windCon.setTitle('Modificar tarea');
				self.windCon.show();
				self.btnAplicar.hide();
				self.taCon.setValue(objselect.tarea);
			}
		});

		this.btnEliminar = new Ext.Button({
			id: 'btnEliminarTar',
			text: self.idioma.BtnEliminar,
			disabled: true,
			tooltip: self.idioma.lbBtnEliminarTar,
			iconCls: 'eliminar',
			handler: function() {
				eliminar();
			}
		});

		this.tbar = [this.btnAdicionar, this.btnModificar, this.btnEliminar, '-', 'Buscar tarea: ', this.sfBuscar];

		this.items = [this.gpTareas];

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
			fieldLabel: 'tarea',
			name: 'tarea',
			anchor: '100%',
			height: 140,
			hiddenname: 'tarea',
			allowBlank: false
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
			title:  'Adicionar tarea',
			modal: true,
			closeAction: 'hide',
			resizable: false,
			width: 370,
			height: 250,
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
				url: (accion == 'add')?'addTarea':'updateTarea',
				params: {
					idrgtarea: (accion == 'mod')?objselect.idrgtarea:-1,
					idreciengraduado: self.idreciengraduado,
					tarea: self.taCon.getValue()
				},
				success: function (r){
					var responseData = Ext.decode(r.responseText);
					if (responseData == 1) {
						if (accion == 'add') {
							mostrarMensaje(1, self.idioma.msgAddTSucces);
						} else {
							mostrarMensaje(1, self.idioma.msgModTSucces);
						}
					} else {
						mostrarMensaje(6, self.idioma.msgError);
					}
					if (btn == 'ACP') {
						self.windCon.hide();
					}
					self.fReg.getForm().reset();
					self.stTareas.reload();
				}
			});
		}

		function eliminar() {
			var per = self.gpTareas.getSelectionModel().getSelections();
			var mens = self.idioma.msgTDeletepreg1;
			if (per.length > 1) {
				mens = self.idioma.msgTDeletepreg2;
			}
			mostrarMensaje(2, mens, function (btnPresionado) {
				var res = new Array();
				for (i = 0; i<per.length; i++) {
					res.push(per[i].data.idrgtarea);
				}
				if (btnPresionado == 'ok') {
					Ext.getBody().mask(self.idioma.lbTitMsgEliminando);
					Ext.Ajax.request({
						url: 'deleteTarea',
						params: {tareas: Ext.encode(res)},
						callback: function () {
							Ext.getBody().unmask();
						},
						success: function (r) {
							var responseData = Ext.decode(r.responseText);
							if (responseData == false) {
								mens = self.idioma.msgTDeleteFail1;
								if (per.length > 1) {
									mens = self.idioma.msgTDeleteFail2;
								}
								mostrarMensaje(6, mens);
							} else {
								mens = self.idioma.msgTDeleteSucces1;
								if (per.length > 1) {
									mens = self.idioma.msgTDeleteSucces2;
								}
								mostrarMensaje(1, mens);
							}
							self.stTareas.reload();
							self.gpTareas.getSelectionModel().clearSelections();
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

        Pvd.Capacitacion.Gestionaraccidentes.PanelTareas.superclass.initComponent.call(this);
    }
});
