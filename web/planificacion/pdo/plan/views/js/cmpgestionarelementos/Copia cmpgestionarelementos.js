Ext.QuickTips.init();
var perfil = window.parent.UCID.portal.perfil
perfil.etiquetas = Object();

//variables contenedoras de objetos de la plantilla
var vpPrincipal, pCentral, psubCentral, smTGElementosPlanificacion,
	storeTGElementosPlanificacion,gdTGElementosPlanificacion,
	pBusquedaElementos;

//variables contenedoras de objetos de toolbar y bbar	
var stcbaprob_conc, cbaprob_conc, stestados, cbestados,btnAdicionar, 
	btnModificar, btnEliminar, btnActivar, btnDesactivar,menubtnAdicionar;



// function CargarInterfaz
function cargarInterfaz(){

Ext.MenuConceptosIniciales.init();
//menu del boton adicionar elementos de la planificacion
/*var menubtnAdicionar = new Ext.menu.Menu({
	id: 'menubtnAdicionar',
	items:[
			{
                text: 'actividad',
                iconCls: 'calendar'              
            }
	]
});*/
//botones para la gestion de elementos de la planificacion
btnAdicionar = new Ext.Button({text:'Adicionar', disabled:false,handler:function(){Ext.MenuConceptosIniciales.reload()},menu:Ext.MenuConceptosIniciales.menuconceptosiniciales,id:'btnAdicionar', icon:perfil.dirImg+'adicionar.png', iconCls:'btn', tooltip:'Adicionar elementos de la planificaci&oacute;n',
    key: {
        alt: true ,
        key: 'I'
    },
    scope: this
});
btnEliminar = new Ext.Button({text:'Eliminar', disabled:true,handler: function(){},  id:'btnEliminar', icon:perfil.dirImg+'eliminar.png', iconCls:'btn', tooltip:'Eliminar elementos de la planificaci&oacute;n',
    key: {
        key: Ext.EventObject.DELETE
    },
    scope: this
});
btnModificar = new Ext.Button({text:'Modificar', disabled:true,handler:function(){},id:'btnModificar', icon:perfil.dirImg+'modificar.png', iconCls:'btn', tooltip:'Modificar elementos de la planificaci&oacute;n',
    key: {
        alt: true ,
        key: 'M'
    },
    scope: this
});
btnActivar = new Ext.Button({text:'Activar', disabled:true,handler:function(){}, id:'btnActivar', icon:perfil.dirImg+'habilitar.png', iconCls:'btn', tooltip:'Activar elementos de la planificaci&oacute;n',
    key: {
        alt: true ,
        key: 'X'
    },
    scope: this
});
btnDesactivar = new Ext.Button({text:'Desactivar', disabled:true,handler:function(){},id:'btnDesactivar', icon:perfil.dirImg+'deshabilitar.png', iconCls:'btn', tooltip:'Desactivar elementos de la planificaci&oacute;n',
    key: {
        alt: true ,
        key: 'F'
    },
    scope: this
});
	



//store del combo de estados
stestados = new Ext.data.Store(
{
	url:'cargarcmbestados',
	reader:new Ext.data.JsonReader(
	{
		id:'idestado',
		root: "data"		
	},
	[{name:'idestado'},{name:'denominacion'}])
});
//combo de estados
cbestados = new Ext.form.ComboBox({
	fieldLabel: 'Estado',
	name:'cbestados', 
	id:'cbestados', 
	store: stestados,
	valueField:'idestado',
	displayField:'denominacion',		                                                                                                                                                 
	triggerAction:'all',
	mode:'remote',	
	editable:false,
	disabled:true,
	emptyText: 'Seleccione...',
	width:717 ,
	listeners:{
	  select :function(cb,record,index)	{
	  
	 }
	}       
});

//store del combo de aprobacion-conciliacion
stcbaprob_conc = new Ext.data.SimpleStore({
		id:'stcbaprob_conc',
		fields: ['idac', 'denac'],
		data :[
			[1, 'Sí'],
			[0, 'No']
		]
});	
//combo de aprobacion-conciliacion	
cbaprob_conc = new Ext.form.ComboBox({
	id : 'cbaprob_conc',
	name: 'cbaprob_conc',
	value:0,
	store: stcbaprob_conc,
	displayField:'denac',
	typeAhead: true,
	mode: 'local',
	forceSelection: true,
	triggerAction: 'all',
	selectOnFocus:true,
	hiddenName: 'idac',
	valueField: 'idac',
	width:80,
	emptyText:'Seleccionar',
	listeners:{
	  select :function(cb,record,index)	{
	  
	 }
	}
});


//modo de seleccion del treegrid de elementos de la planificacion
smTGElementosPlanificacion = new Ext.grid.RowSelectionModel({
   singleSelect:true,
   listeners:{
		//rowselect: On_RowClickGridActRegistradasPorMi		
		}
});
//Store del treegrid de elementos de la planificacion
storeTGElementosPlanificacion = new Ext.ux.maximgb.treegrid.AdjacencyListStore({
	id:'TGElementosPlanificacion',
	url: 'cargarelementos',
	listeners:{
		 load :function(store,record,options)
		 {  		

		 }
	},
	reader: new Ext.data.JsonReader(
	{
		id: 'idelemento' ,
		root: 'campos',
		totalProperty: 'total' 
		},
		[
		   {name: 'categoriaactividad'},
		   {name: 'tipoactividad'},
		   {name: 'estadocumplimiento'},
		   {name: 'estadoaprobacion'},
		   {name: 'grado'},
		   {name: 'fechainicio'},
		   {name: 'fechafin'},
		   {name: 'lugar'},
		   {name: 'horainicio'},
		   {name: 'horafin'},
		   {name: 'descelemento'},
		   {name: 'participantes'},
		   {name: 'dirigente'},
		   {name: 'denelemento'},
		   {name: 'idelemento'},
		   
		   {name: 'intervalo'},
		   {name: 'pordias'},
		   {name: 'porsemana'},
		   {name: 'cantidaddias'},
		   {name: 'terminarEl'},
		   
		   {name: 'llevahistorial'},
		   {name: 'activo'},
		   {name: 'tiporepeticion'},
		   
		   {name: '_parent'},
		   {name: '_is_leaf'},
		   {name: '_is_expand'},
		   {name: 'idautor'},
		   {name: 'nombreautor'},
		   {name: 'superior'},
		   
		   {name: 'leer'},
		   {name: 'adicionar'},
		   {name: 'modificar'},
		   {name: 'eliminar'},
		   {name: 'idestadoaprob'},
		   {name: 'subordinado'}
		]			
	)
});
//treegrid de elementos de la planificacion
gdTGElementosPlanificacion = new Ext.ux.maximgb.treegrid.GridPanel({
	store: storeTGElementosPlanificacion,
	id:'gdTGElementosPlanificacion',
	region: 'center',
	margins:'3 0 3 3',
	master_column_id : 'expandir',
	autoExpandColumn:'expandir',
	stripeRows: true,
	sm:smTGElementosPlanificacion,
	root_title:'->',
	loadMask:{msg :'Cargando elementos de la planificaci&oacute;n'},
	columns: [
		{header:'<center>CAR</center>' , dataIndex: 'idelemento',width:80},
		{id:'expandir',header: '<center>Denominación</center>',dataIndex: 'denelemento'},
		{header: '<center>Fecha de inicio</center>', width:80,  type:'date',dataIndex: 'fechainicio'},
		{header: '<center>Fecha de fin</center>', width:80,  type:'date',dataIndex: 'fechafin'},			
		{header: '<center>Activo</center>',width:70,dataIndex: 'activo'},
		{header: '<center>Autor</center>',width:80,dataIndex: 'nombreautor'},
		{header: '<center>Estado de aprobaci&oacute;n</center>',width:150,dataIndex: 'estadoaprobacion'},
		{header: '<center>Estado de cumplimiento</center>',width:165, dataIndex: 'estadocumplimiento'}
	],
	bbar:new classPaginadoTreegrid(10,storeTGElementosPlanificacion),
	listeners:
	{
		/*rowcontextmenu : function(t,ri,e) 
		{
			smGridTaTablasSegunda.selectRow(ri);
			e.stopEvent();
			var xy = e.getXY();
			gdGestionTablasSegunda.contextMenu = menuObs;
			gdGestionTablasSegunda.contextMenu.showAt(xy);			
		}*/				   
	}//,
	//bbar:[btnatras,'-','P&aacute;gina ',tfpagactual,' de ',tfpagtotal,'-',btnalante,'->','Encontrados ',tftotalobjencontrados,' resultados']		
});

//panel lateral derecho para la busqueda de elementos
pBusquedaElementos = new Ext.Panel({
	title:'Opciones de b&uacute;squeda',
	id:'pBusquedaElementos',
	layout:'fit',
	width:300,
	collapsible: true,
	collapsed: true,
	margins:'3 3 3 3',
	region: 'east'
	//buttons:[btnBuscarActSeg]
});




//Panel contenedor del grid de actividades  
psubCentral = new Ext.Panel({
	layout:'border',
	id:'psubCentral',
    usarKeymap:true,
    botonesKeymap:[btnAdicionar, btnModificar, btnEliminar,'-', btnActivar, btnDesactivar],
	tbar:[btnAdicionar, btnModificar, btnEliminar,'-', btnActivar, btnDesactivar,'-'],
	items:[gdTGElementosPlanificacion,pBusquedaElementos]
});

//panel principal de la  plantilla
pCentral = new Ext.Panel({
	title:'<center>Registro de elementos de la planificaci&oacute;n</center>',
	layout:'fit',
	id:'pCentral',
	region:'center',
	height:270,
	tbar:['-','Aprobaci&oacute;n-conciliaci&oacute;n :',' ',cbaprob_conc,' ','Estado :',' ',cbestados],
	items:[psubCentral]
});

// viewport de la plantilla
vpPrincipal = new Ext.Viewport({
	layout:'border',
	items:[ pCentral]
})


}
cargarInterfaz();



	