Ext.define('GestionContratoImportacion.view.WindowEliminar',{
    extend: 'Ext.window.Window',
    alias: 'widget.co_windoweliminarimportacion',
    modal: true,
    constrain: true,
    layout: 'fit',
    initComponent: function(){
        var me=this;
        me.etiquetas = LangMgr.getLang(me);
        me.title= me.etiquetas.lbContratosDesactivados;
        me.width= window.innerWidth*0.8;
        me.height=window.innerHeight*0.8;
        me.items=[
            Ext.create('GestionContratoImportacion.view.gridContratos', {
			    //rowParams:{'activos':'1'},
                filtrosFijos: {
                    'activos': {'type': 'other', 'value': '1'},
                    'cliente': {'type': 'list', 'value': '[2]'}
                },
                selType: 'checkboxmodel',
                topBar: false,
                tbar:[
                    {
                        itemId: 'activar',
                        iconCls: 'activar',
                        action: 'activar',
                        // selector: 'btnDel',
                        disabled: true,
                        // hidden: true,
                        text: me.etiquetas.lbActivar,
                        tooltip: me.etiquetas.qtipActivar,
                    },
                    {
                        itemId: 'eliminar',
                        iconCls: 'eliminar',
                        action: 'del',
                        // selector: 'btnDel',
                        disabled: true,
                        // hidden: true,
                        text: me.etiquetas.lbBtnDel,
                        tooltip: me.etiquetas.qtipEliminar,
                    },
                    '|',
                    {
                        itemId: 'detalles',
                        iconCls: 'detalles',
                        action: 'detail',
                        disabled: true,
                        // hidden: true,
                        text: me.etiquetas.lbBtnDetail,
                        tooltip: me.etiquetas.qtipDetail,
                    }
                ]
            })
        ];
        me.buttons= [{
            text: me.etiquetas.lbCerrar,
            iconCls: 'icondistra-cerrar',
            tooltip: me.etiquetas.lbCerrar,
            handler: function () {
                me.close();
            }
        }];
        me.callParent();
        me.down('grid').getSelectionModel().on('selectionchange', function(yo, records){
            console.log('selectionchange 2')
            me.down('#activar').setDisabled(records.length==0);
            me.down('#eliminar').setDisabled(records.length==0);
            me.down('#detalles').setDisabled(records.length!=1);
        })
    }
})