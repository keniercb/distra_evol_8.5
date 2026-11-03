Ext.ns('Pvd.Nomina.Recuperacion.Partidagasto');

//Controlador de la vista del componente Gestionar plantilla nominal.
Pvd.Nomina.Recuperacion.Partidagasto.Controlador = {
	/**
     * Inicializar el controlador de la vista.
     * 
     * @param idioma Objeto que contiene el idioma de los textos de la IU (Tipo: Object).
     * @param vista Vista del componente Gestionar plantilla nominal (Tipo: Pvd.Nomina.Configuracion.PlantillaNominal.Vista)
     * @param modelo Modelo de la vista del componente Gestionar plantilla nominal (Tipo: Pvd.Nomina.Configuracion.PlantillaNominal.Modelo)
     */
    init: function(idioma, vista, modelo) {
        /**
         *Variables generales.
         */
        var variables = {
            identidad : 0,
            idcargo : 0,
            idplantilla : 0,
            formulario:0,
            accion : 'Add',
            cambio : 0,
            ramal : true,
            ramalinst : true,
            treeCargados : 0,
        };
        vista.ventanaConcepto.show();
        //Se deshabilitan los botones de la interfaz.
        vista.btnAdicionarPlantillaN.disable();

        //Eventos del objeto del ábol de estructura y composición.
        vista.panelEstEnt.on('estructuraselecionada', function(o, nodo){
            
            //if(nodo.attributes.tipoestructura == 3){
                variables.identidad = nodo.id;
                vista.btnAdicionarPlantillaN.enable();
               // modelo.storePlantillaN.load();
            /*}else{
                /!*variables.identidad = 0;
                vista.btnAdicionarPlantillaN.enable();
                vista.btnModificarPlantillaN.enable();
                vista.btnEliminarPlantillaN.enable();
                vista.btnEstructurarPlantillaN.enable();*!/
                modelo.storePlantillaN.removeAll();
            }*/
        });

        vista.btnAdicionarPlantillaN.on('click', function(){
            //vista.ventanaConcepto.show();
            if(variables.identidad != null){
                vista.objListarPeriodosPagos.CambiarEntidad(variables.identidad);
                var titulo = vista.winPeriodosPagos.title + ' -  ' + variables.denominacionentidad;
                vista.winPeriodosPagos.setTitle(titulo);
                vista.winPeriodosPagos.show();
            }

        });
       /* vista.btnCancelarConcepto.on('click', function(){
            vista.ventanaConcepto.hide();

        });*/

        vista.btnAceptarConcepto.on('click', function(){
           // vista.ventanaConcepto.hide();
            variables.formulario = vista.formularioConcepto.getForm().getValues().tipo;
          //  vista.ventanapartida.show();
            vista.ventanapartida.show();
            vista.ventanapartida.maximize();

           /* if(variables.identidad != null){
                vista.objListarPeriodosPagos.CambiarEntidad(variables.identidad);
                var titulo = vista.winPeriodosPagos.title + ' -  ' + variables.denominacionentidad;
                vista.winPeriodosPagos.setTitle(titulo);
                vista.winPeriodosPagos.show();
            }*/
        });


        vista.objListarPeriodosPagos.on('periodopagoseleccionado', function(fila){
            vista.btnAceptarPeriodosPagos.disable();
            variables.idtipopago = fila.data.idtipopago;
        });

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
        vista.btnAceptarPeriodosPagos.on('click', function(){
            if(variables.identidad != null){
               // vista.winExportarBanco.show();
                //vista.winExportarBanco.maximize();

                var cont =vista.objListarPeriodosPagos.stPeriodosPagoExportar.getCount();
                var todos =vista.objListarPeriodosPagos.stPeriodosPagoExportar.getRange(0,cont-1);

                var auxid =new Array();
                var contarraux = 0;
                for (var i =  0; i<cont; i++) {
                    auxid[contarraux] = todos[i].data.idelaborarpagos;
                    contarraux++;
                }
                vista.winPeriodosPagos.hide();
                modelo.funstNominaPG(auxid, variables.identidad,variables.formulario);
            }

        });


        







    }
}
