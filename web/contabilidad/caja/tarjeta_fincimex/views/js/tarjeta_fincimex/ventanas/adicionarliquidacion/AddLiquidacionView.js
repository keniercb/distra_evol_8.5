Ext.namespace('Ext.GestionarTarjetaAddLiq');
Ext.GestionarTarjetaAddLiq.View = Ext.extend(Ext.Window, {
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
        Ext.GestionarTarjetaAddLiq.View.superclass.constructor.call(this);
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
            title = 'Adicionar liquidacion';
        } else if (modo === 'ver') {
            title = 'Ver liquidacion';
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

        this.cbOperacion = new Ext.form.ComboBox({
            fieldLabel: 'Operación',
            store: model.getStoreOperacion(),
            name: 'idoperacion',
            valueField: 'idnomoperaciones',
            hiddenName: 'idnomoperaciones',
            displayField: 'denominacion',
            // emptyText: this.idioma.lbSeleccione, //'Seleccione...',
            emptyText: 'Seleccione...',
            disabledClass: 'disabled-component',
            editable: false,
            mode: 'local',
            forceSelection: true,
            allowBlank: false,
            resizable: true,
            triggerAction: 'all',
            anchor: '100%',
            maskRe: /^([a-zA-Z0-9 \xf3\xf1\xe1\xe9\xed\xfa\xd1]+ ?[a-zA-Z]*)+$/,
            tpl: '<tpl for="."><div ext:qtip="{denominacion}" class="x-combo-list-item">{denominacion}</div></tpl>',
        });

        this.tfCheckLiquidacion = new Ext.form.TextField({
            disabledClass: 'disabled-component',
            fieldLabel: 'Check',
            hidden: true,
            name: 'check',
            allowBlank: false,
            // anchor: '95%'
        });

        this.tfCheckImporte = new Ext.form.TextField({
            disabledClass: 'disabled-component',
            // fieldLabel: 'Check',
            hidden: true,
            name: 'checkimporte',
            allowBlank: false,
            // anchor: '95%'
        });

        this.ckbDevolverACaja = new Ext.form.Checkbox({
            boxLabel: 'Retornar saldo a caja',
            hideLabel: true,
            checked: false,
            name: 'retcaja',
            selectOnFocus: true,
            labelAlign: 'right',
            // enableKeyEvents: true,
            anchor: '100%',
        });

        var form = new Ext.FormPanel({
            frame: true,
            layout: 'form',
            autoHeight: true,
            labelWidth: 50,
            labelAlign: 'top',
            trackResetOnLoad: true,
            items: [{
                labelAlign: 'top',
                layout: 'column',
                autoHeight: true,
                items: [{
                    style: 'margin:0 0 0 5',
                    layout: 'form',
                    columnWidth: 0.75,
                    items: [this.cbOperacion]
                }, {
                    style: 'margin: 12 0 0 10',
                    layout: 'form',
                    columnWidth: 0.25,
                    items: [this.ckbDevolverACaja]
                }]
            }, {
                // labelAlign: 'top',
                hidden: true,
                layout: 'column',
                items: [this.tfCheckLiquidacion]
            }, {
                // labelAlign: 'top',
                hidden: true,
                layout: 'column',
                items: [this.tfCheckImporte]
            }
            ]
        });
        this.setForm(form);
        return form;
    },
    crearGridLiquidacionesFincimex: function (model) {

        this.dfFechaInicio = new Ext.form.DateField({
            // fieldLabel: this.idioma.lbFechaRecarga,
            fieldLabel: 'Fecha inicio',
            // allowBlank: false,
            name: 'fecha',
            format: 'd/m/Y',
            anchor: '100%',
            // minValue: fechaInicio,
            // maxValue: new Date()
        });

        this.dfFechaFin = new Ext.form.DateField({
            // fieldLabel: this.idioma.lbFechaRecarga,
            fieldLabel: 'Fecha fin',
            // allowBlank: false,
            name: 'fecha',
            format: 'd/m/Y',
            anchor: '100%',
            // minValue: fechaInicio,
            // maxValue: new Date()
        });

        this.ldFechaInicio = new Ext.form.Label({
            text: 'Fecha inicio:\u00A0',
            style: 'font-weight:bold;'
        });

        this.ldFechaFin = new Ext.form.Label({
            text: 'Fecha fin:\u00A0',
            style: 'font-weight:bold;'
        });

        var tbar = [this.ldFechaInicio, this.dfFechaInicio, '-', this.ldFechaFin, this.dfFechaFin];

        this.nfChip = new Ext.form.NumberField({
            allowBlank: true,
            anchor: '95%',
            name: 'chip',
            // fieldLabel: this.idioma.lbChip,
            fieldLabel: 'Chip',
            maxLength: 16,
            // maxLengthText: this.idioma.lbMaxLengthText16,
            maxLengthText: 'No puede ser mayor de 16',
        });


        this.cbxCuenta = new Ext.contabilidad.util.linkedCombo({
            disabledClass: 'disabled-component',
            store: model.getStoreCuenta(),
            // fieldLabel: this.idioma.lbCuentaGasto,
            fieldLabel: 'Cuenta gasto',
            displayField: 'text',
            valueField: 'idcuenta',
            mode: 'local',
            hideTbar: true,
            listHeight: 200,
            tabIndex: 4,
            // anchor: '97%',
            disabled: true,
            listeners: {
                scope: this,
            }
        });

        // this.dfFecha = new Ext.form.DateField({
        //     fieldLabel: 'Fecha',
        //     allowBlank: false,
        //     name: 'fecha',
        //     format: 'd/m/Y', invalidText: 'El formato establecido: dd/mm/aaaa.',
        //     anchor: '95%',
        //     // minValue: fechaInicio,
        //     // maxValue: new Date()
        // });

        // this.nfImporteLiq = new Ext.form.NumberField({
        //     // disabledClass: 'disabled-component',
        //     // fieldLabel: 'Pendiente',
        //     maxLength: 19,
        //     disabled: false,
        //     style: 'text-align: right',
        //     allowBlank: false,
        //     allowNegative: false,
        //     anchor: '95%'
        // });

        var selModel = new Ext.grid.RowSelectionModel();

        var columns = [
            {
                header: 'Numero tarjeta',
                dataIndex: 'numerotarjeta',
                width: 140,
                sortable: false,
                hidden: true,
                align: 'left'
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
                header: 'Litros',
                width: 100,
                align: 'center',
                sortable: true,
                hidden: true,
                renderer: function (value, metadata, record, rowIndex, colIndex, store) {
                    return parseFloat(record.get('importe') / record.get('preciocombustible')).toFixed(2);
                }
            }, {
                header: 'Saldo anticipo',//el importe que voy a poder liquidar de la tarjeta
                dataIndex: 'saldoanticipo',
                renderer: 'formatoMoneda',
                width: 80,
                align: 'center',
                hidden: true,
                sortable: true
            }, {
                header: 'Importe liquidado',
                dataIndex: 'importeliquidadomb',
                renderer: 'formatoMoneda',
                width: 80,
                align: 'center',
                hidden: true,
                sortable: true
            }, {
                header: 'Responsable',
                dataIndex: 'nompersona',
                // dataIndex: 'idpersona',
                width: 140,
                align: 'left',
                // editor: this.cbPersona,
                sortable: true,
                // renderer: function (value, metadata, record, rowIndex, colIndex, store) {
                //     return record.get('nompersona');
                // }
            }, {
                header: 'Fecha',//fecha en la que se liquido en la bd de fincimex
                dataIndex: 'fechaliq',
                // renderer: 'erpFecha',
                width: 100,
                align: 'center',
                // editor: this.dfFecha,
                sortable: true
            }, {
                header: 'Importe',//importe de la liq en la bd fincimex
                dataIndex: 'importe',
                width: 80,
                renderer: 'formatoMoneda',
                align: 'right',
                // editor: this.nfImporteAnt,
                sortable: true
            }, {
                header: 'Cuenta contable',//cuenta contable, hacer algo pa si cambio una cambio todas las de la tarjeta
                dataIndex: 'idcuentagasto',
                width: 120,
                // renderer: 'formatoMoneda',
                align: 'left',
                editor: this.cbxCuenta,
                sortable: false,
                renderer: function (value, metadata, record, rowIndex, colIndex, store) {
                    return record.get('nomcuentagasto');
                }
            }, {
                header: 'Chip',
                dataIndex: 'chip',
                width: 80,
                align: 'left',
                editor: this.nfChip,
                sortable: false
            }
        ];

        return this.gridLiquidaciones = new Ext.grid.EditorGridPanel({
            title: 'Liquidaciones',
            // layout: 'fit',
            view: new Ext.grid.GroupingView({
                // forceFit: true,
                groupTextTpl: "{[values.rs[0].data.numerotarjeta]} (Saldo anticipado {[values.rs[0].data.saldoanticipo - values.rs[0].data.importeliquidadomb]})"
            }),
            height: Ext.lib.Dom.getViewHeight() * 0.4,
            store: model.getStoreGridLiquidacionFincimex(),
            stripeRows: true,
            loadMask: true,
            sm: selModel,
            columns: columns,
            tbar: tbar
        });

    },
    setWindowItems: function (model) {
        this.items = [this.createForm(model), this.crearGridLiquidacionesFincimex(model)];
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
        this.getCbxCuenta = function () {
            return this.cbxCuenta;
        };
        // this.getNfImporteAnt = function () {
        //     return this.nfImporteAnt;
        // };
        this.gettfCheckLiquidacion = function () {
            return this.tfCheckLiquidacion;
        };
        this.gettfCheckImporte = function () {
            return this.tfCheckImporte;
        };
        this.getCkbDevolverACaja = function () {
            return this.ckbDevolverACaja;
        };
    }
});
