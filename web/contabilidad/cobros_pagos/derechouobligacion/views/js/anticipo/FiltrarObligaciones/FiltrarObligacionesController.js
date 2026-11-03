Ext.namespace('Ext.ClassFiltrarObligaciones');
Ext.ClassFiltrarObligaciones.Controller = Ext.extend(Ext.Component, {
    lmask: undefined,
    url: '/contabilidad/cobros_pagos/derechouobligacion/views/js/anticipo/FiltrarObligaciones/',
    etiquetas: undefined,
    objVentana: undefined,
    sumaControl: 0,
    constructor: function(params)
    {
        this.crearSetsAndGets();

        // this.setIdTarjetaObligacion(params.idtarjetaobligacion);

        this.loadMessageBox = params.loadMessageBox;
        this.tipoDuo = params.tipo;
        this.etiquetas = params.etiquetas;
        this.parametrosBase = params.parametrosBase;
        this.records = params.records;
        this.dataRecord = params.dataRecord;
        this.loadMessageBox();

        requireJS.loadJsArray([
            {
                url: this.url + 'FiltrarObligacionesView',
                id: 'FiltrarObligacionesView',
            },
            {
                url: this.url + 'FiltrarObligacionesModel',
                id: 'FiltrarObligacionesModel',
            }
        ], function () {
            this.initComponentController();
        }.bind(this));

        Ext.ClassFiltrarObligaciones.Controller.superclass.constructor.call(this);
        this.addEvents({
            'close': true,
            'adicionar': true
        });
    },
    initComponentController: function()
    {
        var modelo = new Ext.ClassFiltrarObligaciones.Model({
            tipoDuo: this.tipo,
            baseParams: this.parametrosBase,
            dataRecord: this.dataRecord
        });
        var ventana = new Ext.ClassFiltrarObligaciones.View(modelo, {
            etiquetas: this.getEtiquetas(),
            tipoDuo: this.tipo,
            baseParams: this.parametrosBase
        });
        this.setModelo(modelo);
        this.setVentana(ventana);
        this.crearFunciones(ventana, modelo);
        this.crearEventos(ventana, modelo);
        this.loadDataComponent(ventana, modelo);
    },
    loadDataComponent: function(ventana, model)
    {
        Ext.MessageBox.hide();
        if (this.records.length) {
            ventana.getGridDatos().getStore().add(this.records);
        }
        ventana.show();
        model.getStoreGridBuscarLiquidar().load();
    },
    crearEventos: function(ventana, model)
    {
        var me = this;
        ventana.on({
            scope: this,
            close: function () {
                this.fireEvent('close');
            }
        });

        ventana.getBtnAceptar().on({
            scope: this,
            click: function () {
                var stDatos = ventana.getGridDatos().getStore();

                me.fireEvent('adicionar', stDatos.getRange());
                ventana.close();
            }
        });

        ventana.getBtnAddADatos().on({
            scope: this,
            click: function () {
                var sm = ventana.getGridBuscar().getSelectionModel();
                var stDatos = ventana.getGridDatos().getStore();
                var records = sm.getSelections();
                for (var i = 0; i < records.length; i++) {
                    if (stDatos.find('idduo', records[i].get('idduo')) !== -1) {
                        // mostrarMensaje(1, 'Ya se encuentra adicionado');
                    } else {
                        ventana.getGridDatos().getStore().addSorted(records[i]);
                    }
                }
                this.actualizarResto(ventana.getGridDatos().getStore());
            }
        });

        ventana.getBtnEliminarDatos().on({
            scope: this,
            click: function () {
                var sm = ventana.getGridDatos().getSelectionModel();
                var records = sm.getSelections();
                for (var i = 0; i < records.length; i++) {
                    ventana.getGridDatos().getStore().remove(records[i]);
                }
                this.actualizarResto(ventana.getGridDatos().getStore());
            }
        });

        ventana.getGridBuscar().getSelectionModel().on({
            selectionchange: function (sm) {
                if (sm.getSelected()) {
                    ventana.getBtnAddADatos().enable();
                } else {
                    ventana.getBtnAddADatos().disable();
                }
            }
        });

        ventana.getGridDatos().getSelectionModel().on({
            selectionchange: function (sm) {
                if (sm.getSelected()) {
                    ventana.getBtnEliminarDatos().enable();
                } else {
                    ventana.getBtnEliminarDatos().disable();
                }
            }
        });

        ventana.getGridDatos().on({
            scope: this,
            afteredit: function (e) {
                if (e.value > parseFloat(e.record.get('ipendientes'))) {
                    var importe = parseFloat(e.record.get('ipendientes'));
                    e.record.set('ipagar', importe);
                    e.record.commit();
                    mostrarMensaje(1, 'El importe a liquidar no puede ser mayor que el importe pendiente');
                }
                this.actualizarResto(ventana.getGridDatos().getStore());
            }
        });

    },
    crearFunciones: function(ventana, model)
    {

        this.actualizarResto = function (store) {
            var arrRecords = store.getRange();
            var total = 0;
            arrRecords.forEach(function (element, index, arr) {
                total += element.get('ipagar');
            }, this);
            this.sumaControl = parseFloat(total).toFixed(2);
            ventana.getLabelTotal().setText(formatoMoneda(this.sumaControl));
        };

    },
    crearSetsAndGets: function()
    {
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
    }
});
