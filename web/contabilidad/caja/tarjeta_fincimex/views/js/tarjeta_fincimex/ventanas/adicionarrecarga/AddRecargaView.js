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
        this.setFormSteps(new Ext.FormSteps(this.getForm(), this.buttons));
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
            fieldLabel: 'Importe',
            maxLength: 19,
            name: 'importemo',
            style: 'text-align: right',
            // maxLengthText: this.idioma.lbMaxLengthImporte19,
            allowBlank: false,
            anchor: '100%',
            // disabled: true,
            readOnly: true,
            validator: function (value) {
                //---Validar importe pendiente
                if (value > this.nfImportePendiente.getValue())
                    return 'El importe no puede ser mayor que ' + this.nfImportePendiente.getRawValue();
                else if (value == 0)
                    return 'El importe no puede ser 0.';
                else return true;
            }.bind(this),
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

        this.tfCheckChip = new Ext.form.TextField({
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

        var comboAnt = this.crearComboAnticipo(model);
        // var gridRecargasFincimex = this.crearGridRecargasFincimex(model);

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
                        columnWidth: .25,
                        items: [comboAnt]
                    }, {
                        style: 'margin:0 0 0 10',
                        layout: 'form',
                        columnWidth: .25,
                        items: [this.dfFechaOperacion]
                    }, {
                        style: 'margin:0 0 0 10',
                        layout: 'form',
                        columnWidth: .25,
                        items: [this.nfImportePendiente]
                    }, {
                        style: 'margin:0 0 0 10',
                        layout: 'form',
                        columnWidth: .25,
                        items: [this.nfImporte]
                    }
                ]
            }, {
                // labelAlign: 'top',
                hidden: true,
                layout: 'column',
                items: [this.tfCheckChip]
            }
            ]
        });
        this.setForm(form);
        return form;
    },
    crearComboAnticipo: function (model) {
        //Grid Anticipo renderizado en el combox----------------------------------

        this.gpAnticipo = new Ext.grid.GridPanel({
            border: false,
            height: 200,
            split: true,
            autoExpanColunm: 'numerodocumento',
            frame: false,
            loadMask: true,
            viewConfig: {
                forceFit: true
            },
            store: model.getStoreAnticipo(),
            sm: new Ext.grid.RowSelectionModel({
                singleSelect: true
            }),
            columns: [
                {
                    sortable: true,
                    header: 'No. Instrumento',
                    hideable: true,
                    id: 'numerodocumento',
                    dataIndex: 'numerodocumento'
                }, {
                    sortable: true,
                    width: 50,
                    header: 'Fecha',
                    hideable: true,
                    dataIndex: 'fechacreacion'
                }, {
                    header: 'Pendiente',
                    sortable: true,
                    hideable: true,
                    width: 50,
                    dataIndex: 'pendiente',
                    renderer: formatoMoneda
                }
            ]
        });

        // this.smGpAnticipo.on('rowselect', function (sm, index, record) {
        //     me.cbAnticipo.setValue(record.data.idanticipo);
        //     me.cbAnticipo.setRawValue(record.data.numerodocumento);
        //     if (me.action == 'mod' && record.data.idanticipo == me.scope.smRecarga.getSelected().data.idanticipo)
        //         var totalPendiente = parseFloat(record.data.pendiente) + parseFloat(me.scope.smRecarga.getSelected().data.importemo);
        //     else totalPendiente = record.data.pendiente;
        //     // me.nfImportePendiente.setRawValue(formatoMoneda(totalPendiente));
        //     me.nfImportePendiente.setValue(parseFloat(totalPendiente).toFixed(2));
        //     me.nfImporte.enable();
        //     me.nfImporte.focus();
        //     me.cbAnticipo.collapse();
        // });

        return this.cbAnticipo = new Ext.form.ComboBox({
            fieldLabel: 'No. Instrumento',
            store: this.stCbAnticipo = new Ext.data.SimpleStore({
                fields: [{name: 'idanticipo'}, {name: 'numerodocumento'}],
                data: [[]]
            }),
            valueField: 'idanticipo',
            hiddenName: 'idanticipo',
            mode: 'local',
            displayField: 'numerodocumento',
            disabledClass: 'disabled-component',
            // forceSelection: true,
            allowBlank: false,
            resizable: false,
            minListWidth: 240,
            // readOnly: true,
            editable: false,
            triggerAction: 'all',
            anchor: '98%',
            tpl: '<div id = \"cmbanticipo\" style = \"height:200px; !important;\"></div>',
            selectOnFocus: true,
            enableKeyEvents: true,
            listeners: {
                scope: this,
                expand: function (combo) {
                    if (!this.gpAnticipo.rendered) {
                        this.gpAnticipo.render('cmbanticipo');
                    }
                }
            }

        });
        //---------------------------------------
    },
    crearGridRecargasFincimex: function (model) {

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

        this.nfChip = new Ext.form.NumberField({
            allowBlank: true,
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
        this.ldFechaInicio = new Ext.form.Label({
            text: 'Fecha inicio:\u00A0',
            style: 'font-weight:bold;'
        });
        this.ldFechaFin = new Ext.form.Label({
            text: 'Fecha fin:\u00A0',
            style: 'font-weight:bold;'
        });

        var tbar = [this.ldFechaInicio, this.dfFechaInicio, '-', this.ldFechaFin, this.dfFechaFin];

        var selModel = new Ext.grid.RowSelectionModel();

        var columns = [
            {
                header: 'Numero tarjeta',
                dataIndex: 'numtarjetafincimex',
                id: 'idnumtarjetafincimex',
                // width: 160,
                sortable: true,
                align: 'center'
            }, {
                header: 'Fecha operacion',
                dataIndex: 'fecha',
                renderer: 'erpFecha',
                width: 100,
                align: 'center',
                sortable: true
            }, {
                header: 'Importe',
                dataIndex: 'importefincimex',
                width: 100,
                renderer: 'formatoMoneda',
                align: 'right',
                sortable: true
            }, {
                header: 'Chip',
                dataIndex: 'chip',
                width: 120,
                align: 'left',
                editor: this.nfChip,
                sortable: false
            }
        ];

        return this.gridRecargasFincimex = new Ext.grid.EditorGridPanel({
            title: 'Recargas',
            // layout: 'fit',
            autoExpandColumn: 'idnumtarjetafincimex',
            autoExpandMin: 160,
            height: Ext.lib.Dom.getViewHeight() * 0.4,
            store: model.getStoreGridRecargaFincimex(),
            stripeRows: true,
            loadMask: true,
            sm: selModel,
            columns: columns,
            tbar: tbar
        });

    },
    setWindowItems: function (model) {
        this.items = [this.createForm(model), this.crearGridRecargasFincimex(model)];
    },
    initializeGets: function () {
        this.getCbPersona = function () {
            return this.cbPersona;
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
        this.getTfCheckChip = function () {
            return this.tfCheckChip;
        };
        this.getGpAnticipo = function () {
            return this.gpAnticipo;
        };
        this.getCbAnticipo = function () {
            return this.cbAnticipo;
        };
        this.getDfFechaOperacion = function () {
            return this.dfFechaOperacion;
        };
        this.getDfFechaInicio = function () {
            return this.dfFechaInicio;
        };
        this.getDfFechaInicio = function () {
            return this.dfFechaInicio;
        };
        this.getDfFechaFin = function () {
            return this.dfFechaFin;
        };
        this.getGridRecargasFincimex = function () {
            return this.gridRecargasFincimex;
        };
    }
});
