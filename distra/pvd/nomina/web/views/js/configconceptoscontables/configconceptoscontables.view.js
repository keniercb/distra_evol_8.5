Ext.ns('Pvd.Nomina.Configuracion.ConceptosContables');

Ext.QuickTips.init();

//Vista del componente Configurar modelo de nómina.
Pvd.Nomina.Configuracion.ConceptosContables.Vista = {
    /**
     * Inicializar la vista.
     *
     * @param perfil Objeto que contiene el perfil de la IU (Tipo: Object).
     * @param idioma Objeto que contiene el idioma de los textos de la IU (Tipo: Object).
     * @param modelo Modelo de la vista del componente Configurar modelo de nómina (Tipo: Pvd.Nomina.Configuracion.ConceptosContables.Modelo).
     */
    init: function (perfil, idioma, modelo) {

        this.idelementosgastoaux = 0;
        var self = this;

        //Componenete para seleccionar la entidad de la cual obtener las personas.
        this.pobjestructura = new Ext.pvd.persona.buscarestructura.panelBuscarestructura({
            layout: 'border',
            region: 'center',
            nivel: 5,
            nivelchequear: 3
        });

        //Ventana para seleccionar la entidad.
        this.btnAceptarEntidad = new Ext.Button({
            id: 'btnAceptarEntidad',
            text: idioma.lbBtnAceptar,
            tooltip: idioma.lbBtnAceptar,
            disabled: true,
            iconCls: 'aceptar'
        });

        this.winEstructura = new Ext.Window({
            title: 'Entidades',
            modal: true,
            height: 350,
            width: 300,
            constrain: true,
            closable: false,
            resizable: false,
            layout: 'fit',
            items: [this.pobjestructura],
            buttons: [this.btnAceptarEntidad]
        });

        //Botones de Add, Mod, Elim, Ayud de conceptos contables.
        this.btnAdicionarConceptosContables = new Ext.Button({
            id: 'btnAdicionarConceptosContables',
            text: 'Ad<u>i</u>cionar',
            tooltip: 'Ad<u>i</u>cionar conceptos contables (<b>Alt+I</b>)',
            //icon: perfil.dirImg+'adicionar.png',
            iconCls: 'adicionar',
            prevTab: 'btnAyudaConceptosContables',
            nextTab: 'btnModificarConceptosContables',
        });

        this.btnModificarConceptosContables = new Ext.Button({
            id: 'btnModificarConceptosContables',
            text: '<u>M</u>odificar',
            tooltip: '<u>M</u>odificar conceptos contables (<b>Alt+M</b>)',
            //icon: perfil.dirImg+'modificar.png',
            iconCls: 'modificar',
            prevTab: 'btnAdicionarConceptosContables',
            nextTab: 'btnEliminarConceptosContables',
            disabled: true,
        });

        this.btnEliminarConceptosContables = new Ext.Button({
            id: 'btnEliminarConceptosContables',
            text: 'Eliminar',
            tooltip: 'Eliminar conceptos contables (<b>DEL</b>)',
            //icon: perfil.dirImg+'eliminar.png',
            iconCls: 'eliminar',
            prevTab: 'btnModificarConceptosContables',
            nextTab: 'btnAyudaConceptosContables',
            disabled: true,
        });

        this.btnElementosGasto = new Ext.Button({
            id: 'btnElementosGasto',
            text: 'Elemento del gasto',
            tooltip: 'Asociar elemento del gasto',
            //icon: perfil.dirImg+'eliminar.png',
            iconCls: 'registrogasto',
            prevTab: 'btnModificarConceptosContables',
            nextTab: 'btnAyudaConceptosContables',
            disabled: true,
        });

        this.btnAyudaConceptosContables = new Ext.Button({
            id: 'btnAyudaConceptosContables',
            text: 'Ayuda',
            tooltip: 'Mostrar ayuda de la funcionalidad (<b>Alt+H</b>)',
            // icon:perfil.dirImg+'ayuda.png',
            iconCls: 'ayuda',
            prevTab: 'btnElimTipoP',
            nextTab: 'btnAddTipoP',
        });

        this.btnreplicar = new Ext.Button({
            id: 'btnreplicar',
            text: 'Replicar',
            tooltip: 'Replicar',
            disabled: true,
            iconCls: 'adicionar',
            handler: function () {
            }.createDelegate(this)
        });

        //Elimina los conceptos contables repetidos varias veces en una misma entidad
        this.btnSync = new Ext.Button({
            id: 'btnsync',
            text: 'Eliminar duplicados',
            tooltip: 'Elimina los conceptos contables repetidos varias veces en la misma entidad',
            iconCls: 'eliminar',
            handler: function () {
            }.createDelegate(this)
        });

        //Elimina los conceptos contables repetidos varias veces en una misma entidad
        this.btnSyncValoresContables = new Ext.Button({
            id: 'btnsyncvalorescontables',
            text: 'Sync Valores Contables',
            tooltip: 'Sicroniza automaticamente los valores contables',
            iconCls: 'sincronizar',
            handler: function () {
            }.createDelegate(this)
        });

        //Buscador
        this.tfbuscar = new Ext.form.TextField({
            id: 'tfbuscar',
            allowBlank: true,
            minLength: 1,
            enableKeyEvents: true,
            regexp: /^([a-z0-9A-ZáéíóúñüÑ\d\s]+ ?[a-z0-9A-ZáéíóúñüÑ\d\s]*)+$/,
            width: 120,
            emptyText: 'Criterio a buscar',
            name: 'tfbuscador'
        });
        this.btnBuscar = new Ext.Button({
            disabled: false,
            id: 'btnBuscar',
            iconCls: 'buscar',
            text: '<u>B</u>uscar',
            tooltip: 'Buscar conceptos contables <b>(Alt+B)</b>',
            handler: function () {

            }
        });

        //Función auxiliar para centrar los valores del grid.
        function centrarValor(val) {
            if (val)
                return "<center>" + val + "</center>";
        }

        this.smConceptosContables = new Ext.grid.CheckboxSelectionModel({
            //singleSelect:true,
        });

        this.gpConceptosContables = new Ext.grid.GridPanel({
            id: 'idgpConceptosContables',
            title: 'Listado de los conceptos contabes',
            region: 'center',
            layout: 'fit',
            split: true,
            columns: [this.smConceptosContables,
            {header: 'idparrafofiscal', hidden: true, hideable: false, dataIndex: 'idparrafofiscal'}
            ,
            {
                header: 'idconceptoscontables',
                hidden: true,
                hideable: false,
                dataIndex: 'idconceptoscontables'
            }, {header: 'Denominaci&oacute;n', width: 60, sortable: true, dataIndex: 'denominacion'}, {
                header: 'Tipo n&oacute;mina',
                fixed: true,
                width: 60,
                sortable: true,
                dataIndex: 'denominaciontiponomina'
            }, {
                header: 'Campo n&oacute;mina',
                fixed: true,
                width: 85,
                sortable: true,
                dataIndex: 'denominacionestructuranomina'
            }
                , {
                    header: 'Obligaci&oacute;n',
                    fixed: true,
                    width: 60,
                    sortable: true,
                    hideable: false,
                    dataIndex: 'obligacion'
                },
                {header: 'Cobros y pagos', width: 20, sortable: true, dataIndex: 'denomtienecobrospagos'}
                ,
                {header: 'Tipo operaci&oacute;n', width: 40, sortable: true, dataIndex: 'denomtipocobrospagos'}
                ,
                {header: 'Tipo sustituci&oacute;n', width: 40, sortable: true, dataIndex: 'denomidtipointegracioncobrospagos'}
                ,
                {header: 'Cliente proveedor', width: 80, sortable: true, dataIndex: 'denominacionpf'}
                ,
                {header: 'Cuenta cliente/prov', width: 80, sortable: true, dataIndex: 'nombrecuenta'}
                ,
                {header: 'Cuenta persona', width: 80, sortable: true, dataIndex: 'denom'}
                ,
                {header: 'Liquida cobros y pagos', width: 80, sortable: true, dataIndex: 'denomliquidacobrosypagos'}
                ,
                {header: 'Campo liquida cobros y pagos', width: 80, sortable: true, dataIndex: 'campoliquidaobligacion'}
                ,
                {header: '', width: 80, sortable: true, dataIndex: 'idpartidagasto'}
                ,
                {
                    header: 'Elemento gasto',
                    fixed: true,
                    width: 60,
                    sortable: true,
                    dataIndex: 'denomelementosgasto',
                    renderer: activarImagen
                }, {
                    header: 'idtienecobrospagos',
                    fixed: true,
                    width: 10,
                    sortable: true,
                    dataIndex: 'idtienecobrospagos',
                    hidden: true
                }, {
                    header: 'idpartidagasto',
                    fixed: true,
                    width: 10,
                    sortable: true,
                    dataIndex: 'idpartidagasto',
                    hidden: true
                }
                // ,{header: 'Partida de gasto', fixed : true, width: 200, sortable: true, dataIndex: 'partida'}
                , {
                    header: 'Fecha inicio',
                    fixed: true,
                    width: 50,
                    sortable: true,
                    dataIndex: 'fdesde'
                }, {header: 'Fecha fin', fixed: true, width: 50, sortable: true, dataIndex: 'fhasta'}, {
                    header: 'idestructuramodelodomina',
                    hidden: true,
                    hideable: false,
                    dataIndex: 'idestructuramodelodomina'
                }, {
                    header: 'idtiponomina',
                    hidden: true,
                    hideable: false,
                    dataIndex: 'idtiponomina'
                }, {header: 'idestructura', hidden: true, hideable: true, dataIndex: 'idestructura'},
                {header: 'liquidacobrosypagos', hidden: true, hideable: true, dataIndex: 'liquidacobrosypagos'}

            ],
            stripeRows: true,
            autoScroll: true,
            width: '100%',
            height: '100%',
            border: false,
            viewConfig: {forceFit: true},
            view: new Ext.grid.GroupingView({
                forceFit: true,
                groupTextTpl: '{text}'
            }),
            store: modelo.storeConceptosContables,
            sm: this.smConceptosContables,
            loadMask: {msg: 'Cargando...'},
            bbar: new Ext.PagingToolbar({
                pageSize: 1000,
                store: modelo.storeConceptosContables,
                displayInfo: true
            }),
        });

        function activarImagen(val, metaData, record, rowIndex, colIndex, store) {

            var iconCls = 'icondistra-bandera rojo';
            var value = " ";

            if (val != "rojo") {
                iconCls = 'icondistra-bandera verde';
                value = val;

            }

            return "<div class='" + iconCls + "' style='width:16px; height:16px; margin-top:0px !important;'><div style='margin-left: 20px; margin-top: -15px;'>" + value + "</div></div>";
        }

        //Campos del formulario de conceptos contables.
        this.tfDenomConceptosContables = new Ext.form.TextField({
            id: 'idtfDenomConceptosContables', fieldLabel: 'Denominaci&oacute;n',
            tabIndex: 2, name: 'denominacion', allowBlank: false, anchor: '90%',
            prevTab: 'idbtnAceptarConceptosContables',
            //vtype: 'vtdenominaciones',
            blankText: idioma.lbErrorCampoVacio,
            maxLength: 100,
            maxLengthText: idioma.lbMaxText_100,
        });

        this.tfObligacion = new Ext.form.TextField({
            id: 'tfObligacion', fieldLabel: 'Obligaci&oacute;n',
            tabIndex: 2, name: 'obligacion', anchor: '99%',
            prevTab: 'idbtnAceptarConceptosContables',
            //vtype: 'vtdenominaciones',
            blankText: idioma.lbErrorCampoVacio,
            maxLength: 100,
            maxLengthText: idioma.lbMaxText_100,
        });

        this.cbTipoNomina = new Ext.form.ComboBox({
            id: 'cbTipoNomina', fieldLabel: 'Tipo n&oacute;mina',
            tabIndex: 3, valueField: 'idtiponomina',
            displayField: 'denominaciontiponomina', hiddenName: 'idtiponomina',
            allowBlank: false, mode: 'local',
            store: modelo.storeTiponomina, emptyText: 'Seleccione...',
            blankText: idioma.lbErrorCampoVacio, readOnly: true,
            triggerAction: 'all', anchor: '90%'
        });

        this.cbEstructuraNomina = new Ext.form.ComboBox({
            id: 'cbEstructuraNomina',
            fieldLabel: 'Conceptos',
            valueField: 'idestructuramodelodomina',
            displayField: 'denominacionestructuranomina',
            hiddenName: 'idestructuramodelodomina',
            allowBlank: false,
            mode: 'local',
            store: modelo.storeEstructuraNomina,
            emptyText: 'Seleccione...',
            blankText: idioma.lbErrorCampoVacio,
            readOnly: true,
            triggerAction: 'all',
            anchor: '99%',
            labelSeparator: '',
            editable: true,
            //maxHeight: 200,
        });

        this.checkLiquidaObligacion = new Ext.form.Checkbox({
            id        : 'checkLiquidaObligacion',
            fieldLabel: 'Liquida obligaci&oacute;n',
            name      : 'liquidacobrosypagos',
            anchor    : '80%'
        });

        this.cbCampoLiquidarObligacion = new Ext.form.ComboBox({id: 'cbCampoLiquidarObligacion', fieldLabel: 'Campo liquida obligaci&oacute;n',
            tabIndex                                        : 3, valueField: 'idcampoliquidaobligacion',
            displayField                                    : 'campoliquidaobligacion', hiddenName: 'idcampoliquidaobligacion',
            mode: 'local',
            store                                           : modelo.storeCampoLiquidarObligacion, emptyText: 'Seleccione',
            disabled                                       : true,
            //readOnly                                        : true,
            triggerAction                                   : 'all', anchor: '86%'
        });

        this.cbCobrosPagos = new Ext.form.ComboBox({id: 'cbCobrosPagos', fieldLabel: 'Cobros y pagos',
            tabIndex                                        : 3, valueField: 'idtienecobrospagos',
            displayField                                    : 'cobrospagos', hiddenName: 'idtienecobrospagos',
            mode: 'local',
            store                                           : modelo.storeCobrosPagos, emptyText: 'Seleccione',

            //readOnly                                        : true,
            triggerAction                                   : 'all', anchor: '80%'
        });

        this.cbTipoOperacionCobrosPagos = new Ext.form.ComboBox({id: 'cbTipoCobrosPagos', fieldLabel: 'Tipo operaci&oacute;n',
            tabIndex                                        : 3, valueField: 'idtipocobrospagos',
            displayField                                    : 'operacioncobrospagos', hiddenName: 'idtipocobrospagos',
            mode: 'local',
            store                                           : modelo.storeTipoCobrosPagos, emptyText: 'Seleccione',
            disabled:                                         true,
            //readOnly                                        : true,
            triggerAction                                   : 'all', anchor: '80%'
        });

        this.cbTipoSustitucionCobrosPagos = new Ext.form.ComboBox({id: 'cbTipoIntegracioCobrosPagos', fieldLabel: 'Tipo sustituci&oacute;n',
            tabIndex                                        : 3, valueField: 'idtipointegracioncobrospagos',
            displayField                                    : 'tipointegracioncobrospagos', hiddenName: 'idtipointegracioncobrospagos',
            mode: 'local',
            store                                           : modelo.storeTipoIntegracioCobrosPagos, emptyText: 'Seleccione',
            disabled:                                         true,
            //readOnly                                        : true,
            triggerAction                                   : 'all', anchor: '99%'
        });

        this.cbxcuenta = new Ext.contabilidad.util.linkedCombo({
            store       : modelo.stcuenta,
            fieldLabel  : 'Cuenta contable',
            displayField: 'denom',
            valueField  : 'cuentacontable',
            name        : 'denom',
            maskRe      : /^[0-9a-zA-Z\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s\.\-\,\(\)]+$/,
            regex       : /^[0-9a-zA-Z\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s\.\-\,\(\)]+$/,
            maxLength   : 255,
            disabled:     true,
            listHeight  : 200,
            tipocta     : '',
            id          : 'lnkcuenta',
            lazyRender  : true,
            allowBlank: true,
            // buttons: [this.btnAddCampo],
            fnCreateNew : Ext.emptyFn
        });

        this.cuentacontable = new Ext.form.Hidden({
            id        : 'cuentacontable',
            name      : 'cuentacontable',
            allowBlank: false,
            hidden    : true
        });

        this.cbParrafoFiscal = new Ext.form.ComboBox({id: 'cbParrafoFiscal', fieldLabel: 'Cliente o proveedor',
            tabIndex                                        : 3, valueField: 'idparrafofiscal',
            displayField                                    : 'denominacionpf', hiddenName: 'idparrafofiscal',
            mode: 'local',
            store                                           : modelo.storeParrafoFiscal, emptyText: 'Seleccione',
            disabled:                                         true,
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

        this.cbPartidagasto = new Ext.components.TreeComboBox({
            id: 'idcbPartidagasto', fieldLabel: 'Partida de gastos',
            hidden: true,
            tabIndex: 4, anchor: "99%",
            treeConfig: {
                rootVisible: false,
                loader: new Ext.tree.TreeLoader({
                    dataUrl: '/pvd/nomina/index.php/configconceptoscontables/obtenerPartidasgasto',
                    preloadChildren: false,
                    listeners: {
                        beforeload: function (treeLoader, node, response) {
                            this.cbPartidagasto.reset();
                            // this.cbEscala.disable();
                            // treeLoader.baseParams.idtipoconceptopd = this.conceptoseleccionado.data.idtipoconceptopd;
                            //  treeLoader.baseParams.idconfconceptopercepciondescuento = this.conceptoseleccionado.data.idconfconceptospdelementossalariales;
                            // treeLoader.baseParams.idtarifa = this.conceptoseleccionado.data.idtarifa;
                            //  treeLoader.baseParams.tipo = this.tipo;
                        }.createDelegate(this),
                        load: function (treeLoader, node, response) {
                            //  this.cbEscala.enable();
                        }.createDelegate(this)
                    }
                }),
                border: false, autoScroll: true,
                listeners: {
                    click: function (node, e) {
                        self.cambio = 1;
                    }
                }
            }
        });
        this.dfFInicioConceptosContables = new Ext.form.DateField({
            id: 'iddfFInicioConceptosContables', fieldLabel: 'Fecha inicio',
            tabIndex: 5, name: 'fechainicio', allowBlank: false,
            format: 'd/m/Y', editable: true, readOnly: false,
            value: new Date().format('d/m/Y'), maxText: idioma.lbFechaMaxima,
            minText: idioma.lbFechaMinima, blankText: idioma.lbErrorCampoVacio,
            invalidText: idioma.invalidTextFecha, vtype: 'daterange',
            anchor: '90%', endDateField: 'iddfFFinConceptosContables'
        });

        this.dfFFinConceptosContables = new Ext.form.DateField({
            id: 'iddfFFinConceptosContables', fieldLabel: 'Fecha fin',
            tabIndex: 5, name: 'fechafin', xtype: 'datefield', allowBlank: true,
            format: 'd/m/Y', editable: true, readOnly: false,
            maxText: idioma.lbFechaMaxima, minText: idioma.lbFechaMinima,
            blankText: idioma.lbErrorCampoVacio, invalidText: idioma.invalidTextFecha,
            vtype: 'daterange', anchor: '99%', startDateField: 'iddfFInicioConceptosContables'
        });

        this.tfDescripConceptosContables = new Ext.form.TextArea({
            id: 'idtfDescripConceptosContables',
            fieldLabel: 'Descripci&oacute;n', tabIndex: 5,
            name: 'descripcion', allowBlank: true,
            hiddenname: 'descripcion',
            maxLength: 255, //regex, regexText, maskRe
            maxLengthText: idioma.lbMaxText_255,
            anchor: '99%', prevTab: 'iddfFFinConceptosContables', nextTab: 'idbtnCancelarConceptosContables',
            blankText: idioma.lbErrorCampoVacio,
        });

        this.cbMostrarDescuento = new Ext.form.Checkbox({
            id: 'cbMostrarDescuento',
            fieldLabel: 'Mostrar descuento',
            name: 'mostrardescuento',
            bottonAlign: 'center',
            tabIndex: 2, name: 'visible', anchor: '90%'
        });

        //Formulario de conceptos contables.
        this.formularioConceptosContables = new Ext.FormPanel({
            id: 'idformlarioConceptosContables',
            labelAlign: 'top',
            frame: true,
            width: 800,
            height: 400,
            autoScroll: true,
            bodyStyle: {
                padding: '10px 10px 10px 10px'
            },
            items: [{
                layout: 'column',
                items: [
                    {columnWidth: .54, layout: 'form', items: [this.tfDenomConceptosContables]},
                    {columnWidth: .46, layout: 'form', items: [this.tfObligacion]},
                ]
            },
                {
                    layout: 'column',
                    items: [
                        {columnWidth: .54, layout: 'form', items: [this.cbTipoNomina]},
                        {columnWidth: .46, layout: 'form', items: [this.cbEstructuraNomina]},
                    ]
                },
                {
                    layout: 'column',
                    items: [
                        {columnWidth: .17, layout: 'form', items: [this.checkLiquidaObligacion]},
                        {columnWidth: .37, layout: 'form', items: [this.cbCampoLiquidarObligacion]},
                        {columnWidth: .15, layout: 'form', items: [this.cbCobrosPagos]},
                        {columnWidth: .15, layout: 'form', items: [this.cbTipoOperacionCobrosPagos]},
                        {columnWidth: .15, layout: 'form', items: [this.cbTipoSustitucionCobrosPagos]},
                    ]
                },
                {
                    xtype:'fieldset',
                    title: 'Clientes y proveedores',
                    height: '100%',
                    width: '96%',
                    hideLabel: true,
                    items: [this.cbParrafoFiscal,this.cbClienteProvCobrosPagos]
                }
                ,
                {
                    xtype:'fieldset',
                    title: 'Cuenta contable de la persona',
                    height: '100%',
                    width: '94%',
                    hideLabel: true,
                    items: [this.cuentacontable,this.cbxcuenta]
                }
                ,
                {
                    layout: 'column',
                    items: [
                        {columnWidth: .54, layout: 'form', items: [this.dfFInicioConceptosContables]},
                        {columnWidth: .46, layout: 'form', items: [this.dfFFinConceptosContables]}
                    ]
                },
                this.tfDescripConceptosContables
            ]
        });

        //Botones de la ventana de conceptos contables
        this.btnCancelarConceptosContables = new Ext.Button({
            id: 'idbtnCancelarConceptosContables',
            iconCls: 'cancelar',
            //icon:perfil.dirImg+'cancelar.png',
            text: idioma.lbBtnCancelar,
            tooltip: idioma.textToolTipCancelar,
            prevTab: 'idtfDescripConceptosContables',
            nextTab: 'idbtnAplicarConceptosContables',
        });

        this.btnAplicarConceptosContables = new Ext.Button({
            id: 'idbtnAplicarConceptosContables',
            iconCls: 'aplicar',
            //icon:perfil.dirImg+'aplicar.png',
            text: idioma.lbBtnAplicar,
            tooltip: idioma.textToolTipAplicar,
            prevTab: 'idbtnCancelarConceptosContables',
            nextTab: 'idbtnAceptarConceptosContables',
        });

        this.btnAceptarConceptosContables = new Ext.Button({
            id: 'idbtnAceptarConceptosContables',
            iconCls: 'aceptar',
            //icon:perfil.dirImg+'aceptar.png',
            text: idioma.lbBtnAceptar,
            tooltip: idioma.textToolTipAceptar,
            prevTab: 'idbtnAplicarConceptosContables',
            nextTab: 'idtfDenomConceptosContables',
        });

        //Ventana de adicionar y modificar los conceptos contables.
        this.ventanaConceptosContables = new Ext.Window({
            id: 'ventanaConceptosContables',
            closeAction: 'hide',
            width: 750,
            height: 600,
            closable: true,
            constrain: true,
            resizable: false,
            autoScroll: true,
            layout: 'fit',
            items: [this.formularioConceptosContables],
            buttons: [this.btnCancelarConceptosContables, this.btnAplicarConceptosContables, this.btnAceptarConceptosContables],
            keys: [
                {
                    key: Ext.EventObject.ENTER,
                    stopEvent: true,
                    fn: function () {
                        self.btnAceptarConceptosContables.handler();
                    }
                }, {
                    key: 'x',
                    alt: true,
                    stopEvent: true,
                    fn: function () {
                        self.btnCancelarConceptosContables.handler();
                    }
                }, {
                    key: 'p',
                    alt: true,
                    stopEvent: true,
                    fn: function () {
                        self.btnAplicarConceptosContables.handler();
                    }
                }
            ]
        });

        //Grid y Formulario de elementos del gasto. 
        this.pElementosGasto = new Ext.Panel({
            id: 'panelElementosGasto',
            layout: 'form',
            labelAlign: 'top',
            frame: true,
            region: 'center',
            height: 400,
            anchor: '100%',
            bodyStyle: 'background-color:#fff;',
            items: [{}],
            listeners: {
                render: function (component) {
                    new Ext.Costo.Procesos.Nomencladores.Componentes.CCEOG({
                        id: 'idcomponenteeg',
                        hideSearch: false,
                        typeSelection: 0,
                        types: [1],
                        renderIn: component
                    }).on({
                        initialize: function (componentClass, UI) {
                            UI.on({
                                checkchange: function (node, checked) {
                                    if (checked) {
                                        var selections = componentClass.fGetSelections();
                                        if (Ext.isArray(selections) && selections.length > 0) {
                                            for (var i = 0; i < selections.length; i++) {
                                                if (node.id != selections[i].id) {
                                                    selections[i].getUI().toggleCheck();
                                                }
                                            }
                                        }

                                    }
                                },
                                click: function (node) {
                                    self.idelementosgasto = node.id;
                                },
                                dblclick: function (node) {
                                    self.idelementosgasto = node.id;
                                }
                            });
                        }
                    });
                }
            }
        });

        //Botones de la ventana de los elementos del gasto
        this.btnCancelarElementosdelGasto = new Ext.Button({
            id: 'idbtnCancelarElementosdelGasto',
            iconCls: 'cancelar',
            text: idioma.lbBtnCancelar,
            tooltip: idioma.textToolTipCancelar,
            prevTab: 'idtfDescripElementosdelGasto',
            nextTab: 'idbtnAplicarElementosdelGasto',
        });

        this.btnAceptarElementosdelGasto = new Ext.Button({
            id: 'idbtnAceptarElementosdelGasto',
            iconCls: 'aceptar',
            text: idioma.lbBtnAceptar,
            tooltip: idioma.textToolTipAceptar,
            prevTab: 'idbtnAplicarElementosdelGasto',
            nextTab: 'idtfDenomElementosdelGasto',
        });


        /*******************************Replicar conceptos contables**************************************/
        this.btnAceptarEntidadreplicar = new Ext.Button({
            id: 'btnAceptarEntidadreplicar',
            text: 'Aceptar',
            tooltip: 'Aceptar',
            disabled: true,
            iconCls: 'aceptar',
            handler: function () {
            }.createDelegate(this)
        });

        this.pobjestructurareplicar = new Ext.pvd.persona.buscarestructura.panelBuscarestructura({
            id: 'idpobjestructurareplicar',
            layout: 'border',
            region: 'center',
            nivel: 7,
            nivelachequear: [3,5]
        });

        this.winEstructuraReplicar = new Ext.Window({
            id: 'idwinEstructuraReplicar',
            title: 'Entidades',
            modal: true,
            height: 350,
            width: 300,
            constrain: true,
            closable: true,
            closeAction: 'hide',
            resizable: false,
            layout: 'fit',
            items: [this.pobjestructurareplicar],
            buttons: [this.btnAceptarEntidadreplicar]
        });
        /*******************************FIN REPLICAR********************************************/

        //Ventana de adicionar y modificar los conceptos contables.
        this.ventanaElementosdelGasto = new Ext.Window({
            id: 'ventanaElementosdelGasto',
            modal: true,
            height: 400,
            width: 300,
            closeAction: 'hide',
            maximized: true,
            constrain: true,
            closable: true,
            resizable: false,
            layout: 'fit',
            items: [this.pElementosGasto],
            buttons: [this.btnCancelarElementosdelGasto, this.btnAceptarElementosdelGasto],
            keys: [
                {
                    key: Ext.EventObject.ENTER,
                    stopEvent: true,
                    fn: function () {
                        self.btnAceptarElementosdelGasto.handler();
                    }
                }, {
                    key: 'x',
                    alt: true,
                    stopEvent: true,
                    fn: function () {
                        self.btnCancelarElementosdelGasto.handler();
                    }
                }
            ]
        });

        this.pConceptosContables = new Ext.Panel({
            id: 'idpConceptosContables',
            region: 'center',
            layout: 'border',
            items: [this.gpConceptosContables],
            tbar: [this.btnAdicionarConceptosContables, this.btnModificarConceptosContables, this.btnEliminarConceptosContables, ' ', ' ', ' ', ' ', ' ', ' ',
                ' ', ' ', ' ', ' ', this.btnElementosGasto, this.btnreplicar, ' ', ' ', ' ', ' ', ' ', ' ',
                ' ', ' ', ' ', ' ', this.tfbuscar, this.btnBuscar, '->', this.btnSync, this.btnSyncValoresContables,this.btnAyudaConceptosContables],
        });

        this.winMostrarConceptosContables = new Ext.Window({
            id: 'idwinMostrarConceptosContables',
            title: 'Configuraci&oacute;n de conceptos de contables',
            modal: false,
            width: '100%',
            height: 600,
            constrain: false,
            closeAction: 'hide',
            maximized: true,
            closable: true,
            //resizable: false,
            //layout: 'border',
            layout: 'fit',
            items: [this.pConceptosContables]
        });

        //Vista general de la interfaz.
        //new Ext.Viewport({
        //    id : 'view',
        //    layout : 'fit',
        //    items : []
        //
        //});
    }
};

//Inicializando la vista.
UCID.portal.cargarEtiquetas('configconceptoscontables', function (perfil, idioma) {
    perfil = arguments[0];
    idioma = arguments[1];

    //Inicializando el modelo.
    var modelo = Pvd.Nomina.Configuracion.ConceptosContables.Modelo;
    modelo.init();
    //Inicializando la vista.
    var vista = Pvd.Nomina.Configuracion.ConceptosContables.Vista;
    vista.init(perfil, idioma, modelo);
    //Inicializar controlador.
    Pvd.Nomina.Configuracion.ConceptosContables.Controlador.init(idioma, vista, modelo);
});