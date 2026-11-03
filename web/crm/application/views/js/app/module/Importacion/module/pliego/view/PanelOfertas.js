Ext.define('Pliego.view.PanelOfertas', {
    extend: 'Ext.panel.Panel',
    itemId:'panelofertas',
    alias: 'widget.panelofertas',
    border: false,
    clossable:false,
    // layout: 'border',
    initComponent: function () {
        this.createBody();
        this.callParent();
    },
    createBody: function () {
        var me = this;

        this.etiquetas = LangMgr.getLang(this);

        var hoy=new Date(),
            inicialMes=new Date(hoy.getFullYear(), hoy.getMonth(), 1),
            finalMes=new Date(hoy.getFullYear(), hoy.getMonth()+1, 0);

        this.title='Ofertas/Reofertas';

        function mostrarTooltip (value, meta) {
            if (value) meta.tdAttr = 'data-qtip="' + value + '"';
            return value;
        }

        var sfsolicituddemanda = Ext.create('Ext.form.field.ComboBox', {
            name: 'idsolicitud',
            itemId: 'idsolicitud',
            fieldLabel: 'Solicitud de oferta',
            labelAlign: 'top',
            // labelWidth: 55,
            valueField: 'idsolicitud',
            displayField: 'nombre',
            queryMode: 'remote',
            queryDelay: 400,
            minChars: 1,
            pageSize: 20,
            listLoadingText: 'Cargando...',
            listEmptyText: 'No existen datos que mostrar.',
            flex:1,
            allowBlank: true,
            columnWidth: 1,
            listConfig: {
                // Custom rendering template for each item #e1f5fe
                tpl:
                    '<ul class="' + Ext.plainListCls + '">' +
                    '<tpl for=".">' +
                    '<li role="option" unselectable="on" style="list-style-type: none; /*background-color: blue;*/" class="x-boundlist-item icondistra-{estadoicon}"  data-qtip="{nombre}">{nombre}</li>' +
                    '</tpl>' +
                    '</ul>',
                // getInnerTpl: function() {
                //     // return '<ul class="' + Ext.plainListCls + '">' +
                //     //     '<tpl for=".">' +
                //     //     '<li class="x-boundlist-item icondistra-{estadoicon}">{nombre}</li>' +
                //     //     '</tpl>' +
                //     //     '</ul>'
                //     return '<a class="search-item" style="background-color: #0a56c8">' +
                //         '<h3>{nombre}</h3>' +
                //         '</a>';
                //     // return '<div style="background-color: #0a56c8" class="x-boundlist-item icondistra-{estadoicon}" data-qtip="{nombre}">{nombre}</div>';
                // }
            },
            // margin: '0 0 5 0',
            store: Ext.create('Ext.data.Store',{
                // autoLoad:true,
                proxy:{
                    type: 'ajax',
                    actionMethods: {read: 'POST'},
                    url:UtilsFn.buildUrl({action: 'getSolicitudesNegocio'}, ModuleMgr.get('OfertaNegocioImportacion')),
                    reader: {
                        idProperty: 'idsolicitud',
                        type: 'json',
                        root: 'data',
                        totalProperty: 'count'
                    },
                    extraParams:{  //me.idestadosolicitud
                        'filter[0][field]': 'cliente',
                        'filter[0][data][type]': 'list',
                        'filter[0][data][value]': '[4]',
                        'filter[1][field]': 'estado',
                        'filter[1][data][type]': 'list',
                        'filter[1][data][value]': '['+9+']',
                        // 'filter[1][data][value]': '['+me.idestadosolicitud+']',

                        // me.context == 'cliente' ? 1 : 2
                    }
                },
                fields:[
                    'idsolicitud', 'nombre', 'idclienteproveedor', 'idsector', 'sector', 'idarearesponsable',
                    'descripcion', 'arearesponsable', 'idarea', 'area', 'clienteproveedor', 'idproveedores',
                    'idlinea', 'idtipolinea', 'descripcion', 'fechacreada', 'estado', 'linea', 'tipolinea',
                    'fechainicio', 'fechafin', 'numero', 'nombrepersona', 'estadoicon', 'idestado', 'estado'
                ]
            })
        });

        var detallessolicitud=Ext.create('Ext.button.Button',{
            iconCls: 'detalles',
            tooltip: 'Ver detalles de la solicitud',
            itemId: 'detallessolicitud',
            action: 'detallessolicitud',
            disabled: true,
            margin: '17 0 0 0'
        });

        var storeofertas=Ext.create('OfertaNegocioImportacion.store.OfertaNegocio',{
            storeId: 'storeofertas',
        });
        storeofertas.proxy.extraParams={
            'filter[0][field]': 'solicitud',
            'filter[0][data][type]': 'int',
            'filter[0][data][value]': '-1'
        };
        storeofertas.load();

        var gridOfertas=Ext.create('Ext.grid.Panel',{
            region: 'center',
            title: 'Ofertas',
            itemId: 'gridofertas',
            emptyText: 'Seleccione una solicitud para cargar las ofertas',
            features:[{ftype: 'summary', dock: 'top'}],
            store: storeofertas,
            bbar:[
                {
                    iconCls: 'detalles',
                    itemId:'detallesoferta',
                    tooltip: 'Mostrando datos adicionales al seleccionar una oferta',
                    enableToggle: true,
                    pressed: true,
                    toggleHandler: function(button, state){
                        button.setTooltip(state?'Mostrando datos adicionales al seleccionar una oferta':
                            'No mostrando datos adicionales al seleccionar una oferta');
                    }
                },
                // {
                //     xtype: 'button',
                //     itemId: 'actualizarofertas',
                //     iconCls: 'actualizar',
                //     tooltip: 'Actualizar vista',
                //     disabled: true
                // },
                '->',

            ],
            columns:[
                {text: 'Numero', dataIndex:'numero', width: 80, minWidth:50, maxWidth: 180,
                    renderer: mostrarTooltip/*, summaryRenderer: function(){return '<b>Totales</b>'}*/},
                {text: 'Nombre', dataIndex:'nombre', flex: 1, minWidth: 80,
                    renderer: mostrarTooltip, summaryType: 'count',/* summaryType: function(){}*/
                    summaryRenderer: function (value, summaryData, dataIndex) {
                        // var cant=storeofertas.proxy.reader.jsonData.cantidad;
                        return (value>0?'<b>Totales</b> '+value:'No hay ofertas');
                    }}
            ],
            viewConfig: {
                stripeRows: false,
                getRowClass: function (record, rowIndex, rowParams, store) {
                    console.log(me.up('mainpliego'))
                    if (record.get('idestado')==me.up('mainpliego').configPliego.idlistopliego) return 'contrademanda';
                }
            }
        });
        me.items=[
            {
                xtype: 'panel',
                // height: 100,
                region: 'north',
                layout: 'anchor',
                bodyStyle: {
                    padding: 5,
                    background: '#DFE9F6'
                },
                defaults:{
                    anchor: '100%',
                    columnWidth: 0.5
                },
                items:[
                    {
                        xtype: 'container',
                        itemId: 'container1',
                        layout: {
                            type: 'hbox',
                            align: 'bottom'
                        },
                        items:[
                            {
                                xtype: 'radiogroup',
                                vertical: true,
                                columns: 1,
                                margin: '0 22 5 0',
                                itemId: 'tiposolicitudes',
                                items: [
                                    {
                                        boxLabel: 'Nuevas',
                                        name: 'rb',
                                        inputValue: 'nuevas',
                                        checked: true
                                    },
                                    {
                                        boxLabel: 'Creadas',
                                        name: 'rb',
                                        inputValue: 'creadas',
                                    }
                                ]

                            },
                            {
                                xtype: 'container', flex:1,
                                layout: {
                                    type: 'hbox',
                                    align: 'bottom'
                                },
                                items:[
                                    Ext.create('Ext.form.field.Date', {
                                        labelAlign: 'top',
                                        fieldLabel: me.etiquetas.lbFechaInicio,
                                        name: 'fechainicio',
                                        itemId: 'fechainicio',
                                        width: 100,
                                        flex: 1,
                                        margin: '0 5 0 0',
                                        value: inicialMes
                                    }),
                                    Ext.create('Ext.form.field.Date', {
                                        labelAlign: 'top',
                                        fieldLabel: me.etiquetas.lbFechaFin,
                                        name: 'fechafin',
                                        itemId: 'fechafin',
                                        width: 100,
                                        flex: 1,
                                        value: finalMes
                                        // margin: '0 0 0 6'
                                    }),
                                    Ext.create('Ext.button.Button',{
                                        iconCls: 'buscar',
                                        tooltip: 'Buscar por el periodo seleccionado',
                                        itemId: 'buscarrango',
                                        action: 'buscarrango',
                                        disabled: true,
                                        // margin: '32 0 0 0'
                                    })
                                ]
                            }
                        ]
                    },
                    {
                        xtype: 'container',
                        layout: {
                            type: 'hbox',
                            align: 'stretch'
                        },
                        items:[
                            sfsolicituddemanda,
                            detallessolicitud
                        ]
                    }
                ]
            },
            gridOfertas
        ];

    }

});