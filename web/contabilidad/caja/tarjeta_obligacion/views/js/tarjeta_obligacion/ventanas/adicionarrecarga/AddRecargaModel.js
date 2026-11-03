Ext.namespace('Ext.GestionarTarjetaAddRecarga');
Ext.GestionarTarjetaAddRecarga.Model = Ext.extend(Ext.Component, {
    tipoDuo: undefined,
    constructor: function(idcaja)
    {
        this.idcaja = idcaja;
        this.initializeModel();
        Ext.GestionarTarjetaAddRecarga.Model.superclass.constructor.call(this);
    },
    initializeModel: function () {
        this.initializeRecords();
        this.initializeReaders();
        this.initializeStores();
        this.initializeGetFn();
        this.initializeAjaxCalls();
    },
    initializeRecords: function () {

        this.recordPersona = new Ext.data.Record.create([
            {name: 'idpersona'},
            {name: 'nombre'},
            {name: 'numid'},
            {name: 'cargo'}
        ]);

        this.recordOperacion = new Ext.data.Record.create([
            {name: 'idnomoperaciones'},
            {name: 'denominacion'},
            {name: 'idCuentaProveedor'}
        ]);

        this.recordGridRecarga = new Ext.data.Record.create([
            {name: 'idtarjeta', mapping: 'idtarjeta'},
            {name: 'idrecargaobligacion', mapping: 'idrecargaobligacion'},
            {name: 'numtarjeta', mapping: 'numtarjeta'},
            {name: 'importe', mapping: 'importe'},
            {name: 'chip', mapping: 'chip'},
            {name: 'estado', mapping: 'estado'},
            // {name: 'idmovimiento', mapping: 'idmovimiento', defaultValue: -1}//pa modificar las recargas porque con eso lo hacen
        ]);

        this.recordTarjetas = new Ext.data.Record.create([
            {
                name: 'idtarjeta'
            }, {
                name: 'numero'
            }
        ]);

        this.recordCuentas = new Ext.data.Record.create([
            {
                name: 'idcuenta'
            }, {
                name: 'text', mapping: 'nomcuenta'
            }
        ]);

    },
    initializeReaders: function () {

        this.rdPersona = new Ext.data.JsonReader({
                root: 'data',
                totalProperty: 'total'
            },
            this.recordPersona
        );
        this.rdOperacion = new Ext.data.JsonReader({
                root: 'data',
                totalProperty: 'total'
            },
            this.recordOperacion
        );

        this.rdGridRecarga = new Ext.data.JsonReader({
                // root: 'datos',
                // totalProperty: 'cantidad_filas'
            },
            this.recordGridRecarga
        );

        this.rdCbTarjetas = new Ext.data.JsonReader({
                // root: 'datos',
                // totalProperty: 'cantidad_filas'
            },
            this.recordTarjetas
        );

        this.rdCbCuenta = new Ext.data.JsonReader({
                // root: 'datos',
                // totalProperty: 'cantidad_filas'
            },
            this.recordCuentas
        );

    },
    initializeStores: function () {

        this.stPersona = new Ext.data.Store({
            // url: 'cargarpersonas',
            url: '/contabilidad/caja/tarjetas/index.php/tarjetas/cargarpersonas',
            sortInfo: {
                field: 'nombre',
                direction: "ASC"
            },
            reader: this.rdPersona,
            autoLoad: false
        });

        this.stOperacion = new Ext.data.Store({
            // url: 'cargarOperaciones',
            url: 'cargarOperaciones',
            method: 'POST',
            reader: this.rdOperacion,
            autoLoad: false
        });

        this.stGridRecarga = new Ext.data.Store({
            url: 'cargarDatosRecargaFincimex',
            method: 'POST',
            reader: this.rdGridRecarga,
            autoLoad: false
        });

        this.stTarjetas = new Ext.data.Store({
            url: 'cargarDatosTarjetaSistema',
            method: 'POST',
            reader: this.rdCbTarjetas,
            baseParams: {
                idcaja: this.idcaja
            },
            autoLoad: true
        });

        this.stCbCuenta = new Ext.data.Store({
            url: '',
            method: 'POST',
            reader: this.rdCbCuenta,
            autoLoad: false
        });

    },
    initializeGetFn: function () {

        this.getStoreAnticipo = function () {
            return this.stGridAnticipo;
        };
        this.getStorePersona = function () {
            return this.stPersona;
        };
        this.getStoreOperacion = function () {
            return this.stOperacion;
        };
        this.getStoreGridRecarga = function () {
            return this.stGridRecarga;
        };
        this.getStoreCbCuenta = function () {
            return this.stCbCuenta;
        };
        this.getRecordGridRecarga = function () {
            return this.recordGridRecarga;
        };

    },
    initializeAjaxCalls: function () {

        this.cargarOperacionYCuentas = function (parametrosAdicionales, callbackFunction) {
            var parametros = {
                method: "POST",
                url: "cargarOperaciones",
                callback: callbackFunction //options, success, response
            };
            this.ajaxCall(parametros, parametrosAdicionales);
        };

        this.saveRecargas = function (parametrosAdicionales, callbackFunction) {
            var parametros = {
                method: "POST",
                url: "saveRecargas",
                callback: callbackFunction //options, success, response
            };
            this.ajaxCall(parametros, parametrosAdicionales);
        };

        this.cargarDatosTarjetaObligacionById = function (parametrosAdicionales, callbackFunction) {
            var parametros = {
                method: "POST",
                url: "cargarDatosTarjetaObligacionById",
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
