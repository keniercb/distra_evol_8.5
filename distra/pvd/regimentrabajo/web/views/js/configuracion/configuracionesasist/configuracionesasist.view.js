Ext.ns('Pvd.ControlAsistencia.Configuracionesasist');
//Vista del componente.
Pvd.ControlAsistencia.Configuracionesasist.Vista = {

    init: function (idioma, modelo) {
        var self = this;
        this.fecha = new Date();

        this.btnAyuda = new Ext.Button({
            id: 'btnAyuda',
            text: idioma.btnAyuda,
            iconCls: 'ayuda',
            disabled: false,
            tooltip: idioma.lbBtnAyuda
        });

        this.btnGuardarhorasextras = new Ext.Button({
            id: 'btnGuardar',
            text: idioma.lbBtnGuardar,
            tooltip: idioma.textToolTipGuardarlimites,
            iconCls: 'guardar'
        });

        this.btnGuardarhorario = new Ext.Button({
            id: 'btnGuardar',
            text: idioma.lbBtnGuardar,
            tooltip: idioma.textToolTipGuardarhorario,
            iconCls: 'guardar',
        });

        this.btnGuardarCA = new Ext.Button({
            id: 'btnGuardar',
            text: idioma.lbBtnGuardar,
            tooltip: idioma.textToolTipGuardarCA,
            iconCls: 'guardar'
        });

        this.btnSaveHabSession = new Ext.Button({
            id: 'btnSaveHabSession',
            text: idioma.lbBtnGuardar,
            tooltip: idioma.ttHabSesiones,
            iconCls: 'guardar'
        });

        this.btnGuardarCausa = new Ext.Button({
            id: 'btnGuardar',
            text: idioma.lbBtnGuardar,
            tooltip: idioma.textToolTipGuardarCausa,
            iconCls: 'guardar'
        });

        this.btnGuardarSubVac = new Ext.Button({
            id: 'btnGuardar',
            text: idioma.lbBtnGuardar,
            tooltip: idioma.textToolTipGuardarCausa,
            iconCls: 'guardar'
        });

        this.btnGuardarPagoMensual = new Ext.Button({
            id: 'btnGuardar',
            text: idioma.lbBtnGuardar,
            tooltip: idioma.textToolTipGuardarCausa,
            iconCls: 'guardar'
        });
        this.btnGuardarHorarioNoct = new Ext.Button({
            id: 'btnGuardar',
            text: idioma.lbBtnGuardar,
            tooltip: idioma.textToolTipGuardarCausa,
            iconCls: 'guardar'
        });

        this.btnGuardarCatMiltar = new Ext.Button({
            id: 'btnGuardar',
            text: idioma.lbBtnGuardar,
            tooltip: idioma.textToolTipGuardarCausa,
            iconCls: 'guardar'
        });

        this.btnGuardarCert = new Ext.Button({
            id: 'btnGuardar',
            text: idioma.lbBtnGuardar,
            tooltip: idioma.textToolTipGuardarCausa,
            iconCls: 'guardar'
        });

        this.btnGuardarGrupo = new Ext.Button({
            id: 'btnGuardar',
            text: idioma.lbBtnGuardar,
            tooltip: idioma.textToolTipGuardarCausa,
            iconCls: 'guardar'
        });

        this.btnGuardarDiasHoras = new Ext.Button({
            id: 'btnGuardar',
            text: idioma.lbBtnGuardar,
            tooltip: idioma.textToolTipGuardarCausa,
            iconCls: 'guardar'
        });

        this.btnGuardarCargos = new Ext.Button({
            id: 'btnGuardar',
            text: idioma.lbBtnGuardar,
            tooltip: idioma.textToolTipGuardarCausa,
            iconCls: 'guardar'
        });

        this.btnGuardarConceptoscausa = new Ext.Button({
            id: 'btnGuardar',
            text: idioma.lbBtnGuardar,
            tooltip: idioma.textToolTipGuardarCausa,
            iconCls: 'guardar'
        });
        this.btnGuardarConceptoscausaONEI = new Ext.Button({
            id: 'btnGuardar',
            text: idioma.lbBtnGuardar,
            tooltip: idioma.textToolTipGuardarCausa,
            iconCls: 'guardar'
        });
        this.btnGuardarMultiplesCausas = new Ext.Button({
            id: 'btnGuardar',
            text: idioma.lbBtnGuardar,
            tooltip: idioma.textToolTipGuardarCausa,
            iconCls: 'guardar'
        });

        this.tbarButtton1 = new Ext.Toolbar({
            width: 80,
            items: ['->', this.btnGuardarhorasextras]
        });

        this.tbarButtton2 = new Ext.Toolbar({
            width: 80,
            items: ['->', this.btnGuardarhorario]
        });

        this.tbarButtton3 = new Ext.Toolbar({
            width: 80,
            items: ['->', this.btnGuardarCA]
        });

        this.tbarButtton4 = new Ext.Toolbar({
            width: 80,
            items: ['->', this.btnSaveHabSession]
        });

        this.tbarButtton5 = new Ext.Toolbar({
            width: 80,
            items: ['->', this.btnGuardarCausa]
        });

        this.tbarButtton6 = new Ext.Toolbar({
            width: 80,
            items: ['->', this.btnGuardarSubVac]
        });

        this.tbarButtton7 = new Ext.Toolbar({
            width: 80,
            items: ['->', this.btnGuardarPagoMensual]
        });

        this.tbarButtton8 = new Ext.Toolbar({
            width: 80,
            items: ['->', this.btnGuardarHorarioNoct]
        });

        this.tbarButtton9 = new Ext.Toolbar({
            width: 80,
            items: ['->', this.btnGuardarCatMiltar]
        });

        this.tbarButtton10 = new Ext.Toolbar({
            width: 80,
            items: ['->', this.btnGuardarCert]
        });

        this.tbarButtton11 = new Ext.Toolbar({
            width: 80,
            items: ['->', this.btnGuardarGrupo]
        });

        this.tbarButtton12 = new Ext.Toolbar({
            width: 80,
            items: ['->', this.btnGuardarDiasHoras]
        });
        this.tbarButtton13 = new Ext.Toolbar({
            width: 80,
            items: ['->', this.btnGuardarCargos]
        });
        this.tbarButtton14 = new Ext.Toolbar({
            width: 80,
            items: ['->', this.btnGuardarConceptoscausa]
        });
        this.tbarButtton15 = new Ext.Toolbar({
            width: 80,
            items: ['->', this.btnGuardarConceptoscausaONEI]
        });
        this.tbarButtton16 = new Ext.Toolbar({
            width: 80,
            items: ['->', this.btnGuardarMultiplesCausas]
        });

        this.btnConexion = new Ext.Button({
            id: 'btnConexion',
            text: 'Comprobar conexión',
            tooltip: 'Comprobar conexión',
            iconCls: 'conexion'
        });

        this.horasextras = new Ext.FormPanel({
            title: 'Límites para horas extras',
            collapsible: true,
            labelAlign: 'top',
            height: 200,
            frame: true,
            reader: new Ext.data.JsonReader({
                root: 'datos'
            }, [
                {name: 'idlimitediario', mapping: 'idlimitediario', visible: false},
                {name: 'limitediario', mapping: 'limitediario'},
                {name: 'idlimitemensual', mapping: 'idlimitemensual', visible: false},
                {name: 'limitemensual', mapping: 'limitemensual'}
            ]),
            bodyStyle: 'padding:5px 5px 5px 5px',
            items: [
                {
                    layout: 'column',
                    items: [
                        {
                            width: 320,
                            layout: 'form',
                            items: [
                                {
                                    xtype: 'numberfield',
                                    id: 'limitediario',
                                    fieldLabel: 'Límite diario',
                                    name: 'limitediario',
                                    allowBlank: false,
                                    blankText: '',
                                    maxValue: 100,
                                    //minValue: 1,
                                    anchor: '80%'
                                },
                                {
                                    xtype: 'numberfield',
                                    id: 'limitemensual',
                                    fieldLabel: 'Límite mensual',
                                    name: 'limitemensual',
                                    allowBlank: false,
                                    blankText: '',
                                    maxValue: 100,
                                    //minValue: 1,
                                    anchor: '80%'
                                }
                            ]
                        },
                        {
                            columnWidth: .99,
                            layout: 'form',
                            html: idioma.Msghtmllimite
                        }
                    ]
                },
                this.tbarButtton1.setPosition(['90%', 0])
            ]
        });

        this.horasextras.load({url: 'getLimites'});

        this.estructuraHorario = new Ext.tree.TreePanel({
            change: false,
            hasChecked: false,
            autoScroll: true,
            region: 'center',
            split: true,
            margins: '2 2 2 0',
            layout: 'fit',
            height: 200,
            root: new Ext.tree.AsyncTreeNode({
                text: 'Estructura',
                id: 0
            }),
            loader: new Ext.tree.TreeLoader({
                dataUrl: 'getEstructurasHorario',
                uiProviders: {
                    'ui': Ext.tree.TreeNodeUICheckHideShow
                },
                listeners: {
                    'beforeload': function (atreeloader, anode) {
                        if (atreeloader.isLoading()) {
                            return false;
                        } else /*if (anode.attributes.idconcepto != 7) */{
                            atreeloader.baseParams.idestructura = anode.attributes.id;
                            atreeloader.baseParams.check = 1;
                        }
                    },
                    'load': function (atreeloader, anode) {
                        //if (anode.attributes.idconcepto != 7) {
                            atreeloader.baseParams.idestructura = anode.attributes.id;
                      //  }
                    }
                }
            })
        });

        this.horariotrabajo = new Ext.FormPanel({
            title: 'Configurar hora entrada/salida por defecto',
            labelAlign: 'top',
            collapsible: true,
            frame: true,
            reader: modelo.stHorario,
            bodyStyle: 'padding:5px 5px 5px 5px',
            items: [
                {
                    layout: 'column',
                    items: [
                        {
                            width: 320,
                            layout: 'form',
                            items: [
                                {
                                    xtype: 'fieldset',
                                    checkboxToggle: true,
                                    id: 'habilitado',
                                    name: 'habilitado',
                                    checkboxName: 'habilitado',
                                    title: 'Habilitar hora entrada/salida por defecto',
                                    autoHeight: true,
                                    width: 300,
                                    collapsed: true,
                                    defaultType: 'radio',
                                    items: this.estructuraHorario
                                }
                            ]
                        },
                        {
                            columnWidth: .99,
                            layout: 'form',
                            html: idioma.Msghtmlhorario
                        }
                    ]
                },
                this.tbarButtton2.setPosition(['90%', 0])
            ]

        });

        this.EstructuraPadre = new Ext.components.TreeComboBox({
            anchor:	'100%',
            allowBlank: false,
            fieldLabel: 'Estructura',
            id: 'EstructuraPadre',
            treeConfig: {
                rootVisible: false,
                loader: modelo.estructurapadre,
                border: false,
                autoScroll: true
            }
        });

        this.btnAdicionarTempus = new Ext.Button({
            id: 'btnAdd',
            text: '',
            tooltip: '',
            iconCls: 'adicionar'
        });

        //Boton para modificar.
        this.btnModificarTempus = new Ext.Button({
            id: 'btnUpd',
            text: '',
            tooltip: '',
            iconCls: 'modificar'
        });

        this.btnEliminarTempus = new Ext.Button({
            id: 'btnDel',
            text: '',
            tooltip: '',
            iconCls: 'eliminar'
        });

        //Listado
        this.listadoEstructuras = new Ext.grid.GridPanel({
            height: 200,
            store: modelo.store,
            border: false,
            loadMask: {msg: 'Cargando...'},
            columns: [
                {
                    header: 'idestructura',
                    width:100,
                    dataIndex: 'idestructura',
                    hidden:true
                },{
                    header: 'Estructura',
                    width:140,
                    dataIndex: 'denomestructura'
                },{
                    header: 'Dirección de la aplicación',
                    width:220,
                    dataIndex: 'dirapp'
                }
            ],
            tbar:[this.btnAdicionarTempus,this.btnModificarTempus,this.btnEliminarTempus]
        });

        this.EstructuraPadreReloj = new Ext.components.TreeComboBox({
            anchor:	'100%',
            allowBlank: false,
            fieldLabel: 'Estructura',
            id: 'EstructuraPadreReloj',
            treeConfig: {
                rootVisible: false,
                loader: modelo.estructurapadre,
                border: false,
                autoScroll: true
            }
        });

        this.btnAdicionarReloj = new Ext.Button({
            id: 'btnAdd',
            text: '',
            tooltip: '',
            iconCls: 'adicionar'
        });

        //Boton para modificar.
        this.btnModificarReloj = new Ext.Button({
            id: 'btnUpd',
            text: '',
            tooltip: '',
            iconCls: 'modificar'
        });

        this.btnEliminarReloj = new Ext.Button({
            id: 'btnDel',
            text: '',
            tooltip: '',
            iconCls: 'eliminar'
        });

        //Listado
        this.listadoEstructurasReloj = new Ext.grid.GridPanel({
            height: 200,
            store: modelo.storeReloj,
            border: false,
            loadMask: {msg: 'Cargando...'},
            columns: [
                {
                    header: 'idestructura',
                    width:100,
                    dataIndex: 'idestructura',
                    hidden:true
                },{
                    header: 'Estructura',
                    width:270,
                    dataIndex: 'denomestructura'
                }
            ],
            tbar:[this.btnAdicionarReloj,this.btnModificarReloj,this.btnEliminarReloj]
        });

        this.btnCancelarReloj = new Ext.Button({
            iconCls: 'cancelar',
            text: idioma.lbBtnCancelar,
            tooltip: idioma.lbBtnCanc,
        });

        this.btnAceptarReloj = new Ext.Button({
            iconCls: 'aceptar',
            text: idioma.lbBtnAceptar,
            tooltip: idioma.lbBtnAcep,
        });

        this.btnAplicarReloj = new Ext.Button({
            iconCls: 'aplicar',
            text: idioma.lbBtnAplicar,
            tooltip: idioma.lbBtnAplic,
        });

        this.dirserver = new Ext.form.TextField({
            id: 'dirserverer',
            fieldLabel: 'Dirección del servidor y Puerto',
            name: 'dirserverer',
            hiddenname:'dirserverer',
            minLength: 3,
            maxLength: 100,
            regexText: idioma.regexText,
            regex:/^(\d){1,3}\.(\d){1,3}\.(\d){1,3}\.(\d){1,3}:[0-9]{1,4}$/,
            allowBlank: false,
            emptyText: '',
            blankText: '',
            anchor: '98%'
        });

        this.nombredb = new Ext.form.TextField({
            id: 'nombredb',
            fieldLabel: 'Nombre de la Base de datos',
            name: 'nombredb',
            hiddenname:'nombredb',
            minLength: 3,
            maxLength: 100,
            regexText: idioma.regexText,
            allowBlank: false,
            emptyText: '',
            blankText: '',
            anchor: '98%'
        });

        this.usuario = new Ext.form.TextField({
            id: 'usuario',
            fieldLabel: 'Usuario',
            name: 'usuario',
            hiddenname:'usuario',
            minLength: 2,
            maxLength: 100,
            regexText: idioma.regexText,
            allowBlank: false,
            emptyText: '',
            blankText: '',
            anchor: '98%'
        });

        this.contrasena = new Ext.form.TextField({
            xtype: 'textfield',
            fieldLabel: 'Contraseña',
            inputType: 'password',
            minLength: 5,
            maxLength : 255,
            blankText: '',
            id: 'contrasena',
            labelStyle: 'width:150px',
            allowBlank: false,
            anchor: '98%'
        });

        this.btnConexionReloj = new Ext.Button({
            id: 'btnConexion',
            text: 'Comprobar conexión',
            tooltip: 'Comprobar conexión',
            iconCls: 'conexion'
        });

        this.formularioReloj = new Ext.FormPanel({
            labelAlign: 'top',
            frame:true,
            region: 'center',
            bodyStyle:'padding:5px 5px 0',
            items: [{
                layout: 'column',
                items: [
                    {
                        columnWidth: 1.0,
                        layout: 'form',
                        items: [this.EstructuraPadreReloj]
                    },
                    {
                        columnWidth: 0.5,
                        layout: 'form',
                        items: [this.dirserver]
                    },
                    {
                        columnWidth: 0.5,
                        layout: 'form',
                        items: [this.nombredb]
                    },
                    {
                        columnWidth: 0.5,
                        layout: 'form',
                        items: [this.usuario]
                    },
                    {
                        columnWidth: 0.5,
                        layout: 'form',
                        items: [this.contrasena]
                    },
                    {
                        columnWidth: 1.0,
                        layout: 'form',
                        items: [this.btnConexionReloj]
                    }]
            }]
        });

        this.ventanaReloj = new Ext.Window({
            modal: true,
            closeAction: 'hide',
            resizable: false,
            constrain: true,
            layout: 'fit',
            title: '',
            width: 400,
            height: 260,
            items: [this.formularioReloj],
            buttons: [
                this.btnCancelarReloj,
                this.btnAplicarReloj,
                this.btnAceptarReloj
            ]
        });

        this.btnAdicionarPtoAcc = new Ext.Button({
            id: 'btnAddPtoAcc',
            text: '',
            tooltip: '',
            iconCls: 'adicionar'
        });

        //Boton para modificar.
        this.btnModificarPtoAcc = new Ext.Button({
            id: 'btnUpdPtoAcc',
            text: '',
            tooltip: '',
            iconCls: 'modificar'
        });

        this.btnEliminarPtoAcc = new Ext.Button({
            id: 'btnDelPtoAcc',
            text: '',
            tooltip: '',
            iconCls: 'eliminar'
        });

        //Listado
        this.listadoPtoAcc = new Ext.grid.GridPanel({
            height: 170,
            store: modelo.storePtoAcc,
            border: false,
            loadMask: {msg: 'Cargando...'},
            columns: [
                {
                    header: 'Id punto de acceso',
                    width:105,
                    dataIndex: 'idpuntoacceso',
                },{
                    header: 'Denominación',
                    width:200,
                    dataIndex: 'denominacion'
                }
            ],
            tbar:[this.btnAdicionarPtoAcc,this.btnModificarPtoAcc,this.btnEliminarPtoAcc]
        });

        this.btnCancelarPtoAcc = new Ext.Button({
            iconCls: 'cancelar',
            text: idioma.lbBtnCancelar,
            tooltip: idioma.lbBtnCanc,
        });

        this.btnAceptarPtoAcc = new Ext.Button({
            iconCls: 'aceptar',
            text: idioma.lbBtnAceptar,
            tooltip: idioma.lbBtnAcep,
        });

        this.btnAplicarPtoAcc = new Ext.Button({
            iconCls: 'aplicar',
            text: idioma.lbBtnAplicar,
            tooltip: idioma.lbBtnAplic,
        });

        this.tfdenominacionPtoAcc = new Ext.form.TextField({
            id: 'denominacionPtoAcc',
            fieldLabel: 'Denominación',
            allowBlank : false,
            minLength: 3,
            maxLength: 100,
            enableKeyEvents: true,
            //regexText:idioma.lbRegexText,
            blankText:idioma.lbCampoVacio,
            width: '98%',
            name: 'denominacion',
            hiddenname: 'denominacion'
        });

        this.idPtoAcc = new Ext.form.NumberField({
            id: 'idPtoAcc',
            fieldLabel: 'Id punto de acceso',
            allowBlank: false,
            blankText:idioma.lbCampoVacio,
            enableKeyEvents: true,
            minLength: 1,
            maxLength:19,
            width: '98%',
            name: 'idpuntoacceso',
            hiddenname: 'idpuntoacceso'
        });

        //Formulario de gestion.
        this.formularioPtoAcc = new Ext.FormPanel({
            labelAlign: 'top',
            frame:true,
            bodyStyle:'padding:5px 5px 0',
            items: [{
                layout: 'column',
                items: [{
                    columnWidth:0.4,
                    layout: 'form',
                    items: [this.idPtoAcc]
                },{
                    columnWidth:0.6,
                    layout: 'form',
                    items: [this.tfdenominacionPtoAcc]
                }
                ]
            }]
        });

        this.ventanaPtoAcc = new Ext.Window({
            modal: true,
            closeAction: 'hide',
            resizable: false,
            constrain: true,
            layout: 'fit',
            title: '',
            width: 400,
            height: 150,
            items: [this.formularioPtoAcc],
            buttons: [
                this.btnCancelarPtoAcc,
                this.btnAplicarPtoAcc,
                this.btnAceptarPtoAcc
            ]
        });

        this.habcontrolacceso = new Ext.FormPanel({
            title: 'Habilitar Control de Acceso',
            labelAlign: 'top',
            collapsible: true,
            frame: true,
            reader: modelo.stHabCA,
            bodyStyle: 'padding:5px 5px 5px 5px',
            items: [
                {
                    layout: 'column',
                    items: [
                        {
                            width: 320,
                            layout: 'form',
                            items: [
                                {
                                    xtype: 'fieldset',
                                    checkboxToggle: true,
                                    id: 'habilitadoca',
                                    name: 'habilitadoca',
                                    checkboxName: 'habilitadoca',
                                    title: 'Control de acceso XETID (SACA)',
                                    autoHeight: true,
                                    width: 310,
                                    collapsed: true,
                                    defaultType: 'radio',
                                    items: [
                                        {
                                            boxLabel: 'Servicio Web',
                                            hideLabel: true,
                                            id: 'habilitadosw',
                                            name: 'habilitadosw'
                                        },
                                        {
                                            xtype: 'textfield',
                                            id: 'dirautenticacion',
                                            fieldLabel: 'Dirección del servicio de autenticación',
                                            name: 'dirautenticacion',
                                            regexText: idioma.regexText,
                                            allowBlank: false,
                                            blankText: '',
                                            disabled: true,
                                            anchor: '90%'
                                        },
                                        {
                                            xtype: 'textfield',
                                            id: 'dirdatos',
                                            fieldLabel: 'Dirección del servicio de datos',
                                            name: 'dirdatos',
                                            allowBlank: false,
                                            disabled: true,
                                            blankText: '',
                                            anchor: '90%'
                                        },
                                        {
                                            boxLabel: 'Base de datos',
                                            hideLabel: true,
                                            id: 'habilitadoabd',
                                            name: 'habilitadoabd'
                                        },
                                        {
                                            xtype: 'fieldset',
                                            id: 'listPtoAcc',
                                            name: 'listPtoAcc',
                                            autoHeight: true,
                                            width: 250,
                                            disabled: true,
                                            autoScroll:true,
                                            items: this.listadoPtoAcc
                                        }

                                    ],
                                    listeners: {
                                        collapse: function () {
                                            Ext.getCmp("dirautenticacion").setValue("");
                                            Ext.getCmp("dirautenticacion").allowBlank = true;
                                            Ext.getCmp("dirdatos").setValue("");
                                            Ext.getCmp("dirdatos").allowBlank = true;

                                            Ext.getCmp("dirautenticacion").disable();
                                            Ext.getCmp("dirdatos").disable();
                                            Ext.getCmp("habilitadosw").checked = false;
                                            Ext.getCmp("habilitadoabd").checked = false;
                                        },
                                        expand: function () {
                                            Ext.getCmp("dirautenticacion").allowBlank = false;
                                            Ext.getCmp("dirdatos").allowBlank = false;
                                        }
                                    }
                                },
                                {
                                    xtype: 'fieldset',
                                    checkboxToggle: true,
                                    id: 'habilitadotemp',
                                    name: 'habilitadotemp',
                                    checkboxName: 'habilitadotemp',
                                    title: 'Tempus',
                                    autoHeight: true,
                                    width: 310,
                                    collapsed: true,
                                    defaultType: 'radio',
                                    autoScroll:true,
                                    items: this.listadoEstructuras                                },
                                {
                                    xtype: 'fieldset',
                                    checkboxToggle: true,
                                    id: 'habilitadoreloj',
                                    name: 'habilitadoreloj',
                                    checkboxName: 'habilitadoreloj',
                                    title: 'Reloj ANVIZ Modelo W1',
                                    autoHeight: true,
                                    width: 310,
                                    collapsed: true,
                                    defaultType: 'radio',
                                    autoScroll:true,
                                    items: this.listadoEstructurasReloj                                }
                            ]
                        },
                        {
                            columnWidth: 1,
                            layout: 'form',
                            html: perfil.etiquetas.MsghtmlhabCA
                        },
                        {
                            columnWidth: 1,
                            layout: 'form',
                            html: perfil.etiquetas.MsghtmlhabTemp
                        },
                        {
                            columnWidth: 1,
                            layout: 'form',
                            html: perfil.etiquetas.MsghtmlhabReloj
                        }
                    ]
                },
                this.tbarButtton3.setPosition(['90%', -10])
            ]
        });

        this.btnCancelar = new Ext.Button({
            iconCls: 'cancelar',
            text: idioma.lbBtnCancelar,
            tooltip: idioma.lbBtnCanc,
        });

        this.btnAceptar = new Ext.Button({
            iconCls: 'aceptar',
            text: idioma.lbBtnAceptar,
            tooltip: idioma.lbBtnAcep,
        });

        this.btnAplicar = new Ext.Button({
            iconCls: 'aplicar',
            text: idioma.lbBtnAplicar,
            tooltip: idioma.lbBtnAplic,
        });

        this.dirapp = new Ext.form.TextField({
            id: 'dirapp',
            fieldLabel: 'Dirección de la aplicación',
            name: 'dirapp',
            hiddenname:'dirapp',
            minLength: 3,
            maxLength: 100,
            regexText: idioma.regexTextTempus,
            regex:/((http|https)(:\/\/))?([a-zA-Z0-9]+[.]{1}){2}[a-zA-z0-9]+(\/{1}[a-zA-Z0-9]+)*\/?/,
            allowBlank: false,
            emptyText: 'http://10.0.0.0:5555/BTARJET.DBF',
            blankText: '',
            anchor: '100%'
        });

        this.formulario = new Ext.FormPanel({
            labelAlign: 'top',
            frame:true,
            region: 'center',
            bodyStyle:'padding:5px 5px 0',
            items: [{
                layout: 'column',
                items: [
                    {
                        columnWidth: 1.0,
                        layout: 'form',
                        items: [this.EstructuraPadre]
                    },
                    {
                        columnWidth: 1.0,
                        layout: 'form',
                        items: [this.dirapp]
                    },
                    {
                        columnWidth: 1.0,
                        layout: 'form',
                        items: [this.btnConexion]
                    }]
            }]
        });

        this.ventana = new Ext.Window({
            modal: true,
            closeAction: 'hide',
            resizable: false,
            constrain: true,
            layout: 'fit',
            title: '',
            width: 400,
            height: 220,
            items: [this.formulario],
            buttons: [
                this.btnCancelar,
                this.btnAplicar,
                this.btnAceptar
            ]
        });

        this.habilitarSesiones = new Ext.FormPanel({
            title: idioma.THabSesiones,//'Configurar hora entrada/salida por defecto',
            labelAlign: 'top',
            collapsible: true,
            height: 150,
            frame: true,
            reader: modelo.stHabSesiones,
            bodyStyle: 'padding:5px 5px 5px 5px',
            items: [
                {
                    layout: 'column',
                    items: [
                        {
                            width: 320,
                            layout: 'form',
                            items: [
                                {
                                    xtype: 'checkbox',
                                    boxLabel: idioma.cbHabSesiones,//'Habilitar hora entrada/salida por defecto',
                                    hideLabel: true,
                                    id: 'habsesion',
                                    name: 'habsesion'
                                }
                            ]
                        },
                        {
                            columnWidth: .99,
                            layout: 'form',
                            html: idioma.TxtHabSesiones
                        }
                    ]
                },
                this.tbarButtton4.setPosition(['90%', 0])
            ]
        });

        this.habcausa = new Ext.FormPanel({
            title: 'Habilitar causa por defecto',
            labelAlign: 'top',
            collapsible: true,
            height: 210,
            frame: true,
            reader: modelo.stHabCausa,
            bodyStyle: 'padding:5px 5px 5px 5px',
            items: [
                {
                    layout: 'column',
                    items: [
                        {
                            width: 320,
                            layout: 'form',
                            items: [
                                {
                                    xtype: 'checkbox',
                                    boxLabel: 'Ausente',
                                    hideLabel: true,
                                    id: 'ausencia',
                                    name: 'ausencia'
                                },
                                {
                                    xtype: 'checkbox',
                                    boxLabel: 'Llegada Tarde',
                                    hideLabel: true,
                                    id: 'tarde',
                                    name: 'tarde'
                                },
                                {
                                    xtype: 'checkbox',
                                    boxLabel: 'Salida Anticipada',
                                    hideLabel: true,
                                    id: 'salidaantes',
                                    name: 'salidaantes'
                                }, {
                                    xtype: 'checkbox',
                                    boxLabel: 'Llegada Tarde/Salida Anticipada',
                                    hideLabel: true,
                                    id: 'tardesalidaantes',
                                    name: 'tardesalidaantes'
                                }
                            ]
                        },
                        {
                            columnWidth: .99,
                            layout: 'form',
                            html: idioma.Msghtmlcausapordefecto
                        }
                    ]
                },
                this.tbarButtton5.setPosition(['90%', 0])
            ]
        });

        this.habSubmayorVac = new Ext.FormPanel({
            title: idioma.THabSubVac,//'Configurar hora entrada/salida por defecto',
            labelAlign: 'top',
            collapsible: true,
            height: 150,
            frame: true,
            reader: modelo.stHabSubVac,
            bodyStyle: 'padding:5px 5px 5px 5px',
            items: [
                {
                    layout: 'column',
                    items: [
                        {
                            width: 320,
                            layout: 'form',
                            items: [
                                {
                                    xtype: 'checkbox',
                                    boxLabel: idioma.cbHabSubVac,//'Habilitar hora entrada/salida por defecto',
                                    hideLabel: true,
                                    id: 'habilitadosubvac',
                                    name: 'habilitadosubvac'
                                }
                            ]
                        },
                        {
                            columnWidth: .99,
                            layout: 'form',
                            html: idioma.TxtHabSubVac
                        }
                    ]
                },
                this.tbarButtton6.setPosition(['90%', 0])
            ]
        });

        this.habpagomensual = new Ext.FormPanel({
            title: 'Configurar asistencia mensual',
            labelAlign: 'top',
            collapsible: true,
            height: 150,
            frame: true,
            reader: modelo.stHabPagoMensual,
            bodyStyle: 'padding:5px 5px 5px 5px',
            items: [
                {
                    layout: 'column',
                    items: [
                        {
                            width: 320,
                            layout: 'form',
                            items: [
                                {
                                    xtype: 'checkbox',
                                    boxLabel: 'Habilitar asistencia mensual',
                                    hideLabel: true,
                                    id: 'habilitadopagomensual',
                                    name: 'habilitadopagomensual'
                                }
                            ]
                        },
                        {
                            columnWidth: .99,
                            layout: 'form',
                            html: idioma.TxtHabPagoMens
                        }
                    ]
                },
                this.tbarButtton7.setPosition(['90%', 0])
            ]
        });

        this.btnAdicionarNoct = new Ext.Button({
            id: 'btnAddNoct',
            text: '',
            tooltip: '',
            iconCls: 'adicionar'
        });

        //Boton para modificar.
        this.btnModificarNoct = new Ext.Button({
            id: 'btnUpdNoct',
            text: '',
            tooltip: '',
            iconCls: 'modificar'
        });

        this.btnEliminarNoct = new Ext.Button({
            id: 'btnDelNoct',
            text: '',
            tooltip: '',
            iconCls: 'eliminar'
        });

        //Listado
        this.listadoNocturnidad = new Ext.grid.GridPanel({
            height: 170,
            store: modelo.storeNoct,
            border: false,
            loadMask: {msg: 'Cargando...'},
            columns: [
                {
                    header: 'idhorarionocturnidad',
                    width:100,
                    dataIndex: 'idhorarionocturnidad',
                    hidden:true
                },{
                    header: 'Horario nocturnidad',
                    width:120,
                    dataIndex: 'denominacion'
                },{
                    header: 'Hora inicio',
                    width:80,
                    dataIndex: 'horainicio'
                },{
                    header: 'Hora fin',
                    width:80,
                    dataIndex: 'horafin'
                }
            ],
            tbar:[this.btnAdicionarNoct,this.btnModificarNoct,this.btnEliminarNoct]
        });

        this.habHorarioNoct = new Ext.FormPanel({
            title: 'Horario de nocturnidad',
            labelAlign: 'top',
            collapsible: true,
            height: 280,
            frame: true,
            reader: modelo.storeNoct,
            bodyStyle: 'padding:5px 5px 5px 5px',
            items: [
                {
                    layout: 'column',
                    items: [
                        {
                            width: 320,
                            layout: 'form',
                            items: [
                                {
                                    xtype: 'fieldset',
                                    id: 'listnoct',
                                    name: 'listnoct',
                                    autoHeight: true,
                                    width: 310,
                                    autoScroll:true,
                                    items: this.listadoNocturnidad
                                }
                            ]
                        },
                        {
                            columnWidth: .99,
                            layout: 'form',
                            html: idioma.TxtHabNoct
                        }
                    ]
                },
                this.tbarButtton8.setPosition(['90%', 0])
            ]
        });

        this.btnCancelarNoct = new Ext.Button({
            iconCls: 'cancelar',
            text: idioma.lbBtnCancelar,
            tooltip: idioma.lbBtnCanc,
        });

        this.btnAceptarNoct = new Ext.Button({
            iconCls: 'aceptar',
            text: idioma.lbBtnAceptar,
            tooltip: idioma.lbBtnAcep,
        });

        this.btnAplicarNoct = new Ext.Button({
            iconCls: 'aplicar',
            text: idioma.lbBtnAplicar,
            tooltip: idioma.lbBtnAplic,
        });

        this.tfdenominacionNoct = new Ext.form.TextField({
            id: 'denominacionNoct',
            fieldLabel: 'Denominación',
            allowBlank : false,
            minLength: 3,
            maxLength: 100,
            enableKeyEvents: true,
            //regexText:idioma.lbRegexText,
            blankText:idioma.lbCampoVacio,
            width: '98%',
            name: 'denominacion',
            hiddenname: 'denominacion'
        });

        this.cbhoraInicioNoct = new Ext.form.TimeField({
            id: 'cbhoraInicio',
            anchor: '97%',
            fieldLabel  : 'Hora inicio',
            name: 'horainicio',
            hiddenname:'horainicio',
            emptyText: 'Seleccione...',
            format: 'H:i',
            minValue: '00:00',
            maxValue: '23:59',
            enableKeyEvents: true,
            //value:'08:00',
            invalidText: 'El formato de la hora es hora:minutos (24 horas)',
            allowBlank : false,
            blankText: idioma.lbCampoVacio
        });

        this.cbhoraFinNoct = new Ext.form.TimeField({
            id: 'cbhoraFin',
            anchor: '97%',
            name: 'horafin',
            hiddenname:'horafin',
            fieldLabel  : 'Hora fin',
            emptyText: 'Seleccione...',
            format: 'H:i',
            minValue: '00:00',
            enableKeyEvents: true,
            maxValue: '23:59',
            //value:'17:00',
            invalidText: 'El formato de la hora es hora:minutos (24 horas)',
            allowBlank : false,
            blankText: idioma.lbCampoVacio
        });

        //Formulario de gestion.
        this.formularioNoct = new Ext.FormPanel({
            labelAlign: 'top',
            frame:true,
            bodyStyle:'padding:5px 5px 0',
            items: [{
                layout: 'column',
                items: [{
                    columnWidth:1.0,
                    layout: 'form',
                    items: [this.tfdenominacionNoct]
                },
                   {
                        columnWidth:.5,
                        layout: 'form',
                        items: [this.cbhoraInicioNoct]
                    },
                    {
                        columnWidth:.5,
                        layout: 'form',
                        items: [this.cbhoraFinNoct]
                    }
                ]
            }]
        });

        this.ventanaNoct = new Ext.Window({
            modal: true,
            closeAction: 'hide',
            resizable: false,
            constrain: true,
            layout: 'fit',
            title: '',
            width: 400,
            height: 200,
            items: [this.formularioNoct],
            buttons: [
                this.btnCancelarNoct,
                this.btnAplicarNoct,
                this.btnAceptarNoct
            ]
        });

        this.smgridCategoria = new Ext.grid.CheckboxSelectionModel({
            singleSelect:true,
            listeners: {
            }
        });

        //Listado
        this.listadoCategoria = new Ext.grid.GridPanel({
            height: 170,
            store: modelo.storeCategoria,
            border: false,
            sm: this.smgridCategoria,
            loadMask: {msg: 'Cargando...'},
            columns: [this.smgridCategoria,
                {
                    header: 'idcategoria',
                    width:100,
                    dataIndex: 'idcategoria',
                    hidden:true
                },{
                    header: 'Categorías',
                    width:250,
                    dataIndex: 'denominacion'
                },{
                    header: 'fondodetiempo',
                    width:100,
                    dataIndex: 'fondodetiempo',
                    hidden:true
                }
            ]
        });

        this.smgridCausas = new Ext.grid.CheckboxSelectionModel({
            singleSelect:false,
            listeners: {

            }
        });
        //Listado
        this.listadoCausas = new Ext.grid.GridPanel({
            height: 170,
            store: modelo.storeCausas,
            border: false,
            sm: this.smgridCausas,
            loadMask: {msg: 'Cargando...'},
            columns: [this.smgridCausas,
                {
                    header: 'idcausa',
                    width:100,
                    dataIndex: 'idcausa',
                    hidden:true
                },{
                    header: 'Causas',
                    width:250,
                    dataIndex: 'denominacion'
                },{
                    header: 'idcategoria',
                    width:100,
                    dataIndex: 'idcategoria',
                    hidden:true
                },{
                    header: 'check',
                    width:100,
                    dataIndex: 'check',
                    hidden:true
                }
            ]
        });


        this.habCategMilit = new Ext.FormPanel({
            title: 'Configurar causas de ausencia por categoría',
            labelAlign: 'top',
            collapsible: true,
            height: 350,
            frame: true,
            reader: modelo.storeCategoria,
            bodyStyle: 'padding:5px 5px 5px 5px',
            items: [
                {
                    layout: 'column',
                    items: [
                        {
                            width: 320,
                            layout: 'form',
                            items: [
                                {
                                    xtype: 'fieldset',
                                    id: 'listcategoria',
                                    name: 'listcategoria',
                                    autoHeight: true,
                                    width: 310,
                                    autoScroll:true,
                                    items: this.listadoCategoria
                                },{
                                    xtype: 'numberfield',
                                    id: 'fondotiempo',
                                    fieldLabel: 'Total de días a pagar',
                                    name: 'fondotiempo',
                                    allowBlank: false,
                                    blankText: '',
                                    minValue: 1,
                                    maxValue: 31,
                                    anchor: '80%'
                                }
                            ]
                        },
                        {
                            width: 320,
                            layout: 'form',
                            items: [
                                {
                                    xtype: 'fieldset',
                                    id: 'listcausas',
                                    name: 'listcausas',
                                    autoHeight: true,
                                    width: 310,
                                    autoScroll:true,
                                    items: this.listadoCausas
                                }
                            ]
                        },
                        {
                            columnWidth: .99,
                            layout: 'form',
                            html: idioma.TxtHabCategMilit
                        }
                    ]
                },
                this.tbarButtton9.setPosition(['90%', 0])
            ]
        });

        this.smgridCausasCert = new Ext.grid.CheckboxSelectionModel({
            singleSelect:false,
            listeners: {

            }
        });
        //Listado
        this.listadoCausasCert = new Ext.grid.GridPanel({
            height: 170,
            store: modelo.storeCausasCert,
            border: false,
            sm: this.smgridCausasCert,
            loadMask: {msg: 'Cargando...'},
            columns: [this.smgridCausasCert,
                {
                    header: 'idcausa',
                    width:100,
                    dataIndex: 'idcausa',
                    hidden:true
                },{
                    header: 'Causas',
                    width:250,
                    dataIndex: 'denominacion'
                },{
                    header: 'check',
                    width:100,
                    dataIndex: 'check',
                    hidden:true
                }
            ]
        });


        this.habCertificados = new Ext.FormPanel({
            title: 'Configurar certificados continuados',
            labelAlign: 'top',
            collapsible: true,
            height: 300,
            frame: true,
            reader: modelo.storeCausasCert,
            bodyStyle: 'padding:5px 5px 5px 5px',
            items: [
                {
                    layout: 'column',
                    items: [
                        {
                            width: 380,
                            layout: 'form',
                            items: [
                                {
                                    xtype: 'fieldset',
                                    id: 'listcausas',
                                    name: 'listcausas',
                                    autoHeight: true,
                                    width: 310,
                                    autoScroll:true,
                                    items: this.listadoCausasCert
                                }
                            ]
                        },
                        {
                            columnWidth: .99,
                            layout: 'form',
                            html: idioma.TxtHabcert
                        }
                    ]
                },
                this.tbarButtton10.setPosition(['90%', 0])
            ]
        });

        this.smgridGrupo = new Ext.grid.CheckboxSelectionModel({
            singleSelect:false,
            listeners: {

            }
        });
        //Listado
        this.listadoGrupo = new Ext.grid.GridPanel({
            height: 170,
            store: modelo.storeGrupo,
            border: false,
            id:'gridGruposRegimen',
            sm: this.smgridGrupo,
            view: new Ext.grid.GroupingView({
                forceFit:true,
                groupTextTpl: '{group}'
            }),
            loadMask: {msg: 'Cargando...'},
            columns: [this.smgridGrupo,
                {
                    header: 'idgrupodescanso',
                    width:100,
                    dataIndex: 'idgrupodescanso',
                    hidden:true
                },{
                    header: 'Grupos',
                    width:250,
                    dataIndex: 'denominacion'
                },{
                    header: 'check',
                    width:100, dataIndex: 'check',
                    hidden:true
                },{ header: "idregimentrabajo", hidden:true,width: 150, menuDisabled:true, dataIndex: 'idregimentrabajo'},
                { header: "R&eacute;gimen de trabajo: ",  hidden:true, width: 300, menuDisabled:true, dataIndex: 'denregimentrabajo'},
            ]
        });

        this.smgridUsuarios = new Ext.grid.CheckboxSelectionModel({
            singleSelect:false,
            listeners: {

            }
        });
        //Listado
        this.listadoUsuarios = new Ext.grid.GridPanel({
            height: 170,
            store: modelo.storeUsuarios,
            border: false,
            id:'gridUsuarios',
            sm: this.smgridUsuarios,
            view: new Ext.grid.GroupingView({
                forceFit:true,
                groupTextTpl: '{group}'
            }),
            loadMask: {msg: 'Cargando...'},
            columns: [this.smgridUsuarios,
                {
                    header: 'idusuario',
                    width:100,
                    dataIndex: 'idusuario',
                    hidden:true
                },{
                    header: 'Usuarios',
                    width:250,
                    dataIndex: 'usuario'
                },{
                    header: 'check',
                    width:100, dataIndex: 'check',
                    hidden:true
                }
            ]
        });


        this.habGrupo = new Ext.FormPanel({
            title: 'Configurar Grupos',
            labelAlign: 'top',
            collapsible: true,
            height: 300,
            frame: true,
            reader: modelo.storeGrupo,
            bodyStyle: 'padding:5px 5px 5px 5px',
            items: [
                {
                    layout: 'column',
                    items: [
                        {
                            width: 320,
                            layout: 'form',
                            items: [
                                {
                                    xtype: 'fieldset',
                                    id: 'listcausas',
                                    name: 'listcausas',
                                    autoHeight: true,
                                    width: 310,
                                    autoScroll:true,
                                    items: this.listadoGrupo
                                }
                            ]
                        },
                        {
                            width: 320,
                            layout: 'form',
                            items: [
                                {
                                    xtype: 'fieldset',
                                    id: 'listusuarios',
                                    name: 'listusuarios',
                                    autoHeight: true,
                                    width: 310,
                                    autoScroll:true,
                                    items: this.listadoUsuarios
                                }
                            ]
                        },
                        {
                            columnWidth: .99,
                            layout: 'form',
                            html: idioma.TxtHabgrupo
                        }
                    ]
                },
                this.tbarButtton11.setPosition(['90%', 0])
            ]
        });

        this.combodiashoras = new Ext.form.ComboBox({
            id:'idhorasdias',
            store: modelo.stDiashoras,
            displayField:'horasdias',
            valueField:'id',
            typeAhead: true,
            fieldLabel: 'Horas/Días',
            mode: 'local',
            anchor: '80%',
            forceSelection: true,
            triggerAction: 'all',
            emptyText:'Seleccione...',
            value:1
        });

        this.diashoras = new Ext.FormPanel({
            title: 'Configuración horas/días',
            collapsible: true,
            labelAlign: 'top',
            height: 200,
            frame: true,
            reader: new Ext.data.JsonReader({
                root: 'datos'
            }, [
                {name: 'id', mapping: 'id', visible: false},
                {name: 'horasdias', mapping: 'horasdias'}
            ]),
            bodyStyle: 'padding:5px 5px 5px 5px',
            items: [
                {
                    layout: 'column',
                    items: [
                        {
                            width: 320,
                            layout: 'form',
                            items: [this.combodiashoras]
                        },
                        {
                            columnWidth: .99,
                            layout: 'form',
                            html: idioma.Msghtmldiashoras
                        }
                    ]
                },
                this.tbarButtton12.setPosition(['90%', 0])
            ]
        });

        this.estructuraNofirmar = new Ext.tree.TreePanel({
            change: false,
            hasChecked: false,
            autoScroll: true,
            region: 'center',
            split: true,
            margins: '2 2 2 0',
            //checker: [7],
            layout: 'fit',
            height: 200,
            root: new Ext.tree.AsyncTreeNode({
                text: 'Estructura',
                id: 0
            }),
            loader: new Ext.tree.TreeLoader({
                dataUrl: 'getCargosNofirman',
                uiProviders: {
                    'ui': Ext.tree.TreeNodeUICheckHideShow
                },
                listeners: {
                    'beforeload': function (atreeloader, anode) {
                        if (atreeloader.isLoading()) {
                            return false;
                        } else/* if (anode.attributes.idconcepto != 7)*/ {
                            atreeloader.baseParams.idestructura = anode.attributes.id;
                            atreeloader.baseParams.check = 1;
                        }
                    },
                    'load': function (atreeloader, anode) {
                       // if (anode.attributes.idconcepto != 7) {
                            atreeloader.baseParams.idestructura = anode.attributes.id;
                       // }
                    }
                }
            })
        });

        this.cargosnofirman = new Ext.FormPanel({
            title: 'Configurar cargos que no firman desde Control de acceso',
            labelAlign: 'top',
            collapsible: true,
            frame: true,
            reader: modelo.stNofirman,
            bodyStyle: 'padding:5px 5px 5px 5px',
            items: [
                {
                    layout: 'column',
                    items: [
                        {
                            width: 320,
                            layout: 'form',
                            items: [
                                {
                                    xtype: 'fieldset',
                                    checkboxToggle: true,
                                    id: 'habilitadonofirma',
                                    name: 'habilitadonofirma',
                                    checkboxName: 'habilitadonofirma',
                                    title: 'Habilitar cargos que no firman',
                                    autoHeight: true,
                                    width: 300,
                                    collapsed: true,
                                    defaultType: 'radio',
                                    items: this.estructuraNofirmar
                                }
                            ]
                        },
                        {
                            columnWidth: .99,
                            layout: 'form',
                            html: idioma.Msghtmlcargosnofirman
                        }
                    ]
                },
                this.tbarButtton13.setPosition(['90%', 0])
            ]

        });

        this.diashoras.load({url: 'getHorasDias'});


        this.smgridConceptos = new Ext.grid.CheckboxSelectionModel({
            singleSelect:true,
            listeners: {
            }
        });

        //Listado
        this.listadoConceptos = new Ext.grid.GridPanel({
            height: 170,
            store: modelo.storeConceptos,
            border: false,
            sm: this.smgridConceptos,
            loadMask: {msg: 'Cargando...'},
            columns: [this.smgridConceptos,
                {
                    header: 'idconcepto',
                    width:100,
                    dataIndex: 'idconcepto',
                    hidden:true
                },{
                    header: 'Concepto',
                    width:250,
                    dataIndex: 'concepto'
                }
            ]
        });

        this.smgridCausasRep = new Ext.grid.CheckboxSelectionModel({
            singleSelect:false,
            listeners: {

            }
        });
        //Listado
        this.listadoCausasRep = new Ext.grid.GridPanel({
            height: 170,
            store: modelo.storeCausasRep,
            border: false,
            sm: this.smgridCausasRep,
            loadMask: {msg: 'Cargando...'},
            columns: [this.smgridCausasRep,
                {
                    header: 'idcausa',
                    width:100,
                    dataIndex: 'idcausa',
                    hidden:true
                },{
                    header: 'Causas',
                    width:250,
                    dataIndex: 'denominacion'
                },{
                    header: 'idconcepto',
                    width:100,
                    dataIndex: 'idconcepto',
                    hidden:true
                },{
                    header: 'check',
                    width:100,
                    dataIndex: 'check',
                    hidden:true
                }
            ]
        });


        this.habConceptocausas = new Ext.FormPanel({
            title: 'Configurar causas de ausencia por concepto',
            labelAlign: 'top',
            collapsible: true,
            height: 350,
            frame: true,
            reader: modelo.storeConcepto,
            bodyStyle: 'padding:5px 5px 5px 5px',
            items: [
                {
                    layout: 'column',
                    items: [
                        {
                            width: 320,
                            layout: 'form',
                            items: [
                                {
                                    xtype: 'fieldset',
                                    id: 'listconceptos',
                                    name: 'listconceptos',
                                    autoHeight: true,
                                    width: 310,
                                    autoScroll:true,
                                    items: this.listadoConceptos
                                }
                            ]
                        },
                        {
                            width: 320,
                            layout: 'form',
                            items: [
                                {
                                    xtype: 'fieldset',
                                    id: 'listcausas',
                                    name: 'listcausas',
                                    autoHeight: true,
                                    width: 310,
                                    autoScroll:true,
                                    items: this.listadoCausasRep
                                }
                            ]
                        },
                        {
                            columnWidth: .99,
                            layout: 'form',
                            html: idioma.TxthabConceptocausas
                        }
                    ]
                },
                this.tbarButtton14.setPosition(['90%', 0])
            ]
        });


        this.btnAdicion = new Ext.Button({
            id: 'btnAdd',
            text: 'Adición',
            tooltip: '',
            iconCls: 'adicionar'
        });
        this.btnDeducion = new Ext.Button({
            id: 'btnDel',
            text: 'Dedución',
            tooltip: '',
            iconCls: 'eliminar'
        });
        function ActivarColores(val, metaData, record, rowIndex, colIndex, store) {
            if(val == 'Adición'){
                return '<span style="color:green">' + val + '</span>';
            }else
            {
                return '<span style="color:red">' + val + '</span>';
            }

        }
        this.smgridCausasPromTrab = new Ext.grid.CheckboxSelectionModel({
            singleSelect:false,
            listeners: {

            }
        });
        //Listado
        this.listadoCausasPromTrab = new Ext.grid.GridPanel({
            height: 170,
            store: modelo.storeCausasPromTrab,
            border: false,
            sm: this.smgridCausasPromTrab,
            id: 'listadocausasPromTrab',
            loadMask: {msg: 'Cargando...'},
            columns: [this.smgridCausasPromTrab,
                {
                    header: 'idcausa',
                    width:100,
                    dataIndex: 'idcausa',
                    hidden:true
                },{
                    header: 'Causas',
                    width:200,
                    dataIndex: 'denominacion'
                },{
                    header: 'Adición/Dedución',
                    width:100,
                    dataIndex: 'adiciondeducion',
                    renderer: ActivarColores
                }
            ],
            tbar:[this.btnAdicion, this.btnDeducion]
        });


        this.habCausasPromTrab = new Ext.FormPanel({
            title: 'Configurar causas (Adiciones/Deduciones)',
            labelAlign: 'top',
            collapsible: true,
            height: 300,
            frame: true,
            reader: modelo.storeCausasPromTrab,
            bodyStyle: 'padding:5px 5px 5px 5px',
            items: [
                {
                    layout: 'column',
                    items: [
                        {
                            width: 380,
                            layout: 'form',
                            items: [
                                {
                                    xtype: 'fieldset',
                                    id: 'listcausasPromTrab',
                                    name: 'listcausasPromTrab',
                                    autoHeight: true,
                                    width: 360,
                                    autoScroll:true,
                                    items: this.listadoCausasPromTrab
                                }
                            ]
                        },
                        {
                            columnWidth: .99,
                            layout: 'form',
                            html: idioma.TxthabCausasPromTrab
                        }
                    ]
                }
            ]
        });


        this.btnAdicionarConcept = new Ext.Button({
            id: 'btnAddConcept',
            text: '',
            tooltip: '',
            iconCls: 'adicionar'
        });

        //Boton para modificar.
        this.btnModificarConcept = new Ext.Button({
            id: 'btnUpdConcept',
            text: '',
            tooltip: '',
            iconCls: 'modificar'
        });

        this.btnEliminarConcept = new Ext.Button({
            id: 'btnDelConcept',
            text: '',
            tooltip: '',
            iconCls: 'eliminar'
        });

        this.smgridConceptosONEI = new Ext.grid.CheckboxSelectionModel({
            singleSelect:true,
            listeners: {
            }
        });

        //Listado
        this.listadoConceptosONEI = new Ext.grid.GridPanel({
            height: 170,
            store: modelo.storeConceptosONEI,
            border: false,
            sm: this.smgridConceptosONEI,
            loadMask: {msg: 'Cargando...'},
            columns: [//this.smgridConceptosONEI,
                {
                    header: 'idconcepto',
                    width:100,
                    dataIndex: 'idconcepto',
                    hidden:true
                },{
                    header: 'Orden',
                    width:50,
                    dataIndex: 'orden'
                },{
                    header: 'Concepto',
                    width:220,
                    dataIndex: 'denominacion'
                }
            ],
            tbar:[this.btnAdicionarConcept,this.btnModificarConcept,this.btnEliminarConcept]
        });

        this.orden = new Ext.form.NumberField({
            id: 'orden',
            fieldLabel: 'Orden',
            allowBlank: false,
            blankText:idioma.lbCampoVacio,
            enableKeyEvents: true,
            minLength: 1,
            maxLength:19,
            width: '90%',
            name: 'orden',
            hiddenname: 'orden'
        });

        this.tfdenominacionConcept = new Ext.form.TextField({
            id: 'denominacionConcept',
            fieldLabel: 'Denominación',
            allowBlank : false,
            minLength: 3,
            maxLength: 100,
            enableKeyEvents: true,
            //regexText:idioma.lbRegexText,
            blankText:idioma.lbCampoVacio,
            width: '90%',
            name: 'denominacion',
            hiddenname: 'denominacion'
        });

        this.formularioConcept = new Ext.FormPanel({
            labelAlign: 'top',
            frame:true,
            bodyStyle:'padding:5px 5px 0',
            items: [{
                layout: 'column',
                items: [{
                    columnWidth:0.4,
                    layout: 'form',
                    items: [this.orden]
                },{
                    columnWidth:0.6,
                    layout: 'form',
                    items: [this.tfdenominacionConcept]
                }
                ]
            }]
        });

        this.btnCancelarConcept = new Ext.Button({
            iconCls: 'cancelar',
            text: idioma.lbBtnCancelar,
            tooltip: idioma.lbBtnCanc,
        });

        this.btnAceptarConcept = new Ext.Button({
            iconCls: 'aceptar',
            text: idioma.lbBtnAceptar,
            tooltip: idioma.lbBtnAcep,
        });

        this.btnAplicarConcept = new Ext.Button({
            iconCls: 'aplicar',
            text: idioma.lbBtnAplicar,
            tooltip: idioma.lbBtnAplic,
        });

        this.ventanaConcept = new Ext.Window({
            modal: true,
            closeAction: 'hide',
            resizable: false,
            constrain: true,
            layout: 'fit',
            title: '',
            width: 400,
            height: 150,
            items: [this.formularioConcept],
            buttons: [
                this.btnCancelarConcept,
                this.btnAplicarConcept,
                this.btnAceptarConcept
            ]
        });

        this.smgridCausasONEI = new Ext.grid.CheckboxSelectionModel({
            singleSelect:false,
            listeners: {

            }
        });
        //Listado
        this.listadoCausasONEI = new Ext.grid.GridPanel({
            height: 170,
            store: modelo.storeCausasONEI,
            border: false,
            sm: this.smgridCausasONEI,
            loadMask: {msg: 'Cargando...'},
            columns: [this.smgridCausasONEI,
                {
                    header: 'idcausa',
                    width:150,
                    dataIndex: 'idcausa',
                    hidden:true
                },{
                    header: 'Causas',
                    width:280,
                    dataIndex: 'denominacion'
                },{
                    header: 'idconcepto',
                    width:200,
                    dataIndex: 'idconcepto',
                    hidden:true
                },{
                    header: 'check',
                    width:100,
                    dataIndex: 'check',
                    hidden:true
                }
            ]
        });


        this.habConceptocausasONEI = new Ext.FormPanel({
            title: 'Configurar causas de ausencia por concepto para el Modelo SIEN 5201-06 y SIEN 5202-05 ',
            labelAlign: 'top',
            collapsible: true,
            height: 350,
            frame: true,
            reader: modelo.storeConceptosONEI,
            bodyStyle: 'padding:5px 5px 5px 5px',
            items: [
                {
                    layout: 'column',
                    items: [
                        {
                            width: 350,
                            layout: 'form',
                            items: [
                                {
                                    xtype: 'fieldset',
                                    id: 'listconceptos',
                                    name: 'listconceptos',
                                    autoHeight: true,
                                    width: 310,
                                    autoScroll:true,
                                    items: this.listadoConceptosONEI
                                }
                            ]
                        },
                        {
                            width: 350,
                            layout: 'form',
                            items: [
                                {
                                    xtype: 'fieldset',
                                    id: 'listcausas',
                                    name: 'listcausas',
                                    autoHeight: true,
                                    width: 310,
                                    autoScroll:true,
                                    items: this.listadoCausasONEI
                                }
                            ]
                        },
                        {
                            columnWidth: .99,
                            layout: 'form',
                            html: idioma.TxthabConceptocausasONEI
                        }
                    ]
                },
                this.tbarButtton15.setPosition(['90%', 0])
            ]
        });

        this.habmultiplescausales = new Ext.FormPanel({
            title: 'Configuración por multiples causales',
            labelAlign: 'top',
            collapsible: true,
            frame: true,
            reader: modelo.stHabMultiplesCausas,
            bodyStyle: 'padding:5px 5px 5px 5px',
            items: [
                {
                    layout: 'column',
                    items: [
                        {
                            width: 320,
                            layout: 'form',
                            items: [
                                {
                                    xtype: 'checkbox',
                                    boxLabel: 'Habilitar asistencia por multiples causales',
                                    hideLabel: true,
                                    id: 'habilitadomc',
                                    name: 'habilitadomc'
                                }
                            ]
                        },
                        {
                            columnWidth: .99,
                            layout: 'form',
                            html: idioma.Msghtmlmultiplescausas
                        }
                    ]
                },
                this.tbarButtton16.setPosition(['90%', 0])
            ]
        });

        this.vp = new Ext.Viewport({
            layout: 'border',
            items: [{
                region: 'center',
                tbar: ['->', this.btnAyuda],
                width: '100%',
                frame: true,
                border: false,
                margins: '0 0 0 0',
                autoScroll: true,
                items: [
                    this.horariotrabajo, this.horasextras, this.habcontrolacceso, this.cargosnofirman, this.habilitarSesiones, this.habcausa
                    , this.habSubmayorVac, this.habpagomensual, this.habHorarioNoct,this.habCategMilit,this.habCertificados
                    ,this.habGrupo,this.diashoras,this.habConceptocausas,this.habCausasPromTrab,this.habConceptocausasONEI, this.habmultiplescausales]
            }]
        });
    }
};

//Inicializando la vista.
UCID.portal.cargarEtiquetas('configuracionesasist', function (perfil, idioma) {

    //Escogiendo la configuración del idioma según la versión del MT.
    idioma = (idioma) ? idioma : perfil.etiquetas;

    //Inicializando el modelo
    var modelo = Pvd.ControlAsistencia.Configuracionesasist.Modelo;
    modelo.init();

    //Inicializando la vista.
    var vista = Pvd.ControlAsistencia.Configuracionesasist.Vista;
    vista.init(idioma, modelo);

    //Inicializar controlador.
    Pvd.ControlAsistencia.Configuracionesasist.Controlador.init(idioma, vista, modelo);

});