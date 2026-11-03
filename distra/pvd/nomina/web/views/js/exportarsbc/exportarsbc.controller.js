Ext.ns('Pvd.Nomina.SBC.ExportarSBC');

Pvd.Nomina.SBC.ExportarSBC.Controlador = {
    init: function(idioma, vista, modelo) {

        var variables = {
            identidad : -1,
			idarea:-1,
            idperiodopago: -1,
            idtipopago: -1,
            denominacionentidad: '',
            idelaborarpagos: -1,
			iddatossbc: 0,
			idpersona: 0,
			sbc1: 0,
			sbc2: 0,
			sbc3: 0,
			sbct: 0,
			cambiosbc1: 0,
			cambiosbc2: 0,
			cambiosbc3: 0,
			cambiomodificar: 0,
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
		
		vista.objListarPeriodosPagos.on('periodopagoseleccionado', function(record){
		   if(vista.objListarPeriodosPagos.modoview == 2){
			    vista.objListarPeriodosPagos.btnAddGridExportarVarios.enable();
		        vista.objListarPeriodosPagos.btnDelGridExportarVarios.disable();
				vista.recordperiodopagoseleccionado = record;
		   }
		})
		
		vista.objListarPeriodosPagos.on('periodopagoexportarseleccionado', function(record){
		    if(vista.objListarPeriodosPagos.modoview == 2){
			    vista.objListarPeriodosPagos.btnAddGridExportarVarios.disable();
		        vista.objListarPeriodosPagos.btnDelGridExportarVarios.enable();
				vista.recordperiodopagoexportarseleccionado = record;
		    }
		})
		
		vista.objListarPeriodosPagos.btnAddGridExportarVarios.on('click', function(btn){
		    if(vista.objListarPeriodosPagos.modoview == 2){
			 vista.objListarPeriodosPagos.stPeriodosPagoExportar.add(vista.recordperiodopagoseleccionado);   
			 vista.objListarPeriodosPagos.stPeriodosPago.remove(vista.recordperiodopagoseleccionado); 
			 //vista.objListarPeriodosPagos.stPeriodosPago.removeAll(); 
			 btn.disable();
			 
		    }
		})
		
		vista.objListarPeriodosPagos.btnDelGridExportarVarios.on('click', function(btn){
		    if(vista.objListarPeriodosPagos.modoview == 2){
			 vista.objListarPeriodosPagos.stPeriodosPagoExportar.remove(vista.recordperiodopagoexportarseleccionado);   
			 vista.objListarPeriodosPagos.stPeriodosPago.add(vista.recordperiodopagoexportarseleccionado);   
			 btn.disable();
		    }
		})
        
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
			variables.idperiodopago = fila.data.idperiodopago;
			variables.idelaborarpagos = fila.data.idelaborarpagos;
		});
        
        vista.btnAceptarPeriodosPagos.on('click', function(){
		    var contador =vista.objListarPeriodosPagos.stPeriodosPagoExportar.getCount();
		    var range = vista.objListarPeriodosPagos.stPeriodosPagoExportar.getRange(0, contador);
			for (var i =  0; i<contador; i++) {
			   vista.arrayidelaborarpagos[i] = range[i].data.idelaborarpagos;
			}
			if(variables.identidad != null){
			 	//window.open(document.location.protocol + '//' + window.location.host + '/pvd/nomina/index.php/exportarsbc/exportarSalarioBaseCalculo?idelaborarpagos='+Ext.encode(vista.arrayidelaborarpagos)+'&identidad='+variables.identidad);
				PVD.mostrarMascara('idmaskenviar','Por favor espere...','Calculando los salarios base de c&aacute;lculo');
				Ext.Ajax.request({
                    url: '/pvd/nomina/index.php/exportarsbc/exportarSalarioBaseCalculo',
					timeout : 50000000,
                    method: 'POST',
                    params: {
                        idelaborarpagos: Ext.encode(vista.arrayidelaborarpagos),
                        identidad: variables.identidad
                     },
                    callback: function (options,success,response){
                        var respuesta = Ext.decode(response.responseText);
						PVD.ocultarMascara('idmaskenviar');
						if(respuesta == "Ok"){
							
							            Ext.Ajax.request({
											url: 'getDatosPlantillaXTP',
											method:'POST',
											params:{},
											callback: function (options,success,response){
													responseData = Ext.decode(response.responseText);
													reescribirPanel(responseData);
											}
										});
									
							
							vista.winExportarSBC.show();
							vista.winExportarSBC.maximize();
							// recargar el grid luego d elos periodos de pago ahoara soloc uando se selecciona una plantilla
							modelo.stPlantillaNAreas.load();
							var seleccionados = new Array();
							modelo.stExportarSBC.load({params:{limit:600, start:0,plantillas: Ext.encode(seleccionados)}});
						}
                    }.createDelegate(this) 
          });
			}
			vista.btnActualizarReporte.enable();	
			
        });
		
		function reescribirPanel(responseData){
		  //var elDatos = vista.pDatosPeriodoPago.getEl();
		  vista.plantillaDatos1.overwrite(vista.pDatosPeriodoPago.body, responseData);
		}
		
		vista.btnBuscar.on('click', function(){
		var seleccionados = new Array();
			var rowselc = vista.smAreas.getSelections();
			for (i = 0; i < rowselc.length; i++) {
				seleccionados.push(rowselc[i].id);			
			}
			modelo.stExportarSBC.load({params:{limit:600, start:0,textoabuscar:vista.tfBuscar.getValue(), plantillas: Ext.encode(seleccionados),identidad:variables.identidad}});
		 // modelo.stExportarSBC.load({params:{limit:600, start:0, textoabuscar:vista.tfBuscar.getValue()}});
		});
		
		
		/*vista.smAreas.on('rowselect', function(){
			var seleccionados = new Array();
			var rowselc = vista.smAreas.getSelections();
		//console.info(selc);
			for (i = 0; i < rowselc.length; i++) {
					seleccionados.push(rowselc[i].id);			
				}
				
			modelo.stExportarSBC.load({params:{limit:600, start:0, plantillas: Ext.encode(seleccionados),identidad:variables.identidad}});
		});*/
		vista.smAreas.on('selectionchange', function(){
			var seleccionados = new Array();
			var rowselc = vista.smAreas.getSelections();
			for (i = 0; i < rowselc.length; i++) {
				seleccionados.push(rowselc[i].id);			
			}
			modelo.stExportarSBC.load({params:{limit:600, start:0, plantillas: Ext.encode(seleccionados),identidad:variables.identidad}});
		});
		
		/*vista.gpAreas.on('afteredit', function(){
			var cont = 0;
			var auxid =new Array();
			var auxarrayDatos =new Array();
			var flag = 0;
			 
			var cont = modelo.stPlantillaNAreas.getTotalCount();
			var todoselementos = modelo.stPlantillaNAreas.getRange();
			 
			for (var i =  0; i<cont; i++) {
			console.info(todoselementos[i].data);
			    if(todoselementos[i].data.valor == " "){
				   flag = 1;
				   break;
				}
			  }
			if(flag == 1){
			    vista.btnActualizarReporte.disable();
			}else{
			    vista.btnActualizarReporte.enable();
			} 
			  
		});*/
		
		vista.btnActualizarReporte.on('click', function(){
		//console.info('actualizando pagos');
		var seleccionados = new Array();
			var rowselc = vista.smAreas.getSelections();
			for (i = 0; i < rowselc.length; i++) {
				seleccionados.push(rowselc[i].id);			
		}
			
		var cont = modelo.stPlantillaNAreas.getTotalCount();
		var todoselementos = modelo.stPlantillaNAreas.getRange(0,cont-1);
		//console.info(todoselementos);
		var flag = 0;
		for (var i =  0; i<cont; i++) {
			    if(!todoselementos[i].data.valor){
				   flag = 1;
				   break;
				}
		}
		if(flag==1){
			mostrarMensaje(3,'Por favor complete los montos en el listado de &aacute;reas');
		}else{
			
			var arrayareamonto = new Array();
			Ext.each(modelo.stPlantillaNAreas.getRange(), function (rec) {   
                arrayareamonto.push({
					monto: rec.data.valor,
                    idarea: rec.data.idarea,
					area:rec.data.area
                    
                });
            });
			 PVD.mostrarMascara('idmaskactualizarreporte','Por favor espere...','Actualizando el reporte de pago por resultados');
				Ext.Ajax.request({
				    timeout : 50000000,
                    url: '/pvd/nomina/index.php/exportarsbc/actualizarReportePagoPorResultados',
                    method: 'POST',
                    params: {
                            montototal: Ext.encode(arrayareamonto),
							identidad: variables.identidad
                     },
                    callback: function (options,success,response){
					modelo.stExportarSBC.load({params:{limit:600, start:0, plantillas: Ext.encode(seleccionados),identidad:variables.identidad}});
					vista.btnActualizarReporte.disable();
					variables.cambiomodificar = 1;
                        var respuesta = Ext.decode(response.responseText);
						PVD.ocultarMascara('idmaskactualizarreporte');
						//mostrarMensaje(1, 'El monto a repartir coincide con la cantidad distribuida mediante la f&oacute;rmula aplicada');
						if(respuesta.sumacontrol == 0){
							mostrarMensaje(1, 'El monto a repartir coincide con la cantidad distribuida mediante la f&oacute;rmula aplicada');
						}else {
							var menosValor = '';
							var masValor = '';
							var cambiomas = 0;
							var cambiomenos = 0;
							//console.info(respuesta.sumacontrol);
							
							for(i=0; i <  respuesta.sumacontrol.length; i++){
								//console.info(respuesta.sumacontrol[i].diferencia);
								if(respuesta.sumacontrol[i].diferencia >0){
									//menosValor = 'en el area' + respuesta.sumacontrol[i].area +' de '+ respuesta.sumacontrol[i].diferencia + ',';
									menosValor = 'De los <b>'+respuesta.sumacontrol[i].monto+'</b> pesos a repartir en el &aacute;rea <b>'+respuesta.sumacontrol[i].area+'</b> se repartieron <b>'+respuesta.sumacontrol[i].montorepartido+'</b> hay un d&eacute;ficit de: <b>'+respuesta.sumacontrol[i].diferencia+'</b> pesos. ';
									 cambiomas = 1;
								}else if(respuesta.sumacontrol[i].diferencia < 0){
									//masValor = 'en el area' + respuesta.sumacontrol[i].area +' de '+ respuesta.sumacontrol[i].diferencia + ',';
									masValor = 'De los <b>'+respuesta.sumacontrol[i].monto+'</b> pesos a repartir en el &aacute;rea <b>'+respuesta.sumacontrol[i].area+'</b> se repartieron <b>'+respuesta.sumacontrol[i].montorepartido+'</b> hay un exceso de: <b>'+respuesta.sumacontrol[i].diferencia+'</b> pesos. ';
									 cambiomenos = 1;
								}
								
							}
							
							if(cambiomas){
								 mostrarMensaje(3,' '+menosValor+' ');
							}if(cambiomenos){
								 mostrarMensaje(3,' '+ masValor + '');
							}
							
							
							 
						}
						//console.info(menosValor);
						/*else if(respuesta.controldiferencia > 0){
						    mostrarMensaje(3, 'Los <b>'+respuesta.sumacontrol+'</b> pesos distribuidos mediante la f&oacute;rmula aplicada no coinciden con el monto a repartir <b>(SRD)</b>', function(btn){
							 if(btn=='ok'){
							  mostrarMensaje(3, 'Hay un d&eacute;ficit de: <b>'+respuesta.controldiferencia+'</b> pesos');
							 }
							});
						}else{
						    mostrarMensaje(3, 'Los <b>'+respuesta.sumacontrol+'</b> pesos distribuidos mediante la f&oacute;rmula aplicada no coinciden con el monto a repartir <b>(SRD)</b>', function(btn){
							 if(btn=='ok'){
							  mostrarMensaje(3, 'Hay un exceso de: <b>'+Math.abs(respuesta.controldiferencia)+'</b> pesos');
							 }
							});
						}**/
                    }.createDelegate(this) 
          });
			 }
		
		
		   /* var montototal = vista.nfMontoTotal.getValue();
			if(montototal){
		    PVD.mostrarMascara('idmaskactualizarreporte','Por favor espere...','Actualizando el reporte de pago por resultados');
				Ext.Ajax.request({
				    timeout : 50000000,
                    url: '/pvd/nomina/index.php/exportarsbc/actualizarReportePagoPorResultados',
                    method: 'POST',
                    params: {
                            montototal: montototal,
							identidad: variables.identidad
                     },
                    callback: function (options,success,response){
                        var respuesta = Ext.decode(response.responseText);
						PVD.ocultarMascara('idmaskactualizarreporte');
						if(respuesta.controldiferencia == 0){
							mostrarMensaje(1, 'El monto a repartir coincide con la cantidad distribuida mediante la f&oacute;rmula aplicada');
						}else if(respuesta.controldiferencia > 0){
						    mostrarMensaje(3, 'Los <b>'+respuesta.sumacontrol+'</b> pesos distribuidos mediante la f&oacute;rmula aplicada no coinciden con el monto a repartir <b>(SRD)</b>', function(btn){
							 if(btn=='ok'){
							  mostrarMensaje(3, 'Hay un d&eacute;ficit de: <b>'+respuesta.controldiferencia+'</b> pesos');
							 }
							});
						}else{
						    mostrarMensaje(3, 'Los <b>'+respuesta.sumacontrol+'</b> pesos distribuidos mediante la f&oacute;rmula aplicada no coinciden con el monto a repartir <b>(SRD)</b>', function(btn){
							 if(btn=='ok'){
							  mostrarMensaje(3, 'Hay un exceso de: <b>'+Math.abs(respuesta.controldiferencia)+'</b> pesos');
							 }
							});
						}
                    }.createDelegate(this) 
          });
		  }else{
		    mostrarMensaje(3, 'Por favor introduzca un monto a repartir correcto');
		  }	*/
				
        });
		
		vista.gpExportarSBC.selModel.on('rowselect', function(sm, index, store){
		if(variables.cambiomodificar == 1){
			 vista.btnModificarSBC.disable();
		}else{
			 vista.btnModificarSBC.enable();
		}
		   
			variables.iddatossbc = sm.getSelected().get('iddatossbc');
			variables.idpersona = sm.getSelected().get('idpersona');
			variables.idarea = sm.getSelected().get('idarea');
			variables.sbc1 = sm.getSelected().get('sbc1');
			variables.sbc2 = sm.getSelected().get('sbc2');
			variables.sbc3 = sm.getSelected().get('sbc3');
			variables.sbct = sm.getSelected().get('sbct');
		   // console.info(sm.getSelected().get('sbct'));
		});
		
		vista.btnModificarSBC.on('click', function(){
		    vista.ventanaCausaModSBC.show();
			vista.nfcambiosbc1.setValue(variables.sbc1);
			vista.nfcambiosbc2.setValue(variables.sbc2);
			vista.nfcambiosbc3.setValue(variables.sbc3);
			vista.tfDescripModSBC.setValue("");
		});
		
		vista.btnCancelarModSBC.on('click', function(){
		   vista.ventanaCausaModSBC.hide();
		});
		
		vista.nfcambiosbc1.on('change', function(){
		    variables.cambiosbc1 = 1;
		});
		
		vista.nfcambiosbc2.on('change', function(){
		    variables.cambiosbc2 = 1;
		});
		
		vista.nfcambiosbc3.on('change', function(){
		    variables.cambiosbc3 = 1;
		});
		
		vista.btnAceptarModSBC.on('click', function(){
		    if(variables.cambiosbc1 == 0 && variables.cambiosbc2 == 0 && variables.cambiosbc3 == 0){
			 vista.ventanaCausaModSBC.hide();
			}else{
		    if(vista.formularioModSBC.getForm().isValid()){
		     PVD.mostrarMascara('idmasksbc', 'Por favor espere...', 'Modificando datos');
		     Ext.Ajax.request({
                    url: '/pvd/nomina/index.php/exportarsbc/modificarSBC',
                    method: 'POST',
                    params: {
                        iddatossbc: variables.iddatossbc,
                        idarea: variables.idarea,
                        idpersona: variables.idpersona,
						sbc1: vista.nfcambiosbc1.getValue(),
			            sbc2: vista.nfcambiosbc2.getValue(),
			            sbc3: vista.nfcambiosbc3.getValue(),
			            descripcion: vista.tfDescripModSBC.getValue()
						
                    },
                    callback: function (options,success,response){
					    PVD.ocultarMascara('idmasksbc');
                        var respuesta = Ext.decode(response.responseText);
                        variables.cambiosbc1 = 0;
			            variables.cambiosbc2 = 0;
			            variables.cambiosbc3 = 0;
						if(respuesta == "Ok"){
						mostrarMensaje(1, 'El sbc se actualizó correctamente');
						}
						vista.ventanaCausaModSBC.hide();
						var seleccionados = new Array();
						var rowselc = vista.smAreas.getSelections();
						for (i = 0; i < rowselc.length; i++) {
							seleccionados.push(rowselc[i].id);			
						}
					modelo.stExportarSBC.load({params:{limit:600, start:0, plantillas: Ext.encode(seleccionados),identidad:variables.identidad}});
                    }.createDelegate(this)
          });
		   }
		 }  
		});
	}
}
