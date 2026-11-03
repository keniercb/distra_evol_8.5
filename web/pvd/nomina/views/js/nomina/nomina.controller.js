Ext.ns('Pvd.Nomina.Pagos.Nomina');

Pvd.Nomina.Pagos.Nomina.Controlador = {
    init: function(idioma, vista, modelo) {

        var variables = {
            identidad : null,
            denominacionentidad: '',
            certificadaaprobada: 0,
            idtipopago: null
        };       
        
        //Mostrar interfaz para selecionar entidad.
        vista.winEstEntidades.show();
        
        //Eventos del objeto del ábol de entidades.
        vista.pEstEntidades.on('estructuraselecionada', function(o, nodo){  
            //if(nodo.attributes.tipoestructura == 3){
                // console.log(nodo)
                variables.identidad = nodo.attributes.id;
                variables.denominacionentidad = nodo.text;
                vista.btnAceptarEntidades.enable();
            /*}else{
                variables.identidad = null;     
                variables.denominacionentidad = '';           
                vista.btnAceptarEntidades.disable();                
            }*/
            vista.objListarPeriodosPagos.stPeriodosPago.removeAll();
        });
        
        vista.btnAceptarEntidades.on('click',function(){
            // console.log(variables.identidad)
				if(variables.identidad != null){
					vista.objListarPeriodosPagos.CambiarEntidad(variables.identidad);
					var titulo = 'Per&iacute;odos de pago' + ' -  ' + variables.denominacionentidad;  
					vista.winPeriodosPagos.setTitle(titulo);
					vista.winPeriodosPagos.show();
					variables.denominacionentidad = '';
				}	
        });
        
        vista.objListarPeriodosPagos.on('periodopagoseleccionado', function(fila){
			vista.btnAceptarPeriodosPagos.enable();
			variables.idtipopago = fila.data.idtipopago;
		});
        
		vista.objListarPeriodosPagos.cbTipoPago.on('select', function(combo, record, index){
            //Deshabilitando el boton btnAceptarPeriodosPagos
            vista.btnAceptarPeriodosPagos.disable();
		});
		
        vista.btnAceptarPeriodosPagos.setHandler(function(){
		    buscarDatosPeriodo();
            //limpiando los stores del componente visualizarnomincomp
            vista.objListarPeriodosPagos.cbVisualizar.getValue();
        });

        function buscarDatosPeriodo(){
            var modovisualizar = vista.objListarPeriodosPagos.cbVisualizar.getValue();
            if(variables.identidad != null){
                vista.winNomina.show();
                vista.winNomina.maximize();
                vista.winNomina.CambiarEntidad(variables.identidad);
                var objdatos = vista.objListarPeriodosPagos.Datos();
                //SE BUSCA LOS DATOS DE LA NOMINA
                PVD.mostrarMascara('idmasksearch', 'Por favor espere...','Cargando los datos generales');
                Ext.Ajax.request({
                    url: '/pvd/nomina/index.php/nomina/buscardatosNominas',
                    method: 'POST',
                    params: {
                        idelaborarpago: objdatos.idelaborarpagos,
                        identidad: variables.identidad
                    },
                    callback: function(options, success, response)
                    {
                        responseData = Ext.decode(response.responseText);
                        //console.info(responseData);
                        PVD.ocultarMascara('idmasksearch');
                        objdatos.salariototal = responseData.montototal;
                        objdatos.totalpersonas = responseData.cantidadpersonas;
                        objdatos.totalpersonascc = responseData.cantidadpersonascc;
                        objdatos.datoscontables = responseData.datoscontables;
                        objdatos.idcomprobanteoperaciones = responseData.idcomprobanteoperaciones;
                        objdatos.numerocomprobanteoperaciones = (responseData.numerocomprobanteoperaciones)?responseData.numerocomprobanteoperaciones:'';
                        objdatos.idcomprobantecancelacion = responseData.idcomprobantecancelacion;
                        objdatos.numerocomprobantecancelacion = (responseData.numerocomprobantecancelacion)?responseData.numerocomprobantecancelacion:'';
                        objdatos.posteacomprobantes = (responseData.posteacomprobantes)?responseData.posteacomprobantes:0;
                        objdatos.cobroypago = (responseData.cobroypago)?responseData.cobroypago:0;
                        vista.winNomina.CambiarDatos(objdatos);
                        vista.winNomina.SincronizarPlantillasModelos(modovisualizar, responseData.estadonominas, 0);
                    }.createDelegate(this)
                });


            }
        }

        vista.winNomina.on('comprobantecontabilizado', function(idcomprobante){
            // console.info(idcomprobante);
        });
		
	}
}
