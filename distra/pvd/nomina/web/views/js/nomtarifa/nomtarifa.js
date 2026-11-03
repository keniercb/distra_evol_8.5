Ext.ns('Pvd.Nomina.Nomencladores.NomTarifa');

Pvd.Nomina.Nomencladores.NomTarifa.Panel = Ext.extend(Ext.Panel, {
    layout       : 'fit',
    region       : 'center',
    heigth       : '100%',
    width        : '100%',
    html         : 'dad',
    border       : false,
    frame        : false,
    hideBorders  : true,
    perfil       : this.perfil,
    idioma       : this.idioma,
    mostrar      : 1,
    initComponent: function () {

        //Inicializando el modelo.
        this.modelo = new Pvd_Nomina_Nomencladores_NomTarifa_Modelo();
        this.modelo.init();

        //Inicializando la vista.
        this.vista = new Pvd_Nomina_Nomencladores_NomTarifa_Vista();
        this.vista.init(this.perfil, this.idioma, this.modelo);

        //Inicializar controlador.
        this.controlador = new Pvd_Nomina_Nomencladores_NomTarifa_Controlador();
        this.controlador.init(this.idioma, this.vista, this.modelo);

        this.items = [this.vista.panelCentralTarifa];

        //Teclas calientes de la interfaz
        this.keyMap = this.controlador.keyMap;

        Pvd.Nomina.Nomencladores.NomTarifa.Panel.superclass.initComponent.call(this);
    },
    listeners    : {
        afterlayout: function (x) {
            if (this.mostrar == 1) {
                this.modelo.storeTarifa.load({params: {limit: 1000, start: 0}});
                this.mostrar = 2;
            }
        },
        destroy    : function (x) {
            this.keyMap.disable();
        },
    },
});

//Modelo de la vista del Nomenclador de tarifa.
var Pvd_Nomina_Nomencladores_NomTarifa_Modelo = function () {
    /**
     * Inicializar el modelo de la vista.
     */
    this.init = function () {

        //Store del listado de tipos de tarifa.
        this.storeTarifa = new Ext.data.Store({
            url   : '/pvd/nomina/index.php/nomtarifa/obtenerListadoTarifa',
            reader: new Ext.data.JsonReader(
                {totalProperty: "cantidad", autoLoad: true, root: "datos", id: "idtarifa" },
                [
                    {name: 'idtarifa'}
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
    }
};

//Vista del componente Nomenclador de tarifa.
var Pvd_Nomina_Nomencladores_NomTarifa_Vista = function () {
    /**
     * Inicializar la vista.
     *
     * @param perfil Objeto que contiene el perfil de la IU (Tipo: Object).
     * @param idioma Objeto que contiene el idioma de los textos de la IU (Tipo: Object).
     * @param modelo Modelo de la vista del componente Nomenclador de tarifa (Tipo: Pvd_Nomina_Nomencladores_NomTarifa_Modelo).
     */
    this.init = function (perfil, idioma, modelo) {

        var self = this;

        //Listado de tipos de tarifa.
        function centrarValor(val) {
            if (val)
                return "<center>" + val + "</center>";
        }

        this.expanderTarifa = new Ext.grid.RowExpander({
            tpl             : new Ext.Template(
                '<div style="word-wrap:break-word;white-space:normal;"><p>&nbsp;&nbsp;Descripci&oacute;n:&nbsp;{descripcion}</p><br/></div>'
            ), enableCaching: false
        });

        this.smTarifa = new Ext.grid.RowSelectionModel({
            singleSelect: true,
        });

        this.gpTarifa = new Ext.grid.GridPanel({
            id        : 'gpTarifa',
            title     : idioma.lbTitleTarifa,
            region    : 'center',
            columns   : [
                {header: 'idtarifa', hidden: true, hideable: false, dataIndex: 'idtarifa'}
                ,
                this.expanderTarifa
                ,
                {header: idioma.lbColDenominacion, width: 500, sortable: true, dataIndex: 'denominacion'}
                ,
                {header: '<center>' + idioma.lbColDesde + '</center>', width: 90, sortable: true, dataIndex: 'fechainicio', renderer: centrarValor}
                ,
                {header: '<center>' + idioma.lbColHasta + '</center>', width: 90, sortable: true, dataIndex: 'fechafin', renderer: centrarValor}
            ],
            stripeRows: true,
            autoScroll: true,
            border    : false,
            width     : '100%',
            heigth    : '100%',
            viewConfig: {forceFit: true},
            store     : modelo.storeTarifa,
            sm        : this.smTarifa,
            plugins   : this.expanderTarifa,
            loadMask  : {msg: idioma.lbMaskGridCargando},
            bbar      : new Ext.PagingToolbar({
                pageSize   : 1000,
                store      : modelo.storeTarifa,
                displayInfo: true,
                displayMsg : 'Mostrando  {0} - {1} de {2}',
                emptyMsg   : "0 Resultado a mostrar"
            }),
        });

        //Botones de Add, Mod, Elim, Ayud de tipos de tarifa.
        this.btnAdicionarTarifa = new Ext.Button({
            id     : 'btnAdicionarTarifa',
            text   : idioma.lbBtnAdicionar,
            tooltip: idioma.textToolTipAddTarifa,
            // icon: perfil.dirImg+'adicionar.png',
            iconCls: 'adicionar',
            prevTab: 'btnAyudaTarifa',
            nextTab: 'btnModificarTarifa',
        });

        this.btnModificarTarifa = new Ext.Button({
            id     : 'btnModificarTarifa',
            text   : idioma.lbBtnModificar,
            tooltip: idioma.textToolTipModTarifa,
            //  icon: perfil.dirImg+'modificar.png',
            iconCls: 'modificar',
            prevTab: 'btnAdicionarTarifa',
            nextTab: 'btnEliminarTarifa',
        });

        this.btnEliminarTarifa = new Ext.Button({
            id     : 'btnEliminarTarifa',
            text   : idioma.lbBtnEliminar,
            tooltip: idioma.textToolTipElimTarifa,
            // icon: perfil.dirImg+'eliminar.png',
            iconCls: 'eliminar',
            prevTab: 'btnModificarTarifa',
            nextTab: 'btnAyudaTarifa',
        });

        this.btnExportarTarifa = new Ext.Button({
            id: 'btnExportarTarifa',
            text: 'Exportar',
            tooltip: 'Exportar',
            iconCls: 'exportar'
        });

        this.btnAyudaTarifa = new Ext.Button({
            id     : 'btnAyudaTarifa',
            text   : idioma.lbBtnAyuda,
            tooltip: idioma.textToolTipAyudaTarifa,
            //  icon:perfil.dirImg+'ayuda.png',
            iconCls: 'ayuda',
            prevTab: 'btnElimTipoP',
            nextTab: 'btnAddTipoP',
        });

        //Panel contenedor general del grid de tipos de tarifa. 
        this.panelCentralTarifa = new Ext.Panel({
            id    : 'idpanelCentralTarifa',
            region: 'center',
            heigth: '100%',
            width : '100%',
            border: false,
            layout: 'fit',
            tbar  : [this.btnAdicionarTarifa, this.btnModificarTarifa, this.btnEliminarTarifa, this.btnExportarTarifa, '->', this.btnAyudaTarifa],
            items : [this.gpTarifa],
        });

        //Campos del formulario de tipos de tarifa.
        this.tfDenomTarifa = new Ext.form.TextField({id: 'idtfDenomTarifa', fieldLabel: idioma.lbColDenominacion,
            tabIndex                                   : 2, name: 'denominacion', allowBlank: false, anchor: '99%',
            prevTab                                    : 'idbtnAceptarTarifa',
//                                        regex:/^([a-zA-ZÁÉÍÓÚáéíóúñüÑ\d ]+(\d*)?)+$/,
            vtype                                      : 'vtdenominaciones',
            regexText                                  : idioma.lbDenomIncorr, //maskRe
            blankText                                  : idioma.lbErrorCampoVacio,
            maxLength                                  : 100,
            maxLengthText                              : idioma.lbMaxText_100,
        });

        this.dfFInicioTarifa = new Ext.form.DateField({id: 'iddfFInicioTarifa', fieldLabel: idioma.lbColDesde,
            tabIndex                                     : 3, name: 'fechainicio', allowBlank: false,
            format                                       : 'd/m/Y', editable: true, readOnly: false,
            value                                        : new Date().format('d/m/Y'), maxText: idioma.lbFechaMaxima,
            minText                                      : idioma.lbFechaMinima, blankText: idioma.lbErrorCampoVacio,
            invalidText                                  : idioma.invalidTextFecha, vtype: 'daterange',
            anchor                                       : '90%', endDateField: 'iddfFFinTarifa'
        });

        this.dfFFinTarifa = new Ext.form.DateField({id: 'iddfFFinTarifa', fieldLabel: idioma.lbColHasta,
            tabIndex                                  : 4, name: 'fechafin', xtype: 'datefield', allowBlank: true,
            format                                    : 'd/m/Y', editable: true, readOnly: false,
            maxText                                   : idioma.lbFechaMaxima, minText: idioma.lbFechaMinima,
            blankText                                 : idioma.lbErrorCampoVacio, invalidText: idioma.invalidTextFecha,
            vtype                                     : 'daterange', anchor: '99%', startDateField: 'iddfFInicioTarifa'
        });

        this.tfDescripTarifa = new Ext.form.TextArea({id: 'idtfDescripTarifa',
            fieldLabel                                  : idioma.lbColDescripcion, tabIndex: 5,
            name                                        : 'descripcion', allowBlank: true,
            hiddenname                                  : 'descripcion',
            maxLength                                   : 255, //regex, regexText, maskRe
            maxLengthText                               : idioma.lbMaxText_255,
            anchor                                      : '99%', prevTab: 'iddfFFinTarifa', nextTab: 'idbtnCancelarTarifa',
            blankText                                   : idioma.lbErrorCampoVacio,
        });

        //Formulario de tipos de tarifa.
        this.formularioTarifa = new Ext.FormPanel({
            id        : 'idformularioTarifa',
            labelAlign: 'top',
            frame     : true,
            width     : 300,
            autoHeight: true,
            bodyStyle : {
                padding: '10px 10px 10px 10px',
            },
            items     : [
                {layout  : 'column',
                    items: [
                        {columnWidth: .99, layout: 'form', items: [this.tfDenomTarifa]},
                    ]
                },
                {layout  : 'column',
                    items: [
                        {columnWidth: .54, layout: 'form', items: [this.dfFInicioTarifa]},
                        {columnWidth: .46, layout: 'form', items: [this.dfFFinTarifa]}
                    ]
                },
                this.tfDescripTarifa
            ],
        });

        //Botones de la ventana de tipos de tarifa
        this.btnCancelarTarifa = new Ext.Button({
            id     : 'idbtnCancelarTarifa',
            iconCls: 'cancelar',
            // icon:perfil.dirImg+'cancelar.png',
            text   : idioma.lbBtnCancelar,
            tooltip: idioma.textToolTipCancelar,
            prevTab: 'idtfDescripTarifa',
            nextTab: 'idbtnAplicarTarifa',
        });

        this.btnAplicarTarifa = new Ext.Button({
            id     : 'idbtnAplicarTarifa',
            iconCls: 'aplicar',
            // icon:perfil.dirImg+'aplicar.png',
            text   : idioma.lbBtnAplicar,
            tooltip: idioma.textToolTipAplicar,
            prevTab: 'idbtnCancelarTarifa',
            nextTab: 'idbtnAceptarTarifa',
        });

        this.btnAceptarTarifa = new Ext.Button({
            id     : 'idbtnAceptarTarifa',
            iconCls: 'aceptar',
            // icon:perfil.dirImg+'aceptar.png',
            text   : idioma.lbBtnAceptar,
            tooltip: idioma.textToolTipAceptar,
            prevTab: 'idbtnAplicarTarifa',
            nextTab: 'idtfDenomTarifa',
        });

        //Ventana de adicionar y modificar tipos de tarifa.
        this.ventanaTarifa = new Ext.Window({
            modal      : true,
            closeAction: 'hide',
            autoHeight : true,
            closable   : true,
            constrain: true,
            autoValidate: true,
            validateDefault: true,
            resizable  : false,
            layout     : 'fit',
            items      : [this.formularioTarifa],
            buttons    : [this.btnCancelarTarifa, this.btnAplicarTarifa, this.btnAceptarTarifa],
            keys       : [
                {
                    key      : Ext.EventObject.ENTER,
                    stopEvent: true,
                    fn       : function () {
                        if (!self.btnAceptarTarifa.disabled) {
                            self.btnAceptarTarifa.handler();
                        }
                    }
                },
                {
                    key      : 'x',
                    alt      : true,
                    stopEvent: true,
                    fn       : function () {
                        if (!self.btnCancelarTarifa.disabled) {
                            self.btnCancelarTarifa.handler();
                        }
                    }
                },
                {
                    key      : 'p',
                    alt      : true,
                    stopEvent: true,
                    fn       : function () {
                        if (!self.btnAplicarTarifa.disabled) {
                            self.btnAplicarTarifa.handler();
                        }
                    }
                }
            ]
        });
    }
};

//Controlador de la vista del Nomenclador de tipos de tarifa.
var Pvd_Nomina_Nomencladores_NomTarifa_Controlador = function () {
    /**
     * Inicializar el controlador de la vista.
     *
     * @param idioma Objeto que contiene el idioma de los textos de la IU (Tipo: Object).
     * @param vista Vista del componente Nomenclador de tarifa (Tipo: Pvd_Nomina_Nomencladores_NomTarifa_Vista)
     * @param modelo Modelo de la vista del componente Nomenclador de tarifa (Tipo: Pvd_Nomina_Nomencladores_NomTarifa_Modelo)
     */
    this.init = function (idioma, vista, modelo) {
        var _vista = vista;
        /**
         *Variables generales.
         */
        var variablesTarifa = {
            accion: 'Add',
            cambio: 0,
        };
        //Eventos del grid de tipos de tarifa.
        vista.gpTarifa.on('rowdblclick', function (e) {
            mostrarVentanaModificarTarifa();
        });

        vista.gpTarifa.on('destroy', function (e) {
            vista.ventanaTarifa.destroy();
        });

        //Eventos del store de tipos de tarifa.
        modelo.storeTarifa.on('beforeload', function (store) {
            vista.btnModificarTarifa.disable();
            vista.btnEliminarTarifa.disable();
            store.removeAll();
        });

        modelo.storeTarifa.on('load', function (store, records, opt) {
            if (!records.length) {
                mostrarMensaje(1, idioma.lbMsgNoExistenDatos);
            }
        });

        //Eventos del seleccion model del grid de tipos de tarifa.
        vista.smTarifa.on('rowselect', function () {
            vista.btnModificarTarifa.enable();
            vista.btnEliminarTarifa.enable();
        });

        //Eventos de campo de denominacion. 
        vista.tfDenomTarifa.on('change', function (tf, n, o) {
            variablesTarifa.cambio = 1;
        });

        //Eventos de campo de fecha inicio. 
        vista.dfFInicioTarifa.on('change', function (tf, n, o) {
            variablesTarifa.cambio = 1;
        });

        //Eventos de campo de fecha fin. 
        vista.dfFFinTarifa.on('change', function (tf, n, o) {
            variablesTarifa.cambio = 1;
        });

        //Eventos de campo de descripcion. 
        vista.tfDescripTarifa.on('change', function (tf, n, o) {
            variablesTarifa.cambio = 1;
        });

        //Eventos del botón adicionar tarifa.
        vista.btnAdicionarTarifa.setHandler(function () {
            mostrarVentanaAdicionarTarifa();
        });

        //Eventos del botón modificar tarifa.
        vista.btnModificarTarifa.setHandler(function () {
            mostrarVentanaModificarTarifa();
        });

        //Eventos del botón eliminar tarifa.
        vista.btnEliminarTarifa.setHandler(function () {
            eliminarTarifa();
        });

        //Exportar
        vista.btnExportarTarifa.on('click', function () {
            var winload = new Ext.PVD.comun.window.winLoad({
                title: 'Por favor espere...',
                mensaje: 'Generando reporte'
            });
            winload.showMask();
            var iframe = document.createElement("iframe");
            iframe.src = document.location.protocol + '//' + document.location.host +
                '/pvd/nomina/index.php/nomtarifa/exportarNomenclador';
            iframe.style.display = 'none';
            var that = this;
            iframe.onload = function () {
                winload.hideMask();
                //that.destroy();
            };
            document.body.appendChild(iframe);
        });

        //Eventos del botón cancelar tarifa.
        vista.btnCancelarTarifa.setHandler(function () {
            vista.ventanaTarifa.hide();
//            vista.formularioTarifa.purgeListeners();
        });

        //Eventos del botón aplicar tarifa.
        vista.btnAplicarTarifa.setHandler(function () {
            salvarFormularioTarifa(true);
        });

        //Eventos del botón aceptar tarifa.
        vista.btnAceptarTarifa.setHandler(function () {
            salvarFormularioTarifa(false);
//            vista.formularioTarifa.purgeListeners();
        });

        //Evento de la ventana de adicionar/modificar tarifa.
        vista.ventanaTarifa.on('beforeshow', function (ventana) {
            vista.formularioTarifa.getForm().reset();
            vista.tfDenomTarifa.focus(true, 500);
        });


        /*
         *Función de mostrar la ventana de adicionar tipos de nómina.
         */
        function mostrarVentanaAdicionarTarifa() {
            vista.ventanaTarifa.setTitle(idioma.lbTitleVentAdicionarTarifa);
            vista.btnAplicarTarifa.show();
            vista.ventanaTarifa.show();
            //Actualizar la tabulación deL formulario.
            vista.btnCancelarTarifa.setNextElement('idbtnAplicarTarifa');
            vista.btnAceptarTarifa.setPreviousElement('idbtnAplicarTarifa');
            variablesTarifa.accion = 'Add';
        }

        /*
         *Función de mostrar la ventana de modificar tipos de nómina.
         */
        function mostrarVentanaModificarTarifa() {
            vista.ventanaTarifa.setTitle(idioma.lbTitleVentModificarTarifa);
            vista.btnAplicarTarifa.hide();
            vista.ventanaTarifa.show();
            //Actualizar la tabulación deL formulario.
            vista.btnCancelarTarifa.setNextElement('idbtnAceptarTarifa');
            vista.btnAceptarTarifa.setPreviousElement('idbtnCancelarTarifa');
            vista.formularioTarifa.getForm().loadRecord(vista.smTarifa.getSelected());
//            vista.formularioTarifa.addListener('clientvalidation', function (_form, _valid) {
//                if (comparar(vista.formularioTarifa.getForm().getValues(), vista.smTarifa.getSelected().data)) {
//                    vista.btnAceptarTarifa.setDisabled(true);
//                } else {
//                    vista.btnAceptarTarifa.enable();
//                }
//            });
            variablesTarifa.accion = 'Mod';
        }

        /*
         *Función para adicionar/modificar un tipo de pago.
         */
        function salvarFormularioTarifa(boton) {

            var urlAction = '/pvd/nomina/index.php/nomtarifa/adicionarTarifa';
            var idtarifa = 0;
            var lbMsgEspera = idioma.lbMsgAdicionarTarifa;
            var lbMsgExito = idioma.lbMsgCorrectoAdicionadoTarifa;

            if (variablesTarifa.accion == 'Mod') {
                lbMsgEspera = idioma.lbMsgModificarTarifa;
                lbMsgExito = idioma.lbMsgCorrectoModificadoTarifa;
                urlAction = '/pvd/nomina/index.php/nomtarifa/modificarTarifa';
                idtarifa = vista.smTarifa.getSelected().get('idtarifa');
            }
            if (variablesTarifa.cambio == 0) {
                if (variablesTarifa.accion == 'Mod') {
                    //Se oculta la ventana si no ha sido modificado ningún valor.
                    vista.ventanaTarifa.hide();
                } else {
                    //Se marcan como obligatorios en caso de presionar aceptar y se encuentren vacíos.
                    vista.tfDenomTarifa.markInvalid(idioma.lbErrorCampoVacio);
                    mostrarMensaje(3, idioma.lbErrorFormulario);
                }
            } else {
                //Se verifica si el formulario es válido y si el campo sueldo contiene un valor
                if (vista.formularioTarifa.getForm().isValid()) {

                    //Se muestra la máscara de espera.
                    PVD.mostrarMascara('idmaskaddmodtipopago', idioma.lbMsgEsperaEnviarDatos, lbMsgEspera);

                    //Enviando datos al servidor.
                    Ext.Ajax.request({
                        url     : urlAction,
                        method  : 'POST',
                        params  : {idtarifa: idtarifa,
                            denominacion   : vista.tfDenomTarifa.getValue(),
                            fechainicio    : vista.dfFInicioTarifa.getRawValue(),
                            fechafin       : vista.dfFFinTarifa.getRawValue(),
                            descripcion    : vista.tfDescripTarifa.getValue(),
                        },
                        callback: function (options, success, response) {
                            responseData = Ext.decode(response.responseText);

                            //Ocultando máscara de enviar datos.
                            PVD.ocultarMascara('idmaskaddmodtipopago');

                            if (responseData.codigo == 1) {
                                mostrarMensaje(1, lbMsgExito);
                                if (!boton) {
                                    vista.ventanaTarifa.hide();

                                } else {
                                    vista.tfDenomTarifa.focus(true, 500);
                                }
                                vista.formularioTarifa.getForm().reset();
                                modelo.storeTarifa.removeAll();
                                modelo.storeTarifa.load({params: {limit: 1000, start: 0}});
                                variablesTarifa.cambio = 0;


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
         *Función para eliminar una tarifa.
         */
        function eliminarTarifa() {
            //Mostrando el mensaje para aceptar el eliminar.
            mostrarMensaje(2, idioma.lbTitleEliminarTarifa, function (btn) {
                if (btn == "ok") {
                    //Se muestra la máscara de espera.
                    PVD.mostrarMascara('idmaskeleminartipopago', idioma.lbMsgEsperaEnviarDatos, idioma.lbMsgEliminarTarifa);
                    //Enviando los datos al servidor.
                    Ext.Ajax.request({
                        url     : '/pvd/nomina/index.php/nomtarifa/eliminarTarifa',
                        method  : 'POST',
                        params  : {idtarifa: vista.smTarifa.getSelected().get('idtarifa')},
                        callback: function (options, success, response) {
                            //Se oculta la máscara de espera.
                            PVD.ocultarMascara('idmaskeleminartipopago');
                            responseData = Ext.decode(response.responseText);
                            if (responseData.codigo == 1) {
                                //Mostrando el mensaje de que se ha eliminado la tarifa.
                                mostrarMensaje(1, idioma.lbMsgCorrectoEliminadoTarifa);
                                //Recargando el grid de tarifa.
                                modelo.storeTarifa.load({params: {limit: 1000, start: 0}});

                            } else {
                                if (responseData.codigo)
                                    mostrarMensaje(responseData.codigo, idioma.lbMsgErrorTarifaUso);
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
                key      : 'imh',
                alt      : true,
                stopEvent: true,
                handler  : function (k, e) {
                    switch (k) {
                        case 73:
                        { //i para adicionar.
                            if (!vista.btnAdicionarTarifa.disabled && !vista.ventanaTarifa.isVisible()) {
                                mostrarVentanaAdicionarTarifa();
                            }
                            break;
                        }
                        case 77:
                        { //m para modificar .
                            if (!vista.btnModificarTarifa.disabled && !vista.ventanaTarifa.isVisible()) {
                                mostrarVentanaModificarTarifa();
                            }
                            break;
                        }
                        case 72:
                        { //h para ayuda.
                            if (!vista.ventanaTarifa.isVisible()) {
                                vista.btnAyudaTarifa.focus();
                                vista.btnAyudaTarifa.fireEvent('click');
                            }
                            break;
                        }
                    }
                }
            },
            {
                key: 46,//del para eliminar.
                fn : function () {
                    if (!vista.btnEliminarTarifa.disabled && !vista.ventanaTarifa.isVisible()) {
                        eliminarTarifa();
                    }
                },
            },
            {
                key: 13,//enter para aceptar.
                fn : function () {
                    if (vista.btnAceptarTarifa.isVisible()) {
                        vista.btnAceptarTarifa.focus();
                        vista.btnAceptarTarifa.fireEvent('click');
                    }
                },
            }
        ]);
    }
};

variablesGlobales.nomtarifa_js = 1;
