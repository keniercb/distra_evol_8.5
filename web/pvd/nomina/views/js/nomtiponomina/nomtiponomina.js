/**
 * Nomenclador de tipos de nomina.
 *
 * @author Tte. Frank Rodriguez Berroa.
 * @package Pvd.
 * @subpackage Nomina - Nomencladores.
 * @category Clase Interfaz.
 * @uses Pvd.Nomina.Nomencladores.NomTipoNomina.Panel
 * @copyright UCID
 * @version 1.0
 */
Ext.ns('Pvd.Nomina.Nomencladores.NomTipoNomina');

Pvd.Nomina.Nomencladores.NomTipoNomina.Panel = Ext.extend(Ext.Panel, {
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
        this.modelo = new Pvd_Nomina_Nomencladores_NomTipoNomina_Modelo();
        this.modelo.init();

        //Inicializando la vista.
        this.vista = new Pvd_Nomina_Nomencladores_NomTipoNomina_Vista();
        this.vista.init(this.perfil, this.idioma, this.modelo);

        //Inicializar controlador.
        this.controlador = new Pvd_Nomina_Nomencladores_NomTipoNomina_Controlador();
        this.controlador.init(this.idioma, this.vista, this.modelo);

        this.items = [this.vista.panelCentralTipoN];

        //Teclas calientes de la interfaz
        this.keyMap = this.controlador.keyMap;

        Pvd.Nomina.Nomencladores.NomTipoNomina.Panel.superclass.initComponent.call(this);
    },
    listeners    : {
        afterlayout: function (x) {
            if (this.mostrar == 1) {
                this.modelo.storeTipoNomina.load({params: {limit: 1000, start: 0}});
                this.mostrar = 2;
            }
        },
        destroy    : function (x) {
            this.keyMap.disable();
        },
    },
});

//Modelo de la vista del Nomenclador de tipos de nómina.
var Pvd_Nomina_Nomencladores_NomTipoNomina_Modelo = function () {
    /**
     * Inicializar el modelo de la vista.
     */
    this.init = function () {

        //Store del listado de tipos de nómina.
        this.storeTipoNomina = new Ext.data.Store({
            url   : '/pvd/nomina/index.php/nomtiponomina/obtenerListadoTiposNomina',
            reader: new Ext.data.JsonReader(
                {totalProperty: "cantidad", autoLoad: true, root: "datos", id: "idtiponomina" },
                [
                    {name: 'idtiponomina'}
                    ,
                    {name: 'denominacion'}
                    ,
                    {name: 'fechainicio'}
                    ,
                    {name: 'fechafin'}
                    ,
                    {name: 'descripcion'}
                    ,
                    {name: 'acumulavacaciones'}
                    ,
                    {name: 'tipomoneda'}
                    ,
                    {name: 'idoperacioncontable'}
                    ,
                    {name: 'denomoperacioncontable'}
                    ,
                    {name: 'idoperacioncontablecuentasporcobrar'}
                    ,
                    {name: 'denomoperacioncontablecuentaspcobrar'}
                    ,
                    {name: 'acumulasnc'}
                    ,
                    {name: 'reintegro'},
                    {name: 'textreintegro'}
                ])
        });

        //Store del listado de operaciones contables.
        this.storeOperacionContable = new Ext.data.Store({
            url   : '/pvd/nomina/index.php/nomtiponomina/obtenerOperacionesContables',
            reader: new Ext.data.JsonReader(
                {totalProperty: "cantidad", autoLoad: true, root: "datos", id: "idoperacioncontable" },
                [
                    {name: 'idoperacioncontable'}
                    ,
                    {name: 'denomoperacioncontable'}
                ])
        });

        //Store del listado de operaciones contables.
        this.storeOperacionContableCuenntaporCobrar = new Ext.data.Store({
            url   : '/pvd/nomina/index.php/nomtiponomina/obtenerOperacionesContablesCuentasPorCobrar',
            reader: new Ext.data.JsonReader(
                {totalProperty: "cantidad", autoLoad: true, root: "datos", id: "idoperacioncontablecuentasporcobrar" },
                [
                    {name: 'idoperacioncontablecuentasporcobrar'}
                    ,
                    {name: 'denomoperacioncontablecuentaspcobrar'}
                ])
        });

        this.storeAcumula = new Ext.data.SimpleStore({
            fields: [
                {name: 'acumulavacaciones'}
                ,
                {name: 'denominacion'}
            ],
            data  : [
                [1, 'Acumula vacaciones'],
                [2, 'Liquida vacaciones'],
                //[4, 'Acumula y liquida vacaciones'],
                [3, 'No acumula ni liquida']
            ]
        });

        this.storeTipoMoneda = new Ext.data.SimpleStore({
            fields: [
                {name: 'tipomoneda'}
                ,
                {name: 'denomtipomoneda'}
            ],
            data  : [
                [1, 'CUP'],
                [2, 'CUC']
            ]
        });

        this.storeSNC = new Ext.data.SimpleStore({
            fields: [
                {name: 'acumulasnc'}
                ,
                {name: 'denom'}
            ],
            data  : [
                [1, 'Si'],
                [2, 'No']
            ]
        });

        this.storeReintegro = new Ext.data.SimpleStore({
            fields: [
                {name: 'reintegro'}
                ,
                {name: 'textreintegro'}
            ],
            data  : [
                [1, 'Si'],
                [2, 'No']
            ]
        });
    }
};

//Vista del componente Nomenclador de tipos de nómina.
var Pvd_Nomina_Nomencladores_NomTipoNomina_Vista = function () {
    /**
     * Inicializar la vista.
     *
     * @param perfil Objeto que contiene el perfil de la IU (Tipo: Object).
     * @param idioma Objeto que contiene el idioma de los textos de la IU (Tipo: Object).
     * @param modelo Modelo de la vista del componente Nomenclador de tipos de nómina (Tipo: Pvd_Nomina_Nomencladores_NomTipoNomina_Modelo).
     */
    this.init = function (perfil, idioma, modelo) {

        var self = this;

        //Listado de tipos de nómina.
        function centrarValor(val) {
            if (val)
                return "<center>" + val + "</center>";
        }

        this.expanderTipoNomina = new Ext.grid.RowExpander({
            tpl             : new Ext.Template(
                '<div style="word-wrap:break-word;white-space:normal;"><p>&nbsp;&nbsp;Descripci&oacute;n:&nbsp;{descripcion}</p><br/></div>'
            ), enableCaching: false
        });

        this.smTipoNomina = new Ext.grid.RowSelectionModel({
            singleSelect: true
        });

        function formatearAcumalacVac(val) {
            if (val == 1) {
                return "<center>Acumula vacaciones</center>";
            } else if (val == 2) {
                return "<center>Liquida Vacaciones</center>";
            } else if (val == 4){
                return "<center>Acumula y liquida vacaciones</center>";
            }else {
                return "<center>No acumula ni liquida</center>";
            }
        }
        function formatearacumulasnc(val) {
            if (val == 1) {
                return "<center>Si</center>";
            } else if (val == 2) {
                return "<center>No</center>";
            }
        }

        function imagenTipoMoneda(val) {
            if (val == 1) {
                return "<center>" + '' + "CUP" + "</center>";
            } else {
                return "<center>" + '<img src="/lib/ExtJS/temas/default/images/iconos/multimoneda.png" height=16 width=16 />' + "CUC" + "</center>";
            }
        }

        this.gpTipoNomina = new Ext.grid.GridPanel({
            id        : 'gpTipoNomina',
            title     : idioma.lbTitleTipoN,
            region    : 'center',
            columns   : [
                {header: 'idtiponomina', hidden: true, hideable: false, dataIndex: 'idtiponomina'}
                ,
                this.expanderTipoNomina
                ,
                {header: idioma.lbColDenominacion, width: 200, sortable: true, dataIndex: 'denominacion'}
                ,
                {header: '<center>' + idioma.lbColAcumula + '</center>', width: 100, sortable: true, dataIndex: 'acumulavacaciones', renderer: formatearAcumalacVac}
                ,
                {header: '<center>' + 'Acumula SNC-225' + '</center>', width: 100, sortable: true, dataIndex: 'acumulasnc', renderer: formatearacumulasnc}
                ,
                {header: '<center>' + 'Reintegro' + '</center>', width: 100, sortable: true, dataIndex: 'textreintegro', renderer: centrarValor}
                ,
                {header: '<center>' + 'Tipo moneda' + '</center>', width: 80, sortable: true, dataIndex: 'tipomoneda', renderer: imagenTipoMoneda}
//                ,
//                {header: '<center>' + idioma.lbColAcumula + '</center>', width: 130, sortable: true, dataIndex: 'acumulavacaciones', renderer: formatearAcumalacVac}
                ,
                {header: '<center>' + idioma.lbColOperacion + '</center>', width: 180, sortable: true, dataIndex: 'denomoperacioncontable'}
                //,
                //{header: '<center>' + 'Operaci&oacute;n contable cta. x cobrar' + '</center>', width: 180, sortable: true, dataIndex: 'denomoperacioncontablecuentaspcobrar'}
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
            store     : modelo.storeTipoNomina,
            sm        : this.smTipoNomina,
            plugins   : this.expanderTipoNomina,
            loadMask  : {msg: idioma.lbMaskGridCargando},
            bbar      : new Ext.PagingToolbar({
                pageSize   : 1000,
                store      : modelo.storeTipoNomina,
                displayInfo: true,
                displayMsg : 'Mostrando  {0} - {1} de {2}',
                emptyMsg   : "0 Resultado a mostrar"
            }),
        });

        //Botones de Add, Mod, Elim, Ayud de tipos de nómina.
        this.btnAdicionarTipoN = new Ext.Button({
            id     : 'btnAdicionarTipoN',
            text   : idioma.lbBtnAdicionar,
            tooltip: idioma.textToolTipAddTipoN,
            //  icon: perfil.dirImg+'adicionar.png',
            iconCls: 'adicionar',
            prevTab: 'btnAyudaTipoN',
            nextTab: 'btnModificarTipoN',
        });

        this.btnModificarTipoN = new Ext.Button({
            id     : 'btnModificarTipoN',
            text   : idioma.lbBtnModificar,
            tooltip: idioma.textToolTipModTipoN,
            // icon: perfil.dirImg+'modificar.png',
            iconCls: 'modificar',
            prevTab: 'btnAdicionarTipoN',
            nextTab: 'btnEliminarTipoN',
        });

        this.btnEliminarTipoN = new Ext.Button({
            id     : 'btnEliminarTipoN',
            text   : idioma.lbBtnEliminar,
            tooltip: idioma.textToolTipElimTipoN,
            // icon: perfil.dirImg+'eliminar.png',
            iconCls: 'eliminar',
            prevTab: 'btnModificarTipoN',
            nextTab: 'btnAyudaTipoN',
        });

        this.btnExportarTipoN = new Ext.Button({
            id: 'btnExportarTipoN',
            text: 'Exportar',
            tooltip: 'Exportar',
            iconCls: 'exportar'
        });

        this.btnAyudaTipoN = new Ext.Button({
            id     : 'btnAyudaTipoN',
            text   : idioma.lbBtnAyuda,
            tooltip: idioma.textToolTipAyudaTipoN,
            // icon:perfil.dirImg+'ayuda.png',
            iconCls: 'ayuda',
            prevTab: 'btnEliminarTipoN',
            nextTab: 'btnAdicionarTipoN',
        });

        //Panel contenedor general del grid de tipos de nómina. 
        this.panelCentralTipoN = new Ext.Panel({
            id    : 'idpanelCentralTipoN',
            region: 'center',
            heigth: '100%',
            width : '100%',
            border: false,
            layout: 'fit',
            tbar  : [this.btnAdicionarTipoN, this.btnModificarTipoN, this.btnEliminarTipoN,this.btnExportarTipoN, '->', this.btnAyudaTipoN],
            items : [this.gpTipoNomina],
        });

        //Campos del formulario de tipos de nómina.
        this.tfDenomTipoN = new Ext.form.TextField({id: 'idtfDenomTipoN', fieldLabel: idioma.lbColDenominacion,
            tabIndex                                  : 2, name: 'denominacion', allowBlank: false, anchor: '99%',
            prevTab                                   : 'idbtnAceptarTipoN',
//                                        regex:/^([a-zA-ZÁÉÍÓÚáéíóúñüÑ\d ]+(\d*)?)+$/,
            vtype                                     : 'vtdenominaciones',
            regexText                                 : idioma.lbDenomIncorr, //maskRe
            blankText                                 : idioma.lbErrorCampoVacio,
            maxLength                                 : 100,
            maxLengthText                             : idioma.lbMaxText_100,
        });

        this.cbAcumula = new Ext.form.ComboBox({id: 'idcbAcumula', fieldLabel: idioma.lbColAcumula,
            tabIndex                              : 3, valueField: 'acumulavacaciones',
            displayField                          : 'denominacion', hiddenName: 'acumulavacaciones',
            allowBlank                            : false, mode: 'local',
            store                                 : modelo.storeAcumula, emptyText: 'Seleccione...',
            blankText                             : idioma.lbErrorCampoVacio, readOnly: true,
            triggerAction                         : 'all', anchor: '90%'
        });

        this.cbAcumulaSNC = new Ext.form.ComboBox({id: 'idcbAcumulaSNC', fieldLabel: "SNC-225",
            tabIndex                              : 3, valueField: 'acumulasnc',
            displayField                          : 'denom', hiddenName: 'acumulasnc',
            allowBlank                            : false, mode: 'local',
            store                                 : modelo.storeSNC, emptyText: 'Seleccione...',
            blankText                             : idioma.lbErrorCampoVacio, readOnly: true,
            triggerAction                         : 'all', anchor: '90%'
        });

        this.cbReintegro = new Ext.form.ComboBox({id: 'cbReintegro', fieldLabel: "Reintegro",
            tabIndex                              : 3, valueField: 'reintegro',
            displayField                          : 'textreintegro', hiddenName: 'reintegro',
            allowBlank                            : false, mode: 'local',
            store                                 : modelo.storeReintegro, emptyText: 'Seleccione...',
            blankText                             : idioma.lbErrorCampoVacio, readOnly: true,
            triggerAction                         : 'all', anchor: '90%'
        });

        this.cbTipoMoneda = new Ext.form.ComboBox({id: 'cbTipoMoneda', fieldLabel: 'Tipo moneda',
            tabIndex                                 : 3, valueField: 'tipomoneda',
            displayField                             : 'denomtipomoneda', hiddenName: 'tipomoneda',
            allowBlank                               : false, mode: 'local',
            store                                    : modelo.storeTipoMoneda, emptyText: 'Seleccione...',
            blankText                                : idioma.lbErrorCampoVacio, readOnly: true,
            triggerAction                            : 'all', anchor: '99%'
        });

        this.dfFInicioTipoN = new Ext.form.DateField({id: 'iddfFInicioTipoN', fieldLabel: idioma.lbColDesde,
            tabIndex                                    : 3, name: 'fechainicio', allowBlank: false,
            format                                      : 'd/m/Y', editable: true, readOnly: false,
            value                                       : new Date().format('d/m/Y'), maxText: idioma.lbFechaMaxima,
            minText                                     : idioma.lbFechaMinima, blankText: idioma.lbErrorCampoVacio,
            invalidText                                 : idioma.invalidTextFecha, vtype: 'daterange',
            anchor                                      : '90%', endDateField: 'iddfFFinTipoN'
        });

        this.dfFFinTipoN = new Ext.form.DateField({id: 'iddfFFinTipoN', fieldLabel: idioma.lbColHasta,
            tabIndex                                 : 4, name: 'fechafin', xtype: 'datefield', allowBlank: true,
            format                                   : 'd/m/Y', editable: true, readOnly: false,
            maxText                                  : idioma.lbFechaMaxima, minText: idioma.lbFechaMinima,
            blankText                                : idioma.lbErrorCampoVacio, invalidText: idioma.invalidTextFecha,
            vtype                                    : 'daterange', anchor: '99%', startDateField: 'iddfFInicioTipoN'
        });

        this.cbOperacionContable = new Ext.form.ComboBox({id: 'idcbOperacionContable', fieldLabel: 'Operaci&oacute;n contable',
            tabIndex                                        : 3, valueField: 'idoperacioncontable',
            displayField                                    : 'denomoperacioncontable', hiddenName: 'idoperacioncontable',
            editable                                        : true,
            mode                                            : 'local',
            store                                           : modelo.storeOperacionContable, emptyText: 'Seleccione...',
            //blankText:idioma.lbErrorCampoVacio,
            readOnly                                        : false,
            triggerAction                                   : 'all', anchor: '99%'
        });

        this.cbOperacionContableCuentaPorCobrar = new Ext.form.ComboBox({id: 'cbOperacionContableCuentaPorCobrar', fieldLabel: 'Operaci&oacute;n contable Cuentas por Cobrar',
            tabIndex                                        : 3, valueField: 'idoperacioncontablecuentasporcobrar',
            displayField                                    : 'denomoperacioncontablecuentaspcobrar', hiddenName: 'idoperacioncontablecuentasporcobrar',
            //allowBlank: false,
            mode                                            : 'local',
            store                                           : modelo.storeOperacionContableCuenntaporCobrar, emptyText: 'Seleccione...',
            //blankText:idioma.lbErrorCampoVacio,
            readOnly                                        : true,
            triggerAction                                   : 'all', anchor: '99%'
        });

        this.tfDescripTipoN = new Ext.form.TextArea({id: 'idtfDescripTipoN',
            fieldLabel                                 : idioma.lbColDescripcion, tabIndex: 5,
            name                                       : 'descripcion', allowBlank: true,
            hiddenname                                 : 'descripcion',
            maxLength                                  : 255, //regex, regexText, maskRe
            maxLengthText                              : idioma.lbMaxText_255,
            anchor                                     : '99%', prevTab: 'iddfFFinTipoN', nextTab: 'idbtnCancelarTipoN',
            blankText                                  : idioma.lbErrorCampoVacio,
        });

        //Formulario de tipos de nómina.
        this.formularioTipoN = new Ext.FormPanel({
            id        : 'idformlarioTipoN',
            labelAlign: 'top',
            frame     : true,
            width     : 500,
            autoHeight: true,
            bodyStyle : {
                padding: '10px 10px 10px 10px',
            },
            items     : [this.tfDenomTipoN,
                {layout  : 'column',
                    items: [
                        {columnWidth: .4, layout: 'form', items: [this.cbAcumula]},
                        {columnWidth: .2, layout: 'form', items: [this.cbAcumulaSNC]},
                        {columnWidth: .2, layout: 'form', items: [this.cbReintegro]},
                        {columnWidth: .2, layout: 'form', items: [this.cbTipoMoneda]},
                    ]
                }, {layout: 'column',
                    items : [
                        {columnWidth: .54, layout: 'form', items: [this.dfFInicioTipoN]},
                        {columnWidth: .46, layout: 'form', items: [this.dfFFinTipoN]}
                    ]
                },
                this.cbOperacionContable,
                //this.cbOperacionContableCuentaPorCobrar,
                this.tfDescripTipoN
            ],
        });

        //Botones de la ventana de tipos de nómina
        this.btnCancelarTipoN = new Ext.Button({
            id     : 'idbtnCancelarTipoN',
            iconCls: 'cancelar',
            //  icon:perfil.dirImg+'cancelar.png',
            text   : idioma.lbBtnCancelar,
            tooltip: idioma.textToolTipCancelar,
            prevTab: 'idtfDescripTipoN',
            nextTab: 'idbtnAplicarTipoN',
        });

        this.btnAplicarTipoN = new Ext.Button({
            id     : 'idbtnAplicarTipoN',
            iconCls: 'aplicar',
            // icon:perfil.dirImg+'aplicar.png',
            text   : idioma.lbBtnAplicar,
            tooltip: idioma.textToolTipAplicar,
            prevTab: 'idbtnCancelarTipoN',
            nextTab: 'idbtnAceptarTipoN',
        });

        this.btnAceptarTipoN = new Ext.Button({
            id     : 'idbtnAceptarTipoN',
            iconCls: 'aceptar',
            // icon:perfil.dirImg+'aceptar.png',
            text   : idioma.lbBtnAceptar,
            tooltip: idioma.textToolTipAceptar,
            prevTab: 'idbtnAplicarTipoN',
            nextTab: 'idtfDenomTipoN',
        });

        //Ventana de adicionar y modificar tipos de nómina.
        this.ventanaTipoN = new Ext.Window({
            modal      : true,
            closeAction: 'hide',
            autoHeight : true,
            closable   : true,
            resizable  : false,
            layout     : 'fit',
            constrain  : true,
            autoValidate: true,
            validateDefault: true,
            items      : [this.formularioTipoN],
            buttons    : [this.btnCancelarTipoN, this.btnAplicarTipoN, this.btnAceptarTipoN],
            keys       : [
                {
                    key      : Ext.EventObject.ENTER,
                    stopEvent: true,
                    fn       : function () {
                        if (!self.btnAceptarTipoN.disabled) {
                            self.btnAceptarTipoN.handler();
                        }
                    }
                },
                {
                    key      : 'x',
                    alt      : true,
                    stopEvent: true,
                    fn       : function () {
                        if (!self.btnCancelarTipoN.disabled) {
                            self.btnCancelarTipoN.handler();
                        }
                    }
                },
                {
                    key      : 'p',
                    alt      : true,
                    stopEvent: true,
                    fn       : function () {
                        if (!self.btnAplicarTipoN.disabled) {
                            self.btnAplicarTipoN.handler();
                        }
                    }
                }
            ]
        });
    }
};

//Controlador de la vista del Nomenclador de tipos de nómina.
var Pvd_Nomina_Nomencladores_NomTipoNomina_Controlador = function () {
    /**
     * Inicializar el controlador de la vista.
     *
     * @param idioma Objeto que contiene el idioma de los textos de la IU (Tipo: Object).
     * @param vista Vista del componente Nomenclador de tipos de nómina (Tipo: Pvd_Nomina_Nomencladores_NomTipoNomina_Vista)
     * @param modelo Modelo de la vista del componente Nomenclador de tipos de nómina (Tipo: Pvd_Nomina_Nomencladores_NomTipoNomina_Modelo)
     */
    this.init = function (idioma, vista, modelo) {
        var _vista = vista;
        /**
         *Variables generales.
         */
        var variablesTipoN = {
            accion: 'Add',
            cambio: 0,
        };

        modelo.storeOperacionContable.load();
        modelo.storeOperacionContableCuenntaporCobrar.load();

        //Eventos del grid de tipos de nómina.
        vista.gpTipoNomina.on('rowdblclick', function (e) {
            mostrarVentanaModificarTipoN();
        });

        vista.gpTipoNomina.on('destroy', function (e) {
            vista.ventanaTipoN.destroy();
        });

        //Eventos del store de tipos de nómina.
        modelo.storeTipoNomina.on('beforeload', function (store) {
            vista.btnModificarTipoN.disable();
            vista.btnEliminarTipoN.disable();
            store.removeAll();
        });

        modelo.storeTipoNomina.on('load', function (store, records, opt) {
            if (!records.length) {
                mostrarMensaje(1, idioma.lbMsgNoExistenDatos);
            }
        });

        //Eventos del seleccion model del grid de tipos de nómina.
        vista.smTipoNomina.on('rowselect', function () {
            vista.btnModificarTipoN.enable();
            vista.btnEliminarTipoN.enable();
        });

        //Eventos de campo de op. 
        vista.cbOperacionContable.on('change', function (tf, n, o) {
            variablesTipoN.cambio = 1;
        });

        //Eventos de campo de op.
        vista.cbOperacionContableCuentaPorCobrar.on('change', function (tf, n, o) {
            variablesTipoN.cambio = 1;
        });

        //Eventos de campo de denominacion.
        vista.tfDenomTipoN.on('change', function (tf, n, o) {
            variablesTipoN.cambio = 1;
        });

        //Eventos de campo de acumulacion vacaciones.
        vista.cbAcumula.on('change', function (tf, n, o) {
            variablesTipoN.cambio = 1;
        });

        //Eventos de campo de acumulacion SNC-225.
        vista.cbAcumulaSNC.on('change', function (tf, n, o) {
            variablesTipoN.cambio = 1;
        });

        vista.cbReintegro.on('change', function (tf, n, o) {
            variablesTipoN.cambio = 1;
        });

        //Eventos de campo de fecha inicio. 
        vista.dfFInicioTipoN.on('change', function (tf, n, o) {
            variablesTipoN.cambio = 1;
        });

        //Eventos de campo de fecha fin. 
        vista.dfFFinTipoN.on('change', function (tf, n, o) {
            variablesTipoN.cambio = 1;
        });

        //Eventos de campo de descripcion. 
        vista.tfDescripTipoN.on('change', function (tf, n, o) {
            variablesTipoN.cambio = 1;
        });

        //Eventos de campo de tipo moneda.
        vista.cbTipoMoneda.on('change', function (tf, n, o) {
            variablesTipoN.cambio = 1;
        });

        //Eventos del botón adicionar tipos de nómina.
        vista.btnAdicionarTipoN.setHandler(function () {
            mostrarVentanaAdicionarTipoN();
        });

        //Eventos del botón modificar tipos de nómina.
        vista.btnModificarTipoN.setHandler(function () {
            mostrarVentanaModificarTipoN();
        });

        //Eventos del botón eliminar tipos de nómina.
        vista.btnEliminarTipoN.setHandler(function () {
            eliminarTipoNomina();
        });

        //Exportar
        vista.btnExportarTipoN.on('click', function () {
            var winload = new Ext.PVD.comun.window.winLoad({
                title: 'Por favor espere...',
                mensaje: 'Generando reporte'
            });
            winload.showMask();
            var iframe = document.createElement("iframe");
            iframe.src = document.location.protocol + '//' + document.location.host +
                '/pvd/nomina/index.php/nomtiponomina/exportarNomenclador';
            iframe.style.display = 'none';
            var that = this;
            iframe.onload = function () {
                winload.hideMask();
                //that.destroy();
            };
            document.body.appendChild(iframe);
        });

        //Eventos del botón cancelar tipos de nómina.
        vista.btnCancelarTipoN.setHandler(function () {
            vista.ventanaTipoN.hide();
//            vista.formularioTipoN.purgeListeners();
       });

        //Eventos del botón aplicar tipos de nómina.
        vista.btnAplicarTipoN.setHandler(function () {
            salvarFormularioTipoN(true);
        });

        //Eventos del botón aceptar tipos de nómina.
        vista.btnAceptarTipoN.setHandler(function () {
            salvarFormularioTipoN(false);
//            vista.formularioTipoN.purgeListeners();
        });

        //Evento de la ventana de adicionar/modificar tipos de nómina.
        vista.ventanaTipoN.on('beforeshow', function (ventana) {
            vista.formularioTipoN.getForm().reset();
            vista.tfDenomTipoN.focus(true, 500);
        });


        /*
         *Función de mostrar la ventana de adicionar tipos de nómina.
         */
        function mostrarVentanaAdicionarTipoN() {
            vista.ventanaTipoN.setTitle(idioma.lbTitleVentAdicionarTipoN);
            vista.btnAplicarTipoN.show();
            vista.ventanaTipoN.show();
            //Actualizar la tabulación deL formulario.
            vista.btnCancelarTipoN.setNextElement('idbtnAplicarTipoN');
            vista.btnAceptarTipoN.setPreviousElement('idbtnAplicarTipoN');
            variablesTipoN.accion = 'Add';
        }

        /*
         *Función de mostrar la ventana de modificar tipos de nómina.
         */
        function mostrarVentanaModificarTipoN() {
            vista.ventanaTipoN.setTitle(idioma.lbTitleVentModificarTipoN);
            vista.btnAplicarTipoN.hide();
            vista.ventanaTipoN.show();
            //Actualizar la tabulación deL formulario.
            vista.btnCancelarTipoN.setNextElement('idbtnAceptarTipoN');
            vista.btnAceptarTipoN.setPreviousElement('idbtnCancelarTipoN');
            vista.formularioTipoN.getForm().loadRecord(vista.smTipoNomina.getSelected());
//            vista.formularioTipoN.addListener('clientvalidation', function (_form, _valid) {
//                if (comparar(vista.formularioTipoN.getForm().getValues(), vista.smTipoNomina.getSelected().data)) {
//                    vista.btnAceptarTipoN.setDisabled(true);
//                } else {
//                    vista.btnAceptarTipoN.enable();
//                }
//            });
            variablesTipoN.accion = 'Mod';
        }

        /*
         *Función para adicionar/modificar un tipo de pago.
         */
        function salvarFormularioTipoN(boton) {
            var urlAction = '/pvd/nomina/index.php/nomtiponomina/adicionarTipoNomina';
            var idtiponomina = 0;
            var lbMsgEspera = idioma.lbMsgAdicionarTipoN;
            var lbMsgExito = idioma.lbMsgCorrectoAdicionadoTipoN;

            if (variablesTipoN.accion == 'Mod') {
                lbMsgEspera = idioma.lbMsgModificarTipoN;
                lbMsgExito = idioma.lbMsgCorrectoModificadoTipoN;
                urlAction = '/pvd/nomina/index.php/nomtiponomina/modificarTiposNomina';
                idtiponomina = vista.smTipoNomina.getSelected().get('idtiponomina');
            }
            if (variablesTipoN.cambio == 0) {
                if (variablesTipoN.accion == 'Mod') {
                    //Se oculta la ventana si no ha sido modificado ningún valor.
                    vista.ventanaTipoN.hide();
                } else {
                    //Se marcan como obligatorios en caso de presionar aceptar y se encuentren vacíos.
                    vista.tfDenomTipoN.markInvalid(idioma.lbErrorCampoVacio);
                    vista.cbAcumula.markInvalid(idioma.lbErrorCampoVacio);
                    mostrarMensaje(3, idioma.lbErrorFormulario);
                }
            } else {
                //Se verifica si el formulario es válido y si el campo sueldo contiene un valor
                if (vista.formularioTipoN.getForm().isValid()) {

                    //Se muestra la máscara de espera.
                    PVD.mostrarMascara('idmaskaddmodtipopago', idioma.lbMsgEsperaEnviarDatos, lbMsgEspera);

                    //Enviando datos al servidor.
                    Ext.Ajax.request({
                        url     : urlAction,
                        method  : 'POST',
                        params  : {idtiponomina: idtiponomina,
                            denominacion       : vista.tfDenomTipoN.getValue(),
                            fechainicio        : vista.dfFInicioTipoN.getRawValue(),
                            fechafin           : vista.dfFFinTipoN.getRawValue(),
                            operacioncontable  : vista.cbOperacionContable.getValue(),
                            operacioncontablecuentasporcobrar  : vista.cbOperacionContableCuentaPorCobrar.getValue(),
                            descripcion        : vista.tfDescripTipoN.getValue(),
                            acumulac           : vista.cbAcumula.getValue(),
                            tipomoneda         : vista.cbTipoMoneda.getValue(),
                            acumulasnc         : vista.cbAcumulaSNC.getValue(),
                            reintegro         : vista.cbReintegro.getValue()
                        },
                        callback: function (options, success, response) {
                            responseData = Ext.decode(response.responseText);

                            //Ocultando máscara de enviar datos.
                            PVD.ocultarMascara('idmaskaddmodtipopago');

                            if (responseData.codigo == 1) {
                                mostrarMensaje(1, lbMsgExito);
                                if (!boton) {
                                    vista.ventanaTipoN.hide();

                                } else {
                                    vista.tfDenomTipoN.focus(true, 500);
                                }
                                vista.formularioTipoN.getForm().reset();
                                modelo.storeTipoNomina.removeAll();
                                modelo.storeTipoNomina.load({params: {limit: 1000, start: 0}});
                                variablesTipoN.cambio = 0;


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
         *Función para eliminar un tipo de pago.
         */
        function eliminarTipoNomina() {
            //Mostrando el mensaje para aceptar el eliminar.
            mostrarMensaje(2, idioma.lbTitleEliminarTipoN, function (btn) {
                if (btn == "ok") {
                    //Se muestra la máscara de espera.
                    PVD.mostrarMascara('idmaskeleminartipopago', idioma.lbMsgEsperaEnviarDatos, idioma.lbMsgEliminarTipoN);
                    //Enviando los datos al servidor.
                    Ext.Ajax.request({
                        url     : '/pvd/nomina/index.php/nomtiponomina/eliminarTiposNomina',
                        method  : 'POST',
                        params  : {idtiponomina: vista.smTipoNomina.getSelected().get('idtiponomina')},
                        callback: function (options, success, response) {
                            //Se oculta la máscara de espera.
                            PVD.ocultarMascara('idmaskeleminartipopago');
                            responseData = Ext.decode(response.responseText);
                            if (responseData.codigo == 1) {
                                //Mostrando el mensaje de que se ha el tipo de nómina.
                                mostrarMensaje(1, idioma.lbMsgCorrectoEliminadoTipoN);
                                //Recargando el grid de tipos de nómina.
                                modelo.storeTipoNomina.load({params: {limit: 1000, start: 0}});

                            } else {
                                if (responseData.codigo)
                                    mostrarMensaje(responseData.codigo, idioma.lbMsgErrorTipoNomUso);
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
                            if (!vista.btnAdicionarTipoN.disabled && !vista.ventanaTipoN.isVisible()) {
                                mostrarVentanaAdicionarTipoN();
                            }
                            break;
                        }
                        case 77:
                        { //m para modificar .
                            if (!vista.btnModificarTipoN.disabled && !vista.ventanaTipoN.isVisible()) {
                                mostrarVentanaModificarTipoN();
                            }
                            break;
                        }
                        case 72:
                        { //h para ayuda.
                            if (!vista.ventanaTipoN.isVisible()) {
                                vista.btnAyudaTipoN.focus();
                                vista.btnAyudaTipoN.fireEvent('click');
                            }
                            break;
                        }
                    }
                }
            },
            {
                key: 46,//del para eliminar.
                fn : function () {
                    if (!vista.btnEliminarTipoN.disabled && !vista.ventanaTipoN.isVisible()) {
                        eliminarTipoNomina();
                    }
                },
            },
            {
                key: 13,//enter para aceptar.
                fn : function () {
                    if (vista.btnAceptarTipoN.isVisible()) {
                        vista.btnAceptarTipoN.focus();
                        vista.btnAceptarTipoN.fireEvent('click');
                    }
                },
            }
        ]);
    }
};

variablesGlobales.nomtiponomina_js = 1;
