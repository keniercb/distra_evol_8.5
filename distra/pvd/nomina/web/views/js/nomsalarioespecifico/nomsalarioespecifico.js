/**
 * Nomenclador de salarios especificos.
 *
 * @author Tte. Frank Rodriguez Berroa.
 * @package Pvd.
 * @subpackage Nomina - Nomencladores.
 * @category Clase Interfaz.
 * @uses vd.Nomina.Nomencladores.NomSalarioEspecifico.Panel
 * @copyright UCID
 * @version 1.0
 */
Ext.ns('Pvd.Nomina.Nomencladores.NomSalarioEspecifico');

Pvd.Nomina.Nomencladores.NomSalarioEspecifico.Panel = Ext.extend(Ext.Panel, {
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
        this.modelo = new Pvd_Nomina_Nomencladores_NomSalarioEspecifico_Modelo();
        this.modelo.init();

        //Inicializando la vista.
        this.vista = new Pvd_Nomina_Nomencladores_NomSalarioEspecifico_Vista();
        this.vista.init(this.perfil, this.idioma, this.modelo);

        //Inicializar controlador.
        this.controlador = new Pvd_Nomina_Nomencladores_NomSalarioEspecifico_Controlador();
        this.controlador.init(this.idioma, this.vista, this.modelo);

        this.items = [this.vista.panelCentral];

        //Teclas calientes de la interfaz
        this.keyMap = this.controlador.keyMap;

        Pvd.Nomina.Nomencladores.NomSalarioEspecifico.Panel.superclass.initComponent.call(this);
    },
    listeners: {
        afterlayout: function (x) {
            if (this.mostrar == 1) {
                this.modelo.storeSectorSalarial.load({params: {limit: 20, start: 0}});
                // this.modelo.storeSalarioE.load({params:{limit:20, start:0}});
                this.mostrar = 2;
            }
        },
        destroy: function (x) {
            this.keyMap.disable();
        },
    },
});

//Modelo de la vista del Nomenclador de salarios especificos.
var Pvd_Nomina_Nomencladores_NomSalarioEspecifico_Modelo = function () {
    /**
     * Inicializar el modelo de la vista.
     */
    this.init = function () {

        //Store del listado de sector salarial.
        this.storeSectorSalarial = new Ext.data.Store({
            url: '/pvd/nomina/index.php/nomsalarioespecifico/obtenerListadoSectoresSalariales',
            reader: new Ext.data.JsonReader(
                {totalProperty: "cantidad", autoLoad: true, root: "datos", id: "idsectorsalarial"},
                [{name: 'idsectorsalarial'}
                    , {name: 'denominacion'}
                    , {name: 'fechainicio'}
                    , {name: 'fechafin'}
                    , {name: 'descripcion'}
                ])
        });

        //Store del listado de salarios especificos.
        this.storeSalarioE = new Ext.data.Store({
            url: '/pvd/nomina/index.php/nomsalarioespecifico/obtenerListadoSalarioEspecifico',
            reader: new Ext.data.JsonReader(
                {totalProperty: "cantidad", autoLoad: true, root: "datos", id: "idsalarioespecifico"},
                [{name: 'idsalarioespecifico'}
                    , {name: 'denominacioncargo'}
                    , {name: 'salario'}
                    , {name: 'fechainicio'}
                    , {name: 'fechafin'}
                    , {name: 'descripcion'}
                    , {name: 'idsectorsalarial'}
                ])
        });

    }
};

//Vista del componente Nomenclador de salarios especificos.
var Pvd_Nomina_Nomencladores_NomSalarioEspecifico_Vista = function () {
    /**
     * Inicializar la vista.
     *
     * @param perfil Objeto que contiene el perfil de la IU (Tipo: Object).
     * @param idioma Objeto que contiene el idioma de los textos de la IU (Tipo: Object).
     * @param modelo Modelo de la vista del componente Nomenclador de salarios especificos (Tipo: Pvd_Nomina_Nomencladores_NomSalarioEspecifico_Modelo).
     */
    this.init = function (perfil, idioma, modelo) {
        var self = this;

        //Listado de sectores salariales.
        function centrarValor(val) {
            if (val)
                return "<center>" + val + "</center>";
        }

        this.smSectorS = new Ext.grid.RowSelectionModel({
            singleSelect: true,
        });

        this.gpSectorS = new Ext.grid.GridPanel({
            id: 'idgpSectorS',
            title: idioma.lbTitleSectorS,
            region: 'center',
            columns: [{header: 'idsectorsalarial', hidden: true, hideable: false, dataIndex: 'idsectorsalarial'}
                , {header: idioma.lbColDenominacion, width: 500, sortable: true, dataIndex: 'denominacion'}
            ],
            stripeRows: true,
            autoScroll: true,
            border: false,
            width: '100%',
            heigth: '100%',
            viewConfig: {forceFit: true},
            store: modelo.storeSectorSalarial,
            sm: this.smSectorS,
            loadMask: {msg: idioma.lbMaskGridCargando},
            bbar: new Ext.PagingToolbar({
                pageSize: 20,
                store: modelo.storeSectorSalarial,
                displayInfo: true,
                displayMsg: 'Mostrando  {0} - {1} de {2}',
                emptyMsg: "0 Resultado a mostrar"
            }),
        });

        //Listado de salarios especificos.
        this.expanderSalarioE = new Ext.grid.RowExpander({
            tpl: new Ext.Template(
                '<div style="word-wrap:break-word;white-space:normal;"><p>&nbsp;&nbsp;Descripci&oacute;n:&nbsp;{descripcion}</p><br/></div>'
            ), enableCaching: false
        });

        this.smSalarioE = new Ext.grid.RowSelectionModel({
            singleSelect: true,
        });

        this.gpSalarioE = new Ext.grid.GridPanel({
            id: 'idgpSalarioE',
            title: idioma.lbTitleSalarioE,
            region: 'center',
            columns: [{header: 'idsalarioespecifico', hidden: true, hideable: false, dataIndex: 'idsalarioespecifico'}
                , this.expanderSalarioE
                , {header: idioma.lbColDenominacioncargo, width: 300, sortable: true, dataIndex: 'denominacioncargo'}
                , {header: idioma.lbColSalario, width: 200, sortable: true, dataIndex: 'salario'}
                , {header: 'idsector', width: 500, hidden: true, sortable: true, dataIndex: 'idsectorsalarial'}
                , {
                    header: '<center>' + idioma.lbColDesde + '</center>',
                    width: 200,
                    sortable: true,
                    dataIndex: 'fechainicio',
                    renderer: centrarValor
                }
                , {
                    header: '<center>' + idioma.lbColHasta + '</center>',
                    width: 200,
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
            store: modelo.storeSalarioE,
            sm: this.smSalarioE,
            plugins: this.expanderSalarioE,
            loadMask: {msg: idioma.lbMaskGridCargando},
            bbar: new Ext.PagingToolbar({
                pageSize: 20,
                store: modelo.storeSalarioE,
                displayInfo: true,
                displayMsg: 'Mostrando  {0} - {1} de {2}',
                emptyMsg: "0 Resultado a mostrar"
            }),
        });

        //Botones de Add, Mod, Elim, Ayud de salarios especificos.
        this.btnAdicionarSalarioE = new Ext.Button({
            id: 'btnAdicionarSalarioE',
            text: idioma.lbBtnAdicionar,
            tooltip: idioma.textToolTipAddSalarioE,
            //  icon: perfil.dirImg+'adicionar.png',
            iconCls: 'adicionar',
            prevTab: 'btnAyudaSalarioE',
            nextTab: 'btnModificarSalarioE',
        });

        this.btnModificarSalarioE = new Ext.Button({
            id: 'btnModificarSalarioE',
            text: idioma.lbBtnModificar,
            tooltip: idioma.textToolTipModSalarioE,
            // icon: perfil.dirImg+'modificar.png',
            iconCls: 'modificar',
            prevTab: 'btnAdicionarSalarioE',
            nextTab: 'btnEliminarSalarioE',
        });

        this.btnEliminarSalarioE = new Ext.Button({
            id: 'btnEliminarSalarioE',
            text: idioma.lbBtnEliminar,
            tooltip: idioma.textToolTipElimSalarioE,
            // icon: perfil.dirImg+'eliminar.png',
            iconCls: 'eliminar',
            prevTab: 'btnModificarSalarioE',
            nextTab: 'btnAyudaSalarioE',
        });

        this.btnExportarSalarioE = new Ext.Button({
            id: 'btnExportarSalarioE',
            text: 'Exportar',
            tooltip: 'Exportar',
            iconCls: 'exportar'
        });

        this.btnAyudaSalarioE = new Ext.Button({
            id: 'btnAyudaSalarioE',
            text: idioma.lbBtnAyuda,
            tooltip: idioma.textToolTipAyudaSalarioE,
            // icon:perfil.dirImg+'ayuda.png',
            iconCls: 'ayuda',
            prevTab: 'btnElimSistP',
            nextTab: 'btnAddSistP',
        });

        //Panel contenedor general de los grids de salarios especificos. 
        this.panelCentral = new Ext.Panel({
            id: 'idpanelCentral',
            region: 'center',
            heigth: '100%',
            width: '100%',
            border: false,
            layout: 'border',
            items: [{
                region: 'center',
                width: '40%',
                border: true,
                layout: 'fit',
                tbar: [this.btnExportarSalarioE],
                items: [this.gpSectorS]
            }, {
                region: 'east',
                width: '60%',
                border: true,
                layout: 'fit',
                tbar: [this.btnAdicionarSalarioE, this.btnModificarSalarioE, this.btnEliminarSalarioE, '->', this.btnAyudaSalarioE],
                items: [this.gpSalarioE]
            }
            ],
        });

        //Campo del formulario de salarios especificos.
        this.tfDenomSalarioE = new Ext.form.TextField({
            id: 'idtfDenomSalarioE', fieldLabel: idioma.lbColDenominacion,
            tabIndex: 2, name: 'denominacion',
            allowBlank: false, anchor: '90%',
            prevTab: 'idbtnAceptarSalarioE',
            regex: /^([a-zA-ZÁÉÍÓÚáéíóúñüÑ\d ]+(\d*)?)+$/,
            regexText: idioma.lbDenomIncorr,
            blankText: idioma.lbErrorCampoVacio,
            maxLength: 100,
            maxLengthText: idioma.lbMaxText_100,

        });

        this.nfSalario = new Ext.form.NumberField({
            id: 'nfSalario', fieldLabel: idioma.lbColSalariocargo,
            tabIndex: 3, name: 'salario',
            allowBlank: false, anchor: '99%',
            blankText: idioma.lbErrorCampoVacio,
            prevTab: 'idtfDenomSalarioE',
            maskRe: /[0-9.]/i,
            regex: /^\d+(\.\d{1,2})?$/i,
            regexText: idioma.lbErrorFormatoNum,
            maxValue: 99999,
            maxText: idioma.lbErrorFormatoNum,
        });

        this.dfFInicioSalarioE = new Ext.form.DateField({
            id: 'iddfFInicioSalarioE', fieldLabel: idioma.lbColDesde,
            tabIndex: 3, name: 'fechainicio', allowBlank: false,
            format: 'd/m/Y', editable: true, readOnly: false,
            value: new Date().format('d/m/Y'), maxText: idioma.lbFechaMaxima,
            minText: idioma.lbFechaMinima, blankText: idioma.lbErrorCampoVacio,
            invalidText: idioma.invalidTextFecha, vtype: 'daterange',
            prevTab: 'nfSalario', anchor: '90%', endDateField: 'iddfFFinSalarioE'
        });

        this.dfFFinSalarioE = new Ext.form.DateField({
            id: 'iddfFFinSalarioE', fieldLabel: idioma.lbColHasta,
            tabIndex: 4, name: 'fechafin', xtype: 'datefield', allowBlank: true,
            format: 'd/m/Y', editable: true, readOnly: false,
            maxText: idioma.lbFechaMaxima, minText: idioma.lbFechaMinima,
            blankText: idioma.lbErrorCampoVacio, invalidText: idioma.invalidTextFecha,
            vtype: 'daterange', prevTab: 'iddfFInicioSalarioE', anchor: '99%', startDateField: 'iddfFInicioSalarioE'
        });

        this.tfDescripSalarioE = new Ext.form.TextArea({
            id: 'idtfDescripSalarioE',
            fieldLabel: idioma.lbColDescripcion, tabIndex: 5,
            name: 'descripcion', allowBlank: true,
            hiddenname: 'descripcion',
            maxLength: 255,
            maxLengthText: idioma.lbMaxText_225,
            anchor: '99%', prevTab: 'iddfFFinSalarioE', nextTab: 'idbtnCancelarSalarioE',
            blankText: idioma.lbErrorCampoVacio,
        });

        //Formulario de salarios especificos.
        this.formularioSalarioE = new Ext.FormPanel({
            id: 'idformularioSalarioE',
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
                    {columnWidth: .7, layout: 'form', items: [this.tfDenomSalarioE]},
                    {columnWidth: .3, layout: 'form', items: [this.nfSalario]}
                ]
            }, {
                layout: 'column',
                items: [
                    {columnWidth: .54, layout: 'form', items: [this.dfFInicioSalarioE]},
                    {columnWidth: .46, layout: 'form', items: [this.dfFFinSalarioE]}
                ]
            },
                this.tfDescripSalarioE
            ],
        });

        //Botones de la ventana de salarios especificos
        this.btnCancelarSalarioE = new Ext.Button({
            id: 'idbtnCancelarSalarioE',
            iconCls: 'cancelar',
            //icon:perfil.dirImg+'cancelar.png',
            text: idioma.lbBtnCancelar,
            tooltip: idioma.textToolTipCancelar,
            prevTab: 'idtfDescripSalarioE',
            nextTab: 'idbtnAplicarSalarioE',
        });

        this.btnAplicarSalarioE = new Ext.Button({
            id: 'idbtnAplicarSalarioE',
            iconCls: 'aplicar',
            // icon:perfil.dirImg+'aplicar.png',
            text: idioma.lbBtnAplicar,
            tooltip: idioma.textToolTipAplicar,
            prevTab: 'idbtnCancelarSalarioE',
            nextTab: 'idbtnAceptarSalarioE',
        });

        this.btnAceptarSalarioE = new Ext.Button({
            id: 'idbtnAceptarSalarioE',
            iconCls: 'aceptar',
            // icon:perfil.dirImg+'aceptar.png',
            text: idioma.lbBtnAceptar,
            tooltip: idioma.textToolTipAceptar,
            prevTab: 'idbtnAplicarSalarioE',
            nextTab: 'idtfDenomSalarioE',
        });

        //Ventana de adicionar y modificar salarios especificos.
        this.ventanaSalarioE = new Ext.Window({
            modal: true,
            closeAction: 'hide',
            autoHeight: true,
            closable: true,
            resizable: false,
            constrain: true,
            layout: 'fit',
            autoValidate: true,
            validateDefault: true,
            items: [this.formularioSalarioE],
            buttons: [this.btnCancelarSalarioE, this.btnAplicarSalarioE, this.btnAceptarSalarioE],
            keys: [
                {
                    key: Ext.EventObject.ENTER,
                    stopEvent: true,
                    fn: function () {
                        self.btnAceptarSalarioE.handler();
                    }
                }, {
                    key: 'x',
                    alt: true,
                    stopEvent: true,
                    fn: function () {
                        self.btnCancelarSalarioE.handler();
                    }
                }, {
                    key: 'p',
                    alt: true,
                    stopEvent: true,
                    fn: function () {
                        self.btnAplicarSalarioE.handler();
                    }
                }
            ]
        });
    }
};

//Controlador de la vista del Nomenclador de salarios especificos.
var Pvd_Nomina_Nomencladores_NomSalarioEspecifico_Controlador = function () {
    /**
     * Inicializar el controlador de la vista.
     *
     * @param idioma Objeto que contiene el idioma de los textos de la IU (Tipo: Object).
     * @param vista Vista del componente Nomenclador de salarios especificos (Tipo: Pvd_Nomina_Nomencladores_NomSalarioEspecifico_Vista)
     * @param modelo Modelo de la vista del componente Nomenclador de salarios especificos (Tipo: Pvd_Nomina_Nomencladores_NomSalarioEspecifico_Modelo)
     */
    this.init = function (idioma, vista, modelo) {
        var _vista = vista;
        /**
         *Variables generales.
         */
        var variablesGenerales = {
            accionFormP: 'Add',
            cambioFormP: 0,
            accionSalEsp: 'Add',
            cambioSalEsp: 0,
            idsectorsalarial: 0,
        };

        vista.gpSectorS.on('destroy', function (e) {
            vista.ventanaSalarioE.destroy();
        });

        //Eventos del grid de salarios especificos.
        vista.gpSalarioE.on('rowdblclick', function (e) {
            mostrarVentanaModificarSalarioE();
        });

        vista.gpSalarioE.on('destroy', function (e) {
            vista.ventanaSalarioE.destroy();
        });

        //Eventos del store de sectores.
        modelo.storeSectorSalarial.on('beforeload', function (store) {
            store.removeAll();

            variablesGenerales.idsectorsalarial = 0;

            vista.btnAdicionarSalarioE.disable();
            vista.btnModificarSalarioE.disable();
            vista.btnEliminarSalarioE.disable();
            modelo.storeSalarioE.removeAll();
        });

        modelo.storeSectorSalarial.on('load', function (store, records, opt) {
            if (!records.length) {
                mostrarMensaje(1, idioma.lbMsgNoExistenDatos);
            }
        });

        //Eventos del store de salarios especificos.
        modelo.storeSalarioE.on('beforeload', function (store) {
            store.baseParams.idsectorsalarial = variablesGenerales.idsectorsalarial;
            vista.btnModificarSalarioE.disable();
            vista.btnEliminarSalarioE.disable();
            store.removeAll();
        });

        modelo.storeSalarioE.on('load', function (store, records, opt) {
            if (!records.length) {
                mostrarMensaje(1, idioma.lbMsgNoExistenDatos);
            }
        });

        //Eventos del seleccion model del grid de sectores.
        vista.smSectorS.on('rowselect', function (sm, index, store) {
            variablesGenerales.idsectorsalarial = store.get('idsectorsalarial');
            modelo.storeSalarioE.load({params: {limit: 20, start: 0}});
            vista.btnAdicionarSalarioE.enable();
        });

        //Eventos del seleccion model del grid de salarios especificos.
        vista.smSalarioE.on('rowselect', function () {
            vista.btnModificarSalarioE.enable();
            vista.btnEliminarSalarioE.enable();
        });

        //Eventos de campo de denominacion salarios especificos. 
        vista.tfDenomSalarioE.on('change', function (tf, n, o) {
            variablesGenerales.cambioSalEsp = 1;
        });

        //Eventos de campo de salario salarios especificos.
        vista.nfSalario.on('change', function (tf, n, o) {
            variablesGenerales.cambioSalEsp = 1;
        });

        //Eventos de campo de fecha inicio salarios especificos. 
        vista.dfFInicioSalarioE.on('change', function (tf, n, o) {
            variablesGenerales.cambioSalEsp = 1;
        });

        //Eventos de campo de fecha fin salarios especificos. 
        vista.dfFFinSalarioE.on('change', function (tf, n, o) {
            variablesGenerales.cambioSalEsp = 1;
        });

        //Eventos de campo de descripcion salarios especificos. 
        vista.tfDescripSalarioE.on('change', function (tf, n, o) {
            variablesGenerales.cambioSalEsp = 1;
        });

        //Eventos del botón adicionar salarios especificos.
        vista.btnAdicionarSalarioE.setHandler(function () {
            mostrarVentanaAdicionarSalarioE();
        });

        //Eventos del botón modificar salarios especificos.
        vista.btnModificarSalarioE.setHandler(function () {
            mostrarVentanaModificarSalarioE();
        });

        //Eventos del botón eliminar salarios especificos.
        vista.btnEliminarSalarioE.setHandler(function () {
            eliminarSalarioE();
        });

        //Exportar
        vista.btnExportarSalarioE.on('click', function () {
            var winload = new Ext.PVD.comun.window.winLoad({
                title: 'Por favor espere...',
                mensaje: 'Generando reporte'
            });
            winload.showMask();
            var iframe = document.createElement("iframe");
            iframe.src = document.location.protocol + '//' + document.location.host +
                '/pvd/nomina/index.php/nomsalarioespecifico/exportarNomenclador';
            iframe.style.display = 'none';
            var that = this;
            iframe.onload = function () {
                winload.hideMask();
                //that.destroy();
            };
            document.body.appendChild(iframe);
        });

        //Eventos del botón cancelar salarios especificos.
        vista.btnCancelarSalarioE.setHandler(function () {
            vista.ventanaSalarioE.hide();
        });

        //Eventos del botón aplicar salarios especificos.
        vista.btnAplicarSalarioE.setHandler(function () {
            salvarFormularioSalarioE(true);
        });

        //Eventos del botón aceptar salarios especificos.
        vista.btnAceptarSalarioE.setHandler(function () {
            salvarFormularioSalarioE(false);
        });

        //Evento de la ventana de adicionar/modificar salarios especificos.
        vista.ventanaSalarioE.on('beforeshow', function (ventana) {
            vista.formularioSalarioE.getForm().reset();
            vista.tfDenomSalarioE.focus(true, 500);
        });


        /*
         *Función de mostrar la ventana de adicionar salarios especificos.
         */
        function mostrarVentanaAdicionarSalarioE() {
            vista.ventanaSalarioE.setTitle(idioma.lbTitleVentAdicionarSalarioE);
            vista.btnAplicarSalarioE.show();
            vista.ventanaSalarioE.show();
            //Actualizar la tabulación deL formulario.
            vista.btnCancelarSalarioE.setNextElement('idbtnAplicarSalarioE');
            vista.btnAceptarSalarioE.setPreviousElement('idbtnAplicarSalarioE');
            variablesGenerales.accionSalEsp = 'Add';
        }

        /*
         *Función de mostrar la ventana de modificar salarios especificos.
         */
        function mostrarVentanaModificarSalarioE() {
            vista.ventanaSalarioE.setTitle(idioma.lbTitleVentModificarSalarioE);
            vista.btnAplicarSalarioE.hide();
            vista.ventanaSalarioE.show();
            vista.tfDenomSalarioE.setValue(vista.smSalarioE.getSelected().get('denominacioncargo'));
            //Actualizar la tabulación deL formulario.
            vista.btnCancelarSalarioE.setNextElement('idbtnAceptarSalarioE');
            vista.btnAceptarSalarioE.setPreviousElement('idbtnCancelarSalarioE');
            vista.formularioSalarioE.getForm().loadRecord(vista.smSalarioE.getSelected());
            variablesGenerales.accionSalEsp = 'Mod';
        }

        /*
         *Función para adicionar/modificar un salarios especificos.
         */
        function salvarFormularioSalarioE(boton) {

            var urlAction = '/pvd/nomina/index.php/nomsalarioespecifico/adicionarSalarioEspecifico';
            var idsalarioesp = 0;
            var idsectorsalarial = vista.smSectorS.getSelected().get('idsectorsalarial');
            var lbMsgEspera = idioma.lbMsgAdicionarSalarioE;
            var lbMsgExito = idioma.lbMsgCorrectoAdicionadoSalarioE;

            if (variablesGenerales.accionSalEsp == 'Mod') {
                lbMsgEspera = idioma.lbMsgModificarSalarioE;
                lbMsgExito = idioma.lbMsgCorrectoModificadoSalarioE;
                urlAction = '/pvd/nomina/index.php/nomsalarioespecifico/modificarSalarioEspecifico';
                idsalarioesp = vista.smSalarioE.getSelected().get('idsalarioespecifico');
            }
            if (variablesGenerales.cambioSalEsp == 0) {
                if (variablesGenerales.accionSalEsp == 'Mod') {
                    //Se oculta la ventana si no ha sido modificado ningún valor.
                    vista.ventanaSalarioE.hide();
                } else {
                    //Se marcan como obligatorios en caso de presionar aceptar y se encuentren vacíos.
                    vista.tfDenomSalarioE.markInvalid(idioma.lbErrorCampoVacio);
                    mostrarMensaje(3, idioma.lbErrorFormulario);
                }
            } else {
                //Se verifica si el formulario es válido y si el campo sueldo contiene un valor
                if (vista.formularioSalarioE.getForm().isValid()) {

                    var idsalario = idsalarioesp;
                    var idsector = idsectorsalarial;

                    //Se muestra la máscara de espera.
                    PVD.mostrarMascara('idmaskaddmodsistemap', idioma.lbMsgEsperaEnviarDatos, lbMsgEspera);

                    //Enviando datos al servidor.
                    Ext.Ajax.request({
                        url: urlAction,
                        method: 'POST',
                        params: {
                            idsalarioesp: idsalarioesp,
                            denominacion: vista.tfDenomSalarioE.getValue(),
                            salario: vista.nfSalario.getValue(),
                            fechainicio: vista.dfFInicioSalarioE.getRawValue(),
                            fechafin: vista.dfFFinSalarioE.getRawValue(),
                            descripcion: vista.tfDescripSalarioE.getValue(),
                            idsector: idsector,
                        },
                        callback: function (options, success, response) {
                            responseData = Ext.decode(response.responseText);

                            //Ocultando máscara de enviar datos.
                            PVD.ocultarMascara('idmaskaddmodsistemap');

                            if (responseData.codigo == 1) {
                                mostrarMensaje(1, lbMsgExito);
                                if (!boton) {
                                    vista.ventanaSalarioE.hide();

                                } else {
                                    vista.tfDenomSalarioE.focus(true, 500);
                                }
                                vista.formularioSalarioE.getForm().reset();
                                modelo.storeSalarioE.removeAll();
                                modelo.storeSalarioE.load({params: {limit: 20, start: 0}});
                                variablesGenerales.cambioSalEsp = 0;


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
         *Función para eliminar un sistema de pago.
         */
        function eliminarSalarioE() {
            //Mostrando el mensaje para aceptar el eliminar.
            mostrarMensaje(2, idioma.lbTitleEliminarSalarioE, function (btn) {
                if (btn == "ok") {
                    //Se muestra la máscara de espera.
                    PVD.mostrarMascara('idmaskeleminarsistp', idioma.lbMsgEsperaEnviarDatos, idioma.lbMsgEliminarSalarioE);
                    //Enviando los datos al servidor.
                    Ext.Ajax.request({
                        url: '/pvd/nomina/index.php/nomsalarioespecifico/eliminarSalarioEspecifico',
                        method: 'POST',
                        params: {idsalarioespecifico: vista.smSalarioE.getSelected().get('idsalarioespecifico')},
                        callback: function (options, success, response) {
                            //Se oculta la máscara de espera.
                            PVD.ocultarMascara('idmaskeleminarsistp');
                            responseData = Ext.decode(response.responseText);
                            if (responseData.codigo == 1) {
                                //Mostrando el mensaje de que se ha el salarios especificos.
                                mostrarMensaje(1, idioma.lbMsgCorrectoEliminadoSalarioE);
                                //Recargando el grid de salarios especificos.
                                modelo.storeSalarioE.load({params: {limit: 20, start: 0}});

                            } else {
                                if (responseData.codigo)
                                    mostrarMensaje(responseData.codigo, idioma.lbMsgErrorSalEspecUso);
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
                        if (!vista.btnAdicionarSalarioE.disabled && !vista.ventanaSalarioE.isVisible()) {
                            mostrarVentanaAdicionarSalarioE();
                        }
                        break;
                    }
                    case 77: { //m para modificar .
                        if (!vista.btnModificarSalarioE.disabled && !vista.ventanaSalarioE.isVisible()) {
                            mostrarVentanaModificarSalarioE();
                        }
                        break;
                    }
                    case 72: { //h para ayuda.
                        if (!vista.ventanaSalarioE.isVisible()) {
                            vista.btnAyudaSalarioE.focus();
                            vista.btnAyudaSalarioE.fireEvent('click');
                        }
                        break;
                    }
                }
            }
        }, {
            key: 46,//del para eliminar.
            fn: function () {
                if (!vista.btnEliminarSalarioE.disabled && !vista.ventanaSalarioE.isVisible()) {
                    eliminarSalarioE();
                }
            },
        }, {
            key: 13,//enter para aceptar.
            fn: function () {
                if (vista.btnAceptarSalarioE.isVisible()) {
                    vista.btnAceptarSalarioE.focus();
                    vista.btnAceptarSalarioE.fireEvent('click');
                }
            },
        }]);
    }
};

variablesGlobales.nomsalarioespecifico_js = 1;
