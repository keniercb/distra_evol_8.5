Ext.ns('Pvd.Nomina.Nomencladores.NomPeriodoPago');

Pvd.Nomina.Nomencladores.NomPeriodoPago.Panel = Ext.extend(Ext.Panel, {
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
        this.modelo = new Pvd_Nomina_Nomencladores_NomPeriodoPago_Modelo();
        this.modelo.init();

        //Inicializando la vista.
        this.vista = new Pvd_Nomina_Nomencladores_NomPeriodoPago_Vista();
        this.vista.init(this.perfil, this.idioma, this.modelo);

        //Inicializar controlador.
        this.controlador = new Pvd_Nomina_Nomencladores_NomPeriodoPago_Controlador();
        this.controlador.init(this.idioma, this.vista, this.modelo);

        this.items = [this.vista.panelCentralPerP];

        //Teclas calientes de la interfaz
        this.keyMap = this.controlador.keyMap;

        Pvd.Nomina.Nomencladores.NomPeriodoPago.Panel.superclass.initComponent.call(this);
    },
    listeners: {
        afterlayout: function (x) {
            if (this.mostrar == 1) {
                this.modelo.storePeriodoPago.load({params: {limit: 1000, start: 0}});
                this.mostrar = 2;
            }
        },
        destroy: function (x) {
            this.keyMap.disable();
        },
    },
});

//Modelo de la vista del Nomenclador de periodos de pago.
var Pvd_Nomina_Nomencladores_NomPeriodoPago_Modelo = function () {
    /**
     * Inicializar el modelo de la vista.
     */
    this.init = function () {

        //Store del listado de periodos de pago.
        this.storePeriodoPago = new Ext.data.Store({
            url: '/pvd/nomina/index.php/nomperiodopago/obtenerPeriodosPago',
            reader: new Ext.data.JsonReader(
                {totalProperty: "cantidad", autoLoad: true, root: "datos", id: "idperiodopago"},
                [
                    {name: 'idperiodopago'}
                    ,
                    {name: 'denominacion'}
                    ,
                    {name: 'fechainicio'}
                    ,
                    {name: 'fechafin'}
                    ,
                    {name: 'descripcion'}
                    ,
                    {name: 'cantidaddias'}
                    ,
                    {name: 'idtipoperiodo'}
                    ,
                    {name: 'tipoperiodo'}
                ])
        });

        var tipos = [
            [1, 'semanal'],
            [2, 'quincenal'],
            [3, 'mensual'],
            [4, 'trimestral'],
            [5, 'semestral'],
            [6, 'anual']];
        this.storeTiposPeriodosPagos = new Ext.data.SimpleStore({
            fields: [{name: 'idtipoperiodo'}, {name: 'tipoperiodo'}]
        });
        this.storeTiposPeriodosPagos.loadData(tipos);
    }
};

//Vista del componente Nomenclador de periodos de pago.
var Pvd_Nomina_Nomencladores_NomPeriodoPago_Vista = function () {
    /**
     * Inicializar la vista.
     *
     * @param perfil Objeto que contiene el perfil de la IU (Tipo: Object).
     * @param idioma Objeto que contiene el idioma de los textos de la IU (Tipo: Object).
     * @param modelo Modelo de la vista del componente Nomenclador de periodos de pago (Tipo: Pvd_Nomina_Nomencladores_NomPeriodoPago_Modelo).
     */
    this.init = function (perfil, idioma, modelo) {
        var self = this;

        //Listado de periodos de pago.
        function centrarValor(val) {
            if (val)
                return "<center>" + val + "</center>";
        }

        this.expanderPeriodoPago = new Ext.grid.RowExpander({
            tpl: new Ext.Template(
                '<div style="word-wrap:break-word;white-space:normal;"><p>&nbsp;&nbsp;Descripci&oacute;n:&nbsp;{descripcion}</p><br/></div>'
            ), enableCaching: false
        });

        this.smPeriodoPago = new Ext.grid.RowSelectionModel({
            singleSelect: true,
        });

        this.gpPeriodoPago = new Ext.grid.GridPanel({
            id: 'idgpPeriodoPago',
            title: idioma.lbTitlePeriodoPago,
            region: 'center',
            columns: [
                {header: 'idperiodopago', hidden: true, hideable: false, dataIndex: 'idperiodopago'}
                ,
                this.expanderPeriodoPago
                ,
                {header: idioma.lbColDenominacion, width: 400, sortable: true, dataIndex: 'denominacion'}
                ,
                {
                    header: '<center>' + idioma.lbColCantidaddeDias + '</center>',
                    width: 70,
                    sortable: true,
                    dataIndex: 'cantidaddias',
                    renderer: centrarValor
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
                ,
                {header: 'idtipoperiodo', hidden: true, hideable: false, dataIndex: 'idtipoperiodo'}
                ,
                {
                    header: '<center>Tipo per&iacute;odo</center>',
                    width: 90,
                    sortable: true,
                    dataIndex: 'tipoperiodo',
                    renderer: centrarValor
                }
            ],
            stripeRows: true,
            autoScroll: true,
            border: false,
            width: '100%',
            heigth: '100%',
            viewConfig: {forceFit: true},
            store: modelo.storePeriodoPago,
            sm: this.smPeriodoPago,
            plugins: this.expanderPeriodoPago,
            loadMask: {msg: idioma.lbMaskGridCargando},
            bbar: new Ext.PagingToolbar({
                pageSize: 1000,
                store: modelo.storePeriodoPago,
                displayInfo: true,
                displayMsg: 'Mostrando  {0} - {1} de {2}',
                emptyMsg: "0 Resultado a mostrar"
            }),
        });

        //Botones de Add, Mod, Elim, Ayud de periodos de pago.
        this.btnAdicionarPerP = new Ext.Button({
            id: 'btnAddPerP',
            text: idioma.lbBtnAdicionar,
            tooltip: idioma.textToolTipAddPerP,
            // icon: perfil.dirImg+'adicionar.png',
            iconCls: 'adicionar',
            prevTab: 'btnAyudaPerP',
            nextTab: 'btnModPerP',
        });

        this.btnModificarPerP = new Ext.Button({
            id: 'btnModPerP',
            text: idioma.lbBtnModificar,
            tooltip: idioma.textToolTipModPerP,
            // icon: perfil.dirImg+'modificar.png',
            iconCls: 'modificar',
            prevTab: 'btnAddPerP',
            nextTab: 'btnElimPerP',
        });

        this.btnEliminarPerP = new Ext.Button({
            id: 'btnElimPerP',
            text: idioma.lbBtnEliminar,
            tooltip: idioma.textToolTipElimPerP,
            //  icon: perfil.dirImg+'eliminar.png',
            iconCls: 'eliminar',
            prevTab: 'btnModPerP',
            nextTab: 'btnAyudaPerP',
        });

        this.btnAyudaPerP = new Ext.Button({
            id: 'btnAyudaPerP',
            text: idioma.lbBtnAyuda,
            tooltip: idioma.textToolTipAyudaPerP,
            // icon:perfil.dirImg+'ayuda.png',
            iconCls: 'ayuda',
            prevTab: 'btnElimPerP',
            nextTab: 'btnAddPerP',
        });

        //Panel contenedor general del grid de periodos de pago. 
        this.panelCentralPerP = new Ext.Panel({
            id: 'idpanelCentralPerP',
            region: 'center',
            heigth: '100%',
            width: '100%',
            border: false,
            layout: 'fit',
            tbar: [this.btnAdicionarPerP, this.btnModificarPerP, this.btnEliminarPerP, '->', this.btnAyudaPerP],
            items: [this.gpPeriodoPago],
        });

        //Campos del formulario de periodos de pago.
        this.tfDenomPerP = new Ext.form.TextField({
            id: 'idtfDenomPerP', fieldLabel: idioma.lbColDenominacion,
            tabIndex: 2, name: 'denominacion', allowBlank: false, anchor: '99%',
            blankText: idioma.lbErrorCampoVacio, prevTab: 'idbtnAceptarPerP',
            nextTab: 'idnfCantidadDias',
//                                        regex:/^([a-zA-ZÁÉÍÓÚáéíóúñüÑ\d ]+(\d*)?)+$/,
            vtype: 'vtdenominaciones',
            regexText: idioma.lbDenomIncorr,
            blankText: idioma.lbErrorCampoVacio,
            maxLength: 100,
            maxLengthText: idioma.lbMaxText_100,
        });

        this.cbTipoPeriodo = new Ext.form.ComboBox({
            id: 'idcbTipoPeriodo', fieldLabel: 'Tipo per&iacute;odo',
            tabIndex: 1, valueField: 'idtipoperiodo',
            displayField: 'tipoperiodo', hiddenName: 'idtipoperiodo',
            allowBlank: false, mode: 'local',
            store: modelo.storeTiposPeriodosPagos, emptyText: 'Seleccione...',
            blankText: idioma.lbErrorCampoVacio, readOnly: true,
            triggerAction: 'all', anchor: '99%'
        });

        this.nfCantidadDias = new Ext.form.NumberField({
            id: 'idnfCantidadDias',
            fieldLabel: idioma.lbColCantDias,
            tabIndex: 2, name: 'cantidaddias',
            allowBlank: false, anchor: '99%',
            blankText: idioma.lbErrorCampoVacio,
            prevTab: 'idtfDenomPerP',
            nextTab: 'iddfFInicioPerP',
            maxLength: 3,
            maxLengthText: idioma.lbMaxText_3,
            regex: /^([1-9]+(\d*)?)+$/,
            regexText: idioma.lbCantDiasIncorr,
            maxText: idioma.lbCantDiasMaxText,
            maxValue: 365,
        });

        this.dfFInicioPerP = new Ext.form.DateField({
            id: 'iddfFInicioPerP', fieldLabel: idioma.lbColDesde,
            tabIndex: 3, name: 'fechainicio', allowBlank: false,
            format: 'd/m/Y', editable: true, readOnly: false,
            value: new Date().format('d/m/Y'), maxText: idioma.lbFechaMaxima,
            minText: idioma.lbFechaMinima, blankText: idioma.lbErrorCampoVacio,
            invalidText: idioma.invalidTextFecha, vtype: 'daterange',
            anchor: '99%',
            endDateField: 'iddfFFinPerP'
        });

        this.dfFFinPerP = new Ext.form.DateField({
            id: 'iddfFFinPerP', fieldLabel: idioma.lbColHasta,
            tabIndex: 4, name: 'fechafin', xtype: 'datefield', allowBlank: true,
            format: 'd/m/Y', editable: true, readOnly: false,
            maxText: idioma.lbFechaMaxima, minText: idioma.lbFechaMinima,
            blankText: idioma.lbErrorCampoVacio, invalidText: idioma.invalidTextFecha,
            vtype: 'daterange', anchor: '99%', startDateField: 'iddfFInicioPerP'
        });

        this.tfDescripPerP = new Ext.form.TextArea({
            id: 'idtfDescripPerP',
            fieldLabel: idioma.lbColDescripcion, tabIndex: 5,
            name: 'descripcion', allowBlank: true,
            hiddenname: 'descripcion',
            maxLength: 255, //regex, regexText, maskRe
            maxLengthText: idioma.lbMaxText_225,
            anchor: '99%', prevTab: 'iddfFFinPerP', nextTab: 'idbtnCancelarPerP',
            blankText: idioma.lbErrorCampoVacio,

        });

        //Formulario de periodos de pago.
        this.formularioPerP = new Ext.FormPanel({
            id: 'idformlarioPerP',
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
                        {columnWidth: 1, layout: 'form', items: [this.tfDenomPerP]}
                    ]
                }, {
                    layout: 'column',
                    items: [
                        {columnWidth: .5, layout: 'form', items: [this.cbTipoPeriodo]},
                        {columnWidth: .5, layout: 'form', items: [this.nfCantidadDias]}
                    ]
                },
                {
                    layout: 'column',
                    items: [
                        {columnWidth: .5, layout: 'form', items: [this.dfFInicioPerP]},
                        {columnWidth: .5, layout: 'form', items: [this.dfFFinPerP]}
                    ]
                },
                this.tfDescripPerP
            ],
        });

        //Botones de la ventana de periodos de pago
        this.btnCancelarPerP = new Ext.Button({
            id: 'idbtnCancelarPerP',
            iconCls: 'cancelar',
            //   icon:perfil.dirImg+'cancelar.png',
            text: idioma.lbBtnCancelar,
            tooltip: idioma.textToolTipCancelar,
            prevTab: 'idtfDescripPerP',
            nextTab: 'idbtnAplicarPerP',
        });

        this.btnAplicarPerP = new Ext.Button({
            id: 'idbtnAplicarPerP',
            iconCls: 'aplicar',
            //  icon:perfil.dirImg+'aplicar.png',
            text: idioma.lbBtnAplicar,
            tooltip: idioma.textToolTipAplicar,
            prevTab: 'idbtnCancelarPerP',
            nextTab: 'idbtnAceptarPerP',
        });

        this.btnAceptarPerP = new Ext.Button({
            id: 'idbtnAceptarPerP',
            iconCls: 'aceptar',
            //  icon:perfil.dirImg+'aceptar.png',
            text: idioma.lbBtnAceptar,
            tooltip: idioma.textToolTipAceptar,
            prevTab: 'idbtnAplicarPerP',
            nextTab: 'idtfDenomPerP',
        });

        //Ventana de adicionar y modificar periodos de pago.
        this.ventanaPerP = new Ext.Window({
            modal: true,
            closeAction: 'hide',
            autoHeight: true,
            closable: true,
            constrain: true,
            resizable: false,
            layout: 'fit',
            autoValidate: true,
            validateDefault: true,
            items: [this.formularioPerP],
            buttons: [this.btnCancelarPerP, this.btnAplicarPerP, this.btnAceptarPerP],
            keys: [
                {
                    key: Ext.EventObject.ENTER,
                    stopEvent: true,
                    fn: function () {
                        if (!self.btnAceptarPerP.disabled) {
                            self.btnAceptarPerP.handler();
                        }
                    }
                },
                {
                    key: 'x',
                    alt: true,
                    stopEvent: true,
                    fn: function () {
                        if (!self.btnCancelarPerP.disabled) {
                            self.btnCancelarPerP.handler();
                        }
                    }
                },
                {
                    key: 'p',
                    alt: true,
                    stopEvent: true,
                    fn: function () {
                        if (!self.btnAplicarPerP.disabled) {
                            self.btnAplicarPerP.handler();
                        }
                    }
                }
            ]

        });
    }
};

//Controlador de la vista del Nomenclador de periodos de pago.
var Pvd_Nomina_Nomencladores_NomPeriodoPago_Controlador = function () {
    /**
     * Inicializar el controlador de la vista.
     *
     * @param idioma Objeto que contiene el idioma de los textos de la IU (Tipo: Object).
     * @param vista Vista del componente Nomenclador de periodos de pago (Tipo: Pvd_Nomina_Nomencladores_NomPeriodoPago_Vista)
     * @param modelo Modelo de la vista del componente Nomenclador de periodos de pago (Tipo: Pvd_Nomina_Nomencladores_NomPeriodoPago_Modelo)
     */
    this.init = function (idioma, vista, modelo) {
        var _vista = vista;
        /**
         *Variables generales.
         */
        var variablesPerP = {
            accion: 'Add',
            cambio: 0,
        };

        //Eventos del grid de periodos de pago.
        vista.gpPeriodoPago.on('rowdblclick', function (e) {
            mostrarVentanaModificarPerP();
        });

        vista.gpPeriodoPago.on('destroy', function (e) {
            vista.ventanaPerP.destroy();
        });

        //Eventos del store de periodos de pago.
        modelo.storePeriodoPago.on('beforeload', function (store) {
            vista.btnModificarPerP.disable();
            vista.btnEliminarPerP.disable();
            store.removeAll();
        });

        modelo.storePeriodoPago.on('load', function (store, records, opt) {
            if (!records.length) {
                mostrarMensaje(1, idioma.lbMsgNoExistenDatos);
            }
        });

        //Eventos del seleccion model del grid de periodos de pago.
        vista.smPeriodoPago.on('rowselect', function () {
            vista.btnModificarPerP.enable();
            vista.btnEliminarPerP.enable();
        });

        //Eventos de campo de denominacion. 
        vista.tfDenomPerP.on('change', function (tf, n, o) {
            variablesPerP.cambio = 1;
        });

        vista.cbTipoPeriodo.on('change', function () {
            variablesPerP.cambio = 1;
        });

        //Eventos de campo de fecha inicio. 
        vista.dfFInicioPerP.on('change', function (tf, n, o) {
            variablesPerP.cambio = 1;
        });

        //Eventos de campo de fecha fin. 
        vista.dfFFinPerP.on('change', function (tf, n, o) {
            variablesPerP.cambio = 1;
        });

        vista.nfCantidadDias.on('change', function (tf, n, o) {
            variablesPerP.cambio = 1;
        });

        //Eventos de campo de descripcion. 
        vista.tfDescripPerP.on('change', function (tf, n, o) {
            variablesPerP.cambio = 1;
        });

        //Eventos del botón adicionar periodos de pago.
        vista.btnAdicionarPerP.setHandler(function () {
            mostrarVentanaAdicionarPerP();
        });

        //Eventos del botón modificar periodos de pago.
        vista.btnModificarPerP.setHandler(function () {
            mostrarVentanaModificarPerP();
        });

        //Eventos del botón eliminar periodos de pago.
        vista.btnEliminarPerP.setHandler(function () {
            eliminarPeriodoPago();
        });

        //Eventos del botón cancelar periodos de pago.
        vista.btnCancelarPerP.setHandler(function () {
            vista.ventanaPerP.hide();
//            vista.formularioPerP.purgeListeners();
        });

        //Eventos del botón aplicar periodos de pago.
        vista.btnAplicarPerP.setHandler(function () {
            salvarFormularioPerP(true);
        });

        //Eventos del botón aceptar periodos de pago.
        vista.btnAceptarPerP.setHandler(function () {
            salvarFormularioPerP(false);
//            vista.formularioPerP.purgeListeners();
        });

        //Evento de la ventana de adicionar/modificar periodos de pago.
        vista.ventanaPerP.on('beforeshow', function (ventana) {
            variablesPerP.cambio = 0;
            vista.formularioPerP.getForm().reset();
            vista.tfDenomPerP.focus(true, 500);
        });

        /*
         *Función de mostrar la ventana de adicionar periodos de pago.
         */
        function mostrarVentanaAdicionarPerP() {
            //vista.cbTipoPeriodo.disable();
            vista.ventanaPerP.setTitle(idioma.lbTitleVentAdicionarPerP);
            vista.btnAplicarPerP.show();
            vista.ventanaPerP.show();
            //Actualizar la tabulación deL formulario.
            vista.btnCancelarPerP.setNextElement('idbtnAplicarPerP');
            vista.btnAceptarPerP.setPreviousElement('idbtnAplicarPerP');
            variablesPerP.accion = 'Add';
        }

        /*
         *Función de mostrar la ventana de modificar periodos de pago.
         */
        function mostrarVentanaModificarPerP() {
            vista.cbTipoPeriodo.setValue(vista.gpPeriodoPago.getSelectionModel().getSelected().get('idtipoperiodo'));
            vista.ventanaPerP.setTitle(idioma.lbTitleVentModificarPerP);
            vista.btnAplicarPerP.hide();
            vista.ventanaPerP.show();
            //Actualizar la tabulación deL formulario.
            vista.btnCancelarPerP.setNextElement('idbtnAceptarPerP');
            vista.btnAceptarPerP.setPreviousElement('idbtnCancelarPerP');
            vista.formularioPerP.getForm().loadRecord(vista.smPeriodoPago.getSelected());
//            vista.formularioPerP.addListener('clientvalidation', function (_form, _valid) {
//                if (comparar(vista.formularioPerP.getForm().getValues(), vista.smPeriodoPago.getSelected().data)) {
//                    vista.btnAceptarPerP.setDisabled(true);
//                } else {
//                    vista.btnAceptarPerP.enable();
//                }
//            });
            variablesPerP.accion = 'Mod';
        }

        /*
         *Función para adicionar/modificar un periodo de pago.
         */
        function salvarFormularioPerP(boton) {
            var urlAction = '/pvd/nomina/index.php/nomperiodopago/adicionarPeriodoPago';
            var idperiodopago = 0;
            var lbMsgEspera = idioma.lbMsgAdicionarPerP;
            var lbMsgExito = idioma.lbMsgCorrectoAdicionadoPerP;
            if (variablesPerP.accion == 'Mod') {
                //Validar que hubo algún cambio en el formulario modificar, al presionar la tecla Enter
                fnValidarCambios();
                lbMsgEspera = idioma.lbMsgModificarPerP;
                lbMsgExito = idioma.lbMsgCorrectoModificadoPerP;
                lbMsgFailedAdd = idioma.lbMsgErrorAdicionar;
                urlAction = '/pvd/nomina/index.php/nomperiodopago/modificarPeriodoPago';
                idperiodopago = vista.smPeriodoPago.getSelected().get('idperiodopago');
            }

            if (variablesPerP.cambio == 0) {
                if (variablesPerP.accion == 'Mod') {
                    //Se oculta la ventana si no ha sido modificado ningún valor.
                    vista.ventanaPerP.hide();
                } else {
                    //Se marcan como obligatorios en caso de presionar aceptar y se encuentren vacíos.
                    vista.tfDenomPerP.markInvalid(idioma.lbErrorCampoVacio);
                    mostrarMensaje(3, idioma.lbErrorFormulario);
                }
            } else {
                //Se verifica si el formulario es válido y si el campo sueldo contiene un valor
                if (vista.formularioPerP.getForm().isValid()) {

                    //Se muestra la máscara de espera.
                    PVD.mostrarMascara('idmaskaddmodperiodo', idioma.lbMsgEsperaEnviarDatos, lbMsgEspera);

                    //Enviando datos al servidor.
                    Ext.Ajax.request({
                        url: urlAction,
                        method: 'POST',
                        params: {
                            idperiodopago: idperiodopago,
                            denominacion: vista.tfDenomPerP.getValue(),
                            fechainicio: vista.dfFInicioPerP.getRawValue(),
                            fechafin: vista.dfFFinPerP.getRawValue(),
                            descripcion: vista.tfDescripPerP.getValue(),
                            cantdias: vista.nfCantidadDias.getValue(),
                            tipoperiodo: vista.cbTipoPeriodo.getValue()
                        },
                        callback: function (options, success, response) {
                            responseData = Ext.decode(response.responseText);

                            //Ocultando máscara de enviar datos.
                            PVD.ocultarMascara('idmaskaddmodperiodo');

                            if (responseData.codigo == 1) {
                                mostrarMensaje(1, lbMsgExito);
                                if (!boton) {
                                    vista.ventanaPerP.hide();

                                } else {
                                    vista.tfDenomPerP.focus(true, 500);
                                }
                                vista.formularioPerP.getForm().reset();
                                modelo.storePeriodoPago.removeAll();
                                modelo.storePeriodoPago.load({params: {limit: 1000, start: 0}});
                                variablesPerP.cambio = 0;


                            } else if (responseData.codigo == 2) {
                                mostrarMensaje(1, idioma.lbMsgErrorAdicionar + '<br>' + vista.nfCantidadDias.getValue() + '</br>', function () {
                                    vista.ventanaPerP.hide();
                                });

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
         *Función para eliminar un periodo de pago.
         */
        function eliminarPeriodoPago() {
            //Mostrando el mensaje para aceptar el eliminar.
            mostrarMensaje(2, idioma.lbTitleEliminarPerP, function (btn) {
                if (btn == "ok") {
                    //Se muestra la máscara de espera.
                    PVD.mostrarMascara('idmaskeleminarperp', idioma.lbMsgEsperaEnviarDatos, idioma.lbMsgEliminarPerP);
                    //Enviando los datos al servidor.
                    Ext.Ajax.request({
                        url: '/pvd/nomina/index.php/nomperiodopago/eliminarPeriodoPago',
                        method: 'POST',
                        params: {idperiodopago: vista.smPeriodoPago.getSelected().get('idperiodopago')},
                        callback: function (options, success, response) {
                            //Se oculta la máscara de espera.
                            PVD.ocultarMascara('idmaskeleminarperp');
                            responseData = Ext.decode(response.responseText);
                            if (responseData.codigo == 1) {
                                //Mostrando el mensaje de que se ha el periodo de pago.
                                mostrarMensaje(1, idioma.lbMsgCorrectoEliminadoPerP);
                                //Recargando el grid de periodos de pago.
                                modelo.storePeriodoPago.load({params: {limit: 1000, start: 0}});

                            } else {
                                if (responseData.codigo)
                                    mostrarMensaje(responseData.codigo, idioma.lbMsgErrorPerPUso);
                            }
                        }
                    });
                }
            });
        }

        function fnValidarCambios() {
            variablesPerP.cambio = (vista.tfDenomPerP.startValue != vista.tfDenomPerP.getValue()) ? 1 : 0;
            variablesPerP.cambio = (vista.cbTipoPeriodo.startValue != vista.cbTipoPeriodo.getValue()) ? 1 : 0;
            variablesPerP.cambio = (vista.dfFInicioPerP.startValue != vista.dfFInicioPerP.getValue()) ? 1 : 0;
            variablesPerP.cambio = (vista.dfFFinPerP.startValue != vista.dfFFinPerP.getValue()) ? 1 : 0;
            variablesPerP.cambio = (vista.nfCantidadDias.startValue != vista.nfCantidadDias.getValue()) ? 1 : 0;
            variablesPerP.cambio = (vista.tfDescripPerP.startValue != vista.tfDescripPerP.getValue()) ? 1 : 0;
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
                            if (!vista.btnAdicionarPerP.disabled && !vista.ventanaPerP.isVisible()) {
                                mostrarVentanaAdicionarPerP();
                            }
                            break;
                        }
                        case 77: { //m para modificar .
                            if (!vista.btnModificarPerP.disabled && !vista.ventanaPerP.isVisible()) {
                                mostrarVentanaModificarPerP();
                            }
                            break;
                        }
                        case 72: { //h para ayuda.
                            if (!vista.ventanaPerP.isVisible()) {
                                vista.btnAyudaPerP.focus();
                                vista.btnAyudaPerP.fireEvent('click');
                            }
                            break;
                        }
                    }
                }
            },
            {
                key: 46,//del para eliminar.
                fn: function () {
                    if (!vista.btnEliminarPerP.disabled && !vista.ventanaPerP.isVisible()) {
                        eliminarPeriodoPago();
                    }
                },
            },
            {
                key: 13,//enter para aceptar.
                fn: function () {
                    if (vista.btnAceptarPerP.isVisible()) {
                        vista.btnAceptarPerP.focus();
                        vista.btnAceptarPerP.fireEvent('click');
                    }
                },
            }
        ]);
    }
};

variablesGlobales.nomperiodopago_js = 1;
