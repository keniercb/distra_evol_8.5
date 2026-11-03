Ext.ns('Pvd.Nomina.Configuracion.GestConvenios');

//Controlador de la vista del componente Gestionar subordinacion.
Pvd.Nomina.Configuracion.GestConvenios.Controlador = {
	/**
     * Inicializar el controlador de la vista.
     * 
     * @param idioma Objeto que contiene el idioma de los textos de la IU (Tipo: Object).
     * @param vista Vista del componente Gestionar subordinacion (Tipo: Pvd.Nomina.Configuracion.GestConvenios.Vista)
     * @param modelo Modelo de la vista del componente Gestionar subordinacion (Tipo: Pvd.Nomina.Configuracion.GestConvenios.Modelo)
     */
    init: function(idioma, vista, modelo) {
        /**
         *Variables generales.
         */
        var variables = {
            identidad : 0,
            idcargo : 0,
			iteraciones: 0,
			cambio:0,
			accion:'ADD',
			idconvenio:0,
			identidad:0,
			numeroconvenio:0,
			salario:0,
			porcientoejecucion:0,
			penalizacion:0,
			fechainicio:0,
			fechafin:0,
            aprobado:0,
            obra:0,
            horas:0
        };
		
	this.gestmodeloaplicacionconvenio = null;

    modelo.storeObras.load();

	vista.pobjestructura.on('estructuraselecionada',function(sm, nodo){
		//if(nodo.attributes.tipoestructura == 3){
            vista.btnAceptarEntidad.enable();
            variables.identidad = nodo.id;
            modelo.idestrucrura = nodo.id;
        //}
    }.createDelegate(this));
        
    vista.btnAceptarEntidad.setHandler(function(){
       modelo.storeConvenios.load({params:{identidad:variables.identidad}});
	   vista.windowConvenios.show();
	   vista.windowConvenios.maximize();
    }.createDelegate(this));
        
    vista.winEstructura.show();
	
	//modelo.storeConvenios.load();
	
	vista.tfDenomConvenio.on('change', function(tf){
	      variables.cambio = 1;
	});
	
	vista.nfNumeroConvenio.on('change', function(tf){
	      variables.cambio = 1;
	});
	
	vista.nfPorcientoTerminacion.on('change', function(tf){
	      variables.cambio = 1;
	});
	
	vista.nfSalario.on('change', function(tf){
	      variables.cambio = 1;
	});
	
	vista.nfPenalizacion.on('change', function(tf){
	      variables.cambio = 1;
	});
	
	vista.dfFInicioConvenio.on('change', function(df){
	      variables.cambio = 1;
	});
	
	vista.dfFFinConvenio.on('change', function(df){
	      variables.cambio = 1;
	});
	
	vista.tfDescripConvenio.on('change', function(tf){
	      variables.cambio = 1;
	});
	
	vista.btnAddGestConvenioss.on('click', function(){
	    variables.accion = 'ADD';
		vista.ventanaConvenio.setTitle('Adicionar convenio');
		vista.tfDenomConvenio.setValue("");
        vista.cbObra.setValue('');
		vista.dfFInicioConvenio.setValue("");
		vista.dfFFinConvenio.setValue("");
		vista.tfDescripConvenio.setValue("");
		vista.nfNumeroConvenio.setValue("");
		vista.nfPorcientoTerminacion.setValue("");
		vista.nfSalario.setValue("");
		vista.nfPenalizacion.setValue("");
		vista.ventanaConvenio.show();
	});
	
	vista.btnModGestConvenios.on('click', function(){
	    variables.accion = 'MOD';
        vista.ventanaConvenio.setTitle('Modificar convenio');
		vista.nfNumeroConvenio.setValue(vista.smGestConvenioss.getSelected().get('numeroconvenio'));
		vista.tfDenomConvenio.setValue(vista.smGestConvenioss.getSelected().get('denominacion'));
		vista.cbObra.setValue(vista.smGestConvenioss.getSelected().get('idobra'));
		vista.nfPorcientoTerminacion.setValue(vista.smGestConvenioss.getSelected().get('porcientoejecucion'));
		vista.nfSalario.setValue(vista.smGestConvenioss.getSelected().get('salario'));
		vista.nfPenalizacion.setValue(vista.smGestConvenioss.getSelected().get('penalizacion'));
		vista.dfFInicioConvenio.setValue(vista.smGestConvenioss.getSelected().get('fechainicio'));
		vista.dfFFinConvenio.setValue(vista.smGestConvenioss.getSelected().data.fechafin);
		vista.ventanaConvenio.show();
	});
	
	vista.btnGestModeloAplicacionConvenio.on('click', function(){
	    var salariodescuentoejecucion = parseFloat(variables.salario*variables.porcientoejecucion/100);
	    var penalizacionsalario = parseFloat(salariodescuentoejecucion*variables.penalizacion/100);
	    var salarioreal = parseFloat(salariodescuentoejecucion - penalizacionsalario);
		//Enviando datos al servidor para buscar si hay algun destajo definido.
        Ext.Ajax.request({
            url: 'buscarTipoConvenio',
            method:'POST',
            params:{idconvenio : variables.idconvenio, 
			        identidad : variables.identidad
            },
            callback: function (options,success,response){
              responseData = Ext.decode(response.responseText);
			  
			  if(responseData == 0){
			    vista.ventanaTipoDestajo.show();
			  }else{
			    if(responseData.existemodeloindividual > 0){
                    this.gestmodeloaplicacionconvenio = new Pvd.Nomina.gestmodeloaplicacionconvenio({
		                    tipoconvenio:1,
			                idconvenio  : variables.idconvenio,
			                idestructura  : variables.identidad,
			                numeroconvenio  : variables.numeroconvenio,
			                salario  : variables.salario,
			                salarioreal  : salarioreal,
			                fechainicio  : variables.fechainicio,
			                fechafin  : variables.fechafin,
			                aprobado  : variables.aprobado,
                            obra  : variables.obra,
                            horas  : variables.horas
		            });
                    this.gestmodeloaplicacionconvenio.show();
                    this.gestmodeloaplicacionconvenio.maximize();
			    }else{
                    this.gestmodeloaplicacionconvenio = new Pvd.Nomina.gestmodeloaplicacionconvenio({
		                    tipoconvenio:2,
			                idconvenio  : variables.idconvenio,
			                idestructura  : variables.identidad,
			                numeroconvenio  : variables.numeroconvenio,
			                salario  : variables.salario,
			                salarioreal  : salarioreal,
							fechainicio  : variables.fechainicio,
			                fechafin  : variables.fechafin,
                            aprobado  : variables.aprobado,
                            obra  : variables.obra,
                            horas  : variables.horas
		            });
                    this.gestmodeloaplicacionconvenio.show();
                    this.gestmodeloaplicacionconvenio.maximize();
                    this.gestmodeloaplicacionconvenio.btnCancelarModeloConvenio.on('click', function(btn){
                        modelo.storeConvenios.reload();
                        vista.ventanaTipoDestajo.hide();
                    });
				}
              }
		    }.createDelegate(this)
        });
	    //
	});
	
	vista.btnAceptarTipoDestajo.on('click', function(){
	    var salariodescuentoejecucion = parseFloat(variables.salario*variables.porcientoejecucion/100);
	    var penalizacionsalario = parseFloat(salariodescuentoejecucion*variables.penalizacion/100);
	    var salarioreal = parseFloat(salariodescuentoejecucion - penalizacionsalario);
	    var destindividual = vista.rbDestajoIndividual.getValue();
	    var destcolectivo = vista.rbDestajoColectivo.getValue();
		if(destindividual == true && destcolectivo == false){
            this.gestmodeloaplicacionconvenio = new Pvd.Nomina.gestmodeloaplicacionconvenio({
		      tipoconvenio:1,
			  idconvenio  : variables.idconvenio,
			  idestructura  : variables.identidad,
			  numeroconvenio  : variables.numeroconvenio,
			  salario  : variables.salario,
			  salarioreal  : salarioreal,
			  fechainicio  : variables.fechainicio,
			  fechafin  : variables.fechafin,
              aprobado  : variables.aprobado,
              obra  : variables.obra,
              horas  : variables.horas
		});
            this.gestmodeloaplicacionconvenio.show();
            this.gestmodeloaplicacionconvenio.maximize();
		}else if(destindividual == false && destcolectivo == true){
            this.gestmodeloaplicacionconvenio = new Pvd.Nomina.gestmodeloaplicacionconvenio({
		      tipoconvenio:2,
			  idconvenio  : variables.idconvenio,
			  idestructura  : variables.identidad,
			  numeroconvenio  : variables.numeroconvenio,
			  salario  : variables.salario,
			  salarioreal  : salarioreal,
			  fechainicio  : variables.fechainicio, 
			  fechafin  : variables.fechafin,
              aprobado  : variables.aprobado,
              obra  : variables.obra,
              horas  : variables.horas
		});
            this.gestmodeloaplicacionconvenio.show();
            this.gestmodeloaplicacionconvenio.maximize();
            this.gestmodeloaplicacionconvenio.btnCancelarModeloConvenio.on('click', function(btn){
                modelo.storeConvenios.reload();
                vista.ventanaTipoDestajo.hide();
            });
		
		}else if(destindividual == false && destcolectivo == false){
		  mostrarMensaje(3, 'Por favor escoja un tipo de destajo para este Convenio')
		}
    }.createDelegate(this));


	
	vista.btnCancelarTipoDestajo.on('click', function(){
	    vista.ventanaTipoDestajo.hide();
	});
	
	vista.btnCancelarConvenio.on('click', function(){
	    vista.ventanaConvenio.hide();
	});
	
	vista.smGestConvenioss.on('rowselect', function(obj, ind, sm){
            vista.btnGestModeloAplicacionConvenio.enable();
            vista.btnAprobarConvenio.enable();
            vista.btnModGestConvenios.enable();
            vista.btnDelGestConvenioss.enable();
			variables.idconvenio = sm.get('idconvenio');
			variables.numeroconvenio = sm.get('numeroconvenio');
			variables.salario = sm.get('salario');
			variables.porcientoejecucion = sm.get('porcientoejecucion');
			variables.penalizacion = sm.get('penalizacion');
			variables.fechainicio = sm.get('fechainicio');
			variables.fechafin = sm.get('fechafin');
			variables.aprobado = sm.get('aprobado');
			variables.obra = sm.get('obra');
			variables.horas = sm.get('horas');
            if(sm.get('aprobado') == 1){
                vista.btnAprobarConvenio.disable();
            }else{
                if(sm.get('definido') == 1){
                    vista.btnAprobarConvenio.enable();
                }else{
                    vista.btnAprobarConvenio.disable();
                }
            }
    });

    vista.smGestConvenioss.on('rowdeselect', function(obj, ind, sm){
            var cantidadseleccionados = vista.gpGestConvenioss.getSelectionModel().getSelections().length;
            (cantidadseleccionados == 0)?vista.btnGestModeloAplicacionConvenio.disable():vista.btnGestModeloAplicacionConvenio.enable();
            (cantidadseleccionados == 0)?vista.btnAprobarConvenio.disable():vista.btnAprobarConvenio.enable();
    });

    vista.btnAprobarConvenio.on('click', function(){
        PVD.mostrarMascara('idmaskaprobar', 'Por favor espere', 'Enviando datos');
        Ext.Ajax.request({
            url: 'aprobarConvenio',
            params: {idconvenio:variables.idconvenio},
            callback: function(option, succes, response){
                PVD.ocultarMascara('idmaskaprobar');
                var respuesta = Ext.decode(response.responseText);
                if(respuesta == 'ok'){
                    mostrarMensaje('El convenio fue aprobado satisfactoriamente');
                    modelo.storeConvenios.reload();
                }
            }
        });
    });
	
	vista.btnAceptarConvenio.on('click', function(){
	    //Se verifica si el formulario es v�lido y si el campo sueldo contiene un valor
                if(vista.formularioConvenio.getForm().isValid()){
                    var addmod = 0;
                    var url = '';
					if(variables.accion == 'ADD'){
					  addmod = 1;
					}else if(variables.accion == 'MOD'){
					  if(variables.cambio == 1){
					    addmod = 2;
					  }
					}
					//Se muestra la m�scara de espera.
                    PVD.mostrarMascara('idmaskaddmodconvenio', 'Por favor espere...', 'Enviando datos');
                   
                    //Enviando datos al servidor.
                    Ext.Ajax.request({
                        url: 'addModConvenio',
                        method:'POST',
                        params:{idconvenio : variables.idconvenio,
                                numeroconvenio : vista.nfNumeroConvenio.getValue(), 
                                denominacion : vista.tfDenomConvenio.getValue(), 
                                idobra : vista.cbObra.getValue(),
                                porcientoejecucion : vista.nfPorcientoTerminacion.getValue(),
                                salario : vista.nfSalario.getValue(), 
                                penalizacion : vista.nfPenalizacion.getValue(), 
                                fechainicio : vista.dfFInicioConvenio.getRawValue(), 
                                fechafin : vista.dfFFinConvenio.getRawValue(), 
                                descripcion : vista.tfDescripConvenio.getValue(), 
                                identidad : variables.identidad, 
								addmod : addmod
                        },
                        callback: function (options,success,response){
                            responseData = Ext.decode(response.responseText);

                            //Ocultando m�scara de enviar datos.
                            PVD.ocultarMascara('idmaskaddmodconvenio');
                            
							mostrarMensaje(1, (responseData=='ADD')?'El convenio fue adicionado satisfactoriamente':'El convenio fue modificado satisfactoriamente', function(btn){
							  if(btn=='ok'){
							    modelo.storeConvenios.load({params:{identidad:variables.identidad}});
							  }
							});
							variables.cambio == 0;
							vista.ventanaConvenio.hide();
							vista.btnModGestConvenios.disable();
							vista.btnDelGestConvenioss.disable();
                            vista.btnGestModeloAplicacionConvenio.disable();
                        }
                    });
                }else{
                    mostrarMensaje(3, 'Por favor verifique los campos incorrectos');
                }
	});
	
	vista.btnDelGestConvenioss.on('click', function(){
	    mostrarMensaje(2, 'Esta seguro que desea eliminar el convenio', function(btn){
            if(btn=='ok'){		
				   //Se muestra la m�scara de espera.
                    PVD.mostrarMascara('idmaskdelconvenio', 'Por favor espere...', 'Eliminando datos');
                   
                    //Enviando datos al servidor.
                    Ext.Ajax.request({
                        url: 'eliminarConvenio',
                        method:'POST',
                        params:{idconvenio : variables.idconvenio
                        },
                        callback: function (options,success,response){
                            responseData = Ext.decode(response.responseText);

                            //Ocultando m�scara de enviar datos.
                            PVD.ocultarMascara('idmaskdelconvenio');
                            
							if(responseData == 'DEL'){
							  variables.cambio == 0;
							  vista.btnModGestConvenios.disable();
							  vista.btnDelGestConvenioss.disable();
                              vista.btnGestModeloAplicacionConvenio.disable();
							  mostrarMensaje(1, 'El convenio fue eliminado satisfactoriamente', function(btn){
							    if(btn=='ok'){
							      modelo.storeConvenios.load({params:{identidad:variables.identidad}});
							    }
							  });
                            }
						}
                    });
		    }
		});
	});

    modelo.storeConvenios.on('beforeload', function(st){
        st.baseParams.identidad = variables.identidad;
    });

    modelo.storeConvenios.on('load', function(st) {
        vista.btnGestModeloAplicacionConvenio.disable();
        vista.btnAprobarConvenio.disable();
    });
	
    }
}
