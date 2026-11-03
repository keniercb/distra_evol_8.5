Ext.ns('Pvd.Nomina.Nomencladores.NomBillete');

Pvd.Nomina.Nomencladores.NomBillete.Panel = Ext.extend(Ext.Panel, {
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
        this.modelo = new Pvd_Nomina_Nomencladores_NomBillete_Modelo();
        this.modelo.init();

        //Inicializando la vista.
        this.vista = new Pvd_Nomina_Nomencladores_NomBillete_Vista();
        this.vista.init(this.perfil, this.idioma, this.modelo);

        //Inicializar controlador.
        this.controlador = new Pvd_Nomina_Nomencladores_NomBillete_Controlador();
        this.controlador.init(this.idioma, this.vista, this.modelo);

        this.items = [this.vista.panelCentralBilletes];

        //Teclas calientes de la interfaz
        this.keyMap = this.controlador.keyMap;

        Pvd.Nomina.Nomencladores.NomBillete.Panel.superclass.initComponent.call(this);
    },
    listeners: {
        afterlayout: function (x) {
            if (this.mostrar == 1) {
                this.modelo.storeBilletes.load({params: {limit: 1000, start: 0}});
                this.mostrar = 2;
            }
        },
        destroy: function (x) {
            this.keyMap.disable();
        }
    }
});

//Modelo de la vista del Nomenclador de billetes.
var Pvd_Nomina_Nomencladores_NomBillete_Modelo = function () {
    /**
     * Inicializar el modelo de la vista.
     */
    this.init = function () {

        //Store del listado de billete
        this.storeBilletes = new Ext.data.GroupingStore({
            //this.storeBilletes = new Ext.data.Store({
            url: '/pvd/nomina/index.php/nombillete/obtenerListadoBilletes',
            sortInfo: {field: 'denommoneda', direction: "ASC"},
            groupField: 'denommoneda',
            reader: new Ext.data.JsonReader(
                {totalProperty: "cantidad", autoLoad: true, root: "datos", id: "idbillete"},
                [
                    {name: 'idbillete'}
                    ,
                    {name: 'denominacion'}
                    ,
                    {name: 'orden'}
                    ,
                    {name: 'activo'}
                    ,
                    {name: 'idmoneda'}
                    ,
                    {name: 'denommoneda'}
                ])
        });

        //Store del combobox Tipo moneda
        this.storeTipoMoneda = new Ext.data.SimpleStore({
            fields: [{name: 'valor'}, {name: 'denominacion'}]
        });
        var tipos = [[1, 'CUP'], [2, 'CUC']];
        this.storeTipoMoneda.loadData(tipos);

        //Store del combobox Moneda activa
        this.storeMonedaActiva = new Ext.data.SimpleStore({
            fields: [{name: 'valor'}, {name: 'denominacion'}]
        });
        var activas = [[1, 'Si'], [2, 'No']];
        this.storeMonedaActiva.loadData(activas);

    }
};

//Vista del componente Nomenclador de área.
var Pvd_Nomina_Nomencladores_NomBillete_Vista = function () {
    /**
     * Inicializar la vista.
     *
     * @param perfil Objeto que contiene el perfil de la IU (Tipo: Object).
     * @param idioma Objeto que contiene el idioma de los textos de la IU (Tipo: Object).
     * @param modelo Modelo de la vista del componente Nomenclador de billete (Tipo: Pvd_Nomina_Nomencladores_NomBillete_Modelo).
     */
    this.init = function (perfil, idioma, modelo) {

        var self = this;

        //Listado de billtes.
        function centrarValor(val) {
            if (val)
                return "<center>" + val + "</center>";
        }

        this.smBilletes = new Ext.grid.RowSelectionModel({
            singleSelect: true
        });

        function imagenActivo(val) {
            if (val == 0) {
                return '<center><img src="/lib/ExtJS/temas/default/images/iconos/cierreno.png" height=16 width=16 /></center>';
            } else {
                return '<center><img src="/lib/ExtJS/temas/default/images/iconos/cierresi.png" height=16 width=16 /></center>';
            }
        };

        this.gpBilletes = new Ext.grid.GridPanel({
            id: 'idgpBilletes',
            title: idioma.lbTitleBilletes,

            region: 'center',
            columns: [
                {header: 'idbillete', hidden: true, width: 50, hideable: false, dataIndex: 'idbillete'}
                ,
                {header: idioma.lbColDenominacion, width: 150, sortable: true, dataIndex: 'denominacion'}
                ,
                {header: idioma.lbColOrden, width: 150, sortable: true, dataIndex: 'orden'}
                ,
                {header: 'idmoneda', hidden: true, width: 150, sortable: true, dataIndex: 'idmoneda'}
                ,
                {header: 'Tipo moneda', width: 150, sortable: true, dataIndex: 'denommoneda'}
                ,
                {
                    header: idioma.lbColActivo,
                    width: 150,
                    sortable: true,
                    dataIndex: 'activo',
                    renderer: imagenActivo
                }

            ],
            stripeRows: true,
            autoScroll: true,
            border: false,
            width: '100%',
            heigth: '100%',
            viewConfig: {
                forceFit: true
            },
            view: new Ext.grid.GroupingView({forceFit: true, groupTextTpl: '{text}'}),
            store: modelo.storeBilletes,
            sm: this.smBilletes,
            loadMask: {
                msg: idioma.lbMaskGridCargando
            }
            ,
            bbar: new Ext.PagingToolbar({
                pageSize: 1000,
                store: modelo.storeBilletes,
                displayInfo: true,
                displayMsg: 'Mostrando  {0} - {1} de {2}',
                emptyMsg: "0 Resultado a mostrar"
            })
        });

//Botones de Add, Mod, Elim, Ayud de área.
        this.btnAdicionarBilletes = new Ext.Button({
            id: 'btnAddBilletes',
            text: idioma.lbBtnAdicionar,
            tooltip: idioma.textToolTipAddBilletes,
            iconCls: 'adicionar',
            prevTab: 'btnElimBilletes',
            nextTab: 'btnModBilletes'
        });

        this.btnModificarBilletes = new Ext.Button({
            id: 'btnModBilletes',
            text: idioma.lbBtnModificar,
            tooltip: idioma.textToolTipModBilletes,
            iconCls: 'modificar',
            prevTab: 'btnAddBilletes',
            nextTab: 'btnElimBilletes'
        });

        this.btnEliminarBilletes = new Ext.Button({
            id: 'btnElimBilletes',
            text: idioma.lbBtnEliminar,
            tooltip: idioma.textToolTipElimBilletes,
            iconCls: 'eliminar',
            prevTab: 'btnModBilletes',
            nextTab: 'btnAddBilletes'
        });

        this.btnExportarBilletes = new Ext.Button({
            id: 'btnExportarBilletes',
            text: 'Exportar',
            tooltip: 'Exportar',
            iconCls: 'exportar'
        });

//Panel contenedor general del grid de grupos escala.
        this.panelCentralBilletes = new Ext.Panel({
            id: 'idpanelCentralBilletes',
            region: 'center',
            heigth: '100%',
            width: '100%',
            border: false,
            layout: 'fit',
            tbar: [this.btnAdicionarBilletes, this.btnModificarBilletes, this.btnEliminarBilletes, this.btnExportarBilletes],
            items: [this.gpBilletes]
        });

//Campos del formulario de billetes
        this.tfDenomBilletes = new Ext.form.NumberField({
            id: 'idtfDenomBilletes',
            fieldLabel: idioma.lbColDenominacion,
            tabIndex: 1,
            name: 'denominacion',
            allowBlank: false, anchor: '99%',
            blankText: idioma.lbErrorCampoVacio,
            prevTab: 'idbtnAceptarBilletes',
            nextTab: 'idtfOrdenBilletes',
            maxValue: 10000,
            minValue: 0.001
        });

        this.tfOrdenBilletes = new Ext.form.NumberField({
            id: 'idtfOrdenBilletes',
            fieldLabel: idioma.lbColOrden,
            tabIndex: 2,
            name: 'orden',
            allowBlank: false, anchor: '99%',
            blankText: idioma.lbErrorCampoVacio,
            prevTab: 'idtfDenomBilletes',
            nextTab: 'idcbTipoMoneda',
            maxValue: 100,
            minValue: 1
        });

        this.cbTipoMoneda = new Ext.form.ComboBox({
            id: 'idcbTipoMoneda',
            fieldLabel: idioma.lbColTipoMoneda,
            anchor: '99%',
            tabIndex: 3,
            triggerAction: 'all',
            valueField: 'valor',
            displayField: 'denominacion',
            hiddenName: 'valor',
            allowBlank: false,
            mode: 'local',
            blankText: idioma.lbErrorCampoVacio,
            readOnly: true,
            store: modelo.storeTipoMoneda,
            prevTab: 'idtfOrdenBilletes',
            nextTab: 'idcbMonedaActiva'
        });

        this.cbMonedaActiva = new Ext.form.ComboBox({
            id: 'idcbMonedaActiva',
            fieldLabel: idioma.lbColActivo,
            anchor: '99%',
            tabIndex: 4,
            triggerAction: 'all',
            valueField: 'valor',
            displayField: 'denominacion',
            hiddenName: 'valor',
            allowBlank: false,
            mode: 'local',
            blankText: idioma.lbErrorCampoVacio,
            readOnly: true,
            store: modelo.storeMonedaActiva,
            prevTab: 'idcbTipoMoneda',
            nextTab: 'idbtnCancelarBilletes'
        });

//Formulario de grupos escalas.
        this.formularioBilletes = new Ext.FormPanel({
            id: 'idformlarioBilletes',
            labelAlign: 'top',
            frame: true,
            width: 400,
            autoHeight: true,
            bodyStyle: {
                padding: '10px 10px 10px 10px'
            },
            items: [
                {
                    layout: 'column',
                    items: [
                        {columnWidth: 1, layout: 'form', items: [this.tfDenomBilletes]},
                        {columnWidth: .35, layout: 'form', items: [this.tfOrdenBilletes]},
                        {columnWidth: .35, layout: 'form', items: [this.cbTipoMoneda]},
                        {columnWidth: .3, layout: 'form', items: [this.cbMonedaActiva]}
                    ]
                }
            ]
        });

//Botones de la ventana de Billetes
        this.btnCancelarBilletes = new Ext.Button({
            id: 'idbtnCancelarBilletes',
            iconCls: 'cancelar',
            text: idioma.lbBtnCancelar,
            tooltip: idioma.textToolTipCancelar,
            prevTab: 'id',
            nextTab: 'idbtnAplicarBilletes'
        });

        this.btnAplicarBilletes = new Ext.Button({
            id: 'idbtnAplicarBilletes',
            iconCls: 'aplicar',
            text: idioma.lbBtnAplicar,
            tooltip: idioma.textToolTipAplicar,
            prevTab: 'idbtnCancelarBilletes',
            nextTab: 'idbtnAceptarBilletes'
        });

        this.btnAceptarBilletes = new Ext.Button({
            id: 'idbtnAceptarBilletes',
            iconCls: 'aceptar',
            text: idioma.lbBtnAceptar,
            tooltip: idioma.textToolTipAceptar,
            prevTab: 'idbtnAplicarBilletes',
            nextTab: 'idtfDenomBilletes'
        });

//Ventana de adicionar y modificar Billetes.
        this.ventanaBilletes = new Ext.Window({
            modal: true,
            closeAction: 'hide',
            autoHeight: true,
            closable: true,
            autoValidate: true,
            validateDefault: true,
            constrain: true,
            resizable: true,
            layout: 'fit',
            items: [this.formularioBilletes],
            buttons: [this.btnCancelarBilletes, this.btnAplicarBilletes, this.btnAceptarBilletes],
            keys: [
                {
                    key: Ext.EventObject.ENTER,
                    stopEvent: true,
                    fn: function () {
                        if (!self.btnAceptarBilletes.disabled) {
                            self.btnAceptarBilletes.handler();
                        }

                    }
                },
                {
                    key: 'x',
                    alt: true,
                    stopEvent: true,
                    fn: function () {
                        if (!self.btnCancelarBilletes.disabled) {
                            self.btnCancelarBilletes.handler();
                        }
                    }
                },
                {
                    key: 'p',
                    alt: true,
                    stopEvent: true,
                    fn: function () {
                        if (!self.btnAplicarBilletes.disabled) {
                            self.btnAplicarBilletes.handler();
                        }
                    }
                }
            ]
        });
    }
};

//Controlador de la vista del Nomenclador de billetes.
var Pvd_Nomina_Nomencladores_NomBillete_Controlador = function () {
    /**
     * Inicializar el controlador de la vista.
     *
     * @param idioma Objeto que contiene el idioma de los textos de la IU (Tipo: Object).
     * @param vista Vista del componente Nomenclador de billete (Tipo: Pvd_Nomina_Nomencladores_NomBilletes_Vista)
     * @param modelo Modelo de la vista del componente Nomenclador de billete (Tipo: Pvd_Nomina_Nomencladores_NomBilletes_Modelo)
     */
    this.init = function (idioma, vista, modelo) {
        var _vista = vista;
        /**
         *Variables generales.
         */
        var variablesBilletes = {
            accion: 'Add',
            cambio: 1
        };

        //Eventos del grid del área.
        vista.gpBilletes.on('rowdblclick', function (e) {
            //mostrarVentanaModificarBilletes();
        });

        vista.gpBilletes.on('destroy', function (e) {
            vista.ventanaBilletes.destroy();
        });

        //Eventos del store del área.
        modelo.storeBilletes.on('beforeload', function (store) {
            vista.btnModificarBilletes.disable();
            vista.btnEliminarBilletes.disable();
            store.removeAll();
        });

        modelo.storeBilletes.on('load', function (store, records, opt) {
            if (!records.length) {
                mostrarMensaje(1, idioma.lbMsgNoExistenDatos);
            }
        });
        //Eventos del seleccion model del grid de área.
        vista.smBilletes.on('rowselect', function (sm) {
            vista.btnModificarBilletes.enable();
            vista.btnEliminarBilletes.enable();
            vista.idarea = sm.getSelected().get('idbillete');
        });

        //Eventos de campo de denominacion. 
        vista.tfDenomBilletes.on('change', function (tf, n, o) {
            variablesBilletes.cambio = 1;
        });


        //Eventos del botón adicionar.
        vista.btnAdicionarBilletes.setHandler(function () {
            mostrarVentanaAdicionarBilletes();
        });

        //Eventos del botón modificar.
        vista.btnModificarBilletes.on('click', function () {
            mostrarVentanaModificarBilletes();
        });

        //Eventos del botón eliminar.
        vista.btnEliminarBilletes.setHandler(function () {
            eliminarBilletes();
        });

        //Exportar
        vista.btnExportarBilletes.on('click', function () {
            var winload = new Ext.PVD.comun.window.winLoad({
                title: 'Por favor espere...',
                mensaje: 'Generando reporte'
            });
            winload.showMask();
            var iframe = document.createElement("iframe");
            iframe.src = document.location.protocol + '//' + document.location.host +
                '/pvd/nomina/index.php/nombillete/exportarNomenclador';
            iframe.style.display = 'none';
            var that = this;
            iframe.onload = function () {
                winload.hideMask();
                //that.destroy();
            };
            document.body.appendChild(iframe);
        });

        //Eventos del botón cancelar.
        vista.btnCancelarBilletes.setHandler(function () {
            vista.ventanaBilletes.hide();
        });

        //Eventos del botón aplicar.
        vista.btnAplicarBilletes.setHandler(function () {

            //salvarFormularioBilletes(true);


        });

        //Eventos del botón aceptar.
        vista.btnAceptarBilletes.setHandler(function () {
            salvarFormularioBilletes(false);
        });

        //Evento de la ventana de adicionar/modificar billetes.
        vista.ventanaBilletes.on('beforeshow', function (ventana) {
            variablesBilletes.cambio = 1;
            vista.formularioBilletes.getForm().reset();
            vista.tfDenomBilletes.focus(true, 500);
        });

        vista.ventanaBilletes.on('show', function (ventana) {

            if (vista.btnAceptarBilletes.disabled) {
                vista.btnCancelarBilletes.nextTab = 'idtfDenomBilletes';
                vista.tfDenomBilletes.prevTab = 'idbtnCancelarBilletes';
            }
        });

        function mostrarVentanaAdicionarBilletes() {
            vista.ventanaBilletes.setTitle(idioma.lbTitleVentAdicionarBilletes);
            vista.btnAplicarBilletes.show();
            vista.ventanaBilletes.show();
            //Actualizar la tabulación deL formulario.
            vista.btnCancelarBilletes.setNextElement('idbtnAplicarBilletes');
            vista.btnAceptarBilletes.setPreviousElement('idbtnAplicarBilletes');
            variablesBilletes.accion = 'Add';
        }

        function mostrarVentanaModificarBilletes() {
            vista.ventanaBilletes.setTitle(idioma.lbTitleVentModificarBilletes);
            vista.btnAplicarBilletes.hide();
            vista.ventanaBilletes.show();
            //Actualizar la tabulación deL formulario.
            vista.btnCancelarBilletes.setNextElement('idbtnAceptarBilletes');
            vista.btnAceptarBilletes.setPreviousElement('idbtnCancelarBilletes');
            vista.formularioBilletes.getForm().loadRecord(vista.smBilletes.getSelected());
            vista.cbTipoMoneda.setValue(vista.gpBilletes.getSelectionModel().getSelected().get('denommoneda'));
            vista.cbMonedaActiva.setValue(vista.gpBilletes.getSelectionModel().getSelected().get('activo'));
            variablesBilletes.accion = 'Mod';

        }

        function salvarFormularioBilletes(boton) {

            var urlAction = '/pvd/nomina/index.php/nombillete/adicionarBillete';
            var idbillete = 0;
            var lbMsgEspera = idioma.lbMsgAdicionarBilletes;
            var lbMsgExito = idioma.lbMsgCorrectoAdicionadoBilletes;

            if (variablesBilletes.accion == 'Mod') {
                lbMsgEspera = idioma.lbMsgModificarBilletes;
                lbMsgExito = idioma.lbMsgCorrectoModificadoBilletes;
                urlAction = '/pvd/nomina/index.php/nombillete/modificarBillete';
                idbillete = vista.smBilletes.getSelected().get('idbillete');
            }

            if (variablesBilletes.cambio == 0) {
                if (variablesBilletes.accion == 'Mod') {
                    //Se oculta la ventana si no ha sido modificado ningún valor.
                    vista.ventanaBilletes.hide();
                } else {
                    //Se marcan como obligatorios en caso de presionar aceptar y se encuentren vacíos.
                    vista.tfDenomBilletes.markInvalid(idioma.lbErrorCampoVacio);
                    mostrarMensaje(3, idioma.lbErrorFormulario);
                }
            } else {
                //Se verifica si el formulario es válido y si el campo sueldo contiene un valor
                if (vista.formularioBilletes.getForm().isValid()) {

                    //Se muestra la máscara de espera.
                    PVD.mostrarMascara('idmaskaddmodbillete', idioma.lbMsgEsperaEnviarDatos, lbMsgEspera);

                    //Enviando datos al servidor.
                    Ext.Ajax.request({
                        url: urlAction,
                        method: 'POST',
                        params: {
                            denominacion: vista.tfDenomBilletes.getValue(),
                            orden: vista.tfOrdenBilletes.getValue(),
                            tipomoneda: vista.cbTipoMoneda.getRawValue(),
                            activo: vista.cbMonedaActiva.getRawValue(),
                            idbillete: idbillete
                        },
                        callback: function (options, success, response) {
                            var responseData = Ext.decode(response.responseText);

                            //Ocultando máscara de enviar datos.
                            PVD.ocultarMascara('idmaskaddmodbillete');

                            // codigo y tipomoneda
                            // 1-'ok'
                            // 2-'misma denominacion'
                            // 3-'mismo orden'
                            if (responseData.codigo == 1) {
                                mostrarMensaje(1, lbMsgExito);
                                if (!boton) {
                                    vista.ventanaBilletes.hide();

                                } else {
                                    vista.tfDenomBilletes.focus(true, 500);
                                }
                                vista.formularioBilletes.getForm().reset();
                                modelo.storeBilletes.removeAll();
                                modelo.storeBilletes.load({params: {limit: 1000, start: 0}});
                                variablesBilletes.cambio = 0
                            } else if (responseData.codigo == 2) {
                                mostrarMensaje(3, 'Existe una moneda con la misma denominaci&oacute;n para el tipo de moneda <b>'
                                    + responseData.tipomoneda+ '</b>. Por favor inserte otra denominaci&oacute;n.' );
                            } else if (responseData.codigo == 3) {
                                mostrarMensaje(3, 'Existe una moneda con el mismo orden para el tipo de moneda <b>'
                                    + responseData.tipomoneda+ '</b>. Por favor inserte otro orden.' );
                            } else {
                                mostrarMensaje(3, 'No se pudo adicionar la moneda');
                            }
                        }
                    });
                } else {
                    mostrarMensaje(3, idioma.lbErrorFormulario);
                }
            }
        }

        function eliminarBilletes() {
            mostrarMensaje(2, idioma.lbTitleEliminarBilletes, function (btn) {
                if (btn == "ok") {
                    //Se muestra la máscara de espera.
                    PVD.mostrarMascara('idmaskeleminarbillete', idioma.lbMsgEsperaEnviarDatos, idioma.lbMsgEliminarBilletes);
                    //Enviando los datos al servidor.

                    Ext.Ajax.request({
                        url: '/pvd/nomina/index.php/nombillete/eliminarBilletes',
                        method: 'POST',
                        params: {idbillete: vista.smBilletes.getSelected().get('idbillete')},
                        callback: function (options, success, response) {
                            //Se oculta la máscara de espera.
                            PVD.ocultarMascara('idmaskeleminarbillete');
                            responseData = Ext.decode(response.responseText);
                            if (responseData.codigo == 1) {
                                //Mostrando el mensaje de que se ha eliminado el billete.
                                mostrarMensaje(1, idioma.lbMsgCorrectoEliminadoBilletes);
                                //Recargando el grid de area.
                                modelo.storeBilletes.load({params: {limit: 1000, start: 0}});

                            } else {
                                if (responseData.codigo)
                                    mostrarMensaje(3, idioma.lbMsgErrorBilletesUso);
                            }
                        }
                    });
                }
            });
        }

        this.keyMap = new Ext.KeyMap(Ext.getDoc(), [
            {
                key: 'imh',
                alt: true,
                stopEvent: true,
                handler: function (k, e) {
                    switch (k) {
                        case 73:
                        { //i para adicionar.
                            if (!vista.btnAdicionarBilletes.disabled && !vista.ventanaBilletes.isVisible()) {
                                mostrarVentanaAdicionarBilletes();
                            }
                            break;
                        }
                        case 77:
                        { //m para modificar .
                            if (!vista.btnModificarBilletes.disabled && !vista.ventanaBilletes.isVisible()) {
                                mostrarVentanaModificarBilletes();
                            }
                            break;
                        }
                        case 72:
                        { //h para ayuda.
                            if (!vista.ventanaBilletes.isVisible()) {
                                vista.btnAyudaBilletes.focus();
                                vista.btnAyudaBilletes.fireEvent('click');
                            }
                            break;
                        }
                    }
                }
            },
            {
                key: 46,//del para eliminar.
                fn: function () {
                    if (!vista.btnEliminarBilletes.disabled && !vista.ventanaBilletes.isVisible()) {
                        eliminarBilletes();
                    }
                }
            },
            {
                key: 13,//enter para aceptar.
                fn: function () {
                    if (vista.btnAceptarBilletes.isVisible()) {
                        vista.btnAceptarBilletes.focus();
                        vista.btnAceptarBilletes.fireEvent('click');
                    }
                }
            }
        ]);
    }
};

variablesGlobales.nombillete_js = 1;
