/**
 * Componete para gestioanr los nomencladores genéricamente
 *
 * @author Ing. Miguel Antonio Cabreja Aldana
 * @package PVD
 * @subpackage Persona
 * @copyright XETID 2014
 */

Ext.ns('PVD.Persona.CmpNomenclador');
var idioma = {};

/**
 * Vista en forma de formulario
 * @type {extend|*|void|extend|extend|extend}
 */
PVD.Persona.CmpNomenclador.ViewForm = Ext.extend(Ext.Window, {
    border: false,
    modal: true,
    closeAction: 'hide',
    draggable: false,
    autoHeigth: true,
    width: 450,
    initComponent: function () {
        var self = this;
        Ext.apply(this, this.newConf);

        this.btnAcept = new Ext.Button({
            id: 'btnAcept' + self.referencia,
            nextTab: 'tfDenomination' + self.referencia,
            prevTab: 'btnApply' + self.referencia,
            text: self.lang.btnAcept,
            tooltip: self.lang.ttBtnAcept,
            iconCls: 'aceptar'
        });

        this.btnApply = new Ext.Button({
            id: 'btnApply' + self.referencia,
            nextTab: 'btnAcept' + self.referencia,
            prevTab: 'btnCancel' + self.referencia,
            text: self.lang.btnApply,
            tooltip: self.lang.ttBtnApply,
            iconCls: 'aplicar'
        });

        this.btnCancel = new Ext.Button({
            id: 'btnCancel' + self.referencia,
            nextTab: 'btnApply' + self.referencia,
            prevTab: 'taDescription' + self.referencia,
            text: self.lang.btnCancel,
            tooltip: self.lang.ttBtnCancel,
            iconCls: 'cancelar'
        });

        this.tfDenomination = this.tfDenomination || new Ext.form.TextField({
                id: 'tfDenomination' + self.referencia,
                nextTab: 'fdesde' + self.referencia,
                prevTab: 'btnAcept' + self.referencia,
                fieldLabel: self.lang.tfDenomination,
                name: 'denominacion',
                allowBlank: false,
                anchor: '100%',
                maxLength: 100,
                vtype: 'denominacion'
            });

        this.tfAbbreviation = this.tfAbbreviation || new Ext.form.TextField({
                id: 'tfAbbreviation' + self.referencia,
                nextTab: 'fdesde' + self.referencia,
                prevTab: 'tfDenomination' + self.referencia,
                fieldLabel: self.lang.tfAbrev,
                name: 'abreviatura',
                anchor: '100%',
                maxLength: 5
            });

        this.taDescription = this.taDescription || new Ext.form.TextArea({
                id: 'taDescription' + self.referencia,
                nextTab: 'btnCancel' + self.referencia,
                prevTab: 'fhasta' + self.referencia,
                fieldLabel: self.lang.taDescription,
                name: 'descripcion',
                anchor: '100%',
                height: 90,
                maxLength: 255
            });

        this.dfFrom = this.dfFrom || new Ext.form.DateField({
                name: 'fdesde',
                id: 'fdesde' + self.referencia,
                nextTab: 'fhasta' + self.referencia,
                prevTab: 'tfAbbreviation' + self.referencia,
                fieldLabel: self.lang.dfFrom,
                anchor: '98%',
                allowBlank: false,
                format: 'd/m/Y',
                value: new Date().format('d/m/Y'),
                vtype: 'daterange',
                endDateField: 'fhasta' + self.referencia
            });

        this.dfUp = this.dfUp || new Ext.form.DateField({
                name: 'fhasta',
                id: 'fhasta' + self.referencia,
                nextTab: 'taDescription' + self.referencia,
                prevTab: 'fdesde' + self.referencia,
                fieldLabel: self.lang.dfUp,
                anchor: '100%',
                format: 'd/m/Y',
                value: '',
                vtype: 'daterange',
                startDateField: 'fdesde' + self.referencia
            });

        this.form = new Ext.form.FormPanel({
            frame: true,
            region: 'center',
            bodyStyle: 'padding: 5px 5px 0',
            border: false,
            autoHeigth: true,
            labelWidth: 90, //Con esto hacemos mas pequeñas las etiquetas
            labelAlign: 'top',
            trackResetOnLoad: true,
            items: this.itemsForm || [
                self.tfDenomination,
                self.tfAbbreviation, {
                    layout: 'column',
                    items: [
                        {
                            columnWidth: .5,
                            layout: 'form',
                            items: [self.dfFrom]
                        },
                        {
                            columnWidth: .5,
                            layout: 'form',
                            items: [self.dfUp]
                        }
                    ]
                }, self.taDescription
            ]

        });

        this.items = [this.form];

        this.buttons = [this.btnCancel, this.btnApply, this.btnAcept];

        this.keys = [
            {
                key: Ext.EventObject.ENTER,
                stopEvent: true,
                fn: function () {
                    self.btnAcept.handler();
                }
            },
            {
                key: 'p',
                alt: true,
                ctrl: true,
                stopEvent: true,
                fn: function () {
                    if (!self.btnApply.disabled) {
                        self.btnApply.handler();
                    }

                }
            },
            {
                key: 'x',
                alt: true,
                stopEvent: true,
                fn: function () {
                    if (!self.btnCancel.disabled) {
                        self.btnCancel.handler();
                    }
                }
            }
        ];
        PVD.Persona.CmpNomenclador.ViewForm.superclass.initComponent.call(this);

    }
});

/**
 * Vista en forma de grid
 * @type {extend|*|void|extend|extend|extend}
 */
PVD.Persona.CmpNomenclador.ViewGrid = Ext.extend(Ext.grid.GridPanel, {
    border: false,
    initComponent: function () {
        //Variables
        var self = this;
        this.id = Ext.id();
        this.lang = Ext.applyIf(this.lang || {}, PVD.Persona.CmpNomenclador.Lang);
        var model = new PVD.Persona.CmpNomenclador.Model(this.url.getAll, this.mapping);

        //Configuraciones
        this.expander = new Ext.grid.RowExpander({
            tpl: new Ext.Template('<div style="word-wrap:break-word;margin-left:50px;"><b>Descripci&oacute;n</b>:</b>&nbsp;{descripcion}</p></div>'),
            enableCaching: false
        });

        this.autoExpandColumn = 'expandDenom' + this.id;

        this.loadMask = {
            msg: this.lang.loadMask
        };

        this.store = model.store;

        this.btnAdd = new Ext.Button({
            id: 'btnAdd' + self.referencia,
            text: this.lang.btnAdd,
            nextTab: 'btnChange' + self.referencia,
            prevTab: 'btnHelp_' + self.referencia,
            tooltip: this.lang.ttBtnAdd,
            scope: this,
            iconCls: 'adicionar'
        });

        this.btnChange = new Ext.Button({
            disabled: true,
            id: 'btnChange' + self.referencia,
            nextTab: 'btnRemove' + self.referencia,
            prevTab: 'btnAdd' + self.referencia,
            text: this.lang.btnChange,
            tooltip: this.lang.ttBtnChange,
            scope: this,
            iconCls: 'modificar'
        });

        this.btnRemove = new Ext.Button({
            disabled: true,
            id: 'btnRemove' + self.referencia,
            nextTab: 'btnExport' + self.referencia,
            prevTab: 'btnChange' + self.referencia,
            text: this.lang.btnRemove,
            scope: this,
            tooltip: this.lang.ttBtnRemove,
            iconCls: 'eliminar'

        });

        this.btnExport = new Ext.Button({
            id: 'btnExport' + self.referencia,
            nextTab: 'search' + self.referencia,
            prevTab: 'btnRemove' + self.referencia,
            text: this.lang.btnExport,
            tooltip: this.lang.ttBtnExport,
            iconCls: 'exportar'
        });
        this.btnHelp = new Ext.Button({
            id: 'btnHelp_' + self.referencia,
            text: this.lang.btnHelp,
            nextTab: 'btnAdd' + self.referencia,
            prevTab: 'search' + self.referencia,
            tooltip: this.lang.ttBtnHelp,
            iconCls: 'ayuda'

        });

        this.sm = new Ext.grid.RowSelectionModel({
            singleSelect: false

        });

        this.columns = [new Ext.grid.RowNumberer(), this.expander, {
            header: this.lang.colDenominacion,
            id: 'expandDenom' + self.id,
            sortable: true,
            resizable: false,
            dataIndex: 'denominacion',
            renderer: function (value, meta, record) {
                if (!Ext.isEmpty(record.get('bandera'))) {
                    return "<div class='flags_img " + record.get('bandera') + "' style='width: 16px; height: 16px;'><span style='margin-left: 20px; margin-top: 2px;'>" + value + "</span></div>";
                } else {
                    return "<sapn>" + value + "</sapan>";
                }

            }
        }, {
            header: this.lang.tfAbrev,
            sortable: true,
            width: 100,
            resizable: false,
            dataIndex: 'abreviatura'
        }, {
            header: this.lang.dfFrom,
            sortable: true,
            width: 100,
            resizable: false,
            dataIndex: 'fdesde'
        }, {
            header: this.lang.dfUp,
            sortable: true,
            width: 100,
            resizable: false,
            dataIndex: 'fhasta'
        }

        ];

        this.viewConfig = {
            getRowClass: function (record, index, rowParams, ds) {
                //rowParams.tstyle += 'background-color:' + record.data.colorf + ';';
                //rowParams.tstyle += "color:" + 'red;';
            }
        };

        this.plugins = this.expander;

        this.search = new Ext.app.SearchField({
            id: 'search' + self.referencia,
            nextTab: 'btnHelp_' + self.referencia,
            prevTab: 'btnExport' + self.referencia,
            store: self.store,
            toolTipTrigger1: this.lang.ttLimpiar,
            toolTipTrigger2: this.lang.ttBuscar,
            emptyText: this.lang.searchText
        });



        this.bbar = new Ext.PagingToolbar({
            store: self.store,
            displayInfo: true,
            displayMsg: this.lang.displayMsg + '{0} - {1} de {2} ',
            emptyMsg: this.lang.emptyMsg,
            pageSize: 15
        });

        this.tbar = [this.btnAdd, this.btnChange, this.btnRemove, this.btnExport, '-', this.search, '->', this.btnHelp];
        this.initComponentGestion(this.lang);

        this.btnAdd.on('click', function () {
            this.winGestion.setTitle(this.lang.titleWindAdd);

        }, this);

        this.btnChange.on('click', function () {
            this.winGestion.setTitle(this.lang.titleWindMod);
        }, this);

        this.keys = [
            {
                key: 'i',
                alt: true,
                stopEvent: true,
                fn: function () {
                    self.btnAdd.handler();
                    self.winGestion.setTitle(self.lang.titleWindAdd);
                }
            },
            {
                key: 'm',
                alt: true,
                stopEvent: true,
                fn: function () {
                    if (!self.btnChange.disabled) {
                        self.btnChange.handler();
                        self.winGestion.setTitle(self.lang.titleWindMod);
                    }

                }
            },
            {
                key: 46,
                stopEvent: true,
                fn: function () {
                    if (!self.btnRemove.disabled) {
                        self.btnRemove.handler();
                    }
                }
            },
            {
                key: 'h',
                stopEvent: true,
                alt: true,
                fn: function () {
                    self.btnHelp.handler();
                }
            },
            {
                key: 'e',
                stopEvent: true,
                alt: true,
                fn: function () {
                    self.btnExport.handler();
                }
            }, {
                key: 'b',
                stopEvent: true,
                alt: true,
                fn: function () {
                    Ext.getCmp('search' + self.referencia).onTrigger2Click();
                }
            }, {
                key: 'l',
                stopEvent: true,
                alt: true,
                fn: function () {
                    Ext.getCmp('search' + self.referencia).onTrigger1Click();
                }
            }
        ];
        PVD.Persona.CmpNomenclador.ViewGrid.superclass.initComponent.call(this);

        new PVD.Persona.CmpNomenclador.Controller(this, this.lang, this.url, this.newConf);
    },
    initComponentGestion: function (lang) {
        var self = this;
        Ext.apply(this, this.newConf);

        this.btnAcept = new Ext.Button({
            id: 'btnAcept' + self.referencia,
            nextTab: 'tfDenomination' + self.referencia,
            prevTab: 'btnApply' + self.referencia,
            text: lang.btnAcept,
            tooltip: lang.ttBtnAcept,
            iconCls: 'aceptar',
            disabled: true
        });

        this.btnApply = new Ext.Button({
            id: 'btnApply' + self.referencia,
            nextTab: 'btnAcept' + self.referencia,
            prevTab: 'btnCancel' + self.referencia,
            text: lang.btnApply,
            tooltip: lang.ttBtnApply,
            iconCls: 'aplicar',
            disabled: true
        });

        this.btnCancel = new Ext.Button({
            id: 'btnCancel' + self.referencia,
            nextTab: 'btnApply' + self.referencia,
            prevTab: 'taDescription' + self.referencia,
            text: lang.btnCancel,
            tooltip: lang.ttBtnCancel,
            iconCls: 'cancelar'
        });

        this.tfDenomination = this.tfDenomination || new Ext.form.TextField({
                id: 'tfDenomination' + self.referencia,
                nextTab: 'fdesde' + self.referencia,
                prevTab: 'btnAcept' + self.referencia,
                maskRe: /^[0-9a-zA-ZÁÉÍÓÚáéíóúñüÑ,()\\+\-_/.\s]$/,
                fieldLabel: lang.tfDenomination,
                itemCls: '.required .x-form-item-label {font-weight:bold;color:red;}',
                maxLength: 255,
                name: 'denominacion',
                allowBlank: false,
                anchor: '100%',
                enableKeyEvents: true,
                vtype: 'denominacion',
                listeners: {
                    keyup: function (tf, e) {
                        if (e.getKey() != 9) {
                            if (self.form.getForm().isValid()) {
                                self.btnApply.enable();
                                self.btnAcept.enable();
                            } else {
                                self.btnApply.disable();
                                self.btnAcept.disable();
                            }
                        }
                    }
                }
            });

        this.tfAbbreviation = this.tfAbbreviation || new Ext.form.TextField({
            id: 'tfAbbreviation' + self.referencia,
            nextTab: 'fdesde' + self.referencia,
            prevTab: 'tfDenomination' + self.referencia,
            maskRe: /^[0-9a-zA-ZÁÉÍÓÚáéíóúñüÑ()\\+\-_/.\s]$/,
            fieldLabel: self.lang.tfAbrev,
            name: 'abreviatura',
            anchor: '100%',
            maxLength: 5,
        });

        this.taDescription = this.taDescription || new Ext.form.TextArea({
                id: 'taDescription' + self.referencia,
                nextTab: 'btnCancel' + self.referencia,
                prevTab: 'fhasta' + self.referencia,
                fieldLabel: lang.taDescription,
                name: 'descripcion',
                anchor: '100%',
                height: 90,
                maxLength: 255,
                enableKeyEvents: true,
                listeners: {
                    keyup: function (tf, e) {
                        if (e.getKey() != 9) {
                            if (self.form.getForm().isValid()) {
                                self.btnApply.enable();
                                self.btnAcept.enable();
                            } else {
                                self.btnApply.disable();
                                self.btnAcept.disable();
                            }
                        }
                    }
                }
            });

        this.dfFrom = this.dfFrom || new Ext.form.DateField({
                name: 'fdesde',
                id: 'fdesde' + self.referencia,
                nextTab: 'fhasta' + self.referencia,
                prevTab: 'tfAbbreviation' + self.referencia,
                fieldLabel: lang.dfFrom,
                //fieldLabel: PVD.Lang.getTag('field', 'finicio'),
                anchor: '98%',
                allowBlank: false,
                format: 'd/m/Y',
                //format: 'j \\de F \\de Y',
                value: new Date().format('d/m/Y'),
                vtype: 'daterange',
                endDateField: 'fhasta' + self.referencia,
                enableKeyEvents: true,
                listeners: {
                    keypress: function (tf, e) {
                        if (e.getKey() != 9) {
                            if (self.form.getForm().isValid()) {
                                self.btnApply.enable();
                                self.btnAcept.enable();
                            } else {
                                self.btnApply.disable();
                                self.btnAcept.disable();
                            }
                        }
                    }
                }
            });

        this.dfUp = this.dfUp || new Ext.form.DateField({
                name: 'fhasta',
                id: 'fhasta' + self.referencia,
                nextTab: 'taDescription' + self.referencia,
                prevTab: 'fdesde' + self.referencia,
                fieldLabel: lang.dfUp,
                //fieldLabel: PVD.Lang.getTag('field', 'ffin'),
                anchor: '100%',
                format: 'd/m/Y',
                value: '',
                vtype: 'daterange',
                startDateField: 'fdesde' + self.referencia,
                enableKeyEvents: true,
                listeners: {
                    keypress: function (tf, e) {
                        if (e.getKey() != 9) {
                            if (self.form.getForm().isValid()) {
                                self.btnApply.enable();
                                self.btnAcept.enable();
                            } else {
                                self.btnApply.disable();
                                self.btnAcept.disable();
                            }
                        }
                    }
                }
            });

        this.form = new Ext.form.FormPanel({
            frame: true,
            region: 'center',
            bodyStyle: 'padding: 5px 5px 0',
            border: false,
            autoHeigth: true,
            labelWidth: 90, //Con esto hacemos mas pequeñas las etiquetas
            labelAlign: 'top',
            items: this.itemsForm || [
                self.tfDenomination,
                self.tfAbbreviation,
                {
                    layout: 'column',
                    items: [
                        {
                            columnWidth: .5,
                            layout: 'form',
                            items: [self.dfFrom]
                        },
                        {
                            columnWidth: .5,
                            layout: 'form',
                            items: [self.dfUp]
                        }
                    ]
                }, self.taDescription
            ]

        });

        this.winGestion = new Ext.Window({
            id: 'winGestion' + self.referencia,
            title: lang.titleWindAdd,
            autoValidate: true,
            validateDefault: true,
            border: false,
            modal: true,
            resizable: false,
            draggable: true,
            constrain: true,
            closeAction: 'hide',
            autoHeigth: true,
            width: 420,
            keys: [
                {
                    key: Ext.EventObject.ENTER,
                    stopEvent: true,
                    fn: function () {
                        self.btnAcept.handler();
                    }
                },
                {
                    key: 'p',
                    alt: true,
                    stopEvent: true,
                    fn: function () {
                        if (!self.btnApply.disabled) {
                            self.btnApply.handler();
                        }

                    }
                },
                {
                    key: 'x',
                    alt: true,
                    stopEvent: true,
                    fn: function () {
                        if (!self.btnCancel.disabled) {
                            self.btnCancel.handler();
                        }
                    }
                }
            ],
            items: [this.form],
            buttons: [this.btnCancel, this.btnApply, this.btnAcept]
        });

    },
    getHeader: function () {
        var self = this;
        var arrHeader = new Array();
        var cant = self.getColumnModel().getColumnCount();
        for (var i = 0; i < cant; i++
        ) {
            arrHeader[i] = self.getColumnModel().getColumnHeader(i);
        }
        return arrHeader;
    },
    enfocar: function () {
        this.btnAdd.focus(true, 200);
    }
});

/**
 * Vista en forma de combo
 * @type {extend|*|void|extend|extend|extend}
 */
PVD.Persona.CmpNomenclador.ViewCombo = Ext.extend(Ext.form.ComboBoxBtn, {
    forceSelection: true,
    mode: 'local',
    triggerAction: 'all',
    selectOnFocus: true,
    trigger1Class: 'x-form-refresh-trigger',
    hideParent: true,
    initComponent: function () {
        var lang = {};

        var model = new PVD.Persona.CmpNomenclador.Model(this.url, this.mapping || [], true);

        this.store = model.store;
        this.displayField = 'denominacion';
        PVD.Persona.CmpNomenclador.ViewCombo.superclass.initComponent.call(this);
        /*this.store.on('beforeload', function () {
            this.disable();
        }, this);
        this.store.on('load', function () {
            this.enable();
        }, this);*/

        this.handler = function () {
            this.store.reload();
        };
    }
});


/**
 * Modelo del componente
 * @type {{init: Function}}
 */
PVD.Persona.CmpNomenclador.Model = function (url, mapping, autoLoad) {

    this.store = new Ext.data.Store({
        url: url,
        autoLoad: autoLoad || false,
        reader: new Ext.data.JsonReader({
            totalProperty: 'quantity',
            root: 'data',
            id: 'idnomenclador'
        }, mapping)
    });

};

/**
 * Controlador del componente
 * @type {{init: Function}}
 */
PVD.Persona.CmpNomenclador.Controller = function (view, idioma, urls, newConf) {
    var lang = idioma;
    /**
     *Variables necesarias
     *
     */
    var variables = {
        accion: 'add',
        btnpress: 'acp',
        url: null
    };

    view.on('render', function (grid) {
        grid.getStore().load({params: {start: 0, limit: 15}});
    });

    view.on('click', function (e) {
        view.btnAdd.focus();
    });

    view.getStore().on('load', function (st, rec, opt) {
        view.getSelectionModel().selectFirstRow();

        if (rec.length == 0) {
            mostrarMensaje(1, lang.notSearch);
        }
    });

    /**
     *Mantener controlar el foco del boton adicionar del gridpanel al renderizar
     */
    view.on('render', function () {
        view.btnAdd.focus();
        view.btnApply.disable();
        view.btnAcept.disable();
    });

    /**
     * Dispara cuando ahy al cambio en la seleccion de los elemtos
     */
    view.getSelectionModel().on('selectionchange', function (sm) {
        if (sm.getCount() == 1) {
            view.btnChange.enable();
            view.btnRemove.enable();
        } else {
            if (sm.getCount() > 1) {
                view.btnChange.disable();
            } else {
                view.btnChange.disable();
                view.btnRemove.disable();
            }
        }
    });

    /**
     * Evento para controlar el foco del boton adicionar al cerrar la ventana
     */
    view.winGestion.on('hide', function () {
        view.btnAdd.focus();
        view.btnApply.disable();
        view.btnAcept.disable();
    });

    view.winGestion.on('show', function () {
        view.btnApply.disable();
        view.btnAcept.disable();
    });

    /**
     *Handler del boton Adicionar del gridpanel
     *
     */
    view.btnAdd.setHandler(function () {
        variables.accion = 'add';
        variables.url = urls.add;
        //view.winGestion.setTitle(lang.titleWindAdd);
        view.btnCancel.nextTab = 'btnApply' + view.referencia;
        view.btnAcept.prevTab = 'btnApply' + view.referencia;
        view.winGestion.show();
        //view.cambioModificar = true;
        view.btnApply.setVisible(true);
        view.form.getForm().reset();
        view.tfDenomination.focus(true, 100);
        view.fireEvent('settear',this);

    });

    /**
     *Handler del boton Modificar del gridpanel
     *
     */
    view.btnChange.setHandler(function () {

        if (view.getSelectionModel().getSelected().get('gestion')) {
            if (view.getSelectionModel().getSelected().get('gestion') != 1 ) {
                mostrarMensaje(6, 'El nomenclador seleccionado no es gestionable.');
            } else {
                variables.accion = 'mod';
                variables.url = urls.mod;
                //view.winGestion.setTitle(lang.titleWindMod);
                view.btnApply.hide();
                view.btnCancel.nextTab = 'btnAcept' + view.referencia;
                view.btnAcept.prevTab = 'btnCancel' + view.referencia;
                view.winGestion.show();
                view.form.getForm().loadRecord(view.getSelectionModel().getSelected());
                view.tfDenomination.focus(true, 100);
                view.btnAcept.disable();
            }
        } else {
            variables.accion = 'mod';
            variables.url = urls.mod;
            //view.winGestion.setTitle(lang.titleWindMod);
            view.btnApply.hide();
            view.btnCancel.nextTab = 'btnAcept' + view.referencia;
            view.btnAcept.prevTab = 'btnCancel' + view.referencia;
            view.winGestion.show();
            //view.cambioModificar = false;
            //view.tfDenomValueOrig = view.getSelectionModel().getSelected().get('denominacion');
            //view.taDescValueOrig = view.getSelectionModel().getSelected().get('descripcion');
            view.form.getForm().loadRecord(view.getSelectionModel().getSelected());
            view.tfDenomination.focus(true, 100);
            view.btnAcept.disable();
        }       
    });

    /**
     *Handler del boton Eliminar del gridpanel
     *
     */
    view.btnRemove.setHandler(function () {
        if (view.getSelectionModel().getSelected().get('gestion')) {
            if (view.getSelectionModel().getSelected().get('gestion') != 1 ) {
                mostrarMensaje(6, 'El nomenclador seleccionado no es gestionable.');
            } else {
                variables.url = urls.del;
                removeNomenclador(variables.url);
            }
        } else {
            variables.url = urls.del;
            removeNomenclador(variables.url);
        }       
    });

    /**
     * Handler del boton Exportar del gridpanel
     */
    view.btnExport.setHandler(function () {
        variables.url = urls.expt;
        variables.gridheader = view.getHeader();
        showReport(variables.url, variables.gridheader);
    });

    /**
     *Handler del boton Cancelar de la ventana
     *
     */
    view.btnCancel.setHandler(function () {
        view.winGestion.hide();
        view.btnApply.disable();
        view.btnAcept.disable();
    });

    view.btnAcept.on('disable', function () {
        view.btnCancel.nextTab = 'tfDenomination' + view.referencia;
        view.tfDenomination.prevTab = 'btnCancel' + view.referencia;
    });
    view.btnAcept.on('enable', function () {
        if (view.btnApply.hidden) {
            view.btnCancel.nextTab = 'btnAcept' + view.referencia;
        } else {
            view.btnCancel.nextTab = 'btnApply' + view.referencia;
        }
        view.tfDenomination.prevTab = 'btnAcept' + view.referencia;
    });

    /**
     *Handler del boton Aceptar de la ventana
     * @param accion='add'
     */
    view.btnAcept.setHandler(function () {
//        if (view.cambioModificar) {
        variables.btnpress = 'acp';
        addOrChangeNomenclador(variables.accion, variables.btnpress);
//        } else {
//            mostrarMensaje(6, 'No se puede modificar si no ha cambiado nada.');
//        }        
    });

    /**
     *Handler del boton Aplicar de la ventana
     * @param accion='apl'
     */
    view.btnApply.setHandler(function () {
        variables.btnpress = 'apl';
        addOrChangeNomenclador(variables.accion, variables.btnpress);
    });

    /**
     *Funcion para eliminar el nacionalidad seleccionado
     */
    function removeNomenclador(url) {
        var count = view.getSelectionModel().getCount();
        mostrarMensaje(2, count == 1 ? lang.msgAskDelS : lang.msgAskDelP, function (btn) {
            if (btn == 'ok') {
                var arr = new Array();
                Ext.each(view.getSelectionModel().getSelections(), function (rec) {
                    arr.push(rec.id);
                });
                PVD.mostrarMascara(view.id + 'mask', lang.msgWait, lang.msgWaitDel);
                Ext.Ajax.request({
                    url: url,
                    method: 'POST',
                    params: {
                        idnomenclador: Ext.encode(arr)
                    },
                    callback: function (options, success, response) {
                        var responseData = Ext.decode(response.responseText);
                        PVD.ocultarMascara(view.id + 'mask');
                        if (responseData.success) {
                            mostrarMensaje('1', count == 1 ? lang.msgDelS : lang.msgDelP);
                            view.getStore().reload();
                            view.btnChange.disable();
                            view.btnRemove.disable();
                            view.btnAdd.focus();
                        } else {
                            switch (responseData.codigo) {
                                case 23503:
                                    mostrarMensaje(6, lang.msgNotDel);
                                    break;
                                default :
                                    mostrarMensaje(6, lang.errorInterno);
                                    break;
                            }
                        }
                    }
                });
            }
        });
    }

    /**
     * Funcion para adicionar o modificar  nacionalidad
     * @param accion Especifica la accion requerida(add,mod)
     * @param btnpress Especifica el boton precionado de la ventena (acp,apl)
     */
    function addOrChangeNomenclador(accion, btnpress) {
        if (accion == 'add' || accion == 'mod') {
            if (view.form.getForm().isValid()) {
                PVD.mostrarMascara(view.id + 'mask', lang.msgWait, lang.msgSendServer);
                var values = view.form.getForm().getValues();
                Ext.Ajax.request({
                    url: variables.url,
                    method: 'POST',
                    params: {
                        idnomenclador: (accion != 'add') ? view.getSelectionModel().getSelected().id : null,
                        values: Ext.encode(values)
                    },
                    callback: function (options, success, response) {
                        var responseData = Ext.decode(response.responseText);
                        PVD.ocultarMascara(view.id + 'mask');
                        if (responseData.success) {
                            var msg = (accion == 'add') ? lang.msgAdd : lang.msgMod;
                            mostrarMensaje(7, msg);
                            if (btnpress == 'acp') {
                                view.winGestion.hide();
                                view.form.getForm().reset();
                                view.getStore().reload();
                            } else {
                                view.form.getForm().reset();
                                view.tfDenomination.focus(true, 100);
                                view.fireEvent('settear',this);
                                view.getStore().reload();

                            }
                        } else {
                            msg = (accion == 'add') ? lang.msgNotAdd : lang.msgNotMod;
                            mostrarMensaje(6, msg);
                        }
                    }
                });
            }
        } else {
            view.winGestion.hide();
            view.form.getForm().reset();
        }
    }

    /**
     * Funcion para mostrar el reporte de los nomecladores
     */
    function showReport(reporturl, headerdoc) {
        var header = new Array();
        header[0] = 'No.';
        header[headerdoc.length - 1] = 'Descripci&oacute;n';
        for (var i = 1; i < headerdoc.length - 1; i++
        ) {
            header[i] = headerdoc[parseInt(i) + 1];
        }
        var win = new Ext.components.winReporte({
            title: 'Configuración del reporte',
            modal: true,
            layout: 'border',
            params: {
                url: reporturl,
                tiporeporte: 'listado',
                columns: header
            }
        });
        win.show();
    }

};