Ext.ns('Pvd.Nomina.Configuracion.VariableGlobal');

//Controlador de la vista del componente Configurar variables globales.
Pvd.Nomina.Configuracion.VariableGlobal.Controlador = {
	/**
     * Inicializar el controlador de la vista.
     * 
     * @param idioma Objeto que contiene el idioma de los textos de la IU (Tipo: Object).
     * @param vista Vista del componente Configurar variables globales (Tipo: Pvd.Nomina.Configuracion.VariableGlobal.Vista).
     * @param modelo Modelo de la vista del componente Configurar variables globales (Tipo: Pvd.Nomina.Configuracion.VariableGlobal.Modelo)
     */
    init: function(idioma, vista, modelo) {
        /**
         *Variables generales.
         */
        var variables = {
            identidad : 0,
            idcargo : 0,
        };

        //Se carga el modelo de nivel de configuración a nivel de sistema.
        modelo.storeGpNivelSist.load();

        //Se deshabilita el botón de guardar entidad y cargo.
        vista.btnGuardarNEnt.disable();
        vista.btnGuardarNCargo.disable();

        //Se deshabilita el grid de entidad y cargo.
        vista.gpNivelCargo.disable();
        vista.gpNivelEnt.disable();

        /**
         * Eventos del tab de nivel sistema.
         */

         //Eventos del store de variables globales a nivel de sistema.
        modelo.storeGpNivelSist.on('load', function(store){
            vista.btnGuardarNSist.disable();
        }); 

         //Eventos del grid de variables globales a nivel de sistema.
        vista.gpNivelSist.on('afteredit', function(e){
            vista.btnGuardarNSist.enable();
        });

        //Eventos del botón guardar variables globales a nivel de sistema.
        vista.btnGuardarNSist.setHandler(function(){
            guardarConfigVariablesGlobales(false, false);
        });
       /* vista.btnGuardarNSist.on('click', function(){
            guardarConfigVariablesGlobales(false, false);
        });*/

        /**
         * Eventos del tab de nivel entidad.
         */

        //Eventos del store de variables globales a nivel de entidad.
        modelo.storeGpNivelEnt.on('load', function(store){
            vista.btnGuardarNEnt.disable();
        }); 

        modelo.storeGpNivelEnt.on('beforeload', function(store){
            store.baseParams.identidad = variables.identidad;
            vista.btnGuardarNEnt.disable();
        }); 

        //Eventos del grid de variables globales a nivel de entidad.
        vista.gpNivelEnt.on('afteredit', function(e){
            vista.btnGuardarNEnt.enable();
        });

        //Eventos del botón guardar variables globales a nivel de entidad.
        vista.btnGuardarNEnt.setHandler(function(){
            guardarConfigVariablesGlobales(true, false);
        });
       /* vista.btnGuardarNEnt.on('click', function(){
            guardarConfigVariablesGlobales(true, false);
        });*/

        //Eventos del objeto del ábol de entidades.
        vista.panelEstEnt.on('estructuraselecionada', function(o, nodo){
            
            //if(nodo.attributes.tipoestructura == 3){
                variables.identidad = nodo.id;
                vista.gpNivelEnt.enable();
                modelo.storeGpNivelEnt.load();
            /*}else{
                variables.identidad = null;
                vista.gpNivelEnt.disable();
                vista.btnGuardarNEnt.disable();
                modelo.storeGpNivelEnt.rejectChanges();
                modelo.storeGpNivelEnt.removeAll();
            }*/

        }); 

        /**
         * Eventos del tab de nivel cargo.
         */
        
        //Eventos del store de variables globales a nivel de cargo.
        modelo.storeGpNivelCargo.on('load', function(store){
            vista.btnGuardarNCargo.disable();
        }); 

        modelo.storeGpNivelCargo.on('beforeload', function(store){
            store.baseParams.idcargo = variables.idcargo;
            vista.btnGuardarNCargo.disable();
        });

        //Eventos del grid de variables globales a nivel de cargo.
        vista.gpNivelCargo.on('afteredit', function(e){
            vista.btnGuardarNCargo.enable();
        });
        
        //Eventos del botón guardar variables globales a nivel de cargo.
        vista.btnGuardarNCargo.setHandler(function(){
            guardarConfigVariablesGlobales(false, true);
        });
      /*  vista.btnGuardarNCargo.on('click', function(){
            guardarConfigVariablesGlobales(false, true);
        });*/

        //Eventos del objeto del ábol de cargos.
        vista.panelEstCargo.on('estructuraselecionada', function(o, nodo){

            if(nodo.attributes.tipoestructura == 7){
                variables.idcargo = nodo.id;
                vista.gpNivelCargo.enable();
                modelo.storeGpNivelCargo.load();
            }else{
                variables.idcargo = null;
                vista.gpNivelCargo.disable();
                vista.btnGuardarNCargo.disable();
                modelo.storeGpNivelCargo.rejectChanges();
                modelo.storeGpNivelCargo.removeAll();
            }

        }); 
         
        //Eventos del tab panel general.
        vista.tabPanelConfigVar.on('tabchange', function(tabPanel, tab){
            if(tab.id =='idtabentidad'){
                vista.panelEstEnt.doLayout();
            }
            if(tab.id =='idtabcargo'){
                vista.panelEstCargo.doLayout();
            }
        })
        /*
         *Función para guardar la configuración.
         */
        function guardarConfigVariablesGlobales(entidad, cargo){

            var valoresConfig = new Array();
            var identidad;
            var idcargo;
            var lbMsgEspera;
            var lbMsgExisto;

            if(entidad){
                //Se obtienen los registros modificados en el store de entidad.
                var recordsModificados = modelo.storeGpNivelEnt.getModifiedRecords();
                identidad = variables.identidad;
                lbMsgEspera = idioma.lbMsgGuardarNivelEnt;
                lbMsgExisto = idioma.lbMsgCorrectoGuardarNivelEnt;
            }else{
                if(cargo){
                    //Se obtienen los registros modificados en el store de cargo.
                    var recordsModificados = modelo.storeGpNivelCargo.getModifiedRecords();
                    idcargo = variables.idcargo;
                    lbMsgEspera = idioma.lbMsgGuardarNivelCargo;
                    lbMsgExisto = idioma.lbMsgCorrectoGuardarNivelCargo;
                }else{
                    //Se obtienen los registros modificados en el store de sistema.
                    var recordsModificados = modelo.storeGpNivelSist.getModifiedRecords();
                    lbMsgEspera = idioma.lbMsgGuardarNivelSist;
                    lbMsgExisto = idioma.lbMsgCorrectoGuardarNivelSist;
                }
            }
            
            //Longitud del arrglo.
            var longitud = recordsModificados.length;

            //Se recorre el arreglo y se obtienen los valores modificados.
            for(var i=0;i<longitud;i++){
                var aux = {
                    idvariableglobalvalor : recordsModificados[i].data.idvariableglobalvalor,
                    idvariableglobal : recordsModificados[i].data.idvariableglobal,
                    valor : recordsModificados[i].data.valor
                };

                valoresConfig.push(aux);
            }

            //Se muestra la máscara de espera.
            PVD.mostrarMascara('idmaskguardarconfig', idioma.lbMsgEsperaEnviarDatos, lbMsgEspera);

            Ext.Ajax.request({
                url: 'guardarConfigVariablesGlobales',
                method:'POST',
                params:{ 
                    identidad :  identidad,
                    idcargo :  idcargo,
                    valoresConfig :  Ext.encode(valoresConfig)
                },
                callback: function (options,success,response){
                    responseData = Ext.decode(response.responseText);

                    //Ocultando máscara de enviar datos.
                    PVD.ocultarMascara('idmaskguardarconfig');

                    if(responseData.codigo == 1){
                        mostrarMensaje(1, lbMsgExisto);
                            if(entidad){
                                modelo.storeGpNivelEnt.rejectChanges();
                                modelo.storeGpNivelEnt.removeAll();
                                modelo.storeGpNivelEnt.load();
                            }else{
                                if(cargo){
                                    modelo.storeGpNivelCargo.rejectChanges();
                                    modelo.storeGpNivelCargo.removeAll();
                                    modelo.storeGpNivelCargo.load();
                                }else{
                                    modelo.storeGpNivelSist.rejectChanges();
                                    modelo.storeGpNivelSist.removeAll();
                                    modelo.storeGpNivelSist.load();
                                }
                            }
                        
                        
                    }else{
                        if (responseData.codigo)
                            mostrarMensaje(responseData.codigo, responseData.mensaje);
                    }
                }
            });
        }
        /*//Teclas calientes de la interfaz
        this.keyMap = this.controlador.keyMap;

        /!**
         *Teclas calientes de la interfaz.
         *!/
        this.keyMap = new Ext.KeyMap(Ext.getDoc(), [{
            key: 'imh',
            alt: true,
            stopEvent: true,
            handler: function(k, e) {
                switch(k) {
                    case 71:{ //g para guardar
                        if(!vista.btnGuardarNSist.disabled && !vista.btnGuardarNSist.isVisible()){
                            vista.btnGuardarNSist.fireEvent('click');
                        }

                        break;
                    }
                }
            }
        }]);*/

    }
}