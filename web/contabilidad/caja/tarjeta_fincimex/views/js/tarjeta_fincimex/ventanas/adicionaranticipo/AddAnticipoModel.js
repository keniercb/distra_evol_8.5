Ext.namespace('Ext.GestionarTarjetaAddAnt');
Ext.GestionarTarjetaAddAnt.Model = Ext.extend(Ext.Component, {
    tipoDuo: undefined,
    constructor: function(params)
    {
        this.initializeModel();
        Ext.GestionarTarjetaAddAnt.Model.superclass.constructor.call(this);
    },
    initializeModel: function () {
        this.initializeRecords();
        this.initializeReaders();
        this.initializeStores();
        this.initializeGetFn();
    },
    initializeRecords: function () {

        this.recordOperacion = new Ext.data.Record.create([
            {name: 'idnomoperaciones'},
            {name: 'denominacion'}
        ]);

        this.recordPersona = new Ext.data.Record.create([
            {name: 'idpersona'},
            {name: 'nombre'},
            {name: 'numid'},
            {name: 'cargo'}
        ]);

        this.recordGridAnticipoFincimex = new Ext.data.Record.create([
            {name: 'idsync', mapping: 'idsync'},
            {name: 'idtarjeta', mapping: 'idtarjeta'},
            {name: 'idoperaciontarjeta', mapping: 'idoperaciontarjeta'},//una tabla que va a tener una relacion con el idsync y las recargas
            {name: 'numerotarjeta', mapping: 'numero'},
            {name: 'idpersona', mapping: 'idpersona'},
            {name: 'nompersona', mapping: 'nompersona'},
            {name: 'saldodisponible', mapping: 'saldomo'},
            {name: 'fechavence', mapping: 'fechavence'},
            {name: 'preciocombustible', mapping: 'preciocombustible', type: 'float'},
            {name: 'nomcombustible', mapping: 'nomcombustible'},
            {name: 'importe', mapping: 'importe', type: 'float', defaultValue: 0},
            {name: 'fechaentrega', mapping: 'fechaentrega'},
            {name: 'idmovimiento', mapping: 'idmovimiento', defaultValue: -1}//pa modificar los anticipos porque con eso lo hacen
        ]);

    },
    initializeReaders: function () {

        this.rdOperacion = new Ext.data.JsonReader({
                root: 'data',
                totalProperty: 'cantidad_filas'
            },
            this.recordOperacion
        );

        this.rdPersona = new Ext.data.JsonReader({
                root: 'data',
                totalProperty: 'total'
            },
            this.recordPersona
        );

        this.rdGridAnticipoFincimex = new Ext.data.JsonReader({
                // root: 'data',
                totalProperty: 'total'
            },
            this.recordGridAnticipoFincimex
        );

    },
    initializeStores: function () {

        this.stOperacion = new Ext.data.Store({
            url: '/contabilidad/caja/tarjetas/index.php/anticipos/cargarOperaciones',
            reader: this.rdOperacion,
            autoLoad: false,
        });

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

        this.stGridAnticipoFincimex = new Ext.data.Store({
            url: 'cargarDatosAnticipoFincimex',
            method: 'POST',
            reader: this.rdGridAnticipoFincimex,
            autoLoad: false
        });

    },
    initializeGetFn: function () {

        this.getStoreOperacion = function () {
            return this.stOperacion;
        };

        this.getStorePersona = function () {
            return this.stPersona;
        };

        this.getStoreGridAnticipoFincimex = function () {
            return this.stGridAnticipoFincimex;
        };

        this.getRecordGridAnticipoFincimex = function () {
            return this.recordGridAnticipoFincimex;
        };

    }
});
