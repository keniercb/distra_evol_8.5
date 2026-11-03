Ext.ns('Pvd.Nomina.Nomencladores.ConceptoPD');

Ext.QuickTips.init();

//Vista de gestionar escalas del componente Nomenclador de conceptos de percepciones y descuentos.
Pvd.Nomina.Nomencladores.ConceptoPD.VistaEscala = {
    /**
     * Inicializar la vista.
     * 
     * @param perfil Objeto que contiene el perfil de la IU (Tipo: Object).
     * @param idioma Objeto que contiene el idioma de los textos de la IU (Tipo: Object).
     * @param modelo Modelo de la vista del componente Nomenclador de conceptos de percepciones y descuentos(Tipo: Pvd.Nomina.Nomencladores.ConceptoPD.Modelo).
     */
    init: function(perfil, idioma, modelo) {
        var self = this;
		//Botones de Add, Mod, Elim escala.
		this.btnMenuAdicionarEscala = new Ext.menu.Menu({
			id: 'idbtnMenuAdicionarEscala',
		});
		
		this.btnAdicionarEscala = new Ext.Button({
            id: 'idbtnAdicionarEscala',
            text: idioma.lbBtnAdicionar,
            tooltip: idioma.textToolTipAddEscala,
           // icon: perfil.dirImg+'adicionar.png',
            iconCls: 'adicionar',
			menu : this.btnMenuAdicionarEscala,
            prevTab: 'idbtnEliminarEscala',
            nextTab: 'idbtnModificarEscala',
        });

        this.btnModificarEscala = new Ext.Button({
            id: 'idbtnModificarEscala',
            text: idioma.lbBtnModificar,
            tooltip: idioma.textToolTipModEscala,
            //icon: perfil.dirImg+'modificar.png',
            iconCls: 'modificar',
            prevTab: 'idbtnAdicionarEscala',
            nextTab: 'idbtnEliminarEscala',
        });

        this.btnEliminarEscala = new Ext.Button({
            id: 'idbtnEliminarEscala',
            text: idioma.lbBtnEliminar,
            tooltip: idioma.textToolTipElimEscala,
           // icon: perfil.dirImg+'eliminar.png',
            iconCls: 'eliminar',
            prevTab: 'idbtnModificarEscala',
            nextTab: 'idbtnAdicionarEscala',
        });

        //Listado de escalas.
		function centrarValor(val){
            if(val)
                return "<center>"+val+"</center>";
        }	
        this.smEscala = new Ext.grid.RowSelectionModel({
            singleSelect:true,
        });
		
		this.gpEscala = new Ext.ux.maximgb.treegrid.GridPanel({
			id:'idgpEscala',
            title:idioma.lbTitleEscala,
			root_title: 'Escala',
			autoExpandColumn: 'idescalatarifa',
			master_column_id : 'idescalatarifa',
            region:'center',
            columns: [{header: 'idescalatarifa',  hidden: true, hideable: false, dataIndex: 'idescalatarifa'}
                    ,{id:'idescalatarifa', header: idioma.lbColDenominacion, width: 100, sortable: true, dataIndex: 'denomescala'}
					,{header: '<center>'+idioma.lbColFormaCalculo+'</center>', fixed : true, width: 100, sortable: true, dataIndex: 'denomformacalculo', renderer:centrarValor}
					,{header: '<center>'+idioma.lbColImporteFormula+'</center>', fixed : true, width: 200, sortable: true, dataIndex: 'importeformula', renderer:centrarValor}
            ],
            stripeRows: true,
            autoScroll:true,
            border: false,
            width: '100%', 
            heigth: '100%',
            viewConfig: {forceFit: true},
            store: modelo.storeEscala,
            sm: this.smEscala,
            loadMask:{msg : idioma.lbMaskGridCargando},
            keys: [
                {
                    key: Ext.EventObject.DELETE,
                    stopEvent: true,
                    fn: function () {
                        if (!self.btnEliminarEscala.disabled) {
                            self.btnEliminarEscala.handler();
                        }
                    }
                }, {
                    key: 'i',
                    alt: true,
                    stopEvent: true,
                    fn: function () {
                        if (!self.btnAdicionarEscala.disabled) {
                            self.btnAdicionarEscala.handler();
                        }
                    }
                }, {
                    key: 'm',
                    alt: true,
                    stopEvent: true,
                    fn: function () {
                        if (!self.btnModificarEscala.disabled) {
                            self.btnModificarEscala.handler();
                        }
                    }
                }
            ]
		});
		
		//Campos del formulario de escala.
		this.cbOperadorEscala = new Ext.form.ComboBox({id:'idcbOperadorEscala', fieldLabel:idioma.lbColOperador, 
                                        valueField: 'idoperadorcomparacion',
                                        displayField: 'denominacion', hiddenName: 'idoperadorcomparacion',
                                        allowBlank: false, mode: 'local', 
                                        store: modelo.storeOperadorEscala, emptyText: 'Seleccione...',
                                        blankText:idioma.lbErrorCampoVacio, readOnly: true, 
                                        triggerAction: 'all', anchor: '90%'
                                });
								
		this.tfValInicialEscala = new Ext.form.TextField({id:'idtfValInicialEscala', fieldLabel:idioma.lbColValInicial, 
										//prevTab: 'idbtnAceptarEstrucEsc', nextTab: 'idcbTipoCampoEstrucEsc',
                                        name: 'valorinicial', allowBlank: false,  anchor: '90%',
                                        blankText:idioma.lbErrorCampoVacio, 
                                        /*maxLength:idioma.lbErrorCampoVacio,
                                        maxLengthText:idioma.lbErrorCampoVacio, 
                                        minLength:idioma.lbErrorCampoVacio, 
                                        minLengthText:idioma.lbErrorCampoVacio, 
                                        maskRe:idioma.lbErrorCampoVacio, 
                                        regex:idioma.lbErrorCampoVacio, 
                                        regexText:idioma.lbErrorCampoVacio*/
                                });
		this.tfValFinalEscala = new Ext.form.TextField({id:'idtfValFinalEscala', fieldLabel:idioma.lbColValFinal, 
										//prevTab: 'idbtnAceptarEstrucEsc', nextTab: 'idcbTipoCampoEstrucEsc',
										name: 'valorfinal', allowBlank: false,  anchor: '99%',
										blankText:idioma.lbErrorCampoVacio, 
										/*maxLength:idioma.lbErrorCampoVacio,
										maxLengthText:idioma.lbErrorCampoVacio, 
										minLength:idioma.lbErrorCampoVacio, 
										minLengthText:idioma.lbErrorCampoVacio, 
										maskRe:idioma.lbErrorCampoVacio, 
										regex:idioma.lbErrorCampoVacio, 
										regexText:idioma.lbErrorCampoVacio*/
								});
								
		this.cbFormaCalculoEscala = new Ext.form.ComboBox({id:'idcbFormaCalculoEscala', fieldLabel:idioma.lbColFormaCalculo, 
                                        valueField: 'idformacalculo',
                                        value:1,
                                        displayField: 'denominacion', hiddenName: 'idformacalculo',
                                        allowBlank: false, mode: 'local', 
                                        store: modelo.storeFormaCalculoEscala, emptyText: 'Seleccione...',
                                        blankText:idioma.lbErrorCampoVacio, readOnly: true, 
                                        triggerAction: 'all', anchor: '90%'
                                });

        this.tfImporteFormulaEscala = new Ext.form.TextField({id:'idtfImporteFormulaEscala', fieldLabel:idioma.lbColImporteFormula,
                                        name: 'importeformula', allowBlank: false, 
                                        anchor: '99%', //prevTab: 'idcbFormaCalculoTarifa', nextTab: 'idbtnCancelarTarifa',
                                        blankText:idioma.lbErrorCampoVacio, 
                                        /*maxLength:idioma.lbErrorCampoVacio,
                                        maxLengthText:idioma.lbErrorCampoVacio, 
                                        minLength:idioma.lbErrorCampoVacio, 
                                        minLengthText:idioma.lbErrorCampoVacio, 
                                        maskRe:idioma.lbErrorCampoVacio, 
                                        regex:idioma.lbErrorCampoVacio, 
                                        regexText:idioma.lbErrorCampoVacio*/
                                });
								
		//Formulario de escalas.
        this.formularioEscala = new Ext.FormPanel({
            id:'idformularioEscala',
            labelAlign: 'top',
            frame:true,
            autoHeight:true, 
			width: 250,
            bodyStyle: {
                padding: '10px 10px 10px 10px',
            },
			items:[{layout:'column',
					items:[
						{id:'colcbOperadorEscala', columnWidth:.56, layout: 'form', items: [this.cbOperadorEscala]},
						{id:'coltfValInicialEscala',columnWidth:.22, layout: 'form', items: [this.tfValInicialEscala]},
						{id:'coltfValFinalEscala',columnWidth:.22, layout: 'form', items: [this.tfValFinalEscala]},
					]
					},{
					layout:'column',
					items:[
						{id:'colcbFormaCalculoEscala',columnWidth:.4, layout: 'form'/*, items: [this.cbFormaCalculoEscala]*/},
						{id:'coltfImporteFormulaEscala',columnWidth:.99, layout: 'form', items: [this.tfImporteFormulaEscala]},
					]
					}],			
        });
		
		//Botones de la ventana de adicionar/modificar escalas.
        this.btnCancelarEscala = new Ext.Button({
            id:'idbtnCancelarEscala',
            iconCls:'cancelar',
           // icon:perfil.dirImg+'cancelar.png',
            text:idioma.lbBtnCancelar,   
            tooltip:idioma.textToolTipCancelar,
            prevTab: 'idtfImporteFormulaEscala', 
            nextTab: 'idbtnAceptarEscala',
        });
        
        /*this.btnAplicarEscala = new Ext.Button({
            id:'idbtnAplicarEscala',
            iconCls:'btn',
            icon:perfil.dirImg+'aplicar.png',
            text:idioma.lbBtnAplicar,   
            tooltip:idioma.textToolTipAplicar,
            prevTab: 'idbtnCancelarEscala', 
            nextTab: 'idbtnAceptarEscala',
        });*/

        this.btnAceptarEscala = new Ext.Button({
            id:'idbtnAceptarEscala',
            iconCls:'aceptar',
            //icon:perfil.dirImg+'aceptar.png',
            text:idioma.lbBtnAceptar,   
            tooltip:idioma.textToolTipAceptar,
            prevTab: 'idbtnCancelarEscala', 
            //nextTab: 'idcbEstrucEscAdy',
        });
	
        //Ventana de adicionar y modificar escalas.
        this.ventanaEscala = new Ext.Window({
            modal: true,
            closeAction: 'hide',
            autoHeight: true,
            closable:true,
            constrain: true,

            autoValidate: true,
            validateDefault: true,
            resizable:false, 
            layout: 'fit',
            items:[this.formularioEscala],
            buttons: [this.btnCancelarEscala, this.btnAceptarEscala],
            keys: [
                {
                    key: Ext.EventObject.ENTER,
                    stopEvent: true,
                    fn: function () {
                        self.btnAceptarEscala.handler();
                    }
                },{
                    key: 'x',
                    alt: true,
                    stopEvent: true,
                    fn: function () {
                        self.btnCancelarEscala.handler();
                    }
                }
            ]
        });
	}
};