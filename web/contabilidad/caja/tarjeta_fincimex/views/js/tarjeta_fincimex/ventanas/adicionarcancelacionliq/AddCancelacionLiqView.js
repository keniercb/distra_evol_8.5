Ext.namespace('Ext.GestionarTarjetaAddCanLiq');
Ext.GestionarTarjetaAddCanLiq.View = Ext.extend(Ext.Window, {
    lmask: undefined,
    etiquetas: undefined,
    constructor: function (model, params) {
        this.crearSetsAndGets();
        this.setModel(model);
        this.setEtiquetas(params.etiquetas);
        this.setModoVentana(params.modo);

        Ext.apply(this, {
            autoValidate: false,
            modal: true,
            constrain: true,
            width: Ext.lib.Dom.getViewWidth() * 0.60,
            closeAction: 'destroy',
            frame: true,
            resizable: false,
            title: this.crearTitulo(),
            listeners: {
                scope: this,
                show: function () {

                },
                close: function () {
                }
            }
        });
        this.initializeClass();
        Ext.GestionarTarjetaAddCanLiq.View.superclass.constructor.call(this);
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
    crearTitulo: function()
    {
        var modo = this.getModoVentana();
        var title = '(??)';
        if (modo === 'add') {
            title = 'Cancelar liquidaciones';
        } else if (modo === 'ver') {
            title = 'Ver';
        }
        return title;
    },
    crearFormSteps: function()
    {
        this.setFormSteps(new Ext.FormSteps(this.getForm(), this.buttons));
        this.fireEvent('FormStepsCreado', this.getFormSteps());
        return this.getFormSteps();
    },
    initializeClass: function () {
        this.createButtons();
        this.setWindowItems(this.getModel());
        this.initializeItemsGets();
    },
    createButtons: function () {
        this.btnCancelar = new Ext.Button({
            // tooltip: scope.etiquetas.lbToolCancelar,
            text: 'Cancelar',
            iconCls: 'cancelar',
            scope: this,
            handler: function (btn) {
                this.close();
            }
        });

        this.btnAceptar = new Ext.Button({
            // tooltip: scope.etiquetas.lbToolAceptar,
            text: 'Aceptar',
            iconCls: 'Aceptar',
            disabled: true
        });

        if (this.modo == 'add') {
            this.buttons = [this.btnCancelar, this.btnAceptar];
        } else {
            this.buttons = [this.btnCancelar];
        }

    },
    createForm: function (model) {

        this.tfCheck = new Ext.form.TextField({
            disabledClass: 'disabled-component',
            fieldLabel: 'Check',
            hidden: true,
            name: 'check',
            allowBlank: false,
            // anchor: '95%'
        });

        var form = new Ext.FormPanel({
            frame: true,
            hidden: true,
            layout: 'form',
            autoHeight: true,
            labelWidth: 50,
            labelAlign: 'top',
            trackResetOnLoad: true,
            items: [{
                // labelAlign: 'top',
                hidden: true,
                layout: 'column',
                items: [this.tfCheck]
            }
            ]
        });
        this.setForm(form);
        return form;
    },
    crearGridCancelarLiquidacionFincimex: function (model) {

        var tbar = [];

        var selModel = new Ext.grid.CheckboxSelectionModel({
            // singleSelect: true,
            id: 'row',
            width: 40,
            align: 'right',
        });

        var columns = [
            selModel,
            {
                header: 'Numero tarjeta',
                dataIndex: 'numerotarjeta',
                width: 160,
                sortable: true,
                hidden: true,
                align: 'left'
            }, {
                header: 'Responsable',
                dataIndex: 'nompersona',
                id: 'idresponsable',
                align: 'left',
                sortable: true,
            }, {
                header: 'Fecha',
                dataIndex: 'fecha',
                width: 80,
                align: 'center',
                sortable: true
            }, {
                header: 'Estado',
                dataIndex: 'idestado',
                width: 100,
                align: 'center',
                sortable: true,
                renderer: function (value, metadata, record, rowIndex, colIndex, store) {
                    if (record.get('idestado') == 9) {
                        return 'Liquidado';
                    } else if (record.get('idestado') == 10) {
                        return 'Liquidado parcial';
                    }
                }
            }, {
                header: 'Combustible',
                dataIndex: 'nomcombustible',
                width: 100,
                align: 'left',
                sortable: true,
                hidden: true
            }, {
                header: 'Precio combustible',
                dataIndex: 'preciocombustible',
                renderer: 'formatoMoneda',
                width: 100,
                align: 'center',
                sortable: true,
                hidden: true
            }, {
                header: 'Importe Anticipado',
                dataIndex: 'importeant',
                renderer: 'formatoMoneda',
                width: 80,
                align: 'center',
                sortable: true
            }, {
                header: 'Importe Liquidado',
                dataIndex: 'importeliq',
                width: 80,
                renderer: 'formatoMoneda',
                align: 'center',
                sortable: true
            }, {
                header: 'Litros Anticipados',
                width: 100,
                align: 'center',
                sortable: true,
                // hidden: true,
                renderer: function (value, metadata, record, rowIndex, colIndex, store) {
                    return parseFloat(record.get('importeant') / record.get('preciocombustible')).toFixed(2);
                }
            }, {
                header: 'Litros Liquidados',
                width: 100,
                align: 'center',
                sortable: true,
                // hidden: true,
                renderer: function (value, metadata, record, rowIndex, colIndex, store) {
                    return parseFloat(record.get('importeliq') / record.get('preciocombustible')).toFixed(2);
                }
            }
        ];

        return this.gridLiquidaciones = new Ext.grid.GridPanel({
            // title: 'Anticipos',
            // layout: 'fit',
            view: new Ext.grid.GroupingView({
                // forceFit: true,
                groupTextTpl: "{[values.rs[0].data.numerotarjeta]}"
            }),
            autoExpandColumn: 'idresponsable',
            autoExpandMin: 130,
            height: Ext.lib.Dom.getViewHeight() * 0.4,
            store: model.getStoreGridCancelarLiquidacionFincimex(),
            stripeRows: true,
            loadMask: true,
            sm: selModel,
            columns: columns,
            tbar: tbar
        });

    },
    setWindowItems: function (model) {
        this.items = [this.createForm(model), this.crearGridCancelarLiquidacionFincimex(model)];
    },
    crearSetsAndGets: function()
    {
        this.setModel = function (model) {
            this.model = model;
        };
        this.getModel = function () {
            return this.model;
        };
        this.setForm = function (form) {
            this.formConf = form;
        };
        this.getForm = function () {
            return this.formConf;
        };
        this.setEtiquetas = function (etiquetas) {
            this.etiquetas = etiquetas;
        };
        this.getEtiquetas = function () {
            return this.etiquetas;
        };
        this.setFormSteps = function (formSteps) {
            this.formSteps = formSteps;
        };
        this.getFormSteps = function () {
            return this.formSteps;
        };
        this.setModoVentana = function (modo) {
            //add mod ver -- son los modos
            this.modo = modo;
        };
        this.getModoVentana = function () {
            return this.modo;
        };
    },
    initializeItemsGets: function()
    {
        this.getGridLiquidaciones = function () {
            return this.gridLiquidaciones;
        };
        this.getCbOperacion = function () {
            return this.cbOperacion;
        };
        this.getNfImporteAnt = function () {
            return this.nfImporteAnt;
        };
        this.getTfCheck = function () {
            return this.tfCheck;
        };
        this.getDfFechaEditor = function () {
            return this.dfFecha;
        };
        this.getDfFechaOperacion = function () {
            return this.dfFechaOperacion;
        };
    }
});
