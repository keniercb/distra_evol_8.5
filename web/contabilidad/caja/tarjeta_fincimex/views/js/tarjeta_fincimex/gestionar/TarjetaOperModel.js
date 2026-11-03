Ext.namespace('Ext.GestionarTarjetaOper');
Ext.GestionarTarjetaOper.Model = Ext.extend(Ext.Component, {
    tipoDuo: undefined,
    constructor: function(params)
    {
        this.initializeModel();
        Ext.GestionarTarjetaOper.Model.superclass.constructor.call(this);
    },
    initializeModel: function () {
        this.initializeRecords();
        this.initializeReaders();
        this.initializeStores();
        this.initializeGetFn();
    },
    initializeRecords: function () {

        this.recordGridRecarga = new Ext.data.Record.create([
            {name: 'idrecargafincimex', mapping: 'idoperaciontarjeta'},
            {name: 'idpersona', mapping: 'responsable'},
            {name: 'nombrecompleto', mapping: 'nombrecompleto'},
            {name: 'estado', mapping: 'estado'},
            {name: 'idcomprobante', mapping: 'idcomprobante'},
            {name: 'fechacontable', mapping: 'fechacontable'},
            {name: 'fechasistema', mapping: 'fechasistema'},
            {name: 'idanticipo', mapping: 'idanticipo'},
            {name: 'idoperacion', mapping: 'idoperacion'},
            {name: 'numcomprobante', mapping: 'numcomprobante'},
            {name: 'showCmp', mapping: 'showCmp'}
        ]);

        this.recordGridAnticipoLiquidacion = new Ext.data.Record.create([
            {name: 'idantliqfincimex', mapping: 'idoperaciontarjeta'},
            {name: 'idanticipo', mapping: 'idanticipotarjeta'},//id de anticipos de tarjeta
            {name: 'idliquidacion', mapping: 'idliquidacion'},//id liquidaciones de anticipo de tarjeta
            {name: 'idpersona', mapping: 'responsable'},
            {name: 'nombrecompleto', mapping: 'nombrecompleto'},
            {name: 'estado', mapping: 'estado'},
            {name: 'idcomprobante', mapping: 'idcomprobante'},
            {name: 'fechacontable', mapping: 'fechacontable'},
            {name: 'fechasistema', mapping: 'fechasistema'},
            {name: 'idoperacion', mapping: 'idoperacion'},
            {name: 'numcomprobante', mapping: 'numcomprobante'},
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

        this.rdGridAnticipoLiquidacion = new Ext.data.JsonReader({
                root: 'datos',
                totalProperty: 'cantidad_filas'
            },
            this.recordGridAnticipoLiquidacion
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

    },
    initializeStores: function () {

        this.stGridRecarga = new Ext.data.Store({
            url: 'cargarRecargaFincimex',
            reader: this.rdGridRecarga,
            autoLoad: false
        });

        this.stGridAnticipoLiquidacion = new Ext.data.Store({
            url: 'cargarAnticipoLiquidacionFincimex',
            reader: this.rdGridAnticipoLiquidacion,
            autoLoad: false
        });

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
    initializeGetFn: function () {

        this.getStoreRecarga = function () {
            return this.stGridRecarga;
        };

        this.getStoreAnticipoLiquidacion = function () {
            return this.stGridAnticipoLiquidacion;
        };
        this.getStoreProveedor = function () {
            return this.stProveedor;
        };
        this.getStoreCuentaProveedor = function () {
            return this.stCuentaProveedor;
        };

    }
});
