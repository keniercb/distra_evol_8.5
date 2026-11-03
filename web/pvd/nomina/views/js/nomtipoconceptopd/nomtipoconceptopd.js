Ext.ns('Pvd.Nomina.Nomencladores.NomTipoConceptoPD');

Pvd.Nomina.Nomencladores.NomTipoConceptoPD.Panel = Ext.extend(Ext.Panel, {
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
        this.modelo = new Pvd_Nomina_Nomencladores_NomTipoConceptoPD_Modelo();
        this.modelo.init();

        //Inicializando la vista.
        this.vista = new Pvd_Nomina_Nomencladores_NomTipoConceptoPD_Vista();
        this.vista.init(this.perfil, this.idioma, this.modelo);

        //Inicializar controlador.
        this.controlador = new Pvd_Nomina_Nomencladores_NomTipoConceptoPD_Controlador();
        this.controlador.init(this.idioma, this.vista, this.modelo);

        this.items = [this.vista.panelCentralTConceptPD];

        //Teclas calientes de la interfaz
        this.keyMap = this.controlador.keyMap;

        Pvd.Nomina.Nomencladores.NomTipoConceptoPD.Panel.superclass.initComponent.call(this);
    },
    listeners: {
        afterlayout: function (x) {
            if (this.mostrar == 1) {
                this.modelo.storeTConceptPD.load({params: {limit: 1000, start: 0}});
                this.mostrar = 2;
            }
        },
        destroy: function (x) {
            this.keyMap.disable();
        },
    },
});

//Modelo de la vista del Nomenclador de tipos de conceptos de percepciones y descuentos.
var Pvd_Nomina_Nomencladores_NomTipoConceptoPD_Modelo = function () {
    /**
     * Inicializar el modelo de la vista.
     */
    this.init = function () {

        //Store del listado de tipos de conceptos de percepciones y descuentos.
        this.storeTConceptPD = new Ext.data.Store({
            url: '/pvd/nomina/index.php/nomtipoconceptopd/obtenerListadoTiposConceptoPD',
            reader: new Ext.data.JsonReader(
                {totalProperty: "cantidad", autoLoad: true, root: "datos", id: "idtipoconceptopd"},
                [
                    {name: 'idtipoconceptopd'}
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

//Vista del componente Nomenclador de tipos de conceptos de percepciones y descuentos.
var Pvd_Nomina_Nomencladores_NomTipoConceptoPD_Vista = function () {
    /**
     * Inicializar la vista.
     *
     * @param perfil Objeto que contiene el perfil de la IU (Tipo: Object).
     * @param idioma Objeto que contiene el idioma de los textos de la IU (Tipo: Object).
     * @param modelo Modelo de la vista del componente Nomenclador de tipos de conceptos
     *  de percepciones y descuentos (Tipo: Pvd_Nomina_Nomencladores_NomTipoConceptoPD_Modelo).
     */
    this.init = function (perfil, idioma, modelo) {

        var self = this;

        //Listado de tipos de conceptos de percepciones y descuentos.
        function centrarValor(val) {
            if (val)
                return "<center>" + val + "</center>";
        }

        this.expanderTConceptPD = new Ext.grid.RowExpander({
            tpl: new Ext.Template(
                '<div style="word-wrap:break-word;white-space:normal;"><p>&nbsp;&nbsp;Descripci&oacute;n:&nbsp;{descripcion}</p><br/></div>'
            ), enableCaching: false
        });

        this.smTConceptPD = new Ext.grid.RowSelectionModel({
            singleSelect: true,
        });

        this.gpTConceptPD = new Ext.grid.GridPanel({
            id: 'idgpTConceptPD',
            title: idioma.lbTitleTConceptPD,
            region: 'center',
            columns: [
                {header: 'idtipoconceptopd', hidden: true, hideable: false, dataIndex: 'idtipoconceptopd'}
                ,
                this.expanderTConceptPD
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
            viewConfig: {forceFit: true},
            store: modelo.storeTConceptPD,
            sm: this.smTConceptPD,
            plugins: this.expanderTConceptPD,
            loadMask: {msg: idioma.lbMaskGridCargando},
            bbar: new Ext.PagingToolbar({
                pageSize: 1000,
                store: modelo.storeTConceptPD,
                displayInfo: true,
                displayMsg: 'Mostrando  {0} - {1} de {2}',
                emptyMsg: "0 Resultado a mostrar"
            }),
        });

        //Botones de Add, Mod, Elim, Ayud de tipos de conceptos de percepciones y descuentos.
        this.btnAdicionarTConceptPD = new Ext.Button({
            id: 'btnAddTConceptPD',
            text: idioma.lbBtnAdicionar,
            tooltip: idioma.textToolTipAddTConceptPD,
            //  icon: perfil.dirImg+'adicionar.png',
            iconCls: 'adicionar',
            prevTab: 'btnAyudaTConceptPD',
            nextTab: 'btnModTConceptPD',
        });

        this.btnModificarTConceptPD = new Ext.Button({
            id: 'btnModTConceptPD',
            text: idioma.lbBtnModificar,
            tooltip: idioma.textToolTipModTConceptPD,
            //  icon: perfil.dirImg+'modificar.png',
            iconCls: 'modificar',
            prevTab: 'btnAddTConceptPD',
            nextTab: 'btnElimTConceptPD',
        });

        this.btnEliminarTConceptPD = new Ext.Button({
            id: 'btnElimTConceptPD',
            text: idioma.lbBtnEliminar,
            tooltip: idioma.textToolTipElimTConceptPD,
            //  icon: perfil.dirImg+'eliminar.png',
            iconCls: 'eliminar',
            prevTab: 'btnModTConceptPD',
            nextTab: 'btnAyudaTConceptPD',
        });

        this.btnExportarTConceptPD = new Ext.Button({
            id: 'btnExportarTConceptPD',
            text: 'Exportar',
            tooltip: 'Exportar',
            iconCls: 'exportar'
        });

        this.btnAyudaTConceptPD = new Ext.Button({
            id: 'btnAyudaTConceptPD',
            text: idioma.lbBtnAyuda,
            tooltip: idioma.textToolTipAyudaTConceptPD,
            iconCls: 'ayuda',
            prevTab: 'btnElimTConceptPD',
            nextTab: 'btnAddTConceptPD',
        });

        //Panel contenedor general del grid de tipos de conceptos de percepciones y descuentos. 
        this.panelCentralTConceptPD = new Ext.Panel({
            id: 'idpanelCentralTConceptPD',
            region: 'center',
            heigth: '100%',
            width: '100%',
            border: false,
            layout: 'fit',
            tbar: [this.btnAdicionarTConceptPD, this.btnModificarTConceptPD, this.btnEliminarTConceptPD, this.btnExportarTConceptPD, '->', this.btnAyudaTConceptPD],
            items: [this.gpTConceptPD],
        });

        //Campos del formulario de tipos de conceptos de percepciones y descuentos.
        this.tfDenomTConceptPD = new Ext.form.TextField({
            id: 'idtfDenomTConceptPD', fieldLabel: idioma.lbColDenominacion,
            tabIndex: 2, name: 'denominacion', allowBlank: false, anchor: '99%',
            blankText: idioma.lbErrorCampoVacio, prevTab: 'idbtnAceptarTConceptPD',
//										regex:/^([a-zA-ZÁÉÍÓÚáéíóúñüÑ\d ]+(\d*)?)+$/,
            vtype: 'vtdenominaciones',
            regexText: idioma.lbDenomIncorr, //maskRe
            maxLength: 100,
            maxLengthText: idioma.lbMaxText_100,
        });

        this.dfFInicioTConceptPD = new Ext.form.DateField({
            id: 'iddfFInicioTConceptPD', fieldLabel: idioma.lbColDesde,
            tabIndex: 3, name: 'fechainicio', allowBlank: false,
            format: 'd/m/Y', editable: true, readOnly: false,
            value: new Date().format('d/m/Y'), maxText: idioma.lbFechaMaxima,
            minText: idioma.lbFechaMinima, blankText: idioma.lbErrorCampoVacio,
            invalidText: idioma.invalidTextFecha, vtype: 'daterange',
            anchor: '90%', endDateField: 'iddfFFinTConceptPD'
        });

        this.dfFFinTConceptPD = new Ext.form.DateField({
            id: 'iddfFFinTConceptPD', fieldLabel: idioma.lbColHasta,
            tabIndex: 4, name: 'fechafin', xtype: 'datefield', allowBlank: true,
            format: 'd/m/Y', editable: true, readOnly: false,
            maxText: idioma.lbFechaMaxima, minText: idioma.lbFechaMinima,
            blankText: idioma.lbErrorCampoVacio, invalidText: idioma.invalidTextFecha,
            vtype: 'daterange', anchor: '99%', startDateField: 'iddfFInicioTConceptPD'
        });

        this.tfDescripTConceptPD = new Ext.form.TextArea({
            id: 'idtfDescripTConceptPD',
            fieldLabel: idioma.lbColDescripcion, tabIndex: 5,
            name: 'descripcion', allowBlank: true,
            hiddenname: 'descripcion',
            maxLength: 255,
            maxLengthText: idioma.lbMaxText_255,
            anchor: '99%', prevTab: 'iddfFFinTConceptPD', nextTab: 'idbtnCancelarTConceptPD',
            blankText: idioma.lbErrorCampoVacio,
        });

        //Formulario de tipos de conceptos de percepciones y descuentos.
        this.formularioTConceptPD = new Ext.FormPanel({
            id: 'idformlarioTConceptPD',
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
                        {columnWidth: .99, layout: 'form', items: [this.tfDenomTConceptPD]},
                    ]
                },
                {
                    layout: 'column',
                    items: [
                        {columnWidth: .54, layout: 'form', items: [this.dfFInicioTConceptPD]},
                        {columnWidth: .46, layout: 'form', items: [this.dfFFinTConceptPD]}
                    ]
                },
                this.tfDescripTConceptPD
            ],
        });

        //Botones de la ventana de tipos de conceptos de percepciones y descuentos.
        this.btnCancelarTConceptPD = new Ext.Button({
            id: 'idbtnCancelarTConceptPD',
            iconCls: 'cancelar',
            // icon:perfil.dirImg+'cancelar.png',
            text: idioma.lbBtnCancelar,
            tooltip: idioma.textToolTipCancelar,
            prevTab: 'idtfDescripTConceptPD',
            nextTab: 'idbtnAplicarTConceptPD',
        });

        this.btnAplicarTConceptPD = new Ext.Button({
            id: 'idbtnAplicarTConceptPD',
            iconCls: 'aplicar',
            // icon:perfil.dirImg+'aplicar.png',
            text: idioma.lbBtnAplicar,
            tooltip: idioma.textToolTipAplicar,
            prevTab: 'idbtnCancelarTConceptPD',
            nextTab: 'idbtnAceptarTConceptPD',
        });

        this.btnAceptarTConceptPD = new Ext.Button({
            id: 'idbtnAceptarTConceptPD',
            iconCls: 'aceptar',
            //  icon:perfil.dirImg+'aceptar.png',
            text: idioma.lbBtnAceptar,
            tooltip: idioma.textToolTipAceptar,
            prevTab: 'idbtnAplicarTConceptPD',
            nextTab: 'idtfDenomTConceptPD',
        });

        //Ventana de adicionar y modificar tipos de conceptos de percepciones y descuentos.
        this.ventanaTConceptPD = new Ext.Window({
            modal: true,
            closeAction: 'hide',
            autoHeight: true,
            closable: true,
            resizable: false,
            autoValidate: true,
            validateDefault: true,
            layout: 'fit',
            constrain: true,
            items: [this.formularioTConceptPD],
            buttons: [this.btnCancelarTConceptPD, this.btnAplicarTConceptPD, this.btnAceptarTConceptPD],
            keys: [
                {
                    key: Ext.EventObject.ENTER,
                    stopEvent: true,
                    fn: function () {
                        if (!self.btnAceptarTConceptPD.disabled) {
                            self.btnAceptarTConceptPD.handler();
                        }
                    }
                },
                {
                    key: 'x',
                    alt: true,
                    stopEvent: true,
                    fn: function () {
                        if (!self.btnCancelarTConceptPD.disabled) {
                            self.btnCancelarTConceptPD.handler();
                        }
                    }
                },
                {
                    key: 'p',
                    alt: true,
                    stopEvent: true,
                    fn: function () {
                        if (!self.btnAplicarTConceptPD.disabled) {
                            self.btnAplicarTConceptPD.handler();
                        }
                    }
                }
            ]
        });
    }
};

//Controlador de la vista del Nomenclador de tipos de conceptos de percepciones y descuentos.
var Pvd_Nomina_Nomencladores_NomTipoConceptoPD_Controlador = function () {
    /**
     * Inicializar el controlador de la vista.
     *
     * @param idioma Objeto que contiene el idioma de los textos de la IU (Tipo: Object).
     * @param vista Vista del componente Nomenclador de tipos de conceptos de percepciones y descuentos.
     * (Tipo: Pvd_Nomina_Nomencladores_NomTipoConceptoPD_Vista)
     * @param modelo Modelo de la vista del componente Nomenclador de tipos de conceptos de percepciones y descuentos.
     * (Tipo: Pvd_Nomina_Nomencladores_NomTipoConceptoPD_Modelo)
     */
    this.init = function (idioma, vista, modelo) {
        var _vista = vista;
        /**
         *Variables generales.
         */
        var variablesTConceptPD = {
            accion: 'Add',
            cambio: 0,
        };

        //Eventos del grid de tipos de conceptos de percepciones y descuentos.
        vista.gpTConceptPD.on('rowdblclick', function (e) {
            mostrarVentanaModificarTConceptPD();
        });

        vista.gpTConceptPD.on('destroy', function (e) {
            vista.ventanaTConceptPD.destroy();
        });

        //Eventos del store de tipos de conceptos de percepciones y descuentos.
        modelo.storeTConceptPD.on('beforeload', function (store) {
            vista.btnModificarTConceptPD.disable();
            vista.btnEliminarTConceptPD.disable();
            store.removeAll();
        });

        modelo.storeTConceptPD.on('load', function (store, records, opt) {
            if (!records.length) {
                mostrarMensaje(1, idioma.lbMsgNoExistenDatos);
            }
        });

        //Eventos del seleccion model del grid de tipos de conceptos de percepciones y descuentos.
        vista.smTConceptPD.on('rowselect', function () {
            vista.btnModificarTConceptPD.enable();
            vista.btnEliminarTConceptPD.enable();
        });

        //Eventos de campo de denominacion. 
        vista.tfDenomTConceptPD.on('change', function (tf, n, o) {
            variablesTConceptPD.cambio = 1;
        });

        //Eventos de campo de fecha inicio. 
        vista.dfFInicioTConceptPD.on('change', function (tf, n, o) {
            variablesTConceptPD.cambio = 1;
        });

        //Eventos de campo de fecha fin. 
        vista.dfFFinTConceptPD.on('change', function (tf, n, o) {
            variablesTConceptPD.cambio = 1;
        });

        //Eventos de campo de descripcion. 
        vista.tfDescripTConceptPD.on('change', function (tf, n, o) {
            variablesTConceptPD.cambio = 1;
        });

        //Eventos del botón adicionar tipos de conceptos de percepciones y descuentos.
        vista.btnAdicionarTConceptPD.setHandler(function () {
            mostrarVentanaAdicionarTConceptPD();
        });

        //Eventos del botón modificar tipos de conceptos de percepciones y descuentos.
        vista.btnModificarTConceptPD.setHandler(function () {
            mostrarVentanaModificarTConceptPD();
        });

        //Eventos del botón eliminar tipos de conceptos de percepciones y descuentos.
        vista.btnEliminarTConceptPD.setHandler(function () {
            eliminarTipoConceptoPD();
        });

        //Exportar
        vista.btnExportarTConceptPD.on('click', function () {
            var winload = new Ext.PVD.comun.window.winLoad({
                title: 'Por favor espere...',
                mensaje: 'Generando reporte'
            });
            winload.showMask();
            var iframe = document.createElement("iframe");
            iframe.src = document.location.protocol + '//' + document.location.host +
                '/pvd/nomina/index.php/nomtipoconceptopd/exportarNomenclador';
            iframe.style.display = 'none';
            var that = this;
            iframe.onload = function () {
                winload.hideMask();
                //that.destroy();
            };
            document.body.appendChild(iframe);
        });

        //Eventos del botón cancelar tipos de conceptos de percepciones y descuentos.
        vista.btnCancelarTConceptPD.setHandler(function () {
            vista.ventanaTConceptPD.hide();
//            vista.formularioTConceptPD.purgeListeners();
        });

        //Eventos del botón aplicar tipos de conceptos de percepciones y descuentos.
        vista.btnAplicarTConceptPD.setHandler(function () {
            salvarFormularioTConceptPD(true);
        });

        //Eventos del botón aceptar tipos de conceptos de percepciones y descuentos.
        vista.btnAceptarTConceptPD.setHandler(function () {
            salvarFormularioTConceptPD(false);
//            vista.formularioTConceptPD.purgeListeners();
        });

        //Evento de la ventana de adicionar/modificar tipos de conceptos de percepciones y descuentos.
        vista.ventanaTConceptPD.on('beforeshow', function (ventana) {
            vista.formularioTConceptPD.getForm().reset();
            vista.tfDenomTConceptPD.focus(true, 500);
        });

        /*
         *Función de mostrar la ventana de adicionar tipos de conceptos de percepciones y descuentos.
         */
        function mostrarVentanaAdicionarTConceptPD() {
            vista.ventanaTConceptPD.setTitle(idioma.lbTitleVentAdicionarTConceptPD);
            vista.btnAplicarTConceptPD.show();
            vista.ventanaTConceptPD.show();
            //Actualizar la tabulación deL formulario.
            vista.btnCancelarTConceptPD.setNextElement('idbtnAplicarTConceptPD');
            vista.btnAceptarTConceptPD.setPreviousElement('idbtnAplicarTConceptPD');
            variablesTConceptPD.accion = 'Add';
        }

        /*
         *Función de mostrar la ventana de modificar tipos de conceptos de percepciones y descuentos.
         */
        function mostrarVentanaModificarTConceptPD() {
            vista.ventanaTConceptPD.setTitle(idioma.lbTitleVentModificarTConceptPD);
            vista.btnAplicarTConceptPD.hide();
            vista.ventanaTConceptPD.show();
            //Actualizar la tabulación deL formulario.
            vista.btnCancelarTConceptPD.setNextElement('idbtnAceptarTConceptPD');
            vista.btnAceptarTConceptPD.setPreviousElement('idbtnCancelarTConceptPD');
            vista.formularioTConceptPD.getForm().loadRecord(vista.smTConceptPD.getSelected());
//            vista.formularioTConceptPD.addListener('clientvalidation', function (_form, _valid) {
//                if (comparar(vista.formularioTConceptPD.getForm().getValues(), vista.smTConceptPD.getSelected().data)) {
//                    vista.btnAceptarTConceptPD.setDisabled(true);
//                } else {
//                    vista.btnAceptarTConceptPD.enable();
//                }
//            });
            variablesTConceptPD.accion = 'Mod';
        }

        /*
         *Función para adicionar/modificar un tipo de concepto de percepciones y descuentos.
         */
        function salvarFormularioTConceptPD(boton) {

            var urlAction = '/pvd/nomina/index.php/nomtipoconceptopd/adicionarTipoConceptoPD';
            var idtipoconceptopd = 0;
            var lbMsgEspera = idioma.lbMsgAdicionarTConceptPD;
            var lbMsgExito = idioma.lbMsgCorrectoAdicionadoTConceptPD;
            //Validar que hubo algún cambio en el formulario modificar, al presionar la tecla Enter
            fnValidarCambios();

            if (variablesTConceptPD.accion == 'Mod') {
                lbMsgEspera = idioma.lbMsgModificarTConceptPD;
                lbMsgExito = idioma.lbMsgCorrectoModificadoTConceptPD;
                urlAction = '/pvd/nomina/index.php/nomtipoconceptopd/modificarTipoConceptoPD';
                idtipoconceptopd = vista.smTConceptPD.getSelected().get('idtipoconceptopd');
            }
            /*console.info(variablesTConceptPD.accion);
            console.info(variablesTConceptPD.cambio);return;*/
            if (variablesTConceptPD.cambio == 0) {
                if (variablesTConceptPD.accion == 'Mod') {
                    //Se oculta la ventana si no ha sido modificado ningún valor.
                    vista.ventanaTConceptPD.hide();
                } else {
                    //Se marcan como obligatorios en caso de presionar aceptar y se encuentren vacíos.
                    vista.tfDenomTConceptPD.markInvalid(idioma.lbErrorCampoVacio);
                    mostrarMensaje(3, idioma.lbErrorFormulario);
                }
            } else {
                //Se verifica si el formulario es válido y si el campo sueldo contiene un valor
                if (vista.formularioTConceptPD.getForm().isValid()) {

                    //Se muestra la máscara de espera.
                    PVD.mostrarMascara('idmaskaddmodtconceptopd', idioma.lbMsgEsperaEnviarDatos, lbMsgEspera);

                    //Enviando datos al servidor.
                    Ext.Ajax.request({
                        url: urlAction,
                        method: 'POST',
                        params: {
                            idtipoconceptopd: idtipoconceptopd,
                            denominacion: vista.tfDenomTConceptPD.getValue(),
                            fechainicio: vista.dfFInicioTConceptPD.getRawValue(),
                            fechafin: vista.dfFFinTConceptPD.getRawValue(),
                            descripcion: vista.tfDescripTConceptPD.getValue(),
                        },
                        callback: function (options, success, response) {
                            responseData = Ext.decode(response.responseText);

                            //Ocultando máscara de enviar datos.
                            PVD.ocultarMascara('idmaskaddmodtconceptopd');

                            if (responseData.codigo == 1) {
                                mostrarMensaje(1, lbMsgExito);
                                if (!boton) {
                                    vista.ventanaTConceptPD.hide();

                                } else {
                                    vista.tfDenomTConceptPD.focus(true, 500);
                                }
                                vista.formularioTConceptPD.getForm().reset();
                                modelo.storeTConceptPD.removeAll();
                                modelo.storeTConceptPD.load({params: {limit: 1000, start: 0}});
                                variablesTConceptPD.cambio = 0;


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

        //Validar que existan cambios al presionar la tecla caliente en la ventana de Adicionar y Modificar concepto
        function fnValidarCambios() {
            variablesTConceptPD.cambio = (vista.tfDenomTConceptPD.startValue != vista.tfDenomTConceptPD.getValue()) ? 1 : 0;
            variablesTConceptPD.cambio = (vista.dfFInicioTConceptPD.startValue != vista.dfFInicioTConceptPD.getValue()) ? 1 : 0;
            variablesTConceptPD.cambio = (vista.dfFFinTConceptPD.startValue != vista.dfFFinTConceptPD.getValue()) ? 1 : 0;
            variablesTConceptPD.cambio = (vista.tfDescripTConceptPD.startValue != vista.tfDescripTConceptPD.getValue()) ? 1 : 0;
        }

        /*
         *Función para eliminar un tipo de concepto de percepciones y descuentos.
         */
        function eliminarTipoConceptoPD() {
            //Mostrando el mensaje para aceptar el eliminar.
            mostrarMensaje(2, idioma.lbTitleEliminarTConceptPD, function (btn) {
                if (btn == "ok") {
                    //Se muestra la máscara de espera.
                    PVD.mostrarMascara('idmaskeleminartconceptpd', idioma.lbMsgEsperaEnviarDatos, idioma.lbMsgEliminarTConceptPD);
                    //Enviando los datos al servidor.
                    Ext.Ajax.request({
                        url: '/pvd/nomina/index.php/nomtipoconceptopd/eliminarTipoConceptoPD',
                        method: 'POST',
                        params: {idtipoconceptopd: vista.gpTConceptPD.getSelectionModel().getSelected().get('idtipoconceptopd')},
                        callback: function (options, success, response) {
                            //Se oculta la máscara de espera.
                            PVD.ocultarMascara('idmaskeleminartconceptpd');
                            responseData = Ext.decode(response.responseText);
                            if (responseData.codigo == 1) {
                                //Mostrando el mensaje de que se ha el tipo de concepto de percepciones y descuentos.
                                mostrarMensaje(1, idioma.lbMsgCorrectoEliminadoTConceptPD);
                                //Recargando el grid de tipos de conceptos de percepciones y descuentos.
                                modelo.storeTConceptPD.load({params: {limit: 1000, start: 0}});

                            } else {
                                if (responseData.codigo)
                                    mostrarMensaje(responseData.codigo, idioma.lbMsgErrorConceptoPDUso);
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
                            if (!vista.btnAdicionarTConceptPD.disabled && !vista.ventanaTConceptPD.isVisible()) {
                                mostrarVentanaAdicionarTConceptPD();
                            }
                            break;
                        }
                        case 77: { //m para modificar .
                            if (!vista.btnModificarTConceptPD.disabled && !vista.ventanaTConceptPD.isVisible()) {
                                mostrarVentanaModificarTConceptPD();
                            }
                            break;
                        }
                        case 72: { //h para ayuda.
                            if (!vista.ventanaTConceptPD.isVisible()) {
                                vista.btnAyudaTConceptPD.focus();
                                vista.btnAyudaTConceptPD.fireEvent('click');
                            }
                            break;
                        }
                    }
                }
            },
            {
                key: 46,//del para eliminar.
                fn: function () {
                    if (!vista.btnEliminarTConceptPD.disabled && !vista.ventanaTConceptPD.isVisible()) {
                        eliminarTipoConceptoPD();
                    }
                },
            },
            {
                key: 13,//enter para aceptar.
                fn: function () {
                    if (vista.btnAceptarTConceptPD.isVisible()) {
                        vista.btnAceptarTConceptPD.focus();
                        vista.btnAceptarTConceptPD.fireEvent('click');
                    }
                },
            }
        ]);
    }
};

variablesGlobales.nomtipoconceptopd_js = 1;
