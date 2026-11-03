Ext.namespace('Ext.UILiquidarPorCliente');
Ext.UILiquidarPorCliente= Ext.extend(Ext.Window, {
    lmask: undefined,
    url: '',
    etiquetas: undefined,
    tipoDuo: undefined,
    idmoneda: undefined,
    constructor: function (params) {
        this.url = params.url;
        this.etiquetas = params.etiquetas;
        this.tipoDuo = params.tipoDuo;
        this.fechaContable = params.fechaContable;
        this.desde = params.desde;
        this.hasta = params.hasta;
        this.tipoContabilizacion = params.tipoContabilizacion;
        Ext.apply(this, {
            autoValidate: true,
            modal: true,
            constrain: true,
            layout: 'fit',
            bodyStyle: 'padding:5px 5px 5px',
            width: Ext.lib.Dom.getViewWidth() * 0.45,
            // height: Ext.lib.Dom.getViewWidth() * 0.40,
            // closeAction: 'destroy','Liquidar factura'
            frame: true,
            resizable: false,
            title: (this.tipoContabilizacion == 1 ? 'Liquidar  obligaciones de ' : 'Cancelar liquidaciones de ') + (this.tipoDuo == 1 ? 'cobro' : 'pago'),
            // listeners: {
            //     scope: this,
            //     show: function () {
            //
            //     },
            //     close: function () {
            //
            //     }
            // }
        });
        if (this.tipoContabilizacion == 1) {
            this.initializeLiquidarStore();
            this.initializeLiquidarClass();
        } else if (this.tipoContabilizacion == 2) {
            this.initializeCancelacionStore();
            this.initializeCancelacionClass();
        }
        Ext.UILiquidarPorCliente.superclass.constructor.call(this);
    },
    loadMask: function (message) {
        this.lmask = new Ext.LoadMask(this.body, {
            msg: message
        });
        this.lmask.show();
    },
    initializeComunStore: function () {

        this.recordClienteProv = Ext.data.Record.create([{
            name: 'idcliente',
            mapping: 'idcliente'
        }, {
            name: 'abreviatura',
            mapping: 'abreviatura'
        }, {
            name: 'nombrecliente',
            mapping: 'nombrecliente'
        }, {
            name: 'opeExcepional',
            mapping: 'opeExcepional'
        }, {
            name: 'nombre',
            mapping: 'nombre'
        }
        ]);

        this.stAddClienteProveedor = new Ext.data.Store({
            url: 'loadDataClientes',
            baseParams: {
                tipoDuo: this.tipoDuo,
                esClienteProv: true,
                porliquidar: 1,
                tipoContabilizacion: this.tipoContabilizacion
            },
            sortInfo: {
                field: 'nombrecliente',
                direction: "DESC"
            },
            reader: new Ext.data.JsonReader({
                id: 'idclien',
                totalProperty: 'cantidad',
                root: 'datos'
            }, this.recordClienteProv)
        });

    },
    initializeLiquidarStore: function () {

        this.initializeComunStore();

        this.recordLiquidarOperacion = Ext.data.Record.create([{
            name: 'idnomoperaciones'
        },
            {
                name: 'denominacion'
            }
        ]);

        this.stLiquidarOperacion = new Ext.data.Store({
            url: 'CargarOperacionLiquidacion',
            autoLoad: false,
            reader: new Ext.data.JsonReader({
                id: 'idnomoperaciones'
            }, this.recordLiquidarOperacion),
            baseParams: {
                tipoduo: this.tipoDuo,
            }
        });

        this.recordLiquidar = Ext.data.Record.create([
            {name: 'idcuentacontrapartida'},
            {name: 'importependiente'},
            {name: 'idmoneda'},
            {name: 'codigoiso'},
            {name: 'fechaemision'},
            {name: 'numero'},
            {name: 'idtipodocumento'},
            {name: 'denominacion'},
            {name: 'idcuenta'},
            {name: 'concatcta'},
            {name: 'idderechouobligacion'},
            {name: 'idclienteproveedorfiscal'},
            {name: 'clienteproveedor'},
            {name: 'idliquidacion'},
            {name: 'noperacionenzona'},
            {name: 'referenciaext'},
            {name: 'importealiquidar', type: 'float', mapping: 'importependiente'},
        ]);

        this.stLiquidar = new Ext.data.GroupingStore({
            url: 'loadDataDuoByClienteProveedor',
            baseParams: {
                tipoDuo: this.tipoDuo
            },
            groupField: 'clienteproveedor',
            reader: new Ext.data.JsonReader({
                root: 'datos',
                totalProperty: 'cantidad_filas'
            }, this.recordLiquidar),
            sortInfo: {field: 'fechaemision', direction: 'ASC'}
            // sortInfo: {field: 'idderechouobligacion', direction: 'ASC'}
        });

        this.recordLiquidarCuenta = Ext.data.Record.create([{
            name: 'idcuenta'
        },
            {
                name: 'text'
            }
        ]);


        this.stLiquidarCuenta = new Ext.data.Store({
            url: 'loadDataCuenta',
            autoLoad: false,
            reader: new Ext.data.JsonReader({
                root: 'datos'
            }, this.recordLiquidarCuenta),
        });

    },
    initializeCancelacionStore: function () {

        this.initializeComunStore();

        this.recordCancelarLiq = Ext.data.Record.create([
            {name: 'idcuenta'},
            {name: 'numero'},
            {name: 'idderechouobligacion'},
            {name: 'codigoiso'},
            {name: 'clienteproveedor'},
            {name: 'noinst', mapping: 'num_instrumento'},
            {name: 'fechacreacion'},
            {name: 'nomcuenta'},
            {name: 'idliquidacion'},
            {name: 'idcomprobante', type: 'int'},
            {name: 'numcomprobante'},
            {name: 'importealiquidar', mapping: 'importemo' , type: 'float'}
        ]);

        this.stCancelarLiq = new Ext.data.GroupingStore({
            url: 'loadDataLiquidaciones',
            baseParams: {
                tipoDuo: this.tipoDuo,
                tipoContabilizacion: this.tipoContabilizacion
            },
            groupField: 'idcomprobante',
            reader: new Ext.data.JsonReader({
                root: 'arrayLiq',
                totalProperty: 'cantidad',
            }, this.recordCancelarLiq),
            sortInfo: {field: 'idcomprobante', direction: 'DESC'}
        });

    },
    initializeLiquidarClass: function () {
        this.initializeLiquidarStore();
        this.createButtonsLiquidar();
        this.createFormLiquidar();
        this.initEventos();
    },
    initializeCancelacionClass: function () {
        this.initializeCancelacionStore();
        this.createButtonsCancelacion();
        this.createFormCancelacion();
        this.initEventos();
    },
    createButtonsComun: function () {
        this.btnCancelar = new Ext.Button({
            text: 'Cancelar',
            tooltip: 'Cerrar ventana sin guardar los datos',//scope.etiquetas.lbBtnCerrar,
            tabIndex: 409,
            iconCls: 'cancelar',
        });

        this.btnAceptar = new Ext.Button({
            id: 'btnAceptar',
            text: 'Aceptar',
            tooltip: 'Guardar datos y cerrar ventana',//scope.etiquetas.lbBtnAceptar,
            disabled: true,
            tabIndex: 408,
            iconCls: 'aceptar',
        });

        return [this.btnCancelar, this.btnAceptar];
    },
    createButtonsLiquidar: function () {
        this.buttons = this.createButtonsComun();

        this.btnAddLiquidacion = new Ext.Button({
            tooltip: 'Filtrar obligaciones',
            text: 'Filtro',
            iconCls: 'adicionar',
            disabled: true,
        });
    },
    createButtonsCancelacion: function () {

        this.btnBuscar = new Ext.Button({
            id:'idbtnBuscar',
            // tooltip: scope.etiquetas.lbToolBuscar,
            text: 'Buscar',
            iconCls: 'buscar',
        });

        this.buttons = this.createButtonsComun();
    },
    createFormComun: function () {

        this.tfComentario = new Ext.form.TextField({
            id: 'tfComentario',
            fieldLabel: 'Comentario',
            name: 'importecontablerestante',
            anchor: '100%',
            allowBlank: false,
            maxLength: 100,
            // style: 'text-align: left',
        });

        this.cbAddClienteProveedor = new Ext.form.ComboBox({
            // id: 'cbAddClienteProveedor',
            store: this.stAddClienteProveedor,
            name: 'idcliente',
            valueField: 'idcliente',
            hiddenName: 'idcliente',
            hideLabel: true,
            // fieldLabel: this.tipoDuo === 1 ? 'Cliente' : 'Proveedor',
            displayField: 'nombrecliente',
            emptyText: this.etiquetas.lbSeleccione,
            disabledClass: 'disabled-component',
            editable: true,
            pageSize: 10,
            minChars: 3,
            forceSelection: true,
            allowBlank: true,
            resizable: true,
            triggerAction: 'all',
            anchor: '100%',
            mode: 'remote',
            maskRe: /^([a-zA-Z0-9 \xf3\xf1\xe1\xe9\xed\xfa\xd1\-\.]+ ?[a-zA-Z]*)+$/,
            tpl: '<tpl for="."><div ext:qtip="{nombre}" class="x-combo-list-item">{nombre}</div></tpl>',
            selectOnFocus: true,
            readOnly: false,
            tabIndex: 4,
            enableKeyEvents: true,
        });

        this.ckbAddClienteProv = new Ext.form.Checkbox({
            disabledClass: 'disabled-component',
            boxLabel: this.tipoDuo === 1 ? 'Cliente:' : 'Proveedor:',
            hideLabel: true,
            checked: true,
            name: 'clienteprov',
            selectOnFocus: true,
            enableKeyEvents: true,
            anchor: '100%',
        });

        this.ckbAddTrabajador = new Ext.form.Checkbox({
            disabledClass: 'disabled-component',
            boxLabel: 'Trabajador',
            hideLabel: true,
            name: 'trabajador',
            selectOnFocus: true,
            enableKeyEvents: true,
            anchor: '100%',
        });

    },
    createFormLiquidar: function () {

        this.createFormComun();

        this.tfNumeroInst = new Ext.form.TextField({
            id: 'tfNumeroInst',
            fieldLabel: 'No. instrumento',
            name: 'numeroinst',
            anchor: '100%',
            allowBlank: false,
            maxLength: 50,
            // style: 'text-align: right',
        });

        this.dateFieldLiq = new Ext.form.DateField({
            id: 'iddateFieldLiqMul',
            name: 'dateFieldLiqMul',
            fieldLabel: 'Fecha',
            allowBlank: false,
            value: this.fechaContable,
            minValue: this.desde,
            maxValue: this.hasta,
            format: 'd/m/Y',
            disabledClass: 'disabled-component',
            selectOnFocus: true,
            // enableKeyEvents: true,
            anchor: '100%'
        });

        this.nfImporteIns = new Ext.form.NumberField({
            value: 0,
            anchor: '100%',
            allowBlank: false,
            allowNegative: false,
            fieldLabel: 'Importe',
            enableKeyEvents: true,
            decimalPrecision: 2,
            validator: function (value) {
                if (value > 0)
                    return true;
                return 'El importe no puede ser 0.';
            }
        });

        this.nfImporteDiff = new Ext.form.NumberField({
            value: 0,
            anchor: '100%',
            readOnly: true,
            decimalPrecision: 2,
            // disabled: true,
            // disabledClass: 'disabled-component',
            // allowBlank: false,
            // allowNegative: false,
            fieldLabel: 'Resto',
            validator: function (value) {
                if (value == this.nfImporteIns.getValue()) {
                    return false;
                } else if (value >= 0) {
                    return true;
                } else {
                    return 'El importe no puede ser negativo.';
                }
                // return 'El importe no puede ser 0.';
            }.bind(this)
        });

        this.cbLiquidarCuenta = new Ext.contabilidad.util.linkedCombo({
            store: this.stLiquidarCuenta,
            fieldLabel: 'Contrapartida',
            displayField: 'text',
            valueField: 'idcuenta',
            // disabled: true,
            hideTbar: true,
            hideBbar: true,
            listHeight: 200,
            tabIndex: 11,
            anchor: '100%',
            mode: 'local',
            loaded: true,
            disabled: true,
            id: 'cbxCuenta',
            listeners: {
                // specialkey: function (tf, e) {
                //     if (e.getCharCode() == Ext.EventObject.ENTER)
                //         scope.nfImporte.focus(true, 100);
                // },
                // select: function (cb, record) {
                //     var index = scope.stLiquidar.find('idcuenta', cb.getValue());
                //     if (index != -1) {
                //         scope.cbLiquidarCuenta.reset();
                //         mostrarMensaje(1, scope.etiquetas.lbMsgCuentaRepetida);
                //     } else {
                //         scope.nfImporte.focus(true, 100);
                //     }
                // }
            }
        });

        this.cbLiquidarOperacion = new Ext.form.ComboBox({
            editable: false,
            store: this.stLiquidarOperacion,
            allowBlank: false,
            valueField: 'idnomoperaciones',
            displayField: 'denominacion',
            hiddenName: 'idnomoperaciones',
            disabledClass: 'disabled-component',
            id: 'cbLiquidarOperacion',
            selectOnFocus: true,
            resizable: true,
            //typeAhead : true,
            mode: 'local',
            disabled: true,
            triggerAction: 'all',
            tabIndex: 10,
            fieldLabel: 'Operaci&oacute;n',
            anchor: '100%',
            tpl: '<tpl for="."><div ext:qtip="{denominacion}" class="x-combo-list-item">{denominacion}</div></tpl>',
            enableKeyEvents: true,
        });

        this.formUILiquidarPorCliente = new Ext.FormPanel({
            frame: true,
            layout: 'form',
            border: false,
            autoHeight: true,
            labelWidth: 50,
            labelAlign: 'top',
            trackResetOnLoad: true,
            items: [{
                layout: 'column',
                labelAlign: 'top',
                items: [/*{
                        columnWidth: .5,
                        layout: 'form',
                        items: [this.cbAddClienteProveedor]
                    },*/{
                    // style: 'margin:0 10 0 0',
                    layout: 'form',
                    columnWidth: .5,
                    items: [{
                        style: 'margin:-7 0 0 10',
                        layout: 'column',
                        items: [{
                            layout: 'form',
                            columnWidth: .5,
                            items: [this.ckbAddClienteProv]
                        }, {
                            style: 'margin:0 0 0 10',
                            layout: 'form',
                            columnWidth: .5,
                            items: [this.ckbAddTrabajador]
                        }]
                    }, {
                        style: 'margin:-11 0 0 0',
                        layout: 'form',
                        items: [this.cbAddClienteProveedor]
                    }]
                },{
                    columnWidth: .5,
                    style: 'margin:0 0 0 10',
                    layout: 'form',
                    items: [this.dateFieldLiq]
                },
                ]
            },{
                layout: 'column',
                labelAlign: 'top',
                items: [{
                    columnWidth: .5,
                    layout: 'form',
                    items: [this.cbLiquidarOperacion]
                },{
                    columnWidth: .5,
                    style: 'margin:0 0 0 10',
                    layout: 'form',
                    items: [this.cbLiquidarCuenta]
                },
                ]
            },{
                layout: 'column',
                labelAlign: 'top',
                items: [{
                    columnWidth: .5,
                    // style: 'margin:0 0 0 10',
                    layout: 'form',
                    items: [this.tfNumeroInst]
                },{
                    columnWidth: .25,
                    style: 'margin:0 0 0 10',
                    layout: 'form',
                    items: [this.nfImporteIns]
                },{
                    columnWidth: .25,
                    style: 'margin:0 0 0 10',
                    layout: 'form',
                    items: [this.nfImporteDiff]
                },
                ]
            },{
                layout: 'column',
                labelAlign: 'top',
                items: [{
                    columnWidth: 1,
                    layout: 'form',
                    items: [this.tfComentario]
                },
                ]
            },
            ]
        });

        this.items = [this.formUILiquidarPorCliente, this.createGridLiquidar()];
    },
    createFormCancelacion: function () {

        this.createFormComun();

        this.nfImporteACancelar = new Ext.form.NumberField({
            value: 0.00,
            anchor: '100%',
            readOnly: true,
            decimalPrecision: 2,
            fieldLabel: 'Importe',
            validator: function (value) {
                if (value > 0)
                    return true;
                return 'El importe no puede ser 0.';
            }
        });

        this.dateFieldInicio = new Ext.form.DateField({
            fieldLabel: 'Fecha incicio',
            allowBlank: true,
            value: this.desde,
            maxValue: this.fechaContable,
            format: 'd/m/Y',
            disabledClass: 'disabled-component',
            selectOnFocus: true,
            anchor: '100%'
        });

        this.dateFieldFin = new Ext.form.DateField({
            fieldLabel: 'Fecha fin',
            allowBlank: true,
            value: this.fechaContable,
            maxValue: this.fechaContable,
            minValue: this.desde,
            format: 'd/m/Y',
            disabledClass: 'disabled-component',
            selectOnFocus: true,
            anchor: '100%'
        });

        this.formUILiquidarPorCliente = new Ext.FormPanel({
            frame: true,
            layout: 'form',
            border: false,
            autoHeight: true,
            labelWidth: 50,
            labelAlign: 'top',
            trackResetOnLoad: true,
            items: [{
                layout: 'column',
                labelAlign: 'top',
                items: [/*{
                        columnWidth: 0.6,
                        layout: 'form',
                        items: [this.cbAddClienteProveedor]
                    },*/{
                    // style: 'margin:0 10 0 0',
                    layout: 'form',
                    columnWidth: .6,
                    items: [{
                        style: 'margin:-7 0 0 10',
                        layout: 'column',
                        items: [{
                            layout: 'form',
                            columnWidth: .5,
                            items: [this.ckbAddClienteProv]
                        }, {
                            style: 'margin:0 0 0 10',
                            layout: 'form',
                            columnWidth: .5,
                            items: [this.ckbAddTrabajador]
                        }]
                    }, {
                        style: 'margin:-11 0 0 0',
                        layout: 'form',
                        items: [this.cbAddClienteProveedor]
                    }]
                }, {
                    columnWidth: 0.2,
                    style: 'margin:0 0 0 10',
                    layout: 'form',
                    // items: [this.cbEjercicio]
                    items: [this.dateFieldInicio]
                }, {
                    columnWidth: 0.2,
                    style: 'margin:0 0 0 10',
                    layout: 'form',
                    // items: [this.cbPeriodo]
                    items: [this.dateFieldFin]
                }
                ]
            },{
                layout: 'column',
                labelAlign: 'top',
                items: [{
                    columnWidth: 0.8,
                    layout: 'form',
                    items: [this.tfComentario]
                },{
                    columnWidth: 0.2,
                    style: 'margin:0 0 0 10',
                    layout: 'form',
                    items: [this.nfImporteACancelar]
                },
                ]
            },
            ]
        });

        this.items = [this.formUILiquidarPorCliente, this.createGridCancelacion()];

    },
    createGridLiquidar: function () {

        this.nfImporte = new Ext.form.NumberField({
            defaultValue: 0,
            allowBlank: false,
            allowNegative: false,
            // validator: function (value) {
            //     if (value > 0)
            //         return true;
            //     return 'El importe no puede ser 0.';
            // }
        });

        this.ckbAddSubordinadas = new Ext.form.Checkbox({
            id: 'ckbAddSubordinadas',
            boxLabel: 'Subordinadas',
            hideLabel: true,
            name: 'subordinada'
        });

        this.smObligaciones = new Ext.grid.CheckboxSelectionModel({
            // singleSelect: true,
            id: 'row',
            width: 40,
            // header: 'test',
            align: 'right',
        });

        this.gridPanelObligaciones = new Ext.grid.EditorGridPanel({
            id: 'idgridPanelObligaciones',
            title: 'Desglose de obligaciones',
            clicksToEdit: 2,
            // forceFit: true,
            autoExpandColumn: 'idnumerodocumento',
            view: new Ext.grid.GroupingView({
                // forceFit: true,
                groupTextTpl: "{[values.rs[0].data.clienteproveedor]}"
            }),
            loadMask : true,
            columns: [
                this.smObligaciones
                ,{
                    id: 'iddocumento',
                    header: 'Documento',
                    dataIndex: 'denominacion',
                    width: 100,
                    hidden: true,
                    align: 'left',
                },{
                    // header: 'Documento',
                    dataIndex: 'clienteproveedor',
                    width: 100,
                    hidden: true,
                    hideable: false,
                    // align: 'left',
                }, {
                    id: 'idnumerodocumento',
                    header: 'No. documento',
                    dataIndex: 'numero',
                    width: 100,
                    align: 'left',
                }, {
                    header: 'No. operacion',
                    dataIndex: 'noperacionenzona',
                    width: 70,
                    align: 'left',
                    hidden: true,
                }, {
                    header: 'No. externo',
                    dataIndex: 'referenciaext',
                    width: 70,
                    align: 'left',
                    hidden: true,
                }, {
                    id: 'idfechaemision',
                    header: 'Fecha emisión',
                    dataIndex: 'fechaemision',
                    //hidden: true,
                    sortable: false,
                    width: 95,
                    align: 'left',
                }, {
                    id: 'idmoneda',
                    header: 'Moneda',
                    dataIndex: 'codigoiso',
                    hidden: true,
                    width: 100,
                    align: 'left',
                }, {
                    id: 'idcuenta',
                    header: this.etiquetas.lbCuenta,
                    dataIndex: 'concatcta',
                    width: 80,
                    align: 'left',
                },/* {
                    id: 'idcuentacontrapartida',
                    header: 'Contrapartida',
                    dataIndex: 'idcuentacontrapartida',
                    width: 110,
                    align: 'left',
                    editor: this.cbLiquidarCuenta,
                    // renderer: function (value, metadata, record, rowIndex, colIndex, store) {
                    //     if (record.data.nomcuentacontrapartida != '')
                    //         return record.data.nomcuentacontrapartida;
                    //     else return this.cbLiquidarCuenta.displayFieldTemp;
                    // }.bind(this)
                },*/
                {
                    id: 'idimportependiente',
                    header: 'Pendiente',
                    dataIndex: 'importependiente',
                    width: 80,
                    align: 'right',
                    renderer: formatoMonedaABS
                }, {
                    header: 'A liquidar',
                    dataIndex: 'importealiquidar',
                    width: 80,
                    align: 'right',
                    editor: this.nfImporte,
                    renderer: formatoMonedaABS
                }
            ],
            store: this.stLiquidar,
            sm: this.smObligaciones,
            height: 300,
            bbar: ['->', new Ext.Toolbar.TextItem('Total:'), this.labelTotal = new Ext.form.Label({
                text: '0.00'
            })],
            tbar: [this.ckbAddSubordinadas, '->', this.btnAddLiquidacion],
        });

        return this.gridPanelObligaciones;
    },
    createGridCancelacion: function () {

        this.smLiquidaciones = new Ext.grid.CheckboxSelectionModel({
            // singleSelect: true,
            id: 'row',
            width: 40,
            // header: 'test',
            align: 'right',
        });

        this.searchField = new Ext.Cont.SearchField({
            width: 120,
            // maskRe: /^[0-9]*$/,
            emptyText: 'Número de factura',
            fnOnSearch: function () {
                var storeLiq = this.gridPanelObligaciones.getStore();
                storeLiq.baseParams.numeroFact = this.searchField.getRawValue();
                if (this.cbAddClienteProveedor.getValue()) {
                    storeLiq.load();
                } else {
                    mostrarMensaje(1, 'Seleccione un ' + this.cbAddClienteProveedor.initialConfig.fieldLabel);
                }
            }.bind(this),
            fnOnClear: function () {
                var storeLiq = this.gridPanelObligaciones.getStore();
                storeLiq.baseParams.numeroFact = null;
                if (this.cbAddClienteProveedor.getValue()) {
                    storeLiq.load();
                }
            }.bind(this)
        });

        this.gridPanelObligaciones = new Ext.grid.EditorGridPanel({
            // id: 'idgridPanelLiquidaciones',
            title: 'Desglose de liquidación',
            // clicksToEdit: 2,
            // forceFit: true,
            // autoExpandColumn: 'idnumerodocumento',
            view: new Ext.grid.GroupingView({
                forceFit: true,
                groupTextTpl: "{[values.rs[0].data.numcomprobante]}"
            }),
            loadMask : true,
            columns: [
                this.smLiquidaciones
                ,{
                    header: 'No. Instrumento',
                    dataIndex: 'noinst',
                    width: 80,
                    // hidden: true,
                    align: 'center',
                },
                {
                    id: 'idnumerodocumento',
                    header: 'No. documento',
                    dataIndex: 'numero',
                    width: 100,
                    align: 'left',
                    hidden: true,
                },
                {
                    header: 'Combrobante',
                    dataIndex: 'numcomprobante',
                    width: 100,
                    hidden: true,
                },{
                    dataIndex: 'idcomprobante',
                    header: 'Combrobante',
                    width: 100,
                    hidden: true,
                    hideable: false,
                }, {
                    header: 'ClienteProveedor',
                    dataIndex: 'clienteproveedor',
                    hidden: true,
                    width: 100,
                    align: 'left',
                }, {
                    id: 'idmoneda',
                    header: 'Moneda',
                    dataIndex: 'codigoiso',
                    hidden: true,
                    width: 100,
                    align: 'left',
                }, {
                    id: 'idimporte',
                    header: 'Importe',
                    dataIndex: 'importealiquidar',
                    width: 100,
                    align: 'right',
                    renderer: formatoMonedaABS
                }, {
                    id: 'idcuenta',
                    header: this.etiquetas.lbCuenta,
                    dataIndex: 'nomcuenta',
                    width: 100,
                    align: 'left',
                }, {
                    header: 'Fecha',
                    dataIndex: 'fechacreacion',
                    width: 80,
                }
            ],
            store: this.stCancelarLiq,
            sm: this.smLiquidaciones,
            height: 300,
            tbar: [this.searchField, '->', this.btnBuscar],
        });

        return this.gridPanelObligaciones;
    },
    initEventos: function () {
        this.btnCancelar.setHandler(function () {
            this.close();
        }, this);
    },
});