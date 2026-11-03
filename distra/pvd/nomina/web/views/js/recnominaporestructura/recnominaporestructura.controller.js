Ext.ns('Pvd.Nomina.Recuperaciones.RecNominaporEstructura');

Pvd.Nomina.Recuperaciones.RecNominaporEstructura.Controlador = {
    init: function(idioma, vista, modelo) {

        var variables = {
            identidad : null,
            denominacionentidad: '',
            idtipopago: null,
            idelaborarpago: -1,
            nodo: -1
        };       
        
        //Mostrar interfaz para selecionar entidad.
        vista.winEstEntidades.show();
        
        //Eventos del objeto del ábol de entidades.
        vista.pEstEntidades.on('estructuraselecionada', function(o, nodo){            
            //if(nodo.attributes.tipoestructura == 3){
                variables.identidad = nodo.id;
                variables.denominacionentidad = nodo.text;
                vista.btnAceptarEntidades.enable();
            /*}else{
                variables.identidad = null;     
                variables.denominacionentidad = '';           
                vista.btnAceptarEntidades.disable();                
            }*/
        });
        
        vista.btnAceptarEntidades.on('click', function(){
				if(variables.identidad != null){
					vista.objListarPeriodosPagos.CambiarEntidad(variables.identidad);
					var titulo = vista.winPeriodosPagos.title + ' -  ' + variables.denominacionentidad; 
					vista.winPeriodosPagos.setTitle(titulo);
					vista.winPeriodosPagos.show();
				}	
        });
        
        vista.objListarPeriodosPagos.on('periodopagoseleccionado', function(fila){
			vista.btnAceptarPeriodosPagos.enable();
			variables.idtipopago = fila.data.idtipopago;
			variables.idelaborarpago = fila.data.idelaborarpago;
		});
        
        vista.btnAceptarPeriodosPagos.on('click', function(){
			if(variables.identidad != null){
				vista.winRecNominaporEstructura.show();
				vista.winRecNominaporEstructura.maximize();
			}
				
        });
        
        
        vista.pEstructuras.on('estructuraselecionada', function(o, nodo){            
                variables.nodo = nodo.id;
                this.ObtenerNominaPersona(variables.nodo);
        }.createDelegate(this));
        
       this.ObtenerNominaPersona = function(idestructura){
				Ext.Ajax.request({
							url: 'obtenernominapersonaporestructura',
							method: 'POST',
							params: {
								nodo : idestructura,
								idelaborarpago: variables.idelaborarpago
							},
							callback: function (options,success,response){
								var respuesta = Ext.decode(response.responseText);
								if(respuesta.campos.length <= 0){
									mostrarMensaje(1, 'No existen datos de n&oacute;mina.');
									return;
								}
								
								var camposStore = new Array();
								
								var arrObjCM = new Array();
								arrObjCM[0] = new Ext.grid.RowNumberer();
								arrObjCM[1] = {
								   id:'id',
								   header: "id",
								   dataIndex: 'id',
								   hidden: true,
								   hideable: false
								}; 
								
								camposStore.push({name: 'id'});
								
								for(var i = 0; i < respuesta.campos.length; i++){
									camposStore.push({name: respuesta.campos[i].indice});
										if(respuesta.campos[i].tipocampo != "1"){
											arrObjCM.push({
											   header: respuesta.campos[i].denominacion,
											   dataIndex: respuesta.campos[i].indice,
											   hideable: true,
											   renderer: function(val){
															if(val != "0.00") return '<center><span style="color:green;">'+val+'</span></center>';
															else return "<center>"+val+"</center>";
												   }
											});
										}else{
											arrObjCM.push({
											   header: respuesta.campos[i].denominacion,
											   dataIndex: respuesta.campos[i].indice,
											   hideable: true,
											   renderer: function(val){
															return val;
												   }
											});
										}	
								}        

								var recCampos = Ext.data.Record.create(camposStore);
								 var storeGrid = new Ext.data.SimpleStore({
										fields: camposStore,
										sortInfo : {field: "id", direction: "ASC"}
									});
								
								var d = new Array();	
								for(var i = 0; i < respuesta.valores.length; i++){
									var a = new Array();
									a.push(respuesta.valores[i].id);
									for(var j = 1; j < camposStore.length; j++){
										eval("var v = respuesta.valores[i]."+(camposStore[j].name)+";");
										a.push(v);
									}
									d.push(a);
								}
								
								storeGrid.loadData(d);
								
								 var cmGrid = new Ext.grid.ColumnModel(arrObjCM);
								cmGrid.defaultSortable = true;
								
								vista.gpNominaPersonas.reconfigure(storeGrid, cmGrid);
								vista.gpNominaPersonas.doLayout();
								
							}.createDelegate(this)
				  });
		}
		
	}
}
