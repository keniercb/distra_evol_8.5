Ext.ns('Pvd.Nomina.Nomencladores.NomTipoRetencion');

Pvd.Nomina.Nomencladores.NomTipoRetencion.Panel = Ext.extend(Ext.Panel, {
    layout: 'fit',
    region: 'center',
    heigth: '100%',
    width: '100%',
    border: false,
    frame: false,
    hideBorders: true,
    perfil: this.perfil,
    idioma: this.idioma,
    mostrar: 1,
    initComponent: function () {

        //Inicializando el modelo.
        this.modelo = new Pvd_Nomina_Nomencladores_NomTipoRetencion_Modelo();
        this.modelo.init();

        //Inicializando la vista.
        this.vista = new Pvd_Nomina_Nomencladores_NomTipoRetencion_Vista();
        this.vista.init(this.perfil, this.idioma, this.modelo);

        //Inicializar controlador.
        this.controlador = new Pvd_Nomina_Nomencladores_NomTipoRetencion_Controlador();
        this.controlador.init(this.idioma, this.vista, this.modelo);

        this.items = [this.vista.panelCentralTRetencion];

        //Teclas calientes de la interfaz
        this.keyMap = this.controlador.keyMap;

        Pvd.Nomina.Nomencladores.NomTipoRetencion.Panel.superclass.initComponent.call(this);
    },
    listeners: {
        afterlayout: function (x) {
            if (this.mostrar == 1) {
                this.modelo.storeTRetencion.load({params: {limit: 20, start: 0}});
                this.mostrar = 2;
            }
        },
        destroy: function (x) {
            this.keyMap.disable();
        },
    },
});

//Modelo de la vista del Nomenclador de tipos de retenciones.
var Pvd_Nomina_Nomencladores_NomTipoRetencion_Modelo = function () {
    /**
     * Inicializar el modelo de la vista.
     */
    this.init = function () {

        //Store del listado de tipos de retenciones.
        this.storeTRetencion = new Ext.data.Store({
            url: '/pvd/nomina/index.php/nomtiporetencion/obtenerListadoTiposRetencion',
            reader: new Ext.data.JsonReader(
                {totalProperty: "cantidad", autoLoad: true, root: "datos", id: "idtiporetencion"},
                [
                    {name: 'idtiporetencion'}
                    ,
                    {name: 'abreviatura'}
                    ,
                    {name: 'denominacion'}
                    ,
                    {name: 'saldolimite'}
                    ,
                    {name: 'fechainicio'}
                    ,
                    {name: 'fechafin'}
                    ,
                    {name: 'descripcion'}
                    ,
                    {name: 'orden'}
                    ,
                    {name: 'cuentacontable'}
                    ,
                    {name: 'denom'}
                    ,
                    {name: 'tienelimitemaximo'}
                    ,
                    {name: 'cobrosypagos'}
                ])
        });

        this.storeSaldoLimite = new Ext.data.SimpleStore({
            fields: [
                {name: 'saldolimite'}
                ,
                {name: 'denominacion'}
            ],
            data: [
                [1, 'Si'],
                [2, 'No']
            ]
        });

        this.storeTieneLimitemaximo = new Ext.data.SimpleStore({
            fields: [
                {name: 'tienelimitemaximo'}
                ,
                {name: 'denominacionLimite'}
            ],
            data: [
                [1, 'Si'],
                [2, 'No']
            ]
        });

        this.storeTCobrosYPagos = new Ext.data.SimpleStore({
            fields: [
                {name: 'cobrosypagos'}
                ,
                {name: 'denominacion'}
            ],
            data: [
                [1, 'Cuenta por cobrar'],
                [0, 'Cuenta por pagar']
            ]
        });

        this.stcuenta = new Ext.data.Store({
            url: '/configuracion/modeloscontabilizacion/gestmodelos/index.php/gestionarmodelos/cargarCuentas',
            baseParams: {
                tipocta: 2,
                idsubsistema: 71
            },
            reader: new Ext.data.JsonReader({
                root: 'datos'
            }, [
                {name: 'cuentacontable', mapping: 'id'},
                {name: 'denom', mapping: 'text'}
            ])
        });
    }
};

//Vista del componente Nomenclador de tipos de retenciones.
var Pvd_Nomina_Nomencladores_NomTipoRetencion_Vista = function () {
    /**
     * Inicializar la vista.
     *
     * @param perfil Objeto que contiene el perfil de la IU (Tipo: Object).
     * @param idioma Objeto que contiene el idioma de los textos de la IU (Tipo: Object).
     * @param modelo Modelo de la vista del componente Nomenclador de tipos de retenciones (Tipo: Pvd_Nomina_Nomencladores_NomTipoRetencion_Modelo).
     */
    this.init = function (perfil, idioma, modelo) {

        var self = this;

        //Listado de tipos de retenciones.
        function centrarValor(val) {
            if (val)
                return "<center>" + val + "</center>";
        }

        this.expanderTRetencion = new Ext.grid.RowExpander({
            tpl: new Ext.Template(
                '<div style="word-wrap:break-word;white-space:normal;"><p>&nbsp;&nbsp;Descripci&oacute;n:&nbsp;{descripcion}</p><br/></div>'
            ), enableCaching: false
        });

        this.smTRetencion = new Ext.grid.RowSelectionModel({
            singleSelect: true,
        });

        function formatearSaldoLimite(val) {
            if (val == 1)
                return "<center>Si</center>";
            else
                return "<center>No</center>";
        }

        function formatearCobrosPagos(val) {
            if (val == 1)
                return "<center>Cuentas por cobrar</center>";
            else
                return "<center>Cuentas por pagar</center>";
        }

        this.gpTRetencion = new Ext.grid.GridPanel({
            id: 'idgpTRetencion',
            title: idioma.lbTitleTRetencion,
            region: 'center',
            columns: [
                {header: 'idtiporetencion', hidden: true, hideable: false, dataIndex: 'idtiporetencion'}
                ,
                {header: '   ', hidden: true, hideable: false, dataIndex: 'cuentacontable'}
                ,
                this.expanderTRetencion
                ,
                {
                    header: '<center>' + idioma.lbColAbreviatura + '</center>',
                    width: 70,
                    sortable: true,
                    dataIndex: 'abreviatura',
                    renderer: centrarValor
                }
                ,
                {header: idioma.lbColDenominacion, width: 500, sortable: true, dataIndex: 'denominacion'}
                ,
                {
                    header: '<center>' + idioma.lbColSaldoLimite + '</center>',
                    width: 80,
                    sortable: true,
                    dataIndex: 'saldolimite',
                    renderer: formatearSaldoLimite
                }
                ,
                {
                    header: '<center>' + 'L&iacute;mite m&aacute;ximo' + '</center>',
                    width: 80,
                    sortable: true,
                    dataIndex: 'tienelimitemaximo',
                    renderer: formatearSaldoLimite
                }
                ,
                {
                    header: '<center>' + 'Cobros y pagos' + '</center>',
                    width: 140,
                    sortable: true,
                    dataIndex: 'cobrosypagos',
                    renderer: formatearCobrosPagos
                }
                ,
                {header: '<center>' + 'Orden' + '</center>', width: 80, sortable: true, dataIndex: 'orden'}
                ,
                {
                    header: '<center>' + idioma.lbColCuentaContable + '</center>',
                    width: 300,
                    sortable: true,
                    dataIndex: 'denom'
                }
                ,
                {
                    header: '<center>' + idioma.lbColDesde + '</center>',
                    width: 90,
                    sortable: true,
                    dataIndex: 'fechainicio',
                    renderer: centrarValor
                }
                ,
                {
                    header: '<center>' + idioma.lbColHasta + '</center>',
                    width: 90,
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
            store: modelo.storeTRetencion,
            sm: this.smTRetencion,
            plugins: this.expanderTRetencion,
            loadMask: {msg: idioma.lbMaskGridCargando},
            bbar: new Ext.PagingToolbar({
                pageSize: 1000,
                store: modelo.storeTRetencion,
                displayInfo: true,
                displayMsg: 'Mostrando  {0} - {1} de {2}',
                emptyMsg: "0 Resultado a mostrar"
            }),
        });

        //Botones de Add, Mod, Elim, Ayud de tipos de retenciones.
        this.btnAdicionarTRetencion = new Ext.Button({
            id: 'btnAddTRetencion',
            text: idioma.lbBtnAdicionar,
            tooltip: idioma.textToolTipAddTRetencion,
            // icon: perfil.dirImg+'adicionar.png',
            iconCls: 'adicionar',
            prevTab: 'btnAyudaTRetencion',
            nextTab: 'btnModTRetencion',
        });

        this.btnModificarTRetencion = new Ext.Button({
            id: 'btnModTRetencion',
            text: idioma.lbBtnModificar,
            tooltip: idioma.textToolTipModTRetencion,
            //  icon: perfil.dirImg+'modificar.png',
            iconCls: 'modificar',
            prevTab: 'btnAddTRetencion',
            nextTab: 'btnElimTRetencion',
        });

        this.btnEliminarTRetencion = new Ext.Button({
            id: 'btnElimTRetencion',
            text: idioma.lbBtnEliminar,
            tooltip: idioma.textToolTipElimTRetencion,
            // icon: perfil.dirImg+'eliminar.png',
            iconCls: 'eliminar',
            prevTab: 'btnModTRetencion',
            nextTab: 'btnAyudaTRetencion',
        });

        this.btnExportarTRetencion = new Ext.Button({
            id: 'btnExportarTRetencion',
            text: 'Exportar',
            tooltip: 'Exportar',
            iconCls: 'exportar'
        });

        this.btnAyudaTRetencion = new Ext.Button({
            id: 'btnAyudaTRetencion',
            text: idioma.lbBtnAyuda,
            tooltip: idioma.textToolTipAyudaTRetencion,
            //icon:perfil.dirImg+'ayuda.png',
            iconCls: 'ayuda',
            prevTab: 'btnElimTRetencion',
            nextTab: 'btnAddTRetencion',
        });

        //Panel contenedor del grid de tipos de retenciones. 
        this.panelCentralTRetencion = new Ext.Panel({
            id: 'panelCentralTRetencion',
            region: 'center',
            heigth: '100%',
            width: '100%',
            border: false,
            layout: 'fit',
            tbar: [this.btnAdicionarTRetencion, this.btnModificarTRetencion, this.btnEliminarTRetencion, this.btnExportarTRetencion, '->', this.btnAyudaTRetencion],
            items: [this.gpTRetencion],
        });

        //Campo del formulario de tipos de retenciones.
        this.tfAbrevTRetencion = new Ext.form.TextField({
            id: 'idtfAbrevTRetencion', fieldLabel: idioma.lbColAbreviatura,
            tabIndex: 1, name: 'abreviatura', allowBlank: false,
            anchor: '90%', prevTab: 'idbtnAceptarTRetencion',
            nextTab: 'idtfDenomTRetencion',
            regex: /^([a-zA-ZÁÉÍÓÚáéíóúñüÑ\d]+(\d*)?)+$/,
            regexText: idioma.lbAbrevIncorr, //maskRe
            blankText: idioma.lbErrorCampoVacio,
            maxLength: 10,
            maxLengthText: idioma.lbMaxText_10,
        });

        this.tfDenomTRetencion = new Ext.form.TextField({
            id: 'idtfDenomTRetencion', fieldLabel: idioma.lbColDenominacion,
            tabIndex: 2, name: 'denominacion', allowBlank: false, anchor: '95%',
//                                        regex:/^([a-zA-ZÁÉÍÓÚáéíóúñüÑ\d ]+(\d*)?)+$/,
            vtype: 'vtdenominaciones',
            regexText: idioma.lbDenomIncorr, //maskRe
            blankText: idioma.lbErrorCampoVacio,
            maxLength: 100,
            maxLengthText: idioma.lbMaxText_100,
        });

        this.cbSaldoLimite = new Ext.form.ComboBox({
            id: 'idcbSaldoLimite', fieldLabel: idioma.lbColSaldoLimite,
            tabIndex: 3, valueField: 'saldolimite',
            displayField: 'denominacion', hiddenName: 'saldolimite',
            allowBlank: false, mode: 'local',
            store: modelo.storeSaldoLimite, emptyText: 'Seleccione...',
            blankText: idioma.lbErrorCampoVacio, readOnly: true,
            triggerAction: 'all', anchor: '99%'
        });

        this.dfFInicioTRetencion = new Ext.form.DateField({
            id: 'dfFInicioTRetencion', fieldLabel: idioma.lbColDesde,
            tabIndex: 4, name: 'fechainicio', allowBlank: false,
            format: 'd/m/Y', editable: true, readOnly: false,
            value: new Date().format('d/m/Y'), maxText: idioma.lbFechaMaxima,
            minText: idioma.lbFechaMinima, blankText: idioma.lbErrorCampoVacio,
            invalidText: idioma.invalidTextFecha, vtype: 'daterange',
            anchor: '90%', endDateField: 'dfFFinTRetencion'
        });

        this.dfFFinTRetencion = new Ext.form.DateField({
            id: 'dfFFinTRetencion', fieldLabel: idioma.lbColHasta,
            tabIndex: 5, name: 'fechafin', xtype: 'datefield', allowBlank: true,
            format: 'd/m/Y', editable: true, readOnly: false,
            maxText: idioma.lbFechaMaxima, minText: idioma.lbFechaMinima,
            blankText: idioma.lbErrorCampoVacio, invalidText: idioma.invalidTextFecha,
            vtype: 'daterange', anchor: '99%', startDateField: 'dfFInicioTRetencion'
        });

        this.tfDescripTRetencion = new Ext.form.TextArea({
            id: 'idtfDescripTRetencion',
            fieldLabel: idioma.lbColDescripcion, tabIndex: 6,
            name: 'descripcion', allowBlank: true,
            hiddenname: 'descripcion',
            maxLength: 255, //regex, regexText, maskRe
            maxLengthText: idioma.lbMaxText_255,
            anchor: '99%', prevTab: 'dfFFinTRetencion', nextTab: 'idbtnCancelarTRetencion',
            blankText: idioma.lbErrorCampoVacio,
        });

        this.tforden = new Ext.form.TextField({
            id: 'idtforden', fieldLabel: 'Orden',
            tabIndex: 1, name: 'orden', allowBlank: false,
            anchor: '90%', prevTab: 'idbtnAceptarTRetencion',
            nextTab: 'idtfDenomTRetencion',
            // regex:/^([a-zA-ZÁÉÍÓÚáéíóúñüÑ\d]+(\d*)?)+$/,
            //regexText:idioma.lbAbrevIncorr, //maskRe
            blankText: idioma.lbErrorCampoVacio,
            maxLength: 3,
            maxLengthText: idioma.lbMaxText_10
        });

        this.cbTienelimitemaximo = new Ext.form.ComboBox({
            id: 'idcbTienelimitemaximo', fieldLabel: 'Tiene límite máximo',
            tabIndex: 3, valueField: 'tienelimitemaximo',
            displayField: 'denominacionLimite', hiddenName: 'tienelimitemaximo',
            allowBlank: false, mode: 'local',
            store: modelo.storeTieneLimitemaximo, emptyText: 'Seleccione',
            blankText: idioma.lbErrorCampoVacio,
            readOnly: true,
            triggerAction: 'all', anchor: '99%'
        });

        this.cbCobrosPagos = new Ext.form.ComboBox({
            id: 'cbCobrosPagos', fieldLabel: 'Cobros y pagos',
            tabIndex: 3, valueField: 'cobrosypagos',
            displayField: 'denominacion', hiddenName: 'cobrosypagos',
            allowBlank: false, mode: 'local',
            store: modelo.storeTCobrosYPagos, emptyText: 'Seleccione',
            blankText: idioma.lbErrorCampoVacio,
            readOnly: true,
            triggerAction: 'all', anchor: '99%'
        });

        this.cbxcuenta = new Ext.contabilidad.util.linkedCombo({
            store: modelo.stcuenta,
            fieldLabel: 'Cuenta contable',
            displayField: 'denom',
            valueField: 'cuentacontable',
            name: 'denom',
            maskRe: /^[0-9a-zA-Z\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s\.\-\,\(\)]+$/,
            regex: /^[0-9a-zA-Z\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s\.\-\,\(\)]+$/,
            maxLength: 255,
            // disabled: true,
            listHeight: 200,
            tipocta: '',
            id: 'lnkcuenta',
            lazyRender: true,
            allowBlank: true,
            // buttons: [this.btnAddCampo],
            fnCreateNew: Ext.emptyFn
        });

        this.cuentacontable = new Ext.form.Hidden({
            id: 'cuentacontable',
            name: 'cuentacontable',
            allowBlank: false,
            hidden: true
        });
        //Formulario de tipos de retenciones.
        this.formularioTRetencion = new Ext.FormPanel({
            id: 'idformularioTRetencion',
            labelAlign: 'top',
            frame: true,
            width: 700,
            autoHeight: true,
            bodyStyle: {
                padding: '10px 10px 10px 10px',
            },
            items: [
                {
                    layout: 'column',
                    items: [
                        {columnWidth: .23, layout: 'form', items: [this.tfAbrevTRetencion]},
                        {columnWidth: .77, layout: 'form', items: [this.tfDenomTRetencion]},

                    ]
                },
                {
                    layout: 'column',
                    items: [
                        {columnWidth: .25, layout: 'form', items: [this.cbSaldoLimite]},
                        {columnWidth: .25, layout: 'form', items: [this.cbTienelimitemaximo]},
                        {columnWidth: .25, layout: 'form', items: [this.cbCobrosPagos]},
                        {columnWidth: .25, layout: 'form', items: [this.tforden]}
                    ]
                },
                {
                    layout: 'column',
                    items: [
                        {columnWidth: .54, layout: 'form', items: [this.dfFInicioTRetencion]},
                        {columnWidth: .46, layout: 'form', items: [this.dfFFinTRetencion]}
                    ]
                },
                this.cuentacontable,
                this.cbxcuenta,
                this.tfDescripTRetencion
            ],
        });


        //Botones de la ventana de adicionar tipos de retenciones.
        this.btnCancelarTRetencion = new Ext.Button({
            id: 'idbtnCancelarTRetencion',
            iconCls: 'cancelar',
            // icon:perfil.dirImg+'cancelar.png',
            text: idioma.lbBtnCancelar,
            tooltip: idioma.textToolTipCancelar,
            prevTab: 'idtfDescripTRetencion',
            nextTab: 'idbtnAplicarTRetencion',
        });

        this.btnAplicarTRetencion = new Ext.Button({
            id: 'idbtnAplicarTRetencion',
            iconCls: 'aplicar',
            // icon:perfil.dirImg+'aplicar.png',
            text: idioma.lbBtnAplicar,
            tooltip: idioma.textToolTipAplicar,
            prevTab: 'idbtnCancelarTRetencion',
            nextTab: 'idbtnAceptarTRetencion',
        });

        this.btnAceptarTRetencion = new Ext.Button({
            id: 'idbtnAceptarTRetencion',
            iconCls: 'aceptar',
            // icon:perfil.dirImg+'aceptar.png',
            text: idioma.lbBtnAceptar,
            tooltip: idioma.textToolTipAceptar,
            prevTab: 'idbtnAplicarTRetencion',
            nextTab: 'idtfAbrevTRetencion',
        });

        //Ventana de adicionar y modificar tipos de retenciones.
        this.ventanaTRetencion = new Ext.Window({
            modal: true,
            width: 600,
            closeAction: 'hide',
            autoHeight: true,
            closable: true,
            resizable: false,
            layout: 'fit',
            constrain: true,
            autoValidate: true,
            validateDefault: true,
            items: [this.formularioTRetencion],
            buttons: [this.btnCancelarTRetencion, this.btnAplicarTRetencion, this.btnAceptarTRetencion],
            keys: [
                {
                    key: Ext.EventObject.ENTER,
                    stopEvent: true,
                    fn: function () {
                        if (!self.btnAceptarTRetencion.disabled) {
                            self.btnAceptarTRetencion.handler();
                        }
                    }
                },
                {
                    key: 'x',
                    alt: true,
                    stopEvent: true,
                    fn: function () {
                        if (!self.btnCancelarTRetencion.disabled) {
                            self.btnCancelarTRetencion.handler();
                        }
                    }
                },
                {
                    key: 'p',
                    alt: true,
                    stopEvent: true,
                    fn: function () {
                        if (!self.btnAplicarTRetencion.disabled) {
                            self.btnAplicarTRetencion.handler();
                        }
                    }
                }
            ]
        });
    }
};

//Controlador de la vista del Nomenclador de tipos de retenciones.
var Pvd_Nomina_Nomencladores_NomTipoRetencion_Controlador = function () {
    /**
     * Inicializar el controlador de la vista.
     *
     * @param idioma Objeto que contiene el idioma de los textos de la IU (Tipo: Object).
     * @param vista Vista del componente Nomenclador de tipos de retenciones (Tipo: Pvd_Nomina_Nomencladores_NomTipoRetencion_Vista)
     * @param modelo Modelo de la vista del componente Nomenclador de tipos de retenciones (Tipo: Pvd_Nomina_Nomencladores_NomTipoRetencion_Modelo)
     */
    this.init = function (idioma, vista, modelo) {

        var _vista = vista;

        /**
         *Variables generales
         */
        var variablesTRetencion = {
            accion: 'Add',
            cambio: 0,
        };

        //Eventos del grid de tipos de retenciones.
        vista.gpTRetencion.on('rowdblclick', function (e) {
            mostrarVentanaModificarTRetencion();
        });

        vista.gpTRetencion.on('destroy', function (e) {
            vista.ventanaTRetencion.destroy();
        });

        //Eventos del store de tipos de retenciones.
        modelo.storeTRetencion.on('beforeload', function (store) {
            vista.btnModificarTRetencion.disable();
            vista.btnEliminarTRetencion.disable();
            store.removeAll();
        });

        modelo.storeTRetencion.on('load', function (store, records, opt) {
            if (!records.length) {
                mostrarMensaje(1, idioma.lbMsgNoExistenDatos);
            }
        });

        //Eventos del seleccion model del grid.
        vista.smTRetencion.on('rowselect', function () {
            vista.btnModificarTRetencion.enable();
            vista.btnEliminarTRetencion.enable();
        });

        //Eventos de campo de abreviatura. 
        vista.tfAbrevTRetencion.on('change', function (tf, n, o) {
            variablesTRetencion.cambio = 1;
        });

        //Eventos de campo de denominacion. 
        vista.tfDenomTRetencion.on('change', function (tf, n, o) {
            variablesTRetencion.cambio = 1;
        });

        //Eventos de campo de saldo limite.
        vista.cbSaldoLimite.on('change', function (tf, n, o) {
            variablesTRetencion.cambio = 1;
        });

        //Eventos de campo de fecha inicio. 
        vista.dfFInicioTRetencion.on('change', function (tf, n, o) {
            variablesTRetencion.cambio = 1;
        });

        //Eventos de campo de fecha fin. 
        vista.dfFFinTRetencion.on('change', function (tf, n, o) {
            variablesTRetencion.cambio = 1;
        });

        //Eventos de campo de descripcion. 
        vista.tfDescripTRetencion.on('change', function (tf, n, o) {
            variablesTRetencion.cambio = 1;
        });

        //Eventos de campo de descripcion.
        vista.tforden.on('change', function (tf, n, o) {
            variablesTRetencion.cambio = 1;
        });

        //Eventos de campo de descripcion.
        vista.cbTienelimitemaximo.on('change', function (tf, n, o) {
            variablesTRetencion.cambio = 1;
        });

        //Eventos de campo de descripcion.
        vista.cbCobrosPagos.on('change', function (tf, n, o) {
            variablesTRetencion.cambio = 1;
        });


        //Eventos del botón adicionar.
        vista.btnAdicionarTRetencion.setHandler(function () {
            mostrarVentanaAdicionarTRetencion();
        });

        //Eventos del botón modificar.
        vista.btnModificarTRetencion.setHandler(function () {
            mostrarVentanaModificarTRetencion();
        });

        //Eventos del botón eliminar.
        vista.btnEliminarTRetencion.setHandler(function () {
            eliminarTRetencion();
        });

        //Exportar
        vista.btnExportarTRetencion.on('click', function () {
            var winload = new Ext.PVD.comun.window.winLoad({
                title: 'Por favor espere...',
                mensaje: 'Generando reporte'
            });
            winload.showMask();
            var iframe = document.createElement("iframe");
            iframe.src = document.location.protocol + '//' + document.location.host +
                '/pvd/nomina/index.php/nomtiporetencion/exportarNomenclador';
            iframe.style.display = 'none';
            var that = this;
            iframe.onload = function () {
                winload.hideMask();
                //that.destroy();
            };
            document.body.appendChild(iframe);
        });

        //Eventos del botón cancelar.
        vista.btnCancelarTRetencion.setHandler(function () {
            vista.ventanaTRetencion.hide();
//            vista.formularioTRetencion.purgeListeners();
        });

        //Eventos del botón aplicar.
        vista.btnAplicarTRetencion.setHandler(function () {
            salvarFormularioTRetencion(true);
        });

        //Eventos del botón aceptar.
        vista.btnAceptarTRetencion.setHandler(function () {
            salvarFormularioTRetencion(false);
//            vista.formularioTRetencion.purgeListeners();
        });

        //Evento de la ventana de adicionar/modificar 
        vista.ventanaTRetencion.on('beforeshow', function (ventana) {
            vista.formularioTRetencion.getForm().reset();
            vista.tfAbrevTRetencion.focus(true, 500);
        });

        vista.cbxcuenta.on(
            {
                scope: this,

                select: function (combo, record, rowIndex) {
                    // var recordCmb = vista.cmbtipocta.store.getAt(vista.cmbtipocta.store.find('tipocuenta', vista.cmbtipocta.getValue()));
                    vista.cbxcuenta.tipocta = 2;
                    vista.cuentacontable.setValue(record.data.idcuenta);
                },
                expand: function () {
                    /*var recordGrid = this.gridAsiento.getStore().getAt(this.gridAsiento.rowEditing);*/
                    //   modelo.stcuenta.load({ baseParams: { tipocta: 2,  idsubsistema:71 }});
                    var tree = vista.cbxcuenta.tree;
                    if (Ext.isEmpty(vista.cbxcuenta.getValue())) {
                        tree.getSelectionModel().clearSelections();
                    } else {
                        tree.getSelectionModel().select(tree.getNodeById(vista.cbxcuenta.getValue()));
                    }
                }
            }
        );

        vista.cbxcuenta.on('change', function (tf, n, o) {
            variables.cambio = 1;
        });

        vista.cbxcuenta.tree.getLoader().on(
            {
                beforeload: function () {
                    //Antes de realizar cualquier peticion se verifica si
                    //actulamente el treeLoader está realizando una petición,
                    //y casi simultaneamente se realizó otra, en ese caso
                    //se aborta la petición anterior y se continua con la última
                    //realizada.
                    //  modelo.stcuenta.load({Params: { tipocta: 2,  idsubsistema:71 }});
                    if (this.isLoading()) {
                        Ext.Ajax.abort(this.transId);
                    }
                }
            }
        );

        /*
         *Función de mostrar la ventana de adicionar.
         */
        function mostrarVentanaAdicionarTRetencion() {
            vista.ventanaTRetencion.setTitle(idioma.lbTitleVentAdicionarTRetencion);
            vista.btnAplicarTRetencion.show();
            vista.ventanaTRetencion.show();
            //Actualizar la tabulación deL formulario.
            vista.btnCancelarTRetencion.setNextElement('idbtnAplicarTRetencion');
            vista.btnAceptarTRetencion.setPreviousElement('idbtnAplicarTRetencion');
            variablesTRetencion.accion = 'Add';
        }

        /*
         *Función de mostrar la ventana de modificar.
         */
        function mostrarVentanaModificarTRetencion() {
            vista.ventanaTRetencion.setTitle(idioma.lbTitleVentModificarTRetencion);
            vista.btnAplicarTRetencion.hide();
            vista.ventanaTRetencion.show();
            //Actualizar la tabulación deL formulario.
            vista.btnCancelarTRetencion.setNextElement('idbtnAceptarTRetencion');
            vista.btnAceptarTRetencion.setPreviousElement('idbtnCancelarTRetencion');
            //vista.cbxcuenta.setValue(vista.smTRetencion.getSelected().get('denom'));
            vista.formularioTRetencion.getForm().loadRecord(vista.smTRetencion.getSelected());
//            vista.formularioTRetencion.addListener('clientvalidation', function (_form, _valid) {
//                if (comparar(vista.formularioTRetencion.getForm().getValues(), vista.smTRetencion.getSelected().data)) {
//                    vista.btnAceptarTRetencion.setDisabled(true);
//                } else {
//                    vista.btnAceptarTRetencion.enable();
//                }
//            });
            variablesTRetencion.accion = 'Mod';
        }

        /*
         *Función para adicionar/modificar un tipo de retención.
         */
        function salvarFormularioTRetencion(boton) {

            var urlAction = '/pvd/nomina/index.php/nomtiporetencion/adicionarTipoRetencion';
            var idtiporetencion = 0;
            var lbMsgEspera = idioma.lbMsgAdicionarTRetencion;
            var lbMsgExito = idioma.lbMsgCorrectoAdicionadoTRetencion;

            if (variablesTRetencion.accion == 'Mod') {
                lbMsgEspera = idioma.lbMsgModificarTRetencion;
                lbMsgExito = idioma.lbMsgCorrectoModificadoTRetencion;
                urlAction = '/pvd/nomina/index.php/nomtiporetencion/modificarTipoRetencion';
                idtiporetencion = vista.smTRetencion.getSelected().get('idtiporetencion');
            }
            if (variablesTRetencion.cambio == 0) {
                if (variablesTRetencion.accion == 'Mod') {
                    //Se oculta la ventana si no ha sido modificado ningún valor.
                    vista.ventanaTRetencion.hide();
                } else {
                    //Se marcan como obligatorios en caso de presionar aceptar y se encuentren vacíos.
                    vista.tfAbrevTRetencion.markInvalid(idioma.lbErrorCampoVacio);
                    vista.tfDenomTRetencion.markInvalid(idioma.lbErrorCampoVacio);
                    vista.cbSaldoLimite.markInvalid(idioma.lbErrorCampoVacio);
                    vista.tforden.markInvalid(idioma.lbErrorCampoVacio);
                    vista.cbTienelimitemaximo.markInvalid(idioma.lbErrorCampoVacio);
                    vista.cbCobrosPagos.markInvalid(idioma.lbErrorCampoVacio);
                    mostrarMensaje(3, idioma.lbErrorFormulario);
                }
            } else {
                //Se verifica si el formulario es válido y si el campo sueldo contiene un valor
                if (vista.formularioTRetencion.getForm().isValid()) {
                    //Se muestra la máscara de espera.
                    PVD.mostrarMascara('idmaskaddmodtiporetencion', idioma.lbMsgEsperaEnviarDatos, lbMsgEspera);

                    //Enviando datos al servidor.
                    Ext.Ajax.request({
                        url: urlAction,
                        method: 'POST',
                        params: {
                            idtiporetencion: idtiporetencion,
                            abreviatura: vista.tfAbrevTRetencion.getValue(),
                            denominacion: vista.tfDenomTRetencion.getValue(),
                            fechainicio: vista.dfFInicioTRetencion.getRawValue(),
                            fechafin: vista.dfFFinTRetencion.getRawValue(),
                            descripcion: vista.tfDescripTRetencion.getValue(),
                            saldolimite: vista.cbSaldoLimite.getValue(),
                            cuentacontable: vista.cuentacontable.getValue(),
                            orden: vista.tforden.getValue(),
                            tienelimitemaximo: vista.cbTienelimitemaximo.getValue(),
                            cobrosypagos: vista.cbCobrosPagos.getValue()
                        },
                        callback: function (options, success, response) {
                            responseData = Ext.decode(response.responseText);

                            //Ocultando máscara de enviar datos.
                            PVD.ocultarMascara('idmaskaddmodtiporetencion');

                            if (responseData.codigo == 1) {
                                mostrarMensaje(1, lbMsgExito);
                                if (!boton) {
                                    vista.ventanaTRetencion.hide();

                                } else {
                                    vista.tfAbrevTRetencion.focus(true, 500);
                                }
                                vista.formularioTRetencion.getForm().reset();
                                modelo.storeTRetencion.removeAll();
                                modelo.storeTRetencion.load({params: {limit: 20, start: 0}});
                                variablesTRetencion.cambio = 0;


                            } else {
                                if (responseData.codigo)
                                    mostrarMensaje(3, responseData.mensaje);
                            }
                        }
                    });
                } else {
                    mostrarMensaje(3, idioma.lbErrorFormulario);
                }
            }
        }

        /*
         *Función para eliminar un tipo de retención.
         */
        function eliminarTRetencion() {
            //Mostrando el mensaje para aceptar el eliminar un tipo de retención.
            mostrarMensaje(2, idioma.lbTitleEliminarTRetencion, function (btn) {
                if (btn == "ok") {
                    //Se muestra la máscara de espera.
                    PVD.mostrarMascara('idmaskeleminartiporetencion', idioma.lbMsgEsperaEnviarDatos, idioma.lbMsgEliminarTRetencion);
                    //Enviando los datos al servidor.
                    Ext.Ajax.request({
                        url: '/pvd/nomina/index.php/nomtiporetencion/eliminarTipoRetencion',
                        method: 'POST',
                        params: {idtiporetencion: vista.smTRetencion.getSelected().get('idtiporetencion')},
                        callback: function (options, success, response) {
                            //Se oculta la máscara de espera.
                            PVD.ocultarMascara('idmaskeleminartiporetencion');
                            responseData = Ext.decode(response.responseText);
                            if (responseData.codigo == 1) {
                                //Mostrando el mensaje de que se ha eliminado el tipo de retención.
                                mostrarMensaje(1, idioma.lbMsgCorrectoEliminadoTRetencion);
                                //Recargando el grid de tipos de retenciones.
                                modelo.storeTRetencion.load({params: {limit: 20, start: 0}});

                            } else {
                                if (responseData.codigo)
                                    mostrarMensaje(responseData.codigo, idioma.lbMsgErrorTipoRetencionUso);
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
                            if (!vista.btnAdicionarTRetencion.disabled && !vista.ventanaTRetencion.isVisible()) {
                                mostrarVentanaAdicionarTRetencion();
                            }
                            break;
                        }
                        case 77: { //m para modificar .
                            if (!vista.btnModificarTRetencion.disabled && !vista.ventanaTRetencion.isVisible()) {
                                mostrarVentanaModificarTRetencion();
                            }
                            break;
                        }
                        case 72: { //h para ayuda.
                            if (!vista.ventanaTRetencion.isVisible()) {
                                vista.btnAyudaTRetencion.focus();
                                vista.btnAyudaTRetencion.fireEvent('click');
                            }
                            break;
                        }
                    }
                }
            },
            {
                key: 46,//del para eliminar.
                fn: function () {
                    if (!vista.btnEliminarTRetencion.disabled && !vista.ventanaTRetencion.isVisible()) {
                        eliminarTRetencion();
                    }
                },
            },
            {
                key: 13,//enter para aceptar.
                fn: function () {
                    if (vista.btnAceptarTRetencion.isVisible()) {
                        vista.btnAceptarTRetencion.focus();
                        vista.btnAceptarTRetencion.fireEvent('click');
                    }
                },
            }
        ]);
    }
};

variablesGlobales.nomtiporetencion_js = 1;
