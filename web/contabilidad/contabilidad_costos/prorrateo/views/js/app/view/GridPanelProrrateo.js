Ext.define('PRT.view.GridPanelProrrateo', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.gridpanelprorrateo',
    multiSelect: true,

    //idioma: eval('PRT.language.' + lang),
    idioma: PRT.language[lang],

    store: 'StProrrateo',
    features: [{
        // id: 'group',
        // ftype: 'groupingsummary',
        ftype: 'grouping',
        groupHeaderTpl: '{name}',
        summaryType: 'count',
        hideGroupedHeader: true,
        enableGroupingMenu: false
    }],
    initComponent: function () {

        this.viewConfig = {
            stripeRows: true/*,
            loadMask: {
                msg: this.idioma.msgCargando
            }*/
        };

        this.region = 'center';

        this.cbNivelProrrateo = Ext.create('Ext.form.ComboBox', {
            name: 'nivelprorrateo',
            // anchor: '97.5%',
            width: 120,
            forceSelection: true,
            labelStyle: 'margin: 0 0 5 0',
            //pageSize: 1,
            //fieldLabel: this.idioma.lbNivelProrrateo,
            //labelAlign: 'side',
            //-----------------
            emptyText: 'Seleccione...',
            trigger2Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
            trigger2tip: 'Limpiar el campo y recargar los datos',
            listeners: {
                render: function (c) {
                    c.triggerCell.elements[1].set({'data-qtip': c.trigger2tip});
                },
                select: function (c) {
                    this.triggerCell.item(1).setDisplayed(true);
                }
            },
            onTrigger2Click: function () {
                //Esto sirve para esconder el trigger especificado
                this.triggerCell.item(1).setDisplayed(false);
                this.clearValue();
                // this.expand();
                // this.getStore().removeAll();
                // this.getStore().load();
            },
            //-----------------
            store: Ext.create('Ext.data.Store', {
                autoLoad: true,
                storeId: 'stNivelProrrateo',
                //pageSize: 25,
                fields: [
                    {
                        name: 'idnivelprorrateo'
                    },
                    {
                        name: 'nivelprorrateo'
                    },
                    {
                        name: 'textnivelprorrateo',
                        convert: function (value, record) {
                            return 'Nivel ' + record.data.nivelprorrateo;
                        }
                    },
                    {
                        name: 'idparteformatoorigen'
                    },
                    {
                        name: 'idparteformatodestino'
                    },
                    {
                        name: 'idestructuracomun'
                    }
                ],
                proxy: {
                    type: 'ajax',
                    url: 'getDatNivelProrrateo',
                    reader: {
                        type: 'json',
                        root: 'datanivelprorrateo'
                    }
                }
            }),
            // allowBlank: false,
            // blankText: this.idioma.blankTextField,
            editable: false,
            queryMode: 'local',
            valueField: 'idnivelprorrateo',
            displayField: 'textnivelprorrateo',
            enforceMaxLength: true
        });

        this.tbar = [this.idioma.lbNivelProrrateo, this.cbNivelProrrateo];

        this.columns = [
            Ext.create('Ext.grid.RowNumberer'),
            {
                header: 'Fecha de ejecución' /*this.idioma.lbFecha*/,
                dataIndex: 'fecha',
                width: 120,
                align: 'center'
            },
            {
                header: this.idioma.lbDescripcion,
                dataIndex: 'descripcion',
                flex: 1,
                minWidth: 200
            },
            {
                header: this.idioma.lbEmisor,
                dataIndex: 'cuentaemisor',
                width: 250
            },
            {
                header: this.idioma.lbElementoGastoTraspaso,
                dataIndex: 'elementogastotraspaso',
                width: 250
            },
            {
                header: this.idioma.lbOrigenBaseDistr,
                dataIndex: 'idorigenBD',
                width: 150,
                align: 'center',
                scope: this,
                renderer: function (value, metaData, record, rowIndex, colIndex, store, view) {
                    if (value == 1) {
                        return this.idioma.lbUnidadesFisicas;
                    }
                    else if (value == 2) {
                        return this.idioma.lbMontoTotal;
                    }
                    else if (value == 4) {
                        return this.idioma.lbCentroCosto;
                    }
                    else {
                        return this.idioma.lbElementoGasto;
                    }
                }
            },
            /*{
                header: this.idioma.lbEstado,
                dataIndex: 'idestado',
                width: 100,
                align: 'center',
                scope: this,
                renderer: function (value, metaData, record, rowIndex, colIndex, store, view) {
                    if (value == 1) {
                        return this.idioma.lbEstadoElaborado;
                    } else if (value == 2) {
                        return this.idioma.lbEstadoEjecutado;
                    }
                    else {
                        return this.idioma.lbEstadoCancelado;
                    }
                }
            },*/
            /*{
                header: this.idioma.lbNoComprob,
                dataIndex: 'nocomprobante',
                width: 110,
                align: 'center'
            },*/
            {
                header: this.idioma.lbNoComprob,
                xtype: 'actioncolumn',
                width: 110,
                itemId: 'actioncolumngridprorrateo',
                dataIndex: 'nocomprobante',
                align: 'center',
                items: [
                    {
                        scope: this,
                        iconCls: 'icondistra-ver',
                        // tooltip: 'Ver comprobante',
                        isDisabled: function (view, rowindex, colindex, item, record) {
                            if (record.get('arridcomprobante')) {
                                return false;
                            } else {
                                return true;
                            }
                        },
                        getTip: function (v, metadata, record, rowindex, colindex, store) {
                            return 'Ver comprobante(s) ' + v;
                        },
                        // handler: function (viewTable, rowIndex, colIndex, item, e, record) {
                        //     // viewTable.getSelectionModel().select(record);
                        //     //
                        //     // this.delReceptores([record]);
                        // }
                    }
                ]
            },
            /*{
                header: this.idioma.lbPorcientoTrasp,
                dataIndex: 'porcientotraspasar',
                width: 90,
                align: 'center'
            },*/
            /*{
                menuDisabled: true,
                hideable: false,
                sortable: false,
                xtype: 'actioncolumn',
                width: 70,
                itemId: 'actioncolumngridprorrateo',
                align: 'right',
                items: [
                    {
                        tooltip: this.idioma.lbVerComp,
                        getClass: function (v, metadata, record, rowIndex, colIndex, store) {
                            if (record.data.nocomprobante || record.data.idcomprobante) {
                                return 'icondistra-ver';
                            }
                            return;
                        }/!*,
                        isDisabled: function(grid, rowIndex, colIndex, item, record) {
                            if(record.data.nocomprobante || record.data.idcomprobante) {
                                return false;
                            }
                            return true;
                        }*!//!*,
                        handler: function (grid, rowIndex, colIndex, item, e, record) {
                            // var rec = grid.getStore().getAt(rowIndex);
                            // Ext.Msg.alert('Sell', 'Sell ' + rec.get('company'));
                        }*!/
                    },
                    {
                        iconCls: 'icondistra-modificar',
                        tooltip: this.idioma.lbModificarProrrateo/!*,
                        handler: function (grid, rowIndex, colIndex, item, e, record) {
                            // var rec = grid.getStore().getAt(rowIndex);
                            // Ext.Msg.alert('Sell', 'Sell ' + rec.get('company'));
                        }*!/
                    },
                    {
                        iconCls: 'icondistra-eliminar',
                        tooltip: this.idioma.lbEliminarProrrateo/!*,
                        handler: function (grid, rowIndex, colIndex, item, e, record) {
                            // var rec = grid.getStore().getAt(rowIndex);
                            // Ext.Msg.alert('Sell', 'Sell ' + rec.get('company'));
                        }*!/
                    }
                ]
            }*/
        ];

        this.callParent(arguments);
    }
});