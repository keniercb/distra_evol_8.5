Ext.define('GestionContratoImportacion.view.FormaPago.GridMora', {
    extend:'Ext.grid.Panel',
    alias:'widget.gridmoraimportacion',
    selType:'checkboxmodel',
    idAEliminar:[],
    initComponent: function(){
        var me=this;
        me.etiquetas = LangMgr.getLang(me);

        me.plugins=[
            new Ext.grid.plugin.CellEditing({
                clicksToEdit: 1,
                listeners:{
                    edit:function(yo, obj){

                    }
                }
            })
        ];

        me.store=Ext.create('Ext.data.Store',{
            fields:['moneda', 'porciento', 'dias', 'maximo', 'idmoneda', 'idmora'],
            data:[]
        });

        me.storeComboMoneda=Ext.create('Ext.data.Store',{
            fields: ['codigoiso','idmonedaentidad'],
            data: []
        });

        me.columns=[
            {
                text:'Moneda', dataIndex:'moneda', flex:1,
                editor: {
                    xtype: 'combo',
                    store: me.storeComboMoneda,
                    valueField: 'idmonedaentidad',
                    displayField: 'codigoiso',
                    queryMode: 'local',
                    editable:false
                }
            },
            {
                text:'Porciento diario (%)', dataIndex:'porciento', flex:1,
                editor: {
                    xtype: 'numberfield',
                    allowBlank: false,
                    minValue: 0,
                    maxValue: 100,
                    decimalPrecision: 2,
                    maxLength: 3,
                    decimalSeparator: '.',
                    allowDecimals:true,
                    allowExponential:false,
                    // listeners:{
                    //     change:function(yo){
                    //
                    //     }
                    // }
                },
                // renderer: function(value){
                //     if(value)return value+'%'
                // }
            },
            {
                text:'Despu&eacute;s de d&iacute;as', dataIndex:'dias', flex:1,
                editor: {
                    xtype: 'numberfield',
                    allowBlank: false,
                    minValue: 0,
                    decimalPrecision: 2,
                    maxLength: 19,
                    decimalSeparator: '.',
                    allowDecimals:false,
                    allowExponential:false,
                    // listeners:{
                    //     change:function(yo){
                    //
                    //     }
                    // }
                }
            },
            {
                text:'M&aacute;ximo', dataIndex:'maximo', flex:1,
                editor: {
                    xtype: 'numberfield',
                    allowBlank: false,
                    minValue: 0,
                    decimalPrecision: 2,
                    maxLength: 19,
                    decimalSeparator: '.',
                    allowDecimals:false,
                    allowExponential:false,
                    // listeners:{
                    //     change:function(yo){
                    //
                    //     }
                    // }
                }
            }
        ];

        me.btnAdd = Ext.create('Ext.Button', {
            iconCls: 'icondistra-adicionar icon-medium',
            action:'addmora',
            text: me.etiquetas.lbAdd,
            tooltip: me.etiquetas.qtipAddMora,
        });

        me.btnDel = Ext.create('Ext.Button', {
            iconCls: 'icondistra-eliminar icon-medium',
            action: 'delmora',
            disabled: true,
            text: me.etiquetas.lbDel,
            tooltip: me.etiquetas.qtipDelMora
        });

        me.tbar=[me.btnAdd, me.btnDel];

        me.callParent();
    }
});