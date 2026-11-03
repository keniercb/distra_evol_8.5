var perfil = {};perfil.dirImg = '../images/default/iconos/';
	perfil.etiquetas = {};
var winAdd,ctrladd=true,cfgridpanel;
var frm = Ext.form;	
var Plant;
	
// Botones btnAddIndPlan btnModificar btnEliminar btnAyuda
	btnAddIndPlan = new Ext.Button({handler:function(){ctrladd=true,winFp('Add');}, text:'Ad<U>i</U>cionar', disabled:true,id:'btnAdd', icon:perfil.dirImg+'actualizar.png', iconCls:'btn'});
	btnModIndPlan = new Ext.Button({handler:function(){ctrladd=false,winFp('Add');}, text:'Modificar', disabled:true,id:'btnMod', icon:perfil.dirImg+'modificar.png', iconCls:'btn'});
	btnEliIndPlan = new Ext.Button({handler:function(){eliminarIndPlan();}, text:'Eliminar',disabled:true,id:'btnEli', icon:perfil.dirImg+'eliminar.png', iconCls:'btn'});
	btnAyudaMod = new Ext.Button({handler:function(){}, text:'Ayuda', id:'btnAyu', icon:perfil.dirImg+'ayuda.png', iconCls:'btn'});



// Store grid stGpGestModelo
	stGpGestModelo =  new Ext.data.Store({
		url:'cargargrid',
		listeners:{'load':function(){smGpGestModelo.selectFirstRow();addNewRecord();}},
		reader:new Ext.data.JsonReader({
			totalProperty: "total",
			root: "data",
			id: "idindplan"
			},Plant,[{name:'idindplan'},{name:'muestra'},{name:'muestra1'}]
		)
	});
// Selection Model grid smGpGestModelo
	smGpGestModelo = new Ext.grid.RowSelectionModel({singleSelect:true});
// Grid gestion gpModelo
	gpModelo = new Ext.grid.EditorGridPanel({ 
		frame:true,  
		store:stGpGestModelo,
		viewConfig: {
        	forceFit: true
		},
		margins:'2 2 2 -4',
		clickstoEdit:1,
		tbar:[btnAddIndPlan,btnModIndPlan,btnEliIndPlan,btnAyudaMod],
		sm:smGpGestModelo,
		cm:new Ext.grid.ColumnModel({}),
		loadMask:{store: stGpGestModelo},
		bbar:new Ext.PagingToolbar({pageSize: 10, store: stGpGestModelo, displayInfo: true, })
	});
// Evento Selection Model grid rowselect
	gpModelo.getSelectionModel().on('rowselect', function (smodel, rowIndex, keepExisting, record ){
		btnModIndPlan.enable();
		btnEliIndPlan.enable();
	}, this);
/***	Panel para inicio de la gesti�n ***/
	pM = new Ext.Panel({
		id:'pm',
		title:'Detalles de modelo',
		layout:'fit',
		items:gpModelo
	});

// function para cargar la configuracion del grid
	function cargarconfgrid(){
		Ext.Ajax.request({
			url: 'cargarconfgrid',
			params:{idmodelo:treesel},
			callback: function (options,success,response){
				var responseData = Ext.decode(response.responseText);
				
				if(responseData.cf){
					cfgridpanel = responseData;
					reconfgrid(responseData);
				}
			}
		});
	}
	function seteditors(text,c){
		var i;
	if(text == "textfield")
		i = new Ext.form.TextField(c);
	if(text == "datefield")
		i = new Ext.form.DateField(c);	
	if (text=="combo"){
		//alert(c.store.url);
		var st = new Ext.data.Store({
			url:c.store.url,
			autoLoad:true,
			
			//listeners:{load:function(st,rcs){alert(rcs.length);}},
			reader:new Ext.data.JsonReader({
				totalProperty: (c.store.url)?c.store.total:"total",
				root: (c.store.data)?c.store.data:"data",
				id: c.valueField
				},[{name:c.valueField},{name:c.displayField}]
			)
		});
		
		c.store= st;
		i = new Ext.form.ComboBox(c);
	}	
	return i;

}
// function para reconfigurar el grid de modelo
	function reconfgrid(cf){
		cf.rd.push({name :'idindplan'});
		cf.cm.push({hidden :true, hideable:false, dataIndex:'idindplan'});
		stGpGestModelo =  new Ext.data.Store({
			url:'cargargrid',
			reader:new Ext.data.JsonReader({
				totalProperty: "total",
				root: "data",
				id: "idindplan"
				},cf.rd
			)
		});
		var i = 0;
		for(i = 0;i < cf.cm.length;i++){
			cf.cm[i].editor =  seteditors(cf.cm[i].value,cf.cm[i].editor);
									}
		gpModelo.reconfigure(stGpGestModelo,new Ext.grid.ColumnModel(cf.cm));
		stGpGestModelo.load({params:{start:0, limit:10,idmodelo:treesel}});
		
	}
// function para configurar el editor del column model

// function para reconfigurar el formulario
function cargarconfform(cf){
	Ext.Ajax.request({
		url: 'cargarconfform',
		params:{idmodelo:treesel},
		callback: function (options,success,response){
			responseData = Ext.decode(response.responseText);
			if(responseData.cf){
				reconfform(responseData);
			}
		}
	});
}
// function para reconfigurar el form
function reconfform(cf){
	if (winAdd) winAdd.remove(fpIndPlan);	
	fpIndPlan = new Ext.FormPanel({
		labelAlign: 'top',
		reader:new Ext.data.JsonReader({
			totalProperty: "total",
			root: "data",
			id: "idindplan"
			},Plant,cfgridpanel.rd
		),
		frame:true,
		autoHeight:true,
		bodyStyle:'padding:5px 5px 0',
		items:{layout:'column',items:Ext.UCID.generaDinamico('form',cf.items)}
	});
	if (winAdd) winAdd.add(fpIndPlan);
	btnAddIndPlan.enable();
}
// function adicionarIndPlan
function adicionarIndPlan(apl){
	if (fpIndPlan.getForm().isValid()){
		fpIndPlan.getForm().submit({
			url: 'adicionar',
			waitMsg:' Por favor espere ... ',
			failure: function(form, action){
				if(action.result.codMsg == 1 || action.result.codMsg == 3){
					mostrarMensaje(action.result.codMsg,action.result.mensaje)
					fpIndPlan.getForm().reset(); 
					if(!apl) winAdd.hide();
					gpModelo.getStore().reload();
					btnModIndPlan.disable();
					btnEliIndPlan.disable();
				}
			}
		});
	} else mostrarMensaje(1,'Por favor verifique nuevamente que hay campo(s) con valor(es) incorrecto(s)');
}
// function eliminarModelo
function eliminarIndPlan(){
	mostrarMensaje(2,'Est&aacute; seguro que desea eliminar el indicador del plan?',elimina);
	function elimina(btnPresionado){
		if (btnPresionado == 'ok'){
			Ext.getBody().mask(' Por favor espere ... ');
			Ext.Ajax.request({
				url: 'eliminar',
				params:{idindplan:gpModelo.getSelectionModel().getSelected().data.idindplan},
				callback: function (options,success,response){
					Ext.getBody().unmask();
					responseData = Ext.decode(response.responseText);
					if(responseData.codMsg == 1 || responseData.codMsg == 3){
						mostrarMensaje(responseData.codMsg,responseData.mensaje);
						gpModelo.getStore().reload();
						btnModIndPlan.disable();
						btnEliIndPlan.disable();
					}
				}
			});
		}
	}
}
// *** Formato de una fila nueva a insertar en el grid
	Plant = Ext.data.Record.create([
		{name: 'denominacion', type: 'string'},
		{name: 'fecha', type: 'date', dateFormat: 'd/m/Y'},
		{name: 'sexo', type: 'string'}
	]);
// Funcion para adicionar un record
	function addNewRecord(){
		var p = new Plant({
			denominacion:'',
			fecha:'',
			sexo:''
		});
		
		gpModelo.stopEditing();
		stGpGestModelo.insert(gpModelo.getStore().getCount(), p);
		gpModelo.startEditing(gpModelo.getStore().getCount()-1, 0);
	}
	// Para verificar si es tecla "Enter(code:13)"
	gpModelo.on('keypress',function(e){
		if(e.getKey() == 13){
			cellSelected = gpModelo.getSelectionModel().getSelectedCell();
			if(cellSelected[1]<gpModelo.getColumnModel().getColumnCount()-2)
				 gpModelo.startEditing(cellSelected[0], cellSelected[1]+1);
			else {alert(1);}
		}
	});