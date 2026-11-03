Ext.define('ReporteContratacion.view.WindowGraficas', {
    extend:'Ext.window.Window',
    alias: 'widget.rc_windowgraficas',
    layout:'fit',
    maximizable:true,
    resizable:true,
    modal:true,
    numGrafica:1,
    initComponent:function(){
        var me=this;
        me.etiquetas = LangMgr.getLang(this);

        me.title=me.etiquetas.lbGraficar;

        Ext.define('treepanelareas',{
            extend:'Ext.tree.Panel',
            // xtype: 'treepanel',
            // title: 'Seleccionar areas',
            itemId:'treepanelareas',
            region:'center',
            rootVisible:false,
            cls: 'crm-icon-tree',
            selType: 'checkboxmodel',
            margin:'0 0 5 0',
            columns:[
                {
                    xtype:'treecolumn',
                    text:'<b>'+me.etiquetas.lbSeleccionarAreas+'</b>',
                    dataIndex:'text', flex:1,
                    renderer:function(value, meta, record){
                        var abbr='';
                        if(record.get('abreviatura'))abbr=' <i>('+record.get('abreviatura')+')</i>';
                        meta.tdAttr = 'data-qtip="'+value+abbr+'"';
                        return value;
                    }
                }
            ],
            bbar:[
                {
                    xtype: 'displayfield',
                    itemId:'textinformacion',
                    allowBlank:true,
                    // anchor:'100%',
                    value:me.etiquetas.lbSeleccionesText,
                    seleccionesText:me.etiquetas.lbSeleccionesText,
                    todoBienText:me.etiquetas.lbTodoBienText,
                    demasiadasBarrasText:me.etiquetas.lbdemasiadasBarras,
                    margin:'0 0 0 5',
                }
            ],
            initComponent:function(){
                var tree=this;

                tree.store=Ext.create('ReporteContratacion.store.Areas', {
                    storeId: 'store_areas_grafica',
                    listeners:{
                        beforeload:function(store){
                            if(tree)
                                tree.setLoading({msg: "Cargando..."});
                        },
                        load:function(store, node,records, success){
                            if(tree)
                                tree.setLoading(false);
                        },
                    }
                });

                tree.callParent();
            },
        });

        me.items=[
            {
                xtype:'panel',
                layout:'border',
                width: window.innerWidth-20,
                height: window.innerHeight-50,
                items:[
                    {
                        xtype:'panel',
                        itemId:'panelconfgrafica',
                        title:me.etiquetas.lbConfGrafica,
                        region:'west',
                        layout:'border',
                        collapsible:true,
                        resizable:true,
                        width:250,
                        minWidth:250,
                        maxWidth:550,
                        tbar:[
                            '->',
                            {
                                xtype: 'button',
                                text:me.etiquetas.lbCrearGrafica,
                                tooltip:me.etiquetas.tipCrearGrafica,
                                iconCls:'graficar',
                                itemId:'creargrafica',
                                action:'creargrafica',
                                disabled:true,
                            }
                        ],

                        items:[
                            {
                                xtype:'form',
                                layout:'anchor',
                                region:'north',
                                // bodyPadding:2,
                                frame:true,
                                items:[
                                    {
                                        xtype:'textfield',
                                        fieldLabel:'Nombre',
                                        itemId:'nombre',
                                        labelWidth:53,
                                        maxLength:20,
                                        enforceMaxLength:true,
                                        allowBlank:false,
                                        region:'north',
                                        anchor:'100%',
                                        margin:' 5 5 10 0',
                                        value:'Grafica #1'
                                    },
                                    {
                                        xtype:'fieldset',
                                        title:me.etiquetas.lbConfAdicional,
                                        anchor:'100%',
                                        margin:'5 5 5 0',
                                        collapsible:true,
                                        collapsed:true,
                                        items:[
                                            {
                                                xtype:'checkboxgroup',
                                                itemId:'checkboxmontos',
                                                columns:2,
                                                vertical:true,
                                                allowBlank:false,
                                                blankText:me.etiquetas.msgObligatorioSeleccionarUno,
                                                items:[
                                                    { boxLabel: me.etiquetas.lbSinFirmar, name: 'rb', inputValue: me.etiquetas.lbSinFirmar },
                                                    { boxLabel: me.etiquetas.lbSinEjecutar, name: 'rb', inputValue: me.etiquetas.lbSinEjecutar },
                                                    { boxLabel: me.etiquetas.lbTContratado, name: 'rb', inputValue: me.etiquetas.lbTContratado, checked: true },
                                                    { boxLabel: me.etiquetas.lbEjecutado, name: 'rb', inputValue: me.etiquetas.lbEjecutado, checked: true },
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            },
                            Ext.create('treepanelareas'),
                        ]
                    },
                    {
                        xtype:'tabpanel',
                        region:'center',
                        itemId:'tabpanelgraficas',
                        items:[]
                    }
                ]
            }
        ];

        me.callParent();
    }
});