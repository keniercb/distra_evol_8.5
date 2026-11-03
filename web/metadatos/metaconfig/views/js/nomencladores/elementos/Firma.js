var stFirma, formFiltroFirma;
var paramFirma = new Array();
paramFirma.push(22);
var searchFiltroFirma = function () {
	var persona = Ext.getCmp('filtroDenominacion_firma').getValue();
	var cargo = Ext.getCmp('filtroCargo_firma').getValue();
	var dominio = Ext.getCmp('filtroDominio_firma').getValue();
	var form = formFiltroFirma.getForm();
	if (persona != '' || cargo != '' || dominio != '') {
		if (form.isValid()) {
			var params = new Array();
			params.push(22);
			params.push(form.getValues());
			stFirma.reload({
				params: {
					start: 0,
					limit: 15,
					clase: 'firma',
					parametros: Ext.encode(params)
				},
				callback: function (a) {
					if (a.length == 0) {
						Secodena.ocultarMascara('cargaini');
						mostrarMensaje(1, "No existen datos que se correspondan con los criterios de b&uacute;squeda especificados.");
						// formFiltroFirma.getForm().reset();
						Ext.getCmp('btnAllA').disable();
						Ext.getCmp('btnBuscar').disable();
						// stFirma.reload({params: {start: 0, limit: 15}});
					}
				}
			})
		}
	} else {
		mostrarMensaje(6, "No se ha introducido ningún criterio de búsqueda.");
		Ext.getCmp('filtroDenominacion_firma').focus(false, 10);
	}
}

function construirFirma(idTab) {
	var storeCargos = new Ext.data.Store({
		url: 'mostrarValores',
		baseParams: {
			clase: 'cargo',
			accion: 'dameTodosVisibles',
			gestion: true
		},
		autoLoad: true,
		reader: new Ext.data.JsonReader({
			root: "datos"
		}, [
			{ name: 'idnomcargo' },
			{ name: 'denominacion' }
		])
	});

	var storeDominios = new Ext.data.Store({
		url: 'getDominiosHijos',
		autoLoad: true,
		reader: new Ext.data.JsonReader({
		}, [{ name: 'iddominio' }, { name: 'denominacion' }])
	});

	function limpiar() {
		Ext.getCmp('btnAllA').disable();
		Ext.getCmp('btnBuscar').disable();
		formFiltroFirma.getForm().reset();
		stFirma.reload({ params: { start: 0, limit: 15 } });
	}

	formFiltroFirma = new Ext.FormPanel({
		layout: 'column',
		region: 'north',
		cls: 'x-toolbar',
		height: 70,
		frame: true,
		defaults: {
			layout: 'form',
			border: false,
			labelAlign: 'top',
			labelWidth: 50,
			buttonAlign: 'right'
		},
		bodyBorder: false,
		border: false,
		autoScroll: true,
		hideBorders: true,
		keys: [
			{
				key: Ext.EventObject.ENTER,
				fn: function () {
					searchFiltroFirma();
				}
			}, {
				key: 'b',
				alt: true,
				fn: function () {
					searchFiltroFirma();
				}
			}, {
				key: 'l',
				alt: true,
				fn: function () {
					limpiar();
				}
			}
		],
		items: [
			{
				layout: 'form',
				columnWidth: .2,
				items: [
					{
						xtype: 'textfield',
						name: 'abreviatura',
						id: 'filtroDenominacion_firma',
						vtype: 'vtdenominaciones',
						maxLength: 100,
						emptyText: "Criterio a buscar...",
						fieldLabel: 'Persona',
						anchor: '85%',
						enableKeyEvents: true,
						listeners: {
							keyup: function () {
								if (Ext.getCmp('filtroCargo_firma').getValue() != ''
									|| Ext.getCmp('filtroDenominacion_firma').getValue() != ''
									|| Ext.getCmp('filtroDominio_firma').getValue() != '') {
									Ext.getCmp('btnAllA').enable();
									Ext.getCmp('btnBuscar').enable();
								} else {
									Ext.getCmp('btnAllA').disable();
									Ext.getCmp('btnBuscar').disable();
								}
							}
						}
					}
				]
			},
			{
				layout: 'form',
				columnWidth: .2,
				items: [
					{
						xtype: 'combo2',
						anchor: '85%',
						editable: true,
						name: 'cargos',
						id: 'filtroCargo_firma',
						autoCreate: true,
						store: storeCargos,
						mode: 'local',
						hiddenName: 'denominacion',
						emptyText: "Criterio a buscar...",
						forceSelection: true,
						enableQtip: true,
						allowBlank: true,
						fieldLabel: "Cargo",
						displayField: 'denominacion',
						valueField: 'denominacion',
						triggerAction: 'all',
						listeners: {
							select: function (combo, record) {
								//Ext.getCmp('idnomcargo').setValue(record.data.idnomcargo);
								if (Ext.getCmp('filtroCargo_firma').getValue() != ''
									|| Ext.getCmp('filtroDenominacion_firma').getValue() != ''
									|| Ext.getCmp('filtroDominio_firma').getValue() != '') {
									Ext.getCmp('btnAllA').enable();
									Ext.getCmp('btnBuscar').enable();
								} else {
									Ext.getCmp('btnAllA').disable();
									Ext.getCmp('btnBuscar').disable();

								}
							}, deselect: function (combo, record) {
								//Ext.getCmp('idnomcargo').setValue(record.data.idnomcargo);
								if (Ext.getCmp('filtroCargo_firma').getValue() != ''
									|| Ext.getCmp('filtroDenominacion_firma').getValue() != ''
									|| Ext.getCmp('filtroDominio_firma').getValue() != '') {
									Ext.getCmp('btnAllA').enable();
									Ext.getCmp('btnBuscar').enable();
								} else {
									Ext.getCmp('btnAllA').disable();
									Ext.getCmp('btnBuscar').disable();

								}
							}
						},
						handler: function () {
							this.store.removeAll();
							this.store.load();
							//Ext.getCmp('filtroHiddenIdGrupoComplejidad_cargo').setValue('');
						}

					}
				]
			},
			{
				layout: 'form',
				columnWidth: .2,
				items: [
					{
						xtype: 'combo2',
						anchor: '85%',
						editable: true,
						name: 'denominacion',
						id: 'filtroDominio_firma',
						autoCreate: true,
						store: storeDominios,
						mode: 'local',
						hiddenName: 'iddominio',
						emptyText: "Criterio a buscar...",
						forceSelection: true,
						enableQtip: true,
						allowBlank: true,
						fieldLabel: "Dominio",
						displayField: 'denominacion',
						valueField: 'iddominio',
						triggerAction: 'all',
						listeners: {
							select: function (combo, record) {
								//Ext.getCmp('idnomcargo').setValue(record.data.idnomcargo);
								if (Ext.getCmp('filtroCargo_firma').getValue() != ''
									|| Ext.getCmp('filtroDenominacion_firma').getValue() != ''
									|| Ext.getCmp('filtroDominio_firma').getValue() != '') {
									Ext.getCmp('btnAllA').enable();
									Ext.getCmp('btnBuscar').enable();
								} else {
									Ext.getCmp('btnAllA').disable();
									Ext.getCmp('btnBuscar').disable();

								}
							}, deselect: function (combo, record) {
								//Ext.getCmp('idnomcargo').setValue(record.data.idnomcargo);
								if (Ext.getCmp('filtroCargo_firma').getValue() != ''
									|| Ext.getCmp('filtroDenominacion_firma').getValue() != ''
									|| Ext.getCmp('filtroDominio_firma').getValue() != '') {
									Ext.getCmp('btnAllA').enable();
									Ext.getCmp('btnBuscar').enable();
								} else {
									Ext.getCmp('btnAllA').disable();
									Ext.getCmp('btnBuscar').disable();

								}
							}
						},
						handler: function () {
							this.store.removeAll();
							this.store.load();
						}

					}
				]
			},
			{
				layout: 'form',
				columnWidth: .2,
				items: [
					{
						xtype: 'hidden',
						id: 'filtroIdCategMilitar_firma',
						name: 'idcategoriamilitar'

					}
				]
			},
			{
				layout: 'form',
				columnWidth: .2,
				items: [
					{
						xtype: 'hidden',
						id: 'filtroIdEsMarina_firma',
						name: 'marina'

					}
				]
			},
			{
				columnWidth: '35px',
				bodyStyle: 'padding:19px 0 0 0;',
				layout: 'form',
				items: [
					{
						xtype: 'button',
						//	icon    : perfil.dirImg + 'buscar.png',
						text: '<u>B</u>uscar',
						iconCls: 'buscar',
						id: 'btnBuscar',
						disabled: true,
						tooltip: "Buscar firma <b>(Alt+B)</b>",
						handler: function () {
							searchFiltroFirma();
						}
					}
				]
			},
			{
				columnWidth: '35px',
				bodyStyle: 'padding:19px 0 0 0;',
				layout: 'form',
				items: [
					{
						xtype: 'button',
						tooltip: "Limpiar filtros <b>(Alt+L)</b>",
						text: '<u>L</u>impiar',
						//icon   : perfil.dirImg + 'limpiar.png',
						id: 'btnAllA',
						iconCls: 'limpiar',
						disabled: true,
						handler: function () {
							limpiar();
						}
					}
				]
			}
		], listeners: {
			clientvalidation: function (_form, _valid) {
				if (!_valid) {
					Ext.getCmp('btnAllA').disable()
					Ext.getCmp('btnBuscar').disable()
				}
			}
		}
	});
	stFirma = new Ext.data.Store({
		url: 'mostrarValores',
		remoteSort: true,
		reader: new Ext.data.JsonReader({
			root: 'datos',
			totalProperty: 'cant'
		}, [
			{ name: 'id' },
			{ name: 'idfirma' },
			{ name: 'idnomcargo' },
			{ name: 'persona' },
			{ name: 'cargo' },
			{ name: 'fechainicio' },
			{ name: 'fechafin' },
			{ name: 'actual' },
			{ name: 'visible' },
			{ name: 'iddominio' },
			{ name: 'dominio' },
		]),
		listeners: {
			beforeload: function (store, param) {
				param = myBeforeLoad(param, "filtroDenominacion_firma", null, formFiltroFirma, 22, paramFirma, 'firma');
				return param;
			},
			load: function () {
				Secodena.ocultarMascara('cargaini');
				Ext.getCmp('filtroDenominacion_firma').focus(false, 10);
				$('.firma').on('mouseover', function (e) {
					var data = $(this).attr('url');
					var top = e.pageY - 80;
					var left = e.pageX - 150;
					$('#previewImage').attr('src', data);
					$('#preview').css('display', 'block');
					$('#preview').css('top', top);
					$('#preview').css('left', left);
					$('#preview').css('opacity', 1);
					$(this).on('mousemove', function (e) {
					})
				})
				$('.firma').on('mouseout', function (e) {
					$('#preview').css('opacity', 0);
					$('#preview').css('-webkit-transition', 'all 0.3s ease-in-out');
					$('#preview').css('-moz-transition', 'all 0.3s ease-in-out');
					$('#preview').css('-o-transition', 'all 0.3s ease-in-out');
					$('#preview').css('-ms-transition', 'all 0.3s ease-in-out');
					$('#preview').css('transition', 'all 0.3s ease-in-out');
					setTimeout(function () {
						$('#preview').css('display', 'none');
					}, 3000);
				})
			}
		}

	})
	var panelGestion = new Nomenclador.Panel.Gestion({
		id: idTab,
		title: 'Firma',
		name: 'firma',
		clase: 'firma',
		elemento: 'firma',
		idTipoNomenclador: 22,
		mensajeEvento: 'la firma seleccionada',
		mensajeCargando: 'de la firma',
		formFiltro: formFiltroFirma,
		onBuscar: searchFiltroFirma,
		idFoco: 'filtroDenominacion_firma',
		store: stFirma,
		columns: [
			{
				dataIndex: 'id',
				sortable: true,
				header: "Código",
				renderer: Go.Column.Ttip.ToolTipColumn,
				width: Go.Column.Config.Width('codigo'),
				hidden: true
			},
			{
				dataIndex: 'persona',
				id: 'denominacion',
				renderer: Go.Column.Ttip.ToolTipColumn,
				sortable: true, header: "Persona",
				width: Go.Column.Config.Width('denagrupaciones'),
				hidden: false
			},
			{
				dataIndex: 'cargo',
				id: 'cargo', renderer: Go.Column.Ttip.ToolTipColumn,
				sortable: true,
				header: "Cargo",
				width: Go.Column.Config.Width('denagrupaciones'),
				hidden: false
			},
			{
				dataIndex: 'dominio',
				sortable: true,
				header: "Dominio",
				width: Go.Column.Config.Width('firma'),
				hidden: false
			},
			{
				dataIndex: 'fechainicio',
				sortable: true,
				header: "Fecha inicio",
				renderer: Go.Column.Ttip.ToolTipColumn,
				width: Go.Column.Config.Width('firma'),
				hidden: false,
				fixed: true,
				align: 'center'
			},
			{
				dataIndex: 'fechafin',
				sortable: true,
				header: "Fecha fin",
				renderer: Go.Column.Ttip.ToolTipColumn,
				width: Go.Column.Config.Width('firma'),
				hidden: false,
				fixed: true,
				align: 'center'
			},
			{
				dataIndex: 'actual',
				sortable: true, header: "Actual",
				renderer: Go.Column.Render.changeValor,
				width: Go.Column.Config.Width('actual'),
				align: 'center'
			},
			{
				dataIndex: 'visible',
				sortable: true,
				header: "Visible",
				renderer: Go.Column.Render.changeValor,
				width: Go.Column.Config.Width('visible'),
				align: 'center'
			}
		]
	})
	return panelGestion;
}