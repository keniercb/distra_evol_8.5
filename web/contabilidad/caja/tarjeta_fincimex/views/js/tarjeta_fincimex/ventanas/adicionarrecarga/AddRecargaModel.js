Ext.namespace('Ext.GestionarTarjetaAddRecarga');
Ext.GestionarTarjetaAddRecarga.Model = Ext.extend(Ext.Component, {
    tipoDuo: undefined,
    constructor: function(params)
    {
        this.initializeModel();
        Ext.GestionarTarjetaAddRecarga.Model.superclass.constructor.call(this);
    },
    initializeModel: function () {
        this.initializeRecords();
        this.initializeReaders();
        this.initializeStores();
        this.initializeGetFn();
    },
    initializeRecords: function () {

        this.recordGridAnticipo = new Ext.data.Record.create([
            {name: 'idanticipo'},
            {name: 'numerodocumento'},
            {name: 'fechacreacion'},
            {name: 'importemo'},
            {name: 'pendiente'}
        ]);

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

        this.recordGridRecargaFincimex = new Ext.data.Record.create([
            {name: 'idsync', mapping: 'idsync'},//de aka tengo los id tarjeta de los dos
            {name: 'idtarjeta', mapping: 'idtarjeta'},
            {name: 'idoperaciontarjeta', mapping: 'idoperaciontarjeta'},//una tabla que va a tener una relacion con el idsync y las recargas
            {name: 'idoperacionrecarga', mapping: 'idoperacionrecarga'},
            {name: 'numtarjetafincimex', mapping: 'numtarjetafincimex'},
            {name: 'fechacaducidadfincimex', mapping: 'fechacaducidadfincimex'},
            {name: 'fecha', mapping: 'fecha'},
            {name: 'importefincimex', mapping: 'importe'},
            {name: 'chip', mapping: 'chip'},
            {name: 'idmovimiento', mapping: 'idmovimiento', defaultValue: -1}//pa modificar las recargas porque con eso lo hacen
        ]);

    },
    initializeReaders: function () {

        this.rdGridAnticipo = new Ext.data.JsonReader({
                // root: 'datos',
                // totalProperty: 'cantidad_filas'
            },
            this.recordGridAnticipo
        );

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

        this.rdGridRecargaFincimex = new Ext.data.JsonReader({
                // root: 'datos',
                // totalProperty: 'cantidad_filas'
            },
            this.recordGridRecargaFincimex
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
            url: '/contabilidad/caja/tarjetas/index.php/tarjetas/cargarOperaciones',
            method: 'POST',
            reader: this.rdOperacion,
            autoLoad: false
        });

        this.stGridAnticipo = new Ext.data.Store({
            reader: this.rdGridAnticipo
        });

        this.stGridRecargaFincimex = new Ext.data.Store({
            url: 'cargarDatosRecargaFincimex',
            method: 'POST',
            reader: this.rdGridRecargaFincimex,
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
        this.getStoreGridRecargaFincimex = function () {
            return this.stGridRecargaFincimex;
        };
        this.getRecordGridRecargaFincimex = function () {
            return this.recordGridRecargaFincimex;
        };

    }
});
