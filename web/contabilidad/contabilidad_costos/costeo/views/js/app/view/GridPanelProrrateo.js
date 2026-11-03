Ext.define('PRT.view.GridPanelProrrateo', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.gridpanelprorrateo',
    multiSelect: true,

    //idioma: eval('PRT.language.' + lang),
    idioma: PRT.language[lang],

    store: 'StProrrateo',

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
            anchor: '97.5%',
            forceSelection: true,
            labelStyle: 'margin: 0 0 5 0',
            //pageSize: 1,
            //fieldLabel: this.idioma.lbNivelProrrateo,
            //labelAlign: 'side',
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
            allowBlank: false,
            blankText: this.idioma.blankTextField,
            editable: false,
            queryMode: 'local',
            valueField: 'idnivelprorrateo',
            displayField: 'textnivelprorrateo',
            enforceMaxLength: true
        });

        //this.tbar = [this.idioma.lbNivelProrrateo, this.cbNivelProrrateo];

        this.columns = [
            Ext.create('Ext.grid.RowNumberer'),
            {
                header: 'Código',
                dataIndex: 'fecha',
                width: 70,
                align: 'center'
            },
            {
                header: this.idioma.lbDescripcion,
                dataIndex: 'descripcion',
                flex: 1,
                minWidth: 200
            },
            {
                header: 'Producción terminada',
                dataIndex: 'cuentaemisor',
                width: 250
            },
            {
                header: 'Producción en proceso',
                dataIndex: 'elementogastotraspaso',
                width: 250
            },
            {
                header: 'Costo unitario',
                dataIndex: 'idorigenBD',
                width: 150,
                align: 'center',
            },{
                header: 'Costo de producción terminada',
                dataIndex: 'idorigenBD',
                width: 150,
                align: 'center',
            },{
                header: 'No.Comprobante',
                dataIndex: 'idorigenBD',
                width: 150,
                align: 'center',
            },
            {
                header: 'Estado',
                dataIndex: 'idestado',
                width: 100,
                align: 'center',
                scope: this,

            }
            /*,
            {
                header: this.idioma.lbNoComprob,
                dataIndex: 'nocomprobante',
                width: 110,
                align: 'center'
            },
            {
                header: this.idioma.lbPorcientoTrasp,
                dataIndex: 'porcientotraspasar',
                width: 90,
                align: 'center'
            },
            {
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