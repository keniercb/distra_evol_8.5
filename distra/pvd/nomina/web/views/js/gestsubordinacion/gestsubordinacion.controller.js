Ext.ns('Pvd.Nomina.Configuracion.GestSubordinacion');

//Controlador de la vista del componente Gestionar subordinacion.
Pvd.Nomina.Configuracion.GestSubordinacion.Controlador = {
	/**
     * Inicializar el controlador de la vista.
     * 
     * @param idioma Objeto que contiene el idioma de los textos de la IU (Tipo: Object).
     * @param vista Vista del componente Gestionar subordinacion (Tipo: Pvd.Nomina.Configuracion.GestSubordinacion.Vista)
     * @param modelo Modelo de la vista del componente Gestionar subordinacion (Tipo: Pvd.Nomina.Configuracion.GestSubordinacion.Modelo)
     */
    init: function(idioma, vista, modelo) {
        /**
         *Variables generales.
         */
        var variables = {
            identidad : 0,
            idcargo : 0,
			iteraciones: 0,
        };
		
		//Eventos del objeto del ábol de estructura y composición.
        vista.panelEstEnt.on('estructuraselecionada', function(o, nodo){
            if(nodo.attributes.tipoestructura == 7){
                vista.btnAsociarCargos.enable();
				variables.idcargo = nodo.attributes.id;
				modelo.storeCargos.load({params:{idjefe:variables.idcargo}});
				modelo.storePersonas.load({params:{idjefe:variables.idcargo}});
            }else{
                vista.btnAsociarCargos.disable();
				var totalcountcargos = modelo.storeCargos.getTotalCount();
				var totalcountpersona = modelo.storePersonas.getTotalCount();
				if(totalcountcargos>0){
				  modelo.storeCargos.load();
				}
				if(totalcountpersona>0){
				  modelo.storePersonas.load();
				}
				
				
            }
			vista.btnDesasociarCargos.disable();
        });
		
		modelo.storeArbolPlantilla.on('beforeload', function(st, o){
		     st.baseParams.idestructura = variables.idcargo;
		});
		
		//Eventos del seleccion model del grid de cargos.
        vista.gpCargos.selModel.on('rowselect', function() {
            vista.btnDesasociarCargos.enable();
        });
		
		//Eventos del deseleccion model del grid de cargos.
        vista.gpCargos.selModel.on('rowdeselect', function() {
            var arrayselections = vista.gpCargos.getSelectionModel().getSelections();
			if(arrayselections.length==0){
			  vista.btnDesasociarCargos.disable();
			}
        });
		
		//Evento del btn asociar
		vista.btnAsociarCargos.on('click', function(){
		   vista.ventanaArbolPlantilla.show();
		    if(variables.iteraciones>0){
		     var root = vista.ArbolPlantilla.getRootNode();
		     modelo.storeArbolPlantilla.load(root);
		    }
		    variables.iteraciones++;
		});
		
		//Evento del btn desasociar
		vista.btnDesasociarCargos.on('click', function(){
		   var arrayselections = vista.gpCargos.getSelectionModel().getSelections();
		   var arrayidcargos = new Array();
		   var cont = 0;
		   for(var i = 0; i < arrayselections.length; i++){
		    arrayidcargos[cont] = arrayselections[i].data.idsubordinacion;
			cont++
		   }
		   mostrarMensaje(2, 'Esta seguro que desea eliminar los datos', function(btn){
		     if(btn == "ok"){
			    //Mostrando la mascara
		        PVD.mostrarMascara('idmaskasoc', 'Enviando datos al servidor', 'Por favor espere...');
		        //Enviando datos al servidor.
                Ext.Ajax.request({
                  url: 'delCargosSubordinados',
                  method:'POST',
                  params:{arraycargos : Ext.encode(arrayidcargos), 
                         },
                  callback: function (options,success,response){
                    responseData = Ext.decode(response.responseText);
                    //Ocultando máscara de enviar datos.
                    PVD.ocultarMascara('idmaskasoc');
			        if(responseData.desasoc == 1){
			           mostrarMensaje(1, 'La subordinacion se elimin&oacute correctamente');
				       modelo.storeCargos.load({params:{idjefe:variables.idcargo}});
				      
			        }
                 }  
                });
			 }
		   });
		   
		});
		
		//Evento del btn cancelar ventana
		vista.btnCancelarPlantilla.on('click', function(){
		   vista.ventanaArbolPlantilla.hide();
		});
		
		//Evento del btn aceptar ventana
		vista.btnAceptarPlantilla.on('click', function(){
		   var chequeados = vista.ArbolPlantilla.getChecked();
		   var arrayidcargos = new Array();
		   var contcargos = 0;
		   for(var i = 0;i<chequeados.length; i++){
		    arrayidcargos[contcargos] = chequeados[i].attributes.id;
		    contcargos++;
		   }
		   //Mostrando la mascara
		   PVD.mostrarMascara('idmaskasoc', 'Enviando datos al servidor', 'Por favor espere...');
		   //Enviando datos al servidor.
           Ext.Ajax.request({
            url: 'asociarCargosSubordinados',
            method:'POST',
            params:{idjefe : variables.idcargo,
                    arraycargos : Ext.encode(arrayidcargos), 
                    },
            callback: function (options,success,response){
              responseData = Ext.decode(response.responseText);
              //Ocultando máscara de enviar datos.
              PVD.ocultarMascara('idmaskasoc');
			  if(responseData.asoc == 1){
			    mostrarMensaje(1, 'La subordinacion se asoci&oacute; correctamente');
				modelo.storeCargos.load({params:{idjefe:variables.idcargo}});
				vista.ventanaArbolPlantilla.hide();
			  }
            }
           });
		});
    }
}
