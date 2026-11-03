/**
 Uso:Componente para realizar la busqueda de personas en el sistema SIATCO.

 * ---------------------------------------------

 * 13 de Diciembre 2011 |   Persona
 *

 * @extends Ext.Panel
 * @xtype
 * @autor   Linea Capital Humano - Ing. Yoan Uría Rodríguez
 * @version 1.0.0
 */
Ext.ns('Ext.pvd.persona.buscarpersona');
Ext.QuickTips.init();

Ext.pvd.persona.buscarpersona.panelBuscarpersona = Ext.extend(Ext.Panel, {
	region: (this.region ? this.region : 'center'),
	layout: (this.layout ? this.layout : 'border'),
	frame: false,
	border: false,
	seguridad: (this.seguridad ? this.seguridad : -1),
	hideBorders: true,
	singleSelect: (this.hasOwnProperty('singleSelect') ? _this.singleSelect : 'true'),
	initComponent: function () {
		var _this = this;
		this.seleccion = null;
		var idCmp = this.id;
		//this.cantidadPorPaginas = 20;
		this.btnAyuda = new Ext.Button({
			id: 'btnAyudaTP' + idCmp,
			text: 'Ayuda',
			icon: perfil.dirImg + 'ayuda.png',
			iconCls: 'btn',
			tooltip: 'Mostrar ayuda de la funcionalidad',
			handler: function () {
				var title = 'Ayuda de buscar persona';
				var referencia = 'persona/registro/buscarpersonaantex';
				help.show(title, referencia);
			}
		});

		this.tfbuscar = new Ext.form.TextField({
			id: 'tfbuscar' + idCmp,
			allowBlank: true,
			minLength: 3,
			enableKeyEvents: true,
			regexp: /^([a-z0-9A-ZáéíóúñüÑ\d\s]+ ?[a-z0-9A-ZáéíóúñüÑ\d\s]*)+$/,
			width: 160,
			emptyText: 'Criterio a buscar',
			name: 'tfbuscador',
			listeners: {
				specialkey: function (t, e) {
					if (e.keyCode == 13) _this.Buscar();
				}
			}
		});

		this.btnAdicionar = new Ext.Button({
			hidden: (this.showBtnAdicionar ? !this.showBtnAdicionar : true),
			id: 'btnAdicionar' + idCmp,
			icon: perfil.dirImg + 'adicionar.png',
			iconCls: 'btn',
			text: 'Ad<u>i</u>cionar',
			tooltip: 'Adicionar persona <b>(Alt+I)</b>',
			handler: function () {
				var win = new Ext.pvd.persona.buscarpersona.winAdicionarpersonaAntex();
				win.show();
			}
		});

		this.btnBuscar = new Ext.Button({
			disabled: false,
			id: 'btnBuscar' + idCmp,
			icon: perfil.dirImg + 'buscar.png',
			iconCls: 'btn',
			text: '<u>B</u>uscar',
			tooltip: 'Buscar personas <b>(Alt+B)</b>',
			handler: function () {
				_this.Buscar();
			}
		});

		this.btnBuscarAvanzado = new Ext.Button({
			disabled: false,
			id: 'btnBuscarAvanzado' + idCmp,
			icon: perfil.dirImg + 'buscaravanzada.png',
			iconCls: 'btn',
			text: 'B&uacute;s<u>q</u>ueda avanzada',
			tooltip: 'B&uacute;squeda avanzada de personas (<b>Atl+Q</b>)',
			handler: function () {
				_this.winBuscarAvanzado.show();
			}
		});

		this.tfBuscarnoidentidad = new Ext.form.TextField({
			id: 'tfBuscarnoidentidad' + idCmp,
			fieldLabel: 'No. de identidad',
			allowBlank: true,
			maxLength: 20,
			nextTab: 'tfBuscarnombre' + idCmp,
			prevTab: 'btnAceptarBusqueda' + idCmp,
			blankText: 'Este campo es obligatorio',
			maskRe: /^([a-z0-9A-ZáéíóúñüÑ\d]+ ?[a-z0-9A-ZáéíóúñüÑ\d]*)+$/,
			anchor: '90%',
			name: 'bnumid'
		});

		this.tfBuscarnombre = new Ext.form.TextField({
			id: 'tfBuscarnombre' + idCmp,
			maxLength: 50,
			fieldLabel: 'Nombre',
			nextTab: 'cbBuscartiponoidentidad' + idCmp,
			prevTab: 'tfBuscarnoidentidad' + idCmp,
			name: 'bnombre',
			allowBlank: true,
			anchor: '90%',
			msgTarget: 'qtip',
			maskRe: /^([a-zA-ZÁÉÍÓÚáéíóúñüÑ]+ ?[a-zA-ZÁÉÍÓÚáéíóúñüÑ ]*)+$/,
			blankText: 'Este campo es obligatorio'
		});

		this.tfBuscarsnombre = new Ext.form.TextField({
			maxLength: 50,
			fieldLabel: 'Seguno nombre',
			id: 'tfBuscarsnombre' + idCmp,
			name: 'bsnombre',
			nextTab: 'cbBuscarsexo' + idCmp,
			prevTab: 'cbBuscartiponoidentidad' + idCmp,
			allowBlank: true,
			maskRe: /^([a-zA-ZÁÉÍÓÚáéíóúñüÑ ]+ ?[a-zA-ZÁÉÍÓÚáéíóúñüÑ ]*)+$/,
			msgTarget: 'qtip',
			anchor: '90%',
			blankText: 'Este campo es obligatorio'
		});

		this.tfBuscarpapellido = new Ext.form.TextField({
			fieldLabel: 'Primer apellido',
			id: 'tfBuscarpapellido' + idCmp,
			name: 'bpapel',
			nextTab: 'cbBuscarcategoria' + idCmp,
			prevTab: 'cbBuscarsexo' + idCmp,
			maxLength: 50,
			allowBlank: true,
			maskRe: /^([a-zA-ZÁÉÍÓÚáéíóúñüÑ ]+ ?[a-zA-ZÁÉÍÓÚáéíóúñüÑ ]*)+$/,
			msgTarget: 'qtip',
			anchor: '90%',
			blankText: 'Este campo es obligatorio'
		});

		this.tfBuscarsapellido = new Ext.form.TextField({
			maxLength: 50,
			fieldLabel: 'Segundo apellido',
			id: 'tfBuscarsapellido' + idCmp,
			name: 'bsapel',
			nextTab: 'btnCancelarBusqueda' + idCmp,
			prevTab: 'cbBuscarcategoria' + idCmp,
			allowBlank: true,
			maskRe: /^([a-zA-ZÁÉÍÓÚáéíóúñüÑ ]+ ?[a-zA-ZÁÉÍÓÚáéíóúñüÑ ]*)+$/,
			msgTarget: 'qtip',
			anchor: '90%',
			blankText: 'Este campo es obligatorio'
		});

		this.stBuscartiponoidentidad = new Ext.data.Store({
			url: '/pvd/comun/index.php/buscarpersonaantexcomp/cargarcombotiponoidentidad',
			reader: new Ext.data.JsonReader({
				root: 'datos',
				totalProperty: 'cant',
				id: "idtipodocidentidad"
			}, [
				{name: 'idtipodocidentidad'},
				{name: 'denom'},
				{name: 'cantcaracteres'},
				{name: 'alfanumerico'}
			]),
			listeners: {
				load: function () {
					_this.cbBuscartiponoidentidad.enable();
				}
			}
		});

		this.cbBuscartiponoidentidad = new Ext.form.ComboBox({
			id: 'cbBuscartiponoidentidad' + idCmp,
			store: this.stBuscartiponoidentidad,
			tpl: '<tpl for="."><div ext:qtip="<p><b>{denom}</b></p>{denom}" class="x-combo-list-item">{denom}</div></tpl>',
			fieldLabel: 'Tipo de identidad',
			displayField: 'denom',
			hiddenName: 'idtipodocidentidad',
			valueField: 'idtipodocidentidad',
			mode: 'local',
			nextTab: 'tfBuscarsnombre' + idCmp,
			prevTab: 'tfBuscarnombre' + idCmp,
			typeAhead: true,
			triggerAction: 'all',
			forceSelection: true,
			emptyText: 'Seleccione...',
			editable: false,
			allowBlank: true,
			selectOnFocus: true,
			anchor: '90%',
			msgTarget: 'qtip',
			blankText: 'Este campo es obligatorio',
			disabled: true
		});

		this.stBuscarsexo = new Ext.data.Store({
			url: '/pvd/comun/index.php/buscarpersonaantexcomp/cargarcombosexo',
			reader: new Ext.data.JsonReader({
				root: 'datos',
				totalProperty: 'cant',
				id: "idsexo"
			}, [
				{name: 'idsexo'},
				{name: 'denom'}
			]),
			listeners: {
				load: function () {
					_this.cbBuscarsexo.enable();
				}
			}
		});

		this.cbBuscarsexo = new Ext.form.ComboBox({
			id: 'cbBuscarsexo' + idCmp,
			store: this.stBuscarsexo,
			tpl: '<tpl for="."><div ext:qtip="<p><b>{denom}</b></p>{denom}" class="x-combo-list-item">{denom}</div></tpl>',
			fieldLabel: 'Sexo',
			displayField: 'denom',
			hiddenName: 'idsexo',
			valueField: 'idsexo',
			nextTab: 'tfBuscarpapellido' + idCmp,
			prevTab: 'tfBuscarsnombre' + idCmp,
			mode: 'local',
			typeAhead: true,
			triggerAction: 'all',
			forceSelection: true,
			emptyText: 'Seleccione...',
			editable: false,
			allowBlank: true,
			selectOnFocus: true,
			anchor: '90%',
			msgTarget: 'qtip',
			blankText: 'Este campo es obligatorio',
			disabled: true
		});

		this.stBuscarcategoria = new Ext.data.Store({
			url: '/pvd/comun/index.php/buscarpersonaantexcomp/cargarcombocategoria',
			reader: new Ext.data.JsonReader({
				root: 'datos',
				totalProperty: 'cant',
				id: "idcategoriapersona"
			}, [
				{
					name: 'idcategoriapersona'
				},
				{
					name: 'denom'
				}
			]),
			listeners: {
				load: function () {
					_this.cbBuscarcategoria.enable();
				}
			}
		});

		this.cbBuscarcategoria = new Ext.form.ComboBox({
			id: 'cbBuscarcategoria' + idCmp,
			tpl: '<tpl for="."><div ext:qtip="<p><b>{denom}</b></p>{denom}" class="x-combo-list-item">{denom}</div></tpl>',
			store: this.stBuscarcategoria,
			fieldLabel: 'Categor&iacute;a',
			displayField: 'denom',
			hiddenName: 'idcategoriapersona',
			valueField: 'idcategoriapersona',
			mode: 'local',
			typeAhead: true,
			triggerAction: 'all',
			forceSelection: true,
			emptyText: 'Seleccione...',
			editable: false,
			allowBlank: true,
			selectOnFocus: true,
			anchor: '90%',
			msgTarget: 'qtip',
			nextTab: 'tfBuscarsapellido' + idCmp,
			prevTab: 'tfBuscarpapellido' + idCmp,
			blankText: 'Este campo es obligatorio',
			disabled: true
		});

		this.fpBuscarAvanzado = new Ext.FormPanel({
			id: 'fpBuscarAvanzado' + idCmp,
			labelAlign: 'top',
			frame: true,
			labelWidth: 50,
			items: [
				{
					layout: 'column',
					border: false,
					items: [
						{
							xtype: 'fieldset',
							id: 'fieldsetBuscar' + idCmp,
							columnWidth: 1,
							bodyStyle: 'padding: 15px 0px 0px 15px',
							width: 370,
							style: '-moz-border-radius:5px',
							height: 250,
							layout: 'column',
							items: [
								{
									columnWidth: .5,
									layout: 'form',
									border: false,
									items: [this.tfBuscarnoidentidad, this.cbBuscartiponoidentidad, this.cbBuscarsexo, this.cbBuscarcategoria]
								},
								{
									columnWidth: .5,
									layout: 'form',
									border: false,
									items: [this.tfBuscarnombre, this.tfBuscarsnombre, this.tfBuscarpapellido, this.tfBuscarsapellido]
								}
							]
						}
					]
				}
			]
		});

		this.primeraves = 1;
		this.winBuscarAvanzado = new Ext.Window({
			plain: true,
			title: 'B&uacute;squeda avanzada',
			closeAction: 'hide',
			modal: true,
			frame: true,
			width: 370,
			height: 310,
			items: [this.fpBuscarAvanzado],
			listeners: {
				show: function () {
					if (_this.primeraves == 1) {
						_this.stBuscarsexo.load();
						_this.stBuscartiponoidentidad.load();
						_this.stBuscarcategoria.load();
						_this.primeraves = 0;
					}
					_this.tfBuscarnoidentidad.focus(true, 300);
				}
			},
			buttons: [
				{
					text: 'Cancelar',
					id: 'btnCancelarBusqueda' + idCmp,
					iconCls: 'btn',
					icon: perfil.dirImg + 'cancelar.png',
					nextTab: 'btnLimpiarBusqueda' + idCmp,
					prevTab: 'tfBuscarsapellido' + idCmp,
					tooltip: 'Cerrar ventana sin buscar las personas',
					handler: function () {
						_this.winBuscarAvanzado.hide();
						_this.LimpiarComponenteBuscar();
					}
				},
				{
					text: 'Limpiar',
					iconCls: 'btn',
					icon: perfil.dirImg + 'limpiar.png',
					tooltip: 'Limpiar filtros',
					nextTab: 'btnAceptarBusqueda' + idCmp,
					prevTab: 'btnCancelarBusqueda' + idCmp,
					id: 'btnLimpiarBusqueda' + idCmp,
					handler: function () {
						_this.LimpiarComponenteBuscar();
					}
				},
				{
					text: 'Aceptar',
					iconCls: 'btn',
					nextTab: 'tfBuscarnoidentidad' + idCmp,
					prevTab: 'btnLimpiarBusqueda' + idCmp,
					icon: perfil.dirImg + 'aceptar.png',
					tooltip: 'B&uacute;squeda avanzada de personas',
					id: 'btnAceptarBusqueda' + idCmp,
					handler: function () {
						var persona = {
							numid: _this.tfBuscarnoidentidad.getValue(),
							tipoidentidad: _this.cbBuscartiponoidentidad.getValue(),
							idsexo: _this.cbBuscarsexo.getValue(),
							idcategoriapersona: _this.cbBuscarcategoria.getValue(),
							nombre: _this.tfBuscarnombre.getValue(),
							snombre: _this.tfBuscarsnombre.getValue(),
							primerapellido: _this.tfBuscarpapellido.getValue(),
							segundoapellido: _this.tfBuscarsapellido.getValue(),
						}
						_this.fbuscarpersonacomp(persona);
						_this.winBuscarAvanzado.hide();
						_this.LimpiarComponenteBuscar();
					}
				}
			]
		});

		this.recPersonas = [
			{name: 'idpersona'},
			{name: 'numid'},
			{name: 'nombre'},
			{    name: 'snombre'},
			{name: 'papel'},
			{name: 'sapel'},
			{name: 'idsexo'},
			{name: 'idcategoriapersona'},
			{name: 'idtipodocidentidad'},
			{name: 'tipodocidentidad'},
			{name: 'idpersonaidentidad'},
			{name: 'idfoto'},
			{name: 'extension'},
			{name: 'idusuario'},
			{name: 'nombreusuario'},
			{name: 'idviaentrada'}
		];
		this.stpersonabuscar = new Ext.data.Store({
			url: '/pvd/comun/index.php/buscarpersonaantexcomp/cargarpersona',
			baseParams: {tipobusqueda: 1, texto: '', persona: new Array(), seguridad: this.seguridad},
			reader: new Ext.data.JsonReader({
				root: 'datos',
				id: 'idpersona',
				totalProperty: 'cant'
			}, this.recPersonas)
		});

		this.smpersonas = new Ext.grid.CheckboxSelectionModel({
			singleSelect: _this.singleSelect,
			listeners: {
				rowselect: function (sm, indiceFila, record) {
					_this.seleccion = record;
				},
				selectionchange: function (defsm) {
					if (defsm.getSelected() != null) {
						_this.fireEvent('personaselecionada', defsm.getSelected());
						_this.seleccion = defsm.getSelected();
					} else {
						_this.fireEvent('personanoselecionada');
						_this.seleccion = null;
					}
				}
			}
		});

		this.pgtbBuscarpersona = new Ext.PagingToolbar({
			pageSize: _this.cantidadPorPaginas,
			store: this.stpersonabuscar,
			emptyMsg: '0 Resultados para mostrar',
			displayInfo: true,
			displayMsg: 'Resultados del {0} - {1} de {2}'
		});

		this.gpPersonabuscar = new Ext.grid.GridPanel({
			id: 'gpPersonabuscar' + idCmp,
			region: 'center',
			store: this.stpersonabuscar,
			frame: false,
			border: false,
			hideBorders: true,
			loadMask: 'Cargando...',
			stripeRows: true,
			enableColumnMove: false,
			sm: this.smpersonas,
			columns: [this.smpersonas, {
				hidden: true,
				hideable: false,
				dataIndex: 'idpersona'
			}, new Ext.grid.RowNumberer(), {
				header: 'No. de identidad',
				width: 100,
				dataIndex: 'numid', menuDisabled: true
			}, {
				header: 'Nombre',
				width: 110,
				dataIndex: 'nombre', menuDisabled: true
			}, {
				header: 'Segundo nombre',
				width: 110,
				dataIndex: 'snombre', menuDisabled: true
			}, {
				header: 'Primer apellido',
				width: 110,
				dataIndex: 'papel', menuDisabled: true
			}, {
				header: 'Segundo apellido',
				width: 110,
				dataIndex: 'sapel', menuDisabled: true
			}, {
				header: 'Id sexo',
				hidden: true,
				width: 100,
				dataIndex: 'idsexo', menuDisabled: true
			}, {
				header: 'Id Categoria Persona',
				hidden: true,
				width: 100,
				dataIndex: 'idcategoriapersona', menuDisabled: true
			}, {
				header: 'Id Tipo Doc Identidad',
				hidden: true,
				width: 100,
				dataIndex: 'idtipodocidentidad', menuDisabled: true
			}, {
				header: 'Tipo Doc Identidad',
				hidden: true,
				width: 100,
				dataIndex: 'tipodocidentidad', menuDisabled: true
			}, {
				header: 'Id Persona Identidad',
				hidden: true,
				width: 100,
				dataIndex: 'idpersonaidentidad', menuDisabled: true
			}, {
				hidden: true,
				hideable: false,
				dataIndex: 'version', menuDisabled: true
			}, {
				hidden: true,
				hideable: false,
				dataIndex: 'idfoto', menuDisabled: true
			}, {
				hidden: true,
				hideable: false,
				dataIndex: 'extension', menuDisabled: true
			}, {
				hidden: true,
				hideable: false,
				dataIndex: 'idusuario', menuDisabled: true
			}, {
				hidden: true,
				hideable: false,
				dataIndex: 'nombreusuario', menuDisabled: true
			}],
			viewConfig: {
				forceFit: true
			},
			bbar: _this.pgtbBuscarpersona,
			tbar: [this.btnAdicionar, 'Buscar persona: ', '', this.tfbuscar, ' ', this.btnBuscar, '', this.btnBuscarAvanzado, '->', this.btnAyuda],
			listeners: {
				render: function (grid) {
					_this.cantidadPorPaginas = (_this.cantidadPorPaginas) ? _this.cantidadPorPaginas : Math.floor(grid.container.getBox().height / 20) - 5;
					_this.pgtbBuscarpersona.pageSize = _this.cantidadPorPaginas;
					_this.stpersonabuscar.load({params: {start: 0, limit: _this.cantidadPorPaginas}});
				}
			}
		});

		this.Buscar = function () {
			if (_this.tfbuscar.getValue()) {
				if (_this.tfbuscar.isValid()) {
					_this.stpersonabuscar.baseParams.tipobusqueda = 1;
					_this.stpersonabuscar.baseParams.texto = _this.tfbuscar.getValue();
					_this.stpersonabuscar.baseParams.persona = '';
					_this.stpersonabuscar.baseParams.seguridad = _this.seguridad;
					_this.stpersonabuscar.load({params: {start: 0, limit: _this.cantidadPorPaginas}});
				}
			}
			else {
				_this.stpersonabuscar.baseParams.persona = '';
				_this.stpersonabuscar.baseParams.texto = '';
				_this.stpersonabuscar.baseParams.seguridad = _this.seguridad;
				_this.stpersonabuscar.load({params: { start: 0, limit: _this.cantidadPorPaginas}});
			}
		}

		this.LimpiarComponenteBuscar = function () {
			this.fpBuscarAvanzado.getForm().reset();
		}

		this.fbuscarpersonacomp = function (persona) {
			_this.stpersonabuscar.baseParams.persona = Ext.encode(persona);
			_this.stpersonabuscar.baseParams.texto = '';
			_this.stpersonabuscar.baseParams.tipobusqueda = 2;
			_this.stpersonabuscar.baseParams.seguridad = _this.seguridad;
			_this.stpersonabuscar.load({params: {start: 0, limit: _this.cantidadPorPaginas}});
		}

		this.items = [this.gpPersonabuscar];
		Ext.pvd.persona.buscarpersona.panelBuscarpersona.superclass.initComponent.call(this);
		_this.tfbuscar.focus(true, 500);
	},

	getSeleccion: function () {
		return this.seleccion;
	},

	limipiarSeleccion: function () {
		this.smpersonas.clearSelections();
	},

	//This function returns array of selected records.
	getSelectedRows: function () {
		return this.smpersonas.getSelections();
	}

});

/*Formulario de Datos fijos de la persona aplicado a la personalizacion del sistema de Antex*/
Ext.pvd.persona.buscarpersona.panelAdicionarpersonaAntex = Ext.extend(Ext.FormPanel, {
	layout: 'form',
	title: 'Datos generales',
	frame: true,
	labelAlign: 'top',
	trackResetOnLoad: true,
	height: 180,
	bodyStyle: 'padding: 3px 0px 0px 5px',
	width: '100%',

	initComponent: function () {
		var self = this;
		var nombrefoto;
		var maximizarimg = new Ext.Button({
			disabled: false,
			id: 'maximizarimg',
			icon: perfil.dirImg + 'mostrar.png',
			iconCls: 'btn',
			tooltip: 'Maximizar imagen',
			handler: function () {
				VentanaFotoMax();
			}
		});

		this.cambiarimg = new Ext.Button({
			disabled: false,
			id: 'self.cambiarimg',
			icon: perfil.dirImg + 'cambiar.png',
			iconCls: 'btn',
			tooltip: 'Cambiar imagen',
			handler: function () {
				winFoto.show();
			}
		});

		this.pfoto = new Ext.Panel({
			width: 100,
			height: 100,
			border: true,
			autoShow: true,
			listeners: {
				render: function (p) {
					//self.pfoto.getEl().on('click', function(e,t,o){VentanaFotoMax();});
				}
			}
		});

		this.tfnombre = new Ext.form.TextField({
			id: 'self.tfnombre',
			nextTab: 'self.tfsnombre',
			prevTab: 'btnAceptar',
			maxLength: 50,
			//maxLengthText: perfil.etiquetas.lbMaxlengNombre,
			fieldLabel: 'Nombre',//perfil.etiquetas.lbTextFieldNombre,
			name: 'nombre',
			//style : 'text-transform: capitalize',
			allowBlank: false,
			anchor: '90%',
			msgTarget: 'qtip',
			maskRe: /^([a-zA-ZÁÉÍÓÚáéíóúñüÑ]+ ?[a-zA-ZÁÉÍÓÚáéíóúñüÑ ]*)+$/,
			regex: /^([a-zA-ZÁÉÍÓÚáéíóúñüÑ]+ ?[a-zA-ZÁÉÍÓÚáéíóúñüÑ ]*)+$/,
			// regexText : perfil.etiquetas.lbInvalidNombre,
			blankText: 'Este campo es obligatorio.'
		});

		//Primer apellido
		this.tfpapellido = new Ext.form.TextField({
			fieldLabel: 'Primer apellido',//perfil.etiquetas.lbTextFieldPApellido,
			id: 'self.tfpapellido',
			name: 'papel',
			nextTab: 'self.tfsapellido',
			prevTab: 'self.tfsnombre',
			maxLength: 50,
			//maxLengthText: perfil.etiquetas.lbMaxlengNombre,
			//style : 'text-transform: capitalize',
			allowBlank: false,
			maskRe: /^([a-zA-ZÁÉÍÓÚáéíóúñüÑ ]+ ?[a-zA-ZÁÉÍÓÚáéíóúñüÑ ]*)+$/,
			regex: /^([a-zA-ZÁÉÍÓÚáéíóúñüÑ ]+ ?[a-zA-ZÁÉÍÓÚáéíóúñüÑ ]*)+$/,
			//regexText : perfil.etiquetas.lbInvalidSegNombre,
			msgTarget: 'qtip',
			anchor: '90%',
			blankText: 'Este campo es obligatorio.',
			//listeners : { change : function() {cambio = 1; cambioadd = 1;} }
		});

		//Segundo apellido
		this.tfsapellido = new Ext.form.TextField({
			maxLength: 50,
			//maxLengthText: perfil.etiquetas.lbMaxlengNombre,
			fieldLabel: 'Segundo apellido',//perfil.etiquetas.lbTextFieldSApellido,
			id: 'self.tfsapellido',
			name: 'sapel',
			nextTab: 'self.cbtiponoidentidad',
			prevTab: 'self.tfpapellido',
			//style : 'text-transform: capitalize',
			allowBlank: false,
			maskRe: /^([a-zA-ZÁÉÍÓÚáéíóúñüÑ ]+ ?[a-zA-ZÁÉÍÓÚáéíóúñüÑ ]*)+$/,
			regex: /^([a-zA-ZÁÉÍÓÚáéíóúñüÑ ]+ ?[a-zA-ZÁÉÍÓÚáéíóúñüÑ ]*)+$/,
			//regexText : perfil.etiquetas.lbInvalidSegNombre,
			msgTarget: 'qtip',
			anchor: '90%',
			blankText: 'Este campo es obligatorio.',
			//listeners : {change : function() {cambio = 1; cambioadd = 1;}}
		});

		/*Segundo nombre*/
		this.tfsnombre = new Ext.form.TextField({
			maxLength: 50,
			//maxLengthText: perfil.etiquetas.lbMaxlengNombre,
			fieldLabel: 'Segundo nombre',//perfil.etiquetas.lbTextFieldSNombre,
			id: 'self.tfsnombre',
			name: 'snombre',
			nextTab: 'self.tfpapellido',
			prevTab: 'self.tfnombre',
			//style : 'text-transform: capitalize',
			allowBlank: true,
			maskRe: /^([a-zA-ZÁÉÍÓÚáéíóúñüÑ ]+ ?[a-zA-ZÁÉÍÓÚáéíóúñüÑ ]*)+$/,
			regex: /^([a-zA-ZÁÉÍÓÚáéíóúñüÑ ]+ ?[a-zA-ZÁÉÍÓÚáéíóúñüÑ ]*)+$/,
			//regexText : perfil.etiquetas.lbInvalidSegNombre,
			msgTarget: 'qtip',
			anchor: '90%',
			blankText: 'Este campo es obligatorio.',
			//listeners : { change : function() {cambio = 1; cambioadd = 1;} }
		});

		/*Numero de identidad*/
		this.tfnoidentidad = new Ext.form.TextField({
			id: 'self.tfnoidentidad',
			nextTab: 'self.cbsexo',
			prevTab: 'self.cbtiponoidentidad',
			fieldLabel: 'No. de identidad',//perfil.etiquetas.lbTextFieldCarnet,
			allowBlank: false,
			maxLength: 11,
			blankText: 'Este campo es obligatorio.',
			maskRe: /^([a-zA-Z\d]+ ?[a-zA-Z\d]*)+$/,
			anchor: '90%',
			name: 'numid',
			//listeners : {change : function() {cambio = 1; cambioadd = 1;}}
		});

		/*Sexo de la persona*/
		var stsexo = new Ext.data.Store({
			url: '/pvd/comun/index.php/buscarpersonaantexcomp/cargarcombosexo',
			reader: new Ext.data.JsonReader({
				root: 'datos',
				totalProperty: 'cant',
				id: "idsexo"
			}, [
				{name: 'idsexo'},
				{name: 'denom'}
			]),
		});
		stsexo.load();

		//combo sexo
		this.cbsexo = new Ext.form.ComboBox({
			id: 'self.cbsexo',
			nextTab: 'self.cbcategoria',
			prevTab: 'self.tfnoidentidad',
			store: stsexo,
			fieldLabel: 'Sexo',//perfil.etiquetas.lbComboSexo,
			displayField: 'denom',
			hiddenName: 'idsexo',
			valueField: 'idsexo',
			mode: 'local',
			tpl: '<tpl for="."><div ext:qtip="{denom}" class="x-combo-list-item">{denom}</div></tpl>',
			typeAhead: true,
			triggerAction: 'all',
			forceSelection: true,
			emptyText: 'Seleccione...',
			editable: false,
			allowBlank: false,
			selectOnFocus: true,
			anchor: '90%',
			msgTarget: 'qtip',
			blankText: 'Este campo es obligatorio.',
			listeners: {
				//change : function() {cambio = 1; cambioadd = 1;}
			}
		})

		var stcategoria = new Ext.data.Store({
			url: '/pvd/comun/index.php/buscarpersonaantexcomp/cargarcombocategoria',
			reader: new Ext.data.JsonReader({
				root: 'datos',
				totalProperty: 'cant',
				id: "idcategoriapersona"
			}, [
				{
					name: 'idcategoriapersona'
				},
				{
					name: 'denom'
				},
				{
					name: 'codigo'
				}
			]),
		});
		stcategoria.load();

		//combo categoria
		this.cbcategoria = new Ext.form.ComboBox({
			id: 'self.cbcategoria',
			nextTab: 'triggerFieldSituacion',
			prevTab: 'self.cbsexo',
			store: stcategoria,
			fieldLabel: 'Categoría',//perfil.etiquetas.lbComboCategoria,
			displayField: 'denom',
			tpl: '<tpl for="."><div ext:qtip="{denom}" class="x-combo-list-item">{denom}</div></tpl>',
			hiddenName: 'idcategoria',
			valueField: 'idcategoriapersona',
			mode: 'local',
			name: 'idcategoriapersona',
			typeAhead: true,
			triggerAction: 'all',
			forceSelection: true,
			emptyText: 'Seleccione...',
			editable: true,
			allowBlank: false,
			selectOnFocus: true,
			anchor: '90%',
			msgTarget: 'qtip',
			blankText: 'Este campo es obligatorio.',
			enableKeyEvents: true,
			listeners: {
				//change : function() {cambio = 1; cambioadd = 1;}
			}
		});

		this.sttiponoidentidad = new Ext.data.Store({
			url: '/pvd/comun/index.php/buscarpersonaantexcomp/cargarcombotiponoidentidad',
			reader: new Ext.data.JsonReader({
				root: 'datos',
				totalProperty: 'cant',
				id: "idtipodocidentidad"
			}, [
				{name: 'idtipodocidentidad'},
				{name: 'denom'},
				{name: 'cantmaxima'},
				{name: 'cantminima'},
				{name: 'alfanumerico'}
			]),
			listeners: {
				load: function () {
					self.cbtiponoidentidad.enable();
				}
			}
		});
		self.sttiponoidentidad.load();

		// combo tipo de identidad
		this.cbtiponoidentidad = new Ext.form.ComboBox({
			id: 'self.cbtiponoidentidad',
			nextTab: 'self.tfnoidentidad',
			prevTab: 'self.tfsapellido',
			store: self.sttiponoidentidad,
			fieldLabel: 'Tipo de identidad',//perfil.etiquetas.lbComboTipoCI,
			displayField: 'denom',
			tpl: '<tpl for="."><div ext:qtip="{denom}" class="x-combo-list-item">{denom}</div></tpl>',
			hiddenName: 'idtipodocidentidad',
			valueField: 'idtipodocidentidad',
			mode: 'local',
			typeAhead: true,
			triggerAction: 'all',
			forceSelection: true,
			emptyText: 'Seleccione...',
			editable: false,
			allowBlank: false,
			selectOnFocus: true,
			anchor: '90%',
			msgTarget: 'qtip',
			blankText: 'Este campo es obligatorio.',
			listeners: {
				//change : function() {cambio = 1; cambioadd = 1;},
				select: function (t, r, i) {
					self.tfnoidentidad.enable();
					if (r.data.alfanumerico != 1) {
						self.tfnoidentidad.regex = new RegExp('(^([0-9])+([0-9]*))$');
						if (r.data.cantmaxima == r.data.cantminima)
							self.tfnoidentidad.regexText = 'Solo admite n&uacute;meros enteros de ' + r.data.cantmaxima + ' dígitos.';
						else
							self.tfnoidentidad.regexText = 'Solo admite n&uacute;meros enteros de hasta ' + r.data.cantmaxima + ' dígitos.';

						self.tfnoidentidad.maxLength = r.data.cantmaxima;
						self.tfnoidentidad.minLength = r.data.cantminima;
						self.tfnoidentidad.minLengthText = 'El tama&ntilde;o m&iacute;nimo requerido es ' + r.data.cantminima + ' dígitos.';
						self.tfnoidentidad.maxLengthText = 'El tama&ntilde;o m&aacute;ximo requerido es ' + r.data.cantmaxima + ' dígitos.';
					}
					else {
						self.tfnoidentidad.regex = new RegExp('(^([a-zA-Z0-9])+([a-zA-Z0-9]*))$');
						self.tfnoidentidad.regexText = 'Solo admite caracteres alfanum&eacute;ricos.';
						self.tfnoidentidad.maxLength = r.data.cantmaxima;
						self.tfnoidentidad.minLength = r.data.cantminima;
						self.tfnoidentidad.minLengthText = 'El tama&ntilde;o m&iacute;nimo requerido es ' + r.data.cantminima + ' caracteres.';
						self.tfnoidentidad.maxLengthText = 'El tama&ntilde;o m&aacute;ximo requerido es ' + r.data.cantmaxima + ' caracteres.';
					}
					self.tfnoidentidad.validate();
				}
			}
		});

		//store de sector
		this.stsector = new Ext.data.Store({
			url: '/pvd/comun/index.php/buscarpersonaantexcomp/cargarcombosector',
			reader: new Ext.data.JsonReader({
				root: 'datos',
				totalProperty: 'cant',
				id: "idsector"
			}, [
				{
					name: 'idsector'
				},
				{
					name: 'denom'
				}
			]),
			listeners: {
				load: function () {
					self.cbsector.enable();
				}
			}
		});
		self.stsector.load();

		/*combo Sector*/
		this.cbsector = new Ext.form.ComboBox({
			id: 'self.cbsector',
			nextTab: 'triggerFieldSector',
			prevTab: 'tfnoserie',
			store: self.stsector,
			fieldLabel: 'Sector',//perfil.etiquetas.lbCombosector,
			displayField: 'denom',
			tpl: '<tpl for="."><div ext:qtip="{denom}" class="x-combo-list-item">{denom}</div></tpl>',
			hiddenName: 'idsect',
			valueField: 'idsector',
			mode: 'local',
			typeAhead: true,
			triggerAction: 'all',
			forceSelection: true,
			emptyText: 'Seleccione...',
			editable: true,
			allowBlank: false,
			selectOnFocus: true,
			anchor: '90%',
			msgTarget: 'qtip',
			blankText: 'Este campo es obligatorio.',
			enableKeyEvents: true,
			listeners: {
				//change : function() {cambio = 1;cambioadd = 1;}
			},
			disabled: true
		});

		//store de via de entrada
		this.stviaentrada = new Ext.data.Store({
			url: '/pvd/comun/index.php/buscarpersonaantexcomp/cargarcomboviaentrada',
			reader: new Ext.data.JsonReader({
				root: 'datos',
				totalProperty: 'cant',
				id: "idviaentrada"
			}, [
				{
					name: 'idviaentrada'
				},
				{
					name: 'denominacion'
				}
			]),
			listeners: {
				load: function () {
					self.cbviaentrada.enable();
				}
			}
		});
		self.stviaentrada.load();

		/*combo via de entrada*/
		this.cbviaentrada = new Ext.form.ComboBox({
			id: 'self.cbviaentrada',
			//nextTab: 'triggerFieldSector',
			//prevTab: 'tfnoserie',
			store: self.stviaentrada,
			fieldLabel: 'V&iacute;a de entrada',//perfil.etiquetas.lbComboviaentrada,
			displayField: 'denominacion',
			tpl: '<tpl for="."><div ext:qtip="{denominacion}" class="x-combo-list-item">{denominacion}</div></tpl>',
			hiddenName: 'idviaentrada',
			valueField: 'idviaentrada',
			name: 'idviaentrada',
			mode: 'local',
			typeAhead: true,
			triggerAction: 'all',
			forceSelection: true,
			emptyText: 'Seleccione...',
			editable: true,
			allowBlank: false,
			selectOnFocus: true,
			anchor: '90%',
			msgTarget: 'qtip',
			blankText: 'Este campo es obligatorio.',
			enableKeyEvents: true,
			listeners: {
				//change : function() {cambio = 1;cambioadd = 1;}
			},
			disabled: true
		});

		//Numero de serie del tipo de documento de identidad
		this.tfnoserie = new Ext.form.TextField({
			id: 'self.tfnoserie',
			nextTab: 'cbcategoria',
			prevTab: 'tfnoidentidad',
			fieldLabel: 'No. serie',//perfil.etiquetas.lbTextFieldNumeroserie,
			allowBlank: false,
			maxLength: 20,
			blankText: 'Este campo es obligatorio.',
			maskRe: /^([a-zA-Z\d]+ ?[a-zA-Z\d]*)+$/,
			anchor: '90%',
			name: 'noserie',
			listeners: {change: function () {
				cambio = 1;
				cambioadd = 1;
			}}
		});

		/**/
		//Form panel para adicionar la foto
		var randon = 0;
		var fpFoto = new Ext.FormPanel({
			fileUpload: true,
			baseCls: 'x-plain',
			id: 'fpFoto',
			labelAlign: 'right',
			labelWidth: 40,
			bodyStyle: 'padding: 10px',
			items: [
				{
					xtype: 'fileuploadfield',
					width: 200,
					id: 'photo_persona',
					emptyText: 'Seleccione...',
					fieldLabel: 'Foto',
					regex: /^.+\.(jpg|png|bmp|JPG|PNG|BMP)$/i,
					regexText: 'Solo imagen de formato jpg ,png o bmp',
					name: 'nombrefoto',
					buttonText: '',
					buttonCfg: {
						iconCls: 'btn',
						icon: perfil.dirImg + 'buscar.png',
						tooltip: 'Buscar imagen para cargar'
					}
				}
			]
		});

		winFoto = new Ext.Window({
			// plain : true,
			title: 'Buscar imagen',
			bodyBorder: true,
			autoHeight: true,
			closeAction: 'hide',
			modal: true,
			layout: 'form',
			hideBorders: true,
			width: 320,
			bodyStyle: 'padding: 10px',
			resizable: false,
			collapsible: false,
			items: [fpFoto],
			buttons: [
				{
					text: 'Cancelar',
					iconCls: 'btn',
					tooltip: 'Cerrar ventana sin guardar los datos',
					icon: perfil.dirImg + 'cancelar.png',
					handler: function () {
						winFoto.hide();
					}
				},
				{
					text: 'Aceptar',
					iconCls: 'btn',
					tooltip: 'Guardar datos y cerrar ventana',
					icon: perfil.dirImg + 'aceptar.png',
					id: 'aceptar',
					handler: function () {
						if (Ext.getCmp('photo_persona').getRawValue() == '') {
							mostrarMensaje(1, 'Seleccionar imagen');
						}
						else {
							if (fpFoto.getForm().isValid()) {
								var valor = Ext.getCmp('photo_persona').getValue();
								extension = valor.substr(valor.lastIndexOf('.'));
								fpFoto.getForm().submit({
									url: '/pvd/repositorio_persona/persona/index.php/personacolaboradoresantex/guardarfoto',
									waitMsg: 'Por favor espere...',
									params: {extension: extension},
									success: function (fpFoto, o) {
										nombrefoto = o.result.nombrefoto;
										elPanelfoto = pfoto.body;
										var datosf = new Objf(o.result.dirfoto);
										plantillaFoto.overwrite(elPanelfoto, datosf);
										elPanelfoto.slideIn('l', {stopFx: true, duration: .5});
										winFoto.hide();
									}
								});
							}
						}
					}
				}
			]
		});

		/*items del formulario*/
		this.items = [
			{
				layout: 'column',
				border: false,
				items: [
					{
						columnWidth: 0.14,
						anchor: '100%',
						id: 'padrefoto',
						bodyStyle: 'padding: 0px 0px 0px 15px',
						style: 'margin:0 5 5 5',
						layout: 'form',
						height: 155,//155
						border: true,
						frame: false,
						items: [
							{
								layout: 'form',
								border: false,
								frame: true,
								items: [self.pfoto]
							},
							{
								layout: 'column',
								items: [
									{
										columnWidth: .5,
										layout: 'form',
										border: false,
										frame: false,
										style: 'margin:5 0 0 20',
										anchor: '50%',
										items: [maximizarimg]
									},
									{
										columnWidth: .5,
										layout: 'form',
										border: false,
										style: 'margin:5 0 0 10',
										frame: false,
										items: [self.cambiarimg]
									}
								]
							}
						]
					},
					{
						xtype: 'fieldset',
						id: 'fieldset',
						columnWidth: .85,
						bodyStyle: 'padding: 5px 0px 1px 20px',
						width: 500,
						style: '-moz-border-radius:5px',
						height: 132,
						layout: 'column',
						items: [
							{
								columnWidth: .20,
								layout: 'form',
								border: false,
								items: [self.tfnombre, self.cbtiponoidentidad]
							},
							{
								columnWidth: .15,
								layout: 'form',
								border: false,
								items: [self.tfsnombre, self.tfnoidentidad]
							},
							{
								columnWidth: .15,
								layout: 'form',
								border: false,
								items: [self.tfpapellido, self.tfnoserie]
							},
							{
								columnWidth: .30,
								layout: 'form',
								border: false,
								items: [self.tfsapellido, {
									layout: 'column',
									items: [
										{
											columnWidth: .45,
											layout: 'form',
											border: false,
											items: self.cbsexo
										},
										{
											columnWidth: .51,
											layout: 'form',
											border: false,
											items: self.cbsector
										}
									]
								}]
							},
							{
								columnWidth: .20,
								layout: 'form',
								border: false,
								items: [self.cbcategoria, self.cbviaentrada]
							}
						]
					}
				]
			}
		];
		Ext.pvd.persona.buscarpersona.panelAdicionarpersonaAntex.superclass.initComponent.call(this);
	}
})

/*Adicionar del componente buscar persona aplicado a la personalización del sistema de Antex*/
Ext.pvd.persona.buscarpersona.winAdicionarpersonaAntex = Ext.extend(Ext.Window, {
	title: 'Adicionar persona',
	width: '100%',
	height: 250,
	modal: true,
	layout: 'border',

	initComponent: function () {
		var self = this;
		var btnCancelar = new Ext.Button({
			text: 'Cancelar',
			id: 'btnCancelar' + self.id,
			icon: perfil.dirImg + 'cancelar.png',
			iconCls: 'btn',
			tooltip: 'Cerrar ventana sin guardar cambios',
			handler: function () {
				self.close();
			}
		});

		var btnAceptar = new Ext.Button({
			text: 'Aceptar',
			id: 'btnAceptar' + self.id,
			icon: perfil.dirImg + 'aceptar.png',
			iconCls: 'btn',
			tooltip: 'Guardar cambios y cerrar ventana',
			handler: adicionar,
		});

		var formpanel = new Ext.pvd.persona.buscarpersona.panelAdicionarpersonaAntex({
			region: 'center',
		});
		this.items = [formpanel];
		this.buttons = [btnCancelar, btnAceptar];
		Ext.pvd.persona.buscarpersona.winAdicionarpersonaAntex.superclass.initComponent.call(this);

		function VentanaFoto() {
			fpfoto.getForm().reset();
			winFoto.show();
		}

		function adicionar() {
			if (formpanel.getForm().isValid()) {
				var direccion = '';
				var idpersona = -1;
				var idpersonaid = -1;
				//var idfotopersona = -1;
				/*if(!validarNumeroIdentidad()){
				 mostrarMensaje(1, 'asdfg');//perfil.etiquetas.lbRectificarCarne);
				 return;
				 }*/
				//PVD.mostrarMascara('idenviaraddmodfijos','asd','asdf');
				formpanel.getForm().submit({
					url: '/pvd/repositorio_persona/persona/index.php/personacolaboradoresantex/adicionarpersona',
					params: {
						fechainscrp: fecha.format('d/m/Y'),
						//nombrefoto: nombrefoto,
						//idfoto: idfotopersona
					},
					failure: function (form, action) {
						/*PVD.ocultarMascara('idenviaraddmodfijos');
						 if(action.result.codMsg == 3){
						 //mostrarMensaje(action.result.codMsg, action.result.mensaje);
						 }
						 else{
						 mostrarMensaje(action.result.codMsg, action.result.mensaje, function Aceptando(btn){
						 if(btn == 'ok'){
						 btnModificar.disable();
						 btnEliminar.disable();
						 if(nohayconceptos != 0 && accion == 'ADD'){
						 windatospersona.setSize('100%',620);
						 }
						 if(nohayconceptos == 0 && accion == 'ADD'){
						 windatospersona.setSize('100%',245);
						 }
						 //windatospersona.setSize('80%',600);
						 idDevPersona = action.result.idpers;
						 idDevdocidentidad = action.result.idpersonadocidentidad;
						 idDevfoto = action.result.idfotopersona;
						 if(boton == 'ACEP'){
						 windatospersona.hide();
						 seleccion = -1;
						 smpersonas.clearSelections();
						 restaurarFoto();
						 resetearFormulario();
						 cambio = 0;
						 cambioadd = 0;
						 }
						 if(boton == 'APLI'){
						 Ext.getCmp('btnaplicar').disable();
						 temp = 2;
						 Ext.getCmp('btnadicionarnp').setVisible(true);
						 }
						 stpersona.baseParams.tipobusqueda = 1;
						 stpersona.load({params: {start:0, limit: 25}});
						 cambio = 0;
						 cambioadd = 0;
						 }
						 });
						 }*/
					}
				});
			}
			//self.close();
		}
	}
})



