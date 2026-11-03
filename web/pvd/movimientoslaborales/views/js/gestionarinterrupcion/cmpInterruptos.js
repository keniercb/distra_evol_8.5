/*
 * Componente Interruptos.
 *
 * @author Ing.Yaricel Guerra Velázquez
 * @package Pvd.Movimientoslaborales
 * @uses Pvd.Movimientoslaborales
 * @copyright XETID
 * @version 1.0
 */
Ext.ns('Pvd.Movimientoslaborales');
Pvd.Movimientoslaborales.PanelInterruptos = Ext.extend(Ext.Panel, {
    layout: 'fit',
	border: false,
	id: 'PanelInterruptos',
	title: 'Interruptos',
	region: 'center',
	height: 500,
    initComponent: function() {
        var self = this;
		var objselect;
		var accion;

		//Fuente de datos del listado de personas interruptos.
		this.stInterruptos =new Ext.data.Store({
			url: 'getInterruptos',
			reader: new Ext.data.JsonReader(
				{root: "datos", id: "idinterrupto", totalProperty: "cantidad"},
				[{name:'idinterrupto'},{name:'idpersona'},{name:'numid'}, {name:'nombreyapellidos'}, {name:'cargo'},
				 {name:'idcargo'}, {name: 'reubicado'}, {name:'area'}, {name:'idarea'},{name:'identidad'},
				 {name:'entidad_area'}, {name: 'fdesde'}, {name: 'fhasta'}, {name: 'horas'},
				 {name: 'idsituacionlaboralp'},{name: 'idsituacionint'}, {name: 'situacionactual'},
				 {name: 'idcausanoreubicado'}, {name: 'causanoreubicado'}]
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
			store: self.stInterruptos,
			emptyText: 'Criterio de búsqueda',
			toolTipTrigger1: self.idioma.lbBtnLimpiar,
			toolTipTrigger2: self.idioma.lbBtnBuscarI
		});

		this.smselect = new Ext.grid.CheckboxSelectionModel({
			singleSelect: false
		});

		this.btnAdicionar = new Ext.Button({
			id: 'btnAdicionarInt',
			text: self.idioma.BtnAdicionar,
			disabled: true,
			tooltip: self.idioma.lbBtnAdicionarI,
			iconCls: 'adicionar',
			handler: function() {
				accion = 'add';
                self.windAdd.setTitle('Adicionar interrupto');
				self.windAdd.show();
				self.dfFDesdeInt.setValue(self.fdesde);
                self.dfFHastaInt.setValue(self.fhasta);
                self.tfHoraInt.setValue(self.horas);
				self.cbSituacionactual.reset();
				self.cbCausasnoreubicacion.reset();
                self.gpPersonasAll.enable();
			}
		});

        this.btnModificar = new Ext.Button({
            id: 'btnModificarInt',
            text: self.idioma.BtnModificar,
            disabled: true,
            tooltip: self.idioma.lbBtnModificarI,
            iconCls: 'modificar',
            handler: function () {
                accion = 'mod';
                self.windAdd.setTitle('Modificar interrupto');
                self.windAdd.show();
                self.dfFDesdeInt.setValue(objselect.fdesde);
                self.dfFHastaInt.setValue(objselect.fhasta);
                self.tfHoraInt.setValue(objselect.horas);
				self.cbSituacionactual.setValue(objselect.idsituacionint);
				if (objselect.idsituacionint < 4) {
					Ext.getCmp('colcausanoreub').hide();
					self.cbCausasnoreubicacion.reset();
				} else {
					Ext.getCmp('colcausanoreub').show();
					self.cbCausasnoreubicacion.setValue(objselect.idcausanoreubicado);
				}
                self.gpPersonasAll.disable();
            }
        });

		this.btnEliminar = new Ext.Button({
			id: 'btnEliminar',
			text: self.idioma.BtnEliminar,
			disabled: true,
			tooltip: self.idioma.lbBtnEliminarI,
			iconCls: 'eliminar',
			handler: function() {
				eliminar();
			}
		});

		//Listado de INTERRUPTOS.
		this.gpInterruptos = new Ext.grid.EditorGridPanel({
			tbar: [this.btnAdicionar, this.btnModificar, this.btnEliminar, '-', 'Buscar interrupto: ', this.sfBuscar],
			region: 'west',
			clicksToEdit: 1,
			plugins: this.expanderfall,
			width: '100%',
			border: false,
			store: self.stInterruptos,
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
					width: 300,
					dataIndex: 'nombreyapellidos',
					align: 'left'
				},{
					header: 'Cargo',
					width: 250,
					dataIndex: 'cargo',
					align: 'left'
				},{
					header: 'Situación actual',
					width: 250,
					dataIndex: 'situacionactual',
					align: 'left'
				}/*, {
                    header: 'Ubicaci&oacute;n',
                    width: 250,
                    dataIndex: 'reubicado',
                    align: 'left',
					renderer: function (val) {
						if (val == 1) {
							return "Reubicado en labores de restablecimiento";
						} else if (val == 2) {
							return "Reubicado en otro cargo";
						} else {
							return "Sin reubicar";
						}
					}
                }*/, {
                    header: 'Desde',
                    width: 80,
                    dataIndex: 'fdesde',
                    align: 'left'
                }, {
                    header: 'Hasta',
                    width: 80,
                    dataIndex: 'fhasta',
                    align: 'left'
                }, {
                    header: 'Horas',
                    width: 80,
                    dataIndex: 'horas',
                    align: 'left'
                }
			],
			bbar: new Ext.PagingToolbar({
				pageSize: 15,
				store: self.stInterruptos,
				displayInfo: true
			})
		});

		self.gpInterruptos.getSelectionModel().on('rowselect', function (s) {			
			self.btnEliminar.enable();
            self.btnModificar.enable();
			if (self.gpInterruptos.getSelectionModel().getSelections().length == 1) {
				objselect = self.gpInterruptos.getSelectionModel().getSelected().data;
			}
		});

		self.gpInterruptos.getSelectionModel().on('rowdeselect', function () {
			if (self.gpInterruptos.getSelectionModel().getSelections().length == 0) {
				self.btnEliminar.disable();
                self.btnModificar.disable();
			}
			if (self.gpInterruptos.getSelectionModel().getSelections().length == 1) {
				objselect = self.gpInterruptos.getSelectionModel().getSelected().data;
			}
		});

		this.items = [this.gpInterruptos];


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
				[{name:'idpersona'}, {name: 'idsituacionlaboralp'}, {name:'numid'}, {name:'nombreyapellidos'}, {name:'idcargo'},
				 {name:'cargo'}, {name:'entidad_area'}, {name:'orden'}]
			),
			sortInfo   : {
				field: 'orden',
				direction: "DESC"
			},
			groupField : 'entidad_area',
			remoteGroup: true
		});

		this.sfBuscarPerAct = new Ext.app.SearchField({
			store: self.stPersonasAll,
			emptyText: 'Criterio de búsqueda',
			toolTipTrigger1: self.idioma.lbBtnLimpiar,
			toolTipTrigger2: self.idioma.lbBtnBuscarI
		});

		//Listado de personas.
		this.gpPersonasAll = new Ext.grid.GridPanel({
			region: 'center',
			clicksToEdit: 1,
			width: 580,
			height: 270,
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
					width: 300,
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
        var fecha = new Date();
        this.dfFDesdeInt = new Ext.form.DateField({
            id: 'dfFDesdeInt',
            fieldLabel: 'Fecha inicio',
            name: 'fdesde',
            hiddenname: 'fdesde',
            value: fecha.format('d/m/Y'),
            anchor: '98%',
            format: 'd/m/Y',
            editable: false,
            allowBlank: false,
            readOnly: false,
            maxValue: '31/12/2100',
            minValue: '01/01/1900',
            vtype: 'daterange'
        });

        this.dfFHastaInt = new Ext.form.DateField({
            id: 'dfFHastaInt',
            fieldLabel: 'Fecha fin',
            name: 'fhasta',
            hiddenname: 'fhasta',
            anchor: '98%',
            format: 'd/m/Y',
            allowBlank: true,
            editable: false,
            readOnly: false,
            maxValue: '31/12/2100',
            minValue: '01/01/1900',
            startDateField: 'dfFDesdeInt',
            vtype: 'daterange'
        });

        this.tfHoraInt = new Ext.form.NumberField({
            fieldLabel: 'Horas',
            allowBlank: true,
            maxLength: 100,
            enableKeyEvents: true,
            anchor: '99%',
            name: 'horas'
        });

		this.chbReubicado = new Ext.form.Checkbox({
			id            : 'chbReubicado',
			boxLabel      : 'Reubicado en labores de restablecimiento',
			hidden        : false,
			labelSeparator: '',
			name          : 'reubicado',
			anchor        : '98%'
		});

		this.stSituacionactual = new Ext.data.Store({
			url: 'getSituaciones',
			reader: new Ext.data.JsonReader(
				{root: "", id: "idsituacionint"},
				[{name:'idsituacionint'},{name:'denominacion'}, {name:'descripcion'}]
			)
		});

		this.stSituacionactual.load();

		this.stCausasnoreubicacion = new Ext.data.Store({
			url: 'getCausasnoreubicar',
			reader: new Ext.data.JsonReader(
				{root: "", id: "idcausanoreubicado"},
				[{name:'idcausanoreubicado'},{name:'denominacion'}, {name:'descripcion'}]
			)
		});

		this.stCausasnoreubicacion.load();

		this.cbSituacionactual = new Ext.form.ComboBox({
			store: this.stSituacionactual,
			fieldLabel: 'Situación actual',
			anchor: '98%',
			height: 100,
			hiddenName:'idsituacionint',
			displayField: 'denominacion',
			valueField: 'idsituacionint',
			typeAhead: true,
			allowBlank: false,
			mode: 'local',
			triggerAction: 'all',
			selectOnFocus: true,
			readOnly: true,
			tpl:'<tpl for="."><div ext:qtip="<b>{denominacion}</b></br>{descripcion}" class="x-combo-list-item">{denominacion}</div></tpl>',
			listeners: {
				select: function() {
					if (self.cbSituacionactual.getValue() < 4) {
						Ext.getCmp('colcausanoreub').hide();
					} else {
						Ext.getCmp('colcausanoreub').show();
					}
				}
			}
		});

		this.cbCausasnoreubicacion = new Ext.form.ComboBox({
			store: this.stCausasnoreubicacion,
			fieldLabel: 'Causa de no reubicación',
			anchor: '98%',
			height: 100,
			hiddenName:'idcausanoreubicado',
			displayField: 'denominacion',
			valueField: 'idcausanoreubicado',
			typeAhead: true,
			allowBlank: true,
			mode: 'local',
			triggerAction: 'all',
			selectOnFocus: true,
			readOnly: true,
			tpl:'<tpl for="."><div ext:qtip="<b>{denominacion}</b></br>{descripcion}" class="x-combo-list-item">{denominacion}</div></tpl>'
		});

       
		this.fpAddInt = new Ext.FormPanel({
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
						}, {
                            columnWidth: 0.4,
                            layout: 'form',
                            items: [this.dfFDesdeInt]
                        }, {
                            columnWidth: 0.4,
                            layout: 'form',
                            items: [this.dfFHastaInt]
                        }, {
                            columnWidth: 0.2,
                            layout: 'form',
                            items: [this.tfHoraInt]
                        }, {
                            columnWidth: 0.5,
                            layout: 'form',
                            items: [this.cbSituacionactual]
                        }, {
							columnWidth: 0.5,
							id: 'colcausanoreub',
							layout: 'form',
							items: [this.cbCausasnoreubicacion]
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
			title: 'Adicionar interrupto',
			modal: true,
			closeAction: 'hide',
			constrain: true,
			resizable: true,
			layout: 'fit',
			width: 620,
			height: 450,
			items: [this.fpAddInt],
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
            var res = new Array();
            if (accion == 'add') {
                for (i = 0; i < per.length; i++) {
                    res.push(per[i].data.idsituacionlaboralp);
                }
			} else {
                res.push(self.gpInterruptos.getSelectionModel().getSelected().data.idsituacionlaboralp);
			}
			if (res.length > 0) {
				PVD.mostrarMascara('mascaraEnviarDatos', 'Información', 'Enviando datos...');
				Ext.Ajax.request({
					url: (accion == 'add')?'addInterrupto': 'updInterrupto',
					method: 'POST',
					params: {
						idinterrupcion: self.idinterrupcion,
                        idinterrupto: (accion == 'mod')? self.gpInterruptos.getSelectionModel().getSelected().data.idinterrupto:null,
						fdesde: self.dfFDesdeInt.getRawValue(),
						fhasta: self.dfFHastaInt.getRawValue(),
						horas: self.tfHoraInt.getValue(),
						idsituacionint: self.cbSituacionactual.getValue(),
						idcausanoreubicado: self.cbCausasnoreubicacion.getValue(),
						reubicado: (self.cbSituacionactual <= 3) ? 1 : 3,
						interruptos: Ext.encode(res)
					},
					callback: function (options, success, response) {
						PVD.ocultarMascara('mascaraEnviarDatos');
						var responseData = Ext.decode(response.responseText);
						if (responseData == true) {
							if (accion == 'add') {
                                mostrarMensaje(1, self.idioma.msgAddInteSucces);
							} else {
                                mostrarMensaje(1, 'El interrupto ha sido modificado satisfactoriamente.');
							}

							self.stInterruptos.removeAll();
							self.stInterruptos.reload();
							self.windAdd.hide();
						} else if (responseData == 2) {
							if (per.length == 1) {
								mostrarMensaje(6, 'La persona seleccionada ya existe.');
							} else {
								mostrarMensaje(6, 'Alguna de las personas seleccionadas ya existe.');
							}
						} else {
                            mostrarMensaje(6, 'Ha ocurrido un error mientras se guardaban los datos.');
						}
					}
				});
			} else {
				mostrarMensaje(6, 'Debe seleccionar al menos una persona.');
			}
		}

		function eliminar() {
			var per = self.gpInterruptos.getSelectionModel().getSelections();
			var men = self.idioma.msgIntDeletepreg1;
			if (per.length > 1) {
				men = self.idioma.msgIntDeletepreg2;
			}
			mostrarMensaje(2, men, function (btnPresionado) {
				var res = new Array();
				for (i = 0; i<per.length; i++) {
					res.push(per[i].data.idinterrupto);
				}
				if (btnPresionado == 'ok') {
					Ext.getBody().mask(self.idioma.msgDeleting);
					Ext.Ajax.request({
						url: 'deleteInterrupto',
						params: {interruptos: Ext.encode(res)},
						callback: function () {
							Ext.getBody().unmask();
						},
						success: function (r) {
							var responseData = Ext.decode(r.responseText);
							if (responseData == true) {
								men = self.idioma.msgIDeleteSucces1;
								if (per.length > 1) {
									men = self.idioma.msgIDeleteSucces2;
								}
								mostrarMensaje(1, men);
							} else {
								mostrarMensaje(6, 'Ocurri&oacute; un error mientras se eliminaban los datos.');
							}
							self.stInterruptos.reload();
							self.gpInterruptos.getSelectionModel().clearSelections();
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

        Pvd.Movimientoslaborales.PanelInterruptos.superclass.initComponent.call(this);
    }
});
