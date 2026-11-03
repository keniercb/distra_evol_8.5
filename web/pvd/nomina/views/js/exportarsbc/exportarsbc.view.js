Ext.ns('Pvd.Nomina.SBC.ExportarSBC');
Ext.QuickTips.init();

Pvd.Nomina.SBC.ExportarSBC.Vista = {
    init: function(perfil, idioma, modelo){
        
		this.acumuladoneto = 0.00;
		this.recordperiodopagoexportarseleccionado = null;
		//this.recordperiodopagoexportarseleccionado = null;
		this.arrayidelaborarpagos = new Array();
				
        //Panel de estructura y composición que cargo hasta el nivel de entidades.
        this.pEstEntidades = new Ext.pvd.persona.buscarestructura.panelBuscarestructura({
            layout: 'border',
            nivel: 5
        });

        //Botón  para cargar las personas pertenecientes a la unidad selecionada.
        this.btnAceptarEntidades = new Ext.Button({
            id: 'btnAceptarEntidades',
            text: 'Aceptar',
            tooltip: '',
            disabled: true,
            iconCls: 'aceptar'
        });


        this.btnAyuda = new Ext.Button({
            id     : 'btnAyuda',
            text   : "Ayuda",
            tooltip: 'Ayuda de la funcionalidad',
            iconCls: 'ayuda',

        });
        //Vista para el componente Buscar estructura 
        this.winEstEntidades = new Ext.Window({
            title: 'Entidades',
            modal: true,
            height: 350,
            width: '30%',
            constrain: true,
            closable:false,
            resizable:false,
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
           constrain: true,
            closable:true,
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
            iconCls: 'actualizar',
			//disabled :true,
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
            anchor: '99%',
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
            tooltip:'Aceptar',
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
				//title:'Listado',
                border: false,
                loadMask: {text: 'Cargando...'},
                width: 100,
                autoScroll: true,
				columns: [{header: 'iddatossbc', dataIndex: 'iddatossbc', width: 100, hidden: true, hideable: false},
				          {header: 'idpersona', dataIndex: 'idpersona', width: 100, hidden: true, hideable: false},
								new Ext.grid.RowNumberer(),
                                {header: 'Ci', dataIndex: 'ci', width: 130, hideable: false, sortable: true},
                                {header: 'Nombre y apellidos', dataIndex: 'nombreyapellidos', width: 200, hideable: false, sortable: true},
                                {dataIndex: 'sbc1', header: 'SBC1', width: 60, hideable: false, renderer: this.fnRenderExportar, sortable: true}, 
                                {dataIndex: 'sbc2', header: 'SBC2', width: 60, hideable: false, renderer: this.fnRenderExportar, sortable: true},
                                {dataIndex: 'sbc3', header: 'SBC3', width: 60, hideable: false, renderer: this.fnRenderExportar, sortable: true},
                                {dataIndex: 'sbct', header: 'SBCt', width: 60, hideable: false, renderer: this.fnRenderExportar, sortable: true},
                                {dataIndex: 'evalindividual', header: 'ED', width: 60, hideable: false,/* renderer: this.fnRenderExportar, sortable: true*/},
                                {dataIndex: 'evalcolectiva', header: 'IPc', width: 60, hideable: false, /*renderer: this.fnRenderExportar, sortable: true*/},
                               
                                {dataIndex: 'ids', header: 'IDSt', width: 60, hideable: false, /*renderer: this.fnRenderExportar, sortable: true*/},
                                {dataIndex: 'ctrt', header: 'SPRt', width: 60, hideable: false, /*renderer: this.fnRenderExportar, sortable: true*/},
                                {dataIndex: 'area', header: 'area', width: 60, hideable: false ,hidden:true/*renderer: this.fnRenderExportar, sortable: true*/},
                                {dataIndex: 'idarea', header: 'idarea', width: 60, hideable: false,hidden:true /*renderer: this.fnRenderExportar, sortable: true*/},
								{dataIndex: 'a ', header: '  ', width: 60, hideable: false, /*renderer: this.fnRenderExportar, sortable: true*/},
                ],
				view: new Ext.grid.GroupingView({
					forceFit: true,
					startCollapsed: false,
					groupTextTpl: '{group}'
				}),
                sm: new Ext.grid.RowSelectionModel({
					singleSelect: true
				}),
				bbar:new Ext.PagingToolbar({ 
					pageSize: 1000, 
					store: modelo.stExportarSBC,
					displayInfo: true, 
					displayMsg: 'Mostrando  {0} - {1} de {2}', 
					emptyMsg: "0 Resultado a mostrar" 
            }),
				tbar: [/*this.btnActualizarReporte,*/ this.btnModificarSBC,/*'|', ' ',' ',' ',' ',' ',' ',' ',' ', "Salario por resultado (<b>SRD<b>):", this.nfMontoTotal, '|', */'Buscar:', this.tfBuscar, this.btnBuscar]
         });
       
       
	   //grid editable con las areas
		
		this.smAreas = new Ext.grid.CheckboxSelectionModel({
                singleSelect: false,
            });	
		this.tfMonto = new Ext.form.NumberField({name: 'montotal',  width: '80%',
												id: 'nfMontoTotal',
												});
	    this.gpAreas = new Ext.grid.EditorGridPanel({
                store: modelo.stPlantillaNAreas,
				region:'center',
                loadMask: {text: 'Cargando...'},
                height:200,
                sm: this.smAreas,
                //title:'Listado de plantillas nominales',
				columns: [this.smAreas
					,{header: 'idarea', hidden: true, hideable: false, dataIndex: 'idplantillanominal'} 
                    ,{header: '<center>'+'&Aacute;rea'+'<\center>', width: 400, dataIndex: 'area'}
                    //,{header: 'Denominaci&oacute;n', width: 300, sortable: true, dataIndex: 'denominacion',renderer: this.fnRenderExportar,}
                    //,{header: 'Fecha inicio',  width: 85, sortable: true, dataIndex: 'fechainicio',renderer: this.fnRenderExportar,}
                    //,{header: 'Fecha fin',  width: 85, sortable: true, dataIndex: 'fechafin',renderer: this.fnRenderExportar,}
                    ,{header: '<center>'+'Monto'+'<\center>', width: 200, sortable: true, dataIndex:'valor', renderer: this.fnRenderExportar,editor:this.tfMonto,}
                                
                ],
                frame: true,
                clicksToEdit: 1,
                bbar: new Ext.PagingToolbar({
                    pageSize: 1000,
                    store: modelo.stPlantillaNAreas,
                    displayInfo: true
                }),
				tbar:[this.btnActualizarReporte,'->',this.btnAyuda]
                
            });
			
		this.plantillaDatos1 = new Ext.XTemplate(
			'<div>',
					'<p><span style="color:grey;"><b>Datos pago </b></span></p>',
					'<p><span style="color:green;"><b>Cantidad de persona: </b>{datos}</span></p>',
					//'<p><span style="color:green;"><b>Per&iacute;odo de pago: </b>{periodopago}</span></p>',
					'<p><span style="color:green;"><b>Personas con IPc: </b>{ipc}</span></p>',
					//'<p><span style="color:green;"><b>Rango de fechas: </b>{rangofechas}</span></p>',
					'<p></p><p></p>',
					//'<p><span style="color:grey;"><b>Datos contables </b></span></p>',
					//'<p><span style="color:green;"><b>Cantidad personas: </b>{totalpersonas}</span></p>',
					//'<p><span style="color:green;"><b>Cantidad personas en Centros de costo: </b>{totalpersonascc}</span></p>',
				'<p><span style="color:grey;"><b>Personas por &aacute;rea </b></span></p>',
				'<tpl for="persAreas">',
            '<p><span style="color:green;"><b>{area}:</b> {cantidad}</span></p>',
            '</tpl>',
            '</div>'
		);
		
	    this.plantillaDatos1.compile();
				
		this.pDatosPeriodoPago = new Ext.Panel({
			title: 'Informaci&oacute;n',
			region: 'west',
			height: 150,
			width: 350,
			split: true,
			collapsible: true
		});	
		
		this.pDatosAreas = new Ext.Panel({
		    title: ' ',
			region: 'north',
			layout: 'border',
			border: false,
			split: true,
			height: 200,
			collapsible: true,
			items: [this.pDatosPeriodoPago,this.gpAreas]
		});
		
       this.winExportarSBC = new Ext.Window({
            title: 'Salarios Base de Calculo para el Pago por Resultados',
			layout:'border',
            modal: true,
            height: 600,
           constrain: true,
            width: 800,
            closable:true,
            closeAction: 'hide',
            resizable:false,
            //layout: 'fit',
            items: [this.pDatosAreas,this.gpExportarSBC]
       });
	   
	}   
}
