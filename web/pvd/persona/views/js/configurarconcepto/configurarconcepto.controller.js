Ext.ns('Ext.component.persona');

var accion;
var idcampo;
var idconcepto;
Ext.component.persona.Controlador={
	
  init: function(perfil,idioma, vista, modelo) {
     
	
	vista.cmpConcepto.getSelectionModel().on('rowselect', function(sm, rowIndex, record){
		idconcepto=record.data.idconcepto;
		vista.gpCampo.getStore().baseParams.idconcepto=idconcepto;
		vista.gpCampo.getStore().load({
		  params:{
			limit: '15',
			start:'0'
			}
		});
		vista.btnAdicionar.enable();
	}, this)
	
	vista.pbCampo.on('beforechange', function(bar, params) { 
		vista.btnEliminar.disable();
                vista.btnModificar.disable();
          
        });
	
	vista.gpCampo.getStore().on('load',function(){
	  vista.btnAdicionar.enable();
	},this);
	
        modelo.storeGrid.on('load', function() {
                vista.btnEliminar.disable();
                vista.btnModificar.disable();
		vista.btnAdicionar.enable();
                vista.btnAdicionar.focus();
        
        });
	
	vista.gpCampo.getSelectionModel().on('rowselect',function(sm, rowIndex, record){
	    vista.btnModificar.enable();
	    vista.btnEliminar.enable();
	},this);
	
       //Boton adicionar
	 vista.btnAdicionar.on('click',function(){
	  
	   vista.form.getForm().reset();
	    accion='add';
  	    vista.WinCampos.setTitle('Adicionar campo');
  	    vista.WinCampos.show();  	    
	  });
	
            
       //Boton modificar
	 vista.btnModificar.on('click', function(){
	   vista.form.getForm().reset();
	    accion='mod';
	    vista.WinCampos.setTitle('Modificar campo');
	    vista.WinCampos.show();
            vista.form.getForm().loadRecord(vista.gpCampo.getSelectionModel().getSelected());
	});
	  //Boton Ayuda
	  vista.btnAyuda.on('ayuda',function(){

	  });
     
          
	//Boton eliminar
	vista.btnEliminar.on('click', function(){
	  Ext.Msg.show({
		title:'Confirmaci&oacute;n',
		msg:'¿Está seguro que quiere eliminar el campo seleccionado?',
		icon:Ext.Msg.QUESTION,
		buttons:Ext.Msg.OKCANCEL,
		fn:function(btn){
		  if(btn =='ok'){
			//  PVD.mostrarMascara('idmskmodify','Por favor espere','Eliminando datos del concepto');	
    			Ext.Ajax.request({
				url:'eliminarCampo',		
				params:{	
				  id:vista.gpCampo.getSelectionModel().getSelected().get('idcampo')
				},
				callback: function (options, success, response){
					//  PVD.ocultarMascara('idmskmodify');
					responseData = Ext.decode(response.responseText);
					if (responseData.exception == 1) {
						Ext.MessageBox.show({
						  title: 'Información',
						  buttons: Ext.MessageBox.OK,
						  icon: Ext.MessageBox.INFO,
						  msg: 'El campo seleccionado no se puede eliminar debido a que est&aacute; en uso.',
						  fn: function() {
							vista.btnAdicionar.focus();
							}
						});
					}else {
						mostrarMensaje(1,'El campo ha sido eliminado satisfactoriamente.', function(btn){
						vista.gpCampo.getStore().reload();				
						});
					 }						
				}		
			});
		  }//fin btn==ok
		}
	  });
        }); 
	
	 vista.WinCampos.on('show',function(){
	    vista.btnAceptar.focus();
	    if(accion=='mod'){
	      vista.btnAplicar.hide();
	    }
	    else{
	      vista.btnAplicar.show();
	    }
	    modelo.stTipoDato.load({params:{start:0,limit:15}})				
	 },this);
	 
	  vista.btnAceptar.on('click',function() {
 	  if(accion == 'add'){				
		if(vista.form.getForm().isValid()){
			//PVD.mostrarMascara('idmskmodify','Por favor espere','Guardando datos del concepto'); 
			Ext.Ajax.request({
				url:'adicionarCampo',
				params:{
					idconcepto:vista.cmpConcepto.getSelectionModel().getSelected().get('idconcepto'),
					denominacion: vista.tfDenominacion.getValue(),
					idtipodedato:   vista.GrupoCombo.getValue(),
					descripcion:  vista.taDescripcion.getValue()
				},
				callback: function (options, success, response){
					//  PVD.ocultarMascara('idmskmodify			
					responseData = Ext.decode(response.responseText);
					if(responseData.codMsg==1){
						if (responseData.exception == 1) {
							Ext.MessageBox.show({
								title: 'Información',
								buttons: Ext.MessageBox.OK,
								icon: Ext.MessageBox.INFO,
								fn: function() {
									    vista.btnAdicionar.focus();
									    vista.btnModificar.disable();
									    vista.btnEliminar.disable();
								    }
							});
						}else{
							vista.WinCampos.close();
							if(responseData.existe){
								    mostrarMensaje(1,'El campo que quiere adicionar ya existe.', function(btn){
									vista.btnAdicionar.focus();
									vista.btnModificar.disable();
								        vista.btnEliminar.disable();
								    });
								}else{
								    mostrarMensaje(1,'El campo ha sido adicionado satisfactoriamente.',function(btn){                            
									    modelo.storeGrid.reload();	
									    vista.btnAdicionar.focus();
									    vista.btnModificar.disable();
									    vista.btnEliminar.disable();
								    });
								}
						}
					}   					
				}	      		
			});
		}
 	  }
 	  else if(accion=='mod'){
	      if(vista.form.getForm().isValid()){
		//PVD.mostrarMascara('idmskmodify','Por favor espere','Guardando datos del concepto');
			Ext.Ajax.request({
				url:'modificarCampo',
				params:{
					idcampo:vista.gpCampo.getSelectionModel().getSelected().get('idcampo'),
					denominacion: vista.tfDenominacion.getValue(),
					idtipodedato:   vista.GrupoCombo.getValue(),
					descripcion:  vista.taDescripcion.getValue()
				},
				callback: function (options, success, response){
					//PVD.ocultarMascara('idmskmodify');
					responseData = Ext.decode(response.responseText);
					if(responseData.codMsg==1){
						if (responseData.exception == 1) {
							Ext.MessageBox.show({
							      title: 'Información',
							      buttons: Ext.MessageBox.OK,
							      icon: Ext.MessageBox.INFO,
							      fn: function() {
								    vista.btnAdicionar.focus();
								    vista.btnModificar.disable();
								    vista.btnEliminar.disable();
							      }
							  });
							vista.WinCampos.close();
						}else{
						  vista.WinCampos.close();
							self.close();
							if(responseData.existe){
		                        			mostrarMensaje(1, 'El concepto ya existe.', function(btn){
									vista.btnAdicionar.focus();
									vista.btnModificar.disable();
									vista.btnEliminar.disable();
			                           		});
							}else{
								mostrarMensaje(1,'El concepto ha sido adicionado satisfactoriamente.',function(btn){                            
									vista.gpCampo.getStore().reload();	
									vista.btnAdicionar.focus();
									vista.btnModificar.disable();
									vista.btnEliminar.disable();
				                           	});
							}
						}
					}     					
				 }	      		
			});
		}
 	  }
	},this);
	  
	  vista.btnCancelar.on('click',function() {
	    vista.form.getForm().reset();
	  vista.WinCampos.hide();	  
	},this);
	
	vista.btnAplicar.on('click',function() {	  
	    if(vista.form.getForm().isValid()){
			//PVD.mostrarMascara('idmskmodify','Por favor espere','Guardando datos del concepto'); 
			Ext.Ajax.request({
				url:'adicionarCampo',
				params:{
					idconcepto:vista.cmpConcepto.getSelectionModel().getSelected().get('idconcepto'),
					denominacion: vista.tfDenominacion.getValue(),
					idtipodedato:   vista.GrupoCombo.getValue(),
					descripcion:  vista.taDescripcion.getValue()
				},
				callback: function (options, success, response){
					//  PVD.ocultarMascara('idmskmodify			
					responseData = Ext.decode(response.responseText);
					if(responseData.codMsg==1){
						if (responseData.exception == 1) {
							Ext.MessageBox.show({
								title: 'Información',
								buttons: Ext.MessageBox.OK,
								icon: Ext.MessageBox.INFO,
								fn: function() {
									    vista.btnAdicionar.focus();
									    vista.btnModificar.disable();
									    vista.btnEliminar.disable();
								    }
							});
						}else{
							if(responseData.existe){
								    mostrarMensaje(1,'El campo que quiere adicionar ya existe.', function(btn){
									vista.btnAdicionar.focus();
									vista.btnModificar.disable();
								        vista.btnEliminar.disable();
								    });
								}else{
								    mostrarMensaje(1,'El campo ha sido adicionado satisfactoriamente.',function(btn){                            
									    modelo.storeGrid.reload();
									    vista.form.getForm().reset();
									    vista.btnAdicionar.focus();
									    vista.btnModificar.disable();
									    vista.btnEliminar.disable();
								    });
								}
						}
					}   					
				}	      		
			});
		}
	},this);
    }
}