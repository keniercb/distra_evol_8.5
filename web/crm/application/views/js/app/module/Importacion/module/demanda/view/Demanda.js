Ext.define('Demanda.view.Demanda', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.gpdemanda',
    closable: true,
    module: 'Demanda',
    initComponent: function () {
        var me = this;
        me.etiquetas = LangMgr.getLang(this);
        me.plugins = [
            Ext.create('SolicitudPago.view.MarcarFiltroPlugin', {
                extraParams: true,
                columnFilters: false,
                campos: [{
                    'itemId': 'searchfield',
                    'dataIndex': ['nombre', 'numero'],
                    'extraParams': 'filtrogeneral[0][field]'
                }]
            })
        ];
        me.viewConfig = {
            stripeRows: false,
            getRowClass: function (record, rowIndex, rowParams, store) {
                var estilo = '';
                if (record.get('desactivada')) return 'eliminado';
                if (record.get('idpadre') != null) return 'contrademanda';
                if (record.get('idbalanceo') != null) return 'marcado';
                // if (record.get('cantofertas')>0) return 'escontrato';
                // console.log(record)
                return '';
            }
        };
        me.title = me.etiquetas.moduleName;
        me.store = Ext.create('Demanda.store.Demanda',{/*onlyOneLoad: true*/});
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
                text: me.etiquetas.lbNumero,
                // sortable: false,
                // align: 'center',
                // fixed: true,
                width: 80,
                dataIndex: 'numero',
                filter: {type: 'string'}
            },
            {
                text: me.etiquetas.lbFieldNombre,
                // sortable: false,
                flex: 1,
                dataIndex: 'nombre',
                filter: {type: 'string'},
                renderer: mostrarTooltip
            },
            {
                text: me.etiquetas.lbFieldClienteProveedores,
                // text: me.etiquetas.lbFieldClienteProveedores,
                // sortable: false,
                flex: 1,
                dataIndex: 'clienteproveedor',
                filter: {type: 'string'},
                renderer: mostrarTooltip
            },
            /*{
                text: me.etiquetas.lbFieldFuncionario,
                sortable: false,
                flex: 1,
                dataIndex: 'funcionario'
            },*/
            {
                text: me.etiquetas.lbSector,
                // sortable: false,
                // align: 'center',
                // fixed: true,
                width: 100,
                dataIndex: 'sector',
                filter: {
                    type: 'list',
                    idField: 'idsector',
                    labelField: 'denominacion',
                    store: Ext.create('Ext.data.Store', {
                        autoLoad: false,
                        proxy: {
                            extraParams: {
                                // columnlist: 'ne.nombre, ne.idsector',
                                modelName: 'NomSector',
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
                            {name: 'denominacion', type: 'string'},
                            {name: 'idsector', type: 'integer'},
                        ]
                    }),
                    listeners: {
                        serialize: onSerialize
                    }
                }
            },
            {
                text: me.etiquetas.lbAreaResponsable,
                // sortable: false,
                flex: 1,
                dataIndex: 'arearesponsable',
                filter: {type: 'string'},
                renderer: mostrarTooltip
            },{
                text: me.etiquetas.lbLinea,
                // sortable: false,
                flex: 1,
                maxWidth: 140,
                dataIndex: 'linea',
                filter: {type: 'string'},
                renderer: mostrarTooltip
            }, {
                text: me.etiquetas.lbTipoLinea,
                // sortable: false,
                flex: 1,
                maxWidth: 100,
                dataIndex: 'tipolinea',
                filter: {type: 'string'},
                renderer: mostrarTooltip
            }, {
                text: me.etiquetas.lbMontoTotal,
                // sortable: false,
                align: 'right',
                flex: 1,
                maxWidth: 100,
                dataIndex: 'montototal',
                filter: {type: 'string'},
                renderer: mostrarTooltip
            },
            {
                text: me.etiquetas.lbFechaCreacion,
                // sortable: false,
                align: 'center',
                fixed: true,
                width: 100,
                dataIndex: 'fechacreada',
                filter: {
                    // dataIndex: 'fechainicio',
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

                    meta.innerCls = "icondistra-" + meta.record.data.estadoicon;
                    if (value)
                        meta.tdAttr = 'data-qtip="' + value + ' <br> <u>Fecha</u>: ' + meta.record.data.fechaestado + '"';
                    // meta.tdAttr = 'data-qtip="' + value + '"';
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
                            url: UtilsFn.buildUrl({action: 'getEstadosSolicitud'}, ModuleMgr.get('Demanda')),
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
                }
            },
            // {
            //     text: me.etiquetas.lbFieldCliente,
            //     tooltip: me.etiquetas.lbFieldCliente,
            //     // sortable: true,
            //     align: 'center',
            //     minWidth: 55,
            //     width: 55,
            //     dataIndex: 'cliente',
            //     renderer: function (value, meta) {
            //         var icono = "icondistra-perfilusuario",
            //             qtip = me.etiquetas.lbSNCliente;
            //         if (value == '2') {
            //             icono = "icondistra-servicio";
            //             qtip = me.etiquetas.lbSNProveedor;
            //         } else if (value == '3') {
            //             icono = "icondistra-gestionarmodelo";
            //             qtip = me.etiquetas.lbSNDemanda;
            //         } else if (value == '4') {
            //             icono = "icondistra-gestionaroperacionescontables";
            //             qtip = me.etiquetas.lbSNImportacion;
            //         }
            //         meta.innerCls = icono;
            //         meta.tdAttr = 'data-qtip="' + qtip + '"';
            //     },
            //     // filter: {
            //     //     type: 'list',
            //     //     store: Ext.create('Ext.data.Store', {
            //     //         fields: ['id', 'text'],
            //     //         data: [
            //     //             {"text": me.etiquetas.lbFieldCliente, "id": 1},
            //     //             {"text": me.etiquetas.lbFieldProveedor, "id": 2},
            //     //             {"text": me.etiquetas.lbSNDemanda, "id": 3},
            //     //             {"text": me.etiquetas.lbFieldImportacion, "id": 4},
            //     //         ]
            //     //     }),
            //     //     listeners: {
            //     //         serialize: onSerialize
            //     //     }
            //     // }
            // },
            // {
            //     text: me.etiquetas.lbCantOfertas,
            //     tooltip: me.etiquetas.qtipCantOfertas,
            //     width: 55,
            //     dataIndex: 'cantofertas'
            // }
        ];

        me.dockedItems = [
            {
                xtype: 'pagingtoolbar',
                store: me.store,
                dock: 'bottom',
                pageNumb: true,
                displayInfo: true,
                leyenda:[
                    {text: 'Demanda'},
                    {text: 'Contrademanda', class: 'contrademanda'},
                    {text: 'En balanceo', class: 'marcado'},
                    {text: 'Desactivada', class: 'eliminado'},
                    // {xtype: 'label', style: 'background:#DFE9F6;',html: '<span class="contrademanda"><h2 style="font-size: 13px" class="x-grid-cell">Es una contrademanda</h2></span>'},
                    // {xtype: 'label', style: 'background:#DFE9F6;',html: '<span class="eliminado" style="background-color:#DFE9F6"><h2 style="font-size: 13px" class="x-grid-cell">Demanda desactivada</h2></span>'},
                    // {xtype: 'label', style: 'background:#DFE9F6;',html: 'Demanda otra'},
                ],
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
                items: [
                    {
                        text: me.etiquetas.lbVerOfertas,
                        action: 'mostrarofertas',
                        selector: 'mostrarofertas',
                        hidden: true,
                        tooltip: me.etiquetas.qtipVerOfertas,
                        // hidden: select[0].get('cantofertas')==0 || select[0].get('cantofertas')==null,
                        iconCls: 'icondistra-detalles'
                    }
                ]
            }
        ];

        me.tbar = me.getToolbarAcciones();

        this.callParent();
    },
    getToolbarAcciones: function () {
        var me = this;

        return [
            {
                text: me.etiquetas.lbBtnAdd,
                iconCls: 'icondistra-adicionar',
                tooltip: me.etiquetas.ttipBtnAdicionarDemanda,
                selector: 'adicionarDemanda',
                action: 'adddemanda',
                itemId: 'adddemanda',
                tipo: '3',
                context: 'importacion',
                heightWin: 430,
                hidden: true,
            }, {
                text: me.etiquetas.lbBtnMod,
                iconCls: 'icondistra-modificar',
                tooltip: me.etiquetas.ttipBtnModificarDemanda,
                action: 'moddemanda',
                selector: 'modificarDemanda',
                hidden: true,
                disabled: true,
                keyMap: {
                    key: 'm',
                    alt: true,
                    event: 'click'
                }
            }, {
                text: me.etiquetas.lbBtnDel,
                iconCls: 'icondistra-eliminar',
                tooltip: me.etiquetas.ttipBtnEliminarDemanda,
                action: 'elimdemanda',
                selector: 'eliminarDemanda',
                hidden: true,
                disabled: true,
                keyMap: {
                    ctrl: false,
                    alt: false,
                    key: Ext.EventObject.DELETE,
                    event: 'click'
                }
            }, '-', {
                text: me.etiquetas.lbBtnDetalles,
                iconCls: 'icondistra-detalles',
                tooltip: me.etiquetas.ttipBtnDetallesDemanda,
                action: 'detalledemanda',
                selector: 'detallesDemanda',
                hidden: true,
                disabled: true,
                keyMap: {
                    key: 'd',
                    alt: true,
                    event: 'click'
                }
            },
            {
                text: me.etiquetas.lbBtnCambiarEstado,
                iconCls: 'icondistra-estado',
                tooltip: me.etiquetas.ttipBtnCambiarEstado,
                action: 'cambiarestadodemanda',
                itemId:'cambiarestadodemanda',
                selector: 'cambiarEstadoDemanda',
                hidden: true,
                disabled: true,
                menu: new Ext.menu.Menu()
            },
            {
                text: me.etiquetas.lbBtnAcciones,
                iconCls: 'icondistra-contraer',
                tooltip: me.etiquetas.ttipBtnAcciones,
                hidden: true,
                selector:'masacciones',
               menu: Ext.create('Ext.menu.Menu',{
                   id:'acciones',
                   plain: true,
                   style:{
                       overflow:'visible'
                   },
                   items:[
                    {
                        text: me.etiquetas.lbBtnEstadoTrazas,
                        iconCls: 'icondistra-traza',
                        tooltip: me.etiquetas.ttipBtnEstadoTrazas,
                        itemId:'estadoTraza',
                        action: 'estadotrazasdemanda',
                        selector: 'estadoTrazasDemanda',
                        hidden: true,
                        disabled: true
                    }, '-',
                    {
                        text: me.etiquetas.lbBtnContraDemanda,
                        iconCls: 'icondistra-asociar',
                        tooltip: me.etiquetas.ttipBtnContraDemanda,
                        itemId:'crearcontrademanda',
                        action: 'crearcontrademanda',
                        selector: 'crearContrademanda',
                        hidden: true,
                        disabled: true
                    },
                    {
                        text: me.etiquetas.lbBtnHistorico,
                        iconCls: 'historial',
                        tooltip: me.etiquetas.ttipBtnHistorico,
                        action: 'historialdemanda',
                        itemId:'historialdemanda',
                        selector: 'historialdemanda',
                        hidden: true,
                        disabled: true
                    },

                    {
                        text: me.etiquetas.lbBtnMarcoContractual,
                        iconCls: 'analisis',
                        itemId:'marcocontractual',
                        tooltip: me.etiquetas.ttipBtnMarcoContractual,
                        action: 'marcocontractual',
                        selector: 'marcocontractual',
                        hidden: true,
                        disabled: true
                    },
                   ]
               })
            },

            '->',
            Ext.create('Ext.ux.SearchField', {
                itemId: 'searchfield',
                width: 200,
                atributo: 'general',
                emptyText: me.etiquetas.lbbuscarCriterio,
                searchTooltip: me.etiquetas.tipBuscarCriterio,
            }),
            // {
            //     text: me.etiquetas.lbBtnFiltrar,
            //     iconCls: 'icondistra-filtrar',
            //     action: 'filtrar',
            //     menu: new Ext.menu.Menu({
            //         plain: true,
            //         items: Ext.create('SolicitudNegocioImportacion.view.FpFiltrosSolicitud'),
            //         pressTreeCombo: false,
            //         listeners:{
            //             beforehide: function(comp){
            //                 if(comp.pressTreeCombo){
            //                     comp.pressTreeCombo = false;
            //                     return false;
            //                 }
            //             }
            //         }
            //     })
            // },
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