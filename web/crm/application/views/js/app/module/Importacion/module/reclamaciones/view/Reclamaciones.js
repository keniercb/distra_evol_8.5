Ext.define('Reclamaciones.view.Reclamaciones', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.gpreclamaciones',
    closable: true,
    module: 'Reclamaciones',
    // autoLoad: true,
    initComponent: function () {
        var me = this;
        me.etiquetas = LangMgr.getLang(this);
        // me.plugins = [
        //     Ext.create('SolicitudPago.view.MarcarFiltroPlugin', {
        //         extraParams: true,
        //         columnFilters: false,
        //         campos: [{
        //             'itemId': 'searchfield',
        //             'dataIndex': ['nombre'],
        //             'extraParams': 'filtrogeneral[0][field]'
        //         }]
        //     })
        // ];
        me.viewConfig = {
            stripeRows: false,
            getRowClass: function (record, rowIndex, rowParams, store) {
                // var estilo='';
                // // if (record.get('desactivada')) return 'eliminado';
                // if (record.get('cantofertas')>0) return 'escontrato';
                // return '';
            }
        };
        me.title = me.etiquetas.moduleName;
        me.store = Ext.create('Reclamaciones.store.Reclamaciones');
        // me.selModel={xtype:'checkboxmodel'}
        me.selType = 'checkboxmodel'

        me.features = [
            {
                ftype: 'filters',
                menuFilterText: me.etiquetas.lbbusqueda,
                local: false,
            }
        ];

        function onSerialize(data, filter, eOpts) {
            data['value'] = Ext.encode(data['value']);
        }

        function mostrarTooltip(value, meta) {
            if (value)
                meta.tdAttr = 'data-qtip="' + value + '"';
            return value;
        }

        me.columns = [
            {
                text: me.etiquetas.lbNumeroReclamacion,
                // sortable: false,
                // align: 'center',
                fixed: true,
                width: 80,
                dataIndex: 'numero',
                filter: {type: 'string'}
            }, {
                text: me.etiquetas.lbNombre,
                // sortable: false,
                // align: 'center',
                fixed: true,
                width: 80,
                dataIndex: 'nombre',
                filter: {type: 'string', dataIndex: 'nombre'},
            },
            {
                text: me.etiquetas.lbCliente,
                // sortable: false,
                flex: 1,
                dataIndex: 'cliente',
                filter: {type: 'string'},
                renderer: mostrarTooltip
            },
            {
                text: me.etiquetas.lbProveedor,
                // sortable: false,
                flex: 1,
                dataIndex: 'proveedor',
                filter: {type: 'string'},
                renderer: mostrarTooltip
            },
            {
                text: me.etiquetas.lbTipoReclamacion,
                // sortable: false,
                flex: 1,
                dataIndex: 'tiporeclamacion',
                filter: {type: 'string'},
                renderer: mostrarTooltip
            },
            {
                text: me.etiquetas.lbLinea,
                // sortable: false,
                flex: 1,
                dataIndex: 'linea',
                filter: {type: 'string'},
                renderer: mostrarTooltip
            },
            {
                text: me.etiquetas.lbTipoLinea,
                // sortable: false,
                flex: 1,
                dataIndex: 'tipolinea',
                filter: {type: 'string'},
                renderer: mostrarTooltip
            },
            {
                text: me.etiquetas.lbContrato,
                // sortable: false,
                flex: 1,
                dataIndex: 'contrato',
                filter: {type: 'string'},
                renderer: mostrarTooltip
            }, {
                text: me.etiquetas.lbMotivo,
                // sortable: false,
                flex: 0.5,
                dataIndex: 'motivo',
                filter: {type: 'string'},
                renderer: mostrarTooltip
            },
            {
                text: me.etiquetas.lbPretension,
                // sortable: false,
                flex: 0.5,
                dataIndex: 'pretension',
                filter: {type: 'string'},
                renderer: mostrarTooltip
            },
            {
                text: me.etiquetas.lbFL,
                // sortable: false,
                flex: 1,
                dataIndex: 'fundamentacionlegal',
                filter: {type: 'string'},
                renderer: mostrarTooltip
            },
            {
                text: me.etiquetas.lbFecha,
                // sortable: false,
                align: 'center',
                fixed: true,
                width: 100,
                dataIndex: 'fecha',
                filter: {
                    type: 'date',
                    dateFormat: 'd/m/Y',
                    beforeText: me.etiquetas.lbantes,
                    afterText: me.etiquetas.lbdespues,
                    onText: me.etiquetas.lbigual
                },
            },
            {
                text: me.etiquetas.lbEstado,
                // sortable: false,
                fixed: true,
                width: 100,
                dataIndex: 'estado',
                renderer: function (value, meta) {
                    meta.innerCls = "icondistra-" + meta.record.data.iconoestado;
                    if (value)
                        meta.tdAttr = 'data-qtip="' + value + '"';
                    return value;
                },
                filter: {
                    type: 'list',
                    idField: 'idestado',
                    labelField: 'nombre',
                    store: Ext.create('Ext.data.Store', {
                        autoLoad: true,
                        proxy: {
                            extraParams: {
                                columnlist: 'ne.nombre, ne.idestado'
                            },
                            type: 'ajax',
                            url: UtilsFn.buildUrl({action: 'getEstadosReclamacion'}, ModuleMgr.get('Reclamaciones')),
                        },
                        fields: [
                            {name: 'nombre', type: 'string'},
                            {name: 'idestado', type: 'integer'},
                        ]
                    }),
                    listeners: {
                        serialize: onSerialize
                        //     function (data, filter, eOpts) {
                        //     // console.log('data estado:', data)
                        //     data['value'] = Ext.encode(data['value']);
                        // }
                    }
                },
                renderer: function (value, meta) {
                    meta.innerCls = "icondistra-" + meta.record.data.iconoestado;
                    meta.tdAttr = 'data-qtip="' + value + '"';
                    return value;
                }
            },
            {
                text: me.etiquetas.lbFieldTipo,
                tooltip: me.etiquetas.lbFieldTipo,
                // sortable: true,
                align: 'center',
                minWidth: 55,
                width: 55,
                dataIndex: 'tipo',
                renderer: function (value, meta) {
                    // console.log('value', value)
                    var iconos = ["icondistra-perfilusuario", "icondistra-servicio", "icondistra-globe"];
                    var nombres = [me.etiquetas.lbRNC, me.etiquetas.lbRNP, me.etiquetas.lbRE];
                    meta.innerCls = iconos[value] //value ? "icondistra-perfilusuario" : "icondistra-servicio";
                    meta.tdAttr = 'data-qtip="' + nombres[value] + '"';
                    // var icono = "icondistra-perfilusuario",
                    //   qtip = me.etiquetas.lbRNC;


                    // if (value == '2') {
                    //     icono = "icondistra-servicio";
                    //     qtip = me.etiquetas.lbRNP;
                    // }
                    // else if (value == '3') {
                    //     icono = "icondistra-globe";
                    //     qtip = me.etiquetas.lbRE;
                    // }
                    // meta.innerCls = icono;
                    // meta.tdAttr = 'data-qtip="' + qtip + '"';
                },
                filter: {
                    type: 'list',
                    store: Ext.create('Ext.data.Store', {
                        fields: ['id', 'text'],
                        data: [
                            {"text": me.etiquetas.lbRNC, "id": 1},
                            {"text": me.etiquetas.lbRNP, "id": 2},
                            {"text": me.etiquetas.lbRE, "id": 3},
                        ]
                    }),
                    listeners: {
                        serialize: onSerialize
                    }
                }
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
            },
            {
                xtype: 'toolbar',
                itemId: 'accionesContextMenu',
                hidden: true,
            }
        ];

        me.tbar = me.getToolbarAcciones();

        this.callParent();
    },
    getToolbarAcciones: function () {
        var me = this;

        return [
            {
                text: me.etiquetas.lbBtnAdicionarReclamacion,
                iconCls: 'icondistra-adicionar',
                tooltip: me.etiquetas.gtipBtnAdicionarReclamacion,
                selector: 'adicionarReclamacion',
                hidden: true,
                menu: Ext.create('Ext.menu.Menu', {
                    plain: true,
                    style: {
                        overflow: 'visible'
                    },
                    items:
                        [
                            {
                                text: me.etiquetas.lbBtnAdicionarRN,
                                hideOnClick: false,
                                iconCls: 'icondistra-gestionarpaises',
                                // tooltip: me.etiquetas.gtipBtnAdicionarRN,
                                action: 'adicionarReclamacion',
                                selector: 'adicionarReclamacionNacional',
                                hidden: true,
                                menu: Ext.create('Ext.menu.Menu', {
                                    plain: true,
                                    defaults: {
                                        // context: 'nacional',
                                        action: 'addreclamacion'
                                    },
                                    items:
                                        [
                                            {
                                                text: me.etiquetas.lbBtnAdicionarRNC,
                                                iconCls: 'icondistra-perfilusuario',
                                                tooltip: me.etiquetas.gtipBtnAdicionarRNC,
                                                selector: 'adicionarReclamacionNacionalCliente',
                                                context: 'cliente',
                                                tipo: '0',
                                                hidden: true,
                                            },
                                            {
                                                text: me.etiquetas.lbBtnAdicionarRNP,
                                                iconCls: 'icondistra-servicio',
                                                tooltip: me.etiquetas.gtipBtnAdicionarRNP,
                                                context: 'proveedor',
                                                tipo: '1',
                                                selector: 'adicionarReclamacionNacionalProveedor',
                                                hidden: true,
                                            }
                                        ]
                                })
                            },
                            {
                                text: me.etiquetas.lbBtnAdicionarRE,
                                iconCls: 'icondistra-globe',
                                tooltip: me.etiquetas.gtipBtnAdicionarRE,
                                action: 'addreclamacion',
                                context: 'extranjera',
                                tipo: '2',
                                selector: 'adicionarReclamacionExtranjera',
                                hidden: true,
                            }
                        ]
                })
            }, {
                text: me.etiquetas.lbBtnModificarReclamacion,
                iconCls: 'icondistra-modificar',
                tooltip: me.etiquetas.gtipBtnModificarReclamacion,
                action: 'modreclamacion',
                selector: 'modificarReclamacion',
                hidden: true,
                disabled: true,
                keyMap: {
                    key: 'f',
                    alt: true,
                    event: 'click'
                }
            }, {
                text: me.etiquetas.lbBtnEliminarReclamacion,
                iconCls: 'icondistra-eliminar',
                tooltip: me.etiquetas.gtipBtnEliminarReclamacion,
                action: 'delreclamacion',
                selector: 'eliminarReclamacion',
                hidden: true,
                disabled: true,
                keyMap: {
                    ctrl: false,
                    alt: false,
                    key: Ext.EventObject.DELETE,
                    event: 'click'
                }
            }, {
                text: me.etiquetas.lbBtnDetalles,
                iconCls: 'icondistra-detalles',
                tooltip: me.etiquetas.gtipBtnDetallesReclamación,
                action: 'detallereclamacion',
                selector: 'detallesReclamacion',
                hidden: true,
                disabled: true,
                keyMap: {
                    key: 'd',
                    alt: true,
                    event: 'click'
                }
            },
            {
                text: me.etiquetas.lbBtnVerTrazas,
                iconCls: 'icondistra-traza',
                tooltip: me.etiquetas.ttipBtnVerTrazas,
                action: 'vertrazasreclamacion',
                selector: 'verTrazasReclamacion',
                hidden: true,
                disabled: true,
            },
            {
                text: me.etiquetas.lbBtnCambiarEstado,
                iconCls: 'icondistra-modificar',
                itemId: 'menuestado',
                tooltip: me.etiquetas.ttipBtnCambiarEstado,
                action: 'cambiarestadoreclamacion',
                selector: 'cambiarEstadoReclamacion',
                hidden: true,
                disabled: true,
                menu: new Ext.menu.Menu()
            },
            '->',
            Ext.create('Ext.ux.SearchField', {
                itemId: 'searchfield',
                width: 200,
                atributo: 'general',
                emptyText: me.etiquetas.lbbuscarCriterio,
                searchTooltip: me.etiquetas.tipBuscarCriterio,
            }),
            {
                iconCls: 'ayuda',
                action: 'help',
                text: me.etiquetas.lbBtnhelp,
                // refhelp: 'dat_contrato',
                tooltip: me.etiquetas.qtipHelp
            }
        ];
    }
});