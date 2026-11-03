Ext.ns('Pvd.Nomina.Configuracion.ModeloNomina');

//Controlador de la vista del componente Configurar modelo nomina.
Pvd.Nomina.Configuracion.ModeloNomina.Controlador = {
	/**
     * Inicializar el controlador de la vista.
     * 
     * @param idioma Objeto que contiene el idioma de los textos de la IU (Tipo: Object).
     * @param vista Vista del componente Configurar modelo nomina (Tipo: Pvd.Nomina.Configuracion.ModeloNomina.Vista)
     * @param modelo Modelo de la vista del componente Configurar modelo nomina (Tipo: Pvd.Nomina.Configuracion.ModeloNomina.Modelo)
     */
    init: function(idioma, vista, modelo) {
        /**
         *Variables generales.
         */
        var variables = {
            
        };
        
        vista.btnActualizarConfM.disable();
        vista.ventanaConfM.show();
        vista.ventanaConfM.hide();

        modelo.storeModeloN.load();
        modelo.storeTipoPago.load();
        modelo.storeCategoriaPersona.load();
        
        //Eventos del store de configuracion de modelos de nomina.
        modelo.storeModeloN.on('beforeload', function(store){
            vista.btnActualizarConfM.disable();
            vista.btnEliminar.disable();
            store.removeAll();
        }); 

        //Eventos del seleccion model del grid de configuracion de modelos de nomina.
        vista.smConfM.on('rowselect', function(){
            vista.btnActualizarConfM.enable();
            vista.btnEliminar.enable();
        });

        //Eventos del grid de configuracion de modelos de nomina.
        vista.gpConfM.on('rowdblclick', function(e){
            mostrarVentanaGestionarConfigM();
        }); 

        //Eventos del botón adicionar/modificar y eliminar.
        /*vista.btnActualizarConfM.on('click', function(){
            mostrarVentanaGestionarConfigM();
        });*/
        vista.btnActualizarConfM.setHandler(function(){
            mostrarVentanaGestionarConfigM();
        });

        vista.btnEliminar.on('click', function(){
            eliminarModeloNomina();
        });

        function eliminarModeloNomina(){
            mostrarMensaje(2, '¿Est&aacute; seguro que desea eliminar la configuraci&oacute;n seleccionada?', function (btn) {
                if (btn == 'ok') {
                    //Se muestra la máscara de espera.
                    PVD.mostrarMascara('idmask', 'Enviando datos...', 'Por favor espere');
                    //Enviando los datos al servidor.
                    Ext.Ajax.request({
                        url     : 'eliminarConfModeloNomina',
                        method  : 'POST',
                        params  : {idconfmodelonomina: vista.gpConfM.getSelectionModel().getSelected().get('idconfmodelonomina')},
                        callback: function (options, success, response) {
                            //Se oculta la máscara de espera.
                            PVD.ocultarMascara('idmask');
                            responseData = Ext.decode(response.responseText);
                            if (responseData == 'ok') {
                                //Mostrando el mensaje de que se ha el tipo de nómina.
                                mostrarMensaje(1, 'La configuraci&oacute;n fue eliminada satisfactoriamente');
                                //Recargando el grid de tipos de nómina.
                                modelo.storeModeloN.reload();
                            } else if (responseData == 'mod-nom-en-uso'){
                                mostrarMensaje(3, 'La configuracion que desea eliminar esta en uso en las Nominas');
                            }else if (responseData == 'no-tipo-pago'){
                                mostrarMensaje(3, 'Por favor seleccione un tipo de Nomina que tenga un Tipo de Pago configurado.');
                            }else {
                                if (responseData.codigo)
                                    mostrarMensaje(responseData.codigo, 'La configuraci&oacute;n no pudo ser eliminada satisfactoriamente');
                            }
                        }
                    });
                }
            });
        }

        //Evento de la ventana de adicionar/modificar tipos de conceptos de percepciones y descuentos.
        vista.ventanaConfM.on('beforeshow', function(ventana){
            vista.formularioConfM.getForm().reset();
            vista.cbTipoPago.focus(true,500);  
        });

         //Eventos del botón cancelar y aceptar.
        vista.btnCancelarConfM.on('click', function(){
            vista.ventanaConfM.hide();
        });
        
        vista.btnAceptarConfM.on('click', function(){
            salvarFormularioActualizarConfigM();
        });
		
		vista.btnRecargarConf.on('click', function(){
		    modelo.storeModeloN.load();
            modelo.storeTipoPago.load();
            modelo.storeCategoriaPersona.load();
		});

        /**
         * Función para mostrar la ventana de gestionar la config de los modelos de nomina.
         */
        function mostrarVentanaGestionarConfigM(){
            vista.ventanaConfM.setTitle(idioma.lbTitleVentGestionarConfigM);
            vista.ventanaConfM.show();
            if(vista.smConfM.getSelected().get('idconfmodelonomina')){      
                vista.cbTipoPago.setValue(vista.smConfM.getSelected().get('idtipopago'));
                vista.smCategPersona.clearSelections();
                var array = vista.smConfM.getSelected().get('arrayCateg');
                var aux =new Array();
                for (var i =  0; i<array.length; i++) {
                    var data = modelo.storeCategoriaPersona.getById( array[i] );
                    aux.push(data);
                }
                vista.gpCategPersona.getSelectionModel().selectRecords(aux);
            }
        }

        /**
         * Función para actualizar la configuración de los modelos de nómina.
         */
        function salvarFormularioActualizarConfigM(){

            //Categorías seleccionadas.
            var select = vista.smCategPersona.getSelections();
            var longitud = select.length;

            if(!longitud){
                mostrarMensaje(3, idioma.lbErrorCategVacia);
            }else{
                var valoresConfig = new Array();

                //Se recorre el arreglo y se obtienen los valores modificados.
                for(var i=0; i<longitud; i++){
                    valoresConfig.push(select[i].data.idcategoriapersona);
                }

                if(vista.formularioConfM.getForm().isValid()){
                    //Se muestra la máscara de espera.
                    PVD.mostrarMascara('idmaskactualizarconfm', idioma.lbMsgEsperaEnviarDatos, idioma.lbMsgActualizarConfM);

                    var select = vista.smConfM.getSelected();

                    //Enviando datos al servidor.
                    Ext.Ajax.request({
                        url: 'actualizarModelosNomina',
                        method:'POST',
                        params:{idtipopago :  vista.cbTipoPago.getValue(),
                                idtiponomina :  select.get('idtiponomina'),
                                idconfig :  select.get('idconfmodelonomina'),
                                categorias :  Ext.encode(valoresConfig)
                        },
                        callback: function (options,success,response){
                            responseData = Ext.decode(response.responseText);

                            //Ocultando máscara de enviar datos.
                            PVD.ocultarMascara('idmaskactualizarconfm');

                            if(responseData.codMsg == 1){
                                mostrarMensaje(1, idioma.lbMsgCorrectoActualizarConfM, function(){
                                    vista.ventanaConfM.hide();
                                    vista.formularioConfM.getForm().reset();
                                    modelo.storeModeloN.removeAll();
                                    modelo.storeModeloN.load();
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
    }
}