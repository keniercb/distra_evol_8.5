Ext.ns("Ext.PVD.Evaluaciones.Evaluar");
Ext.PVD.Evaluaciones.Evaluar.WinExportarDatos = Ext.extend(Ext.Window,{
    layout:'border',
    width: 380,
    height:200,
    modal:true,

    initComponent: function(){
        var self = this;
        this.title = self.labels.lbWinExportar;

        var btnCancelar = new Ext.Button({
		    id:'btnCancelar',
            text:self.labels.lbBtnCancelar,
            tooltip:self.labels.ttpBtnCancelar,
            iconCls: 'cancelar',
            handler: function(){
                self.close();
            }
        });

        var btnAceptar = new Ext.Button({
		    id:'btnAceptar',
            text:self.labels.lbBtnAceptar,
            tooltip:self.labels.ttpBtnAceptarExportar,
            iconCls: 'aceptar',
			nextTab: 'tfTitulo',
			prevTab:'btnCancelar',
            handler: function(){
				if(form.getForm().isValid()){
					PVD.mostrarMascara('exportardatos', self.labels.lbMsgWait, self.labels.lbMaskExportingData);
					Ext.Ajax.request({
						url: 'exportarResultadoEvalModelo',
						method: 'POST',
						params: {
							titulo: tfTitulo.getValue(),
							formato: formato,
							idmodelo: self.idmodelo,
							idpreprocesoevaluativo: self.idpreprocesoevaluativo,
							denominacionproceso: self.denominacionproceso,
							estado:self.estado
						},
						callback : function(options, success, response) {
							var r = Ext.util.JSON.decode(response.responseText);                        
							PVD.ocultarMascara('exportardatos');
							  if(r.url){						  
							window.open(r.url);
						}else{
                                   Ext.MessageBox.show({
                                       title: self.labels.msgInformacion,
                                       msg: self.labels.msgGuardarDatos, //No hay datos guardados
                                       buttons: Ext.MessageBox.OK,
                                       icon: Ext.MessageBox.INFO
                                });
                            }
						//self.close();
						}
					});
				}
            }
        });

        var tfTitulo = new Ext.form.TextField({
		    id:'tfTitulo',
            fieldLabel: self.labels.lbTituloReporte,
            allowBlank:false,
            anchor:'100%',			
			prevTab:'btnAceptar',
        });
		
        var formato = 'rtf';
        var rgFormato = new Ext.form.RadioGroup({
		    id:'rgFormato',
            xtype: 'radiogroup',
            fieldLabel: self.labels.lbFormatReport,
            width:160,
            items: [{
                boxLabel: 'RTF',
                name: 'formato',
                checked: true,
                inputValue: 'rtf',
                listeners:{
                    check: function(radio, varChecked){
                        if(varChecked){
                            formato = 'rtf';
                        }
                    }
                }
            },{
                boxLabel: 'PDF',
                name: 'formato',
                inputValue: 'pdf',
                listeners:{
                    check: function(radio, varChecked){
                        if(varChecked){
                            formato = 'pdf';
                        }
                    }
                }
            }]
        });

        var form = new Ext.form.FormPanel({
            region:'center',
            border:false,
            labelWidth: 75, // label settings here cascade unless overridden
            frame:true,
            labelAlign:'top',
            bodyStyle:'padding:5px 5px 0',
            margins:'5',
            items: [tfTitulo, rgFormato],
						
		});
		
        this.items = [form];
        this.buttons = [btnCancelar,btnAceptar];
		
		
        Ext.PVD.Evaluaciones.Evaluar.WinExportarDatos.superclass.initComponent.call(this);
		this.on('show', function(){
			tfTitulo.focus(false, 300);
		});
    }
	
});

