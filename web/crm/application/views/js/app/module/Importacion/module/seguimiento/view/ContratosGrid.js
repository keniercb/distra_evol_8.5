Ext.define('Seguimiento.view.ContratosGrid', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.s_contratosgrid',
    itemId: 'contratosgrid',
    minWidth: 250,
    detallado: false,
    storeId: 's_stContratos',
    filtros: {},
    module: 'Seguimiento',
    initComponent: function () {
        var me = this;

        me.etiquetas = LangMgr.getLang(me);
        Ext.util.Format.decimalSeparator = ',';
        Ext.util.Format.thousandSeparator = '.';
        Ext.util.Format.currencyPrecision = 2;
        Ext.util.Format.currencySign = ' ';
        me.emptyText = me.etiquetas.msgVacioContratos;
        me.store = Ext.create('Seguimiento.store.Contratos', {
            storeId: me.storeId, onlyOneLoad: true
        });
        me.selModel = {mode: 'MULTI'};
        me.frame = false;
        me.margin = false;
        me.border = false;
        me.emptyText = me.etiquetas.msgNoDataLoaded;
        me.features = [
            {
                ftype: 'filters',
                menuFilterText: me.etiquetas.lbbusqueda,
                local: false,
                filters: [
                    {
                        dataIndex: 'numero',
                        type: 'string'
                    },
                    {
                        dataIndex: 'fecharegistro',
                        type: 'date',
                        beforeText: me.etiquetas.lbantes,
                        afterText: me.etiquetas.lbdespues,
                        onText: me.etiquetas.lbigual,
                        dateFormat: 'd/m/Y'
                    },
                    {
                        dataIndex: 'fechafirma',
                        type: 'date',
                        beforeText: me.etiquetas.lbantes,
                        afterText: me.etiquetas.lbdespues,
                        onText: me.etiquetas.lbigual,
                        dateFormat: 'd/m/Y'
                    },
                    {
                        dataIndex: 'fechafin',
                        type: 'date',
                        beforeText: me.etiquetas.lbantes,
                        afterText: me.etiquetas.lbdespues,
                        onText: me.etiquetas.lbigual,
                        dateFormat: 'd/m/Y'
                    },
                    {
                        dataIndex: 'tipocontrato',
                        type: 'list',
                        idField: 'denominaciontipocontrato',
                        labelField: 'denominaciontipocontrato',
                        store: Ext.create('Ext.data.Store', {
                            autoLoad: false,
                            proxy: {
                                extraParams: {columnlist: 'denominaciontipocontrato,idtipocontrato'},
                                type: 'ajax',
                                url: UtilsFn.buildUrl({action: 'filterliststore'}, ModuleMgr.get('GestionContratoImportacion'))
                            },
                            fields: [
                                {name: 'denominaciontipocontrato', type: 'string'},
                                {name: 'idtipocontrato'}
                            ]
                        })
                    },
                    {
                        dataIndex: 'marco',
                        type: 'boolean',
                        yesText: me.etiquetas.lbYes,
                        noText: me.etiquetas.lbNo
                    }
                ]
            },
            {
                ftype: 'summary',
                dock: 'top'
            }
        ];

        // COLUMNAS
        me.columns = [
            {
                text: me.etiquetas.lbNumberContrato,
                dataIndex: 'numerocontrato',
                minWidth: 70,
                maxWidth: 140,
                flex: 1,
                renderer: function (value, meta) {
                    if (value) {
                        meta.tdAttr = 'data-qtip="' + value + '"';
                    }
                    return value;
                },
                filter: {
                    type: 'string'
                },
                summaryRenderer: function (value, summaryData, dataIndex) {
                    return (value !== 0 ? '<b>Totales:</b>' : '');
                }
            },
            {
                text: me.etiquetas.lbNumber,
                dataIndex: 'numero',
                minWidth: 70,
                width: 110,
                hidden: true,
                renderer: function (value, meta) {
                    if (value) {
                        meta.tdAttr = 'data-qtip="' + value + '"';
                    }
                    return value;
                },
                filter: {
                    type: 'string'
                }
            },
            {
                text: me.etiquetas.lbName,
                dataIndex: 'nombre',
                minWidth: 200,
                flex: 1,
                renderer: function (value, meta) {
                    if (value) {
                        meta.tdAttr = 'data-qtip="' + value + '"';
                    }
                    return value;
                },
                filter: {
                    type: 'string'
                },
                summaryType: 'count',
                summaryRenderer: function (value, summaryData, dataIndex) {
                    return Ext.String.format('{0} contrato{1}', value, value !== 1 ? 's' : '') + ' de ' + me.getStore().proxy.reader.jsonData.cant;
                }
            },
            {
                text: me.etiquetas.lbClientProv,
                sortable: true,
                minWidth: 100,
                flex: 1,
                dataIndex: 'clienteproveedor',
                renderer: function (value, meta) {
                    if (value) {
                        meta.tdAttr = 'data-qtip="' + value + '"';
                    }
                    return value;
                },
                filter: {
                    type: 'string'
                }
            },
            {
                text: me.etiquetas.lbArea,
                sortable: true,
                minWidth: 100,
                flex: 0.1,
                dataIndex: 'nombrearea',
                renderer: function (value, meta) {
                    if (value) {
                        meta.tdAttr = 'data-qtip="' + value + '"';
                    }
                    return value;
                },
                filter: {
                    type: 'string'
                }
            },
            {
                text: me.etiquetas.lbTotalAmount,
                sortable: true,
                align: 'right',
                minWidth: 80,
                width: 100,
                dataIndex: 'montototal',
                renderer: function (value, meta, record) {
                    if (!Ext.isEmpty(value)) {
                        value = Ext.util.Format.currency(value);
                        var qtip = '<b>Total:</b>' + value + '<hr/>';
                        for (a in record.data.monedas) {
                            qtip += '<b>' + record.data.monedas[a]['codigoiso'] + ':</b>' +
                                Ext.util.Format.currency(record.data.monedas[a]['monto']) + '<br/>'
                        }
                        meta.tdAttr = 'data-qtip="' + qtip + '"';
                    }
                    return value;
                },
                filter: {
                    type: 'numeric'
                },
                summaryType: function (records, dataindex, b) {
                    var total = 0;
                    records.forEach(function (x) {
                        if (x.get(dataindex))
                            total += parseFloat(x.get(dataindex));
                    });
                    return total;
                }
            },
            {
                text: me.etiquetas.lbFechaRegistro,
                sortable: true,
                hidden: true,
                align: 'center',
                minWidth: 70,
                width: 80,
                dataIndex: 'fechainicio',
                renderer: function (value, meta) {
                    if (value) {
                        meta.tdAttr = 'data-qtip="' + value + '"';
                    }
                    return value;
                },
                filter: {
                    dataIndex: 'fechainicio',
                    type: 'date',
                    beforeText: me.etiquetas.lbantes,
                    afterText: me.etiquetas.lbdespues,
                    onText: me.etiquetas.lbigual
                }
            },
            {
                text: me.etiquetas.lbFechaFirma,
                sortable: true,
                hidden: !me.detallado,
                align: 'center',
                minWidth: 70,
                width: 80,
                dataIndex: 'fechafirma',
                renderer: function (value, meta) {
                    if (value) {
                        meta.tdAttr = 'data-qtip="' + value + '"';
                    }
                    return value;
                },
                filter: {
                    type: 'date',
                    beforeText: me.etiquetas.lbantes,
                    afterText: me.etiquetas.lbdespues,
                    onText: me.etiquetas.lbigual
                }
            },
            {
                text: me.etiquetas.lbFechaFin,
                sortable: true,
                hidden: true,
                align: 'center',
                minWidth: 70,
                dataIndex: 'fechafin',
                renderer: function (value, meta) {
                    if (value) {
                        meta.tdAttr = 'data-qtip="' + value + '"';
                    }
                    return value;
                },
                filter: {
                    dataIndex: 'fechafin',
                    type: 'date',
                    beforeText: me.etiquetas.lbantes,
                    afterText: me.etiquetas.lbdespues,
                    onText: me.etiquetas.lbigual
                }
            },
            {
                text: me.etiquetas.lbTypeContract,
                sortable: true,
                hidden: true,
                align: 'leaft',
                minWidth: 85,
                flex: 0.1,
                dataIndex: 'tipocontrato',
                renderer: function (value, meta) {
                    if (value) {
                        meta.tdAttr = 'data-qtip="' + value + '"';
                    }
                    return value;
                },
            },
            {
                text: me.etiquetas.lbEstado,
                sortable: true,
                minWidth: 80,
                width: 80,
                dataIndex: 'estadoinicial',
                renderer: function (value, meta) {
                    meta.innerCls = "icondistra-" + meta.record.data.iconoestadoinicial;
                    meta.tdAttr = 'data-qtip="' + value + '"';
                    return value;
                },
                filter: {
                    type: 'list',
                    idField: 'idestado',
                    labelField: 'nombre',
                    store: Ext.create('Ext.data.Store', {
                        autoLoad: false,
                        proxy: {
                            extraParams: {
                                columnlist: 'ne.nombre, ne.idestado'
                            },
                            type: 'ajax',
                            url: UtilsFn.buildUrl({action: 'filterliststore'}, ModuleMgr.get('Seguimiento'))
                        },
                        fields: [
                            {name: 'nombre', type: 'string'},
                            {name: 'idestado', type: 'integer'},
                        ]
                    }),
                    listeners: {
                        serialize: function (data, filter, eOpts) {
                            data['value'] = [data['value']];
                        }
                    }
                }
            },
            {
                text: me.etiquetas.lbMarco,
                tooltip: me.etiquetas.lbMarco,
                sortable: true,
                align: 'center',
                width: 50,
                minWidth: 50,
                hidden: true,
                dataIndex: 'contratomarco',
                renderer: function (value, meta) {
                    meta.innerCls = value ? "icondistra-true verde" : "icondistra-false rojo";
                    meta.tdAttr = 'data-qtip="' + (value ? me.etiquetas.lbMarco : me.etiquetas.lbContrato) + '"';
                },
            },
        ];

        me.dockedItems = [
            {
                xtype: 'pagingtoolbar',
                store: me.store,
                dock: 'bottom',
                pageNumb: true,
                displayInfo: true,
                items: [
                    {
                        action: 'clearfilters',
                        iconCls: 'limpiar',
                        tooltip: me.etiquetas.qtipCleanFilters,
                        allwaysEnabled: true,
                        keyMap: {
                            key: 'l',
                            alt: true,
                            ctrl: true,
                            event: 'click'
                        }
                    }
                ]
            }
        ];

        me.btnDetails = Ext.create('Ext.Button', {
            iconCls: 'detalles',
            action: 'detallescontrato',
            selector: 'detallescontrato',
            hidden: true,
            disabled: true,
            text: me.etiquetas.lbBtnDetail,
            tooltip: me.etiquetas.qtipDetailContrato,
            keyMap: {
                key: 'd',
                alt: true,
                ctrl: false,
                event: 'click'
            }
        });
        me.tbar = Ext.create('Ext.toolbar.Toolbar', {
            minHeight: 26,
            enableOverflow: true,
            items: [me.btnDetails]
        });

        me.callParent();
    }


});
