Ext.ns('Pvd.Nomina.Nomencladores.ConceptoPD');

Ext.QuickTips.init();

//Vista de gestionar estructuras adyacentes del componente Nomenclador de conceptos de percepciones y descuentos.
Pvd.Nomina.Nomencladores.ConceptoPD.VistaAdyacente = {
    /**
     * Inicializar la vista.
     * 
     * @param perfil Objeto que contiene el perfil de la IU (Tipo: Object).
     * @param idioma Objeto que contiene el idioma de los textos de la IU (Tipo: Object).
     * @param modelo Modelo de la vista del componente Nomenclador de conceptos de percepciones y descuentos(Tipo: Pvd.Nomina.Nomencladores.ConceptoPD.Modelo).
     */
    init: function(perfil, idioma, modelo) {
        var self = this;
		//Botones de Add, Mod, Elim matriz de adyacencia.
        this.btnAdicionarMatrizAdy = new Ext.Button({
            id: 'idbtnAdicionarMatrizAdy',
            text: idioma.lbBtnAdicionar,
            tooltip: idioma.textToolTipAddMatrizAdy,
           // icon: perfil.dirImg+'adicionar.png',
            iconCls: 'adicionar',
            prevTab: 'idbtnEliminarMatrizAdy',
            nextTab: 'idbtnEliminarMatrizAdy',
        });

        this.btnEliminarMatrizAdy = new Ext.Button({
            id: 'idbtnEliminarMatrizAdy',
            text: idioma.lbBtnEliminar,
            tooltip: idioma.textToolTipElimMatrizAdy,
          //  icon: perfil.dirImg+'eliminar.png',
            iconCls: 'eliminar',
            prevTab: 'idbtnAdicionarMatrizAdy',
            nextTab: 'idbtnAdicionarMatrizAdy',
        });
		
		//Listado de adyacencia.
		function centrarValor(val){
            if(val)
                return "<center>"+val+"</center>";
        }	
		
        this.smMatrizAdy = new Ext.grid.RowSelectionModel({
            singleSelect:true
        });

        this.gpMatrizAdy = new Ext.grid.GridPanel({
            id:'idgpMatrizAdy',
            title:idioma.lbTitleMatrizAdy,
            region:'center',
            columns: [{header: 'iddependenciaestructuraescalar',  hidden: true, hideable: false, dataIndex: 'iddependenciaestructuraescalar'}
                    ,{header: idioma.lbColDenominacion, width: 100, sortable: true, dataIndex: 'denomestruraescalar'}
            ],
            stripeRows: true,
            autoScroll:true,
            border: false,
            width: '100%', 
            heigth: '100%',
            viewConfig: {forceFit: true},
            store: modelo.storeMatrizAdy,
            sm: this.smMatrizAdy,
            loadMask:{msg : idioma.lbMaskGridCargando},
            keys: [
                {
                    key: Ext.EventObject.DELETE,
                    stopEvent: true,
                    fn: function () {
                        if (!self.btnEliminarMatrizAdy.disabled) {
                            self.btnEliminarMatrizAdy.handler();
                        }
                    }
                }, {
                    key: 'i',
                    alt: true,
                    stopEvent: true,
                    fn: function () {
                        if (!self.btnAdicionarMatrizAdy.disabled) {
                            self.btnAdicionarMatrizAdy.handler();
                        }
                    }
                }
            ]
        }); 
		
		//Campo del formulario de estructuras escalares adyacentes.
		this.cbEstrucEscAdy = new Ext.form.ComboBox({id:'idcbEstrucEscAdy', fieldLabel:idioma.lbColEstrucEsc, 
										prevTab: 'idbtnAceptarMatrizAdy', nextTab: 'idbtnCancelarMatrizAdy',
                                        valueField: 'idestructuraescalaradyacente',
                                        displayField: 'denominacion', hiddenName: 'idestructuraescalaradyacente',
                                        allowBlank: false, mode: 'local', 
                                        store: modelo.storeEstrucEscAdy, emptyText: 'Seleccione...',
                                        blankText:idioma.lbErrorCampoVacio, readOnly: true, 
                                        triggerAction: 'all', anchor: '99%'
                                });
								
		//Formulario de estructuras escalares adyacentes.
        this.formularioMatrizAdy = new Ext.FormPanel({
            id:'idformularioMatrizAdy',
            labelAlign: 'top',
            frame:true,
            width: 200,
            autoHeight:true, 
            bodyStyle: {
                padding: '10px 10px 10px 10px'
            },  
			items:[this.cbEstrucEscAdy]
        });
		
		//Botones de la ventana de adicionar/modificar estructuras escalares.
        this.btnCancelarMatrizAdy = new Ext.Button({
            id:'idbtnCancelarMatrizAdy',
            iconCls:'cancelar',
           // icon:perfil.dirImg+'cancelar.png',
            text:idioma.lbBtnCancelar,   
            tooltip:idioma.textToolTipCancelar,
            prevTab: 'idcbEstrucEscAdy', 
            nextTab: 'idbtnAplicarMatrizAdy'
        });
        
        this.btnAplicarMatrizAdy = new Ext.Button({
            id:'idbtnAplicarMatrizAdy',
            iconCls:'aplicar',
            //icon:perfil.dirImg+'aplicar.png',
            text:idioma.lbBtnAplicar,   
            tooltip:idioma.textToolTipAplicar,
            prevTab: 'idbtnCancelarMatrizAdy', 
            nextTab: 'idbtnAceptarMatrizAdy'
        });

        this.btnAceptarMatrizAdy = new Ext.Button({
            id:'idbtnAceptarMatrizAdy',
            iconCls:'aceptar',
            //icon:perfil.dirImg+'aceptar.png',
            text:idioma.lbBtnAceptar,   
            tooltip:idioma.textToolTipAceptar,
            prevTab: 'idbtnAplicarMatrizAdy', 
            nextTab: 'idcbEstrucEscAdy'
        });
	
        //Ventana de adicionar y modificar estructuras escalares adyacentes.
        this.ventanaMatrizAdy = new Ext.Window({
            modal: true,
            closeAction: 'hide',
            autoHeight: true,
            constrain: true,
            autoValidate: true,
            validateDefault: true,
            closable:true,
            resizable:false, 
            layout: 'fit',
            constrain :true,
            items:[this.formularioMatrizAdy],
            buttons: [this.btnCancelarMatrizAdy, this.btnAplicarMatrizAdy, this.btnAceptarMatrizAdy],
            keys: [
                {
                    key: Ext.EventObject.ENTER,
                    stopEvent: true,
                    fn: function () {
                        self.btnAceptarMatrizAdy.handler();
                    }
                },{
                    key: 'x',
                    alt: true,
                    stopEvent: true,
                    fn: function () {
                        self.btnCancelarMatrizAdy.handler();
                    }
                },{
                    key: 'p',
                    alt: true,
                    stopEvent: true,
                    fn: function () {
                        self.btnAplicarMatrizAdy.handler();
                    }
                }
            ]
        });
	}
};