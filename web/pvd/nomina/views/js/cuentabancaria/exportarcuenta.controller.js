Ext.ns('Pvd.Nomina.Banco.Acreditarcuentabancaria');

Pvd.Nomina.Banco.Acreditarcuentabancaria.Controlador = {
    init: function(idioma, vista, modelo) {
        var variables = {
            identidad : -1,
            idperiodopago: -1,
            idtipopago: -1,
            denominacionentidad: '',
            idelaborarpagos: -1
        };

        //Mostrar interfaz para selecionar entidad.
        //vista.winEstEntidades.show();

		vista.objListarPeriodosPagos.on('periodopagoseleccionado', function(record){
		   if(vista.objListarPeriodosPagos.modoview == 2){
			    vista.objListarPeriodosPagos.btnAddGridExportarVarios.enable();
		        vista.objListarPeriodosPagos.btnDelGridExportarVarios.disable();
				vista.recordperiodopagoseleccionado = record;
		   }
		});
		
		vista.objListarPeriodosPagos.on('periodopagoexportarseleccionado', function(record){
		    if(vista.objListarPeriodosPagos.modoview == 2){
			    vista.objListarPeriodosPagos.btnAddGridExportarVarios.disable();
		        vista.objListarPeriodosPagos.btnDelGridExportarVarios.enable();
				vista.recordperiodopagoexportarseleccionado = record;
		    }
		});
		
		vista.objListarPeriodosPagos.btnAddGridExportarVarios.on('click', function(btn){
		    if(vista.objListarPeriodosPagos.modoview == 2){
			 vista.objListarPeriodosPagos.stPeriodosPagoExportar.add(vista.recordperiodopagoseleccionado);   
			 vista.objListarPeriodosPagos.stPeriodosPago.remove(vista.recordperiodopagoseleccionado); 
			 //vista.objListarPeriodosPagos.stPeriodosPago.removeAll(); 
			 btn.disable();
			 
		    }
		});
		
		vista.objListarPeriodosPagos.btnDelGridExportarVarios.on('click', function(btn){
		    if(vista.objListarPeriodosPagos.modoview == 2){
			 vista.objListarPeriodosPagos.stPeriodosPagoExportar.remove(vista.recordperiodopagoexportarseleccionado);   
			 vista.objListarPeriodosPagos.stPeriodosPago.add(vista.recordperiodopagoexportarseleccionado);   
			 btn.disable();
		    }
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
			variables.idperiodopago = fila.data.idperiodopago;
			variables.idelaborarpagos = fila.data.idelaborarpagos;
		});
        
        vista.btnAceptarPeriodosPagos.on('click', function(){
			if(variables.identidad != null){
				vista.winExportarBanco.show();
				vista.winExportarBanco.maximize();
				
			   var cont =vista.objListarPeriodosPagos.stPeriodosPagoExportar.getCount();
			   var todos =vista.objListarPeriodosPagos.stPeriodosPagoExportar.getRange(0,cont-1);
			   		   
			   var auxid =new Array();
			   var contarraux = 0;
                for (var i =  0; i<cont; i++) {
                    auxid[contarraux] = todos[i].data.idelaborarpagos;
					contarraux++;
				}
			modelo.CargarParaExportarBanco(auxid, variables.identidad);
			}
				
        });
		
		modelo.stExportarBanco.on('load', function(st, record){
		      vista.acumuladoneto = 0;
			  var contador = st.getCount();
		      for (var i =  0; i<contador; i++) {
			   var acumulado = record[i].data.importe_n;
			   vista.acumuladoneto = parseFloat(vista.acumuladoneto) + parseFloat(acumulado);
			  }
			  if(vista.acumuladoneto == 0){
			    vista.nfAcumulado.setValue(0.00);
			  }else{
			    vista.acumuladoneto = Math.round(vista.acumuladoneto * 100) / 100;
                //Si no pincha el math.round usar numero = numero.toFixed(2);				
			    vista.nfAcumulado.setValue(vista.acumuladoneto);
			  }
		});
        
        vista.btnExportarBanco.setHandler(function(){
            alert('alguien');
		    var contador =vista.objListarPeriodosPagos.stPeriodosPagoExportar.getCount();
		    var range = vista.objListarPeriodosPagos.stPeriodosPagoExportar.getRange(0, contador);
			for (var i =  0; i<contador; i++) {
			   vista.arrayidelaborarpagos[i] = range[i].data.idelaborarpagos;
			}
			Ext.Ajax.request({
                    url: 'exportarperiododepagoalbanco',
                    method:'POST',
                    params: {
                        //idelaborarpagos: variables.idelaborarpagos,
                        idelaborarpagos: Ext.encode(vista.arrayidelaborarpagos),
                        identidad: variables.identidad
                    },
                    callback: function (options,success,response){
                        var respuesta = Ext.decode(response.responseText);
                        if(respuesta.codigo == 'OK'){
							window.open(respuesta.url);
						}else if(respuesta.codigo == 'NOCREADBF'){
							mostrarMensaje(2,'No se pudo exportar a formato DBF.');
						}
						else{
							mostrarMensaje(2,'Error a la hora de exportar a formato DBF.');
						}
                    }.createDelegate(this)
                });
		});
	}
};
