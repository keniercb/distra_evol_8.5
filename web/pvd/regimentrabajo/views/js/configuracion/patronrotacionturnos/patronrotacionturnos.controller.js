
 Ext.ns('Pvd.RegimenTrabajo.PatronRotacionTurnos');

/////////////////////////////////////Controlador de la Interfaz///////////////////////////////////////////////////////

//Controlador de la vista del componente
Pvd.RegimenTrabajo.PatronRotacionTurnos.Controlador = {
    
    init: function(idioma, vista, modelo) {
	 var scope=this;
		modelo.fuenteDatosListado.load();
        modelo.fuenteDatosListadoTurnos.load();
		 
         modelo.fuenteDatosListado.on('load', function(){
            if (vista.listado.getSelectionModel().getCount() == 0) {
                vista.btnModificar.disable();
                vista.btnEliminar.disable();
            }
        });
        
        vista.listado.getSelectionModel().on('rowselect', function () {
            modelo.fuenteDatos.load({params:{start:0, limit:15, idrotacion: vista.listado.getSelectionModel().getSelected().id}});
            vista.btnModificar.enable();
            vista.btnEliminar.enable();
	}, this);
        
        vista.btnAdicionar.on('click', function(){
			vista.ventanaGestion.setTitle(idioma.lbTitVentAddRotacionTurnos);
            modelo.fuenteDatos.removeAll();
            vista.btnAplicar.show();
            vista.ventanaGestion.show();
        });
        
        vista.btnModificar.on('click', function(){
            vista.ventanaGestion.setTitle(idioma.lbTitVentModRotacionTurnos);
            vista.btnAplicar.hide();
			vista.ventanaGestion.show();
            modelo.fuenteDatos.removeAll();
            modelo.fuenteDatos.load({params:{start:0, limit:15, idrotacion: vista.listado.getSelectionModel().getSelected().id}});
            vista.formularioGestion.getForm().loadRecord(vista.listado.getSelectionModel().getSelected());
        });
        
        vista.btnEliminar.on('click', function(){
           Eliminar();
        }, this);

        function Eliminar(){
            mostrarMensaje(2, idioma.lbTitMsgSeguroEliminarR, function(btnPresionado) {
                if (btnPresionado == 'ok') {
                    Ext.getBody().mask(idioma.lbTitMsgEliminandoR);
                    Ext.Ajax.request({
                        url: 'delRotacionTurnos',
                        params:{idrotacion: vista.listado.getSelectionModel().getSelected().id},
                        callback: function() {
                            Ext.getBody().unmask();
                        },
                        success: function (r) {
                            var responseData = Ext.decode(r.responseText);
                            if (responseData.codMsg == 3)
                                mostrarMensaje(3, idioma.lbTitMsgTurnoUso);
                            else {
                                mostrarMensaje(1, idioma.lbMsgDelRotacionTurnosExito);
                            }
                            modelo.fuenteDatosListado.reload();
                            modelo.fuenteDatos.reload();
                        }
                    });
                }
            });
        }
		
		vista.btnLimpiar.on('click', function(){
            vista.tfbuscar.reset();
			modelo.fuenteDatosListado.load();
        });
	
		 vista.btnBuscar.on('click', function(){
			modelo.fuenteDatosListado.load({params:{denominacion: vista.tfbuscar.getValue()}});
        });
        
        vista.btnCancelar.on('click', function(){
            vista.ventanaGestion.hide();
            vista.formularioGestion.getForm().reset();
        });
        
        vista.btnAceptar.on('click', function(){
            this.salvarFormulario(false);
        }, this);
        
        vista.btnAplicar.on('click', function(){
            this.salvarFormulario(true);
        }, this);
        
        this.salvarFormulario = function(btnAplicarPresionado) {
            var urlAction = 'addRotacionTurnos';
            var lbTitMsgEspera = idioma.lbTitMsgAdicionandoR;
            var lbMsgExito = idioma.lbMsgInsRotacionTurnosExito;
            if (vista.formularioGestion.getForm().findField('idrotacion').getValue()) {
                urlAction = 'modRotacionTurnos';
                lbTitMsgEspera = idioma.lbTitMsgModificandoR;
                lbMsgExito = idioma.lbMsgModRotacionTurnosExito;
            }
            if (vista.formularioGestion.getForm().isValid()){
                var arreglo = new Array();
                var validos = true;
                //console.info(modelo.fuenteDatos.getRange());
                Ext.each(modelo.fuenteDatos.getRange(), function(rec){
                    //console.info(rec);
                    var idrotacion = "";
                    var idrotacionturno = "";

                    if(urlAction == 'modRotacionTurnos')
                    {
                        idrotacion = vista.listado.getSelectionModel().getSelected().id;
                        idrotacionturno = rec.get('idrotacionturno');
                    }
                    if(!rec.get('cantdias')){
                        validos = false;
                    }

                    arreglo.push({
                        idrotacionturno: idrotacionturno,
                        idrotacion: idrotacion,
                        cantdias: rec.get('cantdias'),
                        idturnotrabajo: rec.get('idturnotrabajo')
                    });
                })
                if(validos){
                    vista.formularioGestion.getForm().submit({
                        url: urlAction,
                        waitMsg: lbTitMsgEspera,
                        params:{array: Ext.encode(arreglo)},

                        success: function(o,r) {
                            if(r.result.existe)
                                mostrarMensaje(3, idioma.lbMsgModRotacionTurnosExiste);
                            else{
                                if (!btnAplicarPresionado)
                                    vista.ventanaGestion.hide();
                                vista.formularioGestion.getForm().reset();
                                modelo.fuenteDatosListado.reload();
                                modelo.fuenteDatos.reload();
                                mostrarMensaje(1, lbMsgExito);
                            }
                        },
                        failure: function(response) {
                            if (response.responseText) {
                                var responseData = Ext.decode(response.responseText);
                                if (responseData.codMsg)
                                    mostrarMensaje(responseData.codMsg, responseData.mensaje);
                            }
                        }
                    });
                }else
                    mostrarMensaje(3, idioma.lbTitMsgCamposInc);

            } else mostrarMensaje(3, idioma.lbTitMsgCamposInc);
        }
		
			//Manipulador de HotKeys
var teclaAlt = new Ext.KeyMap(Ext.getDoc(), [{
    key: 'imlbx',
    alt: true,
    stopEvent: true, 
    handler: function(k, e) {
        switch(k) {
            case 73:{ //i para adicionar
                    vista.ventanaGestion.setTitle(idioma.lbTitVentAddRotacionTurnos);
                    modelo.fuenteDatos.removeAll();
                    vista.btnAplicar.show();
                    vista.ventanaGestion.show();
                break;
            } 
            case 77:{ //m para modificar 
                if(!vista.btnModificar.disabled){
                    vista.ventanaGestion.setTitle(idioma.lbTitVentModRotacionTurnos);
                    vista.btnAplicar.hide();
                    vista.ventanaGestion.show();
                    modelo.fuenteDatos.removeAll();
                    modelo.fuenteDatos.load({params:{start:0, limit:15, idrotacion: vista.listado.getSelectionModel().getSelected().id}});
                    vista.formularioGestion.getForm().loadRecord(vista.listado.getSelectionModel().getSelected());
                }
                break;
            }
			 case 76:{ //l para limpiar
				vista.tfbuscar.reset();
                modelo.fuenteDatosListado.load();
               break;
            }
            case 66:{ //b para buscar 
                modelo.fuenteDatosListado.load({params:{denominacion: vista.tfbuscar.getValue()}});
                break;
            }
            case 88:{ //x para cancelar
                vista.ventanaGestion.hide();
                vista.formularioGestion.getForm().reset();
                break;
            }
        }
    }      
},{
    key: 46,//del para eliminar
    fn: function(){
        if(!vista.btnEliminar.disabled){
            Eliminar();
        }
    }
},{
    key: 13,//enter para aceptar
    fn: function(){
	 
        if(vista.btnAceptar.isVisible()){
            vista.btnAceptar.focus();
			scope.salvarFormulario(false);
        }        
    }
},{
    alt: true,
    ctrl: true,
    stopEvent: true,
    key: 'p',
    fn: function(){
        if(vista.btnAplicar.isVisible()){
            scope.salvarFormulario(true);
        }
    }
}]);
    }
}

