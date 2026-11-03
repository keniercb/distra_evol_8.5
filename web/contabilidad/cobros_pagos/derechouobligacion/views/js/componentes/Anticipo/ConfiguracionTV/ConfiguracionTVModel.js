Ext.namespace('Ext.ConfiguracionTV');
Ext.ConfiguracionTV.Model = Ext.extend(Ext.Component, {
    tipo: undefined,
    constructor: function(params)
    {
        this.tipoDuo = params.tipoDuo;
        this.initializeModel();
        Ext.ConfiguracionTV.Model.superclass.constructor.call(this);
    },
    initializeModel: function () {
        this.initializeRecords();
        this.initializeReaders();
        this.initializeStores();
        this.initializeGetFn();
        this.initializeAjaxCalls();
    },
    initializeRecords: function () {

        this.recordContabilizarOperacion = new Ext.data.Record.create([
            {name: 'idnomoperaciones', mapping: 'idnomoperaciones'},
            {name: 'denominacion', mapping: 'denominacion'},
        ]);

        this.recordCuentaOperacion = new Ext.data.Record.create([
            {name: 'idcuenta', mapping: 'idcuenta'},
            {name: 'text', mapping: 'text'},
        ]);

        this.recordCliente = new Ext.data.Record.create([
            {name: 'idclientesproveedores', mapping: 'idclientesproveedores'},
            {name: 'nombre', mapping: 'nombre'},
            {name: 'cobrospagos', mapping: 'cobrospagos'},
        ]);

        this.recordTipo = new Ext.data.Record.create([
            {name: 'iddoc', mapping: 'iddoc'},
            {name: 'denominacion', mapping: 'denominacion'},
        ]);

        this.recordCuenta = new Ext.data.Record.create([
            {name: 'idcuenta', mapping: 'idcuenta'},
            {name: 'idmoneda', mapping: 'idmoneda'},
            {name: 'text', mapping: 'nombrecuenta'},
        ]);

    },
    initializeReaders: function () {

        this.rdContabilizarOperacion = new Ext.data.JsonReader({
            id: 'idnomoperaciones'
        }, this.recordContabilizarOperacion)

        this.rdCuentaOperacion = new Ext.data.JsonReader({
            root: 'datos'
        }, this.recordCuentaOperacion);

        this.rdCliente = new Ext.data.JsonReader({
            root: 'datos',
            totalProperty: 'cantidad',
            id: 'idestructuracliente'
        }, this.recordCliente);

        this.rdTipo = new Ext.data.JsonReader({
            root: 'datos',
            id: 'iddoc',
            totalproperty: 'totalRecords'
        }, this.recordTipo);

        this.rdCuenta = new Ext.data.JsonReader({
            totalproperty: 'totalRecords',
            id: 'id'
            }, this.recordCuenta
        );

    },
    initializeStores: function () {

        this.stContabilizarOperacion = new Ext.data.Store({
            url: 'loadDataOperacion',
            reader: this.rdContabilizarOperacion
        });

        this.stCuentaOperacion = new Ext.data.Store({
            url: "/contabilidad/cobros_pagos/derechouobligacion/index.php/gestionarduofn/loadDataCuenta",
            autoLoad: false,
            reader: this.rdCuentaOperacion
        });

        this.stCliente = new Ext.data.Store({
            url: 'cargarclientes',
            sortInfo: {
                field: "nombre",
                direction: "ASC"
            },
            baseParams: {tipoDuo: this.tipoDuo},
            reader:this.rdCliente
        });

        this.stTipo = new Ext.data.Store({
            url: 'cargartipoinstrumento',
            autoLoad: true,
            sortInfo: {
                field: "denominacion",
                direction: "ASC"
            },
            reader: this.rdTipo
        });

        this.stCuenta = new Ext.data.Store({
            url: 'cargararbolcuenta',
            reader: this.rdCuenta,
            sortInfo: {
                field: "text",
                direction: "ASC"
            }
        });

    },
    initializeGetFn: function () {

        this.getStoreContabilizarOperacion = function () {
            return this.stContabilizarOperacion;
        };

        this.getStoreCuentaOperacion = function () {
            return this.stCuentaOperacion;
        };

        this.getStoreCliente = function () {
            return this.stCliente;
        };

        this.getStoreTipo = function () {
            return this.stTipo;
        };

        this.getStoreCuenta = function () {
            return this.stCuenta;
        };

    },
    initializeAjaxCalls: function (parametros, parametrosAdicionales) {

        this.cargarEtiquetas = function (parametrosAdicionales, callbackFunction) {
            var parametros = {
                method: "POST",
                url: "cargaretiquetas",
                callback: callbackFunction //options, success, response
            };
            this.ajaxCall(parametros, parametrosAdicionales);
        };

        this.buscarFechaContable = function (parametrosAdicionales, callbackFunction) {
            var parametros = {
                method: "POST",
                url: "buscarfechacontable",
                callback: callbackFunction //options, success, response
            };
            this.ajaxCall(parametros, parametrosAdicionales);
        };

        this.cargarDatos = function (parametrosAdicionales, callbackFunction) {
            var parametros = {
                method: "POST",
                url: "cagarConfiguracionTvAnt",
                callback: callbackFunction //options, success, response
            };
            this.ajaxCall(parametros, parametrosAdicionales);
        };

        this.salvarConfiguracion = function (parametrosAdicionales, callbackFunction) {
            var parametros = {
                method: "POST",
                url: "salvarConfiguracionTvAnt",
                callback: callbackFunction //options, success, response
            };
            this.ajaxCall(parametros, parametrosAdicionales);
        };

    },
    ajaxCall: function (parametros, parametrosAdicionales) {
        if (typeof parametrosAdicionales === 'object') {
            Ext.applyIf(parametros, parametrosAdicionales);
        }
        Ext.Ajax.request(parametros);
    }
});