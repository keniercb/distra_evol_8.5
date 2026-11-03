/**
 * Created by lily on 3/02/15.
 */
//Ext.require([
//    'Ext.data.*',
//    //'Ext.data.Store',
//]);
Ext.define('Conf.store.StoreGridEditor', {
    extend  : 'Ext.data.Store',
    model: 'Conf.model.ModelStoreGrid',
    pageSize: 20,
    proxy   : {
        type   : 'ajax',
        url : 'cargargridacciones',
        reader : {
            type          : 'json',
            root          : 'datos',
            totalProperty : 'cantidad_filas'
        }

    },
    listeners:{
        load:function(){
            //console.log(this.data.length);
            if(this.data.length==0)
                mostrarMensaje(1,this.proxy.extraParams.msg);
        },
        update:function(){
            Ext.getCmp('btnGuardar').enable();
        }
    }

});