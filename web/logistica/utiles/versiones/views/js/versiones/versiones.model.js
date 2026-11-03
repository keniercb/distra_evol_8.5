/**
 * Created by Lisbeth 
 */
Ext.ns('LOG.utiles.versiones');

LOG.utiles.versiones.model = {
    cargarProyectos: function(fn_callback){
        var myMask = new Ext.LoadMask(Ext.getBody(), {msg:"Por favor espere..."});
        myMask.show();

        Ext.Ajax.request({
            url: '/logistica/utiles/versiones/index.php/versiones/getProyectos',
            method: 'POST',
            callback: function(options, success, response) {
                var rd = Ext.decode(response.responseText);
                myMask.hide();
                if (success) {
                    fn_callback(rd.datos);
                } else {
                    mostrarMensaje(3, 'Ha ocurrido un error cargando los datos.');
                }
            }
        });
    },
    cargarChangelogData : function(params, fn_callback){
        var myMask = new Ext.LoadMask(Ext.getBody(), {msg:"Por favor espere..."});
        myMask.show();

        Ext.Ajax.request({
            url: '/logistica/utiles/versiones/index.php/versiones/leerFichero',
            method: 'POST',
            params: {
                dir: params,
            },
            callback: function(options, success, response) {
                myMask.hide();
                var rd = Ext.decode(response.responseText);
                if (success) {
                    fn_callback(rd.datos);
                } else {
                    mostrarMensaje(3, 'Ha ocurrido un error cargando los datos.');
                }
            }
        });
    }
};
