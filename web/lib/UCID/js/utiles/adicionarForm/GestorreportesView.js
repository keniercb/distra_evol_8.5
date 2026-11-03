Ext.ns("cein.views");

cein.views.GestorreportesView = Ext.extend(Ext.Window, {
    constructor: function (config) {
        config = config || {};
        var that = this;
            activateSoporte = false;
        that.tieneModuloCEIN = config.tieneModuloCEIN;
        that.urlcrearnc = config.urlcrearnc;

        this.fileUploadArchivo = new Ext.form.FileUploadField({
            fieldLabel: "Imagen",
            buttonText: "Buscar",
            id: 'fileUploadArchivo',
            nextTab: 'fieldSubsistema',
            xtype: 'fileuploadfield',
            width: 226
        });

        this.fileUploadArchivoCliente = new Ext.form.FileUploadField({
            fieldLabel: "Imagen",
            buttonText: "Buscar",
            id: 'fileUploadArchivoCliente',
            xtype: 'fileuploadfield'
        });

        this.btnAceptar = new Ext.Button({
            text: "Aceptar",
            name: "btnAceptar",
            id: "btnAceptar",
            prevTab: 'btnAplicar',
            // nextTab: 'denominacion',
            xtype: "button",
            propOwnerCt: "buttons",
            tooltip: "Guardar datos y cerrar ventana <b>(Enter)</b>",
            formBind: true,
            iconCls: "aceptar",
            listeners: {
                click: this.on_btnAceptarGest_click,
                scope: this
            }
        });

        this.btnAplicar = new Ext.Button({
            text: "Aplicar",
            name: "btnAplicar",
            id: "btnAplicar",
            nextTab: 'btnAceptar',
            prevTab: 'btnCancelar',
            xtype: "button",
            formBind: true,
            propOwnerCt: "buttons",
            iconCls: "aplicar",
            tooltip: "Guardar datos y limpiar los campos <b>(Ctrl+Alt+P)</b>",
            listeners: {
                click: this.on_btnAplicar_click,
                scope: this
            }
        });

        this.btnCancelar = new Ext.Button({
            text: "Cancelar",
            name: "btnCancelar",
            id: "btnCancelar",
            xtype: "button",
            propOwnerCt: "buttons",
            handler: null,
            nextTab: 'btnAplicar',
            prevTab: 'textareaDescripcion',
            tooltip: "Cerrar ventana sin guardar los datos <b>(Alt+X)</b>",
            iconCls: "cancelar",
            listeners: {
                //click: this.on_btnCancelar_click,
                click: function () {
                    this.destroy();
                },
                scope: this
            }
        });

        this.fieldSubsistema = new Ext.form.TextField({
            name: "fieldSubsistema",
            xtype: "field",
            id: 'fieldSubsistema',
            propOwnerCt: null,
            readOnly: true,
            // width: 214,
            width: '100%',
            height: 22,
            allowBlank: false,
            fieldLabel: "Subsistema/Funcionalidad",
            nextTab: 'textareaDescripcionPortal',
            prevTab: 'fileUploadArchivo',
            hidden: that.tieneModuloCEIN,
            disabled: that.tieneModuloCEIN
        });

        this.textareaDescripcionPortal = new Ext.form.TextArea({
            name: "textareaDescripcionPortal",
            id: "textareaDescripcionPortal",
            propOwnerCt: null,
            mod: false,
            width: '100%',
            height: 90,
            maxLength: 1000,
            nextTab: 'btnCancelar',
            prevTab: 'fieldSubsistema',
            enableKeyEvents: true,
            emptyText: "Sugerencias: \n 1.¿Qué ocurrió? (Si es un error introduzca el mensaje exacto). \n 2. Secuencia de acciones que precedieron a la incidencia. \n 3.Si ocurrió un error en un formulario: ¿Cuál fue el juego de datos introducido? \n 4. Opinión personal acerca de las causas que generaron la incidencia.",
            fieldLabel: "Descripci&oacute;n",
            labelAlign: 'top',
            allowBlank: false,
            listeners: {
                keydown: function (textField, eventObject) {
                    var ok = textField.getValue().length < 1000;
                    var key = eventObject.getKey();

                    if (key == 8 || key == 46 || key == 37 || key == 39) {
                        textField.enableKeyEvents = true;
                        return;
                    }
                    else if (!ok) {
                        eventObject.stopEvent();
                        return;
                    }
                },
                focus: function (item) {
                    if (!item.mod) {
                        item.mod = true;
                        item.setValue("");
                    }
                },
                render: function (c) {
                    Ext.QuickTips.register({
                        target: c.getEl(),
                        title: "Sugerencias:",
                        text: "<div><p>1.¿Qué ocurrió? (Si es un error introduzca el mensaje exacto).</p>" +
                        "<p>2. Secuencia de acciones que precedieron a la incidencia.</p>" +
                        "<p>3. Si ocurrió un error en un formulario: ¿Cuál fue el juego de datos introducido? </p>" +
                        "<p>4. Opinión personal acerca de las causas que generaron la incidencia.</p></div>"
                    });
                }

            }
        });

//-----------------  Combo para definir la via por la cual se va a insertar la incidencia --------------------------
        this.storeVias = new Ext.data.JsonStore({
            url: '/herramientas/cein/index.php/cein/cargarVias',
            root: 'data',
            totalProperty: 'num',
            fields: ['idviareporte', 'denominacion', {
                name: 'idviareporte'
            }, {
                name: 'denominacion'
            }],
            autoLoad: false
        });

        this.comboVias = new Ext.form.ComboBox({
            fieldLabel: "Vía",
            id: 'cbvias',
            name: 'cbvias',
            displayField: 'denominacion',
            valueField: 'idviareporte',
            triggerAction: 'all',
            // value:'Automática',
            //emptyText: "Seleccione",
            selectOnFocus: false,
            typeAhead: true,
            width: 452,
            height: '100%',
            store: this.storeVias,
            editable: false,
            tabIndex: 3,
            //enableQtip: true,
            allowBlank: false,
            // minListWidth: 127,
            hidden: !that.tieneModuloCEIN,
            disabled: !that.tieneModuloCEIN,
            listeners: {
                render: function (me) {
                    if (that.tieneModuloCEIN) {
                        me.store.load({
                            callback: function () {
                                me.setValue(4);
                            }
                        });
                    }
                }
            }
        });

//------------- Combo para escoger el cliente del cual se va insertar la incidencia ------------------------------
        this.storeClientes = new Ext.data.JsonStore({
            url: '/herramientas/cein/index.php/cein/obtenerEntidadesHabilitadasNoTree',
            root: 'data',
            //totalProperty: 'num',
            fields: ['identidad', 'denominacion', 'numero', {
                name: 'identidad'
            }, {
                name: 'denominacion'
            }, {
                name: 'numero'
            }],
            autoLoad: true
        });

        this.comboCliente = new Ext.form.ComboBox({
            fieldLabel: "Entidad",
            id: 'cbcliente',
            name: 'cbcliente',
            displayField: 'denominacion',
            valueField: 'identidad',
            triggerAction: 'all',
            forceSelection: true,
            // selectOnFocus: true,
            typeAhead: true,
            mode: 'local',
            width: 430,
            maxHeight: 408,
            //width: '98%',
            //   anchor: 386,
            store: this.storeClientes,
            editable: true,
            tabIndex: 3,
            minListWidth: 430,
            minChars: 1,
            // enableQtip: true,
            //allowBlank: true,
            emptyText: "Seleccione",
            hidden: !that.tieneModuloCEIN,
            disabled: !that.tieneModuloCEIN
        });

//-----------------  Combo para definir el nivel en el cual se va a insertar la incidencia --------------------------
        this.storeNivel = new Ext.data.JsonStore({
            url: '/herramientas/cein/index.php/cein/cargarRolesPorRolLogueado',
            root: 'data',
            totalProperty: 'num',
            fields: ['idrolcein', 'denominacion', {
                name: 'idrolcein'
            }, {
                name: 'denominacion'
            }],
            baseParams: {
                a: null
            },
            listeners: {
                beforeload: function () {
                    this.baseParams.idproducto = Ext.getCmp('cbproducto').value
                },
                load: function (a, b) {
                    Ext.getCmp('cbnivel').setValue(b[0].data.idrolcein);
                }
            },
            autoLoad: false
        });

        this.comboNivel = new Ext.form.ComboBox({
            fieldLabel: "Nivel",
            id: 'cbnivel',
            name: 'cbnivel',
            displayField: 'denominacion',
            valueField: 'idrolcein',
            triggerAction: 'all',
            //emptyText: "Seleccione",
            //selectOnFocus: false,
            typeAhead: true,
            width: 220,
            height: '100%',
            store: this.storeNivel,
            editable: false,
            tabIndex: 3,
            // enableQtip: true,
            allowBlank: false,
            minListWidth: 127,
            hidden: !that.tieneModuloCEIN,
            // disabled: !that.tieneModuloCEIN,
            disabled: true
        });


//------------- Combo para escoger el producto del cual se va insertar la incidencia ------------------------------
        this.storeProducto = new Ext.data.JsonStore({
            url: '/herramientas/cein/index.php/cein/cargarProductosPorUsuario',
            method: 'POST',
            root: 'data',
            totalProperty: 'num',
            fields: ['idproducto', 'denominacion', {
                name: 'idproducto'
            }, {
                name: 'denominacion'
            }]
        });

        this.comboProducto = new Ext.form.ComboBox({
            fieldLabel: "Producto",
            id: 'cbproducto',
            name: 'cbproducto',
            displayField: 'denominacion',
            valueField: 'idproducto',
            triggerAction: 'all',
            forceSelection: true,
            typeAhead: true,
            width: 430,
            store: this.storeProducto,
            editable: false,
            tabIndex: 3,
            minListWidth: 430,
            enableQtip: true,
            allowBlank: false,
            disabled: !that.tieneModuloCEIN,
            emptyText: "Seleccione",
            hidden: !that.tieneModuloCEIN,
            listeners: {
                select: function () {
                    Ext.getCmp('cbnivel').enable();
                    if (that.tieneModuloCEIN) {
                        Ext.getCmp('cbnivel').store.load();
                    }
                }
            }

        });

//--------------------- fielset para los combos cliente, producto ------------------------------------
        //region myfieldset
        this.myfieldset = new Ext.form.FieldSet({
            autoHeight: true,
            id: 'myfieldset',
            hidden: !that.tieneModuloCEIN,
            width: '95%',
            //anchor: '99%',
            layout: 'column',
            // width:'100%',
            items: [{
                layout: 'form',
                width: '100%',
                items: [this.comboCliente]
            }, {
                layout: 'form',
                width: '100%',
                items: [this.comboProducto]
            }]
        });
        //endregion

        this.btnsubsistema = new Ext.Button({
            text: "Buscar",
            xtype: "button",
            propOwnerCt: "buttons",
            id: 'btnFuncionalidad',
            nextTab: 'textareaDescripcionPortal',
            prevTab: 'fieldSubsistema',
            handler: null,
            hidden: that.tieneModuloCEIN,
            disabled: that.tieneModuloCEIN,
            style: {
                marginTop: 18,
                marginRight: 2,
                // float: 'left'
                float: 'right'
            },
            iconCls: "buscar",
            listeners: {
                click: function () {
                    var urlcargarSistTree = '/herramientas/cein/index.php/cein/cargarSistTreeWin';
                    Ext.Ajax.request({
                        url: '/seguridad/index.php/configuracion/tieneModuloCein',
                        callback: function (option, success, response) {
                            var resp = JSON.parse(response.responseText);
                            if (!resp.success) {
                                urlcargarSistTree = '/herramientas/gestor_ncclient/index.php/ceinclient/cargarSistTreeWin';
                            }
                            new cein.views.VistatreePanel({
                                urlcargarSistTree: urlcargarSistTree
                            }).show();
                            Ext.getCmp('winCpVentana1').focus();
                        }
                    });


                }
            }
        });

//----------------------- textfield subsistema --------------------------
        this.tfsubsistema = new Ext.form.TextField({
            name: "tfsubsistema",
            xtype: "field",
            id: 'tfsubsistema',
            propOwnerCt: null,
            width: '99%',
            height: 22,
            allowBlank: true,
            // validateOnBlur: false,
            fieldLabel: "Subsistema",
            hidden: !that.tieneModuloCEIN,
            disabled: !that.tieneModuloCEIN
        });

        this.tffuncionalidad = new Ext.form.TextField({
            name: "tffuncionalidad",
            xtype: "field",
            id: 'tffuncionalidad',
            propOwnerCt: null,
            width: '99%',
            height: 22,
            allowBlank: true,
            fieldLabel: "Funcionalidad",
            hidden: !that.tieneModuloCEIN,
            disabled: !that.tieneModuloCEIN
        });

        //region fssubsistema
        this.fssubsistema = new Ext.form.FieldSet({
            autoHeight: true,
            id: 'fssubsistema',
            width: '95%',
            layout: 'column',
            hidden: !that.tieneModuloCEIN,
            items: [{
                layout: 'form',
                width: '99%',
                items: [
                    this.tfsubsistema,
                    this.tffuncionalidad
                ]
            }]
        });
        //endregion

//--------------------- fielset para subsistema con boton

        //region fssubsistema2
        this.fssubsistema2 = new Ext.form.FieldSet({
            autoHeight: true,
            id: 'fssubsistema2',
            width: '95%',
            layout: 'column',
            hidden: that.tieneModuloCEIN,
            items: [{
                layout: 'form',
                width: '82%',
                // width: 341,
                items: [
                    this.fieldSubsistema]
            }, {
                layout: 'form',
                width: '18%',
                items: [
                    this.btnsubsistema]
            }]
        });
        //endregion

        this.arbolAccLoader = new Ext.tree.TreeLoader({
            dataUrl: '/herramientas/cein/index.php/gestorreportes/cargarSistFuncAcc',
            id: 'arbolAccLoader',
            listeners: {
                beforeload: function () {
                    iddominio = anode.attributes.iddominio;
                    atreeloader.baseParams = {};
                    atreeloader.baseParams.iddominio = iddominio;

                    if (anode.attributes.idfuncionalidad)
                        atreeloader.baseParams.idfuncionalidad = anode.attributes.idfuncionalidad;
                    else if (anode.attributes.idsistema)
                        atreeloader.baseParams.idsistema = anode.attributes.idsistema;
                },
                scope: this
            }
        });
/*
        this.arbolAcc = new Ext.tree.TreePanel({
            autoScroll: true,
            id: 'arbolAcc',
            split: true,
            width: '97%',
            loader: this.arbolAccLoader,
            listeners: {
                /!*beforeclick: function () {
                },
                click: function () {
                },*!/
                scope: this
            }
        });*/

        this.padreArbolAcc = new Ext.tree.AsyncTreeNode({
            text: 'Sistemas',
            expandable: false,
            loader: this.arbolAccLoader,
            id: '0',
            listeners: {
                scope: this
            }
        });
//
        this.cbplusTree = new cein.views.TreeComboBox({
            id: 'cb',
            width: 120,
            height: 22,
            allowBlank: false,
            forceSelection: true,
            editable: false,
            displayField: "text",
            valueField: "id",
            fieldLabel: 'Funcionalidad',
            treeConfig: {
                rootVisible: false,
                loader: this.arbolAccLoader,
                border: false,
                autoScroll: true,
                root: this.padreArbolAcc
            },
            listeners: {
                scope: this
            }
        });

        this.fsNiveleImagen = new Ext.form.FieldSet({
            id: 'fsNiveleImagen',
            margin: '0 0 0 0',
            baseCls: 'x-fieldset-cein',
            width: 452,
            height: 50,
            layout: 'column',
            items: [
                {
                    layout: 'form',
                    width: '50%',
                    id: 'idcolumncomboNivel',
                    items: [
                        this.comboNivel
                    ]
                }, {
                    layout: 'form',
                    width: '50%',
                    items: [
                        this.fileUploadArchivo
                    ]
                }
            ]
        });

        this.fsImagenCliente = new Ext.form.FieldSet({
            id: 'fsImagenCliente',
            margin: '0 0 0 0',
            baseCls: 'x-fieldset-cein',
            width: 450,
            height: 50,
            layout: 'column',
            items: [
                {
                    layout: 'form',
                    width: '100%',
                    items: [
                        this.fileUploadArchivoCliente
                    ]
                }
            ]
        });

        var items = [];

        if (config.ayudaPrincipal == true) {
            this.btnsubsistema;
            if (that.tieneModuloCEIN) {
                items = [{
                    layout: 'column',
                    width: '100%',
                    items: [
                        {
                            layout: 'form',
                            hidden: !that.tieneModuloCEIN,
                            id: 'idcolumncomboVias',
                            items: [
                                this.comboVias
                            ]
                        }
                    ]
                },
                    this.myfieldset,
                    this.fsNiveleImagen,
                    this.fssubsistema,
                    this.fssubsistema2
                ];
            } else {
                Ext.getCmp('fileUploadArchivoCliente').setWidth(450);
                items = [{
                    layout: 'column',
                    width: '100%',
                    items: [
                        {
                            layout: 'form',
                            hidden: !that.tieneModuloCEIN,
                            id: 'idcolumncomboVias',
                            items: [
                                this.comboVias
                            ]
                        }
                    ]
                },
                    this.myfieldset,
                    this.fsImagenCliente,
                    this.fssubsistema,
                    this.fssubsistema2
                ];
            }

        }
        else {
            items = [{
                layout: 'column',
                width: '100%',
                items: [
                    {
                        layout: 'form',
                        width: '99%',
                        //columnWidth: 0.5,
                        items: [
                            this.fileUploadArchivo
                        ]
                    },
                ]
            }];
        }

        items.push({
            xtype: 'fieldset',
            height: 110,
            margin: '0 0 0 0',
            baseCls: 'x-fieldset-cein',
            width: 452,
            items: [this.textareaDescripcionPortal]
        });

        this.formpanel4 = new Ext.FormPanel({
                layout: "fit",
                name: "formpanelGestor",
                id: 'formpanelGestor',
                //xtype: "form",
                docKeyMap: this.documentKeyGestRep,
                propOwnerCt: "items",
                buttonAlign: 'right',
                fileUpload: true,
                monitorValid: true,
                frame: true,
                labelAlign: 'top',
                items: [
                    {
                        autoHeight: true,
                        items: items
                    }
                ],
                buttons: [
                    this.btnCancelar,
                    this.btnAplicar,
                    this.btnAceptar
                ]
            }
        );

        this.comboVias.on('select', function (t, rec, i) {
            if (rec.data.idviareporte != 1) {
                that.setHeight(558);
                Ext.getCmp('fieldSubsistema').reset();
                Ext.getCmp('fieldSubsistema').hide();
                Ext.getCmp('fieldSubsistema').disable();

                Ext.getCmp('tfsubsistema').enable();
                Ext.getCmp('tfsubsistema').show();

                Ext.getCmp('tffuncionalidad').enable();
                Ext.getCmp('tffuncionalidad').show();

                //region fssubsistema2
                Ext.getCmp('fssubsistema2').disable();
                Ext.getCmp('fssubsistema2').hide();
                //endregion

                //region fssubsistema
                Ext.getCmp('fssubsistema').enable();
                Ext.getCmp('fssubsistema').show();
                //endregion

                //region myflieldset
                Ext.getCmp('myfieldset').enable();
                Ext.getCmp('myfieldset').show();
                //endregion

                Ext.getCmp('cbcliente').enable();
                Ext.getCmp('cbcliente').show();

                Ext.getCmp('cbproducto').enable();
                Ext.getCmp('cbproducto').show();
                // Ext.getCmp('cborigen').show();

                Ext.getCmp('cbnivel').reset();
                Ext.getCmp('cbnivel').disable();

            } else {
                that.setHeight(375);
                Ext.getCmp('fieldSubsistema').enable();
                Ext.getCmp('fieldSubsistema').show();
                //region fssubsistema2
                Ext.getCmp('fssubsistema2').enable();
                Ext.getCmp('fssubsistema2').show();
                //endregion
                Ext.getCmp('btnFuncionalidad').enable();
                Ext.getCmp('btnFuncionalidad').show();

                //region fssubsistema
                Ext.getCmp('fssubsistema').disable();
                Ext.getCmp('fssubsistema').hide();
                //endregion
                Ext.getCmp('tfsubsistema').disable();
                Ext.getCmp('tfsubsistema').hide();
                Ext.getCmp('tffuncionalidad').disable();
                Ext.getCmp('tffuncionalidad').hide();

                //region myfieldset
                Ext.getCmp('myfieldset').hide();
                //endregion
                Ext.getCmp('cbproducto').hide();
                Ext.getCmp('cbcliente').hide();
                // Ext.getCmp('cborigen').hide();

                //region myfieldset
                Ext.getCmp('myfieldset').disable();
                //endregion
                Ext.getCmp('cbproducto').disable();
                Ext.getCmp('cbcliente').disable();
                // Ext.getCmp('cborigen').disable();

                Ext.getCmp('cbproducto').reset();
                Ext.getCmp('cbcliente').reset();
                // Ext.getCmp('cborigen').reset();

                var cbnivel = Ext.getCmp('cbnivel');
                cbnivel.enable();
                cbnivel.store.load();

            }
            that.center();
        });

        this.comboCliente.on('select', function (t, rec, i) {
            Ext.getCmp('cbproducto').enable();
            Ext.getCmp('cbproducto').reset();
            Ext.getCmp('cbproducto').store.load();
            // Ext.getCmp('cborigen').reset();
        });

        Ext.apply(config, {
            title: "Reportar incidencia",
            renderTo: 'x-desktop',
            constrainHeader: true,
            resizable: false,
            xtype: "panel",
            width: 480,
            height: 558,
            modal: true,
            docKeyMap: this.documentKeyGestRep,
            name: "winInser",
            id: "winInser",
            propOwnerCt: null,
            items: [
                this.formpanel4
            ],
            listeners: {
                render: function (comp) {
                    if (!that.tieneModuloCEIN) {
                        // Ext.getCmp("idcolumnfileUploadArchivo").columnWidth = 1;
                        //Ext.getCmp("cbnivel").disable();
                        //Ext.getCmp("cbnivel").hide();
                        comp.setHeight(325);
                    }
                    this.documentKeyGestRep = new Ext.KeyMap(comp.id, [{
                        key: 13,
                        alt: false,
                        stopEvent: true,
                        ctrl: false,
                        fn: function (key, manejador) {


                            if (that.btnAceptar.disabled == false) {
                                if (manejador.target.id != 'textareaDescripcionPortal' && Ext.getCmp('formpanelGestor').getForm().isValid()) {
                                    that.on_btnAceptarGest_click();
                                }
                                else {
                                    var t = Ext.getCmp(manejador.target.id);
                                    t.setValue(t.getValue() + '\n');
                                }
                            }
                            else {
                                if (manejador.target.id == 'textareaDescripcionPortal') {
                                    var t = Ext.getCmp(manejador.target.id);
                                    t.setValue(t.getValue() + '\n');
                                }
                            }

                        },
                        //scope: this
                    }, {
                        key: 'p',
                        alt: true,
                        stopEvent: true,
                        ctrl: true,
                        fn: function () {
                            //console.log(Ext.getCmp('btnguardarcambios'))
                            if (that.btnAplicar.disabled == false)
                                that.on_btnAplicar_click();
                            //console.log('ctrl+alt+p')
                        },
                        //scope: this
                    }, {
                        key: 'x',
                        alt: true,
                        stopEvent: true,
                        ctrl: false,
                        fn: function () {
                            that.on_btnCancelar_click();
                            //console.log('alt+l')
                        },
                        //scope: this
                    }]);
                    activateSoporte = true;
                    pathname = location.pathname;
                    subsistema = pathname.split('/');
                    if (subsistema[1] != 'portal') {
                        // this.cbplusTree.setValue(subsistema[subsistema.length-1]);
                        //  this.cbplusTree.setValue(subsistema[1]);
                        this.cbplusTree.setValue(pathname);
                        this.cbplusTree.disable();
                    }
                    /* if (!this.btnsubsistema) {
                         Ext.getCmp('winInser').setSize(480, 337);
                     }*/
                },
                destroy: function () {
                    activateSoporte = false;
                },

                scope: this
            }
        });
        cein.views.GestorreportesView.superclass.constructor.call(this, config);
    },

    onRender: function () {
        //TODO: Pre-render
        cein.views.GestorreportesView.superclass.onRender.apply(this, arguments);
        //TODO: Pos-render
        if (!this.btnsubsistema) {
            Ext.getCmp('winInser').setSize(480, 337);
        }
    },

    onDestroy: function () {
        //TODO: Pre-destroy
        cein.views.GestorreportesView.superclass.onDestroy.call(this);
    },

    on_btnAceptarGest_click: function () {
        var that = this;
        if (that.tieneModuloCEIN) {
            var archivo = Ext.getCmp('fileUploadArchivo').value;
        } else {
            var archivo = Ext.getCmp('fileUploadArchivoCliente').value;
        }
        if (archivo) {
            var arre = new Array();
            var arre = archivo.split('.');

            var extension = archivo.split('.')[archivo.split('.').length - 1];
            if (extension == 'jpeg' || extension == 'gif' || extension == 'jpg' || extension == 'png' || extension == 'JPEG' || extension == 'GIF' || extension == 'JPG' || extension == 'PNG') {
                if (this.textareaDescripcionPortal.getValue() != "Sugerencias: \n 1.¿Qué ocurrió? (Mensaje exacto del error). \n 2. Secuencia de acciones que precedieron al error. \n 3.Si ocurrió en un formulario: ¿Cuál fue el juego de datos introducido? \n 4. Opinión personal acerca de las causas que generaron la incidencia.") {
                    this.crearNC('aceptar');
                }
                else {
                    mostrarMensaje(6, 'Debe llenar el campo descripción.');
                }
            }
            else {
                mostrarMensaje(6, 'La imagen introducida no es válida.');
            }
        }
        else {
            if (this.textareaDescripcionPortal.getValue() != "Sugerencias: \n 1.¿Qué ocurrió? (Mensaje exacto del error). \n 2. Secuencia de acciones que precedieron al error. \n 3.Si ocurrió en un formulario: ¿Cuál fue el juego de datos introducido? \n 4. Opinión personal acerca de las causas que generaron la incidencia.") {
                this.crearNC('aceptar');
            }
            else {

                mostrarMensaje(6, 'Debe llenar el campo descripción.');
            }
        }

    },

    on_btnAplicar_click: function () {
        var that = this;
        if (that.tieneModuloCEIN) {
            var archivo = Ext.getCmp('fileUploadArchivo').value;
        } else {
            var archivo = Ext.getCmp('fileUploadArchivoCliente').value;
        }
        if (archivo) {
            var arre = new Array();
            arre = archivo.split('.');
            var extension = arre[arre.length - 1];

            if (extension == 'jpeg' || extension == 'gif' || extension == 'jpg' || extension == 'png' || extension == 'JPEG' || extension == 'GIF' || extension == 'JPG' || extension == 'PNG') {
                if (this.textareaDescripcionPortal.getValue() != "Sugerencias: \n 1.¿Qué ocurrió? (Mensaje exacto del error). \n 2. Secuencia de acciones que precedieron al error. \n 3.Si ocurrió en un formulario: ¿Cuál fue el juego de datos introducido? \n 4. Opinión personal acerca de las causas que generaron la incidencia.") {

                    this.crearNC('aplicar');
                }
                else {
                    mostrarMensaje(6, 'Debe llenar el campo descripción ');
                }
            }
            else {

                mostrarMensaje(6, 'La imagen introducida no es válida.');
            }
        }
        else {
            if (this.textareaDescripcionPortal.getValue() != "Sugerencias: \n 1.¿Qué ocurrió? (Mensaje exacto del error). \n 2. Secuencia de acciones que precedieron al error. \n 3.Si ocurrió en un formulario: ¿Cuál fue el juego de datos introducido? \n 4. Opinión personal acerca de las causas que generaron la incidencia.") {

                this.crearNC('aplicar');
            }
            else {

                mostrarMensaje(6, 'Debe llenar el campo descripción.');
            }
        }
    },

    crearNC: function (tipo) {
        var that = this,
            func = "",
            subsist = "";

        if (Ext.getCmp('fieldSubsistema').getValue() != "") {
            func = Ext.getCmp('fieldSubsistema').getValue();
            subsist = null;
        }
        else {
            subsist = Ext.getCmp('tfsubsistema').getValue();
            func = Ext.getCmp('tffuncionalidad').getValue();
        }
        if (Ext.getCmp('cbvias').getValue()) {
            via = Ext.getCmp('cbvias').getValue();
        } else {
            via = 1;
        }
        if (tipo == 'aplicar') {
            Ext.getCmp('formpanelGestor').getForm().submit({
                url: that.urlcrearnc,
                params: {
                    descripcion: this.textareaDescripcionPortal.getValue(),
                    funcionalidad: func,
                    pathname: null,
                    via: via,
                    idcliente: Ext.getCmp('cbcliente').getValue(),
                    idproducto: Ext.getCmp('cbproducto').getValue(),
                    desdeportal: 1,
                    nivel: Ext.getCmp('cbnivel').getValue(),
                    subsistema: subsist
                },
                success: function () {
                    crearNCAplicarSuccess(that.tieneModuloCEIN);
                },
                failure: function (options, resp) {
                    crearNCFailure(options, resp);
                }
            });
        }
        else {
            this.cbplusTree.setValue('');
            var ventana = this;
            Ext.getCmp('formpanelGestor').getForm().submit({
                url: that.urlcrearnc,
                params: {
                    descripcion: this.textareaDescripcionPortal.getValue(),
                    funcionalidad: func,
                    pathname: null,
                    /*-*/
                    //pathname: location.pathname,
                    via: via,
                    idcliente: Ext.getCmp('cbcliente').getValue(),
                    idproducto: Ext.getCmp('cbproducto').getValue(),
                    desdeportal: 1,
                    nivel: Ext.getCmp('cbnivel').getValue(),
                    subsistema: subsist
                },
                success: function () {
                    crearNCAceptarSuccess(ventana);
                },
                failure: function (options, resp) {
                    crearNCFailure(options, resp);
                }
            });
        }


    },


    on_btnCancelar_click: function () {
        this.destroy();
    },

});

function crearNCFailure(options, resp) {
    var msg = resp.result.msg;
    mostrarMensaje(3, msg);
    /*if (msgId.substring(0, 3) == "Exc")
        mostrarMensaje(6, 'Ha ocurrido un error inesperado al intentar reportar la incidencia');
    else
        switch (msgId) {
            case "ErrProductoNoExiste":
                mostrarMensaje(6, 'Ha ocurrido un error. Su producto no se encuentra registrado en el CEIN.');
                break;
            case "ErrLicenciaNoExiste":
                mostrarMensaje(6, 'Ha ocurrido un error. El CEIN no posee licencia.');
                break;
            case "ErrDatosInsuficientes":
                mostrarMensaje(6, 'Ha ocurrido un error. Su producto no posee licencia ni datos en el "Acerca de".');
                break;
            default:
                mostrarMensaje(6, 'Ha ocurrido un error inesperado al intentar reportar la incidencia');
        }*/
}

function crearNCAplicarSuccess(tieneModuloCEIN) {
    var msg1 = "La incidencia ha sido adicionada satisfactoriamente.";
    mostrarMensaje(1, msg1.toString());
    Ext.getCmp('cb').clear();
    Ext.getCmp('formpanelGestor').getForm().reset();
    Ext.getCmp('fileUploadArchivo').getEl().up('.x-form-field-wrap');

    Ext.getCmp('fileUploadArchivo').value = '';
    Ext.getCmp('btnAceptar').setDisabled(true);
    Ext.getCmp('btnAplicar').setDisabled(true);

    if (tieneModuloCEIN) {
        Ext.getCmp('tfsubsistema').show();
        Ext.getCmp('tfsubsistema').enable();
        Ext.getCmp('tffuncionalidad').show();
        Ext.getCmp('tffuncionalidad').enable();
        //region fssubsistema
        Ext.getCmp('fssubsistema').show();
        Ext.getCmp('fssubsistema').enable();
        //endregion

        //region myfieldset
        Ext.getCmp('myfieldset').enable();
        Ext.getCmp('myfieldset').show();
        //endregion
        Ext.getCmp('cbcliente').show();
        Ext.getCmp('cbcliente').enable();
        Ext.getCmp('cbproducto').show();
        // Ext.getCmp('cborigen').show();

        Ext.getCmp('cbvias').setValue(4);

        // cbNivel = Ext.getCmp('cbnivel');
        // cbNivel.setValue(cbNivel.store.getAt(0).json.default)
        // cbNivel.disable();
        Ext.getCmp('cbnivel').disable();

        //region fssubsistema2
        Ext.getCmp('fssubsistema2').hide();
        //endregion
        Ext.getCmp('btnFuncionalidad').hide();
        Ext.getCmp('fieldSubsistema').hide();
        Ext.getCmp('fieldSubsistema').disable();
        Ext.getCmp('winInser').setHeight(558);
    } else {
        Ext.getCmp('cbproducto').reset();
        Ext.getCmp('cbproducto').hide();
        Ext.getCmp('cbproducto').disable();

        Ext.getCmp('cbcliente').reset();
        Ext.getCmp('cbcliente').hide();
        Ext.getCmp('cbcliente').disable();

        //region myfieldset
        Ext.getCmp('myfieldset').disable();
        Ext.getCmp('myfieldset').hide();
        //endregion

        Ext.getCmp('tfsubsistema').hide();
        Ext.getCmp('tfsubsistema').disable();
        Ext.getCmp('tffuncionalidad').hide();
        Ext.getCmp('tffuncionalidad').disable();

        //region fssubsistema
        Ext.getCmp('fssubsistema').hide();
        Ext.getCmp('fssubsistema').disable();
        //endregion

        Ext.getCmp('cbcliente').hide();
        Ext.getCmp('cbcliente').disable();
        Ext.getCmp('cbproducto').hide();
        Ext.getCmp('cbproducto').disable();

        //region fssubsistema2
        Ext.getCmp('fssubsistema2').enable();
        Ext.getCmp('fssubsistema2').show();
        //endregion
        Ext.getCmp('btnFuncionalidad').show();
        Ext.getCmp('winInser').setHeight(278);
    }
}

function crearNCAceptarSuccess(ventana) {
    var msg1 = "La incidencia ha sido adicionada satisfactoriamente.";
    this.mostrarMensaje(1, msg1.toString());
    ventana.destroy();
}
