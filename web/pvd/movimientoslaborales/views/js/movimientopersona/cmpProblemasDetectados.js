/*
 * Componente Problemas detectados.
 *
 * @author Ing.Yaricel Guerra Velázquez
 * @package Pvd.Movimientoslaborales
 * @uses Pvd.Movimientoslaborales.GestMovLab.PanelProblemasDetectados
 * @copyright XETID
 * @version 1.0
 */
Ext.ns('Pvd.Movimientoslaborales.GestMovLab');
Pvd.Movimientoslaborales.GestMovLab.PanelProblemasDetectados = Ext.extend(Ext.Panel, {
    layout: 'fit',
	border: false,
	id: 'problemasdetectados',
	title: 'Problemas detectados',
	region: 'center',
	height: '100%',
    initComponent: function() {
        var self = this;
		var personselect;
		this.recordsLoaded = new Array();
		this.recQrElement = new Ext.data.Record.create(
			{name:'idpersona'},{name:'numid'}, {name:'nombreyapellidos'}, {name:'situacion'}, {name:'idsituacionlaboralp'}, {name:'cargo'},
			{name:'idcargo'}, {name:'idtipocontrato'}, {name:'tipocontrato'}, {name:'area'}, {name:'idarea'},
			{name:'identidad'}, {name:'entidad'}, {name:'fdesde'}, {name:'fhasta'}, {name:'problema'}
		);
		//Boton para modificar.
		this.btnModificar = new Ext.Button({
			id: 'btnUpdProb',
            hidden: true,
			text: self.idioma.BtnModificar,
			disabled: true,
			tooltip: self.idioma.lbBtnModificar,
			iconCls: 'modificar',
			handler: function ()
			{
				self.fireEvent('modsituacion', personselect);
			}.createDelegate(this)
		});

		//Boton para eliminar.
		this.btnEliminar = new Ext.Button({
			id: 'btnDelProb',
            hidden: true,
			text: self.idioma.BtnEliminar,
			disabled: true,
			tooltip: self.idioma.lbBtnEliminar,
			iconCls: 'eliminar',
			handler: function ()
			{
				var per = self.gpProblemas.getSelectionModel().getSelections();
				var res = new Array();
				for (i = 0; i<per.length; i++) {
					res.push(per[i].data.idsituacionlaboralp);
				}
				self.fireEvent('elimsituacion', res);
			}.createDelegate(this)
		});

		//Boton para declarar disponible.
		this.btnDisponible = new Ext.Button({
			id: 'btnDispProb',
			disabled: true,
			text: 'Disponible',
			hidden: true,
			tooltip: 'Disponible',
			//iconCls: 'salir',
			handler: function ()
			{
				self.fireEvent('decldisponible', personselect);
			}.createDelegate(this)
		});

		this.btnActualizar = new Ext.Button({
			iconCls: 'actualizar',
			//text: idioma.lbBtnUpdate,
			tooltip: 'Actualizar informaci&oacute;n <b>(Ctrl+Alt+Z)</b>',
			handler: function ()
			{
				self.stProblemas.reload();
			}.createDelegate(this)
		});

		this.btnMovimientoPD = new Ext.Button({
			id: 'btnMovimientoPD',
			//hidden: true,
			disabled: true,
			text: self.idioma.BtnMov,
			tooltip: self.idioma.msgMov,
			iconCls: 'movimiento'
		});

		this.btnBajaPD = new Ext.Button({
			id: 'btnBajaPD',
			//hidden: true,
			disabled: true,
			text: 'Baja',
			tooltip: self.idioma.msgdarBajatt,
			iconCls: 'darbaja'
		});

		var connObjProb = new Ext.data.Connection({
			timeout : 3600000,
			url: 'getProblemasDetectados',
			method : 'POST'
		});

		//Fuente de datos del listado de situaciones con problemas.
		this.stProblemas = new Ext.data.GroupingStore({
			proxy: new Ext.data.HttpProxy(connObjProb),
			reader: new Ext.data.JsonReader(
				{root: "", id: "idsituacionlaboralp"},
				[{name:'idpersona'},{name:'numid'}, {name:'nombreyapellidos'}, {name:'situacion'}, {name:'idsituacionlaboralp'}, {name:'cargo'},
					{name:'idcargo'}, {name:'idtipocontrato'}, {name:'tipocontrato'}, {name:'area'}, {name:'idarea'},
					{name:'identidad'}, {name:'entidad'}, {name:'fdesde'}, {name:'fhasta'}, {name:'problema'}]
			),
			sortInfo   : {
				field: 'problema',
				direction: "DESC"
			},
			groupField : 'problema',
            remoteGroup: true,
			listeners: {
				load: function(st, data) {
					if (data.length == 0) {
						mostrarMensaje(1, "No existen datos que mostrar.");
					} else {
						self.recordsLoaded = data;
					}
					self.btnMovimientoPD.disable();
					self.btnBajaPD.disable();
				}
			}
		});
		this.smselectPro = new Ext.grid.CheckboxSelectionModel({
			singleSelect: false,
			listeners: {
				selectionchange: function (sm) {
					if (sm.hasSelection()) {
						personselect = sm.selections.items[0].data;
						self.btnEliminar.enable();
						if (personselect.problema != "Persona eliminada"){
							self.btnModificar.enable();
							self.btnDisponible.enable();
							self.btnMovimientoPD.enable();
							self.btnBajaPD.enable();
						} else {
							self.btnModificar.disable();
							self.btnDisponible.disable();
							self.btnMovimientoPD.disable();
							self.btnBajaPD.disable();
						}
						if (sm.selections.items.length > 1) {
							self.btnModificar.disable();
							self.btnMovimientoPD.disable();
							self.btnBajaPD.disable();
						}
					} else {
						self.btnModificar.disable();
						self.btnEliminar.disable();
						self.btnDisponible.disable();
						self.btnMovimientoPD.disable();
						self.btnBajaPD.disable();
					}
				}.createDelegate(this)
			}
		});

		function mostrarTooltip(val, metaData) {
			metaData.attr = 'ext:qtip="Doble click para mostrar ficha de la persona."';
			return val;
		}

		this.expander = new Ext.grid.RowExpander({
			tpl : new Ext.Template(
				'<div><p><b>Tipo de contrato: </b>{tipocontrato}</p>' +
				'<p><b>Desde: </b>{fdesde}</p><p><b>Hasta: </b>{fhasta}</p></div>'
			)
		});

		//textfield para el buscar
		this.tfbuscar = new Ext.form.TextField({
			id: 'tfbuscar',
			allowBlank: true,
			emptyText: 'Criterio a buscar',
			minLength: 3,
            maxLength: 100,
			enableKeyEvents: true,
			maskRe: /^([a-zA-ZáéíóúñüÑ\d\s]+ ?[a-zA-ZáéíóúñüÑ\d\s]*)+$/,
			width: 200,
			name: 'tfbuscador'
		});

		//Boton para Buscar.
		this.btnBuscar = new Ext.Button({
			id: 'btnBuscar',
			text: '<u>B</u>uscar',
			tooltip: self. idioma.ttipBuscar,
			iconCls: 'buscar',
			handler: function ()
			{
				if (self.tfbuscar.getValue() != '') {
					buscarPersona();
				}
			}.createDelegate(this)
		});

		//Boton para limpiar.
		this.btnLimpiar = new Ext.Button({
			id: 'btnLimpiar',
			text: '<u>L</u>impiar',
			tooltip: self.idioma.ttipLimpiar,
			iconCls: 'limpiar',
			handler: function ()
			{
				if (self.tfbuscar.getValue() != '') {
					self.tfbuscar.reset();
					self.stProblemas.removeAll();
					self.stProblemas.add(self.recordsLoaded);
                    self.stProblemas.clearGrouping();
                    self.stProblemas.groupBy('problema');
				}
			}.createDelegate(this)
		});

		//Listado de situaciones con problemas..
		this.gpProblemas = new Ext.grid.GridPanel({
			region: 'center',
			tbar: ['Buscar persona: ', this.tfbuscar, '',
				this.btnBuscar,
				this.btnLimpiar],
			border: false,
			loadMask:{msg: 'Cargando...'},
			store: self.stProblemas,
			view: new Ext.grid.GroupingView({
				forceFit: true,
				startCollapsed: true,
				groupTextTpl: '{group} ({[values.rs.length]} {[values.rs.length > 1 ? "Personas" : "Persona"]})'
			}),
			autoScroll: true,
			plugins: this.expander,
			sm: this.smselectPro,
			columns: [this.smselectPro,this.expander,
				{
					header: self.idioma.lbNoIdentidad,
					width: 180,
					dataIndex: 'numid',
					renderer: mostrarTooltip
				},
				{
					header: self.idioma.lbApellidosyNombres,
					width: 250,
					dataIndex: 'nombreyapellidos',
					renderer: mostrarTooltip
				},
                {
                    header: 'Situación laboral',
                    width: 250,
                    dataIndex: 'situacion',
                    renderer: mostrarTooltip
                },
                {
                    header: 'Entidad',
                    width: 250,
                    dataIndex: 'entidad',
                    renderer: mostrarTooltip
                },
                {
                    header: '&Aacute;rea',
                    width: 250,
                    dataIndex: 'area',
                    renderer: mostrarTooltip
                },
                {
                    header: 'Cargo',
                    width: 250,
                    dataIndex: 'cargo',
                    renderer: mostrarTooltip
                },
				{
					width: 100,
					hidden: true,
					dataIndex: 'problema',
					renderer: mostrarTooltip
				}
			]
		});

		this.tbar = [this.btnModificar, this.btnEliminar, this.btnMovimientoPD, this.btnBajaPD, /*this.btnDisponible,*/ '->', this.btnActualizar];

		this.items = this.gpProblemas;
		
		this.keys = [
            {
                key: 'm',
                alt: true,
                fn: function () {
                    if (!self.btnModificar.disabled) {
                        self.btnModificar.handler();
                    }
                }
            },
			{
				key: 46,
				fn: function () {
					if (!self.btnEliminar.disabled) {
						self.btnEliminar.handler();
					}
				}
			}
        ];

		function buscarPersona() {
			var esta = false;
			var tVal = self.tfbuscar.getRawValue().toLowerCase();
			self.stProblemas.filterBy(
				function(rec) {
					var tStr =  rec.data.nombreyapellidos.toString().toLowerCase();
					var tStrnid =  rec.data.numid.toString();
					if (tStr.indexOf(tVal)!=-1 || tStrnid.indexOf(tVal)!=-1) {
						esta = true;
						return true;
					}
				}
			);
			if (esta==false) {
				mostrarMensaje(1, 'No existen resultados que coincidan con el criterio de búsqueda.');
			}
		}
        Pvd.Movimientoslaborales.GestMovLab.PanelProblemasDetectados.superclass.initComponent.call(this);
    }
});
