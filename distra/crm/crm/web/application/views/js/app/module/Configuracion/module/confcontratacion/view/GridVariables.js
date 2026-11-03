Ext.define('ConfContratacion.view.GridVariables',{
    extend: 'Ext.grid.Panel',
    region: 'center',
    selType: 'checkboxmodel',
    columns: [
        {text: 'Nombre', dataIndex: 'nombre', flex:1},
        {text: 'Descripcion', dataIndex: 'descripcion', flex:1},
    ],
    initComponent: function(){
        var me=this;
        var store=Ext.create('Ext.data.Store',{
            autoLoad:true,
            fields:['idvariable', 'nombre', 'descripcion', 'sql'],
            proxy: {
                type: 'ajax',
                url: UtilsFn.buildUrl({action: 'getVariables'}, ModuleMgr.get('ConfContratacion')),
                reader: {
                    root: 'data',
                    totalProperty: 'cant',
                    successProperty: 'success',
                    idProperty: 'idvariable'
                }
            }
        });
        me.store=store;
        if(!me.sinBotones){
            me.tbar=[
                {text:'Adicionar', itemId:'adicionarvariable', iconCls: 'adicionar', action: 'adicionarvariable'},
                {text:'Modificar', itemId:'modificarvariable', iconCls: 'modificar', action: 'modificarvariable', disabled:true},
                {text:'Eliminar', itemId:'eliminarvariable', iconCls: 'eliminar', action: 'eliminarvariable', disabled:true},
            ]
        }

        me.bbar= new Ext.PagingToolbar({
            pageSize: 25,
            store: store,
            displayInfo: true
        });

        me.callParent();
    }

})