Ext.define('GestionContratoImportacion.view.GridHistorialContratacion', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.gridhistorialcontratacionimportacion',
    region: 'center',
    plugins: [
        {
            ptype: 'rowexpander',
            rowBodyTpl: new Ext.XTemplate(
                '<hr><tpl if="idcontrato == idpadre"><b>Contrato original</b><tpl else>' +
                '<span><b>Objeto del suplemento:</b> {objetosuplemento}</span></tpl>'
            )
        }
    ],
    initComponent: function () {
        var me = this;
        me.etiquetas = LangMgr.getLang(me);
        me.selModel=Ext.create('Ext.selection.RowModel');
        me.store = Ext.create('Ext.data.Store', {
            storeId: 'stHistorialImportacion',
            remoteSort: true,
            autoLoad: true,
            pageSize: 25,
            fields: [],
            proxy: {
                type: 'ajax',
                url: UtilsFn.buildUrl({action: 'historial'}, ModuleMgr.get('GestionContratoImportacion')),
                actionMethods: {
                    read: 'POST'
                },
                extraParams: {
                    idcontrato: me.idcontrato
                },
                reader: {
                    root: 'data',
                    totalProperty: 'cant',
                    successProperty: 'success'
                }
            }
        });
        console.log('store de historico >>>>>>>>>>>>>>>>>>>>>', me.store);
        //COLUMNAS
        me.columns = [
            {
                text: me.etiquetas.lbNumberContrato,
                sortable: false,
                dataIndex: 'numerocontrato',
                locked: true,
                minWidth: 70,
                width: 110,
                renderer: function (value, meta) {
                    if (value) {
                        meta.tdAttr = 'data-qtip="' + value + '"';
                    }
                    return value;
                }
            }, {
                text: me.etiquetas.lbName,
                sortable: false,
                dataIndex: 'nombre',
                locked: true,
                minWidth: 200,
                width: 270,
                renderer: function (value, meta) {
                    if (value) {
                        meta.tdAttr = 'data-qtip="' + value + '"';
                    }
                    return value;
                }
            }, {
                text: me.etiquetas.lbClientProv,
                sortable: true,
                minWidth: 100,
                flex: 0.1,
                dataIndex: 'clienteproveedor',
                renderer: function (value, meta) {
                    if (value) {
                        meta.tdAttr = 'data-qtip="' + value + '"';
                    }
                    return value;
                }
            }, {
                hidden: true,
                dataIndex: 'idclienteproveedor',
                hideable: false
            }, {
                text: me.etiquetas.lbTotalAmount,
                sortable: true,
                align: 'right',
                minWidth: 62,
                width: 80,
                dataIndex: 'montototal',
                renderer: function (value, meta) {
                    if (value) {
                        meta.tdAttr = 'data-qtip="' + value + '"';
                    }
                    return value;
                }
            }, {
                text: me.etiquetas.lbSignDate,
                sortable: true,
                align: 'center',
                minWidth: 70,
                width: 80,
                dataIndex: 'fechafirma',
                renderer: function (value, meta) {
                    if (value) {
                        meta.tdAttr = 'data-qtip="' + value + '"';
                    }
                    return value;
                }
            }, {
                text: me.etiquetas.lbFechaInicio,
                sortable: true,
                align: 'center',
                minWidth: 70,
                width: 80,
                dataIndex: 'fechainicio',
                renderer: function (value, meta) {
                    if (value) {
                        meta.tdAttr = 'data-qtip="' + value + '"';
                    }
                    return value;
                }
            }, {
                text: me.etiquetas.lbFechaFin,
                sortable: true,
                align: 'center',
                minWidth: 70,
                width: 80,
                dataIndex: 'fechafin',
                renderer: function (value, meta) {
                    if (value) {
                        meta.tdAttr = 'data-qtip="' + value + '"';
                    }
                    return value;
                }
            }, {
                text: me.etiquetas.lbTypeContract,
                sortable: true,
                align: 'leaft',
                minWidth: 85,
                flex: 0.1,
                dataIndex: 'tipocontrato',
                renderer: function (value, meta) {
                    if (value) {
                        meta.tdAttr = 'data-qtip="' + value + '"';
                    }
                    return value;
                }
            }, {
                text: me.etiquetas.lbEstado,
                sortable: true,
                minWidth: 80,
                width: 80,
                dataIndex: 'iconoestadoinicial',
                renderer: function (value, meta) {
                    meta.innerCls = "icondistra-" + value;
                    meta.tdAttr = 'data-qtip="' + meta.record.data.estadoinicial + '"';
                    return meta.record.data.estadoinicial;
                }
            }, {
                text: me.etiquetas.lbColumnMarco,
                sortable: true,
                align: 'center',
                width: 40,
                minWidth: 40,
                dataIndex: 'contratomarco',
                renderer: function (value, meta) {
                    meta.innerCls = value ? "icondistra-true verde" : "icondistra-false rojo";
                    meta.tdAttr = 'data-qtip="' + (value ? me.etiquetas.qtipContratoMarco : me.etiquetas.lbContrato) + '"';
                }
            }, {
                text: me.etiquetas.lbCliente,
                sortable: true,
                align: 'center',
                minWidth: 40,
                width: 40,
                dataIndex: 'cliente',
                renderer: function (value, meta) {
                    meta.innerCls = value ? "icondistra-true verde" : "icondistra-false rojo";
                    meta.tdAttr = 'data-qtip="' + (value ? me.etiquetas.lbContratoCliente : me.etiquetas.lbContratoProveedor) + '"';
                }
            }, {
                hidden: true,
                dataIndex: 'idtipocontrato',
                hideable: false
            }
        ];
        console.log('Columnass historico>>>>>>>>>>>>>>>>>>>>>>>>>', me.columns);

        me.dockedItems = [
            {
                xtype: 'pagingtoolbar',
                store: me.store,
                dock: 'bottom',
                pageNumb: true,
                displayInfo: true
            }
        ];
        me.frame = false;
        me.margin = false;
        me.border = false;
        me.enableLocking = true;

        me.viewConfig = {
            getRowClass: function (record, rowIndex, rowParams, store) {
                return record.data.idcontrato != record.data.idpadre ? "" : "contractcolor";
            }
        };

        me.createToolbar();
        me.callParent();

    },
    createToolbar: function () {
        this.btnDetails = Ext.create('Ext.Button', {
            iconCls: 'detalles',
            action: 'detail',
            selector: 'btnAdd',
            disabled: true,
            text: this.etiquetas.lbBtnDetail,
            tooltip: this.etiquetas.qtipDetail
        });

        // this.btnMod = Ext.create('Ext.Button', {
        //     iconCls: 'modificar',
        //     action: 'edit',
        //     selector: 'btnModHitorico',
        //     hidden: this.showModHistorico ? false : true,
        //     disabled: true,
        //     text: this.etiquetas.lbBtnMod,
        //     tooltip: this.etiquetas.qtipModificar
        // });

        this.tbar = [this.btnDetails];
          // , this.btnMod

    }
});
