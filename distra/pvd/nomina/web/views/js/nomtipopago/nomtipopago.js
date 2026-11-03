Ext.ns('Pvd.Nomina.Nomencladores.NomTipoPago');

Pvd.Nomina.Nomencladores.NomTipoPago.Panel = Ext.extend(Ext.Panel, {
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
        this.modelo = new Pvd_Nomina_Nomencladores_NomTipoPago_Modelo();
        this.modelo.init();

        //Inicializando la vista.
        this.vista = new Pvd_Nomina_Nomencladores_NomTipoPago_Vista();
        this.vista.init(this.perfil, this.idioma, this.modelo);

        //Inicializar controlador.
        this.controlador = new Pvd_Nomina_Nomencladores_NomTipoPago_Controlador();
        this.controlador.init(this.idioma, this.vista, this.modelo);

        this.items = [this.vista.panelPrincipal];

        //Teclas calientes de la interfaz
        this.keyMap = this.controlador.keyMap;

        Pvd.Nomina.Nomencladores.NomTipoPago.Panel.superclass.initComponent.call(this);
    },
    listeners: {
        afterlayout: function (x) {
            if (this.mostrar == 1) {
                this.modelo.storeTipoPago.load({params: {limit: 1000, start: 0}});
                this.mostrar = 2;
            }
        },
        destroy: function (x) {
            this.keyMap.disable();
        },
    }
});

//Modelo de la vista del Nomenclador de tipos de pago.
var Pvd_Nomina_Nomencladores_NomTipoPago_Modelo = function () {
    /**
     * Inicializar el modelo de la vista.
     */
    this.init = function () {

        //Store del listado de tipos de pago.
        this.storeTipoPago = new Ext.data.Store({
            url: '/pvd/nomina/index.php/nomtipopago/obtenerListadoTiposPago',
            sortInfo: {field: 'orden', direction: "ASC"},
            reader: new Ext.data.JsonReader(
                {
                    totalProperty: "cantidad",
                    root: "datos",
                    id: "idtipopago"
                },
                [
                    {name: 'idtipopago'}
                    ,
                    {name: 'denominacion'}
                    ,
                    {name: 'sedesglosa'}
                    ,
                    {name: 'fechainicio'}
                    ,
                    {name: 'fechafin'}
                    ,
                    {name: 'descripcion'}
                    ,
                    {name: 'modopago'}
                    ,
                    {name: 'reporte'}
                    ,
                    {name: 'idconfreportescertificaciones'}
                    ,
                    {name: 'modoseleccionpersonas'}
                    ,
                    {name: 'pagoxresultadosdestajo'}
                    ,
                    {name: 'orden'}
                    ,
                    {name: 'mismomes'}
                ])
        });


        this.storeTipoPagoDependencia = new Ext.data.Store({
            url: '/pvd/nomina/index.php/nomtipopago/obtenerListadoTiposPagoDependencia',
            reader: new Ext.data.JsonReader(
                {
                    totalProperty: "cantidad",
                    root: "datos",
                    id: "iddependencia"
                },
                [
                    {name: 'iddependencia'}
                    ,
                    {name: 'idtipopago'}
                    ,
                    {name: 'dependencia'}
                ])
        });
        this.storeTipoPagoDependenciaRestante = new Ext.data.Store({
            url: '/pvd/nomina/index.php/nomtipopago/obtenerListadoTiposPagoDependenciaRestante',
            reader: new Ext.data.JsonReader(
                {
                    totalProperty: "cantidad",
                    root: "datos",
                    id: "idtipopago"
                },
                [
                    {name: 'iddependencia'}
                    ,
                    {name: 'idtipopago'}
                    ,
                    {name: 'dependencia'}
                ])
        });

        //Store del listado de tipos de pago.
        this.storeTipoReporte = new Ext.data.Store({
            url: '/pvd/nomina/index.php/nomtipopago/obtenerListadoTipoReporte',
            reader: new Ext.data.JsonReader(
                {
                    totalProperty: "cantidad",
                    //autoLoad  : true,
                    root: "datos",
                    id: "idconfreportescertificaciones"
                },
                [
                    {name: 'idconfreportescertificaciones'}
                    ,
                    {name: 'reporte', mapping: 'denominacion'}
                ])
        });

        //Store del combo de modo de seleccion de las personas.
        this.storeModoSeleccionPersona = new Ext.data.SimpleStore({
            fields: [
                {name: 'modoseleccionpersonas'}
                ,
                {name: 'denominacion'}
            ],
            data: [
                [1, 'Todas las personas'],
                [2, 'Personas específicas'],
                [3, 'Personas específicas de reporte']
            ]
        });

        //Store del combo de modo pago.
        this.storeFormaEfectuarPago = new Ext.data.SimpleStore({
            fields: [
                {name: 'modopago'}
                ,
                {name: 'denominacion'}
            ],
            data: [
                [1, 'Pago por período'],
                [2, 'Mes específico']
            ]
        });

        //Store del combo de desglosa.
        this.storeDesglosa = new Ext.data.SimpleStore({
            fields: [
                {name: 'sedesglosa'}
                ,
                {name: 'denominacion'}
            ],
            data: [
                [1, 'Si'],
                [2, 'No']
            ]
        });

        //Store del combo de desglosa.
        this.storeConfig = new Ext.data.SimpleStore({
            fields: [
                {name: 'configurable'}
                ,
                {name: 'denominacion'}
            ],
            data: [
                [0, 'No'],
                [1, 'Si']
            ]
        });

        //Store del combo de modo de seleccion de las personas.
        this.storePagoxResultadosDestajo = new Ext.data.SimpleStore({
            fields: [
                {name: 'pagoxresultadosdestajo'}
                ,
                {name: 'denompagoxresultadosdestajo'}
            ],
            data: [
                [1, 'Pago por resultados'],
                [2, 'Destajo'],
                [3, 'Ninguno'],
            ]
        });
    }
};

//Vista del componente Nomenclador de tipos de pago.
var Pvd_Nomina_Nomencladores_NomTipoPago_Vista = function () {
    /**
     * Inicializar la vista.
     *
     * @param perfil Objeto que contiene el perfil de la IU (Tipo: Object).
     * @param idioma Objeto que contiene el idioma de los textos de la IU (Tipo: Object).
     * @param modelo Modelo de la vista del componente Nomenclador de tipos de pago (Tipo: Pvd_Nomina_Nomencladores_NomTipoPago_Modelo).
     */
    this.init = function (perfil, idioma, modelo) {

        var variables = {
            idtipopago: -1
        };

        var self = this;
        //this. = this;
        //var self = this;

        //Listado de tipos de pago.
        function centrarValor(val) {
            if (val)
                return "<center>" + val + "</center>";
        }

        this.expanderTipoPago = new Ext.grid.RowExpander({
            tpl: new Ext.Template(
                '<div style="word-wrap:break-word;white-space:normal;"><p>&nbsp;&nbsp;Descripci&oacute;n:&nbsp;{descripcion}</p><br/></div>'
            ), enableCaching: false
        });

        function formatearConf(val) {
            if (val == 1)
                return "<center>Si</center>";
            else
                return "<center>No</center>";
        }

        function formatearDesglosa(val) {
            if (val == 1)
                return "<center>Si</center>";
            else
                return "<center>No</center>";
        }

        function formatearModoPago(val) {
            if (val == 1)
                return "<center>Pago por período</center>";
            else
                return "<center>Mes específico</center>";
        }

        function formatearModoSeleccionPersona(val) {
            if (val == 1)
                return "<center>Elaborar pagos</center>";
            else if (val == 3)
                return "<center>Específicas reporte</center>";
            else
                return "<center>Específicas</center>";
        }

        this.smTipoPago = new Ext.grid.RowSelectionModel({
            singleSelect: true,
        });

        this.smTipoPagoDependencia = new Ext.grid.CheckboxSelectionModel({
            singleSelect: false
        });

        this.smTipoPagoDependenciaRestante = new Ext.grid.CheckboxSelectionModel({
            singleSelect: false
        });

        this.gpTipoPago = new Ext.grid.GridPanel({
            id: 'idgpTipoPago',
            title: idioma.lbTitleTipoPago,
            region: 'center',
            columns: [
                {header: 'idtipopago', hidden: true, hideable: false, dataIndex: 'idtipopago'}
                ,
                {
                    header: 'idconfreportescertificaciones',
                    hidden: true,
                    hideable: false,
                    dataIndex: 'idconfreportescertificaciones'
                }
                ,
                this.expanderTipoPago
                ,
                {header: idioma.lbColDenominacion, width: 160, sortable: true, dataIndex: 'denominacion'}
                ,
//                {header: '<center>' + idioma.lbColSeDesglosa + '</center>', width: 80, sortable: true, dataIndex: 'sedesglosa', renderer: formatearDesglosa}
//                ,
//                {header: idioma.lbColDenomModoPago, width: 130, sortable: true, dataIndex: 'modopago', renderer: formatearModoPago}
//                ,
                {
                    header: idioma.lbColDenomModoSeleccion,
                    width: 130,
                    sortable: true,
                    dataIndex: 'modoseleccionpersonas',
                    renderer: formatearModoSeleccionPersona
                }
                ,
                {header: idioma.lbColReporte, width: 130, sortable: true, dataIndex: 'reporte', renderer: centrarValor}
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
                ,
                {
                    header: '<center>Orden</center>',
                    width: 90,
                    sortable: true,
                    dataIndex: 'orden',
                    type: 'string',
                    renderer: centrarValor
                }
                ,
                {
                    header: '<center>Mismo mes</center>',
                    width: 90,
                    sortable: true,
                    dataIndex: 'mismomes',
                    type: 'string',
                    renderer: formatearDesglosa
                }
            ],
            stripeRows: true,
            autoScroll: true,
            border: false,
            width: '100%',
            heigth: '100%',
            viewConfig: {forceFit: true},
            store: modelo.storeTipoPago,
            sm: this.smTipoPago,
            plugins: this.expanderTipoPago,
            loadMask: {msg: idioma.lbMaskGridCargando},
            bbar: new Ext.PagingToolbar({
                pageSize: 1000,
                store: modelo.storeTipoPago,
                displayInfo: true,
                displayMsg: 'Mostrando  {0} - {1} de {2}',
                emptyMsg: "0 Resultado a mostrar"
            })
        });

        this.gpTipoPagoDependencia = new Ext.grid.GridPanel({
            id: 'idgpTipoPagoDependencia',
            title: idioma.lbTitleTipoPagoDependencia,
            region: 'center',
            columns: [
                this.smTipoPagoDependencia,
                {header: 'idtipopago', hidden: true, hideable: false, dataIndex: 'idtipopago'},
                {header: 'iddependencia', hidden: true, hideable: false, dataIndex: 'iddependencia'},
                {header: idioma.lbColDenominacionDependencia, width: 230, sortable: true, dataIndex: 'dependencia'}
            ],
            stripeRows: true,
            autoScroll: true,
            border: false,
            width: '100%',
            heigth: '100%',
            store: modelo.storeTipoPagoDependencia,
            sm: this.smTipoPagoDependencia,
            loadMask: {msg: idioma.lbMaskGridCargando},
            keys: [
                {
                    key: Ext.EventObject.DELETE,
                    alt: true,
                    stopEvent: true,
                    fn: function () {
                        if (!self.btnEliminarTipoPDependencia.disabled) {
                            self.btnEliminarTipoPDependencia.handler();
                        }
                    }
                },
                {
                    key: 'a',
                    alt: true,
                    stopEvent: true,
                    fn: function () {
                        if (!self.btnAdicionarTipoPDependencia.disabled) {
                            self.btnAdicionarTipoPDependencia.handler();
                        }
                    }
                }
            ]
        });

        this.gpTipoPagoDependenciaRestante = new Ext.grid.GridPanel({
            id: 'idgpTipoPagoDependenciaRestante',
            title: idioma.lbTitleTipoPagoDependencia,
            region: 'center',
            columns: [
                this.smTipoPagoDependenciaRestante,
                {header: 'iddependencia', hidden: true, hideable: false, dataIndex: 'iddependencia'},
                {header: 'idtipopago', hidden: true, hideable: false, dataIndex: 'idtipopago'},
                {header: idioma.lbColDenominacionDependencia, width: 450, sortable: true, dataIndex: 'dependencia'}
            ],
            stripeRows: true,
            autoScroll: true,
            border: false,
            width: 200,
            heigth: 200,
            store: modelo.storeTipoPagoDependenciaRestante,
            sm: this.smTipoPagoDependenciaRestante,
            loadMask: {msg: idioma.lbMaskGridCargando},
        });

        //Botones de Add, Mod, Elim, Ayud de tipos de pago.
        this.btnAdicionarTipoP = new Ext.Button({
            id: 'btnAddTipoP',
            text: idioma.lbBtnAdicionar,
            tooltip: idioma.textToolTipAddTipoP,
            // icon: perfil.dirImg+'adicionar.png',
            iconCls: 'adicionar',
            prevTab: 'btnAyudaTipoP',
            nextTab: 'btnModTipoP',
        });

        this.btnAdicionarTipoPDependencia = new Ext.Button({
            id: 'btnAddTipoPDependencia',
            text: idioma.lbBtnAdicionar,
            tooltip: idioma.textToolTipAddTipoPDependencia,
            iconCls: 'adicionar',
            prevTab: 'btnAyudaTipoPDependencia',
            nextTab: 'btnModTipoPDependencia',
            disabled: true
        });

        this.btnModificarTipoP = new Ext.Button({
            id: 'btnModTipoP',
            text: idioma.lbBtnModificar,
            tooltip: idioma.textToolTipModTipoP,
            // icon: perfil.dirImg+'modificar.png',
            iconCls: 'modificar',
            prevTab: 'btnAddTipoP',
            nextTab: 'btnElimTipoP',
        });

        this.btnEliminarTipoP = new Ext.Button({
            id: 'btnElimTipoP',
            text: idioma.lbBtnEliminar,
            tooltip: idioma.textToolTipElimTipoP,
            // icon: perfil.dirImg+'eliminar.png',
            iconCls: 'eliminar',
            prevTab: 'btnModTipoP',
            nextTab: 'btnAyudaTipoP',
        });

        this.btnEliminarTipoPDependencia = new Ext.Button({
            id: 'btnElimTipoPDependencia',
            text: idioma.lbBtnEliminar,
            tooltip: idioma.textToolTipElimTipoPDependencia,
            disabled: true,
            iconCls: 'eliminar',
            prevTab: 'btnModTipoPDependencia',
            nextTab: 'btnAyudaTipoPDependencia',
        });

        this.btnExportarTipoP = new Ext.Button({
            id: 'btnExportarTipoP',
            text: 'Exportar',
            tooltip: 'Exportar',
            iconCls: 'exportar'
        });

        this.btnAyudaTipoP = new Ext.Button({
            id: 'btnAyudaTipoP',
            text: idioma.lbBtnAyuda,
            tooltip: idioma.textToolTipAyudaTipoP,
            iconCls: 'ayuda',
            prevTab: 'btnElimTipoP',
            nextTab: 'btnAddTipoP',
        });

        //Panel contenedor general del grid de tipos de pago.
        this.panelCentralTipoP = new Ext.Panel({
            id: 'idpanelCentralTipoP',
            region: 'center',
            heigth: '100%',
            width: '70%',
            border: false,
            layout: 'fit',
            tbar: [this.btnAdicionarTipoP, this.btnModificarTipoP, this.btnEliminarTipoP, this.btnExportarTipoP, '->', this.btnAyudaTipoP],
            items: [this.gpTipoPago]
        });

        this.panelDerechoTipoPDependencia = new Ext.Panel({
            id: 'idpanelCentralTipoPDependencia',
            region: 'east',
            heigth: '100%',
            width: '30%',
            border: true,
            collapsible: true,
            layout: 'fit',
            tbar: [this.btnAdicionarTipoPDependencia, /*this.btnModificarTipoPDependencia,*/ this.btnEliminarTipoPDependencia],
            items: [this.gpTipoPagoDependencia],
            disabled: true
        });

        this.panelPrincipal = new Ext.Panel({
            id: 'idpanelPrincipal',
            region: 'center',
            heigth: '100%',
            width: '100%',
            border: false,
            layout: 'border',
            items: [this.panelCentralTipoP, this.panelDerechoTipoPDependencia]
        });

        //Campos del formulario de tipos de pago.
        this.tfDenomTipoP = new Ext.form.TextField({
            id: 'idtfDenomTipoP', fieldLabel: idioma.lbColDenominacion,
            tabIndex: 1, name: 'denominacion', allowBlank: false, anchor: '99%',
            prevTab: 'idbtnAceptarTipoP', nextTab: 'idcbDesglose',
            vtype: 'vtdenominaciones',
            regexText: idioma.lbDenomIncorr, //maskRe
            maxLength: 100,
            maxLengthText: idioma.lbMaxText_100,
            blankText: idioma.lbErrorCampoVacio
        });

        this.cbDesglose = new Ext.form.ComboBox({
            id: 'idcbDesglose',
            fieldLabel: idioma.lbcbDesglose,
            tabIndex: 2,
            valueField: 'sedesglosa',
            displayField: 'denominacion',
            hiddenName: 'sedesglosa',
            allowBlank: false, mode: 'local',
            store: modelo.storeDesglosa,
            emptyText: 'Seleccione...',
            blankText: idioma.lbErrorCampoVacio, readOnly: true,
            triggerAction: 'all', anchor: '99%'
        });

        this.cbPago = new Ext.form.ComboBox({
            id: 'idcbPago', fieldLabel: idioma.lbColcbPago,
            tabIndex: 3,
            valueField: 'modopago',
            displayField: 'denominacion',
            hiddenName: 'modopago',
            allowBlank: false, mode: 'local',
            store: modelo.storeFormaEfectuarPago,
            emptyText: 'Seleccione...',
            blankText: idioma.lbErrorCampoVacio, readOnly: true,
            triggerAction: 'all', anchor: '85%'
        });

        this.cbSeleccionPersonas = new Ext.form.ComboBox({
            id: 'idcbSeleccionPersonas',
            fieldLabel: idioma.lbColcbSeleccionPersonas,
            tabIndex: 4,
            valueField: 'modoseleccionpersonas',
            displayField: 'denominacion',
            hiddenName: 'modoseleccionpersonas',
            allowBlank: false, mode: 'local',
            store: modelo.storeModoSeleccionPersona,
            emptyText: 'Seleccione...',
            blankText: idioma.lbErrorCampoVacio,
            readOnly: true,
            triggerAction: 'all',
            anchor: '85%'
        });

        this.cbPagoxResultadosDestajo = new Ext.form.ComboBox({
            id: 'cbPagoxResultadosDestajo',
            fieldLabel: 'Resultado o destajo',
            tabIndex: 4,
            valueField: 'pagoxresultadosdestajo',
            displayField: 'denompagoxresultadosdestajo',
            hiddenName: 'pagoxresultadosdestajo',
            allowBlank: false, mode: 'local',
            store: modelo.storePagoxResultadosDestajo,
            emptyText: 'Seleccione...',
            blankText: idioma.lbErrorCampoVacio,
            readOnly: true,
            triggerAction: 'all',
            anchor: '99%'
        });

        this.cbTipoReporte = new Ext.form.ComboBox({
            id: 'idcbTipoReporte',
            fieldLabel: idioma.lbColcbTipoReporte,
            disabled: true,
            tabIndex: 3,
            valueField: 'idconfreportescertificaciones',
            displayField: 'reporte',
            name: 'idconfreportescertificaciones',
            hiddenName: 'idconfreportescertificaciones',
            allowBlank: false,
            mode: 'local',
            store: modelo.storeTipoReporte,
            emptyText: 'Seleccione...',
            blankText: idioma.lbErrorCampoVacio,
            readOnly: true,
            triggerAction: 'all',
            anchor: '85%'
        });

        this.nfOrdenTipoP = new Ext.form.NumberField({
            id: 'idnfOrdenTipoP',
            fieldLabel: 'Orden',
            tabIndex: 5,
            name: 'orden',
            allowBlank: false,
            anchor: '99%',
            blankText: idioma.lbErrorCampoVacio
        });

        this.dfFInicioTipoP = new Ext.form.DateField({
            id: 'iddfFInicioTipoP', fieldLabel: idioma.lbColDesde,
            tabIndex: 6, name: 'fechainicio', allowBlank: false,
            format: 'd/m/Y', editable: true, readOnly: false,
            value: new Date().format('d/m/Y'), maxText: idioma.lbFechaMaxima,
            minText: idioma.lbFechaMinima, blankText: idioma.lbErrorCampoVacio,
            invalidText: idioma.invalidTextFecha, vtype: 'daterange',
            anchor: '85%', endDateField: 'iddfFFinTipoP'
        });

        this.dfFFinTipoP = new Ext.form.DateField({
            id: 'iddfFFinTipoP', fieldLabel: idioma.lbColHasta,
            tabIndex: 7, name: 'fechafin', xtype: 'datefield', allowBlank: true,
            format: 'd/m/Y', editable: true, readOnly: false,
            maxText: idioma.lbFechaMaxima, minText: idioma.lbFechaMinima,
            blankText: idioma.lbErrorCampoVacio, invalidText: idioma.invalidTextFecha,
            vtype: 'daterange', anchor: '99%', startDateField: 'iddfFInicioTipoP'
        });

        this.cbConfigurable = new Ext.form.ComboBox({
            id: 'cbConfigurable',
            fieldLabel: 'Mismo mes',
            tabIndex: 2,
            valueField: 'configurable',
            displayField: 'denominacion',
            hiddenName: 'configurable',
            allowBlank: false, mode: 'local',
            store: modelo.storeConfig,
            emptyText: 'Seleccione...',
            blankText: idioma.lbErrorCampoVacio, readOnly: true,
            triggerAction: 'all', anchor: '99%'
        });

        this.tfDescripTipoP = new Ext.form.TextArea({
            id: 'idtfDescripTipoP',
            fieldLabel: idioma.lbColDescripcion, tabIndex: 8,
            name: 'descripcion', allowBlank: true,
            hiddenname: 'descripcion',
            maxLength: 255,
            maxLengthText: idioma.lbMaxText_255,
            anchor: '99%', prevTab: 'iddfFFinTipoP', nextTab: 'idbtnCancelarTipoP',
            blankText: idioma.lbErrorCampoVacio,
        });

        //Formulario de tipos de pago.
        this.formularioTipoP = new Ext.FormPanel({
            id: 'idformlarioTipoP',
            labelAlign: 'top',
            frame: true,
            width: 400,
            autoHeight: true,
            bodyStyle: {
                padding: '10px 10px 10px 10px'
            },
            items: [this.tfDenomTipoP,
                {
                    layout: 'column',
                    items: [
                        {columnWidth: .54, layout: 'form', items: [this.cbSeleccionPersonas]},
                        {columnWidth: .46, layout: 'form', items: [this.cbPagoxResultadosDestajo]}
                    ]
                }
                , {
                    layout: 'column',
                    items: [
                        {columnWidth: .54, layout: 'form', items: [this.cbTipoReporte]},
                        {columnWidth: .46, layout: 'form', items: [this.nfOrdenTipoP]}
                    ]
                }
                , {
                    layout: 'column',
                    items: [
                        {columnWidth: .54, layout: 'form', items: [this.dfFInicioTipoP]},
                        {columnWidth: .46, layout: 'form', items: [this.dfFFinTipoP]}
                    ]
                },{
                    layout: 'column',
                    items: [
                        {columnWidth: .54, layout: 'form', items: [this.cbConfigurable]}
                    ]
                },
                this.tfDescripTipoP
            ]
        });

        //Botones de la ventana de tipos de pago
        this.btnCancelarTipoP = new Ext.Button({
            id: 'idbtnCancelarTipoP',
            iconCls: 'cancelar',
            text: idioma.lbBtnCancelar,
            tooltip: idioma.textToolTipCancelar,
            prevTab: 'idtfDescripTipoP',
            nextTab: 'idbtnAplicarTipoP',
        });
        this.btnCancelarTipoPDependencia = new Ext.Button({
            id: 'idbtnCancelarTipoPDependencia',
            iconCls: 'cancelar',
            text: idioma.lbBtnCancelar,
            tooltip: idioma.textToolTipCancelar,
            prevTab: 'idtfDescripTipoP',
            nextTab: 'idbtnAplicarTipoP',
        });

        this.btnAplicarTipoP = new Ext.Button({
            id: 'idbtnAplicarTipoP',
            iconCls: 'aplicar',
            // icon:perfil.dirImg+'aplicar.png',
            text: idioma.lbBtnAplicar,
            tooltip: idioma.textToolTipAplicar,
            prevTab: 'idbtnCancelarTipoP',
            nextTab: 'idbtnAceptarTipoP',
        });

        this.btnAplicarTipoPDependencia = new Ext.Button({
            id: 'idbtnAplicarTipoPDependencia',
            iconCls: 'aplicar',
            text: idioma.lbBtnAplicar,
            tooltip: idioma.textToolTipAplicar,
            prevTab: 'idbtnCancelarTipoP',
            nextTab: 'idbtnAceptarTipoP',
        });

        this.btnAceptarTipoP = new Ext.Button({
            id: 'idbtnAceptarTipoP',
            iconCls: 'aceptar',
            // icon:perfil.dirImg+'aceptar.png',
            text: idioma.lbBtnAceptar,
            tooltip: idioma.textToolTipAceptar,
            prevTab: 'idbtnAplicarTipoP',
            nextTab: 'idtfDenomTipoP',
        });

        this.btnAceptarTipoPDependencia = new Ext.Button({
            id: 'idbtnAceptarTipoPDependencia',
            iconCls: 'aceptar',
            text: idioma.lbBtnAceptar,
            tooltip: idioma.textToolTipAceptar,
            prevTab: 'idbtnAplicarTipoP',
            nextTab: 'idtfDenomTipoP',
        });

        //Ventana de adicionar y modificar tipos de pago.
        this.ventanaTipoP = new Ext.Window({
            modal: true,
            closeAction: 'hide',
            autoHeight: true,
            closable: true,
            resizable: false,
            layout: 'fit',
            constrain: true,
            autoValidate: true,
            validateDefault: true,
            items: [this.formularioTipoP],
            buttons: [this.btnCancelarTipoP, this.btnAplicarTipoP, this.btnAceptarTipoP],
            keys: [
                {
                    key: Ext.EventObject.ENTER,
                    stopEvent: true,
                    fn: function () {
                        if (!self.btnAceptarTipoP.disabled) {
                            self.btnAceptarTipoP.handler();
                        }
                    }
                },
                {
                    key: 'x',
                    alt: true,
                    stopEvent: true,
                    fn: function () {
                        if (!self.btnCancelarTipoP.disabled) {
                            self.btnCancelarTipoP.handler();
                        }
                    }
                },
                {
                    key: 'p',
                    alt: true,
                    stopEvent: true,
                    fn: function () {
                        if (!self.btnAplicarTipoP.disabled) {
                            self.btnAplicarTipoP.handler();
                        }
                    }
                }
            ]
        });

        //Ventana de adicionar y modificar tipos de pago.
        this.ventanaTipoPDependencia = new Ext.Window({
            modal: true,
            closeAction: 'hide',
            width: 450,
            height: (screen.height / 2) + 50,
            closable: true,
            resizable: false,
            layout: 'fit',
            constrain: true,
            autoValidate: true,
            validateDefault: true,
            items: [this.gpTipoPagoDependenciaRestante],
            buttons: [this.btnCancelarTipoPDependencia, this.btnAplicarTipoPDependencia, this.btnAceptarTipoPDependencia],
            keys: [
                {
                    key: Ext.EventObject.ENTER,
                    stopEvent: true,
                    fn: function () {
                        if (!self.btnAceptarTipoPDependencia.disabled) {
                            self.btnAceptarTipoPDependencia.handler();
                        }
                    }
                },
                {
                    key: 'x',
                    alt: true,
                    stopEvent: true,
                    fn: function () {
                        if (!self.btnCancelarTipoPDependencia.disabled) {
                            self.btnCancelarTipoPDependencia.handler();
                        }
                    }
                },
                {
                    key: 'p',
                    alt: true,
                    stopEvent: true,
                    fn: function () {
                        if (!self.btnAplicarTipoPDependencia.disabled) {
                            self.btnAplicarTipoPDependencia.handler();
                        }
                    }
                }
            ]
        });
    }
};

//Controlador de la vista del Nomenclador de tipos de pago.
var Pvd_Nomina_Nomencladores_NomTipoPago_Controlador = function () {
    /**
     * Inicializar el controlador de la vista.
     *
     * @param idioma Objeto que contiene el idioma de los textos de la IU (Tipo: Object).
     * @param vista Vista del componente Nomenclador de tipos de pago (Tipo: Pvd_Nomina_Nomencladores_NomTipoPago_Vista)
     * @param modelo Modelo de la vista del componente Nomenclador de tipos de pago (Tipo: Pvd_Nomina_Nomencladores_NomTipoPago_Modelo)
     */
    this.init = function (idioma, vista, modelo) {
        var _vista = vista;
        /**
         *Variables generales.
         */
        var variablesTipoP = {
            accion: 'Add',
            cambio: 0,
            idtipopago: 0,
            iddependencia: -1
        };

        //Eventos del grid de tipos de pago.
        vista.gpTipoPago.on('rowdblclick', function (e) {
            mostrarVentanaModificarTipoP();
        });

        vista.gpTipoPago.on('destroy', function (e) {
            vista.ventanaTipoP.destroy();
        });

        //Eventos del store de tipos de pago.
        modelo.storeTipoPago.on('beforeload', function (store) {
            vista.btnModificarTipoP.disable();
            vista.btnEliminarTipoP.disable();
            store.removeAll();
        });

        //Eventos del store de tipos de pago.
        modelo.storeTipoPagoDependencia.on('beforeload', function (store) {
            vista.btnEliminarTipoPDependencia.disable();
            store.removeAll();
        });

        modelo.storeTipoPago.on('load', function (store, records, opt) {
            if (!records.length) {
                mostrarMensaje(1, idioma.lbMsgNoExistenDatos);
            }
        });

        modelo.storeTipoPagoDependencia.on('load', function (store, records, opt) {
            if (!records.length) {
                mostrarMensaje(1, idioma.lbMsgNoExistenDatos);
            }
        });
        modelo.storeTipoPagoDependenciaRestante.on('load', function (store, records, opt) {
            if (!records.length) {
                mostrarMensaje(1, idioma.lbMsgNoExistenDatos);
            }
        });

        //Eventos del seleccion model del grid de tipos de pago.
        vista.smTipoPago.on('rowselect', function () {
            vista.btnModificarTipoP.enable();
            vista.btnEliminarTipoP.enable();
            variablesTipoP.idtipopago = vista.smTipoPago.getSelected().get('idtipopago');
            modelo.storeTipoPagoDependencia.load({
                params: {
                    idtipopago: variablesTipoP.idtipopago
                }
            });

            //Habilitar el panel y boton de Adicionar dependencias
            vista.panelDerechoTipoPDependencia.enable();
            vista.btnAdicionarTipoPDependencia.enable();

        });
        vista.smTipoPagoDependencia.on('rowselect', function () {
            vista.btnEliminarTipoPDependencia.enable();
            variablesTipoP.iddependencia = vista.smTipoPagoDependencia.getSelected().get('iddependencia');


        });
        vista.smTipoPagoDependencia.on('rowdeselect', function () {
            var seleccion = vista.smTipoPagoDependencia.getSelections();
            if (seleccion.length == 0) {
                vista.btnEliminarTipoPDependencia.disable();
            }
        });

        //Eventos de campo de denominacion. 
        vista.tfDenomTipoP.on('change', function (tf, n, o) {
            variablesTipoP.cambio = 1;
        });

        //Eventos de campo de fecha inicio. 
        vista.dfFInicioTipoP.on('change', function (tf, n, o) {
            variablesTipoP.cambio = 1;
        });

        //Eventos de campo de fecha fin. 
        vista.dfFFinTipoP.on('change', function (tf, n, o) {
            variablesTipoP.cambio = 1;
        });

        //Eventos de campo de descripcion. 
        vista.tfDescripTipoP.on('change', function (tf, n, o) {
            variablesTipoP.cambio = 1;
        });

        //Eventos de campo de  si se desglosa.
        vista.cbDesglose.on('change', function (tf, n, o) {
            variablesTipoP.cambio = 1;
        });

        //Eventos de campo de  si es config.
        vista.cbConfigurable.on('change', function (tf, n, o) {
            variablesTipoP.cambio = 1;
        });

        //Eventos de campo de modo de pago.
        vista.cbPago.on('change', function (tf, n, o) {
            variablesTipoP.cambio = 1;
        });

        //Eventos de campo de seleccion de peronas.
        vista.cbSeleccionPersonas.on('change', function (tf, n, o) {
            variablesTipoP.cambio = 1;
        });

        //Eventos de campo de seleccion de peronas.
        vista.nfOrdenTipoP.on('change', function (tf, n, o) {
            variablesTipoP.cambio = 1;
        });

        vista.cbPagoxResultadosDestajo.on('change', function (tf, n, o) {
            variablesTipoP.cambio = 1;
        });

        vista.cbTipoReporte.on('change', function (tf, n, o) {
            variablesTipoP.cambio = 1;
        });

        vista.cbSeleccionPersonas.on('select', function (tf, n, o) {
            var seleccionpersona = vista.cbSeleccionPersonas.getValue();
            if (seleccionpersona == 3) {
                vista.cbTipoReporte.enable();
                modelo.storeTipoReporte.load();
            } else {
                vista.cbTipoReporte.disable();
                vista.cbTipoReporte.setValue('');

            }
        });

        //Eventos del botón adicionar tipos de pago.
        vista.btnAdicionarTipoP.setHandler(function () {
            mostrarVentanaAdicionarTipoP();
        });

        vista.btnAdicionarTipoPDependencia.setHandler(function () {
            mostrarVentanaAdicionarTipoPDependencia();
            modelo.storeTipoPagoDependenciaRestante.load({
                params: {
                    idtipopago: variablesTipoP.idtipopago
                }
            });
        });

        //Eventos del botón modificar tipos de pago.
        vista.btnModificarTipoP.setHandler(function () {
            mostrarVentanaModificarTipoP();
            var seleccionpersona = vista.cbSeleccionPersonas.getValue();
            if (seleccionpersona == 3) {
                vista.cbTipoReporte.enable();
                modelo.storeTipoReporte.load();
            } else {
                vista.cbTipoReporte.disable();
                vista.cbTipoReporte.setValue('');
            }
        });

        //Eventos del botón eliminar tipos de pago.
        vista.btnEliminarTipoP.setHandler(function () {
            eliminarTipoPago();
        });

        //Eventos del botón eliminar tipos de pago.
        vista.btnEliminarTipoPDependencia.setHandler(function () {
            eliminarTipoPagoDependencia();
        });

        //Exportar
        vista.btnExportarTipoP.on('click', function () {
            var winload = new Ext.PVD.comun.window.winLoad({
                title: 'Por favor espere...',
                mensaje: 'Generando reporte'
            });
            winload.showMask();
            var iframe = document.createElement("iframe");
            iframe.src = document.location.protocol + '//' + document.location.host +
                '/pvd/nomina/index.php/nomtipopago/exportarNomenclador';
            iframe.style.display = 'none';
            var that = this;
            iframe.onload = function () {
                winload.hideMask();
                //that.destroy();
            };
            document.body.appendChild(iframe);
        });

        //Eventos del botón cancelar tipos de pago.
        vista.btnCancelarTipoP.setHandler(function () {
            vista.ventanaTipoP.hide();
//            vista.formularioTipoP.purgeListeners();
        });


        //Eventos del botón cancelar tipos de pago.
        vista.btnCancelarTipoPDependencia.setHandler(function () {
            vista.ventanaTipoPDependencia.hide();
        });

        //Eventos del botón aplicar tipos de pago.
        vista.btnAplicarTipoP.setHandler(function () {
            salvarFormularioTipoP(true);
        });

        //Eventos del botón aplicar tipos de pago.
        vista.btnAplicarTipoPDependencia.setHandler(function () {
            salvarFormularioTipoPDependencia(true);
        });

        //Eventos del botón aceptar tipos de pago.
        vista.btnAceptarTipoP.setHandler(function () {
            salvarFormularioTipoP(false);
//            vista.formularioTipoP.purgeListeners();
        });

        //Eventos del botón aceptar tipos de pago.
        vista.btnAceptarTipoPDependencia.setHandler(function () {
            salvarFormularioTipoPDependencia(false);
        });

        //Evento de la ventana de adicionar/modificar tipos de pago.
        vista.ventanaTipoP.on('beforeshow', function (ventana) {
            vista.formularioTipoP.getForm().reset();
            vista.cbTipoReporte.disable();
            vista.tfDenomTipoP.focus(true, 500);
        });


        /*
         *Función de mostrar la ventana de adicionar tipos de pago.
         */
        function mostrarVentanaAdicionarTipoP() {
            Ext.Ajax.request({
                url: '/pvd/nomina/index.php/nomtipopago/obtenerOrdenDisponible',
                method: 'POST',
                callback: function (options, success, response) {
                    var responseData = Ext.decode(response.responseText);
                    vista.ventanaTipoP.setTitle(idioma.lbTitleVentAdicionarTipoP);
                    vista.btnAplicarTipoP.show();
                    vista.ventanaTipoP.show();
                    vista.btnCancelarTipoP.setNextElement('idbtnAplicarTipoP');
                    vista.btnAceptarTipoP.setPreviousElement('idbtnAplicarTipoP');
                    variablesTipoP.accion = 'Add';
                    vista.cbPagoxResultadosDestajo.setValue(1);
                    vista.nfOrdenTipoP.setValue(responseData.orden);
                }
            });

        }

        function mostrarVentanaAdicionarTipoPDependencia() {
            vista.ventanaTipoPDependencia.setTitle(idioma.lbTitleVentAdicionarTipoPDependencia);
            vista.btnAplicarTipoPDependencia.show();
            vista.ventanaTipoPDependencia.show();
            //Actualizar la tabulación deL formulario.
            vista.btnCancelarTipoPDependencia.setNextElement('idbtnAplicarTipoPDependencia');
            vista.btnAceptarTipoPDependencia.setPreviousElement('idbtnAplicarTipoPDependencia');
        }

        /*
         *Función de mostrar la ventana de modificar tipos de pago.
         */
        function mostrarVentanaModificarTipoP() {
            vista.ventanaTipoP.setTitle(idioma.lbTitleVentModificarTipoP);
            vista.btnAplicarTipoP.hide();
            vista.ventanaTipoP.show();
            //Actualizar la tabulación deL formulario.
            vista.btnCancelarTipoP.setNextElement('idbtnAceptarTipoP');
            vista.btnAceptarTipoP.setPreviousElement('idbtnCancelarTipoP');
            // Cargar el registro seleccionado en el formulario
            var rec = vista.smTipoPago.getSelected();
            vista.formularioTipoP.getForm().loadRecord(rec);
            // Asegurar que el combo 'Mismo mes' muestre el valor guardado (campo 'mismomes' del registro)
            try {
                if (rec && rec.get) {
                    vista.cbConfigurable.setValue(rec.get('mismomes'));
                }
            } catch (e) {
                // No interrumpir si por alguna razón no existe el combo o el campo
            }
            // Asegurar que el combo 'Tipo de reporte' muestre el id guardado (idconfreportescertificaciones)
            try {
                if (rec && rec.get) {
                    var reportVal = rec.get('idconfreportescertificaciones');
                    if (typeof reportVal !== 'undefined' && reportVal !== null && reportVal !== '') {
                        // Si el store ya tiene datos, asignar directamente
                        if (modelo.storeTipoReporte.getCount() > 0) {
                            vista.cbTipoReporte.setValue(reportVal);
                            vista.cbTipoReporte.enable();
                        } else {
                            // Esperar al primer load para asignar el valor (single)
                            modelo.storeTipoReporte.on('load', function () {
                                try {
                                    vista.cbTipoReporte.setValue(reportVal);
                                    vista.cbTipoReporte.enable();
                                } catch (e) {
                                }
                            }, this, {single: true});
                        }
                    }
                }
            } catch (e) {
                // No interrumpir si algo falla
            }
            // vista.formularioTipoP.addListener('clientvalidation', function (_form, _valid) {
            //     if (comparar(vista.formularioTipoP.getForm().getValues(), vista.smTipoPago.getSelected().data)) {
            //         vista.btnAceptarTipoP.setDisabled(true);
            //     } else {
            //         vista.btnAceptarTipoP.enable();
            //     }
            // });
            variablesTipoP.accion = 'Mod';

        }

        /*
         *Función para adicionar/modificar un tipo de pago.
         */
        function salvarFormularioTipoP(boton) {
            var urlAction = '/pvd/nomina/index.php/nomtipopago/adicionarTipoPago';
            var idtipopago = 0;
            var lbMsgEspera = idioma.lbMsgAdicionarTipoP;
            var lbMsgExito = idioma.lbMsgCorrectoAdicionadoTipoP;

            if (variablesTipoP.accion == 'Mod') {
                lbMsgEspera = idioma.lbMsgModificarTipoP;
                lbMsgExito = idioma.lbMsgCorrectoModificadoTipoP;
                urlAction = '/pvd/nomina/index.php/nomtipopago/modificarTipoPago';
                idtipopago = vista.smTipoPago.getSelected().get('idtipopago');
                idconfreportescertificaciones = vista.cbTipoReporte.getSelected().get('idconfreportescertificaciones');
            }
            if (variablesTipoP.cambio == 0) {
                if (variablesTipoP.accion == 'Mod') {
                    //Se oculta la ventana si no ha sido modificado ningún valor.
                    vista.ventanaTipoP.hide();
                } else {
                    //Se marcan como obligatorios en caso de presionar aceptar y se encuentren vacíos.
                    vista.tfDenomTipoP.markInvalid(idioma.lbErrorCampoVacio);
                    mostrarMensaje(3, idioma.lbErrorFormulario);
                }
            } else {
                //Se verifica si el formulario es válido y si el campo sueldo contiene un valor
                if (vista.formularioTipoP.getForm().isValid()) {

                    //Se muestra la máscara de espera.
                    PVD.mostrarMascara('idmaskaddmodtipopago', idioma.lbMsgEsperaEnviarDatos, lbMsgEspera);

                    //Enviando datos al servidor.
                    Ext.Ajax.request({
                        url: urlAction,
                        method: 'POST',
                        params: {
                            idtipopago: idtipopago,
                            denominacion: vista.tfDenomTipoP.getValue(),
                            sedesglosa: 0,//(vista.cbDesglose.getValue() == 1) ? 1 : 0,
                            modopago: 1,//vista.cbPago.getValue(),
                            modoseleccionPersonas: vista.cbSeleccionPersonas.getValue(),
                            pagoxresultadosdestajo: vista.cbPagoxResultadosDestajo.getValue(),
                            idconfreportecertificaciones: vista.cbTipoReporte.getValue(),
                            orden: vista.nfOrdenTipoP.getValue(),
                            fechainicio: vista.dfFInicioTipoP.getRawValue(),
                            fechafin: vista.dfFFinTipoP.getRawValue(),
                            mismomes: (vista.cbConfigurable.getValue() == 1) ? 1 : 0,
                            descripcion: vista.tfDescripTipoP.getValue()
                        },
                        callback: function (options, success, response) {
                            responseData = Ext.decode(response.responseText);

                            //Ocultando máscara de enviar datos.
                            PVD.ocultarMascara('idmaskaddmodtipopago');

                            if (responseData.codigo == 1) {
                                mostrarMensaje(1, lbMsgExito);
                                if (!boton) {
                                    vista.ventanaTipoP.hide();

                                } else {
                                    vista.tfDenomTipoP.focus(true, 500);
                                }
                                vista.formularioTipoP.getForm().reset();
                                modelo.storeTipoPago.removeAll();
                                modelo.storeTipoPago.load({params: {limit: 1000, start: 0}});
                                variablesTipoP.cambio = 0;

                                //Actualizando el orden
                                Ext.Ajax.request({
                                    url: '/pvd/nomina/index.php/nomtipopago/obtenerOrdenDisponible',
                                    method: 'POST',
                                    callback: function (options, success, response) {
                                        var responseData = Ext.decode(response.responseText);
                                        vista.nfOrdenTipoP.setValue(responseData.orden);
                                    }
                                });
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

        function dameSeleccion(datos) {

            var arraytipopago = new Array();
            for (var i = 0; i < datos.length; i++) {
                arraytipopago.push(datos[i].id);
            }
            return arraytipopago;
        }

        function salvarFormularioTipoPDependencia(boton) {
            var datos = vista.smTipoPagoDependenciaRestante.getSelections();
            var seleccionvacia = false;
            if (datos.length <= 0) {
                seleccionvacia = true;
            } else {
                var arraytipopago = dameSeleccion(datos);
            }


            var urlAction = '/pvd/nomina/index.php/nomtipopago/adicionarTipoPagoDependencia';
            var idtipopago = 0;
            var lbMsgEspera = idioma.lbMsgAdicionarTipoP;
            var lbMsgExito = idioma.lbMsgCorrectoAdicionadoTipoPDependencia;


            //Se verifica si el formulario es válido y si el campo sueldo contiene un valor
            if (!seleccionvacia) {

                //Se muestra la máscara de espera.
                PVD.mostrarMascara('idmaskaddmodtipopagoDependencia', idioma.lbMsgEsperaEnviarDatos, lbMsgEspera);

                //Enviando datos al servidor.
                Ext.Ajax.request({
                    url: urlAction,
                    method: 'POST',
                    params: {
                        idtipopago: variablesTipoP.idtipopago,
                        idtipospagodependencia: Ext.encode(arraytipopago)
                    },
                    callback: function (options, success, response) {
                        var responseData = Ext.decode(response.responseText);

                        //Ocultando máscara de enviar datos.
                        PVD.ocultarMascara('idmaskaddmodtipopagoDependencia');

                        if (responseData.codigo == 1) {
                            mostrarMensaje(1, lbMsgExito);
                            if (!boton) {
                                vista.ventanaTipoPDependencia.hide();

                            } else {
                                vista.tfDenomTipoP.focus(true, 500);
                            }
                            modelo.storeTipoPagoDependencia.removeAll();
                            modelo.storeTipoPagoDependenciaRestante.removeAll();
                            vista.smTipoPagoDependenciaRestante.clearSelections();
                            modelo.storeTipoPagoDependencia.load({params: {idtipopago: variablesTipoP.idtipopago}});
                            modelo.storeTipoPagoDependenciaRestante.load({params: {idtipopago: variablesTipoP.idtipopago}});
                            variablesTipoP.cambio = 0;


                        } else {
                            if (responseData.codigo)
                                mostrarMensaje(3, responseData.mensaje);
                        }
                    }
                });
            } else {
                mostrarMensaje(3, idioma.lbErrorSeleccionVacia);
            }

        }

        /*
         *Función para eliminar un tipo de pago.
         */
        function eliminarTipoPago() {
            //Mostrando el mensaje para aceptar el eliminar.
            mostrarMensaje(2, idioma.lbTitleEliminarTipoP, function (btn) {
                if (btn == "ok") {
                    //Se muestra la máscara de espera.
                    PVD.mostrarMascara('idmaskeleminartipopago', idioma.lbMsgEsperaEnviarDatos, idioma.lbMsgEliminarTipoP);
                    //Enviando los datos al servidor.
                    Ext.Ajax.request({
                        url: '/pvd/nomina/index.php/nomtipopago/eliminarTipoPago',
                        method: 'POST',
                        params: {idtipopago: vista.gpTipoPago.getSelectionModel().getSelected().get('idtipopago')},
                        callback: function (options, success, response) {
                            //Se oculta la máscara de espera.
                            PVD.ocultarMascara('idmaskeleminartipopago');
                            responseData = Ext.decode(response.responseText);
                            if (responseData.codigo == 1) {
                                //Mostrando el mensaje de que se ha el tipo de pago.
                                mostrarMensaje(1, idioma.lbMsgCorrectoEliminadoTipoP);
                                //Recargando el grid de tipos de pago.
                                modelo.storeTipoPago.load({params: {limit: 1000, start: 0}});

                            } else {
                                if (responseData.codigo)
                                    mostrarMensaje(responseData.codigo, idioma.lbMsgErrorTipoPagoUso);
                            }
                        }
                    });
                }
            });
        }

        function eliminarTipoPagoDependencia() {
            var datos = vista.smTipoPagoDependencia.getSelections();
            var arraytipopago = dameSeleccion(datos);
            //Mostrando el mensaje para aceptar el eliminar.
            mostrarMensaje(2, idioma.lbTitleEliminarTipoPDependencia, function (btn) {
                if (btn == "ok") {
                    //Se muestra la máscara de espera.
                    PVD.mostrarMascara('idmaskeleminartipopagoDependencia', idioma.lbMsgEsperaEnviarDatos, idioma.lbMsgEliminarTipoPDependencia);
                    //Enviando los datos al servidor.
                    Ext.Ajax.request({
                        url: '/pvd/nomina/index.php/nomtipopago/eliminarTipoPagoDependencia',
                        method: 'POST',
                        params: {
                            iddependencia: Ext.encode(arraytipopago) /*vista.smTipoPagoDependencia.getSelected().get('iddependencia')*/
                        },
                        callback: function (options, success, response) {
                            //Se oculta la máscara de espera.
                            PVD.ocultarMascara('idmaskeleminartipopagoDependencia');
                            responseData = Ext.decode(response.responseText);
                            if (responseData.codigo == 1) {
                                //Mostrando el mensaje de que se ha el tipo de pago.
                                mostrarMensaje(1, idioma.lbMsgCorrectoEliminadoTipoPDependencia);
                                //Recargando el grid de tipos de pago.
                                modelo.storeTipoPagoDependencia.load({params: {idtipopago: variablesTipoP.idtipopago}});

                            } else {
                                if (responseData.codigo)
                                    mostrarMensaje(responseData.codigo, idioma.lbMsgErrorTipoPagoUso);
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
                            if (!vista.btnAdicionarTipoP.disabled && !vista.ventanaTipoP.isVisible()) {
                                mostrarVentanaAdicionarTipoP();
                            }
                            break;
                        }
                        case 77: { //m para modificar .
                            if (!vista.btnModificarTipoP.disabled && !vista.ventanaTipoP.isVisible()) {
                                mostrarVentanaModificarTipoP();
                            }
                            break;
                        }
                        case 72: { //h para ayuda.
                            if (!vista.ventanaTipoP.isVisible()) {
                                vista.btnAyudaTipoP.focus();
                                vista.btnAyudaTipoP.fireEvent('click');
                            }
                            break;
                        }
                    }
                }
            },
            {
                key: 46,//del para eliminar.
                fn: function () {
                    if (!vista.btnEliminarTipoP.disabled && !vista.ventanaTipoP.isVisible()) {
                        eliminarTipoPago();
                    }
                },
            },
            {
                key: 13,//enter para aceptar.
                fn: function () {
                    if (vista.btnAceptarTipoP.isVisible()) {
                        vista.btnAceptarTipoP.focus();
                        vista.btnAceptarTipoP.fireEvent('click');
                    }
                },
            }
        ]);
    }
};

variablesGlobales.nomtipopago_js = 1;
