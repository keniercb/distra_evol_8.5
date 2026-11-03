Ext.ns('Seguridad.AccionReporte')
Seguridad.AccionReporte.Vista = {
	init : function (idioma, modelo) {
		var _this = this;
		var auxiliar,formulario,accion,boton,fila,stgpParametros,idreporte,arrayreportesini = [],bandera = 0,bandera1 = 0,idfuncionalidad;
		this.btnAceptar=  new Ext.Button({ 
			iconCls:'btn',
			icon : perfil.dirImg+'aceptar.png',
			text:'Guardar cambios',
			handler:function(){_this.adicionarrepacciones('btn');}
		});
		
		this.arbolSistemas = new Ext.tree.TreePanel({
			title:'Sistemas registrados',
			collapsible:true,
			autoScroll:true,
			region:'west',
			width: 300,
			loader: new Ext.tree.TreeLoader({
				dataUrl:'cargarsistfunc',
				listeners:{'beforeload':function(atreeloader, anode){ 
								atreeloader.baseParams = {};
								if(anode.attributes.idsistema)			
									atreeloader.baseParams.idsistema = anode.attributes.idsistema												
							},
							'load':function(anode){
								Ext.MessageBox.hide();									
							}
						}
					
			})
		});
		
		padreArbolAcc = new Ext.tree.AsyncTreeNode({
		  text:'Sistemas',
		  expandable:false,
		  frame:false,
		  id:'0'
		});
		
		this.arbolSistemas.setRootNode(padreArbolAcc);
		
		
		this.stGpAcciones =  new Ext.data.Store({
			url: 'cargargridacciones',
	        listeners:{
				'beforeload':function(thisstore,objeto){
					objeto.params.idfuncionalidad = idfuncionalidad
				}
	        },reader:new Ext.data.JsonReader(
				{
					totalProperty: "cantidad_filas",
					root: "datos",
					id: "id"
			},[
				{name:'idaccion' ,mapping:'idrecurso'},
				{name:'denominacion',mapping:'denominacion'},
				{name:'abreviatura',mapping:'abreviatura'}
			])
		});	
		
		this.smAcciones = new Ext.grid.RowSelectionModel({singleSelect:true});
		
		this.gpAcciones = new Ext.grid.GridPanel({
			title:'Recursos',
			expansible : true,
			region:'center',
			iconCls : 'icon-grid',
			autoExpandColumn:'exp',
			store : this.stGpAcciones,
			sm: this.smAcciones,
			cm: new Ext.grid.ColumnModel([
				new Ext.grid.RowNumberer({
					header : 'No.', 
					width : 50
				}),
				{hidden: true, hideable: false,  dataIndex: 'idaccion'},
				{ header: 'Denominaci&oacute;n',width:150, dataIndex: 'denominacion'},
				{ id:'exp',header: 'Abreviatura',width:150, dataIndex: 'abreviatura'}
			]),		    
		   loadMask:{store:this.stGpAcciones},
		   tbar:[
					new Ext.Toolbar.TextItem('Buscar'),
					new Ext.form.TextField({width:150, id: 'accion'}),
					new Ext.menu.Separator(),			
					new Ext.Button({icon:perfil.dirImg+'buscar.png',iconCls:'btn',text:'Buscar', handler:function(){buscarAcciones(Ext.getCmp('accion').getValue());}})
			],				
			bbar:new Ext.PagingToolbar({
					pageSize: 15,
					store: this.stGpAcciones,
					displayMsg: 'Resultados {0} - {1} de {2}',
					emptyMsg: "Ning&uacute;n resultado para mostrar"							
			})
		});
		
		this.stgpReportes =  new Ext.data.Store({
			proxy: new Ext.data.HttpProxy({
				url: 'cargarreportes'
			}),			
	        reader:new Ext.data.JsonReader(
					{
						totalProperty: "count",
						root: "data",
						id: "id"
					},
					[
						{name:'id' ,mapping:'idreporte'},
					 	{name:'title',mapping:'title'}
					]),
		
		listeners:{'load':function(thisstore,store,objeto){	
			_this.cargarrepoasociados(store);
		  }}
      
		});
		this.cbSm = new Ext.grid.CheckboxSelectionModel({singleSelect:false});

	    this.gpReportes = new Ext.grid.GridPanel({
			title:'Reportes',
			width: 350,
			disabled:true,
			region:'east',
			store: this.stgpReportes,
			autoExpandColumn:'exp',
			sm : this.cbSm,
			columns: [
				this.cbSm,
				{hidden: true, hideable: false,  dataIndex: 'id'},
				{id:'exp',header:'Denominaci&oacute;n',width:150, dataIndex: 'title'}
			],
			loadMask:{store: this.stgpReportes},

			bbar:new Ext.PagingToolbar({
				pageSize: 15,
				store: this.stgpReportes,
				pageSize: 15,
				displayMsg: 'Resultados {0} - {1} de {2}',
				emptyMsg: "Ning&uacute;n resultado para mostrar"							
			})		 
			
		});
        this.btnAyuda = new Ext.Button({
            id: 'ayudaDesbloqueoUser',
            iconCls: 'ayuda',
            text: '<b>Ayuda</b>',
            prevTab: 'btnDesbloqueoUser',
            nextTab: 'btnClearField',
            icon: perfil.dirImg + 'ayuda.png',
            hotKey: {
                idGrupo: 'grid1',
                config: {
                    key: 104,
                    alt: true
                }
            },
            menu:
                new Ext.menu.Menu({
                    id: 'mainMenu',
                    items: [
                        {
                            handler: function() {
                                var title	= 'Ayuda de acciones reportes';
                                var referencia	= 'herramientasseguridadconfigurarsistemagestionarrecursosistemas';
                                help.show(title,referencia);
                            }, text: 'Ayuda',
                            id: 'btnAyuDesktop',
                            icon: perfil.dirImg + 'ayuda.png',
                            iconCls: 'btn',
                            tooltip:'Ayuda del sistema'
                        },
                        {
                            text: 'Acerca de',
                            id: 'acercade',
                            icon: perfil.dirImg  + 'info.png',
                            iconCls: 'btn',
                            tooltip:"Acerca de <b>(Alt+...s)</b>",
                            handler: function() {

                                var uri = "seguridad";
                                acercaDe.show(uri);
                            }}
                    ]
                })

        });
			
		this.vpAcciones = new Ext.Viewport({
			layout:'border',
            closable:false,
			items: [{
				layout : 'border',
				region : 'center',
				items : [this.arbolSistemas, this.gpAcciones, this.gpReportes],
				bbar : ['->', this.btnAceptar],
                tbar:['->',this.btnAyuda]
			}]
		});
		
		this.arbolSistemas.on(
			{
				'click': function (node, e){
					_this.stGpAcciones.removeAll();
					if (node.isLeaf()){
						_this.gpAcciones.enable();
						idfuncionalidad = node.attributes.idfuncionalidad;
						_this.stGpAcciones.removeAll();
						_this.stGpAcciones.load({params:{start:0,limit:15}});
						_this.stGpAcciones.removeAll();
					}
				}
			}
		);
		
		this.smAcciones.on(
			{
				'beforerowselect': function (smodel, rowIndex, keepExisting, record){
					accion = record.data.idaccion;
					_this.gpReportes.enable();					
					_this.adicionarrepacciones();
					_this.cbSm.clearSelections();
					_this.stgpReportes.load();		
				}
			}
		);
		
		this.cbSm.on(
			{
				'rowselect': function (SelectionModel, rowIndex, record) {bandera1 = 1;}
			}
		);
		
		/**
		 *Funciones de la interfaz acciones y reportes
		 **/
		
		////------------ Adicionar Acciones ------------////

		this.adicionarrepacciones = function(btn){
			boton = btn;
			var arrayreportesAdd = [];
			var arrayreportesElim = [];
			if(bandera1){ 
				if(arrayreportesini.length > 0){
					arrayreportesElim = _this.eliminarReportes(_this.cbSm.getSelections(),arrayreportesini);
				}
				if(_this.cbSm.getSelections().length > 0){
					arrayreportesAdd = _this.addReportes(_this.cbSm.getSelections(),arrayreportesini);
				}
				if(arrayreportesAdd.length > 0 ||arrayreportesElim.length > 0){
				  Ext.Ajax.request({
				  url:'relacionaraccrep',
				  method:'POST',     
				  waitMsg:'Adicionando acci&oacute;n...',                          
				  params:{idaccion:_this.smAcciones.getSelected().data.idaccion,reportesAdd:Ext.encode(arrayreportesAdd),reportesElim:Ext.encode(arrayreportesElim)},
					   callback: function (options,success,response){  
					   responseData = Ext.decode(response.responseText);
                           //console.log(responseData);

							 arrayreportesAdd = [];
							 arrayreportesElim = [];
							 arrayreportesini = [];
							 if(boton == 'btn'){
								//_this.stGpAcciones.removeAll();
								//_this.stgpReportes.removeAll();
                                 //_this.gpAcciones.disable();
                                 //_this.gpReportes.disable();
                                 _this.gpReportes.getStore().reload();
								boton = 0;
							 }
                           if(responseData.bien==1){
                               mostrarMensaje(1,responseData.mensaje);
                           }
                           else{
                               mostrarMensaje(1,responseData.mensaje);
                           }
							 bandera1 = 0
					   }
					  });
				}
				else{
						if(btn){
							stgpAcciones.removeAll();
							stgpReportes.removeAll();
							gpAcciones.disable();
							gpReportes.disable();
						}
						 arrayreportesini = [];
						 arrayreportesAdd = [];
						 arrayreportesElim = [];
					 return;
				}
			}
			else{
				arrayreportesini = [];
	           	arrayreportesAdd = [];
	        	arrayreportesElim = [];
				return;
			}

    	}
    	
		this.cargarrepoasociados = function(store)	{
				Ext.getBody().mask('Por favor espere....'); 
				Ext.Ajax.request({
				url: 'reportesasociadosarep',
				method:'POST',
				params:{idaccion:accion},
				callback: function (options,success,response){                    
				Ext.getBody().unmask();
				responseData = Ext.decode(response.responseText);
				arreglo = [];
				for(i=0 ;i < responseData.datos.length; i++){
					arrayreportesini.push(responseData.datos[i].idreporte);
					arreglo.push(_this.stgpReportes.getById( responseData.datos[i].idreporte));
				}
				_this.cbSm.selectRecords(arreglo)
				arreglo = [];
			   }
			  });
		}
        this.cargarAyuda=function(){

            var title	= 'Ayuda de acciones reportes';
            console.log('EEE');
            var referencia	= 'herramientasseguridadconfigurarsistemagestionarrecursosistemas';
            help.show(title,referencia);
        }
		this.eliminarReportes = function(reportes,arrayreportesini){
			var arrayreportesElim = [];
			var estaenarray = 0;
			for(i=0 ;i < arrayreportesini.length; i++)
			{
				estaenarray = 0;
					for(j= 0 ;j < reportes.length; j++)
					{
						if(arrayreportesini[i] == reportes[j].id)
						{
							estaenarray = 1;
							break;
						}
					}
					if(estaenarray == 0)
					{
						arrayreportesElim.push(arrayreportesini[i]);            		
					}
			}
			return arrayreportesElim;
		}
		
		this.addReportes = function(reportes,arrayreportesini){	
			var arrayreportesAdd = [];
			if(arrayreportesini.length == 0){
				for(j=0 ;j < reportes.length; j++){	
					var datos = [];
					datos.push(reportes[j].id);
					datos.push(reportes[j].data.title);
					arrayreportesAdd.push(datos);
				}
			}
			else{
				for(i=0 ;i < reportes.length; i++)
				{	
					var datos = [];
					var estaenarray = 0;
						for(h= 0 ;h < arrayreportesini.length; h++){
							if(reportes[i].id == arrayreportesini[h]){
								estaenarray = 1;
								break;
							}
						}
						if(estaenarray == 0){
							datos.push(reportes[i].id);
							datos.push(reportes[i].data.title);
							estaenarray = 0;
							arrayreportesAdd.push(datos);
							datos = [];
						}
					
				}
			}
			return arrayreportesAdd;
		}


	}//fin de la funcion init
}//fin de la vista

perfil = window.parent.parent.UCID.portal.perfil;
Ext.QuickTips.init();
Ext.onReady(function() {	
	//Inicializando la vista.
	var vista = Seguridad.AccionReporte.Vista;
	vista.init({},{});
});

