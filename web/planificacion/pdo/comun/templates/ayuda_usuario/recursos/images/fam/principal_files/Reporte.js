Ext.BLANK_IMAGE_URL = 'images/s.gif';
Ext.QuickTips.init();

var btnhome,btnAceptar,formReportes,btnActualizar,btnImprimir;
var aprobado, confeccionado,tabpanel;
var gParticipantes,stParticipantes,smParticipantes,cmParticipantes;
var idplan,refer, repd ,valueaprob, valueconfecc, valuefi, valueff, valueresp, valuecat,valuetipact ;
var arrayparticipantes = [];
var participante;
var winreport;
var tabactprincipales,listtareas,fechainicial,fechafinal;


var reportesSistema = [{ text: 'Plan de actividades de las FAR', leaf: true, referencia: 'PLAN DE ACTIVIDADES DE LAS FAR', id: 'paf', rd:1 },
			          { text: 'Plan por Actividades', leaf: true, referencia: 'PLAN POR ACTIVIDADES', id: 'rta', rd:1 },
			          { text: 'Plan de Trabajo', leaf: true, referencia: 'PLAN DE TRABAJO', id: 'pt', rd:1 },		        
			          { text: 'Plan de Trabajo Mensual', leaf: true, referencia: 'ptm', id: 'ptm', rd:0 }];



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



CargarInterfaz = function(){

    btnAceptar = new Ext.Button({text:'Aceptar',icon:'images/accept.png',iconCls:'btn',id:"Aceptar"	, disabled: false,handler: function(){Aceptar();}});
    btnhome = new Ext.Toolbar.Button({ id: 'btnhome', icon: 'images/menu/programs.gif',iconCls: 'btn', disabled: false, text: '<b>Inicio</b>',handler: function(){/*Inicio();*/}});
    btnActualizar = new Ext.Toolbar.Button({ id: 'btnActualizar', icon: 'images/actualizar.gif',iconCls: 'btn', disabled: false, text: 'Actualizar',handler: function(){/*Inicio();*/}});
	btnImprimir = new Ext.Toolbar.Button({ id: 'btnImprimir', icon: 'images/printer.png',iconCls: 'btn', disabled: false, text: 'Imprimir',handler: function(){/*Inicio();*/}});
	//store del grid paracargar participantes
	stParticipantes = new Ext.data.Store({
	    url:'pruebaclases.php',
        baseParams: {
            accion: 'loadinvolucradosGrid',
            opcion: 1,      
        },  
		autoLoad:true,
        reader: new Ext.data.JsonReader({
        totalProperty: "cant_filas",
                   root: "filas",
        id: "idusuario" 
       },
	   [
	    {name:'idusuario'},
        {name:'usuario'}
       ])
    });
	
	//modo de seleccion del grid
	smParticipantes = new Ext.grid.CheckboxSelectionModel({
	    singleSelect: true,
	    listeners: {rowselect: On_RowClick} 
	});
	
	//column model del grid
	cmParticipantes= [
		{hidden:true, hideable: false, dataIndex:'idusuario'},				
		{id:'expandir',header: "Denominaci&oacute;n",  dataIndex: 'usuario'},
		smParticipantes
	];
	
	//grid
	gParticipantes = new Ext.grid.GridPanel({
		store:stParticipantes,
		autoExpandColumn:'expandir',
		title: '<center>Participantes</center>',
		columns: cmParticipantes,
		//region:'center',
		sm: smParticipantes, 				
    });
	
	
	//STORE PARA CARGAR LOS DATOS DEL RESPONSABLE
	stComboResponsable = new Ext.data.Store({
	    url:'pruebaclases.php',
		baseParams: {
			accion: 'loadResponsable',
			opcion: 1
		},
		autoLoad: true,
		reader: new Ext.data.JsonReader({
			/*totalProperty: "cant_filas",
			root: "filas",*/
			id: "idusuario"    
		},[{name: 'idusuario'}, 
		   {name: 'usuario'}
		])               
	});
	
	
	//STORE PARA CARGAR LOS DATOS DE CATEGORIA
	stComboCategoria = new Ext.data.Store({
	    url:'../aprobacion/pruebaclases.php',
		baseParams: {
			accion: 'loadcategoria',
			opcion: 1
		},
		autoLoad: true,
		reader: new Ext.data.JsonReader({
			/*totalProperty: "cant_filas",
			root: "filas",*/
			id: "cat_id"    
		},[{name: 'cat_id'}, 
		   {name: 'cat_name'}
		])               
	});
	
	
	//STORE PARA CARGAR LOS DATOS DE tipo actividad
	stCombotipAct = new Ext.data.Store({
	    url:'../aprobacion/pruebaclases.php',
		baseParams: {
			accion: 'loadtipoactividad',
			opcion: 1
		},
		autoLoad: true,
		reader: new Ext.data.JsonReader({
			id: "idtipoactividad"    
		},[{name: 'idtipoactividad'}, 
		   {name: 'dentipoactividad'}
		])               
	});
	
	 tabactprincipales = new Ext.Panel({
			      id:'tabactprincipales',
				  disabled:true,
				  title:'Actividades principales',
				  layout:'fit',
				  items:[
				         new Ext.form.TextArea({
						    id:'actprn'
					    })
				  ]
				  
			   });
			   
	fechafinal = new Ext.form.DateField({
									fieldLabel: 'Fecha de fin',
									 width:200,
									name:'fechafinal',
									id:'fechafinal',
									vtype: 'daterange',
					                startDateField: 'fechainicial',
									format:'d/m/Y'
								 });
	
	 fechainicial = new Ext.form.DateField({
									 fieldLabel: 'Fecha de inicio',
									 width:200,
									 name:'fechainicial',
									 id:'fechainicial',
									 vtype: 'daterange',
					                 endDateField: 'fechafinal',
									 format:'d/m/Y'
							     });	
	
      // Arbol de Reportes existentes
	  tpreportes = new Ext.tree.TreePanel({
	    title:'Reportes :',
		autoScroll:true,
		border:false,
		region:'west',
		split:false,
        listeners:{
		  click :function(n)
		  {
		   if(n.id!=0)
		   {
		    Ext.get('panelcentral').unmask();
		    refer = n.attributes.referencia;
            repd = n.attributes.rd;
			if(repd==0)
			{			 						 
			   tabactprincipales.enable();
			   fechainicial.disable();
			   fechafinal.disable();
			}
			if(repd==1)
			{			 						 
			   tabactprincipales.disable();
			   fechainicial.enable();
			   fechafinal.enable();
			}
		   }		   
		  }
		},
		loader: new Ext.tree.TreeLoader(),
		root: new Ext.tree.AsyncTreeNode({                      
			   expanded: true,
			   children: reportesSistema
			   }),
		rootVisible: false,
	  });
	  
	  
	  
	/*tpreportes = new Ext.tree.TreePanel({
		title:'Reportes :',
		autoScroll:true,
		border:false,
		region:'west',
		split:false,
        listeners:{
		  click :function(n)
		  {
		   if(n.id!=0)
		   {
		    Ext.get('panelcentral').unmask();
		    idplan = n.id;
		   }		   
		  }
		},		
		loader:new Ext.tree.TreeLoader({
		    singleClickExpand:true, 
			dataUrl:'../nomencladores/pruebaclases.php',
			baseParams:{accion:'loadtreereportes',opcion:1},
			listeners:{'beforeload':function(atreeloader, anode){ 
					//atreeloader.baseParams = {tipo:anode.attributes.tipo, idgrupo:anode.attributes.idgrupo, idelement:anode.attributes.idelemen};
				},'load':function(atreeloader, anode){					
				}
				
			}
		})
	});
	// Nodo padre del arbol Reportes existentes
	roottpreportes= new Ext.tree.AsyncTreeNode({
		text: 'Reportes',id:'0'//,iconCls:''
	});
	tpreportes.setRootNode(roottpreportes);*/
	
	
	
			   
			   
	 aprobado = new Ext.form.TextArea({
	    id:'aprobado',
		fieldLabel : 'Aprobado por',
		height: 80,
		width: 300
    });
	
	 confeccionado = new Ext.form.TextArea({
	    id:'confeccionado',
		fieldLabel : 'Creado por',
		height: 80,
		width: 300
    });

	
	tabpanel = new Ext.TabPanel({								
		width:680,
        id:'tabpanel',		
		activeTab:0,
		//layout:'form',
		height:365,
		frame:true,
		listeners:{
		  /*activate :function(p)
		  {
		   p.doLayout();
		  }*/
		},
		items:[
			   gParticipantes,										
			   {
			    xtype:'panel',
				listeners:{
		        activate :function(p)
				  {
				   p.doLayout();
				  }
				},
				//layout:'fit',
			    title:'Otros Datos',
				items:[
				       {
					    xtype:'fieldset',
						width:650,
						title: 'Rango de Fechas:',
						autoHeight:true,						
						items:[
						    {
							 layout:'column',
							 items:[
							   {
							   columnWidth:.50,
						       layout: 'form',
							   items:[
							    	fechainicial						 
							    ] 
							  },
							  {
							   columnWidth:.50,
						       layout: 'form',
							   items:[
							       fechafinal
							    ]
							   }
							  
							 ]
							}
						    
							
						]
					   },
					   {
					    xtype:'fieldset',
						width:650,
						title: 'Generales',
						autoHeight:true,
						items:[
						       {
					    layout:'column',
						items:[
						       {
							    columnWidth:.50,
							   layout: 'form',
							   items:[
							        new Ext.form.ComboBox({
									fieldLabel: 'Responsable:',
									id:'cbresp',
									store: stComboResponsable,
									displayField:'usuario',
									typeAhead: true,
									mode: 'local',
									forceSelection: true,
									triggerAction: 'all',
									emptyText:'Seleccione...',
									selectOnFocus:true,
									hiddenName: 'idusuario',
									valueField: 'idusuario',
									width:200,
									emptyText:'Seleccionar'
								  })								  
							   ]
							   },
							   {
							    columnWidth:.50,
							   layout: 'form',
							   items:[
							        new Ext.form.ComboBox({
								    id:'tipoact',
								    fieldLabel: 'Tipo Actividad',
									store: stCombotipAct,
									displayField:'dentipoactividad',
									typeAhead: true,
									mode: 'local',
									forceSelection: true,
									triggerAction: 'all',
									emptyText:'Seleccione...',
									width:200,
									selectOnFocus:true,
									hiddenName: 'idtipoactividad',
									valueField: 'idtipoactividad',
									emptyText:'Seleccionar'
								  })
							   ]
							   }
						]
					   }
						]
					   }
					   
					   
				 ]
			   },
			   tabactprincipales
		]		
	});
	
	
	formReportes = new Ext.form.FormPanel({
	    id:'formReportes', 
        frame: true,
		//height :true,
		border:'false',
		layout:'form',
		labelAlign:'top',
		buttons:[btnAceptar],
        items: [
		        {
				 layout:'column',
				 items:[
				        {
						 columnWidth:.50,
		                 layout: 'form',
		                 items: [aprobado]
						},
						{
						 columnWidth:.50,
		                 layout: 'form',
		                 items: [confeccionado]
						}
				 ]
				},
				tabpanel
		        
		
		]		
	  
	});
	
	









function On_RowClick(sm, indiceFila, record){
	    	
	};


function Aceptar()
{


 valueaprob = formReportes.findById('aprobado').getValue().split("\n");
 valueconfecc = formReportes.findById('confeccionado').getValue().split("\n");
 valuefi = formReportes.findById('fechainicial').getValue();
 valueff = formReportes.findById('fechafinal').getValue();
 valueresp = formReportes.findById('cbresp').getValue();
 valuetipact = formReportes.findById('tipoact').getValue();
 if(smParticipantes.hasSelection() )
 {
  
  arrayparticipantes = smParticipantes.getSelections();
  participante = arrayparticipantes[0].data.idusuario;

  }
 
 
 if( (!valueaprob)&&(!valueconfecc)&&(!valuefi)&&(!valueff)&&(!valueresp)&&(!valuetipact)&&(arrayparticipantes.length==0) )
 {
  Ext.Msg.show({
	   title:'Informacion',
	   msg: "Debe de proporcionar datos para el reporte. ",
	   buttons: Ext.Msg.OK,
	   icon: 'error' 
	 });
 }
 if( (valueaprob)||(valueconfecc)||(valuefi)||(valueff)||(valueresp)||(valuetipact)||(arrayparticipantes.length>0) )
 {
   if(!report)
   {
    report=new DinamicReport(server,port,false);
	report.setCategoryID(14);
   }

	 //addParameter:function(SqlFunctionName,ParameterName,Schema,Value,IsNull)
	 //Saumel fijate en el tercer parametro como le paso 14 por si el id de usuario no viene en el Globar puedas
	//ver el reporte de todas formas...cuando se capture bien el id de usuario le pasas solo la variable (userId)
	// report.addCondition("","=",userId,"","","public",'Plan de Actividades',"account_id",false);
	 report.addParameter("f_plan_actividad","cargo_aprueba","public",(valueaprob[0])?valueaprob[0]:null,(valueaprob[0])?false:true);
	 report.addParameter("f_plan_actividad","grado_aprueba","public",(valueaprob[1])?valueaprob[1]:null,(valueaprob[1])?false:true);
	 report.addParameter("f_plan_actividad","aprobado_por","public",(valueaprob[2])?valueaprob[2]:null,(valueaprob[2])?false:true);
	 
	 report.addParameter("f_plan_actividad","cargo_confecciona","public",(valueconfecc[0])?valueconfecc[0]:null,(valueconfecc[0])?false:true);
	 report.addParameter("f_plan_actividad","grado_confecciona","public",(valueconfecc[1])?valueconfecc[1]:null,(valueconfecc[1])?false:true);
	 report.addParameter("f_plan_actividad","confeccionado_por","public",(valueconfecc[2])?valueconfecc[2]:null,(valueconfecc[2])?false:true);
	 
	 report.addParameter("f_plan_actividad","fecha_inicio","public",(valuefi)?valuefi:null,(valuefi?false:true));
	 report.addParameter("f_plan_actividad","fecha_fin","public",(valueff)?valueff:null,(valueff?false:true));
	 report.addParameter("f_plan_actividad","participantes","public",( participante)?participante:null,(participante?false:true));
	 report.addParameter("f_plan_actividad","tipo_actividad","public",(valuetipact)?valuetipact:0,(valuetipact?false:true));
	 
	 if(repd!=0)
	 {

	  report.getReport(refer,refer);
	  report.clear();
	 }
	 if(repd==0)
	 {
	 listtareas = formReportes.findById('actprn').getValue(); 
     //alert(listtareas);	 
	 window.open("http://10.12.165.237/egroupware/reportes/reportpmensual.tpl.php?valueaprob="+valueaprob+"&listtareas="+listtareas+"&valueconfecc="+valueconfecc+"&valueresp="+valueresp+"&valuetipact="+valuetipact+"&participante="+participante);
	 
	 /*  Ext.Ajax.request({
		url: 'reportpmensual.tpl.php',
		method:'POST',
		params:{opcion:1},
		callback: function (options,success,response){
							
		}
      });*/
	  
	  //crearWinReport();*
	 }
   
 }
}

function crearWinReport()
{

 winreport = new Ext.Window({
    id:'winreport',
	title:'Visor de Reportes',
	tbar:[btnActualizar,btnImprimir],
	width:990,
	html:"<iframe id='pm' width='100%' height='100%'  src='reportpmensual.tpl.php'></iframe>",
	draggable:false,
	maximized:true,
	modal:true
 });
 winreport.show();
}
	
	
	

	

var panelcentral= new Ext.Panel({
                    id:'panelcentral',
					
					title:'Datos del Reporte',
                    layout:'fit',
                    margins:'3 0 5 5',
                    cmargins:'35 5 5 5',
                    region:'center',
					items:formReportes,
					listeners:{
					render:function(p){
					   Ext.get('panelcentral').mask();
 					 }
					}
});	

	
	
	
var panelwest=new Ext.Panel({
                    layout:'fit',
                    width: 250,
                    margins:'3 0 5 5',
                    cmargins:'35 5 5 5',
                    region:'west',
                    items:[
                           tpreportes
                          ]
            
            });
			

/*
  panel ke contiene las dos partes de la plantilla.................
*/
var panelview= new Ext.Panel({
                    title:'<center>Imprimir Reportes</center>',	
                    layout:'border',
                    tbar:[btnhome],					
                    items:[
                           panelwest,panelcentral
                          ]
            
            });
	
	
var viewport = new Ext.Viewport({	
                id:'viewnom',			
                layout:'fit',
				items:[panelview],				
				});

}




function CargarInterfaz(){
	Ext.onReady(function(){	var nomen = new  cargarInterfaz();})
};

CargarInterfaz();