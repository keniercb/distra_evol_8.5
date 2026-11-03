Ext.ns('Pvd.Nomina.Nomencladores.NomVariableGlobal');

Pvd.Nomina.Nomencladores.NomVariableGlobal.Panel = Ext.extend(Ext.Panel, {
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
        this.modelo = new Pvd_Nomina_Nomencladores_NomVariableGlobal_Modelo();
        this.modelo.init();

        //Inicializando la vista.
        this.vista = new Pvd_Nomina_Nomencladores_NomVariableGlobal_Vista();
        this.vista.init(this.perfil, this.idioma, this.modelo);

        //Inicializar controlador.
        this.controlador = new Pvd_Nomina_Nomencladores_NomVariableGlobal_Controlador();
        this.controlador.init(this.idioma, this.vista, this.modelo);

        this.items = [this.vista.panelCentralVarGlob];

        //Teclas calientes de la interfaz
        this.keyMap = this.controlador.keyMap;

        Pvd.Nomina.Nomencladores.NomVariableGlobal.Panel.superclass.initComponent.call(this);
    },
    listeners: {
        afterlayout: function (x) {
            if (this.mostrar == 1) {
                this.modelo.storeVarGlob.load({params: {limit: 20, start: 0}});
                this.modelo.storeNivelConfig.load();
                this.mostrar = 2;
            }
        },
        destroy: function (x) {
            this.keyMap.disable();
        },
    },
});

//Modelo de la vista del Nomenclador de variables globales.
var Pvd_Nomina_Nomencladores_NomVariableGlobal_Modelo = function () {
    /**
     * Inicializar el modelo de la vista.
     */
    this.init = function () {

        //Store del listado de variables globales.
        this.storeVarGlob = new Ext.data.Store({
            url: '/pvd/nomina/index.php/nomvariableglobal/obtenerListadoVariablesGlobales',
            reader: new Ext.data.JsonReader(
                {totalProperty: "cantidad", autoLoad: true, root: "datos", id: "idvariableglobal"},
                [
                    {name: 'idvariableglobal'}
                    ,
                    {name: 'abreviatura'}
                    ,
                    {name: 'denominacion'}
                    ,
                    {name: 'idnivelconfiguracion'}
                    ,
                    {name: 'denomnivelconfiguracion'}
                    ,
                    {name: 'fechainicio'}
                    ,
                    {name: 'fechafin'}
                    ,
                    {name: 'descripcion'}
                    ,
                    {name: 'lugaresdecimales'}
                ])
        });

        //Store del combo de nivel de configuración.
        this.storeNivelConfig = new Ext.data.Store({
            url: '/pvd/nomina/index.php/nomvariableglobal/obtenerNivelesConfiguracion',
            reader: new Ext.data.JsonReader({
                root: "datos",
                totalProperty: "cantidad",
                id: "idnivelconfiguracion"
            }, [
                {name: 'idnivelconfiguracion'},
                {name: 'denominacion'},
                {name: 'descripcion'}
            ])
        });

    }
};

//Vista del componente Nomenclador de variables globales.
var Pvd_Nomina_Nomencladores_NomVariableGlobal_Vista = function () {
    /**
     * Inicializar la vista.
     *
     * @param perfil Objeto que contiene el perfil de la IU (Tipo: Object).
     * @param idioma Objeto que contiene el idioma de los textos de la IU (Tipo: Object).
     * @param modelo Modelo de la vista del componente Nomenclador de variables globales (Tipo: Pvd_Nomina_Nomencladores_NomVariableGlobal_Modelo).
     */
    this.init = function (perfil, idioma, modelo) {

        var self = this;

        //Listado de variables globales.
        function centrarValor(val) {
            if (val)
                return "<center>" + val + "</center>";
        }

        this.expanderVarGlob = new Ext.grid.RowExpander({
            tpl: new Ext.Template(
                '<div style="word-wrap:break-word;white-space:normal;"><p>&nbsp;&nbsp;Descripci&oacute;n:&nbsp;{descripcion}</p><br/></div>'
            ), enableCaching: false
        });

        this.smVarGlob = new Ext.grid.RowSelectionModel({
            singleSelect: true,
        });

        this.gpVarGlob = new Ext.grid.GridPanel({
            id: 'idgpVarGlob',
            title: idioma.lbTitleVarGlob,
            region: 'center',
            columns: [
                {header: 'idvariableglobal', hidden: true, hideable: false, dataIndex: 'idvariableglobal'}
                ,
                this.expanderVarGlob
                ,
                {
                    header: '<center>' + idioma.lbColAbreviatura + '</center>',
                    width: 70,
                    sortable: true,
                    dataIndex: 'abreviatura',
                    renderer: centrarValor
                }
                ,
                {header: idioma.lbColDenominacion, width: 200, sortable: true, dataIndex: 'denominacion'}
                ,
                {
                    header: '<center>' + idioma.lbColNivelConfig + '</center>',
                    width: 100,
                    sortable: true,
                    dataIndex: 'denomnivelconfiguracion',
                    renderer: centrarValor
                }
                ,
                {
                    header: '<center>' + idioma.lbColLugaresDecimales + '</center>',
                    width: 100,
                    sortable: true,
                    dataIndex: 'lugaresdecimales',
                    renderer: centrarValor
                }
                ,
                {
                    header: '<center>' + idioma.lbColDesde + '</center>',
                    width: 140,
                    sortable: true,
                    dataIndex: 'fechainicio',
                    renderer: centrarValor
                }
                ,
                {
                    header: '<center>' + idioma.lbColHasta + '</center>',
                    width: 140,
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
            store: modelo.storeVarGlob,
            sm: this.smVarGlob,
            plugins: this.expanderVarGlob,
            loadMask: {msg: idioma.lbMaskGridCargando},
            bbar: new Ext.PagingToolbar({
                pageSize: 1000,
                store: modelo.storeVarGlob,
                displayInfo: true,
                displayMsg: 'Mostrando  {0} - {1} de {2}',
                emptyMsg: "0 Resultado a mostrar"
            }),
        });

        //Botones de Add, Mod, Elim, Ayud de variables globales.
        this.btnAdicionarVarGlob = new Ext.Button({
            id: 'btnAddVarGlob',
            text: idioma.lbBtnAdicionar,
            tooltip: idioma.textToolTipAddVarGlob,
            // icon: perfil.dirImg+'adicionar.png',
            iconCls: 'adicionar',
            prevTab: 'btnAyudaVarGlob',
            nextTab: 'btnModVarGlob',
        });

        this.btnModificarVarGlob = new Ext.Button({
            id: 'btnModVarGlob',
            text: idioma.lbBtnModificar,
            tooltip: idioma.textToolTipModVarGlob,
            // icon: perfil.dirImg+'modificar.png',
            iconCls: 'modificar',
            prevTab: 'btnAddVarGlob',
            nextTab: 'btnElimVarGlob',
        });

        this.btnEliminarVarGlob = new Ext.Button({
            id: 'btnElimVarGlob',
            text: idioma.lbBtnEliminar,
            tooltip: idioma.textToolTipElimVarGlob,
            // icon: perfil.dirImg+'eliminar.png',
            iconCls: 'eliminar',
            prevTab: 'btnModVarGlob',
            nextTab: 'btnAyudaVarGlob',
        });

        this.btnExportarVarGlob = new Ext.Button({
            id: 'btnExportarVarGlob',
            text: 'Exportar',
            tooltip: 'Exportar',
            iconCls: 'exportar'
        });

        this.btnAyudaVarGlob = new Ext.Button({
            id: 'btnAyudaVarGlob',
            text: idioma.lbBtnAyuda,
            tooltip: idioma.textToolTipAyudaVarGlob,
            // icon:perfil.dirImg+'ayuda.png',
            iconCls: 'ayuda',
            prevTab: 'btnElimVarGlob',
            nextTab: 'btnAddVarGlob',
        });

        //Panel contenedor del grid de variables globales. 
        this.panelCentralVarGlob = new Ext.Panel({
            id: 'panelCentralVarGlob',
            region: 'center',
            heigth: '100%',
            width: '100%',
            border: false,
            layout: 'fit',
            tbar: [this.btnAdicionarVarGlob, this.btnModificarVarGlob, this.btnEliminarVarGlob, this.btnExportarVarGlob, '->', this.btnAyudaVarGlob],
            items: [this.gpVarGlob],
        });

        //Campo del formulario de variables globales.
        this.tfAbrevVarGlob = new Ext.form.TextField({
            id: 'idtfAbrevVarGlob', fieldLabel: idioma.lbColAbreviatura,
            tabIndex: 1, name: 'abreviatura', allowBlank: false,
            anchor: '90%', prevTab: 'idbtnAceptarVarGlob',
            nextTab: 'idtfDenomVarGlob',
            regex: /^([a-zA-ZÁÉÍÓÚáéíóúñüÑ\d]+(\d*)?)+$/,
            regexText: idioma.lbAbrevIncorr, //maskRe
            blankText: idioma.lbErrorCampoVacio,
            maxLength: 10,
            maxLengthText: idioma.lbMaxText_10,
        });
        this.tfDenomVarGlob = new Ext.form.TextField({
            id: 'idtfDenomVarGlob', fieldLabel: idioma.lbColDenominacion,
            tabIndex: 2, name: 'denominacion', allowBlank: false, anchor: '99%',
//                                        regex:/^([a-zA-ZÁÉÍÓÚáéíóúñüÑ\d ]+(\d*)?)+$/,
            vtype: 'vtdenominaciones',
            regexText: idioma.lbDenomIncorr, //maskRe
            blankText: idioma.lbErrorCampoVacio,
            maxLength: 100,
            maxLengthText: idioma.lbMaxText_100,
        });
        this.cbNivelConfig = new Ext.form.ComboBox({
            id: 'idcbNivelConfig', fieldLabel: idioma.lbColNivelConfig,
            tabIndex: 3, valueField: 'idnivelconfiguracion',
            displayField: 'denominacion', hiddenName: 'idnivelconfiguracion',
            allowBlank: false, mode: 'local',
            store: modelo.storeNivelConfig, emptyText: 'Seleccione...',
            blankText: idioma.lbErrorCampoVacio, readOnly: true,
            triggerAction: 'all', anchor: '90%'
        });
        this.nfCantidadLugaresDecimales = new Ext.form.NumberField({
            id: 'idnfCantidadLugaresDecimales',
            fieldLabel: idioma.lbColLugaresDecimalesNf,
            tabIndex: 4,
            name: 'lugaresdecimales', allowBlank: false,
            anchor: '99%',
            blankText: idioma.lbErrorCampoVacio,
            maskRe: /[0-6]/i,
            regex: /^[0-6]$/i,
            regexText: idioma.lbErrorFormatoNum,
            maxValue: 4,
            maxText: idioma.lbErrorFormatoNum,
        });

        this.dfFInicioVarGlob = new Ext.form.DateField({
            id: 'dfFInicioVarGlob', fieldLabel: idioma.lbColDesde,
            tabIndex: 5, name: 'fechainicio', allowBlank: false,
            format: 'd/m/Y', editable: true, readOnly: false,
            value: new Date().format('d/m/Y'), maxText: idioma.lbFechaMaxima,
            minText: idioma.lbFechaMinima, blankText: idioma.lbErrorCampoVacio,
            invalidText: idioma.invalidTextFecha, vtype: 'daterange',
            anchor: '90%', endDateField: 'dfFFinVarGlob'
        });
        this.dfFFinVarGlob = new Ext.form.DateField({
            id: 'dfFFinVarGlob', fieldLabel: idioma.lbColHasta,
            tabIndex: 6, name: 'fechafin', xtype: 'datefield', allowBlank: true,
            format: 'd/m/Y', editable: true, readOnly: false,
            maxText: idioma.lbFechaMaxima, minText: idioma.lbFechaMinima,
            blankText: idioma.lbErrorCampoVacio, invalidText: idioma.invalidTextFecha,
            vtype: 'daterange', anchor: '99%', startDateField: 'dfFInicioVarGlob'
        });
        this.tfDescripVarGlob = new Ext.form.TextArea({
            id: 'idtfDescripVarGlob',
            fieldLabel: idioma.lbColDescripcion, tabIndex: 7,
            name: 'descripcion', allowBlank: true,
            hiddenname: 'descripcion',
            maxLength: 255,
            maxLengthText: idioma.lbMaxText_255,
            anchor: '99%', prevTab: 'dfFFinVarGlob', nextTab: 'idbtnCancelarVarGlob',
            blankText: idioma.lbErrorCampoVacio,
        });

        //Formulario de variables globales.
        this.formularioVarGlob = new Ext.FormPanel({
            id: 'idformularioVarGlob',
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
                        {columnWidth: .3, layout: 'form', items: [this.tfAbrevVarGlob]},
                        {columnWidth: .7, layout: 'form', items: [this.tfDenomVarGlob]},
                    ]
                },
                {
                    layout: 'column',
                    items: [
                        {columnWidth: .65, layout: 'form', items: [this.cbNivelConfig]},
                        {columnWidth: .35, layout: 'form', items: [this.nfCantidadLugaresDecimales]},
                    ]
                },
                {
                    layout: 'column',
                    items: [
                        {columnWidth: .54, layout: 'form', items: [this.dfFInicioVarGlob]},
                        {columnWidth: .46, layout: 'form', items: [this.dfFFinVarGlob]}
                    ]
                },
                this.tfDescripVarGlob
            ],
        });

        //Botones de la ventana de adicionar variables globales.
        this.btnCancelarVarGlob = new Ext.Button({
            id: 'idbtnCancelarVarGlob',
            iconCls: 'cancelar',
            // icon:perfil.dirImg+'cancelar.png',
            text: idioma.lbBtnCancelar,
            tooltip: idioma.textToolTipCancelar,
            prevTab: 'idtfDescripVarGlob',
            nextTab: 'idbtnAplicarVarGlob',
        });

        this.btnAplicarVarGlob = new Ext.Button({
            id: 'idbtnAplicarVarGlob',
            iconCls: 'aplicar',
            //  icon:perfil.dirImg+'aplicar.png',
            text: idioma.lbBtnAplicar,
            tooltip: idioma.textToolTipAplicar,
            prevTab: 'idbtnCancelarVarGlob',
            nextTab: 'idbtnAceptarVarGlob',
        });

        this.btnAceptarVarGlob = new Ext.Button({
            id: 'idbtnAceptarVarGlob',
            iconCls: 'aceptar',
            // icon:perfil.dirImg+'aceptar.png',
            text: idioma.lbBtnAceptar,
            tooltip: idioma.textToolTipAceptar,
            prevTab: 'idbtnAplicarVarGlob',
            nextTab: 'idtfAbrevVarGlob',
        });

        //Ventana de adicionar y modificar variables globales.
        this.ventanaVarGlob = new Ext.Window({
            modal: true,
            closeAction: 'hide',
            autoHeight: true,
            width: '400',
            closable: true,
            resizable: false,
            layout: 'fit',
            constrain: true,
            autoValidate: true,
            validateDefault: true,
            items: [this.formularioVarGlob],
            buttons: [this.btnCancelarVarGlob, this.btnAplicarVarGlob, this.btnAceptarVarGlob],
            keys: [
                {
                    key: Ext.EventObject.ENTER,
                    stopEvent: true,
                    fn: function () {
                        if (!self.btnAceptarVarGlob.disabled) {
                            self.btnAceptarVarGlob.handler();
                        }
                    }
                },
                {
                    key: 'x',
                    alt: true,
                    stopEvent: true,
                    fn: function () {
                        if (!self.btnCancelarVarGlob.disabled) {
                            self.btnCancelarVarGlob.handler();
                        }
                    }
                },
                {
                    key: 'p',
                    alt: true,
                    stopEvent: true,
                    fn: function () {
                        if (!self.btnAplicarVarGlob.disabled) {
                            self.btnAplicarVarGlob.handler();
                        }
                    }
                }
            ]
        });
    }
};

//Controlador de la vista del Nomenclador de variables globales.
var Pvd_Nomina_Nomencladores_NomVariableGlobal_Controlador = function () {
    /**
     * Inicializar el controlador de la vista.
     *
     * @param idioma Objeto que contiene el idioma de los textos de la IU (Tipo: Object).
     * @param vista Vista del componente Nomenclador de variables globales (Tipo: Pvd_Nomina_Nomencladores_NomVariableGlobal_Vista)
     * @param modelo Modelo de la vista del componente Nomenclador de variables globales(Tipo: Pvd_Nomina_Nomencladores_NomVariableGlobal_Modelo)
     */
    this.init = function (idioma, vista, modelo) {

        var _vista = vista;

        /**
         *Variables generales
         */
        var variablesVarGlob = {
            accion: 'Add',
            cambio: 0,
        };

        //Eventos del grid de variables globales.
        vista.gpVarGlob.on('rowdblclick', function (e) {
            mostrarVentanaModificarVarGlob();
        });

        vista.gpVarGlob.on('destroy', function (e) {
            vista.ventanaVarGlob.destroy();
        });

        //Eventos del store de variables globales.
        modelo.storeVarGlob.on('beforeload', function (store) {
            vista.btnModificarVarGlob.disable();
            vista.btnEliminarVarGlob.disable();
            store.removeAll();
        });

        modelo.storeVarGlob.on('load', function (store, records, opt) {
            if (!records.length) {
                mostrarMensaje(1, idioma.lbMsgNoExistenDatos);
            }
        });

        //Eventos del seleccion model del grid.
        vista.smVarGlob.on('rowselect', function () {
            vista.btnModificarVarGlob.enable();
            vista.btnEliminarVarGlob.enable();
        });

        //Eventos de campo de abreviatura.
        vista.tfAbrevVarGlob.on('change', function (tf, n, o) {
            variablesVarGlob.cambio = 1;
        });

        //Eventos de campo de denominacion. 
        vista.tfDenomVarGlob.on('change', function (tf, n, o) {
            variablesVarGlob.cambio = 1;
        });

        //Eventos de campo de nivel de configuración. 
        vista.cbNivelConfig.on('change', function (tf, n, o) {
            variablesVarGlob.cambio = 1;
        });

        //Eventos de campo de fecha inicio. 
        vista.dfFInicioVarGlob.on('change', function (tf, n, o) {
            variablesVarGlob.cambio = 1;
        });

        //Eventos de campo de fecha fin. 
        vista.dfFFinVarGlob.on('change', function (tf, n, o) {
            variablesVarGlob.cambio = 1;
        });

        //Eventos de campo de descripcion. 
        vista.tfDescripVarGlob.on('change', function (tf, n, o) {
            variablesVarGlob.cambio = 1;
        });

        //Eventos de campo de descripcion.
        vista.nfCantidadLugaresDecimales.on('change', function (tf, n, o) {
            variablesVarGlob.cambio = 1;
        });

        //Eventos del botón adicionar.
        vista.btnAdicionarVarGlob.setHandler(function () {
            mostrarVentanaAdicionarVarGlob();
        });

        //Eventos del botón modificar.
        vista.btnModificarVarGlob.setHandler(function () {
            mostrarVentanaModificarVarGlob();
        });

        //Eventos del botón eliminar.
        vista.btnEliminarVarGlob.setHandler(function () {
            eliminarVarGlob();
        });

        //Exportar
        vista.btnExportarVarGlob.on('click', function () {
            var winload = new Ext.PVD.comun.window.winLoad({
                title: 'Por favor espere...',
                mensaje: 'Generando reporte'
            });
            winload.showMask();
            var iframe = document.createElement("iframe");
            iframe.src = document.location.protocol + '//' + document.location.host +
                '/pvd/nomina/index.php/nomvariableglobal/exportarNomenclador';
            iframe.style.display = 'none';
            var that = this;
            iframe.onload = function () {
                winload.hideMask();
                //that.destroy();
            };
            document.body.appendChild(iframe);
        });

        //Eventos del botón cancelar.
        vista.btnCancelarVarGlob.setHandler(function () {
            vista.ventanaVarGlob.hide();
//            vista.formularioVarGlob.purgeListeners();
        });

        //Eventos del botón aplicar.
        vista.btnAplicarVarGlob.setHandler(function () {
            salvarFormularioVarGlob(true);
        });

        //Eventos del botón aceptar.
        vista.btnAceptarVarGlob.setHandler(function () {
            salvarFormularioVarGlob(false);
//            vista.formularioVarGlob.purgeListeners();
        });

        //Evento de la ventana de adicionar/modificar 
        vista.ventanaVarGlob.on('beforeshow', function (ventana) {
            vista.formularioVarGlob.getForm().reset();
            vista.tfAbrevVarGlob.focus(true, 500);
        });


        /*
         *Función de mostrar la ventana de adicionar.
         */
        function mostrarVentanaAdicionarVarGlob() {
            vista.ventanaVarGlob.setTitle(idioma.lbTitleVentAdicionarVarGlob);
            vista.btnAplicarVarGlob.show();
            vista.ventanaVarGlob.show();
            //Actualizar la tabulación deL formulario.
            vista.btnCancelarVarGlob.setNextElement('idbtnAplicarVarGlob');
            vista.btnAceptarVarGlob.setPreviousElement('idbtnAplicarVarGlob');
            variablesVarGlob.accion = 'Add';
        }

        /*
         *Función de mostrar la ventana de modificar.
         */
        function mostrarVentanaModificarVarGlob() {
            vista.ventanaVarGlob.setTitle(idioma.lbTitleVentModificarVarGlob);
            vista.btnAplicarVarGlob.hide();
            vista.ventanaVarGlob.show();
            //Actualizar la tabulación deL formulario.
            vista.btnCancelarVarGlob.setNextElement('idbtnAceptarVarGlob');
            vista.btnAceptarVarGlob.setPreviousElement('idbtnCancelarVarGlob');
            vista.formularioVarGlob.getForm().loadRecord(vista.smVarGlob.getSelected());
//            vista.formularioVarGlob.addListener('clientvalidation', function (_form, _valid) {
//                if (comparar(vista.formularioVarGlob.getForm().getValues(), vista.smVarGlob.getSelected().data)) {
//                    vista.btnAceptarVarGlob.setDisabled(true);
//                } else {
//                    vista.btnAceptarVarGlob.enable();
//                }
//            });

            variablesVarGlob.accion = 'Mod';
        }

        /*
         *Función para adicionar/modificar una variable global.
         */
        function salvarFormularioVarGlob(boton) {

            var urlAction = '/pvd/nomina/index.php/nomvariableglobal/adicionarVariableGlobal';
            var idvariableglobal = 0;
            var lbMsgEspera = idioma.lbMsgAdicionarVarGlob;
            var lbMsgExito = idioma.lbMsgCorrectoAdicionadoVarGlob;

            if (variablesVarGlob.accion == 'Mod') {
                lbMsgEspera = idioma.lbMsgModificarVarGlob;
                lbMsgExito = idioma.lbMsgCorrectoModificadoVarGlob;
                urlAction = '/pvd/nomina/index.php/nomvariableglobal/modificarVariableGlobal';
                idvariableglobal = vista.smVarGlob.getSelected().get('idvariableglobal');
            }
            if (variablesVarGlob.cambio == 0) {
                if (variablesVarGlob.accion == 'Mod') {
                    //Se oculta la ventana si no ha sido modificado ningún valor.
                    vista.ventanaVarGlob.hide();
                } else {
                    //Se marcan como obligatorios en caso de presionar aceptar y se encuentren vacíos.
                    vista.tfAbrevVarGlob.markInvalid(idioma.lbErrorCampoVacio);
                    vista.tfDenomVarGlob.markInvalid(idioma.lbErrorCampoVacio);
                    vista.cbNivelConfig.markInvalid(idioma.lbErrorCampoVacio);
                    vista.nfCantidadLugaresDecimales.markInvalid(idioma.lbErrorCampoVacio);
                    mostrarMensaje(3, idioma.lbErrorFormulario);
                }
            } else {
                //Se verifica si el formulario es válido y si el campo sueldo contiene un valor
                if (vista.formularioVarGlob.getForm().isValid()) {

                    //Se muestra la máscara de espera.
                    PVD.mostrarMascara('idmaskaddmodvarglobal', idioma.lbMsgEsperaEnviarDatos, lbMsgEspera);

                    //Enviando datos al servidor.
                    Ext.Ajax.request({
                        url: urlAction,
                        method: 'POST',
                        params: {
                            idvariableglobal: idvariableglobal,
                            abreviatura: vista.tfAbrevVarGlob.getValue(),
                            denominacion: vista.tfDenomVarGlob.getValue(),
                            idnivelconfig: vista.cbNivelConfig.getValue(),
                            fechainicio: vista.dfFInicioVarGlob.getRawValue(),
                            fechafin: vista.dfFFinVarGlob.getRawValue(),
                            descripcion: vista.tfDescripVarGlob.getValue(),
                            lugaresdecimales: vista.nfCantidadLugaresDecimales.getValue(),
                        },
                        callback: function (options, success, response) {
                            responseData = Ext.decode(response.responseText);

                            //Ocultando máscara de enviar datos.
                            PVD.ocultarMascara('idmaskaddmodvarglobal');

                            if (responseData.codigo == 1) {
                                mostrarMensaje(1, lbMsgExito);
                                if (!boton) {
                                    vista.ventanaVarGlob.hide();

                                } else {
                                    vista.tfAbrevVarGlob.focus(true, 500);
                                }
                                vista.formularioVarGlob.getForm().reset();
                                modelo.storeVarGlob.removeAll();
                                modelo.storeVarGlob.load({params: {limit: 20, start: 0}});
                                variablesVarGlob.cambio = 0;


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
         *Función para eliminar una variable global.
         */
        function eliminarVarGlob() {
            //Mostrando el mensaje para aceptar el eliminar una variable global.
            mostrarMensaje(2, idioma.lbTitleEliminarVarGlob, function (btn) {
                if (btn == "ok") {
                    //Se muestra la máscara de espera.
                    PVD.mostrarMascara('idmaskeleminarvarglobal', idioma.lbMsgEsperaEnviarDatos, idioma.lbMsgEliminarVarGlob);
                    //Enviando los datos al servidor.
                    Ext.Ajax.request({
                        url: '/pvd/nomina/index.php/nomvariableglobal/eliminarVariableGlobal',
                        method: 'POST',
                        params: {idvariableglobal: vista.smVarGlob.getSelected().get('idvariableglobal')},
                        callback: function (options, success, response) {
                            //Se oculta la máscara de espera.
                            PVD.ocultarMascara('idmaskeleminarvarglobal');
                            responseData = Ext.decode(response.responseText);
                            if (responseData.codigo == 1) {
                                //Mostrando el mensaje de que se ha eliminado la variable global.
                                mostrarMensaje(1, idioma.lbMsgCorrectoEliminadoVarGlob);
                                //Recargando el grid de variables globales.
                                modelo.storeVarGlob.load({params: {limit: 20, start: 0}});

                            } else {
                                if (responseData.codigo)
                                    mostrarMensaje(responseData.codigo, idioma.lbMsgErrorVariableGlobalUso);
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
                            if (!vista.btnAdicionarVarGlob.disabled && !vista.ventanaVarGlob.isVisible()) {
                                mostrarVentanaAdicionarVarGlob();
                            }
                            break;
                        }
                        case 77: { //m para modificar .
                            if (!vista.btnModificarVarGlob.disabled && !vista.ventanaVarGlob.isVisible()) {
                                mostrarVentanaModificarVarGlob();
                            }
                            break;
                        }
                        case 72: { //h para ayuda.
                            if (!vista.ventanaVarGlob.isVisible()) {
                                vista.btnAyudaVarGlob.focus();
                                vista.btnAyudaVarGlob.fireEvent('click');
                            }
                            break;
                        }
                    }
                }
            },
            {
                key: 46,//del para eliminar.
                fn: function () {
                    if (!vista.btnEliminarVarGlob.disabled && !vista.ventanaVarGlob.isVisible()) {
                        eliminarVarGlob();
                    }
                },
            },
            {
                key: 13,//enter para aceptar.
                fn: function () {
                    if (vista.btnAceptarVarGlob.isVisible()) {
                        vista.btnAceptarVarGlob.focus();
                        vista.btnAceptarVarGlob.fireEvent('click');
                    }
                },
            }
        ]);
    }
};

variablesGlobales.nomvariableglobal_js = 1;
