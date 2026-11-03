//Ventana para seleccionar las opciones
Ext.namespace('Ext.SCFPChoseOpt');
Ext.SCFPChoseOpt = Ext.extend(Ext.Window, {
    lmask: undefined,
    sistemas: [],//{'distra': ['txt, 'xml']}
    constructor: function (params) {
        this.sistemas = params.sistemas;
        Ext.apply(this, {
            autoValidate: true,
            modal: true,
            constrain: true,
            // width: Ext.lib.Dom.getViewWidth() * 0.40,
            closeAction: 'destroy',
            frame: true,
            resizable: false,
            title: 'Seleccionar la configuraci&oacute;n',
            bodyStyle: 'padding:5px 10px 5px 10px',
            layout: 'border',
            height: 220,
            width: 400,
            // items: [scopePrintData.fContentPrintInPanelWest(), scopePrintData.fContentPrintInPanelCenter()],
            listeners: {
                scope: this,
                show: function () {
                },
                close: function () {
                }
            }
        });


        this.initializeClass();
        Ext.SCFPChoseOpt.superclass.constructor.call(this);

        this.addEvents({
            'envioDatos': true,
        });
    },
    loadMask: function (message) {
        if (!(this.lmask instanceof Ext.LoadMask && message === undefined)) {
            this.lmask = new Ext.LoadMask(this.body, {
                msg: message ? message : 'Cargando...'
            });
        }
        this.lmask.show();
    },
    hideMask: function () {
        if (this.lmask instanceof Ext.LoadMask) {
            this.lmask.hide();
        }
    },
    initializeClass: function () {
        this.initFunctions();
        this.createButtons();
        this.createForm();
        this.initEventos();
    },
    createButtons: function () {
        var me = this;
        this.btnCancelar = new Ext.Button({
            tooltip: 'Cancelar la configuraci&oacute;n y cerrar ventana',
            text: 'Cancelar',
            iconCls: 'cancelar',
            handler: function () {
                me.close();
            }
        });

        this.btnAceptar = new Ext.Button({
            tooltip: 'Cancelar la configuraci&oacute;n y cerrar ventana',
            text: 'Aceptar',
            iconCls: 'Aceptar configuraci&oacute;n',
            disabled: true
        });

        this.buttons = [this.btnCancelar, this.btnAceptar];
    },
    createForm: function () {

        this.stSysCont = new Ext.data.SimpleStore({
            fields: ['id', 'descripcion'],
            data: this.obtenerSistemas()
        });

        this.cbxSysCont = new Ext.form.ComboBox({
            tabIndex: 200,
            fieldLabel: 'Sistemas compatibles',
            store: this.stSysCont,
            valueField: 'id',
            displayField: 'descripcion',
            hiddenName: 'id',
            tpl: '<tpl for="."><div ext:qtip="{descripcion}" class="x-combo-list-item">{descripcion}</div></tpl>',
            anchor: '95%',
            typeAhead: true,
            mode: 'local',
            allowBlank: false,
            forceSelection: true,
            triggerAction: 'all',
            emptyText: 'Seleccione...',
            selectOnFocus: true
        });

        this.stTipoReporte = new Ext.data.SimpleStore({
            fields: ['id'],
            data: [['EXCEL'], ['DBF'], ['CMP']]
        })

        this.cbxTipoReporte = new Ext.form.ComboBox({
            tabIndex: 201,
            fieldLabel: 'Formato',
            store: this.stTipoReporte,
            disabled: true,
            valueField: 'id',
            displayField: 'id',
            hiddenName: 'tipo',
            tpl: '<tpl for="."><div ext:qtip="{id}" class="x-combo-list-item">{id}</div></tpl>',
            anchor: '95%',
            typeAhead: true,
            mode: 'local',
            allowBlank: false,
            forceSelection: true,
            triggerAction: 'all',
            emptyText: 'Seleccione...',
            selectOnFocus: true
        });

        this.fsOpciones = new Ext.form.FieldSet({
            // xtype: 'fieldset',
            title: 'Opciones',
            autoHeight: true,
            autoWidth: true,
            items: [this.cbxSysCont, this.cbxTipoReporte]
        });


        this.formSCFPChoseOpt = new Ext.FormPanel({
            frame: true,
            region: 'west',
            width: 220,
            autoHeight: true,
            // fileUpload: true,
            labelAlign: 'top',
            items: [this.fsOpciones]
        });

        this.dvImage = new Ext.DataView({
            id: 'dvImage',
            style: 'margin:25 0 0 20',
            store: new Ext.data.SimpleStore({
                fields: ['url', 'name'],
                data: []
            }),
            tpl: new Ext.XTemplate(
                '<tpl for=".">',
                '<div class="thumb-wrap" id="{name}">',
                '<div class="thumb"><img src="{url}" title="{name}"></div>',
                '<span class="x-editable">{shortName}</span></div>',
                '</tpl>',
                '<div class="x-clear"></div>'
            ),
            autoHeight: true,
            autoShow: true,
            overClass: 'x-view-over',
            itemSelector: 'div.thumb-wrap',
            emptyText: 'No existen im&aacute;genes para mostrar.'
        });

        this.fpContentPrintInPanelCenter = new Ext.form.FormPanel({
            frame: true,
            id: 'fpContentPrintInPanelCenter',
            region: 'center',
            labelAlign: 'top',
            items: [this.dvImage]
        });

        this.items = [this.formSCFPChoseOpt, this.fpContentPrintInPanelCenter];
    },
    initFunctions: function () {
        this.fDataStore = function (name) {
            return new Ext.data.SimpleStore({
                fields: ['url', 'name'],
                data: [["/contabilidad/comun/SCFPrintView/views/images/" + name + ".png", name]]
            });
        };

        this.obtenerSistemas = function () {
            var result = [];
            var keys = Object.keys(this.sistemas);
            for (var i = 0; i < keys.length; i++) {
                result.push([keys[i], keys[i].toUpperCase()]);
            }
            return result;
        };

        this.obtenerFormato = function (sistema) {
            var result = [];
            for (var i = 0; i < this.sistemas[sistema].length; i++) {
                result.push([this.sistemas[sistema][i].toUpperCase()]);
            }
            return result;
        };

        this.onClickAceptar = function () {
            var sistema = this.cbxSysCont.getValue();
            var formato = this.cbxTipoReporte.getValue();
            this.fireEvent('envioDatos', sistema, formato);
        };

    },
    initEventos: function () {
        this.cbxSysCont.on({
            scope: this,
            select: function (combo, record, index) {
                this.cbxTipoReporte.enable();
                this.cbxTipoReporte.reset();
                this.cbxTipoReporte.store.loadData(this.obtenerFormato(combo.getValue()));
            },
            render: function (combo) {
                var records = combo.store.getRange();
                if (records.length === 1) {
                    combo.setValue(records[0].get('id'));
                    combo.fireEvent('select', combo, records[0], 0);
                }
            }
        });

        this.cbxTipoReporte.on({
            scope: this,
            select: function (combo, record, index) {
                this.dvImage.setStore(this.fDataStore(combo.getValue()));
                // Ext.getCmp('lSize').hide();
            }
        });

        this.btnAceptar.on({
            scope: this,
            click: function () {
                this.onClickAceptar();
                this.hide();
                this.destroy();
            }
        });

    },
});