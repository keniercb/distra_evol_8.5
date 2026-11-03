/*
 * Gestionar procesos de idoneidad.
 *
 * @author Ing.Yaricel Guerra Velázquez
 * @package Pvd.Idoneidad
 * @uses Pvd.Idoneidad.Procesoidoneidad
 * @copyright XETID
 * @version 1.0
 */
Ext.ns('Pvd.Idoneidad.Procesoidoneidad');
Pvd.Idoneidad.Procesoidoneidad.PanelMiembros = Ext.extend(Ext.Panel, {
    layout: 'border',
	border: false,
	id: 'PanelMiembros',
	title: 'Trabajadores',
	region: 'south',
	height: 300,
    initComponent: function() {
        var self = this;
		var objselect;
		var accion;

		//Fuente de datos del listado de personas implicadas en el proceso.
		this.stImplicados =new Ext.data.Store({
			url: 'getMiembros',
			reader: new Ext.data.JsonReader(
				{root: "datos", id: "idpersonaproceso", totalProperty: "cantidad"},
				[{name:'idpersonaproceso'},{name:'idpersona'},{name:'numid'}, {name:'nombreyapellidos'}, {name:'cargo'},
				 {name:'idcargo'}, {name:'area'}, {name:'idarea'},{name:'identidad'}, {name:'entidad_area'}, {name:'idoneo'}]
			),
			listeners: {
				load: function(st, data) {
					self.btnEliminar.disable();
					self.btnAdicionarR.disable();
                    self.btnModificarR.disable();
                    self.btnEliminarR.disable();
                    self.stRecomendaciones.removeAll();
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
			store: self.stImplicados,
			emptyText: 'Criterio de búsqueda',
			toolTipTrigger1: 'Limpiar campos <b>(Alt+L)</b>',
			toolTipTrigger2: 'Buscar trabajador <b>(Alt+B)</b>'
		});

		this.smselect = new Ext.grid.CheckboxSelectionModel({
			singleSelect: false
		});

		this.btnAdicionar = new Ext.Button({
			id: 'btnAdicionarImp',
			text: self.idioma.BtnAdicionar,
			disabled: true,
			tooltip: self.idioma.lbBtnAdicionart,
			iconCls: 'adicionar',
			handler: function() {
				self.windAdd.show();
			}
		});

		this.btnEliminar = new Ext.Button({
			id: 'btnEliminar',
			text: self.idioma.BtnEliminar,
			disabled: true,
			tooltip: self.idioma.lbBtnEliminart,
			iconCls: 'eliminar',
			handler: function() {
				eliminar();
			}
		});

		this.chbIdoneo = new Ext.form.ComboBox({
			name: 'listo',
			hideOnSelect: false,
			anchor: '98%',
			width: 100,
			mode: 'local',
			editable: false,
			hiddenName: 'listo',
			triggerAction: 'all',
			emptyText: 'Seleccione...',
			store: new Ext.data.SimpleStore({
				fields: ['valor', 'listo'],
				data: [
					['SI', 1],
					['NO', 0]
				]
			}),
			valueField: 'listo',
			displayField: 'valor',
			listeners: {
				select: function(cb, rec) {
					Ext.getBody().mask('Guardando datos...');
					Ext.Ajax.request({
						url: 'updateIdoneidad',
						params: {
							idpersonaproceso: objselect.idpersonaproceso,
							idoneo: cb.getValue()
						},
						callback: function () {
							Ext.getBody().unmask();
						},
						success: function (r){
							var responseData = Ext.decode(r.responseText);
							mostrarMensaje(1, 'Los datos fueron actualizados satisfactoriamente.');
							self.stImplicados.reload();
						}
					});
				}
			}
		});

		//Listado de IMPLICADOS.
		this.gpImplicados = new Ext.grid.EditorGridPanel({
			tbar: [this.btnAdicionar, this.btnEliminar, '-', 'Buscar trabajador: ', this.sfBuscar],
			region: 'west',
			clicksToEdit: 1,
			width: '50%',
			border: false,
			store: self.stImplicados,
			loadMask: {msg: 'Cargando...'},
			sm: this.smselect,
			columns: [
				{
					header: 'No. de identidad',
					width: 90,
					dataIndex: 'numid',
					align: 'left'
				},{
					header: 'Nombre y apellidos',
					width: 180,
					dataIndex: 'nombreyapellidos',
					align: 'left'
				},{
					header: 'Cargo',
					width: 300,
					dataIndex: 'cargo',
					align: 'left'
				},{
					header: 'Idoneo',
					id: 'clmidoneo',
					width: 130,
					dataIndex: 'idoneo',
					align: 'left',
					renderer: function (val) {
						if(val == true) {
							return '<span style="color: #33aa33;">' + '&#10004;' + '</span>';
						} else if (val == 0) {
							return '<span style="color: #aa2113;">' + '&#10005;' + '</span>';
						}
					},
					editor: this.chbIdoneo
				}
			],
			bbar: new Ext.PagingToolbar({
				pageSize: 15,
				store: self.stImplicados,
				displayInfo: true
			})
		});

		self.gpImplicados.getSelectionModel().on('rowselect', function (s) {
			objselect = self.gpImplicados.getSelectionModel().getSelected().data;
			self.btnEliminar.enable();
			self.btnAdicionarR.enable();
			self.stRecomendaciones.baseParams.idpersonaproceso = objselect.idpersonaproceso;
			self.stRecomendaciones.load({params: {start: 0, limit: 15}});
		});

		self.gpImplicados.getSelectionModel().on('rowdeselect', function () {
			if (self.gpImplicados.getSelectionModel().getSelections().length == 0) {
				self.btnEliminar.disable();
			}
		});

		this.stRecomendaciones = new Ext.data.Store({
			url: 'getRecomendaciones',
			reader: new Ext.data.JsonReader(
				{root: "datos", id: "idpersonarecomendacion", totalProperty: "cantidad"},
				[{name:'idpersonarecomendacion'}, {name:'idpersonaproceso'}, {name:'recomendacion'}]
			),
			listeners: {
				load: function(st, data) {
					self.btnEliminarR.disable();
					self.btnModificarR.disable();
					if (data.length == 0) {
						if (self.sfBuscar.getValue() == '') {
							mostrarMensaje(1, "No existen datos que mostrar.");
						}
					}
				}
			}
		});

		//Expander
		this.expander = new Ext.grid.RowExpander({
			tpl: new Ext.Template(
				'<p><b>Descripci&oacute;n:</b> {descripcion}</p><br>'
			)
		});

		//Botón para adicionar.
		this.btnAdicionarR = new Ext.Button({
			text: this.idioma.BtnAdicionar,
			disabled: true,
			tooltip: this.idioma.lbBtnAdicionarr,
			iconCls: 'adicionar',
			handler: function ()
			{
				self.winRec.setTitle('Adicionar recomendaci&oacute;n');
				self.winRec.show();
				self.btnAplicarR.show();
				self.formularioGestion.getForm().reset();
				accion = 'add';
			}.createDelegate(this)
		});

		//Boton para modificar.
		this.btnModificarR = new Ext.Button({
			text: this.idioma.BtnModificar,
			disabled: true,
			tooltip: this.idioma.lbBtnModificarr,
			iconCls: 'modificar',
			handler: function ()
			{
				self.winRec.setTitle('Modificar recomendaci&oacute;n');
				self.winRec.show();
				self.btnAplicarR.hide();
				var objrecR = self.gpRecomendacion.getSelectionModel().getSelected().data;
				self.tarecomendacion.setValue(objrecR.recomendacion);
				accion = 'mod';
			}.createDelegate(this)
		});

		//Botón para eliminar.
		this.btnEliminarR = new Ext.Button({
			text: this.idioma.BtnEliminar,
			disabled: true,
			tooltip: this.idioma.lbBtnEliminarr,
			iconCls: 'eliminar',
			handler: function ()
			{
				eliminarRec();
			}.createDelegate(this)
		});

		//Listado de partes del cuerpo.
		this.gpRecomendacion = new Ext.grid.GridPanel({
			store: this.stRecomendaciones,
			tbar: [this.btnAdicionarR, this.btnModificarR, this.btnEliminarR],
			width: '50%',
			height: 400,
			region: 'center',
			loadMask:{msg: 'Cargando...'},
			columns: [
				{
					header: 'Recomendaci&oacute;n',
					width:500,
					dataIndex: 'recomendacion'
				}

			],
			bbar: new Ext.PagingToolbar({
				pageSize: 15,
				store: this.stRecomendaciones,
				displayInfo: true
			})
		});

		self.gpRecomendacion.getSelectionModel().on('rowselect', function () {
			self.btnEliminarR.enable();
			self.btnModificarR.enable();
		});

		this.items = [this.gpImplicados, this.gpRecomendacion];
		
		// Area de texto recomendacion
		this.tarecomendacion = new Ext.form.TextArea({
			fieldLabel: 'Recomendaci&oacute;n',
			name: 'recomendacion',
			anchor:	'99%',
			height: 100,
			hiddenname: 'recomendacion',
			maxLength: 255,
			regex: /^([a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]+ ?[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]*[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]* ?[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ.,;:()_])+$/,
			maskRe: /^([a-z A-Z0-9áéíóúÁÉÍÓÚñÑ])$/,
			allowBlank:	false
		});

		//Formulario de gestion.
		this.formularioGestion = new Ext.FormPanel({
			labelAlign: 'top',
			frame:true,
			bodyStyle:'padding:5px 5px 0',
			items: [{
				layout: 'column',
				items: [
					{
						columnWidth:1.0,
						layout: 'form',
						items: [this.tarecomendacion]
					}]
			}]
		});

		this.btnCancelarR = new Ext.Button({
			iconCls: 'cancelar',
			text: this.idioma.textbtnCancelar,
			tooltip: this.idioma.textToolTipCancelar,
			handler: function() {
				self.winRec.hide();
			}
		});

		this.btnAplicarR = new Ext.Button({
			iconCls: 'aplicar',
			text: this.idioma.btnAplicar,
			tooltip: this.idioma.textToolTipAplicar,
			handler: function ()
			{
				guardarRec('APL');
			}.createDelegate(this)
		});

		this.btnAceptarR = new Ext.Button({
			iconCls: 'aceptar',
			text: this.idioma.btnAceptar,
			tooltip: this.idioma.textToolTipAceptar,
			handler: function() {
				guardarRec('ACP');
			}
		});

		this.winRec = new Ext.Window({
			width: 450,
			height: 210,
			constrain:true,
			layout: 'fit',
			closable: true,
			resizable: false,
			closeAction: 'hide',
			items: [this.formularioGestion],
			modal: true,
			buttons: [this.btnCancelarR, this.btnAplicarR, this.btnAceptarR],
			keys: [{
				key: 'x',
				alt: true,
				stopEvent: true,
				fn: function () {
					if (!self.btnCancelarR.disabled) {
						self.btnCancelarR.handler();
					}
				}
			},{
				key: 13,
				stopEvent: true,
				fn: function () {
					if (!self.btnAceptarR.disabled) {
						self.btnAceptarR.handler();
					}
				}
			}]
		});

		this.smselectt = new Ext.grid.CheckboxSelectionModel({
			singleSelect: false
		});

		//Fuente de datos del listado de personas.
		var connObjPer = new Ext.data.Connection({
			timeout : 3600000,
			url: 'getPersonasAll',
			method : 'POST'
		});

		this.stPersonasAll = new Ext.data.GroupingStore({
			proxy: new Ext.data.HttpProxy(connObjPer),
			reader: new Ext.data.JsonReader(
				{root: "datos", id: "idpersona", totalProperty: "cantidad"},
				[{name:'idpersona'}, {name:'numid'}, {name:'nombreyapellidos'}, {name:'idcargo'},
				 {name:'cargo'}, {name:'denominacion'}, {name:'entidad_area'}]
			),
			sortInfo   : {
				field: 'entidad_area',
				direction: "DESC"
			},
			groupField : 'entidad_area',
			remoteGroup: true
		});		

		this.sfBuscarPerAct = new Ext.app.SearchField({
			store: self.stPersonasAll,
			emptyText: 'Criterio de búsqueda',
			toolTipTrigger1: 'Limpiar campos <b>(Alt+L)</b>',
			toolTipTrigger2: 'Buscar persona <b>(Alt+B)</b>'
		});

		//Listado de personas.
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
			text: this.idioma.textbtnCancelar,
			tooltip: this.idioma.textToolTipCancelar,
			handler: function() {
				self.windAdd.hide();
			}
		});

		this.btnAceptar = new Ext.Button({
			iconCls: 'aceptar',
			text: this.idioma.btnAceptar,
			tooltip: this.idioma.textToolTipAceptar,
			handler: function() {
				guardarDatos();
			}
		});

		this.windAdd = new Ext.Window({
			title: 'Adicionar trabajador',
			modal: true,
			closeAction: 'hide',
			constrain: true,
			resizable: false,
			layout: 'fit',
			width: 620,
			height: 535,
			items: [this.gpPersonasAll],
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
					url: 'addPersona',
					method: 'POST',
					params: {
						idproceso: self.idproceso,
						personas: Ext.encode(res)
					},
					callback: function (options, success, response) {
						PVD.ocultarMascara('mascaraEnviarDatos');
						var responseData = Ext.decode(response.responseText);
						if (responseData == true) {
							mostrarMensaje(1, 'Los datos fueron guardados satisfactoriamente.');
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

		function guardarRec(boton) {
			PVD.mostrarMascara('mascaraEnviarDatos', 'Información', 'Enviando datos...');
			Ext.Ajax.request({
				url: (accion == 'add')?'addRec':'updateRec',
				method: 'POST',
				params: {
					idpersonarecomendacion: (accion == 'add')?'-1': self.gpRecomendacion.getSelectionModel().getSelected().data.idpersonarecomendacion,
					idpersonaproceso: objselect.idpersonaproceso,
					recomendacion: self.tarecomendacion.getValue()
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
					self.stRecomendaciones.removeAll();
					self.stRecomendaciones.reload();
					self.formularioGestion.getForm().reset();
					if (boton == 'ACP'){
						self.winRec.hide();
					}
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
					res.push(per[i].data.idpersonaproceso);
				}
				if (btnPresionado == 'ok') {
					Ext.getBody().mask(self.idioma.msgDeleting);
					Ext.Ajax.request({
						url: 'deletePersona',
						params: {personas: Ext.encode(res)},
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

		function eliminarRec() {
			var rec = self.gpRecomendacion.getSelectionModel().getSelections();
			var men = self.idioma.msgRDeletepreg1;
			if (rec.length > 1) {
				men = self.idioma.msgRDeletepreg2;
			}
			mostrarMensaje(2, men, function (btnPresionado) {
				var res = new Array();
				for (i = 0; i<rec.length; i++) {
					res.push(rec[i].data.idpersonarecomendacion);
				}
				if (btnPresionado == 'ok') {
					Ext.getBody().mask(self.idioma.msgDeleting);
					Ext.Ajax.request({
						url: 'deleteRec',
						params: {recomendaciones: Ext.encode(res)},
						callback: function () {
							Ext.getBody().unmask();
						},
						success: function (r) {
							var responseData = Ext.decode(r.responseText);
							if (responseData == true) {
								men = self.idioma.msgRDeleteSucces1;
								if (rec.length > 1) {
									men = self.idioma.msgRDeleteSucces2;
								}
								mostrarMensaje(1, men);
							} else {
								mostrarMensaje(6, 'Ocurri&oacute; un error mientras se eliminaban los datos.');
							}
							self.stRecomendaciones.reload();
						}
					});
				}
			});
		}

		this.keys = [
			{
				key: 'b',
				alt: true,
				stopEvent: true,
				fn: function () {
					if (!self.sfBuscar.getValue() != '') {
						self.sfBuscar.onTrigger2Click();
					}
					if (!self.sfBuscarPerAct.getValue() != '') {
						self.sfBuscarPerAct.onTrigger2Click();
					}
				}
			},
			{
				key: 'l',
				alt: true,
				stopEvent: true,
				fn: function () {
					if (!self.sfBuscar.getValue() != '') {
						self.sfBuscar.onTrigger1Click();
					}
					if (!self.sfBuscarPerAct.getValue() != '') {
						self.sfBuscarPerAct.onTrigger1Click();
					}
				}
			}];

        Pvd.Idoneidad.Procesoidoneidad.PanelMiembros.superclass.initComponent.call(this);
    }
});
