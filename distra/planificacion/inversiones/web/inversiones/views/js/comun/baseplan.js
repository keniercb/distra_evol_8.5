//perfil.etiquetas = Object();
var mymask,pPresupuesto,gpPresupuesto;

var perfil = window.parent.UCID.portal.perfil;
perfil.etiquetas = Object();

var termine_cargar=false;

//objeto del componente complemetario, en este caso para el cierre
var Cmpcomplementario = new Utilidades.Cmp.CmpBotonesComplementarios({
	elemento:'plan'
});
var cbaccionesDWH = Cmpcomplementario.cbacciones;
crearBasePlan = function (){

		var toolbarPanelReporte =new Ext.Toolbar();
		mymask = new Ext.LoadMask(Ext.getBody(), {
			msg:perfil.etiquetas.lbCargando
		});
		
		btnLimpiarFiltrosP = new Ext.Button({
			id:'btnLimpiarFiltrosP',
			icon:perfil.dirImg+'limpiar.png',
			iconCls : 'btn',
			text:perfil.etiquetas.lbLimpiarFiltros,
			tooltip:perfil.etiquetas.lbLimpiar,
			handler : function() {
				filtrospresupuesto.clearFilters();
				storeAsociadoaPresupuesto.reload();
			}
		});

		btnExportar = new Ext.Button({
			disabled:false,
			id:'btnExportarAPre',
			hidden:false,
			icon:perfil.dirImg+'exportar.png',
			iconCls:'btn',
			tooltip:'Exportar indicadores del plan.(ALt+E)',
			text:'Exportar', 
			handler:function(){
				var selectedEntity = tpBaseEstructura.selModel.getSelectedNode().text;
				var selectedPlan = tpBasePlan.selModel.getSelectedNode().text;
                                var idejerc = cbEjercicio.getValue();
				var mihoja=(eshoja==1)?true:false ;
				var win = window.open('exportarpresupuesto?entidad=' + selectedEntity + '&plan=' + selectedPlan + '&identidad=' + identidadselected + '&idejercicio=' + idejerc +'&idmodelo=' + treesel + '&hoja=' + mihoja + '&start=' + 0 + '&limit=' + 10000 + '&identidadmodelo=' +  tpBasePlan.getSelectionModel().getSelectedNode().attributes.DatEntidadmodelo[0].identidadmodelo + '& filtros=' + Ext.encode(filtrospresupuesto.getFilterData()));
			}
		});
		
		smGpAsociadoaPresupuesto =  new Ext.grid.RowSelectionModel({
			singleSelect: false,
			listeners:{
				rowselect :function (){
				  
				
				}
				
			}
		});
		   
			
		//creando el repositorio de datos
		storeAsociadoaPresupuesto = new Ext.data.Store({
			url:'listarNAEOGRF',
			method:'POST',
			listeners:{
				beforeload:function(st,opt){
					cambiarTituloFiltrarAsociadoaPresupuesto();
					this.baseParams.idejercicio=cbEjercicio.getValue();
					this.baseParams.idmodelo = treesel;
					this.baseParams.identidadmodelo= tpBasePlan.getSelectionModel().getSelectedNode().attributes.DatEntidadmodelo[0].identidadmodelo;
					this.baseParams.identidad= identidadselected;
					this.baseParams.hoja= (eshoja==1)?true:false;

				},
				load:function(st,record,ob){
					siexisteIndAsociadoFiltrado();

				}

			},

			reader:new Ext.data.JsonReader({
				id: 'idasociadoapresupuesto',
				root: 'data',
				totalProperty: 'total'

			},[ {
				name:'idindicador'
			},{
				name:'idplanificacion'
			},{
				name:'denominacion'
			},{
				name:'codigo'
			},{
				name:'idcentrobalance'
			},{
				name:'denocentrobalance'
			},{
				name:'precio'
			},{
				name:'idumedida'
			},{
				name:'nom_datosnomenclador_denominacion'
			},{
				name:'denoum'
			},{
				name:'numeropieza'
			},{
				name:'idplanificacionnae'
			},{
				name:'idobjetogasto'
			}, {
				name:'idingreso'
			},{
				name:'datos'
			},{
				name:'cantidad'
			},{
				name:'importe'
			}
			])  

		});
	  //paginado
		pgAsociadoaPresupuesto=new Ext.PagingToolbar({
				id:'paginado1',
				pageSize: 20,
				store:storeAsociadoaPresupuesto,
				displayInfo: true
			});
		//Creando el objeto Ext.grid.ColumnModel
		cmAsociadoaPresupuesto = new Ext.grid.ColumnModel([       
		{
			header:perfil.etiquetas.lbCodigo,
			width:60,
			sortable:true,
			dataIndex: 'codigo',
			tooltip:perfil.etiquetas.lbCodigo,
			renderer:crearToolTip
		},{
			header:perfil.etiquetas.lbNumPieza,
			width:60,
			sortable:true,
			dataIndex: 'numeropieza',
			tooltip:perfil.etiquetas.lbNumPieza,
			renderer:crearToolTip
		},{
			header:perfil.etiquetas.lbDenominacion,
			id:'expandir',
			width:100,
			sortable:true,
			dataIndex: 'denominacion',
			tooltip:perfil.etiquetas.lbDenominacion,
			renderer:crearToolTip
		},{
			header:perfil.etiquetas.lbUM,
			width:50,
			sortable:true,
			dataIndex: 'denoum',
			tooltip:perfil.etiquetas.lbUM,
			renderer:crearToolTip
		},{
			header:"Destino",
			width:100,
			sortable:true,
			dataIndex: 'nom_datosnomenclador_denominacion',
			tooltip:"Destino",
			renderer:crearToolTip
		},{
			header:perfil.etiquetas.lbCentroBalance,
			width:100,
			sortable:true,
			dataIndex: 'denocentrobalance',
			tooltip:perfil.etiquetas.lbCentroBalance,
			renderer:crearToolTip
			
		},{
			header:perfil.etiquetas.lbPrecio,
			width:60,
			sortable:true,
			dataIndex: 'precio', 
			renderer: Precio,
			tooltip:perfil.etiquetas.lbPrecio,
			renderer:crearToolTip

		},{
			header:perfil.etiquetas.lbCantidad,
			width:60,
			sortable:true,
			dataIndex: 'cantidad',
			tooltip:perfil.etiquetas.lbCant,
			renderer:crearToolTip
		},{
			header:perfil.etiquetas.lbImporte,
			width:60,
			sortable:true,
			renderer:crearToolTip,
			dataIndex: 'importe',
			tooltip:perfil.etiquetas.lbImport

		},{
			header:perfil.etiquetas.lbAsociado,
			width:60,
			sortable:true,
			hidden:false,
			dataIndex:'idplanificacionnae',
			tooltip:perfil.etiquetas.lbAsociado,
			renderer:ColumnaAsociado
		},{
			header:perfil.etiquetas.lbNaeog,
			width:60,
			sortable:true,
			hidden:false,
			dataIndex:'idobjetogasto',
			tooltip:perfil.etiquetas.lbNaeog,
			renderer:ColumnaAsociadonaeog
		},{
			header:perfil.etiquetas.lbNaerf,
			width:60,
			sortable:true,
			hidden:false,
			dataIndex:'idingreso',
			tooltip:perfil.etiquetas.lbNaerf,
			renderer:ColumnaAsociadonaerf
		},{
			header:perfil.etiquetas.lbDatos,
			width:60,
			sortable:true,
			dataIndex: 'datos',
			tooltip:perfil.etiquetas.lbDatos,
			renderer:crearToolTip
		}
			  
		]);

		Ext.menu.RangeMenu.prototype.icons = {
			gt: perfil.dirImg+'greater_then.png',
			lt: perfil.dirImg+'less_then.png',
			eq:perfil.dirImg+'equals.png'
		};

		Ext.grid.filter.StringFilter.prototype.icon = perfil.dirImg + 'find.png';
		Ext.grid.filter.String_adaptadoFilter.prototype.icon = perfil.dirImg + 'find.png';

		filtrospresupuesto = new Ext.grid.GridFilters({
			filters:[
			{
				type: 'string',
				dataIndex: 'codigo'
			},{
				type: 'string',
				dataIndex: 'numeropieza'
			}, {
				type: 'string',
				dataIndex: 'denominacion'
			},{
				type: 'listado',
				dataIndex: 'denoum',
				idcombo:'idumedidaindicadores',
				urlcb:urlCbUM,
				idstore:'idstumedidaindicadores',
				valueFieldcb:'idunidadmedida',
				displayFieldcb:'nombreum',
                                autoload:false,
                                mode:'remote'
			},
			{ 
				type: 'listado',
				dataIndex: 'denocentrobalance',
				idcombo:'idcbcentrobalancenorma',
				urlcb:urlCbCentBalance,
				idstore:'idstcentrobalancenorma',
				valueFieldcb:'idcentrobalance',
				displayFieldcb:'centrobalance',
                                autoload:false,
                                mode:'remote'
			},{
				type: 'numeric',
				dataIndex: 'precio'
			},{
				type: 'numeric',
				dataIndex: 'cantidad'
			},{
				type: 'numeric',
				dataIndex: 'importe'
			},{
				type: 'list',
				dataIndex: 'idplanificacionnae',
				options: [perfil.etiquetas.lbSi,perfil.etiquetas.lbNo ]
			},{
				type: 'list',
				dataIndex: 'idobjetogasto',
			   options: [perfil.etiquetas.lbSi,perfil.etiquetas.lbNo ] 
			},{
				type: 'list',
				dataIndex: 'idingreso',
				options: [perfil.etiquetas.lbSi,perfil.etiquetas.lbNo ] 
			},{
				type: 'string',
				dataIndex: 'datos'            
			}]
		});
		
		gpAsociadoaPresupuesto = new Ext.grid.GridPanel({
			region:'center',
			store: storeAsociadoaPresupuesto,
			cm: cmAsociadoaPresupuesto,
			sm:smGpAsociadoaPresupuesto,
			plugins : filtrospresupuesto,
			height:200,
			width:410,
			 loadMask:{
				msg:perfil.etiquetas.lbCargando
			},
			tbar:['->',btnExportar,'-',btnLimpiarFiltrosP],
		   
			bbar:pgAsociadoaPresupuesto,
			
			md:new Ext.menu.Menu({
				id: 'mdGridAsociar',
				items: [{        
					text: "Asociar a Objeto de Gasto",
					icon:perfil.dirImg  + 'asociar.png',
					iconCls:'btn',
					id:'asociarOGasto',
				   
					handler : function(){
						presupuesto();
					}
				},{
					text: "Asociar a Recurso financiero",
					icon:perfil.dirImg  + 'asociar.png',
					iconCls:'btn',
					id:'asociarRFinanciero',
					handler : function(){
						recursofinaciero();
					}
				},{
					text: "Eliminar asociaciones",
					icon:perfil.dirImg  + 'eliminar.png',
					iconCls:'btn',
					id:'eliminarAsoccionesButton',
					hidden:true,
					handler : function(){
						eliminarTodasAsociaciones(smGpAsociadoaPresupuesto.getSelections());
					}
				}]
			}),
			
			listeners:{                       
				rowcontextmenu : function(g,r,e){
					
						e.stopEvent();
						gpAsociadoaPresupuesto.getSelectionModel().selectRow(r);
						if(gpAsociadoaPresupuesto.getSelectionModel().getSelections().length == 1){
							record_selected = g.getStore().getAt(r);
						   
							g.getEl().mask('Cargando...','ext-el-mask-msg x-mask-loading');
							Ext.Ajax.request({
								url:baseUrl + 'validarasociacion',
								params:{
									idplanificacion:record_selected.data.idplanificacion
								},
								callback:function(options, success, response){
									obj = Ext.decode(response.responseText);
									if(obj[0].DatPlanificacionnae.length > 0){
										var datplanifnae = obj[0].DatPlanificacionnae;
										if(datplanifnae[0].DatPlanificacionnaegeneral.DatPlanificacionnaeingreso){
											gpAsociadoaPresupuesto.md.items.itemAt(0).disable();
											gpAsociadoaPresupuesto.md.items.itemAt(1).enable();
                                                                                        gpAsociadoaPresupuesto.md.items.itemAt(2).show();
										}else if(datplanifnae[0].DatPlanificacionnaegeneral.DatPlanificacionnaeobjetogasto){
											gpAsociadoaPresupuesto.md.items.itemAt(1).disable();
											gpAsociadoaPresupuesto.md.items.itemAt(0).enable();
                                                                                        gpAsociadoaPresupuesto.md.items.itemAt(2).show();
										}
									} else {
									   gpAsociadoaPresupuesto.md.items.itemAt(0).enable();
										gpAsociadoaPresupuesto.md.items.itemAt(1).enable();
									}
									
									g.getEl().unmask();
									gpAsociadoaPresupuesto.md.showAt(e.getXY());
								}
							   
							});
					   
						} else {
							obj = false;
							gpAsociadoaPresupuesto.md.items.itemAt(2).show();
							gpAsociadoaPresupuesto.md.items.itemAt(0).enable();
							gpAsociadoaPresupuesto.md.items.itemAt(1).enable();
							gpAsociadoaPresupuesto.md.showAt(e.getXY());
						}
					
				}
			}
		});
	  
	  
	 
		pAsociadoaPresupuesto=new Ext.Panel({
			id:'pAsociadoaPresupuesto',
			margins:'0 0 0 5',
			layout:'fit',
			title:"Asociación a presupuesto",
			border:false,
			layoutConfig:{
				animate:true
			},
			items:[gpAsociadoaPresupuesto]
		});

		/***	Panel para detalles del plan	***/
		pComentario = new Ext.Panel({
			id:'pComentario',
			margins:'0 0 0 5',
			layout:'fit',
			border:false,
			layoutConfig:{
				animate:true
			},
			items:[gpComent]
		});


	   
		btnLimpiar = new Ext.Toolbar.Button({	
			iconCls: 'btn',
			icon:perfil.dirImg+'limpiar.png',
			text:perfil.etiquetas.lbBtnLimpiar,
			tooltip:perfil.etiquetas.lbTtBtnLimpiar,
			id:'btnlimpcmb',
			disabled: false,
			handler:function(){
            tpBasePlan.getRootNode().load();
			}
			 
		});
		
	   
		/***	Panel con layout card	***/
		pcm = new Ext.Panel({
			id:'pcm',
			region:'center',
			layout:'card',
			border:false,
			activeItem:0,
			items:[pComentario,pModelo,pAsociadoaPresupuesto]
		});

		/***	Panel con layout card	***/
		pt = new Ext.Panel({
			title:perfil.etiquetas.titPlanes,
			id:'pt',
			region:'west',
			collapsible:true,
			split:true,
			width:200,
			layout:'fit',
			collapsed:true,
			items:tpBasePlan
		});

		ptestructuras = new Ext.Panel({
			title:'Entidades',
			id:'ptestructuras',
			region:'west',
			collapsible:true,
			split:true,
			width:200,
			layout:'fit',
			items:tpBaseEstructura
		});

		pgeneral = new Ext.Panel({
			title:'Estructuras',
			region:'center',
			layout:'border',
			items:[pt,pcm]
		});
		
		pplanes = new Ext.Panel({
			layout:'border',
			tbar:['-',btnVerDemanda,btnImportar,'-',cbaccionesDWH,'-','Ejercicio: ',cbEjercicio,'->',btnAyuda],
			items:[ptestructuras,pgeneral]
	    });
		
		if(objci.acciones.rector)
		{
			var objRecComplejas = new Ext.components.CmpReccomplejas.Interfaz({
				idconfiguracion: 'config_rc_sisplan_plan',
				tituloReporte: 'Reporte de planes',
				tituloConfiguracion: 'Configuración del reporte',
				tituloGrid: 'Listado de planes',
				mainToolBar: toolbarPanelReporte,	//ToolBar aportado por la funcionalidad que utilice el componente
				noUsarGestAvisos: false	//False si voy a usar el componente de Gestionar avisos
			});
			
			pplanes.setTitle('Gestionar plan');
			pbusquedas = new Ext.Panel({
				title:'Recuperaciones complejas ',
				layout:'fit',
				items:[objRecComplejas]
			});
			
			tbplan = new Ext.TabPanel({
				activeTab:0,
				items:[pplanes,pbusquedas]	
			});
		   
			// viewport de la plantilla
			vpCasoUso = new Ext.Viewport({
				layout:'fit',
				items:[tbplan]
			});
			objRecComplejas.setActiveTab(0);
			tbplan.setActiveTab(0);
		}
		else
		{
			vpCasoUso = new Ext.Viewport({
				layout:'fit',
				items:[pplanes]
			});
		}

}// Endof cargarInterfaz

// function para eliminar un modelo de un plan
function eliminarPlan(){
    mostrarMensaje(2,"¿Está seguro que quiere eliminar la agrupación seleccionada?",elimina);
    function elimina(btnPresionado){
        if (btnPresionado == 'ok'){
           var barra= Ext.MessageBox.show({
                title: perfil.etiquetas.lbEspere,
                msg: perfil.etiquetas.msgEliminandoAgrupac,
                width:250,
                wait:true,
                progress:true,
                closable:false
                    
            }); 
			
            Ext.Ajax.request({
                url: 'eliminar',
                params:{
                    idplan:tpBasePlan.getSelectionModel().getSelectedNode().attributes.idplan,
                    identidad:identidadselected
                },
                callback: function (options,success,response){
                    Ext.getBody().unmask();
					 
                    responseData = Ext.decode(response.responseText);
					
                    if(responseData.codMsgE == 1)
                                       
                    {
                        mostrarMensaje(responseData.codMsg,perfil.etiquetas.msgEliminarAgrupacion);
                         tpBasePlan.getSelectionModel().getSelectedNode().parentNode.reload(); 
                                                
						
                    }
                    else {
                        mostrarMensaje(3,perfil.etiquetas.msgErrorAction);
                    }
				
                            
                } 
                                
            });
            barra.hide();
        }
    }
}
function ColumnaAsociado(val) { 
    if (val!=null)
        return '<span><img src='+perfil.dirImg + 'tick.png'+ '>'; 
    else
        return '<span><img src='+perfil.dirImg + 'cross.png'+ '>';
        
}

function ColumnaAsociadonaeog(val) {
    if (!val)
        return 'No';   
    else
        return 'Si';
}

function ColumnaAsociadonaerf(val) {
    if (!val)
        return 'No';   
    else
        return 'Si';
}

function cambiarTituloFiltrarAsociadoaPresupuesto(){
    var  filtrado_por="";
    var sep="/";
    if(filtrospresupuesto.getFiltrosActivos()==undefined || filtrospresupuesto.getFiltrosActivos().length==0){
        pAsociadoaPresupuesto.setTitle(perfil.etiquetas.titAsocPresupuesto);
    }else{
        for (i = 0; i < filtrospresupuesto.getFiltrosActivos().length; i++) {
            var aux="";
            if(filtrospresupuesto.getFiltrosActivos()[i].dataIndex =="denominacion"){
                aux=perfil.etiquetas.lbDenominacion;
            }else if(filtrospresupuesto.getFiltrosActivos()[i].dataIndex =="codigo"){
                aux=perfil.etiquetas.lbCodigo;
            } else if(filtrospresupuesto.getFiltrosActivos()[i].dataIndex =="precio"){
                aux=perfil.etiquetas.lbPrecio;
            } else if(filtrospresupuesto.getFiltrosActivos()[i].dataIndex =="umedida"){
                aux=perfil.etiquetas.lbUnidadMedida;
            } else if(filtrospresupuesto.getFiltrosActivos()[i].dataIndex =="numeropieza")
                aux=perfil.etiquetas.lbNumPieza;
            else if(filtrospresupuesto.getFiltrosActivos()[i].dataIndex =="cantidad"){
                aux=perfil.etiquetas.lbNecesidad;
            }else if(filtrospresupuesto.getFiltrosActivos()[i].dataIndex =="centrobalance"){
                aux=perfil.etiquetas.lbCentroBalance;
            }else if(filtrospresupuesto.getFiltrosActivos()[i].dataIndex =="importe"){
                aux=perfil.etiquetas.lbImporte;
            }else if(filtrospresupuesto.getFiltrosActivos()[i].dataIndex =="idplanificacionnae"){
                aux=perfil.etiquetas.lbAsociado;
            }else if(filtrospresupuesto.getFiltrosActivos()[i].dataIndex =="idobjetogasto"){
                aux=perfil.etiquetas.lbNaeog;
            }else if(filtrospresupuesto.getFiltrosActivos()[i].dataIndex =="idingreso"){
                aux=perfil.etiquetas.lbNaerf;
            }else if(filtrospresupuesto.getFiltrosActivos()[i].dataIndex =="datos"){
                aux=perfil.etiquetas.lbDatos;
            }
            if(i==filtrospresupuesto.getFiltrosActivos().length-1){
                sep="";
            }
            filtrado_por+=aux+sep;
        }
        pAsociadoaPresupuesto.setTitle(perfil.etiquetas.titAsocPresupuesto+perfil.etiquetas.lbFiltradoPor + filtrado_por);
        filtrado_por="";
    }
}
       
            
function siexisteIndAsociadoFiltrado (){
    if ((filtrospresupuesto.getFiltrosActivos().length > 0) && (storeAsociadoaPresupuesto.getCount()==0))
        mostrarMensaje(1,perfil.etiquetas.msgBuscar);
}


map = new Ext.KeyMap(Ext.getDoc(),[
    {
            key: 'Ll',
            alt : true,
            fn: function(){
                if(!btnLimpiarFiltrosP.hidden){
                    if(!btnLimpiarFiltrosP.disabled){
                        filtrospresupuesto.clearFilters();
                        storeAsociadoaPresupuesto.reload();
                       }
                    }
                  }
     },
     {
            key: 'Hh',
            alt: true,
            fn: function() {
           // mostrarAyuda('Plan');
           }
      }

        ]);
function crearToolTip(v, m){
    m.attr = 'ext:qtip="'+ v + '"';
    return v;
}


function reconfigurarPresupuesto(cf) {

    rec = [];
    rec.push({
        name: 'idindicador'
    });
	rec.push({
        name: 'mod_planificacionmeta_nom_05_n5'
    });
	rec.push({
        name: 'mod_planificacionmeta_nom_05_n4'
    });
    rec.push({
        name: 'idplanificacion'
    });
    rec.push({
        name: 'denominacion'
    });
    rec.push({
        name: 'codigo'
    });
    rec.push({
        name: 'idcentrobalance'
    });
    rec.push({
        name: 'denocentrobalance'
    });
    rec.push({
        name: 'precio'
    });
    rec.push({
        name: 'idumedida'
    });
    rec.push({
        name: 'nom_datosnomenclador_denominacion'
    });
    rec.push({
        name: 'denoum'
    });
    rec.push({
        name: 'numeropieza'
    });
    rec.push({
        name: 'idplanificacionnae'
    });
    rec.push({
        name: 'idobjetogasto'
    });
    rec.push({
        name: 'idingreso'
    });
    rec.push({
        name: 'datos'
    });
    rec.push({
        name: 'cantidad'
    });
    rec.push({
        name: 'importe'
    });
   
    cmGp = [];
    cmGp.push({
        header: perfil.etiquetas.lbCodigo,
        width: 100,
        sortable: true,
        dataIndex: 'codigo',
        tooltip: perfil.etiquetas.lbCodigo,
        renderer: crearToolTip
    });
    cmGp.push({
        header: perfil.etiquetas.lbNumPieza,
        width: 70,
        sortable: true,
        dataIndex: 'numeropieza',
        tooltip: perfil.etiquetas.lbNumPieza,
        renderer: crearToolTip
    });
    cmGp.push({
        header: perfil.etiquetas.lbDenominacion,
        id: 'expandir',
        width: 100,
        sortable: true,
        dataIndex: 'denominacion',
        tooltip: perfil.etiquetas.lbDenominacion,
        renderer: crearToolTip
    });
    cmGp.push({
        header: perfil.etiquetas.lbUM,
        width: 40,
        sortable: true,
        dataIndex: 'denoum',
        tooltip: perfil.etiquetas.lbUM,
        renderer: crearToolTip
    });
    cmGp.push({
        header: perfil.etiquetas.lbPrecio,
        width: 75,
        sortable: true,
        dataIndex: 'precio',
        tooltip: perfil.etiquetas.lbPrecio,
        renderer: Precio
    });
    
    cmGp.push({
        header:perfil.etiquetas.lbCantidad,
			width:60,
			sortable:true,
			dataIndex: 'cantidad',
			tooltip:perfil.etiquetas.lbCant,
			renderer:crearToolTip
    });
    cmGp.push({
        header: perfil.etiquetas.lbCentroBalance,
        width: 100,
        sortable: true,
        dataIndex: 'denocentrobalance',
        tooltip: perfil.etiquetas.lbCentroBalance,
        hidden: true,
        renderer: crearToolTip
    });
    cmGp.push({
       header:perfil.etiquetas.lbImporte,
			width:60,
			sortable:true,
			renderer:crearToolTip,
			dataIndex: 'importe',
			tooltip:perfil.etiquetas.lbImport
    });
    cmGp.push({
       header:perfil.etiquetas.lbAsociado,
			width:60,
			sortable:true,
			hidden:false,
			dataIndex:'idplanificacionnae',
			tooltip:perfil.etiquetas.lbAsociado,
			renderer:ColumnaAsociado
    });

    if (cf) {
        for (var index = 0; index < cf.cm.length; index++)
        {
            if (cf.cm[index].edit) {
                switch (cf.cm[index].edit.xtype) {
                   case 'combo':
                    {
                        var item = cf.cm[index].edit;
                        var items = cf.cm;
                        var almacen = new Ext.data.SimpleStore({
                            fields: ['iddatosnomenclador', 'nom_datosnomenclador_denominacion']
                        });
                        var valores = [];
                        for (pos in cf.cm[index].edit.store)
                        {
                            valores.push(new Ext.data.Record(cf.cm[index].edit.store[pos]));
                        }
                        valores.pop();
                        almacen.add(valores);

                        cf.cm[index] = {
                            id: items[index].id,
                            header: items[index].header,
                            dataIndex: items[index].dataIndex,
                            sortable: true,
                            tooltip:'Sector Rama',
                            renderer: function(value, cell, rec, row, col) {
                                return getRawValue(value, gpAsociadoaPresupuesto.getColumnModel().getCellEditor(col, row).field);
                          
                            },
                           editor: new Ext.form.ComboBox({
                                id: item.id,
                                hiddenName: item.hiddenName,
                                name: item.hiddenName,
                                mode: 'local',
                                triggerAction: 'all',
                                allowBlank: item.allowBlank,
                                emptyText: item.emptyText,
                                typeAhead: item.typeAhead,
                                valueField: item.valueField,
                                displayField: item.displayField,
                                renderer: crearToolTip,
                                store: almacen,
                                listeners: {
                                    select: function(a, b, c) {
                                    }
                                }                               
                            })
                        };
                    }
                    break;
                   }
                cmGp.push(cf.cm[index]);
            }
        }

        for (var index = 0; index < cf.rd.length; index++)
            rec.push(cf.rd[index]);
    }

    cmGp.push({
        header:perfil.etiquetas.lbNaeog,
			width:60,
			sortable:true,
			hidden:false,
			dataIndex:'idobjetogasto',
			tooltip:perfil.etiquetas.lbNaeog,
			renderer:ColumnaAsociadonaeog
    });

    cmGp.push({
			header:perfil.etiquetas.lbNaerf,
			width:60,
			sortable:true,
			hidden:false,
			dataIndex:'idingreso',
			tooltip:perfil.etiquetas.lbNaerf,
			renderer:ColumnaAsociadonaerf
    });

    cmGp.push({
			header:perfil.etiquetas.lbDatos,
			width:60,
			sortable:true,
			dataIndex: 'datos',
			tooltip:perfil.etiquetas.lbDatos,
			renderer:crearToolTip
    });
    
    jrstoreAsociadoaPresupuesto = new Ext.data.JsonReader({
        totalProperty: 'total',
        root: 'data',
        id: 'idasociadoapresupuesto',
        fields: rec
    });

    storeAsociadoaPresupuesto = new Ext.data.Store({
        url: 'listarNAEOGRF',
		method:'POST',
        listeners: {
            beforeLoad: function() {
                storeAsociadoaPresupuesto.removeAll();
			    cambiarTituloFiltrarAsociadoaPresupuesto();
				this.baseParams.idejercicio=cbEjercicio.getValue();
				this.baseParams.idmodelo = treesel;
				this.baseParams.identidadmodelo= tpBasePlan.getSelectionModel().getSelectedNode().attributes.DatEntidadmodelo[0].identidadmodelo;
				this.baseParams.identidad= identidadselected;
				this.baseParams.hoja= (eshoja==1)?true:false;
				this.baseParams.filtros = Ext.encode(filtrospresupuesto.getFilterData());
            },
            load: function() {
                siexisteIndAsociadoFiltrado();
            }
        },
        reader: jrstoreAsociadoaPresupuesto
    });

    gpAsociadoaPresupuesto.reconfigure(storeAsociadoaPresupuesto, new Ext.grid.ColumnModel(cmGp));


    pgAsociadoaPresupuesto.bind(storeAsociadoaPresupuesto);
    gpAsociadoaPresupuesto.getStore().load({
        params: {
            start: 0,
            limit: 20
        }
    });
}
