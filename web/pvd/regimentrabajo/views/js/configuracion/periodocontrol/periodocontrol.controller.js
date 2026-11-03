
 Ext.ns('Pvd.RegimenTrabajo.PeriodoControl');

/////////////////////////////////////Controlador de la Interfaz///////////////////////////////////////////////////////

//Controlador de la vista del componente
Pvd.RegimenTrabajo.PeriodoControl.Controlador = {
    
    init: function(idioma, vista, modelo) {
	 var scope=this;
		 modelo.fuenteDatosListado.load();
		 
         modelo.fuenteDatosListado.on('load', function(){
            if (vista.listado.getSelectionModel().getCount() == 0) {
                vista.btnModificar.disable();
                vista.btnEliminar.disable();
            }
        });
        
        vista.listado.getSelectionModel().on('rowselect', function () {
            vista.btnModificar.enable();
            vista.btnEliminar.enable();
	}, this);
        
        vista.btnAdicionar.on('click', function(){
			vista.ventanaGestion.setTitle(idioma.lbTitVentAddPeriodoControl);
            vista.btnAplicar.show();
            vista.ventanaGestion.show();
        });
        
        vista.btnModificar.on('click', function(){
            vista.ventanaGestion.setTitle(idioma.lbTitVentModPeriodoControl);
            vista.btnAplicar.hide();
			vista.ventanaGestion.show();
            vista.formularioGestion.getForm().loadRecord(vista.listado.getSelectionModel().getSelected());
        });
        
        vista.btnEliminar.on('click', function(){
            mostrarMensaje(2, idioma.lbTitMsgSeguroEliminarR, function(btnPresionado) {
                if (btnPresionado == 'ok') {
                    Ext.getBody().mask(idioma.lbTitMsgEliminandoR);
                    Ext.Ajax.request({
                        url: 'delPeriodoControl',
                        params:{idperiodocontrol: vista.listado.getSelectionModel().getSelected().id},
                        callback: function() {
                            Ext.getBody().unmask();
                        },
                        success: function () {
                            mostrarMensaje(1, idioma.lbMsgDelPeriodoControlExito);
                            modelo.fuenteDatosListado.reload();
                        }
                    });
                }
            });
        }, this);
		
		vista.btnLimpiar.on('click', function(){
			vista.dfFIniciob.reset();
			vista.dfFFinb.reset();
			modelo.fuenteDatosListado.load();
        });
	
		 vista.btnBuscar.on('click', function(){
			modelo.fuenteDatosListado.load({params:{fdesde: vista.dfFIniciob.getRawValue(),fhasta: vista.dfFFinb.getRawValue()}});
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
            var urlAction = 'addPeriodoControl';
            var lbTitMsgEspera = idioma.lbTitMsgAdicionandoR;
            var lbMsgExito = idioma.lbMsgInsPeriodoControlExito;
            if (vista.formularioGestion.getForm().findField('idperiodocontrol').getValue()) {
                urlAction = 'modPeriodoControl';
                lbTitMsgEspera = idioma.lbTitMsgModificandoR;
                lbMsgExito = idioma.lbMsgModPeriodoControlExito;
            }
            if (vista.formularioGestion.getForm().isValid()){
                vista.formularioGestion.getForm().submit({
                    url: urlAction,
                    waitMsg: lbTitMsgEspera,
                    success: function(o,r) {
					if(r.result.existe)
						mostrarMensaje(3, idioma.lbMsgModPeriodoControlExiste);
					else{
							if (!btnAplicarPresionado)
								vista.ventanaGestion.hide();
                                vista.formularioGestion.getForm().reset();
                                modelo.fuenteDatosListado.reload();
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
            } else mostrarMensaje(3, idioma.lbTitMsgCamposInc);
        }
		
			//Manipulador de HotKeys
var teclaAlt = new Ext.KeyMap(Ext.getDoc(), [{
    key: 'imlhb',
    alt: true,
    stopEvent: true, 
    handler: function(k, e) {
        switch(k) {
            case 73:{ //i para adicionar
                    vista.ventanaGestion.setTitle(idioma.lbTitVentAddPeriodoControl);
				    vista.btnAplicar.show();
					vista.ventanaGestion.show();
                break;
            } 
            case 77:{ //m para modificar 
                if(!vista.btnModificar.disabled){
                    vista.ventanaGestion.setTitle(idioma.lbTitVentModPeriodoControl);
					vista.btnAplicar.hide();
					vista.formularioGestion.getForm().loadRecord(vista.listado.getSelectionModel().getSelected());
					vista.ventanaGestion.show();
                }
                break;
            }
			 case 76:{ //l para limpiar
				vista.tfbuscar.reset();
				vista.dfFIniciob.reset();
				vista.dfFFinb.reset();
               break;
            }
            case 66:{ //b para buscar 
                modelo.fuenteDatosListado.load({params:{fdesde: vista.dfFIniciob.getRawValue(),fhasta: vista.dfFFinb.getRawValue()}});
                break;
            }
        }
    }      
},{
    key: 46,//del para eliminar
    fn: function(){
        if(!vista.btnEliminar.disabled){
           mostrarMensaje(2, idioma.lbTitMsgSeguroEliminarR, function(btnPresionado) {
                if (btnPresionado == 'ok') {
                    Ext.getBody().mask(idioma.lbTitMsgEliminandoR);
					Ext.Ajax.request({
                        url: 'delPeriodoControl',
                        params:{idperiodocontrol: vista.listado.getSelectionModel().getSelected().id},
                        callback: function() {
                            Ext.getBody().unmask();
                        },
                        success: function () {
                            mostrarMensaje(1, idioma.lbMsgDelPeriodoControlExito);
                            modelo.fuenteDatosListado.reload();
                        }
                    });
                }
            });
        }
    },
},{
    key: 13,//enter para aceptar
    fn: function(){
	 
        if(vista.btnAceptar.isVisible()){
            vista.btnAceptar.focus();
			scope.salvarFormulario(false);
        }        
    }
}]);	
    }
}

