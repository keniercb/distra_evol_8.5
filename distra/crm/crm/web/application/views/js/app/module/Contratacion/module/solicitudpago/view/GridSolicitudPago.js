Ext.define('SolicitudPago.view.GridSolicitudPago', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.sp_solicitudpagogrid',
    selType: 'checkboxmodel',
    itemId: 'solicitudpagogrid',
    // autoScroll: true,
    minWidth: 360,
    module: 'SolicitudPago',
    initComponent: function () {
        var me = this;
        me.etiquetas = LangMgr.getLang(me);
        me.emptyText = me.etiquetas.msgVacioSP;
        me.selModel = {mode: 'MULTI'};
        me.frame = false;
        me.border = false;
        me.title = me.etiquetas.lbTitleSolicitudPago;
        // me.plugins=[
        //     Ext.create('SolicitudPago.view.MarcarFiltroPlugin',{
        //         // campos:[
        //         //     'codigo',
        //         //     // 'usuario',
        //         //     // {'dataIndex': ['usuario', 'cargo'],
        //         //     // 'ident_campo':'principal'/*,'color': '#F0D278'*/}
        //         //     ]
        //     })
        // ];
        me.features = [
            // {
            //     ftype: 'grouping',
            //     groupByText: 'Agrupar por esta columna',
            //     groupHeaderTpl: ['{columnName}: {name:this.format}', {
            //         format: function (name) {
            //             if (typeof name == 'object') {
            //                 return Ext.Date.format(name, 'd/m/Y');
            //             }
            //             return name;
            //         }
            //     }]
            // },
            {
                ftype: 'filters',
                menuFilterText: me.etiquetas.lbbusqueda,
                local: false
            }
        ];
        me.store = Ext.create('Ext.data.Store', {
            storeId: 'sp_stSolicitudPago',
            remoteFilter: true,
            onlyOneLoad: true,
            // remoteSort: true,
            // remoteGroup: true,
            // groupField: 'fechafin',
            proxy: {
                type: 'ajax',
                url: UtilsFn.buildUrl({action: 'listarSolicitudesPago'}, ModuleMgr.get('SolicitudPago')),
                reader: {
                    root: 'data',
                    totalProperty: 'total',
                    successProperty: 'success'
                }
            },
            fields: [
                'codigo', 'nombrearea', 'fecharecibo',
                'montototal', 'idestado', 'estado', 'descripcion',
                'idarea', 'idcontrato', 'idformapago',
                'mediopago', 'idsolicitudpago', 'icono',
                'objetivos', 'contrato', 'monedascontrato',
                'hitos', 'indicadores'
            ],
            listeners: {
                load: function (yo, record, success) {
                    if (success) {
                        yo.HitosSeleccionados = [];
                        record.forEach(function (x) {

                            if (x.get('hitos') != null) {

                                yo.HitosSeleccionados = yo.HitosSeleccionados.concat(Ext.decode(Ext.decode(x.get('hitos'))));
                            }
                        });
                    }
                }
            }
        });

        function mostrarTooltipColumna(value, meta) {
            if (value)
                meta.tdAttr = 'data-qtip="' + value + '"';
            return value;
        }

        me.columns = [
            {
                text: me.etiquetas.lbCodigo,
                minWidth: 50,
                width: 60,
                dataIndex: 'codigo',
                filter: {
                    type: 'string'
                },
                renderer: mostrarTooltipColumna
            },
            {
                text: me.etiquetas.lbAreaResponsable,
                minWidth: 60,
                flex: 1,
                dataIndex: 'nombrearea',
                filter: {
                    type: 'string'
                },
                renderer: mostrarTooltipColumna
            },
            {
                text: me.etiquetas.lbFormaPago,
                minWidth: 80,
                width: 110,
                hidden: true,
                dataIndex: 'mediopago',
                filter: {
                    type: 'list',
                    idField: 'idmediodepago',
                    labelField: 'nombre',
                    store: Ext.create('Ext.data.Store', {
                        autoLoad: false,
                        proxy: {
                            extraParams: {
                                // columnlist: 'ne.nombre, ne.idmediopago',
                                modelName: 'NomMedioPago',
                            },
                            type: 'ajax',
                            url: UtilsFn.buildUrl({action: 'getModel'}, ModuleMgr.get('Nomencladores')),
                            reader: {
                                root: 'data',
                                totalProperty: 'count',
                                successProperty: 'success'
                            },
                        },
                        fields: [
                            {name: 'nombre', type: 'string'},
                            {name: 'idmediodepago', type: 'integer'},
                        ]
                    }),
                    listeners: {
                        serialize: function (data, filter, eOpts) {
                            data['value'] = Ext.encode(data['value']);
                        }
                    }
                },
                renderer: mostrarTooltipColumna
            },
            {
                text: me.etiquetas.lbFechaRecibo,
                align: 'center',
                minWidth: 80,
                width: 80,
                dataIndex: 'fecharecibo',
                xtype: 'datecolumn',
                filter: {
                    type: 'date',
                    beforeText: me.etiquetas.lbantes,
                    afterText: me.etiquetas.lbdespues,
                    onText: me.etiquetas.lbigual
                },
                renderer: function (value, meta) {
                    if (value) {
                        meta.tdAttr = 'data-qtip="' + value + '"';
                    }
                    return value;
                    // return Ext.Date.format(value, 'd/m/Y');
                }
            },
            // {
            //     text: me.etiquetas.lbTotalAmount,
            //     align: 'right',
            //     width: 100,
            //     align: 'center',
            //     dataIndex: 'montototal',
            //     groupable: false,
            //     filter: {
            //         type: 'numeric'
            //     },
            //     renderer: function (value, meta) {
            //         if (value) {
            //             meta.tdAttr = 'data-qtip="' + value + '"';
            //             return value;
            //         }
            //         return value;
            //     }
            // },
            {
                text: me.etiquetas.lbEstado,
                flex: 0.3,
                minWidth: 80,
                dataIndex: 'estado',
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
                            // url: UtilsFn.buildUrl({action: 'filterliststore'}, ModuleMgr.get('GestionContrato'))
                            url: UtilsFn.buildUrl({action: 'obtenerEstados'}, ModuleMgr.get('SolicitudPago')),
                            // reader: {
                            //     root: 'data',
                            //     totalProperty: 'total',
                            //     successProperty: 'success'
                            // },
                            // url: UtilsFn.buildUrl({action: 'obtenerEstados'}, me),
                        },
                        fields: [
                            {name: 'nombre', type: 'string'},
                            {name: 'idestado', type: 'integer'},
                        ]
                    }),
                    listeners: {
                        serialize: function (data, filter, eOpts) {
                            data['value'] = Ext.encode(data['value']);
                        }
                    }
                },
                renderer: function (value, meta, record) {
                    if (value) {
                        meta.innerCls = "icondistra-" + record.data.icono;
                        meta.tdAttr = 'data-qtip="' + value + '"';
                    }
                    return value;
                }
            },
            {
                text: me.etiquetas.lbTotalAmount,
                sortable: true,
                // hidden: !me.detallado,
                align: 'right',
                minWidth: 80,
                width: 90,
                dataIndex: 'montototal',
                renderer: function (value, meta, record) {
                    var total = 0;
                    if (!Ext.isEmpty(value)) {
                        qtip = '';
                        value.forEach(function (x) {
                            total += parseFloat(x['monto']);
                            qtip += '<b>' + x['codigoiso'] + ':</b> ' +
                                Ext.util.Format.number(x['monto'], '0.000,00/i') + '<br/>'
                        });
                        qtip = '<b>Total:</b> ' + Ext.util.Format.number(total, '0.000,00/i') + '<hr/>' + qtip;
                        meta.tdAttr = 'data-qtip="' + qtip + '"';
                    }
                    return Ext.util.Format.number(total, '0.000,00/i');
                },
                // filter: {
                //     type: 'numeric'
                // }
            },
        ];

        me.btnDetails = Ext.create('Ext.Button', {
            iconCls: 'detalles',
            action: 'detailSP',
            selector: 'btnDetails',
            hidden: true,
            disabled: true,
            text: me.etiquetas.lbBtnDetail,
            tooltip: me.etiquetas.qtipDetailSP,
            keyMap: {
                key: 'd',
                ctrl: true,
                alt: true,
                event: 'click'
            }
        });

        me.btnAdicionar = Ext.create('Ext.Button', {
            iconCls: 'adicionar',
            action: 'adicionarSP',
            selector: 'btnAdicionar',
            disabled: true,
            hidden: true,
            text: me.etiquetas.lbAdicionar,
            tooltip: me.etiquetas.qtipAdicionar,
            keyMap: {
                key: 'i',
                alt: true,
                event: 'click'
            }
        });
        me.btnModificar = Ext.create('Ext.Button', {
            iconCls: 'modificar',
            action: 'modificarSP',
            selector: 'btnModificar',
            disabled: true,
            hidden: true,
            text: me.etiquetas.lbModificar,
            tooltip: me.etiquetas.qtipModificar,
            keyMap: {
                key: 'm',
                alt: true,
                event: 'click'
            }
        });
        me.btnDictamen = Ext.create('Ext.Button', {
            iconCls: 'informe',
            action: 'dictamen',
            selector: 'dictamen',
            itemId: 'dictamen',
            disabled: true,
            // hidden: true,
            text: me.etiquetas.lbdictamen,
            tooltip: me.etiquetas.gtipdictamen,
            keyMap: {
                key: 'm',
                alt: true,
                event: 'click'
            }
        });
        me.btnEliminar = Ext.create('Ext.Button', {
            iconCls: 'eliminar',
            action: 'eliminarSP',
            selector: 'btnEliminar',
            disabled: true,
            hidden: true,
            text: me.etiquetas.lbEliminar,
            tooltip: me.etiquetas.qtipEliminar,
            // tooltip: me.etiquetas.qtipEliminar,
            keyMap: {
                key: Ext.EventObject.DELETE,
                event: 'click'
            }
        });

        this.btnChangeState = Ext.create('Ext.Button', {
            iconCls: 'modificar',
            selector: 'btnEstado',
            disabled: true,
            hidden: true,
            text: this.etiquetas.lbChangeState,
            tooltip: this.etiquetas.lbChangeState,
            menu: new Ext.menu.Menu()
        });

        this.btnHelp = Ext.create('Ext.Button', {
            iconCls: 'ayuda',
            action: 'help',
            text: this.etiquetas.lbBtnhelp,
            refhelp: '',
            tooltip: this.etiquetas.qtipHelp
        });

        me.tbar = Ext.create('Ext.toolbar.Toolbar', {
            enableOverflow: true,
            items: [
                me.btnAdicionar, me.btnModificar, me.btnEliminar,
                me.btnDetails, me.btnDictamen, me.btnChangeState, '->', this.btnHelp]
        });

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

        me.callParent();
    },
    findState: function (idestado) {
        var estados = this.getStore().proxy.reader.jsonData.estados;
        return estados[idestado];
    }
});
