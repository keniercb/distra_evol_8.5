Ext.ns('Nomenclador');
/**
 * Ventana para la selección de elementos segun su denominacion y codigo
 * @param title : Titulo de la ventana
 * @param name : Identificadores y nombre de la clase
 * @param tipo : Identificador del tipo de nomenclador que se llamara
 * @param store : Store para el grid del nomenclador
 *
 * @param denominacion : Componente al que hay que darle la denominacion
 * @param codigo : Componente al que hay que darle el codigo
 */
Nomenclador.Seleccion = Ext.extend(Ext.Window, {
		denominacion : false,
		codigo       : false,
		initComponent: function ()
		{
				this.initTools();
				this.addEvents();
				var miSeleccion = this;
				miSeleccion.selectionModel = new Ext.grid.RowSelectionModel({singleSelect: true});
				miSeleccion.selectionModel.on('rowSelect', function (a, row, record)
				{
						miSeleccion.denominacion.setValue(record.data.denominacion);
						miSeleccion.codigo.setValue(record.data.codigo);
						miSeleccion.destroy();
				})
				miSeleccion.tfDenominacion = new Ext.form.TextField({
						name      : 'tfdenominacion',
						id        : 'tfdenominacion' + miSeleccion.name,
						vtype     : 'vtalfanumerico',
						maxLength : 100,
						emptyText : 'Criterio a buscar...',
						fieldLabel: 'Denominación',
						anchor    : '85%',
						allowBlank: true
				});
				miSeleccion.store.on('beforeload', function (store, param)
				{
						var paramCategoria = new Array();
						paramCategoria.push(miSeleccion.tipo);
						var limit = param.params.limit;
						var start = param.params.start;
						var texto = miSeleccion.tfDenominacion.getValue();
						if (texto != '') {
								paramCategoria.push({denominacion: texto})
						}
						param.params = {
								start     : start,
								limit     : limit,
								clase     : miSeleccion.name,
								parametros: Ext.encode(paramCategoria)
						}
				})
				miSeleccion.store.on('load', function ()
				{
						Secodena.ocultarMascara('cargaini');
				})
				miSeleccion.btnBuscar = new Ext.Button({
						////icon    : perfil.dirImg + 'buscar.png',
						text    : 'Buscar',
						iconCls : 'buscar',
						id      : "btnBuscarCC",
						disabled: false,
						tooltip : 'Búsqueda avanzada',
						handler : function ()
						{
								miSeleccion.buscar(miSeleccion);
						}
				})
				miSeleccion.btnLimpiar = new Ext.Button({
						tooltip: 'Limpiar filtros',
						text   : 'Limpiar',
						id     : 'btnAllCC',
						//icon   : perfil.dirImg + 'limpiar.png',
						iconCls: 'limpiar',
						handler: function ()
						{
								Ext.getCmp('tfdenominacion' + miSeleccion.name).setValue('');
								miSeleccion.store.reload({params: {start: 0, limit: 18}});
						}
				});
				miSeleccion.grid = new Ext.grid.GridPanel({
						frame  : true,
						height : 450,
						store  : miSeleccion.store,
						sm     : miSeleccion.selectionModel,
						columns: [
								{dataIndex: 'codigo', sortable: true, header: 'Código', width:Go.Column.Config.Width('codigo')},
								{dataIndex: 'denominacion', sortable: true, header: 'Denominación', width:Go.Column.Config.Width('denominacion')}
						],
						tbar   : [miSeleccion.tfDenominacion, miSeleccion.btnBuscar, miSeleccion.btnLimpiar],
						bbar   : new Ext.PagingToolbar({
								pageSize   : 10,
								store      : miSeleccion.store,
								displayInfo: true
						})
				})
				miSeleccion.store.load({params: {limit: 10, start: 0}});
				Ext.apply(this, {
						height   : 360,
						width    : 440,
						layout   : 'fit',
						modal    : true,
						resizable: false,
						items    : [miSeleccion.grid],
						buttons  : [
								{
										text   : 'Cancelar',
										//icon   : perfil.dirImg + 'cancelar.png',
										iconCls: 'cancelar',
										tooltip: 'Cancelar',
										handler: function ()
										{
												miSeleccion.destroy();
										}
								}
						]
				})
				Nomenclador.Seleccion.superclass.initComponent.apply(this)
		},
		buscar       : function (miSeleccion)
		{
				var valor = Ext.getCmp('tfdenominacion' + miSeleccion.name).getValue();
				if (valor != '') {
						var form = {
								denominacion: valor
						}
						var params = new Array();
						params.push(miSeleccion.tipo);
						params.push(form);
						miSeleccion.store.reload({
								params  : {
										start     : 0,
										limit     : 10,
										clase     : miSeleccion.name,
										parametros: Ext.encode(params)
								},
								callback: function (a)
								{
										if (a.length == 0) {
												Secodena.ocultarMascara('cargaini');
												mostrarMensaje(1, "No existen datos que se correspondan con los criterios de b&uacute;squeda especificados.");
												Ext.getCmp('tfdenominacion' + miSeleccion.name).setValue('');
												miSeleccion.store.load({params: {start: 0, limit: 18}});
										}
								}
						})
				} else {
						mostrarMensaje(6, "No se ha introducido ningún criterio de búsqueda.");
						Ext.getCmp('tfdenominacion' + miSeleccion.name).focus(false, 10);
				}
		}
})
