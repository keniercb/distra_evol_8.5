Ext.ns('Pvd.Nomina.Nomencladores.NomCausasExclusionNomina');

Pvd.Nomina.Nomencladores.NomCausasExclusionNomina.Panel = Ext.extend(Ext.Panel, {
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
        this.modelo = new Pvd_Nomina_Nomencladores_NomCausasExclusionNomina_Modelo();
        this.modelo.init();

        //Inicializando la vista.
        this.vista = new Pvd_Nomina_Nomencladores_NomCausasExclusionNomina_Vista();
        this.vista.init(this.perfil, this.idioma, this.modelo);

        //Inicializar controlador.
        this.controlador = new Pvd_Nomina_Nomencladores_NomCausasExclusionNomina_Controlador();
        this.controlador.init(this.idioma, this.vista, this.modelo);

        this.items = [this.vista.panelCentralCausasExclusionNomina];

        //Teclas calientes de la interfaz
        this.keyMap = this.controlador.keyMap;

        Pvd.Nomina.Nomencladores.NomCausasExclusionNomina.Panel.superclass.initComponent.call(this);
    },
    listeners: {
        afterlayout: function (x) {
            if (this.mostrar == 1) {
                this.modelo.storeCausasExclusionNomina.load({params: {limit: 1000, start: 0}});
                this.mostrar = 2;
            }
        },
        destroy: function (x) {
            this.keyMap.disable();
        },
    },
});

//Modelo de la vista del Nomenclador de causas de exclusión.
var Pvd_Nomina_Nomencladores_NomCausasExclusionNomina_Modelo = function () {
    /**
     * Inicializar el modelo de la vista.
     */
    this.init = function () {

        //Store del listado de causas de exclusión.
        this.storeCausasExclusionNomina = new Ext.data.Store({
            url: '/pvd/nomina/index.php/nomcausasexclusionnomina/obtenerListadoCausasExclusionNomina',
            reader: new Ext.data.JsonReader(
                {totalProperty: "cantidad", autoLoad: true, root: "datos", id: "idcausaexclusion"},
                [{name: 'idcausaexclusion'}
                    , {name: 'denominacion'}
                    , {name: 'fechainicio'}
                    , {name: 'fechafin'}
                    , {name: 'descripcion'}
                ])
        });
    }
};

//Vista del componente Nomenclador de causas de exclusión.
var Pvd_Nomina_Nomencladores_NomCausasExclusionNomina_Vista = function () {
    /**
     * Inicializar la vista.
     *
     * @param perfil Objeto que contiene el perfil de la IU (Tipo: Object).
     * @param idioma Objeto que contiene el idioma de los textos de la IU (Tipo: Object).
     * @param modelo Modelo de la vista del componente Nomenclador de causas de exclusión (Tipo: Pvd_Nomina_Nomencladores_NomCausasExclusionNomina_Modelo).
     */
    this.init = function (perfil, idioma, modelo) {

        var self = this;

        //Listado de causas de exclusión.
        function centrarValor(val) {
            if (val)
                return "<center>" + val + "</center>";
        }

        this.expanderCausasExclusionNomina = new Ext.grid.RowExpander({
            tpl: new Ext.Template(
                '<div style="word-wrap:break-word;white-space:normal;"><p>&nbsp;&nbsp;Descripci&oacute;n:&nbsp;{descripcion}</p><br/></div>'
            ), enableCaching: false
        });

        this.smCausasExclusionNomina = new Ext.grid.RowSelectionModel({
            singleSelect: true,
        });

        this.gpCausasExclusionNomina = new Ext.grid.GridPanel({
            id: 'gpCausasExclusionNomina',
            title: idioma.lbTitleCausasExclusionNomina,
            region: 'center',
            columns: [{header: 'idcausaexclusion', hidden: true, hideable: false, dataIndex: 'idcausaexclusion'}
                , this.expanderCausasExclusionNomina
                , {header: idioma.lbColDenominacion, width: 500, sortable: true, dataIndex: 'denominacion'}
                , {
                    header: '<center>' + idioma.lbColDesde + '</center>',
                    width: 80,
                    sortable: false,
                    dataIndex: 'fechainicio',
                    renderer: centrarValor
                }
                , {
                    header: '<center>' + idioma.lbColHasta + '</center>',
                    width: 80,
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
            store: modelo.storeCausasExclusionNomina,
            sm: this.smCausasExclusionNomina,
            plugins: this.expanderCausasExclusionNomina,
            loadMask: {msg: idioma.lbMaskGridCargando},
            bbar: new Ext.PagingToolbar({
                pageSize: 1000,
                store: modelo.storeCausasExclusionNomina,
                displayInfo: true,
                displayMsg: 'Mostrando  {0} - {1} de {2}',
                emptyMsg: "0 Resultado a mostrar"
            }),
        });

        //Botones de Add, Mod, Elim, Ayud de causas de exclusión.
        this.btnAdicionarCausasExclusionNomina = new Ext.Button({
            id: 'btnAdicionarCausasExclusionNomina',
            text: idioma.lbBtnAdicionar,
            tooltip: idioma.textToolTipAddCausasExclusionNomina,
            // icon: perfil.dirImg+'adicionar.png',
            iconCls: 'adicionar',
            prevTab: 'btnAyudaCausasExclusionNomina',
            nextTab: 'btnModificarCausasExclusionNomina',
        });

        this.btnModificarCausasExclusionNomina = new Ext.Button({
            id: 'btnModificarCausasExclusionNomina',

            text: idioma.lbBtnModificar,
            tooltip: idioma.textToolTipModCausasExclusionNomina,
            //icon: perfil.dirImg+'modificar.png',
            iconCls: 'modificar',
            prevTab: 'btnAdicionarCausasExclusionNomina',
            nextTab: 'btnEliminarCausasExclusionNomina',
        });

        this.btnEliminarCausasExclusionNomina = new Ext.Button({
            id: 'btnEliminarCausasExclusionNomina',
            text: idioma.lbBtnEliminar,
            tooltip: idioma.textToolTipElimCausasExclusionNomina,
            // icon: perfil.dirImg+'eliminar.png',
            iconCls: 'eliminar',
            prevTab: 'btnModificarCausasExclusionNomina',
            nextTab: 'btnAyudaCausasExclusionNomina',
        });

        this.btnExportarCausasExclusionNomina = new Ext.Button({
            id: 'btnExportarCausasExclusionNomina',
            text: 'Exportar',
            tooltip: 'Exportar',
            iconCls: 'exportar'
        });

        this.btnAyudaCausasExclusionNomina = new Ext.Button({
            id: 'btnAyudaCausasExclusionNomina',
            text: idioma.lbBtnAyuda,
            tooltip: idioma.textToolTipAyudaCausasExclusionNomina,
            // icon:perfil.dirImg+'ayuda.png',
            iconCls: 'ayuda',
            prevTab: 'btnEliminarCausasExclusionNomina',
            nextTab: 'btnAdicionarCausasExclusionNomina',
        });

        //Panel contenedor general del grid de causas de exclusión. 
        this.panelCentralCausasExclusionNomina = new Ext.Panel({
            id: 'idpanelCentralCausasExclusionNomina',
            region: 'center',
            heigth: '100%',
            width: '100%',
            border: false,
            layout: 'fit',
            tbar: [this.btnAdicionarCausasExclusionNomina, this.btnModificarCausasExclusionNomina, this.btnEliminarCausasExclusionNomina, this.btnExportarCausasExclusionNomina, '->', this.btnAyudaCausasExclusionNomina],
            items: [this.gpCausasExclusionNomina],
        });

        //Campos del formulario de causas de exclusión.
        this.tfDenomCausasExclusionNomina = new Ext.form.TextField({
            id: 'idtfDenomCausasExclusionNomina', fieldLabel: idioma.lbColDenominacion,
            tabIndex: 2, name: 'denominacion', allowBlank: false, anchor: '99%',
            blankText: idioma.lbErrorCampoVacio, prevTab: 'idbtnAceptarCausasExclusionNomina',
//                                        regex:/^([a-zA-ZÁÉÍÓÚáéíóúñüÑ\d ]+(\d*)?)+$/,
            vtype: 'vtdenominaciones',
            regexText: idioma.lbDenomIncorr, //maskRe
            blankText: idioma.lbErrorCampoVacio,
            maxLength: 100,
            maxLengthText: idioma.lbMaxText_100,

        });

        this.dfFInicioCausasExclusionNomina = new Ext.form.DateField({
            id: 'iddfFInicioCausasExclusionNomina', fieldLabel: idioma.lbColDesde,
            tabIndex: 3, name: 'fechainicio', allowBlank: false,
            format: 'd/m/Y', editable: true, readOnly: false,
            value: new Date().format('d/m/Y'), maxText: idioma.lbFechaMaxima,
            minText: idioma.lbFechaMinima, blankText: idioma.lbErrorCampoVacio,
            invalidText: idioma.invalidTextFecha, vtype: 'daterange',
            anchor: '90%', endDateField: 'iddfFFinCausasExclusionNomina'
        });

        this.dfFFinCausasExclusionNomina = new Ext.form.DateField({
            id: 'iddfFFinCausasExclusionNomina', fieldLabel: idioma.lbColHasta,
            tabIndex: 4, name: 'fechafin', xtype: 'datefield', allowBlank: true,
            format: 'd/m/Y', editable: true, readOnly: false,
            maxText: idioma.lbFechaMaxima, minText: idioma.lbFechaMinima,
            blankText: idioma.lbErrorCampoVacio, invalidText: idioma.invalidTextFecha,
            vtype: 'daterange', anchor: '99%', startDateField: 'iddfFInicioCausasExclusionNomina'
        });

        this.tfDescripCausasExclusionNomina = new Ext.form.TextArea({
            id: 'idtfDescripCausasExclusionNomina',
            fieldLabel: idioma.lbColDescripcion, tabIndex: 5,
            name: 'descripcion', allowBlank: true,
            hiddenname: 'descripcion',
            maxLength: 255, //regex, regexText, maskRe
            maxLengthText: idioma.lbMaxText_255,
            anchor: '99%', prevTab: 'iddfFFinCausasExclusionNomina', nextTab: 'idbtnCancelarCausasExclusionNomina',
            blankText: idioma.lbErrorCampoVacio,
        });

        //Formulario de causas de exclusión.
        this.formularioCausasExclusionNomina = new Ext.FormPanel({
            id: 'idformlarioCausasExclusionNomina',
            labelAlign: 'top',
            frame: true,
            width: 300,
            autoHeight: true,
            bodyStyle: {
                padding: '10px 10px 10px 10px',
            },
            items: [{
                layout: 'column',
                items: [
                    {columnWidth: .99, layout: 'form', items: [this.tfDenomCausasExclusionNomina]},
                ]
            }, {
                layout: 'column',
                items: [
                    {columnWidth: .54, layout: 'form', items: [this.dfFInicioCausasExclusionNomina]},
                    {columnWidth: .46, layout: 'form', items: [this.dfFFinCausasExclusionNomina]}
                ]
            },
                this.tfDescripCausasExclusionNomina
            ],
        });

        //Botones de la ventana de causas de exclusión
        this.btnCancelarCausasExclusionNomina = new Ext.Button({
            id: 'idbtnCancelarCausasExclusionNomina',
            iconCls: 'cancelar',
            // icon:perfil.dirImg+'cancelar.png',
            text: idioma.lbBtnCancelar,
            tooltip: idioma.textToolTipCancelar,
            prevTab: 'idtfDescripCausasExclusionNomina',
            nextTab: 'idbtnAplicarCausasExclusionNomina',
        });

        this.btnAplicarCausasExclusionNomina = new Ext.Button({
            id: 'idbtnAplicarCausasExclusionNomina',
            iconCls: 'aplicar',
            //icon:perfil.dirImg+'aplicar.png',
            text: idioma.lbBtnAplicar,
            tooltip: idioma.textToolTipAplicar,
            prevTab: 'idbtnCancelarCausasExclusionNomina',
            nextTab: 'idbtnAceptarCausasExclusionNomina',
        });

        this.btnAceptarCausasExclusionNomina = new Ext.Button({
            id: 'idbtnAceptarCausasExclusionNomina',
            iconCls: 'aceptar',
            disabled: true,
            //icon:perfil.dirImg+'aceptar.png',
            text: idioma.lbBtnAceptar,
            tooltip: idioma.textToolTipAceptar,
            prevTab: 'idbtnAplicarCausasExclusionNomina',
            nextTab: 'idtfDenomCausasExclusionNomina',
        });

        //Ventana de adicionar y modificar causas de exclusión.
        this.ventanaCausasExclusionNomina = new Ext.Window({
            modal: true,
            closeAction: 'hide',
            autoHeight: true,
            closable: true,
            resizable: false,
            autoValidate: true,
            validateDefault: true,
            constrain: true,
            layout: 'fit',
            items: [this.formularioCausasExclusionNomina],
            buttons: [this.btnCancelarCausasExclusionNomina, this.btnAplicarCausasExclusionNomina, this.btnAceptarCausasExclusionNomina],
            keys: [
                {
                    key: Ext.EventObject.ENTER,
                    stopEvent: true,
                    fn: function () {
                        if (!self.btnAceptarCausasExclusionNomina.disabled) {
                            self.btnAceptarCausasExclusionNomina.handler();
                        }
                    }
                }, {
                    key: 'x',
                    alt: true,
                    stopEvent: true,
                    fn: function () {
                        if (!self.btnCancelarCausasExclusionNomina.disabled) {
                            self.btnCancelarCausasExclusionNomina.handler();
                        }
                    }
                }, {
                    key: 'p',
                    alt: true,
                    stopEvent: true,
                    fn: function () {
                        if (!self.btnAplicarCausasExclusionNomina.disabled) {
                            self.btnAplicarCausasExclusionNomina.handler();
                        }
                    }
                }
            ]
        });
    }
};

//Controlador de la vista del Nomenclador de causas de exclusión.
var Pvd_Nomina_Nomencladores_NomCausasExclusionNomina_Controlador = function () {
    /**
     * Inicializar el controlador de la vista.
     *
     * @param idioma Objeto que contiene el idioma de los textos de la IU (Tipo: Object).
     * @param vista Vista del componente Nomenclador de causas de exclusión (Tipo: Pvd_Nomina_Nomencladores_NomCausasExclusionNomina_Vista)
     * @param modelo Modelo de la vista del componente Nomenclador de causas de exclusión (Tipo: Pvd_Nomina_Nomencladores_NomCausasExclusionNomina_Modelo)
     */
    this.init = function (idioma, vista, modelo) {
        var _vista = vista;
        /**
         *Variables generales.
         */
        var variablesCausasExclusionNomina = {
            accion: 'Add',
            cambio: 0,
        };
        //Eventos del grid de causas de exclusión.
        vista.gpCausasExclusionNomina.on('rowdblclick', function (e) {
            mostrarVentanaModificarCausasExclusionNomina();
        });

        vista.gpCausasExclusionNomina.on('destroy', function (e) {
            vista.ventanaCausasExclusionNomina.destroy();
        });

        //Eventos del store de causas de exclusión.
        modelo.storeCausasExclusionNomina.on('beforeload', function (store) {
            vista.btnModificarCausasExclusionNomina.disable();
            vista.btnEliminarCausasExclusionNomina.disable();
            store.removeAll();
        });

        modelo.storeCausasExclusionNomina.on('load', function (store, records, opt) {
            if (!records.length) {
                mostrarMensaje(1, idioma.lbMsgNoExistenDatos);
            }
        });

        //Eventos del seleccion model del grid de causas de exclusión.
        vista.smCausasExclusionNomina.on('rowselect', function () {
            vista.btnModificarCausasExclusionNomina.enable();
            vista.btnEliminarCausasExclusionNomina.enable();
        });

        //Eventos de campo de denominacion. 
        vista.tfDenomCausasExclusionNomina.on('change', function (tf, n, o) {
            variablesCausasExclusionNomina.cambio = 1;
        });

        //Eventos de campo de fecha inicio. 
        vista.dfFInicioCausasExclusionNomina.on('change', function (tf, n, o) {
            variablesCausasExclusionNomina.cambio = 1;
        });

        //Eventos de campo de fecha fin. 
        vista.dfFFinCausasExclusionNomina.on('change', function (tf, n, o) {
            variablesCausasExclusionNomina.cambio = 1;
        });

        //Eventos de campo de descripcion. 
        vista.tfDescripCausasExclusionNomina.on('change', function (tf, n, o) {
            variablesCausasExclusionNomina.cambio = 1;
        });

        //Eventos del botón adicionar causas de exclusión.
        vista.btnAdicionarCausasExclusionNomina.setHandler(function () {
            mostrarVentanaAdicionarCausasExclusionNomina();
        });

        //Eventos del botón modificar causas de exclusión.
        vista.btnModificarCausasExclusionNomina.setHandler(function () {
            mostrarVentanaModificarCausasExclusionNomina();
        });

        //Eventos del botón eliminar causas de exclusión.
        vista.btnEliminarCausasExclusionNomina.setHandler(function () {
            eliminarCausasExclusionNomina();
        });

        //Exportar
        vista.btnExportarCausasExclusionNomina.on('click', function () {
            var winload = new Ext.PVD.comun.window.winLoad({
                title: 'Por favor espere...',
                mensaje: 'Generando reporte'
            });
            winload.showMask();
            var iframe = document.createElement("iframe");
            iframe.src = document.location.protocol + '//' + document.location.host +
                '/pvd/nomina/index.php/nomcausasexclusionnomina/exportarNomenclador';
            iframe.style.display = 'none';
            var that = this;
            iframe.onload = function () {
                winload.hideMask();
                //that.destroy();
            };
            document.body.appendChild(iframe);
        });

        //Eventos del botón cancelar causas de exclusión.
        vista.btnCancelarCausasExclusionNomina.setHandler(function () {
            vista.ventanaCausasExclusionNomina.hide();
        });

        //Eventos del botón aplicar causas de exclusión.
        vista.btnAplicarCausasExclusionNomina.setHandler(function () {
            salvarFormularioCausasExclusionNomina(true);
        });

        //Eventos del botón aceptar causas de exclusión.
        vista.btnAceptarCausasExclusionNomina.setHandler(function () {
            salvarFormularioCausasExclusionNomina(false);
        });

        //Evento de la ventana de adicionar/modificar causas de exclusión.
        vista.ventanaCausasExclusionNomina.on('beforeshow', function (ventana) {
            variablesCausasExclusionNomina.cambio = 0;
            vista.formularioCausasExclusionNomina.getForm().reset();
            vista.tfDenomCausasExclusionNomina.focus(true, 500);
        });
        //evento de la ayuda
//


        /*
         *Función de mostrar la ventana de adicionar causas de exclusión.
         */
        function mostrarVentanaAdicionarCausasExclusionNomina() {
            vista.ventanaCausasExclusionNomina.setTitle(idioma.lbTitleVentAdicionarCausasExclusionNomina);
            vista.btnAplicarCausasExclusionNomina.show();
            vista.ventanaCausasExclusionNomina.show();
            //Actualizar la tabulación deL formulario.
            vista.btnCancelarCausasExclusionNomina.setNextElement('idbtnAplicarCausasExclusionNomina');
            vista.btnAceptarCausasExclusionNomina.setPreviousElement('idbtnAplicarCausasExclusionNomina');
            variablesCausasExclusionNomina.accion = 'Add';
        }

        /*
         *Función de mostrar la ventana de modificar causas de exclusión.
         */
        function mostrarVentanaModificarCausasExclusionNomina() {
            vista.ventanaCausasExclusionNomina.setTitle(idioma.lbTitleVentModificarCausasExclusionNomina);
            vista.btnAplicarCausasExclusionNomina.hide();
            vista.ventanaCausasExclusionNomina.show();
            //Actualizar la tabulación deL formulario.
            vista.btnCancelarCausasExclusionNomina.setNextElement('idbtnAceptarCausasExclusionNomina');
            vista.btnAceptarCausasExclusionNomina.setPreviousElement('idbtnCancelarCausasExclusionNomina');
            vista.formularioCausasExclusionNomina.getForm().loadRecord(vista.smCausasExclusionNomina.getSelected());
//            vista.formularioCausasExclusionNomina.addListener('clientvalidation', function (_form, _valid) {
//                if (comparar(vista.formularioCausasExclusionNomina.getForm().getValues(), vista.smCausasExclusionNomina.getSelected().data)) {
//                    vista.btnAceptarCausasExclusionNomina.setDisabled(true);
//                } else {
//                    vista.btnAceptarCausasExclusionNomina.enable()
//                }
//            });
            variablesCausasExclusionNomina.accion = 'Mod';
        }

        /*
         *Función para adicionar/modificar un tipo de pago.
         */
        function salvarFormularioCausasExclusionNomina(boton) {
            var urlAction = '/pvd/nomina/index.php/nomcausasexclusionnomina/adicionarCausasExclusionNomina';
            //  var urlAction = 'adicionarCausasExclusionNomina';
            var idcausaexclusion = 0;
            var lbMsgEspera = idioma.lbMsgAdicionarCausasExclusionNomina;
            var lbMsgExito = idioma.lbMsgCorrectoAdicionadoCausasExclusionNomina;

            if (variablesCausasExclusionNomina.accion == 'Mod') {
                lbMsgEspera = idioma.lbMsgModificarCausasExclusionNomina;
                lbMsgExito = idioma.lbMsgCorrectoModificadoCausasExclusionNomina;
                urlAction = '/pvd/nomina/index.php/nomcausasexclusionnomina/modificarCausasExclusionNomina';
                // urlAction = 'modificarCausasExclusionNomina';
                idcausaexclusion = vista.smCausasExclusionNomina.getSelected().get('idcausaexclusion');
            }
            if (variablesCausasExclusionNomina.cambio == 0) {
                if (variablesCausasExclusionNomina.accion == 'Mod') {
                    //Se oculta la ventana si no ha sido modificado ningún valor.
                    vista.ventanaCausasExclusionNomina.hide();
                } else {
                    //Se marcan como obligatorios en caso de presionar aceptar y se encuentren vacíos.
                    vista.tfDenomCausasExclusionNomina.markInvalid(idioma.lbErrorCampoVacio);
                    mostrarMensaje(3, idioma.lbErrorFormulario);
                }
            } else {
                //Se verifica si el formulario es válido y si el campo sueldo contiene un valor
                if (vista.formularioCausasExclusionNomina.getForm().isValid()) {

                    //Se muestra la máscara de espera.
                    PVD.mostrarMascara('idmaskaddmodtipopago', idioma.lbMsgEsperaEnviarDatos, lbMsgEspera);

                    //Enviando datos al servidor.
                    Ext.Ajax.request({
                        url: urlAction,
                        method: 'POST',
                        params: {
                            idcausaexclusion: idcausaexclusion,
                            denominacion: vista.tfDenomCausasExclusionNomina.getValue(),
                            fechainicio: vista.dfFInicioCausasExclusionNomina.getRawValue(),
                            fechafin: vista.dfFFinCausasExclusionNomina.getRawValue(),
                            descripcion: vista.tfDescripCausasExclusionNomina.getValue(),
                        },
                        callback: function (options, success, response) {
                            responseData = Ext.decode(response.responseText);
                            //Ocultando máscara de enviar datos.
                            PVD.ocultarMascara('idmaskaddmodtipopago');

                            if (responseData.codigo == 1) {
                                mostrarMensaje(1, lbMsgExito);
                                if (!boton) {
                                    vista.ventanaCausasExclusionNomina.hide();

                                } else {
                                    vista.tfDenomCausasExclusionNomina.focus(true, 500);
                                }
                                vista.formularioCausasExclusionNomina.getForm().reset();
                                modelo.storeCausasExclusionNomina.removeAll();
                                modelo.storeCausasExclusionNomina.load({params: {limit: 1000, start: 0}});
                                variablesCausasExclusionNomina.cambio = 0;


                            }
                            else {
                                if (responseData.codigo == 3)
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
         *Función para eliminar un tipo de pago.
         */
        function eliminarCausasExclusionNomina() {
            //Mostrando el mensaje para aceptar el eliminar.
            mostrarMensaje(2, idioma.lbTitleEliminarCausasExclusionNomina, function (btn) {
                if (btn == "ok") {
                    //Se muestra la máscara de espera.
                    PVD.mostrarMascara('idmaskeleliminarcausaexclusion', idioma.lbMsgEsperaEnviarDatos, idioma.lbMsgEliminarCausasExclusionNomina);
                    //Enviando los datos al servidor.
                    Ext.Ajax.request({
                        url: '/pvd/nomina/index.php/nomcausasexclusionnomina/eliminarCausasExclusionNomina',
                        method: 'POST',
                        params: {idcausaexclusion: vista.smCausasExclusionNomina.getSelected().get('idcausaexclusion')},
                        callback: function (options, success, response) {
                            //Se oculta la máscara de espera.
                            PVD.ocultarMascara('idmaskeleliminarcausaexclusion');
                            responseData = Ext.decode(response.responseText);
                            if (responseData.codigo == 1) {
                                //Mostrando el mensaje de que se ha el tipo de nómina.
                                mostrarMensaje(1, idioma.lbMsgCorrectoEliminadoCausasExclusionNomina);
                                //Recargando el grid de causas de exclusión.
                                modelo.storeCausasExclusionNomina.load({params: {limit: 1000, start: 0}});

                            } else {
                                if (responseData.codigo)
                                    mostrarMensaje(responseData.codigo, idioma.lbMsgErrorCausaExclusionUso);
                            }
                        }
                    });
                }
            });
        }

        /**
         *Teclas calientes de la interfaz.
         */
        this.keyMap = new Ext.KeyMap(Ext.getDoc(), [{
            key: 'imh',
            alt: true,
            stopEvent: true,
            handler: function (k, e) {
                switch (k) {
                    case 73: { //i para adicionar.
                        if (!vista.btnAdicionarCausasExclusionNomina.disabled && !vista.ventanaCausasExclusionNomina.isVisible()) {
                            mostrarVentanaAdicionarCausasExclusionNomina();
                        }
                        break;
                    }
                    case 77: { //m para modificar .
                        if (!vista.btnModificarCausasExclusionNomina.disabled && !vista.ventanaCausasExclusionNomina.isVisible()) {
                            mostrarVentanaModificarCausasExclusionNomina();
                        }
                        break;
                    }
                    case 72: { //h para ayuda.
                        if (!vista.ventanaCausasExclusionNomina.isVisible()) {
                            vista.btnAyudaCausasExclusionNomina.focus();
                            vista.btnAyudaCausasExclusionNomina.fireEvent('click');
                        }
                        break;
                    }
                }
            }
        }, {
            key: 46,//del para eliminar.
            fn: function () {
                if (!vista.btnEliminarCausasExclusionNomina.disabled && !vista.ventanaCausasExclusionNomina.isVisible()) {
                    eliminarCausasExclusionNomina();
                }
            },
        }, {
            key: 13,//enter para aceptar.
            fn: function () {
                if (vista.btnAceptarCausasExclusionNomina.isVisible()) {
                    vista.btnAceptarCausasExclusionNomina.focus();
                    vista.btnAceptarCausasExclusionNomina.fireEvent('click');
                }
            },
        }]);
    }
};

variablesGlobales.nomcausasexclusionnomina_js = 1;
