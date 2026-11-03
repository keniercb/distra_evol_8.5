Ext.define('Seguimiento.view.GridSeguimiento', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.s_seguimientogrid',
    selType: 'checkboxmodel',
    itemId: 'seguimientogrid',
    // autoScroll: true,
    minWidth: 360,
    module: 'Seguimiento',
    initComponent: function () {
        var me = this;
        me.etiquetas = LangMgr.getLang(me);
        me.emptyText = me.etiquetas.msgVacioS;
        me.selModel = {mode: 'MULTI'};
        me.frame = false;
        me.border = false;
        me.title = me.etiquetas.lbTitleSeguimiento;

        me.features = [
            {
                ftype: 'filters',
                menuFilterText: me.etiquetas.lbbusqueda,
                local: false
            }
        ];
        me.store = Ext.create('Ext.data.Store', {
            storeId: 's_stSeguimiento',
            onlyOneLoad: true,
            remoteFilter: true,
            proxy: {
                type: 'ajax',
                url: UtilsFn.buildUrl({action: 'listarArribos'}, ModuleMgr.get('Seguimiento')),
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
                'mediopago', 'idarribo', 'icono', 'fechaestado',
                'objetivos', 'contrato', 'monedascontrato',
                'indicadores', 'pedidos', 'cantpenalidades'
            ],
            // listeners: {
            //     load: function (yo, record, success) {
            //         if (success) {
            //             yo.HitosSeleccionados = [];
            //             record.forEach(function (x) {
            //
            //                 if (x.get('hitos') != null) {
            //
            //                     yo.HitosSeleccionados = yo.HitosSeleccionados.concat(Ext.decode(Ext.decode(x.get('hitos'))));
            //                 }
            //             });
            //         }
            //     }
            // }
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
                text: 'Descripcion',
                minWidth: 60,
                flex: 1,
                dataIndex: 'descripcion',
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
            {
                text: me.etiquetas.lbTotalAmount,
                sortable: true,
                align: 'right',
                minWidth: 80,
                width: 90,
                dataIndex: 'montototal',
                tooltip: 'Monto total',
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
            },
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
                            url: UtilsFn.buildUrl({action: 'obtenerEstados'}, ModuleMgr.get('Seguimiento')),
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
                        meta.tdAttr = 'data-qtip="' + value + ' <br> <u>Fecha</u>: ' + record.data.fechaestado + '"';
                    }
                    return value;
                }
            },
            {
                xtype: 'actioncolumn',
                // text: '',
                width: 22,
                height: 12,
                margins: '4 0 0 4',
                align: 'center',
                // iconCls: 'icondistra-eliminar',
                cls: 'icondistra-conflicto', //conflicto
                menuDisabled: true,
                sortable: false,
                tooltip: 'Penalizaciones',
                items:[
                    {
                        getClass: function(v, meta, rec){
                            if(rec.data.cantpenalidades>0){
                                meta.tdAttr = 'data-qtip="'+'Tiene '+rec.data.cantpenalidades+
                                    (rec.data.cantpenalidades==1?' penalización':' penalizaciones')+'"';
                                return "icondistra-cerrar";
                            }
                        },
                        // handler: function(grid, rowIndex, colIndex) {
                        //     var rec = grid.getStore().getAt(rowIndex);
                        //     if(rec.data.codigo=='001') {
                        //         alert('Tiene penalizaciones')
                        //     }
                        // }
                    }
                ]
            }

        ];

        me.btnDetailA = Ext.create('Ext.Button', {
            iconCls: 'detalles',
            action: 'detallesA',
            selector: 'detallesA',
            hidden: true,
            disabled: true,
            text: me.etiquetas.lbBtnDetail,
            tooltip: me.etiquetas.qtipDetallesA,
            keyMap: {
                key: 'd',
                ctrl: true,
                alt: true,
                event: 'click'
            }
        });

        me.btnAdicionarA = Ext.create('Ext.Button', {
            iconCls: 'adicionar',
            action: 'adicionarA',
            selector: 'adicionarA',
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
        me.btnModificarA = Ext.create('Ext.Button', {
            iconCls: 'modificar',
            action: 'modificarA',
            selector: 'modificarA',
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

        me.btnTrazasA = Ext.create('Ext.menu.Item', {
            iconCls: 'traza',
            action: 'trazasA',
            selector: 'trazasA',
            disabled: true,
            hidden: true,
            text: me.etiquetas.lbTrazaA,
            tooltip: me.etiquetas.qtipTrazasA,
            keyMap: {
                key: 'u',
                alt: true,
                event: 'click'
            }
        });
        me.btnEliminarA = Ext.create('Ext.Button', {
            iconCls: 'eliminar',
            action: 'eliminarA',
            selector: 'eliminarA',
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

        this.btnChangeStateA = Ext.create('Ext.Button', {
            iconCls: 'modificar',
            selector: 'cambiarestado',
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

        this.btnPenalizacion = Ext.create('Ext.menu.Item', {
            iconCls: 'conflicto',
            action: 'addpenalizacionA',
            selector: 'addpenalizacionA',
            disabled: true,
            // hidden: true,
            text: 'Penalización',
            tooltip: 'Agregar penalización'
        });

        this.btnMasacciones = Ext.create('Ext.Button', {
            iconCls: 'contraer',
            selector: 'masacciones',
            // disabled: true,
            // hidden: true,
            text: 'Mas acciones',
            tooltip: 'Mas acciones',
            menu: new Ext.menu.Menu({
                split: true,
                items:[
                    me.btnTrazasA, me.btnPenalizacion
                ]
            })
        });

        me.tbar = Ext.create('Ext.toolbar.Toolbar', {
            itemId: 'tbarseguimiento',
            enableOverflow: true,
            items: [
                me.btnAdicionarA, me.btnModificarA, me.btnEliminarA,
                me.btnDetailA, me.btnChangeStateA,
                me.btnMasacciones,
                // me.btnTrazasA, this.btnPenalizacion,
                '->']
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
