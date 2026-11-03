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
    autoHeigth: true,
    width: 420,
    initComponent: function ()
    {
        var self = this;
        Ext.apply(this, this.newConf);

        this.btnAcept = new Ext.Button({
            id: 'btnAcept' + self.id,
            nextTab: 'tfDenomination' + self.id,
            prevTab: 'btnApply' + self.id,
            text: self.lang.btnAcept,
            tooltip: self.lang.ttBtnAcept,
            iconCls: 'btn',
            icon: perfil.dirImg + 'aceptar.png'
        });

        this.btnApply = new Ext.Button({
            id: 'btnApply' + self.id,
            nextTab: 'btnAcept' + self.id,
            prevTab: 'btnCancel' + self.id,
            text: self.lang.btnApply,
            tooltip: self.lang.ttBtnApply,
            iconCls: 'btn',
            icon: perfil.dirImg + 'aplicar.png'
        });

        this.btnCancel = new Ext.Button({
            id: 'btnCancel' + self.id,
            nextTab: 'btnApply' + self.id,
            prevTab: 'taDescription' + self.id,
            text: self.lang.btnCancel,
            tooltip: self.lang.ttBtnCancel,
            iconCls: 'btn',
            icon: perfil.dirImg + 'cancelar.png'
        });

        this.tfDenomination = this.tfDenomination || new Ext.form.TextField({
            id: 'tfDenomination' + self.id,
            nextTab: 'fdesde' + self.id,
            prevTab: 'btnAcept' + self.id,
            fieldLabel: self.lang.tfDenomination,
            name: 'denominacion',
            allowBlank: false,
            anchor: '100%'
        });

        this.taDescription = this.taDescription || new Ext.form.TextArea({
            id: 'taDescription' + self.id,
            nextTab: 'btnCancel' + self.id,
            prevTab: 'fhasta' + self.id,
            fieldLabel: self.lang.taDescription,
            name: 'descripcion',
            anchor: '100%',
            height: 90
        });

        this.dfFrom = this.dfFrom || new Ext.form.DateField({
            name: 'fdesde',
            id: 'fdesde' + self.id,
            nextTab: 'fhasta' + self.id,
            prevTab: 'tfDenomination' + self.id,
            fieldLabel: self.lang.dfFrom,
            anchor: '98%',
            allowBlank: false,
            format: 'd/m/Y',
            //format: 'j \\de F \\de Y',
            value: new Date().format('d/m/Y'),
            vtype: 'daterange',
            endDateField: 'fhasta' + self.id
        });

        this.dfUp = this.dfUp || new Ext.form.DateField({
            name: 'fhasta',
            id: 'fhasta' + self.id,
            nextTab: 'taDescription' + self.id,
            prevTab: 'fdesde' + self.id,
            fieldLabel: self.lang.dfUp,
            anchor: '100%',
            format: 'd/m/Y',
            value: '',
            vtype: 'daterange',
            startDateField: 'fdesde' + self.id
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
                self.tfDenomination, {
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
                fn: function ()
                {
                    self.btnAcept.handler();
                }
            },
            {
                key: 'p',
                alt: true,
                stopEvent: true,
                fn: function ()
                {
                    if (!self.btnApply.disabled) {
                        self.btnApply.handler();
                    }

                }
            },
            {
                key: 'x',
                alt: true,
                stopEvent: true,
                fn: function ()
                {
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
    initComponent: function ()
    {
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
            id: 'btnAdd' + self.id,
            text: this.lang.btnAdd,
            nextTab: 'btnChange' + self.id,
            prevTab: 'btnHelp' + self.id,
            tooltip: this.lang.ttBtnAdd,
            scope: this,
            icon: perfil.dirImg + 'adicionar.png',
            iconCls: 'btn'
        });

        this.btnChange = new Ext.Button({
            disabled: true,
            id: 'btnChange' + self.id,
            nextTab: 'btnRemove' + self.id,
            prevTab: 'btnAdd' + self.id,
            text: this.lang.btnChange,
            tooltip: this.lang.ttBtnChange,
            scope: this,
            icon: perfil.dirImg + 'modificar.png',
            iconCls: 'btn'
        });

        this.btnRemove = new Ext.Button({
            disabled: true,
            id: 'btnRemove' + self.id,
            nextTab: 'btnExport' + self.id,
            prevTab: 'btnChange' + self.id,
            text: this.lang.btnRemove,
            scope: this,
            tooltip: this.lang.ttBtnRemove,
            icon: perfil.dirImg + 'eliminar.png',
            iconCls: 'btn'

        });

        this.btnExport = new Ext.Button({
            id: 'btnExport' + self.id,
            nextTab: 'search' + self.id,
            prevTab: 'btnRemove' + self.id,
            text: this.lang.btnExport,
            tooltip: this.lang.ttBtnExport,
            icon: perfil.dirImg + 'exportar.png',
            iconCls: 'btn'
        });

        this.btnHelp = new Ext.Button({
            id: 'btnHelp' + self.id,
            text: this.lang.btnHelp,
            nextTab: 'btnAdd' + self.id,
            prevTab: 'search' + self.id,
            tooltip: this.lang.ttBtnHelp,
            icon: perfil.dirImg + 'ayuda.png',
            iconCls: 'btn'

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
            renderer: function (value, meta, record)
            {
                if (!Ext.isEmpty(record.get('bandera'))) {
                    return "<div class='flags_img " + record.get('bandera') + "' style='width: 16px; height: 16px;'><span style='margin-left: 20px; margin-top: 2px;'>" + value + "</span></div>";
                } else {
                    return "<sapn>" + value + "</sapan>";
                }

            }
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
            getRowClass: function (record, index, rowParams, ds)
            {
                //rowParams.tstyle += 'background-color:' + record.data.colorf + ';';
                //rowParams.tstyle += "color:" + 'red;';
            }
        };

        this.plugins = this.expander;

        this.search = new Ext.app.SearchField({
            id: 'search' + self.id,
            nextTab: 'btnHelp' + self.id,
            prevTab: 'btnExport' + self.id,
            store: self.store,
            emptyText: this.lang.searchText
        });

        this.bbar = new Ext.PagingToolbar({
            store: self.store,
            displayInfo: true,
            displayMsg: this.lang.displayMsg + '{0} - {1} de {2} ',
            emptyMsg: this.lang.emptyMsg,
            pageSize: 15
        });

        this.tbar = [this.btnAdd, this.btnChange, this.btnRemove, this.btnExport , '-', this.search, '->', this.btnHelp];

        /*this.winGestion = new PVD.Persona.CmpNomenclador.ViewForm({
         id: 'form-' + this.getId(),
         lang: lang,
         newConf: this.newConf || null
         });*/
        this.initComponentGestion(this.lang);

        this.btnAdd.on('click', function ()
        {
            this.winGestion.setTitle(this.lang.titleWindAdd);
        }, this);

        this.btnChange.on('click', function ()
        {
            this.winGestion.setTitle(this.lang.titleWindMod);
        }, this);

        this.keys = [
            {
                key: 'i',
                alt: true,
                stopEvent: true,
                fn: function ()
                {
                    self.btnAdd.handler();
                }
            },
            {
                key: 'm',
                alt: true,
                stopEvent: true,
                fn: function ()
                {
                    if (!self.btnChange.disabled) {
                        self.btnChange.handler();
                    }

                }
            },
            {
                key: 46,
                stopEvent: true,
                fn: function ()
                {
                    if (!self.btnRemove.disabled) {
                        self.btnRemove.handler();
                    }
                }
            },
            {
                key: 'h',
                stopEvent: true,
                alt: true,
                fn: function ()
                {
                    self.btnHelp.handler();
                }
            },
            {
                key: 'e',
                stopEvent: true,
                alt: true,
                fn: function ()
                {
                    self.btnExport.handler();
                }
            }
        ];
        PVD.Persona.CmpNomenclador.ViewGrid.superclass.initComponent.call(this);
        new PVD.Persona.CmpNomenclador.Controller(this, this.lang, this.url, this.newConf);
    },
    initComponentGestion: function (lang)
    {
        var self = this;
        Ext.apply(this, this.newConf);

        this.btnAcept = new Ext.Button({
            id: 'btnAcept' + self.id,
            nextTab: 'tfDenomination' + self.id,
            prevTab: 'btnApply' + self.id,
            text: lang.btnAcept,
            tooltip: lang.ttBtnAcept,
            iconCls: 'btn',
            icon: perfil.dirImg + 'aceptar.png'
        });

        this.btnApply = new Ext.Button({
            id: 'btnApply' + self.id,
            nextTab: 'btnAcept' + self.id,
            prevTab: 'btnCancel' + self.id,
            text: lang.btnApply,
            tooltip: lang.ttBtnApply,
            iconCls: 'btn',
            icon: perfil.dirImg + 'aplicar.png'
        });

        this.btnCancel = new Ext.Button({
            id: 'btnCancel' + self.id,
            nextTab: 'btnApply' + self.id,
            prevTab: 'taDescription' + self.id,
            text: lang.btnCancel,
            tooltip: lang.ttBtnCancel,
            iconCls: 'btn',
            icon: perfil.dirImg + 'cancelar.png'
        });

        this.tfDenomination = this.tfDenomination || new Ext.form.TextField({
            id: 'tfDenomination' + self.id,
            nextTab: 'fdesde' + self.id,
            prevTab: 'btnAcept' + self.id,
            fieldLabel: lang.tfDenomination,
            name: 'denominacion',
            allowBlank: false,
            anchor: '100%'
        });

        this.taDescription = this.taDescription || new Ext.form.TextArea({
            id: 'taDescription' + self.id,
            nextTab: 'btnCancel' + self.id,
            prevTab: 'fhasta' + self.id,
            fieldLabel: lang.taDescription,
            name: 'descripcion',
            anchor: '100%',
            height: 90
        });

        this.dfFrom = this.dfFrom || new Ext.form.DateField({
            name: 'fdesde',
            id: 'fdesde' + self.id,
            nextTab: 'fhasta' + self.id,
            prevTab: 'tfDenomination' + self.id,
            fieldLabel: lang.dfFrom,
            anchor: '98%',
            allowBlank: false,
            format: 'd/m/Y',
            //format: 'j \\de F \\de Y',
            value: new Date().format('d/m/Y'),
            vtype: 'daterange',
            endDateField: 'fhasta' + self.id
        });

        this.dfUp = this.dfUp || new Ext.form.DateField({
            name: 'fhasta',
            id: 'fhasta' + self.id,
            nextTab: 'taDescription' + self.id,
            prevTab: 'fdesde' + self.id,
            fieldLabel: lang.dfUp,
            anchor: '100%',
            format: 'd/m/Y',
            value: '',
            vtype: 'daterange',
            startDateField: 'fdesde' + self.id
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
                self.tfDenomination, {
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
            title: lang.titleWindAdd,
            border: false,
            modal: true,
            closeAction: 'hide',
            autoHeigth: true,
            width: 420,
            keys: [
                {
                    key: Ext.EventObject.ENTER,
                    stopEvent: true,
                    fn: function ()
                    {
                        self.btnAcept.handler();
                    }
                },
                {
                    key: 'p',
                    alt: true,
                    stopEvent: true,
                    fn: function ()
                    {
                        if (!self.btnApply.disabled) {
                            self.btnApply.handler();
                        }

                    }
                },
                {
                    key: 'x',
                    alt: true,
                    stopEvent: true,
                    fn: function ()
                    {
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
    getHeader: function ()
    {
        var self = this;
        var arrHeader = new Array();
        var cant = self.getColumnModel().getColumnCount();
        for (var i = 0; i < cant; i++
            ) {
            arrHeader[i] = self.getColumnModel().getColumnHeader(i);
        }
        return arrHeader;
    },
    enfocar: function ()
    {
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
    initComponent: function ()
    {
        var lang = {};

        var model = new PVD.Persona.CmpNomenclador.Model(this.url, this.mapping || [], true);

        this.store = model.store;
        this.displayField = 'denominacion';
        PVD.Persona.CmpNomenclador.ViewCombo.superclass.initComponent.call(this);
        this.store.on('beforeload', function ()
        {
            this.disable();
        }, this);
        this.store.on('load', function ()
        {
            this.enable();
        }, this);

        this.handler = function ()
        {
            this.store.reload();
        };
    }
});

/**
 * Modelo del componente
 * @type {{init: Function}}
 */
PVD.Persona.CmpNomenclador.Model = function (url, mapping, autoLoad)
{

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
PVD.Persona.CmpNomenclador.Controller = function (view, idioma, urls, newConf)
{
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

    view.on('render', function (grid)
    {
        grid.getStore().load();
    });

    /**
     *Mantener controlar el foco del boton adicionar del gridpanel al renderizar
     */
    view.on('render', function ()
    {
        view.btnAdd.focus();
    });

    /**
     * Dispara cuando ahy al cambio en la seleccion de los elemtos
     */
    view.getSelectionModel().on('selectionchange', function (sm)
    {
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
    view.winGestion.on('hide', function ()
    {
        view.btnAdd.focus();
    });

    /**
     *Handler del boton Adicionar del gridpanel
     *
     */
    view.btnAdd.setHandler(function ()
    {
        variables.accion = 'add';
        variables.url = urls.add;
        //view.winGestion.setTitle(lang.titleWindAdd);
        view.winGestion.show();
        view.btnApply.setVisible(true);
        view.form.getForm().reset();
        view.tfDenomination.focus(true, 100);
    });

    /**
     *Handler del boton Modificar del gridpanel
     *
     */
    view.btnChange.setHandler(function ()
    {
        variables.accion = 'mod';
        variables.url = urls.mod;
        //view.winGestion.setTitle(lang.titleWindMod);
        view.btnApply.hide();
        view.winGestion.show();
        view.form.getForm().loadRecord(view.getSelectionModel().getSelected());

    });

    /**
     *Handler del boton Eliminar del gridpanel
     *
     */
    view.btnRemove.setHandler(function ()
    {
        variables.url = urls.del;
        removeNomenclador(variables.url);
    });

    /**
     * Handler del boton Exportar del gridpanel
     */
    view.btnExport.setHandler(function ()
    {
        variables.url = urls.expt;
        variables.gridheader = view.getHeader();
        showReport(variables.url, variables.gridheader);
    });

    /**
     *Handler del boton Cancelar de la ventana
     *
     */
    view.btnCancel.setHandler(function ()
    {
        view.winGestion.hide();
    });

    /**
     *Handler del boton Aceptar de la ventana
     * @param accion='add'
     */
    view.btnAcept.setHandler(function ()
    {
        variables.btnpress = 'acp';
        addOrChangeNomenclador(variables.accion, variables.btnpress);
    });

    /**
     *Handler del boton Aplicar de la ventana
     * @param accion='apl'
     */
    view.btnApply.setHandler(function ()
    {
        variables.btnpress = 'apl';
        addOrChangeNomenclador(variables.accion, variables.btnpress);
    });

    /**
     *Funcion para eliminar el nacionalidad seleccionado
     */
    function removeNomenclador(url)
    {
        mostrarMensaje(2, lang.msgAskDel, function (btn)
        {
            if (btn == 'ok') {
                var arr = new Array();
                Ext.each(view.getSelectionModel().getSelections(), function (rec)
                {
                    arr.push(rec.id);
                });
                PVD.mostrarMascara(view.id + 'mask', lang.msgWait, lang.msgWaitDel);
                Ext.Ajax.request({
                    url: url,
                    method: 'POST',
                    params: {
                        idnomenclador: Ext.encode(arr)
                    },
                    callback: function (options, success, response)
                    {
                        var responseData = Ext.decode(response.responseText);
                        PVD.ocultarMascara(view.id + 'mask');
                        if (responseData.success) {
                            mostrarMensaje('1', lang.msgDel);
                            view.getStore().reload();
                            view.btnChange.disable();
                            view.btnRemove.disable();
                            view.btnAdd.focus();
                        } else {
                            if (!responseData.success) {
                                mostrarMensaje('3', lang.msgNotDel);
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
    function addOrChangeNomenclador(accion, btnpress)
    {

        if (accion == 'add' || accion == 'mod') {
            if (view.form.getForm().isValid()) {
                PVD.mostrarMascara(view.id + 'mask', lang.msgWait, lang.msgSendServer);
                var values = view.form.getForm().getValues();
                /* values.fdesde = view.winGestion.dfFrom.getValue().format('d/m/Y');
                 values.fhasta = values.fhasta ? view.winGestion.dfUp.getValue().format('d/m/Y') : null;*/
                Ext.Ajax.request({
                    url: variables.url,
                    method: 'POST',
                    params: {
                        idnomenclador: (accion != 'add') ? view.getSelectionModel().getSelected().id : null,
                        values: Ext.encode(values)
                    },
                    /* params: {
                     idnomenclador: (accion != 'add') ? view.getSelectionModel().getSelected().id : null,
                     denominacion: view.winGestion.tfDenomination.getValue(),
                     fdesde: view.winGestion.dfFrom.getRawValue(),
                     fhasta: view.winGestion.dfUp.getRawValue(),
                     descripcion: view.winGestion.taDescription.getValue(),
                     bandera: (Ext.getCmp(view.winGestion.cmbFlags)) ? view.winGestion.cmbFlags.getValue() : null
                     },*/
                    callback: function (options, success, response)
                    {
                        var responseData = Ext.decode(response.responseText);
                        PVD.ocultarMascara(view.id + 'mask');
                        if (responseData.success) {
                            var msg = (accion == 'add') ? lang.msgAdd : lang.msgMod;
                            mostrarMensaje('1', msg);
                            if (btnpress == 'acp') {
                                view.winGestion.hide();
                                view.form.getForm().reset();
                            } else {
                                view.form.getForm().reset();
                                view.tfDenomination.focus(true, 100);
                            }
                            view.getStore().reload();

                        } else {
                            msg = (accion == 'add') ? lang.msgNotAdd : lang.msgNotMod;
                            mostrarMensaje('3', msg);
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
    function showReport(reporturl, headerdoc)
    {
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