Ext.ns("Ext.components.Evaluaciones");

Ext.components.Evaluaciones.WinResponder = Ext.extend(Ext.Window, {
    layout: 'border',
    modal: true,
    resizable: false,
    height: 250,
    width: 300,
    initComponent: function () {
        var self = this;

        var btnAceptar = new Ext.Button({
            iconCls: 'aceptar',
            id: 'aceptPE',
            text: "Aceptar",
            tooltip: "Aceptar respuesta",
            handler: function () {
                Respuesta('aceptar',self.idreclamacion);
            },
            nextTab: 'denomi' + self.id,
            prevTab: 'aplicPE'
        });

        this.btnAplicar = new Ext.Button({
            iconCls: 'aplicar',
            id: 'aplicPE',
            text: "Aplicar",
            tooltip: "Aplicar respuesta",
            handler: function () {
                Respuesta('aplicar',self.idreclamacion);
            }
        });

        var btnCancelar = new Ext.Button({
            iconCls: 'cancelar',
            id: 'cancelPE',
            text: "Cancelar",
            tooltip: "Cancelar respuesta",
            handler: function () {
                self.close();
            }
        });       

        
        var taDescripcion = new Ext.form.TextArea({
            height: 75,
            anchor: '100%',
            fieldLabel: "Respuesta a la reclamaci&oacuten"
        });
             

        var chbProcede = new Ext.form.Checkbox({
            boxLabel: "Procede",
            name: 'procede',
            inputValue: 'true'
        });  
      
	
	 this.formEvalRespuesta = new Ext.FormPanel({
            margins: '5 5 5 5',
            labelAlign: 'top',
            width: 360,
            frame: true,
            region: 'center',
            bodyStyle: 'padding:5px 5px 0',
            border: false,
            items: [
			   {
                layout: 'column',
                items: [
                    {
                        columnWidth: 1,
                        layout: 'form',
                        items: [chbProcede,taDescripcion]
                    }
                ]
            }]
        });
		 
        this.items = [self.formEvalRespuesta];
        this.buttons = [btnCancelar, self.btnAplicar, btnAceptar];
		
        Ext.components.Evaluaciones.WinResponder.superclass.initComponent.call(this);
		
       	 function Respuesta(accion, idreclamacion) {
                if (idreclamacion != null) {
                    PVD.mostrarMascara('idmskmodify', "Espere por favor ...", 'Guardando datos de la respuesta');
                    Ext.Ajax.request({
                        url: 'respuestareclamacion',
                        params: {
                             procede : chbProcede.getValue(),
							 respuesta: taDescripcion.getValue(),
							 idreclamacion: idreclamacion
                        },
                        callback: function (options, success, response) {
                            PVD.ocultarMascara('idmskmodify');
                            responseData = Ext.decode(response.responseText);
                              if (responseData.codResult == 3) {
                            mostrarMensaje(responseData.codMsg, responseData.mensaje);
                        }	
                          else {

                            mostrarMensaje(1, 'La reclamaci&oacuten fue modificada con &eacutexito', function (btn) {
                                if (accion == 'aceptar') {
                                    self.hide();
									self.store.reload();
                                } else {
                                    self.formEvalRespuesta.getForm().reset();
									self.store.reload();
                                }
                                
                            });
                        }						
                                                     
                           
                        }
                    });
                }
            
          }
		},

     });


