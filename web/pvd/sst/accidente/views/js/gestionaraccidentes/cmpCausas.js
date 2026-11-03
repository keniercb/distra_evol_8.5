/*
 * Componente Causas del accidente.
 *
 * @author Ing.Yaricel Guerra Velázquez
 * @package Pvd.SST
 * @uses Pvd.SST.Gestionaraccidentes
 * @copyright XETID
 * @version 1.0
 */
Ext.ns('Pvd.SST.Gestionaraccidentes');
Pvd.SST.Gestionaraccidentes.PanelCausas = Ext.extend(Ext.Panel, {
    layout: 'fit',
	border: false,
	id: 'PanelCausas',
	title: 'Causas',
	region: 'center',
	height: 500,
    initComponent: function() {
        var self = this;
		var objselect, accion;

		//Fuente de datos del listado de personas reserva.
		this.stCausas =new Ext.data.Store({
			url: 'getCausas',
			reader: new Ext.data.JsonReader(
				{root: "datos", id: "idaccidentecausa", totalProperty: "cantidad"},
				[
					{name:'idaccidentecausa'},
					{name:'idcausaaccidente'},
					{name:'denominacion'},
					{name:'descripcion'}, {name: 'principal'}]
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
			store: self.stCausas,
			emptyText: 'Criterio de búsqueda',
			toolTipTrigger1: self.idioma.lbBtnLimpiar,
			toolTipTrigger2: self.idioma.lbBtnBuscarCausa
		});

		this.smselect = new Ext.grid.CheckboxSelectionModel({
			singleSelect: false
		});

		this.expander = new Ext.grid.RowExpander({
			tpl: new Ext.Template(
				'<p><b>Descripci&oacute;n:</b> {descripcion}</p><br>'
			)
		});

		//Listado de causas.
		this.gpCausas = new Ext.grid.GridPanel({
			region: 'center',
			plugins: this.expander,
			border: false,
			store: self.stCausas,
			loadMask: {msg: 'Cargando...'},
			sm: this.smselect,
			columns: [this.expander,
				{
                    header: 'Denominaci&oacute;n',
                    width: 500,
                    dataIndex: 'denominacion',
                    align: 'left'
                }, {
                    header: 'Principal',
                    width: 60,
                    dataIndex: 'principal',
                    align: 'center', renderer: renderPrincipal
                }
			],
			bbar: new Ext.PagingToolbar({
				pageSize: 15,
				store: self.stCausas,
				displayInfo: true
			})
		});

        function renderPrincipal (val, metadata)
        {
            if (val == 1) {
                return '<span style="color: #33aa33;">' + '&#10004;' + '</span>';
            }
        }

		self.gpCausas.getSelectionModel().on('rowselect', function (s) {
			objselect = self.gpCausas.getSelectionModel().getSelected().data;
			if (self.gpCausas.getSelectionModel().getSelections().length > 1) {
				self.btnModificar.disable();
			} else {
				self.btnModificar.enable();
			}
			self.btnEliminar.enable();
		});

		self.gpCausas.getSelectionModel().on('rowdeselect', function () {
			if (self.gpCausas.getSelectionModel().getSelections().length == 1) {
				self.btnModificar.enable();
			} else if (self.gpCausas.getSelectionModel().getSelections().length == 0) {
				self.btnEliminar.disable();
			}
		});

		this.btnAdicionar = new Ext.Button({
			id: 'btnAdicionarCau',
			text: self.idioma.BtnAdicionar,
			disabled: true,
			hidden: true,
			tooltip: self.idioma.lbBtnAdicionarC,
			iconCls: 'adicionar',
			handler: function() {
				accion = 'add';
				self.windAdd.setTitle('Adicionar causa del accidente');
				self.windAdd.show();
				self.btnAplicar.show();
				self.tcbCausas.setValue('');
				self.tcbCausas.setRawValue('');
			}
		});

		this.btnModificar = new Ext.Button({
			id: 'btnModificarCau',
			text: self.idioma.BtnModificar,
			disabled: true,
			hidden: true,
			tooltip: self.idioma.lbBtnModificarC,
			iconCls: 'modificar',
			handler: function() {
				accion = 'mod';
				self.windAdd.setTitle('Modificar causa del accidente');
				self.windAdd.show();
				self.btnAplicar.hide();
				self.tcbCausas.setValue(objselect.idcausaaccidente);
				self.tcbCausas.setRawValue(objselect.denominacion);
				self.taDescripcion.setValue(objselect.descripcion);
			}
		});

		this.btnEliminar = new Ext.Button({
			id: 'btnEliminarCau',
			text: self.idioma.BtnEliminar,
			disabled: true,
			hidden: true,
			tooltip: self.idioma.lbBtnEliminarC,
			iconCls: 'eliminar',
			handler: function() {
				eliminar();
			}
		});

		this.tbar = [this.btnAdicionar, this.btnModificar, this.btnEliminar, 'Buscar causa: ', this.sfBuscar];

		this.items = [this.gpCausas];

		this.tlCausa = new Ext.tree.TreeLoader({
			dataUrl: 'getCausasAll',
			preloadChildren: false
		});

		this.tcbCausas = new Ext.components.TreeComboBox({
			anchor    : '98%',
			allowBlank: false,
			valueField: 'idcausaaccidente',
			hiddenName: 'idcausaaccidente',
			fieldLabel: 'Causa',
			emptyText : 'Seleccione...',
			id        : 'tcbCausas',
			treeConfig: {
				rootVisible: false,
				loader     : self.tlCausa,
				border     : false,
				autoScroll : true
			}
		});

		this.tcbCausas.tree.on('click', function (n)
		{
			if (n.attributes.leaf == true) {
			}  else {
				mostrarMensaje(6, 'Debe seleccionar una hoja del árbol.');
				self.tcbCausas.setValue('');
				self.tcbCausas.setRawValue('');
			}
		});

		this.taDescripcion = new Ext.form.TextArea({
			fieldLabel: 'Descripci&oacute;n',
			name: 'descripcion',
			anchor:	'99%',
			height: 100,
			hiddenname: 'descripcion',
			maxLength: 245,
			regex: /^([a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]+ ?[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]*[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]* ?[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ.,;:()_])+$/,
			maskRe: /^([a-z A-Z0-9áéíóúÁÉÍÓÚñÑ])$/,
			regexText: self.idioma.lbRegexTextDescripcion,
			allowBlank:	true
		});

		this.fpCausa = new Ext.FormPanel({
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
							items      : [this.tcbCausas]
						}, {
							columnWidth: 1.0,
							layout     : 'form',
							items      : [this.taDescripcion]
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

		this.btnAplicar = new Ext.Button({
			iconCls: 'aplicar',
			tooltip: self.idioma.textToolTipAplicar,
			text: self.idioma.lbtnAplicar,
			handler: function ()
			{
				guardar('APL');
			}
		});

		this.btnAceptar = new Ext.Button({
			iconCls: 'aceptar',
			tooltip: self.idioma.textToolTipAceptar,
			text: self.idioma.lbtnAceptar,
			handler: function() {
				guardar('ACP');
			}
		});

		this.windAdd = new Ext.Window({
			modal: true,
			closeAction: 'hide',
			constrain: true,
			resizable: false,
			layout: 'fit',
			width: 400,
			height: 260,
			items: [this.fpCausa],
			buttons: [
				this.btnCancelar,
				this.btnAplicar,
				this.btnAceptar
			],
			listeners: {
				'hide': function()
				{
					self.btnAdicionar.focus();
					self.fpCausa.getForm().reset();
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
				url: (accion == 'add')?'addCausa':'updateCausa',
				params: {
					idaccidentecausa: (accion == 'mod')?objselect.idaccidentecausa:-1,
					idaccidente: self.idaccidente,
					idcausaaccidente: self.tcbCausas.getValue(),
					descripcion: self.taDescripcion.getValue()
				},
				success: function (r){
					var responseData = Ext.decode(r.responseText);
					if (responseData == true) {
						if (accion == 'add') {
							mostrarMensaje(1, self.idioma.msgAddCSucces);
						} else {
							mostrarMensaje(1, self.idioma.msgModCSucces);
						}
						self.stCausas.reload();
						if (btn == 'ACP') {
							self.windAdd.hide();
						}
						self.fpCausa.getForm().reset();
						self.tcbCausas.setValue('');
						self.tcbCausas.setRawValue('');
					} else if (responseData == 2) {
						mostrarMensaje(6, 'La causa que desea seleccionar ya existe.');
					} else {
						mostrarMensaje(6, self.idioma.msgError);
					}
				}
			});
		}

		function eliminar() {
			var per = self.gpCausas.getSelectionModel().getSelections();
			var men = self.idioma.msgCDeletepreg1;
			if (per.length > 1) {
				men = self.idioma.msgCDeletepreg2;
			}
			mostrarMensaje(2, men, function (btnPresionado) {
				var res = new Array();
				for (i = 0; i<per.length; i++) {
					res.push(per[i].data.idaccidentecausa);
				}
				if (btnPresionado == 'ok') {
					Ext.getBody().mask(self.idioma.msgDeleting);
					Ext.Ajax.request({
						url: 'deleteCausa',
						params: {causas: Ext.encode(res)},
						callback: function () {
							Ext.getBody().unmask();
						},
						success: function (r) {
							var responseData = Ext.decode(r.responseText);
							if (responseData == true){
								men = self.idioma.msgCDeleteSucces1;
								if (per.length > 1) {
									men = self.idioma.msgCDeleteSucces2;
								}
								mostrarMensaje(1, men);
							} else {
								mostrarMensaje(6, 'Ocurri&oacute; un error mientras se eliminaban los datos.');
							}
							self.stCausas.reload();
							self.gpCausas.getSelectionModel().clearSelections();
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

        Pvd.SST.Gestionaraccidentes.PanelCausas.superclass.initComponent.call(this);
    }
});
