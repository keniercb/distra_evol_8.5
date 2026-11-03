Ext.define('Controlpanel.store.paquetes', {
    require : [
        'Ext.data.Store'
    ],
    extend  : 'Ext.data.Store',
    model: 'Controlpanel.model.paquetes',
    proxy   : {
        type   : 'ajax',
        url : 'cargarxml',
        reader : {
            type          : 'json',
            root          : 'datos',
            totalProperty : 'cantidad'
        }

    },
    listeners:{
        load:function(){
            if(this.data.length==0)
                mostrarMensaje(1,Zeolides.etiquetas.noseencontrarondatos);
        }

    },
    autoLoad: true

});

