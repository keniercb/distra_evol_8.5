Ext.ns('Ext.Log.Gestlote');

	Ext.QuickTips.init();

	Ext.Log.Gestlote.ventana = Ext.extend(Ext.Window, {
		idioma : '',
		baseDirController : '/logistica/utiles/producto/index.php/gestlote/',
		constructor: function(config){
				
			var _this = this;
			Ext.Ajax.request({
				url : _this.baseDirController + 'cargaretiquetas',
				callback : function(options,success,response){
					 if(success){
						_this.idioma = Ext.decode(response.responseText);
						_this._initComponent();
						_this.show();
						_this.maximize();
					}
				}			
			});       
			Ext.Log.Gestlote.ventana.superclass.constructor.call(this, arguments); 
		},
		
		 _initComponent : function() {
			var _this = this;
			
			this.btnAdicionarlote = new Ext.Button({id: 'btnAdicionarlote',	iconCls : 'adicionar', text:_this.idioma.btnAdicionar, tooltip : _this.idioma.btnTtAdicionar, handler : function() {/*var win = VentanaAddLote(true); win.show();*/} });
											
			this.btnModificarlote = new Ext.Button({id: 'btnModificarlote', iconCls : 'modificar', text: _this.idioma.btnModificar, tooltip : _this.idioma.btnTtModificar, handler : function() {} });	
										
			this.btnEliminarlote = new Ext.Button({id: 'btnEliminarlote', iconCls : 'eliminar', text: _this.idioma.btnEliminar, tooltip : _this.idioma.btnTtEliminar, handler : function() {} });
			
			this.btnAyuda = new Ext.Button({id: 'btnAyuda', iconCls : 'ayuda', tooltip : _this.idioma.btnTtAyuda, handler : function() {}});
			
			this.btnsiguiente = new Ext.Button({id: 'btnsiguiente', iconCls : 'siguiente', tooltip : _this.idioma.btnTtsiguiente, handler : function() {} }); 
			
			this.btnanterior = new Ext.Button({id: 'btnanterior', iconCls : 'anterior', tooltip : _this.idioma.btnTtanterior, handler : function() {} }); 
			
			
		
			
			this.formulario = new Ext.form.FormPanel({
                frame: true,
				items:[	new Ext.form.FieldSet({
							style: '-moz-border-radius:5px',
							autoHeight: true,
							layout: 'column',
							title: 'Datos productos',
							items: [{
								columnWidth: .88,
								items:[{
										
											xtype: 'label',
											text: 'Nombre del Area',
											id: 'area'
											
										}, {
											xtype: 'label',
											text: 'Codigo del producto',
											id: 'codigo'
											
										},{
											xtype: 'label',
											text: 'Descripcion',
											id: 'desc'
											
										},{
											xtype: 'label',
											text: 'Cantidad total',
											id: 'cant'
											
										}]
								}]
							})]
				});
			
			
			this.Record = new Ext.data.Record.create(
				[{
					name : 'idlote',
					mapping : 'idlote'
				}, {
					name : 'numero',
					mapping : 'numero'
				}, {
					name : 'fechafabricacion',
					mapping : 'fechafabricacion'
				}, {
					name : 'fechavencimiento',
					mapping : 'fechavencimiento'
				}, {
					name : 'existencialote',
					mapping : 'existencialote'
				}, {
					name : 'cantidaddisponible',
					mapping : 'cantidaddisponible'
				}, {
					name : 'capacidadbulto',
					mapping : 'capacidadbulto'
				}, {
					name : 'numerobulto',
					mapping : 'numerobulto'
				}, {
					name : 'resto',
					mapping : 'resto'
				}]);
				

			this.stgestlote = new Ext.data.Store({
				url : '',
				reader : new Ext.data.JsonReader({
					totalProperty : 'total',
					root : 'datos',
					id : 'idstgestlote'
				}, _this.Record)
				/*listeners : {
					'beforeload' : function(store, objeto) {
						onloadMask('Cargando...');
					 },
					'load' : function(store, records, options) {
						Ext.getBody().unmask();
					}
				} */   
			});
			
			this.cm = new Ext.grid.ColumnModel({
				defaults : {
					sortable : true
				},
				columns : [new Ext.LOG.PagingRowNumberer(),
						{header: _this.idioma.hdNumero, width: 80, dataIndex: 'numero'},
						{header: _this.idioma.hdFechaF, width: 130, dataIndex: 'fechafabricacion'},
						{header: _this.idioma.hdFechaV, width: 130, dataIndex: 'fechavencimiento'},
						{header: _this.idioma.hdExistencia, width: 130, dataIndex: 'existencialote'},
						{header: _this.idioma.hdCantidad, width: 130, dataIndex: 'cantidaddisponible'},
						{header: _this.idioma.hdCapacidad, width: 130, dataIndex: 'capacidadbulto'},
						{header: _this.idioma.hdNumeroBulto, width: 100, dataIndex: 'numerobulto'},
						{header: _this.idioma.hdResto, width: 100, dataIndex: 'resto'},
						{hidden: true, hideable: false, dataIndex: 'idlote'}]
			});

			this.gpgestlote = new Ext.grid.GridPanel({
				title: _this.idioma.TitleGpgestlote,
				store : _this.stgestlote,
				cm : _this.cm,
				id: 'idgpgestlote',
				sm : new Ext.grid.RowSelectionModel({
					singleSelect : true,
					moveEditorOnEnter : false,
					listeners : {
						'selectionchange' : function(sm) {
						},
					}
				}),
				viewConfig: {
					forceFit: true
				},
				bbar : new Ext.PagingToolbar({
					pageSize : 20,
					store : _this.stgestlote,
					displayInfo : true,
					displayMsg : _this.idioma.displayMsg,
					emptyMsg : _this.idioma.emptyMsg
				})
			});
				
			this.panel = new Ext.Panel({
				layout: 'fit',
				region: 'center',
				id: 'panel',
				tbar: [_this.btnAdicionarlote, _this.btnModificarlote, _this.btnEliminarlote, _this.btnanterior, _this.btnsiguiente, '->', _this.btnAyuda],
				items: [_this.gpgestlote]
			});
			
			
			Ext.applyIf(this, {
				title: _this.idioma.TitlePanel,
				frame: true,
				layout: 'fit',
				items: [_this.panel]
			});
		
		Ext.Log.Gestlote.ventana.superclass.initComponent.call(this, arguments);
		}
	
	
	});
	