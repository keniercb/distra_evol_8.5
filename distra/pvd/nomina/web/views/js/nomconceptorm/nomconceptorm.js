Ext.ns('Pvd.Nomina.Nomencladores.NomConceptoRM');

Pvd.Nomina.Nomencladores.NomConceptoRM.Panel = Ext.extend(Ext.Panel, {
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
        this.modelo = new Pvd_Nomina_Nomencladores_NomConceptoRM_Modelo();
        this.modelo.init();

        //Inicializando la vista.
        this.vista = new Pvd_Nomina_Nomencladores_NomConceptoRM_Vista();
        this.vista.init(this.perfil, this.idioma, this.modelo);

        //Inicializar controlador.
        this.controlador = new Pvd_Nomina_Nomencladores_NomConceptoRM_Controlador();
        this.controlador.init(this.idioma, this.vista, this.modelo);

        this.items = [this.vista.panelCentralConceptoRM];

        //Teclas calientes de la interfaz
        this.keyMap = this.controlador.keyMap;

        Pvd.Nomina.Nomencladores.NomConceptoRM.Panel.superclass.initComponent.call(this);
    },
    listeners    : {
        afterlayout: function (x) {
            if (this.mostrar == 1) {
                this.modelo.storeConceptoRM.load({params: {limit: 1000, start: 0}});
                this.mostrar = 2;
            }
        },
        destroy    : function (x) {
            this.keyMap.disable();
        }
    }
});

//Modelo de la vista del Nomenclador de conceptos de la retribución monetaria.
var Pvd_Nomina_Nomencladores_NomConceptoRM_Modelo = function () {
    /**
     * Inicializar el modelo de la vista.
     */
    this.init = function () {

        //Store del listado de conceptos de la retribucion monetaria.
        this.storeConceptoRM = new Ext.data.Store({
            url   : '/pvd/nomina/index.php/nomconceptorm/obtenerListadoConceptoRM',
            reader: new Ext.data.JsonReader(
                {totalProperty: "cantidad", autoLoad: true, root: "datos", id: "idconceptorm" },
                [
                    {name: 'idconceptorm'}
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
                    ,
                    {name: 'idparrafofiscal'}
                    ,
                    {name: 'denominacionpf'}
                    ,
                    {name: 'nombrecuenta'}
                ])
        });

        this.storeParrafoFiscal = new Ext.data.Store({
            url   : '/pvd/nomina/index.php/nomconceptorm/obtenerListadoParrafoFiscal',
            reader: new Ext.data.JsonReader(
                {totalProperty: "cantidad", autoLoad: true, root: "datos", id: "idparrafofiscal" },
                [
                    {name: 'idparrafofiscal'}
                    ,
                    {name: 'denominacionpf'}
                ])
        });

        this.storeClienteProvCobrosPagos = new Ext.data.Store({
            url   : '/pvd/nomina/index.php/nomconceptorm/obtenerClienteProvCobrosPagos',
            reader: new Ext.data.JsonReader(
                {totalProperty: "cantidad", autoLoad: true, root: "datos", id: "idclienteproveedorcobropago" },
                [
                    {name: 'idclienteproveedorcobropago'}
                    ,
                    {name: 'nombrecuenta'}
                ])
        });

    }
};

//Vista del componente Nomenclador de conceptos de la retribución monetaria.
var Pvd_Nomina_Nomencladores_NomConceptoRM_Vista = function () {
    /**
     * Inicializar la vista.
     *
     * @param perfil Objeto que contiene el perfil de la IU (Tipo: Object).
     * @param idioma Objeto que contiene el idioma de los textos de la IU (Tipo: Object).
     * @param modelo Modelo de la vista del componente Nomenclador de conceptos de la retribución monetaria (Tipo: Pvd_Nomina_Nomencladores_NomConceptoRM_Modelo).
     */
    this.init = function (perfil, idioma, modelo) {

        var self = this;

        //Listado de conceptos de la retribución monetaria.
        function centrarValor(val) {
            if (val)
                return "<center>" + val + "</center>";
        }

        this.expanderConceptoRM = new Ext.grid.RowExpander({
            tpl             : new Ext.Template(
                '<div style="word-wrap:break-word;white-space:normal;"><p>&nbsp;&nbsp;Descripci&oacute;n:&nbsp;{descripcion}</p><br/></div>'
            ), enableCaching: false
        });

        this.smConceptoRM = new Ext.grid.RowSelectionModel({
            singleSelect: true,
        });

        this.gpConceptoRM = new Ext.grid.GridPanel({
            id        : 'idgpConceptoRM',
            title     : idioma.lbTitleConceptoRM,
            region    : 'center',
            columns   : [
                {header: 'idconceptorm', hidden: true, hideable: false, dataIndex: 'idconceptorm'}
                ,
                {header: 'idparrafofiscal', hidden: true, hideable: false, dataIndex: 'idparrafofiscal'}
                ,
                this.expanderConceptoRM
                ,
                {header: '<center>' + idioma.lbColAbreviatura + '</center>', width: 70, sortable: true, dataIndex: 'abreviatura', renderer: centrarValor}
                ,
                {header: idioma.lbColDenominacion, width: 200, sortable: true, dataIndex: 'denominacion'}
                ,
                {header: '<center>' + idioma.lbColDesde + '</center>', width: 90, sortable: false, dataIndex: 'fechainicio', renderer: centrarValor}
                ,
                {header: '<center>' + idioma.lbColHasta + '</center>', width: 90, sortable: false, dataIndex: 'fechafin', renderer: centrarValor}
            ],
            stripeRows: true,
            autoScroll: true,
            border    : false,
            width     : '100%',
            heigth    : '100%',
            viewConfig: {forceFit: true},
            store     : modelo.storeConceptoRM,
            sm        : this.smConceptoRM,
            plugins   : this.expanderConceptoRM,
            loadMask  : {msg: idioma.lbMaskGridCargando},
            bbar      : new Ext.PagingToolbar({
                pageSize   : 1000,
                store      : modelo.storeConceptoRM,
                displayInfo: true,
                displayMsg : 'Mostrando  {0} - {1} de {2}',
                emptyMsg   : "0 Resultado a mostrar"
            }),
        });

        //Botones de Add, Mod, Elim, Ayud de conceptos de la retribución monetaria.
        this.btnAdicionarConceptoRM = new Ext.Button({
            id     : 'btnAddConceptoRM',
            text   : idioma.lbBtnAdicionar,
            tooltip: idioma.textToolTipAddConceptoRM,
            //icon: perfil.dirImg+'adicionar.png',
            iconCls: 'adicionar',
            prevTab: 'btnAyudaConceptoRM',
            nextTab: 'btnModConceptoRM',
        });

        this.btnModificarConceptoRM = new Ext.Button({
            id     : 'btnModConceptoRM',
            text   : idioma.lbBtnModificar,
            tooltip: idioma.textToolTipModConceptoRM,
            //  icon: perfil.dirImg+'modificar.png',
            iconCls: 'modificar',
            prevTab: 'btnAddConceptoRM',
            nextTab: 'btnElimConceptoRM',
        });

        this.btnEliminarConceptoRM = new Ext.Button({
            id     : 'btnElimConceptoRM',
            text   : idioma.lbBtnEliminar,
            tooltip: idioma.textToolTipElimConceptoRM,
            //icon: perfil.dirImg+'eliminar.png',
            iconCls: 'eliminar',
            prevTab: 'btnModConceptoRM',
            nextTab: 'btnAyudaConceptoRM',
        });

        this.btnExportarConceptoRM = new Ext.Button({
            id: 'btnExportarConceptoRM',
            text: 'Exportar',
            tooltip: 'Exportar',
            iconCls: 'exportar'
        });

        this.btnAyudaConceptoRM = new Ext.Button({
            id     : 'btnAyudaConceptoRM',
            text   : idioma.lbBtnAyuda,
            tooltip: idioma.textToolTipAyudaConceptoRM,
            //  icon:perfil.dirImg+'ayuda.png',
            iconCls: 'ayuda',
            prevTab: 'btnElimConceptoRM',
            nextTab: 'btnAddConceptoRM',
        });

        //Panel contenedor del grid de conceptos de la retribución monetaria. 
        this.panelCentralConceptoRM = new Ext.Panel({
            id    : 'panelCentralConceptoRM',
            region: 'center',
            heigth: '100%',
            width : '100%',
            border: false,
            layout: 'fit',
            tbar  : [this.btnAdicionarConceptoRM, this.btnModificarConceptoRM, this.btnEliminarConceptoRM, this.btnExportarConceptoRM, '->', this.btnAyudaConceptoRM],
            items : [this.gpConceptoRM],
        });

        //Campo del formulario de conceptos de la retribución monetaria.
        this.tfAbrevConceptoRM = new Ext.form.TextField({id: 'idtfAbrevConceptoRM', fieldLabel: idioma.lbColAbreviatura,
            tabIndex                                       : 1, name: 'abreviatura', allowBlank: false,
            anchor                                         : '90%', prevTab: 'idbtnAceptarConceptoRM',
            nextTab                                        : 'idtfDenomConceptoRM',
            regex                                          : /^([a-zA-ZÁÉÍÓÚáéíóúñüÑ\d]+(\d*)?)+$/,
            regexText                                      : idioma.lbAbrevIncorr,
            blankText                                      : idioma.lbErrorCampoVacio,
            maxLength                                      : 10,
            maxLengthText                                  : idioma.lbMaxText_10,
        });

        this.tfDenomConceptoRM = new Ext.form.TextField({id: 'idtfDenomConceptoRM', fieldLabel: idioma.lbColDenominacion,
            tabIndex                                       : 2, name: 'denominacion', allowBlank: false, anchor: '99%',
//            regex                                          : /^([a-zA-ZÁÉÍÓÚáéíóúñüÑ\d ]+(\d*)?)+$/,
            vtype                                          : 'vtdenominaciones',
            regexText                                      : idioma.lbDenomIncorr,
            blankText                                      : idioma.lbErrorCampoVacio,
            maxLength                                      : 100,
            maxLengthText                                  : idioma.lbMaxText_100
        });

        this.cbParrafoFiscal = new Ext.form.ComboBox({id: 'cbParrafoFiscal', fieldLabel: 'Parrafo fiscal',
            tabIndex                                        : 3, valueField: 'idparrafofiscal',
            displayField                                    : 'denominacionpf', hiddenName: 'idparrafofiscal',
            mode: 'local',
            store                                           : modelo.storeParrafoFiscal, emptyText: 'Seleccione',

            //readOnly                                        : true,
            triggerAction                                   : 'all', anchor: '99%'
        });


        this.cbClienteProvCobrosPagos = new Ext.form.ComboBox({id: 'storeClienteProvCobrosPagos', fieldLabel: 'Cuenta Contable',
            tabIndex                                        : 3, valueField: 'idclienteproveedorcobropago',
            displayField                                    : 'nombrecuenta', hiddenName: 'idclienteproveedorcobropago',
            mode: 'local',
            store                                           : modelo.storeClienteProvCobrosPagos, emptyText: 'Seleccione',
            disabled:                                       true,
            readOnly                                        : true,
            triggerAction                                   : 'all', anchor: '99%'
        });

        this.dfFInicioConceptoRM = new Ext.form.DateField({id: 'dfFInicioConceptoRM', fieldLabel: idioma.lbColDesde,
            tabIndex                                         : 3, name: 'fechainicio', allowBlank: false,
            format                                           : 'd/m/Y', editable: true, readOnly: false,
            value                                            : new Date().format('d/m/Y'), maxText: idioma.lbFechaMaxima,
            minText                                          : idioma.lbFechaMinima, blankText: idioma.lbErrorCampoVacio,
            invalidText                                      : idioma.invalidTextFecha, vtype: 'daterange',
            anchor                                           : '90%', endDateField: 'dfFFinConceptoRM'
        });
        this.dfFFinConceptoRM = new Ext.form.DateField({id: 'dfFFinConceptoRM', fieldLabel: idioma.lbColHasta,
            tabIndex                                      : 4, name: 'fechafin', xtype: 'datefield', allowBlank: true,
            format                                        : 'd/m/Y', editable: true, readOnly: false,
            maxText                                       : idioma.lbFechaMaxima, minText: idioma.lbFechaMinima,
            blankText                                     : idioma.lbErrorCampoVacio, invalidText: idioma.invalidTextFecha,
            vtype                                         : 'daterange', anchor: '99%', startDateField: 'dfFInicioConceptoRM'
        });
        this.tfDescripConceptoRM = new Ext.form.TextArea({id: 'idtfDescripConceptoRM',
            fieldLabel                                      : idioma.lbColDescripcion, tabIndex: 5,
            name                                            : 'descripcion', allowBlank: true,
            hiddenname                                      : 'descripcion',
            anchor                                          : '99%', prevTab: 'dfFFinConceptoRM', nextTab: 'idbtnCancelarConceptoRM',
            blankText                                       : idioma.lbErrorCampoVacio,
            maxLength                                       : 255,
            maxLengthText                                   : idioma.lbMaxText_255,
        });

        //Formulario de conceptos de la retribución monetaria.
        this.formularioConceptoRM = new Ext.FormPanel({
            id        : 'idformularioConceptoRM',
            labelAlign: 'top',
            frame     : true,
            width     : 600,
            autoHeight: true,
            bodyStyle : {
                padding: '10px 10px 10px 10px'
            },
            items     : [
                {layout  : 'column',
                    items: [
                        {columnWidth: .28, layout: 'form', items: [this.tfAbrevConceptoRM]},
                        {columnWidth: .72, layout: 'form', items: [this.tfDenomConceptoRM]}
                    ]
                },
                {layout  : 'column',
                    items: [
                        {columnWidth: .54, layout: 'form', items: [this.dfFInicioConceptoRM]},
                        {columnWidth: .46, layout: 'form', items: [this.dfFFinConceptoRM]}
                    ]
                },
                this.tfDescripConceptoRM
            ]
        });

        //Botones de la ventana de adicionar conceptos de la retribución monetaria.
        this.btnCancelarConceptoRM = new Ext.Button({
            id     : 'idbtnCancelarConceptoRM',
            iconCls: 'cancelar',
            //icon:perfil.dirImg+'cancelar.png',
            text   : idioma.lbBtnCancelar,
            tooltip: idioma.textToolTipCancelar,
            prevTab: 'idtfDescripConceptoRM',
            nextTab: 'idbtnAplicarConceptoRM',
        });

        this.btnAplicarConceptoRM = new Ext.Button({
            id     : 'idbtnAplicarConceptoRM',
            iconCls: 'aplicar',
            // icon:perfil.dirImg+'aplicar.png',
            text   : idioma.lbBtnAplicar,
            tooltip: idioma.textToolTipAplicar,
            prevTab: 'idbtnCancelarConceptoRM',
            nextTab: 'idbtnAceptarConceptoRM',
        });

        this.btnAceptarConceptoRM = new Ext.Button({
            id     : 'idbtnAceptarConceptoRM',
            iconCls: 'aceptar',
            // icon:perfil.dirImg+'aceptar.png',
            text   : idioma.lbBtnAceptar,
            tooltip: idioma.textToolTipAceptar,
            prevTab: 'idbtnAplicarConceptoRM',
            nextTab: 'idtfAbrevConceptoRM',
        });

        //Ventana de adicionar y modificar conceptos de la retribución monetaria.
        this.ventanaConceptoRM = new Ext.Window({
            modal      : true,
            closeAction: 'hide',
            autoHeight : true,
            closable   : true,
            autoValidate: true,
            validateDefault: true,
            resizable  : false,
            constrain: true,
            layout     : 'fit',
            constrain  : true,
            items      : [this.formularioConceptoRM],
            buttons    : [this.btnCancelarConceptoRM, this.btnAplicarConceptoRM, this.btnAceptarConceptoRM],
            keys       : [
                {
                    key      : Ext.EventObject.ENTER,
                    stopEvent: true,
                    fn       : function () {
                        if (!self.btnAceptarConceptoRM.disabled) {
                            self.btnAceptarConceptoRM.handler();
                        }
                    }
                },
                {
                    key      : 'x',
                    alt      : true,
                    stopEvent: true,
                    fn       : function () {
                        if (!self.btnCancelarConceptoRM.disabled) {
                            self.btnCancelarConceptoRM.handler();
                        }
                    }
                },
                {
                    key      : 'p',
                    alt      : true,
                    stopEvent: true,
                    fn       : function () {
                        if (!self.btnAplicarConceptoRM.disabled) {
                            self.btnAplicarConceptoRM.handler();
                        }
                    }
                }
            ]
        });
    }
};

//Controlador de la vista del Nomenclador de conceptos de la retribución monetaria.
var Pvd_Nomina_Nomencladores_NomConceptoRM_Controlador = function () {
    /**
     * Inicializar el controlador de la vista.
     *
     * @param idioma Objeto que contiene el idioma de los textos de la IU (Tipo: Object).
     * @param vista Vista del componente Nomenclador de conceptos de la retribución monetaria (Tipo: Pvd_Nomina_Nomencladores_NomConceptoRM_Vista)
     * @param modelo Modelo de la vista del componente Nomenclador de conceptos de la retribución monetaria (Tipo: Pvd_Nomina_Nomencladores_NomConceptoRM_Modelo)
     */
    this.init = function (idioma, vista, modelo) {

        var _vista = vista;

        /**
         *Variables generales
         */
        var variablesConceptoRM = {
            accion: 'Add',
            cambio: 0
        };

        //modelo.storeParrafoFiscal.load();

        //Eventos del grid de conceptos de la retribución monetaria.
        vista.gpConceptoRM.on('rowdblclick', function (e) {
            mostrarVentanaModificarConceptoRM();
        });

        vista.gpConceptoRM.on('destroy', function (e) {
            vista.ventanaConceptoRM.destroy();
        });

        vista.cbParrafoFiscal.on('change', function(){
            variablesConceptoRM.cambio = 1;
        });

        vista.cbClienteProvCobrosPagos.on('change', function(){
            variablesConceptoRM.cambio = 1;
        });

        vista.cbParrafoFiscal.on('select', function(combo, n, o){
            var idparrafofiscal =  n.id;
            modelo.storeClienteProvCobrosPagos.load({params:{idparrafofiscal:idparrafofiscal}});
            vista.cbClienteProvCobrosPagos.enable();
        });

        //Eventos del store de conceptos de la retribución monetaria.
        modelo.storeConceptoRM.on('beforeload', function (store) {
            vista.btnModificarConceptoRM.disable();
            vista.btnEliminarConceptoRM.disable();
            store.removeAll();
        });

        modelo.storeConceptoRM.on('load', function (store, records, opt) {
            if (!records.length) {
                mostrarMensaje(1, idioma.lbMsgNoExistenDatos);
            }
        });

        //Eventos del seleccion model del grid.
        vista.smConceptoRM.on('rowselect', function () {
            vista.btnModificarConceptoRM.enable();
            vista.btnEliminarConceptoRM.enable();
        });

        //Eventos de campo de abreviatura.
        vista.tfAbrevConceptoRM.on('change', function (tf, n, o) {
            variablesConceptoRM.cambio = 1;
        });

        //Eventos de campo de denominacion. 
        vista.tfDenomConceptoRM.on('change', function (tf, n, o) {
            variablesConceptoRM.cambio = 1;
        });

        //Eventos de campo de fecha inicio. 
        vista.dfFInicioConceptoRM.on('change', function (tf, n, o) {
            variablesConceptoRM.cambio = 1;
        });

        //Eventos de campo de fecha fin. 
        vista.dfFFinConceptoRM.on('change', function (tf, n, o) {
            variablesConceptoRM.cambio = 1;
        });

        //Eventos de campo de descripcion. 
        vista.tfDescripConceptoRM.on('change', function (tf, n, o) {
            variablesConceptoRM.cambio = 1;
        });

        //Eventos del botón adicionar.
        vista.btnAdicionarConceptoRM.setHandler(function () {
            mostrarVentanaAdicionarConceptoRM();
        });

        //Eventos del botón modificar.
        vista.btnModificarConceptoRM.setHandler(function () {
            mostrarVentanaModificarConceptoRM();
        });

        //Eventos del botón eliminar.
        vista.btnEliminarConceptoRM.setHandler(function () {
            eliminarConceptoRM();
        });

        //Exportar
        vista.btnExportarConceptoRM.on('click', function () {
            var winload = new Ext.PVD.comun.window.winLoad({
                title: 'Por favor espere...',
                mensaje: 'Generando reporte'
            });
            winload.showMask();
            var iframe = document.createElement("iframe");
            iframe.src = document.location.protocol + '//' + document.location.host +
                '/pvd/nomina/index.php/nomconceptorm/exportarNomenclador';
            iframe.style.display = 'none';
            var that = this;
            iframe.onload = function () {
                winload.hideMask();
                //that.destroy();
            };
            document.body.appendChild(iframe);
        });

        //Eventos del botón cancelar.
        vista.btnCancelarConceptoRM.setHandler(function () {
            vista.ventanaConceptoRM.hide();
//            vista.formularioConceptoRM.purgeListeners();
        });

        //Eventos del botón aplicar.
        vista.btnAplicarConceptoRM.setHandler(function () {
            salvarFormularioConceptoRM(true);
        });

        //Eventos del botón aceptar.
        vista.btnAceptarConceptoRM.setHandler(function () {
            salvarFormularioConceptoRM(false);
//            vista.formularioConceptoRM.purgeListeners();
        });

        //Evento de la ventana de adicionar/modificar 
        vista.ventanaConceptoRM.on('beforeshow', function (ventana) {
            variablesConceptoRM.cambio = 0;
            vista.formularioConceptoRM.getForm().reset();
            vista.tfAbrevConceptoRM.focus(true, 500);
        });


        /*
         *Función de mostrar la ventana de adicionar.
         */
        function mostrarVentanaAdicionarConceptoRM() {
            vista.ventanaConceptoRM.setTitle(idioma.lbTitleVentAdicionarConceptoRM);
            vista.btnAplicarConceptoRM.show();
            vista.ventanaConceptoRM.show();
            //Actualizar la tabulación deL formulario.
            vista.btnCancelarConceptoRM.setNextElement('idbtnAplicarConceptoRM');
            vista.btnAceptarConceptoRM.setPreviousElement('idbtnAplicarConceptoRM');
            variablesConceptoRM.accion = 'Add';
        }

        /*
         *Función de mostrar la ventana de modificar.
         */
        function mostrarVentanaModificarConceptoRM() {
            vista.ventanaConceptoRM.setTitle(idioma.lbTitleVentModificarConceptoRM);
            vista.btnAplicarConceptoRM.hide();
            vista.ventanaConceptoRM.show();
            //Actualizar la tabulación deL formulario.
            vista.btnCancelarConceptoRM.setNextElement('idbtnAceptarConceptoRM');
            vista.btnAceptarConceptoRM.setPreviousElement('idbtnCancelarConceptoRM');
            vista.formularioConceptoRM.getForm().loadRecord(vista.smConceptoRM.getSelected());

//            vista.formularioConceptoRM.addListener('clientvalidation', function (_form, _valid) {
//                if (comparar(vista.formularioConceptoRM.getForm().getValues(), vista.smConceptoRM.getSelected().data)) {
//                    vista.btnAceptarConceptoRM.setDisabled(true);
//                } else {
//                    vista.btnAceptarConceptoRM.enable()
//                }
//            });
            variablesConceptoRM.accion = 'Mod';
        }

        /*
         *Función para adicionar/modificar un concepto de la retribución monetaria.
         */
        function salvarFormularioConceptoRM(boton) {

            var urlAction = '/pvd/nomina/index.php/nomconceptorm/adicionarConceptoRetribucionMonetaria';
            var idconceptorm = 0;
            var lbMsgEspera = idioma.lbMsgAdicionarConceptoRM;
            var lbMsgExito = idioma.lbMsgCorrectoAdicionadoConceptoRM;

            if (variablesConceptoRM.accion == 'Mod') {
                lbMsgEspera = idioma.lbMsgModificarConceptoRM;
                lbMsgExito = idioma.lbMsgCorrectoModificadoConceptoRM;
                urlAction = '/pvd/nomina/index.php/nomconceptorm/modificarConceptoRetribucionMonetaria';
                idconceptorm = vista.smConceptoRM.getSelected().get('idconceptorm');
            }
            if (variablesConceptoRM.cambio == 0) {
                if (variablesConceptoRM.accion == 'Mod') {
                    //Se oculta la ventana si no ha sido modificado ningún valor.
                    vista.ventanaConceptoRM.hide();
                } else {
                    //Se marcan como obligatorios en caso de presionar aceptar y se encuentren vacíos.
                    vista.tfAbrevConceptoRM.markInvalid(idioma.lbErrorCampoVacio);
                    vista.tfDenomConceptoRM.markInvalid(idioma.lbErrorCampoVacio);
                    mostrarMensaje(3, idioma.lbErrorFormulario);
                }
            } else {
                //Se verifica si el formulario es válido y si el campo sueldo contiene un valor
                if (vista.formularioConceptoRM.getForm().isValid()) {
                    //Se muestra la máscara de espera.
                    PVD.mostrarMascara('idmaskaddmodconceptorm', idioma.lbMsgEsperaEnviarDatos, lbMsgEspera);

                    //Enviando datos al servidor.
                    Ext.Ajax.request({
                        url     : urlAction,
                        method  : 'POST',
                        params  : {idconceptorm: idconceptorm,
                            abreviatura        : vista.tfAbrevConceptoRM.getValue(),
                            denominacion       : vista.tfDenomConceptoRM.getValue(),
                            fechainicio        : vista.dfFInicioConceptoRM.getRawValue(),
                            fechafin           : vista.dfFFinConceptoRM.getRawValue(),
                            descripcion        : vista.tfDescripConceptoRM.getValue(),
                            idparrafofiscal        : vista.cbParrafoFiscal.getValue(),
                            idclienteproveedorcobropago        : vista.cbClienteProvCobrosPagos.getValue()
                        },
                        callback: function (options, success, response) {
                            responseData = Ext.decode(response.responseText);

                            //Ocultando máscara de enviar datos.
                            PVD.ocultarMascara('idmaskaddmodconceptorm');

                            if (responseData.codigo == 1) {
                                mostrarMensaje(1, lbMsgExito);
                                if (!boton) {
                                    vista.ventanaConceptoRM.hide();

                                } else {
                                    vista.tfAbrevConceptoRM.focus(true, 500);
                                }
                                vista.formularioConceptoRM.getForm().reset();
                                modelo.storeConceptoRM.removeAll();
                                modelo.storeConceptoRM.load({params: {limit: 1000, start: 0}});
                                variablesConceptoRM.cambio = 0;


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
         *Función para eliminar un concepto de la retribución monetaria.
         */
        function eliminarConceptoRM() {
            //Mostrando el mensaje para aceptar el eliminar un concepto de la retribución monetaria.
            mostrarMensaje(2, idioma.lbTitleEliminarConceptoRM, function (btn) {
                if (btn == "ok") {
                    //Se muestra la máscara de espera.
                    PVD.mostrarMascara('idmaskeleminarconceptorm', idioma.lbMsgEsperaEnviarDatos, idioma.lbMsgEliminarConceptoRM);
                    //Enviando los datos al servidor.
                    Ext.Ajax.request({
                        url     : '/pvd/nomina/index.php/nomconceptorm/eliminarConceptoRetribucionMonetaria',
                        method  : 'POST',
                        params  : {idconceptorm: vista.smConceptoRM.getSelected().get('idconceptorm')},
                        callback: function (options, success, response) {
                            //Se oculta la máscara de espera.
                            PVD.ocultarMascara('idmaskeleminarconceptorm');
                            responseData = Ext.decode(response.responseText);
                            if (responseData.codigo == 1) {
                                //Mostrando el mensaje de que se ha eliminado el concepto de la retribución monetaria.
                                mostrarMensaje(1, idioma.lbMsgCorrectoEliminadoConceptoRM);
                                //Recargando el grid de conceptos de la retribución monetaria.
                                modelo.storeConceptoRM.load({params: {limit: 1000, start: 0}});

                            } else {
                                if (responseData.codigo)
                                    mostrarMensaje(responseData.codigo, idioma.lbMsgErrorConceptoRMUso);
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
                            if (!vista.btnAdicionarConceptoRM.disabled && !vista.ventanaConceptoRM.isVisible()) {
                                mostrarVentanaAdicionarConceptoRM();
                            }
                            break;
                        }
                        case 77:
                        { //m para modificar .
                            if (!vista.btnModificarConceptoRM.disabled && !vista.ventanaConceptoRM.isVisible()) {
                                mostrarVentanaModificarConceptoRM();
                            }
                            break;
                        }
                        case 72:
                        { //h para ayuda.
                            if (!vista.ventanaConceptoRM.isVisible()) {
                                vista.btnAyudaConceptoRM.focus();
                                vista.btnAyudaConceptoRM.fireEvent('click');
                            }
                            break;
                        }
                    }
                }
            },
            {
                key: 46,//del para eliminar.
                fn : function () {
                    if (!vista.btnEliminarConceptoRM.disabled && !vista.ventanaConceptoRM.isVisible()) {
                        eliminarConceptoRM();
                    }
                },
            },
            {
                key: 13,//enter para aceptar.
                fn : function () {
                    if (vista.btnAceptarConceptoRM.isVisible()) {
                        vista.btnAceptarConceptoRM.focus();
                        vista.btnAceptarConceptoRM.fireEvent('click');
                    }
                },
            }
        ]);
    }
};

variablesGlobales.nomconceptorm_js = 1;
