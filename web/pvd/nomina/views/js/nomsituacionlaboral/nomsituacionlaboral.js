Ext.ns('Pvd.Nomina.Nomencladores.NomSituacionLaboral');

Pvd.Nomina.Nomencladores.NomSituacionLaboral.Panel = Ext.extend(Ext.Panel, {
    layout       : 'fit',
    region       : 'center',
    heigth       : '100%',
    width        : '100%',
    border       : false,
    frame        : false,
    hideBorders  : true,
    perfil       : this.perfil,
    idioma       : this.idioma,
    mostrar      : 1,
    initComponent: function () {

        //Inicializando el modelo.
        this.modelo = new Pvd_Nomina_Nomencladores_NomSituacionLaboral_Modelo();
        this.modelo.init();

        //Inicializando la vista.
        this.vista = new Pvd_Nomina_Nomencladores_NomSituacionLaboral_Vista();
        this.vista.init(this.perfil, this.idioma, this.modelo);

        //Inicializar controlador.
        this.controlador = new Pvd_Nomina_Nomencladores_NomSituacionLaboral_Controlador();
        this.controlador.init(this.idioma, this.vista, this.modelo);

        this.items = [this.vista.panelCentralSitLaboral];

        //Teclas calientes de la interfaz
        this.keyMap = this.controlador.keyMap;

        Pvd.Nomina.Nomencladores.NomSituacionLaboral.Panel.superclass.initComponent.call(this);
    },
    listeners    : {
        afterlayout: function (x) {
            if (this.mostrar == 1) {
                this.modelo.storeSituacionLaboral.load({params: {limit: 1000, start: 0}});
                this.mostrar = 2;
            }
        },
        destroy    : function (x) {
            this.keyMap.disable();
        }
    }
});

//Modelo de la vista del Nomenclador de situaciones laborales.
var Pvd_Nomina_Nomencladores_NomSituacionLaboral_Modelo = function () {
    /**
     * Inicializar el modelo de la vista.
     */
    this.init = function () {

        //Store del listado de situaciones laborales.
        this.storeSituacionLaboral = new Ext.data.Store({
            url   : '/pvd/nomina/index.php/nomsituacionlaboral/obtenerListadoSituacionesLaborales',
            reader: new Ext.data.JsonReader(
                {totalProperty: "cantidad", autoLoad: true, root: "datos", id: "idsituacionlaboral" },
                [
                    {name: 'idsituacionlaboral'}
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
                    //,{name: 'asociadoalcargo'}
                ])
        });

        //Store del combo de asociado a cargo.
        this.storeAsociada = new Ext.data.SimpleStore({
            fields: [
                {name: 'asociadoalcargo'}
                ,
                {name: 'denominacion'}
            ],
            data  : [
                [1, 'Si'],
                [2, 'No']
            ]
        });

        this.storeConceptopd = new Ext.data.Store({
            //  url: '/pvd/nomina/index.php/nomsituacionlaboral/cargarconcepto',
            reader: new Ext.data.JsonReader({
                root         : "datos",
                totalProperty: "cantidad",
                id           : "idtarifa"
            }, [
                {name: 'idtarifa'},
                {name: 'denomtarifa'}
            ])
        });

    }
};

//Vista del componente Nomenclador de situaciones laborales.
var Pvd_Nomina_Nomencladores_NomSituacionLaboral_Vista = function () {
    /**
     * Inicializar la vista.
     *
     * @param perfil Objeto que contiene el perfil de la IU (Tipo: Object).
     * @param idioma Objeto que contiene el idioma de los textos de la IU (Tipo: Object).
     * @param modelo Modelo de la vista del componente Nomenclador de situaciones laborales (Tipo: Pvd_Nomina_Nomencladores_NomSituacionLaboral_Modelo).
     */
    this.init = function (perfil, idioma, modelo) {

        var self = this;

        //Listado de situaciones laborales.
        function centrarValor(val) {
            if (val)
                return "<center>" + val + "</center>";
        }

        function formatearAsociadaCargo(val) {
            if (val == 1)
                return "<center>Si</center>";
            else
                return "<center>No</center>";
        }

        this.expanderSitLaboral = new Ext.grid.RowExpander({
            tpl             : new Ext.Template(
                '<div style="word-wrap:break-word;white-space:normal;"><p>&nbsp;&nbsp;Descripci&oacute;n:&nbsp;{descripcion}</p><br/></div>'
            ), enableCaching: false
        });

        this.smSitLaboral = new Ext.grid.RowSelectionModel({
            singleSelect: true,
        });

        this.gpSitLaboral = new Ext.grid.GridPanel({
            id        : 'idgpSitLaboral',
            title     : idioma.lbTitleSitLaboral,
            region    : 'center',
            columns   : [
                {header: 'idsituacionlaboral', hidden: true, hideable: false, dataIndex: 'idsituacionlaboral'}
                ,
                this.expanderSitLaboral
                ,
                {header: '<center>' + idioma.lbColAbreviatura + '</center>', width: 67, sortable: true, dataIndex: 'abreviatura', renderer: centrarValor}
                ,
                {header: idioma.lbColDenominacion, width: 400, sortable: true, dataIndex: 'denominacion'}
                //,{header: '<center>'+idioma.lbColAsociadoCargo+'</center>', width: 90, sortable: true, dataIndex: 'asociadoalcargo', renderer : formatearAsociadaCargo}
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
            plugins   : this.expanderSitLaboral,
            viewConfig: {forceFit: true},
            store     : modelo.storeSituacionLaboral,
            sm        : this.smSitLaboral,
            loadMask  : {msg: idioma.lbMaskGridCargando},
            bbar      : new Ext.PagingToolbar({
                pageSize   : 1000,
                store      : modelo.storeSituacionLaboral,
                displayInfo: true,
                displayMsg : 'Mostrando  {0} - {1} de {2}',
                emptyMsg   : "0 Resultado a mostrar"
            }),
        });

        //Botones de Add, Mod, Elim, Ayud de situaciones laborales.
        this.btnAdicionarSitLaboral = new Ext.Button({
            id     : 'btnAddSitLaboral',
            text   : idioma.lbBtnAdicionar,
            tooltip: idioma.textToolTipAddSitLaboral,
            // icon: perfil.dirImg+'adicionar.png',
            iconCls: 'adicionar',
            prevTab: 'btnAyudaSitLaboral',
            nextTab: 'btnModSitLaboral'
        });

        this.btnModificarSitLaboral = new Ext.Button({
            id     : 'btnModSitLaboral',
            text   : idioma.lbBtnModificar,
            tooltip: idioma.textToolTipModSitLaboral,
            // icon: perfil.dirImg+'modificar.png',
            iconCls: 'modificar',
            prevTab: 'btnAddSitLaboral',
            nextTab: 'btnElimSitLaboral'
        });

        this.btnEliminarSitLaboral = new Ext.Button({
            id     : 'btnElimSitLaboral',
            text   : idioma.lbBtnEliminar,
            tooltip: idioma.textToolTipElimSitLaboral,
            //  icon: perfil.dirImg+'eliminar.png',
            iconCls: 'eliminar',
            prevTab: 'btnModSitLaboral',
            nextTab: 'btnAyudaSitLaboral'
        });

        this.btnExportarSitLaboral = new Ext.Button({
            id: 'btnExportarSitLaboral',
            text: 'Exportar',
            tooltip: 'Exportar',
            iconCls: 'exportar'
        });

        this.btnAyudaSitLaboral = new Ext.Button({
            id     : 'btnAyudaSitLaboral',
            text   : idioma.lbBtnAyuda,
            tooltip: idioma.textToolTipAyudaSitLaboral,
            // icon:perfil.dirImg+'ayuda.png',
            iconCls: 'ayuda',
            prevTab: 'btnElimSitLaboral',
            nextTab: 'btnAddSitLaboral'
        });

        //Panel contenedor del grid de situaciones laborales. 
        this.panelCentralSitLaboral = new Ext.Panel({
            id    : 'panelCentralSitLaboral',
            region: 'center',
            heigth: '100%',
            width : '100%',
            border: false,
            layout: 'fit',
            tbar  : [this.btnAdicionarSitLaboral, this.btnModificarSitLaboral, this.btnEliminarSitLaboral,this.btnExportarSitLaboral, '->', this.btnAyudaSitLaboral],
            items : [this.gpSitLaboral]
        });

        //Campo del formulario de situaciones laborales,
        this.tfAbrevSitLaboral = new Ext.form.TextField({id: 'idtfAbrevSitLaboral', fieldLabel: idioma.lbColAbreviatura,
            tabIndex                                       : 2, name: 'abreviatura', allowBlank: false,
            anchor                                         : '99%',
            regex                                          : /^([a-zA-ZÁÉÍÓÚáéíóúñüÑ\d]+(\d*)?)+$/,
            regexText                                      : idioma.lbAbrevIncorr, //maskRe
            maxLength                                      : 10,
            maxLengthText                                  : idioma.lbMaxText_10,
            blankText                                      : idioma.lbErrorCampoVacio,
        });
        this.tfDenomSitLaboral = new Ext.form.TextField({id: 'idtfDenomSitLaboral', fieldLabel: idioma.lbColDenominacion,
            tabIndex                                       : 1, name: 'denominacion', allowBlank: false, anchor: '99%',
            blankText                                      : idioma.lbErrorCampoVacio,
//                                        regex:/^([a-zA-ZÁÉÍÓÚáéíóúñüÑ\d ]+(\d*)?)+$/,
            vtype                                          : 'vtdenominaciones',
            regexText                                      : idioma.lbDenomIncorr, //maskRe
            blankText                                      : idioma.lbErrorCampoVacio,
            maxLength                                      : 100,
            maxLengthText                                  : idioma.lbMaxText_100,
            prevTab                                        : 'idbtnAceptarSitLaboral',
            nextTab                                        : 'idtfAbrevSitLaboral',
        });
        this.dfFInicioSitLaboral = new Ext.form.DateField({id: 'dfFInicioSitLaboral', fieldLabel: idioma.lbColDesde,
            tabIndex                                         : 4, name: 'fechainicio', allowBlank: false,
            format                                           : 'd/m/Y', editable: true, readOnly: false,
            value                                            : new Date().format('d/m/Y'), maxText: idioma.lbFechaMaxima,
            minText                                          : idioma.lbFechaMinima, blankText: idioma.lbErrorCampoVacio,
            invalidText                                      : idioma.invalidTextFecha, vtype: 'daterange',
            anchor                                           : '85%', endDateField: 'dfFFinSitLaboral'
        });
        this.dfFFinSitLaboral = new Ext.form.DateField({id: 'dfFFinSitLaboral', fieldLabel: idioma.lbColHasta,
            tabIndex                                      : 5, name: 'fechafin', xtype: 'datefield', allowBlank: true,
            format                                        : 'd/m/Y', editable: true, readOnly: false,
            maxText                                       : idioma.lbFechaMaxima, minText: idioma.lbFechaMinima,
            blankText                                     : idioma.lbErrorCampoVacio, invalidText: idioma.invalidTextFecha,
            vtype                                         : 'daterange', anchor: '99%', startDateField: 'dfFInicioSitLaboral'
        });
        this.tfDescripSitLaboral = new Ext.form.TextArea({id: 'idtfDescripSitLaboral',
            fieldLabel                                      : idioma.lbColDescripcion, tabIndex: 6,
            name                                            : 'descripcion', allowBlank: true,
            hiddenname                                      : 'descripcion',
            maxLength                                       : 255,
            maxLengthText                                   : idioma.lbMaxText_255,
            anchor                                          : '99%', prevTab: 'dfFFinSitLaboral', nextTab: 'idbtnCancelarSitLaboral',
            blankText                                       : idioma.lbErrorCampoVacio,
        });
        this.cbAsociadoCargo = new Ext.form.ComboBox({id: 'idasociado', fieldLabel: idioma.lbCbAsocCargo,
            tabIndex                                    : 3, valueField: 'asociadoalcargo',
            displayField                                : 'denominacion', hiddenName: 'asociadoalcargo',
            allowBlank                                  : false, mode: 'local',
            store                                       : modelo.storeAsociada,
            emptyText                                   : 'Seleccione...',
            blankText                                   : idioma.lbErrorCampoVacio,
            readOnly                                    : false,
            triggerAction                               : 'all', anchor: '99%'
        });
        this.cbConceptopd = new Ext.form.ComboBox({id: 'idconceptopd', fieldLabel: idioma.lbcbConceptopd,
            tabIndex                                 : 3, valueField: 'conceptopd',
            displayField                             : 'denominacion', hiddenName: 'conceptopd',
            allowBlank                               : false, mode: 'local',
            store                                    : modelo.storeConceptopd,
            emptyText                                : 'Seleccione...',
            blankText                                : idioma.lbErrorCampoVacio,
            readOnly                                 : false,
            triggerAction                            : 'all', anchor: '99%'
        });


        this.cbConceptopd1 = new Ext.components.TreeComboBox({
            anchor    : "99%",
            allowBlank: false,
            blankText : 'Este campo es obligatorio',
            fieldLabel: 'Conceptos percepción y descuento',
            id        : 'idcbConceptopd',
            // prevTab: 'idbtnEliminarEscala',
            //nextTab: 'idnfImporte',
            treeConfig: {
                rootVisible: false,
                loader     : new Ext.tree.TreeLoader({
                    dataUrl        : '/pvd/nomina/index.php/nomsituacionlaboral/cargarconcepto',
                    preloadChildren: false,
                    listeners      : {
                        beforeload: function (treeLoader, node, response) {
                            this.cbConceptopd1.reset();
                            // this.cbEscala.disable();
                            // treeLoader.baseParams.idtipoconceptopd = this.conceptoseleccionado.data.idtipoconceptopd;
                            //  treeLoader.baseParams.idconfconceptopercepciondescuento = this.conceptoseleccionado.data.idconfconceptospdelementossalariales;
                            // treeLoader.baseParams.idtarifa = this.conceptoseleccionado.data.idtarifa;
                            //  treeLoader.baseParams.tipo = this.tipo;
                        }.createDelegate(this),
                        load      : function (treeLoader, node, response) {
                            //  this.cbEscala.enable();

                        }.createDelegate(this)

                    }
                }),
                border     : false,
                autoScroll : true,
                listeners  : {
                    click: function (node, e) {
                        // console.info(node);
                        self.cambio = 1;
                    }
                }
            }
        });

        //Formulario de situaciones laborales.
        this.formularioSitLaboral = new Ext.FormPanel({
            id        : 'idformlario',
            labelAlign: 'top',
            //buttonAlign: 'right',
            frame     : true,
            width     : 300,
            autoHeight: true,
            bodyStyle : {
                padding: '10px 10px 10px 10px',
            },
            items     : [this.tfDenomSitLaboral/*, this.cbConceptopd1*/, this.tfAbrevSitLaboral
                /*  {layout:'column',
                 items:[
                 {columnWidth:.54, layout: 'form', items: [this.tfAbrevSitLaboral]},
                 // {columnWidth:.46, layout: 'form', items: [this.cbAsociadoCargo]}
                 ]
                 }*/,
                {layout  : 'column',
                    items: [
                        {columnWidth: .54, layout: 'form', items: [this.dfFInicioSitLaboral]},
                        {columnWidth: .46, layout: 'form', items: [this.dfFFinSitLaboral]},
                    ]
                },
                this.tfDescripSitLaboral
            ],
        });

        //Botones de la ventana de adicionar situaciones laborales.
        this.btnCancelarSitLaboral = new Ext.Button({
            id     : 'idbtnCancelarSitLaboral',
            iconCls: 'cancelar',
            // icon:perfil.dirImg+'cancelar.png',
            text   : idioma.lbBtnCancelar,
            tooltip: idioma.textToolTipCancelar,
            prevTab: 'idtfDescripSitLaboral',
            nextTab: 'idbtnAplicarSitLaboral'
        });

        this.btnAplicarSitLaboral = new Ext.Button({
            id     : 'idbtnAplicarSitLaboral',
            iconCls: 'aplicar',
            // icon:perfil.dirImg+'aplicar.png',
            text   : idioma.lbBtnAplicar,
            tooltip: idioma.textToolTipAplicar,
            prevTab: 'idbtnCancelarSitLaboral',
            nextTab: 'idbtnAceptarSitLaboral'
        });

        this.btnAceptarSitLaboral = new Ext.Button({
            id     : 'idbtnAceptarSitLaboral',
            iconCls: 'aceptar',
            // icon:perfil.dirImg+'aceptar.png',
            text   : idioma.lbBtnAceptar,
            tooltip: idioma.textToolTipAceptar,
            prevTab: 'idbtnAplicarSitLaboral',
            nextTab: 'idtfDenomSitLaboral'
        });

        //Ventana de adicionar y modificar situaciones laborales.
        this.ventanaSitLaboral = new Ext.Window({
            modal      : true,
            closeAction: 'hide',
            autoHeight : true,
            closable   : true,
            constrain: true,
            resizable  : false,
            layout     : 'fit',
            autoValidate: true,
            validateDefault: true,
            items      : [this.formularioSitLaboral],
            buttons    : [this.btnCancelarSitLaboral, this.btnAplicarSitLaboral, this.btnAceptarSitLaboral],
            keys       : [
                {
                    key      : Ext.EventObject.ENTER,
                    stopEvent: true,
                    fn       : function () {
                        if (!self.btnAceptarSitLaboral.disabled) {
                            self.btnAceptarSitLaboral.handler();
                        }
                    }
                },
                {
                    key      : 'x',
                    alt      : true,
                    stopEvent: true,
                    fn       : function () {
                        if (!self.btnCancelarSitLaboral.disabled) {
                            self.btnCancelarSitLaboral.handler();
                        }
                    }
                },
                {
                    key      : 'p',
                    alt      : true,
                    stopEvent: true,
                    fn       : function () {
                        if (!self.btnAplicarSitLaboral.disabled) {
                            self.btnAplicarSitLaboral.handler();
                        }
                    }
                }
            ]
        });
    }
};

//Controlador de la vista del Nomenclador de situaciones laborales.
var Pvd_Nomina_Nomencladores_NomSituacionLaboral_Controlador = function () {
    /**
     * Inicializar el controlador de la vista.
     *
     * @param idioma Objeto que contiene el idioma de los textos de la IU (Tipo: Object).
     * @param vista Vista del componente Nomenclador de situaciones laborales (Tipo: Pvd_Nomina_Nomencladores_NomSituacionLaboral_Vista)
     * @param modelo Modelo de la vista del componente Nomenclador de situaciones laborales (Tipo: Pvd_Nomina_Nomencladores_NomSituacionLaboral_Modelo)
     */
    this.init = function (idioma, vista, modelo) {

        var _vista = vista;

        /**
         *Variables generales
         */
        var variablesSitLaboral = {
            accion: 'Add',
            cambio: 0
        };

        //Eventos de campo de abreviatura. 
        vista.tfAbrevSitLaboral.on('change', function (tf, n, o) {
            variablesSitLaboral.cambio = 1;
        });

        //Eventos de campo de denominacion. 
        vista.tfDenomSitLaboral.on('change', function (tf, n, o) {
            variablesSitLaboral.cambio = 1;
        });

        //Eventos de campo de fecha inicio. 
        vista.dfFInicioSitLaboral.on('change', function (tf, n, o) {
            variablesSitLaboral.cambio = 1;
        });

        //Eventos de campo de fecha fin. 
        vista.dfFFinSitLaboral.on('change', function (tf, n, o) {
            variablesSitLaboral.cambio = 1;
        });

        //Eventos de campo de descripcion. 
        vista.tfDescripSitLaboral.on('change', function (tf, n, o) {
            variablesSitLaboral.cambio = 1;
        });

        vista.cbAsociadoCargo.on('change', function (tf, n, o) {
            variablesSitLaboral.cambio = 1;
        });

        //Eventos del grid de situaciones laborales.
        vista.gpSitLaboral.on('rowdblclick', function (e) {
            mostrarVentanaModificarSitLaboral();
        });

        vista.gpSitLaboral.on('destroy', function (e) {
            vista.ventanaSitLaboral.destroy();
        });

        //Eventos del store de situaciones laborales.
        modelo.storeSituacionLaboral.on('beforeload', function (store) {
            vista.btnModificarSitLaboral.disable();
            vista.btnEliminarSitLaboral.disable();
            store.removeAll();
        });

        modelo.storeSituacionLaboral.on('load', function (store, records, opt) {
            if (!records.length) {
                mostrarMensaje(1, idioma.lbMsgNoExistenDatos);
            }
        });

        //Eventos del seleccion model del grid.
        vista.smSitLaboral.on('rowselect', function () {
            vista.btnModificarSitLaboral.enable();
            vista.btnEliminarSitLaboral.enable();
        });

        //Eventos del botón adicionar.
        vista.btnAdicionarSitLaboral.setHandler(function () {
            mostrarVentanaAdicionarSitLaboral();
        });

        //Eventos del botón modificar.
        vista.btnModificarSitLaboral.setHandler(function () {
            mostrarVentanaModificarSitLaboral();
        });

        //Eventos del botón eliminar.
        vista.btnEliminarSitLaboral.setHandler(function () {
            eliminarSituacionLaboral();
        });

        //Exportar
        vista.btnExportarSitLaboral.on('click', function () {
            var winload = new Ext.PVD.comun.window.winLoad({
                title: 'Por favor espere...',
                mensaje: 'Generando reporte'
            });
            winload.showMask();
            var iframe = document.createElement("iframe");
            iframe.src = document.location.protocol + '//' + document.location.host +
                '/pvd/nomina/index.php/nomsituacionlaboral/exportarNomenclador';
            iframe.style.display = 'none';
            var that = this;
            iframe.onload = function () {
                winload.hideMask();
                //that.destroy();
            };
            document.body.appendChild(iframe);
        });

        //Eventos del botón cancelar.
        vista.btnCancelarSitLaboral.setHandler(function () {
            vista.ventanaSitLaboral.hide();
//            vista.formularioSitLaboral.purgeListeners();
        });

        //Eventos del botón aplicar.
        vista.btnAplicarSitLaboral.setHandler(function () {
            salvarFormularioSitLaboral(true);
        });

        //Eventos del botón aceptar.
        vista.btnAceptarSitLaboral.setHandler(function () {
            salvarFormularioSitLaboral(false);
//            vista.formularioSitLaboral.purgeListeners();
        });

        //Evento de la ventana de adicionar/modificar.
        vista.ventanaSitLaboral.on('beforeshow', function (ventana) {
            vista.formularioSitLaboral.getForm().reset();
            vista.tfDenomSitLaboral.focus(true, 500);
        });


        /*
         *Función de mostrar la ventana de adicionar.
         */
        function mostrarVentanaAdicionarSitLaboral() {
            vista.cbConceptopd1.reset();
            vista.ventanaSitLaboral.setTitle(idioma.lbTitleVentAdicionarSitLaboral);
            vista.btnAplicarSitLaboral.show();
            vista.ventanaSitLaboral.show();
            //Actualizar la tabulación deL formulario.
            vista.btnCancelarSitLaboral.setNextElement('idbtnAplicarSitLaboral');
            vista.btnAceptarSitLaboral.setPreviousElement('idbtnAplicarSitLaboral');
            variablesSitLaboral.accion = 'Add';
        }

        /*
         *Función de mostrar la ventana de modificar.
         */
        function mostrarVentanaModificarSitLaboral() {
            vista.cbConceptopd1.reset();
            vista.ventanaSitLaboral.setTitle(idioma.lbTitleVentModificarSitLaboral);
            vista.btnAplicarSitLaboral.hide();
            vista.ventanaSitLaboral.show();

            //Actualizar la tabulación del formulario.
            vista.btnCancelarSitLaboral.setNextElement('idbtnAceptarSitLaboral');
            vista.btnAceptarSitLaboral.setPreviousElement('idbtnCancelarSitLaboral');
            vista.formularioSitLaboral.getForm().loadRecord(vista.smSitLaboral.getSelected());
//            vista.formularioSitLaboral.addListener('clientvalidation', function (_form, _valid) {
//                if (comparar(vista.formularioSitLaboral.getForm().getValues(), vista.smSitLaboral.getSelected().data)) {
//                    vista.btnAceptarSitLaboral.setDisabled(true);
//                } else   {
//                    vista.btnAceptarSitLaboral.enable();
//                }
//            });
            variablesSitLaboral.accion = 'Mod';

        }

        /*
         *Función para adicionar/modificar una situacion laboral.
         */
        function salvarFormularioSitLaboral(boton) {

            var urlAction = '/pvd/nomina/index.php/nomsituacionlaboral/adicionarSituacionLaboral';
            var idsituacionlaboral = 0;
            var lbMsgEspera = idioma.lbMsgAdicionarSitLaboral;
            var lbMsgExito = idioma.lbMsgCorrectoAdicionadoSitLaboral;
            var concep = vista.cbConceptopd1.tree.getChecked();
            var arrayDatos = new Array();
            for (var i = 0; i < concep.length; i++) {
                arrayDatos.push(concep[i].attributes.id);
            }

            if (variablesSitLaboral.accion == 'Mod') {
                lbMsgEspera = idioma.lbMsgModificarSitLaboral;
                lbMsgExito = idioma.lbMsgCorrectoModificadoSitLaboral;
                urlAction = '/pvd/nomina/index.php/nomsituacionlaboral/modificarSituacionLaboral';
                idsituacionlaboral = vista.smSitLaboral.getSelected().get('idsituacionlaboral');
            }
            if (variablesSitLaboral.cambio == 0) {
                if (variablesSitLaboral.accion == 'Mod') {
                    //Se oculta la ventana si no ha sido modificado ningún valor.
                    vista.ventanaSitLaboral.hide();
                } else {
                    //Se marcan como obligatorios en caso de presionar aceptar y se encuentren vacíos.
                    vista.tfAbrevSitLaboral.markInvalid(idioma.lbErrorCampoVacio);
                    vista.tfDenomSitLaboral.markInvalid(idioma.lbErrorCampoVacio);
                    vista.cbAsociadoCargo.markInvalid(idioma.lbErrorCampoVacio);
                    mostrarMensaje(3, idioma.lbErrorFormulario);
                }
            } else {
                //Se verifica si el formulario es válido y si el campo sueldo contiene un valor.
                if (vista.formularioSitLaboral.getForm().isValid()) {

                    //Se muestra la máscara de espera.
                    PVD.mostrarMascara('idmaskaddmodsituacionlab', idioma.lbMsgEsperaEnviarDatos, lbMsgEspera);

                    //Enviando datos al servidor.
                    Ext.Ajax.request({
                        url     : urlAction,
                        method  : 'POST',
                        params  : {idsituacionlaboral    : idsituacionlaboral,
                            abreviatura                  : vista.tfAbrevSitLaboral.getValue(),
                            denominacion                 : vista.tfDenomSitLaboral.getValue(),
                            //asociadocargo : vista.cbAsociadoCargo.getValue(),
                            fechainicio                  : vista.dfFInicioSitLaboral.getRawValue(),
                            fechafin                     : vista.dfFFinSitLaboral.getRawValue(),
                            descripcion                  : vista.tfDescripSitLaboral.getValue(),
                            idconceptopercepciondescuento: Ext.encode(arrayDatos),

                        },
                        callback: function (options, success, response) {
                            responseData = Ext.decode(response.responseText);

                            //Ocultando máscara de enviar datos.
                            PVD.ocultarMascara('idmaskaddmodsituacionlab');

                            if (responseData.codigo == 1) {
                                mostrarMensaje(1, lbMsgExito);
                                if (!boton) {
                                    vista.ventanaSitLaboral.hide();

                                } else {
                                    vista.tfDenomSitLaboral.focus(true, 500);
                                }
                                vista.formularioSitLaboral.getForm().reset();
                                modelo.storeSituacionLaboral.removeAll();
                                modelo.storeSituacionLaboral.load({params: {limit: 1000, start: 0}});
                                variablesSitLaboral.cambio = 0;


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
         *Función para eliminar una situacion laboral.
         */
        function eliminarSituacionLaboral() {
            //Mostrando el mensaje para aceptar la eliminar una situacion laboral.
            mostrarMensaje(2, idioma.lbTitleEliminarSitLaboral, function (btn) {
                if (btn == "ok") {

                    //Se muestra la máscara de espera.
                    PVD.mostrarMascara('idmaskeleminarsitlaboral', idioma.lbMsgEsperaEnviarDatos, idioma.lbMsgEliminarSitLaboral);

                    //Enviando los datos al servidor.
                    Ext.Ajax.request({
                        url     : '/pvd/nomina/index.php/nomsituacionlaboral/eliminarSituacionLaboral',
                        method  : 'POST',
                        params  : {idsituacionlaboral: vista.smSitLaboral.getSelected().get('idsituacionlaboral')},
                        callback: function (options, success, response) {
                            //Se oculta la máscara de espera.
                            PVD.ocultarMascara('idmaskeleminarsitlaboral');
                            responseData = Ext.decode(response.responseText);
                            if (responseData.codigo == 1) {
                                //Mostrando el mensaje de que se ha eliminado la situacion laboral.
                                mostrarMensaje(1, idioma.lbMsgCorrectoEliminadoSitLaboral);
                                //Recargando el grid de situaciones laborales.
                                modelo.storeSituacionLaboral.load({params: {limit: 1000, start: 0}});

                            } else {
                                if (responseData.codigo)
                                    mostrarMensaje(responseData.codigo, idioma.lbMsgErrorSituacLaboralUso);
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
                            if (!vista.btnAdicionarSitLaboral.disabled && !vista.ventanaSitLaboral.isVisible()) {
                                mostrarVentanaAdicionarSitLaboral();
                            }
                            break;
                        }
                        case 77:
                        { //m para modificar .
                            if (!vista.btnModificarSitLaboral.disabled && !vista.ventanaSitLaboral.isVisible()) {
                                mostrarVentanaModificarSitLaboral();
                            }
                            break;
                        }
                        case 72:
                        { //h para ayuda.
                            if (!vista.ventanaSitLaboral.isVisible()) {
                                vista.btnAyudaSitLaboral.focus();
                                vista.btnAyudaSitLaboral.fireEvent('click');
                            }
                            break;
                        }
                    }
                }
            },
            {
                key: 46,//del para eliminar.
                fn : function () {
                    if (!vista.btnEliminarSitLaboral.disabled && !vista.ventanaSitLaboral.isVisible()) {
                        eliminarSituacionLaboral();
                    }
                }
            },
            {
                key: 13,//enter para aceptar.
                fn : function () {
                    if (vista.btnAceptarSitLaboral.isVisible()) {
                        vista.btnAceptarSitLaboral.focus();
                        vista.btnAceptarSitLaboral.fireEvent('click');
                    }
                }
            }
        ]);
    }
};

variablesGlobales.nomsituacionlaboral_js = 1;
