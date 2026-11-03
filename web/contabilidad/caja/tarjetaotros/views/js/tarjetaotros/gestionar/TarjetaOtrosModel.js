Ext.namespace('Ext.GestionarTarjetaOtros');
Ext.GestionarTarjetaOtros.Model = Ext.extend(Ext.Component, {
    tipoDuo: undefined,
    constructor: function(params)
    {
        this.initializeModel();
        Ext.GestionarTarjetaOtros.Model.superclass.constructor.call(this);
    },
    initializeModel: function () {
        this.initializeRecords();
        this.initializeReaders();
        this.initializeStores();
        this.initializeGetFn();
        this.initializeAjaxCalls();
    },
    initializeRecords: function () {

        this.recordGridRecarga = new Ext.data.Record.create([
            {name: 'idtarjetaobligacion', mapping: 'idtarjetaobligacion'},
            {name: 'idpersona', mapping: 'responsable'},
            {name: 'nombrecompleto', mapping: 'nombrecompleto'},
            {name: 'estado', mapping: 'estado'},
            {name: 'idcomprobante', mapping: 'idcomprobante'},
            {name: 'fechacontable', mapping: 'fechacontable'},
            {name: 'fechasistema', mapping: 'fechasistema'},
            // {name: 'idanticipo', mapping: 'idanticipo'},
            {name: 'idoperacion', mapping: 'idoperacion'},
            {name: 'comentario', mapping: 'comentario'},
            {name: 'numcomprobante', mapping: 'numcomprobante'},
            {name: 'importet', mapping: 'importet'},
            {name: 'showCmp', mapping: 'showCmp'}
        ]);

        this.recordProveedor = new Ext.data.Record.create([
            {name: 'nombre'},
            {name: 'idclientesproveedores'}
        ]);
        this.recordCuentaProveedor = new Ext.data.Record.create([
            {name: 'idcuenta'},
            {name: 'text'},
            {name: 'idmoneda'},
            {name: 'codigo'}
        ]);

    },
    initializeReaders: function () {

        this.rdGridRecarga = new Ext.data.JsonReader({
                root: 'datos',
                totalProperty: 'cantidad_filas'
            },
            this.recordGridRecarga
        );

        this.rdProveedor = new Ext.data.JsonReader({
                totalProperty: 'total',
                root: 'data'
            },
            this.recordProveedor
        );
        this.rdCuentaProveedor = new Ext.data.JsonReader({
                root: 'datos'
            },
            this.recordCuentaProveedor
        );

        this.stProveedor = new Ext.data.Store({
            url: 'getProveedores',
            reader: this.rdProveedor,
            autoLoad: false
        });

        this.stCuentaProveedor = new Ext.data.Store({
            url: 'cargarCuentas',
            autoLoad: false,
            reader: this.rdCuentaProveedor
        });

    },
    initializeStores: function () {

        this.stGridRecarga = new Ext.data.Store({
            url: 'cargarGridTarjetaObligacion',
            reader: this.rdGridRecarga,
            autoLoad: false
        });

    },
    initializeGetFn: function () {

        this.getStoreRecarga = function () {
            return this.stGridRecarga;
        };

        this.getStoreProveedor = function () {
            return this.stProveedor;
        };
        this.getStoreCuentaProveedor = function () {
            return this.stCuentaProveedor;
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

        this.loadDataInit = function (parametrosAdicionales, callbackFunction) {
            var parametros = {
                method: "POST",
                url: "loadDataIni",
                callback: callbackFunction //options, success, response
            };
            this.ajaxCall(parametros, parametrosAdicionales);
        };

        this.guardarProveedor = function (parametrosAdicionales, callbackFunction) {
            var parametros = {
                method: "POST",
                url: "saveProveedor",
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