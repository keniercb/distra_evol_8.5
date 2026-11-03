Ext.define('Packed.store.pack', {
    require : [
        'Ext.data.Store'
    ],
    extend  : 'Ext.data.Store',
    model: 'Packed.model.packs',

    proxy   : {
        type   : 'ajax',
        url : 'getListPackages',
        reader : {
            type          : 'json',
            root          : 'datos',
            totalProperty : 'cantidad'
        }

    },
    autoLoad: true,

    listeners:{
        load:function(){
            //console.log(this.data.length);
            Ext.getCmp('btnElimPack').setDisabled(true);
            Ext.getCmp('btnPublicar').setDisabled(true);
            if(this.data.length==0 && !Ext.getCmp('textfieldBuscarTree').isDisabled()){
                    mostrarMensaje(1,'No existen datos que se correspondan con los criterios de búsqueda especificados.');
            }
        }
    }
});
