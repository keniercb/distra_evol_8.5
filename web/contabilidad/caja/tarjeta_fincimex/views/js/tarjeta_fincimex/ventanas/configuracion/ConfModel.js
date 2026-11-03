Ext.namespace('Ext.GestionarTarjetaOperConf');
Ext.GestionarTarjetaOperConf.Model = Ext.extend(Ext.Component, {
    tipoDuo: undefined,
    constructor: function(params)
    {
        this.initializeModel();
        Ext.GestionarTarjetaOperConf.Model.superclass.constructor.call(this);
    },
    initializeModel: function () {
        this.initializeRecords();
        this.initializeReaders();
        this.initializeStores();
        this.initializeGetFn();
    },
    initializeRecords: function () {

        // this.recordGridRecarga = new Ext.data.Record.create([
        //     {name: 'idanticipo'}
        // ]);

    },
    initializeReaders: function () {

        // this.rdGridRecarga = new Ext.data.JsonReader({
        //         root: 'datos',
        //         totalProperty: 'cantidad_filas'
        //     },
        //     this.recordGridRecarga
        // );

    },
    initializeStores: function () {

        // this.stGridRecarga = new Ext.data.Store({
        //     url: 'cargaranticipos',
        //     reader: this.rdGridRecarga,
        //     autoLoad: false
        // });

    },
    initializeGetFn: function () {

        // this.getStoreRecarga = function () {
        //     return this.stGridRecarga;
        // };

    }
});
