Ext.namespace('Ext.GestionarTarjetaAddAnt');
Ext.GestionarTarjetaAddAnt.View = Ext.extend(Ext.Window, {
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
        Ext.GestionarTarjetaAddAnt.View.superclass.constructor.call(this);
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
            title = 'Adicionar anticipo';
        } else if (modo === 'mod') {
            title = 'Modificar anticipo';
        } else if (modo === 'ver') {
            title = 'Ver anticipo';
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

        this.btnNuevo = new Ext.Button({
            iconCls: 'nuevo',
            text: 'Nuevo',
            tooltip: 'Limpiar los campos',
        });

        this.btnConfirmar = new Ext.Button({
            iconCls: 'confirmar',
            text: 'Confirmar',
            disabled: true
        });

        this.btnPostear = new Ext.Button({
            iconCls: 'contabilidad',
            text: 'Postear',
            disabled: true
        });

        if (this.modo == 'add') {
            this.buttons = [this.btnCancelar, this.btnNuevo, this.btnAceptar, this.btnConfirmar, this.btnPostear];
        } else if(this.modo == 'mod') {
            this.buttons = [this.btnCancelar, this.btnAceptar, this.btnConfirmar, this.btnPostear];
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

        this.tfCheckAnticipo = new Ext.form.TextField({
            disabledClass: 'disabled-component',
            fieldLabel: 'Check',
            hidden: true,
            name: 'check',
            allowBlank: false,
            // anchor: '95%'
        });

        this.dfFechaOperacion = new Ext.form.DateField({
            // fieldLabel: this.idioma.lbFechaRecarga,
            fieldLabel: 'Fecha',
            allowBlank: false,
            name: 'fecha',
            format: 'd/m/Y', invalidText: 'El formato establecido: dd/mm/aaaa.',
            anchor: '95%',
            // minValue: fechaInicio,
            // maxValue: new Date()
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
                    columnWidth: 0.5,
                    items: [this.cbOperacion]
                }, {
                    style: 'margin:0 0 0 10',
                    layout: 'form',
                    columnWidth: 0.5,
                    items: [this.dfFechaOperacion]
                }]
            }, {
                // labelAlign: 'top',
                hidden: true,
                layout: 'column',
                items: [this.tfCheckAnticipo]
            }
            ]
        });
        this.setForm(form);
        return form;
    },
    crearGridAnticiposFincimex: function (model) {

        var tbar = [];

        this.cbPersona = new Ext.form.ComboBox({
            // fieldLabel: this.idioma.lbResponsable,
            fieldLabel: 'Responsable',
            store: model.getStorePersona(),
            valueField: 'idpersona',
            hiddenName: 'idpersona',
            displayField: 'nombre',
            // emptyText: this.idioma.lbSeleccione, //'Seleccione...',
            emptyText: 'Seleccione...',
            disabledClass: 'disabled-component',
            forceSelection: true,
            allowBlank: false,
            resizable: true,
            //readOnly: true,
            triggerAction: 'all',
            anchor: '100%',
            minChars: 0, //Para la nueva busqueda poner contraria esta linea
            pageSize: 10, //Para la nueva busqueda poner contraria esta linea
            maskRe: /^([a-zA-Z0-9 \xf3\xf1\xe1\xe9\xed\xfa\xd1]+ ?[a-zA-Z]*)+$/,
            tpl: '<tpl for="."><div ext:qtip="{numid} {nombre}" class="x-combo-list-item">{nombre}</div></tpl>',
            selectOnFocus: true,
            enableKeyEvents: true,
        });

        this.dfFecha = new Ext.form.DateField({
            fieldLabel: 'Fecha',
            allowBlank: false,
            name: 'fecha',
            format: 'd/m/Y', invalidText: 'El formato establecido: dd/mm/aaaa.',
            anchor: '95%',
            // minValue: fechaInicio,
            // maxValue: new Date()
        });

        this.nfImporteAnt = new Ext.form.NumberField({
            // disabledClass: 'disabled-component',
            // fieldLabel: 'Pendiente',
            maxLength: 19,
            disabled: false,
            style: 'text-align: right',
            allowBlank: false,
            allowNegative: false,
            anchor: '95%'
        });

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
                id: 'idnumerotarjeta',
                // width: 160,
                sortable: true,
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
                header: 'Saldo tarjeta',
                dataIndex: 'saldodisponible',
                renderer: 'formatoMoneda',
                width: 80,
                align: 'center',
                sortable: true
            }, {
                header: 'Importe',
                dataIndex: 'importe',
                width: 80,
                renderer: 'formatoMoneda',
                align: 'right',
                editor: this.nfImporteAnt,
                sortable: true
            }, {
                header: 'Responsable',
                dataIndex: 'idpersona',
                width: 140,
                align: 'left',
                editor: this.cbPersona,
                sortable: true,
                renderer: function (value, metadata, record, rowIndex, colIndex, store) {
                    return record.get('nompersona');
                }
            }, {
                header: 'Fecha entrega',
                dataIndex: 'fechaentrega',
                // renderer: 'erpFecha',
                width: 100,
                align: 'center',
                editor: this.dfFecha,
                sortable: true
            }
        ];

        return this.gridAnticipos = new Ext.grid.EditorGridPanel({
            title: 'Anticipos',
            // layout: 'fit',
            autoExpandColumn: 'idnumerotarjeta',
            autoExpandMin: 160,
            height: Ext.lib.Dom.getViewHeight() * 0.4,
            store: model.getStoreGridAnticipoFincimex(),
            stripeRows: true,
            loadMask: true,
            sm: selModel,
            columns: columns,
            tbar: tbar
        });

    },
    setWindowItems: function (model) {
        this.items = [this.createForm(model), this.crearGridAnticiposFincimex(model)];
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
        this.getGridAnticipos = function () {
            return this.gridAnticipos;
        };
        this.getCbOperacion = function () {
            return this.cbOperacion;
        };
        this.getNfImporteAnt = function () {
            return this.nfImporteAnt;
        };
        this.getTfCheckAnticipo = function () {
            return this.tfCheckAnticipo;
        };
        this.getDfFechaEditor = function () {
            return this.dfFecha;
        };
        this.getDfFechaOperacion = function () {
            return this.dfFechaOperacion;
        };
    }
});
