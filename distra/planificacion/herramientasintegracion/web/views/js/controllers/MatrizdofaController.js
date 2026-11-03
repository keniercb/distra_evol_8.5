/*
 *
 * @copyright XETID Cuba
 * @author ammejias
 * @version 1.0
 */
Ext.ns('Planificacion.Integracion');
Planificacion.Integracion.MatrizdofaController = Ext.extend(Std.Base.Controller, {
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
    guardarDatosFactores: function (me) {

        var objfactores = new DatMatrizdofaModel();
        var gpFactores = this._getItem('gpFactores');
        var data = gpFactores.getSelectionModel().getSelected().data;
        var ambito = me.treeAmbitos.getSelectionModel().getSelectedNode();

        var objeto = {
            idmatrizdofa: data.idmatrizdofa == undefined ? 0 : data.idmatrizdofa,
            idfactor: data.idfactor == undefined ? 0 : data.idfactor,
            idestudiomatriz: me.concepto.idestudiomatriz,
            idambitodofa: ambito.attributes.idambitodofa,
            analista: me.flag,
            idfactorclave: data.idfactorclave,
            denominacion: data.denominacion
        };

        Secodena.mostrarMascara('msgFactor', 'Guardando');

        Ext.Ajax.request({
            url: '/planificacion/herramientasintegracion/index.php/matrizdofa/adicionarmodificarfactor',
            method: 'POST',
            params: {
                objeto: Ext.encode(objeto)

            },
            callback: function (options, success, response) {
                var respuesta = Ext.decode(response.responseText);
                var respo = Ext.decode(options.params.objeto);
                if (respo.idmatrizdofa > 0)
                    var msj = 'El factor ha sido modificado satisfactoriamente.';
                else
                    var msj = 'El factor ha sido adicionado satisfactoriamente.';

                if (respuesta.idmatrizdofa) {
                    Secodena.ocultarMascara('msgFactor');
                    mostrarMensaje(1, msj);
                        gpFactores.getStore().reload({
                            params: {
                                start: 0,
                                limit: 20
                            }
                        });
                } else {
                    mostrarMensaje(3, respuesta.mensaje);
                        Secodena.ocultarMascara('msgFactor');
                        gpFactores.getStore().reload({
                            params: {
                                start: 0,
                                limit: 20
                            }
                        });
                }
            }
        });
    },
    eliminarFactor: function () {
        var gpFactores = this._getItem('gpFactores');
        var data = gpFactores.getSelectionModel().getSelected().data;

        var mensaje = '¿Est&aacute; seguro que desea eliminar el factor seleccionado?';
        mostrarMensaje(2, mensaje, function (btn) {
            if (btn == 'ok') {
                Secodena.mostrarMascara('msgFactorElim', 'Eliminando');
                Ext.Ajax.request({
                    url: '/planificacion/herramientasintegracion/index.php/matrizdofa/eliminarfactor',
                    method: 'POST',
                    params: {
                        objeto: Ext.encode(data)
                    },
                    callback: function (options, success, response) {
                        var msj = 'El factor ha sido eliminado satisfactoriamente.';
                        if (success) {
                            Secodena.ocultarMascara('msgFactorElim');
                            mostrarMensaje(1, msj);
                                gpFactores.getStore().reload({
                                    params: {
                                        start: 0,
                                        limit: 20
                                    }
                                });
                        }
                    }
                });
            }
        });
    },
    guardarEstrategiaOrdenadas: function (objeto) {
        Secodena.mostrarMascara('msgEstrategia1', 'Guardando');
        var arreglo = [];
        Ext.each(objeto.datos.items, function (item) {
            arreglo.push(item.data);
        });
        Ext.Ajax.request({
            url: '/planificacion/herramientasintegracion/index.php/matrizdofa/adicionarmodificarestrategia',
            method: 'POST',
            params: {
                orden: true,
                datos: (arreglo.length==0)?[]:Ext.encode(arreglo),
                eliminadas: (objeto.eliminadas.length==0)?[]:Ext.encode(objeto.eliminadas)

            },
            callback: function (options, success, response) {
                var respo = Ext.decode(response.responseText);
                if (respo.idestrategia > 0)
                    var msj = 'El orden de las estrategias ha sido actualizada satisfactoriamente.';

                if (success) {
                    Secodena.ocultarMascara('msgEstrategia1');
                    mostrarMensaje(1, msj);
                        objeto.st.reload({
                            params: {
                                start: 0,
                                limit: 5,
                                idmatrizdofa:objeto.id
                            }
                        });
                }
            }
        });
    },
    guardarDatosEstrategia: function (me) {
        var gpEstategias = this._getItem('gpEstrategias');
        var data = gpEstategias.getSelectionModel().getSelected().data;
        var ambito = me.arbol.getSelectionModel().getSelectedNode();
        var objeto = {
            idestrategia: data.idestrategia == '' ? 0 : data.idestrategia,
            idambitodofa: ambito.attributes.idambitodofa,
            idmatrizdofa: me.concepto.idestudiomatriz,
            denominacion: data.denominacion,
            analista: me.analista,
            idfactorclave1: me.idfactorclave1,
            idfactorclave2: me.idfactorclave2
        };

        Secodena.mostrarMascara('msgEstrategia', 'Guardando');

        Ext.Ajax.request({
            url: '/planificacion/herramientasintegracion/index.php/matrizdofa/adicionarmodificarestrategia',
            method: 'POST',
            params: {
                objeto: Ext.encode(objeto)

            },
            callback: function (options, success, response) {
                var respo = Ext.decode(options.params.objeto);
                var respuesta = Ext.decode(response.responseText);
                if (respo.idestrategia > 0)
                    var msj = 'La estrategia ha sido modificada satisfactoriamente.';
                else
                    var msj = 'La estrategia ha sido adicionada satisfactoriamente.';

                if (respuesta.idestrategia > 0) {
                    Secodena.ocultarMascara('msgEstrategia');

                        gpEstategias.getStore().reload({
                            params: {
                                start: 0,
                                limit: 5
                            }
                        });

                } else {
                    Secodena.ocultarMascara('msgEstrategia');
                    mostrarMensaje(3, respuesta.mensaje);
                        gpEstategias.getStore().reload({
                            params: {
                                start: 0,
                                limit: 5
                            }
                        });

                }
            }
        });
    },
    eliminarEstrategia: function () {

        var gpEstrategias = this._getItem('gpEstrategias');
        var data = gpEstrategias.getSelectionModel().getSelected().data;

        var mensaje = '¿Est&aacute; seguro que desea eliminar la amenaza seleccionada?';
        mostrarMensaje(2, mensaje, function (btn) {
            if (btn == 'ok') {
                Secodena.mostrarMascara('msgEstrategiaElim', 'Eliminando');
                Ext.Ajax.request({
                    url: '/planificacion/herramientasintegracion/index.php/matrizdofa/eliminarestrategia',
                    method: 'POST',
                    params: {
                        objeto: Ext.encode(data)
                    },
                    callback: function (options, success, responseText) {
                        var responseData = Ext.decode(responseText.responseText);
                        if (success) {
                            Secodena.ocultarMascara('msgEstrategiaElim');
                            mostrarMensaje(1, responseData.mensaje);
                                gpEstrategias.getStore().reload({
                                    params: {
                                        start: 0,
                                        limit: 5
                                    }
                                });
                        }
                    }
                });
            }
        });

    },
    obtenerConfiguracionMatrizDofa: function (idmatrizdofa) {
        var me = this._getItem('objeto');
        Secodena.mostrarMascara('msgProyecto3', 'Cargando');
        Ext.Ajax.request({
            url: '/planificacion/herramientasintegracion/index.php/matrizdofa/obtenerconfiguracionmatrizdofa',
            method: 'POST',
            params: {arreglo: Ext.encode(me.arreglo)},
            callback: function (options, success, response) {
                var responseData = Ext.decode(response.responseText);
                me.reconfigureGrid(responseData);
                Secodena.ocultarMascara('msgProyecto3');
            }
        });
    },
    guardarCruce: function (objeto) {
        var datos = new DatCriterioEstrategia();
        datos.set(objeto.record);
        if (objeto.accion === 'ins') {
            datos.save({accion: objeto.accion});
        } else {
            datos.eliminar();
        }
    },
    exportarResultadoOrdenado: function (objeto, store) {
        var a = [];
        Ext.each(store.items, function (item) {

            a.push(item.data);
        });
        document.getElementById('storedofa').value = Ext.encode(a);
        document.getElementById('narchivodofa').value = objeto.narchivo;
        document.getElementById('farchivodofa').value = objeto.farchivo;
        var formexport = document.getElementById('exportarResultadoOrdenado');
        formexport.action = '/planificacion/herramientasintegracion/index.php/matrizdofa/exportarResultadoOrdenado';
        formexport.submit();
    },
    adicionarIndicador: function(objeto) {
        var stIndicador =  this._getItem('stIndicador');
        var me = this._getItem('indicador');
        var datos = me.gridIndicadores.getChanges();
        Secodena.mostrarMascara('mascaraMed', 'Guardando');
        Ext.Ajax.request({
            url: Planificacion.Integracion.UrlModulo + 'matrizdofa/saveCriterios',
            method: 'POST',
            params: {
                objeto: Ext.encode(datos)
            },
            callback: function(options, success, response) {
                var responseData = Ext.decode(response.responseText);
                if (responseData.success) {
                    (datos['add'] != "") ? mostrarMensaje(1, 'El criterio ha sido adicionado satisfactoriamente.') : (datos['mod'] != "") ? mostrarMensaje(1, 'El criterio ha sido modificado satisfactoriamente.') : mostrarMensaje(1, 'El criterio ha sido eliminado satisfactoriamente.');
                } else
                    mostrarMensaje(3, 'Ocurrió un error al realizar la acción solicitada.');
                stIndicador.reload();
                Secodena.ocultarMascara('mascaraMed');
            }
        })
    },
    ExportarDocumento: function(params) {
        var idestudiomatriz = params.idestudiomatriz;
        var idproyecto = params.idproyecto;
        if (params.descargar) {
            window.location.href = '/planificacion/herramientasintegracion/index.php/matrizdofa/exportarDocumento?idestudiomatriz=' + idestudiomatriz + '&descargar=' + params.descargar+'&idproyecto=' + idproyecto;
        } else {
            Ext.Ajax.request({
                url: '/planificacion/herramientasintegracion/index.php/matrizdofa/exportarDocumento',
                method: 'POST',
                params: {
                    idproyecto: idproyecto,
                    idestudiomatriz: idestudiomatriz,
                    descargar: params.descargar
                },
                callback: function(options, success, response) {
                    var responseData = Ext.decode(response.responseText);
                    Secodena.ocultarMascara('cargarcuestionario1');
                    if (responseData.codMsg == 3)
                        mostrarMensaje(3, 'Ha ocurrido un error al generar el cuestionario a enviar');
                }
            });
        }
    },

    obtenerReporte: function(params){

            obj = {
                view: this,
                path: '/planificacion/herramientasintegracion/index.php/matrizdofa/obtenerReporte',
                baseParams: {
                    idestudiomatriz: params.idestudiomatriz,
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
