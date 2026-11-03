Ext.ns("Ext.components.Evaluaciones");
Ext.components.Evaluaciones.WinEvaluador = Ext.extend(Ext.Window, {
    layout: 'border',
    id: 'winEvaluador',
    title: 'Seleccionar un nuevo evaluador',
    width: '90%',
    height: 550,
    closeAction: 'close',
    closable: true,
    modal: true,
    initComponent: function () {
        var self = this;  
          
            /*this.grid=new Ext.components.Evaluaciones.ViewGridEvaluador({
			idpersona:self.idpersona,
			idperiodoproceso:self.idperiodoproceso			
		});	*/
		var objRecComplejas = new Ext.components.CmpReccomplejas.Interfaz({
					margins: '5 0 5 0',
					title: 'Reporte de personas',
					width: '100%',
					height: 430,
					singleSelect: false,
					region: 'center',
					border: true,
					idconfiguracion: 'personas',
					tituloReporte: 'Reporte de personas',
					tituloConfiguracion: 'Configuración de la búsqueda',
					tituloGrid: 'Listado de personas',
					mainToolBar: ['->', {
						text: 'Ayuda',
						iconCls: 'ayuda'
					}],
					hideBtnRtf: false,
					singleSelect: true,
					noUsarGestAvisos: true, //False si voy a usar el componente de Gestionar avisos
					useMap: false,
					hideBtnOperCant: false,
					autoLoadList: false,
					renderers: getRenderes()
				});
				
				objRecComplejas.pReporte.gpReporte.getSelectionModel().on('rowselect', function (sm, rowIndex, rec) {
					if(sm)
					{										
						self.recordGrid=rec;
					}
					    });
               
		this.buttons = [
            {
                text: 'Cancelar',
                iconCls: 'cancelar',
                handler: function() {
                    self.close();
                }
            },
            {
                text: 'Aceptar',
                id:'Aceptar',
                //disabled:true,
                iconCls: 'aceptar',
                handler: function() {					
					var record=objRecComplejas.pReporte.gpReporte.getSelectionModel().getSelected();						
					var idpersona_eval=record.data.idpersona;
					var idpersona=self.idpersona;
                    Mod(idpersona_eval,idpersona);
                }
            }
            
        ];
        function Mod(idpersona_eval,idpersona) {
			           mostrarMensaje(2, 'Está seguro que quiere cambiar el evaluador de la persona seleccionada', function (btn) {
					   if (btn == "ok") {	   
                       PVD.mostrarMascara('id','Enviando datos',  'Guardando datos del evaluador de la persona');
                        Ext.Ajax.request({
                            url: 'cambiarevaluador',
                            method: 'POST',
                            params: { idpersona_eval:idpersona_eval,idpersona:idpersona},                           
                            callback: function (options, success, response) {
                                responseData = Ext.decode(response.responseText);
                                PVD.ocultarMascara('id');
                                if (responseData.codMsg == 1) {
                                    mostrarMensaje(responseData.codMsg, responseData.mensaje, function () {                                     
                                        
                                        self.gridpersona.store.load({params: {limit: 10, start: 0}, callback: function () {
                                        }});
                                        self.close();
                                    });

                                } else if (responseData.codMsg == 3) mostrarMensaje(responseData.codMsg, responseData.mensaje);
                            }
                        });
         }        
                  
	 });
};

        this.items=[objRecComplejas/*this.grid*/];
        Ext.components.Evaluaciones.WinEvaluador.superclass.initComponent.call(this);
        function getRenderes() {
        return Ext.apply({
            showSexo: function (val) {
                if (val == 0) {
                    return '<center><img src="/pvd/credenciales/views/images/female.png" /></center>';
                } else {
                    return '<center><img src="/pvd/credenciales/views/images/male.png" /></center>';
                }
            }, showGradoMilitar: function (val, opt, rec) {
                // grado
                if (!Ext.isEmpty(val)) {
                    return '<center><img ext:qtip="<b>' + rec.data.grado + '</b>" style="height: 16px;cursor: pointer" src="' + val + '" /></center>';
                } else {
                    return '<center><img src="' + Ext.BLANK_IMAGE_URL + '" /></center>';
                }
            }
        });
    };		
    }
});
