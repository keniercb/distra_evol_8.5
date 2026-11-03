Ext.ns('Pvd.Nomina.Configuracion.ModeloNomina');

Ext.QuickTips.init();

//Vista del componente Configurar modelo de nómina.
Pvd.Nomina.Configuracion.ModeloNomina.Vista = {
    /**
     * Inicializar la vista.
     * 
     * @param perfil Objeto que contiene el perfil de la IU (Tipo: Object).
     * @param idioma Objeto que contiene el idioma de los textos de la IU (Tipo: Object).
     * @param modelo Modelo de la vista del componente Configurar modelo de nómina (Tipo: Pvd.Nomina.Configuracion.ModeloNomina.Modelo).
     */
    init: function(perfil, idioma, modelo) {
        var self = this;

        //Botones de actualizar configuración.
        this.btnActualizarConfM = new Ext.Button({
            id: 'btnActualizarConfM',
            text: idioma.lbBtnActualizar,
            tooltip: 'Actualizar listado de modelos de n&oacute;mina (<b>Ctrl+Alt+Z</b>)',
//            icon: perfil.dirImg+'actualizar.png',
            iconCls: 'actualizar',
        });
		//Botones de actualizar configuración.
        this.btnRecargarConf = new Ext.Button({
            id: 'btnRecargarConf',
            text: 'Recargar',
            tooltip: 'Recargar el modelo de n&oacute;mina',
//            icon: perfil.dirImg+'reevaluacion.png',
            iconCls: 'recargar'
        });

        this.btnEliminar = new Ext.Button({
            id: 'btnEliminar',
            text: 'Eliminar',
            tooltip: 'Eliminar el modelo de n&oacute;mina',
            disabled: true,
            iconCls: 'eliminar'
        });

        //Función auxiliar para centrar los valores del grid.
        function centrarValor(val){
            if(val)
                return "<center>"+val+"</center>";
        }
        this.smConfM = new Ext.grid.RowSelectionModel({
            singleSelect:true,
        });
		this.btnAyuda= new Ext.Button({
            id: 'btnAyuda',
            text: 'Ayuda',
            tooltip: 'Ayuda',
//            icon:perfil.dirImg+'ayuda.png',
            iconCls:'ayuda',

        });
        this.gpConfM = new Ext.grid.GridPanel({
            id:'idgpConfM',
            title:idioma.lbTitleConfModelo,
            region:'center',
            columns: [{header: 'idtiponomina',  hidden: true, hideable: false, dataIndex: 'idtiponomina'}
                    ,{header: idioma.lbColTipoNomina,  width: 120, sortable: true, dataIndex: 'denomtiponomina'}            
                    ,{header: idioma.lbColTipoPago, fixed : true, width: 200, sortable: true, dataIndex: 'denomtipopago'}
                    ,{header: idioma.lbColCategorias, fixed : true, width: 600, sortable: true, dataIndex: 'categorias'}
                   
            ],
            stripeRows: true,
            autoScroll:true,
            border: false,
            width: '100%', 
            heigth: '100%',
            viewConfig: {forceFit: true},
            store: modelo.storeModeloN,
            sm: this.smConfM,
            loadMask:{msg : idioma.lbMaskGridCargando},
        });
        //Grid de categorías de personas.
         this.smCategPersona = new Ext.grid.CheckboxSelectionModel({
            //singleSelect:true,
        });
        this.gpCategPersona = new Ext.grid.GridPanel({
            id:'idgpConfM',
            title:idioma.lbTitlegpCategPersona,
            region:'center',
            columns: [{header: 'idcategoriapersona',  hidden: true, hideable: false, dataIndex: 'idcategoriapersona'}
                    ,this.smCategPersona
                    ,{header: idioma.lbColDenominacion,  width: 120, sortable: true, dataIndex: 'denom'}            
                   
            ],
            stripeRows: true,
            autoScroll:true,
            border: false,
            frame : true,
            width: '100%', 
            height:250, 
            viewConfig: {forceFit: true},
            store: modelo.storeCategoriaPersona,
            sm: this.smCategPersona,
            loadMask:{msg : idioma.lbMaskGridCargando},
        });

        //Campos de actualizar modelos de nominas.
        this.cbTipoPago = new Ext.form.ComboBox({id:'idcbcbTipoPago', fieldLabel:idioma.lbColTipoPago, 
                                        valueField: 'idtipopago', 
                                        displayField: 'denominacion', hiddenName: 'idtipopago',
                                        allowBlank: false, mode: 'local', 
                                         store: modelo.storeTipoPago, emptyText: 'Seleccione...',
                                        blankText:idioma.lbErrorCampoVacio, readOnly: true, 
                                        triggerAction: 'all', anchor: '99%'
                                });

        //Formulario de configuracion modelo nomina.
        this.formularioConfM = new Ext.FormPanel({
            id:'idformlarioConfM',
            labelAlign: 'top',
            frame:true,
            width: 450,
            height:800,
            autoHeight:true, 
            bodyStyle: {
                padding: '10px 10px 10px 10px',
            },  
            items:[{layout:'column',
                        items:[
                            {columnWidth:1, layout: 'form', items: [this.cbTipoPago]},
                        ]
                    },{
                        layout:'column',
                        items:[{
                            columnWidth: 1,
                            layout: 'form',
                            items: [{
                                xtype: 'panel',
                                border:false,
                                layout:'fit',
                                items:[this.gpCategPersona]
                            }
                            ]
                        }]
                    }
            ],
        });

        //Botones de la ventana de adicionar coonfiguracion de modelos de nominas.
        this.btnCancelarConfM = new Ext.Button({
            id:'idbtnCancelarConfM',
            iconCls:'cancelar',
            text:idioma.lbBtnCancelar,   
            tooltip:idioma.textToolTipCancelar,
            prevTab: 'idcbTipoPago', 
            nextTab: 'idbtnAceptarConfM',
        });
        
        this.btnAceptarConfM = new Ext.Button({
            id:'idbtnAceptarConfM',
            iconCls:'aceptar',
//            icon:perfil.dirImg+'aceptar.png',
            text:idioma.lbBtnAceptar,   
            tooltip:idioma.textToolTipAceptar,
            prevTab: 'idbtnCancelarConfM', 
            nextTab: 'idcbTipoPago',
        });

        //Ventana de actualizar configuracion de modelos de nominas.
        this.ventanaConfM = new Ext.Window({
            modal: true,
            closeAction: 'hide',
            autoHeight: true,
            constrain: true,
            closable:true,
            resizable:false, 
            layout: 'fit',
            items:[this.formularioConfM],
            buttons: [this.btnCancelarConfM, this.btnAceptarConfM] , 
        });

        //Vista general de la interfaz.
        new Ext.Viewport({
            layout : 'fit',
            items : [{
                layout : 'fit',
                tbar : [this.btnActualizarConfM,this.btnRecargarConf, this.btnEliminar, '->', this.btnAyuda],
                items : [this.gpConfM],
                keys:[
                    {
                        key: 'z',
                        alt: true,
                        ctrl:true,
                        stopEvent: true,
                        fn: function () {
                            self.btnActualizarConfM.handler();
                        }

                    }
                ]
            }]
        });
	}
};

//Inicializando la vista.
UCID.portal.cargarEtiquetas('configmodelonomina', function(perfil, idioma){
    perfil = arguments[0];
	idioma = arguments[1];
	
    //Inicializando el modelo.
    var modelo = Pvd.Nomina.Configuracion.ModeloNomina.Modelo;
    modelo.init();
    //Inicializando la vista.
	var vista = Pvd.Nomina.Configuracion.ModeloNomina.Vista;
    vista.init(perfil, idioma, modelo);
    //Inicializar controlador.
    Pvd.Nomina.Configuracion.ModeloNomina.Controlador.init(idioma, vista, modelo);
});