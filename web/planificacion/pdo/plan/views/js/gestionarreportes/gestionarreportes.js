Ext.QuickTips.init();
var perfil = window.parent.UCID.portal.perfil
perfil.etiquetas = Object();

// function CargarInterfaz
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




	
var viewport,panelreportes,panelfiltros,reportesSistema,fpfiltros,tpcondicionales,stGpGestPlan,
    smGpPlan,gpPlan,winConfiguracion,fpConfiguracion;
var btnConfigFirma,btnImprimir,limpiarFiltro,btnWord,btnExcel,btnPdf,btnHTML,btnVistaPrevia;
var tfcargoelab,tfgradoelab,tfnombreelab,tfcargoapro,tfgradoapro,tfnombreapro,tfanno,storeMeses,cbmeses,fechainicial,fechafinal,conductor = null;	
var idplan,winreport,btnExpExcel,btnExpDoc,btnExpPdf,idreporte,formatoreporte = 'doc',
    pvReportes,smReportes,stcbconfidenc,cbconfidenc,stextensions,cbextensions,
	resultTpl,treeInvol,treeAutores,pfiltroAutorInvol,pfiltroNom,smGridTipoact,
	storeGridTipoact,prevrow = -1,gdGridTipoact,idnom,idrowpadre,smGridCategact,
	storeGridCategact,gdGridCategact,nomactivado = 0,tftituloreporte,ftituloreporte,ptituloreporte;

/*
  Funcion para la validacion de fechas.............................................
*/
Ext.apply(Ext.form.VTypes, {
  daterange: function(val, field) {
    var date = field.parseDate(val);
    
    
	//aki obligo  al picker a actualizar los valores para recalcular las fechas desabilitadas
    var dispUpd = function(picker) {
      var ad = picker.activeDate;
      picker.activeDate = null;
      picker.update(ad);
    };
    
    if (field.startDateField) {
      var sd = Ext.getCmp(field.startDateField);
      sd.maxValue = date;
      if (sd.menu && sd.menu.picker) {
        sd.menu.picker.maxDate = date;
        dispUpd(sd.menu.picker);
      }
    } else if (field.endDateField) {
      var ed = Ext.getCmp(field.endDateField);
      ed.minValue = date;
      if (ed.menu && ed.menu.picker) {
        ed.menu.picker.minDate = date;
        dispUpd(ed.menu.picker);
      }
    }
    
    return true;
  }
});


	function MostrarImagenTipoElemento(valor)
	{
	 return '<span><img src="../../../comun/recursos/images/fam/plan.png" >'+' '+valor+'</span>';
	}

	function Centrado(val)
	{        
     return '<center>'+val+'</center>';
    }
	
	function Cent(val)
	{        
     return '<b>'+val+'</b>';
    }

	//btnActualizar = new Ext.Toolbar.Button({ id: 'btnActualizar', icon: 'images/actualizar.gif',iconCls: 'btn', disabled: false, text: 'Actualizar',handler: function(){/*Inicio();*/}});
	btnExpExcel = new Ext.Toolbar.Button({ id: 'btnExpExcel', icon: '../../../comun/recursos/images/fam/page_excel.png',iconCls: 'btn', disabled: false,  tooltip:'Exportar a Excel',handler: function(){  Export('xls');     }});
	btnExpDoc = new Ext.Toolbar.Button({ id: 'btnExpDoc', icon: '../../../comun/recursos/images/fam/page_word.png',iconCls: 'btn', disabled: false,  tooltip:'Exportar a Word',handler: function(){  Export('doc');     }});
	btnExpPdf = new Ext.Toolbar.Button({ id: 'btnExpPdf', icon: '../../../comun/recursos/images/fam/pdf.png',iconCls: 'btn', disabled: false,  tooltip:'Exportar a Pdf',handler: function(){  Export('pdf');     }});

   
   btnConfigFirma = new Ext.Button({
        //icon:perfil.dirImg+'buscarclitepersona.png',
        iconCls:'buscarclitepersona',
        id:"btnConfigFirma",
		tooltip:'Configurar el encabezado y pie de firma del reporte',
        disabled:false,
		handler:function()
		{
		 CrearVentanaConfiguracion();
		},
       key: {
           ctrl:true,
           alt: true ,
           key: 'F'
       },
       scope: this
   });

	 limpiarFiltro = new Ext.Button({
        //text:'Limpiar filtros',
        //icon:perfil.dirImg+'limpiar.png',
        iconCls:'limpiar',
        id:"limpiarFiltro",
		tooltip:'Limpia los criterios de b&uacute;squeda',
        disabled:false,
		handler:function()
		{
		  LimpiarFiltros();
		},
         key: {
             alt: true ,
             key: 'L'
         },
         scope: this
     });
	
	btnImprimir = new Ext.Button({
	    text:'Exportar',
	    //icon:perfil.dirImg+'exportar.png',
	    iconCls:'exportar', 
	    id:"btnImprimir",
		menu:[
				{
					text:'Word',
					id:'word',
					icon:'../../../comun/recursos/images/fam/page_word.png',
					handler:function()
					{
						formatoreporte = 'doc';
						GenerarReporte();
					}
				},
				{
					text:'Excel',
					id:'excel',
					icon:'../../../comun/recursos/images/fam/page_excel.png',
					handler:function()
					{
						formatoreporte = 'xls';
						GenerarReporte();
					}
				},{
					text:'Html',
					id:'html',
					icon: '../../../comun/recursos/images/fam/page_world.png',
					handler:function()
					{
						formatoreporte = 'html';
						GenerarReporte();
					}
				}
		]
	});
    btnVistaPrevia = new Ext.Button({
        text:'Vista previa',
            id:'vprevia',
        iconCls:'buscar',
        //icon:'../../../comun/recursos/images/fam/search.gif',
        handler:function()
    {
        formatoreporte = 'vprevia';
        GenerarReporte();
    },
        key: {
            alt: true ,
                key: 'R'
        },
        scope: this
    });
	
	var fechaactual = new Date();
	var annoactual = fechaactual.getFullYear();
	
	tfanno = new Ext.form.NumberField({
		id:'tfanno',
		allowDecimals :false,
		allowNegative :false,
		maxLength :4,
		minLength :1,
		fieldLabel: 'Año',
		name: 'tfanno',
		width:150,
		enableKeyEvents :true,
		listeners:{
		 keyup  : function( tf, e ) 
			 { 
			  if(tfanno.getValue() != '')
			  {
			   btnImprimir.enable();	
			  }
			  if(tfanno.getValue() == '')
			  {		   
			   btnImprimir.disable();			   
			  }
			 },
		focus:function(tf)
		{
		 if(tfanno.getValue() == '')
		 {tfanno.setValue(annoactual);}		 
		}
		}
	});
		
	
	cbconfidenc = new Ext.form.TextField({
		id:'cbconfidenc',
		maskRe:/^([a-zA-Z0-9áéíóúñüÑ ]+ ?[a-zA-Z0-9áéíóúñüÑ ]*)+$/, 
		regex: /^([a-zA-Z0-9áéíóúñüÑ ]+ ?[a-zA-Z0-9áéíóúñüÑ ]*)+$/,
		witdh:100,
		value:'Público'
	}); 
	

    storeMeses = new Ext.data.SimpleStore({
		fields: ['idmes', 'mes'],
		data :[
				["01", "Enero"],
				["02", "Febrero"], 
				["03", "Marzo"],
				["04", "Abril"],
				["05", "Mayo"],
				["06", "Junio"],
				["07", "Julio"],
				["08", "Agosto"],
				["09", "Septiembre"],
				["10", "Octubre"],
				["11", "Noviembre"],
				["12", "Diciembre"]
		]
	});
    
    cbmeses = new Ext.form.ComboBox({
		id : 'cbmeses',
		name: 'cbmeses',
		fieldLabel: 'Mes',
		store: storeMeses,
		displayField:'mes',
		typeAhead: true,
		mode: 'local',
		forceSelection: true,
		triggerAction: 'all',
		hiddenName: 'idmes',
		valueField: 'idmes',
		width:150,
		emptyText:'Seleccionar',
		disabled: false,
		enableKeyEvents :true,
		listeners:{
		 select : function(combo,record,index )
		 {
			if(tfanno.getValue() == '')
			{tfanno.setValue(annoactual);}	
			btnImprimir.enable();		   
		 }
		}
	});

	fechafinal = new Ext.form.DateField({
		fieldLabel: 'Fecha fin',
		width:150,
		name:'fechafinal',
		id:'fechafinal',
		vtype: 'daterange',
        startDateField: 'fechainicial',
		format:'d/m/Y',
		enableKeyEvents :true
 	});
	
	fechainicial = new Ext.form.DateField({
		 fieldLabel: 'Fecha de inicio',
		 width:150,
		 name:'fechainicial',
		 id:'fechainicial',
		 vtype: 'daterange',
         endDateField: 'fechafinal',
		 format:'d/m/Y'
	});	
		
	
    
	stGpGestPlan =  new Ext.ux.maximgb.treegrid.AdjacencyListStore({		
		url:'/planificacion/pdo/plan/index.php/gestionarplan/cargarGridPlanes',
		//autoLoad:true,
		listeners:{
			beforeload:function(st){
				if(smGpPlan.getSelected()==undefined)
				st.removeAll();
			},
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
	
	smGpPlan = new Ext.grid.CheckboxSelectionModel({
	singleSelect:true,
	 listeners: {
	 	rowselect: function(sm,ri,record){	
 			idplan = record.data.idplan;
 		},
		rowdeselect: function(sm,ri,record){	
 			idplan = null;
 		}
	 }
	});
	
	gpPlan = new Ext.ux.maximgb.treegrid.GridPanel({
		title:'Desde planes existentes',
		autoScroll:true,
		store: stGpGestPlan,
		frame:true,
		master_column_id : 'expandir',
		autoExpandColumn:'expandir',
		stripeRows: true,
		sm:smGpPlan,
		loadMask:{msg :'Cargando planes'},
		root_title: 'Planes',
		columns:[
				smGpPlan,
		        {hidden:true, hideable: false, dataIndex: 'idplan'},
				{header: '<center>'+"Denominaci&oacute;n"+'</center>',id:'expandir', renderer:MostrarImagenTipoElemento,dataIndex: 'denominacion', sortable:true},
				//{header: '<center>'+"Categor&iacute;a"+'</center>', dataIndex: 'categoria', width:100,sortable:true,renderer:Centrado},  				
				{header: '<center>'+"Fecha de Inicio"+'</center>', dataIndex: 'fini', width:79,sortable:true,renderer:renderFecha},  
				{header: '<center>'+"Fecha de Fin"+'</center>', dataIndex: 'ffin', width:70,sortable:true,renderer:renderFecha}
		],
		bbar:[btnatras,'-','P&aacute;gina ',tfpagactual,' de ',tfpagtotal,'-',btnalante,'->','Encontrados ',tftotalobjencontrados,' resultados'],

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
		stGpGestPlan.removeAll();
		stGpGestPlan.reload({params:{offset:offset,limit:limit}});
	}
	
	
	//Acordion de autores
	treeAutores = new Ext.tree.TreePanel(
	{	  
		autoScroll:true,
		title:'Autores',
		margins:'3 3 3 3',
		width:260,
		region:'west',
		id:'treeAutores',
		//frame:false,
		tbar:['->',
		      {   iconCls:'x-btn-text-icon',
					   tooltip: 'Expandir agrupaci&oacute;n',
                       icon: '../../../comun/recursos/images/fam/expand-all.gif',
		         	   handler: function(){treeAutores.root.expand(true);}       
				 },{
						iconCls: 'icon-collapse-all',
		                tooltip: 'Contraer agrupaci&oacute;n',
						icon: '../../../comun/recursos/images/fam/collapse-all.gif',
		                handler: function(){treeAutores.root.collapse(true);}
				 }
				 ,{
						iconCls: 'icon-collapse-all',
		                tooltip: 'Refrescar agrupaci&oacute;n',
						icon: '../../../comun/recursos/images/fam/table_refresh.png',
		                handler: function(){treeAutores.getRootNode().reload();}
				 }
		],
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
								iconCls:'misgrupos',
								tipo: '2',
								leaf: false
							},{
								nodeType: 'async',
								id: 'nodo2',
								idgrupo: 'nodo2',
								text: 'Usuarios subordinados',
								iconCls:'misgrupos',
								tipo: '2',
								leaf: false
							},{
								nodeType: 'async',
								id: 'nodo3',
								idgrupo: 'nodo3',
								text: 'Otros usuarios(permisos del nivel superior)',
								iconCls:'misgrupos',
								tipo: '2',
								leaf: false
							}]	
							
        }, 	
		loader:new Ext.tree.TreeLoader({
			singleClickExpand:true, 
			dataUrl:'/planificacion/pdo/plan/index.php/gestionaractividades/cargarautores',
			listeners:{
			     'beforeload':function(atreeloader, anode){ 
                 atreeloader.baseParams = {tipo:anode.attributes.tipo, idgrupo:anode.attributes.idgrupo,idusuario:anode.attributes.idusuario};},
				 'load':function(atreeloader, anode){
				  /* if(cbaprob_conc.getValue() == 1 && anode.id == 'nodo3')
				   {
				    anode.eachChild(function(anodehijo){
						anodehijo.disable();
				    });
				   }*/
				}
			}
		})			
	});
	
	//Acordion de invol
	treeInvol = new Ext.tree.TreePanel(
	{	  
		autoScroll:true,
		title:'Involucrados',
		margins:'3 3 3 3',
		//width:300,
		region:'center',
		id:'treeInvol',
		frame:false,
		tbar:['->',
		      {   iconCls:'x-btn-text-icon',
					   tooltip: 'Expandir agrupaci&oacute;n',
                       icon: '../../../comun/recursos/images/fam/expand-all.gif',
		         	   handler: function(){treeInvol.root.expand(true);}       
				 },{
						iconCls: 'icon-collapse-all',
		                tooltip: 'Contraer agrupaci&oacute;n',
						icon: '../../../comun/recursos/images/fam/collapse-all.gif',
		                handler: function(){treeInvol.root.collapse(true);}
				 },{
						iconCls: 'icon-collapse-all',
		                tooltip: 'Refrescar agrupaci&oacute;n',
						icon: '../../../comun/recursos/images/fam/table_refresh.png',
		                handler: function(){treeInvol.root.reload();}
				 }
		],
		root:{
	            text: 'Involucrados',
				expanded:true,
	            id:'rootNodoAutores',
				children: [
							{
								nodeType: 'async',
								id: 'nodo1',
								idgrupo: 'nodo1',
								text: 'Mi usuario',
								iconCls:'misgrupos',
								tipo: '2',
								leaf: false
							},{
								nodeType: 'async',
								id: 'nodo2',
								idgrupo: 'nodo2',
								text: 'Mis grupos',
								iconCls:'misgrupos',
								tipo: '2',
								leaf: false
							},{
								nodeType: 'async',
								id: 'nodo3',
								idgrupo: 'nodo3',
								text: 'Usuarios subordinados',
								iconCls:'misgrupos',
								tipo: '2',
								leaf: false
							}]	
							
        }, 	
		loader:new Ext.tree.TreeLoader({
			singleClickExpand:true, 
			dataUrl:'/planificacion/pdo/plan/index.php/gestionaractividades/cargarinvol',
			listeners:{
			     'beforeload':function(atreeloader, anode){ 
                 atreeloader.baseParams = {tipo:anode.attributes.tipo, idgrupo:anode.attributes.idgrupo,idusuario:anode.attributes.idusuario};},
				 'load':function(atreeloader, anode){
				}
			}
		})			
	});
	
	pfiltroAutorInvol = new Ext.Panel({
		title:'Por autores e involucrados',
		id:'pfiltroAutorInvol',
		layout: 'border',
		items:[treeAutores,treeInvol]
	});
	
	
	smGridTipoact = new Ext.grid.CheckboxSelectionModel({
	   singleSelect:false,
	   listeners:{
	        rowselect: function(sm,indice,record){ 	 
				if (prevrow>=0 && prevrow!=indice)
				{
					Ext.get(gdGridTipoact.getView().getRow(prevrow)).removeClass('superior2');
					Ext.get(gdGridTipoact.getView().getRow(prevrow)).addClass('superior');						
				} 
				if (record.data.superior==1) 
				{ 
					Ext.get(gdGridTipoact.getView().getRow(indice)).removeClass('superior');
					Ext.get(gdGridTipoact.getView().getRow(indice)).addClass('superior2');
					prevrow = indice;
				} else prevrow = -1;	
			}
		}
	});
	
	storeGridTipoact = new Ext.ux.maximgb.treegrid.AdjacencyListStore({
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
	
	gdGridTipoact = new Ext.ux.maximgb.treegrid.GridPanel({
		store: storeGridTipoact,
		title:'Tipos de actividad',
		id:'gdGridTipoact',
		region: 'west',
		width:260,
		margins:'3 3 3 3',
		master_column_id : 'expandir',
		autoExpandColumn:'expandir',
		stripeRows: true,
		sm:smGridTipoact,
		root_title:' ',
		loadMask:{msg :'Cargando categor&iacute;as de actividad...'},
		columns: [
			smGridTipoact,
			{hidden:true , dataIndex: 'idnom'},
			{hidden:true , dataIndex: 'superior'},
			{id:'expandir',header: 'Denominación',dataIndex: 'denom'},
		]	
	});
	
	gdGridTipoact.getView().getRowClass = function(ri,n)
	{
		if (ri.data.superior == 1) return "superior";
	    else return "";
	}
	
	
	smGridCategact = new Ext.grid.CheckboxSelectionModel({
	   singleSelect:false,
	   listeners:{
	        rowselect: function(sm,indice,record){ 	 
				if (prevrow>=0 && prevrow!=indice)
				{
					Ext.get(gdGridTipoact.getView().getRow(prevrow)).removeClass('superior2');
					Ext.get(gdGridTipoact.getView().getRow(prevrow)).addClass('superior');						
				} 
				if (record.data.superior==1) 
				{ 
					Ext.get(gdGridTipoact.getView().getRow(indice)).removeClass('superior');
					Ext.get(gdGridTipoact.getView().getRow(indice)).addClass('superior2');
					prevrow = indice;
				} else prevrow = -1;	
			}
		}
	});
	
	storeGridCategact = new Ext.ux.maximgb.treegrid.AdjacencyListStore({
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
	
	gdGridCategact = new Ext.ux.maximgb.treegrid.GridPanel({
		store: storeGridCategact,
		title:'Categorías de actividad',
		id:'gdGridCategact',
		region: 'center',
		margins:'3 3 3 3',
		master_column_id : 'expandir',
		autoExpandColumn:'expandir',
		stripeRows: true,
		sm:smGridCategact,
		root_title:' ',
		loadMask:{msg :'Cargando tipos de actividad...'},
		columns: [
			smGridCategact,
			{hidden:true , dataIndex: 'idnom'},
			{hidden:true , dataIndex: 'superior'},
			{id:'expandir',header: 'Denominación',dataIndex: 'denom'},
		]	
	});
	
	gdGridCategact.getView().getRowClass = function(ri,n)
	{
		if (ri.data.superior == 1) return "superior";
	    else return "";
	}
	
	
	pfiltroNom = new Ext.Panel({
		title:'Por tipo y categoría de actividad',
		id:'pfiltroNom',
		layout: 'border',
		items:[gdGridTipoact,gdGridCategact],
		listeners:{
			activate:function(p){
				if(nomactivado == 0)
				{
					nomactivado = 1;
					tiponom = 3;
					storeGridTipoact.removeAll();
					storeGridTipoact.load({params:{tiponom: tiponom}});
					tipono = 2;
					storeGridCategact.removeAll();
					storeGridCategact.load({params:{tiponom: tipono}});
				}			
			}
		}
	});
	
	
	
	
	
	tpcondicionales = new Ext.TabPanel({
		activeTab:0,
		region:'center',
		margins:'3 3 3 3',
                id:'tpcondicionales',
		items:[gpPlan,pfiltroAutorInvol,pfiltroNom]
	});
	
	tftituloreporte = new Ext.form.TextField({
		id:'tftituloreporte',
                maxLength: 255,
                maxLengthText : 'El tamaño máximo requerido es 255 caracteres.',
		maskRe:/^([a-zA-Z0-9áéíóúñüÑ ()_-]+ ?[a-zA-Z0-9áéíóúñüÑ ()_-]*)+$/, 
		regex: /^([a-zA-Z0-9áéíóúñüÑ ()_-]+ ?[a-zA-Z0-9áéíóúñüÑ ()_-]*)+$/,
		fieldLabel:'T&iacute;tulo del reporte',
		width:600 
		
	});
	
	ftituloreporte = new Ext.FormPanel({
		id:'ftituloreporte',
		frame:true,
		labelalign:'left',
		items:[tftituloreporte]
	});
	
	ptituloreporte = new Ext.Panel({
		region:'north',
		layout:'fit',
		height:50,
		items:[ftituloreporte]
	});
		
	
	panelfiltros = new Ext.Panel({
	    title: 'Opciones de filtrado',
		margins:'3 3 3 3',
		layout:'border',
		id:'panelfiltros',
		frame:false,
		region:'center',
		disabled:true,
		tbar:['-',btnImprimir,'-',
			/*{
					text:'Vista previa',
					id:'vprevia',
					iconCls:'buscar',
					//icon:'../../../comun/recursos/images/fam/search.gif',
					handler:function()
					{
						formatoreporte = 'vprevia';
						GenerarReporte();
					}
			},*/btnVistaPrevia,'-'
			,btnConfigFirma,'-', limpiarFiltro,'->','Clasificación :',cbconfidenc,'-'
		],
        usarKeymap:true,
        botonesKeymap:[btnImprimir,btnVistaPrevia,btnConfigFirma],
        items:[
				ptituloreporte,
				{
				 width:200,
				 id:'pipf',
				 region:'west',	
				 title: 'Fechas y atributos del reporte',
				 autoScroll: true,
				 collapsible:true,
				 margins:'3 3 3 3',				 
				 layout: 'accordion',				 
				 items:[
						{
						 title:'Filtro de fechas',
						 bodyStyle:'padding:10px 5px 0',
						 layout:'form',
						 labelAlign:'top',
						 items:[
								{layout:'column',
								border:false,								
								items:[										
										{
											columnWidth:1,
											border:false,
											layout: 'form',
											labelAlign:'top',
											items:[
													{
														xtype:'fieldset',
														checkboxToggle:true,
														id:'anomes',
														title: 'Por año y mes',
														height:140,
														width: 180,
														listeners:{
															beforeexpand:function(p)
															{
																fechainicial.reset();
																fechafinal.reset();
																Ext.getCmp('fiff').collapse();
															}															
														},
														collapsed: true,		
														items:[
																{layout:'column',
																border:false,								
																items:[
																	{
																		columnWidth:1,
																		border:false,
																		layout: 'form',
																		labelAlign:'top',
																		items:[tfanno, cbmeses]
																	}
																]}
														]
													},
													{
														xtype:'fieldset',
														checkboxToggle:true,
														id:'fiff',
														title: 'Por rango de fechas',
														height:140,
														width: 180,
														listeners:{
															beforeexpand:function(p)
															{
																tfanno.reset();
																cbmeses.clearValue();
																Ext.getCmp('anomes').collapse();
															}
														},
														collapsed: true,
														items:[
																{layout:'column',
																border:false,								
																items:[
																       {
																		columnWidth:1,
																		border:false,
																		layout: 'form',
																		labelAlign:'top',
																		items:[fechainicial,fechafinal]
																	}
																]}
														]
													}
											]
										}
									]
								}
							   ]
						},
						{
						 title:'Mostrar en el reporte :',
						 layout:'form',
						 labelAlign:'right',
						 border:true,						 
						 items:[
								{layout:'column',
								border:false,								
								items:[
										{
											columnWidth:.7,
											border:false,
											layout: 'form',
											labelAlign:'right',
											items:[
													{
													 xtype:'checkbox',
													 id:'encabezado',
													 checked :true,
													 fieldLabel: 'Encabezado'
													},
													{
													 xtype:'checkbox',
													 id:'piepagina',
													 checked :true,
													 fieldLabel: 'Pie de firma'
													},{
													 xtype:'checkbox',
													 id:'actpal',
													 checked :true,
													 fieldLabel: 'Act. principales'
													},{
													 xtype:'checkbox',
													 id:'conf',
													 checked :true,
													 fieldLabel: 'Clasificación'
													},{
													 xtype:'checkbox',
													 id:'rangofecha',
													 checked :true,
													 fieldLabel: 'Rango de fechas'
													}	
											]
										}
									  ]
								}
							   ]
						},
						{
						 title:'Condición de búsqueda :',
						 layout:'form',
						 height:130,
						 labelAlign:'right',
						 border:true,
						 items:[
								{layout:'column',
								 border:false,
								 items:[
										{
											columnWidth:.9,
											border:false,
											layout: 'form',
											labelAlign:'right',
											items:[
													{
													 xtype:'checkbox',
													 id:'todoscrit',
													 checked :false,
													 fieldLabel: 'Deben coincidir todos los criterios de búsqueda'
													}
											]
										}
									   ]
								}
							]
						}
						
				       ]
				},
				tpcondicionales		      
		]		
    });



    reportesSistema = [ 
		{ text: 'Plan de Actividades por Areas',/*icon:'../../../comun/recursos/images/fam/reporte.png',*/  disabled :true,iconCls:'reportes',leaf: true, referencia: ' ', id:'2'},
		{ text: 'Plan de Actividades',/*icon:'../../../comun/recursos/images/fam/reporte.png',*/  disabled :true, iconCls:'reportes',leaf: true, referencia: ' ', id:'2'},
		{ text: 'Plan Mensual', /*icon:'../../../comun/recursos/images/fam/reporte.png',*/ disabled :false, leaf: true, iconCls:'reportes', referencia: ' ', id:'2'}
    ];
    
	
	stReportes =  new Ext.data.Store({
		autoLoad :true,
		url: 'cargarreportes',
		reader:new Ext.data.JsonReader(
		    {
				totalProperty: "total",
				root: "campos",
				id: "idreporte"
			},
			[{name:'idreporte'},{name:'denreporte'},{name:'descreporte'},{name:'icon'}]
	    )
	});
	
	smReportes = new Ext.grid.RowSelectionModel({listeners:{rowselect: On_RowClick}});
	
	panelreportes = new Ext.grid.GridPanel({ 
		id:'panelreportes',
		margins:'3 3 3 3',
		width:270,
		sm:smReportes,
		region: 'west',
		title: '<center>Reportes existentes</center>',
		autoScroll: true,
		collapsible:true,
		columns:[{dataIndex: 'denreporte',width: 265,header:'',renderer:Cent}],
		store:stReportes,
		loadMask:{msg :'Cargando reportes ...'},
		viewConfig: {
			tpl: new Ext.XTemplate(
					'<tpl>' +
					'<div class="mouseover">' +
					'<img class="mouseover" style="width:35%;float:left" src="../../../comun/recursos/images/fam/{icon}"/ ><div class="mouseover" style="width:60%;float:left">{descreporte}</div>' +
					'</div>' +
					'</tpl>'
					),
				enableRowBody: true,
				getRowClass: function(rec, idx, p, store) {
				p.body = this.tpl.apply(rec.data);
			}
		}
	});

	viewport = new Ext.Viewport({
		frame:false,
		layout:'border',
		items:[panelreportes,panelfiltros]
	});
	
	
	
	
	tfcargoapro = new Ext.form.TextField({
		id:'cargoaprueba',
		fieldLabel: 'Cargo',
                maxLength: 255,
                maxLengthText : 'El tamaño máximo requerido es 255 caracteres.',
		maskRe:/^([a-zA-Z0-9áéíóúñüÑ ]+ ?[a-zA-Z0-9áéíóúñüÑ ]*)+$/, 
		regex: /^([a-zA-Z0-9áéíóúñüÑ ]+ ?[a-zA-Z0-9áéíóúñüÑ ]*)+$/,
		name: 'cargoaprueba',
		width:200
	});
	
	tfgradoapro = new Ext.form.TextField({
		id:'gradoaprueba',
                maxLength: 255,
                maxLengthText : 'El tamaño máximo requerido es 255 caracteres.',
		maskRe:/^([a-zA-Z0-9áéíóúñüÑ ]+ ?[a-zA-Z0-9áéíóúñüÑ ]*)+$/, 
		regex: /^([a-zA-Z0-9áéíóúñüÑ ]+ ?[a-zA-Z0-9áéíóúñüÑ ]*)+$/,
		fieldLabel: 'Grado',
		name: 'gradoaprueba',
		width:200
	});
	
	tfnombreapro = new Ext.form.TextField({
		id:'nombreaprueba',
		fieldLabel: 'Nombre',
                maxLength: 255,
                maxLengthText : 'El tamaño máximo requerido es 255 caracteres.',
		maskRe:/^([a-zA-Z0-9áéíóúñüÑ ]+ ?[a-zA-Z0-9áéíóúñüÑ ]*)+$/, 
		regex: /^([a-zA-Z0-9áéíóúñüÑ ]+ ?[a-zA-Z0-9áéíóúñüÑ ]*)+$/,
		name: 'nombreaprueba',
		width:200
	});
	
	tfcargoelab = new Ext.form.TextField({
		id:'cargoelabora',
		fieldLabel: 'Cargo',
                maxLength: 255,
                maxLengthText : 'El tamaño máximo requerido es 255 caracteres.',
		maskRe:/^([a-zA-Z0-9áéíóúñüÑ ]+ ?[a-zA-Z0-9áéíóúñüÑ ]*)+$/, 
		regex: /^([a-zA-Z0-9áéíóúñüÑ ]+ ?[a-zA-Z0-9áéíóúñüÑ ]*)+$/,
		name: 'cargoelabora',
		width:200
	});
	
	tfgradoelab = new Ext.form.TextField({
		id:'gradoelabora',
		fieldLabel: 'Grado',
		maskRe:/^([a-zA-Z0-9áéíóúñüÑ ]+ ?[a-zA-Z0-9áéíóúñüÑ ]*)+$/, 
		regex: /^([a-zA-Z0-9áéíóúñüÑ ]+ ?[a-zA-Z0-9áéíóúñüÑ ]*)+$/,
                maxLengthText : 'El tamaño máximo requerido es 50 caracteres.',
		maxLength:50,
		name: 'gradoelabora',
		width:200
	});
	
	tfnombreelab = new Ext.form.TextField({
		id:'nombrelabora',
		fieldLabel: 'Nombre',
                maxLength: 255,
                maxLengthText : 'El tamaño máximo requerido es 255 caracteres.',
		maskRe:/^([a-zA-Z0-9áéíóúñüÑ ]+ ?[a-zA-Z0-9áéíóúñüÑ ]*)+$/, 
		regex: /^([a-zA-Z0-9áéíóúñüÑ ]+ ?[a-zA-Z0-9áéíóúñüÑ ]*)+$/,
		name: 'nombrelabora',
		width:200
	});
	
	fpConfiguracion = new Ext.FormPanel({
		id:'fpConfiguracion',
		frame:true,
		border:false,
		rezisable:false,
		labelAlign:'top',
		width:500,
		height:300,
		items:[
				{
				 layout:'column',
				 border:false,
				 items:[
						{
						 columnWidth:.5,
						 border:false,
						 layout: 'form',
						 labelAlign:'top',
						 items:[
								{ xtype:'fieldset',
								  title: 'Aprobado por:',
								  frame:false,
								  layout:'form',
								  width:230,
								  height:180,
								  items:[tfcargoapro,tfgradoapro,tfnombreapro]
								}
						 ]
						},
						{
						 columnWidth:.5,
						 border:false,
						 layout: 'form',
						 labelAlign:'top',
						 items:[
								{ xtype:'fieldset',
								  title: 'Elaborado por:',
								  frame:false,
								  layout:'form',
								  width:230,
								  height:180,
								  items:[tfcargoelab,tfgradoelab,tfnombreelab]
								}
						 ]
						}
				 ]
				}
		]
	
	});
	
	winConfiguracion = new Ext.Window({
		id:'winConfiguracion',
		title:'Datos de encabezado/pie de firma',
		width:500,
		height:260,
		draggable:false,
		closeAction:'hide',
		modal:true,
		items:[fpConfiguracion],
		buttons:[
				 new Ext.Button({
				  text:'Cancelar',
				  id:'cancelConf',
				  //icon:perfil.dirImg+'cancelar.png',
				  iconCls:'cancelar',
				  handler:function()
				  {
					tfcargoapro.reset();
					tfgradoapro.reset();
					tfnombreapro.reset();
				 
					tfcargoelab.reset();
					tfgradoelab.reset();
					tfnombreelab.reset();
					/*if(idreporte == '2')
					{gpPlan.disable();}*/
					winConfiguracion.hide();
				  }
				 }),
				 new Ext.Button({
				  text:'Aceptar',
				  id:'acepConf',
				  //icon:perfil.dirImg+'aceptar.png',
				  iconCls:'aceptar',
				  handler:function()
				  {
				   CrearConfiguracion();
				  }
				 })
		]
	 });
	
	
	
	
	function CrearVentanaConfiguracion()
	{
      //if(idreporte == '2'){gpPlan.enable();}  
	  winConfiguracion.show();
	  fpConfiguracion.getForm().load({
		  success:function(){},waitMsg:'Cargando configuracion ...',
		  url:'cargarconfiguracion'
	  });
	}
	
	
	function CrearConfiguracion()
	{
	 var cargoaprueba = tfcargoapro.getValue();
	 var gradoaprueba = tfgradoapro.getValue();
	 var nombreaprueba = tfnombreapro.getValue();
	 
	 var cargoelabora = tfcargoelab.getValue();
	 var gradoelabora = tfgradoelab.getValue();
	 var nombreelabora = tfnombreelab.getValue();
	 
	 Ext.getBody().mask('Configurando firma.Espere por favor..');
	 Ext.Ajax.request({
		url: 'configurarfirma',
		method:'POST',
		params:{cargoaprueba:cargoaprueba,gradoaprueba:gradoaprueba,nombreaprueba:nombreaprueba,
		        cargoelabora:cargoelabora,gradoelabora:gradoelabora,nombreelabora:nombreelabora},
		callback: function (options,success,response){	
            Ext.getBody().unmask();		
			winConfiguracion.hide();
			
			tfcargoapro.reset();
			tfgradoapro.reset();
			tfnombreapro.reset();
		 
			tfcargoelab.reset();
			tfgradoelab.reset();
			tfnombreelab.reset();
			/*if(idreporte == '2')
			{gpPlan.disable();}*/
      }
	 });	 
	}
	
	
    
	
	function GenerarReporte()
	{
		var puedegenerar = 1;
		var valueanno = tfanno.getValue();
		var	valuefi = fechainicial.getValue();
		var	valueff = fechafinal.getValue();
		var	valuenummeses = cbmeses.getValue();
		var	valuetextomeses = cbmeses.getRawValue();
		if((idreporte == 0 || idreporte == 3)&& idplan == null)
		{
			puedegenerar = 0;			
		}
		if(idreporte == 2 && !valuenummeses)
		{
			puedegenerar = 2;			
		}
		
		if(puedegenerar == 0)
		{
			mostrarMensaje(1,'Para generar este reporte es necesario seleccionar un plan.',function(){
			return;
			});
		}
		else if(puedegenerar == 2)
		{
			mostrarMensaje(1,'Para generar este reporte es necesario introducir año y mes.',function(){
			return;
			});
		}
		else{
			var encabezado = Ext.getCmp('encabezado').getValue();
			var piepagina = Ext.getCmp('piepagina').getValue();
			var principales = Ext.getCmp('actpal').getValue();
			var confidencialidad = Ext.getCmp('conf').getValue();
			var rangofecha = Ext.getCmp('rangofecha').getValue();
			var todoscrit = Ext.getCmp('todoscrit').getValue();
			var textconfidencialidad = cbconfidenc.getValue();//RawValue();
			var tituloreporte = tftituloreporte.getValue();
			
			var arrayautores = [];
			var arrayinvol = [];
			var autoreschekeados = treeAutores.getChecked();
			var totalautorescheck = autoreschekeados.length;
			var involchekeados = treeInvol.getChecked();
			var totalinvolcheck = involchekeados.length;
			if(totalautorescheck > 0)
			{
				for(var i = 0;i<totalautorescheck;i++)
				{
					var nodo = {tipo:autoreschekeados[i].attributes.tipo,
								idusuario:autoreschekeados[i].attributes.idusuario,
								idgrupo:autoreschekeados[i].attributes.idgrupo};
					arrayautores.push(nodo);
				}
			}
			if(totalinvolcheck > 0)
			{
				for(var i = 0;i<totalinvolcheck;i++)
				{
					var nodo = {tipo:involchekeados[i].attributes.tipo,
								idusuario:involchekeados[i].attributes.idusuario,
								idgrupo:involchekeados[i].attributes.idgrupo};
					arrayinvol.push(nodo);
				}
			}
			
			var arraytipoact = smGridTipoact.getSelections();
			var arraycategact = smGridCategact.getSelections();
			var totalrectipoact = arraytipoact.length;
			var totalreccategact = arraycategact.length;
			var arrayidnom = [];
			for(var i=0;i<totalrectipoact;i++)
			{
				var nodo = {idnom:arraytipoact[i].data.idnom};
				arrayidnom.push(nodo);
				if(arraytipoact[i].data._is_leaf == false)
				{
					gdGridTipoact.getStore().each(function(record){
						if(record.data._parent == arraytipoact[i].data.idnom)
						{
							nodo = {idnom:record.data.idnom};
							arrayidnom.push(nodo);
						}
					});
				}
			}
			
			for(var i=0;i<totalreccategact;i++)
			{
				var nodo = {idnom:arraycategact[i].data.idnom};
				arrayidnom.push(nodo);
				if(arraycategact[i].data.is_leaf == false)
				{
					gdGridCategact.getStore().each(function(record){
						if(record.data._parent == arraycategact[i].data.idnom)
						{
							nodo = {idnom:record.data.idnom};
							arrayidnom.push(nodo);
						}
					});
				}
			}
			
			
			MostrarVentanaReporte(idreporte,valueanno,valuefi,valueff,valuenummeses,valuetextomeses,idplan,idreporte,
								encabezado,piepagina,principales,confidencialidad,textconfidencialidad,rangofecha,
								arrayautores,arrayinvol,arrayidnom,todoscrit,tituloreporte);
		}	
	}
	
	
	function MostrarVentanaReporte(idreporte,valueanno,valuefi,valueff,valuenummeses,valuetextomeses,idplan,idreporte,
									encabezado,piepagina,principales,confidencialidad,textconfidencialidad,rangofecha,
									arrayautores,arrayinvol,arrayidnom,todoscrit,tituloreporte)
	{ 
	 Ext.getBody().mask('Procesando informaci&oacute;n. Espere por favor...');
	 Ext.Ajax.request({
		url: 'generarreportes',
		method:'POST',
		params:{ valueanno:valueanno, valuefi:Ext.encode(valuefi), valueff:Ext.encode(valueff), valuenummeses: valuenummeses, 
				valuetextomeses: valuetextomeses, idplan : idplan, idreporte:idreporte,
				conductor:conductor,encabezado:encabezado,piepagina:piepagina,principales:principales,
				confidencialidad:confidencialidad,textconfidencialidad:textconfidencialidad,
				tituloreporte:tituloreporte,rangofecha:rangofecha,arrayautores:Ext.encode(arrayautores),
				arrayinvol:Ext.encode(arrayinvol),arrayidnom:Ext.encode(arrayidnom),todoscrit:todoscrit},
		callback: function (options,success,response){	
            Ext.getBody().unmask();	
			
			var cuerporeporte = Ext.decode(response.responseText);
			if(formatoreporte == 'vprevia')
			{
			 winreport = new Ext.Window({
				id:'winreport',
				title:'<center>Visor de Reportes</center>',
				width:990,
				html:cuerporeporte,
				draggable:false,
				//frame:false,
				autoScroll:true,
				listeners:{
				   beforehide :function(w)
				   {
				    //gpPlan.disable();
				   }
				},
				maximized:true,
				closeAction:'destroy',
				buttons:[
				         {
							text:'Cerrar',
							handler:function(){
								winreport.destroy();
							}
						 }
				],
				modal:true
			 });
			 //gpPlan.enable();
			 winreport.show();
			}
			if(formatoreporte != 'vprevia')
			{
				if(!tituloreporte)
				{
					mostrarMensaje(1,'Para exportar es necesario el titulo del reporte.',function(){
					return;
					});
				}
				else
				{var exportar=window.open('upload?titulo='+tituloreporte+'&extension='+'.'+formatoreporte+'&cuerporeporte='+cuerporeporte);}
			}					
		}
      });
	}
	
	
	function HabilitarCampos(id)
	{
		idreporte = id;
		switch(idreporte)
		{
			case 0:
				Ext.getCmp('anomes').collapse();
				Ext.getCmp('fiff').show();				
				Ext.getCmp('fiff').collapse();
				tfanno.reset();
				fechainicial.reset();
				fechafinal.reset();
				cbmeses.clearValue();
				btnImprimir.enable();
			break;
			case 1:
				Ext.getCmp('anomes').collapse();
				Ext.getCmp('fiff').show();
				Ext.getCmp('fiff').collapse();
				tfanno.reset();
				fechainicial.reset();
				fechafinal.reset();
				cbmeses.clearValue();
				btnImprimir.enable();
			break;
			case 2:
				Ext.getCmp('anomes').expand();
				Ext.getCmp('fiff').collapse();
				Ext.getCmp('fiff').hide();
				tfanno.reset();
				fechainicial.reset();
				fechafinal.reset();
				cbmeses.clearValue();
				btnImprimir.enable();
			break;
		}
		
		fechainicial.enable();
		fechafinal.enable();
		cbmeses.enable();
		tfanno.enable();
		gpPlan.enable();
		//LimpiarFiltros();
	}
	
	
	function ChequearFormatos(radio,check)
	{ 
	 if(check)
	 {
	  if(radio.id == 'rword')
	  {
	   formatoreporte = 'doc';
	   Ext.getCmp('rexcel').setValue(false);
	   Ext.getCmp('rhtml').setValue(false);
	  }
	  if(radio.id == 'rexcel')
	  {
	   formatoreporte = 'xls';
	   Ext.getCmp('rword').setValue(false);
	   Ext.getCmp('rhtml').setValue(false);
	  }
	  if(radio.id == 'rhtml')
	  {
	   formatoreporte = 'html';
	   Ext.getCmp('rword').setValue(false);
	   Ext.getCmp('rexcel').setValue(false);
	  }
	 }
	}
	
	
    function LimpiarFiltros()
	{
		var autoreschekeados = treeAutores.getChecked();
		var totalautorescheck = autoreschekeados.length;
		var involchekeados = treeInvol.getChecked();
		var totalinvolcheck = involchekeados.length;
		if(totalautorescheck)
		{
			for (var index = 0; index < totalautorescheck; index++)
			{
				treeAutores.getNodeById(autoreschekeados[index].id).getUI().toggleCheck(false);
			}
		}
		if(totalinvolcheck)
		{
			for (var index = 0; index < totalinvolcheck; index++)
			{
				treeInvol.getNodeById(involchekeados[index].id).getUI().toggleCheck(false);
			}
		}
		
		cbmeses.clearValue();
		tfanno.reset();
		fechainicial.reset();
		fechafinal.reset();
		smGpPlan.clearSelections();
		smGridCategact.clearSelections();
		smGridTipoact.clearSelections();
	 
	}
	
	function On_RowClick(sm, indiceFila, record){
		tftituloreporte.setValue(record.data.denreporte);
		panelfiltros.enable();
		HabilitarCampos(record.data.idreporte);			
	}
	
stGpGestPlan.removeAll();
stGpGestPlan.reload({params:{offset:offset,limit:limit}});
	
}//fin de funcion cargarInterfaz
cargarInterfaz();