Ext.ns('Pvd.Nomina.CalcularPagoResultado');

Pvd.Nomina.CalcularPagoResultado.Controlador = {
    init: function(idioma, vista, modelo) {

        var variables = {
            identidad : -1,
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
			cambiosbc3: 0
	    };       
        
        //Mostrar interfaz para selecionar entidad.
        vista.winEstEntidades.show();
        
        //Eventos del objeto del ábol de entidades.
        vista.pEstEntidades.on('estructuraselecionada', function(o, nodo){            
            //if(nodo.attributes.tipoestructura == 3){
                variables.identidad = nodo.id;
                 variables.denominacionentidad = nodo.text;
                vista.btnAceptarEntidades.enable();
           /* }else{
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
                    url: '/pvd/nomina/index.php/calcularpagoresultadosecasa/buscardatosSalarioBaseCalculo',
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
							vista.winExportarSBC.show();
							vista.winExportarSBC.maximize();
							modelo.stExportarSBC.load({params:{limit:600, start:0}});
						}
                    }.createDelegate(this) 
          });
			}
				
        });
		
		vista.btnBuscar.on('click', function(){
		  modelo.stExportarSBC.load({params:{limit:600, start:0, textoabuscar:vista.tfBuscar.getValue()}});
		});
		
		vista.btnActualizarReporte.on('click', function(){
		    var montototal = vista.nfMontoTotal.getValue();
			if(montototal){
		    PVD.mostrarMascara('idmaskactualizarreporte','Por favor espere...','Actualizando el reporte de pago por resultados');
				Ext.Ajax.request({
				    timeout : 50000000,
                    url: '/pvd/nomina/index.php/calcularpagoresultadosecasa/actualizarReportePagoPorResultadosECASA',
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
						modelo.stExportarSBC.load({params:{limit:100, start:0}});
                    }.createDelegate(this) 
          });
		  }else{
		    mostrarMensaje(3, 'Por favor introduzca un monto a repartir correcto');
		  }	
				
        });
		
		vista.gpExportarSBC.selModel.on('rowselect', function(sm, index, store){
		    vista.btnModificarSBC.enable();
			variables.iddatossbc = sm.getSelected().get('iddatossbc');
			variables.idpersona = sm.getSelected().get('idpersona');
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
                    url: '/pvd/nomina/index.php/calcularpagoresultadosecasa/modificardatosSBC',
                    method: 'POST',
                    params: {
                        iddatossbc: variables.iddatossbc,
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
						modelo.stExportarSBC.load({params:{limit:600, start:0}});
                    }.createDelegate(this)
          });
		   }
		 }  
		});
	}
}
