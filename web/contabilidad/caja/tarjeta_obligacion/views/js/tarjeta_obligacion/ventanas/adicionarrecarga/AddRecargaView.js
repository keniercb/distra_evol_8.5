Ext.namespace('Ext.GestionarTarjetaAddRecarga');
Ext.GestionarTarjetaAddRecarga.View = Ext.extend(Ext.Window, {
    lmask: undefined,
    etiquetas: undefined,
    constructor: function (model, params) {
        this.setModel(model);
        this.etiquetas = params.etiquetas;
        this.modo = params.modo;
        var title = '(??)';
        if (this.modo === 'add') {
            title = 'Adicionar recarga';
        } else if (this.modo === 'mod') {
            title = 'Modificar recarga';
        } else if (this.modo === 'ver') {
            title = 'Ver recarga';
        }
        Ext.apply(this, {
            autoValidate: false,
            modal: true,
            constrain: true,
            layout: 'fit',
            width: Ext.lib.Dom.getViewWidth() * 0.45,
            // height: Ext.lib.Dom.getViewWidth() * 0.6,
            closeAction: 'destroy',
            frame: true,
            resizable: false,
            title: title,
            listeners: {
                scope: this,
                show: function () {

                },
                close: function () {
                }
            }
        });
        this.initializeClass();
        Ext.GestionarTarjetaAddRecarga.View.superclass.constructor.call(this);
        this.addEvents({
            'FormStepsCreado': true
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
    crearFormSteps: function()
    {
        var arrGrids = [
            {
                grid: this.getGridRecargas(),
                ordenar: 'idtarjetarecarga',
                evaluar: ['idtarjeta', 'idtarjetarecarga', 'importe', 'chip'],
                tipo: 'eg',
                campoRecords: 'idtarjeta',
            }
        ];

        var formSteps = new CON.Util.FormSteps({
            arrForm: [this.getForm()],
            arrBtn: this.buttons,
            arrGrid: arrGrids
        });

        this.setFormSteps(formSteps);
        this.fireEvent('FormStepsCreado', this.getFormSteps());
        return this.getFormSteps();
    },
    initializeClass: function () {
        this.createButtons();
        this.setWindowItems(this.getModel());
        this.initializeGets();
    },
    setModel: function (model) {
        this.model = model;
    },
    getModel: function () {
        return this.model;
    },
    setForm: function (form) {
        this.formConf = form;
    },
    getForm: function () {
        return this.formConf
    },
    setFormSteps: function (formSteps) {
        this.formSteps = formSteps;
    },
    getFormSteps: function () {
        return this.formSteps
    },
    createButtons: function () {
        this.btnCancelar = new Ext.Button({
            id:'Cancelar',
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
            allowBlank: true,
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

        this.cbOperacion = new Ext.form.ComboBox({
            // fieldLabel: this.idioma.lbOperacion,
            fieldLabel: 'Operacion',
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
            //readOnly: true,
            triggerAction: 'all',
            anchor: '100%',
            maskRe: /^([a-zA-Z0-9 \xf3\xf1\xe1\xe9\xed\xfa\xd1]+ ?[a-zA-Z]*)+$/,
            tpl: '<tpl for="."><div ext:qtip="{denominacion}" class="x-combo-list-item">{denominacion}</div></tpl>',
            // selectOnFocus: true,
            // enableKeyEvents: true,
        });

        // this.nfChip = new Ext.form.NumberField({
        //     allowBlank: false,
        //     anchor: '95%',
        //     name: 'chip',
        //     fieldLabel: this.idioma.lbChip,
        //     maxLength: 16,
        //     maxLengthText: this.idioma.lbMaxLengthText16,
        //     listeners: {
        //         scope: this,
        //         specialkey: function (tf, e) {
        //             if (e.getCharCode() == Ext.EventObject.ENTER)
        //                 this.nfNumFin.focus();
        //         }
        //     }
        // });

        this.nfImporte = new Ext.form.NumberField({
            disabledClass: 'disabled-component',
            // fieldLabel: this.idioma.lbImporte,
            fieldLabel: 'Importe total',
            maxLength: 19,
            name: 'importemo',
            style: 'text-align: right',
            // maxLengthText: this.idioma.lbMaxLengthImporte19,
            allowBlank: true,
            anchor: '100%',
            // disabled: true,
            readOnly: true,
            /*listeners: {
                scope: this,
                blur: function (cb) {
                    cb.setRawValue(formatoMoneda(cb.getValue()));
                }
            }*/
        });

        this.nfImportePendiente = new Ext.form.NumberField({
            disabledClass: 'disabled-component',
            // fieldLabel: this.idioma.lbPendiente,
            fieldLabel: 'Pendiente',
            maxLength: 19,
            disabled: true,
            style: 'text-align: right',
            name: 'importePendiente',
            // maxLengthText: this.idioma.lbMaxLengthImporte19,
            allowBlank: false,
            allowNegative: false,
            anchor: '95%'
        });

        this.tfComentario = new Ext.form.TextField({
            disabledClass: 'disabled-component',
            fieldLabel: 'Comentario',
            name: 'comentario',
            allowBlank: false,
            anchor: '100%'
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

        this.cbCuenta = new Ext.form.ComboBox({
            id: 'cbCuenta',
            anchor: '100%',
            fieldLabel: 'Cuenta',
            allowBlank: false,
            forceSelection: true,
            typeAhead: true,
            // disabled: true,
            disabledClass: 'disabled-component',
            mode: 'local',
            triggerAction: 'all',
            enableKeyEvents: true,
            // editable: true,
            store: model.getStoreCbCuenta(),
            valueField: 'idcuenta',
            displayField: 'text'
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
                    columnWidth: .5,
                    items: [this.cbOperacion]
                }, {
                    style: 'margin:0 0 0 10',
                    layout: 'form',
                    columnWidth: .5,
                    items: [this.cbPersona]
                }]
            }, {
                labelAlign: 'top',
                autoHeight: true,
                layout: 'column',
                items: [
                    {
                        style: 'margin:0 0 0 5',
                        layout: 'form',
                        columnWidth: .5,
                        items: [this.cbCuenta]
                    }, {
                        style: 'margin:0 0 0 10',
                        layout: 'form',
                        columnWidth: .25,
                        items: [this.dfFechaOperacion]
                    }, {
                        style: 'margin:0 0 0 10',
                        layout: 'form',
                        columnWidth: .25,
                        items: [this.nfImporte]
                    }
                ]
            }, {
                labelAlign: 'top',
                layout: 'column',
                autoHeight: true,
                items: [{
                    style: 'margin:0 0 0 5',
                    layout: 'form',
                    columnWidth: 1,
                    items: [this.tfComentario]
                }]
            }
            ]
        });
        this.setForm(form);
        return form;
    },
    crearGridRecargas: function (model) {

        this.nfChip = new Ext.form.NumberField({
            allowBlank: false,
            anchor: '95%',
            name: 'chip',
            // fieldLabel: this.idioma.lbChip,
            fieldLabel: 'Chip',
            maxLength: 16,
            // maxLengthText: this.idioma.lbMaxLengthText16,
            maxLengthText: 'No puede ser mayor de 16',
            // listeners: {
            //     scope: this,
            //     specialkey: function (tf, e) {
            //         if (e.getCharCode() == Ext.EventObject.ENTER)
            //             this.nfNumFin.focus();
            //     }
            // }
        });

        this.nfGridImporte = new Ext.form.NumberField({
            allowBlank: false,
            anchor: '95%',
            name: 'importe',
            fieldLabel: 'Importe',
            maxLength: 16,
            // maxLengthText: this.idioma.lbMaxLengthText16,
            maxLengthText: 'No puede ser mayor de 16',
            // listeners: {
            //     scope: this,
            //     specialkey: function (tf, e) {
            //         if (e.getCharCode() == Ext.EventObject.ENTER)
            //             this.nfNumFin.focus();
            //     }
            // }
        });

        this.cbTarjetas = new Ext.form.ComboBox({
            anchor: '100%',
            fieldLabel: 'Tarjetas',
            allowBlank: false,
            forceSelection: true,
            typeAhead: true,
            // disabled: true,
            disabledClass: 'disabled-component',
            mode: 'local',
            triggerAction: 'all',
            enableKeyEvents: true,
            // editable: true,
            store: model.stTarjetas,
            valueField: 'idtarjeta',
            displayField: 'numero'
        });

        this.roweditor = new Ext.Cont.RowEditor({
            id: 'idRoweditor',
            clicksToEdit: 2,
            // cancelText: scope.etiquetas.lbCancelar,
            // saveText: scope.etiquetas.lbAceptar,
            iconClsSave: 'aceptar',
            iconClsCancel: 'cancelar',
            // saveTooltip: scope.etiquetas.lbToolRowEditorAceptar,
            // cancelTooltip: scope.etiquetas.lbToolRowEditorCancelar
        });


        this.rowaction = new Ext.grid.RowActions({
            id: 'idRowaction',
            actions: [
                {
                    id: 'eliminar',
                    tooltip: '',
                    iconCls: 'eliminar',
                    marginLeft: 5,
                    width: 20,
                    height: 16
                }
            ]
        });

        var me = this;

        this.btnAdicionar = new Ext.Button({
            text: 'Adicionar',
            iconCls: 'adicionar',
            id: 'btnAdd',
            // disabled: true,
            tooltip: 'Adicionar datos',
            handler: function () {
                var recordata = model.getRecordGridRecarga();
                var record = new recordata({
                    idtarjeta: '',
                    idtarjetarecarga: '',
                    numtarjeta: '',
                    importe: '',
                    chip: ''
                });
                me.roweditor.stopEditing();
                // var total = scope.stLiquidar.getCount();
                model.getStoreGridRecarga().insert(0, record);
                me.gridRecargas.getSelectionModel().selectRow(0);
                me.roweditor.startEditing(0);
                me.cbTarjetas.focus(true, 100);
            }
        });

        var tbar = [this.btnAdicionar];

        var selModel = new Ext.grid.RowSelectionModel();

        var columns = [
            {
                header: 'Numero tarjeta',
                id: 'tarjetaob',
                dataIndex: 'idtarjeta',
                // width: 160,
                sortable: true,
                editor: this.cbTarjetas,
                align: 'left',
                renderer: function (value, metadata, record, rowIndex, colIndex, store) {
                    if (record.data.numtarjeta != '') {
                        return record.data.numtarjeta;
                    } else {
                        return me.cbTarjetas.getRawValue();
                    }
                }
            }, {
                header: 'Importe',
                dataIndex: 'importe',
                width: 100,
                renderer: 'formatoMoneda',
                align: 'right',
                editor: this.nfGridImporte,
                sortable: true
            }, {
                header: 'Chip',
                dataIndex: 'chip',
                width: 120,
                align: 'left',
                editor: this.nfChip,
                sortable: false
            }, this.rowaction
        ];

        return this.gridRecargas = new Ext.grid.EditorGridPanel({
            title: 'Recargas',
            // layout: 'fit',
            autoExpandColumn: 'tarjetaob',
            autoExpandMin: 160,
            height: Ext.lib.Dom.getViewHeight() * 0.4,
            store: model.getStoreGridRecarga(),
            stripeRows: true,
            loadMask: true,
            sm: selModel,
            columns: columns,
            tbar: tbar,
            plugins: [this.roweditor, this.rowaction]
        });

    },
    setWindowItems: function (model) {
        this.items = [this.createForm(model), this.crearGridRecargas(model)];
    },
    initializeGets: function () {
        this.getCbPersona = function () {
            return this.cbPersona;
        };
        this.getCbCuenta = function () {
            return this.cbCuenta;
        };
        this.getCbOperacion = function () {
            return this.cbOperacion;
        };
        this.getNfImportePendiente = function () {
            return this.nfImportePendiente;
        };
        this.getNfImporte = function () {
            return this.nfImporte;
        };
        this.getDfFechaOperacion = function () {
            return this.dfFechaOperacion;
        };
        this.getDfFechaInicio = function () {
            return this.dfFechaInicio;
        };
        this.getDfFechaFin = function () {
            return this.dfFechaFin;
        };
        this.getGridRecargas = function () {
            return this.gridRecargas;
        };
        this.getTfComentario = function () {
            return this.tfComentario;
        };
        this.getBtnAdd = function () {
            return this.btnAdicionar;
        };
    }
});
