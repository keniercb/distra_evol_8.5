Ext.define('GestionContratoImportacion.view.GridVehiculos', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.gridvehiculosimportacion',
    itemId: 'gridvehiculosimportacion',
    datosLoad:[],
    initComponent: function(){
        var me=this;
        me.etiquetas = LangMgr.getLang(me);



        me.columns=[
            {
                text:me.etiquetas.lbVehiculo,
                dataIndex:'denominacion',
                flex:1.5
            },
            // {
            //     text:'Marca',
            //     dataIndex:'marca',
            //     flex:0.4
            // },
            // {
            //     text:'Modelo',
            //     dataIndex:'modelo',
            //     flex:0.4
            // },
            {
                text:'Chapa',
                dataIndex:'chapa',
                flex:0.4
            },
            {
                header:'Tipo de medio',
                dataIndex:'tipomedio',
                width:150,
                flex:1
            },
            {
                text:'Provincia',
                dataIndex:'provincia',
                flex:1
            }
        ];
        me.store=Ext.create('Ext.data.Store',{
            fields:['denominacion', 'marca', 'modelo', 'provincia',
                    'idmarca', 'idmodelo', 'nacionalidad', 'idindicador',
                    'idvehiculocontrato', 'chapa', 'datos_json', 'tipomedio']
        });

        me.selModel=Ext.create('Ext.selection.CheckboxModel',{
            listeners:{
                selectionchange: function(yo, select){
                    me.btnDel.setDisabled(select.length==0);
                }
            }
        });

       /* me.btnAdd=Ext.create('Ext.button.Button',{
            xtype:'button',
            text:me.etiquetas.lbAdd,
            iconCls: 'adicionar',
            tooltip:me.etiquetas.lbAdicionarVehiculo,
            handler:function(){
                Ext.create('GestionContratoImportacion.view.FormaPago.Producto.WindowProducto',{
                    gridproducto: me
                }).show();
            }
        }),*/

        me.btnDel=Ext.create('Ext.button.Button',{
            xtype:'button',
            text:me.etiquetas.lbDel,
            iconCls: 'eliminar',
            disabled:true,
            tooltip:me.etiquetas.lbEliminarVehiculo,
            handler:function(){
                mostrarMensaje(2, '¿Est&aacute; seguro que desea eliminar los veh&iacute;culos seleccionados?',
                    function (response) {
                        if (response === 'ok') {
                            me.store.remove(me.selModel.getSelection());
                        }
                    }
                );


            }
        }),

        me.tbar=[
            // me.btnAdd,
            me.btnDel
        ];

        me.callParent();

    }
});
