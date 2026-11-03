
/**
 * @author Ariadna Rendï¿½n Artola
 */

Ext.QuickTips.init();
var perfil = window.parent.UCID.portal.perfil
perfil.etiquetas = Object();
//UCID.portal.cargarEtiquetas('calendario',cargarInterfaz);


//************DECLARACION DE VARIABLES***************//

	var popo =1;
	var add = false;
	var flag = false;
	var calendar, tabCalendario,calendarstoretest,calendario, stInvolucrados, stEnlaces;
	var tpbuscarTareasInv, tpAutores, tpbuscarTareasCategoria,winAddAct,winModAct,tmptest,weekrange;
	var reader,hiddenPkgs = [], paccordion,pDatosVista, tpactivo,filter,id, rootNodeTp, rootNodeTpCat, rootNodeTpResp;
	var involucrados,categorias, tipoact, autores,tareaMod,planes;
	var contadorTab=0; 
	var tpbuscarTareasResp, cbTabs,idautor;
	
	var modificar, eliminar;
	
	var sttgcategact,smtgcategact,tgcategact;
	var sttgtipoact,smtgtipoact,tgtipoact;
	var prevrow = -1,prevrow2 = -1;
	var categactivado = 0,tipoactivado = 0,planactivado = 0;
	var sttgplan,smtgplan,tgplan;
//function cargar interfaz   
function cargarInterfaz(){

//-------------------conf. de bbar para interfaz principal de objetivos y act-----------
var offset = 0;
var limit = 10;
var totalpaginas = 0;
var countpag = 0;
var tfpagactual,tfpagtotal,tftotalobjencontrados;
var btnatras,btnalante;


tfpagactual = new Ext.form.TextField({
		id: 'tfpagactual',
		value:countpag,
		readOnly:true, 
		width: 30
	});
	
tfpagtotal = new Ext.form.TextField({
		id: 'tfpagtotal',
		value:countpag,
		readOnly:true, 
		width: 30
	});
	
tftotalobjencontrados = new Ext.form.TextField({
		id: 'tftotalobjencontrados',
		value:countpag,
		readOnly:true, 
		width: 30
	});

	

btnatras = new Ext.Button({disabled:true,handler:function(){ActualizarYRecargar('atras');}, id:'btnatras', /*icon:perfil.dirImg+'anterior.png',*/ iconCls:'anterior', tooltip:'Anterior '});
btnalante = new Ext.Button({disabled:true,handler:function(){ActualizarYRecargar('alante');}, id:'btnalante', /*icon:perfil.dirImg+'siguiente.png',*/ iconCls:'siguiente', tooltip:'Siguiente'});

function ActualizarDatosBbar(store)
{
	btnalante.disable();
	btnatras.disable();
	tftotalobjencontrados.setValue(store.getTotalCount());
	totalpaginas = (store.getTotalCount())/limit;
	if(totalpaginas%limit != 0)
	{totalpaginas = Math.ceil(totalpaginas);}
	tfpagtotal.setValue(totalpaginas);
	if(store.getTotalCount() > 0)
	{
	 switch(countpag)
	 {
	  case 0:
		countpag++;
		tfpagactual.setValue(countpag);
		ActualizarEstadoBotonesNav(store);
	  break;
	  
	  default:
		tfpagactual.setValue(countpag);
		ActualizarEstadoBotonesNav(store);
	 }
	}
	if(store.getTotalCount() == 0)
	{
		tfpagactual.setValue(0);
	}
}

function ActualizarEstadoBotonesNav(store)
{	
	if(countpag < totalpaginas)
	{
		btnalante.enable();
		if(countpag > 1){btnatras.enable();}		
	}
	else{
		if(countpag == totalpaginas)
		{
			if(countpag > 1){btnatras.enable();}
		}
	}
	
}
//-------------------------------------------------END-----------------------------------------------
















btnPanelBusqueda = new Ext.Button({ disabled:false,id:'btnPanelBusqueda', /*icon:perfil.dirImg+'buscar.png',*/ iconCls:'buscar', tooltip:'Buscar actividades por diferentes criterios',handler:function(){accOpciones.expand();}});


// declaraciones que permiten utilizar las funciones implementadas en calendar.js 
tmptest= new Ext.ECalendar({});
weekrange = tmptest.getDateRangeOfWeekByDate(0,new Date());  

btnActivar = new Ext.menu.Item({
    id:'activar',
	text:'Activar',
	iconCls:'habilitar',
	disabled:true 
	//icon:perfil.dirImg+'habilitar.png'
});
btnDesActivar = new Ext.menu.Item({
	id:'desactivar',
	text:'Desactivar',
	iconCls:'deshabilitar',
	disabled:true
	//icon:perfil.dirImg+'deshabilitar.png'
});
btnDuplicar = new Ext.menu.Item({
	text:'Duplicar', 
	disabled:true,
	id:'duplicar', 
	//icon:perfil.dirImg+'duplicar.png', 
	iconCls:'duplicar', 
	tooltip:'Duplicar actividad',
	
});
menuImprimir = new Ext.menu.Menu({
	items:[
	{
		text:'Vista previa', 
		id:'preview', 
		//icon:'../../../comun/recursos/images/fam/search.gif',
		iconCls:'buscar'	,
		handler:function(){sendDataActual('preview');}
	},
	{
		text:'Word',
		id:'word',
		icon:'../../../comun/recursos/images/fam/page_word.png',
		handler:function()
		{
			/*formatoreporte = 'doc';
			GenerarReporte();*/
			sendDataActual('doc');
		}
	},
	{
		text:'Excel',
		id:'excel',
		icon:'../../../comun/recursos/images/fam/page_excel.png',
		handler:function()
		{
			/*formatoreporte = 'xls';
			GenerarReporte();*/
			sendDataActual('xls');
		}
	},{
		text:'Html',
		id:'html',
		icon: '../../../comun/recursos/images/fam/page_world.png',
		handler:function()
		{
			/*formatoreporte = 'html';
			GenerarReporte();*/
			sendDataActual('html');
		}
	}	
	/*{
		text:'Formato de impresi&oacute;n', 
		id:'formatoimp', 
		icon:perfil.dirImg+'exportar.png', 
		iconCls:'btn', 	
		menu: new Ext.menu.Menu({
			items:[	{
						text:'HTML', 						
						id:'web', 
						icon: '../../../comun/recursos/images/fam/page_world.png',
						iconCls:'btn'	,
						handler:function(){sendDataActual('html');}	
					},	{
						text:'Word', 						
						id:'word', 
						icon:'../../../comun/recursos/images/fam/page_word.png', 
						iconCls:'btn',
						handler:function(){sendDataActual('doc');}	
					},	{
						text:'Excel', 						
						id:'excel', 
						icon:'../../../comun/recursos/images/fam/page_excel.png', 
						iconCls:'btn',
						handler:function(){sendDataActual('xls');}	
					}]
		})
	
	}*/]
});
btnimprimir = {
	text:'Imprimir', 
	//disabled:true,
	id:'imprimir', 
	//icon:perfil.dirImg+'imprimir.png', 
	iconCls:'imprimir',
    menu: menuImprimir
};
reader = new Ext.data.JsonReader({
			root: "data",
			id: "id"
			},[	
			   {name: 'id' 		, type: 'int'},
		       {name: 'subject'		, type: 'string'}, 
			   {name: 'description'	, type: 'string'},
		       {name: 'startdate'	, type: 'string'},  
			   {name: 'enddate'  	, type: 'string'},
		       {name: 'color'		, type: 'string'},
			   
			   {name: 'categoria'		, type: 'int'}, 
			   {name: 'caducidad'	, type: 'int'},
			   {name: 'categoria'	, type: 'string'} ,
			   {name: 'tipoact'	    , type: 'string'},
			   {name: 'lugar'	    , type: 'string'}, 
			   {name: 'participan'  , type: 'string'}, 
			   {name: 'estadocump'	, type: 'string'},		
			   {name: 'gradocump'	, type: 'string'},
			   {name: 'modificar'	, type: 'string'},
			   {name: 'eliminar'	, type: 'string'},
			   {name: 'activo'	, type: 'string'},
			   {name: 'idautor'}
			]);


			
//Acordion de autores
	tpAutores = new Ext.tree.TreePanel(
	{	  
		title: 'Por autor',
		border: false,		
		id:'tpAutores',
		height: 350,
		margins     : '3 4 3 3',
		cmargins    : '3 3 3 3',
		defaults: {bodyStyle: 'padding:15px'},
		rootVisible:true,			
		containerScroll: true,
		animate:true,
		tbar:['->',{   iconCls:'x-btn-text-icon',
					   tooltip: 'Expandir',
                       icon: '../../views/css/calendario/images/expand-all.gif',
		         	   handler: function(){ tpAutores.root.expand(true); }       
				 },{
						iconCls: 'icon-collapse-all',
		                tooltip: 'Contraer ',
						icon: '../../views/css/calendario/images/collapse-all.gif',
		                handler: function(){ tpAutores.root.collapse(true); }
				 }],
				 listeners:{
				    click:function(n){},
					contextmenu: function(n,e){
					   	 e.stopEvent();
					   	 DesChekedAll();
					   	 n.getUI().toggleCheck(true);
											n.attributes.checked = true;
						 tpbuscarTareasInv.selModel.select(n);
						 var NodoMenu = new Ext.menu.Menu({ 
								 id: 'NodoMenu',
							     items: [/*{
										text: 'Filtrar tareas por involucrados',
										icon:perfil.dirImg  + 'filtrar.png',
										iconCls:'btn',
										id:'filtrar_Act',
										handler : function(){
													filtrarAct(); 
										}
									},*/{
										text: 'Consultar tareas del usuario '+n.text,
										//icon:perfil.dirImg  + 'buscar.png',
										iconCls:'buscar',
										id:'verAct',
										handler : function(){											
											autores = nodosChekedAutores();
											 if(!Ext.getCmp('user_calendar'+n.id))
													(n.tipo != 0 &&n.id != '1root' && n.id != 'nodo1' && n.id != 'nodo2' && n.id !='nodo3' && n.id !='nodo4')?MostrarCalendarios(false,n):'';
													
										}}]
							});
						 if(n.tipo != 0 &&n.id != '1root' && n.id != 'nodo1' && n.id != 'nodo2' && n.id !='nodo3' && n.id !='nodo4')
						 {
							 var xy = e.getXY();
							 tpbuscarTareasInv.contextMenu = NodoMenu;
							 tpbuscarTareasInv.contextMenu.showAt(xy);   
						 }
						
					 }
			}
				 ,
		root:{
	            text: 'Autores',
				expanded:true,
	            id:'rootNodoAutores',
				children: [
							{
								nodeType: 'async',
								id: 'nodo1',
								idgrupo: 'nodo1',
								text: 'Mi usuario',
								tipo: '2',
								leaf: false
							},{
								nodeType: 'async',
								id: 'nodo2',
								idgrupo: 'nodo2',
								text: 'Usuarios subordinados',
								tipo: '2',
								leaf: false
							},{
								nodeType: 'async',
								id: 'nodo3',
								idgrupo: 'nodo3',
								text: 'Otros usuarios(permisos de leer nivel superior) ',
								tipo: '2',
								leaf: false
							}]	
							
        }, 	
		loader:new Ext.tree.TreeLoader({
			singleClickExpand:true, 
			dataUrl:'cargarautores',
			listeners:{
			     'beforeload':function(atreeloader, anode){ 
                 atreeloader.baseParams = {tipo:anode.attributes.tipo, idgrupo:anode.attributes.idgrupo,idusuario:anode.attributes.idusuario};},
				 'load':function(atreeloader, anode){
				}
			}
		})			
	});	
	
//Treepanel que permite la busqueda segun el involucrado
tpbuscarTareasInv = new Ext.tree.TreePanel({
			title: 'Por involucrado',
			border: false,			
			id:'tpBuscarInv',
			autoScroll:true, 
			height: 350,
			margins     : '3 4 3 3',
			cmargins    : '3 3 3 3',
			defaults: {bodyStyle: 'padding:15px'},
			rootVisible:true,			
			containerScroll: true,
			animate:true, 			
			tbar:['->',{   iconCls:'x-btn-text-icon',
					   tooltip: 'Expandir',
                       icon: '../../views/css/calendario/images/expand-all.gif',
		         	   handler: function(){ tpbuscarTareasInv.root.expand(true); }       
				 },{
						iconCls: 'icon-collapse-all',
		                tooltip: 'Contraer ',
						icon: '../../views/css/calendario/images/collapse-all.gif',
		                handler: function(){ tpbuscarTareasInv.root.collapse(true); }
				 }],
			listeners:{
				    click:function(n){},
					 contextmenu: function(n,e){
					   	 e.stopEvent();
						 tpbuscarTareasInv.selModel.select(n);
						 var NodoMenu = new Ext.menu.Menu({ 
								 id: 'NodoMenu',
							     items: [/*{
										text: 'Filtrar tareas por involucrados',
										icon:perfil.dirImg  + 'filtrar.png',
										iconCls:'btn',
										id:'filtrar_Act',
										handler : function(){
													filtrarAct(); 
										}
									},*/{
										text: 'Consultar tareas del involucrado',
										//icon:perfil.dirImg  + 'buscar.png',
										iconCls:'buscar',
										id:'verAct',
										handler : function(){
											 if(!Ext.getCmp('user_calendar'+n.id))
													(n.tipo != 0 &&n.id != '1root' && n.id != 'nodo1' && n.id != 'nodo2' && n.id !='nodo3' && n.id !='nodo4')?MostrarCalendarios(false,n):'';
													
										}}]
							});
						 if(n.tipo != 0 &&n.id != '1root' && n.id != 'nodo1' && n.id != 'nodo2' && n.id !='nodo3' && n.id !='nodo4')
						 {
							 var xy = e.getXY();
							 tpbuscarTareasInv.contextMenu = NodoMenu;
							 tpbuscarTareasInv.contextMenu.showAt(xy);   
						 }
						
					 }
			},
			loader:new Ext.tree.TreeLoader({
			    singleClickExpand:true, 
				dataUrl:'cargarInvolucrados',
				listeners:{ 
					beforeload: function(tl, node){ 
					       tl.baseParams = {idgrupo:node.attributes.idgrupo, tipo:node.attributes.tipo, idusuario:node.attributes.idusuario};
				    }
				}
			})
	})
		 rootNodeTp = new Ext.tree.TreeNode({
				text:'Clasificador de involucrados',
				expanded:true,				
				id:'1root'
			});
		var nodeMiUs = new Ext.tree.AsyncTreeNode({
				text :'Mi usuario',				
		        leaf:false,				
				id :'nodo1',
				idgrupo: 'nodo1',
				tipo:'nodo1'
			});
		var nodeMisGP = new Ext.tree.AsyncTreeNode({
				text :'Mis grupos',				
		        leaf:false,				
				id :'nodo2',
				idgrupo: 'nodo2',
				tipo:'nodo2'
			});
		var nodeUsersGP = new Ext.tree.AsyncTreeNode({
				text :'Usuarios subordinados',				
		        leaf:false,						
				id :'nodo3',	
				idgrupo: 'nodo3',
				tipo:'nodo3'
			});
		rootNodeTp.appendChild([nodeMiUs,nodeMisGP,nodeUsersGP]);
		tpbuscarTareasInv.setRootNode(rootNodeTp);

		
		
//Panel de las opciones de busqueda de tareas por categoria
sttgcategact = new Ext.ux.maximgb.treegrid.AdjacencyListStore({
		url: '/planificacion/pdo/configuracion/index.php/gestionarnomencladores/cargarNomencladores',
		reader: new Ext.data.JsonReader(
		{
			id: 'idnom' ,
			root: 'data',
			totalProperty: 'total' 
			},
			[
			   {name: 'idnom'},
			   {name: 'denom'},			   
			   {name: '_parent'},
			   {name: '_is_leaf'},
			   {name: 'superior'}
			]			
		)
	});

smtgcategact = new Ext.grid.CheckboxSelectionModel({
	   singleSelect:false,
	   listeners:{
	        rowselect: function(sm,indice,record){ 	 
				if (prevrow>=0 && prevrow!=indice)
				{
					Ext.get(tgcategact.getView().getRow(prevrow)).removeClass('superior2');
					Ext.get(tgcategact.getView().getRow(prevrow)).addClass('superior');						
				} 
				if (record.data.superior==1) 
				{ 
					Ext.get(tgcategact.getView().getRow(indice)).removeClass('superior');
					Ext.get(tgcategact.getView().getRow(indice)).addClass('superior2');
					prevrow = indice;
				} else prevrow = -1;	
			}
		}
	});
	
tgcategact = new Ext.ux.maximgb.treegrid.GridPanel({
		store: sttgcategact,
		title:'Por categoría de actividad',
		id:'tgcategact',
		master_column_id : 'expandir',
		autoExpandColumn:'expandir',
		stripeRows: true,
		sm:smtgcategact,
		root_title:' ',
		loadMask:{msg :'Cargando tipos de actividad'},
		columns: [
			smtgcategact,
			{hidden:true , dataIndex: 'idnom'},
			{hidden:true , dataIndex: 'superior'},
			{id:'expandir',header: 'Denominación',dataIndex: 'denom'},
		],
		listeners:{
			activate:function(p){
				if(categactivado == 0)
				{
					categactivado = 1;
					tiponom = 2;
					sttgcategact.removeAll();
					sttgcategact.load({params:{tiponom: tiponom}});
					/*tipono = 2;
					storeGridCategact.removeAll();
					storeGridCategact.load({params:{tiponom: tipono}});*/
				}			
			}
		}	
	});
	
tgcategact.getView().getRowClass = function(ri,n)
	{
		if (ri.data.superior == 1) return "superior";
	    else return "";
	}



tpbuscarTareasCategoria = new Ext.tree.TreePanel({
			title: '<b>Por categoria de actividad</b>',
			border: false,			
			id:'tpBuscarCat',
			height: 350,
			margins     : '3 4 3 3',
			cmargins    : '3 3 3 3',			
			defaults: {bodyStyle: 'padding:15px'},
			rootVisible:true,
			autoScroll:true,
			containerScroll: true,
			animate:true, 
			tbar:['Buscar: ',{
			          xtype: 'textfield',		   		     
			          id: 'tfBuscarcat',
					  width: 150,
					  listeners:{
							render: function(f){
								f.el.on('keydown', filterTree, f, {buffer: 350});
							}
						}
			     },{   iconCls:'x-btn-text-icon',
					   tooltip: 'Expandir',
                       icon: '../../views/css/calendario/images/expand-all.gif',
		         	   handler: function(){ tpbuscarTareasCategoria.root.expand(true); }       
				 },{
						iconCls: 'icon-collapse-all',
		                tooltip: 'Contraer ',
						icon: '../../views/css/calendario/images/collapse-all.gif',
		                handler: function(){ tpbuscarTareasCategoria.root.collapse(true); }
				 }],
			listeners:{
				    click:function(n){},
			 		contextmenu: function(n,e){e.stopEvent();}
			},
			loader: new Ext.tree.TreeLoader({
				dataUrl:'cargarCategActv',
				preloadChildren: true,
				listeners:{
					beforeload:function(tl,n){},
					load:function(tl,n){}
				}
			})
		});
 rootNodeTpCat = new Ext.tree.AsyncTreeNode({
				text:'Categorias de actividad existentes:',
				tipo:'root',
				expanded:true,
				id:'2root'
			});		
		tpbuscarTareasCategoria.setRootNode(rootNodeTpCat);
		
//Panel de las opciones de busqueda de tareas por tipo

smtgtipoact = new Ext.grid.CheckboxSelectionModel({
   singleSelect:false,
   listeners:{
		rowselect: function(sm,indice,record){ 	 
			if (prevrow2>=0 && prevrow2!=indice)
			{
				Ext.get(tgtipoact.getView().getRow(prevrow2)).removeClass('superior2');
				Ext.get(tgtipoact.getView().getRow(prevrow2)).addClass('superior');						
			} 
			if (record.data.superior==1) 
			{ 
				Ext.get(tgtipoact.getView().getRow(indice)).removeClass('superior');
				Ext.get(tgtipoact.getView().getRow(indice)).addClass('superior2');
				prevrow2 = indice;
			} else prevrow2 = -1;	
		}
	}
});
	
sttgtipoact = new Ext.ux.maximgb.treegrid.AdjacencyListStore({
	url: '/planificacion/pdo/configuracion/index.php/gestionarnomencladores/cargarNomencladores',
	reader: new Ext.data.JsonReader(
	{
		id: 'idnom' ,
		root: 'data',
		totalProperty: 'total' 
		},
		[
		   {name: 'idnom'},
		   {name: 'denom'},			   
		   {name: '_parent'},
		   {name: '_is_leaf'},
		   {name: 'superior'}
		]			
	)
});
	
tgtipoact = new Ext.ux.maximgb.treegrid.GridPanel({
	store: sttgtipoact,
	title:'Por tipo de actividad',
	id:'tgtipoact',
	master_column_id : 'expandir',
	autoExpandColumn:'expandir',
	stripeRows: true,
	sm:smtgtipoact,
	root_title:' ',
	loadMask:{msg :'Cargando categorias de actividad'},
	columns: [
		smtgtipoact,
		{hidden:true , dataIndex: 'idnom'},
		{hidden:true , dataIndex: 'superior'},
		{id:'expandir',header: 'Denominación',dataIndex: 'denom'},
	],
	listeners:{
		activate:function(p){
			if(tipoactivado == 0)
			{
				tipoactivado = 1;
				tiponome = 3;
				sttgtipoact.removeAll();
				sttgtipoact.load({params:{tiponom: tiponome}});
			}			
		}
	}	
});
	
tgtipoact.getView().getRowClass = function(ri,n)
{
	if (ri.data.superior == 1) return "superior";
	else return "";
}


tpbuscarTareasResp = new Ext.tree.TreePanel({
			title: '<b>Por tipo de actividad</b>',
			border: false,			
			id:'tpBuscarTareasResp',
			height: 350,
			margins     : '3 4 3 3',
			cmargins    : '3 3 3 3',			
			defaults: {bodyStyle: 'padding:15px'},
			rootVisible:true,
			autoScroll:true,
			tbar:['Buscar: ',{
			          xtype: 'textfield',		   		     
			          id: 'tfBuscarresp',
					  width: 150,
					  listeners:{
							render: function(f){
								f.el.on('keydown', filterTree, f, {buffer: 350});
							}
						}
			     },{   iconCls:'x-btn-text-icon',
					   tooltip: 'Expandir',
                       icon: '../../views/css/calendario/images/expand-all.gif',
		         	   handler: function(){ tpbuscarTareasResp.root.expand(true); }       
				 },{
						iconCls: 'icon-collapse-all',
		                tooltip: 'Contraer ',
						icon: '../../views/css/calendario/images/collapse-all.gif',
		                handler: function(){ tpbuscarTareasResp.root.collapse(true); }
				 }],
			listeners:{				   
			 		contextmenu: function(n,e){e.stopEvent();}
			},
			loader: new Ext.tree.TreeLoader({
				dataUrl:'cargarTipoActv',
				listeners:{
					beforeload:function(tl,n){},
					load:function(tl,n){}
				}
			})
		});
		 rootNodeTpResp = new Ext.tree.AsyncTreeNode({
				text:'Tipos de actividad existentes:',
				tipo:'root',
				expanded:true,
				//iconCls:'grupo'
				id:'3root'
			});
		tpbuscarTareasResp.setRootNode(rootNodeTpResp);

		
//panel donde muestro los planes existentes
sttgplan = new Ext.ux.maximgb.treegrid.AdjacencyListStore({		
		url:'/planificacion/pdo/plan/index.php/gestionarplan/cargarGridPlanes',
		listeners:{				
			load :function(store,record,options)
			 {  		
				ActualizarDatosBbar(store);
				store.each(function(rec){
				  if(rec.data._is_leaf == false)
				  {
					store.expandNode(rec);
				  }
				})
			 }
		},
		reader:new Ext.data.JsonReader({
			id:'idplan',
			totalProperty: "total",
			root: "campos"		
			},[{name:'idplan'},{name:'denominacion'},{name:'categoria'},{name:'estado'},
			{name:'fini'},{name:'ffin'},{name:'desc'},{name:'_parent'},{name:'_is_leaf'}])
	});

smtgplan = new Ext.grid.CheckboxSelectionModel({
	singleSelect:false,
	 listeners: {
	 	rowselect: function(sm,ri,record){	
 			//idplan = record.data.idplan;
 		},
		rowdeselect: function(sm,ri,record){	
 			//idplan = null;
 		}
	 }
	});	

function MostrarImagenTipoElemento(valor)
{
 return '<span><img src="../../../comun/recursos/images/fam/plan.png" >'+' '+valor+'</span>';
}
	
tgplan = new Ext.ux.maximgb.treegrid.GridPanel({
		title:'Por mis planes',
		autoScroll:true,
		store: sttgplan,
		frame:true,
		master_column_id : 'expandir',
		autoExpandColumn:'expandir',
		stripeRows: true,
		sm:smtgplan,
		loadMask:{msg :'Cargando planes'},
		root_title: 'Planes',
		columns:[
				smtgplan,
		        {hidden:true, hideable: false, dataIndex: 'idplan'},
				{header: '<center>'+"Denominaci&oacute;n"+'</center>',id:'expandir', renderer:MostrarImagenTipoElemento,dataIndex: 'denominacion', sortable:true}/*,
				{header: '<center>'+"Categor&iacute;a"+'</center>', dataIndex: 'categoria', width:100,sortable:true,renderer:Centrado},  				
				{header: '<center>'+"Fecha de Inicio"+'</center>', dataIndex: 'fini', width:75,sortable:true,renderer:renderFecha},  
				{header: '<center>'+"Fecha de Fin"+'</center>', dataIndex: 'ffin', width:70,sortable:true,renderer:renderFecha}*/
		],
		listeners:{
			activate:function(p){
				if(planactivado == 0)
				{
					planactivado = 1;
					sttgplan.removeAll();
					offset = 0;
					limit = 10;
					sttgplan.load({params:{offset:offset,limit:limit}});
				}			
			}
		},
		bbar:[btnatras,'-','Pagina ',tfpagactual,' de ',tfpagtotal,'-',btnalante,'->','Encontrados ',tftotalobjencontrados,' resultados'],

	});
	
	
	function ActualizarYRecargar(direccion)
	{
		if(direccion == 'alante')
		{
			offset = offset+10;
			countpag++;
		}
		else
		{	
			offset = offset-10;
			countpag--;
		}
		sttgplan.reload({params:{offset:offset,limit:limit}});
		
	}
	
	
		

// Acordion que integra las opciones del plan individual
 pDatosVista = new Ext.Panel({
				id:'dataCalendar', 
				height: 100,
				region:'south',
				collapsible:true,
				collapsed:true,
				frame:false, 				
				title:'Datos de la vista actual', 
				border: false,
				bodyStyle:'padding:7px;font-family:Verdana;font-weight: bold;font-size: 11px;background-image: url(../../views/css/calendario/images/cliente.png);	background-repeat: no-repeat; background-position: 140px 55px;background-width:28px;background-height:18px',			
				layout:'form',				
				items:[
						{border:false,items:[{xtype:'label', text: 'Total de actividades: '},{xtype:'label',text: ' 0',id:'act' }]}					
				      ]
			  
				
});
 paccordion = new Ext.TabPanel({
			id:'paccordion',
			region:'center',
			minTabWidth: 115,
			tabWidth:135,
			enableTabScroll:true,
			width:350,
			height:600,
			defaults: {autoScroll:true},
			plugins: new Ext.ux.TabCloseMenu(),
			activeTab:0,
			border: false, 	
			items:[tpbuscarTareasInv,tpAutores,tgcategact,tgtipoact,tgplan]
});
 cbTabs = new Ext.form.Checkbox({
	checked : true,
	id : 'cbTabs'	
});

var lbTabs = new Ext.form.Label({
	text : '1 calendario de busqueda :',
	id : 'lbTabs'
	
});

 accOpciones = new Ext.Panel({
    title: 'Filtro de actividades',
    width: 300,	
	margins     : '3 5 3 3',
	cmargins    : '3 3 3 3',
    region: 'west',
    collapsible: true,
	collapsed:true, 
	border:true, 
	layout:'border',
    tbar:[{text: 'Filtrar',
				   id:'filtrar',
				   //icon: perfil.dirImg  + 'filtrar.png',
				   iconCls:'filtrar',
				   handler: function(){						
						filtrarAct();
				   }
				 },{
				   text: 'Limpiar',
				   id:'limpiar',
				   //icon: perfil.dirImg  + 'limpiar.png',
				   iconCls:'limpiar',
				   handler: function(){	
					if(tabCalendario.getActiveTab().Datos!=''){
						DesChekedAll();	//Deseleccionar todos Falta por implementar
						involucrados = '';		 			
		 				categorias = '';		 
		 				tipoact = '';						
						//calendario.store.removeAll();
						//calendario.refreshCalendarView();
						}else mostrarMensaje(1,'Usted no ha efectuado ninguna b&uacute;usqueda');
								
				   }
				   }, '->',lbTabs,
				   cbTabs],	
    items: [paccordion,pDatosVista]
});
	
//Tab donde se ubica el objeto calendario
 tabCalendario = new Ext.TabPanel({
        activeTab: 0,
		title:'add',
        frame:true,
		border:true,
		plain  		:true,
		layoutOnTabChange: true,  //needed for the calendar 
		deferredRender :   true, 
		region: 'center',
		margins     : '3 3 3 0',
	    cmargins    : '3 3 3 3',
        defaults:{autoHeight: true},
		enableTabScroll: true,		
		closable : true,       
		listeners:{
					tabChange:function(TabPanel,newTab){
						LlenarValoresBusqueda(tabCalendario.getActiveTab());		           	     		
					},
					beforetabchange : function( TabPanel , newTab, currentTab ){
						calendario = newTab;
					}
				  }
});

//variables auxiliares para filtrar tree
 tpactivo = paccordion.layout.activeItem;	
 filter = new Ext.tree.TreeFilter(tpactivo, {clearBlank: true, autoClear: true});
 


//Viewport donde se muestra los componentes
 vp = new Ext.Viewport({
    layout: 'fit',
    items:[{xtype:'panel', layout: 'border',items:[accOpciones, tabCalendario]}],
	
});
MostrarCalendarios(true,null);
}












//Function que construye los objetos calendarios tanto personal como de los usuarios involucrados
function MostrarCalendarios(personal,nodo){
	id = (personal)?'personal':''+nodo.id;
	if (!Ext.get(id)) {
		add=true;
	tabCalendario.add(
		new Ext.ECalendar({
		id: id, 
		name: id, 
		tipo: (personal)?3:nodo.tipo,		
		title: (personal)?'Calendario Personal':'Calendario de '+nodo.text, 			
		border:false,
		closable :(personal)?false:true,
		showCal_tbar: true, 
		//tbar_add_button: btnimprimir,
		showRefreshbtn:true,
		refreshAction:'data',
		currentView: 'day',		
	    fieldsRefer:{ //0.0.11 
			id:'id',
			subject:'subject',
			description:'description', 
			color:'color',
			startdate:'startdate',
			enddate:'enddate'
			//location:'location'
		},
		storeOrderby:'priority', 	//0.0.11 
		storeOrder:'DESC',		//0.0.11 
		currentdate: new Date(),
		dateSelector: true,
		dateSelectorIcon: '../../views/css/calendario/images/date.png',
		dateSelectorIconCls: 'x-cmscalendar-icon-date-selector',
		dateformat :'d-m-Y',
		iconCls: 'x-cmscalendar-icon-main',
		dateSelector:true,
		store:new Ext.data.Store({
				url:'cargarActividades',		
				reader: reader,
				listeners:{ 
					beforeload : function(st,conf){
						Ext.getBody().mask('Cargando actividades');						
					},
					load: function(st,conf){
							Ext.getCmp('act').setText(st.getCount());
							/*Ext.getCmp('talleres').setText(st.query('tipoact','0').getCount());
							Ext.getCmp('reuniones').setText(st.query('tipoact','1').getCount());
							Ext.getCmp('visitas').setText(st.query('tipoact','2').getCount());*/
							tabCalendario.getActiveTab().refreshCalendarView();							
							Ext.getBody().unmask();
							if(document.getElementById(tabCalendario.getActiveTab().id+"-daybody"))
								document.getElementById(tabCalendario.getActiveTab().id+"-daybody").style.height=960;
					},
					loadexception : function () { Ext.getBody().unmask();}}//mostrarMensaje(1,"Usted no tiene actividades para la fecha de la vista actual.");
			}), 
		monitorBrowserResize:true, 
		widgetsBind: {bindMonth:null,bindDay:null,binWeek:null},
		tipmaxLength: 200, 		//0.0.15 
		tplTaskTip : new Ext.XTemplate( 
		'<tpl for=".">{location}<br />{starxl}{startval}<br/>{endxl}{endval}<hr color=\'#003366\'noshade><br/>{details}</tpl>'
		//'<tpl></tpl> '
    	),
		tplTaskZoom: new Ext.XTemplate( 
		/*'<tpl for=".">',
			'<div class="ecal-show-basetasktpl-div"><b>Denominaci&acute;n:</b>{subject}<br>',
			'<b>Inicio:</b>{startdate}<br><b>Fin:</b>{enddate}',
			'<br><b>Detalles:</b><div><hr><div>{description}<div><hr>',
		'</tpl>'*/
		),
		iconToday:'../../views/css/calendario/images/cms_calendar.png',
		iconMonthView:'../../views/css/calendario/images/calendar_view_month.png',
		iconWeekView:'../../views/css/calendario/images/calendar_view_week.png',
		iconDayView:'../../views/css/calendario/images/calendar_view_day.png',
		iconSchedView:'../../views/css/calendario/images/calendar_view_schedule.png',
		loadMask:false, //0.0.12  we dont need this saple here cause all the data is loaded its suits better  for Serverside loading 
		customMaskText:'E2CS DEMO<br>Wait a moment please...!<br>Processing Information for calendar', //0.0.12 		
		//-------- NEW on 0.0.10 -------------------
		//-------------------------------------------
		mview:{
			header: true,
			headerFormat:'F-Y',
			headerUseTpl:true,	
			headerTpl: new Ext.XTemplate('<tpl for=".">{title} - {datetouse:this.fmtfecha}</tpl>',
				{
					fmtfecha:function(value){	
						return value.format('M Y');	
					}
			}),
			headerData:{	
				title:'Mes actual', 
				datetouse:new Date()//12/12/2008 10:00:00 am
			},		
			headerButtons: true,
			showTaskcount: false,
			dayAction:'event',    //dayAction: //viewday , event, window			
			startDay:0,//ESTA ES LA PROPIEDAD QUE ME HACE REFERENCIA A QUE DIA COMIENZA EL MES(DOMINGO,LUNES..ETC)
		    taskStyle:'margin-top:2px;', //Css style for text in day(if it has tasks and showtaskcount:true)
			showTaskList: true,
			showNumTasks:10,
			TaskList_launchEventOn:'click', //0.0.11 
			TaskList_tplqTip: new Ext.XTemplate( '<tpl for=".">{location}{starxl}{startval}<br>{endxl}{endval}<hr color={color}  noshade>{details}</tpl>' ), //0.0.11 
			//TaskList_tplqTip: new Ext.XTemplate( "<tpl for='.'>{location}{starxl}{startval}<br>{endxl}{endval}<hr color=\'"+#003366+"\' noshade>{details}</tpl>" ), //0.0.11  {subject}     \'#003366\'
			ShowMenuItems:[1,1,1,1,0,1],  //0.0.11  - ADD, nextmonth, prevmonth, chg Week , CHG Day, chg Sched,	
			TaskList_moreMenuItems:[btnActivar, btnDesActivar, btnDuplicar], 	  //0.0.11
			TaskList_ShowMenuItems:[1,1,1]//0.0.11 	- Add, DELETE, EDIT 	
		},
		wview:{
			headerlabel:'Semana #',
			headerButtons: true,
			dayformatLabel:'D j',
			daylabelES:true,
			headerUseTpl:true,					//0.0.15 new property to adapt the title header customizable 
			headerTpl: new Ext.XTemplate('<tpl for=".">{title} del {initday:this.formatx} al {enday:this.formatx}</tpl>',{	formatx:function(value){return value.format('d/m/Y');	}	}),
			headerData:{ title:'Tareas de la semana ', initday:weekrange[0],enday:weekrange[1] },		
			moreMenuItems:[ btnActivar, btnDesActivar, btnDuplicar],
			style: 'google',
			hourFormat: 'G:i',
			alldayTaksMore:'window', 
			alldayTasksMaxView:6,
			taskAdd_timer_dblclick:true, 	//0.0.15 
			//scrolltoHour:true, 
			startTime: '07:00:00 am',
			endTime:   '10:59:59 pm',			
			store: null, 
			task_width:25, 
			tasksOffset:10,
			headerDayClick:'viewday',
			ShowMenuItems:[1,1,1,1,1,0],	//0.0.11  add, go next w , go prev w , chg month , chg day, chg sched 
			task_ShowMenuItems:[1,1,1,1,1], //0.0.11  add, delete, edit, go next w , go prev w
			task_eventLaunch:'dblclick',		//0.0.11
			startDay:0, //sundays   0.0.14 
			//task_clsOver:'test_taskovercss',
			forceTaskFit:true, // 0.0.14 
			//allday24HinsideBody:true,	
			task_showqtip: true,
			alldayTaskTPL: new Ext.XTemplate(
					'<tpl for=".">',
					'<div class="ecalâ€�showâ€�basetasktplâ€�div">Tarea:{subject}<br>',
					'Inicia:{startdate}<br>Termina:{enddate}<br>Descripcion:<br>{description}<div><hr>',
					'</tpl>'
					)
			
		},
		dview:{
			header:true,
			headerFormat:'l - d - F  - Y',
			headerUseTpl:true,		//0.0.15 new property to adapt the title header customizable 
			headerTpl: new Ext.XTemplate('<tpl for=".">{title}-{datetouse:this.formatx}</tpl>',	{
				formatx:function(value){ 	
					var dia = e2cs.cal_locale.daytitles[value.getDay()];
					return dia+'- '+value.format('d - F  - Y');	
				}
			}),			//0.0.15
			headerData:{	title:'Tareas del d&iacute;a ',	datetouse:new Date()	},				//0.0.15			
			headerButtons: true,
			moreMenuItems:[btnActivar, btnDesActivar, btnDuplicar],		
			// day specific 
			hourFormat: 'G:i',
			startTime: '07:00:00 am',
			endTime:   '10:59:59 pm',
			// task settings 
			store: null,
			task_increment:1,
			taskBaseColor: null,
			task_useBorderStyle:true,	  		// 0.0.15 (on day and week bodies for the moment)
			task_useBordercolor:'#ffffff',		// 0.0.15 companion property for task_useBorderStyle			
			task_width:68,
			tasksOffset:'8',
			taskAdd_dblclick: true,				//added on 0.0.7
			taskAdd_timer_dblclick: true,		//0.0.11
			useMultiColorTasks: false, 
			multiColorTasks:['#225588'], 
			tasks:[],			
			task_clsOver:'test_taskovercss',	
			ShowMenuItems:[1,1,1,0,0,0],		//0.0.11 ADD, next day, prev day , chg Month , CHG Week, chg Sched, (for daybody menu) 
			task_DDeditable:true, 			    //0.0.11   
			task_eventLaunch:'dblclick',  		//0.0.11 'click, dblclick, if set to '' then no action is taken
			task_ShowMenuItems:[1,1,1,1,1],		//0.0.11 ADD, delete, edit, Next day , Prev Day  (for Taks/events) 
			customHTMLinpos:'before',			//0.0.13  Feature request 
			forceTaskFit: false	
			
		},
		sview:{
				header: true, 
				headerFormat:'M-Y',
				headerButtons: true,
				headerAction:'gotoview',
				periodselector:true,
				blankzonebg:'#6C90B4',
				//sched_addevent_id
				blankHTML:'<div id="{calx}-test-img" class="custom_image_addNewEvent_scheduler" style=" width:100%; cursor:pointer; background-color:#6C90B4"><div align="center" id="{sched_addevent_id}"><img src="../../views/css/calendario/images/logocedrux.png"></div><div align="center" class="custom_text_addNewEvent_scheduler"><b>Por favor haga clic sobre la imagen si quiere agregar una tarea.</b></div></div>',
				listItems: { 
					headerTitle:"Actividades", 		
					periodFormats:{ 
						Day:		'l - d - F  - Y', 	
						DayScheduler_format: 'd', 	
						hourFormat: 'h:i a', 				 
						startTime:  '7:00:00 am',		
						endTime:    '10:00:00 pm',
						WeekTPL:  	'<tpl for=".">Week No.{numweek} Starting on {datestart} Ending on {dateend}</tpl>',  
						WeekFormat:	'W',	
						DatesFormat:'d/m/Y', 
						Month:'M-Y', 
						TwoMonthsTPL:'<tpl for=".">Period No.{numperiod} Starting on {datestart} Ending on {dateend}</tpl>',
						QuarterTPL:  '<tpl for=".">Period No.{numperiod} Starting on {datestart} Ending on {dateend}</tpl>'
					},	
					useStoreColor:false, //false	
					descriptionWidth:246,
					parentLists:false, //to expand collapse Parent Items if false all tasks shown as parent
					launchEventOn:'click',
					editableEvents:true, // If true a context menu will appear 
					ShowMenuItems:[1,1,1,1,1,1,1,1], // ADD, EDIT, DELETE, GO NEXT PERIOD , GO PREV PERIOD, Chg Month, Chg Week, CHG Day
					taskdd_ShowMenuItems:[1,1,1],    // ADD, EDIT, DELETE
					moreMenuItems:[btnActivar, btnDesActivar, btnDuplicar],
					taskdd_BaseColor:'#6C90B4',
					taskdd_clsOver:'test_taskovercss_sched',
					taskdd_showqtip:true,
					taskdd_shownames:false
				},
				listbody:{					
					periodType:e2cs.schedviews.subView.Month,
					headerUnit:e2cs.schedviews.Units.Days,
					headerUnitWidth:25
				},listeners:{
					'headerClick':{
							fn: function(refunit,datex, mviewx, calx) { 
								var msgstring = "Header Value clicked -(" + refunit +')<br>';
								if (refunit=='day' || refunit=='hour'){ 
									msgstring += 'on date -(' + datex.format('d/m/Y h:i:s') +')<br>';	
								} else { 
									msgstring += 'on Week# ' + datex[0].format('W');
									msgstring += '-(From ' + datex[0].format('d/m/Y h:i:s') +'  to '; 
									msgstring +=datex[1].format('d/m/Y h:i:s') + ')';	
								} 		
							},
							scope:this
					},
					'listItemSendData':{ fn:function(recordId,dataObj){	} },
					'beforePeriodChange':{	fn:function(refperiod,datexold,datexnew){	return true; },scope:this	}, 
					'afterPeriodChange':{
							fn:function(refperiod,datexnew){
								if (refperiod==1){ 
								} 
							}
					}
				} 
		}, 		
		
	})	
	);
	}		
	tabCalendario.activate(id);
	calendario = Ext.getCmp(id);
		
	//Eventos capturados en cada vista del calendario, permiten realizar acciones sobre el calendario visualmento activo 
	calendario.viewmonth.on({	
		'dayClick':{
				fn: function(datex, mviewx, calx) {		
					calendario.viewday.headerData.datetouse=datex;
					calendario.currentdate=datex;
					return true;
				},
				scope:this
		},
		'beforeMonthChange':{
			fn: function(currentdate,newdate) {
				
					calendario.viewmonth.headerData.datetouse=newdate;
					aux = calendario.viewmonth.getDateRangeOfMonth(newdate);
					if(nodo){
					 calendario.store.load({params: {idusuario:nodo.id,fechainicio:Ext.encode(aux[0].format('d/m/Y')), fehchafin:Ext.encode(aux[1].format('d/m/Y')),involucrados:Ext.encode(tabCalendario.getActiveTab().Datos.Involucrados),categorias:Ext.encode(tabCalendario.getActiveTab().Datos.Categorias), tipoact:Ext.encode(tabCalendario.getActiveTab().Datos.Tipoact), arrayautores : Ext.encode(tabCalendario.getActiveTab().Datos.Autores),planes:Ext.encode(tabCalendario.getActiveTab().Datos.Planes)}});
					}
					else{
					calendario.store.load({params:{fechainicio:Ext.encode(aux[0].format('d/m/Y')), fehchafin:Ext.encode(aux[1].format('d/m/Y')),involucrados:Ext.encode(tabCalendario.getActiveTab().Datos.Involucrados),categorias:Ext.encode(tabCalendario.getActiveTab().Datos.Categorias), tipoact:Ext.encode(tabCalendario.getActiveTab().Datos.Tipoact), arrayautores : Ext.encode(tabCalendario.getActiveTab().Datos.Autores),planes:Ext.encode(tabCalendario.getActiveTab().Datos.Planes)}});
					}
				return true; 
				},
				scope:this
		},
		'afterMonthChange':{
				fn: function(newdate) { 
				},
				scope:this
		}
	});
	calendario.viewweek.on({
		'dblClickTaskAllDay':{
				fn: function(task,dxview,calendar) {
					var datatest='Task all day <br>record No:' + task[0] + '<br>';
					datatest+='id-task:'  + task[1] + ' ' + task[2] + '<br>';
					datatest+='starts:'    + task[3] + '<br>';
					datatest+='ends:'   + task[4] + '<br>';
					datatest+='contents'  + task[5] + '<br>';	
					datatest+='index'     + task[6] + '<br>';	
				},
				scope:this
		},
		'beforeWeekChange':{
			fn: function (currentDate, newDate){
				var testdate=calendario.viewweek.getDatesforWeek(newDate); 
				calendario.viewweek.headerData.enday=testdate[1];
				calendario.viewweek.headerData.initday	=testdate[0];
				aux = calendario.viewweek.getDatesforWeek(newDate);
				if(nodo)
				 calendario.store.load({params: {idusuario:nodo.id,fechainicio:Ext.encode(aux[0].format('d/m/Y')), fehchafin:Ext.encode(aux[1].format('d/m/Y')),involucrados:Ext.encode(tabCalendario.getActiveTab().Datos.Involucrados),categorias:Ext.encode(tabCalendario.getActiveTab().Datos.Categorias), tipoact:Ext.encode(tabCalendario.getActiveTab().Datos.Tipoact), arrayautores : Ext.encode(tabCalendario.getActiveTab().Datos.Autores),planes:Ext.encode(tabCalendario.getActiveTab().Datos.Planes)}});
				else
				calendario.store.load({params:{fechainicio:Ext.encode(aux[0].format('d/m/Y')), fehchafin:Ext.encode(aux[1].format('d/m/Y')),involucrados:Ext.encode(tabCalendario.getActiveTab().Datos.Involucrados),categorias:Ext.encode(tabCalendario.getActiveTab().Datos.Categorias), tipoact:Ext.encode(tabCalendario.getActiveTab().Datos.Tipoact), arrayautores : Ext.encode(tabCalendario.getActiveTab().Datos.Autores),planes:Ext.encode(tabCalendario.getActiveTab().Datos.Planes)}});
				return true;	
			}
		}, 
		'afterWeekChange':{
			fn: function(newdate){
				return false; 
			}
		}
	});  
	calendario.viewday.on({
		'beforeDayChange':{
				fn: function(currentdate, newdate) {
					calendario.viewday.headerData.datetouse=newdate;
					if(nodo)
					calendario.store.load({params: {idusuario:nodo.id,fechainicio:Ext.encode(newdate.format('d/m/Y')), fehchafin:Ext.encode(newdate.format('d/m/Y')),involucrados:Ext.encode(tabCalendario.getActiveTab().Datos.Involucrados),categorias:Ext.encode(tabCalendario.getActiveTab().Datos.Categorias), tipoact:Ext.encode(tabCalendario.getActiveTab().Datos.Tipoact), arrayautores : Ext.encode(tabCalendario.getActiveTab().Datos.Autores),planes:Ext.encode(tabCalendario.getActiveTab().Datos.Planes)}});
					else
					calendario.store.load({params:{fechainicio:Ext.encode(newdate.format('d/m/Y')), fehchafin:Ext.encode(newdate.format('d/m/Y')),involucrados:Ext.encode(tabCalendario.getActiveTab().Datos.Involucrados),categorias:Ext.encode(tabCalendario.getActiveTab().Datos.Categorias), tipoact:Ext.encode(tabCalendario.getActiveTab().Datos.Tipoact), arrayautores : Ext.encode(tabCalendario.getActiveTab().Datos.Autores),planes:Ext.encode(tabCalendario.getActiveTab().Datos.Planes)}});
				return true; 
				},
				scope:this
		},		
		'afterDayChange':{
				fn: function(newdate) { 
				},
				scope:this
		}	
	}); 
	calendario.on({
		'beforeChangeDate': {
			fn: function( newdate , calobj){
				 newdate = new Date(newdate);
				 calendario.viewday.headerData.datetouse=newdate;
				 if(nodo)
				calendario.store.load({params: {idusuario:nodo.id,fechainicio:Ext.encode(newdate.format('d/m/Y')), fehchafin:Ext.encode(newdate.format('d/m/Y')),involucrados:Ext.encode(tabCalendario.getActiveTab().Datos.Involucrados),categorias:Ext.encode(tabCalendario.getActiveTab().Datos.Categorias), tipoact:Ext.encode(tabCalendario.getActiveTab().Datos.Tipoact), arrayautores : Ext.encode(tabCalendario.getActiveTab().Datos.Autores),planes:Ext.encode(tabCalendario.getActiveTab().Datos.Planes)} });
				else
				calendario.store.load({params:{fechainicio: Ext.encode(newdate.format('d/m/Y')), fehchafin: Ext.encode(newdate.format('d/m/Y')),involucrados:Ext.encode(tabCalendario.getActiveTab().Datos.Involucrados),categorias:Ext.encode(tabCalendario.getActiveTab().Datos.Categorias), tipoact:Ext.encode(tabCalendario.getActiveTab().Datos.Tipoact), arrayautores : Ext.encode(tabCalendario.getActiveTab().Datos.Autores),planes:Ext.encode(tabCalendario.getActiveTab().Datos.Planes)}});
				return true; 
			} 		
		},
		'afterChangeDate':{
			fn: function( newdate , calobj){
			}
		},
		'onChangeView':{
			fn: function(newView, oldView, calobj){
	      },scope: this
		},
		'beforeChangeView':{
				fn: function (newView,OldView,calendarOBJ){
					if (newView==OldView){ 
						return false; 
					}else{
					    var newDate = calendario.currentdate;
						switch(newView){
							case 'week':{
							    aux = calendario.viewweek.getDatesforWeek(newDate);
							    //if (OldView=="day") {
							    	if(nodo){calendario.store.load({params: {idusuario:nodo.id,fechainicio:Ext.encode(aux[0].format('d/m/Y')), fehchafin:Ext.encode(aux[1].format('d/m/Y')),involucrados:Ext.encode(tabCalendario.getActiveTab().Datos.Involucrados),categorias:Ext.encode(tabCalendario.getActiveTab().Datos.Categorias), tipoact:Ext.encode(tabCalendario.getActiveTab().Datos.Tipoact), arrayautores : Ext.encode(tabCalendario.getActiveTab().Datos.Autores),planes:Ext.encode(tabCalendario.getActiveTab().Datos.Planes)}});}
									else {calendario.store.load({params:{fechainicio:Ext.encode(aux[0].format('d/m/Y')), fehchafin:Ext.encode(aux[1].format('d/m/Y')),involucrados:Ext.encode(tabCalendario.getActiveTab().Datos.Involucrados),categorias:Ext.encode(tabCalendario.getActiveTab().Datos.Categorias), tipoact:Ext.encode(tabCalendario.getActiveTab().Datos.Tipoact), arrayautores : Ext.encode(tabCalendario.getActiveTab().Datos.Autores),planes:Ext.encode(tabCalendario.getActiveTab().Datos.Planes)}});}
							   // }
							   }break;  
							case 'day':{
								calendario.viewday.headerData.datetouse=newDate;
								if(nodo){calendario.store.load({params: {idusuario:nodo.id,fechainicio:Ext.encode(newDate.format('d/m/Y')), fehchafin:Ext.encode(newDate.format('d/m/Y')),involucrados:Ext.encode(tabCalendario.getActiveTab().Datos.Involucrados),categorias:Ext.encode(tabCalendario.getActiveTab().Datos.Categorias), tipoact:Ext.encode(tabCalendario.getActiveTab().Datos.Tipoact), arrayautores : Ext.encode(tabCalendario.getActiveTab().Datos.Autores),planes:Ext.encode(tabCalendario.getActiveTab().Datos.Planes)}});}
								else
								{calendario.store.load({params:{fechainicio:Ext.encode(newDate.format('d/m/Y')), fehchafin:Ext.encode(newDate.format('d/m/Y')),involucrados:Ext.encode(tabCalendario.getActiveTab().Datos.Involucrados),categorias:Ext.encode(tabCalendario.getActiveTab().Datos.Categorias), tipoact:Ext.encode(tabCalendario.getActiveTab().Datos.Tipoact), arrayautores : Ext.encode(tabCalendario.getActiveTab().Datos.Autores),planes:Ext.encode(tabCalendario.getActiveTab().Datos.Planes)}});}
				        	}break;  
							case 'month':{
								aux = calendario.viewmonth.getDateRangeOfMonth(newDate);
								if(nodo){calendario.store.load({params: {idusuario:nodo.id,fechainicio:Ext.encode(aux[0].format('d/m/Y')), fehchafin:Ext.encode(aux[1].format('d/m/Y')),involucrados:Ext.encode(tabCalendario.getActiveTab().Datos.Involucrados),categorias:Ext.encode(tabCalendario.getActiveTab().Datos.Categorias), tipoact:Ext.encode(tabCalendario.getActiveTab().Datos.Tipoact), arrayautores : Ext.encode(tabCalendario.getActiveTab().Datos.Autores),planes:Ext.encode(tabCalendario.getActiveTab().Datos.Planes)}});}
								else{calendario.store.load({params:{fechainicio:Ext.encode(aux[0].format('d/m/Y')), fehchafin:Ext.encode(aux[1].format('d/m/Y')),involucrados:Ext.encode(tabCalendario.getActiveTab().Datos.Involucrados),categorias:Ext.encode(tabCalendario.getActiveTab().Datos.Categorias), tipoact:Ext.encode(tabCalendario.getActiveTab().Datos.Tipoact), arrayautores : Ext.encode(tabCalendario.getActiveTab().Datos.Autores),planes:Ext.encode(tabCalendario.getActiveTab().Datos.Planes)}});}
				            }break; 
							case 'schedule':{
								aux = calendario.viewmonth.getDateRangeOfMonth(newDate);
								if(nodo){calendario.store.load({params: {idusuario:nodo.id,fechainicio:Ext.encode(aux[0].format('d/m/Y')), fehchafin:Ext.encode(aux[1].format('d/m/Y')),involucrados:Ext.encode(tabCalendario.getActiveTab().Datos.Involucrados),categorias:Ext.encode(tabCalendario.getActiveTab().Datos.Categorias), tipoact:Ext.encode(tabCalendario.getActiveTab().Datos.Tipoact), arrayautores : Ext.encode(tabCalendario.getActiveTab().Datos.Autores),planes:Ext.encode(tabCalendario.getActiveTab().Datos.Planes)}});}
								else{calendario.store.load({params:{fechainicio:Ext.encode(aux[0].format('d/m/Y')), fehchafin:Ext.encode(aux[1].format('d/m/Y')),involucrados:Ext.encode(tabCalendario.getActiveTab().Datos.Involucrados),categorias:Ext.encode(tabCalendario.getActiveTab().Datos.Categorias), tipoact:Ext.encode(tabCalendario.getActiveTab().Datos.Tipoact), arrayautores : Ext.encode(tabCalendario.getActiveTab().Datos.Autores),planes:Ext.encode(tabCalendario.getActiveTab().Datos.Planes)}});}
				            }break;
						}
					}
					return true;
				},scope:this
		},
		'taskAdd':{
				fn: function( datex ) { 									
					GestionarActividades('add',datex);
				}
		},
		'taskDblClick':{		         
				fn: function (task,dxview,calendar,refviewname){			   
				    tareaMod = task[1];
					idautor = calendar.store.getById(task[1]).data.idautor;
					
					var rec = calendar.store.getById(task[1]);
					modificar = rec.data.modificar;
					eliminar = rec.data.eliminar;
					
				    GestionarActividades('mod');
				    return true;
				},
				scope:this 
		},
		'beforeTaskDelete': {
				fn: function (datatask,dxview) {
				var rec = calendario.store.getById(datatask[1]);
				if(rec.data.eliminar !=1) {
					 mostrarMensaje(1,'Usted no tiene permiso para eliminar la actividad  '+datatask[2]+'.');
				 } else {
						mostrarMensaje(2,'&iquest;Est&aacute; seguro que quiere eliminar la actividad '+datatask[2],elimina);
					}
					function elimina(btn){
							if(btn == 'ok')
							{
								Ext.getBody().mask('Eliminando actividad ');
								var newDate = calendario.currentdate;
								Ext.Ajax.request({		
									url: 'EliminarActividad',
									params:{idact: datatask[1]},
									callback: function (options,success,response){
									    Ext.getBody().unmask();RefrescaCalendario();
										responseData = Ext.decode(response.responseText);
										if(responseData.mensaje == 1){
											mostrarMensaje(responseData.mensaje,'La actividad ha sido eliminada satisfactoriamente.');
											
										}									
									}
						        }); 
							}
						}
					return false; 
					// do your stuff to check if the event/task could be deleted 
				}, scope:this
		},
		/*'afterTaskDelete':{
	   		fn: function(datatask,action){
				Ext.getBody().unmask();						
				return false;
			},scope:this
 	    },
		'beforeTaskEdit': {
				fn: function (datatask,dxview) { 
					return true; 							
				}, scope:this
		},	
	    'onTaskDelete':{
			fn:function(datatask){
				//var r=confirm("Delete event " + datatask[1] + " " + datatask[2] + "...? YES/NO" );
				return r; 
				// do your stuf for deletion and return the value 
			},scope:this
		},*/
	    'onTaskEdit':{
			fn:function(datatask){
				tareaMod = datatask[1];
				idautor = calendario.store.getById(datatask[1]).data.idautor;
				var rec = calendario.store.getById(datatask[1]);
				if(rec.data.modificar ==0)
				 {mostrarMensaje(1,'Usted no tiene permiso para modificar la actividad '+datatask[2]+'.');}
				else {GestionarActividades('mod');}		
				return true; 
				
			},scope:this
	    },
		'TaskMoved':{
				fn: function (newDataTask,Taskobj,dxview,TaskEl) {   
					task = newDataTask; 
				var rec = calendario.store.getById(task[1]);
				if(rec.data.modificar == 0)
				 {mostrarMensaje(1,'Usted no tiene permiso para modificar la actividad '+task[2] +'.');}
			    else{					
					datatest ='<b>Asunto: </b>' + task[2] + '<br>';
					datatest+='<b>Inicio: </b>'    + task[3] + '<br>';
					datatest+='<b>Fin:   </b>'   + task[4] + '<br>';
					
					var record = calendario.store.getAt( (parseInt(task[6])-1) ); 
						record.set('startdate',task[3]);
						record.set('enddate',task[4]);
						calendario.store.commitChanges();
						calendario.refreshCalendarView();						
						
						/*Ext.Msg.show({
							   title:'Informaci&oacute;n de la actividad modificada',
							   msg: datatest,
							   buttons: Ext.Msg.OK,
							   animEl: 'elId',
							   icon: Ext.MessageBox.INFO,
							   minWidth :120
										});	*/		
					Ext.Ajax.request({		
							url: 'setHoraActividad',
							params:{idact:task[1], hora_i:task[3], hora_f: task[4]},
							callback: function (options,success,response){
								responseData = Ext.decode(response.responseText);
								 calendario.refreshCalendarView();
								 mostrarMensaje(responseData.mensaje,responseData.msg,function(){
									calendario.store.reload({});
									//calendario.refreshCalendarView();
								 });
								 //if(responseData.mensaje != 1)
									//mostrarMensaje(responseData.mensaje,/*responseData.mensaje*/'No se pudo modificar');								 
							}
						});
					}
				}, scope:this
		},
		'customMenuAction':{
			fn: function (MenuId, Currentview,datatask,objEl,dxview){			
			    var rec = calendario.store.getById(datatask[1]);
				if(MenuId=='activar' || MenuId=='desactivar'){
					
					
					if(rec.data.modificar ==0)
					 mostrarMensaje(1,'Usted no tiene permiso para modificar la actividad '+datatask[2]+'.');
				    else{
						var activo = (MenuId!='activar')?0:1;
						var accion = (activo==1)?'Activando':'Desactivando';
						Ext.getBody().mask(accion+' actividad '+datatask[2]+'.Espere por favor.');					
						Ext.Ajax.request({		
									url: 'setActivaActividad',
									params:{idact:datatask[1],activo:activo},
									callback: function (options,success,response){
										Ext.getBody().unmask();
										responseData = Ext.decode(response.responseText);
										var accion = (activo==1)?'activada':'dasactivada';
										if(responseData.mensaje == 1)mostrarMensaje(responseData.mensaje,'La actividad a sido '+accion+' satisfactoriamente.');
										var rec = calendario.store.getById(datatask[1]);
										rec.set('activo',activo);
										calendario.store.commitChanges();
										calendario.refreshCalendarView();								
									}
						 });
					}
				  }else{
						if(MenuId=='duplicar'){
							/*if(rec.data.activo !=1)
								mostrarMensaje(1,'Usted no tiene permiso para duplicar la actividad '+datatask[2]+'.');*/
							/*else*/ GestionarActividades('dup');
						}
				  false} ;
				},scope:this		
			},
		'beforeContextMenuTask': {
			fn:function(dxview,datatask,action){			
			var rec = calendario.store.getById(datatask[1]);
			tareaMod = datatask[1];
			idautor = calendario.store.getById(datatask[1]).data.idautor;
			if(rec.data.activo == 1 && rec.data.modificar == 1){
				   btnActivar.disable(); btnDesActivar.enable(); 
				   btnDuplicar.enable(); 
			}else {
				   btnActivar.enable(); btnDesActivar.disable();
				   btnDuplicar.disable();
				  }
			   }
			}
});	
	
		if(id!='personal'){
		if (nodo.text!='b&uacute;squeda') {
			calendario.store.load({params: {idusuario:nodo.id,fechainicio:Ext.encode(new Date().format('d/m/Y')), fehchafin:Ext.encode(new Date().format('d/m/Y')),involucrados: Ext.encode(tabCalendario.getActiveTab().Datos.Involucrados),categorias:Ext.encode(tabCalendario.getActiveTab().Datos.Categorias), tipoact:Ext.encode(tabCalendario.getActiveTab().Datos.Tipoact), arrayautores : Ext.encode(tabCalendario.getActiveTab().Datos.Autores),planes:Ext.encode(tabCalendario.getActiveTab().Datos.Planes)}});
		}
	}
	else{
	 calendario.store.load({params: {fechainicio:Ext.encode(new Date().format('d/m/Y')), fehchafin:Ext.encode(new Date().format('d/m/Y')),involucrados:''}});
	
	}
	//calendario.refreshCalendarView();
	
}
//funcion que posibilita gestionar actividades parametro: opcion 'add/mod', date: 'fecha de la vista'
function GestionarActividades(opcion,fecha){
	
	if(!winAddAct){
					winAddAct = new Ext.UCID.WinIframe({
						jid:'wfActividad',
						idIframe:'iframeaddact',
						url:'dameaddact',
						params:{elemento:'elemento'},
						html: '<iframe id="ifAdd" style="width:100%; height: 100%; border:none;"></iframe>',
						width:750,//686
						height: 555,
						modal:true,
						closeAction:'hide',
						onLoad:function(addact){addactdegest = addact;},
						doAction:function(){},
						listeners:{hide:function(win){if(flag) {RefrescaCalendario(); flag = false;};}},
						buttons:[{ text:'Cancelar', iconCls:'cancelar', /*icon:perfil.dirImg+'cancelar.png',*/ handler:function(){winAddAct.hide();}},
								 { id:'Aceptar',text:'Aceptar', iconCls:'aceptar', /*icon:perfil.dirImg+'aceptar.png', */
								   handler:function(){								   				
												addactdegest();
												flag = true;
								}}
								]
					});	
				}
		winAddAct.activpestrepetact = 0;
		switch(opcion){
			case 'add': {
				winAddAct.setTitle('Adicionar actividad');
				winAddAct.idact = 0;
				winAddAct.modificar = 1;
				winAddAct.eliminar = 1;
				winAddAct.estamodificando = 0;
				winAddAct.idautor = idautor;					
				(fecha)?winAddAct.varfecha = Ext.encode(fecha.format('d/m/Y H:i')):'';	
			}break;
			case 'mod': {
				winAddAct.idact = tareaMod;
				winAddAct.estamodificando = 1;
				winAddAct.modificar = modificar;
				winAddAct.eliminar = eliminar;
				winAddAct.idautor = idautor;
				winAddAct.setTitle('Modificar actividad');					
			}break;
			case 'dup': {
			    winAddAct.idact = tareaMod;
				winAddAct.estamodificando = 2;
				winAddAct.modificar = 1;
				winAddAct.eliminar = 1;
				winAddAct.idautor = idautor;
				winAddAct.setTitle('Duplicar actividad');					
			}break;
		}
		 if(modificar == 1)
		{
		 Ext.getCmp('Aceptar').enable();					 
		}
		if(modificar == 0)
		{
		 Ext.getCmp('Aceptar').disable();
		}
		winAddAct.relacionarsuperior = 1;
		
		winAddAct.show();
	//calendario.refreshCalendarView();
	}
//(terminar)Function que permite filtrar los arboles de busqueda
function filterTree(e){
		var text = e.target.value;   
	    Ext.each(hiddenPkgs, function(n){n.ui.show();});
		
		if(!text){filter.clear();return;}
		tpactivo.expandAll();		
		var re = new RegExp('^' + Ext.escapeRe(text), 'i');
		filter.filterBy(function(n){
		return n.attributes.gp || re.test(n.text);
		});		
		hiddenPkgs = [];
		tpactivo.root.cascade(function(n){
			if(n.attributes.gp && n.ui.ctNode.offsetHeight < 3){
				n.ui.hide();
				hiddenPkgs.push(n);
			}
		});
	}
//function que permite filtrar las actividades por un criterio determinado
function filtrarAct(){
		 involucrados = nodosChekedInvolucrados();		 			
		 categorias = nodosChekedCategorias();		 
		 tipoact = nodosChekedTipoActividad();		 
		 autores = nodosChekedAutores();
		 planes = GetPlanesChekeados();
		if(involucrados == null && categorias == null && tipoact == null && autores == null && planes == null )	
			mostrarMensaje(1,'Debe seleccionar al menos un criterio para filtrar.');
		else {mostrarCalendarBusqueda()};
	}
//function que permite obtener los nodos checked del treepanel involucrado
function nodosChekedInvolucrados(){
	var arrayinvolucrados = [];	
	var seleccionados = tpbuscarTareasInv.getChecked();	
	for(var i=0; i<seleccionados.length; i++)
	{
		var elemento = new Object;		
			elemento.idgrupo = seleccionados[i].attributes.idgrupo;
			elemento.tipo = seleccionados[i].attributes.tipo;
			elemento.idusuario = seleccionados[i].attributes.idusuario;
			arrayinvolucrados.push(elemento);		
	}
	return (arrayinvolucrados.length!=0)?arrayinvolucrados:null;	
}
//function que permite obtener los nodos checked del  treepanel categorias
function nodosChekedCategorias(){
	var arraycategoriasact = [];	
	var arraycategact = smtgcategact.getSelections();
	var totalreccategact = arraycategact.length;
	for(var i=0;i<totalreccategact;i++)
	{
		var elemento = new Object;
		elemento.idcategoria = arraycategact[i].data.idnom;			
		arraycategoriasact.push(elemento);

		if(arraycategact[i].data._is_leaf == false)
		{
			tgcategact.getStore().each(function(record){
				if(record.data._parent == arraycategact[i].data.idnom)
				{
					var elemento2 = new Object;
					elemento2.idcategoria = arraycategact[i].data.idnom;
					arraycategoriasact.push(elemento2);
				}
			});
		}
	}
	//tpbuscarTareasCategoria.getChecked();	
	/*for(var i=0; i<seleccionados.length; i++)
	{
		var elemento = new Object;		
			elemento.idcategoria = seleccionados[i].attributes.id;			
			arraycategoriasact.push(elemento);		
	}*/
	return (arraycategoriasact.length!=0)?arraycategoriasact:null;	
}
//function que permite obtener los nodos checked del treepanel actividad
function nodosChekedTipoActividad(){
	var arraytipoact = [];
	var arraytipoactiv = smtgtipoact.getSelections();
	var totalrectipoact = arraytipoactiv.length;
	for(var i=0;i<totalrectipoact;i++)
	{
		var elemento = new Object;
		elemento.idtipoactividad = arraytipoactiv[i].data.idnom;			
		arraytipoact.push(elemento);

		if(arraytipoactiv[i].data._is_leaf == false)
		{
			tgtipoact.getStore().each(function(record){
				if(record.data._parent == arraytipoactiv[i].data.idnom)
				{
					var elemento2 = new Object;
					elemento2.idtipoactividad = arraytipoactiv[i].data.idnom;
					arraytipoact.push(elemento2);
				}
			});
		}
	}
	/*var seleccionados = tpbuscarTareasResp.getChecked();	
	for(var i=0; i<seleccionados.length; i++)
	{
		var elemento = new Object;		
			elemento.idtipoactividad = seleccionados[i].attributes.id;			
			arraytipoact.push(elemento);		
	}*/
	return (arraytipoact.length!=0)?arraytipoact:null;	
}

//funcion que pemrite obtener los planes seleccionados
function GetPlanesChekeados()
{
	var arrayplanes = [];
	var arrayplanesselect = smtgplan.getSelections();
	var totalplanesselect = arrayplanesselect.length;
	for(var i=0;i<totalplanesselect;i++)
	{
		var elemento = new Object;
		elemento.idplan = arrayplanesselect[i].data.idelemento;			
		arrayplanes.push(elemento);
		if(arrayplanesselect[i].data._is_leaf == false)
		{
			tgplan.getStore().each(function(record){
				if(record.data._parent == arrayplanesselect[i].data.idnom)
				{
					var elemento2 = new Object;
					elemento2.idplan = arrayplanesselect[i].data.idelemento;
					arrayplanes.push(elemento2);
				}
			});
		}
	}
	return (arrayplanes.length!=0)?arrayplanes:null;
}

//function que permite obtener los nodos checked del treepanel autores
function nodosChekedAutores(){
	var arraytipoact = [];	
	
	var seleccionados = Ext.getCmp('tpAutores').getChecked();	
	for(var i=0; i<seleccionados.length; i++)
	{
		var elemento = new Object;		
			//elemento.id = seleccionados[i].attributes.id;	
			elemento.idusuario = seleccionados[i].attributes.idusuario;
			arraytipoact.push(elemento);		
	}
	return (arraytipoact.length!=0)?arraytipoact:null;	
}
//function  que permite descheched los nado seleccionados
function DesChekedAll(){
	
	var arrayinvchec = tpbuscarTareasInv.getChecked();
	var arrayautchec = tpAutores.getChecked();
	
	if(arrayinvchec){
	for (var index = 0; index < arrayinvchec.length; index++) {
		 tpbuscarTareasInv.getNodeById(arrayinvchec[index].id).getUI().toggleCheck(false);
	}}
	if(arrayautchec){
	for (var index = 0; index < arrayautchec.length; index++) {
		tpAutores.getNodeById(arrayautchec[index].id).getUI().toggleCheck(false);
	}}
	
	if(smtgcategact.hasSelection())
	{
		smtgcategact.clearSelections();
	}
	if(smtgtipoact.hasSelection())
	{
		smtgtipoact.clearSelections();
	}
	if(smtgplan.hasSelection())
	{
		smtgplan.clearSelections();
	}
	
	
}

function mostrarCalendarBusqueda(){
	
	var newDate = calendario.currentdate;
	var newView = calendario.currentView;
	if (cbTabs.getValue()) {
		if(!Ext.get('busqueda'))
		{
			MostrarCalendarios(false,{id:'busqueda',text:'b&uacute;squeda',tipo:3});			
		}
		else{
			MostrarCalendarios(false,{id:'busqueda',text:'b&uacute;squeda'});
			add=true;
			LlenarValoresBusqueda(tabCalendario.getActiveTab());			
		}
	}
	else{
		contadorTab++;
		MostrarCalendarios(false,{id:contadorTab,text:'b&uacute;squeda'});
	}
    	
	var usuario = '';
		switch(newView){
			case 'week':{
				aux = calendario.viewweek.getDatesforWeek(newDate);
				calendario.store.load({params:{idusuario:usuario,fechainicio:Ext.encode(aux[0].format('d/m/Y')), fehchafin:Ext.encode(aux[1].format('d/m/Y')),involucrados: Ext.encode(tabCalendario.getActiveTab().Datos.Involucrados),categorias:Ext.encode(tabCalendario.getActiveTab().Datos.Categorias), tipoact:Ext.encode(tabCalendario.getActiveTab().Datos.Tipoact), arrayautores : Ext.encode(tabCalendario.getActiveTab().Datos.Autores),planes:Ext.encode(tabCalendario.getActiveTab().Datos.Planes) }});
			}break;  
			case 'day':{
				calendario.store.load({params:{idusuario:usuario,fechainicio:Ext.encode(newDate.format('d/m/Y')), fehchafin:Ext.encode(newDate.format('d/m/Y')),involucrados: Ext.encode(tabCalendario.getActiveTab().Datos.Involucrados),categorias:Ext.encode(tabCalendario.getActiveTab().Datos.Categorias), tipoact:Ext.encode(tabCalendario.getActiveTab().Datos.Tipoact), arrayautores : Ext.encode(tabCalendario.getActiveTab().Datos.Autores),planes:Ext.encode(tabCalendario.getActiveTab().Datos.Planes) }});
			}break;  
			case 'month':{	
				aux = calendario.viewmonth.getDateRangeOfMonth(newDate);
				calendario.store.load({params:{idusuario:usuario,fechainicio:Ext.encode(aux[0].format('d/m/Y')), fehchafin:Ext.encode(aux[1].format('d/m/Y')),involucrados: Ext.encode(tabCalendario.getActiveTab().Datos.Involucrados),categorias:Ext.encode(tabCalendario.getActiveTab().Datos.Categorias), tipoact:Ext.encode(tabCalendario.getActiveTab().Datos.Tipoact), arrayautores : Ext.encode(tabCalendario.getActiveTab().Datos.Autores),planes:Ext.encode(tabCalendario.getActiveTab().Datos.Planes) }});
			}break;  
		}				

}

function LlenarValoresBusqueda(tabActivo){
	if(add==true){
		var datos = new Object();
		if (involucrados) {
			datos.Involucrados = involucrados;
		} else {
			datos.Involucrados = '';
		}
		
	   	if (autores) {
	   		datos.Autores = autores;
	   	} else {
	   		datos.Autores = '';
	   	}
		
	   	if (categorias) {
	   		datos.Categorias= categorias;
	   	} else {
	   		datos.Categorias= '';
	   	}
		
	   	if (tipoact) {
	   		datos.Tipoact= tipoact;
	   	} else {
	   		datos.Tipoact= '';
	   	}
		
		if (planes) {
	   		datos.Planes= planes;
	   	} else {
	   		datos.Planes= '';
	   	}
		
	   	datos.newDate= calendario.currentdate;
	   	datos.newView= calendario.currentView;
	   	tabActivo.Datos = datos;
	
		}	
		add=false;
}

function RefrescaCalendario(){
	var newDate = calendario.currentdate;
	var newView = calendario.currentView;
		
	switch(newView){
			case 'week':{
				aux = calendario.viewweek.getDatesforWeek(newDate);
				calendario.store.load({params:{idusuario:'',fechainicio:Ext.encode(aux[0].format('d/m/Y')), fehchafin:Ext.encode(aux[1].format('d/m/Y')),involucrados: Ext.encode(tabCalendario.getActiveTab().Datos.Involucrados),categorias:Ext.encode(tabCalendario.getActiveTab().Datos.Categorias), tipoact:Ext.encode(tabCalendario.getActiveTab().Datos.Tipoact), arrayautores : Ext.encode(tabCalendario.getActiveTab().Datos.Autores),planes:Ext.encode(tabCalendario.getActiveTab().Datos.Planes) }});
			}break;  
			case 'day':{
				calendario.store.load({params:{idusuario:'',fechainicio:Ext.encode(newDate.format('d/m/Y')), fehchafin:Ext.encode(newDate.format('d/m/Y')),involucrados: Ext.encode(tabCalendario.getActiveTab().Datos.Involucrados),categorias:Ext.encode(tabCalendario.getActiveTab().Datos.Categorias), tipoact:Ext.encode(tabCalendario.getActiveTab().Datos.Tipoact), arrayautores : Ext.encode(tabCalendario.getActiveTab().Datos.Autores),planes:Ext.encode(tabCalendario.getActiveTab().Datos.Planes) }});
			}break;  
			case 'month':{	
				aux = calendario.viewmonth.getDateRangeOfMonth(newDate);
				calendario.store.load({params:{idusuario:'',fechainicio:Ext.encode(aux[0].format('d/m/Y')), fehchafin:Ext.encode(aux[1].format('d/m/Y')),involucrados: Ext.encode(tabCalendario.getActiveTab().Datos.Involucrados),categorias:Ext.encode(tabCalendario.getActiveTab().Datos.Categorias), tipoact:Ext.encode(tabCalendario.getActiveTab().Datos.Tipoact), arrayautores : Ext.encode(tabCalendario.getActiveTab().Datos.Autores),planes:Ext.encode(tabCalendario.getActiveTab().Datos.Planes) }});
			}break;  
		}
}

function sendDataActual(ext){
 Ext.getBody().mask('Procesando informacion.Espere por favor..');
	
	  var newDate = calendario.currentdate;	 
	  var view = calendario.currentView;
	  var idcalendario = calendario.id;
	  var tipocal = calendario.tipo;
	  var titleReport = calendario.title;
						switch(view){
							case 'week':{
							    aux = calendario.viewweek.getDatesforWeek(newDate);
							    params = {idcalendario:idcalendario,tipocal:tipocal, formato: ext, vista: view, fechainicio:Ext.encode(aux[0].format('d/m/Y')), fehchafin:Ext.encode(aux[1].format('d/m/Y')),involucrados:Ext.encode(tabCalendario.getActiveTab().Datos.Involucrados),categorias:Ext.encode(tabCalendario.getActiveTab().Datos.Categorias), tipoact:Ext.encode(tabCalendario.getActiveTab().Datos.Tipoact), arrayautores : Ext.encode(tabCalendario.getActiveTab().Datos.Autores),planes:Ext.encode(tabCalendario.getActiveTab().Datos.Planes)};
								}break;  
							case 'day':{								
								 params = {idcalendario:idcalendario,tipocal:tipocal,formato: ext, vista: view,fechainicio:Ext.encode(newDate.format('d/m/Y')), fehchafin:Ext.encode(newDate.format('d/m/Y')),involucrados:Ext.encode(tabCalendario.getActiveTab().Datos.Involucrados),categorias:Ext.encode(tabCalendario.getActiveTab().Datos.Categorias), tipoact:Ext.encode(tabCalendario.getActiveTab().Datos.Tipoact), arrayautores : Ext.encode(tabCalendario.getActiveTab().Datos.Autores),planes:Ext.encode(tabCalendario.getActiveTab().Datos.Planes)};
								}break;  
							case 'month':{
								aux = calendario.viewmonth.getDateRangeOfMonth(newDate);
								params = {idcalendario:idcalendario,tipocal:tipocal,formato: ext, vista: view, fechainicio:Ext.encode(aux[0].format('d/m/Y')), fehchafin:Ext.encode(aux[1].format('d/m/Y')),involucrados:Ext.encode(tabCalendario.getActiveTab().Datos.Involucrados),categorias:Ext.encode(tabCalendario.getActiveTab().Datos.Categorias), tipoact:Ext.encode(tabCalendario.getActiveTab().Datos.Tipoact), arrayautores : Ext.encode(tabCalendario.getActiveTab().Datos.Autores),planes:Ext.encode(tabCalendario.getActiveTab().Datos.Planes)};
							    }break; 
							case 'schedule':{
								aux = calendario.viewmonth.getDateRangeOfMonth(newDate);
								params = {idcalendario:idcalendario,tipocal:tipocal,formato: ext, vista: view,fechainicio:Ext.encode(aux[0].format('d/m/Y')), fehchafin:Ext.encode(aux[1].format('d/m/Y')),involucrados:Ext.encode(tabCalendario.getActiveTab().Datos.Involucrados),categorias:Ext.encode(tabCalendario.getActiveTab().Datos.Categorias), tipoact:Ext.encode(tabCalendario.getActiveTab().Datos.Tipoact), arrayautores : Ext.encode(tabCalendario.getActiveTab().Datos.Autores),planes:Ext.encode(tabCalendario.getActiveTab().Datos.Planes)};
							  }break;
						}
						Ext.Ajax.request({		
									url: 'imprimirvista',
									params:params,
									callback: function (options,success,response){
									    Ext.getBody().unmask();
										responseData = Ext.decode(response.responseText);
										if(ext == 'preview'){
														 winreport = new Ext.Window({
															id:'winreport',
															title:'<center>Visor de Reportes</center>',
															width:990,
															html:responseData,
															draggable:false,															
															autoScroll:true,															
															maximized:true,
															closeAction:'destroy',
															buttons:[{text:'Cerrar',
																	  handler:function(){winreport.destroy();}
																	 }],
															modal:true
														 });
														 winreport.show();
										}else{
											window.open('upload?titulo='+titleReport+'&extension='+ext+'&cuerporeporte='+responseData);
										}												
									}
						});
						



										
}




cargarInterfaz();


