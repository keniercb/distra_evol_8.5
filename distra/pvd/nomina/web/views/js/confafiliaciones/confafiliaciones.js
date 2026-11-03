Ext.ns('Pvd.Nomina.Configuracion.Afiliaciones');

Pvd.Nomina.Configuracion.Afiliaciones.Panel = Ext.extend(Ext.Panel, {
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
        this.modelo = new Pvd_Nomina_Configuracion_Afiliaciones_Modelo();
        this.modelo.init();

        //Inicializando la vista.
        this.vista = new Pvd_Nomina_Configuracion_Afiliaciones_Vista();
        this.vista.init(this.perfil, this.idioma, this.modelo);

        //Inicializar controlador.
        this.controlador = new Pvd_Nomina_Configuracion_Afiliaciones_Controlador();
        this.controlador.init(this.idioma, this.vista, this.modelo);

        this.items = [this.vista.panelCentralAfiliacion];

        //Teclas calientes de la interfaz
        this.keyMap = this.controlador.keyMap;

        Pvd.Nomina.Configuracion.Afiliaciones.Panel.superclass.initComponent.call(this);
    },
    listeners: {
        afterlayout: function (x) {
            if (this.mostrar == 1) {
                this.modelo.storeAfiliaciones.load({params: {limit: 20, start: 0}});
                this.mostrar = 2;
            }
        },
        destroy: function (x) {

        },
    },
});

var Pvd_Nomina_Configuracion_Afiliaciones_Modelo = function () {
    this.init = function () {

        this.storeAfiliaciones = new Ext.data.Store({
            url: '/pvd/nomina/index.php/confgeneral/obtenerListadoAfiliaciones',
            reader: new Ext.data.JsonReader(
                {totalProperty: "cantidad", autoLoad: true, root: "datos", id: "idconfafiliacion"},
                [
                    {name: 'idconfafiliacion'},
                    {name: 'idafiliacion'},
                    {name: 'denominacion'},
                    {name: 'idformula'},
                    {name: 'expformula'},
                    {name: 'idformuladevengadototal'},
                    {name: 'expformuladevengadototal'},
                    {name: 'denomtipospagos'},
                    {name: 'rtipospagos'}
                ])
        });

        //Store del listado de organizaciones
        this.stOrganizaciones = new Ext.data.Store({
            url: '/pvd/nomina/index.php/confgeneral/obtenerOrganizaciones',
            reader: new Ext.data.JsonReader(
                {totalProperty: "cantidad", autoLoad: true, root: "datos", id: "idorganizacion"},
                [
                    {name: 'idorganizacion'}, {name: 'denominacion'}
                ])
        });

        //Store del listado de tipos de pagos
        this.stTiposPagos = new Ext.data.Store({
            url: '/pvd/nomina/index.php/confgeneral/obtenerTiposPagos',
            reader: new Ext.data.JsonReader(
                {totalProperty: "cantidad", autoLoad: true, root: "datos", id: "idtipopago"},
                [
                    {name: 'idtipopago'}, {name: 'denominacion'}
                ])
        });
    }
};

var Pvd_Nomina_Configuracion_Afiliaciones_Vista = function () {
    this.init = function (perfil, idioma, modelo) {
        /**Variables y funciones*/
        var self = this;

        function centrarCampos(val) {
            if (val)
                return "<center>" + val + "</center>";
        }

        function centrarTiposPagos(val) {
            var arraytipospago = val.split(',');
            var cadenafinal = "";
            var cont = 0;
            Ext.each(arraytipospago, function (value) {
                cont++;
                cadenafinal += (cont % 3 == 0) ? value + "</br>" : ((cont == arraytipospago.length) ? value : value + " <b>,</b> ");
            });
            return "<center>" + cadenafinal + "</center>";
        }

        function centrarFormulas(val) {
            var arrayindicadoresformula = val.split(';');
            var cadenafinal = "";
            var cont = 0;
            Ext.each(arrayindicadoresformula, function (value) {
                cont++;
                cadenafinal += (cont % 1 == 0) ? value + "</br>" : ((cont == arrayindicadoresformula.length) ? value : value + " <b>;</b> ");
            });
            return "<center>" + cadenafinal + "</center>";
        }

        /**Panel incluido en el viewport**/
        //Grid
        this.smAfiliaciones = new Ext.grid.CheckboxSelectionModel({
            singleSelect: false,
        });
        this.expanderAfiliaciones = new Ext.grid.RowExpander({
            tpl: new Ext.Template(
                '<div style="word-wrap:break-word;white-space:normal;"><p>&nbsp;&nbsp;Descripci&oacute;n:&nbsp;{descripcion}</p><br/></div>'
            ), enableCaching: false
        });

        //Botones
        this.btnAdicionarAfiliacion = new Ext.Button({
            id: 'btnAdicionarAfiliacion',
            text: idioma.lbBtnAdicionarAfiliaciones,
            tooltip: idioma.textToolTipAddAfiliaciones,
            iconCls: 'adicionar'
        });
        this.btnModificarAfiliacion = new Ext.Button({
            id: 'btnModificarAfiliacion',
            text: idioma.lbBtnModificarAfiliaciones,
            tooltip: idioma.textToolTipModAfiliaciones,
            iconCls: 'modificar'
        });
        this.btnEliminarAfiliacion = new Ext.Button({
            id: 'btnEliminarAfiliacion',
            text: idioma.lbBtnEliminarAfiliaciones,
            tooltip: idioma.textToolTipElimAfiliaciones,
            iconCls: 'eliminar'
        });
        this.btnAyudaAfiliacion = new Ext.Button({
            id: 'btnAyudaAfiliacion',
            text: idioma.lbBtnAyudaAfiliaciones,
            tooltip: idioma.textToolTipAyudaAfiliaciones,
            //  icon:perfil.dirImg+'ayuda.png',
            iconCls: 'ayuda',
            prevTab: 'btnElimConceptoRM',
            nextTab: 'btnAddConceptoRM',
        });

        this.gpAfiliaciones = new Ext.grid.GridPanel({
            id: 'gpAfiliaciones',
            title: idioma.lbTitleAfiliaciones,
            region: 'center',
            columns: [
                this.smAfiliaciones,
                /*this.expanderAfiliaciones,*/
                {header: 'idconfafiliacion', hidden: true, hideable: false, dataIndex: 'idconfafiliacion'},
                {header: 'idafiliacion', hidden: true, hideable: false, dataIndex: 'idafiliacion'},
                {header: 'idformula', hidden: true, hideable: false, dataIndex: 'idformula'},
                {header: idioma.lbColDenominacion, width: 100, sortable: true, dataIndex: 'denominacion'},
                {
                    header: '<center>' + idioma.lbColTiposPago + '</center>',
                    width: 300,
                    sortable: true,
                    dataIndex: 'denomtipospagos',
                    renderer: centrarTiposPagos
                },
                {
                    header: 'rtipospagos', hidden: true, hideable: false, dataIndex: 'rtipospagos'
                },
                {
                    header: 'idformuladevengadototal',
                    hidden: true,
                    hideable: false,
                    dataIndex: 'idformuladevengadototal'
                },
                {
                    header: '<center>' + 'Devengado total' + '</center>',
                    width: 200,
                    sortable: true,
                    dataIndex: 'expformuladevengadototal',
                    renderer: centrarFormulas
                },
                {
                    header: 'idformula', hidden: true, hideable: false, dataIndex: 'idformula'
                },
                {
                    header: '<center>' + idioma.lbColEscala + '</center>',
                    width: 200,
                    sortable: true,
                    dataIndex: 'expformula',
                    renderer: centrarFormulas
                }
            ],
            clicksToEdit: 1,
            stripeRows: true,
            autoScroll: true,
            border: false,
            width: '100%',
            heigth: '100%',
            viewConfig: {forceFit: true},
            store: modelo.storeAfiliaciones,
            sm: this.smAfiliaciones,
            /*plugins: this.expanderAfiliaciones,*/
            loadMask: {msg: 'Cargando...'},
            bbar: new Ext.PagingToolbar({
                pageSize: 20,
                store: modelo.storeAfiliaciones,
                displayInfo: true,
                displayMsg: 'Mostrando  {0} - {1} de {2}',
                emptyMsg: "0 Resultado a mostrar"
            }),
            tbar: [this.btnAdicionarAfiliacion, this.btnModificarAfiliacion, this.btnEliminarAfiliacion, '->', this.btnAyudaAfiliacion],
            keys: [
                {
                    key: Ext.EventObject.DELETE,
                    stopEvent: true,
                    fn: function () {
                        if (!self.btnEliminarAfiliacion.disabled) {
                            self.btnEliminarAfiliacion.handler();
                        }
                    }
                },
                {
                    key: 'i',
                    alt: true,
                    stopEvent: true,
                    fn: function () {
                        self.btnAdicionarAfiliacion.handler();
                    }
                },
                {
                    key: 'm',
                    alt: true,
                    stopEvent: true,
                    fn: function () {
                        if (!self.btnModificarAfiliacion.disabled) {
                            self.btnModificarAfiliacion.handler();
                        }
                    }
                },
                {
                    key: 'h',
                    alt: true,
                    stopEvent: true,
                    fn: function () {
                        self.btnAyudaAfiliacion.handler();
                    }
                }
            ]
        });


        //Panel
        this.panelCentralAfiliacion = new Ext.Panel({
            id: 'idpanelCentralAfiliacion',
            region: 'center',
            heigth: '100%',
            width: '100%',
            border: false,
            layout: 'fit',
            items: [this.gpAfiliaciones],

        });

        /**Ventana de afiliaciones**/
        //Campos
        this.cbDenomAfiliacion = new Ext.form.ComboBox({
            id: 'idcbMonedaActiva',
            fieldLabel: idioma.lbColDenominacion,
            anchor: '99%',
            triggerAction: 'all',
            valueField: 'idorganizacion',
            displayField: 'denominacion',
            hiddenName: 'idorganizacion',
            allowBlank: false,
            mode: 'local',
            blankText: idioma.lbErrorCampoVacio,
            readOnly: true,
            store: modelo.stOrganizaciones
        });
        this.smTiposPago = new Ext.grid.CheckboxSelectionModel({
            singleSelect: false,
        });
        this.gpTiposPago = new Ext.grid.GridPanel({
            id: 'gpTiposPago',
            title: 'Listado de tipos de pago',
            region: 'center',
            columns: [
                this.smTiposPago,
                {header: 'idtipopago', hidden: true, hideable: false, dataIndex: 'idtipopago'},
                {
                    header: idioma.lbColDenominacion,
                    width: 400,
                    sortable: true,
                    dataIndex: 'denominacion'
                }
            ],
            stripeRows: true,
            autoScroll: true,
            border: true,
            width: 400,
            height: 200,
            viewConfig: {forceFit: true},
            store: modelo.stTiposPagos,
            sm: this.smTiposPago,
            loadMask: {msg: 'cargando'},
            bbar: new Ext.PagingToolbar({
                pageSize: 20,
                store: modelo.stTiposPagos,
                displayInfo: true,
                displayMsg: 'Mostrando  {0} - {1} de {2}',
                emptyMsg: "0 Resultado a mostrar"
            }),
        });
        this.btnCancelarTipoPago = new Ext.Button({
            id: 'idbtnCancelarTipoPago',
            iconCls: 'cancelar',
            text: idioma.lbBtnCancelar,
            tooltip: idioma.textToolTipCancelar
        });
        this.btnAceptarTipoPago = new Ext.Button({
            id: 'idbtnAceptarTipoPago',
            iconCls: 'aceptar',
            text: idioma.lbBtnAceptar,
            tooltip: idioma.textToolTipAceptar,
            disabled: true
        });
        this.ventanaTiposPagos = new Ext.Window({
            modal: true,
            closeAction: 'hide',
            autoHeight: true,
            closable: true,
            constrain: true,
            autoValidate: true,
            validateDefault: true,
            resizable: true,
            layout: 'fit',
            items: [this.gpTiposPago],
            buttons: [this.btnCancelarTipoPago, this.btnAceptarTipoPago]
        });
        this.taTipoPago = new Ext.form.TextArea({
            id: 'taTipoPago',
            fieldLabel: idioma.lbColTiposPago,
            valueField: 'idtipopago',
            displayField: 'denominacion',
            hiddenName: 'idtipopago',
            allowBlank: false,
            mode: 'local',
            emptyText: 'Seleccione...',
            blankText: idioma.lbErrorCampoVacio,
            readOnly: true,
            anchor: '99%',
            height: 100,
            triggerAction: 'all'
        });
        this.taFormulaDevengadoTotal = new Ext.form.TextArea({
            id: 'idtaFormulaDevengadoTotal',
            fieldLabel: 'Devengado total',
            name: 'expformuladevengadototal',
            allowBlank: false,
            mode: 'local',
            emptyText: 'Seleccione...',
            anchor: '99%',
            height: 50,
            //regex: /^([a-zA-ZÁÉÍÓÚáéíóúñüÑ\d]+[<>=/*\-+_;.]+(\d*)?)+$/,
            //regexText: "Contiene caracteres incorrectos"
        });

        this.taFormulaEscala = new Ext.form.TextArea({
            id: 'idTaFormulaIndicador',
            fieldLabel: idioma.lbColEscala,
            name: 'expformula',
            allowBlank: false,
            mode: 'local',
            emptyText: 'Seleccione...',
            anchor: '99%',
            height: 100,
            blankText: idioma.lbErrorCampoVacio,
            /*regex: /^([a-zA-ZÁÉÍÓÚáéíóúñüÑ\d]+[<>=/!*\-+_;.]+(\d*)?)+$/,
            regexText: "Contiene caracteres incorrectos"*/
        });

        //Formulario
        this.formularioAfiliacion = new Ext.FormPanel({
            id: 'idformularioAfiliacion',
            labelAlign: 'top',
            frame: true,
            width: 500,
            height: 400,
            bodyStyle: {
                padding: '10px 0px 10px 10px'
            },
            items: [
                {
                    layout: 'column',
                    items: [
                        {columnWidth: .99, layout: 'form', items: [this.cbDenomAfiliacion]},
                        {columnWidth: .99, layout: 'form', items: [this.taTipoPago]},
                        {columnWidth: .99, layout: 'form', items: [this.taFormulaDevengadoTotal]},
                        {columnWidth: .99, layout: 'form', items: [this.taFormulaEscala]}
                    ]
                }
            ]
        });

        //Botones
        this.btnCancelarAfiliacion = new Ext.Button({
            id: 'idbtnCancelarAfiliacion',
            iconCls: 'cancelar',
            text: idioma.lbBtnCancelar,
            tooltip: idioma.textToolTipCancelar
        });
        this.btnAplicarAfiliacion = new Ext.Button({
            id: 'idbtnAplicarAfiliacion',
            iconCls: 'aplicar',
            text: idioma.lbBtnAplicar,
            tooltip: idioma.textToolTipAplicar
        });
        this.btnAceptarAfiliacion = new Ext.Button({
            id: 'idbtnAceptarAfiliacion',
            iconCls: 'aceptar',
            text: idioma.lbBtnAceptar,
            tooltip: idioma.textToolTipAceptar
        });

        //Ventana
        this.ventanaAfiliacion = new Ext.Window({
            modal: true,
            closeAction: 'hide',
            autoHeight: true,
            closable: true,
            constrain: true,
            autoValidate: true,
            validateDefault: true,
            resizable: false,
            width: 600,
            layout: 'fit',
            items: [this.formularioAfiliacion],
            buttons: [this.btnCancelarAfiliacion, this.btnAplicarAfiliacion, this.btnAceptarAfiliacion],
            keys: [
                {
                    key: Ext.EventObject.ENTER,
                    stopEvent: true,
                    fn: function () {
                        if (!self.btnAceptarAfiliacion.disabled) {
                            self.btnAceptarAfiliacion.handler();
                        }
                    }
                },
                {
                    key: 'x',
                    alt: true,
                    stopEvent: true,
                    fn: function () {
                        if (!self.btnCancelarAfiliacion.disabled) {
                            self.btnCancelarAfiliacion.handler();
                        }
                    }
                },

                {
                    key: 'p',
                    alt: true,
                    stopEvent: true,
                    fn: function () {
                        if (!self.btnAplicarAfiliacion.disabled) {
                            self.btnAplicarAfiliacion.handler();
                        }
                    }
                }
            ]
        });
    }
};

var Pvd_Nomina_Configuracion_Afiliaciones_Controlador = function () {
    this.init = function (idioma, vista, modelo) {
        /**Variables*/
        var variablesAfiliacion = {
            accion: 'Add',
            cambio: 0,
            arrayindicadores: new Array(),
            idformula: -1,
            idformuladevengadototal: -1,
            idorganizacion: -1,
            rtipospago: new Array()
        };

        /**Acciones de los elementos del Panel**/
        //Grid
        vista.gpAfiliaciones.on('rowdblclick', function (e) {
            mostrarVentanaModificarAfiliacion();
        });
        vista.gpAfiliaciones.on('destroy', function (e) {
            vista.ventanaAfiliacion.destroy();
        });
        vista.smAfiliaciones.on('rowselect', function () {
            var cantseleccionados = vista.smAfiliaciones.getSelections().length;
            (cantseleccionados == 1) ? vista.btnModificarAfiliacion.enable() : vista.btnModificarAfiliacion.disable();
            (cantseleccionados > 0) ? vista.btnEliminarAfiliacion.enable() : vista.btnEliminarAfiliacion.disable();
        });
        vista.smAfiliaciones.on('rowdeselect', function () {
            var cantseleccionados = vista.smAfiliaciones.getSelections().length;
            (cantseleccionados == 1) ? vista.btnModificarAfiliacion.enable() : vista.btnModificarAfiliacion.disable();
            (cantseleccionados > 0) ? vista.btnEliminarAfiliacion.enable() : vista.btnEliminarAfiliacion.disable();
        });
        modelo.storeAfiliaciones.on('beforeload', function (store) {
            vista.btnModificarAfiliacion.disable();
            vista.btnEliminarAfiliacion.disable();
            store.removeAll();
        });
        modelo.storeAfiliaciones.on('load', function (store, records, opt) {
            if (!records.length) {
                //mostrarMensaje(1, 'frdsfs');
            }
        });
        //Botones
        vista.btnCancelarAfiliacion.setHandler(function () {
            vista.ventanaAfiliacion.hide();
        });
        vista.btnAplicarAfiliacion.setHandler(function () {
            salvarFormularioAfiliacion(true);
        });
        vista.btnAceptarAfiliacion.setHandler(function () {
            salvarFormularioAfiliacion(false);
        });

        /**Acciones de los elementos de la Ventana**/
        //Campos
        vista.taTipoPago.on('change', function (tf, n, o) {
            variablesAfiliacion.cambio = 1;
        });
        vista.taTipoPago.on('focus', function (tf, n, o) {
            modelo.stTiposPagos.load();
            vista.ventanaTiposPagos.show();
            if (variablesAfiliacion.accion == 'Mod') {
                var rtipospagos = vista.gpAfiliaciones.getSelectionModel().getSelected().data.rtipospagos;
                var rtipospagosgrid = vista.gpTiposPago.store.data;
                for (var i = 0; i < rtipospagos.length; i++) {
                    for (var j = 0; j < rtipospagosgrid.length; j++) {
                        console.info(rtipospagosgrid.items);
                    }
                }

            } else {
                vista.gpAfiliaciones.getSelectionModel().clearSelections();
            }
        });
        vista.taFormulaDevengadoTotal.on('focus', function () {
            var idconfafiliacion = (variablesAfiliacion.accion == "Mod") ? vista.gpAfiliaciones.getSelectionModel().getSelected().data.idconfafiliacion : -1;
            var idformula = (variablesAfiliacion.accion == "Mod") ? vista.gpAfiliaciones.getSelectionModel().getSelected().data.idformuladevengadototal : -1;
            //Cargando los indicadores
            Ext.Ajax.request({
                url: 'obtenerIndicadoresFormulas',
                method: 'POST',
                params: {
                    idconfafiliacion: idconfafiliacion
                },
                callback: function (options, success, response) {
                    var responseData = Ext.decode(response.responseText);
                    variablesAfiliacion.arrayindicadores = responseData.indicadores;
                    mostrarComponenteFormulaDevengadoTotal(idformula);
                }.createDelegate()
            });

        });
        vista.taFormulaEscala.on('focus', function () {
            var idformula = (variablesAfiliacion.accion == "Mod") ?
                vista.gpAfiliaciones.getSelectionModel().getSelected().data.idformula : -1;
            mostrarComponenteFormulaEscala(idformula);
        });
        //Botones
        vista.btnAdicionarAfiliacion.setHandler(function () {
            mostrarVentanaAdicionarAfiliacion();
        });
        vista.btnModificarAfiliacion.setHandler(function () {
            mostrarVentanaModificarAfiliacion();
        });
        vista.btnEliminarAfiliacion.setHandler(function () {
            eliminarAfiliacion();
        });
        vista.btnCancelarTipoPago.on('click', function () {
            vista.ventanaTiposPagos.hide();
        });
        vista.btnAceptarTipoPago.on('click', function () {
            var rseleccion = vista.gpTiposPago.getSelectionModel().getSelections();
            var cadena = "";
            variablesAfiliacion.rtipospago = new Array();
            //console.info(variablesAfiliacion.rtipospago);
            Ext.each(rseleccion, function (val) {
                variablesAfiliacion.rtipospago.push(val['id']);
                cadena += val.data['denominacion'] + ", ";
            });
            vista.ventanaTiposPagos.hide();
            vista.taTipoPago.setValue(cadena);
        });
        //Ventanas
        vista.ventanaAfiliacion.on('beforeshow', function (ventana) {
            desactivarValidatorTextAreas();
            vista.formularioAfiliacion.getForm().reset();
            vista.cbDenomAfiliacion.focus(true, 500);
        });

        vista.gpTiposPago.getSelectionModel().on('rowselect', function (obj, c, r) {
            var cantidadseleccionados = vista.gpTiposPago.getSelectionModel().getSelections().length;
            if (cantidadseleccionados > 0)
                vista.btnAceptarTipoPago.enable();
            else
                vista.btnAceptarTipoPago.disable();

        });

        vista.gpTiposPago.getSelectionModel().on('rowdeselect', function () {
            var cantidadseleccionados = vista.gpTiposPago.getSelectionModel().getSelections().length;
            if (cantidadseleccionados > 0)
                vista.btnAceptarTipoPago.enable();
            else
                vista.btnAceptarTipoPago.disable();
        });

        /**Funciones*/
        function desactivarValidatorTextAreas(){
            vista.taFormulaDevengadoTotal.vtype = null;
            vista.taFormulaEscala.vtype = null;
            /*console.info(vista.taFormulaDevengadoTotal.vtype);
            Ext.override(Ext.form.TextArea, {
                initComponent: Ext.form.TextArea.prototype.initComponent.createInterceptor(function () {
                    this.maskRe = /^[^\\"<>]*$/;
                    this.vtype = 'vtdescripcion';
                })
            });*/
        }

        function mostrarVentanaAdicionarAfiliacion() {
            vista.ventanaAfiliacion.setTitle(idioma.lbTitleVentAdicionarAfiliaciones);
            vista.cbDenomAfiliacion.enable();
            vista.btnAplicarAfiliacion.show();
            vista.ventanaAfiliacion.show();
            variablesAfiliacion.accion = 'Add';
            modelo.stOrganizaciones.load();
        }

        function mostrarVentanaModificarAfiliacion() {
            var arrdatos = vista.smAfiliaciones.getSelected().data;
            vista.ventanaAfiliacion.setTitle(idioma.lbTitleVentModificarAfiliaciones);
            vista.btnAplicarAfiliacion.hide();
            vista.ventanaAfiliacion.show();
            //console.info(arrdatos);
            vista.cbDenomAfiliacion.setRawValue(arrdatos['denominacion']);
            vista.cbDenomAfiliacion.disable();
            vista.taTipoPago.setValue(arrdatos['denomtipospagos']);
            vista.taFormulaEscala.setValue(arrdatos['expformula']);
            vista.taFormulaDevengadoTotal.setValue(arrdatos['expformuladevengadototal']);

            //Modificando las variables
            variablesAfiliacion.accion = 'Mod';
            modelo.stOrganizaciones.load({params: {idafiliacion: arrdatos['idafiliacion']}});
        }

        function salvarFormularioAfiliacion(boton) {

            var urlAction = '/pvd/nomina/index.php/confgeneral/adicionarAfiliaciones';
            var idconfafiliacion = -1;
            var msgaccion = 'adicionada';
            if (variablesAfiliacion.accion == 'Mod') {
                msgaccion = 'modificada';
                urlAction = '/pvd/nomina/index.php/confgeneral/modificarAfiliaciones';
                idconfafiliacion = vista.smAfiliaciones.getSelected().get('idconfafiliacion');
                if (variablesAfiliacion.cambio == 0) {
                    idorganizacion = vista.smAfiliaciones.getSelected().get('idconfafiliacion');
                    //Se oculta la ventana si no ha sido modificado ningún valor.
                    vista.ventanaAfiliacion.hide();
                }
            }

            //Se verifica si el formulario es válido
            if (vista.formularioAfiliacion.getForm().isValid()) {
                PVD.mostrarMascara('idmaskaddmodafiliacion', 'Espere por favor', 'Enviando datos...');
                Ext.Ajax.request({
                    url: urlAction,
                    method: 'POST',
                    params: {
                        idconfafiliacion: idconfafiliacion,
                        idorganizacion: vista.cbDenomAfiliacion.getValue(),
                        denominacion: vista.cbDenomAfiliacion.getRawValue(),
                        arrtipospago: Ext.encode(variablesAfiliacion.rtipospago),
                        idformula: variablesAfiliacion.idformula,
                        idformuladevengadototal: variablesAfiliacion.idformuladevengadototal
                    },
                    callback: function (options, success, response) {
                        responseData = Ext.decode(response.responseText);
                        PVD.ocultarMascara('idmaskaddmodafiliacion');

                        if (responseData == 'ok') {
                            mostrarMensaje(1, "La afiliaci&oacute;n ha sido " + msgaccion + " satisfactoriamente.");
                            if (!boton) {
                                vista.ventanaAfiliacion.hide();
                            } else {
                                vista.cbDenomAfiliacion.focus(true, 500);
                            }
                            vista.formularioAfiliacion.getForm().reset();
                            modelo.storeAfiliaciones.removeAll();
                            modelo.storeAfiliaciones.load({params: {limit: 20, start: 0}});
                            variablesAfiliacion.cambio = 0;
                            vista.taFormulaDevengadoTotal.setValue('');
                            vista.taFormulaEscala.setValue('');
                        } else if (responseData == 'existe') {
                            mostrarMensaje(3, "La afiliaci&oacute;n que desea adicionar ya existe.");
                        } else {
                            mostrarMensaje(3, "No se pudo adicionar la afiliaci&oacute;n.");
                        }
                    }
                });
            } else {
                mostrarMensaje(3, 'El formulario contiene campos inv&aacute;lidos.');
            }

        }

        function mostrarComponenteFormulaEscala(idformula) {
            var ind = new Array();
            //Arreglo del campo monto.
            var a = new Array();
            a[0] = 'Devengado_0';//idindicador
            a[1] = 'Devengado total';//indicador
            a[2] = 'Salarios';//tipo
            ind.push(a);
            this.objExpMat = new Ext.pvd.persona.formula.winEditorExpresiones({
                title: 'Editor de expresiones matem&aacute;ticas',
                idexpresionmatematica: (idformula != null) ? idformula : -1,
                indicadores: ind,
                agrupado: 1,
                campoagrupar: 'Tipo',
                mostrarFunciones: 2,
                mostrarCondicionales: true,
                mostrarDenominacion: false,
                height: 400
            });

            this.objExpMat.on('expresionsalvada', function (arr) {
                if (arr) {
                    vista.taFormulaEscala.setValue(arr['elementosMostrar']);
                    variablesAfiliacion.idformula = arr['idexpresionmatematica'];
                    mostrarMensaje(1, 'La expresi&oacute;n matem&aacute;tica ha sido adicionada satisfactoriamente');
                    this.objExpMat.close();
                } else {
                    mostrarMensaje(3, 'La expresi&oacute;n matem&aacute;tica no se pudo adicionar');
                }
            }.createDelegate(this));

            this.objExpMat.show();
        }

        function mostrarComponenteFormulaDevengadoTotal(idformuladevengado) {
            var ind = new Array();
            for (var i = 0; i < variablesAfiliacion.arrayindicadores.length; i++) {
                var a = new Array();
                a[0] = variablesAfiliacion.arrayindicadores[i].idindicador;
                a[1] = variablesAfiliacion.arrayindicadores[i].indicador;
                a[2] = variablesAfiliacion.arrayindicadores[i].tipo;
                ind.push(a);
            }

            this.objExpMat = new Ext.pvd.persona.formula.winEditorExpresiones({
                title: 'Editor de expresiones matem&aacute;ticas',
                idexpresionmatematica: (idformuladevengado != null) ? idformuladevengado : -1,
                indicadores: ind,
                agrupado: 1,
                campoagrupar: 'Tipo',
                mostrarFunciones: 2,
                mostrarCondicionales: true,
                mostrarDenominacion: false,
                height: 400
            });

            //Borrando el componente cuando es adicionar
            if (variablesAfiliacion.accion == "Add")
                this.objExpMat.LimpiarExpresion;

            this.objExpMat.on('expresionsalvada', function (arr) {
                if (arr) {
                    vista.taFormulaDevengadoTotal.setValue(arr['elementosMostrar']);
                    variablesAfiliacion.idformuladevengadototal = arr['idexpresionmatematica'];
                    this.objExpMat.close();
                    mostrarMensaje(1, 'La expresi&oacute;n matem&aacute;tica ha sido adicionada satisfactoriamente');
                } else {
                    mostrarMensaje(3, 'La expresi&oacute;n matem&aacute;tica no se pudo adicionar');
                }
            }.createDelegate(this));

            this.objExpMat.show();
        }

        function eliminarAfiliacion() {
            mostrarMensaje(2, '¿Est&aacute; seguro que desea eliminar la afiliaci&oacute;n seleccionada?', function (btn) {
                if (btn == 'ok') {
                    var seleccionados = vista.gpAfiliaciones.getSelectionModel().getSelections();
                    var arridconfafiliacion = new Array();
                    Ext.each(seleccionados, function (value) {
                            arridconfafiliacion.push(value.data.idconfafiliacion);
                        }
                    );
                    var urlAction = '/pvd/nomina/index.php/confgeneral/eliminarAfiliaciones';
                    PVD.mostrarMascara('idmaskdelafiliacion', 'Espere por favor', 'Enviando datos...');
                    Ext.Ajax.request({
                        url: urlAction,
                        method: 'POST',
                        params: {
                            arridconfafiliacion: Ext.encode(arridconfafiliacion)
                        },
                        callback: function (options, success, response) {
                            responseData = Ext.decode(response.responseText);
                            //Ocultando máscara de enviar datos.
                            PVD.ocultarMascara('idmaskdelafiliacion');

                            if (responseData == 'ok') {
                                mostrarMensaje(1, "La afiliaci&oacute;n ha sido eliminada satisfactoriamente.");
                            } else {
                                mostrarMensaje(3, "La afiliaci&oacute;n no se pudo eliminar.");
                            }

                            modelo.storeAfiliaciones.load({params: {limit: 20, start: 0}});
                            variablesAfiliacion.cambio = 0;
                        }
                    });
                }
            });
        }
    }
};

variablesGlobales.confafiliacion_js = 1;
