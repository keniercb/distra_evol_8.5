Ext.namespace('Ext.AnexoGasto');

Ext.AnexoGasto = Ext.extend(Ext.grid.EditorGridPanel, {
    constructor: function () {
        Ext.QuickTips.init();
        var perfil = window.parent.perfil;
        perfil.etiquetas = Object();
        this.listAnexoGasto = [];
        this.layout = 'fit';
        this.arrayCuenta = undefined;
        this.dataAnexo = undefined;
        this.idMoneda = undefined;
        this.url = '/contabilidad/cobros_pagos/derechouobligacion/index.php/anexogasto/';

        this.height = 300;
        this.stripeRows = true;
        this.border = true;
        this.frame = false;
        this.clicksToEdit = 2;
        this.autoExpandColumn = 'idcuentagasto';
        this.forceFit = true;
        this.disabledClass = 'disabled-component';

        // var xhr = new XMLHttpRequest();
        // xhr.open("GET", "/contabilidad/cobros_pagos/derechouobligacion/index.php/anexogasto/cargaretiquetas", false);
        // xhr.onload = function (e) {
        //     if (xhr.readyState === 4) {
        //         if (xhr.status === 200) {
        //         } else {
        //         }
        //     }
        // };
        // xhr.onerror = function (e) {
        // };
        // xhr.send(null);

        this.createGrid(this);
        this.initFunctions();
        this.addEvents('save');
        Ext.AnexoGasto.superclass.constructor.call(this);
        this.initEventos();
    },
    createGrid: function (scope) {
        var me = scope;
        //Combo Cuenta-----------
        this.stCuentaGasto = new Ext.data.Store({
            url: this.url + 'cargarCuenta',
            // baseParams: {'arrayCuenta': Ext.encode(this.arrayCuenta), 'idMoneda': this.idMoneda},
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
            fieldLabel: 'Cuenta',
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
                    var index = me.store.find('idcuentagasto', cb.getValue());
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
            cancelText: 'Cancelar',
            saveText: 'Aceptar',
            iconClsSave: 'aceptar',
            iconClsCancel: 'cancelar',
            saveTooltip: 'Guardar cambios',
            cancelTooltip: 'Cancelar edición'
        });

        this.rowaction = new Ext.grid.RowActions({
            id: 'idRowaction',
            actions: [
                {
                    id: 'eliminar',
                    tooltip: 'Eliminar anexo de gasto',
                    //icon: this.perfil.dirImg + 'eliminar.png',
                    iconCls: 'eliminar',
                    marginLeft: 5,
                    width: 20,
                    height: 16
                }
            ]
        });

        this.store = new Ext.data.Store({
            scope: this,
            reader: new Ext.data.JsonReader({}, [
                {name: 'idcuentagasto'},
                {name: 'nomcuenta'},
                {name: 'importemo'}
            ]),
            sortInfo: {field: 'idcuentagasto', direction: 'DESC'}
        });

        this.columns = [
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
                header: 'Importe',
                dataIndex: 'importemo',
                width: 80,
                align: 'right',
                editor: this.nfImporte,
                renderer: formatoMonedaABS
            },
            this.rowaction
        ];

        // this.cm =  new Ext.grid.ColumnModel([
        //     {header: "Cuenta", id: 'idcuentagasto', width: 200, align: 'left', editor: this.cbCuentaGasto,
        //         renderer: function (value, metadata, record, rowIndex, colIndex, store) {
        //             if (record.data.nomcuenta != '')
        //                 return record.data.nomcuenta;
        //             else return me.cbCuentaGasto.displayFieldTemp;
        //         }},
        //     {header: 'Importe', dataIndex: 'importemo', width: 80, align: 'right', editor: this.nfImporte, renderer: formatoMonedaABS},
        //     this.rowaction
        // ]);

        this.plugins = [this.roweditor, this.rowaction];

        this.sm = new Ext.grid.RowSelectionModel({
            singleSelect: true
        });

        this.tbar = [{
            scope: this,
            text: 'Adicionar',
            iconCls: 'adicionar',
            id: 'btnAddAnexo',
            disabled: true,
            tooltip: 'Adicionar anexo de gasto',
            //icon: this.perfil.dirImg + 'adicionar.png',
            handler: function () {
                var record = new this.recordData({
                    idcuentagasto: '',
                    importemo: '',
                    nomcuenta: ''
                });
                this.roweditor.stopEditing();
                var total = this.store.getCount();
                this.store.insert(total, record);
                this.getSelectionModel().selectRow(total);
                this.roweditor.startEditing(total);
                this.cbCuentaGasto.focus(true, 100);
            }
        }];

        // this.bbar = ['->', new Ext.Toolbar.TextItem('Total:')/*, this.labelTotal = new Ext.form.Label({
        //     text: '0.00'
        // })*/];

    },
    // createButtons: function () {
    //     this.btnCancelar = new Ext.Button({
    //         id: 'btnCancelar',
    //         iconCls: 'cancelar',
    //         selectOnFocus: true,
    //         //disabled: true,
    //         text: this.idioma.lbCancelar,
    //         tooltip: this.idioma.lbToolCancelar,
    //         scope: this,
    //         handler: function () {
    //             this.close();
    //         }
    //     });
    //     this.btnAceptar = new Ext.Button({
    //         id: 'btnAceptar',
    //         iconCls: 'aceptar',
    //         disabled: true,
    //         text: this.idioma.lbAceptar,
    //         tooltip: this.idioma.lbToolAceptar
    //     });
    //     this.buttons = [this.btnCancelar, this.btnAceptar];
    // },
    initEventos: function () {
        var me = this;

        // me.on({
        //     show: function () {
        //         me.loadData(me.arrayCuenta, me.dataAnexo, me.idMoneda);
        //     }
        // });

        // this.btnAceptar.on({
        //     scope: this,
        //     click: function () {
        //         var arrayPase = [];
        //         var importeGasto = 0;
        //         var arrayData = me.getStore().getRange();
        //         for (var i = 0; i < arrayData.length; i++) {
        //             arrayPase.push({
        //                 idcuentagasto: arrayData[i].data.idcuentagasto,
        //                 nomcuenta: arrayData[i].data.nomcuenta,
        //                 importemo: arrayData[i].data.importemo
        //             });
        //             importeGasto += parseFloat(arrayData[i].data.importemo);
        //         }
        //         me.listAnexoGasto = arrayPase;
        //         Ext.CONT.Componentes.HideBox('msgbIniciando');
        //         me.fireEvent('save', me.listAnexoGasto, importeGasto);
        //     }
        // });

        this.roweditor.on({
            scope: this,
            afteredit: function (editor, grid, changes, record, rowIndex) {
                record.data.nomcuenta = this.cbCuentaGasto.displayFieldTemp;
                this.getArrayPase();
                Ext.CONT.Componentes.HideBox('msgbIniciando');
            },
            beforeedit: function (roweditor, grid, record, rowIndex) {
                this.cbCuentaGasto.setValue(record.data.idcuentagasto, record.data.nomcuenta);
            }
        });

        this.cbCuentaGasto.on({
            scope: this,
            load: function (responde) {
                var datos = Ext.decode(responde.responseText);
                if (datos.datos.length == 0) {
                    this.addBtnSetDisable();
                    mostrarMensaje(1, 'Por favor revise el modelo asociado a la operación, no existe cuenta con la misma moneda.')
                }
            }
        });

        this.rowaction.on('action', function (grid, record, action, rowIndex, col, e) {
            switch (action) {
                case 'eliminar':
                    if (!Ext.getCmp('btnAddAnexo').disabled) {
                        mostrarMensaje(2, '¿Está seguro que desea eliminar el anexo de gasto seleccionado?', function (btnPress) {
                            if (btnPress === 'ok') {
                                me.deleteAnexo();
                            }
                        });
                    }
                    break;
            }
        });
    },
    initFunctions: function () {
        var me = this;

        // this.loadMask = function () {
        //     mask = new Ext.LoadMask(me.body, {
        //         msg: 'Cargando...'
        //     });
        //     mask.show();
        // };

        this.getArrayPase = function () {
            var arrayPase = [];
            var importeGasto = 0;
            arrayData = this.getStore().getRange();
            for (var i = 0; i < arrayData.length; i++) {
                arrayPase.push({
                    idcuentagasto: arrayData[i].data.idcuentagasto,
                    nomcuenta: arrayData[i].data.nomcuenta,
                    importemo: arrayData[i].data.importemo
                });
                importeGasto += parseFloat(arrayData[i].data.importemo);
            }
            this.fireEvent('save', arrayPase, parseFloat(importeGasto.toFixed(2)));
        };

        this.deleteAnexo = function () {
            var seleccionado = this.getSelectionModel().getSelected();
            this.getStore().remove(seleccionado);
            this.getArrayPase();
        }
    },
    loadData: function (cuentagasto, data, idMoneda, arrayCuentaMixta) {
        this.cbCuentaGasto.setBaseParams({'arrayCuenta': Ext.encode(cuentagasto), 'idMoneda': idMoneda, 'arrayCuentaMixta': Ext.encode(arrayCuentaMixta)});
        this.cbCuentaGasto.load(null, function () {
            this.store.loadData(data);
            this.getArrayPase();
            this.addBtnSetDisable(false);
        }, this)
    },
    addBtnSetDisable: function (Desabilitar = true) {
        Ext.getCmp('btnAddAnexo').setDisabled(Desabilitar);
    },
    addDisableGrid: function (Desabilitar = true) {
        this.disable();
    },
    cleanGrid: function () {
        this.getStore().removeAll();
    }
});