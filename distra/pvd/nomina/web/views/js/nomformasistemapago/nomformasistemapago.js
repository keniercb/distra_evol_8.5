Ext.ns('Pvd.Nomina.Nomencladores.NomFormaSistemaPago');

Pvd.Nomina.Nomencladores.NomFormaSistemaPago.Panel = Ext.extend(Ext.Panel, {
    layout: 'fit',
    region: 'center',
    heigth: '100%',
    width: '100%',
    html: 'dad',
    border: false,
    frame: false,
    hideBorders: true,
    perfil: this.perfil,
    idioma: this.idioma,
    mostrar: 1,
    initComponent: function () {

        //Inicializando el modelo.
        this.modelo = new Pvd_Nomina_Nomencladores_NomFormaSistemaPago_Modelo();
        this.modelo.init();

        //Inicializando la vista.
        this.vista = new Pvd_Nomina_Nomencladores_NomFormaSistemaPago_Vista();
        this.vista.init(this.perfil, this.idioma, this.modelo);

        //Inicializar controlador.
        this.controlador = new Pvd_Nomina_Nomencladores_NomFormaSistemaPago_Controlador();
        this.controlador.init(this.idioma, this.vista, this.modelo);

        this.items = [this.vista.panelCentral];

        //Teclas calientes de la interfaz
        this.keyMap = this.controlador.keyMap;

        Pvd.Nomina.Nomencladores.NomFormaSistemaPago.Panel.superclass.initComponent.call(this);
    },
    listeners: {
        afterlayout: function (x) {
            if (this.mostrar == 1) {
                this.modelo.storeFormaPago.load({params: {limit: 1000, start: 0}});
                // this.modelo.storeSistemaPago.load({params:{limit:20, start:0}});
                this.mostrar = 2;
            }
        },
        destroy: function (x) {
            this.keyMap.disable();
        },
    },
});

//Modelo de la vista del Nomenclador de formas y sistemas de pago.
var Pvd_Nomina_Nomencladores_NomFormaSistemaPago_Modelo = function () {
    /**
     * Inicializar el modelo de la vista.
     */
    this.init = function () {

        //Store del listado de formas de pago.
        this.storeFormaPago = new Ext.data.Store({
            url: '/pvd/nomina/index.php/nomformasistemapago/obtenerListadoFormasPago',
            reader: new Ext.data.JsonReader(
                {totalProperty: "cantidad", autoLoad: true, root: "datos", id: "idformapago"},
                [
                    {name: 'idformapago'}
                    ,
                    {name: 'denominacion'}
                    ,
                    {name: 'fechainicio'}
                    ,
                    {name: 'fechafin'}
                    ,
                    {name: 'descripcion'}
                ])
        });

        //Store del listado de sistemas de pago.
        this.storeSistemaPago = new Ext.data.Store({
            url: '/pvd/nomina/index.php/nomformasistemapago/obtenerListadoSistemasPago',
            reader: new Ext.data.JsonReader(
                {totalProperty: "cantidad", autoLoad: true, root: "datos", id: "idsistemapago"},
                [
                    {name: 'idsistemapago'}
                    ,
                    {name: 'denominacion'}
                    ,
                    {name: 'fechainicio'}
                    ,
                    {name: 'fechafin'}
                    ,
                    {name: 'descripcion'}
                    ,
                    {name: 'idformapago'}
                ])
        });

    }
};

//Vista del componente Nomenclador de formas y sistemas de pago.
var Pvd_Nomina_Nomencladores_NomFormaSistemaPago_Vista = function () {
    /**
     * Inicializar la vista.
     *
     * @param perfil Objeto que contiene el perfil de la IU (Tipo: Object).
     * @param idioma Objeto que contiene el idioma de los textos de la IU (Tipo: Object).
     * @param modelo Modelo de la vista del componente Nomenclador de formas y sistemas de pago (Tipo: Pvd_Nomina_Nomencladores_NomFormaSistemaPago_Modelo).
     */
    this.init = function (perfil, idioma, modelo) {
        var self = this;

        function centrarValor(val) {
            if (val)
                return "<center>" + val + "</center>";
        }

        //Botones de Add, Mod, Elim, Ayud de formas de pago.
        this.btnAdicionarFormP = new Ext.Button({
            id: 'btnAddFormP',
            text: idioma.lbBtnAdicionar,
            tooltip: idioma.textToolTipAddFormP,
            //icon: perfil.dirImg+'adicionar.png',
            iconCls: 'adicionar',
            prevTab: 'btnAyudaFormP',
            nextTab: 'btnModFormP',
        });

        this.btnModificarFormP = new Ext.Button({
            id: 'btnModFormP',
            text: idioma.lbBtnModificar,
            tooltip: idioma.textToolTipModFormP,
            // icon: perfil.dirImg+'modificar.png',
            iconCls: 'modificar',
            prevTab: 'btnAddFormP',
            nextTab: 'btnElimFormP',
        });

        this.btnEliminarFormP = new Ext.Button({
            id: 'btnElimFormP',
            text: idioma.lbBtnEliminar,
            tooltip: idioma.textToolTipElimFormP,
            //icon: perfil.dirImg+'eliminar.png',
            iconCls: 'eliminar',
            prevTab: 'btnModFormP',
            nextTab: 'btnAyudaFormP',
        });

        this.btnExportarFormP = new Ext.Button({
            id: 'btnExportarFormP',
            text: 'Exportar',
            tooltip: 'Exportar',
            iconCls: 'exportar'
        });

        this.btnAyudaFormP = new Ext.Button({
            id: 'btnAyudaFormP',
            text: idioma.lbBtnAyuda,
            tooltip: idioma.textToolTipAyudaFormP,
            // icon:perfil.dirImg+'ayuda.png',
            iconCls: 'ayuda',
            prevTab: 'btnElimFormP',
            nextTab: 'btnAddFormP',
        });

        //Listado de formas de pago.
        this.expanderFormaPago = new Ext.grid.RowExpander({
            tpl: new Ext.Template(
                '<div style="word-wrap:break-word;white-space:normal;"><p>&nbsp;&nbsp;Descripci&oacute;n:&nbsp;{descripcion}</p><br/></div>'
            ), enableCaching: false
        });

        this.smFormaPago = new Ext.grid.RowSelectionModel({
            singleSelect: true,
        });

        this.gpFormaPago = new Ext.grid.GridPanel({
            id: 'idgpFormaPago',
            title: idioma.lbTitleFormaPago,
            region: 'center',
            columns: [
                {header: 'idformapago', hidden: true, hideable: false, dataIndex: 'idformapago'}
                ,
                this.expanderFormaPago
                ,
                {header: idioma.lbColDenominacion, width: 500, sortable: true, dataIndex: 'denominacion'}
                ,
                {
                    header: '<center>' + idioma.lbColDesde + '</center>',
                    width: 110,
                    sortable: false,
                    dataIndex: 'fechainicio',
                    renderer: centrarValor
                }
                ,
                {
                    header: '<center>' + idioma.lbColHasta + '</center>',
                    width: 110,
                    sortable: false,
                    dataIndex: 'fechafin',
                    renderer: centrarValor
                }
            ],
            stripeRows: true,
            autoScroll: true,
            border: false,
            width: '100%',
            heigth: '100%',
            viewConfig: {forceFit: true},
            store: modelo.storeFormaPago,
            sm: this.smFormaPago,
            plugins: this.expanderFormaPago,
            loadMask: {msg: idioma.lbMaskGridCargando},
            bbar: new Ext.PagingToolbar({
                pageSize: 1000,
                store: modelo.storeFormaPago,
                displayInfo: true,
                displayMsg: 'Mostrando  {0} - {1} de {2}',
                emptyMsg: "0 Resultado a mostrar"
            }),
        });

        //Botones de Add, Mod, Elim, Ayud de sistemas de pago.
        this.btnAdicionarSistP = new Ext.Button({
            id: 'btnAddSistP',
            text: idioma.lbBtnAdicionar,
            tooltip: idioma.textToolTipAddSistP,
            // icon: perfil.dirImg+'adicionar.png',
            iconCls: 'adicionar',
            prevTab: 'btnAyudaSistP',
            nextTab: 'btnModSistP',
        });

        this.btnModificarSistP = new Ext.Button({
            id: 'btnModSistP',
            text: idioma.lbBtnModificar,
            tooltip: idioma.textToolTipModSistP,
            // icon: perfil.dirImg+'modificar.png',
            iconCls: 'modificar',
            prevTab: 'btnAddSistP',
            nextTab: 'btnElimSistP',
        });

        this.btnEliminarSistP = new Ext.Button({
            id: 'btnElimSistP',
            text: idioma.lbBtnEliminar,
            tooltip: idioma.textToolTipElimSistP,
            //icon: perfil.dirImg+'eliminar.png',
            iconCls: 'eliminar',
            prevTab: 'btnModSistP',
            nextTab: 'btnAyudaSistP',
        });

        this.btnAyudaSistP = new Ext.Button({
            id: 'btnAyudaSistP',
            text: idioma.lbBtnAyuda,
            tooltip: idioma.textToolTipAyudaSistP,
            icon: perfil.dirImg + 'ayuda.png',
            iconCls: 'ayuda',
            prevTab: 'btnElimSistP',
            nextTab: 'btnAddSistP',
        });

        //Listado de sistemas de pago.
        this.expanderSistemaPago = new Ext.grid.RowExpander({
            tpl: new Ext.Template(
                '<div style="word-wrap:break-word;white-space:normal;"><p>&nbsp;&nbsp;Descripci&oacute;n:&nbsp;{descripcion}</p><br/></div>'
            ), enableCaching: false
        });

        this.smSistemaPago = new Ext.grid.RowSelectionModel({
            singleSelect: true,
        });

        this.gpSistemaPago = new Ext.grid.GridPanel({
            id: 'idgpSistemaPago',
            title: idioma.lbTitleSistemaPago,
            region: 'center',
            columns: [
                {header: 'idsistemapago', hidden: true, hideable: false, dataIndex: 'idsistemapago'}
                ,
                this.expanderSistemaPago
                ,
                {header: idioma.lbColDenominacion, width: 500, sortable: true, dataIndex: 'denominacion'}
                ,
                {
                    header: '<center>' + idioma.lbColDesde + '</center>',
                    width: 110,
                    sortable: true,
                    dataIndex: 'fechainicio',
                    renderer: centrarValor
                }
                ,
                {
                    header: '<center>' + idioma.lbColHasta + '</center>',
                    width: 110,
                    sortable: true,
                    dataIndex: 'fechafin',
                    renderer: centrarValor
                }
            ],
            stripeRows: true,
            autoScroll: true,
            border: false,
            width: '100%',
            heigth: '100%',
            viewConfig: {forceFit: true},
            store: modelo.storeSistemaPago,
            sm: this.smSistemaPago,
            plugins: this.expanderSistemaPago,
            loadMask: {msg: idioma.lbMaskGridCargando},
            bbar: new Ext.PagingToolbar({
                pageSize: 20,
                store: modelo.storeSistemaPago,
                displayInfo: true,
                displayMsg: 'Mostrando  {0} - {1} de {2}',
                emptyMsg: "0 Resultado a mostrar"
            }),
            keys: [
                {
                    key: Ext.EventObject.DELETE,
                    alt: true,
                    stopEvent: true,
                    fn: function () {
                        if (!self.btnEliminarSistP.disabled) {
                            self.btnEliminarSistP.handler();
                        }
                    }
                },
                {
                    key: 'a',
                    alt: true,
                    stopEvent: true,
                    fn: function () {
                        if (!self.btnAdicionarSistP.disabled) {
                            self.btnAdicionarSistP.handler();
                        }
                    }
                },
                {
                    key: 'u',
                    alt: true,
                    stopEvent: true,
                    fn: function () {
                        if (!self.btnModificarSistP.disabled) {
                            self.btnModificarSistP.handler();
                        }
                    }
                }
            ]
        });

        //Panel contenedor general de los grids de formas y sistemas de pago. 
        this.panelCentral = new Ext.Panel({
            id: 'idpanelCentral',
            region: 'center',
            heigth: '100%',
            width: '100%',
            border: false,
            layout: 'border',
            //tbar:[this.btnAdicionarSectSal, this.btnModificarSectSal, this.btnEliminarSectSal, '->', this.btnAyudaSectSal],
            items: [
                {
                    region: 'center',
                    width: '50%',
                    border: true,
                    layout: 'fit',
                    tbar: [this.btnAdicionarFormP, this.btnModificarFormP, this.btnEliminarFormP, this.btnExportarFormP],
                    items: [this.gpFormaPago]
                },
                {
                    region: 'east',
                    width: '50%',
                    border: true,
                    layout: 'fit',
                    tbar: [this.btnAdicionarSistP, this.btnModificarSistP, this.btnEliminarSistP, '->', this.btnAyudaSistP],
                    items: [this.gpSistemaPago]
                }
            ],
        });

        //Campo del formulario de formas de pago.
        this.tfDenomFormP = new Ext.form.TextField({
            id: 'idtfDenomFormP',
            fieldLabel: idioma.lbColDenominacion,
            tabIndex: 2,
            name: 'denominacion',
            allowBlank: false,
            anchor: '99%',
            prevTab: 'idbtnAceptarFormP',
            //regex:/^(([a-zA-Z0-9ÁÉÍÓÚáéíóúñüÑ]+)([ \_\-]([a-zA-Z0-9ÁÉÍÓÚáéíóúñüÑ]+))*)$/,
            vtype: 'vtdenominaciones',
            regexText: idioma.lbDenomIncorr,
            blankText: idioma.lbErrorCampoVacio,
            maxLength: 100,
            maxLengthText: idioma.lbMaxText_100,
        });

        this.dfFInicioFormP = new Ext.form.DateField({
            id: 'iddfFInicioFormP', fieldLabel: idioma.lbColDesde,
            tabIndex: 3, name: 'fechainicio', allowBlank: false,
            format: 'd/m/Y', editable: true, readOnly: false,
            value: new Date().format('d/m/Y'), maxText: idioma.lbFechaMaxima,
            minText: idioma.lbFechaMinima, blankText: idioma.lbErrorCampoVacio,
            invalidText: idioma.invalidTextFecha, vtype: 'daterange',
            anchor: '90%', endDateField: 'iddfFFinFormP'
        });

        this.dfFFinFormP = new Ext.form.DateField({
            id: 'iddfFFinFormP', fieldLabel: idioma.lbColHasta,
            tabIndex: 4, name: 'fechafin', xtype: 'datefield', allowBlank: true,
            format: 'd/m/Y', editable: true, readOnly: false,
            maxText: idioma.lbFechaMaxima, minText: idioma.lbFechaMinima,
            blankText: idioma.lbErrorCampoVacio, invalidText: idioma.invalidTextFecha,
            vtype: 'daterange', anchor: '99%', startDateField: 'iddfFInicioFormP'
        });

        this.tfDescripFormP = new Ext.form.TextArea({
            id: 'idtfDescripFormP',
            fieldLabel: idioma.lbColDescripcion,
            tabIndex: 5,
            name: 'descripcion',
            allowBlank: true,
            hiddenname: 'descripcion',
            anchor: '99%',
            prevTab: 'iddfFFinFormP',
            nextTab: 'idbtnCancelarFormP',
            blankText: idioma.lbErrorCampoVacio,
            maxLength: 255,
            maxLengthText: idioma.lbMaxText_255,
        });

        //Campo del formulario de sistemas de pago.
        this.tfDenomSistP = new Ext.form.TextField({
            id: 'idtfDenomSistP', fieldLabel: idioma.lbColDenominacionSP,
            tabIndex: 2, name: 'denominacion', allowBlank: false, anchor: '99%',
            blankText: idioma.lbErrorCampoVacio, prevTab: 'idbtnAceptarSistP',
//                                        regex:/^([a-zA-ZÁÉÍÓÚáéíóúñüÑ\d ]+(\d*)?)+$/,
            vtype: 'vtdenominaciones',
            regexText: idioma.lbDenomIncorr,
            blankText: idioma.lbErrorCampoVacio,
            maxLength: 100,
            maxLengthText: idioma.lbMaxText_100,
        });

        this.dfFInicioSistP = new Ext.form.DateField({
            id: 'iddfFInicioSistP', fieldLabel: idioma.lbColDesdeSP,
            tabIndex: 3, name: 'fechainicio', allowBlank: false,
            format: 'd/m/Y', editable: true, readOnly: false,
            value: new Date().format('d/m/Y'), maxText: idioma.lbFechaMaxima,
            minText: idioma.lbFechaMinima, blankText: idioma.lbErrorCampoVacio,
            invalidText: idioma.invalidTextFecha, vtype: 'daterange',
            anchor: '90%', endDateField: 'iddfFFinSistP'
        });

        this.dfFFinSistP = new Ext.form.DateField({
            id: 'iddfFFinSistP', fieldLabel: idioma.lbColHastaSP,
            tabIndex: 4, name: 'fechafin', xtype: 'datefield', allowBlank: true,
            format: 'd/m/Y', editable: true, readOnly: false,
            maxText: idioma.lbFechaMaxima, minText: idioma.lbFechaMinima,
            blankText: idioma.lbErrorCampoVacio, invalidText: idioma.invalidTextFecha,
            vtype: 'daterange', anchor: '99%', startDateField: 'iddfFInicioSistP'
        });

        this.tfDescripSistP = new Ext.form.TextArea({
            id: 'idtfDescripSistP',
            fieldLabel: idioma.lbColDescripcionSP, tabIndex: 5,
            name: 'descripcion', allowBlank: true,
            hiddenname: 'descripcion',
            anchor: '99%', prevTab: 'iddfFFinSistP', nextTab: 'idbtnCancelarSistP',
            blankText: idioma.lbErrorCampoVacio,
            maxLength: 255,
            maxLengthText: idioma.lbMaxText_255,
        });

        //Formulario de formas pago.
        this.formularioFormP = new Ext.FormPanel({
            id: 'idformlarioFormP',
            labelAlign: 'top',
            frame: true,
            width: 300,
            autoHeight: true,
            bodyStyle: {
                padding: '10px 10px 10px 10px',
            },
            items: [
                {
                    layout: 'column',
                    items: [
                        {columnWidth: .99, layout: 'form', items: [this.tfDenomFormP]},
                    ]
                },
                {
                    layout: 'column',
                    items: [
                        {columnWidth: .54, layout: 'form', items: [this.dfFInicioFormP]},
                        {columnWidth: .46, layout: 'form', items: [this.dfFFinFormP]}
                    ]
                },
                this.tfDescripFormP
            ],
        });

        //Formulario de sistemas de pago.
        this.formularioSistP = new Ext.FormPanel({
            id: 'idformlarioSistP',
            labelAlign: 'top',
            frame: true,
            width: 300,
            autoHeight: true,
            bodyStyle: {
                padding: '10px 10px 10px 10px',
            },
            items: [
                {
                    layout: 'column',
                    items: [
                        {columnWidth: .99, layout: 'form', items: [this.tfDenomSistP]},
                    ]
                },
                {
                    layout: 'column',
                    items: [
                        {columnWidth: .54, layout: 'form', items: [this.dfFInicioSistP]},
                        {columnWidth: .46, layout: 'form', items: [this.dfFFinSistP]}
                    ]
                },
                this.tfDescripSistP
            ],
        });

        //Botones de la ventana de formas de pago
        this.btnCancelarFormP = new Ext.Button({
            id: 'idbtnCancelarFormP',
            iconCls: 'cancelar',
            // icon:perfil.dirImg+'cancelar.png',
            text: idioma.lbBtnCancelar,
            tooltip: idioma.textToolTipCancelar,
            prevTab: 'idtfDescripFormP',
            nextTab: 'idbtnAplicarFormP',
        });

        this.btnAplicarFormP = new Ext.Button({
            id: 'idbtnAplicarFormP',
            iconCls: 'aplicar',
            // icon:perfil.dirImg+'aplicar.png',
            text: idioma.lbBtnAplicar,
            tooltip: idioma.textToolTipAplicar,
            prevTab: 'idbtnCancelarFormP',
            nextTab: 'idbtnAceptarFormP',
        });

        this.btnAceptarFormP = new Ext.Button({
            id: 'idbtnAceptarFormP',
            iconCls: 'aceptar',
            // icon:perfil.dirImg+'aceptar.png',
            text: idioma.lbBtnAceptar,
            tooltip: idioma.textToolTipAceptar,
            prevTab: 'idbtnAplicarFormP',
            nextTab: 'idtfDenomFormP',
        });

        //Botones de la ventana de formas de pago
        this.btnCancelarSistP = new Ext.Button({
            id: 'idbtnCancelarSistP',
            iconCls: 'cancelar',
            // icon:perfil.dirImg+'cancelar.png',
            text: idioma.lbBtnCancelar,
            tooltip: idioma.textToolTipCancelar,
            prevTab: 'idtfDescripSistP',
            nextTab: 'idbtnAplicarSistP',
        });

        this.btnAplicarSistP = new Ext.Button({
            id: 'idbtnAplicarSistP',
            iconCls: 'aplicar',
            // icon:perfil.dirImg+'aplicar.png',
            text: idioma.lbBtnAplicar,
            tooltip: idioma.textToolTipAplicar,
            prevTab: 'idbtnCancelarSistP',
            nextTab: 'idbtnAceptarSistP',
        });

        this.btnAceptarSistP = new Ext.Button({
            id: 'idbtnAceptarSistP',
            iconCls: 'aceptar',
            // icon:perfil.dirImg+'aceptar.png',
            text: idioma.lbBtnAceptar,
            tooltip: idioma.textToolTipAceptar,
            prevTab: 'idbtnAplicarSistP',
            nextTab: 'idtfDenomSistP',
        });

        //Ventana de adicionar y modificar formas de pago.
        this.ventanaFormP = new Ext.Window({
            modal: true,
            closeAction: 'hide',
            autoHeight: true,
            closable: true,
            constrain: true,
            resizable: false,
            layout: 'fit',
            autoValidate: true,
            validateDefault: true,
            items: [this.formularioFormP],
            buttons: [this.btnCancelarFormP, this.btnAplicarFormP, this.btnAceptarFormP],
            keys: [
                {
                    key: Ext.EventObject.ENTER,
                    stopEvent: true,
                    fn: function () {
                        if (!self.btnAceptarFormP.disabled) {
                            self.btnAceptarFormP.handler();
                        }
                    }
                },
                {
                    key: 'x',
                    alt: true,
                    stopEvent: true,
                    fn: function () {
                        if (!self.btnCancelarFormP.disabled) {
                            self.btnCancelarFormP.handler();
                        }
                    }
                },
                {
                    key: 'p',
                    alt: true,
                    stopEvent: true,
                    fn: function () {
                        if (!self.btnAplicarFormP.disabled) {
                            self.btnAplicarFormP.handler();
                        }
                    }
                }
            ]
        });

        //Ventana de adicionar y modificar sistemas de pago.
        this.ventanaSistP = new Ext.Window({
            modal: true,
            closeAction: 'hide',
            autoHeight: true,
            closable: true,
            constrain: true,
            resizable: false,
            layout: 'fit',
            autoValidate: true,
            validateDefault: true,
            items: [this.formularioSistP],
            buttons: [this.btnCancelarSistP, this.btnAplicarSistP, this.btnAceptarSistP],
            keys: [
                {
                    key: Ext.EventObject.ENTER,
                    stopEvent: true,
                    fn: function () {
                        if (!self.btnAceptarSistP.disabled) {
                            self.btnAceptarSistP.handler();
                        }
                    }
                },
                {
                    key: 'x',
                    alt: true,
                    stopEvent: true,
                    fn: function () {
                        if (!self.btnCancelarSistP.disabled) {
                            self.btnCancelarSistP.handler();
                        }
                    }
                },
                {
                    key: 'p',
                    alt: true,
                    stopEvent: true,
                    fn: function () {
                        if (!self.btnAplicarSistP.disabled) {
                            self.btnAplicarSistP.handler();
                        }
                    }
                }
            ]
        });
    }
};

//Controlador de la vista del Nomenclador de formas y sistemas de pago.
var Pvd_Nomina_Nomencladores_NomFormaSistemaPago_Controlador = function () {
    /**
     * Inicializar el controlador de la vista.
     *
     * @param idioma Objeto que contiene el idioma de los textos de la IU (Tipo: Object).
     * @param vista Vista del componente Nomenclador de formas y sistemas de pago (Tipo: Pvd_Nomina_Nomencladores_NomFormaSistemaPago_Vista)
     * @param modelo Modelo de la vista del componente Nomenclador de formas y sistemas de pago (Tipo: Pvd_Nomina_Nomencladores_NomFormaSistemaPago_Modelo)
     */
    this.init = function (idioma, vista, modelo) {
        var _vista = vista;
        /**
         *Variables generales.
         */
        var variablesGenerales = {
            accionFormP: 'Add',
            cambioFormP: 0,
            accionSistP: 'Add',
            cambioSistP: 0,
            idformapago: 0,
        };

        //Eventos del grid de formas de pago.
        vista.gpFormaPago.on('rowdblclick', function (e) {
            mostrarVentanaModificarFormP();
        });

        vista.gpFormaPago.on('destroy', function (e) {
            vista.ventanaFormP.destroy();
        });

        //Eventos del grid de sistemas de pago.
        vista.gpSistemaPago.on('rowdblclick', function (e) {
            mostrarVentanaModificarSistP();
        });

        vista.gpSistemaPago.on('destroy', function (e) {
            vista.ventanaSistP.destroy();
        });

        //Eventos del store de formas de pago.
        modelo.storeFormaPago.on('beforeload', function (store) {
            vista.btnModificarFormP.disable();
            vista.btnEliminarFormP.disable();
            store.removeAll();

            variablesGenerales.idformapago = 0;

            vista.btnAdicionarSistP.disable();
            vista.btnModificarSistP.disable();
            vista.btnEliminarSistP.disable();
            modelo.storeSistemaPago.removeAll();
        });

        modelo.storeFormaPago.on('load', function (store, records, opt) {
            if (!records.length) {
                mostrarMensaje(1, idioma.lbMsgNoExistenDatos);
            }
        });

        //Eventos del store de sistemas de pago.
        modelo.storeSistemaPago.on('beforeload', function (store) {
            store.baseParams.idformapago = variablesGenerales.idformapago;
            vista.btnModificarSistP.disable();
            vista.btnEliminarSistP.disable();
            store.removeAll();
        });

        modelo.storeSistemaPago.on('load', function (store, records, opt) {
            if (!records.length) {
                mostrarMensaje(1, idioma.lbMsgNoExistenDatos);
            }
        });

        //Eventos del seleccion model del grid de formas de pago.
        vista.smFormaPago.on('rowselect', function (sm, index, store) {
            variablesGenerales.idformapago = store.get('idformapago');

            vista.btnModificarFormP.enable();
            vista.btnEliminarFormP.enable();

            vista.btnAdicionarSistP.enable();
            modelo.storeSistemaPago.load({params: {limit: 20, start: 0}});
        });

        //Eventos del seleccion model del grid de sistemas de pago.
        vista.smSistemaPago.on('rowselect', function () {
            vista.btnModificarSistP.enable();
            vista.btnEliminarSistP.enable();
        });

        //Eventos de campo de denominacion formas de pago. 
        vista.tfDenomFormP.on('change', function (tf, n, o) {
            variablesGenerales.cambioFormP = 1;
        });

        //Eventos de campo de fecha inicio formas de pago. 
        vista.dfFInicioFormP.on('change', function (tf, n, o) {
            variablesGenerales.cambioFormP = 1;
        });

        //Eventos de campo de fecha fin formas de pago. 
        vista.dfFFinFormP.on('change', function (tf, n, o) {
            variablesGenerales.cambioFormP = 1;
        });

        //Eventos de campo de descripcion formas de pago. 
        vista.tfDescripFormP.on('change', function (tf, n, o) {
            variablesGenerales.cambioFormP = 1;
        });

        //Eventos del botón adicionar formas de pago.
        vista.btnAdicionarFormP.setHandler(function () {
            mostrarVentanaAdicionarFormP();
        });

        //Eventos del botón modificar formas de pago.
        vista.btnModificarFormP.setHandler(function () {
            mostrarVentanaModificarFormP();
        });

        //Eventos del botón eliminar formas de pago.
        vista.btnEliminarFormP.setHandler(function () {
            eliminarFormaPago();
        });

        //Exportar
        vista.btnExportarFormP.on('click', function () {
            var winload = new Ext.PVD.comun.window.winLoad({
                title: 'Por favor espere...',
                mensaje: 'Generando reporte'
            });
            winload.showMask();
            var iframe = document.createElement("iframe");
            iframe.src = document.location.protocol + '//' + document.location.host +
                '/pvd/nomina/index.php/nomformasistemapago/exportarNomenclador';
            iframe.style.display = 'none';
            var that = this;
            iframe.onload = function () {
                winload.hideMask();
                //that.destroy();
            };
            document.body.appendChild(iframe);
        });

        //Eventos de campo de denominacion sistemas de pago. 
        vista.tfDenomSistP.on('change', function (tf, n, o) {
            variablesGenerales.cambioSistP = 1;
        });

        //Eventos de campo de fecha inicio sistemas de pago. 
        vista.dfFInicioSistP.on('change', function (tf, n, o) {
            variablesGenerales.cambioSistP = 1;
        });

        //Eventos de campo de fecha fin sistemas de pago. 
        vista.dfFFinSistP.on('change', function (tf, n, o) {
            variablesGenerales.cambioSistP = 1;
        });

        //Eventos de campo de descripcion sistemas de pago. 
        vista.tfDescripSistP.on('change', function (tf, n, o) {
            variablesGenerales.cambioSistP = 1;
        });

        //Eventos del botón adicionar sistemas de pago.
        vista.btnAdicionarSistP.setHandler(function () {
            mostrarVentanaAdicionarSistP();
        });

        //Eventos del botón modificar sistemas de pago.
        vista.btnModificarSistP.setHandler(function () {
            mostrarVentanaModificarSistP();
        });

        //Eventos del botón eliminar sistemas de pago.
        vista.btnEliminarSistP.setHandler(function () {
            eliminarSistemaPago();
        });


        //Eventos del botón cancelar formas de pago.
        vista.btnCancelarFormP.setHandler(function () {
            vista.ventanaFormP.hide();
//            vista.formularioFormP.purgeListeners();
        });

        //Eventos del botón aplicar formas de pago.
        vista.btnAplicarFormP.setHandler(function () {
            salvarFormularioFormP(true);
        });

        //Eventos del botón aceptar formas de pago.
        vista.btnAceptarFormP.setHandler(function () {
            salvarFormularioFormP(false);
//            vista.formularioFormP.purgeListeners();
        });

        //Eventos del botón cancelar sistemas de pago.
        vista.btnCancelarSistP.setHandler(function () {
            vista.ventanaSistP.hide();
//            vista.formularioSistP.purgeListeners();
        });

        //Eventos del botón aplicar sistemas de pago.
        vista.btnAplicarSistP.setHandler(function () {
            salvarFormularioSistP(true);
        });

        //Eventos del botón aceptar sistemas de pago.
        vista.btnAceptarSistP.setHandler(function () {
            salvarFormularioSistP(false);
//            vista.formularioSistP.purgeListeners();
        });

        //Evento de la ventana de adicionar/modificar formas de pago.
        vista.ventanaFormP.on('beforeshow', function (ventana) {
            variablesGenerales.cambioFormP = 0;
            vista.formularioFormP.getForm().reset();
            vista.tfDenomFormP.focus(true, 500);
        });

        //Evento de la ventana de adicionar/modificar sistemas de pago.
        vista.ventanaSistP.on('beforeshow', function (ventana) {
            variablesGenerales.cambioSistP = 0;
            vista.formularioSistP.getForm().reset();
            vista.tfDenomSistP.focus(true, 500);
        });

        /*
         *Función de mostrar la ventana de adicionar forma de pago.
         */
        function mostrarVentanaAdicionarFormP() {
            vista.ventanaFormP.setTitle(idioma.lbTitleVentAdicionarFormP);
            vista.btnAplicarFormP.show();
            vista.ventanaFormP.show();
            //Actualizar la tabulación deL formulario.
            vista.btnCancelarFormP.setNextElement('idbtnAplicarFormP');
            vista.btnAceptarFormP.setPreviousElement('idbtnAplicarFormP');
            variablesGenerales.accionFormP = 'Add';
        }

        /*
         *Función de mostrar la ventana de adicionar sistema de pago.
         */
        function mostrarVentanaAdicionarSistP() {
            vista.ventanaSistP.setTitle(idioma.lbTitleVentAdicionarSistP);
            vista.btnAplicarSistP.show();
            vista.ventanaSistP.show();
            //Actualizar la tabulación deL formulario.
            vista.btnCancelarSistP.setNextElement('idbtnAplicarSistP');
            vista.btnAceptarSistP.setPreviousElement('idbtnAplicarSistP');
            variablesGenerales.accionSistP = 'Add';
        }

        /*
         *Función de mostrar la ventana de modificar forma de pago.
         */
        function mostrarVentanaModificarFormP() {
            vista.ventanaFormP.setTitle(idioma.lbTitleVentModificarFormP);
            vista.btnAplicarFormP.hide();
            vista.ventanaFormP.show();
            //Actualizar la tabulación deL formulario.
            vista.btnCancelarFormP.setNextElement('idbtnAceptarFormP');
            vista.btnAceptarFormP.setPreviousElement('idbtnCancelarFormP');
            vista.formularioFormP.getForm().loadRecord(vista.smFormaPago.getSelected());
//            vista.formularioFormP.addListener('clientvalidation', function (_form, _valid) {
//                if (comparar(vista.formularioFormP.getForm().getValues(), vista.smFormaPago.getSelected().data)) {
//                    vista.btnAceptarFormP.setDisabled(true);
//                } else {
//                    vista.btnAceptarFormP.enable();
//                }
//            });
            variablesGenerales.accionFormP = 'Mod';
        }

        /*
         *Función de mostrar la ventana de modificar sistema de pago.
         */
        function mostrarVentanaModificarSistP() {
            vista.ventanaSistP.setTitle(idioma.lbTitleVentModificarSistP);
            vista.btnAplicarSistP.hide();
            vista.ventanaSistP.show();
            //Actualizar la tabulación deL formulario.
            vista.btnCancelarSistP.setNextElement('idbtnAceptarSistP');
            vista.btnAceptarSistP.setPreviousElement('idbtnCancelarSistP');
            vista.formularioSistP.getForm().loadRecord(vista.smSistemaPago.getSelected());

//            vista.formularioSistP.addListener('clientvalidation', function (_form, _valid) {
//                if (comparar(vista.formularioSistP.getForm().getValues(), vista.smSistemaPago.getSelected().data)) {
//                    vista.btnAceptarSistP.setDisabled(true);
//                } else {
//                    vista.btnAceptarSistP.enable();
//                }
//            });

            variablesGenerales.accionSistP = 'Mod';
        }

        /*
         *Función para adicionar/modificar una forma de pago.
         */
        function salvarFormularioFormP(boton) {

            var urlAction = '/pvd/nomina/index.php/nomformasistemapago/adicionarFormaPago';
            var idformapago = 0;
            var lbMsgEspera = idioma.lbMsgAdicionarFomP;
            var lbMsgExito = idioma.lbMsgCorrectoAdicionadoFormP;

            if (variablesGenerales.accionFormP == 'Mod') {
                lbMsgEspera = idioma.lbMsgModificarFomP;
                lbMsgExito = idioma.lbMsgCorrectoModificadoFormP;
                urlAction = '/pvd/nomina/index.php/nomformasistemapago/modificarFormaPago';
                idformapago = vista.smFormaPago.getSelected().get('idformapago');
            }
            if (variablesGenerales.cambioFormP == 0) {
                if (variablesGenerales.accionFormP == 'Mod') {
                    //Se oculta la ventana si no ha sido modificado ningún valor.
                    vista.ventanaFormP.hide();
                } else {
                    //Se marcan como obligatorios en caso de presionar aceptar y se encuentren vacíos.
                    vista.tfDenomFormP.markInvalid(idioma.lbErrorCampoVacio);
                    mostrarMensaje(3, idioma.lbErrorFormulario);
                }
            } else {
                //Se verifica si el formulario es válido y si el campo sueldo contiene un valor
                if (vista.formularioFormP.getForm().isValid()) {

                    //Se muestra la máscara de espera.
                    PVD.mostrarMascara('idmaskaddmodformap', idioma.lbMsgEsperaEnviarDatos, lbMsgEspera);

                    //Enviando datos al servidor.
                    Ext.Ajax.request({
                        url: urlAction,
                        method: 'POST',
                        params: {
                            idformapago: idformapago,
                            denominacion: vista.tfDenomFormP.getValue(),
                            fechainicio: vista.dfFInicioFormP.getRawValue(),
                            fechafin: vista.dfFFinFormP.getRawValue(),
                            descripcion: vista.tfDescripFormP.getValue(),
                        },
                        callback: function (options, success, response) {
                            responseData = Ext.decode(response.responseText);

                            //Ocultando máscara de enviar datos.
                            PVD.ocultarMascara('idmaskaddmodformap');

                            if (responseData.codigo == 1) {
                                mostrarMensaje(1, lbMsgExito);
                                if (!boton) {
                                    vista.ventanaFormP.hide();

                                } else {
                                    vista.tfDenomFormP.focus(true, 500);
                                }
                                vista.formularioFormP.getForm().reset();
                                modelo.storeFormaPago.removeAll();
                                modelo.storeFormaPago.load({params: {limit: 1000, start: 0}});
                                variablesGenerales.cambioFormP = 0;


                            } else {
                                if (responseData.codigo)
                                    mostrarMensaje(3, responseData.msg);
                            }
                        }
                    });
                } else {
                    mostrarMensaje(3, idioma.lbErrorFormulario);
                }
            }
        }

        /*
         *Función para adicionar/modificar un sistema de pago.
         */
        function salvarFormularioSistP(boton) {

            var urlAction = '/pvd/nomina/index.php/nomformasistemapago/adicionarSistemaPago';
            var idsistemapago = 0;
            var idformapago = vista.smFormaPago.getSelected().get('idformapago');
            var lbMsgEspera = idioma.lbMsgAdicionarSistP;
            var lbMsgExito = idioma.lbMsgCorrectoAdicionadoSistP;
            if (variablesGenerales.accionSistP == 'Mod') {
                //Validar que hubo algún cambio en el formulario modificar, al presionar la tecla Enter
                fnValidarCambios();

                lbMsgEspera = idioma.lbMsgModificarSistP;
                lbMsgExito = idioma.lbMsgCorrectoModificadoSistP;
                urlAction = '/pvd/nomina/index.php/nomformasistemapago/modificarSistemaPago';
                idsistemapago = vista.smSistemaPago.getSelected().get('idsistemapago');
            }

            if (variablesGenerales.cambioSistP == 0) {
                if (variablesGenerales.accionSistP == 'Mod') {
                    //Se oculta la ventana si no ha sido modificado ningún valor.
                    vista.ventanaSistP.hide();
                } else {
                    //Se marcan como obligatorios en caso de presionar aceptar y se encuentren vacíos.
                    vista.tfDenomSistP.markInvalid(idioma.lbErrorCampoVacio);
                    mostrarMensaje(3, idioma.lbErrorFormulario);
                }
            } else {
                //Se verifica si el formulario es válido y si el campo sueldo contiene un valor
                if (vista.formularioSistP.getForm().isValid()) {

                    //Se muestra la máscara de espera.
                    PVD.mostrarMascara('idmaskaddmodsistemap', idioma.lbMsgEsperaEnviarDatos, lbMsgEspera);

                    //Enviando datos al servidor.
                    Ext.Ajax.request({
                        url: urlAction,
                        method: 'POST',
                        params: {
                            idsistemapago: idsistemapago,
                            denominacion: vista.tfDenomSistP.getValue(),
                            fechainicio: vista.dfFInicioSistP.getRawValue(),
                            fechafin: vista.dfFFinSistP.getRawValue(),
                            descripcion: vista.tfDescripSistP.getValue(),
                            idformapago: idformapago,
                        },
                        callback: function (options, success, response) {
                            responseData = Ext.decode(response.responseText);

                            //Ocultando máscara de enviar datos.
                            PVD.ocultarMascara('idmaskaddmodsistemap');

                            if (responseData.codigo == 1) {
                                mostrarMensaje(1, lbMsgExito);
                                if (!boton) {
                                    vista.ventanaSistP.hide();

                                } else {
                                    vista.tfDenomSistP.focus(true, 500);
                                }
                                vista.formularioSistP.getForm().reset();
                                modelo.storeSistemaPago.removeAll();
                                modelo.storeSistemaPago.load({params: {limit: 20, start: 0}});
                                variablesGenerales.cambioSistP = 0;


                            } else {
                                if (responseData.codigo)
                                    mostrarMensaje(responseData.codigo, responseData.mensaje);
                            }
                        }
                    });
                } else {
                    mostrarMensaje(3, idioma.lbErrorFormulario);
                }
            }
        }

        function fnValidarCambios() {
            variablesGenerales.cambioSistP = (vista.tfDenomSistP.startValue != vista.tfDenomSistP.getValue()) ? 1 : 0;
            variablesGenerales.cambioSistP = (vista.dfFInicioSistP.startValue != vista.dfFInicioSistP.getValue()) ? 1 : 0;
            variablesGenerales.cambioSistP = (vista.dfFFinSistP.startValue != vista.dfFFinSistP.getValue()) ? 1 : 0;
            variablesGenerales.cambioSistP = (vista.tfDescripSistP.startValue != vista.tfDescripSistP.getValue()) ? 1 : 0;
        }

        /*
         *Función para eliminar una forma de pago.
         */
        function eliminarFormaPago() {
            //Mostrando el mensaje para aceptar el eliminar.
            mostrarMensaje(2, idioma.lbTitleEliminarFormP, function (btn) {
                if (btn == "ok") {
                    //Se muestra la máscara de espera.
                    PVD.mostrarMascara('idmaskeleminarformp', idioma.lbMsgEsperaEnviarDatos, idioma.lbMsgEliminarFormP);
                    //Enviando los datos al servidor.
                    Ext.Ajax.request({
                        url: '/pvd/nomina/index.php/nomformasistemapago/eliminarFormaPago',
                        method: 'POST',
                        params: {idformapago: vista.smFormaPago.getSelected().get('idformapago')},
                        callback: function (options, success, response) {
                            //Se oculta la máscara de espera.
                            PVD.ocultarMascara('idmaskeleminarformp');
                            responseData = Ext.decode(response.responseText);
                            if (responseData.codigo == 1) {
                                //Mostrando el mensaje de que se ha la forma de pago.
                                mostrarMensaje(1, idioma.lbMsgCorrectoEliminadoFormP);
                                //Recargando el grid de formas de pago.
                                modelo.storeFormaPago.load({params: {limit: 1000, start: 0}});

                            } else {
                                if (responseData.codigo)
                                    mostrarMensaje(responseData.codigo, idioma.lbMsgErrorFormaPagoUso);
                            }
                        }
                    });
                }
            });
        }

        /*
         *Función para eliminar un sistema de pago.
         */
        function eliminarSistemaPago() {
            //Mostrando el mensaje para aceptar el eliminar.
            mostrarMensaje(2, idioma.lbTitleEliminarSistP, function (btn) {
                if (btn == "ok") {
                    //Se muestra la máscara de espera.
                    PVD.mostrarMascara('idmaskeleminarsistp', idioma.lbMsgEsperaEnviarDatos, idioma.lbMsgEliminarSistP);
                    //Enviando los datos al servidor.
                    Ext.Ajax.request({
                        url: '/pvd/nomina/index.php/nomformasistemapago/eliminarSistemaPago',
                        method: 'POST',
                        params: {idsistemapago: vista.smSistemaPago.getSelected().get('idsistemapago')},
                        callback: function (options, success, response) {
                            //Se oculta la máscara de espera.
                            PVD.ocultarMascara('idmaskeleminarsistp');
                            responseData = Ext.decode(response.responseText);
                            if (responseData.codigo == 1) {
                                //Mostrando el mensaje de que se ha el sistema de pago.
                                mostrarMensaje(1, idioma.lbMsgCorrectoEliminadoSistP);
                                //Recargando el grid de sistemas de pago.
                                modelo.storeSistemaPago.load({params: {limit: 20, start: 0}});

                            } else {
                                if (responseData.codigo)
                                    mostrarMensaje(responseData.codigo, idioma.lbMsgErrorSistemaPagoUso);
                            }
                        }
                    });
                }
            });
        }

        /**
         *Teclas calientes de la interfaz.
         */
        this.keyMap = new Ext.KeyMap(Ext.getDoc(), [
            {
                key: 'imh',
                alt: true,
                stopEvent: true,
                handler: function (k, e) {
                    switch (k) {
                        case 73: { //i para adicionar.
                            if (!vista.btnAdicionarFormP.disabled && !vista.ventanaFormP.isVisible()) {
                                mostrarVentanaAdicionarFormP();
                            }
                            break;
                        }
                        case 77: { //m para modificar .
                            if (!vista.btnModificarFormP.disabled && !vista.ventanaFormP.isVisible()) {
                                mostrarVentanaModificarFormP();
                            }
                            break;
                        }
                        case 72: { //h para ayuda.
                            if (!vista.ventanaFormP.isVisible()) {
                                vista.btnAyudaSistP.focus();
                                vista.btnAyudaSistP.fireEvent('click');
                            }
                            break;
                        }
                    }
                }
            },
            {
                key: 46,//del para eliminar.
                fn: function () {
                    if (!vista.btnEliminarFormP.disabled && !vista.ventanaFormP.isVisible()) {
                        eliminarFormaPago();
                    }
                },
            },
            {
                key: 13,//enter para aceptar.
                fn: function () {
                    if (vista.btnAceptarFormP.isVisible()) {
                        vista.btnAceptarFormP.focus();
                        vista.btnAceptarFormP.fireEvent('click');
                    }
                },
            }
        ]);
    }
};

variablesGlobales.nomformasistemapago_js = 1;
