Ext.define('GestionContrato.view.GridVehiculos', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.gridvehiculos',
    itemId: 'gridvehiculos',
    datosLoad:[],
    initComponent: function(){
        var me=this;
        me.etiquetas = LangMgr.getLang(me);

        function showRenderer(value, meta) {
            if (value)
                meta.tdAttr = 'data-qtip="' + value + '"';
            return value;
        }

        me.columns=[
            {
                text:me.etiquetas.lbVehiculo,
                dataIndex:'denominacion',
                flex:1.5,
                renderer: showRenderer
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
                text:'Matricula',
                dataIndex:'matricula',
                flex:0.4,
                renderer: showRenderer
            },
            {
                header:'Serie/VIN',
                dataIndex:'serie',
                width:150,
                flex:1,
                renderer: showRenderer
            },
            {
                text:'Marca',
                dataIndex:'marca',
                flex:1,
                renderer: showRenderer
            },
            {
                text:'Modelo',
                dataIndex:'modelo',
                flex:1,
                renderer: showRenderer
            }
        ];
        me.store=Ext.create('Ext.data.Store',{
            fields:[
                'denominacion', 'marca', 'modelo', 'idindicador',
                'idvehiculocontrato', 'matricula', 'serie', 'idcliente', 'idcontrato'
            ],
            idEliminados: [],
            listeners:{
                remove: function(store, record){
                    if(record.get('idvehiculocontrato'))
                        me.store.idEliminados.push(record.get('idvehiculocontrato'));
                }
            }
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
                Ext.create('GestionContrato.view.FormaPago.Producto.WindowProducto',{
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
