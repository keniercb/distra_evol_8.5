Ext.define('Pliego.view.Dashboard', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.dashboard',

    requires: [
        'Ext.layout.container.Column',
        'Pliego.view.PanelVista'
    ],
    layout: 'column',
    // cls: 'x-portal',
    // bodyCls: 'x-portal-body',
    defaultType: 'panelvista',
    autoScroll: true,
    initComponent: function () {
        var me = this;

        me.etiquetas=LangMgr.getLang(me);

        function mostrarTooltip (value, meta) {
            if (value) meta.tdAttr = 'data-qtip="' + value + '"';
            return value;
        }

        me.items=[
            {
                title: 'Mejores precios por proveedor',
                itemId:'vistamenoresproveedores',
                items:[
                    {
                        xtype: 'grid',
                        itemId: 'gridmenorespreciosproveedores',
                        maxHeight: 200,
                        columns:[
                            {text: 'Proveedor', dataIndex: 'proveedor', flex: 1, renderer: mostrarTooltip},
                            {text: 'Mejores precios',  tooltip: 'Mejores precios', dataIndex: 'cantmejoresprecios', flex: 0.3, maxWidth: 100, minWidth: 30, align: 'right', renderer: mostrarTooltip},
                            {text: '% / TS',  tooltip: 'Porciento del total de productos solicitados', dataIndex: '%MPxtotal', width: 50,  align: 'center',
                                renderer: function(value, meta, record){
                                    meta.tdAttr='data-qtip="'+record.get('cantmejoresprecios')+' de '+record.get('totalsolicitado')+'"';
                                    return value+'%'
                                }},
                            {text: '% / TO',  tooltip: 'Porciento del total de productos ofertados', dataIndex: '%MPxtotalofertado', width: 50,  align: 'center',
                                renderer: function(value, meta, record){
                                    meta.tdAttr='data-qtip="'+record.get('cantmejoresprecios')+' de '+record.get('totalofertado')+'"';
                                    return value+'%'
                                }},
                            {text: 'Paquetes', dataIndex: 'minimportetotal', width: 100, align: 'right', renderer: function(value, meta, record){
                                meta.tdAttr='data-qtip="'+record.get('minimportetotaloferta')+
                                    '<hr/>'+'"';
                                return Ext.util.Format.number(parseFloat(value), '0.000,00/i');
                                }}
                        ],
                        store: Ext.create('Ext.data.Store',{
                            fields: ['proveedor', 'oferta', 'numerooferta', 'cantmejoresprecios',
                                '%MPxtotal', '%MPxtotalofertado', 'importetotal', 'minimportetotal',
                                'montostotales', 'minimportetotaloferta', 'totalofertado',
                                'totalsolicitado', 'paquete'],
                            data: [],
                            sorters:[{property: 'cantmejoresprecios', direction: 'DESC'}]
                        })
                    }
                    // me.chartPie()
                ]
            },
            {
                title: 'Completamiento',
                itemId:'vistacompletamiento',
                items:[
                    {
                        xtype: 'grid',
                        itemId: 'gridcompletamiento',
                        maxHeight: 200,
                        columns:[
                            {text: 'Proveedor', dataIndex: 'proveedor', flex: 1, renderer: mostrarTooltip},
                            {text: 'Oferta', dataIndex: 'oferta', flex: 1, renderer: mostrarTooltip},
                            {text: 'Completamiento', tooltip: 'Completamiento de la oferta', dataIndex: 'cantcompletamiento', flex: 0.3, maxWidth: 100, minWidth: 30,align: 'right', renderer: mostrarTooltip},
                            {text: '%', tooltip: 'Porciento del total de productos solicitados', dataIndex: 'porcientocompletamiento', width: 50,  align: 'center',
                                renderer: function(value){
                                    return value+'%'
                                }
                            }
                        ],
                        store: Ext.create('Ext.data.Store',{
                            fields: ['proveedor', 'oferta', 'numerooferta', 'cantcompletamiento', 'porcientocompletamiento'],
                            data: [],
                            sorters:[{property: 'cantcompletamiento', direction: 'DESC'}]
                        })
                    },
                    // me.chartBarras()
                ]
            },
            {
                title: 'Mejores precios por ofertas',
                itemId:'vistamenores',
                items:[
                    {
                        xtype: 'grid',
                        itemId: 'gridmenoresprecios',
                        maxHeight: 200,
                        columns:[
                            {text: 'Oferta', dataIndex: 'oferta', flex: 1, renderer: mostrarTooltip},
                            {text: 'Proveedor', dataIndex: 'proveedor', flex: 1, renderer: mostrarTooltip},
                            {text: 'Mejores precios',  tooltip: 'Mejores precios', dataIndex: 'cantmejoresprecios', flex: 0.3, maxWidth: 100, minWidth: 30, align: 'right', renderer: mostrarTooltip},
                            {text: '% / TS',  tooltip: 'Porciento del total de productos solicitados', dataIndex: '%MPxtotal', width: 50,  align: 'center',
                                renderer: function(value, meta, record){
                                    meta.tdAttr='data-qtip="'+record.get('cantmejoresprecios')+' de '+record.get('totalsolicitado')+'"';
                                    return value+'%'
                                }},
                            {text: '% / TO',  tooltip: 'Porciento del total de productos ofertados', dataIndex: '%MPxtotalofertado', width: 50,  align: 'center',
                                renderer: function(value, meta, record){
                                    meta.tdAttr='data-qtip="'+record.get('cantmejoresprecios')+' de '+record.get('totalofertado')+'"';
                                    return value+'%'
                                }}
                        ],
                        store: Ext.create('Ext.data.Store',{
                            fields: ['proveedor', 'oferta', 'numerooferta', 'cantmejoresprecios',
                                '%MPxtotal', '%MPxtotalofertado', 'totalofertado', 'totalsolicitado'],
                            data: [],
                            sorters:[{property: 'cantmejoresprecios', direction: 'DESC'}]
                        })
                    }
                    // me.chartPie()
                ]
            },
            {
                title: 'Tiempos de entrega',
                itemId: 'vistatiempoentrega',
                items:[
                    {
                        xtype: 'grid',
                        itemId: 'gridtiempoentrega',
                        maxHeight: 420,
                        columns:[
                            {text: 'Oferta', dataIndex: 'oferta', flex: 1, renderer: mostrarTooltip},
                            {text: 'Proveedor', dataIndex: 'proveedor', flex: 1, renderer: mostrarTooltip},
                            {text: 'Tiempo de entrega', dataIndex: 'tiempoentrega', flex: 1, renderer: mostrarTooltip}
                        ],
                        store: Ext.create('Ext.data.Store',{
                            fields: ['proveedor', 'oferta', 'numerooferta', 'cantmejoresprecios', 'tiempoentrega',
                                '%MPxtotal', '%MPxtotalofertado', 'totalofertado', 'totalsolicitado'],
                            data: [],
                            sorters:[{property: 'proveedor', direction: 'DESC'}]
                        })
                    }
                ]
            }
        ];

        me.callParent();
    },
    chartPie: function(){
        return {
            xtype: 'chart',
            id:'chartmenoresprecios',
            width: '100%',
            height: 150,
            minWidth: 350,
            minHeight: 100,
            animate: true,
            shadow: false,
            insetPadding: 5,
            theme: 'Base:gradients',
            store: Ext.create('Ext.data.Store',{
                fields: ['proveedor', 'oferta', 'cant', '%'],
                data: []
            }),
            legend: {
                position:'right'
            },
            series:[{
                type: 'pie',
                showInLegend: true,
                pie: {
                    show: true,
                    radius: 1,
                    label: {
                        show: true,
                        radius: 3/4,
                        background: {
                            opacity: 0.5
                        }
                    }
                },
                field: 'cant',
                tips: {
                    trackMouse: true,
                    width: 150,
                    height: 50,
                    layout:'fit',
                    renderer: function(storeItem, item) {
                        // var total = 0;
                        //console.log(store1);
                        // solic_contrato_store.each(function(rec) {
                        //     total += rec.get('cant');
                        // });

                        // this.setTitle('Cantidad de solicitudes' + ': ' +storeItem.get('cant'));
                        this.update(storeItem.get('%')+'%');
                    }
                },
                label: {
                    field:'oferta',
                    //display:'none',
                    //render:
                    display:'rotate',
                    constrast: true,
                    renderer:function(label, e, records){
                        return records.get('cant');
                    },
                    font: '15px Arial',
                    color:'#FFF'

                },

                highlight:{
                    segment: {
                        margin: 20
                    }
                }


            }]
        }
    }
});