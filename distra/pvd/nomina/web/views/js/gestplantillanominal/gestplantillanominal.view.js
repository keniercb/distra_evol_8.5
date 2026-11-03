Ext.ns('Pvd.Nomina.Configuracion.PlantillaNominal');

Ext.QuickTips.init();

//Vista del componente Gestionar plantilla nominal.
Pvd.Nomina.Configuracion.PlantillaNominal.Vista = {
    /**
     * Inicializar la vista.
     *
     * @param perfil Objeto que contiene el perfil de la IU (Tipo: Object).
     * @param idioma Objeto que contiene el idioma de los textos de la IU (Tipo: Object).
     * @param modelo Modelo de la vista del componente Gestionar plantilla nominal (Tipo: Pvd.Nomina.Configuracion.PlantillaNominal.Modelo).
     */
    init: function (perfil, idioma, modelo) {
        var self = this;

        //Panel de estructura y composición que carga hasta el nivel de entidades.
        this.panelEstEnt = new Ext.pvd.persona.buscarestructura.panelBuscarestructura({
            layout        : 'border',
            region        : 'west',
            width         : '30%',
            heigth        : '100%',
            nivel         : 5,
            nivelachequear: 5
        });

        //Botones de Add, Mod, Elim , Sync plantilla nominal.
        this.btnAdicionarPlantillaN = new Ext.Button({
            id     : 'btnAddPlantillaN',
            text   : idioma.lbBtnAdicionar,
            tooltip: idioma.textToolTipAddPlantillaN,
//            icon: perfil.dirImg+'adicionar.png',
            iconCls: 'adicionar',
            prevTab: 'btnAyudaPlantillaN',
            nextTab: 'btnModTipoP',
        });

        this.btnModificarPlantillaN = new Ext.Button({
            id     : 'btnModPlantillaN',
            text   : idioma.lbBtnModificar,
            tooltip: idioma.textToolTipModPlantillaN,
//            icon: perfil.dirImg+'modificar.png',
            iconCls: 'modificar',
            prevTab: 'btnAddPlantillaN',
            nextTab: 'btnElimPlantillaN',
        });

        this.btnEliminarPlantillaN = new Ext.Button({
            id     : 'btnElimPlantillaN',
            text   : idioma.lbBtnEliminar,
            tooltip: idioma.textToolTipElimPlantillaN,
//            icon: perfil.dirImg+'eliminar.png',
            iconCls: 'eliminar',
            prevTab: 'btnModPlantillaN',
            nextTab: 'btnEstructurarPlantillaN',
        });

        this.btnSincronizarPlantillaN = new Ext.Button({
            id     : 'btnSincronizarPlantillaN',
            text   : 'Sync',
            tooltip: 'Sincronizaci&oacute;n automa&acute;tica de las Plantillas Nominales',
//            icon: perfil.dirImg+'adicionar.png',
            iconCls: 'sincronizar',
        });

        this.btnActualizarCargos = new Ext.Button({
            id     : 'btnActualizarCargos',
            text   : 'Actualizar Cargos',
            tooltip: 'Actualizaci&oacute;n automa&acute;tica de los Cargos desde la Estructura',
            disable: true,
            hidden: true,
            iconCls: 'sincronizar',
        });

        this.btnGuardarOrdenPlantilla = new Ext.Button({
            id     : 'btnGuardarOrdenPlantilla',
            text   : 'Guardar',
            tooltip: 'Guardar Orden Plantilla Nominal',
            disable: true,
            hidden: false,
            iconCls: 'guardar'
        });

        this.btnEstructurarPlantillaN = new Ext.Button({
            id     : 'btnEstructurarPlantillaN',
            text   : idioma.lbBtnEstructurar,
            tooltip: idioma.textToolTipEstructurarPlantillaN,
//            icon:perfil.dirImg+'estructura.png',
            iconCls: 'estructura',
            prevTab: 'btnElimPlantillaN',
            nextTab: 'btnBuscarPlantillaN ',
        });

        this.btnBuscarPlantillaN = new Ext.Button({
            id     : 'btnBuscarPlantillaN',
            text   : idioma.lbBtnBuscar,
            tooltip: idioma.textToolTiplbBtnBuscarPlantillaN,
//            icon:perfil.dirImg+'buscar.png',
            iconCls: 'buscar',
            prevTab: 'btnEstructurarPlantillaN',
            nextTab: 'btnAyudaPlantillaN',
        });


        this.tfBuscarPlantillaN = new Ext.form.TextField({
            id       : 'tfBuscarPlantillaN',
            anchor   : '99%',
            emptyText: 'Criterio a buscar...'

        });

        this.btnAyudaPlantillaN = new Ext.Button({
            id     : 'btnAyudaPlantillaNOM',
            text   : idioma.lbBtnAyuda,
            tooltip: idioma.textToolTipAyudaPlantillaN,
//            icon:perfil.dirImg+'ayuda.png',
            iconCls: 'ayuda',
            prevTab: 'btnBuscarPlantillaN',
            nextTab: 'btnAddPlantillaN',
            /*handler: function(){
             var title	= 'Ayuda de la configuraci&oacute;n de plantillas nominales';
             var referencia	= 'nomina/configuracion/gestplantilla';
             help.show(title,referencia);
             }*/
        });

        //****Ventana de Estructuras Sync Plantilla
        this.btnAceptarSyncPlantilla = new Ext.Button({
            id: 'btnAceptarSyncPlantilla',
            text: 'Aceptar',
            tooltip: 'Aceptar',
            disabled: true,
            iconCls: 'aceptar',
            handler: function () {
            }.createDelegate(this)
        });


        this.pobjestructurabtnSyncPlantilla = new Ext.pvd.persona.buscarestructura.panelBuscarestructura({
            layout: 'border',
            region: 'center',
            nivel: 7,
            nivelachequear: [1,2,4,5,6]

        });

        this.winEstructuraSyncPlantilla = new Ext.Window({
            title: 'Entidades',
            modal: true,
            height: 350,
            width: 300,
            closable: true,
            closeAction: 'hide',
            resizable: false,
            layout: 'fit',
            items: [this.pobjestructurabtnSyncPlantilla],
            buttons: [this.btnAceptarSyncPlantilla]
        });

        //Listado de plantillas nominales.
        function centrarValor(val) {
            if (val)
                return "<center>" + val + "</center>";
        }

        this.expanderPlantillaN = new Ext.grid.RowExpander({
            tpl             : new Ext.Template(
                '<div style="word-wrap:break-word;white-space:normal;"><p>&nbsp;&nbsp;Descripci&oacute;n:&nbsp;{descripcion}</p><br/></div>'
            ), enableCaching: false
        });

        this.smPlantillaN = new Ext.grid.RowSelectionModel({
            singleSelect: true,
        });

        this.editorOrden = new Ext.form.NumberField({
            allowBlank: false,
            anchor: '100%',
            allowDecimals: false,
            allowNegative: false,
            maxLength: 2,
            maxValue: 99,
            minValue: 0,
            decimalPrecision: 0,
            nanText: 'Este valor es incorrecto.',
            blankText: 'Este campo es obligatorio.'
        });

        this.gpPlantillaN = new Ext.grid.EditorGridPanel({
            id        : 'idgpPlantillaN',
            title     : idioma.lbTitlePlantillaN,
            region    : 'center',
            columns   : [
                {header: 'idplantillanominal', hidden: true, hideable: false, dataIndex: 'idplantillanominal'}
                ,
                this.expanderPlantillaN
                ,
                {header: 'C&oacute;digo', width: 100, hidden: true, sortable: true, dataIndex: 'codigo'}
                ,
                /*{header: '&Aacute;rea', width: 200, sortable: true, dataIndex: 'area'}
                ,*/
                {header: idioma.lbColDenominacion, width: 300, sortable: true, dataIndex: 'denominacion'}
                ,
                {header: 'Orden', width: 50, sortable: true, dataIndex: 'orden' , editor: this.editorOrden}
                ,
                {header: 'Centro Costo', width: 100, sortable: true, dataIndex: 'centrocosto'}
                ,
                {
                    header   : '<center>' + idioma.lbColDesde + '</center>',
                    fixed    : true,
                    width    : 85,
                    sortable : true,
                    dataIndex: 'fechainicio',
                    renderer : centrarValor
                }
                ,
                {
                    header   : '<center>' + idioma.lbColHasta + '</center>',
                    fixed    : true,
                    width    : 85,
                    sortable : true,
                    dataIndex: 'fechafin',
                    renderer : centrarValor
                }
            ],
            stripeRows: true,
            autoScroll: true,
            border    : false,
            width     : '60%',
            heigth    : '100%',
           // viewConfig: {forceFit: true},
            store     : modelo.storePlantillaN,
            sm        : this.smPlantillaN,
            plugins   : this.expanderPlantillaN,
            loadMask  : {msg: idioma.lbMaskGridCargando},
        });
        //this.gpPlantillaN.getStore().load();

        //Tree de vista previa.    
        this.smArbolPlantilla = new Ext.tree.DefaultSelectionModel({});

        this.ArbolPlantilla = new Ext.tree.TreePanel({
            title      : idioma.lbTitleArbolPlantillaNominal,
            region     : 'east',
            width      : '40%',
            split      : false,
            border     : true,
            rootVisible: false,
            autoScroll : true,
            layout     : 'fit',
            loader     : modelo.storeArbolPlantilla,
            selModel   : this.smArbolPlantilla,
            root       : new Ext.tree.AsyncTreeNode({
                text: 'Escala',
                // leaf:true,
                id  : 'root'
            }),
        });

        //Campos del formulario de plantilla nominal.
        this.tfDenomPlantillaN = new Ext.form.TextField({
            id           : 'idtfDenomPlantillaN',
            fieldLabel   : idioma.lbColDenominacion,
            tabIndex     : 1,
            name         : 'denominacion',
            allowBlank   : false,
            width        : 300,
            anchor       : '90%',
            blankText    : idioma.lbErrorCampoVacio,
            prevTab      : 'idbtnAceptarPlantillaN',
//                                        regex:/^([a-zA-ZÁÉÍÓÚáéíóúñüÑ\d ]+(\d*)?)+$/,
            vtype        : 'vtdenominaciones',
            maxLength    : 100,
            maxLengthText: idioma.lbMaxText_100,
            regexText    : idioma.lbDenomIncorr, //maskRe
        });

        this.tfCodigo = new Ext.form.NumberField({
            id       : 'idtfCodigo', fieldLabel: 'C&oacute;digo',
            tabIndex : 1, name: 'codigo', allowBlank: false, anchor: '99%',
            blankText: idioma.lbErrorCampoVacio, prevTab: 'idbtnAceptarPlantillaN',
            hidden   : true,
            /*maxLength:idioma.lbErrorCampoVacio,
             maxLengthText:idioma.lbErrorCampoVacio,
             minLength:idioma.lbErrorCampoVacio,
             minLengthText:idioma.lbErrorCampoVacio,
             maskRe:idioma.lbErrorCampoVacio,
             regex:idioma.lbErrorCampoVacio,
             regexText:idioma.lbErrorCampoVacio*/
        });
        this.cmboxArea = new Ext.form.ComboBox({
            id          : 'cmboxArea', msgTarget: 'qtip', enableQtip: true,
            store       : modelo.cmbArea, fieldLabel: '&Aacute;rea', mode: 'local',
            displayField: 'area', hiddenName: 'idarea', valueField: 'idarea',
            typeAhead   : true, triggerAction: 'all', forceSelection: true,
            emptyText   : 'Seleccione...', anchor: '99%', allowBlank: true, name: 'cbarea'
        });

        this.cmboxCentrosCosto = new Ext.form.ComboBox({
            id          : 'cmboxCentrosCosto', msgTarget: 'qtip', enableQtip: true,
            store       : modelo.stCentrosCosto, fieldLabel: 'Centros costo', mode: 'local',
            displayField: 'centrocosto', hiddenName: 'idcentrocosto', valueField: 'idcentrocosto',
            typeAhead   : true, triggerAction: 'all', forceSelection: true,
            emptyText   : 'Seleccione...', anchor: '99%', allowBlank: true, name: 'idcentrocosto'
        });

        this.dfFInicioPlantillaN = new Ext.form.DateField({
            id         : 'iddfFInicioPlantillaN', fieldLabel: idioma.lbColDesde,
            tabIndex   : 3, name: 'fechainicio', allowBlank: false,
            format     : 'd/m/Y', editable: true, readOnly: false,
            value      : new Date().format('d/m/Y'), maxText: idioma.lbFechaMaxima,
            minText    : idioma.lbFechaMinima, blankText: idioma.lbErrorCampoVacio,
            invalidText: idioma.invalidTextFecha, vtype: 'daterange',
            anchor     : '90%', endDateField: 'iddfFFinPlantillaN'
        });

        this.dfFFinPlantillaN = new Ext.form.DateField({
            id       : 'iddfFFinPlantillaN', fieldLabel: idioma.lbColHasta,
            tabIndex : 4, name: 'fechafin', xtype: 'datefield', allowBlank: true,
            format   : 'd/m/Y', editable: true, readOnly: false,
            maxText  : idioma.lbFechaMaxima, minText: idioma.lbFechaMinima,
            blankText: idioma.lbErrorCampoVacio, invalidText: idioma.invalidTextFecha,
            vtype    : 'daterange', anchor: '99%', startDateField: 'iddfFInicioPlantillaN'
        });

        this.tfDescripPlantillaN = new Ext.form.TextArea({
            id        : 'idtfDescripPlantillaN',
            fieldLabel: idioma.lbColDescripcion, tabIndex: 5,
            name      : 'descripcion', allowBlank: true,
            hiddenname: 'descripcion', maxLength: 250,
            anchor    : '99%', prevTab: 'iddfFFinPlantillaN', nextTab: 'idbtnCancelarPlantillaN',
            blankText : idioma.lbErrorCampoVacio,
        });
        this.tfOrden = new Ext.form.NumberField({
            fieldLabel: 'Orden',
            name      : 'orden',
            anchor    : '90%',
            id        : 'orden',
            allowBlank: false,
        });

        //Formulario de plantilla nominal.
        this.formularioPlantillaN = new Ext.FormPanel({
            id        : 'idformlarioPlantillaN',
            labelAlign: 'top',
            frame     : true,
            width     : 700,
            autoHeight: true,
            bodyStyle : {
                padding: '10px 10px 10px 10px',
            },
            items     : [
                {
                    layout: 'column',
                    items : [
                        {columnWidth: .8, layout: 'form', items: [this.tfDenomPlantillaN]},
                        // {columnWidth: .4, layout: 'form', items: [this.cmboxArea]},
                        {columnWidth: .2, layout: 'form', items: [this.tfOrden]},
                    ]
                },this.cmboxCentrosCosto,
                {
                    layout: 'column',
                    items : [
                        {columnWidth: .54, layout: 'form', items: [this.dfFInicioPlantillaN]},
                        {columnWidth: .46, layout: 'form', items: [this.dfFFinPlantillaN]}
                    ]
                },
                this.tfDescripPlantillaN
            ],
        });

        //Botones de la ventana de plantilla nominal.
        this.btnCancelarPlantillaN = new Ext.Button({
            id     : 'idbtnCancelarPlantillaN',
            iconCls: 'cancelar',
//           icon   : perfil.dirImg + 'cancelar.png',
            text   : idioma.lbBtnCancelar,
            tooltip: idioma.textToolTipCancelar,
            prevTab: 'idtfDescripPlantillaN',
            nextTab: 'idbtnAplicarPlantillaN',
        });

        this.btnAplicarPlantillaN = new Ext.Button({
            id     : 'idbtnAplicarPlantillaN',
            iconCls: 'aplicar',
//            icon   : perfil.dirImg + 'aplicar.png',
            text   : idioma.lbBtnAplicar,
            tooltip: idioma.textToolTipAplicar,
            prevTab: 'idbtnCancelarPlantillaN',
            nextTab: 'idbtnAceptarPlantillaN',
        });

        this.btnAceptarPlantillaN = new Ext.Button({
            id     : 'idbtnAceptarPlantillaN',
            iconCls: 'aceptar',
//            icon   : perfil.dirImg + 'aceptar.png',
            text   : idioma.lbBtnAceptar,
            tooltip: idioma.textToolTipAceptar,
            prevTab: 'idbtnAplicarPlantillaN',
            nextTab: 'idtfDenomPlantillaN',
        });

        //Ventana de adicionar y modificar plantilla nominal.
        this.ventanaPlantillaN = new Ext.Window({
            modal      : true,
            closeAction: 'hide',
            autoHeight : true,
            constrain  : true,
            closable   : true,
            resizable  : false,
            layout     : 'fit',
            items      : [this.formularioPlantillaN],
            buttons    : [this.btnCancelarPlantillaN, this.btnAplicarPlantillaN, this.btnAceptarPlantillaN],
        });

        //Tree de cargos restantes.    
        this.smTreeRest = new Ext.tree.DefaultSelectionModel({});

        this.TreeRest = new Ext.tree.TreePanel({
            title      : idioma.lbTitleTreeRest,
            region     : 'center',
            width      : '100%',
            height     : 435,
            split      : false,
            border     : true,
            rootVisible: false,
            autoScroll : true,
            layout     : 'fit',
            loader     : modelo.storeArbolRest,
            selModel   : this.smTreeRest,
            root       : new Ext.tree.AsyncTreeNode({
                text: 'Escala',
                // leaf:true,
                id  : 'root'
            }),
            bodyStyle  : {
                background: '#ffffff',
                padding   : '7px'
            },
        });

        //Tree de cargos insertados.    
        this.smTreeInsert = new Ext.tree.DefaultSelectionModel({});

        this.TreeInsert = new Ext.tree.TreePanel({
            title      : idioma.lbTitleTreeInsert,
            region     : 'center',
            width      : '100%',
            height     : '100%',
            split      : false,
            height     : 435,
            border     : true,
            rootVisible: false,
            autoScroll : true,
            layout     : 'fit',
            loader     : modelo.storeArbolInsert,
            selModel   : this.smTreeInsert,
            root       : new Ext.tree.AsyncTreeNode({
                text: 'Escala',
                // leaf:true,
                id  : 'root'
            }),
            bodyStyle  : {
                background: '#ffffff',
                padding   : '7px'
            },
        });

        //Botones de adicionar y eliminar cargos.
        this.btnAddestructura = new Ext.Button({
            disabled: true,
            id      : 'idbtnAddestructura',
            style   : 'margin-left:10px;margin-top:155px',
//            icon    : perfil.dirImg + 'siguiente.png',
            tooltip : idioma.textToolTipAddEstructP,
            iconCls : 'siguiente',
        });

        this.btnElimestructura = new Ext.Button({
            disabled: true,
            id      : 'idbtnElimestructura',
            style   : 'margin-left:10px;margin-top:70px',
//            icon    : perfil.dirImg + 'anterior.png',
            tooltip : idioma.textToolTipElimEstructP,
            iconCls : 'anterior',
        });

        //Formulario de estructura de plantilla.
        this.formularioEstructA = new Ext.FormPanel({
            labelAlign: 'top',
            frame     : true,
            region    : 'center',
            height    : 450,
            width     : 700,
            items     : [
                {
                    layout: 'column',
                    items : [
                        {
                            columnWidth: .47,
                            layout     : 'form',
                            items      : [
                                {
                                    xtype : 'panel',
                                    border: false,
                                    layout: 'fit',
                                    items : [this.TreeRest]
                                }
                            ]
                        },
                        {
                            columnWidth: .06,
                            layout     : 'form',
                            items      : [this.btnAddestructura, this.btnElimestructura],
                            anchor     : '100%'
                        },
                        {
                            columnWidth: .47,
                            layout     : 'form',
                            items      : [
                                {
                                    xtype : 'panel',
                                    border: true,
                                    frame : false,
                                    layout: 'fit',
                                    items : [this.TreeInsert]
                                }
                            ]
                        }
                    ]
                }
            ]
        });

        this.btnCerrarEstructP = new Ext.Button({
            id     : 'idbtnCerrarEstructP',
            iconCls: 'cerrar',
//            icon   : perfil.dirImg + 'cerrar.png',
            text   : idioma.lbBtnCerrar,
            tooltip: idioma.textToolTipCerrar,
        });

        //Ventana de adicionar y eliminar estructura de plantilla.
        this.ventanaEstructuraP = new Ext.Window({
            modal      : true,
            closeAction: 'hide',
            autoHeight : true,
            closable   : true,
            constrain  : true,
            resizable  : false,
            layout     : 'fit',
            items      : [this.formularioEstructA],
            buttons    : [this.btnCerrarEstructP],
        });

        //Vista general de la interfaz.
        new Ext.Viewport({
                layout: 'border',
                items : [this.panelEstEnt,
                    {
                        region: 'center',
                        border: true,
                        width : '40%',
                        layout: 'border',
                        tbar  : [this.btnAdicionarPlantillaN, this.btnModificarPlantillaN, this.btnEliminarPlantillaN, this.tfBuscarPlantillaN, this.btnBuscarPlantillaN, /*this.btnSincronizarPlantillaN,*/ this.btnGuardarOrdenPlantilla, this.btnEstructurarPlantillaN, '->' ,this.btnAyudaPlantillaN],
                        keys  : [
                            {
                                key      : 'b',
                                alt      : true,
                                stopEvent: true,
                                fn       : function () {
                                    self.btnBuscarPlantillaN.handler();
                                }
                            }
                        ],
                        items : [this.gpPlantillaN, this.ArbolPlantilla]
                    }
                ]
            }
        );

    }
};

//Inicializando la vista.
UCID.portal.cargarEtiquetas('gestplantillanominal', function (perfil, idioma) {
    perfil = arguments[0];
    idioma = arguments[1];

    //Inicializando el modelo.
    var modelo = Pvd.Nomina.Configuracion.PlantillaNominal.Modelo;
    modelo.init();
    //Inicializando la vista.
    var vista = Pvd.Nomina.Configuracion.PlantillaNominal.Vista;
    vista.init(perfil, idioma, modelo);
    //Inicializar controlador.
    Pvd.Nomina.Configuracion.PlantillaNominal.Controlador.init(idioma, vista, modelo);
});
