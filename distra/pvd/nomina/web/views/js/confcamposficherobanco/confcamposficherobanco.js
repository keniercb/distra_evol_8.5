Ext.ns('Pvd.Nomina.Configuracion.CamposFicheroBanco');

Pvd.Nomina.Configuracion.CamposFicheroBanco.Panel = Ext.extend(Ext.Panel, {
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
        this.modelo = new Pvd_Nomina_Configuracion_CamposFicheroBanco_Modelo();
        this.modelo.init();

        //Inicializando la vista.
        this.vista = new Pvd_Nomina_Configuracion_CamposFicheroBanco_Vista();
        this.vista.init(this.perfil, this.idioma, this.modelo);

        //Inicializar controlador.
        this.controlador = new Pvd_Nomina_Configuracion_CamposFicheroBanco_Controlador();
        this.controlador.init(this.idioma, this.vista, this.modelo);

        this.items = [this.vista.panelCentralCamposFicheroBanco];

        //Teclas calientes de la interfaz
        this.keyMap = this.controlador.keyMap;

        Pvd.Nomina.Configuracion.CamposFicheroBanco.Panel.superclass.initComponent.call(this);
    },
    listeners: {
        afterlayout: function (x) {
            if (this.mostrar == 1) {
                //this.modelo.storeCamposFicheroBanco.load({params: {limit: 20, start: 0}});
                this.mostrar = 2;
            }
        },
        destroy: function (x) {

        }
    }
});

var Pvd_Nomina_Configuracion_CamposFicheroBanco_Modelo = function () {
    this.init = function () {
        this.storeCamposFicheroBanco = new Ext.data.Store({
            url: '/pvd/nomina/index.php/confgeneral/obtenerCamposDbfBanco',
            reader: new Ext.data.JsonReader(
                {totalProperty: "cantidad", /*autoLoad: true,*/ root: "datos", id: "idconfexportaciondbfbanco"},
                [
                    {name: 'idconfexportaciondbfbanco'},
                    {name: 'idbanco'},
                    {name: 'tipocampo'},
                    {name: 'denomcampo'},
                    {name: 'tipodato'},
                    {name: 'longitudvalor'},
                    {name: 'tipofichero'},
                    {name: 'lugaresdecimales'},
                    {name: 'orden'},
                    {name: 'idconfexportaciondbfbancoficheroentidad'},
                    {name: 'denombanco'},
                    {name: 'denomtipodato'},
                    {name: 'tipoformato'},
                    {name: 'denomtipoformato'}
                ])
        });

        //Tipo campo
        this.storeTipoCampo = new Ext.data.SimpleStore({
            fields: [{name: 'idtipocampo'}, {name: 'tipocampo'}]
        });
        var data = [[0, "cod_tipid"], [1, "cod_paexid"], [2, "num_ideper"], [3, "cta_mnac"], [4, "cta_mlc"], [5, "importe_n"], [6, "importe_d"],  [7, "cod_centro_pago_bpa"],  [8, "cod_sucursal_bpa"],  [9, "cod_banco_bpa"]];
        this.storeTipoCampo.loadData(data);

        //Tipo dato
        this.storeTipoDato = new Ext.data.SimpleStore({
            fields: [{name: 'idtipodato'}, {name: 'tipodato'}]
        });
        var data = [[0, "varchar"], [1, "float"], [2, "numeric"], [3, "logical"]];
        this.storeTipoDato.loadData(data);

        //Banco
        this.stBanco = new Ext.data.Store({
            url: '/pvd/nomina/index.php/confgeneral/obtenerBancos',
            reader: new Ext.data.JsonReader(
                {totalProperty: "cantidad", autoLoad: true, root: "datos", id: "idbanco"},
                [
                    {name: 'idbanco'}, {name: 'denombanco'}
                ])
        });


    }
};

var Pvd_Nomina_Configuracion_CamposFicheroBanco_Vista = function () {
    this.init = function (perfil, idioma, modelo) {
        var self = this;
        this.tipoformato = 1;

        function centrarCampos(val) {
            if (val)
                return "<center>" + val + "</center>";
        }

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
            ]
        });

        //Botones
        this.btnAdicionarCamposFicheroBanco = new Ext.Toolbar.MenuButton({
            id: 'btnAdicionarCamposFicheroBanco',
            text: idioma.lbBtnAdicionar,
            tooltip: idioma.textToolTipAddCampo,
            iconCls: 'adicionar',
            menu: {
                items: [
                    {
                        text: 'Manual',
                        handler: function (items, p) {

                        }
                    }, {
                        text: 'Autom&aacute;tico',
                        handler: function (items, p) {

                        }
                    }
                ]
            }
        });
        this.btnModificarCamposFicheroBanco = new Ext.Button({
            id: 'btnModificarCamposFicheroBanco',
            text: idioma.lbBtnModificar,
            tooltip: idioma.textToolTipModCampo,
            iconCls: 'modificar'
        });
        this.btnEliminarCamposFicheroBanco = new Ext.Button({
            id: 'btnEliminarCamposFicheroBanco',
            text: idioma.lbBtnEliminar,
            tooltip: idioma.textToolTipElimCampo,
            iconCls: 'eliminar'
        });
        this.btnAyudaCamposFicheroBanco = new Ext.Button({
            id: 'btnAyudaCamposFicheroBanco',
            text: idioma.lbBtnAyuda,
            tooltip: idioma.lbBtnAyuda,
            iconCls: 'ayuda',
        });
        this.btnDenominacionEntidad = new Ext.Button({
            id: 'btnDenominacionEntidad',
            text: 'Entidad: ',
            handleMouseEvents: false

        });

        //Grid
        this.smCamposFicheroBanco = new Ext.grid.CheckboxSelectionModel({
            singleSelect: false,
        });
        this.expanderCamposFicheroBanco = new Ext.grid.RowExpander({
            tpl: new Ext.Template(
                '<div style="word-wrap:break-word;white-space:normal;"><p>&nbsp;&nbsp;Descripci&oacute;n:&nbsp;{descripcion}</p><br/></div>'
            ), enableCaching: false
        });
        this.gpCamposFicheroBanco = new Ext.grid.GridPanel({
            id: 'gpCamposFicheroBanco',
            title: 'Listado de campos fichero banco',
            region: 'center',
            columns: [
                this.smCamposFicheroBanco,
                this.expanderCamposFicheroBanco,
                {
                    header: 'idconfexportaciondbfbanco',
                    hidden: true,
                    hideable: false,
                    dataIndex: 'idconfexportaciondbfbanco'
                },
                {header: idioma.lbColDenominacion, width: 100, sortable: true, dataIndex: 'denomcampo'},
                {header: idioma.lbColTipoCampo, width: 50, sortable: true, dataIndex: 'tipocampo'},
                {
                    header: '<center>' + idioma.lbColBanco + '</center>',
                    width: 50,
                    sortable: true,
                    dataIndex: 'denombanco',
                    renderer: centrarCampos
                },
                {
                    header: '<center>' + idioma.lbColTipoDato + '</center>',
                    width: 50,
                    sortable: true,
                    dataIndex: 'denomtipodato',
                    renderer: centrarCampos
                },
                {
                    header: '<center>' + idioma.lbLongitudValor + '</center>',
                    width: 50,
                    sortable: true,
                    dataIndex: 'longitudvalor',
                    renderer: centrarCampos
                },
                {
                    header: '<center>' + idioma.lbLugaresDecimales + '</center>',
                    width: 50,
                    sortable: true,
                    dataIndex: 'lugaresdecimales',
                    renderer: centrarCampos
                },
                {
                    header: '<center>' + idioma.lbOrden + '</center>',
                    width: 50,
                    sortable: true,
                    dataIndex: 'orden',
                    renderer: centrarCampos
                },
                {header: 'tipofichero', hidden: true, hideable: false, sortable: true, dataIndex: 'tipofichero'},
                {header: 'Formato Fichero', hidden: false, hideable: false, sortable: true, dataIndex: 'denomtipoformato'},
                {
                    header: 'idconfexportaciondbfbancoficheroentidad',
                    hidden: true,
                    sortable: true,
                    hideable: false,
                    dataIndex: 'idconfexportaciondbfbancoficheroentidad'
                }
            ],
            clicksToEdit: 1,
            stripeRows: true,
            autoScroll: true,
            border: false,
            width: '100%',
            heigth: '100%',
            viewConfig: {forceFit: true},
            store: modelo.storeCamposFicheroBanco,
            sm: this.smCamposFicheroBanco,
            plugins: this.expanderCamposFicheroBanco,
            loadMask: {msg: 'Cargando...'},
            bbar: new Ext.PagingToolbar({
                pageSize: 20,
                store: modelo.storeCamposFicheroBanco,
                displayInfo: true,
                displayMsg: 'Mostrando  {0} - {1} de {2}',
                emptyMsg: "0 Resultado a mostrar"
            }),
            keys: [
                {
                    key: Ext.EventObject.DELETE,
                    stopEvent: true,
                    fn: function () {
                        if (!self.btnEliminarCamposFicheroBanco.disabled) {
                            self.btnEliminarCamposFicheroBanco.handler();
                        }
                    }
                },{
                    key: 'i',
                    alt: true,
                    stopEvent: true,
                    fn: function () {
                        if (!self.btnAdicionarCamposFicheroBanco.menu.items.items[0].disabled) {
                            self.btnAdicionarCamposFicheroBanco.menu.items.items[0].handler();
                        }
                    }
                },{
                    key: 'm',
                    alt: true,
                    stopEvent: true,
                    fn: function () {
                        if (!self.btnModificarCamposFicheroBanco.disabled) {
                            self.btnModificarCamposFicheroBanco.handler();
                        }
                    }
                }
            ]
        });

        //Panel
        this.panelCentralCamposFicheroBanco = new Ext.Panel({
            id: 'idpanelCentralCamposFicheroBanco',
            region: 'center',
            heigth: '100%',
            width: '100%',
            border: false,
            layout: 'fit',
            tbar: [this.btnDenominacionEntidad, '', '|', '', this.btnAdicionarCamposFicheroBanco, this.btnModificarCamposFicheroBanco, this.btnEliminarCamposFicheroBanco, '->', this.btnAyudaCamposFicheroBanco],
            items: [this.gpCamposFicheroBanco]
        });

        //Campos
        this.tfDenomCampoDBF = new Ext.form.TextField({
            id: 'idtfDenomCampoDBF',
            fieldLabel: idioma.lbColDenominacion,
            name: 'denomcampo',
            allowBlank: false,
            blankText: idioma.lbErrorCampoVacio,
            maxLength: 100,
            anchor: '95%'
        });
        this.cbTipoCampoDBF = new Ext.form.ComboBox({
            id: 'idcbTipoCampoDBF',
            fieldLabel: idioma.lbColTipoCampo,
            valueField: 'idtipocampo',
            displayField: 'tipocampo',
            hiddenName: 'idtipocampo',
            allowBlank: false,
            mode: 'local',
            store: modelo.storeTipoCampo,
            emptyText: 'Seleccione...',
            blankText: idioma.lbErrorCampoVacio,
            readOnly: true,
            triggerAction: 'all',
            anchor: '90%'
        });
        this.cbTipoDatoDBF = new Ext.form.ComboBox({
            id: 'idcbTipoDatoDBF',
            fieldLabel: idioma.lbColTipoDato,
            valueField: 'idtipodato',
            displayField: 'tipodato',
            hiddenName: 'idtipodato',
            allowBlank: false,
            mode: 'local',
            store: modelo.storeTipoDato,
            emptyText: 'Seleccione...',
            blankText: idioma.lbErrorCampoVacio,
            readOnly: true,
            triggerAction: 'all',
            anchor: '90%'
        });
        this.nfLongitudValorDBF = new Ext.form.NumberField({
            id: 'idnfLongitudValorDBF',
            fieldLabel: idioma.lbLongitudValor,
            name: 'longitudvalor',
            allowBlank: false,
            blankText: idioma.lbErrorCampoVacio,
            anchor: '90%'
        });
        this.nfLugaresDecimalesDBF = new Ext.form.NumberField({
            id: 'idnfLugaresDecimalesDBF',
            fieldLabel: idioma.lbLugaresDecimales,
            name: 'lugaresdecimales',
            allowBlank: false,
            blankText: idioma.lbErrorCampoVacio,
            anchor: '90%'
        });
        this.nfOrdenCampoDBF = new Ext.form.NumberField({
            id: 'idnfOrdenCampoDBF',
            fieldLabel: idioma.lbOrden,
            name: 'orden',
            allowBlank: false,
            blankText: idioma.lbErrorCampoVacio,
            anchor: '90%'
        });
        this.cbBancoDBF = new Ext.form.ComboBox({
            id: 'idcbBancoDBF',
            fieldLabel: idioma.lbColBanco,
            valueField: 'idbanco',
            displayField: 'denombanco',
            hiddenName: 'idbanco',
            // allowBlank: false,
            mode: 'local',
            store: modelo.stBanco,
            emptyText: 'Seleccione...',
            blankText: idioma.lbErrorCampoVacio,
            readOnly: true,
            triggerAction: 'all',
            anchor: '95%'
        });

        this.rbDBF = new Ext.form.Radio({
            id: 'rbDBF',
            boxLabel: '<b>(.DBF)</b>',
            name: 'formato',
            inputValue: 1,
            listeners: {
                'check': function (obj, ischeck) {
                    if (ischeck) {
                        this.tipoformato = 1;
                    }
                }.createDelegate(this)
            }
        });

        this.rbTXT = new Ext.form.Radio({
            id: 'rbTXT',
            boxLabel: '<b>(.TXT)</b>',
            name: 'formato',
            inputValue: 2,
            listeners: {
                'check': function (obj, ischeck) {
                    if (ischeck) {
                        this.tipoformato = 2;
                    }
                }.createDelegate(this)
            }
        });

        this.rgTiposFormato = new Ext.form.RadioGroup({
            region: 'center',
            width: '90%',
            hideLabel: true,
           // columns: [1, 1],
            style: 'padding-left: 20px;',
            items: [this.rbDBF, this.rbTXT]
        });

        this.rbDBFAutomatico = new Ext.form.Radio({
            boxLabel: '<b>(.DBF)</b>',
            name: 'formato',
            inputValue: 1,
            listeners: {
                'check': function (obj, ischeck) {
                    if (ischeck) {
                        this.tipoformato = 1;
                    }
                }.createDelegate(this)
            }
        });

        this.rbTXTAutomatico = new Ext.form.Radio({
            boxLabel: '<b>(.TXT)</b>',
            name: 'formato',
            inputValue: 2,
            listeners: {
                'check': function (obj, ischeck) {
                    if (ischeck) {
                        this.tipoformato = 2;
                    }
                }.createDelegate(this)
            }
        });

        this.rgTiposFormatoAutomatico = new Ext.form.RadioGroup({
            region: 'center',
            width: '90%',
            hideLabel: true,
            style: 'padding-left: 20px;',
            items: [this.rbDBFAutomatico, this.rbTXTAutomatico]
        });

        this.plantillaFotoBM = new Ext.XTemplate(
            '<div align="left">',
            '<img src="data:image/png;base64,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"' +
            ' height=40 width="100%" style="border:1px transparent" />',
            '</div>'
        );

        this.plantillaFotoBANDEC = new Ext.XTemplate(
            '<div align="left">',
            '<img src="data:image/png;base64,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"' +
            ' height=40 width="100%" style="border:1px transparent" />',
            '</div>'
        );
        this.plantillaFotoBM.compile();
        this.plantillaFotoBANDEC.compile();
        this.rbBM = new Ext.form.Radio({
            id: 'rbBM',
            //boxLabel: 'Banco Metropolitano(BM)',
            hideLabel: true,
            name: 'banco',
            inputValue: 1
        });
        this.rbBPA = new Ext.form.Radio({
            id: 'rbBPA',
            //boxLabel: 'Banco Popular de Ahorro(BPA)',
            hideLabel: true,
            name: 'banco',
            inputValue: 2
        });
        this.rbBANDEC = new Ext.form.Radio({
            id: 'rbBANDEC',
            //boxLabel: 'Banco de Cr&eacute;dito y Comercio(BANDEC)',
            hideLabel: true,
            name: 'banco',
            inputValue: 3
        });

        //Formularios
        this.formCamposFicheroBanco = new Ext.FormPanel({
            id: 'idformCamposFicheroBanco',
            labelAlign: 'top',
            frame: true,
            autoHeight: true,
            bodyStyle: {
                padding: '10px 0px 10px 10px'
            },
            items: [
                {
                    layout: 'column',
                    items: [
                        {columnWidth: .66, layout: 'form', items: [this.tfDenomCampoDBF]},
                        {columnWidth: .33, layout: 'form', items: [this.cbTipoCampoDBF]}

                    ]
                }, {
                    layout: 'column',
                    items: [
                        {columnWidth: .66, layout: 'form', items: [this.cbBancoDBF]},
                        {columnWidth: .33, layout: 'form', items: [this.cbTipoDatoDBF]}
                    ]
                }, {
                    layout: 'column',
                    items: [
                        {columnWidth: .33, layout: 'form', items: [this.nfLongitudValorDBF]},
                        {columnWidth: .33, layout: 'form', items: [this.nfLugaresDecimalesDBF]},
                        {columnWidth: .33, layout: 'form', items: [this.nfOrdenCampoDBF]}
                    ]
                },
                {
                    xtype: 'fieldset',
                    title: 'Tipos de formato',
                    height: 80,
                    width: '90%',
                    region: 'center',
                    items: [
                        this.rgTiposFormato
                    ]
                }
            ]
        });
        this.formCamposFicheroBancoAutomatico = new Ext.FormPanel({
            id: 'idformCamposFicheroBancoAutomatico',
            labelAlign: 'top',
            frame: true,
            autoHeight: true,
            bodyStyle: {
                padding: '10px 0px 10px 10px'
            },
            items: [
                {
                    xtype: 'fieldset',
                    title: 'Banco Metropolitano(BM)',
                    height: 80,
                    width: '94%',
                    items: {
                        layout: 'column',
                        items: [
                            {columnWidth: 0.05, layout: 'form', items: [this.rbBM]},
                            {columnWidth: 0.95, layout: 'form', items: [this.plantillaFotoBM]}
                        ]
                    }

                }, {
                    xtype: 'fieldset',
                    title: 'Banco de Cr&eacute;dito y Comercio(BANDEC)',
                    height: 80,
                    width: '94%',
                    items: {
                        layout: 'column',
                        items: [
                            {columnWidth: 0.05, layout: 'form', items: [this.rbBANDEC]},
                            {columnWidth: 0.95, layout: 'form', items: [this.plantillaFotoBANDEC]}
                        ]
                    }
                }, {
                    xtype: 'fieldset',
                    title: 'Banco Popular de Ahorro(BPA)',
                    height: 80,
                    width: '94%',
                    items: {
                        layout: 'column',
                        items: [
                            {columnWidth: 0.05, layout: 'form', items: [this.rbBPA]},
                            {columnWidth: 0.95, layout: 'form', items: [this.plantillaFotoBANDEC]}
                        ]
                    }

                },
                {
                    xtype: 'fieldset',
                    title: 'Tipos de formato',
                    height: 80,
                    width: '94%',
                    region: 'center',
                    items: [
                        this.rgTiposFormatoAutomatico
                    ]
                }
            ]
        });

        //Botones
        this.btnAplicarCamposFicheroBanco = new Ext.Button({
            id: 'idbtnAplicarCamposFicheroBanco',
            iconCls: 'aplicar',
            text: idioma.lbBtnAplicar,
            tooltip: idioma.textToolTipAplicar
        });
        this.btnAceptarCamposFicheroBanco = new Ext.Button({
            id: 'idbtnAceptarCamposFicheroBanco',
            iconCls: 'aceptar',
            text: idioma.lbBtnAceptar,
            tooltip: idioma.textToolTipAceptar
        });
        this.btnCancelarCamposFicheroBanco = new Ext.Button({
            id: 'idbtnCancelarCamposFicheroBanco',
            iconCls: 'cancelar',
            text: idioma.lbBtnCancelar,
            tooltip: idioma.textToolTipCancelar
        });
        this.btnAceptarCamposFicheroBancoAut = new Ext.Button({
            id: 'idbtnAceptarCamposFicheroBancoAut',
            iconCls: 'aceptar',
            text: idioma.lbBtnAceptar,
            tooltip: idioma.textToolTipAceptar
        });
        this.btnCancelarCamposFicheroBancoAut = new Ext.Button({
            id: 'idbtnCancelarCamposFicheroBancoAut',
            iconCls: 'cancelar',
            text: idioma.lbBtnCancelar,
            tooltip: idioma.textToolTipCancelar
        });

        //Ventana
        this.winCamposFicheroBanco = new Ext.Window({
            modal: true,
            closeAction: 'hide',
            autoHeight: true,
            closable: true,
            constrain: true,
            autoValidate: true,
            validateDefault: true,
            resizable: true,
            width: 500,
            layout: 'fit',
            items: [this.formCamposFicheroBanco],
            buttons: [this.btnCancelarCamposFicheroBanco, this.btnAplicarCamposFicheroBanco, this.btnAceptarCamposFicheroBanco]
        });
        this.winCamposFicheroBancoAutomatica = new Ext.Window({
            modal: true,
            closeAction: 'hide',
            autoHeight: true,
            closable: true,
            constrain: true,
            autoValidate: true,
            validateDefault: true,
            resizable: false,
            width: 500,
            layout: 'fit',
            items: [this.formCamposFicheroBancoAutomatico],
            buttons: [this.btnCancelarCamposFicheroBancoAut, this.btnAceptarCamposFicheroBancoAut]
        });
    }
};

var Pvd_Nomina_Configuracion_CamposFicheroBanco_Controlador = function () {
    this.init = function (idioma, vista, modelo) {
        var variables = {
            identidad: -1,
            accion: 'Add',
            cambio: 0,
            tipoadd: 0,
            idbancoautomatico: 0,
            tipoformato: 1
        };

        //Mostrar interfaz para selecionar entidad.
        vista.winEstEntidades.show();
        vista.pEstEntidades.on('estructuraselecionada', function (o, nodo) {
            if (nodo.attributes.tipoestructura == 3 || nodo.attributes.tipoestructura == 5) {
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
            vista.panelCentralCamposFicheroBanco.show();
            vista.winEstEntidades.hide();
            //Cargando los pagos por resultados
            modelo.storeCamposFicheroBanco.load({params: {identidad: variables.identidad}});
            modelo.stBanco.load();
        });

        //Grid
        vista.smCamposFicheroBanco.on('rowselect', function () {
            var cantseleccionados = vista.smCamposFicheroBanco.getSelections().length;
            (cantseleccionados == 1) ? vista.btnModificarCamposFicheroBanco.enable() : vista.btnModificarCamposFicheroBanco.disable();
            (cantseleccionados > 0) ? vista.btnEliminarCamposFicheroBanco.enable() : vista.btnEliminarCamposFicheroBanco.disable();
        });
        vista.smCamposFicheroBanco.on('rowdeselect', function () {
            var cantseleccionados = vista.smCamposFicheroBanco.getSelections().length;
            (cantseleccionados == 1) ? vista.btnModificarCamposFicheroBanco.enable() : vista.btnModificarCamposFicheroBanco.disable();
            (cantseleccionados > 0) ? vista.btnEliminarCamposFicheroBanco.enable() : vista.btnEliminarCamposFicheroBanco.disable();
        });
        modelo.storeCamposFicheroBanco.on('beforeload', function (store) {
            vista.btnModificarCamposFicheroBanco.disable();
            vista.btnEliminarCamposFicheroBanco.disable();
            store.removeAll();
        });

        //Botones
        vista.btnAplicarCamposFicheroBanco.setHandler(function () {
            salvarformCamposFicheroBanco(true);
        });
        vista.btnAceptarCamposFicheroBanco.setHandler(function () {
            salvarformCamposFicheroBanco(false);
        });
        vista.btnCancelarCamposFicheroBanco.setHandler(function () {
            vista.winCamposFicheroBanco.hide();
        });
        vista.btnAceptarCamposFicheroBancoAut.setHandler(function () {
            mostrarMensaje(2, 'Con esta acci&oacute;n se adicionan los campos del banco seleccionado en la entidad. ' +
                '¿Est&aacute seguro que desea continuar?',
                function (btn) {
                    if (btn == 'ok') {
                        salvarformCamposFicheroBanco(false);
                    }
                });
        });
        vista.btnCancelarCamposFicheroBancoAut.setHandler(function () {
            vista.winCamposFicheroBancoAutomatica.hide();
        });
        vista.rbBM.on('check', function (obj, ischeck) {
            if (ischeck) {
                variables.idbancoautomatico = 0;
            }
        });
        vista.rbBANDEC.on('check', function (obj, ischeck) {
            if (ischeck) {
                variables.idbancoautomatico = 1;
            }
        });
        vista.rbBPA.on('check', function (obj, ischeck) {
            if (ischeck) {
                variables.idbancoautomatico = 2;
            }
        });
        vista.btnAdicionarCamposFicheroBanco.menu.items.items[0].setHandler(function () {
            variables.tipoadd = 0;
            mostrarVentanaAdicionarCamposFicheroBanco(0);
        });
        vista.btnAdicionarCamposFicheroBanco.menu.items.items[1].setHandler(function () {
            variables.tipoadd = 1;
            mostrarVentanaAdicionarCamposFicheroBanco(1);
        });
        vista.btnModificarCamposFicheroBanco.setHandler(function () {
            variables.tipoadd = 0;
            mostrarVentanaModificarCamposFicheroBanco();
        });
        vista.btnEliminarCamposFicheroBanco.setHandler(function () {
            eliminarCamposFicheroBanco();
        });

        //Ventanas
        vista.winCamposFicheroBanco.on('beforeshow', function () {
            vista.formCamposFicheroBanco.getForm().reset();
            vista.tfDenomCampoDBF.focus(true, 500);
        });

        function mostrarVentanaAdicionarCamposFicheroBanco(tipoventana) {
            variables.accion = 'Add';
            if (tipoventana == 0) {
                Ext.Ajax.request({
                    url: '/pvd/nomina/index.php/confgeneral/obtenerOrdenDisponible',
                    method: 'POST',
                    params: {identidad: variables.identidad},
                    callback: function (options, success, response) {
                        var responseData = Ext.decode(response.responseText);
                        vista.winCamposFicheroBanco.setTitle('Adicionar campos fichero banco');
                        vista.winCamposFicheroBanco.show();
                        vista.nfOrdenCampoDBF.setValue(responseData.orden);
                        vista.tfDenomCampoDBF.focus(true, 500);
                        vista.btnAplicarCamposFicheroBanco.show();
                    }
                });
                vista.rbDBF.enable();
                vista.rbTXT.enable();
            } else {
                vista.winCamposFicheroBancoAutomatica.setTitle('Adicionar campos fichero banco');
                vista.btnAplicarCamposFicheroBanco.hide();
                vista.winCamposFicheroBancoAutomatica.show();
            }
        }

        function mostrarVentanaModificarCamposFicheroBanco() {
            var arrdatos = vista.smCamposFicheroBanco.getSelected().data;
            vista.winCamposFicheroBanco.setTitle('Modificar campos fichero banco');
            vista.btnAplicarCamposFicheroBanco.hide();
            vista.winCamposFicheroBanco.show();
            vista.tfDenomCampoDBF.setValue(arrdatos['denomcampo']);
            //tipo de campo
            var idtipodato = 0;
            switch (arrdatos['tipocampo']) {
                case "cod_tipid":
                    idtipodato = 0;
                    break;
                case "cod_paexid":
                    idtipodato = 1;
                    break;
                case "num_ideper":
                    idtipodato = 2;
                    break;
                case "cta_mnac":
                    idtipodato = 3;
                    break;
                case "cta_mlc":
                    idtipodato = 4;
                    break;
                case "importe_n":
                    idtipodato = 5;
                    break;
                case "importe_d":
                    idtipodato = 6;
                    break;
            }
            if(arrdatos['tipofichero'] == 1){
                vista.rbDBF.setValue(true);
            }else if(arrdatos['tipofichero'] == 2){
                vista.rbTXT.setValue(true);
            }else{
                vista.rbDBF.setValue(false);
                vista.rbTXT.setValue(false);
            }

            vista.cbTipoCampoDBF.setValue(idtipodato);
            vista.cbTipoDatoDBF.setValue(arrdatos['tipodato']);
            vista.cbBancoDBF.setValue(arrdatos['idbanco']);
            vista.nfLongitudValorDBF.setValue(arrdatos['longitudvalor']);
            vista.nfLugaresDecimalesDBF.setValue(arrdatos['lugaresdecimales']);
            vista.nfOrdenCampoDBF.setValue(arrdatos['orden']);
            vista.rbDBF.disable();
            vista.rbTXT.disable();

            //Modificando las variables
            variables.accion = 'Mod';
        }

        function salvarformCamposFicheroBanco(boton) {
            var urlAction = '/pvd/nomina/index.php/confgeneral/adicionarCamposDbfBanco';
            var idconfexportaciondbfbanco = -1;
            if (variables.accion == 'Mod') {
                urlAction = '/pvd/nomina/index.php/confgeneral/modificarCamposDbfBanco';
                idconfexportaciondbfbanco = vista.smCamposFicheroBanco.getSelected().get('idconfexportaciondbfbanco');
                if (variables.cambio == 0) {
                    //Se oculta la ventana si no ha sido modificado ningún valor.
                    vista.winCamposFicheroBanco.hide();
                }
            }

            var form = (variables.tipoadd != 1) ? vista.formCamposFicheroBanco : vista.formCamposFicheroBancoAutomatico;
            //Se verifica si el formulario es válido
            //if (form.getForm().isValid()) {
            PVD.mostrarMascara('idmaskaddmodcampos', 'Espere por favor', 'Enviando datos...');console.log(variables.idbancoautomatico)
            Ext.Ajax.request({
                url: urlAction,
                method: 'POST',
                params: {
                    idconfexportaciondbfbanco: idconfexportaciondbfbanco,
                    denominacion: vista.tfDenomCampoDBF.getRawValue(),
                    idbanco: (variables.tipoadd == 0) ? vista.cbBancoDBF.getValue() : variables.idbancoautomatico,
                    tipocampo: vista.cbTipoCampoDBF.getRawValue(),
                    tipodato: vista.cbTipoDatoDBF.getRawValue(),
                    tipofichero: 1,
                    longitudvalor: vista.nfLongitudValorDBF.getValue(),
                    lugaresdecimales: vista.nfLugaresDecimalesDBF.getValue(),
                    orden: vista.nfOrdenCampoDBF.getValue(),
                    tipoformato: vista.tipoformato,
                    identidad: variables.identidad,
                    tipoadd: variables.tipoadd
                },
                callback: function (options, success, response) {
                    responseData = Ext.decode(response.responseText);
                    PVD.ocultarMascara('idmaskaddmodcampos');
                    var msgok = (variables.tipoadd == 1) ? 'Los campos se han' : 'El campo se ha';
                    var msgerror = (variables.tipoadd == 1) ? 'Los campos no se pudieron' : 'El campo no se pudo';
                    switch (responseData.respuesta) {
                        case 'ADD-1':
                            mostrarMensaje(1, msgok + " adicionado satisfactoriamente.");
                            break;
                        case 'ADD-2':
                            mostrarMensaje(3, "El campo que desea adicionar ya existe.");
                            break;
                        case 'ADD-3':
                            mostrarMensaje(3, msgerror + " adicionar.");
                            break;
                        case 'MOD-1':
                            mostrarMensaje(1, "El campo se ha modificado satisfactoriamente.");
                            break;
                        case 'MOD-3':
                            mostrarMensaje(3, "El campo no se pudo modificar.");
                            break;
                    }

                    if (!boton) {
                        (variables.tipoadd != 1) ? vista.winCamposFicheroBanco.hide() : vista.winCamposFicheroBancoAutomatica.hide();
                    } else {
                        if (variables.tipoadd != 1)
                            vista.tfDenomCampoDBF.focus(true, 500);
                    }
                    form.getForm().reset();
                    modelo.storeCamposFicheroBanco.removeAll();
                    modelo.storeCamposFicheroBanco.load({params: {identidad: variables.identidad}});
                    variables.cambio = 0;

                    //Capturando el orden
                    Ext.Ajax.request({
                        url: '/pvd/nomina/index.php/confgeneral/obtenerOrdenDisponible',
                        method: 'POST',
                        params: {identidad: variables.identidad},
                        callback: function (options, success, response) {
                            var responseData = Ext.decode(response.responseText);
                            vista.formCamposFicheroBanco.getForm().reset();
                            vista.nfOrdenCampoDBF.setValue(responseData.orden);
                        }
                    });
                }
            });
            //} else {
            // mostrarMensaje(3, 'El formulario contiene campos inv&aacute;lidos.');
            //}

        }

        function eliminarCamposFicheroBanco() {
            var seleccionados = vista.gpCamposFicheroBanco.getSelectionModel().getSelections();
            var r = new Array();
            Ext.each(seleccionados, function (value) {
                    r.push(value.data.idconfexportaciondbfbanco);
                }
            );
            var msg = (r.length > 1) ? 'los campos seleccionados?' : 'el campo seleccionado?';
            mostrarMensaje(2, '¿Est&aacute; seguro que desea eliminar ' + msg,
                function (btn) {
                    if (btn == 'ok') {
                        var urlAction = '/pvd/nomina/index.php/confgeneral/eliminarCamposDbfBanco';
                        PVD.mostrarMascara('idmaskdel', 'Espere por favor', 'Enviando datos...');
                        Ext.Ajax.request({
                            url: urlAction,
                            method: 'POST',
                            params: {
                                idconfexportaciondbfbanco: Ext.encode(r),
                                identidad: variables.identidad
                            },
                            callback: function (options, success, response) {
                                responseData = Ext.decode(response.responseText);
                                PVD.ocultarMascara('idmaskdel');
                                var msgok = (r.length > 1) ? 'Los campos se han' : 'El campo se ha';
                                var msgerror = (r.length > 1) ? 'Los campos no se pudieron' : 'El campo no se pudo';
                                if (responseData == 1) {
                                    mostrarMensaje(1, msgok + " eliminado satisfactoriamente.");
                                } else {
                                    mostrarMensaje(3, msgerror + " eliminar.");
                                }

                                modelo.storeCamposFicheroBanco.load({params: {identidad: variables.identidad}});
                                variables.cambio = 0;
                            }
                        });
                    }
                });
        }
    }
};

variablesGlobales.confcamposficherobanco_js = 1;
