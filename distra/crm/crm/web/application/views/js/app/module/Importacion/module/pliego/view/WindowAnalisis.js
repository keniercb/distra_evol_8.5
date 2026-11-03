Ext.define('Pliego.view.WindowAnalisis', {
    extend: 'Ext.window.Window',
    alias: 'widget.windowanalisis',
    maximizable: true,
    maximized: true,
    autoScroll: true,
    modal:true,
    layout: 'border',
    initComponent: function () {
        var me=this;
        me.etiquetas=LangMgr.getLang(me);
        me.title= 'Análisis';
        me.height=window.innerHeight*0.6;
        me.width=window.innerWidth*0.7;
        me.minHeight=window.innerHeight*0.4;
        me.minWidth=window.innerWidth*0.4;
        me.items=[

            Ext.create('Pliego.view.Dashboard',{
                region: 'center',
                dockedItems: {
                    xtype: 'toolbar',
                    dock: 'bottom',
                    hidden: me.tipo == 'ver',
                    items: [
                        '->',
                        {
                            xtype: 'button',
                            text: 'Seleccionar ofertas',
                            tooltip: 'Proceder a seleccionar las ofertas para crear el pliego',
                            iconCls: 'seleccion',
                            action: 'seleccionarofertas'
                        }
                    ]
                }
            }),
            // Ext.create('Ext.toolbar.Toolbar',{
            //     dock: 'bottom',
            //     items:[
            //
            //     ]
            // }),
            Ext.create('Pliego.view.PanelSeleccionar',{
                region: 'south',
                collapsible: true,
                collapsed: me.tipo!='ver',
                resizable:true,
                // minWidth: 200,
                // maxWidth: window.innerWidth*0.7,
                // width: 320,
                minHeight: 220,
                maxHeight: window.innerHeight*0.75,
                height: window.innerHeight*0.5,
                hidden: me.tipo!='ver',
                tipo: me.tipo
            })
            // Ext.create('ComponenteReporte.view.ContainerGraficas')
        ];
        me.buttons=[
            {
                xtype: 'button',
                text: 'Cerrar',
                iconCls: 'cerrar',
                listeners: {
                    click: function () {
                        me.destroy();
                    }
                }
            }
        ];
        me.callParent();
    }
});