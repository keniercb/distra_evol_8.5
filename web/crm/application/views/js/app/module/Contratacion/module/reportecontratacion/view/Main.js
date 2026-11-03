Ext.define('ReporteContratacion.view.Main', {
    extend: 'Ext.tree.Panel',
    alias: 'widget.reportecontrataciontree',
    rowLines:true,
    columnLines:true,
    rootVisible:false,
    border: false,
    cls: 'crm-icon-tree',
    initComponent: function () {
        var me = this;
        var hoy=new Date(),
            inicialMes=new Date(hoy.getFullYear(), hoy.getMonth(), 1),
            finalMes=new Date(hoy.getFullYear(), hoy.getMonth()+1, 0);
//         console.log('fechas:', hoy, inicialMes, finalMes)
        // me.plugins=[
        //     Ext.create('SolicitudPago.view.MarcarFiltroPlugin',{
        //         columnFilters:true,
        //         campos:[
        //             {'itemId':'searchfield', 'dataIndex':'text'},
        //             {'itemId':'searchfieldcontrato', 'dataIndex':'text'},
        //             // 'usuario',
        //             // {'dataIndex': ['usuario', 'cargo'],
        //             // 'ident_campo':'principal'/*,'color': '#F0D278'*/}
        //         ]
        //     })
        // ];

        me.etiquetas = LangMgr.getLang(me);

        // me.features=[
        //     {
        //         ftype: 'filters',
        //         menuFilterText: me.etiquetas.lbbusqueda,
        //         local: false
        //     }
        // ];
        // idconcepto nombretipo
        // 6 agrupacion interna
        // 5 organo interno
        me.viewConfig = {
            stripeRows: false,
            getRowClass: function (record, rowIndex, rowParams, store) {
                if (record.data.idcontrato){
                    return "escontrato";
                }else if(record.data.idhito){
                    return "eshito";
                }else if(record.data.idindicador){
                    return "esindicador";
                }else if(record.data.idconcepto==6){
                    return 'esagrupacion'    
                }else if(record.data.idconcepto==5){
                    return 'esorgano'    
                }else if(record.data.tipo_concepto=='Entidad'){
//                         console.log('cambio entidad')
                    return 'esentidad'    
                }
                return '';
            }
        };
        me.configurarColumnas= function(nuevas){
            // console.log('treeee',me.getStore())
            // console.log('mo',me.getStore().model)
            // console.log('fff',me.getStore().model.getFields())

            if(nuevas.length>0) {
                var ejecucion=[], facturacion=[];
                nuevas.forEach(function (x) {
                    if(['["postfact"]', '["readyfact"]', '["newfact"]','["historial"]'].indexOf(x['acciones'])!=-1){
                        facturacion.push(x);
                    }else{
                        ejecucion.push(x);
                    }
                    field = me.getStore().model.getFields();
                    field.push({name: 'fac_' + x['nombre'].toLowerCase().replace(' ', '').replace('.', '')});
                    me.getStore().model.setFields(field);
                });
                //console.log('ejecucion', ejecucion)
                //console.log('facturacion', facturacion)
                if(ejecucion.length>0){
                    me.columnasEjecucion.push({
                        text: me.etiquetas.lbEjecucion,
                        columns:[
                            {
                                text: me.etiquetas.lbTotal, dataIndex: 'total_ejecutado',
                                width: 130, align: 'right',
                                tooltip: me.etiquetas.tipTotalEjecucion,
                                renderer: me.formatoDinero
                            },
                        ]
                    });
                    ejecucion.forEach(function (x) {
                        me.columnasEjecucion[0]['columns'].push(
                            {
                                text: x['nombre'], width: 150, align: 'right',
                                tooltip: x['descripcion'] ? x['descripcion'] : x['nombre'],
                                dataIndex: 'fac_' + x['nombre'].toLowerCase().replace(' ', '').replace('.', ''),
                                renderer: me.formatoDinero,
                            }
                        );
                    });
                }

                if(facturacion.length>0){
                    me.columnasFacturacion.push({
                        text: me.etiquetas.lbFacturacion,
                        columns:[
                            {
                                text: me.etiquetas.lbTotal, dataIndex: 'total_facturado',
                                width: 130, align: 'right',
                                tooltip: me.etiquetas.tipTotalFacturacion,
                                renderer: me.formatoDinero
                            },
                        ]
                    });
                    facturacion.forEach(function (x) {
                        me.columnasFacturacion[0]['columns'].push(
                            {
                                text: x['nombre'], width: 150, align: 'right',
                                tooltip: x['descripcion'] ? x['descripcion'] : x['nombre'],
                                dataIndex: 'fac_' + x['nombre'].toLowerCase().replace(' ', '').replace('.', ''),
                                renderer: me.formatoDinero,
                            }
                        );
                    });
                }
            }
            // console.log('fields:', me.getStore().model.getFields())
            // console.log('store:', me.getStore())
            me.reconfigure(me.getStore(), me.formarColumnas());
        }
        me.columnasEjecucion=[];
        me.columnasFacturacion=[];
        Ext.Ajax.request({
            url: UtilsFn.buildUrl({action: 'obtenerEstados'}, ModuleMgr.get('ReporteContratacion')),
            success: function (response) {
                var datos=Ext.decode(response.responseText);
                me.configurarColumnas(datos);
            },
            failure:function(response){
                mostrarMensaje(7, 'No han podido cargarse los estados.')
            }
        });
        me.store = Ext.create(
            'ReporteContratacion.store.Contratos',{
                filters:[{id:'rangofechas', property:'rangofechas_fe', value:{'inicial': Ext.Date.format(inicialMes, 'Y-m-d'), 'final': Ext.Date.format(finalMes, 'Y-m-d')}}],
                storeId:'store_reportecontrato'
            });

        function mostrarTooltipColumna(value, meta, record) {
            var abbr='';
            if(record.get('abreviatura'))abbr=' <i>('+record.get('abreviatura')+')</i>';
            meta.tdAttr = 'data-qtip="<b>' +record.get('tipo_concepto')+(value?':</b> '+ value:'') +abbr+ '"';
            return value;
        }

        me.formatoDinero=function(value, meta, record, cellIndex, columnIndex){
            // console.log('value:', value)
            // console.log('meta:', meta)
            // console.log('cellIndex:', cellIndex)
            // console.log('columnIndex:', columnIndex)
            if (!Ext.isEmpty(value)) {
                if(typeof value=='number'){
                    meta.tdAttr = 'data-qtip="' + Ext.util.Format.currency(value) + '"';
                    return Ext.util.Format.number(value, '0.000,00/i');
                    // return Ext.util.Format.currency(value);
                }else{
                    var total=0, qtip='';
                    value.forEach(function(x){
                        total+=parseFloat(x['valor']);
                        qtip+='<b>'+x['codigoiso']+':</b> '+
                            Ext.util.Format.number(parseFloat(x['valor']), '0.000,00/i')+'<br/>'
                    });
                    if(record.get('idcontrato')){
                        var valContrato=[];
                        if(record.get('total_sinfirmar_contrato') && columnIndex==0){
                            valContrato=record.get('total_sinfirmar_contrato');
//                             console.log('yeah')
                        }else if(record.get('total_contratado_contrato')){
                            valContrato=record.get('total_contratado_contrato');
                        }
                        if(valContrato.length>0){
                            var qtipcontrato='',
                                totalcontrato=0, montototal=0;
                            valContrato.forEach(function(y){
                                totalcontrato+=parseFloat(y['valor']);
                                qtipcontrato+='<b>'+y['codigoiso']+':</b> '+
                                    Ext.util.Format.number(parseFloat(y['valor']), '0.000,00/i')+'<br/>'
                            });
                            if(record.get('montototal'))montototal=record.get('montototal');
                            qtipcontrato='<br/><b><u>Valores contrato:</u></b><br><br>' +
                                '<b>Monto total:</b> '+Ext.util.Format.number(montototal, '0.000,00/i')+'<hr>'+
                                '(<b>Total:</b> '+Ext.util.Format.number(totalcontrato, '0.000,00/i')+')<hr>'+
                                qtipcontrato;
                            qtip=qtip+qtipcontrato;
                        }
                    }
                    // total=Ext.util.Format.currency(total);
                    total=Ext.util.Format.number(total, '0.000,00/i');
                    qtip='<b>Total:</b> '+total+'<hr/>'+qtip;
                    meta.tdAttr = 'data-qtip="' + qtip + '"';
                    return total;
                }
            }
            return '';
        };

        me.columnasFijas=[
            {xtype: 'treecolumn',text:me.etiquetas.lbNombre, dataIndex:'text', locked:true,
                width:280, minWidth:150,
                // filter:{type:'string'},
                renderer:mostrarTooltipColumna,
            },
            {text: 'CantCont', dataIndex:'cantcontratos', width:100},
            { text: me.etiquetas.lbSinFirmar, dataIndex: 'total_sinfirmar', align:'right', width:130,
                tooltip:me.etiquetas.tipSinFirmar,
                renderer:me.formatoDinero},
            { text: me.etiquetas.lbTContratado, dataIndex: 'total_contratado', align:'right', width:130,
                tooltip:me.etiquetas.tipTContratado,
                renderer:me.formatoDinero },
            { text: me.etiquetas.lbSinEjecutar, dataIndex: 'total_sinejecutar', align:'right', width:130,
                tooltip:me.etiquetas.tipSinEjecutar,
                renderer:me.formatoDinero  },
        ];

        me.formarColumnas=function(){
            var columnasFinal=[];
            columnasFinal=columnasFinal.concat(me.columnasFijas);
            columnasFinal=columnasFinal.concat(me.columnasEjecucion);
            columnasFinal=columnasFinal.concat(me.columnasFacturacion);
            return columnasFinal;
        }
        me.columns=me.formarColumnas();
        // me.columns=[
        //     {xtype: 'treecolumn',text:'Denominacion', dataIndex:'text', locked:true,
        //         width:250, minWidth:150,
        //         renderer:mostrarTooltipColumna},
        //     { text: 'Sin Firmar', align:'right', dataIndex: 'total_sinfirmar',
        //       tooltip:'Contrato registrado en el sistema, en espera de firma',
        //       renderer:formatoDinero, width:100,},
        //     { text: 'T. Contratado', dataIndex: 'total_contratado', align:'right', width:100,
        //         tooltip:'Total contratado',
        //         renderer:formatoDinero },
        //     { text: 'Sin Ejecutar', dataIndex: 'total_sinejecutar', width:100, align:'right',
        //         tooltip:'Hitos sin ejecutar',
        //         renderer:formatoDinero  },
        //     { text: 'EJECUCIÓN',
        //         renderer:formatoDinero ,
        //         columns:
        //             [
        //                 { text: 'Total',
        //                     width:100,align:'right',
        //                     tooltip:'Monto total de los hitos de pago en proceso de ejecución',
        //                     renderer:formatoDinero,dataIndex: 'total_ejecutado'},
        //                 { text: 'Aceptado',
        //                     nombre:'Aceptado',
        //                     tooltip:'Hitos y entregables con actas de aceptación firmadas por el cliente',
        //                     //tooltip:'Cantidad de contratos',
        //                     width:100,align:'right',
        //                     renderer:formatoDinero ,
        //                     dataIndex: 'e_aceptado'},
        //                 { text: 'Certificado EP',
        //                     nombre:'Certificado EP',
        //                     width:100,align:'right',
        //                     renderer:formatoDinero ,
        //                     tooltip:'Hitos y entregables revisados por los especialistas de la Dir. Producción',
        //                     dataIndex: 'e_certificado'},
        //                 { text: 'Certificado DP',
        //                     nombre:'Certificado DP',
        //                     width:100,align:'right',
        //                     renderer:formatoDinero ,
        //                     width:100,
        //                     tooltip:'Hitos y entregables listos para facturar',
        //                     dataIndex: 'e_terminado'}
        //             ]
        //     },
        //     { text: 'FACTURACIÓN',
        //         //tooltip:'Contratado',
        //         columns:
        //             [
        //                 { text: 'Total',
        //                     width:100,align:'right',
        //                     tooltip:'Monto total de los hitos de pago en proceso de facturación',
        //                     renderer:formatoDinero,dataIndex: 'total_facturacion'},
        //                 { text: 'F. Generada',tooltip:'Hitos cuya factura esta a la firma por el cliente',
        //                     nombre:'Factura Generada',
        //                     width:100, align:'right',
        //                     renderer:formatoDinero ,
        //                     dataIndex: 'f_generada'},
        //                 { text: 'F. Firmada',tooltip:'Hitos cuya factura fue firmada por el cliente',
        //                     nombre:'Factura Firmada',
        //                     width:100, align:'right',
        //                     renderer:formatoDinero ,
        //                     dataIndex: 'f_firmada'},
        //                 { text: 'F. Cobrada',tooltip:'Hitos cuyo pago a la entidad fue realizado a nuestra empresa',
        //                     nombre:'Factura Cobrada',
        //                     width:100, align:'right',
        //                     renderer:formatoDinero ,
        //                     dataIndex: 'f_cobrada'}
        //             ]}
        // ];

        me.dockedItems = [
            {
                xtype: 'toolbar',
                overflowX:'auto',
                items:[
                    {
                        xtype:'button',
                        iconCls: 'recargar',
                        tooltip:me.etiquetas.tipActualizar,
                        handler:function(){
                            me.store.load();
                        }
                    },
                    {
                        xtype:'button',
                        text:me.etiquetas.lbGraficar,
                        tooltip:me.etiquetas.lbGraficar,
                        iconCls: 'graficar',
                        action: 'graficar',
                    },
                    {
                        xtype:'button',
                        text:me.etiquetas.lbDetallesContrato,
                        tooltip:me.etiquetas.tipDetallesContrato,
                        itemId: 'detallescontratos',
                        iconCls: 'detalles',
                        action: 'detallescontrato',
                        disabled:true
                    },
                    '->',
                    '-',
                    {
                        xtype:'checkbox',
                        itemId:'tiempoestimado',
                        action:'tiempoestimado',
                        allowBlank:true,
                        margin:'0 10 0 0',
                        labelWidth:90,
                        fieldLabel:me.etiquetas.lbTiempoEstimado,
                        // boxLabel:me.etiquetas.lbTiempoEstimado
                    },
                    Ext.create('ReporteContratacion.view.FechaTrigger',{
                        fieldLabel:me.etiquetas.lbDesde,
                        labelWidth:40,
                        width:140,
                        itemId:'fechainicial',
                        limpiarButton:false,
                        value: inicialMes
                    }),
                    Ext.create('ReporteContratacion.view.FechaTrigger',{
                        fieldLabel:me.etiquetas.lbHasta,
                        labelWidth:40,
                        width:140,
                        itemId:'fechafinal',
                        limpiarButton:false,
                        value:finalMes
                    }),
                    {
                        xtype:'button',
                        iconCls:'buscar',
                        itemId:'rangobuscar',
                        action:'rangobuscar',
                        tooltip:me.etiquetas.tipBuscarRango,
                        // disabled:true,
                    },
                    // {
                    //     xtype: 'button',
                    //     iconCls: 'limpiar',
                    //     itemId:'rangolimpiar',
                    //     action:'rangolimpiar',
                    //     tooltip: me.etiquetas.tipLimpiarRango,
                    //     // disabled:true,
                    // },
                    '-',
                    /*Ext.create('Ext.ux.SearchField', {
                        itemId:'searchfield',
                        width:130,
                        atributo:'area',
                        emptyText:me.etiquetas.lbbuscarArea,
                        searchTooltip: me.etiquetas.tipBuscarArea,
                    }),*/
                    Ext.create('Ext.ux.CmbSelectField', {
                            itemId:'idsector',
//                             fieldLabel: 'Sector',
//                             labelWidth:40,
                            maxWidth: 150,
                            minWidth:140,
                            width:140,
                            // fieldLabel: me.context == "proveedor" ? me.etiquetas.lbOrganismo:me.etiquetas.lbEsquema,
                            name: 'sector',
                            mapping: 'NomSector.denominacion',
                            localId: 'idsector',
                            module: 'Nomencladores',
                            gen: 'm',
                            filters: {},
                            //disabled: true,
                            context: 'gestioncontratomainwindowsector',
                            emptyText:'Seleccione el sector...',
                            flex: 1
                        }),
                    Ext.create('GestionContrato.view.SearchCmbArea', {
//                             itemId:'searchfield',
//                             fieldLabel:'Area', 
//                             labelWidth:40,
                            itemId: 'filtroarea',
                            name: 'filtroarea',
                            hideLabel: true,
                            maxWidth: 350,
                            minWidth: 150,
                            width: 220,
                            editable: false,
                            searchTooltip: 'Buscar',
                            clearTooltip: 'Limpiar filtro',
                            emptyText: 'Seleccione el \xE1rea...'
                        }),
                    Ext.create('Ext.ux.SearchField', {
                        itemId:'searchfieldcontrato',
                        width:130,
                        atributo:'contrato',
                        emptyText:me.etiquetas.lbbuscarContrato,
                        searchTooltip:me.etiquetas.tipBuscarContrato,
                        // keyMap: [
                        //     {
                        //         key: 'l',
                        //         alt: true,
                        //         ctrl: false,
                        //         event: 'onclick1'
                        //     },
                        //     {
                        //         key: 'b',
                        //         alt: true,
                        //         ctrl: false,
                        //         event: 'onclick2'
                        //     }
                        // ]
                    }),
                    {
                        xtype: 'button',
                        text:me.etiquetas.lbLimpiar,
                        iconCls: 'limpiar',
                        itemId:'limpiarfiltros',
                        action:'limpiarfiltros',
                        tooltip: me.etiquetas.tipLimpiarFiltros,
                        disabled:true,
                    },
                ]
            }
        ];

        me.callParent();
        // me.down('#fechainicial').setValue(inicialMes);
        // me.down('#fechafinal').setValue(finalMes);
    },
});
