Ext.ns('Pvd.Nomina.Configuracion.MontosAreas');

Pvd.Nomina.Configuracion.MontosAreas.Panel = Ext.extend(Ext.Panel, {
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
        this.modelo = new Pvd_Nomina_Configuracion_MontosAreas_Modelo();
        this.modelo.init();

        //Inicializando la vista.
        this.vista = new Pvd_Nomina_Configuracion_MontosAreas_Vista();
        this.vista.init(this.perfil, this.idioma, this.modelo);

        //Inicializar controlador.
        this.controlador = new Pvd_Nomina_Configuracion_MontosAreas_Controlador();
        this.controlador.init(this.idioma, this.vista, this.modelo);

        this.items = [this.vista.panelConfigMontosAreas];

        //Teclas calientes de la interfaz
        this.keyMap = this.controlador.keyMap;

        Pvd.Nomina.Configuracion.MontosAreas.Panel.superclass.initComponent.call(this);
    },
    listeners: {
        afterlayout: function (x) {
            if (this.mostrar == 1) {
                this.mostrar = 2;
            }
        },
        destroy: function (x) {

        },
    },
});

var Pvd_Nomina_Configuracion_MontosAreas_Modelo = function () {
    this.init = function () {
        this.storeConfPagoResultados = new Ext.data.Store({
            url: '/pvd/nomina/index.php/confgeneral/obtenerConfigPagoResultado',
            reader: new Ext.data.JsonReader(
                {totalProperty: "cantidad", autoLoad: true, root: "datos", id: "idpagoporresultado"},
                [
                    {name: 'idpagoporresultado'},
                    {name: 'idtipopago'},
                    {name: 'denominacion'}
                ])
        });
        this.storeAgrupadores = new Ext.data.Store({
            url: '/pvd/nomina/index.php/confgeneral/obtenerListadoAgrupadoresAreas',
            reader: new Ext.data.JsonReader(
                {totalProperty: "cantidad", autoLoad: true, root: "datos", id: "idagrupador"},
                [
                    {name: 'idagrupador'},
                    {name: 'identidad'},
                    {name: 'idpagoporresultado'},
                    {name: 'denominacion'},
                    {name: 'idformula'},
                    {name: 'expformula'}
                ])
        });
        this.storeAreas = new Ext.data.Store({
            url: '/pvd/nomina/index.php/confgeneral/obtenerListadoAreas',
            reader: new Ext.data.JsonReader(
                {totalProperty: "cantidad", autoLoad: true, root: "datos", id: "idformulaareamonto"},
                [
                    {name: 'idformulaareamonto'},
                    {name: 'idagrupadorarea'},
                    {name: 'idarea'},
                    {name: 'denominacion'},
                    {name: 'idformula'},
                    {name: 'expformula'}
                ])
        });
        this.storeAreasEscoger = new Ext.data.Store({
            url: 'obtenerAreasCombo',
            autoload: false,
            reader: new Ext.data.JsonReader(
                {root: "datos", id: "idarea"},
                [{name: 'idarea'},
                    {name: 'area'}]
            )
        });
    }
};

var Pvd_Nomina_Configuracion_MontosAreas_Vista = function () {
    this.init = function (perfil, idioma, modelo) {
        var self = this;
        //Panel de estructura y composición que cargo hasta el nivel de entidades.
        this.pEstEntidades = new Ext.pvd.persona.buscarestructura.panelBuscarestructura({
            layout: 'border',
            nivel: 5
        });

        //Botón  para cargar las personas pertenecientes a la unidad selecionada.
        this.btnAceptarEntidades = new Ext.Button({
            id: 'btnAceptarEntidades',
            text: 'Aceptar',
            tooltip: 'Guardar datos y cerrar ventana (<b>ENTER</b>)',
            disabled: true,
            //icon: perfil.dirImg + 'aceptar.png',
            iconCls: 'aceptar'
        });

        //Vista para el componente Buscar estructura
        this.winEstEntidades = new Ext.Window({
            title: 'Entidades',
            modal: true,
            height: 350,
            width: '30%',
            constrain: true,
            closable: true,
            resizable: false,
            layout: 'fit',
            items: [this.pEstEntidades],
            buttons: [this.btnAceptarEntidades],
            keys: [
                {
                    key: Ext.EventObject.ENTER,
                    stopEvent: true,
                    fn: function () {
                        self.btnAceptarEntidades.handler();
                    }
                }
            ],
            /*listeners: {
                destroy: function (x) {
                    var tabPanel = Ext.getCmp('idtabpanel');
                    tabPanel.activeTab.id;
                    //console.info(tabPanel.remove);
                    //tabPanel.remove

                    var idtab = tabPanel.activeTab.id;
                    //self.panelConfigMontosAreas.hide();
                }
            }*/
        });

        //Botones
        this.btnAyudaMontosAreas = new Ext.Button({
            id: 'btnAyudaMontosAreas',
            text: idioma.lbBtnAyuda,
            tooltip: idioma.textToolTipAyuda,
            iconCls: 'ayuda',
            prevTab: 'btnElimConceptoRM',
            nextTab: 'btnAddConceptoRM',
        });
        this.btnDenominacionEntidad = new Ext.Button({
            id: 'btnDenominacionEntidad',
            text: 'Entidad: ',
            handleMouseEvents: false

        });
        this.btnAdicionarAgrupador = new Ext.Button({
            id: 'btnAdicionarAgrupador',
            text: idioma.lbBtnAdicionar,
            tooltip: idioma.textToolTipAddAgrupador,
            iconCls: 'adicionar',
            disabled: true
        });
        this.btnModificarAgrupador = new Ext.Button({
            id: 'btnModificarAgrupador',
            text: idioma.lbBtnModificar,
            tooltip: idioma.textToolTipModAgrupador,
            iconCls: 'modificar',
            disabled: true
        });
        this.btnEliminarAgrupador = new Ext.Button({
            id: 'btnEliminarAgrupador',
            text: idioma.lbBtnEliminar,
            tooltip: idioma.textToolTipElimAgrupador,
            iconCls: 'eliminar',
            disabled: true
        });
        this.btnReplicarAgrupador = new Ext.Button({
            id: 'btnReplicarAgrupador',
            text: idioma.lbBtnReplicar,
            tooltip: idioma.textToolTipReplAgrupador,
            iconCls: 'buscaryremplazar',
            disabled: true
        });
        this.btnAdicionarArea = new Ext.Button({
            id: 'btnAdicionarArea',
            text: idioma.lbBtnAdicionarArea,
            tooltip: idioma.textToolTipAddArea,
            iconCls: 'adicionar',
            disabled: true
        });
        this.btnEliminarArea = new Ext.Button({
            id: 'btnEliminarArea',
            text: idioma.lbBtnEliminar,
            tooltip: idioma.textToolTipElimArea,
            iconCls: 'eliminar',
            disabled: true
        });
        this.btnRecargar = new Ext.Button({
            id: 'btnRecargar',
            text: idioma.lbBtnRecargar,
            tooltip: idioma.textToolTipRecargar,
            iconCls: 'recargar',
        });

        //Ventanas----------------------------------------------------------------------
        //Botones formulario
        this.btnCancelarAgrupador = new Ext.Button({
            id: 'btnCancelarAgrupador',
            iconCls: 'cancelar',
            text: idioma.lbBtnCancelar,
            tooltip: idioma.textToolTipCancelar
        });
        this.btnAplicarAgrupador = new Ext.Button({
            id: 'btnAplicarAgrupador',
            iconCls: 'aplicar',
            text: idioma.lbBtnAplicar,
            tooltip: idioma.textToolTipAplicar,
            disabled: true
        });
        this.btnAceptarAgrupador = new Ext.Button({
            id: 'btnAceptarAgrupador',
            iconCls: 'aceptar',
            text: idioma.lbBtnAceptar,
            tooltip: idioma.textToolTipAceptar,
            disabled: true
        });
        this.btnCancelarArea = new Ext.Button({
            id: 'btnCancelarArea',
            iconCls: 'cancelar',
            text: idioma.lbBtnCancelar,
            tooltip: idioma.textToolTipCancelar
        });
        this.btnAplicarArea = new Ext.Button({
            id: 'btnAplicarArea',
            iconCls: 'aplicar',
            text: idioma.lbBtnAplicar,
            tooltip: idioma.textToolTipAplicar,
            disabled: true
        });
        this.btnAceptarArea = new Ext.Button({
            id: 'btnAceptarArea',
            iconCls: 'aceptar',
            text: idioma.lbBtnAceptar,
            tooltip: idioma.textToolTipAceptar,
            disabled: true
        });

        //Campos formulario
        this.tfDenominacionAgrupador = new Ext.form.TextField({
            id: 'tfDenominacionAgrupador',
            fieldLabel: idioma.lbColDenominacion,
            name: 'denominacion',
            allowBlank: false,
            anchor: '100%',
            blankText: idioma.lbErrorCampoVacio,
        });
        this.taFormulaAgrupador = new Ext.form.TextArea({
            id: 'taFormulaAgrupador',
            fieldLabel: idioma.lbColFormula,
            name: 'expformula',
            allowBlank: false,
            mode: 'local',
            emptyText: 'Seleccione...',
            anchor: '100%',
            height: 100
        });
        this.smAreasEscoger = new Ext.grid.CheckboxSelectionModel({
            singleSelect: false,
        });
        this.gpAreasRestantesEscoger = new Ext.grid.GridPanel({
            id: 'gpAreasRestantesEscoger',
            region: 'center',
            width: '100%',
            height: 300,
            columns: [
                this.smAreasEscoger,
                {header: 'idarea', hidden: true, hideable: false, dataIndex: 'idarea'},
                {header: '&Aacute;reas', width: 100, dataIndex: 'area'}
            ],
            stripeRows: true,
            autoScroll: true,
            border: false,
            viewConfig: {forceFit: true},
            store: modelo.storeAreasEscoger,
            sm: this.smAreasEscoger,
            loadMask: {msg: 'Cargando...'}
        });
        this.taFormulaArea = new Ext.form.TextArea({
            id: 'taFormulaArea',
            fieldLabel: idioma.lbColFormula,
            name: 'expformula',
            //allowBlank: false,
            mode: 'local',
            emptyText: 'Seleccione...',
            anchor: '100%',
            height: 300,
            disabled: true
        });

        //Formularios
        this.formularioAgrupador = new Ext.FormPanel({
            id: 'formularioAgrupador',
            labelAlign: 'top',
            region: 'center',
            frame: true,
            width: 400,
            autoHeight: true,
            bodyStyle: {
                padding: '2px 2px 2px 2px'
            },
            items: [
                {
                    layout: 'column',
                    items: [
                        {columnWidth: .99, layout: 'form', items: [this.tfDenominacionAgrupador]},
                        {columnWidth: .99, layout: 'form', items: [this.taFormulaAgrupador]}

                    ]
                }
            ]
        });

        //Ventanas
        this.ventanaAgrupador = new Ext.Window({
            title: idioma.lbTitleVentAdicionarAgrupadores,
            modal: true,
            closeAction: 'hide',
            closable: true,
            constrain: true,
            autoValidate: true,
            validateDefault: true,
            resizable: false,
            width: 400,
            autoHeight: true,
            layout: 'fit',
            items: [this.formularioAgrupador],
            buttons: [this.btnCancelarAgrupador, this.btnAplicarAgrupador, this.btnAceptarAgrupador]
        });
        this.ventanaArea = new Ext.Window({
            title: idioma.lbTitleVentAdicionarArea,
            modal: true,
            closeAction: 'hide',
            closable: true,
            constrain: true,
            autoValidate: true,
            validateDefault: true,
            resizable: false,
            width: 400,
            autoHeight: true,
            layout: 'fit',
            items: [this.gpAreasRestantesEscoger],
            buttons: [this.btnCancelarArea, this.btnAplicarArea, this.btnAceptarArea]
        });

        //Selections Models
        this.smConfPagoResultados = new Ext.grid.CheckboxSelectionModel({
            singleSelect: true,
        });
        this.smAgrupadores = new Ext.grid.CheckboxSelectionModel({
            singleSelect: false,
        });
        this.smAreas = new Ext.grid.CheckboxSelectionModel({
            singleSelect: false,
        });

        //Grids
        this.gpConfPagoResultados = new Ext.grid.GridPanel({
            id: 'gpConfPagoResultados',
            region: 'center',
            columns: [
                this.smAgrupadores,
                {header: 'idpagoporresultado', hidden: true, hideable: false, dataIndex: 'idpagoporresultado'},
                {header: 'idtipopago', hidden: true, hideable: false, dataIndex: 'idtipopago'},
                {
                    header: idioma.lbColDenominacion,
                    width: '100%',
                    sortable: true,
                    dataIndex: 'denominacion',
                    renderer: function (val) {
                        return '<p style="color:#006600">' + val + '</p>';
                    }
                },
            ],
            stripeRows: true,
            autoScroll: true,
            border: false,
            width: '100%',
            height: '100%',
            viewConfig: {forceFit: true},
            store: modelo.storeConfPagoResultados,
            sm: this.smConfPagoResultados,
            loadMask: {msg: 'Cargando...'},
            keys: [
                {
                    key: 'r',
                    alt: true,
                    stopEvent: true,
                    fn: function () {
                        if (!self.btnRecargar.disabled) {
                            self.btnRecargar.handler();
                        }
                    }
                }
            ]
        });
        this.gpAgrupadores = new Ext.grid.GridPanel({
            id: 'gpAgrupadores',
            region: 'center',
            columns: [
                this.smAgrupadores,
                {header: 'idagrupador', hidden: true, hideable: false, dataIndex: 'idagrupador'},
                {header: 'identidad', hidden: true, hideable: false, dataIndex: 'identidad'},
                {header: 'idpagoporresultado', hideable: false, hidden: true, dataIndex: 'idpagoporresultado'},
                {header: 'idformula', hidden: true, hideable: false, dataIndex: 'idformula'},
                {header: idioma.lbColDenominacion, width: '30%', sortable: true, dataIndex: 'denominacion'},
                {
                    header: '<center>' + idioma.lbColFormula + '</center>',
                    width: '60%',
                    sortable: true,
                    dataIndex: 'expformula',
                    //renderer: centrarFormulas
                }
            ],
            stripeRows: true,
            autoScroll: true,
            border: false,
            width: '100%',
            height: '100%',
            viewConfig: {forceFit: true},
            store: modelo.storeAgrupadores,
            sm: this.smAgrupadores,
            loadMask: {msg: 'Cargando...'},
            bbar: new Ext.PagingToolbar({
                pageSize: 20,
                store: modelo.storeAgrupadores,
                displayInfo: false,
                displayMsg: 'Mostrando  {0} - {1} de {2}',
                emptyMsg: "0 Resultado a mostrar"
            }),
            keys: [
                {
                    key: Ext.EventObject.DELETE,
                    stopEvent: true,
                    fn: function () {
                        if (!self.btnEliminarAgrupador.disabled) {
                            self.btnEliminarAgrupador.handler();
                        }
                    }
                },{
                    key: 'i',
                    alt: true,
                    stopEvent: true,
                    fn: function () {
                        if (!self.btnAdicionarAgrupador.disabled) {
                            self.btnAdicionarAgrupador.handler();
                        }
                    }
                },{
                    key: 'm',
                    alt: true,
                    stopEvent: true,
                    fn: function () {
                        if (!self.btnModificarAgrupador.disabled) {
                            self.btnModificarAgrupador.handler();
                        }
                    }
                }
            ]
        });
        this.gpAreas = new Ext.grid.GridPanel({
            id: 'gpAreas',
            region: 'center',
            width: '99%',
            height: 200,
            layout: 'fit',
            border: true,
            columns: [
                this.smAreas,
                {header: 'idformulaareamonto', hidden: true, hideable: false, dataIndex: 'idformulaareamonto'},
                {header: 'idagrupadorarea', hidden: true, hideable: false, dataIndex: 'idagrupadorarea'},
                {header: 'idarea', hidden: true, hideable: false, dataIndex: 'idarea'},
                {header: 'idformula', hidden: true, hideable: false, dataIndex: 'idformula'},
                {header: idioma.lbColDenominacion, width: '30%', sortable: true, dataIndex: 'denominacion'},
                {
                    header: '<center>' + idioma.lbColFormula + '</center>',
                    width: '60%',
                    sortable: true,
                    dataIndex: 'expformula',
                    //renderer: centrarFormulas
                }
            ],
            stripeRows: true,
            autoScroll: true,
            viewConfig: {forceFit: true},
            store: modelo.storeAreas,
            sm: this.smAreas,
            loadMask: {msg: 'Cargando...'},
            bbar: new Ext.PagingToolbar({
                pageSize: 20,
                store: modelo.storeAreas,
                displayInfo: false,
                displayMsg: 'Mostrando  {0} - {1} de {2}',
                emptyMsg: "0 Resultado a mostrar"
            }),
            keys: [
                {
                    key: Ext.EventObject.DELETE,
                    stopEvent: true,
                    fn: function () {
                        if (!self.btnEliminarArea.disabled) {
                            self.btnEliminarArea.handler();
                        }
                    }
                },{
                    key: 'a',
                    alt: true,
                    stopEvent: true,
                    fn: function () {
                        if (!self.btnAdicionarArea.disabled) {
                            self.btnAdicionarArea.handler();
                        }
                    }
                }
            ]
        });

        this.formFormulaArea = new Ext.FormPanel({
            title: 'F&oacute;rmulas',
            id: 'formFormulaArea',
            region: 'south',
            width: '95%',
            height: 300,
            labelAlign: 'top',
            layout: 'fit',
            border: true,
            items: [{
                layout: 'column',
                bodyStyle: {
                    padding: '0px 0px 0px 0px'
                },
                items: [
                    {columnWidth: .99, layout: 'form', items: [this.taFormulaArea]}
                ]
            }],

        });

        //Paneles
        this.panelConfigPagoResultados = new Ext.Panel({
            id: 'idpanelConfigPagoResultados',
            title: idioma.lbTitleConfigPagoResultados,
            region: 'west',
            width: '20%',
            heigth: '100%',
            border: true,
            layout: 'fit',
            split: true,
            tbar: [this.btnRecargar],
            items: [this.gpConfPagoResultados]
        });
        this.panelAgrupadoresAreas = new Ext.Panel({
            id: 'idpanelAgrupadoresAreas',
            title: idioma.lbTitleAgrupadores,
            region: 'center',
            width: '40%',
            heigth: '100%',
            border: true,
            layout: 'fit',
            split: true,
            tbar: [this.btnAdicionarAgrupador, this.btnModificarAgrupador, this.btnEliminarAgrupador, '->'/*, this.btnReplicarAgrupador*/],
            items: [this.gpAgrupadores]
        });
        this.panelAreas = new Ext.Panel({
            id: 'idpanelAreas',
            title: idioma.lbTitleAreas,
            region: 'east',
            width: '40%',
            heigth: '100%',
            border: true,
            layout: 'border',
            split: true,
            tbar: [this.btnAdicionarArea, this.btnEliminarArea],
            bodyStyle: {
                padding: '0px 0px 0px 0px'
            },
            items: [this.gpAreas, this.formFormulaArea]
        });
        this.panelConfigMontosAreas = new Ext.Panel({
            id: 'idpanelConfigMontosAreas',
            region: 'center',
            width: '100%',
            heigth: '100%',
            border: true,
            modal: true,
            layout: 'border',
            split: true,
            tbar: [this.btnDenominacionEntidad, '->', this.btnAyudaMontosAreas],
            items: [this.panelConfigPagoResultados, this.panelAgrupadoresAreas, this.panelAreas]
        });
    }
};

var Pvd_Nomina_Configuracion_MontosAreas_Controlador = function () {
    this.init = function (idioma, vista, modelo) {
        var variables = {
            identidad: -1,
            accion: 'Add',
            cambio: 0,
            idpagoporresultado: -1,
            arrayindicadoresagrupador: new Array(),
            arrayindicadoresareas: new Array(),
            idformulaagrupador: -1,
            idformulaarea: -1
        };

        //Mostrar interfaz para selecionar entidad.
        vista.winEstEntidades.show();

        //Eventos del objeto del ábol de entidades.
        vista.pEstEntidades.on('estructuraselecionada', function (o, nodo) {
            if (nodo.attributes.tipoestructura == 3) {
                variables.identidad = nodo.id;
                vista.btnAceptarEntidades.enable();

                //Pintando el nombre de la entidad en el tbar del panel general
                var r = (nodo.text).split("-");
                var entidad = (r.length == 2) ? r[1] : nodo.text;
                vista.btnDenominacionEntidad.setText('Entidad: <b style="color: #006600;">' + entidad + '</b>');
            } else {
                variables.identidad = null;
                vista.btnAceptarEntidades.disable();
            }
        });

        vista.btnAceptarEntidades.setHandler(function () {
            vista.panelConfigMontosAreas.show();
            vista.winEstEntidades.hide();
            //Cargando los pagos por resultados
            modelo.storeConfPagoResultados.load({params: {identidad: variables.identidad}});
        });

        //Selections models
        vista.smConfPagoResultados.on('rowselect', function (sm, index, rec) {
            var idpagoporresultado = sm.getSelected().get('idpagoporresultado');
            variables.idpagoporresultado = idpagoporresultado;
            modelo.storeAgrupadores.load({
                params: {
                    identidad: variables.identidad,
                    idpagoporresultado: idpagoporresultado
                }
            });

            vista.btnAdicionarAgrupador.enable();
            vista.btnModificarAgrupador.disable();
            vista.btnEliminarAgrupador.disable();
        });
        vista.smConfPagoResultados.on('rowdeselect', function (sm, index, rec) {
            modelo.storeAgrupadores.removeAll();
            vista.btnAdicionarAgrupador.disable();
            vista.btnModificarAgrupador.disable();
            vista.btnEliminarAgrupador.disable();

            modelo.storeAreas.removeAll();
            vista.btnAdicionarArea.disable();
            vista.btnEliminarArea.disable();
        });
        vista.smAgrupadores.on('rowselect', function (sm) {
            //Store de Agrupadores
            var cantseleccionados = sm.getSelections().length;
            (cantseleccionados == 1) ? vista.btnModificarAgrupador.enable() : vista.btnModificarAgrupador.disable();
            (cantseleccionados > 0) ? vista.btnEliminarAgrupador.enable() : vista.btnEliminarAgrupador.disable();

            //Store de Areas
            vista.btnEliminarArea.disable();
            vista.taFormulaArea.disable();
            vista.taFormulaArea.setValue('');
            if (cantseleccionados == 1) {
                modelo.storeAreas.load({
                    params: {
                        identidad: variables.identidad,
                        idagrupador: sm.getSelected().get('idagrupador')
                    }
                });
                vista.btnAdicionarArea.enable();
            } else {
                vista.btnAdicionarArea.disable();
                modelo.storeAreas.removeAll();
            }
        });
        vista.smAgrupadores.on('rowdeselect', function (sm) {
            //Store de Agrupadores
            var cantseleccionados = sm.getSelections().length;
            (cantseleccionados == 1) ? vista.btnModificarAgrupador.enable() : vista.btnModificarAgrupador.disable();
            (cantseleccionados > 0) ? vista.btnEliminarAgrupador.enable() : vista.btnEliminarAgrupador.disable();
            modelo.storeAreas.removeAll();

            //Store de Areas
            vista.btnEliminarArea.disable();
            vista.taFormulaArea.disable();
            vista.taFormulaArea.setValue('');
            if (cantseleccionados == 1) {
                modelo.storeAreas.load({
                    params: {
                        identidad: variables.identidad,
                        idagrupador: sm.getSelected().get('idagrupador')
                    }
                });
                vista.btnAdicionarArea.enable();
            } else {
                vista.btnAdicionarArea.disable();
                modelo.storeAreas.removeAll();
            }
        });
        vista.smAreas.on('rowselect', function (sm) {
            var cantseleccionados = sm.getSelections().length;
            (cantseleccionados > 0) ? vista.btnEliminarArea.enable() : vista.btnEliminarArea.disable();
            (cantseleccionados > 0) ? vista.taFormulaArea.enable() : vista.taFormulaArea.disable();
            (cantseleccionados == 1)
                ? vista.taFormulaArea.setValue(sm.getSelected().get('expformula'))
                : vista.taFormulaArea.setValue('');
        });
        vista.smAreas.on('rowdeselect', function (sm) {
            var cantseleccionados = sm.getSelections().length;
            (cantseleccionados > 0) ? vista.btnEliminarArea.enable() : vista.btnEliminarArea.disable();
            (cantseleccionados > 0) ? vista.taFormulaArea.enable() : vista.taFormulaArea.disable();
            (cantseleccionados == 1)
                ? vista.taFormulaArea.setValue(sm.getSelected().get('expformula'))
                : vista.taFormulaArea.setValue('');
        });
        vista.smAreasEscoger.on('rowselect', function (sm) {
            var cantseleccionados = sm.getSelections().length;
            (cantseleccionados > 0) ? vista.btnAceptarArea.enable() : vista.btnAceptarArea.disable();
            (cantseleccionados > 0) ? vista.btnAplicarArea.enable() : vista.btnAplicarArea.disable();
        });
        vista.smAreasEscoger.on('rowdeselect', function (sm) {
            var cantseleccionados = sm.getSelections().length;
            (cantseleccionados > 0) ? vista.btnAceptarArea.enable() : vista.btnAceptarArea.disable();
            (cantseleccionados > 0) ? vista.btnAplicarArea.enable() : vista.btnAplicarArea.disable();
        });

        modelo.storeConfPagoResultados.on('load', function (store, records, opt) {
            if (!records.length)
                mostrarMensaje(1, 'No existen datos que mostrar.');
        });
        modelo.storeAgrupadores.on('load', function (store, records, opt) {
            if (!records.length)
                mostrarMensaje(1, 'No existen datos que mostrar.');
        });
        modelo.storeAreas.on('load', function (store, records, opt) {
            if (!records.length)
                mostrarMensaje(1, 'No existen datos que mostrar.');
        });
        modelo.storeAreasEscoger.on('load', function (store, records, opt) {
            if (!records.length)
                mostrarMensaje(1, 'No existen datos que mostrar.');
        });

        //Botones
       /* vista.btnRecargar.on('click', function () {
            modelo.storeConfPagoResultados.load({params: {identidad: variables.identidad}});
            modelo.storeAreas.load();
        });*/

        vista.btnRecargar.setHandler(function () {
            modelo.storeConfPagoResultados.load({params: {identidad: variables.identidad}});
            vista.formularioAgrupador.getForm().reset();
            modelo.storeAgrupadores.load({
                params: {
                    identidad: variables.identidad,
                    idpagoporresultado: variables.idpagoporresultado
                }
            });
            modelo.storeAreas.removeAll();
        });

       /* vista.btnAdicionarAgrupador.on('click', function () {
            vista.formularioAgrupador.getForm().reset();
            vista.ventanaAgrupador.show();
            variables.accion = 'Add';
        });*/

        vista.btnAdicionarAgrupador.setHandler(function () {
            vista.ventanaAgrupador.setTitle(idioma.lbTitleVentAdicionarAgrupadores);
            vista.formularioAgrupador.getForm().reset();
            vista.ventanaAgrupador.show();
            variables.accion = 'Add';
        });

        /*vista.btnModificarAgrupador.on('click', function () {
            vista.btnAplicarAgrupador.hide();
            vista.ventanaAgrupador.setTitle(idioma.lbTitleVentModificarAgrupadores);
            var arrdatos = vista.smAgrupadores.getSelected().data;
            vista.tfDenominacionAgrupador.setValue(arrdatos['denominacion']);
            vista.taFormulaAgrupador.setValue(arrdatos['expformula']);
            vista.ventanaAgrupador.show();
            variables.accion = 'Mod';
        });*/

        vista.btnModificarAgrupador.setHandler(function () {
            vista.ventanaAgrupador.setTitle(idioma.lbTitleVentModificarAgrupadores);
            vista.btnAplicarAgrupador.hide();
            var arrdatos = vista.smAgrupadores.getSelected().data;
            vista.tfDenominacionAgrupador.setValue(arrdatos['denominacion']);
            vista.taFormulaAgrupador.setValue(arrdatos['expformula']);
            vista.ventanaAgrupador.show();
            variables.accion = 'Mod';
        });

        /*vista.btnEliminarAgrupador.on('click', function () {
            eliminarAgrupador();
        });*/

        vista.btnEliminarAgrupador.setHandler(function () {
            eliminarAgrupador();
        });


        /*vista.btnAdicionarArea.on('click', function () {
            vista.ventanaArea.show();
            modelo.storeAreasEscoger.load({
                params: {
                    identidad: variables.identidad,
                    idpagoporresultado: variables.idpagoporresultado
                }
            });
        });*/

        vista.btnAdicionarArea.setHandler(function () {
            vista.ventanaArea.show();
            modelo.storeAreasEscoger.load({
                params: {
                    identidad: variables.identidad,
                    idpagoporresultado: variables.idpagoporresultado
                }
            });
        });

        /*vista.btnEliminarArea.on('click', function () {
            eliminarArea();
        });*/

        vista.btnEliminarArea.setHandler(function () {
            eliminarArea();
        });

        //TextAreas de las formulas
        vista.taFormulaAgrupador.on('focus', function () {
            var idformula = (variables.accion == "Mod") ? vista.gpAgrupadores.getSelectionModel().getSelected().data.idformula : -1;
            //Cargando los indicadores
            var idagrupador = (variables.accion == "Mod") ? vista.gpAgrupadores.getSelectionModel().getSelected().get('idagrupador') : -1;
            Ext.Ajax.request({
                url: 'obtenerIndFormulaAgrupadores',
                method: 'POST',
                params: {
                    idpagoporresultado: variables.idpagoporresultado,
                    identidad: variables.identidad,
                    idagrupador: idagrupador
                },
                callback: function (options, success, response) {
                    var responseData = Ext.decode(response.responseText);
                    mostrarComponenteFormulaAgrupador(idformula, responseData.indicadores);
                }.createDelegate()
            });
        });
        vista.taFormulaArea.on('focus', function () {
            var idformula = vista.gpAreas.getSelectionModel().getSelected().get('idformula');
            mostrarComponenteFormulaArea(idformula);
        });

        //Botones formulario
        vista.btnCancelarAgrupador.on('click', function () {
            vista.ventanaAgrupador.hide();
        });
        vista.btnAplicarAgrupador.on('click', function () {
            salvarFormularioAgrupador();
        });
        vista.btnAceptarAgrupador.on('click', function () {
            salvarFormularioAgrupador();
            vista.ventanaAgrupador.hide();
        });
        vista.btnCancelarArea.on('click', function () {
            vista.ventanaArea.hide();
        });
        vista.btnAplicarArea.on('click', function () {
            salvarFormularioArea();
        });
        vista.btnAceptarArea.on('click', function () {
            salvarFormularioArea();
            vista.ventanaArea.hide();
        });

        /**Funciones*/
        function salvarFormularioAgrupador() {
            var urlAction = '/pvd/nomina/index.php/confgeneral/';
            urlAction += (variables.accion == 'Add') ? 'adicionarAgrupadorAreas' : 'modificarAgrupadorAreas';
            var idagrupador = (variables.accion == 'Add') ? -1 : vista.gpAgrupadores.getSelectionModel().getSelected().get('idagrupador');

            //Se verifica si el formulario es válido
            if (vista.formularioAgrupador.getForm().isValid()) {
                PVD.mostrarMascara('idmaskaddmodagrupador', 'Espere por favor', 'Enviando datos...');
                Ext.Ajax.request({
                    url: urlAction,
                    method: 'POST',
                    params: {
                        idagrupador: idagrupador,
                        identidad: variables.identidad,
                        idpagoporresultado: variables.idpagoporresultado,
                        denominacion: vista.tfDenominacionAgrupador.getValue(),
                        idformula: variables.idformulaagrupador
                    },
                    callback: function (options, success, response) {
                        responseData = Ext.decode(response.responseText);
                        //Ocultando máscara de enviar datos.
                        PVD.ocultarMascara('idmaskaddmodagrupador');

                        if (responseData == 'ok') {
                            mostrarMensaje(1, "El agrupador se ha guardado satisfactoriamente.");
                            vista.formularioAgrupador.getForm().reset();
                            modelo.storeAgrupadores.load({
                                params: {
                                    identidad: variables.identidad,
                                    idpagoporresultado: variables.idpagoporresultado
                                }
                            });
                            variables.cambio = 0;
                            modelo.storeAreas.removeAll();
                        } else if (responseData == 'existe') {
                            mostrarMensaje(3, "El agrupador que desea adicionar, para el pago por resultado seleccionado, ya existe.");
                        } else {
                            mostrarMensaje(3, "No se pudo adicionar el agrupador.");
                        }
                    }
                });
            } else {
                mostrarMensaje(3, 'El formulario contiene campos inv&aacute;lidos.');
            }

        }

        function salvarFormularioArea() {
            var urlAction = '/pvd/nomina/index.php/confgeneral/adicionarAreas';
            //urlAction += (variables.accion == 'Add') ? 'adicionarAreas' : 'modificarAreas';
            var idagrupador = vista.gpAgrupadores.getSelectionModel().getSelected().get('idagrupador');
            var idsareasseleccionadas = vista.smAreasEscoger.getSelections();
            var arridareas = new Array();
            Ext.each(idsareasseleccionadas, function (area) {
                arridareas.push(area.data.idarea);
            });

            if (vista.smAreasEscoger.getSelections().length > 0) {
                PVD.mostrarMascara('idmaskaddarea', 'Espere por favor', 'Enviando datos...');
                Ext.Ajax.request({
                    url: urlAction,
                    method: 'POST',
                    params: {
                        idagrupador: idagrupador,
                        arridareas: Ext.encode(arridareas)
                    },
                    callback: function (options, success, response) {
                        responseData = Ext.decode(response.responseText);
                        //Ocultando máscara de enviar datos.
                        PVD.ocultarMascara('idmaskaddarea');
                        var msgok = (idsareasseleccionadas.length > 1) ? 'Las &aacute;reas se han' : 'El &aacute;rea se ha';
                        var msgerror = (idsareasseleccionadas.length > 1) ? 'Las &aacute;reas no se pudieron' : 'El &aacute;rea no se pudo';
                        if (responseData == 'ok') {
                            mostrarMensaje(1, msgok + " adicionado satisfactoriamente.");
                            modelo.storeAreas.load({
                                params: {
                                    identidad: variables.identidad,
                                    idagrupador: idagrupador
                                }
                            });
                            modelo.storeAreasEscoger.removeAll();
                        } else {
                            mostrarMensaje(3, msgerror + " eliminar.");
                        }
                    }
                });
            }
        }

        function salvarFormulasAreas() {
            var urlAction = '/pvd/nomina/index.php/confgeneral/modificarFormulasAreas';
            var idagrupador = vista.gpAgrupadores.getSelectionModel().getSelected().get('idagrupador');
            var idsareasseleccionadas = vista.smAreas.getSelections();
            var arridformulaareamonto = new Array();
            Ext.each(idsareasseleccionadas, function (area) {
                arridformulaareamonto.push(area.data.idformulaareamonto);
            });
            if (vista.smAreas.getSelections().length > 0) {
                PVD.mostrarMascara('idmaskaddformulaarea', 'Espere por favor', 'Enviando datos...');
                Ext.Ajax.request({
                    url: urlAction,
                    method: 'POST',
                    params: {
                        arridformulaareamonto: Ext.encode(arridformulaareamonto),
                        idformula: variables.idformulaarea
                    },
                    callback: function (options, success, response) {
                        responseData = Ext.decode(response.responseText);
                        //Ocultando máscara de enviar datos.
                        PVD.ocultarMascara('idmaskaddformulaarea');
                        var msgok = (idsareasseleccionadas.length > 1) ? 'Las f&oacute;rmulas se han' : 'La f&oacute;rmula se ha';
                        var msgerror = (idsareasseleccionadas.length > 1) ? 'Las f&oacute;rmulas no se pudieron' : 'La f&oacute;rmula no se pudo';
                        if (responseData == 'ok') {
                            mostrarMensaje(1, msgok + " guardado satisfactoriamente.");
                            modelo.storeAreas.load({
                                params: {
                                    identidad: variables.identidad,
                                    idagrupador: idagrupador
                                }
                            });
                            modelo.storeAreasEscoger.removeAll();
                        } else {
                            mostrarMensaje(3, msgerror + " guardar.");
                        }
                    }
                });
            }
        }

        function mostrarComponenteFormulaAgrupador(idformula, arragrupadores) {
            var ind = new Array();
            //Arreglo del campo monto.
            var a = new Array();
            a[0] = 'FSD_0';//idindicador
            a[1] = 'Fondo Salario Distribuido';//indicador
            a[2] = 'Indicadores';//tipo
            ind.push(a);
            a = new Array();
            a[0] = 'TP_1';//idindicador
            a[1] = 'Total personas';//indicador
            a[2] = 'Indicadores';//tipo
            ind.push(a);
            a = new Array();
            a[0] = 'TPA_2';//idindicador
            a[1] = 'Total personas agrupador';//indicador
            a[2] = 'Indicadores';//tipo
            ind.push(a);

            Ext.each(arragrupadores, function (arrindicador) {
                a = new Array();
                a[0] = arrindicador.idindicador;//idindicador
                a[1] = arrindicador.indicador;//indicador
                a[2] = arrindicador.tipo;//tipo
                ind.push(a);
            });

            this.objExpMat = new Ext.pvd.persona.formula.winEditorExpresiones({
                title: 'Editor de expresiones matem&aacute;ticas',
                idexpresionmatematica: (idformula != null) ? idformula : -1,
                indicadores: ind,
                agrupado: 1,
                campoagrupar: 'Tipo',
                mostrarFunciones: 2,
                mostrarCondicionales: true,
                mostrarDenominacion: false
            });

            this.objExpMat.on('expresionsalvada', function (arr) {
                if (arr) {
                    variables.idformulaagrupador = arr['idexpresionmatematica'];
                    this.objExpMat.close();
                    vista.taFormulaAgrupador.setValue(arr['elementosMostrar']);
                    mostrarMensaje(1, 'La expresi&oacute;n matem&aacute;tica se adicion&oacute; satisfactoriamente');
                } else {
                    mostrarMensaje(3, 'La expresi&oacute;n matem&aacute;tica no se pudo adicionar');
                }
            }.createDelegate(this));

            this.objExpMat.show();
        }

        function mostrarComponenteFormulaArea(idformula) {
            var ind = new Array();
            //Arreglo del campo monto.
            var a = new Array();
            a[0] = 'SM_3';//idindicador
            a[1] = 'Salario Medio';//indicador
            a[2] = 'Indicadores';//tipo
            ind.push(a);
            a = new Array();
            a[0] = 'TPArea_4';//idindicador
            a[1] = 'Total personas &aacute;rea';//indicador
            a[2] = 'Indicadores';//tipo
            ind.push(a);

            this.objExpMat = new Ext.pvd.persona.formula.winEditorExpresiones({
                title: 'Editor de expresiones matem&aacute;ticas',
                idexpresionmatematica: (idformula != null) ? idformula : -1,
                indicadores: ind,
                agrupado: 1,
                campoagrupar: 'Tipo',
                mostrarFunciones: 2,
                mostrarCondicionales: true,
                mostrarDenominacion: false
            });

            this.objExpMat.on('expresionsalvada', function (arr) {
                if (arr) {
                    variables.idformulaarea = arr['idexpresionmatematica'];
                    this.objExpMat.close();
                    //vista.taFormulaArea.setValue(arr['elementosMostrar']);
                    salvarFormulasAreas();
                    mostrarMensaje(1, 'La expresi&oacute;n matem&aacute;tica se adicion&oacute; satisfactoriamente');
                } else {
                    mostrarMensaje(3, 'La expresi&oacute;n matem&aacute;tica no se pudo adicionar');
                }


            }.createDelegate(this));

            this.objExpMat.show();
        }

        function eliminarAgrupador() {
            var seleccionados = vista.gpAgrupadores.getSelectionModel().getSelections();
            var arridagrupadores = new Array();
            Ext.each(seleccionados, function (value) {
                    arridagrupadores.push(value.data.idagrupador);
                }
            );
            var msgconfirm = (arridagrupadores.length > 1) ? ' los agrupadores seleccionados?' : ' el agrupador seleccionado?';
            mostrarMensaje(2, '¿Est&aacute; seguro que desea eliminar' + msgconfirm, function (boton) {
                if (boton == "ok") {
                    var urlAction = '/pvd/nomina/index.php/confgeneral/eliminarAgrupadorAreas';
                    PVD.mostrarMascara('idmaskdelagrupadores', 'Espere por favor', 'Enviando datos...');
                    Ext.Ajax.request({
                        url: urlAction,
                        method: 'POST',
                        params: {
                            arridagrupadores: Ext.encode(arridagrupadores)
                        },
                        callback: function (options, success, response) {
                            responseData = Ext.decode(response.responseText);
                            //Ocultando máscara de enviar datos.
                            PVD.ocultarMascara('idmaskdelagrupadores');

                            var msgok = (arridagrupadores.length > 1) ? 'Los agrupadores se han' : 'El agrupador se ha';
                            var msgerror = (arridagrupadores.length > 1) ? 'Los agrupadores no se pudieron' : 'El agrupador no se pudo';
                            if (responseData == 'ok') {
                                mostrarMensaje(1, msgok + " eliminado satisfactoriamente.");
                                modelo.storeAgrupadores.load({
                                    params: {
                                        identidad: variables.identidad,
                                        idpagoporresultado: variables.idpagoporresultado
                                    }
                                });
                            } else {
                                mostrarMensaje(3, msgerror + " eliminar.");
                            }

                            modelo.storeAgrupadores.load({
                                params: {
                                    identidad: variables.identidad,
                                    idpagoporresultado: idpagoporresultado
                                }
                            });
                            variables.cambio = 0;
                        }
                    });
                } else {

                }
            }.createDelegate(this));

        }

        function eliminarArea() {
            var seleccionados = vista.gpAreas.getSelectionModel().getSelections();
            var idagrupador = vista.gpAgrupadores.getSelectionModel().getSelected().get('idagrupador');
            var arridformulaareamonto = new Array();
            Ext.each(seleccionados, function (value) {
                    arridformulaareamonto.push(value.data.idformulaareamonto);
                }
            );
            var msgconfirm = (arridformulaareamonto.length > 1) ? ' las &aacute;reas seleccionadas?' : ' el &aacute;rea seleccionada?';
            mostrarMensaje(2, '¿Est&aacute; seguro que desea eliminar' + msgconfirm, function (boton) {
                if (boton == "ok") {
                    var urlAction = '/pvd/nomina/index.php/confgeneral/eliminarAreas';
                    PVD.mostrarMascara('idmaskdelarea', 'Espere por favor', 'Enviando datos...');
                    Ext.Ajax.request({
                        url: urlAction,
                        method: 'POST',
                        params: {
                            idagrupador: idagrupador,
                            arridformulaareamonto: Ext.encode(arridformulaareamonto)
                        },
                        callback: function (options, success, response) {
                            responseData = Ext.decode(response.responseText);
                            //Ocultando máscara de enviar datos.
                            PVD.ocultarMascara('idmaskdelarea');
                            var msgok = (arridformulaareamonto.length > 1) ? 'Las &aacute;reas se han' : 'El &aacute;rea se ha';
                            var msgerror = (arridformulaareamonto.length > 1) ? 'Las &aacute;reas no se pudieron' : 'El &aacute;rea no se pudo';
                            if (responseData == 'ok') {
                                mostrarMensaje(1, msgok + " eliminado satisfactoriamente.");
                            } else {
                                mostrarMensaje(3, msgerror + " eliminar.");
                            }
                            modelo.storeAreas.load({
                                params: {
                                    identidad: variables.identidad,
                                    idagrupador: idagrupador
                                }
                            });
                            variables.cambio = 0;
                        }
                    });
                } else {

                }
            }.createDelegate(this));


        }
    }
};

variablesGlobales.confmontosareas_js = 1;

