Ext.ns('Pvd.Nomina.Configuracion.PlantillaNominal');

//Controlador de la vista del componente Gestionar plantilla nominal.
Pvd.Nomina.Configuracion.PlantillaNominal.Controlador = {
	/**
     * Inicializar el controlador de la vista.
     * 
     * @param idioma Objeto que contiene el idioma de los textos de la IU (Tipo: Object).
     * @param vista Vista del componente Gestionar plantilla nominal (Tipo: Pvd.Nomina.Configuracion.PlantillaNominal.Vista)
     * @param modelo Modelo de la vista del componente Gestionar plantilla nominal (Tipo: Pvd.Nomina.Configuracion.PlantillaNominal.Modelo)
     */
    init: function(idioma, vista, modelo) {
        //modelo.storePlantillaN.load();
        /**
         *Variables generales.
         */
        var variables = {
            identidad : 0,
            idcargo : 0,
            idplantilla : 0,

            accion : 'Add',
            cambio : 0,
            ramal : true,
            ramalinst : true,
            treeCargados : 0,
        };
        this.nodosseleccionados = new Array();

        //Se deshabilitan los botones de la interfaz.
        vista.btnAdicionarPlantillaN.disable();
        vista.btnModificarPlantillaN.disable();
        vista.btnEliminarPlantillaN.disable();
        vista.btnEstructurarPlantillaN.disable();

        //Eventos del objeto del ábol de estructura y composición.
        vista.panelEstEnt.on('estructuraselecionada', function(o, nodo){
            
            //if(nodo.attributes.tipoestructura == 3){
                variables.identidad = nodo.id;
                vista.btnAdicionarPlantillaN.enable();
                modelo.storePlantillaN.load();
                modelo.stCentrosCosto.load();
                modelo.cmbArea.load({params:{idestructura:variables.identidad}});
                vista.btnActualizarCargos.enable();
            /*}else{
                variables.identidad = 0;

                vista.btnAdicionarPlantillaN.enable();
                vista.btnModificarPlantillaN.enable();
                vista.btnEliminarPlantillaN.enable();
                vista.btnEstructurarPlantillaN.enable();
                modelo.cmbArea.load({params:{idestructura:variables.identidad}});
                modelo.storePlantillaN.removeAll();
            }*/
        }); 

        //Eventos del store de plantilla nominal.
        modelo.storePlantillaN.on('beforeload', function(store){

            store.baseParams.identidad = variables.identidad;

            vista.btnModificarPlantillaN.disable();
            vista.btnEliminarPlantillaN.disable();
            vista.btnEstructurarPlantillaN.disable();

            store.removeAll();
        });

        //Eventos del store de estructura de plantilla.
        modelo.storeArbolPlantilla.on('beforeload', function(store){
            store.baseParams.idplantilla = variables.idplantilla;
        });

        //Eventos del store de estructura de restante.
        modelo.storeArbolRest.on('beforeload', function(store){
            store.baseParams.identidad = variables.identidad;
        });

        //Eventos del store de centros de costo.
        modelo.stCentrosCosto.on('beforeload', function(store){
            store.baseParams.idestructura = variables.identidad;
        });

        //Eventos del store de estructura de insertadas.
        modelo.storeArbolInsert.on('beforeload', function(store){
            store.baseParams.identidad = variables.identidad;
            store.baseParams.idplantilla = variables.idplantilla;
        });

        //Evento del boton guardar orden
        vista.btnGuardarOrdenPlantilla.on('click', function(){
            guardarOrdenPlantillaNominal();
        });


        //Eventos del grid de plantilla nominal.
        /*vista.gpPlantillaN.on('rowdblclick', function(e){
            mostrarVentanaModificarPlantillaN();
        }); */
		
	    //Eventos del seleccion model del grid de plantilla nominal.
        vista.smPlantillaN.on('rowselect', function(sm, index, store){
            vista.btnModificarPlantillaN.enable();
            vista.btnEliminarPlantillaN.enable();
            vista.btnEstructurarPlantillaN.enable();

            variables.idplantilla = store.get('idplantillanominal');

            modelo.storeArbolPlantilla.load(vista.ArbolPlantilla.getRootNode());
        });

        //Evennto de selección del arbol de restantes;
        vista.TreeRest.on('checkchange', function(node, checked){
			
			if(!node.isLeaf()){
				node.suspendEvents();
				node.attributes.checked=false;
                node.getUI().toggleCheck(false);
                return false;
			}else{
				if(checked) vista.btnAddestructura.enable();
			}
            /*////Forma en que se seleccionar'ian recursivamente////
            if(vista.TreeRest.getChecked().length>0) 
                vista.btnAddestructura.enable();
            else
                vista.btnAddestructura.disable();
            if(checked == true){
                var aux = (node.getPath()).split('/');
                for(var i=2;i<aux.length;i++){
                    var nes = vista.TreeRest.getNodeById(aux[i]);
                    if(!nes.attributes.checked){
                        variables.ramal=false;
                        nes.attributes.checked=true;
                        nes.getUI().toggleCheck(true);
                    }
                }
                if(variables.ramal){
                    node.cascade(function (n) {
                        if (!n.attributes.checked) {
                            n.attributes.checked = true;
                            n.getUI().toggleCheck(true);
                        }
                    });
                    
                }
            }else{
                node.cascade(function (n) {
                    if (n.attributes.checked) {
                        n.attributes.checked = false;
                        n.getUI().toggleCheck(false);
                    }
                });
                
                if(node.parentNode!=null){
                    var chech=false;
                    node.parentNode.eachChild( function(nod){if(nod.attributes.checked){chech=true;}});
                     
                    if(!chech){
                        node.parentNode.attributes.checked = false;
                        node.parentNode.getUI().toggleCheck(false);
                    }
                }
            }
            variables.ramal=true;*/
        }); 
        
        vista.TreeInsert.on('checkchange', function(node, checked){

            if(vista.TreeInsert.getChecked().length > 0)    
                vista.btnElimestructura.enable();
            else
                vista.btnElimestructura.disable();
            if(checked == true){
                var aux = (node.getPath()).split('/');
                for(var i=2;i<aux.length;i++){
                    var nes = vista.TreeInsert.getNodeById(aux[i]);
                    if(!nes.attributes.checked){
                         variables.ramalinst=false;
                        nes.attributes.checked=true;
                        nes.getUI().toggleCheck(true);
                    }
                }
                if(variables.ramalinst){
                    node.cascade(function (n) {
                        if (!n.attributes.checked) {
                            n.attributes.checked = true;
                            n.getUI().toggleCheck(true);
                        }
                    });
                }
            }else{
                node.cascade(function (n) {
                    if (n.attributes.checked) {
                        n.attributes.checked = false;
                        n.getUI().toggleCheck(false);
                    }
                });
                
                if(node.parentNode!=null){
                    var chech=false;
                    node.parentNode.eachChild( function(nod){if(nod.attributes.checked){chech=true;}});
                    if(!chech){
                        node.parentNode.attributes.checked = false;
                        node.parentNode.getUI().toggleCheck(false);
                    }
                }
            }
            variables.ramalinst=true;
        });

        //Evento de carga del arbol de restantes.
        vista.TreeRest.on('load', function(node){
            if(node.parentNode!=null && node.attributes.checked){
                if(node.hasChildNodes()){
                    node.eachChild( function(node){
                        if(node.attributes.checked!=null){
                            node.attributes.checked=true;
                            node.getUI().toggleCheck(true);
                        }
                    });
                }
            }
        });

        //Eventos del botón adicionar plantilla nominal.
       /* vista.btnAdicionarPlantillaN.setHandler(function(){
            mostrarVentanaAdicionarPlantillaN();
        });*/
        vista.btnAdicionarPlantillaN.on('click', function(){
            mostrarVentanaAdicionarPlantillaN();
        });

        //Eventos del botón modificar plantilla nominal.
        /*vista.btnModificarPlantillaN.setHandler(function(){
            mostrarVentanaModificarPlantillaN();
        });*/
        vista.btnModificarPlantillaN.on('click', function(){
            mostrarVentanaModificarPlantillaN();
        });

        //Eventos del botón eliminar plantilla nominal.
       /* vista.btnEliminarPlantillaN.setHandler(function(){
            eliminarPlantillaNominal();
        });*/
        vista.btnEliminarPlantillaN.on('click', function(){
            eliminarPlantillaNominal();
        });

        //Eventos del botón estructurar plantilla nominal.
        vista.btnEstructurarPlantillaN.on('click', function(){
            mostrarVentanaAddElimEstructP();
        });

        //Eventos del botón sync plantilla nominal.
        vista.btnSincronizarPlantillaN.on('click', function(){
            vista.winEstructuraSyncPlantilla.show();
        });

        //Eventos del botón sync plantilla nominal.
        vista.btnActualizarCargos.on('click', function(){
            actualizarCargosAutomaticamenteEstructura();
        });

        //Sync Plantillas Nominales
        vista.pobjestructurabtnSyncPlantilla.on('uncheckednode', function (sm, nodo) {
            var index = this.nodosseleccionados.indexOf(nodo.attributes.id);
            if (index > -1) {
                this.nodosseleccionados.splice(index, 1);
            }console.info(this.nodosseleccionados);
        }.createDelegate(this));

        vista.pobjestructurabtnSyncPlantilla.on('checkednode', function (sm, nodo) {
            this.nodosseleccionados.push(nodo.attributes.id);
            vista.btnAceptarSyncPlantilla.enable();console.info(this.nodosseleccionados);
        }.createDelegate(this));


        vista.pobjestructurabtnSyncPlantilla.on('estructuraselecionada', function (sm, nodo) {
            vista.btnAceptarSyncPlantilla.enable();

            //}
        }.createDelegate(this));

        vista.btnAceptarSyncPlantilla.on('click', function () {
            if(this.nodosseleccionados.length == 0){
                mostrarMensaje(3, 'Por favor seleccione la(s) estructura(s) a sincronizar');
            }else{
                //Sincronizando las plantillas nominales
                PVD.mostrarMascara('idmasksyncplant', 'Por favor espere...', 'Enviando datos');
                //Enviando datos al servidor.
                Ext.Ajax.request({
                    url: 'sincronizarPlantillasNominales',
                    method:'POST',
                    params:{arrayestructuras : Ext.encode(this.nodosseleccionados),
                            identidad : variables.identidad
                            },
                    callback: function (options,success,response){
                        responseData = Ext.decode(response.responseText);
                        //Ocultando máscara de enviar datos.
                        PVD.ocultarMascara('idmasksyncplant');
                        if(responseData== 'sync'){
                            mostrarMensaje(1, 'Las Plantillas Nominales fueron sincronizadas satisfactoriamente.')
                            vista.btnAceptarSyncPlantilla.disable();
                            vista.winEstructuraSyncPlantilla.hide();
                            modelo.storePlantillaN.reload();
                        }

                    }
                });
            }
        }.createDelegate(this));

        function guardarOrdenPlantillaNominal(){
            if (modelo.storePlantillaN.getModifiedRecords().length > 0) {
                var arrayidplantillanominal = new Array();
                var arrayorden = new Array();
                var datosmodificados = modelo.storePlantillaN.getModifiedRecords();
                for(var i = 0; i < datosmodificados.length; i++){
                    arrayidplantillanominal[i] = datosmodificados[i].data.idplantillanominal;
                    arrayorden[i] = datosmodificados[i].data.orden;
                }
                PVD.mostrarMascara('updtorden', 'Por favor espere...', 'Enviando datos');
                Ext.Ajax.request({
                    url: 'actualizarOrden',
                    params: {
                        arrayidplantillanominal: Ext.encode(arrayidplantillanominal),
                        arrayorden: Ext.encode(arrayorden)
                    },
                    callback: function (options, success, response) {
                        PVD.ocultarMascara('updtorden');
                        var respuesta = Ext.decode(response.responseText);
                        if(respuesta == 'COD-1'){
                            mostrarMensaje(1, 'El orden de las Plantillas Nominales fue actualizado satisfactoriamente.');
                            modelo.storePlantillaN.reload();
                        }
                    }.createDelegate(this)
                });
             }
        }

        function actualizarCargosAutomaticamenteEstructura(){
            //Sincronizando las plantillas nominales
            PVD.mostrarMascara('admaskactcargos', 'Por favor espere...', 'Enviando datos');
            //Enviando datos al servidor.
            Ext.Ajax.request({
                url: 'actualizarCargosAutomaticamenteEstructura',
                method:'POST',
                params:{identidad : variables.identidad
                },
                callback: function (options,success,response){
                    responseData = Ext.decode(response.responseText);
                    //Ocultando máscara de enviar datos.
                    PVD.ocultarMascara('admaskactcargos');
                    if(responseData== 'ACT-1'){
                        mostrarMensaje(1, 'Los cargos fueron actualizados satisfactoriamente.');
                    }
                    modelo.storePlantillaN.reload();
                    modelo.storeArbolPlantilla.load();
                }
            });
        }
		
		//Eventos del botón buscar plantilla nominal.
        /*vista.btnEliminarPlantillaN.setHandler(function(){
            modelo.storePlantillaN.load({params:{textoabuscar:vista.tfBuscarPlantillaN.getValue()}});
        });*/
       /* vista.btnBuscarPlantillaN.on('click', function(){
            modelo.storePlantillaN.load({params:{textoabuscar:vista.tfBuscarPlantillaN.getValue()}});
        });*/
        vista.btnBuscarPlantillaN.setHandler(function(){
            modelo.storePlantillaN.load({params:{textoabuscar:vista.tfBuscarPlantillaN.getValue()}});
        });

        //Eventos del botón cancelar plantilla nominal.
        vista.btnCancelarPlantillaN.on('click', function(){
            vista.ventanaPlantillaN.hide();
        });
        
        //Eventos del botón aplicar plantilla nominal.
        vista.btnAplicarPlantillaN.on('click', function(){
            salvarFormularioPlantillaN(true);
        });

        //Eventos del botón aceptar plantilla nominal.
        vista.btnAceptarPlantillaN.on('click', function(){
            salvarFormularioPlantillaN(false);
        });

        //Eventos del botón cerrar estructurar plantilla.
        vista.btnCerrarEstructP.on('click', function(){
            vista.ventanaEstructuraP.hide();
        });

        //Eventos del botón adicionar estructurar plantilla.
        vista.btnAddestructura.setHandler(function(){
            adicionarEstructuraPlantilla();
        });
        /*vista.btnAddestructura.on('click', function(){
            adicionarEstructuraPlantilla();
        });*/

        //Eventos del botón eliminar estructurar plantilla.
        vista.btnElimestructura.setHandler(function(){
            eliminarEstructuraPlantilla();
        });
       /* vista.btnElimestructura.on('click', function(){
            eliminarEstructuraPlantilla();
        });*/

        //Eventos de campo de denominacion.
        vista.tfDenomPlantillaN.on('change', function(tf, n, o){
            variables.cambio = 1;
        });
		
		//Eventos de campo de codigo.
        vista.tfOrden.on('change', function(tf, n, o){
            variables.cambio = 1;
        });
        vista.tfCodigo.on('change', function(tf, n, o){
            variables.cambio = 1;
        });

        //Eventos de campo de fecha inicio.
        vista.dfFInicioPlantillaN.on('change', function(tf, n, o){
            variables.cambio = 1;
        });

        //Eventos de campo de fecha fin. 
        vista.dfFFinPlantillaN.on('change', function(tf, n, o){
            variables.cambio = 1;
        });

        //Eventos de campo de descripcion. 
        vista.tfDescripPlantillaN.on('change', function(tf, n, o){
            variables.cambio = 1;
        });
		vista.cmboxArea.on('change', function(tf, n, o){
            variables.cambio = 1;
        });

        vista.cmboxCentrosCosto.on('change', function(tf, n, o){
            variables.cambio = 1;
        });

        //Evento de la ventana de adicionar/modificar plantilla nominal.
        vista.ventanaPlantillaN.on('beforeshow', function(ventana){
            vista.formularioPlantillaN.getForm().reset();
            vista.tfDenomPlantillaN.focus(true,500);  
        });

        //Evento de la ventana de estructura de plantilla.
        vista.ventanaEstructuraP.on('beforeshow', function(ventana){
            vista.btnAddestructura.disable();
            vista.btnElimestructura.disable();
            if(variables.treeCargados){
                //modelo.storeArbolRest.removeAll();  
                //modelo.storeArbolInsert.removeAll();      
                modelo.storeArbolRest.load(vista.TreeRest.getRootNode());
                modelo.storeArbolInsert.load(vista.TreeInsert.getRootNode());
            }
            variables.treeCargados = 1 ;  
        });

        vista.ventanaEstructuraP.on('hide', function(ventana){
            modelo.storeArbolPlantilla.load(vista.ArbolPlantilla.getRootNode());
        });

        /**
         * Muestra la ventana de adicionar plantilla nominal.
         */
        function mostrarVentanaAdicionarPlantillaN(){

            vista.ventanaPlantillaN.setTitle(idioma.lbTitleVentAdicionarPlantillaN);
            vista.btnAplicarPlantillaN.show();
            vista.ventanaPlantillaN.show();
            //Actualizar la tabulación deL formulario.
            vista.btnCancelarPlantillaN.setNextElement('idbtnAplicarPlantillaN');
            vista.btnAceptarPlantillaN.setPreviousElement('idbtnAplicarPlantillaN');
            variables.accion = 'Add';
        }

        /**
         * Muestra la ventana de adicionar plantilla nominal.
         */
        function mostrarVentanaModificarPlantillaN(){

            vista.ventanaPlantillaN.setTitle(idioma.lbTitleVentModificarPlantillaN);
            vista.btnAplicarPlantillaN.hide();
            vista.ventanaPlantillaN.show();
            //Actualizar la tabulación deL formulario.
            vista.btnCancelarPlantillaN.setNextElement('idbtnAceptarPlantillaN');
            vista.btnAceptarPlantillaN.setPreviousElement('idbtnCancelarPlantillaN');
            vista.formularioPlantillaN.getForm().loadRecord(vista.smPlantillaN.getSelected());
            variables.accion = 'Mod';
        }

        function mostrarVentanaAddElimEstructP(){
            vista.ventanaEstructuraP.setTitle(idioma.lbTitleVentAddElimEstrucP);
            vista.ventanaEstructuraP.show();
        } 

        /*
         *Función para adicionar/modificar una plantilla nominal.
         */
        function salvarFormularioPlantillaN(boton){

            var urlAction = 'adicionarPlantillaNominal';
            var idplantilla = 0;
            var lbMsgEspera = idioma.lbMsgAdicionarPlantillaN;
            var lbMsgExito = idioma.lbMsgCorrectoAdicionadoPlantillaN;

            if(variables.accion == 'Mod'){
                lbMsgEspera = idioma.lbMsgModificarPlantillaN;
                lbMsgExito = idioma.lbMsgCorrectoModificadoPlantillaN;
                urlAction = 'modificarPlantillaNominal';
                idplantilla = vista.smPlantillaN.getSelected().get('idplantillanominal');
            }
            if(variables.cambio == 0){
                if(variables.accion == 'Mod'){
                    //Se oculta la ventana si no ha sido modificado ningún valor..
                    vista.ventanaPlantillaN.hide(); 
                }else {
                    //Se marcan como obligatorios en caso de presionar aceptar y se encuentren vacíos.
                    vista.tfDenomPlantillaN.markInvalid(idioma.lbErrorCampoVacio);
                    mostrarMensaje(3, idioma.lbErrorFormulario);
                }
            }else{
                //Se verifica si el formulario es válido y si el campo sueldo contiene un valor
                if(vista.formularioPlantillaN.getForm().isValid()){

                    //Se muestra la máscara de espera.
                   PVD.mostrarMascara('idmaskaddmodplant', idioma.lbMsgEsperaEnviarDatos, lbMsgEspera);

                    //Enviando datos al servidor.
                    Ext.Ajax.request({
                        url: urlAction,
                        method:'POST',
                        params:{idplantilla : idplantilla,
                                denominacion : vista.tfDenomPlantillaN.getValue(), 
                                orden : vista.tfOrden.getValue(),
                                codigo : vista.tfCodigo.getValue(),
                                area:vista.cmboxArea.getValue(), 
                                fechainicio : vista.dfFInicioPlantillaN.getRawValue(), 
                                fechafin : vista.dfFFinPlantillaN.getRawValue(), 
                                descripcion : vista.tfDescripPlantillaN.getValue(), 
                                identidad : variables.identidad,
                                idcentrocosto : vista.cmboxCentrosCosto.getValue(),



                        },
                        callback: function (options,success,response){
                            responseData = Ext.decode(response.responseText);

                            //Ocultando máscara de enviar datos.
                            PVD.ocultarMascara('idmaskaddmodplant');
                            if(responseData.codigo == 1){
                                mostrarMensaje(1, lbMsgExito);
                                if(!boton){
                                    vista.ventanaPlantillaN.hide();

                                }else{
                                    vista.tfDenomPlantillaN.focus(true,500);
                                }
                                vista.formularioPlantillaN.getForm().reset();
                                modelo.storePlantillaN.removeAll();
                                modelo.storePlantillaN.load();
                                variables.cambio = 0;
                            }else{
                                if (responseData.codigo)
								  if(variables.accion == 'Add'){
                                    mostrarMensaje(responseData.codigo, 'Ya existe una plantilla nominal con esa denominaci&acute;n');
								  }
                            }
                        }
                    });
                }else{
                    mostrarMensaje(3, idioma.lbErrorFormulario);
                }     
            }
        }

        /*
         *Función para eliminar una plantilla nominal.
         */
        function eliminarPlantillaNominal(){
            //Mostrando el mensaje para aceptar el eliminar.
            mostrarMensaje(2,idioma.lbTitleEliminarPlantillaN,function(btn){
                if(btn == "ok"){
                    //Se muestra la máscara de espera.
                    PVD.mostrarMascara('idmaskeleminarplantilla',idioma.lbMsgEsperaEnviarDatos,idioma.lbMsgEliminarPlantillaN);                    
                    //Enviando los datos al servidor.
                    Ext.Ajax.request({
                        url: 'eliminarPlantillaNominal',
                        method:'POST',
                        params: {idplantilla:vista.smPlantillaN.getSelected().get('idplantillanominal')},
                        callback: function (options,success,response){
                            //Se oculta la máscara de espera.
                            PVD.ocultarMascara('idmaskeleminarplantilla');                                 
                            responseData = Ext.decode(response.responseText);
                            if(responseData.codigo==1){
                                //Mostrando el mensaje de que se ha eliminado.
                                mostrarMensaje(1, idioma.lbMsgCorrectoEliminadoPlantillaN);
                                //Recargando el grid.
                                modelo.storePlantillaN.load();
                            }else{
							    mostrarMensaje(3, "La plantilla nominal no puede ser eliminada porque esta siendo usada");
							}   
                        }           
                    });
                }
            });
        }
		
		/*
		 * Funcion recursiva que busca en todo el arbol y devuelve los cargos seleccionados 
		 * */
		function buscarNodosMarcados(nodo, arraynoselec){
			if(nodo.isLeaf() && nodo.attributes.checked == true){
				arraynoselec.push(nodo.id);
			}else{
				for(var i = 0; i < nodo.childNodes.length; i++)
					buscarNodosMarcados(nodo.childNodes[i], arraynoselec);
			}
		}

        /*
         * Función para adicionar una estructura plantilla nominal.
         */
        function adicionarEstructuraPlantilla(){
            var arraynoselec=new Array();
            var raiz = vista.TreeRest.getNodeById(variables.identidad);
            buscarNodosMarcados(raiz, arraynoselec);
            
            /*.cascade(function (n) {
                if (!n.attributes.checked && n.attributes.checked == true && n.isLeaf()) {
                    arraynoselec.push(parseInt(n.id));
                }
            });*/
            //Se muestra la máscara de espera.
            PVD.mostrarMascara('idmaskaddestrucplant', idioma.lbMsgEsperaEnviarDatos, idioma.lbMsgAddEstructuraP);
            
            Ext.Ajax.request({
                url: 'adicionarEstructuraPlantillaNominal',
                method:'POST',
                params:{idplantilla : variables.idplantilla, 
                        identidad : variables.identidad, 
                        array:Ext.encode(arraynoselec)
                },
                callback: function (options,success,response){
                        responseData = Ext.decode(response.responseText);
                        //Ocultando máscara de enviar datos.
                        PVD.ocultarMascara('idmaskaddestrucplant');
                        if(responseData.codigo == 1){
                            mostrarMensaje(1, idioma.lbMsgCorrectoAddEstructuraP, function(){
                                vista.btnAddestructura.disable();
                                vista.btnElimestructura.disable();
                                modelo.storeArbolRest.load(vista.TreeRest.getRootNode());
                                modelo.storeArbolInsert.load(vista.TreeInsert.getRootNode());
                            });
                            
                        }else{
                            if (responseData.codigo)
                                mostrarMensaje(responseData.codigo, responseData.mensaje);
                        }
                }
            });

        }

        /*
         * Función para eliminar una estructura plantilla nominal.
         */
        function eliminarEstructuraPlantilla(){ 
        
            var array=new Array();
            vista.TreeInsert.getRootNode().cascade(function (n) {
                if (n.attributes.checked && (n.attributes.tipoestructura==7)) {
                    array.push(parseInt(n.id));
                }
            });

            //Se muestra la máscara de espera.
            PVD.mostrarMascara('idmaskeleminarestrucplant',idioma.lbMsgEsperaEnviarDatos,idioma.lbMsgEliminarEstructuraP);                    
            //Enviando los datos al servidor.
            Ext.Ajax.request({
                url: 'eliminarEstructuraPlantillaNominal',
                method:'POST',
                params: {idplantilla : variables.idplantilla, 
                        array:Ext.encode(array)
                    },
                callback: function (options,success,response){
                    //Se oculta la máscara de espera.
                    PVD.ocultarMascara('idmaskeleminarestrucplant');                                 
                    responseData = Ext.decode(response.responseText);
                    if(responseData.codigo){
                        //Mostrando el mensaje de que se ha eliminado.
                        mostrarMensaje(1, idioma.lbMsgCorrectoEliminadoEstructuraP, function(btn){
                            vista.btnAddestructura.disable();
                            vista.btnElimestructura.disable();
                            modelo.storeArbolRest.load(vista.TreeRest.getRootNode());
                            modelo.storeArbolInsert.load(vista.TreeInsert.getRootNode());
                        });
                    }   
                }           
            });
        }

        /**
         *Teclas calientes de la interfaz.
         */
        this.keyMap = new Ext.KeyMap(Ext.getDoc(), [{
            key: 'imh',
            alt: true,
            stopEvent: true,
            handler: function(k, e) {
                switch(k) {
                    case 73:{ //i para adicionar.
                        if(!vista.btnAdicionarPlantillaN.disabled){
                            vista.btnAdicionarPlantillaN.fireEvent('click');
                        }
                        break;
                    }
                    case 77:{ //m para modificar .
                        if(!vista.btnModificarPlantillaN.disabled){
                            vista.btnModificarPlantillaN.fireEvent('click');

                        }
                        break;
                    }
                    case 72:{ //h para ayuda.
                            vista.btnAyudaPlantillaN.focus();
                            vista.btnAyudaPlantillaN.fireEvent('click');
                        break;
                    }
                }
            }
        },{
            key: 46,//del para eliminar.
            fn: function(){if(!vista.btnEliminarPlantillaN.disabled){
                vista.btnEliminarPlantillaN.fireEvent('click');
            }}
        },{
            key: 13,//enter para aceptar.
            fn: function(){if(vista.btnAceptarPlantillaN.isVisible()){
                vista.btnAceptarPlantillaN.focus();
                vista.btnAceptarPlantillaN.fireEvent('click');
            }}
        }
        ]);
    }
}
