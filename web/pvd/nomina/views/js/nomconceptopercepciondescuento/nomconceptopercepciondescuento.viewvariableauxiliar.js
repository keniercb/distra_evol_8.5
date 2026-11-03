Ext.ns('Pvd.Nomina.Nomencladores.ConceptoPD');

Ext.QuickTips.init();

//Vista de gestionar variables auxiliares del componente Nomenclador de conceptos de percepciones y descuentos.
Pvd.Nomina.Nomencladores.ConceptoPD.VistaVariableAuxiliar = {
    /**
     * Inicializar la vista.
     * 
     * @param perfil Objeto que contiene el perfil de la IU (Tipo: Object).
     * @param idioma Objeto que contiene el idioma de los textos de la IU (Tipo: Object).
     * @param modelo Modelo de la vista del componente Nomenclador de conceptos de percepciones y descuentos(Tipo: Pvd.Nomina.Nomencladores.ConceptoPD.Modelo).
     */
    init: function(perfil, idioma, modelo) {
	
		//Botones de Add, Mod, Elim variables auxiliares de f�rmula.
        this.btnAdicionarVariable = new Ext.Button({
            id: 'idbtnAdicionarVariable',
            text: idioma.lbBtnAdicionar,
            tooltip: idioma.textToolTipAddVariable,
          //  icon: perfil.dirImg+'adicionar.png',
            iconCls: 'adicionar',
            prevTab: 'idbtnEliminarVariable',
            nextTab: 'idbtnModificarVariable',
        });

        this.btnModificarVariable = new Ext.Button({
            id: 'idbtnModificarVariable',
            text: idioma.lbBtnModificar,
            tooltip: idioma.textToolTipModVariable,
           // icon: perfil.dirImg+'modificar.png',
            iconCls: 'modificar',
            prevTab: 'idbtnAdicionarVariable',
            nextTab: 'idbtnEliminarVariable',
        });

        this.btnEliminarVariable = new Ext.Button({
            id: 'idbtnEliminarVariable',
            text: idioma.lbBtnEliminar,
            tooltip: idioma.textToolTipElimVariable,
         //   icon: perfil.dirImg+'eliminar.png',
            iconCls: 'eliminar',
            prevTab: 'idbtnModificarVariable',
            nextTab: 'idbtnAdicionarVariable',
        });
		
		//Listado de variables auxiliares de f�rmula.
		function centrarValor(val){
            if(val)
                return "<center>"+val+"</center>";
        }
		
        this.smVariable = new Ext.grid.RowSelectionModel({
            singleSelect:true,
        });

        this.gpVariable = new Ext.grid.GridPanel({
            id:'idgpVariable',
            title:idioma.lbTitleVariable,
            region:'center',
            columns: [{header: 'idvariableauxiliarformula',  hidden: true, hideable: false, dataIndex: 'idvariableauxiliarformula'}
                    ,{header: idioma.lbColDenominacion, width: 100, sortable: true, dataIndex: 'denominacion'}
                    ,{header: '<center>'+idioma.lbColFormaEntrada+'</center>', fixed : true, width: 100, sortable: true, dataIndex: 'denomtipoentrada', renderer:centrarValor}
                    ,{header: '<center>'+idioma.lbColDenomReporte+'</center>', fixed : true, width: 100, sortable: true, dataIndex: 'denomreporte', renderer:centrarValor}
                    ,{header: '<center>'+idioma.lbColDenomVarReporte+'</center>', fixed : true, width: 100, sortable: true, dataIndex: 'denomvarreporte', renderer:centrarValor}
            ],
            stripeRows: true,
            autoScroll:true,
            border: false,
            width: '100%', 
            heigth: '100%',
            viewConfig: {forceFit: true},
            store: modelo.storeVariable,
            sm: this.smVariable,
            loadMask:{msg : idioma.lbMaskGridCargando},
        });
		
		//Campo del formulario de variables auxiliares.
		this.tfDenomVariable = new Ext.form.TextField({id:'idtfDenomVariable', fieldLabel:idioma.lbColDenominacion, 
										prevTab: 'idbtnAceptarVariable', nextTab: 'idcbFormaEntradaVariable',
                                        name: 'denominacion', allowBlank: false,  anchor: '90%',
            vtype                                     : 'vtdenominaciones',
                                        blankText:idioma.lbErrorCampoVacio, 
                                        /*maxLength:idioma.lbErrorCampoVacio,
                                        maxLengthText:idioma.lbErrorCampoVacio, 
                                        minLength:idioma.lbErrorCampoVacio, 
                                        minLengthText:idioma.lbErrorCampoVacio, 
                                        maskRe:idioma.lbErrorCampoVacio, 
                                        regex:idioma.lbErrorCampoVacio, 
                                        regexText:idioma.lbErrorCampoVacio*/
                                });
								
		this.cbFormaEntradaVariable = new Ext.form.ComboBox({id:'idcbFormaEntradaVariable', fieldLabel:idioma.lbColFormaEntrada, 
                                        valueField: 'idtipoentrada',
                                        displayField: 'denominacion', hiddenName: 'idtipoentrada',
                                        allowBlank: false, mode: 'local', 
                                        store: modelo.storeFormaEntradaVariable, emptyText: 'Seleccione...',
                                        blankText:idioma.lbErrorCampoVacio, readOnly: true, 
                                        triggerAction: 'all', anchor: '99%'
                                });
		
		this.cbTipoReporteVariable = new Ext.form.ComboBox({id:'idcbTipoReporteVariable', fieldLabel:idioma.lbColDenomReporte, 
                                        valueField: 'idconfreportescertificaciones',
                                        displayField: 'denominacion', hiddenName: 'idconfreportescertificaciones',
                                        allowBlank: false, mode: 'local', 
                                        store: modelo.storeTipoReporteVariable, emptyText: 'Seleccione...',
                                        blankText:idioma.lbErrorCampoVacio, readOnly: true, 
                                        triggerAction: 'all', anchor: '90%'
                                });
		this.cbVarReporteVariable = new Ext.form.ComboBox({id:'idcbVarReporteVariable', fieldLabel:idioma.lbColDenomVarReporte, 
                                        valueField: 'idvariablesconfreportescertificaciones',
										prevTab: 'idcbTipoReporteVariable', nextTab: 'idbtnCancelarVariable',
                                        displayField: 'denominacion', hiddenName: 'idvariablesconfreportescertificaciones',
                                        allowBlank: false, mode: 'local', 
                                        store: modelo.storeVarReporteVariable, emptyText: 'Seleccione...',
                                        blankText:idioma.lbErrorCampoVacio, readOnly: true, 
                                        triggerAction: 'all', anchor: '99%'
                                });
							
		 //Formulario de variables auxiliares.
        this.formularioVariable = new Ext.FormPanel({
            id:'idformularioVariable',
            labelAlign: 'top',
            frame:true,
            width: 400,
            autoHeight:true, 
            bodyStyle: {
                padding: '10px 10px 10px 10px',
            },  
			items:[{layout:'column',
					items:[
						{columnWidth:.6, layout: 'form', items: [this.tfDenomVariable]},
						{columnWidth:.4, layout: 'form', items: [this.cbFormaEntradaVariable]}
						
					]
					},{
					layout:'column',
					items:[
						{columnWidth:.6, layout: 'form', items: [this.cbTipoReporteVariable]},
						{columnWidth:.4, layout: 'form', items: [this.cbVarReporteVariable]}
					]
					}],
        });

        //Botones de la ventana de adicionar/modificar variables auxiliares.
        this.btnCancelarVariable = new Ext.Button({
            id:'idbtnCancelarVariable',
            iconCls:'cancelar',
          //  icon:perfil.dirImg+'cancelar.png',
            text:idioma.lbBtnCancelar,   
            tooltip:idioma.textToolTipCancelar,
            prevTab: 'idcbVarReporteVariable', 
            nextTab: 'idbtnAplicarVariable',
        });
        
        this.btnAplicarVariable = new Ext.Button({
            id:'idbtnAplicarVariable',
            iconCls:'aplicar',
          //  icon:perfil.dirImg+'aplicar.png',
            text:idioma.lbBtnAplicar,   
            tooltip:idioma.textToolTipAplicar,
            prevTab: 'idbtnCancelarVariable', 
            nextTab: 'idbtnAceptarVariable',
        });

        this.btnAceptarVariable = new Ext.Button({
            id:'idbtnAceptarVariable',
            iconCls:'aceptar',
           // icon:perfil.dirImg+'aceptar.png',
            text:idioma.lbBtnAceptar,   
            tooltip:idioma.textToolTipAceptar,
            prevTab: 'idbtnAplicarVariable', 
            nextTab: 'idtfDenomVariable',
        });
	
        //Ventana de adicionar y modificar variables globales.
        this.ventanaVariable = new Ext.Window({
            modal: true,
            closeAction: 'hide',
            autoHeight: true,
            closable:true,
            constrain: true,
            autoValidate: true,
            validateDefault: true,
            resizable:false, 
            layout: 'fit',
            constrain :true,
            items:[this.formularioVariable],
            buttons: [this.btnCancelarVariable, this.btnAplicarVariable, this.btnAceptarVariable],
            keys: [
                {
                    key: Ext.EventObject.ENTER,
                    stopEvent: true,
                    fn: function () {
                        self.btnAceptarVariable.handler();
                    }
                },{
                    key: 'x',
                    alt: true,
                    stopEvent: true,
                    fn: function () {
                        self.btnCancelarVariable.handler();
                    }
                },{
                    key: 'p',
                    alt: true,
                    stopEvent: true,
                    fn: function () {
                        self.btnAplicarVariable.handler();
                    }
                }
            ]
        });
	}
};