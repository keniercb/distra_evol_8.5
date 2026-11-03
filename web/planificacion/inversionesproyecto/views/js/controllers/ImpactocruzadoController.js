/*
 *
 * @copyright XETID Cuba
 * @author ammejias
 * @version 1.0
 */
Ext.namespace('Planificacion.Integracion');
Planificacion.Integracion.ImpactocruzadoController = Ext.extend(Std.Base.Controller, {
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
    guardarVariables: function(ob) {
        //var me = this._getItem('variables');
        var matriz = ob.matriz ? ob.matriz : this._getItem('objeto');
        //var datosVariables = me.gpVariables.getChanges();
        Secodena.mostrarMascara('mascaraMed', 'Guardando');
        Ext.Ajax.request({
            url: '/planificacion/herramientasintegracion/index.php/impactocruzado/guardarVariables',
            method: 'POST',
            params: {
                objeto: Ext.encode(ob.datosVariables),
                idestudio: ob.idestudio ? ob.idestudio : ob.objproyecto.get('idestudiomatrizimpactocruzado')
            },
            callback: function(options, success, response) {
                var result = Ext.decode(response.responseText);
                Secodena.ocultarMascara('mascaraMed');
                if (result.mostrarMens) {
                    mostrarMensaje(1, result.mensaje, function() {
                        if (ob.store)
                            ob.store.reload();
                        matriz.mostrarMatriz({
                            idestudio: ob.idestudio ? ob.idestudio : ob.objproyecto.get('idestudiomatrizimpactocruzado')
                        });
                    });
                } else {
                    (ob.datosVariables['mod'] != '') ?
                            mostrarMensaje(1, 'La variable ha sido modificada satisfactoriamente.', function() {
                                if (ob.store)
                                    ob.store.reload();
                                matriz.mostrarMatriz({
                                    idestudio: ob.idestudio ? ob.idestudio : ob.objproyecto.get('idestudiomatrizimpactocruzado')
                                });
                            }) : ((ob.datosVariables['add'] != "") ? mostrarMensaje(1, 'La variable ha sido adicionada satisfactoriamente.', function() {
                        if (ob.store)
                            ob.store.reload();
                        matriz.mostrarMatriz({
                            idestudio: ob.idestudio ? ob.idestudio : ob.objproyecto.get('idestudiomatrizimpactocruzado')
                        });
                    }) : mostrarMensaje(1, 'La variable ha sido eliminada satisfactoriamente.', function() {
                        if (ob.store)
                            ob.store.reload();
                        matriz.mostrarMatriz({
                            idestudio: ob.idestudio ? ob.idestudio : ob.objproyecto.get('idestudiomatrizimpactocruzado')
                        });
                    }));
                }
            }
        });
    },
    obtenerConfiguracionMatriz: function(ob) {
        var me = this._getItem('objeto');
        Secodena.mostrarMascara('msgProyecto3', 'Cargando');
        Ext.Ajax.request({
            url: '/planificacion/herramientasintegracion/index.php/impactocruzado/obtenerconfiguracionmatriz',
            method: 'POST',
            params: {
                idestudio: ob.idestudio
            },
            callback: function(options, success, response) {
                var responseData = Ext.decode(response.responseText);
                me.reconfigureGrid(responseData);
                Secodena.ocultarMascara('msgProyecto3');
            }
        });
    },
    guardarImpacto: function(objeto) {
        var datos = new DatMatrizImpactoCruzado();
        datos.set(objeto.record);
        datos.save({accion: objeto.accion});
    },
    obtenerDatosGraficoFlujo: function(idestudioimpactocruzado, ids, simplificado) {
        var me = this._getItem('objeto');
        var wind = this._getItem('wresultado');
        if (wind) {
            var maskDiagrama = new Ext.LoadMask(wind.body, {
                msg: "Generando diagrama ..."
            });
        } else
            ;
        if (ids.length > 0) {
            (wind) ? maskDiagrama.show() : Secodena.mostrarMascara('demic', '', 'Generando diagrama...');
            Ext.Ajax.request({
                url: '/planificacion/herramientasintegracion/index.php/impactocruzado/obtenerdatosgraficoflujo',
                method: 'POST',
                params: {
                    idestudioimpactocruzado: idestudioimpactocruzado,
                    idvariables: Ext.encode(ids)
                },
                callback: function(options, success, response) {
                    var responseData = Ext.decode(response.responseText);
                    me.mostrarGrafico(responseData.data, simplificado);
                    (wind) ? maskDiagrama.hide() : Secodena.ocultarMascara('demic');
                }
            });
        } else {
            Secodena.Mensajeria.Utiles.mostrarMensajeFlotante.msg('', 'Seleccione al menos una variable.', 3);
        }
    },
    exportarResultadoImpacto: function(denominacion, objeto, b) {
        var a = [];
        var store = this._getStore('stmatrizresultado');
        Ext.each(store.data.items, function(item) {

            a.push(item.data);
        });
        var cad = denominacion;
        document.getElementById('denominacionimp').value = cad;
        document.getElementById('storeimp').value = Ext.encode(a);
        document.getElementById('narchivoimp').value = objeto.narchivo;
        document.getElementById('farchivoimp').value = objeto.farchivo;
        var formexport = document.getElementById('exportarResultadoImpacto');
        formexport.action = '/planificacion/herramientasintegracion/index.php/impactocruzado/exportarResultadoImpacto';
        formexport.submit();
    },

    obtenerImageBase64: function () {

        var canvas = this._getItem('objeto').network.canvas.body.container.children[0].canvas;
        var base64 = canvas.toDataURL("image/png");
        return base64;
    },

    obtenerImageBase64: function () {

        var canvas = this._getItem('objeto').network.canvas.body.container.children[0].canvas;
        var base64 = canvas.toDataURL("image/png");
        return base64;
    },

    obtenerReporte: function(params){


        obj = {
            view: this,
            path: '/planificacion/herramientasintegracion/index.php/impactocruzado/obtenerReporte',
            baseParams: {
                tipo: params.type,
                data: params.type != 'matriz' ? params.data : params.idestudio,
                image: params.type != 'matriz' ? params.image : undefined,
                denominacion: params.denominacion,
                exportFormat:['RTF','PDF']
            },
            fnFailure : function () {
                mostrarMensaje(1, 'Por favor haga la configuraci&oacute;n del usuario.');
            }
        };

        reportesge.create(obj);

    }
});
