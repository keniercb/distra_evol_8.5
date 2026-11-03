/**
 * Clase controladora para los componentes comunes de Politica y Estrategia
 * @copyright XETID Cuba
 * @author Ing. Frank David Corona Prendes
 * @version 1.0
 */
Planificacion.Integracion.PyecomunController = Ext.extend(Std.Base.Controller, {
    constructor: function () {

        var config = {
            labels: Planificacion.Integracion.Etiquetas,
            globals: {
                dirImg: Planificacion.Integracion.Imagenes
            }
        };
        this.init(config);
    },
    mostrarAyuda: function (referencia) {
        var title = 'Ayuda';
        help.show(title, referencia);
    },
    guardarDatosProyectosXConcepto: function () {
        var me = this._getItem('proyecto1');
        var datosProyectos = me.gpProyecto.getChanges();
        Secodena.mostrarMascara('msgProyecto2', 'Guardando');
        Ext.Ajax.request({
            url: '/planificacion/herramientasintegracion/index.php/integracioncomun/saveproyecto',
            method: 'POST',
            params: {objeto: Ext.encode(datosProyectos), concepto: Ext.encode(me.concepto)},
            callback: function (options, success, response) {
                var responseData = Ext.decode(response.responseText);
                me.fireEvent('newproyecto', response);
                Secodena.ocultarMascara('msgProyecto2');
                mostrarMensaje(responseData.tipo, responseData.mensaje, function() {
                    if(responseData.cargar == 1){
                        me.stProyecto.reload({params: {concepto: Ext.encode(me.concepto), start: 0, limit: 20}});
                    }
                });
            }
        });
    },
    obtenerDatosOrganigrama: function(idproyecto) {
        var me = this._getItem('objeto');
        Secodena.mostrarMascara('msgProyecto4', 'Guardando');
        Ext.Ajax.request({
            url: '/planificacion/herramientasintegracion/index.php/pyecomun/obtenerdatosorganigrama',
            method: 'POST',
            params: {objefecto: Ext.encode(me.objefecto)},
            callback: function(options, success, response) {
                var responseData = Ext.decode(response.responseText);
                Secodena.ocultarMascara('msgProyecto4');
                me.mostrarGrafico(responseData.data);
            }
        });
    }
});