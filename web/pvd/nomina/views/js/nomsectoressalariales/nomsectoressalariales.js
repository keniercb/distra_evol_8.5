Ext.ns('Pvd.Nomina.Nomencladores.NomSectoresSalariales');

Pvd.Nomina.Nomencladores.NomSectoresSalariales.Panel = Ext.extend(Ext.Panel, {
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
        this.modelo = new Pvd_Nomina_Nomencladores_NomSectoresSalariales_Modelo();
        this.modelo.init();

        //Inicializando la vista.
        this.vista = new Pvd_Nomina_Nomencladores_NomSectoresSalariales_Vista();
        this.vista.init(this.perfil, this.idioma, this.modelo);

        //Inicializar controlador.
        this.controlador = new Pvd_Nomina_Nomencladores_NomSectoresSalariales_Controlador();
        this.controlador.init(this.idioma, this.vista, this.modelo);

        this.items = [this.vista.panelCentralSectSal];

        //Teclas calientes de la interfaz
        this.keyMap = this.controlador.keyMap;

        Pvd.Nomina.Nomencladores.NomSectoresSalariales.Panel.superclass.initComponent.call(this);
    },
    listeners: {
        afterlayout: function (x) {
            if (this.mostrar == 1) {
                this.modelo.storeSectSalariales.load({params: {limit: 1000, start: 0}});
                this.mostrar = 2;
            }
        },
        destroy: function (x) {
            this.keyMap.disable();
        },
    },
});

//Modelo de la vista del Nomenclador de sectores salariales.
var Pvd_Nomina_Nomencladores_NomSectoresSalariales_Modelo = function () {
    /**
     * Inicializar el modelo de la vista.
     */
    this.init = function () {

        //Store del listado de sectores salariales.
        this.storeSectSalariales = new Ext.data.Store({
            url: '/pvd/nomina/index.php/nomsectoressalariales/obtenerListadoSectoresSalariales',
            reader: new Ext.data.JsonReader(
                {totalProperty: "cantidad", autoLoad: true, root: "datos", id: "idsectorsalarial"},
                [
                    {name: 'idsectorsalarial'}
                    ,
                    {name: 'abreviatura'}
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

//Vista del componente Nomenclador de sectores salariales.
var Pvd_Nomina_Nomencladores_NomSectoresSalariales_Vista = function () {
    /**
     * Inicializar la vista.
     *
     * @param perfil Objeto que contiene el perfil de la IU (Tipo: Object).
     * @param idioma Objeto que contiene el idioma de los textos de la IU (Tipo: Object).
     * @param modelo Modelo de la vista del componente Nomenclador de sectores salariales (Tipo: Pvd_Nomina_Nomencladores_NomSectoresSalariales_Modelo).
     */
    this.init = function (perfil, idioma, modelo) {

        var self = this;

        //Listado de sectores salariales.
        function centrarValor(val) {
            if (val)
                return "<center>" + val + "</center>";
        }

        this.expanderSectSalariales = new Ext.grid.RowExpander({
            tpl: new Ext.Template(
                '<div style="word-wrap:break-word;white-space:normal;"><p>&nbsp;&nbsp;Descripci&oacute;n:&nbsp;{descripcion}</p><br/></div>'
            ), enableCaching: false
        });

        this.smSectSalariales = new Ext.grid.RowSelectionModel({
            singleSelect: true,
        });

        this.gpSectSalariales = new Ext.grid.GridPanel({
            id: 'idgpSectSalariales',
            title: idioma.lbTitleSectSalariales,
            region: 'center',
            columns: [
                {header: 'idsectorsalarial', hidden: true, hideable: false, dataIndex: 'idsectorsalarial'}
                ,
                this.expanderSectSalariales
                ,
                {
                    header: '<center>' + idioma.lbColAbreviatura + '</center>',
                    width: 67,
                    sortable: true,
                    dataIndex: 'abreviatura',
                    renderer: centrarValor
                }
                ,
                {header: idioma.lbColDenominacion, width: 500, sortable: true, dataIndex: 'denominacion'}
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
            plugins: this.expanderSectSalariales,
            viewConfig: {forceFit: true},
            store: modelo.storeSectSalariales,
            sm: this.smSectSalariales,
            loadMask: {msg: idioma.lbMaskGridCargando},
            bbar: new Ext.PagingToolbar({
                pageSize: 1000,
                store: modelo.storeSectSalariales,
                displayInfo: true,
                displayMsg: 'Mostrando  {0} - {1} de {2}',
                emptyMsg: "0 Resultado a mostrar"
            }),
        });

        //Botones de Add, Mod, Elim, Ayud de sectores salariales.
        this.btnAdicionarSectSal = new Ext.Button({
            id: 'btnAddSectSal',
            text: idioma.lbBtnAdicionar,
            tooltip: idioma.textToolTipAddSectSal,
            // icon: perfil.dirImg+'adicionar.png',
            iconCls: 'adicionar',
            prevTab: 'btnAyudaSectSal',
            nextTab: 'btnModSectSal',
        });

        this.btnModificarSectSal = new Ext.Button({
            id: 'btnModSectSal',
            text: idioma.lbBtnModificar,
            tooltip: idioma.textToolTipModSectSal,
            // icon: perfil.dirImg+'modificar.png',
            iconCls: 'modificar',
            prevTab: 'btnAddSectSal',
            nextTab: 'btnElimSectSal',
        });

        this.btnEliminarSectSal = new Ext.Button({
            id: 'btnElimSectSal',
            text: idioma.lbBtnEliminar,
            tooltip: idioma.textToolTipElimSectSal,
            // icon: perfil.dirImg+'eliminar.png',
            iconCls: 'eliminar',
            prevTab: 'btnModSectSal',
            nextTab: 'btnAyudaSectSal',
        });


        this.btnExportarSectSal = new Ext.Button({
            id: 'btnExportarSectSal',
            text: 'Exportar',
            tooltip: 'Exportar',
            iconCls: 'exportar'
        });

        this.btnAyudaSectSal = new Ext.Button({
            id: 'btnAyudaSectSal',
            text: idioma.lbBtnAyuda,
            tooltip: idioma.textToolTipAyudaSectSal,
            // icon:perfil.dirImg+'ayuda.png',
            iconCls: 'ayuda',
            prevTab: 'btnElimSectSal',
            nextTab: 'btnAddSectSal',
        });

        //Panel contenedor del grid de sectores salariales. 
        this.panelCentralSectSal = new Ext.Panel({
            id: 'panelCentralSectSal',
            region: 'center',
            heigth: '100%',
            width: '100%',
            border: false,
            layout: 'fit',
            tbar: [this.btnAdicionarSectSal, this.btnModificarSectSal, this.btnEliminarSectSal, this.btnExportarSectSal, '->', this.btnAyudaSectSal],
            items: [this.gpSectSalariales],
        });

        //Campo del formulario de sectores salariales,
        this.tfAbrevSectSal = new Ext.form.TextField({
            id: 'idtfAbrevSectSal', fieldLabel: idioma.lbColAbreviatura,
            tabIndex: 1, name: 'abreviatura', allowBlank: false,
            anchor: '90%', prevTab: 'idbtnAceptarSectSal',
            nextTab: 'idtfDenomSectSal',
            regex: /^([a-zA-ZÁÉÍÓÚáéíóúñüÑ\d]+(\d*)?)+$/,
            regexText: idioma.lbAbrevIncorr, //maskRe
            maxLength: 10,
            maxLengthText: idioma.lbMaxText_10,
            blankText: idioma.lbErrorCampoVacio
        });
        this.tfDenomSectSal = new Ext.form.TextField({
            id: 'idtfDenomSectSal', fieldLabel: idioma.lbColDenominacion,
            tabIndex: 2, name: 'denominacion', allowBlank: false, anchor: '99%',
            blankText: idioma.lbErrorCampoVacio,
//                                        regex:/^([a-zA-ZÁÉÍÓÚáéíóúñüÑ\d ]+(\d*)?)+$/,
            vtype: 'vtdenominaciones',
            regexText: idioma.lbDenomIncorr, //maskRe
            maxLength: 100,
            maxLengthText: idioma.lbMaxText_100,
            blankText: idioma.lbErrorCampoVacio,
        });
        this.dfFInicioSectSal = new Ext.form.DateField({
            id: 'dfFInicioSectSal', fieldLabel: idioma.lbColDesde,
            tabIndex: 3, name: 'fechainicio', allowBlank: false,
            format: 'd/m/Y', editable: true, readOnly: false,
            value: new Date().format('d/m/Y'), maxText: idioma.lbFechaMaxima,
            minText: idioma.lbFechaMinima, blankText: idioma.lbErrorCampoVacio,
            invalidText: idioma.invalidTextFecha, vtype: 'daterange',
            anchor: '90%', endDateField: 'dfFFinSectSal'
        });
        this.dfFFinSectSal = new Ext.form.DateField({
            id: 'dfFFinSectSal', fieldLabel: idioma.lbColHasta,
            tabIndex: 4, name: 'fechafin', xtype: 'datefield', allowBlank: true,
            format: 'd/m/Y', editable: true, readOnly: false,
            maxText: idioma.lbFechaMaxima, minText: idioma.lbFechaMinima,
            blankText: idioma.lbErrorCampoVacio, invalidText: idioma.invalidTextFecha,
            vtype: 'daterange', anchor: '99%', startDateField: 'dfFInicioSectSal'
        });
        this.tfDescripSectSal = new Ext.form.TextArea({
            id: 'idtfDescripSectSal',
            fieldLabel: idioma.lbColDescripcion, tabIndex: 5,
            name: 'descripcion', allowBlank: true,
            hiddenname: 'descripcion',
            maxLength: 255,
            maxLengthText: idioma.lbMaxText_255,
            anchor: '99%', prevTab: 'dfFFinSectSal', nextTab: 'idbtnCancelarSectSal',
            blankText: idioma.lbErrorCampoVacio,
        });

        //Formulario de sectores salariales.
        this.formularioSectSal = new Ext.FormPanel({
            id: 'idformlario',
            labelAlign: 'top',
            frame: true,
            width: 350,
            autoHeight: true,
            bodyStyle: {
                padding: '10px 10px 10px 10px',
            },
            items: [
                {
                    layout: 'column',
                    items: [
                        {columnWidth: .28, layout: 'form', items: [this.tfAbrevSectSal]},
                        {columnWidth: .72, layout: 'form', items: [this.tfDenomSectSal]},
                    ]
                },
                {
                    layout: 'column',
                    items: [
                        {columnWidth: .54, layout: 'form', items: [this.dfFInicioSectSal]},
                        {columnWidth: .46, layout: 'form', items: [this.dfFFinSectSal]}
                    ]
                },
                this.tfDescripSectSal
            ],
        });

        //Botones de la ventana de adicionar sectores salariales.
        this.btnCancelarSectSal = new Ext.Button({
            id: 'idbtnCancelarSectSal',
            iconCls: 'cancelar',
            // icon:perfil.dirImg+'cancelar.png',
            text: idioma.lbBtnCancelar,
            tooltip: idioma.textToolTipCancelar,
            prevTab: 'idtfDescripSectSal',
            nextTab: 'idbtnAplicarSectSal',
        });

        this.btnAplicarSectSal = new Ext.Button({
            id: 'idbtnAplicarSectSal',
            iconCls: 'aplicar',
            //icon:perfil.dirImg+'aplicar.png',
            text: idioma.lbBtnAplicar,
            tooltip: idioma.textToolTipAplicar,
            prevTab: 'idbtnCancelarSectSal',
            nextTab: 'idbtnAceptarSectSal',
        });

        this.btnAceptarSectSal = new Ext.Button({
            id: 'idbtnAceptarSectSal',
            iconCls: 'aceptar',
            //icon:perfil.dirImg+'aceptar.png',
            text: idioma.lbBtnAceptar,
            tooltip: idioma.textToolTipAceptar,
            prevTab: 'idbtnAplicarSectSal',
            nextTab: 'idtfAbrevSectSal',
        });

        //Ventana de adicionar y modificar sectores salariales.
        this.ventanaSectSal = new Ext.Window({
            modal: true,
            closeAction: 'hide',
            autoHeight: true,
            closable: true,
            resizable: false,
            constrain: true,
            layout: 'fit',
            autoValidate: true,
            validateDefault: true,
            items: [this.formularioSectSal],
            buttons: [this.btnCancelarSectSal, this.btnAplicarSectSal, this.btnAceptarSectSal],
            keys: [
                {
                    key: Ext.EventObject.ENTER,
                    stopEvent: true,
                    fn: function () {
                        if (!self.btnAceptarSectSal.disabled) {
                            self.btnAceptarSectSal.handler();
                        }
                    }
                },
                {
                    key: 'x',
                    alt: true,
                    stopEvent: true,
                    fn: function () {
                        if (!self.btnCancelarSectSal.disabled) {
                            self.btnCancelarSectSal.handler();
                        }
                    }
                },
                {
                    key: 'p',
                    alt: true,
                    stopEvent: true,
                    fn: function () {
                        if (!self.btnAplicarSectSal.disabled) {
                            self.btnAplicarSectSal.handler();
                        }
                    }
                }
            ]
        });
    }
};

//Controlador de la vista del Nomenclador de sectores salariales.
var Pvd_Nomina_Nomencladores_NomSectoresSalariales_Controlador = function () {
    /**
     * Inicializar el controlador de la vista.
     *
     * @param idioma Objeto que contiene el idioma de los textos de la IU (Tipo: Object).
     * @param vista Vista del componente Nomenclador de sectores salariales (Tipo: Pvd_Nomina_Nomencladores_NomSectoresSalariales_Vista)
     * @param modelo Modelo de la vista del componente Nomenclador de sectores salariales (Tipo: Pvd_Nomina_Nomencladores_NomSectoresSalariales_Modelo)
     */
    this.init = function (idioma, vista, modelo) {

        var _vista = vista;

        /**
         *Variables generales
         */
        var variablesSectSal = {
            accion: 'Add',
            cambio: 0,
        };

        //Eventos de campo de abreviatura. 
        vista.tfAbrevSectSal.on('change', function (tf, n, o) {
            variablesSectSal.cambio = 1;
        });

        //Eventos de campo de denominacion. 
        vista.tfDenomSectSal.on('change', function (tf, n, o) {
            variablesSectSal.cambio = 1;
        });

        //Eventos de campo de fecha inicio. 
        vista.dfFInicioSectSal.on('change', function (tf, n, o) {
            variablesSectSal.cambio = 1;
        });

        //Eventos de campo de fecha fin. 
        vista.dfFFinSectSal.on('change', function (tf, n, o) {
            variablesSectSal.cambio = 1;
        });

        //Eventos de campo de descripcion. 
        vista.tfDescripSectSal.on('change', function (tf, n, o) {
            variablesSectSal.cambio = 1;
        });

        //Eventos del grid de sectores salariales.
        vista.gpSectSalariales.on('rowdblclick', function (e) {
            mostrarVentanaModificar();
        });

        vista.gpSectSalariales.on('destroy', function (e) {
            vista.ventanaSectSal.destroy();
        });

        //Eventos del store de sectores salariales.
        modelo.storeSectSalariales.on('beforeload', function (store) {
            vista.btnModificarSectSal.disable();
            vista.btnEliminarSectSal.disable();
            store.removeAll();
        });

        modelo.storeSectSalariales.on('load', function (store, records, opt) {
            if (!records.length) {
                mostrarMensaje(1, idioma.lbMsgNoExistenDatos);
            }
        });

        //Eventos del seleccion model del grid.
        vista.smSectSalariales.on('rowselect', function () {
            vista.btnModificarSectSal.enable();
            vista.btnEliminarSectSal.enable();
        });

        //Eventos del botón adicionar.
        vista.btnAdicionarSectSal.setHandler(function () {
            mostrarVentanaAdicionar();
        });

        //Eventos del botón modificar.
        vista.btnModificarSectSal.setHandler(function () {
            mostrarVentanaModificar();
        });

        //Eventos del botón eliminar.
        vista.btnEliminarSectSal.setHandler(function () {
            eliminarSectorSalarial();
        });

        //Exportar
        vista.btnExportarSectSal.on('click', function () {
            var winload = new Ext.PVD.comun.window.winLoad({
                title: 'Por favor espere...',
                mensaje: 'Generando reporte'
            });
            winload.showMask();
            var iframe = document.createElement("iframe");
            iframe.src = document.location.protocol + '//' + document.location.host +
                '/pvd/nomina/index.php/nomsectoressalariales/exportarNomenclador';
            iframe.style.display = 'none';
            var that = this;
            iframe.onload = function () {
                winload.hideMask();
                //that.destroy();
            };
            document.body.appendChild(iframe);
        });

        //Eventos del botón cancelar.
        vista.btnCancelarSectSal.setHandler(function () {
            vista.ventanaSectSal.hide();
//            vista.formularioSectSal.purgeListeners();
        });

        //Eventos del botón aplicar.
        vista.btnAplicarSectSal.setHandler(function () {
            salvarFormulario(true);
        });

        //Eventos del botón aceptar.
        vista.btnAceptarSectSal.setHandler(function () {
            salvarFormulario(false);
//            vista.formularioSectSal.purgeListeners();
        });

        //Evento de la ventana de adicionar/modificar.
        vista.ventanaSectSal.on('beforeshow', function (ventana) {
            vista.formularioSectSal.getForm().reset();
            vista.tfAbrevSectSal.focus(true, 500);
        });

        /*
         *Función de mostrar la ventana de adicionar.
         */
        function mostrarVentanaAdicionar() {
            vista.ventanaSectSal.setTitle(idioma.lbTitleVentAdicionarSectSal);
            vista.btnAplicarSectSal.show();
            vista.ventanaSectSal.show();
            //Actualizar la tabulación deL formulario.
            vista.btnCancelarSectSal.setNextElement('idbtnAplicarSectSal');
            vista.btnAceptarSectSal.setPreviousElement('idbtnAplicarSectSal');
            variablesSectSal.accion = 'Add';
        }

        /*
         *Función de mostrar la ventana de modificar.
         */
        function mostrarVentanaModificar() {
            vista.ventanaSectSal.setTitle(idioma.lbTitleVentModificarSectSal);
            vista.btnAplicarSectSal.hide();
            vista.ventanaSectSal.show();
            //Actualizar la tabulación deL formulario.
            vista.btnCancelarSectSal.setNextElement('idbtnAceptarSectSal');
            vista.btnAceptarSectSal.setPreviousElement('idbtnCancelarSectSal');
            vista.formularioSectSal.getForm().loadRecord(vista.smSectSalariales.getSelected());
//            vista.formularioSectSal.addListener('clientvalidation', function (_form, _valid) {
//                if (comparar(vista.formularioSectSal.getForm().getValues(), vista.smSectSalariales.getSelected().data)) {
//                    vista.btnAceptarSectSal.setDisabled(true);
//                } else {
//                    vista.btnAceptarSectSal.enable();
//                }
//            });
            variablesSectSal.accion = 'Mod';
        }

        /*
         *Función para adicionar/modificar un sector salarial.
         */
        function salvarFormulario(boton) {
            var urlAction = '/pvd/nomina/index.php/nomsectoressalariales/adicionarSectorSalarial';
            var idsectorsalarial = 0;
            var lbMsgEspera = idioma.lbMsgAdicionarSectSal;
            var lbMsgExito = idioma.lbMsgCorrectoAdicionadoSectSal;

            if (variablesSectSal.accion == 'Mod') {
                lbMsgEspera = idioma.lbMsgModificarSectSal;
                lbMsgExito = idioma.lbMsgCorrectoModificadoSectSal;
                urlAction = '/pvd/nomina/index.php/nomsectoressalariales/modificarSectorSalarial';
                idsectorsalarial = vista.smSectSalariales.getSelected().get('idsectorsalarial');
            }
            if (variablesSectSal.cambio == 0) {
                if (variablesSectSal.accion == 'Mod') {
                    //Se oculta la ventana si no ha sido modificado ningún valor.
                    vista.ventanaSectSal.hide();
                } else {
                    //Se marcan como obligatorios en caso de presionar aceptar y se encuentren vacíos.
                    vista.tfAbrevSectSal.markInvalid(idioma.lbErrorCampoVacio);
                    vista.tfDenomSectSal.markInvalid(idioma.lbErrorCampoVacio);
                    mostrarMensaje(3, idioma.lbErrorFormulario);
                }
            } else {
                //Se verifica si el formulario es válido y si el campo sueldo contiene un valor.
                if (vista.formularioSectSal.getForm().isValid()) {

                    //Se muestra la máscara de espera.
                    PVD.mostrarMascara('idmaskaddmodsector', idioma.lbMsgEsperaEnviarDatos, lbMsgEspera);

                    //Enviando datos al servidor.
                    Ext.Ajax.request({
                        url: urlAction,
                        method: 'POST',
                        params: {
                            idsector: idsectorsalarial,
                            abreviatura: vista.tfAbrevSectSal.getValue(),
                            denominacion: vista.tfDenomSectSal.getValue(),
                            fechainicio: vista.dfFInicioSectSal.getRawValue(),
                            fechafin: vista.dfFFinSectSal.getRawValue(),
                            descripcion: vista.tfDescripSectSal.getValue(),
                        },
                        callback: function (options, success, response) {
                            responseData = Ext.decode(response.responseText);

                            //Ocultando máscara de enviar datos.
                            PVD.ocultarMascara('idmaskaddmodsector');

                            if (responseData.codigo == 1) {
                                mostrarMensaje(1, lbMsgExito);
                                if (!boton) {
                                    vista.ventanaSectSal.hide();

                                } else {
                                    vista.tfAbrevSectSal.focus(true, 500);
                                }
                                vista.formularioSectSal.getForm().reset();
                                modelo.storeSectSalariales.removeAll();
                                modelo.storeSectSalariales.load({params: {limit: 1000, start: 0}});
                                variablesSectSal.cambio = 0;


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
         *Función para eliminar un sector salarial.
         */
        function eliminarSectorSalarial() {
            //Mostrando el mensaje para aceptar la eliminar un sector salarial.
            mostrarMensaje(2, idioma.lbTitleEliminarSectSal, function (btn) {
                if (btn == "ok") {

                    //Se muestra la máscara de espera.
                    PVD.mostrarMascara('idmaskeleminarsector', idioma.lbMsgEsperaEnviarDatos, idioma.lbMsgEliminarSectSal);

                    //Enviando los datos al servidor.
                    Ext.Ajax.request({
                        url: '/pvd/nomina/index.php/nomsectoressalariales/eliminarSectorSalarial',
                        method: 'POST',
                        params: {idsector: vista.smSectSalariales.getSelected().get('idsectorsalarial')},
                        callback: function (options, success, response) {
                            //Se oculta la máscara de espera.
                            PVD.ocultarMascara('idmaskeleminarsector');
                            responseData = Ext.decode(response.responseText);
                            if (responseData.codigo == 1) {
                                //Mostrando el mensaje de que se ha eliminado el sector.
                                mostrarMensaje(1, idioma.lbMsgCorrectoEliminadoSectSal);
                                //Recargando el grid de sectores salariales.
                                modelo.storeSectSalariales.load({params: {limit: 1000, start: 0}});

                            } else {
                                if (responseData.codigo)
                                    mostrarMensaje(responseData.codigo, idioma.lbMsgErrorSectorSalUso);
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
                            if (!vista.btnAdicionarSectSal.disabled && !vista.ventanaSectSal.isVisible()) {
                                mostrarVentanaAdicionar();
                            }
                            break;
                        }
                        case 77: { //m para modificar .
                            if (!vista.btnModificarSectSal.disabled && !vista.ventanaSectSal.isVisible()) {
                                mostrarVentanaModificar();
                            }
                            break;
                        }
                        case 72: { //h para ayuda.
                            if (!vista.ventanaSectSal.isVisible()) {
                                vista.btnAyudaSectSal.focus();
                                vista.btnAyudaSectSal.fireEvent('click');
                            }
                            break;
                        }
                    }
                }
            },
            {
                key: 46,//del para eliminar.
                fn: function () {
                    if (!vista.btnEliminarSectSal.disabled && !vista.ventanaSectSal.isVisible()) {
                        eliminarSectorSalarial();
                    }
                },
            },
            {
                key: 13,//enter para aceptar.
                fn: function () {
                    if (vista.btnAceptarSectSal.isVisible()) {
                        vista.btnAceptarSectSal.focus();
                        vista.btnAceptarSectSal.fireEvent('click');
                    }
                },
            }
        ]);
    }
};

variablesGlobales.nomsectoressalariales_js = 1;
