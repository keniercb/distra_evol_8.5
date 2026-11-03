Ext.ns("Ext.PVD.Evaluaciones");
Ext.PVD.Evaluaciones.gpRecomendaciones = Ext.extend(Ext.grid.GridPanel, {
	autoscroll:true,
	autoExpandColumn:'expandir',
	//disabled:true,
	initComponent: function() {
		var self = this;		
		this.title = this.labels.lbTitPerRecomend;
		this.sm = new Ext.grid.RowSelectionModel({
			singleSelect:true,
			listeners: {
				rowselect: function(sm, rowIndex, record){
					btnDelRecomendacion.enable();
				}
			}
		});
		var btnAddRecomendacion = new Ext.Button({
			iconCls:'adicionar',
			text:self.labels.lbBtnAdicionar,
			tooltip:self.labels.ttpBtnAdicionarRec,
			handler: showWinAddRecomendacion
		});
		var btnDelRecomendacion = new Ext.Button({
			disabled:true, 
			iconCls:'eliminar',
			text:self.labels.lbBtnEliminar, 
			tooltip:self.labels.ttpBtnEliminarRec,
			handler: eliminarRecomendacion 
		});
		
        this.columns = [{header: "Tipo recomendaci&oacute;n", width: 180, sortable: true, dataIndex: 'tiporecomendacion', hidden:true},
            {id:'expandir',header: "Denominaci&oacute;n de la recomendaci&oacute;n", width: 180, sortable: true, dataIndex: 'denom'}
        ];
		
		this.store = new Ext.data.GroupingStore({
			url:'getPersonaRecomendacion',
			baseParams: {
				idpersonaevaluacion: self.evaluado.get('idpersonaevaluacion')
			},
			reader: new Ext.data.JsonReader({
				totalProperty: "cantidad",
				root: "datos"
			},[
				{name: 'idpersonarecomendaciones'},
				{name: 'denom'},
				{name: 'tiporecomendacion'}
			]),
			sortInfo:{field: 'denom', direction: "ASC"},
			groupField:'tiporecomendacion'
		});
		
		this.view = new Ext.grid.GroupingView({ forceFit:true,
            groupTextTpl: '{text} ({[values.rs.length]} {[values.rs.length > 1 ? "Recomendaciones" : "Recomendaci&oacute;n"]})'
        });
		
		this.bbar = new Ext.PagingToolbar({
			pageSize: 15,
			store: self.store,
			displayInfo: true,
			displayMsg: self.labels.lbDisplayMsg,
			emptyMsg: self.labels.lbEmptyMsg
		});
		this.tbar = [btnAddRecomendacion,btnDelRecomendacion];
		this.loadMask = {msg: self.labels.lbGridLoadMask};
		Ext.PVD.Evaluaciones.gpRecomendaciones.superclass.initComponent.call(this);
		
		
		this.on('render', function(cmp){
			this.store.on('load', function(st, records, options){
				if(st.getCount()>0){
					self.getSelectionModel().selectFirstRow();
					btnDelRecomendacion.enable();
				}else{
					btnDelRecomendacion.disable();
				}
			});
			if(!self.editable){
				btnDelRecomendacion.hide();
				btnAddRecomendacion.hide();
			}
		});

		function showWinAddRecomendacion(){
			var win = new Ext.PVD.Evaluaciones.winAddRecomendacion({
				procesoEval: self.procesoEval,
				evaluado: self.evaluado,
				labels:self.labels,
				parent: self
			});
			win.show();
		}
		
		function eliminarRecomendacion(){
			mostrarMensaje(2,self.labels.lbConfirmElimRecomend,function(btn){//---est�ndar asignado para mensajes
                if(btn == "ok"){
					if(self.getSelectionModel().hasSelection()){
						PVD.mostrarMascara('delrecomendacion', self.labels.lbMsgWait, self.labels.lbMaskDelRecomendacion);
						Ext.Ajax.request({
							url: 'eliminarPersonaRecomendacion',
							method:'POST',
							params: {
								idpersonarecomendaciones: self.getSelectionModel().getSelected().get('idpersonarecomendaciones')
							},
							callback: function (options,success,response){
								PVD.ocultarMascara('delrecomendacion');
								self.store.reload({params:{start:0, limit:15}});
							}
						});
					}
					else{
						Ext.MessageBox.show({title: 'Alerta', msg: "Debe seleccionar una recomendaci�n", buttons: Ext.MessageBox.OK, icon: Ext.MessageBox.WARNING });
					}
				}
			});
		}
	}
});

Ext.PVD.Evaluaciones.winAddRecomendacion = Ext.extend(Ext.Window, {
	modal:true,
	layout:'fit',
	initComponent: function() {
		var self = this;
		
		this.title = self.labels.lbTitWinRecomend;
		
		var btnCancelar = new Ext.Button({
			iconCls:'cancelar',
			text:self.labels.lbBtnCancelar, 
			tooltip:self.labels.ttpBtnCancelar, 
			handler: function(){self.close();}
		});
		var btnAceptar = new Ext.Button({
			iconCls:'aceptar',
			text:self.labels.lbBtnAceptar,
			tooltip:self.labels.ttpBtnAceptar,
			handler: adicionarRecomendacion 
		});
	
		var smCheckBox = new Ext.grid.CheckboxSelectionModel({
			checkOnly: true,
		});
		this.stRecomendacionesPE = new Ext.data.GroupingStore({
			url:'getRecomendacionesPE',
			baseParams:{
				iddefprocesoevaluativo: self.procesoEval.get('iddefprocesoevaluativo')
			},
			reader: new Ext.data.JsonReader({
				totalProperty: "cantidad",
				root: "datos"
			},[
				{name: 'idprocesorecomendaciones'},
				{name: 'idrecomendacion'},
				{name: 'denom'},
				{name: 'idtiporecomendacion'},
				{name: 'tiporecomendacion'}
			]),
			sortInfo:{field: 'denom', direction: "ASC"},
			groupField:'tiporecomendacion'
		});
		
		this.gpRecomendacionesPE = new Ext.grid.GridPanel({
			store: self.stRecomendacionesPE,
			region:'center',
			border:false,
			width: 550,
			height:470,
			columns: [smCheckBox,
				{header: "Tipo recomendaci&oacute;n", width: 180, sortable: true, dataIndex: 'tiporecomendacion', hidden:true},
				{id:'expandir',header: "Denominaci&oacute;n", width: 180, sortable: true, dataIndex: 'denom'}
			],
			view: new Ext.grid.GroupingView({
				forceFit:true,
				groupTextTpl: '{text} ({[values.rs.length]} {[values.rs.length > 1 ? "Recomendaciones" : "Recomendaci&oacute;n"]})'
			}),
			autoExpandColumn: 'expandir',
			loadMask:{msg: self.labels.lbGridLoadMask},
			sm: smCheckBox,
			bbar: new Ext.PagingToolbar({
				pageSize: 15,
				store: self.stRecomendacionesPE,
				displayInfo: true,
				displayMsg: self.labels.lbDisplayMsg,
				emptyMsg: self.labels.lbEmptyMsg
			})
		});
		this.items = [this.gpRecomendacionesPE];
		this.buttons = [btnCancelar, btnAceptar];
		Ext.PVD.Evaluaciones.winAddRecomendacion.superclass.initComponent.call(this);
		this.on('show', function(cmp){
			self.stRecomendacionesPE.load({params:{start:0,limit:15}});
		});
		
		function adicionarRecomendacion(){
			arrRecomendaciones = new Array();
			arrRecords = self.gpRecomendacionesPE.getSelectionModel().getSelections();
			for(var i = 0; i< arrRecords.length; i++ ){
				arrRecomendaciones[i] = arrRecords[i].get('idrecomendacion');
			}
			PVD.mostrarMascara('addrecomendacion', self.labels.lbMsgWait, self.labels.lbMaskAddRecomendacion);
			Ext.Ajax.request({
				url: 'adicionarPersonaRecomendacion',
				method:'POST',
				params: {
					idpersonaevaluacion: self.evaluado.get('idpersonaevaluacion'),
					arrRecomendaciones: Ext.encode(arrRecomendaciones)
				},
				callback: function (options,success,response){
					var datos = Ext.util.JSON.decode(response.responseText);
					PVD.ocultarMascara('addrecomendacion');
					self.close();
					self.parent.store.reload({params:{start:0, limit:15}});
				}
			});
		}
	}
});
