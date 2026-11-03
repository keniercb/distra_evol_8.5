Ext.define('Penalizaciones.view.Penalizaciones', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.gppenalizaciones',
    closable: true,
    module: 'Penalizaciones',
    selType: 'checkboxmodel',
    // autoLoad: true,
    initComponent: function () {
        var me = this;
        me.etiquetas = LangMgr.getLang(this);
        me.title = me.etiquetas.moduleName;
        me.store = Ext.create('Penalizaciones.store.Penalizaciones');
        // me.selType = 'checkboxmodel';

        me.features = [
            {
                ftype: 'filters',
                menuFilterText: me.etiquetas.lbbusqueda,
                local: false,
            }
        ];

        function onSerialize(data, filter, eOpts) {
            data['value'] = Ext.encode(data['value']);
        };

        function mostrarTooltip(value, meta) {
            if (value)
                meta.tdAttr = 'data-qtip="' + value + '"';
            return value;
        };

        me.columns = [
            {
                text: me.etiquetas.lbNumeroC,
                fixed: true,
                minWidth: 80,
                width: 120,
                dataIndex: 'numero',
                filter: {type: 'string'},
                renderer: function (value, meta) {
                    if (value) {
                        meta.tdAttr = 'data-qtip="' + value + '"';
                    }
                    return value;
                },
            },
            {
                text: me.etiquetas.lbNombreC,
                minWidth: 200,
                // width: 230,
                flex:1,
                dataIndex: 'contrato',
                filter: {type: 'string'},
                renderer: function (value, meta) {
                    if (value) {
                        meta.tdAttr = 'data-qtip="' + value + '"';
                    }
                    return value;
                },
            },
            {
                text: me.etiquetas.lbNombreArribo,
                // sortable: false,
                flex: 1,
                minWidth: 150,
                dataIndex: 'arribo',
                filter: {type: 'string'},
                renderer: mostrarTooltip
            },
            {
                text: 'Proveedor',
                // sortable: false,
                flex: 1,
                minWidth: 150,
                dataIndex: 'clienteproveedor',
                filter: {type: 'string'},
                renderer: mostrarTooltip
            },
            {
                text: me.etiquetas.lbTipoPenalidad,
                // sortable: false,
                flex: 0.6,
                minWidth: 150,
                dataIndex: 'tipopenalidad',
                filter: {type: 'string'},
                renderer: mostrarTooltip
            },
            {
                text: me.etiquetas.lbPorciento,
                // sortable: false,
                // flex: 1,
                align: 'right',
                width: 60,
                minWidth: 30,
                dataIndex: 'porciento',
                filter: {type: 'float'},
                renderer: function (value, meta) {
                    if (value) {
                        meta.tdAttr = 'data-qtip="' + value + '%"';
                    }
                    return value+'%';
                }
            },
            {
                text: 'Descripción',
                dataIndex: 'descripcion',
                flex: 1,
                minWidth: 200,
                renderer: mostrarTooltip
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
                            url: UtilsFn.buildUrl({action: 'getEstadosPenalizacion'}, ModuleMgr.get('Penalizaciones')),
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
                renderer: function (value, meta, record) {
                    meta.innerCls = "icondistra-" + meta.record.data.iconoestado;
                    meta.tdAttr = 'data-qtip="' + value + ' <br> <u>Fecha</u>: ' + record.data.fechaestado + '"';
                    return value;
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
                text: me.etiquetas.lbBtnAdicionar,
                iconCls: 'icondistra-adicionar',
                tooltip: me.etiquetas.gtipBtnAdicionarPenalizacion,
                action: 'addpenalizacion',
                selector: 'addpenalizacion',
                itemId:'addpenalizacion',
                hidden: true,
            }, {
                text: me.etiquetas.lbBtnModificarPenalizacion,
                iconCls: 'icondistra-modificar',
                tooltip: me.etiquetas.gtipBtnModificarPenalizacion,
                action: 'modpenalizacion',
                selector: 'modpenalizacion',
                hidden: true,
                disabled: true,
                keyMap: {
                    key: 'f',
                    alt: true,
                    event: 'click'
                }
            }, {
                text: me.etiquetas.lbBtnEliminarPenalizacion,
                iconCls: 'icondistra-eliminar',
                tooltip: me.etiquetas.gtipBtnEliminarPenalizacion,
                action: 'delpenalizacion',
                selector: 'delpenalizacion',
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
                tooltip: me.etiquetas.gtipBtnDetallespenalización,
                action: 'detallepenalizacion',
                selector: 'detallepenalizacion',
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
                action: 'vertrazaspenalizacion',
                selector: 'vertrazaspenalizacion',
                hidden: true,
                disabled: true,
            },
            {
                text: me.etiquetas.lbBtnCambiarEstado,
                iconCls: 'icondistra-modificar',
                itemId: 'menuestado',
                tooltip: me.etiquetas.ttipBtnCambiarEstado,
                action: 'cambiarestadopenalizacion',
                selector: 'cambiarestadopenalizacion',
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
                tooltip: me.etiquetas.qtipHelp
            }
        ];
    }
});