Ext.define('SolicitudNegocioImportacion.view.SolicitudNegocio', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.gpsolicitudnegocioimportacion',
    closable: true,
    module:'SolicitudNegocioImportacion',
    initComponent: function () {
        var me = this;
        me.etiquetas = LangMgr.getLang(this);
        me.plugins=[
            Ext.create('SolicitudPago.view.MarcarFiltroPlugin',{
                extraParams:true,
                columnFilters:false,
                campos:[{
                    'itemId':'searchfield',
                    'dataIndex':['nombre'],
                    'extraParams':'filtrogeneral[0][field]'
                }]
            })
        ];
        me.viewConfig={
            stripeRows: false,
            getRowClass: function (record, rowIndex, rowParams, store) {
                var estilo='';
                // if (record.get('desactivada')) return 'eliminado';
                if (record.get('cantofertas')>0) return 'escontrato';
                return '';
            }
        };
        me.title = me.etiquetas.moduleName;
        me.store = Ext.create('SolicitudNegocioImportacion.store.SolicitudNegocio',{onlyOneLoad: true});
        // me.selModel={xtype:'checkboxmodel'}
        me.selType='checkboxmodel';

        me.features=[
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
            if(value)
                meta.tdAttr='data-qtip="'+value+'"';
            return value;
        }

        me.columns = [
            {
                text: me.etiquetas.lbNumeroSolicitud,
                // sortable: false,
                // align: 'center',
                fixed: true,
                width: 80,
                dataIndex: 'numero',
                filter:{type:'numeric'}
            }, {
                text: me.etiquetas.lbCodigo,
                // sortable: false,
                // align: 'center',
                fixed: true,
                width: 80,
                dataIndex: 'numero',
                filter:{type:'numeric'}
            },
            {
                text: me.etiquetas.lbFieldNombre,
                // sortable: false,
                flex: 1,
                dataIndex: 'nombre',
                filter:{type:'string'},
                renderer: mostrarTooltip
            },
            {
                text: me.etiquetas.lbFieldClienteProveedores,
                // sortable: false,
                flex: 1,
                dataIndex: 'clienteproveedor',
                filter:{type:'string'},
                renderer: mostrarTooltip
            },
            /*{
                text: me.etiquetas.lbFieldFuncionario,
                sortable: false,
                flex: 1,
                dataIndex: 'funcionario'
            },*/
            // {
            //     text: me.etiquetas.lbSector,
            //     // sortable: false,
            //     // align: 'center',
            //     fixed: true,
            //     width: 100,
            //     dataIndex: 'sector',
            //     filter: {
            //         type: 'list',
            //         idField: 'idsector',
            //         labelField: 'denominacion',
            //         store: Ext.create('Ext.data.Store', {
            //             autoLoad: false,
            //             proxy: {
            //                 extraParams: {
            //                     // columnlist: 'ne.nombre, ne.idsector',
            //                     modelName: 'NomSector',
            //                 },
            //                 type: 'ajax',
            //                 url: UtilsFn.buildUrl({action: 'getModel'}, ModuleMgr.get('Nomencladores')),
            //                 reader: {
            //                     root: 'data',
            //                     totalProperty: 'count',
            //                     successProperty: 'success'
            //                 },
            //             },
            //             fields: [
            //                 {name: 'denominacion', type: 'string'},
            //                 {name: 'idsector', type: 'integer'},
            //             ]
            //         }),
            //         listeners: {
            //             serialize: onSerialize
            //         }
            //     }
            // },
            // {
            //     text: me.etiquetas.lbAreaResponsable,
            //     // sortable: false,
            //     flex: 1,
            //     dataIndex: 'arearesponsable',
            //     filter:{type:'string'},
            //     renderer:mostrarTooltip
            // },
            {
                text: me.etiquetas.lbBtnLinea,
                // sortable: false,
                flex: 1,
                dataIndex: 'linea',
                filter:{type:'string'},
                renderer:mostrarTooltip
            },
            // {
            //     text: me.etiquetas.lbMontoTotal,
            //     // sortable: false,
            //     flex: 1,
            //     dataIndex: 'montototal',
            //     filter:{type:'string'},
            //     renderer:mostrarTooltip
            // },
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

                    meta.innerCls = "icondistra-" +  meta.record.data.estadoicon;
                    if(value)
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
                            url: UtilsFn.buildUrl({action: 'getEstadosSolicitud'}, ModuleMgr.get('SolicitudNegocioImportacion')),
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
            {
                text: me.etiquetas.lbFieldCliente,
                tooltip: me.etiquetas.lbFieldCliente,
                // sortable: true,
                align: 'center',
                minWidth: 55,
                width: 55,
                dataIndex: 'cliente',
                renderer: function (value, meta) {
                    var icono="icondistra-perfilusuario",
                        qtip=me.etiquetas.lbSNCliente;
                    if(value=='2'){
                        icono="icondistra-servicio";
                        qtip=me.etiquetas.lbSNProveedor;
                    }
                    // else if(value=='3'){
                    //     icono="icondistra-gestionarmodelo";
                    //     qtip=me.etiquetas.lbSNDemanda;
                    // }
                    else if(value=='4'){
                        icono="icondistra-gestionaroperacionescontables";
                        qtip=me.etiquetas.lbSNImportacion;
                    }
                    meta.innerCls = icono;
                    meta.tdAttr = 'data-qtip="' + qtip + '"';
                },
                filter: {
                    type: 'list',
                    store: Ext.create('Ext.data.Store', {
                        fields: ['id', 'text'],
                        data: [
                            // {"text": me.etiquetas.lbFieldCliente, "id": 1},
                            // {"text": me.etiquetas.lbFieldProveedor, "id": 2},
                            // {"text": me.etiquetas.lbSNDemanda, "id": 3},
                            {"text": me.etiquetas.lbFieldImportacion, "id": 4},
                        ]
                    }),
                    listeners: {
                        serialize: onSerialize
                    }
                }
            },
            {
                text: me.etiquetas.lbCantOfertas,
                tooltip: me.etiquetas.qtipCantOfertas,
                width:55,
                dataIndex:'cantofertas'
            }
        ];

        me.dockedItems = [
            {
                xtype: 'pagingtoolbar',
                store: me.store,
                dock: 'bottom',
                pageNumb: true,
                displayInfo: true,
                leyenda:[
                    {text: 'Solicitud de negocio'},
                    {text: 'Tiene ofertas', class: 'escontrato'},
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
                        action:'mostrarofertas',
                        selector:'mostrarofertas',
                        hidden:true,
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
    getToolbarAcciones: function(){
        var me = this;

        return [
            // {
            //     text: me.etiquetas.lbBtnAdd,
            //     iconCls: 'icondistra-adicionar',
            //     tooltip: me.etiquetas.ttipBtnAdicionarSolicitud,
            //     selector:'adicionarSolicitudNegocio',
            //     hidden:true,
            //     menu:
            //         Ext.create('Ext.menu.Menu',{
            //             plain:true,
            //             items:
            //                 [
            //                     // {
            //                     //     text: me.etiquetas.lbSNCliente,
            //                     //     itemId:'addsolicitudcliente',
            //                     //     iconCls: 'icondistra-perfilusuario',
            //                     //     tooltip: me.etiquetas.qtipAdicionarSNCliente,
            //                     //     action: 'addsolicitud',
            //                     //     selector:'adicionarSolicitudNegocioCliente',
            //                     //     hidden:true,
            //                     //     tipo:1,
            //                     //     context:'cliente',
            //                     //     heightWin: 475 //390
            //                     // },
            //                     // {
            //                     //     text: me.etiquetas.lbSNProveedor,
            //                     //     itemId:'addsolicitudproveedor',
            //                     //     iconCls: 'icondistra-servicio',
            //                     //     tooltip: me.etiquetas.qtipAdicionarSNProveedor,
            //                     //     action: 'addsolicitud',
            //                     //     selector:'adicionarSolicitudNegocioProveedor',
            //                     //     hidden:true,
            //                     //     tipo:2,
            //                     //     context:'proveedor',
            //                     //     heightWin: 645
            //                     // },
            //                     // {
            //                     //     text: me.etiquetas.lbSNInterna,
            //                     //     itemId:'addsolicitudinterna',
            //                     //     iconCls: 'icondistra-servicio',
            //                     //     tooltip: me.etiquetas.qtipAdicionarSNInterna,
            //                     //     action: 'addsolicitudinterna',
            //                     //     // selector:'adicionarSolicitudNegocioProveedor',
            //                     //     hidden:true,
            //                     // },
            //                     // {
            //                     //     text: me.etiquetas.lbSNDemanda,
            //                     //     itemId:'addsolicituddemanda',
            //                     //     iconCls: 'icondistra-gestionarmodelo', //desagrupar //demanda //almacen //cambiar
            //                     //     tooltip: me.etiquetas.qtipAdicionarSNDemanda,
            //                     //     action: 'addsolicitud',
            //                     //     selector:'adicionarSolicitudNegocioDemanda',
            //                     //     // hidden:true,
            //                     //     tipo:3,
            //                     //     context:'cliente',
            //                     //     heightWin: 330
            //                     // },
            //                     {
            //                         text: me.etiquetas.lbSNImportacion,
            //                         itemId:'addsolicitudimportacion',
            //                         iconCls: 'icondistra-gestionaroperacionescontables',
            //                         tooltip:me.etiquetas.qtipAdicionarSNImportacion,
            //                         action: 'addsolicitud',
            //                         selector:'adicionarSolicitudNegocioImportacion',
            //                         hidden:true,
            //                         tipo:4,
            //                         context:'proveedor',
            //                         heightWin: 576,
            //                     },
            //
            //                 ]
            //         })
            // },
            {
                // text: me.etiquetas.lbSNImportacion,
                text: me.etiquetas.lbBtnAdd,
                itemId:'addsolicitudimportacion',
                iconCls: 'icondistra-adicionar',
                tooltip:me.etiquetas.qtipAdicionarSNImportacion,
                action: 'addsolicitud',
                selector:'adicionarSolicitudNegocioImportacion',
                hidden:true,
                tipo:4,
                context:'proveedor',
                heightWin: 576,
            },
            {
                text: me.etiquetas.lbBtnMod,
                iconCls: 'icondistra-modificar',
                tooltip: me.etiquetas.ttipBtnModificarSolicitud,
                action: 'modsolicitud',
                selector:'modificarSolicitudNegocio',
                hidden:true,
                disabled: true,
                keyMap: {
                    key: 'm',
                    alt: true,
                    event: 'click'
                }
            },{
                text: me.etiquetas.lbBtnDel,
                iconCls: 'icondistra-eliminar',
                tooltip: me.etiquetas.ttipBtnEliminarSolicitud,
                action: 'elimsolicitud',
                selector:'eliminarSolicitudNegocio',
                hidden:true,
                disabled: true,
                keyMap: {
                    ctrl:false,
                    alt:false,
                    key: Ext.EventObject.DELETE,
                    event: 'click'
                }
            },{
                text: me.etiquetas.lbBtnDetalles,
                iconCls: 'icondistra-detalles',
                tooltip: me.etiquetas.ttipBtnDetallesSolicitud,
                action: 'detallesolicitud',
                selector:'detallesSolicitudNegocio',
                hidden:true,
                disabled: true,
                keyMap: {
                    key: 'd',
                    alt: true,
                    event: 'click'
                }
            },{
                text: me.etiquetas.lbBtnEstadoTrazas,
                iconCls: 'icondistra-traza',
                tooltip: me.etiquetas.ttipBtnEstadoTrazas,
                action: 'estadotrazassolicitud',
                selector:'estadoTrazasSolicitudNegocio',
                hidden:true,
                disabled: true
            }, {
                text: me.etiquetas.lbBtnCambiarEstado,
                iconCls: 'icondistra-modificar',
                tooltip: me.etiquetas.ttipBtnCambiarEstado,
                action: 'cambiarestadosolicitud',
                selector:'cambiarEstadoSolicitudNegocio',
                hidden:true,
                disabled: true,
                menu: new Ext.menu.Menu()
            },
            {
                text: 'Exportar',
                iconCls: 'exportar',
                menu:
                    Ext.create('Ext.menu.Menu', {
                        plain: true,
                        items: [
                            {
                                text: 'Exportar excel',
                                iconCls: 'exportar',
                                itemId: 'exportarExcel',
                                action: 'exportarExcel',
                                disabled: true
                                // handler: function(){//?idnodo=
                                //     me.getSelectionModel().getSelection
                                //     window.open(window.location.origin + '/crm/importacion/index.php/solicitudnegocioimportacion/exportarExcelSolicitudImp?idsolicitud=')
                                // }
                            },
                            {
                                text: 'Exportar word',
                                iconCls: 'exportar',
                                itemId: 'exportarWord',
                                action: 'exportarWord',
                                disabled: true
                                // handler: function(){
                                //     window.open(window.location.origin + '/crm/importacion/index.php/solicitudnegocioimportacion/exportarWordSolicitudImp?idsolicitud=')
                                // }
                            }
                        ]
                    })

            },
//             {
//             text: 'Probar',
//             handler: function(){
//                 window.open(window.location.origin + '/crm/importacion/index.php/solicitudnegocioimportacion/exportarExcelSolicitudImp')
//             }
// },
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