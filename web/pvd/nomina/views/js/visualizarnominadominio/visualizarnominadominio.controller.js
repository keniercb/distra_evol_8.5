Ext.ns('Pvd.Nomina.Pagos.VisualizarNominaDominio');

Pvd.Nomina.Pagos.VisualizarNominaDominio.Controlador = {
    init: function(idioma, vista, modelo) {
        var variables = {
            identidad : null,
            denominacionentidad: '',
            certificadaaprobada: 0,
            idtipopago: null
        };       

        vista.winEstEntidades.show();

        vista.pEstEntidades.on('estructuraselecionada', function(o, nodo){            
            //if(nodo.attributes.tipoestructura == 3){
                variables.identidad = nodo.id;
                variables.denominacionentidad = nodo.text;
                vista.btnAceptarEntidades.enable();
            /*}else{
                variables.identidad = null;     
                variables.denominacionentidad = '';           
                vista.btnAceptarEntidades.disable();                
            }*/
            vista.objListarPeriodosPagos.stPeriodosPago.removeAll();
        });
        
        vista.btnAceptarEntidades.setHandler(function(){
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
		});
        
		vista.objListarPeriodosPagos.cbTipoPago.on('select', function(combo, record, index){
            vista.btnAceptarPeriodosPagos.disable();
		});
		
        vista.btnAceptarPeriodosPagos.setHandler(function(){
		    buscarDatosPeriodo();
            vista.objListarPeriodosPagos.cbVisualizar.getValue();
        });

        function buscarDatosPeriodo(){
            var modovisualizar = vista.objListarPeriodosPagos.cbVisualizar.getValue();
            if(variables.identidad != null){
                vista.winNomina.show();
                vista.winNomina.maximize();
                vista.winNomina.CambiarEntidad(variables.identidad);
                var objdatos = vista.objListarPeriodosPagos.Datos();
                PVD.mostrarMascara('idmasksearch', 'Por favor espere...','Cargando los datos generales');
                Ext.Ajax.request({
                    url: '/pvd/nomina/index.php/visualizarnominadominio/buscardatosNominas',
                    method: 'POST',
                    params: {
                        idelaborarpago: objdatos.idelaborarpagos,
                    },
                    callback: function(options, success, response)
                    {
                        responseData = Ext.decode(response.responseText);
                        PVD.ocultarMascara('idmasksearch');
                        objdatos.salariototal = responseData.montototal;
                        objdatos.totalpersonas = responseData.cantidadpersonas;
                        objdatos.totalpersonascc = responseData.cantidadpersonascc;
                        objdatos.datoscontables = responseData.datoscontables;
                        vista.winNomina.CambiarDatos(objdatos);
                        vista.winNomina.SincronizarPlantillasModelos(modovisualizar, responseData.estadonominas, 0);
                    }.createDelegate(this)
                });
            }
        }

        vista.winNomina.on('comprobantecontabilizado', function(idcomprobante){
            console.info(idcomprobante);
        });
	}
};
