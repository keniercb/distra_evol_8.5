Ext.namespace('Ext.GestionarTarjetaOperSync');
Ext.GestionarTarjetaOperSync.Model = Ext.extend(Ext.Component, {
    tipoDuo: undefined,
    constructor: function(params)
    {
        this.initializeModel();
        Ext.GestionarTarjetaOperSync.Model.superclass.constructor.call(this);
    },
    initializeModel: function () {
        this.initializeRecords();
        this.initializeReaders();
        this.initializeStores();
        this.initializeGetFn();
    },
    initializeRecords: function () {

        this.recordGridSync = new Ext.data.Record.create([
            {name: 'idtarjetafincimex', mapping: 'idtarjetafincimex'},
            {name: 'numtarjetafincimex', mapping: 'numtarjetafincimex'},
            {name: 'fechacaducidadfincimex', mapping: 'fechacaducidadfincimex'},
            {name: 'idtarjetasistema', mapping: 'idtarjeta'},
            {name: 'numtarjetasistema', mapping: 'numero'},
            {name: 'fechacaducidadsistema', mapping: 'fechavence'},
            {name: 'idsync', mapping: 'idsync'}
        ]);

        this.recordGridSistema = new Ext.data.Record.create([
            {name: 'idtarjetasistema', mapping: 'idtarjeta'},
            {name: 'numtarjetasistema', mapping: 'numero'},
            {name: 'fechacaducidadsistema', mapping: 'fechavence'}
        ]);

        this.recordGridFincimex = new Ext.data.Record.create([
            {name: 'idtarjetafincimex', mapping: 'idtarjetafincimex'},
            {name: 'numtarjetafincimex', mapping: 'numtarjetafincimex'},
            {name: 'fechacaducidadfincimex', mapping: 'fechacaducidadfincimex'}
        ]);

    },
    initializeReaders: function () {

        this.rdGridSync = new Ext.data.JsonReader({
                // root: 'datos',
                // totalProperty: 'cantidad_filas'
            },
            this.recordGridSync
        );

        this.rdGridSistema = new Ext.data.JsonReader({
                // root: 'datos',
                // totalProperty: 'cantidad_filas'
            },
            this.recordGridSistema
        );

        this.rdGridFincimex = new Ext.data.JsonReader({
                root: 'datos',
                // totalProperty: 'cantidad_filas'
            },
            this.recordGridFincimex
        );

    },
    initializeStores: function () {

        this.stGridSync = new Ext.data.Store({
            url: 'cargarDatosTarjetaSync',
            reader: this.rdGridSync,
            autoLoad: false
        });

        this.stGridSistema = new Ext.data.Store({
            url: 'cargarDatosTarjetaSistema',
            reader: this.rdGridSistema,
            autoLoad: false
        });

        this.stGridFincimex = new Ext.data.Store({
            url: 'cargarDatosTarjetaFincimex',
            reader: this.rdGridFincimex,
            autoLoad: false
        });

    },
    initializeGetFn: function () {

        this.getStSync = function () {
            return this.stGridSync;
        };

        this.getStSistema = function () {
            return this.stGridSistema;
        };

        this.getStFincimex = function () {
            return this.stGridFincimex;
        };

    }
});
