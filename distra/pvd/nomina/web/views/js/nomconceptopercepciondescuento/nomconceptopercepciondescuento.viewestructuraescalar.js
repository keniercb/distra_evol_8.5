Ext.ns('Pvd.Nomina.Nomencladores.ConceptoPD');

Ext.QuickTips.init();

//Vista gestionar estructuras escalares del componente Nomenclador de conceptos de percepciones y descuentos.
Pvd.Nomina.Nomencladores.ConceptoPD.VistaEstructuraEscalar = {
    /**
     * Inicializar la vista.
     * 
     * @param perfil Objeto que contiene el perfil de la IU (Tipo: Object).
     * @param idioma Objeto que contiene el idioma de los textos de la IU (Tipo: Object).
     * @param modelo Modelo de la vista del componente Nomenclador de conceptos de percepciones y descuentos(Tipo: Pvd.Nomina.Nomencladores.ConceptoPD.Modelo).
     */
    init: function(perfil, idioma, modelo) {
        var self = this;
		//Botones de Add, Mod, Elim estructura escalar.
        this.btnAdicionarEstEsc = new Ext.Button({
            id: 'idbtnAdicionarEstEsc',
            text: idioma.lbBtnAdicionar,
            tooltip: idioma.textToolTipAddEstEsc,
            //icon: perfil.dirImg+'adicionar.png',
            iconCls: 'adicionar',
            prevTab: 'idbtnEliminarEstEsc',
            nextTab: 'idbtnModificarEstEsc',
        });

        this.btnModificarEstEsc = new Ext.Button({
            id: 'idbtnModificarEstEsc',
            text: idioma.lbBtnModificar,
            tooltip: idioma.textToolTipModEstEsc,
          //  icon: perfil.dirImg+'modificar.png',
            iconCls: 'modificar',
            prevTab: 'idbtnAdicionarEstEsc',
            nextTab: 'idbtnEliminarEstEsc',
        });

        this.btnEliminarEstEsc = new Ext.Button({
            id: 'idbtnEliminarEstEsc',
            text: idioma.lbBtnEliminar,
            tooltip: idioma.textToolTipElimEstEsc,
           // icon: perfil.dirImg+'eliminar.png',
            iconCls: 'eliminar',
            prevTab: 'idbtnModificarEstEsc',
            nextTab: 'idbtnAdicionarEstEsc',
        });
		
        //Listado de estructura escalar.
		function centrarValor(val){
            if(val)
                return "<center>"+val+"</center>";
        }
		
		function especificarNivel(val){
			if(val == '1'){
				return "<center>Si</center>";
			}else{
				return "<center>No</center>";
			}
		}
		
		this.expanderEstrucEsc = new  Ext.grid.RowExpander({
            tpl : new Ext.Template(
                '<div style="word-wrap:break-word;white-space:normal;"></br><p>&nbsp;&nbsp;<b>Reporte</b>:&nbsp;&nbsp;{denomreporte}</p><p> </p><p>&nbsp;&nbsp;<b>Variable del reporte</b>:&nbsp;&nbsp;{denomvarreporte}</p></br></div>'
            ),enableCaching: false
        });
		
        this.smEstrucEsc = new Ext.grid.RowSelectionModel({
            singleSelect:true,
        });

        this.gpEstrucEsc = new Ext.grid.GridPanel({
            id:'idgpEstrucEsc',
            title:idioma.lbTitleEstrucEsc,
            region:'center',
            columns: [{header: 'idestructuraescalar',  hidden: true, hideable: false, dataIndex: 'idestructuraescalar'}
					,this.expanderEstrucEsc
                    ,{header: idioma.lbColDenominacion, width: 100, sortable: true, dataIndex: 'denominacion'}
					,{header: '<center>'+idioma.lbColTipoCampo+'</center>', fixed : true, width: 80, sortable: true, dataIndex: 'denomtipocampo', renderer:centrarValor}
					,{header: idioma.lbColNomenclador, width: 100, sortable: true, dataIndex: 'denomnomenclador'}
					,{header: '<center>'+idioma.lbColHoja+'</center>', fixed : true, width: 50, sortable: true, dataIndex: 'nivel', renderer: especificarNivel}
                    ,{header: '<center>'+idioma.lbColFormaEntrada+'</center>', fixed : true, width: 140, sortable: true, dataIndex: 'denomtipoentrada', renderer:centrarValor}
                    //,{header: idioma.lbColDenomReporte, fixed : true, width: 100, sortable: true, dataIndex: 'denomreporte', renderer:centrarValor}
                    //,{header: idioma.lbColDenomVarReporte, fixed : true, width: 100, sortable: true, dataIndex: 'denomvarreporte', renderer:centrarValor}
            ],
            stripeRows: true,
			plugins: this.expanderEstrucEsc, 
            autoScroll:true,
            border: false,
            width: '100%', 
            heigth: '100%',
            viewConfig: {forceFit: true},
            store: modelo.storeEstrucEsc,
            sm: this.smEstrucEsc,
            loadMask:{msg : idioma.lbMaskGridCargando},
            keys: [
                {
                    key: Ext.EventObject.DELETE,
                    stopEvent: true,
                    fn: function () {
                        if (!self.btnEliminarEstEsc.disabled) {
                            self.btnEliminarEstEsc.handler();
                        }
                    }
                }, {
                    key: 'i',
                    alt: true,
                    stopEvent: true,
                    fn: function () {
                        if (!self.btnAdicionarEstEsc.disabled) {
                            self.btnAdicionarEstEsc.handler();
                        }
                    }
                }, {
                    key: 'm',
                    alt: true,
                    stopEvent: true,
                    fn: function () {
                        if (!self.btnModificarEstEsc.disabled) {
                            self.btnModificarEstEsc.handler();
                        }
                    }
                }
            ]
        });
		
		//Campo del formulario de estructuras escalares.
		this.tfDenomEstrucEsc = new Ext.form.TextField({id:'idtfDenomEstrucEsc', fieldLabel:idioma.lbColDenominacion, 
										prevTab: 'idbtnAceptarEstrucEsc', nextTab: 'idcbTipoCampoEstrucEsc',
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
								
		this.cbTipoCampoEstrucEsc = new Ext.form.ComboBox({id:'idcbTipoCampoEstrucEsc', fieldLabel:idioma.lbColTipoCampo, 
                                        valueField: 'idtipocampo',
                                        displayField: 'denominacion', hiddenName: 'idtipocampo',
                                        allowBlank: false, mode: 'local', 
                                        store: modelo.storeTipoCampoEstrucEsc, emptyText: 'Seleccione...',
                                        blankText:idioma.lbErrorCampoVacio, readOnly: true, 
                                        triggerAction: 'all', anchor: '90%'
                                });
							
		this.cbNomencladorEstrucEsc = new Ext.form.ComboBox({id:'idcbNomencladorEstrucEsc', fieldLabel:idioma.lbColNomenclador, 
                                        valueField: 'idnomencladorreferencia',
                                        displayField: 'denominacion', hiddenName: 'idnomencladorreferencia',
                                        allowBlank: false, mode: 'local', 
                                        store: modelo.storeNomencladorEstrucEsc, emptyText: 'Seleccione...',
                                        blankText:idioma.lbErrorCampoVacio, readOnly: true, 
                                        triggerAction: 'all', anchor: '90%'
                                });
								
		this.cbHojaEstrucEsc = new Ext.form.ComboBox({id:'idcbHojaEstrucEsc', fieldLabel:idioma.lbColHoja, 
                                        valueField: 'nivel',
                                        displayField: 'denominacion', hiddenName: 'nivel',
                                        allowBlank: false, mode: 'local', 
                                        store: modelo.storeHoja, emptyText: 'Seleccione...',
                                        blankText:idioma.lbErrorCampoVacio, readOnly: true, 
                                        triggerAction: 'all', anchor: '99%'
                                });
								
		this.cbFormaEntradaEstrucEsc = new Ext.form.ComboBox({id:'idcbFormaEntradaEstrucEsc', fieldLabel:idioma.lbColFormaEntrada, 
                                        valueField: 'idtipoentrada',
                                        displayField: 'denominacion', hiddenName: 'idtipoentrada',
                                        allowBlank: false, mode: 'local', 
                                        store: modelo.storeFormaEntradaEstrucEsc, emptyText: 'Seleccione...',
                                        blankText:idioma.lbErrorCampoVacio, readOnly: true, 
                                        triggerAction: 'all', anchor: '90%'
                                });
								
		this.cbTipoReporteEstrucEsc = new Ext.form.ComboBox({id:'idcbTipoReporteEstrucEsc', fieldLabel:idioma.lbColDenomReporte, 
                                        valueField: 'idconfreportescertificaciones',
                                        displayField: 'denominacion', hiddenName: 'idconfreportescertificaciones',
                                        allowBlank: false, mode: 'local', 
                                        store: modelo.storeTipoReporteEstrucEsc, emptyText: 'Seleccione...',
                                        blankText:idioma.lbErrorCampoVacio, readOnly: true, 
                                        triggerAction: 'all', anchor: '90%'
                                });
								
		this.cbVarReporteEstrucEsc = new Ext.form.ComboBox({id:'idcbVarReporteEstrucEsc', fieldLabel:idioma.lbColDenomVarReporte, 
                                        valueField: 'idvariablesconfreportescertificaciones',
                                        displayField: 'denominacion', hiddenName: 'idvariablesconfreportescertificaciones',
                                        allowBlank: false, mode: 'local', 
                                        store: modelo.storeVarReporteEstrucEsc, emptyText: 'Seleccione...',
                                        blankText:idioma.lbErrorCampoVacio, readOnly: true, 
                                        triggerAction: 'all', anchor: '99%'
                                });

        this.tfLugaresdecimales = new Ext.form.TextField({id:'idtfLugaresdecimales', fieldLabel:'Lugares decimales',
                                        name: 'lugaresdecimales', allowBlank: false,  anchor: '90%',
                                       // vtype                                     : 'vtlugaresdecimales',
                                        blankText:idioma.lbErrorCampoVacio, disabled :true

                                });
								
		//Formulario de estructuras escalares.
        this.formularioEstrucEsc = new Ext.FormPanel({
            id:'idformularioEstrucEsc',
            labelAlign: 'top',
            frame:true,
            width: 550,
            autoHeight:true, 
            bodyStyle: {
                padding: '10px 10px 10px 10px',
            },  
			items:[{layout:'column',
					items:[
						{columnWidth:.25, layout: 'form', items: [this.tfDenomEstrucEsc]},
						{columnWidth:.25, layout: 'form', items: [this.cbTipoCampoEstrucEsc]},
						{columnWidth:.25, layout: 'form', items: [this.cbNomencladorEstrucEsc]},
						{columnWidth:.25, layout: 'form', items: [this.cbHojaEstrucEsc]},
					]
					},{
					layout:'column',
					items:[
						{columnWidth:.25, layout: 'form', items: [this.cbFormaEntradaEstrucEsc]},
						{columnWidth:.25, layout: 'form', items: [this.cbTipoReporteEstrucEsc]},
						{columnWidth:.25, layout: 'form', items: [this.cbVarReporteEstrucEsc]},
						{columnWidth:.25, layout: 'form', items: [this.tfLugaresdecimales]}

					]
					}]
        });
		
		//Botones de la ventana de adicionar/modificar estructuras escalares.
        this.btnCancelarEstrucEsc = new Ext.Button({
            id:'idbtnCancelarEstrucEsc',
            iconCls:'cancelar',
            //icon:perfil.dirImg+'cancelar.png',
            text:idioma.lbBtnCancelar,   
            tooltip:idioma.textToolTipCancelar,
            prevTab: 'idcbVarReporteEstrucEsc', 
            nextTab: 'idbtnAplicarEstrucEsc',
        });
        
        this.btnAplicarEstrucEsc = new Ext.Button({
            id:'idbtnAplicarEstrucEsc',
            iconCls:'aplicar',
            //icon:perfil.dirImg+'aplicar.png',
            text:idioma.lbBtnAplicar,   
            tooltip:idioma.textToolTipAplicar,
            prevTab: 'idbtnCancelarEstrucEsc', 
            nextTab: 'idbtnAceptarEstrucEsc',
        });

        this.btnAceptarEstrucEsc = new Ext.Button({
            id:'idbtnAceptarEstrucEsc',
            iconCls:'aceptar',
            //icon:perfil.dirImg+'aceptar.png',
            text:idioma.lbBtnAceptar,   
            tooltip:idioma.textToolTipAceptar,
            prevTab: 'idbtnAplicarEstrucEsc', 
            nextTab: 'idtfDenomEstrucEsc',
        });
	
        //Ventana de adicionar y modificar estructuras escalares.
        this.ventanaEstrucEsc = new Ext.Window({
            modal: true,
            closeAction: 'hide',
            autoHeight: true,
            closable:true,
            autoValidate: true,
            validateDefault: true,
            resizable:false, 
            layout: 'fit',
            constrain :true,
            items:[this.formularioEstrucEsc],
            buttons: [this.btnCancelarEstrucEsc, this.btnAplicarEstrucEsc, this.btnAceptarEstrucEsc],
            keys: [
                {
                    key: Ext.EventObject.ENTER,
                    stopEvent: true,
                    fn: function () {
                        self.btnAceptarEstrucEsc.handler();
                    }
                },{
                    key: 'x',
                    alt: true,
                    stopEvent: true,
                    fn: function () {
                        self.btnCancelarEstrucEsc.handler();
                    }
                },{
                    key: 'p',
                    alt: true,
                    stopEvent: true,
                    fn: function () {
                        self.btnAplicarEstrucEsc.handler();
                    }
                }
            ]
        });
	}
};