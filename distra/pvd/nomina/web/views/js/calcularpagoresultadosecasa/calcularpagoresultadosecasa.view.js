Ext.ns('Pvd.Nomina.CalcularPagoResultado');
Ext.QuickTips.init();

Pvd.Nomina.CalcularPagoResultado.Vista = {
    init: function(perfil, idioma, modelo){
        
		this.acumuladoneto = 0.00;
		this.recordperiodopagoexportarseleccionado = null;
		//this.recordperiodopagoexportarseleccionado = null;
		this.arrayidelaborarpagos = new Array();
				
        //Panel de estructura y composición que cargo hasta el nivel de entidades.
        this.pEstEntidades = new Ext.pvd.persona.buscarestructura.panelBuscarestructura({
            layout: 'border',
            nivel: 3
        });

        //Botón  para cargar las personas pertenecientes a la unidad selecionada.
        this.btnAceptarEntidades = new Ext.Button({
            id: 'btnAceptarEntidades',
            text: 'Aceptar',
            tooltip: '',
            disabled: true,
            iconCls: 'aceptar'
        });         

        //Vista para el componente Buscar estructura 
        this.winEstEntidades = new Ext.Window({
            title: 'Entidades',
            modal: true,
            height: 350,
            width: '30%',
            closable:false,
            resizable:false,
            constrain: true,
            layout: 'fit',
            items:[this.pEstEntidades],
            buttons: [this.btnAceptarEntidades]
       });
       
       this.objListarPeriodosPagos = new Pvd.Nomina.ElaborarPago.ListarPeriodosPago({
            modoview:2,
	   });
		
		this.btnAceptarPeriodosPagos = new Ext.Button({
            id: 'btnAceptarPeriodosPagos',
            text: 'Aceptar',
            tooltip: '',
            disabled: true,
            iconCls: 'aceptar'
        }); 
       
       this.winPeriodosPagos = new Ext.Window({
            title: 'Per&iacute;odos de pago',
            modal: true,
            height: 400,
            width: 700,
            closable:true,
           constrain: true,
            closeAction: 'hide',
            resizable:false,
            layout: 'border',
            items: [this.objListarPeriodosPagos],
            buttons: [this.btnAceptarPeriodosPagos]
       });
       
       this.btnActualizarReporte = new Ext.Button({
            id: 'btnActualizarReporte',
            text: 'Actualizar reporte',
            tooltip: '',
            iconCls: 'actualizar'
        }); 
		
		this.btnModificarSBC = new Ext.Button({
            id: 'btnbtnModificarSBC',
            text: 'Modificar SBC',
            disabled: true,
            tooltip: '',
            iconCls: 'modificar'
        }); 
		
		//Button y Texfiled de busqueda
		this.btnBuscar = new Ext.Button({
            id: 'btnBuscar',
            text: '<u>B</u>uscar',
            tooltip: 'Buscar persona',
            iconCls:'buscar',
        });
		
	
        this.tfBuscar = new Ext.form.TextField({
		    id:'tfBuscar', 
            anchor: '99%'
        });
       
       this.fnRenderExportar = function(val){
			return '<center>'+val+'</center>';
		}
		
	   this.nfMontoTotal =new Ext.form.NumberField({
             name: 'montotal', 
			 width: '80%',
             id: 'nfMontoTotal'
		});
		
		this.nfcambiosbc1 =new Ext.form.TextField({
             name: 'nfcambiosbc1', 
             fieldLabel: 'SBC1', 
			 width: '90%',
             id: 'SBC1',
			 allowBlank: false, 
			 maxLength: 6, //regex, regexText, maskRe
			 maxLengthText :'El tama&ntilde;o m&aacute;ximo requerido es 6 caracteres.'
		});
		
		this.nfcambiosbc2 =new Ext.form.TextField({
             name: 'nfcambiosbc2', 
             fieldLabel: 'SBC2', 
			 width: '90%',
             id: 'SBC2',
			 allowBlank: false, 
			 maxLength: 6, //regex, regexText, maskRe
			 maxLengthText :'El tama&ntilde;o m&aacute;ximo requerido es 6 caracteres.'
		});
		
		this.nfcambiosbc3 =new Ext.form.TextField({
             name: 'nfcambiosbc3', 
             fieldLabel: 'SBC3', 
			 width: '99%',
             id: 'SBC3',
			 allowBlank: false, 
			 maxLength: 6, //regex, regexText, maskRe
			 maxLengthText :'El tama&ntilde;o m&aacute;ximo requerido es 6 caracteres.'
		});
		
		this.tfDescripModSBC = new Ext.form.TextArea({id:'tfDescripModSBC',
                                        fieldLabel:'Descripci&oacute;n', tabIndex: 5, 
                                        name: 'descripcion', allowBlank: false, 
                                        hiddenname:'descripcion', 
										maxLength: 255, //regex, regexText, maskRe
										maxLengthText :'El tama&ntilde;o m&aacute;ximo requerido es 255 caracteres.',
										anchor: '99%', prevTab: 'iddfFFinTarifa', nextTab: 'idbtnCancelarTarifa',
                                        blankText:'Este campo es obligatorio.', 
                                });

        //Formulario de tipos de tarifa.
        this.formularioModSBC = new Ext.FormPanel({
            id:'formularioModSBC',
            labelAlign: 'top',
            frame:true,
            width: 300,
            autoHeight:true, 
            bodyStyle: {
                padding: '10px 10px 10px 10px',
            },  
            items:[{layout: 'column',
                    items: [
                        {columnWidth: .33, layout: 'form', items: [this.nfcambiosbc1]},
                        {columnWidth: .33, layout: 'form', items: [this.nfcambiosbc2]},
                        {columnWidth: .33, layout: 'form', items: [this.nfcambiosbc3]}
                    ]
                }, this.tfDescripModSBC]
        });
		
		//Botones de la ventana de tipos de tarifa
        this.btnCancelarModSBC = new Ext.Button({
            id:'btnCancelarModSBC',
            iconCls:'cancelar',
            text:'Cancelar',   
            tooltip:'Cancelar',
        });
        
       this.btnAceptarModSBC = new Ext.Button({
            id:'btnAceptarModSBC',
            iconCls:'aceptar',
            text:'Aceptar',   
            tooltip:'Aceptar'
        });
		
       //Ventana de adicionar y modificar tipos de tarifa.
        this.ventanaCausaModSBC = new Ext.Window({
            modal: true,
			title: 'Descripci&oacute;n del cambio ',
            closeAction: 'hide',
            autoHeight: true,
            constrain: true,
            closable:true,
            resizable:false, 
            layout: 'fit',
            items:[this.formularioModSBC],
            buttons: [this.btnCancelarModSBC, this.btnAceptarModSBC] 
        });
       
       this.gpExportarSBC = new Ext.grid.EditorGridPanel({
                store: modelo.stExportarSBC,
                region: 'center',
                border: false,
                loadMask: {text: 'Cargando...'},
                width: 200,
                autoScroll: true,
				columns: [{header: 'idpagoresultado', dataIndex: 'idpagoresultado', width: 100, hidden: true, hideable: false},
				          {header: 'idpersona', dataIndex: 'idpersona', width: 100, hidden: true, hideable: false},
								new Ext.grid.RowNumberer(),
                                {header: 'Ci', dataIndex: 'ci', width: 80, hideable: false, sortable: true},
                                {header: 'Nombre y apellidos', dataIndex: 'nombreyapellidos', width: 250, hideable: false, sortable: true},
								{dataIndex: 'sbct', header: 'SBCt', width: 100, hideable: false, renderer: this.fnRenderExportar, sortable: true},
                                {dataIndex: 'evalarea', header: 'Eval. &Aacute;rea', width: 100, hideable: false, renderer: this.fnRenderExportar, sortable: true}, 
                                {dataIndex: 'evalindividual', header: 'Eval. Indiv.', width: 100, hideable: false, renderer: this.fnRenderExportar, sortable: true},
                                {dataIndex: 'cpd', header: 'CPDt', width: 100, hideable: false, renderer: this.fnRenderExportar, sortable: true},
                                {dataIndex: 'sbctcpd', header: 'SBCt*CDPt', width: 100, hideable: false, renderer: this.fnRenderExportar, sortable: true},
                                {dataIndex: 'ids', header: 'IDSt', width: 100, hideable: false, renderer: this.fnRenderExportar, sortable: true},
                                {dataIndex: 'ctrt', header: 'CTRt', width: 100, hideable: false, renderer: this.fnRenderExportar, sortable: true}
                                
                ],
                sm: new Ext.grid.RowSelectionModel({
					singleSelect: true
				}),
				bbar:new Ext.PagingToolbar({ 
                pageSize: 20, 
                store: modelo.stExportarSBC,
                displayInfo: true, 
                displayMsg: 'Mostrando  {0} - {1} de {2}', 
                emptyMsg: "0 Resultado a mostrar" 
            }),
				tbar: [this.btnActualizarReporte, this.btnModificarSBC,'|', ' ',' ',' ',' ',' ',' ',' ',' ', "Salario por resultado (<b>SRD<b>):", this.nfMontoTotal, '|', 'Buscar:', this.tfBuscar, this.btnBuscar]
         });
       
       
       this.winExportarSBC = new Ext.Window({
            title: 'Salarios Base de Calculo para el Pago por Resultados',
            modal: true,
            height: 600,
            width: 800,
           constrain: true,
            closable:true,
            closeAction: 'hide',
            resizable:false,
            layout: 'fit',
            items: [this.gpExportarSBC]
       });
	   
	}   
}
