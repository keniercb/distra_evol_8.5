Ext.ns('Pvd.Nomina.Recuperacion.Partidagasto');

Ext.QuickTips.init();

//Vista del componente Gestionar plantilla nominal.
Pvd.Nomina.Recuperacion.Partidagasto.Vista = {
    /**
     * Inicializar la vista.
     *
     * @param perfil Objeto que contiene el perfil de la IU (Tipo: Object).
     * @param idioma Objeto que contiene el idioma de los textos de la IU (Tipo: Object).
     * @param modelo Modelo de la vista del componente Gestionar plantilla nominal (Tipo: Pvd.Nomina.Configuracion.PlantillaNominal.Modelo).
     */
    init: function (perfil, idioma, modelo) {


        this.btnAceptarConcepto = new Ext.Button({
            id: 'idbtnAceptarConcepto',
            iconCls: 'aceptar',
            text: 'Aceptar',
            tooltip: 'Guardar datos y cerrar ventana',
            prevTab: 'idbtnAplicarConcepto',
            nextTab: 'idgpConcepto'

        });
        this.btnCancelarConcepto = new Ext.Button({
            id: 'idbtnCancelarConcepto',
            iconCls: 'cancelar',
            text: 'Cancelar',
            tooltip: 'Cerrar ventana sin guardar los datos (<b>Alt + X</b>)',
            prevTab: 'iddfFFinConcepto',
            nextTab: 'idbtnAplicarConcepto'
        });


        this.formularioConcepto = new Ext.FormPanel({
            id: 'idformularioConcepto',
            labelAlign: 'top',
            frame: true,
            width: 200,
            autoHeight: true,
            bodyStyle: {
                padding: '10px 10px 10px 10px'
            },
            items: [{
                bodyStyle: 'padding-left:5px;',
                items: {
                    xtype:'fieldset',
                    title: 'Tipos de nomina',
                    autoHeight: true,
                    defaultType: 'radio',  // each item will be a radio button
                    layout:'column',
                    items: [{
                        columnWidth: '.5',
                        checked: true,
                        fieldLabel: 'Nomina',
                        boxLabel: 'Caja',
                        name: 'tipo',
                        inputValue: '1'
                    },{
                        columnWidth: '.5',
                        fieldLabel: '',
                        labelSeparator: '',
                        boxLabel: 'Cajero',
                        name: 'tipo',
                        inputValue: '2'
                    }]
                }
            }]

        });

        this.ventanaConcepto = new Ext.Window({
            modal: true,
            draggable: true,
            //closeAction: 'hide',
            autoHeight: true,
            region:'center',
            constrain: true,
            resizable: false,
            layout: 'fit',
            items: [this.formularioConcepto],
            buttons: [this.btnAceptarConcepto]
        });



        this.btnAdicionarPlantillaN = new Ext.Button({
            id: 'btnAddPlantillaN',
            text: 'Asociar',
            //tooltip: idioma.textToolTipAddPlantillaN,
            // icon: perfil.dirImg+'adicionar.png',
            iconCls: 'asociar'

        });
        //Panel de estructura y composición que carga hasta el nivel de entidades.
        this.panelEstEnt = new Ext.pvd.persona.buscarestructura.panelBuscarestructura({
            layout: 'border',
            border: true,
            title: 'Unidad militar',
            region: 'west',
            width: '30%',
            heigth: '100%',
            nivel: 3
            //nivelachequear: 3
        });
        this.gpNominasPG = new Ext.grid.GridPanel({
            id: 'idgpConcepto',
            title: 'Listado de partida de gastos',
            region: 'center',
            border: true,
            columns: [
                {header: 'idpartidagasto', dataIndex: 'idpartidagasto', width: 10, hidden: true, hideable: false},
                new Ext.grid.RowNumberer(),
                {header: 'Plantilla nominal', dataIndex: 'nomenclador', width: 10, hidden: true},
                {header: 'Partida de gasto', dataIndex: 'partida', width: 100  },
                {header: 'Cantidad de personas', dataIndex: 'cant', width: 50 },
                {header: 'Importe', dataIndex: 'importe', width: 50  }

            ],
            // tbar: [this.btnAdicionarPlantillaN],
            stripeRows: true,
            autoScroll: true,
            width: '100%',
            heigth: '100%',
            viewConfig: {forceFit: true},
            view: new Ext.grid.GroupingView({
                forceFit: true,
                groupTextTpl: '{text}'
            }),
            store: modelo.stNominaPG,
            sm: new Ext.grid.RowSelectionModel({
                singleSelect: true
            }),
            loadMask: {msg: 'Cargando'}

        });

        this.fnRenderName = function (val) {
            return '<span style="color:#700000;">' + val + '</span>';
        };

        this.objListarPeriodosPagos = new Pvd.Nomina.ElaborarPago.ListarPeriodosPago({
            modoview: 2
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
            closable: true, closeAction: 'hide',
            resizable: false,
            layout: 'border',
            items: [this.objListarPeriodosPagos],
            buttons: [this.btnAceptarPeriodosPagos]
        });


        //Botones de Add, Mod, Elim plantilla nominal.


        this.btnModificarPlantillaN = new Ext.Button({
            id: 'btnModPlantillaN',
            text: idioma.lbBtnModificar,
            tooltip: idioma.textToolTipModPlantillaN,
            iconCls: 'modificar',
            prevTab: 'btnAddPlantillaN', nextTab: 'btnElimPlantillaN'
        });


        //Listado de plantillas nominales.
        function centrarValor(val) {
            if (val)
                return "<center>" + val + "</center>";
        }

        this.expanderPlantillaN = new Ext.grid.RowExpander({
            tpl: new Ext.Template(
                '<div style="word-wrap:break-word;white-space:normal;"><p>&nbsp;&nbsp;Descripci&oacute;n:&nbsp;{descripcion}</p><br/></div>'
            ), enableCaching: false
        });

        this.ventanapartida = new Ext.Window({
            modal: true,
            draggable: true,
            closeAction: 'hide',
            constrain: true,
            width: '100%',
            height: 650,
            closable: true,
            plain: false,
            //resizable: false,
            layout: 'border',
            items: [this.panelEstEnt,
                {
                    region: 'center',
                    border: true,
                    width: '40%',
                    layout: 'border',
                    tbar: [this.btnAdicionarPlantillaN],
                    items: [this.gpNominasPG]
                }
           ]

        });

        //Vista general de la interfaz.
       /* new Ext.Viewport({
            layout: 'border',
            items:[this.ventanaConcepto],
           /* items: [this.panelEstEnt,
                {
                    region: 'center',
                    border: true,
                    width: '40%',
                    layout: 'border',
                    tbar: [this.btnAdicionarPlantillaN],
                    items: [this.gpNominasPG]
                }
            ]
        });*/

    }
};

//Inicializando la vista.
UCID.portal.cargarEtiquetas('recuppartidagaasto', function (perfil, idioma) {
    perfil = arguments[0];
    idioma = arguments[1];

    //Inicializando el modelo.
    var modelo = Pvd.Nomina.Recuperacion.Partidagasto.Modelo;
    modelo.init();
    //Inicializando la vista.
    var vista = Pvd.Nomina.Recuperacion.Partidagasto.Vista;
    vista.init(perfil, idioma, modelo);
    //Inicializar controlador.
    Pvd.Nomina.Recuperacion.Partidagasto.Controlador.init(idioma, vista, modelo);
});
