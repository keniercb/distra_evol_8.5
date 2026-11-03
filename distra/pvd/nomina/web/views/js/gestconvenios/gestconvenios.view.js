Ext.ns('Pvd.Nomina.Configuracion.GestConvenios');

Ext.QuickTips.init();

//Vista del componente Gestionar convenios.
Pvd.Nomina.Configuracion.GestConvenios.Vista = {
    /**
     * Inicializar la vista.
     * 
     * @param perfil Objeto que contiene el perfil de la IU (Tipo: Object).
     * @param idioma Objeto que contiene el idioma de los textos de la IU (Tipo: Object).
     * @param modelo Modelo de la vista del componente Gestionar subordinacion (Tipo: Pvd.Nomina.Configuracion.GestConvenios.Modelo).
     */
    init: function(perfil, idioma, modelo) {

        //Botones de Asoc, Elim subordinacion.
        this.btnAddGestConvenioss = new Ext.Button({
            id: 'btnAsociarGestConvenioss',
            text: idioma.lbbtnAsociarGestConvenioss,
            tooltip: idioma.textToolTipbtnAsociarGestConvenioss,
            iconCls: 'adicionar',
            prevTab: '',
            nextTab: ''
		});
		
		//Botones de Asoc, Elim subordinacion.
        this.btnModGestConvenios = new Ext.Button({
            id: 'btnModGestConvenioss',
            text: idioma.lbbtnModGestConvenioss,
            tooltip: idioma.textToolTipbtnModGestConvenioss,
            iconCls: 'modificar',
            prevTab: '',
            nextTab: '',
			disabled: true
        });
		
		this.btnDelGestConvenioss = new Ext.Button({
            id: 'btnDesasociarGestConvenioss',
            text: idioma.lbbtnbtnDesasociarGestConvenioss,
            tooltip: idioma.textToolTipbtnbtnDesasociarGestConvenioss,
            iconCls: 'eliminar',
            prevTab: '',
            nextTab: '',
			disabled: true
        });
		
		//Gest. modelo de aplicacion de convenios
		this.btnGestModeloAplicacionConvenio = new Ext.Button({
            id: 'GestModeloAplicacionConvenio',
            text: idioma.lbGestModeloAplicacionConvenio,
            tooltip: idioma.textToolTipGestModeloAplicacionConvenio,
            iconCls: 'comprobante',
            prevTab: '',
            nextTab: '',
			disabled: true
        });

        //Aprobar convenio
        this.btnAprobarConvenio = new Ext.Button({
            id: 'btnAprobarConvenio',
            text: 'Aprobar convenio',
            tooltip: 'Aprobar convenio',
            iconCls: 'aprobar',
            disabled: true
        });
		
		//Elementos del grid de los GestConvenioss
		this.expanderGestConvenioss = new  Ext.grid.RowExpander({
            tpl : new Ext.Template(
                '<div style="word-wrap:break-word;white-space:normal;"><p>&nbsp;&nbsp;Descripci&oacute;n:&nbsp;{descripcion}</p><br/></div>'
            ),enableCaching: false
        });
		
		this.smGestConvenioss = new Ext.grid.CheckboxSelectionModel();

        this.gpGestConvenioss = new Ext.grid.GridPanel({
            id:'idgpGestConvenioss',
            title:idioma.lbTitleGestConvenioss,
            region:'center',
            columns: [this.smGestConvenioss
			        ,this.expanderGestConvenioss
			        ,{header: 'idGestConvenios',    hidden: true, hideable: false, dataIndex: 'idconvenio'} 
					,{header: 'N&uacute;mero convenio', width: 30, sortable: true, dataIndex: 'numeroconvenio', renderer:cambiarColores}
					,{header: 'Denominaci&oacute;n', width: 100, sortable: true, dataIndex: 'denominacion', renderer:cambiarColores}
					,{header: '% ejecuci&oacute;n', width: 40, sortable: true, dataIndex: 'porcientoejecucion', renderer:cambiarColores}
					,{header: 'Salario', width: 40, sortable: true, dataIndex: 'salario', renderer:cambiarColores}
					,{header: '% de penalizac&oacute;n', width: 40, sortable: true, dataIndex: 'penalizacion', renderer:cambiarColores}
					,{header: 'Tiene modelo', width: 40, sortable: true, dataIndex: 'definido', renderer: activarImagen}
					,{header: 'Fecha inicio', width: 40, sortable: true, dataIndex: 'fechainicio', renderer:cambiarColores}
                    ,{header: 'Fecha fin', width: 40, sortable: true, dataIndex: 'fechafin', renderer:cambiarColores}
                    ,{header: 'Obra', width: 40, sortable: true, hidden:true, dataIndex: 'obra'}
                    ,{header: '', width: 1, sortable: false, dataIndex: ''}

            ],
            stripeRows: true,
            autoScroll:true,
            border: true,
            width: '50%', 
            heigth: '100%', 
            viewConfig: {forceFit: true},
            view: new Ext.grid.GroupingView({
                forceFit:true,
                groupTextTpl: '{text}'
            }),
            store: modelo.storeConvenios,
            sm: this.smGestConvenioss,
			plugins:this.expanderGestConvenioss,
            loadMask:{msg : idioma.lbMaskGridCargando},
			bbar:new Ext.PagingToolbar({ 
                pageSize: 20, 
                store: modelo.storeConvenios,
                displayInfo: true, 
                displayMsg: 'Mostrando  {0} - {1} de {2}', 
                emptyMsg: "0 Resultado a mostrar" 
            })
        });
		
		function activarImagen(val, metaData, record, rowIndex, colIndex, store){
			    if(val == 1){
				  return '<center><img src="/lib/ExtJS/temas/default/images/iconos/aceptar.png" height=16 width=16 /></center>';
				}else{
				  return '<center><img src="/lib/ExtJS/temas/default/images/iconos/cancelar.png" height=16 width=16 /></center>';
				}
				 
	    }

        function cambiarColores(val, metaData, record, rowIndex, colIndex, store){
            if(record.get('aprobado') == 1){
                return '<span style="color:#0000ff">'+val+'</span>';
            }else{
                return '<span style="color:#550000">'+val+'</span>';
            }

        }
		
		//Panel del grid de GestConvenioss
		this.panelconvenios = new Ext.Panel({
            region: 'west',
            height: '100%',
            width: '100%',
            split: true,
            border: true,
            layout:'fit',
			tbar:[this.btnAddGestConvenioss, this.btnModGestConvenios,this.btnDelGestConvenioss, ' ',' ',' ',' ',' ',this.btnGestModeloAplicacionConvenio, this.btnAprobarConvenio],
			items:[this.gpGestConvenioss]
		});
		
		//Campos del formulario de convenios.
		this.nfNumeroConvenio = new Ext.form.TextField({id: 'nfNumeroConvenio', fieldLabel: 'N&uacute;mero convenio',
                                       tabIndex: 2, name: 'numeroconvenio', allowBlank: false, anchor: '85%',
									   blankText:idioma.lbErrorCampoVacio,
                                       maskRe :/[0-9.]/i,
			                           regex :/^\d+(\.\d{1,2})?$/i,
			                           regexText:'Este valor es incorrecto'
        });
		
        this.tfDenomConvenio = new Ext.form.TextField({id:'idtfDenomConvenio', fieldLabel:idioma.lbColDenominacion, 
                                        tabIndex: 2, name: 'denominacion', allowBlank: false,  anchor: '90%',
                                        prevTab: 'idbtnAceptarConvenio',
                                        regex:/^([a-zA-ZÁÉÍÓÚáéíóúñüÑ\d ]+(\d*)?)+$/,
                                        regexText:idioma.lbDenomIncorr, //maskRe
                                        blankText:idioma.lbErrorCampoVacio,
										maxLength:100,
                                        maxLengthText:idioma.lbMaxText_100
        });

        this.cbObra = new Ext.form.ComboBox({id: 'cbObra', msgTarget : 'qtip', enableQtip : true, store: modelo.storeObras, fieldLabel: 'Obra',
                                       mode: 'local', displayField : 'denominacion', hiddenName : 'idobra',
                                       valueField : 'idobra', typeAhead: true, triggerAction: 'all', forceSelection : true,
                                       emptyText:'Seleccione...', anchor: '99%', allowBlank:false, blankText:idioma.lbErrorCampoVacio
        });
		
		this.nfPorcientoTerminacion = new Ext.form.TextField({id: 'nfPorcientoTerminacion', fieldLabel: '% ejecución',
                                       tabIndex: 2, name: 'porcientoejecucion', allowBlank: false, anchor: '77%',
									   blankText:idioma.lbErrorCampoVacio,
                                       maskRe :/[0-9.]/i,
			                           regex :/^\d+(\.\d{1,2})?$/i,
			                           regexText:'Este valor es incorrecto'
        });
		
		this.nfSalario = new Ext.form.TextField({id: 'nfSalario', fieldLabel: 'Salario',
                                       tabIndex: 2, name: 'salario', allowBlank: false, anchor: '90%',
									   blankText:idioma.lbErrorCampoVacio,
                                       maskRe :/[0-9.]/i,
			                           regex :/^\d+(\.\d{1,2})?$/i,
			                           regexText:'Este valor es incorrecto'
        });
		
		this.nfPenalizacion = new Ext.form.TextField({id: 'nfPenalizacion', fieldLabel: '% penalizaci&oacute;n',
                                       tabIndex: 2, name: 'penalizacion', allowBlank: false, anchor: '98%',
									   blankText:idioma.lbErrorCampoVacio,
                                       maskRe :/[0-9.]/i,
			                           regex :/^\d+(\.\d{1,2})?$/i,
			                           regexText:'Este valor es incorrecto'
        });
         
	    this.dfFInicioConvenio = new Ext.form.DateField({id:'iddfFInicioConvenio', fieldLabel:idioma.lbColDesde, 
                                        tabIndex: 3, name: 'fechainicio', allowBlank: false,
                                        format:'d/m/Y', editable:true, readOnly : false, 
                                        value: new Date().format('d/m/Y'), maxText : idioma.lbFechaMaxima, 
                                        minText : idioma.lbFechaMinima, blankText:idioma.lbErrorCampoVacio, 
                                        invalidText: idioma.invalidTextFecha, //vtype:'daterange',
                                        anchor: '90%', endDateField: 'iddfFFinConvenio',
                                        blankText:'Este campo es obligatorio.'
                                });
                                
        this.dfFFinConvenio = new Ext.form.DateField({id:'iddfFFinConvenio', fieldLabel:idioma.lbColHasta, 
                                        tabIndex: 4, name: 'fechafin', xtype: 'datefield', allowBlank: false,
                                        format:'d/m/Y', editable:true, readOnly : false, value: new Date().format('d/m/Y'),
                                        maxText : idioma.lbFechaMaxima, minText : idioma.lbFechaMinima, 
                                        blankText:idioma.lbErrorCampoVacio, invalidText: idioma.invalidTextFecha, 
                                        //vtype:'daterange',
                                         anchor: '99%', startDateField: 'iddfFInicioConvenio',
                                        allowBlank: false, blankText:'Este campo es obligatorio.'
                                });
                                
        this.tfDescripConvenio = new Ext.form.TextArea({id:'idtfDescripConvenio',
                                        fieldLabel:idioma.lbColDescripcion, tabIndex: 5, 
                                        name: 'descripcion', allowBlank: true,
                                       	maxLength: 255, //regex, regexText, maskRe
										maxLengthText : idioma.lbMaxText_255, 
                                        anchor: '99%', prevTab: 'iddfFFinConvenio', nextTab: 'idbtnCancelarConvenio',
                                        blankText:idioma.lbErrorCampoVacio
                                });

        //Formulario de convenios.
        this.formularioConvenio = new Ext.FormPanel({
            id:'idformlarioConvenio',
            labelAlign: 'top',
            frame:true,
            width: 500,
            autoHeight:true, 
            bodyStyle: {
                padding: '10px 10px 10px 10px'
            },  
            items:[{layout:'column',
                      items:[
                            {columnWidth:.54, layout: 'form', items: [this.tfDenomConvenio]},
                            {columnWidth:.46, layout: 'form', items: [this.cbObra]}
                       ]
                    },{layout:'column',
                        items:[
                            {columnWidth:.29, layout: 'form', items: [this.nfNumeroConvenio]},
                            {columnWidth:.25, layout: 'form', items: [this.nfPorcientoTerminacion]},
                            {columnWidth:.26, layout: 'form', items: [this.nfSalario]},
                            {columnWidth:.20, layout: 'form', items: [this.nfPenalizacion]}
                        ]
                    },{layout:'column',
                        items:[
                            {columnWidth:.54, layout: 'form', items: [this.dfFInicioConvenio]},
                            {columnWidth:.46, layout: 'form', items: [this.dfFFinConvenio]}
                        ]
                    },
                    this.tfDescripConvenio
            ]
        });

        //Botones de la ventana de convenios
        this.btnCancelarConvenio = new Ext.Button({
            id:'idbtnCancelarConvenio',
            iconCls:'cancelar',
            text:idioma.lbBtnCancelar,   
            tooltip:idioma.textToolTipCancelar,
            prevTab: 'idtfDescripConvenio', 
            nextTab: 'idbtnAplicarConvenio'
        });
        
        this.btnAplicarConvenio = new Ext.Button({
            id:'idbtnAplicarConvenio',
            iconCls:'aplicar',
            text:idioma.lbBtnAplicar,   
            tooltip:idioma.textToolTipAplicar,
            prevTab: 'idbtnCancelarConvenio', 
            nextTab: 'idbtnAceptarConvenio'
        });

        this.btnAceptarConvenio = new Ext.Button({
            id:'idbtnAceptarConvenio',
            iconCls:'aceptar',
            text:idioma.lbBtnAceptar,   
            tooltip:idioma.textToolTipAceptar,
            prevTab: 'idbtnAplicarConvenio', 
            nextTab: 'idtfDenomConvenio'
        });

        //Ventana de adicionar y modificar convenios.
        this.ventanaConvenio = new Ext.Window({
            modal: true,
            closeAction: 'hide',
            autoHeight: true,
            closable:true,
            constrain: true,
            resizable:true, 
            layout: 'fit',
            items:[this.formularioConvenio],
            buttons: [this.btnCancelarConvenio, this.btnAplicarConvenio, this.btnAceptarConvenio]
        });
		
		//Radio group para escojer el tipo de destajo
		this.rbDestajoIndividual = new Ext.form.Radio({id:'individual', boxLabel: 'Individual', name: 'tipodestajo', inputValue: 1});
		this.rbDestajoColectivo = new Ext.form.Radio({id:'colectivo', boxLabel: 'Colectivo', name: 'tipodestajo', inputValue: 2});
		this.rgTipoDestajo = new Ext.form.RadioGroup({
				region: 'center',
                height: '100%',
                hideLabel : true,
                items: [this.rbDestajoColectivo, this.rbDestajoIndividual]
        });
		
		//Formulario para escojer el tipo de destajo.
        this.formularioTipoDestajo = new Ext.FormPanel({
            id:'formularioTipoDestajo',
            labelAlign: 'top',
            frame:true,
            width: 400,
            autoHeight:true, 
            bodyStyle: {
                padding: '10px 10px 10px 10px'
            },  
            items:[this.rgTipoDestajo]
        });

        //Botones de la ventana para escojer el tipo de destajo
        this.btnCancelarTipoDestajo = new Ext.Button({
            id:'btnCancelarTipoDestajo',
            iconCls:'cancelar',
            text:'Cancelar',   
            tooltip:'Cancelar',
            prevTab: 'idtfDescripConvenio', 
            nextTab: 'idbtnAplicarConvenio'
        });
        
        this.btnAceptarTipoDestajo = new Ext.Button({
            id:'btnAceptarTipoDestajo',
            iconCls:'aceptar',
            text:'Aceptar',   
            tooltip:'Aceptar',
            prevTab: 'idbtnAplicarConvenio', 
            nextTab: 'idtfDenomConvenio'
        });

        //Ventana para escojer el tipo de destajo.
        this.ventanaTipoDestajo = new Ext.Window({
            title: 'Tipo de destajo',
            modal: true,
            closeAction: 'hide',
            constrain: true,
            autoHeight: true,
            closable:true,
            resizable:false, 
            layout: 'fit',
            items:[this.formularioTipoDestajo],
            buttons: [this.btnCancelarTipoDestajo, this.btnAceptarTipoDestajo]
        });
		
		this.pobjestructura = new Ext.pvd.persona.buscarestructura.panelBuscarestructura({
        	layout: 'border',
            region:'center',
            nivel: 3,
            nivelchequear: 3
            
        });
		
		this.btnAceptarEntidad = new Ext.Button({
            id: 'btnAceptarEntidad',
            text: 'Aceptar',
            tooltip: 'Aceptar entidad',
            disabled: true,
            iconCls: 'aceptar'
        });
		
		this.winEstructura = new Ext.Window({
            title: 'Entidades',
            modal: true,
            height: 350,
            width: 300,
            constrain: true,
            closable:false,
            resizable:false, 
            layout: 'fit',
            items:[this.pobjestructura],
            buttons: [this.btnAceptarEntidad] 
        });
             
        //Vista general de la interfaz.
        this.windowConvenios = new Ext.Window({
            title: 'Entidades',
            modal: true,
            height: 350,
            width: 300,
            constrain: true,
            closable:false,
            resizable:false, 
            layout: 'fit',
            items:[this.panelconvenios]
        });
		
		/*this.gestmodeloaplicacionconvenio = new Pvd.Nomina.gestmodeloaplicacionconvenio({
		      tipoconvenio:1,
			  idconvenio:0,
			  idestructura:0,
			  numeroconvenio:0,
			  salario:0
		});*/
		            	
	}
};

//Inicializando la vista.
UCID.portal.cargarEtiquetas('gestconvenios', function(perfil, idioma){
    perfil = arguments[0];
	idioma = arguments[1];
	
    //Inicializando el modelo.
    var modelo = Pvd.Nomina.Configuracion.GestConvenios.Modelo;
    modelo.init();
    //Inicializando la vista.
	var vista = Pvd.Nomina.Configuracion.GestConvenios.Vista;
    vista.init(perfil, idioma, modelo);
    //Inicializar controlador.
    Pvd.Nomina.Configuracion.GestConvenios.Controlador.init(idioma, vista, modelo);
});
