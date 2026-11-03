Ext.grid.CheckColumn = function(config){
    Ext.apply(this, config); if(!this.id){ this.id = Ext.id(); }
    this.renderer = this.renderer.createDelegate(this);
};
Ext.grid.CheckColumn.prototype ={
    init : function(grid){
        this.grid = grid;
        this.grid.on('render', function(){
            var view = this.grid.getView();
            view.mainBody.on('mousedown', this.onMouseDown, this);
        }, this);
    },
    onMouseDown: function(e, t){
        if(t.className && t.className.indexOf('x-grid3-cc-'+this.id) != -1){
            e.stopEvent(); var index = this.grid.getView().findRowIndex(t); var record = this.grid.store.getAt(index); record.set(this.dataIndex, !record.data[this.dataIndex]); this.grid.getSelectionModel().selectRow(index);
			this.grid.fireEvent('itemClicked', this.dataIndex, record.data[this.dataIndex], record);
        }
    },
    renderer : function(v, p, record){
        p.css += ' x-grid3-check-col-td'; return '<div class="x-grid3-check-col'+(v?'-on':'')+' x-grid3-cc-'+this.id+'">&#160;</div>';
    }
};

Ext.ns("Ext.components.Evaluaciones.SeguridadEvaluaciones");
Ext.components.Evaluaciones.SeguridadEvaluaciones.WinSeguridadXProcesoEval = Ext.extend(Ext.Window,{
	layout:'border',
	title:'Seguridad por proceso evaluativo',
	initComponent: function(){
		var self = this;
		var checkVer = new Ext.grid.CheckColumn({
			header: "Ver", dataIndex: 'ver', width: 55,
		});
		
		var checkMod = new Ext.grid.CheckColumn({
			header: "Modificar", dataIndex: 'modificar', width: 55,
		});
		
		var btnAddControlador = new Ext.Button({
		    id:'btnAdControlador' + self.id,
			iconCls: 'adicionar',
			text: self.labels.lbBtnAdicionar, 
			handler: function(){showWinAddPersona('controlador');},
			tooltip:self.labels.ttpBtnAddPersona,
			prevTab:'btnDelControlador' + self.id,
			nextTab:'btnDelControlador' + self.id
		});
		var btnDelControlador = new Ext.Button({
		    id:'btnDelControlador' + self.id,
			iconCls: 'eliminar',
			text: self.labels.lbBtnEliminar, 
			disabled:true, 
			tooltip:self.labels.ttpBtnDelPersona,
			handler: function(){ mostrarMensaje(2,labels.lbMsgDelPersona,function(btn){
				if(btn == "ok"){
					PVD.mostrarMascara('idmskdelete', labels.lbMsgWait, labels.lbMaskDelPersona);
					Ext.Ajax.request({
						url: 'eliminarcontrolador',
						method:'POST',
						params: {
							idevalseguridadevalentidad: gpEvaluadores.getSelectionModel().getSelected().get('idevalseguridadevalentidad')
						},
						callback: function (options,success,response){
							PVD.ocultarMascara('idmskdelete');	
							stEvaluadores.reload({params:{limit:15, start:0,}});
						}
					});
				}else{
					btnDelControlador.focus();
				}});
			},
			nextTab:'btnAdControlador'+self.id,
			prevTab:'btnAdControlador'+self.id
		});
		
		var btnAddEvaldo = new Ext.Button({
		    id:'btnAddEvaldo' + self.id,
			iconCls: 'adicionar',
			text: self.labels.lbBtnAdicionar, 
			handler: function(){showWinAddPersona('evaluado');},
			tooltip:self.labels.ttpBtnAddEvaldo,
			prevTab:'btnGuardarEvaldo' + self.id,
		});
		
		var btnDelEvaldo = new Ext.Button({
		    id:'btnDelEvaldo' + self.id,
			iconCls: 'eliminar',
			text: self.labels.lbBtnEliminar,
			disabled:true, 
			tooltip:self.labels.ttpBtnDelEvaldo,
			handler: function(){ mostrarMensaje(2,labels.lbMsgDelPersona,function(btn){
				if(btn == "ok"){
					PVD.mostrarMascara('idmskdelete', labels.lbMsgWait, labels.lbMaskDelPersona);
					Ext.Ajax.request({
						url: 'eliminarevaluado',
						method:'POST',
						params: {
							idevalaccesoevalentidad: gpEvaluados.getSelectionModel().getSelected().get('idevalaccesoevalentidad')
						},
						callback: function (options,success,response){
							PVD.ocultarMascara('idmskdelete');	
							stEvaluados.reload({params:{limit:15, start:0,}});
						}
					});
				}});
			}
		});
		
		var btnGuardar = new Ext.Button({
		id:'btnGuardarEvaldo' + self.id,
		iconCls:'guardar', text:self.labels.lbBtnGuardar,
		handler: guardarPermisosEvaldos, 
		disabled:true, 
		tooltip:self.labels.ttpBtnGuardar,
		nextTab:'btnAddEvaldo' + self.id,
		prevTab:'btnDelEvaldo' + self.id,
		});
		
		var stEvaluados = new Ext.data.Store({
			url:'getEvaluados',
			pruneModifiedRecords: true,
			reader: new Ext.data.JsonReader({
				totalProperty: "cantidad",
				root: "datos",
				id: "idEvaldos"
			},[
				{name: 'idevalaccesoevalentidad'},
				{name: 'idpersona'},
				{name: 'nombre'},
				{name: 'snombre'},
				{name: 'numid'},
				{name: 'papel'},
				{name: 'sapel'},
				{name: 'ver'},
				{name: 'modificar'}
			]),
			listeners: {
				load: function(st, records, options){
					if(records.length > 0){
						gpEvaluados.getSelectionModel().selectFirstRow();
					}else{
						btnDelEvaldo.disable();
						btnGuardar.disable();
					}
				}
			}
		});
		
		var kmIindicadorEvaluados = [{
			key: 'i', alt:true,
			fn: function(){
				btnAddEvaldo.handler();
				}
			},{
				key: 46,
				fn: function(){
					if(!btnDelEvaldo.disabled ){
						btnDelEvaldo.handler();
					}
				}
			},{
				key: 'g',
				fn: function(){
					if(!btnGuardar.disabled ){
						btnGuardar.handler();
					}
				}
			}
			
		];
		var gpEvaluados = new Ext.grid.EditorGridPanel({
			disabled:true,
			title: self.labels.lbTitEvaluados,
			columns: [
				{header: "CI", sortable: true, width: 85, dataIndex: 'numid'},
				{header: "Nombre", sortable: true, width: 110, dataIndex: 'nombre'},
				{header: "Segundo nombre", sortable: true, width: 110, dataIndex: 'snombre', hidden:true},
				{header: "Primer apellido", sortable: true, width: 110, dataIndex: 'papel'},
				{id:'expandir', header: "Segundo apellido", sortable: true, width: 110, dataIndex: 'sapel'},
				checkVer, checkMod],		
			tbar:[btnAddEvaldo,btnDelEvaldo,btnGuardar],
			plugins:[checkVer, checkMod],
			clicksToEdit:1,
			store: stEvaluados,
			autoExpandColumn:'expandir',
			loadMask:{msg:self.labels.lbGridLoadMask},
			region:'center',
			margins: '0 5 5 0',
			width: '50%',
			height: 350,
			bbar: new Ext.PagingToolbar({
				pageSize: 15,
				store: stEvaluados,
				displayInfo: true,
				displayMsg: self.labels.lbDisplayMsg,
				emptyMsg: self.labels.lbEmptyMsg
			}),
			sm: new Ext.grid.RowSelectionModel({
				singleSelect: true,
				listeners: {
					rowselect: function(sm,rowIndex,record){
						btnDelEvaldo.enable();
						btnGuardar.enable();
					}
				}
			}),
			listeners: {
				itemClicked: function(dataIndex, checked, record) {
					if(dataIndex == 'modificar'){
						record.set('ver', checked);
					}
					else if(dataIndex == 'ver' && !checked){
						record.set('modificar', checked);
					}
				}
			},
			keys:kmIindicadorEvaluados
		});
	

		var stTipoPermiso = new Ext.data.SimpleStore({
			fields: ['idpermiso', 'permiso'],
			data : [['1',"Ver todo"], ['2',"Ver y modificar todo"],['3','Personalizado']]
		});
		var cbTipoPermiso = new Ext.form.ComboBox({
			store: stTipoPermiso,       
			valueField:'idpermiso',
			displayField:'permiso',
			typeAhead: true,
			editable:false,
			mode: 'local',
			forceSelection: true,
			triggerAction: 'all',
			emptyText:'Seleccione...',
			selectOnFocus:true,
			listeners: {
				select: function(cb, record, index){
					cambiarPermisoControlador(gpEvaluadores.getSelectionModel().getSelected().get('idevalseguridadevalentidad'), record.get('idpermiso'));
				}
			}
		});
		
		var stEvaluadores = new Ext.data.Store({
			url:'getControladoresEvaluaciones',
			reader: new Ext.data.JsonReader({
				totalProperty: "cantidad",
				root: "datos",
				id: "idEvaldores" 
			},[
				{name:'idevalseguridadevalentidad'},
				{name: 'idpersona'},
				{name: 'nombre'},
				{name: 'snombre'},
				{name: 'numid'},
				{name: 'papel'},
				{name: 'sapel'},
				{name: 'todo'}, //equivale a permisos
				{name: 'tipopersona'},
				{name: 'idprocesoevaluadores'}
			]),
			listeners: {
				load: function(st, records, options){
					if(records.length > 0){
						gpEvaluadores.getSelectionModel().selectFirstRow();
						btnDelControlador.enable();
					}else{
						btnDelControlador.disable();
					}
				}
			}
		});
		stEvaluadores.on('load', function(st, records, options){
			   btnAddControlador.focus();
		});
		
		var kmIindicadorTexto = [{
			key: 'i', alt:true,
			fn: function(){
				btnAddControlador.handler();
				}
			},{
				key: 46,
				fn: function(){
					if(!btnDelControlador.disabled ){
						btnDelControlador.handler();
					}
				}
			}
		];
		
		var gpEvaluadores = new Ext.grid.EditorGridPanel({
			clicksToEdit:1,
			split:true,
			tbar:[btnAddControlador,btnDelControlador],
			title: self.labels.lbTitEvaluadores,
			columns: [
				{header: "CI", sortable: true, width: 95, dataIndex: 'numid'},
				{header: "Nombre", sortable: true, width: 110, dataIndex: 'nombre'},
				{header: "Segundo nombre", sortable: true, width: 110, dataIndex: 'snombre', hidden:true},
				{header: "Primer apellido", sortable: true, width: 110, dataIndex: 'papel'},
				{header: "Segundo apellido", sortable: true, width: 110, dataIndex: 'sapel'},
				{id:'expandir',header: "Permiso", sortable: false, width: 130, renderer: permisoToString, dataIndex: 'todo', editor:cbTipoPermiso}
			],
			store: stEvaluadores,
			autoExpandColumn:'expandir',
			loadMask:{msg: self.labels.lbGridLoadMask},
			region:'west',
			margins: '0 0 5 5',
			width: '50%',
			height: 350,
			sm: new Ext.grid.RowSelectionModel({
				singleSelect:true,
				listeners:{
					rowselect: function(sm, rowIndex, record) {
						btnDelEvaldo.disable();
						btnGuardar.disable();
						if(record.get('todo') == '3'){ gpEvaluados.enable(); } //Habilito la tabla de evaluados en caso de ser un permiso personalizado
						else{gpEvaluados.disable(); }
						stEvaluados.baseParams.idevalseguridadevalentidad = record.get('idevalseguridadevalentidad');
						stEvaluados.reload({params:{start:0, limit:15}});
					}
				}
			}),
			bbar: new Ext.PagingToolbar({
				pageSize: 15,
				store: stEvaluadores,
				displayInfo: true,
				displayMsg: self.labels.lbDisplayMsg,
				emptyMsg: self.labels.lbEmptyMsg
			}),
			keys:kmIindicadorTexto
		});
		
		this.pFichaProcesoEval = new Ext.PVD.Evaluaciones.FichaProcesoEval({
			proceso: self.procesoEval,
			margins:'5 5 5 5',
		});
		
		this.items = [this.pFichaProcesoEval,gpEvaluadores, gpEvaluados]
		Ext.components.Evaluaciones.SeguridadEvaluaciones.WinSeguridadXProcesoEval.superclass.initComponent.call(this);
		
		this.on('show', function(cmp){
			stEvaluadores.baseParams.idpreprocesoevaluativo = self.procesoEval.get('idpreprocesoevaluativo');
			stEvaluadores.load({params:{start:0, limit:15}});
		});
		
		function showWinAddPersona(tipoPersona){
			var winBusPer = new Ext.components.Evaluaciones.WinBuscarPersona();
			winBusPer.show();
			winBusPer.on('close', function(){
				if(tipoPersona == 'controlador'){
					btnAddControlador.focus();
				}else{
					btnAddEvaldo.focus();
				}
			});
			winBusPer.on('peopleSelected', function(selectedRecords){
				PVD.mostrarMascara('idmskadd', self.labels.lbMsgWait, self.labels.lbMaskSavePersona);
				winBusPer.close();
				var arrIdPersonas = new Array();
				for(var i = 0;i < selectedRecords.length; i++){
					arrIdPersonas[i] = selectedRecords[i].get('idpersona');
				}
				var url = (tipoPersona == 'controlador' ? 'adicionarControlador' : 'adicionarEvaluado');
				var idevalseguridadevalentidad = '';
				if(gpEvaluadores.getSelectionModel().hasSelection()){
					idevalseguridadevalentidad = gpEvaluadores.getSelectionModel().getSelected().get('idevalseguridadevalentidad');
				}
				Ext.Ajax.request({
					url: url,
					method:'POST',
					params: {
						idpreprocesoevaluativo: self.procesoEval.get('idpreprocesoevaluativo'),
						arrIdPersonas: Ext.encode(arrIdPersonas),
						idevalseguridadevalentidad: idevalseguridadevalentidad
					},
					callback: function (options,success,response){
						responseData = Ext.decode(response.responseText);
						PVD.ocultarMascara('idmskadd');	
						Ext.Msg.show({
						   title:'Información',
						   msg: 'La persona ha sido adicionada satisfactoriamente ',
						   buttons: Ext.Msg.OK,
						   icon: Ext.MessageBox.INFO,
						   fn: function(btn, text){
								if(tipoPersona == 'controlador'){
									stEvaluadores.reload({params:{limit:15, start:0}});
								} else {
									stEvaluados.reload({params:{limit:15, start:0}});
									btnAddEvaldo.focus();
								}
							}
						});
					}
				});
			});
		}
		
		function cambiarPermisoControlador(idevalseguridadevalentidad, tipoPermiso){
			PVD.mostrarMascara('idmskchangepermisos', self.labels.lbMsgWait, self.labels.lbMskSavePermisos);
			Ext.Ajax.request({
				url: 'cambiarPermisoControlador',
				method:'POST',
				params: {
					idevalseguridadevalentidad: idevalseguridadevalentidad,
					tipoPermiso: tipoPermiso
				},
				callback: function (options,success,response){
					PVD.ocultarMascara('idmskchangepermisos');
					if(tipoPermiso == '3'){ gpEvaluados.enable(); } //Habilito la tabla de evaluados en caso de ser un permiso personalizado
					else{ gpEvaluados.disable(); }
					stEvaluados.reload({params:{limit:15, start:0}});
				}
			});
		}
		
		function guardarPermisosEvaldos(){
			var arrEvaldos  = new Array();
			var arrRecordEvaldos = stEvaluados.getModifiedRecords();
			if(arrRecordEvaldos.length > 0){
				PVD.mostrarMascara('idmsksave', self.labels.lbMsgWait, self.labels.lbMskSavePermisos);
				for(var i=0 ; i < arrRecordEvaldos.length; i++){
					var arrAux = new Array();
					arrAux[0] = arrRecordEvaldos[i].get('idevalaccesoevalentidad');
					arrAux[1] = arrRecordEvaldos[i].get('ver');
					arrAux[2] = arrRecordEvaldos[i].get('modificar');
					arrEvaldos[i]= arrAux;
				}		
				
				Ext.Ajax.request({
					url: 'guardarPermisosEvaldos',
					method:'POST',
					params: {
						arrEvaldos: Ext.encode(arrEvaldos)
					},
					callback: function (options,success,response){
						PVD.ocultarMascara('idmsksave');	
						stEvaluados.reload({params:{limit:15, start:0}});
					}
				});
			}else{
				Ext.MessageBox.show({title: 'Informaci&oacute;n', msg: "No se ha cambiado ning&uacute;n permiso.", buttons: Ext.MessageBox.OK, icon: Ext.MessageBox.WARNING });
			}
		}
		
		function permisoToString(val){
			if(val == '1'){
				return "Ver todo";
			}
			else if(val == '2'){
				return "Ver y modificar todo";
			}
			else if(val == '3'){
				return "Personalizado";
			}
			else{
				return "";
			}
		}
	}
});
