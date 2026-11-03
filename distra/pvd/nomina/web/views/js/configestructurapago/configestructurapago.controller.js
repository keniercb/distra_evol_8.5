Ext.ns('Pvd.Nomina.Pago.Retencion');

//Controlador de la vista del componente Gestionar retenciones.
Pvd.Nomina.Pago.Retencion.Controlador = {
	/**
     * Inicializar el controlador de la vista.
     * 
     * @param idioma            Objeto que contiene el idioma de los textos de la IU (Tipo: Object).
     * @param vista             Vista general del componente Gestionar retenciones (Tipo: Pvd.Nomina.Pago.Retencion.Vista)
     * @param modelo            Modelo de la vista del componente Gestionar retenciones (Tipo: Pvd.Nomina.Pago.Retencion.Modelo)
     */
    init: function(idioma, vista, modelo) {

        var variablesGenerales = {
            identidad : 0,
            idpersona : 0,
            accion : 'Add',
            cambio : 0,
        };

        vista.winEstructura.show();

        //Se deshabilitan los botones de gestionar retenciones.
        vista.btnAdicionarRetenc.disable();
        vista.btnModificarRetenc.disable();
        vista.btnEliminarRetenc.disable();

        //Evento del componente de entidades
        vista.pobjestructura.on('estructuraselecionada',function(sm, nodo){
            //if(nodo.attributes.tipoestructura == 3){
                vista.btnAceptarEntidad.enable();
                variablesGenerales.identidad = nodo.id;
                //vista.pbuscarpersona.CambiarEntidad(this.identidad);
            //}
        }.createDelegate(this));
        
        //Evento del botón de estructuras.
        vista.btnAceptarEntidad.on('click', function(){
            vista.winGestRetenciones.show();
            modelo.storePersona.load({params:{limit:25, start:0}});
            modelo.storeTipoRetencion.load();
        }.createDelegate(this));
        
        /*vista.winMostrarConfElementosSalariales.on('show', function(){
            
        });*/
        
        //Eventos del store de listado de persona.
        modelo.storePersona.on('beforeload', function(store){
            store.baseParams.identidad = variablesGenerales.identidad;
            //Se deshabilitan los botones y se limpia el store de retenciones.
            vista.btnAdicionarRetenc.disable();
            vista.btnModificarRetenc.disable();
            vista.btnEliminarRetenc.disable();
            modelo.storeRetenc.removeAll();
        }); 

        //Eventos del grid de persona.
        vista.smPersona.on('rowselect', function(sm, index, store){
            //Se obtiene el id de la persona.
            variablesGenerales.idpersona = store.get('idpersona');

            //Se habilita el adicionar y se carga el store de retenciones.
            vista.btnAdicionarRetenc.enable();
            modelo.storeRetenc.load({params:{limit:10, start:0}});
        });

        //Eventos del store de retenciones de una persona.
        modelo.storeRetenc.on('beforeload', function(store){
            store.baseParams.identidad = variablesGenerales.identidad;
            store.baseParams.idpersona = variablesGenerales.idpersona;
            //Se deshabilitan los botones y se limpia el store de retenciones.
            vista.btnModificarRetenc.disable();
            vista.btnEliminarRetenc.disable();
            store.removeAll();
        }); 

         //Eventos del grid de retenciones.
        vista.gpRetenc.on('rowdblclick', function(e){
            mostrarVentanaModificarRetenc();
        }); 

        vista.smRetenc.on('rowselect', function(sm, index, store){
            //Se deshabilitan los botones de mod/elim.
            vista.btnModificarRetenc.enable();
            vista.btnEliminarRetenc.enable();
        });

        //Eventos de los campos de gestionar retenciones de persona. 
        vista.cbTipoRetenc.on('change', function(tf, n, o){
            variablesGenerales.cambio = 1;
        });

        vista.tfSaldoInicial.on('change', function(tf, n, o){
            variablesGenerales.cambio = 1;
        });

        vista.tfMensualidad.on('change', function(tf, n, o){
            variablesGenerales.cambio = 1;
        });

        vista.tfUMensualidad.on('change', function(tf, n, o){
            variablesGenerales.cambio = 1;
        });

        vista.tfReferencia.on('change', function(tf, n, o){
            variablesGenerales.cambio = 1;
        });

        vista.dfFDocumento.on('change', function(tf, n, o){
            variablesGenerales.cambio = 1;
        });

        vista.dfFInicioRetenc.on('change', function(tf, n, o){
            variablesGenerales.cambio = 1;
        });

        vista.dfFFinRetenc.on('change', function(tf, n, o){
            variablesGenerales.cambio = 1;
        });

        //Eventos de los botones de add/mod/elim retenciones.
        vista.btnAdicionarRetenc.on('click', function(){
            mostrarVentanaAdicionarRetencion();
        });
        
        vista.btnModificarRetenc.on('click', function(){
            mostrarVentanaModificarRetenc();
        });

        vista.btnEliminarRetenc.on('click', function(){
            eliminarRetencion();
        });


        //Eventos del botón cancelar.
        vista.btnCancelarRetenc.on('click', function(){
            vista.ventanaRetenc.hide();
        });
        
        //Eventos del botón aplicar.
        vista.btnAplicarRetenc.on('click', function(){
            salvarFormularioRetencion(true);
        });

        //Eventos del botón aceptar.
        vista.btnAceptarRetenc.on('click', function(){
            salvarFormularioRetencion(false);
        });

        vista.ventanaRetenc.on('beforeshow', function(ventana){
            vista.formularioRetenc.getForm().reset();
            vista.cbTipoRetenc.focus(true, 500);  
        });

        function mostrarVentanaAdicionarRetencion(){

            vista.ventanaRetenc.setTitle(idioma.lbTitleVentAdicionarRetenc);
            vista.btnAplicarRetenc.show();
            vista.ventanaRetenc.show();

            //Actualizar la tabulación deL formulario.
            vista.btnCancelarRetenc.setNextElement('idbtnAplicarRetenc');
            vista.btnAceptarRetenc.setPreviousElement('idbtnAplicarRetenc');
            variablesGenerales.accion = 'Add';
        }

        function mostrarVentanaModificarRetenc(){

            vista.ventanaRetenc.setTitle(idioma.lbTitleVentModificarConcepto);
            vista.btnAplicarRetenc.hide();
            vista.ventanaRetenc.show();
            //Actualizar la tabulación deL formulario.
            vista.btnCancelarRetenc.setNextElement('idbtnAceptarRetenc');
            vista.btnAceptarRetenc.setPreviousElement('idbtnCancelarRetenc');
            vista.formularioRetenc.getForm().loadRecord(vista.smRetenc.getSelected());
            variablesGenerales.accion = 'Mod';
        }

        function salvarFormularioRetencion(boton){

            var urlAction = 'adicionarRetencionPersona';
            var idretencionpersona = 0;
            var lbMsgEspera = idioma.lbMsgAdicionarRetenc;
            var lbMsgExito = idioma.lbMsgCorrectoAdicionarRetenc;

            if(variablesGenerales.accion == 'Mod'){
                lbMsgEspera = idioma.lbMsgModificarRetenc;
                lbMsgExito = idioma.lbMsgCorrectoModificadoRetenc;
                urlAction = 'modificarRetencionPersona';
                idretencionpersona = vista.smRetenc.getSelected().get('idretencionpersona');
            }
            if(variablesGenerales.cambio == 0){
                if(variablesGenerales.accion == 'Mod'){
                    //Se oculta la ventana si no ha sido modificado ningún valor.
                    vista.ventanaRetenc.hide(); 
                }else {
                    //Se marcan como obligatorios en caso de presionar aceptar y se encuentren vacíos.
                    vista.cbTipoRetenc.markInvalid(idioma.lbErrorCampoVacio);
                    vista.tfSaldoInicial.markInvalid(idioma.lbErrorCampoVacio);
                    vista.tfMensualidad.markInvalid(idioma.lbErrorCampoVacio);
                    vista.tfUMensualidad.markInvalid(idioma.lbErrorCampoVacio);
                    vista.tfReferencia.markInvalid(idioma.lbErrorCampoVacio);
                    mostrarMensaje(3, idioma.lbErrorFormulario);
                }
            }else{
                //Se verifica si el formulario es válido.
                if(vista.formularioRetenc.getForm().isValid()){

                    //Se muestra la máscara de espera.
                    PVD.mostrarMascara('idmaskaddmodretenc', idioma.lbMsgEsperaEnviarDatos, lbMsgEspera);

                    //Enviando datos al servidor.
                    Ext.Ajax.request({
                        url: urlAction,
                        method:'POST',
                        params:{idretencionpersona : idretencionpersona,
                                tiporetenc : vista.cbTipoRetenc.getValue(), 
                                saldoinicial : vista.tfSaldoInicial.getValue(), 
                                mensualidad : vista.tfMensualidad.getValue(),
                                ultmensualidad : vista.tfUMensualidad.getValue(),
                                referencia : vista.tfReferencia.getValue(),
                                fechadoc : vista.dfFDocumento.getRawValue(), 
                                fechainicio : vista.dfFInicioRetenc.getRawValue(), 
                                fechafin : vista.dfFFinRetenc.getRawValue(), 
                                idpersona : variablesGenerales.idpersona,
                                identidad : variablesGenerales.identidad,
                        },
                        callback: function (options,success,response){
                            responseData = Ext.decode(response.responseText);

                            //Ocultando máscara de enviar datos.
                            PVD.ocultarMascara('idmaskaddmodretenc');

                            if(responseData.codMsg == 1){
                                mostrarMensaje(1, lbMsgExito, function(){
                                    if(!boton){
                                        vista.ventanaRetenc.hide();

                                    }else{
                                         vista.cbTipoRetenc.focus(true,500);  
                                    }
                                    vista.formularioRetenc.getForm().reset();
                                    modelo.storeRetenc.removeAll();
                                    modelo.storeRetenc.load({params:{limit:10, start:0}});
                                    variablesGenerales.cambio = 0;
                                });
                                
                            }else{
                                if (responseData.codMsg)
                                    mostrarMensaje(responseData.codMsg, responseData.mensaje);
                            }
                        }
                    });
                }else{
                    mostrarMensaje(3, idioma.lbErrorFormulario);
                }     
            }
        }

        /*
         *Función para eliminar una retención de una persona.
         */
        function eliminarRetencion(){
            //Mostrando el mensaje para aceptar la eliminar.
            mostrarMensaje(2,idioma.lbTitleEliminarRetenc,function(btn){
                if(btn == "ok"){

                    //Se muestra la máscara de espera.
                    PVD.mostrarMascara('idmaskeleminarretenc',idioma.lbMsgEsperaEnviarDatos, idioma.lbMsgEliminarRetenc);                    

                    //Enviando los datos al servidor.
                    Ext.Ajax.request({
                        url: 'eliminarRetencionPersona',
                        method:'POST',
                        params: {idretencionpersona : vista.smRetenc.getSelected().get('idretencionpersona')},
                        callback: function (options,success,response){
                            //Se oculta la máscara de espera.
                            PVD.ocultarMascara('idmaskeleminarretenc');                                 
                            responseData = Ext.decode(response.responseText);
                            if(responseData.codMsg){
                                //Mostrando el mensaje de que se ha eliminado.
                                mostrarMensaje(1, idioma.lbMsgCorrectoEliminadoRetenc, function(btn){
                                    //Recargando el grid de estructura escalar adyacente.
                                    modelo.storeRetenc.load({params:{limit:10, start:0}});
                                });
                            }   
                        }           
                    });
                }
            });
        }
    }
}
