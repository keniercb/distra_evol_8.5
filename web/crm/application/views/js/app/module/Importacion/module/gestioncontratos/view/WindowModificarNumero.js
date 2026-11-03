Ext.define('GestionContratoImportacion.view.WindowModificarNumero', {
    extend: 'Ext.window.Window',
    alias: 'widget.windowmodificarnumeroimportacion',
    constrain: true,
    modal: true,
    // frame: false,
    border: false,
    // width: 100,
    minWidth: 300,
    // height: 100,
    minHeight: 120,
    maximizable: false,
    layout: 'fit',
    requires: ['Ext.grid.Panel'],
    initComponent: function () {
        var me=this;
        me.etiquetas = LangMgr.getLang(me);
        me.title=me.etiquetas.qtipModificarNumero;

        me.items=[
            {
                xtype: 'form',
                frame: true,
                bodyStyle: 'background:#DFE9F6;',
                trackResetOnLoad: true,
                layout:'anchor',
                items:[
                    {
                        xtype: 'container',
                        // anchor: '100%',
                        // layout: 'hbox',
                        layout: {
                            type: 'hbox',
                            pack: 'center'
                        },
                        itemId: 'elementos',
                        margin: 10,
                        items:[
                            {
                                xtype: 'hiddenfield',
                                itemId: 'idcontrato',
                                name: 'idcontrato',
                            },
                            {
                                xtype: 'hiddenfield',
                                itemId: 'numerojson',
                                name: 'numerojson',
                            },
                            {
                                xtype: 'hiddenfield',
                                itemId: 'posiciones',
                                name: 'posiciones',
                            },
                            {
                                xtype: 'hiddenfield',
                                itemId: 'ignoreErrors',
                                name: 'ignoreErrors',
                                value: '0'
                            },
                        ]
                    },

                ]
            },
            // Ext.create('Ext.grid.Panel',{
            //     // xtype: 'grid',
            //     // title: 'Advertencias',
            //     itemId: 'errores',
            //     anchor: '100%',
            //     height: 90,
            //     // hidden:true,
            //     store: Ext.create('Ext.data.Store',{
            //         fields: ['tipo', 'mensaje', 'detalle'],
            //         data:[{mensaje: 'Que'}]
            //     }),
            //     columns:[
            //         {text: 'Mensaje', dataIndex: 'mensaje', flex: 1}
            //     ]
            // })
        ];

        this.buttons = [
            {
                text: this.etiquetas.lbBtnCancel,
                tooltip: this.etiquetas.qtipCancel,
                action: 'cancel',
                iconCls: 'cancelar',
                listeners: {
                    click: function () {
                        me.destroy();
                    }
                }
            },
            {
                text: this.etiquetas.lbBtnAccept,
                tooltip: this.etiquetas.qtipAccept,
                itemId: 'acept',
                action: 'acept',
                disabled: true,
                iconCls: 'aceptar'
            }
        ];

        this.callParent();
    }
});
