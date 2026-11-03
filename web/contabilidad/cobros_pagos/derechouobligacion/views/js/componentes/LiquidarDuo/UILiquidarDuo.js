Ext.namespace('Ext.UILiquidarDuo');

Ext.UILiquidarDuo= Ext.extend(Ext.Window, {
    gpView: undefined,
    constructor: function(scope)
    {
        scope.btnCancelar = new Ext.Button({
            text: scope.etiquetas.lbBtnCancelar,
            tooltip: 'Cerrar ventana sin guardar los datos',//scope.etiquetas.lbBtnCerrar,
            tabIndex: 409,
            iconCls: 'cancelar',
            scope: this
        });

        scope.btnAceptar = new Ext.Button({
            id: 'btnAceptar',
            text: scope.etiquetas.lbBtnAceptar,
            tooltip: 'Guardar datos y cerrar ventana',//scope.etiquetas.lbBtnAceptar,
            disabled: true,
            tabIndex: 408,
            iconCls: 'aceptar',
            scope: this
        });

        scope.stLiquidarOperacion = new Ext.data.Store({
            url: 'CargarOperacionLiquidacion',
            autoLoad: false,
            reader: new Ext.data.JsonReader({
                id: 'idnomoperaciones'
            }, [{
                name: 'idnomoperaciones'
            },
                {
                    name: 'denominacion'
                }
            ]),
            baseParams: {
                tipoduo: scope.tipoDuo,
                idmoneda: scope.idmoneda,
                tipoContabilizacion: scope.tipoContabilizacion
            }
        });

        scope.stLiquidarCuenta = new Ext.data.Store({
            url: 'loadDataCuenta',
            autoLoad: false,
            reader: new Ext.data.JsonReader({
                root: 'datos'
            }, [{
                name: 'idcuenta'
            },
                {
                    name: 'text'
                }
            ]),
        });

		// scope.tfImporteLiquidar = new Ext.form.NumberField({
        //     id: 'tfImporteLiquidar',
        //     fieldLabel: 'Importe a liquidar',
        //     name: 'importecontable',
        //     anchor: '95%',
        //     minValue: 0,
        //     maxValue: scope.pendienteliq,
        //     allowBlank: false,
        //     editable: false,
		// 	style: 'text-align: right',
        //     disabledClass: 'disabled-component',
        //     tabIndex: 9,
        //     enableKeyEvents: true,
        //     selectOnFocus: true,
        //     // listeners: {
        //     //     keypress: function(t, e) {
        //     //         if ((e.getKey() == 13)) // para el suprimir y borrar
        //     //         {
        //     //             this.clearValue();
        //     //         }
        //     //     }
        //     // }
        // });

		scope.tfImporteRestante = new Ext.form.NumberField({
            id: 'nfImporteRestante',
            disabled: true,
            fieldLabel: scope.tipoContabilizacion === 1 ? scope.etiquetas.lbImportePen : 'Importe a cancelar',
            name: 'importecontablerestante',
            anchor: '100%',
            // minValue: 0,
            // allowBlank: false,
            editable: false,
			style: 'text-align: right',
            disabledClass: 'disabled-component',
            validator: function (value) {
                if (value > 0)
                    return true;
                else return false;
            }
        });

		scope.tfNumeroInst = new Ext.form.TextField({
            id: 'tfNumeroInst',
            fieldLabel: 'No. instrumento',
            name: 'numeroinst',
            anchor: '100%',
            allowBlank: false,
            maxLength: 50,
            maxLengthText: 'El tamaño m&aacute;ximo requerido es 50 caracteres.',
			// style: 'text-align: right',
        });

		scope.tfComentario = new Ext.form.TextField({
            id: 'tfComentario',
            fieldLabel: scope.etiquetas.lbComentario,
            name: 'importecontablerestante',
            anchor: '100%',
            allowBlank: false,
            maxLength: 100,
			// style: 'text-align: left',
        });

        scope.dateFieldLiq = new Ext.form.DateField({
            id: 'iddateFieldLiq',
            name: 'dateFieldLiq',
            fieldLabel: 'Fecha',
            allowBlank: false,
            value: scope.fechaContable,
            minValue: scope.desde,
            maxValue: scope.hasta,
            format: 'd/m/Y',
            disabledClass: 'disabled-component',
            selectOnFocus: true,
            // enableKeyEvents: true,
            anchor: '100%'
        });

       scope.cbLiquidarOperacion = new Ext.form.ComboBox({
           editable: false,
           store: scope.stLiquidarOperacion,
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
           // listeners: {
           //     keypress: function(t, e) {
           //         if ((e.getKey() == 8) || (e.getKey() == 46)) // para el suprimir y borrar
           //         {
           //             this.clearValue();
           //         }
           //     }
           // }
       });

        scope.cbLiquidarCuenta = new Ext.contabilidad.util.linkedCombo({
            store: scope.stLiquidarCuenta,
            fieldLabel: 'Cuentas',
            displayField: 'text',
            valueField: 'idcuenta',
            disabled: true,
            hideTbar: true,
            listHeight: 200,
            tabIndex: 11,
            anchor: '100%',
            mode: 'local',
            loaded: true,
            id: 'cbxCuenta',
            listeners: {
                specialkey: function (tf, e) {
                    if (e.getCharCode() == Ext.EventObject.ENTER)
                        scope.nfImporte.focus(true, 100);
                },
                select: function (cb, record) {
                    var index = scope.stLiquidar.find('idcuenta', cb.getValue());
                    if (index != -1) {
                        scope.cbLiquidarCuenta.reset();
                        mostrarMensaje(1, scope.etiquetas.lbMsgCuentaRepetida);
                    } else {
                        scope.nfImporte.focus(true, 100);
                    }
                }
            }
        });


        scope.nfImporte = new Ext.form.NumberField({
            allowBlank: false,
            allowNegative: false,
            validator: function (value) {
                if (value > 0)
                    return true;
                return 'El importe no puede ser 0.';
            }
        });

        scope.recordData = Ext.data.Record.create([
            {name: 'idcuenta', type: 'int'},
            {name: 'nomcuenta', type: 'string'},
            {name: 'importemo', type: 'float'}
        ]);

        scope.roweditor = new Ext.Cont.RowEditor({
            id: 'idRoweditor',
            clicksToEdit: 2,
            // cancelText: scope.etiquetas.lbCancelar,
            // saveText: scope.etiquetas.lbAceptar,
            iconClsSave: 'aceptar',
            iconClsCancel: 'cancelar',
            // saveTooltip: scope.etiquetas.lbToolRowEditorAceptar,
            // cancelTooltip: scope.etiquetas.lbToolRowEditorCancelar
        });


        scope.rowaction = new Ext.grid.RowActions({
            id: 'idRowaction',
            actions: [
                {
                    id: 'eliminar',
                    tooltip: scope.etiquetas.lbToolDel,
                    iconCls: 'eliminar',
                    marginLeft: 5,
                    width: 20,
                    height: 16
                }
            ]
        });

        scope.stLiquidar = new Ext.data.GroupingStore({
            reader: new Ext.data.JsonReader({}, [
                {name: 'idcuenta'},
                {name: 'nomcuenta'},
                {name: 'idliquidacion'},
                {name: 'idcomprobante', type: 'int'},
                {name: 'numerocomprobante'},
                {name: 'importemo', type: 'float'}
            ]),
            sortInfo: {field: 'idcomprobante', direction: 'DESC'},
            groupField: 'idcomprobante',
        });

        scope.smLiquidar = scope.tipoContabilizacion === 1 ? new Ext.grid.RowSelectionModel({
            singleSelect: true,
            id: 'row'
        }) : new Ext.grid.CheckboxSelectionModel({width: 25});

        var arrColumn = [
            {
                id: 'idcuenta',
                header: scope.etiquetas.lbCuenta,
                dataIndex: 'idcuenta',
                width: 200,
                align: 'left',
                editor: scope.cbLiquidarCuenta,
                renderer: function (value, metadata, record, rowIndex, colIndex, store) {
                    if (record.data.nomcuenta != '')
                        return record.data.nomcuenta;
                    else return scope.cbLiquidarCuenta.displayFieldTemp;
                }.bind(this)
            }, {
                header: scope.etiquetas.lbImporte,
                dataIndex: 'importemo',
                width: 80,
                align: 'right',
                editor: scope.nfImporte,
                renderer: formatoMonedaABS
            }, {
                header: '',
                dataIndex: 'idcomprobante',
                width: 80,
                hideable: false,
                hidden: true
            }
        ];

        if (scope.tipoContabilizacion === 1) {
            arrColumn.push(scope.rowaction);
        } else if (scope.tipoContabilizacion === 2) {
            arrColumn.unshift(scope.smLiquidar);
            this.gpView = new Ext.grid.GroupingView({
                // forceFit: true,
                groupTextTpl: "Comprobante: {[values.rs[0].data.numerocomprobante]}"
            });
        }


        scope.gpLiquidarDuo = new Ext.grid.EditorGridPanel({
            height: 300,
            stripeRows: true,
            border: false,
            frame: false,
            clicksToEdit: 2,
            store: scope.stLiquidar,
            autoExpandColumn: 'idcuenta',
            view: this.gpView,
            columns: arrColumn,
            plugins: scope.tipoContabilizacion === 1 ? [scope.roweditor, scope.rowaction] : undefined,
            sm: scope.smLiquidar,
            forceFit: true,
            tbar: [{
                text: scope.etiquetas.lbBtnAdicionar,
                iconCls: 'adicionar',
                id: 'btnAdd',
                disabled: true,
                hidden: scope.tipoContabilizacion !== 1,
                tooltip: 'Adicionar datos',
                handler: function () {
                    var record = new scope.recordData({
                        idcuenta: '',
                        importemo: '',
                        nomcuenta: ''
                    });
                    scope.roweditor.stopEditing();
                    var total = scope.stLiquidar.getCount();
                    scope.stLiquidar.insert(total, record);
                    scope.gpLiquidarDuo.getSelectionModel().selectRow(total);
                    scope.roweditor.startEditing(total);
                    scope.cbLiquidarCuenta.focus(true, 100);
                }
            }],
            bbar: ['->', new Ext.Toolbar.TextItem('Total:'), scope.labelTotal = new Ext.form.Label({
                text: '0.00'
            })]
        });

        if (scope.tipoContabilizacion === 1) {
            scope.fpCancelarAnticipo = new Ext.FormPanel({
                frame: true,
                border: false,
                id: 'fpBuscarAnticipo',
                autoHeight: true,
                layout: 'form',
                labelAlign: 'top',
                items: [
                    {
                        layout: 'column',
                        labelAlign: 'top',
                        items: [
                            {
                                columnWidth: 0.4,
                                layout: 'form',
                                items: [scope.cbLiquidarOperacion]
                            },{
                                columnWidth: 0.3,
                                layout: 'form',
                                style: 'margin: 0 0 0 10',
                                items: [scope.dateFieldLiq]
                            },
                            {
                                columnWidth: 0.3,
                                style: 'margin: 0 0 0 10',
                                layout: 'form',
                                items: [scope.tfImporteRestante]
                            }
                        ]
                    },{
                        layout: 'column',
                        frame: false,
                        labelAlign: 'top',
                        border: false,
                        items: [
                            {
                                columnWidth: 0.7,
                                layout: 'form',
                                items: [scope.tfComentario]
                            },
                            {
                                columnWidth: 0.3,
                                style: 'margin: 0 0 0 10',
                                layout: 'form',
                                items: [scope.tfNumeroInst]
                            }
                        ]
                    }
                    ]
            });
        } else if (scope.tipoContabilizacion === 2) {
            scope.fpCancelarAnticipo = new Ext.FormPanel({
                frame: true,
                border: false,
                id: 'fpBuscarAnticipo',
                autoHeight: true,
                layout: 'form',
                labelAlign: 'top',
                items: [
                    {
                        layout: 'column',
                        items: [
                            {
                                columnWidth: 0.7,
                                layout: 'form',
                                items: [scope.tfComentario]
                            },
                            {
                                columnWidth: 0.3,
                                style: 'margin: 0 0 0 10',
                                layout: 'form',
                                items: [scope.tfImporteRestante]
                            }
                        ]
                    }
                    ]
            });
        }


        Ext.apply(this, {
            modal: true,
            id: 'winCancelar',
            frame: true,
            resizable: false,
            bodyStyle: 'padding:5px 5px 5px',
            border: false,
            closable: true,
            layout: 'fit',
            // defaultButton: 'btnAceptar',
            title: scope.tipoContabilizacion === 1 ? 'Liquidar' : 'Cancelar liquidaci&oacute;n',
            width: '35%',
            constrain: true,
            items: [scope.fpCancelarAnticipo, scope.gpLiquidarDuo],
            buttons: [scope.btnCancelar, scope.btnAceptar]
        });

        return Ext.UILiquidarDuo.superclass.constructor.call(this);
    }
});
