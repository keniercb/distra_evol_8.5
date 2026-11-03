Ext.namespace('Ext.AddExpDuo');
Ext.AddExpDuo.View = Ext.extend(Ext.Component, {
    model: undefined,
    constructor: function(model, params)
    {
        this.crearSetsAndGets();
        this.setFechasPeriodoContable(
            params.fechaInicial,
            params.fechaActual,
            params.fechaFin,
        );
        this.setModel(model);
        this.initializeView();
        Ext.AddExpDuo.View.superclass.constructor.call(this);
    },
    getItemsView: function () {
        return this.getFormExp();
    },
    initializeView: function () {
        this.initializeFunctions();
        this.initializeItems();
    },
    initializeItems: function () {
        return [this.crearFormExpdiente()];
    },
    initializeFunctions: function () {
        var model = this.getModel();

        this.crearFormExpdiente = function () {

            var stTipoDoc = new Ext.data.SimpleStore({
                fields: [
                    'id',
                    'text',
                ],
                data: [
                    [1, 'Conciliacion'],
                    [2, 'Reclamacion'],
                    [3, 'Demanda'],
                ]
            });

            this.cbTipoDoc = new Ext.form.ComboBox({
                fieldLabel: 'Tipo documento',
                // editable: true,
                forceSelection: true,
                store: stTipoDoc,
                // disabled: true,
                valueField: 'id',
                displayField: 'text',
                hiddenName: 'tipodoc',
                name: 'tipodoc',
                // typeAhead: true,
                mode: 'local',
                triggerAction: 'all',
                selectOnFocus: true,
                anchor: '100%',
                allowBlank: false,
                blankText: "Este campo es obligatorio."
            });

            this.tfDescripcion = new Ext.form.TextField({
                fieldLabel: 'Descripcion',
                name: 'descripcion',
                hiddenName: 'descripcion',
                allowBlank: false,
                anchor: '100%',
                // editable: false,
                // disabledClass: 'disabled-component',
                // maskRe: /^([a-zA-Z0-9-_/ \xf3\xf1\xe1\xe9\xed\xfa\xd1]+ ?[a-zA-Z]*)+$/,
                maxLengthText: 'El tamaño m&aacute;ximo requerido es 255 caracteres.',
                maxLength: 255,
            });

            this.dfFecha = new Ext.form.DateField({
                fieldLabel: 'Fecha',
                name: 'fecha',
                // maskRe: /^([0-9 \/\xf3\xf1\xe1\xe9\xed\xfa\xd1]+ ?[0-9.]*)+$/,
                readOnly: false,
                editable: false,
                allowBlank: false,
                value: this.getPeriodoConFechaActual(),
                minValue: this.getPeriodoConFechaInicial(),
                maxValue: this.getPeriodoConFechaFin(),
                // blankText: '',
                anchor: '100%',
                format: 'd/m/Y',
                disabledClass: 'disabled-component',
                selectOnFocus: true,
                // enableKeyEvents: true
            });

            this.dfFechaVencimiento = new Ext.form.DateField({
                fieldLabel: 'Fecha vencimiento',
                name: 'fechavencimiento',
                // maskRe: /^([0-9 \/\xf3\xf1\xe1\xe9\xed\xfa\xd1]+ ?[0-9.]*)+$/,
                readOnly: false,
                editable: false,
                allowBlank: false,
                // value: this.getPeriodoConFechaActual(),
                // minValue: this.getPeriodoConFechaInicial(),
                // maxValue: this.getPeriodoConFechaFin(),
                // blankText: '',
                anchor: '100%',
                format: 'd/m/Y',
                disabledClass: 'disabled-component',
                selectOnFocus: true,
                // enableKeyEvents: true
            });

            this.fufDocumento = new Ext.form.FileUploadField({
                // width: '97%',
                anchor: '97%',
                fieldLabel: 'Documento',
                allowBlank: false,
                name: 'fufdoc',
                buttonCfg: {
                    iconCls: 'icondistra-subirfichero',
                    text: ''
                }
            });

            var form = new Ext.FormPanel({
                frame: true,
                layout: 'form',
                autoHeight: true,
                fileUpload: true,
                // region: 'center',
                labelWidth: 50,
                labelAlign: 'top',
                trackResetOnLoad: true,
                items: [
                    {
                        layout: 'column',
                        items: [
                            {
                                columnWidth: .3,
                                layout: 'form',
                                items: [this.cbTipoDoc]
                            },
                            {
                                columnWidth: .2,
                                style: 'margin:0 0 0 5',
                                layout: 'form',
                                items: [this.dfFecha]
                            },
                            {
                                columnWidth: .2,
                                style: 'margin:0 0 0 5',
                                layout: 'form',
                                items: [this.dfFechaVencimiento]
                            },
                            {
                                style: 'margin: 0 0 0 5',
                                columnWidth: .3,
                                layout: 'form',
                                items: [this.fufDocumento]
                            },
                        ]
                    },
                    {
                        layout: 'column',
                        items: [
                            {
                                columnWidth: 1,
                                layout: 'form',
                                items: [this.tfDescripcion]
                            },
                        ]
                    },
                ]
            });

            this.setFormExp(form);
            return form;
        };

    },
    crearSetsAndGets: function () {
        this.setModel = function (model) {
            this.model = model;
        };

        this.getModel = function () {
            return this.model;
        };

        this.setFormExp = function (form) {
            this.formExp = form;
        };

        this.getFormExp = function () {
            return this.formExp;
        };

        this.getCbTipoDoc = function () {
            return this.cbTipoDoc;
        };

        this.getDfFecha = function () {
            return this.dfFecha;
        };

        this.getDfFechaVencimiento = function () {
            return this.dfFechaVencimiento;
        };

        this.getFufDocumento = function () {
            return this.fufDocumento;
        };

        this.getTfDescripcion = function () {
            return this.tfDescripcion;
        };

        this.setFechasPeriodoContable = function (fechaInicial, fechaActual, fechaFin) {
            this.fechaInicioPeriodo = fechaInicial;
            this.fechaContablePeriodo = fechaActual;
            this.fechaFinPeriodo = fechaFin;
        };

        this.getPeriodoConFechaInicial = function () {
            return this.fechaInicioPeriodo;
        };

        this.getPeriodoConFechaActual = function () {
            return this.fechaContablePeriodo;
        };

        this.getPeriodoConFechaFin = function () {
            return this.fechaFinPeriodo;
        };

    }
});