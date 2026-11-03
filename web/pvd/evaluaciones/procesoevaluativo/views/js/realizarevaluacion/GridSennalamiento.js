Ext.ns("Ext.PVD.Evaluaciones");
Ext.PVD.Evaluaciones.gpSennalamiento = Ext.extend(Ext.grid.GridPanel, {
	autoscroll:true,
	autoExpandColumn:'expandir',
	//disabled:true,
	initComponent: function() {
		var self = this;
		this.title = this.labels.lbTitPerSenalto;
		this.sm = new Ext.grid.RowSelectionModel({
			singleSelect:true,
			listeners: {
				rowselect: function(sm, rowIndex, record){
					btnDelSennalamiento.enable();
				}
			}
		});
		
		var btnAddSennalamiento = new Ext.Button({
			id:'btnAddSenalamiento',
			iconCls:'adicionar',
			text: self.labels.lbBtnAdicionar,
			tooltip: self.labels.ttpBtnAdicionarSen,
			handler: showWinAddSennalamiento
		});
		var btnDelSennalamiento = new Ext.Button({
			disabled:true, 
			iconCls:'eliminar',
			text:self.labels.lbBtnEliminar, 
			tooltip: self.labels.ttpBtnEliminarSen,
			handler: eliminarSennalamiento 
		});
		this.columns = [{header: "Tipo se&ntilde;alamiento", width: 180, sortable: true, dataIndex: 'tiposenalamiento', hidden:true},
            {id:'expandir',header: "Denominaci&oacute;n del se&ntilde;alamiento", width: 180, sortable: true, dataIndex: 'denom'}
        ];
		
		this.store = new Ext.data.GroupingStore({
			url:'getPersonaSenalamiento',
			baseParams: {
				idpersonaevaluacion: self.evaluado.get('idpersonaevaluacion')
			},
			reader: new Ext.data.JsonReader({
				totalProperty: "cantidad",
				root: "datos"
			},[
				{name: 'idpersonasenyalamientos'},
				{name: 'denom'},
				{name: 'tiposenalamiento'}
			]),
			sortInfo:{field: 'denom', direction: "ASC"},
			groupField:'tiposenalamiento'
		});
		
		this.view = new Ext.grid.GroupingView({forceFit:true,
            groupTextTpl: '{text} ({[values.rs.length]} {[values.rs.length > 1 ? "Se&ntilde;alamientos" : "Se&ntilde;alamiento"]})'
        });
		
		this.bbar = new Ext.PagingToolbar({
			pageSize: 15,
			store: self.store,
			displayInfo: true,
			displayMsg: self.labels.lbDisplayMsg,
			emptyMsg: self.labels.lbEmptyMsg
		});
		this.tbar = [btnAddSennalamiento,btnDelSennalamiento];
		this.loadMask = {msg: self.labels.lbGridLoadMask};
		Ext.PVD.Evaluaciones.gpSennalamiento.superclass.initComponent.call(this);
		
		this.on('render', function(cmp){
			this.store.on('load', function(st, records, options){
				if(st.getCount()>0){
					self.getSelectionModel().selectFirstRow();
					btnDelSennalamiento.enable();
				}else{
					btnDelSennalamiento.disable();
				}
			});
			if(!self.editable){
				btnDelSennalamiento.hide();
				btnAddSennalamiento.hide();
			}
		});
		
		function showWinAddSennalamiento(){
			var win = new Ext.PVD.Evaluaciones.winAddSennalamiento({
				procesoEval: self.procesoEval,
				evaluado: self.evaluado,
				labels:self.labels,
				parent: self
			});
			win.show();
		}
		
		function eliminarSennalamiento(){		
			mostrarMensaje(2,self.labels.lbConfirmElimSenalmto,function(btn){//---est�ndar asignado para mensajes
                if(btn == "ok"){
					if(self.getSelectionModel().hasSelection()){
						PVD.mostrarMascara('delsenalamiento', self.labels.lbMsgWait, self.labels.lbMaskDelSenalamiento);
						Ext.Ajax.request({
							url: 'eliminarPersonaSenalamiento',
							method:'POST',
							params: {
								idpersonasenyalamientos: self.getSelectionModel().getSelected().get('idpersonasenyalamientos')
							},
							callback: function (options,success,response){
								PVD.ocultarMascara('delsenalamiento');
								self.store.reload({params:{start:0, limit:15}});
							}
						});
					}else{
						Ext.MessageBox.show({title: 'Alerta', msg: "Debe seleccionar un se�alamiento", buttons: Ext.MessageBox.OK, icon: Ext.MessageBox.WARNING });
					}
				}
			});	
		}
		
	}
});

Ext.PVD.Evaluaciones.winAddSennalamiento = Ext.extend(Ext.Window, {
	modal:true,
	layout:'fit',
	initComponent: function() {
		var self = this;
		this.title = self.labels.lbTitWinSenalmto;
		
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
			handler: adicionarSennalamiento
		});
		
		var smCheckBox = new Ext.grid.CheckboxSelectionModel({
			checkOnly: true,
		});
		
		var stSennalamientosPE = new Ext.data.GroupingStore({
			url:'getSenalamientosPE',
			baseParams:{
				iddefprocesoevaluativo: self.procesoEval.get('iddefprocesoevaluativo')
			},
			reader: new Ext.data.JsonReader({
				totalProperty: "cantidad",
				root: "datos"
			},[
				{name: 'idprocesoresenyalamiento'},
				{name: 'idsenyalamiento'},
				{name: 'denom'},
				{name: 'idtiposenyalamiento'},
				{name: 'tiposenyalamiento'}
			]),
			sortInfo:{field: 'denom', direction: "ASC"},
			groupField:'tiposenyalamiento'
		});
		
		this.gpSennalamientosPE = new Ext.grid.GridPanel({
			store: stSennalamientosPE,
			border:false,
			width: 550,
			height:470,
			columns: [smCheckBox,
				{header: "Tipo se&ntilde;alamiento", width: 180, sortable: true, dataIndex: 'tiposenyalamiento', hidden:true},
				{id:'expandir',header: "Denominaci&oacute;n", width: 180, sortable: true, dataIndex: 'denom'}
			],
			view: new Ext.grid.GroupingView({
				forceFit:true,
				groupTextTpl: '{text} ({[values.rs.length]} {[values.rs.length > 1 ? "Se&ntilde;alamientos" : "Se&ntilde;alamiento"]})'
			}),
			autoExpandColumn: 'expandir',
			loadMask:{msg: self.labels.lbGridLoadMask},
			sm: smCheckBox,
			bbar: new Ext.PagingToolbar({
				pageSize: 15,
				store: stSennalamientosPE,
				displayInfo: true,
				displayMsg: self.labels.lbDisplayMsg,
				emptyMsg: self.labels.lbEmptyMsg
			})
		});
		
		this.items = [this.gpSennalamientosPE];
		this.buttons = [btnCancelar, btnAceptar];
		Ext.PVD.Evaluaciones.winAddSennalamiento.superclass.initComponent.call(this);
		this.on('show', function(cmp){
			stSennalamientosPE.load({params:{start:0,limit:15}});
		});
		
		function adicionarSennalamiento(){
			arrSenalamientos = new Array();
			arrRecords = self.gpSennalamientosPE.getSelectionModel().getSelections();
			for(var i = 0; i< arrRecords.length; i++ ){
				arrSenalamientos[i] = arrRecords[i].get('idsenyalamiento');
			}
			PVD.mostrarMascara('addsenalamiento', self.labels.lbMsgWait, self.labels.lbMaskAddSenalamiento);
			Ext.Ajax.request({
				url: 'adicionarPersonaSenalamiento',
				method:'POST',
				params: {
					idpersonaevaluacion: self.evaluado.get('idpersonaevaluacion'),
					arrSenalamientos: Ext.encode(arrSenalamientos)
				},
				callback: function (options,success,response){
					var datos = Ext.util.JSON.decode(response.responseText);
					PVD.ocultarMascara('addsenalamiento');
					self.close();
					self.parent.store.reload({params:{start:0, limit:15}});
				}
			});
		}
	}
});
