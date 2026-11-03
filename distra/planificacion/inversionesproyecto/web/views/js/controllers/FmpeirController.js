/*
 *
 * @copyright XETID Cuba
 * @version 1.0
 * @author Yudier Frias Barzaga
 */

Planificacion.Integracion.FmpeirController = Ext.extend(Std.Base.Controller, {
    constructor: function() {

        var config = {
            labels: Planificacion.Integracion.Etiquetas,
            globals: {
                dirImg: Planificacion.Integracion.Imagenes
            }
        };
        this.init(config);
    },
    mostrarAyuda: function(referencia) {
        var title = 'Ayuda';
        help.show(title, referencia);
    },
    /**
     * @name adicionarIndicador
     * @author Yudier Frias <yfrias@xetid.cu>
     * @uses   
     * @param objeto
     */
    adicionarIndicador: function(objeto) {
        var stIndicador = this._getStore('stIndicador');
        var me = this._getItem('indicador');
        var datos = me.gridIndicadores.getChanges();
        Secodena.mostrarMascara('mascaraMed', 'Guardando');
        Ext.Ajax.request({
            url: Planificacion.Integracion.UrlModulo + 'fmpeir/adicionarIndicador',
            method: 'POST',
            params: {
                objeto: Ext.encode(datos),
                metadata: Ext.encode(objeto)
            },
            callback: function(options, success, response) {
                var responseData = Ext.decode(response.responseText);
                if (responseData.success) {
                    (datos['add'] != "") ? mostrarMensaje(1, 'El indicador ha sido adicionado satisfactoriamente.', function() {
                    }) : (datos['mod'] != "") ? mostrarMensaje(1, 'El indicador ha sido modificado satisfactoriamente.', function() {
                    }) : mostrarMensaje(1, 'El indicador ha sido eliminado satisfactoriamente.', function() {
                    });
                } else
                    mostrarMensaje(3, 'Ocurrió un error al realizar la acción solicitada.', function () {
                    });
                stIndicador.reload();
                Secodena.ocultarMascara('mascaraMed');
            }
        })
    }    ,
    adicionarElemento: function(objeto) {
    var stIndicador =  this._getItem('stIndicador');
    var me = this._getItem('indicador');
    var datos = me.gridIndicadores.getChanges();
    Secodena.mostrarMascara('mascaraMed', 'Guardando');
    Ext.Ajax.request({
        url: Planificacion.Integracion.UrlModulo + 'fmpeir/adicionarElemento',
        method: 'POST',
        params: {
            objeto: Ext.encode(datos)
        },
        callback: function(options, success, response) {
            var responseData = Ext.decode(response.responseText);
            if (responseData.success) {
                (datos['add'] != "") ? mostrarMensaje(1, 'El elemento ha sido adicionado satisfactoriamente.', function() {
                }) : (datos['mod'] != "") ? mostrarMensaje(1, 'El elemento ha sido modificado satisfactoriamente.', function() {
                }) : mostrarMensaje(1, 'El elemento ha sido eliminado satisfactoriamente.', function() {
                });
            } else
                mostrarMensaje(3, responseData.mensaje, function () {
                });
            stIndicador.reload();
            Secodena.ocultarMascara('mascaraMed');
        }
    })
},

});
