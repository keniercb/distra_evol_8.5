/*
 *
 * @copyright XETID Cuba
 * @author ammejias
 * @version 1.0
 */

Planificacion.Integracion.FmpeirmatrizController = Ext.extend(Std.Base.Controller, {
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
    guardarDatos: function (obj) {
        Secodena.mostrarMascara('indicador', '', 'Guardando datos');
        Ext.Ajax.request({
            url: Planificacion.Integracion.UrlModulo + 'fmpeirmatriz/guardarDatos',
            params: {
                descripcion: obj.taDescripcion.getValue(),
                idproyecto: obj.idproyecto
            },
            success: function (resp, obje) {
                var responseData = Ext.decode(resp.responseText);
                //Oculto la mascara de espera para la accion eliminar
                Secodena.ocultarMascara('indicador');
                if (responseData.success) {
                    var msg = '';
                    msg = 'Los datos han sido guardados satisfactoriamente.';
                    mostrarMensaje(1, msg, function () {
                        obj.initValidatorIndicadores();
                    });
                }
                else
                    mostrarMensaje(3, 'Ocurrió un error al realizar la acción solicitada.', function () {
                    });
            },
            failure: function (resp, obj) {
                Secodena.ocultarMascara('indicaciones');
                mostrarMensaje(3, 'Ocurrió un error al realizar la acción solicitada.', function () {
                });
            }
        })
        ;

    },
    adicionarmatrizlogica: function (objeto) {
        Secodena.mostrarMascara('indicador', '', 'Guardando datos de la integración');
        Ext.Ajax.request({
            url: Planificacion.Integracion.UrlModulo + 'fmpeirmatriz/adicionarmatrizlogica',
            params: {
                data: Ext.encode({
                    idfuerzamotriz: objeto.idfuerzamotriz,
                    idelementopeir: objeto.idelementopeir,
                    idproyecto: objeto.idproyecto,
                    orden: objeto.orden,
                    record: objeto.record,
                    valor: objeto.valor,
                    delete: objeto.delete ? objeto.delete : false,
                    idindicadorfmpeir: objeto.idindicadorfmpeir
                })
            },
            success: function (resp, obj) {
                var responseData = Ext.decode(resp.responseText);
                //Oculto la mascara de espera para la accion eliminar
                Secodena.ocultarMascara('indicador');
                if (responseData.success) {
                    var msg = '';
                    if (objeto.delete) {
                        msg = 'El elemento ha sido eliminado satisfactoriamente.';
                    } else if (objeto.record.idelementopeir) {
                        msg = 'El indicador ha sido modificado satisfactoriamente.';
                    } else {
                        msg = 'El indicador ha sido integrado satisfactoriamente.';
                    }
                    mostrarMensaje(1, msg, function () {
                        objeto.store.reload();
                    });
                }
                else
                    mostrarMensaje(3, 'Ocurrió un error al realizar la acción solicitada.', function () {
                    });
            },
            failure: function (resp, obj) {
                Secodena.ocultarMascara('indicaciones');
                mostrarMensaje(3, 'Ocurrió un error al realizar la acción solicitada.', function () {
                });
            }
        })
        ;

    },
    exportarResultadoMatriz: function (denominacion, objeto, store, idproyecto) {
        var a = [];
        Ext.each(store.items, function (item) {

            a.push(item.data);
        });

        var cad = " Matriz de integraci&oacute;n l&oacute;gica del estudio: " + denominacion;
        document.getElementById('denominacion').value = cad;
        document.getElementById('store').value = Ext.encode(a);
        document.getElementById('narchivo').value = objeto.narchivo;
        document.getElementById('farchivo').value = objeto.farchivo;
        var formexport = document.getElementById('exportarResultadoMatriz');
        formexport.action = '/planificacion/herramientasintegracion/index.php/fmpeirmatriz/exportarResultadoMatriz';
        formexport.submit();
    },

    obtenerReporte: function (params) {

        obj = {
            view: this,
            path: '/planificacion/herramientasintegracion/index.php/fmpeirmatriz/obtenerReporte',
            baseParams: {
                idproyecto: params.idproyecto,
                denominacion: params.denominacion,
                descripcion: params.descripcion
            },
            fnFailure: function () {
                mostrarMensaje(1, 'Por favor haga la configuraci&oacute;n del usuario.');
            }
        };

        reportesge.create(obj);

    }
})
;
