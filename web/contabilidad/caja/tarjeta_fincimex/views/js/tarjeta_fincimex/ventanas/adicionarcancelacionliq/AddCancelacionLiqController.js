Ext.namespace('Ext.GestionarTarjetaAddCanLiq');
Ext.GestionarTarjetaAddCanLiq.Controller = Ext.extend(Ext.Component, {
    lmask: undefined,
    url: undefined,
    etiquetas: undefined,
    objVentana: undefined,
    constructor: function(params)
    {
        this.crearSetsAndGets();
        // this.setIdAnticipoFincimex(params.idanticipofincimex);
        this.loadMessageBox = params.loadMessageBox;
        this.setUrl(params.url);
        this.setEtiquetas(params.etiquetas);
        this.setFechaInicio(params.fechaInicio);
        this.setFechaActual(params.fechaActual);
        this.setFechaFin(params.fechaFin);
        this.setModoVentana(params.modo);
        this.setAjaxCalls(params.ajaxCalls);
        this.setIdCaja(params.idCaja);
        this.loadMessageBox();

        requireJS.loadJsArray([
            {
                url: params.url + 'ventanas/adicionarcancelacionliq/AddCancelacionLiqView',
                id: 'TajertaAddCanLiqView',
            },
            {
                url: params.url + 'ventanas/adicionarcancelacionliq/AddCancelacionLiqModel',
                id: 'TajertaAddCanLiqModel',
            },
            {
                url: "/contabilidad/comun/js/FormSteps",
                id: 'FormSteps'
            },
        ], function () {
            this.initComponentTarjetaAddAnt();
        }.bind(this));

        Ext.GestionarTarjetaAddCanLiq.Controller.superclass.constructor.call(this);
        this.addEvents({
            'loadDataComprobanteCancelarLiquidacion': true
        });
    },
    initComponentTarjetaAddAnt: function()
    {
        var modelo = new Ext.GestionarTarjetaAddCanLiq.Model();
        var ventana = new Ext.GestionarTarjetaAddCanLiq.View(modelo, {
            etiquetas: this.getEtiquetas(),
            modo: this.getModoVentana()
        });
        this.setModelo(modelo);
        this.setVentana(ventana);
        this.crearFunciones(ventana, modelo);
        this.crearEventos(ventana, modelo);
        this.loadDataComponent(ventana, modelo);
    },
    loadDataComponent: function(ventana, model)
    {
        var modo = this.getModoVentana();
        if (modo === 'add') {
            this.iniciarModoAdicionar(ventana, model);
        } else if (modo === 'mod') {
            this.iniciarModoModificar(ventana, model);
        } else if (modo === 'ver') {
            this.iniciarModoVer(ventana, model);
        }
    },
    crearEventos: function(ventana, model)
    {

        ventana.on({
            scope: this,
            close: function () {
                this.fireEvent('close');
            }
        });

        ventana.getGridLiquidaciones().getSelectionModel().on({
            scope: this,
            selectionchange: function (sel) {
                this.gridLiquidacionesOnSelect();
            }
        });

        // //saveRecargaFincimex
        ventana.on({
            scope: this,
            FormStepsCreado: function (formStep) {
                formStep.on({
                    scope: this,
                    Crear: function (fnCallback, cerrarVentana) {
                        this.saveCancelarLiqFincimex();
                    }
                });
            }
        });

    },
    crearFunciones: function(ventana, model)
    {
        var ajax = this.getAjaxCalls();

        // this.obtenerDatosAnticiposFincimex = function (fnCallback) {
        //     if (this.getIdAnticipoFincimex()) {
        //         var ajax = this.getAjaxCalls();
        //         var params = {
        //             scope: this,
        //             params: {
        //                 idoperaciontarjeta: this.getIdAnticipoFincimex()
        //             }
        //         };
        //         ajax.cargarDatosAnticiposFincimexById(params, fnCallback);
        //     } else {
        //         console.log('No hay idrecargafincimex');
        //     }
        // };

        this.iniciarModoAdicionar = function () {
            Ext.MessageBox.hide();
            ventana.show();
            ventana.getGridLiquidaciones().getStore().baseParams.idcaja = this.getIdCaja();
            ventana.getGridLiquidaciones().getStore().load();
            ventana.crearFormSteps();
        };

        this.iniciarModoVer = function () {

        };

        this.saveCancelarLiqFincimex = function (fnCallback, cerrarVentana) {
            this.loadMessageBox();
            var records = this.recordsConImporte();
            var liquidacionesACancelar = [];
            var idoperacion = records[0].get('idoperacion');
            // var fechaoper = ventana.getDfFechaOperacion().getValue().toLocaleDateString();

            records.forEach(function (item, i) {
                liquidacionesACancelar.push({
                    idsync: item.get('idsync'),
                    idtarjeta: item.get('idtarjeta'),
                    idmovimiento: item.get('idmovimiento'),
                    iddocumento: item.get('iddocumento'),
                    importemo: item.get('importeant'),
                    idestado: item.get('idestado')
                });
            });


            var params = {
                idcaja: this.getIdCaja(),
                idoperacion: idoperacion,
                liquidacionesacancelar: Ext.encode(liquidacionesACancelar)
            };

            this.fireEvent('loadDataComprobanteCancelarLiquidacion', params, function () {
                ventana.close();
            });

            // var fn = function (options, success, response) {
            //     var responde = Ext.decode(response.responseText);
            //     if (success) {
            //         if (cerrarVentana) {
            //             ventana.close();
            //         }
            //         if (responde.codMg == 1) {
            //             // if (typeof fnCallback === 'function') {
            //             //     fnCallback.call(undefined, responde.idoperaciontarjeta);
            //             // }
            //             mostrarMensaje(1, 'La opeacion ha sido creada satisfactoriamente.');
            //         } else {
            //             mostrarMensaje(1, 'Algo salio mal.');
            //         }
            //     }
            //     Ext.MessageBox.hide();
            // };
            //
            // ajax.saveAnticiposFincimex(params, fn);
        };

        this.recordsConImporte = function () {
            var records = ventana.getGridLiquidaciones().getSelectionModel().getSelections();
            // var recordsconimporte = [];
            // records.forEach(function (item, i) {
            //     if (item.get('importe') > 0) {
            //         recordsconimporte.push(item);
            //     }
            // });
            return records;
        };

        this.gridLiquidacionesOnSelect = function () {
            var recordscheck = [];
            var records = this.recordsConImporte();
            //si esta desordenado puede causar que falle lo que intento hacer mas abajo en el otro comentario
            records.sort(function (a, b) {
                return a.id - b.id;
            });
            records.forEach(function (item, i) {
                //esto es pa poder saber si han sido modificados
                recordscheck.push(
                    '' + item.get('idtarjeta') + '@' + item.get('idmovimiento')
                );
            });
            ventana.getTfCheck().setValue(recordscheck.toString());
        };

        this.habilitarDesabilitarCampos = function (flag) {
            if (flag) {
                ventana.getGridLiquidaciones().resumeEvents();
            } else {
                ventana.getGridLiquidaciones().suspendEvents();
            }

        };

    },
    crearSetsAndGets: function () {

        this.setVentana = function (ventana) {
            this.objVentana = ventana;
        };

        this.getVentana = function () {
            return this.objVentana;
        };

        this.setModelo = function (modelo) {
            this.objModel = modelo;
        };

        this.getModelo = function () {
            return this.objModel;
        };

        this.setIdCaja = function (idcaja) {
            this.idCaja = idcaja;
        };

        this.getIdCaja = function () {
            return this.idCaja;
        };

        this.setEtiquetas = function (etiquetas) {
            this.etiquetas = etiquetas;
        };

        this.getEtiquetas = function () {
            return this.etiquetas;
        };

        this.setAjaxCalls = function (ajaxCalls) {
            this.ajaxCalls = ajaxCalls;
        };

        this.getAjaxCalls = function () {
            return this.ajaxCalls;
        };

        this.setUrl = function (url) {
            this.url = url;
        };

        this.getUrl = function () {
            return this.url;
        };

        this.setModoVentana = function (modo) {
            //add mod ver -- son los modos
            this.modo = modo;
        };

        this.getModoVentana = function () {
            return this.modo;
        };

        this.setFechaInicio = function (fechaInicio) {
            this.fechaInicio = fechaInicio;
        };

        this.getFechaInicio = function () {
            return this.fechaInicio;
        };

        this.setFechaActual = function (fechaActual) {
            this.fechaActual = fechaActual;
        };

        this.getFechaActual = function () {
            return this.fechaActual;
        };

        this.setFechaFin = function (fechaFin) {
            this.fechaFin = fechaFin;
        };

        this.getFechaFin = function () {
            return this.fechaFin;
        };

        // this.setIdAnticipoFincimex = function (idAnticipoFincimex) {
        //     this.idAnticipoFincimex = idAnticipoFincimex;
        // };
        //
        // this.getIdAnticipoFincimex = function () {
        //     return this.idAnticipoFincimex;
        // };

    }
});
