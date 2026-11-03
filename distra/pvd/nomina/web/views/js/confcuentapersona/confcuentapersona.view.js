Ext.ns('Pvd.Nomina.Configuracion.Confcuentapersona');

Ext.QuickTips.init();

//Vista del componente Gestionar plantilla nominal.
Pvd.Nomina.Configuracion.Confcuentapersona.Vista = {
    /**
     * Inicializar la vista.
     *
     * @param perfil Objeto que contiene el perfil de la IU (Tipo: Object).
     * @param idioma Objeto que contiene el idioma de los textos de la IU (Tipo: Object).
     * @param modelo Modelo de la vista del componente Gestionar plantilla nominal (Tipo: Pvd.Nomina.Configuracion.PlantillaNominal.Modelo).
     */
    init: function (perfil, idioma, modelo) {
        this.tipoapertura = 1;

        this.filasSelecionadas = new Array();
        this.idEstructura = null;

        this.btnAceptarEntidad = new Ext.Button({
            id      : 'btnAceptarEntidad',
            text    : 'Aceptar',
            tooltip : 'Aceptar',
            disabled: true,
            iconCls : 'aceptar',
            handler : function () {
            }.createDelegate(this)
        });

        this.pobjestructura = new Ext.pvd.persona.buscarestructura.panelBuscarestructura({
            layout       : 'border',
            region       : 'center',
            nivel        : 5,
            nivelchequear: 3

        });

        this.winEstructura = new Ext.Window({
            title      : 'Entidades',
            modal      : true,
            height     : 350,
            width      : 300,
            closeAction: 'hide',
            closable   : true,
            resizable  : false,
            layout     : 'fit',
            items      : [this.pobjestructura],
            buttons    : [this.btnAceptarEntidad]
        });

        this.btnAdicionar = new Ext.Button({
            id     : 'btnAdicionar',
            text   : "Ad<u>i</u>cionar",
            //tooltip: 'Adicionar concepto general de n&oacute;mina (<b>Alt+I</b>)',
            iconCls: 'adicionar',
            handler: function () {
            }.createDelegate(this)
        });
        this.btnModificar = new Ext.Button({
            id      : 'btnModificar',
            text    : "<u>M</u>odificar",
            // tooltip: 'Modificar concepto general de n&oacute;mina (<b>Alt+M</b>)',
            disabled: true,
            iconCls : 'modificar',
            handler : function () {
            }.createDelegate(this)
        });
        this.btnEliminar = new Ext.Button({
            id      : 'btnEliminar',
            text    : 'Eliminar',
            // tooltip: 'Eliminar concepto general de n&oacute;mina (<b>DEL</b>)',
            disabled: true,
            iconCls : 'eliminar'
        });
        this.btnAyuda = new Ext.Button({
            id     : 'btnAyuda',
            text   : 'Ayuda',
            tooltip: 'Ayuda',
            iconCls: 'ayuda',

        });
        this.btnReplicar = new Ext.Button({
            id      : 'btnreplicar',
            text    : 'Replicar',
            tooltip : 'Replicar',
            disabled: true,
            iconCls : 'adicionar',
            handler : function () {
            }.createDelegate(this)
        });


        this.cbCuenta = new Ext.grid.CheckboxSelectionModel({
            singleSelect: false
        });

        this.dametipoapertura = function (v) {
            if (v == 1) {
                return '<span style="color:blue;">' + 'Todas las personas' + '</span>';
            } else (v == 2 )
            {
                return '<span style="color:red;">' + 'Personas por centro de costo' + '</span>';
            }
            return v;
        }


        this.cmCuenta = new Ext.grid.ColumnModel([this.cbCuenta,
            {
                header   : "Denominación",
                dataIndex: 'denom',
                //  hidden:true,
                width    : 200
            }, {
                header   : "idcuenta",
                dataIndex: 'idcuenta',
                hidden   : true,
                width    : 200
            }, {
                header   : "idcuentaaperturapersona",
                dataIndex: 'idcuentaaperturapersona',
                hidden   : true,
                width    : 200
            }, {
                header   : "idestructura",
                dataIndex: 'idestructura',
                hidden   : true,
                width    : 400
            }, {
                header   : "Tipo apertura",
                dataIndex: 'tipoapertura',
                renderer : this.dametipoapertura,
                hidden   : false,
                width    : 400
            }
        ]);

        this.gpCuentaPersona = new Ext.grid.GridPanel({
            title     : 'Listado de la configuraci&oacute;n de cuenta de persona',
            region    : 'center',
            layout    : 'fit',
            split     : true,
            store     : modelo.stConfcuentapersona,
            autoScroll: true,
            cm        : this.cmCuenta,
            sm        : this.cbCuenta,
            width     : '70%',
            height    : 600,
            border    : false,
            viewConfig: {forceFit: true},
            loadMask  : {msg: 'Cargando...'},
            //disabled: true,
            bbar      : new Ext.PagingToolbar({
                pageSize   : 20,
                store      : modelo.stConfcuentapersona,
                displayInfo: true,
                displayMsg : 'Mostrando  {0} - {1} de {2}',
                emptyMsg   : "0 Resultado a mostrar"
            })
        });
        this.cbCuentaPersona = new Ext.form.TextField({
            id        : 'cbCuentaPersona',
            fieldLabel: 'Cuenta',
            allowBlank: false,
            anchor    : '98%',
            blankText : 'Este campo es obligatorio.'
        });

        this.taReferencia = new Ext.form.TextArea({
            id        : 'taReferencia',
            fieldLabel: 'Descripci&oacute;n',
            allowBlank: false,
            anchor    : '98%',
            blankText : 'Este campo es obligatorio.'
        });

        this.rbTodasPersonas = new Ext.form.Radio({
            boxLabel  : 'Todas las personas',
            name      : 'tipoapertura',
            hideLabel : true,
            inputValue: 1,
            checked   : true,
            listeners : {
                'check': function (obj, ischeck) {
                    if (ischeck) {
                        this.tipoapertura = 1;
                    }
                }.createDelegate(this)
            }

        });

        this.rbPersonasCentroCosto = new Ext.form.Radio({
            boxLabel  : 'Persona por centro de costo',
            hideLabel : true,
            name      : 'tipoapertura',
            inputValue: 2,
            checked   : false,
            listeners : {
                'check': function (obj, ischeck) {
                    if (ischeck) {
                        this.tipoapertura = 2;
                    }
                }.createDelegate(this)
            }

        });

        this.rgTipoApertura = new Ext.form.RadioGroup({
            region   : 'center',
            hideLabel: true,
            items    : [this.rbTodasPersonas, this.rbPersonasCentroCosto]
        });

        this.fsRadiosTipoApertura = new Ext.form.FieldSet({
            title      : "Tipo de apertura",
            autoHeight : true,
            defaultType: 'radio',
            items      : [
                {
                    xtype    : 'radiogroup',
                    columns  : 1,
                    name     : 'tipoapertura',
                    hideLabel: true,
                    items    : [
                        this.rbTodasPersonas,
                        this.rbPersonasCentroCosto
                    ]
                }
            ]
        });

        this.cbxcuenta = new Ext.contabilidad.util.linkedCombo({
            store       : modelo.stcuenta,
            displayField: 'denominacion',
            valueField  : 'cuenta',
            maskRe      : /^[0-9a-zA-Z\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s\.\-\,\(\)]+$/,
            regex       : /^[0-9a-zA-Z\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s\.\-\,\(\)]+$/,
            maxLength   : 255,
            // disabled: true,
            listHeight  : 200,
            tipocta     : '',
            id          : 'lnkcuenta',
            lazyRender  : true,
            // buttons: [this.btnAddCampo],
            fnCreateNew : Ext.emptyFn
        });

        this.fpConfCuentaPersona = new Ext.FormPanel({
            labelAlign: 'top',
            frame     : true,
            width     : 350,
            autoHeight: true,
            items     : [this.cbxcuenta, this.fsRadiosTipoApertura, this.taReferencia ]
        });

        this.btnAceptar = new Ext.Button({
            id     : 'btnAceptar',
            text   : 'Aceptar',
            tooltip: 'Aceptar',
            iconCls: 'aceptar',
            handler: function () {
            }.createDelegate(this)
        });

        this.btnAplicar = new Ext.Button({
            id     : 'btnAplicar',
            text   : 'Aplicar',
            tooltip: 'Aplicar',
            iconCls: 'aplicar',
            handler: function () {
            }.createDelegate(this)
        });

        this.btnCancelar = new Ext.Button({
            id     : 'btnCancelar',
            text   : 'Cancelar',
            tooltip: 'Cancelar',
            iconCls: 'cancelar',
            handler: function () {

            }.createDelegate(this)
        });

        this.winCuentapersona = new Ext.Window({
            modal      : true,
            closeAction: 'hide',
            autoHeight : true,
            closable   : true,
            constrain  : true,
            resizable  : false,
            layout     : 'fit',
            items      : [this.fpConfCuentaPersona],
            buttons    : [this.btnCancelar, this.btnAplicar, this.btnAceptar],
            keys       : [
                {
                    key      : Ext.EventObject.ENTER,
                    stopEvent: true,
                    fn       : function () {
                        self.btnAceptar.handler();
                    }
                },
                {
                    key      : 'x',
                    alt      : true,
                    stopEvent: true,
                    fn       : function () {
                        self.btnCancelar.handler();
                    }
                },
                {
                    key      : 'p',
                    alt      : true,
                    ctrl     : true,
                    stopEvent: true,
                    fn       : function () {
                        self.btnAplicar.handler();
                    }
                }
            ]
        });

        this.pConfcuentaspersona = new Ext.Panel({
            region: 'center',
            layout: 'border',
            //disabled: true,
            items : [this.gpCuentaPersona],
            tbar  : [this.btnAdicionar, this.btnModificar, this.btnEliminar, '->', this.btnReplicar, '->', this.btnAyuda],
            keys  : [
                {
                    key      : 'i',
                    alt      : true,
                    stopEvent: true,
                    fn       : function () {
                        self.btnAdicionar.handler();
                    }
                },
                {
                    key      : 'm',
                    alt      : true,
                    stopEvent: true,
                    fn       : function () {
                        if (!self.btnModificar.disabled) {
                            self.btnModificar.handler();
                        }

                    }
                },
                {
                    key      : 46,
                    stopEvent: true,
                    fn       : function () {
                        if (!self.btnEliminar.disabled) {
                            self.btnEliminar.handler();
                        }
                    }
                },
                {
                    key      : 'h',
                    stopEvent: true,
                    alt      : true,
                    fn       : function () {
                        self.btnAyuda.handler();
                    }
                }
            ]
        });

        this.winMostrarCuentaPersona = new Ext.Window({
            title      : 'Configurar cuenta de la persona',
            modal      : true,
            height     : 600,
            width      : 800,
            constrain  : true,
            closeAction: 'hide',
            maximized  : true,
            closable   : true,
            resizable  : false,
            layout     : 'border',
            items      : [ this.pConfcuentaspersona]
        });

    }
};

//Inicializando la vista.
UCID.portal.cargarEtiquetas('confcuentapersona', function (perfil, idioma) {
    perfil = arguments[0];
    idioma = arguments[1];

    //Inicializando el modelo.
    var modelo = Pvd.Nomina.Configuracion.Confcuentapersona.Modelo;
    modelo.init();
    //Inicializando la vista.
    var vista = Pvd.Nomina.Configuracion.Confcuentapersona.Vista;
    vista.init(perfil, idioma, modelo);
    //Inicializar controlador.
    Pvd.Nomina.Configuracion.Confcuentapersona.Controlador.init(idioma, vista, modelo);
});
