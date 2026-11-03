Ext.namespace('Ext.AnexoGasto');

Ext.AnexoGasto = Ext.extend(Ext.Component, {
    constructor: function (params) {
        //Ext.CONT.Componentes.MessageBox('msgbIniciando');
//Inicializando la vista.
        Ext.QuickTips.init();
        var perfil = window.parent.perfil;
        perfil.etiquetas = Object();
        this.listAnexoGasto = [];
        Ext.Ajax.request({
            method: "POST",
            url: "/contabilidad/cobros_pagos/derechouobligacion/index.php/anexogasto/cargaretiquetas",
            scope: this,
            callback: function (options, success, response) {
                var idioma = Ext.decode(response.responseText);
                this.winAnexoGasto = new Ext.WinAnexoGasto({
                    idioma: idioma,
                    arrayCuenta: params.arrayCuenta,
                    dataAnexo: params.dataAnexo,
                    action: params.action,
                    idMoneda: params.idMoneda,
                    scope: this
                });
                this.winAnexoGasto.show();
                this.winAnexoGasto.doLayout();
            }
        });
        this.addEvents('save');
        Ext.AnexoGasto.superclass.constructor.call(this);
    }
});

Ext.WinAnexoGasto = Ext.extend(Ext.Window, {
    width: 600,
    height: 300,
    modal: true,
    layout: 'border',
    closeAction: 'close',
    title: 'Registro de anexo',
    url: '/contabilidad/cobros_pagos/derechouobligacion/index.php/anexogasto/',
    constructor: function (params) {
        Ext.apply(this, params);
        this.layout = 'border';
        this.idioma = params.idioma;
        this.arrayCuenta = params.arrayCuenta;
        this.dataAnexo = params.dataAnexo;
        this.idMoneda = params.idMoneda;
        this.createButtons();
        this.createGrid(this);
        this.initFunctions();
        Ext.WinAnexoGasto.superclass.constructor.call(this);
        this.initEventos();
    },
    createGrid: function (scope) {
        var me = scope;
        //Combo Cuenta-----------
        this.stCuentaGasto = new Ext.data.Store({
            url: this.url + 'cargarCuenta',
            baseParams: {'arrayCuenta': Ext.encode(this.arrayCuenta), 'idMoneda': this.idMoneda},
            reader: new Ext.data.JsonReader({
                root: 'datos'
            }, [
                {name: 'idcuentagasto', mapping: 'idcuenta'},
                {name: 'nomcuenta', mapping: 'text'},
                {name: 'text'}
            ])
        });

        this.cbCuentaGasto = new Ext.contabilidad.util.linkedCombo({
            disabledClass: 'disabled-component',
            store: this.stCuentaGasto,
            fieldLabel: this.idioma.lbCuenta,
            displayField: 'text',
            valueField: 'idcuentagasto',
            listHeight: 200,
            tabIndex: 4,
            anchor: '98%',
            loaded: true,
            listeners: {
                specialkey: function (tf, e) {
                    if (e.getCharCode() == Ext.EventObject.ENTER)
                        me.nfImporte.focus(true, 100);
                },
                select: function (cb, record) {
                    var index = me.stAnexoGasto.find('idcuentagasto', cb.getValue());
                    if (index != -1) {
                        me.cbCuentaGasto.reset();
                        mostrarMensaje(1, "La cuenta que quiere adicionar ya est&aacute; registrada.");
                    } else {
                        me.nfImporte.focus(true, 100);
                    }
                }
            }
        });

        this.nfImporte = new Ext.form.NumberField({
            allowBlank: false,
            allowNegative: false,
            validator: function (value) {
                if (value > 0)
                    return true;
                return 'El importe no puede ser 0.';
            }
        });

        this.recordData = Ext.data.Record.create([
            {name: 'idcuentagasto', type: 'int'},
            {name: 'nomcuenta', type: 'string'},
            {name: 'importemo', type: 'float'}
        ]);

        this.roweditor = new Ext.Cont.RowEditor({
            id: 'idRoweditor',
            clicksToEdit: 2,
            cancelText: this.idioma.lbCancelar,
            saveText: this.idioma.lbAceptar,
            iconClsSave: 'aceptar',
            iconClsCancel: 'cancelar',
            saveTooltip: this.idioma.lbToolRowEditorAceptar,
            cancelTooltip: this.idioma.lbToolRowEditorCancelar
        });

        this.roweditor.on({
            scope: this,
            afteredit: function (editor, grid, changes, record, rowIndex) {
                this.btnAceptar.enable();
                record.data.nomcuenta = this.cbCuentaGasto.displayFieldTemp;
                var importeTotal = 0;
                for (var i = 0; i < this.gpAnexoGasto.getStore().getCount(); i++) {
                    importeTotal += parseFloat(Math.abs(this.gpAnexoGasto.getStore().getAt(i).data.importemo));
                }
                this.labelTotal.setText(formatoMoneda(importeTotal));
            },
            beforeedit: function (roweditor, grid, record, rowIndex) {
                this.cbCuentaGasto.setValue(record.data.idcuentagasto, record.data.nomcuenta);
            }
        });

        this.rowaction = new Ext.grid.RowActions({
            id: 'idRowaction',
            actions: [
                {
                    id: 'eliminar',
                    tooltip: this.idioma.lbToolDel,
                    //icon: this.perfil.dirImg + 'eliminar.png',
                    iconCls: 'eliminar',
                    marginLeft: 5,
                    width: 20,
                    height: 16
                }
            ]
        });

        this.stAnexoGasto = new Ext.data.Store({
            scope: this,
            reader: new Ext.data.JsonReader({}, [
                {name: 'idcuentagasto'},
                {name: 'nomcuenta'},
                {name: 'importemo'}
            ]),
            sortInfo: {field: 'idcuentagasto', direction: 'DESC'}
        });

        this.gpAnexoGasto = new Ext.grid.EditorGridPanel({
            //title: this.idioma.lbGetTalonario,
            // id: 'gpTalonario',
            region: 'center',
            width: 700,
            height: 400,
            stripeRows: true,
            border: false,
            frame: false,
            clicksToEdit: 2,
            store: this.stAnexoGasto,
            autoExpandColumn: 'idcuentagasto',
            columns: [
                {
                    id: 'idcuentagasto',
                    header: 'Cuenta',
                    dataIndex: 'idcuentagasto',
                    width: 200,
                    align: 'left',
                    editor: this.cbCuentaGasto,
                    renderer: function (value, metadata, record, rowIndex, colIndex, store) {
                        if (record.data.nomcuenta != '')
                            return record.data.nomcuenta;
                        else return me.cbCuentaGasto.displayFieldTemp;
                    }
                }, {
                    header: this.idioma.lbImporte,
                    dataIndex: 'importemo',
                    width: 80,
                    align: 'right',
                    editor: this.nfImporte,
                    renderer: formatoMonedaABS
                },
                this.rowaction
            ],
            plugins: [this.roweditor, this.rowaction],
            sm: this.smAnexoGasto = new Ext.grid.RowSelectionModel({
                singleSelect: true
            }),
            // viewConfig: {
            //     forceFit: true
            // },
            forceFit: true,
            tbar: [{
                scope: this,
                text: this.idioma.lbAdicionar,
                iconCls: 'adicionar',
                id: 'btnAddAnexo',
                tooltip: this.idioma.lbToolAdd,
                //icon: this.perfil.dirImg + 'adicionar.png',
                handler: function () {
                    var record = new this.recordData({
                        idcuentagasto: '',
                        importemo: '',
                        nomcuenta: ''
                    });
                    this.roweditor.stopEditing();
                    var total = this.stAnexoGasto.getCount();
                    this.stAnexoGasto.insert(total, record);
                    this.gpAnexoGasto.getSelectionModel().selectRow(total);
                    this.roweditor.startEditing(total);
                    this.cbCuentaGasto.focus(true, 100);
                }
            }],
            bbar: ['->', new Ext.Toolbar.TextItem('Total:'), this.labelTotal = new Ext.form.Label({
                text: '0.00'
            })]
        });

        this.items = this.gpAnexoGasto;
    },
    createButtons: function () {
        this.btnCancelar = new Ext.Button({
            id: 'btnCancelar',
            iconCls: 'cancelar',
            selectOnFocus: true,
            //disabled: true,
            text: this.idioma.lbCancelar,
            tooltip: this.idioma.lbToolCancelar,
            scope: this,
            handler: function () {
                this.close();
            }
        });
        this.btnAceptar = new Ext.Button({
            id: 'btnAceptar',
            iconCls: 'aceptar',
            disabled: true,
            text: this.idioma.lbAceptar,
            tooltip: this.idioma.lbToolAceptar
        });
        this.buttons = [this.btnCancelar, this.btnAceptar];
    },
    initEventos: function () {
        var me = this;

        me.on({
            show: function () {
                me.loadData(me.arrayCuenta, me.dataAnexo, me.idMoneda);
            }
        });

        this.btnAceptar.on({
            scope: this,
            click: function () {
                var arrayPase = [];
                var importeGasto = 0;
                var arrayData = me.gpAnexoGasto.getStore().getRange();
                for (var i = 0; i < arrayData.length; i++) {
                    arrayPase.push({
                        idcuentagasto: arrayData[i].data.idcuentagasto,
                        nomcuenta: arrayData[i].data.nomcuenta,
                        importemo: arrayData[i].data.importemo
                    });
                    importeGasto += parseFloat(arrayData[i].data.importemo);
                }
                me.scope.listAnexoGasto = arrayPase;
                me.close();
                Ext.CONT.Componentes.HideBox('msgbIniciando');
                me.scope.fireEvent('save', me.scope.listAnexoGasto, importeGasto);
            }
        });

        this.btnCancelar.on({
                click: function () {
                    Ext.CONT.Componentes.HideBox('msgbIniciando');
                    Ext.getBody().unmask();
                }
            }
        );

        this.rowaction.on('action', function (grid, record, action, rowIndex, col, e) {
            switch (action) {
                case 'eliminar':
                    mostrarMensaje(2, me.idioma.lbPregEliminar, function (btnPress) {
                        if (btnPress === 'ok') {
                            me.deleteAnexo();
                        }
                    });
                    break;
            }
        });
    },
    initFunctions: function () {
        var me = this;

        this.loadMask = function () {
            mask = new Ext.LoadMask(me.body, {
                msg: 'Cargando...'
            });
            mask.show();
        };

        this.deleteAnexo = function () {
            var seleccionado = this.gpAnexoGasto.getSelectionModel().getSelected();
            this.gpAnexoGasto.getStore().remove(seleccionado);
            if (this.gpAnexoGasto.getStore().getCount() == 0)
                this.btnAceptar.disable();
            else this.btnAceptar.enable();
            //Actualizar total
            var importeTotal = 0;
            for (var i = 0; i < this.gpAnexoGasto.getStore().getCount(); i++) {
                importeTotal += parseFloat(Math.abs(this.gpAnexoGasto.getStore().getAt(i).data.importemo));
            }
            this.labelTotal.setText(formatoMoneda(importeTotal));
        }
    },
    loadData: function (cuentagasto, data, idMoneda) {
        var importeTotal = 0;
        data.forEach(function (value) {
            importeTotal += parseFloat(Math.abs(value.importemo));
        });

        this.loadMask();
        this.stCuentaGasto.baseParams = {'arrayCuenta': Ext.encode(cuentagasto), 'idMoneda': idMoneda};
        this.stCuentaGasto.load({
            callback: function () {
                this.stAnexoGasto.loadData(data);
                this.labelTotal.setText(formatoMoneda(importeTotal));
                mask.hide();
            }.bind(this)
        });
    }
});