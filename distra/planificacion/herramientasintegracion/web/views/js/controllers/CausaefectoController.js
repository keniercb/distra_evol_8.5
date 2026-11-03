/**
 * Fichero que contiene el objeto controller del componente Causa y Efecto.
 *
 * @author ohgonzalez
 * @version 1.0
 */
Planificacion.Integracion.CausaefectoController = Ext.extend(Std.Base.Controller, {
    constructor: function() {
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
    generarDiagrama: function(objEfecto) {
        var view = this._getItem('causaefectoTabPanel');
        Ext.Ajax.request({
            url: Planificacion.Integracion.UrlModulo + 'causaefecto/generarDiagrama',
            params: {
                objeto: Ext.encode(objEfecto)
            },
            callback: function(options, success, response) {
                if (success) {
                    var data = Ext.decode(response.responseText);
                    view.fishbone(data);
                }
            }
        });
    },
    listarCausas: function(objEfecto, msg, panel, onlyHojas) {
        var view = this._getItem('causaefectoTabPanel');

        Ext.Ajax.request({
            url: Planificacion.Integracion.UrlModulo + 'causaefecto/listarCausa',
            params: {
                objeto: Ext.encode(objEfecto), onlyHojas: onlyHojas
            },
            callback: function(options, success, response) {
                if (success) {
                    var data = Ext.decode(response.responseText);
                    if (panel) {
                        var causas = [];
                        Ext.each(data, function(a) {
                            Ext.each(a, function(c) {
                                causas.push(c);
                            });
                        });
                        panel.fireEvent('causas', causas);
                    } else
                        view.listarCausas(data, 'categoria', null);
                }
                if (msg !== '') {
                    Secodena.Mensajeria.Utiles.mostrarMensajeFlotante.msg('', msg, 1);
                    mostrarMensaje(1, msg, function() {
                    })
                }
            }
        });
    },
    cargarArbolCausa: function(type, idcategoria, idcausa, msg) {
        var view = this._getItem('causaefectoTreePanel');
        Ext.Ajax.request({
            url: Planificacion.Integracion.UrlModulo + 'causaefecto/cargarArbolCategoria',
            params: {
                type: type,
                idcategoria: idcategoria,
                idcausa: idcausa
            },
            callback: function(options, success, response) {
                if (success) {
                    var data = Ext.decode(response.responseText);
                    view.cargarArbolCausa(data, type, idcausa);
                }
                if (msg !== '') {
                    mostrarMensaje(1, msg, function() {
                    });
                }
            }
        });
    },
    buscarCategoria: function(denominacion, idefecto) {
        var view = this._getItem('causaefectoFormPanel');
        Ext.Ajax.request({
            url: Planificacion.Integracion.UrlModulo + 'causaefecto/buscarCategoria',
            params: {
                denominacion: denominacion,
                idefecto: idefecto
            },
            callback: function(options, success, response) {
                if (success) {
                    var data = Ext.decode(response.responseText);
                    view.buscarCategoria(data);
                }
            }
        });
    },
    buscarCausa: function(denominacion, idefecto, idcategoria) {
        var view = this._getItem('causaefectoFormPanel');
        Ext.Ajax.request({
            url: Planificacion.Integracion.UrlModulo + 'causaefecto/buscarCausa',
            params: {
                denominacion: denominacion,
                idefecto: idefecto,
                idcategoria: idcategoria
            },
            callback: function(options, success, response) {
                if (success) {
                    var data = Ext.decode(response.responseText);
                    view.buscarCausa(data);
                }
            }
        });
    },
	obtenerReporte: function(params){
        obj = {
            view: this,
            path: '/planificacion/herramientasintegracion/index.php/causaefecto/obtenerReporte',
            baseParams: {
                idefecto: params.idefecto,
                idestudiocausaefecto: params.idestudiocausaefecto,
                denominacion: params.denominacion,
                denominacioncausa: params.denominacioncausa,
                exportFormat:['RTF','PDF']
            },
            fnFailure : function () {
                mostrarMensaje(1, 'Por favor haga la configuraci&oacute;n del usuario.');
            }
        };

        reportes.create(obj);

    }    
});


